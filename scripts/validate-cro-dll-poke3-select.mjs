#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
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

function readRegular(root, relativePath) {
  const path = canonicalPath(root, relativePath);
  const stat = lstatSync(path);
  check(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= MAX_FILE_SIZE,
    `${relativePath} must be a bounded canonical regular file`);
  return readFileSync(path, "utf8");
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

function validateTargetManifest(manifest) {
  check(manifest?.target === "AS_EUR_REV2" && Array.isArray(manifest.units), "target manifest identity is invalid");
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

function validateReport(report) {
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
  const rejected = unit.functions.filter((fn) => fn.name === REJECTED.name);
  check(rejected.length === 1 && rejected[0].address === REJECTED.reportAddress
    && rejected[0].size === String(REJECTED.size),
    "report does not retain the rejected identity solely as neutral accounting");
  assert.deepEqual(report.measures, {
    fuzzy_match_percent: 11.202542,
    total_code: "3719620",
    matched_code: "416680",
    matched_code_percent: 11.20222,
    total_data: "2121692",
    total_functions: 14840,
    matched_functions: 4257,
    matched_functions_percent: 28.685984,
    total_units: 146,
  });
}

function validateProject(project) {
  check(project?.version === "AS_EUR_REV2", "project target version is invalid");
  assert.deepEqual(project.progress, {
    matchedCodePercent: 11.20222,
    matchedFunctions: 4257,
    totalFunctions: 14840,
    completeUnits: 0,
    totalUnits: 146,
  });
  check(project.summary.includes("4,257 clean-room functions")
    && project.summary.includes("Ninety-three CRO units"), "project summary does not reflect quarantine totals");
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
  validateTargetManifest(parseJson(manifestText, "target manifest"));
  validateSourceConfig(parseJson(configText, "source manifest"), configText);
  validateReport(parseJson(reportText, "public report"));
  validateProject(parseJson(projectText, "project progress"));
  validateQuarantine(quarantineText);
  validateActiveContract(contractScript, contractProse);
  validatePackage(parseJson(packageText, "package manifest"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function runSelfTests() {
  assert.throws(() => canonicalPath(ROOT, "../escape"), /escapes|noncanonical/u);
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
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
  assert.throws(() => parseJson('{"name":"a","name":"b"}', "duplicate test"), /duplicate key name/u);

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
    (value) => { value.measures.matched_functions = 4260; },
  ]) {
    const mutated = clone(report);
    mutate(mutated);
    assert.throws(() => validateReport(mutated));
  }
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
