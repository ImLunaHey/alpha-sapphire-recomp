#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-100.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_runtime_helpers_100.md");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_100.S");
const LIMITS = Object.freeze({ file: 64 * 1024 * 1024, executable: 16 * 1024 * 1024,
  sections: 16_384, symbols: 1_000_000, relocations: 1_000_000 });
const HASHES = Object.freeze({
  config: "7a33e26b981298a9cd79db051e76636ea8b4fd0ce7a8f0c4be5b800a7044e940",
  specification: "c7255616f193f5f93d5753f003229a83d0d501f20f96ddde25d9ba2bda6d2c6e",
});

const FUNCTIONS = Object.freeze([
  { name: "func_001159D8", selector: 0, literal: "runtime_dispatch_root_97",
    tail: "runtime_dispatch_selector_tail_100", words: [0xe59f000c, 0xe3a01000, 0xe5900010, 0xe5900004, 0xeafffffe] },
  { name: "func_001159F0", selector: 1, literal: "runtime_dispatch_root_97",
    tail: "runtime_dispatch_selector_tail_100", words: [0xe59f000c, 0xe3a01001, 0xe5900010, 0xe5900004, 0xeafffffe] },
  { name: "func_00115A08", selector: 2, literal: "runtime_dispatch_root_97",
    tail: "runtime_dispatch_selector_tail_100", words: [0xe59f000c, 0xe3a01002, 0xe5900010, 0xe5900004, 0xeafffffe] },
  { name: "func_004AAA0C", field: 28, literal: "runtime_shared_context_root_100", tail: "func_004AA8A4",
    words: [0xe59f100c, 0xe3a02000, 0xe5911164, 0xe281101c, 0xeafffffe] },
  { name: "func_004AAA24", field: 36, literal: "runtime_shared_context_root_100", tail: "func_004AA8A4",
    words: [0xe59f100c, 0xe3a02000, 0xe5911164, 0xe2811024, 0xeafffffe] },
  { name: "func_004AAAE4", field: 52, literal: "runtime_shared_context_root_100", tail: "func_004AA8A4",
    words: [0xe59f100c, 0xe3a02000, 0xe5911164, 0xe2811034, 0xeafffffe] },
  { name: "func_004AABC0", field: 44, literal: "runtime_shared_context_root_100", tail: "func_004AA8A4",
    words: [0xe59f100c, 0xe3a02000, 0xe5911164, 0xe281102c, 0xeafffffe] },
]);
const UNDEFINED = Object.freeze(["runtime_dispatch_root_97", "runtime_dispatch_selector_tail_100",
  "runtime_shared_context_root_100", "func_004AA8A4"]);
const STRICT_UNDEFINED = Object.freeze(["runtime_dispatch_root_97", "runtime_dispatch_selector_tail_100",
  "runtime_shared_context_root_100"]);
const PRIMARY_DESTINATION = "func_004AA8A4";

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(data) { return createHash("sha256").update(data).digest("hex"); }
async function readBounded(filePath, what) {
  const metadata = await stat(filePath);
  check(metadata.isFile(), `${what} is not a regular file`);
  check(metadata.size <= LIMITS.file, `${what} exceeds ${LIMITS.file} bytes`);
  const data = await readFile(filePath);
  check(data.length <= LIMITS.file, `${what} exceeds ${LIMITS.file} bytes`);
  return data;
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
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40, "ELF must be relocatable ARM");
  check(buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(24) === 0, "invalid ELF version or entry point");
  check(buffer.readUInt32LE(28) === 0 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0,
    "program headers are not permitted");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40, "unexpected ELF header size");
  const shoff = buffer.readUInt32LE(32);
  let shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(shoff !== 0, "missing section table"); range(buffer, shoff, 40, "section zero");
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
  if (shstrndx === 0xffff) shstrndx = raw[0].link;
  check(shstrndx > 0 && shstrndx < shnum && raw[shstrndx].type === 3, "invalid section-name table");
  const names = raw[shstrndx]; range(buffer, names.offset, names.size, "section-name table");
  const sections = raw.map((section) => ({ ...section,
    name: cstring(buffer, names.offset + section.nameOffset, names.offset + names.size, `section ${section.index}`) }));
  let executableBytes = 0;
  for (const section of sections) {
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `${section.name}: invalid alignment`);
    if (section.type !== 8) range(buffer, section.offset, section.size, section.name || `section ${section.index}`);
    if ((section.flags & 4) && section.type !== 8) {
      executableBytes += section.size;
      check(executableBytes <= LIMITS.executable, `executable data exceeds ${LIMITS.executable} bytes`);
    }
  }
  const symbols = [], tables = new Map(); let symbolCount = 0;
  for (const section of sections.filter((x) => x.type === 2 || x.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbol table`);
    const count = section.size / 16; symbolCount += count;
    check(symbolCount <= LIMITS.symbols, `symbol count exceeds ${LIMITS.symbols}`);
    check(section.link < sections.length && sections[section.link].type === 3, `${section.name}: invalid string table`);
    const strings = sections[section.link], table = [];
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * 16, nameOffset = buffer.readUInt32LE(p);
      const symbol = { table: section.index, tableIndex: i,
        name: cstring(buffer, strings.offset + nameOffset, strings.offset + strings.size, `symbol ${i}`),
        value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), info: buffer[p + 12],
        other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14), entryOffset: p };
      table.push(symbol); symbols.push(symbol);
    }
    tables.set(section.index, table);
  }
  const relocations = [];
  for (const section of sections.filter((x) => x.type === 9 || x.type === 4)) {
    const width = section.type === 9 ? 8 : 12;
    check(section.entsize === width && section.size % width === 0, `${section.name}: malformed relocation table`);
    check(section.info < sections.length && tables.has(section.link), `${section.name}: invalid relocation links`);
    const count = section.size / width;
    check(relocations.length + count <= LIMITS.relocations, `relocation count exceeds ${LIMITS.relocations}`);
    const table = tables.get(section.link);
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * width, info = buffer.readUInt32LE(p + 4), symbolIndex = info >>> 8;
      check(symbolIndex < table.length, `${section.name}: invalid relocation symbol`);
      relocations.push({ section: section.index, target: section.info, offset: buffer.readUInt32LE(p),
        type: info & 0xff, symbolIndex, symbol: table[symbolIndex], entryOffset: p });
    }
  }
  return { buffer, sections, symbols, relocations, executableBytes, shoff };
}

function validateConfig(config, source, spec) {
  check(config.schemaVersion === 1 && config.source === "src/main/arm_runtime_helpers_100.S" && config.mode === "arm" &&
    config.minimumAlignment === 4, "config header mismatch");
  check(config.sourceHash === sha256(source), "source digest drift");
  check(sha256(spec) === HASHES.specification && spec.toString("utf8").includes(`Source SHA-256: \`${config.sourceHash}\`.`),
    "specification digest drift");
  check(config.totalBodySize === 140 && config.totalAdjacentSize === 28 && config.expectedInstructionCount === 35 &&
    config.memoryOperationCount === 17 && config.directTailCount === 7 && config.returnCount === 0,
    "config totals mismatch");
  check(Array.isArray(config.functions) && config.functions.length === FUNCTIONS.length, "config function inventory mismatch");
  for (let i = 0; i < FUNCTIONS.length; i++) {
    const expected = FUNCTIONS[i], fn = config.functions[i];
    check(fn?.name === expected.name && fn.size === 20 && fn.ownedSize === 24 && fn.operations?.length === 5,
      `${expected.name}: config boundary mismatch`);
    const [literal, constant, load, fourth, tail] = fn.operations;
    check(literal.offset === 0 && literal.kind === "pc-relative-word-load" && literal.targetOffset === 20 &&
      literal.symbol === expected.literal, `${expected.name}: config literal load mismatch`);
    check(constant.offset === 4 && constant.kind === "constant-move" && constant.updatesFlags === false &&
      constant.value === (expected.selector ?? 0), `${expected.name}: config constant mismatch`);
    check(load.offset === 8 && load.kind === "word-load" && load.displacement === (expected.selector === undefined ? 356 : 16),
      `${expected.name}: config first dereference mismatch`);
    check(fourth.offset === 12 &&
      (expected.selector === undefined ? fourth.kind === "add-immediate" && fourth.value === expected.field &&
        fourth.updatesFlags === false : fourth.kind === "word-load" && fourth.displacement === 4),
      `${expected.name}: config fourth operation mismatch`);
    check(tail.offset === 16 && tail.kind === "direct-tail-branch" && tail.symbol === expected.tail &&
      tail.relocation === "R_ARM_JUMP24", `${expected.name}: config tail mismatch`);
    check(fn.adjacentWords?.length === 1 && fn.adjacentWords[0].offset === 20 &&
      fn.adjacentWords[0].kind === "R_ARM_ABS32" && fn.adjacentWords[0].symbol === expected.literal,
      `${expected.name}: config adjacent word mismatch`);
  }
  check(config.pcRelativeDataAccesses?.length === 7 && config.directTransfers?.length === 7 &&
    config.relocations?.length === 14, "config relocation inventories mismatch");
  for (const expected of FUNCTIONS) {
    const access = config.pcRelativeDataAccesses.find((x) => x.function === expected.name);
    check(access?.offset === 0 && access.width === 4 && access.targetOffset === 20 && access.symbol === expected.literal &&
      access.ownership === "owned-adjacent-word", `${expected.name}: PC-relative contract mismatch`);
    const transfer = config.directTransfers.find((x) => x.function === expected.name);
    check(transfer?.offset === 16 && transfer.width === 4 && transfer.kind === "R_ARM_JUMP24" &&
      transfer.symbol === expected.tail, `${expected.name}: direct transfer contract mismatch`);
    const rels = config.relocations.filter((x) => x.function === expected.name);
    check(rels.length === 2 && rels.some((x) => x.offset === 16 && x.type === "R_ARM_JUMP24" && x.symbol === expected.tail) &&
      rels.some((x) => x.offset === 20 && x.type === "R_ARM_ABS32" && x.symbol === expected.literal),
      `${expected.name}: relocation schedule mismatch`);
  }
  check(JSON.stringify(config.reusedSymbolicIdentities) === JSON.stringify(["runtime_dispatch_root_97"]) &&
    JSON.stringify(config.newSymbolicIdentities) === JSON.stringify(["runtime_dispatch_selector_tail_100", "runtime_shared_context_root_100"]),
    "symbolic identity inventory mismatch");
  check(config.aliases?.length === 0 && config.duplicateBodyClasses?.length === 0, "aliases or duplicate bodies are forbidden");
  const relation = config.branchIdentityContract?.secondaryEntryRelations?.[0];
  check(config.branchIdentityContract?.mode === "arm" &&
    JSON.stringify(config.branchIdentityContract.primaryEntries) === JSON.stringify(["func_004AA8A4"]) &&
    JSON.stringify(config.branchIdentityContract.secondaryEntries) === JSON.stringify(["runtime_dispatch_selector_tail_100"]) &&
    relation?.anchorSymbol === "func_00111E70" && relation.anchorOffset === 68 && relation.nextGlobal === "func_00111EC0" &&
    relation.bytesBeforeNextGlobal === 12 && relation.targetVisibility === "no-standalone-inventory-symbol",
    "secondary entry identity contract mismatch");
}

function validateElf(buffer) {
  const elf = parseElf(buffer), sectionNames = new Set(), owned = new Set();
  for (const section of elf.sections) {
    if (section.name) check(!sectionNames.has(section.name), `duplicate section ${section.name}`);
    sectionNames.add(section.name);
  }
  const externalSymbols = new Map(), identityKeys = [];
  for (const name of STRICT_UNDEFINED) {
    const matches = elf.symbols.filter((x) => x.name === name);
    check(matches.length === 1, `${name}: undefined symbol must be unique`);
    const symbol = matches[0];
    check(symbol.shndx === 0 && symbol.value === 0 && symbol.size === 0 && (symbol.info >>> 4) === 1 &&
      (symbol.info & 15) === 0 && (symbol.other & 3) === 0, `${name}: must be undefined global default NOTYPE`);
    externalSymbols.set(name, symbol);
    identityKeys.push(`undefined:${symbol.table}:${symbol.tableIndex}`);
  }
  const primaryMatches = elf.symbols.filter((x) => x.name === PRIMARY_DESTINATION);
  check(primaryMatches.length === 1, `${PRIMARY_DESTINATION}: destination symbol must be unique`);
  const primary = primaryMatches[0];
  if (primary.shndx === 0) {
    check(primary.value === 0 && primary.size === 0 && (primary.info >>> 4) === 1 &&
      (primary.info & 15) === 0 && (primary.other & 3) === 0,
    `${PRIMARY_DESTINATION}: standalone destination must be undefined global default NOTYPE`);
    identityKeys.push(`undefined:${primary.table}:${primary.tableIndex}`);
  } else {
    check(primary.shndx < elf.sections.length && (primary.info >>> 4) === 1 &&
      (primary.info & 15) === 2 && (primary.other & 3) === 0,
    `${PRIMARY_DESTINATION}: resolved destination must be global default FUNC`);
    const section = elf.sections[primary.shndx];
    check(section.type === 1 && (section.flags & 4) !== 0,
      `${PRIMARY_DESTINATION}: resolved destination is not executable PROGBITS`);
    check(section.align >= 4 && primary.value % 4 === 0 && primary.value < section.size,
      `${PRIMARY_DESTINATION}: resolved destination is not aligned ARM code`);
    identityKeys.push(`defined:${primary.shndx}:${primary.value}`);
  }
  externalSymbols.set(PRIMARY_DESTINATION, primary);
  check(new Set(identityKeys).size === identityKeys.length, "external identities alias");
  for (const expected of FUNCTIONS) {
    const matches = elf.sections.filter((x) => x.name === `.text.${expected.name}`);
    check(matches.length === 1, `${expected.name}: missing or duplicate section`);
    const section = matches[0]; owned.add(section.index);
    check(section.type === 1 && section.flags === 6 && section.addr === 0 && section.align === 4 && section.size === 24,
      `${expected.name}: section contract mismatch`);
    expected.words.forEach((word, i) => check(buffer.readUInt32LE(section.offset + i * 4) === word,
      `${expected.name}: instruction ${i} differs`));
    check(buffer.readUInt32LE(section.offset + 20) === 0, `${expected.name}: literal addend must be zero`);
    const funcs = elf.symbols.filter((x) => x.name === expected.name);
    check(funcs.length === 1, `${expected.name}: function symbol must be unique`);
    const fn = funcs[0];
    check(fn.shndx === section.index && fn.value === 0 && fn.size === 20 && fn.info === 0x12 && (fn.other & 3) === 0,
      `${expected.name}: function symbol contract mismatch`);
    const maps = elf.symbols.filter((x) => x.shndx === section.index && x.name.startsWith("$"));
    check(maps.length === 2 && maps.some((x) => x.name === "$a" && x.value === 0) &&
      maps.some((x) => x.name === "$d" && x.value === 20) && maps.every((x) => x.info === 0),
      `${expected.name}: mapping-symbol contract mismatch`);
    const extras = elf.symbols.filter((x) => x.shndx === section.index && x.name &&
      x.name !== expected.name && x.name !== "$a" && x.name !== "$d");
    check(extras.length === 0, `${expected.name}: extra named symbol`);
    const rels = elf.relocations.filter((x) => x.target === section.index);
    check(rels.length === 2, `${expected.name}: must own exactly two relocations`);
    const jump = rels.find((x) => x.offset === 16), literal = rels.find((x) => x.offset === 20);
    check(jump?.type === 29 && jump.symbol === externalSymbols.get(expected.tail), `${expected.name}: tail relocation mismatch`);
    check(literal?.type === 2 && literal.symbol === externalSymbols.get(expected.literal), `${expected.name}: literal relocation mismatch`);
  }
  check(elf.relocations.filter((x) => owned.has(x.target)).length === 14, "extra relocation in owned sections");
  for (const symbol of elf.symbols) if (FUNCTIONS.some((x) => x.name === symbol.name))
    check(owned.has(symbol.shndx), "foreign symbol capture");
  return elf;
}

function align(value, amount) { return (value + amount - 1) & -amount; }
function wordsBuffer(words) { const out = Buffer.alloc(words.length * 4); words.forEach((x, i) => out.writeUInt32LE(x, i * 4)); return out; }
function makeCompositeElf(foreignCount = 12_001) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 }];
  const owned = [];
  for (const fn of FUNCTIONS) { owned.push(sections.length); sections.push({ name: `.text.${fn.name}`, type: 1,
    flags: 6, align: 4, data: Buffer.concat([wordsBuffer(fn.words), Buffer.alloc(4)]), link: 0, info: 0, entsize: 0 }); }
  for (let i = 0; i < foreignCount; i++) sections.push({ name: `.text.foreign_${i}`, type: 1, flags: 6, align: 4,
    data: Buffer.alloc(4), link: 0, info: 0, entsize: 0 });
  let strings = Buffer.from("\0"); const stringOffsets = new Map([["", 0]]);
  const addString = (name) => { if (stringOffsets.has(name)) return stringOffsets.get(name); const at = strings.length;
    strings = Buffer.concat([strings, Buffer.from(`${name}\0`)]); stringOffsets.set(name, at); return at; };
  ["$a", "$d", ...FUNCTIONS.map((x) => x.name), ...UNDEFINED].forEach(addString);
  const strtabIndex = sections.length;
  sections.push({ name: ".strtab", type: 3, flags: 0, align: 1, data: strings, link: 0, info: 0, entsize: 0 });
  const records = [{ name: "", value: 0, size: 0, info: 0, other: 0, shndx: 0 }];
  for (const index of owned) { records.push({ name: "$a", value: 0, size: 0, info: 0, other: 0, shndx: index });
    records.push({ name: "$d", value: 20, size: 0, info: 0, other: 0, shndx: index }); }
  const firstGlobal = records.length, functionIndexes = new Map(), undefinedIndexes = new Map();
  FUNCTIONS.forEach((fn, i) => { functionIndexes.set(fn.name, records.length); records.push({ name: fn.name, value: 0,
    size: 20, info: 0x12, other: 0, shndx: owned[i] }); });
  UNDEFINED.forEach((name) => { undefinedIndexes.set(name, records.length); records.push({ name, value: 0, size: 0,
    info: 0x10, other: 0, shndx: 0 }); });
  const symdata = Buffer.alloc(records.length * 16);
  records.forEach((symbol, i) => { const p = i * 16; symdata.writeUInt32LE(addString(symbol.name), p);
    symdata.writeUInt32LE(symbol.value, p + 4); symdata.writeUInt32LE(symbol.size, p + 8); symdata[p + 12] = symbol.info;
    symdata[p + 13] = symbol.other; symdata.writeUInt16LE(symbol.shndx, p + 14); });
  sections[strtabIndex].data = strings; const symtabIndex = sections.length;
  sections.push({ name: ".symtab", type: 2, flags: 0, align: 4, data: symdata,
    link: strtabIndex, info: firstGlobal, entsize: 16 });
  FUNCTIONS.forEach((fn, i) => { const rel = Buffer.alloc(16); rel.writeUInt32LE(16, 0);
    rel.writeUInt32LE((undefinedIndexes.get(fn.tail) << 8) | 29, 4); rel.writeUInt32LE(20, 8);
    rel.writeUInt32LE((undefinedIndexes.get(fn.literal) << 8) | 2, 12);
    sections.push({ name: `.rel.text.${fn.name}`, type: 9, flags: 0, align: 4, data: rel,
      link: symtabIndex, info: owned[i], entsize: 8 }); });
  let shstrings = Buffer.from("\0"); const sectionNameOffsets = [];
  for (const section of sections) { sectionNameOffsets.push(shstrings.length);
    shstrings = Buffer.concat([shstrings, Buffer.from(`${section.name}\0`)]); }
  const shstrIndex = sections.length; sectionNameOffsets.push(shstrings.length);
  shstrings = Buffer.concat([shstrings, Buffer.from(".shstrtab\0")]);
  sections.push({ name: ".shstrtab", type: 3, flags: 0, align: 1, data: shstrings, link: 0, info: 0, entsize: 0 });
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) { cursor = align(cursor, Math.max(1, sections[i].align));
    sections[i].offset = cursor; cursor += sections[i].data.length; }
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
  check(parsed.sections.filter((x) => x.name.startsWith(".text.foreign_")).length > 12_000,
    "large valid fixture lacks >12,000 foreign executable sections");
  const mutate = (callback) => { const copy = Buffer.from(valid), elf = parseElf(copy); callback(copy, elf); return copy; };
  const resolveSymbol = (buffer, elf, name, section, value = 0, info = 0x12) => {
    const symbol = elf.symbols.find((x) => x.name === name);
    check(symbol, `self-test symbol ${name} is missing`);
    buffer.writeUInt32LE(value, symbol.entryOffset + 4);
    buffer[symbol.entryOffset + 12] = info;
    buffer.writeUInt16LE(section.index, symbol.entryOffset + 14);
  };
  const resolvedPrimary = mutate((b, e) => resolveSymbol(b, e, PRIMARY_DESTINATION,
    e.sections.find((x) => x.name === ".text.foreign_0")));
  validateElf(resolvedPrimary);
  expectReject("oversized input", () => Buffer.alloc(LIMITS.file + 1), "input exceeds");
  expectReject("excessive executable payload", () => { const b = Buffer.concat([valid, Buffer.alloc(LIMITS.executable + 1)]);
    const e = parseElf(valid), s = e.sections.find((x) => x.name === ".text.foreign_0");
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(LIMITS.executable + 1, s.headerOffset + 20); return b;
  }, "executable data exceeds");
  expectReject("excessive sections", () => { const b = Buffer.from(valid); b.writeUInt16LE(LIMITS.sections + 1, 48); return b; }, "section count exceeds");
  const excessiveSymbols = (type) => { const size = (LIMITS.symbols + 1) * 16, b = Buffer.concat([valid, Buffer.alloc(size)]);
    const s = parseElf(valid).sections.find((x) => x.name === ".symtab"); b.writeUInt32LE(type, s.headerOffset + 4);
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(size, s.headerOffset + 20); return b; };
  expectReject("excessive symbols", () => excessiveSymbols(2), "symbol count exceeds");
  expectReject("excessive dynamic symbols", () => excessiveSymbols(11), "symbol count exceeds");
  expectReject("excessive relocations", () => { const size = (LIMITS.relocations + 1) * 8,
    b = Buffer.concat([valid, Buffer.alloc(size)]), s = parseElf(valid).sections.find((x) => x.name.startsWith(".rel.text."));
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(size, s.headerOffset + 20); return b;
  }, "relocation count exceeds");
  expectReject("wrong instruction", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_001159F0"); b[s.offset + 4] ^= 1; }));
  expectReject("flag-setting substitution", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_004AAA24"); b[s.offset + 15] |= 0x10; }));
  expectReject("call substitution", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_00115A08"); b[s.offset + 19] = 0xeb; }));
  expectReject("shared literal pool", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_001159D8"); b.writeUInt32LE(20, s.headerOffset + 20); }));
  expectReject("mapping boundary drift", () => mutate((b, e) => { const s = e.symbols.find((x) => x.name === "$d"); b.writeUInt32LE(16, s.entryOffset + 4); }));
  expectReject("branch relocation kind", () => mutate((b, e) => { const r = e.relocations.find((x) => x.offset === 16); b.writeUInt32LE((r.symbolIndex << 8) | 28, r.entryOffset + 4); }));
  expectReject("branch identity", () => mutate((b, e) => { const r = e.relocations.find((x) => x.offset === 16);
    const wrong = e.symbols.find((x) => x.name === "runtime_dispatch_root_97"); b.writeUInt32LE((wrong.tableIndex << 8) | 29, r.entryOffset + 4); }));
  expectReject("literal identity merging", () => mutate((b, e) => { const r = e.relocations.find((x) => x.offset === 20 && x.symbol.name === "runtime_shared_context_root_100");
    const wrong = e.symbols.find((x) => x.name === "runtime_dispatch_root_97"); b.writeUInt32LE((wrong.tableIndex << 8) | 2, r.entryOffset + 4); }));
  expectReject("extra owned relocation", () => mutate((b, e) => { const foreign = e.sections.find((x) => x.name === ".text.foreign_0"),
    rel = e.sections.find((x) => x.name.startsWith(".rel.text.")); b.writeUInt32LE(9, foreign.headerOffset + 4);
    b.writeUInt32LE(0, foreign.headerOffset + 8); b.writeUInt32LE(rel.offset, foreign.headerOffset + 16);
    b.writeUInt32LE(8, foreign.headerOffset + 20); b.writeUInt32LE(rel.link, foreign.headerOffset + 24);
    b.writeUInt32LE(rel.info, foreign.headerOffset + 28); b.writeUInt32LE(4, foreign.headerOffset + 32); b.writeUInt32LE(8, foreign.headerOffset + 36); }));
  expectReject("extra named alias", () => mutate((b, e) => { const map = e.symbols.find((x) => x.name === "$a"),
    named = e.symbols.find((x) => x.name === FUNCTIONS[1].name); b.writeUInt32LE(b.readUInt32LE(named.entryOffset), map.entryOffset); }));
  expectReject("resolved primary bad binding", () => mutate((b, e) => resolveSymbol(b, e, PRIMARY_DESTINATION,
    e.sections.find((x) => x.name === ".text.foreign_0"), 0, 0x02)));
  expectReject("resolved primary bad type", () => mutate((b, e) => resolveSymbol(b, e, PRIMARY_DESTINATION,
    e.sections.find((x) => x.name === ".text.foreign_0"), 0, 0x11)));
  expectReject("resolved primary Thumb state", () => mutate((b, e) => resolveSymbol(b, e, PRIMARY_DESTINATION,
    e.sections.find((x) => x.name === ".text.foreign_0"), 1, 0x12)));
  expectReject("resolved primary bad alignment", () => mutate((b, e) => { const section = e.sections.find((x) => x.name === ".text.foreign_0");
    resolveSymbol(b, e, PRIMARY_DESTINATION, section); b.writeUInt32LE(2, section.headerOffset + 32); }));
  expectReject("resolved primary non-executable section", () => mutate((b, e) => { const section = e.sections.find((x) => x.name === ".text.foreign_0");
    resolveSymbol(b, e, PRIMARY_DESTINATION, section); b.writeUInt32LE(2, section.headerOffset + 8); }));
  expectReject("resolved primary identity collapse", () => mutate((b, e) => resolveSymbol(b, e, PRIMARY_DESTINATION,
    e.sections.find((x) => x.name === `.text.${FUNCTIONS[0].name}`))));
  expectReject("resolved secondary-tail identity", () => mutate((b, e) => resolveSymbol(b, e,
    "runtime_dispatch_selector_tail_100", e.sections.find((x) => x.name === ".text.foreign_0"))));
  expectReject("resolved data-root identity", () => mutate((b, e) => resolveSymbol(b, e,
    "runtime_shared_context_root_100", e.sections.find((x) => x.name === ".text.foreign_0"))));
  const drift = structuredClone(config); drift.functions[0].operations[1].value = 9;
  expectConfigReject("config drift", drift, source, spec);
  expectConfigReject("source drift", config, Buffer.concat([source, Buffer.from("\n")]), spec);
  expectConfigReject("spec drift", config, Buffer.concat([source]), Buffer.concat([spec, Buffer.from("\n")]));
  return { sections: parsed.sections.length, symbols: parsed.symbols.length, relocations: parsed.relocations.length,
    foreignExecutableSections: 12_001 };
}

async function main() {
  const args = process.argv.slice(2), runSelfTest = args.includes("--self-test"), paths = args.filter((x) => x !== "--self-test");
  check(paths.length <= 1 && (runSelfTest || paths.length === 1),
    "usage: validate-arm-runtime-helpers-100.mjs [--self-test] [object.o]");
  const [configBytes, spec, source] = await Promise.all([readBounded(CONFIG_PATH, "config"),
    readBounded(SPEC_PATH, "specification"), readBounded(SOURCE_PATH, "source")]);
  check(sha256(configBytes) === HASHES.config, "config digest drift");
  let config; try { config = JSON.parse(configBytes); } catch { fail("invalid JSON config"); }
  validateConfig(config, source, spec);
  const result = paths.length ? validateElf(await readBounded(path.resolve(paths[0]), "input")) : null;
  const self = runSelfTest ? selfTest(config, source, spec) : null;
  console.log(`arm-runtime-helpers-100: ok${result ? `; sections=${result.sections.length}; symbols=${result.symbols.length}; relocations=${result.relocations.length}; executableBytes=${result.executableBytes}` : ""}${self ? `; selfTestSections=${self.sections}; foreignExecutableSections=${self.foreignExecutableSections}` : ""}`);
}

await main().catch((error) => { console.error(`arm-runtime-helpers-100: ${error.message}`); process.exitCode = 1; });
