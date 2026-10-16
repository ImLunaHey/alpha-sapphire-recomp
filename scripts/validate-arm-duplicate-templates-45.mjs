import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-45.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 45: ${message}`);
}

const templateName = "polymorphic_record_vector_insert";
const expectedTemplate = {
  bodySize: 580, instructionCount: 145, count: 2, internalLabels: 13, calls: 2, poolSlots: 3,
};
const callContract = [
  { offset: 224, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 544, kind: "R_ARM_CALL", symbol: "func_00160F9C" },
];
const slotContract = [
  { offset: 580, loadOffset: 24, role: "signed_divide_by_24_identity" },
  { offset: 584, loadOffset: 28, role: "primary_dispatch_identity" },
  { offset: 588, loadOffset: 36, role: "secondary_dispatch_identity" },
];
const literalIdentities = {
  divide_by_24: { symbol: "arm_duplicate_templates_45_divide_by_24_identity", class: "arithmetic-scalar" },
  primary_0056FDB0: { symbol: "func_0056FDB0_primary_dispatch_identity", class: "dispatch-identity" },
  secondary_0056FDB0: { symbol: "func_0056FDB0_secondary_dispatch_identity", class: "dispatch-identity" },
  primary_00570000: { symbol: "func_00570000_primary_dispatch_identity", class: "dispatch-identity" },
  secondary_00570000: { symbol: "func_00570000_secondary_dispatch_identity", class: "dispatch-identity" },
};
const functions = [
  {
    name: "func_0056FDB0", template: templateName,
    literals: [
      { offset: 580, loadOffset: 24, identity: "divide_by_24" },
      { offset: 584, loadOffset: 28, identity: "primary_0056FDB0" },
      { offset: 588, loadOffset: 36, identity: "secondary_0056FDB0" },
    ],
  },
  {
    name: "func_00570000", template: templateName,
    literals: [
      { offset: 580, loadOffset: 24, identity: "divide_by_24" },
      { offset: 584, loadOffset: 28, identity: "primary_00570000" },
      { offset: 588, loadOffset: 36, identity: "secondary_00570000" },
    ],
  },
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 1160,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_45.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract),
  "unexpected literal-slot contract");
assert(JSON.stringify(manifest.literalIdentities) === JSON.stringify(literalIdentities),
  "unexpected literal identity mapping");
assert(JSON.stringify(manifest.functions) === JSON.stringify(functions), "unexpected function mapping");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/)
  .filter((line) => line.startsWith("    polymorphic_record_vector_insert func_"));
assert(JSON.stringify(invocations) === JSON.stringify([
  "    polymorphic_record_vector_insert func_0056FDB0, func_0056FDB0_primary_dispatch_identity, func_0056FDB0_secondary_dispatch_identity",
  "    polymorphic_record_vector_insert func_00570000, func_00570000_primary_dispatch_identity, func_00570000_secondary_dispatch_identity",
]), "unexpected macro invocation order");
assert(JSON.stringify(source.match(/^\.Ldt45_[0-9a-f]{4}\\@\:$/gm) ?? []) === JSON.stringify([
  ".Ldt45_0084\\@:", ".Ldt45_0090\\@:", ".Ldt45_00b0\\@:", ".Ldt45_00c4\\@:",
  ".Ldt45_00f4\\@:", ".Ldt45_0124\\@:", ".Ldt45_0134\\@:", ".Ldt45_0178\\@:",
  ".Ldt45_01a4\\@:", ".Ldt45_01d4\\@:", ".Ldt45_01e4\\@:", ".Ldt45_0200\\@:",
  ".Ldt45_021c\\@:",
]), "template must define the 13 approved macro-local control labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 2 &&
  (source.match(/^    blx\b/gm) ?? []).length === 1,
"template must contain the approved two direct calls and one indirect call");
assert(JSON.stringify(source.match(/^    \.word .+$/gm) ?? []) === JSON.stringify([
  "    .word arm_duplicate_templates_45_divide_by_24_identity",
  "    .word \\primary_dispatch",
  "    .word \\secondary_dispatch",
]), "template must contain exactly the approved three symbolic pool slots");
assert(!/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or unapproved data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/)
  .filter((line) => /^    [a-z]/.test(line)).length === 145,
"template must contain exactly 145 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "00e8821daf11d80ac811cb9d97bed2a25ddff8055fbbac6caf997f1c9cc489ef",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 45 manifest and deterministic source mapping");
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
    flags: data.readUInt32LE(offset + 8), offset: data.readUInt32LE(offset + 16), size: data.readUInt32LE(offset + 20),
    link: data.readUInt32LE(offset + 24), info: data.readUInt32LE(offset + 28),
    alignment: data.readUInt32LE(offset + 32), entrySize: data.readUInt32LE(offset + 36) });
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
for (const name of new Set(callContract.map(({ symbol }) => symbol))) {
  const identity = symbolsByName.get(name);
  assert(identity, `missing direct-call identity ${name}`);
  if (process.argv[3] === "--target") {
    assert(identity.sectionIndex !== 0, `target call identity ${name} must be defined in the target object`);
  } else if (identity.sectionIndex === 0) {
    assert(identity.size === 0, `undefined base call identity ${name} must have zero size`);
  }
}
for (const { symbol: name } of Object.values(literalIdentities)) {
  const identity = symbolsByName.get(name);
  assert(identity, `missing literal-slot identity ${name}`);
  if (identity.sectionIndex === 0) {
    assert(identity.size === 0, `undefined literal-slot identity ${name} must have zero size`);
  }
}

let normalizedBodyReference;
let normalizedExtentReference;
const seenSlotSymbols = [];
for (const entry of functions) {
  const symbol = symbolsByName.get(entry.name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 580, `${entry.name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${entry.name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 592, `${entry.name} has an unexpected executable section layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${entry.name} must have one relocation section`);
  const relocations = relocationSections[0];
  assert(relocations.type === 9 && relocations.entrySize === 8 && relocations.size === 40,
    `${entry.name} must have exactly five REL relocations`);
  const expectedRelocations = [
    ...callContract.map((contract) => ({ ...contract, type: 28 })),
    ...entry.literals.map(({ offset, identity }) => ({
      offset, symbol: literalIdentities[identity].symbol, type: 2,
    })),
  ].sort((left, right) => left.offset - right.offset);
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocations.offset + index * relocations.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const expected = expectedRelocations[index];
    const relocationSymbol = symbols[relocationInfo >>> 8];
    assert(relocationOffset === expected.offset && (relocationInfo & 0xff) === expected.type &&
      relocationSymbol === symbolsByName.get(expected.symbol),
    `${entry.name} has an unexpected symbolic relocation at ${expected.offset}`);
    if (expected.type === 2) seenSlotSymbols.push(relocationSymbol.name);
  }
  const extent = Buffer.from(data.subarray(section.offset, section.offset + section.size));
  const normalizedBody = Buffer.from(extent.subarray(0, symbol.size));
  for (const { offset } of callContract) normalizedBody.fill(0, offset, offset + 4);
  if (normalizedBodyReference) {
    assert(normalizedBody.equals(normalizedBodyReference),
      `${entry.name} differs from the direct-call-normalized complete template body`);
  } else normalizedBodyReference = normalizedBody;
  for (const { offset } of expectedRelocations) extent.fill(0, offset, offset + 4);
  if (normalizedExtentReference) {
    assert(extent.equals(normalizedExtentReference),
      `${entry.name} differs from the direct-call-and-slot-normalized body-plus-pool extent`);
  } else normalizedExtentReference = extent;
}

assert(seenSlotSymbols[0] === seenSlotSymbols[3],
  "signed divide-by-24 slots must share one symbolic identity");
assert(new Set([seenSlotSymbols[1], seenSlotSymbols[2], seenSlotSymbols[4], seenSlotSymbols[5]]).size === 4,
  "the four dispatch slots must use pairwise-distinct symbolic identities");
assert(!seenSlotSymbols.slice(1, 3).includes(seenSlotSymbols[0]) &&
  !seenSlotSymbols.slice(4).includes(seenSlotSymbols[0]),
"the arithmetic identity must differ from every dispatch identity");

console.log("Validated 2 ARM duplicate-template 45 functions (1,160 body bytes, 290 instructions, 4 direct-call relocations, 6 symbolic pool slots)");
