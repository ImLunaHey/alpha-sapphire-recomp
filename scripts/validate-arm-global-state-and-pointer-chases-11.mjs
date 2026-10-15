import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const configPath = join(root, "config", "arm-global-state-and-pointer-chases-11.json");
const sourcePath = join(root, "src", "main", "arm_global_state_and_pointer_chases_11.S");
const configText = readFileSync(configPath, "utf8");
const config = JSON.parse(configText);

if (
  Object.keys(config).sort().join(",") !== "functions,schemaVersion" ||
  config.schemaVersion !== 1 ||
  !Array.isArray(config.functions) ||
  config.functions.length !== 97
) {
  throw new Error("Unexpected global-state batch manifest format or cardinality");
}

const expected = new Map();
const identities = new Map();
let functionBytes = 0;
for (const entry of config.functions) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    Object.keys(entry).sort().join(",") !== "behavior,identity,name,segment,size" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    !/^(?:global_load_[0-9]{2}|global_state_[0-9]{2}|opaque_39)$/.test(entry.identity) ||
    !["data", "bss"].includes(entry.segment) ||
    !Number.isInteger(entry.size) ||
    entry.size < 12 ||
    entry.size > 32 ||
    entry.size % 4 !== 0 ||
    typeof entry.behavior !== "string" ||
    entry.behavior.length === 0 ||
    expected.has(entry.name)
  ) {
    throw new Error("Invalid or duplicate global-state batch manifest entry");
  }
  const priorSegment = identities.get(entry.identity);
  if (priorSegment !== undefined && priorSegment !== entry.segment) {
    throw new Error(`Conflicting segment classes for ${entry.identity}`);
  }
  expected.set(entry.name, entry);
  identities.set(entry.identity, entry.segment);
  functionBytes += entry.size;
}
if (functionBytes !== 1544) {
  throw new Error(`Expected 1,544 function bytes, found ${functionBytes}`);
}
const sizeDistribution = new Map();
for (const entry of expected.values()) sizeDistribution.set(entry.size, (sizeDistribution.get(entry.size) ?? 0) + 1);
for (const [size, count] of [[12, 42], [16, 29], [20, 16], [24, 7], [28, 2], [32, 1]]) {
  if (sizeDistribution.get(size) !== count) throw new Error(`Expected ${count} ${size}-byte functions`);
}
if (sizeDistribution.size !== 6) throw new Error("Unexpected function size in global-state manifest");
if (expected.get("func_0011B704")?.behavior !== "paired_store64:base_r2:a0_low:a1_high:4" ||
    expected.get("func_0011B704")?.size !== 12 ||
    expected.get("func_0040ECA8")?.behavior !== "clear_advance_clear:base_r1:zero_r0:offsets_0_4" ||
    expected.get("func_0040ECA8")?.size !== 24) {
  throw new Error("Special paired-store or pointer-advance form is not preserved");
}

const source = readFileSync(sourcePath, "utf8");
if (createHash("sha256").update(source).digest("hex") !==
    "f9174d583636f370ac663566cc298ac1abadddc8782a314e652187593049844b") {
  throw new Error("Deterministic A32 source templates changed without validator review");
}
if (createHash("sha256").update(configText).digest("hex") !==
    "11eb4d5cb0d85acde2759b1fb7083d0913a89d88f4db5f6ca9cbcf9b600f3ae6") {
  throw new Error("Deterministic A32 manifest changed without validator review");
}
const actual = new Map();
for (const line of source.split("\n")) {
  const invocation = /^(?:STORE_ARG|STORE_TWO_WB|PAIRED_STORE|STORE_CONST|STORE_NEG1|FLAGGED_STORE|ZERO_TWO|LOAD_MASK|PTR_ADD|CONDITIONAL_BYTE) (func_[0-9A-F]{8}), ([A-Za-z0-9_]+)/.exec(line);
  if (invocation !== null) {
    if (actual.has(invocation[1])) throw new Error(`Duplicate source definition for ${invocation[1]}`);
    actual.set(invocation[1], invocation[2]);
  }
  const begin = /^BEGIN (func_[0-9A-F]{8})$/.exec(line);
  if (begin !== null) {
    const end = new RegExp(`^END ${begin[1]}, ([A-Za-z0-9_]+)$`, "m").exec(source);
    if (end === null || actual.has(begin[1])) throw new Error(`Malformed source block for ${begin[1]}`);
    actual.set(begin[1], end[1]);
  }
}
if (!source.includes("PAIRED_STORE func_0011B704, global_state_07, 4") ||
    !source.includes("ldr r2, .Lidentity_\\name\n    strd r0, r1, [r2, #\\offset]") ||
    !source.includes("ldr r1, .Lidentity_func_0040ECA8\n    mov r0, #0\n    str r0, [r1]\n    add r1, r1, #4\n    str r0, [r1]\n    bx lr\nEND func_0040ECA8, opaque_39")) {
  throw new Error("Special audited assembly forms are missing");
}
if (actual.size !== expected.size) {
  throw new Error(`Expected ${expected.size} source definitions, found ${actual.size}`);
}
for (const [name, entry] of expected) {
  if (actual.get(name) !== entry.identity) throw new Error(`Source identity mismatch for ${name}`);
}
for (const name of actual.keys()) {
  if (!expected.has(name)) throw new Error(`Unconfigured source definition ${name}`);
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  throw new Error("Object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage for 97 ARM global-state functions (${functionBytes} bytes).`);
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

for (const [name, entry] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (section === undefined || section.type !== "PROGBITS" || section.size !== entry.size + 4 ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    throw new Error(`Invalid executable section for ${name}`);
  }
  const functionSymbols = symbols.get(name) ?? [];
  if (functionSymbols.length !== 1 || functionSymbols[0].value !== 0 ||
      functionSymbols[0].size !== entry.size || functionSymbols[0].type !== "FUNC" ||
      functionSymbols[0].binding !== "GLOBAL" || functionSymbols[0].visibility !== "DEFAULT" ||
      Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index) {
    throw new Error(`Invalid function symbol for ${name}`);
  }
  const sectionRelocations = relocations.get(sectionName) ?? [];
  if (sectionRelocations.length !== 1 || sectionRelocations[0].offset !== entry.size ||
      sectionRelocations[0].type !== "R_ARM_ABS32" || sectionRelocations[0].symbol !== entry.identity) {
    throw new Error(`Invalid adjacent identity relocation for ${name}`);
  }
}
for (const identity of identities.keys()) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (identitySymbols.length !== 1 || identitySymbols[0].value !== 0 || identitySymbols[0].size !== 0 ||
      identitySymbols[0].type !== "NOTYPE" || identitySymbols[0].binding !== "GLOBAL" ||
      identitySymbols[0].visibility !== "DEFAULT" || identitySymbols[0].sectionIndex !== "UND") {
    throw new Error(`Invalid undefined identity symbol ${identity}`);
  }
}

console.log(`Validated 97 ARM global-state sections, symbols, and neutral relocations (${functionBytes} function bytes).`);
