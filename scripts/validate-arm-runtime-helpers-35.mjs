import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-35.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-35 validation failed: ${message}`);
  process.exit(1);
}

const expectedSchedules = new Map([
  ["func_00300EA8", [
    "subs r3,r2,#32", "bpl 1f", "rsb r3,r2,#32", "lsl r1,r1,r2",
    "orr r1,r1,r0,lsr r3", "lsl r0,r0,r2", "bx lr", "1:",
    "lsl r1,r0,r3", "mov r0,#0", "bx lr",
  ]],
  ["func_00301FBC", [
    "mov r2,#0", "stmfd sp!,{lr}", "mov r3,r2", "mov r12,r2", "mov lr,r2",
    "subs r1,r1,#32", "1:", "stmiacs r0!,{r2,r3,r12,lr}",
    "stmiacs r0!,{r2,r3,r12,lr}", "subscs r1,r1,#32", "bcs 1b",
    "lsls r1,r1,#28", "stmiacs r0!,{r2,r3,r12,lr}", "stmiami r0!,{r2,r3}",
    "ldmfd sp!,{lr}", "lsls r1,r1,#2", "strcs r2,[r0],#4", "bxeq lr",
    "strhmi r2,[r0],#2", "tst r1,#0x40000000", "strbne r2,[r0],#1", "bx lr",
  ]],
  ["func_003028B8", [
    "cmp r2,#0", "beq 2f", "cmp r1,#0", "beq 3f", "ldr r1,[r1,#8]",
    "mov r3,#0x40000001", "cmp r1,#0", "beq 1f", "ldr r0,[r1]",
    "bics r0,r3,r0", "movne r1,#0", "1:", "ldr r0,[r2,#8]", "cmp r0,#0",
    "beq 4f", "ldr r2,[r0]", "bics r2,r3,r2", "movne r0,#0", "4:",
    "ldr r1,[r1,#76]", "ldr r0,[r0,#76]", "cmp r1,r0", "bcs 3f", "2:",
    "mov r0,#1", "bx lr", "3:", "mov r0,#0", "bx lr",
  ]],
  ["func_00303150", [
    "ldr r1,[r0,#60]", "mov r2,#16", "bics r2,r2,r1", "beq 1f", "ldr r2,[r0]",
    "cmp r2,#0x3f800000", "bne 2f", "ldr r2,[r0,#20]", "cmp r2,#0x3f800000",
    "orreq r1,r1,#128", "beq 3f", "2:", "bic r1,r1,#128", "3:",
    "str r1,[r0,#60]", "1:", "bx lr",
  ]],
  ["func_003032D0", [
    "ldr r1,[r0,#60]", "mov r2,#384", "bic r1,r1,#96", "bics r2,r2,r1",
    "str r1,[r0,#60]", "bne 1f", "orr r1,r1,#64", "mov r2,#512",
    "bics r2,r2,r1", "str r1,[r0,#60]", "orreq r1,r1,#32",
    "streq r1,[r0,#60]", "1:", "bx lr",
  ]],
  ["func_00305760", [
    "ldr r1,[r1,#76]", "ldr r1,[r1,#204]", "cmp r1,#0", "ble 1f",
    "ldr r1,[r0]", "mov r0,#0", "strb r0,[r1]", "1:", "bx lr",
  ]],
  ["func_0030E318", [
    "ldr r0,[r0]", "ldr r1,[r0]", "cmp r1,#0x80000000", "beq 1f",
    "cmp r1,#0x40000000", "bne 2f", "ldr r1,[r0,#12]!", "cmp r1,#0",
    "addne r0,r0,r1", "bne 1f", "2:", "mov r0,#0", "1:", "bx lr",
  ]],
  ["func_0030FDE8", ["ldr r2,[r0]", "mov r1,#0", "mov r0,r1", "bx lr"]],
]);
const expectedFunctions = [
  ["func_00300EA8", 40], ["func_00301FBC", 84], ["func_003028B8", 100],
  ["func_00303150", 56], ["func_003032D0", 52], ["func_00305760", 32],
  ["func_0030E318", 48], ["func_0030FDE8", 16],
];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_35.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 428 ||
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
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-35.mjs [base-object readelf]");
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
    fail(`could not inspect base object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("base object is not ARM");

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

console.log("Validated ARM runtime helpers batch 35: 8 functions, 428 body bytes, no relocations, literals, or adjacent words.");
