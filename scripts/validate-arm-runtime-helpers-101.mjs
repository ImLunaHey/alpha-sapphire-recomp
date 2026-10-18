#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-101.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_runtime_helpers_101.md");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_101.S");
const LIMITS = Object.freeze({ file: 64 * 1024 * 1024, executable: 16 * 1024 * 1024,
  sections: 16_384, records: 1_000_000 });
const ELF_FLAGS = 0x05000000;
const HASHES = Object.freeze({ config: "c827dffca0a3a43ede761e30eb0aea82c9a0b29c008d1f31ad08d44a42cf8ceb",
  specification: "c21959a5abb937dcb6909a874e4d4e905453233cfb4b51df2e73b80887a903c2",
  normalizedConfig: "1b9dc6bad225765f49f426942aad3507b4040df1b4132b636d83a3693beaa187" });

const FUNCTIONS = Object.freeze([
  { name: "func_001D1DC8", register: 1, displacement: 12, literal: "runtime_indirect_dispatch_root_101",
    words: [0xe59f1004, 0xe591100c, 0xe12fff11], tail: null },
  { name: "func_001D1EEC", register: 3, displacement: 8, literal: "runtime_indirect_dispatch_root_101",
    words: [0xe59f3004, 0xe5933008, 0xe12fff13], tail: null },
  { name: "func_001D4248", register: 1, displacement: 0, literal: "runtime_indirect_dispatch_slot_101",
    words: [0xe59f1004, 0xe5911000, 0xe12fff11], tail: null },
  { name: "func_00416324", register: 0, displacement: 0, literal: "runtime_dispatch_object_root_101",
    words: [0xe59f0004, 0xe5900000, 0xeafffffe], tail: "func_004E60D8" },
  { name: "func_0044F520", register: 0, displacement: 16, literal: "runtime_dispatch_root_97",
    words: [0xe59f0004, 0xe5900010, 0xeafffffe], tail: "func_0010D1DC" },
]);
const DATA_IDENTITIES = Object.freeze(["runtime_indirect_dispatch_root_101", "runtime_indirect_dispatch_slot_101",
  "runtime_dispatch_object_root_101", "runtime_dispatch_root_97"]);
const BRANCH_IDENTITIES = Object.freeze(["func_004E60D8", "func_0010D1DC"]);
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
function cstring(buffer, offset, limit, what) {
  check(offset >= 0 && offset < limit, `${what} has an invalid string offset`);
  const end = buffer.indexOf(0, offset); check(end !== -1 && end < limit, `${what} is unterminated`);
  return buffer.toString("utf8", offset, end);
}

function parseElf(buffer) {
  check(buffer.length <= LIMITS.file, `input exceeds ${LIMITS.file} bytes`); range(buffer, 0, 52, "ELF header");
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), "not ELF");
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    "ELF must be 32-bit little-endian System V ABI version 0");
  check(buffer.subarray(9, 16).every((byte) => byte === 0), "nonzero ELF identification padding");
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40, "ELF must be relocatable ARM");
  check(buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(24) === 0, "invalid ELF version or entry point");
  check(buffer.readUInt32LE(28) === 0 && buffer.readUInt32LE(36) === ELF_FLAGS && buffer.readUInt16LE(42) === 0 &&
    buffer.readUInt16LE(44) === 0, "program headers are forbidden or ARM EABI flags changed");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40, "unexpected ELF header size");
  const shoff = buffer.readUInt32LE(32); check(shoff !== 0, "missing section table"); range(buffer, shoff, 40, "section zero");
  let shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  check(shnum > 0 && shnum <= LIMITS.sections, `section count exceeds ${LIMITS.sections}`); range(buffer, shoff, shnum * 40, "section table");
  const raw = [];
  for (let i = 0; i < shnum; i++) { const p = shoff + i * 40; raw.push({ index: i, nameOffset: buffer.readUInt32LE(p),
    type: buffer.readUInt32LE(p + 4), flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12),
    offset: buffer.readUInt32LE(p + 16), size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24),
    info: buffer.readUInt32LE(p + 28), align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36), headerOffset: p }); }
  check(raw[0].nameOffset === 0 && raw[0].type === 0 && raw[0].flags === 0 && raw[0].addr === 0 && raw[0].offset === 0 &&
    raw[0].size === 0 && raw[0].link === 0 && raw[0].info === 0 && raw[0].align === 0 && raw[0].entsize === 0,
    "section zero must be canonical null");
  if (shstrndx === 0xffff) shstrndx = raw[0].link;
  check(shstrndx > 0 && shstrndx < shnum && raw[shstrndx].type === 3, "invalid section-name table");
  const names = raw[shstrndx]; range(buffer, names.offset, names.size, "section-name table");
  const sections = raw.map((s) => ({ ...s, name: cstring(buffer, names.offset + s.nameOffset,
    names.offset + names.size, `section ${s.index}`) }));
  let executableBytes = 0;
  for (const section of sections) {
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `${section.name}: invalid alignment`);
    if (section.type !== 8) range(buffer, section.offset, section.size, section.name || `section ${section.index}`);
    if ((section.flags & 4) && section.type !== 8) { executableBytes += section.size;
      check(executableBytes <= LIMITS.executable, `executable data exceeds ${LIMITS.executable} bytes`); }
  }
  const symbols = [], tables = new Map(); let records = 0;
  for (const section of sections.filter((x) => x.type === 2 || x.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbol table`);
    const count = section.size / 16; records += count; check(records <= LIMITS.records, `symbol and relocation count exceeds ${LIMITS.records}`);
    check(section.link < sections.length && sections[section.link].type === 3, `${section.name}: invalid string table`);
    const strings = sections[section.link]; range(buffer, strings.offset, strings.size, `${section.name} string table`); const table = [];
    for (let i = 0; i < count; i++) { const p = section.offset + i * 16, no = buffer.readUInt32LE(p);
      const symbol = { table: section.index, tableIndex: i,
        name: cstring(buffer, strings.offset + no, strings.offset + strings.size, `symbol ${i}`),
        value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), info: buffer[p + 12], other: buffer[p + 13],
        shndx: buffer.readUInt16LE(p + 14), entryOffset: p }; table.push(symbol); symbols.push(symbol); }
    tables.set(section.index, table);
  }
  const relocations = [];
  for (const section of sections.filter((x) => x.type === 9 || x.type === 4)) {
    const width = section.type === 9 ? 8 : 12;
    check(section.entsize === width && section.size % width === 0, `${section.name}: malformed relocation table`);
    check(section.info < sections.length && tables.has(section.link), `${section.name}: invalid relocation links`);
    const count = section.size / width; records += count;
    check(records <= LIMITS.records, `symbol and relocation count exceeds ${LIMITS.records}`); const table = tables.get(section.link);
    for (let i = 0; i < count; i++) { const p = section.offset + i * width, info = buffer.readUInt32LE(p + 4), si = info >>> 8;
      check(si < table.length, `${section.name}: invalid relocation symbol`);
      relocations.push({ section: section.index, target: section.info, offset: buffer.readUInt32LE(p), type: info & 255,
        symbolIndex: si, symbol: table[si], entryOffset: p }); }
  }
  return { buffer, sections, symbols, relocations, executableBytes };
}

function validateConfig(config, source, spec) {
  const normalized = structuredClone(config); normalized.sourceHash = null;
  check(sha256(JSON.stringify(normalized)) === HASHES.normalizedConfig, "config contract drift");
  check(config.sourceHash === sha256(source), "source digest drift");
  check(sha256(spec) === HASHES.specification && spec.toString("utf8").includes(`Source SHA-256: \`${config.sourceHash}\`.`),
    "specification digest drift");
  check(config.source === "src/main/arm_runtime_helpers_101.S" && config.totalBodySize === 60 &&
    config.totalAdjacentSize === 20 && config.expectedInstructionCount === 15 && config.memoryOperationCount === 10 &&
    config.directTailCount === 2 && config.indirectTransferCount === 3 && config.expectedRelocationCount === 7,
    "config totals drift");
}

function identityKey(symbol) { return symbol.shndx === 0 ? `u:${symbol.table}:${symbol.tableIndex}` : `d:${symbol.shndx}:${symbol.value}`; }
function validateElf(buffer) {
  const elf = parseElf(buffer), sectionNames = new Set(), owned = new Set(), external = new Map(), identities = [];
  for (const section of elf.sections) { if (section.name) check(!sectionNames.has(section.name), `duplicate section ${section.name}`); sectionNames.add(section.name); }
  for (const name of EXTERNALS) {
    const matches = elf.symbols.filter((x) => x.name === name); check(matches.length === 1, `${name}: symbol must be unique`);
    const symbol = matches[0]; check((symbol.info >>> 4) === 1 && symbol.other === 0, `${name}: must be global default-visible`);
    if (symbol.shndx === 0) check(symbol.value === 0 && symbol.size === 0 && (symbol.info & 15) === 0,
      `${name}: undefined identity must be zero NOTYPE`);
    else {
      check(symbol.shndx < elf.sections.length, `${name}: invalid definition section`); const section = elf.sections[symbol.shndx];
      if (DATA_IDENTITIES.includes(name)) check(((symbol.info & 15) === 0 || (symbol.info & 15) === 1) &&
        section.type === 1 && (section.flags & 2) !== 0 &&
        (section.flags & 4) === 0 && section.align >= 4 && symbol.value % 4 === 0 && symbol.value <= section.size - 4,
        `${name}: resolved identity must be aligned initialized data`);
      else check((symbol.info & 15) === 2 && section.type === 1 && (section.flags & 4) !== 0 && section.align >= 4 &&
        symbol.value % 4 === 0 && symbol.value < section.size, `${name}: resolved destination must be aligned ARM code`);
    }
    external.set(name, symbol); identities.push(identityKey(symbol));
  }
  check(new Set(identities).size === identities.length, `external identity aliasing: ${identities.join(",")}`);
  for (const expected of FUNCTIONS) {
    const matches = elf.sections.filter((x) => x.name === `.text.${expected.name}`); check(matches.length === 1, `${expected.name}: missing or duplicate section`);
    const section = matches[0]; owned.add(section.index);
    check(section.type === 1 && section.flags === 6 && section.addr === 0 && section.align === 4 && section.size === 16,
      `${expected.name}: section contract mismatch`);
    expected.words.forEach((word, i) => check(buffer.readUInt32LE(section.offset + i * 4) === word, `${expected.name}: instruction ${i} differs`));
    check(buffer.readUInt32LE(section.offset + 12) === 0, `${expected.name}: literal addend must be zero`);
    const funcs = elf.symbols.filter((x) => x.name === expected.name); check(funcs.length === 1, `${expected.name}: function symbol must be unique`);
    const fn = funcs[0]; check(fn.shndx === section.index && fn.value === 0 && fn.size === 12 && fn.info === 0x12 && fn.other === 0,
      `${expected.name}: function symbol contract mismatch`);
    const maps = elf.symbols.filter((x) => x.shndx === section.index && x.name.startsWith("$"));
    check(maps.length === 2 && maps.some((x) => x.name === "$a" && x.value === 0) && maps.some((x) => x.name === "$d" && x.value === 12) &&
      maps.every((x) => x.size === 0 && x.info === 0 && x.other === 0), `${expected.name}: mapping-symbol contract mismatch`);
    const sectionSymbols = elf.symbols.filter((x) => x.shndx === section.index && x.name === "" && x.value === 0 &&
      x.size === 0 && x.info === 3 && x.other === 0);
    check(sectionSymbols.length === 1, `${expected.name}: canonical section symbol mismatch`);
    const allowed = new Set([fn, ...maps, sectionSymbols[0]]);
    const extras = elf.symbols.filter((x) => x.shndx === section.index && !allowed.has(x));
    check(extras.length === 0, `${expected.name}: extra named or unnamed alias`);
    const rels = elf.relocations.filter((x) => x.target === section.index), count = expected.tail ? 2 : 1;
    check(rels.length === count, `${expected.name}: relocation count mismatch`);
    const literal = rels.find((x) => x.offset === 12); check(literal?.type === 2 && literal.symbol === external.get(expected.literal),
      `${expected.name}: literal relocation mismatch`);
    if (expected.tail) { const jump = rels.find((x) => x.offset === 8); check(jump?.type === 29 && jump.symbol === external.get(expected.tail),
      `${expected.name}: tail relocation mismatch`); }
  }
  check(elf.relocations.filter((x) => owned.has(x.target)).length === 7, "extra relocation in owned sections");
  const ownedIdentityKeys = FUNCTIONS.map((f) => { const s = elf.symbols.find((x) => x.name === f.name); return identityKey(s); });
  check(ownedIdentityKeys.every((key) => !identities.includes(key)), "external identity aliases an owned function");
  for (const symbol of elf.symbols.filter((x) => FUNCTIONS.some((f) => f.name === x.name))) check(owned.has(symbol.shndx), "foreign symbol capture");
  return elf;
}

function align(value, amount) { return (value + amount - 1) & -amount; }
function wordsBuffer(words) { const out = Buffer.alloc(words.length * 4); words.forEach((x, i) => out.writeUInt32LE(x, i * 4)); return out; }
function makeCompositeElf(foreignCount = 12_001) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 }], owned = [];
  for (const fn of FUNCTIONS) { owned.push(sections.length); sections.push({ name: `.text.${fn.name}`, type: 1, flags: 6, align: 4,
    data: Buffer.concat([wordsBuffer(fn.words), Buffer.alloc(4)]), link: 0, info: 0, entsize: 0 }); }
  for (let i = 0; i < foreignCount; i++) sections.push({ name: `.text.foreign_${i}`, type: 1, flags: 6, align: 4,
    data: Buffer.alloc(4), link: 0, info: 0, entsize: 0 });
  let strings = Buffer.from("\0"); const offsets = new Map([["", 0]]), add = (name) => { if (offsets.has(name)) return offsets.get(name);
    const at = strings.length; strings = Buffer.concat([strings, Buffer.from(`${name}\0`)]); offsets.set(name, at); return at; };
  ["$a", "$d", ...FUNCTIONS.map((x) => x.name), ...EXTERNALS].forEach(add); const strtabIndex = sections.length;
  sections.push({ name: ".strtab", type: 3, flags: 0, align: 1, data: strings, link: 0, info: 0, entsize: 0 });
  const records = [{ name: "", value: 0, size: 0, info: 0, other: 0, shndx: 0 }];
  for (const index of owned) { records.push({ name: "", value: 0, size: 0, info: 3, other: 0, shndx: index });
    records.push({ name: "$a", value: 0, size: 0, info: 0, other: 0, shndx: index });
    records.push({ name: "$d", value: 12, size: 0, info: 0, other: 0, shndx: index }); }
  const firstGlobal = records.length, externalIndexes = new Map();
  FUNCTIONS.forEach((fn, i) => records.push({ name: fn.name, value: 0, size: 12, info: 0x12, other: 0, shndx: owned[i] }));
  EXTERNALS.forEach((name) => { externalIndexes.set(name, records.length); records.push({ name, value: 0, size: 0, info: 0x10, other: 0, shndx: 0 }); });
  const symdata = Buffer.alloc(records.length * 16); records.forEach((s, i) => { const p = i * 16; symdata.writeUInt32LE(add(s.name), p);
    symdata.writeUInt32LE(s.value, p + 4); symdata.writeUInt32LE(s.size, p + 8); symdata[p + 12] = s.info; symdata[p + 13] = s.other;
    symdata.writeUInt16LE(s.shndx, p + 14); }); sections[strtabIndex].data = strings; const symtabIndex = sections.length;
  sections.push({ name: ".symtab", type: 2, flags: 0, align: 4, data: symdata, link: strtabIndex, info: firstGlobal, entsize: 16 });
  FUNCTIONS.forEach((fn, i) => { const rel = Buffer.alloc(fn.tail ? 16 : 8); let p = 0;
    if (fn.tail) { rel.writeUInt32LE(8, p); rel.writeUInt32LE((externalIndexes.get(fn.tail) << 8) | 29, p + 4); p += 8; }
    rel.writeUInt32LE(12, p); rel.writeUInt32LE((externalIndexes.get(fn.literal) << 8) | 2, p + 4);
    sections.push({ name: `.rel.text.${fn.name}`, type: 9, flags: 0, align: 4, data: rel, link: symtabIndex, info: owned[i], entsize: 8 }); });
  let shstrings = Buffer.from("\0"); const nameOffsets = [];
  for (const section of sections) {
    if (section.name === "") nameOffsets.push(0);
    else { nameOffsets.push(shstrings.length); shstrings = Buffer.concat([shstrings, Buffer.from(`${section.name}\0`)]); }
  }
  const shstrIndex = sections.length; nameOffsets.push(shstrings.length); shstrings = Buffer.concat([shstrings, Buffer.from(".shstrtab\0")]);
  sections.push({ name: ".shstrtab", type: 3, flags: 0, align: 1, data: shstrings, link: 0, info: 0, entsize: 0 });
  let cursor = 52; for (let i = 1; i < sections.length; i++) { cursor = align(cursor, Math.max(1, sections[i].align)); sections[i].offset = cursor; cursor += sections[i].data.length; }
  const shoff = align(cursor, 4), out = Buffer.alloc(shoff + sections.length * 40); out.set([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1], 0);
  out.writeUInt16LE(1, 16); out.writeUInt16LE(40, 18); out.writeUInt32LE(1, 20); out.writeUInt32LE(shoff, 32);
  out.writeUInt32LE(0x05000000, 36); out.writeUInt16LE(52, 40); out.writeUInt16LE(40, 46); out.writeUInt16LE(sections.length, 48); out.writeUInt16LE(shstrIndex, 50);
  sections.forEach((s, i) => { if (i) s.data.copy(out, s.offset); const p = shoff + i * 40; out.writeUInt32LE(nameOffsets[i], p);
    out.writeUInt32LE(s.type, p + 4); out.writeUInt32LE(s.flags, p + 8); out.writeUInt32LE(s.offset ?? 0, p + 16); out.writeUInt32LE(s.data.length, p + 20);
    out.writeUInt32LE(s.link, p + 24); out.writeUInt32LE(s.info, p + 28); out.writeUInt32LE(s.align, p + 32); out.writeUInt32LE(s.entsize, p + 36); }); return out;
}

function expectReject(label, make, message = null) { let rejected = false; try { validateElf(make()); } catch (error) { rejected = true;
  if (message) check(error.message.includes(message), `self-test ${label} hit '${error.message}' instead of '${message}'`); }
  check(rejected, `self-test unexpectedly accepted ${label}`); }
function expectConfigReject(label, config, source, spec) { let rejected = false; try { validateConfig(config, source, spec); } catch { rejected = true; }
  check(rejected, `self-test unexpectedly accepted ${label}`); }
function selfTest(config, source, spec) {
  const valid = makeCompositeElf(), parsed = validateElf(valid); check(parsed.sections.filter((x) => x.name.startsWith(".text.foreign_")).length > 12_000,
    "large fixture lacks >12,000 foreign executable sections");
  const mutate = (callback) => { const copy = Buffer.from(valid), elf = parseElf(copy); callback(copy, elf); return copy; };
  const resolve = (b, e, name, section, value, info) => { const s = e.symbols.find((x) => x.name === name); b.writeUInt32LE(value, s.entryOffset + 4);
    b.writeUInt32LE(DATA_IDENTITIES.includes(name) ? 4 : 0, s.entryOffset + 8); b[s.entryOffset + 12] = info; b.writeUInt16LE(section.index, s.entryOffset + 14); };
  validateElf(mutate((b, e) => {
    BRANCH_IDENTITIES.forEach((name, i) => resolve(b, e, name, e.sections.find((x) => x.name === `.text.foreign_${i + 5}`), 0, 0x12));
    for (let i = 0; i < DATA_IDENTITIES.length; i++) { const data = e.sections.find((x) => x.name === `.text.foreign_${i + 1}`);
      b.writeUInt32LE(2, data.headerOffset + 8); resolve(b, e, DATA_IDENTITIES[i], data, 0, 0x11); } }));
  expectReject("oversized input", () => Buffer.alloc(LIMITS.file + 1), "input exceeds");
  expectReject("excessive executable payload", () => { const b = Buffer.concat([valid, Buffer.alloc(LIMITS.executable + 1)]), e = parseElf(valid), s = e.sections.find((x) => x.name === ".text.foreign_0");
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(LIMITS.executable + 1, s.headerOffset + 20); return b; }, "executable data exceeds");
  expectReject("excessive sections", () => { const b = Buffer.from(valid); b.writeUInt16LE(LIMITS.sections + 1, 48); return b; }, "section count exceeds");
  const excessiveSymbols = (type) => { const size = (LIMITS.records + 1) * 16, b = Buffer.concat([valid, Buffer.alloc(size)]), s = parseElf(valid).sections.find((x) => x.name === ".symtab");
    b.writeUInt32LE(type, s.headerOffset + 4); b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(size, s.headerOffset + 20); return b; };
  expectReject("excessive symbols", () => excessiveSymbols(2), "symbol and relocation count exceeds");
  expectReject("excessive DYNSYM", () => excessiveSymbols(11), "symbol and relocation count exceeds");
  expectReject("excessive relocations", () => { const size = (LIMITS.records + 1) * 8, b = Buffer.concat([valid, Buffer.alloc(size)]), s = parseElf(valid).sections.find((x) => x.name.startsWith(".rel.text."));
    b.writeUInt32LE(valid.length, s.headerOffset + 16); b.writeUInt32LE(size, s.headerOffset + 20); return b; }, "symbol and relocation count exceeds");
  expectReject("bad ELF header", () => { const b = Buffer.from(valid); b.writeUInt16LE(2, 16); return b; });
  expectReject("wrong ELF class", () => { const b = Buffer.from(valid); b[4] = 2; return b; });
  expectReject("wrong ELF OSABI", () => { const b = Buffer.from(valid); b[7] = 3; return b; });
  expectReject("wrong ELF ABI version", () => { const b = Buffer.from(valid); b[8] = 1; return b; });
  expectReject("ARM EABI flags drift", () => { const b = Buffer.from(valid); b.writeUInt32LE(ELF_FLAGS ^ 1, 36); return b; });
  expectReject("program-header injection", () => { const b = Buffer.from(valid); b.writeUInt32LE(52, 28); b.writeUInt16LE(32, 42); b.writeUInt16LE(1, 44); return b; });
  expectReject("noncanonical null section", () => mutate((b, e) => b.writeUInt32LE(1, e.sections[0].headerOffset + 8)));
  expectReject("section-table bounds", () => { const b = Buffer.from(valid); b.writeUInt32LE(b.length - 20, 32); return b; });
  expectReject("instruction register drift", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_001D1EEC"); b[s.offset + 5] ^= 1; }));
  expectReject("dereference displacement drift", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_0044F520"); b[s.offset + 4] ^= 4; }));
  expectReject("call substitution", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_00416324"); b[s.offset + 11] = 0xeb; }));
  expectReject("return substitution", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.func_001D4248"); b.writeUInt32LE(0xe12fff1e, s.offset + 8); }));
  expectReject("pooled literal", () => mutate((b, e) => b.writeUInt32LE(12, e.sections.find((x) => x.name === ".text.func_001D1DC8").headerOffset + 20)));
  expectReject("mapping drift", () => mutate((b, e) => { const s = e.symbols.find((x) => x.name === "$d"); b.writeUInt32LE(8, s.entryOffset + 4); }));
  expectReject("literal identity split", () => mutate((b, e) => { const r = e.relocations.find((x) => x.target === e.sections.find((s) => s.name === ".text.func_001D1EEC").index);
    const wrong = e.symbols.find((x) => x.name === "runtime_indirect_dispatch_slot_101"); b.writeUInt32LE((wrong.tableIndex << 8) | 2, r.entryOffset + 4); }));
  expectReject("identity merge", () => mutate((b, e) => { const r = e.relocations.find((x) => x.offset === 12 && x.symbol.name === "runtime_dispatch_object_root_101"), wrong = e.symbols.find((x) => x.name === "runtime_dispatch_root_97");
    b.writeUInt32LE((wrong.tableIndex << 8) | 2, r.entryOffset + 4); }));
  expectReject("relocation kind", () => mutate((b, e) => { const r = e.relocations.find((x) => x.offset === 8); b.writeUInt32LE((r.symbolIndex << 8) | 28, r.entryOffset + 4); }));
  expectReject("invented alias", () => mutate((b, e) => { const map = e.symbols.find((x) => x.name === "$a"), fn = e.symbols.find((x) => x.name === FUNCTIONS[0].name); b.writeUInt32LE(b.readUInt32LE(fn.entryOffset), map.entryOffset); }));
  expectReject("unnamed local function alias", () => mutate((b, e) => { const nullSymbol = e.symbols.find((x) => x.tableIndex === 0), section = e.sections.find((x) => x.name === `.text.${FUNCTIONS[0].name}`);
    b[nullSymbol.entryOffset + 12] = 2; b.writeUInt16LE(section.index, nullSymbol.entryOffset + 14); }));
  expectReject("reserved symbol visibility bits", () => mutate((b, e) => { const fn = e.symbols.find((x) => x.name === FUNCTIONS[0].name); b[fn.entryOffset + 13] = 0x80; }));
  expectReject("resolved branch Thumb state", () => mutate((b, e) => resolve(b, e, BRANCH_IDENTITIES[0], e.sections.find((x) => x.name === ".text.foreign_0"), 1, 0x12)));
  expectReject("resolved branch wrong type", () => mutate((b, e) => resolve(b, e, BRANCH_IDENTITIES[0], e.sections.find((x) => x.name === ".text.foreign_0"), 0, 0x11)));
  expectReject("resolved data executable", () => mutate((b, e) => resolve(b, e, DATA_IDENTITIES[0], e.sections.find((x) => x.name === ".text.foreign_0"), 0, 0x11)));
  expectReject("resolved identity alias", () => mutate((b, e) => { const s = e.sections.find((x) => x.name === ".text.foreign_0"); resolve(b, e, BRANCH_IDENTITIES[0], s, 0, 0x12); resolve(b, e, BRANCH_IDENTITIES[1], s, 0, 0x12); }));
  expectReject("resolved owned-function alias", () => mutate((b, e) => resolve(b, e, BRANCH_IDENTITIES[0],
    e.sections.find((x) => x.name === `.text.${FUNCTIONS[0].name}`), 0, 0x12)));
  const drift = structuredClone(config); drift.functions[0].operations[1].displacement = 4; expectConfigReject("config drift", drift, source, spec);
  expectConfigReject("source drift", config, Buffer.concat([source, Buffer.from("\n")]), spec);
  expectConfigReject("spec drift", config, source, Buffer.concat([spec, Buffer.from("\n")]));
  return { sections: parsed.sections.length, foreignExecutableSections: 12_001 };
}

async function main() {
  const args = process.argv.slice(2), runSelfTest = args.includes("--self-test"), paths = args.filter((x) => x !== "--self-test");
  check(paths.length <= 1 && (runSelfTest || paths.length === 1), "usage: validate-arm-runtime-helpers-101.mjs [--self-test] [object.o]");
  const [configBytes, spec, source] = await Promise.all([readBounded(CONFIG_PATH, "config"), readBounded(SPEC_PATH, "specification"), readBounded(SOURCE_PATH, "source")]);
  check(sha256(configBytes) === HASHES.config, "config digest drift"); let config; try { config = JSON.parse(configBytes); } catch { fail("invalid JSON config"); }
  validateConfig(config, source, spec); const result = paths.length ? validateElf(await readBounded(path.resolve(paths[0]), "input")) : null;
  const self = runSelfTest ? selfTest(config, source, spec) : null;
  console.log(`arm-runtime-helpers-101: ok${result ? `; sections=${result.sections.length}; symbols=${result.symbols.length}; relocations=${result.relocations.length}; executableBytes=${result.executableBytes}` : ""}${self ? `; selfTestSections=${self.sections}; foreignExecutableSections=${self.foreignExecutableSections}` : ""}`);
}
await main().catch((error) => { console.error(`arm-runtime-helpers-101: ${error.message}`); process.exitCode = 1; });
