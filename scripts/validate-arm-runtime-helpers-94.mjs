#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_FILE_SIZE = 64 * 1024 * 1024;
const MAX_EXEC_SIZE = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCATIONS = 1_000_000;
const EXPECTED_INSTRUCTIONS = 27;
const EXPECTED_MEMORY_OPERATIONS = 18;
const EXPECTED_RETURNS = 9;
const CONTRACT = Object.freeze({
  sourceSha256: "3458fa03629edb3e807d0149cf23ef276e39eff1863dd9e52ddf88c7539ca0f8",
  instructionScheduleSha256: "ac4b5d8fe00fc8e186e9093ca5c06e6f3f6add76e4d215ef03d0f718a31b9a92",
  branchScheduleSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  returnScheduleSha256: "b877b16a8a8543405f7cabb90ca7da99b9e8bb900c3d4fbd94fb178393683b18",
  names: [
    "func_004C88B8", "func_004C88C4", "func_004C8910",
    "func_004C8A20", "func_004C8FD0", "func_004C9140",
    "func_004C99FC", "func_004C9A08", "func_004CC380",
  ],
});
const KNOWN_TOOL_PREFIX = "/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-runtime-helpers-94.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expected = new Map(config.functions.map((fn) => [fn.name, fn]));

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function usage() {
  return "usage: validate-arm-runtime-helpers-94.mjs [source|SOURCE|OBJECT|--source [SOURCE]|--object OBJECT|--self-test]";
}

function parseArguments(argv) {
  if (argv.length === 1 && argv[0] === "--self-test") {
    return { kind: "source", path: join(root, config.source), selfTest: true };
  }
  if (argv.length === 0 || (argv.length === 1 && argv[0] === "source")) {
    return { kind: "source", path: join(root, config.source) };
  }
  if (argv[0] === "--object") {
    if (argv.length !== 2) fail(usage());
    return { kind: "object", path: resolve(argv[1]) };
  }
  if (argv[0] === "--source") {
    if (argv.length > 2) fail(usage());
    return { kind: "source", path: argv[1] ? resolve(argv[1]) : join(root, config.source) };
  }
  if (argv.length !== 1 || argv[0].startsWith("-")) fail(usage());
  const path = resolve(argv[0]);
  let header;
  try {
    if (statSync(path).size > MAX_FILE_SIZE) fail("input exceeds the 64 MiB limit");
    header = readFileSync(path).subarray(0, 4);
  } catch (error) {
    fail(`cannot read input: ${error.message}`);
  }
  return { kind: header.equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) ? "object" : "source", path };
}

function boundedFile(path, label) {
  const size = statSync(path).size;
  if (size > MAX_FILE_SIZE) fail(`${label} exceeds the 64 MiB limit`);
  return readFileSync(path);
}

function commandCandidates(kind) {
  const sdk = process.env.DEVKITARM;
  const cross = process.env.CROSS_COMPILE;
  if (kind === "as") {
    return [process.env.ARM_AS, cross && `${cross}as`, `${KNOWN_TOOL_PREFIX}as`, sdk && join(sdk, "bin/arm-none-eabi-as"), "arm-none-eabi-as", "arm-linux-gnueabihf-as"].filter(Boolean);
  }
  if (kind === "ld") {
    return [process.env.ARM_LD, cross && `${cross}ld`, `${KNOWN_TOOL_PREFIX}ld`, sdk && join(sdk, "bin/arm-none-eabi-ld"), "arm-none-eabi-ld", "arm-linux-gnueabihf-ld"].filter(Boolean);
  }
  return [process.env.ARM_OBJDUMP, cross && `${cross}objdump`, `${KNOWN_TOOL_PREFIX}objdump`, sdk && join(sdk, "bin/arm-none-eabi-objdump"), "arm-none-eabi-objdump", "arm-linux-gnueabihf-objdump", "objdump"].filter(Boolean);
}

function runFirst(candidates, args, label, maxBuffer = 1024 * 1024) {
  const errors = [];
  for (const command of [...new Set(candidates)]) {
    const result = spawnSync(command, args, { encoding: "utf8", maxBuffer, timeout: 30000 });
    if (result.error?.code === "ENOENT") continue;
    if (!result.error && result.status === 0) return result.stdout;
    const detail = result.error?.message || result.stderr?.trim() || `exit status ${result.status}`;
    errors.push(`${command}: ${detail}`);
  }
  fail(`${label} failed${errors.length ? ` (${errors.join("; ")})` : ": no suitable tool found"}`);
}

function assemble(sourcePath, objectPath) {
  const source = boundedFile(sourcePath, "source");
  if (sha256(source) !== config.sourceSha256) fail("source SHA-256 does not match the specification");
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath], "assembly");
}

function checkedRange(offset, size, limit, label) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > limit || size > limit - offset) {
    fail(`${label} is outside the file`);
  }
}

function cString(table, offset, label) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= table.length) fail(`${label} has an invalid string offset`);
  const end = table.indexOf(0, offset);
  if (end < 0) fail(`${label} has an unterminated string`);
  return table.toString("utf8", offset, end);
}

function parseElf(data) {
  if (data.length < 52 || !data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))) fail("input is not an ELF file");
  if (data[4] !== 1 || data[5] !== 1 || data[6] !== 1) fail("expected a 32-bit little-endian ELF object");
  if (data.readUInt16LE(16) !== 1 || data.readUInt16LE(18) !== 40) fail("expected a relocatable ARM ELF object");
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  let shnum = data.readUInt16LE(48);
  let shstrndx = data.readUInt16LE(50);
  if (shentsize < 40 || shoff === 0) fail("ELF section table is missing or malformed");
  checkedRange(shoff, shentsize, data.length, "section header zero");
  if (shnum === 0) shnum = data.readUInt32LE(shoff + 20);
  if (shstrndx === 0xffff) shstrndx = data.readUInt32LE(shoff + 24);
  if (shnum < 1 || shnum > MAX_SECTIONS) fail(`ELF section count must be between 1 and ${MAX_SECTIONS}`);
  checkedRange(shoff, shentsize * shnum, data.length, "section header table");
  if (shstrndx >= shnum) fail("invalid section-name string-table index");

  const sections = [];
  let execSize = 0;
  for (let index = 0; index < shnum; index++) {
    const at = shoff + index * shentsize;
    const section = {
      index,
      nameOffset: data.readUInt32LE(at),
      type: data.readUInt32LE(at + 4),
      flags: data.readUInt32LE(at + 8),
      addr: data.readUInt32LE(at + 12),
      offset: data.readUInt32LE(at + 16),
      size: data.readUInt32LE(at + 20),
      link: data.readUInt32LE(at + 24),
      info: data.readUInt32LE(at + 28),
      align: data.readUInt32LE(at + 32),
      entsize: data.readUInt32LE(at + 36),
    };
    if (section.type !== 8) checkedRange(section.offset, section.size, data.length, `section ${index}`);
    if ((section.flags & 4) !== 0) {
      execSize += section.size;
      if (execSize > MAX_EXEC_SIZE) fail("executable section data exceeds the 16 MiB limit");
    }
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail("section-name table is not a string table");
  const names = data.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(names, section.nameOffset, `section ${section.index}`);
  return sections;
}

function validateConfig() {
  if (config.schemaVersion !== 1 || config.source !== "src/main/arm_runtime_helpers_94.S" || config.mode !== "arm" ||
      config.totalBodySize !== 108 || config.totalAdjacentSize !== 0 || !Array.isArray(config.functions) ||
      config.functions.length !== 9 || !Array.isArray(config.pcRelativeDataAccesses) ||
      config.pcRelativeDataAccesses.length !== 0 ||
      config.sourceSha256 !== CONTRACT.sourceSha256 ||
      config.instructionScheduleSha256 !== CONTRACT.instructionScheduleSha256 ||
      config.branchScheduleSha256 !== CONTRACT.branchScheduleSha256 ||
      config.returnScheduleSha256 !== CONTRACT.returnScheduleSha256 ||
      JSON.stringify(config.functions.map(({ name }) => name)) !== JSON.stringify(CONTRACT.names) ||
      config.functions.reduce((sum, fn) => sum + fn.size, 0) !== config.totalBodySize ||
      Object.keys(config.symbolicIdentities ?? {}).length !== 0 ||
      Object.keys(config.symbolicSlots ?? {}).length !== 0) {
    fail("configuration shape or fixed totals mismatch");
  }
  const names = new Set();
  for (const fn of config.functions) {
    if (!/^func_[0-9A-F]{8}$/.test(fn.name) || names.has(fn.name) || fn.size !== 12 ||
        !Array.isArray(fn.calls) || fn.calls.length !== 0 ||
        !Array.isArray(fn.adjacentWords) || fn.adjacentWords.length !== 0) {
      fail(`invalid function contract: ${fn.name || "<unnamed>"}`);
    }
    names.add(fn.name);
  }
  const identity = config.identityClasses?.call_free_runtime_helpers_94;
  if (!identity || JSON.stringify(identity.members) !== JSON.stringify(CONTRACT.names) ||
      JSON.stringify(identity.parameters) !== JSON.stringify([
        "controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule",
      ])) {
    fail("identity-class contract mismatch");
  }
  validateCollisionExclusions(names);
}

function validateCollisionExclusions(selectedNames) {
  const configDirectory = join(root, "config");
  const selectedIntervals = config.functions.map((fn) => ({
    name: fn.name,
    start: Number.parseInt(fn.name.slice(5), 16),
    end: Number.parseInt(fn.name.slice(5), 16) + fn.size,
  }));
  for (const file of readdirSync(configDirectory).sort()) {
    if (!file.endsWith(".json") || file === "arm-runtime-helpers-94.json") continue;
    const document = JSON.parse(boundedFile(join(configDirectory, file), `configuration ${file}`));
    const objects = [];
    const visit = (value) => {
      if (typeof value === "string") {
        if (selectedNames.has(value)) fail(`configured-name collision for ${value} in ${file}`);
        return;
      }
      if (!value || typeof value !== "object") return;
      if (!Array.isArray(value)) objects.push(value);
      for (const child of Object.values(value)) visit(child);
    };
    visit(document);
    for (const fn of objects) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(fn.name ?? "");
      if (!match || !Number.isSafeInteger(fn.size) || fn.size < 0) continue;
      const start = Number.parseInt(match[1], 16);
      const adjacentSize = Array.isArray(fn.adjacentWords) ? fn.adjacentWords.length * 4 : 0;
      const end = start + fn.size + adjacentSize;
      for (const selected of selectedIntervals) {
        if (start < selected.end && selected.start < end) {
          fail(`configured interval ${fn.name} in ${file} overlaps ${selected.name}`);
        }
      }
    }
  }
}

function validateSections(sections) {
  const byName = new Map();
  for (const section of sections) {
    if (!byName.has(section.name)) byName.set(section.name, []);
    byName.get(section.name).push(section);
  }
  const owned = new Map();
  for (const [name, fn] of expected) {
    const sectionName = `.text.${name}`;
    const matches = byName.get(sectionName) || [];
    if (matches.length !== 1) fail(`expected exactly one ${sectionName} section`);
    const section = matches[0];
    if (section.type !== 1 || section.flags !== 6 || section.align !== 4 || section.size !== fn.size) {
      fail(`${sectionName} must be an AX PROGBITS section of size ${fn.size} aligned to 4`);
    }
    owned.set(section.index, { name, section });
  }
  return owned;
}

function validateSymbols(data, sections, owned) {
  const found = new Map();
  const ownedNamed = new Map([...owned.keys()].map((index) => [index, []]));
  let symbolCount = 0;
  for (const symtab of sections.filter((section) => section.type === 2 || section.type === 11)) {
    if (symtab.entsize < 16 || symtab.size % symtab.entsize !== 0 || symtab.link >= sections.length) fail("malformed ELF symbol table");
    const strtab = sections[symtab.link];
    if (strtab.type !== 3) fail("symbol table does not reference a string table");
    const strings = data.subarray(strtab.offset, strtab.offset + strtab.size);
    const count = symtab.size / symtab.entsize;
    symbolCount += count;
    if (symbolCount > MAX_SYMBOLS) fail(`ELF symbol count exceeds ${MAX_SYMBOLS}`);
    for (let index = 0; index < count; index++) {
      const at = symtab.offset + index * symtab.entsize;
      const name = cString(strings, data.readUInt32LE(at), `symbol ${index}`);
      const value = data.readUInt32LE(at + 4);
      const size = data.readUInt32LE(at + 8);
      const info = data[at + 12];
      const other = data[at + 13];
      const shndx = data.readUInt16LE(at + 14);
      const owner = owned.get(shndx);
      if (owner && name) ownedNamed.get(shndx).push({ name, value, size, info, other });
      if (expected.has(name)) {
        if (found.has(name)) fail(`duplicate symbol ${name}`);
        found.set(name, { value, size, info, other, shndx });
      }
      if (owner && (info & 0x0f) === 2 && name !== owner.name) fail(`unexpected function symbol ${name || "<anonymous>"} in ${owner.section.name}`);
      if (owner && name && name !== owner.name) {
        const armMappingSymbol = (info >> 4) === 0 && (info & 0x0f) === 0 && /^\$(?:a|d|t)(?:\.\d+)?$/.test(name);
        if (!armMappingSymbol) fail(`unexpected named symbol ${name} in ${owner.section.name}`);
      }
    }
  }
  for (const [name, fn] of expected) {
    const symbol = found.get(name);
    if (!symbol) fail(`missing symbol ${name}`);
    const owner = owned.get(symbol.shndx);
    if (!owner || owner.name !== name || symbol.value !== owner.section.addr || symbol.size !== fn.size || symbol.info !== 0x12 || symbol.other !== 0) {
      fail(`${name} must be a default-visible global function exactly spanning its owned section`);
    }
    const named = ownedNamed.get(symbol.shndx);
    const mappings = named.filter(({ name: symbolName }) => symbolName === "$a");
    const extras = named.filter(({ name: symbolName }) => symbolName !== name && symbolName !== "$a");
    if (mappings.length !== 1 || mappings[0].value !== owner.section.addr || mappings[0].size !== 0 ||
        mappings[0].info !== 0 || mappings[0].other !== 0 || extras.length !== 0) {
      fail(`${name} must have exactly one ARM mapping symbol and no other named section symbols`);
    }
  }
}

function validateRelocations(sections, owned) {
  let relocationCount = 0;
  for (const section of sections) {
    if (section.type !== 4 && section.type !== 9) continue;
    const minimumEntrySize = section.type === 4 ? 12 : 8;
    if (section.info >= sections.length || section.link >= sections.length ||
        ![2, 11].includes(sections[section.link].type) || section.entsize < minimumEntrySize ||
        section.size % section.entsize !== 0) {
      fail(`relocation section ${section.name} is malformed or has an invalid link or target`);
    }
    relocationCount += section.size / section.entsize;
    if (relocationCount > MAX_RELOCATIONS) fail(`ELF relocation count exceeds ${MAX_RELOCATIONS}`);
    if (section.size !== 0 && owned.has(section.info)) {
      fail(`relocations are not permitted (target ${owned.get(section.info).section.name})`);
    }
  }
}

function normalizeOperands(text) {
  return text.replace(/\s*(?:@|;)\s.*$/, "").trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ");
}

function disassembleSection(objectPath, name, section) {
  const output = runFirst(commandCandidates("objdump"), ["-d", "-j", section.name, objectPath], `disassembly of ${section.name}`, 2 * 1024 * 1024);
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = /^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{2}\s+){3}[0-9a-fA-F]{2}\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*)$/.exec(line)
      || /^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*)$/.exec(line);
    if (!match) continue;
    const address = Number.parseInt(match[1], 16);
    if (address < section.addr || address >= section.addr + section.size) continue;
    instructions.push({ offset: address - section.addr, mnemonic: match[2].toLowerCase(), operands: normalizeOperands(match[3]) });
  }
  if (instructions.length !== section.size / 4) fail(`${section.name} did not disassemble to exactly ${section.size / 4} ARM instructions`);
  for (let index = 0; index < instructions.length; index++) {
    if (instructions[index].offset !== index * 4) fail(`${section.name} has a non-contiguous instruction schedule`);
  }
  return instructions.map((insn) => ({ ...insn, name }));
}

function canonicalInstruction(insn) {
  return `${insn.name}:${insn.offset.toString(16)}:${insn.mnemonic}:${insn.operands}`;
}

function validateSchedules(objectPath, owned) {
  const instructions = [];
  for (const name of expected.keys()) {
    const entry = [...owned.values()].find((item) => item.name === name);
    instructions.push(...disassembleSection(objectPath, name, entry.section));
  }
  if (instructions.length !== config.totalBodySize / 4) fail("instruction count does not match the configured body size");
  if (instructions.length !== EXPECTED_INSTRUCTIONS) fail(`instruction total mismatch: ${instructions.length}`);
  const instructionSchedule = instructions.map(canonicalInstruction).join("\n");
  if (sha256(instructionSchedule) !== config.instructionScheduleSha256) fail("instruction schedule SHA-256 mismatch");

  const returns = instructions.filter((insn) => insn.mnemonic === "bx" && insn.operands.toLowerCase() === "lr");
  if (returns.length !== EXPECTED_RETURNS) fail(`return total mismatch: ${returns.length}`);
  const returnSchedule = returns.map(canonicalInstruction).join("\n");
  if (sha256(returnSchedule) !== config.returnScheduleSha256) fail("return-transfer schedule SHA-256 mismatch");

  const branchMnemonic = /^(?:b|bl|blx)(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
  const branches = instructions.filter((insn) => branchMnemonic.test(insn.mnemonic) && !(insn.mnemonic === "bx" && insn.operands.toLowerCase() === "lr"));
  const calls = instructions.filter((insn) => /^(?:bl|blx)(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(insn.mnemonic));
  if (calls.length !== 0) fail(`call total mismatch: ${calls.length}`);
  const memoryOperations = instructions.filter((insn) => /^(?:ldr|str|ldm|stm|vldr|vstr|vldm|vstm)/.test(insn.mnemonic));
  if (memoryOperations.length !== EXPECTED_MEMORY_OPERATIONS) fail(`memory-operation total mismatch: ${memoryOperations.length}`);
  const forbiddenTransfers = instructions.filter((insn) =>
    (insn.mnemonic === "bx" && insn.operands.toLowerCase() !== "lr") ||
    (insn.mnemonic !== "bx" && /\bpc\b/i.test(insn.operands)));
  if (forbiddenTransfers.length !== 0) fail("indirect transfer or PC-relative access is forbidden");
  const branchSchedule = branches.map(canonicalInstruction).join("\n");
  if (sha256(branchSchedule) !== config.branchScheduleSha256) fail("direct-branch schedule SHA-256 mismatch");
}

function validateObject(path, standalone = false) {
  const data = boundedFile(path, "object");
  const sections = parseElf(data);
  const owned = validateSections(sections);
  validateSymbols(data, sections, owned);
  validateRelocations(sections, owned);
  validateSchedules(path, owned);
  if (standalone) {
    const foreignExecutable = sections.filter((section) =>
      (section.flags & 4) !== 0 && section.size !== 0 && !owned.has(section.index));
    if (foreignExecutable.length !== 0) fail("standalone object has foreign executable data");
    const relocations = sections.filter((section) =>
      (section.type === 4 || section.type === 9) && section.size !== 0);
    if (relocations.length !== 0) fail("standalone object has relocations");
  }
}

function expectValidationFailure(path, label) {
  try {
    validateObject(path);
  } catch {
    return;
  }
  fail(`${label} was accepted unexpectedly`);
}

function runSelfTest(probePath, directory) {
  const foreignSource = join(directory, "foreign.S");
  const foreignObject = join(directory, "foreign.o");
  const compositeObject = join(directory, "composite.o");
  const foreignSections = [".syntax unified", ".arm"];
  for (let index = 0; index < 12000; index++) {
    foreignSections.push(`.section .text.runtime94_foreign_${index},\"ax\",%progbits`, ".byte 0");
  }
  writeFileSync(foreignSource, `${foreignSections.join("\n")}\n`);
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", foreignObject, foreignSource], "12k-section fixture assembly");
  runFirst(commandCandidates("ld"), ["-r", "-o", compositeObject, probePath, foreignObject], "12k-section composite link");
  validateObject(compositeObject);
  const compositeSections = parseElf(boundedFile(compositeObject, "12k-section composite"));
  const unrelatedSections = compositeSections.filter((section) => section.name.startsWith(".text.runtime94_foreign_")).length;
  if (unrelatedSections < 12000) fail(`12k-section composite retained only ${unrelatedSections} unrelated sections`);

  const scheduleHostile = Buffer.from(boundedFile(probePath, "probe object"));
  const ownedSection = parseElf(scheduleHostile).find((section) => section.name === `.text.${config.functions[0].name}`);
  if (!ownedSection) fail("self-test could not locate its first owned section");
  scheduleHostile[ownedSection.offset] ^= 1;
  const scheduleHostilePath = join(directory, "hostile-schedule.o");
  writeFileSync(scheduleHostilePath, scheduleHostile);
  expectValidationFailure(scheduleHostilePath, "hostile instruction schedule");

  const modeHostile = Buffer.from(boundedFile(probePath, "probe object"));
  const armMappingName = modeHostile.indexOf(Buffer.from([0x24, 0x61, 0x00]));
  if (armMappingName < 0) fail("self-test could not locate the ARM mapping-symbol name");
  modeHostile[armMappingName + 1] = 0x74;
  const modeHostilePath = join(directory, "hostile-mode.o");
  writeFileSync(modeHostilePath, modeHostile);
  expectValidationFailure(modeHostilePath, "hostile mapping mode");

  const relocationSource = join(directory, "hostile-relocation.S");
  const relocationFragment = join(directory, "hostile-relocation-fragment.o");
  const relocationHostile = join(directory, "hostile-relocation.o");
  writeFileSync(relocationSource, [
    ".syntax unified",
    ".arm",
    `.section .text.${config.functions[0].name},\"ax\",%progbits`,
    `.reloc 0, R_ARM_ABS32, runtime94_hostile_external`,
    "",
  ].join("\n"));
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", relocationFragment, relocationSource], "hostile relocation assembly");
  runFirst(commandCandidates("ld"), ["-r", "-o", relocationHostile, probePath, relocationFragment], "hostile relocation link");
  expectValidationFailure(relocationHostile, "hostile owned relocation");

  const duplicateHostile = Buffer.from(boundedFile(probePath, "probe object"));
  const duplicateSections = parseElf(duplicateHostile);
  const firstOwned = duplicateSections.find((section) => section.name === `.text.${config.functions[0].name}`);
  const secondOwned = duplicateSections.find((section) => section.name === `.text.${config.functions[1].name}`);
  if (!firstOwned || !secondOwned) fail("self-test could not locate duplicate-section fixture inputs");
  const sectionTableOffset = duplicateHostile.readUInt32LE(32);
  const sectionEntrySize = duplicateHostile.readUInt16LE(46);
  duplicateHostile.writeUInt32LE(firstOwned.nameOffset, sectionTableOffset + secondOwned.index * sectionEntrySize);
  const duplicateHostilePath = join(directory, "hostile-duplicate.o");
  writeFileSync(duplicateHostilePath, duplicateHostile);
  expectValidationFailure(duplicateHostilePath, "hostile duplicate owned section");

  const truncated = boundedFile(probePath, "probe object").subarray(0, boundedFile(probePath, "probe object").length - 1);
  const truncatedPath = join(directory, "hostile-truncated.o");
  writeFileSync(truncatedPath, truncated);
  expectValidationFailure(truncatedPath, "hostile truncated object");

  const foreignSymbolSource = join(directory, "hostile-foreign-symbol.S");
  const foreignSymbolFragment = join(directory, "hostile-foreign-symbol-fragment.o");
  const foreignSymbolHostile = join(directory, "hostile-foreign-symbol.o");
  writeFileSync(foreignSymbolSource, [
    ".syntax unified",
    ".arm",
    `.section .text.${config.functions[0].name},\"ax\",%progbits`,
    ".global runtime94_foreign_symbol",
    "runtime94_foreign_symbol:",
    "",
  ].join("\n"));
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", foreignSymbolFragment, foreignSymbolSource], "hostile foreign-symbol assembly");
  runFirst(commandCandidates("ld"), ["-r", "-o", foreignSymbolHostile, probePath, foreignSymbolFragment], "hostile foreign-symbol link");
  expectValidationFailure(foreignSymbolHostile, "hostile foreign symbol in owned section");
}

let temporaryDirectory;
try {
  validateConfig();
  const input = parseArguments(process.argv.slice(2));
  if (!existsSync(input.path)) fail(`input does not exist: ${input.path}`);
  let objectPath = input.path;
  if (input.kind === "source") {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-94-"));
    objectPath = join(temporaryDirectory, "probe.o");
    assemble(input.path, objectPath);
  }
  validateObject(objectPath, input.kind === "source");
  if (input.selfTest) runSelfTest(objectPath, temporaryDirectory);
  console.log(`validated arm runtime helpers 94: ${config.functions.length} functions, ${config.totalBodySize} bytes, ${EXPECTED_INSTRUCTIONS} instructions, ${EXPECTED_MEMORY_OPERATIONS} memory operations, ${EXPECTED_RETURNS} returns${input.selfTest ? "; 12k-section composite and hostile checks passed" : ""}`);
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
}
