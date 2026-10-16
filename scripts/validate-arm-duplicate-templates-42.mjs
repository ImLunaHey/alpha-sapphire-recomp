import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-42.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 42: ${message}`);
}

const templateName = "pooled_u64_key_red_black_tree_node_insertion";
const expectedTemplate = {
  bodySize: 920, instructionCount: 230, count: 2, internalLabels: 22, calls: 2, poolSlots: 0,
};
const callContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 128, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const functions = [
  { name: "func_0016F5B4", template: templateName },
  { name: "func_005538C8", template: templateName },
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 1840,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_42.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.poolContract) === JSON.stringify([]), "unexpected pool contract");
assert(JSON.stringify(manifest.functions) === JSON.stringify(functions), "unexpected function mapping");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/)
  .filter((line) => line.startsWith("    pooled_u64_key_red_black_tree_node_insertion func_"));
assert(JSON.stringify(invocations) === JSON.stringify(functions.map(({ name }) =>
  `    pooled_u64_key_red_black_tree_node_insertion ${name}`)),
"unexpected macro invocation order");
assert(JSON.stringify(source.match(/^\.Ldt42_[0-9a-f]{4}\\@\:$/gm) ?? []) === JSON.stringify([
  ".Ldt42_0070\\@:", ".Ldt42_00a8\\@:", ".Ldt42_00d0\\@:", ".Ldt42_0104\\@:",
  ".Ldt42_0124\\@:", ".Ldt42_0134\\@:", ".Ldt42_0148\\@:", ".Ldt42_0158\\@:",
  ".Ldt42_0180\\@:", ".Ldt42_01d4\\@:", ".Ldt42_01dc\\@:", ".Ldt42_0240\\@:",
  ".Ldt42_0248\\@:", ".Ldt42_0268\\@:", ".Ldt42_027c\\@:", ".Ldt42_02d0\\@:",
  ".Ldt42_02d8\\@:", ".Ldt42_033c\\@:", ".Ldt42_0340\\@:", ".Ldt42_0344\\@:",
  ".Ldt42_0364\\@:", ".Ldt42_0378\\@:",
]), "template must define the 22 approved macro-local control labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 2 && !/^    blx\b/m.test(source),
  "template must contain the approved two-call schedule");
assert(!/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/)
  .filter((line) => /^    [a-z]/.test(line)).length === 230,
"template must contain exactly 230 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "e38aca79b7e555416a1cf0779b881c13f28148e4ea43cd6775548f884fd1b9c8",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 42 manifest and deterministic source mapping");
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
const allocator = symbolsByName.get("func_00184990");
assert(allocator, "missing allocator symbol identity func_00184990");
const allocatorIsDefined = allocator.sectionIndex !== 0;
if (process.argv[3] === "--target") {
  assert(allocatorIsDefined, "target allocator must be defined in the target object");
}
if (allocatorIsDefined) {
  const allocatorSection = sections[allocator.sectionIndex];
  assert((allocator.info & 0xf) === 2 && (allocator.info >>> 4) === 1 &&
    allocator.value === 0 && allocator.size > 0 &&
    allocatorSection?.name === ".text.func_00184990" && allocatorSection.type === 1 &&
    (allocatorSection.flags & 0x6) === 0x6,
  "object-defined allocator must be a global function in its own executable section");
} else {
  assert(allocator.size === 0, "undefined probe/base allocator identity must have zero size");
}

let reference;
for (const entry of functions) {
  const symbol = symbolsByName.get(entry.name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 920, `${entry.name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${entry.name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 920, `${entry.name} has an unexpected executable section layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${entry.name} must have one relocation section`);
  const relocations = relocationSections[0];
  assert(relocations.type === 9 && relocations.entrySize === 8 && relocations.size === 16,
    `${entry.name} must have exactly two REL relocations`);
  for (let index = 0; index < callContract.length; index += 1) {
    const offset = relocations.offset + index * relocations.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    assert(relocationOffset === callContract[index].offset && (relocationInfo & 0xff) === 28 &&
      relocationSymbol === allocator && relocationSymbol.name === callContract[index].symbol,
    `${entry.name} has an unexpected direct-call relocation`);
  }
  const body = Buffer.from(data.subarray(section.offset, section.offset + symbol.size));
  for (const { offset } of callContract) body.fill(0, offset, offset + 4);
  if (reference) assert(body.equals(reference), `${entry.name} differs from the normalized complete template body`);
  else reference = body;
}

console.log("Validated 2 ARM duplicate-template 42 functions (1,840 body bytes, 460 instructions, 4 call relocations in 1 equality class)");
