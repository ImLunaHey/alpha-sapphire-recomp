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
const RAW_CONFIG_HASH = "d1128dbf2ff27f256d069ea7b0472badcc183568c483226f00dab3165cea972d";
const CONTRACT_HASH = "513835c094b7f06fe26a87479d108b7a46fa865d7984115ca0b839feb7301a21";
const SOURCE_HASH = "7165423b8233d937fc29d08ccb91b794822afcb34bb89f95e6b107a958ef5849";
const SPEC_HASH = "85a2c5d3e6437a30f0f0da6e132a30a99ab476dfcab2aae6adef2bc03b79c5f2";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  {
    "name": "func_0019B4A8",
    "body": 44,
    "owned": 44,
    "words": [
      3844988932,
      3822137345,
      310448129,
      3785371905,
      3763195907,
      3785363469,
      3844943876,
      3778019122,
      3835506692,
      3767390211,
      3835555844
    ]
  },
  {
    "name": "func_0019BDE0",
    "body": 60,
    "owned": 72,
    "words": [
      3851427840,
      3852415024,
      3852406832,
      3760264082,
      3852415020,
      3850375168,
      3758303265,
      3782151954,
      3791765762,
      3785367570,
      3797946510,
      3767280674,
      3766627201,
      3992988176,
      3778019102,
      214013,
      2531011,
      32767
    ]
  },
  {
    "name": "func_0019BE28",
    "body": 60,
    "owned": 72,
    "words": [
      3851427840,
      3852415024,
      3852406832,
      3760264082,
      3852415020,
      3850375168,
      3758303265,
      3782151954,
      3791765762,
      3785367570,
      3797946509,
      3767280674,
      3766627201,
      3992988176,
      3778019102,
      214013,
      2531011,
      32767
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
    const mapsD = members.filter((s) => s.name === "$d" && s.bind === 0 && s.type === 0 && s.other === 0 && s.value === fn.body && s.size === 0);
    check(mapsD.length === (fn.owned > fn.body ? 1 : 0), fn.name + " has invalid data mapping symbol");
    check(members.length === (fn.owned > fn.body ? 4 : 3), `${fn.name} has an extra named or unnamed symbol`);
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
  check(namedLocals.length === FUNCTIONS.length + FUNCTIONS.filter(f => f.owned > f.body).length &&
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
      relocs.push({ target, offset, type, symbol: elf.symbols[symbolIndex], addend: buffer.readInt32LE(target.offset + offset) });
    }
  }
  check(relocs.length === 0, "relocation count is not zero");
  return true;
}

function validatePinnedInputs(repo) {
  const configPath = path.join(repo, "config/arm-runtime-helpers-122.json");
  const sourcePath = path.join(repo, "src/main/arm_runtime_helpers_122.S");
  const specPath = path.join(repo, "docs/specs/main/arm_runtime_helpers_122.md");
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


function publicInventory(repo) {
  return fs.readFileSync(path.join(repo, "symbols/code.bin.csv"), "utf8").split(/\r?\n/).map(line => line.match(/^([0-9A-F]+),"([^"]+)","[^"]*",\$(.),([0-9A-F]+),/)).filter(Boolean).map(m => ({ address: parseInt(m[1], 16), name: m[2], mode: m[3], size: parseInt(m[4], 16) }));
}
function validateOwnership(repo) {
  const inventory = publicInventory(repo), byName = new Map(inventory.map(f => [f.name, f]));
  const intervals = FUNCTIONS.map(f => ({ ...f, start: parseInt(f.name.slice(5), 16), end: parseInt(f.name.slice(5), 16) + f.owned }));
  for (const f of intervals) {
    const record = byName.get(f.name);
    check(record && record.address === f.start && record.mode === "a" && record.size === f.body, f.name + " inventory boundary/mode mismatch");
    check(f.start >= 0x180000 && f.start < 0x1c0000 && f.start % 4 === 0, "entry outside lane range");
    check(!inventory.some(g => g.name !== f.name && g.address > f.start && g.address < f.end), f.name + " crosses an inventory entry");
    check(!intervals.some(g => g.name !== f.name && f.start < g.end && g.start < f.end), "overlapping lane functions");
  }
  const inspect = (name, size, owner) => {
    const address = byName.get(name)?.address;
    if (address === undefined) return;
    check(!intervals.some(f => address < f.end && f.start < address + size), "ownership overlap: " + owner + " / " + name);
  };
  for (const file of fs.readdirSync(path.join(repo, "config"), { recursive: true })) {
    if (!file.endsWith(".json") || file === "arm-runtime-helpers-122.json") continue;
    const value = JSON.parse(fs.readFileSync(path.join(repo, "config", file)));
    const walk = node => {
      if (!node || typeof node !== "object") return;
      if (typeof node.name === "string" && /^func_[0-9A-F]+$/.test(node.name)) {
        const size = node.ownedSize ?? node.size ?? node.bodySize;
        if (Number.isSafeInteger(size) && size > 0) inspect(node.name, size, "config/" + file);
      }
      for (const child of Object.values(node)) if (typeof child === "object") walk(child);
    };
    walk(value);
    // Reject even indirect/config-only claims of a selected identity.
    for (const fn of FUNCTIONS) check(!JSON.stringify(value).includes(fn.name), "foreign configuration references " + fn.name + ": " + file);
  }
  for (const file of fs.readdirSync(path.join(repo, "src"), { recursive: true })) {
    if (!/\.(?:S|s|c)$/.test(file) || file === "main/arm_runtime_helpers_122.S") continue;
    const source = fs.readFileSync(path.join(repo, "src", file), "utf8");
    // Conservatively include macro-generated definitions and C owners.
    for (const match of source.matchAll(/\bfunc_[0-9A-F]+\b/g)) {
      const entry = byName.get(match[0]);
      if (entry) inspect(entry.name, entry.size, "src/" + file);
    }
  }
}
function validateAuthoritative(object, code, target, report) {
  validateObject(object);
  const built = parseElf(object), original = parseElf(target);
  const targetFunctions = report.units.flatMap(unit => unit.functions ?? []);
  for (const fn of FUNCTIONS) {
    const address = parseInt(fn.name.slice(5), 16), offset = address - 0x100000;
    const bs = built.sections.find(s => s.name === ".text." + fn.name);
    const ts = original.sections.filter(s => s.name === ".text." + fn.name);
    check(ts.length === 1 && ts[0].size === fn.body, fn.name + " authoritative section boundary mismatch");
    const data = range(object, bs.offset, fn.owned, fn.name);
    check(data.equals(range(code, offset, fn.owned, "private image range")), fn.name + " private image byte mismatch");
    check(data.subarray(0, fn.body).equals(range(target, ts[0].offset, fn.body, "target ELF body")), fn.name + " target ELF byte mismatch");
    const functions = targetFunctions.filter(f => f.name === fn.name);
    check(functions.length === 1 && Number(functions[0].size) === fn.body && (functions[0].fuzzy_match_percent ?? 0) < 100, fn.name + " is absent, matched or wrong-sized in report");
  }
}

function expectFailure(label, operation) {
  let failed = false;
  try { operation(); } catch { failed = true; }
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
    if (fn.owned > fn.body) symbols.push({ name: "$d", value: fn.body, size: 0, bind: 0, type: 0, other: 0, shndx });
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
    object[parsed.sections.find((s) => s.name === ".text.func_0019B4A8").offset] ^= 1;
  });
  expectFailure("forbidden relocation", () => validateObject(makeFixture(0, true)));
  mutateAndReject("mapping symbol offset", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_0019BDE0");
    const mapping = parsed.symbols.find((s) => s.name === "$a" && s.shndx === owned.index);
    object.writeUInt32LE(4, parsed.symtab.offset + mapping.index * 16 + 4);
  });
  mutateAndReject("function metadata", (object, parsed) => {
    const symbol = parsed.symbols.find((s) => s.name === "func_0019B4A8");
    object[parsed.symtab.offset + symbol.index * 16 + 13] = 1;
  });
  mutateAndReject("missing section symbol", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_0019BDE0");
    const section = parsed.symbols.find((s) => s.shndx === owned.index && s.type === 3);
    const mapping = parsed.symbols.find((s) => s.shndx === owned.index && s.name === "$a");
    object.writeUInt32LE(mapping.nameOffset, parsed.symtab.offset + section.index * 16);
  });
  mutateAndReject("extra global", (object, parsed) => {
    const owned = parsed.sections.find((s) => s.name === ".text.func_0019BDE0");
    const mapping = parsed.symbols.find((s) => s.shndx === owned.index && s.name === "$a");
    object[parsed.symtab.offset + mapping.index * 16 + 12] = 0x10;
  });
  mutateAndReject("owned section alignment", (object, parsed) => {
    const section = parsed.sections.find((s) => s.name === ".text.func_0019B4A8");
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
  for (const fn of FUNCTIONS) {
    for (let offset = 0; offset < fn.owned; offset++) mutateAndReject(fn.name + " byte " + offset, (object, parsed) => {
      object[parsed.sections.find(s => s.name === ".text." + fn.name).offset + offset] ^= 1;
    });
  }
  mutateAndReject("literal mapping offset", (object, parsed) => {
    const mapping = parsed.symbols.find(s => s.name === "$d");
    object.writeUInt32LE(56, parsed.symtab.offset + mapping.index * 16 + 4);
  });
  mutateAndReject("function size includes literals", (object, parsed) => {
    const symbol = parsed.symbols.find(s => s.name === "func_0019BDE0");
    object.writeUInt32LE(72, parsed.symtab.offset + symbol.index * 16 + 8);
  });
  const fixture = makeFixture();
  for (const length of [0, 16, 51, fixture.length - 1]) expectFailure("truncated ELF " + length, () => validateObject(fixture.subarray(0, length)));
  mutateAndReject("section-table overflow", object => object.writeUInt32LE(0xfffffff0, 32));
  mutateAndReject("unterminated section names", (object, parsed) => {
    const names = parsed.sections.find(s => s.name === ".shstrtab");
    object.fill(65, names.offset, names.offset + names.size);
  });
  // Synthetic authoritative inputs test the comparison path without private data.
  const target = Buffer.from(fixture), targetElf = parseElf(target);
  const image = Buffer.alloc(0xa0000);
  for (const fn of FUNCTIONS) {
    const section = targetElf.sections.find(s => s.name === ".text." + fn.name);
    target.copy(image, parseInt(fn.name.slice(5), 16) - 0x100000, section.offset, section.offset + fn.owned);
    target.writeUInt32LE(fn.body, target.readUInt32LE(32) + section.index * 40 + 20);
  }
  const report = { units: [{ functions: FUNCTIONS.map(f => ({ name: f.name, size: String(f.body) })) }] };
  validateAuthoritative(fixture, image, target, report);
  for (const fn of FUNCTIONS) {
    const alteredImage = Buffer.from(image);
    alteredImage[parseInt(fn.name.slice(5), 16) - 0x100000] ^= 1;
    expectFailure("authoritative image body " + fn.name, () => validateAuthoritative(fixture, alteredImage, target, report));
    if (fn.owned > fn.body) {
      const alteredLiteral = Buffer.from(image);
      alteredLiteral[parseInt(fn.name.slice(5), 16) - 0x100000 + fn.body] ^= 1;
      expectFailure("authoritative image literal " + fn.name, () => validateAuthoritative(fixture, alteredLiteral, target, report));
    }
    const alteredTarget = Buffer.from(target);
    alteredTarget[targetElf.sections.find(s => s.name === ".text." + fn.name).offset] ^= 1;
    expectFailure("authoritative ELF body " + fn.name, () => validateAuthoritative(fixture, image, alteredTarget, report));
  }
  expectFailure("truncated private image", () => validateAuthoritative(fixture, image.subarray(0, 16), target, report));
  expectFailure("missing report functions", () => validateAuthoritative(fixture, image, target, { units: [] }));
  const matchedReport = structuredClone(report);
  matchedReport.units[0].functions[0].fuzzy_match_percent = 100;
  expectFailure("already matched function", () => validateAuthoritative(fixture, image, target, matchedReport));
  const duplicateReport = structuredClone(report);
  duplicateReport.units[0].functions.push(duplicateReport.units[0].functions[0]);
  expectFailure("duplicate report function", () => validateAuthoritative(fixture, image, target, duplicateReport));
  process.stdout.write("arm-runtime-helpers-122 self-test: ok (188 individual byte mutations, metadata, truncation, limits, 12000-section composite, authoritative evidence mutations)\n");
}

function main() {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  validatePinnedInputs(repo);
  validateOwnership(repo);
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  if (args.length === 5 && args[1] === "--authoritative") {
    validateAuthoritative(fs.readFileSync(args[0]), fs.readFileSync(args[2]), fs.readFileSync(args[3]), JSON.parse(fs.readFileSync(args[4])));
    process.stdout.write("arm-runtime-helpers-122 authoritative validation: ok (3 functions, 164 body bytes, 24 adjacent bytes, 0 relocations)\n");
    return;
  }
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-122.mjs <object-file> [--authoritative <private-code> <target-elf> <report>] | --self-test");
  validateObject(fs.readFileSync(args[0]));
  process.stdout.write(`arm-runtime-helpers-122 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-122 validation failed: ${error.message}\n`); process.exitCode = 1; }
