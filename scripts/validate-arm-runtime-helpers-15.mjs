import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "config/arm-runtime-helpers-15.json");
const manifestText = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const sourcePath = path.join(root, "src/main/arm_runtime_helpers_15.S");
const source = fs.readFileSync(sourcePath, "utf8");
const sources = JSON.parse(fs.readFileSync(path.join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-15 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_00195C78", 228],
  ["func_0019B4D8", 80],
  ["func_0019B528", 60],
  ["func_0019B65C", 40],
  ["func_0019B6B0", 56],
  ["func_0019B6E8", 60],
  ["func_0019B76C", 76],
  ["func_0019BCC8", 104],
  ["func_0019BD30", 116],
  ["func_0019BDA4", 60],
  ["func_001E1CA8", 32],
  ["func_001F9544", 64],
];

if (
  Object.keys(manifest).sort().join(",") !== "functions,mode,schemaVersion,source" ||
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_runtime_helpers_15.S" ||
  manifest.mode !== "arm" ||
  JSON.stringify(manifest.functions.map(({ name, size }) => [name, size])) !==
    JSON.stringify(expectedFunctions) ||
  manifest.functions.some((entry) => Object.keys(entry).sort().join(",") !== "name,size") ||
  manifest.functions.reduce((total, entry) => total + entry.size, 0) !== 976
) {
  fail("the neutral manifest must describe the twelve approved ARM helpers totaling 976 bytes");
}

if (createHash("sha256").update(manifestText).digest("hex") !==
    "2914d33179f80fee6dfe49e73452cbef6dbe0c4a3fab711e34717dbffd75219e") {
  fail("the deterministic neutral manifest changed without validator review");
}
if (createHash("sha256").update(source).digest("hex") !==
    "f8b2cc74202af5ccf301f103177f4e775fcd0533c179a977c9dd977396585d1f") {
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

for (const [name] of expectedFunctions) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const required = [
    new RegExp(`^\\.section \\.text\\.${escaped}, "ax", %progbits$`, "m"),
    new RegExp(`^\\.global ${escaped}$`, "m"),
    new RegExp(`^\\.type ${escaped}, %function$`, "m"),
    new RegExp(`^${escaped}:$`, "m"),
    new RegExp(`^\\.size ${escaped}, \\. - ${escaped}$`, "m"),
  ];
  if (required.some((pattern) => !pattern.test(source))) {
    fail(`${name} is missing required section or ELF function metadata`);
  }
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
}

console.log(
  `Validated ${expectedFunctions.length} ARM runtime helpers${objectPath ? " in source and base object" : " in source"}.`,
);
