import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-20.json"), "utf8"));
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 20: ${message}`);
}

const macroForTemplate = new Map([
  ["twoWordZero", "TWO_WORD_ZERO"],
  ["typedSentinel", "TYPED_SENTINEL"],
  ["biasedHalfwordAddress", "BIASED_HALFWORD_ADDRESS"],
  ["fourWordByteSwap", "FOUR_WORD_BYTE_SWAP"],
  ["optionalBacklinkDetach", "OPTIONAL_BACKLINK_DETACH"],
  ["nullableVtableTail", "NULLABLE_VTABLE_TAIL"],
]);

const expectedInstructions = new Map([
  ["TWO_WORD_ZERO", [
    "mov r1, #0", "str r1, [r0]", "str r1, [r0, #4]", "bx lr",
  ]],
  ["TYPED_SENTINEL", [
    "ldr r1, 99f", "mov r2, #0", "add r3, r0, #32", "str r1, [r0]",
    "add r1, r0, #28", "strd r2, [r1]", "str r2, [r0, #4]", "str r3, [r0, #36]",
    "str r2, [r0, #8]", "str r2, [r0, #12]", "str r2, [r0, #16]",
    "str r2, [r0, #20]", "strb r2, [r0, #24]", "bx lr",
  ]],
  ["BIASED_HALFWORD_ADDRESS", [
    "push {r4, r5, r6, lr}", "mov r5, r0", "sub r0, r1, #0x4000", "cmp r0, #0x178",
    "mov r4, r1", "blt 1f", "mov r2, #0", "mov r1, r2", "mov r0, r2", "mov r0, r0",
    "add r0, r5, r4, lsl #1", "sub r0, r0, #0x7c00", "sub r0, r0, #0x3fc",
    "pop {r4, r5, r6, pc}",
  ]],
  ["FOUR_WORD_BYTE_SWAP", [
    "ldr r1, [r0]", "rev r1, r1", "str r1, [r0]", "ldr r1, [r0, #4]", "rev r1, r1",
    "str r1, [r0, #4]", "ldr r1, [r0, #8]", "rev r1, r1", "str r1, [r0, #8]",
    "ldr r1, [r0, #12]", "rev r1, r1", "str r1, [r0, #12]", "bx lr",
  ]],
  ["OPTIONAL_BACKLINK_DETACH", [
    "ldr r1, [r0]", "cmp r1, #0", "beq 2f", "ldr r3, [r1, #276]", "mov r2, #0",
    "cmp r3, r0", "bne 1f", "str r2, [r1, #276]", "ldr r1, [r0]", "cmp r1, #0",
    "beq 2f", "str r2, [r0]", "bx lr",
  ]],
  ["NULLABLE_VTABLE_TAIL", [
    "cmp r0, #0", "beq 1f", "ldr r1, [r0]", "ldr r1, [r1, #4]", "bx r1", "bx lr",
  ]],
]);

function macroInstructions(name) {
  const match = source.match(new RegExp(`^\\.macro ${name}[^\\n]*\\n([\\s\\S]*?)^\\.endm$`, "m"));
  assert(match, `missing macro ${name}`);
  return match[1].split("\n").map((line) => line.trim()).filter((line) =>
    line && !/^([0-9]+:|BEGIN_FUNCTION|END_FUNCTION|\.word )/.test(line));
}

assert(manifest.version === 1 && manifest.mode === "arm", "invalid manifest header");
assert(manifest.expectedBodyBytes === 640, "expected body-byte total must be 640");
assert(manifest.functions.length === 19, "manifest must describe 19 functions");
assert(new Set(manifest.functions.map(({ name }) => name)).size === 19, "function names must be unique");
assert(Object.keys(manifest.templates).length === 6, "manifest must describe six templates");
assert(manifest.functions.reduce((sum, entry) => sum + manifest.templates[entry.template].bodySize, 0) === 640,
  "body-byte total does not match manifest");
const configured = sources.sources.filter(({ path }) => path === manifest.source);
assert(configured.length === 1 && configured[0].mode === "arm",
  "source must occur once in config/sources.json with ARM mode");

for (const [template, details] of Object.entries(manifest.templates)) {
  assert(macroForTemplate.has(template), `unknown template ${template}`);
  assert(manifest.functions.filter((entry) => entry.template === template).length === details.count,
    `${template} has the wrong function count`);
  const macro = macroForTemplate.get(template);
  const actual = macroInstructions(macro);
  assert(JSON.stringify(actual) === JSON.stringify(expectedInstructions.get(macro)),
    `${template} instruction sequence differs from the deterministic source contract`);
  assert(actual.length * 4 === details.bodySize, `${template} instruction count does not match its body size`);
}

for (const entry of manifest.functions) {
  const details = manifest.templates[entry.template];
  const macro = macroForTemplate.get(entry.template);
  const symbols = entry.literals.map(({ identity }) => manifest.literalIdentities[identity]);
  assert(symbols.every(Boolean), `${entry.name} names an unknown literal identity`);
  const invocation = [entry.name, ...symbols].join(", ");
  assert(source.split("\n").filter((line) => line.trim() === `${macro} ${invocation}`).length === 1,
    `${entry.name} does not have its exact deterministic macro invocation`);
  assert((source.match(new RegExp(`\\b${entry.name}\\b`, "g")) ?? []).length === 1,
    `${entry.name} must occur exactly once in the source`);
  for (const [index, literal] of entry.literals.entries()) {
    assert(literal.offset === details.bodySize + index * 4, `${entry.name} literals must immediately follow its body`);
    assert(literal.loadOffset < details.bodySize && literal.loadOffset % 4 === 0,
      `${entry.name} has an invalid literal-load offset`);
  }
}

const expectedIdentityUses = new Map([["type00115044", 1], ["type001150C8", 1]]);
const identityUses = manifest.functions.flatMap(({ literals }) => literals.map(({ identity }) => identity));
assert(Object.keys(manifest.literalIdentities).length === expectedIdentityUses.size,
  "literal identity set differs from the deterministic contract");
assert(new Set(Object.values(manifest.literalIdentities)).size === expectedIdentityUses.size,
  "the two type pools must use distinct symbols");
for (const [identity, count] of expectedIdentityUses) {
  assert(identityUses.filter((candidate) => candidate === identity).length === count,
    `${identity} has the wrong equality-class size`);
  const symbol = manifest.literalIdentities[identity];
  assert(new RegExp(`^\\.extern\\s+${symbol}\\s*$`, "m").test(source), `missing external identity ${symbol}`);
}

function parseElf(path) {
  const data = readFileSync(path);
  assert(data.length >= 52 && data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])),
    `${path} is not an ELF file`);
  assert(data[4] === 1 && data[5] === 1, "expected ELF32 little-endian input");
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  const shnum = data.readUInt16LE(48);
  const shstrndx = data.readUInt16LE(50);
  assert(shentsize >= 40 && shoff + shentsize * shnum <= data.length, "invalid section table");
  const sections = [];
  for (let index = 0; index < shnum; index += 1) {
    const at = shoff + index * shentsize;
    sections.push({ index, nameOffset: data.readUInt32LE(at), type: data.readUInt32LE(at + 4),
      offset: data.readUInt32LE(at + 16), size: data.readUInt32LE(at + 20), link: data.readUInt32LE(at + 24),
      info: data.readUInt32LE(at + 28), entsize: data.readUInt32LE(at + 36) });
  }
  function stringAt(table, offset) {
    let end = offset;
    while (end < table.length && table[end] !== 0) end += 1;
    return table.toString("utf8", offset, end);
  }
  const namesHeader = sections[shstrndx];
  assert(namesHeader, "missing section-name string table");
  const names = data.subarray(namesHeader.offset, namesHeader.offset + namesHeader.size);
  for (const section of sections) section.name = stringAt(names, section.nameOffset);
  const symtab = sections.find(({ type }) => type === 2);
  assert(symtab && symtab.entsize >= 16, "missing ELF symbol table");
  const stringsHeader = sections[symtab.link];
  const strings = data.subarray(stringsHeader.offset, stringsHeader.offset + stringsHeader.size);
  const symbols = [];
  for (let at = symtab.offset; at < symtab.offset + symtab.size; at += symtab.entsize) {
    symbols.push({ name: stringAt(strings, data.readUInt32LE(at)), value: data.readUInt32LE(at + 4),
      size: data.readUInt32LE(at + 8), info: data[at + 12], shndx: data.readUInt16LE(at + 14) });
  }
  const relocations = [];
  for (const relocationSection of sections.filter(({ type }) => type === 9)) {
    const target = sections[relocationSection.info];
    const step = relocationSection.entsize || 8;
    for (let at = relocationSection.offset; at < relocationSection.offset + relocationSection.size; at += step) {
      const info = data.readUInt32LE(at + 4);
      relocations.push({ section: target.name, offset: data.readUInt32LE(at), type: info & 0xff,
        symbol: symbols[info >>> 8]?.name });
    }
  }
  return { data, sections, symbols, relocations };
}

function literalTarget(word, instructionOffset) {
  const pc = instructionOffset + 8;
  const displacement = word & 0xfff;
  return (word & (1 << 23)) !== 0 ? pc + displacement : pc - displacement;
}

if (process.argv[2]) {
  const elf = parseElf(resolve(process.cwd(), process.argv[2]));
  const symbolByName = new Map(elf.symbols.map((symbol) => [symbol.name, symbol]));
  const bodyByName = new Map();
  for (const entry of manifest.functions) {
    const bodySize = manifest.templates[entry.template].bodySize;
    const sectionName = `.text.${entry.name}`;
    const section = elf.sections.find(({ name }) => name === sectionName);
    const symbol = symbolByName.get(entry.name);
    assert(section, `missing section ${sectionName}`);
    assert(symbol && (symbol.info & 0xf) === 2, `missing function symbol ${entry.name}`);
    assert(symbol.shndx === section.index && symbol.value === 0, `${entry.name} must begin its section`);
    assert(symbol.size === bodySize, `${entry.name} has body size ${symbol.size}, expected ${bodySize}`);
    assert(section.size === bodySize + entry.literals.length * 4, `${sectionName} has the wrong size`);
    const bytes = elf.data.subarray(section.offset, section.offset + section.size);
    bodyByName.set(entry.name, bytes.subarray(0, bodySize));
    const relocations = elf.relocations.filter(({ section: target }) => target === sectionName);
    assert(relocations.length === entry.literals.length, `${entry.name} has an unexpected relocation count`);
    for (const literal of entry.literals) {
      const relocation = relocations.find(({ offset }) => offset === literal.offset);
      assert(relocation && relocation.type === 2 && relocation.symbol === manifest.literalIdentities[literal.identity],
        `${entry.name} has the wrong relocation at literal offset ${literal.offset}`);
      assert(literalTarget(bytes.readUInt32LE(literal.loadOffset), literal.loadOffset) === literal.offset,
        `${entry.name} literal load at ${literal.loadOffset} targets the wrong slot`);
    }
  }
  for (const template of Object.keys(manifest.templates)) {
    const names = manifest.functions.filter((entry) => entry.template === template).map(({ name }) => name);
    for (const name of names.slice(1)) {
      assert(bodyByName.get(names[0]).equals(bodyByName.get(name)),
        `${name} body differs from the ${template} template`);
    }
  }
}

console.log(`Validated ${manifest.functions.length} ARM duplicate-template functions (${manifest.expectedBodyBytes} body bytes).`);
