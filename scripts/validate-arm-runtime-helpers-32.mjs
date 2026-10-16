import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-32.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-32 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002DD8FC", 52, [
    { offset: 12, kind: "R_ARM_CALL", symbol: "runtime_guard_enter_32" },
    { offset: 28, kind: "R_ARM_CALL", symbol: "runtime_guarded_operation_32" },
    { offset: 36, kind: "R_ARM_CALL", symbol: "runtime_guard_leave_32" },
  ]],
  ["func_002DD9C4", 56, [
    { offset: 44, kind: "R_ARM_CALL", symbol: "runtime_aligned_word_forward_32" },
  ]],
  ["func_002DDE18", 28, [
    { offset: 4, kind: "R_ARM_CALL", symbol: "runtime_zero_arg_query_gamma_32" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DE38C", 64, [
    { offset: 20, kind: "R_ARM_CALL", symbol: "runtime_resource_acquire_alpha_32" },
    { offset: 28, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DE490", 64, [
    { offset: 20, kind: "R_ARM_CALL", symbol: "runtime_resource_acquire_beta_32" },
    { offset: 28, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002E0B9C", 68, [
    { offset: 12, kind: "R_ARM_CALL", symbol: "runtime_sequence_begin_32" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
    { offset: 32, kind: "R_ARM_CALL", symbol: "runtime_sequence_apply_32" },
    { offset: 40, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
    { offset: 44, kind: "R_ARM_CALL", symbol: "runtime_sequence_finish_32" },
    { offset: 60, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
];
const expectedContracts = {
  runtime_guard_enter_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "guard-enter-call",
  },
  runtime_guarded_operation_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "guarded-operation-call",
  },
  runtime_guard_leave_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "guard-leave-call",
  },
  runtime_aligned_word_forward_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "aligned-stacked-word-forward-call",
  },
  runtime_zero_arg_query_gamma_32: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity", usage: "zero-argument-status-gamma-call",
  },
  runtime_resource_acquire_alpha_32: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity", usage: "resource-acquire-alpha-call",
  },
  runtime_resource_acquire_beta_32: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity", usage: "resource-acquire-beta-call",
  },
  runtime_sequence_begin_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "sequence-begin-call",
  },
  runtime_sequence_apply_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "sequence-apply-call",
  },
  runtime_sequence_finish_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "sequence-finish-call",
  },
  runtime_failure_raise_entry_31: {
    mode: "arm", minimumAlignment: 4, equality: "shared-runtime-31-failure-identity",
    usage: "failure-linked-or-tail-transfer",
  },
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_32.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 332 ||
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
if (JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedContracts)) {
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
if (/^\s*\.(?:word|long|4byte)\b/m.test(sourceText)) fail("source must not contain literal or adjacent data words");
for (const identity of Object.keys(expectedContracts)) {
  if (!sourceText.includes(`.global ${identity}`) || !sourceText.includes(`.type ${identity}, %function`) ||
      new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`${identity} must remain an undefined global function identity`);
  }
}

const expectedSchedules = new Map([
  ["func_002DD8FC", [
    "push {r3,r4,r5,lr}", "mov r5,sp", "mov r4,#276", "bl runtime_guard_enter_32", "mov r2,r5",
    "mov r1,#17", "mov r0,r4", "bl runtime_guarded_operation_32", "mov r4,r0",
    "bl runtime_guard_leave_32", "asr r0,r4,#31", "add r0,r0,#1", "pop {r3,r4,r5,pc}",
  ]],
  ["func_002DD9C4", [
    "push {r4,lr}", "sub sp,sp,#16", "add lr,sp,#24", "mov r4,r2", "ldm lr,{r2,r12}",
    "add lr,sp,#8", "str r3,[sp]", "mov r3,r4", "stm lr,{r2,r12}", "mov r2,r1", "mov r1,#5",
    "bl runtime_aligned_word_forward_32", "add sp,sp,#16", "pop {r4,pc}",
  ]],
  ["func_002DDE18", [
    "push {r4,lr}", "bl runtime_zero_arg_query_gamma_32", "lsrs r0,r0,#31",
    "beq .Lreturn_success_002DDE18", "pop {r4,lr}", "b runtime_failure_raise_entry_31", "pop {r4,pc}",
  ]],
  ["func_002DE38C", [
    "push {r3,r4,r5,lr}", "mov r4,r0", "mov r5,#0", "mov r0,sp", "str r5,[sp]",
    "bl runtime_resource_acquire_alpha_32", "lsrs r0,r0,#31", "blne runtime_failure_raise_entry_31",
    "ldr r0,[r4]", "cmp r0,#0", "beq .Linstall_002DE38C", "svc #35", "str r5,[r4]",
    "ldr r0,[sp]", "str r0,[r4]", "pop {r3,r4,r5,pc}",
  ]],
  ["func_002DE490", [
    "push {r3,r4,r5,lr}", "mov r4,r0", "mov r5,#0", "mov r0,sp", "str r5,[sp]",
    "bl runtime_resource_acquire_beta_32", "lsrs r0,r0,#31", "blne runtime_failure_raise_entry_31",
    "ldr r0,[r4]", "cmp r0,#0", "beq .Linstall_002DE490", "svc #35", "str r5,[r4]",
    "ldr r0,[sp]", "str r0,[r4]", "pop {r3,r4,r5,pc}",
  ]],
  ["func_002E0B9C", [
    "push {r4,r5,r6,lr}", "mov r4,r0", "mov r5,r1", "bl runtime_sequence_begin_32", "lsrs r0,r0,#31",
    "blne runtime_failure_raise_entry_31", "mov r1,r5", "mov r0,r4", "bl runtime_sequence_apply_32",
    "lsrs r0,r0,#31", "blne runtime_failure_raise_entry_31", "bl runtime_sequence_finish_32",
    "lsrs r0,r0,#31", "beq .Lreturn_success_002E0B9C", "pop {r4,r5,r6,lr}",
    "b runtime_failure_raise_entry_31", "pop {r4,r5,r6,pc}",
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
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`${name} exact instruction schedule is invalid`);
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-32.mjs [base-object readelf]");
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
        section: relocationSection, offset: Number.parseInt(fields[0], 16), kind: fields[2], symbol: fields[4],
      });
    }
  }
  let branchCount = 0;
  let failureCount = 0;
  for (const [name, size, calls] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const bodyRelocations = parsedRelocations.filter((relocation) =>
      relocation.section === `.text.${name}` &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + size);
    const actualCalls = bodyRelocations.map(({ offset, kind, symbol: target }) => ({
      offset: offset - symbol.value, kind, symbol: target,
    }));
    if (JSON.stringify(actualCalls) !== JSON.stringify(calls)) fail(`${name} relocation set is invalid`);
    branchCount += actualCalls.length;
    failureCount += actualCalls.filter((call) => call.symbol === "runtime_failure_raise_entry_31").length;
  }
  if (branchCount !== 16 || failureCount !== 6) {
    fail("base object must contain exactly sixteen audited branches and six shared failure sites");
  }
}

console.log("Validated ARM runtime helpers batch 32: 6 functions, 332 body bytes, sixteen symbolic branches, no literals or adjacent words.");
