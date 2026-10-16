#!/usr/bin/env node

import {
  accessSync, constants, copyFileSync, mkdtempSync, readFileSync, rmSync,
  statSync, truncateSync, writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC_SECTION = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_OUTPUT = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "config", "arm-runtime-helpers-89.json"), "utf8"));
const expected = {
  functions: 24,
  bytes: 384,
  instructions: 96,
  branches: 0,
  returns: 24,
  memory: 39,
  instructionHash: "70f3d5a608ef3b1b7a998e06f6d03dcbc005ecfb2804ab4f66970155a64a5b9c",
  branchHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  returnHash: "29a60bc5b819072c96069a4764e20468f2e37a5927b43d83c233505afebce6d4",
};
const metricsByName = new Map([
  ["func_00170C70", 1], ["func_001783A8", 2], ["func_0017850C", 2],
  ["func_00179CF4", 2], ["func_001808D0", 1], ["func_001E51C8", 1],
  ["func_001FBC00", 2], ["func_00205BFC", 2], ["func_00228F30", 2],
  ["func_00235514", 2], ["func_002538D0", 3], ["func_002AD614", 2],
  ["func_002C0C58", 1], ["func_002C6D64", 2], ["func_00321B48", 2],
  ["func_0032ECB0", 1], ["func_0033953C", 2], ["func_00389348", 2],
  ["func_0038A8D0", 2], ["func_003962E4", 1], ["func_003E8280", 2],
  ["func_003F4910", 2], ["func_0040AA8C", 0], ["func_0040CC88", 0],
]);

function fail(message) {
  throw new Error(`runtime helpers 89 validation failed: ${message}`);
}

function executable(path) {
  try { accessSync(path, constants.X_OK); return true; } catch { return false; }
}

function findOnPath(name) {
  for (const directory of (process.env.PATH ?? "").split(delimiter)) {
    if (directory && executable(join(directory, name))) return join(directory, name);
  }
  return null;
}

function completeBin(directory) {
  if (!directory) return null;
  const tools = Object.fromEntries(["as", "ld", "objdump"].map((name) =>
    [name, join(directory, `arm-none-eabi-${name}`)]));
  return Object.values(tools).every(executable) ? tools : null;
}

function resolveToolchain() {
  const known = "/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin";
  for (const directory of [
    process.env.ARM_NONE_EABI_BIN,
    process.env.ARM_TOOLCHAIN_BIN,
    process.env.DEVKITARM && join(process.env.DEVKITARM, "bin"),
    known,
    join(root, "node_modules", "@xpack-dev-tools", "arm-none-eabi-gcc", ".content", "bin"),
  ]) {
    const tools = completeBin(directory);
    if (tools) return tools;
  }
  const assembler = findOnPath("arm-none-eabi-as");
  if (assembler) {
    const tools = completeBin(dirname(assembler));
    if (tools) return tools;
  }
  fail("GNU Arm binutils not found; set ARM_NONE_EABI_BIN to its bin directory");
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", maxBuffer: MAX_OUTPUT });
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0)
    fail(`${command} ${args.join(" ")} exited ${result.status}\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function checkedRange(offset, size, limit, label) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 ||
      offset > limit || size > limit - offset) fail(`${label} lies outside its bounded container`);
}

function parseElf(path) {
  let stat;
  try { stat = statSync(path); } catch (error) { fail(`${path}: ${error.message}`); }
  if (!stat.isFile()) fail(`${path}: not a regular file`);
  if (stat.size > MAX_FILE) fail(`${path}: file exceeds 64 MiB limit`);
  if (stat.size < 52) fail(`${path}: truncated ELF header`);
  const data = readFileSync(path);
  if (data[0] !== 0x7f || data.toString("ascii", 1, 4) !== "ELF") fail(`${path}: bad ELF magic`);
  if (data[4] !== 1 || data[5] !== 1 || data[6] !== 1)
    fail(`${path}: expected ELF32 little-endian version 1`);
  const u16 = (offset) => { checkedRange(offset, 2, data.length, "ELF field"); return data.readUInt16LE(offset); };
  const u32 = (offset) => { checkedRange(offset, 4, data.length, "ELF field"); return data.readUInt32LE(offset); };
  if (u16(16) !== 1 || u16(18) !== 40 || u32(20) !== 1) fail(`${path}: expected an ARM relocatable ELF`);
  if (u16(40) < 52) fail(`${path}: invalid ELF header size`);
  const shoff = u32(32);
  const shentsize = u16(46);
  if (shentsize < 40 || shoff === 0) fail(`${path}: missing or undersized section table`);
  checkedRange(shoff, shentsize, data.length, "section zero");
  let sectionCount = u16(48);
  if (sectionCount === 0) sectionCount = u32(shoff + 20);
  if (sectionCount === 0 || sectionCount > MAX_SECTIONS)
    fail(`${path}: section count ${sectionCount} is outside 1..${MAX_SECTIONS}`);
  checkedRange(shoff, sectionCount * shentsize, data.length, "section table");
  let shstrndx = u16(50);
  if (shstrndx === 0xffff) shstrndx = u32(shoff + 24);
  if (shstrndx >= sectionCount) fail(`${path}: invalid section-name string table index`);

  const sections = [];
  for (let index = 0; index < sectionCount; index += 1) {
    const base = shoff + index * shentsize;
    const section = {
      index, nameOffset: u32(base), type: u32(base + 4), flags: u32(base + 8),
      address: u32(base + 12), offset: u32(base + 16), size: u32(base + 20),
      link: u32(base + 24), info: u32(base + 28), align: u32(base + 32), entsize: u32(base + 36),
    };
    if (section.type !== 8) checkedRange(section.offset, section.size, data.length, `section ${index}`);
    if ((section.flags & 4) && section.size > MAX_EXEC_SECTION)
      fail(`${path}: executable section ${index} exceeds 16 MiB limit`);
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail(`${path}: section-name table is not STRTAB`);
  const stringAt = (table, offset, label) => {
    if (offset >= table.size) fail(`${path}: ${label} string offset is outside its table`);
    const start = table.offset + offset;
    const end = data.indexOf(0, start);
    if (end < 0 || end >= table.offset + table.size) fail(`${path}: unterminated ${label} string`);
    return data.toString("utf8", start, end);
  };
  for (const section of sections) section.name = stringAt(shstr, section.nameOffset, "section-name");

  const symbols = [];
  let symbolCount = 0;
  for (const section of sections.filter((item) => item.type === 2 || item.type === 11)) {
    if (section.entsize < 16 || section.size % section.entsize !== 0)
      fail(`${path}: malformed symbol table ${section.name}`);
    if (section.link >= sections.length || sections[section.link].type !== 3)
      fail(`${path}: symbol table ${section.name} has invalid string-table link`);
    const count = section.size / section.entsize;
    symbolCount += count;
    if (count > MAX_SYMBOLS || symbolCount > MAX_SYMBOLS)
      fail(`${path}: symbol tables exceed symbol limit`);
    const strings = sections[section.link];
    for (let index = 0; index < count; index += 1) {
      const base = section.offset + index * section.entsize;
      symbols.push({
        name: stringAt(strings, u32(base), "symbol-name"), value: u32(base + 4), size: u32(base + 8),
        bind: data[base + 12] >>> 4, type: data[base + 12] & 15, shndx: u16(base + 14),
      });
    }
  }
  const relocations = sections.filter((section) => section.type === 9 || section.type === 4);
  for (const section of relocations) {
    const minimum = section.type === 9 ? 8 : 12;
    if (section.info >= sections.length || section.link >= sections.length ||
        (sections[section.link].type !== 2 && sections[section.link].type !== 11))
      fail(`${path}: relocation section ${section.name} has invalid link or target`);
    if (section.entsize < minimum || section.size % section.entsize !== 0)
      fail(`${path}: malformed relocation section ${section.name}`);
  }
  return { path, sections, symbols, relocations };
}

const branchMnemonic = /^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const callMnemonic = /^blx?(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const memoryMnemonic = /^(?:v?(?:ldr|str|ldm|stm)|push|pop)/;
const bxMnemonic = /^bx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;

function parseInstructions(text, sectionSize, functionName) {
  const instructions = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)(?:\s+(.*?))?\s*$/);
    if (!match) continue;
    const operands = (match[3] ?? "").replace(/\s+@.*$/, "").trim().replace(/\s+/g, " ");
    instructions.push({ offset: parseInt(match[1], 16), mnemonic: match[2].toLowerCase(), operands });
  }
  if (!instructions.length) fail(`${functionName}: section-scoped disassembly contained no instructions`);
  const result = { instructions: [], branches: [], returns: [], memory: 0, calls: 0, external: 0, pcRelative: 0 };
  const seenOffsets = new Set();
  for (const instruction of instructions) {
    const { offset, mnemonic, operands } = instruction;
    if (offset >= sectionSize || offset % 4 !== 0 || seenOffsets.has(offset))
      fail(`${functionName}: instruction offset ${offset} is out of bounds, unaligned, or duplicated`);
    seenOffsets.add(offset);
    result.instructions.push(`${functionName}:${offset.toString(16)}:${mnemonic}:${operands}`);
    if (memoryMnemonic.test(mnemonic)) result.memory += 1;
    if (callMnemonic.test(mnemonic)) result.calls += 1;
    if (branchMnemonic.test(mnemonic)) {
      const target = operands.match(/^([0-9a-fA-F]+)\b/);
      if (!target || parseInt(target[1], 16) >= sectionSize) result.external += 1;
      result.branches.push(`${functionName}:${offset.toString(16)}:${mnemonic}:${target?.[1].toLowerCase() ?? "?"}`);
    }
    const lrReturn = bxMnemonic.test(mnemonic) && /^lr\b/.test(operands);
    const pcReturn = /^(?:pop\S*|ldm\S*)$/.test(mnemonic) && /\bpc\}/.test(operands);
    if (lrReturn || pcReturn) result.returns.push(`${functionName}:${offset.toString(16)}:${mnemonic}:${operands}`);
    else if (/^bx/.test(mnemonic) || pcReturn) result.external += 1;
    if (/\[\s*pc(?:\s*,|\s*\])/.test(operands) || /^adr(?:l)?$/.test(mnemonic)) result.pcRelative += 1;
  }
  if (instructions.length * 4 !== sectionSize || instructions.some((item, index) => item.offset !== index * 4))
    fail(`${functionName}: disassembly does not cover its section exactly`);
  return result;
}

function digest(entries) {
  return createHash("sha256").update(entries.join("\n")).digest("hex");
}

function validateObject(path, tools, label, standalone = false) {
  const elf = parseElf(path);
  const sectionsByName = new Map();
  for (const section of elf.sections) {
    const list = sectionsByName.get(section.name) ?? [];
    list.push(section);
    sectionsByName.set(section.name, list);
  }
  const totals = { bytes: 0, instructions: [], branches: [], returns: [], memory: 0 };
  const ownedIndexes = new Set();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const matches = sectionsByName.get(sectionName) ?? [];
    if (matches.length !== 1) fail(`${label}: expected one owned section ${sectionName}, found ${matches.length}`);
    const section = matches[0];
    ownedIndexes.add(section.index);
    if (section.type !== 1 || (section.flags & 6) !== 6 || section.align !== 4 || section.size !== fn.size)
      fail(`${label}: malformed owned section ${sectionName}`);
    if (elf.relocations.some((relocation) => relocation.info === section.index))
      fail(`${label}: ${sectionName} has a relocation section`);
    const symbols = elf.symbols.filter((symbol) => symbol.name === fn.name);
    if (symbols.length !== 1) fail(`${label}: expected one symbol named ${fn.name}, found ${symbols.length}`);
    const symbol = symbols[0];
    if (symbol.bind !== 1 || symbol.type !== 2 || symbol.shndx !== section.index || symbol.value !== 0 || symbol.size !== fn.size)
      fail(`${label}: malformed function symbol ${fn.name}`);
    const ownedNamed = elf.symbols.filter((item) => item.shndx === section.index && item.name);
    const ownedFunctions = elf.symbols.filter((item) => item.shndx === section.index && item.type === 2);
    const mapping = ownedNamed.filter((item) => item.name === "$a");
    const extraSymbols = ownedNamed.filter((item) => item.name !== fn.name && item.name !== "$a");
    if (ownedFunctions.length !== 1 || ownedFunctions[0] !== symbol ||
        mapping.length !== 1 || mapping[0].bind !== 0 || mapping[0].type !== 0 ||
        mapping[0].value !== 0 || mapping[0].size !== 0 || extraSymbols.length)
      fail(`${label}: owned named-symbol set is not exact in ${sectionName}`);
    const parsed = parseInstructions(run(tools.objdump, ["-d", "-j", sectionName, path]), fn.size, fn.name);
    if (parsed.instructions.length !== 4 || parsed.memory !== metricsByName.get(fn.name) || parsed.returns.length !== 1)
      fail(`${label}: ${fn.name} instruction/memory/return metrics mismatch`);
    if (parsed.calls || parsed.external || parsed.pcRelative)
      fail(`${label}: ${fn.name} has calls, external transfers, or PC-relative data`);
    totals.bytes += section.size;
    totals.instructions.push(...parsed.instructions);
    totals.branches.push(...parsed.branches);
    totals.returns.push(...parsed.returns);
    totals.memory += parsed.memory;
  }
  if (standalone) {
    const foreignExec = elf.sections.filter((section) => (section.flags & 4) && section.size && !ownedIndexes.has(section.index));
    if (foreignExec.length) fail(`${label}: unexpected nonempty executable sections`);
    const exports = elf.symbols.filter((symbol) => symbol.bind === 1 && symbol.type === 2 && symbol.shndx !== 0)
      .map((symbol) => symbol.name).sort();
    const wanted = config.functions.map((fn) => fn.name).sort();
    if (exports.join("\0") !== wanted.join("\0")) fail(`${label}: exported function set is not exact`);
    if (elf.relocations.length) fail(`${label}: standalone object contains relocation sections`);
  }
  if (totals.bytes !== expected.bytes || totals.instructions.length !== expected.instructions ||
      totals.branches.length !== expected.branches || totals.returns.length !== expected.returns ||
      totals.memory !== expected.memory) fail(`${label}: aggregate metrics mismatch`);
  const hashes = [digest(totals.instructions), digest(totals.branches), digest(totals.returns)];
  if (hashes[0] !== expected.instructionHash || hashes[1] !== expected.branchHash || hashes[2] !== expected.returnHash)
    fail(`${label}: instruction/branch/return schedule mismatch (${hashes.join("/")})`);
  return totals;
}

function validateConfigAndSource() {
  if (config.schemaVersion !== 1 || config.mode !== "arm" || config.functions.length !== expected.functions)
    fail("unexpected config schema, mode, or function count");
  if (config.source !== "src/main/arm_runtime_helpers_89.S") fail("unexpected source path");
  if (new Set(config.functions.map((fn) => fn.name)).size !== expected.functions || metricsByName.size !== expected.functions)
    fail("configured or expected function names are not unique and complete");
  if (config.totalBodySize !== expected.bytes || config.totalAdjacentSize !== 0 ||
      config.functions.reduce((sum, fn) => sum + fn.size, 0) !== expected.bytes ||
      config.functions.some((fn) => fn.size !== 16)) fail("configured sizes are incorrect");
  if (config.instructionScheduleSha256 !== expected.instructionHash ||
      config.branchScheduleSha256 !== expected.branchHash || config.returnScheduleSha256 !== expected.returnHash)
    fail("configured schedule hashes are incorrect");
  if (config.functions.some((fn) => !Array.isArray(fn.calls) || fn.calls.length ||
      !Array.isArray(fn.adjacentWords) || fn.adjacentWords.length)) fail("calls or adjacent data are configured");
  if (config.pcRelativeDataAccesses.length || Object.keys(config.symbolicIdentities).length ||
      Object.keys(config.symbolicSlots).length) fail("unexpected symbolic or PC-relative configuration");
  const identity = config.identityClasses.call_free_runtime_helpers_89;
  if (!identity || identity.members.join("\0") !== config.functions.map((fn) => fn.name).join("\0") ||
      identity.parameters.join("\0") !== ["controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule"].join("\0"))
    fail("identity class is incorrect");
  const source = join(root, config.source);
  const sourceHash = createHash("sha256").update(readFileSync(source)).digest("hex");
  if (sourceHash !== config.sourceSha256) fail(`source SHA-256 ${sourceHash} does not match ${config.sourceSha256}`);
  return source;
}

function expectFailure(action, pattern, label) {
  try { action(); } catch (error) {
    if (pattern.test(String(error.message))) return;
    fail(`${label} failed for the wrong reason: ${error.message}`);
  }
  fail(`${label} was unexpectedly accepted`);
}

function hostileSourceText(sectionCount) {
  const lines = [
    ".syntax unified", ".arch armv6k", ".arm",
    '.section .text.runtime89_hostile,"ax",%progbits',
    ".global runtime89_hostile", ".type runtime89_hostile,%function", "runtime89_hostile:",
    " bl runtime89_undefined", " ldr r0,[pc]", " bx lr", " .word runtime89_undefined",
    ".size runtime89_hostile,.-runtime89_hostile",
  ];
  for (let index = 0; index < sectionCount; index += 1)
    lines.push(`.section .runtime89_foreign.${index},"",%progbits`, `.byte ${index & 0xff}`);
  return `${lines.join("\n")}\n`;
}

function parseArguments(args) {
  if (!args.length || (args.length === 1 && args[0] === "--source-only")) return null;
  if (args.length === 1 && !args[0].startsWith("-")) return resolve(args[0]);
  if (args.length === 2 && args[0] === "--object") return resolve(args[1]);
  if (args.length === 1 && args[0].startsWith("--object=")) {
    const value = args[0].slice("--object=".length);
    if (value) return resolve(value);
  }
  fail("usage: validate-arm-runtime-helpers-89.mjs [--source-only | --object OBJECT | OBJECT]");
}

let temporary;
try {
  const candidate = parseArguments(process.argv.slice(2));
  const source = validateConfigAndSource();
  const tools = resolveToolchain();
  temporary = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-89-"));
  const object = join(temporary, "runtime89.o");
  run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", object, source]);
  const standalone = validateObject(object, tools, "standalone", true);

  const hostileSource = join(temporary, "hostile.S");
  const hostileObject = join(temporary, "hostile.o");
  const combinedObject = join(temporary, "combined.o");
  writeFileSync(hostileSource, hostileSourceText(12050));
  run(tools.as, ["-march=armv6k", "-o", hostileObject, hostileSource]);
  run(tools.ld, ["-r", "-o", combinedObject, object, hostileObject]);
  const hostileElf = parseElf(combinedObject);
  if (hostileElf.sections.length < 12000) fail("high-section-count composite self-test was ineffective");
  const hostileSection = hostileElf.sections.find((section) => section.name === ".text.runtime89_hostile");
  if (!hostileSection || !hostileElf.relocations.some((relocation) => relocation.info === hostileSection.index))
    fail("hostile composite self-test fixture lacks its intended foreign relocation");
  validateObject(combinedObject, tools, "hostile composite");

  const largeSource = join(temporary, "large.S");
  const largeObject = join(temporary, "large.o");
  writeFileSync(largeSource, `.syntax unified\n.arm\n.section .text.runtime89_large,"ax",%progbits\n.space ${MAX_EXEC_SECTION + 1}\n`);
  run(tools.as, ["-march=armv6k", "-o", largeObject, largeSource]);
  expectFailure(() => parseElf(largeObject), /exceeds 16 MiB limit/, "large executable-section self-test");

  const oversized = join(temporary, "oversized.o");
  copyFileSync(object, oversized);
  truncateSync(oversized, MAX_FILE + 1);
  expectFailure(() => parseElf(oversized), /exceeds 64 MiB limit/, "oversized-file self-test");

  const tooManySections = join(temporary, "too-many-sections.o");
  const corrupt = Buffer.from(readFileSync(object));
  corrupt.writeUInt16LE(MAX_SECTIONS + 1, 48);
  writeFileSync(tooManySections, corrupt);
  expectFailure(() => parseElf(tooManySections), /section count/, "section-count self-test");

  if (candidate) validateObject(candidate, tools, "candidate");
  console.log(`arm runtime helpers 89: ${config.functions.length} functions, ${standalone.bytes} bytes, ${standalone.instructions.length} instructions; schedules, native ELF bounds, hostile composite, and large-section checks passed${candidate ? "; candidate passed" : ""}`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
