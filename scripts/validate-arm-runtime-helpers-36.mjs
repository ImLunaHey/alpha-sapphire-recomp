import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-36.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-36 validation failed: ${message}`);
  process.exit(1);
}

const expectedSchedules = new Map([
  ["func_002F39D4", [
    "lsl r2,r1,#1", "ldr r1,[r0,#4]", "mov r3,#0", "add r2,r2,#16", "cmp r1,#32",
    "rsbcc r3,r1,#32", "add r3,r3,#31", "bic r3,r3,#31", "add r3,r3,r2",
    "add r3,r3,#31", "bic r3,r3,#31", "add r3,r3,r2", "mov r2,#32", "str r2,[r0,#4]",
    "ldr r12,[r0,#8]", "cmp r12,#32", "movcs r2,r12", "str r2,[r0,#8]", "ldr r2,[r0]",
    "str r1,[r0,#4]", "add r2,r2,#31", "bic r2,r2,#31", "add r2,r2,r3", "str r2,[r0]",
    "ldr r2,[r0,#8]", "cmp r2,r1", "movcs r1,r2", "str r1,[r0,#8]", "bx lr",
  ]],
  ["func_002F3ED8", [
    "mov r3,#1", "bics r3,r3,r1", "mvn r2,#0", "mov r3,#2", "streq r2,[r0]",
    "bics r3,r3,r1", "mov r3,#4", "streq r2,[r0,#4]", "bics r3,r3,r1", "mov r3,#8",
    "streq r2,[r0,#8]", "bics r3,r3,r1", "mov r3,#16", "streq r2,[r0,#12]",
    "bics r3,r3,r1", "mov r3,#32", "streq r2,[r0,#16]", "bics r3,r3,r1", "mov r3,#128",
    "streq r2,[r0,#20]", "bics r3,r3,r1", "mov r3,#256", "streq r2,[r0,#24]",
    "bics r3,r3,r1", "mov r3,#512", "streq r2,[r0,#28]", "bics r3,r3,r1", "mov r3,#2048",
    "streq r2,[r0,#32]", "bics r3,r3,r1", "mov r3,#1024", "streq r2,[r0,#36]",
    "bics r1,r3,r1", "streq r2,[r0,#40]", "bx lr",
  ]],
  ["func_002F9230", [
    "str r1,[r0,#8]", "ldr r0,[r1,#12]", "str r0,[r1,#16]", "ldr r0,[r1,#28]",
    "str r0,[r1,#32]", "ldr r0,[r1,#44]", "str r0,[r1,#48]", "ldr r0,[r1,#60]",
    "str r0,[r1,#64]", "ldr r0,[r1,#108]", "str r0,[r1,#112]", "ldr r0,[r1,#124]",
    "str r0,[r1,#128]", "ldr r0,[r1,#140]", "str r0,[r1,#144]", "ldr r0,[r1,#156]",
    "str r0,[r1,#160]", "ldr r0,[r1,#172]", "str r0,[r1,#176]", "ldr r0,[r1,#76]",
    "str r0,[r1,#80]", "ldr r0,[r1,#92]", "str r0,[r1,#96]", "ldr r0,[r1,#188]",
    "str r0,[r1,#192]", "ldr r0,[r1,#204]", "str r0,[r1,#208]", "ldr r0,[r1,#220]",
    "str r0,[r1,#224]", "ldr r0,[r1,#236]", "str r0,[r1,#240]", "bx lr",
  ]],
  ["func_002FF24C", [
    "push {r4,r5,lr}", "subs r2,r0,#10", "lsr lr,r0,#2", "sbcs r3,r1,#0",
    "orr lr,lr,r1,lsl #30", "subs r0,r0,lr", "sbc r1,r1,r1,lsr #2", "lsr lr,r0,#4",
    "orr lr,lr,r1,lsl #28", "adds r0,r0,lr", "adc r1,r1,r1,lsr #4", "lsr lr,r0,#8",
    "orr lr,lr,r1,lsl #24", "adds r0,r0,lr", "adc r1,r1,r1,lsr #8", "lsr lr,r0,#16",
    "orr lr,lr,r1,lsl #16", "adds r0,r0,lr", "adc r1,r1,r1,lsr #16", "adds r0,r0,r1",
    "adc r1,r1,#0", "lsr r0,r0,#3", "orr r0,r0,r1,lsl #29", "lsr r1,r1,#3",
    "adds r5,r0,r0,lsl #2", "lsl r4,r1,#2", "orr r4,r4,r0,lsr #30", "adc r4,r4,r1",
    "adds r5,r5,r5", "adc r4,r4,r4", "subs r2,r2,r5", "sbcs r3,r3,r4", "mov r3,#0",
    "addmi r2,r2,#10", "popmi {r4,r5,pc}", "adds r0,r0,#1", "adc r1,r1,#0", "pop {r4,r5,pc}",
  ]],
  ["func_0030F584", [
    "push {r4}", "ldr r1,[r0]", "mov r12,#0", "mov r3,r12", "ldr r0,[r0]",
    "ldr r2,[r1,#4]!", "cmp r2,#0", "addne r2,r2,r1", "moveq r2,r3", "ldr r0,[r0,#8]",
    "ldr r4,[r2,#8]", "add r1,r2,#8", "and r0,r0,#255", "cmp r4,#0", "addne r1,r1,r4",
    "moveq r1,r3", "cmp r1,#0", "cmpne r0,#1", "cmpne r0,#0", "beq 1f", "ldr r0,[r1]",
    "cmp r0,#0x20000004", "bne 2f", "ldr r0,[r1,#28]!", "cmp r0,#0", "addne r3,r0,r1",
    "mov r1,r3", "2:", "ldr r0,[r1,#40]", "sub r12,r0,#1", "1:", "add r0,r2,#16",
    "lsl r2,r12,#28", "ldr r1,[r0,#24]", "bic r1,r1,#0xf0000", "orr r1,r1,r2,lsr #12",
    "str r1,[r0,#24]", "pop {r4}", "bx lr",
  ]],
]);
const expectedFunctions = [
  ["func_002F39D4", 116], ["func_002F3ED8", 140], ["func_002F9230", 128],
  ["func_002FF24C", 152], ["func_0030F584", 148],
];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_36.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 684 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (JSON.stringify(manifest.symbolicIdentities) !== "{}") fail("symbolic identities must be empty");

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (/^\s*\.(?:word|long|4byte)\b/m.test(sourceText)) fail("source must not contain literal or adjacent data words");
if (!sourceText.startsWith(".syntax unified\n.arch armv6k\n.arm\n")) fail("ARMv6K source preamble is invalid");

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
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-36.mjs [base-object readelf]");
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
      value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10),
      type: fields[3], bind: fields[4], section: fields[6], name: fields.slice(7).join(" "),
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

  const parsedRelocations = [];
  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) {
      parsedRelocations.push({ section: relocationSection, offset: Number.parseInt(fields[0], 16) });
    }
  }
  for (const [name, size] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const relevant = parsedRelocations.filter((relocation) => relocation.section === `.text.${name}` &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + size);
    if (relevant.length !== 0) fail(`${name} must have no relocations`);
  }
}

console.log("Validated ARM runtime helpers batch 36: 5 functions, 684 body bytes, no relocations, literals, or adjacent words.");
