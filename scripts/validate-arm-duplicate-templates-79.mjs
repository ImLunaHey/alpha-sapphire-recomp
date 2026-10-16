#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-duplicate-templates-79.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = join(root, config.source);
const args = process.argv.slice(2);
let suppliedObject;
let requestedAssembler;
let requestedLinker;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--object" || args[i] === "-o") suppliedObject = args[++i];
  else if (args[i] === "--assembler") requestedAssembler = args[++i];
  else if (args[i] === "--linker") requestedLinker = args[++i];
  else if (!args[i].startsWith("-") && !suppliedObject) suppliedObject = args[i];
  else throw new Error(`unknown or incomplete argument: ${args[i]}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}
function run(program, programArgs, options = {}) {
  const result = spawnSync(program, programArgs, { encoding: "utf8", ...options });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? `${result.stderr || result.stdout}`.trim();
    throw new Error(`${basename(program)} failed: ${detail}`);
  }
  return result;
}
function available(program) {
  if (!program) return false;
  const result = spawnSync(program, ["--version"], { encoding: "utf8" });
  return !result.error && result.status === 0;
}
function firstAvailable(candidates) {
  for (const candidate of [...new Set(candidates.filter(Boolean))]) {
    if (available(candidate)) return candidate;
  }
  return undefined;
}

const expectedCanonicalHashes = {
  instructionSchedule: "38a78bfacee333cd5cfa81c52be07cd37fe7a21cee7f1608232d03cae1cd030e",
  localTransferSchedule: "1f66e5b58eff0d9ebb883398ca62f4fc820e8ec25f84f342fb6e7c12c2a057a6",
  relocationSchedule: "78fb4531d01214bc69ac5d90b1b6970085ea33a80dfed1bf547f29812b32eb5d",
  literalIdentitySchedule: "cc9f6bc5be653f0eecd2fbe2e042e50716fa0f715da6af434c1eb3d0b9616b0c",
};
assert(config.version === 1 && config.mode === "arm", "unsupported batch configuration");
assert(config.sourceSha256 !== "PENDING", "source hash is still PENDING");
assert(sha256(readFileSync(sourcePath)) === config.sourceSha256, "source SHA-256 mismatch");
assert(JSON.stringify(config.canonicalHashes).includes('"algorithm":"sha256"') || config.canonicalHashes.algorithm === "sha256", "canonical hash algorithm mismatch");
for (const [key, value] of Object.entries(expectedCanonicalHashes))
  assert(config.canonicalHashes[key] === value, `${key} canonical hash mismatch`);

const functions = config.functions;
assert(functions.length === 24, "expected 24 functions");
assert(Object.keys(config.templates).length === 12, "expected 12 templates");
assert(new Set(functions.map((fn) => fn.name)).size === 24, "function names must be unique");
for (const [name, template] of Object.entries(config.templates)) {
  assert(template.count === 2, `${name}: expected two template members`);
  assert(functions.filter((fn) => fn.template === name).length === 2, `${name}: configured member count mismatch`);
}
let bodyBytes = 0;
let instructionCount = 0;
let directCount = 0;
let localCount = 0;
let literalCount = 0;
let addressCount = 0;
for (const fn of functions) {
  const template = config.templates[fn.template];
  assert(template, `${fn.name}: unknown template`);
  bodyBytes += template.bodySize;
  instructionCount += template.instructionCount;
  directCount += fn.directTransfers.length;
  localCount += fn.internalLabelOffsets.length;
  literalCount += fn.literals.length;
  addressCount += (fn.addressReferences ?? []).length;
  assert(template.bodySize === template.instructionCount * 4, `${fn.name}: non-ARM-sized body`);
  assert(fn.nextGlobalOffset >= template.bodySize, `${fn.name}: invalid next-global boundary`);
  const ownedEnd = fn.templateMaterialEndOffset ?? (template.bodySize - 1);
  assert(ownedEnd < fn.nextGlobalOffset, `${fn.name}: owned material crosses next global`);
  for (const label of fn.internalLabelOffsets)
    assert(label >= 0 && label < template.bodySize && label % 4 === 0, `${fn.name}: bad local label`);
}
assert(bodyBytes === 464 && bodyBytes === config.expectedBodyBytes, "body-byte total mismatch");
assert(instructionCount === 116 && instructionCount === config.expectedInstructionCount, "instruction total mismatch");
assert(directCount === 26 && localCount === 6, "transfer schedule totals mismatch");
assert(literalCount === 16 && addressCount === 2, "literal/address schedule totals mismatch");
assert(config.literalIdentityContract.siteCount === 16 && config.literalIdentityContract.classCount === 11, "literal identity totals mismatch");
assert(config.reusedLiteralIdentities.length === 2 && config.newLiteralIdentities.length === 9, "literal class partition mismatch");
assert(new Set(config.newLiteralIdentities).size === 9, "new literal identities are not distinct");
assert(Object.keys(config.literalIdentities).length === 11, "literal identity map size mismatch");
const usedLiteralKeys = functions.flatMap((fn) => fn.literals.map((literal) => literal.identity));
assert(new Set(usedLiteralKeys).size === 11 && usedLiteralKeys.every((key) => config.literalIdentities[key]), "literal identity schedule mismatch");
const usedLiteralSymbols = new Set(usedLiteralKeys.map((key) => config.literalIdentities[key].symbol));
assert(config.newLiteralIdentities.every((name) => usedLiteralSymbols.has(name)), "new literal identity is unused");
assert(config.reusedLiteralIdentities.every((name) => usedLiteralSymbols.has(name)), "reused literal identity is unused");
assert(config.addressIdentityContract.bytesOwnedByBatch === false && config.addressIdentityContract.relocationFree === true, "address ownership contract mismatch");
assert(config.branchIdentityContract.secondaryEntryRelations.length === 1, "secondary-entry relation mismatch");
const secondary = config.branchIdentityContract.secondaryEntryRelations[0];
assert(secondary.symbol === "arm_duplicate_templates_79_secondary_0041729C" && secondary.owner === "func_0041728C" && secondary.ownerOffset === 16 && secondary.nextGlobal === "func_0041735C" && secondary.bytesBeforeNextGlobal === 192, "secondary-entry ownership relation mismatch");
const directSymbols = functions.flatMap((fn) => fn.directTransfers.map((transfer) => transfer.symbol));
assert(new Set(directSymbols).size === 19, "direct-transfer identity class count mismatch");
for (const shared of config.branchIdentityContract.sharedClasses)
  assert(directSymbols.filter((name) => name === shared.symbol).length === shared.siteCount, `${shared.symbol}: shared branch class mismatch`);
assert(config.branchIdentityContract.singletonClasses.every((name) => directSymbols.filter((symbol) => symbol === name).length === 1), "singleton branch class mismatch");
const returns = functions.reduce((n, fn) => n + ({ release_global_object: 1, optional_flagged_tail: 1, set_identity_then_call: 1, optional_value_tail: 1, call_preserve_r0: 1 }[fn.template] ?? 0), 0);
assert(returns === 10, "return schedule total mismatch");

function parseElf(path) {
  const b = readFileSync(path);
  assert(b.length >= 52 && b.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), `${path}: not ELF`);
  assert(b[4] === 1 && b[5] === 1, `${path}: expected ELF32 little-endian`);
  assert(b.readUInt16LE(16) === 1 && b.readUInt16LE(18) === 40, `${path}: expected relocatable ARM ELF`);
  const shoff = b.readUInt32LE(32), shentsize = b.readUInt16LE(46), shnum = b.readUInt16LE(48), shstrndx = b.readUInt16LE(50);
  assert(shentsize >= 40 && shoff + shentsize * shnum <= b.length, `${path}: invalid section table`);
  const raw = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    raw.push({ index: i, nameOffset: b.readUInt32LE(p), type: b.readUInt32LE(p + 4), flags: b.readUInt32LE(p + 8), offset: b.readUInt32LE(p + 16), size: b.readUInt32LE(p + 20), link: b.readUInt32LE(p + 24), info: b.readUInt32LE(p + 28), entsize: b.readUInt32LE(p + 36) });
  }
  assert(raw[shstrndx], `${path}: invalid section-name table`);
  const stringAt = (table, offset) => {
    assert(offset < table.length, `${path}: invalid string offset`);
    const end = table.indexOf(0, offset);
    return table.toString("utf8", offset, end < 0 ? table.length : end);
  };
  const sectionData = (s) => {
    assert(s.type === 8 || s.offset + s.size <= b.length, `${path}: section outside file`);
    return s.type === 8 ? Buffer.alloc(s.size) : b.subarray(s.offset, s.offset + s.size);
  };
  const shstr = sectionData(raw[shstrndx]);
  const sections = raw.map((s) => ({ ...s, name: stringAt(shstr, s.nameOffset) }));
  const symbols = [];
  for (const s of sections.filter((x) => x.type === 2)) {
    const strings = sectionData(sections[s.link]);
    const data = sectionData(s);
    assert(s.entsize >= 16 && data.length % s.entsize === 0, `${path}: malformed symbol table`);
    for (let off = 0; off < data.length; off += s.entsize) {
      const info = data[off + 12];
      symbols.push({ name: stringAt(strings, data.readUInt32LE(off)), value: data.readUInt32LE(off + 4), size: data.readUInt32LE(off + 8), bind: info >> 4, type: info & 15, shndx: data.readUInt16LE(off + 14) });
    }
  }
  const relocations = [];
  for (const s of sections.filter((x) => x.type === 9 || x.type === 4)) {
    const symtab = sections[s.link];
    const strings = sectionData(sections[symtab.link]);
    const symdata = sectionData(symtab);
    const data = sectionData(s), width = s.type === 9 ? 8 : 12;
    assert(s.entsize === width && data.length % width === 0, `${path}: malformed relocation section`);
    for (let off = 0; off < data.length; off += width) {
      const info = data.readUInt32LE(off + 4), symIndex = info >>> 8, symbolOffset = symIndex * symtab.entsize;
      assert(symbolOffset + 16 <= symdata.length, `${path}: bad relocation symbol`);
      relocations.push({ target: sections[s.info].name, offset: data.readUInt32LE(off), type: info & 255, symbol: stringAt(strings, symdata.readUInt32LE(symbolOffset)) });
    }
  }
  return { b, sections, symbols, relocations, sectionData };
}

const relocationTypes = { R_ARM_ABS32: 2, R_ARM_CALL: 28, R_ARM_JUMP24: 29 };
const sectionLimit = 16 * 1024 * 1024;
function expectedRelocations(fn) {
  const rows = fn.directTransfers.map((r) => ({ offset: r.offset, type: relocationTypes[r.kind], symbol: r.symbol }));
  for (const literal of fn.literals) rows.push({ offset: literal.offset, type: 2, symbol: config.literalIdentities[literal.identity].symbol });
  return rows.sort((a, b) => a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol));
}
function validateObject(path, reference, label) {
  const elf = parseElf(path);
  const bySection = new Map(elf.sections.map((s) => [s.name, s]));
  const bySymbol = new Map(elf.symbols.filter((s) => s.name).map((s) => [s.name, s]));
  for (const section of elf.sections.filter((s) => (s.flags & 4) !== 0))
    assert(section.size <= sectionLimit, `${label}: executable section ${section.name} exceeds 16 MiB disassembly boundary`);
  for (const fn of functions) {
    const template = config.templates[fn.template], sectionName = `.text.${fn.name}`, section = bySection.get(sectionName);
    assert(section, `${label}: missing ${sectionName}`);
    const ownedSize = (fn.templateMaterialEndOffset ?? (template.bodySize - 1)) + 1;
    assert(section.size === ownedSize, `${label}: ${sectionName} size ${section.size}, expected ${ownedSize}`);
    assert((section.flags & 6) === 6, `${label}: ${sectionName} is not allocatable executable code`);
    const symbol = bySymbol.get(fn.name);
    assert(symbol && symbol.bind === 1 && symbol.type === 2, `${label}: ${fn.name} is not a global function`);
    assert(symbol.shndx === section.index && symbol.value === 0 && symbol.size === template.bodySize, `${label}: ${fn.name} boundary mismatch`);
    const actualRelocs = elf.relocations.filter((r) => r.target === sectionName).map(({ offset, type, symbol: name }) => ({ offset, type, symbol: name })).sort((a, b) => a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol));
    assert(JSON.stringify(actualRelocs) === JSON.stringify(expectedRelocations(fn)), `${label}: ${fn.name} relocation schedule mismatch`);
    for (const ref of fn.addressReferences ?? []) assert(!actualRelocs.some((r) => r.offset === ref.offset), `${label}: ${fn.name} address reference must be relocation-free`);
    if (reference) {
      const refSection = reference.sections.find((s) => s.name === sectionName);
      assert(refSection, `reference missing ${sectionName}`);
      const actualBytes = elf.sectionData(section), expectedBytes = reference.sectionData(refSection);
      for (let start = 0; start < actualBytes.length; start += sectionLimit)
        assert(actualBytes.subarray(start, start + sectionLimit).equals(expectedBytes.subarray(start, start + sectionLimit)), `${label}: ${fn.name} instruction/material bytes mismatch`);
    }
  }
  const ownedNames = new Set(functions.map((fn) => `.text.${fn.name}`));
  const ownedRelocs = elf.relocations.filter((r) => ownedNames.has(r.target));
  assert(ownedRelocs.length === 42, `${label}: expected 42 owned relocations`);
  assert(ownedRelocs.filter((r) => r.type === 28).length === 8, `${label}: call relocation count mismatch`);
  assert(ownedRelocs.filter((r) => r.type === 29).length === 18, `${label}: jump relocation count mismatch`);
  assert(ownedRelocs.filter((r) => r.type === 2).length === 16, `${label}: literal relocation count mismatch`);
  return elf;
}

const temp = mkdtempSync(join(tmpdir(), "dt79-"));
try {
  const assembler = firstAvailable([requestedAssembler, process.env.ARM_AS, process.env.CROSS_COMPILE && `${process.env.CROSS_COMPILE}as`, "arm-none-eabi-as", "arm-linux-gnueabi-as", "arm-linux-gnueabihf-as"]);
  assert(assembler, "no ARM GNU assembler found (use --assembler or ARM_AS)");
  const referencePath = join(temp, "reference.o");
  run(assembler, ["-o", referencePath, sourcePath]);
  const reference = parseElf(referencePath);
  validateObject(referencePath, reference, "standalone");
  if (suppliedObject) {
    const objectPath = resolve(suppliedObject);
    assert(existsSync(objectPath), `supplied object does not exist: ${objectPath}`);
    validateObject(objectPath, reference, "supplied object");
  }

  const defined = new Set(functions.map((fn) => fn.name));
  const externalNames = new Set();
  for (const fn of functions) {
    for (const transfer of fn.directTransfers) if (!defined.has(transfer.symbol)) externalNames.add(transfer.symbol);
    for (const literal of fn.literals) externalNames.add(config.literalIdentities[literal.identity].symbol);
  }
  for (const relation of config.branchIdentityContract.secondaryEntryRelations) {
    externalNames.add(relation.owner);
    externalNames.add(relation.nextGlobal);
  }
  let hostileSource = ".syntax unified\n.arch armv6k\n.arm\n.section .text.dt79_foreign,\"ax\",%progbits\n.balign 4\n";
  for (const name of [...externalNames].sort()) hostileSource += `.global ${name}\n.type ${name},%function\n${name}:\n  bx lr\n`;
  hostileSource += ".section .data.dt79_foreign,\"aw\",%progbits\n.balign 4\n.global dt79_hostile_foreign_data\ndt79_hostile_foreign_data:\n.word 0x79\n";
  const hostileSourcePath = join(temp, "hostile.S"), hostileObjectPath = join(temp, "hostile.o"), linkedPath = join(temp, "linked.o");
  writeFileSync(hostileSourcePath, hostileSource);
  run(assembler, ["-o", hostileObjectPath, hostileSourcePath]);
  const inferredLinker = assembler.endsWith("as") ? `${assembler.slice(0, -2)}ld` : undefined;
  const linker = firstAvailable([requestedLinker, process.env.ARM_LD, process.env.CROSS_COMPILE && `${process.env.CROSS_COMPILE}ld`, inferredLinker, "arm-none-eabi-ld", "arm-linux-gnueabi-ld", "arm-linux-gnueabihf-ld"]);
  assert(linker, "no ARM GNU linker found for hostile-object validation (use --linker or ARM_LD)");
  run(linker, ["-r", "-o", linkedPath, referencePath, hostileObjectPath]);
  validateObject(linkedPath, reference, "hostile foreign link");
  console.log("arm duplicate templates 79: validation passed (24 functions, 464 bytes, 116 instructions, standalone + hostile)");
} finally {
  rmSync(temp, { recursive: true, force: true });
}
