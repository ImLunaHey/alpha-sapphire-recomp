#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const RAW_CONFIG_HASH = "efef4c55c585fa7ea956e15ff79c96befd92c21cbeeeeb44975964902e0bdb96";
const CONTRACT_HASH = "14b6b9d7c82f95a80beff8a706620f36094f078f896b42cda79d40adc99b3f91";
const SOURCE_HASH = "bb6b5675ca65b2cedd1865651ed2eccc6d3ec51d6e946647a026fe5cdc621de7";
const SPEC_HASH = "c47083d95b149b425430cf02abf7a0dc2fa230dd5449a17f75d1560c516fb082";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  { name: "func_001CF630", body: 24, owned: 24, words: [0xe3500000, 0x0a000002, 0xe5912004, 0xe5922014, 0xe12fff12, 0xe12fff1e] },
  { name: "func_001CF648", body: 12, owned: 12, words: [0xe592c004, 0xe59cc00c, 0xe12fff1c] },
];
const IDENTITIES = [];

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(data) { return crypto.createHash("sha256").update(data).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function addChecked(a, b, limit, what) {
  check(Number.isSafeInteger(a) && Number.isSafeInteger(b) && a >= 0 && b >= 0 && a <= limit - b, `${what} is out of bounds`);
  return a + b;
}
function range(buffer, offset, size, what) {
  const end = addChecked(offset, size, buffer.length, what);
  return buffer.subarray(offset, end);
}
function cstring(buffer, offset, what) {
  check(Number.isInteger(offset) && offset >= 0 && offset < buffer.length, `${what} string offset is invalid`);
  const end = buffer.indexOf(0, offset);
  check(end >= 0, `${what} string is unterminated`);
  return buffer.toString("utf8", offset, end);
}
function enforceLimits({ fileSize, execSize, sectionCount, symbolCount, relocationCount }) {
  check(fileSize <= MAX_FILE, "complete input exceeds 64 MiB");
  check(execSize <= MAX_EXEC, "aggregate executable data exceeds 16 MiB");
  check(sectionCount <= MAX_SECTIONS, "section count exceeds 16,384");
  check(symbolCount <= MAX_SYMBOLS, "aggregate symbol count exceeds 1,000,000");
  check(relocationCount <= MAX_RELOCS, "aggregate relocation count exceeds 1,000,000");
}

function parseElf(buffer) {
  enforceLimits({ fileSize: buffer.length, execSize: 0, sectionCount: 0, symbolCount: 0, relocationCount: 0 });
  check(buffer.length >= 52, "truncated ELF header");
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "object is not ELF32 little-endian version 1");
  check(buffer[7] === 0 && buffer[8] === 0 && buffer.subarray(9, 16).every((v) => v === 0), "noncanonical ELF identification bytes");
  check(buffer.readUInt16LE(16) === 1, "ELF type is not ET_REL");
  check(buffer.readUInt16LE(18) === 40, "ELF machine is not EM_ARM");
  check(buffer.readUInt32LE(20) === 1, "invalid ELF version");
  check(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0, "relocatable object has program-header or entry-point data");
  check(buffer.readUInt32LE(36) === 0x05000000, "ELF flags are not exactly EABI5 0x05000000");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40, "noncanonical ELF header sizes");
  const shoff = buffer.readUInt32LE(32), shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(shnum > 0 && shnum < 0xffff, "extended or empty section table is unsupported");
  enforceLimits({ fileSize: buffer.length, execSize: 0, sectionCount: shnum, symbolCount: 0, relocationCount: 0 });
  range(buffer, shoff, shnum * 40, "section table");
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * 40;
    sections.push({ index: i, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4), flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12), offset: buffer.readUInt32LE(p + 16), size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28), align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36) });
  }
  check(Object.values(sections[0]).every((v) => v === 0), "section zero is not canonical");
  check(shstrndx > 0 && shstrndx < shnum && sections[shstrndx].type === 3, "invalid section-name string table");
  const shstrings = range(buffer, sections[shstrndx].offset, sections[shstrndx].size, "section-name string table");
  let execSize = 0;
  for (const section of sections) {
    section.name = cstring(shstrings, section.nameOffset, `section ${section.index}`);
    if (section.type !== 8) range(buffer, section.offset, section.size, `section ${section.name}`);
    if (section.flags & 4) execSize = addChecked(execSize, section.size, MAX_EXEC, "aggregate executable data");
  }
  enforceLimits({ fileSize: buffer.length, execSize, sectionCount: shnum, symbolCount: 0, relocationCount: 0 });
  const symbolTables = sections.filter((s) => s.type === 2 || s.type === 11);
  let symbolCount = 0;
  for (const s of symbolTables) {
    check(s.entsize === 16 && s.size % 16 === 0, `invalid symbol table ${s.name}`);
    symbolCount = addChecked(symbolCount, s.size / 16, MAX_SYMBOLS, "aggregate symbol count");
  }
  const relocationSections = sections.filter((s) => s.type === 9 || s.type === 4);
  let relocationCount = 0;
  for (const s of relocationSections) {
    const expected = s.type === 9 ? 8 : 12;
    check(s.entsize === expected && s.size % expected === 0, `invalid relocation table ${s.name}`);
    relocationCount = addChecked(relocationCount, s.size / expected, MAX_RELOCS, "aggregate relocation count");
  }
  enforceLimits({ fileSize: buffer.length, execSize, sectionCount: shnum, symbolCount, relocationCount });
  check(symbolTables.filter((s) => s.type === 2).length === 1 && symbolTables.every((s) => s.type === 2), "expected exactly one SYMTAB and no DYNSYM");
  const symtab = symbolTables[0];
  check(symtab.link < shnum && sections[symtab.link].type === 3, "SYMTAB has invalid string-table link");
  const strings = range(buffer, sections[symtab.link].offset, sections[symtab.link].size, "symbol string table");
  const symbols = [];
  for (let i = 0; i < symtab.size / 16; i++) {
    const p = symtab.offset + i * 16;
    const nameOffset = buffer.readUInt32LE(p);
    symbols.push({ index: i, nameOffset, name: nameOffset === 0 ? "" : cstring(strings, nameOffset, `symbol ${i}`), value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), bind: buffer[p + 12] >>> 4, type: buffer[p + 12] & 15, other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14) });
  }
  check(symtab.info <= symbols.length && symbols.every((s, i) => i < symtab.info ? s.bind === 0 : s.bind !== 0), "SYMTAB local/global partition is invalid");
  check(symbols.length > 0 && Object.values(symbols[0]).every((v) => v === 0 || v === ""), "null symbol is not canonical");
  return { buffer, sections, symtab, symbols, relocationSections };
}

function validateObject(buffer) {
  const elf = parseElf(buffer);
  const sectionByName = new Map(elf.sections.map((s) => [s.name, s]));
  const expectedOwnedNames = FUNCTIONS.map((fn) => `.text.${fn.name}`);
  check(JSON.stringify(elf.sections.filter((s) => (s.flags & 4) !== 0 && s.size !== 0).map((s) => s.name)) ===
    JSON.stringify(expectedOwnedNames), "nonempty executable section set is not exact");
  const ownedIndices = new Set();
  for (const fn of FUNCTIONS) {
    const section = sectionByName.get(`.text.${fn.name}`);
    check(section, `missing owned section .text.${fn.name}`);
    check(elf.sections.filter((s) => s.name === `.text.${fn.name}`).length === 1, `duplicate owned section .text.${fn.name}`);
    check(section.type === 1 && section.flags === 6 && section.align === 4 && section.size === fn.owned && section.addr === 0, `invalid owned section metadata for ${fn.name}`);
    ownedIndices.add(section.index);
    const bytes = range(buffer, section.offset, section.size, fn.name);
    for (let i = 0; i < fn.words.length; i++) check(bytes.readUInt32LE(i * 4) === fn.words[i], `${fn.name} instruction mismatch at offset ${i * 4}`);
    const members = elf.symbols.filter((s) => s.shndx === section.index);
    const sections = members.filter((s) => s.type === 3 && s.bind === 0 && s.name === "" && s.value === 0 && s.size === 0 && s.other === 0);
    check(sections.length === 1, `${fn.name} does not have exactly one canonical section symbol`);
    const mapsA = members.filter((s) => s.name === "$a" && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === 0 && s.size === 0);
    check(mapsA.length === 1, `${fn.name} has invalid ARM mapping symbol`);
    const funcs = members.filter((s) => s.name === fn.name && s.bind === 1 && s.type === 2 && s.other === 0 && s.value === 0 && s.size === fn.body);
    check(funcs.length === 1, `${fn.name} has invalid function symbol metadata`);
    check(members.length === 3, `${fn.name} has an extra named or unnamed symbol`);
  }
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attributes.length === 1 && attributes[0].type === 0x70000003, "expected one ARM attributes section");
  check(range(buffer, attributes[0].offset, attributes[0].size, "ARM attributes").equals(ARM_ATTRIBUTES), "ARMv6K/Thumb-1/VFPv2 attributes mismatch");
  const definedGlobalFunctions = elf.symbols.filter((s) => s.bind === 1 && s.type === 2 && s.shndx !== 0);
  check(definedGlobalFunctions.length === FUNCTIONS.length && FUNCTIONS.every((f) => definedGlobalFunctions.some((s) => s.name === f.name)), "defined function set is not exact");
  for (const identity of IDENTITIES) {
    const matches = elf.symbols.filter((s) => s.name === identity);
    check(matches.length === 1, `identity ${identity} is missing or split`);
    const s = matches[0];
    check(s.bind === 1 && s.type === 0 && s.other === 0 && s.value === 0 && s.size === 0 && s.shndx === 0, `identity ${identity} has invalid undefined-symbol metadata`);
  }
  const globals = elf.symbols.filter((s) => s.bind !== 0);
  const expectedGlobals = new Set([...FUNCTIONS.map((f) => f.name), ...IDENTITIES]);
  check(globals.length === expectedGlobals.size && globals.every((s) => expectedGlobals.has(s.name)), "global symbol set is not exact");
  const namedLocals = elf.symbols.filter((s) => s.bind === 0 && s.name !== "");
  check(namedLocals.length === FUNCTIONS.length &&
    namedLocals.every((s) => s.name === "$a"), "local named symbol set is not exact");
  const relocs = [];
  for (const rs of elf.relocationSections) {
    check(rs.type === 9, `RELA or unsupported relocation section ${rs.name}`);
    check(rs.link === elf.symtab.index && rs.info < elf.sections.length, `invalid relocation links in ${rs.name}`);
    const target = elf.sections[rs.info];
    for (let i = 0; i < rs.size / 8; i++) {
      const p = rs.offset + i * 8, offset = buffer.readUInt32LE(p), info = buffer.readUInt32LE(p + 4);
      const symbolIndex = info >>> 8, type = info & 0xff;
      check(symbolIndex < elf.symbols.length, `relocation symbol index out of range in ${rs.name}`);
      check(offset + 4 <= target.size, `relocation offset out of range in ${rs.name}`);
      relocs.push({ target, offset, type, symbol: elf.symbols[symbolIndex], addend: buffer.readInt32LE(target.offset + offset) });
    }
  }
  check(elf.relocationSections.length === 0 && relocs.length === 0, "relocation section set is not empty");
  return true;
}

function validatePinnedInputs(repo) {
  const configPath = path.join(repo, "config/arm-runtime-helpers-123.json");
  const sourcePath = path.join(repo, "src/main/arm_runtime_helpers_123.S");
  const specPath = path.join(repo, "docs/specs/main/arm_runtime_helpers_123.md");
  const configBytes = fs.readFileSync(configPath);
  const config = JSON.parse(configBytes);
  check(sha256(configBytes) === RAW_CONFIG_HASH, "raw configuration does not equal validator pin");
  check(config.sourceHash === SOURCE_HASH, "configuration sourceHash does not equal validator pin");
  check(sha256(fs.readFileSync(sourcePath)) === SOURCE_HASH, "assembly source hash mismatch");
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  check(sha256(stable(normalized)) === CONTRACT_HASH, "normalized configuration does not equal validator's pinned contract");
  check(sha256(fs.readFileSync(specPath)) === SPEC_HASH, "specification does not equal validator pin");
}

function expectFailure(label, operation, reason) {
  let failed = false;
  try { operation(); } catch (error) {
    failed = true;
    if (reason) check(reason.test(error.message), `self-test ${label} failed for wrong reason: ${error.message}`);
  }
  check(failed, `self-test ${label} did not fail`);
}

function makeFixture(foreignCount = 0, withRelocation = false) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 }];
  sections.push({ name: ".shstrtab", type: 3, flags: 0, align: 1, data: null, link: 0, info: 0, entsize: 0 });
  const owned = new Map();
  for (const fn of FUNCTIONS) {
    const data = Buffer.alloc(fn.owned);
    fn.words.forEach((word, i) => data.writeUInt32LE(word, i * 4));
    owned.set(fn.name, sections.length);
    sections.push({ name: `.text.${fn.name}`, type: 1, flags: 6, align: 4, data, link: 0, info: 0, entsize: 0 });
  }
  const relocationIndex = withRelocation ? sections.length : -1;
  if (withRelocation) sections.push({ name: `.rel.text.${FUNCTIONS[0].name}`, type: 9, flags: 0x40, align: 4, data: Buffer.alloc(8), link: 0, info: owned.get(FUNCTIONS[0].name), entsize: 8 });
  for (let i = 0; i < foreignCount; i++) sections.push({ name: `.text.foreign.${i}`, type: 1, flags: 6, align: 4, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 });
  sections.push({ name: ".ARM.attributes", type: 0x70000003, flags: 0, align: 1, data: ARM_ATTRIBUTES, link: 0, info: 0, entsize: 0 });
  const strtabIndex = sections.length;
  sections.push({ name: ".strtab", type: 3, flags: 0, align: 1, data: null, link: 0, info: 0, entsize: 0 });
  const symtabIndex = sections.length;
  sections.push({ name: ".symtab", type: 2, flags: 0, align: 4, data: null, link: strtabIndex, info: 0, entsize: 16 });
  const makeStrings = (values) => {
    const offsets = new Map([["", 0]]), chunks = [Buffer.from([0])]; let size = 1;
    for (const value of values) if (!offsets.has(value)) { offsets.set(value, size); const b = Buffer.from(`${value}\0`); chunks.push(b); size += b.length; }
    return { offsets, data: Buffer.concat(chunks) };
  };
  const shs = makeStrings(sections.map((s) => s.name)); sections[1].data = shs.data;
  const symbolNames = ["$a", ...FUNCTIONS.map((f) => f.name)];
  const sts = makeStrings(symbolNames); sections[strtabIndex].data = sts.data;
  const symbols = [{ name: "", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: 0 }];
  for (const fn of FUNCTIONS) {
    const shndx = owned.get(fn.name);
    symbols.push({ name: "", value: 0, size: 0, bind: 0, type: 3, other: 0, shndx });
    symbols.push({ name: "$a", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx });
  }
  const firstGlobal = symbols.length;
  for (const fn of FUNCTIONS) symbols.push({ name: fn.name, value: 0, size: fn.body, bind: 1, type: 2, other: 0, shndx: owned.get(fn.name) });
  const symdata = Buffer.alloc(symbols.length * 16);
  symbols.forEach((s, i) => { const p = i * 16; symdata.writeUInt32LE(sts.offsets.get(s.name) ?? 0, p); symdata.writeUInt32LE(s.value, p + 4); symdata.writeUInt32LE(s.size, p + 8); symdata[p + 12] = (s.bind << 4) | s.type; symdata[p + 13] = s.other; symdata.writeUInt16LE(s.shndx, p + 14); });
  sections[symtabIndex].data = symdata; sections[symtabIndex].info = firstGlobal;
  if (withRelocation) sections[relocationIndex].link = symtabIndex;
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) { const s = sections[i]; cursor = (cursor + Math.max(1, s.align) - 1) & -Math.max(1, s.align); s.offset = cursor; s.size = s.data.length; cursor += s.size; }
  cursor = (cursor + 3) & -4; const shoff = cursor, output = Buffer.alloc(shoff + sections.length * 40);
  output.set(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]), 0); output.writeUInt16LE(1, 16); output.writeUInt16LE(40, 18); output.writeUInt32LE(1, 20); output.writeUInt32LE(shoff, 32); output.writeUInt32LE(0x05000000, 36); output.writeUInt16LE(52, 40); output.writeUInt16LE(40, 46); output.writeUInt16LE(sections.length, 48); output.writeUInt16LE(1, 50);
  for (let i = 1; i < sections.length; i++) output.set(sections[i].data, sections[i].offset);
  sections.forEach((s, i) => { const p = shoff + i * 40; output.writeUInt32LE(shs.offsets.get(s.name) ?? 0, p); output.writeUInt32LE(s.type, p + 4); output.writeUInt32LE(s.flags, p + 8); output.writeUInt32LE(s.offset ?? 0, p + 16); output.writeUInt32LE(s.size ?? 0, p + 20); output.writeUInt32LE(s.link, p + 24); output.writeUInt32LE(s.info, p + 28); output.writeUInt32LE(s.align, p + 32); output.writeUInt32LE(s.entsize, p + 36); });
  return output;
}

function selfTest() {
  validateObject(makeFixture(12_000));
  for (const fn of FUNCTIONS) {
    for (let byte = 0; byte < fn.body; byte++) for (let bit = 0; bit < 8; bit++) {
      const object = makeFixture(), parsed = parseElf(object);
      const section = parsed.sections.find((s) => s.name === `.text.${fn.name}`);
      object[section.offset + byte] ^= 1 << bit;
      expectFailure(`${fn.name} byte ${byte} bit ${bit}`, () => validateObject(object));
    }
  }
  expectFailure("actual oversized file", () => parseElf(Buffer.alloc(MAX_FILE + 1)));
  for (const length of [0, 7, 51, 100]) {
    expectFailure(`truncation ${length}`, () => parseElf(makeFixture().subarray(0, length)));
  }
  for (const [name, values] of [
    ["file limit", { fileSize: MAX_FILE + 1, execSize: 0, sectionCount: 0, symbolCount: 0, relocationCount: 0 }],
    ["executable limit", { fileSize: 0, execSize: MAX_EXEC + 1, sectionCount: 0, symbolCount: 0, relocationCount: 0 }],
    ["section limit", { fileSize: 0, execSize: 0, sectionCount: MAX_SECTIONS + 1, symbolCount: 0, relocationCount: 0 }],
    ["symbol limit", { fileSize: 0, execSize: 0, sectionCount: 0, symbolCount: MAX_SYMBOLS + 1, relocationCount: 0 }],
    ["relocation limit", { fileSize: 0, execSize: 0, sectionCount: 0, symbolCount: 0, relocationCount: MAX_RELOCS + 1 }],
  ]) expectFailure(name, () => enforceLimits(values));
  const mutateAndReject = (label, mutate) => {
    const object = makeFixture(), parsed = parseElf(object);
    mutate(object, parsed);
    expectFailure(label, () => validateObject(object));
  };
  mutateAndReject("instruction mutation", (object, parsed) => {
    object[parsed.sections.find((s) => s.name === ".text.func_001CF630").offset] ^= 1;
  });
  expectFailure("forbidden relocation", () => validateObject(makeFixture(0, true)));
  mutateAndReject("mapping symbol offset", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_001CF648");
    const mapping = parsed.symbols.find((s) => s.name === "$a" && s.shndx === owned.index);
    object.writeUInt32LE(4, parsed.symtab.offset + mapping.index * 16 + 4);
  });
  mutateAndReject("function metadata", (object, parsed) => {
    const symbol = parsed.symbols.find((s) => s.name === "func_001CF630");
    object[parsed.symtab.offset + symbol.index * 16 + 13] = 1;
  });
  mutateAndReject("missing section symbol", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_001CF648");
    const section = parsed.symbols.find((s) => s.shndx === owned.index && s.type === 3);
    const mapping = parsed.symbols.find((s) => s.shndx === owned.index && s.name === "$a");
    object.writeUInt32LE(mapping.nameOffset, parsed.symtab.offset + section.index * 16);
  });
  mutateAndReject("extra global", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_001CF648");
    const mapping = parsed.symbols.find((s) => s.shndx === owned.index && s.name === "$a");
    object[parsed.symtab.offset + mapping.index * 16 + 12] = 0x10;
  });
  mutateAndReject("owned section alignment", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".text.func_001CF630");
    object.writeUInt32LE(8, object.readUInt32LE(32) + section.index * 40 + 32);
  });
  mutateAndReject("null symbol", (object, parsed) => {
    object.writeUInt32LE(1, parsed.symtab.offset + 4);
  });
  mutateAndReject("ARM attributes", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".ARM.attributes");
    object[section.offset + section.size - 1] ^= 1;
  });
  mutateAndReject("ELF flags", (object) => object.writeUInt32LE(0, 36));
  mutateAndReject("actual section cap", (object) => object.writeUInt16LE(MAX_SECTIONS + 1, 48));
  mutateAndReject("actual executable cap", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".text.func_001CF630");
    const header = object.readUInt32LE(32) + section.index * 40;
    object.writeUInt32LE(8, header + 4); // NOBITS keeps this test independent of file size.
    object.writeUInt32LE(MAX_EXEC + 1, header + 20);
  });
  // Two tables share a bounded payload so limits must count aggregate entries,
  // including DYNSYM/RELA, before rejecting unsupported table kinds.
  for (const [label, kinds, entrySizes, expected] of [
    ["aggregate SYMTAB plus DYNSYM", [2, 11], [16, 16], /aggregate symbol count/],
    ["aggregate REL plus RELA", [9, 4], [8, 12], /aggregate relocation count/],
  ]) {
    const fixture = makeFixture(), parsed = parseElf(fixture);
    const payloadSize = 600_000 * Math.max(...entrySizes);
    const object = Buffer.concat([fixture, Buffer.alloc(payloadSize)]);
    const tables = [parsed.symtab, parsed.sections.find((s) => s.name === ".ARM.attributes")];
    tables.forEach((section, index) => {
      const p = object.readUInt32LE(32) + section.index * 40;
      object.writeUInt32LE(kinds[index], p + 4);
      object.writeUInt32LE(fixture.length, p + 16);
      object.writeUInt32LE(600_000 * entrySizes[index], p + 20);
      object.writeUInt32LE(entrySizes[index], p + 36);
    });
    expectFailure(label, () => parseElf(object), expected);
  }
  for (const fn of FUNCTIONS) {
    for (const field of ["value", "size", "binding", "type", "visibility", "section"]) {
      mutateAndReject(`${fn.name} function ${field}`, (object, parsed) => {
        const symbol = parsed.symbols.find((s) => s.name === fn.name);
        const p = parsed.symtab.offset + symbol.index * 16;
        if (field === "value") object.writeUInt32LE(4, p + 4);
        if (field === "size") object.writeUInt32LE(fn.body + 4, p + 8);
        if (field === "binding") object[p + 12] = 0x22;
        if (field === "type") object[p + 12] = 0x10;
        if (field === "visibility") object[p + 13] = 2;
        if (field === "section") object.writeUInt16LE(0, p + 14);
      });
    }
    for (const [offset, value] of [[4, 8], [8, 7], [12, 4], [20, fn.owned + 4], [32, 8]]) {
      mutateAndReject(`${fn.name} section field ${offset}`, (object, parsed) => {
        const section = parsed.sections.find((s) => s.name === `.text.${fn.name}`);
        object.writeUInt32LE(value, object.readUInt32LE(32) + section.index * 40 + offset);
      });
    }
  }
  {
    const object = makeFixture(0, true), parsed = parseElf(object);
    const section = parsed.relocationSections[0];
    object.writeUInt32LE(0, object.readUInt32LE(32) + section.index * 40 + 20);
    expectFailure("empty relocation section", () => validateObject(object));
  }
  mutateAndReject("foreign executable payload", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".ARM.attributes");
    const shoff = object.readUInt32LE(32);
    object.writeUInt32LE(section.flags | 4, shoff + section.index * 40 + 8);
  });
  process.stdout.write("arm-runtime-helpers-123 self-test: ok\n");
}

function readBounded(filename) {
  check(fs.statSync(filename).size <= MAX_FILE, "complete input exceeds 64 MiB");
  return fs.readFileSync(filename);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filename) : [filename];
  });
}

function auditOwnership(repo) {
  const intervals = FUNCTIONS.map((fn) => ({ start: parseInt(fn.name.slice(5), 16), size: fn.owned }));
  function inspect(value, filename) {
    if (!value || typeof value !== "object") return;
    if (typeof value.name === "string" && /^func_[0-9A-F]{8}$/.test(value.name)) {
      const start = parseInt(value.name.slice(5), 16);
      const size = value.ownedSize ?? value.size ?? 0;
      if (Number.isSafeInteger(size) && size > 0) for (const owned of intervals) {
        check(start + size <= owned.start || start >= owned.start + owned.size,
          `ownership interval overlap in ${filename}: ${value.name}`);
      }
    }
    for (const child of Object.values(value)) inspect(child, filename);
  }
  for (const filename of walk(path.join(repo, "config")).filter((f) => f.endsWith(".json"))) {
    if (filename === path.join(repo, "config/arm-runtime-helpers-123.json")) continue;
    inspect(JSON.parse(fs.readFileSync(filename, "utf8")), filename);
  }
  for (const filename of walk(path.join(repo, "src"))) {
    if (filename === path.join(repo, "src/main/arm_runtime_helpers_123.S")) continue;
    const source = fs.readFileSync(filename, "utf8");
    for (const fn of FUNCTIONS) {
      check(!new RegExp(`^\\s*${fn.name}\\s*:|^\\s*\\.(?:global|globl|set|equ)\\s+${fn.name}\\b`, "m").test(source),
        `source owner overlap: ${fn.name} in ${filename}`);
    }
  }
}

function validateReference(object, reference, report, repo) {
  const built = parseElf(object), target = parseElf(reference);
  const inventory = fs.readFileSync(path.join(repo, "symbols/code.bin.csv"), "utf8").split(/\r?\n/)
    .map((line) => line.match(/^([0-9A-F]+),"([^"]+)","[^"]*",\$(.),([0-9A-F]+),/)).filter(Boolean);
  const functions = report.units.flatMap((unit) => unit.functions ?? []);
  for (const fn of FUNCTIONS) {
    const entries = inventory.filter((entry) => entry[2] === fn.name);
    check(entries.length === 1, `${fn.name}: inventory entry is not unique`);
    const entry = entries[0], address = parseInt(entry[1], 16);
    check(address >= 0x001c0000 && address < 0x00200000 && address % 4 === 0 && entry[3] === "a" && parseInt(entry[4], 16) === fn.body,
      `${fn.name}: inventory mode/range/boundary mismatch`);
    const next = inventory[inventory.indexOf(entry) + 1];
    check(next && parseInt(next[1], 16) === address + fn.body, `${fn.name}: body does not end at next global`);
    const status = functions.filter((f) => f.name === fn.name);
    check(status.length === 1 && Number(status[0].size) === fn.body && (status[0].fuzzy_match_percent ?? 0) < 100,
      `${fn.name}: report does not show one unmatched body`);
    const targets = target.sections.filter((s) => s.name === `.text.${fn.name}`);
    check(targets.length === 1, `${fn.name}: authoritative section is not unique`);
    const section = targets[0];
    check(section.type === 1 && section.flags === 6 && section.align === 4 && section.size === fn.owned,
      `${fn.name}: authoritative section boundary mismatch`);
    const symbol = target.symbols.filter((s) => s.name === fn.name);
    check(symbol.length === 1 && symbol[0].shndx === section.index && symbol[0].value === 0 && symbol[0].size === fn.body && symbol[0].type === 2,
      `${fn.name}: authoritative function boundary mismatch`);
    const mappings = target.symbols.filter((s) => s.shndx === section.index && /^\$[atd](?:\.|$)/.test(s.name));
    check(mappings.length === 1 && mappings[0].name === "$a" && mappings[0].value === 0,
      `${fn.name}: authoritative ARM mapping mismatch`);
    check(!target.relocationSections.some((s) => s.info === section.index), `${fn.name}: unexpected authoritative relocation section`);
    const assembled = built.sections.find((s) => s.name === section.name);
    const bytes = range(reference, section.offset, fn.owned, fn.name);
    check(bytes.equals(range(object, assembled.offset, assembled.size, fn.name)), `${fn.name}: authoritative byte mismatch`);
    const duplicates = target.symbols.filter((s) => s.type === 2 && s.size === fn.body && s.shndx > 0 && s.shndx < target.sections.length)
      .filter((s) => {
        const owner = target.sections[s.shndx];
        return s.value + s.size <= owner.size && bytes.equals(range(reference, owner.offset + s.value, s.size, s.name));
      });
    check(duplicates.length === 1 && duplicates[0].name === fn.name, `${fn.name}: body is not unique`);
  }
}

function main() {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  validatePinnedInputs(repo);
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  check(args.length >= 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-123.mjs <object-file> [--reference <target-object>] [--report <report>] | --self-test");
  let referencePath = path.join(repo, "build/AS_EUR_REV2/target/code.o");
  let reportPath = path.join(repo, "build/AS_EUR_REV2/report.json");
  const seen = new Set();
  for (let i = 1; i < args.length; i += 2) {
    check(["--reference", "--report"].includes(args[i]) && args[i + 1] && !seen.has(args[i]), "invalid or repeated option");
    seen.add(args[i]);
    if (args[i] === "--reference") referencePath = args[i + 1]; else reportPath = args[i + 1];
  }
  check(fs.realpathSync(args[0]) !== fs.realpathSync(referencePath), "assembled object cannot be its own authoritative reference");
  const object = readBounded(args[0]);
  validateObject(object);
  auditOwnership(repo);
  validateReference(object, readBounded(referencePath), JSON.parse(readBounded(reportPath)), repo);
  process.stdout.write("arm-runtime-helpers-123 authoritative validation: ok (2 functions, 36 body bytes, 0 adjacent bytes, 0 relocations; no ownership overlap)\n");
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-123 validation failed: ${error.message}\n`); process.exitCode = 1; }
