#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-ipc-wrappers-102.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_ipc_wrappers_102.md");
const configBytes = fs.readFileSync(CONFIG_PATH);
const config = JSON.parse(configBytes);
const SOURCE_PATH = path.join(ROOT, config.source);
const CONFIG_HASH = "ea7ca9a9cdb5096bebde3e142e5a5861ffc2cd955f7d39ea92861d2ae5d78f7b";
const NORMALIZED_CONFIG_HASH = "b5cf5e09e12a905e4e0a866432c89545e5a076a91a170b85fa870cab9fb00c53";
const SPEC_HASH = "e699f5ca01e7c03054791266d354c565497ae54906d8c452adf10ca94eea3a9d";
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const SECTION = ".text.func_0018592C";
const CALL_OFFSETS = [48, 112, 148, 256, 272, 344];

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
  equal(config.source, "src/main/arm_ipc_wrappers_102.S", "source path");
  equal(config.architecture, "ARMv6K", "architecture");
  equal(config.mode, "arm", "instruction mode");
  equal(config.totalBodySize, 420, "body size");
  equal(config.totalAdjacentSize, 28, "adjacent size");
  equal(config.cumulativePoolSlots, 915, "cumulative pool slots");
  equal(config.cumulativePoolClasses, 489, "cumulative pool classes");
  equal(config.functions.length, 1, "function count");
  const fn = config.functions[0];
  same([fn.name, fn.section, fn.size, fn.instructionCount, fn.localBranchCount,
    fn.nextGlobal, fn.nextGlobalOffset],
  ["func_0018592C", SECTION, 420, 105, 7, "func_00185AEC", 448], "function contract");
  same(fn.branches.map(({ offset, kind, symbol, addend }) => [offset, kind, symbol, addend]), [
    [48, "R_ARM_CALL", "func_00184990", 0],
    [112, "R_ARM_CALL", "func_00184990", 0],
    [148, "R_ARM_CALL", "func_00184990", 0],
    [256, "R_ARM_CALL", "func_0018B220", 0],
    [272, "R_ARM_CALL", "func_00186404", 0],
    [344, "R_ARM_CALL", "func_00184990", 0],
  ], "branch contract");
  same(fn.returnOffsets, [416], "return contract");
  same(fn.literals.map(({ offset, symbol, relocation, addend }) =>
    [offset, symbol, relocation, addend]), [
    [420, "service_collection_vtable_102", "R_ARM_ABS32", 0],
    [424, "service_singleton_vtable_102", "R_ARM_ABS32", 0],
    [428, "service_prng_vtable_102", "R_ARM_ABS32", 0],
    [432, "service_prng_terminal_102", "R_ARM_ABS32", 0],
    [436, "service_prng_multiplier_102", "R_ARM_ABS32", 0],
    [440, "service_context_vtable_102", "R_ARM_ABS32", 0],
    [444, "service_context_descriptor_102", "R_ARM_ABS32", 0],
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
  0xe92d41f0, 0xe3a06002, 0xe3a08000, 0xe59f1190, 0xe1a05008,
  0xe3a07020, 0xe4801004, 0xe1a04000, 0xe5808000, 0xe5808004,
  0xe5808008, 0xe3a00080, 0xebfffffe, 0xe1b01006, 0xe5840000,
  0x0a000004, 0xe3500000, 0x15805000, 0xe2511001, 0xe2800004,
  0x1afffffa, 0xe5940000, 0xe2445004, 0xe0801106, 0xe0800107,
  0xe5840008, 0xe3a00004, 0xe5841004, 0xebfffffe, 0xe3500000,
  0xe320f000, 0x0a000001, 0xe59f1120, 0xe5801000, 0xe5951004,
  0xe5810000, 0xe3a00c0a, 0xebfffffe, 0xe3500000, 0x03a06000,
  0x0a000029, 0xe59f1100, 0xe3a07001, 0xe4801004, 0xe59f10f8,
  0xe58019c8, 0xe2801d27, 0xe5807000, 0xe8810180, 0xe59029c0,
  0xe59fc0e4, 0xe0803102, 0xe5133004, 0xe00c0c93, 0xe1a03000,
  0xe780c102, 0xe5912000, 0xe2822001, 0xe3520e27, 0xe5812000,
  0x3afffff3, 0xe2830b02, 0xe3a01001, 0xe2800f73, 0xebfffffe,
  0xe2404b02, 0xe2406e9d, 0xe2444f73, 0xebfffffe, 0xe5840000,
  0xe2840d27, 0xe58479c0, 0xe59419c0, 0xe59f2088, 0xe0843101,
  0xe5133004, 0xe0020293, 0xe7842101, 0xe5901000, 0xe2811001,
  0xe3510e27, 0xe5801000, 0x3afffff4, 0xe5950004, 0xe5806004,
  0xe3a00038, 0xebfffffe, 0xe3500000, 0xe320f000, 0x0a00000b,
  0xe59f1048, 0xe59f2048, 0xe3a03000, 0xe5801000, 0xe2801004,
  0xe1a0c003, 0xe8810104, 0xe2802028, 0xe2801020, 0xe8821008,
  0xe1a02003, 0xe1c121f0, 0xe5850010, 0xe1a00005, 0xe8bd81f0,
];
const expectedRelocations = [
  [48, 28, "func_00184990"], [112, 28, "func_00184990"],
  [148, 28, "func_00184990"], [256, 28, "func_0018B220"],
  [272, 28, "func_00186404"], [344, 28, "func_00184990"],
  [420, 2, "service_collection_vtable_102"], [424, 2, "service_singleton_vtable_102"],
  [428, 2, "service_prng_vtable_102"], [432, 2, "service_prng_terminal_102"],
  [436, 2, "service_prng_multiplier_102"], [440, 2, "service_context_vtable_102"],
  [444, 2, "service_context_descriptor_102"],
];

function validateObject(buffer) {
  const elf = parseElf(buffer);
  const owned = elf.sections.filter((section) => section.name === SECTION);
  equal(owned.length, 1, "owned section multiplicity");
  const section = owned[0];
  same([section.type, section.flags, section.addr, section.size, section.align], [1, 6, 0, 448, 4],
    "owned section metadata");
  same(elf.sections.filter((item) => (item.flags & 4) !== 0 && item.size !== 0).map((item) => item.name),
    [SECTION], "nonempty executable section set");
  const words = Array.from({ length: 105 }, (_, index) =>
    buffer.readUInt32LE(section.offset + index * 4));
  same(words, expectedWords, "instruction words");
  assert(buffer.subarray(section.offset + 420, section.offset + 448).every((byte) => byte === 0),
    "literal pool contains nonzero pre-relocation data");
  same(elf.relocations.filter((relocation) => relocation.target === section.index)
    .map(({ offset, type, symbol, format, addend }) => [offset, type, symbol, format, addend]),
  expectedRelocations.map(([offset, type, symbol]) => [offset, type, symbol, 9, 0]), "relocation contract");
  equal(elf.relocations.filter((relocation) => relocation.target === section.index).length, 13,
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
    { name: "$d", value: 420, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "func_0018592C", value: 0, size: 420, bind: 1, type: 2, visibility: 0 },
  ], "owned symbols");
  const undefinedNames = symbols.filter((symbol) => symbol.index !== 0 && symbol.shndx === 0)
    .map((symbol) => symbol.name);
  same(undefinedNames, [...new Set(expectedRelocations.map((item) => item[2]))], "undefined symbol identities");
  for (const symbol of symbols.filter((item) => item.index !== 0 && item.shndx === 0)) {
    same([symbol.value, symbol.size, symbol.bind, symbol.type, symbol.visibility], [0, 0, 1, 0, 0],
      `undefined symbol ${symbol.name}`);
  }
  same(symbols.filter((symbol) => symbol.name !== "").map((symbol) => symbol.name), [
    "$a", "$d", "func_0018592C", "func_00184990", "func_0018B220", "func_00186404",
    "service_collection_vtable_102", "service_singleton_vtable_102", "service_prng_vtable_102",
    "service_prng_terminal_102", "service_prng_multiplier_102", "service_context_vtable_102",
    "service_context_descriptor_102",
  ], "complete named symbol set");
  equal(elf.relocations.length, 13, "total relocation count");
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
    [1, 6, 420, 4], "authoritative target section contract");
  const relocationSites = new Set(CALL_OFFSETS);
  for (let offset = 0; offset < 420; offset += 4) {
    let actual = candidate.readUInt32LE(base[0].offset + offset);
    let expected = target.readUInt32LE(reference[0].offset + offset);
    if (relocationSites.has(offset)) { actual &= 0xff000000; expected &= 0xff000000; }
    equal(actual, expected, `authoritative target word +${offset}`);
  }
  const symtabs = targetElf.sections.filter((item) => item.type === 2);
  const owners = symtabs.flatMap((table) => targetElf.symbolTables.get(table.index))
    .filter((symbol) => symbol.name === "func_0018592C" && symbol.shndx === reference[0].index);
  equal(owners.length, 1, "authoritative owner symbol count");
  same([owners[0].value, owners[0].size, owners[0].bind, owners[0].type], [0, 420, 1, 2],
    "authoritative owner symbol");
}

function validateTargetCode(candidate, code) {
  enforceLimits({ fileSize: code.length });
  const codeOffset = 0x8592c;
  bounded(codeOffset, 448, code.length, "authoritative code extent");
  const baseElf = parseElf(candidate);
  const base = baseElf.sections.find((item) => item.name === SECTION);
  const relocationSites = new Set(CALL_OFFSETS);
  for (let offset = 0; offset < 420; offset += 4) {
    let actual = candidate.readUInt32LE(base.offset + offset);
    let expected = code.readUInt32LE(codeOffset + offset);
    if (relocationSites.has(offset)) { actual &= 0xff000000; expected &= 0xff000000; }
    equal(actual, expected, `authoritative code word +${offset}`);
  }
  for (const [offset, type, symbol] of expectedRelocations.filter((item) => item[1] === 28)) {
    const word = code.readUInt32LE(codeOffset + offset);
    assert((word >>> 24) === 0xeb, `authoritative call +${offset} is not unconditional linked ARM`);
    let displacement = word & 0x00ffffff;
    if (displacement & 0x00800000) displacement -= 0x01000000;
    const destination = 0x100000 + codeOffset + offset + 8 + displacement * 4;
    const match = /^func_([0-9A-Fa-f]{8})$/.exec(symbol);
    assert(match && destination === Number.parseInt(match[1], 16),
      `authoritative call +${offset} does not resolve to ${symbol}`);
  }
  const identities = Array.from({ length: 7 }, (_, index) => code.readUInt32LE(codeOffset + 420 + index * 4));
  assert(identities.every((value) => value !== 0), "authoritative literal identities include zero");
  equal(new Set(identities).size, 7, "authoritative literal identity class count");
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
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ipc102-"));
  const objectPath = path.join(directory, "arm_ipc_wrappers_102.o");
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
    ["pool mutation", (copy, elf) => { copy[elf.sections.find((item) => item.name === SECTION).offset + 420] ^= 1; }],
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
  }
  if (code) {
    const copy = Buffer.from(code); copy.writeUInt32LE(0, 0x8592c + 420);
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
  console.log(`arm-ipc-wrappers-102: PASS${target ? " (authoritative target PASS)" : ""}${code ? " (authoritative adjacent data PASS)" : ""}${args.includes("--self-test") ? " (self-tests PASS)" : ""}`);
} catch (error) {
  console.error(`arm-ipc-wrappers-102: FAIL: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary.directory, { recursive: true, force: true });
}
