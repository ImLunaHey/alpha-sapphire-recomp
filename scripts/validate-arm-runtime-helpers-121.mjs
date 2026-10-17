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
const RAW_CONFIG_HASH = "d02891914d515cad4e4eae0b83fa51699040ec53aa6a1d23174c8f6078b0fe15";
const CONTRACT_HASH = "1ec7d7ea5eddecbf29836580953115a359477575e94c759c03188ad4660a9a0d";
const SOURCE_HASH = "d78544e306bf7d5c86db91227ec26bfecc3a86f8eb3a35254cc9424e57237973";
const SPEC_HASH = "214b5cc3416cd6247524e2479709d21b95e05c1d016b04f3a3cdf6e4fd0ac03b";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  {
    "name": "func_0014849C",
    "body": 60,
    "owned": 64,
    "words": [
      3975223809,
      3986631180,
      3800047620,
      3968928258,
      3995146913,
      3992984064,
      3992984224,
      4008782529,
      4001503778,
      3999341185,
      3999271553,
      3995077121,
      3988789760,
      3967945218,
      3778019102
    ],
    "literals": [
      {
        "offset": 60,
        "symbol": "runtime_float_unit_38"
      }
    ]
  },
  {
    "name": "func_0014C76C",
    "body": 92,
    "owned": 96,
    "words": [
      3990817301,
      3985709568,
      3989969408,
      4000320192,
      3995146784,
      3993049728,
      3984595456,
      3985709569,
      3989969409,
      3995146784,
      3993049728,
      3984595457,
      3985709570,
      3989969410,
      3995146784,
      3993049728,
      3984595458,
      3989903875,
      3985775107,
      3999337120,
      3997239808,
      3988785667,
      3778019102
    ],
    "literals": [
      {
        "offset": 92,
        "symbol": "runtime_float_unit_38"
      }
    ]
  },
  {
    "name": "func_0015290C",
    "body": 52,
    "owned": 60,
    "words": [
      3986627083,
      3989903878,
      3986622986,
      3989899783,
      3999345281,
      3800047624,
      3995085440,
      3999271553,
      3995142784,
      3988793856,
      3984599553,
      3967945218,
      3778019102
    ],
    "literals": [
      {
        "offset": 52,
        "symbol": "runtime_literal_121_1"
      },
      {
        "offset": 56,
        "symbol": "runtime_literal_121_2"
      }
    ]
  },
  {
    "name": "func_00164798",
    "body": 116,
    "owned": 128,
    "words": [
      3912040496,
      3851468800,
      3851427848,
      3851431940,
      3851423756,
      3821846786,
      3760406530,
      3761029124,
      3760263329,
      3761029260,
      3760263180,
      3809542145,
      3761030401,
      167772163,
      3852423220,
      3852419124,
      3760332805,
      3761029124,
      3850383360,
      3850375180,
      3800039428,
      3766699052,
      3900706820,
      3809738753,
      3760259076,
      362745872,
      3904700464,
      270532609,
      3778019102
    ],
    "literals": [
      {
        "offset": 116,
        "symbol": "runtime_literal_121_3"
      },
      {
        "offset": 120,
        "symbol": "runtime_literal_121_4"
      },
      {
        "offset": 124,
        "symbol": "runtime_literal_121_5"
      }
    ]
  },
  {
    "name": "func_00174B9C",
    "body": 132,
    "owned": 140,
    "words": [
      3800043524,
      3818921984,
      3850375172,
      3850379264,
      3850375176,
      3800051728,
      3787464956,
      3800043544,
      3850383380,
      3800051740,
      3787530480,
      3800043556,
      3850383392,
      3800051752,
      3787530480,
      3850383404,
      3823120642,
      3850379320,
      3818962945,
      3990817293,
      3850383412,
      3986622986,
      3850420272,
      3988785679,
      3823112192,
      3984591376,
      3850375236,
      3984591378,
      3984591379,
      3854573656,
      3984591380,
      3984591381,
      3778019102
    ],
    "literals": [
      {
        "offset": 132,
        "symbol": "runtime_float_zero_38"
      },
      {
        "offset": 136,
        "symbol": "runtime_float_unit_38"
      }
    ]
  },
  {
    "name": "func_001753F0",
    "body": 32,
    "owned": 44,
    "words": [
      3852406808,
      3852415000,
      3852410904,
      3851485184,
      3760333712,
      3850444800,
      3785361442,
      3778019102
    ],
    "literals": [
      {
        "offset": 32,
        "symbol": "runtime_literal_121_6"
      },
      {
        "offset": 36,
        "symbol": "runtime_literal_121_7"
      },
      {
        "offset": 40,
        "symbol": "runtime_literal_121_8"
      }
    ]
  },
  {
    "name": "func_0017851C",
    "body": 80,
    "owned": 84,
    "words": [
      3852406856,
      3823116312,
      3770757265,
      3785372609,
      3762503617,
      3758228115,
      3767542274,
      167772169,
      3785372353,
      3823116312,
      3762495425,
      3758162577,
      3767537921,
      167772161,
      3809476611,
      167772161,
      3818913792,
      3778019102,
      3818913793,
      3778019102
    ],
    "literals": [
      {
        "offset": 80,
        "symbol": "runtime_literal_121_9"
      }
    ]
  },
  {
    "name": "func_001797F4",
    "body": 108,
    "owned": 112,
    "words": [
      3818926080,
      3850383364,
      3818962945,
      3850420228,
      3852451924,
      3854577672,
      3850383372,
      3850420224,
      3850383376,
      3850383388,
      3854569504,
      3855749120,
      3785367555,
      3785408515,
      3854569505,
      3800043568,
      3900772356,
      3818917889,
      3854577698,
      3850383396,
      3850383400,
      3850383384,
      3854577721,
      3854577722,
      3854577684,
      3854569528,
      3778019102
    ],
    "literals": [
      {
        "offset": 108,
        "symbol": "runtime_literal_121_10"
      }
    ]
  }
];
const IDENTITIES = [...new Set(FUNCTIONS.flatMap(f => f.literals.map(l => l.symbol)))];

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
  check(shoff >= 52 && shoff % 4 === 0, "invalid section table alignment or offset");
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
  check(symtab.flags === 0 && symtab.addr === 0 && symtab.align === 4 && symtab.offset % 4 === 0, "invalid SYMTAB metadata");
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
  for (const fn of FUNCTIONS) {
    const section = sectionByName.get(`.text.${fn.name}`);
    check(section, `missing owned section .text.${fn.name}`);
    check(elf.sections.filter((s) => s.name === `.text.${fn.name}`).length === 1, `duplicate owned section .text.${fn.name}`);
    check(section.type === 1 && section.flags === 6 && section.align === 4 && section.size === fn.owned && section.addr === 0 && section.link === 0 && section.info === 0 && section.entsize === 0 && section.offset % 4 === 0, `invalid owned section metadata for ${fn.name}`);
    const bytes = range(buffer, section.offset, section.size, fn.name);
    for (let i = 0; i < fn.words.length; i++) check(bytes.readUInt32LE(i * 4) === fn.words[i], `${fn.name} instruction mismatch at offset ${i * 4}`);
    const members = elf.symbols.filter((s) => s.shndx === section.index);
    const sections = members.filter((s) => s.type === 3 && s.bind === 0 && s.name === "" && s.value === 0 && s.size === 0 && s.other === 0);
    check(sections.length === 1, `${fn.name} does not have exactly one canonical section symbol`);
    const mapsA = members.filter((s) => s.name === "$a" && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === 0 && s.size === 0);
    check(mapsA.length === 1, `${fn.name} has invalid ARM mapping symbol`);
    const funcs = members.filter((s) => s.name === fn.name && s.bind === 1 && s.type === 2 && s.other === 0 && s.value === 0 && s.size === fn.body);
    check(funcs.length === 1, `${fn.name} has invalid function symbol metadata`);
    const mapsD = members.filter(s => s.name === "$d" && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === fn.body && s.size === 0);
    check(mapsD.length === 1, fn.name + " has invalid data mapping symbol");
    for (const literal of fn.literals) check(bytes.readUInt32LE(literal.offset) === 0, fn.name + " literal addend mismatch at " + literal.offset);
    check(members.length === 4, `${fn.name} has an extra named or unnamed symbol`);
  }
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attributes.length === 1 && attributes[0].type === 0x70000003, "expected one ARM attributes section");
  check(attributes[0].flags === 0 && attributes[0].addr === 0 && attributes[0].align === 1 && attributes[0].link === 0 && attributes[0].info === 0 && attributes[0].entsize === 0, "invalid ARM attributes metadata");
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
  check(namedLocals.length === FUNCTIONS.length * 2 &&
    namedLocals.every((s) => s.name === "$a" || s.name === "$d"), "local named symbol set is not exact");
  check(elf.relocationSections.length === FUNCTIONS.length, "relocation section set is not exact");
  for (const fn of FUNCTIONS) {
    const section = sectionByName.get('.text.' + fn.name);
    const matches = elf.relocationSections.filter(s => s.name === '.rel.text.' + fn.name);
    check(matches.length === 1, fn.name + " needs exactly one REL section");
    const rs = matches[0];
    check(rs.type === 9 && rs.flags === 0x40 && rs.align === 4 && rs.entsize === 8 && rs.addr === 0 && rs.offset % 4 === 0 && rs.link === elf.symtab.index && rs.info === section.index && rs.size === fn.literals.length * 8, fn.name + " relocation metadata mismatch");
    const seen = new Set();
    for (let i = 0; i < rs.size; i += 8) {
      const offset = buffer.readUInt32LE(rs.offset + i), info = buffer.readUInt32LE(rs.offset + i + 4), index = info >>> 8;
      check(index < elf.symbols.length && (info & 255) === 2, fn.name + " invalid ABS32 relocation");
      const expected = fn.literals.find(l => l.offset === offset);
      check(expected && !seen.has(offset) && elf.symbols[index].name === expected.symbol, fn.name + " relocation identity/slot mismatch");
      check(buffer.readUInt32LE(section.offset + offset) === 0, fn.name + " relocation addend mismatch");
      seen.add(offset);
    }
  }
  return true;
}

function validatePinnedInputs(repo) {
  const configPath = path.join(repo, "config/arm-runtime-helpers-121.json");
  const sourcePath = path.join(repo, "src/main/arm_runtime_helpers_121.S");
  const specPath = path.join(repo, "docs/specs/main/arm_runtime_helpers_121.md");
  const configBytes = fs.readFileSync(configPath);
  const config = JSON.parse(configBytes);
  check(sha256(configBytes) === RAW_CONFIG_HASH, "raw configuration does not equal validator pin");
  check(config.sourceHash === SOURCE_HASH, "configuration sourceHash does not equal validator pin");
  check(sha256(fs.readFileSync(sourcePath)) === SOURCE_HASH, "assembly source hash mismatch");
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  check(sha256(stable(normalized)) === CONTRACT_HASH, "normalized configuration does not equal validator's pinned contract");
  check(sha256(fs.readFileSync(specPath)) === SPEC_HASH, "specification does not equal validator pin");
  validateOwnership(repo, config);
}

function hasDefinition(text, name) {
  const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return new RegExp("(?:^|\\n)\\s*(?:" + name + "\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+" + name + "\\s*,)|\\b" + name + "\\s*\\([^;]*\\)\\s*\\{").test(withoutComments);
}

function validateOwnership(repo, config) {
  for (const relative of fs.readdirSync(path.join(repo, "src"), { recursive: true })) {
    const filename = "src/" + relative;
    if (filename === config.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue;
    const text = fs.readFileSync(path.join(repo, filename), "utf8");
    for (const fn of FUNCTIONS) check(!hasDefinition(text, fn.name), `duplicate source owner for ${fn.name} in ${filename}`);
  }
  for (const relative of fs.readdirSync(path.join(repo, "config"), { recursive: true })) {
    if (relative === "arm-runtime-helpers-121.json" || !relative.endsWith(".json")) continue;
    const other = JSON.parse(fs.readFileSync(path.join(repo, "config", relative), "utf8"));
    for (const entry of Array.isArray(other.functions) ? other.functions : []) {
      const match = /^func_([0-9A-F]{8})$/.exec(entry.name ?? "");
      if (!match) continue;
      const start = Number.parseInt(match[1], 16), size = entry.ownedSize ?? entry.sectionSize ?? Math.max(entry.size ?? entry.functionSize ?? 1, ...(entry.adjacentWords ?? []).map(w => w.offset + 4));
      check(Number.isSafeInteger(size) && size > 0, `invalid ownership size in ${relative}`);
      for (const fn of FUNCTIONS) {
        const own = Number.parseInt(fn.name.slice(5), 16);
        check(start >= own + fn.owned || start + size <= own, `overlapping config owner for ${fn.name} in ${relative}`);
      }
    }
  }
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
  const relocationIndices = [];
  for (const fn of FUNCTIONS) { relocationIndices.push(sections.length); sections.push({ name: '.rel.text.' + fn.name, type: 9, flags: 0x40, align: 4, data: Buffer.alloc(fn.literals.length * 8), link: 0, info: owned.get(fn.name), entsize: 8 }); }
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
  const symbolNames = ["$a", "$d", ...FUNCTIONS.map((f) => f.name), ...IDENTITIES];
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
  for (const name of IDENTITIES) symbols.push({ name, value: 0, size: 0, bind: 1, type: 0, other: 0, shndx: 0 });
  const symdata = Buffer.alloc(symbols.length * 16);
  symbols.forEach((s, i) => { const p = i * 16; symdata.writeUInt32LE(sts.offsets.get(s.name) ?? 0, p); symdata.writeUInt32LE(s.value, p + 4); symdata.writeUInt32LE(s.size, p + 8); symdata[p + 12] = (s.bind << 4) | s.type; symdata[p + 13] = s.other; symdata.writeUInt16LE(s.shndx, p + 14); });
  sections[symtabIndex].data = symdata; sections[symtabIndex].info = firstGlobal;
  if (withRelocation) sections[relocationIndex].link = symtabIndex;
  FUNCTIONS.forEach((fn, i) => { const rs = sections[relocationIndices[i]]; rs.link = symtabIndex; fn.literals.forEach((l, j) => { rs.data.writeUInt32LE(l.offset, j * 8); rs.data.writeUInt32LE((symbols.findIndex(s => s.name === l.symbol) << 8) | 2, j * 8 + 4); }); });
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) { const s = sections[i]; cursor = (cursor + Math.max(1, s.align) - 1) & -Math.max(1, s.align); s.offset = cursor; s.size = s.data.length; cursor += s.size; }
  cursor = (cursor + 3) & -4; const shoff = cursor, output = Buffer.alloc(shoff + sections.length * 40);
  output.set(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]), 0); output.writeUInt16LE(1, 16); output.writeUInt16LE(40, 18); output.writeUInt32LE(1, 20); output.writeUInt32LE(shoff, 32); output.writeUInt32LE(0x05000000, 36); output.writeUInt16LE(52, 40); output.writeUInt16LE(40, 46); output.writeUInt16LE(sections.length, 48); output.writeUInt16LE(1, 50);
  for (let i = 1; i < sections.length; i++) output.set(sections[i].data, sections[i].offset);
  sections.forEach((s, i) => { const p = shoff + i * 40; output.writeUInt32LE(shs.offsets.get(s.name) ?? 0, p); output.writeUInt32LE(s.type, p + 4); output.writeUInt32LE(s.flags, p + 8); output.writeUInt32LE(s.offset ?? 0, p + 16); output.writeUInt32LE(s.size ?? 0, p + 20); output.writeUInt32LE(s.link, p + 24); output.writeUInt32LE(s.info, p + 28); output.writeUInt32LE(s.align, p + 32); output.writeUInt32LE(s.entsize, p + 36); });
  return output;
}

function selfTest() {
  for (const definition of ["func_0014849C:", ".set func_0014849C, other", ".equ func_0014849C, other", ".equiv func_0014849C, other", ".thumb_set func_0014849C, other", "int func_0014849C(void) { return 0; }"]) {
    check(hasDefinition(definition, FUNCTIONS[0].name), "ownership definition detector missed " + definition);
  }
  check(!hasDefinition("extern int func_0014849C(void);\n/* func_0014849C: */", FUNCTIONS[0].name), "ownership detector rejected declaration/comment");
  let rejected = 0;
  const reject = (label, object, pattern) => {
    let error;
    try { validateObject(object); } catch (caught) { error = caught; }
    check(error && (!pattern || pattern.test(error.message)), `self-test ${label} failed: ${error?.message ?? 'accepted'}`);
    rejected++;
  };
  validateObject(makeFixture());
  validateObject(makeFixture(12_000));
  const mutate = (label, change, pattern) => { const object = makeFixture(), elf = parseElf(object); change(object, elf); reject(label, object, pattern); };
  const header = (b, s) => b.readUInt32LE(32) + s.index * 40;
  const sym = (e, s) => e.symtab.offset + s.index * 16;
  for (const fn of FUNCTIONS) {
    for (let offset = 0; offset < fn.owned; offset += 4) mutate(`${fn.name} word ${offset}`, (b,e) => { b[e.sections.find(s=>s.name==='.text.'+fn.name).offset+offset] ^= 1; });
    for (const [field, value] of [[4,8],[8,7],[12,4],[20,fn.owned+4],[24,1],[28,1],[32,8],[36,4]]) mutate('owned metadata '+field, (b,e)=>b.writeUInt32LE(value,header(b,e.sections.find(s=>s.name==='.text.'+fn.name))+field));
    for (const name of [fn.name,'$a','$d','']) {
      for (const [field, width, value] of [[4,4,1],[8,4,1],[12,1,0x11],[13,1,1],[14,2,0]]) mutate('owned symbol '+name+' field '+field,(b,e)=>{
        const sec=e.sections.find(s=>s.name==='.text.'+fn.name),s=e.symbols.find(s=>s.shndx===sec.index&&s.name===name),p=sym(e,s)+field;
        if(width===1)b[p]=value;else if(width===2)b.writeUInt16LE(value,p);else b.writeUInt32LE(value,p);
      });
    }
    for (const [field,value] of [[4,4],[8,0],[12,4],[20,0],[24,0],[28,0],[32,8],[36,12]]) mutate('REL metadata '+field,(b,e)=>b.writeUInt32LE(value,header(b,e.sections.find(s=>s.name==='.rel.text.'+fn.name))+field));
    for(let i=0;i<fn.literals.length;i++)for(const [field,value] of [[0,0],[4,0],[4,0xffffff02],[4,3]])mutate('relocation record',(b,e)=>{const rs=e.sections.find(s=>s.name==='.rel.text.'+fn.name);b.writeUInt32LE(value,rs.offset+i*8+field)});
  }
  for(const name of IDENTITIES)for(const [field,width,value] of [[4,4,4],[8,4,4],[12,1,0x12],[13,1,1],[14,2,1]])mutate('identity '+field,(b,e)=>{const p=sym(e,e.symbols.find(s=>s.name===name))+field;if(width===1)b[p]=value;else if(width===2)b.writeUInt16LE(value,p);else b.writeUInt32LE(value,p)});
  // Each slot must retain its identity, even when all symbol names remain valid.
  mutate('wrong valid identity',(b,e)=>{const rs=e.relocationSections[0],index=e.symbols.find(s=>s.name===IDENTITIES[1]).index;b.writeUInt32LE((index<<8)|2,rs.offset+4)});
  mutate('duplicate slot',(b,e)=>{const rs=e.relocationSections.find(s=>s.size>8);b.writeUInt32LE(b.readUInt32LE(rs.offset),rs.offset+8)});
  mutate('split identity',(b,e)=>{const a=e.symbols.find(s=>s.name===IDENTITIES[0]),c=e.symbols.find(s=>s.name===IDENTITIES[1]);b.writeUInt32LE(a.nameOffset,sym(e,c))});
  mutate('duplicate function name',(b,e)=>{const a=e.symbols.find(s=>s.name===FUNCTIONS[0].name),c=e.symbols.find(s=>s.name===FUNCTIONS[1].name);b.writeUInt32LE(a.nameOffset,sym(e,c))});
  mutate('duplicate owned section',(b,e)=>{const a=e.sections.find(s=>s.name==='.text.'+FUNCTIONS[0].name),c=e.sections.find(s=>s.name==='.text.'+FUNCTIONS[1].name);b.writeUInt32LE(a.nameOffset,header(b,c))});
  mutate('Thumb mapping',(b,e)=>{const s=e.symbols.find(s=>s.name==='$a'),strings=e.sections[e.symtab.link];b[strings.offset+s.nameOffset+1]=0x74});
  mutate('early data mapping',(b,e)=>{const s=e.symbols.find(s=>s.name==='$d');b.writeUInt32LE(0,sym(e,s)+4)});
  mutate('missing section symbol',(b,e)=>{const s=e.symbols.find(s=>s.type===3);b[sym(e,s)+12]=0});
  mutate('symbol-name bounds',(b,e)=>b.writeUInt32LE(0xffffffff,sym(e,e.symbols[1])));
  mutate('symbol partition',(b,e)=>b.writeUInt32LE(0,header(b,e.symtab)+28));
  for (const [field,value] of [[8,1],[12,4],[32,1],[36,8]]) mutate('SYMTAB metadata',(b,e)=>b.writeUInt32LE(value,header(b,e.symtab)+field));
  mutate('null symbol',(b,e)=>b.writeUInt32LE(1,e.symtab.offset+4));
  mutate('null section',b=>b.writeUInt32LE(1,b.readUInt32LE(32)+4));
  mutate('attributes',(b,e)=>{const s=e.sections.find(s=>s.name==='.ARM.attributes');b[s.offset+s.size-1]^=1});
  mutate('foreign payload',(b,e)=>{const s=e.sections.find(s=>s.name==='.ARM.attributes');b.writeUInt32LE(4,header(b,s)+8)});
  reject('extra relocation section',makeFixture(0,true));
  for(const [offset,width,value] of [[0,1,0],[4,1,2],[5,1,2],[6,1,0],[7,1,1],[8,1,1],[9,1,1],[16,2,2],[18,2,0],[20,4,0],[24,4,1],[28,4,52],[32,4,0xffffffff],[36,4,0],[40,2,0],[42,2,1],[44,2,1],[46,2,0],[48,2,0],[50,2,0]])mutate('ELF header '+offset,b=>{if(width===1)b[offset]=value;else if(width===2)b.writeUInt16LE(value,offset);else b.writeUInt32LE(value,offset)});
  const good=makeFixture();for(const size of [0,1,7,51,52,good.length-1])reject('truncation '+size,good.subarray(0,size));
  reject('file parser cap',Buffer.alloc(MAX_FILE+1),/64 MiB/);
  mutate('section parser cap',b=>b.writeUInt16LE(MAX_SECTIONS+1,48),/16,384/);
  mutate('exec parser cap',(b,e)=>{const s=e.sections.find(s=>s.name==='.ARM.attributes'),p=header(b,s);b.writeUInt32LE(8,p+4);b.writeUInt32LE(4,p+8);b.writeUInt32LE(MAX_EXEC+1,p+20)},/aggregate executable/);
  // Oversized valid payload aliases prove aggregate counting happens before decoding.
  const aggregateCap = (type, entry, pattern) => {
    const b=makeFixture(),e=parseElf(b),out=Buffer.alloc(17*1024*1024);b.copy(out);const candidates=e.sections.filter(s=>s.name.startsWith('.rel.text.')).slice(0,2);
    for(const s of candidates){const p=header(out,s);out.writeUInt32LE(type,p+4);out.writeUInt32LE(4096,p+16);out.writeUInt32LE(500_001*entry,p+20);out.writeUInt32LE(entry,p+36)}
    reject('aggregate parser cap '+type,out,pattern);
  };
  aggregateCap(2,16,/aggregate symbol/);aggregateCap(11,16,/aggregate symbol/);
  aggregateCap(9,8,/aggregate relocation/);aggregateCap(4,12,/aggregate relocation/);
  process.stdout.write(`arm-runtime-helpers-121 self-test: ok (${rejected} hostile fixtures; 12,000-section composite)\n`);
}

function main() {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  validatePinnedInputs(repo);
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-121.mjs <object-file> | --self-test");
  const descriptor = fs.openSync(args[0], 'r');
  try {
    const size = fs.fstatSync(descriptor).size;
    check(size <= MAX_FILE, "complete input exceeds 64 MiB before read");
    const buffer = Buffer.alloc(size);
    let total = 0;
    while (total < size) { const count = fs.readSync(descriptor, buffer, total, size - total, null); check(count > 0, "input truncated during read"); total += count; }
    const extra = Buffer.alloc(1); check(fs.readSync(descriptor, extra, 0, 1, null) === 0, "input changed during read");
    validateObject(buffer);
  } finally { fs.closeSync(descriptor); }
  process.stdout.write(`arm-runtime-helpers-121 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-121 validation failed: ${error.message}\n`); process.exitCode = 1; }
