#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllContest";
const REPORT_UNIT = `cro/${UNIT}`;
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;
const CLAIMS = [
  { name: "func_00012AD8", address: 0x12ad8, size: 8, semantics: "store-u8", offset: 217 },
  { name: "func_00012C58", address: 0x12c58, size: 16, semantics: "pod-zero-word-byte" },
];

function fail(message) { throw new Error(`CRO ${UNIT} validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}
function readJson(path, label) {
  check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  check(statSync(path).size <= MAX_INPUT_SIZE, `${label} exceeds the input limit`);
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { fail(`${label} is not valid JSON: ${error.message}`); }
}
function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: MAX_INPUT_SIZE });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}
function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--target", "--readelf", "--objdiff", "--report"].includes(option) && value !== undefined,
      "usage: validate-cro-dll-contest.mjs [--object <path> --readelf <path>] " +
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
  for (const [label, path] of Object.entries(result))
    check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  return result;
}

function validatePublicContract() {
  const config = readJson(CONFIG_PATH, "CRO source config");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  const matches = config.units.filter((entry) => entry?.name === UNIT);
  check(matches.length === 1, `config must contain exactly one ${UNIT}`);
  const unit = matches[0];
  exactKeys(unit, "functions,name,sources", UNIT);
  check(JSON.stringify(unit.sources) === JSON.stringify([
    { path: "src/cro/DllContest.c", mode: "arm" },
    { path: "src/cro/DllContest/pod_leaves.S", mode: "arm" },
  ]), `${UNIT} source ownership changed`);
  check(JSON.stringify(unit.functions) === JSON.stringify(CLAIMS), `${UNIT} reviewed claims changed`);

  const inventory = readFileSync(INVENTORY_PATH, "utf8").split(/\r?\n/u);
  check(inventory[0] === "# Format,CRO_FUNCTIONS_V1" && inventory[1] === "# Module,cro/DllContest" &&
    inventory[2] === "# TextSize,00013268", "public inventory header changed");
  const rows = inventory.filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === 52, "public inventory must contain exactly 52 accepted functions");
  for (const claim of CLAIMS) {
    const row = `${claim.address.toString(16).toUpperCase().padStart(8, "0")},"${claim.name}","Global",$a,` +
      `${claim.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(rows.filter((line) => line === row).length === 1, `public inventory lacks ${claim.name}`);
  }

  const partition = readJson(PARTITION_PATH, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 78440,
    "partition identity or text size changed");
  const groups = [
    ["functions", 52, 14080], ["gaps", 309, 58880], ["pools", 333, 3560], ["unknown", 13, 1920],
  ];
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count, `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
  }
  const intervals = groups.flatMap(([name]) => partition[name].map(({ address, size }) => ({ address, size })))
    .sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(Number.isSafeInteger(interval.address) && Number.isSafeInteger(interval.size) && interval.size > 0,
      "partition contains an invalid interval");
    check(interval.address === cursor, "partition no longer covers text exactly without overlap");
    cursor += interval.size;
  }
  check(cursor === partition.textSize, "partition does not cover the complete text segment");
  for (const claim of CLAIMS)
    check(partition.functions.some((entry) => entry.name === claim.name && entry.address === claim.address &&
      entry.size === claim.size && entry.mode === "arm"), `partition lacks ${claim.name}`);

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  const publicUnits = manifest.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(publicUnits.length === 1 && publicUnits[0].size === 106496 &&
    /^[0-9a-f]{64}$/u.test(publicUnits[0].sha256), "public unit identity or whole-file size changed");
}

function relocationCount(output) {
  return output.split("\n").filter((line) => /^\s*[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+/u.test(line)).length;
}
function validateObject(object, readelf) {
  const sections = run(readelf, ["--sections", "--wide", object]);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const allocated = sections.split("\n").filter((line) => /^\s*\[\s*\d+\]/u.test(line) &&
    /\sA(?:X|W|I|L|M|S|G|T|C|E|o|p|x)*\s+/u.test(line));
  check(allocated.length === CLAIMS.length, "authored object contains unowned allocated payload");
  for (const claim of CLAIMS) {
    const section = `.text.${claim.name}`;
    const sectionLines = allocated.filter((line) => line.includes(section));
    const size = claim.size.toString(16).padStart(6, "0");
    check(sectionLines.length === 1 && new RegExp(`PROGBITS\\s+\\S+\\s+\\S+\\s+${size}\\s+\\S+\\s+AX\\s`, "iu").test(sectionLines[0]),
      `${claim.name} executable section is invalid`);
    const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${claim.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 && new RegExp(`00000000\\s+${claim.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${claim.name}$`, "u").test(symbolLines[0].trim()),
      `${claim.name} symbol is invalid`);
  }
  check(relocationCount(relocations) === 0, "authored object unexpectedly contains relocations");
}

function validateObjdiff(target, object, objdiff) {
  for (const claim of CLAIMS) {
    const output = run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", claim.name]);
    let report;
    try { report = JSON.parse(output); } catch { fail("objdiff did not emit JSON"); }
    const left = report?.left?.symbols?.filter((symbol) => symbol.name === claim.name) ?? [];
    const right = report?.right?.symbols?.filter((symbol) => symbol.name === claim.name) ?? [];
    check(left.length === 1 && right.length === 1, `objdiff did not resolve ${claim.name} exactly once per side`);
    check(left[0].size === String(claim.size) && right[0].size === String(claim.size) &&
      left[0].match_percent === 100 && right[0].match_percent === 100,
    `objdiff does not report an exact match for ${claim.name}`);
  }
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  check(unit.metadata?.complete === false && unit.metadata?.source_path === "src/cro/DllContest",
    "report completion metadata is not fail-closed");
  check(unit.measures?.total_code === "14080" && unit.measures?.matched_code === "24" &&
    unit.measures?.total_data === "9784" && unit.measures?.total_functions === 52 &&
    unit.measures?.matched_functions === 2, "report accounting changed");
  check(Array.isArray(unit.functions) && unit.functions.length === 52, "report function inventory changed");
  const exact = unit.functions.filter((entry) => entry.fuzzy_match_percent === 100)
    .map((entry) => `${entry.name}:${entry.size}`).sort();
  const expected = CLAIMS.map((claim) => `${claim.name}:${claim.size}`).sort();
  const partial = unit.functions.filter((entry) => typeof entry.fuzzy_match_percent === "number" &&
    entry.fuzzy_match_percent !== 100);
  check(exact.length === expected.length && exact.every((entry, index) => entry === expected[index]) && partial.length === 0,
    "report no longer contains exactly the two reviewed matches");
  const expectedSections = new Map([
    [".text", "72960"], [".pool", "3560"], [".rodata", "4900"], [".data", "912"], [".bss", "412"],
  ]);
  for (const [name, size] of expectedSections)
    check(unit.sections?.filter((entry) => entry.name === name && entry.size === size).length === 1,
      `report ${name} accounting changed`);
}

try {
  const options = parseArguments(process.argv.slice(2));
  validatePublicContract();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.target) validateObjdiff(options.target, options.object, options.objdiff);
  if (options.report) validateReport(options.report);
  console.log(`Validated ${REPORT_UNIT}: 2/52 functions and 24/14080 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
