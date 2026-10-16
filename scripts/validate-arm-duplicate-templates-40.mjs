import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-40.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 40: ${message}`);
}

const templateName = "pooled_red_black_tree_node_insert";
const expectedTemplate = {
  bodySize: 944, instructionCount: 236, count: 2, internalLabels: 21, calls: 2, literalCount: 1,
};
const callContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const slotContract = [
  { offset: 944, loadOffset: 200, role: "shared_node_payload_dispatch_identity" },
];
const expectedIdentity = {
  node_payload_dispatch: {
    symbol: "arm_duplicate_templates_40_shared_node_payload_dispatch_identity",
    class: "read-only-address",
  },
};
const expectedFunctions = ["func_005522B8", "func_00552D08"];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 1888,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_40.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.slotContract) === JSON.stringify(slotContract),
  "unexpected literal-slot/load contract");
assert(JSON.stringify(manifest.literalIdentities) === JSON.stringify(expectedIdentity),
  "unexpected semantic identity ledger");
assert(Array.isArray(manifest.functions) && manifest.functions.length === 2,
  "unexpected function cardinality");
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const entry = manifest.functions[index];
  assert(entry && Object.keys(entry).sort().join(",") === "literals,name,template" &&
    entry.name === expectedFunctions[index] && entry.template === templateName &&
    JSON.stringify(entry.literals) === JSON.stringify([{
      offset: 944, loadOffset: 200, identity: "node_payload_dispatch",
    }]), `invalid mapping for ${expectedFunctions[index]}`);
}
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/)
  .filter((line) => line.startsWith("POOLED_RED_BLACK_TREE_NODE_INSERT "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map((name) =>
  `POOLED_RED_BLACK_TREE_NODE_INSERT ${name}`)), "unexpected macro invocation order");
const labels = (source.match(/^\.Ldt40_\\@_[0-9a-f]{4}:$/gm) ?? [])
  .filter((label) => label !== ".Ldt40_\\@_03b0:");
assert(JSON.stringify(labels) === JSON.stringify([
  ".Ldt40_\\@_0070:", ".Ldt40_\\@_00b0:", ".Ldt40_\\@_00e0:",
  ".Ldt40_\\@_0118:", ".Ldt40_\\@_0138:", ".Ldt40_\\@_0148:",
  ".Ldt40_\\@_015c:", ".Ldt40_\\@_016c:", ".Ldt40_\\@_0194:",
  ".Ldt40_\\@_01e8:", ".Ldt40_\\@_01f0:", ".Ldt40_\\@_0254:",
  ".Ldt40_\\@_0260:", ".Ldt40_\\@_0280:", ".Ldt40_\\@_0294:",
  ".Ldt40_\\@_02e8:", ".Ldt40_\\@_02f0:", ".Ldt40_\\@_0354:",
  ".Ldt40_\\@_035c:", ".Ldt40_\\@_037c:", ".Ldt40_\\@_0390:",
]), "template must define the 21 approved macro-local control labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 2 && !/^    blx\b/m.test(source),
  "template must contain the approved two-call schedule");
assert(JSON.stringify(source.match(/^    \.word .+$/gm) ?? []) === JSON.stringify([
  "    .word arm_duplicate_templates_40_shared_node_payload_dispatch_identity",
]), "template must contain only the approved symbolic post-body slot");
assert(!/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or unapproved data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/)
  .filter((line) => /^    [a-z]/.test(line)).length === 236,
"template must contain exactly 236 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "260f5622758708d6e3dea0439a226bfb360ced995c6b5a9cf0b68c028e3c1592",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 40 manifest and deterministic source mapping");
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
for (const name of expectedFunctions) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 944, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 948, `${name} has an unexpected executable section or slot layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocations = relocationSections[0];
  assert(relocations.type === 9 && relocations.entrySize === 8 && relocations.size === 24,
    `${name} must have exactly three REL relocations`);
  const expectedRelocations = [
    [116, 28, "func_00184990"], [132, 28, "func_00184990"],
    [944, 2, expectedIdentity.node_payload_dispatch.symbol],
  ];
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const offset = relocations.offset + index * relocations.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    const [expectedOffset, expectedType, expectedSymbol] = expectedRelocations[index];
    assert(relocationOffset === expectedOffset && (relocationInfo & 0xff) === expectedType &&
      relocationSymbol?.name === expectedSymbol, `${name} has an unexpected call or identity relocation`);
    if (expectedType === 2) assert(relocationSymbol.sectionIndex === 0 && relocationSymbol.size === 0,
      `${name} dispatch identity must remain undefined`);
  }
  const body = Buffer.from(data.subarray(section.offset, section.offset + symbol.size));
  const load = body.readUInt32LE(200);
  assert(load === 0xe59f12e0 && 200 + 8 + (load & 0xfff) === 944,
    `${name} has an unexpected PC-relative literal load`);
  for (const { offset } of callContract) body.fill(0, offset, offset + 4);
  if (reference) assert(body.equals(reference), `${name} differs from the normalized complete template body`);
  else reference = body;
}

console.log("Validated 2 ARM duplicate-template 40 functions (1,888 body bytes, 472 instructions, 2 literal slots in 1 equality class)");
