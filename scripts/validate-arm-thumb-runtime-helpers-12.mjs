import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "config/arm-thumb-runtime-helpers-12.json"), "utf8"),
);
const source = fs.readFileSync(path.join(root, manifest.source), "utf8");

function fail(message) {
  console.error(`arm-thumb-runtime-helpers-12 validation failed: ${message}`);
  process.exit(1);
}

const lines = (text) => text.trim().split("\n");
const matrixBody = lines(`
vpush {d8-d12}
vldmia r2!, {s16-s23}
vldr s24, [r1]
vldr s25, [r1, #16]
vmul.f32 s0, s24, s16
vmul.f32 s1, s24, s17
vmul.f32 s2, s24, s18
vmul.f32 s3, s24, s19
vldr s24, [r1, #32]
vmul.f32 s4, s25, s16
vmul.f32 s5, s25, s17
vmul.f32 s6, s25, s18
vmul.f32 s7, s25, s19
vldr s25, [r1, #48]
vmul.f32 s8, s24, s16
vmul.f32 s9, s24, s17
vmul.f32 s10, s24, s18
vmul.f32 s11, s24, s19
vldr s24, [r1, #4]
vmul.f32 s12, s25, s16
vmul.f32 s13, s25, s17
vmul.f32 s14, s25, s18
vmul.f32 s15, s25, s19
vldr s25, [r1, #20]
vldmia r2!, {s16-s19}
vmla.f32 s0, s24, s20
vmla.f32 s1, s24, s21
vmla.f32 s2, s24, s22
vmla.f32 s3, s24, s23
vldr s24, [r1, #36]
vmla.f32 s4, s25, s20
vmla.f32 s5, s25, s21
vmla.f32 s6, s25, s22
vmla.f32 s7, s25, s23
vldr s25, [r1, #52]
vmla.f32 s8, s24, s20
vmla.f32 s9, s24, s21
vmla.f32 s10, s24, s22
vmla.f32 s11, s24, s23
vldr s24, [r1, #8]
vmla.f32 s12, s25, s20
vmla.f32 s13, s25, s21
vmla.f32 s14, s25, s22
vmla.f32 s15, s25, s23
vldr s25, [r1, #24]
vldmia r2, {s20-s23}
vmla.f32 s0, s24, s16
vmla.f32 s1, s24, s17
vmla.f32 s2, s24, s18
vmla.f32 s3, s24, s19
vldr s24, [r1, #40]
vmla.f32 s4, s25, s16
vmla.f32 s5, s25, s17
vmla.f32 s6, s25, s18
vmla.f32 s7, s25, s19
vldr s25, [r1, #56]
vmla.f32 s8, s24, s16
vmla.f32 s9, s24, s17
vmla.f32 s10, s24, s18
vmla.f32 s11, s24, s19
vldr s24, [r1, #12]
vmla.f32 s12, s25, s16
vmla.f32 s13, s25, s17
vmla.f32 s14, s25, s18
vmla.f32 s15, s25, s19
vldr s25, [r1, #28]
vmla.f32 s0, s24, s20
vmla.f32 s1, s24, s21
vmla.f32 s2, s24, s22
vmla.f32 s3, s24, s23
vldr s24, [r1, #44]
vmla.f32 s4, s25, s20
vmla.f32 s5, s25, s21
vmla.f32 s6, s25, s22
vmla.f32 s7, s25, s23
vldr s25, [r1, #60]
vmla.f32 s8, s24, s20
vmla.f32 s9, s24, s21
vmla.f32 s10, s24, s22
vmla.f32 s11, s24, s23
vmla.f32 s12, s25, s20
vmla.f32 s13, s25, s21
vmla.f32 s14, s25, s22
vmla.f32 s15, s25, s23
vpop {d8-d12}
vstmia r0, {s0-s15}
bx lr`);

const bitZeroBody = lines(`
ldr r2, [r0, #16]
cmp r1, #0
beq 1f
movs r1, #1
orrs r2, r1
str r2, [r0, #16]
bx lr
1:
lsrs r1, r2, #1
lsls r1, r1, #1
str r1, [r0, #16]
bx lr`);
const bitTwoBody = lines(`
ldr r2, [r0, #16]
movs r3, #4
cmp r1, #0
beq 1f
orrs r2, r3
b 2f
1:
bics r2, r3
2:
str r2, [r0, #16]
bx lr`);

const expectedBodies = new Map([
  ["func_001235B4", matrixBody],
  ["func_00123C78", lines(`
push {r4, r5, r9, r10, r11}
.rept 9
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}
.endr
ldm r1!, {r2, r3, r4, r5}
ldm r1!, {r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r11, r12}
pop {r4, r5, r9, r10, r11}
bx lr`)],
  ["func_001277B4", lines(`
ldr r3, [r0]
ldr r3, [r3, #12]
bx r3`)],
  ["func_0012C174", lines(`
mov r12, #1
strb r12, [r0, #12]
mov r3, #0
str r1, [r0, #8]
strb r3, [r0, #13]
str r2, [r0, #4]
bx lr`)],
  ["func_0012C7EC", lines(`
ldrb r1, [r0, #74]
cmp r1, #0
ldrsbeq r0, [r0, #68]
movne r0, #0
bx lr`)],
  ["func_0012FAF4", lines(`
ldr r1, [r0]
mov r0, #0
cmp r1, #0
ldrhne r0, [r1, #2]
bx lr`)],
  ["func_0012FB40", lines(`
ldr r2, [r0]
mov r0, #0
cmp r2, #0
ldrhne r3, [r2, #2]
cmpne r3, r1
bls 1f
mov r0, #4
add r0, r0, r1, lsl #2
ldr r0, [r2, r0]
add r0, r0, r2
1:
bx lr`)],
  ["func_0012FE10", lines(`
ldr r0, [r0, #4]
and r0, r0, #0x20000
lsr r0, r0, #17
bx lr`)],
  ["func_0012FE20", lines(`
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
bx lr`)],
  ["func_0012FE3C", lines(`
ldr r2, [r1]
ldr r3, [r1, #4]
str r2, [r0]
str r3, [r0, #4]
bx lr`)],
  ["func_00132230", lines(`
mov r1, r0
ldr r0, [r0]
ldrb r2, [r1, #3]
bic r0, r0, #0xff000000
orr r0, r0, r2, lsl #24
lsrs r0, r0, #8
bne 1f
ldr r0, [r1, #4]
ldrb r1, [r1, #7]
bic r0, r0, #0xff000000
orr r0, r0, r1, lsl #24
1:
bx lr`)],
  ["func_00105DCC", bitZeroBody],
  ["func_00105DE2", bitTwoBody],
  ["func_00105ED8", bitZeroBody],
  ["func_00105EEE", bitTwoBody],
  ["func_00105FEA", lines(`
ldr r2, [r0]
adds r1, r2, r1
str r1, [r0]
bx lr`)],
]);

if (
  manifest.schemaVersion !== 1 ||
  manifest.functions.length !== 16 ||
  manifest.functions.reduce((total, entry) => total + entry.size, 0) !== 868 ||
  manifest.functions.filter((entry) => entry.mode === "arm").length !== 11 ||
  manifest.functions.filter((entry) => entry.mode === "thumb").length !== 5
) {
  fail("the manifest must describe 11 ARM and five Thumb helpers totaling 868 bytes");
}
if (
  !/^\.syntax unified$/m.test(source) ||
  !/^\.arch armv6k$/m.test(source) ||
  !/^\.cpu mpcore$/m.test(source) ||
  !/^\.fpu vfpv2$/m.test(source)
) {
  fail("the source must select unified ARMv6K/MPCore syntax and VFPv2");
}
if (/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}
if (/^\s*(?:bl|blx)\b/im.test(source)) fail("calls are not permitted");

for (const { name, mode } of manifest.functions) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const required = [
    new RegExp(`^\\.section \\.text\\.${escaped}, "ax", %progbits$`, "m"),
    new RegExp(`^\\.global ${escaped}$`, "m"),
    new RegExp(`^\\.type ${escaped}, %function$`, "m"),
    new RegExp(`^${escaped}:$`, "m"),
    new RegExp(`^\\.size ${escaped}, \\. - ${escaped}$`, "m"),
  ];
  if (required.some((pattern) => !pattern.test(source))) {
    fail(`${name} is missing required section or ELF metadata`);
  }
  const header = source.slice(0, source.indexOf(`${name}:`));
  const selectedMode = Math.max(header.lastIndexOf("\n.arm"), header.lastIndexOf("\n.thumb"));
  if (!header.slice(selectedMode).startsWith(`\n.${mode}`)) fail(`${name} is not in ${mode} state`);
  if (mode === "thumb" && !new RegExp(`^\\.thumb_func\\n${escaped}:$`, "m").test(source)) {
    fail(`${name} is missing Thumb function metadata`);
  }
  const body = source
    .match(new RegExp(`^${escaped}:\\n([\\s\\S]*?)^\\.size ${escaped}, \\. - ${escaped}$`, "m"))?.[1]
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const expected = expectedBodies.get(name);
  if (!body || !expected || body.length !== expected.length || body.some((line, index) => line !== expected[index])) {
    fail(`${name} does not preserve its required instruction and register choreography`);
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
    const expectedValue = expected.mode === "thumb" ? 1 : 0;
    if (symbol.value !== expectedValue || symbol.size !== expected.size) {
      fail(`${expected.name} has unexpected mode marker, section offset, or size`);
    }
    const mappingName = expected.mode === "thumb" ? "$t" : "$a";
    const mapping = symbols.find(
      (entry) => entry.name === mappingName && entry.index === symbol.index && entry.value === 0,
    );
    if (!mapping) fail(`${expected.name} lacks a ${mappingName} mapping symbol at section offset zero`);
  }
}

console.log(
  `Validated ${manifest.functions.length} ARM/Thumb runtime helpers${objectPath ? " in source and base object" : " in source"}.`,
);
