import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, expect, test } from "vitest";

import { verifyTarget } from "../scripts/verify-target.mjs";

// ROM-free fixtures: a synthetic target, CRO manifest, and private directory.
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
const code = Buffer.from("synthetic code");
const container = Buffer.from("synthetic container");
const modules = new Map(["DllAlpha", "DllBeta", "DllGamma"].map((name) => [name, Buffer.from(`module ${name}`)]));

let temporary;
let repositoryRoot;
let privateRoot;
let messages;

function verify(local) {
  return verifyTarget({ local: { VERSION: "TEST", ...local }, repositoryRoot, log: (line) => messages.push(line) });
}

beforeEach(() => {
  temporary = mkdtempSync(join(tmpdir(), "verify-target-"));
  repositoryRoot = join(temporary, "repo");
  privateRoot = join(temporary, "private");
  messages = [];
  mkdirSync(join(repositoryRoot, "config", "targets"), { recursive: true });
  mkdirSync(join(repositoryRoot, "progress", "units"), { recursive: true });
  mkdirSync(join(privateRoot, "cro-modules"), { recursive: true });
  writeFileSync(join(repositoryRoot, "config", "targets", "TEST.json"), JSON.stringify({
    productCode: "CTR-P-TEST",
    titleId: "0000000000000000",
    container: { size: container.length, sha256: digest(container) },
    exheader: { size: 4, sha256: digest(Buffer.from("exhd")) },
    code: { size: code.length, sha256: digest(code) },
  }));
  writeFileSync(join(repositoryRoot, "progress", "units", "TEST.cro.json"), JSON.stringify({
    schemaVersion: 1,
    target: "TEST",
    unitCount: modules.size,
    units: [...modules].map(([name, payload]) => ({ name: `cro/${name}`, size: payload.length, sha256: digest(payload) })),
  }));
  writeFileSync(join(privateRoot, "code.bin"), code);
  for (const [name, payload] of modules) writeFileSync(join(privateRoot, "cro-modules", `${name}.cro`), payload);
});

afterEach(() => {
  rmSync(temporary, { recursive: true, force: true });
});

test("pre-extracted inputs verify without ROM_PATH", async () => {
  // A non-matching exheader.bin is ignored in this mode.
  writeFileSync(join(privateRoot, "exheader.bin"), "other");
  await verify({ DECOMP_PRIVATE: privateRoot });
  expect(messages).toEqual([
    "TEST: code verified",
    "TEST: 3 CRO modules verified",
    "TEST: pre-extracted inputs verified (no ROM_PATH; container and exheader not checked)",
  ]);
});

test("pre-extracted mode requires code.bin", async () => {
  unlinkSync(join(privateRoot, "code.bin"));
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/must contain the decompressed code\.bin/u);
});

test("pre-extracted mode rejects a mismatched code.bin", async () => {
  writeFileSync(join(privateRoot, "code.bin"), Buffer.from("synthetic codf"));
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/code extraction does not match/u);
});

test("pre-extracted mode requires cro-modules", async () => {
  rmSync(join(privateRoot, "cro-modules"), { recursive: true });
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/must contain cro-modules/u);
});

test("pre-extracted mode rejects a missing CRO", async () => {
  unlinkSync(join(privateRoot, "cro-modules", "DllBeta.cro"));
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/missing private CRO: DllBeta\.cro/u);
});

test("pre-extracted mode rejects an extra CRO", async () => {
  writeFileSync(join(privateRoot, "cro-modules", "DllDelta.cro"), "extra");
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/unexpected private CRO: DllDelta\.cro/u);
});

test("pre-extracted mode rejects a mismatched CRO", async () => {
  writeFileSync(join(privateRoot, "cro-modules", "DllGamma.cro"), "module DllGammb");
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/SHA-256 mismatch for DllGamma\.cro/u);
});

test("pre-extracted mode rejects a symlinked CRO", async () => {
  const outside = join(temporary, "DllAlpha.cro");
  writeFileSync(outside, modules.get("DllAlpha"));
  unlinkSync(join(privateRoot, "cro-modules", "DllAlpha.cro"));
  symlinkSync(outside, join(privateRoot, "cro-modules", "DllAlpha.cro"));
  await expect(verify({ DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/not a regular file: DllAlpha\.cro/u);
});

test("pre-extracted mode rejects DECOMP_PRIVATE inside the repository", async () => {
  const inside = join(repositoryRoot, "private");
  mkdirSync(join(inside, "cro-modules"), { recursive: true });
  writeFileSync(join(inside, "code.bin"), code);
  await expect(verify({ DECOMP_PRIVATE: inside })).rejects.toThrow(/must remain outside the repository/u);
});

test("verification needs ROM_PATH or DECOMP_PRIVATE", async () => {
  await expect(verify({})).rejects.toThrow(/Set ROM_PATH to the target image, or DECOMP_PRIVATE/u);
});

test("ROM_PATH keeps the container check even when pre-extracted inputs are valid", async () => {
  const image = join(temporary, "image.3ds");
  writeFileSync(image, "wrong size");
  await expect(verify({ ROM_PATH: image, DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/Target size does not match/u);
  await expect(verify({ ROM_PATH: join(temporary, "missing.3ds") })).rejects.toThrow(/ROM_PATH does not name/u);
});

test("ROM_PATH verifies the container and any extracted executable files", async () => {
  const image = join(temporary, "image.3ds");
  writeFileSync(image, container);
  await verify({ ROM_PATH: image, DECOMP_PRIVATE: privateRoot });
  expect(messages).toEqual(["TEST: container verified (CTR-P-TEST, 0000000000000000)", "TEST: code verified"]);
  writeFileSync(join(privateRoot, "exheader.bin"), "other");
  await expect(verify({ ROM_PATH: image, DECOMP_PRIVATE: privateRoot })).rejects.toThrow(/exheader extraction does not match/u);
});
