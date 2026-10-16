import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-38.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 38: ${message}`);
}

const templateName = "staged_polymorphic_aggregate_teardown";
const expectedTemplate = {
  bodySize: 828, instructionCount: 207, count: 3, internalLabels: 22, calls: 1, literalCount: 4,
};
const callContract = [{ offset: 20, kind: "R_ARM_CALL", symbol: "func_00312920" }];
const slotContract = [
  { offset: 828, loadOffset: 8, role: "derived_dispatch_identity" },
  { offset: 832, loadOffset: 100, role: "shared_dispatch_identity_1" },
  { offset: 836, loadOffset: 164, role: "shared_dispatch_identity_2" },
  { offset: 840, loadOffset: 328, role: "shared_dispatch_identity_3" },
];
const literalIdentities = {
  derived_002EB58C: { symbol: "func_002EB58C_dispatch_identity", class: "dispatch-identity" },
  derived_002EC008: { symbol: "func_002EC008_dispatch_identity", class: "dispatch-identity" },
  derived_002F9B78: { symbol: "func_002F9B78_dispatch_identity", class: "dispatch-identity" },
  shared_1: { symbol: "arm_duplicate_templates_38_shared_dispatch_identity_1", class: "dispatch-identity" },
  shared_2: { symbol: "arm_duplicate_templates_38_shared_dispatch_identity_2", class: "dispatch-identity" },
  shared_3: { symbol: "arm_duplicate_templates_38_shared_dispatch_identity_3", class: "dispatch-identity" },
};
const expectedFunctions = [
  ["func_002EB58C", "derived_002EB58C"],
  ["func_002EC008", "derived_002EC008"],
  ["func_002F9B78", "derived_002F9B78"],
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 2484,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_38.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract),
  "unexpected literal-slot/load contract");
assert(JSON.stringify(manifest.literalIdentities) === JSON.stringify(literalIdentities),
  "unexpected semantic identity ledger");
assert(Array.isArray(manifest.functions) && manifest.functions.length === 3,
  "unexpected function cardinality");

const expectedLiteralKeys = (derived) => [derived, "shared_1", "shared_2", "shared_3"];
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const [name, derived] = expectedFunctions[index];
  const entry = manifest.functions[index];
  assert(entry && Object.keys(entry).sort().join(",") === "literals,name,template" &&
    entry.name === name && entry.template === templateName && Array.isArray(entry.literals) &&
    entry.literals.length === 4, `invalid mapping for ${name}`);
  assert(JSON.stringify(entry.literals.map(({ offset, loadOffset, identity }) =>
    [offset, loadOffset, identity])) === JSON.stringify(slotContract.map((slot, slotIndex) =>
    [slot.offset, slot.loadOffset, expectedLiteralKeys(derived)[slotIndex]])),
  `invalid literal mapping for ${name}`);
}
const occurrences = new Map(Object.keys(literalIdentities).map((identity) => [identity, 0]));
for (const entry of manifest.functions) {
  for (const literal of entry.literals) {
    assert(literalIdentities[literal.identity] !== undefined, `unknown identity ${literal.identity}`);
    occurrences.set(literal.identity, occurrences.get(literal.identity) + 1);
  }
}
assert([...occurrences].every(([identity, count]) =>
  count === (identity.startsWith("shared_") ? 3 : 1)),
"the twelve literal occurrences must form three singleton and three shared equality classes");
assert(new Set(Object.values(literalIdentities).map(({ symbol }) => symbol)).size === 6,
  "the six semantic identity classes must use distinct symbols");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) =>
  line.startsWith("STAGED_POLYMORPHIC_AGGREGATE_TEARDOWN "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, derived]) =>
  `STAGED_POLYMORPHIC_AGGREGATE_TEARDOWN ${name}, ${literalIdentities[derived].symbol}, ${literalIdentities.shared_1.symbol}, ${literalIdentities.shared_2.symbol}, ${literalIdentities.shared_3.symbol}`)),
"unexpected macro invocation order or semantic identity mapping");
const labels = source.match(/^\.Ldt38_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 22 && new Set(labels).size === 22,
  "template must define 22 unique macro-local control labels");
assert((source.match(/^    bl func_00312920$/gm) ?? []).length === 1 &&
  (source.match(/^    bl\b/gm) ?? []).length === 1 &&
  (source.match(/^    blx\b/gm) ?? []).length === 15,
"template must contain the approved direct and indirect call schedule");
assert(JSON.stringify((source.match(/^    \.word \\(?:derived|shared[123])$/gm) ?? [])) === JSON.stringify([
  "    .word \\derived", "    .word \\shared1", "    .word \\shared2", "    .word \\shared3",
]), "template must contain only the four approved symbolic post-body slots");
assert(!/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or unapproved data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 207,
  "template must contain exactly 207 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "b2bef4d5ce6b152f81a49eb486c9e0aaf9a28a3d7fa65e8b84fc31893fb66abf",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 38 manifest and deterministic source mapping");
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

const loadContract = [
  [8, 812, 828], [100, 724, 832], [164, 664, 836], [328, 504, 840],
];
let reference;
for (const [name] of expectedFunctions) {
  const entry = manifest.functions.find((candidate) => candidate.name === name);
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 828, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 844, `${name} has an unexpected executable section or slot layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 40,
    `${name} must have exactly five REL relocations`);
  const expectedRelocations = [
    [20, 28, "func_00312920"],
    ...entry.literals.map(({ offset, identity }) => [offset, 2, literalIdentities[identity].symbol]),
  ];
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocationSection.offset + index * relocationSection.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    const [expectedOffset, expectedType, expectedSymbol] = expectedRelocations[index];
    assert(relocationOffset === expectedOffset && (relocationInfo & 0xff) === expectedType &&
      relocationSymbol?.name === expectedSymbol, `${name} has an unexpected call or identity relocation`);
    if (expectedType === 2) {
      assert(relocationSymbol?.sectionIndex === 0 && relocationSymbol.size === 0,
        `${name} relocation identity ${expectedSymbol} must remain undefined`);
    }
  }
  const body = data.subarray(section.offset, section.offset + symbol.size);
  for (const [useOffset, displacement, slotOffset] of loadContract) {
    assert(body.readUInt32LE(useOffset) === ((0xe59f0000 | displacement) >>> 0) &&
      useOffset + 8 + displacement === slotOffset,
    `${name} has an unexpected PC-relative literal load at body offset ${useOffset}`);
  }
  if (reference) assert(body.equals(reference), `${name} differs from the complete template body`);
  else reference = body;
}

console.log("Validated 3 ARM duplicate-template 38 functions (2,484 body bytes, 621 instructions, 3 shared and 3 singleton dispatch identities)");
