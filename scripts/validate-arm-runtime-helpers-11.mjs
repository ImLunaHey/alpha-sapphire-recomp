import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "config/arm-runtime-helpers-11.json"), "utf8"),
);
const source = fs.readFileSync(path.join(root, manifest.source), "utf8");

function fail(message) {
  console.error(`arm-runtime-helpers-11 validation failed: ${message}`);
  process.exit(1);
}

const expectedBodies = new Map([
  [
    "func_0012339C",
    [
      "cmp r1, #2",
      "bhs 1f",
      "rsb r2, r1, r1, lsl #3",
      "add r1, r2, r1, lsl #4",
      "add r0, r0, r1, lsl #3",
      "1:",
      "bx lr",
    ],
  ],
  [
    "func_00123F14",
    [
      "cmp r0, #0",
      "beq 1f",
      "ldr r1, [r0]",
      "ldr r1, [r1, #48]",
      "bx r1",
      "1:",
      "bx lr",
    ],
  ],
  [
    "func_00125DEC",
    [
      "ldr r2, [r0, #4]",
      "cmp r2, #0",
      "beq 2f",
      "1:",
      "ldr r3, [r0, #4]",
      "cmp r1, #0",
      "ldrex r2, [r3]",
      "lsr r12, r2, #24",
      "orrne r12, r12, #1",
      "biceq r12, r12, #1",
      "bic r2, r2, #0xff000000",
      "orr r2, r2, r12, lsl #24",
      "strex r12, r2, [r3]",
      "cmp r12, #0",
      "bne 1b",
      "2:",
      "bx lr",
    ],
  ],
  [
    "func_00126A64",
    [
      "cmp r2, #0",
      "push {r4}",
      "beq 1f",
      "cmp r2, #1",
      "beq 2f",
      "cmp r2, #2",
      "ldreq r2, [r0]",
      "bne 2f",
      "1:",
      "str r2, [r0, #4]",
      "2:",
      "cmp r1, #0",
      "beq 4f",
      "ldr r3, [r0, #4]",
      "mov r2, #0",
      "add r3, r3, r1",
      "ldr r1, [r0]",
      "subs r4, r1, r3",
      "sbcs r12, r2, r2",
      "blt 3f",
      "cmp r2, #0",
      "movlt r1, #0",
      "movge r1, r3",
      "3:",
      "str r1, [r0, #4]",
      "4:",
      "pop {r4}",
      "bx lr",
    ],
  ],
  [
    "func_00126AC4",
    [
      "cmp r1, #0",
      "push {r4}",
      "beq 2f",
      "ldr r3, [r0, #4]",
      "mov r2, #0",
      "add r1, r1, r3",
      "ldr r3, [r0]",
      "subs r4, r3, r1",
      "sbcs r12, r2, r2",
      "movlt r1, r3",
      "blt 1f",
      "cmp r2, #0",
      "movlt r1, #0",
      "1:",
      "str r1, [r0, #4]",
      "2:",
      "ldr r0, [r0, #4]",
      "pop {r4}",
      "bx lr",
    ],
  ],
  [
    "func_00131940",
    [
      "push {r4, r5, r6}",
      "umull r4, r6, r1, r2",
      "asr r5, r1, #31",
      "mov r12, #0",
      "mla r5, r5, r2, r6",
      "mla r12, r1, r12, r5",
      "umlal r4, r12, r3, r0",
      "umull r2, r0, r0, r2",
      "umull r1, r2, r1, r3",
      "mov r2, #0",
      "adds r0, r0, r2",
      "adc r1, r1, r2",
      "adds r0, r0, r4",
      "pop {r4, r5, r6}",
      "adc r1, r1, r12",
      "bx lr",
    ],
  ],
]);

if (
  manifest.schemaVersion !== 1 ||
  manifest.functions.length !== 6 ||
  manifest.functions.reduce((total, entry) => total + entry.size, 0) !== 336
) {
  fail("the manifest must describe exactly six schema-version-1 helpers totaling 336 bytes");
}
if (!/^\.syntax unified$/m.test(source) || !/^\.arm$/m.test(source)) {
  fail("the source must explicitly select unified ARM syntax");
}
if (/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}
if (/^\s*(?:bl|blx|clrex|dmb|dsb|isb)\b/im.test(source)) {
  fail("calls, monitor clears, and added memory barriers are not permitted");
}

for (const { name, size } of manifest.functions) {
  const expectedBody = expectedBodies.get(name);
  if (!expectedBody) fail(`${name} is not an approved helper`);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const required = [
    new RegExp(`^\\.section \\.text\\.${escaped}, "ax", %progbits$`, "m"),
    new RegExp(`^\\.global ${escaped}$`, "m"),
    new RegExp(`^\\.type ${escaped}, %function$`, "m"),
    new RegExp(`^${escaped}:$`, "m"),
    new RegExp(`^\\.size ${escaped}, \\. - ${escaped}$`, "m"),
  ];
  if (required.some((pattern) => !pattern.test(source))) {
    fail(`${name} is missing its required section or ELF metadata`);
  }

  const body = source
    .match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)^\\.size ${escaped}, \\. - ${escaped}$`, "m"))?.[1]
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (
    !body ||
    body.length !== expectedBody.length ||
    body.some((line, index) => line !== expectedBody[index])
  ) {
    fail(`${name} does not preserve its required instruction and register choreography`);
  }
  const instructionBytes = body.filter((line) => !/^\d+:$/.test(line)).length * 4;
  if (instructionBytes !== size) {
    fail(`${name} has ${instructionBytes} source bytes; expected ${size}`);
  }
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
  `Validated ${manifest.functions.length} ARM runtime helpers${objectPath ? " in source and base object" : " in source"}.`,
);
