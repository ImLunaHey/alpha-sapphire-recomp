import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-46.json"), "utf8"));
const sourcePath = resolve(root, "src/main/arm_duplicate_templates_46.S");
const source = readFileSync(sourcePath, "utf8");
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };

const names = ["func_002EBDF8", "func_002F9968"];
const callContract = [
  { offset: 96, kind: "R_ARM_CALL", symbol: "func_002F7B18" },
  { offset: 192, kind: "R_ARM_CALL", symbol: "func_004B9B50" },
];
const callIdentities = {
  func_002F7B18: {
    callerObject: { defined: false, binding: "GLOBAL", type: "NOTYPE", section: "UND", size: 0 },
    targetObject: { defined: true, binding: "GLOBAL", type: "FUNC", section: ".text.func_002F7B18", size: 868, sectionType: "PROGBITS", sectionFlags: "AX", sectionAlignment: 4 },
  },
  func_004B9B50: {
    callerObject: { defined: false, binding: "GLOBAL", type: "NOTYPE", section: "UND", size: 0 },
    targetObject: { defined: true, binding: "GLOBAL", type: "FUNC", section: ".text.func_004B9B50", size: 32, sectionType: "PROGBITS", sectionFlags: "AX", sectionAlignment: 4 },
  },
};
const indirectOffsets = [68, 148, 320, 424];
const slotContract = [
  { offset: 508, loadOffset: 28, role: "required_flags_identity" },
  { offset: 512, loadOffset: 108, role: "object_dispatch_identity" },
];
const identities = {
  required_flags_002EBDF8: { symbol: "func_002EBDF8_required_flags_identity", class: "required-flags" },
  object_dispatch_002EBDF8: { symbol: "func_002EBDF8_object_dispatch_identity", class: "dispatch-identity" },
  required_flags_002F9968: { symbol: "func_002F9968_required_flags_identity", class: "required-flags" },
  object_dispatch_002F9968: { symbol: "func_002F9968_object_dispatch_identity", class: "dispatch-identity" },
};
const expected = [
  ["func_002EBDF8", ["required_flags_002EBDF8", "object_dispatch_002EBDF8"]],
  ["func_002F9968", ["required_flags_002F9968", "object_dispatch_002F9968"]],
];

assert(manifest.version === 1 && manifest.mode === "arm" &&
  manifest.source === "src/main/arm_duplicate_templates_46.S" &&
  manifest.expectedBodyBytes === 1016, "unexpected duplicate-template 46 manifest header");
assert(JSON.stringify(manifest.templates) === JSON.stringify({
  conditional_object_resolve_and_append: {
    bodySize: 508, instructionCount: 127, count: 2, internalLabels: 11,
    calls: 2, indirectCalls: 4, poolSlots: 2,
  },
}), "unexpected duplicate-template 46 definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.callIdentities) === JSON.stringify(callIdentities),
  "unexpected direct-call identity role contract");
assert(JSON.stringify(manifest.indirectCallContract?.map(({ offset }) => offset)) ===
  JSON.stringify(indirectOffsets), "unexpected indirect-call contract");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract),
  "unexpected symbolic slot contract");
assert(JSON.stringify(manifest.literalIdentities) === JSON.stringify(identities),
  "unexpected literal identities");
assert(JSON.stringify(manifest.functions?.map(({ name, template, literals }) =>
  [name, template, literals?.map(({ offset, loadOffset, identity }) => [offset, loadOffset, identity])])) ===
  JSON.stringify(expected.map(([name, mapped]) => [name, "conditional_object_resolve_and_append",
    mapped.map((identity, index) => [508 + index * 4, [28, 108][index], identity])])),
  "unexpected function expansion mapping");
assert(JSON.stringify(manifest.literalEquality) === JSON.stringify({ pairwiseDistinct: Object.keys(identities) }),
  "unexpected literal equality contract");

assert((source.match(/^CONDITIONAL_OBJECT_RESOLVE_AND_APPEND /gm) ?? []).length === 2,
  "source must contain exactly two template expansions");
for (const [name, mapped] of expected) {
  const symbols = mapped.map((identity) => identities[identity].symbol);
  assert(source.includes(`CONDITIONAL_OBJECT_RESOLVE_AND_APPEND ${name}, ${symbols.join(", ")}`),
    `missing approved source expansion for ${name}`);
}
assert((source.match(/^\s*\.word \\required_flags$/gm) ?? []).length === 1 &&
  (source.match(/^\s*\.word \\object_dispatch$/gm) ?? []).length === 1,
  "template must contain exactly the approved two symbolic pool slots");
assert(source.indexOf(".size \\name, .-\\name") < source.indexOf(".Ldt46_pool\\@:"),
  "function size boundary must precede the pool");

const objectPath = process.argv[2];
if (!objectPath) {
  console.log("Validated deterministic source coverage for 2 ARM duplicate-template 46 functions (1,016 body bytes, 254 instructions, 4 direct calls, 8 indirect calls, 4 distinct pool slots).");
  process.exit(0);
}
const role = process.argv[3];
assert((role === "--base" || role === "--target") && process.argv.length === 4,
  "object validation requires exactly one explicit --base or --target role");

const data = readFileSync(resolve(objectPath));
assert(data.toString("ascii", 1, 4) === "ELF" && data[4] === 1 && data[5] === 1,
  "expected a 32-bit little-endian ELF object");
const sectionOffset = data.readUInt32LE(32);
const sectionEntrySize = data.readUInt16LE(46);
const sectionCount = data.readUInt16LE(48);
const sectionNameIndex = data.readUInt16LE(50);
const rawSections = Array.from({ length: sectionCount }, (_, index) => {
  const offset = sectionOffset + index * sectionEntrySize;
  return {
    index, nameOffset: data.readUInt32LE(offset), type: data.readUInt32LE(offset + 4),
    flags: data.readUInt32LE(offset + 8), address: data.readUInt32LE(offset + 12),
    offset: data.readUInt32LE(offset + 16), size: data.readUInt32LE(offset + 20),
    link: data.readUInt32LE(offset + 24), info: data.readUInt32LE(offset + 28),
    alignment: data.readUInt32LE(offset + 32), entrySize: data.readUInt32LE(offset + 36),
  };
});
const stringAt = (table, offset) => {
  const end = data.indexOf(0, table.offset + offset);
  return data.toString("utf8", table.offset + offset, end);
};
const sectionNames = rawSections[sectionNameIndex];
const sections = rawSections.map((section) => ({ ...section, name: stringAt(sectionNames, section.nameOffset) }));
const symbolSection = sections.find(({ type }) => type === 2);
assert(symbolSection && symbolSection.entrySize === 16, "missing ELF symbol table");
const symbolStrings = sections[symbolSection.link];
const symbols = Array.from({ length: symbolSection.size / symbolSection.entrySize }, (_, index) => {
  const offset = symbolSection.offset + index * symbolSection.entrySize;
  return {
    index, name: stringAt(symbolStrings, data.readUInt32LE(offset)),
    value: data.readUInt32LE(offset + 4), size: data.readUInt32LE(offset + 8),
    info: data[offset + 12], sectionIndex: data.readUInt16LE(offset + 14),
  };
});
const symbolsByName = new Map(symbols.map((symbol) => [symbol.name, symbol]));
const relocationTypeNames = new Map([[2, "R_ARM_ABS32"], [28, "R_ARM_CALL"]]);
const relocationsFor = (section) => {
  const relocationSection = sections.find(({ type, info }) => type === 9 && info === section.index);
  if (!relocationSection) return [];
  return Array.from({ length: relocationSection.size / relocationSection.entrySize }, (_, index) => {
    const offset = relocationSection.offset + index * relocationSection.entrySize;
    const info = data.readUInt32LE(offset + 4);
    return {
      offset: data.readUInt32LE(offset), kind: relocationTypeNames.get(info & 0xff) ?? `type-${info & 0xff}`,
      symbol: symbols[info >>> 8]?.name,
    };
  });
};
const branchTarget = (word, offset) => {
  let displacement = (word & 0x00ffffff) << 2;
  if ((displacement & 0x02000000) !== 0) displacement -= 0x04000000;
  return offset + 8 + displacement;
};
const branches = new Map([
  [20, 44], [40, 48], [80, 128], [156, 492], [180, 208], [188, 492],
  [204, 492], [216, 492], [244, 456], [268, 456], [280, 500], [296, 500],
  [328, 500], [352, 400], [380, 356], [408, 428], [504, 480],
]);

let bodyReference;
let extentReference;
for (const entry of manifest.functions) {
  const symbol = symbolsByName.get(entry.name);
  const section = symbol && sections[symbol.sectionIndex];
  assert(symbol && (symbol.info & 0x0f) === 2 && (symbol.info >>> 4) === 1 && symbol.size === 508,
    `${entry.name} must be a 508-byte global function`);
  assert(section && section.name === `.text.${entry.name}` && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 516,
    `${entry.name} has an unexpected executable section or pool extent`);
  const extent = Buffer.from(data.subarray(section.offset + symbol.value, section.offset + symbol.value + 516));
  const relocs = relocationsFor(section).filter(({ offset }) => offset >= symbol.value && offset < symbol.value + 516)
    .map((relocation) => ({ ...relocation, offset: relocation.offset - symbol.value }));
  const mappedIdentities = entry.literals.map(({ identity }) => identities[identity].symbol);
  const expectedRelocations = [
    ...callContract,
    ...slotContract.map((slot, index) => ({ offset: slot.offset, kind: "R_ARM_ABS32", symbol: mappedIdentities[index] })),
  ];
  assert(JSON.stringify(relocs) === JSON.stringify(expectedRelocations),
    `${entry.name} has unexpected relocations`);

  const foundIndirect = [];
  const foundBranches = new Map();
  for (let offset = 0; offset < symbol.size; offset += 4) {
    const word = extent.readUInt32LE(offset);
    if ((word & 0x0ffffff0) === 0x012fff30) foundIndirect.push(offset);
    if ((word & 0x0f000000) === 0x0a000000) foundBranches.set(offset, branchTarget(word, offset));
  }
  assert(JSON.stringify(foundIndirect) === JSON.stringify(indirectOffsets),
    `${entry.name} has unexpected register-indirect calls`);
  assert(JSON.stringify([...foundBranches]) === JSON.stringify([...branches]),
    `${entry.name} does not reproduce the approved local branch graph`);

  const body = Buffer.from(extent.subarray(0, symbol.size));
  for (const { offset } of callContract) {
    body.fill(0, offset, offset + 4);
    extent.fill(0, offset, offset + 4);
  }
  if (bodyReference) assert(body.equals(bodyReference),
    `${entry.name} differs from the direct-call-normalized complete template body`);
  else bodyReference = body;

  for (const literal of entry.literals) {
    const word = extent.readUInt32LE(literal.loadOffset);
    const displacement = word & 0xfff;
    const target = literal.loadOffset + 8 + ((word & 0x00800000) ? displacement : -displacement);
    assert((word & 0x0f7f0000) === 0x051f0000 && target === literal.offset,
      `${entry.name} literal load at ${literal.loadOffset} does not address its approved slot`);
    extent.fill(0, literal.offset, literal.offset + 4);
  }
  if (extentReference) assert(extent.equals(extentReference),
    `${entry.name} differs from the direct-call-and-slot-normalized body-plus-pool extent`);
  else extentReference = extent;
}

for (const name of Object.values(identities).map(({ symbol }) => symbol)) {
  const symbol = symbolsByName.get(name);
  assert(symbol && symbol.sectionIndex === 0 && symbol.size === 0,
    `${name} must remain an undefined symbolic identity`);
}

for (const [name, contract] of Object.entries(callIdentities)) {
  const symbol = symbolsByName.get(name);
  const expectedRole = role === "--target" ? contract.targetObject : contract.callerObject;
  assert(symbol && (symbol.info >>> 4) === 1,
    `${name} must be a global symbol in ${role.slice(2)} validation`);
  if (!expectedRole.defined) {
    assert(symbol.sectionIndex === 0 && (symbol.info & 0x0f) === 0 && symbol.size === 0,
      `${name} must be an undefined zero-sized NOTYPE caller identity in base validation`);
    continue;
  }
  const section = sections[symbol.sectionIndex];
  assert((symbol.info & 0x0f) === 2 && symbol.size === expectedRole.size &&
    section?.name === expectedRole.section && section.type === 1 &&
    (section.flags & 0x6) === 0x6 && section.alignment === expectedRole.sectionAlignment,
    `${name} must be the approved defined target FUNC in its dedicated executable section`);
}

console.log("Validated 2 ARM duplicate-template 46 functions (1,016 body bytes, 254 instructions, 4 direct-call relocations, 8 indirect calls, 4 distinct symbolic pool slots).");
