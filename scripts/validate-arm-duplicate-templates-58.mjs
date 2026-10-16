import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(
  join(root, "config/arm-duplicate-templates-58.json"), "utf8",
));
const objectPath = process.argv[2] ?? join(root, "build/AS_EUR_REV2/base/code.o");

const expectedTemplate = {
  bodySize: 320, instructionCount: 80, count: 2, internalLabels: 5,
  directCalls: 14, indirectCalls: 0, poolSlots: 0, postBodyIdentifiers: 3,
};
const expectedCalls = [
  { offset: 8, kind: "R_ARM_CALL", symbol: "func_0012B95C", role: "registry_acquire" },
  { offset: 24, kind: "R_ARM_CALL", symbol: "func_0036F398", role: "lookup_first" },
  { offset: 44, kind: "R_ARM_CALL", symbol: "func_0036F398", role: "lookup_second" },
  { offset: 64, kind: "R_ARM_CALL", symbol: "func_0036F398", role: "lookup_third" },
  { offset: 84, kind: "R_ARM_CALL", symbol: "func_0036F4D0", role: "submit_first" },
  { offset: 100, kind: "R_ARM_CALL", symbol: "func_0036F4D0", role: "submit_second" },
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_0036F4D0", role: "submit_third" },
  { offset: 128, kind: "R_ARM_CALL", symbol: "func_00123480", role: "record_allocate" },
  { offset: 164, kind: "R_ARM_CALL", symbol: "func_003AB384", role: "attach_record" },
  { offset: 192, kind: "R_ARM_CALL", symbol: "func_0012B95C", addend: 16, role: "array_allocate" },
  { offset: 228, kind: "R_ARM_CALL", symbol: "func_0011EF4C", role: "first_capacity_failure" },
  { offset: 264, kind: "R_ARM_CALL", symbol: "func_0011EF4C", role: "second_capacity_failure" },
  { offset: 300, kind: "R_ARM_CALL", symbol: "func_0011EF4C", role: "third_capacity_failure" },
];
const expectedIdentifiers = [
  { role: "expansion_identifier_one", offset: 320, addressInstructionOffset: 20,
    reservedSpan: 28, pairwiseDistinctAcrossExpansions: true },
  { role: "shared_identifier_two", offset: 348, addressInstructionOffset: 36,
    nulTerminatedBytes: 19, reservedSpan: 20, sharedAcrossAllExpansions: true },
  { role: "shared_identifier_three", offset: 368, addressInstructionOffset: 56,
    nulTerminatedBytes: 23, reservedSpan: 24, sharedAcrossAllExpansions: true },
];
const expectedFunctions = [
  { name: "func_00369FAC", template: "registry_triple_attachment",
    constructor: "func_0019C250", constructorCallOffset: 144, identifierOneBytes: 26,
    templateMaterialEndOffset: 391, anonymousMaterialOffset: null, nextGlobalOffset: 392 },
  { name: "func_0036A428", template: "registry_triple_attachment",
    constructor: "func_0019C2A0", constructorCallOffset: 144, identifierOneBytes: 27,
    templateMaterialEndOffset: 391, anonymousMaterialOffset: 392, nextGlobalOffset: 488 },
];
if (config.version !== 1 || config.source !== "src/main/arm_duplicate_templates_58.S" ||
    config.mode !== "arm" || config.expectedBodyBytes !== 640 ||
    JSON.stringify(config.templates) !== JSON.stringify({ registry_triple_attachment: expectedTemplate }) ||
    JSON.stringify(config.commonDirectCalls) !== JSON.stringify(expectedCalls) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify([152, 204, 232, 268, 304]) ||
    JSON.stringify(config.identifierContract) !== JSON.stringify(expectedIdentifiers) ||
    JSON.stringify(config.functions) !== JSON.stringify(expectedFunctions)) {
  throw new Error("Unexpected duplicate template 58 manifest format");
}
if (!existsSync(objectPath)) {
  throw new Error(`Object file not found: ${objectPath}; run npm run base:build first`);
}

const elf = readFileSync(objectPath);
if (elf.length < 52 || elf.toString("binary", 0, 4) !== "\x7fELF" ||
    elf[4] !== 1 || elf[5] !== 1 || elf.readUInt16LE(18) !== 40) {
  throw new Error(`${objectPath} is not a little-endian ELF32 ARM object`);
}
const sectionOffset = elf.readUInt32LE(32);
const sectionEntrySize = elf.readUInt16LE(46);
const sectionCount = elf.readUInt16LE(48);
const sectionNameIndex = elf.readUInt16LE(50);
if (sectionEntrySize < 40 || sectionOffset + sectionEntrySize * sectionCount > elf.length) {
  throw new Error(`${objectPath} has an invalid section table`);
}
const sections = Array.from({ length: sectionCount }, (_, index) => {
  const at = sectionOffset + index * sectionEntrySize;
  return { index, nameOffset: elf.readUInt32LE(at), type: elf.readUInt32LE(at + 4),
    offset: elf.readUInt32LE(at + 16), size: elf.readUInt32LE(at + 20),
    link: elf.readUInt32LE(at + 24), info: elf.readUInt32LE(at + 28),
    entrySize: elf.readUInt32LE(at + 36) };
});
function cString(buffer, offset) {
  const end = buffer.indexOf(0, offset);
  return buffer.toString("utf8", offset, end < 0 ? buffer.length : end);
}
const sectionNames = sections[sectionNameIndex];
if (!sectionNames || sectionNames.offset + sectionNames.size > elf.length) {
  throw new Error(`${objectPath} has an invalid section-name table`);
}
const sectionNameData = elf.subarray(sectionNames.offset, sectionNames.offset + sectionNames.size);
for (const section of sections) section.name = cString(sectionNameData, section.nameOffset);
const symbolSection = sections.find(({ type }) => type === 2);
if (!symbolSection || symbolSection.entrySize < 16 ||
    symbolSection.offset + symbolSection.size > elf.length) {
  throw new Error(`${objectPath} has no valid symbol table`);
}
const stringSection = sections[symbolSection.link];
if (!stringSection || stringSection.offset + stringSection.size > elf.length) {
  throw new Error(`${objectPath} has an invalid symbol string table`);
}
const strings = elf.subarray(stringSection.offset, stringSection.offset + stringSection.size);
const symbols = [];
for (let at = symbolSection.offset; at < symbolSection.offset + symbolSection.size;
    at += symbolSection.entrySize) {
  symbols.push({ name: cString(strings, elf.readUInt32LE(at)), value: elf.readUInt32LE(at + 4),
    size: elf.readUInt32LE(at + 8), info: elf[at + 12], sectionIndex: elf.readUInt16LE(at + 14) });
}
const symbolsByName = new Map(symbols.filter(({ name }) => name).map((symbol) => [symbol.name, symbol]));
const relocations = [];
for (const relocationSection of sections.filter(({ type }) => type === 9)) {
  const entrySize = relocationSection.entrySize || 8;
  if (entrySize < 8 || relocationSection.offset + relocationSection.size > elf.length) {
    throw new Error(`${objectPath} has an invalid relocation section`);
  }
  for (let at = relocationSection.offset; at < relocationSection.offset + relocationSection.size;
    at += entrySize) {
    const info = elf.readUInt32LE(at + 4);
    relocations.push({ sectionIndex: relocationSection.info, offset: elf.readUInt32LE(at),
      type: info & 0xff, symbol: symbols[info >>> 8]?.name });
  }
}

function decodeAdrTarget(instruction, offset) {
  const opcode = instruction & 0x0fe00000;
  if (opcode !== 0x02800000 && opcode !== 0x02400000) return undefined;
  if (((instruction >>> 16) & 0xf) !== 15 || ((instruction >>> 12) & 0xf) !== 1) return undefined;
  const immediate = instruction & 0xff;
  const rotation = ((instruction >>> 8) & 0xf) * 2;
  const value = rotation === 0 ? immediate : ((immediate >>> rotation) | (immediate << (32 - rotation))) >>> 0;
  return opcode === 0x02800000 ? offset + 8 + value : offset + 8 - value;
}
function nulLength(material, offset, span) {
  const terminator = material.indexOf(0, offset);
  return terminator < offset || terminator >= offset + span ? undefined : terminator - offset + 1;
}

let normalizedReference;
const identifierSets = [];
const templateOwnedExtent = expectedIdentifiers[2].offset + expectedIdentifiers[2].reservedSpan;
for (const expected of expectedFunctions) {
  const symbol = symbolsByName.get(expected.name);
  if (!symbol || (symbol.info & 0xf) !== 2 || symbol.size !== expectedTemplate.bodySize ||
      symbol.sectionIndex === 0 || symbol.sectionIndex >= sections.length) {
    throw new Error(`${expected.name} is not a 320-byte ARM function`);
  }
  const section = sections[symbol.sectionIndex];
  if (section.name !== `.text.${expected.name}` || symbol.value !== 0 ||
      section.size !== templateOwnedExtent || section.offset + templateOwnedExtent > elf.length) {
    throw new Error(`${expected.name} does not contain exactly the approved template-owned material`);
  }
  if ((expected.anonymousMaterialOffset === null && expected.nextGlobalOffset !== templateOwnedExtent) ||
      (expected.anonymousMaterialOffset !== null &&
        (expected.anonymousMaterialOffset !== templateOwnedExtent ||
          expected.nextGlobalOffset <= expected.anonymousMaterialOffset))) {
    throw new Error(`${expected.name} has an inconsistent anonymous-material boundary contract`);
  }
  const mappingSymbols = symbols.filter((candidate) =>
    candidate.sectionIndex === symbol.sectionIndex && (candidate.name === "$a" || candidate.name === "$d"))
    .map(({ name, value }) => ({ name, value }));
  if (JSON.stringify(mappingSymbols) !== JSON.stringify([
    { name: "$a", value: 0 }, { name: "$d", value: expectedTemplate.bodySize },
  ])) {
    throw new Error(`${expected.name} does not have one contiguous post-body data mapping`);
  }
  const material = Buffer.from(elf.subarray(section.offset, section.offset + templateOwnedExtent));
  const body = Buffer.from(material.subarray(0, symbol.size));
  if (body.length / 4 !== expectedTemplate.instructionCount) {
    throw new Error(`${expected.name} does not contain 80 ARM instructions`);
  }
  const calls = [...expectedCalls,
    { offset: expected.constructorCallOffset, kind: "R_ARM_CALL", symbol: expected.constructor,
      role: "constructor" }].sort((left, right) => left.offset - right.offset);
  const functionRelocations = relocations.filter((relocation) =>
    relocation.sectionIndex === symbol.sectionIndex)
    .map((relocation) => ({ ...relocation, offset: relocation.offset - symbol.value }));
  const actualCalls = functionRelocations.map(({ offset, type, symbol: callSymbol }) =>
    ({ offset, type, symbol: callSymbol }));
  const wantedCalls = calls.map(({ offset, symbol: callSymbol }) =>
    ({ offset, type: 28, symbol: callSymbol }));
  if (JSON.stringify(actualCalls) !== JSON.stringify(wantedCalls)) {
    throw new Error(`${expected.name} does not have the fourteen ordered R_ARM_CALL relocations`);
  }
  for (const { offset, addend = 0 } of calls) {
    const expectedInstruction = (0xeb000000 | (((addend - 8) / 4) & 0x00ffffff)) >>> 0;
    if (body.readUInt32LE(offset) !== expectedInstruction) {
      throw new Error(`${expected.name} has an invalid R_ARM_CALL addend at +${offset}`);
    }
    body.fill(0, offset, offset + 4);
  }
  const callOffsets = new Set(calls.map(({ offset }) => offset));
  const localTargets = new Set();
  for (let offset = 0; offset < body.length; offset += 4) {
    if (callOffsets.has(offset)) continue;
    const instruction = body.readUInt32LE(offset);
    if ((instruction & 0x0e000000) !== 0x0a000000) continue;
    let displacement = instruction & 0x00ffffff;
    if (displacement & 0x00800000) displacement -= 0x01000000;
    const target = offset + 8 + displacement * 4;
    if (target < 0 || target >= body.length) {
      throw new Error(`${expected.name} contains an unexpected external branch`);
    }
    localTargets.add(target);
  }
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !==
      JSON.stringify(config.internalLabelOffsets)) {
    throw new Error(`${expected.name} has unexpected local branch destinations`);
  }
  for (const identifier of expectedIdentifiers) {
    const actual = decodeAdrTarget(body.readUInt32LE(identifier.addressInstructionOffset),
      identifier.addressInstructionOffset);
    if (actual !== identifier.offset) {
      throw new Error(`${expected.name} has an incorrect ${identifier.role} ADR target`);
    }
  }
  if (normalizedReference && !body.equals(normalizedReference)) {
    throw new Error(`${expected.name} violates normalized complete-body identity`);
  }
  normalizedReference = body;
  const lengths = [expected.identifierOneBytes, 19, 23];
  const values = expectedIdentifiers.map((identifier, index) => {
    const actualLength = nulLength(material, identifier.offset, identifier.reservedSpan);
    if (actualLength !== lengths[index]) {
      throw new Error(`${expected.name} has an invalid ${identifier.role} NUL-terminated length`);
    }
    if (!material.subarray(identifier.offset + actualLength,
      identifier.offset + identifier.reservedSpan).every((byte) => byte === 0)) {
      throw new Error(`${expected.name} has nonzero ${identifier.role} padding`);
    }
    return Buffer.from(material.subarray(identifier.offset, identifier.offset + actualLength));
  });
  if (expected.templateMaterialEndOffset !== expectedIdentifiers[2].offset +
      expectedIdentifiers[2].reservedSpan - 1) {
    throw new Error(`${expected.name} has an inconsistent template material end`);
  }
  identifierSets.push(values);
}
if (identifierSets[0][0].equals(identifierSets[1][0]) ||
    !identifierSets[0][1].equals(identifierSets[1][1]) ||
    !identifierSets[0][2].equals(identifierSets[1][2])) {
  throw new Error("Duplicate-template 58 identifier identity classes are invalid");
}

console.log(`Validated ${expectedFunctions.length} duplicate-template 58 ARM functions (${config.expectedBodyBytes} body bytes).`);
