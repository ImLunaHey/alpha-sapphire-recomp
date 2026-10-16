import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-20.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_20.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json",
  "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json",
  "arm-ipc-templates-16.json",
  "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json",
  "arm-ipc-templates-19.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");
const priorManifests = priorManifestPaths.map((path) => JSON.parse(readFileSync(path, "utf8")));

function fail(message) {
  throw new Error(`ARM IPC template 20 validation failed: ${message}`);
}

const templates = new Map([
  ["handle_four_word_output", { macro: "IPC_HANDLE_FOUR_WORD_OUTPUT", size: 72, count: 2, literals: ["command"] }],
  ["handle_mixed_stack", { macro: "IPC_HANDLE_MIXED_STACK", size: 68, count: 2, literals: ["command"] }],
  ["global_byte", { macro: "IPC_GLOBAL_BYTE", size: 56, count: 2, literals: ["command", "handle"] }],
  ["handle_two_reg_stack", { macro: "IPC_HANDLE_TWO_REG_STACK", size: 52, count: 2, literals: ["command"] }],
  ["handle_word_32", { macro: "IPC_HANDLE_WORD_32", size: 52, count: 2, literals: ["command"] }],
  ["handle_byte_output", { macro: "IPC_HANDLE_BYTE_OUTPUT", size: 52, count: 2, literals: ["command"] }],
  ["inline_31_output", { macro: "IPC_INLINE_31_OUTPUT", size: 52, count: 2, literals: [], inlineCommand: "ipc_inline_command_id_31_no_params" }],
  ["inline_global_43", { macro: "IPC_INLINE_GLOBAL_43", size: 44, count: 2, literals: ["handle"], inlineCommand: "ipc_inline_command_id_43_no_params" }],
  ["handle_two_word_stm", { macro: "IPC_HANDLE_TWO_WORD_STM", size: 44, count: 2, literals: ["command"] }],
  ["inline_global_2", { macro: "IPC_INLINE_GLOBAL_2", size: 44, count: 2, literals: ["handle"], inlineCommand: "ipc_inline_command_id_2_no_params" }],
  ["handle_literal_no_input", { macro: "IPC_HANDLE_LITERAL_NO_INPUT", size: 40, count: 2, literals: ["command"] }],
  ["inline_14_no_input", { macro: "IPC_INLINE_14_NO_INPUT", size: 40, count: 2, literals: [], inlineCommand: "ipc_inline_command_id_14_no_params" }],
]);

if (Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
    manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_20.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 24) {
  fail("unexpected manifest format or cardinality");
}

const expectedFunctions = new Map([
  ["func_002E41E0", ["handle_four_word_output", "ipc_command_func_002E41E0"]],
  ["func_002E42B0", ["handle_four_word_output", "ipc_command_func_002E42B0"]],
  ["func_0011A020", ["handle_mixed_stack", "ipc_command_func_0011A020"]],
  ["func_0011A1B8", ["handle_mixed_stack", "ipc_command_func_0011A020"]],
  ["func_00202D34", ["global_byte", "ipc_command_func_00202D34", "ipc_handle_slot_zeta"]],
  ["func_00202F00", ["global_byte", "ipc_command_func_00202F00", "ipc_handle_slot_zeta"]],
  ["func_0011A068", ["handle_two_reg_stack", "ipc_command_func_0011A068"]],
  ["func_001F73BC", ["handle_two_reg_stack", "ipc_command_func_001F73BC"]],
  ["func_0012408C", ["handle_word_32", "ipc_command_func_0012408C"]],
  ["func_002CCF14", ["handle_word_32", "ipc_command_func_002CCF14"]],
  ["func_001F70F4", ["handle_byte_output", "ipc_command_func_001F70F4"]],
  ["func_001F712C", ["handle_byte_output", "ipc_command_func_001F712C"]],
  ["func_002C92B4", ["inline_31_output"]],
  ["func_002CAB20", ["inline_31_output"]],
  ["func_00133E64", ["inline_global_43", undefined, "ipc_handle_slot_alpha"]],
  ["func_002C6450", ["inline_global_43", undefined, "ipc_handle_slot_gamma"]],
  ["func_001F6ED4", ["handle_two_word_stm", "ipc_command_func_001F6ED4"]],
  ["func_001F77D0", ["handle_two_word_stm", "ipc_command_func_001F77D0"]],
  ["func_001FB448", ["inline_global_2", undefined, "ipc_handle_slot_epsilon"]],
  ["func_00202CC8", ["inline_global_2", undefined, "ipc_handle_slot_zeta"]],
  ["func_001F76C0", ["handle_literal_no_input", "ipc_command_func_001F76C0"]],
  ["func_001F78BC", ["handle_literal_no_input", "ipc_command_func_001F78BC"]],
  ["func_002C9004", ["inline_14_no_input"]],
  ["func_002CA870", ["inline_14_no_input"]],
]);
const functions = new Map();
const identities = new Set();
const inlineIdentities = new Set();
const templateCounts = new Map();
let functionBytes = 0;
let literalSlots = 0;
for (const entry of manifest.functions) {
  const template = templates.get(entry?.template);
  const expected = expectedFunctions.get(entry?.name);
  const fields = [...template?.literals ?? [], ...(template?.inlineCommand === undefined ? [] : ["inlineCommand"])];
  const expectedKeys = ["name", "mode", "size", "template", ...fields].sort().join(",");
  if (entry === null || typeof entry !== "object" || Object.keys(entry).sort().join(",") !== expectedKeys ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || entry.mode !== "arm" || template === undefined ||
      entry.size !== template.size || functions.has(entry.name) || expected === undefined ||
      entry.template !== expected[0] ||
      (template.literals.includes("command") && entry.command !== expected[1]) ||
      (template.literals.includes("handle") && entry.handle !== expected[2]) ||
      (template.inlineCommand !== undefined && entry.inlineCommand !== template.inlineCommand)) {
    fail("invalid or duplicate manifest function");
  }
  functions.set(entry.name, entry);
  templateCounts.set(entry.template, (templateCounts.get(entry.template) ?? 0) + 1);
  functionBytes += entry.size;
  literalSlots += template.literals.length;
  for (const key of template.literals) identities.add(entry[key]);
  if (template.inlineCommand !== undefined) inlineIdentities.add(entry.inlineCommand);
}
for (const [name, template] of templates) {
  if (templateCounts.get(name) !== template.count) fail(`invalid ${name} cardinality`);
}
if (functions.size !== expectedFunctions.size || templateCounts.size !== 12 || functionBytes !== 1232 ||
    literalSlots !== 22 || identities.size !== 19 || inlineIdentities.size !== 4) {
  fail("manifest must describe 12 templates, 1,232 bytes, 22 literal slots, 19 literal identities, and four inline identities");
}

const allIpcSlots = [];
for (const prior of priorManifests) {
  if (prior?.schemaVersion !== 1 || !Array.isArray(prior.functions)) fail("unexpected prior IPC manifest format");
  for (const entry of prior.functions) {
    if (typeof entry.command === "string") allIpcSlots.push(entry.command);
    if (typeof entry.auxiliary === "string") allIpcSlots.push(entry.auxiliary);
    if (typeof entry.handle === "string") allIpcSlots.push(entry.handle);
  }
}
for (const entry of manifest.functions) {
  for (const key of templates.get(entry.template).literals) allIpcSlots.push(entry[key]);
}
if (allIpcSlots.length !== 270 || new Set(allIpcSlots).size !== 137) {
  fail("the eight IPC batches must form exactly 270 literal slots and 137 identity classes");
}

const literalForms = new Set([...templates.values()].map(({ literals }) => literals.join("+")));
if (["command", "command+handle", "handle", ""].some((form) => !literalForms.has(form)) || literalForms.size !== 4) {
  fail("templates must use exactly command-only, command-plus-handle, handle-only, and pool-free forms");
}
const macroNames = [...templates.values()].map(({ macro }) => macro).join("|");
const invocationPattern = new RegExp(`^(${macroNames}) (func_[0-9A-F]{8})(?:, (.+))?$`);
const invocations = new Map();
for (const line of source.split("\n")) {
  const match = invocationPattern.exec(line);
  if (match === null) continue;
  if (invocations.has(match[2])) fail(`duplicate source invocation for ${match[2]}`);
  invocations.set(match[2], { macro: match[1], identities: match[3]?.split(", ") ?? [] });
}
if (invocations.size !== functions.size) fail("source invocation coverage does not match manifest");
for (const [name, entry] of functions) {
  const template = templates.get(entry.template);
  const expectedIdentities = template.literals.map((key) => entry[key]);
  const invocation = invocations.get(name);
  if (invocation?.macro !== template.macro || invocation.identities.length !== expectedIdentities.length ||
      invocation.identities.some((identity, index) => identity !== expectedIdentities[index])) {
    fail(`source invocation differs from manifest for ${name}`);
  }
}
if ((source.match(/^\.macro IPC_/gm) ?? []).length !== 12) fail("source must define exactly 12 textual IPC templates");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are not permitted");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\(?:command|handle)$/.test(line)) fail("only named symbolic IPC literal words are permitted");
}
if ((source.match(/^\s*ldrge r0, \[r4, #4\]$/gm) ?? []).length !== 9 ||
    (source.match(/^\s*ands r1, r0, #0x80000000$/gm) ?? []).length !== 3 ||
    /^\s*ldreq\b/m.test(source) || /^\s*ands r6\b/m.test(source) ||
    (source.match(/^\s*ldrb r0, \[sp\]$/gm) ?? []).length !== 1 ||
    (source.match(/^\s*ldr r12, \.Lcommand\\@$/gm) ?? []).length !== 3 ||
    (source.match(/^\s*str r12, \[r4, #128\]!$/gm) ?? []).length !== 3) {
  fail("exact result conditions and r1/r12/r0 schedules are not preserved");
}

if (createHash("sha256").update(source).digest("hex") !== "d2534b1ca9112f2faf1b3c43f028f1745084849063dffaa1a6bfc9335180b859") fail("deterministic assembly templates changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "61e54635c077e3f9017839779e95fab160210d18d36cdd11a5974e26b2857a41") fail("deterministic neutral manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf paths must be provided together");
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage and 270-slot/137-class IPC identity structure for 24 ARM functions (${functionBytes} bytes).`);
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  return result.stdout;
}
const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const sections = new Map();
const sectionPattern = /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm;
for (const match of sectionOutput.matchAll(sectionPattern)) sections.set(match[2], { index: Number(match[1]), type: match[3], size: Number.parseInt(match[4], 16), flags: match[5], alignment: Number(match[6]) });
const symbols = new Map();
const symbolPattern = /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const entries = symbols.get(match[7]) ?? [];
  entries.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], binding: match[4], visibility: match[5], sectionIndex: match[6] });
  symbols.set(match[7], entries);
}
const relocations = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading !== null) { relocatedSection = heading[1]; continue; }
  const relocation = /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
  if (relocation !== null && relocatedSection !== undefined) {
    const entries = relocations.get(relocatedSection) ?? [];
    entries.push({ offset: Number.parseInt(relocation[1], 16), type: relocation[2], symbol: relocation[3] });
    relocations.set(relocatedSection, entries);
  }
}

const coveredSections = new Set();
for (const [name, entry] of functions) {
  const sectionName = `.text.${name}`;
  coveredSections.add(sectionName);
  const section = sections.get(sectionName);
  const template = templates.get(entry.template);
  if (section === undefined || section.type !== "PROGBITS" || section.size !== entry.size + template.literals.length * 4 ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) fail(`invalid executable section for ${name}`);
  const functionSymbols = symbols.get(name) ?? [];
  if (functionSymbols.length !== 1 || functionSymbols[0].value !== 0 || functionSymbols[0].size !== entry.size ||
      functionSymbols[0].type !== "FUNC" || functionSymbols[0].binding !== "GLOBAL" || functionSymbols[0].visibility !== "DEFAULT" ||
      Number(functionSymbols[0].sectionIndex) !== section.index) fail(`invalid function symbol for ${name}`);
  const armMappings = symbols.get("$a") ?? [];
  if (!armMappings.some((symbol) => symbol.value === 0 && Number(symbol.sectionIndex) === section.index)) fail(`missing ARM mapping symbol for ${name}`);
  const expectedRelocations = template.literals.map((key, index) => ({ offset: entry.size + index * 4, type: "R_ARM_ABS32", symbol: entry[key] }));
  const actualRelocations = relocations.get(sectionName) ?? [];
  if (actualRelocations.length !== expectedRelocations.length || expectedRelocations.some((expected, index) =>
    actualRelocations[index]?.offset !== expected.offset || actualRelocations[index]?.type !== expected.type || actualRelocations[index]?.symbol !== expected.symbol)) {
    fail(`invalid neutral relocations for ${name}`);
  }
}
for (const [sectionName, entries] of relocations) {
  if (coveredSections.has(sectionName) && entries.length !== templates.get(functions.get(sectionName.slice(6)).template).literals.length) fail(`unexpected covered relocation in ${sectionName}`);
}
for (const identity of identities) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (identitySymbols.length !== 1 || identitySymbols[0].value !== 0 || identitySymbols[0].size !== 0 || identitySymbols[0].type !== "NOTYPE" ||
      identitySymbols[0].binding !== "GLOBAL" || identitySymbols[0].visibility !== "DEFAULT" || identitySymbols[0].sectionIndex !== "UND") {
    fail(`invalid undefined identity symbol ${identity}`);
  }
}

console.log(`Validated 24 ARM IPC sections, symbols, ordered relocations, and 19 batch literal identities (${functionBytes} function bytes).`);
