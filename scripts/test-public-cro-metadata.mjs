import assert from "node:assert/strict";

import { validatePublicCroMetadata } from "./validate-public-cro-metadata.mjs";

function manifestUnit(index, name = `DllTest${String(index).padStart(3, "0")}`) {
  return { name: `cro/${name}`, size: 0x1000, sha256: index.toString(16).padStart(64, "0") };
}

const units = Array.from({ length: 144 }, (_, index) => manifestUnit(index));
units.push(manifestUnit(144, "DllEshop"));
units.sort((left, right) => left.name.localeCompare(right.name));
const manifest = { schemaVersion: 1, target: "AS_EUR_REV2", unitCount: 145, units };

function csv(stem, overrides = {}) {
  const textSize = overrides.textSize ?? "00000010";
  const name = overrides.name ?? "func_00000000";
  const size = overrides.size ?? "00000004";
  return ["# Format,CRO_FUNCTIONS_V1", `# Module,cro/${stem}`, `# TextSize,${textSize}`,
    "Location,Name,Namespace,Mode,Size,Segment",
    `00000000,"${name}","Global",$a,${size},".text"`, ""].join("\n");
}

function partition(stem, overrides = {}) {
  return JSON.stringify({ format: 1, module: overrides.module ?? stem, textSize: overrides.textSize ?? 16,
    functions: [{ name: overrides.name ?? "func_00000000", address: 0, size: overrides.functionSize ?? 4,
      mode: overrides.mode ?? "arm" }],
    gaps: [{ address: 4, size: 4, mode: "arm" }], pools: [{ address: 8, size: 4 }],
    unknown: [{ address: 12, size: 4 }], ...(overrides.extra ?? {}) });
}

function validate(stem = "DllTest000", csvText = csv(stem), partitionText = partition(stem), options = {}) {
  return validatePublicCroMetadata({ manifest, csvFiles: new Map([[stem, csvText]]),
    partitionFiles: new Map([[stem, partitionText]]), ...options });
}

assert.deepEqual(validate(), { unitCount: 1, functionCount: 1, textBytes: 16, complete: false });
assert.equal(validate("DllEshop", csv("DllEshop"), partition("DllEshop", { module: "DllEShop" })).unitCount, 1);
assert.throws(() => validate("DllEshop"), /module must be DllEShop/);
assert.throws(() => validate("DllEShop", csv("DllEShop"), partition("DllEShop")), /not a canonical manifest module/);
assert.throws(() => validate("DllTest000", csv("DllTest000"),
  partition("DllTest000", { extra: { privatePath: "/mnt/private/game.cro" } })), /fields must be exactly/);
assert.throws(() => validate("DllTest000", csv("DllTest000"),
  partition("DllTest000").replace('"module":"DllTest000"',
    '"module":"/mnt/private/game.cro","module":"DllTest000"')), /duplicate key module/);
assert.throws(() => validate("DllTest000", csv("DllTest000", { name: "RetailExport" })), /not canonical neutral metadata/);
assert.throws(() => validate("DllTest000", csv("DllTest000"),
  partition("DllTest000", { mode: "thumb" })), /function 0 differs/);
assert.throws(() => validate("DllTest000", csv("DllTest000"), JSON.stringify({
  format: 1, module: "DllTest000", textSize: 16,
  functions: [{ name: "func_00000000", address: 0, size: 4, mode: "arm" }],
  gaps: [{ address: 8, size: 4, mode: "arm" }], pools: [{ address: 4, size: 4 }], unknown: [],
})), /leaves a hole/);
assert.throws(() => validatePublicCroMetadata({ manifest,
  csvFiles: new Map([["DllTest000", csv("DllTest000")]]), partitionFiles: new Map() }),
  /file sets must be identical/);
assert.throws(() => validate(undefined, undefined, undefined, { requireComplete: true }),
  /complete publication must exactly match/);

const fullCsv = new Map(), fullPartitions = new Map();
for (const unit of manifest.units) {
  const stem = unit.name.slice("cro/".length);
  fullCsv.set(stem, csv(stem));
  fullPartitions.set(stem, partition(stem, { module: stem === "DllEshop" ? "DllEShop" : stem }));
}
assert.equal(validatePublicCroMetadata({ manifest, csvFiles: fullCsv, partitionFiles: fullPartitions }).complete, true);
fullPartitions.delete("DllTest143");
assert.throws(() => validatePublicCroMetadata({ manifest, csvFiles: fullCsv, partitionFiles: fullPartitions }),
  /file sets must be identical/);

console.log("Public CRO metadata validator tests passed.");
