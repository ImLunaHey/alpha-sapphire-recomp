#!/usr/bin/env node

import assert from "node:assert/strict";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { convertCroToElf } from "./generate-cro-target-object.mjs";
import { makeCro } from "./validate-cro-target-object.mjs";
import { parseFunctionInventory, splitCroTargetElf } from "./split-cro-target-object.mjs";

function cstring(buffer, offset) {
  const end = buffer.indexOf(0, offset);
  assert.ok(end >= 0);
  return buffer.toString("utf8", offset, end);
}

function parseElf(buffer) {
  assert.equal(buffer.toString("ascii", 1, 4), "ELF");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    sections.push({ index, nameOffset: buffer.readUInt32LE(at), type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8), offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), info: buffer.readUInt32LE(at + 28), entsize: buffer.readUInt32LE(at + 36) });
  }
  const shstr = sections[shstrndx], names = buffer.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = section.index ? cstring(names, section.nameOffset) : "";
  const byName = new Map(sections.map(section => [section.name, section]));
  const symtab = byName.get(".symtab"), stringsSection = sections[symtab.link];
  const strings = buffer.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const at = symtab.offset + index * 16;
    symbols.push({ index, name: cstring(strings, buffer.readUInt32LE(at)), value: buffer.readUInt32LE(at + 4),
      size: buffer.readUInt32LE(at + 8), info: buffer[at + 12], shndx: buffer.readUInt16LE(at + 14) });
  }
  const relocs = [];
  for (const section of sections.filter(section => section.type === 9)) {
    for (let at = section.offset; at < section.offset + section.size; at += 8) {
      const info = buffer.readUInt32LE(at + 4);
      relocs.push({ section: section.name, offset: buffer.readUInt32LE(at), symbol: info >>> 8, type: info & 0xff });
    }
  }
  return { buffer, sections, byName, symbols, relocs };
}

export function fixture() {
  const structural = Buffer.from(convertCroToElf(makeCro().cro).elf);
  const elf = parseElf(structural), text = elf.byName.get(".text"), rodata = elf.byName.get(".rodata");
  const relText = elf.byName.get(".rel.text"), relRodata = elf.byName.get(".rel.rodata");
  const textSectionSymbol = elf.symbols.find(symbol => (symbol.info & 0xf) === 3 && symbol.shndx === text.index);
  structural.writeUInt32LE(0x19, text.offset + 12);
  structural.writeUInt32LE((textSectionSymbol.index << 8) | 2, relText.offset + 8 + 4);
  structural.writeUInt32LE(0x40, rodata.offset);
  structural.writeUInt32LE((textSectionSymbol.index << 8) | 2, relRodata.offset + 4);
  structural.writeUInt32LE(0xfffffff4, rodata.offset + 4);
  structural.writeUInt32LE((textSectionSymbol.index << 8) | 2, relRodata.offset + 8 + 4);
  const inventory = {
    format: 1, module: "TestCro", textSize: 0x40,
    functions: [
      { name: "arm_func", address: 0, size: 8, mode: "arm" },
      { name: "thumb_func", address: 0x18, size: 8, mode: "thumb" },
    ],
    gaps: [
      { address: 8, size: 8, mode: "arm" },
      { address: 0x20, size: 0x10, mode: "thumb" },
    ],
    pools: [{ address: 0x10, size: 7 }],
    unknown: [{ address: 0x17, size: 1 }, { address: 0x30, size: 0x10 }],
  };
  return { structural, inventory };
}

function expectInventoryFailure(label, mutate, pattern) {
  const { inventory } = fixture();
  mutate(inventory);
  assert.throws(() => parseFunctionInventory(JSON.stringify(inventory)), pattern, label);
}

function selfTest() {
  const { structural, inventory } = fixture(), inventoryJson = JSON.stringify(inventory);
  const first = splitCroTargetElf(structural, inventoryJson), second = splitCroTargetElf(structural, inventoryJson);
  assert.deepEqual(first.target, second.target, "split target is not deterministic");
  assert.deepEqual(first.base, second.base, "base skeleton is not deterministic");
  const source = parseElf(structural), target = parseElf(first.target), base = parseElf(first.base);

  const ranges = first.inventory.ranges;
  const rebuilt = Buffer.concat(ranges.map(range => {
    const section = target.byName.get(range.sectionName);
    return first.target.subarray(section.offset, section.offset + section.size);
  }));
  const sourceText = structural.subarray(source.byName.get(".text").offset,
    source.byName.get(".text").offset + source.byName.get(".text").size);
  // The text-section relocation was rebased from 0x19 to thumb_func+0.
  const expected = Buffer.from(sourceText); expected.writeUInt32LE(0, 12);
  assert.deepEqual(rebuilt, expected, "split sections do not reconstruct remapped text");
  assert.equal(target.relocs.length, 5);
  assert.ok(target.relocs.every(reloc => reloc.type === 2));
  const gapRelocs = target.relocs.filter(reloc => reloc.section === ".rel.text.__cro_gap_00000008");
  assert.deepEqual(gapRelocs.map(reloc => reloc.offset), [0, 4]);
  assert.equal(target.symbols[gapRelocs[1].symbol].name, "thumb_func");
  const rodataRelocs = target.relocs.filter(reloc => reloc.section === ".rel.rodata");
  assert.equal(target.symbols[rodataRelocs[0].symbol].shndx, target.byName.get(".cro.unknown.00000030").index);
  assert.equal(first.target.readUInt32LE(target.byName.get(".rodata").offset), 0x10,
    "one-past text addend was not rebased against the final coverage range");
  assert.equal(target.symbols[rodataRelocs[1].symbol].name, "arm_func");
  assert.equal(first.target.readUInt32LE(target.byName.get(".rodata").offset + 4), 0xfffffff4,
    "negative text addend was not rebased against the first coverage range");
  const thumb = target.symbols.find(symbol => symbol.name === "thumb_func");
  assert.deepEqual([thumb.value, thumb.size, thumb.info & 0xf], [1, 8, 2]);
  const arm = target.symbols.find(symbol => symbol.name === "arm_func");
  assert.deepEqual([arm.value, arm.size, arm.info & 0xf], [0, 8, 2]);
  const pool = target.symbols.find(symbol => symbol.name === "__cro_pool_00000010");
  assert.deepEqual([pool.value, pool.size, pool.info & 0xf], [0, 7, 1]);
  const unknownSection = target.byName.get(".cro.unknown.00000030");
  assert.deepEqual([unknownSection.type, unknownSection.flags, unknownSection.size], [1, 0, 0x10]);
  assert.equal(target.symbols.some(symbol => symbol.name === "__cro_unknown_00000030"), false,
    "unknown residue must not emit a global symbol");

  assert.equal(base.relocs.length, 0, "base skeleton must not copy target relocations");
  for (const range of ranges) {
    const targetSection = target.byName.get(range.sectionName), baseSection = base.byName.get(range.sectionName);
    assert.deepEqual([baseSection.type, baseSection.flags, baseSection.size],
      [8, targetSection.flags, targetSection.size]);
  }
  for (const name of [".rodata", ".data"]) {
    const section = base.byName.get(name);
    assert.equal(section.type, 8, `${name} base payload must be NOBITS`);
  }
  assert.deepEqual([target.byName.get(".bss").type, target.byName.get(".bss").size], [1, 0x10],
    "progress target must materialize zero-initialized BSS data");
  assert.deepEqual([base.byName.get(".bss").size, base.byName.get(".bss").flags], [0, 3],
    "empty base must not receive BSS match credit");
  for (const name of ["arm_func", "thumb_func", "__cro_pool_00000010"])
    assert.ok(base.symbols.some(symbol => symbol.name === name), `base lacks ${name}`);
  for (const name of ["__cro_gap_00000008", "__cro_gap_00000020"])
    assert.equal(base.symbols.some(symbol => symbol.name === name), false, `${name} must not be a function symbol`);
  const baseUnknown = base.byName.get(".cro.unknown.00000030");
  assert.equal(baseUnknown.type, 8);

  expectInventoryFailure("unknown key", inv => { inv.surprise = true; }, /unknown key/);
  expectInventoryFailure("wrong format", inv => { inv.format = 2; }, /format must be 1/);
  expectInventoryFailure("reserved name", inv => { inv.functions[0].name = "__cro_bad"; }, /reserved/);
  expectInventoryFailure("duplicate name", inv => { inv.functions[1].name = "arm_func"; }, /duplicate/);
  expectInventoryFailure("bad arm alignment", inv => { inv.functions[0].size = 6; inv.gaps[0].address = 6; inv.gaps[0].size = 10; }, /misaligned/);
  expectInventoryFailure("overlap", inv => { inv.gaps[0].address = 4; inv.gaps[0].size = 12; }, /overlap/);
  expectInventoryFailure("hole", inv => { inv.gaps[0].address = 12; inv.gaps[0].size = 4; }, /hole/);
  expectInventoryFailure("empty pool", inv => { inv.pools[0].size = 0; }, /size is invalid/);
  expectInventoryFailure("unknown overlap", inv => { inv.unknown[0].address = 0x16; }, /overlap/);

  assert.throws(() => splitCroTargetElf(structural, JSON.stringify({ ...inventory, module: "Other" })), /does not match/);
  assert.throws(() => splitCroTargetElf(structural, JSON.stringify({ ...inventory, textSize: 0x44,
    unknown: [{ address: 0x17, size: 1 }, { address: 0x30, size: 0x14 }] })), /textSize does not match/);
  const badMarker = Buffer.from(structural), marker = source.byName.get(".cro.module"); badMarker[marker.offset + marker.size - 1] = 1;
  assert.throws(() => splitCroTargetElf(badMarker, inventoryJson), /marker is invalid/);
  const badRel = Buffer.from(structural), relText = source.byName.get(".rel.text");
  badRel.writeUInt32LE((badRel.readUInt32LE(relText.offset + 4) & ~0xff) | 3, relText.offset + 4);
  assert.throws(() => splitCroTargetElf(badRel, inventoryJson), /non-ABS32/);
  const crossing = { ...inventory,
    functions: [{ name: "arm_func", address: 0, size: 8, mode: "arm" },
      { name: "thumb_func", address: 0x18, size: 8, mode: "thumb" }],
    gaps: [{ address: 8, size: 2, mode: "thumb" }, { address: 0x20, size: 0x20, mode: "thumb" }],
    pools: [{ address: 10, size: 14 }], unknown: [] };
  assert.throws(() => splitCroTargetElf(structural, JSON.stringify(crossing)), /crosses an inventory boundary/);

  process.stdout.write("split-cro-target-object self-test: ok (complete partition, ARM/Thumb identities, unknown residue, relocation rebasing, zero base, 14 hostile cases)\n");
}

function main() {
  assert.deepEqual(process.argv.slice(2), ["--self-test"],
    "usage: validate-split-cro-target-object.mjs --self-test");
  selfTest();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
