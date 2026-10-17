import assert from "node:assert/strict";
import { buildCroUnitManifest, serializeCroUnitManifest } from "./generate-cro-unit-manifest.mjs";

function moduleEntry(index) {
  return {
    name: `DllTest${String(index).padStart(3, "0")}.cro`,
    size: index + 1,
    sha256: index.toString(16).padStart(64, "0"),
    privatePath: `/must/not/escape/module-${index}.cro`,
    payload: "must-not-escape",
  };
}

const files = Array.from({ length: 145 }, (_, index) => moduleEntry(index)).reverse();
files.push({ name: "static.crs", size: 12, sha256: "f".repeat(64), privatePath: "/private/static.crs" });
files.push({ name: "static.crr", size: 16, sha256: "e".repeat(64), privatePath: "/private/static.crr" });
const input = { format: 1, moduleCount: 145, privateRoot: "/private", files };
const manifest = buildCroUnitManifest(input);
const serialized = serializeCroUnitManifest(manifest);

assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.target, "AS_EUR_REV2");
assert.equal(manifest.unitCount, 145);
assert.equal(manifest.units.length, 145);
assert.deepEqual(manifest.units[0], {
  name: "cro/DllTest000",
  size: 1,
  sha256: "0".repeat(64),
});
assert.deepEqual(Object.keys(manifest.units[0]), ["name", "size", "sha256"]);
assert(!serialized.includes("/private"));
assert(!serialized.includes("payload"));
assert(!serialized.includes("static.crs"));
assert.equal(
  serialized,
  serializeCroUnitManifest(buildCroUnitManifest({ ...input, files: [...files].reverse() })),
  "manifest must be independent of private inventory order",
);

assert.throws(
  () => buildCroUnitManifest({ ...input, files: files.slice(1), moduleCount: 144 }),
  /expected 145 modules, found 144/u,
);
assert.throws(
  () => buildCroUnitManifest({ ...input, files: [...files, moduleEntry(0)] }),
  /duplicate module/u,
);
assert.throws(
  () => buildCroUnitManifest({ ...input, files: files.map((entry, index) => index === 0 ? { ...entry, sha256: "bad" } : entry) }),
  /invalid SHA-256/u,
);
assert.throws(
  () => buildCroUnitManifest({ ...input, moduleCount: 144 }),
  /input moduleCount 144 does not match 145/u,
);

console.log("CRO public-unit manifest tests passed.");
