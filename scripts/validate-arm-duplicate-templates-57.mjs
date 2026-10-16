import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(
  join(root, "config/arm-duplicate-templates-57.json"), "utf8",
));
const objectPath = process.argv[2] ?? join(root, "build/AS_EUR_REV2/base/code.o");

const expectedTemplate = {
  bodySize: 320, instructionCount: 80, count: 2, internalLabels: 9,
  directCalls: 2, indirectCalls: 0, literalCount: 0,
};
const expectedLabels = [84, 120, 160, 168, 208, 228, 248, 272, 288];
const expectedCalls = [
  { offset: 92, kind: "R_ARM_CALL", symbol: "$clearHelper", role: "clear_subtree" },
  { offset: 304, kind: "R_ARM_CALL", symbol: "$eraseHelper", role: "erase_current" },
];
const expectedFunctions = [
  { name: "func_0018396C", template: "tree_advance_and_erase",
    clearHelper: "func_0018A080", eraseHelper: "func_00189A24" },
  { name: "func_0018F7A8", template: "tree_advance_and_erase",
    clearHelper: "func_00192AE0", eraseHelper: "func_00192484" },
];

if (config.version !== 1 || config.source !== "src/main/arm_duplicate_templates_57.S" ||
    config.mode !== "arm" || config.expectedBodyBytes !== 640 ||
    JSON.stringify(config.templates) !== JSON.stringify({ tree_advance_and_erase: expectedTemplate }) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify(expectedLabels) ||
    JSON.stringify(config.callContract) !== JSON.stringify(expectedCalls) ||
    JSON.stringify(config.functions) !== JSON.stringify(expectedFunctions)) {
  throw new Error("Unexpected duplicate template 57 manifest format");
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
  return {
    index, nameOffset: elf.readUInt32LE(at), type: elf.readUInt32LE(at + 4),
    offset: elf.readUInt32LE(at + 16), size: elf.readUInt32LE(at + 20),
    link: elf.readUInt32LE(at + 24), info: elf.readUInt32LE(at + 28),
    entrySize: elf.readUInt32LE(at + 36),
  };
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

const symbolSection = sections.find((section) => section.type === 2);
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
  symbols.push({
    name: cString(strings, elf.readUInt32LE(at)), value: elf.readUInt32LE(at + 4),
    size: elf.readUInt32LE(at + 8), info: elf[at + 12], sectionIndex: elf.readUInt16LE(at + 14),
  });
}
const symbolsByName = new Map(symbols.filter(({ name }) => name).map((symbol) => [symbol.name, symbol]));

const relocations = [];
for (const relocationSection of sections.filter((section) => section.type === 9)) {
  const entrySize = relocationSection.entrySize || 8;
  if (entrySize < 8 || relocationSection.offset + relocationSection.size > elf.length) {
    throw new Error(`${objectPath} has an invalid relocation section`);
  }
  for (let at = relocationSection.offset;
    at < relocationSection.offset + relocationSection.size; at += entrySize) {
    const info = elf.readUInt32LE(at + 4);
    relocations.push({
      sectionIndex: relocationSection.info, offset: elf.readUInt32LE(at),
      type: info & 0xff, symbol: symbols[info >>> 8]?.name,
    });
  }
}

let normalizedReference;
for (const expected of expectedFunctions) {
  const symbol = symbolsByName.get(expected.name);
  if (!symbol || (symbol.info & 0xf) !== 2 || symbol.size !== expectedTemplate.bodySize ||
      symbol.sectionIndex === 0 || symbol.sectionIndex >= sections.length) {
    throw new Error(`${expected.name} is not a ${expectedTemplate.bodySize}-byte function`);
  }
  const section = sections[symbol.sectionIndex];
  if (section.offset + symbol.value + symbol.size > elf.length) {
    throw new Error(`${expected.name} body is outside its section`);
  }
  const body = Buffer.from(elf.subarray(
    section.offset + symbol.value, section.offset + symbol.value + symbol.size,
  ));
  if (body.length / 4 !== expectedTemplate.instructionCount) {
    throw new Error(`${expected.name} does not contain 80 ARM instructions`);
  }
  const calls = expectedCalls.map((call) => ({
    ...call,
    symbol: call.symbol === "$clearHelper" ? expected.clearHelper : expected.eraseHelper,
  }));
  const functionRelocations = relocations.filter((relocation) =>
    relocation.sectionIndex === symbol.sectionIndex &&
    relocation.offset >= symbol.value && relocation.offset < symbol.value + symbol.size,
  ).map((relocation) => ({ ...relocation, offset: relocation.offset - symbol.value }));
  const actualCalls = functionRelocations.filter(({ type }) => type === 28)
    .map(({ offset, type, symbol: callSymbol }) => ({ offset, type, symbol: callSymbol }));
  const wantedCalls = calls.map(({ offset, symbol: callSymbol }) =>
    ({ offset, type: 28, symbol: callSymbol }));
  if (JSON.stringify(actualCalls) !== JSON.stringify(wantedCalls)) {
    throw new Error(`${expected.name} does not have the two ordered R_ARM_CALL relocations`);
  }
  if (functionRelocations.length !== calls.length) {
    throw new Error(`${expected.name} contains unexpected literal or non-call relocations`);
  }
  for (const { offset } of calls) body.fill(0, offset, offset + 4);

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
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !== JSON.stringify(expectedLabels)) {
    throw new Error(`${expected.name} has unexpected local branch destinations`);
  }
  if (normalizedReference && !body.equals(normalizedReference)) {
    throw new Error(`${expected.name} violates normalized complete-body identity`);
  }
  normalizedReference = body;

  const following = symbols.filter((candidate) => candidate.sectionIndex === symbol.sectionIndex &&
    candidate.name && candidate.value > symbol.value && (candidate.info & 0xf) === 2)
    .sort((left, right) => left.value - right.value)[0];
  if (following && following.value !== symbol.value + symbol.size) {
    throw new Error(`${expected.name} has post-body material before the next function`);
  }
  if (!following && symbol.value + symbol.size !== section.size) {
    throw new Error(`${expected.name} has post-body material at the end of its section`);
  }
}

console.log(`Validated ${expectedFunctions.length} duplicate-template 57 ARM functions (${config.expectedBodyBytes} bytes).`);
