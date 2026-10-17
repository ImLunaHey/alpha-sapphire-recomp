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
  exactKeys(source, new Set(["format", "module", "textSize", "functions", "gaps", "pools"]), "inventory");
  check(source.format === 1, "inventory format must be 1");
  check(typeof source.module === "string" && source.module.length > 0 && source.module.length <= 255
    && !source.module.includes("\0"), "inventory module is invalid");
  check(Number.isSafeInteger(source.textSize) && source.textSize > 0 && source.textSize <= MAX_ELF_SIZE,
    "inventory textSize is invalid");
  for (const key of ["functions", "gaps", "pools"]) check(Array.isArray(source[key]), `inventory ${key} must be an array`);

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
    check(Number.isSafeInteger(entry.address) && entry.address >= 0 && entry.address % 2 === 0,
      `pool ${index} address is misaligned`);
    check(Number.isSafeInteger(entry.size) && entry.size > 0 && entry.size % 2 === 0,
      `pool ${index} size is misaligned`);
    const end = checkedAdd(entry.address, entry.size, source.textSize, `pool ${index} exceeds .text`);
    const name = `__cro_pool_${entry.address.toString(16).padStart(8, "0")}`;
    check(!names.has(name), `duplicate inventory symbol ${name}`);
    names.add(name);
    ranges.push({ kind: "pool", name, address: entry.address, size: entry.size, end,
      sectionName: `.pool.${name}` });
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
  const sections = [{ name: "", type: SHT_NULL, flags: 0, align: 1, size: 0, data: Buffer.alloc(0), index: 0 }];
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
  return inventory.ranges.map(range => ({ name: range.name, key: range.name,
    value: range.kind === "pool" ? 0 : range.mode === "thumb" ? 1 : 0, size: range.size,
    info: (STB_GLOBAL << 4) | (range.kind === "pool" ? STT_OBJECT : STT_FUNC) }));
}

function sectionSpecs(structural, inventory, zero) {
  const specs = inventory.ranges.map(range => ({ key: range.name, name: range.sectionName, type: SHT_PROGBITS,
    flags: range.kind === "pool" ? SHF_ALLOC : SHF_ALLOC | SHF_EXECINSTR,
    align: range.kind === "pool" ? 2 : range.mode === "arm" ? 4 : 2, size: range.size,
    data: zero ? Buffer.alloc(range.size) : Buffer.from(structural.text.data.subarray(range.address, range.end)),
    mapping: range.kind === "pool" ? "$d" : range.mode === "arm" ? "$a" : "$t" }));
  for (const [key, source] of [["rodata", structural.rodata], ["data", structural.data]]) specs.push({ key,
    name: `.${key}`, type: SHT_PROGBITS, flags: key === "data" ? SHF_ALLOC | SHF_WRITE : SHF_ALLOC,
    align: 4, size: source.size, data: zero ? Buffer.alloc(source.size) : Buffer.from(source.data), mapping: "$d" });
  specs.push({ key: "bss", name: ".bss", type: SHT_NOBITS, flags: SHF_ALLOC | SHF_WRITE, align: 4,
    size: structural.bss.size, data: null });
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
  const globals = inventoryGlobals(inventory), names = new Set(globals.map(s => s.name));
  const oldGlobal = new Map();
  for (const symbol of structural.symbols) {
    if ((symbol.info >> 4) !== STB_GLOBAL) continue;
    let spec;
    if (symbol.shndx === 0) spec = { name: symbol.name, value: 0, size: symbol.size, info: symbol.info };
    else if (symbol.shndx === structural.text.index) {
      const logical = symbol.value & ~1, range = findRange(inventory.ranges, logical);
      check(range, `text symbol ${symbol.name} is outside the inventory`);
      spec = { name: symbol.name, key: range.name, value: ((logical - range.address) | (symbol.value & 1)) >>> 0,
        size: symbol.size, info: symbol.info };
    } else {
      const key = sectionKey.get(symbol.shndx); check(key, `symbol ${symbol.name} uses unsupported section`);
      spec = { name: symbol.name, key, value: symbol.value, size: symbol.size, info: symbol.info };
    }
    if (!names.has(spec.name)) { names.add(spec.name); globals.push(spec); }
    else {
      const existing = globals.find(item => item.name === spec.name);
      check(existing.key === spec.key && existing.value === spec.value, `inventory conflicts with symbol ${spec.name}`);
    }
    oldGlobal.set(symbol.index, spec.name);
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
      target = { symbolKind: "global", symbolName: range.name };
    } else if (targetSection !== undefined) {
      const key = sectionKey.get(targetSection); check(key, "relocation targets an unsupported section symbol");
      target = { symbolKind: "section", symbolKey: key };
    } else {
      const name = oldGlobal.get(relocation.symbol.index); check(name, "relocation targets an unsupported local symbol");
      target = { symbolKind: "global", symbolName: name };
    }
    mutableData.get(outputKey).writeUInt32LE(addend, outputOffset);
    addRel(outputKey, { offset: outputOffset, ...target });
  }
  const targetSpecs = sectionSpecs(structural, inventory, false);
  for (const spec of targetSpecs) if (mutableData.has(spec.key)) spec.data = mutableData.get(spec.key);
  for (const entries of relocations.values()) entries.sort((a,b) => a.offset - b.offset);
  const target = emitElf(targetSpecs, globals, relocations);
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
  console.log(`Split ${result.inventory.module}: ${result.inventory.functions.length} functions, ${result.inventory.gaps.length} gaps, ${result.inventory.pools.length} pools`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
