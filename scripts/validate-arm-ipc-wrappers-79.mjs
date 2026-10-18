#!/usr/bin/env node

import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { delimiter, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const CONFIG_PATH = join(ROOT, "config", "arm-ipc-wrappers-79.json");
const EXPECTED_HASH = "bdb443def8fb845132c4301a89fafc6b50a05ce3af09bd667279efe263a259b3";
const EXPECTED_NAMES = [
  "func_0019125C",
  "func_001919DC",
  "func_00192BF8",
  "func_00192C4C",
  "func_00192EA4",
];
const EXPECTED_SIZES = [12, 28, 80, 84, 56];
const EXPECTED_ADJACENT = [0, 0, 4, 4, 12];
const R_ARM_ABS32 = 2;
const R_ARM_CALL = 28;
const MAX_ELF_BYTES = 64 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function own(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function exactKeys(object, keys, where) {
  assert(object && typeof object === "object" && !Array.isArray(object), `${where} must be an object`);
  const actual = Object.keys(object).sort();
  const expected = [...keys].sort();
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${where} has unexpected or missing fields`);
}

function safeInteger(value, where) {
  assert(Number.isSafeInteger(value) && value >= 0, `${where} must be a non-negative safe integer`);
  return value;
}

function boundedRange(offset, size, limit, where) {
  safeInteger(offset, `${where} offset`);
  safeInteger(size, `${where} size`);
  assert(offset <= limit && size <= limit - offset, `${where} is outside the file`);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function validateConfig(config) {
  exactKeys(config, ["schemaVersion", "source", "sourceSha256", "normalizedScheduleSha256", "mode", "totalBodySize", "totalAdjacentSize", "cumulativePoolSlots", "cumulativePoolClasses", "functions", "literalIdentities", "reusedLiteralIdentities", "newLiteralIdentities", "branchIdentityContract"], "config");
  assert(config.schemaVersion === 1, "unsupported config schema");
  assert(config.source === "src/main/arm_ipc_wrappers_79.S", "unexpected source path");
  assert(config.sourceSha256 === EXPECTED_HASH, "source hash contract was changed");
  assert(config.normalizedScheduleSha256 === EXPECTED_HASH, "schedule hash contract was changed");
  assert(config.mode === "arm", "mode must be ARM");
  assert(config.totalBodySize === 260, "body total must be 260");
  assert(config.totalAdjacentSize === 20, "adjacent total must be 20");
  assert(config.cumulativePoolSlots === 788, "cumulative pool-slot total must be 788");
  assert(config.cumulativePoolClasses === 417, "cumulative pool-class total must be 417");
  assert(Array.isArray(config.functions) && config.functions.length === 5, "exactly five functions are required");

  const nextNames = ["func_001919DC", "func_001919F8", "func_00192C4C", "func_00192EA4", "func_00192EE8"];
  const nextOffsets = [1920, 28, 84, 600, 68];
  const expectedBranches = [
    [],
    [[16, "R_ARM_CALL", "bl", "func_00193C68"]],
    [[12, "R_ARM_CALL", "bl", "func_0017E4D8"]],
    [[16, "R_ARM_CALL", "bl", "func_0017E4D8"]],
    [],
  ];
  const expectedLiterals = [
    [], [],
    [[80, [24], "ipc_controller_selector_offset_77"]],
    [[84, [28], "ipc_controller_selector_offset_77"]],
    [[56, [0], "ipc_popcount_pair_mask_79"], [60, [4], "ipc_popcount_lane_mask_79"], [64, [24], "ipc_popcount_nibble_mask_79"]],
  ];
  for (let i = 0; i < config.functions.length; i++) {
    const fn = config.functions[i];
    exactKeys(fn, ["name", "section", "size", "nextGlobal", "nextGlobalOffset", "branches", "literals"], `functions[${i}]`);
    assert(fn.name === EXPECTED_NAMES[i], `wrong function at index ${i}`);
    assert(fn.section === `.text.${fn.name}`, `wrong section for ${fn.name}`);
    assert(fn.size === EXPECTED_SIZES[i], `wrong size for ${fn.name}`);
    assert(fn.nextGlobal === nextNames[i] && fn.nextGlobalOffset === nextOffsets[i], `wrong following-global boundary for ${fn.name}`);
    for (const [j, item] of fn.branches.entries()) exactKeys(item, ["offset", "kind", "mnemonic", "symbol"], `functions[${i}].branches[${j}]`);
    for (const [j, item] of fn.literals.entries()) exactKeys(item, ["offset", "loadOffsets", "symbol"], `functions[${i}].literals[${j}]`);
    assert(JSON.stringify(fn.branches.map(x => [x.offset, x.kind, x.mnemonic, x.symbol])) === JSON.stringify(expectedBranches[i]), `wrong branch contract for ${fn.name}`);
    assert(JSON.stringify(fn.literals.map(x => [x.offset, x.loadOffsets, x.symbol])) === JSON.stringify(expectedLiterals[i]), `wrong literal contract for ${fn.name}`);
  }
  assert(config.functions.reduce((n, f) => n + f.size, 0) === 260, "body-size sum mismatch");
  assert(JSON.stringify(config.literalIdentities) === JSON.stringify(["ipc_controller_selector_offset_77", "ipc_popcount_pair_mask_79", "ipc_popcount_lane_mask_79", "ipc_popcount_nibble_mask_79"]), "literal identities changed");
  assert(JSON.stringify(config.reusedLiteralIdentities) === JSON.stringify(["ipc_controller_selector_offset_77"]), "reused literal identity changed");
  assert(JSON.stringify(config.newLiteralIdentities) === JSON.stringify(["ipc_popcount_pair_mask_79", "ipc_popcount_lane_mask_79", "ipc_popcount_nibble_mask_79"]), "new literal identities changed");
  const branch = config.branchIdentityContract;
  exactKeys(branch, ["mode", "minimumAlignment", "primaryEntries", "secondaryEntries", "secondaryEntryRelations", "sharedClasses", "singletonClasses", "classesPairwiseDistinct"], "branchIdentityContract");
  assert(branch.mode === "arm" && branch.minimumAlignment === 4, "branch mode/alignment mismatch");
  assert(JSON.stringify(branch.primaryEntries) === JSON.stringify(["func_00193C68", "func_0017E4D8"]), "primary branch classes changed");
  assert(Array.isArray(branch.secondaryEntries) && branch.secondaryEntries.length === 0, "secondary entries are forbidden");
  assert(Array.isArray(branch.secondaryEntryRelations) && branch.secondaryEntryRelations.length === 0, "secondary relations are forbidden");
  assert(branch.classesPairwiseDistinct === true, "branch classes must be distinct");
  assert(JSON.stringify(branch.sharedClasses) === JSON.stringify([{ symbol: "func_0017E4D8", sites: [{ function: "func_00192BF8", offset: 12 }, { function: "func_00192C4C", offset: 16 }] }]), "shared branch class changed");
  assert(JSON.stringify(branch.singletonClasses) === JSON.stringify(["func_00193C68"]), "singleton branch class changed");
}

function readCString(buffer, start, end, where) {
  assert(start >= 0 && start < end, `${where} string offset is invalid`);
  const nul = buffer.indexOf(0, start);
  assert(nul >= start && nul < end, `${where} string is unterminated`);
  return buffer.toString("utf8", start, nul);
}

function parseElf(buffer, label) {
  assert(buffer.length <= MAX_ELF_BYTES, `${label} exceeds the ELF size limit`);
  assert(buffer.length >= 52, `${label} is too short for ELF32`);
  assert(buffer[0] === 0x7f && buffer.toString("ascii", 1, 4) === "ELF", `${label} is not ELF`);
  assert(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1, `${label} must be ELF32 little-endian version 1`);
  assert(buffer.readUInt16LE(16) === 1, `${label} must be relocatable ELF`);
  assert(buffer.readUInt16LE(18) === 40, `${label} must target ARM`);
  const shoff = buffer.readUInt32LE(32);
  const shentsize = buffer.readUInt16LE(46);
  const shnum = buffer.readUInt16LE(48);
  const shstrndx = buffer.readUInt16LE(50);
  assert(shnum > 0 && shnum <= MAX_SECTIONS && shentsize >= 40, `${label} has invalid section-table dimensions`);
  assert(shstrndx < shnum, `${label} has invalid shstrndx`);
  boundedRange(shoff, shentsize * shnum, buffer.length, `${label} section table`);
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const at = shoff + i * shentsize;
    const section = {
      index: i,
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
    if (section.type !== 8) boundedRange(section.offset, section.size, buffer.length, `${label} section ${i}`);
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  assert(shstr.type === 3, `${label} section-name table is not STRTAB`);
  const shstrEnd = shstr.offset + shstr.size;
  for (const section of sections) section.name = section.nameOffset === 0 ? "" : readCString(buffer, shstr.offset + section.nameOffset, shstrEnd, `${label} section name`);
  const sectionNames = new Set();
  for (const section of sections) {
    if (!section.name) continue;
    assert(!sectionNames.has(section.name), `${label} has duplicate section ${section.name}`);
    sectionNames.add(section.name);
  }

  const symbolsByTable = new Map();
  const symbols = [];
  for (const table of sections.filter(s => s.type === 2)) {
    assert(table.entsize === 16 && table.size % 16 === 0, `${label} has malformed SYMTAB`);
    assert(table.size / 16 <= MAX_SYMBOLS && table.link < sections.length, `${label} has unsafe SYMTAB bounds`);
    const strings = sections[table.link];
    assert(strings.type === 3, `${label} SYMTAB does not link to STRTAB`);
    const stringEnd = strings.offset + strings.size;
    const entries = [];
    for (let i = 0; i < table.size / 16; i++) {
      const at = table.offset + i * 16;
      const nameOffset = buffer.readUInt32LE(at);
      const symbol = {
        index: i,
        table: table.index,
        name: nameOffset === 0 ? "" : readCString(buffer, strings.offset + nameOffset, stringEnd, `${label} symbol name`),
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
  for (const relsec of sections.filter(s => s.type === 9 || s.type === 4)) {
    const width = relsec.type === 9 ? 8 : 12;
    assert(relsec.entsize === width && relsec.size % width === 0, `${label} has malformed relocation section`);
    assert(relsec.size / width <= MAX_RELOCS && relsec.info < sections.length, `${label} has unsafe relocation bounds`);
    const symtab = symbolsByTable.get(relsec.link);
    assert(symtab, `${label} relocation section has invalid symbol-table link`);
    const target = sections[relsec.info];
    for (let i = 0; i < relsec.size / width; i++) {
      const at = relsec.offset + i * width;
      const offset = buffer.readUInt32LE(at);
      const info = buffer.readUInt32LE(at + 4);
      const symbolIndex = info >>> 8;
      assert(symbolIndex < symtab.length, `${label} relocation has invalid symbol index`);
      assert(offset <= target.size && target.size - offset >= 4, `${label} relocation lies outside ${target.name}`);
      relocations.push({ section: target.name, offset, type: info & 0xff, symbol: symtab[symbolIndex].name, format: relsec.type === 9 ? "REL" : "RELA" });
    }
  }
  return { buffer, sections, symbols, relocations };
}

function sectionByName(elf, name, label) {
  const found = elf.sections.filter(s => s.name === name);
  assert(found.length === 1, `${label} must contain exactly one ${name} section`);
  return found[0];
}

function sectionBytes(elf, section) {
  return elf.buffer.subarray(section.offset, section.offset + section.size);
}

function validateElf(elf, config, label) {
  const configuredSections = new Set(config.functions.map(f => f.section));
  const globalFunctions = elf.symbols.filter(s => (s.info & 0xf) === 2 && (s.info >>> 4) === 1 && s.shndx < elf.sections.length && configuredSections.has(elf.sections[s.shndx].name));
  assert(globalFunctions.length === 5, `${label} must define exactly five global functions in configured sections`);
  let previousSectionIndex = -1;
  for (let i = 0; i < config.functions.length; i++) {
    const fn = config.functions[i];
    const section = sectionByName(elf, fn.section, label);
    assert(section.type === 1 && (section.flags & 0x6) === 0x6 && section.align >= 4, `${label} ${fn.section} has wrong type, flags, or alignment`);
    assert(section.index > previousSectionIndex, `${label} configured sections are out of order`);
    previousSectionIndex = section.index;
    assert(section.size === fn.size + EXPECTED_ADJACENT[i], `${label} ${fn.section} claims unexpected bytes`);
    const matches = globalFunctions.filter(s => s.name === fn.name && s.shndx === section.index);
    assert(matches.length === 1, `${label} has missing or duplicate symbol ${fn.name}`);
    assert(matches[0].value === 0 && matches[0].size === fn.size && (matches[0].value & 3) === 0, `${label} has wrong extent for ${fn.name}`);
    assert(fn.nextGlobalOffset === fn.size + EXPECTED_ADJACENT[i] || fn.nextGlobalOffset > fn.size + EXPECTED_ADJACENT[i], `${fn.name} following-global boundary overlaps owned bytes`);
  }

  const expectedRelocs = [];
  for (const fn of config.functions) {
    for (const item of fn.branches) expectedRelocs.push({ section: fn.section, offset: item.offset, type: R_ARM_CALL, symbol: item.symbol });
    for (const item of fn.literals) expectedRelocs.push({ section: fn.section, offset: item.offset, type: R_ARM_ABS32, symbol: item.symbol });
  }
  const selectedRelocs = elf.relocations.filter(r => configuredSections.has(r.section));
  assert(selectedRelocs.every(r => r.format === "REL"), `${label} configured sections must use bounded ELF32 REL records`);
  const key = r => `${r.section}:${r.offset}:${r.type}:${r.symbol}`;
  assert(JSON.stringify(selectedRelocs.map(key).sort()) === JSON.stringify(expectedRelocs.map(key).sort()), `${label} relocation schedule or identities differ`);
  assert(selectedRelocs.filter(r => r.type === R_ARM_CALL).length === 3, `${label} must have three direct-transfer relocations`);
  assert(selectedRelocs.filter(r => r.type === R_ARM_ABS32).length === 5, `${label} must have five literal relocations`);
  assert(new Set(selectedRelocs.filter(r => r.type === R_ARM_CALL).map(r => r.symbol)).size === 2, `${label} must have two transfer classes`);
  assert(new Set(selectedRelocs.filter(r => r.type === R_ARM_ABS32).map(r => r.symbol)).size === 4, `${label} must have four literal classes`);
}

function compareSchedule(candidate, reference, config) {
  for (const fn of config.functions) {
    const got = sectionBytes(candidate, sectionByName(candidate, fn.section, "candidate"));
    const want = sectionBytes(reference, sectionByName(reference, fn.section, "reference"));
    assert(got.equals(want), `candidate body or owned literal bytes differ from the normative schedule in ${fn.name}`);
  }
}

async function executable(command) {
  if (!command || command.includes("\0")) return null;
  if (command.includes("/")) {
    const path = isAbsolute(command) ? command : resolve(process.cwd(), command);
    try { await access(path, fsConstants.X_OK); return path; } catch { return null; }
  }
  for (const directory of (process.env.PATH || "").split(delimiter)) {
    if (!directory) continue;
    const path = join(directory, command);
    try { await access(path, fsConstants.X_OK); return path; } catch { /* continue */ }
  }
  return null;
}

async function discover(kind) {
  const explicit = kind === "as" ? [process.env.ARM_IPC_WRAPPERS_79_AS, process.env.ARM_AS, process.env.AS] : [process.env.ARM_IPC_WRAPPERS_79_OBJDUMP, process.env.ARM_OBJDUMP, process.env.OBJDUMP];
  const prefixes = [process.env.CROSS_COMPILE, process.env.CROSS, process.env.DEVKITARM && join(process.env.DEVKITARM, "bin", "arm-none-eabi-")].filter(Boolean);
  const names = [...explicit, ...prefixes.map(p => `${p}${kind}`), `arm-none-eabi-${kind}`, `arm-linux-gnueabi-${kind}`, `arm-linux-gnueabihf-${kind}`];
  for (const name of names) {
    const found = await executable(name);
    if (found) return found;
  }
  fail(`unable to find an ARM ${kind}; set ARM_${kind.toUpperCase()} or CROSS_COMPILE`);
}

function run(command, args, description) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 16 * 1024 * 1024 });
  } catch (error) {
    const detail = error.stderr ? String(error.stderr).trim() : error.message;
    fail(`${description} failed${detail ? `: ${detail}` : ""}`);
  }
}

function scopedDisassembly(objdump, objectPath, config) {
  let total = 0;
  for (const fn of config.functions) {
    const output = run(objdump, ["-d", "-m", "arm", "-j", fn.section, objectPath], `disassembling ${fn.name}`);
    const addresses = [];
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+([0-9a-fA-F]{8})\s+/);
      if (!match) continue;
      const address = Number.parseInt(match[1], 16);
      if (address < fn.size) addresses.push(address);
    }
    assert(addresses.length === fn.size / 4, `${fn.name} disassembly has the wrong instruction count`);
    for (let i = 0; i < addresses.length; i++) assert(addresses[i] === i * 4, `${fn.name} disassembly is not a contiguous ARM body`);
    total += addresses.length;
  }
  assert(total === 65, "normalized disassembly must contain exactly 65 ARM instructions");
}

async function main() {
  assert(process.argv.length <= 3, "usage: validate-arm-ipc-wrappers-79.mjs [candidate.o]");
  const configRaw = await readFile(CONFIG_PATH);
  const config = JSON.parse(configRaw.toString("utf8"));
  validateConfig(config);
  const sourcePath = resolve(ROOT, config.source);
  assert(sourcePath.startsWith(`${ROOT}/`), "configured source escapes the repository root");
  const source = await readFile(sourcePath);
  assert(sha256(source) === EXPECTED_HASH, "source does not match the normative schedule hash");
  const assembler = await discover("as");
  const objdump = await discover("objdump");
  const temporary = await mkdtemp(join(tmpdir(), "arm-ipc-wrappers-79-"));
  try {
    const referencePath = join(temporary, "reference.o");
    run(assembler, ["-o", referencePath, sourcePath], "assembling the normative source");
    const reference = parseElf(await readFile(referencePath), "reference object");
    validateElf(reference, config, "reference object");
    scopedDisassembly(objdump, referencePath, config);
    if (process.argv[2]) {
      const candidatePath = resolve(process.cwd(), process.argv[2]);
      const candidate = parseElf(await readFile(candidatePath), "candidate object");
      validateElf(candidate, config, "candidate object");
      compareSchedule(candidate, reference, config);
      scopedDisassembly(objdump, candidatePath, config);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
  console.log("arm-ipc-wrappers-79: validation passed (5 functions, 260 body bytes, 65 instructions, 20 adjacent bytes, 3 transfers/2 classes, 5 slots/4 classes, cumulative 788/417)");
}

await main().catch(error => {
  console.error(`arm-ipc-wrappers-79: ${error.message}`);
  process.exitCode = 1;
});
