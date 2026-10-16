#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  accessSync, constants, copyFileSync, mkdtempSync, readFileSync, rmSync,
  statSync, truncateSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC_SECTION = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_OUTPUT = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config", "arm-runtime-helpers-90.json");
const specPath = join(root, "docs", "specs", "main", "arm_runtime_helpers_90.md");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expected = Object.freeze({
  functions: 24,
  bytes: 384,
  instructions: 96,
  branches: 0,
  returns: 24,
  memory: 38,
  instructionHash: "b86aba348c317d812432ab4e543e69d99eb40ff214568397d779172b3f580ea1",
  branchHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  returnHash: "9b7608e6bf307f0740b063b9327eff164426ebaa3381682c87c88ab12c3be440",
  sourceHash: "9b6623101c06a4f77d67cec0758f0d565c0ec4b0f56e919416ceb05e63584a02",
});

function fail(message) {
  throw new Error(`runtime helpers 90 validation failed: ${message}`);
}

function executable(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function findOnPath(name) {
  for (const directory of (process.env.PATH ?? "").split(delimiter)) {
    if (directory && executable(join(directory, name))) return join(directory, name);
  }
  return null;
}

function completeToolchain(directory) {
  if (!directory) return null;
  const tools = Object.fromEntries(
    ["as", "ld", "objdump"].map((name) => [name, join(directory, `arm-none-eabi-${name}`)]),
  );
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
    const tools = completeToolchain(directory);
    if (tools) return tools;
  }
  const assembler = findOnPath("arm-none-eabi-as");
  if (assembler) {
    const tools = completeToolchain(dirname(assembler));
    if (tools) return tools;
  }
  fail("GNU Arm binutils not found; set ARM_NONE_EABI_BIN to its bin directory");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_OUTPUT,
  });
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} exited ${result.status}\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function checkedRange(offset, size, limit, label) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 ||
      offset > limit || size > limit - offset) {
    fail(`${label} lies outside its bounded container`);
  }
}

function parseElf(path) {
  let stat;
  try {
    stat = statSync(path);
  } catch (error) {
    fail(`${path}: ${error.message}`);
  }
  if (!stat.isFile()) fail(`${path}: not a regular file`);
  if (stat.size > MAX_FILE) fail(`${path}: file exceeds 64 MiB limit`);
  if (stat.size < 52) fail(`${path}: truncated ELF header`);
  const data = readFileSync(path);
  if (data[0] !== 0x7f || data.toString("ascii", 1, 4) !== "ELF") fail(`${path}: bad ELF magic`);
  if (data[4] !== 1 || data[5] !== 1 || data[6] !== 1) {
    fail(`${path}: expected ELF32 little-endian version 1`);
  }
  const u16 = (offset) => {
    checkedRange(offset, 2, data.length, "ELF field");
    return data.readUInt16LE(offset);
  };
  const u32 = (offset) => {
    checkedRange(offset, 4, data.length, "ELF field");
    return data.readUInt32LE(offset);
  };
  if (u16(16) !== 1 || u16(18) !== 40 || u32(20) !== 1) {
    fail(`${path}: expected an ARM relocatable ELF`);
  }
  if (u16(40) < 52) fail(`${path}: invalid ELF header size`);
  const sectionOffset = u32(32);
  const sectionEntrySize = u16(46);
  if (sectionOffset === 0 || sectionEntrySize < 40) fail(`${path}: missing or undersized section table`);
  checkedRange(sectionOffset, sectionEntrySize, data.length, "section zero");
  let sectionCount = u16(48);
  if (sectionCount === 0) sectionCount = u32(sectionOffset + 20);
  if (sectionCount === 0 || sectionCount > MAX_SECTIONS) {
    fail(`${path}: section count ${sectionCount} is outside 1..${MAX_SECTIONS}`);
  }
  checkedRange(sectionOffset, sectionCount * sectionEntrySize, data.length, "section table");
  let sectionNamesIndex = u16(50);
  if (sectionNamesIndex === 0xffff) sectionNamesIndex = u32(sectionOffset + 24);
  if (sectionNamesIndex >= sectionCount) fail(`${path}: invalid section-name string-table index`);

  const sections = [];
  for (let index = 0; index < sectionCount; index += 1) {
    const base = sectionOffset + index * sectionEntrySize;
    const section = {
      index,
      nameOffset: u32(base),
      type: u32(base + 4),
      flags: u32(base + 8),
      address: u32(base + 12),
      offset: u32(base + 16),
      size: u32(base + 20),
      link: u32(base + 24),
      info: u32(base + 28),
      align: u32(base + 32),
      entsize: u32(base + 36),
    };
    if (section.type !== 8) checkedRange(section.offset, section.size, data.length, `section ${index}`);
    if ((section.flags & 4) !== 0 && section.size > MAX_EXEC_SECTION) {
      fail(`${path}: executable section ${index} exceeds 16 MiB limit`);
    }
    sections.push(section);
  }

  const sectionNames = sections[sectionNamesIndex];
  if (sectionNames.type !== 3) fail(`${path}: section-name table is not STRTAB`);
  function stringAt(table, offset, label) {
    if (offset >= table.size) fail(`${path}: ${label} string offset is outside its table`);
    const start = table.offset + offset;
    const end = data.indexOf(0, start);
    if (end < 0 || end >= table.offset + table.size) fail(`${path}: unterminated ${label} string`);
    return data.toString("utf8", start, end);
  }
  for (const section of sections) {
    section.name = stringAt(sectionNames, section.nameOffset, "section-name");
  }

  const symbols = [];
  let symbolCount = 0;
  for (const table of sections.filter((section) => section.type === 2 || section.type === 11)) {
    if (table.entsize < 16 || table.size % table.entsize !== 0) {
      fail(`${path}: malformed symbol table ${table.name}`);
    }
    if (table.link >= sections.length || sections[table.link].type !== 3) {
      fail(`${path}: symbol table ${table.name} has invalid string-table link`);
    }
    const count = table.size / table.entsize;
    symbolCount += count;
    if (count > MAX_SYMBOLS || symbolCount > MAX_SYMBOLS) fail(`${path}: symbol tables exceed symbol limit`);
    const strings = sections[table.link];
    for (let index = 0; index < count; index += 1) {
      const base = table.offset + index * table.entsize;
      const info = data[base + 12];
      symbols.push({
        name: stringAt(strings, u32(base), "symbol-name"),
        value: u32(base + 4),
        size: u32(base + 8),
        bind: info >>> 4,
        type: info & 15,
        shndx: u16(base + 14),
      });
    }
  }

  const relocations = sections.filter((section) => section.type === 9 || section.type === 4);
  for (const relocation of relocations) {
    const minimumEntrySize = relocation.type === 9 ? 8 : 12;
    if (relocation.info >= sections.length || relocation.link >= sections.length ||
        ![2, 11].includes(sections[relocation.link].type)) {
      fail(`${path}: relocation section ${relocation.name} has invalid link or target`);
    }
    if (relocation.entsize < minimumEntrySize || relocation.size % relocation.entsize !== 0) {
      fail(`${path}: malformed relocation section ${relocation.name}`);
    }
  }
  return { sections, symbols, relocations };
}

const branchMnemonic = /^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const callMnemonic = /^blx?(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const memoryMnemonic = /^(?:v?(?:ldr|str|ldm|stm)|push|pop)/;
const bxMnemonic = /^bx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;

function parseInstructions(text, sectionSize, functionName) {
  const decoded = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)(?:\s+(.*?))?\s*$/);
    if (!match) continue;
    decoded.push({
      offset: Number.parseInt(match[1], 16),
      mnemonic: match[2].toLowerCase(),
      operands: (match[3] ?? "").replace(/\s+@.*$/, "").trim().replace(/\s+/g, " "),
    });
  }
  if (!decoded.length) fail(`${functionName}: section-scoped disassembly contained no instructions`);
  const result = {
    instructions: [], branches: [], returns: [], memory: 0, calls: 0, external: 0, pcRelative: 0,
  };
  const offsets = new Set();
  for (const instruction of decoded) {
    const { offset, mnemonic, operands } = instruction;
    if (offset >= sectionSize || offset % 4 !== 0 || offsets.has(offset)) {
      fail(`${functionName}: instruction offset ${offset} is out of bounds, unaligned, or duplicated`);
    }
    offsets.add(offset);
    const entry = `${functionName}:${offset.toString(16)}:${mnemonic}:${operands}`;
    result.instructions.push(entry);
    if (memoryMnemonic.test(mnemonic)) result.memory += 1;
    if (callMnemonic.test(mnemonic)) result.calls += 1;
    if (branchMnemonic.test(mnemonic)) {
      const target = operands.match(/^([0-9a-fA-F]+)\b/);
      if (!target || Number.parseInt(target[1], 16) >= sectionSize) result.external += 1;
      result.branches.push(`${functionName}:${offset.toString(16)}:${mnemonic}:${target?.[1].toLowerCase() ?? "?"}`);
    }
    const lrReturn = bxMnemonic.test(mnemonic) && /^lr\b/.test(operands);
    const pcReturn = /^(?:pop\S*|ldm\S*)$/.test(mnemonic) && /\bpc\}/.test(operands);
    if (lrReturn || pcReturn) result.returns.push(entry);
    else if (/^bx/.test(mnemonic)) result.external += 1;
    if (/\[\s*pc(?:\s*,|\s*\])/.test(operands) || /^adr(?:l)?$/.test(mnemonic)) {
      result.pcRelative += 1;
    }
  }
  if (decoded.length * 4 !== sectionSize || decoded.some((item, index) => item.offset !== index * 4)) {
    fail(`${functionName}: disassembly does not cover its section exactly`);
  }
  return result;
}

function digest(entries) {
  return createHash("sha256").update(entries.join("\n")).digest("hex");
}

function validateObject(path, tools, label, standalone = false) {
  const elf = parseElf(path);
  const sectionsByName = new Map();
  for (const section of elf.sections) {
    const matches = sectionsByName.get(section.name) ?? [];
    matches.push(section);
    sectionsByName.set(section.name, matches);
  }
  const totals = { bytes: 0, instructions: [], branches: [], returns: [], memory: 0 };
  const ownedIndexes = new Set();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const matches = sectionsByName.get(sectionName) ?? [];
    if (matches.length !== 1) fail(`${label}: expected one owned section ${sectionName}, found ${matches.length}`);
    const section = matches[0];
    ownedIndexes.add(section.index);
    if (section.type !== 1 || section.flags !== 6 || section.align !== 4 || section.size !== fn.size) {
      fail(`${label}: malformed owned section ${sectionName}`);
    }
    if (elf.relocations.some((relocation) => relocation.info === section.index)) {
      fail(`${label}: ${sectionName} has a relocation section`);
    }
    const namedDefinitions = elf.symbols.filter((symbol) => symbol.name === fn.name);
    if (namedDefinitions.length !== 1) {
      fail(`${label}: expected one symbol named ${fn.name}, found ${namedDefinitions.length}`);
    }
    const symbol = namedDefinitions[0];
    if (symbol.bind !== 1 || symbol.type !== 2 || symbol.shndx !== section.index ||
        symbol.value !== 0 || symbol.size !== fn.size) {
      fail(`${label}: malformed function symbol ${fn.name}`);
    }
    const ownedNamed = elf.symbols.filter((item) => item.shndx === section.index && item.name);
    const ownedFunctions = ownedNamed.filter((item) => item.type === 2);
    const mappings = ownedNamed.filter((item) => item.name === "$a");
    const extras = ownedNamed.filter((item) => item.name !== fn.name && item.name !== "$a");
    if (ownedFunctions.length !== 1 || ownedFunctions[0] !== symbol || mappings.length !== 1 ||
        mappings[0].bind !== 0 || mappings[0].type !== 0 || mappings[0].value !== 0 ||
        mappings[0].size !== 0 || extras.length !== 0) {
      fail(`${label}: owned named-symbol set is not exact in ${sectionName}`);
    }
    const disassembly = run(tools.objdump, ["-d", "-j", sectionName, path]);
    const parsed = parseInstructions(disassembly, fn.size, fn.name);
    if (parsed.instructions.length !== 4 || parsed.returns.length !== 1 || parsed.branches.length !== 0 ||
        parsed.calls !== 0 || parsed.external !== 0 || parsed.pcRelative !== 0) {
      fail(`${label}: ${fn.name} control-flow or instruction metrics mismatch`);
    }
    totals.bytes += section.size;
    totals.instructions.push(...parsed.instructions);
    totals.branches.push(...parsed.branches);
    totals.returns.push(...parsed.returns);
    totals.memory += parsed.memory;
  }

  if (standalone) {
    const foreignExecutable = elf.sections.filter(
      (section) => (section.flags & 4) !== 0 && section.size !== 0 && !ownedIndexes.has(section.index),
    );
    if (foreignExecutable.length !== 0) fail(`${label}: unexpected nonempty executable sections`);
    const exports = elf.symbols
      .filter((symbol) => symbol.bind === 1 && symbol.type === 2 && symbol.shndx !== 0)
      .map((symbol) => symbol.name).sort();
    const wanted = config.functions.map((fn) => fn.name).sort();
    if (exports.join("\0") !== wanted.join("\0")) fail(`${label}: exported function set is not exact`);
    if (elf.relocations.length !== 0) fail(`${label}: standalone object contains relocation sections`);
  }

  if (totals.bytes !== expected.bytes || totals.instructions.length !== expected.instructions ||
      totals.branches.length !== expected.branches || totals.returns.length !== expected.returns ||
      totals.memory !== expected.memory) {
    fail(`${label}: aggregate metrics mismatch`);
  }
  const hashes = [digest(totals.instructions), digest(totals.branches), digest(totals.returns)];
  if (hashes[0] !== expected.instructionHash || hashes[1] !== expected.branchHash ||
      hashes[2] !== expected.returnHash) {
    fail(`${label}: instruction/branch/return schedule mismatch (${hashes.join("/")})`);
  }
  return totals;
}

function validateConfigSourceAndSpec() {
  if (config.schemaVersion !== 1 || config.mode !== "arm" || !Array.isArray(config.functions) ||
      config.functions.length !== expected.functions) {
    fail("unexpected config schema, mode, or function count");
  }
  if (config.source !== "src/main/arm_runtime_helpers_90.S") fail("unexpected source path");
  const names = config.functions.map((fn) => fn.name);
  if (new Set(names).size !== expected.functions) fail("configured function names are not unique");
  if (config.totalBodySize !== expected.bytes || config.totalAdjacentSize !== 0 ||
      config.functions.reduce((sum, fn) => sum + fn.size, 0) !== expected.bytes ||
      config.functions.some((fn) => fn.size !== 16)) {
    fail("configured sizes are incorrect");
  }
  if (config.instructionScheduleSha256 !== expected.instructionHash ||
      config.branchScheduleSha256 !== expected.branchHash ||
      config.returnScheduleSha256 !== expected.returnHash) {
    fail("configured schedule hashes are incorrect");
  }
  if (config.functions.some((fn) => !Array.isArray(fn.calls) || fn.calls.length !== 0 ||
      !Array.isArray(fn.adjacentWords) || fn.adjacentWords.length !== 0)) {
    fail("calls or adjacent data are configured");
  }
  if (!Array.isArray(config.pcRelativeDataAccesses) || config.pcRelativeDataAccesses.length !== 0 ||
      Object.keys(config.symbolicIdentities ?? {}).length !== 0 ||
      Object.keys(config.symbolicSlots ?? {}).length !== 0) {
    fail("unexpected symbolic or PC-relative configuration");
  }
  const identity = config.identityClasses?.call_free_runtime_helpers_90;
  if (!identity || identity.members.join("\0") !== names.join("\0") ||
      identity.parameters.join("\0") !==
        ["controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule"].join("\0")) {
    fail("identity class is incorrect");
  }
  if (config.sourceSha256 !== expected.sourceHash) fail("configured source hash is incorrect");
  const source = join(root, config.source);
  const sourceHash = createHash("sha256").update(readFileSync(source)).digest("hex");
  if (sourceHash !== expected.sourceHash) fail(`source SHA-256 mismatch (got ${sourceHash})`);
  const spec = readFileSync(specPath, "utf8");
  const specSource = spec.match(/Source SHA-256: `([0-9a-f]{64})`/);
  const specInstruction = spec.match(/full mnemonic\/operand instruction-schedule SHA-256 is\s+`([0-9a-f]{64})`/);
  const specBranch = spec.match(/direct-branch schedule SHA-256 is\s+`([0-9a-f]{64})`/);
  const specReturn = spec.match(/return-transfer schedule SHA-256 is\s+`([0-9a-f]{64})`/);
  if (specSource?.[1] !== expected.sourceHash || specInstruction?.[1] !== expected.instructionHash ||
      specBranch?.[1] !== expected.branchHash || specReturn?.[1] !== expected.returnHash) {
    fail("specification hashes do not match the batch contract");
  }
  return source;
}

function parseArguments(args) {
  if (args.length === 0 || (args.length === 1 && args[0] === "--source-only")) return null;
  if (args.length === 1 && !args[0].startsWith("-")) return resolve(args[0]);
  if (args.length === 2 && args[0] === "--object" && args[1]) return resolve(args[1]);
  if (args.length === 1 && args[0].startsWith("--object=")) {
    const value = args[0].slice("--object=".length);
    if (value) return resolve(value);
  }
  fail("usage: validate-arm-runtime-helpers-90.mjs [--source-only | --object OBJECT | OBJECT]");
}

function expectFailure(action, pattern, label) {
  try {
    action();
  } catch (error) {
    if (pattern.test(String(error.message))) return;
    fail(`${label} failed for the wrong reason: ${error.message}`);
  }
  fail(`${label} was unexpectedly accepted`);
}

function hostileSourceText(sectionCount) {
  const lines = [
    ".syntax unified", ".arch armv6k", ".arm",
    '.section .text.runtime90_hostile,"ax",%progbits',
    ".global runtime90_hostile", ".type runtime90_hostile,%function", "runtime90_hostile:",
    " bl runtime90_undefined", " ldr r0,[pc]", " bx lr", " .word runtime90_undefined",
    ".size runtime90_hostile,.-runtime90_hostile",
  ];
  for (let index = 0; index < sectionCount; index += 1) {
    lines.push(`.section .runtime90_foreign.${index},"",%progbits`, `.byte ${index & 0xff}`);
  }
  return `${lines.join("\n")}\n`;
}

let temporary;
try {
  const candidate = parseArguments(process.argv.slice(2));
  const source = validateConfigSourceAndSpec();
  const tools = resolveToolchain();
  temporary = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-90-"));
  const object = join(temporary, "runtime90.o");
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
  const hostileSection = hostileElf.sections.find((section) => section.name === ".text.runtime90_hostile");
  if (!hostileSection || !hostileElf.relocations.some((relocation) => relocation.info === hostileSection.index)) {
    fail("hostile composite self-test fixture lacks its intended foreign relocation");
  }
  validateObject(combinedObject, tools, "hostile composite");

  const largeSource = join(temporary, "large.S");
  const largeObject = join(temporary, "large.o");
  writeFileSync(
    largeSource,
    `.syntax unified\n.arm\n.section .text.runtime90_large,"ax",%progbits\n.space ${MAX_EXEC_SECTION + 1}\n`,
  );
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
  console.log(
    `arm runtime helpers 90: ${config.functions.length} functions, ${standalone.bytes} bytes, ` +
    `${standalone.instructions.length} instructions; schedules, native ELF bounds, hostile composite, ` +
    `and large-section checks passed${candidate ? "; candidate passed" : ""}`,
  );
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
