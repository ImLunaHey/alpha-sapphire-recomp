import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-duplicate-container-templates-13.json");
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(join(root, manifest.source), "utf8");

function fail(message) {
  throw new Error(`ARM duplicate container template validation failed: ${message}`);
}

if (
  Object.keys(manifest).sort().join(",") !== "functions,schemaVersion,source" ||
  manifest.schemaVersion !== 1 ||
  manifest.source !== "src/main/arm_duplicate_container_templates_13.S" ||
  !Array.isArray(manifest.functions) ||
  manifest.functions.length !== 11
) {
  fail("unexpected manifest format or cardinality");
}

const functions = new Map();
const identities = new Set();
const templateCounts = new Map();
let functionBytes = 0;
for (const entry of manifest.functions) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    !["range_erase_a", "range_erase_b", "vector_append_4"].includes(entry.template) ||
    functions.has(entry.name)
  ) {
    fail("invalid or duplicate manifest function");
  }
  const expectedSize = entry.template === "range_erase_a" ? 320 :
    entry.template === "range_erase_b" ? 312 : 292;
  if (entry.size !== expectedSize) fail(`invalid size for ${entry.name}`);
  if (entry.template === "vector_append_4") {
    if (Object.keys(entry).sort().join(",") !== "name,size,template") {
      fail(`unexpected vector manifest fields for ${entry.name}`);
    }
  } else {
    if (
      Object.keys(entry).sort().join(",") !== "erase,name,recycler,size,template" ||
      !/^func_[0-9A-F]{8}$/.test(entry.recycler) ||
      !/^func_[0-9A-F]{8}$/.test(entry.erase) ||
      entry.recycler === entry.erase ||
      identities.has(entry.recycler) ||
      identities.has(entry.erase)
    ) {
      fail(`invalid or reused callee identities for ${entry.name}`);
    }
    identities.add(entry.recycler);
    identities.add(entry.erase);
  }
  functions.set(entry.name, entry);
  functionBytes += entry.size;
  templateCounts.set(entry.template, (templateCounts.get(entry.template) ?? 0) + 1);
}
if (
  functionBytes !== 3412 ||
  templateCounts.get("range_erase_a") !== 5 ||
  templateCounts.get("range_erase_b") !== 3 ||
  templateCounts.get("vector_append_4") !== 3 ||
  templateCounts.size !== 3 ||
  identities.size !== 16
) {
  fail("the manifest must describe the three authorized templates totaling 3,412 bytes");
}

const invocations = new Map();
for (const line of source.split("\n")) {
  const match = /^(RANGE_ERASE_A|RANGE_ERASE_B|VECTOR_APPEND_4) (func_[0-9A-F]{8})(?:, (func_[0-9A-F]{8}), (func_[0-9A-F]{8}))?$/.exec(line);
  if (match === null) continue;
  if (invocations.has(match[2])) fail(`duplicate source invocation for ${match[2]}`);
  invocations.set(match[2], { macro: match[1], recycler: match[3], erase: match[4] });
}
if (invocations.size !== functions.size) fail("source invocation coverage does not match the manifest");
for (const [name, entry] of functions) {
  const invocation = invocations.get(name);
  const expectedMacro = entry.template === "range_erase_a" ? "RANGE_ERASE_A" :
    entry.template === "range_erase_b" ? "RANGE_ERASE_B" : "VECTOR_APPEND_4";
  if (
    invocation?.macro !== expectedMacro ||
    invocation.recycler !== entry.recycler ||
    invocation.erase !== entry.erase
  ) {
    fail(`source invocation differs from the manifest for ${name}`);
  }
}
if (/^\s*\.(?:inst|word|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("embedded instruction or data directives are not permitted");
}
if (createHash("sha256").update(source).digest("hex") !==
    "5f80d2bc3d3104c3c3e116b8d7a629289ffca4d2330a3e020221e0ca8750796d") {
  fail("deterministic assembly templates changed without validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "c61676695a974beb44236cff2028f7ca9162f9be5c0018b3285ce034999b4c8d") {
  fail("deterministic neutral manifest changed without validator review");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  fail("object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage for 11 ARM duplicate container functions (${functionBytes} bytes).`);
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
    index: Number.parseInt(match[1], 10), type: match[3],
    size: Number.parseInt(match[4], 16), flags: match[5],
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
  if (
    section === undefined || section.type !== "PROGBITS" || section.size !== entry.size ||
    !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4
  ) {
    fail(`invalid executable section for ${name}`);
  }
  const functionSymbols = symbols.get(name) ?? [];
  if (
    functionSymbols.length !== 1 || functionSymbols[0].value !== 0 ||
    functionSymbols[0].size !== entry.size || functionSymbols[0].type !== "FUNC" ||
    functionSymbols[0].binding !== "GLOBAL" || functionSymbols[0].visibility !== "DEFAULT" ||
    Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index
  ) {
    fail(`invalid function symbol for ${name}`);
  }
  const armMappings = symbols.get("$a") ?? [];
  if (!armMappings.some((symbol) =>
    symbol.value === 0 && Number.parseInt(symbol.sectionIndex, 10) === section.index)) {
    fail(`missing ARM mapping symbol for ${name}`);
  }
  const actualRelocations = relocations.get(sectionName) ?? [];
  const expectedRelocations = entry.template === "vector_append_4" ? [] : [
    { offset: 92, type: "R_ARM_CALL", symbol: entry.recycler },
    { offset: entry.template === "range_erase_a" ? 304 : 296, type: "R_ARM_CALL", symbol: entry.erase },
  ];
  if (
    actualRelocations.length !== expectedRelocations.length ||
    expectedRelocations.some((expected, index) =>
      actualRelocations[index]?.offset !== expected.offset ||
      actualRelocations[index]?.type !== expected.type ||
      actualRelocations[index]?.symbol !== expected.symbol)
  ) {
    fail(`invalid neutral call relocations for ${name}`);
  }
}

for (const identity of identities) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (
    identitySymbols.length !== 1 || identitySymbols[0].binding !== "GLOBAL" ||
    identitySymbols[0].visibility !== "DEFAULT"
  ) {
    fail(`invalid callee identity symbol ${identity}`);
  }
}

console.log(`Validated 11 ARM duplicate container sections, symbols, and neutral call relocations (${functionBytes} bytes).`);
