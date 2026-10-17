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
const RAW_CONFIG_HASH = "774455ea40f57986227c5a38cb5e9767b2b4c5e3d0f52a671254065360c178cc";
const CONTRACT_HASH = "bbe95a3b221524032899087a3e824d5c1862a780f51b78f70d7eb1f02d9e122b";
const SOURCE_HASH = "f197f1207b566e2724c74065618f49a32e044e26de76c10c571cb64116417648";
const SPEC_HASH = "e924723a7222df7cd6e1663f2ca37f5d058fa4b6b5a8fdba2b498c87290c3ffa";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  {
    "name": "func_00540704",
    "body": 92,
    "owned": 100,
    "words": [
      3996129888,
      3986631189,
      3990821395,
      4004780738,
      4008835600,
      4004776642,
      1051793985,
      4008835600,
      1051789888,
      3995077153,
      4004776641,
      4008835600,
      2852126727,
      4008970946,
      4008835600,
      1055984224,
      3995077281,
      4004776641,
      4008835600,
      3013607424,
      3120562176,
      3818913793,
      3778019102,
      872415232,
      0
    ]
  },
  {
    "name": "func_00548C14",
    "body": 180,
    "owned": 184,
    "words": [
      3989834246,
      3990821418,
      3851427872,
      4001372704,
      3788648624,
      3999336993,
      4009560800,
      3994032784,
      3780313089,
      2174746626,
      2167406366,
      3844947972,
      3788554430,
      3823120389,
      3767287948,
      3766694020,
      3766693890,
      3788718256,
      3780182020,
      564133891,
      704643087,
      3796643841,
      3992992400,
      3985644039,
      4009233120,
      3995077248,
      3995142656,
      4005300928,
      3994028560,
      3766485120,
      3766616192,
      3788513456,
      3780182018,
      704643076,
      3782222006,
      3780247553,
      2332033020,
      3835510788,
      3778019102,
      3790610614,
      3780247553,
      2600468476,
      3835510788,
      3795845126,
      3778019102,
      1107296256
    ]
  },
  {
    "name": "func_00572B94",
    "body": 164,
    "owned": 168,
    "words": [
      3912040688,
      3851427844,
      3851468800,
      3785379842,
      3780902914,
      167772192,
      3852419204,
      3785371660,
      3780247555,
      2476740608,
      2583691268,
      3762425859,
      3770769812,
      3785384129,
      3762692033,
      3791720449,
      3762446339,
      3800109057,
      3771102868,
      3785388230,
      3762778054,
      3800457217,
      3780509697,
      3657433095,
      3762434060,
      3770901396,
      3785384131,
      3762700227,
      3800248321,
      3800109058,
      3780313089,
      3405774844,
      3762425868,
      3770757524,
      3785371841,
      3762495425,
      3762360577,
      3766620417,
      3850375172,
      3904700656,
      3778019102,
      715827883
    ]
  }
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
  const end = buffer.subarray(offset, Math.min(buffer.length, offset + 4097)).indexOf(0);
  check(end >= 0, `${what} string is unterminated or exceeds 4096 bytes`);
  return buffer.toString("utf8", offset, offset + end);
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
  check(shoff >= 52 && shoff % 4 === 0, "invalid section table location");
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
  const payloads = sections.filter((s) => s.type !== 8 && s.size !== 0)
    .map((s) => ({ start: s.offset, end: s.offset + s.size }));
  payloads.push({ start: 0, end: 52 }, { start: shoff, end: shoff + shnum * 40 });
  payloads.sort((a, b) => a.start - b.start);
  for (let i = 1; i < payloads.length; i++) check(payloads[i].start >= payloads[i - 1].end, "overlapping ELF payloads or headers");
  check(new Set(sections.map((s) => s.name)).size === sections.length, "duplicate section names");
  for (const s of sections.slice(1)) {
    check(s.align === 0 || (s.align & (s.align - 1)) === 0, "invalid section alignment");
    check(s.align <= 1 || s.offset % s.align === 0, "misaligned section payload");
    check(s.addr === 0, "nonzero relocatable section address");
  }
  check(symbolTables.filter((s) => s.type === 2).length === 1 && symbolTables.every((s) => s.type === 2), "expected exactly one SYMTAB and no DYNSYM");
  const symtab = symbolTables[0];
  check(symtab.name === ".symtab" && symtab.flags === 0 && symtab.align === 4, "invalid SYMTAB metadata");
  const stringTables = sections.filter((s) => s.type === 3);
  check(stringTables.length === 2 && stringTables.every((s) => [".strtab", ".shstrtab"].includes(s.name) && s.flags === 0 && s.align === 1 && s.link === 0 && s.info === 0 && s.entsize === 0), "invalid string table set or metadata");
  check(sections.filter((s) => s.type === 0x70000003).length === 1, "unexpected ARM attribute section");
  check(symtab.link < shnum && sections[symtab.link].type === 3, "SYMTAB has invalid string-table link");
  const strings = range(buffer, sections[symtab.link].offset, sections[symtab.link].size, "symbol string table");
  check(strings[0] === 0 && shstrings[0] === 0, "string tables must start with null");
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
    check(section.type === 1 && section.flags === 6 && section.align === 4 && section.size === fn.owned && section.addr === 0 && section.link === 0 && section.info === 0 && section.entsize === 0, `invalid owned section metadata for ${fn.name}`);
    ownedIndices.add(section.index);
    const bytes = range(buffer, section.offset, section.size, fn.name);
    for (let i = 0; i < fn.words.length; i++) check(bytes.readUInt32LE(i * 4) === fn.words[i], `${fn.name} instruction mismatch at offset ${i * 4}`);
    const members = elf.symbols.filter((s) => s.shndx === section.index);
    const sections = members.filter((s) => s.type === 3 && s.bind === 0 && s.name === "" && s.value === 0 && s.size === 0 && s.other === 0);
    check(sections.length === 1, `${fn.name} does not have exactly one canonical section symbol`);
    const mapsA = members.filter((s) => s.name === "$a" && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === 0 && s.size === 0);
    check(mapsA.length === 1, `${fn.name} has invalid ARM mapping symbol`);
    const mapsD = members.filter((s) => s.name === "$d" && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === fn.body && s.size === 0);
    check(mapsD.length === 1, `${fn.name} has invalid data mapping symbol`);
    const funcs = members.filter((s) => s.name === fn.name && s.bind === 1 && s.type === 2 && s.other === 0 && s.value === 0 && s.size === fn.body);
    check(funcs.length === 1, `${fn.name} has invalid function symbol metadata`);
    check(members.length === 4, `${fn.name} has an extra named or unnamed symbol`);
  }
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attributes.length === 1 && attributes[0].type === 0x70000003, "expected one ARM attributes section");
  check(range(buffer, attributes[0].offset, attributes[0].size, "ARM attributes").equals(ARM_ATTRIBUTES), "ARMv6K/Thumb-1/VFPv2 attributes mismatch");
  check(attributes[0].flags === 0 && attributes[0].align === 1 && attributes[0].link === 0 && attributes[0].info === 0 && attributes[0].entsize === 0, "invalid ARM attributes metadata");
  check(elf.relocationSections.length === 0, "REL/RELA sections are forbidden, including empty sections");
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
  check(namedLocals.length === FUNCTIONS.length * 2 &&
    namedLocals.every((s) => s.name === "$a" || s.name === "$d"), "local named symbol set is not exact");
  const symbolsPerSection = new Map();
  for (const s of elf.symbols) symbolsPerSection.set(s.shndx, (symbolsPerSection.get(s.shndx) ?? 0) + 1);
  for (const s of elf.symbols.slice(1).filter((s) => !ownedIndices.has(s.shndx))) {
    check(s.bind === 0 && s.type === 3 && s.nameOffset === 0 && s.name === "" && s.value === 0 && s.size === 0 && s.other === 0 && s.shndx > 0 && s.shndx < elf.sections.length, "foreign symbol is not a canonical section symbol");
    check(symbolsPerSection.get(s.shndx) === 1, "duplicate foreign section symbols");
  }
  for (const s of elf.sections.slice(1).filter((s) => !ownedIndices.has(s.index) && ![2, 3, 0x70000003].includes(s.type))) {
    check([1, 8].includes(s.type) && s.size === 0 && s.link === 0 && s.info === 0 && s.entsize === 0 && (s.flags & ~7) === 0, "foreign section contains unexpected payload or metadata");
  }
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
  check(relocs.length === 0, "relocation count is not zero");
  return true;
}

function validatePinnedInputs(repo) {
  const configPath = path.join(repo, "config/arm-runtime-helpers-115.json");
  const sourcePath = path.join(repo, "src/main/arm_runtime_helpers_115.S");
  const specPath = path.join(repo, "docs/specs/main/arm_runtime_helpers_115.md");
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

function expectFailure(label, operation, expected = null) {
  let failed = false;
  try { operation(); } catch (error) { failed = true; if (expected) check(expected.test(error.message), `self-test ${label} rejected for unexpected reason: ${error.message}`); }
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
  const symbolNames = ["$a", "$d", ...FUNCTIONS.map((f) => f.name)];
  const sts = makeStrings(symbolNames); sections[strtabIndex].data = sts.data;
  const symbols = [{ name: "", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: 0 }];
  for (const fn of FUNCTIONS) {
    const shndx = owned.get(fn.name);
    symbols.push({ name: "", value: 0, size: 0, bind: 0, type: 3, other: 0, shndx });
    symbols.push({ name: "$a", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx });
    symbols.push({ name: "$d", value: fn.body, size: 0, bind: 0, type: 0, other: 0, shndx });
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
  const fixture = makeFixture();
  validateObject(fixture);
  enforceLimits({ fileSize: MAX_FILE, execSize: MAX_EXEC, sectionCount: MAX_SECTIONS, symbolCount: MAX_SYMBOLS, relocationCount: MAX_RELOCS });
  expectFailure("parser file cap", () => parseElf(Buffer.alloc(MAX_FILE + 1)), /complete input/);
  const tooManySections = Buffer.from(fixture);
  tooManySections.writeUInt16LE(MAX_SECTIONS + 1, 48);
  expectFailure("parser section cap", () => parseElf(tooManySections), /section count/);
  const tooMuchExec = Buffer.from(fixture);
  const execHeader = tooMuchExec.readUInt32LE(32) + 2 * 40;
  tooMuchExec.writeUInt32LE(8, execHeader + 4);
  tooMuchExec.writeUInt32LE(MAX_EXEC + 1, execHeader + 20);
  expectFailure("parser executable cap", () => parseElf(tooMuchExec), /aggregate executable/);
  const aggregateFixture = (kind) => {
    const parsed = parseElf(fixture), sections = [parsed.sections.find((s) => s.name === ".ARM.attributes"), parsed.sections.find((s) => s.name === ".strtab")];
    const sizes = kind === "symbols" ? [500_001 * 16, 500_001 * 16] : [500_001 * 8, 500_001 * 12];
    const start = (fixture.length + 3) & ~3;
    const object = Buffer.alloc(start + sizes[0] + sizes[1]); fixture.copy(object);
    let cursor = start;
    sections.forEach((s, i) => {
      const p = object.readUInt32LE(32) + s.index * 40;
      object.writeUInt32LE(kind === "symbols" ? (i === 0 ? 2 : 11) : (i === 0 ? 9 : 4), p + 4);
      object.writeUInt32LE(cursor, p + 16); object.writeUInt32LE(sizes[i], p + 20);
      object.writeUInt32LE(kind === "symbols" ? 16 : (i === 0 ? 8 : 12), p + 36); cursor += sizes[i];
    });
    return object;
  };
  expectFailure("parser aggregate SYMTAB and DYNSYM cap", () => parseElf(aggregateFixture("symbols")), /aggregate symbol/);
  expectFailure("parser aggregate REL and RELA cap", () => parseElf(aggregateFixture("relocations")), /aggregate relocation/);
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
  for (const fn of FUNCTIONS) for (let i = 0; i < fn.owned; i++) {
    mutateAndReject(`${fn.name} byte ${i}`, (object, parsed) => { object[parsed.sections.find((s) => s.name === `.text.${fn.name}`).offset + i] ^= 1; });
  }
  for (const [label, mutate] of [
    ["truncated header", (o) => o.writeUInt32LE(0xfffffff0, 32)],
    ["ELF class", (o) => { o[4] = 2; }],
    ["ELF machine", (o) => o.writeUInt16LE(3, 18)],
    ["ELF type", (o) => o.writeUInt16LE(2, 16)],
    ["ELF identification padding", (o) => { o[15] = 1; }],
    ["ELF program headers", (o) => o.writeUInt32LE(52, 28)],
    ["ELF entry", (o) => o.writeUInt32LE(4, 24)],
    ["section header overlap", (o) => o.writeUInt32LE(0, 32)],
  ]) mutateAndReject(label, mutate);
  for (const [label, field, value] of [["owned type", 4, 8], ["owned flags", 8, 2], ["owned address", 12, 4], ["owned alignment", 32, 2], ["owned info", 28, 1], ["owned link", 24, 1], ["owned entry size", 36, 4], ["owned size", 20, FUNCTIONS[0].owned - 4], ["payload bounds", 16, 0xfffffff0], ["payload header overlap", 16, 0]]) {
    mutateAndReject(label, (object, parsed) => { const s = parsed.sections.find((s) => s.name === `.text.${FUNCTIONS[0].name}`); object.writeUInt32LE(value, object.readUInt32LE(32) + s.index * 40 + field); });
  }
  for (const [label, field, value, width] of [["Thumb function value", 4, 1, 4], ["function size includes pool", 8, FUNCTIONS[0].owned, 4], ["weak function", 12, 0x22, 1], ["function type", 12, 0x11, 1], ["function visibility", 13, 2, 1], ["undefined function", 14, 0, 2]]) {
    mutateAndReject(label, (object, parsed) => { const s = parsed.symbols.find((s) => s.name === FUNCTIONS[0].name), p = parsed.symtab.offset + s.index * 16 + field; if (width === 4) object.writeUInt32LE(value, p); else if (width === 2) object.writeUInt16LE(value, p); else object[p] = value; });
  }
  mutateAndReject("data mapping offset", (object, parsed) => { const s = parsed.symbols.find((s) => s.name === "$d"); object.writeUInt32LE(0, parsed.symtab.offset + s.index * 16 + 4); });
  mutateAndReject("Thumb mapping", (object, parsed) => { const s = parsed.symbols.find((s) => s.name === "$a"), strings = parsed.sections[parsed.symtab.link]; object[strings.offset + s.nameOffset + 1] = 0x74; });
  mutateAndReject("symbol partition", (object, parsed) => object.writeUInt32LE(1, object.readUInt32LE(32) + parsed.symtab.index * 40 + 28));
  mutateAndReject("symbol table entry size", (object, parsed) => object.writeUInt32LE(8, object.readUInt32LE(32) + parsed.symtab.index * 40 + 36));
  mutateAndReject("duplicate section name", (object, parsed) => object.writeUInt32LE(parsed.sections[2].nameOffset, object.readUInt32LE(32) + 3 * 40));
  mutateAndReject("dynamic symbols", (object, parsed) => object.writeUInt32LE(11, object.readUInt32LE(32) + parsed.symtab.index * 40 + 4));
  const emptyRel = makeFixture(0, true), relParsed = parseElf(emptyRel);
  emptyRel.writeUInt32LE(0, emptyRel.readUInt32LE(32) + relParsed.relocationSections[0].index * 40 + 20);
  expectFailure("empty relocation section", () => validateObject(emptyRel));
  const rela = makeFixture(0, true), relaParsed = parseElf(rela), relaHeader = rela.readUInt32LE(32) + relaParsed.relocationSections[0].index * 40;
  rela.writeUInt32LE(4, relaHeader + 4); rela.writeUInt32LE(12, relaHeader + 36); rela.writeUInt32LE(0, relaHeader + 20);
  expectFailure("empty RELA section", () => validateObject(rela));
  for (const n of [0, 7, 51, fixture.length - 1]) expectFailure(`truncation ${n}`, () => validateObject(fixture.subarray(0, n)));
  mutateAndReject("instruction mutation", (object, parsed) => {
    object[parsed.sections.find((s) => s.name === ".text.func_00540704").offset] ^= 1;
  });
  expectFailure("forbidden relocation", () => validateObject(makeFixture(0, true)));
  mutateAndReject("mapping symbol offset", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_00548C14");
    const mapping = parsed.symbols.find((s) => s.name === "$a" && s.shndx === owned.index);
    object.writeUInt32LE(4, parsed.symtab.offset + mapping.index * 16 + 4);
  });
  mutateAndReject("function metadata", (object, parsed) => {
    const symbol = parsed.symbols.find((s) => s.name === "func_00572B94");
    object[parsed.symtab.offset + symbol.index * 16 + 13] = 1;
  });
  mutateAndReject("missing section symbol", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_00572B94");
    const section = parsed.symbols.find((s) => s.shndx === owned.index && s.type === 3);
    const mapping = parsed.symbols.find((s) => s.shndx === owned.index && s.name === "$a");
    object.writeUInt32LE(mapping.nameOffset, parsed.symtab.offset + section.index * 16);
  });
  mutateAndReject("extra global", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_00548C14");
    const mapping = parsed.symbols.find((s) => s.shndx === owned.index && s.name === "$a");
    object[parsed.symtab.offset + mapping.index * 16 + 12] = 0x10;
  });
  mutateAndReject("owned section alignment", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".text.func_00540704");
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
  mutateAndReject("foreign executable payload", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".ARM.attributes");
    const shoff = object.readUInt32LE(32);
    object.writeUInt32LE(section.flags | 4, shoff + section.index * 40 + 8);
  });
  process.stdout.write("arm-runtime-helpers-115 self-test: ok\n");
}

function main() {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  validatePinnedInputs(repo);
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-115.mjs <object-file> | --self-test");
  const fd = fs.openSync(args[0], "r");
  try {
    const stat = fs.fstatSync(fd);
    check(stat.isFile() && stat.size <= MAX_FILE, "complete input is not a regular file within 64 MiB");
    const buffer = Buffer.alloc(stat.size);
    let offset = 0;
    while (offset < buffer.length) { const read = fs.readSync(fd, buffer, offset, buffer.length - offset, offset); check(read > 0, "input shortened during read"); offset += read; }
    check(fs.readSync(fd, Buffer.alloc(1), 0, 1, offset) === 0, "input grew during read");
    validateObject(buffer);
  } finally { fs.closeSync(fd); }
  process.stdout.write(`arm-runtime-helpers-115 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-115 validation failed: ${error.message}\n`); process.exitCode = 1; }
