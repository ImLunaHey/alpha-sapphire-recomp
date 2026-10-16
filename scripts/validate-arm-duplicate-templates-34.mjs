import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-34.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 34: ${message}`);
}

const templateName = "serialized_resource_operation_wrapper";
const expectedTemplate = {
  bodySize: 1176, instructionCount: 294, count: 3, internalLabels: 32, calls: 15, poolSlots: 2,
};
const callContract = [
  { offset: 44, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 80, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 112, kind: "R_ARM_CALL", symbol: "func_0018C780" },
  { offset: 136, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 292, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 328, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 468, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 612, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 624, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 680, kind: "R_ARM_CALL", symbol: "operation" },
  { offset: 716, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 884, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 1044, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 1132, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 1144, kind: "R_ARM_CALL", symbol: "func_00160380" },
];
const poolContract = [
  { offset: 1176, kind: "R_ARM_ABS32", symbol: "resource_operation_state_34", loadOffset: 20 },
  { offset: 1180, kind: "R_ARM_ABS32", symbol: "resource_unavailable_status_34", loadOffset: 72 },
];
const expectedFunctions = [
  ["func_002E25B0", "func_002E3F10"],
  ["func_002E4960", "func_002E422C"],
  ["func_002E52EC", "func_002E435C"],
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 3528,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_34.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract), "unexpected call contract");
assert(JSON.stringify(manifest.poolContract) === JSON.stringify(poolContract), "unexpected pool contract");
assert(JSON.stringify(manifest.functions.map(({ name, operation }) => [name, operation])) ===
  JSON.stringify(expectedFunctions) && manifest.functions.every((entry) =>
    Object.keys(entry).sort().join(",") === "name,operation,template" && entry.template === templateName),
"unexpected function order, template mapping, or operation identity");
assert(new Set(expectedFunctions.map(([, operation]) => operation)).size === 3,
  "operation identities must be pairwise distinct");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 3528,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) =>
  line.startsWith("SERIALIZED_RESOURCE_OPERATION_WRAPPER "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, operation]) =>
  `SERIALIZED_RESOURCE_OPERATION_WRAPPER ${name}, ${operation}`)),
"unexpected macro invocation order or operation mapping");
const labels = source.match(/^\.Ldt34_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 32 && new Set(labels).size === 32,
  "template must define 32 unique macro-local labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 15 &&
  (source.match(/^    bl \\operation$/gm) ?? []).length === 1,
"template must contain exactly the fifteen approved symbolic calls");
assert((source.match(/^    \.word resource_(?:operation_state|unavailable_status)_34$/gm) ?? []).length === 2 &&
  !/^    \.word (?!resource_(?:operation_state|unavailable_status)_34$)/m.test(source),
"template must contain only the two approved symbolic pool slots");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 294,
  "template must contain exactly 294 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "82b6f475516e4152e2e108e458414ede65ca2c3a3d971fecb528b0901be21fdd",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 34 manifest and deterministic source mapping");
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
for (const [name, operation] of expectedFunctions) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 1176, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 1184, `${name} has an unexpected executable section or pool extent`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 136,
    `${name} must have exactly seventeen REL relocations`);
  const expectedRelocations = [
    ...callContract.map((call) => [call.offset, call.kind, call.symbol === "operation" ? operation : call.symbol]),
    ...poolContract.map((slot) => [slot.offset, slot.kind, slot.symbol]),
  ];
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocationSection.offset + index * relocationSection.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    const [wantedOffset, kind, wantedSymbol] = expectedRelocations[index];
    const wantedType = kind === "R_ARM_CALL" ? 28 : 2;
    assert(relocationOffset === wantedOffset && (relocationInfo & 0xff) === wantedType &&
      relocationSymbol?.name === wantedSymbol, `${name} has an unexpected relocation at index ${index}`);
  }
  const body = Buffer.from(data.subarray(section.offset, section.offset + symbol.size));
  assert(body.length / 4 === 294, `${name} must contain exactly 294 ARM instructions`);
  assert(body.readUInt32LE(20) === 0xe59f547c && body.readUInt32LE(72) === 0xe59f744c,
    `${name} has an unexpected post-body pool load`);
  for (const call of callContract) body.fill(0, call.offset, call.offset + 4);
  if (reference) assert(body.equals(reference), `${name} differs from the normalized complete template body`);
  else reference = body;
}

console.log("Validated 3 ARM duplicate-template 34 functions (3,528 body bytes, 882 instructions, 45 symbolic calls, 6 symbolic pool slots)");
