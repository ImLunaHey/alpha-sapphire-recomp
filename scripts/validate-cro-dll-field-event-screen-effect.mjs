#!/usr/bin/env node

import { lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllFieldEventScreenEffect";
const REPORT_UNIT = `cro/${UNIT}`;
const MAX_INPUT_SIZE = 64 * 1024 * 1024;

function fail(message) {
  throw new Error(`CRO ${UNIT} validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function readRegularFile(path, label) {
  let details;
  try {
    details = lstatSync(path);
  } catch (error) {
    fail(`${label} is unavailable: ${error.message}`);
  }
  check(details.isFile() && !details.isSymbolicLink(), `${label} is not a regular owned file`);
  check(statSync(path).size <= MAX_INPUT_SIZE, `${label} exceeds the input-size limit`);
  return readFileSync(path, "utf8");
}

function readJson(path, label) {
  try {
    return JSON.parse(readRegularFile(path, label));
  } catch (error) {
    if (error.message.startsWith(`CRO ${UNIT} validation:`)) throw error;
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function exactKeys(value, keys, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value), `${label} is not an object`);
  check(Object.keys(value).sort().join(",") === [...keys].sort().join(","), `${label} schema changed`);
}

function validateManifest() {
  const manifest = readJson(join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json"), "public CRO manifest");
  const units = manifest.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `manifest must contain exactly one ${REPORT_UNIT} unit`);
  check(units[0].size === 12288, "published container size changed");
  check(typeof units[0].sha256 === "string" && /^[0-9a-f]{64}$/u.test(units[0].sha256),
    "published unit identity is malformed");
}

function validateInventory() {
  const inventory = readRegularFile(join(ROOT, "symbols", "cro", `${UNIT}.csv`), "neutral function inventory");
  const lines = inventory.trimEnd().split(/\r?\n/u);
  check(lines[0] === "# Format,CRO_FUNCTIONS_V1", "inventory format changed");
  check(lines[1] === `# Module,${REPORT_UNIT}`, "inventory module changed");
  check(lines[2] === "# TextSize,00000850", "inventory text extent changed");
  check(lines[3] === "Location,Name,Namespace,Mode,Size,Segment", "inventory columns changed");
  check(lines.length === 4, "inventory must remain free of accepted function boundaries");
}

function validatePartition() {
  const partition = readJson(join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`), "text partition");
  exactKeys(partition, ["format", "module", "textSize", "functions", "gaps", "pools", "unknown"],
    "text partition");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 2128,
    "partition identity or text extent changed");
  check(Array.isArray(partition.functions) && partition.functions.length === 0,
    "partition must remain free of accepted functions");

  const expected = new Map([
    ["gaps", [37, 1840]],
    ["pools", [37, 224]],
    ["unknown", [2, 64]],
  ]);
  const intervals = [];
  for (const [name, [count, bytes]] of expected) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte total changed`);
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
}

function validateSourceRegistry() {
  const registry = readJson(join(ROOT, "config", "cro-sources.json"), "CRO source registry");
  check(Array.isArray(registry.units), "CRO source registry lacks a units array");
  check(!registry.units.some((entry) => entry?.name === UNIT),
    "blocked unit unexpectedly has an authored-source claim");
}

function validateReport() {
  const report = readJson(join(ROOT, "progress", "reports", "AS_EUR_REV2", "report.json"),
    "checked-in objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  check(unit.metadata?.complete === false && unit.metadata.source_path === undefined,
    "report completion or source ownership is not fail-closed");
  check(!Array.isArray(unit.functions) || unit.functions.length === 0,
    "report unexpectedly credits an accepted function");
  check(unit.measures?.fuzzy_match_percent === 0 && unit.measures?.matched_code_percent === 0 &&
    unit.measures?.matched_functions_percent === 0 && unit.measures?.complete_code_percent === 0 &&
    unit.measures?.total_data === "316" && unit.measures?.total_units === 1,
  "report measures no longer describe the blocked zero-credit unit");

  const sections = new Map(unit.sections?.map((entry) => [entry.name, entry.size]));
  const expected = new Map([
    [".text", "1840"],
    [".pool", "224"],
    [".rodata", "72"],
    [".data", "4"],
    [".bss", "16"],
  ]);
  check(sections.size === expected.size, "report section set changed");
  for (const [name, size] of expected) {
    check(sections.get(name) === size, `report ${name} accounting changed`);
  }
}

try {
  validateManifest();
  validateInventory();
  validatePartition();
  validateSourceRegistry();
  validateReport();
  console.log(`Validated ${REPORT_UNIT}: zero accepted functions, zero match credit, completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
