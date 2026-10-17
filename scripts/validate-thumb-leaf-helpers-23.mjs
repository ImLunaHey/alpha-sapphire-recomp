#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/thumb-leaf-helpers-23.json");
const specPath = join(root, "docs/specs/main/thumb_leaf_helpers_23.md");
const sourcePath = join(root, "src/main/thumb_leaf_helpers_23.S");
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const ENTRY_MOD4 = 2;
const expectedRawConfigHash = "28cbf2f5341c00b83f52ed6df76eb879ae5df574b92fdff40dc57855f1fb96f4";
const expectedConfigHash = "b7d48fe211af101bc6955a73590a860b68ec1a6b72939596b6797a534c2f429d";
const expectedSourceHash = "bf7c3dd070ce117b66e7f1177b1271a2dcfa2ad3c8c2689a6729039ad5a9a35e";
const expectedSpecHash = "0a832df723cb0bf3c16dac6dfb1f6614add0bfef679054715a8d55a3f44bcc5a";
const expectedBodyHash = "85206a504e45d65dda527afa4bd216495acf28e6a9e7a6805b16588a56b8b27b";
const expectedLinkedHash = "82f87bccec1cefbcab16e903be83ccd58293d54006292239dec697316c91d6d1";
const expectedAttributes = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const expectedText = Buffer.from(
  "f8b506000c00150088070ad5234811007844fff7feef07003bd0fff7feef7f1c" +
  "4760e0070ad01c48290078441a38fff7feef07002dd0fff7feef076060070ad5" +
  "1648290078443438c046c046070020d0fff7feef876020070ad50f4829007844" +
  "4e38fff7feef070013d0fff7feefc760e0060ad50948290078446838c046c046" +
  "050006d0fff7feef056121003000fff7fefff8bd",
  "hex",
);

const callContract = [
  [18, "func_0016F3FC", -1651634, "arm"],
  [26, "func_002FF7EC", -12226, "arm"],
  [46, "func_0052AEC4", 2262806, "arm"],
  [54, "func_002FF7EC", -12226, "arm"],
  [80, "func_002FF7EC", -12226, "arm"],
  [98, "func_00193C20", -1502094, "arm"],
  [106, "func_002FF7EC", -12226, "arm"],
  [132, "func_002FF7EC", -12226, "arm"],
  [142, "func_003026AC", -258, "thumb"],
];

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function applyThumbCall(text, place, entryRelativeTarget, state) {
  const base = state === "arm"
    ? ((ENTRY_MOD4 + place + 4) & ~3) - ENTRY_MOD4
    : place + 4;
  const displacement = entryRelativeTarget - base;
  assert.equal(displacement & 1, 0, "call displacement is not halfword-aligned");
  if (state === "arm") assert.equal(displacement & 3, 0, "BLX displacement is not word-aligned");
  assert.ok(displacement >= -0x400000 && displacement < 0x400000, "Thumb-1 call displacement is out of range");
  const linked = Buffer.from(text);
  linked.writeUInt16LE(0xf000 | ((displacement >> 12) & 0x7ff), place);
  linked.writeUInt16LE((state === "arm" ? 0xe800 : 0xf800) | ((displacement >> 1) & 0x7ff), place + 2);
  return linked;
}

function linkedSemanticText() {
  let linked = Buffer.from(expectedText);
  for (const [place, , target, state] of callContract) linked = applyThumbCall(linked, place, target, state);
  return linked;
}

function enforceLimits({ fileSize = 0, execSize = 0, sectionCount = 0, symbolCount = 0, relocationCount = 0 }) {
  assert.ok(fileSize <= MAX_FILE, "complete input exceeds 64 MiB");
  assert.ok(execSize <= MAX_EXEC, "aggregate executable data exceeds 16 MiB");
  assert.ok(sectionCount <= MAX_SECTIONS, "section count exceeds 16,384");
  assert.ok(symbolCount <= MAX_SYMBOLS, "aggregate symbol count exceeds 1,000,000");
  assert.ok(relocationCount <= MAX_RELOCS, "aggregate relocation count exceeds 1,000,000");
}

function validatePublicInputs(config, source, configBytes, spec) {
  assert.equal(sha256(configBytes), expectedRawConfigHash, "raw configuration contract changed");
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  assert.equal(sha256(stable(normalized)), expectedConfigHash, "normalized configuration contract changed");
  assert.equal(config.sourceHash, expectedSourceHash, "configuration sourceHash is not pinned correctly");
  assert.equal(sha256(source), expectedSourceHash, "source does not match its pinned digest");
  assert.equal(sha256(spec), expectedSpecHash, "specification does not match its pinned digest");
  assert.equal(config.source, "src/main/thumb_leaf_helpers_23.S");
  assert.equal(config.architecture, "ARMv6K");
  assert.equal(config.mode, "thumb");
  assert.equal(config.minimumAlignment, 2);
  assert.equal(config.requiredEntryModulo4, ENTRY_MOD4);
  assert.equal(Number.parseInt("003027AE", 16) % 4, ENTRY_MOD4);
  assert.equal(config.totalBodySize, 148);
  assert.equal(config.totalAdjacentSize, 0);
  assert.equal(config.expectedInstructionCount, 65);
  assert.equal(config.wideInstructionCount, 9);
  assert.equal(config.legacyNopCount, 4);
  assert.equal(config.localBranchCount, 10);
  assert.equal(config.memoryOperationCount, 10);
  assert.equal(config.returnCount, 1);
  assert.equal(config.indirectCallCount, 0);
  assert.equal(config.directCallCount, 9);
  assert.equal(config.functions.length, 1);
  assert.equal(config.functions[0].name, "func_003027AE");
  assert.equal(config.functions[0].semantics.length, 65);
  assert.equal(config.functions[0].semantics.reduce((sum, row) => sum + row.width, 0), 148);
  assert.ok(config.functions[0].semantics.every((row, index, rows) =>
    row.offset === (index === 0 ? 0 : rows[index - 1].offset + rows[index - 1].width)),
  "semantic rows are not contiguous");
  assert.deepEqual(config.pcRelativeDataAccesses.map((row) => [row.offset, row.targetOffset, row.requiredEntryModulo4]),
    [[12, 154, 2], [38, 154, 2], [64, 154, 2], [90, 154, 2], [116, 154, 2]],
    "PC-relative placement contract changed");
  assert.equal(expectedText.length, 148);
  assert.equal(sha256(expectedText), expectedBodyHash, "relocatable body digest changed");
  assert.equal(sha256(linkedSemanticText()), expectedLinkedHash, "linked semantic body digest changed");
  assert.doesNotMatch(source, /^\s*\.(?:byte|hword|short|word|long|quad|incbin|space|skip|fill)\b/m,
    "data or padding emission is forbidden in the owned interval");
  assert.doesNotMatch(source, /^\s*\.ltorg\b/m, "literal-pool emission is forbidden");
}

function parseElf(bytes) {
  enforceLimits({ fileSize: bytes.length });
  assert.ok(bytes.length >= 52, "truncated ELF header");
  assert.equal(bytes.subarray(0, 4).toString("hex"), "7f454c46", "not an ELF file");
  assert.equal(bytes[4], 1, "object is not ELF32");
  assert.equal(bytes[5], 1, "object is not little-endian");
  assert.equal(bytes[6], 1, "wrong ELF identification version");
  assert.equal(bytes[7], 0, "wrong OS ABI");
  assert.equal(bytes[8], 0, "wrong ABI version");
  assert.ok(bytes.subarray(9, 16).every((byte) => byte === 0), "noncanonical ELF identification padding");
  assert.equal(bytes.readUInt16LE(16), 1, "object is not ET_REL");
  assert.equal(bytes.readUInt16LE(18), 40, "object machine is not EM_ARM");
  assert.equal(bytes.readUInt32LE(20), 1, "wrong ELF version");
  assert.equal(bytes.readUInt32LE(24), 0, "nonzero ELF entry point");
  assert.equal(bytes.readUInt32LE(28), 0, "relocatable object has a program-header table");
  assert.equal(bytes.readUInt32LE(36), 0x05000000, "wrong ARM ELF flags");
  assert.equal(bytes.readUInt16LE(40), 52, "unexpected ELF header size");
  assert.equal(bytes.readUInt16LE(42), 0, "unexpected program-header entry size");
  assert.equal(bytes.readUInt16LE(44), 0, "unexpected program-header count");

  const shoff = bytes.readUInt32LE(32);
  const shentsize = bytes.readUInt16LE(46);
  const shnum = bytes.readUInt16LE(48);
  const shstrndx = bytes.readUInt16LE(50);
  assert.equal(shentsize, 40, "unexpected section header size");
  assert.ok(shnum > 0, "extended or empty section numbering is forbidden");
  enforceLimits({ fileSize: bytes.length, sectionCount: shnum });
  assert.ok(shstrndx < shnum, "invalid section-name table index");
  assert.ok(shoff <= bytes.length && shnum * shentsize <= bytes.length - shoff,
    "truncated section header table");
  const rawSections = Array.from({ length: shnum }, (_, index) => {
    const at = shoff + index * shentsize;
    return {
      index, headerOffset: at, nameOffset: bytes.readUInt32LE(at), type: bytes.readUInt32LE(at + 4),
      flags: bytes.readUInt32LE(at + 8), addr: bytes.readUInt32LE(at + 12), offset: bytes.readUInt32LE(at + 16),
      size: bytes.readUInt32LE(at + 20), link: bytes.readUInt32LE(at + 24),
      info: bytes.readUInt32LE(at + 28), align: bytes.readUInt32LE(at + 32), entsize: bytes.readUInt32LE(at + 36),
    };
  });
  assert.ok(rawSections[0] && Object.entries(rawSections[0])
    .filter(([key]) => key !== "index" && key !== "headerOffset").every(([, value]) => value === 0),
    "null section is not canonical");
  const shstr = rawSections[shstrndx];
  assert.equal(shstr.type, 3, "section-name table is not SHT_STRTAB");
  for (const section of rawSections) {
    if (section.type !== 8) {
      assert.ok(section.offset <= bytes.length && section.size <= bytes.length - section.offset,
        "section data is out of range");
    }
  }
  const cstring = (section, offset) => {
    assert.ok(offset < section.size, "string-table offset is out of range");
    const begin = section.offset + offset;
    const end = bytes.indexOf(0, begin);
    assert.ok(end >= begin && end < section.offset + section.size, "unterminated string-table entry");
    return bytes.toString("utf8", begin, end);
  };
  const sections = rawSections.map((section) => ({ ...section, name: cstring(shstr, section.nameOffset) }));
  const execSize = sections.reduce((sum, section) => sum + ((section.flags & 4) ? section.size : 0), 0);
  let symbolCount = 0;
  let relocationCount = 0;
  for (const section of sections) {
    if (section.type === 2 || section.type === 11) {
      assert.equal(section.entsize, 16, `invalid symbol entry size in ${section.name}`);
      assert.equal(section.size % 16, 0, `partial symbol entry in ${section.name}`);
      symbolCount += section.size / 16;
    }
    if (section.type === 9 || section.type === 4) {
      const width = section.type === 9 ? 8 : 12;
      assert.equal(section.entsize, width, `invalid relocation entry size in ${section.name}`);
      assert.equal(section.size % width, 0, `partial relocation entry in ${section.name}`);
      relocationCount += section.size / width;
    }
  }
  enforceLimits({ fileSize: bytes.length, execSize, sectionCount: shnum, symbolCount, relocationCount });
  return { bytes, sections, cstring, shoff, shentsize, shstr };
}

function readSymbols(elf, symtab) {
  assert.ok(symtab.link < elf.sections.length, "symbol string table index is invalid");
  const strtab = elf.sections[symtab.link];
  assert.ok(strtab && strtab.type === 3, "symbol string table is invalid");
  const symbols = [];
  for (let offset = 0; offset < symtab.size; offset += symtab.entsize) {
    const at = symtab.offset + offset;
    symbols.push({
      index: symbols.length, entryOffset: at, name: elf.cstring(strtab, elf.bytes.readUInt32LE(at)),
      value: elf.bytes.readUInt32LE(at + 4), size: elf.bytes.readUInt32LE(at + 8),
      bind: elf.bytes[at + 12] >>> 4, type: elf.bytes[at + 12] & 15,
      other: elf.bytes[at + 13], shndx: elf.bytes.readUInt16LE(at + 14),
    });
  }
  return symbols;
}

function validateObject(objectBytes) {
  const elf = parseElf(objectBytes);
  const textSections = elf.sections.filter((section) => section.name === ".text.func_003027AE");
  assert.equal(textSections.length, 1, "expected one owned executable section");
  const text = textSections[0];
  assert.deepEqual(elf.sections.filter((section) => (section.flags & 4) !== 0 && section.size !== 0).map((section) => section.name),
    [".text.func_003027AE"], "object contains executable bytes outside the owned section");
  assert.deepEqual({ type: text.type, flags: text.flags, size: text.size, align: text.align },
    { type: 1, flags: 6, size: 148, align: 2 }, "executable section contract mismatch");
  assert.equal(text.addr, 0, "owned section address is not zero in ET_REL");
  assert.deepEqual(elf.bytes.subarray(text.offset, text.offset + text.size), expectedText,
    "assembled Thumb body differs from the semantic encoding contract");

  const symtabs = elf.sections.filter((section) => section.type === 2);
  assert.equal(symtabs.length, 1, "expected exactly one symbol table");
  assert.equal(elf.sections.filter((section) => section.type === 11).length, 0, "DYNSYM is forbidden");
  const symtab = symtabs[0];
  const symbols = readSymbols(elf, symtab);
  assert.deepEqual(symbols[0], { index: 0, entryOffset: symbols[0].entryOffset, name: "", value: 0,
    size: 0, bind: 0, type: 0, other: 0, shndx: 0 }, "null symbol is not canonical");
  assert.ok(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0),
    "symbol-table local/global partition is invalid");
  const named = (name) => symbols.filter((symbol) => symbol.name === name);
  const primary = named("func_003027AE");
  assert.equal(primary.length, 1, "expected one primary symbol");
  assert.deepEqual({ name: primary[0].name, value: primary[0].value, size: primary[0].size, bind: primary[0].bind,
    type: primary[0].type, other: primary[0].other, shndx: primary[0].shndx },
  { name: "func_003027AE", value: 1, size: 148, bind: 1, type: 2, other: 0, shndx: text.index });
  const mapping = named("$t");
  assert.equal(mapping.length, 1, "expected one canonical Thumb mapping symbol");
  assert.deepEqual({ name: mapping[0].name, value: mapping[0].value, size: mapping[0].size, bind: mapping[0].bind,
    type: mapping[0].type, other: mapping[0].other, shndx: mapping[0].shndx },
  { name: "$t", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: text.index });
  const sectionSymbols = symbols.filter((symbol) => symbol.type === 3 && symbol.shndx === text.index);
  assert.equal(sectionSymbols.length, 1, "expected one owned section symbol");
  assert.deepEqual({ name: sectionSymbols[0].name, value: sectionSymbols[0].value, size: sectionSymbols[0].size,
    bind: sectionSymbols[0].bind, other: sectionSymbols[0].other },
  { name: "", value: 0, size: 0, bind: 0, other: 0 });

  const externals = ["func_0016F3FC", "func_002FF7EC", "func_0052AEC4", "func_00193C20", "func_003026AC"];
  assert.deepEqual(symbols.filter((symbol) => symbol.name !== "").map((symbol) => symbol.name),
    ["$t", "func_003027AE", ...externals], "named symbol set/order is not exact");
  for (const name of externals) {
    const entries = named(name);
    assert.equal(entries.length, 1, `expected one ${name} symbol`);
    assert.deepEqual({ value: entries[0].value, size: entries[0].size, bind: entries[0].bind,
      type: entries[0].type, other: entries[0].other, shndx: entries[0].shndx },
    { value: 0, size: 0, bind: 1, type: 2, other: 0, shndx: 0 }, `${name} metadata mismatch`);
  }
  assert.deepEqual(symbols.filter((symbol) => symbol.shndx === text.index && symbol.name !== "" && symbol.name !== "$t")
    .map((symbol) => symbol.name), ["func_003027AE"], "named alias in owned section");
  assert.equal(symbols.filter((symbol) => symbol.shndx === text.index).length, 3,
    "unexpected unnamed alias or mapping symbol in owned section");
  assert.deepEqual(symbols.filter((symbol) => symbol.shndx === 0 && symbol.bind === 1 && symbol.type === 2)
    .map((symbol) => symbol.name), externals, "unexpected or reordered undefined function identities");

  assert.equal(elf.sections.filter((section) => section.type === 4).length, 0, "SHT_RELA is forbidden");
  const allRelocs = elf.sections.filter((section) => section.type === 9);
  assert.equal(allRelocs.length, 1, "unexpected additional relocation section");
  const rel = allRelocs[0];
  assert.equal(rel.info, text.index, "relocation section targets the wrong section");
  assert.equal(rel.link, symtab.index, "relocation section has wrong symbol table");
  assert.equal(rel.entsize, 8, "unexpected REL entry size");
  assert.equal(rel.size, 72, "expected exactly nine relocations");
  const actualRelocs = [];
  for (let offset = 0; offset < rel.size; offset += rel.entsize) {
    const at = rel.offset + offset;
    const place = elf.bytes.readUInt32LE(at);
    const info = elf.bytes.readUInt32LE(at + 4);
    const symbol = symbols[info >>> 8];
    assert.ok(symbol, "relocation references invalid symbol");
    assert.equal(info & 0xff, 10, "relocation is not R_ARM_THM_CALL");
    assert.ok(place <= text.size - 4, "call relocation place is outside the owned section");
    const state = callContract.find((row) => row[0] === place)?.[3];
    assert.ok(state, "unexpected call relocation place");
    assert.equal(elf.bytes.readUInt16LE(text.offset + place), 0xf7ff, "call high half has wrong REL addend");
    assert.equal(elf.bytes.readUInt16LE(text.offset + place + 2), state === "arm" ? 0xeffe : 0xfffe,
      "call low half has wrong REL addend or state form");
    actualRelocs.push([place, symbol.name]);
  }
  assert.deepEqual(actualRelocs, callContract.map(([place, name]) => [place, name]),
    "call relocation identities/order mismatch");
  const attributes = elf.sections.filter((section) => section.name === ".ARM.attributes");
  assert.equal(attributes.length, 1, "expected one ARM attributes section");
  assert.equal(attributes[0].type, 0x70000003, "wrong ARM attributes section type");
  assert.deepEqual(elf.bytes.subarray(attributes[0].offset, attributes[0].offset + attributes[0].size), expectedAttributes,
    "ARMv6K/Thumb-1/VFPv2 attributes mismatch");
  return { elf, text, symtab, symbols, rel };
}

function validateTarget(targetBytes) {
  const elf = parseElf(targetBytes);
  const text = elf.sections.filter((section) => section.name === ".text.func_003027AE");
  assert.equal(text.length, 1, "authoritative target does not have exactly one candidate section");
  assert.deepEqual({ type: text[0].type, flags: text[0].flags, size: text[0].size, align: text[0].align },
    { type: 1, flags: 6, size: 148, align: 2 }, "authoritative target section contract mismatch");
  assert.deepEqual(elf.bytes.subarray(text[0].offset, text[0].offset + text[0].size), linkedSemanticText(),
    "candidate is not byte-identical with the authoritative target");
}

function runSelfTests(config, source, configBytes, spec) {
  validatePublicInputs(config, source, configBytes, spec);
  const reordered = Object.fromEntries(Object.entries(config).reverse());
  const reorderedNormalized = structuredClone(reordered);
  reorderedNormalized.sourceHash = null;
  assert.equal(sha256(stable(reorderedNormalized)), expectedConfigHash, "normalization depends on key order");
  assert.throws(() => validatePublicInputs({ ...config, totalBodySize: 146 }, source, configBytes, spec),
    /normalized configuration contract changed/);
  assert.throws(() => validatePublicInputs(config, `${source}\n`, configBytes, spec), /source does not match/);
  for (const [label, values] of [
    ["file", { fileSize: MAX_FILE + 1 }], ["executable", { execSize: MAX_EXEC + 1 }],
    ["section", { sectionCount: MAX_SECTIONS + 1 }], ["symbol", { symbolCount: MAX_SYMBOLS + 1 }],
    ["relocation", { relocationCount: MAX_RELOCS + 1 }],
  ]) assert.throws(() => enforceLimits(values), undefined, `${label} limit did not reject`);
  assert.throws(() => parseElf(Buffer.alloc(51)), /truncated ELF header/);
}

function findAssembler() {
  const candidates = process.env.ARM_AS ? [process.env.ARM_AS] :
    ["arm-none-eabi-as", "arm-linux-gnueabi-as", "arm-linux-gnueabihf-as"];
  try {
    for (const entry of readdirSync("/nix/store").sort()) {
      const candidate = join("/nix/store", entry, "bin/arm-none-eabi-as");
      if (existsSync(candidate)) candidates.push(candidate);
    }
  } catch {}
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (!result.error && result.status === 0) return candidate;
  }
  return null;
}

function assembleAndValidate() {
  const assembler = findAssembler();
  assert.ok(assembler, "no ARM GNU assembler found (set ARM_AS or pass --object PATH)");
  const scratch = mkdtempSync(join(tmpdir(), "thumb23-"));
  try {
    const output = join(scratch, "thumb_leaf_helpers_23.o");
    const result = spawnSync(assembler, ["-march=armv6k", "-mthumb", "-o", output, sourcePath], { encoding: "utf8" });
    assert.equal(result.status, 0, `${assembler} failed:\n${result.stderr || result.stdout}`);
    const valid = readFileSync(output);
    const baseline = validateObject(valid);
    const rejectObjectMutation = (label, mutation) => {
      const copy = Buffer.from(valid);
      mutation(copy, baseline);
      assert.throws(() => validateObject(copy), undefined, `${label} mutation was accepted`);
    };
    const rejectParseMutation = (label, mutation) => {
      const copy = Buffer.from(valid);
      mutation(copy, baseline);
      assert.throws(() => parseElf(copy), undefined, `${label} hostile ELF was accepted`);
    };
    rejectObjectMutation("instruction", (copy, state) => { copy[state.text.offset] ^= 1; });
    rejectObjectMutation("relocation", (copy, state) => { copy[state.rel.offset + 4] ^= 1; });
    rejectObjectMutation("invalid relocation symbol", (copy, state) => {
      copy.writeUInt32LE(0xffffff0a, state.rel.offset + 4);
    });
    rejectObjectMutation("attributes", (copy, state) => {
      copy[state.elf.sections.find((section) => section.name === ".ARM.attributes").offset + 1] ^= 1;
    });
    rejectObjectMutation("adjacent executable byte", (copy, state) => {
      copy.writeUInt32LE(state.text.size + 1, state.text.headerOffset + 20);
    });
    rejectObjectMutation("mapping symbol", (copy, state) => {
      const mapping = state.symbols.find((symbol) => symbol.name === "$t");
      copy.writeUInt32LE(2, mapping.entryOffset + 4);
    });
    rejectObjectMutation("primary symbol", (copy, state) => {
      const primary = state.symbols.find((symbol) => symbol.name === "func_003027AE");
      copy.writeUInt32LE(3, primary.entryOffset + 4);
    });
    rejectObjectMutation("RELA substitution", (copy, state) => { copy.writeUInt32LE(4, state.rel.headerOffset + 4); });
    rejectParseMutation("out-of-range section", (copy, state) => {
      copy.writeUInt32LE(copy.length, state.text.headerOffset + 16);
    });
    rejectParseMutation("unterminated section string table", (copy, state) => {
      copy[state.elf.shstr.offset + state.elf.shstr.size - 1] = 0x58;
    });
    const truncated = valid.subarray(0, baseline.elf.shoff + baseline.elf.shentsize * baseline.elf.sections.length - 1);
    assert.throws(() => parseElf(truncated), /truncated section header table/, "truncated section table was accepted");
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

const configBytes = readFileSync(configPath);
const config = JSON.parse(configBytes);
const source = readFileSync(sourcePath, "utf8");
const spec = readFileSync(specPath);
runSelfTests(config, source, configBytes, spec);

const args = process.argv.slice(2);
if (args.length === 0) {
  validatePublicInputs(config, source, configBytes, spec);
} else if (args.length === 1 && args[0] === "--self-test") {
  // Self-tests already ran before option dispatch.
} else if (args.length === 1 && args[0] === "--assemble") {
  assembleAndValidate();
} else if (args.length === 2 && args[0] === "--object") {
  assert.ok(existsSync(args[1]), `object does not exist: ${args[1]}`);
  validateObject(readFileSync(args[1]));
} else if (args.length === 2 && args[0] === "--target") {
  assert.ok(existsSync(args[1]), `target object does not exist: ${args[1]}`);
  validateTarget(readFileSync(args[1]));
} else {
  throw new Error("usage: validate-thumb-leaf-helpers-23.mjs [--self-test | --assemble | --object PATH | --target PATH]");
}

console.log("thumb-leaf-helpers-23: validation passed");
