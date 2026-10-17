#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllFieldEventSecretBaseOthersBasePc";
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
  check(argv.length === 0 || (argv.length === 2 && argv[0] === "--report" &&
    typeof argv[1] === "string" && argv[1].length > 0 && !argv[1].includes("\0")),
  "usage: validate-cro-dll-field-event-secret-base-others-base-pc.mjs [--report <path>]");
  return argv.length === 0 ? DEFAULT_REPORT_PATH : resolve(argv[1]);
}

function validatePublicContract() {
  const config = readJson(CONFIG_PATH, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  check(!config.units.some((entry) => entry?.name === UNIT),
    `${UNIT} must remain absent from the source registry without an approved implementation handoff`);

  const expectedInventory = [
    "# Format,CRO_FUNCTIONS_V1",
    `# Module,${REPORT_UNIT}`,
    "# TextSize,00001D70",
    "Location,Name,Namespace,Mode,Size,Segment",
    "",
  ].join("\n");
  check(readText(INVENTORY_PATH, `${UNIT} inventory`) === expectedInventory,
    "public inventory must retain its exact header and zero accepted function rows");

  const partition = readJson(PARTITION_PATH, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 7536,
    "partition identity or text size changed");
  const groups = [
    ["functions", 0, 0, ""],
    ["gaps", 76, 6908, "address,mode,size"],
    ["pools", 75, 508, "address,size"],
    ["unknown", 3, 120, "address,size"],
  ];
  for (const [name, count, bytes, schema] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
    check(partition[name].every((entry) => Object.keys(entry).sort().join(",") === schema),
      `partition ${name} entry schema changed`);
  }
  check(partition.gaps.every((entry) => entry.mode === "arm"),
    "partition executable-gap modes changed");

  const intervals = groups.flatMap(([name]) => partition[name].map((entry) => ({
    address: entry.address,
    size: entry.size,
  }))).sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(Number.isSafeInteger(interval.address) && Number.isSafeInteger(interval.size) &&
      interval.address >= 0 && interval.size > 0, "partition contains an invalid interval");
    check(interval.address === cursor, "partition no longer covers text exactly without overlap");
    cursor += interval.size;
  }
  check(cursor === partition.textSize, "partition does not cover the complete text segment");

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  exactKeys(manifest, "schemaVersion,target,unitCount,units", "public CRO manifest");
  check(manifest.schemaVersion === 1 && manifest.target === "AS_EUR_REV2" &&
    Number.isSafeInteger(manifest.unitCount) && manifest.unitCount === manifest.units?.length,
  "public CRO manifest identity or accounting changed");
  const units = manifest.units.filter((entry) => entry?.name === REPORT_UNIT);
  check(units.length === 1, `public CRO manifest must contain exactly one ${REPORT_UNIT} unit`);
  exactKeys(units[0], "name,sha256,size", `${REPORT_UNIT} manifest entry`);
  check(units[0].name === REPORT_UNIT && units[0].size === 16384 &&
    typeof units[0].sha256 === "string" && /^[0-9a-f]{64}$/u.test(units[0].sha256),
  "public unit identity or whole-file size changed");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  exactKeys(unit, "measures,metadata,name,sections", "report unit");
  exactKeys(unit.metadata, "complete", "report metadata");
  check(unit.metadata.complete === false && !("source_path" in unit.metadata),
    "report completion metadata is not fail-closed");

  exactKeys(unit.measures,
    "complete_code_percent,fuzzy_match_percent,matched_code_percent,matched_functions_percent,total_data,total_units",
    "report measures");
  check(unit.measures.fuzzy_match_percent === 0 && unit.measures.matched_code_percent === 0 &&
    unit.measures.matched_functions_percent === 0 && unit.measures.complete_code_percent === 0 &&
    unit.measures.total_data === "892" && unit.measures.total_units === 1,
  "report accounting changed or unexpected code/function credit appeared");

  const expectedSections = [
    [".bss", "40"],
    [".data", "4"],
    [".pool", "508"],
    [".rodata", "340"],
    [".text", "6908"],
  ];
  check(Array.isArray(unit.sections) && unit.sections.length === expectedSections.length,
    "report section inventory changed");
  for (let index = 0; index < expectedSections.length; index += 1) {
    const section = unit.sections[index];
    exactKeys(section, "metadata,name,size", `report section ${index}`);
    const [name, size] = expectedSections[index];
    check(section.name === name && section.size === size && section.metadata !== null &&
      Object.keys(section.metadata).length === 0, `report ${name} accounting or metadata changed`);
  }
  check(expectedSections.slice(0, 4).reduce((sum, [, size]) => sum + Number(size), 0) ===
    Number(unit.measures.total_data), "report data sections do not reconcile with total_data");
}

try {
  const reportPath = reportPathFromArguments(process.argv.slice(2));
  validatePublicContract();
  validateReport(reportPath);
  console.log(`Validated ${REPORT_UNIT}: zero accepted functions and zero code/function credit; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
