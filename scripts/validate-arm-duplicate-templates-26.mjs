import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-26.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 26: ${message}`);
}

const expectedTemplates = {
  signed_code_normalize: { bodySize: 60, count: 3, branchOffset: 56, branchKind: "tail-transfer", relocationKind: "R_ARM_JUMP24" },
  table_signed_code_dispatch: { bodySize: 52, count: 3, branchOffset: 32, branchKind: "conditional-link", relocationKind: "R_ARM_JUMP24" },
};
const expectedFunctions = [
  ["func_001AE6D0", "table_signed_code_dispatch", "func_001B0468", "decodeTablesA"],
  ["func_001B047C", "signed_code_normalize", "func_001B0468", undefined],
  ["func_001B4CD0", "table_signed_code_dispatch", "func_001B6A68", "decodeTablesB"],
  ["func_001B6A7C", "signed_code_normalize", "func_001B6A68", undefined],
  ["func_001BB2D0", "table_signed_code_dispatch", "func_001BD068", "decodeTablesC"],
  ["func_001BD07C", "signed_code_normalize", "func_001BD068", undefined],
];
const expectedBlockSymbols = [
  "duplicate_template_26_decode_tables_a",
  "duplicate_template_26_decode_tables_b",
  "duplicate_template_26_decode_tables_c",
];
const expectedViewLayout = [
  ["selector", -332, 64, "duplicate_template_26_selector_contents"],
  ["wordDisplacements", -268, undefined, "duplicate_template_26_word_displacement_contents"],
  ["shiftWidths", -228, undefined, "duplicate_template_26_shift_width_contents"],
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 336,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_26.S",
  "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify(expectedTemplates),
  "unexpected template definitions");
assert(Array.isArray(manifest.functions) && manifest.functions.length === 6,
  "manifest must describe six functions");
assert(JSON.stringify(manifest.functions.map((entry) =>
  [entry.name, entry.template, entry.branchTarget, entry.tableBlock])) === JSON.stringify(expectedFunctions),
  "unexpected function order or symbolic mapping");
assert(manifest.functions.reduce((total, entry) => total + manifest.templates[entry.template].bodySize, 0) === 336,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const blocks = Object.entries(manifest.tableBlocks ?? {});
assert(blocks.length === 3 && JSON.stringify(blocks.map(([name]) => name)) ===
  JSON.stringify(["decodeTablesA", "decodeTablesB", "decodeTablesC"]),
"unexpected table-block identities");
for (let index = 0; index < blocks.length; index += 1) {
  const [, block] = blocks[index];
  assert(block.symbol === expectedBlockSymbols[index] && block.alignment === 4 &&
    block.contentEqualityClass === "duplicate_template_26_decode_table_contents",
  "invalid table-block identity or equality class");
  assert(JSON.stringify(Object.entries(block.views).map(([name, view]) =>
    [name, view.bodyRelativeOffset, view.size, view.contentEqualityClass])) === JSON.stringify(expectedViewLayout),
  `invalid view layout for ${block.symbol}`);
  assert(Object.entries(block.views).every(([name, view]) =>
    view.symbol === `${block.symbol}_${name === "wordDisplacements" ? "word_displacements" :
      name === "shiftWidths" ? "shift_widths" : name}`),
  `invalid view identity for ${block.symbol}`);
}
assert(new Set(blocks.flatMap(([, block]) => [block.symbol, ...Object.values(block.views).map(({ symbol }) => symbol)])).size === 12,
  "table block and view symbols must remain distinct");

const sourceLines = new Set(source.split(/\r?\n/));
for (const entry of manifest.functions) {
  const macro = entry.template === "signed_code_normalize" ? "SIGNED_CODE_NORMALIZE" : "TABLE_SIGNED_CODE_DISPATCH";
  assert(sourceLines.has(`${macro} ${entry.name}, ${entry.branchTarget}`),
    `missing deterministic source invocation for ${entry.name}`);
}
for (const forbidden of blocks.flatMap(([, block]) => [block.symbol, ...Object.values(block.views).map(({ symbol }) => symbol)])) {
  assert(!new RegExp(`\\b${forbidden}\\b`).test(source),
    `PC-derived identity ${forbidden} must not become a source relocation`);
}

if (!process.argv[2]) {
  console.log("Validated duplicate-template 26 manifest and deterministic source mapping");
  process.exit(0);
}

const data = readFileSync(resolve(process.cwd(), process.argv[2]));
assert(data.length >= 52 && data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) &&
  data[4] === 1 && data[5] === 1, "expected a little-endian ELF32 object");
const sectionOffset = data.readUInt32LE(32);
const sectionEntrySize = data.readUInt16LE(46);
const sectionCount = data.readUInt16LE(48);
const sectionNameIndex = data.readUInt16LE(50);
assert(sectionEntrySize >= 40 && sectionOffset + sectionEntrySize * sectionCount <= data.length,
  "invalid ELF section table");
const sections = [];
for (let index = 0; index < sectionCount; index += 1) {
  const offset = sectionOffset + index * sectionEntrySize;
  sections.push({ index, nameOffset: data.readUInt32LE(offset), type: data.readUInt32LE(offset + 4),
    offset: data.readUInt32LE(offset + 16), size: data.readUInt32LE(offset + 20),
    link: data.readUInt32LE(offset + 24), info: data.readUInt32LE(offset + 28),
    entrySize: data.readUInt32LE(offset + 36) });
}
function readString(section, offset) {
  const start = section.offset + offset;
  const end = data.indexOf(0, start);
  assert(start >= section.offset && end >= start && end <= section.offset + section.size,
    "invalid ELF string reference");
  return data.toString("utf8", start, end);
}
const sectionNames = sections[sectionNameIndex];
assert(sectionNames, "missing section-name table");
for (const section of sections) section.name = readString(sectionNames, section.nameOffset);
const symbolTable = sections.find(({ type }) => type === 2);
assert(symbolTable && symbolTable.entrySize >= 16 && symbolTable.link < sections.length,
  "missing ELF symbol table");
const symbolStrings = sections[symbolTable.link];
const symbols = [];
for (let cursor = 0; cursor < symbolTable.size; cursor += symbolTable.entrySize) {
  const offset = symbolTable.offset + cursor;
  symbols.push({ name: readString(symbolStrings, data.readUInt32LE(offset)),
    value: data.readUInt32LE(offset + 4), size: data.readUInt32LE(offset + 8),
    info: data[offset + 12], sectionIndex: data.readUInt16LE(offset + 14) });
}
const symbolsByName = new Map(symbols.filter(({ name }) => name).map((symbol) => [symbol.name, symbol]));
const relocationsBySection = new Map();
for (const relocationSection of sections.filter(({ type }) => type === 9)) {
  assert(relocationSection.entrySize === 8 && relocationSection.link === symbolTable.index,
    "invalid ELF relocation section");
  const relocations = [];
  for (let cursor = 0; cursor < relocationSection.size; cursor += 8) {
    const offset = relocationSection.offset + cursor;
    const info = data.readUInt32LE(offset + 4);
    relocations.push({ offset: data.readUInt32LE(offset), type: info & 0xff,
      symbol: symbols[info >>> 8]?.name });
  }
  relocationsBySection.set(relocationSection.info, relocations);
}

const bodies = new Map();
for (const entry of manifest.functions) {
  const definition = manifest.templates[entry.template];
  const symbol = symbolsByName.get(entry.name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === definition.bodySize,
  `${entry.name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${entry.name}` && section.size === definition.bodySize,
    `${entry.name} has an unexpected section or a post-body slot`);
  const relocations = relocationsBySection.get(section.index) ?? [];
  const expectedType = 29;
  assert(JSON.stringify(relocations) === JSON.stringify([{
    offset: definition.branchOffset, type: expectedType, symbol: entry.branchTarget,
  }]), `${entry.name} has an unexpected symbolic branch relocation`);
  const body = data.subarray(section.offset, section.offset + section.size);
  const branchWord = body.readUInt32LE(definition.branchOffset);
  const expectedCondition = definition.branchKind === "conditional-link" ? 0xb : 0xe;
  const expectedLink = definition.branchKind === "conditional-link" ? 1 : 0;
  assert((branchWord >>> 28) === expectedCondition && ((branchWord >>> 25) & 0x7) === 0x5 &&
    ((branchWord >>> 24) & 1) === expectedLink,
  `${entry.name} does not preserve its condition and link semantics`);
  const reference = bodies.get(entry.template);
  if (reference) assert(body.equals(reference), `${entry.name} differs from its complete template body`);
  else bodies.set(entry.template, body);
}

console.log("Validated 6 ARM duplicate-template 26 functions (336 body bytes, 6 symbolic branches, no literal slots)");
