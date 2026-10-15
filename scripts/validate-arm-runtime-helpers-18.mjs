import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "config/arm-runtime-helpers-18.json");
const manifestText = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const sourcePath = path.join(root, "src/main/arm_runtime_helpers_18.S");
const source = fs.readFileSync(sourcePath, "utf8");
const sources = JSON.parse(fs.readFileSync(path.join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-18 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002DB148", 96],
  ["func_002DB244", 64],
  ["func_002DB290", 408],
  ["func_002DBE24", 52],
  ["func_0030FDF8", 72],
  ["func_0030FE40", 72],
  ["func_00324BE0", 64],
  ["func_003979D4", 72],
  ["func_0039B308", 48],
];

if (
  Object.keys(manifest).sort().join(",") !== "functions,mode,schemaVersion,source" ||
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_runtime_helpers_18.S" ||
  manifest.mode !== "arm" ||
  JSON.stringify(manifest.functions.map(({ name, size }) => [name, size])) !==
    JSON.stringify(expectedFunctions) ||
  manifest.functions.some((entry) => Object.keys(entry).sort().join(",") !== "name,size") ||
  manifest.functions.reduce((total, entry) => total + entry.size, 0) !== 948
) {
  fail("the neutral manifest must describe the nine approved ARM helpers totaling 948 bytes");
}

if (createHash("sha256").update(manifestText).digest("hex") !==
    "6949afdc155eaac46a6f0765c718f7af89f9de8511f058adba928aa32ae9926f") {
  fail("the deterministic neutral manifest changed without validator review");
}
if (createHash("sha256").update(source).digest("hex") !==
    "1dce0adaa7812c6b27f1e1e5c7aeffb5f12fb302ecd936976a5268e45e1c0997") {
  fail("the deterministic semantic assembly source changed without validator review");
}

const registration = sources.sources.filter(({ path: entryPath }) => entryPath === manifest.source);
if (registration.length !== 1 || registration[0].mode !== "arm") {
  fail("config/sources.json must register the source exactly once in ARM mode");
}
if (!/^\.syntax unified$/m.test(source) || !/^\.arch armv6k$/m.test(source) ||
    !/^\.arm$/m.test(source) || !/^\.fpu vfpv2$/m.test(source)) {
  fail("the source must select unified ARMv6K syntax and VFPv2");
}
if (/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}
if (/^\s*(?:bl|blx|svc|mcr|mrc|dmb|dsb|isb|clrex)\b/im.test(source)) {
  fail("calls, system operations, and memory barriers are not permitted");
}

const quaternionMatch = source.match(
  /^func_002DB290:\n([\s\S]*?)^\.size func_002DB290, \. - func_002DB290$/m,
);
if (!quaternionMatch) {
  fail("func_002DB290 must have a bounded source body");
}
const quaternionInstructions = quaternionMatch[1]
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.endsWith(":"));
if (quaternionInstructions.length !== 102 ||
    quaternionInstructions.at(-1) !== "bx lr" ||
    quaternionInstructions.includes("nop")) {
  fail("func_002DB290 must contain 102 instructions with bx lr at byte 404 and no internal nop");
}
if (!/^\.size func_002DB290, \. - func_002DB290\n\.align 2\n\.L002DB290_zero:\n    \.float 0\.0\n\.L002DB290_one:\n    \.float 1\.0\n\.L002DB290_half:\n    \.float 0\.5$/m.test(source)) {
  fail("func_002DB290 must be followed immediately by its ordered 0.0, 1.0, 0.5 literal pool");
}

const objectPath = process.argv[2];
const readelf = process.argv[3];
if (Boolean(objectPath) !== Boolean(readelf)) {
  fail("object validation requires both an object path and readelf path");
}

if (objectPath) {
  const result = spawnSync(readelf, ["-sW", objectPath], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    fail("readelf could not inspect the base object");
  }
  const symbols = result.stdout
    .split("\n")
    .map((line) => line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({
      value: Number.parseInt(match[1], 16),
      size: Number.parseInt(match[2], 10),
      type: match[3],
      bind: match[4],
      index: match[6],
      name: match[7].trim(),
    }));

  for (const [name, size] of expectedFunctions) {
    const matches = symbols.filter((entry) => entry.name === name);
    if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL") {
      fail(`${name} must be represented by exactly one global function symbol in the base object`);
    }
    const symbol = matches[0];
    if (symbol.value !== 0 || symbol.size !== size) {
      fail(`${name} has an unexpected base-object section offset or size`);
    }
    if (!symbols.some((entry) => entry.name === "$a" && entry.index === symbol.index && entry.value === 0)) {
      fail(`${name} lacks an ARM mapping symbol at section offset zero`);
    }
  }

  const sectionResult = spawnSync(readelf, ["-SW", objectPath], { encoding: "utf8" });
  if (sectionResult.status !== 0) {
    process.stderr.write(sectionResult.stderr);
    fail("readelf could not inspect base-object sections");
  }
  const sections = sectionResult.stdout
    .split("\n")
    .map((line) => line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+(\S+)/))
    .filter(Boolean)
    .map((match) => ({
      index: match[1],
      name: match[2],
      size: Number.parseInt(match[3], 16),
      flags: match[4],
    }));
  const quaternionSections = sections.filter((entry) => entry.name === ".text.func_002DB290");
  if (quaternionSections.length !== 1 || quaternionSections[0].size !== 420 ||
      !quaternionSections[0].flags.includes("A") || !quaternionSections[0].flags.includes("X")) {
    fail("func_002DB290 must occupy a 420-byte executable section including its adjacent pool");
  }
  const quaternionSection = quaternionSections[0];
  if (!symbols.some((entry) => entry.name === "$d" &&
      entry.index === quaternionSection.index && entry.value === 408)) {
    fail("func_002DB290 must switch to pool data immediately after its 408-byte symbol");
  }
}

console.log(
  `Validated ${expectedFunctions.length} ARM runtime helpers${objectPath ? " in source and base object" : " in source"}.`,
);
