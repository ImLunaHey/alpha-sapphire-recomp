import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-32.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 32: ${message}`);
}

const templateName = "inverse_fixed_point_complex_transform_64";
const expectedTemplate = { bodySize: 1276, instructionCount: 319, count: 2, internalLabels: 10, calls: 0 };
const slotContract = [
  { identity: "q15_coefficients", bodyOffset: -12, uses: [424, 1052, 1140, 1188, 1224] },
  { identity: "permutation_and_late_coefficients", bodyOffset: -4, uses: [832, 980] },
  { identity: "reverse_stage_coefficients", bodyOffset: 2692, uses: [696] },
];
const literalIdentities = {
  first_transform_q15_coefficients: {
    symbol: "transform31_first_q15_coefficients", segment: "rodata", alignment: 4,
  },
  first_transform_permutation_indices: {
    symbol: "transform31_first_permutation_indices", segment: "rodata", alignment: 4,
  },
  first_transform_reverse_stage_coefficients: {
    symbol: "transform32_first_reverse_stage_coefficients", segment: "rodata", alignment: 4,
  },
  second_transform_q15_coefficients: {
    symbol: "transform31_second_q15_coefficients", segment: "rodata", alignment: 4,
  },
  second_transform_permutation_indices: {
    symbol: "transform31_second_permutation_indices", segment: "rodata", alignment: 4,
  },
  second_transform_reverse_stage_coefficients: {
    symbol: "transform32_second_reverse_stage_coefficients", segment: "rodata", alignment: 4,
  },
};
const expectedFunctions = [
  ["func_001AB0F8", "first_transform_q15_coefficients", "first_transform_permutation_indices", "first_transform_reverse_stage_coefficients"],
  ["func_001AD02C", "second_transform_q15_coefficients", "second_transform_permutation_indices", "second_transform_reverse_stage_coefficients"],
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 2552,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_32.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract), "unexpected symbolic slot/use contract");
assert(JSON.stringify(manifest.literalIdentities) === JSON.stringify(literalIdentities),
  "unexpected read-only identity contract");
assert(JSON.stringify(manifest.functions.map(({ name, coefficientIdentity, permutationIdentity, reverseIdentity }) =>
  [name, coefficientIdentity, permutationIdentity, reverseIdentity])) === JSON.stringify(expectedFunctions) &&
  manifest.functions.every((entry) =>
    Object.keys(entry).sort().join(",") === "coefficientIdentity,name,permutationIdentity,reverseIdentity,template" &&
    entry.template === templateName), "unexpected function order, template mapping, or table identities");
assert(new Set(Object.values(literalIdentities).map(({ symbol }) => symbol)).size === 6,
  "all six named table identities must remain distinct");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 2552,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) => line.startsWith("INVERSE_FIXED_POINT_COMPLEX_TRANSFORM_64 "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, coefficients, permutation, reverse]) =>
  `INVERSE_FIXED_POINT_COMPLEX_TRANSFORM_64 ${name}, ${literalIdentities[coefficients].symbol}, ${literalIdentities[permutation].symbol}, ${literalIdentities[reverse].symbol}`)),
"unexpected macro invocation order or table identity mapping");
const labels = source.match(/^\.Ldt32_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 10 && new Set(labels).size === 10, "template must define 10 unique macro-local labels");
assert((source.match(/^\s+\.word \\(?:coefficients|permutation|reverse)$/gm) ?? []).length === 3 &&
  (source.match(/^\s+\.word 0$/gm) ?? []).length === 1 &&
  !/^\s+\.word (?!\\(?:coefficients|permutation|reverse)$|0$)/m.test(source) &&
  !/^\s+blx?\b/m.test(source),
"template must contain only three symbolic table slots, one neutral neighboring slot, and no calls");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 319,
  "template must contain exactly 319 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "76cb0039d42a0c8d07d8aad07d92c96003b41253d64c1a8fa66692f444943198",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 32 manifest and deterministic source mapping");
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
assert(symbolTable && symbolTable.entrySize >= 16 && symbolTable.link < sections.length, "missing ELF symbol table");
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
for (const [name, coefficientIdentity, permutationIdentity, reverseIdentity] of expectedFunctions) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 12 && symbol.size === 1276, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 2708,
  `${name} has an unexpected section, alignment, symbolic-slot layout, or companion spacing`);
  assert(data.readUInt32LE(section.offset + 4) === 0, `${name} unreferenced neighboring word must stay neutral`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 24,
    `${name} must have exactly three REL relocations`);
  const expectedRelocations = [
    [0, literalIdentities[coefficientIdentity].symbol],
    [8, literalIdentities[permutationIdentity].symbol],
    [2704, literalIdentities[reverseIdentity].symbol],
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
  assert(body.length / 4 === 319, `${name} must contain exactly 319 ARM instructions`);
  const useContract = [
    [424, 7, false, 444, -12], [696, 2, true, 1988, 2692],
    [832, 2, false, 844, -4], [980, 1, false, 992, -4],
    [1052, 9, false, 1072, -12], [1140, 10, false, 1160, -12],
    [1188, 1, false, 1208, -12], [1224, 1, false, 1244, -12],
  ];
  for (const [useOffset, register, positive, displacement, slotOffset] of useContract) {
    const word = body.readUInt32LE(useOffset);
    const opcode = positive ? 0xe59f0000 : 0xe51f0000;
    assert(word === ((opcode | (register << 12) | displacement) >>> 0),
      `${name} has an unexpected PC-relative load at body offset ${useOffset}`);
    assert(useOffset + 8 + (positive ? displacement : -displacement) === slotOffset,
      `${name} load at body offset ${useOffset} does not resolve to its audited slot`);
  }
  if (reference) assert(body.equals(reference), `${name} differs from the complete template body`);
  else reference = body;
}

console.log("Validated 2 ARM duplicate-template 32 functions (2,552 body bytes, 638 instructions, 6 distinct symbolic read-only identities, no calls)");
