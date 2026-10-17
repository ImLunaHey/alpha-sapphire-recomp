#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path, { isAbsolute, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));
const blockerPath = path.join(ROOT, "docs/specs/cro/DllLangSelect_blocker.md");
const sourcesPath = path.join(ROOT, "config/cro-sources.json");
const reportPath = path.join(ROOT, "progress/reports/AS_EUR_REV2/report.json");
const packagePath = path.join(ROOT, "package.json");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;

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

function fail(message) {
  throw new Error(`cro/DllLangSelect validation: ${message}`);
}

export function inside(parent, candidate) {
  const nested = relative(parent, candidate);
  return nested !== "" && nested !== ".." && !nested.startsWith(`..${sep}`) && !isAbsolute(nested);
}

export function readOwnedText(filePath, label, ownedRoot = ROOT) {
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
    stat = fs.lstatSync(filePath);
  } catch (error) {
    fail(`${label} cannot be inspected: ${error.message}`);
  }
  if (!stat.isFile() || stat.isSymbolicLink()) fail(`${label} is not a non-symlink regular file`);
  if (stat.size > MAX_INPUT_SIZE) fail(`${label} exceeds the 64 MiB input limit`);

  let canonicalPath;
  try {
    canonicalPath = fs.realpathSync(filePath);
  } catch (error) {
    fail(`${label} cannot be resolved: ${error.message}`);
  }
  if (canonicalPath !== filePath) fail(`${label} path is not canonical`);
  if (!inside(canonicalRoot, canonicalPath)) fail(`${label} canonical path is outside ROOT`);
  return fs.readFileSync(canonicalPath, "utf8");
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

export function validateState({ blocker, sourceEntries, reportUnits, scripts }) {
  assert.equal(typeof blocker, "string", "blocker document must be readable text");
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

  assert.ok(Array.isArray(reportUnits), "published report must contain a units array");
  const reportMatches = reportUnits.filter((entry) => entry?.name === "cro/DllLangSelect");
  assert.equal(reportMatches.length, 1, "report must contain exactly one cro/DllLangSelect unit");
  const reportUnit = reportMatches[0];
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

function fixtures() {
  return {
    blocker: [
      "# DllLangSelect publication blocker",
      "## Scope and provenance",
      "## Public metadata baseline",
      "## Missing behavioral evidence",
      "## Blocker and exit criteria",
      "## Evidence consulted",
      "cro/DllLangSelect AS_EUR_REV2",
      "734779d6819e24ba882999e1dc108d72095a1340",
      "The target revision was not independently verified.",
      "No new implementation, match credit, data reconstruction, or completion claim",
      "Implementation remains blocked",
    ].join("\n"),
    sourceEntries: [clone(expectedSource)],
    reportUnits: [{
      name: "cro/DllLangSelect",
      measures: clone(expectedMeasures),
      functions: [{ fuzzy_match_percent: 100 }],
      metadata: { complete: false, source_path: "src/cro/DllLangSelect" },
    }],
    scripts: {
      "validate:cro-dll-lang-select": "node --check scripts/validate-cro-dll-lang-select.mjs && node scripts/validate-cro-dll-lang-select.mjs --self-test",
      check: "npm run validate:cro-dll-lang-select && npm run check:clean",
    },
  };
}

function expectFailure(mutator, pattern) {
  const state = fixtures();
  mutator(state);
  assert.throws(() => validateState(state), pattern);
}

function selfTest() {
  validateState(fixtures());
  expectFailure((state) => { state.blocker = ""; }, /missing/);
  expectFailure((state) => { state.reportUnits[0].metadata.complete = true; }, /incomplete/);
  expectFailure((state) => { state.reportUnits[0].measures.matched_code = "169"; }, /matched_code/);
  expectFailure((state) => { state.sourceEntries[0].sources.push({ path: "extra.S", mode: "arm" }); }, /source claims/);
  expectFailure((state) => { state.reportUnits = {}; }, /units array/);
  expectFailure((state) => { state.scripts.check = "npm run check:clean"; }, /directly reachable/);

  assert.throws(
    () => rejectDuplicateJsonKeys('{"units":[],"units":[1]}', "config fixture"),
    /duplicate key units/,
  );
  assert.throws(
    () => rejectDuplicateJsonKeys('{"outer":{"complete":false,"complete":true}}', "report fixture"),
    /duplicate key complete/,
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
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

const sources = readOwnedJson(sourcesPath, "config/cro-sources.json");
const report = readOwnedJson(reportPath, "progress/reports/AS_EUR_REV2/report.json");
const packageJson = readOwnedJson(packagePath, "package.json");
const blocker = readOwnedText(blockerPath, "docs/specs/cro/DllLangSelect_blocker.md");

if (process.argv.includes("--self-test")) selfTest();
validateState({
  blocker,
  sourceEntries: sources.units,
  reportUnits: report.units,
  scripts: packageJson.scripts,
});

console.log("Validated cro/DllLangSelect blocker and frozen public baseline (168 bytes; incomplete).");
