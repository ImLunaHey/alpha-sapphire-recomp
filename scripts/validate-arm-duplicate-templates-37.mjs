import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-37.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 37: ${message}`);
}

const templateName = "pooled_word_pair_colored_tree_insert";
const expectedTemplate = { bodySize: 892, instructionCount: 223, count: 3, internalLabels: 21, calls: 2 };
const callContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const expectedFunctions = ["func_00557CAC", "func_00558928", "func_00559478"];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 2676,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_37.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected shared allocator-call contract");
assert(JSON.stringify(manifest.functions.map(({ name }) => name)) === JSON.stringify(expectedFunctions) &&
  manifest.functions.every((entry) => Object.keys(entry).sort().join(",") === "name,template" &&
    entry.template === templateName), "unexpected function order or template mapping");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 2676,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) =>
  line.startsWith("POOLED_WORD_PAIR_COLORED_TREE_INSERT "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map((name) =>
  `POOLED_WORD_PAIR_COLORED_TREE_INSERT ${name}`)), "unexpected macro invocation order");
const labels = source.match(/^\.Ldt37_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 21 && new Set(labels).size === 21,
  "template must define 21 unique macro-local labels");
assert((source.match(/^    bl func_00184990$/gm) ?? []).length === 2 &&
  (source.match(/^    bl\b/gm) ?? []).length === 2,
  "template must contain only the two shared symbolic allocator calls");
assert(!/^\s*\.(?:inst|word|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 223,
  "template must contain exactly 223 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "eeccd8ee125f66e6d480de3322ef4c9749788cde9ed5aeddde89773087460163",
  "template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 37 manifest and deterministic source mapping");
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
for (const name of expectedFunctions) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 892, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 892, `${name} has an unexpected executable section`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 16,
    `${name} must have exactly two REL relocations`);
  for (let index = 0; index < callContract.length; index += 1) {
    const offset = relocationSection.offset + index * relocationSection.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    assert(relocationOffset === callContract[index].offset && (relocationInfo & 0xff) === 28 &&
      relocationSymbol?.name === callContract[index].symbol,
      `${name} has an unexpected symbolic allocator-call relocation`);
  }
  const body = data.subarray(section.offset, section.offset + section.size);
  assert(body.length / 4 === 223, `${name} must contain exactly 223 ARM instructions`);
  if (reference) assert(body.equals(reference), `${name} differs from the complete normalized template body`);
  else reference = body;
}

console.log("Validated 3 ARM duplicate-template 37 functions (2,676 body bytes, 669 instructions, 6 shared symbolic allocator calls)");
