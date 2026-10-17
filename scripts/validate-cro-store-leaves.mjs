#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const FUNCTION_KEYS = "address,name,offset,semantics,size";
const SOURCE_KEYS = "mode,path";
const UNIT_KEYS = "functions,name,sources";
const QUARANTINED_UNITS = ["DllGift", "DllHologramMail", "DllPssFavorite", "DllPssMessageWindow", "DllShinkaDemo"];
const QUARANTINED_PATHS = ["src/cro/DllGift.c", "src/cro/DllGift/pod_leaves.S",
  "src/cro/DllHologramMail.c", "src/cro/DllPssFavorite.c",
  "src/cro/DllPssMessageWindow.c", "src/cro/DllShinkaDemo.c"];

function fail(message) {
  throw new Error(`CRO store-leaf validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-store-leaves.mjs [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : "readelf";
    check(result[key] === undefined, `${option} was supplied more than once`);
    result[key] = resolve(value);
  }
  check((result.objectDirectory === undefined) === (result.readelf === undefined),
    "--object-directory and --readelf must be supplied together");
  if (result.objectDirectory !== undefined) {
    check(existsSync(result.objectDirectory) && statSync(result.objectDirectory).isDirectory(),
      "object directory is not a directory");
    check(existsSync(result.readelf) && statSync(result.readelf).isFile(), "readelf is not a regular file");
  }
  return result;
}

function readAndValidateContract() {
  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    fail(`cannot read config/cro-sources.json: ${error.message}`);
  }
  exactKeys(config, "schemaVersion,units", "config");
  check(config.schemaVersion === 1 && Array.isArray(config.units) && config.units.length > 0,
    "config version or units are invalid");
  check(!config.units.some((unit) => QUARANTINED_UNITS.includes(unit?.name)),
    `${QUARANTINED_UNITS.join(", ")} must remain absent from authored CRO claims`);
  check(!config.units.some((unit) => Array.isArray(unit?.sources) &&
    unit.sources.some((source) => QUARANTINED_PATHS.includes(source?.path))),
  `${QUARANTINED_UNITS.join(", ")} quarantined source paths must remain unclaimed`);
  check(QUARANTINED_PATHS.every((path) => !existsSync(resolve(ROOT, path))),
    `${QUARANTINED_UNITS.join(", ")} quarantined source files must remain absent`);

  let previousUnit = "";
  const names = new Set();
  let storeCount = 0;
  for (const [index, unit] of config.units.entries()) {
    exactKeys(unit, UNIT_KEYS, `unit ${index}`);
    check(typeof unit.name === "string" && /^Dll[A-Za-z0-9_]+$/u.test(unit.name) &&
      unit.name > previousUnit && !names.has(unit.name), `unit ${index} has an invalid, duplicate, or unsorted name`);
    previousUnit = unit.name;
    names.add(unit.name);
    check(Array.isArray(unit.sources) && unit.sources.length > 0, `${unit.name} must own at least one source`);
    check(Array.isArray(unit.functions) && unit.functions.length > 0, `${unit.name} must claim at least one function`);

    const source = unit.sources.find((entry) => entry.path === `src/cro/${unit.name}.c`);
    const storeFunctions = unit.functions.filter((fn) => fn.semantics === "store-u8");
    check(storeFunctions.length <= 1, `${unit.name} claims multiple store-u8 functions`);
    if (storeFunctions.length === 0) continue;
    storeCount++;
    check(source !== undefined, `${unit.name} store source is missing`);
    exactKeys(source, SOURCE_KEYS, `${unit.name} source`);
    check(source.path === `src/cro/${unit.name}.c` && source.mode === "arm", `${unit.name} source identity is invalid`);
    const sourcePath = resolve(ROOT, source.path);
    check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() &&
      !lstatSync(sourcePath).isSymbolicLink(), `${source.path} is not a regular repository file`);

    const fn = storeFunctions[0];
    exactKeys(fn, FUNCTION_KEYS, `${unit.name} function`);
    check(typeof fn.name === "string" && /^func_[0-9A-F]{8}$/u.test(fn.name) &&
      Number.isSafeInteger(fn.address) && fn.address >= 0 && fn.address <= 0xFFFFFFFF &&
      fn.name === `func_${fn.address.toString(16).toUpperCase().padStart(8, "0")}` &&
      fn.size === 8 && fn.semantics === "store-u8" && fn.offset === 217,
    `${unit.name} function contract is invalid`);

    const inventoryPath = join(ROOT, "symbols", "cro", `${unit.name}.csv`);
    check(existsSync(inventoryPath) && lstatSync(inventoryPath).isFile() &&
      !lstatSync(inventoryPath).isSymbolicLink(), `${unit.name} public inventory is missing`);
    const lines = readFileSync(inventoryPath, "utf8").split(/\r?\n/u);
    const expectedRow = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,00000008,".text"`;
    check(lines.filter((line) => line === expectedRow).length === 1,
      `${unit.name} public inventory lacks the exact ARM function boundary`);
    check(lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${unit.name} public inventory has an ambiguous function name`);

    const text = readFileSync(sourcePath, "utf8");
    check(!/\b(?:asm|__asm__|__attribute__)\b/u.test(text), `${source.path} uses an opaque compiler escape hatch`);
    const normalized = text.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "").replace(/\s+/gu, " ").trim();
    check(normalized === `#include <stdint.h> void ${fn.name}(uint8_t *base, uint8_t value) { base[217] = value; }`,
      `${source.path} no longer expresses the reviewed byte-store semantics`);
  }
  check(storeCount === 47, `expected 47 store-u8 functions, found ${storeCount}`);
  return config;
}

function validateObject(unit, directory, readelf) {
  const fn = unit.functions.find((entry) => entry.semantics === "store-u8");
  const section = `.text.${fn.name}`;
  const object = join(directory, `${unit.name}.o`);
  check(existsSync(object) && lstatSync(object).isFile() && !lstatSync(object).isSymbolicLink(),
    `${unit.name} object is missing or not a regular file`);

  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    `${unit.name} is not a relocatable ARM ELF`);
  const sections = run(readelf, ["--sections", "--wide", object]);
  const sectionLines = sections.split("\n").filter((line) => line.includes(section));
  check(sectionLines.length === 1 && /PROGBITS\s+\S+\s+\S+\s+000008\s+\S+\s+AX\s/u.test(sectionLines[0]),
    `${unit.name} authored section is not an 8-byte AX PROGBITS section`);
  const allocated = sections.split("\n").filter((line) => /^\s*\[\s*\d+\]/u.test(line) &&
    /\sA(?:X|W|I|L|M|S|G|T|C|E|o|p|x)*\s+/u.test(line));
  check(allocated.filter((line) => line.includes(section)).length === 1,
    `${unit.name} store section is missing from allocated payload`);

  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
  check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+8\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolLines[0]),
    `${unit.name} authored function symbol is invalid`);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  check(/There are no relocations in this file\./u.test(relocations), `${unit.name} unexpectedly has relocations`);
  const hex = run(readelf, ["--hex-dump", section, object]);
  const words = [...hex.matchAll(/^\s*0x[0-9a-f]+\s+([0-9a-f]{8})\s+([0-9a-f]{8})/gimu)]
    .flatMap((match) => [match[1].toLowerCase(), match[2].toLowerCase()]);
  check(words.length === 2 && words[0] === "d910c0e5" && words[1] === "1eff2fe1",
    `${unit.name} instructions are not the reviewed store-byte and return sequence`);
}

try {
  const options = parseArguments(process.argv.slice(2));
  const config = readAndValidateContract();
  if (options.objectDirectory) {
    const expected = config.units.map((unit) => `${unit.name}.o`).sort();
    const actual = readdirSync(options.objectDirectory).filter((entry) => entry.endsWith(".o")).sort();
    check(actual.length === expected.length && actual.every((entry, index) => entry === expected[index]),
      `object directory contents differ from config (found ${actual.join(", ")})`);
    for (const unit of config.units) {
      if (unit.functions.some((fn) => fn.semantics === "store-u8")) validateObject(unit, options.objectDirectory, options.readelf);
    }
  }
  console.log(`Validated 47 independently authored 8-byte ARM store leaves${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
