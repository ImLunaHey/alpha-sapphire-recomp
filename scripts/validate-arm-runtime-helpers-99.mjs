#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-99.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_runtime_helpers_99.md");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_99.S");

const LIMITS = Object.freeze({ file: 64 * 1024 * 1024, executable: 16 * 1024 * 1024,
  sections: 16_384, symbols: 1_000_000, relocations: 1_000_000 });
const HASHES = Object.freeze({
  config: "990cb81a37fe43dabe9d5e45c112df7c9e801ee31d15d8496e0c62860cb6a202",
  specification: "1072624ff04c22cda59c16a3282a06f90f958904a771c669b1a1b78d5ae89fa5",
  instructions: "cadcc6dcb8827f3bab4d7fc48c3891742281df0b43397d223bc1cd4bb7877178",
  branches: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  returns: "de974bc3bfdb4e9f866faeaebdc23be267c002242de79a7f2ca89c51e0829449",
  pcRelative: "a70f9bcda04ea177c30a10ddea51430b9893d58babdf5c1e82aaf385c96766b9",
  relocations: "879915143a002e827796453c5755d3e0bff37c8e44151c9e80b02338c7243b2c",
});

const DEFINITIONS = Object.freeze([
  ["func_0011F8A8", "runtime_float_unit_38",
    [0xe3e01001, 0xed9f0a02, 0xe5801000, 0xed800a01, 0xe12fff1e], 4, "vldr"],
  ["func_00142388", "runtime_global_context_root_99",
    [0xe59f100c, 0xe591109c, 0xe3510000, 0x15810038, 0xe12fff1e], 0, "ldr"],
  ["func_002C2F2C", "runtime_fixed_register_base_99",
    [0xe59f000c, 0xe5d00085, 0xe200001c, 0xe1a00120, 0xe12fff1e], 0, "ldr"],
  ["func_00336114", "ipc_step_scalar_a_65",
    [0xee000a10, 0xeddf0a02, 0xeeb80a40, 0xee200a20, 0xe12fff1e], 4, "vldr"],
  ["func_00417638", "runtime_scalar_threshold_99",
    [0xe59f100c, 0xe1500001, 0xd3a00001, 0xc3a00000, 0xe12fff1e], 0, "ldr"],
  ["func_0041D118", "runtime_lookup_table_99",
    [0xe3500008, 0x959f1008, 0x83e00000, 0x97910100, 0xe12fff1e], 4, "ldrls"],
  ["func_004A5B3C", "runtime_global_instance_slot_99",
    [0xe59f100c, 0xe5911000, 0xe3510000, 0x15810040, 0xe12fff1e], 0, "ldr"],
]);
const REUSED_IDENTITIES = [DEFINITIONS[0][1], DEFINITIONS[3][1]];
const NEW_IDENTITIES = DEFINITIONS.filter((_, index) => index !== 0 && index !== 3).map((entry) => entry[1]);

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(data) { return createHash("sha256").update(data).digest("hex"); }
async function readBounded(filePath, what) {
  const metadata = await stat(filePath);
  check(metadata.isFile(), `${what} is not a regular file`);
  check(metadata.size <= LIMITS.file, `${what} exceeds ${LIMITS.file} bytes`);
  const buffer = await readFile(filePath);
  check(buffer.length <= LIMITS.file, `${what} exceeds ${LIMITS.file} bytes`);
  return buffer;
}
function range(buffer, offset, size, what) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= buffer.length && size <= buffer.length - offset, `${what} is outside the file`);
}
function cstring(buffer, offset, limit, what) {
  check(offset >= 0 && offset < limit, `${what} has an invalid string offset`);
  const end = buffer.indexOf(0, offset);
  check(end !== -1 && end < limit, `${what} is unterminated`);
  return buffer.toString("utf8", offset, end);
}

function parseElf(buffer) {
  check(buffer.length <= LIMITS.file, `input exceeds ${LIMITS.file} bytes`);
  check(buffer.length >= 52 && buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), "not ELF");
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1, "ELF must be 32-bit little-endian version 1");
  check(buffer.readUInt16LE(16) === 1, "ELF must be relocatable");
  check(buffer.readUInt16LE(18) === 40, "ELF machine must be ARM");
  check(buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(24) === 0, "invalid ELF version or entry point");
  check(buffer.readUInt32LE(28) === 0 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0,
    "program headers are not permitted");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40, "unexpected ELF header size");
  const shoff = buffer.readUInt32LE(32);
  let shnum = buffer.readUInt16LE(48);
  const rawShstrndx = buffer.readUInt16LE(50);
  check(shoff !== 0, "missing section table");
  range(buffer, shoff, 40, "section zero");
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  check(shnum > 0 && shnum <= LIMITS.sections, `section count exceeds ${LIMITS.sections}`);
  range(buffer, shoff, shnum * 40, "section table");
  const rawSections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * 40;
    rawSections.push({ index: i, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4),
      flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12), offset: buffer.readUInt32LE(p + 16),
      size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28),
      align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36), headerOffset: p });
  }
  let shstrndx = rawShstrndx;
  if (shstrndx === 0xffff) shstrndx = rawSections[0].link;
  check(shstrndx > 0 && shstrndx < shnum, "invalid section-name table index");
  const shstr = rawSections[shstrndx];
  check(shstr.type === 3, "section-name table is not STRTAB");
  range(buffer, shstr.offset, shstr.size, "section-name table");
  const sections = rawSections.map((section) => ({ ...section,
    name: cstring(buffer, shstr.offset + section.nameOffset, shstr.offset + shstr.size, `section ${section.index}`) }));
  let executableBytes = 0;
  for (const section of sections) {
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `${section.name}: invalid alignment`);
    if (section.type !== 8) range(buffer, section.offset, section.size, section.name || `section ${section.index}`);
    if ((section.flags & 4) !== 0 && section.type !== 8) {
      executableBytes += section.size;
      check(executableBytes <= LIMITS.executable, `executable data exceeds ${LIMITS.executable} bytes`);
    }
  }
  const symbols = [];
  let symbolTableCount = 0;
  for (const section of sections.filter((item) => item.type === 2 || item.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbol table`);
    const count = section.size / 16;
    symbolTableCount += count;
    check(symbolTableCount <= LIMITS.symbols, `symbol count exceeds ${LIMITS.symbols}`);
    check(section.link < sections.length && sections[section.link].type === 3, `${section.name}: invalid linked string table`);
    const strings = sections[section.link];
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * 16;
      const nameOffset = buffer.readUInt32LE(p);
      symbols.push({ table: section.index, tableIndex: i,
        name: cstring(buffer, strings.offset + nameOffset, strings.offset + strings.size, `symbol ${i}`),
        value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), info: buffer[p + 12],
        other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14), entryOffset: p });
    }
  }
  const symbolTables = new Map();
  for (const symbol of symbols) {
    if (!symbolTables.has(symbol.table)) symbolTables.set(symbol.table, []);
    symbolTables.get(symbol.table)[symbol.tableIndex] = symbol;
  }
  const relocations = [];
  for (const section of sections.filter((item) => item.type === 9 || item.type === 4)) {
    const expected = section.type === 9 ? 8 : 12;
    check(section.entsize === expected && section.size % expected === 0, `${section.name}: malformed relocation table`);
    check(section.info < sections.length && symbolTables.has(section.link), `${section.name}: invalid relocation links`);
    const count = section.size / expected;
    check(relocations.length + count <= LIMITS.relocations, `relocation count exceeds ${LIMITS.relocations}`);
    const table = symbolTables.get(section.link);
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * expected;
      const info = buffer.readUInt32LE(p + 4), symbolIndex = info >>> 8;
      check(symbolIndex < table.length, `${section.name}: invalid relocation symbol`);
      relocations.push({ section: section.index, target: section.info, offset: buffer.readUInt32LE(p),
        type: info & 0xff, symbolIndex, symbol: table[symbolIndex], entryOffset: p });
    }
  }
  return { buffer, sections, symbols, relocations, shoff, executableBytes };
}

function validateConfig(config, sourceBuffer, specBuffer) {
  check(config.schemaVersion === 1 && config.mode === "arm", "config schema or mode mismatch");
  check(config.source === "src/main/arm_runtime_helpers_99.S", "config source mismatch");
  check(config.totalBodySize === 140 && config.totalAdjacentSize === 28, "config totals mismatch");
  check(config.instructionScheduleSha256 === HASHES.instructions && config.branchScheduleSha256 === HASHES.branches &&
    config.returnScheduleSha256 === HASHES.returns && config.pcRelativeScheduleSha256 === HASHES.pcRelative &&
    config.relocationScheduleSha256 === HASHES.relocations, "config schedule digest drift");
  check(config.sourceSha256Status === "verified" && config.sourceSha256 === sha256(sourceBuffer), "source digest drift");
  check(sha256(specBuffer) === HASHES.specification, "specification digest drift");
  check(specBuffer.toString("utf8").includes(`Source SHA-256: \`${config.sourceSha256}\`.`), "specification digest drift");
  check(Array.isArray(config.functions) && config.functions.length === DEFINITIONS.length, "config function inventory mismatch");
  check(Array.isArray(config.pcRelativeDataAccesses) && config.pcRelativeDataAccesses.length === DEFINITIONS.length,
    "config PC-relative inventory mismatch");
  const names = new Set(), identities = new Set();
  for (let i = 0; i < DEFINITIONS.length; i++) {
    const [name, identity,, accessOffset, mnemonic] = DEFINITIONS[i];
    const fn = config.functions[i], access = config.pcRelativeDataAccesses[i];
    check(fn?.name === name && fn.size === 20 && Array.isArray(fn.calls) && fn.calls.length === 0,
      `${name}: config body mismatch`);
    check(fn.adjacentWords?.length === 1 && fn.adjacentWords[0].offset === 20 &&
      fn.adjacentWords[0].kind === "R_ARM_ABS32" && fn.adjacentWords[0].symbol === identity,
      `${name}: config adjacent word mismatch`);
    check(access?.function === name && access.offset === accessOffset && access.mnemonic === mnemonic &&
      access.targetOffset === 20 && access.symbol === identity && access.ownership === "owned-adjacent-word",
      `${name}: config PC-relative access mismatch`);
    check(!names.has(name) && !identities.has(identity), "config identity collision"); names.add(name); identities.add(identity);
  }
  check(JSON.stringify(config.reusedSymbolicIdentities) === JSON.stringify(REUSED_IDENTITIES),
    "reused identity mismatch");
  check(JSON.stringify(config.newSymbolicIdentities) === JSON.stringify(NEW_IDENTITIES), "new identity inventory mismatch");
  check(Object.keys(config.symbolicIdentities ?? {}).sort().join("\n") === [...NEW_IDENTITIES].sort().join("\n"),
    "symbolic identity keys mismatch");
  for (const identity of NEW_IDENTITIES) check(config.symbolicIdentities[identity].minimumSlotAlignment === 4 &&
    config.symbolicIdentities[identity].equality === "singleton-distinct", `${identity}: identity contract mismatch`);
  check(config.symbolicSlots && Object.keys(config.symbolicSlots).length === 0, "resolved symbolic slots are forbidden");
}

function validateElf(buffer) {
  const elf = parseElf(buffer);
  const sectionNames = new Set();
  for (const section of elf.sections) {
    if (section.name) check(!sectionNames.has(section.name), `duplicate section ${section.name}`);
    sectionNames.add(section.name);
  }
  const ownedIndexes = new Set();
  const identitySymbolIndexes = new Set();
  for (const [name, identity, words] of DEFINITIONS) {
    const sectionName = `.text.${name}`;
    const matchingSections = elf.sections.filter((section) => section.name === sectionName);
    check(matchingSections.length === 1, `${name}: missing or duplicate section`);
    const section = matchingSections[0]; ownedIndexes.add(section.index);
    check(section.type === 1 && section.flags === 6 && section.align === 4 && section.size === 24 && section.addr === 0,
      `${name}: section contract mismatch`);
    for (let i = 0; i < words.length; i++) check(buffer.readUInt32LE(section.offset + i * 4) === words[i],
      `${name}: instruction ${i} differs`);
    check(buffer.readUInt32LE(section.offset + 20) === 0, `${name}: adjacent relocation addend must be zero`);
    const funcs = elf.symbols.filter((symbol) => symbol.name === name);
    check(funcs.length === 1, `${name}: function symbol must be unique`);
    const fn = funcs[0];
    check(fn.shndx === section.index && fn.value === 0 && fn.size === 20 && (fn.info >>> 4) === 1 &&
      (fn.info & 15) === 2 && (fn.other & 3) === 0, `${name}: function symbol contract mismatch`);
    const maps = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name.startsWith("$"));
    check(maps.length === 2 && maps.some((symbol) => symbol.name === "$a" && symbol.value === 0) &&
      maps.some((symbol) => symbol.name === "$d" && symbol.value === 20) &&
      maps.every((symbol) => (symbol.info >>> 4) === 0 && (symbol.info & 15) === 0),
      `${name}: mapping-symbol contract mismatch`);
    const extras = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name &&
      symbol.name !== name && symbol.name !== "$a" && symbol.name !== "$d");
    check(extras.length === 0, `${name}: extra named symbol`);
    const ids = elf.symbols.filter((symbol) => symbol.name === identity);
    check(ids.length === 1, `${identity}: identity symbol must be unique`);
    const id = ids[0];
    check(id.shndx === 0 && id.value === 0 && id.size === 0 && (id.info >>> 4) === 1 &&
      (id.info & 15) === 0 && (id.other & 3) === 0, `${identity}: identity must be undefined global default NOTYPE`);
    identitySymbolIndexes.add(`${id.table}:${id.tableIndex}`);
    const rels = elf.relocations.filter((relocation) => relocation.target === section.index);
    check(rels.length === 1 && rels[0].offset === 20 && rels[0].type === 2 && rels[0].symbol === id,
      `${name}: relocation contract mismatch`);
  }
  check(identitySymbolIndexes.size === DEFINITIONS.length, "symbolic identities alias");
  check(elf.relocations.filter((relocation) => ownedIndexes.has(relocation.target)).length === DEFINITIONS.length,
    "extra relocation in owned sections");
  for (const symbol of elf.symbols) {
    if (DEFINITIONS.some(([name]) => name === symbol.name)) check(ownedIndexes.has(symbol.shndx), "foreign symbol capture");
  }
  return elf;
}

function align(value, amount) { return (value + amount - 1) & -amount; }
function wordsBuffer(words) { const out = Buffer.alloc(words.length * 4); words.forEach((word, i) => out.writeUInt32LE(word, i * 4)); return out; }
function makeCompositeElf(foreignCount = 12_001) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 }];
  const ownedIndexes = [];
  for (const [name,, words] of DEFINITIONS) {
    ownedIndexes.push(sections.length);
    sections.push({ name: `.text.${name}`, type: 1, flags: 6, align: 4,
      data: Buffer.concat([wordsBuffer(words), Buffer.alloc(4)]), link: 0, info: 0, entsize: 0 });
  }
  for (let i = 0; i < foreignCount; i++) sections.push({ name: `.text.foreign_${i}`, type: 1, flags: 6,
    align: 4, data: Buffer.alloc(4), link: 0, info: 0, entsize: 0 });
  let strtab = Buffer.from("\0");
  const nameOffsets = new Map([["", 0]]);
  const addString = (name) => { if (nameOffsets.has(name)) return nameOffsets.get(name); const at = strtab.length;
    strtab = Buffer.concat([strtab, Buffer.from(`${name}\0`)]); nameOffsets.set(name, at); return at; };
  ["$a", "$d", ...DEFINITIONS.flatMap(([name, identity]) => [name, identity])].forEach(addString);
  const strtabIndex = sections.length;
  sections.push({ name: ".strtab", type: 3, flags: 0, align: 1, data: strtab, link: 0, info: 0, entsize: 0 });
  const symbolRecords = [{ name: "", value: 0, size: 0, info: 0, other: 0, shndx: 0 }];
  for (const index of ownedIndexes) {
    symbolRecords.push({ name: "$a", value: 0, size: 0, info: 0, other: 0, shndx: index });
    symbolRecords.push({ name: "$d", value: 20, size: 0, info: 0, other: 0, shndx: index });
  }
  const firstGlobal = symbolRecords.length, identityIndexes = [];
  DEFINITIONS.forEach(([name, identity], i) => {
    symbolRecords.push({ name, value: 0, size: 20, info: 0x12, other: 0, shndx: ownedIndexes[i] });
    identityIndexes.push(symbolRecords.length);
    symbolRecords.push({ name: identity, value: 0, size: 0, info: 0x10, other: 0, shndx: 0 });
  });
  const symdata = Buffer.alloc(symbolRecords.length * 16);
  symbolRecords.forEach((symbol, i) => { const p = i * 16; symdata.writeUInt32LE(addString(symbol.name), p);
    symdata.writeUInt32LE(symbol.value, p + 4); symdata.writeUInt32LE(symbol.size, p + 8); symdata[p + 12] = symbol.info;
    symdata[p + 13] = symbol.other; symdata.writeUInt16LE(symbol.shndx, p + 14); });
  sections[strtabIndex].data = strtab;
  const symtabIndex = sections.length;
  sections.push({ name: ".symtab", type: 2, flags: 0, align: 4, data: symdata,
    link: strtabIndex, info: firstGlobal, entsize: 16 });
  DEFINITIONS.forEach(([name], i) => { const rel = Buffer.alloc(8); rel.writeUInt32LE(20, 0);
    rel.writeUInt32LE((identityIndexes[i] << 8) | 2, 4);
    sections.push({ name: `.rel.text.${name}`, type: 9, flags: 0, align: 4, data: rel,
      link: symtabIndex, info: ownedIndexes[i], entsize: 8 }); });
  let shstr = Buffer.from("\0");
  const sectionNameOffsets = [];
  for (const section of sections) { sectionNameOffsets.push(shstr.length); shstr = Buffer.concat([shstr, Buffer.from(`${section.name}\0`)]); }
  const shstrIndex = sections.length;
  sectionNameOffsets.push(shstr.length); shstr = Buffer.concat([shstr, Buffer.from(".shstrtab\0")]);
  sections.push({ name: ".shstrtab", type: 3, flags: 0, align: 1, data: shstr, link: 0, info: 0, entsize: 0 });
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) { cursor = align(cursor, Math.max(1, sections[i].align)); sections[i].offset = cursor; cursor += sections[i].data.length; }
  const shoff = align(cursor, 4), out = Buffer.alloc(shoff + sections.length * 40);
  out.set([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1], 0); out.writeUInt16LE(1, 16); out.writeUInt16LE(40, 18);
  out.writeUInt32LE(1, 20); out.writeUInt32LE(shoff, 32); out.writeUInt32LE(0x05000000, 36);
  out.writeUInt16LE(52, 40); out.writeUInt16LE(40, 46); out.writeUInt16LE(sections.length, 48); out.writeUInt16LE(shstrIndex, 50);
  sections.forEach((section, i) => { if (i) section.data.copy(out, section.offset); const p = shoff + i * 40;
    out.writeUInt32LE(sectionNameOffsets[i], p); out.writeUInt32LE(section.type, p + 4); out.writeUInt32LE(section.flags, p + 8);
    out.writeUInt32LE(section.offset ?? 0, p + 16); out.writeUInt32LE(section.data.length, p + 20);
    out.writeUInt32LE(section.link, p + 24); out.writeUInt32LE(section.info, p + 28); out.writeUInt32LE(section.align, p + 32);
    out.writeUInt32LE(section.entsize, p + 36); });
  return out;
}

function expectReject(label, makeBuffer, expectedMessage = null) {
  let rejected = false;
  try { validateElf(makeBuffer()); } catch (error) {
    rejected = true;
    if (expectedMessage) check(error.message.includes(expectedMessage),
      `self-test ${label} hit '${error.message}' instead of '${expectedMessage}'`);
  }
  check(rejected, `self-test unexpectedly accepted ${label}`);
}
function expectConfigReject(label, config, source, spec) {
  let rejected = false; try { validateConfig(config, source, spec); } catch { rejected = true; }
  check(rejected, `self-test unexpectedly accepted ${label}`);
}
function selfTest(config, source, spec) {
  const valid = makeCompositeElf();
  const parsed = validateElf(valid);
  check(parsed.sections.filter((section) => section.name.startsWith(".text.foreign_")).length > 12_000,
    "large valid fixture did not contain >12,000 foreign executable sections");
  const mutate = (callback) => { const copy = Buffer.from(valid); const elf = parseElf(copy); callback(copy, elf); return copy; };
  expectReject("oversized input", () => Buffer.alloc(LIMITS.file + 1), "input exceeds");
  expectReject("excessive executable bytes", () => { const b = Buffer.concat([valid, Buffer.alloc(LIMITS.executable + 1)]);
    const e = parseElf(valid), s = e.sections.find((x) => x.name === ".text.foreign_0");
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(LIMITS.executable + 1, s.headerOffset + 20); return b;
  }, "executable data exceeds");
  expectReject("excessive sections", () => { const b = Buffer.from(valid); b.writeUInt16LE(LIMITS.sections + 1, 48); return b; }, "section count exceeds");
  const excessiveSymbols = (type) => { const size = (LIMITS.symbols + 1) * 16;
    const b = Buffer.concat([valid, Buffer.alloc(size)]), e = parseElf(valid), s = e.sections.find((x) => x.name === ".symtab");
    b.writeUInt32LE(type, s.headerOffset + 4); b.writeUInt32LE(valid.length, s.headerOffset + 16);
    b.writeUInt32LE(size, s.headerOffset + 20); return b;
  };
  expectReject("excessive symbols", () => excessiveSymbols(2), "symbol count exceeds");
  expectReject("excessive dynamic symbols", () => excessiveSymbols(11), "symbol count exceeds");
  expectReject("excessive relocations", () => { const size = (LIMITS.relocations + 1) * 8;
    const b = Buffer.concat([valid, Buffer.alloc(size)]), e = parseElf(valid), s = e.sections.find((x) => x.name.startsWith(".rel.text."));
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(size, s.headerOffset + 20); return b;
  }, "relocation count exceeds");
  expectReject("wrong mode", () => { const b = Buffer.from(valid); b.writeUInt16LE(3, 18); return b; });
  expectReject("duplicate section", () => mutate((b, e) => { const owned = e.sections.find((s) => s.name === ".text.func_0011F8A8");
    const foreign = e.sections.find((s) => s.name === ".text.foreign_0"); b.writeUInt32LE(owned.nameOffset, foreign.headerOffset); }));
  expectReject("altered operand", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_002C2F2C"); b[s.offset + 8] ^= 1; }));
  expectReject("altered condition", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_00417638"); b[s.offset + 11] ^= 0x10; }));
  expectReject("call or branch", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_00417638"); b.writeUInt32LE(0xeb000000, s.offset + 8); }));
  expectReject("indirect transfer", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_00336114"); b.writeUInt32LE(0xe12fff13, s.offset + 12); }));
  expectReject("truncated owned section", () => mutate((b, e) => b.writeUInt32LE(20,
    e.sections.find((s) => s.name === ".text.func_00142388").headerOffset + 20)));
  expectReject("misplaced mapping symbol", () => mutate((b, e) => { const s = e.symbols.find((x) => x.name === "$d"); b.writeUInt32LE(16, s.entryOffset + 4); }));
  expectReject("wrong relocation", () => mutate((b, e) => { const r = e.relocations[0]; b.writeUInt32LE(16, r.entryOffset); }));
  expectReject("extra relocation", () => mutate((b, e) => { const foreign = e.sections.find((s) => s.name === ".text.foreign_0");
    const relSection = e.sections.find((s) => s.name.startsWith(".rel.text."));
    b.writeUInt32LE(9, foreign.headerOffset + 4); b.writeUInt32LE(0, foreign.headerOffset + 8);
    b.writeUInt32LE(relSection.offset, foreign.headerOffset + 16); b.writeUInt32LE(8, foreign.headerOffset + 20);
    b.writeUInt32LE(relSection.link, foreign.headerOffset + 24); b.writeUInt32LE(relSection.info, foreign.headerOffset + 28);
    b.writeUInt32LE(4, foreign.headerOffset + 32); b.writeUInt32LE(8, foreign.headerOffset + 36); }));
  expectReject("identity aliasing", () => mutate((b, e) => { const a = e.relocations[0], z = e.relocations[1]; b.writeUInt32LE((a.symbolIndex << 8) | 2, z.entryOffset + 4); }));
  expectReject("foreign symbol capture", () => mutate((b, e) => { const id = e.symbols.find((x) => x.name === DEFINITIONS[0][1]); b.writeUInt16LE(e.sections.find((s) => s.name === ".text.foreign_0").index, id.entryOffset + 14); }));
  const driftedConfig = structuredClone(config); driftedConfig.returnScheduleSha256 = HASHES.branches;
  expectConfigReject("config digest drift", driftedConfig, source, spec);
  expectConfigReject("source digest drift", config, Buffer.concat([source, Buffer.from("\n")]), spec);
  expectConfigReject("specification digest drift", config, source,
    Buffer.from(spec.toString("utf8").replace(config.sourceSha256, "0".repeat(64))));
  return { sections: parsed.sections.length, symbols: parsed.symbols.length, relocations: parsed.relocations.length,
    foreignExecutableSections: 12_001 };
}

async function main() {
  const args = process.argv.slice(2), runSelfTest = args.includes("--self-test"), paths = args.filter((arg) => arg !== "--self-test");
  check(paths.length <= 1 && (runSelfTest || paths.length === 1),
    "usage: validate-arm-runtime-helpers-99.mjs [--self-test] [object.o]");
  const [configBytes, spec, source] = await Promise.all([
    readBounded(CONFIG_PATH, "config"), readBounded(SPEC_PATH, "specification"),
    readBounded(SOURCE_PATH, "source"),
  ]);
  let config; try { config = JSON.parse(configBytes); } catch { fail("invalid JSON config"); }
  check(sha256(configBytes) === HASHES.config, "config digest drift");
  validateConfig(config, source, spec);
  const result = paths.length === 1
    ? { elf: validateElf(await readBounded(path.resolve(paths[0]), "input")) }
    : null;
  const self = runSelfTest ? selfTest(config, source, spec) : null;
  console.log(`arm-runtime-helpers-99: ok${result ? `; sections=${result.elf.sections.length}; symbols=${result.elf.symbols.length}; relocations=${result.elf.relocations.length}; executableBytes=${result.elf.executableBytes}` : ""}${self ? `; selfTestSections=${self.sections}; foreignExecutableSections=${self.foreignExecutableSections}` : ""}`);
}

await main().catch((error) => { console.error(`arm-runtime-helpers-99: ${error.message}`); process.exitCode = 1; });
