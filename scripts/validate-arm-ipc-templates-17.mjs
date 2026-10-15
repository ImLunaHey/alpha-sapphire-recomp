import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-17.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_17.S");
const priorManifestPaths = [
  join(root, "config", "arm-duplicate-ipc-and-table-templates-12.json"),
  join(root, "config", "arm-ipc-unique-templates-13.json"),
  join(root, "config", "arm-ipc-templates-15.json"),
  join(root, "config", "arm-ipc-templates-16.json"),
];
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");
const priorManifests = priorManifestPaths.map((path) => JSON.parse(readFileSync(path, "utf8")));

function fail(message) {
  throw new Error(`ARM IPC template 17 validation failed: ${message}`);
}

const templates = new Map([
  ["handle_mapped_three_outputs", { macro: "IPC_HANDLE_MAPPED_THREE_OUTPUTS", size: 100, count: 2, literals: ["command"] }],
  ["handle_descriptor_two_outputs", { macro: "IPC_HANDLE_DESCRIPTOR_TWO_OUTPUTS", size: 96, count: 2, literals: ["command"] }],
  ["handle_mapped_mixed_outputs", { macro: "IPC_HANDLE_MAPPED_MIXED_OUTPUTS", size: 92, count: 2, literals: ["command"] }],
  ["handle_two_bytes_one_output", { macro: "IPC_HANDLE_TWO_BYTES_ONE_OUTPUT", size: 92, count: 2, literals: ["command"] }],
  ["handle_static_one_output", { macro: "IPC_HANDLE_STATIC_ONE_OUTPUT", size: 92, count: 2, literals: ["command"] }],
  ["global_words_byte_mapped", { macro: "IPC_GLOBAL_WORDS_BYTE_MAPPED", size: 84, count: 2, literals: ["command", "handle"] }],
  ["global_two_descriptors", { macro: "IPC_GLOBAL_TWO_DESCRIPTORS", size: 84, count: 2, literals: ["command", "handle"] }],
  ["handle_halfword_one_output", { macro: "IPC_HANDLE_HALFWORD_ONE_OUTPUT", size: 84, count: 2, literals: ["command"] }],
  ["global_fixed_mapped", { macro: "IPC_GLOBAL_FIXED_MAPPED", size: 80, count: 2, literals: ["command", "handle"] }],
]);

if (Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
    manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_17.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 18) {
  fail("unexpected manifest format or cardinality");
}

const commandOverrides = new Map([
  ["func_002CA714", "ipc_command_func_002C8EA8"],
  ["func_002CA5CC", "ipc_command_func_002C8D60"],
  ["func_002CA898", "ipc_command_func_002C902C"],
  ["func_002CA8F8", "ipc_command_func_002C908C"],
  ["func_00200154", "ipc_command_func_001FFA8C"],
  ["func_002001F8", "ipc_command_func_001FFB30"],
  ["func_002CA9A4", "ipc_command_func_002C9138"],
  ["func_001FFE54", "ipc_command_func_001FF78C"],
]);
const expectedHandles = new Map([
  ["func_001FFA8C", "ipc_handle_slot_eta"],
  ["func_00200154", "ipc_handle_slot_theta"],
  ["func_001FFB30", "ipc_handle_slot_eta"],
  ["func_002001F8", "ipc_handle_slot_theta"],
  ["func_001FF78C", "ipc_handle_slot_eta"],
  ["func_001FFE54", "ipc_handle_slot_theta"],
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
      entry.command !== expectedCommand) {
    fail("invalid or duplicate manifest function");
  }
  if (template.literals.includes("handle") && entry.handle !== expectedHandles.get(entry.name)) {
    fail(`invalid handle identity for ${entry.name}`);
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
if (templateCounts.size !== templates.size || functionBytes !== 1608 || literalSlots !== 24 || identities.size !== 12) {
  fail("the manifest must describe nine templates, 1,608 function bytes, 24 literal slots, and 12 identities");
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
if (allIpcSlots.length !== 181 || new Set(allIpcSlots).size !== 90) {
  fail("the five IPC batches must form exactly 181 literal slots and 90 identity classes");
}

const invocationPattern = /^(IPC_HANDLE_MAPPED_THREE_OUTPUTS|IPC_HANDLE_DESCRIPTOR_TWO_OUTPUTS|IPC_HANDLE_MAPPED_MIXED_OUTPUTS|IPC_HANDLE_TWO_BYTES_ONE_OUTPUT|IPC_HANDLE_STATIC_ONE_OUTPUT|IPC_GLOBAL_WORDS_BYTE_MAPPED|IPC_GLOBAL_TWO_DESCRIPTORS|IPC_HANDLE_HALFWORD_ONE_OUTPUT|IPC_GLOBAL_FIXED_MAPPED) (func_[0-9A-F]{8}), (.+)$/;
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

if (createHash("sha256").update(source).digest("hex") !== "68d08b3205c6d9a73900703f5377b6093c0685f77894135f0412bf94d59972a5") {
  fail("deterministic assembly templates changed without validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "60df99f0523fe20f02f6d4ddf2814a8c32090ec300c2c4e4c2a2d4aa3e3e690f") {
  fail("deterministic neutral manifest changed without validator review");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf paths must be provided together");
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage and 181-slot/90-class IPC identity structure for 18 ARM functions (${functionBytes} bytes).`);
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

console.log(`Validated 18 ARM IPC sections, symbols, ordered relocations, and 12 batch identities (${functionBytes} function bytes).`);
