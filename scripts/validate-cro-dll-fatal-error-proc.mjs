#!/usr/bin/env node

// Infrastructure only. Contract: docs/specs/cro/DllFatalErrorProc_blocker.md
// at dcdbc8c, plus tracked public metadata schemas. No target input is used.
import { createHash } from "node:crypto";
import { closeSync, constants, copyFileSync, fstatSync, lstatSync, mkdtempSync, openSync, readFileSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
const UNIT = "DllFatalErrorProc";
const REPORT_UNIT = `cro/${UNIT}`;
const TARGET = "AS_EUR_REV2";
const MAX_INPUT_SIZE = 64 * 1024 * 1024;
const DEFAULT_REPORT_PATH = join(ROOT, "progress", "reports", TARGET, "report.json");
const BLOCKER_PATH = join(ROOT, "docs", "specs", "cro", `${UNIT}_blocker.md`);
const REVIEWED_DIGESTS = Object.freeze({
  blocker: "44feb7dea946e72981a7b6c3fcf04178d5b1c9829cf7394d4a1a9c023227aad6",
  inventory: "1d49800c032bc536639504c05e7e554df9371fb4d92d8e91ed9058e2a9368726",
  manifestUnit: "246dd67f9ed23373c33db01758463deec331e3f7bc463cba0aa2bfc7a18c4799",
  partition: "9eb4ce610f5b337cb4e719ea1adf8f82b56be9158f973721374f33ada68a7de9",
  reportUnit: "e0d984f9140fd19b69e2ac62e52898a6dd40e0655e484f7782772a8e65c3c455",
});

function fail(message) {
  throw new Error(`CRO ${UNIT} validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, expected, label) {
  check(isObject(value) && JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expected].sort()), `${label} fields must be exactly ${expected.join(", ")}`);
}

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function fileIdentity(stat) {
  return [stat.dev, stat.ino, stat.mode, stat.size, stat.mtimeNs, stat.ctimeNs];
}

function sameIdentity(left, right) {
  const rightIdentity = fileIdentity(right);
  return fileIdentity(left).every((value, index) => value === rightIdentity[index]);
}

function sameIdentityChain(left, right) {
  return left.length === right.length && left.every((identity, index) =>
    identity.every((value, field) => value === right[index][field]));
}

function ownedRegularFile(path, label) {
  check(path === resolve(path) && inside(ROOT, path), `${label} must use a canonical path inside the repository`);
  const segments = relative(ROOT, path).split(sep);
  let cursor = ROOT;
  let stat;
  const identities = [fileIdentity(lstatSync(ROOT, { bigint: true }))];
  for (const [index, segment] of segments.entries()) {
    cursor = join(cursor, segment);
    try { stat = lstatSync(cursor, { bigint: true }); } catch { fail(`${label} cannot be opened`); }
    check(!stat.isSymbolicLink(), `${label} and its repository parents must not be symlinks`);
    check(index === segments.length - 1 ? stat.isFile() : stat.isDirectory(),
      `${label} must be a regular file beneath regular repository directories`);
    identities.push(fileIdentity(stat));
  }
  check(realpathSync(path) === path, `${label} path must resolve canonically inside the repository`);
  return { identities, stat };
}

function readText(path, label, hooks = {}) {
  const before = ownedRegularFile(path, label);
  check(before.stat.size > 0n && before.stat.size <= BigInt(MAX_INPUT_SIZE),
    `${label} must be between 1 byte and 64 MiB`);
  hooks.afterPrecheck?.();
  let descriptor;
  try { descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW); }
  catch { fail(`${label} cannot be opened without following links`); }
  let text;
  try {
    const opened = fstatSync(descriptor, { bigint: true });
    check(opened.isFile() && sameIdentity(before.stat, opened),
      `${label} changed between path validation and descriptor open`);
    hooks.afterOpen?.();
    text = readFileSync(descriptor, "utf8");
    hooks.afterRead?.();
    const read = fstatSync(descriptor, { bigint: true });
    check(sameIdentity(opened, read), `${label} changed while its descriptor was being read`);
    const after = ownedRegularFile(path, label);
    check(sameIdentity(read, after.stat) && sameIdentityChain(before.identities, after.identities),
    `${label} or one of its repository parents changed during validation`);
  } catch (error) {
    if (error?.message?.startsWith(`CRO ${UNIT} validation:`)) throw error;
    fail(`${label} cannot be read`);
  } finally {
    closeSync(descriptor);
  }
  check(Buffer.byteLength(text) <= MAX_INPUT_SIZE, `${label} exceeds the 64 MiB input limit`);
  return text;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (isObject(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

function digest(value) {
  const input = typeof value === "string" ? value : JSON.stringify(canonicalJson(value));
  return createHash("sha256").update(input).digest("hex");
}

function checkReviewedDigest(value, expected, label) {
  check(digest(value) === expected, `${label} differs from the independently reviewed public identity`);
}

function rejectDuplicateJsonKeys(text, label) {
  // JSON.parse has already checked syntax. Preserve evidence of repeated keys
  // rather than silently accepting the last value supplied by the input.
  const stack = [];
  for (let index = 0; index < text.length;) {
    const character = text[index];
    if (character === "{") { stack.push(new Set()); index++; continue; }
    if (character === "[") { stack.push(null); index++; continue; }
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
    let cursor = index;
    while (/\s/u.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const key = JSON.parse(text.slice(start, index));
    const keys = stack.at(-1);
    check(keys instanceof Set && !keys.has(key), `${label} contains a duplicate JSON key`);
    keys.add(key);
  }
}

function readJson(path, label) {
  const text = readText(path, label);
  let value;
  try { value = JSON.parse(text); } catch { fail(`${label} is not valid JSON`); }
  rejectDuplicateJsonKeys(text, label);
  return value;
}

function reportPathFromArguments(argv) {
  check(argv.length === 0 || (argv.length === 2 && argv[0] === "--report" &&
    argv[1].trim().length > 0 && !argv[1].startsWith("--")),
  "usage: validate-cro-dll-fatal-error-proc.mjs [--report <path>]");
  return argv.length === 0 ? DEFAULT_REPORT_PATH : resolve(argv[1]);
}

function singleUnit(units, label) {
  check(Array.isArray(units) && units.every((unit) => isObject(unit) && typeof unit.name === "string"),
    `${label} units must be an array of named objects`);
  const matches = units.filter((unit) => unit.name === REPORT_UNIT);
  check(matches.length === 1, `${label} must contain exactly one ${REPORT_UNIT} unit`);
  return matches[0];
}

function validatePublicContract() {
  const blocker = readText(BLOCKER_PATH, "clean-room blocker record");
  checkReviewedDigest(blocker, REVIEWED_DIGESTS.blocker, "clean-room blocker record");

  const config = readJson(join(ROOT, "config", "cro-sources.json"), "CRO source config");
  exactKeys(config, ["schemaVersion", "units"], "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config must use schema 1");
  for (const entry of config.units) {
    check(isObject(entry) && typeof entry.name === "string", "CRO source config contains an invalid unit");
    check(entry.name !== UNIT && entry.name !== REPORT_UNIT,
      `${REPORT_UNIT} must remain without a source-registry claim`);
  }

  const inventory = readText(join(ROOT, "symbols", "cro", `${UNIT}.csv`), "public inventory");
  checkReviewedDigest(inventory, REVIEWED_DIGESTS.inventory, "public inventory");
  const lines = inventory.split(/\r?\n/u);
  if (lines.at(-1) === "") lines.pop();
  check(lines[0] === "# Format,CRO_FUNCTIONS_V1" && lines[1] === `# Module,${REPORT_UNIT}` &&
    lines[2] === "# TextSize,000006F0" && lines[3] === "Location,Name,Namespace,Mode,Size,Segment",
  "public inventory header or 1776-byte text extent changed");
  check(lines.length === 4, "public inventory must contain zero accepted functions and no extra rows");

  const partition = readJson(join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`), "public partition");
  checkReviewedDigest(partition, REVIEWED_DIGESTS.partition, "public partition ranges");
  exactKeys(partition, ["format", "functions", "gaps", "module", "pools", "textSize", "unknown"], "partition");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 1776,
    "partition identity, format, or 1776-byte text extent changed");
  const groups = [["functions", 0, 0], ["gaps", 43, 1504], ["pools", 43, 232], ["unknown", 1, 40]];
  const intervals = [];
  for (const [name, count, bytes] of groups) {
    const entries = partition[name];
    check(Array.isArray(entries) && entries.length === count, `partition ${name} must contain ${count} ranges`);
    let total = 0;
    let previousEnd = 0;
    for (const [index, entry] of entries.entries()) {
      const label = `partition ${name}[${index}]`;
      exactKeys(entry, name === "gaps" ? ["address", "size", "mode"] : ["address", "size"], label);
      check(Number.isSafeInteger(entry.address) && entry.address >= 0 &&
        Number.isSafeInteger(entry.size) && entry.size > 0, `${label} must have a nonnegative integer address and positive integer size`);
      const end = entry.address + entry.size;
      check(Number.isSafeInteger(end) && end <= partition.textSize, `${label} exceeds the declared text extent`);
      check(entry.address >= previousEnd, `${label} is out of order or overlaps its preceding range`);
      if (name === "gaps") {
        check(entry.mode === "arm" && entry.address % 4 === 0 && entry.size % 4 === 0,
          `${label} must be an aligned ARM gap`);
      }
      previousEnd = end;
      total += entry.size;
      intervals.push({ address: entry.address, end });
    }
    check(total === bytes, `partition ${name} must account for exactly ${bytes} bytes`);
  }
  intervals.sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(interval.address === cursor, `partition has a hole or overlap at text offset ${cursor}`);
    cursor = interval.end;
  }
  check(intervals.length === 87 && cursor === partition.textSize,
    "partition must cover all 1776 text bytes in exactly 87 ranges");

  const manifest = readJson(join(ROOT, "progress", "units", `${TARGET}.cro.json`), "public CRO manifest");
  exactKeys(manifest, ["schemaVersion", "target", "unitCount", "units"], "public CRO manifest");
  check(manifest.schemaVersion === 1 && manifest.target === TARGET && Array.isArray(manifest.units) &&
    Number.isSafeInteger(manifest.unitCount) && manifest.unitCount === manifest.units.length,
  "public CRO manifest identity or unit count is invalid");
  const unit = singleUnit(manifest.units, "public CRO manifest");
  exactKeys(unit, ["name", "size", "sha256"], "manifest unit");
  checkReviewedDigest(unit, REVIEWED_DIGESTS.manifestUnit, "manifest unit");
  check(unit.size === 12288 && typeof unit.sha256 === "string" && /^[0-9a-f]{64}$/u.test(unit.sha256),
    "manifest unit size or public identity schema changed");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  exactKeys(report, ["version", "measures", "units"], "objdiff report");
  check(report.version === 2 && isObject(report.measures), "objdiff report must use schema version 2");
  const unit = singleUnit(report.units, "objdiff report");
  // Objdiff omits the empty function list and zero integer counters here.
  // Exact schemas also reject source_path, credit fields, and unexpected claims.
  exactKeys(unit, ["name", "measures", "sections", "metadata"], "report unit");
  checkReviewedDigest(unit, REVIEWED_DIGESTS.reportUnit, "report unit");
  exactKeys(unit.metadata, ["complete"], "report unit metadata");
  check(unit.metadata.complete === false, "report unit must retain complete: false");
  const expectedMeasures = {
    fuzzy_match_percent: 0,
    matched_code_percent: 0,
    total_data: "412",
    matched_functions_percent: 0,
    complete_code_percent: 0,
    total_units: 1,
  };
  exactKeys(unit.measures, Object.keys(expectedMeasures), "report unit measures");
  for (const [name, value] of Object.entries(expectedMeasures)) {
    check(unit.measures[name] === value, `report unit measure ${name} must equal ${JSON.stringify(value)}`);
  }

  const expectedSections = new Map([
    [".bss", "16"], [".data", "4"], [".pool", "232"], [".rodata", "160"], [".text", "1504"],
  ]);
  check(Array.isArray(unit.sections) && unit.sections.length === expectedSections.size,
    "report must contain exactly five accounted sections");
  const seen = new Set();
  for (const [index, section] of unit.sections.entries()) {
    exactKeys(section, ["name", "size", "metadata"], `report section ${index}`);
    check(expectedSections.has(section.name) && !seen.has(section.name),
      `report section ${index} must have a unique expected name`);
    check(section.size === expectedSections.get(section.name), `report section ${section.name} size changed`);
    exactKeys(section.metadata, [], `report section ${section.name} metadata`);
    seen.add(section.name);
  }
}

function expectFailure(action, pattern, label) {
  let message = "";
  try { action(); } catch (error) { message = error.message; }
  check(pattern.test(message), `self-test ${label} did not fail closed (${message || "no failure"})`);
}

function selfTest() {
  const insideDirectory = mkdtempSync(join(ROOT, ".dll-fatal-error-proc-selftest-"));
  const outsideDirectory = mkdtempSync(join(tmpdir(), "dll-fatal-error-proc-selftest-"));
  try {
    const ownedReport = join(insideDirectory, "report.json");
    copyFileSync(DEFAULT_REPORT_PATH, ownedReport);
    validateReport(ownedReport);

    const externalReport = join(outsideDirectory, "report.json");
    copyFileSync(DEFAULT_REPORT_PATH, externalReport);
    expectFailure(() => validateReport(externalReport), /canonical path inside the repository/u,
      "external report rejection");

    const reportSymlink = join(insideDirectory, "report-link.json");
    symlinkSync(DEFAULT_REPORT_PATH, reportSymlink);
    expectFailure(() => validateReport(reportSymlink), /must not be symlinks/u,
      "report symlink rejection");

    const parentSymlink = join(insideDirectory, "report-parent");
    symlinkSync(join(ROOT, "progress", "reports", TARGET), parentSymlink, "dir");
    expectFailure(() => validateReport(join(parentSymlink, "report.json")), /must not be symlinks/u,
      "symlink parent rejection");

    const duplicateJson = join(insideDirectory, "duplicate.json");
    writeFileSync(duplicateJson, '{"outer":{"identity":1,"identity":2}}\n', "utf8");
    expectFailure(() => readJson(duplicateJson, "duplicate-key fixture"), /duplicate JSON key/u,
      "duplicate-key rejection");

    const racePath = join(insideDirectory, "race.json");
    const raceReplacement = join(insideDirectory, "race-replacement.json");
    writeFileSync(racePath, '{"identity":"before"}\n', "utf8");
    writeFileSync(raceReplacement, '{"identity":"after"}\n', "utf8");
    expectFailure(() => readText(racePath, "path-swap fixture", {
      afterOpen: () => renameSync(raceReplacement, racePath),
    }), /changed (?:while .* was being read|during validation)/u,
    "descriptor-pinned path-swap rejection");

    const blocker = readText(BLOCKER_PATH, "clean-room blocker record");
    expectFailure(() => checkReviewedDigest(`${blocker}\n`, REVIEWED_DIGESTS.blocker,
      "clean-room blocker record"), /independently reviewed public identity/u,
    "blocker record mutation rejection");

    const manifest = readJson(join(ROOT, "progress", "units", `${TARGET}.cro.json`), "public CRO manifest");
    const manifestUnit = structuredClone(singleUnit(manifest.units, "public CRO manifest"));
    manifestUnit.sha256 = `${manifestUnit.sha256[0] === "0" ? "1" : "0"}${manifestUnit.sha256.slice(1)}`;
    expectFailure(() => checkReviewedDigest(manifestUnit, REVIEWED_DIGESTS.manifestUnit, "manifest unit"),
      /independently reviewed public identity/u, "manifest mutation rejection");

    const partition = structuredClone(readJson(
      join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`), "public partition"));
    const gapIndex = partition.gaps.findIndex((gap) =>
      partition.pools.some((pool) => pool.size === gap.size));
    check(gapIndex >= 0, "self-test needs equal-size public gap and pool ranges");
    const poolIndex = partition.pools.findIndex((pool) => pool.size === partition.gaps[gapIndex].size);
    [partition.gaps[gapIndex].address, partition.pools[poolIndex].address] =
      [partition.pools[poolIndex].address, partition.gaps[gapIndex].address];
    partition.gaps.sort((left, right) => left.address - right.address);
    partition.pools.sort((left, right) => left.address - right.address);

    const report = readJson(DEFAULT_REPORT_PATH, "objdiff report");
    const reportUnit = structuredClone(singleUnit(report.units, "objdiff report"));
    [reportUnit.sections[0], reportUnit.sections[1]] = [reportUnit.sections[1], reportUnit.sections[0]];
    expectFailure(() => check(
      digest(manifestUnit) === REVIEWED_DIGESTS.manifestUnit &&
      digest(partition) === REVIEWED_DIGESTS.partition &&
      digest(reportUnit) === REVIEWED_DIGESTS.reportUnit,
      "coordinated public identity and range mutation was accepted"),
    /coordinated public identity and range mutation/u, "coordinated identity/range mutation rejection");
  } finally {
    rmSync(insideDirectory, { recursive: true, force: true });
    rmSync(outsideDirectory, { recursive: true, force: true });
  }
  console.log(`Validated ${REPORT_UNIT} hostile path, descriptor-race, duplicate-key, blocker, identity, and range fixtures.`);
}

try {
  const argv = process.argv.slice(2);
  if (argv.length === 1 && argv[0] === "--self-test") {
    selfTest();
  } else {
    const reportPath = reportPathFromArguments(argv);
    validatePublicContract();
    validateReport(reportPath);
    console.log(`Validated ${REPORT_UNIT}: 0 accepted functions, 87 ranges covering 1776 text bytes; ` +
      "zero credit, no source claim, completion remains false.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
