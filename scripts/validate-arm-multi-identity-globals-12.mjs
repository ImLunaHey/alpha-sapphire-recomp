import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-multi-identity-globals-12.json");
const sourcePath = join(root, "src", "main", "arm_multi_identity_globals_12.S");
const manifestText = readFileSync(manifestPath, "utf8");
const sourceText = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

if (createHash("sha256").update(manifestText).digest("hex") !==
    "ecc89731abf11f1ecd14e66933bc3eca3f6defbf1d206ae26cae4fca46b36fc0") {
  throw new Error("Deterministic multi-identity manifest changed without validator review");
}
if (createHash("sha256").update(sourceText).digest("hex") !==
    "153b9bf69030ea0f52387dfd1a576ecdabb123139584b62a8dc2a96ea357974d") {
  throw new Error("Deterministic multi-identity A32 source changed without validator review");
}
if (Object.keys(manifest).sort().join(",") !== "functions,schemaVersion" ||
    manifest.schemaVersion !== 1 || !Array.isArray(manifest.functions) ||
    manifest.functions.length !== 9) {
  throw new Error("Unexpected multi-identity manifest format or cardinality");
}

const templateNames = new Set([
  "construct_five_words", "store_pair_stmia", "store_pair_offsets_4_8",
  "store_pair_offsets_0_8", "byte_indexed_word", "store_three_offsets_140_0_64",
  "clear_and_store_text_pair", "sentinel_indexed_word", "initialize_sparse_fields",
]);
const expected = new Map();
const identities = new Map();
const uses = new Map();
let functionBytes = 0;
let relocationCount = 0;
for (const entry of manifest.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,size,slots,template" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || !Number.isInteger(entry.size) ||
      entry.size < 16 || entry.size > 32 || entry.size % 4 !== 0 ||
      !templateNames.has(entry.template) || !Array.isArray(entry.slots) ||
      entry.slots.length < 2 || entry.slots.length > 3 || expected.has(entry.name)) {
    throw new Error("Invalid or duplicate multi-identity manifest entry");
  }
  for (const slot of entry.slots) {
    if (slot === null || typeof slot !== "object" ||
        Object.keys(slot).sort().join(",") !== "identity,segment" ||
        !/^(?:multi_identity_(?:0[1-9]|1[0-5])|global_state_19|global_load_46)$/.test(slot.identity) ||
        !["text", "rodata", "data", "bss"].includes(slot.segment)) {
      throw new Error(`Invalid slot in ${entry.name}`);
    }
    const priorSegment = identities.get(slot.identity);
    if (priorSegment !== undefined && priorSegment !== slot.segment) {
      throw new Error(`Conflicting segment classes for ${slot.identity}`);
    }
    identities.set(slot.identity, slot.segment);
    uses.set(slot.identity, (uses.get(slot.identity) ?? 0) + 1);
  }
  expected.set(entry.name, entry);
  functionBytes += entry.size;
  relocationCount += entry.slots.length;
}
if (functionBytes !== 220 || relocationCount !== 19 || identities.size !== 17) {
  throw new Error("Expected nine functions, 220 bytes, 19 relocations, and 17 identities");
}
for (let number = 1; number <= 15; number++) {
  const identity = `multi_identity_${String(number).padStart(2, "0")}`;
  if (!identities.has(identity)) throw new Error(`Missing ${identity}`);
}
for (const [identity, count] of uses) {
  const expectedCount = ["multi_identity_03", "multi_identity_04"].includes(identity) ? 2 : 1;
  if (count !== expectedCount) throw new Error(`Unexpected use count for ${identity}`);
}
const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  throw new Error("Object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log("Validated deterministic source coverage for 9 ARM multi-identity functions (220 bytes, 19 neutral relocations).");
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
const symbols = [];
const symbolPattern = /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  symbols.push({ value: Number.parseInt(match[1], 16), size: Number.parseInt(match[2], 10),
    type: match[3], binding: match[4], visibility: match[5], sectionIndex: match[6], name: match[7] });
}
const relocations = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading !== null) { relocatedSection = heading[1]; continue; }
  const relocation = /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)(?:\s+\+\s+(-?\d+))?/.exec(line);
  if (relocation !== null && relocatedSection !== undefined) {
    const entries = relocations.get(relocatedSection) ?? [];
    entries.push({ offset: Number.parseInt(relocation[1], 16), type: relocation[2],
      symbol: relocation[3], addend: Number.parseInt(relocation[4] ?? "0", 10) });
    relocations.set(relocatedSection, entries);
  }
}

for (const [name, entry] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (section === undefined || section.type !== "PROGBITS" ||
      section.size !== entry.size + 4 * entry.slots.length ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    throw new Error(`Invalid executable section for ${name}`);
  }
  const functionSymbols = symbols.filter((symbol) => symbol.name === name);
  if (functionSymbols.length !== 1 || functionSymbols[0].value !== 0 ||
      functionSymbols[0].size !== entry.size || functionSymbols[0].type !== "FUNC" ||
      functionSymbols[0].binding !== "GLOBAL" || functionSymbols[0].visibility !== "DEFAULT" ||
      Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index) {
    throw new Error(`Invalid function symbol for ${name}`);
  }
  const mappings = symbols.filter((symbol) =>
    Number.parseInt(symbol.sectionIndex, 10) === section.index && /^\$(?:a|d)(?:\..*)?$/.test(symbol.name));
  if (!mappings.some((symbol) => /^\$a(?:\..*)?$/.test(symbol.name) && symbol.value === 0) ||
      !mappings.some((symbol) => /^\$d(?:\..*)?$/.test(symbol.name) && symbol.value === entry.size) ||
      mappings.some((symbol) => symbol.value !== 0 && symbol.value !== entry.size)) {
    throw new Error(`Invalid ARM/data mapping-symbol transition for ${name}`);
  }
  const sectionRelocations = relocations.get(sectionName) ?? [];
  if (sectionRelocations.length !== entry.slots.length) {
    throw new Error(`Invalid relocation count for ${name}`);
  }
  for (let index = 0; index < entry.slots.length; index++) {
    const relocation = sectionRelocations[index];
    if (relocation.offset !== entry.size + index * 4 || relocation.type !== "R_ARM_ABS32" ||
        relocation.symbol !== entry.slots[index].identity || relocation.addend !== 0) {
      throw new Error(`Invalid slot ${index} relocation for ${name}`);
    }
  }
}
for (const identity of identities.keys()) {
  const identitySymbols = symbols.filter((symbol) => symbol.name === identity);
  if (identitySymbols.length !== 1 || identitySymbols[0].value !== 0 || identitySymbols[0].size !== 0 ||
      identitySymbols[0].type !== "NOTYPE" || identitySymbols[0].binding !== "GLOBAL" ||
      identitySymbols[0].visibility !== "DEFAULT" || identitySymbols[0].sectionIndex !== "UND") {
    throw new Error(`Invalid undefined identity symbol ${identity}`);
  }
}
const objectMultiIdentities = symbols.filter((symbol) => /^multi_identity_[0-9]+$/.test(symbol.name));
if (objectMultiIdentities.length !== 15 ||
    new Set(objectMultiIdentities.map((symbol) => symbol.name)).size !== 15) {
  throw new Error("Expected exactly 15 new multi-identity symbols");
}
const relevantRelocations = [...relocations.entries()]
  .filter(([section]) => expected.has(section.replace(/^\.text\./, "")))
  .flatMap(([, entries]) => entries);
if (relevantRelocations.length !== 19) throw new Error("Expected exactly 19 batch relocations");

console.log("Validated 9 ARM multi-identity sections, mapping symbols, and 19 neutral relocations (220 function bytes).");
