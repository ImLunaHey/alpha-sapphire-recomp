import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-43.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 43: ${message}`);
}

const templateName = "pooled_word_key_red_black_tree_node_insertion";
const expectedTemplate = {
  bodySize: 892, instructionCount: 223, count: 2, internalLabels: 21, calls: 3, poolSlots: 0,
};
const callContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 216, kind: "R_ARM_CALL", symbol: "payloadInitializer" },
];
const functions = [
  { name: "func_0018FC6C", template: templateName, payloadInitializer: "func_0018E1E0" },
  { name: "func_00560E5C", template: templateName, payloadInitializer: "func_0029F668" },
];

assert(manifest.version === 1 && manifest.mode === "arm" && manifest.expectedBodyBytes === 1784,
  "invalid manifest header");
assert(manifest.source === "src/main/arm_duplicate_templates_43.S", "unexpected source path");
assert(JSON.stringify(manifest.templates) === JSON.stringify({ [templateName]: expectedTemplate }),
  "unexpected template definition");
assert(JSON.stringify(manifest.callContract) === JSON.stringify(callContract),
  "unexpected direct-call contract");
assert(JSON.stringify(manifest.poolContract) === JSON.stringify([]), "unexpected pool contract");
assert(JSON.stringify(manifest.functions) === JSON.stringify(functions), "unexpected function mapping");
assert(sources.sources.filter(({ path, mode }) => path === manifest.source && mode === "arm").length === 1,
  "source must occur once in config/sources.json in ARM mode");

const invocations = source.split(/\r?\n/)
  .filter((line) => line.startsWith("    pooled_word_key_red_black_tree_node_insertion func_"));
assert(JSON.stringify(invocations) === JSON.stringify(functions.map(({ name, payloadInitializer }) =>
  `    pooled_word_key_red_black_tree_node_insertion ${name}, ${payloadInitializer}`)),
"unexpected macro invocation order");
assert(JSON.stringify(source.match(/^\.Ldt43_[0-9a-f]{4}\\@\:$/gm) ?? []) === JSON.stringify([
  ".Ldt43_0070\\@:", ".Ldt43_00b4\\@:", ".Ldt43_00dc\\@:", ".Ldt43_0108\\@:",
  ".Ldt43_0128\\@:", ".Ldt43_0138\\@:", ".Ldt43_014c\\@:", ".Ldt43_015c\\@:",
  ".Ldt43_0184\\@:", ".Ldt43_01d8\\@:", ".Ldt43_01e0\\@:", ".Ldt43_0244\\@:",
  ".Ldt43_024c\\@:", ".Ldt43_026c\\@:", ".Ldt43_0280\\@:", ".Ldt43_02d4\\@:",
  ".Ldt43_02dc\\@:", ".Ldt43_0340\\@:", ".Ldt43_0344\\@:", ".Ldt43_0348\\@:",
  ".Ldt43_0368\\@:",
]), "template must define the 21 approved macro-local control labels");
assert((source.match(/^    bl\b/gm) ?? []).length === 3 && !/^    blx\b/m.test(source),
  "template must contain the approved three-call schedule");
assert(!/^\s*\.(?:word|inst|long|4byte|byte|hword|short)\b/im.test(source),
  "source must not contain raw encodings or data objects");
const templateMatch = source.match(/\\name:\n([\s\S]*?)    \.size \\name/);
assert(templateMatch && templateMatch[1].split(/\r?\n/)
  .filter((line) => /^    [a-z]/.test(line)).length === 223,
"template must contain exactly 223 ARM instructions");
assert(createHash("sha256").update(templateMatch[1].trim()).digest("hex") ===
  "b57dcb5c912d2c97a1b8da502027554a2088b54c44e078e5a85ea877f588d24a",
"template body differs from the approved exact mnemonic schedule");

if (!process.argv[2]) {
  console.log("Validated duplicate-template 43 manifest and deterministic source mapping");
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
for (const name of ["func_00184990", ...functions.map(({ payloadInitializer }) => payloadInitializer)]) {
  const identity = symbolsByName.get(name);
  assert(identity, `missing direct-call symbol identity ${name}`);
  if (process.argv[3] === "--target") {
    assert(identity.sectionIndex !== 0, `target call identity ${name} must be defined in the target object`);
  } else if (identity.sectionIndex === 0) {
    assert(identity.size === 0, `undefined base call identity ${name} must have zero size`);
  }
}

let reference;
for (const entry of functions) {
  const symbol = symbolsByName.get(entry.name);
  assert(symbol && (symbol.info & 0xf) === 2 && (symbol.info >>> 4) === 1 &&
    symbol.value === 0 && symbol.size === 892, `${entry.name} is not the expected global function symbol`);
  const section = sections[symbol.sectionIndex];
  assert(section?.name === `.text.${entry.name}` && section.type === 1 && (section.flags & 0x6) === 0x6 &&
    section.alignment >= 4 && section.size === 892, `${entry.name} has an unexpected executable section layout`);
  const relocationSections = sections.filter(({ type, info }) => (type === 9 || type === 4) && info === section.index);
  assert(relocationSections.length === 1, `${entry.name} must have one relocation section`);
  const relocations = relocationSections[0];
  assert(relocations.type === 9 && relocations.entrySize === 8 && relocations.size === 24,
    `${entry.name} must have exactly three REL relocations`);
  for (let index = 0; index < callContract.length; index += 1) {
    const offset = relocations.offset + index * relocations.entrySize;
    const relocationOffset = data.readUInt32LE(offset);
    const relocationInfo = data.readUInt32LE(offset + 4);
    const relocationSymbol = symbols[relocationInfo >>> 8];
    const expectedName = callContract[index].symbol === "payloadInitializer"
      ? entry.payloadInitializer : callContract[index].symbol;
    assert(relocationOffset === callContract[index].offset && (relocationInfo & 0xff) === 28 &&
      relocationSymbol === symbolsByName.get(expectedName),
    `${entry.name} has an unexpected direct-call relocation at ${callContract[index].offset}`);
  }
  const body = Buffer.from(data.subarray(section.offset, section.offset + symbol.size));
  for (const { offset } of callContract) body.fill(0, offset, offset + 4);
  if (reference) assert(body.equals(reference), `${entry.name} differs from the normalized complete template body`);
  else reference = body;
}

console.log("Validated 2 ARM duplicate-template 43 functions (1,784 body bytes, 446 instructions, 6 call relocations in 3 identity classes)");
