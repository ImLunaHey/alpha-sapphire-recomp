#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-ipc-wrappers-100.json");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_ipc_wrappers_100.md");
const configBytes = fs.readFileSync(CONFIG_PATH);
const config = JSON.parse(configBytes);
const SOURCE_PATH = path.join(ROOT, config.source);
const CONFIG_HASH = "3a66e3ffbce3e87df8d7c61ed70c7af76dd5b23a9648f4fb68028da74d067a8c";
const NORMALIZED_CONFIG_HASH = "7af16320265fc113234b43c395ea2c2438b96b7c3311e080a5369dc1b92931ed";
const SPEC_HASH = "6fbb0ed4de0e7cf4c2b83941983266947adb9f58d9d43e550163c91abea0c46d";
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const SECTION = ".text.func_001854A0";
const CALL_OFFSETS = [36, 56, 76, 124, 136, 184, 252];

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
  equal(config.source, "src/main/arm_ipc_wrappers_100.S", "source path");
  equal(config.architecture, "ARMv6K", "architecture");
  equal(config.mode, "arm", "instruction mode");
  equal(config.totalBodySize, 268, "body size");
  equal(config.totalAdjacentSize, 32, "adjacent size");
  equal(config.cumulativePoolSlots, 906, "cumulative pool slots");
  equal(config.cumulativePoolClasses, 480, "cumulative pool classes");
  equal(config.functions.length, 1, "function count");
  const fn = config.functions[0];
  same([fn.name, fn.section, fn.size, fn.instructionCount, fn.localBranchCount,
    fn.nextGlobal, fn.nextGlobalOffset],
  ["func_001854A0", SECTION, 268, 67, 0, "func_001855CC", 300], "function contract");
  same(fn.branches.map(({ offset, kind, symbol, addend }) => [offset, kind, symbol, addend]), [
    [36, "R_ARM_CALL", "func_0018B220", 0],
    [56, "R_ARM_CALL", "func_0018AAEC", 0],
    [76, "R_ARM_CALL", "func_0018AAEC", 0],
    [124, "R_ARM_CALL", "func_00184990", 0],
    [136, "R_ARM_CALL", "service_buffer_initialize_secondary_100", 0],
    [184, "R_ARM_CALL", "func_0018F654", 0],
    [252, "R_ARM_CALL", "func_0018CE64", 0],
  ], "branch contract");
  same(fn.returnOffsets, [264], "return contract");
  same(fn.literals.map(({ offset, symbol, relocation, addend }) =>
    [offset, symbol, relocation, addend]), [
    [268, "service_manager_vtable_100", "R_ARM_ABS32", 0],
    [272, "ipc_empty_text_63", "R_ARM_ABS32", 0],
    [276, "service_channel_descriptor_primary_100", "R_ARM_ABS32", 0],
    [280, "service_channel_descriptor_secondary_100", "R_ARM_ABS32", 0],
    [284, "service_instance_vtable_100", "R_ARM_ABS32", 0],
    [288, "service_buffer_first_callback_100", "R_ARM_ABS32", 0],
    [292, "service_buffer_second_callback_100", "R_ARM_ABS32", 0],
    [296, "service_buffer_template_100", "R_ARM_ABS32", 0],
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
  0xe92d47f0, 0xe1a05001, 0xe24dd010, 0xe3a08000, 0xe59f10f4,
  0xe1a06002, 0xe8800102, 0xe3a01202, 0xe2800010, 0xebfffffe,
  0xe59f30e0, 0xe59f10e0, 0xe3a02000, 0xe2800030, 0xebfffffe,
  0xe59f30cc, 0xe59f10d0, 0xe3a02000, 0xe2800070, 0xebfffffe,
  0xe50080a8, 0xe24040b0, 0xe50080a4, 0xe59f00b8, 0xe3750001,
  0x03a0500f, 0xe3760001, 0xe5840000, 0xe1a07005, 0x03a06008,
  0xe3a00070, 0xebfffffe, 0xe1b05000, 0x13a01070, 0x1bfffffe,
  0xe59f908c, 0xe5845120, 0xe59fa088, 0xe5859020, 0xe5940120,
  0xe59f1080, 0xe3a02038, 0xe580a024, 0xe5940120, 0xe5808028,
  0xe5940120, 0xebfffffe, 0xe5940120, 0xe59f2060, 0xe3a01038,
  0xe1a03007, 0xe5809058, 0xe5940120, 0xe580a05c, 0xe5940120,
  0xe5808060, 0xe58d100c, 0xe58d2008, 0xe88d0140, 0xe5940120,
  0xe3a02008, 0xe3e01000, 0xe2800038, 0xebfffffe, 0xe28dd010,
  0xe1a00004, 0xe8bd87f0,
];
const expectedRelocations = [
  [36, 28, "func_0018B220"], [56, 28, "func_0018AAEC"],
  [76, 28, "func_0018AAEC"], [124, 28, "func_00184990"],
  [136, 28, "service_buffer_initialize_secondary_100"], [184, 28, "func_0018F654"],
  [252, 28, "func_0018CE64"], [268, 2, "service_manager_vtable_100"],
  [272, 2, "ipc_empty_text_63"], [276, 2, "service_channel_descriptor_primary_100"],
  [280, 2, "service_channel_descriptor_secondary_100"], [284, 2, "service_instance_vtable_100"],
  [288, 2, "service_buffer_first_callback_100"], [292, 2, "service_buffer_second_callback_100"],
  [296, 2, "service_buffer_template_100"],
];

function validateObject(buffer) {
  const elf = parseElf(buffer);
  const owned = elf.sections.filter((section) => section.name === SECTION);
  equal(owned.length, 1, "owned section multiplicity");
  const section = owned[0];
  same([section.type, section.flags, section.addr, section.size, section.align], [1, 6, 0, 300, 4],
    "owned section metadata");
  same(elf.sections.filter((item) => (item.flags & 4) !== 0 && item.size !== 0).map((item) => item.name),
    [SECTION], "nonempty executable section set");
  const words = Array.from({ length: 67 }, (_, index) =>
    buffer.readUInt32LE(section.offset + index * 4));
  same(words, expectedWords, "instruction words");
  assert(buffer.subarray(section.offset + 268, section.offset + 300).every((byte) => byte === 0),
    "literal pool contains nonzero pre-relocation data");
  same(elf.relocations.filter((relocation) => relocation.target === section.index)
    .map(({ offset, type, symbol, format, addend }) => [offset, type, symbol, format, addend]),
  expectedRelocations.map(([offset, type, symbol]) => [offset, type, symbol, 9, 0]), "relocation contract");
  equal(elf.relocations.filter((relocation) => relocation.target === section.index).length, 15,
    "owned relocation count");
  const symtabs = elf.sections.filter((item) => item.type === 2);
  equal(symtabs.length, 1, "symbol table count");
  equal(elf.sections.filter((item) => item.type === 11).length, 0, "dynamic symbol table count");
  const symbols = elf.symbolTables.get(symtabs[0].index);
  const ownedSymbols = symbols.filter((symbol) => symbol.shndx === section.index)
    .map(({ name, value, size, bind, type, visibility }) => ({ name, value, size, bind, type, visibility }));
  same(ownedSymbols, [
    { name: "", value: 0, size: 0, bind: 0, type: 3, visibility: 0 },
    { name: "$a", value: 0, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "$d", value: 268, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "func_001854A0", value: 0, size: 268, bind: 1, type: 2, visibility: 0 },
  ], "owned symbols");
  const undefinedNames = symbols.filter((symbol) => symbol.index !== 0 && symbol.shndx === 0)
    .map((symbol) => symbol.name);
  same(undefinedNames, [...new Set(expectedRelocations.map((item) => item[2]))], "undefined symbol identities");
  for (const symbol of symbols.filter((item) => item.index !== 0 && item.shndx === 0)) {
    same([symbol.value, symbol.size, symbol.bind, symbol.type, symbol.visibility], [0, 0, 1, 0, 0],
      `undefined symbol ${symbol.name}`);
  }
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
    [1, 6, 268, 4], "authoritative target section contract");
  const relocationSites = new Set(CALL_OFFSETS);
  for (let offset = 0; offset < 268; offset += 4) {
    let actual = candidate.readUInt32LE(base[0].offset + offset);
    let expected = target.readUInt32LE(reference[0].offset + offset);
    if (relocationSites.has(offset)) { actual &= 0xff000000; expected &= 0xff000000; }
    equal(actual, expected, `authoritative target word +${offset}`);
  }
  const symtabs = targetElf.sections.filter((item) => item.type === 2);
  const owners = symtabs.flatMap((table) => targetElf.symbolTables.get(table.index))
    .filter((symbol) => symbol.name === "func_001854A0" && symbol.shndx === reference[0].index);
  equal(owners.length, 1, "authoritative owner symbol count");
  same([owners[0].value, owners[0].size, owners[0].bind, owners[0].type], [0, 268, 1, 2],
    "authoritative owner symbol");
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
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ipc100-"));
  const objectPath = path.join(directory, "arm_ipc_wrappers_100.o");
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
function selfTest(validObject, target) {
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
    ["pool mutation", (copy, elf) => { copy[elf.sections.find((item) => item.name === SECTION).offset + 268] ^= 1; }],
    ["relocation mutation", (copy, elf) => {
      const rel = elf.sections.find((item) => item.type === 9 && elf.sections[item.info]?.name === SECTION);
      copy[rel.offset + 4] ^= 1;
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
}

let temporary;
try {
  const args = process.argv.slice(2);
  const allowed = new Set(["--self-test", "--object", "--target"]);
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
  if (args.includes("--self-test")) selfTest(object, target);
  console.log(`arm-ipc-wrappers-100: PASS${target ? " (authoritative target PASS)" : ""}${args.includes("--self-test") ? " (self-tests PASS)" : ""}`);
} catch (error) {
  console.error(`arm-ipc-wrappers-100: FAIL: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary.directory, { recursive: true, force: true });
}
