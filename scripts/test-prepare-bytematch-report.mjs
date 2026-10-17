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
assert.throws(() => validateAndNormalizeReport(credited), /grants 4 credit/);

const wrongInventory = fixture();
wrongInventory.csvFiles.set("DllEmpty", `${csv}00000000,"func_00000000","Global",$a,00000004,".text"\n`);
assert.throws(() => validateAndNormalizeReport(wrongInventory), /function count differs/);

console.log("prepare-bytematch-report tests: ok");
