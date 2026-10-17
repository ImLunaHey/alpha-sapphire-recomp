#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-duplicate-templates-85.json");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_duplicate_templates_85.S");
const CONFIG_HASH = "c4d101fb90c2b92ecdb8eaa909d5a947c4c0b1c6e87d20ca8d5f9b9c5b015e06";
const SOURCE_HASH = "642d7d6451d580d659dc3ffbd29516e85d00e7cf46b0e3b380ff3f5e5cf02d53";
const ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");
const LIMIT = { file: 64 * 1024 * 1024, executable: 16 * 1024 * 1024, sections: 16384, symbols: 1000000, relocations: 1000000 };
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const FUNCTIONS = CONFIG.functions;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function boundedEnd(offset, size, maximum, what) { check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset <= maximum - size, `${what} exceeds its bound`); return offset + size; }
function range(bytes, offset, size, what) { return bytes.subarray(offset, boundedEnd(offset, size, bytes.length, what)); }
function stringAt(bytes, offset, what) { check(Number.isInteger(offset) && offset >= 0 && offset < bytes.length, `${what} string offset is invalid`); const end = bytes.subarray(offset, Math.min(bytes.length, offset + 4097)).indexOf(0); check(end >= 0, `${what} string is unterminated or too long`); return bytes.toString("utf8", offset, offset + end); }

function parseElf(input) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= LIMIT.file, "ELF size is outside its bound");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])) && bytes[7] === 0 && bytes[8] === 0 && bytes.subarray(9, 16).every((byte) => byte === 0), "invalid ELF identification");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "wrong ELF kind");
  check(bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0 && bytes.readUInt32LE(36) === 0x05000000, "invalid relocatable ARM header");
  check(bytes.readUInt16LE(40) === 52 && bytes.readUInt16LE(42) === 0 && bytes.readUInt16LE(44) === 0 && bytes.readUInt16LE(46) === 40, "invalid ELF header sizes");
  const shoff = bytes.readUInt32LE(32), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && count > 0 && count <= LIMIT.sections && shstrndx > 0 && shstrndx < count, "invalid section table metadata");
  range(bytes, shoff, count * 40, "section table");
  const sections = [];
  for (let index = 0; index < count; index++) { const header = shoff + index * 40; sections.push({ index, header, nameOffset: bytes.readUInt32LE(header), type: bytes.readUInt32LE(header + 4), flags: bytes.readUInt32LE(header + 8), address: bytes.readUInt32LE(header + 12), offset: bytes.readUInt32LE(header + 16), size: bytes.readUInt32LE(header + 20), link: bytes.readUInt32LE(header + 24), info: bytes.readUInt32LE(header + 28), align: bytes.readUInt32LE(header + 32), entsize: bytes.readUInt32LE(header + 36) }); }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(sections[shstrndx].type === 3, "section-name table is not STRTAB");
  const names = range(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table"); let executable = 0, symbolCount = 0, relocationCount = 0;
  for (const section of sections) {
    section.name = stringAt(names, section.nameOffset, `section ${section.index}`);
    check(section.address === 0 && (section.align === 0 || (section.align & (section.align - 1)) === 0), `section ${section.name} metadata is invalid`);
    if (section.type !== 8) range(bytes, section.offset, section.size, `section ${section.name}`);
    if (section.flags & 4) { executable += section.size; check(executable <= LIMIT.executable, "aggregate executable data exceeds its bound"); }
    if ([2, 11].includes(section.type)) { check(section.entsize === 16 && section.size % 16 === 0, `invalid symbol table ${section.name}`); symbolCount += section.size / 16; check(symbolCount <= LIMIT.symbols, "aggregate symbols exceed their bound"); }
    if ([4, 9].includes(section.type)) { const width = section.type === 9 ? 8 : 12; check(section.entsize === width && section.size % width === 0, `invalid relocation table ${section.name}`); relocationCount += section.size / width; check(relocationCount <= LIMIT.relocations, "aggregate relocations exceed their bound"); }
  }
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section names");
  const symtabs = sections.filter(({ type }) => type === 2); check(symtabs.length === 1 && sections.every(({ type }) => type !== 11), "expected one SYMTAB and no DYNSYM"); const symtab = symtabs[0];
  check(symtab.name === ".symtab" && symtab.flags === 0 && symtab.align === 4 && symtab.link < sections.length && sections[symtab.link].type === 3, "invalid SYMTAB metadata");
  const strings = range(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings"), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) { const cursor = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(cursor); symbols.push({ index, cursor, nameOffset, name: nameOffset ? stringAt(strings, nameOffset, `symbol ${index}`) : "", value: bytes.readUInt32LE(cursor + 4), size: bytes.readUInt32LE(cursor + 8), bind: bytes[cursor + 12] >>> 4, type: bytes[cursor + 12] & 15, other: bytes[cursor + 13], shndx: bytes.readUInt16LE(cursor + 14) }); }
  check(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0), "invalid local/global symbol partition");
  check(symbols.length && symbols[0].nameOffset === 0 && symbols[0].value === 0 && symbols[0].size === 0 && symbols[0].bind === 0 && symbols[0].type === 0 && symbols[0].other === 0 && symbols[0].shndx === 0, "null symbol is not canonical");
  return { bytes, sections, symtab, symbols, relocations: sections.filter(({ type }) => type === 9 || type === 4) };
}

function validateObject(input) {
  const elf = parseElf(input), expectedSections = FUNCTIONS.map(({ name }) => `.text.${name}`), transfers = new Map(CONFIG.directTransfers.map((entry) => [`${entry.function}:${entry.offset}`, entry])), owned = new Set();
  check(JSON.stringify(elf.sections.filter(({ flags, size }) => (flags & 4) && size).map(({ name }) => name)) === JSON.stringify(expectedSections), "nonempty executable section set or order differs");
  let bytes = 0, instructions = 0;
  for (const fn of FUNCTIONS) {
    const section = elf.sections.find(({ name }) => name === `.text.${fn.name}`); check(section && section.type === 1 && section.flags === 6 && section.address === 0 && section.size === fn.size && section.align === 4 && section.link === 0 && section.info === 0 && section.entsize === 0, `${fn.name}: invalid owned section`); owned.add(section.index);
    const body = range(elf.bytes, section.offset, fn.size, fn.name); check(hash(body) === fn.bodyHash, `${fn.name}: body hash mismatch`);
    for (let offset = 0; offset < fn.size; offset += 4) { const word = body.readUInt32LE(offset), site = `${fn.name}:${offset}`; if (transfers.has(site)) check(((word & 0xff000000) >>> 0) === 0xeb000000, `${site}: call opcode differs`); else { check((word & 0x0e000000) !== 0x0a000000, `${site}: unexpected direct branch`); check((word & 0x0ffffff0) !== 0x012fff30 && (word & 0x0ffffff0) !== 0x012fff10, `${site}: unexpected indirect transfer`); check((word & 0x0e5f0000) !== 0x041f0000 && (word & 0x0f7f0f00) !== 0x0d1f0a00, `${site}: PC-relative data access is forbidden`); } }
    const members = elf.symbols.filter(({ shndx }) => shndx === section.index); check(members.length === 3 && members.some((symbol) => symbol.name === "" && symbol.bind === 0 && symbol.type === 3 && symbol.value === 0 && symbol.size === 0) && members.some((symbol) => symbol.name === "$a" && symbol.bind === 0 && symbol.type === 0 && symbol.value === 0 && symbol.size === 0) && members.some((symbol) => symbol.name === fn.name && symbol.bind === 1 && symbol.type === 2 && symbol.value === 0 && symbol.size === fn.size && symbol.other === 0), `${fn.name}: symbol ownership differs`);
    bytes += fn.size; instructions += fn.instructionCount;
  }
  check(bytes === CONFIG.totalBodySize && instructions === CONFIG.expectedInstructionCount, "aggregate body or instruction total differs");
  for (const template of CONFIG.templates) { const bodies = template.instances.map((name) => { const section = elf.sections.find((candidate) => candidate.name === `.text.${name}`); return range(elf.bytes, section.offset, section.size, name); }); check(bodies.length === 2 && bodies[0].equals(bodies[1]) && hash(bodies[0]) === template.normalizedBodyHash, `${template.name}: duplicate-template equality differs`); }
  check(new Set(CONFIG.templates.map(({ normalizedBodyHash }) => normalizedBodyHash)).size === CONFIG.templateCount, "templates are not distinct");
  const actual = [];
  for (const rel of elf.relocations) { check(rel.type === 9 && rel.flags === 0x40 && rel.address === 0 && rel.link === elf.symtab.index && rel.info > 0 && rel.info < elf.sections.length && rel.align === 4 && rel.entsize === 8, `invalid relocation section ${rel.name}`); const section = elf.sections[rel.info]; check(owned.has(section.index) && rel.name === `.rel${section.name}`, `relocation section ${rel.name} targets foreign data`); for (let cursor = 0; cursor < rel.size; cursor += 8) { const offset = elf.bytes.readUInt32LE(rel.offset + cursor), info = elf.bytes.readUInt32LE(rel.offset + cursor + 4), symbol = elf.symbols[info >>> 8], expected = transfers.get(`${section.name.slice(6)}:${offset}`); check(expected && offset + 4 <= section.size && (info & 255) === 28 && symbol?.name === expected.symbol, "relocation offset, type, or identity differs"); actual.push({ function: section.name.slice(6), offset, type: "R_ARM_CALL", symbol: symbol.name, targetAddress: expected.targetAddress }); } }
  check(actual.length === CONFIG.expectedRelocationCount && JSON.stringify(actual) === JSON.stringify(CONFIG.directTransfers), "ordered relocation schedule differs");
  const attributes = elf.sections.filter(({ name }) => name === ".ARM.attributes"); check(attributes.length === 1 && attributes[0].type === 0x70000003 && attributes[0].flags === 0 && attributes[0].align === 1 && range(elf.bytes, attributes[0].offset, attributes[0].size, "attributes").equals(ATTRIBUTES), "ARM attributes differ");
  const expectedGlobals = new Set([...FUNCTIONS.map(({ name }) => name), ...CONFIG.directTransfers.map(({ symbol }) => symbol)]), globals = elf.symbols.filter(({ bind }) => bind !== 0); check(globals.length === expectedGlobals.size && globals.every(({ name }) => expectedGlobals.has(name)), "global symbol set differs");
  for (const section of elf.sections.filter(({ index }) => !owned.has(index))) check(!(section.flags & 4) || section.size === 0, `foreign executable payload in ${section.name}`);
  return elf;
}

function compareTarget(baseInput, targetInput) {
  const base = validateObject(baseInput), target = parseElf(targetInput);
  for (const fn of FUNCTIONS) { const baseSection = base.sections.find(({ name }) => name === `.text.${fn.name}`), targets = target.sections.filter(({ name }) => name === `.text.${fn.name}`); check(targets.length === 1 && targets[0].type === 1 && targets[0].flags === 6 && targets[0].size === fn.size, `${fn.name}: authoritative target section differs`); const actual = Buffer.from(range(base.bytes, baseSection.offset, fn.size, `${fn.name} base`)); for (const transfer of CONFIG.directTransfers.filter(({ function: owner }) => owner === fn.name)) { const displacement = (Number(transfer.targetAddress) - Number(fn.address) - transfer.offset - 8) / 4; check(Number.isInteger(displacement) && displacement >= -0x800000 && displacement <= 0x7fffff, `${fn.name}: invalid transfer geometry`); const word = actual.readUInt32LE(transfer.offset); actual.writeUInt32LE(((word & 0xff000000) | (displacement & 0xffffff)) >>> 0, transfer.offset); } check(actual.equals(range(target.bytes, targets[0].offset, fn.size, `${fn.name} target`)), `${fn.name}: authoritative base-vs-target bytes differ`); }
}

function hasDefinition(text, name) { const clean = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, ""); return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,|\\b${name}\\s*\\([^;]*\\)\\s*\\{)`).test(clean); }
function validateRepository() {
  const source = fs.readFileSync(SOURCE_PATH), rawConfig = fs.readFileSync(CONFIG_PATH); check(hash(rawConfig) === CONFIG_HASH, "configuration does not equal validator pin"); check(CONFIG.sourceHash === SOURCE_HASH && hash(source) === SOURCE_HASH, "source does not equal validator pin");
  check(CONFIG.schemaVersion === 1 && CONFIG.architecture === "ARMv6K" && CONFIG.mode === "arm" && CONFIG.minimumAlignment === 4 && CONFIG.templateCount === 2 && CONFIG.instanceCount === 4 && FUNCTIONS.length === 4 && CONFIG.totalBodySize === 352 && CONFIG.totalAdjacentSize === 0 && CONFIG.expectedInstructionCount === 88 && CONFIG.memoryOperationCount === 20 && CONFIG.localBranchCount === 0 && CONFIG.directCallCount === 16 && CONFIG.indirectCallCount === 0 && CONFIG.directTailCount === 0 && CONFIG.indirectTailCount === 0 && CONFIG.returnCount === 0 && CONFIG.expectedRelocationCount === 16, "configuration totals differ");
  check(FUNCTIONS.reduce((sum, fn) => sum + fn.memoryOperationCount, 0) === CONFIG.memoryOperationCount && FUNCTIONS.reduce((sum, fn) => sum + fn.directCallCount, 0) === CONFIG.directCallCount, "per-function totals differ"); check(!/^\s*\.(?:inst|word)\b/m.test(source.toString("utf8")), "raw instruction or data words are forbidden");
  for (const relative of fs.readdirSync(path.join(ROOT, "src"), { recursive: true })) { const filename = `src/${relative}`; if (filename === CONFIG.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue; const text = fs.readFileSync(path.join(ROOT, filename), "utf8"); for (const fn of FUNCTIONS) check(!hasDefinition(text, fn.name), `duplicate source owner for ${fn.name} in ${filename}`); }
  for (const relative of fs.readdirSync(path.join(ROOT, "config"), { recursive: true })) { if (relative === path.basename(CONFIG_PATH) || !relative.endsWith(".json")) continue; let other; try { other = JSON.parse(fs.readFileSync(path.join(ROOT, "config", relative), "utf8")); } catch { continue; } for (const entry of other.functions ?? []) { const match = /^func_([0-9A-Fa-f]{8})$/.exec(entry.name ?? ""); if (!match) continue; const start = Number.parseInt(match[1], 16), size = entry.ownedSize ?? entry.size; if (!Number.isSafeInteger(size) || size <= 0) continue; for (const fn of FUNCTIONS) { const ours = Number(fn.address); check(start >= ours + fn.ownedSize || start + size <= ours, `overlapping config owner for ${fn.name} in ${relative}`); } } }
}

function assembler() { const candidates = [process.env.ARM_DUPLICATE_TEMPLATES_85_AS, process.env.ARM_AS, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : null, "arm-none-eabi-as"]; try { for (const entry of fs.readdirSync("/nix/store")) candidates.push(path.join("/nix/store", entry, "bin/arm-none-eabi-as")); } catch { /* optional */ } for (const candidate of candidates.filter(Boolean)) { const result = spawnSync(candidate, ["--version"], { encoding: "utf8" }); if (!result.error && result.status === 0) return candidate; } fail("no GNU ARM assembler found (set ARM_DUPLICATE_TEMPLATES_85_AS or CROSS_COMPILE)"); }
function assemble(source, output) { const result = spawnSync(assembler(), ["-march=armv6k", "-mfpu=vfpv2", "-o", output, source], { encoding: "utf8" }); check(!result.error && result.status === 0, `assembly failed: ${(result.error?.message || result.stderr || result.stdout).trim()}`); }
function expectFailure(label, operation) { let error; try { operation(); } catch (caught) { error = caught; } check(error, `hostile fixture accepted: ${label}`); }
function selfTest() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "dt85-")); try { const object = path.join(directory, "good.o"); assemble(SOURCE_PATH, object); const good = fs.readFileSync(object), parsed = validateObject(good); let rejected = 0; for (const fn of FUNCTIONS) for (let offset = 0; offset < fn.size; offset += 4) { const copy = Buffer.from(good), section = parsed.sections.find(({ name }) => name === `.text.${fn.name}`); copy[section.offset + offset] ^= 1; expectFailure(`${fn.name} instruction ${offset}`, () => validateObject(copy)); rejected++; }
    const firstRel = parsed.relocations[0]; for (const [label, position, mutate] of [["relocation offset", firstRel.offset, (value) => value ^ 4], ["relocation type", firstRel.offset + 4, (value) => (value & ~255) | 29], ["relocation identity", firstRel.offset + 4, () => 28]]) { const copy = Buffer.from(good), value = copy.readUInt32LE(position); copy.writeUInt32LE(mutate(value) >>> 0, position); expectFailure(label, () => validateObject(copy)); rejected++; }
    const section = parsed.sections.find(({ name }) => name === `.text.${FUNCTIONS[0].name}`), extent = Buffer.from(good); extent.writeUInt32LE(section.size + 4, section.header + 20); expectFailure("section extent", () => validateObject(extent)); rejected++; const primary = parsed.symbols.find(({ name }) => name === FUNCTIONS[0].name), symbol = Buffer.from(good); symbol.writeUInt32LE(4, primary.cursor + 4); expectFailure("primary symbol value", () => validateObject(symbol)); rejected++;
    for (const size of [0, 7, 51, good.length - 1]) { expectFailure(`truncation ${size}`, () => validateObject(good.subarray(0, size))); rejected++; } expectFailure("file cap", () => parseElf(Buffer.alloc(LIMIT.file + 1))); rejected++;
    const compositeSource = path.join(directory, "composite.S"), compositeObject = path.join(directory, "composite.o"); let source = fs.readFileSync(SOURCE_PATH, "utf8"); for (let index = 0; index < 12000; index++) source += `\n.section .text.dt85_empty_${index},\"ax\",%progbits\n`; fs.writeFileSync(compositeSource, source); assemble(compositeSource, compositeObject); validateObject(fs.readFileSync(compositeObject)); process.stdout.write(`arm-duplicate-templates-85 self-test: ok (${rejected} hostile fixtures; every instruction word; 12,000-section composite)\n`);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

function main() { validateRepository(); const args = process.argv.slice(2); if (args.length === 1 && args[0] === "--self-test") return selfTest(); if (args.length === 3 && args[0] === "--compare-target") { compareTarget(fs.readFileSync(args[1]), fs.readFileSync(args[2])); process.stdout.write("arm-duplicate-templates-85 authoritative comparison: ok (4/4 functions; 352/352 bytes)\n"); return; } check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-duplicate-templates-85.mjs <object-file> | --self-test | --compare-target BASE TARGET"); const stat = fs.statSync(args[0]); check(stat.isFile() && stat.size <= LIMIT.file, "input is not a regular file within 64 MiB"); validateObject(fs.readFileSync(args[0])); process.stdout.write(`arm-duplicate-templates-85 validation: ok (${args[0]})\n`); }
try { main(); } catch (error) { process.stderr.write(`arm-duplicate-templates-85 validation failed: ${error.message}\n`); process.exitCode = 1; }
