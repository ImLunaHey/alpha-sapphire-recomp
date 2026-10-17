#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BATCHES = {
  "record-leaves-01": {
    manifest: "config/cro-dll-battle-record-leaves-01.json",
    source: "src/cro/DllBattle/record_leaves_01.S",
    functions: 9,
    bytes: 272,
    instructions: 68,
    label: "record leaves 01",
  },
  "scalar-leaves-02": {
    manifest: "config/cro-dll-battle-scalar-leaves-02.json",
    source: "src/cro/DllBattle/scalar_leaves_02.S",
    functions: 19,
    bytes: 732,
    instructions: 183,
    label: "scalar leaves 02",
  },
  "packed-selectors-03": {
    manifest: "config/cro-dll-battle-packed-selectors-03.json",
    source: "src/cro/DllBattle/packed_selectors_03.S",
    functions: 13,
    bytes: 820,
    instructions: 205,
    label: "packed selectors 03",
  },
};
const BATCH = BATCHES[process.env.DLLBATTLE_BATCH ?? "record-leaves-01"];
if (!BATCH) throw new Error("unknown DllBattle validator batch selector");
const MANIFEST_PATH = path.join(ROOT, BATCH.manifest);
const INVENTORY_PATH = path.join(ROOT, "symbols/cro/DllBattle.csv");
const INTEGRATED_PATH = path.join(ROOT, "config/cro-sources.json");
const LIMITS = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16384, symbols: 1000000, relocations: 1000000 };

function fail(message) { throw new Error(`DllBattle record leaves 01: ${message}`); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function exactKeys(value, keys, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === keys, `${label} has an invalid schema`);
}
function boundedAdd(left, right, limit, label) {
  check(Number.isSafeInteger(left) && Number.isSafeInteger(right) && left >= 0 && right >= 0 && left <= limit - right,
    `${label} exceeds its bound`);
  return left + right;
}
function slice(bytes, offset, size, label) { return bytes.subarray(offset, boundedAdd(offset, size, bytes.length, label)); }
function stringAt(bytes, offset, label) {
  check(Number.isInteger(offset) && offset >= 0 && offset < bytes.length, `${label} string offset is invalid`);
  const end = bytes.subarray(offset, Math.min(bytes.length, offset + 4097)).indexOf(0);
  check(end >= 0, `${label} string is unterminated or too long`);
  return bytes.toString("utf8", offset, offset + end);
}

function readManifest() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  exactKeys(manifest,
    "architecture,expectedInstructionCount,expectedRelocationCount,functions,minimumAlignment,mode,schemaVersion,source,sourceHash,totalBodySize,unit,validation",
    "manifest");
  check(manifest.schemaVersion === 1 && manifest.unit === "DllBattle" && manifest.architecture === "ARMv6K" &&
    manifest.mode === "arm" && manifest.minimumAlignment === 4, "manifest identity differs");
  check(Array.isArray(manifest.functions) && manifest.functions.length === BATCH.functions, `manifest must contain ${BATCH.functions} functions`);
  let previous = -1, total = 0, instructions = 0;
  const names = new Set();
  for (const [index, fn] of manifest.functions.entries()) {
    exactKeys(fn, "address,bodyHash,instructionCount,name,semantics,size", `function ${index}`);
    check(Number.isSafeInteger(fn.address) && fn.address > previous && fn.address % 4 === 0, `${fn.name} address is invalid or unsorted`);
    check(fn.name === `func_${fn.address.toString(16).toUpperCase().padStart(8, "0")}` && !names.has(fn.name), `${fn.name} identity is invalid`);
    check(Number.isSafeInteger(fn.size) && fn.size > 0 && fn.size === fn.instructionCount * 4,
      `${fn.name} size or instruction count is invalid`);
    check(/^[0-9a-f]{64}$/u.test(fn.bodyHash) && /^[a-z0-9-]+$/u.test(fn.semantics), `${fn.name} metadata is invalid`);
    previous = fn.address; total += fn.size; instructions += fn.instructionCount; names.add(fn.name);
  }
  check(total === manifest.totalBodySize && total === BATCH.bytes && instructions === manifest.expectedInstructionCount && instructions === BATCH.instructions &&
    manifest.expectedRelocationCount === 0, "aggregate manifest totals differ");
  exactKeys(manifest.validation,
    "forbidAllocatedData,forbidForeignExecutablePayload,forbidRelocations,forbidUndefinedGlobals,maximumObjectSize,maximumSectionCount,maximumSymbolCount,requireExactPublicBoundaries,requireUniqueOwnership,targetRevision",
    "validation policy");
  check(manifest.validation.targetRevision === "AS_EUR_REV2" &&
    Object.entries(manifest.validation).filter(([key]) => key.startsWith("forbid") || key.startsWith("require")).every(([, value]) => value === true) &&
    manifest.validation.maximumObjectSize === LIMITS.file && manifest.validation.maximumSectionCount === LIMITS.sections &&
    manifest.validation.maximumSymbolCount === LIMITS.symbols, "validation policy differs");
  return manifest;
}

function validateRepository(manifest) {
  const sourcePath = path.resolve(ROOT, manifest.source);
  check(manifest.source === BATCH.source && sourcePath.startsWith(`${ROOT}${path.sep}`), "source path escapes its unit");
  const source = fs.readFileSync(sourcePath);
  check(hash(source) === manifest.sourceHash, "source hash differs from the pinned manifest");
  const text = source.toString("utf8");
  check(!/\.incbin\b|^\s*\.(?:byte|hword|short|word|long|quad|ascii|asciz|string|inst)\b/imu.test(text),
    "source contains opaque bytes, data, or strings");
  check(!/^\s*\.(?:data|rodata|bss)\b/imu.test(text), "source contains a non-code section directive");
  for (const fn of manifest.functions) {
    for (const fragment of [`FUNCTION_BEGIN ${fn.name}`, `FUNCTION_END ${fn.name}`])
      check(text.split(fragment).length === 2, `${fn.name} source declaration is missing or duplicated`);
  }
  check((text.match(/^FUNCTION_BEGIN func_[0-9A-F]{8}$/gmu) ?? []).length === manifest.functions.length &&
    (text.match(/^FUNCTION_END func_[0-9A-F]{8}$/gmu) ?? []).length === manifest.functions.length,
  "source contains an unexpected function declaration");

  const inventory = fs.readFileSync(INVENTORY_PATH, "utf8").split(/\r?\n/u);
  for (const fn of manifest.functions) {
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(inventory.filter((line) => line === row).length === 1 && inventory.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name} lacks one exact public ARM boundary`);
  }

  const integrated = JSON.parse(fs.readFileSync(INTEGRATED_PATH, "utf8"));
  const unit = integrated.units.find((entry) => entry.name === "DllBattle");
  check(unit && Array.isArray(unit.sources) && Array.isArray(unit.functions), "integrated DllBattle contract is malformed");
  const sourceOwners = integrated.units.filter((entry) => entry.sources?.some((sourceEntry) => sourceEntry.path === manifest.source));
  check(sourceOwners.length <= 1 && (sourceOwners.length === 0 || sourceOwners[0].name === "DllBattle"), "proposal source has duplicate ownership");
  for (const fn of manifest.functions) {
    const overlaps = unit.functions.filter((old) => old.name === fn.name ||
      (old.address < fn.address + fn.size && fn.address < old.address + old.size));
    check(overlaps.length === 0 || (overlaps.length === 1 && overlaps[0].name === fn.name && overlaps[0].address === fn.address &&
      overlaps[0].size === fn.size && overlaps[0].semantics === fn.semantics), `${fn.name} overlaps an existing DllBattle owner`);
  }
  const dllSources = fs.readdirSync(path.join(ROOT, "src/cro/DllBattle"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(?:S|c)$/u.test(entry.name))
    .map((entry) => fs.readFileSync(path.join(ROOT, "src/cro/DllBattle", entry.name), "utf8")).join("\n");
  for (const fn of manifest.functions) check((dllSources.match(new RegExp(`(?:^|\\s)${fn.name}(?:\\s|$)`, "gu")) ?? []).length === 2,
    `${fn.name} does not have exactly one begin/end source owner`);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= LIMITS.file, "ELF size is outside the 64 MiB bound");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "not ELF32 little-endian version 1");
  check(bytes[7] === 0 && bytes[8] === 0 && bytes.subarray(9, 16).every((byte) => byte === 0), "noncanonical ELF identification");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "not an ARM relocatable ELF");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && shentsize === 40 && count > 0 && count <= LIMITS.sections && shstrndx > 0 && shstrndx < count,
    "section table metadata is invalid or exceeds its bound");
  slice(bytes, shoff, count * 40, "section table");
  const sections = [];
  let executable = 0, symbolCount = 0, relocationCount = 0;
  for (let index = 0; index < count; index++) {
    const header = shoff + index * 40;
    sections.push({ index, header, nameOffset: bytes.readUInt32LE(header), type: bytes.readUInt32LE(header + 4), flags: bytes.readUInt32LE(header + 8),
      address: bytes.readUInt32LE(header + 12), offset: bytes.readUInt32LE(header + 16), size: bytes.readUInt32LE(header + 20),
      link: bytes.readUInt32LE(header + 24), info: bytes.readUInt32LE(header + 28), align: bytes.readUInt32LE(header + 32), entsize: bytes.readUInt32LE(header + 36) });
  }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(sections[shstrndx].type === 3, "section-name table is not STRTAB");
  const names = slice(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  const payloads = [{ start: 0, end: 52 }, { start: shoff, end: shoff + count * 40 }];
  for (const section of sections) {
    section.name = stringAt(names, section.nameOffset, `section ${section.index}`);
    check(section.address === 0 && (section.align === 0 || (section.align & (section.align - 1)) === 0), `section ${section.name} metadata is invalid`);
    if (section.type !== 8) {
      slice(bytes, section.offset, section.size, `section ${section.name}`);
      if (section.size) payloads.push({ start: section.offset, end: section.offset + section.size });
    }
    if (section.flags & 4) executable = boundedAdd(executable, section.size, LIMITS.exec, "aggregate executable payload");
    if (section.type === 2 || section.type === 11) {
      check(section.entsize === 16 && section.size % 16 === 0, `symbol table ${section.name} is malformed`);
      symbolCount = boundedAdd(symbolCount, section.size / 16, LIMITS.symbols, "aggregate symbol count");
    }
    if (section.type === 9 || section.type === 4) {
      const width = section.type === 9 ? 8 : 12;
      check(section.entsize === width && section.size % width === 0, `relocation section ${section.name} is malformed`);
      relocationCount = boundedAdd(relocationCount, section.size / width, LIMITS.relocations, "aggregate relocation count");
    }
  }
  payloads.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < payloads.length; index++) check(payloads[index].start >= payloads[index - 1].end, "ELF payloads or headers overlap");
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section name");
  const symtabs = sections.filter(({ type }) => type === 2), dynsyms = sections.filter(({ type }) => type === 11);
  check(symtabs.length === 1 && dynsyms.length === 0, "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.link > 0 && symtab.link < sections.length && sections[symtab.link].type === 3, "SYMTAB string link is invalid");
  const strings = slice(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings"), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const cursor = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(cursor);
    symbols.push({ index, cursor, name: nameOffset === 0 ? "" : stringAt(strings, nameOffset, "symbol"), value: bytes.readUInt32LE(cursor + 4),
      size: bytes.readUInt32LE(cursor + 8), bind: bytes[cursor + 12] >>> 4, type: bytes[cursor + 12] & 15, other: bytes[cursor + 13], shndx: bytes.readUInt16LE(cursor + 14) });
  }
  check(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0),
    "local/global symbol partition is invalid");
  return { bytes, sections, symbols, symtab, executable, symbolCount, relocationCount };
}

function validateObject(input, manifest) {
  const elf = parseElf(input), expectedNames = manifest.functions.map(({ name }) => `.text.${name}`);
  const allocated = elf.sections.filter(({ flags, size }) => (flags & 2) && size);
  check(allocated.length === expectedNames.length && allocated.every((section, index) => section.name === expectedNames[index] && section.type === 1 && section.flags === 6),
    "nonempty allocated section set, order, type, or flags differ");
  check(elf.executable === manifest.totalBodySize && elf.relocationCount === 0, "executable-byte or relocation total differs");
  check(!elf.symbols.some(({ bind, shndx }) => bind !== 0 && shndx === 0), "undefined global symbol is forbidden");
  const globals = elf.symbols.filter(({ bind }) => bind !== 0);
  check(globals.length === manifest.functions.length, "global symbol set is not exact");
  for (const fn of manifest.functions) {
    const section = elf.sections.find(({ name }) => name === `.text.${fn.name}`);
    check(section && section.size === fn.size && section.align === 4 && section.link === 0 && section.info === 0 && section.entsize === 0,
      `${fn.name} section metadata differs`);
    check(hash(slice(elf.bytes, section.offset, section.size, fn.name)) === fn.bodyHash, `${fn.name} body differs from the authored manifest`);
    const members = elf.symbols.filter(({ shndx }) => shndx === section.index);
    check(members.length === 3 && members.some((symbol) => symbol.name === "" && symbol.bind === 0 && symbol.type === 3 && symbol.value === 0 && symbol.size === 0) &&
      members.some((symbol) => symbol.name === "$a" && symbol.bind === 0 && symbol.type === 0 && symbol.value === 0 && symbol.size === 0) &&
      members.some((symbol) => symbol.name === fn.name && symbol.bind === 1 && symbol.type === 2 && symbol.value === 0 && symbol.size === fn.size && symbol.other === 0),
    `${fn.name} section, mapping, or function symbols differ`);
  }
  return elf;
}

function validateTarget(baseInput, targetInput, manifest) {
  const base = validateObject(baseInput, manifest), target = parseElf(targetInput);
  for (const fn of manifest.functions) {
    const baseSection = base.sections.find(({ name }) => name === `.text.${fn.name}`);
    const targets = target.sections.filter(({ name, type, flags, size }) => name === `.text.${fn.name}` && type === 1 && (flags & 4) && size === fn.size);
    check(targets.length === 1, `${fn.name} authoritative target section is missing or ambiguous`);
    const left = slice(base.bytes, baseSection.offset, baseSection.size, `${fn.name} candidate`);
    const right = slice(target.bytes, targets[0].offset, targets[0].size, `${fn.name} target`);
    check(left.equals(right), `${fn.name} is not an exact 100% target match`);
  }
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8" });
  if (result.error) fail(`could not run ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited ${result.status}: ${result.stderr.trim()}`);
}
function assemble(manifest, output) {
  const compiler = process.env.ARM_NONE_EABI_GCC || (process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}gcc` : "arm-none-eabi-gcc");
  run(compiler, ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding", "-fno-pic", "-fno-pie", "-Wa,--noexecstack",
    "-x", "assembler-with-cpp", "-c", path.join(ROOT, manifest.source), "-o", output]);
}
function expectReject(callback, label) {
  let rejected = false;
  try { callback(); } catch { rejected = true; }
  check(rejected, `hostile fixture was accepted: ${label}`);
}
function selfTest(manifest) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "dllbattle-record-leaves-01-"));
  try {
    const object = path.join(directory, "candidate.o");
    assemble(manifest, object);
    const valid = fs.readFileSync(object), parsed = validateObject(valid, manifest);
    const mutate = (callback) => { const copy = Buffer.from(valid); callback(copy, parsed); return copy; };
    expectReject(() => validateObject(mutate((bytes) => { bytes[0] ^= 1; }), manifest), "bad ELF magic");
    expectReject(() => validateObject(mutate((bytes) => { bytes.writeUInt16LE(3, 18); }), manifest), "wrong machine");
    expectReject(() => validateObject(valid.subarray(0, valid.length - 1), manifest), "truncated section table");
    expectReject(() => validateObject(Buffer.alloc(LIMITS.file + 1), manifest), "oversize input");
    expectReject(() => validateObject(mutate((bytes, elf) => { bytes.writeUInt16LE(LIMITS.sections + 1, 48); }), manifest), "section-count cap");
    const firstName = manifest.functions[0].name;
    expectReject(() => validateObject(mutate((bytes, elf) => { const section = elf.sections.find(({ name }) => name === `.text.${firstName}`); bytes[section.offset] ^= 1; }), manifest), "instruction mutation");
    expectReject(() => validateObject(mutate((bytes, elf) => { const section = elf.sections.find(({ name }) => name === `.text.${firstName}`); bytes.writeUInt32LE(section.size + 4, section.header + 20); }), manifest), "section growth");
    expectReject(() => validateObject(mutate((bytes, elf) => { const section = elf.sections.find(({ name }) => name === ".note.GNU-stack"); bytes.writeUInt32LE(2, section.header + 8); bytes.writeUInt32LE(1, section.header + 20); }), manifest), "allocated foreign data");
    expectReject(() => validateObject(mutate((bytes, elf) => { const symbol = elf.symbols.find(({ name }) => name === firstName); bytes.writeUInt16LE(0, symbol.cursor + 14); }), manifest), "undefined global");
    expectReject(() => validateObject(mutate((bytes, elf) => { const section = elf.sections.find(({ name }) => name === `.text.${firstName}`); bytes.writeUInt32LE(9, section.header + 4); bytes.writeUInt32LE(8, section.header + 36); }), manifest), "unexpected relocation section");
    const duplicate = structuredClone(JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")));
    duplicate.functions[1].address = duplicate.functions[0].address;
    expectReject(() => {
      let previous = -1;
      for (const fn of duplicate.functions) { check(fn.address > previous, "synthetic duplicate ownership"); previous = fn.address; }
    }, "duplicate ownership");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function parseArguments(argv) {
  const result = { selfTest: false };
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (option === "--self-test") { check(!result.selfTest, "--self-test supplied twice"); result.selfTest = true; continue; }
    check(["--object", "--target"].includes(option) && argv[index + 1] !== undefined, "usage: validator [--self-test] [--object FILE [--target FILE]]");
    const key = option.slice(2); check(result[key] === undefined, `${option} supplied twice`); result[key] = path.resolve(argv[++index]);
  }
  check(result.target === undefined || result.object !== undefined, "--target requires --object");
  for (const key of ["object", "target"]) if (result[key] !== undefined) check(fs.statSync(result[key]).isFile(), `${key} is not a regular file`);
  return result;
}

try {
  const options = parseArguments(process.argv.slice(2)), manifest = readManifest();
  validateRepository(manifest);
  if (options.selfTest) selfTest(manifest);
  if (options.object) {
    const object = fs.readFileSync(options.object);
    if (options.target) validateTarget(object, fs.readFileSync(options.target), manifest);
    else validateObject(object, manifest);
  }
  console.log(`Validated ${BATCH.functions} DllBattle ${BATCH.label} (${BATCH.bytes}/${BATCH.bytes} bytes, ${BATCH.instructions} instructions)${options.target ? " against the authoritative target" : ""}${options.selfTest ? " with hostile fixtures" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
