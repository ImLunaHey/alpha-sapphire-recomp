import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const objectPath = process.argv[2];
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-23.json"), "utf8"));

const expectedTemplates = new Map([
  ["single_type_identity_installer", { bodySize: 12, count: 12, literalCount: 1 }],
  ["typed_four_word_clear_initializer", { bodySize: 32, count: 2, literalCount: 1 }],
  ["typed_zero_invalid_pair_initializer", { bodySize: 32, count: 2, literalCount: 1 }],
  ["tagged_relative_pointer_resolver", { bodySize: 28, count: 2, literalCount: 0 }],
  ["single_word_zero_initializer", { bodySize: 12, count: 4, literalCount: 0 }],
  ["three_word_trailing_byte_zero_initializer", { bodySize: 24, count: 2, literalCount: 0 }],
]);
const expectedNames = [
  "func_0010ACEC", "func_00163B70", "func_00163C20", "func_001666DC",
  "func_00203888", "func_0024FB08", "func_00250468", "func_0026D5D4",
  "func_002AEF8C", "func_0032ADB0", "func_003312BC", "func_0042D510",
  "func_002C69FC", "func_002C8850", "func_00375814", "func_0037A0DC",
  "func_004BF8F4", "func_004BFAB4", "func_0011EB78", "func_00279DD0",
  "func_00370764", "func_00417610", "func_00134384", "func_002013A4",
];
const expectedIdentityFunctions = expectedNames.slice(0, 16);
const expectedLiteralIdentities = Object.fromEntries(expectedIdentityFunctions.map((name) => [
  `type${name.slice(5)}`,
  `duplicate_template_23_type_${name}`,
]));

if (manifest.version !== 1 || manifest.mode !== "arm" || manifest.expectedBodyBytes !== 424 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 24 ||
    Object.keys(manifest.templates ?? {}).length !== expectedTemplates.size ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(expectedLiteralIdentities) ||
    JSON.stringify(manifest.functions.map(({ name }) => name)) !== JSON.stringify(expectedNames)) {
  throw new Error("Unexpected duplicate-template 23 manifest header or function order");
}

const functions = new Map();
const templateFunctions = new Map([...expectedTemplates].map(([name]) => [name, []]));
let bodyBytes = 0;
let literalSlots = 0;
for (const entry of manifest.functions) {
  const expected = expectedTemplates.get(entry?.template);
  const definition = manifest.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      functions.has(entry.name) || expected === undefined ||
      JSON.stringify(definition) !== JSON.stringify(expected) || !Array.isArray(entry.literals) ||
      entry.literals.length !== expected.literalCount || entry.literals.some((literal, index) =>
        literal === null || typeof literal !== "object" ||
        literal.offset !== expected.bodySize + index * 4 ||
        typeof manifest.literalIdentities[literal.identity] !== "string") ||
      (entry.literals.length === 1 && entry.literals[0].identity !== `type${entry.name.slice(5)}`)) {
    throw new Error("Invalid or duplicate duplicate-template 23 manifest entry");
  }
  functions.set(entry.name, entry);
  templateFunctions.get(entry.template).push(entry);
  bodyBytes += expected.bodySize;
  literalSlots += entry.literals.length;
}
for (const [name, expected] of expectedTemplates) {
  if (templateFunctions.get(name).length !== expected.count) {
    throw new Error(`Unexpected ${name} cardinality`);
  }
}
const identityKeys = manifest.functions.flatMap((entry) => entry.literals.map(({ identity }) => identity));
const identitySymbols = identityKeys.map((identity) => manifest.literalIdentities[identity]);
if (bodyBytes !== 424 || literalSlots !== 16 || new Set(identityKeys).size !== 16 ||
    new Set(identitySymbols).size !== 16 ||
    identitySymbols.some((symbol) => !/^duplicate_template_23_type_func_[0-9A-F]{8}$/.test(symbol))) {
  throw new Error("Unexpected duplicate-template 23 totals or identity classes");
}

const source = readFileSync(join(root, "src/main/arm_duplicate_templates_23.S"), "utf8");
const sourceLines = new Set(source.split(/\r?\n/));
for (const entry of manifest.functions) {
  const argumentsList = [entry.name, ...entry.literals.map((literal) =>
    manifest.literalIdentities[literal.identity])];
  const invocation = `${entry.template} ${argumentsList.join(", ")}`;
  if (!sourceLines.has(invocation)) {
    throw new Error(`Missing deterministic source invocation: ${invocation}`);
  }
}
if (!objectPath) {
  console.log("Validated duplicate-template 23 manifest and deterministic source mapping");
  process.exit(0);
}

const data = readFileSync(objectPath);
if (data.length < 52 || data.toString("ascii", 0, 4) !== "\x7fELF" || data[4] !== 1 || data[5] !== 1) {
  throw new Error("Expected a little-endian ELF32 base object");
}
const sectionOffset = data.readUInt32LE(32);
const sectionEntrySize = data.readUInt16LE(46);
const sectionCount = data.readUInt16LE(48);
const sectionNameIndex = data.readUInt16LE(50);
if (sectionEntrySize !== 40 || sectionOffset + sectionEntrySize * sectionCount > data.length ||
    sectionNameIndex >= sectionCount) {
  throw new Error("Invalid ELF section table");
}
const sections = [];
for (let index = 0; index < sectionCount; index++) {
  const offset = sectionOffset + index * sectionEntrySize;
  sections.push({
    index,
    nameOffset: data.readUInt32LE(offset),
    type: data.readUInt32LE(offset + 4),
    offset: data.readUInt32LE(offset + 16),
    size: data.readUInt32LE(offset + 20),
    link: data.readUInt32LE(offset + 24),
    info: data.readUInt32LE(offset + 28),
    entrySize: data.readUInt32LE(offset + 36),
  });
}
const readString = (section, offset) => {
  const start = section.offset + offset;
  const end = data.indexOf(0, start);
  if (start < section.offset || end < start || end > section.offset + section.size) {
    throw new Error("Invalid ELF string table reference");
  }
  return data.toString("utf8", start, end);
};
const sectionNames = sections[sectionNameIndex];
for (const section of sections) section.name = readString(sectionNames, section.nameOffset);

const symbolTable = sections.find((section) => section.type === 2);
if (!symbolTable || symbolTable.entrySize !== 16 || symbolTable.link >= sections.length) {
  throw new Error("Missing ELF symbol table");
}
const symbolStrings = sections[symbolTable.link];
const symbols = [];
for (let cursor = 0; cursor < symbolTable.size; cursor += symbolTable.entrySize) {
  const offset = symbolTable.offset + cursor;
  symbols.push({
    name: readString(symbolStrings, data.readUInt32LE(offset)),
    value: data.readUInt32LE(offset + 4),
    size: data.readUInt32LE(offset + 8),
    info: data[offset + 12],
    sectionIndex: data.readUInt16LE(offset + 14),
  });
}
const symbolsByName = new Map(symbols.filter((symbol) => symbol.name).map((symbol) => [symbol.name, symbol]));
const relocationsBySection = new Map();
for (const relocationSection of sections.filter((section) => section.type === 9)) {
  if (relocationSection.entrySize !== 8 || relocationSection.link !== symbolTable.index ||
      relocationSection.info >= sections.length) {
    throw new Error("Invalid ELF relocation section");
  }
  const relocations = [];
  for (let cursor = 0; cursor < relocationSection.size; cursor += relocationSection.entrySize) {
    const offset = relocationSection.offset + cursor;
    const info = data.readUInt32LE(offset + 4);
    relocations.push({
      offset: data.readUInt32LE(offset),
      type: info & 0xff,
      symbol: symbols[info >>> 8]?.name,
    });
  }
  relocationsBySection.set(relocationSection.info, relocations);
}

for (const [template, entries] of templateFunctions) {
  const expected = expectedTemplates.get(template);
  let referenceBody;
  for (const entry of entries) {
    const symbol = symbolsByName.get(entry.name);
    if (!symbol || (symbol.info & 0xf) !== 2 || (symbol.info >>> 4) !== 1 || symbol.value !== 0 ||
        symbol.size !== expected.bodySize || symbol.sectionIndex >= sections.length) {
      throw new Error(`${entry.name} is not the expected global ARM function symbol`);
    }
    const section = sections[symbol.sectionIndex];
    if (section.name !== `.text.${entry.name}` ||
        section.size !== expected.bodySize + expected.literalCount * 4) {
      throw new Error(`${entry.name} has an unexpected section or post-body layout`);
    }
    const body = data.subarray(section.offset, section.offset + expected.bodySize);
    if (referenceBody === undefined) referenceBody = body;
    else if (!body.equals(referenceBody)) throw new Error(`${entry.name} does not match its template body`);

    const expectedRelocations = entry.literals.map((literal) => ({
      offset: literal.offset,
      type: 2,
      symbol: manifest.literalIdentities[literal.identity],
    }));
    const relocations = relocationsBySection.get(section.index) ?? [];
    if (JSON.stringify(relocations) !== JSON.stringify(expectedRelocations)) {
      throw new Error(`${entry.name} has unexpected identity relocations`);
    }
    for (const relocation of expectedRelocations) {
      const identitySymbol = symbolsByName.get(relocation.symbol);
      if (!identitySymbol || identitySymbol.sectionIndex !== 0 || identitySymbol.size !== 0) {
        throw new Error(`${entry.name} identity ${relocation.symbol} is not a named undefined symbol`);
      }
    }
  }
}

console.log("Validated 24 ARM duplicate-template 23 functions (424 body bytes, 16 distinct named identity slots)");
