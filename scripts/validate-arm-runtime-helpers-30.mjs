import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-30.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-30 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002E6E14", 12, []],
  ["func_002E6E40", 44, [
    { offset: 32, kind: "R_ARM_CALL", symbol: "runtime_variadic_forward_alpha_30" },
  ]],
  ["func_002E6E8C", 44, [
    { offset: 32, kind: "R_ARM_CALL", symbol: "runtime_variadic_forward_beta_30" },
  ]],
  ["func_002E9A1C", 28, [
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_nonzero_dispatch_30" },
  ]],
  ["func_002EDAEC", 52, [
    { offset: 40, kind: "R_ARM_CALL", symbol: "runtime_stack_record_forward_30" },
  ]],
];
if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_30.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 180 ||
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

const expectedContracts = {
  runtime_variadic_forward_alpha_30: {
    mode: "thumb", minimumAlignment: 2, equality: "batch-local-unique",
    usage: "bounded-variadic-forward-alpha-call",
  },
  runtime_variadic_forward_beta_30: {
    mode: "thumb", minimumAlignment: 2, equality: "batch-local-unique",
    usage: "bounded-variadic-forward-beta-call",
  },
  runtime_nonzero_dispatch_30: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "nonzero-loaded-value-tail-dispatch",
  },
  runtime_stack_record_forward_30: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "zero-filled-stack-record-call",
  },
};
if (JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedContracts)) {
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
if (/^\s*\.(?:word|long|4byte)\b/m.test(sourceText)) fail("source must not contain literal or adjacent data words");
if ((sourceText.match(/^\s*(?:bl|blx)\b/gm) ?? []).length !== 3 ||
    !/^\s*blx runtime_variadic_forward_alpha_30\s*$/m.test(sourceText) ||
    !/^\s*blx runtime_variadic_forward_beta_30\s*$/m.test(sourceText) ||
    !/^\s*b runtime_nonzero_dispatch_30\s*$/m.test(sourceText) ||
    !/^\s*bl runtime_stack_record_forward_30\s*$/m.test(sourceText)) {
  fail("source must contain the four exact symbolic transfers");
}
for (const identity of Object.keys(expectedContracts)) {
  if (!sourceText.includes(`.global ${identity}`) || !sourceText.includes(`.type ${identity}, %function`) ||
      new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`${identity} must remain an undefined global function identity`);
  }
}

const expectedSchedules = new Map([
  ["func_002E6E14", ["mvn r1,#0", "str r1,[r0]", "bx lr"]],
  ["func_002E6E40", [
    "mov r12,r2", "push {r0-r3}", "add r12,r12,#1", "push {r4,lr}", "cmp r1,r12",
    "ldr r2,[sp,#20]", "add r3,sp,#24", "movhi r1,r12",
    "blx runtime_variadic_forward_alpha_30", "pop {r4}", "ldr pc,[sp],#20",
  ]],
  ["func_002E6E8C", [
    "push {r0-r3}", "mov r12,r2", "add r12,r12,#1", "push {r4,lr}", "cmp r1,r12",
    "ldr r2,[sp,#20]", "add r3,sp,#24", "movhi r1,r12",
    "blx runtime_variadic_forward_beta_30", "pop {r4}", "ldr pc,[sp],#20",
  ]],
  ["func_002E9A1C", [
    "mov r0,r1", "mov r0,r0", "ldr r0,[r0,#76]", "cmp r0,#0", "beq",
    "b runtime_nonzero_dispatch_30", "bx lr",
  ]],
  ["func_002EDAEC", [
    "push {lr}", "sub sp,sp,#20", "add r12,sp,#4", "mov r3,#0", "stm r12,{r1-r3}",
    "mov r2,r3", "str r3,[sp,#16]", "ldr r1,[r0]", "str r1,[sp]", "mov r1,r3",
    "bl runtime_stack_record_forward_30", "add sp,sp,#20", "pop {pc}",
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
    .map(normalizeInstruction).filter((line) => line && !line.endsWith(":"));
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
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-30.mjs [base-object readelf]");
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
    if (matches.length !== 1) fail(`base object must contain exactly one ${name}`);
    const symbol = matches[0];
    if (symbol.size !== size || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") {
      fail(`${name} is not a defined ${size}-byte global function`);
    }
    functionSymbols.set(name, symbol);
  }
  for (const identity of Object.keys(expectedContracts)) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === identity);
    if (matches.length !== 1 || matches[0].type !== "FUNC" ||
        matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") {
      fail(`${identity} must remain one undefined global function identity`);
    }
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
        section: relocationSection, offset: Number.parseInt(fields[0], 16),
        kind: fields[2], symbol: fields[4],
      });
    }
  }
  for (const [name, size, calls] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const bodyRelocations = parsedRelocations.filter((relocation) =>
      relocation.section === `.text.${name}` &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + size);
    const actualCalls = bodyRelocations.map(({ offset, kind, symbol: target }) => ({
      offset: offset - symbol.value, kind, symbol: target,
    }));
    if (JSON.stringify(actualCalls) !== JSON.stringify(calls)) fail(`${name} relocation set is invalid`);
  }
}

console.log("Validated ARM runtime helpers batch 30: 5 functions, 180 body bytes, four symbolic branches, no literals or adjacent words.");
