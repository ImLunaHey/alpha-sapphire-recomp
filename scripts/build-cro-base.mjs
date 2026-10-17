#!/usr/bin/env node

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG = join(ROOT, "config", "cro-sources.json");
const OUTPUT = join(ROOT, "build", "AS_EUR_REV2", "base", "cro-code");
const SOURCE_KEYS = "mode,path";
const UNIT_KEYS = "functions,name,sources";

function fail(message) {
  throw new Error(`CRO base build: ${message}`);
}

function exactKeys(value, expected, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).sort().join(",") !== expected) {
    fail(`${label} has an invalid schema`);
  }
}

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, stdio: "inherit" });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}`);
}

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index];
    const value = argv[index + 1];
    if (!["--compiler", "--linker", "--objcopy"].includes(option) || value === undefined) fail("usage: build-cro-base.mjs --compiler <path> --linker <path> --objcopy <path>");
    values[option.slice(2)] = resolve(value);
  }
  if (!values.compiler || !values.linker || !values.objcopy) fail("--compiler, --linker, and --objcopy are required");
  for (const [label, path] of Object.entries(values)) {
    if (!existsSync(path) || !statSync(path).isFile()) fail(`${label} is not a regular executable file`);
  }
  return values;
}

function readConfig() {
  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG, "utf8"));
  } catch (error) {
    fail(`cannot read config/cro-sources.json: ${error.message}`);
  }
  exactKeys(config, "schemaVersion,units", "config");
  if (config.schemaVersion !== 1 || !Array.isArray(config.units) || config.units.length === 0) fail("config is empty or has an unsupported version");
  const names = new Set();
  const sourcePaths = new Set();
  let previous = "";
  for (const [unitIndex, unit] of config.units.entries()) {
    exactKeys(unit, UNIT_KEYS, `unit ${unitIndex}`);
    if (typeof unit.name !== "string" || !/^Dll[A-Za-z0-9_]+$/u.test(unit.name) || unit.name <= previous || names.has(unit.name)) {
      fail(`unit ${unitIndex} has an invalid, duplicate, or unsorted name`);
    }
    previous = unit.name;
    names.add(unit.name);
    if (!Array.isArray(unit.sources) || unit.sources.length === 0 || unit.sources.length > 256) fail(`${unit.name} has an invalid source list`);
    if (!Array.isArray(unit.functions) || unit.functions.length === 0) fail(`${unit.name} has no claimed functions`);
    for (const [sourceIndex, source] of unit.sources.entries()) {
      exactKeys(source, SOURCE_KEYS, `${unit.name} source ${sourceIndex}`);
      if (source.mode !== "arm" && source.mode !== "thumb") fail(`${unit.name} source ${sourceIndex} has an invalid mode`);
      if (typeof source.path !== "string" || !/^src\/cro\/Dll[A-Za-z0-9_]+\/[A-Za-z0-9_.-]+\.(?:c|S)$/u.test(source.path)) {
        // A one-file unit may also use src/cro/DllName.c.
        if (typeof source.path !== "string" || !/^src\/cro\/Dll[A-Za-z0-9_]+\.(?:c|S)$/u.test(source.path)) {
          fail(`${unit.name} source ${sourceIndex} has an invalid repository path`);
        }
      }
      if (!source.path.startsWith(`src/cro/${unit.name}`) || sourcePaths.has(source.path)) fail(`${unit.name} source ${sourceIndex} is duplicated or belongs to another unit`);
      sourcePaths.add(source.path);
      const path = resolve(ROOT, source.path);
      if (!inside(ROOT, path) || !existsSync(path) || !lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) fail(`${source.path} is not a regular repository file`);
      if (lstatSync(path).size > 1024 * 1024) fail(`${source.path} exceeds the source-size limit`);
    }
  }
  return config;
}

function compilerArguments(source, output) {
  const mode = source.mode === "arm" ? "-marm" : "-mthumb";
  const common = ["-march=armv6k", "-mcpu=mpcore", mode, "-mfloat-abi=soft", "-ffreestanding", "-fno-pic", "-fno-pie", "-Wa,--noexecstack"];
  if (source.path.endsWith(".c")) {
    return ["-std=c11", "-Os", ...common, "-fno-builtin", "-fno-common", "-fomit-frame-pointer", "-fno-unwind-tables",
      "-fno-asynchronous-unwind-tables", "-fno-stack-protector", "-fno-ident", "-ffunction-sections", "-fdata-sections",
      "-Wall", "-Wextra", "-Werror", "-c", resolve(ROOT, source.path), "-o", output];
  }
  return [...common, "-x", "assembler-with-cpp", "-c", resolve(ROOT, source.path), "-o", output];
}

function main() {
  const tools = parseArguments(process.argv.slice(2));
  const config = readConfig();
  const parent = dirname(OUTPUT);
  mkdirSync(parent, { recursive: true });
  const ignored = spawnSync("git", ["check-ignore", "--quiet", "--no-index", "--", relative(ROOT, OUTPUT)], { cwd: ROOT });
  if (ignored.status !== 0) fail("output directory is not ignored by Git");
  const stage = `${OUTPUT}.stage-${process.pid}`;
  const backup = `${OUTPUT}.backup-${process.pid}`;
  if (existsSync(stage) || existsSync(backup)) fail("staging or backup path already exists");
  mkdirSync(stage, { recursive: false, mode: 0o700 });
  try {
    for (const unit of config.units) {
      const objectDirectory = join(stage, ".objects", unit.name);
      mkdirSync(objectDirectory, { recursive: true });
      const objects = [];
      for (const [index, source] of unit.sources.entries()) {
        const object = join(objectDirectory, `${index}.o`);
        run(tools.compiler, compilerArguments(source, object));
        objects.push(object);
      }
      const output = join(stage, `${unit.name}.o`);
      run(tools.linker, ["-r", "-o", output, ...objects]);
      // Keep only authored executable sections and their symbols. Empty GCC
      // bookkeeping sections can otherwise look like matching target data to
      // comparison tools even though no data was reconstructed.
      const removable = ["--remove-section=.text", "--remove-section=.bss", "--remove-section=.sdata", "--remove-section=.sbss",
        "--remove-section=.note.GNU-stack", "--remove-section=.ARM.attributes"];
      // DllContestCommon's neutral contract includes an exact selector table
      // and one writable pointer.  Other partial units continue to discard
      // compiler-created generic data so they cannot gain accidental credit.
      if (unit.name !== "DllContestCommon") removable.push("--remove-section=.rodata", "--remove-section=.data");
      run(tools.objcopy, [...removable, output]);
    }
    rmSync(join(stage, ".objects"), { recursive: true });
    if (existsSync(OUTPUT)) renameSync(OUTPUT, backup);
    try {
      renameSync(stage, OUTPUT);
    } catch (error) {
      if (existsSync(backup)) renameSync(backup, OUTPUT);
      throw error;
    }
    if (existsSync(backup)) rmSync(backup, { recursive: true });
  } catch (error) {
    if (existsSync(stage)) rmSync(stage, { recursive: true });
    throw error;
  }
  console.log(`Built ${config.units.length} clean-room CRO base unit(s) into ${OUTPUT}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
