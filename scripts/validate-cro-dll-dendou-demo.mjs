#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllDendouDemo";
const REPORT_UNIT = `cro/${UNIT}`;
const FUNCTION = "func_000022D4";
const SECTION = `.text.${FUNCTION}`;
const SOURCE_REPOSITORY_PATH = `src/cro/${UNIT}/contract_06.S`;
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const SOURCE_PATH = join(ROOT, SOURCE_REPOSITORY_PATH);
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;

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

function regularFile(path, label) {
  check(existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(),
    `${label} is not an owned regular file`);
  check(statSync(path).size <= MAX_INPUT_SIZE, `${label} exceeds the 64 MiB input limit`);
}

function executableFile(path, label) {
  check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
}

function readJson(path, label) {
  regularFile(path, label);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function run(executable, args) {
  const result = spawnSync(executable, args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: MAX_INPUT_SIZE,
  });
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
      "usage: validate-cro-dll-dendou-demo.mjs [--object <path> --readelf <path>] " +
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
    if (label === "readelf" || label === "objdiff") executableFile(path, label);
    else regularFile(path, label);
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
  check(unit.sources[0].path === SOURCE_REPOSITORY_PATH && unit.sources[0].mode === "arm",
    `${UNIT} source identity is invalid`);
  check(unit.functions.length === 1, `${UNIT} must claim one function`);
  const fn = unit.functions[0];
  exactKeys(fn, "address,name,semantics,size", `${UNIT} function`);
  check(fn.name === FUNCTION && fn.address === 0x22D4 && fn.size === 40 &&
    fn.semantics === "contract-06-float-vector-fill", `${UNIT} function contract is invalid`);

  regularFile(SOURCE_PATH, SOURCE_REPOSITORY_PATH);
  const source = readFileSync(SOURCE_PATH, "utf8");
  check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(source),
    "source contains encoded data or instructions");
  check((source.match(/^\.section \.text\.func_[0-9A-F]{8}, "ax", %progbits$/gmu) ?? []).length === 1,
    "source must define exactly one executable function section");
  for (const fragment of [`.section ${SECTION}, "ax", %progbits`, `.global ${FUNCTION}`,
    `.type ${FUNCTION}, %function`, `.size ${FUNCTION}, . - ${FUNCTION}`]) {
    check(source.split(fragment).length === 2, `source lacks one exact ${FUNCTION} declaration`);
  }

  regularFile(INVENTORY_PATH, `${UNIT} public inventory`);
  const inventory = readFileSync(INVENTORY_PATH, "utf8").split(/\r?\n/u);
  check(inventory[0] === "# Format,CRO_FUNCTIONS_V1" && inventory[1] === `# Module,${REPORT_UNIT}` &&
    inventory[2] === "# TextSize,00003BA0", "public inventory header changed");
  const rows = inventory.filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === 21, "public inventory must contain exactly 21 accepted functions");
  check(rows.filter((line) => line === '000022D4,"func_000022D4","Global",$a,00000028,".text"').length === 1,
    "public inventory lacks the reviewed function boundary");

  const partition = readJson(PARTITION_PATH, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 15264,
    "partition identity or text size changed");
  const groups = [
    ["functions", 21, 7684],
    ["gaps", 219, 6188],
    ["pools", 232, 1356],
    ["unknown", 3, 36],
  ];
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
  }
  const intervals = groups.flatMap(([name]) => partition[name].map((entry) => ({
    address: entry.address,
    size: entry.size,
  }))).sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(Number.isSafeInteger(interval.address) && Number.isSafeInteger(interval.size) && interval.size > 0,
      "partition contains an invalid interval");
    check(interval.address === cursor, "partition no longer covers text exactly without overlap");
    cursor += interval.size;
  }
  check(cursor === partition.textSize, "partition does not cover the complete text segment");
  check(partition.functions.filter((entry) => entry.name === FUNCTION && entry.address === 0x22D4 &&
    entry.size === 40 && entry.mode === "arm").length === 1, "partition lacks the reviewed function");

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  const publicUnits = manifest.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(publicUnits.length === 1 && publicUnits[0].size === 28672 &&
    typeof publicUnits[0].sha256 === "string" && /^[0-9a-f]{64}$/u.test(publicUnits[0].sha256),
  "public unit identity or whole-file size changed");
}

function relocationCount(output) {
  return output.split("\n").filter((line) => /^\s*[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+/u.test(line)).length;
}

function validateObject(object, readelf) {
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    "authored object is not a relocatable ARM ELF");
  const sections = run(readelf, ["--sections", "--wide", object]);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const allocated = sections.split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match && match[3].includes("A") && Number.parseInt(match[2], 16) !== 0
      ? [[match[1], Number.parseInt(match[2], 16), match[3]]] : [];
  });
  check(allocated.length === 1 && allocated[0][0] === SECTION && allocated[0][1] === 40 &&
    allocated[0][2].includes("X"), "authored object contains missing, adjacent, or non-executable allocated bytes");
  const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${FUNCTION}$`, "u").test(line.trimEnd()));
  check(symbolLines.length === 1 &&
    new RegExp(`^\\s*\\d+:\\s+00000000\\s+40\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${FUNCTION}$`, "u")
      .test(symbolLines[0]), "authored function symbol is invalid");
  check(relocationCount(relocations) === 0, "authored object unexpectedly contains relocations");
}

function validateObjdiff(target, object, objdiff) {
  let diff;
  try {
    diff = JSON.parse(run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", FUNCTION]));
  } catch (error) {
    fail(`objdiff did not emit valid JSON: ${error.message}`);
  }
  const left = diff?.left?.symbols?.filter((symbol) => symbol.name === FUNCTION) ?? [];
  const right = diff?.right?.symbols?.filter((symbol) => symbol.name === FUNCTION) ?? [];
  check(left.length === 1 && right.length === 1, "objdiff did not resolve exactly one function on each side");
  check(left[0].size === "40" && right[0].size === "40" &&
    left[0].match_percent === 100 && right[0].match_percent === 100,
  "objdiff does not report one exact 40-byte function match");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  check(unit.metadata?.complete === false && unit.metadata?.source_path === `src/cro/${UNIT}`,
    "report completion metadata is not fail-closed");
  check(unit.measures?.total_code === "7684" && unit.measures?.matched_code === "40" &&
    unit.measures?.total_data === "2644" && unit.measures?.total_functions === 21 &&
    unit.measures?.matched_functions === 1, "report accounting changed");
  check(Array.isArray(unit.functions) && unit.functions.length === 21,
    "report function inventory changed");
  const exact = unit.functions.filter((entry) => entry.fuzzy_match_percent === 100);
  const partial = unit.functions.filter((entry) => typeof entry.fuzzy_match_percent === "number" &&
    entry.fuzzy_match_percent !== 100);
  check(exact.length === 1 && exact[0].name === FUNCTION && exact[0].size === "40" && partial.length === 0,
    "report no longer contains exactly the reviewed 40-byte match");
  const expectedSections = new Map([
    [".text", "13872"],
    [".pool", "1356"],
    [".rodata", "904"],
    [".data", "44"],
    [".bss", "340"],
  ]);
  for (const [name, size] of expectedSections) {
    check(unit.sections?.filter((entry) => entry.name === name && entry.size === size).length === 1,
      `report ${name} accounting changed`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validatePublicContract();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.target) validateObjdiff(options.target, options.object, options.objdiff);
  if (options.report) validateReport(options.report);
  console.log(`Validated ${REPORT_UNIT}: 1/21 functions and 40/7684 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
