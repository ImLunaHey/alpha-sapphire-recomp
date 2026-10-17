#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-142.json");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_142.S");
const CONFIG_HASH = "8052a2e98e9386906d994a7b113bedbafa14e7c32c08d3bdf293d34a3efca732";
const SOURCE_HASH = "7e57188a58493187b9f7301e19126c33a0fdee14965b8db54ed9e50ebc067018";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");
const MAX = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16384, symbols: 1000000, relocations: 1000000 };
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const FUNCTIONS = CONFIG.functions;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function add(a, b, limit, what) {
  check(Number.isSafeInteger(a) && Number.isSafeInteger(b) && a >= 0 && b >= 0 && a <= limit - b, `${what} exceeds its bound`);
  return a + b;
}
function range(bytes, offset, size, what) { return bytes.subarray(offset, add(offset, size, bytes.length, what)); }
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
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "wrong ELF type, machine, or version");
  check(bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0 && bytes.readUInt32LE(36) === 0x05000000, "nonrelocatable ARM header");
  check(bytes.readUInt16LE(40) === 52 && bytes.readUInt16LE(42) === 0 && bytes.readUInt16LE(44) === 0 && bytes.readUInt16LE(46) === 40, "noncanonical ELF header sizes");
  const shoff = bytes.readUInt32LE(32), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && count > 0 && count <= MAX.sections && shstrndx > 0 && shstrndx < count, "invalid section table metadata");
  range(bytes, shoff, count * 40, "section table");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const header = shoff + index * 40;
    sections.push({ index, header, nameOffset: bytes.readUInt32LE(header), type: bytes.readUInt32LE(header + 4), flags: bytes.readUInt32LE(header + 8), address: bytes.readUInt32LE(header + 12), offset: bytes.readUInt32LE(header + 16), size: bytes.readUInt32LE(header + 20), link: bytes.readUInt32LE(header + 24), info: bytes.readUInt32LE(header + 28), align: bytes.readUInt32LE(header + 32), entsize: bytes.readUInt32LE(header + 36) });
  }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(sections[shstrndx].type === 3, "section-name table is not STRTAB");
  const names = range(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  let exec = 0, symbolCount = 0, relocationCount = 0;
  for (const section of sections) {
    section.name = stringAt(names, section.nameOffset, `section ${section.index}`);
    check(section.address === 0, `section ${section.name} has a nonzero address`);
    check(section.align === 0 || (section.align & (section.align - 1)) === 0, `section ${section.name} has invalid alignment`);
    if (section.type !== 8) range(bytes, section.offset, section.size, `section ${section.name}`);
    if (section.flags & 4) exec = add(exec, section.size, MAX.exec, "aggregate executable data");
    if ([2, 11].includes(section.type)) { check(section.entsize === 16 && section.size % 16 === 0, `invalid symbol table ${section.name}`); symbolCount = add(symbolCount, section.size / 16, MAX.symbols, "aggregate symbols"); }
    if ([4, 9].includes(section.type)) { const width = section.type === 9 ? 8 : 12; check(section.entsize === width && section.size % width === 0, `invalid relocation table ${section.name}`); relocationCount = add(relocationCount, section.size / width, MAX.relocations, "aggregate relocations"); }
  }
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section names");
  const symtabs = sections.filter(({ type }) => type === 2);
  check(symtabs.length === 1 && sections.every(({ type }) => type !== 11), "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.name === ".symtab" && symtab.flags === 0 && symtab.align === 4 && symtab.link < count && sections[symtab.link].type === 3, "invalid SYMTAB metadata");
  const strings = range(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings"), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const cursor = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(cursor);
    symbols.push({ index, cursor, nameOffset, name: nameOffset ? stringAt(strings, nameOffset, `symbol ${index}`) : "", value: bytes.readUInt32LE(cursor + 4), size: bytes.readUInt32LE(cursor + 8), bind: bytes[cursor + 12] >>> 4, type: bytes[cursor + 12] & 15, other: bytes[cursor + 13], shndx: bytes.readUInt16LE(cursor + 14) });
  }
  check(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0), "invalid local/global symbol partition");
  check(symbols.length && symbols[0].nameOffset === 0 && symbols[0].value === 0 && symbols[0].size === 0 && symbols[0].bind === 0 && symbols[0].type === 0 && symbols[0].other === 0 && symbols[0].shndx === 0, "null symbol is not canonical");
  return { bytes, sections, symtab, symbols, relocationSections: sections.filter(({ type }) => type === 9 || type === 4) };
}

function armBranchTarget(word, offset) { return offset + 8 + ((word << 8) >> 6); }
function validateObject(input) {
  const elf = parseElf(input), expectedSections = FUNCTIONS.map(({ name }) => `.text.${name}`);
  check(JSON.stringify(elf.sections.filter(({ flags, size }) => (flags & 4) && size).map(({ name }) => name)) === JSON.stringify(expectedSections), "nonempty executable section set or order differs");
  const transferBySite = new Map(CONFIG.directTransfers.map((entry) => [`${entry.function}:${entry.offset}`, entry]));
  const localBySite = new Map(CONFIG.localTransfers.map((entry) => [`${entry.function}:${entry.offset}`, entry]));
  const indirectBySite = new Map(CONFIG.indirectCalls.map((entry) => [`${entry.function}:${entry.offset}`, entry]));
  const returnBySite = new Map(CONFIG.returns.map((entry) => [`${entry.function}:${entry.offset}`, entry]));
  const actualLocals = [], actualIndirect = [], actualReturns = [], owned = new Set();
  let bodyBytes = 0, instructions = 0;
  for (const fn of FUNCTIONS) {
    const section = elf.sections.find(({ name }) => name === `.text.${fn.name}`);
    check(section && section.type === 1 && section.flags === 6 && section.address === 0 && section.size === fn.ownedSize && section.align === 4 && section.link === 0 && section.info === 0 && section.entsize === 0, `${fn.name}: invalid owned section`);
    owned.add(section.index);
    const body = range(elf.bytes, section.offset, section.size, fn.name);
    check(hash(body) === fn.bodyHash, `${fn.name}: body hash mismatch`);
    for (let offset = 0; offset < fn.size; offset += 4) {
      const word = body.readUInt32LE(offset), site = `${fn.name}:${offset}`;
      if (transferBySite.has(site)) { check((word & 0x0f000000) === 0x0b000000, `${site}: direct-transfer opcode differs`); continue; }
      if ((word & 0x0e000000) === 0x0a000000) actualLocals.push({ function: fn.name, offset, targetOffset: armBranchTarget(word, offset) });
      if ((word & 0x0ffffff0) === 0x012fff30) actualIndirect.push({ function: fn.name, offset, register: word & 15 });
      check(!((word & 0x0ffffff0) === 0x012fff10 && (word & 15) !== 14), `${site}: indirect tail is forbidden`);
      check((word & 0x0e5f0000) !== 0x041f0000 && (word & 0x0f7f0f00) !== 0x0d1f0a00, `${site}: PC-relative data access is forbidden`);
      if (returnBySite.has(site)) actualReturns.push({ function: fn.name, offset, kind: returnBySite.get(site).kind });
    }
    const members = elf.symbols.filter(({ shndx }) => shndx === section.index);
    check(members.length === 3 && members.some((symbol) => symbol.name === "" && symbol.bind === 0 && symbol.type === 3 && symbol.value === 0 && symbol.size === 0) && members.some((symbol) => symbol.name === "$a" && symbol.bind === 0 && symbol.type === 0 && symbol.value === 0 && symbol.size === 0) && members.some((symbol) => symbol.name === fn.name && symbol.bind === 1 && symbol.type === 2 && symbol.value === 0 && symbol.size === fn.size && symbol.other === 0), `${fn.name}: symbol ownership differs`);
    bodyBytes += fn.size; instructions += fn.instructionCount;
  }
  check(bodyBytes === CONFIG.totalBodySize && instructions === CONFIG.expectedInstructionCount, "aggregate body or instruction total differs");
  check(JSON.stringify(actualLocals) === JSON.stringify(CONFIG.localTransfers), "local branch schedule differs");
  check(JSON.stringify(actualIndirect) === JSON.stringify(CONFIG.indirectCalls), "indirect-call schedule differs");
  check(JSON.stringify(actualReturns) === JSON.stringify(CONFIG.returns), "return schedule differs");
  const relocations = [];
  for (const rel of elf.relocationSections) {
    check(rel.type === 9 && rel.flags === 0x40 && rel.address === 0 && rel.link === elf.symtab.index && rel.info > 0 && rel.info < elf.sections.length && rel.align === 4 && rel.entsize === 8, `invalid relocation section ${rel.name}`);
    const target = elf.sections[rel.info];
    check(owned.has(target.index) && rel.name === `.rel${target.name}`, `relocation section targets foreign data`);
    for (let cursor = 0; cursor < rel.size; cursor += 8) {
      const offset = elf.bytes.readUInt32LE(rel.offset + cursor), info = elf.bytes.readUInt32LE(rel.offset + cursor + 4), symbol = elf.symbols[info >>> 8], expected = transferBySite.get(`${target.name.slice(6)}:${offset}`);
      check(offset + 4 <= target.size && expected && (info & 255) === (expected.type === "R_ARM_CALL" ? 28 : 29) && symbol?.name === expected.symbol, "relocation offset, type, or identity differs");
      relocations.push({ function: target.name.slice(6), offset, type: expected.type, mnemonic: expected.mnemonic, symbol: symbol.name, targetAddress: expected.targetAddress });
    }
  }
  check(relocations.length === CONFIG.expectedRelocationCount && JSON.stringify(relocations) === JSON.stringify(CONFIG.directTransfers), "ordered relocation schedule differs");
  const attributes = elf.sections.filter(({ name }) => name === ".ARM.attributes");
  check(attributes.length === 1 && attributes[0].type === 0x70000003 && attributes[0].flags === 0 && attributes[0].align === 1 && range(elf.bytes, attributes[0].offset, attributes[0].size, "attributes").equals(ARM_ATTRIBUTES), "ARM attributes differ");
  const expectedGlobals = new Set([...FUNCTIONS.map(({ name }) => name), ...CONFIG.directTransfers.map(({ symbol }) => symbol)]), globals = elf.symbols.filter(({ bind }) => bind !== 0);
  check(globals.length === expectedGlobals.size && globals.every(({ name }) => expectedGlobals.has(name)), "global symbol set is not exact");
  for (const symbol of globals) if (!FUNCTIONS.some(({ name }) => name === symbol.name)) check(symbol.type === 0 && symbol.other === 0 && symbol.value === 0 && symbol.size === 0 && symbol.shndx === 0, `external identity ${symbol.name} differs`);
  for (const section of elf.sections.filter(({ index }) => !owned.has(index))) check(!(section.flags & 4) || section.size === 0, `foreign executable payload in ${section.name}`);
  return elf;
}

function compareTarget(baseInput, targetInput) {
  const base = validateObject(baseInput), target = parseElf(targetInput);
  for (const fn of FUNCTIONS) {
    const baseSection = base.sections.find(({ name }) => name === `.text.${fn.name}`), targetSections = target.sections.filter(({ name }) => name === `.text.${fn.name}`);
    check(targetSections.length === 1 && targetSections[0].type === 1 && targetSections[0].flags === 6 && targetSections[0].size === fn.size, `${fn.name}: authoritative target section differs`);
    const actual = Buffer.from(range(base.bytes, baseSection.offset, fn.size, `${fn.name} base body`));
    for (const transfer of CONFIG.directTransfers.filter(({ function: owner }) => owner === fn.name)) {
      const destination = Number(transfer.targetAddress), source = Number(fn.address) + transfer.offset;
      check(Number.isSafeInteger(destination) && Number.isSafeInteger(source) && (destination - source - 8) % 4 === 0, `${fn.name}: invalid public transfer geometry`);
      const displacement = (destination - source - 8) / 4;
      check(displacement >= -0x800000 && displacement <= 0x7fffff, `${fn.name}: transfer is outside ARM branch range`);
      const word = actual.readUInt32LE(transfer.offset);
      actual.writeUInt32LE(((word & 0xff000000) | (displacement & 0xffffff)) >>> 0, transfer.offset);
    }
    const expected = range(target.bytes, targetSections[0].offset, fn.size, `${fn.name} target body`);
    check(actual.equals(expected), `${fn.name}: authoritative base-vs-target bytes differ`);
  }
}

function hasDefinition(text, name) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,|\\b${name}\\s*\\([^;]*\\)\\s*\\{)`).test(clean);
}
function validateRepository() {
  const source = fs.readFileSync(SOURCE_PATH), rawConfig = fs.readFileSync(CONFIG_PATH);
  check(hash(rawConfig) === CONFIG_HASH, "configuration does not equal validator pin");
  check(CONFIG.sourceHash === SOURCE_HASH && hash(source) === SOURCE_HASH, "source does not equal validator pin");
  check(CONFIG.schemaVersion === 1 && CONFIG.architecture === "ARMv6K" && CONFIG.mode === "arm" && CONFIG.minimumAlignment === 4, "top-level architecture contract differs");
  check(FUNCTIONS.length === 7 && CONFIG.totalBodySize === 656 && CONFIG.totalAdjacentSize === 0 && CONFIG.expectedInstructionCount === 164 && CONFIG.memoryOperationCount === 57 && CONFIG.localBranchCount === 17 && CONFIG.directTransferCount === 11 && CONFIG.indirectCallCount === 3 && CONFIG.indirectTailCount === 0 && CONFIG.returnCount === 8 && CONFIG.expectedRelocationCount === 11, "configuration totals differ");
  check(FUNCTIONS.reduce((sum, fn) => sum + fn.memoryOperationCount, 0) === CONFIG.memoryOperationCount && FUNCTIONS.reduce((sum, fn) => sum + fn.localBranchCount, 0) === CONFIG.localBranchCount && FUNCTIONS.reduce((sum, fn) => sum + fn.directTransferCount, 0) === CONFIG.directTransferCount && FUNCTIONS.reduce((sum, fn) => sum + fn.indirectCallCount, 0) === CONFIG.indirectCallCount && FUNCTIONS.reduce((sum, fn) => sum + fn.returnCount, 0) === CONFIG.returnCount, "per-function totals differ");
  check(!/^\s*\.(?:inst|word)\b/m.test(source.toString("utf8")), "raw instruction or data words are forbidden");
  const bodyHashes = FUNCTIONS.map(({ bodyHash }) => bodyHash); check(new Set(bodyHashes).size === bodyHashes.length, "owned bodies are not unique");
  for (const relative of fs.readdirSync(path.join(ROOT, "src"), { recursive: true })) {
    const filename = `src/${relative}`; if (filename === CONFIG.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue;
    const text = fs.readFileSync(path.join(ROOT, filename), "utf8"); for (const fn of FUNCTIONS) check(!hasDefinition(text, fn.name), `duplicate source owner for ${fn.name} in ${filename}`);
  }
  for (const relative of fs.readdirSync(path.join(ROOT, "config"), { recursive: true })) {
    if (relative === path.basename(CONFIG_PATH) || !relative.endsWith(".json")) continue;
    let other; try { other = JSON.parse(fs.readFileSync(path.join(ROOT, "config", relative), "utf8")); } catch { continue; }
    for (const entry of other.functions ?? []) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(entry.name ?? ""); if (!match) continue;
      const start = Number.parseInt(match[1], 16), size = entry.ownedSize ?? entry.size; if (!Number.isSafeInteger(size) || size <= 0) continue;
      for (const fn of FUNCTIONS) { const ours = Number(fn.address); check(start >= ours + fn.ownedSize || start + size <= ours, `overlapping config owner for ${fn.name} in ${relative}`); }
    }
  }
}

function assembler() {
  const candidates = [process.env.ARM_RUNTIME_HELPERS_142_AS, process.env.ARM_AS, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : null, "arm-none-eabi-as"];
  try { for (const entry of fs.readdirSync("/nix/store")) candidates.push(path.join("/nix/store", entry, "bin/arm-none-eabi-as")); } catch { /* optional */ }
  for (const candidate of candidates.filter(Boolean)) { const result = spawnSync(candidate, ["--version"], { encoding: "utf8" }); if (!result.error && result.status === 0) return candidate; }
  fail("no GNU ARM assembler found (set ARM_RUNTIME_HELPERS_142_AS or CROSS_COMPILE)");
}
function assemble(source, output) { const result = spawnSync(assembler(), ["-march=armv6k", "-mfpu=vfpv2", "-o", output, source], { encoding: "utf8" }); check(!result.error && result.status === 0, `assembly failed: ${(result.error?.message || result.stderr || result.stdout).trim()}`); }
function expectFailure(label, operation) { let error; try { operation(); } catch (caught) { error = caught; } check(error, `hostile fixture accepted: ${label}`); }
function selfTest() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "rt142-"));
  try {
    const objectPath = path.join(directory, "good.o"); assemble(SOURCE_PATH, objectPath);
    const good = fs.readFileSync(objectPath), parsed = validateObject(good); let rejected = 0;
    for (const fn of FUNCTIONS) for (let offset = 0; offset < fn.size; offset += 4) {
      const copy = Buffer.from(good), section = parsed.sections.find(({ name }) => name === `.text.${fn.name}`); copy[section.offset + offset] ^= 1;
      expectFailure(`${fn.name} instruction ${offset}`, () => validateObject(copy)); rejected++;
    }
    const firstRel = parsed.relocationSections[0];
    for (const [label, position, mutate] of [["relocation offset", firstRel.offset, (value) => value ^ 4], ["relocation type", firstRel.offset + 4, (value) => (value & ~255) | 2], ["relocation identity", firstRel.offset + 4, () => 28]]) {
      const copy = Buffer.from(good), value = copy.readUInt32LE(position); copy.writeUInt32LE(mutate(value) >>> 0, position); expectFailure(label, () => validateObject(copy)); rejected++;
    }
    const firstSection = parsed.sections.find(({ name }) => name === `.text.${FUNCTIONS[0].name}`), sectionCopy = Buffer.from(good); sectionCopy.writeUInt32LE(firstSection.size + 4, firstSection.header + 20); expectFailure("owned section growth", () => validateObject(sectionCopy)); rejected++;
    const primary = parsed.symbols.find(({ name }) => name === FUNCTIONS[0].name), symbolCopy = Buffer.from(good); symbolCopy.writeUInt32LE(4, primary.cursor + 4); expectFailure("primary symbol value", () => validateObject(symbolCopy)); rejected++;
    for (const size of [0, 7, 51, good.length - 1]) { expectFailure(`truncation ${size}`, () => validateObject(good.subarray(0, size))); rejected++; }
    expectFailure("file cap", () => parseElf(Buffer.alloc(MAX.file + 1))); rejected++;
    const compositeSource = path.join(directory, "composite.S"), compositeObject = path.join(directory, "composite.o"); let source = fs.readFileSync(SOURCE_PATH, "utf8");
    for (let index = 0; index < 12000; index++) source += `\n.section .text.rt142_empty_${index},\"ax\",%progbits\n`;
    fs.writeFileSync(compositeSource, source); assemble(compositeSource, compositeObject); validateObject(fs.readFileSync(compositeObject));
    process.stdout.write(`arm-runtime-helpers-142 self-test: ok (${rejected} hostile fixtures; every instruction word; 12,000-section composite)\n`);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

function main() {
  validateRepository(); const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  if (args.length === 3 && args[0] === "--compare-target") { compareTarget(fs.readFileSync(args[1]), fs.readFileSync(args[2])); process.stdout.write("arm-runtime-helpers-142 authoritative comparison: ok (7/7 functions; 656/656 bytes)\n"); return; }
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-142.mjs <object-file> | --self-test | --compare-target BASE TARGET");
  const stat = fs.statSync(args[0]); check(stat.isFile() && stat.size <= MAX.file, "input is not a regular file within 64 MiB"); validateObject(fs.readFileSync(args[0]));
  process.stdout.write(`arm-runtime-helpers-142 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-142 validation failed: ${error.message}\n`); process.exitCode = 1; }
