#!/usr/bin/env node

import { createHash } from "node:crypto";
import { accessSync, constants, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { delimiter, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config", "arm-duplicate-templates-83.json");
const OPEN = "func_00168EC0";
const CLOSE = "func_00168E50";
const ACCESSOR = "func_0016BC84";
const setRows = [
  ["func_0014F25C", 1, "func_0016BC84", 12], ["func_0014F288", 1, "func_0016BD80", 48],
  ["func_0014F2B4", 0, "func_0016BD80", 50], ["func_0014F3F8", 0, "func_0016BD80", 49],
  ["func_0014FAF8", 0, "func_0016BD80", 51], ["func_003B2930", 1, "func_0016BC84", 22],
  ["func_003B2A44", 1, "func_0016BC84", 25], ["func_003B2A70", 1, "func_0016BC84", 23],
  ["func_003B2A9C", 1, "func_0016BC84", 24], ["func_003B3430", 1, "func_00176EFC", 43],
  ["func_003B3564", 1, "func_00176EFC", 42], ["func_003B3590", 1, "func_00176EFC", 45],
  ["func_003B35E8", 1, "func_00176EFC", 46], ["func_003B3684", 1, "func_00176EFC", 44],
];
const getRows = [
  ["func_00152F08", 20], ["func_00152F34", 25], ["func_00152F60", 23], ["func_00152F8C", 24],
  ["func_004D1248", 34], ["func_004D1330", 35], ["func_004D1730", 12],
];
const nestedRows = [
  ["func_004D1274", "func_0016BD80", 44], ["func_004D1C18", "func_0016BC84", 15],
  ["func_004D1C4C", "func_0016BC84", 14], ["func_004D1CDC", "func_00176EFC", 26],
  ["func_004D1DA4", "func_0016BD80", 47], ["func_004D1F90", "func_00176EFC", 42],
  ["func_004D2478", "func_0016BD80", 51],
];
const expectedRows = [
  ...setRows.map(([name, mode, accessor, field]) => ({ name, template: "set_byte_field", mode, accessor, field })),
  ...getRows.map(([name, field]) => ({ name, template: "get_byte_field", accessor: ACCESSOR, field })),
  ...nestedRows.map(([name, accessor, field]) => ({ name, template: "nested_get_byte_field", accessor, field })),
];
const R_ARM_CALL = 28;
const R_ARM_JUMP24 = 29;

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function exactKeys(value, expected, where) {
  check(value && typeof value === "object" && !Array.isArray(value), `${where} must be an object`);
  check(JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort()), `${where} keys differ`);
}
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }

function validateConfig(config) {
  exactKeys(config, ["version", "source", "sourceSha256", "mode", "expectedBodyBytes", "expectedInstructionCount", "expectedRelocations", "templates", "functions"], "config");
  check(config.version === 1 && config.source === "src/main/arm_duplicate_templates_83.S" && config.mode === "arm", "wrong config identity");
  check(config.sourceSha256 === "9175edf53fe7fb84bf6d80e78f2e96ab7e09666571a8835174d8b6b567d885ca", "wrong pinned source hash");
  check(config.expectedBodyBytes === 1288 && config.expectedInstructionCount === 322, "wrong aggregate size");
  check(JSON.stringify(config.expectedRelocations) === JSON.stringify({ R_ARM_CALL: 70, R_ARM_JUMP24: 14 }), "wrong relocation aggregate");
  check(JSON.stringify(config.templates) === JSON.stringify({
    set_byte_field: { bodySize: 44, instructionCount: 11, count: 14 },
    get_byte_field: { bodySize: 44, instructionCount: 11, count: 7 },
    nested_get_byte_field: { bodySize: 52, instructionCount: 13, count: 7 },
  }), "wrong template contract");
  check(JSON.stringify(config.functions) === JSON.stringify(expectedRows), "wrong function schedule");
  const names = new Set(config.functions.map(({ name }) => name));
  check(names.size === 28 && [...names].every(name => /^func_[0-9A-F]{8}$/.test(name)), "invalid or duplicate function name");
  check(config.functions.reduce((n, row) => n + config.templates[row.template].bodySize, 0) === 1288, "body total mismatch");
  check(config.functions.reduce((n, row) => n + config.templates[row.template].instructionCount, 0) === 322, "instruction total mismatch");
}

function executable(name) {
  if (!name || /[\0\r\n]/.test(name)) return null;
  const candidates = isAbsolute(name) || name.includes("/") ? [name] : (process.env.PATH || "").split(delimiter).map(path => join(path, name));
  for (const candidate of candidates) {
    try { accessSync(candidate, constants.X_OK); return candidate; } catch { /* continue */ }
  }
  return null;
}

function assembler() {
  const candidates = [];
  if (process.env.ARM_DUPLICATE_TEMPLATES_83_AS) candidates.push(process.env.ARM_DUPLICATE_TEMPLATES_83_AS);
  if (process.env.AS) candidates.push(process.env.AS);
  if (process.env.CROSS_COMPILE) candidates.push(`${process.env.CROSS_COMPILE}as`);
  candidates.push("arm-none-eabi-as", "arm-linux-gnueabihf-as", "arm-linux-gnueabi-as");
  for (const candidate of candidates) {
    const resolved = executable(candidate);
    if (resolved && spawnSync(resolved, ["--version"], { encoding: "utf8" }).status === 0) return resolved;
  }
  fail("no usable ARM GNU assembler (set ARM_DUPLICATE_TEMPLATES_83_AS or CROSS_COMPILE)");
}

function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, { encoding: "utf8", ...options });
  check(!result.error, `could not run ${tool}: ${result.error?.message}`);
  check(result.status === 0, `${tool} failed (${result.status}): ${(result.stderr || result.stdout || "").trim()}`);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  const need = (offset, size, what) => check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset + size <= bytes.length, `${what} outside ELF`);
  need(0, 52, "header");
  check(bytes.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) && bytes[4] === 1 && bytes[5] === 1 && bytes[6] === 1, "not ELF32 little-endian");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "not a relocatable ARM ELF");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46), shnum = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shentsize === 40 && shnum > 0 && shnum <= 512 && shstrndx > 0 && shstrndx < shnum, "invalid section table");
  need(shoff, shentsize * shnum, "section table");
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const offset = shoff + index * 40;
    const section = { index, nameOffset: bytes.readUInt32LE(offset), type: bytes.readUInt32LE(offset + 4), flags: bytes.readUInt32LE(offset + 8), offset: bytes.readUInt32LE(offset + 16), size: bytes.readUInt32LE(offset + 20), link: bytes.readUInt32LE(offset + 24), info: bytes.readUInt32LE(offset + 28), align: bytes.readUInt32LE(offset + 32), entsize: bytes.readUInt32LE(offset + 36) };
    if (section.type !== 8) need(section.offset, section.size, `section ${index}`);
    sections.push(section);
  }
  const string = (table, offset, what) => {
    check(offset < table.length, `${what} string offset outside table`);
    const end = table.indexOf(0, offset); check(end >= 0, `${what} string unterminated`);
    return table.toString("utf8", offset, end);
  };
  const sectionNames = sections[shstrndx];
  check(sectionNames.type === 3, "section names are not STRTAB");
  const sectionNameBytes = bytes.subarray(sectionNames.offset, sectionNames.offset + sectionNames.size);
  for (const section of sections) section.name = string(sectionNameBytes, section.nameOffset, "section");
  const symbolTables = sections.filter(section => section.type === 2);
  check(symbolTables.length === 1, "exactly one symbol table required");
  const symbolTable = symbolTables[0];
  check(symbolTable.entsize === 16 && symbolTable.size % 16 === 0 && symbolTable.size / 16 <= 4096, "invalid symbol table");
  check(symbolTable.link < sections.length && sections[symbolTable.link].type === 3, "invalid symbol strings");
  const strings = bytes.subarray(sections[symbolTable.link].offset, sections[symbolTable.link].offset + sections[symbolTable.link].size);
  const symbols = [];
  for (let index = 0; index < symbolTable.size / 16; index++) {
    const offset = symbolTable.offset + index * 16;
    symbols.push({ index, name: string(strings, bytes.readUInt32LE(offset), "symbol"), value: bytes.readUInt32LE(offset + 4), size: bytes.readUInt32LE(offset + 8), bind: bytes[offset + 12] >>> 4, type: bytes[offset + 12] & 15, other: bytes[offset + 13], shndx: bytes.readUInt16LE(offset + 14) });
  }
  const relocations = [];
  for (const section of sections.filter(candidate => candidate.type === 9 || candidate.type === 4)) {
    check(section.type === 9 && section.entsize === 8 && section.size % 8 === 0 && section.link === symbolTable.index && section.info < sections.length, "invalid relocation section");
    for (let index = 0; index < section.size / 8; index++) {
      const offset = section.offset + index * 8, info = bytes.readUInt32LE(offset + 4), symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length, "relocation symbol outside table");
      relocations.push({ section: sections[section.info], offset: bytes.readUInt32LE(offset), type: info & 0xff, symbol: symbols[symbolIndex], infoOffset: offset + 4 });
    }
  }
  return { bytes, sections, symbols, relocations };
}

function expectedWords(row) {
  const branch = 0xebfffffe;
  const common = [0xe92d4070, 0xe1a05000, branch, 0xe3a01000, 0xe1a00005, branch, 0xe5d04000 | row.field, 0xe1a00005, branch, 0xe1a00004, 0xe8bd8070];
  const words = row.template === "get_byte_field" ? common :
    row.template === "nested_get_byte_field" ? [0xe590000c, 0xe1a00000, ...common] :
      [0xe92d4070, 0xe1a04001, 0xe1a05000, branch, 0xe3a01000 | row.mode, 0xe1a00005, branch, 0xe5c04000 | row.field, 0xe1a00005, 0xe8bd4070, 0xeafffffe];
  return words.map(word => word >>> 0);
}

function expectedRelocations(row) {
  if (row.template === "set_byte_field") return [[12, R_ARM_CALL, OPEN], [24, R_ARM_CALL, row.accessor], [40, R_ARM_JUMP24, CLOSE]];
  const shift = row.template === "nested_get_byte_field" ? 8 : 0;
  return [[8 + shift, R_ARM_CALL, OPEN], [20 + shift, R_ARM_CALL, row.accessor], [32 + shift, R_ARM_CALL, CLOSE]];
}

function validateObject(input) {
  const elf = parseElf(input);
  const executableSections = elf.sections.filter(section => (section.flags & 4) !== 0 && section.size !== 0);
  check(executableSections.length === 28, "exactly 28 nonempty executable sections required");
  check(elf.sections.filter(section => (section.flags & 2) !== 0 && (section.flags & 4) === 0 && section.size !== 0).length === 0, "allocated data/literal section forbidden");
  let bodyBytes = 0, instructions = 0, calls = 0, jumps = 0;
  const destinationCounts = new Map();
  for (const row of expectedRows) {
    const definition = { set_byte_field: [44, 11], get_byte_field: [44, 11], nested_get_byte_field: [52, 13] }[row.template];
    const section = executableSections.find(candidate => candidate.name === `.text.${row.name}`);
    check(section && section.type === 1 && section.size === definition[0] && section.align >= 4, `${row.name}: invalid body section`);
    const definitions = elf.symbols.filter(symbol => symbol.shndx === section.index && symbol.name && !symbol.name.startsWith("$"));
    check(definitions.length === 1 && definitions[0].name === row.name && definitions[0].value === 0 && definitions[0].size === definition[0] && definitions[0].bind === 1 && definitions[0].type === 2 && definitions[0].other === 0, `${row.name}: invalid function symbol`);
    const words = expectedWords(row);
    const body = elf.bytes.subarray(section.offset, section.offset + section.size);
    check(words.every((word, index) => body.readUInt32LE(index * 4) === word), `${row.name}: instruction encoding mismatch`);
    const actualRelocations = elf.relocations.filter(relocation => relocation.section.index === section.index).map(relocation => [relocation.offset, relocation.type, relocation.symbol.name]);
    const wantedRelocations = expectedRelocations(row);
    check(JSON.stringify(actualRelocations) === JSON.stringify(wantedRelocations), `${row.name}: relocation schedule mismatch`);
    for (const [, type, symbol] of actualRelocations) {
      if (type === R_ARM_CALL) calls++; else if (type === R_ARM_JUMP24) jumps++; else fail(`${row.name}: forbidden relocation type`);
      destinationCounts.set(symbol, (destinationCounts.get(symbol) || 0) + 1);
    }
    bodyBytes += definition[0]; instructions += definition[1];
  }
  check(elf.relocations.length === 84 && calls === 70 && jumps === 14, "relocation aggregate mismatch");
  check(bodyBytes === 1288 && instructions === 322, "body aggregate mismatch");
  check(JSON.stringify(Object.fromEntries([...destinationCounts].sort())) === JSON.stringify({ func_00168E50: 28, func_00168EC0: 28, func_0016BC84: 14, func_0016BD80: 7, func_00176EFC: 7 }), "destination counts mismatch");
  const defined = elf.symbols.filter(symbol => symbol.bind !== 0 && symbol.type === 2 && symbol.shndx !== 0).map(symbol => symbol.name).sort();
  check(JSON.stringify(defined) === JSON.stringify(expectedRows.map(row => row.name).sort()), "unexpected exported function");
  return elf;
}

function expectRejected(label, callback) { try { callback(); } catch { return; } fail(`hostile self-check accepted: ${label}`); }
function hostileChecks(validElf) {
  expectRejected("truncated ELF", () => parseElf(validElf.subarray(0, 51)));
  const parsed = parseElf(validElf);
  const changedInstruction = Buffer.from(validElf);
  const firstSection = parsed.sections.find(section => section.name === `.text.${expectedRows[0].name}`);
  changedInstruction[firstSection.offset] ^= 1;
  expectRejected("changed instruction", () => validateObject(changedInstruction));
  const changedRelocation = Buffer.from(validElf);
  changedRelocation.writeUInt32LE((changedRelocation.readUInt32LE(parsed.relocations[0].infoOffset) & 0xffffff00) | R_ARM_JUMP24, parsed.relocations[0].infoOffset);
  expectRejected("changed relocation kind", () => validateObject(changedRelocation));
  const changedBounds = Buffer.from(validElf), shoff = changedBounds.readUInt32LE(32);
  changedBounds.writeUInt32LE(0xffffffff, shoff + firstSection.index * 40 + 20);
  expectRejected("out-of-bounds section", () => parseElf(changedBounds));
}

function main() {
  check(process.argv.length === 2, "usage: validate-arm-duplicate-templates-83.mjs");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  validateConfig(config);
  const sourcePath = join(root, config.source), source = readFileSync(sourcePath);
  check(sha256(source) === config.sourceSha256, "sourceSha256 mismatch");
  const as = assembler(), temporary = mkdtempSync(join(tmpdir(), "arm-duplicate-templates-83-"));
  try {
    const objectPath = join(temporary, "arm_duplicate_templates_83.o");
    run(as, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath], { cwd: temporary });
    const object = readFileSync(objectPath);
    validateObject(object);
    hostileChecks(object);
    console.log("arm duplicate templates 83: OK (1,288 bytes, 322 instructions, 70 R_ARM_CALL, 14 R_ARM_JUMP24)");
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}

try { main(); } catch (error) { console.error(`arm duplicate templates 83: FAIL: ${error.message}`); process.exitCode = 1; }
