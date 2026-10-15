import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-18.json"), "utf8"));
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 18: ${message}`);
}

const macroForTemplate = new Map([
  ["vtableChainClear", "VTABLE_CHAIN_CLEAR"],
  ["backwardClearRecycle", "BACKWARD_CLEAR_RECYCLE"],
  ["fourBitFloat", "FOUR_BIT_FLOAT"],
  ["allocatedObject16", "ALLOCATED_OBJECT_16"],
  ["rangeMembership", "RANGE_MEMBERSHIP"],
  ["allocatedOwnerPair", "ALLOCATED_OWNER_PAIR"],
]);

const expectedInstructions = new Map([
  ["VTABLE_CHAIN_CLEAR", [
    "ldr r1, 99f", "str r1, [r0]", "ldr r1, [r0, #4]", "ldr r12, [r0, #12]",
    "cmp r1, r12", "bxeq lr", "push {r4, r5}", "mov r4, #0", "ldrd r2, [r1, #4]",
    "cmp r3, #0", "strne r2, [r3, #4]", "cmp r2, #0", "str r4, [r1, #8]",
    "strne r3, [r2, #8]", "str r4, [r1, #4]", "ldr r5, [r0, #4]", "cmp r5, r1",
    "streq r2, [r0, #4]", "ldr r5, [r0, #8]", "cmp r5, r1", "streq r3, [r0, #8]",
    "ldr r1, [r0, #16]", "cmp r2, r12", "sub r1, r1, #1", "str r1, [r0, #16]",
    "mov r1, r2", "bne 1b", "pop {r4, r5}", "bx lr",
  ]],
  ["BACKWARD_CLEAR_RECYCLE", [
    "push {r4, r5, r6, r7, r8, lr}", "mov r4, r0", "ldr r6, [r0, #16]", "ldr r5, [r6]",
    "cmp r5, r6", "beq 2f", "ldr r7, [r4, #16]", "cmp r5, r7", "beq 3f",
    "ldr r3, [r5, #4]", "ldr r7, [r5]", "add r1, r5, #8", "str r7, [r3]",
    "ldm r5, {r0, r2}", "str r2, [r0, #4]", "ldr r0, [r4, #20]", "sub r0, r0, #1",
    "str r0, [r4, #20]", "ldr r0, [r5, #8]", "ldr r2, [r0]", "mov r0, r1", "blx r2",
    "ldr r0, [r4, #4]", "str r0, [r5]", "str r5, [r4, #4]", "cmp r7, r6", "mov r5, r7",
    "bne 1b", "pop {r4, r5, r6, r7, r8, pc}",
  ]],
  ["FOUR_BIT_FLOAT", [
    "push {r4, r5, r6, r7}", "add r6, r0, #4", "mov r12, #0", "ldr r4, [r6]", "mov r2, #3",
    "mov r0, r12", "mov r1, r12", "mov r3, #4", "mov r5, #1", "tst r4, r5, lsl r1",
    "beq 2f", "cmp r1, r2", "add r0, r0, #1", "moveq r12, #1", "subs r3, r3, #1",
    "add r1, r1, #1", "bne 1b", "cmp r12, #0", "beq 3f", "cmp r0, #0", "beq 3f",
    "add r0, r6, r0, lsl #2", "vldr s0, [r0]", "pop {r4, r5, r6, r7}", "bx lr",
    "pop {r4, r5, r6, r7}", "vldr s0, 99f", "bx lr",
  ]],
  ["ALLOCATED_OBJECT_16", [
    "push {r4, r5, r6, lr}", "mov r4, r0", "ldr r0, [r0]", "mov r5, r1", "mov r2, #4",
    "mov r1, #16", "ldr r3, [r0, #8]", "mov r0, r4", "blx r3", "cmp r0, #0", "beq 1f",
    "mov r1, #0", "str r4, [r0, #4]", "strb r1, [r0, #8]", "ldr r1, 99f", "str r1, [r0]",
    "str r5, [r0, #12]", "pop {r4, r5, r6, pc}",
  ]],
  ["RANGE_MEMBERSHIP", [
    "ldrb r2, [r0, #4]", "cmp r2, #2", "beq 1f", "cmp r2, #3", "bne 3f", "b 4f",
    "ldrh r0, [r0, #6]", "cmp r0, r1", "bne 3f", "mov r0, #1", "bx lr", "mov r0, #0",
    "bx lr", "add r2, r0, #8", "ldr r0, [r0, #12]", "cmp r0, r2", "beq 3b",
    "ldrh r12, [r0, #8]", "add r3, r0, #8", "cmp r12, r1", "ldrhls r12, [r3, #2]",
    "cmpls r1, r12", "bls 2b", "ldr r0, [r0, #4]", "cmp r0, r2", "bne 5b", "b 3b",
  ]],
  ["ALLOCATED_OWNER_PAIR", [
    "push {r4, lr}", "mov r4, r0", "ldr r0, [r0]", "mov r2, #4", "mov r1, #8",
    "ldr r3, [r0, #8]", "mov r0, r4", "blx r3", "cmp r0, #0", "beq 1f", "ldr r1, 99f",
    "stm r0, {r1, r4}", "pop {r4, pc}",
  ]],
]);

function macroInstructions(name) {
  const match = source.match(new RegExp(`^\\.macro ${name}[^\\n]*\\n([\\s\\S]*?)^\\.endm$`, "m"));
  assert(match, `missing macro ${name}`);
  return match[1].split("\n").map((line) => line.trim()).filter((line) =>
    line && !/^([0-9]+:|BEGIN_FUNCTION|END_FUNCTION|\.word )/.test(line));
}

assert(manifest.version === 1 && manifest.mode === "arm", "invalid manifest header");
assert(manifest.expectedBodyBytes === 1328, "expected body-byte total must be 1328");
assert(manifest.functions.length === 15, "manifest must describe 15 functions");
assert(new Set(manifest.functions.map(({ name }) => name)).size === 15, "function names must be unique");
assert(Object.keys(manifest.templates).length === 6, "manifest must describe six templates");
assert(manifest.functions.reduce((sum, entry) => sum + manifest.templates[entry.template].bodySize, 0) === 1328,
  "body-byte total does not match manifest");
const configured = sources.sources.filter(({ path }) => path === manifest.source);
assert(configured.length === 1 && configured[0].mode === "arm",
  "source must occur once in config/sources.json with ARM mode");

for (const [template, details] of Object.entries(manifest.templates)) {
  assert(macroForTemplate.has(template), `unknown template ${template}`);
  assert(manifest.functions.filter((entry) => entry.template === template).length === details.count,
    `${template} has the wrong function count`);
  const actual = macroInstructions(macroForTemplate.get(template));
  assert(JSON.stringify(actual) === JSON.stringify(expectedInstructions.get(macroForTemplate.get(template))),
    `${template} instruction sequence differs from the deterministic source contract`);
  assert(actual.length * 4 === details.bodySize, `${template} instruction count does not match its body size`);
}

for (const entry of manifest.functions) {
  const macro = macroForTemplate.get(entry.template);
  assert(new RegExp(`^${macro}\\s+${entry.name}(?:,|\\s*$)`, "m").test(source),
    `${entry.name} is not emitted by ${macro}`);
  assert((source.match(new RegExp(`\\b${entry.name}\\b`, "g")) ?? []).length === 1,
    `${entry.name} must occur exactly once in the source`);
  if (entry.literal) {
    assert(entry.literal.offset === manifest.templates[entry.template].bodySize,
      `${entry.name} literal must immediately follow the body`);
    assert(entry.literal.loadOffset < entry.literal.offset && entry.literal.loadOffset % 4 === 0,
      `${entry.name} has an invalid literal-load offset`);
    assert(Object.hasOwn(manifest.literalIdentities, entry.literal.identity),
      `${entry.name} names an unknown literal identity`);
  }
}

const identityUses = manifest.functions.filter(({ literal }) => literal).map(({ literal }) => literal.identity);
assert(identityUses.filter((identity) => identity === "fallbackFloat").length === 2,
  "fallback float must form one two-function equality class");
for (const identity of Object.keys(manifest.literalIdentities).filter((identity) => identity !== "fallbackFloat")) {
  assert(identityUses.filter((candidate) => candidate === identity).length === 1,
    `${identity} must be a distinct one-function identity class`);
}
for (const symbol of Object.values(manifest.literalIdentities)) {
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
  const displacement = ((word >>> 26) & 3) === 1 ? word & 0xfff : (word & 0xff) * 4;
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
    assert(section.size === bodySize + (entry.literal ? 4 : 0), `${sectionName} has the wrong size`);
    const bytes = elf.data.subarray(section.offset, section.offset + section.size);
    bodyByName.set(entry.name, bytes.subarray(0, bodySize));
    const relocations = elf.relocations.filter(({ section: target }) => target === sectionName);
    assert(relocations.length === (entry.literal ? 1 : 0), `${entry.name} has an unexpected relocation count`);
    if (entry.literal) {
      const relocation = relocations[0];
      assert(relocation.offset === entry.literal.offset && relocation.type === 2 &&
        relocation.symbol === manifest.literalIdentities[entry.literal.identity],
      `${entry.name} has the wrong literal relocation`);
      assert(literalTarget(bytes.readUInt32LE(entry.literal.loadOffset), entry.literal.loadOffset) ===
        entry.literal.offset, `${entry.name} literal load targets the wrong slot`);
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
