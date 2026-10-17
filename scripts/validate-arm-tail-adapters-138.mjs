#!/usr/bin/env node

import { createHash } from "node:crypto";
import { accessSync, constants, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { delimiter, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "config/arm-tail-adapters-138.json");
const SOURCE_HASH = "cf7c3b2278e9719cd2a702f23480915c2c9bf378431a7018ac74b59783fcdcd2";
const CONFIG_HASH = "9ce1affa310523a7731c997779af6532b8ad78862c996ad8fad55489f277bc56";
const R_ARM_JUMP24 = 29;
const MAX_FILE = 64 * 1024 * 1024;

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function executable(name) {
  if (!name || /[\0\r\n]/.test(name)) return null;
  const candidates = isAbsolute(name) || name.includes("/") ? [name] :
    (process.env.PATH || "").split(delimiter).map((entry) => join(entry, name));
  for (const candidate of candidates) {
    try { accessSync(candidate, constants.X_OK); return candidate; } catch { /* continue */ }
  }
  return null;
}
function assembler() {
  for (const candidate of [process.env.ARM_TAIL_ADAPTERS_138_AS, process.env.ARM_AS,
    process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : undefined,
    "arm-none-eabi-as", "arm-linux-gnueabihf-as", "arm-linux-gnueabi-as"]) {
    const found = executable(candidate);
    if (found && spawnSync(found, ["--version"], { encoding: "utf8" }).status === 0) return found;
  }
  fail("no usable ARM GNU assembler (set ARM_TAIL_ADAPTERS_138_AS or CROSS_COMPILE)");
}
function run(tool, args) {
  const result = spawnSync(tool, args, { encoding: "utf8" });
  check(!result.error && result.status === 0,
    `${tool} failed: ${(result.error?.message || result.stderr || result.stdout || "unknown error").trim()}`);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  check(bytes.length <= MAX_FILE && bytes.length >= 52, "ELF size is outside the public bound");
  const need = (offset, size, what) => check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) &&
    offset >= 0 && size >= 0 && offset + size <= bytes.length, `${what} is outside ELF`);
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])),
    "input is not ELF32 little-endian version 1");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1,
    "input is not an ARM relocatable ELF");
  check(bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0, "ELF has an entry point or program headers");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46);
  const shnum = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shentsize === 40 && shnum > 0 && shnum <= 4096 && shstrndx > 0 && shstrndx < shnum,
    "invalid section table");
  need(shoff, shentsize * shnum, "section table");
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const headerOffset = shoff + index * 40;
    const section = { index, headerOffset, nameOffset: bytes.readUInt32LE(headerOffset),
      type: bytes.readUInt32LE(headerOffset + 4), flags: bytes.readUInt32LE(headerOffset + 8),
      address: bytes.readUInt32LE(headerOffset + 12), offset: bytes.readUInt32LE(headerOffset + 16),
      size: bytes.readUInt32LE(headerOffset + 20), link: bytes.readUInt32LE(headerOffset + 24),
      info: bytes.readUInt32LE(headerOffset + 28), align: bytes.readUInt32LE(headerOffset + 32),
      entsize: bytes.readUInt32LE(headerOffset + 36) };
    if (section.type !== 8) need(section.offset, section.size, `section ${index}`);
    sections.push(section);
  }
  const stringAt = (table, offset, what) => {
    check(offset >= 0 && offset < table.length, `${what} string is outside table`);
    const end = table.indexOf(0, offset);
    check(end >= 0, `${what} string is unterminated`);
    return table.toString("utf8", offset, end);
  };
  const shstr = sections[shstrndx];
  check(shstr.type === 3, "section-name table is not STRTAB");
  const shstrings = bytes.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = stringAt(shstrings, section.nameOffset, "section");
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section name");
  const symbolTables = sections.filter(({ type }) => type === 2);
  check(symbolTables.length === 1, "exactly one SYMTAB is required");
  const symtab = symbolTables[0];
  check(symtab.entsize === 16 && symtab.size % 16 === 0 && symtab.size / 16 <= 16384 &&
    symtab.link < sections.length && sections[symtab.link].type === 3, "invalid SYMTAB");
  const stringsSection = sections[symtab.link];
  const strings = bytes.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size);
  const symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const offset = symtab.offset + index * 16;
    symbols.push({ index, name: stringAt(strings, bytes.readUInt32LE(offset), "symbol"),
      value: bytes.readUInt32LE(offset + 4), size: bytes.readUInt32LE(offset + 8),
      bind: bytes[offset + 12] >>> 4, type: bytes[offset + 12] & 15, other: bytes[offset + 13],
      shndx: bytes.readUInt16LE(offset + 14) });
  }
  const relocations = [];
  for (const relocationSection of sections.filter(({ type }) => type === 9 || type === 4)) {
    check(relocationSection.type === 9 && relocationSection.entsize === 8 &&
      relocationSection.size % 8 === 0 && relocationSection.link === symtab.index &&
      relocationSection.info > 0 && relocationSection.info < sections.length,
    `invalid relocation section ${relocationSection.name}`);
    const target = sections[relocationSection.info];
    for (let index = 0; index < relocationSection.size / 8; index++) {
      const recordOffset = relocationSection.offset + index * 8;
      const targetOffset = bytes.readUInt32LE(recordOffset);
      const info = bytes.readUInt32LE(recordOffset + 4), symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length && targetOffset + 4 <= target.size,
        `invalid relocation record in ${relocationSection.name}`);
      relocations.push({ relocationSection, target, targetOffset, type: info & 0xff,
        symbol: symbols[symbolIndex], recordOffset, infoOffset: recordOffset + 4 });
    }
  }
  return { bytes, sections, symtab, symbols, relocations };
}

function sourceInstructions(source, name) {
  const lines = source.split(/\r?\n/);
  const begin = lines.findIndex((line) => line.trim() === `${name}:`);
  const end = lines.findIndex((line, index) => index > begin && line.trim() === `.size ${name}, . - ${name}`);
  check(begin >= 0 && end > begin, `${name}: source boundary missing`);
  return lines.slice(begin + 1, end).map((line) => line.replace(/\s*@.*$/, "").trim()).filter(Boolean);
}
function branchAddend(word) {
  let displacement = (word & 0x00ffffff) << 2;
  if ((displacement & 0x02000000) !== 0) displacement -= 0x04000000;
  return displacement + 8;
}
function validateObject(input, goldenInput, config) {
  const elf = parseElf(input), golden = parseElf(goldenInput);
  const expectedSections = config.functions.map(({ name }) => `.text.${name}`);
  const executableSections = elf.sections.filter(({ flags, size }) => (flags & 4) !== 0 && size !== 0);
  check(JSON.stringify(executableSections.map(({ name }) => name)) === JSON.stringify(expectedSections),
    "nonempty executable section inventory differs");
  check(elf.sections.filter(({ flags, size }) => (flags & 2) !== 0 && (flags & 4) === 0 && size !== 0).length === 0,
    "allocated data or literal-pool section is forbidden");
  let bodyBytes = 0, instructionCount = 0, returnCount = 0;
  for (const row of config.functions) {
    const section = elf.sections.find(({ name }) => name === `.text.${row.name}`);
    const goldenSection = golden.sections.find(({ name }) => name === `.text.${row.name}`);
    check(section && goldenSection && section.type === 1 && section.flags === 6 && section.address === 0 &&
      section.align === 4 && section.size === row.size && goldenSection.size === row.size,
    `${row.name}: section boundary or metadata mismatch`);
    const body = elf.bytes.subarray(section.offset, section.offset + section.size);
    const goldenBody = golden.bytes.subarray(goldenSection.offset, goldenSection.offset + goldenSection.size);
    check(body.equals(goldenBody), `${row.name}: exact instruction schedule mismatch`);
    const owners = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name &&
      !symbol.name.startsWith("$"));
    check(owners.length === 1 && owners[0].name === row.name && owners[0].value === 0 &&
      owners[0].size === row.size && owners[0].bind === 1 && owners[0].type === 2 && owners[0].other === 0,
    `${row.name}: invalid function ownership`);
    const mapping = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name === "$a");
    check(mapping.length === 1 && mapping[0].value === 0 && mapping[0].bind === 0,
      `${row.name}: invalid ARM mapping symbol`);
    const relocations = elf.relocations.filter(({ target }) => target.index === section.index);
    if (row.tail) {
      check(relocations.length === 1, `${row.name}: exactly one tail relocation required`);
      const relocation = relocations[0];
      const word = body.readUInt32LE(row.tail.offset);
      check(relocation.targetOffset === row.tail.offset && relocation.type === R_ARM_JUMP24 &&
        relocation.symbol.name === row.tail.symbol && relocation.symbol.shndx === 0 &&
        ((word & 0xff000000) >>> 0) === 0xea000000 && branchAddend(word) === row.tail.addend,
      `${row.name}: tail target class, symbol, addend, or opcode mismatch`);
      check(row.tail.targetClass === (row.tail.addend === 0 ? "primary" : "secondary"),
        `${row.name}: target class does not match addend`);
    } else {
      check(relocations.length === 0 && row.return?.offset === 4 && row.return.kind === "register-return",
        `${row.name}: return-only transfer contract mismatch`);
      returnCount++;
    }
    bodyBytes += row.size;
    instructionCount += row.instructions.length;
  }
  check(bodyBytes === 340 && instructionCount === 85 && returnCount === 1,
    "aggregate body, instruction, or return totals differ");
  check(elf.relocations.length === 18 && elf.relocations.every(({ type }) => type === R_ARM_JUMP24),
    "expected exactly 18 R_ARM_JUMP24 relocations and no others");
  const definitions = elf.symbols.filter(({ bind, type, shndx }) => bind !== 0 && type === 2 && shndx !== 0)
    .map(({ name }) => name).sort();
  check(JSON.stringify(definitions) === JSON.stringify(config.functions.map(({ name }) => name).sort()),
    "defined global function inventory differs");
}

function hasDefinition(text, name) {
  const cleaned = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,|\\b${name}\\s*\\([^;]*\\)\\s*\\{)`).test(cleaned);
}
function validateOwnership(config) {
  for (const entry of readdirSync(join(ROOT, "src"), { recursive: true })) {
    const filename = `src/${entry}`;
    if (filename === config.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue;
    const text = readFileSync(join(ROOT, filename), "utf8");
    for (const row of config.functions) check(!hasDefinition(text, row.name),
      `duplicate source owner for ${row.name} in ${filename}`);
  }
  for (const entry of readdirSync(join(ROOT, "config"), { recursive: true })) {
    const filename = `config/${entry}`;
    if (filename === "config/arm-tail-adapters-138.json" || !filename.endsWith(".json") ||
      filename.startsWith("config/targets/")) continue;
    const other = JSON.parse(readFileSync(join(ROOT, filename), "utf8"));
    for (const candidate of Array.isArray(other.functions) ? other.functions : []) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(candidate.name || "");
      if (!match) continue;
      check(!config.functions.some(({ name }) => name === candidate.name),
        `duplicate config owner for ${candidate.name} in ${filename}`);
      const start = Number.parseInt(match[1], 16), size = candidate.ownedSize ?? candidate.size;
      if (!Number.isSafeInteger(size) || size <= 0) continue;
      for (const row of config.functions) {
        const ownStart = Number(row.address), ownEnd = ownStart + row.size;
        check(start >= ownEnd || start + size <= ownStart,
          `overlapping config owner for ${row.name} in ${filename}`);
      }
    }
  }
}
function validatePinnedInputs() {
  const configBytes = readFileSync(CONFIG_PATH), config = JSON.parse(configBytes);
  check(sha256(configBytes) === CONFIG_HASH, "configuration does not equal validator pin");
  check(config.sourceHash === SOURCE_HASH && sha256(readFileSync(join(ROOT, config.source))) === SOURCE_HASH,
    "source does not equal validator pin");
  check(config.schemaVersion === 1 && config.source === "src/main/arm_tail_adapters_138.S" &&
    config.architecture === "ARMv6K" && config.mode === "arm" && config.minimumAlignment === 4,
  "batch identity differs");
  check(config.totalBodySize === 340 && config.expectedInstructionCount === 85 &&
    JSON.stringify(config.expectedRelocations) === JSON.stringify({ R_ARM_JUMP24: 18 }) &&
    config.expectedCalls === 0 && config.expectedLiteralPools === 0 &&
    config.expectedAdjacentBytes === 0, "aggregate public contract differs");
  check(config.functions.length === 19 && new Set(config.functions.map(({ name }) => name)).size === 19,
    "function inventory must contain 19 unique rows");
  const source = readFileSync(join(ROOT, config.source), "utf8");
  for (const row of config.functions) {
    check(/^func_[0-9A-F]{8}$/.test(row.name) && Number(row.address) === Number.parseInt(row.name.slice(5), 16) &&
      row.size === row.instructions.length * 4, `${row.name}: public address/size boundary differs`);
    check(JSON.stringify(sourceInstructions(source, row.name)) === JSON.stringify(row.instructions),
      `${row.name}: mnemonic/operand schedule differs`);
  }
  check(config.functions.reduce((sum, row) => sum + row.size, 0) === 340 &&
    config.functions.reduce((sum, row) => sum + row.instructions.length, 0) === 85 &&
    config.functions.filter(({ tail }) => tail).length === 18 &&
    config.functions.filter(({ return: returned }) => returned).length === 1,
  "inventory totals differ");
  check(JSON.stringify(config.reusedBranchIdentities) === JSON.stringify([...new Set(config.functions
    .filter(({ tail }) => tail).map(({ tail }) => tail.symbol))].sort()),
  "reused branch-identity registry differs");
  check(JSON.stringify(config.functions.filter(({ tail }) => tail?.targetClass === "secondary")
    .map(({ name, tail }) => [name, tail.symbol, tail.addend])) === JSON.stringify([
      ["func_00177E84", "func_00177E8C", 20], ["func_001F4368", "func_001F46F4", 8],
      ["func_003BB834", "func_00123D60", 12], ["func_004757A0", "func_00471D24", 8],
    ]), "secondary-entry identity/addend inventory differs");
  validateOwnership(config);
  return config;
}
function expectRejected(label, operation) {
  try { operation(); } catch { return; }
  fail(`hostile self-check accepted: ${label}`);
}
function hostileChecks(golden, config) {
  const parsed = parseElf(golden);
  expectRejected("truncated ELF", () => parseElf(golden.subarray(0, 51)));
  for (const row of config.functions) {
    const section = parsed.sections.find(({ name }) => name === `.text.${row.name}`);
    for (let offset = 0; offset < row.size; offset++) {
      const changed = Buffer.from(golden); changed[section.offset + offset] ^= 1;
      expectRejected(`${row.name} changed byte ${offset}`, () => validateObject(changed, golden, config));
    }
  }
  const relocationType = Buffer.from(golden);
  relocationType.writeUInt32LE((relocationType.readUInt32LE(parsed.relocations[0].infoOffset) & 0xffffff00) | 28,
    parsed.relocations[0].infoOffset);
  expectRejected("R_ARM_CALL substitution", () => validateObject(relocationType, golden, config));
  const foreignExecutable = Buffer.from(golden);
  const attributes = parsed.sections.find(({ name }) => name === ".ARM.attributes");
  foreignExecutable.writeUInt32LE(attributes.flags | 4, attributes.headerOffset + 8);
  expectRejected("foreign executable payload", () => validateObject(foreignExecutable, golden, config));
  const sectionSize = Buffer.from(golden);
  const first = parsed.sections.find(({ name }) => name === `.text.${config.functions[0].name}`);
  sectionSize.writeUInt32LE(first.size - 4, first.headerOffset + 20);
  expectRejected("owned boundary shrink", () => validateObject(sectionSize, golden, config));
  const addend = Buffer.from(golden), secondary = config.functions.find(({ tail }) => tail?.addend === 20);
  const secondarySection = parsed.sections.find(({ name }) => name === `.text.${secondary.name}`);
  addend[secondarySection.offset + secondary.tail.offset] ^= 1;
  expectRejected("secondary addend mutation", () => validateObject(addend, golden, config));
}

function main() {
  const config = validatePinnedInputs(), args = process.argv.slice(2);
  check(args.length === 1 && (args[0] === "--assemble" || !args[0].startsWith("-")),
    "usage: validate-arm-tail-adapters-138.mjs --assemble | <object-file>");
  const as = assembler(), temporary = mkdtempSync(join(tmpdir(), "arm-tail-adapters-138-"));
  try {
    const goldenPath = join(temporary, "arm_tail_adapters_138.o");
    run(as, ["-march=armv6k", "-mfpu=vfpv2", "-o", goldenPath, join(ROOT, config.source)]);
    const golden = readFileSync(goldenPath);
    validateObject(args[0] === "--assemble" ? golden : readFileSync(resolve(args[0])), golden, config);
    hostileChecks(golden, config);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
  process.stdout.write("arm-tail-adapters-138 validation: ok (19 ARM functions; 340 bytes; 85 instructions; 18 symbolic tails; 1 return)\n");
}

try { main(); } catch (error) {
  process.stderr.write(`arm-tail-adapters-138 validation failed: ${error.message}\n`);
  process.exitCode = 1;
}
