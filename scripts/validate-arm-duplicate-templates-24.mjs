import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const objectPath = process.argv[2];
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-24.json"), "utf8"));

const expectedTemplates = new Map([
  ["relative_word_16", { bodySize: 12, count: 4, literalCount: 0 }],
  ["relative_word_4", { bodySize: 12, count: 3, literalCount: 0 }],
  ["relative_word_12", { bodySize: 12, count: 3, literalCount: 0 }],
  ["low_two_bit_update", { bodySize: 24, count: 2, literalCount: 0 }],
  ["tag_4_byte_payload", { bodySize: 24, count: 2, literalCount: 0 }],
  ["tag_3_word_payload", { bodySize: 24, count: 2, literalCount: 0 }],
  ["tag_2_halfword_payload", { bodySize: 24, count: 2, literalCount: 0 }],
  ["clear_words_56_64", { bodySize: 20, count: 2, literalCount: 0 }],
  ["clear_words_0_8", { bodySize: 20, count: 2, literalCount: 0 }],
  ["explicit_noop_return", { bodySize: 8, count: 4, literalCount: 0 }],
  ["word_4_boolean", { bodySize: 16, count: 2, literalCount: 0 }],
  ["word_halfword_clear", { bodySize: 16, count: 2, literalCount: 0 }],
  ["nested_halfword_clear", { bodySize: 16, count: 2, literalCount: 0 }],
  ["invalid_word_28", { bodySize: 12, count: 2, literalCount: 0 }],
  ["two_word_integer_copy", { bodySize: 12, count: 2, literalCount: 0 }],
  ["clear_word_8", { bodySize: 12, count: 2, literalCount: 0 }],
  ["four_single_vfp_copy", { bodySize: 12, count: 2, literalCount: 0 }],
  ["nested_two_word_store", { bodySize: 12, count: 2, literalCount: 0 }],
]);
const expectedNames = [
  "func_001769CC", "func_00176A00", "func_004BFB50", "func_004BFB5C",
  "func_0016B050", "func_00176C7C", "func_004BEE74",
  "func_0017CFB4", "func_004C1F50", "func_004C22D8",
  "func_004108BC", "func_00462B9C", "func_0053FAA4", "func_0053FC70",
  "func_0053FABC", "func_0053FC88", "func_0053FAD4", "func_0053FCA0",
  "func_0014AE44", "func_00331294", "func_002B81F0", "func_004F2C0C",
  "func_002AEAE8", "func_002C8878", "func_003388E8", "func_00339B44",
  "func_0013E6F4", "func_0016BC74", "func_002C2350", "func_004F2C30",
  "func_003E80E8", "func_003E8290", "func_0015E42C", "func_0015E468",
  "func_0017358C", "func_002ADE84", "func_002F9224", "func_0041B3CC",
  "func_003CC4C4", "func_003CC4D0", "func_00410A3C", "func_00438BEC",
];

if (manifest.version !== 1 || manifest.mode !== "arm" || manifest.expectedBodyBytes !== 640 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 42 ||
    Object.keys(manifest.templates ?? {}).length !== expectedTemplates.size ||
    JSON.stringify(manifest.functions.map(({ name }) => name)) !== JSON.stringify(expectedNames)) {
  throw new Error("Unexpected duplicate-template 24 manifest header or function order");
}

const functions = new Map();
const templateFunctions = new Map([...expectedTemplates].map(([name]) => [name, []]));
let bodyBytes = 0;
for (const entry of manifest.functions) {
  const expected = expectedTemplates.get(entry?.template);
  const definition = manifest.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || functions.has(entry.name) ||
      expected === undefined || JSON.stringify(definition) !== JSON.stringify(expected) ||
      !Array.isArray(entry.literals) || entry.literals.length !== 0) {
    throw new Error("Invalid or duplicate duplicate-template 24 manifest entry");
  }
  functions.set(entry.name, entry);
  templateFunctions.get(entry.template).push(entry);
  bodyBytes += expected.bodySize;
}
for (const [name, expected] of expectedTemplates) {
  if (templateFunctions.get(name).length !== expected.count) {
    throw new Error(`Unexpected ${name} cardinality`);
  }
}
if (bodyBytes !== 640) throw new Error("Unexpected duplicate-template 24 body-byte total");

const source = readFileSync(join(root, "src/main/arm_duplicate_templates_24.S"), "utf8");
const sourceLines = new Set(source.split(/\r?\n/));
for (const entry of manifest.functions) {
  const invocation = `${entry.template} ${entry.name}`;
  if (!sourceLines.has(invocation)) {
    throw new Error(`Missing deterministic source invocation: ${invocation}`);
  }
}
if (!objectPath) {
  console.log("Validated duplicate-template 24 manifest and deterministic source mapping");
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
    if (section.name !== `.text.${entry.name}` || section.size !== expected.bodySize) {
      throw new Error(`${entry.name} has an unexpected section or body layout`);
    }
    const relocations = sections.filter((candidate) => candidate.type === 9 && candidate.info === section.index);
    if (relocations.length !== 0) throw new Error(`${entry.name} unexpectedly has relocations`);
    const body = data.subarray(section.offset, section.offset + expected.bodySize);
    if (referenceBody === undefined) referenceBody = body;
    else if (!body.equals(referenceBody)) throw new Error(`${entry.name} does not match its template body`);
  }
}

console.log("Validated 42 ARM duplicate-template 24 functions (640 body bytes, no literals or relocations)");
