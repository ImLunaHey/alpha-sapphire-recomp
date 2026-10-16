import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-37.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-37 validation failed: ${message}`);
  process.exit(1);
}

const expectedSchedules = new Map([
  ["func_00312F30", [
    "add r2,r1,#368", "ldm r2,{r2,r3}", "cmp r2,r3", "strdne r2,[r0]", "bne 1f",
    "ldr r1,[r1,#8]", "add r2,r1,#184", "ldr r3,[r1,#184]", "ldr r1,[r1,#180]",
    "cmp r3,#0", "addne r2,r2,r3", "moveq r2,#0", "add r1,r2,r1,lsl #2", "str r2,[r0]",
    "str r1,[r0,#4]", "1:", "bx lr",
  ]],
  ["func_00312F70", [
    "ldrsh r3,[r1,#38]", "cmp r3,#0", "bge 2f", "ldrb r0,[r1,#36]", "cmp r0,#0",
    "beq 1f", "3:", "mov r0,#1", "1:", "bx lr", "2:", "add r2,r0,#380", "ldm r2,{r2,r12}",
    "cmp r2,r12", "addne r0,r2,r3,lsl #3", "bne 4f", "ldr r2,[r0,#8]", "mov r0,#0",
    "ldr r12,[r2,#208]!", "cmp r12,#0", "addne r2,r2,r12", "moveq r2,r0", "cmp r2,#0",
    "moveq r0,#0", "beq 4f", "add r2,r2,r3,lsl #4", "ldr r3,[r2,#40]!", "cmp r3,#0",
    "addne r0,r3,r2", "4:", "ldrb r0,[r0,#4]", "cmp r0,#0", "ldrbne r0,[r1,#36]",
    "cmpne r0,#0", "moveq r0,#0", "bne 3b", "bx lr",
  ]],
  ["func_003158B4", [
    "mov r2,#1", "strb r2,[r0]", "mov r3,#4", "strb r2,[r0,#1]", "add r12,r0,#8",
    "str r3,[r0,#4]", "mov r1,#8", "stm r12,{r1,r2}", "mov r3,#0", "str r3,[r0,#16]",
    "strb r2,[r0,#20]", "str r3,[r0,#24]", "strb r2,[r0,#28]", "bx lr",
  ]],
  ["func_0031C05C", [
    "push {r4}", "ldr r12,[r1,#16]!", "ldr r4,[r0]", "ldr r3,[r1,#8]", "ldr r1,[r0,#4]",
    "cmp r2,#0", "add r4,r4,r1", "sub r1,r1,#1", "sub r4,r4,#1", "bic r1,r4,r1",
    "add r3,r1,r3,lsl #2", "lsl r1,r12,#2", "ldr r12,[r0,#4]", "add r3,r3,r12",
    "sub r12,r12,#1", "sub r3,r3,#1", "bic r3,r3,r12", "ldr r12,[r0,#4]",
    "add r3,r3,r1", "add r3,r3,r12", "sub r12,r12,#1", "sub r3,r3,#1", "bic r3,r3,r12",
    "ldr r12,[r0,#4]", "add r3,r3,r1", "add r3,r3,r12", "sub r12,r12,#1",
    "sub r3,r3,#1", "bic r3,r3,r12", "add r3,r3,r1", "str r3,[r0]", "beq 1f",
    "ldr r2,[r0,#4]", "add r3,r3,r2", "sub r2,r2,#1", "sub r3,r3,#1", "bic r2,r3,r2",
    "add r1,r1,r2", "str r1,[r0]", "1:", "pop {r4}", "bx lr",
  ]],
  ["func_0031D8D0", [
    "push {r4,r5}", "ldrb r1,[r0,#10]", "mov r2,#0", "cmp r1,#0", "ldrh r1,[r0,#2]",
    "beq 1f", "ldrh r2,[r0,#6]", "mov r3,#208", "add r2,r2,#15", "bic r2,r2,#15",
    "mla r2,r3,r1,r2", "lsl r2,r2,#1", "add r2,r2,r1,lsl #2", "lsl r2,r2,#1",
    "add r2,r2,r1,lsl #8", "add r2,r2,#100", "1:", "ldrh r12,[r0]", "ldrh r4,[r0,#4]",
    "mov r3,#108", "add r12,r12,#1", "ldrb r0,[r0,#8]", "mul r12,r12,r3",
    "rsb r5,r1,r1,lsl #4", "add r1,r5,r1,lsl #6", "add r3,r4,r4,lsl #1",
    "add r3,r3,r4,lsl #6", "cmp r0,#0", "add r1,r12,r1,lsl #3", "add r0,r1,r3,lsl #3",
    "add r0,r0,r2", "pop {r4,r5}", "addne r0,r0,#464", "bx lr",
  ]],
]);
const expectedFunctions = [
  ["func_00312F30", 64], ["func_00312F70", 132], ["func_003158B4", 56],
  ["func_0031C05C", 164], ["func_0031D8D0", 132],
];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_37.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 548 ||
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
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-37.mjs [base-object readelf]");
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

console.log("Validated ARM runtime helpers batch 37: 5 functions, 548 body bytes, no relocations, literals, or adjacent words.");
