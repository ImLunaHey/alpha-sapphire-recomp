#!/usr/bin/env node

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
  readSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllFieldEventScreenEffect";
const REPORT_UNIT = `cro/${UNIT}`;
const MAX_INPUT_SIZE = 64 * 1024 * 1024;
const REVIEWED_INPUTS = Object.freeze({
  manifest: Object.freeze({ path: "progress/units/AS_EUR_REV2.cro.json" }),
  inventory: Object.freeze({ path: `symbols/cro/${UNIT}.csv`, sha256: "31cfe4ecad63347f637f7df7153fdd2f6865de3eddacb829f1f13f7cb8b9b3aa" }),
  partition: Object.freeze({ path: `symbols/cro-partitions/${UNIT}.json`, sha256: "024f2a3ac76b4d5258d114f99a120bc8107bdb60026e59f84375023d1fddb0ce" }),
  report: Object.freeze({ path: "progress/reports/AS_EUR_REV2/report.json" }),
  specification: Object.freeze({ path: `docs/specs/cro/${UNIT}.md`, sha256: "383d88c33b767636fdd6a8253ba8d52fa87faf0e318617173f8ee970f9ab34dd" }),
  config: Object.freeze({ path: "config/cro-sources.json" }),
});
const MANIFEST_UNIT_SHA256 = "f32fd91123fbeb2e99d72c1200092dd0c253eb50387f6e498dda308a20f74de3";
const REPORT_UNIT_SHA256 = "e11f12c774482d7a9650998b7edc67968be7ee43f0e1dc2068c67f904560849f";

function fail(message) { throw new Error(`CRO ${UNIT} validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(text) { return createHash("sha256").update(text).digest("hex"); }

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

function objectSha256(value) { return sha256(JSON.stringify(canonicalJson(value))); }

function exactKeys(value, keys, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value), `${label} is not an object`);
  check(Object.keys(value).sort().join(",") === [...keys].sort().join(","), `${label} schema changed`);
}

function rejectDuplicateJsonKeys(text, label) {
  const stack = [];
  for (let index = 0; index < text.length;) {
    const character = text[index];
    if (character === "{") { stack.push({ type: "object", keys: new Set() }); index += 1; continue; }
    if (character === "[") { stack.push({ type: "array" }); index += 1; continue; }
    if (character === "}" || character === "]") { stack.pop(); index += 1; continue; }
    if (character !== '"') { index += 1; continue; }
    const start = index;
    index += 1;
    let escaped = false;
    while (index < text.length) {
      const current = text[index];
      index += 1;
      if (escaped) escaped = false;
      else if (current === "\\") escaped = true;
      else if (current === '"') break;
    }
    check(text[index - 1] === '"', `${label} has an unterminated string`);
    let cursor = index;
    while (/\s/u.test(text[cursor] ?? "")) cursor += 1;
    if (text[cursor] !== ":") continue;
    const owner = stack.at(-1);
    check(owner?.type === "object", `${label} has a key outside an object`);
    let key;
    try { key = JSON.parse(text.slice(start, index)); }
    catch { fail(`${label} contains an invalid key`); }
    check(!owner.keys.has(key), `${label} contains duplicate key ${key}`);
    owner.keys.add(key);
  }
}

function canonicalRoot(root) {
  const absolute = resolve(root);
  let details;
  try { details = lstatSync(absolute); }
  catch (error) { fail(`repository root is unavailable: ${error.message}`); }
  check(details.isDirectory() && !details.isSymbolicLink() && realpathSync(absolute) === absolute,
    "repository root is not a canonical non-symlink directory");
  return absolute;
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.size === right.size &&
    left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}

function inspectOwnedPath(root, input, label) {
  const ownedRoot = canonicalRoot(root);
  check(!isAbsolute(input.path), `${label} path is not repository-relative`);
  const path = resolve(ownedRoot, input.path);
  const displacement = relative(ownedRoot, path);
  check(displacement !== "" && displacement !== ".." && !displacement.startsWith(`..${sep}`) && !isAbsolute(displacement),
    `${label} escapes the repository root`);
  const components = displacement.split(sep);
  let cursor = ownedRoot;
  let leaf;
  for (const [index, component] of components.entries()) {
    cursor = join(cursor, component);
    let details;
    try { details = lstatSync(cursor, { bigint: true }); }
    catch (error) { fail(`${label} is unavailable: ${error.message}`); }
    check(!details.isSymbolicLink(), `${label} has a symbolic-link path component`);
    if (index === components.length - 1) {
      check(details.isFile(), `${label} is not a regular owned file`);
      check(details.size <= BigInt(MAX_INPUT_SIZE), `${label} exceeds the input-size limit`);
      leaf = details;
    } else check(details.isDirectory(), `${label} ancestor is not a directory`);
    check(realpathSync(cursor) === cursor, `${label} path is not canonical`);
  }
  return { ownedRoot, path, leaf };
}

function readOwnedRegularFile(root, input, label, hooks = {}) {
  const inspected = inspectOwnedPath(root, input, label);
  hooks.beforeOpen?.(inspected.path);
  let descriptor;
  try {
    descriptor = openSync(inspected.path, constants.O_RDONLY | constants.O_NOFOLLOW);
  } catch (error) {
    fail(`${label} could not be opened without following links: ${error.message}`);
  }
  try {
    const before = fstatSync(descriptor, { bigint: true });
    check(before.isFile() && before.size <= BigInt(MAX_INPUT_SIZE), `${label} opened object is not a bounded regular file`);
    check(sameIdentity(inspected.leaf, before), `${label} identity changed before descriptor open`);
    const descriptorPath = realpathSync(`/proc/self/fd/${descriptor}`);
    check(descriptorPath === inspected.path && relative(inspected.ownedRoot, descriptorPath).split(sep)[0] !== "..",
      `${label} descriptor escaped its canonical repository path`);

    hooks.afterOpen?.(inspected.path);
    const bytes = Buffer.alloc(Number(before.size) + 1);
    let offset = 0;
    while (offset < bytes.length) {
      const count = readSync(descriptor, bytes, offset, bytes.length - offset, null);
      if (count === 0) break;
      offset += count;
    }
    const after = fstatSync(descriptor, { bigint: true });
    check(offset === Number(before.size) && sameIdentity(before, after), `${label} changed while being read`);
    const post = inspectOwnedPath(root, input, label);
    check(sameIdentity(after, post.leaf) && realpathSync(`/proc/self/fd/${descriptor}`) === post.path,
      `${label} pathname identity changed while being read`);
    return bytes.subarray(0, offset).toString("utf8");
  } finally {
    closeSync(descriptor);
  }
}

function readReviewedText(root, key, label) {
  const input = REVIEWED_INPUTS[key];
  const text = readOwnedRegularFile(root, input, label);
  if (input.sha256 !== undefined) check(sha256(text) === input.sha256, `${label} whole-file identity changed`);
  return text;
}

function readReviewedJson(root, key, label) {
  const input = REVIEWED_INPUTS[key];
  const text = readOwnedRegularFile(root, input, label);
  rejectDuplicateJsonKeys(text, label);
  if (input.sha256 !== undefined) check(sha256(text) === input.sha256, `${label} whole-file identity changed`);
  try { return JSON.parse(text); }
  catch (error) { fail(`${label} is not valid JSON: ${error.message}`); }
}

function validateManifest(root) {
  const manifest = readReviewedJson(root, "manifest", "public CRO manifest");
  exactKeys(manifest, ["schemaVersion", "target", "unitCount", "units"], "public CRO manifest");
  check(manifest.schemaVersion === 1 && manifest.target === "AS_EUR_REV2" && Number.isSafeInteger(manifest.unitCount) &&
    Array.isArray(manifest.units) && manifest.units.length === manifest.unitCount, "public CRO manifest identity changed");
  const units = manifest.units.filter((entry) => entry?.name === REPORT_UNIT);
  check(units.length === 1, `manifest must contain exactly one ${REPORT_UNIT} unit`);
  exactKeys(units[0], ["name", "sha256", "size"], "public CRO manifest unit");
  check(units[0].size === 12288 && typeof units[0].sha256 === "string" && /^[0-9a-f]{64}$/u.test(units[0].sha256),
    "published unit identity changed");
  check(objectSha256(units[0]) === MANIFEST_UNIT_SHA256, "published unit object identity changed");
}

function validateInventory(root) {
  const lines = readReviewedText(root, "inventory", "neutral function inventory").trimEnd().split(/\r?\n/u);
  check(lines[0] === "# Format,CRO_FUNCTIONS_V1", "inventory format changed");
  check(lines[1] === `# Module,${REPORT_UNIT}`, "inventory module changed");
  check(lines[2] === "# TextSize,00000850", "inventory text extent changed");
  check(lines[3] === "Location,Name,Namespace,Mode,Size,Segment", "inventory columns changed");
  check(lines.length === 4, "inventory must remain free of accepted function boundaries");
}

function validatePartition(root) {
  const partition = readReviewedJson(root, "partition", "text partition");
  exactKeys(partition, ["format", "module", "textSize", "functions", "gaps", "pools", "unknown"], "text partition");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 2128,
    "partition identity or text extent changed");
  check(Array.isArray(partition.functions) && partition.functions.length === 0,
    "partition must remain free of accepted functions");
  const expected = new Map([
    ["gaps", [37, 1840, ["address", "mode", "size"]]],
    ["pools", [37, 224, ["address", "size"]]],
    ["unknown", [2, 64, ["address", "size"]]],
  ]);
  const intervals = [];
  for (const [name, [count, bytes, schema]] of expected) {
    check(Array.isArray(partition[name]) && partition[name].length === count, `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes, `partition ${name} byte total changed`);
    for (const [index, entry] of partition[name].entries()) exactKeys(entry, schema, `partition ${name} entry ${index}`);
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

function validateSourceRegistry(root) {
  const registry = readReviewedJson(root, "config", "CRO source registry");
  exactKeys(registry, ["schemaVersion", "units"], "CRO source registry");
  check(registry.schemaVersion === 1 && Array.isArray(registry.units), "CRO source registry identity changed");
  check(!registry.units.some((entry) => entry?.name === UNIT), "blocked unit unexpectedly has an authored-source claim");
}

function validateSpecification(root) {
  const specification = readReviewedText(root, "specification", "analysis handoff");
  for (const marker of ["AS_EUR_REV2", "2026-10-17", "independent ANALYSIS only", "No target-analysis engine started",
    "Deterministic whole-unit proof remains blocked"]) {
    check(specification.includes(marker), `analysis handoff lacks ${marker}`);
  }
}

function validateReport(root) {
  const report = readReviewedJson(root, "report", "checked-in objdiff report");
  exactKeys(report, ["version", "measures", "units"], "checked-in objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  check(objectSha256(unit) === REPORT_UNIT_SHA256, "report unit object identity changed");
  exactKeys(unit, ["name", "metadata", "measures", "sections"], "report unit");
  exactKeys(unit.metadata, ["complete"], "report metadata");
  check(unit.metadata.complete === false, "report completion is not fail-closed");
  check(!("functions" in unit), "report unexpectedly contains a function inventory");
  exactKeys(unit.measures, ["fuzzy_match_percent", "matched_code_percent", "matched_functions_percent",
    "complete_code_percent", "total_data", "total_units"], "report measures");
  check(unit.measures.fuzzy_match_percent === 0 && unit.measures.matched_code_percent === 0 &&
    unit.measures.matched_functions_percent === 0 && unit.measures.complete_code_percent === 0 &&
    unit.measures.total_data === "316" && unit.measures.total_units === 1,
  "report measures no longer describe the blocked zero-credit unit");
  const expected = new Map([[".text", "1840"], [".pool", "224"], [".rodata", "72"], [".data", "4"], [".bss", "16"]]);
  check(Array.isArray(unit.sections) && unit.sections.length === expected.size, "report section set changed");
  const seen = new Set();
  for (const section of unit.sections) {
    exactKeys(section, ["name", "size", "metadata"], `report section ${section.name}`);
    check(!seen.has(section.name) && expected.get(section.name) === section.size && section.metadata !== null &&
      Object.keys(section.metadata).length === 0, `report ${section.name} accounting or metadata changed`);
    seen.add(section.name);
  }
  check([...expected.keys()].every((name) => seen.has(name)), "report section set is incomplete");
}

function validateReviewedState(root) {
  validateManifest(root);
  validateInventory(root);
  validatePartition(root);
  validateSourceRegistry(root);
  validateSpecification(root);
  validateReport(root);
}

function copyReviewedFixture(destination) {
  for (const input of Object.values(REVIEWED_INPUTS)) {
    const target = join(destination, input.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(join(ROOT, input.path)));
  }
}

function expectFixtureFailure(name, mutate, expectedMessage) {
  const fixture = mkdtempSync(join(tmpdir(), "screen-effect-validator-"));
  const external = mkdtempSync(join(tmpdir(), "screen-effect-external-"));
  try {
    copyReviewedFixture(fixture);
    mutate(fixture, external);
    let message = "";
    try { validateReviewedState(fixture); }
    catch (error) { message = error.message; }
    check(expectedMessage.test(message), `self-test ${name} did not fail closed: ${message || "no error"}`);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
}

function expectReadRaceFailure(name, configure, expectedMessage) {
  const fixture = mkdtempSync(join(tmpdir(), "screen-effect-race-"));
  const external = mkdtempSync(join(tmpdir(), "screen-effect-race-external-"));
  try {
    copyReviewedFixture(fixture);
    let message = "";
    try {
      readOwnedRegularFile(fixture, REVIEWED_INPUTS.partition, "raced partition", configure(fixture, external));
    } catch (error) {
      message = error.message;
    }
    check(expectedMessage.test(message), `self-test ${name} did not fail closed: ${message || "no error"}`);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
}

function expectUnrelatedAggregateChangesAccepted() {
  const fixture = mkdtempSync(join(tmpdir(), "screen-effect-unrelated-"));
  try {
    copyReviewedFixture(fixture);
    const manifestPath = join(fixture, REVIEWED_INPUTS.manifest.path);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.units.find((entry) => entry.name !== REPORT_UNIT).size += 1;
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const reportPath = join(fixture, REVIEWED_INPUTS.report.path);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    report.units.find((entry) => entry.name !== REPORT_UNIT).metadata.audit_unrelated = true;
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    const configPath = join(fixture, REVIEWED_INPUTS.config.path);
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.units.push({ name: "AuditUnrelated", sources: [], functions: [] });
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
    validateReviewedState(fixture);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

function append(path) { writeFileSync(path, `${readFileSync(path, "utf8")} `); }

function runSelfTests() {
  const baseline = mkdtempSync(join(tmpdir(), "screen-effect-baseline-"));
  try { copyReviewedFixture(baseline); validateReviewedState(baseline); }
  finally { rmSync(baseline, { recursive: true, force: true }); }

  expectUnrelatedAggregateChangesAccepted();

  expectFixtureFailure("ancestor symlink escape", (fixture, external) => {
    const owned = join(fixture, "symbols", "cro-partitions");
    const escaped = join(external, "cro-partitions");
    renameSync(owned, escaped);
    symlinkSync(escaped, owned, "dir");
  }, /symbolic-link path component/u);
  expectFixtureFailure("duplicate JSON key", (fixture) => {
    const path = join(fixture, REVIEWED_INPUTS.partition.path);
    writeFileSync(path, readFileSync(path, "utf8").replace("{", '{"module":"duplicate",'));
  }, /duplicate key module/u);
  expectReadRaceFailure("ancestor swap between inspection and open", (fixture, external) => ({
    beforeOpen() {
      const owned = join(fixture, "symbols", "cro-partitions");
      const escaped = join(external, "cro-partitions");
      renameSync(owned, escaped);
      symlinkSync(escaped, owned, "dir");
    },
  }), /descriptor escaped|symbolic-link path component/u);
  expectReadRaceFailure("pathname replacement after descriptor open", (_fixture, external) => ({
    afterOpen(path) {
      const displaced = join(external, "displaced.json");
      renameSync(path, displaced);
      writeFileSync(path, readFileSync(displaced));
    },
  }), /changed while being read|pathname identity changed/u);
  expectFixtureFailure("manifest identity mutation", (fixture) => {
    const path = join(fixture, REVIEWED_INPUTS.manifest.path);
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    manifest.units.find((entry) => entry.name === REPORT_UNIT).sha256 = "0".repeat(64);
    writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  }, /published unit object identity changed/u);
  expectFixtureFailure("inventory identity mutation", (fixture) => {
    append(join(fixture, REVIEWED_INPUTS.inventory.path));
  }, /whole-file identity changed/u);
  expectFixtureFailure("coordinated partition and report mutations", (fixture) => {
    append(join(fixture, REVIEWED_INPUTS.partition.path));
    append(join(fixture, REVIEWED_INPUTS.report.path));
  }, /whole-file identity changed/u);
  expectFixtureFailure("report unit identity mutation", (fixture) => {
    const path = join(fixture, REVIEWED_INPUTS.report.path);
    const report = JSON.parse(readFileSync(path, "utf8"));
    report.units.find((entry) => entry.name === REPORT_UNIT).sections.reverse();
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  }, /report unit object identity changed/u);
  expectFixtureFailure("handoff identity mutation", (fixture) => {
    append(join(fixture, REVIEWED_INPUTS.specification.path));
  }, /whole-file identity changed/u);
  expectFixtureFailure("source registry identity mutation", (fixture) => {
    const path = join(fixture, REVIEWED_INPUTS.config.path);
    const config = JSON.parse(readFileSync(path, "utf8"));
    config.units.push({ name: UNIT, sources: [], functions: [] });
    writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`);
  }, /authored-source claim/u);
}

try {
  const argv = process.argv.slice(2);
  check(argv.length === 0 || (argv.length === 1 && argv[0] === "--self-test"),
    "usage: validate-cro-dll-field-event-screen-effect.mjs [--self-test]");
  if (argv[0] === "--self-test") runSelfTests();
  validateReviewedState(ROOT);
  console.log(`Validated ${REPORT_UNIT}: zero accepted functions, zero match credit, completion remains false.`);
  if (argv[0] === "--self-test") console.log("Hostile input self-tests passed.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
