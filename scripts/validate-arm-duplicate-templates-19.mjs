import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-19.json"), "utf8"));
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 19: ${message}`);
}

const macroForTemplate = new Map([
  ["atomicMemberRelease", "ATOMIC_MEMBER_RELEASE"],
  ["allocatedTypedPair", "ALLOCATED_TYPED_PAIR"],
  ["byteWindowPredicate", "BYTE_WINDOW_PREDICATE"],
  ["activeEntryCount", "ACTIVE_ENTRY_COUNT"],
  ["ownedObjectRelease", "OWNED_OBJECT_RELEASE"],
  ["halfwordStreamXor", "HALFWORD_STREAM_XOR"],
]);

const expectedInstructions = new Map([
  ["ATOMIC_MEMBER_RELEASE", [
    "push {r4, lr}", "mov r4, r0", "ldr r0, 99f", "mvn r2, #0", "str r0, [r4]",
    "ldr r0, [r4, #8]", "add r3, r0, #4", "ldrex r1, [r3]", "add r1, r1, r2",
    "strex r12, r1, [r3]", "cmp r12, #0", "bne 1b", "cmp r1, #0",
    "ldrbeq r1, [r0, #8]", "cmpeq r1, #0", "moveq r1, #1", "strbeq r1, [r0, #8]",
    "bne 2f", "ldr r1, [r0]", "ldr r1, [r1, #4]", "blx r1", "mov r0, #0",
    "str r0, [r4, #8]", "mov r0, r4", "pop {r4, pc}",
  ]],
  ["ALLOCATED_TYPED_PAIR", [
    "push {r4, lr}", "ldr r0, [r1]", "mov r4, r1", "mov r2, #4", "mov r1, #8",
    "ldr r3, [r0, #8]", "mov r0, r4", "blx r3", "cmp r0, #0", "beq 1f",
    "ldr r1, 99f", "stm r0, {r1, r4}", "pop {r4, pc}",
  ]],
  ["BYTE_WINDOW_PREDICATE", [
    "ldrb r1, [r0, #14]", "cmp r1, #0", "bne 2f", "ldr r1, 99f",
    "ldrb r2, [r1, #24]", "cmp r2, #0", "beq 1f", "ldrb r1, [r1, #25]",
    "ldrb r0, [r0, #15]", "sub r0, r1, r0", "sxtb r0, r0", "cmp r0, #2",
    "ble 2f", "mov r0, #0", "bx lr", "mov r0, #1", "bx lr",
  ]],
  ["ACTIVE_ENTRY_COUNT", [
    "ldr r1, 96f", "mov r0, #0", "ldr r1, [r1, #24]", "cmp r1, #0", "ldr r1, 97f",
    "movne r0, #1", "ldr r1, [r1, #52]", "cmp r1, #0", "ldr r1, 98f",
    "addne r0, r0, #1", "ldr r1, [r1, #80]", "cmp r1, #0", "ldr r1, 99f",
    "addne r0, r0, #1", "ldr r1, [r1, #108]", "cmp r1, #0",
    "addne r0, r0, #1", "bx lr",
  ]],
  ["OWNED_OBJECT_RELEASE", [
    "push {r4, lr}", "ldr r4, 99f", "ldr r0, [r4]", "cmp r0, #0", "beq 1f",
    "ldr r1, [r0]", "ldr r1, [r1, #4]", "blx r1", "mov r0, #0", "str r0, [r4]",
    "pop {r4, pc}",
  ]],
  ["HALFWORD_STREAM_XOR", [
    "mov r3, #0", "cmp r3, r1, lsr #1", "bxcs lr", "push {r4, r5}", "ldr r12, 99f",
    "mul r2, r2, r12", "add r12, r0, r3, lsl #1", "add r3, r3, #1", "ldrh r5, [r12]",
    "add r2, r2, #0x6000", "add r2, r2, #0x73", "cmp r3, r1, lsr #1",
    "eor r4, r5, r2, lsr #16", "strh r4, [r12]", "bcc 1b", "pop {r4, r5}", "bx lr",
  ]],
]);

function macroInstructions(name) {
  const match = source.match(new RegExp(`^\\.macro ${name}[^\\n]*\\n([\\s\\S]*?)^\\.endm$`, "m"));
  assert(match, `missing macro ${name}`);
  return match[1].split("\n").map((line) => line.trim()).filter((line) =>
    line && !/^([0-9]+:|BEGIN_FUNCTION|END_FUNCTION|\.word )/.test(line));
}

assert(manifest.version === 1 && manifest.mode === "arm", "invalid manifest header");
assert(manifest.expectedBodyBytes === 904, "expected body-byte total must be 904");
assert(manifest.functions.length === 14, "manifest must describe 14 functions");
assert(new Set(manifest.functions.map(({ name }) => name)).size === 14, "function names must be unique");
assert(Object.keys(manifest.templates).length === 6, "manifest must describe six templates");
assert(manifest.functions.reduce((sum, entry) => sum + manifest.templates[entry.template].bodySize, 0) === 904,
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

const expectedIdentityUses = new Map([
  ["objectVtable00170CC0", 1], ["objectVtable002AFCCC", 1],
  ["type002FC244", 1], ["type00302C5C", 1], ["type00305720", 1],
  ["byteWindowState", 2], ["activeEntryBase1", 2], ["activeEntryBase2", 2],
  ["activeEntryBase3", 2], ["activeEntryBase4", 2],
  ["ownedObjectSlot003B0994", 1], ["ownedObjectSlot003B0B80", 1],
  ["ownedObjectSlot003B14C0", 1], ["lcgMultiplier", 2],
]);
const identityUses = manifest.functions.flatMap(({ literals }) => literals.map(({ identity }) => identity));
assert(Object.keys(manifest.literalIdentities).length === expectedIdentityUses.size,
  "literal identity set differs from the deterministic contract");
assert(new Set(Object.values(manifest.literalIdentities)).size === expectedIdentityUses.size,
  "distinct literal identities must use distinct symbols");
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
  const up = (word & (1 << 23)) !== 0;
  const displacement = word & 0xfff;
  return up ? pc + displacement : pc - displacement;
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
      assert(relocation && relocation.type === 2 &&
        relocation.symbol === manifest.literalIdentities[literal.identity],
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
