#!/usr/bin/env node

import { createHash } from "node:crypto";
import { accessSync, constants, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { delimiter, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config", "arm-duplicate-templates-84.json");
const sourceHash = "5a7f62276712d95f1472e87bb9ffa301eb5a52490cc32eecdc88cac042a44884";
const groups = {
  push_call: [
    ["func_0010BD44", "func_00139660"], ["func_00125688", "func_00164060"],
    ["func_0012C7DC", "func_00139660"], ["func_001602A4", "func_00164060"],
    ["func_00173C38", "func_00164060"], ["func_004212F4", "func_00139660"],
    ["func_00421314", "func_00139660"], ["func_0045B758", "func_0014E348"],
    ["func_0045BE20", "func_0014E348"], ["func_0046049C", "func_0014E348"],
  ],
  save_r0_call: [
    ["func_0015208C", "func_0014E348"], ["func_00152140", "func_0014E348"],
    ["func_00164198", "func_00164060"], ["func_0016A3E8", "func_0014E348"],
    ["func_0016A510", "func_0014E348"], ["func_00173C10", "func_00164060"],
    ["func_0043EFAC", "func_0014E348"], ["func_0045BEA4", "func_0014E348"],
  ],
  save_r0_r5_call: [
    ["func_00151F74", "func_0014E348"], ["func_0015204C", "func_0014E348"],
    ["func_001520BC", "func_0014E348"], ["func_00152100", "func_0014E348"],
    ["func_0016A418", "func_0014E348"],
  ],
  save_r1_call: [
    ["func_0041B834", "func_00139660"], ["func_004213CC", "func_00139660"],
    ["func_00421494", "func_00139660"], ["func_00421684", "func_00139660"],
  ],
  save_r0_wide_call: [
    ["func_00151FC0", "func_0014E348"], ["func_0045BC6C", "func_0014E348"],
    ["func_0045BE4C", "func_0014E348"],
  ],
};
const rows = Object.entries(groups).flatMap(([template, entries]) =>
  entries.map(([name, callee]) => ({ name, template, callee })));
const definitions = {
  push_call: { bodySize: 8, instructionCount: 2, count: 10 },
  save_r0_call: { bodySize: 12, instructionCount: 3, count: 8 },
  save_r0_r5_call: { bodySize: 12, instructionCount: 3, count: 5 },
  save_r1_call: { bodySize: 12, instructionCount: 3, count: 4 },
  save_r0_wide_call: { bodySize: 12, instructionCount: 3, count: 3 },
};
const R_ARM_CALL = 28;

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function exactKeys(value, keys, where) {
  check(value && typeof value === "object" && !Array.isArray(value), `${where} must be an object`);
  check(JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()), `${where} keys differ`);
}

function validateConfig(config) {
  exactKeys(config, ["version", "source", "sourceSha256", "mode", "expectedBodyBytes",
    "expectedInstructionCount", "expectedRelocations", "templates", "functions"], "config");
  check(config.version === 1 && config.source === "src/main/arm_duplicate_templates_84.S" &&
    config.sourceSha256 === sourceHash && config.mode === "arm", "wrong config identity");
  check(config.expectedBodyBytes === 320 && config.expectedInstructionCount === 80,
    "wrong aggregate body contract");
  check(JSON.stringify(config.expectedRelocations) === JSON.stringify({ R_ARM_CALL: 30 }),
    "wrong relocation contract");
  check(JSON.stringify(config.templates) === JSON.stringify(definitions), "wrong template contract");
  check(JSON.stringify(config.functions) === JSON.stringify(rows), "wrong function schedule");
  const names = new Set(rows.map(({ name }) => name));
  check(names.size === 30 && [...names].every((name) => /^func_[0-9A-F]{8}$/.test(name)),
    "invalid or duplicate function name");
  check(rows.reduce((sum, row) => sum + definitions[row.template].bodySize, 0) === 320,
    "body total mismatch");
  check(rows.reduce((sum, row) => sum + definitions[row.template].instructionCount, 0) === 80,
    "instruction total mismatch");
}

function executable(name) {
  if (!name || /[\0\r\n]/.test(name)) return null;
  const candidates = isAbsolute(name) || name.includes("/") ? [name] :
    (process.env.PATH || "").split(delimiter).map((path) => join(path, name));
  for (const candidate of candidates) {
    try { accessSync(candidate, constants.X_OK); return candidate; } catch { /* continue */ }
  }
  return null;
}
function assembler() {
  const candidates = [process.env.ARM_DUPLICATE_TEMPLATES_84_AS, process.env.AS,
    process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : undefined,
    "arm-none-eabi-as", "arm-linux-gnueabihf-as", "arm-linux-gnueabi-as"];
  for (const candidate of candidates) {
    const resolved = executable(candidate);
    if (resolved && spawnSync(resolved, ["--version"], { encoding: "utf8" }).status === 0) return resolved;
  }
  fail("no usable ARM GNU assembler (set ARM_DUPLICATE_TEMPLATES_84_AS or CROSS_COMPILE)");
}
function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, { encoding: "utf8", ...options });
  check(!result.error, `could not run ${tool}: ${result.error?.message}`);
  check(result.status === 0, `${tool} failed (${result.status}): ${(result.stderr || result.stdout || "").trim()}`);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  const need = (offset, size, what) => check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) &&
    offset >= 0 && size >= 0 && offset + size <= bytes.length, `${what} outside ELF`);
  need(0, 52, "header");
  check(bytes.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) &&
    bytes[4] === 1 && bytes[5] === 1 && bytes[6] === 1, "not ELF32 little-endian");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1,
    "not a relocatable ARM ELF");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46);
  const shnum = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shentsize === 40 && shnum > 0 && shnum <= 512 && shstrndx > 0 && shstrndx < shnum,
    "invalid section table");
  need(shoff, shentsize * shnum, "section table");
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const offset = shoff + index * 40;
    const section = { index, headerOffset: offset, nameOffset: bytes.readUInt32LE(offset),
      type: bytes.readUInt32LE(offset + 4), flags: bytes.readUInt32LE(offset + 8),
      offset: bytes.readUInt32LE(offset + 16), size: bytes.readUInt32LE(offset + 20),
      link: bytes.readUInt32LE(offset + 24), info: bytes.readUInt32LE(offset + 28),
      align: bytes.readUInt32LE(offset + 32), entsize: bytes.readUInt32LE(offset + 36) };
    if (section.type !== 8) need(section.offset, section.size, `section ${index}`);
    sections.push(section);
  }
  const string = (table, offset, what) => {
    check(offset < table.length, `${what} string outside table`);
    const end = table.indexOf(0, offset); check(end >= 0, `${what} string unterminated`);
    return table.toString("utf8", offset, end);
  };
  const sectionNames = sections[shstrndx];
  check(sectionNames.type === 3, "section names are not STRTAB");
  const sectionNameBytes = bytes.subarray(sectionNames.offset, sectionNames.offset + sectionNames.size);
  for (const section of sections) section.name = string(sectionNameBytes, section.nameOffset, "section");
  const symbolTables = sections.filter((section) => section.type === 2);
  check(symbolTables.length === 1, "exactly one symbol table required");
  const symbolTable = symbolTables[0];
  check(symbolTable.entsize === 16 && symbolTable.size % 16 === 0 && symbolTable.size / 16 <= 4096,
    "invalid symbol table");
  check(symbolTable.link < sections.length && sections[symbolTable.link].type === 3,
    "invalid symbol strings");
  const strings = bytes.subarray(sections[symbolTable.link].offset,
    sections[symbolTable.link].offset + sections[symbolTable.link].size);
  const symbols = [];
  for (let index = 0; index < symbolTable.size / 16; index++) {
    const offset = symbolTable.offset + index * 16;
    symbols.push({ index, name: string(strings, bytes.readUInt32LE(offset), "symbol"),
      value: bytes.readUInt32LE(offset + 4), size: bytes.readUInt32LE(offset + 8),
      bind: bytes[offset + 12] >>> 4, type: bytes[offset + 12] & 15, other: bytes[offset + 13],
      shndx: bytes.readUInt16LE(offset + 14) });
  }
  const relocations = [];
  for (const section of sections.filter((candidate) => candidate.type === 9 || candidate.type === 4)) {
    check(section.type === 9 && section.entsize === 8 && section.size % 8 === 0 &&
      section.link === symbolTable.index && section.info < sections.length, "invalid relocation section");
    for (let index = 0; index < section.size / 8; index++) {
      const offset = section.offset + index * 8, info = bytes.readUInt32LE(offset + 4);
      const symbolIndex = info >>> 8; check(symbolIndex < symbols.length, "invalid relocation symbol");
      relocations.push({ section: sections[section.info], offset: bytes.readUInt32LE(offset),
        type: info & 0xff, symbol: symbols[symbolIndex], infoOffset: offset + 4 });
    }
  }
  return { bytes, sections, symbols, relocations };
}

function expectedWords(template) {
  const branch = 0xebfffffe;
  return {
    push_call: [0xe92d4010, branch],
    save_r0_call: [0xe92d4010, 0xe1a04000, branch],
    save_r0_r5_call: [0xe92d4070, 0xe1a05000, branch],
    save_r1_call: [0xe92d4010, 0xe1a04001, branch],
    save_r0_wide_call: [0xe92d4070, 0xe1a04000, branch],
  }[template].map((word) => word >>> 0);
}

function validateObject(input) {
  const elf = parseElf(input);
  const executableSections = elf.sections.filter((section) => (section.flags & 4) !== 0 && section.size !== 0);
  check(executableSections.length === 30, "exactly 30 nonempty executable sections required");
  check(elf.sections.filter((section) => (section.flags & 2) !== 0 && (section.flags & 4) === 0 &&
    section.size !== 0).length === 0, "allocated data or literal section forbidden");
  let bytes = 0, instructions = 0, pushes = 0;
  const calleeCounts = new Map();
  for (const row of rows) {
    const definition = definitions[row.template];
    const section = executableSections.find((candidate) => candidate.name === `.text.${row.name}`);
    check(section && section.type === 1 && section.size === definition.bodySize && section.align >= 4,
      `${row.name}: invalid owned body section`);
    const owners = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol.name &&
      !symbol.name.startsWith("$"));
    check(owners.length === 1 && owners[0].name === row.name && owners[0].value === 0 &&
      owners[0].size === definition.bodySize && owners[0].bind === 1 && owners[0].type === 2 &&
      owners[0].other === 0, `${row.name}: invalid or foreign ownership`);
    const words = expectedWords(row.template);
    const body = elf.bytes.subarray(section.offset, section.offset + section.size);
    check(words.every((word, index) => body.readUInt32LE(index * 4) === word),
      `${row.name}: instruction schedule mismatch`);
    const callOffset = definition.bodySize - 4;
    const relocations = elf.relocations.filter((relocation) => relocation.section.index === section.index);
    check(relocations.length === 1 && relocations[0].offset === callOffset &&
      relocations[0].type === R_ARM_CALL && relocations[0].symbol.name === row.callee,
      `${row.name}: symbolic callee or relocation mismatch`);
    check(((body.readUInt32LE(0) & 0xffff0000) >>> 0) === 0xe92d0000, `${row.name}: missing push`);
    pushes++; bytes += definition.bodySize; instructions += definition.instructionCount;
    calleeCounts.set(row.callee, (calleeCounts.get(row.callee) || 0) + 1);
  }
  check(elf.relocations.length === 30, "foreign relocation forbidden");
  check(bytes === 320 && instructions === 80 && pushes === 30, "aggregate contract mismatch");
  check(JSON.stringify(Object.fromEntries([...calleeCounts].sort())) === JSON.stringify({
    func_00139660: 8, func_0014E348: 17, func_00164060: 5,
  }), "callee counts mismatch");
  const defined = elf.symbols.filter((symbol) => symbol.bind !== 0 && symbol.type === 2 &&
    symbol.shndx !== 0).map((symbol) => symbol.name).sort();
  check(JSON.stringify(defined) === JSON.stringify(rows.map(({ name }) => name).sort()),
    "unexpected exported function");
  return elf;
}

function expectRejected(label, callback) {
  try { callback(); } catch { return; }
  fail(`hostile self-check accepted: ${label}`);
}
function hostileChecks(validElf) {
  expectRejected("truncated ELF", () => parseElf(validElf.subarray(0, 51)));
  const parsed = parseElf(validElf);
  const first = parsed.sections.find((section) => section.name === `.text.${rows[0].name}`);
  const changedInstruction = Buffer.from(validElf); changedInstruction[first.offset] ^= 1;
  expectRejected("changed instruction", () => validateObject(changedInstruction));
  const changedRelocation = Buffer.from(validElf);
  changedRelocation.writeUInt32LE((changedRelocation.readUInt32LE(parsed.relocations[0].infoOffset) &
    0xffffff00) | 29, parsed.relocations[0].infoOffset);
  expectRejected("changed relocation", () => validateObject(changedRelocation));
  const changedOwnership = Buffer.from(validElf);
  changedOwnership.writeUInt32LE(4, first.headerOffset + 20);
  expectRejected("truncated owned section", () => validateObject(changedOwnership));
  const foreignExecutable = Buffer.from(validElf);
  const emptyText = parsed.sections.find((section) => section.name === ".text");
  check(emptyText !== undefined, "missing fixture text section");
  foreignExecutable.writeUInt32LE(emptyText.flags | 4, emptyText.headerOffset + 8);
  foreignExecutable.writeUInt32LE(4, emptyText.headerOffset + 20);
  expectRejected("foreign executable ownership", () => validateObject(foreignExecutable));
}

function main() {
  check(process.argv.length === 2, "usage: validate-arm-duplicate-templates-84.mjs");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  validateConfig(config);
  const sourcePath = join(root, config.source), source = readFileSync(sourcePath);
  check(sha256(source) === config.sourceSha256, "sourceSha256 mismatch");
  const as = assembler(), temporary = mkdtempSync(join(tmpdir(), "arm-duplicate-templates-84-"));
  try {
    const objectPath = join(temporary, "arm_duplicate_templates_84.o");
    run(as, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath], { cwd: temporary });
    const object = readFileSync(objectPath);
    validateObject(object); hostileChecks(object);
    console.log("arm duplicate templates 84: OK (320 bytes, 80 instructions, 30 R_ARM_CALL)");
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}

try { main(); } catch (error) {
  console.error(`arm duplicate templates 84: FAIL: ${error.message}`); process.exitCode = 1;
}
