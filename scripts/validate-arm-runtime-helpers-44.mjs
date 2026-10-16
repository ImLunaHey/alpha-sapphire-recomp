import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-44.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-44 validation failed: ${message}`);
  process.exit(1);
}

const schedules = new Map([
  ["func_004EAE00", ["ldrb r0,[r0,#338]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
  ["func_004EAE18", ["ldr r0,[r0]", "add r0,r0,#3824", "mov r0,r0", "ldrh r0,[r0,#228]", "bx lr"]],
  ["func_004F2BC8", ["push {r3,lr}", "mov r1,sp", "bl runtime_stack_output_call_44", "pop {r3,pc}"]],
  ["func_004F2C20", ["mov r1,#0", "str r1,[r0]", "strb r1,[r0,#4]", "bx lr"]],
  ["func_004F2C40", ["and r1,r1,#255", "orr r1,r1,r1,lsl #8", "orr r1,r1,r1,lsl #16", "str r1,[r0]", "strb r1,[r0,#4]", "bx lr"]],
  ["func_004F2C58", ["and r1,r1,#255", "orr r1,r1,r1,lsl #8", "orr r1,r1,r1,lsl #16", "str r1,[r0]", "str r1,[r0,#4]", "bx lr"]],
  ["func_004F2C70", ["ldrb r12,[lr,#-1]", "cmp r3,r12", "ldrbcs r3,[lr,r12]", "ldrbcc r3,[lr,r3]", "add r12,lr,r3,lsl #1", "bx r12"]],
  ["func_004F4F34", ["cmp r2,#0", "mov r3,r1", "beq 1f", "mov r1,r0", "mov r0,r3", "b runtime_conditional_transfer_44", "1:", "bx lr"]],
  ["func_00502E20", ["cmp r0,#32", "bcs 1f", "ldr r1,.lfunc_00502e20_slot", "ldr r1,[r1]", "add r0,r1,r0,lsl #2", "ldr r0,[r0,#2088]", "cmp r0,#0", "ldrne r0,[r0]", "bne 2f", "1:", "mov r0,#0", "2:", "bx lr"]],
  ["func_00506E0C", ["vmov d0,r0,r1", "push {r4,lr}", "bl runtime_double_transform_44", "vmov r0,r1,d0", "pop {r4,pc}"]],
  ["func_00509D48", ["vmov d0,r0,r1", "sub sp,sp,#8", "vmov r0,s1", "vstr d0,[sp]", "bic r0,r0,#0x80000000", "str r0,[sp,#4]", "vldr d0,[sp]", "add sp,sp,#8", "vmov r0,r1,d0", "bx lr"]],
  ["func_0050A61C", ["sub r1,r0,#32768", "ldr r0,.lfunc_0050a61c_slot", "sub r1,r1,#1216", "ldr r0,[r0]", "str r1,[r0,#88]", "bx lr"]],
  ["func_0050BCB4", ["mov r1,#1", "b runtime_flagged_tail_44"]],
  ["func_0050DC38", ["cmp r0,#0", "bxeq lr", "push {r4-r6,lr}", "mov r5,#0", "mov r4,r0", "str r5,[r0]", "bl runtime_conditional_release_44", "str r5,[r4,#4]", "str r5,[r4,#8]", "pop {r4-r6,pc}"]],
  ["func_0050DC60", ["ldr r1,[r0,#8]", "subs r1,r1,#1", "str r1,[r0,#8]", "bne 1f", "mov r1,#0", "str r1,[r0,#4]", "b runtime_zero_count_tail_44", "1:", "bx lr"]],
  ["func_0050DD10", ["ldr r1,[r0,#8]", "ldr r0,[r0,#12]", "add r0,r0,r1", "bx lr"]],
  ["func_0050DD20", ["cmp r0,#0", "beq 1f", "mov r1,#0", "str r1,[r0]", "str r1,[r0,#4]", "str r1,[r0,#8]", "str r1,[r0,#12]", "strb r1,[r0,#16]", "1:", "bx lr"]],
  ["func_0050DD44", ["mov r0,#0", "mov r1,r0", "b runtime_zero_pair_tail_44"]],
]);
const expectedFunctions = [...schedules.keys()];
const expectedCalls = new Map([
  ["func_004F2BC8", [{ offset: 8, kind: "R_ARM_CALL", symbol: "runtime_stack_output_call_44" }]],
  ["func_004F4F34", [{ offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_conditional_transfer_44" }]],
  ["func_00506E0C", [{ offset: 8, kind: "R_ARM_CALL", symbol: "runtime_double_transform_44" }]],
  ["func_0050BCB4", [{ offset: 4, kind: "R_ARM_JUMP24", symbol: "runtime_flagged_tail_44" }]],
  ["func_0050DC38", [{ offset: 24, kind: "R_ARM_CALL", symbol: "runtime_conditional_release_44" }]],
  ["func_0050DC60", [{ offset: 24, kind: "R_ARM_JUMP24", symbol: "runtime_zero_count_tail_44" }]],
  ["func_0050DD44", [{ offset: 8, kind: "R_ARM_JUMP24", symbol: "runtime_zero_pair_tail_44" }]],
]);
const expectedWords = new Map([
  ["func_00502E20", [{ offset: 44, kind: "R_ARM_ABS32", symbol: "opaque_runtime_root_slot_44_a" }]],
  ["func_0050A61C", [{ offset: 24, kind: "R_ARM_ABS32", symbol: "opaque_runtime_root_slot_44_b" }]],
]);
const expectedClasses = {
  byte_replication_stores_44: { members: ["func_004F2C40", "func_004F2C58"], parameters: ["finalStoreWidth"] },
  null_safe_record_initializers_44: { members: ["func_0050DC38", "func_0050DD20"], parameters: ["callSchedule", "clearedLayout"] },
};
const expectedIdentities = {
  runtime_stack_output_call_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_004F2BD8", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "stack-output-call" },
  runtime_conditional_transfer_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_00300B28", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "conditional-tail-transfer" },
  runtime_double_transform_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_004F3510", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "double-register-transform-call" },
  runtime_flagged_tail_44: { mode: "arm", minimumAlignment: 4, entryKind: "secondary", targetSymbol: "func_005095B0", targetOffset: 8, targetVisibility: "no-standalone-symbol", equality: "batch-local-distinct", usage: "fixed-flag-tail-transfer" },
  runtime_conditional_release_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_001241A0", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "conditional-release-call" },
  runtime_zero_count_tail_44: { mode: "arm", minimumAlignment: 4, entryKind: "secondary", targetSymbol: "func_00132A14", targetOffset: 100, targetVisibility: "no-standalone-symbol", equality: "batch-local-distinct", usage: "zero-count-tail-transfer" },
  runtime_zero_pair_tail_44: { mode: "arm", minimumAlignment: 4, entryKind: "secondary", targetSymbol: "func_00123D60", targetOffset: 12, targetVisibility: "no-standalone-symbol", equality: "batch-local-distinct", usage: "zero-pair-tail-transfer" },
};
const expectedBranchContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries: ["runtime_stack_output_call_44", "runtime_conditional_transfer_44", "runtime_double_transform_44", "runtime_conditional_release_44"],
  secondaryEntries: ["runtime_flagged_tail_44", "runtime_zero_count_tail_44", "runtime_zero_pair_tail_44"],
  singletonClasses: Object.keys(expectedIdentities),
};
const expectedSlots = {
  opaque_runtime_root_slot_44_a: { segment: "data", minimumAlignment: 4, equality: "distinct-from-slot-b", usage: "indexed-runtime-root" },
  opaque_runtime_root_slot_44_b: { segment: "data", minimumAlignment: 4, equality: "distinct-from-slot-a", usage: "runtime-state-root" },
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_44.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 440 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
let totalSize = 0;
for (let index = 0; index < expectedFunctions.length; index++) {
  const name = expectedFunctions[index];
  const entry = manifest.functions[index];
  const instructionCount = schedules.get(name).filter((line) => !line.endsWith(":")).length;
  if (entry?.name !== name || entry.size !== instructionCount * 4 ||
      JSON.stringify(entry.calls) !== JSON.stringify(expectedCalls.get(name) ?? []) ||
      JSON.stringify(entry.adjacentWords) !== JSON.stringify(expectedWords.get(name) ?? [])) {
    fail(`manifest entry for ${name} is invalid`);
  }
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize ||
    JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedClasses) ||
    JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(expectedBranchContract) ||
    JSON.stringify(manifest.symbolicSlots) !== JSON.stringify(expectedSlots)) {
  fail("manifest totals, identity classes, or symbolic contracts are invalid");
}

const selected = new Set(expectedFunctions);
for (const name of readdirSync(join(root, "config"))) {
  if (name === manifestName || !/^arm-.*\.json$/.test(name)) continue;
  const other = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of other.functions ?? []) if (selected.has(entry.name)) fail(`${entry.name} overlaps selection in config/${name}`);
}
const configured = sources.sources.filter(({ path }) => path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== "arm") fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);

const source = readFileSync(join(root, manifest.source), "utf8");
if (!source.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n")) fail("source preamble is invalid");
function normalize(line) {
  return line.replace(/\/\*.*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*,\s*/g, ",")
    .replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\{\s+/g, "{")
    .replace(/\s+\}/g, "}").trim().toLowerCase();
}
for (const name of expectedFunctions) {
  const begin = `BEGIN_FUNCTION ${name}`;
  const end = `END_FUNCTION ${name}`;
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (start < 0 || finish < 0 || source.indexOf(begin, start + 1) >= 0 || source.indexOf(end, finish + 1) >= 0) fail(`source boundaries for ${name} are invalid`);
  const actual = source.slice(start + begin.length, finish).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(schedules.get(name))) fail(`instruction schedule for ${name} differs from the approved contract`);
  const tail = source.slice(finish + end.length).split(/\nBEGIN_FUNCTION /, 1)[0];
  const words = [...tail.matchAll(/^\s*\.word\s+(\S+)\s*$/gm)].map((match) => match[1]);
  if (JSON.stringify(words) !== JSON.stringify((expectedWords.get(name) ?? []).map(({ symbol }) => symbol))) fail(`adjacent word schedule for ${name} differs from the approved contract`);
}
for (const identity of Object.keys(expectedIdentities)) {
  if ((source.match(new RegExp(`^\\.global ${identity}$`, "gm")) ?? []).length !== 1 ||
      (source.match(new RegExp(`^\\.type ${identity}, %function$`, "gm")) ?? []).length !== 1) fail(`function identity ${identity} declaration is invalid`);
}
for (const identity of Object.keys(expectedSlots)) {
  if ((source.match(new RegExp(`^\\.global ${identity}$`, "gm")) ?? []).length !== 1 ||
      (source.match(new RegExp(`^\\s*\\.word ${identity}$`, "gm")) ?? []).length !== 1) fail(`opaque slot identity ${identity} declaration is invalid`);
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-44.mjs [object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header, sections, symbols, relocations;
  try {
    const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], options);
    sections = execFileSync(readelf, ["-SW", objectPath], options);
    symbols = execFileSync(readelf, ["-sW", objectPath], options);
    relocations = execFileSync(readelf, ["-rW", objectPath], options);
  } catch (error) { fail(`could not inspect object: ${error.message}`); }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("object is not ARM");
  const parsedSections = new Map();
  for (const line of sections.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s+\S+\s+(\S+)\s+\S+\s+\S+\s+(\d+)\s*$/);
    if (match) parsedSections.set(match[2], { index: match[1], size: Number.parseInt(match[3], 16), flags: match[4], alignment: Number.parseInt(match[5], 10) });
  }
  const parsedSymbols = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 8 && fields[0].endsWith(":")) parsedSymbols.push({ value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10), type: fields[3], bind: fields[4], section: fields[6], name: fields.slice(7).join(" ") });
  }
  for (const entry of manifest.functions) {
    const section = parsedSections.get(`.text.${entry.name}`);
    const matches = parsedSymbols.filter(({ name }) => name === entry.name);
    const extent = entry.size + (entry.adjacentWords.length ? 4 : 0);
    if (!section || section.size !== extent || !section.flags.includes("A") || !section.flags.includes("X") || section.alignment < 4 ||
        matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== entry.size || matches[0].type !== "FUNC" ||
        matches[0].bind !== "GLOBAL" || matches[0].section !== section.index) fail(`${entry.name} does not occupy its exact aligned executable function section`);
  }
  const actualRelocations = new Map(expectedFunctions.map((name) => [name, []]));
  let relocationSection;
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '\.(?:rel|rela)\.text\.(func_[0-9A-F]{8})'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (relocationSection && fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) actualRelocations.get(relocationSection)?.push({ offset: Number.parseInt(fields[0], 16), kind: fields[2], symbol: fields[4] });
  }
  for (const entry of manifest.functions) {
    const expected = [...entry.calls, ...entry.adjacentWords].sort((a, b) => a.offset - b.offset);
    if (JSON.stringify(actualRelocations.get(entry.name)) !== JSON.stringify(expected)) fail(`relocations for ${entry.name} differ from the symbolic branch and opaque-slot contract`);
  }
  for (const identity of Object.keys(expectedIdentities)) {
    const matches = parsedSymbols.filter(({ name }) => name === identity);
    if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") fail(`${identity} must be one undefined global function identity`);
  }
  for (const identity of Object.keys(expectedSlots)) {
    const matches = parsedSymbols.filter(({ name }) => name === identity);
    if (matches.length !== 1 || matches[0].type !== "NOTYPE" || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") fail(`${identity} must be one undefined global opaque identity`);
  }
}

console.log("Validated ARM runtime helpers batch 44: 18 functions, 440 body bytes, seven symbolic branches, and two opaque adjacent slots.");
