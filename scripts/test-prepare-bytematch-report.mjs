#!/usr/bin/env node

import assert from "node:assert/strict";
import { validateAndNormalizeReport } from "./prepare-bytematch-report.mjs";

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
validateAndNormalizeReport(authored);

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
assert.throws(() => validateAndNormalizeReport(unconfiguredCredit), /credit differs/);

const wrongInventory = fixture();
wrongInventory.csvFiles.set("DllEmpty", `${csv}00000000,"func_00000000","Global",$a,00000004,".text"\n`);
assert.throws(() => validateAndNormalizeReport(wrongInventory), /function count differs/);

console.log("prepare-bytematch-report tests: ok");
