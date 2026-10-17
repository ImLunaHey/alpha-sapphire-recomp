#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "config/arm-ipc-wrappers-97.json");
const specPath = path.join(root, "docs/specs/main/arm_ipc_wrappers_97.md");
const configBytes = fs.readFileSync(configPath);
const config = JSON.parse(configBytes);
const sourcePath = path.join(root, config.source);
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const CONFIG_HASH = "193cfac0ab3b30d8df2e16d8112124d467c294c9dc82e3e93a20dec82ff31bbc";
const NORMALIZED_CONFIG_HASH = "15833310b27ecd0b031ca84721423783f1fc50b175b9cd0065127693e99ad2e4";
const SPEC_HASH = "0c12eb4bead6993497f1d36dac823ef6b6c256096c45d8d45c88385ec369d077";

function invariant(ok, message) {
  if (!ok) throw new Error(message);
}

function equal(actual, expected, label) {
  invariant(actual === expected, `${label}: expected ${expected}, got ${actual}`);
}

function same(actual, expected, label) {
  invariant(JSON.stringify(actual) === JSON.stringify(expected),
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
function enforceLimits({ fileSize = 0, execSize = 0, sectionCount = 0, symbolCount = 0, relocationCount = 0 }) {
  invariant(fileSize <= MAX_FILE, "complete input exceeds 64 MiB");
  invariant(execSize <= MAX_EXEC, "aggregate executable data exceeds 16 MiB");
  invariant(sectionCount <= MAX_SECTIONS, "section count exceeds 16,384");
  invariant(symbolCount <= MAX_SYMBOLS, "aggregate symbol count exceeds 1,000,000");
  invariant(relocationCount <= MAX_RELOCS, "aggregate relocation count exceeds 1,000,000");
}

function validateConfigAndSource(source = fs.readFileSync(sourcePath)) {
  equal(sha256(configBytes), CONFIG_HASH, "raw configuration hash");
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  equal(sha256(stable(normalized)), NORMALIZED_CONFIG_HASH, "normalized configuration hash");
  equal(sha256(fs.readFileSync(specPath)), SPEC_HASH, "specification hash");
  equal(config.schemaVersion, 1, "schemaVersion");
  equal(config.source, "src/main/arm_ipc_wrappers_97.S", "source path");
  equal(config.architecture, "ARMv6K", "architecture");
  equal(config.mode, "arm", "instruction mode");
  equal(config.totalBodySize, 200, "body size");
  equal(config.totalAdjacentSize, 8, "adjacent size");
  equal(config.cumulativePoolSlots, 894, "cumulative pool slots");
  equal(config.cumulativePoolClasses, 471, "cumulative pool classes");
  equal(config.functions.length, 1, "function count");
  const fn = config.functions[0];
  same([fn.name, fn.section, fn.size, fn.instructionCount, fn.nextGlobalOffset],
    ["func_001849DC", ".text.func_001849DC", 200, 50, 208], "function contract");
  same(fn.branches.map(({ offset, kind, addend, condition, transfer, symbol }) =>
    [offset, kind, addend, condition ?? "always", transfer, symbol]), [
      [92, "R_ARM_CALL", 0, "always", "linked", "func_00184990"],
      [104, "R_ARM_CALL", 0, "not-equal", "linked", "func_0018B220"],
      [164, "R_ARM_CALL", 0, "always", "linked", "func_00185E38"],
      [176, "R_ARM_CALL", 0, "always", "linked", "func_0018B348"],
      [184, "R_ARM_CALL", 0, "always", "linked", "func_00185E9C"],
    ], "branch contract");
  same(fn.literals.map(({ offset, loadOffsets, symbol, relocation, addend }) =>
    [offset, loadOffsets, symbol, relocation, addend]), [
      [200, [44], "service_object_descriptor_97", "R_ARM_ABS32", 0],
      [204, [68], "service_object_vtable_97", "R_ARM_ABS32", 0],
    ], "literal contract");
  equal(config.objectMetadataContract.armAttributes.cpuArchitecture, "v6K", "CPU architecture attribute");
  equal(config.objectMetadataContract.armAttributes.floatingPointArchitecture, "VFPv2", "FP attribute");
  invariant(/^[0-9a-f]{64}$/.test(config.sourceHash), "sourceHash is not a pinned SHA-256");
  const digest = sha256(source);
  equal(digest, config.sourceHash, "source hash");
}

function cString(buffer, offset) {
  invariant(offset >= 0 && offset < buffer.length, `string offset ${offset} is out of range`);
  const end = buffer.indexOf(0, offset);
  invariant(end !== -1, `unterminated string at ${offset}`);
  return buffer.toString("utf8", offset, end);
}

function parseElf(buffer) {
  enforceLimits({ fileSize: buffer.length });
  invariant(buffer.length >= 52, "object is shorter than an ELF32 header");
  same([...buffer.subarray(0, 7)], [0x7f, 0x45, 0x4c, 0x46, 1, 1, 1], "ELF identity");
  invariant(buffer.subarray(7, 16).every((byte) => byte === 0), "noncanonical ELF identity padding");
  const u16 = (at) => buffer.readUInt16LE(at);
  const u32 = (at) => buffer.readUInt32LE(at);
  equal(u16(16), 1, "ELF type");
  equal(u16(18), 40, "ELF machine");
  equal(u32(20), 1, "ELF version");
  equal(u32(24), 0, "entry point");
  equal(u32(28), 0, "program-header offset");
  equal(u32(36), 0x05000000, "ARM flags");
  equal(u16(40), 52, "ELF header size");
  equal(u16(42), 0, "program-header entry size");
  equal(u16(44), 0, "program-header count");
  equal(u16(46), 40, "section-header entry size");
  const shoff = u32(32);
  const shnum = u16(48);
  const shstrndx = u16(50);
  invariant(shnum > 0 && shstrndx < shnum, "invalid section table");
  enforceLimits({ fileSize: buffer.length, sectionCount: shnum });
  invariant(shoff + shnum * 40 <= buffer.length, "truncated section table");
  const sections = Array.from({ length: shnum }, (_, index) => {
    const at = shoff + index * 40;
    return {
      index, nameOffset: u32(at), type: u32(at + 4), flags: u32(at + 8),
      addr: u32(at + 12), offset: u32(at + 16), size: u32(at + 20),
      link: u32(at + 24), info: u32(at + 28), align: u32(at + 32), entsize: u32(at + 36),
    };
  });
  invariant(buffer.subarray(shoff, shoff + 40).every((byte) => byte === 0), "null section is not canonical");
  const shstr = sections[shstrndx];
  invariant(shstr.offset + shstr.size <= buffer.length, "truncated section-name table");
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(names, section.nameOffset);
  for (const section of sections) {
    if (section.type !== 8) invariant(section.offset + section.size <= buffer.length, `truncated ${section.name}`);
  }
  const execSize = sections.reduce((sum, section) => sum + ((section.flags & 4) ? section.size : 0), 0);
  const symbolCount = sections.filter((section) => section.type === 2 || section.type === 11)
    .reduce((sum, section) => sum + (section.entsize ? section.size / section.entsize : MAX_SYMBOLS + 1), 0);
  const relocationCount = sections.filter((section) => section.type === 4 || section.type === 9)
    .reduce((sum, section) => sum + (section.entsize ? section.size / section.entsize : MAX_RELOCS + 1), 0);
  enforceLimits({ fileSize: buffer.length, execSize, sectionCount: shnum, symbolCount, relocationCount });
  return { buffer, sections };
}

const expectedWords = [
  0xe92d4030, 0xe24dd02c, 0xe1a04000, 0xe3a01000, 0xe5a01004,
  0xe3a02005, 0xe5801008, 0xe3a03040, 0xe2800004, 0xe3a0c001,
  0xe580c004, 0xe59fc094, 0xe5c01008, 0xe580100c, 0xe580c000,
  0xe5801010, 0xe5801014, 0xe59f1080, 0xe3a00001, 0xe5841000,
  0xe1c422f0, 0xe5c4022a, 0xe3a00030, 0xebfffffe, 0xe3500000,
  0x13a01202, 0x1bfffffe, 0xe584022c, 0xe3a01043, 0xe5cd1000,
  0xe3a02044, 0xe5cd2001, 0xe3a03026, 0xe3a0c04d, 0xe3a0504c,
  0xe5cd3002, 0xe28d0008, 0xe3a02005, 0xe1a0100d, 0xe5cdc003,
  0xe5cd5004, 0xebfffffe, 0xe28d1008, 0xe1a00004, 0xebfffffe,
  0xe28d0008, 0xebfffffe, 0xe28dd02c, 0xe1a00004, 0xe8bd8030,
  0x00000000, 0x00000000,
];

function parseSymbols(elf, symtab) {
  equal(symtab.type, 2, "symbol-table section type");
  equal(symtab.entsize, 16, "symbol-table entry size");
  invariant(symtab.link < elf.sections.length, "invalid symbol string-table link");
  const stringsSection = elf.sections[symtab.link];
  const strings = elf.buffer.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size);
  return Array.from({ length: symtab.size / 16 }, (_, index) => {
    const at = symtab.offset + index * 16;
    const info = elf.buffer[at + 12];
    const other = elf.buffer[at + 13];
    return {
      index, name: cString(strings, elf.buffer.readUInt32LE(at)),
      value: elf.buffer.readUInt32LE(at + 4), size: elf.buffer.readUInt32LE(at + 8),
      bind: info >>> 4, type: info & 15, visibility: other & 3,
      other, shndx: elf.buffer.readUInt16LE(at + 14),
    };
  });
}

function validateObject(buffer) {
  const elf = parseElf(buffer);
  const owned = elf.sections.find((section) => section.name === ".text.func_001849DC");
  invariant(owned, "missing owned section");
  same([owned.type, owned.flags, owned.addr, owned.size, owned.align], [1, 6, 0, 208, 4], "owned section metadata");
  equal(elf.sections.filter((section) => section.name === owned.name).length, 1, "owned section multiplicity");
  const words = Array.from({ length: 52 }, (_, i) => elf.buffer.readUInt32LE(owned.offset + i * 4));
  same(words, expectedWords, "owned instruction and pool words");

  const symtabs = elf.sections.filter((section) => section.type === 2);
  equal(symtabs.length, 1, "symbol-table count");
  const symbols = parseSymbols(elf, symtabs[0]);
  invariant(symbols.length > 0 && symbols[0].name === "" && symbols[0].value === 0 && symbols[0].size === 0 &&
    symbols[0].bind === 0 && symbols[0].type === 0 && symbols[0].other === 0 && symbols[0].shndx === 0,
  "null symbol is not canonical");
  const ownedSymbols = symbols.filter((symbol) => symbol.shndx === owned.index)
    .map(({ name, value, size, bind, type, visibility }) => ({ name, value, size, bind, type, visibility }));
  same(ownedSymbols, [
    { name: "", value: 0, size: 0, bind: 0, type: 3, visibility: 0 },
    { name: "$a", value: 0, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "$d", value: 200, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "func_001849DC", value: 0, size: 200, bind: 1, type: 2, visibility: 0 },
  ], "owned symbols");
  const expectedUndefined = ["func_00184990", "func_0018B220", "func_00185E38", "func_0018B348",
    "func_00185E9C", "service_object_descriptor_97", "service_object_vtable_97"];
  const undefinedSymbols = symbols.filter((symbol) => symbol.index !== 0 && symbol.shndx === 0);
  same(undefinedSymbols.map((symbol) => symbol.name), expectedUndefined, "undefined symbols");
  invariant(undefinedSymbols.every((symbol) => symbol.bind === 1 && symbol.type === 0 && symbol.visibility === 0 &&
    symbol.other === 0 && symbol.value === 0 && symbol.size === 0), "undefined symbol metadata mismatch");

  const relSections = elf.sections.filter((section) => section.type === 9 && section.info === owned.index);
  equal(relSections.length, 1, "owned relocation-section count");
  const rel = relSections[0];
  equal(rel.entsize, 8, "REL entry size");
  equal(rel.link, symtabs[0].index, "REL symbol-table link");
  const relocations = Array.from({ length: rel.size / 8 }, (_, index) => {
    const at = rel.offset + index * 8;
    const info = elf.buffer.readUInt32LE(at + 4);
    return [elf.buffer.readUInt32LE(at), info & 0xff, symbols[info >>> 8]?.name];
  });
  same(relocations, [
    [92, 28, "func_00184990"], [104, 28, "func_0018B220"],
    [164, 28, "func_00185E38"], [176, 28, "func_0018B348"],
    [184, 28, "func_00185E9C"], [200, 2, "service_object_descriptor_97"],
    [204, 2, "service_object_vtable_97"],
  ], "owned REL relocations");
  equal(elf.sections.filter((section) => (section.type === 4 || section.type === 9) && section.info === owned.index).length,
    1, "all owned relocation sections");

  const attributes = elf.sections.filter((section) => section.name === ".ARM.attributes");
  equal(attributes.length, 1, "ARM attributes section count");
  const attr = elf.buffer.subarray(attributes[0].offset, attributes[0].offset + attributes[0].size);
  equal(attr.toString("hex"), "411b000000616561626900011100000005364b000609080109010a02", "ARMv6K/VFPv2 attributes");
}

function findAssembler() {
  const candidates = [];
  if (process.env.ARM_AS) candidates.push(process.env.ARM_AS);
  candidates.push("arm-none-eabi-as");
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
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ipc97-"));
  const objectPath = path.join(directory, "arm_ipc_wrappers_97.o");
  const assembler = findAssembler();
  const result = spawnSync(assembler, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath],
    { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`assembler failed:\n${result.stderr || result.stdout}`);
  return { directory, objectPath };
}

function runSelfTests(validObject) {
  const changedSource = Buffer.from(fs.readFileSync(sourcePath));
  changedSource[changedSource.length - 1] ^= 1;
  invariantRejects(() => validateConfigAndSource(changedSource), "source-hash mutation");
  for (const [label, values] of [
    ["file limit", { fileSize: MAX_FILE + 1 }],
    ["executable limit", { execSize: MAX_EXEC + 1 }],
    ["section limit", { sectionCount: MAX_SECTIONS + 1 }],
    ["symbol limit", { symbolCount: MAX_SYMBOLS + 1 }],
    ["relocation limit", { relocationCount: MAX_RELOCS + 1 }],
  ]) invariantRejects(() => enforceLimits(values), label);
  for (const [label, mutate] of [
    ["instruction mutation", (copy, elf) => { const s = elf.sections.find((x) => x.name === ".text.func_001849DC"); copy[s.offset] ^= 1; }],
    ["relocation mutation", (copy, elf) => { const s = elf.sections.find((x) => x.type === 9 && elf.sections[x.info]?.name === ".text.func_001849DC"); copy[s.offset + 4] ^= 1; }],
    ["attribute mutation", (copy, elf) => { const s = elf.sections.find((x) => x.name === ".ARM.attributes"); copy[s.offset + s.size - 1] ^= 1; }],
  ]) {
    const copy = Buffer.from(validObject);
    mutate(copy, parseElf(copy));
    invariantRejects(() => validateObject(copy), label);
  }
}

function invariantRejects(action, label) {
  let rejected = false;
  try { action(); } catch { rejected = true; }
  invariant(rejected, `self-test did not reject ${label}`);
}

let temporary;
try {
  const args = process.argv.slice(2);
  invariant(args.every((arg) => arg === "--self-test" || arg === "--object" || !arg.startsWith("--")), "unknown option");
  const objectFlag = args.indexOf("--object");
  const explicit = objectFlag === -1 ? args.find((arg) => arg !== "--self-test") : args[objectFlag + 1];
  if (objectFlag !== -1) invariant(explicit && explicit !== "--self-test", "--object requires a path");
  validateConfigAndSource();
  let objectPath = explicit && path.resolve(explicit);
  if (!objectPath) {
    temporary = assemble();
    objectPath = temporary.objectPath;
  }
  const object = fs.readFileSync(objectPath);
  validateObject(object);
  if (args.includes("--self-test")) runSelfTests(object);
  console.log(`arm-ipc-wrappers-97: PASS${args.includes("--self-test") ? " (self-tests PASS)" : ""}`);
} catch (error) {
  console.error(`arm-ipc-wrappers-97: FAIL: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary.directory, { recursive: true, force: true });
}
