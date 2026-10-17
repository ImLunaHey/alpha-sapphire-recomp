import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { convertCroToElf, parseCro } from "./generate-cro-target-object.mjs";

const TABLE = {
  code: 0,
  data: 1,
  moduleName: 2,
  segments: 3,
  namedExports: 4,
  indexedExports: 5,
  exportStrings: 6,
  exportTree: 7,
  importModules: 8,
  importPatches: 9,
  namedImports: 10,
  indexedImports: 11,
  anonymousImports: 12,
  importStrings: 13,
  unknown14: 14,
  internalRelocations: 15,
  unknown16: 16,
};

function align(value, alignment) {
  return value + ((alignment - (value % alignment)) % alignment);
}

function tableOffset(buffer, index) {
  return buffer.readUInt32LE(0xb0 + index * 8);
}

function tableCount(buffer, index) {
  return buffer.readUInt32LE(0xb4 + index * 8);
}

function setTable(buffer, index, offset, count) {
  buffer.writeUInt32LE(offset, 0xb0 + index * 8);
  buffer.writeUInt32LE(count, 0xb4 + index * 8);
}

function packed(segment, offset) {
  return ((offset << 4) | segment) >>> 0;
}

function writePatch(buffer, offset, outputSegment, outputOffset, type, byte5, addend) {
  buffer.writeUInt32LE(packed(outputSegment, outputOffset), offset);
  buffer[offset + 4] = type;
  buffer[offset + 5] = byte5;
  buffer[offset + 6] = 0;
  buffer[offset + 7] = 0;
  buffer.writeUInt32LE(addend >>> 0, offset + 8);
}

function digest(buffer, start, end) {
  return createHash("sha256").update(buffer.subarray(start, end)).digest();
}

function rehash(buffer) {
  const code = tableOffset(buffer, TABLE.code);
  const moduleName = tableOffset(buffer, TABLE.moduleName);
  const data = tableOffset(buffer, TABLE.data);
  const dataEnd = data + tableCount(buffer, TABLE.data);
  for (const [index, start, end] of [
    [0, 0x80, code],
    [1, code, moduleName],
    [2, moduleName, data],
    [3, data, dataEnd],
  ]) digest(buffer, start, end).copy(buffer, index * 32);
  return buffer;
}

function makeCro() {
  const codeOffset = 0x140;
  const moduleOffset = 0x1c0;
  let cursor = moduleOffset;
  const entries = {};
  function bytes(name, value) {
    cursor = align(cursor, 4);
    const payload = Buffer.from(value);
    entries[name] = { offset: cursor, count: payload.length, payload };
    cursor += payload.length;
  }
  function records(name, count, size) {
    cursor = align(cursor, 4);
    entries[name] = { offset: cursor, count, payload: Buffer.alloc(count * size) };
    cursor += count * size;
  }

  bytes("moduleName", Buffer.from("TestCro\0"));
  records("segments", 4, 12);
  records("namedExports", 1, 8);
  records("indexedExports", 1, 4);
  bytes("exportStrings", Buffer.from("entry\0"));
  records("exportTree", 1, 8);
  records("importModules", 1, 20);
  records("importPatches", 3, 12);
  records("namedImports", 1, 8);
  records("indexedImports", 1, 8);
  records("anonymousImports", 1, 8);
  bytes("importStrings", Buffer.from("dep\0named\0"));
  entries.unknown14 = { offset: align(cursor, 4), count: 0, payload: Buffer.alloc(0) };
  cursor = entries.unknown14.offset;
  records("internalRelocations", 2, 12);
  entries.unknown16 = { offset: align(cursor, 4), count: 0, payload: Buffer.alloc(0) };
  cursor = entries.unknown16.offset;
  const dataOffset = align(cursor + 0x20, 0x10);
  const fileSize = align(dataOffset + 0x10, 0x20);
  const cro = Buffer.alloc(fileSize, 0xcc);
  cro.fill(0, 0, 0x140);
  cro.write("CRO0", 0x80, "ascii");
  cro.writeUInt32LE(entries.moduleName.offset, 0x84);
  cro.writeUInt32LE(fileSize, 0x90);
  cro.writeUInt32LE(0x20, 0x94);
  cro.fill(0xff, 0xa0, 0xb0);

  setTable(cro, TABLE.code, codeOffset, moduleOffset - codeOffset);
  setTable(cro, TABLE.data, dataOffset, 0x10);
  for (const [name, index] of Object.entries(TABLE).slice(2)) {
    const entry = entries[name];
    setTable(cro, index, entry.offset, entry.count);
    entry.payload.copy(cro, entry.offset);
  }

  cro.fill(0xa5, codeOffset, moduleOffset);
  cro.fill(0x5a, dataOffset, dataOffset + 0x10);
  for (const [segment, offset, size, type] of [
    [0, codeOffset, 0x40, 0],
    [1, codeOffset + 0x40, 0x20, 1],
    [2, dataOffset, 0x10, 2],
    [3, 0, 0x10, 3],
  ]) {
    const at = entries.segments.offset + segment * 12;
    cro.writeUInt32LE(offset, at);
    cro.writeUInt32LE(size, at + 4);
    cro.writeUInt32LE(type, at + 8);
  }

  const exportString = entries.exportStrings.offset;
  cro.writeUInt32LE(exportString, entries.namedExports.offset);
  cro.writeUInt32LE(packed(0, 0), entries.namedExports.offset + 4);
  cro.writeUInt32LE(packed(0, 4), entries.indexedExports.offset);

  const importString = entries.importStrings.offset;
  const namedString = importString + 4;
  const patch = entries.importPatches.offset;
  cro.writeUInt32LE(importString, entries.importModules.offset);
  cro.writeUInt32LE(entries.indexedImports.offset, entries.importModules.offset + 4);
  cro.writeUInt32LE(1, entries.importModules.offset + 8);
  cro.writeUInt32LE(entries.anonymousImports.offset, entries.importModules.offset + 12);
  cro.writeUInt32LE(1, entries.importModules.offset + 16);
  cro.writeUInt32LE(namedString, entries.namedImports.offset);
  cro.writeUInt32LE(patch, entries.namedImports.offset + 4);
  cro.writeUInt32LE(7, entries.indexedImports.offset);
  cro.writeUInt32LE(patch + 12, entries.indexedImports.offset + 4);
  cro.writeUInt32LE(packed(0, 0x10), entries.anonymousImports.offset);
  cro.writeUInt32LE(patch + 24, entries.anonymousImports.offset + 4);
  writePatch(cro, patch, 0, 8, 2, 1, 0);
  writePatch(cro, patch + 12, 1, 0, 2, 1, 4);
  writePatch(cro, patch + 24, 2, 0, 2, 1, 8);

  const internal = entries.internalRelocations.offset;
  writePatch(cro, internal, 0, 12, 2, 1, 0xfffffff4);
  writePatch(cro, internal + 12, 1, 4, 2, 3, 0x10);
  for (const [segment, offset] of [[0, 8], [0, 12], [1, 0], [1, 4], [2, 0]]) {
    const segmentFile = segment === 0 ? codeOffset : segment === 1 ? codeOffset + 0x40 : dataOffset;
    cro.writeUInt32LE(0, segmentFile + offset);
  }
  return { cro: rehash(cro), entries, codeOffset, dataOffset };
}

function cstring(buffer, offset) {
  let end = offset;
  while (end < buffer.length && buffer[end] !== 0) end++;
  return buffer.toString("utf8", offset, end);
}

function parseElf(buffer) {
  assert.equal(buffer.toString("ascii", 1, 4), "ELF");
  assert.equal(buffer.readUInt16LE(16), 1);
  assert.equal(buffer.readUInt16LE(18), 40);
  const shoff = buffer.readUInt32LE(32);
  const count = buffer.readUInt16LE(48);
  const shstrndx = buffer.readUInt16LE(50);
  const raw = [];
  for (let index = 0; index < count; index++) {
    const offset = shoff + index * 40;
    raw.push({
      index,
      nameOffset: buffer.readUInt32LE(offset),
      type: buffer.readUInt32LE(offset + 4),
      flags: buffer.readUInt32LE(offset + 8),
      offset: buffer.readUInt32LE(offset + 16),
      size: buffer.readUInt32LE(offset + 20),
      link: buffer.readUInt32LE(offset + 24),
      info: buffer.readUInt32LE(offset + 28),
      align: buffer.readUInt32LE(offset + 32),
      entsize: buffer.readUInt32LE(offset + 36),
    });
  }
  const names = buffer.subarray(raw[shstrndx].offset, raw[shstrndx].offset + raw[shstrndx].size);
  for (const section of raw) section.name = cstring(names, section.nameOffset);
  const byName = new Map(raw.map((section) => [section.name, section]));
  const symtab = byName.get(".symtab");
  const strings = buffer.subarray(raw[symtab.link].offset, raw[symtab.link].offset + raw[symtab.link].size);
  const symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const offset = symtab.offset + index * 16;
    symbols.push({
      index,
      name: cstring(strings, buffer.readUInt32LE(offset)),
      value: buffer.readUInt32LE(offset + 4),
      size: buffer.readUInt32LE(offset + 8),
      info: buffer[offset + 12],
      shndx: buffer.readUInt16LE(offset + 14),
    });
  }
  const relocations = [];
  for (const section of raw.filter((entry) => entry.type === 9)) {
    for (let index = 0; index < section.size / 8; index++) {
      const offset = section.offset + index * 8;
      const info = buffer.readUInt32LE(offset + 4);
      relocations.push({ section: section.name, offset: buffer.readUInt32LE(offset),
        symbol: info >>> 8, type: info & 0xff });
    }
  }
  return { raw, byName, symtab, symbols, relocations };
}

function expectFailure(label, mutate, pattern, { hash = true } = {}) {
  const { cro } = makeCro();
  const copy = Buffer.from(cro);
  mutate(copy);
  if (hash) rehash(copy);
  assert.throws(() => parseCro(copy), pattern, label);
}

function selfTest() {
  const { cro, codeOffset, dataOffset } = makeCro();
  const original = Buffer.from(cro);
  const first = convertCroToElf(cro);
  const second = convertCroToElf(cro);
  assert.deepEqual(cro, original, "conversion mutated the CRO input");
  assert.deepEqual(first.elf, second.elf, "conversion is not deterministic");
  assert.equal(first.parsed.moduleName, "TestCro");
  assert.equal(first.parsed.importRelocationCount, 3);
  assert.equal(first.parsed.internalRelocationCount, 2);

  const elf = parseElf(first.elf);
  for (const [name, type, flags, size] of [
    [".text", 1, 6, 0x40], [".rodata", 1, 2, 0x20],
    [".data", 1, 3, 0x10], [".bss", 8, 3, 0x10],
  ]) {
    const section = elf.byName.get(name);
    assert.deepEqual([section.type, section.flags, section.size, section.align], [type, flags, size, 4]);
  }
  assert.equal(elf.relocations.length, 5);
  assert.ok(elf.relocations.every((entry) => entry.type === 2));
  assert.deepEqual(elf.relocations.map((entry) => [entry.section, entry.offset]), [
    [".rel.text", 8], [".rel.text", 12], [".rel.rodata", 0], [".rel.rodata", 4], [".rel.data", 0],
  ]);
  const text = elf.byName.get(".text");
  const rodata = elf.byName.get(".rodata");
  const data = elf.byName.get(".data");
  assert.equal(first.elf.readUInt32LE(text.offset + 8), 0);
  assert.equal(first.elf.readUInt32LE(text.offset + 12), 0xfffffff4);
  assert.equal(first.elf.readUInt32LE(rodata.offset), 4);
  assert.equal(first.elf.readUInt32LE(rodata.offset + 4), 0x10);
  assert.equal(first.elf.readUInt32LE(data.offset), 8);
  assert.equal(first.elf.subarray(text.offset, text.offset + 8).equals(cro.subarray(codeOffset, codeOffset + 8)), true);
  assert.equal(first.elf.subarray(data.offset + 4, data.offset + 0x10)
    .equals(cro.subarray(dataOffset + 4, dataOffset + 0x10)), true);
  // Reversing each REL slot to the CRO's canonical unresolved zero must
  // reproduce every file-backed segment byte for byte. This catches dropped
  // padding, misplaced section data and addends written at the wrong offset.
  for (const [name, sourceOffset, size] of [
    [".text", codeOffset, 0x40], [".rodata", codeOffset + 0x40, 0x20], [".data", dataOffset, 0x10],
  ]) {
    const section = elf.byName.get(name);
    const rebuilt = Buffer.from(first.elf.subarray(section.offset, section.offset + section.size));
    for (const relocation of elf.relocations.filter((entry) => entry.section === `.rel${name}`)) {
      rebuilt.writeUInt32LE(0, relocation.offset);
    }
    assert.deepEqual(rebuilt, cro.subarray(sourceOffset, sourceOffset + size), `${name} REL reversal differs from CRO`);
  }
  const relocationSymbols = elf.relocations.map((entry) => elf.symbols[entry.symbol]);
  assert.equal(relocationSymbols.filter((symbol) => (symbol.info & 0xf) === 3 && symbol.shndx !== 0).length, 2,
    "internal CRO relocations must target ELF section symbols");
  assert.equal(relocationSymbols.filter((symbol) => symbol.shndx === 0).length, 3,
    "import CRO relocations must target undefined ELF symbols");
  const defined = elf.symbols.filter((symbol) => symbol.name && symbol.shndx !== 0).map((symbol) => symbol.name);
  const undefinedNames = elf.symbols.filter((symbol) => symbol.name && symbol.shndx === 0).map((symbol) => symbol.name);
  assert.deepEqual(defined.sort(), ["__cro_export_index_0000", "entry"]);
  assert.equal(undefinedNames.length, 3);
  assert.ok(undefinedNames.includes("named"));
  assert.ok(undefinedNames.some((name) => name.startsWith("__cro_import_indexed_m646570_")));
  assert.ok(undefinedNames.some((name) => name.startsWith("__cro_import_anon_m646570_")));

  expectFailure("magic", (b) => b.write("BAD!", 0x80, "ascii"), /magic/, { hash: false });
  expectFailure("hash", (b) => { b[codeOffset + 1] ^= 1; }, /hash region 1/, { hash: false });
  expectFailure("table count cap", (b) => b.writeUInt32LE(0x100001, 0xb4 + TABLE.segments * 8), /count exceeds/);
  expectFailure("segment id", (b) => {
    const table = tableOffset(b, TABLE.segments); b.writeUInt32LE(4, table + 3 * 12 + 8);
  }, /reserved BSS segment/);
  expectFailure("segment overlap", (b) => {
    const table = tableOffset(b, TABLE.segments); b.writeUInt32LE(codeOffset + 0x20, table + 12);
  }, /overlaps/);
  expectFailure("data geometry", (b) => {
    const table = tableOffset(b, TABLE.segments); b.writeUInt32LE(8, table + 2 * 12 + 4);
  }, /data segment differs/);
  expectFailure("small bss", (b) => b.writeUInt32LE(8, 0x94), /BSS allocation/);
  expectFailure("unsupported import type", (b) => { b[tableOffset(b, TABLE.importPatches) + 4] = 3; }, /unsupported CRO relocation type 3/);
  expectFailure("unsupported internal type", (b) => { b[tableOffset(b, TABLE.internalRelocations) + 4] = 10; }, /unsupported CRO relocation type 10/);
  expectFailure("nonzero slot", (b) => b.writeUInt32LE(1, codeOffset + 8), /already resolved/);
  expectFailure("unaligned output", (b) => b.writeUInt32LE(packed(0, 2), tableOffset(b, TABLE.importPatches)), /not 4-byte aligned/);
  expectFailure("output overflow", (b) => b.writeUInt32LE(packed(0, 0x40), tableOffset(b, TABLE.importPatches)), /exceeds its segment/);
  expectFailure("bss output", (b) => b.writeUInt32LE(packed(3, 0), tableOffset(b, TABLE.importPatches)), /cannot address NOBITS/);
  expectFailure("duplicate output", (b) => b.writeUInt32LE(packed(0, 8), tableOffset(b, TABLE.internalRelocations)), /same output word/);
  expectFailure("bad target", (b) => { b[tableOffset(b, TABLE.internalRelocations) + 5] = 9; }, /invalid target segment/);
  expectFailure("overlapping lists", (b) => {
    const namedHead = b.readUInt32LE(tableOffset(b, TABLE.namedImports) + 4);
    b.writeUInt32LE(namedHead, tableOffset(b, TABLE.indexedImports) + 4);
  }, /patch list overlaps/);
  expectFailure("unterminated list", (b) => { b[tableOffset(b, TABLE.importPatches) + 24 + 5] = 0; }, /unterminated/);
  expectFailure("reserved byte", (b) => { b[tableOffset(b, TABLE.importPatches) + 6] = 1; }, /reserved bytes/);
  expectFailure("bad UTF-8", (b) => { b[tableOffset(b, TABLE.importStrings)] = 0xff; }, /valid UTF-8/);
  expectFailure("auxiliary relocation table", (b) => {
    const free = tableOffset(b, TABLE.data) - 8;
    setTable(b, TABLE.unknown14, free, 1);
  }, /auxiliary relocation tables/);

  process.stdout.write("cro-target-object self-test: ok (segments, exports, three import identities, five R_ARM_ABS32 relocations, deterministic ELF, 20 hostile cases)\n");
}

function main() {
  assert.deepEqual(process.argv.slice(2), ["--self-test"],
    "usage: validate-cro-target-object.mjs --self-test");
  selfTest();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
