#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config", "arm-ipc-wrappers-81.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = join(root, config.source);
const source = readFileSync(sourcePath);
const sourceText = source.toString("utf8");
const expectedHash = "a6c1dc12f2b75f12c4da8bb75c9eb25a9ea3d8559e7b124cef99fa48c6686dee";
const MAX_ELF_BYTES = 64 * 1024 * 1024;
const MAX_EXEC_SECTION_BYTES = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCATIONS = 1_000_000;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function same(actual, expected, message) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), message);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function splitCommand(value) {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];
  return parts.length ? parts : null;
}

function usable(command) {
  if (!command) return false;
  const probe = spawnSync(command[0], [...command.slice(1), "--version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return !probe.error && probe.status === 0;
}

function firstUsable(candidates, purpose) {
  for (const candidate of candidates) {
    if (usable(candidate)) return candidate;
  }
  fail(`no usable ${purpose}; set ARM_AS/ARM_LD/ARM_OBJDUMP or CROSS_COMPILE`);
}

function run(command, args, purpose) {
  const result = spawnSync(command[0], [...command.slice(1), ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    fail(`${purpose} failed: ${result.error?.message ?? result.stderr.trim()}`);
  }
  return result.stdout;
}

function validateManifest() {
  assert(config.schemaVersion === 1, "unexpected schemaVersion");
  assert(config.source === "src/main/arm_ipc_wrappers_81.S", "unexpected source path");
  assert(config.mode === "arm", "mode must be arm");
  assert(config.sourceSha256 === expectedHash, "configured source hash changed");
  assert(config.normalizedScheduleSha256 === expectedHash, "configured schedule hash changed");
  assert(config.totalBodySize === 1128, "body total must be 1128");
  assert(config.totalAdjacentSize === 36, "adjacent total must be 36");
  assert(config.cumulativePoolSlots === 802, "cumulative slot total must be 802");
  assert(config.cumulativePoolClasses === 420, "cumulative class total must be 420");

  const expectedFunctions = [
    ["func_00179E88", ".text.func_00179E88", 104, "func_00179EF4", 108],
    ["func_00179EF4", ".text.func_00179EF4", 100, "func_00179F5C", 104],
    ["func_00179F5C", ".text.func_00179F5C", 92, "func_00179FBC", 96],
    ["func_00179FBC", ".text.func_00179FBC", 224, "func_0017A0A0", 228],
    ["func_0017A0A0", ".text.func_0017A0A0", 108, "func_0017A110", 112],
    ["func_0017A110", ".text.func_0017A110", 324, "func_0017A25C", 332],
    ["func_0017A25C", ".text.func_0017A25C", 84, "func_0017A2B4", 88],
    ["func_0017A2B4", ".text.func_0017A2B4", 92, "func_0017A314", 96],
  ];
  same(config.functions.map((f) => [f.name, f.section, f.size, f.nextGlobal, f.nextGlobalOffset]),
    expectedFunctions, "function boundaries or terminal gap changed");
  assert(config.functions.reduce((n, f) => n + f.size, 0) === 1128, "body-size sum changed");
  assert(config.functions.reduce((n, f) => n + 4 * f.literals.length, 0) === 36,
    "owned literal-byte sum changed");
  for (const f of config.functions) assert(f.nextGlobalOffset === f.size + 4 * f.literals.length,
    `${f.name} must have no unowned terminal material`);

  const branches = config.functions.flatMap((f) => f.branches.map((b) =>
    [f.name, b.offset, b.kind, b.mnemonic, b.symbol]));
  same(branches, [
    ["func_00179E88", 16, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_00179EF4", 20, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_00179F5C", 20, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_00179FBC", 16, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_0017A0A0", 20, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_0017A110", 16, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_0017A25C", 16, "R_ARM_CALL", "bl", "func_0017E4D8"],
    ["func_0017A2B4", 20, "R_ARM_CALL", "bl", "func_0017E4D8"],
  ], "direct-transfer contract changed");

  const literals = config.functions.flatMap((f) => f.literals.map((l) =>
    [f.name, l.offset, l.loadOffsets, l.symbol]));
  same(literals, [
    ["func_00179E88", 104, [28], "ipc_controller_peer_selector_offset_81"],
    ["func_00179EF4", 100, [32], "ipc_controller_selector_offset_77"],
    ["func_00179F5C", 92, [32], "ipc_controller_selector_offset_77"],
    ["func_00179FBC", 224, [28], "ipc_controller_peer_selector_offset_81"],
    ["func_0017A0A0", 108, [32], "ipc_controller_peer_selector_offset_81"],
    ["func_0017A110", 324, [28], "ipc_controller_peer_selector_offset_81"],
    ["func_0017A110", 328, [52], "ipc_controller_record_table_offset_81"],
    ["func_0017A25C", 84, [28], "ipc_controller_selector_offset_77"],
    ["func_0017A2B4", 92, [32], "ipc_controller_selector_offset_77"],
  ], "literal slot/load/identity contract changed");
  same(config.literalIdentities,
    ["ipc_controller_selector_offset_77", "ipc_controller_peer_selector_offset_81", "ipc_controller_record_table_offset_81"],
    "literal classes changed");
  same(config.reusedLiteralIdentities, ["ipc_controller_selector_offset_77"],
    "reused literal identity changed");
  same(config.newLiteralIdentities, ["ipc_controller_peer_selector_offset_81", "ipc_controller_record_table_offset_81"],
    "new literal identity changed");

  const bic = config.branchIdentityContract;
  assert(bic.mode === "arm" && bic.minimumAlignment === 4, "branch mode/alignment changed");
  same(bic.primaryEntries, ["func_0017E4D8"], "branch entry classes changed");
  same(bic.secondaryEntries, [], "secondary entries are forbidden");
  same(bic.secondaryEntryRelations, [], "secondary entry relations are forbidden");
  same(bic.sharedClasses, [{
    symbol: "func_0017E4D8",
    sites: [
      { function: "func_00179E88", offset: 16 },
      { function: "func_00179EF4", offset: 20 },
      { function: "func_00179F5C", offset: 20 },
      { function: "func_00179FBC", offset: 16 },
      { function: "func_0017A0A0", offset: 20 },
      { function: "func_0017A110", offset: 16 },
      { function: "func_0017A25C", offset: 16 },
      { function: "func_0017A2B4", offset: 20 },
    ],
  }], "shared call class changed");
  same(bic.singletonClasses, [], "singleton call classes are forbidden");
  assert(bic.classesPairwiseDistinct === true, "call classes must be pairwise distinct");
}

function boundedRange(offset, size, limit, where) {
  assert(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0,
    `${where} has invalid bounds`);
  assert(offset <= limit && size <= limit - offset, `${where} lies outside the ELF file`);
}

function readCString(buffer, table, offset, where) {
  assert(offset < table.size, `${where} has an invalid string offset`);
  const start = table.offset + offset;
  const end = buffer.indexOf(0, start);
  assert(end >= start && end < table.offset + table.size, `${where} is unterminated`);
  return buffer.toString("utf8", start, end);
}

function parseElf(buffer, label) {
  assert(buffer.length <= MAX_ELF_BYTES, `${label} exceeds the 64 MiB ELF limit`);
  assert(buffer.length >= 52 && buffer.subarray(0, 4).toString("hex") === "7f454c46",
    `${label} is not ELF`);
  assert(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1,
    `${label} must be ELF32 little-endian version 1`);
  assert(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40,
    `${label} must be an ARM relocatable object`);

  const shoff = buffer.readUInt32LE(32);
  const shentsize = buffer.readUInt16LE(46);
  let shnum = buffer.readUInt16LE(48);
  let shstrndx = buffer.readUInt16LE(50);
  assert(shentsize >= 40, `${label} has undersized section headers`);
  boundedRange(shoff, shentsize, buffer.length, `${label} section zero`);
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  assert(shnum >= 1 && shnum <= MAX_SECTIONS, `${label} has unreasonable section count ${shnum}`);
  boundedRange(shoff, shentsize * shnum, buffer.length, `${label} section table`);
  if (shstrndx === 0xffff) shstrndx = buffer.readUInt32LE(shoff + 24);
  assert(shstrndx < shnum, `${label} has an invalid section-name table index`);

  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const at = shoff + index * shentsize;
    const section = {
      index,
      nameOffset: buffer.readUInt32LE(at),
      type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8),
      addr: buffer.readUInt32LE(at + 12),
      offset: buffer.readUInt32LE(at + 16),
      size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24),
      info: buffer.readUInt32LE(at + 28),
      align: buffer.readUInt32LE(at + 32),
      entsize: buffer.readUInt32LE(at + 36),
    };
    if (section.type !== 8) boundedRange(section.offset, section.size, buffer.length, `${label} section ${index}`);
    if ((section.flags & 4) !== 0) {
      assert(section.size <= MAX_EXEC_SECTION_BYTES,
        `${label} executable section ${index} exceeds the 16 MiB cap`);
    }
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  assert(shstr.type === 3, `${label} section-name table is not STRTAB`);
  for (const section of sections) {
    section.name = section.nameOffset === 0 ? "" : readCString(buffer, shstr, section.nameOffset, `${label} section name`);
  }
  const namedSections = sections.filter((section) => section.name);
  assert(new Set(namedSections.map((section) => section.name)).size === namedSections.length,
    `${label} has duplicate section names`);

  const symbolsByTable = new Map();
  const symbols = [];
  let symbolCount = 0;
  for (const table of sections.filter((section) => section.type === 2)) {
    assert(table.entsize === 16 && table.size % 16 === 0 && table.size / 16 <= MAX_SYMBOLS,
      `${label} has a malformed or excessive symbol table`);
    symbolCount += table.size / 16;
    assert(symbolCount <= MAX_SYMBOLS, `${label} has excessive symbols across symbol tables`);
    assert(table.link < sections.length && sections[table.link].type === 3,
      `${label} symbol table has an invalid string-table link`);
    const strings = sections[table.link];
    const entries = [];
    for (let index = 0; index < table.size / 16; index++) {
      const at = table.offset + index * 16;
      const nameOffset = buffer.readUInt32LE(at);
      const symbol = {
        index,
        table: table.index,
        name: nameOffset === 0 ? "" : readCString(buffer, strings, nameOffset, `${label} symbol name`),
        value: buffer.readUInt32LE(at + 4),
        size: buffer.readUInt32LE(at + 8),
        info: buffer[at + 12],
        other: buffer[at + 13],
        shndx: buffer.readUInt16LE(at + 14),
      };
      entries.push(symbol);
      symbols.push(symbol);
    }
    symbolsByTable.set(table.index, entries);
  }
  assert(symbolsByTable.size > 0, `${label} has no symbol table`);

  const relocations = [];
  let relocationCount = 0;
  for (const relsec of sections.filter((section) => section.type === 9 || section.type === 4)) {
    const width = relsec.type === 9 ? 8 : 12;
    assert(relsec.entsize === width && relsec.size % width === 0 &&
      relsec.size / width <= MAX_RELOCATIONS, `${label} has malformed or excessive relocations`);
    relocationCount += relsec.size / width;
    assert(relocationCount <= MAX_RELOCATIONS,
      `${label} has excessive relocations across relocation sections`);
    assert(relsec.info < sections.length && symbolsByTable.has(relsec.link),
      `${label} relocation section has invalid links`);
    const target = sections[relsec.info];
    const symtab = symbolsByTable.get(relsec.link);
    for (let index = 0; index < relsec.size / width; index++) {
      const at = relsec.offset + index * width;
      const offset = buffer.readUInt32LE(at);
      const info = buffer.readUInt32LE(at + 4);
      const symbolIndex = info >>> 8;
      assert(symbolIndex < symtab.length, `${label} relocation has an invalid symbol index`);
      assert(offset <= target.size && target.size - offset >= 4,
        `${label} relocation lies outside ${target.name}`);
      relocations.push({
        section: target.name,
        offset,
        type: info & 0xff,
        symbol: symtab[symbolIndex].name,
        format: relsec.type === 9 ? "REL" : "RELA",
      });
    }
  }
  return { buffer, sections, symbols, relocations };
}

function readElfFile(path, label) {
  const size = statSync(path).size;
  assert(Number.isSafeInteger(size) && size <= MAX_ELF_BYTES,
    `${label} exceeds the 64 MiB ELF limit`);
  return parseElf(readFileSync(path), label);
}

function oneSection(elf, name, label) {
  const matches = elf.sections.filter((section) => section.name === name);
  assert(matches.length === 1, `${label} must contain exactly one ${name}`);
  return matches[0];
}

function selectedRelocations(elf, section) {
  return elf.relocations.filter((relocation) => relocation.section === section)
    .sort((a, b) => a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol));
}

function validateReferenceSymbol(elf, name, kind, label) {
  const rows = elf.symbols.filter((symbol) => symbol.name === name && (symbol.info >>> 4) === 1);
  assert(rows.length === 1, `${label} must contain one global reference for ${name}`);
  const row = rows[0];
  assert(row.other === 0, `${label} has non-default visibility for ${name}`);
  if (row.shndx === 0) {
    assert(row.value === 0 && row.size === 0 &&
      ((row.info & 0xf) === 0 || (kind === "call" && (row.info & 0xf) === 2) ||
        (kind === "literal" && (row.info & 0xf) === 1)),
      `${label} has an invalid undefined reference type for ${name}`);
    return;
  }
  assert(row.shndx < elf.sections.length, `${label} has an invalid definition for ${name}`);
  const section = elf.sections[row.shndx];
  assert(row.value <= section.size && row.size <= section.size - row.value,
    `${label} has an out-of-range definition for ${name}`);
  if (kind === "call") {
    assert((row.info & 0xf) === 2 && (row.value & 3) === 0 && (section.flags & 0x6) === 0x6,
      `${label} has a non-ARM function definition for ${name}`);
  } else {
    assert(((row.info & 0xf) === 0 || (row.info & 0xf) === 1) && (section.flags & 2) !== 0,
      `${label} has an invalid literal definition for ${name}`);
  }
  return row;
}

function validateElf(elf, label) {
  const selectedIndexes = new Set();
  let relocationCount = 0;
  for (const f of config.functions) {
    const section = oneSection(elf, f.section, label);
    selectedIndexes.add(section.index);
    const expectedSize = f.size + 4 * f.literals.length;
    assert(section.type === 1 && (section.flags & 0x6) === 0x6 && section.addr === 0 &&
      section.align >= 4 && section.size === expectedSize,
    `${label} ${f.section} has wrong type, flags, address, alignment, or extent`);
    const definitions = elf.symbols.filter((symbol) => symbol.name === f.name && symbol.shndx !== 0);
    assert(definitions.length === 1, `${label} must define ${f.name} exactly once`);
    const symbol = definitions[0];
    assert(symbol.shndx === section.index && symbol.value === 0 && symbol.size === f.size &&
      (symbol.info >>> 4) === 1 && (symbol.info & 0xf) === 2,
    `${label} has invalid function metadata for ${f.name}`);

    const expected = [
      ...f.branches.map((branch) => ({ section: f.section, offset: branch.offset,
        type: 28, symbol: branch.symbol, format: "REL" })),
      ...f.literals.map((literal) => ({ section: f.section, offset: literal.offset,
        type: 2, symbol: literal.symbol, format: "REL" })),
    ].sort((a, b) => a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol));
    const actual = selectedRelocations(elf, f.section);
    same(actual, expected, `${label} relocation schedule changed in ${f.section}`);
    relocationCount += actual.length;
  }
  const selectedGlobals = elf.symbols.filter((symbol) => selectedIndexes.has(symbol.shndx) &&
    (symbol.info >>> 4) === 1).map((symbol) => symbol.name).sort();
  same(selectedGlobals, config.functions.map((f) => f.name).sort(),
    `${label} configured sections contain unexpected global symbols`);
  assert(relocationCount === 17, `${label} must contain exactly eight calls and nine literal relocations`);
  for (const name of config.branchIdentityContract.primaryEntries) validateReferenceSymbol(elf, name, "call", label);
  const literalDefinitions = config.literalIdentities.map((name) =>
    validateReferenceSymbol(elf, name, "literal", label)).filter(Boolean);
  const definedKeys = literalDefinitions.map((symbol) => `${symbol.shndx}:${symbol.value}`);
  assert(new Set(definedKeys).size === definedKeys.length,
    `${label} has aliased definitions for pairwise-distinct literal identities`);
}

function compareSchedule(candidate, reference) {
  for (const f of config.functions) {
    const gotSection = oneSection(candidate, f.section, "candidate object");
    const wantSection = oneSection(reference, f.section, "reference object");
    const got = candidate.buffer.subarray(gotSection.offset, gotSection.offset + gotSection.size);
    const want = reference.buffer.subarray(wantSection.offset, wantSection.offset + wantSection.size);
    const branchOffsets = new Set(f.branches.map((item) => item.offset));
    for (let offset = 0; offset < want.length; offset++) {
      const word = offset & ~3;
      if (branchOffsets.has(word)) {
        if ((offset & 3) === 3) assert(got[offset] === want[offset],
          `candidate branch opcode differs in ${f.name} at offset ${word}`);
      } else {
        assert(got[offset] === want[offset],
          `candidate body or owned literal bytes differ in ${f.name} at offset ${offset}`);
      }
    }
  }
}

function scopedDisassembly(objdump, object) {
  let instructionCount = 0;
  for (const f of config.functions) {
    const disassembly = run(objdump,
      ["-d", "-j", f.section, "--start-address=0", `--stop-address=${f.size}`, object],
      `scoped disassembly of ${f.name}`);
    const offsets = disassembly.split(/\r?\n/).map((line) => {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{8}|(?:[0-9a-fA-F]{2}\s+){4})\s+/);
      return match ? Number.parseInt(match[1], 16) : null;
    }).filter((offset) => offset !== null && offset < f.size);
    assert(offsets.length === f.size / 4, `${f.name} instruction boundary/count changed`);
    for (let index = 0; index < offsets.length; index++) {
      assert(offsets[index] === index * 4, `${f.name} disassembly is not contiguous ARM code`);
    }
    instructionCount += offsets.length;
  }
  assert(instructionCount === 282, "normalized schedule must contain 282 ARM instructions");
}

function hostileSource(sectionCount) {
  const lines = [
    ".syntax unified", ".arch armv6k", ".arm",
    '.section .text.foreign81,"ax",%progbits',
    ".global foreign_81", ".type foreign_81,%function", "foreign_81:", "bx lr",
    ".size foreign_81,.-foreign_81",
    ".global func_0017E4D8", ".type func_0017E4D8,%function", "func_0017E4D8:", "bx lr",
    ".size func_0017E4D8,.-func_0017E4D8",
    '.section .data.foreign81,"aw",%progbits',
    ".global ipc_controller_selector_offset_77", ".type ipc_controller_selector_offset_77,%object",
    "ipc_controller_selector_offset_77:", ".word 0", ".size ipc_controller_selector_offset_77,4",
    ".global ipc_controller_peer_selector_offset_81", ".type ipc_controller_peer_selector_offset_81,%object",
    "ipc_controller_peer_selector_offset_81:", ".word 0", ".size ipc_controller_peer_selector_offset_81,4",
    ".global ipc_controller_record_table_offset_81", ".type ipc_controller_record_table_offset_81,%object",
    "ipc_controller_record_table_offset_81:", ".word 0", ".size ipc_controller_record_table_offset_81,4",
  ];
  for (let index = 0; index < sectionCount; index++) {
    lines.push(`.section .hostile81.${index},"",%progbits`, `.byte ${index & 0xff}`);
  }
  return `${lines.join("\n")}\n`;
}

function expectReject(action, description) {
  let rejected = false;
  try { action(); } catch { rejected = true; }
  assert(rejected, `hostile self-test was not rejected: ${description}`);
}

const args = process.argv.slice(2);
const positional = args.filter((arg) => arg !== "--object");
assert(args.every((arg) => arg === "--object" || !arg.startsWith("--")) && positional.length <= 1 &&
  (!args.includes("--object") || positional.length === 1),
"usage: validate-arm-ipc-wrappers-81.mjs [candidate.S | --object candidate.o]");

let temporary = null;
try {
  validateManifest();
  assert(sha256(source) === expectedHash, "source SHA-256 does not match the clean-room schedule");
  assert((sourceText.match(/^\s*b(?:eq|ne|cs|ls|hi)?\s+\.Lloc_/gm) ?? []).length === 22,
    "schedule must contain exactly 22 local branches");
  assert((sourceText.match(/^pop\s+\{[^\n}]*pc\}/gm) ?? []).length === 8,
    "schedule must contain exactly eight return sites");

  const cross = process.env.CROSS_COMPILE ?? "";
  const assembler = firstUsable([
    splitCommand(process.env.ARM_AS), splitCommand(process.env.AS),
    cross ? [`${cross}as`] : null, ["arm-none-eabi-as"], ["arm-linux-gnueabi-as"],
  ], "ARM assembler");
  const linker = firstUsable([
    splitCommand(process.env.ARM_LD), splitCommand(process.env.LD),
    cross ? [`${cross}ld`] : null, ["arm-none-eabi-ld"], ["arm-linux-gnueabi-ld"],
  ], "ARM linker");
  const objdump = firstUsable([
    splitCommand(process.env.ARM_OBJDUMP), splitCommand(process.env.OBJDUMP),
    cross ? [`${cross}objdump`] : null, ["arm-none-eabi-objdump"], ["arm-linux-gnueabi-objdump"],
  ], "ARM disassembler");

  temporary = mkdtempSync(join(tmpdir(), "arm-ipc-wrappers-81-"));
  const referencePath = join(temporary, "reference.o");
  run(assembler, ["-march=armv6k", "-mfpu=vfpv2", "-o", referencePath, sourcePath], "assembly");
  const reference = readElfFile(referencePath, "reference object");
  validateElf(reference, "reference object");
  scopedDisassembly(objdump, referencePath);

  expectReject(() => parseElf(Buffer.alloc(MAX_ELF_BYTES + 1), "oversized hostile ELF"),
    "64 MiB file limit");
  const excessiveSections = Buffer.from(reference.buffer);
  excessiveSections.writeUInt16LE(MAX_SECTIONS + 1, 48);
  expectReject(() => parseElf(excessiveSections, "excessive-section hostile ELF"),
    "16384-section limit");
  const excessiveExecutable = Buffer.from(reference.buffer);
  const firstText = oneSection(reference, config.functions[0].section, "reference object");
  const firstTextHeader = excessiveExecutable.readUInt32LE(32) +
    firstText.index * excessiveExecutable.readUInt16LE(46);
  excessiveExecutable.writeUInt32LE(8, firstTextHeader + 4);
  excessiveExecutable.writeUInt32LE(MAX_EXEC_SECTION_BYTES + 1, firstTextHeader + 20);
  expectReject(() => parseElf(excessiveExecutable, "oversized-executable hostile ELF"),
    "16 MiB executable-section cap");
  const alteredBytes = Buffer.from(reference.buffer);
  alteredBytes[firstText.offset] ^= 1;
  const altered = parseElf(alteredBytes, "altered-schedule hostile ELF");
  validateElf(altered, "altered-schedule hostile ELF");
  expectReject(() => compareSchedule(altered, reference), "altered normative schedule");

  const hostileAsm = join(temporary, "hostile.S");
  const hostileObject = join(temporary, "hostile.o");
  const compositePath = join(temporary, "composite.o");
  writeFileSync(hostileAsm, hostileSource(12050));
  run(assembler, ["-march=armv6k", "-o", hostileObject, hostileAsm], "hostile assembly");
  const hostile = readElfFile(hostileObject, "hostile object");
  assert(hostile.sections.length >= 12000, "high-section-count ELF exercise was ineffective");
  run(linker, ["-r", "-o", compositePath, hostileObject, referencePath], "foreign composite link");
  const composite = readElfFile(compositePath, "foreign hostile composite");
  assert(composite.sections.length >= 12000, "foreign hostile composite lost the measured section load");
  validateElf(composite, "foreign hostile composite");
  compareSchedule(composite, reference);
  scopedDisassembly(objdump, compositePath);

  if (positional[0]) {
    let candidatePath = resolve(process.cwd(), positional[0]);
    if (!args.includes("--object")) {
      assert([".s", ".S"].includes(extname(candidatePath)),
        "positional candidate must be assembly source; use --object for an ELF object");
      const assembledCandidate = join(temporary, "candidate.o");
      run(assembler, ["-march=armv6k", "-mfpu=vfpv2", "-o", assembledCandidate, candidatePath],
        "candidate assembly");
      candidatePath = assembledCandidate;
    }
    const candidate = readElfFile(candidatePath, "candidate object");
    validateElf(candidate, "candidate object");
    compareSchedule(candidate, reference);
    scopedDisassembly(objdump, candidatePath);
  }
  console.log("arm-ipc-wrappers-81: validation passed (standalone + 12k-section foreign composite" +
    (positional[0] ? " + candidate" : "") + ")");
} catch (error) {
  console.error(`arm-ipc-wrappers-81: validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
