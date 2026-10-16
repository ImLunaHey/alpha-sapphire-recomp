#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-ipc-wrappers-76.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath);
const text = source.toString("utf8");
const sha256 = data => createHash("sha256").update(data).digest("hex");
const fail = message => { throw new Error(message); };
const check = (value, message) => { if (!value) fail(message); };
const same = (actual, expected, message) =>
  check(JSON.stringify(actual) === JSON.stringify(expected), message);
const normalizeMnemonic = mnemonic => mnemonic
  .replace(/cc$/, "lo")
  .replace(/cs$/, "hs");

const expectedFunctions = [
  ["func_0018E080", ".text.func_0018E080", 348, "func_0018E1E0", 352],
  ["func_0018E480", ".text.func_0018E480", 80, "func_0018E4D8", 88],
  ["func_0018EAD8", ".text.func_0018EAD8", 256, "func_0018EBE4", 268],
  ["func_0018F43C", ".text.func_0018F43C", 224, "func_0018F51C", 224],
];
const expectedBranches = [
  ["func_0018E080", 128, "R_ARM_CALL", "bl", "func_00184990"],
  ["func_0018E080", 300, "R_ARM_CALL", "bl", "func_00302108"],
  ["func_0018E480", 36, "R_ARM_CALL", "bl", "func_001888A8"],
  ["func_0018EAD8", 240, "R_ARM_CALL", "bl", "func_00190888"],
];
const expectedLiterals = [
  ["func_0018E080", 348, [0], "ipc_record_vtable_76"],
  ["func_0018E480", 80, [0], "ipc_allocator_dispatch_owner_68"],
  ["func_0018E480", 84, [12], "ipc_service_record_table_76"],
  ["func_0018EAD8", 256, [16], "ipc_u32_float_limit_76"],
  ["func_0018EAD8", 260, [20], "ipc_u32_float_limit_76"],
  ["func_0018EAD8", 264, [28], "ipc_dimension_scale_76"],
];
const literalIdentities = [
  "ipc_record_vtable_76", "ipc_allocator_dispatch_owner_68",
  "ipc_service_record_table_76", "ipc_u32_float_limit_76",
  "ipc_dimension_scale_76",
];
const primaryEntries = expectedBranches.map(row => row[4]);

check(config.schemaVersion === 1, "unsupported schemaVersion");
check(config.source === "src/main/arm_ipc_wrappers_76.S", "unexpected source path");
check(config.mode === "arm", "mode must be arm");
check(config.totalBodySize === 908, "totalBodySize must be 908");
check(config.totalAdjacentSize === 24, "totalAdjacentSize must be 24");
check(config.cumulativePoolSlots === 777, "cumulativePoolSlots must be 777");
check(config.cumulativePoolClasses === 410, "cumulativePoolClasses must be 410");
same(config.functions.map(f => [f.name, f.section, f.size, f.nextGlobal, f.nextGlobalOffset]),
  expectedFunctions, "function boundary contract changed");
same(config.functions.flatMap(f => f.branches.map(b =>
  [f.name, b.offset, b.kind, b.mnemonic, b.symbol])), expectedBranches,
  "direct-transfer contract changed");
same(config.functions.flatMap(f => f.literals.map(l =>
  [f.name, l.offset, l.loadOffsets, l.symbol])), expectedLiterals,
  "literal-position contract changed");
same(config.literalIdentities, literalIdentities, "literal identity order changed");
same(config.reusedLiteralIdentities, ["ipc_allocator_dispatch_owner_68"],
  "reused literal identity contract changed");
same(config.newLiteralIdentities,
  ["ipc_record_vtable_76", "ipc_service_record_table_76",
   "ipc_u32_float_limit_76", "ipc_dimension_scale_76"],
  "new literal identity contract changed");
same(config.branchIdentityContract, {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries: [],
  secondaryEntryRelations: [], sharedClasses: [], singletonClasses: primaryEntries,
  classesPairwiseDistinct: true,
}, "branch identity contract changed");
check(new Set(primaryEntries).size === 4, "primary branch classes are not distinct");
check(expectedLiterals.length === 6 && new Set(expectedLiterals.map(x => x[3])).size === 5,
  "expected six literal slots in five identity classes");
check(config.cumulativePoolSlots - expectedLiterals.length === 771,
  "literal-slot cumulative predecessor is not 771");
check(config.cumulativePoolClasses - config.newLiteralIdentities.length === 406,
  "literal-class cumulative predecessor is not 406");

const sourceHash = sha256(source);
check(sourceHash === config.sourceSha256, "source SHA-256 does not match config");
check(sourceHash === config.normalizedScheduleSha256,
  "source is not the exact normalized normative schedule");
check(sourceHash === "5bcb8105490dbf3ab2c06900213ca147105827854ede750bd0d6312933b89f6f",
  "normative schedule hash changed");

const sourceLines = text.split(/\r?\n/);
const bodies = new Map();
for (let i = 0; i < sourceLines.length; i++) {
  const begin = sourceLines[i].match(/^BEGIN (\w+)$/);
  if (!begin) continue;
  const name = begin[1];
  const instructions = [];
  const words = [];
  let ended = false;
  for (++i; i < sourceLines.length; i++) {
    const line = sourceLines[i].trim();
    if (line === `END ${name}`) { ended = true; continue; }
    if (/^BEGIN /.test(line)) { i--; break; }
    if (!line || line.endsWith(":")) continue;
    if (ended) {
      const word = line.match(/^\.word\s+(\w+)$/);
      if (word) words.push(word[1]);
      else if (!/^\./.test(line)) fail(`${name}: content after literal pool`);
    } else {
      check(!/^\./.test(line), `${name}: directive inside executable body`);
      instructions.push(line);
    }
  }
  check(ended, `${name}: missing END`);
  bodies.set(name, { instructions, words });
}
same([...bodies.keys()], expectedFunctions.map(x => x[0]), "source function order changed");
let bodyBytes = 0;
let instructionCount = 0;
for (const f of config.functions) {
  const body = bodies.get(f.name);
  check(body.instructions.length * 4 === f.size, `${f.name}: instruction count/size mismatch`);
  same(body.words, f.literals.map(l => l.symbol), `${f.name}: literal ownership/order mismatch`);
  check(f.nextGlobalOffset === f.size + body.words.length * 4,
    `${f.name}: gap or unowned adjacent bytes`);
  const symbolic = [];
  for (let offset = 0; offset < body.instructions.length * 4; offset += 4) {
    const insn = body.instructions[offset / 4];
    const branch = insn.match(/^(bl|blx|b(?:eq|ne|ls|hi|lo|gt|le)?)\s+([^\s]+)$/);
    if (branch && !branch[2].startsWith(".L") && !/^r(?:1[0-5]|[0-9])$/.test(branch[2]))
      symbolic.push([offset, branch[1], branch[2]]);
  }
  same(symbolic, f.branches.map(b => [b.offset, b.mnemonic, b.symbol]),
    `${f.name}: symbolic transfer schedule mismatch`);
  for (const literal of f.literals) {
    for (const offset of literal.loadOffsets) {
      const insn = body.instructions[offset / 4];
      check(insn && /^(?:ldr|vldr)\s/.test(insn), `${f.name}+${offset}: literal load missing`);
    }
  }
  bodyBytes += f.size;
  instructionCount += body.instructions.length;
}
check(bodyBytes === 908 && instructionCount === 227,
  "batch must contain 908 body bytes / 227 instructions");
check(config.functions.reduce((n, f) => n + f.literals.length * 4, 0) === 24,
  "batch must own exactly 24 adjacent bytes");

function cstring(buffer, offset) {
  check(offset >= 0 && offset < buffer.length, "string-table offset out of bounds");
  const end = buffer.indexOf(0, offset);
  check(end !== -1, "unterminated ELF string");
  return buffer.toString("utf8", offset, end);
}

function parseElf(path) {
  check(statSync(path).size <= 256 * 1024 * 1024, "object exceeds 256 MiB input limit");
  const data = readFileSync(path);
  check(data.length >= 52, "object is too small for ELF32");
  check(data[0] === 0x7f && data.toString("ascii", 1, 4) === "ELF", "not an ELF object");
  check(data[4] === 1 && data[5] === 1 && data[6] === 1, "object must be ELF32 little-endian");
  check(data.readUInt16LE(16) === 1, "object must be relocatable");
  check(data.readUInt16LE(18) === 40, "object must target ARM");
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  const shnum = data.readUInt16LE(48);
  const shstrndx = data.readUInt16LE(50);
  check(shentsize >= 40 && shnum > 0 && shnum < 65536, "invalid section-header table");
  check(shstrndx < shnum && shoff + shentsize * shnum <= data.length,
    "section-header table out of bounds");
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    const section = {
      index: i, nameOffset: data.readUInt32LE(p), type: data.readUInt32LE(p + 4),
      flags: data.readUInt32LE(p + 8), offset: data.readUInt32LE(p + 16),
      size: data.readUInt32LE(p + 20), link: data.readUInt32LE(p + 24),
      info: data.readUInt32LE(p + 28), align: data.readUInt32LE(p + 32),
      entsize: data.readUInt32LE(p + 36),
    };
    check(section.type === 8 || section.offset + section.size <= data.length,
      `section ${i} lies outside object`);
    if (section.flags & 4) check(section.size <= 16 * 1024 * 1024,
      `executable section ${i} exceeds 16 MiB disassembly limit`);
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  check(shstr.type === 3, "invalid section-name string table");
  const shstrings = data.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cstring(shstrings, section.nameOffset);
  const sectionByName = new Map();
  for (const section of sections) {
    check(!sectionByName.has(section.name), `duplicate ELF section ${section.name}`);
    sectionByName.set(section.name, section);
  }
  const symtab = sections.find(s => s.type === 2);
  check(symtab && symtab.entsize >= 16 && symtab.size % symtab.entsize === 0,
    "missing or invalid symbol table");
  check(symtab.link < sections.length && sections[symtab.link].type === 3,
    "invalid symbol string table");
  const strsec = sections[symtab.link];
  const strings = data.subarray(strsec.offset, strsec.offset + strsec.size);
  const symbols = [];
  for (let p = symtab.offset; p < symtab.offset + symtab.size; p += symtab.entsize) {
    symbols.push({ name: cstring(strings, data.readUInt32LE(p)), value: data.readUInt32LE(p + 4),
      size: data.readUInt32LE(p + 8), info: data[p + 12], shndx: data.readUInt16LE(p + 14) });
  }
  return { data, sections, sectionByName, symtab, symbols };
}

function validateObject(path) {
  const elf = parseElf(path);
  const expectedRelocations = new Map();
  for (const f of config.functions) {
    const section = elf.sectionByName.get(f.section);
    check(section, `${f.name}: object section missing`);
    check(section.type === 1 && (section.flags & 6) === 6 && section.align >= 4,
      `${f.name}: invalid code section attributes`);
    check(section.size === f.nextGlobalOffset, `${f.name}: section boundary mismatch`);
    const matches = elf.symbols.filter(s => s.name === f.name);
    check(matches.length === 1, `${f.name}: expected one symbol`);
    const symbol = matches[0];
    check(symbol.value === 0 && symbol.size === f.size && symbol.shndx === section.index,
      `${f.name}: function symbol value/size/section mismatch`);
    check((symbol.info >> 4) === 1 && (symbol.info & 15) === 2,
      `${f.name}: function must be global STT_FUNC`);
    expectedRelocations.set(section.index, [
      ...f.branches.map(b => [b.offset, 28, b.symbol]),
      ...f.literals.map(l => [l.offset, 2, l.symbol]),
    ].sort((a, b) => a[0] - b[0]));
  }
  for (const identity of [...primaryEntries, ...literalIdentities]) {
    const matches = elf.symbols.filter(s => s.name === identity);
    check(matches.length === 1, `${identity}: expected one referenced symbol`);
    check((matches[0].info >> 4) === 1 &&
      (matches[0].shndx === 0 || matches[0].shndx < elf.sections.length),
    `${identity}: reference must be a valid global symbol`);
  }
  for (const [sectionIndex, expected] of expectedRelocations) {
    const relsecs = elf.sections.filter(s => (s.type === 9 || s.type === 4) && s.info === sectionIndex);
    if (expected.length === 0) {
      check(relsecs.length === 0, `${elf.sections[sectionIndex].name}: unexpected relocations`);
      continue;
    }
    check(relsecs.length === 1, `${elf.sections[sectionIndex].name}: expected one relocation section`);
    const relsec = relsecs[0];
    check(relsec.type === 9 && relsec.link === elf.symtab.index && relsec.entsize >= 8 &&
      relsec.size % relsec.entsize === 0, `${relsec.name}: invalid REL table`);
    const actual = [];
    for (let p = relsec.offset; p < relsec.offset + relsec.size; p += relsec.entsize) {
      const offset = elf.data.readUInt32LE(p);
      const info = elf.data.readUInt32LE(p + 4);
      const symbolIndex = info >>> 8;
      check(symbolIndex < elf.symbols.length, `${relsec.name}: symbol index out of bounds`);
      actual.push([offset, info & 255, elf.symbols[symbolIndex].name]);
    }
    same(actual.sort((a, b) => a[0] - b[0]), expected,
      `${elf.sections[sectionIndex].name}: relocation schedule mismatch`);
  }
  const tool = findObjdump();
  check(tool, "an ARM-capable objdump is required for object validation");
  for (const f of config.functions) {
    const run = spawnSync(tool, ["-d", "--no-show-raw-insn", `--section=${f.section}`, path], {
      encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
    });
    check(run.status === 0 && !run.error, `${f.name}: safe bounded disassembly failed`);
    const mnemonics = run.stdout.split(/\r?\n/).flatMap(line => {
      const match = line.match(/^\s*[0-9a-f]+:\s+([a-z][a-z0-9.]*)\b/i);
      return match ? [normalizeMnemonic(match[1].toLowerCase())] : [];
    });
    const expected = bodies.get(f.name).instructions.map(line =>
      normalizeMnemonic(line.match(/^([a-z][a-z0-9.]*)/i)[1].toLowerCase()));
    same(mnemonics, expected, `${f.name}: disassembled mnemonic schedule mismatch`);
  }
}

function findObjdump() {
  const crossObjdump = process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}objdump` : null;
  for (const candidate of [
    process.env.ARM_NONE_EABI_OBJDUMP, process.env.ARM_OBJDUMP, crossObjdump,
    "arm-none-eabi-objdump", process.env.LLVM_OBJDUMP, "llvm-objdump",
  ]) {
    if (!candidate) continue;
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0) return candidate;
  }
  if (existsSync("/nix/store")) {
    for (const entry of readdirSync("/nix/store").sort().reverse()) {
      const candidate = `/nix/store/${entry}/bin/arm-none-eabi-objdump`;
      if (existsSync(candidate)) return candidate;
    }
    for (const entry of readdirSync("/nix/store").sort().reverse()) {
      const candidate = `/nix/store/${entry}/bin/llvm-objdump`;
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

let objectPath = null;
if (process.argv.length === 4 && process.argv[2] === "--object") objectPath = process.argv[3];
else if (process.argv.length === 3) objectPath = process.argv[2];
else if (process.argv.length !== 2) fail("usage: validate-arm-ipc-wrappers-76.mjs [--object] [object.o]");
if (objectPath) validateObject(resolve(process.cwd(), objectPath));

console.log(`arm-ipc-wrappers-76: OK (${instructionCount} instructions, ${bodyBytes} body bytes, 24 adjacent bytes${objectPath ? ", object verified" : ""})`);
