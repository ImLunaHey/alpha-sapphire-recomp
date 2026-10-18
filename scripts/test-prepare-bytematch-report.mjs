#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  cpSync, existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareReport, validateAndNormalizeReport } from "./prepare-bytematch-report.mjs";

const csv = `# Format,CRO_FUNCTIONS_V1
# Module,cro/DllEmpty
# TextSize,00000004
Location,Name,Namespace,Mode,Size,Segment
`;

function fixture() {
  return {
    project: { progress: {
      matchedCodePercent: 100,
      matchedFunctions: 1,
      totalFunctions: 1,
      totalUnits: 2,
    } },
    manifest: {
      schemaVersion: 1,
      target: "TEST",
      unitCount: 1,
      units: [{ name: "cro/DllEmpty", size: 4, sha256: "0".repeat(64) }],
    },
    csvFiles: new Map([["DllEmpty", csv]]),
    report: {
      version: 2,
      measures: {
        matched_code_percent: 100,
        matched_functions: 1,
        total_functions: 1,
        total_units: 2,
      },
      units: [
        {
          name: "main/code",
          measures: { total_code: "4", matched_code: "4", total_functions: 1, matched_functions: 1 },
          functions: [{ name: "func_00000000", size: "4", address: "0", metadata: {} }],
          metadata: { complete: false, source_path: "src/main" },
        },
        {
          name: "cro/DllEmpty",
          measures: {
            fuzzy_match_percent: 100,
            matched_code_percent: 100,
            matched_functions_percent: 100,
            complete_code_percent: 100,
            total_units: 1,
          },
          sections: [{ name: ".text", size: "4", metadata: {} }],
          metadata: { complete: false },
        },
      ],
    },
  };
}

const valid = fixture();
validateAndNormalizeReport(valid);
for (const key of ["fuzzy_match_percent", "matched_code_percent",
  "matched_functions_percent", "complete_code_percent"]) {
  assert.equal(valid.report.units[1].measures[key], 0,
    `vacuous zero-function ${key} should be normalized`);
}

const unexpectedUnit = fixture();
unexpectedUnit.report.units[1].name = "cro/DllOther";
assert.throws(() => validateAndNormalizeReport(unexpectedUnit), /unit names do not exactly match/);

const duplicateUnit = fixture();
duplicateUnit.report.units[1].name = "main/code";
assert.throws(() => validateAndNormalizeReport(duplicateUnit), /unit names are missing or duplicated/);

const credited = fixture();
credited.report.units[1].measures.matched_code = "4";
assert.throws(() => validateAndNormalizeReport(credited), /credit differs/);

const authored = fixture();
authored.csvFiles.set("DllEmpty", `${csv}00000000,"func_00000000","Global",$a,00000004,".text"\n`);
authored.project.progress.matchedFunctions = 2;
authored.project.progress.totalFunctions = 2;
authored.report.measures.matched_functions = 2;
authored.report.measures.total_functions = 2;
authored.report.units[1].measures = {
  fuzzy_match_percent: 100,
  total_code: "4",
  matched_code: "4",
  matched_code_percent: 100,
  total_functions: 1,
  matched_functions: 1,
  matched_functions_percent: 100,
  total_units: 1,
};
authored.report.units[1].functions = [
  { name: "func_00000000", size: "4", fuzzy_match_percent: 100, address: "0", metadata: {} },
];
authored.croClaims = new Map([["DllEmpty", new Map([
  ["func_00000000", { address: 0, size: 4 }],
])]]);
authored.report.units[1].metadata.source_path = "src/cro/DllEmpty";
validateAndNormalizeReport(authored);

const singleSource = structuredClone(authored);
singleSource.croClaims = new Map([["DllEmpty", {
  functions: authored.croClaims.get("DllEmpty"),
  sourcePath: "src/cro/DllEmpty.c",
}]]);
singleSource.report.units[1].metadata.source_path = "src/cro/DllEmpty.c";
validateAndNormalizeReport(singleSource);

const fractional = structuredClone(authored);
fractional.csvFiles.set("DllEmpty", `${csv}00000000,"func_00000000","Global",$a,00000004,".text"\n00000004,"func_00000004","Global",$a,00000008,".text"\n`);
fractional.project.progress.totalFunctions = 3;
fractional.report.measures.total_functions = 3;
fractional.report.units[1].measures.total_code = "12";
fractional.report.units[1].measures.total_functions = 2;
fractional.report.units[1].measures.matched_code_percent = 33.333332;
fractional.report.units[1].measures.matched_functions_percent = 50;
fractional.report.units[1].functions.push(
  { name: "func_00000004", size: "8", address: "4", metadata: {} },
);
validateAndNormalizeReport(fractional);

const shortenedFloat32 = structuredClone(fractional);
shortenedFloat32.csvFiles.set("DllEmpty", `${csv}00000000,"func_00000000","Global",$a,00000130,".text"\n00000130,"func_00000130","Global",$a,0000022C,".text"\n`);
shortenedFloat32.report.units[1].measures.total_code = "860";
shortenedFloat32.report.units[1].measures.matched_code = "304";
shortenedFloat32.report.units[1].measures.matched_code_percent = 35.34884;
shortenedFloat32.report.units[1].functions = [
  { name: "func_00000000", size: "304", fuzzy_match_percent: 100, address: "0", metadata: {} },
  { name: "func_00000130", size: "556", address: "304", metadata: {} },
];
shortenedFloat32.croClaims = new Map([["DllEmpty", new Map([
  ["func_00000000", { address: 0, size: 304 }],
])]]);
validateAndNormalizeReport(shortenedFloat32);

const impreciseFractional = structuredClone(fractional);
impreciseFractional.report.units[1].measures.matched_code_percent = 33.333;
assert.throws(() => validateAndNormalizeReport(impreciseFractional), /matched-code percentage differs/);

const unconfiguredCredit = structuredClone(authored);
unconfiguredCredit.croClaims = new Map();
delete unconfiguredCredit.report.units[1].metadata.source_path;
assert.throws(() => validateAndNormalizeReport(unconfiguredCredit), /credit differs/);

const wrongInventory = fixture();
wrongInventory.csvFiles.set("DllEmpty", `${csv}00000000,"func_00000000","Global",$a,00000004,".text"\n`);
assert.throws(() => validateAndNormalizeReport(wrongInventory), /function count differs/);

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const temporary = mkdtempSync(join(tmpdir(), "prepare-bytematch-report-"));
const externalVictim = `${temporary}-victim`;
try {
  for (const directory of ["config", "progress", "symbols", "src"])
    cpSync(join(repositoryRoot, directory), join(temporary, directory), { recursive: true });
  const base = join("build", "AS_EUR_REV2", "base");
  mkdirSync(join(temporary, dirname(base)), { recursive: true });
  cpSync(join(repositoryRoot, base), join(temporary, base), { recursive: true });
  const paths = ["config/publication-units.json", "config/cro-sources.json",
    "progress/units/AS_EUR_REV2.cro.json", "progress/reports/AS_EUR_REV2/report.json",
    "progress/project.json"];
  const originals = new Map(paths.map(path => [path, readFileSync(join(temporary, path))]));
  const output = join(temporary, "build", "AS_EUR_REV2", "report.json");
  const reset = () => {
    for (const [path, contents] of originals) writeFileSync(join(temporary, path), contents);
    rmSync(output, { force: true });
  };
  const json = path => JSON.parse(readFileSync(join(temporary, path), "utf8"));
  const writeJson = (path, value) => writeFileSync(join(temporary, path), JSON.stringify(value));
  const mutateReport = update => {
    const path = "progress/reports/AS_EUR_REV2/report.json", report = json(path);
    update(report); writeJson(path, report);
  };
  const rejectsArtifact = (label, mutate) => {
    reset(); mutate();
    assert.throws(() => prepareReport({ rootPath: temporary }), undefined, label);
    assert.equal(existsSync(output), false, `${label} emitted an artifact`);
  };

  reset();
  prepareReport({ rootPath: temporary });
  assert.equal(existsSync(output), true, "valid direct report path did not emit an artifact");
  reset();
  prepareReport({ rootPath: temporary, afterValidation() {
    mutateReport(report => report.units[0].functions[0].name = "func_00ABCDEF");
  } });
  const swappedArtifact = JSON.parse(readFileSync(output, "utf8"));
  assert.equal(swappedArtifact.units[0].functions[0].name, "func_00100024",
    "post-validation input swap escaped into the artifact");
  assert.equal(json(paths[3]).units[0].functions[0].name, "func_00ABCDEF",
    "post-validation input swap fixture did not execute");
  rejectsArtifact("function identity", () => mutateReport(report =>
    report.units[0].functions[0].name = "func_00ABCDEF"));
  rejectsArtifact("function address", () => mutateReport(report =>
    report.units[0].functions[0].address = "4"));
  rejectsArtifact("function size", () => mutateReport(report =>
    report.units[0].functions[0].size = "4"));
  rejectsArtifact("function score", () => mutateReport(report =>
    report.units[0].functions[0].fuzzy_match_percent = 100));
  rejectsArtifact("replacement unit", () => mutateReport(report =>
    report.units.find(unit => unit.name === "cro/DllBackGround").name = "cro/DllGhost"));
  rejectsArtifact("coordinated ghost", () => {
    const universe = json(paths[0]); universe.units[1] = "cro/DllGhost"; writeJson(paths[0], universe);
    const manifest = json(paths[2]); manifest.units[0].name = "cro/DllGhost"; writeJson(paths[2], manifest);
    const report = json(paths[3]);
    report.units.find(unit => unit.name === "cro/DllBackGround").name = "cro/DllGhost";
    writeJson(paths[3], report);
    const config = json(paths[1]);
    config.units.find(unit => unit.name === "DllBackGround").name = "DllGhost";
    writeJson(paths[1], config);
  });
  rejectsArtifact("root aggregate", () => mutateReport(report => report.measures.matched_functions++));
  rejectsArtifact("coordinated data", () => mutateReport(report => {
    const unit = report.units.find(candidate => candidate.name === "cro/DllBackGround");
    unit.sections.find(section => section.name === ".data").size = "999";
    unit.measures.total_data = String(Number(unit.measures.total_data) + 999);
    report.measures.total_data = String(Number(report.measures.total_data) + 999);
  }));
  rejectsArtifact("complete metadata", () => mutateReport(report => report.units[0].metadata.complete = true));
  rejectsArtifact("source path", () => mutateReport(report => report.units[0].metadata.source_path = "src/fake"));
  reset(); writeFileSync(externalVictim, "external victim"); symlinkSync(externalVictim, output);
  assert.throws(() => prepareReport({ rootPath: temporary }), /unsafe existing report output/,
    "output symlink alias was accepted");
  assert.equal(readFileSync(externalVictim, "utf8"), "external victim", "output symlink overwrote its victim");
  reset(); writeFileSync(externalVictim, "external victim"); linkSync(externalVictim, output);
  assert.throws(() => prepareReport({ rootPath: temporary }), /unsafe existing report output/,
    "output hardlink alias was accepted");
  assert.equal(readFileSync(externalVictim, "utf8"), "external victim", "output hardlink overwrote its victim");
} finally {
  rmSync(temporary, { recursive: true, force: true });
  rmSync(externalVictim, { force: true });
}

console.log("prepare-bytematch-report tests: ok");
