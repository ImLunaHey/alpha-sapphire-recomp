import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "config/arm-runtime-helpers-20.json");
const manifestText = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const sourcePath = path.join(root, "src/main/arm_runtime_helpers_20.S");
const source = fs.readFileSync(sourcePath, "utf8");
const sources = JSON.parse(fs.readFileSync(path.join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-20 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002DB434", 200, 212, 50],
  ["func_002DB508", 148, 164, 37],
  ["func_002DC604", 16, 20, 4],
];

if (
  Object.keys(manifest).sort().join(",") !== "functions,mode,schemaVersion,source" ||
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_runtime_helpers_20.S" ||
  manifest.mode !== "arm" ||
  JSON.stringify(manifest.functions.map(({ name, size }) => [name, size])) !==
    JSON.stringify(expectedFunctions.map(([name, size]) => [name, size])) ||
  manifest.functions.some((entry) => Object.keys(entry).sort().join(",") !== "name,size") ||
  manifest.functions.reduce((total, entry) => total + entry.size, 0) !== 364
) {
  fail("the neutral manifest must describe the three approved ARM helpers totaling 364 bytes");
}

if (createHash("sha256").update(manifestText).digest("hex") !==
    "b5f844bf025f95ed10ca12d1c53cfa37dfc78d5c29fb97145cae4db88b045086") {
  fail("the deterministic neutral manifest changed without validator review");
}
if (createHash("sha256").update(source).digest("hex") !==
    "ad716452273af563159bdda532ea959d59e6b2b89af0d24c78d574cde9bbaa70") {
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
  fail("embedded instruction or non-floating data directives are not permitted");
}
if (/^\s*(?:bl|blx|svc|mcr|mrc|dmb|dsb|isb|clrex)\b/im.test(source)) {
  fail("calls, system operations, and memory barriers are not permitted");
}

for (const [name, , , instructionCount] of expectedFunctions) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const body = source.match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)^\\.size ${escaped}, \\. - ${escaped}$`, "m"));
  if (!body) {
    fail(`${name} must have a bounded source body`);
  }
  const instructions = body[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.endsWith(":"));
  if (instructions.length !== instructionCount) {
    fail(`${name} has an unexpected semantic instruction count`);
  }
  const required = [
    new RegExp(`^\\.section \\.text\\.${escaped}, "ax", %progbits$`, "m"),
    new RegExp(`^\\.global ${escaped}$`, "m"),
    new RegExp(`^\\.type ${escaped}, %function$`, "m"),
  ];
  if (required.some((pattern) => !pattern.test(source))) {
    fail(`${name} is missing required section or ELF function metadata`);
  }
}

if (!/^\.size func_002DB434, \. - func_002DB434\n\.align 2\n\.L002DB434_two:\n    \.float 2\.0\n\.L002DB434_one:\n    \.float 1\.0\n\.L002DB434_zero:\n    \.float 0\.0$/m.test(source) ||
    !/^\.size func_002DB508, \. - func_002DB508\n\.align 2\n\.L002DB508_one:\n    \.float 1\.0\n\.L002DB508_two:\n    \.float 2\.0\n\.L002DB508_zero:\n    \.float 0\.0\n\.L002DB508_negative_one:\n    \.float -1\.0$/m.test(source) ||
    !/^\.size func_002DC604, \. - func_002DC604\n\.align 2\n\.L002DC604_zero:\n    \.float 0\.0$/m.test(source)) {
  fail("each helper must be followed immediately by its ordered adjacent literal pool");
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

  for (const [name, size, sectionSize] of expectedFunctions) {
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
    if (!symbols.some((entry) => entry.name === "$d" && entry.index === symbol.index && entry.value === size)) {
      fail(`${name} must switch to pool data immediately after its function symbol`);
    }
    const functionSections = sections.filter((entry) => entry.name === `.text.${name}`);
    if (functionSections.length !== 1 || functionSections[0].size !== sectionSize ||
        !functionSections[0].flags.includes("A") || !functionSections[0].flags.includes("X")) {
      fail(`${name} has an unexpected executable section or adjacent-pool size`);
    }
  }
}

console.log(
  `Validated ${expectedFunctions.length} ARM VFP matrix helpers${objectPath ? " in source and base object" : " in source"}.`,
);
