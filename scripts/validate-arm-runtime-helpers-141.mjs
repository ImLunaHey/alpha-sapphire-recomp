#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-141.json");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_141.S");
const CONFIG_HASH = "d8064ea36c7527cc1ecf9c2b2d3b8cc005a0713e1250ee7915370d02acccc103";
const SOURCE_HASH = "27261f2b16c083693e7c0c27311f1d4ec9c2624f37791c80ae7cea6126ba503b";
const CALL_TARGET = "func_004D83F4";
const MAX = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16384, symbols: 1000000, relocations: 1000000 };
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const FUNCTIONS = CONFIG.functions;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function boundedAdd(a, b, limit, what) {
  check(Number.isSafeInteger(a) && Number.isSafeInteger(b) && a >= 0 && b >= 0 && a <= limit - b, `${what} is outside its bound`);
  return a + b;
}
function range(bytes, offset, size, what) { return bytes.subarray(offset, boundedAdd(offset, size, bytes.length, what)); }
function stringAt(bytes, offset, what) {
  check(Number.isInteger(offset) && offset >= 0 && offset < bytes.length, `${what} string offset is invalid`);
  const end = bytes.subarray(offset, Math.min(bytes.length, offset + 4097)).indexOf(0);
  check(end >= 0, `${what} string is unterminated or too long`);
  return bytes.toString("utf8", offset, offset + end);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= MAX.file, "ELF size is outside the public bound");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "not ELF32 little-endian version 1");
  check(bytes[7] === 0 && bytes[8] === 0 && bytes.subarray(9, 16).every((byte) => byte === 0), "noncanonical ELF identification");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "not an ARM relocatable ELF");
  check(bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0 && bytes.readUInt32LE(36) === 0x05000000, "noncanonical ARM relocatable header");
  check(bytes.readUInt16LE(40) === 52 && bytes.readUInt16LE(42) === 0 && bytes.readUInt16LE(44) === 0 && bytes.readUInt16LE(46) === 40, "noncanonical ELF header sizes");
  const shoff = bytes.readUInt32LE(32), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && count > 0 && count <= MAX.sections && shstrndx > 0 && shstrndx < count, "invalid section table metadata");
  range(bytes, shoff, count * 40, "section table");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const p = shoff + index * 40;
    sections.push({ index, header: p, nameOffset: bytes.readUInt32LE(p), type: bytes.readUInt32LE(p + 4), flags: bytes.readUInt32LE(p + 8), address: bytes.readUInt32LE(p + 12), offset: bytes.readUInt32LE(p + 16), size: bytes.readUInt32LE(p + 20), link: bytes.readUInt32LE(p + 24), info: bytes.readUInt32LE(p + 28), align: bytes.readUInt32LE(p + 32), entsize: bytes.readUInt32LE(p + 36) });
  }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(sections[shstrndx].type === 3, "section-name table is not STRTAB");
  const names = range(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  let executable = 0, symbolCount = 0, relocationCount = 0;
  const payloads = [{ start: 0, end: 52 }, { start: shoff, end: shoff + count * 40 }];
  for (const section of sections) {
    section.name = stringAt(names, section.nameOffset, `section ${section.index}`);
    check(section.address === 0, `section ${section.name} has a nonzero address`);
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `section ${section.name} has invalid alignment`);
    if (section.type !== 8) { range(bytes, section.offset, section.size, `section ${section.name}`); if (section.size) payloads.push({ start: section.offset, end: section.offset + section.size }); }
    if (section.flags & 4) executable = boundedAdd(executable, section.size, MAX.exec, "aggregate executable data");
    if (section.type === 2 || section.type === 11) { check(section.entsize === 16 && section.size % 16 === 0, `invalid symbol table ${section.name}`); symbolCount = boundedAdd(symbolCount, section.size / 16, MAX.symbols, "aggregate symbols"); }
    if (section.type === 9 || section.type === 4) { const width = section.type === 9 ? 8 : 12; check(section.entsize === width && section.size % width === 0, `invalid relocation table ${section.name}`); relocationCount = boundedAdd(relocationCount, section.size / width, MAX.relocations, "aggregate relocations"); }
  }
  payloads.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < payloads.length; index++) check(payloads[index].start >= payloads[index - 1].end, "overlapping ELF payloads or headers");
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section names");
  const symtabs = sections.filter(({ type }) => type === 2), dynsyms = sections.filter(({ type }) => type === 11);
  check(symtabs.length === 1 && dynsyms.length === 0, "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.name === ".symtab" && symtab.flags === 0 && symtab.align === 4 && symtab.link < count && sections[symtab.link].type === 3, "invalid SYMTAB metadata");
  const strings = range(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings"), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const p = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(p);
    symbols.push({ index, name: nameOffset === 0 ? "" : stringAt(strings, nameOffset, "symbol"), value: bytes.readUInt32LE(p + 4), size: bytes.readUInt32LE(p + 8), bind: bytes[p + 12] >>> 4, type: bytes[p + 12] & 15, other: bytes[p + 13], shndx: bytes.readUInt16LE(p + 14) });
  }
  check(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0), "invalid local/global symbol partition");
  check(symbols.length && symbols[0].name === "" && symbols[0].value === 0 && symbols[0].size === 0 && symbols[0].bind === 0 && symbols[0].type === 0 && symbols[0].other === 0 && symbols[0].shndx === 0, "null symbol is not canonical");
  return { bytes, sections, symtab, symbols, relocationSections: sections.filter(({ type }) => type === 9 || type === 4) };
}

function branchTarget(word, offset) { return offset + 8 + ((word << 8) >> 6); }
function validateObject(input) {
  const elf = parseElf(input), expectedSections = FUNCTIONS.map(({ name }) => `.text.${name}`);
  check(JSON.stringify(elf.sections.filter(({ flags, size }) => (flags & 4) && size).map(({ name }) => name)) === JSON.stringify(expectedSections), "nonempty executable section set or order differs");
  let bodyBytes = 0, instructions = 0, localBranches = 0, returns = 0, calls = 0;
  const actualLocals = [], actualCalls = [], owned = new Set();
  for (const fn of FUNCTIONS) {
    const section = elf.sections.find(({ name }) => name === `.text.${fn.name}`);
    check(section && section.type === 1 && section.flags === 6 && section.address === 0 && section.size === fn.ownedSize && section.align === 4 && section.link === 0 && section.info === 0 && section.entsize === 0, `${fn.name}: invalid owned section`);
    owned.add(section.index);
    const body = range(elf.bytes, section.offset, section.size, fn.name);
    check(hash(body) === fn.bodyHash, `${fn.name}: body hash mismatch`);
    for (let offset = 0; offset < fn.size; offset += 4) {
      const word = body.readUInt32LE(offset); check(word === fn.words[offset / 4], `${fn.name}: instruction mismatch at +0x${offset.toString(16)}`);
      const transfer = CONFIG.directTransfers.find((entry) => entry.function === fn.name && entry.offset === offset);
      if (transfer) { check(((word & 0xff000000) >>> 0) === 0xeb000000, `${fn.name}: call opcode mismatch`); actualCalls.push({ function: fn.name, offset }); calls++; continue; }
      if ((word & 0x0e000000) === 0x0a000000) { actualLocals.push({ function: fn.name, offset, targetOffset: branchTarget(word, offset) }); localBranches++; }
      check((word & 0x0ffffff0) !== 0x012fff30, `${fn.name}: indirect call is forbidden`);
      check(!((word & 0x0ffffff0) === 0x012fff10 && (word & 15) !== 14), `${fn.name}: indirect tail is forbidden`);
      check((word & 0x0e5f0000) !== 0x041f0000, `${fn.name}: PC-relative data access is forbidden`);
      if (((word & 0xffff8000) >>> 0) === 0xe8bd8000 || word === 0xe49df004) returns++;
    }
    const members = elf.symbols.filter(({ shndx }) => shndx === section.index);
    check(members.length === 3 && members.some((s) => s.name === "" && s.bind === 0 && s.type === 3 && s.value === 0 && s.size === 0) && members.some((s) => s.name === "$a" && s.bind === 0 && s.type === 0 && s.value === 0 && s.size === 0) && members.some((s) => s.name === fn.name && s.bind === 1 && s.type === 2 && s.value === 0 && s.size === fn.size && s.other === 0), `${fn.name}: symbol ownership differs`);
    bodyBytes += fn.size; instructions += fn.instructionCount;
  }
  check(bodyBytes === 224 && instructions === 56 && localBranches === 1 && calls === 7 && returns === 7, "aggregate body/instruction/control-flow counts differ");
  check(JSON.stringify(actualLocals) === JSON.stringify(CONFIG.localTransfers), "local branch schedule differs");
  check(JSON.stringify(actualCalls) === JSON.stringify(CONFIG.directTransfers.map(({ function: name, offset }) => ({ function: name, offset }))), "direct call schedule differs");
  check(JSON.stringify(elf.relocationSections.map(({ name }) => name)) === JSON.stringify(FUNCTIONS.map(({ name }) => `.rel.text.${name}`)), "relocation section set or order differs");
  const relocations = [];
  for (const rel of elf.relocationSections) {
    check(rel.type === 9 && rel.flags === 0x40 && rel.address === 0 && rel.link === elf.symtab.index && rel.info > 0 && rel.info < elf.sections.length && rel.align === 4 && rel.entsize === 8 && rel.size === 8, `invalid relocation section ${rel.name}`);
    const target = elf.sections[rel.info]; check(owned.has(target.index) && rel.name === `.rel${target.name}`, `relocation section targets foreign data`);
    for (let cursor = 0; cursor < rel.size; cursor += 8) {
      const offset = elf.bytes.readUInt32LE(rel.offset + cursor), info = elf.bytes.readUInt32LE(rel.offset + cursor + 4), symbol = elf.symbols[info >>> 8];
      check(offset + 4 <= target.size && (info & 255) === 28 && symbol?.name === CALL_TARGET, "relocation offset, type, or identity differs");
      relocations.push({ function: target.name.slice(6), offset });
    }
  }
  check(relocations.length === 7 && JSON.stringify(relocations) === JSON.stringify(CONFIG.directTransfers.map(({ function: name, offset }) => ({ function: name, offset }))), "expected exactly seven ordered R_ARM_CALL relocations");
  const globals = elf.symbols.filter(({ bind }) => bind !== 0), expectedGlobals = new Set([...FUNCTIONS.map(({ name }) => name), CALL_TARGET]);
  check(globals.length === expectedGlobals.size && globals.every(({ name }) => expectedGlobals.has(name)), "global symbol set is not exact");
  const identity = globals.find(({ name }) => name === CALL_TARGET);
  check(identity && identity.bind === 1 && identity.type === 0 && identity.other === 0 && identity.value === 0 && identity.size === 0 && identity.shndx === 0, "call identity metadata differs");
  for (const section of elf.sections.filter(({ index }) => !owned.has(index))) check(!(section.flags & 4) || section.size === 0, `foreign executable payload in ${section.name}`);
  return elf;
}

function validateTarget(baseInput, targetInput) {
  const base = validateObject(baseInput), target = parseElf(targetInput);
  for (const fn of FUNCTIONS) {
    const baseSection = base.sections.find(({ name }) => name === `.text.${fn.name}`);
    const targetSections = target.sections.filter(({ name, flags, size }) => name === `.text.${fn.name}` && (flags & 4) && size);
    check(targetSections.length === 1, `${fn.name}: authoritative target section is not unique`);
    const candidate = Buffer.from(range(base.bytes, baseSection.offset, baseSection.size, `${fn.name} candidate`));
    for (const transfer of CONFIG.directTransfers.filter(({ function: name }) => name === fn.name)) {
      const place = Number(fn.address) + transfer.offset;
      const destination = Number.parseInt(CALL_TARGET.slice(5), 16);
      const displacement = destination - place - 8;
      check(displacement % 4 === 0 && displacement >= -0x02000000 && displacement < 0x02000000, `${fn.name}: call displacement is not encodable`);
      const word = candidate.readUInt32LE(transfer.offset);
      candidate.writeUInt32LE(((word & 0xff000000) | ((displacement >> 2) & 0x00ffffff)) >>> 0, transfer.offset);
    }
    const wanted = range(target.bytes, targetSections[0].offset, targetSections[0].size, `${fn.name} target`);
    check(wanted.length === candidate.length && wanted.equals(candidate), `${fn.name}: generated body disagrees with authoritative target`);
  }
}

function hasDefinition(text, name) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,|\\b${name}\\s*\\([^;]*\\)\\s*\\{)`).test(clean);
}
function validateRepository() {
  check(hash(fs.readFileSync(CONFIG_PATH)) === CONFIG_HASH, "configuration does not equal validator pin");
  check(CONFIG.sourceHash === SOURCE_HASH && hash(fs.readFileSync(SOURCE_PATH)) === SOURCE_HASH, "source does not equal validator pin");
  check(FUNCTIONS.length === 7 && CONFIG.totalBodySize === 224 && CONFIG.totalAdjacentSize === 0 && CONFIG.expectedInstructionCount === 56 && CONFIG.memoryOperationCount === 21 && CONFIG.localBranchCount === 1 && CONFIG.directCallCount === 7 && CONFIG.expectedRelocationCount === 7 && CONFIG.returnCount === 7, "configuration totals differ");
  check(new Set(FUNCTIONS.map(({ bodyHash }) => bodyHash)).size === FUNCTIONS.length, "function bodies are not unique");
  for (const relative of fs.readdirSync(path.join(ROOT, "src"), { recursive: true })) {
    const filename = `src/${relative}`; if (filename === CONFIG.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue;
    const text = fs.readFileSync(path.join(ROOT, filename), "utf8");
    for (const fn of FUNCTIONS) check(!hasDefinition(text, fn.name), `duplicate source owner for ${fn.name} in ${filename}`);
  }
  for (const relative of fs.readdirSync(path.join(ROOT, "config"), { recursive: true })) {
    if (relative === path.basename(CONFIG_PATH) || !relative.endsWith(".json")) continue;
    let other; try { other = JSON.parse(fs.readFileSync(path.join(ROOT, "config", relative), "utf8")); } catch { continue; }
    for (const entry of other.functions ?? []) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(entry.name ?? ""); if (!match) continue;
      const start = Number.parseInt(match[1], 16), size = entry.ownedSize ?? entry.size;
      if (!Number.isSafeInteger(size) || size <= 0) continue;
      for (const fn of FUNCTIONS) { const ours = Number(fn.address); check(start >= ours + fn.ownedSize || start + size <= ours, `overlapping config owner for ${fn.name} in ${relative}`); }
    }
  }
}

function assembler() {
  const candidates = [process.env.ARM_RUNTIME_HELPERS_141_AS, process.env.ARM_AS, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : null, "arm-none-eabi-as"];
  try { for (const entry of fs.readdirSync("/nix/store")) candidates.push(path.join("/nix/store", entry, "bin/arm-none-eabi-as")); } catch { /* optional */ }
  for (const candidate of candidates.filter(Boolean)) { const result = spawnSync(candidate, ["--version"], { encoding: "utf8" }); if (!result.error && result.status === 0) return candidate; }
  fail("no GNU ARM assembler found (set ARM_RUNTIME_HELPERS_141_AS or CROSS_COMPILE)");
}
function assemble(source, output) {
  const result = spawnSync(assembler(), ["-march=armv6k", "-mfpu=vfpv2", "-o", output, source], { encoding: "utf8" });
  check(!result.error && result.status === 0, `assembly failed: ${(result.error?.message || result.stderr || result.stdout).trim()}`);
}
function expectFailure(label, operation) { let error; try { operation(); } catch (caught) { error = caught; } check(error, `hostile fixture accepted: ${label}`); }
function selfTest() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "rt141-"));
  try {
    const objectPath = path.join(directory, "good.o"); assemble(SOURCE_PATH, objectPath); const good = fs.readFileSync(objectPath), parsed = validateObject(good); let rejected = 0;
    for (const fn of FUNCTIONS) for (let offset = 0; offset < fn.size; offset += 4) {
      const copy = Buffer.from(good), section = parsed.sections.find(({ name }) => name === `.text.${fn.name}`); copy[section.offset + offset] ^= 1;
      expectFailure(`${fn.name} word ${offset}`, () => validateObject(copy)); rejected++;
    }
    const firstRel = parsed.relocationSections[0];
    for (const [label, position, mutate] of [["relocation offset", firstRel.offset, (value) => value ^ 4], ["relocation type", firstRel.offset + 4, (value) => (value & ~255) | 29], ["relocation identity", firstRel.offset + 4, () => 28]]) {
      const copy = Buffer.from(good), value = copy.readUInt32LE(position); copy.writeUInt32LE(mutate(value) >>> 0, position); expectFailure(label, () => validateObject(copy)); rejected++;
    }
    const first = parsed.sections.find(({ name }) => name === `.text.${FUNCTIONS[0].name}`), sectionCopy = Buffer.from(good); sectionCopy.writeUInt32LE(first.size + 4, first.header + 20); expectFailure("owned section growth", () => validateObject(sectionCopy)); rejected++;
    const machineCopy = Buffer.from(good); machineCopy.writeUInt16LE(3, 18); expectFailure("wrong machine", () => validateObject(machineCopy)); rejected++;
    for (const size of [0, 7, 51, good.length - 1]) { expectFailure(`truncation ${size}`, () => validateObject(good.subarray(0, size))); rejected++; }
    expectFailure("file cap", () => parseElf(Buffer.alloc(MAX.file + 1))); rejected++;
    const compositeSource = path.join(directory, "composite.S"), compositeObject = path.join(directory, "composite.o"); let source = fs.readFileSync(SOURCE_PATH, "utf8");
    for (let i = 0; i < 12000; i++) source += `\n.section .text.rt141_empty_${i},"ax",%progbits\n`;
    fs.writeFileSync(compositeSource, source); assemble(compositeSource, compositeObject); validateObject(fs.readFileSync(compositeObject));
    process.stdout.write(`arm-runtime-helpers-141 self-test: ok (${rejected} hostile fixtures; every instruction word; 12,000-section composite)\n`);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

function main() {
  validateRepository(); const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  check((args.length === 1 || args.length === 3) && !args[0].startsWith("-") && (args.length === 1 || args[1] === "--target-object"), "usage: validate-arm-runtime-helpers-141.mjs <object-file> [--target-object <target-object>] | --self-test");
  for (const filename of [args[0], args[2]].filter(Boolean)) { const stat = fs.statSync(filename); check(stat.isFile() && stat.size <= MAX.file, `${filename}: input is not a regular file within 64 MiB`); }
  const object = fs.readFileSync(args[0]);
  if (args[2]) validateTarget(object, fs.readFileSync(args[2])); else validateObject(object);
  process.stdout.write(`arm-runtime-helpers-141 validation: ok (${args[0]}${args[2] ? `; target ${args[2]}` : ""})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-141 validation failed: ${error.message}\n`); process.exitCode = 1; }
