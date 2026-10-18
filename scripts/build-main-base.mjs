#!/usr/bin/env node

import { readdir, readFile, mkdir, rename, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { concurrency, mapConcurrent, resolveArmTools, run, toolEnvironment } from "./build-support.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = join(ROOT, "src", "main");
const OUTPUT_ROOT = join(ROOT, "build", "AS_EUR_REV2", "base");
const OUTPUT = join(OUTPUT_ROOT, "code.o");

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && [".c", ".S"].includes(extname(entry.name)) ? [path] : [];
  }));
  return nested.flat().sort();
}

function compilerArguments(source, object, mode) {
  const modeFlag = mode === "arm" ? "-marm" : "-mthumb";
  if (source.endsWith(".c")) {
    return ["-std=c11", "-Os", "-march=armv6k", "-mcpu=mpcore", modeFlag, "-mfloat-abi=soft",
      "-ffreestanding", "-fno-builtin", "-fno-common", "-fomit-frame-pointer", "-fno-unwind-tables",
      "-fno-asynchronous-unwind-tables", "-fno-stack-protector", "-fno-pic", "-fno-pie", "-fno-ident",
      "-ffunction-sections", "-fdata-sections", "-Wa,--noexecstack", "-Wall", "-Wextra", "-Werror",
      "-c", source, "-o", object];
  }
  return ["-march=armv6k", "-mcpu=mpcore", modeFlag, "-mfloat-abi=soft", "-ffreestanding", "-fno-pic", "-fno-pie",
    "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c", source, "-o", object];
}

async function main() {
  const [tools, config, sources] = await Promise.all([
    resolveArmTools(ROOT),
    readFile(join(ROOT, "config", "sources.json"), "utf8").then(JSON.parse),
    sourceFiles(SOURCE_ROOT),
  ]);
  if (sources.length === 0) throw new Error("No clean-room C or assembly sources were found.");
  const modes = new Map(config.sources.map(({ path, mode }) => [path, mode]));
  const stage = join(OUTPUT_ROOT, `.main-stage-${process.pid}`);
  const objectRoot = join(stage, "objects");
  const objects = sources.map((source) => join(objectRoot, `${relative(join(ROOT, "src"), source).slice(0, -extname(source).length)}.o`));
  await mkdir(objectRoot, { recursive: true });
  try {
    await mapConcurrent(sources, concurrency(), async (source, index) => {
      const repositoryPath = relative(ROOT, source);
      const mode = modes.get(repositoryPath);
      if (mode !== "arm" && mode !== "thumb") throw new Error(`Missing or invalid instruction mode for ${repositoryPath} in config/sources.json`);
      const object = objects[index];
      await mkdir(dirname(object), { recursive: true });
      await run(tools.compiler, compilerArguments(source, object, mode), { cwd: ROOT, env: toolEnvironment(tools) });
      if (repositoryPath === "src/main/thumb_leaf_helpers_27.S") {
        await run(tools.objcopy, ["--set-section-alignment", ".text.func_00100134=2", object], { cwd: ROOT });
      }
    });
    await run(tools.linker, ["-r", "-o", join(stage, "code.o"), ...objects], { cwd: ROOT });
    const oldObjects = join(OUTPUT_ROOT, "objects");
    if (existsSync(oldObjects)) await rm(oldObjects, { recursive: true });
    await rename(objectRoot, oldObjects);
    await rename(join(stage, "code.o"), OUTPUT);
    await rm(stage, { recursive: true });
  } catch (error) {
    if (existsSync(stage)) await rm(stage, { recursive: true });
    throw error;
  }
  console.log(`Built ${sources.length} clean-room source object(s) into ${OUTPUT}`);
}

main().catch((error) => {
  console.error(`Main base build: ${error.message}`);
  process.exitCode = 1;
});
