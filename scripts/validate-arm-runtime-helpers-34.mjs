import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-34.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-34 validation failed: ${message}`);
  process.exit(1);
}

const expectedSchedules = new Map([
  ["func_002E173C", [
    "mov r1,#0", "str r1,[r0,#8]", "str r1,[r0,#12]", "str r1,[r0,#16]",
    "str r1,[r0,#20]", "str r1,[r0,#24]", "str r1,[r0,#28]", "str r1,[r0,#32]",
    "str r1,[r0,#36]", "str r1,[r0,#40]", "str r1,[r0,#44]", "str r1,[r0,#48]",
    "str r1,[r0,#52]", "str r1,[r0]", "strb r1,[r0,#4]", "strb r1,[r0,#5]",
    "strb r1,[r0,#6]", "bx lr",
  ]],
  ["func_002F32AC", [
    "sub r0,r0,#5120", "subs r0,r0,#6", "mov r0,#1", "moveq r0,#4", "mul r0,r1,r0",
    "add r1,r2,#31", "bic r1,r1,#31", "add r0,r0,r1", "bx lr",
  ]],
  ["func_002F3950", [
    "add r12,r2,#8", "sub r0,r0,#5120", "mul r1,r12,r1", "subs r0,r0,#6", "mov r0,#1",
    "moveq r0,#4", "add r2,r3,#31", "mul r0,r1,r0", "bic r1,r2,#31", "add r1,r1,r0",
    "add r1,r1,#31", "bic r1,r1,#31", "add r1,r1,r0", "add r0,r0,r1", "bx lr",
  ]],
  ["func_002F398C", [
    "ldr r1,[r0,#4]", "mov r2,#32", "str r2,[r0,#4]", "ldr r3,[r0,#8]", "cmp r3,#32",
    "movcs r2,r3", "str r2,[r0,#8]", "ldr r2,[r0]", "str r1,[r0,#4]", "add r2,r2,#31",
    "bic r2,r2,#31", "add r2,r2,#2144", "str r2,[r0]", "ldr r2,[r0,#8]", "cmp r2,r1",
    "movcs r1,r2", "str r1,[r0,#8]", "bx lr",
  ]],
  ["func_002F78F0", ["mov r1,#0", "strb r1,[r0,#300]", "bx lr"]],
  ["func_002FCE50", ["ldr r0,[r0,#8]", "ldr r1,[r0]", "ldr r1,[r1,#16]", "bx r1"]],
  ["func_002FF7C0", [
    "sub r1,r0,#10", "sub r0,r0,r0,lsr #2", "add r0,r0,r0,lsr #4", "add r0,r0,r0,lsr #8",
    "add r0,r0,r0,lsr #16", "lsr r0,r0,#3", "add r2,r0,r0,lsl #2",
    "subs r1,r1,r2,lsl #1", "addpl r0,r0,#1", "addmi r1,r1,#10", "bx lr",
  ]],
  ["func_002FFBE0", [
    "stmfd sp!,{lr}", "mov lr,r0", "umull r0,r12,r2,lr", "mla r1,r2,r1,r12",
    "mla r1,r3,lr,r1", "ldmfd sp!,{pc}",
  ]],
]);
const expectedFunctions = [
  ["func_002E173C", 72], ["func_002F32AC", 36], ["func_002F3950", 60],
  ["func_002F398C", 72], ["func_002F78F0", 12], ["func_002FCE50", 16],
  ["func_002FF7C0", 44], ["func_002FFBE0", 24],
];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_34.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 336 ||
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

function normalize(line) {
  return line.replace(/\/\/.*$/, "").trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",")
    .replace(/\[\s*/g, "[").replace(/\s*\]/g, "]").replace(/\{\s*/g, "{").replace(/\s*\}/g, "}");
}
for (const [name] of expectedFunctions) {
  const start = sourceText.indexOf(`${name}:`);
  const end = sourceText.indexOf(`.size ${name}`, start);
  if (start < 0 || end < 0 || !sourceText.includes(`.global ${name}`) ||
      !sourceText.includes(`.type ${name}, %function`)) fail(`source declaration for ${name} is missing`);
  const actual = sourceText.slice(start + name.length + 1, end).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(expectedSchedules.get(name))) {
    fail(`${name} exact instruction schedule is invalid`);
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-34.mjs [base-object readelf]");
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

console.log("Validated ARM runtime helpers batch 34: 8 functions, 336 body bytes, no relocations, literals, or adjacent words.");
