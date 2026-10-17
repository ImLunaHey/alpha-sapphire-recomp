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
const RAW_CONFIG_HASH = "7f501215acd79fb88fb2ae6dbeddcf81bcf591bf20a4dd57e800c2a5fde83e0f";
const CONTRACT_HASH = "2e162847fda2aa111cc1c22de515f1c1b4b666b82091b77554c5cdfc67198c25";
const SOURCE_HASH = "cd63dfaaa6a6518aa144ba66ade135b934c661b653dcbf5703a371a8f536c201";
const SPEC_HASH = "ba7561209d286ad165fb98bf7db2946c44d7a9cdd8cc487fe2a24d73fca305b2";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  {
    "name": "func_0024FB80",
    "body": 144,
    "owned": 148,
    "words": [
      3912040496,
      3851423764,
      3818934272,
      3851497472,
      3852406904,
      3851534692,
      3851423764,
      3780313089,
      167772184,
      3852210688,
      3851501572,
      3800317954,
      3850452996,
      3852210688,
      3800317954,
      3850452996,
      3851620388,
      3851493376,
      3780247553,
      361897984,
      452984828,
      3852210688,
      3813933058,
      2185502722,
      2239832068,
      2508279812,
      3852210688,
      3851493380,
      3813801986,
      2185371650,
      2239832068,
      2508279812,
      3851628544,
      3942645731,
      3904700464,
      3778019102
    ],
    "literals": [
      {
        "offset": 144,
        "symbol": "global_load_29"
      }
    ]
  },
  {
    "name": "func_0026CFA8",
    "body": 28,
    "owned": 32,
    "words": [
      3852406804,
      3851493712,
      3813801984,
      92340560,
      60817409,
      329252864,
      3778019102
    ],
    "literals": [
      {
        "offset": 28,
        "symbol": "global_load_29"
      }
    ]
  },
  {
    "name": "func_0026CFC8",
    "body": 32,
    "owned": 36,
    "words": [
      3852402712,
      3851424080,
      3813736448,
      329256960,
      360714576,
      329252865,
      60817408,
      3778019102
    ],
    "literals": [
      {
        "offset": 32,
        "symbol": "global_load_29"
      }
    ]
  }
];
const IDENTITIES = ["global_load_29"];

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
  check(shoff >= 52 && shoff % 4 === 0, "invalid section table alignment or header overlap");
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
    check(section.index === 0 || (section.align > 0 && (section.align & (section.align - 1)) === 0), `invalid section alignment for ${section.name}`);
    if (section.type !== 8) {
      range(buffer, section.offset, section.size, `section ${section.name}`);
      check(section.size === 0 || section.offset % section.align === 0, `misaligned section ${section.name}`);
    }
    if (section.flags & 4) execSize = addChecked(execSize, section.size, MAX_EXEC, "aggregate executable data");
  }
  enforceLimits({ fileSize: buffer.length, execSize, sectionCount: shnum, symbolCount: 0, relocationCount: 0 });
  const spans = sections.filter((s) => s.type !== 8 && s.size > 0).map((s) => ({ start: s.offset, end: s.offset + s.size }));
  spans.push({ start: 0, end: 52 }, { start: shoff, end: shoff + shnum * 40 });
  spans.sort((a, b) => a.start - b.start);
  for (let i = 1; i < spans.length; i++) check(spans[i].start >= spans[i - 1].end, "overlapping ELF payload/header/table ranges");
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
  check(symtab.flags === 0 && symtab.addr === 0 && symtab.align === 4, "invalid SYMTAB metadata");
  check(symtab.link < shnum && sections[symtab.link].type === 3, "SYMTAB has invalid string-table link");
  const strings = range(buffer, sections[symtab.link].offset, sections[symtab.link].size, "symbol string table");
  check(strings.length > 0 && strings[0] === 0 && strings.at(-1) === 0, "noncanonical symbol string table");
  const symbols = [];
  for (let i = 0; i < symtab.size / 16; i++) {
    const p = symtab.offset + i * 16;
    const nameOffset = buffer.readUInt32LE(p);
    symbols.push({ index: i, nameOffset, name: nameOffset === 0 ? "" : cstring(strings, nameOffset, `symbol ${i}`), value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), bind: buffer[p + 12] >>> 4, type: buffer[p + 12] & 15, other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14) });
  }
  check(symbols.every((s) => s.shndx < shnum || s.shndx === 0xfff1 || s.shndx === 0xfff2), "invalid symbol section index");
  check(symtab.info <= symbols.length && symbols.every((s, i) => i < symtab.info ? s.bind === 0 : s.bind !== 0), "SYMTAB local/global partition is invalid");
  check(symbols.length > 0 && Object.values(symbols[0]).every((v) => v === 0 || v === ""), "null symbol is not canonical");
  return { buffer, sections, symtab, symbols, relocationSections };
}

function validateObject(buffer) {
  const elf = parseElf(buffer);
  const byName = new Map(elf.sections.map((s) => [s.name, s]));
  const ownedNames = FUNCTIONS.map((f) => `.text.${f.name}`);
  const actualExec = elf.sections.filter((s) => (s.flags & 4) && s.size).map((s) => s.name);
  check(actualExec.length === ownedNames.length && actualExec.every((n) => ownedNames.includes(n)), "nonempty executable section set is not exact");
  for (const fn of FUNCTIONS) {
    const s = byName.get(`.text.${fn.name}`);
    check(s && elf.sections.filter((t) => t.name === s.name).length === 1, `missing or duplicate section for ${fn.name}`);
    check(s.type === 1 && s.flags === 6 && s.align === 4 && s.addr === 0 && s.size === fn.owned && s.link === 0 && s.info === 0 && s.entsize === 0, `invalid owned section metadata for ${fn.name}`);
    const data = range(buffer, s.offset, s.size, fn.name);
    fn.words.forEach((w, i) => check(data.readUInt32LE(i * 4) === w, `${fn.name} instruction mismatch at ${i * 4}`));
    fn.literals.forEach((w) => check(data.readUInt32LE(w.offset) === 0, `${fn.name} literal addend at ${w.offset} is nonzero`));
    const members = elf.symbols.filter((t) => t.shndx === s.index);
    const canonical = (t, name, bind, type, value, size) => t.name === name && t.bind === bind && t.type === type && t.value === value && t.size === size && t.other === 0;
    check(members.length === 4 &&
      members.filter((t) => canonical(t, "", 0, 3, 0, 0)).length === 1 &&
      members.filter((t) => canonical(t, "$a", 0, 0, 0, 0)).length === 1 &&
      members.filter((t) => canonical(t, "$d", 0, 0, fn.body, 0)).length === 1 &&
      members.filter((t) => canonical(t, fn.name, 1, 2, 0, fn.body)).length === 1,
    `${fn.name} section/function/mapping symbol contract differs`);
  }
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attributes.length === 1, "expected one ARM attributes section");
  const a = attributes[0];
  check(a.type === 0x70000003 && a.flags === 0 && a.addr === 0 && a.align === 1 && a.link === 0 && a.info === 0 && a.entsize === 0 && range(buffer, a.offset, a.size, "ARM attributes").equals(ARM_ATTRIBUTES), "ARM attributes contract differs");
  const globals = elf.symbols.filter((s) => s.bind !== 0);
  const expectedGlobals = [...FUNCTIONS.map((f) => f.name), ...IDENTITIES];
  check(globals.length === expectedGlobals.length && expectedGlobals.every((n) => globals.filter((s) => s.name === n).length === 1), "global symbol set differs");
  for (const name of IDENTITIES) {
    const s = globals.find((s) => s.name === name);
    check(s.bind === 1 && s.type === 0 && s.other === 0 && s.shndx === 0 && s.value === 0 && s.size === 0, `invalid undefined identity ${name}`);
  }
  const locals = elf.symbols.filter((s) => s.bind === 0 && s.name);
  check(locals.length === FUNCTIONS.length * 2 && locals.every((s) => s.name === "$a" || s.name === "$d"), "named local set differs");
  check(elf.relocationSections.length === FUNCTIONS.length, "relocation section set differs");
  for (const fn of FUNCTIONS) {
    const owned = byName.get(`.text.${fn.name}`);
    const matches = elf.relocationSections.filter((s) => s.info === owned.index);
    check(matches.length === 1, `missing or duplicate relocation section for ${fn.name}`);
    const rs = matches[0];
    check(rs.name === `.rel.text.${fn.name}` && rs.type === 9 && rs.flags === 0x40 && rs.align === 4 && rs.addr === 0 && rs.link === elf.symtab.index && rs.entsize === 8 && rs.size === fn.literals.length * 8, `invalid relocation section for ${fn.name}`);
    const records = [];
    for (let p = rs.offset; p < rs.offset + rs.size; p += 8) {
      const offset = buffer.readUInt32LE(p), info = buffer.readUInt32LE(p + 4);
      const symbol = elf.symbols[info >>> 8];
      check(symbol && (info & 255) === 2 && offset % 4 === 0 && offset <= owned.size - 4, `invalid ABS32 relocation for ${fn.name}`);
      records.push({ offset, symbol: symbol.name });
    }
    check(fn.literals.every((w) => records.filter((r) => r.offset === w.offset && r.symbol === w.symbol).length === 1), `literal relocation identity/offset differs for ${fn.name}`);
  }
  return true;
}

function validatePinnedInputs(repo) {
  const configBytes = fs.readFileSync(path.join(repo, "config/arm-runtime-helpers-125.json"));
  const config = JSON.parse(configBytes);
  check(sha256(configBytes) === RAW_CONFIG_HASH, "raw configuration pin differs");
  check(config.sourceHash === SOURCE_HASH, "configuration sourceHash pin differs");
  check(sha256(fs.readFileSync(path.join(repo, "src/main/arm_runtime_helpers_125.S"))) === SOURCE_HASH, "assembly source hash differs");
  const normalized = structuredClone(config); normalized.sourceHash = null;
  check(sha256(stable(normalized)) === CONTRACT_HASH, "normalized configuration contract differs");
  check(sha256(fs.readFileSync(path.join(repo, "docs/specs/main/arm_runtime_helpers_125.md"))) === SPEC_HASH, "specification pin differs");
}

function makeFixture({ foreignCount = 0, extraSections = [] } = {}) {
  const sections = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0) },
    { name: ".shstrtab", type: 3, flags: 0, align: 1, data: null }];
  const owned = new Map();
  for (const fn of FUNCTIONS) {
    const data = Buffer.alloc(fn.owned);
    fn.words.forEach((w, i) => data.writeUInt32LE(w, i * 4));
    owned.set(fn.name, sections.length);
    sections.push({ name: `.text.${fn.name}`, type: 1, flags: 6, align: 4, data });
  }
  const rels = new Map();
  for (const fn of FUNCTIONS) {
    rels.set(fn.name, sections.length);
    sections.push({ name: `.rel.text.${fn.name}`, type: 9, flags: 0x40, align: 4, info: owned.get(fn.name), entsize: 8, data: Buffer.alloc(fn.literals.length * 8) });
  }
  for (let i = 0; i < foreignCount; i++) sections.push({ name: `.text.foreign.${i}`, type: 1, flags: 6, align: 4, data: Buffer.alloc(0) });
  sections.push(...extraSections.map((s) => ({ flags: 0, align: 4, ...s })));
  sections.push({ name: ".ARM.attributes", type: 0x70000003, flags: 0, align: 1, data: ARM_ATTRIBUTES });
  const strtabIndex = sections.length;
  sections.push({ name: ".strtab", type: 3, flags: 0, align: 1, data: null });
  const symtabIndex = sections.length;
  sections.push({ name: ".symtab", type: 2, flags: 0, align: 4, data: null, link: strtabIndex, entsize: 16 });
  const makeStrings = (values) => {
    const offsets = new Map([["", 0]]), chunks = [Buffer.from([0])]; let size = 1;
    for (const value of values) if (!offsets.has(value)) { offsets.set(value, size); const b = Buffer.from(`${value}\0`); chunks.push(b); size += b.length; }
    return { offsets, data: Buffer.concat(chunks) };
  };
  const shs = makeStrings(sections.map((s) => s.name)); sections[1].data = shs.data;
  const sts = makeStrings(["$a", "$d", ...FUNCTIONS.map((f) => f.name), ...IDENTITIES]); sections[strtabIndex].data = sts.data;
  const symbols = [{ name: "", shndx: 0 }];
  for (const fn of FUNCTIONS) {
    const shndx = owned.get(fn.name);
    symbols.push({ name: "", type: 3, shndx }, { name: "$a", shndx }, { name: "$d", value: fn.body, shndx });
  }
  const firstGlobal = symbols.length;
  FUNCTIONS.forEach((f) => symbols.push({ name: f.name, bind: 1, type: 2, size: f.body, shndx: owned.get(f.name) }));
  const identitySymbols = new Map();
  for (const name of IDENTITIES) { identitySymbols.set(name, symbols.length); symbols.push({ name, bind: 1, shndx: 0 }); }
  const symdata = Buffer.alloc(symbols.length * 16);
  symbols.forEach((s, i) => { const p = i * 16; symdata.writeUInt32LE(sts.offsets.get(s.name), p); symdata.writeUInt32LE(s.value ?? 0, p + 4); symdata.writeUInt32LE(s.size ?? 0, p + 8); symdata[p + 12] = ((s.bind ?? 0) << 4) | (s.type ?? 0); symdata.writeUInt16LE(s.shndx, p + 14); });
  sections[symtabIndex].data = symdata; sections[symtabIndex].info = firstGlobal;
  for (const fn of FUNCTIONS) {
    const section = sections[rels.get(fn.name)]; section.link = symtabIndex;
    fn.literals.forEach((w, i) => { section.data.writeUInt32LE(w.offset, i * 8); section.data.writeUInt32LE((identitySymbols.get(w.symbol) << 8) | 2, i * 8 + 4); });
  }
  let cursor = 52;
  for (let i = 1; i < sections.length; i++) { const s = sections[i]; cursor = Math.ceil(cursor / s.align) * s.align; s.offset = cursor; s.size = s.data.length; cursor += s.size; }
  cursor = Math.ceil(cursor / 4) * 4; const shoff = cursor, output = Buffer.alloc(shoff + sections.length * 40);
  output.set(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]), 0); output.writeUInt16LE(1, 16); output.writeUInt16LE(40, 18); output.writeUInt32LE(1, 20); output.writeUInt32LE(shoff, 32); output.writeUInt32LE(0x05000000, 36); output.writeUInt16LE(52, 40); output.writeUInt16LE(40, 46); output.writeUInt16LE(sections.length, 48); output.writeUInt16LE(1, 50);
  for (let i = 1; i < sections.length; i++) output.set(sections[i].data, sections[i].offset);
  sections.forEach((s, i) => { const p = shoff + i * 40; output.writeUInt32LE(shs.offsets.get(s.name), p); output.writeUInt32LE(s.type, p + 4); output.writeUInt32LE(s.flags, p + 8); output.writeUInt32LE(s.offset ?? 0, p + 16); output.writeUInt32LE(s.size ?? 0, p + 20); output.writeUInt32LE(s.link ?? 0, p + 24); output.writeUInt32LE(s.info ?? 0, p + 28); output.writeUInt32LE(s.align, p + 32); output.writeUInt32LE(s.entsize ?? 0, p + 36); });
  return output;
}

function expectFailure(label, operation, pattern) {
  try { operation(); } catch (error) { check(!pattern || pattern.test(error.message), `self-test ${label} failed for the wrong reason: ${error.message}`); return; }
  fail(`self-test ${label} accepted hostile input`);
}

function selfTest() {
  validateObject(makeFixture());
  validateObject(makeFixture({ foreignCount: 12_000 }));
  const mutate = (label, operation, pattern) => { const b = makeFixture(), elf = parseElf(b); operation(b, elf); expectFailure(label, () => validateObject(b), pattern); };
  const header = (b, s, field, value) => b.writeUInt32LE(value, b.readUInt32LE(32) + s.index * 40 + field);
  const firstOwned = (e) => e.sections.find((s) => s.name === `.text.${FUNCTIONS[0].name}`);
  for (const fn of FUNCTIONS) {
    fn.words.forEach((_, i) => mutate(`${fn.name} instruction ${i}`, (b, e) => { b[e.sections.find((s) => s.name === `.text.${fn.name}`).offset + i * 4] ^= 1; }, /instruction mismatch/));
    for (let i = 0; i < fn.body; i++) mutate(`${fn.name} body byte ${i}`, (b, e) => {
      b[e.sections.find((s) => s.name === `.text.${fn.name}`).offset + i] ^= 0x80;
    }, /instruction mismatch/);
    for (const w of fn.literals) mutate(`${fn.name} literal ${w.offset}`, (b, e) => b.writeUInt32LE(1, e.sections.find((s) => s.name === `.text.${fn.name}`).offset + w.offset), /nonzero/);
  }
  for (const [label, field, value] of [["type", 4, 8], ["flags", 8, 7], ["address", 12, 4], ["size", 20, FUNCTIONS[0].owned - 4], ["alignment", 32, 8], ["entsize", 36, 4], ["link", 24, 1], ["info", 28, 1]]) mutate(`owned ${label}`, (b, e) => header(b, firstOwned(e), field, value));
  for (const [label, field, value] of [["mapping offset", 4, 4], ["mapping size", 8, 4], ["mapping type", 12, 2], ["mapping visibility", 13, 1]]) mutate(label, (b, e) => { const s = e.symbols.find((s) => s.name === "$a"); const p = e.symtab.offset + s.index * 16 + field; if (field >= 12) b[p] = value; else b.writeUInt32LE(value, p); });
  mutate("data mapping transition", (b, e) => { const s = e.symbols.find((s) => s.name === "$d"); b.writeUInt32LE(0, e.symtab.offset + s.index * 16 + 4); });
  for (const [label, field, value] of [["Thumb state", 4, 1], ["function size", 8, 4], ["function type", 12, 0x10], ["function visibility", 13, 1], ["undefined function", 14, 0]]) mutate(label, (b, e) => { const s = e.symbols.find((s) => s.name === FUNCTIONS[0].name), p = e.symtab.offset + s.index * 16 + field; if (field >= 12) b[p] = value; else b.writeUInt32LE(value, p); });
  mutate("null symbol", (b, e) => b.writeUInt32LE(1, e.symtab.offset + 4));
  mutate("section symbol", (b, e) => { const s = e.symbols.find((s) => s.type === 3); b.writeUInt32LE(4, e.symtab.offset + s.index * 16 + 4); });
  mutate("extra global", (b, e) => { const s = e.symbols.find((s) => s.name === "$a"); b[e.symtab.offset + s.index * 16 + 12] = 0x10; });
  for (const field of [4, 8, 12, 13, 14]) mutate(`undefined identity metadata ${field}`, (b, e) => { const s = e.symbols.find((s) => s.name === IDENTITIES[0]), p = e.symtab.offset + s.index * 16 + field; if (field >= 12) b[p] = 1; else b.writeUInt32LE(1, p); });
  for (const [label, field, value] of [["RELA", 4, 4], ["flags", 8, 0], ["link", 24, 0], ["info", 28, 0], ["alignment", 32, 8], ["entry size", 36, 4], ["size", 20, 16]]) mutate(`relocation ${label}`, (b, e) => header(b, e.relocationSections[0], field, value));
  mutate("relocation offset", (b, e) => b.writeUInt32LE(0, e.relocationSections[0].offset));
  mutate("relocation type", (b, e) => { const p = e.relocationSections[0].offset + 4; b.writeUInt32LE((b.readUInt32LE(p) & ~255) | 28, p); });
  mutate("relocation identity", (b, e) => { const p = e.relocationSections[0].offset + 4; b.writeUInt32LE(b.readUInt32LE(p) + 256, p); });
  mutate("relocation symbol range", (b, e) => b.writeUInt32LE(0xffffff02, e.relocationSections[0].offset + 4));
  mutate("cross-function relocation target", (b, e) => header(b, e.relocationSections[0], 28, e.relocationSections[1].info));
  mutate("ELF flags", (b) => b.writeUInt32LE(0, 36));
  mutate("ELF machine", (b) => b.writeUInt16LE(3, 18));
  mutate("ELF class", (b) => { b[4] = 2; });
  mutate("ELF endianness", (b) => { b[5] = 2; });
  mutate("program headers", (b) => b.writeUInt32LE(52, 28));
  mutate("section table bounds", (b) => b.writeUInt32LE(0xfffffff0, 32));
  mutate("section zero", (b) => b.writeUInt32LE(1, b.readUInt32LE(32)));
  mutate("overlapping payloads", (b, e) => {
    const first = firstOwned(e), second = e.sections.find((s) => s.name === `.text.${FUNCTIONS[1].name}`);
    header(b, second, 16, first.offset);
  }, /overlapping/);
  mutate("unterminated section names", (b, e) => {
    const s = e.sections.find((s) => s.name === ".shstrtab");
    b[s.offset + s.size - 1] = 1;
  }, /unterminated/);
  mutate("ARM attributes", (b, e) => { const s = e.sections.find((s) => s.name === ".ARM.attributes"); b[s.offset + s.size - 1] ^= 1; });
  expectFailure("foreign payload", () => validateObject(makeFixture({ extraSections: [{ name: ".text.payload", type: 1, flags: 6, data: Buffer.alloc(4) }] })));
  expectFailure("empty relocation section", () => validateObject(makeFixture({ extraSections: [{ name: ".rel.extra", type: 9, entsize: 8, data: Buffer.alloc(0) }] })));
  expectFailure("file cap", () => parseElf(Buffer.alloc(MAX_FILE + 1)), /64 MiB/);
  expectFailure("exec cap", () => parseElf(makeFixture({ extraSections: [{ name: ".text.large", type: 1, flags: 6, data: Buffer.alloc(MAX_EXEC) }] })), /aggregate executable/);
  expectFailure("section cap", () => parseElf(makeFixture({ foreignCount: MAX_SECTIONS })), /section count/);
  expectFailure("aggregate symbol cap", () => parseElf(makeFixture({ extraSections: [
    { name: ".symtab.extra", type: 2, entsize: 16, data: Buffer.alloc(500_001 * 16) },
    { name: ".dynsym.extra", type: 11, entsize: 16, data: Buffer.alloc(500_001 * 16) },
  ] })), /aggregate symbol/);
  expectFailure("aggregate relocation cap", () => parseElf(makeFixture({ extraSections: [
    { name: ".rel.extra", type: 9, entsize: 8, data: Buffer.alloc(500_001 * 8) },
    { name: ".rela.extra", type: 4, entsize: 12, data: Buffer.alloc(500_001 * 12) },
  ] })), /aggregate relocation/);
  const valid = makeFixture();
  for (const n of [0, 7, 51, valid.length - 1]) expectFailure(`truncated ${n}`, () => validateObject(valid.subarray(0, n)));
  process.stdout.write("arm-runtime-helpers-125 self-test: ok (instruction/literal mutations, hostile ELF, all parser caps, 12,000-section composite)\n");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(item) : entry.isFile() ? [item] : [];
  });
}

function auditOwnership(repo) {
  const inventory = fs.readFileSync(path.join(repo, "symbols/code.bin.csv"), "utf8").split(/\r?\n/).flatMap((line) => {
    const m = line.match(/^([0-9A-F]+),"([^"]+)","[^"]*",\$(.),([0-9A-F]+),/);
    return m ? [{ address: parseInt(m[1], 16), name: m[2], mode: m[3], size: parseInt(m[4], 16) }] : [];
  });
  const byName = new Map(inventory.map((f) => [f.name, f]));
  const config = JSON.parse(fs.readFileSync(path.join(repo, "config/arm-runtime-helpers-125.json")));
  const owned = FUNCTIONS.map((f) => {
    const entry = byName.get(f.name), contract = config.functions.find((t) => t.name === f.name);
    check(entry && entry.mode === "a" && entry.size === f.body && entry.address >= 0x240000 && entry.address < 0x280000, `inventory mode/range/body differs for ${f.name}`);
    const next = inventory[inventory.indexOf(entry) + 1];
    check(next && next.name === contract.nextGlobal && entry.address + f.owned <= next.address, `ownership boundary differs for ${f.name}`);
    return { ...f, address: entry.address };
  });
  for (const file of walk(path.join(repo, "config")).filter((p) => p.endsWith(".json") && p !== path.join(repo, "config/arm-runtime-helpers-125.json"))) {
    const other = JSON.parse(fs.readFileSync(file));
    if (!Array.isArray(other.functions)) continue;
    for (const f of other.functions) {
      const entry = byName.get(f.name);
      if (!entry) continue;
      // The inventory supplies body extent even for macro/template manifests.
      const size = Math.max(entry.size, Number(f.ownedSize) || 0, Number(f.size) || 0);
      check(!owned.some((o) => o.address < entry.address + size && entry.address < o.address + o.owned), `configuration ownership overlap in ${path.relative(repo, file)}: ${f.name}`);
    }
  }
  for (const file of walk(path.join(repo, "src"))) {
    if (file === path.join(repo, config.source)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const f of owned) check(!new RegExp(`\\b${f.name}\\b`).test(text), `other source references selected entry in ${path.relative(repo, file)}: ${f.name}`);
  }
  const reportPath = path.join(repo, "build/AS_EUR_REV2/report.json");
  if (fs.existsSync(reportPath)) {
    const functions = JSON.parse(fs.readFileSync(reportPath)).units.flatMap((u) => u.functions ?? []);
    for (const f of owned) check(functions.some((t) => t.name === f.name && Number(t.size) === f.body), `entry is missing or has the wrong local report boundary: ${f.name}`);
  }
  return owned;
}

function readBounded(file) {
  check(fs.statSync(file).size <= MAX_FILE, "complete input exceeds 64 MiB before read");
  return fs.readFileSync(file);
}

function compareAuthoritative(object, target, code, owned) {
  validateObject(object);
  check(code.length === 5439488 && sha256(code) === "b7f9ce60361f3709ed0ce879658afe10a712f7db060640fa72bba826301b7c16", "private AS_EUR_REV2 code hash/size differs");
  const actual = parseElf(object), reference = parseElf(target);
  const find = (elf, name) => {
    const matches = elf.sections.filter((s) => s.name === `.text.${name}`);
    check(matches.length === 1, `authoritative section missing or duplicated: ${name}`);
    return matches[0];
  };
  // The existing generated anchor binds this private equality class to its
  // public identity. Never serialize the resolved pointer into public output.
  const anchor = find(reference, "func_0026CF98");
  const anchorRel = reference.relocationSections.filter((r) => r.info === anchor.index);
  check(anchorRel.length === 1 && anchorRel[0].size === 8 && anchorRel[0].type === 9, "anchor relocation differs");
  const ar = anchorRel[0], ri = target.readUInt32LE(ar.offset + 4);
  check(target.readUInt32LE(ar.offset) === 12 && (ri & 255) === 2 && reference.symbols[ri >>> 8]?.name === "global_load_29" && target.readUInt32LE(anchor.offset + 12) === 0, "anchor identity differs");
  const root = code.readUInt32LE(0x26cf98 - 0x100000 + 12);
  for (const f of owned) {
    const s = find(actual, f.name), t = find(reference, f.name);
    // The shared generator emits only the unmatched body. Its unclaimed
    // adjacent literal is validated directly against verified private code.
    check(t.size === f.body && !reference.relocationSections.some((r) => r.info === t.index), `authoritative raw extent/relocations differ for ${f.name}`);
    const symbol = reference.symbols.filter((v) => v.name === f.name);
    check(symbol.length === 1 && symbol[0].type === 2 && symbol[0].size === f.body && symbol[0].value === 0 && symbol[0].shndx === t.index, `authoritative function boundary differs for ${f.name}`);
    const privateBytes = range(code, f.address - 0x100000, f.owned, f.name);
    const targetBytes = range(target, t.offset, t.size, f.name);
    check(targetBytes.equals(privateBytes.subarray(0, f.body)), `target/private byte mismatch for ${f.name}`);
    const resolved = Buffer.from(range(object, s.offset, s.size, f.name));
    check(privateBytes.readUInt32LE(f.body) === root, `private literal identity differs for ${f.name}`);
    resolved.writeUInt32LE(root, f.body);
    check(resolved.equals(privateBytes), `authoritative body/adjacent byte mismatch for ${f.name}`);
  }
}

function validateAuthoritative(repo, objectPath, targetPath, codePath) {
  const owned = auditOwnership(repo);
  compareAuthoritative(readBounded(objectPath), readBounded(targetPath), readBounded(codePath), owned);
  process.stdout.write("arm-runtime-helpers-125 authoritative validation: ok (3 functions, 204 body bytes, 12 adjacent bytes, 3 R_ARM_ABS32; no ownership overlap)\n");
}

function main() {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  validatePinnedInputs(repo);
  auditOwnership(repo);
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  if (args.length === 4 && args[0] === "--authoritative") return validateAuthoritative(repo, ...args.slice(1));
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-125.mjs <object-file> | --self-test | --authoritative <object-file> <target-ELF> <private-code-input>");
  check(fs.statSync(args[0]).size <= MAX_FILE, "complete input exceeds 64 MiB before read");
  validateObject(fs.readFileSync(args[0]));
  process.stdout.write(`arm-runtime-helpers-125 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-125 validation failed: ${error.message}\n`); process.exitCode = 1; }
