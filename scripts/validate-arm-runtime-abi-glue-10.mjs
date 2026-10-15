import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "config/arm-runtime-abi-glue-10.json"), "utf8"),
);
const source = fs.readFileSync(path.join(root, manifest.source), "utf8");

function fail(message) {
  console.error(`arm-runtime-abi-glue-10 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.functions.length !== 11) {
  fail("the manifest must describe exactly eleven schema-version-1 helpers");
}

if (!/^\.syntax unified$/m.test(source) || !/^\.arm$/m.test(source)) {
  fail("the source must explicitly select unified ARM syntax");
}
if (!/^\.fpu\s+vfpv2$/m.test(source)) {
  fail("the source must select the VFP profile required by vmsr");
}
if (/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}
if (/^\s*(?:bl|blx|dmb|dsb|isb)\b/im.test(source)) {
  fail("calls and added memory barriers are not permitted");
}

for (const { name, size } of manifest.functions) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const required = [
    new RegExp(`^\\.section \\.text\\.${escaped}, \\"ax\\", %progbits$`, "m"),
    new RegExp(`^\\.global ${escaped}$`, "m"),
    new RegExp(`^\\.type ${escaped}, %function$`, "m"),
    new RegExp(`^${escaped}:$`, "m"),
    new RegExp(`^\\.size ${escaped}, \\. - ${escaped}$`, "m"),
  ];
  if (required.some((pattern) => !pattern.test(source))) {
    fail(`${name} is missing its required section or ELF metadata`);
  }

  const bodyMatch = source.match(
    new RegExp(`^${escaped}:\\n([\\s\\S]*?)^\\.size ${escaped}, \\. - ${escaped}$`, "m"),
  );
  if (!bodyMatch) fail(`could not isolate ${name}`);
  const instructionCount = bodyMatch[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !/^\d+:$/.test(line)).length;
  if (instructionCount * 4 !== size) {
    fail(`${name} has ${instructionCount * 4} source bytes; expected ${size}`);
  }
}

const synchronizationBody = source
  .match(/^func_00124150:\n([\s\S]*?)^\.size func_00124150, \. - func_00124150$/m)?.[1]
  ?.split("\n")
  .map((line) => line.trim())
  .filter(Boolean);
const requiredSynchronizationBody = [
  "push {r4, r5}",
  "ldr r1, [r0]",
  "cmp r1, #1",
  "movne r2, #0",
  "mvnne r1, #0",
  "beq 3f",
  "1:",
  "ldrex r3, [r0]",
  "cmp r3, r2",
  "bne 2f",
  "strex r5, r1, [r0]",
  "cmp r5, #0",
  "bne 1b",
  "b 4f",
  "2:",
  "clrex",
  "4:",
  "cmp r3, #0",
  "movne r0, #0",
  "bne 5f",
  "3:",
  "mov r0, #1",
  "5:",
  "pop {r4, r5}",
  "bx lr",
];
if (
  !synchronizationBody ||
  synchronizationBody.length !== requiredSynchronizationBody.length ||
  synchronizationBody.some((line, index) => line !== requiredSynchronizationBody[index])
) {
  fail("func_00124150 does not preserve its required register and control-flow choreography");
}

const objectPath = process.argv[2];
const readelf = process.argv[3];
if ((objectPath && !readelf) || (!objectPath && readelf)) {
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

  for (const expected of manifest.functions) {
    const symbol = symbols.find((entry) => entry.name === expected.name);
    if (!symbol || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL") {
      fail(`${expected.name} is not a global function in the base object`);
    }
    if (symbol.value !== 0 || symbol.size !== expected.size) {
      fail(`${expected.name} has unexpected value or size in the base object`);
    }
    const armMapping = symbols.find(
      (entry) => entry.name === "$a" && entry.index === symbol.index && entry.value === 0,
    );
    if (!armMapping) fail(`${expected.name} lacks an ARM mapping symbol at section offset zero`);
  }
}

console.log(
  `Validated ${manifest.functions.length} ARM runtime/ABI glue helpers${objectPath ? " in source and base object" : " in source"}.`,
);
