import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-30.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 30: ${message}`);
}

const templateName = "intrusive_colored_tree_range_erase";
const expectedTemplate = { bodySize: 1900, instructionCount: 475, count: 5, internalLabels: 59, callOffset: 84 };
const expectedFunctions = [
  ["func_0055AB74", "func_0055B2E0"],
  ["func_0055B688", "func_0055BDF4"],
  ["func_0055D8F8", "func_0055E1BC"],
  ["func_0055E69C", "func_0055EE08"],
  ["func_00560330", "func_00560A9C"],
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 9500,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_30.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.functions.map(({ name, helper }) => [name, helper])) === JSON.stringify(expectedFunctions) &&
  manifest.functions.every((entry) => Object.keys(entry).sort().join(",") === "helper,name,template" &&
    entry.template === templateName), "unexpected function order, template mapping, or helper identity");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 9500,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) => line.startsWith("INTRUSIVE_COLORED_TREE_RANGE_ERASE "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedFunctions.map(([name, helper]) =>
  `INTRUSIVE_COLORED_TREE_RANGE_ERASE ${name}, ${helper}`)), "unexpected macro invocation order or helper mapping");
const labels = source.match(/^\.Ldt30_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 59 && new Set(labels).size === 59, "template must define 59 unique macro-local labels");
assert((source.match(/^\s+bl\s+\\recycle_helper$/gm) ?? []).length === 1 &&
  !/^\s*\.(?:word|short|byte)\b/m.test(source),
"template must contain one symbolic helper call and no literal/table data directives");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/).filter((line) => /^    [a-z]/.test(line)).length === 475,
  "template must contain exactly 475 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "c49230d41f71b654314f0c2d9e3cfb10891ee5be46a74be144e9f0920013b8dd",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 30 manifest and deterministic source mapping");
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
for (const [name, helper] of expectedFunctions) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 1900, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 1900,
  `${name} has an unexpected section, alignment, or post-body slot`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${name} must have one relocation section`);
  const relocationSection = relocationSections[0];
  assert(relocationSection.type === 9 && relocationSection.entrySize === 8 && relocationSection.size === 8,
    `${name} must have exactly one REL relocation`);
  const relocationInfo = data.readUInt32LE(relocationSection.offset + 4);
  const relocationSymbol = symbols[relocationInfo >>> 8];
  assert(data.readUInt32LE(relocationSection.offset) === 84 && (relocationInfo & 0xff) === 28 &&
    relocationSymbol?.name === helper, `${name} must call ${helper} symbolically at body offset 84`);
  const body = data.subarray(section.offset, section.offset + section.size);
  assert(body.length / 4 === 475, `${name} must contain exactly 475 ARM instructions`);
  const normalized = Buffer.from(body);
  normalized.fill(0, 84, 88);
  if (reference) assert(normalized.equals(reference), `${name} differs from the normalized complete template body`);
  else reference = normalized;
}

console.log("Validated 5 ARM duplicate-template 30 functions (9,500 body bytes, 2,375 instructions, one audited helper relocation each, no data slots)");
