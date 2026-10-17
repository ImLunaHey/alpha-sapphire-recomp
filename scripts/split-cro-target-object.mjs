#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, openSync, closeSync, readFileSync, realpathSync, renameSync, statSync, unlinkSync, writeSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_ELF_SIZE = 64 * 1024 * 1024;
const MAX_INVENTORY_SIZE = 16 * 1024 * 1024;
const SHT_NULL = 0, SHT_PROGBITS = 1, SHT_SYMTAB = 2, SHT_STRTAB = 3, SHT_RELA = 4;
const SHT_NOBITS = 8, SHT_REL = 9;
const SHF_WRITE = 1, SHF_ALLOC = 2, SHF_EXECINSTR = 4, SHF_INFO_LINK = 0x40;
const STB_LOCAL = 0, STB_GLOBAL = 1;
const STT_NOTYPE = 0, STT_OBJECT = 1, STT_FUNC = 2, STT_SECTION = 3;
const R_ARM_ABS32 = 2;
const IDENTIFIER = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function checkedAdd(left, right, limit, message) {
  check(Number.isSafeInteger(left) && Number.isSafeInteger(right) && left >= 0 && right >= 0,
    message);
  const result = left + right;
  check(Number.isSafeInteger(result) && result <= limit, message);
  return result;
}

function align(value, alignment) {
  check(Number.isInteger(alignment) && alignment > 0 && (alignment & (alignment - 1)) === 0,
    "invalid ELF alignment");
  return value + ((alignment - value % alignment) % alignment);
}

function cstring(buffer, offset, context) {
  check(Number.isInteger(offset) && offset >= 0 && offset < buffer.length, `${context} string offset is invalid`);
  const end = buffer.indexOf(0, offset);
  check(end >= 0, `${context} string is not terminated`);
  return buffer.toString("utf8", offset, end);
}

function exactKeys(object, allowed, context) {
  check(object && typeof object === "object" && !Array.isArray(object), `${context} must be an object`);
  for (const key of Object.keys(object)) check(allowed.has(key), `${context} has unknown key ${key}`);
}

export function parseFunctionInventory(input) {
  const text = Buffer.isBuffer(input) ? input.toString("utf8") : String(input);
  check(Buffer.byteLength(text) <= MAX_INVENTORY_SIZE, "function inventory is too large");
  let source;
  try { source = JSON.parse(text); } catch { throw new Error("function inventory is not valid JSON"); }
  exactKeys(source, new Set(["format", "module", "textSize", "functions", "gaps", "pools", "unknown"]), "inventory");
  check(source.format === 1, "inventory format must be 1");
  check(typeof source.module === "string" && source.module.length > 0 && source.module.length <= 255
    && !source.module.includes("\0"), "inventory module is invalid");
  check(Number.isSafeInteger(source.textSize) && source.textSize > 0 && source.textSize <= MAX_ELF_SIZE,
    "inventory textSize is invalid");
  for (const key of ["functions", "gaps", "pools"]) check(Array.isArray(source[key]), `inventory ${key} must be an array`);
  if (source.unknown === undefined) source.unknown = [];
  check(Array.isArray(source.unknown), "inventory unknown must be an array");

  const names = new Set();
  const ranges = [];
  function addCode(entries, kind) {
    entries.forEach((entry, index) => {
      exactKeys(entry, kind === "function" ? new Set(["name", "address", "size", "mode"])
        : new Set(["address", "size", "mode"]), `${kind} ${index}`);
      const name = kind === "function" ? entry.name : `__cro_gap_${entry.address?.toString(16).padStart(8, "0")}`;
      if (kind === "function") {
        check(typeof name === "string" && IDENTIFIER.test(name) && !name.startsWith("__cro_"),
          `function ${index} name is invalid or reserved`);
      }
      check(entry.mode === "arm" || entry.mode === "thumb", `${kind} ${index} mode is invalid`);
      const unit = entry.mode === "arm" ? 4 : 2;
      check(Number.isSafeInteger(entry.address) && entry.address >= 0 && entry.address % unit === 0,
        `${kind} ${index} address is misaligned`);
      check(Number.isSafeInteger(entry.size) && entry.size > 0 && entry.size % unit === 0,
        `${kind} ${index} size is misaligned`);
      const end = checkedAdd(entry.address, entry.size, source.textSize, `${kind} ${index} exceeds .text`);
      check(!names.has(name), `duplicate inventory symbol ${name}`);
      names.add(name);
      ranges.push({ kind, name, address: entry.address, size: entry.size, end, mode: entry.mode,
        sectionName: `.text.${name}` });
    });
  }
  addCode(source.functions, "function");
  addCode(source.gaps, "gap");
  source.pools.forEach((entry, index) => {
    exactKeys(entry, new Set(["address", "size"]), `pool ${index}`);
    check(Number.isSafeInteger(entry.address) && entry.address >= 0, `pool ${index} address is invalid`);
    check(Number.isSafeInteger(entry.size) && entry.size > 0, `pool ${index} size is invalid`);
    const end = checkedAdd(entry.address, entry.size, source.textSize, `pool ${index} exceeds .text`);
    const name = `__cro_pool_${entry.address.toString(16).padStart(8, "0")}`;
    check(!names.has(name), `duplicate inventory symbol ${name}`);
    names.add(name);
    ranges.push({ kind: "pool", name, address: entry.address, size: entry.size, end,
      sectionName: `.pool.${name}` });
  });
  source.unknown.forEach((entry, index) => {
    exactKeys(entry, new Set(["address", "size"]), `unknown ${index}`);
    check(Number.isSafeInteger(entry.address) && entry.address >= 0, `unknown ${index} address is invalid`);
    check(Number.isSafeInteger(entry.size) && entry.size > 0, `unknown ${index} size is invalid`);
    const end = checkedAdd(entry.address, entry.size, source.textSize, `unknown ${index} exceeds .text`);
    const name = `__cro_unknown_${entry.address.toString(16).padStart(8, "0")}`;
    check(!names.has(name), `duplicate inventory range ${name}`);
    names.add(name);
    ranges.push({ kind: "unknown", name, address: entry.address, size: entry.size, end,
      sectionName: `.cro.unknown.${entry.address.toString(16).padStart(8, "0")}` });
  });
  ranges.sort((a, b) => a.address - b.address || a.end - b.end || a.name.localeCompare(b.name));
  check(ranges.length > 0, "inventory does not classify .text");
  let cursor = 0;
  for (const range of ranges) {
    check(range.address === cursor, range.address < cursor
      ? `inventory ranges overlap at 0x${range.address.toString(16)}`
      : `inventory leaves an unclassified hole at 0x${cursor.toString(16)}`);
    cursor = range.end;
  }
  check(cursor === source.textSize, `inventory leaves an unclassified hole at 0x${cursor.toString(16)}`);
  return { ...source, ranges };
}

function parseElf(buffer) {
  check(Buffer.isBuffer(buffer) && buffer.length >= 52 && buffer.length <= MAX_ELF_SIZE,
    "structural target must be a bounded ELF file");
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])),
    "structural target must be ELF32 little-endian version 1");
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40,
    "structural target must be ARM ET_REL");
  check(buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(36) === 0x05000000,
    "structural target must use ARM EABI5");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40,
    "structural target has unsupported header sizes");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(count >= 8 && count <= 4096 && shstrndx > 0 && shstrndx < count, "invalid ELF section table");
  checkedAdd(shoff, count * 40, buffer.length, "ELF section table is out of bounds");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    const section = { index, nameOffset: buffer.readUInt32LE(at), type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8), offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), info: buffer.readUInt32LE(at + 28), align: buffer.readUInt32LE(at + 32),
      entsize: buffer.readUInt32LE(at + 36) };
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `section ${index} alignment is invalid`);
    if (section.type !== SHT_NOBITS) checkedAdd(section.offset, section.size, buffer.length, `section ${index} is out of bounds`);
    sections.push(section);
  }
  check(sections[0].type === SHT_NULL, "ELF section zero is not null");
  const shstr = sections[shstrndx];
  check(shstr.type === SHT_STRTAB, "ELF section-name table is invalid");
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size);
  const byName = new Map();
  for (const section of sections) {
    section.name = section.index === 0 ? "" : cstring(names, section.nameOffset, `section ${section.index}`);
    check(!byName.has(section.name), `duplicate ELF section ${section.name}`);
    byName.set(section.name, section);
    section.data = section.type === SHT_NOBITS ? null : buffer.subarray(section.offset, section.offset + section.size);
  }
  for (const name of [".text", ".rodata", ".data", ".bss", ".cro.module", ".symtab", ".strtab", ".shstrtab"])
    check(byName.has(name), `structural target lacks ${name}`);
  const text = byName.get(".text"), rodata = byName.get(".rodata"), data = byName.get(".data"), bss = byName.get(".bss");
  check(text.type === SHT_PROGBITS && text.flags === (SHF_ALLOC | SHF_EXECINSTR), ".text attributes are invalid");
  check(rodata.type === SHT_PROGBITS && rodata.flags === SHF_ALLOC, ".rodata attributes are invalid");
  check(data.type === SHT_PROGBITS && data.flags === (SHF_ALLOC | SHF_WRITE), ".data attributes are invalid");
  check(bss.type === SHT_NOBITS && bss.flags === (SHF_ALLOC | SHF_WRITE), ".bss attributes are invalid");
  const marker = byName.get(".cro.module");
  check(marker.type === SHT_PROGBITS && marker.flags === 0 && marker.size > 1 && marker.data.at(-1) === 0,
    ".cro.module marker is invalid");
  const moduleName = cstring(marker.data, 0, ".cro.module");
  check(Buffer.byteLength(moduleName) + 1 === marker.size && moduleName.length > 0, ".cro.module has trailing data");

  const symtab = byName.get(".symtab");
  check(symtab.type === SHT_SYMTAB && symtab.entsize === 16 && symtab.size % 16 === 0
    && symtab.link < sections.length && sections[symtab.link].type === SHT_STRTAB, "symbol table is invalid");
  const strings = sections[symtab.link].data;
  const symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const at = symtab.offset + index * 16;
    const shndx = buffer.readUInt16LE(at + 14);
    check(shndx < sections.length, `symbol ${index} section is invalid`);
    symbols.push({ index, name: cstring(strings, buffer.readUInt32LE(at), `symbol ${index}`),
      value: buffer.readUInt32LE(at + 4), size: buffer.readUInt32LE(at + 8), info: buffer[at + 12], shndx });
  }
  const relocations = [];
  for (const section of sections) {
    if (section.type === SHT_RELA) throw new Error("RELA relocations are unsupported");
    if (section.type !== SHT_REL) continue;
    check(section.flags === SHF_INFO_LINK && section.entsize === 8 && section.size % 8 === 0
      && section.link === symtab.index && section.info > 0 && section.info < sections.length,
      `${section.name} attributes are invalid`);
    const output = sections[section.info];
    check([text.index, rodata.index, data.index].includes(output.index), `${section.name} output section is unsupported`);
    for (let at = section.offset; at < section.offset + section.size; at += 8) {
      const offset = buffer.readUInt32LE(at), info = buffer.readUInt32LE(at + 4);
      const symbolIndex = info >>> 8, type = info & 0xff;
      check(type === R_ARM_ABS32, `${section.name} contains a non-ABS32 relocation`);
      check(symbolIndex > 0 && symbolIndex < symbols.length, `${section.name} symbol index is invalid`);
      check(offset % 4 === 0 && offset + 4 <= output.size, `${section.name} relocation output is invalid`);
      relocations.push({ output, offset, symbol: symbols[symbolIndex], addend: output.data.readUInt32LE(offset) });
    }
  }
  return { buffer, sections, byName, symbols, relocations, moduleName, text, rodata, data, bss };
}

function parseAuthoredSplitElf(buffer) {
  check(Buffer.isBuffer(buffer) && buffer.length >= 52 && buffer.length <= MAX_ELF_SIZE,
    "authored DllContestCommon object must be a bounded ELF file");
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]))
    && buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40
    && buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(36) === 0x05000000,
  "authored DllContestCommon object must be ELF32 little-endian ARM EABI5 REL");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40,
    "authored DllContestCommon object has unsupported header sizes");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(count > 0 && count <= 4096 && shstrndx > 0 && shstrndx < count,
    "authored DllContestCommon object has an invalid section table");
  checkedAdd(shoff, count * 40, buffer.length, "authored DllContestCommon section table is out of bounds");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    const section = { index, nameOffset: buffer.readUInt32LE(at), type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8), offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), info: buffer.readUInt32LE(at + 28), align: buffer.readUInt32LE(at + 32),
      entsize: buffer.readUInt32LE(at + 36) };
    check(section.align === 0 || (section.align & (section.align - 1)) === 0,
      `authored section ${index} alignment is invalid`);
    if (section.type !== SHT_NOBITS) checkedAdd(section.offset, section.size, buffer.length,
      `authored section ${index} is out of bounds`);
    sections.push(section);
  }
  check(sections[0].type === SHT_NULL, "authored section zero is not null");
  const shstr = sections[shstrndx];
  check(shstr.type === SHT_STRTAB, "authored section-name table is invalid");
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size), byName = new Map();
  for (const section of sections) {
    section.name = section.index === 0 ? "" : cstring(names, section.nameOffset, `authored section ${section.index}`);
    check(!byName.has(section.name), `duplicate authored ELF section ${section.name}`);
    byName.set(section.name, section);
    section.data = section.type === SHT_NOBITS ? null : buffer.subarray(section.offset, section.offset + section.size);
  }
  const symtab = byName.get(".symtab");
  check(symtab?.type === SHT_SYMTAB && symtab.entsize === 16 && symtab.size % 16 === 0
    && symtab.link < sections.length && sections[symtab.link].type === SHT_STRTAB,
  "authored symbol table is invalid");
  const strings = sections[symtab.link].data, symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const at = symtab.offset + index * 16, shndx = buffer.readUInt16LE(at + 14);
    check(shndx < sections.length || shndx >= 0xff00, `authored symbol ${index} section is invalid`);
    symbols.push({ index, name: cstring(strings, buffer.readUInt32LE(at), `authored symbol ${index}`),
      value: buffer.readUInt32LE(at + 4), size: buffer.readUInt32LE(at + 8), info: buffer[at + 12], shndx });
  }
  const relocations = [];
  for (const section of sections) {
    if (section.type === SHT_RELA) throw new Error("authored RELA relocations are unsupported");
    if (section.type !== SHT_REL) continue;
    check(section.flags === SHF_INFO_LINK && section.entsize === 8 && section.size % 8 === 0
      && section.link === symtab.index && section.info > 0 && section.info < sections.length,
    `${section.name} authored relocation metadata is invalid`);
    const output = sections[section.info];
    for (let at = section.offset; at < section.offset + section.size; at += 8) {
      const offset = buffer.readUInt32LE(at), info = buffer.readUInt32LE(at + 4), symbolIndex = info >>> 8;
      check((info & 0xff) === R_ARM_ABS32 && symbolIndex > 0 && symbolIndex < symbols.length,
        `${section.name} contains an unsupported authored relocation`);
      check(offset % 4 === 0 && offset + 4 <= output.size,
        `${section.name} authored relocation output is invalid`);
      relocations.push({ output, offset, symbol: symbols[symbolIndex], addend: output.data.readUInt32LE(offset) });
    }
  }
  return { buffer, sections, byName, symbols, relocations };
}

function symbolBuffer(nameOffset, value, size, info, shndx) {
  const out = Buffer.alloc(16);
  out.writeUInt32LE(nameOffset, 0); out.writeUInt32LE(value >>> 0, 4); out.writeUInt32LE(size, 8);
  out[12] = info; out.writeUInt16LE(shndx, 14); return out;
}

function sectionHeader(section) {
  const out = Buffer.alloc(40);
  out.writeUInt32LE(section.nameOffset, 0); out.writeUInt32LE(section.type, 4);
  out.writeUInt32LE(section.flags, 8); out.writeUInt32LE(section.offset, 16); out.writeUInt32LE(section.size, 20);
  out.writeUInt32LE(section.link ?? 0, 24); out.writeUInt32LE(section.info ?? 0, 28);
  out.writeUInt32LE(section.align ?? 1, 32); out.writeUInt32LE(section.entsize ?? 0, 36); return out;
}

function emitElf(sectionSpecs, globalSpecs, relocationSpecs) {
  const sections = [{ name: "", type: SHT_NULL, flags: 0, align: 0, size: 0, data: Buffer.alloc(0), index: 0 }];
  for (const spec of sectionSpecs) { const section = { ...spec, index: sections.length }; sections.push(section); }
  const contentByKey = new Map(sectionSpecs.map((spec, i) => [spec.key, sections[i + 1]]));
  const relSections = [];
  for (const [key, entries] of relocationSpecs) {
    if (!entries.length) continue;
    const output = contentByKey.get(key); check(output, `missing relocation output ${key}`);
    const rel = { name: `.rel${output.name}`, type: SHT_REL, flags: SHF_INFO_LINK, align: 4, entsize: 8,
      size: entries.length * 8, data: null, info: output.index, entries, index: sections.length };
    sections.push(rel); relSections.push(rel);
  }
  const symtab = { name: ".symtab", type: SHT_SYMTAB, flags: 0, align: 4, entsize: 16, data: null, size: 0,
    index: sections.length }; sections.push(symtab);
  const strtab = { name: ".strtab", type: SHT_STRTAB, flags: 0, align: 1, data: null, size: 0,
    index: sections.length }; sections.push(strtab);
  const shstrtab = { name: ".shstrtab", type: SHT_STRTAB, flags: 0, align: 1, data: null, size: 0,
    index: sections.length }; sections.push(shstrtab);

  const strings = [Buffer.from([0])], offsets = new Map(); let stringSize = 1;
  const intern = value => { if (offsets.has(value)) return offsets.get(value); const at = stringSize;
    const bytes = Buffer.from(`${value}\0`); strings.push(bytes); stringSize += bytes.length; offsets.set(value, at); return at; };
  const symbols = [{ name: "", value: 0, size: 0, info: 0, shndx: 0 }];
  const sectionSymbol = new Map();
  for (const section of sectionSpecs.map(spec => contentByKey.get(spec.key))) {
    sectionSymbol.set(section.key, symbols.length);
    symbols.push({ name: "", value: 0, size: 0, info: STT_SECTION, shndx: section.index });
  }
  for (const section of sectionSpecs.map(spec => contentByKey.get(spec.key))) {
    if (!section.mapping) continue;
    symbols.push({ name: section.mapping, value: 0, size: 0, info: STT_NOTYPE, shndx: section.index });
  }
  const firstGlobal = symbols.length, globals = new Map();
  for (const spec of globalSpecs) {
    check(!globals.has(spec.name), `duplicate output symbol ${spec.name}`);
    const resolved = { ...spec, shndx: spec.key ? contentByKey.get(spec.key).index : 0 };
    globals.set(spec.name, symbols.length); symbols.push(resolved);
  }
  symtab.data = Buffer.concat(symbols.map(s => symbolBuffer(s.name ? intern(s.name) : 0, s.value, s.size, s.info, s.shndx)));
  symtab.size = symtab.data.length; symtab.link = strtab.index; symtab.info = firstGlobal;
  strtab.data = Buffer.concat(strings); strtab.size = strtab.data.length;
  for (const rel of relSections) {
    rel.link = symtab.index; rel.data = Buffer.alloc(rel.size);
    rel.entries.forEach((entry, index) => {
      const symbol = entry.symbolKind === "section" ? sectionSymbol.get(entry.symbolKey) : globals.get(entry.symbolName);
      check(Number.isInteger(symbol), `missing relocation symbol ${entry.symbolName ?? entry.symbolKey}`);
      rel.data.writeUInt32LE(entry.offset, index * 8); rel.data.writeUInt32LE((symbol << 8) | R_ARM_ABS32, index * 8 + 4);
    });
  }
  const sectionStrings = [Buffer.from([0])]; let shstrSize = 1;
  for (const section of sections.slice(1)) { section.nameOffset = shstrSize; const bytes = Buffer.from(`${section.name}\0`);
    sectionStrings.push(bytes); shstrSize += bytes.length; }
  shstrtab.data = Buffer.concat(sectionStrings); shstrtab.size = shstrtab.data.length;
  let cursor = 52;
  for (const section of sections.slice(1)) { cursor = align(cursor, section.align); section.offset = cursor;
    if (section.type !== SHT_NOBITS) { check(section.data?.length === section.size, `${section.name} size mismatch`); cursor += section.size; } }
  const shoff = align(cursor, 4), out = Buffer.alloc(shoff + sections.length * 40);
  out.set([0x7f,0x45,0x4c,0x46,1,1,1]); out.writeUInt16LE(1,16); out.writeUInt16LE(40,18); out.writeUInt32LE(1,20);
  out.writeUInt32LE(shoff,32); out.writeUInt32LE(0x05000000,36); out.writeUInt16LE(52,40); out.writeUInt16LE(40,46);
  out.writeUInt16LE(sections.length,48); out.writeUInt16LE(shstrtab.index,50);
  for (const section of sections.slice(1)) if (section.type !== SHT_NOBITS) section.data.copy(out, section.offset);
  sections.forEach((section, index) => sectionHeader(section).copy(out, shoff + index * 40));
  return out;
}

function findRange(ranges, address, outputWidth = 1) {
  return ranges.find(range => address >= range.address && address + outputWidth <= range.end);
}

function inventoryGlobals(inventory) {
  return inventory.ranges.filter(range => range.kind === "function" || range.kind === "pool").map(range => ({ name: range.name, key: range.name,
    value: range.kind === "pool" ? 0 : range.mode === "thumb" ? 1 : 0, size: range.size,
    info: (STB_GLOBAL << 4) | (range.kind === "pool" ? STT_OBJECT : STT_FUNC) }));
}

export function canonicalizeDllContestCommonBaseElf(authoredBuffer, inventoryInput) {
  const authored = parseAuthoredSplitElf(Buffer.from(authoredBuffer));
  const inventory = parseFunctionInventory(inventoryInput);
  check(inventory.module === "DllContestCommon" && inventory.textSize === 0x368,
    "canonical base emission is restricted to DllContestCommon");
  const expectedRanges = [
    ["gap", 0x000, 0x004], ["pool", 0x004, 0x004], ["gap", 0x008, 0x004], ["pool", 0x00c, 0x004],
    ["gap", 0x010, 0x004], ["pool", 0x014, 0x004], ["gap", 0x018, 0x004], ["pool", 0x01c, 0x004],
    ["gap", 0x020, 0x004], ["pool", 0x024, 0x004], ["gap", 0x028, 0x004], ["pool", 0x02c, 0x004],
    ["function", 0x030, 0x1d8], ["pool", 0x208, 0x004], ["function", 0x20c, 0x04c],
    ["function", 0x258, 0x064], ["gap", 0x2bc, 0x014], ["pool", 0x2d0, 0x014],
    ["gap", 0x2e4, 0x060], ["pool", 0x344, 0x024]
  ];
  check(JSON.stringify(inventory.ranges.map(({ kind, address, size }) => [kind, address, size])) === JSON.stringify(expectedRanges),
    "DllContestCommon public partition differs from the canonical base contract");

  const specs = inventory.ranges.map(range => {
    const source = authored.byName.get(range.sectionName);
    const flags = range.kind === "pool" ? SHF_ALLOC : SHF_ALLOC | SHF_EXECINSTR;
    const alignment = range.kind === "pool" ? 1 : 4;
    check(source?.type === SHT_PROGBITS && source.flags === flags && source.align === alignment && source.size === range.size,
      `${range.sectionName} authored section differs from the canonical contract`);
    return { key: range.name, name: range.sectionName, type: SHT_PROGBITS, flags, align: alignment,
      size: range.size, data: Buffer.from(source.data), mapping: range.kind === "pool" ? "$d" : "$a" };
  });
  for (const [key, flags, size] of [["rodata", SHF_ALLOC, 0x18], ["data", SHF_ALLOC | SHF_WRITE, 0x04]]) {
    const source = authored.byName.get(`.${key}`);
    check(source?.type === SHT_PROGBITS && source.flags === flags && source.align === 4 && source.size === size,
      `.${key} authored section differs from the canonical contract`);
    specs.push({ key, name: `.${key}`, type: SHT_PROGBITS, flags, align: 4, size, data: Buffer.from(source.data), mapping: "$d" });
  }
  const bss = authored.byName.get(".bss");
  check(bss && bss.flags === (SHF_ALLOC | SHF_WRITE) && bss.size === 0, "authored .bss differs from the canonical contract");
  specs.push({ key: "bss", name: ".bss", type: SHT_PROGBITS, flags: SHF_ALLOC | SHF_WRITE,
    align: 4, size: 0, data: Buffer.alloc(0) });
  const marker = Buffer.from("DllContestCommon\0");
  specs.push({ key: "module", name: ".cro.module", type: SHT_PROGBITS, flags: 0, align: 1,
    size: marker.length, data: marker });
  const ownedNames = new Set(specs.map(({ name }) => name));
  check(authored.sections.filter(section => section.flags & SHF_ALLOC)
    .every(section => ownedNames.has(section.name) || (section.name === ".text" && section.size === 0)),
  "authored object contains an unowned allocated section");

  const globals = inventoryGlobals(inventory);
  for (const expected of globals) {
    const sourceSection = authored.byName.get(specs.find(({ key }) => key === expected.key).name);
    check(authored.symbols.filter(symbol => symbol.name === expected.name && symbol.shndx === sourceSection.index
      && symbol.value === expected.value && symbol.size === expected.size && symbol.info === expected.info).length === 1,
    `${expected.name} authored global identity differs`);
  }
  for (let index = 0; index < 6; index++) globals.push({ name: `dll_contest_common_import_${index}`,
    value: 0, size: 0, info: (STB_GLOBAL << 4) | STT_NOTYPE });

  const keyBySection = new Map(specs.map(spec => [spec.name, spec.key]));
  const relocations = new Map(), records = [];
  const addRel = (key, entry) => { if (!relocations.has(key)) relocations.set(key, []); relocations.get(key).push(entry); };
  for (const range of inventory.ranges) {
    const output = authored.byName.get(range.sectionName);
    const entries = authored.relocations.filter(relocation => relocation.output.index === output.index)
      .sort((left, right) => left.offset - right.offset);
    for (const relocation of entries) {
      let target, targetName;
      if (relocation.symbol.shndx === 0) {
        check(/^dll_contest_common_import_[0-5]$/u.test(relocation.symbol.name)
          && relocation.symbol.info === ((STB_GLOBAL << 4) | STT_NOTYPE),
        "authored import relocation does not use a canonical public alias");
        target = { symbolKind: "global", symbolName: relocation.symbol.name };
        targetName = relocation.symbol.name;
      } else if (relocation.symbol.name === "__cro_pool_00000344") {
        check(relocation.symbol.info === ((STB_GLOBAL << 4) | STT_OBJECT) && relocation.symbol.value === 0
          && relocation.symbol.size === 0x24
          && authored.sections[relocation.symbol.shndx]?.name === ".pool.__cro_pool_00000344",
        "authored terminal self-reference does not target the global pool object");
        target = { symbolKind: "global", symbolName: relocation.symbol.name };
        targetName = relocation.symbol.name;
      } else {
        check((relocation.symbol.info & 0xf) === STT_SECTION,
          "authored internal relocation does not target a section identity");
        const targetSection = authored.sections[relocation.symbol.shndx], key = keyBySection.get(targetSection.name);
        check(key, "authored relocation targets an unowned section");
        target = { symbolKind: "section", symbolKey: key };
        targetName = targetSection.name;
      }
      addRel(range.name, { offset: relocation.offset, ...target });
      records.push([range.address + relocation.offset, targetName, relocation.addend]);
    }
  }
  const expectedRecords = [
    [0x004, "dll_contest_common_import_0", 0], [0x00c, "dll_contest_common_import_1", 0],
    [0x014, "dll_contest_common_import_2", 0], [0x01c, "dll_contest_common_import_3", 0],
    [0x024, "dll_contest_common_import_4", 0], [0x02c, "dll_contest_common_import_5", 0],
    [0x208, ".rodata", 0], [0x2d0, ".text.__cro_gap_000002e4", 0],
    [0x2d4, ".text.__cro_gap_000002e4", 8], [0x2d8, ".text.__cro_gap_000002e4", 0x10],
    [0x2dc, ".text.__cro_gap_000002e4", 0x1c], [0x2e0, ".text.__cro_gap_000002e4", 0x2c],
    [0x344, ".data", 0], [0x34c, "__cro_pool_00000344", 0x24],
    [0x350, "__cro_pool_00000344", 0x24], [0x354, ".rodata", 0x18], [0x358, ".rodata", 0x18]
  ];
  check(JSON.stringify(records) === JSON.stringify(expectedRecords),
    "authored relocation schedule differs from the canonical DllContestCommon contract");
  return emitElf(specs, globals, relocations);
}

export function canonicalizeDllContestCommonImports(structural, inventory) {
  const aliases = new Map();
  if (inventory.module !== "DllContestCommon") return aliases;
  check(structural.moduleName === "DllContestCommon", "DllContestCommon alias canonicalization module mismatch");
  const expectedOffsets = [0x004, 0x00c, 0x014, 0x01c, 0x024, 0x02c];
  const undefinedRelocations = structural.relocations.filter(({ symbol }) => symbol.shndx === 0);
  check(undefinedRelocations.length === expectedOffsets.length,
    "DllContestCommon must have exactly six undefined import relocations");
  check(structural.symbols.filter(symbol => symbol.shndx === 0 && (symbol.info >> 4) === STB_GLOBAL).length === 6,
    "DllContestCommon has an unexpected undefined global symbol");
  undefinedRelocations.sort((left, right) => left.offset - right.offset);
  const identities = new Set(), aliasNames = new Set(expectedOffsets.map((_, index) => `dll_contest_common_import_${index}`));
  for (const [index, relocation] of undefinedRelocations.entries()) {
    check(relocation.output.index === structural.text.index && relocation.offset === expectedOffsets[index],
      `DllContestCommon import slot ${index} is not at its public text offset`);
    check((relocation.symbol.info >> 4) === STB_GLOBAL && (relocation.symbol.info & 0xf) === STT_NOTYPE,
      `DllContestCommon import slot ${index} does not target an undefined global NOTYPE symbol`);
    check(!identities.has(relocation.symbol.index), "DllContestCommon import equality classes are not bijective");
    identities.add(relocation.symbol.index);
    aliases.set(relocation.symbol.index, `dll_contest_common_import_${index}`);
  }
  check(!structural.symbols.some((symbol) => !identities.has(symbol.index) && aliasNames.has(symbol.name)),
    "DllContestCommon public import alias collides with an unrelated symbol");
  return aliases;
}

function sectionSpecs(structural, inventory, emptyBase) {
  const specs = inventory.ranges.map(range => ({ key: range.name, name: range.sectionName,
    type: emptyBase ? SHT_NOBITS : SHT_PROGBITS,
    flags: range.kind === "unknown" ? 0 : range.kind === "pool" ? SHF_ALLOC : SHF_ALLOC | SHF_EXECINSTR,
    align: range.kind === "unknown" || range.kind === "pool" ? 1 : range.mode === "arm" ? 4 : 2, size: range.size,
    data: emptyBase ? null : Buffer.from(structural.text.data.subarray(range.address, range.end)),
    mapping: range.kind === "unknown" ? undefined : range.kind === "pool" ? "$d" : range.mode === "arm" ? "$a" : "$t" }));
  for (const [key, source] of [["rodata", structural.rodata], ["data", structural.data]]) specs.push({ key,
    name: `.${key}`, type: emptyBase ? SHT_NOBITS : SHT_PROGBITS,
    flags: key === "data" ? SHF_ALLOC | SHF_WRITE : SHF_ALLOC,
    align: 4, size: source.size, data: emptyBase ? null : Buffer.from(source.data), mapping: "$d" });
  specs.push({ key: "bss", name: ".bss", type: emptyBase ? SHT_NOBITS : SHT_PROGBITS,
    flags: SHF_ALLOC | SHF_WRITE, align: 4,
    // Objdiff awards NOBITS target allocation automatic match credit. The
    // progress target materializes the zero-initialization requirement so its
    // full denominator remains visible; the empty base owns no payload yet.
    size: emptyBase ? 0 : structural.bss.size,
    data: emptyBase ? null : Buffer.alloc(structural.bss.size) });
  const marker = Buffer.from(`${inventory.module}\0`);
  specs.push({ key: "module", name: ".cro.module", type: SHT_PROGBITS, flags: 0, align: 1,
    size: marker.length, data: marker });
  return specs;
}

export function splitCroTargetElf(structuralBuffer, inventoryInput) {
  const structural = parseElf(structuralBuffer), inventory = parseFunctionInventory(inventoryInput);
  check(structural.moduleName === inventory.module, "inventory module does not match structural target");
  check(structural.text.size === inventory.textSize, "inventory textSize does not match structural target");
  const sectionKey = new Map([[structural.rodata.index, "rodata"], [structural.data.index, "data"],
    [structural.bss.index, "bss"], [structural.byName.get(".cro.module").index, "module"]]);
  const importAliases = canonicalizeDllContestCommonImports(structural, inventory);
  const globals = inventoryGlobals(inventory);
  if (importAliases.size) for (let index = 0; index < 6; index++) globals.push({
    name: `dll_contest_common_import_${index}`, value: 0, size: 0, info: (STB_GLOBAL << 4) | STT_NOTYPE
  });
  const names = new Set(globals.map(s => s.name));
  const oldGlobal = new Map();
  for (const symbol of structural.symbols) {
    if ((symbol.info >> 4) !== STB_GLOBAL) continue;
    if (symbol.shndx === structural.text.index) {
      const logical = symbol.value & ~1, range = findRange(inventory.ranges, logical);
      check(range, `defined text symbol ${symbol.name} is outside the inventory`);
      const replacement = range.kind === "function" || range.kind === "pool"
        ? { symbolKind: "global", symbolName: range.name,
          value: range.kind === "function" && range.mode === "thumb" ? 1 : 0 }
        : { symbolKind: "section", symbolKey: range.name, value: 0 };
      const oldValue = ((logical - range.address) | (symbol.value & 1)) >>> 0;
      oldGlobal.set(symbol.index, { ...replacement, addendDelta: (oldValue - replacement.value) >>> 0 });
      continue;
    }
    if (symbol.shndx !== 0) {
      const key = sectionKey.get(symbol.shndx); check(key, `defined symbol ${symbol.name} uses unsupported section`);
      oldGlobal.set(symbol.index, { symbolKind: "section", symbolKey: key, addendDelta: symbol.value });
      continue;
    }
    const spec = { name: importAliases.get(symbol.index) ?? symbol.name, value: 0, size: symbol.size, info: symbol.info };
    if (!names.has(spec.name)) { names.add(spec.name); globals.push(spec); }
    else {
      const existing = globals.find(item => item.name === spec.name);
      check(existing.key === spec.key && existing.value === spec.value && existing.size === spec.size && existing.info === spec.info,
        `inventory conflicts with symbol ${spec.name}`);
    }
    oldGlobal.set(symbol.index, { symbolKind: "global", symbolName: spec.name, addendDelta: 0 });
  }
  const relocations = new Map();
  function addRel(key, entry) { if (!relocations.has(key)) relocations.set(key, []); relocations.get(key).push(entry); }
  const sectionSymbolByIndex = new Map();
  for (const symbol of structural.symbols) if ((symbol.info & 0xf) === STT_SECTION) sectionSymbolByIndex.set(symbol.index, symbol.shndx);
  const mutableData = new Map(sectionSpecs(structural, inventory, false).map(spec => [spec.key, spec.data]));
  for (const relocation of structural.relocations) {
    let outputKey, outputOffset;
    if (relocation.output.index === structural.text.index) {
      const range = findRange(inventory.ranges, relocation.offset, 4);
      check(range, `text relocation at 0x${relocation.offset.toString(16)} crosses an inventory boundary`);
      check(range.kind !== "unknown", `text relocation at 0x${relocation.offset.toString(16)} cannot remain unknown`);
      outputKey = range.name; outputOffset = relocation.offset - range.address;
    } else { outputKey = sectionKey.get(relocation.output.index); outputOffset = relocation.offset; }
    let target, addend = relocation.addend;
    const targetSection = sectionSymbolByIndex.get(relocation.symbol.index);
    if (targetSection === structural.text.index) {
      const logical = addend & ~1;
      let range = findRange(inventory.ranges, logical);
      if (!range) range = addend >= 0x80000000 ? inventory.ranges[0] : inventory.ranges.at(-1);
      const base = range.address + (range.kind !== "pool" && range.mode === "thumb" ? 1 : 0);
      addend = (addend - base) >>> 0;
      target = range.kind === "unknown" || range.kind === "gap" ? { symbolKind: "section", symbolKey: range.name }
        : { symbolKind: "global", symbolName: range.name };
    } else if (targetSection !== undefined) {
      const key = sectionKey.get(targetSection); check(key, "relocation targets an unsupported section symbol");
      target = { symbolKind: "section", symbolKey: key };
    } else {
      const replacement = oldGlobal.get(relocation.symbol.index);
      check(replacement, "relocation targets an unsupported local symbol");
      addend = (addend + replacement.addendDelta) >>> 0;
      target = replacement.symbolKind === "global"
        ? { symbolKind: "global", symbolName: replacement.symbolName }
        : { symbolKind: "section", symbolKey: replacement.symbolKey };
    }
    mutableData.get(outputKey).writeUInt32LE(addend, outputOffset);
    addRel(outputKey, { offset: outputOffset, ...target });
  }
  const targetSpecs = sectionSpecs(structural, inventory, false);
  for (const spec of targetSpecs) if (mutableData.has(spec.key)) spec.data = mutableData.get(spec.key);
  for (const entries of relocations.values()) entries.sort((a,b) => a.offset - b.offset);
  const orderedRelocations = inventory.module === "DllContestCommon"
    ? new Map(inventory.ranges.filter(range => relocations.has(range.name)).map(range => [range.name, relocations.get(range.name)]))
    : relocations;
  check(inventory.module !== "DllContestCommon" || orderedRelocations.size === relocations.size,
    "DllContestCommon has a relocation outside its public text partition");
  const target = emitElf(targetSpecs, globals, orderedRelocations);
  const base = emitElf(sectionSpecs(structural, inventory, true), globals, new Map());
  return { target, base, inventory };
}

function isInside(parent, candidate) { const rel = relative(parent, candidate);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(rel)); }
function writeAll(fd, buffer) { let at = 0; while (at < buffer.length) at += writeSync(fd, buffer, at, buffer.length - at); }
function safeOutput(path, payload) {
  const output = resolve(path); mkdirSync(dirname(output), { recursive: true }); const parent = realpathSync(dirname(output));
  check(isInside(parent, output), "output path escapes its resolved parent");
  if (existsSync(output)) check(!lstatSync(output).isSymbolicLink(), "refusing to overwrite an output symlink");
  if (isInside(ROOT, output)) check(spawnSync("git", ["check-ignore", "-q", "--no-index", "--", output], { cwd: ROOT }).status === 0,
    "generated object path inside the repository must be ignored by Git");
  const temporary = `${output}.tmp-${process.pid}`; const fd = openSync(temporary, "wx", 0o600);
  try { writeAll(fd, payload); closeSync(fd); renameSync(temporary, output); }
  catch (error) { try { closeSync(fd); } catch {} try { unlinkSync(temporary); } catch {} throw error; }
}

function main() {
  const args = process.argv.slice(2);
  check(args.length === 4, "usage: split-cro-target-object.mjs <structural-target.o> <inventory.json> <split-target.o> <empty-base.o>");
  const structuralPath = realpathSync(resolve(args[0])), inventoryPath = realpathSync(resolve(args[1]));
  for (const [path, limit, label] of [[structuralPath, MAX_ELF_SIZE, "structural target"], [inventoryPath, MAX_INVENTORY_SIZE, "inventory"]]) {
    const stat = statSync(path); check(stat.isFile() && stat.size <= limit, `${label} is not a bounded regular file`);
  }
  check(!isInside(ROOT, structuralPath) || spawnSync("git", ["check-ignore", "-q", "--no-index", "--", structuralPath], { cwd: ROOT }).status === 0,
    "structural target inside the repository must be ignored by Git");
  const result = splitCroTargetElf(readFileSync(structuralPath), readFileSync(inventoryPath));
  const targetPath = resolve(args[2]), basePath = resolve(args[3]);
  check(targetPath !== basePath, "target and base output paths must differ");
  check(![structuralPath, inventoryPath].includes(targetPath)
    && ![structuralPath, inventoryPath].includes(basePath), "outputs must not overwrite inputs");
  safeOutput(args[2], result.target); safeOutput(args[3], result.base);
  console.log(`Split ${result.inventory.module}: ${result.inventory.functions.length} functions, ${result.inventory.gaps.length} gaps, ${result.inventory.pools.length} pools, ${result.inventory.unknown.length} unknown ranges`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
