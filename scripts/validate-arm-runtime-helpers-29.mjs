import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-29.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-29 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002D03B4", 284, []],
  ["func_002DFED0", 80, [{ offset: 12, kind: "R_ARM_CALL", symbol: "runtime_record_prepare_29" }]],
];
if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_29.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 364 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, calls] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size ||
      JSON.stringify(entry.calls) !== JSON.stringify(calls) ||
      !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail(`manifest entry for ${name} is invalid`);
  }
}

const expectedContract = {
  mode: "arm",
  minimumAlignment: 4,
  equality: "batch-local-unique",
  usage: "original-source-output-preparation-call",
};
if (manifest.symbolicIdentities === null || typeof manifest.symbolicIdentities !== "object" ||
    Array.isArray(manifest.symbolicIdentities) ||
    Object.keys(manifest.symbolicIdentities).join(",") !== "runtime_record_prepare_29" ||
    JSON.stringify(manifest.symbolicIdentities.runtime_record_prepare_29) !== JSON.stringify(expectedContract)) {
  fail("symbolic identity contract is invalid");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (/^\s*\.(?:word|long|4byte)\b/m.test(sourceText)) fail("source must not contain literal or adjacent data words");
if ((sourceText.match(/^\s*(?:bl|blx)\b/gm) ?? []).length !== 1 ||
    !/^\s*bl runtime_record_prepare_29\s*$/m.test(sourceText) ||
    !sourceText.includes(".global runtime_record_prepare_29") ||
    /^runtime_record_prepare_29\s*:/m.test(sourceText)) {
  fail("source must contain exactly one call to one undefined symbolic identity");
}

const expectedSchedules = new Map([
  ["func_002D03B4", [
    "push {r4-r9}", "cmp r3,#0", "ldrhne r12,[r1,#8]", "beq", "ldrh r4,[r2,#2]",
    "cmp r4,r12", "bne", "ldrb r3,[r1,#10]", "ldrb r12,[r2,#1]", "cmp r12,r3",
    "bne", "ldrb r12,[r2]", "add r12,r12,r12,lsl #1", "add r5,r0,r12,lsl #2",
    "ldrb r12,[r5,#11]", "cmp r12,#0", "beq", "pop {r4-r9}", "mov r0,#0", "bx lr",
    "ldr r4,[r1]", "cmp r4,#0", "beq", "cmp r3,#2", "beq", "cmp r3,#5",
    "cmpne r3,#10", "bne", "b", "ldr r3,[r1,#4]", "add r3,r3,r4", "ldrb r3,[r3,#-1]",
    "cmp r3,#0", "bne", "b", "cmp r4,#0", "ldrhi r12,[r1,#4]", "mov r3,#0", "bls",
    "add r6,r3,#4", "add r7,r3,#5", "add r8,r3,#6", "add r9,r3,#7", "ldrb r6,[r12,r6]",
    "ldrb r7,[r12,r7]", "ldrb r8,[r12,r8]", "ldrb r9,[r12,r9]", "orr r6,r6,r7",
    "orr r7,r8,r9", "orrs r6,r6,r7", "beq", "add r3,r3,#8", "cmp r4,r3", "bhi",
    "ldr r3,[r1,#4]", "ldr r1,[r1,#8]", "mov r12,#1", "str r1,[r5,#8]", "str r3,[r5,#4]",
    "str r4,[r5]", "ldrb r1,[r2]", "add r1,r1,r1,lsl #1", "add r0,r0,r1,lsl #2",
    "strb r12,[r0,#11]", "b", "subs r3,r3,#1", "add r2,r2,#4", "bne", "pop {r4-r9}",
    "mov r0,#1", "bx lr",
  ]],
  ["func_002DFED0", [
    "push {r4-r6,lr}", "mov r4,r1", "mov r5,r0", "bl runtime_record_prepare_29",
    "ldr r0,[r5,#80]", "rev r0,r0", "str r0,[r4]", "ldr r0,[r5,#84]", "rev r0,r0",
    "str r0,[r4,#4]", "ldr r0,[r5,#88]", "rev r0,r0", "str r0,[r4,#8]",
    "ldr r0,[r5,#92]", "rev r0,r0", "str r0,[r4,#12]", "ldr r0,[r5,#96]",
    "rev r0,r0", "str r0,[r4,#16]", "pop {r4-r6,pc}",
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
    const wanted = expected[index];
    if (["b", "beq", "bne", "bls", "bhi"].includes(wanted)) {
      if (!actual[index].startsWith(`${wanted} `)) {
        fail(`${name} instruction ${index + 1} must be ${wanted}`);
      }
    } else if (actual[index] !== wanted) {
      fail(`${name} instruction ${index + 1} is ${actual[index]}, expected ${wanted}`);
    }
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-29.mjs [base-object readelf]");
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
  const functionSymbols = new Map();
  for (const [name, size] of expectedFunctions) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1) fail(`base object must contain exactly one ${name}`);
    const symbol = matches[0];
    if (symbol.size !== size || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") {
      fail(`${name} is not a defined ${size}-byte global function`);
    }
    functionSymbols.set(name, symbol);
  }
  const identityMatches = parsedSymbols.filter((symbol) => symbol.name === "runtime_record_prepare_29");
  if (identityMatches.length !== 1 || identityMatches[0].type !== "FUNC" ||
      identityMatches[0].bind !== "GLOBAL" || identityMatches[0].section !== "UND") {
    fail("runtime_record_prepare_29 must remain one undefined global ARM function identity");
  }

  const parsedRelocations = [];
  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) {
      relocationSection = heading[1];
      continue;
    }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) {
      parsedRelocations.push({
        section: relocationSection,
        offset: Number.parseInt(fields[0], 16),
        kind: fields[2],
        symbol: fields[4],
      });
    }
  }
  for (const [name, size, calls] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const bodyRelocations = parsedRelocations.filter((relocation) =>
      relocation.section === `.text.${name}` &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + size);
    if (JSON.stringify(bodyRelocations.map(({ offset, kind, symbol: target }) => ({
      offset: offset - symbol.value,
      kind,
      symbol: target,
    }))) !== JSON.stringify(calls)) {
      fail(`${name} relocation set is invalid`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 29: 2 functions, 364 body bytes, one symbolic ARM call, no literals or adjacent words.");
