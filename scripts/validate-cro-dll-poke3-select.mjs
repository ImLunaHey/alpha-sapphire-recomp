#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(resolve(fileURLToPath(new URL("..", import.meta.url))));
const MAX_FILE_SIZE = 16 * 1024 * 1024;
const UNIT = "cro/DllPoke3Select";
const STEM = "DllPoke3Select";
const TARGET_SIZE = 45056;
const TARGET_SHA256 = "3e32bd9eaba44de96f06246ea9900c2ff7e8211ae55487d26b59bad98a94a3cb";
const QUARANTINE_SHA256 = "4ea43161318d8a757426537974af0d108c9fddb8b2ed802159de4e9ee5aa26e5";
const BLOCKER_COMMIT = "a1ee50288f7bda1ac801775f5fb00a5c6364a8e7";
const REJECTED = Object.freeze({
  name: "func_00002694",
  address: 0x2694,
  reportAddress: "17120",
  size: 68,
  mode: "arm",
});
const SOURCE = "src/cro/DllPoke3Select/contract_05.S";
const CSV_PATH = "symbols/cro/DllPoke3Select.csv";
const PARTITION_PATH = "symbols/cro-partitions/DllPoke3Select.json";
const CSV_SHA256 = "680958efc94b67d48e554a7bb9c344c8739c68fa04ac14f9ecb540dc690199fb";
const PARTITION_SHA256 = "5c500fc7077ebf98435dbf3271dbc9f56841812ada67558d0d693d070da96b31";
const TEXT_SIZE = 24424;
const CSV_FUNCTIONS = Object.freeze([
  ["func_000004F8", 0x4F8, "arm", 0x100, ".text"],
  ["func_00000B28", 0xB28, "arm", 0x22C, ".text"],
  ["func_00000EE0", 0xEE0, "arm", 0x184, ".text"],
  ["func_00001420", 0x1420, "arm", 0x290, ".text"],
  ["func_00001A70", 0x1A70, "arm", 0xF0, ".text"],
  ["func_00001B60", 0x1B60, "arm", 0x2A4, ".text"],
  ["func_00001FB0", 0x1FB0, "arm", 0x240, ".text"],
  ["func_0000220C", 0x220C, "arm", 0x1A4, ".text"],
  ["func_000023D8", 0x23D8, "arm", 0x108, ".text"],
  ["func_000024E4", 0x24E4, "arm", 0x90, ".text"],
  ["func_000025A8", 0x25A8, "arm", 0xEC, ".text"],
  ["func_00002694", 0x2694, "arm", 0x44, ".text"],
  ["func_000026D8", 0x26D8, "arm", 0x84, ".text"],
  ["func_00002770", 0x2770, "arm", 0x140, ".text"],
  ["func_000028C0", 0x28C0, "arm", 0xF4, ".text"],
  ["func_000029CC", 0x29CC, "arm", 0x2B4, ".text"],
  ["func_00002C8C", 0x2C8C, "arm", 0x8C, ".text"],
  ["func_00002E50", 0x2E50, "arm", 0x128, ".text"],
  ["func_00002F78", 0x2F78, "arm", 0x2D0, ".text"],
  ["func_000034B4", 0x34B4, "arm", 0x180, ".text"],
  ["func_00003634", 0x3634, "arm", 0x268, ".text"],
  ["func_00003A1C", 0x3A1C, "arm", 0x208, ".text"],
  ["func_00003FAC", 0x3FAC, "arm", 0x32C, ".text"],
]);
const PARTITION_CLASSIFICATIONS = Object.freeze({
  gaps: Object.freeze({ count: 198, sha256: "b0137be3c53e1a7d25accf5a6c9c1eb56f1c6a4ac0a57044363ba96858e1acf9" }),
  pools: Object.freeze({ count: 204, sha256: "2bdae5f9eaa35d47c507be9ddc74b0f845b429ee48e5ba0cc9bc456a8c6ab2a5" }),
  unknown: Object.freeze({ count: 1, sha256: "e490547caa5429ea5ae417d1b5677b38827b3005a6c1de3fb9aef6bf71a4dfbf" }),
});
const PERCENT_DECIMAL_TOLERANCE = 0.000005;
const REPORT_FUNCTIONS = Object.freeze([
  ["func_000004F8", "12708", "256"],
  ["func_00000B28", "12964", "556"],
  ["func_00000EE0", "13520", "388"],
  ["func_00001420", "13908", "656"],
  ["func_00001A70", "14564", "240"],
  ["func_00001B60", "14804", "676"],
  ["func_00001FB0", "15480", "576"],
  ["func_0000220C", "16056", "420"],
  ["func_000023D8", "16476", "264"],
  ["func_000024E4", "16740", "144"],
  ["func_000025A8", "16884", "236"],
  ["func_00002694", "17120", "68"],
  ["func_000026D8", "17188", "132"],
  ["func_00002770", "17320", "320"],
  ["func_000028C0", "17640", "244"],
  ["func_000029CC", "17884", "692"],
  ["func_00002C8C", "18576", "140"],
  ["func_00002E50", "18716", "296"],
  ["func_00002F78", "19012", "720"],
  ["func_000034B4", "19732", "384"],
  ["func_00003634", "20116", "616"],
  ["func_00003A1C", "20732", "520"],
  ["func_00003FAC", "21252", "812"],
]);

function fail(message) {
  throw new Error(`DllPoke3Select quarantine: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, keys, context) {
  check(value && typeof value === "object" && !Array.isArray(value), `${context} must be an object`);
  check(JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()),
    `${context} fields are not exact`);
}

function canonicalPath(root, relativePath, allowMissing = false) {
  check(typeof relativePath === "string" && relativePath.length > 0 && !isAbsolute(relativePath)
    && !relativePath.includes("\\") && relativePath.split("/").every((part) => part && part !== "." && part !== ".."),
  `noncanonical repository path ${String(relativePath)}`);
  const canonicalRoot = realpathSync(root);
  const candidate = resolve(canonicalRoot, relativePath);
  check(relative(canonicalRoot, candidate) !== ".."
    && !relative(canonicalRoot, candidate).startsWith(`..${sep}`), `path escapes repository ROOT: ${relativePath}`);
  const parts = relativePath.split("/");
  let cursor = canonicalRoot;
  for (let index = 0; index < parts.length; index++) {
    cursor = join(cursor, parts[index]);
    let stat;
    try { stat = lstatSync(cursor); } catch (error) {
      if (allowMissing && error?.code === "ENOENT") return candidate;
      throw error;
    }
    check(!stat.isSymbolicLink(), `${relativePath} traverses a symlink`);
    if (index < parts.length - 1) check(stat.isDirectory(), `${relativePath} has a non-directory parent`);
  }
  return candidate;
}

function sameFileSnapshot(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.size === right.size
    && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs;
}

function validateOpenStat(stat, relativePath) {
  check(stat.isFile() && stat.size > 0 && stat.size <= MAX_FILE_SIZE,
    `${relativePath} must be a bounded canonical regular file`);
}

function regularReadFlags(fsConstants = constants) {
  check(Number.isInteger(fsConstants.O_RDONLY), "O_RDONLY is unavailable");
  check(Number.isInteger(fsConstants.O_NOFOLLOW) && fsConstants.O_NOFOLLOW !== 0,
    "O_NOFOLLOW is unavailable or unsafe");
  const closeOnExec = Number.isInteger(fsConstants.O_CLOEXEC) ? fsConstants.O_CLOEXEC : 0;
  return fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW | closeOnExec;
}

function readRegular(root, relativePath, hooks = {}) {
  const path = canonicalPath(root, relativePath);
  const flags = regularReadFlags();
  let descriptor;
  try {
    descriptor = openSync(path, flags);
    const opened = fstatSync(descriptor);
    validateOpenStat(opened, relativePath);
    hooks.afterOpen?.({ descriptor, path });
    const before = fstatSync(descriptor);
    validateOpenStat(before, relativePath);
    check(sameFileSnapshot(opened, before), `${relativePath} changed after open`);
    const read = () => readFileSync(descriptor);
    const bytes = hooks.read ? hooks.read({ descriptor, path, read }) : read();
    check(Buffer.isBuffer(bytes), `${relativePath} read hook returned non-bytes`);
    const after = fstatSync(descriptor);
    validateOpenStat(after, relativePath);
    check(sameFileSnapshot(before, after) && bytes.length === after.size,
      `${relativePath} changed during read`);
    hooks.afterRead?.({ descriptor, path });
    check(canonicalPath(root, relativePath) === path, `${relativePath} path changed after read`);
    const finalPath = lstatSync(path);
    check(finalPath.isFile() && !finalPath.isSymbolicLink()
      && finalPath.dev === after.dev && finalPath.ino === after.ino
      && finalPath.size === after.size && finalPath.mtimeMs === after.mtimeMs
      && finalPath.ctimeMs === after.ctimeMs, `${relativePath} was replaced during validation`);
    return bytes.toString("utf8");
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function requireAbsent(root, relativePath) {
  const path = canonicalPath(root, relativePath, true);
  try { lstatSync(path); } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  fail(`${relativePath} must be absent`);
}

function rejectDuplicateJsonKeys(text, context) {
  const stack = [];
  for (let index = 0; index < text.length;) {
    const character = text[index];
    if (character === "{") { stack.push({ type: "object", keys: new Set() }); index++; continue; }
    if (character === "[") { stack.push({ type: "array" }); index++; continue; }
    if (character === "}" || character === "]") { stack.pop(); index++; continue; }
    if (character !== '"') { index++; continue; }
    const start = index++;
    let escaped = false;
    while (index < text.length) {
      const current = text[index++];
      if (escaped) escaped = false;
      else if (current === "\\") escaped = true;
      else if (current === '"') break;
    }
    check(text[index - 1] === '"', `${context} has an unterminated string`);
    let cursor = index;
    while (/\s/u.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const owner = stack.at(-1);
    check(owner?.type === "object", `${context} has a key outside an object`);
    let key;
    try { key = JSON.parse(text.slice(start, index)); } catch { fail(`${context} has an invalid key`); }
    check(!owner.keys.has(key), `${context} contains duplicate key ${key}`);
    owner.keys.add(key);
  }
}

function parseJson(text, context) {
  rejectDuplicateJsonKeys(text, context);
  try { return JSON.parse(text); } catch { fail(`${context} is not valid JSON`); }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function validateCsvStructure(text) {
  const lines = text.split(/\r?\n/u);
  if (lines.at(-1) === "") lines.pop();
  assert.deepEqual(lines.slice(0, 4), [
    "# Format,CRO_FUNCTIONS_V1",
    `# Module,${UNIT}`,
    "# TextSize,00005F68",
    "Location,Name,Namespace,Mode,Size,Segment",
  ], "public CSV header or unit identity differs");
  const rows = lines.slice(4).map((line, index) => {
    const match = /^([0-9A-F]{8}),"(func_[0-9A-F]{8})","Global",(\$a|\$t),([0-9A-F]{8}),"(\.text)"$/u.exec(line);
    check(match, `public CSV row ${index + 5} is not canonical`);
    return [match[2], Number.parseInt(match[1], 16), match[3] === "$a" ? "arm" : "thumb",
      Number.parseInt(match[4], 16), match[5]];
  });
  assert.deepEqual(rows, CSV_FUNCTIONS, "public CSV function name/address/mode/size/section inventory differs");
  return rows;
}

function validateCsv(text) {
  check(sha256(text) === CSV_SHA256, "public CSV hash differs from the reviewed metadata");
  return validateCsvStructure(text);
}

function validatePartitionStructure(partition, csvFunctions = CSV_FUNCTIONS) {
  exactKeys(partition, ["format", "module", "textSize", "functions", "gaps", "pools", "unknown"],
    "public partition");
  check(partition.format === 1 && partition.module === STEM && partition.textSize === TEXT_SIZE,
    "public partition schema, module identity, or text size differs");
  for (const key of ["functions", "gaps", "pools", "unknown"])
    check(Array.isArray(partition[key]), `public partition ${key} must be an array`);
  const functions = partition.functions.map((entry, index) => {
    exactKeys(entry, ["name", "address", "size", "mode"], `public partition function ${index}`);
    return [entry.name, entry.address, entry.mode, entry.size, ".text"];
  });
  assert.deepEqual(functions, csvFunctions,
    "public partition function name/address/mode/size inventory differs from the pinned CSV inventory");
  for (const [kind, expected] of Object.entries(PARTITION_CLASSIFICATIONS)) {
    const entries = partition[kind];
    check(entries.length === expected.count, `public partition ${kind} count differs`);
    for (let index = 0; index < entries.length; index++) {
      exactKeys(entries[index], kind === "gaps" ? ["address", "size", "mode"] : ["address", "size"],
        `public partition ${kind} ${index}`);
      check(Number.isSafeInteger(entries[index].address) && entries[index].address >= 0
        && Number.isSafeInteger(entries[index].size) && entries[index].size > 0
        && entries[index].address + entries[index].size <= TEXT_SIZE,
      `public partition ${kind} ${index} address or size is invalid`);
      if (kind === "gaps") check(entries[index].mode === "arm", `public partition gap ${index} mode differs`);
    }
    check(sha256(JSON.stringify(entries)) === expected.sha256,
      `public partition ${kind} address/size metadata differs`);
  }
  return functions;
}

function validatePartition(text, csvFunctions = CSV_FUNCTIONS) {
  check(sha256(text) === PARTITION_SHA256, "public partition hash differs from the reviewed metadata");
  const partition = parseJson(text, "public partition");
  validatePartitionStructure(partition, csvFunctions);
  return partition;
}

function validateTargetManifest(manifest) {
  check(manifest?.schemaVersion === 1 && manifest.target === "AS_EUR_REV2"
    && Number.isSafeInteger(manifest.unitCount) && Array.isArray(manifest.units)
    && manifest.unitCount === manifest.units.length, "target manifest schema or identity is invalid");
  const entries = manifest.units.filter((unit) => unit?.name === UNIT);
  check(entries.length === 1, "target manifest must contain exactly one unit identity");
  exactKeys(entries[0], ["name", "size", "sha256"], "target manifest unit");
  check(entries[0].name === UNIT && entries[0].size === TARGET_SIZE
    && entries[0].sha256 === TARGET_SHA256, "target unit metadata differs from the reviewed identity");
}

function validateSourceConfig(config, text) {
  check(config?.schemaVersion === 1 && Array.isArray(config.units), "source manifest shape is invalid");
  check(!config.units.some((unit) => unit?.name === STEM), "source manifest retains an active unit claim");
  check(!text.includes(STEM) && !text.includes(SOURCE) && !text.includes(REJECTED.name),
    "source manifest retains quarantined identity text");
}

function numeric(value, context, fallback = undefined) {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d+$/u.test(value)) return Number(value);
  fail(`${context} is not a finite non-negative number`);
}

function expectedPercent(numerator, denominator) {
  return denominator === 0 ? 0 : Math.fround(numerator * 100 / denominator);
}

function checkPercent(actual, expected, context) {
  check(typeof actual === "number" && Number.isFinite(actual)
    && Math.abs(actual - expected) <= PERCENT_DECIMAL_TOLERANCE,
  `${context} differs from the derived float serialization`);
}

function deriveReportAggregates(report) {
  check(Array.isArray(report?.units) && report.units.length > 0, "report units are missing");
  const result = {
    totalCode: 0,
    totalData: 0,
    totalFunctions: 0,
    matchedCode: 0,
    matchedFunctions: 0,
    totalUnits: report.units.length,
    completeUnits: 0,
    creditedCros: 0,
    fuzzyNumerator: 0,
  };
  const names = new Set();
  for (const unit of report.units) {
    check(unit && typeof unit.name === "string" && !names.has(unit.name), "report unit identity is invalid or duplicated");
    names.add(unit.name);
    const measures = unit.measures ?? {};
    const totalCode = numeric(measures.total_code, `${unit.name}.total_code`, 0);
    const totalFunctions = numeric(measures.total_functions, `${unit.name}.total_functions`, 0);
    const functions = unit.functions ?? [];
    check(Array.isArray(functions) && totalFunctions === functions.length,
      `${unit.name} function count differs from its report inventory`);
    result.totalCode += totalCode;
    result.totalData += numeric(measures.total_data, `${unit.name}.total_data`, 0);
    result.totalFunctions += totalFunctions;
    result.matchedCode += numeric(measures.matched_code, `${unit.name}.matched_code`, 0);
    const matchedFunctions = numeric(measures.matched_functions, `${unit.name}.matched_functions`, 0);
    result.matchedFunctions += matchedFunctions;
    result.fuzzyNumerator += totalCode * numeric(measures.fuzzy_match_percent,
      `${unit.name}.fuzzy_match_percent`, 0) / 100;
    if (unit.metadata?.complete === true) result.completeUnits++;
    if (unit.name.startsWith("cro/") && typeof unit.metadata?.source_path === "string" && matchedFunctions > 0)
      result.creditedCros++;
  }
  return result;
}

function validateGlobalReportMeasures(report) {
  const derived = deriveReportAggregates(report);
  exactKeys(report.measures, ["fuzzy_match_percent", "total_code", "matched_code", "matched_code_percent",
    "total_data", "total_functions", "matched_functions", "matched_functions_percent", "total_units"],
  "global report measures");
  check(report.measures.total_code === String(derived.totalCode)
    && report.measures.matched_code === String(derived.matchedCode)
    && report.measures.total_data === String(derived.totalData)
    && report.measures.total_functions === derived.totalFunctions
    && report.measures.matched_functions === derived.matchedFunctions
    && report.measures.total_units === derived.totalUnits,
  "global report counts differ from complete unit sums");
  checkPercent(report.measures.matched_code_percent,
    expectedPercent(derived.matchedCode, derived.totalCode), "global matched-code percent");
  checkPercent(report.measures.matched_functions_percent,
    expectedPercent(derived.matchedFunctions, derived.totalFunctions), "global matched-functions percent");
  checkPercent(report.measures.fuzzy_match_percent,
    expectedPercent(derived.fuzzyNumerator, derived.totalCode), "global fuzzy-match percent");
  return derived;
}

function numberWords(value) {
  check(Number.isSafeInteger(value) && value >= 0 && value < 1000, "summary word count is out of range");
  const small = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (value < 20) return small[value];
  if (value < 100) return `${tens[Math.floor(value / 10)]}${value % 10 ? `-${small[value % 10]}` : ""}`;
  return `${small[Math.floor(value / 100)]} hundred${value % 100 ? ` ${numberWords(value % 100)}` : ""}`;
}

function expectedSummary(derived) {
  const format = (value) => value.toLocaleString("en-US");
  const credited = numberWords(derived.creditedCros);
  const complete = numberWords(derived.completeUnits);
  const completion = derived.completeUnits === 0
    ? "every unit remains explicitly incomplete."
    : `${complete[0].toUpperCase()}${complete.slice(1)} ${derived.completeUnits === 1 ? "unit is" : "units are"} complete; `
      + `${derived.completeUnits === derived.totalUnits ? "no units remain incomplete." : "all remaining units remain explicitly incomplete."}`;
  return `The owned target is verified, all ${format(derived.totalUnits)} genuine link units are published with `
    + `${format(derived.totalFunctions)} evidence-gated functions, and ${format(derived.matchedFunctions)} clean-room `
    + `functions are byte-identical. ${credited[0].toUpperCase()}${credited.slice(1)} CRO units now contain independently `
    + `authored exact matches; ${completion}`;
}

function validateReport(report, csvFunctions = CSV_FUNCTIONS) {
  check(report?.version === 2 && Array.isArray(report.units), "report shape is invalid");
  const entries = report.units.filter((unit) => unit?.name === UNIT);
  check(entries.length === 1, "report must contain exactly one unit identity");
  const unit = entries[0];
  exactKeys(unit, ["name", "measures", "sections", "functions", "metadata"], "report unit");
  assert.deepEqual(unit.metadata, { complete: false });
  assert.deepEqual(unit.measures, {
    fuzzy_match_percent: 0,
    total_code: "9356",
    matched_code: "0",
    matched_code_percent: 0,
    total_data: "8072",
    total_functions: 23,
    matched_functions: 0,
    matched_functions_percent: 0,
    total_units: 1,
  });
  assert.deepEqual(unit.sections, [
    { name: ".bss", size: "1528", metadata: {} },
    { name: ".data", size: "1588", metadata: {} },
    { name: ".pool", size: "2244", metadata: {} },
    { name: ".rodata", size: "2712", metadata: {} },
    { name: ".text", size: "22064", metadata: {} },
  ]);
  check(unit.functions.length === REPORT_FUNCTIONS.length
    && unit.functions.reduce((sum, fn) => sum + Number(fn.size), 0) === 9356,
  "report function accounting differs from 23 functions and 9356 bytes");
  for (const fn of unit.functions) {
    exactKeys(fn, ["name", "size", "metadata", "address"], `report function ${fn?.name ?? "unknown"}`);
    check(Object.keys(fn.metadata).length === 0 && !Object.keys(fn).some((key) => /match|percent|source/iu.test(key)),
      `${fn.name} retains active credit`);
  }
  assert.deepEqual(unit.functions.map(({ name, address, size }) => [name, address, size]), REPORT_FUNCTIONS,
    "report function inventory differs from the reviewed public name/address/size triples");
  assert.deepEqual(unit.functions.map(({ name, size }) => [name, Number(size)]),
    csvFunctions.map(([name, , , size]) => [name, size]),
    "report function inventory differs from the independently pinned public CSV");
  const rejected = unit.functions.filter((fn) => fn.name === REJECTED.name);
  check(rejected.length === 1 && rejected[0].address === REJECTED.reportAddress
    && rejected[0].size === String(REJECTED.size),
    "report does not retain the rejected identity solely as neutral accounting");
  return validateGlobalReportMeasures(report);
}

function validateProject(project, report, derived = validateGlobalReportMeasures(report)) {
  check(project?.version === "AS_EUR_REV2", "project target version is invalid");
  exactKeys(project.progress, ["matchedCodePercent", "matchedFunctions", "totalFunctions", "completeUnits", "totalUnits"],
    "project progress");
  checkPercent(project.progress.matchedCodePercent, report.measures.matched_code_percent,
    "project matched-code percent");
  check(project.progress.matchedFunctions === derived.matchedFunctions
    && project.progress.totalFunctions === derived.totalFunctions
    && project.progress.completeUnits === derived.completeUnits
    && project.progress.totalUnits === derived.totalUnits,
  "project progress differs from the derived report aggregates");
  check(project.summary === expectedSummary(derived), "project summary does not reflect derived report progress");
}

function validateRejectedIdentity(text) {
  check(text.includes(`\`${REJECTED.name}\` at address \`0x${REJECTED.address.toString(16)}\`, size ${REJECTED.size}, in ARM mode`),
    "quarantine record does not pin the exact rejected identity");
  check(text.includes("not behavioral or implementation\nevidence")
    && text.includes("do not authorize an active source claim"), "rejected identity is presented as implementation evidence");
}

function validateQuarantine(text) {
  check(createHash("sha256").update(text).digest("hex") === QUARANTINE_SHA256,
    "quarantine record hash differs from the reviewed blocker");
  check(text.includes(BLOCKER_COMMIT), "quarantine record has the wrong blocker commit hash");
  validateRejectedIdentity(text);
}

function validateActiveContract(script, prose) {
  check(!script.includes(STEM) && !script.includes(REJECTED.name) && !prose.includes(STEM),
    "shared contract still endorses the quarantined unit");
  check(script.includes("CONTRACT.length === 7 && byUnit.size === 6")
    && script.includes("=== 392") && script.includes("=== 98")
    && prose.includes("seven independently specified ARM functions")
    && prose.includes("392 executable bytes and 98 ARM instructions"),
  "shared contract aggregate quarantine update is missing");
}

function validatePackage(pkg) {
  const expected = "node --check scripts/validate-cro-dll-poke3-select.mjs && node scripts/validate-cro-dll-poke3-select.mjs --self-test";
  check(pkg?.scripts?.["validate:cro-dll-poke3-select"] === expected,
    "focused package script is missing or changed");
  check(pkg.scripts["check:clean"]?.includes("npm run validate:cro-dll-poke3-select"),
    "focused quarantine validation is not reachable from npm run check");
  check(pkg.scripts["validate:cro-dll-field-event-secret-base-others-base-pc"]
    === "node --check scripts/validate-cro-dll-field-event-secret-base-others-base-pc.mjs && node scripts/validate-cro-dll-field-event-secret-base-others-base-pc.mjs --self-test"
    && pkg.scripts["postvalidate:cro-dll-field-event-takinobori"]
    === "npm run validate:cro-dll-field-event-secret-base-others-base-pc",
  "OthersBasePc focused npm gate is missing or changed");
}

function validateTree(root = ROOT) {
  requireAbsent(root, SOURCE);
  const manifestText = readRegular(root, "progress/units/AS_EUR_REV2.cro.json");
  const configText = readRegular(root, "config/cro-sources.json");
  const reportText = readRegular(root, "progress/reports/AS_EUR_REV2/report.json");
  const projectText = readRegular(root, "progress/project.json");
  const quarantineText = readRegular(root, "docs/specs/cro/DllPoke3Select_quarantine.md");
  const contractScript = readRegular(root, "scripts/validate-cro-contract-05.mjs");
  const contractProse = readRegular(root, "docs/specs/cro/contract_05.md");
  const packageText = readRegular(root, "package.json");
  const csvText = readRegular(root, CSV_PATH);
  const partitionText = readRegular(root, PARTITION_PATH);
  const csvFunctions = validateCsv(csvText);
  validatePartition(partitionText, csvFunctions);
  validateTargetManifest(parseJson(manifestText, "target manifest"));
  validateSourceConfig(parseJson(configText, "source manifest"), configText);
  const report = parseJson(reportText, "public report");
  const derived = validateReport(report, csvFunctions);
  validateProject(parseJson(projectText, "project progress"), report, derived);
  validateQuarantine(quarantineText);
  validateActiveContract(contractScript, contractProse);
  validatePackage(parseJson(packageText, "package manifest"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function synchronizeAggregateFixture(report, project) {
  const derived = deriveReportAggregates(report);
  report.measures.fuzzy_match_percent = expectedPercent(derived.fuzzyNumerator, derived.totalCode);
  report.measures.total_code = String(derived.totalCode);
  report.measures.matched_code = String(derived.matchedCode);
  report.measures.matched_code_percent = expectedPercent(derived.matchedCode, derived.totalCode);
  report.measures.total_data = String(derived.totalData);
  report.measures.total_functions = derived.totalFunctions;
  report.measures.matched_functions = derived.matchedFunctions;
  report.measures.matched_functions_percent = expectedPercent(derived.matchedFunctions, derived.totalFunctions);
  report.measures.total_units = derived.totalUnits;
  project.progress.matchedCodePercent = report.measures.matched_code_percent;
  project.progress.matchedFunctions = derived.matchedFunctions;
  project.progress.totalFunctions = derived.totalFunctions;
  project.progress.completeUnits = derived.completeUnits;
  project.progress.totalUnits = derived.totalUnits;
  project.summary = expectedSummary(derived);
  return derived;
}

function runSelfTests() {
  assert.throws(() => canonicalPath(ROOT, "../escape"), /escapes|noncanonical/u);
  assert.throws(() => regularReadFlags({ O_RDONLY: 0, O_NOFOLLOW: undefined }), /O_NOFOLLOW/u);
  assert.throws(() => regularReadFlags({ O_RDONLY: 0, O_NOFOLLOW: 0 }), /O_NOFOLLOW/u);
  const temporary = mkdtempSync(join(tmpdir(), "dll-poke3-select-validator-"));
  try {
    writeFileSync(join(temporary, "regular.json"), "{}\n");
    symlinkSync(join(temporary, "regular.json"), join(temporary, "linked.json"));
    assert.throws(() => readRegular(temporary, "linked.json"), /symlink/u);
    mkdirSync(join(temporary, "real-parent"));
    writeFileSync(join(temporary, "real-parent", "nested.json"), "{}\n");
    symlinkSync(join(temporary, "real-parent"), join(temporary, "linked-parent"));
    assert.throws(() => readRegular(temporary, "linked-parent/nested.json"), /symlink/u);
    mkdirSync(join(temporary, "directory.json"));
    assert.throws(() => readRegular(temporary, "directory.json"), /regular file/u);

    writeFileSync(join(temporary, "after-open.json"), "trusted\n");
    writeFileSync(join(temporary, "after-open-replacement.json"), "hostile\n");
    assert.throws(() => readRegular(temporary, "after-open.json", {
      afterOpen: () => {
        renameSync(join(temporary, "after-open.json"), join(temporary, "after-open-original.json"));
        renameSync(join(temporary, "after-open-replacement.json"), join(temporary, "after-open.json"));
      },
    }), /changed|replaced/u);

    writeFileSync(join(temporary, "during-read.json"), "trusted\n");
    writeFileSync(join(temporary, "during-read-target.json"), "hostile\n");
    assert.throws(() => readRegular(temporary, "during-read.json", {
      read: ({ read }) => {
        const bytes = read();
        renameSync(join(temporary, "during-read.json"), join(temporary, "during-read-original.json"));
        symlinkSync(join(temporary, "during-read-target.json"), join(temporary, "during-read.json"));
        return bytes;
      },
    }), /symlink|changed|replaced/u);

    mkdirSync(join(temporary, "race-parent"));
    mkdirSync(join(temporary, "race-alternate"));
    writeFileSync(join(temporary, "race-parent", "input.json"), "trusted\n");
    writeFileSync(join(temporary, "race-alternate", "input.json"), "hostile\n");
    assert.throws(() => readRegular(temporary, "race-parent/input.json", {
      afterOpen: () => {
        renameSync(join(temporary, "race-parent"), join(temporary, "race-parent-original"));
        symlinkSync(join(temporary, "race-alternate"), join(temporary, "race-parent"));
      },
    }), /symlink|changed|replaced/u);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
  assert.throws(() => parseJson('{"name":"a","name":"b"}', "duplicate test"), /duplicate key name/u);

  const csv = readRegular(ROOT, CSV_PATH);
  assert.throws(() => validateCsv(`${csv} `), /hash/u);
  for (const [from, to] of [
    ['"func_000004F8"', '"func_000004FC"'],
    ["000004F8,", "000004FC,"],
    [",$a,", ",$t,"],
    [",00000100,\".text\"", ",00000104,\".text\""],
  ]) assert.throws(() => validateCsvStructure(csv.replace(from, to)));

  const partitionText = readRegular(ROOT, PARTITION_PATH);
  assert.throws(() => validatePartition(`${partitionText} `), /hash/u);
  const partition = parseJson(partitionText, "public partition");
  for (const mutate of [
    (value) => { value.module = `${STEM}Mutated`; },
    (value) => { value.functions[0].address += 4; },
    (value) => { value.functions[0].size += 4; },
    (value) => { value.functions[0].mode = "thumb"; },
    (value) => { value.gaps[0].address += 4; },
    (value) => { value.pools[0].size += 4; },
  ]) {
    const mutated = clone(partition);
    mutate(mutated);
    assert.throws(() => validatePartitionStructure(mutated));
  }
  assert.throws(() => parseJson(partitionText.replace('"module": "DllPoke3Select"',
    '"module": "Mutated", "module": "DllPoke3Select"'), "duplicate partition"), /duplicate key module/u);

  const manifest = parseJson(readRegular(ROOT, "progress/units/AS_EUR_REV2.cro.json"), "target manifest");
  for (const [field, value] of [["name", "cro/DllPoke3SelectMutated"], ["size", TARGET_SIZE + 1],
    ["sha256", `0${TARGET_SHA256.slice(1)}`]]) {
    const mutated = clone(manifest);
    const entry = mutated.units.find((unit) => unit.name === UNIT);
    entry[field] = value;
    assert.throws(() => validateTargetManifest(mutated));
  }

  const quarantine = readRegular(ROOT, "docs/specs/cro/DllPoke3Select_quarantine.md");
  assert.throws(() => validateQuarantine(`${quarantine} `), /hash/u);
  for (const [from, to] of [[REJECTED.name, "func_00002698"], ["0x2694", "0x2698"],
    ["size 68", "size 72"], ["ARM mode", "Thumb mode"]]) {
    assert.throws(() => validateRejectedIdentity(quarantine.replace(from, to)));
  }

  const report = parseJson(readRegular(ROOT, "progress/reports/AS_EUR_REV2/report.json"), "public report");
  for (const mutate of [
    (value) => { value.units.find((unit) => unit.name === UNIT).name = `${UNIT}Mutated`; },
    (value) => { value.units.find((unit) => unit.name === UNIT).measures.total_functions = 24; },
    (value) => { value.units.find((unit) => unit.name === UNIT).measures.matched_code = "68"; },
    (value) => { value.units.find((unit) => unit.name === UNIT).metadata.source_path = `src/${UNIT}`; },
    (value) => { value.units.find((unit) => unit.name === UNIT).functions[0].name = "func_000004FC"; },
    (value) => { value.units.find((unit) => unit.name === UNIT).functions[0].address = "12712"; },
    (value) => {
      const functions = value.units.find((unit) => unit.name === UNIT).functions;
      functions[0].size = String(Number(functions[0].size) + 4);
      functions[1].size = String(Number(functions[1].size) - 4);
    },
    (value) => { value.measures.matched_functions += 1; },
  ]) {
    const mutated = clone(report);
    mutate(mutated);
    assert.throws(() => validateReport(mutated));
  }

  const unrelatedReport = clone(report);
  const unrelatedProject = clone(parseJson(readRegular(ROOT, "progress/project.json"), "project progress"));
  const originalDerived = deriveReportAggregates(unrelatedReport);
  const unrelated = unrelatedReport.units.find((unit) => unit.name === "cro/DllBackGround");
  check(unrelated && typeof unrelated.metadata?.source_path === "string"
    && numeric(unrelated.measures?.matched_functions, "fixture", 0) === 1
    && unrelated.functions?.some((fn) => fn.fuzzy_match_percent === 100),
  "positive aggregate fixture lacks the sole credited DllBackGround match");
  const removed = unrelated.functions.find((fn) => fn.fuzzy_match_percent === 100);
  const removedBytes = numeric(removed.size, "positive fixture function size");
  delete removed.fuzzy_match_percent;
  unrelated.measures.matched_code = String(numeric(unrelated.measures.matched_code,
    "positive fixture matched code") - removedBytes);
  unrelated.measures.matched_functions = numeric(unrelated.measures.matched_functions,
    "positive fixture matched functions") - 1;
  const unrelatedTotalCode = numeric(unrelated.measures.total_code, "positive fixture total code");
  const unrelatedTotalFunctions = numeric(unrelated.measures.total_functions, "positive fixture total functions");
  unrelated.measures.matched_code_percent = expectedPercent(Number(unrelated.measures.matched_code), unrelatedTotalCode);
  unrelated.measures.matched_functions_percent = expectedPercent(unrelated.measures.matched_functions,
    unrelatedTotalFunctions);
  const fuzzyBytes = unrelated.functions.reduce((sum, fn) => sum
    + numeric(fn.size, "positive fixture fuzzy size") * numeric(fn.fuzzy_match_percent,
      "positive fixture fuzzy percent", 0) / 100, 0);
  unrelated.measures.fuzzy_match_percent = expectedPercent(fuzzyBytes, unrelatedTotalCode);
  const unrelatedDerived = synchronizeAggregateFixture(unrelatedReport, unrelatedProject);
  assert.equal(unrelatedDerived.creditedCros, originalDerived.creditedCros - 1);
  const derivedCreditedWords = numberWords(unrelatedDerived.creditedCros);
  assert.match(unrelatedProject.summary,
    new RegExp(`${derivedCreditedWords[0].toUpperCase()}${derivedCreditedWords.slice(1)} CRO units`, "u"));
  assert.doesNotThrow(() => {
    const checked = validateReport(unrelatedReport);
    validateProject(unrelatedProject, unrelatedReport, checked);
    assert.deepEqual(checked, unrelatedDerived);
  });
}

function main() {
  const args = process.argv.slice(2);
  check(args.every((argument) => argument === "--self-test") && args.length <= 1,
    "usage: validate-cro-dll-poke3-select.mjs [--self-test]");
  validateTree(ROOT);
  if (args.includes("--self-test")) runSelfTests();
  console.log(`Validated ${UNIT} quarantine: 23 functions, 9356 code bytes, zero active source or match credit${args.length ? ", with negative self-tests" : ""}.`);
}

try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
