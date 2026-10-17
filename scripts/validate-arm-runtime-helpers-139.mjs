#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-139.json");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_139.S");
const CONFIG_HASH = "2918bf9951fe8d6b4d4c7a00ad43c38fd9f5db4f07b49b1f16217db9795f6803";
const SOURCE_HASH = "6fd2183841c030180c064facc8e00570da2542c32dc97fad9fc4bb4b8bbc0c7f";
const MAX_FILE = 64 * 1024 * 1024;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const FUNCTIONS = CONFIG.functions;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function range(bytes, offset, size, what) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= bytes.length && size <= bytes.length - offset, `${what} is outside the file`);
  return bytes.subarray(offset, offset + size);
}
function stringAt(bytes, offset, what) {
  check(offset >= 0 && offset < bytes.length, `${what} string offset is invalid`);
  const end = bytes.indexOf(0, offset);
  check(end >= 0 && end - offset <= 4096, `${what} string is unterminated or too long`);
  return bytes.toString("utf8", offset, end);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= MAX_FILE, "ELF size is outside the 64 MiB bound");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "not ELF32 little-endian version 1");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "not an ARM relocatable ELF");
  check(bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0 && bytes.readUInt32LE(36) === 0x05000000, "noncanonical ARM relocatable header");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46), shnum = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shentsize === 40 && shnum > 0 && shnum <= 16384 && shstrndx > 0 && shstrndx < shnum, "invalid section table metadata");
  range(bytes, shoff, shnum * 40, "section table");
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const p = shoff + index * 40;
    const section = { index, header: p, nameOffset: bytes.readUInt32LE(p), type: bytes.readUInt32LE(p + 4), flags: bytes.readUInt32LE(p + 8),
      address: bytes.readUInt32LE(p + 12), offset: bytes.readUInt32LE(p + 16), size: bytes.readUInt32LE(p + 20), link: bytes.readUInt32LE(p + 24),
      info: bytes.readUInt32LE(p + 28), align: bytes.readUInt32LE(p + 32), entsize: bytes.readUInt32LE(p + 36) };
    if (section.type !== 8) range(bytes, section.offset, section.size, `section ${index}`);
    sections.push(section);
  }
  const names = range(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  for (const section of sections) section.name = stringAt(names, section.nameOffset, "section");
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section name");
  const symtabs = sections.filter(({ type }) => type === 2);
  check(symtabs.length === 1 && !sections.some(({ type }) => type === 11), "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.entsize === 16 && symtab.size % 16 === 0 && symtab.size / 16 <= 1_000_000 && symtab.link < sections.length, "invalid SYMTAB");
  const strings = range(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings");
  const symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const p = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(p);
    symbols.push({ index, name: nameOffset === 0 ? "" : stringAt(strings, nameOffset, "symbol"), value: bytes.readUInt32LE(p + 4), size: bytes.readUInt32LE(p + 8),
      bind: bytes[p + 12] >>> 4, type: bytes[p + 12] & 15, other: bytes[p + 13], shndx: bytes.readUInt16LE(p + 14) });
  }
  const relocationSections = sections.filter(({ type }) => type === 9 || type === 4);
  check(relocationSections.every((s) => s.size % (s.type === 9 ? 8 : 12) === 0), "malformed relocation section");
  return { bytes, sections, symtab, symbols, relocationSections };
}

function branchTarget(word, offset) { return offset + 8 + ((word << 8) >> 6); }
function validateObject(input) {
  const elf = parseElf(input);
  const executable = elf.sections.filter(({ flags, size }) => (flags & 4) !== 0 && size !== 0);
  check(JSON.stringify(executable.map(({ name }) => name)) === JSON.stringify(FUNCTIONS.map(({ name }) => `.text.${name}`)), "nonempty executable section set or order differs");
  check(elf.relocationSections.length === 0, "relocations, including empty relocation sections, are forbidden");
  let bytesTotal = 0, instructions = 0, localBranches = 0, indirectCalls = 0, indirectTails = 0, returns = 0;
  const actualLocals = [], actualCalls = [], actualTails = [];
  for (const fn of FUNCTIONS) {
    const section = elf.sections.find(({ name }) => name === `.text.${fn.name}`);
    check(section && section.type === 1 && section.flags === 6 && section.address === 0 && section.align === 4 && section.size === fn.size && section.link === 0 && section.info === 0 && section.entsize === 0, `${fn.name}: section boundary or metadata mismatch`);
    const body = range(elf.bytes, section.offset, section.size, fn.name);
    check(hash(body) === fn.bodyHash, `${fn.name}: body hash mismatch`);
    for (let offset = 0; offset < fn.size; offset += 4) {
      const word = body.readUInt32LE(offset);
      check(word === fn.words[offset / 4], `${fn.name}: instruction mismatch at +0x${offset.toString(16)}`);
      if ((word & 0x0e000000) === 0x0a000000) { actualLocals.push({ function: fn.name, offset, targetOffset: branchTarget(word, offset) }); localBranches++; }
      if ((word & 0x0ffffff0) === 0x012fff30) { actualCalls.push({ function: fn.name, offset }); indirectCalls++; }
      if ((word & 0x0ffffff0) === 0x012fff10) {
        const reg = word & 15;
        if (reg === 14) returns++; else { actualTails.push({ function: fn.name, offset }); indirectTails++; }
      }
      check(!((word & 0x0e5f0000) === 0x041f0000), `${fn.name}: PC-relative data access at +0x${offset.toString(16)}`);
    }
    const owners = elf.symbols.filter((s) => s.shndx === section.index && s.bind === 1 && s.type === 2);
    check(owners.length === 1 && owners[0].name === fn.name && owners[0].value === 0 && owners[0].size === fn.size && owners[0].other === 0, `${fn.name}: function ownership metadata mismatch`);
    const maps = elf.symbols.filter((s) => s.shndx === section.index && s.name === "$a");
    check(maps.length === 1 && maps[0].value === 0 && maps[0].bind === 0, `${fn.name}: ARM mapping symbol mismatch`);
    bytesTotal += fn.size; instructions += fn.instructionCount;
  }
  check(bytesTotal === 712 && instructions === 178 && localBranches === 13 && indirectCalls === 4 && indirectTails === 16 && returns === 10, "aggregate size/instruction/control-flow counts differ");
  check(JSON.stringify(actualLocals) === JSON.stringify(CONFIG.localTransfers), "local branch schedule differs");
  check(JSON.stringify(actualCalls) === JSON.stringify(CONFIG.indirectCalls), "indirect call schedule differs");
  check(JSON.stringify(actualTails) === JSON.stringify(CONFIG.indirectTails), "indirect tail schedule differs");
  return elf;
}

function hasDefinition(text, name) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,|\\b${name}\\s*\\([^;]*\\)\\s*\\{)`).test(clean);
}
function validateRepository() {
  check(hash(fs.readFileSync(CONFIG_PATH)) === CONFIG_HASH, "configuration hash mismatch");
  check(CONFIG.sourceHash === SOURCE_HASH && hash(fs.readFileSync(SOURCE_PATH)) === SOURCE_HASH, "source hash mismatch");
  check(FUNCTIONS.length === 18 && CONFIG.totalBodySize === 712 && CONFIG.totalAdjacentSize === 0 && CONFIG.expectedInstructionCount === 178 && CONFIG.expectedRelocationCount === 0, "configuration aggregate mismatch");
  for (const relative of fs.readdirSync(path.join(ROOT, "src"), { recursive: true })) {
    const filename = `src/${relative}`;
    if (filename === CONFIG.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue;
    const text = fs.readFileSync(path.join(ROOT, filename), "utf8");
    for (const fn of FUNCTIONS) check(!hasDefinition(text, fn.name), `duplicate source owner for ${fn.name} in ${filename}`);
  }
  for (const relative of fs.readdirSync(path.join(ROOT, "config"), { recursive: true })) {
    if (relative === "arm-runtime-helpers-139.json" || !relative.endsWith(".json")) continue;
    const other = JSON.parse(fs.readFileSync(path.join(ROOT, "config", relative), "utf8"));
    for (const entry of other.functions ?? []) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(entry.name ?? ""); if (!match) continue;
      const start = Number.parseInt(match[1], 16), size = entry.ownedSize ?? entry.size ?? 1;
      for (const fn of FUNCTIONS) { const ours = Number(fn.address); check(start >= ours + fn.ownedSize || start + size <= ours, `overlapping config owner for ${fn.name} in ${relative}`); }
    }
  }
}

function assembler() {
  const candidates = [process.env.ARM_RUNTIME_HELPERS_139_AS, process.env.ARM_AS, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : null, "arm-none-eabi-as"];
  for (const candidate of candidates.filter(Boolean)) { const result = spawnSync(candidate, ["--version"], { encoding: "utf8" }); if (!result.error && result.status === 0) return candidate; }
  fail("no pinned GNU ARM assembler found (set ARM_RUNTIME_HELPERS_139_AS or CROSS_COMPILE)");
}
function assemble(source, output) {
  const result = spawnSync(assembler(), ["-mcpu=mpcore", "-mfpu=vfpv2", "-o", output, source], { encoding: "utf8" });
  check(!result.error && result.status === 0, `assembler failed: ${(result.error?.message || result.stderr || result.stdout).trim()}`);
}
function expectFailure(label, operation) { let failed = false; try { operation(); } catch { failed = true; } check(failed, `hostile fixture accepted: ${label}`); }
function selfTest() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "rt139-"));
  try {
    const objectPath = path.join(directory, "good.o"); assemble(SOURCE_PATH, objectPath);
    const good = fs.readFileSync(objectPath), parsed = validateObject(good);
    let rejected = 0;
    for (const fn of FUNCTIONS) for (let offset = 0; offset < fn.size; offset += 4) {
      const copy = Buffer.from(good), section = parsed.sections.find(({ name }) => name === `.text.${fn.name}`); copy[section.offset + offset] ^= 1;
      expectFailure(`${fn.name} word ${offset}`, () => validateObject(copy)); rejected++;
    }
    const relocated = Buffer.from(good), first = parsed.sections.find(({ name }) => name === `.text.${FUNCTIONS[0].name}`);
    relocated.writeUInt32LE(first.size + 4, first.header + 20); expectFailure("section growth", () => validateObject(relocated)); rejected++;
    const composite = path.join(directory, "composite.S"), compositeObject = path.join(directory, "composite.o");
    let source = fs.readFileSync(SOURCE_PATH, "utf8"); for (let i = 0; i < 12000; i++) source += `\n.section .text.rt139_empty_${i},\"ax\",%progbits\n`;
    fs.writeFileSync(composite, source); assemble(composite, compositeObject); validateObject(fs.readFileSync(compositeObject));
    process.stdout.write(`arm-runtime-helpers-139 self-test: ok (${rejected} hostile fixtures; every instruction word; 12,000-section composite)\n`);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

function main() {
  validateRepository(); const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-139.mjs <object-file> | --self-test");
  const stat = fs.statSync(args[0]); check(stat.isFile() && stat.size <= MAX_FILE, "input is not a regular file within 64 MiB");
  validateObject(fs.readFileSync(args[0])); process.stdout.write(`arm-runtime-helpers-139 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-139 validation failed: ${error.message}\n`); process.exitCode = 1; }
