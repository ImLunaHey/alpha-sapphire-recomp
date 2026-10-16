import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(
  join(root, "config/arm-duplicate-templates-59.json"), "utf8",
));
const objectPath = process.argv[2] ?? join(root, "build/AS_EUR_REV2/base/code.o");
if (process.argv.length > 3) {
  throw new Error("usage: validate-arm-duplicate-templates-59.mjs [base-or-target-object]");
}

const expectedTemplate = {
  bodySize: 320, instructionCount: 80, count: 2, internalLabels: 2,
  directCalls: 15, indirectCalls: 1, literalCount: 0,
};
const expectedCalls = [
  { offset: 20, kind: "R_ARM_CALL", symbol: "func_004E5E08", role: "derive_first_handle" },
  { offset: 32, kind: "R_ARM_CALL", symbol: "func_004E5DDC", role: "derive_second_handle" },
  { offset: 40, kind: "R_ARM_CALL", symbol: "func_00410B30", role: "pre_operation_notification" },
  { offset: 60, kind: "R_ARM_CALL", symbol: "func_004E688C", role: "derive_submitted_value" },
  { offset: 76, kind: "R_ARM_CALL", symbol: "func_00410B4C", role: "submit_value_by_address" },
  { offset: 88, kind: "R_ARM_CALL", symbol: "func_00410484", role: "acquire_shared_value_first" },
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00410EAC", role: "construct_outer_stack_object" },
  { offset: 124, kind: "R_ARM_CALL", symbol: "func_00410E50", role: "query_outer_stack_object" },
  { offset: 180, kind: "R_ARM_CALL", symbol: "func_00413574", role: "prepare_optional_operation" },
  { offset: 208, kind: "R_ARM_CALL", symbol: "func_00417514", addend: 28, role: "construct_inner_stack_object" },
  { offset: 212, kind: "R_ARM_CALL", symbol: "func_00410484", role: "acquire_shared_value_second" },
  { offset: 248, kind: "R_ARM_CALL", symbol: "func_0040F228", role: "construct_output_stack_object" },
  { offset: 256, kind: "R_ARM_CALL", symbol: "func_0040F1A4", role: "submit_output_stack_object" },
  { offset: 280, kind: "R_ARM_CALL", symbol: "func_0040AC94", role: "acquire_indirect_dispatcher" },
  { offset: 308, kind: "R_ARM_CALL", symbol: "func_0040F458", role: "destroy_outer_stack_object" },
];
const expectedIndirectCalls = [
  { offset: 300, register: "r2", role: "release_optional_pointer" },
];
const expectedFunctions = [
  { name: "func_0040EA28", template: "opaque_stack_operation", nextGlobalOffset: 320 },
  { name: "func_0040EB68", template: "opaque_stack_operation", nextGlobalOffset: 320 },
];
if (config.version !== 1 || config.source !== "src/main/arm_duplicate_templates_59.S" ||
    config.mode !== "arm" || config.expectedBodyBytes !== 640 ||
    JSON.stringify(config.templates) !==
      JSON.stringify({ opaque_stack_operation: expectedTemplate }) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify([268, 304]) ||
    JSON.stringify(config.callContract) !== JSON.stringify(expectedCalls) ||
    JSON.stringify(config.indirectCallContract) !== JSON.stringify(expectedIndirectCalls) ||
    JSON.stringify(config.functions) !== JSON.stringify(expectedFunctions)) {
  throw new Error("Unexpected duplicate template 59 manifest format");
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

let normalizedReference;
for (const expected of expectedFunctions) {
  const symbol = symbolsByName.get(expected.name);
  if (!symbol || (symbol.info & 0xf) !== 2 || symbol.size !== expectedTemplate.bodySize ||
      symbol.sectionIndex === 0 || symbol.sectionIndex >= sections.length) {
    throw new Error(`${expected.name} is not a 320-byte ARM function`);
  }
  const section = sections[symbol.sectionIndex];
  if (section.name !== `.text.${expected.name}` || symbol.value !== 0 ||
      section.size !== expected.nextGlobalOffset || section.offset + section.size > elf.length) {
    throw new Error(`${expected.name} does not have the approved no-literal next-global boundary`);
  }
  const mappingSymbols = symbols.filter((candidate) =>
    candidate.sectionIndex === symbol.sectionIndex && (candidate.name === "$a" || candidate.name === "$d"))
    .map(({ name, value }) => ({ name, value }));
  if (JSON.stringify(mappingSymbols) !== JSON.stringify([{ name: "$a", value: 0 }])) {
    throw new Error(`${expected.name} is not one contiguous ARM code mapping with no literal material`);
  }
  const body = Buffer.from(elf.subarray(section.offset, section.offset + section.size));
  if (body.length / 4 !== expectedTemplate.instructionCount) {
    throw new Error(`${expected.name} does not contain 80 ARM instructions`);
  }
  const functionRelocations = relocations.filter(({ sectionIndex }) => sectionIndex === symbol.sectionIndex)
    .map(({ offset, type, symbol: callSymbol }) => ({ offset: offset - symbol.value,
      type, symbol: callSymbol }));
  const wantedCalls = expectedCalls.map(({ offset, symbol: callSymbol }) =>
    ({ offset, type: 28, symbol: callSymbol }));
  if (JSON.stringify(functionRelocations) !== JSON.stringify(wantedCalls)) {
    throw new Error(`${expected.name} does not have the fifteen ordered R_ARM_CALL relocations`);
  }
  for (const { offset, addend = 0 } of expectedCalls) {
    const expectedInstruction = (0xeb000000 | (((addend - 8) / 4) & 0x00ffffff)) >>> 0;
    if (body.readUInt32LE(offset) !== expectedInstruction) {
      throw new Error(`${expected.name} has an invalid R_ARM_CALL addend at +${offset}`);
    }
    body.fill(0, offset, offset + 4);
  }
  if (body.readUInt32LE(expectedIndirectCalls[0].offset) !== 0xe12fff32) {
    throw new Error(`${expected.name} does not call indirectly through r2 at +300`);
  }
  const callOffsets = new Set(expectedCalls.map(({ offset }) => offset));
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
  if (normalizedReference && !body.equals(normalizedReference)) {
    throw new Error(`${expected.name} violates normalized complete-body identity`);
  }
  normalizedReference = body;
}

console.log(`Validated ${expectedFunctions.length} duplicate-template 59 ARM functions (${config.expectedBodyBytes} body bytes).`);
