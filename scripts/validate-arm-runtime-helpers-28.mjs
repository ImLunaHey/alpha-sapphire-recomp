import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-28.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-28 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002D0318", 156],
  ["func_002DCC60", 156],
];

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" || manifest.totalBodySize !== 312 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size ||
      !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (manifest.symbolicIdentities === null || typeof manifest.symbolicIdentities !== "object" ||
    Array.isArray(manifest.symbolicIdentities) || Object.keys(manifest.symbolicIdentities).length !== 0) {
  fail("batch must not declare symbolic identities");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (/^\s*(?:bl|blx)\b/m.test(sourceText)) fail("source must not contain calls");
if (/^\s*\.(?:word|long|4byte)\b/m.test(sourceText)) fail("source must not contain literal or adjacent data words");

const expectedSchedules = new Map([
  ["func_002D0318", [
    "mov r2,r1", "ldrb r1,[r0,#4]", "cmp r1,#0", "beq", "ldr r1,[r0]",
    "ldrb r0,[r1,#68]", "cmp r0,#0", "beq", "mov r0,#0", "bx lr", "mov r0,r2",
    "mov r0,r0", "ldrb r2,[r1,#74]", "add r1,r1,#8192", "add r1,r1,#4", "cmp r2,#0",
    "ldrbne r2,[r1,#35]", "cmpne r2,#0", "beq", "ldr r2,[r1,#24]", "cmp r2,#20",
    "beq", "mov r0,#0", "bx lr", "ldr r2,[r1,#28]", "mov r1,#0", "ldr r3,[r2]",
    "str r3,[r0]", "ldr r3,[r2,#4]", "str r3,[r0,#4]", "ldr r3,[r2,#8]",
    "str r3,[r0,#8]", "ldr r3,[r2,#12]", "str r3,[r0,#12]", "ldr r2,[r2,#16]",
    "str r2,[r0,#16]", "strb r1,[r0,#19]", "mov r0,#20", "bx lr",
  ]],
  ["func_002DCC60", [
    "ldr r3,[r0,#16]", "cmp r3,#0", "ldrheq r3,[r0,#32]", "beq", "cmp r3,#3",
    "mvncs r0,#0", "movcc r0,#0", "bx lr", "push {r4,r5}", "ldrh r4,[r0,#34]",
    "mov r5,#83", "mov r12,#5", "add r12,r12,r3,lsl #1", "mul r4,r4,r5", "mov r3,#3",
    "bic r12,r12,#3", "cmp r1,#0", "add r3,r3,r4,lsl #1", "bic r3,r3,#3",
    "add r3,r3,r12", "addne r3,r3,#68", "ldr r0,[r0,#28]", "cmp r2,#0",
    "addne r3,r3,#41984", "addne r3,r3,#108", "tst r0,#1", "mov r1,r12",
    "addne r1,r12,#68", "tst r0,#2", "addne r1,r1,#41984", "addne r1,r1,#108",
    "cmp r3,r1", "movcs r1,r3", "add r0,r1,#3840", "add r0,r0,#255", "pop {r4,r5}",
    "lsr r0,r0,#12", "lsl r0,r0,#12", "bx lr",
  ]],
]);

function normalizeInstruction(line) {
  return line.replace(/\/\/.*$/, "").trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",")
    .replace(/\[\s*/g, "[").replace(/\s*\]/g, "]").replace(/\{\s*/g, "{").replace(/\s*\}/g, "}");
}
for (const [name] of expectedFunctions) {
  const start = sourceText.indexOf(`${name}:`);
  const end = sourceText.indexOf(`.size ${name}`, start);
  if (start < 0 || end < 0) fail(`source body for ${name} is missing`);
  const actual = sourceText.slice(start + name.length + 1, end).split("\n")
    .map(normalizeInstruction)
    .filter((line) => line && !line.endsWith(":"));
  const expected = expectedSchedules.get(name);
  if (actual.length !== expected.length) fail(`${name} must contain exactly ${expected.length} instructions`);
  for (let index = 0; index < expected.length; index++) {
    if (expected[index] === "beq") {
      if (!actual[index].startsWith("beq ")) fail(`${name} instruction ${index + 1} must be beq`);
    } else if (actual[index] !== expected[index]) {
      fail(`${name} instruction ${index + 1} is ${actual[index]}, expected ${expected[index]}`);
    }
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-28.mjs [base-object readelf]");
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
      value: Number.parseInt(fields[1], 16),
      size: Number.parseInt(fields[2], 10),
      type: fields[3],
      bind: fields[4],
      section: fields[6],
      name: fields.slice(7).join(" "),
    });
  }
  for (const [name, size] of expectedFunctions) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1) fail(`base object must contain exactly one ${name}`);
    const symbol = matches[0];
    if (symbol.size !== size || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") {
      fail(`${name} is not a defined ${size}-byte global function`);
    }
  }
  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) {
      relocationSection = heading[1];
      continue;
    }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 3 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2]) &&
        expectedFunctions.some(([name]) => relocationSection === `.text.${name}`)) {
      fail(`${relocationSection} must have no relocations`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 28: 2 functions, 312 body bytes, no calls, literals, adjacent words, relocations, or identities.");
