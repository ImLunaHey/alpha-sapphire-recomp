import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-27.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 27: ${message}`);
}

const expectedTemplate = {
  bodySize: 1628,
  instructionCount: 407,
  count: 10,
  internalLabels: 49,
};
const expectedNames = [
  "func_00182CB0",
  "func_00189A24",
  "func_00192484",
  "func_00553230",
  "func_00559984",
  "func_0055A388",
  "func_0055EE44",
  "func_0056265C",
  "func_00564E30",
  "func_00567A70",
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 16280,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_27.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ intrusive_colored_tree_erase: expectedTemplate }),
  "unexpected template definition");
assert(Array.isArray(manifest.functions) && manifest.functions.length === 10,
  "manifest must describe ten functions");
assert(JSON.stringify(manifest.functions.map(({ name }) => name)) === JSON.stringify(expectedNames) &&
  manifest.functions.every((entry) => Object.keys(entry).sort().join(",") === "name,template" &&
    entry.template === "intrusive_colored_tree_erase"),
"unexpected function order or template mapping");
assert(manifest.functions.reduce((total, { template }) => total + manifest.templates[template].bodySize, 0) === 16280,
  "body-byte total does not match manifest");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/).filter((line) => line.startsWith("INTRUSIVE_COLORED_TREE_ERASE "));
assert(JSON.stringify(invocations) === JSON.stringify(expectedNames.map((name) =>
  `INTRUSIVE_COLORED_TREE_ERASE ${name}`)), "unexpected macro invocation order");
const labels = source.match(/^\.Ldt27_\\@_[0-9a-f]{4}:$/gm) ?? [];
assert(labels.length === 49 && new Set(labels).size === 49,
  "template must define 49 unique macro-local labels");
assert(!/(?:^|\s)(?:bl|blx)\s/im.test(source) && !/^\s*\.(?:word|short|byte)\b/m.test(source),
  "template must not contain calls, literal/table directives, or data");
const instructionLines = source.split(/\r?\n/).filter((line) =>
  /^\s+(?:push|pop|bx|b(?:eq|ne|lt)?|ldr(?:b|eq|ne|bne)?|str(?:b|eq|ne|bne)?|mov(?:eq|ne)?|cmp(?:ne)?|sub)\s/.test(line));
assert(instructionLines.length === 407, "template must contain exactly 407 ARM instructions");
const templateBody = source.match(/\\name:\n([\s\S]*?)    \.size \\name/)?.[1].trim();
assert(templateBody !== undefined && createHash("sha256").update(templateBody).digest("hex") ===
  "78113a7867faad91eac13137a02bb951323760b1c5cfcb551524b46ff563c04c",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 27 manifest and deterministic source mapping");
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
    symbol.value === 0 && symbol.size === 1628, `${name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 1628,
  `${name} has an unexpected section, alignment, or post-body slot`);
  assert(!relocationTargets.has(section.index), `${name} must not have relocations`);
  const body = data.subarray(section.offset, section.offset + section.size);
  assert(body.length / 4 === 407, `${name} must contain exactly 407 ARM instructions`);
  if (reference) assert(body.equals(reference), `${name} differs from the complete template body`);
  else reference = body;
}

console.log("Validated 10 ARM duplicate-template 27 functions (16,280 body bytes, 4,070 instructions, no relocations or data slots)");
