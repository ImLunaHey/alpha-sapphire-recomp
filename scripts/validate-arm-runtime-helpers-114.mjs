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
const RAW_CONFIG_HASH = "e4149c2be4719f118a7bfb225676c072e88983a3059130c840ee88a70d8529ac";
const CONTRACT_HASH = "412edb87c7dea11301d1d805ea5959e00c8ed800b83701eab9489337930e5ffc";
const SOURCE_HASH = "d1ceec018f145ddcc75a26ddb351aa3de3baf695050e4943d41e7d5aa8c44009";
const SPEC_HASH = "0a772abd85352c211b408d24fcef250abd5081926b6bae44485fc2e4ba22c7ce";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  {
    "name": "func_0052A400",
    "body": 32,
    "owned": 32,
    "words": [
      3912056944,
      3785379841,
      3785383938,
      3785375744,
      3959422974,
      3852750944,
      3850657800,
      3904733296
    ],
    "maps": [
      {
        "name": "$a",
        "offset": 0
      }
    ]
  },
  {
    "name": "func_0052A5C4",
    "body": 136,
    "owned": 140,
    "words": [
      3818962947,
      3767283875,
      3912040560,
      3822305283,
      167772186,
      3795894274,
      3795976194,
      3852410980,
      3785371939,
      3785375875,
      3795922946,
      3789574146,
      3789295858,
      3788726514,
      3766554630,
      3813738754,
      2711621634,
      2852126721,
      3815835906,
      3516928005,
      3787460786,
      3791393012,
      3790823668,
      3766554630,
      3813738754,
      2711621634,
      2852126721,
      3815835906,
      3516928005,
      3797172225,
      3789557940,
      452984811,
      3904700528,
      3778019102,
      32767
    ],
    "maps": [
      {
        "name": "$a",
        "offset": 0
      },
      {
        "name": "$d",
        "offset": 136
      }
    ]
  },
  {
    "name": "func_0052A6E0",
    "body": 44,
    "owned": 44,
    "words": [
      3912056848,
      3785375744,
      3851419756,
      3813670912,
      167772162,
      3959422974,
      3818913792,
      3850633324,
      3823108096,
      3850633320,
      3904733200
    ],
    "maps": [
      {
        "name": "$a",
        "offset": 0
      }
    ]
  },
  {
    "name": "func_0053FC40",
    "body": 28,
    "owned": 28,
    "words": [
      3912056840,
      3851534336,
      3785371650,
      3785367565,
      3851272192,
      3959422974,
      3904733192
    ],
    "maps": [
      {
        "name": "$a",
        "offset": 0
      }
    ]
  },
  {
    "name": "func_0053FCDC",
    "body": 92,
    "owned": 92,
    "words": [
      3912056944,
      3800064008,
      3851419664,
      3785375750,
      3813670912,
      167772174,
      3851702276,
      3780444164,
      167772167,
      3785363461,
      3851767812,
      3851681800,
      3818921985,
      3959422974,
      3780444164,
      3810586624,
      452984823,
      3818913792,
      3850633224,
      3850649600,
      3850649604,
      3796238344,
      3904733296
    ],
    "maps": [
      {
        "name": "$a",
        "offset": 0
      }
    ]
  },
  {
    "name": "func_0053FD38",
    "body": 72,
    "owned": 72,
    "words": [
      3912056944,
      3785383936,
      3851485192,
      3785379841,
      3818917890,
      3959422974,
      3786424320,
      92667904,
      167772167,
      3801350152,
      469762046,
      3851747328,
      3900964897,
      3850715136,
      3851681792,
      3850387460,
      3850780672,
      3904733296
    ],
    "maps": [
      {
        "name": "$a",
        "offset": 0
      }
    ]
  }
];
const RELOCATIONS = [
  {
    "function": "func_0052A400",
    "offset": 16,
    "type": 28,
    "symbol": "func_0052A420",
    "addend": -8
  },
  {
    "function": "func_0052A6E0",
    "offset": 20,
    "type": 28,
    "symbol": "func_0014307C",
    "addend": -8
  },
  {
    "function": "func_0053FC40",
    "offset": 20,
    "type": 28,
    "symbol": "func_0053FB10",
    "addend": -8
  },
  {
    "function": "func_0053FCDC",
    "offset": 52,
    "type": 28,
    "symbol": "func_002B807C",
    "addend": -8
  },
  {
    "function": "func_0053FD38",
    "offset": 20,
    "type": 28,
    "symbol": "func_002B80B0",
    "addend": -8
  },
  {
    "function": "func_0053FD38",
    "offset": 40,
    "type": 29,
    "symbol": "func_0053FCB8",
    "addend": -8
  }
];
const IDENTITIES = [...new Set(RELOCATIONS.map((r) => r.symbol))];

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
  const end = buffer.subarray(offset, Math.min(buffer.length, offset + 4097)).indexOf(0) + offset;
  check(end >= offset && end - offset <= 4096, `${what} string is unterminated or too long`);
  check(buffer.subarray(offset, end).every((b) => b > 0 && b < 128), `${what} is not ASCII`);
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
  check(shoff >= 52 && shoff % 4 === 0, "invalid section table offset/alignment");
  range(buffer, shoff, shnum * 40, "section table");
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * 40;
    sections.push({ index: i, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4), flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12), offset: buffer.readUInt32LE(p + 16), size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28), align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36) });
  }
  check(Object.values(sections[0]).every((v) => v === 0), "section zero is not canonical");
  check(shstrndx > 0 && shstrndx < shnum && sections[shstrndx].type === 3, "invalid section-name string table");
  const shstrings = range(buffer, sections[shstrndx].offset, sections[shstrndx].size, "section-name string table");
  check(shstrings[0] === 0 && shstrings.at(-1) === 0, "noncanonical section string table");
  const sectionNames = new Map();
  let execSize = 0;
  for (const section of sections) {
    if (!sectionNames.has(section.nameOffset)) sectionNames.set(section.nameOffset, cstring(shstrings, section.nameOffset, `section ${section.index}`));
    section.name = sectionNames.get(section.nameOffset);
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
  const spans = [[0, 52], [shoff, shoff + shnum * 40]];
  for (const s of sections.slice(1)) {
    check(s.type !== 0 && s.align <= 0x40000000 && (s.align === 0 || (s.align & (s.align - 1)) === 0), "invalid section type/alignment");
    check(s.type === 8 || s.align <= 1 || s.offset % s.align === 0, "misaligned section data");
    if (s.type !== 8 && s.size) spans.push([s.offset, s.offset + s.size]);
  }
  spans.sort((a,b) => a[0]-b[0]);
  for (let i = 1; i < spans.length; i++) check(spans[i][0] >= spans[i-1][1], "overlapping ELF sections/header");
  const symtab = symbolTables[0];
  check(symtab.link < shnum && sections[symtab.link].type === 3, "SYMTAB has invalid string-table link");
  const strings = range(buffer, sections[symtab.link].offset, sections[symtab.link].size, "symbol string table");
  check(strings[0] === 0 && strings.at(-1) === 0, "noncanonical symbol string table");
  const symbolNames = new Map([[0, ""]]);
  const symbols = [];
  for (let i = 0; i < symtab.size / 16; i++) {
    const p = symtab.offset + i * 16;
    const nameOffset = buffer.readUInt32LE(p);
    if (!symbolNames.has(nameOffset)) symbolNames.set(nameOffset, cstring(strings, nameOffset, `symbol ${i}`));
    symbols.push({ index: i, nameOffset, name: symbolNames.get(nameOffset), value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), bind: buffer[p + 12] >>> 4, type: buffer[p + 12] & 15, other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14) });
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
    for (const map of fn.maps) check(members.filter((s) => s.name === map.name && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === map.offset && s.size === 0).length === 1, `${fn.name} has invalid mapping symbol ${map.name}`);
    const funcs = members.filter((s) => s.name === fn.name && s.bind === 1 && s.type === 2 && s.other === 0 && s.value === 0 && s.size === fn.body);
    check(funcs.length === 1, `${fn.name} has invalid function symbol metadata`);
    check(members.length === 2 + fn.maps.length, `${fn.name} has an extra named or unnamed symbol`);
  }
  const expectedDataSections = new Set([elf.symtab.index, elf.symtab.link, buffer.readUInt16LE(50), ...elf.relocationSections.map((s) => s.index)]);
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attributes.length === 1 && attributes[0].type === 0x70000003 && attributes[0].flags === 0 && attributes[0].addr === 0 && attributes[0].align === 1 && attributes[0].link === 0 && attributes[0].info === 0 && attributes[0].entsize === 0, "expected one ARM attributes section");
  check(range(buffer, attributes[0].offset, attributes[0].size, "ARM attributes").equals(ARM_ATTRIBUTES), "ARMv6K/Thumb-1/VFPv2 attributes mismatch");
  expectedDataSections.add(attributes[0].index);
  check(elf.symtab.flags === 0 && elf.symtab.align === 4 && elf.symtab.addr === 0, "invalid SYMTAB metadata");
  for (const index of [elf.symtab.link, buffer.readUInt16LE(50)]) {
    const s = elf.sections[index];
    check(s.type === 3 && s.flags === 0 && s.align === 1 && s.addr === 0 && s.link === 0 && s.info === 0 && s.entsize === 0, "invalid string table metadata");
  }
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
  check(namedLocals.length === FUNCTIONS.reduce((n, f) => n + f.maps.length, 0) &&
    namedLocals.every((s) => s.name === "$a" || s.name === "$d"), "local named symbol set is not exact");
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
      relocs.push({ target, offset, type, symbol: elf.symbols[symbolIndex], addend: (buffer.readUInt32LE(target.offset + offset) << 8) >> 6 });
    }
  }
  check(relocs.length === RELOCATIONS.length, "relocation count is not exact");
  const actual = relocs.map((r) => ({ function: r.target.name.slice(6), offset: r.offset, type: r.type, symbol: r.symbol.name, addend: r.addend }));
  check(stable(actual) === stable(RELOCATIONS), "relocation identities, types, offsets, order, or addends differ");
  check(elf.relocationSections.length === new Set(RELOCATIONS.map((r) => r.function)).size, "extra or missing relocation sections");
  for (const rs of elf.relocationSections) {
    const target = elf.sections[rs.info];
    check(ownedIndices.has(target.index) && rs.name === `.rel${target.name}` && rs.flags === 0x40 && rs.align === 4 && rs.addr === 0, "invalid relocation section metadata");
  }
  for (const s of elf.sections) {
    check(!(s.flags & 2) || s.size === 0 || ownedIndices.has(s.index), "foreign nonempty allocated payload");
    if (s.size && !ownedIndices.has(s.index)) check(expectedDataSections.has(s.index), "foreign nonempty payload");
  }
  for (const s of elf.symbols.filter((s) => s.bind === 0 && s.index !== 0 && !ownedIndices.has(s.shndx))) {
    check(s.type === 3 && s.name === "" && s.value === 0 && s.size === 0 && s.other === 0 && s.shndx > 0 && s.shndx < elf.sections.length, "foreign noncanonical local symbol");
  }
  return true;
}

function validatePinnedInputs(repo) {
  const configPath = path.join(repo, "config/arm-runtime-helpers-114.json");
  const sourcePath = path.join(repo, "src/main/arm_runtime_helpers_114.S");
  const specPath = path.join(repo, "docs/specs/main/arm_runtime_helpers_114.md");
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

function expectFailure(label, operation, fragment = "") {
  let caught;
  try { operation(); } catch (error) { caught = error; }
  check(caught && caught.message.includes(fragment), `self-test ${label} did not fail as expected: ${caught?.message ?? "accepted"}`);
}

function makeFixture(foreignCount = 0, extras = []) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0), link: 0, info: 0, entsize: 0 }];
  function append(name, type, flags, align, data, link = 0, info = 0, entsize = 0, size = data?.length ?? 0) {
    sections.push({ name, type, flags, align, data, link, info, entsize, size });
    return sections.length - 1;
  }
  append(".shstrtab", 3, 0, 1, null);
  const owned = new Map();
  for (const fn of FUNCTIONS) {
    const data = Buffer.alloc(fn.owned);
    fn.words.forEach((word, i) => data.writeUInt32LE(word, i * 4));
    owned.set(fn.name, append(`.text.${fn.name}`, 1, 6, 4, data));
  }
  const relocationIndices = [];
  for (const fn of FUNCTIONS) {
    const rs = RELOCATIONS.filter((r) => r.function === fn.name);
    if (rs.length) relocationIndices.push(append(`.rel.text.${fn.name}`, 9, 0x40, 4, Buffer.alloc(rs.length * 8), 0, owned.get(fn.name), 8));
  }
  for (let i = 0; i < foreignCount; i++) append(`.text.foreign.${i}`, 1, 6, 4, Buffer.alloc(0));
  for (const [i, extra] of extras.entries()) append(`.extra.${i}`, extra.type, extra.flags ?? 0, 4, extra.type === 8 ? Buffer.alloc(0) : Buffer.alloc(extra.size), 0, 0, extra.entsize ?? 0, extra.size);
  append(".ARM.attributes", 0x70000003, 0, 1, ARM_ATTRIBUTES);
  const strtabIndex = append(".strtab", 3, 0, 1, null);
  const symtabIndex = append(".symtab", 2, 0, 4, null, strtabIndex, 0, 16);
  const makeStrings = (values) => {
    const offsets = new Map([["", 0]]), chunks = [Buffer.from([0])]; let size = 1;
    for (const value of values) if (!offsets.has(value)) { offsets.set(value, size); const b = Buffer.from(`${value}\0`); chunks.push(b); size += b.length; }
    return { offsets, data: Buffer.concat(chunks) };
  };
  const shs = makeStrings(sections.map((s) => s.name)); sections[1].data = shs.data;
  const sts = makeStrings(["$a", "$d", "$t", ...FUNCTIONS.map((f) => f.name), ...IDENTITIES]); sections[strtabIndex].data = sts.data;
  const symbols = [{ name: "", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: 0 }];
  for (const fn of FUNCTIONS) {
    const shndx = owned.get(fn.name);
    symbols.push({ name: "", value: 0, size: 0, bind: 0, type: 3, other: 0, shndx });
    for (const m of fn.maps) symbols.push({ name: m.name, value: m.offset, size: 0, bind: 0, type: 0, other: 0, shndx });
  }
  const firstGlobal = symbols.length;
  for (const fn of FUNCTIONS) symbols.push({ name: fn.name, value: 0, size: fn.body, bind: 1, type: 2, other: 0, shndx: owned.get(fn.name) });
  for (const name of IDENTITIES) symbols.push({ name, value: 0, size: 0, bind: 1, type: 0, other: 0, shndx: 0 });
  const symdata = Buffer.alloc(symbols.length * 16);
  symbols.forEach((s, i) => { const p = i * 16; symdata.writeUInt32LE(sts.offsets.get(s.name) ?? 0, p); symdata.writeUInt32LE(s.value, p + 4); symdata.writeUInt32LE(s.size, p + 8); symdata[p + 12] = (s.bind << 4) | s.type; symdata[p + 13] = s.other; symdata.writeUInt16LE(s.shndx, p + 14); });
  sections[symtabIndex].data = symdata; sections[symtabIndex].info = firstGlobal;
  for (const index of relocationIndices) {
    const s = sections[index], fn = sections[s.info].name.slice(6);
    s.link = symtabIndex;
    RELOCATIONS.filter((r) => r.function === fn).forEach((r, i) => {
      s.data.writeUInt32LE(r.offset, i * 8);
      s.data.writeUInt32LE((symbols.findIndex((s) => s.name === r.symbol) << 8) | r.type, i * 8 + 4);
    });
  }
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) {
    const s = sections[i]; cursor = Math.ceil(cursor / Math.max(1, s.align)) * Math.max(1, s.align);
    s.offset = cursor;
    if (s.type !== 8) { s.size = s.data.length; cursor += s.size; }
  }
  cursor = Math.ceil(cursor / 4) * 4; const shoff = cursor, output = Buffer.alloc(shoff + sections.length * 40);
  output.set(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]), 0); output.writeUInt16LE(1, 16); output.writeUInt16LE(40, 18); output.writeUInt32LE(1, 20); output.writeUInt32LE(shoff, 32); output.writeUInt32LE(0x05000000, 36); output.writeUInt16LE(52, 40); output.writeUInt16LE(40, 46); output.writeUInt16LE(sections.length, 48); output.writeUInt16LE(1, 50);
  for (let i = 1; i < sections.length; i++) if (sections[i].type !== 8) output.set(sections[i].data, sections[i].offset);
  sections.forEach((s, i) => { const p = shoff + i * 40; output.writeUInt32LE(shs.offsets.get(s.name) ?? 0, p); output.writeUInt32LE(s.type, p + 4); output.writeUInt32LE(s.flags, p + 8); output.writeUInt32LE(s.offset ?? 0, p + 16); output.writeUInt32LE(s.size ?? 0, p + 20); output.writeUInt32LE(s.link, p + 24); output.writeUInt32LE(s.info, p + 28); output.writeUInt32LE(s.align, p + 32); output.writeUInt32LE(s.entsize, p + 36); });
  return output;
}

function selfTest() {
  validateObject(makeFixture());
  validateObject(makeFixture(12_000));
  expectFailure("complete input cap", () => parseElf(Buffer.alloc(MAX_FILE + 1)), "64 MiB");
  expectFailure("section cap", () => parseElf(makeFixture(MAX_SECTIONS)), "16,384");
  expectFailure("executable cap including NOBITS", () => parseElf(makeFixture(0, [{ type: 8, flags: 6, size: MAX_EXEC + 1 }])), "aggregate executable data");
  expectFailure("aggregate SYMTAB and DYNSYM cap", () => parseElf(makeFixture(0, [
    { type: 2, size: 500_001 * 16, entsize: 16 }, { type: 11, size: 500_001 * 16, entsize: 16 },
  ])), "aggregate symbol count");
  expectFailure("aggregate REL and RELA cap", () => parseElf(makeFixture(0, [
    { type: 9, size: 500_001 * 8, entsize: 8 }, { type: 4, size: 500_001 * 12, entsize: 12 },
  ])), "aggregate relocation count");
  const mutate = (label, operation) => {
    const b = makeFixture(1), e = parseElf(b);
    operation(b, e);
    expectFailure(label, () => validateObject(b));
  };
  const sh = (b, s) => b.readUInt32LE(32) + s.index * 40;
  const sym = (e, name) => e.symtab.offset + e.symbols.find((s) => s.name === name).index * 16;
  const owned = (e) => e.sections.find((s) => s.name === `.text.${FUNCTIONS[0].name}`);
  // Every owned byte is independently significant, including the adjacent scalar.
  for (const fn of FUNCTIONS) for (let i = 0; i < fn.owned; i++) mutate(`${fn.name} byte ${i}`, (b, e) => {
    b[e.sections.find((s) => s.name === `.text.${fn.name}`).offset + i] ^= 1;
  });
  for (const [label, field, value] of [["type",4,8],["flags",8,7],["address",12,4],["size",20,36],["link",24,1],["info",28,1],["alignment",32,8],["entry size",36,4]]) mutate(`owned ${label}`, (b,e) => b.writeUInt32LE(value,sh(b,owned(e))+field));
  for (const [label, field, value] of [["Thumb state",4,1],["size",8,4],["binding/type",12,0x22],["visibility",13,1],["section",14,0]]) mutate(`function ${label}`, (b,e) => {
    const p=sym(e,FUNCTIONS[0].name)+field; if(field===12||field===13)b[p]=value;else if(field===14)b.writeUInt16LE(value,p);else b.writeUInt32LE(value,p);
  });
  for (const [label, field, value] of [["value",4,4],["size",8,4],["type",12,0x12],["visibility",13,1],["defined",14,1]]) mutate(`identity ${label}`, (b,e)=>{
    const p=sym(e,IDENTITIES[0])+field;if(field===12||field===13)b[p]=value;else if(field===14)b.writeUInt16LE(value,p);else b.writeUInt32LE(value,p);
  });
  mutate("ARM to Thumb mapping",(b,e)=>{const s=e.symbols.find(s=>s.name==="$a");b.writeUInt32LE(b.indexOf(Buffer.from("$t\0"),e.sections[e.symtab.link].offset)-e.sections[e.symtab.link].offset,e.symtab.offset+s.index*16)});
  mutate("data mapping offset",(b,e)=>b.writeUInt32LE(132,sym(e,"$d")+4));
  mutate("extra global alias",(b,e)=>{const s=e.symbols.find(s=>s.type===3&&s.shndx===owned(e).index);b[e.symtab.offset+s.index*16+12]=0x10});
  mutate("null symbol",(b,e)=>b.writeUInt32LE(1,e.symtab.offset+4));
  mutate("section symbol",(b,e)=>{const s=e.symbols.find(s=>s.type===3&&s.shndx===owned(e).index);b.writeUInt32LE(4,e.symtab.offset+s.index*16+4)});
  mutate("symbol partition",(b,e)=>b.writeUInt32LE(0,sh(b,e.symtab)+28));
  mutate("symbol name outside string table",(b,e)=>b.writeUInt32LE(0xffffffff,sym(e,FUNCTIONS[0].name)));
  mutate("symbol stride",(b,e)=>b.writeUInt32LE(8,sh(b,e.symtab)+36));
  mutate("bad ELF flags",b=>b.writeUInt32LE(0,36));
  mutate("bad ELF class",b=>{b[4]=2});
  mutate("program headers",b=>b.writeUInt32LE(52,28));
  mutate("section zero",b=>b.writeUInt32LE(1,b.readUInt32LE(32)+4));
  mutate("section table range",b=>b.writeUInt32LE(0xfffffff0,32));
  mutate("section-name index",b=>b.writeUInt16LE(0xffff,50));
  mutate("ARM attributes",(b,e)=>{const s=e.sections.find(s=>s.name===".ARM.attributes");b[s.offset+s.size-1]^=1});
  mutate("duplicate owned section",(b,e)=>{const s=e.sections.find(s=>s.name===".text.foreign.0");b.writeUInt32LE(owned(e).nameOffset,sh(b,s))});
  mutate("foreign executable data",(b,e)=>{const s=e.sections.find(s=>s.name===".ARM.attributes");b.writeUInt32LE(4,sh(b,s)+8)});
  mutate("foreign allocated data",(b,e)=>{const s=e.sections.find(s=>s.name===".ARM.attributes");b.writeUInt32LE(2,sh(b,s)+8)});
  mutate("overlapping sections",(b,e)=>{const s=e.sections.find(s=>s.name===".ARM.attributes");b.writeUInt32LE(owned(e).offset,sh(b,s)+16)});
  mutate("relocation symbol substitution",(b,e)=>{const r=e.relocationSections[0];const info=b.readUInt32LE(r.offset+4);b.writeUInt32LE(info+256,r.offset+4)});
  mutate("relocation offset",(b,e)=>b.writeUInt32LE(0,e.relocationSections[0].offset));
  mutate("relocation type",(b,e)=>{const r=e.relocationSections[0];b[r.offset+4]=29});
  mutate("relocation link",(b,e)=>b.writeUInt32LE(0,sh(b,e.relocationSections[0])+24));
  mutate("relocation target",(b,e)=>b.writeUInt32LE(0,sh(b,e.relocationSections[0])+28));
  mutate("relocation stride",(b,e)=>b.writeUInt32LE(4,sh(b,e.relocationSections[0])+36));
  mutate("relocation duplicate",(b,e)=>{const r=e.relocationSections.at(-1);b.copy(b,r.offset+8,r.offset,r.offset+8)});
  mutate("RELA",(b,e)=>b.writeUInt32LE(4,sh(b,e.relocationSections[0])+4));
  mutate("DYNSYM",(b,e)=>b.writeUInt32LE(11,sh(b,e.symtab)+4));
  process.stdout.write("arm-runtime-helpers-114 self-test: ok (408 byte mutations, hostile ELF/relocation cases, five parser caps, 12,000 empty executable sections)\n");
}

function readCapped(filename) {
  const fd = fs.openSync(filename, "r");
  try {
    const stat = fs.fstatSync(fd);
    check(stat.isFile() && stat.size <= MAX_FILE, "complete input exceeds 64 MiB or is not a regular file");
    const bytes = Buffer.alloc(stat.size);
    let offset = 0;
    while (offset < bytes.length) {
      const count = fs.readSync(fd, bytes, offset, bytes.length - offset, offset);
      check(count > 0, "input truncated while reading"); offset += count;
    }
    check(fs.fstatSync(fd).size === stat.size, "input size changed while reading");
    return bytes;
  } finally { fs.closeSync(fd); }
}

function auditPrivate(repo, filename) {
  const raw = readCapped(filename);
  const config = JSON.parse(fs.readFileSync(path.join(repo,"config/arm-runtime-helpers-114.json")));
  const inventory = fs.readFileSync(path.join(repo,"symbols/code.bin.csv"),"utf8").trim().split("\n").slice(1).map((line)=>{
    const c=line.split(",").map(s=>s.replaceAll('"',""));return {address:parseInt(c[0],16),name:c[1],mode:c[3],size:parseInt(c[4],16)};
  });
  check(inventory.length===10440,"inventory size changed; repeat analysis");
  const target = parseElf(readCapped(path.join(repo,"build/AS_EUR_REV2/target/code.o")));
  const report = JSON.parse(fs.readFileSync(path.join(repo,"build/AS_EUR_REV2/report.json")));
  const reportFunctions=report.units.flatMap(u=>u.functions??[]);
  const selected=config.functions.map(f=>({...f,address:parseInt(f.name.slice(5),16)}));
  const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)]);
  for(const file of walk(path.join(repo,"src"))) {
    if(path.resolve(file)===path.join(repo,config.source))continue;
    const source=fs.readFileSync(file,"utf8");
    for(const f of selected)check(!new RegExp(`\\b${f.name}\\s*(?::|\\([^;{}]*\\)\\s*\\{)`).test(source),`conflicting source owner for ${f.name}`);
  }
  for(const file of walk(path.join(repo,"config")).filter(p=>p.endsWith(".json"))) {
    if(file===path.join(repo,"config/arm-runtime-helpers-114.json"))continue;
    const other=JSON.parse(fs.readFileSync(file));
    for(const f of other.functions??[])check(!selected.some(s=>s.name===f.name),`conflicting configuration owner for ${f.name}`);
  }
  const allBodies=target.symbols.filter(s=>s.bind===1&&s.type===2&&s.shndx>0).map(s=>range(target.buffer,target.sections[s.shndx].offset+(s.value&~1),s.size,s.name));
  for(const f of selected) {
    const row=inventory.find(r=>r.name===f.name);
    check(row&&row.address===f.address&&row.size===f.size&&row.mode==="$a"&&f.address>=0x520000&&f.address<0x540000&&f.address%4===0,`inventory/state disagreement for ${f.name}`);
    const reports=reportFunctions.filter(r=>r.name===f.name);
    check(reports.length===1&&Number(reports[0].size)===f.size&&reports[0].fuzzy_match_percent===100,`report does not mark ${f.name} matched`);
    const symbol=target.symbols.find(s=>s.name===f.name);
    check(symbol&&symbol.value===0&&symbol.size===f.size&&symbol.bind===1&&symbol.type===2,`target symbol disagreement for ${f.name}`);
    const section=target.sections[symbol.shndx];
    const body=range(target.buffer,section.offset,f.size,f.name);
    const expected=FUNCTIONS.find(s=>s.name===f.name), unresolved=Buffer.alloc(f.ownedSize);
    expected.words.forEach((w,i)=>unresolved.writeUInt32LE(w,i*4));
    check(body.equals(unresolved.subarray(0,f.size)),`authoritative target/unrelocated schedule disagreement for ${f.name}`);
    check(allBodies.filter(b=>b.equals(body)).length===1,`duplicate target body ${f.name}`);
    const bytes=range(raw,f.address-0x100000,f.ownedSize,f.name);
    const reconstructed=Buffer.from(unresolved);
    for(const r of RELOCATIONS.filter(r=>r.function===f.name)) {
      const dest=inventory.find(t=>t.name===r.symbol);
      check(dest&&dest.mode==="$a"&&dest.address%4===0,`non-ARM or non-primary call target ${r.symbol}`);
      const displacement=dest.address-(f.address+r.offset+8);
      check(displacement%4===0&&displacement>=-0x2000000&&displacement<0x2000000,"call displacement out of range");
      reconstructed.writeUInt32LE(((reconstructed.readUInt32LE(r.offset)&0xff000000)|((displacement>>2)&0xffffff))>>>0,r.offset);
    }
    check(reconstructed.equals(bytes),`resolved assembly does not equal all owned target bytes of ${f.name}`);
    const maps=target.symbols.filter(s=>s.shndx===section.index&&s.name.startsWith("$"))
      .map(({name,value})=>({name,offset:value}));
    check(stable(maps)===stable(expected.maps),`target mapping disagreement for ${f.name}`);
    check(target.symbols.filter(s=>s.shndx===section.index&&s.type===2).length===1,`target alias inside ${f.name}`);
    const next=inventory[inventory.indexOf(row)+1];
    check(next.name===f.nextGlobal&&next.address>=f.address+f.ownedSize,`adjacent ownership overlap for ${f.name}`);
  }
  const inbound=[];
  function record(from,to,state,kind) {
    for(const f of selected)if(to>=f.address&&to<f.address+f.ownedSize&&!(from>=f.address&&from<f.address+f.size)) {
      check(to===f.address&&state==="arm",`interior or state-mismatched inbound target ${f.name}`);
      inbound.push({from:`0x${from.toString(16)}`,to:`0x${to.toString(16)}`,state,kind,owner:f.name,offset:0});
    }
  }
  for(const row of inventory) {
    const b=range(raw,row.address-0x100000,row.size,row.name);
    if(row.mode==="$a")for(let o=0;o+4<=b.length;o+=4) {
      const w=b.readUInt32LE(o),cond=w>>>28;
      if((w&0x0e000000)===0x0a000000)record(row.address+o,row.address+o+8+((w<<8)>>6)+(cond===15?((w>>>23)&2):0),cond===15?"thumb":"arm",(w&0x01000000)||cond===15?"call":"branch");
    }
    else if(row.mode==="$t")for(let o=0;o+2<=b.length;o+=2) {
      const h=b.readUInt16LE(o),pc=row.address+o+4;
      if((h&0xf800)===0xe000)record(row.address+o,pc+((h<<21)>>20),"thumb","branch");
      else if((h&0xf000)===0xd000&&(h&0xf00)<0xe00)record(row.address+o,pc+((h<<24)>>23),"thumb","conditional-branch");
      else if((h&0xf800)===0xf000&&o+4<=b.length) {
        const l=b.readUInt16LE(o+2);
        if((l&0xf800)===0xf800||(l&0xf800)===0xe800) {
          let to=pc+((h<<21)>>9)+((l&0x7ff)<<1);const state=(l&0xf800)===0xe800?"arm":"thumb";
          if(state==="arm")to&=~3;record(row.address+o,to,state,"call");o+=2;
        }
      }
    }
  }
  check(stable(inbound)===stable(config.audits.inboundDirectTransfers),"inbound audit changed");
  for (let offset = 0; offset + 4 <= raw.length; offset += 4) {
    const word = raw.readUInt32LE(offset), address = word & ~1;
    check(!selected.some((f) => address >= f.address && address < f.address + f.ownedSize), "absolute word reference into an owned range; repeat identity/state analysis");
  }
  process.stdout.write("arm-runtime-helpers-114 private audit: ok (6 matched unique ARM bodies, 408 exact owned bytes, 10 primary inbound calls, no interior inbound targets)\n");
}

function main() {
  const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
  validatePinnedInputs(repo);
  const args=process.argv.slice(2);
  if(args.length===1&&args[0]==="--self-test")return selfTest();
  if(args.length===2&&args[0]==="--audit-private")return auditPrivate(repo,args[1]);
  check(args.length===1&&!args[0].startsWith("-"),"usage: validate-arm-runtime-helpers-114.mjs <object-file> | --self-test | --audit-private <private-code.bin>");
  validateObject(readCapped(args[0]));
  process.stdout.write(`arm-runtime-helpers-114 validation: ok (${args[0]})\n`);
}
try { main(); } catch(error) { process.stderr.write(`arm-runtime-helpers-114 validation failed: ${error.message}\n`);process.exitCode=1; }
