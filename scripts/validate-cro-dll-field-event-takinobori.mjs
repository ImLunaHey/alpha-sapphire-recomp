#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllFieldEventTakinobori";
const REPORT_UNIT = `cro/${UNIT}`;
const SOURCE_PATH = join(ROOT, "src", "cro", `${UNIT}.c`);
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const DEFAULT_REPORT_PATH = join(ROOT, "progress", "reports", "AS_EUR_REV2", "report.json");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;

const expectedFunctions = [
  [0x1368, 116, 5864],
  [0x1904, 1496, 5980],
  [0x1efc, 8, 7476],
];

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

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function readText(path, label) {
  check(inside(ROOT, path) && existsSync(path) && lstatSync(path).isFile() &&
    !lstatSync(path).isSymbolicLink() && realpathSync(path) === path,
  `${label} is not an owned regular file`);
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
    "usage: validate-cro-dll-field-event-takinobori.mjs [--report <path>]");
  return argv.length === 0 ? DEFAULT_REPORT_PATH : resolve(argv[1]);
}

function validatePublicContract() {
  const config = readJson(CONFIG_PATH, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  const units = config.units.filter((entry) => entry?.name === UNIT);
  check(units.length === 1, `${UNIT} must have exactly one source-registry entry`);
  const unit = units[0];
  exactKeys(unit, "functions,name,sources", `${UNIT} source-registry entry`);
  check(Array.isArray(unit.sources) && unit.sources.length === 1 &&
    unit.sources[0]?.path === `src/cro/${UNIT}.c` && unit.sources[0]?.mode === "arm" &&
    Object.keys(unit.sources[0]).sort().join(",") === "mode,path",
  `${UNIT} source ownership changed`);
  check(Array.isArray(unit.functions) && unit.functions.length === 1,
    `${UNIT} must claim only the approved leaf`);
  const claimed = unit.functions[0];
  exactKeys(claimed, "address,name,offset,semantics,size", `${UNIT} claimed function`);
  check(claimed.name === "func_00001EFC" && claimed.address === 0x1efc && claimed.size === 8 &&
    claimed.semantics === "store-u8" && claimed.offset === 217,
  `${UNIT} approved leaf contract changed`);

  const normalizedSource = readText(SOURCE_PATH, `${UNIT} source`).replace(/\s+/gu, " ").trim();
  check(normalizedSource ===
    "#include <stdint.h> void func_00001EFC(uint8_t *base, uint8_t value) { base[217] = value; }",
  `${UNIT} source no longer contains exactly the approved implementation`);

  const inventory = readText(INVENTORY_PATH, `${UNIT} inventory`).split(/\r?\n/u);
  check(inventory[0] === "# Format,CRO_FUNCTIONS_V1" && inventory[1] === `# Module,${REPORT_UNIT}` &&
    inventory[2] === "# TextSize,00002068" &&
    inventory[3] === "Location,Name,Namespace,Mode,Size,Segment",
  "public inventory header changed");
  const rows = inventory.filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === expectedFunctions.length,
    "public inventory must contain exactly three accepted functions");
  for (let index = 0; index < expectedFunctions.length; index += 1) {
    const [address, size] = expectedFunctions[index];
    const hexAddress = address.toString(16).toUpperCase().padStart(8, "0");
    const name = `func_${hexAddress}`;
    check(rows[index] === `${hexAddress},"${name}","Global",$a,${size.toString(16).toUpperCase().padStart(8, "0")},".text"`,
      "public accepted function boundaries changed");
  }

  const partition = readJson(PARTITION_PATH, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 8296,
    "partition identity or text size changed");
  const groups = [
    ["functions", 3, 1620],
    ["gaps", 83, 5864],
    ["pools", 86, 632],
    ["unknown", 4, 180],
  ];
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
  }
  check(partition.functions.every((fn, index) => {
    const [address, size] = expectedFunctions[index];
    return fn.name === `func_${address.toString(16).toUpperCase().padStart(8, "0")}` &&
      fn.address === address && fn.size === size && fn.mode === "arm" &&
      Object.keys(fn).sort().join(",") === "address,mode,name,size";
  }), "partition accepted function boundaries changed");

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
  exactKeys(manifest, "schemaVersion,target,unitCount,units", "public CRO manifest");
  check(manifest.schemaVersion === 1 && manifest.target === "AS_EUR_REV2" &&
    Array.isArray(manifest.units), "public CRO manifest identity changed");
  const manifestUnits = manifest.units.filter((entry) => entry?.name === REPORT_UNIT);
  check(manifestUnits.length === 1 && manifestUnits[0].size === 20480 &&
    typeof manifestUnits[0].sha256 === "string" && /^[0-9a-f]{64}$/u.test(manifestUnits[0].sha256) &&
    Object.keys(manifestUnits[0]).sort().join(",") === "name,sha256,size",
  "public unit identity or whole-file size changed");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  exactKeys(unit, "functions,measures,metadata,name,sections", "report unit");
  exactKeys(unit.metadata, "complete,source_path", "report metadata");
  check(unit.metadata.complete === false && unit.metadata.source_path === `src/cro/${UNIT}.c`,
    "report completion or source metadata changed");

  exactKeys(unit.measures,
    "fuzzy_match_percent,matched_code,matched_code_percent,matched_functions,matched_functions_percent,total_code,total_data,total_functions,total_units",
    "report measures");
  check(unit.measures.total_code === "1620" && unit.measures.matched_code === "8" &&
    unit.measures.total_data === "948" && unit.measures.total_functions === 3 &&
    unit.measures.matched_functions === 1 && unit.measures.total_units === 1,
  "report accounting changed or unexpected match credit appeared");

  const expectedSections = new Map([
    [".bss", "76"],
    [".data", "4"],
    [".pool", "632"],
    [".rodata", "236"],
    [".text", "7484"],
  ]);
  check(Array.isArray(unit.sections) && unit.sections.length === expectedSections.size,
    "report section inventory changed");
  for (const section of unit.sections) {
    exactKeys(section, "metadata,name,size", `report section ${section.name}`);
    check(expectedSections.get(section.name) === section.size &&
      section.metadata !== null && Object.keys(section.metadata).length === 0,
    `report ${section.name} accounting or metadata changed`);
  }

  check(Array.isArray(unit.functions) && unit.functions.length === expectedFunctions.length,
    "report function inventory changed");
  for (let index = 0; index < expectedFunctions.length; index += 1) {
    const [address, size, reportAddress] = expectedFunctions[index];
    const fn = unit.functions[index];
    const name = `func_${address.toString(16).toUpperCase().padStart(8, "0")}`;
    exactKeys(fn, address === 0x1efc ? "address,fuzzy_match_percent,metadata,name,size" :
      "address,metadata,name,size", `report function ${name}`);
    check(fn.name === name && fn.address === String(reportAddress) && fn.size === String(size),
      `report function ${name} changed`);
    check(fn.metadata !== null && Object.keys(fn.metadata).length === 0,
      `report function ${name} metadata changed`);
    check((address === 0x1efc && fn.fuzzy_match_percent === 100) ||
      (address !== 0x1efc && !("fuzzy_match_percent" in fn)),
    `report function ${name} match credit changed`);
  }
}

try {
  const reportPath = reportPathFromArguments(process.argv.slice(2));
  validatePublicContract();
  validateReport(reportPath);
  console.log(`Validated ${REPORT_UNIT}: 1/3 functions and 8/1620 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
