import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(
  join(root, "config/arm-duplicate-templates-60.json"), "utf8",
));
const objectPath = process.argv[2] ?? join(root, "build/AS_EUR_REV2/base/code.o");
if (process.argv.length > 3) {
  throw new Error("usage: validate-arm-duplicate-templates-60.mjs [base-or-target-object]");
}

const expectedTemplate = {
  bodySize: 320, instructionCount: 80, count: 2, internalLabels: 4,
  directCalls: 1, indirectCalls: 0, ownedLiteralCount: 0, externalWordReads: 1,
};
const expectedCalls = [
  { offset: 256, kind: "R_ARM_CALL", symbol: "func_00300754", role: "derive_threshold_scale" },
];
const expectedExternalWords = [{
  loadOffset: 20, targetOffset: 448, role: "signed_halfword_upper_bound",
  sharedSemanticValueAcrossExpansions: true, ownedByTemplate: false,
}];
const expectedFunctions = [
  { name: "func_001A3964", template: "adaptive_sample_preprocessor", nextGlobalOffset: 320 },
  { name: "func_001A4110", template: "adaptive_sample_preprocessor", nextGlobalOffset: 320 },
];
if (config.version !== 1 || config.source !== "src/main/arm_duplicate_templates_60.S" ||
    config.mode !== "arm" || config.expectedBodyBytes !== 640 ||
    JSON.stringify(config.templates) !==
      JSON.stringify({ adaptive_sample_preprocessor: expectedTemplate }) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify([32, 252, 296, 300]) ||
    JSON.stringify(config.callContract) !== JSON.stringify(expectedCalls) ||
    JSON.stringify(config.externalWordReadContract) !== JSON.stringify(expectedExternalWords) ||
    JSON.stringify(config.functions) !== JSON.stringify(expectedFunctions)) {
  throw new Error("Unexpected duplicate template 60 manifest format");
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
    throw new Error(`${expected.name} does not have the approved external-word next-global boundary`);
  }
  const mappingSymbols = symbols.filter((candidate) =>
    candidate.sectionIndex === symbol.sectionIndex && (candidate.name === "$a" || candidate.name === "$d"))
    .map(({ name, value }) => ({ name, value }));
  if (JSON.stringify(mappingSymbols) !== JSON.stringify([{ name: "$a", value: 0 }])) {
    throw new Error(`${expected.name} is not one contiguous ARM code mapping with no owned literal material`);
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
    throw new Error(`${expected.name} does not have exactly the approved R_ARM_CALL relocation`);
  }
  const call = expectedCalls[0];
  const expectedCallInstruction = (0xeb000000 | (((-8) / 4) & 0x00ffffff)) >>> 0;
  if (body.readUInt32LE(call.offset) !== expectedCallInstruction) {
    throw new Error(`${expected.name} has an invalid R_ARM_CALL addend at +${call.offset}`);
  }
  body.fill(0, call.offset, call.offset + 4);

  const external = expectedExternalWords[0];
  const load = body.readUInt32LE(external.loadOffset);
  const isImmediateWordLoad = (load & 0x0f7ff000) === 0x051fa000;
  const displacement = load & 0xfff;
  const targetOffset = external.loadOffset + 8 + displacement;
  if (!isImmediateWordLoad || (load & 0x00800000) === 0 || targetOffset !== external.targetOffset ||
      targetOffset < expected.nextGlobalOffset || targetOffset < expectedTemplate.bodySize) {
    throw new Error(`${expected.name} does not preserve the non-owned external-word address contract`);
  }
  const callOffsets = new Set(expectedCalls.map(({ offset }) => offset));
  const localTargets = new Set();
  for (let offset = 0; offset < body.length; offset += 4) {
    if (callOffsets.has(offset)) continue;
    const instruction = body.readUInt32LE(offset);
    if ((instruction & 0x0e000000) !== 0x0a000000) continue;
    let branchDisplacement = instruction & 0x00ffffff;
    if (branchDisplacement & 0x00800000) branchDisplacement -= 0x01000000;
    const target = offset + 8 + branchDisplacement * 4;
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

console.log(`Validated ${expectedFunctions.length} duplicate-template 60 ARM functions (${config.expectedBodyBytes} body bytes).`);
