#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_FILE_SIZE = 64 * 1024 * 1024;
const MAX_EXEC_SIZE = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const KNOWN_TOOL_PREFIX = "/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-runtime-helpers-91.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expected = new Map(config.functions.map((fn) => [fn.name, fn]));

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function usage() {
  return "usage: validate-arm-runtime-helpers-91.mjs [source|SOURCE|OBJECT|--source [SOURCE]|--object OBJECT|--self-test]";
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
  for (const symtab of sections.filter((section) => section.type === 2)) {
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
  for (const section of sections) {
    if (section.type !== 4 && section.type !== 9) continue;
    const minimumEntrySize = section.type === 4 ? 12 : 8;
    if (section.info >= sections.length || section.link >= sections.length ||
        ![2, 11].includes(sections[section.link].type) || section.entsize < minimumEntrySize ||
        section.size % section.entsize !== 0) {
      fail(`relocation section ${section.name} is malformed or has an invalid link or target`);
    }
    if (owned.has(section.info)) fail(`relocation sections are not permitted for ${owned.get(section.info).section.name}`);
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
  const instructionSchedule = instructions.map(canonicalInstruction).join("\n");
  if (sha256(instructionSchedule) !== config.instructionScheduleSha256) fail("instruction schedule SHA-256 mismatch");

  const returns = instructions.filter((insn) => insn.mnemonic === "bx" && insn.operands.toLowerCase() === "lr");
  const returnSchedule = returns.map(canonicalInstruction).join("\n");
  if (sha256(returnSchedule) !== config.returnScheduleSha256) fail("return-transfer schedule SHA-256 mismatch");

  const branchMnemonic = /^(?:b|bl|blx)(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
  const branches = instructions.filter((insn) => branchMnemonic.test(insn.mnemonic) && !(insn.mnemonic === "bx" && insn.operands.toLowerCase() === "lr"));
  const branchSchedule = branches.map(canonicalInstruction).join("\n");
  if (sha256(branchSchedule) !== config.branchScheduleSha256) fail("direct-branch schedule SHA-256 mismatch");
}

function validateObject(path) {
  const data = boundedFile(path, "object");
  const sections = parseElf(data);
  const owned = validateSections(sections);
  validateSymbols(data, sections, owned);
  validateRelocations(sections, owned);
  validateSchedules(path, owned);
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
    foreignSections.push(`.section .text.runtime91_foreign_${index},\"ax\",%progbits`, ".byte 0");
  }
  writeFileSync(foreignSource, `${foreignSections.join("\n")}\n`);
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", foreignObject, foreignSource], "12k-section fixture assembly");
  runFirst(commandCandidates("ld"), ["-r", "-o", compositeObject, probePath, foreignObject], "12k-section composite link");
  validateObject(compositeObject);

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
    `.reloc 0, R_ARM_ABS32, runtime91_hostile_external`,
    "",
  ].join("\n"));
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", relocationFragment, relocationSource], "hostile relocation assembly");
  runFirst(commandCandidates("ld"), ["-r", "-o", relocationHostile, probePath, relocationFragment], "hostile relocation link");
  expectValidationFailure(relocationHostile, "hostile owned relocation");
}

let temporaryDirectory;
try {
  const input = parseArguments(process.argv.slice(2));
  if (!existsSync(input.path)) fail(`input does not exist: ${input.path}`);
  let objectPath = input.path;
  if (input.kind === "source") {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-91-"));
    objectPath = join(temporaryDirectory, "probe.o");
    assemble(input.path, objectPath);
  }
  validateObject(objectPath);
  if (input.selfTest) runSelfTest(objectPath, temporaryDirectory);
  console.log(`validated arm runtime helpers 91: ${config.functions.length} functions, ${config.totalBodySize} bytes${input.selfTest ? "; 12k-section composite and hostile checks passed" : ""}`);
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
}
