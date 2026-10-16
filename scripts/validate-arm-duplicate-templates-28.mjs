import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-28.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 28: ${message}`);
}

const expectedTemplate = {
  bodySize: 1632,
  instructionCount: 408,
  count: 9,
  internalLabels: 48,
};
const expectedNames = [
  "func_0014456C",
  "func_0018330C",
  "func_00551088",
  "func_0055266C",
  "func_00557610",
  "func_00558028",
  "func_00561C44",
  "func_00568484",
  "func_00568B20",
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 14688,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_28.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ intrusive_colored_tree_erase_b: expectedTemplate }),
  "unexpected template definition");
assert(Array.isArray(manifest.functions) && manifest.functions.length === 9,
  "manifest must describe nine functions");
assert(JSON.stringify(manifest.functions.map(({ name }) => name)) === JSON.stringify(expectedNames) &&
  manifest.functions.every((entry) => Object.keys(entry).sort().join(",") === "name,template" &&
    entry.template === "intrusive_colored_tree_erase_b"),
"unexpected function order or template mapping");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 14688,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) => line.startsWith("INTRUSIVE_COLORED_TREE_ERASE_B "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedNames.map((name) =>
  `INTRUSIVE_COLORED_TREE_ERASE_B ${name}`)), "unexpected macro invocation order");
const labels = source.match(/^\.Ldt28_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 48 && new Set(labels).size === 48,
  "template must define 48 unique macro-local labels");
assert(!/(?:^|\s)(?:bl|blx)\s/im.test(source) && !/^\s*\.(?:word|short|byte)\b/m.test(source),
  "template must not contain calls, literal/table directives, or data");
const instructionLines = source.split(/\r?\n/).filter((line) =>
  /^\s+(?:push|pop|bx|b(?:eq|ne|lt)?|ldr(?:b|eq|ne|bne)?|str(?:b|eq|ne|bne)?|mov(?:eq|ne)?|cmp(?:ne)?|sub)\s/.test(line));
assert(instructionLines.length === 408, "template must contain exactly 408 ARM instructions");
const templateBody = source.match(/\\name:\n([\s\S]*?)    \.size \\name/)?.[1].trim();
assert(templateBody !== undefined && createHash("sha256").update(templateBody).digest("hex") ===
  "be7acda76a896c54b2a9c7979ef7a774cf71bed53d5b0614474c8e6d3d4000d6",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 28 manifest and deterministic source mapping");
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
const relocationTargets = new Set(sections.filter(({ type }) => type === 9 || type === 4).map(({ info }) => info));

let reference;
for (const name of expectedNames) {
  const symbol = symbolsByName.get(name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 1632, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 1632,
  `${name} has an unexpected section, alignment, or post-body slot`);
  assert(!relocationTargets.has(section.index), `${name} must not have relocations`);
  const body = data.subarray(section.offset, section.offset + section.size);
  assert(body.length / 4 === 408, `${name} must contain exactly 408 ARM instructions`);
  if (reference) assert(body.equals(reference), `${name} differs from the complete template body`);
  else reference = body;
}

console.log("Validated 9 ARM duplicate-template 28 functions (14,688 body bytes, 3,672 instructions, no relocations or data slots)");
