import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const configPath = join(
  root,
  "config",
  "target-literal-identities",
  "AS_EUR_REV2.json"
);
const sourcePath = join(root, "src", "main", "arm_opaque_address_returns.S");
const excludedScalars = new Set([
  "func_0020B92C",
  "func_0020B938",
  "func_002CD4CC",
  "func_0045CECC",
]);

const config = JSON.parse(readFileSync(configPath, "utf8"));
if (
  Object.keys(config).sort().join(",") !==
    "armAdjacentAbsoluteLiterals,version" ||
  config.version !== 1 ||
  config.armAdjacentAbsoluteLiterals === null ||
  typeof config.armAdjacentAbsoluteLiterals !== "object" ||
  Array.isArray(config.armAdjacentAbsoluteLiterals)
) {
  throw new Error("Unexpected ARM adjacent absolute literal mapping format");
}

const expected = new Map(Object.entries(config.armAdjacentAbsoluteLiterals));
if (expected.size !== 38) {
  throw new Error(`Expected 38 opaque address returns, found ${expected.size}`);
}

const identities = new Set();
for (const [name, identity] of expected) {
  if (!/^func_[0-9A-F]{8}$/.test(name) || !/^opaque_[0-9]{2}$/.test(identity)) {
    throw new Error(`Invalid opaque address-return mapping for ${name}`);
  }
  if (excludedScalars.has(name)) {
    throw new Error(`Excluded scalar function must not be configured: ${name}`);
  }
  if (identities.has(identity)) {
    throw new Error(`Duplicate opaque identity: ${identity}`);
  }
  identities.add(identity);
}

const source = readFileSync(sourcePath, "utf8");
const requiredMacroBody = `.macro OPAQUE_ADDRESS_RETURN name, identity
    .section .text.\\name,"ax",%progbits
    .balign 4
    .global \\name
    .type \\name, %function
\\name:
    ldr r0, .Lliteral_\\name
    bx lr
    .size \\name, .-\\name
.Lliteral_\\name:
    .word \\identity
    .global \\identity
.endm`;
if (!source.includes(requiredMacroBody)) {
  throw new Error("Opaque address-return assembly macro has an unexpected shape");
}

const actual = new Map();
const invocationPattern =
  /^OPAQUE_ADDRESS_RETURN (func_[0-9A-F]{8}), (opaque_[0-9]{2})$/gm;
const invocationLines = source
  .split("\n")
  .filter((line) => line.startsWith("OPAQUE_ADDRESS_RETURN"));
if (
  invocationLines.length !== expected.size ||
  invocationLines.some(
    (line) =>
      !/^OPAQUE_ADDRESS_RETURN func_[0-9A-F]{8}, opaque_[0-9]{2}$/.test(line)
  )
) {
  throw new Error("Unexpected opaque address-return assembly invocation");
}
for (const match of source.matchAll(invocationPattern)) {
  if (actual.has(match[1])) {
    throw new Error(`Duplicate opaque address-return definition for ${match[1]}`);
  }
  actual.set(match[1], match[2]);
}

for (const [name, identity] of expected) {
  if (actual.get(name) !== identity) {
    throw new Error(`Assembly mapping mismatch for ${name}`);
  }
}
for (const name of actual.keys()) {
  if (!expected.has(name)) {
    throw new Error(`Unconfigured opaque address-return definition for ${name}`);
  }
}
if (actual.size !== expected.size) {
  throw new Error(
    `Expected ${expected.size} assembly definitions, found ${actual.size}`
  );
}
for (const name of excludedScalars) {
  if (source.includes(name)) {
    throw new Error(`Excluded scalar function appears in assembly: ${name}`);
  }
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  throw new Error("Object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated ${actual.size} symbolic ARM opaque address returns.`);
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  return result.stdout;
}

const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);

const sectionsByName = new Map();
const sectionsByIndex = new Map();
const sectionPattern =
  /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm;
for (const match of sectionOutput.matchAll(sectionPattern)) {
  const section = {
    index: Number.parseInt(match[1], 10),
    name: match[2],
    type: match[3],
    size: Number.parseInt(match[4], 16),
    flags: match[5],
    alignment: Number.parseInt(match[6], 10),
  };
  sectionsByName.set(section.name, section);
  sectionsByIndex.set(section.index, section);
}

const symbolsByName = new Map();
const symbolPattern =
  /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const symbol = {
    value: Number.parseInt(match[1], 16),
    size: Number.parseInt(match[2], 10),
    type: match[3],
    binding: match[4],
    visibility: match[5],
    sectionIndex: match[6],
    name: match[7],
  };
  const symbols = symbolsByName.get(symbol.name) ?? [];
  symbols.push(symbol);
  symbolsByName.set(symbol.name, symbols);
}

const relocationsBySection = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading) {
    relocatedSection = heading[1];
    continue;
  }
  const entry =
    /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
  if (entry && relocatedSection !== undefined) {
    const relocations = relocationsBySection.get(relocatedSection) ?? [];
    relocations.push({
      offset: Number.parseInt(entry[1], 16),
      type: entry[2],
      symbol: entry[3],
    });
    relocationsBySection.set(relocatedSection, relocations);
  }
}

for (const [name, identity] of expected) {
  const sectionName = `.text.${name}`;
  const section = sectionsByName.get(sectionName);
  if (
    section === undefined ||
    section.type !== "PROGBITS" ||
    section.size !== 12 ||
    !section.flags.includes("A") ||
    !section.flags.includes("X") ||
    section.alignment !== 4
  ) {
    throw new Error(`Invalid base section for ${name}`);
  }

  const functionSymbols = symbolsByName.get(name) ?? [];
  if (functionSymbols.length !== 1) {
    throw new Error(`Expected one base function symbol for ${name}`);
  }
  const functionSymbol = functionSymbols[0];
  if (
    functionSymbol.value !== 0 ||
    functionSymbol.size !== 8 ||
    functionSymbol.type !== "FUNC" ||
    functionSymbol.binding !== "GLOBAL" ||
    functionSymbol.visibility !== "DEFAULT" ||
    Number.parseInt(functionSymbol.sectionIndex, 10) !== section.index ||
    sectionsByIndex.get(section.index)?.name !== sectionName
  ) {
    throw new Error(`Invalid base function symbol for ${name}`);
  }

  const opaqueSymbols = symbolsByName.get(identity) ?? [];
  if (opaqueSymbols.length !== 1) {
    throw new Error(`Expected one base opaque symbol for ${identity}`);
  }
  const opaqueSymbol = opaqueSymbols[0];
  if (
    opaqueSymbol.value !== 0 ||
    opaqueSymbol.size !== 0 ||
    opaqueSymbol.type !== "NOTYPE" ||
    opaqueSymbol.binding !== "GLOBAL" ||
    opaqueSymbol.visibility !== "DEFAULT" ||
    opaqueSymbol.sectionIndex !== "UND"
  ) {
    throw new Error(`Invalid base opaque symbol for ${identity}`);
  }

  const relocations = relocationsBySection.get(sectionName) ?? [];
  if (
    relocations.length !== 1 ||
    relocations[0].offset !== 8 ||
    relocations[0].type !== "R_ARM_ABS32" ||
    relocations[0].symbol !== identity
  ) {
    throw new Error(`Invalid base relocation for ${name}`);
  }
}

console.log(
  `Validated ${actual.size} ARM opaque address returns and their base relocations.`
);
