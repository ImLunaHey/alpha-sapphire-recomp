#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonicalizeDllContestCommonBaseElf, canonicalizeDllContestCommonImports } from "./split-cro-target-object.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, "config/cro-dll-contest-common-01.json");
const INVENTORY_PATH = path.join(ROOT, "symbols/cro/DllContestCommon.csv");
const PARTITION_PATH = path.join(ROOT, "symbols/cro-partitions/DllContestCommon.json");
const INTEGRATED_PATH = path.join(ROOT, "config/cro-sources.json");

function fail(message) { throw new Error(`DllContestCommon 01 validation: ${message}`); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function exactKeys(value, keys, label) {
  check(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).sort().join(",") === keys,
    `${label} has an invalid schema`);
}
function boundedSlice(bytes, offset, size, label) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset <= bytes.length - size,
    `${label} exceeds the object`);
  return bytes.subarray(offset, offset + size);
}
function stringAt(bytes, offset, label) {
  check(Number.isSafeInteger(offset) && offset >= 0 && offset < bytes.length, `${label} string offset is invalid`);
  const end = bytes.indexOf(0, offset);
  check(end >= offset && end - offset <= 4096, `${label} string is unterminated or too long`);
  return bytes.toString("utf8", offset, end);
}

function readManifest() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  exactKeys(manifest,
    "architecture,controlFragments,functions,jumpTablePoolAddress,minimumAlignment,mode,poolAddresses,schemaVersion,selectorValues,source,sourceHash,terminalPoolAddress,unit,validation,veneerAddresses",
    "manifest");
  check(manifest.schemaVersion === 1 && manifest.unit === "DllContestCommon" && manifest.architecture === "ARMv6K" &&
    manifest.mode === "arm" && manifest.minimumAlignment === 4 && manifest.source === "src/cro/DllContestCommon/module.S",
  "manifest identity differs");
  check(/^[0-9a-f]{64}$/u.test(manifest.sourceHash), "source hash is invalid");
  check(JSON.stringify(manifest.veneerAddresses) === JSON.stringify([0, 8, 16, 24, 32, 40]) &&
    JSON.stringify(manifest.poolAddresses) === JSON.stringify([4, 12, 20, 28, 36, 44, 520]) &&
    manifest.jumpTablePoolAddress === 720 &&
    manifest.terminalPoolAddress === 836 &&
    JSON.stringify(manifest.selectorValues) === JSON.stringify([5, 6, 7, 8, 9, 10]), "structural constants differ");
  const expectedFunctions = [["func_00000030", 48, 472, 118, "contest-resource-build"],
    ["func_0000020C", 524, 76, 19, "contest-control-initialize"],
    ["func_00000258", 600, 100, 25, "contest-resource-release"]];
  check(manifest.functions.every((fn) => Object.keys(fn).sort().join(",") ===
    "address,bodyHash,instructionCount,name,semantics,size" && /^[0-9a-f]{64}$/u.test(fn.bodyHash)) &&
    JSON.stringify(manifest.functions.map((fn) => [fn.name, fn.address, fn.size, fn.instructionCount, fn.semantics])) === JSON.stringify(expectedFunctions),
    "function claims differ");
  const expectedFragments = [["controlPrelude", 700, 20, 5], ["controlCasesAndDiagnostic", 740, 96, 24]];
  check(manifest.controlFragments.every((fragment) => Object.keys(fragment).sort().join(",") ===
    "address,bodyHash,instructionCount,name,size" && /^[0-9a-f]{64}$/u.test(fragment.bodyHash)) &&
    JSON.stringify(manifest.controlFragments.map(({ name, address, size, instructionCount }) =>
      [name, address, size, instructionCount])) === JSON.stringify(expectedFragments), "control-fragment claims differ");
  exactKeys(manifest.validation,
    "expectedAuthoredRelocations,maximumObjectSize,maximumSectionCount,maximumSymbolCount,requireCanonicalBaseEmission,requireCanonicalImportAliases,requireCompleteControlEntry,requireExactPublicBoundaries,requireUniqueOwnership,targetRevision",
    "validation policy");
  check(manifest.validation.targetRevision === "AS_EUR_REV2" && manifest.validation.expectedAuthoredRelocations === 17 &&
    manifest.validation.requireCanonicalImportAliases === true && manifest.validation.requireCanonicalBaseEmission === true &&
    manifest.validation.requireCompleteControlEntry === true && manifest.validation.requireExactPublicBoundaries === true &&
    manifest.validation.requireUniqueOwnership === true && manifest.validation.maximumObjectSize === 1048576 &&
    manifest.validation.maximumSectionCount === 256 && manifest.validation.maximumSymbolCount === 4096,
  "validation policy differs");
  return manifest;
}

function validateRepository(manifest) {
  const source = fs.readFileSync(path.join(ROOT, manifest.source));
  check(hash(source) === manifest.sourceHash, "source hash differs from the reviewed manifest");
  const text = source.toString("utf8");
  check(!/(?:ROM_PATH|DECOMP_PRIVATE|\.incbin|\/home\/|\/mnt\/|target\/cro-split)/u.test(text),
    "source contains a private-artifact reference");
  check(text.includes(".text.__cro_gap_000002bc") && text.includes(".text.__cro_gap_000002e4") &&
    text.includes(".pool.__cro_pool_00000344") && text.includes("0xd8e12c21") &&
    !text.includes("selector >= 5 path has no semantic contract"), "complete module-control contract is missing");

  const inventory = fs.readFileSync(INVENTORY_PATH, "utf8").split(/\r?\n/u);
  for (const fn of manifest.functions) {
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(inventory.filter((line) => line === row).length === 1, `${fn.name} lacks its exact public boundary`);
  }
  const partition = JSON.parse(fs.readFileSync(PARTITION_PATH, "utf8"));
  check(partition.module === manifest.unit && partition.textSize === 872 && Array.isArray(partition.unknown) && partition.unknown.length === 0,
    "public partition identity differs");
  check(JSON.stringify(partition.functions.map(({ name, address, size }) => [name, address, size])) ===
    JSON.stringify(manifest.functions.map(({ name, address, size }) => [name, address, size])), "partition function boundaries differ");

  const integrated = JSON.parse(fs.readFileSync(INTEGRATED_PATH, "utf8"));
  const owners = integrated.units.filter((unit) => unit.sources?.some(({ path: sourcePath }) => sourcePath === manifest.source));
  check(owners.length === 1 && owners[0].name === manifest.unit, "source ownership is missing or ambiguous");
  const claims = manifest.functions.map(({ name, address, size, semantics }) => ({ name, address, size, semantics }));
  check(JSON.stringify(owners[0].functions) === JSON.stringify(claims), "integrated function claims differ");
}

function parseElf(input, manifest) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= manifest.validation.maximumObjectSize, "ELF size is invalid");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])) &&
    bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1,
  "object is not ELF32 little-endian ARM REL");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shentsize === 40 && count > 0 && count <= manifest.validation.maximumSectionCount && shstrndx > 0 && shstrndx < count,
    "section table metadata is invalid");
  boundedSlice(bytes, shoff, count * 40, "section table");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    sections.push({ index, header: at, nameOffset: bytes.readUInt32LE(at), type: bytes.readUInt32LE(at + 4),
      flags: bytes.readUInt32LE(at + 8), offset: bytes.readUInt32LE(at + 16), size: bytes.readUInt32LE(at + 20),
      link: bytes.readUInt32LE(at + 24), info: bytes.readUInt32LE(at + 28), align: bytes.readUInt32LE(at + 32),
      entsize: bytes.readUInt32LE(at + 36) });
  }
  const sectionNames = boundedSlice(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section names");
  for (const section of sections) {
    section.name = section.index === 0 ? "" : stringAt(sectionNames, section.nameOffset, `section ${section.index}`);
    if (section.type !== 8) boundedSlice(bytes, section.offset, section.size, section.name || "section zero");
  }
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "section names are duplicated");
  const symtab = sections.find(({ type }) => type === 2);
  check(symtab && symtab.entsize === 16 && symtab.size % 16 === 0 && symtab.size / 16 <= manifest.validation.maximumSymbolCount,
    "symbol table is invalid");
  const stringsSection = sections[symtab.link];
  check(stringsSection?.type === 3, "symbol string table is invalid");
  const strings = boundedSlice(bytes, stringsSection.offset, stringsSection.size, "symbol strings"), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const at = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(at);
    symbols.push({ index, name: nameOffset ? stringAt(strings, nameOffset, `symbol ${index}`) : "", value: bytes.readUInt32LE(at + 4),
      size: bytes.readUInt32LE(at + 8), bind: bytes[at + 12] >>> 4, type: bytes[at + 12] & 15, shndx: bytes.readUInt16LE(at + 14) });
  }
  const relocations = [];
  for (const section of sections.filter(({ type }) => type === 9)) {
    check(section.entsize === 8 && section.size % 8 === 0 && section.link === symtab.index && section.info < sections.length,
      `${section.name} relocation metadata is invalid`);
    for (let offset = 0; offset < section.size; offset += 8) {
      const at = section.offset + offset, info = bytes.readUInt32LE(at + 4);
      relocations.push({ output: sections[section.info], offset: bytes.readUInt32LE(at), type: info & 0xff, symbol: symbols[info >>> 8] });
    }
  }
  return { bytes, sections, symbols, relocations };
}

function sectionBytes(elf, section) { return boundedSlice(elf.bytes, section.offset, section.size, section.name); }
function validateObject(input, manifest) {
  const elf = parseElf(input, manifest);
  const section = (name) => {
    const matches = elf.sections.filter((entry) => entry.name === name);
    check(matches.length === 1, `${name} is missing or ambiguous`);
    return matches[0];
  };
  for (const fn of manifest.functions) {
    const body = section(`.text.${fn.name}`);
    check(body.type === 1 && body.flags === 6 && body.align === 4 && body.size === fn.size && fn.instructionCount * 4 === fn.size,
      `${fn.name} section metadata differs`);
    check(hash(sectionBytes(elf, body)) === fn.bodyHash, `${fn.name} exact instruction schedule differs`);
    const symbols = elf.symbols.filter(({ name }) => name === fn.name);
    check(symbols.length === 1 && symbols[0].bind === 1 && symbols[0].type === 2 && symbols[0].shndx === body.index &&
      symbols[0].value === 0 && symbols[0].size === fn.size, `${fn.name} symbol metadata differs`);
    check(!elf.relocations.some(({ output }) => output.index === body.index), `${fn.name} unexpectedly contains a relocation`);
  }
  for (const [index, fragment] of manifest.controlFragments.entries()) {
    const address = fragment.address.toString(16).padStart(8, "0");
    const body = section(`.text.__cro_gap_${address}`);
    check(body.type === 1 && body.flags === 6 && body.align === 4 && body.size === fragment.size &&
      fragment.instructionCount * 4 === fragment.size && hash(sectionBytes(elf, body)) === fragment.bodyHash,
    `${fragment.name} exact instruction schedule differs`);
    check(!elf.relocations.some(({ output }) => output.index === body.index), `${fragment.name} contains a relocation`);
    check(!elf.symbols.some(({ type, shndx }) => type === 2 && shndx === body.index),
      `${fragment.name} must not fabricate an STT_FUNC identity`);
    const expectedWords = index === 0
      ? [0xe59f2080, 0xe3510005, 0xe92d4010, 0x379ff101, 0xea000015]
      : [0xe59f105c, 0xea000002, 0xe5820000, 0xea00000a, 0xe5921000, 0xe5801000,
        0xea000007, 0xe59f1044, 0xe5801000, 0xe59f1040, 0xea000002, 0xe59f103c,
        0xe5801000, 0xe59f1038, 0xe5801004, 0xe3a00000, 0xe8bd8010, 0xe59f002c,
        0xe320f000, 0xe59f0028, 0xe321f000, 0xe320f000, 0xe59f0020, 0xe8bd8010];
    check(expectedWords.every((word, wordIndex) => sectionBytes(elf, body).readUInt32LE(wordIndex * 4) === word),
      `${fragment.name} neutral encoding schedule differs`);
  }
  for (const address of manifest.veneerAddresses) {
    const name = `.text.__cro_gap_${address.toString(16).padStart(8, "0")}`, veneer = section(name);
    check(veneer.type === 1 && veneer.flags === 6 && veneer.align === 4 && veneer.size === 4 &&
      sectionBytes(elf, veneer).equals(Buffer.from([0x04, 0xf0, 0x1f, 0xe5])), `${name} is not the canonical ARM import veneer`);
  }
  for (const address of manifest.poolAddresses) {
    const name = `.pool.__cro_pool_${address.toString(16).padStart(8, "0")}`, pool = section(name);
    check(pool.type === 1 && pool.flags === 2 && pool.size === 4, `${name} metadata differs`);
    const identity = `__cro_pool_${address.toString(16).padStart(8, "0")}`;
    check(elf.symbols.filter((symbol) => symbol.name === identity && symbol.bind === 1 && symbol.type === 1 &&
      symbol.shndx === pool.index && symbol.value === 0 && symbol.size === pool.size).length === 1,
    `${name} object identity differs`);
    const rels = elf.relocations.filter(({ output }) => output.index === pool.index);
    check(rels.length === 1 && rels[0].offset === 0 && rels[0].type === 2, `${name} lacks one R_ARM_ABS32 relocation`);
  }
  check(elf.relocations.length === manifest.validation.expectedAuthoredRelocations, "authored relocation total differs");
  const importRelocations = elf.relocations.filter(({ output }) => /^\.pool\.__cro_pool_000000(?:04|0c|14|1c|24|2c)$/u.test(output.name));
  check(importRelocations.length === 6 && importRelocations.every(({ symbol }, index) =>
    symbol?.shndx === 0 && symbol.name === `dll_contest_common_import_${index}`), "neutral import relocation identities differ");
  const selectorRelocation = elf.relocations.find(({ output }) => output.name === ".pool.__cro_pool_00000208");
  check(selectorRelocation?.symbol?.type === 3 && elf.sections[selectorRelocation.symbol.shndx]?.name === ".rodata",
    "selector-table relocation target differs");
  const jumpName = `.pool.__cro_pool_${manifest.jumpTablePoolAddress.toString(16).padStart(8, "0")}`;
  const jumpPool = section(jumpName), jumpRelocations = elf.relocations.filter(({ output }) => output.index === jumpPool.index);
  check(jumpPool.type === 1 && jumpPool.flags === 2 && jumpPool.align === 1 && jumpPool.size === 20,
    "control jump-table pool metadata differs");
  check(elf.symbols.filter((symbol) => symbol.name === "__cro_pool_000002d0" && symbol.bind === 1 && symbol.type === 1 &&
    symbol.shndx === jumpPool.index && symbol.value === 0 && symbol.size === 20).length === 1,
  "control jump-table object identity differs");
  const gap = section(".text.__cro_gap_000002e4");
  const jumpAddends = [0, 8, 0x10, 0x1c, 0x2c];
  check(jumpRelocations.length === 5 && jumpRelocations.every((relocation, index) =>
    relocation.offset === index * 4 && relocation.type === 2 && relocation.symbol?.type === 3 &&
    relocation.symbol.shndx === gap.index && sectionBytes(elf, jumpPool).readUInt32LE(index * 4) === jumpAddends[index]),
  "control jump-table relocation equality class or addends differ");
  const terminalName = `.pool.__cro_pool_${manifest.terminalPoolAddress.toString(16).padStart(8, "0")}`;
  const terminal = section(terminalName), terminalBytes = sectionBytes(elf, terminal);
  check(terminal.type === 1 && terminal.flags === 2 && terminal.align === 1 && terminal.size === 36,
    "terminal control pool metadata differs");
  check(elf.symbols.filter((symbol) => symbol.name === "__cro_pool_00000344" && symbol.bind === 1 && symbol.type === 1 &&
    symbol.shndx === terminal.index && symbol.value === 0 && symbol.size === 36).length === 1,
  "terminal control pool object identity differs");
  const terminalWords = [0, 0, 0x24, 0x24, 0x18, 0x18, 0x30000000, 0x30000026, 0xd8e12c21];
  check(terminalWords.every((word, index) => terminalBytes.readUInt32LE(index * 4) === word),
    "terminal control pool payload differs");
  const terminalRelocations = elf.relocations.filter(({ output }) => output.index === terminal.index);
  const terminalTargets = [".data", terminalName, terminalName, ".rodata", ".rodata"];
  check(terminalRelocations.length === 5 && terminalRelocations.every((relocation, index) =>
    relocation.offset === [0, 8, 12, 16, 20][index] && relocation.type === 2 && relocation.symbol?.type === 3 &&
    elf.sections[relocation.symbol.shndx]?.name === terminalTargets[index]),
  "terminal control pool relocation classes differ");
  const rodata = section(".rodata"), data = section(".data");
  check(rodata.type === 1 && rodata.flags === 2 && rodata.align === 4 && rodata.size === 24, ".rodata metadata differs");
  check([...Array(6).keys()].every((index) => sectionBytes(elf, rodata).readUInt32LE(index * 4) === index + 5),
    "selector values differ");
  check(data.type === 1 && data.flags === 3 && data.align === 4 && data.size === 4 && sectionBytes(elf, data).readUInt32LE(0) === 0,
    "module-global data differs");
  const partition = JSON.parse(fs.readFileSync(PARTITION_PATH, "utf8"));
  const owned = new Set([".rodata", ".data", ".bss", ".cro.module"]);
  for (const range of [...partition.functions.map(({ name }) => ({ sectionName: `.text.${name}` })),
    ...partition.gaps.map(({ address }) => ({ sectionName: `.text.__cro_gap_${address.toString(16).padStart(8, "0")}` })),
    ...partition.pools.map(({ address }) => ({ sectionName: `.pool.__cro_pool_${address.toString(16).padStart(8, "0")}` }))])
    owned.add(range.sectionName);
  check(elf.sections.filter(({ flags, size }) => (flags & 2) && size > 0).every(({ name }) => owned.has(name)),
    "object contains nonempty unowned allocated residue");
  check(partition.functions.reduce((sum, { size }) => sum + size, 0) + partition.gaps.reduce((sum, { size }) => sum + size, 0) +
    partition.pools.reduce((sum, { size }) => sum + size, 0) === partition.textSize,
  "public partition does not account for the complete text image");
  return elf;
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8" });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited ${result.status}: ${result.stderr.trim()}`);
}
function validateImportAliasCanonicalization() {
  const text = { index: 1 };
  const symbols = [...Array(6).keys()].map((index) => ({
    index: index + 10, name: `private-import-${index}`, info: 0x10, shndx: 0
  }));
  const offsets = [0x004, 0x00c, 0x014, 0x01c, 0x024, 0x02c];
  const relocations = offsets.map((offset, index) => ({ output: text, offset, symbol: symbols[index], addend: 0 }));
  const structural = { moduleName: "DllContestCommon", text, symbols, relocations };
  const inventory = { module: "DllContestCommon" };
  const before = relocations.map(({ output, offset, symbol, addend }) => [output.index, offset, symbol.index, addend]);
  const aliases = canonicalizeDllContestCommonImports(structural, inventory);
  check(JSON.stringify([...aliases]) === JSON.stringify(symbols.map((symbol, index) =>
    [symbol.index, `dll_contest_common_import_${index}`])), "canonical import aliases differ");
  check(JSON.stringify(relocations.map(({ output, offset, symbol, addend }) =>
    [output.index, offset, symbol.index, addend])) === JSON.stringify(before),
  "canonical import aliasing changed relocation structure");

  const reject = (fixture, label) => {
    let rejected = false;
    try { canonicalizeDllContestCommonImports(fixture, inventory); } catch { rejected = true; }
    check(rejected, `hostile alias fixture was accepted: ${label}`);
  };
  reject({ ...structural, relocations: relocations.map((relocation, index) =>
    index === 1 ? { ...relocation, symbol: symbols[0] } : relocation) }, "non-bijective equality classes");
  reject({ ...structural, relocations: relocations.map((relocation, index) =>
    index === 2 ? { ...relocation, offset: 0x018 } : relocation) }, "unexpected slot mapping");
  reject({ ...structural, relocations: [...relocations, { output: text, offset: 0x034, symbol: {
    index: 20, name: "private-import-6", info: 0x10, shndx: 0 }, addend: 0 }] }, "extra import class");
  reject({ ...structural, symbols: [...symbols, {
    index: 20, name: "dll_contest_common_import_0", info: 0x10, shndx: 0 }] }, "public alias collision");
}
function selfTest(manifest) {
  validateImportAliasCanonicalization();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "dll-contest-common-01-"));
  try {
    const object = path.join(directory, "module.o");
    const compiler = process.env.ARM_NONE_EABI_GCC || (process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}gcc` : "arm-none-eabi-gcc");
    run(compiler, ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding", "-fno-pic", "-fno-pie",
      "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c", path.join(ROOT, manifest.source), "-o", object]);
    const valid = fs.readFileSync(object), parsed = validateObject(valid, manifest);
    const partition = fs.readFileSync(PARTITION_PATH);
    const canonical = canonicalizeDllContestCommonBaseElf(valid, partition);
    check(canonical.equals(canonicalizeDllContestCommonBaseElf(valid, partition)),
      "canonical base emission is not deterministic");
    validateObject(canonical, manifest);
    const rejectCanonical = (mutate, label) => {
      const copy = Buffer.from(valid); mutate(copy, parsed);
      let rejected = false;
      try { canonicalizeDllContestCommonBaseElf(copy, partition); } catch { rejected = true; }
      check(rejected, `hostile canonical-base fixture was accepted: ${label}`);
    };
    rejectCanonical((bytes, elf) => {
      const section = elf.sections.find(({ name }) => name === ".text.__cro_gap_000002bc");
      bytes.writeUInt32LE(2, section.header + 8);
    }, "control section lost executable ownership");
    rejectCanonical((bytes, elf) => {
      const section = elf.sections.find(({ name }) => name === ".rel.pool.__cro_pool_00000344");
      bytes.writeUInt32LE(4, section.offset);
    }, "terminal relocation moved to the null literal");
    const reject = (mutate, label) => {
      const copy = Buffer.from(valid); mutate(copy, parsed);
      let rejected = false;
      try { validateObject(copy, manifest); } catch { rejected = true; }
      check(rejected, `hostile fixture was accepted: ${label}`);
    };
    reject((bytes, elf) => { const veneer = elf.sections.find(({ name }) => name === ".text.__cro_gap_00000000"); bytes[veneer.offset] ^= 1; },
      "veneer mutation");
    reject((bytes, elf) => { const rodata = elf.sections.find(({ name }) => name === ".rodata"); bytes[rodata.offset] ^= 1; },
      "selector mutation");
    reject((bytes, elf) => { const jump = elf.sections.find(({ name }) => name === ".pool.__cro_pool_000002d0"); bytes[jump.offset + 4] ^= 1; },
      "jump-table addend mutation");
    reject((bytes, elf) => { const body = elf.sections.find(({ name }) => name === ".text.func_00000030"); bytes[body.offset + 8] ^= 1; },
      "function schedule mutation");
    reject((bytes, elf) => { const body = elf.sections.find(({ name }) => name === ".text.func_00000258"); bytes.writeUInt32LE(96, body.header + 20); },
      "function truncation");
    reject((bytes, elf) => { const body = elf.sections.find(({ name }) => name === ".text.__cro_gap_000002bc"); bytes[body.offset] ^= 1; },
      "control prelude mutation");
    reject((bytes, elf) => { const body = elf.sections.find(({ name }) => name === ".text.__cro_gap_000002e4"); bytes[body.offset + 0x44] ^= 1; },
      "diagnostic mutation");
    reject((bytes, elf) => { const pool = elf.sections.find(({ name }) => name === ".pool.__cro_pool_00000344"); bytes[pool.offset + 0x18] ^= 1; },
      "diagnostic scalar mutation");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function parseArguments(argv) {
  const result = { selfTest: false };
  for (let index = 0; index < argv.length; index++) {
    if (argv[index] === "--self-test") { check(!result.selfTest, "--self-test supplied twice"); result.selfTest = true; }
    else if (argv[index] === "--object" && argv[index + 1]) { check(!result.object, "--object supplied twice"); result.object = path.resolve(argv[++index]); }
    else fail("usage: validator [--self-test] [--object FILE]");
  }
  return result;
}

try {
  const options = parseArguments(process.argv.slice(2)), manifest = readManifest();
  validateRepository(manifest);
  if (options.selfTest) selfTest(manifest);
  if (options.object) validateObject(fs.readFileSync(options.object), manifest);
  console.log(`Validated all DllContestCommon code/data: 3 exact functions, 2 non-contiguous control fragments, 9 pools, 17 relocations, and canonical base emission${options.selfTest ? " with hostile fixtures" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
