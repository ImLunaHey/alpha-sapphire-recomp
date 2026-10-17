#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/thumb-leaf-helpers-19.json");
const specPath = join(root, "docs/specs/main/thumb_leaf_helpers_19.md");
const sourcePath = join(root, "src/main/thumb_leaf_helpers_19.S");
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const expectedRawConfigHash = "7f157fbcd71e055e96d18a4c8cb81c78205fdbaf5f4ba853d9aa4f17ed3f0ab6";
const expectedConfigHash = "cd9b90fccdd11d1c195a382a8eca9e7a27be63db5e28d1dcf23bceedd74b44a0";
const expectedSourceHash = "4d691a43b02e6c30c543a8c4367ec18f7b60557d47132ec8f499c0a3edb682a5";
const expectedSpecHash = "e20a5431859246ea333c9ca08df48a37d848154e08f982d6384d540488b0479d";
const expectedAttributes = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

// Every halfword is independently derived from the public semantic rows. Calls
// contain the REL implicit addend -4; their symbols are supplied by relocations.
const expectedText = Buffer.from(
  "f7b584b00600c46a1700002c1cd0356b002f22d0ea0000216846fff7feff0198" +
  "0099c0080c000291039006d0306bf16ac2002000fff7feff0fe0316901200143" +
  "821e3000fff7feff07b0f0bde800225800194368059831009847013df6d2002f" +
  "f2d02000fff7feffeee7",
  "hex",
);

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
  assert.equal(config.source, "src/main/thumb_leaf_helpers_19.S");
  assert.equal(config.totalBodySize, 106);
  assert.equal(config.expectedInstructionCount, 49);
  assert.equal(config.wideInstructionCount, 4);
  assert.equal(config.functions.length, 1);
  assert.equal(config.functions[0].semantics.length, 49);
  assert.equal(expectedText.length, 106);
  assert.doesNotMatch(source, /^\s*\.(?:byte|hword|short|word|long|incbin)\b/m,
    "data emission is forbidden in the Thumb code interval");
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
  assert.ok(shnum > 0 && shstrndx < shnum, "invalid section table");
  enforceLimits({ fileSize: bytes.length, sectionCount: shnum });
  assert.ok(shoff <= bytes.length && shnum * shentsize <= bytes.length - shoff, "truncated section header table");
  const rawSections = Array.from({ length: shnum }, (_, index) => {
    const at = shoff + index * shentsize;
    assert.ok(at + 40 <= bytes.length, "truncated section header table");
    return {
      index, nameOffset: bytes.readUInt32LE(at), type: bytes.readUInt32LE(at + 4),
      flags: bytes.readUInt32LE(at + 8), addr: bytes.readUInt32LE(at + 12), offset: bytes.readUInt32LE(at + 16),
      size: bytes.readUInt32LE(at + 20), link: bytes.readUInt32LE(at + 24),
      info: bytes.readUInt32LE(at + 28), align: bytes.readUInt32LE(at + 32),
      entsize: bytes.readUInt32LE(at + 36),
    };
  });
  const shstr = rawSections[shstrndx];
  assert.ok(rawSections[0] && Object.values(rawSections[0]).every((value) => value === 0), "null section is not canonical");
  assert.equal(shstr.type, 3, "section-name table is not SHT_STRTAB");
  for (const section of rawSections) {
    if (section.type !== 8) assert.ok(section.offset <= bytes.length && section.size <= bytes.length - section.offset, "section data is out of range");
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
  let symbolCount = 0, relocationCount = 0;
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
  return { bytes, sections, cstring };
}

function validateObject(objectBytes) {
  const elf = parseElf(objectBytes);
  const textSections = elf.sections.filter((s) => s.name === ".text.func_001042A6");
  assert.equal(textSections.length, 1, "expected one owned executable section");
  const text = textSections[0];
  assert.deepEqual(elf.sections.filter((s) => (s.flags & 4) !== 0 && s.size !== 0).map((s) => s.name),
    [".text.func_001042A6"], "object contains executable bytes outside the owned section");
  assert.deepEqual({ type: text.type, flags: text.flags, size: text.size, align: text.align },
    { type: 1, flags: 6, size: 106, align: 2 }, "executable section contract mismatch");
  assert.equal(text.addr, 0, "owned section address is not zero");
  assert.deepEqual(elf.bytes.subarray(text.offset, text.offset + text.size), expectedText,
    "assembled Thumb body differs from the semantic encoding contract");

  const symtabs = elf.sections.filter((s) => s.type === 2);
  assert.equal(symtabs.length, 1, "expected exactly one symbol table");
  assert.equal(elf.sections.filter((s) => s.type === 11).length, 0, "DYNSYM is forbidden");
  const symtab = symtabs[0];
  assert.equal(symtab.entsize, 16, "unexpected symbol entry size");
  const strtab = elf.sections[symtab.link];
  assert.ok(strtab && strtab.type === 3, "symbol string table is invalid");
  const symbols = [];
  for (let offset = 0; offset < symtab.size; offset += symtab.entsize) {
    const at = symtab.offset + offset;
    const nameOffset = elf.bytes.readUInt32LE(at);
    symbols.push({
      index: symbols.length, name: elf.cstring(strtab, nameOffset),
      value: elf.bytes.readUInt32LE(at + 4), size: elf.bytes.readUInt32LE(at + 8),
      bind: elf.bytes[at + 12] >>> 4, type: elf.bytes[at + 12] & 15,
      other: elf.bytes[at + 13], shndx: elf.bytes.readUInt16LE(at + 14),
    });
  }
  assert.deepEqual(symbols[0], { index: 0, name: "", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: 0 }, "null symbol is not canonical");
  assert.ok(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0),
    "symbol-table local/global partition is invalid");
  const named = (name) => symbols.filter((s) => s.name === name);
  const primary = named("func_001042A6");
  assert.equal(primary.length, 1);
  assert.deepEqual(primary[0], { index: primary[0].index, name: "func_001042A6", value: 1,
    size: 106, bind: 1, type: 2, other: 0, shndx: text.index });
  const mapping = named("$t");
  assert.equal(mapping.length, 1, "expected one canonical Thumb mapping symbol");
  assert.deepEqual(mapping[0], { index: mapping[0].index, name: "$t", value: 0,
    size: 0, bind: 0, type: 0, other: 0, shndx: text.index });
  const sectionSymbols = symbols.filter((s) => s.type === 3 && s.shndx === text.index);
  assert.equal(sectionSymbols.length, 1, "expected one owned section symbol");
  assert.deepEqual({ name: sectionSymbols[0].name, value: sectionSymbols[0].value,
    size: sectionSymbols[0].size, bind: sectionSymbols[0].bind, other: sectionSymbols[0].other },
    { name: "", value: 0, size: 0, bind: 0, other: 0 });

  const externals = ["thumb_secondary_00303E38", "func_00144D28",
    "thumb_secondary_00104324", "func_00303EC8"];
  assert.deepEqual(symbols.filter((symbol) => symbol.name !== "").map((symbol) => symbol.name),
    ["$t", "func_001042A6", ...externals], "named symbol set/order is not exact");
  for (const name of externals) {
    const entries = named(name);
    assert.equal(entries.length, 1, `expected one ${name} symbol`);
    assert.deepEqual({ value: entries[0].value, size: entries[0].size, bind: entries[0].bind,
      type: entries[0].type, other: entries[0].other, shndx: entries[0].shndx },
      { value: 0, size: 0, bind: 1, type: 2, other: 0, shndx: 0 }, `${name} metadata mismatch`);
  }
  const ownedNamed = symbols.filter((s) => s.shndx === text.index && s.name !== "" && s.name !== "$t");
  assert.deepEqual(ownedNamed.map((s) => s.name), ["func_001042A6"], "named alias in owned section");
  assert.equal(symbols.filter((s) => s.shndx === text.index).length, 3,
    "unexpected unnamed alias or mapping symbol in owned section");
  assert.deepEqual(symbols.filter((s) => s.shndx === 0 && s.bind === 1 && s.type === 2).map((s) => s.name),
    externals, "unexpected or reordered undefined function identities");

  assert.equal(elf.sections.filter((s) => s.type === 4).length, 0, "SHT_RELA is forbidden");
  const allRelocs = elf.sections.filter((s) => s.type === 9);
  assert.equal(allRelocs.length, 1, "unexpected additional relocation section");
  const relocs = allRelocs.filter((s) => s.info === text.index);
  assert.equal(relocs.length, 1, "expected one SHT_REL section for the body");
  const rel = relocs[0];
  assert.equal(rel.link, symtab.index, "relocation section has wrong symbol table");
  assert.equal(rel.entsize, 8, "unexpected REL entry size");
  assert.equal(rel.size, 32, "expected exactly four relocations");
  const expectedRelocs = [[26, "thumb_secondary_00303E38"], [52, "func_00144D28"],
    [68, "thumb_secondary_00104324"], [100, "func_00303EC8"]];
  const actualRelocs = [];
  for (let offset = 0; offset < rel.size; offset += rel.entsize) {
    const at = rel.offset + offset;
    const place = elf.bytes.readUInt32LE(at);
    const info = elf.bytes.readUInt32LE(at + 4);
    const symbol = symbols[info >>> 8];
    assert.ok(symbol, "relocation references invalid symbol");
    assert.equal(info & 0xff, 10, "relocation is not R_ARM_THM_CALL");
    assert.equal(elf.bytes.readUInt16LE(text.offset + place), 0xf7ff, "call high half has wrong REL addend");
    assert.equal(elf.bytes.readUInt16LE(text.offset + place + 2), 0xfffe, "call low half has wrong REL addend");
    actualRelocs.push([place, symbol.name]);
  }
  assert.deepEqual(actualRelocs, expectedRelocs, "call relocation identities/order mismatch");
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  assert.equal(attributes.length, 1, "expected one ARM attributes section");
  assert.equal(attributes[0].type, 0x70000003, "wrong ARM attributes section type");
  assert.deepEqual(elf.bytes.subarray(attributes[0].offset, attributes[0].offset + attributes[0].size), expectedAttributes,
    "ARMv6K/Thumb-1/VFPv2 attributes mismatch");
}

function runSelfTests(config, source, configBytes, spec) {
  validatePublicInputs(config, source, configBytes, spec);
  const reordered = Object.fromEntries(Object.entries(config).reverse());
  const reorderedNormalized = structuredClone(reordered);
  reorderedNormalized.sourceHash = null;
  assert.equal(sha256(stable(reorderedNormalized)), expectedConfigHash, "normalization depends on key order");
  assert.throws(() => validatePublicInputs({ ...config, totalBodySize: 104 }, source, configBytes, spec),
    /normalized configuration contract changed/);
  assert.throws(() => validatePublicInputs(config, `${source}\n`, configBytes, spec), /source does not match/);
  for (const [label, values] of [
    ["file", { fileSize: MAX_FILE + 1 }], ["executable", { execSize: MAX_EXEC + 1 }],
    ["section", { sectionCount: MAX_SECTIONS + 1 }], ["symbol", { symbolCount: MAX_SYMBOLS + 1 }],
    ["relocation", { relocationCount: MAX_RELOCS + 1 }],
  ]) assert.throws(() => enforceLimits(values), undefined, `${label} limit did not reject`);
  const damaged = Buffer.from(expectedText);
  damaged[0] ^= 1;
  assert.notDeepEqual(damaged, expectedText, "object mutation self-test failed");
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
  const scratch = mkdtempSync(join(tmpdir(), "thumb19-"));
  try {
    const output = join(scratch, "thumb_leaf_helpers_19.o");
    const result = spawnSync(assembler, ["-march=armv6k", "-mthumb", "-o", output, sourcePath],
      { encoding: "utf8" });
    assert.equal(result.status, 0, `${assembler} failed:\n${result.stderr || result.stdout}`);
    const valid = readFileSync(output);
    validateObject(valid);
    const mutateAndReject = (label, mutation) => {
      const copy = Buffer.from(valid);
      mutation(copy, parseElf(copy));
      assert.throws(() => validateObject(copy), undefined, `${label} mutation was accepted`);
    };
    mutateAndReject("instruction", (copy, elf) => { copy[elf.sections.find((s) => s.name === ".text.func_001042A6").offset] ^= 1; });
    mutateAndReject("relocation", (copy, elf) => { copy[elf.sections.find((s) => s.type === 9).offset + 4] ^= 1; });
    mutateAndReject("attributes", (copy, elf) => { copy[elf.sections.find((s) => s.name === ".ARM.attributes").offset + 1] ^= 1; });
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
} else {
  throw new Error("usage: validate-thumb-leaf-helpers-19.mjs [--self-test | --assemble | --object PATH]");
}

console.log("thumb-leaf-helpers-19: validation passed");
