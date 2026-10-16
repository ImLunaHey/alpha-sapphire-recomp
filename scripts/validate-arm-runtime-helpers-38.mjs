import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-38.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-38 validation failed: ${message}`);
  process.exit(1);
}

const expectedSchedules = new Map([
  ["func_0031DC98", [
    "cmp r2,#0", "ldrne r12,.Lruntime_halfword_fill_38", "stm r0,{r1,r2}", "movne r1,#0",
    "beq 2f", "1:", "ldr r3,[r0]", "subs r2,r2,#1", "add r3,r3,r1,lsl #1",
    "add r1,r1,#1", "strh r12,[r3]", "bne 1b", "2:", "bx lr",
  ]],
  ["func_0031E680", [
    "push {r4}", "cmp r2,#0", "stm r0,{r1,r2}", "mov r1,#0", "movhi r12,#0", "bls 2f",
    "1:", "ldr r4,[r0]", "mov r3,r1", "add r1,r1,#1", "cmp r1,r2",
    "str r12,[r4,r3,lsl #2]", "bcc 1b", "2:", "pop {r4}", "bx lr",
  ]],
  ["func_0031E6B8", [
    "push {r0,r1,r2,r3}", "ldr r12,[sp,#8]", "cmp r12,#0", "moveq r2,#0", "beq 1f",
    "ldr r2,[r1]", "add r2,r2,r3", "sub r3,r3,#1", "sub r2,r2,#1", "bic r2,r2,r3",
    "add r3,r2,r12", "str r3,[r1]", "1:", "stm r0,{r2,r12}", "add sp,sp,#16", "bx lr",
  ]],
  ["func_0031E6F8", [
    "vldr s0,[r1,#4]", "vldr s3,[r1,#20]", "vldr s2,.Lruntime_float_zero_38_a",
    "vmul.f32 s1,s0,s0", "vldr s4,.Lruntime_float_unit_38_a", "vmla.f32 s1,s3,s3",
    "vcmp.f32 s1,s2", "vmrs APSR_nzcv,fpscr", "vmoveq.f32 s0,s2", "vmoveq.f32 s1,s4",
    "beq 1f", "vsqrt.f32 s5,s1", "vdiv.f32 s1,s4,s5", "vmul.f32 s0,s0,s1",
    "vmul.f32 s1,s3,s1", "1:", "add r1,r0,#20", "vstr s1,[r0]", "vstr s0,[r0,#4]",
    "vstr s4,[r0,#40]", "vstr s2,[r0,#8]", "vneg.f32 s0,s0", "vstmia r1,{s1-s2}",
    "vstr s2,[r0,#32]", "vstr s2,[r0,#36]", "vstr s0,[r0,#16]", "bx lr",
  ]],
  ["func_0031EE40", [
    "vldr s3,[r2,#4]", "vldr s1,[r1]", "add r3,r1,#4", "vldr s0,[r2,#20]",
    "vmul.f32 s1,s1,s3", "vldmia r3,{s4-s5}", "add r1,r1,#16", "vldr s2,[r2,#36]",
    "vmla.f32 s1,s4,s0", "vmla.f32 s1,s5,s2", "vldmia r1,{s4-s6}", "vmul.f32 s3,s4,s3",
    "vldr s4,.Lruntime_float_unit_38_b", "vmla.f32 s3,s5,s0", "vmul.f32 s0,s1,s1",
    "vmla.f32 s3,s6,s2", "vldr s2,.Lruntime_float_zero_38_b", "vmla.f32 s0,s3,s3",
    "vcmp.f32 s0,s2", "vmrs APSR_nzcv,fpscr", "vmoveq.f32 s1,s2", "vmoveq.f32 s0,s4",
    "beq 1f", "vsqrt.f32 s5,s0", "vdiv.f32 s0,s4,s5", "vmul.f32 s1,s1,s0",
    "vmul.f32 s0,s3,s0", "1:", "vstr s0,[r0]", "vstr s0,[r0,#20]", "vstr s1,[r0,#4]",
    "vneg.f32 s0,s1", "vstr s4,[r0,#40]", "vstr s2,[r0,#8]", "vstr s2,[r0,#24]",
    "vstr s2,[r0,#32]", "vstr s2,[r0,#36]", "vstr s0,[r0,#16]", "bx lr",
  ]],
  ["func_0031F044", [
    "vldmia r1!,{s3}", "vldr s4,.Lruntime_float_zero_38_c", "vldmia r1,{s1-s2}",
    "vmul.f32 s0,s3,s3", "vmla.f32 s0,s1,s1", "vmla.f32 s0,s2,s2", "vcmp.f32 s0,s4",
    "vmrs APSR_nzcv,fpscr", "moveq r0,#0", "beq 1f", "vsqrt.f32 s5,s0",
    "vldr s4,.Lruntime_float_unit_38_c", "vdiv.f32 s0,s4,s5", "vmul.f32 s3,s3,s0",
    "vmul.f32 s1,s1,s0", "vmul.f32 s0,s2,s0", "vstr s3,[r0]", "vstr s1,[r0,#4]",
    "vstr s0,[r0,#8]", "mov r0,#1", "1:", "bx lr",
  ]],
]);

const expectedFunctions = [
  ["func_0031DC98", 48, [[48, "runtime_halfword_fill_38"]]],
  ["func_0031E680", 56, []],
  ["func_0031E6B8", 60, []],
  ["func_0031E6F8", 104, [[104, "runtime_float_zero_38"], [108, "runtime_float_unit_38"]]],
  ["func_0031EE40", 152, [[152, "runtime_float_zero_38"], [156, "runtime_float_unit_38"]]],
  ["func_0031F044", 84, [[84, "runtime_float_zero_38"], [88, "runtime_float_unit_38"]]],
];
const expectedIdentityContracts = {
  runtime_halfword_fill_38: {
    minimumSlotAlignment: 4, equality: "singleton-distinct", usage: "low-halfword-counted-fill",
  },
  runtime_float_zero_38: {
    minimumSlotAlignment: 4, equality: "shared-three-site-distinct-zero",
    usage: "vfp-single-additive-zero-and-equality-operand",
  },
  runtime_float_unit_38: {
    minimumSlotAlignment: 4, equality: "shared-three-site-distinct-unit",
    usage: "vfp-single-multiplicative-unit",
  },
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_38.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 504 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, words] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const expectedWords = words.map(([offset, symbol]) => ({ offset, kind: "R_ARM_ABS32", symbol }));
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      JSON.stringify(entry.adjacentWords) !== JSON.stringify(expectedWords)) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedIdentityContracts)) {
  fail("symbolic identity contracts are invalid");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (!sourceText.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n")) fail("ARMv6K/VFPv2 source preamble is invalid");
if (/^\s*(?:bl|blx)\b/m.test(sourceText)) fail("source must not contain calls");
for (const [identity, count] of [["runtime_halfword_fill_38", 1], ["runtime_float_zero_38", 3], ["runtime_float_unit_38", 3]]) {
  const words = sourceText.match(new RegExp(`^\\s*\\.word\\s+${identity}\\s*$`, "gm")) ?? [];
  if (words.length !== count || !sourceText.includes(`.global ${identity}`) ||
      new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`source symbolic identity ${identity} is invalid`);
  }
}

function normalize(line) {
  return line.replace(/\/\/.*$/, "").trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",")
    .replace(/\[\s*/g, "[").replace(/\s*\]/g, "]").replace(/\{\s*/g, "{").replace(/\s*\}/g, "}");
}
for (const [name] of expectedFunctions) {
  const start = sourceText.indexOf(`${name}:`);
  const end = sourceText.indexOf(`.size ${name}`, start);
  if (start < 0 || end < 0 || !sourceText.includes(`.section .text.${name}, "ax", %progbits`) ||
      !sourceText.includes(`.global ${name}`) || !sourceText.includes(`.type ${name}, %function`)) {
    fail(`source declaration for ${name} is missing`);
  }
  const actual = sourceText.slice(start + name.length + 1, end).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(expectedSchedules.get(name))) {
    fail(`${name} exact instruction schedule is invalid`);
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-38.mjs [base-object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let symbols;
  let relocations;
  try {
    const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], options);
    symbols = execFileSync(readelf, ["-sW", objectPath], options);
    relocations = execFileSync(readelf, ["-rW", objectPath], options);
  } catch (error) {
    fail(`could not inspect object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("object is not ARM");

  const parsedSymbols = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 8 || !fields[0].endsWith(":")) continue;
    parsedSymbols.push({
      value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10), type: fields[3],
      bind: fields[4], section: fields[6], name: fields.slice(7).join(" "),
    });
  }
  const functionSymbols = new Map();
  for (const [name, size] of expectedFunctions) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1 || matches[0].size !== size || matches[0].type !== "FUNC" ||
        matches[0].bind !== "GLOBAL" || matches[0].section === "UND") {
      fail(`${name} must be one defined ${size}-byte global function`);
    }
    functionSymbols.set(name, matches[0]);
  }
  for (const identity of Object.keys(expectedIdentityContracts)) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === identity);
    if (matches.length !== 1 || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") {
      fail(`${identity} must remain one undefined global symbol`);
    }
  }

  const parsedRelocations = [];
  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) {
      parsedRelocations.push({
        section: relocationSection, offset: Number.parseInt(fields[0], 16), kind: fields[2], symbol: fields[4],
      });
    }
  }
  let absoluteWords = 0;
  for (const [name, size, words] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const section = `.text.${name}`;
    const extent = words.length === 0 ? size : words.at(-1)[0] + 4;
    const relevant = parsedRelocations.filter((relocation) => relocation.section === section &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + extent);
    const expected = words.map(([offset, identity]) => ({
      section, offset: symbol.value + offset, kind: "R_ARM_ABS32", symbol: identity,
    }));
    if (JSON.stringify(relevant) !== JSON.stringify(expected)) {
      fail(`${name} does not have exactly the documented adjacent R_ARM_ABS32 relocations`);
    }
    if (relevant.some((relocation) => relocation.offset < symbol.value + size || relocation.offset % 4 !== 0)) {
      fail(`${name} has a relocation inside its body or a misaligned adjacent slot`);
    }
    absoluteWords += relevant.length;
  }
  if (absoluteWords !== 7 || parsedRelocations.some((relocation) =>
    expectedFunctions.some(([name]) => relocation.section === `.text.${name}`) && relocation.kind !== "R_ARM_ABS32")) {
    fail("batch must contain exactly seven ABS32 slots and no branch relocations");
  }
}

console.log("Validated ARM runtime helpers batch 38: 6 functions, 504 body bytes, no calls, 7 ABS32 slots in 3 equality classes.");
