#!/usr/bin/env node

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path, { isAbsolute, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));
const blockerPath = path.join(ROOT, "docs/specs/cro/DllLangSelect_blocker.md");
const sourcesPath = path.join(ROOT, "config/cro-sources.json");
const manifestPath = path.join(ROOT, "progress/units/AS_EUR_REV2.cro.json");
const inventoryPath = path.join(ROOT, "symbols/cro/DllLangSelect.csv");
const partitionPath = path.join(ROOT, "symbols/cro-partitions/DllLangSelect.json");
const reportPath = path.join(ROOT, "progress/reports/AS_EUR_REV2/report.json");
const packagePath = path.join(ROOT, "package.json");
const sourcePath = path.join(ROOT, "src/cro/DllLangSelect/contract_09.S");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;
// Exact UTF-8 bytes of the reviewed blocker document.
const EXPECTED_BLOCKER_SHA256 = "87e481270e3b2caabe9d3d4290325ef22cbd92473d57eca33488c9e54103dfaf";
// Exact UTF-8 bytes of the reviewed public function inventory.
const EXPECTED_INVENTORY_SHA256 = "03cba23c86a6e5784d6bfca3192d16dd13614def87a1e70b76e842ec46c3cc40";
// JSON.stringify of the complete reviewed partition after duplicate-key rejection.
const EXPECTED_PARTITION_SHA256 = "b45edadba3c6289b667844840810ddf24ca6f2d5bd34b6c46e976086fc58e108";
// JSON.stringify of the complete reviewed report unit after duplicate-key rejection.
const EXPECTED_REPORT_UNIT_SHA256 = "4ab865d800c7b0866eb3e863f1826aef528ae13a17eaf5438ba65d187206c98e";
// Exact UTF-8 bytes of the only source registered for this unit.
const EXPECTED_SOURCE_SHA256 = "240cb8e2a26c2c6241189fef65fee3bb54439987a50daa0ed15ca33d7ff68fd8";
const EXPECTED_SOURCE_SIZE = 1201;

const expectedManifestEntry = {
  name: "cro/DllLangSelect",
  size: 16384,
  sha256: "a08dd6616b6aa2de369edb6c0e6e236beeb22e3397d7bbaf618955935385b912",
};

const expectedFunctions = [
  { name: "func_000002B8", address: 696, size: 368, mode: "arm" },
  { name: "func_00000704", address: 1796, size: 268, mode: "arm" },
  { name: "func_00000DD4", address: 3540, size: 216, mode: "arm" },
  { name: "func_00000EB0", address: 3760, size: 168, mode: "arm" },
  { name: "func_00001298", address: 4760, size: 316, mode: "arm" },
  { name: "func_000013E8", address: 5096, size: 676, mode: "arm" },
  { name: "func_00001698", address: 5784, size: 232, mode: "arm" },
];

const expectedSource = {
  name: "DllLangSelect",
  sources: [{ path: "src/cro/DllLangSelect/contract_09.S", mode: "arm" }],
  functions: [{
    name: "func_00000EB0",
    address: 3760,
    size: 168,
    semantics: "contract-09-language-layout-update",
  }],
};

const expectedMeasures = {
  total_code: "2244",
  matched_code: "168",
  total_data: "1456",
  total_functions: 7,
  matched_functions: 1,
};

function clone(value) {
  return structuredClone(value);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function fail(message) {
  throw new Error(`cro/DllLangSelect validation: ${message}`);
}

export function inside(parent, candidate) {
  const nested = relative(parent, candidate);
  return nested !== "" && nested !== ".." && !nested.startsWith(`..${sep}`) && !isAbsolute(nested);
}

function sameFileIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function sameFileSnapshot(left, right) {
  return sameFileIdentity(left, right)
    && left.mode === right.mode
    && left.size === right.size
    && left.mtimeNs === right.mtimeNs
    && left.ctimeNs === right.ctimeNs;
}

export function readOwnedText(filePath, label, ownedRoot = ROOT, testHooks = undefined) {
  let canonicalRoot;
  try {
    canonicalRoot = fs.realpathSync(ownedRoot);
  } catch (error) {
    fail(`${label} root cannot be resolved: ${error.message}`);
  }
  if (canonicalRoot !== ownedRoot) fail(`${label} root is not canonical`);
  if (!inside(canonicalRoot, filePath)) fail(`${label} is outside ROOT`);

  let stat;
  try {
    stat = fs.lstatSync(filePath, { bigint: true });
  } catch (error) {
    fail(`${label} cannot be inspected: ${error.message}`);
  }
  if (!stat.isFile() || stat.isSymbolicLink()) fail(`${label} is not a non-symlink regular file`);
  if (stat.size > BigInt(MAX_INPUT_SIZE)) fail(`${label} exceeds the 64 MiB input limit`);

  let canonicalPath;
  try {
    canonicalPath = fs.realpathSync(filePath);
  } catch (error) {
    fail(`${label} cannot be resolved: ${error.message}`);
  }
  if (canonicalPath !== filePath) fail(`${label} path is not canonical`);
  if (!inside(canonicalRoot, canonicalPath)) fail(`${label} canonical path is outside ROOT`);

  let descriptor;
  try {
    testHooks?.beforeOpen?.();
    descriptor = fs.openSync(filePath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  } catch (error) {
    fail(`${label} cannot be opened without following symlinks: ${error.message}`);
  }

  try {
    const opened = fs.fstatSync(descriptor, { bigint: true });
    if (!opened.isFile()) fail(`${label} opened descriptor is not a regular file`);
    if (opened.size > BigInt(MAX_INPUT_SIZE)) fail(`${label} exceeds the 64 MiB input limit`);
    if (!sameFileIdentity(stat, opened)) fail(`${label} changed before it was opened`);

    testHooks?.afterOpen?.();
    const text = fs.readFileSync(descriptor, "utf8");
    testHooks?.afterRead?.();

    const afterRead = fs.fstatSync(descriptor, { bigint: true });
    if (!sameFileSnapshot(opened, afterRead)) fail(`${label} changed while it was read`);
    testHooks?.afterDescriptorCheck?.();

    let pathAfterRead;
    try {
      pathAfterRead = fs.lstatSync(filePath, { bigint: true });
    } catch (error) {
      fail(`${label} path changed while it was read: ${error.message}`);
    }
    if (!pathAfterRead.isFile() || pathAfterRead.isSymbolicLink()) {
      fail(`${label} path changed to a non-regular file while it was read`);
    }
    if (!sameFileSnapshot(opened, pathAfterRead)) fail(`${label} path snapshot changed while it was read`);

    let canonicalPathAfterRead;
    try {
      canonicalPathAfterRead = fs.realpathSync(filePath);
    } catch (error) {
      fail(`${label} path cannot be resolved after reading: ${error.message}`);
    }
    if (canonicalPathAfterRead !== filePath) fail(`${label} path stopped being canonical while it was read`);
    if (!inside(canonicalRoot, canonicalPathAfterRead)) fail(`${label} path escaped ROOT while it was read`);
    testHooks?.beforeFinalDescriptorCheck?.();
    const finalDescriptor = fs.fstatSync(descriptor, { bigint: true });
    if (!sameFileSnapshot(opened, finalDescriptor)) fail(`${label} changed before validation completed`);
    return text;
  } finally {
    fs.closeSync(descriptor);
  }
}

export function rejectDuplicateJsonKeys(text, label) {
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
    if (index > text.length || text[index - 1] !== '"') fail(`${label} has an unterminated string`);
    let cursor = index;
    while (/\s/u.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const owner = stack.at(-1);
    if (owner?.type !== "object") fail(`${label} has a key outside an object`);
    let key;
    try {
      key = JSON.parse(text.slice(start, index));
    } catch {
      fail(`${label} contains an invalid key`);
    }
    if (owner.keys.has(key)) fail(`${label} contains duplicate key ${key}`);
    owner.keys.add(key);
  }
}

export function readOwnedJson(filePath, label, ownedRoot = ROOT) {
  const text = readOwnedText(filePath, label, ownedRoot);
  rejectDuplicateJsonKeys(text, label);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function parseInventory(inventory) {
  assert.equal(sha256(inventory), EXPECTED_INVENTORY_SHA256, "reviewed DllLangSelect inventory identity changed");
  const lines = inventory.split(/\r?\n/u);
  assert.equal(lines.pop(), "", "DllLangSelect inventory must end with one newline");
  assert.deepEqual(lines.slice(0, 4), [
    "# Format,CRO_FUNCTIONS_V1",
    "# Module,cro/DllLangSelect",
    "# TextSize,00001B54",
    "Location,Name,Namespace,Mode,Size,Segment",
  ], "DllLangSelect inventory schema changed");
  const functions = lines.slice(4).map((line, index) => {
    const match = /^([0-9A-F]{8}),"(func_[0-9A-F]{8})","Global",\$(a|t),([0-9A-F]{8}),"\.text"$/u.exec(line);
    assert.ok(match, `DllLangSelect inventory entry ${index} is not canonical`);
    return {
      name: match[2],
      address: Number.parseInt(match[1], 16),
      size: Number.parseInt(match[4], 16),
      mode: match[3] === "a" ? "arm" : "thumb",
    };
  });
  assert.deepEqual(functions, expectedFunctions, "DllLangSelect inventory entries changed");
  return functions;
}

function validatePartition(partition, inventoryFunctions) {
  assert.equal(
    sha256(JSON.stringify(partition)),
    EXPECTED_PARTITION_SHA256,
    "reviewed DllLangSelect partition identity changed",
  );
  assert.deepEqual(
    Object.keys(partition).sort(),
    ["format", "functions", "gaps", "module", "pools", "textSize", "unknown"],
    "DllLangSelect partition schema changed",
  );
  assert.equal(partition.format, 1, "DllLangSelect partition format changed");
  assert.equal(partition.module, "DllLangSelect", "DllLangSelect partition module changed");
  assert.equal(partition.textSize, 6996, "DllLangSelect partition text size changed");
  assert.deepEqual(partition.functions, expectedFunctions, "DllLangSelect partition function entries changed");
  assert.deepEqual(partition.functions, inventoryFunctions, "DllLangSelect inventory and partition functions diverged");
  assert.equal(partition.gaps?.length, 107, "DllLangSelect partition gap entries changed");
  assert.equal(partition.pools?.length, 111, "DllLangSelect partition pool entries changed");
  assert.equal(partition.unknown?.length, 4, "DllLangSelect partition unknown entries changed");
}

export function validateState({ blocker, source, sourceEntries, manifest, inventory, partition, reportUnits, scripts }) {
  assert.equal(typeof blocker, "string", "blocker document must be readable text");
  assert.equal(
    sha256(blocker),
    EXPECTED_BLOCKER_SHA256,
    "canonical DllLangSelect blocker content digest changed",
  );
  const normalizedBlocker = blocker.replace(/\s+/g, " ");
  for (const required of [
    "# DllLangSelect publication blocker",
    "## Scope and provenance",
    "## Public metadata baseline",
    "## Missing behavioral evidence",
    "## Blocker and exit criteria",
    "## Evidence consulted",
    "cro/DllLangSelect",
    "AS_EUR_REV2",
    "734779d6819e24ba882999e1dc108d72095a1340",
    "The target revision was not independently verified.",
    "No new implementation, match credit, data reconstruction, or completion claim",
    "Implementation remains blocked",
  ]) {
    assert.ok(normalizedBlocker.includes(required.replace(/\s+/g, " ")), `blocker document is missing: ${required}`);
  }

  assert.ok(Array.isArray(sourceEntries), "cro source registry must contain a units array");
  const sourceMatches = sourceEntries.filter((entry) => entry?.name === "DllLangSelect");
  assert.equal(sourceMatches.length, 1, "source registry must contain exactly one DllLangSelect entry");
  assert.deepEqual(sourceMatches[0], expectedSource, "DllLangSelect source claims changed from the frozen baseline");
  assert.equal(Buffer.byteLength(source, "utf8"), EXPECTED_SOURCE_SIZE, "reviewed DllLangSelect source size changed");
  assert.equal(sha256(source), EXPECTED_SOURCE_SHA256, "reviewed DllLangSelect source identity changed");

  assert.equal(manifest?.schemaVersion, 1, "CRO manifest schema changed");
  assert.equal(manifest?.target, "AS_EUR_REV2", "CRO manifest target changed");
  assert.equal(manifest?.unitCount, 145, "CRO manifest unit count changed");
  assert.ok(Array.isArray(manifest?.units), "CRO manifest must contain a units array");
  const manifestMatches = manifest.units.filter((entry) => entry?.name === "cro/DllLangSelect");
  assert.equal(manifestMatches.length, 1, "manifest must contain exactly one cro/DllLangSelect entry");
  assert.deepEqual(manifestMatches[0], expectedManifestEntry, "reviewed DllLangSelect manifest entry changed");

  const inventoryFunctions = parseInventory(inventory);
  validatePartition(partition, inventoryFunctions);

  assert.ok(Array.isArray(reportUnits), "published report must contain a units array");
  const reportMatches = reportUnits.filter((entry) => entry?.name === "cro/DllLangSelect");
  assert.equal(reportMatches.length, 1, "report must contain exactly one cro/DllLangSelect unit");
  const reportUnit = reportMatches[0];
  assert.equal(
    sha256(JSON.stringify(reportUnit)),
    EXPECTED_REPORT_UNIT_SHA256,
    "reviewed DllLangSelect report-unit identity changed",
  );
  assert.equal(reportUnit?.metadata?.complete, false, "DllLangSelect must remain explicitly incomplete");
  assert.equal(reportUnit?.metadata?.source_path, "src/cro/DllLangSelect", "unexpected DllLangSelect source path");
  for (const [key, value] of Object.entries(expectedMeasures)) {
    assert.equal(reportUnit?.measures?.[key], value, `DllLangSelect report measure changed: ${key}`);
  }
  assert.equal(
    reportUnit?.functions?.filter((entry) => entry?.fuzzy_match_percent === 100).length,
    1,
    "DllLangSelect published matched-function credit changed",
  );

  assert.equal(
    scripts?.["validate:cro-dll-lang-select"],
    "node --check scripts/validate-cro-dll-lang-select.mjs && node scripts/validate-cro-dll-lang-select.mjs --self-test",
    "focused npm validator is missing or not fail-closed",
  );
  assert.match(
    scripts?.check ?? "",
    /(?:^|&&\s*)npm run validate:cro-dll-lang-select(?:\s*&&|$)/,
    "focused DllLangSelect validator must be directly reachable from npm run check",
  );
}

function expectFailure(baseline, mutator, pattern) {
  const state = clone(baseline);
  mutator(state);
  assert.throws(() => validateState(state), pattern);
}

function selfTest(baseline) {
  validateState(baseline);
  expectFailure(baseline, (state) => { state.blocker = ""; }, /blocker content digest/);
  expectFailure(
    baseline,
    (state) => {
      state.blocker += "\n\nContradictory mutation: implementation is approved and the unit is complete.\n";
    },
    /blocker content digest/,
  );
  expectFailure(baseline, (state) => {
    state.reportUnits.find((entry) => entry?.name === "cro/DllLangSelect").metadata.complete = true;
  }, /report-unit identity/);
  expectFailure(baseline, (state) => {
    state.reportUnits.find((entry) => entry?.name === "cro/DllLangSelect").measures.matched_code = "169";
  }, /report-unit identity/);
  expectFailure(
    baseline,
    (state) => {
      const reportUnit = state.reportUnits.find((entry) => entry?.name === "cro/DllLangSelect");
      const oldMatch = reportUnit.functions.find((entry) => entry.name === "func_00000EB0");
      const reassignedMatch = reportUnit.functions.find((entry) => entry.name === "func_000002B8");
      delete oldMatch.fuzzy_match_percent;
      reassignedMatch.fuzzy_match_percent = 100;
    },
    /report-unit identity/,
  );
  expectFailure(baseline, (state) => {
    state.sourceEntries.find((entry) => entry?.name === "DllLangSelect")
      .sources.push({ path: "extra.S", mode: "arm" });
  }, /source claims/);
  expectFailure(baseline, (state) => { state.source += "\n"; }, /source size/);
  expectFailure(baseline, (state) => {
    state.source = `${state.source[0] === "X" ? "Y" : "X"}${state.source.slice(1)}`;
  }, /source identity/);
  expectFailure(baseline, (state) => {
    state.manifest.units.find((entry) => entry?.name === "cro/DllLangSelect").sha256 = "0".repeat(64);
  }, /manifest entry/);
  expectFailure(baseline, (state) => {
    state.inventory = state.inventory.replace("000002B8", "000002BC");
  }, /inventory identity/);
  expectFailure(baseline, (state) => {
    state.partition.functions.find((entry) => entry.name === "func_000002B8").address += 4;
  }, /partition identity/);
  expectFailure(baseline, (state) => {
    state.inventory = state.inventory.replace("000002B8", "000002BC");
    state.partition.functions.find((entry) => entry.name === "func_000002B8").address += 4;
  }, /inventory identity/);
  expectFailure(baseline, (state) => { state.reportUnits = {}; }, /units array/);
  expectFailure(baseline, (state) => { state.scripts.check = "npm run check:clean"; }, /directly reachable/);

  assert.throws(
    () => rejectDuplicateJsonKeys('{"units":[],"units":[1]}', "config fixture"),
    /duplicate key units/,
  );
  assert.throws(
    () => rejectDuplicateJsonKeys('{"outer":{"complete":false,"complete":true}}', "report fixture"),
    /duplicate key complete/,
  );
  assert.throws(
    () => rejectDuplicateJsonKeys('{"units":[],"units":[1]}', "manifest fixture"),
    /duplicate key units/,
  );
  assert.throws(
    () => rejectDuplicateJsonKeys('{"functions":[],"functions":[1]}', "partition fixture"),
    /duplicate key functions/,
  );
  assert.throws(
    () => rejectDuplicateJsonKeys('{"scr\u0069pts":{},"scripts":{"check":"ok"}}', "package fixture"),
    /duplicate key scripts/,
  );

  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dll-lang-select-validator-"));
  try {
    const canonicalRoot = fs.realpathSync(temporaryRoot);
    const regularPath = path.join(canonicalRoot, "blocker.md");
    const symlinkPath = path.join(canonicalRoot, "blocker-link.md");
    const outsidePath = path.join(path.dirname(canonicalRoot), "outside-blocker.md");
    const realDirectory = path.join(canonicalRoot, "real");
    const linkedDirectory = path.join(canonicalRoot, "linked");
    fs.writeFileSync(regularPath, "blocker fixture\n", { flag: "wx" });
    fs.symlinkSync(regularPath, symlinkPath);
    fs.mkdirSync(realDirectory);
    fs.writeFileSync(path.join(realDirectory, "report.json"), "{}\n", { flag: "wx" });
    fs.symlinkSync(realDirectory, linkedDirectory, "dir");

    assert.equal(readOwnedText(regularPath, "regular fixture", canonicalRoot), "blocker fixture\n");
    assert.throws(
      () => readOwnedText(symlinkPath, "symlink fixture", canonicalRoot),
      /non-symlink regular file/,
    );
    assert.throws(
      () => readOwnedText(path.join(linkedDirectory, "report.json"), "noncanonical fixture", canonicalRoot),
      /not canonical/,
    );
    assert.throws(
      () => readOwnedText(outsidePath, "outside fixture", canonicalRoot),
      /outside ROOT/,
    );

    const mutablePath = path.join(canonicalRoot, "mutable.txt");
    fs.writeFileSync(mutablePath, "stable fixture\n", { flag: "wx" });
    assert.throws(
      () => readOwnedText(mutablePath, "content race fixture", canonicalRoot, {
        afterRead: () => fs.appendFileSync(mutablePath, "raced\n"),
      }),
      /changed while it was read/,
    );

    const boundaryPath = path.join(canonicalRoot, "boundary.txt");
    fs.writeFileSync(boundaryPath, "boundary one\n", { flag: "wx" });
    assert.throws(
      () => readOwnedText(boundaryPath, "snapshot boundary fixture", canonicalRoot, {
        afterDescriptorCheck: () => fs.writeFileSync(boundaryPath, "boundary two\n"),
      }),
      /path snapshot changed while it was read/,
    );

    const finalBoundaryPath = path.join(canonicalRoot, "final-boundary.txt");
    fs.writeFileSync(finalBoundaryPath, "final one\n", { flag: "wx" });
    assert.throws(
      () => readOwnedText(finalBoundaryPath, "final descriptor fixture", canonicalRoot, {
        beforeFinalDescriptorCheck: () => fs.writeFileSync(finalBoundaryPath, "final two\n"),
      }),
      /changed before validation completed/,
    );

    const replacedPath = path.join(canonicalRoot, "replaced.txt");
    const displacedPath = path.join(canonicalRoot, "displaced.txt");
    fs.writeFileSync(replacedPath, "original fixture\n", { flag: "wx" });
    assert.throws(
      () => readOwnedText(replacedPath, "path race fixture", canonicalRoot, {
        afterOpen: () => {
          fs.renameSync(replacedPath, displacedPath);
          fs.writeFileSync(replacedPath, "replacement fixture\n", { flag: "wx" });
        },
      }),
      /changed while it was read/,
    );

    const noFollowPath = path.join(canonicalRoot, "nofollow.txt");
    const noFollowOriginalPath = path.join(canonicalRoot, "nofollow-original.txt");
    const noFollowTargetPath = path.join(canonicalRoot, "nofollow-target.txt");
    fs.writeFileSync(noFollowPath, "original nofollow fixture\n", { flag: "wx" });
    fs.writeFileSync(noFollowTargetPath, "target nofollow fixture\n", { flag: "wx" });
    assert.throws(
      () => readOwnedText(noFollowPath, "nofollow race fixture", canonicalRoot, {
        beforeOpen: () => {
          fs.renameSync(noFollowPath, noFollowOriginalPath);
          fs.symlinkSync(noFollowTargetPath, noFollowPath);
        },
      }),
      /cannot be opened without following symlinks/,
    );
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

const sources = readOwnedJson(sourcesPath, "config/cro-sources.json");
const manifest = readOwnedJson(manifestPath, "progress/units/AS_EUR_REV2.cro.json");
const inventory = readOwnedText(inventoryPath, "symbols/cro/DllLangSelect.csv");
const partition = readOwnedJson(partitionPath, "symbols/cro-partitions/DllLangSelect.json");
const report = readOwnedJson(reportPath, "progress/reports/AS_EUR_REV2/report.json");
const packageJson = readOwnedJson(packagePath, "package.json");
const blocker = readOwnedText(blockerPath, "docs/specs/cro/DllLangSelect_blocker.md");
const source = readOwnedText(sourcePath, "src/cro/DllLangSelect/contract_09.S");

const actualState = {
  blocker,
  source,
  sourceEntries: sources.units,
  manifest,
  inventory,
  partition,
  reportUnits: report.units,
  scripts: packageJson.scripts,
};
if (process.argv.includes("--self-test")) selfTest(actualState);
validateState(actualState);

console.log("Validated cro/DllLangSelect blocker and frozen public baseline (168 bytes; incomplete).");
