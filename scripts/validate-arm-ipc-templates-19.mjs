import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-19.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_19.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json",
  "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json",
  "arm-ipc-templates-16.json",
  "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");
const priorManifests = priorManifestPaths.map((path) => JSON.parse(readFileSync(path, "utf8")));

function fail(message) {
  throw new Error(`ARM IPC template 19 validation failed: ${message}`);
}

const templates = new Map([
  ["global_static_descriptor", { macro: "IPC_GLOBAL_STATIC_DESCRIPTOR", size: 68, count: 2, literals: ["command", "handle"] }],
  ["global_byte_word_output", { macro: "IPC_GLOBAL_BYTE_WORD_OUTPUT", size: 68, count: 2, literals: ["command", "handle"] }],
  ["inline_mixed_output", { macro: "IPC_INLINE_MIXED_OUTPUT", size: 64, count: 2, literals: [], inlineCommand: "ipc_inline_command_id_48_no_params" }],
  ["handle_fixed_32", { macro: "IPC_HANDLE_FIXED_32", size: 64, count: 2, literals: ["command"] }],
  ["global_mapped_buffer", { macro: "IPC_GLOBAL_MAPPED_BUFFER", size: 64, count: 2, literals: ["command", "handle"] }],
  ["handle_byte_output", { macro: "IPC_HANDLE_BYTE_OUTPUT", size: 64, count: 2, literals: ["command"] }],
  ["handle_halfword_zero_word", { macro: "IPC_HANDLE_HALFWORD_ZERO_WORD", size: 64, count: 2, literals: ["command"] }],
  ["inline_no_input", { macro: "IPC_INLINE_NO_INPUT", size: 40, count: 3, literals: [], inlineCommand: "ipc_inline_command_id_3_no_params" }],
  ["global_word_byte_output", { macro: "IPC_GLOBAL_WORD_BYTE_OUTPUT", size: 60, count: 2, literals: ["command", "handle"] }],
  ["global_five_word", { macro: "IPC_GLOBAL_FIVE_WORD", size: 60, count: 2, literals: ["command", "handle"] }],
  ["global_word_32", { macro: "IPC_GLOBAL_WORD_32", size: 56, count: 2, literals: ["command", "handle"] }],
]);

if (Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
    manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_19.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 23) {
  fail("unexpected manifest format or cardinality");
}

const commandOverrides = new Map([
  ["func_002DEC1C", "ipc_command_func_002C6104"],
  ["func_00174704", "ipc_command_func_00173EE4"],
  ["func_002001B0", "ipc_command_func_001FFAE8"],
  ["func_002CA67C", "ipc_command_func_002C8E10"],
  ["func_002CAA48", "ipc_command_func_002C91DC"],
  ["func_00133BCC", "ipc_command_func_0010F864"],
  ["func_001F162C", "ipc_command_func_0016516C"],
]);
const expectedHandles = new Map([
  ["func_0016516C", "ipc_handle_slot_alpha"],
  ["func_001FB6F8", "ipc_handle_slot_epsilon"],
  ["func_002DEC1C", "ipc_handle_slot_beta"],
  ["func_002DED28", "ipc_handle_slot_beta"],
  ["func_001FFAE8", "ipc_handle_slot_eta"],
  ["func_002001B0", "ipc_handle_slot_theta"],
  ["func_00126808", "ipc_handle_slot_alpha"],
  ["func_00133BCC", "ipc_handle_slot_alpha"],
  ["func_00132E48", "ipc_handle_slot_kappa"],
  ["func_00145DF8", "ipc_handle_slot_kappa"],
  ["func_0011BAE8", "ipc_handle_slot_lambda"],
  ["func_001F162C", "ipc_handle_slot_iota"],
]);
const functions = new Map();
const identities = new Set();
const inlineIdentities = new Set();
const templateCounts = new Map();
let functionBytes = 0;
let literalSlots = 0;
for (const entry of manifest.functions) {
  const template = templates.get(entry?.template);
  const fields = template?.literals.length === 0 ? ["inlineCommand"] : template?.literals ?? [];
  const expectedKeys = ["name", "mode", "size", "template", ...fields].sort().join(",");
  const expectedCommand = commandOverrides.get(entry?.name) ?? `ipc_command_${entry?.name}`;
  if (entry === null || typeof entry !== "object" || Object.keys(entry).sort().join(",") !== expectedKeys ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || entry.mode !== "arm" || template === undefined ||
      entry.size !== template.size || functions.has(entry.name) ||
      (template.literals.includes("command") && entry.command !== expectedCommand) ||
      (template.literals.includes("handle") && entry.handle !== expectedHandles.get(entry.name)) ||
      (template.literals.length === 0 && entry.inlineCommand !== template.inlineCommand)) {
    fail("invalid or duplicate manifest function");
  }
  functions.set(entry.name, entry);
  templateCounts.set(entry.template, (templateCounts.get(entry.template) ?? 0) + 1);
  functionBytes += entry.size;
  literalSlots += template.literals.length;
  for (const key of template.literals) identities.add(entry[key]);
  if (template.literals.length === 0) inlineIdentities.add(entry.inlineCommand);
}
for (const [name, template] of templates) {
  if (templateCounts.get(name) !== template.count) fail(`invalid ${name} cardinality`);
}
if (templateCounts.size !== 11 || functionBytes !== 1384 || literalSlots !== 30 ||
    identities.size !== 21 || inlineIdentities.size !== 2) {
  fail("manifest must describe 11 templates, 1,384 bytes, 30 literal slots, 21 literal identities, and two inline identities");
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
if (allIpcSlots.length !== 248 || new Set(allIpcSlots).size !== 122) {
  fail("the seven IPC batches must form exactly 248 literal slots and 122 identity classes");
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
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are not permitted");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\(?:command|handle)$/.test(line)) fail("only named symbolic IPC literal words are permitted");
}

if (createHash("sha256").update(source).digest("hex") !== "f0c4383c83357e888ee5efcbd95349832f7cc308748781d784b598a99e275931") fail("deterministic assembly templates changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "195b560b18dca33a92a69f405d07d76228ffdb0a65d9795f1dd9697a56cedcf4") fail("deterministic neutral manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf paths must be provided together");
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage and 248-slot/122-class IPC identity structure for 23 ARM functions (${functionBytes} bytes).`);
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

console.log(`Validated 23 ARM IPC sections, symbols, ordered relocations, and 21 batch literal identities (${functionBytes} function bytes).`);
