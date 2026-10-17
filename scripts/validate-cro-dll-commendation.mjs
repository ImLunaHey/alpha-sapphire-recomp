#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllCommendation";
const REPORT_UNIT = `cro/${UNIT}`;
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const DEFAULT_REPORT_PATH = join(ROOT, "progress", "reports", "AS_EUR_REV2", "report.json");
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

function readText(path, label) {
  check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  check(statSync(path).size <= MAX_INPUT_SIZE, `${label} exceeds the 64 MiB input limit`);
  return readFileSync(path, "utf8");
}

function readJson(path, label) {
  try {
    return JSON.parse(readText(path, label));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function reportPathFromArguments(argv) {
  check(argv.length === 0 || (argv.length === 2 && argv[0] === "--report"),
    "usage: validate-cro-dll-commendation.mjs [--report <path>]");
  return argv.length === 0 ? DEFAULT_REPORT_PATH : resolve(argv[1]);
}

function validatePublicContract() {
  const config = readJson(CONFIG_PATH, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  check(!config.units.some((entry) => entry?.name === UNIT),
    `${UNIT} must remain unclaimed without an approved implementation handoff`);

  const inventory = readText(INVENTORY_PATH, `${UNIT} inventory`).split(/\r?\n/u);
  check(inventory[0] === "# Format,CRO_FUNCTIONS_V1" && inventory[1] === `# Module,${REPORT_UNIT}` &&
    inventory[2] === "# TextSize,000011B8" && inventory[3] === "Location,Name,Namespace,Mode,Size,Segment",
  "public inventory header changed");
  const rows = inventory.filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === 2, "public inventory must contain exactly two accepted functions");
  check(rows[0] === '00000774,"func_00000774","Global",$a,00000198,".text"' &&
    rows[1] === '00000964,"func_00000964","Global",$a,000002FC,".text"',
  "public accepted function boundaries changed");

  const partition = readJson(PARTITION_PATH, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 4536,
    "partition identity or text size changed");
  const groups = [
    ["functions", 2, 1172],
    ["gaps", 75, 2912],
    ["pools", 76, 412],
    ["unknown", 1, 40],
  ];
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
  }
  check(partition.functions[0]?.name === "func_00000774" && partition.functions[0]?.address === 0x774 &&
    partition.functions[0]?.size === 408 && partition.functions[0]?.mode === "arm" &&
    partition.functions[1]?.name === "func_00000964" && partition.functions[1]?.address === 0x964 &&
    partition.functions[1]?.size === 764 && partition.functions[1]?.mode === "arm",
  "partition accepted function boundaries changed");

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

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  const units = manifest.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1 && units[0].size === 16384 && typeof units[0].sha256 === "string" &&
    /^[0-9a-f]{64}$/u.test(units[0].sha256), "public unit identity or whole-file size changed");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  exactKeys(unit.metadata, "complete", "report metadata");
  check(unit.metadata.complete === false, "report completion metadata is not fail-closed");

  exactKeys(unit.measures, "total_code,total_data,total_functions,total_units", "report measures");
  check(unit.measures.total_code === "1172" && unit.measures.total_data === "1068" &&
    unit.measures.total_functions === 2 && unit.measures.total_units === 1,
  "report accounting changed or unexpected match credit appeared");

  const expectedSections = new Map([
    [".bss", "16"],
    [".data", "4"],
    [".pool", "412"],
    [".rodata", "636"],
    [".text", "4084"],
  ]);
  check(Array.isArray(unit.sections) && unit.sections.length === expectedSections.size,
    "report section inventory changed");
  for (const section of unit.sections) {
    check(expectedSections.get(section.name) === section.size &&
      section.metadata !== null && Object.keys(section.metadata).length === 0,
    `report ${section.name} accounting or metadata changed`);
  }

  const expectedFunctions = new Map([
    ["func_00000774", { address: "2912", size: "408" }],
    ["func_00000964", { address: "3320", size: "764" }],
  ]);
  check(Array.isArray(unit.functions) && unit.functions.length === expectedFunctions.size,
    "report function inventory changed");
  for (const fn of unit.functions) {
    const expected = expectedFunctions.get(fn.name);
    exactKeys(fn, "address,metadata,name,size", `report function ${fn.name}`);
    check(expected?.address === fn.address && expected.size === fn.size &&
      fn.metadata !== null && Object.keys(fn.metadata).length === 0,
    `report function ${fn.name} changed or received match credit`);
  }
}

try {
  const reportPath = reportPathFromArguments(process.argv.slice(2));
  validatePublicContract();
  validateReport(reportPath);
  console.log(`Validated ${REPORT_UNIT}: 0/2 functions and 0/1172 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
