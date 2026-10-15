import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const configPath = join(root, "config", "arm-adjacent-global-loads-09.json");
const sourcePath = join(root, "src", "main", "arm_adjacent_global_loads_09.S");
const excludedScalars = new Set(["func_0010702C", "func_002BA6CC"]);
const readMnemonics = new Map([
  ["u32", "ldr"],
  ["u8", "ldrb"],
  ["s8", "ldrsb"],
]);

const config = JSON.parse(readFileSync(configPath, "utf8"));
if (
  Object.keys(config).sort().join(",") !== "functions,schemaVersion" ||
  config.schemaVersion !== 1 ||
  !Array.isArray(config.functions) ||
  config.functions.length !== 79
) {
  throw new Error("Unexpected ARM adjacent-global-load mapping format or cardinality");
}

const expected = new Map();
const identities = new Map();
for (const entry of config.functions) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    Object.keys(entry).sort().join(",") !==
      "displacement,identity,name,read,segment" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    !/^global_load_(?:0[1-9]|[1-3][0-9]|4[0-7])$/.test(entry.identity) ||
    !["data", "bss"].includes(entry.segment) ||
    !readMnemonics.has(entry.read) ||
    !Number.isInteger(entry.displacement) ||
    entry.displacement < 0 ||
    entry.displacement > 4095 ||
    expected.has(entry.name)
  ) {
    throw new Error("Invalid or duplicate ARM adjacent-global-load mapping entry");
  }
  if (excludedScalars.has(entry.name)) {
    throw new Error(`Excluded scalar function must not be configured: ${entry.name}`);
  }
  const priorSegment = identities.get(entry.identity);
  if (priorSegment !== undefined && priorSegment !== entry.segment) {
    throw new Error(`Conflicting segment classes for ${entry.identity}`);
  }
  expected.set(entry.name, entry);
  identities.set(entry.identity, entry.segment);
}
if (identities.size !== 47) {
  throw new Error(`Expected 47 neutral identities, found ${identities.size}`);
}
for (let number = 1; number <= 47; number++) {
  const identity = `global_load_${String(number).padStart(2, "0")}`;
  if (!identities.has(identity)) throw new Error(`Missing neutral identity ${identity}`);
}

const source = readFileSync(sourcePath, "utf8");
const requiredMacro = `.macro ARM_ADJACENT_GLOBAL_LOAD name, identity, read, displacement
    .section .text.\\name,"ax",%progbits
    .balign 4
    .global \\name
    .type \\name, %function
\\name:
    ldr r0, .Lidentity_\\name
    \\read r0, [r0, #\\displacement]
    bx lr
    .size \\name, .-\\name
.Lidentity_\\name:
    .word \\identity
    .global \\identity
.endm`;
if (!source.includes(requiredMacro)) {
  throw new Error("ARM adjacent-global-load macro has an unexpected shape");
}

const invocationLines = source
  .split("\n")
  .filter((line) => line.startsWith("ARM_ADJACENT_GLOBAL_LOAD "));
if (invocationLines.length !== expected.size) {
  throw new Error(`Expected ${expected.size} assembly invocations, found ${invocationLines.length}`);
}
const actual = new Map();
const invocationPattern =
  /^ARM_ADJACENT_GLOBAL_LOAD (func_[0-9A-F]{8}), (global_load_[0-9]{2}), (ldr|ldrb|ldrsb), ([0-9]+)$/;
for (const line of invocationLines) {
  const match = invocationPattern.exec(line);
  if (match === null || actual.has(match[1])) {
    throw new Error(`Invalid or duplicate assembly invocation: ${line}`);
  }
  actual.set(match[1], {
    identity: match[2],
    mnemonic: match[3],
    displacement: Number.parseInt(match[4], 10),
  });
}
for (const [name, entry] of expected) {
  const found = actual.get(name);
  if (
    found === undefined ||
    found.identity !== entry.identity ||
    found.mnemonic !== readMnemonics.get(entry.read) ||
    found.displacement !== entry.displacement
  ) {
    throw new Error(`Assembly mapping mismatch for ${name}`);
  }
}
for (const name of actual.keys()) {
  if (!expected.has(name)) throw new Error(`Unconfigured assembly definition for ${name}`);
}
for (const name of excludedScalars) {
  if (source.includes(name)) throw new Error(`Excluded scalar function appears in assembly: ${name}`);
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  throw new Error("Object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(
    `Validated deterministic source coverage for ${expected.size} ARM adjacent global loads and ${identities.size} identities.`
  );
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelf, args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  return result.stdout;
}

const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);

const sections = new Map();
const sectionPattern =
  /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm;
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
const symbolPattern =
  /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const entries = symbols.get(match[7]) ?? [];
  entries.push({
    value: Number.parseInt(match[1], 16),
    size: Number.parseInt(match[2], 10),
    type: match[3],
    binding: match[4],
    visibility: match[5],
    sectionIndex: match[6],
  });
  symbols.set(match[7], entries);
}

const relocations = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading !== null) {
    relocatedSection = heading[1];
    continue;
  }
  const entry = /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
  if (entry !== null && relocatedSection !== undefined) {
    const entries = relocations.get(relocatedSection) ?? [];
    entries.push({
      offset: Number.parseInt(entry[1], 16),
      type: entry[2],
      symbol: entry[3],
    });
    relocations.set(relocatedSection, entries);
  }
}

for (const [name, entry] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (
    section === undefined ||
    section.type !== "PROGBITS" ||
    section.size !== 16 ||
    !section.flags.includes("A") ||
    !section.flags.includes("X") ||
    section.alignment !== 4
  ) {
    throw new Error(`Invalid executable section for ${name}`);
  }
  const functionSymbols = symbols.get(name) ?? [];
  if (
    functionSymbols.length !== 1 ||
    functionSymbols[0].value !== 0 ||
    functionSymbols[0].size !== 12 ||
    functionSymbols[0].type !== "FUNC" ||
    functionSymbols[0].binding !== "GLOBAL" ||
    functionSymbols[0].visibility !== "DEFAULT" ||
    Number.parseInt(functionSymbols[0].sectionIndex, 10) !== section.index
  ) {
    throw new Error(`Invalid function symbol for ${name}`);
  }
  const sectionRelocations = relocations.get(sectionName) ?? [];
  if (
    sectionRelocations.length !== 1 ||
    sectionRelocations[0].offset !== 12 ||
    sectionRelocations[0].type !== "R_ARM_ABS32" ||
    sectionRelocations[0].symbol !== entry.identity
  ) {
    throw new Error(`Invalid adjacent identity relocation for ${name}`);
  }
}

const objectIdentityNames = [...symbols.keys()].filter((name) => /^global_load_[0-9]{2}$/.test(name));
if (objectIdentityNames.length !== identities.size) {
  throw new Error(`Expected ${identities.size} object identities, found ${objectIdentityNames.length}`);
}
for (const identity of identities.keys()) {
  const identitySymbols = symbols.get(identity) ?? [];
  if (
    identitySymbols.length !== 1 ||
    identitySymbols[0].value !== 0 ||
    identitySymbols[0].size !== 0 ||
    identitySymbols[0].type !== "NOTYPE" ||
    identitySymbols[0].binding !== "GLOBAL" ||
    identitySymbols[0].visibility !== "DEFAULT" ||
    identitySymbols[0].sectionIndex !== "UND"
  ) {
    throw new Error(`Invalid undefined identity symbol ${identity}`);
  }
}

console.log(
  `Validated ${expected.size} ARM adjacent global-load sections, symbols, and relocations (${expected.size * 12} function bytes).`
);
