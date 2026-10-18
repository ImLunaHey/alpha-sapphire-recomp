#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllBag";
const REPORT_UNIT = `cro/${UNIT}`;
const FUNCTION = "func_00014254";
const SECTION = `.text.${FUNCTION}`;
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const SOURCE_PATH = join(ROOT, "src", "cro", `${UNIT}.c`);
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const MAX_JSON_SIZE = 64 * 1024 * 1024;

function fail(message) {
  throw new Error(`CRO ${UNIT} validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}

function readJson(path, label) {
  check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  check(statSync(path).size <= MAX_JSON_SIZE, `${label} exceeds the 64 MiB input limit`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: MAX_JSON_SIZE });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index];
    const value = argv[index + 1];
    check(["--object", "--target", "--readelf", "--objdiff", "--report"].includes(option) && value !== undefined,
      "usage: validate-cro-dll-bag.mjs [--object <path> --readelf <path>] " +
      "[--target <path> --objdiff <path>] [--report <path>]");
    const key = option.slice(2);
    check(result[key] === undefined, `${option} was supplied more than once`);
    result[key] = resolve(value);
  }
  check((result.object === undefined) === (result.readelf === undefined),
    "--object and --readelf must be supplied together");
  check((result.target === undefined) === (result.objdiff === undefined),
    "--target and --objdiff must be supplied together");
  check(result.target === undefined || result.object !== undefined,
    "authoritative comparison also requires --object and --readelf");
  for (const [label, path] of Object.entries(result)) {
    check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  }
  return result;
}

function validatePublicContract() {
  const config = readJson(CONFIG_PATH, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  const unit = config.units.find((entry) => entry?.name === UNIT);
  check(unit !== undefined, `config lacks ${UNIT}`);
  exactKeys(unit, "functions,name,sources", UNIT);
  check(unit.sources.length === 1, `${UNIT} must have one source`);
  exactKeys(unit.sources[0], "mode,path", `${UNIT} source`);
  check(unit.sources[0].path === "src/cro/DllBag.c" && unit.sources[0].mode === "arm",
    `${UNIT} source identity is invalid`);
  check(unit.functions.length === 1, `${UNIT} must claim one function`);
  const fn = unit.functions[0];
  exactKeys(fn, "address,name,offset,semantics,size", `${UNIT} function`);
  check(fn.name === FUNCTION && fn.address === 0x14254 && fn.size === 8 &&
    fn.semantics === "store-u8" && fn.offset === 217, `${UNIT} function contract is invalid`);

  const source = readFileSync(SOURCE_PATH, "utf8");
  check(!/\b(?:asm|__asm__|__attribute__)\b/u.test(source), "source uses an opaque compiler escape hatch");
  const normalized = source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "").replace(/\s+/gu, " ").trim();
  check(normalized === "#include <stdint.h> void func_00014254(uint8_t *base, uint8_t value) { base[217] = value; }",
    "source no longer expresses the reviewed byte-store semantics");

  const inventory = readFileSync(INVENTORY_PATH, "utf8").split(/\r?\n/u);
  check(inventory[0] === "# Format,CRO_FUNCTIONS_V1" && inventory[1] === "# Module,cro/DllBag" &&
    inventory[2] === "# TextSize,00014434", "public inventory header changed");
  const rows = inventory.filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === 65, "public inventory must contain exactly 65 accepted functions");
  check(rows.filter((line) => line === '00014254,"func_00014254","Global",$a,00000008,".text"').length === 1,
    "public inventory lacks the reviewed function boundary");

  const partition = readJson(PARTITION_PATH, "DllBag partition");
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", "DllBag partition");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 82996,
    "partition identity or text size changed");
  const groups = [
    ["functions", 65, 20152],
    ["gaps", 508, 58532],
    ["pools", 520, 4220],
    ["unknown", 7, 92],
  ];
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
  }
  const intervals = groups.flatMap(([name]) => partition[name].map((entry) => ({ address: entry.address, size: entry.size })))
    .sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(Number.isSafeInteger(interval.address) && Number.isSafeInteger(interval.size) && interval.size > 0,
      "partition contains an invalid interval");
    check(interval.address === cursor, "partition no longer covers text exactly without overlap");
    cursor += interval.size;
  }
  check(cursor === partition.textSize, "partition does not cover the complete text segment");
  check(partition.functions.some((entry) => entry.name === FUNCTION && entry.address === 0x14254 &&
    entry.size === 8 && entry.mode === "arm"), "partition lacks the reviewed function");

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  const publicUnit = manifest.units?.find((entry) => entry?.name === REPORT_UNIT);
  check(publicUnit?.size === 106496 && typeof publicUnit.sha256 === "string" && /^[0-9a-f]{64}$/u.test(publicUnit.sha256),
    "public unit identity or whole-file size changed");
}

function relocationCount(output) {
  return output.split("\n").filter((line) => /^\s*[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+/u.test(line)).length;
}

function validateObject(object, readelf) {
  const sections = run(readelf, ["--sections", "--wide", object]);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const sectionLines = sections.split("\n").filter((line) => line.includes(SECTION));
  check(sectionLines.length === 1 && /PROGBITS\s+\S+\s+\S+\s+000008\s+\S+\s+AX\s/u.test(sectionLines[0]),
    "authored executable section is not an 8-byte AX PROGBITS section");
  const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${FUNCTION}$`, "u").test(line.trimEnd()));
  check(symbolLines.length === 1 && /00000000\s+8\s+FUNC\s+GLOBAL\s+DEFAULT\s+\d+\s+func_00014254$/u.test(symbolLines[0].trim()),
    "authored function symbol is invalid");
  check(relocationCount(relocations) === 0, "authored object unexpectedly contains relocations");
  const allocated = sections.split("\n").filter((line) => /^\s*\[\s*\d+\]/u.test(line) &&
    /\sA(?:X|W|I|L|M|S|G|T|C|E|o|p|x)*\s+/u.test(line));
  check(allocated.length === 1 && allocated[0].includes(SECTION),
    "authored object contains unowned allocated code or data");
}

function validateObjdiff(target, object, readelf, objdiff) {
  const targetRelocations = relocationCount(run(readelf, ["--relocs", "--wide", target]));
  check(targetRelocations === 1062, "target split relocation aggregate changed");
  const output = run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", FUNCTION]);
  let report;
  try {
    report = JSON.parse(output);
  } catch {
    fail("objdiff did not emit JSON");
  }
  const left = report?.left?.symbols?.filter((symbol) => symbol.name === FUNCTION) ?? [];
  const right = report?.right?.symbols?.filter((symbol) => symbol.name === FUNCTION) ?? [];
  check(left.length === 1 && right.length === 1, "objdiff did not resolve exactly one function on each side");
  check(left[0].size === "8" && right[0].size === "8" &&
    left[0].match_percent === 100 && right[0].match_percent === 100,
    "objdiff does not report an exact 8-byte function match");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, "report must contain exactly one cro/DllBag unit");
  const unit = units[0];
  check(unit.metadata?.complete === false && unit.metadata?.source_path === "src/cro/DllBag.c",
    "report completion metadata is not fail-closed");
  check(unit.measures?.total_code === "20152" && unit.measures?.matched_code === "8" &&
    unit.measures?.total_data === "7724" && unit.measures?.total_functions === 65 &&
    unit.measures?.matched_functions === 1, "report accounting changed");
  check(Array.isArray(unit.functions) && unit.functions.length === 65, "report function inventory changed");
  const exact = unit.functions.filter((entry) => entry.fuzzy_match_percent === 100);
  const partial = unit.functions.filter((entry) => typeof entry.fuzzy_match_percent === "number" &&
    entry.fuzzy_match_percent !== 100);
  check(exact.length === 1 && exact[0].name === FUNCTION && exact[0].size === "8" && partial.length === 0,
    "report no longer contains exactly the reviewed 8-byte match");
  const expectedSections = new Map([[".text", "78684"], [".pool", "4220"], [".rodata", "3424"],
    [".data", "4"], [".bss", "76"]]);
  for (const [name, size] of expectedSections) {
    check(unit.sections?.filter((entry) => entry.name === name && entry.size === size).length === 1,
      `report ${name} accounting changed`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validatePublicContract();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.target) validateObjdiff(options.target, options.object, options.readelf, options.objdiff);
  if (options.report) validateReport(options.report);
  console.log(`Validated ${REPORT_UNIT}: 1/65 functions and 8/20152 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
