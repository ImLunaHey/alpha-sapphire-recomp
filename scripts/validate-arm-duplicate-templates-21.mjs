import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const objectPath = process.argv[2];

const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-21.json"), "utf8"));
const expectedTemplates = new Map([
  ["typed_two_word_initializer", { bodySize: 16, count: 6, literalCount: 1 }],
  ["two_tag_tail_dispatcher", { bodySize: 48, count: 2, literalCount: 1 }],
  ["tagged_relative_entry_lookup", { bodySize: 48, count: 2, literalCount: 1 }],
  ["bounded_halfword_span_export", { bodySize: 44, count: 2, literalCount: 1 }],
  ["paired_store_zero_initializer", { bodySize: 16, count: 5, literalCount: 0 }],
  ["packed_two_axis_offset", { bodySize: 40, count: 2, literalCount: 0 }],
]);
const expectedHandlers = new Map([
  ["func_0030E398", ["func_002F81EC", "func_0031001C"]],
  ["func_0030F074", ["dispatch_high_bit_func_0030F074", "func_00311648"]],
]);

if (manifest.version !== 1 || manifest.mode !== "arm" || manifest.expectedBodyBytes !== 536 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 19 ||
    Object.keys(manifest.templates ?? {}).length !== expectedTemplates.size ||
    Object.keys(manifest.literalIdentities ?? {}).length !== 11) {
  throw new Error("Unexpected duplicate-template 21 manifest header");
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
        typeof manifest.literalIdentities[literal.identity] !== "string")) {
    throw new Error("Invalid or duplicate duplicate-template 21 manifest entry");
  }
  const expectedEntryHandlers = expectedHandlers.get(entry.name);
  if (expectedEntryHandlers === undefined ? entry.handlers !== undefined :
      JSON.stringify(entry.handlers) !== JSON.stringify(expectedEntryHandlers)) {
    throw new Error(`Invalid named handler identities for ${entry.name}`);
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
if (bodyBytes !== 536 || literalSlots !== 12) {
  throw new Error("Unexpected duplicate-template 21 byte or literal-slot total");
}

const typeEntries = templateFunctions.get("typed_two_word_initializer");
const typeIdentities = typeEntries.map((entry) => entry.literals[0].identity);
if (typeIdentities[0] !== typeIdentities[1] || new Set(typeIdentities).size !== 5) {
  throw new Error("Typed initializer identities must form the specified five equality classes");
}
for (const template of ["two_tag_tail_dispatcher", "tagged_relative_entry_lookup", "bounded_halfword_span_export"]) {
  if (new Set(templateFunctions.get(template).map((entry) => entry.literals[0].identity)).size !== 2) {
    throw new Error(`${template} identities must be distinct`);
  }
}

const source = readFileSync(join(root, "src/main/arm_duplicate_templates_21.S"), "utf8");
for (const entry of manifest.functions) {
  const argumentsList = [entry.name, ...entry.literals.map((literal) =>
    manifest.literalIdentities[literal.identity])];
  const invocation = `${entry.template} ${argumentsList.join(", ")}`;
  if (!source.split(/\r?\n/).includes(invocation)) {
    throw new Error(`Missing deterministic source invocation: ${invocation}`);
  }
}
if (!objectPath) {
  console.log("Validated duplicate-template 21 manifest and deterministic source mapping");
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
    const symbol = symbols[info >>> 8];
    relocations.push({ offset: data.readUInt32LE(offset), type: info & 0xff, symbol: symbol?.name });
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

console.log("Validated 19 ARM duplicate-template 21 functions (536 body bytes, 12 named identity slots)");
