import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  compareArtifactSet,
  compareInventories,
  publishArtifactSet,
  publishInventories,
  readModuleManifest,
  verifyExactFileSet,
} from "./generate-cro-symbols.mjs";

const root = mkdtempSync(join(tmpdir(), "as-cro-symbol-batch-"));
const manifestPath = join(root, "manifest.json");
writeFileSync(manifestPath, JSON.stringify({
  schemaVersion: 1,
  target: "AS_EUR_REV2",
  unitCount: 2,
  units: [{ name: "cro/DllAlpha" }, { name: "cro/DllBeta" }],
}));
const modules = readModuleManifest(manifestPath, 2);
assert.deepEqual(modules, ["DllAlpha", "DllBeta"]);
const generated = join(root, "generated");
const published = join(root, "symbols", "cro");
mkdirSync(generated, { recursive: true });
for (const module of modules) writeFileSync(join(generated, `${module}.csv`), `${module}\n`);
verifyExactFileSet(generated, modules, ".csv");
publishInventories(generated, published, modules);
compareInventories(generated, published, modules);
assert.equal(readFileSync(join(published, "DllAlpha.csv"), "utf8"), "DllAlpha\n");
writeFileSync(join(generated, "DllAlpha.csv"), "changed\n");
assert.throws(() => compareInventories(generated, published, modules), /DllAlpha\.csv is stale/);
writeFileSync(join(generated, "DllExtra.csv"), "extra\n");
assert.throws(() => verifyExactFileSet(generated, modules, ".csv"), /extra: DllExtra\.csv/);
assert.throws(() => readModuleManifest(manifestPath, 3), /exactly 3 units/);

const generatedJson = join(root, "generated-json");
const publishedJson = join(root, "symbols", "cro-partitions");
mkdirSync(generatedJson, { recursive: true });
for (const module of modules) writeFileSync(join(generatedJson, `${module}.json`), `${module} partition\n`);
const artifactSet = [
  { label: "test-csv", generated, published, extension: ".csv" },
  { label: "test-json", generated: generatedJson, published: publishedJson, extension: ".json" },
];
// Remove the deliberately injected extra file before testing exact-set publication.
unlinkSync(join(generated, "DllExtra.csv"));
publishArtifactSet(artifactSet, modules);
compareArtifactSet(artifactSet, modules);
assert.equal(readFileSync(join(publishedJson, "DllBeta.json"), "utf8"), "DllBeta partition\n");
console.log("CRO symbol batch driver tests: ok");
