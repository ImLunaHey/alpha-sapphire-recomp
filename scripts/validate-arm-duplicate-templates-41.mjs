import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-41.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 41: ${message}`);
}

const templateName = "serialized_resource_operation_register_wrapper";
const expectedTemplate = {
  bodySize: 1160, instructionCount: 290, count: 2, internalLabels: 32, calls: 15, poolSlots: 2,
};
const callContract = [
  { offset: 36, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 72, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 104, kind: "R_ARM_CALL", symbol: "func_0018C780" },
  { offset: 128, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 292, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 328, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 468, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 612, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 624, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 664, kind: "R_ARM_CALL", symbol: "operation" },
  { offset: 700, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 868, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 1028, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 1116, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 1128, kind: "R_ARM_CALL", symbol: "func_00160380" },
];
const poolContract = [
  { offset: 1160, kind: "R_ARM_ABS32", symbol: "resource_operation_state_41", loadOffset: 20 },
  { offset: 1164, kind: "R_ARM_ABS32", symbol: "resource_unavailable_status_41", loadOffset: 64 },
];
const functions = [
  { name: "func_002E3518", template: templateName, operation: "func_002E40B0" },
  { name: "func_002E4E5C", template: templateName, operation: "func_002E42FC" },
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 2320,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_41.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.poolContract) === JSON.stringify(poolContract),
  "unexpected pool contract");
assert(JSON.stringify(manifest.functions) === JSON.stringify(functions),
  "unexpected function mapping");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/)
  .filter((line) => line.startsWith("SERIALIZED_RESOURCE_OPERATION_REGISTER_WRAPPER "));
assert(JSON.stringify(invocations) === JSON.stringify(functions.map(({ name, operation }) =>
  `SERIALIZED_RESOURCE_OPERATION_REGISTER_WRAPPER ${name}, ${operation}`)),
"unexpected macro invocation order or operation mapping");
assert(JSON.stringify(source.match(/^\.Ldt41_\\@_[0-9a-f]{4}:$/gm) ?? []) === JSON.stringify([
  ".Ldt41_\\@_0040:", ".Ldt41_\\@_0058:", ".Ldt41_\\@_0090:", ".Ldt41_\\@_00cc:",
  ".Ldt41_\\@_00d8:", ".Ldt41_\\@_0110:", ".Ldt41_\\@_0128:", ".Ldt41_\\@_018c:",
  ".Ldt41_\\@_01c0:", ".Ldt41_\\@_01d0:", ".Ldt41_\\@_01e4:", ".Ldt41_\\@_01f4:",
  ".Ldt41_\\@_020c:", ".Ldt41_\\@_021c:", ".Ldt41_\\@_022c:", ".Ldt41_\\@_023c:",
  ".Ldt41_\\@_0254:", ".Ldt41_\\@_0260:", ".Ldt41_\\@_0280:", ".Ldt41_\\@_0300:",
  ".Ldt41_\\@_0334:", ".Ldt41_\\@_0348:", ".Ldt41_\\@_0354:", ".Ldt41_\\@_03a8:",
  ".Ldt41_\\@_03f0:", ".Ldt41_\\@_0400:", ".Ldt41_\\@_0414:", ".Ldt41_\\@_0424:",
  ".Ldt41_\\@_044c:", ".Ldt41_\\@_0458:", ".Ldt41_\\@_046c:", ".Ldt41_\\@_0478:",
]), "template must define the 32 approved macro-local control labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 15 && !/^    blx\b/m.test(source),
  "template must contain the approved fifteen-call schedule");
assert(JSON.stringify(source.match(/^    \.word .+$/gm) ?? []) === JSON.stringify([
  "    .word resource_operation_state_41",
  "    .word resource_unavailable_status_41",
]), "template must contain only the two approved symbolic post-body pool slots");
assert(!/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or unapproved data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/)
  .filter((line) => /^    [a-z]/.test(line)).length === 290,
"template must contain exactly 290 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "7099888dd1a4a7f74412afa76ee92751c1b42ca75a8d72faa8d45092b18a9868",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 41 manifest and deterministic source mapping");
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
for (const entry of functions) {
  const symbol = symbolsByName.get(entry.name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 1160, `${entry.name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${entry.name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 1168, `${entry.name} has an unexpected executable section or pool layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${entry.name} must have one relocation section`);
  const relocations = relocationSections[0];
  assert(relocations.type === 9 && relocations.entrySize === 8 && relocations.size === 136,
    `${entry.name} must have exactly seventeen REL relocations`);
  const expectedRelocations = [
    ...callContract.map(({ offset, symbol: callSymbol }) =>
      [offset, 28, callSymbol === "operation" ? entry.operation : callSymbol]),
    ...poolContract.map(({ offset, symbol: poolSymbol }) => [offset, 2, poolSymbol]),
  ];
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocations.offset + index * relocations.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    const [expectedOffset, expectedType, expectedSymbol] = expectedRelocations[index];
    assert(relocationOffset === expectedOffset && (relocationInfo & 0xff) === expectedType &&
      relocationSymbol?.name === expectedSymbol, `${entry.name} has an unexpected call or pool relocation`);
    if (expectedType === 2) assert(relocationSymbol.sectionIndex === 0 && relocationSymbol.size === 0,
      `${entry.name} pool identity ${expectedSymbol} must remain undefined`);
  }
  const body = Buffer.from(data.subarray(section.offset, section.offset + symbol.size));
  const stateLoad = body.readUInt32LE(20);
  const statusLoad = body.readUInt32LE(64);
  assert(stateLoad === 0xe59f546c && 20 + 8 + (stateLoad & 0xfff) === 1160,
    `${entry.name} has an unexpected shared-state literal load`);
  assert(statusLoad === 0xe59f7444 && 64 + 8 + (statusLoad & 0xfff) === 1164,
    `${entry.name} has an unexpected status literal load`);
  for (const { offset } of callContract) body.fill(0, offset, offset + 4);
  if (reference) assert(body.equals(reference), `${entry.name} differs from the normalized complete template body`);
  else reference = body;
}

console.log("Validated 2 ARM duplicate-template 41 functions (2,320 body bytes, 580 instructions, 4 pool slots in 2 equality classes)");
