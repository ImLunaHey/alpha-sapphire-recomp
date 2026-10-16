import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-31.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 31: ${message}`);
}

const templateName = "fixed_point_complex_transform_64";
const expectedTemplate = { bodySize: 1416, instructionCount: 354, count: 2, internalLabels: 12, calls: 0 };
const slotContract = [
  { identity: "q15_coefficients", bodyOffset: -1288, uses: [124, 216, 264, 292, 876, 1148] },
  { identity: "permutation_indices", bodyOffset: -1280, uses: [56, 1300] },
];
const literalIdentities = {
  first_transform_q15_coefficients: {
    symbol: "transform31_first_q15_coefficients", segment: "rodata", alignment: 4,
  },
  first_transform_permutation_indices: {
    symbol: "transform31_first_permutation_indices", segment: "rodata", alignment: 4,
  },
  second_transform_q15_coefficients: {
    symbol: "transform31_second_q15_coefficients", segment: "rodata", alignment: 4,
  },
  second_transform_permutation_indices: {
    symbol: "transform31_second_permutation_indices", segment: "rodata", alignment: 4,
  },
};
const expectedFunctions = [
  ["func_001AB5F4", "first_transform_q15_coefficients", "first_transform_permutation_indices"],
  ["func_001AD528", "second_transform_q15_coefficients", "second_transform_permutation_indices"],
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 2832,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_31.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract),
  "unexpected negative-PC slot/use contract");
assert(JSON.stringify(manifest.literalIdentities) === JSON.stringify(literalIdentities),
  "unexpected read-only identity contract");
assert(JSON.stringify(manifest.functions.map(({ name, coefficientIdentity, permutationIdentity }) =>
  [name, coefficientIdentity, permutationIdentity])) === JSON.stringify(expectedFunctions) &&
  manifest.functions.every((entry) =>
    Object.keys(entry).sort().join(",") === "coefficientIdentity,name,permutationIdentity,template" &&
    entry.template === templateName), "unexpected function order, template mapping, or table identities");
assert(new Set(Object.values(literalIdentities).map(({ symbol }) => symbol)).size === 4,
  "all four table identities must remain distinct");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 2832,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) => line.startsWith("FIXED_POINT_COMPLEX_TRANSFORM_64 "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, coefficients, permutation]) =>
  `FIXED_POINT_COMPLEX_TRANSFORM_64 ${name}, ${literalIdentities[coefficients].symbol}, ${literalIdentities[permutation].symbol}`)),
"unexpected macro invocation order or table identity mapping");
const labels = source.match(/^\.Ldt31_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 12 && new Set(labels).size === 12, "template must define 12 unique macro-local labels");
assert((source.match(/^\s+\.word \\(?:coefficients|permutation)$/gm) ?? []).length === 2 &&
  (source.match(/^\s+\.word 0$/gm) ?? []).length === 1 &&
  !/^\s+\.word (?!\\(?:coefficients|permutation)$|0$)/m.test(source) &&
  !/^\s+blx?\b/m.test(source),
"template must contain only the two symbolic table slots, one neutral neighboring slot, and no calls");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 354,
  "template must contain exactly 354 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "3f5bba20a0e2f3dd12bc1043eb4fd80a54133d02520729bf6e43156186e4bd1f",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 31 manifest and deterministic source mapping");
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

let reference;
for (const [name, coefficientIdentity, permutationIdentity] of expectedFunctions) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 1288 && symbol.size === 1416, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 2704,
  `${name} has an unexpected section, alignment, pre-body slot layout, or body extent`);
  assert(data.readUInt32LE(section.offset + 4) === 0, `${name} neighboring transform slot must stay neutral`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 16,
    `${name} must have exactly two REL relocations`);
  const expectedRelocations = [
    [0, literalIdentities[coefficientIdentity].symbol],
    [8, literalIdentities[permutationIdentity].symbol],
  ];
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocationSection.offset + index * relocationSection.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    assert(relocationOffset === expectedRelocations[index][0] && (relocationInfo & 0xff) === 2 &&
      relocationSymbol?.name === expectedRelocations[index][1],
    `${name} has an unexpected symbolic table-slot relocation`);
  }
  const body = data.subarray(section.offset + symbol.value, section.offset + symbol.value + symbol.size);
  assert(body.length / 4 === 354, `${name} must contain exactly 354 ARM instructions`);
  const useContract = [
    [56, 1, 1344, -1280], [124, 5, 1420, -1288], [216, 9, 1512, -1288],
    [264, 1, 1560, -1288], [292, 1, 1588, -1288], [876, 14, 2172, -1288],
    [1148, 11, 2444, -1288], [1300, 2, 2588, -1280],
  ];
  for (const [useOffset, register, displacement, slotOffset] of useContract) {
    const word = body.readUInt32LE(useOffset);
    assert(word === ((0xe51f0000 | (register << 12) | displacement) >>> 0),
      `${name} has an unexpected negative PC-relative load at body offset ${useOffset}`);
    assert(useOffset + 8 - displacement === slotOffset,
      `${name} load at body offset ${useOffset} does not resolve to its audited slot`);
  }
  if (reference) assert(body.equals(reference), `${name} differs from the complete template body`);
  else reference = body;
}

console.log("Validated 2 ARM duplicate-template 31 functions (2,832 body bytes, 708 instructions, 4 distinct symbolic read-only identities, no calls)");
