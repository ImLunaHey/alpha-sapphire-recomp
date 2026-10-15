import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "config/arm-runtime-vfp-memory-helpers-13.json"), "utf8"),
);
const sources = JSON.parse(fs.readFileSync(path.join(root, "config/sources.json"), "utf8"));
const source = fs.readFileSync(path.join(root, manifest.source), "utf8");

function fail(message) {
  console.error(`arm-runtime-vfp-memory-helpers-13 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_00124A2C", 40],
  ["func_001330E8", 48],
  ["func_0011CB70", 124],
  ["func_00127528", 240],
  ["func_00180658", 36],
  ["func_001806C0", 36],
  ["func_0018074C", 36],
  ["func_00180838", 36],
  ["func_00181484", 64],
  ["func_00181630", 64],
  ["func_00181670", 64],
];

if (
  manifest.schemaVersion !== 1 ||
  manifest.mode !== "arm" ||
  manifest.source !== "src/main/arm_runtime_vfp_memory_helpers_13.S" ||
  JSON.stringify(manifest.functions.map(({ name, size }) => [name, size])) !==
    JSON.stringify(expectedFunctions) ||
  manifest.functions.reduce((total, entry) => total + entry.size, 0) !== 788
) {
  fail("the manifest must describe the eleven approved ARM helpers totaling 788 bytes");
}

const registration = sources.sources.filter(({ path: sourcePath }) => sourcePath === manifest.source);
if (registration.length !== 1 || registration[0].mode !== manifest.mode) {
  fail("config/sources.json must register the source exactly once in ARM mode");
}
if (!/^\.syntax unified$/m.test(source) || !/^\.arm$/m.test(source) || !/^\.fpu vfpv2$/m.test(source)) {
  fail("the source must explicitly select unified ARM syntax and VFPv2");
}
if (/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}
if (/^\s*(?:bl|blx|clrex|dmb|dsb|isb)\b/im.test(source)) {
  fail("calls, monitor operations, and added memory barriers are not permitted");
}

function lines(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function requireExact(actual, expected, description) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${description} does not preserve its approved deterministic template`);
  }
}

const directBodies = new Map([
  ["func_00124A2C", lines(`
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    mov r1, #0x120000
    str r1, [r4, #128]!
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
  `)],
  ["func_001330E8", lines(`
    push {r0, r1, r2}
    ldrd r0, [sp]
    cmp r0, r1
    beq 2f
    1:
    add r1, r0, #4
    str r1, [sp]
    str r2, [r0]
    ldrd r0, [sp]
    cmp r0, r1
    bne 1b
    2:
    add sp, sp, #12
    bx lr
  `)],
  ["func_0011CB70", lines(`
    push {r4, r5}
    cmp r1, #0
    ldr r12, [sp, #8]
    ldrd r4, [sp, #12]
    beq 1f
    vldmia r1, {s0-s3}
    vstr s0, [r0, #20]
    vstr s1, [r0, #24]
    vstr s2, [r0, #28]
    vstr s3, [r0, #32]
    2:
    add r1, r0, #36
    vldmia r2, {s0-s3}
    cmp r5, #0
    mov r2, #1
    vstmia r1, {s0-s3}
    addne r1, r0, #52
    vstmiane r1, {s0-s3}
    mov r1, #0
    strb r1, [r0, #70]
    strb r2, [r0, #72]
    str r1, [r0, #16]
    str r3, [r0, #12]
    strb r12, [r0, #69]
    strb r4, [r0]
    pop {r4, r5}
    bx lr
    1:
    add r1, r0, #52
    vldmia r1, {s0-s3}
    add r1, r0, #20
    vstmia r1, {s0-s3}
    b 2b
  `)],
  ["func_00127528", lines(`
    vldr s3, [r1]
    vldr s8, [r1, #12]
    vldr s7, [r1, #16]
    vldr s6, [r1, #28]
    vmul.f32 s3, s3, s8
    vldr s4, [r1, #32]
    vldr s5, [r1, #44]
    add r2, r0, #52
    vldr s2, [r0, #48]
    vldmia r2, {s0-s1}
    add r2, r1, #24
    vmla.f32 s3, s7, s6
    vnmla.f32 s3, s4, s5
    vstr s3, [r0, #48]
    vldr s4, [r1, #4]
    vldr s9, [r1, #12]
    vldr s7, [r1, #20]
    vldr s8, [r1, #28]
    vmul.f32 s4, s4, s9
    vldr s5, [r1, #36]
    vldr s6, [r1, #44]
    vmla.f32 s4, s7, s8
    vnmla.f32 s4, s5, s6
    vstr s4, [r0, #52]
    vldr s4, [r1, #8]
    vldr s9, [r1, #12]
    vldmia r2, {s7-s8}
    vmul.f32 s4, s4, s9
    add r2, r1, #40
    vldmia r2, {s5-s6}
    vmla.f32 s4, s7, s8
    vnmla.f32 s4, s5, s6
    vstr s4, [r0, #56]
    ldrb r2, [r0, #96]
    cmp r2, #0
    beq 1f
    vldmia r1, {s0-s7}
    add r1, r1, #32
    add r3, r0, #32
    mov r2, #0
    vstmia r0, {s0-s7}
    vldmia r1, {s0-s3}
    vstmia r3, {s0-s3}
    strb r2, [r0, #96]
    bx lr
    1:
    vldmia r1, {s4-s11}
    vsub.f32 s2, s3, s2
    add r1, r1, #32
    add r2, r0, #32
    vstmia r0, {s4-s11}
    vldmia r1, {s4-s7}
    vstr s2, [r0, #60]
    vstmia r2, {s4-s7}
    vldr s2, [r0, #52]
    vsub.f32 s0, s2, s0
    vstr s0, [r0, #64]
    vldr s0, [r0, #56]
    vsub.f32 s0, s0, s1
    vstr s0, [r0, #68]
    bx lr
  `)],
]);

for (const [name, expected] of directBodies) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const metadata = [
    new RegExp(`^\\.section \\.text\\.${escaped}, "ax", %progbits$`, "m"),
    new RegExp(`^\\.global ${escaped}$`, "m"),
    new RegExp(`^\\.type ${escaped}, %function$`, "m"),
  ];
  if (metadata.some((pattern) => !pattern.test(source))) {
    fail(`${name} is missing its required section or ELF metadata`);
  }
  const match = source.match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)^\\.size ${escaped}, \\. - ${escaped}$`, "m"));
  if (!match) fail(`${name} is missing its required ELF function metadata`);
  requireExact(lines(match[1]), expected, name);
  const byteCount = expected.filter((line) => !/^\d+:$/.test(line)).length * 4;
  const manifestSize = manifest.functions.find((entry) => entry.name === name).size;
  if (byteCount !== manifestSize) fail(`${name} has ${byteCount} template bytes; expected ${manifestSize}`);
}

const fieldMacro = source.match(/^\.macro FIELD_SETTER name, offset, bit\n([\s\S]*?)^\.endm$/m);
if (!fieldMacro) fail("the field-setter macro is missing");
requireExact(lines(fieldMacro[1]), lines(`
  .section .text.\\name, "ax", %progbits
  .global \\name
  .type \\name, %function
  \\name:
  vldr s1, [r0, #\\offset]
  vcmp.f32 s1, s0
  vmrs APSR_nzcv, fpscr
  beq 1f
  ldrh r1, [r0, #32]
  vstr s0, [r0, #\\offset]
  orr r1, r1, #\\bit
  strh r1, [r0, #32]
  1:
  bx lr
  .size \\name, . - \\name
`), "FIELD_SETTER");

const arrayMacro = source.match(/^\.macro ARRAY_SETTER name, displacement\n([\s\S]*?)^\.endm$/m);
if (!arrayMacro) fail("the array-setter macro is missing");
requireExact(lines(arrayMacro[1]), lines(`
  .section .text.\\name, "ax", %progbits
  .global \\name
  .type \\name, %function
  \\name:
  mov r2, #0
  b 2f
  1:
  tst r1, #1
  beq 3f
  add r3, r2, r2, lsl #3
  add r3, r0, r3, lsl #2
  add r3, r3, #0x1800
  vstr s0, [r3, #\\displacement]
  3:
  add r2, r2, #1
  lsr r1, r1, #1
  2:
  ldr r3, [r0, #256]
  cmp r3, r2
  bls 4f
  cmp r1, #0
  bne 1b
  4:
  bx lr
  .size \\name, . - \\name
`), "ARRAY_SETTER");

requireExact(
  [...source.matchAll(/^FIELD_SETTER (.+)$/gm)].map((match) => match[1]),
  ["func_00180658, 56, 16", "func_001806C0, 52, 8", "func_0018074C, 48, 8", "func_00180838, 40, 4"],
  "field-setter instantiations",
);
requireExact(
  [...source.matchAll(/^ARRAY_SETTER (.+)$/gm)].map((match) => match[1]),
  ["func_00181484, 800", "func_00181630, 796", "func_00181670, 804"],
  "array-setter instantiations",
);

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
      fail(`${expected.name} has unexpected section offset or size in the base object`);
    }
    const armMapping = symbols.find(
      (entry) => entry.name === "$a" && entry.index === symbol.index && entry.value === 0,
    );
    if (!armMapping) fail(`${expected.name} lacks an ARM mapping symbol at section offset zero`);
  }
}

console.log(
  `Validated ${manifest.functions.length} ARM VFP/memory helpers${objectPath ? " in source and base object" : " in source"}.`,
);
