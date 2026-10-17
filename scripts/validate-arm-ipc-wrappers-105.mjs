#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-ipc-wrappers-105.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_ipc_wrappers_105.md");
const configBytes = fs.readFileSync(CONFIG_PATH);
const config = JSON.parse(configBytes);
const SOURCE_PATH = path.join(ROOT, config.source);
const CONFIG_HASH = "588475d2038d564a5c55c4d1fa2d9804c32adb110a9016c874294d699f20af10";
const NORMALIZED_CONFIG_HASH = "ca32eb7a6854f266bc17290ff394f7d820a00a46d3b5ed3328188fa816bbf96a";
const SPEC_HASH = "74a0d49d8d30650cde5def7ba3fc89ceb7ad78af3042ce00984c7c952f76ea0f";
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const SECTION = ".text.func_00185C94";
const CALL_OFFSETS = [56, 68, 136, 152, 164, 228, 240, 340, 348, 368, 376, 388];

function assert(ok, message) { if (!ok) throw new Error(message); }
function equal(actual, expected, label) {
  assert(actual === expected, `${label}: expected ${expected}, got ${actual}`);
}
function same(actual, expected, label) {
  assert(JSON.stringify(actual) === JSON.stringify(expected),
    `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
function sha256(data) { return crypto.createHash("sha256").update(data).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
function enforceLimits({ fileSize = 0, execSize = 0, sectionCount = 0,
  symbolCount = 0, relocationCount = 0 }) {
  assert(fileSize <= MAX_FILE, "complete input exceeds 64 MiB");
  assert(execSize <= MAX_EXEC, "aggregate executable data exceeds 16 MiB");
  assert(sectionCount <= MAX_SECTIONS, "section count exceeds 16,384");
  assert(symbolCount <= MAX_SYMBOLS, "aggregate symbol count exceeds 1,000,000");
  assert(relocationCount <= MAX_RELOCS, "aggregate relocation count exceeds 1,000,000");
}

function validatePinnedInputs(source = fs.readFileSync(SOURCE_PATH)) {
  equal(sha256(configBytes), CONFIG_HASH, "raw configuration hash");
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  equal(sha256(stable(normalized)), NORMALIZED_CONFIG_HASH, "normalized configuration hash");
  equal(sha256(fs.readFileSync(SPEC_PATH)), SPEC_HASH, "specification hash");
  equal(config.schemaVersion, 1, "schema version");
  equal(config.source, "src/main/arm_ipc_wrappers_105.S", "source path");
  equal(config.architecture, "ARMv6K", "architecture");
  equal(config.mode, "arm", "instruction mode");
  equal(config.totalBodySize, 404, "body size");
  equal(config.totalAdjacentSize, 16, "adjacent size");
  equal(config.cumulativePoolSlots, 921, "cumulative pool slots");
  equal(config.cumulativePoolClasses, 493, "cumulative pool classes");
  equal(config.functions.length, 1, "function count");
  const fn = config.functions[0];
  same([fn.name, fn.section, fn.size, fn.instructionCount, fn.localBranchCount,
    fn.nextGlobal, fn.nextGlobalOffset],
  ["func_00185C94", SECTION, 404, 101, 0, "func_00185E38", 420], "function contract");
  same(fn.branches.map(({ offset, kind, symbol, addend }) => [offset, kind, symbol, addend]), [
    [56, "R_ARM_CALL", "func_00184990", 0], [68, "R_ARM_CALL", "func_00184990", 0],
    [136, "R_ARM_CALL", "func_0017ECB0", 0], [152, "R_ARM_CALL", "func_0018E1E0", 0],
    [164, "R_ARM_CALL", "func_0018B220", 0], [228, "R_ARM_CALL", "func_00184990", 0],
    [240, "R_ARM_CALL", "func_00184990", 0], [340, "R_ARM_CALL", "func_0017E30C", 0],
    [348, "R_ARM_JUMP24", "func_001603A0", 0], [368, "R_ARM_CALL", "func_0018D348", 0],
    [376, "R_ARM_CALL", "func_0018D6D4", 0], [388, "R_ARM_CALL", "func_0018E370", 0],
  ], "branch contract");
  same(fn.returnOffsets, [400], "return contract");
  same(fn.literals.map(({ offset, symbol, relocation, addend }) =>
    [offset, symbol, relocation, addend]), [
    [404, "service_owner_vtable_105", "R_ARM_ABS32", 0],
    [408, "service_adapter_vtable_105", "R_ARM_ABS32", 0],
    [412, "service_runtime_endpoint_vtable_85", "R_ARM_ABS32", 0],
    [416, "service_runtime_context_105", "R_ARM_ABS32", 0],
  ], "literal contract");
  equal(sha256(source), config.sourceHash, "source hash");
}

function bounded(offset, size, limit, label) {
  assert(Number.isInteger(offset) && Number.isInteger(size) && offset >= 0 && size >= 0 &&
    offset <= limit && size <= limit - offset, `truncated ${label}`);
}
function cString(buffer, offset) {
  assert(Number.isInteger(offset) && offset >= 0 && offset < buffer.length,
    `string offset ${offset} is out of range`);
  const end = buffer.indexOf(0, offset);
  assert(end !== -1, `unterminated string at ${offset}`);
  return buffer.toString("utf8", offset, end);
}

function parseElf(buffer) {
  enforceLimits({ fileSize: buffer.length });
  assert(buffer.length >= 52, "object is shorter than an ELF32 header");
  same([...buffer.subarray(0, 7)], [0x7f, 0x45, 0x4c, 0x46, 1, 1, 1], "ELF identity");
  assert(buffer.subarray(7, 16).every((byte) => byte === 0), "noncanonical ELF identity padding");
  const u16 = (at) => buffer.readUInt16LE(at);
  const u32 = (at) => buffer.readUInt32LE(at);
  same([u16(16), u16(18), u32(20), u32(24), u32(28), u32(36)],
    [1, 40, 1, 0, 0, 0x05000000], "ELF header contract");
  same([u16(40), u16(42), u16(44), u16(46)], [52, 0, 0, 40], "ELF table sizes");
  const shoff = u32(32), shnum = u16(48), shstrndx = u16(50);
  assert(shnum > 0 && shstrndx < shnum, "invalid section table");
  enforceLimits({ fileSize: buffer.length, sectionCount: shnum });
  bounded(shoff, shnum * 40, buffer.length, "section table");
  const sections = Array.from({ length: shnum }, (_, index) => {
    const at = shoff + index * 40;
    return { index, headerOffset: at, nameOffset: u32(at), type: u32(at + 4),
      flags: u32(at + 8), addr: u32(at + 12), offset: u32(at + 16), size: u32(at + 20),
      link: u32(at + 24), info: u32(at + 28), align: u32(at + 32), entsize: u32(at + 36) };
  });
  assert(buffer.subarray(shoff, shoff + 40).every((byte) => byte === 0), "null section is not canonical");
  const shstr = sections[shstrndx];
  bounded(shstr.offset, shstr.size, buffer.length, "section-name table");
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(names, section.nameOffset);
  let execSize = 0, symbolCount = 0, relocationCount = 0;
  for (const section of sections) {
    if (section.type !== 8) bounded(section.offset, section.size, buffer.length, section.name || "section");
    if (section.flags & 4) execSize += section.size;
    if (section.type === 2 || section.type === 11) {
      assert(section.entsize > 0 && section.size % section.entsize === 0, `invalid ${section.name} symbols`);
      symbolCount += section.size / section.entsize;
    }
    if (section.type === 4 || section.type === 9) {
      assert(section.entsize > 0 && section.size % section.entsize === 0, `invalid ${section.name} relocations`);
      relocationCount += section.size / section.entsize;
    }
  }
  enforceLimits({ fileSize: buffer.length, execSize, sectionCount: shnum, symbolCount, relocationCount });
  const symbolTables = new Map();
  for (const table of sections.filter((item) => item.type === 2 || item.type === 11)) {
    assert(table.link < sections.length, `${table.name}: invalid string-table link`);
    const strings = sections[table.link];
    assert(strings.type === 3, `${table.name}: symbol names do not use a string table`);
    const data = buffer.subarray(strings.offset, strings.offset + strings.size);
    const symbols = Array.from({ length: table.size / table.entsize }, (_, index) => {
      const at = table.offset + index * table.entsize, info = buffer[at + 12], other = buffer[at + 13];
      return { index, name: cString(data, u32(at)), value: u32(at + 4), size: u32(at + 8),
        bind: info >>> 4, type: info & 15, visibility: other & 3, other, shndx: u16(at + 14) };
    });
    symbolTables.set(table.index, symbols);
  }
  const relocations = [];
  for (const relsec of sections.filter((item) => item.type === 4 || item.type === 9)) {
    assert(relsec.link < sections.length && relsec.info < sections.length,
      `${relsec.name}: invalid relocation links`);
    const symbols = symbolTables.get(relsec.link);
    assert(symbols, `${relsec.name}: relocation table does not link a symbol table`);
    const step = relsec.entsize;
    for (let index = 0; index < relsec.size / step; index++) {
      const at = relsec.offset + index * step, offset = u32(at), info = u32(at + 4);
      bounded(offset, 4, sections[relsec.info].size, `${relsec.name} relocation`);
      const symbol = symbols[info >>> 8];
      assert(symbol, `${relsec.name}: missing relocation symbol`);
      relocations.push({ target: relsec.info, format: relsec.type, offset,
        type: info & 0xff, symbol: symbol.name, addend: relsec.type === 4 ? buffer.readInt32LE(at + 8) : 0 });
    }
  }
  return { buffer, sections, symbolTables, relocations };
}

const expectedWords = [
  0xe92d41f0, 0xe24dd030, 0xe3a08000, 0xe59f1180, 0xe3a05001,
  0xe4801004, 0xe1a06000, 0xe58d8008, 0xe3a0000c, 0xe58d800c,
  0xe58d8010, 0xe58d8014, 0xe58d8018, 0xe58d801c, 0xebfffffe,
  0xe1a04000, 0xe3a00018, 0xebfffffe, 0xe5840008, 0xe59d0008,
  0xe28d7008, 0xe8840021, 0xe58d4008, 0xe5940008, 0xe58d0010,
  0xe59d1010, 0xe2800018, 0xe58d0014, 0xe58d0010, 0xe58d1018,
  0xe5811000, 0xe59d0018, 0xe5800004, 0xe1a00006, 0xebfffffe,
  0xe59f1104, 0xe480100c, 0xe1a01007, 0xebfffffe, 0xe3a01001,
  0xe2800018, 0xebfffffe, 0xe59f20ec, 0xe3a01002, 0xe5802000,
  0xe5c0102c, 0xe5808030, 0xe5808040, 0xe5808044, 0xe5c08048,
  0xe5c00049, 0xe580803c, 0xe5808038, 0xe2804030, 0xe5808034,
  0xe3a06020, 0xe3a0000c, 0xebfffffe, 0xe1a05000, 0xe3a00d16,
  0xebfffffe, 0xe5850008, 0xe5940000, 0xe2841008, 0xe8850041,
  0xe5845000, 0xe5950008, 0xe2802d16, 0xe8810005, 0xe5940008,
  0xe280202c, 0xe5842008, 0xe5808008, 0xe580800c, 0xe5c08000,
  0xe5840010, 0xe5808004, 0xe5940010, 0xe5800008, 0xe5940010,
  0xe2444054, 0xe580000c, 0xe59f0050, 0xe590100c, 0xe28d0020,
  0xebfffffe, 0xe1b01fa0, 0x1bfffffe, 0xe59d0020, 0xe28d1028,
  0xe58d0028, 0xe2840054, 0xebfffffe, 0xe1a01007, 0xebfffffe,
  0xe2444004, 0xe28d0008, 0xebfffffe, 0xe28dd030, 0xe1a00004,
  0xe8bd81f0,
];
const expectedRelocations = [
  [56, 28, "func_00184990"], [68, 28, "func_00184990"],
  [136, 28, "func_0017ECB0"], [152, 28, "func_0018E1E0"],
  [164, 28, "func_0018B220"], [228, 28, "func_00184990"],
  [240, 28, "func_00184990"], [340, 28, "func_0017E30C"],
  [348, 29, "func_001603A0"], [368, 28, "func_0018D348"],
  [376, 28, "func_0018D6D4"], [388, 28, "func_0018E370"],
  [404, 2, "service_owner_vtable_105"], [408, 2, "service_adapter_vtable_105"],
  [412, 2, "service_runtime_endpoint_vtable_85"], [416, 2, "service_runtime_context_105"],
];

function validateObject(buffer) {
  const elf = parseElf(buffer);
  const owned = elf.sections.filter((section) => section.name === SECTION);
  equal(owned.length, 1, "owned section multiplicity");
  const section = owned[0];
  same([section.type, section.flags, section.addr, section.size, section.align], [1, 6, 0, 420, 4],
    "owned section metadata");
  same(elf.sections.filter((item) => (item.flags & 4) !== 0 && item.size !== 0).map((item) => item.name),
    [SECTION], "nonempty executable section set");
  const words = Array.from({ length: 101 }, (_, index) =>
    buffer.readUInt32LE(section.offset + index * 4));
  same(words, expectedWords, "instruction words");
  assert(buffer.subarray(section.offset + 404, section.offset + 420).every((byte) => byte === 0),
    "literal pool contains nonzero pre-relocation data");
  same(elf.relocations.filter((relocation) => relocation.target === section.index)
    .map(({ offset, type, symbol, format, addend }) => [offset, type, symbol, format, addend]),
  expectedRelocations.map(([offset, type, symbol]) => [offset, type, symbol, 9, 0]), "relocation contract");
  equal(elf.relocations.filter((relocation) => relocation.target === section.index).length, 16,
    "owned relocation count");
  const symtabs = elf.sections.filter((item) => item.type === 2);
  equal(symtabs.length, 1, "symbol table count");
  equal(elf.sections.filter((item) => item.type === 11).length, 0, "dynamic symbol table count");
  const symbols = elf.symbolTables.get(symtabs[0].index);
  assert(symbols.length > 0 && symbols[0].name === "" && symbols[0].value === 0 &&
    symbols[0].size === 0 && symbols[0].bind === 0 && symbols[0].type === 0 &&
    symbols[0].other === 0 && symbols[0].shndx === 0, "null symbol is not canonical");
  const ownedSymbols = symbols.filter((symbol) => symbol.shndx === section.index)
    .map(({ name, value, size, bind, type, visibility }) => ({ name, value, size, bind, type, visibility }));
  same(ownedSymbols, [
    { name: "", value: 0, size: 0, bind: 0, type: 3, visibility: 0 },
    { name: "$a", value: 0, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "$d", value: 404, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "func_00185C94", value: 0, size: 404, bind: 1, type: 2, visibility: 0 },
  ], "owned symbols");
  const undefinedNames = symbols.filter((symbol) => symbol.index !== 0 && symbol.shndx === 0)
    .map((symbol) => symbol.name);
  same(undefinedNames, [...new Set(expectedRelocations.map((item) => item[2]))], "undefined symbol identities");
  for (const symbol of symbols.filter((item) => item.index !== 0 && item.shndx === 0)) {
    same([symbol.value, symbol.size, symbol.bind, symbol.type, symbol.visibility], [0, 0, 1, 0, 0],
      `undefined symbol ${symbol.name}`);
  }
  same(symbols.filter((symbol) => symbol.name !== "").map((symbol) => symbol.name), [
    "$a", "$d", "func_00185C94", "func_00184990", "func_0017ECB0",
    "func_0018E1E0", "func_0018B220", "func_0017E30C", "func_001603A0",
    "func_0018D348", "func_0018D6D4", "func_0018E370", "service_owner_vtable_105",
    "service_adapter_vtable_105", "service_runtime_endpoint_vtable_85", "service_runtime_context_105",
  ], "complete named symbol set");
  equal(elf.relocations.length, 16, "total relocation count");
  const attrs = elf.sections.filter((item) => item.name === ".ARM.attributes");
  equal(attrs.length, 1, "ARM attributes count");
  equal(buffer.subarray(attrs[0].offset, attrs[0].offset + attrs[0].size).toString("hex"),
    "411b000000616561626900011100000005364b000609080109010a02", "ARM attributes");
  return elf;
}

function validateTarget(candidate, target) {
  const baseElf = parseElf(candidate), targetElf = parseElf(target);
  const base = baseElf.sections.filter((item) => item.name === SECTION);
  const reference = targetElf.sections.filter((item) => item.name === SECTION);
  equal(base.length, 1, "candidate target-comparison section count");
  equal(reference.length, 1, "authoritative target section count");
  same([reference[0].type, reference[0].flags, reference[0].size, reference[0].align],
    [1, 6, 404, 4], "authoritative target section contract");
  const relocationSites = new Set(CALL_OFFSETS);
  for (let offset = 0; offset < 404; offset += 4) {
    let actual = candidate.readUInt32LE(base[0].offset + offset);
    let expected = target.readUInt32LE(reference[0].offset + offset);
    if (relocationSites.has(offset)) { actual &= 0xff000000; expected &= 0xff000000; }
    equal(actual, expected, `authoritative target word +${offset}`);
  }
  const symtabs = targetElf.sections.filter((item) => item.type === 2);
  const owners = symtabs.flatMap((table) => targetElf.symbolTables.get(table.index))
    .filter((symbol) => symbol.name === "func_00185C94" && symbol.shndx === reference[0].index);
  equal(owners.length, 1, "authoritative owner symbol count");
  same([owners[0].value, owners[0].size, owners[0].bind, owners[0].type], [0, 404, 1, 2],
    "authoritative owner symbol");
  const targetBranches = targetElf.relocations
    .filter((relocation) => relocation.target === reference[0].index &&
      (relocation.type === 28 || relocation.type === 29))
    .map(({ offset, type, symbol, format, addend }) => [offset, type, symbol, format, addend]);
  same(targetBranches,
    expectedRelocations.filter((item) => item[1] === 28 || item[1] === 29)
      .map(([offset, type, symbol]) => [offset, type, symbol, 9, 0]),
    "authoritative symbolic branch relocation contract");
}

function validateTargetCode(candidate, code) {
  enforceLimits({ fileSize: code.length });
  const codeOffset = 0x85c94;
  bounded(codeOffset, 420, code.length, "authoritative code extent");
  const baseElf = parseElf(candidate);
  const base = baseElf.sections.find((item) => item.name === SECTION);
  const relocationSites = new Set(CALL_OFFSETS);
  for (let offset = 0; offset < 404; offset += 4) {
    let actual = candidate.readUInt32LE(base.offset + offset);
    let expected = code.readUInt32LE(codeOffset + offset);
    if (relocationSites.has(offset)) { actual &= 0xff000000; expected &= 0xff000000; }
    equal(actual, expected, `authoritative code word +${offset}`);
  }
  for (const [offset, type, symbol] of expectedRelocations.filter((item) => item[1] === 28 || item[1] === 29)) {
    const word = code.readUInt32LE(codeOffset + offset);
    equal(word >>> 24, type === 28 ? 0xeb : 0x1b, `authoritative call condition +${offset}`);
    let displacement = word & 0x00ffffff;
    if (displacement & 0x00800000) displacement -= 0x01000000;
    const destination = 0x100000 + codeOffset + offset + 8 + displacement * 4;
    const match = /^func_([0-9A-Fa-f]{8})$/.exec(symbol);
    assert(match && destination === Number.parseInt(match[1], 16),
      `authoritative call +${offset} does not resolve to ${symbol}`);
  }
  const identities = Array.from({ length: 4 }, (_, index) => code.readUInt32LE(codeOffset + 404 + index * 4));
  assert(identities.every((value) => value !== 0), "authoritative literal identities include zero");
  equal(new Set(identities).size, 4, "authoritative literal identity class count");
  equal(identities[2], code.readUInt32LE(0x7eae4 + 256),
    "reused service_runtime_endpoint_vtable_85 physical identity");
}

function findAssembler() {
  const candidates = [process.env.ARM_AS, "arm-none-eabi-as"].filter(Boolean);
  try {
    for (const entry of fs.readdirSync("/nix/store").sort()) {
      const candidate = path.join("/nix/store", entry, "bin/arm-none-eabi-as");
      if (fs.existsSync(candidate)) candidates.push(candidate);
    }
  } catch {}
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0) return candidate;
  }
  throw new Error("arm-none-eabi-as not found; set ARM_AS or pass --object <path>");
}
function assemble() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ipc105-"));
  const objectPath = path.join(directory, "arm_ipc_wrappers_105.o");
  const result = spawnSync(findAssembler(), ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, SOURCE_PATH],
    { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`assembler failed:\n${result.stderr || result.stdout}`);
  return { directory, objectPath };
}
function rejects(action, label) {
  let rejected = false;
  try { action(); } catch { rejected = true; }
  assert(rejected, `self-test did not reject ${label}`);
}
function selfTest(validObject, target, code) {
  const source = Buffer.from(fs.readFileSync(SOURCE_PATH)); source[source.length - 1] ^= 1;
  rejects(() => validatePinnedInputs(source), "source mutation");
  for (const [label, values] of [
    ["file limit", { fileSize: MAX_FILE + 1 }], ["executable limit", { execSize: MAX_EXEC + 1 }],
    ["section limit", { sectionCount: MAX_SECTIONS + 1 }],
    ["symbol limit", { symbolCount: MAX_SYMBOLS + 1 }],
    ["relocation limit", { relocationCount: MAX_RELOCS + 1 }],
  ]) rejects(() => enforceLimits(values), label);
  for (const [label, mutate] of [
    ["instruction mutation", (copy, elf) => { copy[elf.sections.find((item) => item.name === SECTION).offset] ^= 1; }],
    ["pool mutation", (copy, elf) => { copy[elf.sections.find((item) => item.name === SECTION).offset + 404] ^= 1; }],
    ["relocation mutation", (copy, elf) => {
      const rel = elf.sections.find((item) => item.type === 9 && elf.sections[item.info]?.name === SECTION);
      copy[rel.offset + 4] ^= 1;
    }],
    ["symbol mutation", (copy, elf) => {
      const symtab = elf.sections.find((item) => item.type === 2); copy[symtab.offset + symtab.size - 4] ^= 1;
    }],
    ["foreign executable payload", (copy, elf) => {
      const attr = elf.sections.find((item) => item.name === ".ARM.attributes");
      copy.writeUInt32LE(attr.flags | 4, attr.headerOffset + 8);
    }],
    ["attribute mutation", (copy, elf) => {
      const attr = elf.sections.find((item) => item.name === ".ARM.attributes"); copy[attr.offset + attr.size - 1] ^= 1;
    }],
  ]) {
    const copy = Buffer.from(validObject); mutate(copy, parseElf(copy));
    rejects(() => validateObject(copy), label);
  }
  if (target) {
    const copy = Buffer.from(target), elf = parseElf(copy);
    copy[elf.sections.find((item) => item.name === SECTION).offset] ^= 1;
    rejects(() => validateTarget(validObject, copy), "authoritative target mutation");
    const relocationCopy = Buffer.from(target), relocationElf = parseElf(relocationCopy);
    const targetSection = relocationElf.sections.find((item) => item.name === SECTION);
    const targetRelocations = relocationElf.sections.find((item) =>
      item.type === 9 && item.info === targetSection.index);
    assert(targetRelocations !== undefined, "authoritative target relocation table is missing");
    relocationCopy[targetRelocations.offset + 4] ^= 1;
    rejects(() => validateTarget(validObject, relocationCopy),
      "authoritative symbolic branch relocation mutation");
  }
  if (code) {
    const copy = Buffer.from(code); copy.writeUInt32LE(0, 0x85c94 + 404);
    rejects(() => validateTargetCode(validObject, copy), "authoritative adjacent-data mutation");
  }
}

let temporary;
try {
  const args = process.argv.slice(2);
  const allowed = new Set(["--self-test", "--object", "--target", "--code-bin"]);
  for (const arg of args) assert(!arg.startsWith("--") || allowed.has(arg), `unknown option ${arg}`);
  function value(flag) {
    const index = args.indexOf(flag); if (index === -1) return undefined;
    assert(args[index + 1] && !args[index + 1].startsWith("--"), `${flag} requires a path`);
    return path.resolve(args[index + 1]);
  }
  validatePinnedInputs();
  let objectPath = value("--object");
  if (!objectPath) { temporary = assemble(); objectPath = temporary.objectPath; }
  const object = fs.readFileSync(objectPath);
  validateObject(object);
  const targetPath = value("--target");
  const target = targetPath ? fs.readFileSync(targetPath) : undefined;
  if (target) validateTarget(object, target);
  const codePath = value("--code-bin");
  const code = codePath ? fs.readFileSync(codePath) : undefined;
  if (code) validateTargetCode(object, code);
  if (args.includes("--self-test")) selfTest(object, target, code);
  console.log(`arm-ipc-wrappers-105: PASS${target ? " (authoritative target PASS)" : ""}${code ? " (authoritative adjacent data PASS)" : ""}${args.includes("--self-test") ? " (self-tests PASS)" : ""}`);
} catch (error) {
  console.error(`arm-ipc-wrappers-105: FAIL: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary.directory, { recursive: true, force: true });
}
