import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runCroTargetBatch } from "./generate-cro-target-objects.mjs";

const temporary = mkdtempSync(join(tmpdir(), "cro-target-batch-"));
const privateDirectory = join(temporary, "private");
const outputDirectory = join(temporary, "target", "cro");
const manifestPath = join(temporary, "manifest.json");
mkdirSync(privateDirectory);

const modules = ["DllAlpha", "DllBeta", "DllGamma"];
const payloads = new Map(modules.map((name) => [name, Buffer.from(name)]));
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
const writeManifest = () => writeFileSync(manifestPath, `${JSON.stringify({
  schemaVersion: 1,
  target: "TEST",
  unitCount: modules.length,
  units: modules.map((name) => ({ name: `cro/${name}`, size: payloads.get(name).length, sha256: digest(payloads.get(name)) })),
}, null, 2)}\n`);
const writeInputs = () => {
  for (const [name, payload] of payloads) writeFileSync(join(privateDirectory, `${name}.cro`), payload);
  writeFileSync(join(privateDirectory, "static.crs"), "support");
  writeFileSync(join(privateDirectory, "static.crr"), "support");
};
const convert = (buffer) => {
  const moduleName = buffer.toString();
  return { parsed: { moduleName }, elf: Buffer.from(`ELF:${moduleName}`) };
};
const run = (overrides = {}) => runCroTargetBatch({
  root: process.cwd(),
  expectedTarget: "TEST",
  expectedCount: modules.length,
  manifestPath,
  privateDirectory,
  outputDirectory,
  convert,
  ...overrides,
});

try {
  writeManifest();
  writeInputs();
  assert.deepEqual(run(), { checked: 3, generated: 3, outputDirectory });
  assert.deepEqual(readdirSync(outputDirectory).sort(), modules.map((name) => `${name}.o`).sort());
  for (const name of modules) assert.equal(readFileSync(join(outputDirectory, `${name}.o`), "utf8"), `ELF:${name}`);
  assert.deepEqual(run({ check: true }), { checked: 3, generated: 0, outputDirectory });

  unlinkSync(join(privateDirectory, "DllBeta.cro"));
  assert.throws(() => run(), /missing private CRO: DllBeta\.cro/u);
  writeFileSync(join(privateDirectory, "DllBeta.cro"), payloads.get("DllBeta"));

  writeFileSync(join(privateDirectory, "DllExtra.cro"), "extra");
  assert.throws(() => run(), /unexpected private CRO: DllExtra\.cro/u);
  unlinkSync(join(privateDirectory, "DllExtra.cro"));

  writeFileSync(join(privateDirectory, "DllGamma.cro"), "BadGamma");
  assert.throws(() => run(), /SHA-256 mismatch for DllGamma\.cro/u);
  writeFileSync(join(privateDirectory, "DllGamma.cro"), payloads.get("DllGamma"));

  const before = new Map(modules.map((name) => [name, readFileSync(join(outputDirectory, `${name}.o`))]));
  assert.throws(() => run({ convert: (buffer) => {
    if (buffer.toString() === "DllBeta") throw new Error("synthetic conversion failure");
    return convert(buffer);
  } }), /synthetic conversion failure/u);
  for (const name of modules) assert(readFileSync(join(outputDirectory, `${name}.o`)).equals(before.get(name)),
    "failed batch must preserve the published directory");

  writeFileSync(join(outputDirectory, "extra.o"), "extra");
  assert.throws(() => run({ check: true }), /unexpected target output: extra\.o/u);
  assert.equal(run().generated, 3, "successful replacement must remove stale outputs");
  unlinkSync(join(outputDirectory, "DllBeta.o"));
  assert.throws(() => run({ check: true }), /missing target output: DllBeta\.o/u);
  assert.equal(run().generated, 3);
  writeFileSync(join(outputDirectory, "DllAlpha.o"), "stale");
  assert.throws(() => run({ check: true }), /stale target output: DllAlpha\.o/u);
  assert.equal(run().generated, 3);

  assert.throws(() => run({ convert: (buffer) => ({
    parsed: { moduleName: buffer.toString() === "DllGamma" ? "WrongName" : buffer.toString() },
    elf: Buffer.from("ELF"),
  }) }), /DllGamma\.cro declares module name "WrongName"/u);
  for (const name of modules) assert.equal(readFileSync(join(outputDirectory, `${name}.o`), "utf8"), `ELF:${name}`);

  console.log("CRO target batch tests passed (set/hash gates, deterministic checks, transactional publication). ");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
