#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "config/arm-ipc-wrappers-99.json");
const specPath = path.join(root, "docs/specs/main/arm_ipc_wrappers_99.md");
const configBytes = fs.readFileSync(configPath);
const config = JSON.parse(configBytes);
const sourcePath = path.join(root, config.source);
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const CONFIG_HASH = "43ebfe68027b3f30104614522afd1d8c5a8b07fb4825d1e77c0fcdbeaad44587";
const NORMALIZED_CONFIG_HASH = "fd7be6bc356a9674184a98d8698d63b866ea306638083b6667442eb42e3b729e";
const SPEC_HASH = "75dd87ff64f4269531c575c66a39cc35fbc37bf4188a919c0756b3594776978b";

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
  equal(config.source, "src/main/arm_ipc_wrappers_99.S", "source path");
  equal(config.architecture, "ARMv6K", "architecture");
  equal(config.mode, "arm", "instruction mode");
  equal(config.totalBodySize, 276, "body size");
  equal(config.totalAdjacentSize, 0, "adjacent size");
  equal(config.cumulativePoolSlots, 898, "cumulative pool slots");
  equal(config.cumulativePoolClasses, 473, "cumulative pool classes");
  equal(config.functions.length, 1, "function count");
  const fn = config.functions[0];
  same([fn.name, fn.section, fn.size, fn.instructionCount, fn.localBranchCount, fn.nextGlobal, fn.nextGlobalOffset],
    ["func_0018538C", ".text.func_0018538C", 276, 69, 12, "func_001854A0", 276], "function contract");
  same(fn.branches, [], "external branch contract");
  same(fn.indirectCalls.map(({ offset, targetRegister, targetLoadOffset, dispatchTableOffset,
    receiverRegister, receiverIdentity, argumentRegister, argumentIdentity }) =>
    [offset, targetRegister, targetLoadOffset, dispatchTableOffset, receiverRegister, receiverIdentity,
      argumentRegister ?? null, argumentIdentity ?? null]), [
    [20, "r1", 12, 24, "r0", "entry-r0", null, null],
    [68, "r1", 60, 36, "r0", "entry-r0", null, null],
    [100, "r2", 92, 48, "r0", "entry-r0", "r1", "state-r5"],
    [152, "r2", 140, 48, "r0", "entry-r0", "r1", "state-2"],
    [180, "r2", 172, 20, "r0", "entry-r0", "r1", "state-2"],
    [200, "r1", 192, 32, "r0", "entry-r0", null, null],
    [232, "r2", 224, 48, "r0", "entry-r0", "r1", "state-4"],
    [260, "r2", 252, 20, "r0", "entry-r0", "r1", "state-4"],
  ], "indirect call contract");
  same(fn.returnOffsets, [272], "return offsets");
  same(fn.literals, [], "literal contract");
  same(config.literalIdentities, [], "literal identities");
  same(config.reusedLiteralIdentities, [], "reused literal identities");
  same(config.newLiteralIdentities, [], "new literal identities");
  equal(config.objectMetadataContract.armAttributes.cpuName, "6K", "CPU name attribute");
  equal(config.objectMetadataContract.armAttributes.cpuArchitecture, "v6K", "CPU architecture attribute");
  equal(config.objectMetadataContract.armAttributes.thumbIsaUse, "Thumb-1", "Thumb ISA attribute");
  equal(config.objectMetadataContract.armAttributes.floatingPointArchitecture, "VFPv2", "FP attribute");
  invariant(/^[0-9a-f]{64}$/.test(config.sourceHash), "sourceHash is not a pinned SHA-256");
  equal(sha256(source), config.sourceHash, "source hash");
}

function cString(buffer, offset) {
  invariant(Number.isInteger(offset) && offset >= 0 && offset < buffer.length,
    `string offset ${offset} is out of range`);
  const end = buffer.indexOf(0, offset);
  invariant(end !== -1, `unterminated string at ${offset}`);
  return buffer.toString("utf8", offset, end);
}

function boundedRange(offset, size, limit, label) {
  invariant(Number.isInteger(offset) && Number.isInteger(size) && offset >= 0 && size >= 0 &&
    offset <= limit && size <= limit - offset, `truncated ${label}`);
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
  boundedRange(shoff, shnum * 40, buffer.length, "section table");
  const sections = Array.from({ length: shnum }, (_, index) => {
    const headerOffset = shoff + index * 40;
    return {
      index, headerOffset, nameOffset: u32(headerOffset), type: u32(headerOffset + 4),
      flags: u32(headerOffset + 8), addr: u32(headerOffset + 12), offset: u32(headerOffset + 16),
      size: u32(headerOffset + 20), link: u32(headerOffset + 24), info: u32(headerOffset + 28),
      align: u32(headerOffset + 32), entsize: u32(headerOffset + 36),
    };
  });
  invariant(buffer.subarray(shoff, shoff + 40).every((byte) => byte === 0), "null section is not canonical");
  const shstr = sections[shstrndx];
  boundedRange(shstr.offset, shstr.size, buffer.length, "section-name table");
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(names, section.nameOffset);
  let execSize = 0;
  let symbolCount = 0;
  let relocationCount = 0;
  for (const section of sections) {
    if (section.type !== 8) boundedRange(section.offset, section.size, buffer.length, section.name || "section");
    if (section.flags & 4) execSize += section.size;
    if (section.type === 2 || section.type === 11) {
      invariant(section.entsize > 0 && section.size % section.entsize === 0, `invalid ${section.name} entry size`);
      symbolCount += section.size / section.entsize;
    }
    if (section.type === 4 || section.type === 9) {
      invariant(section.entsize > 0 && section.size % section.entsize === 0, `invalid ${section.name} entry size`);
      relocationCount += section.size / section.entsize;
    }
  }
  enforceLimits({ fileSize: buffer.length, execSize, sectionCount: shnum, symbolCount, relocationCount });
  return { buffer, sections };
}

const expectedWords = [
  0xe92d4070, 0xe1a04000, 0xe5940000, 0xe5901018, 0xe1a00004,
  0xe12fff31, 0xe1d451b4, 0xe3550004, 0x0a00003a, 0xca000012,
  0xe3550001, 0x0a000014, 0xe3550002, 0x1a000035, 0xe5940000,
  0xe5901024, 0xe1a00004, 0xe12fff31, 0xe3500000, 0x13a05004,
  0x0a00002d, 0xe5940000, 0xe1a01005, 0xe5902030, 0xe1a00004,
  0xe12fff32, 0xe3500000, 0x0a000026, 0xea00001f, 0xe3550008,
  0x0a000024, 0xe3550040, 0x1a000022, 0xe5940000, 0xe3a05002,
  0xe5902030, 0xe1a01005, 0xe1a00004, 0xe12fff32, 0xe3500000,
  0x0a000005, 0xe5940000, 0xe1a01005, 0xe5902014, 0xe1a00004,
  0xe12fff32, 0xe1c451b4, 0xe5940000, 0xe5901020, 0xe1a00004,
  0xe12fff31, 0xe3500000, 0x13a05004, 0x0a00000c, 0xe5940000,
  0xe1a01005, 0xe5902030, 0xe1a00004, 0xe12fff32, 0xe3500000,
  0x0a000005, 0xe5940000, 0xe1a01005, 0xe5902014, 0xe1a00004,
  0xe12fff32, 0xe1c451b4, 0xe1d401b4, 0xe8bd8070,
];

function parseSymbols(elf, symtab) {
  equal(symtab.type, 2, "symbol-table section type");
  equal(symtab.entsize, 16, "symbol-table entry size");
  invariant(symtab.link < elf.sections.length, "invalid symbol string-table link");
  const stringsSection = elf.sections[symtab.link];
  invariant(stringsSection.type === 3, "symbol names do not use a string table");
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
  const owned = elf.sections.find((section) => section.name === ".text.func_0018538C");
  invariant(owned, "missing owned section");
  same(elf.sections.filter((section) => (section.flags & 4) !== 0 && section.size !== 0)
    .map((section) => section.name), [".text.func_0018538C"],
  "nonempty executable section set");
  same([owned.type, owned.flags, owned.addr, owned.size, owned.align], [1, 6, 0, 276, 4],
    "owned section metadata");
  equal(elf.sections.filter((section) => section.name === owned.name).length, 1, "owned section multiplicity");
  const words = Array.from({ length: 69 }, (_, i) => elf.buffer.readUInt32LE(owned.offset + i * 4));
  same(words, expectedWords, "owned instruction words");

  const symtabs = elf.sections.filter((section) => section.type === 2);
  equal(symtabs.length, 1, "symbol-table count");
  equal(elf.sections.filter((section) => section.type === 11).length, 0, "dynamic symbol-table count");
  const symbols = parseSymbols(elf, symtabs[0]);
  invariant(symbols.length > 0 && symbols[0].name === "" && symbols[0].value === 0 && symbols[0].size === 0 &&
    symbols[0].bind === 0 && symbols[0].type === 0 && symbols[0].other === 0 && symbols[0].shndx === 0,
  "null symbol is not canonical");
  const ownedSymbols = symbols.filter((symbol) => symbol.shndx === owned.index)
    .map(({ name, value, size, bind, type, visibility }) => ({ name, value, size, bind, type, visibility }));
  same(ownedSymbols, [
    { name: "", value: 0, size: 0, bind: 0, type: 3, visibility: 0 },
    { name: "$a", value: 0, size: 0, bind: 0, type: 0, visibility: 0 },
    { name: "func_0018538C", value: 0, size: 276, bind: 1, type: 2, visibility: 0 },
  ], "owned symbols");
  same(symbols.filter((symbol) => symbol.name !== "").map((symbol) => symbol.name),
    ["$a", "func_0018538C"], "named symbol set");
  equal(symbols.filter((symbol) => symbol.index !== 0 && symbol.shndx === 0).length, 0, "undefined symbols");
  equal(elf.sections.filter((section) => section.type === 4 || section.type === 9).length,
    0, "relocation sections");

  const attributes = elf.sections.filter((section) => section.name === ".ARM.attributes");
  equal(attributes.length, 1, "ARM attributes section count");
  const attr = elf.buffer.subarray(attributes[0].offset, attributes[0].offset + attributes[0].size);
  equal(attr.toString("hex"), "411b000000616561626900011100000005364b000609080109010a02",
    "ARMv6K/VFPv2 attributes");
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
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ipc99-"));
  const objectPath = path.join(directory, "arm_ipc_wrappers_99.o");
  const assembler = findAssembler();
  const result = spawnSync(assembler, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath],
    { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`assembler failed:\n${result.stderr || result.stdout}`);
  return { directory, objectPath };
}

function invariantRejects(action, label) {
  let rejected = false;
  try { action(); } catch { rejected = true; }
  invariant(rejected, `self-test did not reject ${label}`);
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
    ["instruction mutation", (copy, elf) => {
      const section = elf.sections.find((item) => item.name === ".text.func_0018538C");
      copy[section.offset] ^= 1;
    }],
    ["symbol mutation", (copy, elf) => {
      const symtab = elf.sections.find((item) => item.type === 2);
      copy[symtab.offset + symtab.size - 4] ^= 1;
    }],
    ["relocation-section mutation", (copy, elf) => {
      const owned = elf.sections.find((item) => item.name === ".text.func_0018538C");
      const empty = elf.sections.find((item) => item.name === ".text");
      copy.writeUInt32LE(9, empty.headerOffset + 4);
      copy.writeUInt32LE(owned.index, empty.headerOffset + 28);
      copy.writeUInt32LE(8, empty.headerOffset + 36);
    }],
    ["foreign executable payload", (copy, elf) => {
      const attributes = elf.sections.find((item) => item.name === ".ARM.attributes");
      copy.writeUInt32LE(attributes.flags | 4, attributes.headerOffset + 8);
    }],
    ["attribute mutation", (copy, elf) => {
      const section = elf.sections.find((item) => item.name === ".ARM.attributes");
      copy[section.offset + section.size - 1] ^= 1;
    }],
  ]) {
    const copy = Buffer.from(validObject);
    mutate(copy, parseElf(copy));
    invariantRejects(() => validateObject(copy), label);
  }
}

let temporary;
try {
  const args = process.argv.slice(2);
  invariant(args.every((arg) => arg === "--self-test" || arg === "--object" || !arg.startsWith("--")),
    "unknown option");
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
  console.log(`arm-ipc-wrappers-99: PASS${args.includes("--self-test") ? " (self-tests PASS)" : ""}`);
} catch (error) {
  console.error(`arm-ipc-wrappers-99: FAIL: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary.directory, { recursive: true, force: true });
}
