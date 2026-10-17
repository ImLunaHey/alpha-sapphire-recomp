#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllUSGymFighting";
const REPORT_UNIT = `cro/${UNIT}`;
const FUNCTION = "func_000006FC";
const FUNCTION_ADDRESS = 0x06FC;
const FUNCTION_SIZE = 152;
const SECTION = `.text.${FUNCTION}`;
const SOURCE_REPOSITORY_PATH = `src/cro/${UNIT}/contract_10.S`;
const SOURCE_PATH = join(ROOT, SOURCE_REPOSITORY_PATH);
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;
const EXPECTED_OBJECT_SHA256 = "76f0642a25e2f34de6494771eb8d024d1c8b555337e664763e36388a07a6d94d";

function fail(message) { throw new Error(`CRO ${UNIT} validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }

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
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--readelf", "--report"].includes(option) && value !== undefined,
      "usage: validate-cro-dll-us-gym-fighting.mjs [--object <path> --readelf <path>] [--report <path>]");
    const key = option.slice(2);
    check(options[key] === undefined, `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check((options.object === undefined) === (options.readelf === undefined),
    "--object and --readelf must be supplied together");
  for (const [label, path] of Object.entries(options)) {
    if (label === "readelf") executableFile(path, label);
    else regularFile(path, label);
  }
  return options;
}

function validatePublicContract() {
  const config = readJson(CONFIG_PATH, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  const units = config.units.filter((entry) => entry?.name === UNIT);
  check(units.length === 1, `config must contain exactly one ${UNIT}`);
  const unit = units[0];
  exactKeys(unit, "functions,name,sources", UNIT);
  check(unit.sources.length === 1 && unit.functions.length === 1,
    `${UNIT} must own one source and one accepted function`);
  exactKeys(unit.sources[0], "mode,path", `${UNIT} source`);
  check(unit.sources[0].path === SOURCE_REPOSITORY_PATH && unit.sources[0].mode === "arm",
    `${UNIT} source identity is invalid`);
  exactKeys(unit.functions[0], "address,name,semantics,size", `${UNIT} function`);
  const fn = unit.functions[0];
  check(fn.name === FUNCTION && fn.address === FUNCTION_ADDRESS && fn.size === FUNCTION_SIZE &&
    fn.semantics === "contract-10-gym-fighting-event", `${UNIT} function contract is invalid`);

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
  const inventory = readFileSync(INVENTORY_PATH, "utf8").trimEnd().split(/\r?\n/u);
  check(inventory.length === 5 && inventory[0] === "# Format,CRO_FUNCTIONS_V1" &&
    inventory[1] === `# Module,${REPORT_UNIT}` && inventory[2] === "# TextSize,00000BEC" &&
    inventory[3] === "Location,Name,Namespace,Mode,Size,Segment" &&
    inventory[4] === '000006FC,"func_000006FC","Global",$a,00000098,".text"',
  "public inventory no longer contains exactly the reviewed function boundary");

  const partition = readJson(PARTITION_PATH, `${UNIT} text partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 3052,
    "partition identity or text extent changed");
  const groups = [
    ["functions", 1, 152],
    ["gaps", 33, 2432],
    ["pools", 39, 280],
    ["unknown", 6, 188],
  ];
  const intervals = [];
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
    intervals.push(...partition[name]);
  }
  intervals.sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(Number.isSafeInteger(interval.address) && Number.isSafeInteger(interval.size) && interval.size > 0,
      "partition contains an invalid interval");
    check(interval.address === cursor, "partition no longer covers text exactly without overlap");
    cursor += interval.size;
  }
  check(cursor === partition.textSize, "partition does not cover the complete text extent");
  check(partition.functions.filter((entry) => entry.name === FUNCTION && entry.address === FUNCTION_ADDRESS &&
    entry.size === FUNCTION_SIZE && entry.mode === "arm").length === 1,
  "partition lacks the reviewed function boundary");

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  const published = manifest.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(published.length === 1 && published[0].size === 12288 &&
    published[0].sha256 === "eeb1f1f36caea3a79aa0fd458aae4360a08ca46c34fe099e8210a781706bae3a",
  "published unit identity changed");
}

function sectionBytes(readelf, object) {
  const groups = [];
  for (const line of run(readelf, ["--hex-dump", SECTION, object]).split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      groups.push(token);
    }
  }
  return Buffer.from(groups.join(""), "hex");
}

function validateObject(object, readelf) {
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    "authored object is not a relocatable ARM ELF");
  const sections = run(readelf, ["--sections", "--wide", object]);
  const allocated = sections.split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match && match[3].includes("A") && Number.parseInt(match[2], 16) !== 0
      ? [[match[1], Number.parseInt(match[2], 16), match[3]]] : [];
  });
  check(allocated.length === 1 && allocated[0][0] === SECTION && allocated[0][1] === FUNCTION_SIZE &&
    allocated[0][2].includes("X"), "authored object contains missing or adjacent allocated bytes");
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${FUNCTION}$`, "u").test(line.trimEnd()));
  check(symbolLines.length === 1 &&
    new RegExp(`^\\s*\\d+:\\s+00000000\\s+${FUNCTION_SIZE}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${FUNCTION}$`, "u")
      .test(symbolLines[0]), "authored function symbol is invalid");
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  check(/There are no relocations in this file\./u.test(relocations), "authored object unexpectedly has relocations");
  const bytes = sectionBytes(readelf, object);
  check(bytes.length === FUNCTION_SIZE && createHash("sha256").update(bytes).digest("hex") === EXPECTED_OBJECT_SHA256,
    "authored function bytes no longer match the approved contract");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  check(unit.metadata?.complete === false && unit.metadata?.source_path === `src/cro/${UNIT}`,
    "report completion metadata is not fail-closed");
  check(unit.measures?.total_code === "152" && unit.measures?.matched_code === "152" &&
    unit.measures?.matched_code_percent === 100 && unit.measures?.total_data === "728" &&
    unit.measures?.total_functions === 1 && unit.measures?.matched_functions === 1,
  "report accounting changed");
  check(Array.isArray(unit.functions) && unit.functions.length === 1 && unit.functions[0].name === FUNCTION &&
    unit.functions[0].size === "152" && unit.functions[0].address === "2432" &&
    unit.functions[0].fuzzy_match_percent === 100, "report no longer contains the reviewed exact match");
  const expectedSections = new Map([
    [".bss", "16"], [".data", "4"], [".pool", "280"], [".rodata", "428"], [".text", "2584"],
  ]);
  check(unit.sections?.length === expectedSections.size, "report section inventory changed");
  for (const [name, size] of expectedSections) {
    check(unit.sections.filter((entry) => entry.name === name && entry.size === size).length === 1,
      `report ${name} accounting changed`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validatePublicContract();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.report) validateReport(options.report);
  console.log(`Validated ${REPORT_UNIT}: 1/1 accepted functions and 152/152 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
