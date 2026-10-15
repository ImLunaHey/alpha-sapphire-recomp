import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-18.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_18.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json",
  "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json",
  "arm-ipc-templates-16.json",
  "arm-ipc-templates-17.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");
const priorManifests = priorManifestPaths.map((path) => JSON.parse(readFileSync(path, "utf8")));

function fail(message) {
  throw new Error(`ARM IPC template 18 validation failed: ${message}`);
}

const templates = new Map([
  ["handle_mapped_byte_io", { macro: "IPC_HANDLE_MAPPED_BYTE_IO", size: 80, count: 2, literals: ["command"] }],
  ["handle_two_mapped", { macro: "IPC_HANDLE_TWO_MAPPED", size: 80, count: 2, literals: ["command"] }],
  ["handle_byte_descriptor", { macro: "IPC_HANDLE_BYTE_DESCRIPTOR", size: 80, count: 2, literals: ["command"] }],
  ["global_constant_32", { macro: "IPC_GLOBAL_CONSTANT_32", size: 52, count: 3, literals: ["command", "handle"] }],
  ["handle_no_input_output", { macro: "IPC_HANDLE_NO_INPUT_OUTPUT", size: 52, count: 3, literals: ["command"] }],
  ["global_halfword", { macro: "IPC_GLOBAL_HALFWORD", size: 52, count: 3, literals: ["command", "handle"] }],
  ["global_static_descriptor_word", { macro: "IPC_GLOBAL_STATIC_DESCRIPTOR_WORD", size: 76, count: 2, literals: ["command", "handle"] }],
  ["global_six_static_descriptor", { macro: "IPC_GLOBAL_SIX_STATIC_DESCRIPTOR", size: 72, count: 2, literals: ["command", "handle"] }],
  ["global_mapped_output", { macro: "IPC_GLOBAL_MAPPED_OUTPUT", size: 72, count: 2, literals: ["command", "handle"] }],
  ["handle_halfword_mapped", { macro: "IPC_HANDLE_HALFWORD_MAPPED", size: 72, count: 2, literals: ["command"] }],
  ["handle_mapped_byte_output", { macro: "IPC_HANDLE_MAPPED_BYTE_OUTPUT", size: 72, count: 2, literals: ["command"] }],
]);

if (Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
    manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_18.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 25) {
  fail("unexpected manifest format or cardinality");
}

const commandOverrides = new Map([
  ["func_002CA6C0", "ipc_command_func_002C8E54"],
  ["func_002CA81C", "ipc_command_func_002C8FB0"],
  ["func_002CAACC", "ipc_command_func_002C9260"],
  ["func_002C6660", "ipc_command_func_00109CB8"],
  ["func_0020004C", "ipc_command_func_001FF984"],
  ["func_002CA7D0", "ipc_command_func_002C8F64"],
  ["func_002CAB54", "ipc_command_func_002C92E8"],
]);
const expectedHandles = new Map([
  ["func_0010986C", "ipc_handle_slot_delta"],
  ["func_0015F350", "ipc_handle_slot_iota"],
  ["func_001F15A0", "ipc_handle_slot_iota"],
  ["func_002C62B0", "ipc_handle_slot_gamma"],
  ["func_002C64F8", "ipc_handle_slot_gamma"],
  ["func_002C6660", "ipc_handle_slot_gamma"],
  ["func_00109C64", "ipc_handle_slot_alpha"],
  ["func_00133C68", "ipc_handle_slot_alpha"],
  ["func_00133E14", "ipc_handle_slot_alpha"],
  ["func_0016511C", "ipc_handle_slot_alpha"],
  ["func_001FF984", "ipc_handle_slot_eta"],
  ["func_0020004C", "ipc_handle_slot_theta"],
]);
const functions = new Map();
const identities = new Set();
const templateCounts = new Map();
let functionBytes = 0;
let literalSlots = 0;
for (const entry of manifest.functions) {
  const template = templates.get(entry?.template);
  const expectedKeys = ["name", "mode", "size", "template", ...template?.literals ?? []].sort().join(",");
  const expectedCommand = commandOverrides.get(entry?.name) ?? `ipc_command_${entry?.name}`;
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== expectedKeys ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || entry.mode !== "arm" ||
      template === undefined || entry.size !== template.size || functions.has(entry.name) ||
      entry.command !== expectedCommand ||
      (template.literals.includes("handle") && entry.handle !== expectedHandles.get(entry.name))) {
    fail("invalid or duplicate manifest function");
  }
  functions.set(entry.name, entry);
  templateCounts.set(entry.template, (templateCounts.get(entry.template) ?? 0) + 1);
  functionBytes += entry.size;
  literalSlots += template.literals.length;
  for (const key of template.literals) identities.add(entry[key]);
}
for (const [name, template] of templates) {
  if (templateCounts.get(name) !== template.count) fail(`invalid ${name} cardinality`);
}
if (templateCounts.size !== templates.size || functionBytes !== 1676 ||
    literalSlots !== 37 || identities.size !== 25) {
  fail("the manifest must describe 11 templates, 1,676 function bytes, 37 literal slots, and 25 identities");
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
if (allIpcSlots.length !== 218 || new Set(allIpcSlots).size !== 109) {
  fail("the six IPC batches must form exactly 218 literal slots and 109 identity classes");
}

const invocationPattern = /^(IPC_HANDLE_MAPPED_BYTE_IO|IPC_HANDLE_TWO_MAPPED|IPC_HANDLE_BYTE_DESCRIPTOR|IPC_GLOBAL_CONSTANT_32|IPC_HANDLE_NO_INPUT_OUTPUT|IPC_GLOBAL_HALFWORD|IPC_GLOBAL_STATIC_DESCRIPTOR_WORD|IPC_GLOBAL_SIX_STATIC_DESCRIPTOR|IPC_GLOBAL_MAPPED_OUTPUT|IPC_HANDLE_HALFWORD_MAPPED|IPC_HANDLE_MAPPED_BYTE_OUTPUT) (func_[0-9A-F]{8}), (.+)$/;
const invocations = new Map();
for (const line of source.split("\n")) {
  const match = invocationPattern.exec(line);
  if (match === null) continue;
  if (invocations.has(match[2])) fail(`duplicate source invocation for ${match[2]}`);
  invocations.set(match[2], { macro: match[1], identities: match[3].split(", ") });
}
if (invocations.size !== functions.size) fail("source invocation coverage does not match the manifest");
for (const [name, entry] of functions) {
  const template = templates.get(entry.template);
  const expectedIdentities = template.literals.map((key) => entry[key]);
  const invocation = invocations.get(name);
  if (invocation?.macro !== template.macro || invocation.identities.length !== expectedIdentities.length ||
      invocation.identities.some((identity, index) => identity !== expectedIdentities[index])) {
    fail(`source invocation differs from the manifest for ${name}`);
  }
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are not permitted");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\(?:command|handle)$/.test(line)) {
    fail("only named symbolic IPC literal words are permitted");
  }
}

if (createHash("sha256").update(source).digest("hex") !== "4772c9e4aa3f5afa61b35889cdd2125bf1b8a8ef2479f8c1213b91f04fed9bc1") {
  fail("deterministic assembly templates changed without validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "9ed799fec31bc4046b5741f5fdad589446039b8745206e16cbde803ea29a9425") {
  fail("deterministic neutral manifest changed without validator review");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf paths must be provided together");
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage and 218-slot/109-class IPC identity structure for 25 ARM functions (${functionBytes} bytes).`);
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
for (const match of sectionOutput.matchAll(sectionPattern)) {
  sections.set(match[2], { index: Number.parseInt(match[1], 10), type: match[3],
    size: Number.parseInt(match[4], 16), flags: match[5], alignment: Number.parseInt(match[6], 10) });
}
const symbols = new Map();
const symbolPattern = /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const entries = symbols.get(match[7]) ?? [];
  entries.push({ value: Number.parseInt(match[1], 16), size: Number.parseInt(match[2], 10),
    type: match[3], binding: match[4], visibility: match[5], sectionIndex: match[6] });
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

for (const [name, entry] of functions) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  const template = templates.get(entry.template);
  if (section === undefined || section.type !== "PROGBITS" ||
      section.size !== entry.size + template.literals.length * 4 ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    fail(`invalid executable section for ${name}`);
  }
  const functionSymbols = symbols.get(name) ?? [];
  if (functionSymbols.length !== 1 || functionSymbols[0].value !== 0 ||
      functionSymbols[0].size !== entry.size || functionSymbols[0].type !== "FUNC" ||
      functionSymbols[0].binding !== "GLOBAL" || functionSymbols[0].visibility !== "DEFAULT" ||
      Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index) {
    fail(`invalid function symbol for ${name}`);
  }
  const armMappings = symbols.get("$a") ?? [];
  if (!armMappings.some((symbol) => symbol.value === 0 && Number.parseInt(symbol.sectionIndex, 10) === section.index)) {
    fail(`missing ARM mapping symbol for ${name}`);
  }
  const expectedRelocations = template.literals.map((key, index) => ({
    offset: entry.size + index * 4, type: "R_ARM_ABS32", symbol: entry[key],
  }));
  const actualRelocations = relocations.get(sectionName) ?? [];
  if (actualRelocations.length !== expectedRelocations.length ||
      expectedRelocations.some((expected, index) => actualRelocations[index]?.offset !== expected.offset ||
        actualRelocations[index]?.type !== expected.type || actualRelocations[index]?.symbol !== expected.symbol)) {
    fail(`invalid neutral relocations for ${name}`);
  }
}
for (const identity of identities) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (identitySymbols.length !== 1 || identitySymbols[0].value !== 0 || identitySymbols[0].size !== 0 ||
      identitySymbols[0].type !== "NOTYPE" || identitySymbols[0].binding !== "GLOBAL" ||
      identitySymbols[0].visibility !== "DEFAULT" || identitySymbols[0].sectionIndex !== "UND") {
    fail(`invalid undefined identity symbol ${identity}`);
  }
}

console.log(`Validated 25 ARM IPC sections, symbols, ordered relocations, and 25 batch identities (${functionBytes} function bytes).`);
