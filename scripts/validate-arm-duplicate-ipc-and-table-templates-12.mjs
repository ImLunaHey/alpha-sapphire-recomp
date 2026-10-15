import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-duplicate-ipc-and-table-templates-12.json");
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const sourcePath = join(root, "src", "main", "arm_duplicate_ipc_and_table_templates_12.S");
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(`ARM duplicate IPC/table template validation failed: ${message}`);
}

if (
  Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_duplicate_ipc_and_table_templates_12.S" ||
  !Array.isArray(manifest.functions) ||
  manifest.functions.length !== 28
) {
  fail("unexpected manifest format or cardinality");
}

const functions = new Map();
const identities = new Set();
let functionBytes = 0;
const templateCounts = new Map();
for (const entry of manifest.functions) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    !["ipc_one", "ipc_two", "table_state"].includes(entry.template) ||
    functions.has(entry.name)
  ) {
    fail("invalid or duplicate manifest function");
  }
  const expectedSize = entry.template === "ipc_one" ? 52 : entry.template === "ipc_two" ? 64 : 176;
  if (entry.size !== expectedSize) fail(`invalid size for ${entry.name}`);
  if (entry.template === "table_state") {
    if (
      Object.keys(entry).sort().join(",") !== "name,size,tables,template" ||
      !Array.isArray(entry.tables) ||
      entry.tables.length !== 6 ||
      entry.tables.some((identity) =>
        typeof identity !== "string" ||
        !new RegExp(`^table_${entry.name}_(?:selector_shift|selector_variant|source16|base16|source64|base64)$`).test(identity)
      ) ||
      new Set(entry.tables).size !== 6
    ) {
      fail(`invalid table identities for ${entry.name}`);
    }
    for (const identity of entry.tables) identities.add(identity);
  } else {
    if (
      Object.keys(entry).sort().join(",") !== "command,handle,name,size,template" ||
      entry.command !== `ipc_command_${entry.name}` ||
      !/^ipc_handle_slot_(?:alpha|beta|gamma)$/.test(entry.handle)
    ) {
      fail(`invalid IPC identities for ${entry.name}`);
    }
    identities.add(entry.command);
    identities.add(entry.handle);
  }
  functions.set(entry.name, entry);
  functionBytes += entry.size;
  templateCounts.set(entry.template, (templateCounts.get(entry.template) ?? 0) + 1);
}
if (
  functionBytes !== 1960 ||
  templateCounts.get("ipc_one") !== 14 ||
  templateCounts.get("ipc_two") !== 11 ||
  templateCounts.get("table_state") !== 3 ||
  templateCounts.size !== 3
) {
  fail("the manifest must describe 14 one-byte IPC, 11 two-byte IPC, and 3 table functions totaling 1,960 bytes");
}

const invocations = new Map();
for (const line of source.split("\n")) {
  const match = /^(IPC_ONE|IPC_TWO|TABLE_STATE) (func_[0-9A-F]{8}), (.+)$/.exec(line);
  if (match === null) continue;
  if (invocations.has(match[2])) fail(`duplicate source invocation for ${match[2]}`);
  invocations.set(match[2], { macro: match[1], identities: match[3].split(", ") });
}
if (invocations.size !== functions.size) fail("source invocation coverage does not match the manifest");
for (const [name, entry] of functions) {
  const invocation = invocations.get(name);
  const macro = entry.template === "ipc_one" ? "IPC_ONE" : entry.template === "ipc_two" ? "IPC_TWO" : "TABLE_STATE";
  const expectedIdentities = entry.template === "table_state" ? entry.tables : [entry.command, entry.handle];
  if (
    invocation?.macro !== macro ||
    invocation.identities.length !== expectedIdentities.length ||
    invocation.identities.some((identity, index) => identity !== expectedIdentities[index])
  ) {
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

// These hashes make the authorized textual templates and neutral manifest deterministic.
if (createHash("sha256").update(source).digest("hex") !==
    "53844f9e8d1172da2dd6c18e0e41e3223e890362744f5080d4c3654dbff81dcc") {
  fail("deterministic assembly templates changed without validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "6ea80b502e4f942ab116d8c070e30c07839abb0bf3e6fced05d4f91cd39f5428") {
  fail("deterministic neutral manifest changed without validator review");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  fail("object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage for 28 ARM duplicate IPC/table functions (${functionBytes} bytes).`);
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
  sections.set(match[2], {
    index: Number.parseInt(match[1], 10),
    type: match[3],
    size: Number.parseInt(match[4], 16),
    flags: match[5],
    alignment: Number.parseInt(match[6], 10),
  });
}
const symbols = new Map();
const symbolPattern = /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const entries = symbols.get(match[7]) ?? [];
  entries.push({
    value: Number.parseInt(match[1], 16), size: Number.parseInt(match[2], 10),
    type: match[3], binding: match[4], visibility: match[5], sectionIndex: match[6],
  });
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
  const expectedSectionSize = entry.size + (entry.template === "table_state" ? 0 : 8);
  if (
    section === undefined || section.type !== "PROGBITS" || section.size !== expectedSectionSize ||
    !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4
  ) {
    fail(`invalid executable section for ${name}`);
  }
  const functionSymbols = symbols.get(name) ?? [];
  if (
    functionSymbols.length !== 1 || functionSymbols[0].value !== 0 || functionSymbols[0].size !== entry.size ||
    functionSymbols[0].type !== "FUNC" || functionSymbols[0].binding !== "GLOBAL" ||
    functionSymbols[0].visibility !== "DEFAULT" || Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index
  ) {
    fail(`invalid function symbol for ${name}`);
  }
  const armMappings = symbols.get("$a") ?? [];
  if (!armMappings.some((symbol) => symbol.value === 0 && Number.parseInt(symbol.sectionIndex, 10) === section.index)) {
    fail(`missing ARM mapping symbol for ${name}`);
  }
  const actualRelocations = relocations.get(sectionName) ?? [];
  const expectedRelocations = entry.template === "table_state"
    ? []
    : [
        { offset: entry.size, type: "R_ARM_ABS32", symbol: entry.command },
        { offset: entry.size + 4, type: "R_ARM_ABS32", symbol: entry.handle },
      ];
  if (
    actualRelocations.length !== expectedRelocations.length ||
    expectedRelocations.some((expected, index) =>
      actualRelocations[index]?.offset !== expected.offset ||
      actualRelocations[index]?.type !== expected.type ||
      actualRelocations[index]?.symbol !== expected.symbol
    )
  ) {
    fail(`invalid neutral relocations for ${name}`);
  }
}
for (const identity of identities) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (
    identitySymbols.length !== 1 || identitySymbols[0].value !== 0 || identitySymbols[0].size !== 0 ||
    identitySymbols[0].type !== "NOTYPE" || identitySymbols[0].binding !== "GLOBAL" ||
    identitySymbols[0].visibility !== "DEFAULT" || identitySymbols[0].sectionIndex !== "UND"
  ) {
    fail(`invalid undefined identity symbol ${identity}`);
  }
}

console.log(`Validated 28 ARM duplicate IPC/table sections, symbols, IPC relocations, and table identities (${functionBytes} function bytes).`);
