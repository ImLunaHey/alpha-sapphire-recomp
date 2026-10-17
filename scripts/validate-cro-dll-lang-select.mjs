#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const blockerPath = path.join(root, "docs/specs/cro/DllLangSelect_blocker.md");
const sourcesPath = path.join(root, "config/cro-sources.json");
const reportPath = path.join(root, "progress/reports/AS_EUR_REV2/report.json");
const packagePath = path.join(root, "package.json");

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
}

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const blocker = fs.readFileSync(blockerPath, "utf8");

if (process.argv.includes("--self-test")) selfTest();
validateState({
  blocker,
  sourceEntries: sources.units,
  reportUnits: report.units,
  scripts: packageJson.scripts,
});

console.log("Validated cro/DllLangSelect blocker and frozen public baseline (168 bytes; incomplete).");
