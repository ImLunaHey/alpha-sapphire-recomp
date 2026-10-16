import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-33.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-33 validation failed: ${message}`);
  process.exit(1);
}

const wrappers = [
  ["func_002DDAA4", "func_002DE630"],
  ["func_002DDB28", "func_002DE678"],
  ["func_002DDC20", "func_002DE744"],
  ["func_002DDCA4", "func_002DE78C"],
  ["func_002DDD94", "func_002DE83C"],
  ["func_002DDFA8", "func_002DE8F0"],
  ["func_002DE02C", "func_002DE938"],
  ["func_002DE0B0", "func_002DE980"],
  ["func_002DE1E4", "func_002DEB2C"],
  ["func_002DE268", "func_002DEB74"],
];
const expectedCalls = (operation) => [
  { offset: 36, kind: "R_ARM_CALL", symbol: operation },
  { offset: 84, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
];
const expectedWords = [
  { offset: 124, kind: "R_ARM_ABS32", symbol: "runtime_retry_exhausted_status_33" },
  { offset: 128, kind: "R_ARM_ABS32", symbol: "service_query_accepted_status_31" },
];
const expectedOperationContracts = Object.fromEntries(wrappers.map(([, operation]) => [operation, {
  mode: "arm", minimumAlignment: 4, equality: "pairwise-distinct",
}]));
const expectedIdentities = {
  operations: expectedOperationContracts,
  runtime_failure_raise_entry_31: {
    mode: "arm", minimumAlignment: 4, equality: "shared-runtime-31-failure-identity",
  },
  runtime_retry_exhausted_status_33: {
    minimumSlotAlignment: 4, equality: "shared-ten-site-distinct-status",
  },
  service_query_accepted_status_31: {
    minimumSlotAlignment: 4,
    equality: "shared-ten-site-and-ipc31-query-status",
    distinctFrom: "service_open_accepted_status_31",
  },
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_33.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1240 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== wrappers.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
for (let index = 0; index < wrappers.length; index++) {
  const [name, operation] = wrappers[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== 124 ||
      JSON.stringify(entry.calls) !== JSON.stringify(expectedCalls(operation)) ||
      JSON.stringify(entry.adjacentWords) !== JSON.stringify(expectedWords)) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedIdentities)) {
  fail("symbolic identity equality contract is invalid");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");

for (const [, operation] of wrappers) {
  if (!sourceText.includes(`.global ${operation}`) ||
      !sourceText.includes(`.type ${operation}, %function`) ||
      new RegExp(`^${operation}\\s*:`, "m").test(sourceText)) {
    fail(`${operation} must be declared but not defined by the runtime 33 source`);
  }
}
for (const identity of ["runtime_failure_raise_entry_31", "runtime_retry_exhausted_status_33",
  "service_query_accepted_status_31"]) {
  if (!sourceText.includes(`.global ${identity}`) || new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`${identity} must remain an undefined global identity`);
  }
}
if (sourceText.includes("service_open_accepted_status_31")) {
  fail("the IPC31 open-status identity must not appear in runtime 33 source");
}

function normalize(line) {
  return line.replace(/\/\/.*$/, "").trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",")
    .replace(/\[\s*/g, "[").replace(/\s*\]/g, "]").replace(/\{\s*/g, "{").replace(/\s*\}/g, "}");
}
const macroStart = sourceText.indexOf(".macro RETRY_WRAPPER function, operation");
const macroEnd = sourceText.indexOf(".endm", macroStart);
if (macroStart < 0 || macroEnd < 0) fail("RETRY_WRAPPER macro is missing");
const actualMacro = sourceText.slice(macroStart, macroEnd + 5).split("\n").map(normalize).filter(Boolean);
const expectedMacro = [
  ".macro RETRY_WRAPPER function,operation", ".section .text.\\function,\"ax\",%progbits", ".balign 4", ".arm",
  ".global \\function", ".type \\function,%function", "\\function:",
  "push {r4,r5,r6,r7,r8,r9,r10,lr}", "mov r4,#0", "mov r8,r0", "mov r9,r1",
  "ldr r5,.Lpool_\\function", "ldr r6,.Lpool_\\function+4", "add r7,r5,#1020",
  ".Lretry_\\function:", "mov r1,r9", "mov r0,r8", "bl \\operation", "ands r1,r0,#0x80000000",
  "mov r2,r0", "bpl .Lnonnegative_\\function", "cmp r0,r6", "beq .Lreturn_\\function",
  "and r1,r0,#0x3fc00", "cmp r1,#0x2c00", "beq .Lnext_\\function", "cmp r0,r7",
  "beq .Lexhausted_\\function", "lsrs r0,r2,#31", "blne runtime_failure_raise_entry_31",
  ".Lnext_\\function:", "add r4,r4,#1", "cmp r4,#2", "blt .Lretry_\\function",
  "b .Lexhausted_\\function", ".Lnonnegative_\\function:", "cmp r4,#2", "movlt r0,#0",
  "blt .Lreturn_\\function", ".Lexhausted_\\function:", "mov r0,r5", ".Lreturn_\\function:",
  "pop {r4,r5,r6,r7,r8,r9,r10,pc}", ".size \\function,.-\\function", ".Lpool_\\function:",
  ".word runtime_retry_exhausted_status_33", ".word service_query_accepted_status_31", ".endm",
];
if (JSON.stringify(actualMacro) !== JSON.stringify(expectedMacro)) fail("exact retry-wrapper macro schedule is invalid");
const invocations = sourceText.split("\n").map(normalize)
  .filter((line) => line.startsWith("RETRY_WRAPPER func_"));
const expectedInvocations = wrappers.map(([name, operation]) => `RETRY_WRAPPER ${name},${operation}`);
if (JSON.stringify(invocations) !== JSON.stringify(expectedInvocations)) fail("wrapper invocation order is invalid");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-33.mjs [base-object readelf]");
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
  for (const [name] of wrappers) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1 || matches[0].size !== 124 || matches[0].type !== "FUNC" ||
        matches[0].bind !== "GLOBAL" || matches[0].section === "UND") {
      fail(`${name} must be one defined 124-byte global function`);
    }
    functionSymbols.set(name, matches[0]);
  }
  for (const identity of ["runtime_failure_raise_entry_31", "runtime_retry_exhausted_status_33",
    "service_query_accepted_status_31"]) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === identity);
    if (matches.length !== 1 || matches[0].bind !== "GLOBAL") fail(`${identity} must be one global identity`);
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
  let calls = 0;
  let jumps = 0;
  let absoluteWords = 0;
  for (const [name, operation] of wrappers) {
    const symbol = functionSymbols.get(name);
    const section = `.text.${name}`;
    const relevant = parsedRelocations.filter((relocation) => relocation.section === section &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + 132);
    const expected = [...expectedCalls(operation), ...expectedWords].map((relocation) => ({
      section, offset: symbol.value + relocation.offset, kind: relocation.kind, symbol: relocation.symbol,
    }));
    if (JSON.stringify(relevant) !== JSON.stringify(expected)) fail(`${name} relocation set is invalid`);
    calls += relevant.filter((relocation) => relocation.kind === "R_ARM_CALL").length;
    jumps += relevant.filter((relocation) => relocation.kind === "R_ARM_JUMP24").length;
    absoluteWords += relevant.filter((relocation) => relocation.kind === "R_ARM_ABS32").length;
  }
  if (calls !== 10 || jumps !== 10 || absoluteWords !== 20) {
    fail("base object must contain exactly 10 calls, 10 jumps, and 20 ABS32 slots for runtime 33");
  }
}

console.log("Validated ARM runtime helpers batch 33: 10 functions, 1,240 body bytes, 10 calls, 10 jumps, and 20 symbolic adjacent slots.");
