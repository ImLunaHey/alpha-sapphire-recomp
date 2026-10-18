#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-102.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_runtime_helpers_102.md");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_102.S");
const LIMITS = Object.freeze({ file: 64 * 1024 * 1024, executable: 16 * 1024 * 1024,
  sections: 16_384, records: 1_000_000 });
const HASHES = Object.freeze({
  config: "2fd1d02771ee87e7f824bcef4e60e42abd0056001d83a6e0c0491226ae7a9888",
  specification: "cdd3c3f02aed7df6b515168eb4f6122d9a3ee1573d89a10991aaeccfc20a4031",
  normalizedConfig: "81d0de4340c9ba664234811d1825192dcb910124a014727e782723f2d0baf778",
});
const FUNCTIONS = Object.freeze([
  { name: "func_0014EB08", body: 16, words: [0xe1a01000, 0xe59f0004, 0xe5900014, 0xeafffffe, 0],
    relocations: [[12, 29, "runtime_secondary_dispatch_tail_102"], [16, 2, "runtime_shared_dispatch_root_102"]] },
  { name: "func_0014EB30", body: 20, words: [0xe1a02001, 0xe1a01000, 0xe59f0004, 0xe5900014, 0xeafffffe, 0],
    relocations: [[16, 29, "func_00168844"], [20, 2, "runtime_shared_dispatch_root_102"]] },
  { name: "func_001DBCD8", body: 24, words: [0xe59f2010, 0xe0800080, 0xe0820180, 0xec900a06, 0xec810a06, 0xe12fff1e, 0],
    relocations: [[24, 2, "runtime_vector_record_table_102"]] },
  { name: "func_00324E84", body: 24, words: [0xe1a01000, 0xe59f000c, 0xe5900004, 0xe5902000, 0xe592200c, 0xe12fff12, 0],
    relocations: [[24, 2, "runtime_object_dispatch_root_102"]] },
  { name: "func_0042FF40", body: 20, words: [0xe59f000c, 0xe5900024, 0xe5901000, 0xe5911038, 0xe12fff11, 0],
    relocations: [[20, 2, "runtime_method_dispatch_root_102"]] },
]);
const DATA_IDENTITIES = Object.freeze(["runtime_shared_dispatch_root_102", "runtime_vector_record_table_102",
  "runtime_object_dispatch_root_102", "runtime_method_dispatch_root_102"]);
const BRANCH_IDENTITIES = Object.freeze(["runtime_secondary_dispatch_tail_102", "func_00168844"]);
const EXTERNALS = Object.freeze([...DATA_IDENTITIES, ...BRANCH_IDENTITIES]);

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(data) { return createHash("sha256").update(data).digest("hex"); }
async function readBounded(filePath, what) {
  const metadata = await stat(filePath); check(metadata.isFile(), `${what} is not a regular file`);
  check(metadata.size <= LIMITS.file, `${what} exceeds ${LIMITS.file} bytes`);
  const data = await readFile(filePath); check(data.length <= LIMITS.file, `${what} exceeds ${LIMITS.file} bytes`); return data;
}
function range(buffer, offset, size, what) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= buffer.length && size <= buffer.length - offset, `${what} is outside the file`);
}
function stringAt(buffer, table, relative, what) {
  check(relative >= 0 && relative < table.size, `${what} has an invalid string offset`);
  const start = table.offset + relative, end = buffer.indexOf(0, start);
  check(end !== -1 && end < table.offset + table.size, `${what} is unterminated`);
  return buffer.toString("utf8", start, end);
}

function parseElf(buffer) {
  check(buffer.length <= LIMITS.file, `input exceeds ${LIMITS.file} bytes`); range(buffer, 0, 52, "ELF header");
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), "not ELF");
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    "ELF identification must be ELF32 little-endian System V ABI version 0");
  check(buffer.subarray(9, 16).every((byte) => byte === 0), "ELF identification padding is nonzero");
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40, "ELF must be relocatable ARM");
  check(buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(24) === 0, "ELF version or entry point is invalid");
  check(buffer.readUInt32LE(28) === 0 && buffer.readUInt32LE(36) === 0x05000000 &&
    buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0, "program headers are forbidden or ARM EABI flags changed");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40, "ELF header sizes changed");
  const shoff = buffer.readUInt32LE(32); check(shoff !== 0, "section table is missing"); range(buffer, shoff, 40, "section zero");
  let shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  check(shnum > 0 && shnum <= LIMITS.sections, `section count exceeds ${LIMITS.sections}`);
  range(buffer, shoff, shnum * 40, "section table");
  const raw = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * 40;
    raw.push({ index: i, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4),
      flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12), offset: buffer.readUInt32LE(p + 16),
      size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28),
      align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36), headerOffset: p });
  }
  check(Object.entries(raw[0]).every(([key, value]) => ["index", "headerOffset"].includes(key) || value === 0),
    "section zero must be canonical null");
  if (shstrndx === 0xffff) shstrndx = raw[0].link;
  check(shstrndx > 0 && shstrndx < raw.length && raw[shstrndx].type === 3, "section-name table is invalid");
  const names = raw[shstrndx]; range(buffer, names.offset, names.size, "section-name table");
  const sections = raw.map((section) => ({ ...section,
    name: stringAt(buffer, names, section.nameOffset, `section ${section.index}`) }));
  let executableBytes = 0;
  for (const section of sections) {
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `${section.name}: invalid alignment`);
    if (section.type !== 8) range(buffer, section.offset, section.size, section.name || `section ${section.index}`);
    if ((section.flags & 4) !== 0 && section.type !== 8) {
      executableBytes += section.size; check(executableBytes <= LIMITS.executable, `executable data exceeds ${LIMITS.executable} bytes`);
    }
  }
  const symbols = [], tables = new Map(); let records = 0;
  for (const section of sections.filter((item) => item.type === 2 || item.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbol table`);
    check(section.link < sections.length && sections[section.link].type === 3, `${section.name}: invalid string-table link`);
    const count = section.size / 16; records += count; check(records <= LIMITS.records, `symbol and relocation count exceeds ${LIMITS.records}`);
    const strings = sections[section.link], table = [];
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * 16, nameOffset = buffer.readUInt32LE(p);
      const symbol = { table: section.index, tableIndex: i, nameOffset,
        name: stringAt(buffer, strings, nameOffset, `symbol ${i}`), value: buffer.readUInt32LE(p + 4),
        size: buffer.readUInt32LE(p + 8), info: buffer[p + 12], other: buffer[p + 13],
        shndx: buffer.readUInt16LE(p + 14), entryOffset: p };
      table.push(symbol); symbols.push(symbol);
    }
    check(table.length > 0 && Object.entries(table[0]).every(([key, value]) =>
      ["table", "tableIndex", "name", "entryOffset"].includes(key) || value === 0) && table[0].name === "",
    `${section.name}: symbol zero must be canonical null`);
    tables.set(section.index, table);
  }
  const relocations = [];
  for (const section of sections.filter((item) => item.type === 9 || item.type === 4)) {
    const width = section.type === 9 ? 8 : 12;
    check(section.entsize === width && section.size % width === 0, `${section.name}: malformed relocation table`);
    check(section.info < sections.length && tables.has(section.link), `${section.name}: invalid relocation links`);
    const count = section.size / width; records += count; check(records <= LIMITS.records, `symbol and relocation count exceeds ${LIMITS.records}`);
    const table = tables.get(section.link);
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * width, info = buffer.readUInt32LE(p + 4), symbolIndex = info >>> 8;
      check(symbolIndex < table.length, `${section.name}: relocation symbol is invalid`);
      const offset = buffer.readUInt32LE(p);
      check(offset <= sections[section.info].size && 4 <= sections[section.info].size - offset,
        `${section.name}: relocation is outside its target section`);
      relocations.push({ relocationSection: section.index, format: section.type, target: section.info,
        offset, type: info & 255, symbolIndex, symbol: table[symbolIndex],
        addend: width === 12 ? buffer.readInt32LE(p + 8) : null, entryOffset: p });
    }
  }
  return { buffer, sections, symbols, relocations, executableBytes };
}

function validateConfig(config, source, spec) {
  const normalized = structuredClone(config); normalized.sourceHash = null;
  check(sha256(JSON.stringify(normalized)) === HASHES.normalizedConfig, "normalized config contract drift");
  check(config.sourceHash === sha256(source), "source digest drift");
  check(sha256(spec) === HASHES.specification, "specification digest drift");
  check(config.source === "src/main/arm_runtime_helpers_102.S" && config.mode === "arm" && config.minimumAlignment === 4 &&
    config.totalBodySize === 104 && config.totalAdjacentSize === 20 && config.expectedInstructionCount === 26 &&
    config.memoryOperationCount === 15 && config.directTailCount === 2 && config.indirectTransferCount === 2 &&
    config.returnCount === 1 && config.expectedRelocationCount === 7, "config totals drift");
}

function validateElf(buffer) {
  const elf = parseElf(buffer), owned = new Set(), sectionNames = new Set(), external = new Map();
  for (const section of elf.sections) {
    if (section.name) check(!sectionNames.has(section.name), `duplicate section ${section.name}`);
    sectionNames.add(section.name);
  }
  const symbolTables = elf.sections.filter((section) => section.type === 2 || section.type === 11);
  check(symbolTables.length === 1, "object must contain exactly one symbol table");
  const symbolTable = symbolTables[0];
  const tableSymbols = elf.symbols.filter((symbol) => symbol.table === symbolTable.index);
  check(symbolTable.type === 2 && symbolTable.flags === 0 && symbolTable.addr === 0 &&
    symbolTable.align === 4 && symbolTable.entsize === 16 && symbolTable.info > 0 &&
    symbolTable.info <= tableSymbols.length && tableSymbols.every((symbol, index) =>
      ((symbol.info >>> 4) === 0) === (index < symbolTable.info)),
  "symbol-table attributes or local/global partition mismatch");
  for (const name of EXTERNALS) {
    const matches = elf.symbols.filter((symbol) => symbol.name === name);
    check(matches.length === 1, `${name}: symbol must be unique`); const symbol = matches[0];
    check(symbol.shndx === 0 && symbol.value === 0 && symbol.size === 0 && symbol.info === 0x10 && symbol.other === 0,
      `${name}: must be undefined global default-visible NOTYPE`);
    external.set(name, symbol);
  }
  check(new Set([...external.values()].map((symbol) => `${symbol.table}:${symbol.tableIndex}`)).size === EXTERNALS.length,
    "external identities were merged");
  for (const expected of FUNCTIONS) {
    const sectionMatches = elf.sections.filter((section) => section.name === `.text.${expected.name}`);
    check(sectionMatches.length === 1, `${expected.name}: owned section must be unique`); const section = sectionMatches[0]; owned.add(section.index);
    check(section.type === 1 && section.flags === 6 && section.addr === 0 && section.align === 4 &&
      section.size === expected.body + 4 && section.link === 0 && section.info === 0 && section.entsize === 0,
    `${expected.name}: section contract mismatch`);
    expected.words.forEach((word, index) => check(buffer.readUInt32LE(section.offset + index * 4) === word,
      `${expected.name}: word ${index} differs`));
    const functions = elf.symbols.filter((symbol) => symbol.name === expected.name);
    check(functions.length === 1, `${expected.name}: function symbol must be unique`); const fn = functions[0];
    check(fn.shndx === section.index && fn.value === 0 && fn.size === expected.body && fn.info === 0x12 && fn.other === 0,
      `${expected.name}: function symbol contract mismatch`);
    const maps = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name.startsWith("$"));
    check(maps.length === 2 && maps.some((symbol) => symbol.name === "$a" && symbol.value === 0) &&
      maps.some((symbol) => symbol.name === "$d" && symbol.value === expected.body) &&
      maps.every((symbol) => symbol.size === 0 && symbol.info === 0 && symbol.other === 0),
      `${expected.name}: mapping-symbol contract mismatch`);
    const sectionSymbols = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name === "" &&
      symbol.value === 0 && symbol.size === 0 && symbol.info === 3 && symbol.other === 0);
    check(sectionSymbols.length === 1, `${expected.name}: section symbol contract mismatch`);
    const allowed = new Set([fn, ...maps, sectionSymbols[0]]);
    check(elf.symbols.filter((symbol) => symbol.shndx === section.index && !allowed.has(symbol)).length === 0,
      `${expected.name}: extra named or unnamed symbol in owned section`);
    const relocations = elf.relocations.filter((relocation) => relocation.target === section.index);
    check(relocations.length === expected.relocations.length, `${expected.name}: relocation count mismatch`);
    const relocationSections = elf.sections.filter((candidate) =>
      (candidate.type === 9 || candidate.type === 4) && candidate.info === section.index);
    check(relocationSections.length === 1, `${expected.name}: relocation section must be unique`);
    const relocationSection = relocationSections[0];
    check(relocationSection.name === `.rel.text.${expected.name}` && relocationSection.type === 9 &&
      relocationSection.flags === 0x40 && relocationSection.addr === 0 &&
      relocationSection.size === expected.relocations.length * 8 && relocationSection.link === symbolTable.index &&
      relocationSection.align === 4 && relocationSection.entsize === 8,
    `${expected.name}: relocation-section contract mismatch`);
    for (const [offset, type, symbolName] of expected.relocations) {
      const matches = relocations.filter((relocation) => relocation.offset === offset);
      check(matches.length === 1 && matches[0].format === 9 && matches[0].type === type &&
        matches[0].symbol === external.get(symbolName), `${expected.name}: relocation at ${offset} differs`);
    }
  }
  check(elf.relocations.filter((relocation) => owned.has(relocation.target)).length === 7,
    "owned relocation total differs");
  check(elf.relocations.length === 7, "whole-object relocation total differs");
  const definedGlobalFunctions = elf.symbols.filter((symbol) => symbol.shndx !== 0 && symbol.info === 0x12);
  check(definedGlobalFunctions.length === FUNCTIONS.length &&
    definedGlobalFunctions.every((symbol) => FUNCTIONS.some((expected) => expected.name === symbol.name)),
  "defined global function inventory differs");
  check(elf.symbols.filter((symbol) => FUNCTIONS.some((fn) => fn.name === symbol.name) && !owned.has(symbol.shndx)).length === 0,
    "owned function name was captured outside its section");
  return elf;
}

function align(value, amount) { return (value + amount - 1) & -amount; }
function wordsBuffer(words) { const result = Buffer.alloc(words.length * 4); words.forEach((word, i) => result.writeUInt32LE(word, i * 4)); return result; }
function makeCompositeElf(foreignCount = 12_001) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 }], owned = [];
  for (const fn of FUNCTIONS) { owned.push(sections.length); sections.push({ name: `.text.${fn.name}`, type: 1, flags: 6,
    align: 4, data: wordsBuffer(fn.words), link: 0, info: 0, entsize: 0 }); }
  for (let i = 0; i < foreignCount; i++) sections.push({ name: `.text.foreign_${i}`, type: 1, flags: 6,
    align: 4, data: Buffer.alloc(4), link: 0, info: 0, entsize: 0 });
  let strings = Buffer.from("\0"); const offsets = new Map([["", 0]]);
  const addString = (name) => { if (offsets.has(name)) return offsets.get(name); const at = strings.length;
    strings = Buffer.concat([strings, Buffer.from(`${name}\0`)]); offsets.set(name, at); return at; };
  ["$a", "$d", ...FUNCTIONS.map((fn) => fn.name), ...EXTERNALS].forEach(addString);
  const strtabIndex = sections.length; sections.push({ name: ".strtab", type: 3, flags: 0, align: 1,
    data: strings, link: 0, info: 0, entsize: 0 });
  const records = [{ name: "", value: 0, size: 0, info: 0, other: 0, shndx: 0 }];
  FUNCTIONS.forEach((fn, i) => { records.push({ name: "", value: 0, size: 0, info: 3, other: 0, shndx: owned[i] });
    records.push({ name: "$a", value: 0, size: 0, info: 0, other: 0, shndx: owned[i] });
    records.push({ name: "$d", value: fn.body, size: 0, info: 0, other: 0, shndx: owned[i] }); });
  const firstGlobal = records.length, externalIndexes = new Map();
  FUNCTIONS.forEach((fn, i) => records.push({ name: fn.name, value: 0, size: fn.body, info: 0x12, other: 0, shndx: owned[i] }));
  EXTERNALS.forEach((name) => { externalIndexes.set(name, records.length);
    records.push({ name, value: 0, size: 0, info: 0x10, other: 0, shndx: 0 }); });
  const symbolData = Buffer.alloc(records.length * 16);
  records.forEach((symbol, i) => { const p = i * 16; symbolData.writeUInt32LE(addString(symbol.name), p);
    symbolData.writeUInt32LE(symbol.value, p + 4); symbolData.writeUInt32LE(symbol.size, p + 8);
    symbolData[p + 12] = symbol.info; symbolData[p + 13] = symbol.other; symbolData.writeUInt16LE(symbol.shndx, p + 14); });
  sections[strtabIndex].data = strings; const symtabIndex = sections.length;
  sections.push({ name: ".symtab", type: 2, flags: 0, align: 4, data: symbolData,
    link: strtabIndex, info: firstGlobal, entsize: 16 });
  FUNCTIONS.forEach((fn, i) => { const data = Buffer.alloc(fn.relocations.length * 8);
    fn.relocations.forEach(([offset, type, name], j) => { data.writeUInt32LE(offset, j * 8);
      data.writeUInt32LE((externalIndexes.get(name) << 8) | type, j * 8 + 4); });
    sections.push({ name: `.rel.text.${fn.name}`, type: 9, flags: 0x40, align: 4, data,
      link: symtabIndex, info: owned[i], entsize: 8 }); });
  let sectionStrings = Buffer.from("\0"); const sectionNameOffsets = [];
  for (const section of sections) { if (!section.name) sectionNameOffsets.push(0); else {
    sectionNameOffsets.push(sectionStrings.length); sectionStrings = Buffer.concat([sectionStrings, Buffer.from(`${section.name}\0`)]); } }
  const shstrIndex = sections.length; sectionNameOffsets.push(sectionStrings.length);
  sectionStrings = Buffer.concat([sectionStrings, Buffer.from(".shstrtab\0")]);
  sections.push({ name: ".shstrtab", type: 3, flags: 0, align: 1, data: sectionStrings, link: 0, info: 0, entsize: 0 });
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) { cursor = align(cursor, Math.max(1, sections[i].align));
    sections[i].offset = cursor; cursor += sections[i].data.length; }
  const shoff = align(cursor, 4), output = Buffer.alloc(shoff + sections.length * 40);
  output.set([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1], 0); output.writeUInt16LE(1, 16); output.writeUInt16LE(40, 18);
  output.writeUInt32LE(1, 20); output.writeUInt32LE(shoff, 32); output.writeUInt32LE(0x05000000, 36);
  output.writeUInt16LE(52, 40); output.writeUInt16LE(40, 46); output.writeUInt16LE(sections.length, 48); output.writeUInt16LE(shstrIndex, 50);
  sections.forEach((section, i) => { if (i) section.data.copy(output, section.offset); const p = shoff + i * 40;
    output.writeUInt32LE(sectionNameOffsets[i], p); output.writeUInt32LE(section.type, p + 4);
    output.writeUInt32LE(section.flags, p + 8); output.writeUInt32LE(section.offset ?? 0, p + 16);
    output.writeUInt32LE(section.data.length, p + 20); output.writeUInt32LE(section.link, p + 24);
    output.writeUInt32LE(section.info, p + 28); output.writeUInt32LE(section.align, p + 32); output.writeUInt32LE(section.entsize, p + 36); });
  return output;
}

function expectReject(label, make, message = null) {
  let rejected = false;
  try { validateElf(make()); } catch (error) { rejected = true;
    if (message) check(error.message.includes(message), `self-test ${label} hit '${error.message}' instead of '${message}'`); }
  check(rejected, `self-test unexpectedly accepted ${label}`);
}
function expectConfigReject(label, config, source, spec) {
  let rejected = false; try { validateConfig(config, source, spec); } catch { rejected = true; }
  check(rejected, `self-test unexpectedly accepted ${label}`);
}
function selfTest(config, source, spec) {
  const valid = makeCompositeElf(), parsed = validateElf(valid);
  check(parsed.sections.filter((section) => section.name.startsWith(".text.foreign_")).length > 12_000,
    "large fixture lacks more than 12,000 foreign executable sections");
  const mutate = (callback) => { const copy = Buffer.from(valid), elf = parseElf(copy); callback(copy, elf); return copy; };
  expectReject("oversized input", () => Buffer.alloc(LIMITS.file + 1), "input exceeds");
  expectReject("excessive sections", () => { const copy = Buffer.from(valid); copy.writeUInt16LE(LIMITS.sections + 1, 48); return copy; }, "section count exceeds");
  expectReject("excessive executable payload", () => { const copy = Buffer.concat([valid, Buffer.alloc(LIMITS.executable + 1)]), elf = parseElf(valid);
    const section = elf.sections.find((item) => item.name === ".text.foreign_0"); copy.writeUInt32LE(valid.length, section.headerOffset + 16);
    copy.writeUInt32LE(LIMITS.executable + 1, section.headerOffset + 20); return copy; }, "executable data exceeds");
  expectReject("wrong EABI flags", () => { const copy = Buffer.from(valid); copy.writeUInt32LE(0x05000001, 36); return copy; });
  expectReject("noncanonical null section", () => mutate((copy, elf) => copy.writeUInt32LE(1, elf.sections[0].headerOffset + 8)));
  expectReject("noncanonical null symbol", () => mutate((copy, elf) => { const symbol = elf.symbols.find((item) => item.tableIndex === 0); copy[symbol.entryOffset + 12] = 1; }));
  expectReject("register move drift", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_0014EB08"); copy[section.offset] ^= 1; }));
  expectReject("shift schedule drift", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_001DBCD8"); copy[section.offset + 5] ^= 1; }));
  expectReject("VFP register order drift", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_001DBCD8"); copy[section.offset + 12] ^= 1; }));
  expectReject("indirect transfer register drift", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_00324E84"); copy[section.offset + 20] ^= 1; }));
  expectReject("call substitution", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_0014EB30"); copy[section.offset + 19] = 0xeb; }));
  expectReject("literal addend", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_0042FF40"); copy.writeUInt32LE(4, section.offset + 20); }));
  expectReject("literal pooling", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_0014EB08"); copy.writeUInt32LE(24, section.headerOffset + 20); }));
  expectReject("section flags", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_00324E84"); copy.writeUInt32LE(7, section.headerOffset + 8); }));
  expectReject("owned section link", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name === ".text.func_00324E84"); copy.writeUInt32LE(1, section.headerOffset + 24); }));
  expectReject("symbol-table partition", () => mutate((copy, elf) => { const table = elf.sections.find((item) => item.type === 2); copy.writeUInt32LE(table.info + 1, table.headerOffset + 28); }));
  expectReject("mapping boundary", () => mutate((copy, elf) => { const symbol = elf.symbols.find((item) => item.name === "$d"); copy.writeUInt32LE(12, symbol.entryOffset + 4); }));
  expectReject("invented alias", () => mutate((copy, elf) => { const map = elf.symbols.find((item) => item.name === "$a");
    const fn = elf.symbols.find((item) => item.name === FUNCTIONS[0].name); copy.writeUInt32LE(fn.nameOffset, map.entryOffset); }));
  expectReject("undefined metadata", () => mutate((copy, elf) => { const symbol = elf.symbols.find((item) => item.name === DATA_IDENTITIES[0]); copy[symbol.entryOffset + 12] = 0x11; }));
  expectReject("branch relocation kind", () => mutate((copy, elf) => { const relocation = elf.relocations.find((item) => item.type === 29);
    copy.writeUInt32LE((relocation.symbolIndex << 8) | 28, relocation.entryOffset + 4); }));
  expectReject("branch identity", () => mutate((copy, elf) => { const relocation = elf.relocations.find((item) => item.symbol.name === BRANCH_IDENTITIES[0]);
    const wrong = elf.symbols.find((item) => item.name === BRANCH_IDENTITIES[1]); copy.writeUInt32LE((wrong.tableIndex << 8) | 29, relocation.entryOffset + 4); }));
  expectReject("shared identity split", () => mutate((copy, elf) => { const target = elf.sections.find((item) => item.name === ".text.func_0014EB30");
    const relocation = elf.relocations.find((item) => item.target === target.index && item.offset === 20);
    const wrong = elf.symbols.find((item) => item.name === DATA_IDENTITIES[1]); copy.writeUInt32LE((wrong.tableIndex << 8) | 2, relocation.entryOffset + 4); }));
  expectReject("singleton identity merge", () => mutate((copy, elf) => { const relocation = elf.relocations.find((item) => item.symbol.name === DATA_IDENTITIES[2]);
    const wrong = elf.symbols.find((item) => item.name === DATA_IDENTITIES[3]); copy.writeUInt32LE((wrong.tableIndex << 8) | 2, relocation.entryOffset + 4); }));
  expectReject("extra owned relocation", () => mutate((copy, elf) => { const foreign = elf.sections.find((item) => item.name === ".text.foreign_0");
    const relocationSection = elf.sections.find((item) => item.name.startsWith(".rel.text.")); copy.writeUInt32LE(9, foreign.headerOffset + 4);
    copy.writeUInt32LE(0, foreign.headerOffset + 8); copy.writeUInt32LE(relocationSection.offset, foreign.headerOffset + 16);
    copy.writeUInt32LE(8, foreign.headerOffset + 20); copy.writeUInt32LE(relocationSection.link, foreign.headerOffset + 24);
    copy.writeUInt32LE(relocationSection.info, foreign.headerOffset + 28); copy.writeUInt32LE(4, foreign.headerOffset + 32);
    copy.writeUInt32LE(8, foreign.headerOffset + 36); }));
  expectReject("relocation-section flags", () => mutate((copy, elf) => { const section = elf.sections.find((item) => item.name.startsWith(".rel.text.")); copy.writeUInt32LE(0, section.headerOffset + 8); }));
  expectReject("foreign relocation", () => mutate((copy, elf) => {
    const foreign = elf.sections.find((item) => item.name === ".text.foreign_0");
    const target = elf.sections.find((item) => item.name === ".text.foreign_1");
    const table = elf.sections.find((item) => item.type === 2);
    copy.writeUInt32LE(9, foreign.headerOffset + 4); copy.writeUInt32LE(0x40, foreign.headerOffset + 8);
    copy.writeUInt32LE(8, foreign.headerOffset + 20); copy.writeUInt32LE(table.index, foreign.headerOffset + 24);
    copy.writeUInt32LE(target.index, foreign.headerOffset + 28); copy.writeUInt32LE(4, foreign.headerOffset + 32);
    copy.writeUInt32LE(8, foreign.headerOffset + 36);
  }), "whole-object relocation total");
  const drift = structuredClone(config); drift.functions[0].operations[0].destination = "r2";
  expectConfigReject("config drift", drift, source, spec);
  expectConfigReject("source drift", config, Buffer.concat([source, Buffer.from("\n")]), spec);
  expectConfigReject("spec drift", config, source, Buffer.concat([spec, Buffer.from("\n")]));
  return { sections: parsed.sections.length, foreignExecutableSections: 12_001 };
}

async function main() {
  const args = process.argv.slice(2), runSelfTest = args.includes("--self-test"), paths = args.filter((arg) => arg !== "--self-test");
  check(paths.length <= 1 && (runSelfTest || paths.length === 1),
    "usage: validate-arm-runtime-helpers-102.mjs [--self-test] [object.o]");
  const [configBytes, spec, source] = await Promise.all([readBounded(CONFIG_PATH, "config"),
    readBounded(SPEC_PATH, "specification"), readBounded(SOURCE_PATH, "source")]);
  check(sha256(configBytes) === HASHES.config, "config digest drift");
  let config; try { config = JSON.parse(configBytes); } catch { fail("config is not valid JSON"); }
  validateConfig(config, source, spec);
  const result = paths.length ? validateElf(await readBounded(path.resolve(paths[0]), "input")) : null;
  const self = runSelfTest ? selfTest(config, source, spec) : null;
  console.log(`arm-runtime-helpers-102: ok${result ? `; sections=${result.sections.length}; symbols=${result.symbols.length}; relocations=${result.relocations.length}; executableBytes=${result.executableBytes}` : ""}${self ? `; selfTestSections=${self.sections}; foreignExecutableSections=${self.foreignExecutableSections}` : ""}`);
}

await main().catch((error) => { console.error(`arm-runtime-helpers-102: ${error.message}`); process.exitCode = 1; });
