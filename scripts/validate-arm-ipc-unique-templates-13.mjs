import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-unique-templates-13.json");
const priorManifestPath = join(root, "config", "arm-duplicate-ipc-and-table-templates-12.json");
const sourcePath = join(root, "src", "main", "arm_ipc_unique_templates_13.S");
const manifestText = readFileSync(manifestPath, "utf8");
const priorManifest = JSON.parse(readFileSync(priorManifestPath, "utf8"));
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(`ARM unique IPC template validation failed: ${message}`);
}

const templates = new Map([
  ["global_one_word", { macro: "IPC_GLOBAL_ONE_WORD", size: 48, count: 8, handle: true }],
  ["global_six_mixed", { macro: "IPC_GLOBAL_SIX_MIXED", size: 84, count: 5, handle: true }],
  ["handle_word_byte", { macro: "IPC_HANDLE_WORD_BYTE", size: 72, count: 6, handle: false }],
  ["handle_word", { macro: "IPC_HANDLE_WORD", size: 60, count: 6, handle: false }],
  ["handle_word_two_bytes", { macro: "IPC_HANDLE_WORD_TWO_BYTES", size: 80, count: 4, handle: false }],
]);
if (
  Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_ipc_unique_templates_13.S" ||
  !Array.isArray(manifest.functions) ||
  manifest.functions.length !== 29
) {
  fail("unexpected manifest format or cardinality");
}

const functions = new Map();
const commands = new Set();
const commandOccurrences = new Map();
const handles = new Map();
const templateCounts = new Map();
let functionBytes = 0;
for (const entry of manifest.functions) {
  const template = templates.get(entry?.template);
  const expectedKeys = template?.handle
    ? "command,handle,mode,name,size,template"
    : "command,mode,name,size,template";
  const commandOverrides = new Map([
    ["func_00109CF4", "ipc_command_func_002C63E4"],
    ["func_001FB580", "ipc_command_func_00133E94"],
    ["func_002CA630", "ipc_command_func_002C8DC4"],
    ["func_002CA958", "ipc_command_func_002C90EC"],
    ["func_002CA9FC", "ipc_command_func_002C9190"],
    ["func_002CA58C", "ipc_command_func_002C8D20"],
    ["func_002CAA8C", "ipc_command_func_002C9220"],
    ["func_002CABA0", "ipc_command_func_002C93A8"],
    ["func_002CA77C", "ipc_command_func_002C8F10"],
    ["func_002CABE0", "ipc_command_func_002C93E8"],
  ]);
  const expectedCommand = commandOverrides.get(entry?.name) ?? `ipc_command_${entry?.name}`;
  if (
    entry === null || typeof entry !== "object" ||
    Object.keys(entry).sort().join(",") !== expectedKeys ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) || entry.mode !== "arm" ||
    template === undefined || entry.size !== template.size || functions.has(entry.name) ||
    entry.command !== expectedCommand
  ) {
    fail("invalid or duplicate manifest function");
  }
  if (template.handle) {
    if (!/^ipc_handle_slot_(?:alpha|delta|epsilon|gamma|zeta)$/.test(entry.handle)) {
      fail(`invalid handle identity for ${entry.name}`);
    }
    handles.set(entry.handle, (handles.get(entry.handle) ?? 0) + 1);
  }
  functions.set(entry.name, entry);
  commands.add(entry.command);
  commandOccurrences.set(entry.command, (commandOccurrences.get(entry.command) ?? 0) + 1);
  templateCounts.set(entry.template, (templateCounts.get(entry.template) ?? 0) + 1);
  functionBytes += entry.size;
}
for (const [name, template] of templates) {
  if (templateCounts.get(name) !== template.count) fail(`invalid ${name} cardinality`);
}
if (templateCounts.size !== templates.size || functionBytes !== 1916) {
  fail("the manifest must describe five templates and 1,916 function bytes");
}
if (commands.size !== 20 || [...commandOccurrences.values()].reduce((sum, count) => sum + count, 0) !== 29) {
  fail("unexpected command identity cardinalities");
}
const expectedHandles = new Map([
  ["ipc_handle_slot_alpha", 5],
  ["ipc_handle_slot_delta", 1],
  ["ipc_handle_slot_epsilon", 1],
  ["ipc_handle_slot_gamma", 5],
  ["ipc_handle_slot_zeta", 1],
]);
if (handles.size !== expectedHandles.size ||
    [...expectedHandles].some(([identity, count]) => handles.get(identity) !== count)) {
  fail("unexpected handle identity cardinalities");
}

if (priorManifest?.schemaVersion !== 1 || !Array.isArray(priorManifest.functions) ||
    priorManifest.functions.length !== 28) {
  fail("unexpected batch 12 manifest format");
}
const priorCommands = new Set();
const priorHandles = new Set();
const allIpcIdentitySlots = [];
for (const entry of priorManifest.functions) {
  if (typeof entry?.command === "string") {
    priorCommands.add(entry.command);
    allIpcIdentitySlots.push(entry.command, entry.handle);
  }
  if (typeof entry?.handle === "string") priorHandles.add(entry.handle);
}
for (const entry of manifest.functions) {
  allIpcIdentitySlots.push(entry.command);
  if (entry.handle !== undefined) allIpcIdentitySlots.push(entry.handle);
}
const crossBatchCommands = [...commands].filter((identity) => priorCommands.has(identity));
if (priorCommands.size !== 24 || crossBatchCommands.length !== 1 ||
    crossBatchCommands[0] !== "ipc_command_func_002C63E4" ||
    !priorHandles.has("ipc_handle_slot_alpha") || !priorHandles.has("ipc_handle_slot_gamma") ||
    priorHandles.has("ipc_handle_slot_delta") || priorHandles.has("ipc_handle_slot_epsilon") ||
    priorHandles.has("ipc_handle_slot_zeta") || allIpcIdentitySlots.length !== 92 ||
    new Set(allIpcIdentitySlots).size !== 49) {
  fail("the 92 IPC slots must form the specified 49-identity cross-batch mapping");
}

const invocations = new Map();
for (const line of source.split("\n")) {
  const match = /^(IPC_GLOBAL_ONE_WORD|IPC_GLOBAL_SIX_MIXED|IPC_HANDLE_WORD_BYTE|IPC_HANDLE_WORD|IPC_HANDLE_WORD_TWO_BYTES) (func_[0-9A-F]{8}), (.+)$/.exec(line);
  if (match === null) continue;
  if (invocations.has(match[2])) fail(`duplicate source invocation for ${match[2]}`);
  invocations.set(match[2], { macro: match[1], identities: match[3].split(", ") });
}
if (invocations.size !== functions.size) fail("source invocation coverage does not match the manifest");
for (const [name, entry] of functions) {
  const template = templates.get(entry.template);
  const expectedIdentities = template.handle ? [entry.command, entry.handle] : [entry.command];
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

if (createHash("sha256").update(source).digest("hex") !== "ff7b174ffe2f484e12264c07be25356556eb0453fe654a3c993763210ea849d5") {
  fail("deterministic assembly templates changed without validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "eef7b87de3048b7c08f2ea4bb3691213276bfebd5b0fead5e4b14d0c7220ccf5") {
  fail("deterministic neutral manifest changed without validator review");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  fail("object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage and cross-batch identities for 29 ARM IPC functions (${functionBytes} bytes).`);
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
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
  const expectedSectionSize = entry.size + (template.handle ? 8 : 4);
  if (section === undefined || section.type !== "PROGBITS" || section.size !== expectedSectionSize ||
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
  if (!armMappings.some((symbol) => symbol.value === 0 &&
      Number.parseInt(symbol.sectionIndex, 10) === section.index)) {
    fail(`missing ARM mapping symbol for ${name}`);
  }
  const expectedRelocations = [{ offset: entry.size, type: "R_ARM_ABS32", symbol: entry.command }];
  if (template.handle) {
    expectedRelocations.push({ offset: entry.size + 4, type: "R_ARM_ABS32", symbol: entry.handle });
  }
  const actualRelocations = relocations.get(sectionName) ?? [];
  if (actualRelocations.length !== expectedRelocations.length ||
      expectedRelocations.some((expected, index) => actualRelocations[index]?.offset !== expected.offset ||
        actualRelocations[index]?.type !== expected.type || actualRelocations[index]?.symbol !== expected.symbol)) {
    fail(`invalid neutral relocations for ${name}`);
  }
}
for (const identity of new Set([...commands, ...handles.keys()])) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (identitySymbols.length !== 1 || identitySymbols[0].value !== 0 || identitySymbols[0].size !== 0 ||
      identitySymbols[0].type !== "NOTYPE" || identitySymbols[0].binding !== "GLOBAL" ||
      identitySymbols[0].visibility !== "DEFAULT" || identitySymbols[0].sectionIndex !== "UND") {
    fail(`invalid undefined identity symbol ${identity}`);
  }
}

console.log(`Validated 29 ARM IPC sections, symbols, source/base/target relocations, and cross-batch identities (${functionBytes} function bytes).`);
