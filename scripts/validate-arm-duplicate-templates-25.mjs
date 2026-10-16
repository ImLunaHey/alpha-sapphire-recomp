import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const objectPath = process.argv[2];
const manifest = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-25.json"), "utf8"));

const expectedTemplates = new Map([
  ["halfword_merge", { bodySize: 20, count: 3, literalCount: 0 }],
  ["conditional_mutable_word_clear", { bodySize: 24, count: 2, literalCount: 1 }],
  ["descriptor_pair_byte_state_initializer", { bodySize: 24, count: 2, literalCount: 1 }],
  ["shared_type_two_word_initializer", { bodySize: 20, count: 2, literalCount: 1 }],
  ["unsigned_inclusive_bound_predicate", { bodySize: 20, count: 2, literalCount: 1 }],
  ["packed_selector_stride_pointer", { bodySize: 20, count: 2, literalCount: 0 }],
  ["indirect_dispatch_tail_transfer", { bodySize: 12, count: 2, literalCount: 1 }],
]);
const expectedNames = [
  "func_001B0468", "func_001B6A68", "func_001BD068",
  "func_00153B54", "func_00154014", "func_00411040", "func_00411270",
  "func_00240AD8", "func_0029F57C", "func_002C2CD4", "func_002C2EB8",
  "func_003279C8", "func_004BE69C", "func_001D1EB0", "func_001E2C0C",
];
const expectedMappings = [
  ["halfword_merge", []],
  ["halfword_merge", []],
  ["halfword_merge", []],
  ["conditional_mutable_word_clear", ["mutableStateA"]],
  ["conditional_mutable_word_clear", ["mutableStateB"]],
  ["descriptor_pair_byte_state_initializer", ["descriptorBaseA"]],
  ["descriptor_pair_byte_state_initializer", ["descriptorBaseB"]],
  ["shared_type_two_word_initializer", ["sharedType"]],
  ["shared_type_two_word_initializer", ["sharedType"]],
  ["unsigned_inclusive_bound_predicate", ["unsignedBoundA"]],
  ["unsigned_inclusive_bound_predicate", ["unsignedBoundB"]],
  ["packed_selector_stride_pointer", []],
  ["packed_selector_stride_pointer", []],
  ["indirect_dispatch_tail_transfer", ["dispatchOwnerA"]],
  ["indirect_dispatch_tail_transfer", ["dispatchOwnerB"]],
];
const expectedIdentities = {
  mutableStateA: { symbol: "duplicate_template_25_mutable_state_a", class: "data-address" },
  mutableStateB: { symbol: "duplicate_template_25_mutable_state_b", class: "data-address" },
  descriptorBaseA: { symbol: "duplicate_template_25_descriptor_base_a", class: "rodata-address" },
  descriptorBaseB: { symbol: "duplicate_template_25_descriptor_base_b", class: "rodata-address" },
  sharedType: { symbol: "duplicate_template_25_shared_type", class: "rodata-address" },
  unsignedBoundA: { symbol: "duplicate_template_25_unsigned_bound_a", class: "unsigned-scalar" },
  unsignedBoundB: { symbol: "duplicate_template_25_unsigned_bound_b", class: "unsigned-scalar" },
  dispatchOwnerA: { symbol: "duplicate_template_25_dispatch_owner_a", class: "data-address" },
  dispatchOwnerB: { symbol: "duplicate_template_25_dispatch_owner_b", class: "data-address" },
};

if (manifest.version !== 1 || manifest.mode !== "arm" || manifest.expectedBodyBytes !== 300 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 15 ||
    JSON.stringify(manifest.templates) !== JSON.stringify(Object.fromEntries(expectedTemplates)) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(expectedIdentities) ||
    JSON.stringify(manifest.functions.map(({ name }) => name)) !== JSON.stringify(expectedNames) ||
    JSON.stringify(manifest.functions.map((entry) =>
      [entry.template, entry.literals?.map(({ identity }) => identity)])) !== JSON.stringify(expectedMappings)) {
  throw new Error("Unexpected duplicate-template 25 manifest header or function order");
}

const functions = new Map();
const templateFunctions = new Map([...expectedTemplates].map(([name]) => [name, []]));
const identityOccurrences = new Map(Object.keys(expectedIdentities).map((name) => [name, 0]));
let bodyBytes = 0;
let literalSlots = 0;
for (const entry of manifest.functions) {
  const expected = expectedTemplates.get(entry?.template);
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || functions.has(entry.name) ||
      expected === undefined || !Array.isArray(entry.literals) ||
      entry.literals.length !== expected.literalCount || entry.literals.some((literal, index) =>
        literal === null || typeof literal !== "object" ||
        Object.keys(literal).sort().join(",") !== "identity,offset" ||
        literal.offset !== expected.bodySize + index * 4 ||
        expectedIdentities[literal.identity] === undefined)) {
    throw new Error("Invalid or duplicate duplicate-template 25 manifest entry");
  }
  functions.set(entry.name, entry);
  templateFunctions.get(entry.template).push(entry);
  for (const literal of entry.literals) {
    identityOccurrences.set(literal.identity, identityOccurrences.get(literal.identity) + 1);
  }
  bodyBytes += expected.bodySize;
  literalSlots += entry.literals.length;
}
for (const [name, expected] of expectedTemplates) {
  if (templateFunctions.get(name).length !== expected.count) {
    throw new Error(`Unexpected ${name} cardinality`);
  }
}
if (bodyBytes !== 300 || literalSlots !== 10 || identityOccurrences.size !== 9 ||
    identityOccurrences.get("sharedType") !== 2 ||
    [...identityOccurrences].some(([name, count]) => count !== (name === "sharedType" ? 2 : 1)) ||
    manifest.functions[7].literals[0].identity !== "sharedType" ||
    manifest.functions[8].literals[0].identity !== "sharedType") {
  throw new Error("Unexpected duplicate-template 25 totals or literal equality classes");
}

const source = readFileSync(join(root, "src/main/arm_duplicate_templates_25.S"), "utf8");
const sourceLines = new Set(source.split(/\r?\n/));
for (const entry of manifest.functions) {
  const argumentsList = [entry.name, ...entry.literals.map(({ identity }) =>
    expectedIdentities[identity].symbol)];
  const invocation = `${entry.template} ${argumentsList.join(", ")}`;
  if (!sourceLines.has(invocation)) {
    throw new Error(`Missing deterministic source invocation: ${invocation}`);
  }
}
if (!objectPath) {
  console.log("Validated duplicate-template 25 manifest and deterministic source mapping");
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
      symbol: expectedIdentities[literal.identity].symbol,
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

console.log("Validated 15 ARM duplicate-template 25 functions (300 body bytes, 10 slots in 9 semantic identity classes)");
