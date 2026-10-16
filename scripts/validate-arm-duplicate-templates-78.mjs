#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const configPath = join(root, "config/arm-duplicate-templates-78.json");
const expectedSource = "src/main/arm_duplicate_templates_78.S";
const sourcePath = join(root, expectedSource);
const config = JSON.parse(readFileSync(configPath, "utf8"));
const fail = message => { throw new Error(message); };
const check = (condition, message) => { if (!condition) fail(message); };
const sha256 = data => createHash("sha256").update(data).digest("hex");

const expectedCanonicalHashes = {
  instructionSchedule: "66d7c330dcdd11ec27012822ba03f61bfde073978d020bcc3b59306e0c53ccde",
  localTransferSchedule: "db3e7034c226f5288958a9570c19c56c5f5d68c168db3d94957df68221290ce2",
  relocationSchedule: "916322f1d5212fdd63ecf3d98056629caf946cd07404dfb28740c9ec5f25a3b7",
  literalIdentitySchedule: "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
};

const expectedFunctionOrder = [
  "func_001122EC", "func_0011ECB0", "func_0011ABA0", "func_0043B6C4", "func_001344CC", "func_0017CAC4",
  "func_001426C0", "func_00158424", "func_00158444", "func_00158464", "func_00149B94", "func_002056A8",
  "func_004D2508", "func_004D2EA4", "func_00152EA8", "func_004C0294", "func_00333BDC", "func_003354C8",
  "func_00150168", "func_00169770", "func_00176670", "func_0035629C", "func_002AEC04", "func_002AEE08",
];
const expectedBoundaries = [
  "func_00112310:36", "func_0011ECD4:36", "func_0011AF1C:892", "func_0043B7E0:284",
  "func_001344EC:32", "func_0017CB20:92", "func_001427B8:248", "func_00158444:32",
  "func_00158464:32", "func_00158484:32", "func_00149BA8:20", "func_00205870:456",
  "func_004D26FC:500", "func_004D31FC:856", "func_00152EC4:28", "func_004C02B0:28",
  "func_00333BF8:28", "func_003354E4:28", "func_0015017C:20", "func_00169784:20",
  "func_00176684:20", "func_003562DC:64", "func_002AEC48:68", "func_002AEE64:92",
];
const expectedLocalOffsets = ["", "", "28,32", "28,32", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "16", "16", "16", "16", "", ""];
const expectedTransfers = [
  "8:R_ARM_CALL:bl:func_0011EC38|24:R_ARM_CALL:bl:arm_duplicate_templates_78_secondary_0010FC60",
  "8:R_ARM_CALL:bl:func_0011EC38|24:R_ARM_CALL:bl:func_00125D3C",
  "4:R_ARM_CALL:bl:func_0011A6B4|16:R_ARM_CALL:bl:func_00125F70",
  "4:R_ARM_CALL:bl:func_00200ABC|16:R_ARM_CALL:bl:func_00200BA0",
  "20:R_ARM_CALL:bl:func_0012FFC8", "20:R_ARM_CALL:bl:func_0016092C",
  "20:R_ARM_CALL:bl:func_00148720", "20:R_ARM_CALL:bl:func_00164D2C",
  "20:R_ARM_CALL:bl:func_00164914", "20:R_ARM_CALL:bl:func_00164A54",
  "8:R_ARM_CALL:bl:func_00165F58", "8:R_ARM_CALL:bl:func_00204B04",
  "8:R_ARM_CALL:bl:func_00152F08", "8:R_ARM_CALL:bl:func_004D22DC",
  "16:R_ARM_CALL:bl:func_0016B220", "16:R_ARM_CALL:bl:func_004BF8D0",
  "8:R_ARM_CALL:bl:func_00124150", "8:R_ARM_CALL:bl:func_00124150",
  "12:R_ARM_JUMP24:b:arm_duplicate_templates_78_secondary_00161478",
  "12:R_ARM_JUMP24:b:arm_duplicate_templates_78_secondary_00171C4C",
  "12:R_ARM_JUMP24:b:func_001003E0", "12:R_ARM_JUMP24:b:func_00371CF4",
  "8:R_ARM_CALL:bl:func_0052B610", "8:R_ARM_CALL:bl:func_0052B610",
];

const templateWords = {
  query_then_notify: "e92d4070 e1a04000 ebfffffe e1a05000 e1a01000 e1a00004 ebfffffe e1a00005 e8bd8070",
  any_service_ready: "e92d4010 ebfffffe e3500000 1a000002 ebfffffe e3500000 0a000000 e3a00001 e8bd8010",
  forward_vfp4: "e52de004 e24dd014 e28dc018 ec9c0a04 ec8d0a04 ebfffffe e28dd014 e49df004",
  forward_words3: "e92d4030 e24dd00c e28de018 e89e1030 e88d1030 ebfffffe e28dd00c e8bd8030",
  forward_words4: "e92d4070 e24dd010 e28de020 e89e1070 e88d1070 ebfffffe e28dd010 e8bd8070",
  call_preserve_argument: "e92d4010 e1a04000 ebfffffe e1a00004 e8bd8010",
  query_member_byte: "e92d4010 e590000c ebfffffe e20000ff e8bd8010",
  read_nested_word: "e5900004 e1a00000 e92d4010 e590003c ebfffffe e5900000 e8bd8010",
  invert_embedded_test: "e280000c e92d4010 ebfffffe e3500000 13a00000 03a00001 e8bd8010",
  optional_member_tail: "e5900138 e3500000 0a000000 eafffffe e12fff1e",
  optional_word_tail: "e5900004 e3500000 0a000000 eafffffe e12fff1e",
  call_stack_result: "e92d4008 e1a0100d ebfffffe e59d0000 e8bd8008",
};
for (const [name, words] of Object.entries(templateWords)) {
  templateWords[name] = words.split(" ").map(word => Number.parseInt(word, 16) >>> 0);
}

function validateConfigurationAndSource() {
  check(config.version === 1, "configuration version must be 1");
  check(config.source === expectedSource, "configuration source path is not canonical");
  check(config.mode === "arm", "configuration mode must be ARM");
  check(config.expectedBodyBytes === 648, "expected body-byte total changed");
  check(config.expectedInstructionCount === 162, "expected instruction total changed");
  check(config.sourceSha256 !== "PENDING_IMPLEMENTATION", "source hash is still pending");
  check(sha256(readFileSync(sourcePath)) === config.sourceSha256, "source SHA-256 mismatch");
  check(config.canonicalHashes?.algorithm === "sha256", "canonical hash algorithm changed");
  check(config.canonicalHashes?.lineTermination === "LF", "canonical schedule line termination changed");
  for (const [key, digest] of Object.entries(expectedCanonicalHashes)) {
    check(config.canonicalHashes[key] === digest, `${key} digest mismatch`);
  }
  check(sha256("\n") === config.canonicalHashes.literalIdentitySchedule,
    "empty literal schedule is not the canonical LF record stream");

  const functions = config.functions;
  const templates = config.templates;
  check(Array.isArray(functions) && functions.length === 24, "exactly 24 functions are required");
  check(Object.keys(templates).length === 12, "exactly 12 templates are required");
  const names = functions.map(f => f.name);
  check(JSON.stringify(names) === JSON.stringify(expectedFunctionOrder), "canonical function order changed");
  check(new Set(names).size === names.length, "function names must be unique");
  let bodyBytes = 0, instructions = 0, transfers = 0, calls = 0, tails = 0, localBranches = 0;
  const templateCounts = new Map();
  const destinations = [];
  for (const [functionIndex, fn] of functions.entries()) {
    const template = templates[fn.template];
    check(template && templateWords[fn.template], `${fn.name}: unknown template`);
    check(templateWords[fn.template].length === template.instructionCount,
      `${fn.template}: instruction contract disagrees with canonical body`);
    check(template.bodySize === template.instructionCount * 4,
      `${fn.template}: body size is not four bytes per ARM instruction`);
    check(fn.nextGlobalOffset >= template.bodySize,
      `${fn.name}: next global overlaps the owned body`);
    check(`${fn.nextGlobal}:${fn.nextGlobalOffset}` === expectedBoundaries[functionIndex],
      `${fn.name}: canonical next-global boundary changed`);
    const address = Number.parseInt(fn.name.slice(5), 16);
    const nextAddress = Number.parseInt(fn.nextGlobal.slice(5), 16);
    check(nextAddress - address === fn.nextGlobalOffset,
      `${fn.name}: next-global boundary relation is inconsistent`);
    check(fn.internalLabelOffsets.length === template.internalLabels,
      `${fn.name}: internal-label count mismatch`);
    check(fn.internalLabelOffsets.join(",") === expectedLocalOffsets[functionIndex],
      `${fn.name}: local-label schedule changed`);
    check(fn.directTransfers.length === template.directTransfers,
      `${fn.name}: direct-transfer count mismatch`);
    check(fn.literals.length === 0, `${fn.name}: literals are forbidden`);
    for (const offset of fn.internalLabelOffsets) {
      check(offset >= 0 && offset < template.bodySize && offset % 4 === 0,
        `${fn.name}: invalid internal-label offset ${offset}`);
    }
    for (const transfer of fn.directTransfers) {
      check(transfer.offset >= 0 && transfer.offset < template.bodySize && transfer.offset % 4 === 0,
        `${fn.name}: invalid transfer offset ${transfer.offset}`);
      check(transfer.kind === (transfer.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24"),
        `${fn.name}: transfer kind/mnemonic mismatch`);
      check(transfer.mnemonic === "bl" || transfer.mnemonic === "b",
        `${fn.name}: unsupported transfer mnemonic`);
      transfers++;
      transfer.mnemonic === "bl" ? calls++ : tails++;
      destinations.push(transfer.symbol);
    }
    check(fn.directTransfers.map(transfer => `${transfer.offset}:${transfer.kind}:${transfer.mnemonic}:${transfer.symbol}`).join("|") === expectedTransfers[functionIndex],
      `${fn.name}: canonical relocation schedule changed`);
    for (const key of ["indirectCalls", "indirectTailTransfers", "conditionalReturns", "addressReferences", "poolSlots"])
      check(template[key] === 0, `${fn.template}: ${key} must remain zero`);
    bodyBytes += template.bodySize;
    instructions += template.instructionCount;
    localBranches += template.internalLabels;
    templateCounts.set(fn.template, (templateCounts.get(fn.template) ?? 0) + 1);
  }
  check(bodyBytes === 648 && instructions === 162, "aggregate body schedule changed");
  check(transfers === 28 && calls === 24 && tails === 4, "direct-transfer totals changed");
  check(localBranches === 8, "local-branch total changed");
  for (const [name, template] of Object.entries(templates)) {
    check(template.count === 2 && templateCounts.get(name) === 2,
      `${name}: template must have exactly two functions`);
  }
  const contract = config.branchIdentityContract;
  check(contract.mode === "arm" && contract.minimumAlignment === 4,
    "branch identity alignment/mode contract changed");
  check(contract.primaryEntries.length === 22 && contract.secondaryEntries.length === 3,
    "destination class partition must contain 22 primary and 3 secondary entries");
  const classes = [...contract.primaryEntries, ...contract.secondaryEntries];
  check(classes.length === 25 && new Set(classes).size === 25 && contract.classesPairwiseDistinct === true,
    "destination classes must be 25 pairwise-distinct symbols");
  check(destinations.every(symbol => classes.includes(symbol)), "transfer refers outside destination classes");
  const counts = new Map(destinations.map(symbol => [symbol, destinations.filter(x => x === symbol).length]));
  check(contract.sharedClasses.length === 3 && contract.singletonClasses.length === 22,
    "shared/singleton destination partition changed");
  for (const entry of contract.sharedClasses) check(counts.get(entry.symbol) === entry.siteCount && entry.siteCount === 2,
    `${entry.symbol}: shared class site count mismatch`);
  for (const symbol of contract.singletonClasses) check(counts.get(symbol) === 1,
    `${symbol}: singleton class site count mismatch`);
  check(contract.secondaryEntryRelations.length === 3, "three secondary relations are required");
  for (const relation of contract.secondaryEntryRelations) {
    check(contract.secondaryEntries.includes(relation.symbol), `${relation.symbol}: undeclared secondary relation`);
    const secondary = Number.parseInt(relation.symbol.slice(-8), 16);
    const owner = Number.parseInt(relation.owner.slice(5), 16);
    const next = Number.parseInt(relation.nextGlobal.slice(5), 16);
    check(secondary - owner === relation.ownerOffset, `${relation.symbol}: owner relation mismatch`);
    check(next - secondary === relation.bytesBeforeNextGlobal, `${relation.symbol}: next-global relation mismatch`);
    check((secondary & 3) === 0, `${relation.symbol}: secondary entry is not ARM aligned`);
  }
  const literal = config.literalIdentityContract;
  check(Object.keys(config.literalIdentities).length === 0 && config.reusedLiteralIdentities.length === 0 &&
    config.newLiteralIdentities.length === 0, "literal identity sets must be empty");
  check(literal.siteCount === 0 && literal.classCount === 0 && literal.newClassCount === 0 &&
    literal.reusedClassCount === 0 && literal.reusedClassesPhysicallyVerified === true,
    "zero-site literal identity contract changed");

  const text = readFileSync(sourcePath, "utf8");
  check(!text.includes("\r"), "source must use LF line endings");
  check(!/^\s*\.(?:byte|2byte|4byte|word|long|quad|incbin|include|ltorg|pool)\b/im.test(text),
    "source contains a forbidden data/literal/include directive");
}

function parseElf(path) {
  const b = readFileSync(path);
  check(b.length >= 52 && b.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), "not an ELF file");
  check(b[4] === 1 && b[5] === 1 && b[6] === 1, "object must be ELF32 little-endian current-version");
  check(b.readUInt16LE(16) === 1 && b.readUInt16LE(18) === 40, "object must be relocatable ARM ELF");
  const shoff = b.readUInt32LE(32), shentsize = b.readUInt16LE(46), shnum = b.readUInt16LE(48), shstrndx = b.readUInt16LE(50);
  check(shentsize >= 40 && shnum > 0 && shoff + shentsize * shnum <= b.length, "invalid section table");
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const p = shoff + index * shentsize;
    sections.push({ index, nameOffset: b.readUInt32LE(p), type: b.readUInt32LE(p + 4), flags: b.readUInt32LE(p + 8),
      address: b.readUInt32LE(p + 12), offset: b.readUInt32LE(p + 16), size: b.readUInt32LE(p + 20),
      link: b.readUInt32LE(p + 24), info: b.readUInt32LE(p + 28), align: b.readUInt32LE(p + 32), entrySize: b.readUInt32LE(p + 36) });
  }
  const stringAt = (table, offset) => {
    check(offset < table.length, "string-table offset out of range");
    const end = table.indexOf(0, offset);
    check(end !== -1, "unterminated ELF string");
    return table.toString("utf8", offset, end);
  };
  const shstr = sections[shstrndx];
  check(shstr && shstr.offset + shstr.size <= b.length, "invalid section-name table");
  const sectionNames = b.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) {
    section.name = stringAt(sectionNames, section.nameOffset);
    check(section.type === 8 || section.offset + section.size <= b.length, `${section.name}: section exceeds file`);
    section.data = section.type === 8 ? Buffer.alloc(0) : b.subarray(section.offset, section.offset + section.size);
  }
  const symtab = sections.find(section => section.type === 2);
  check(symtab && symtab.entrySize === 16 && symtab.size % 16 === 0, "one valid ELF32 symbol table is required");
  check(sections.filter(section => section.type === 2).length === 1, "multiple symbol tables are forbidden");
  const strtab = sections[symtab.link];
  check(strtab?.type === 3, "symbol string table is invalid");
  const symbols = [];
  for (let p = 0; p < symtab.size; p += 16) {
    const q = symtab.offset + p;
    symbols.push({ index: p / 16, name: stringAt(strtab.data, b.readUInt32LE(q)), value: b.readUInt32LE(q + 4),
      size: b.readUInt32LE(q + 8), info: b[q + 12], other: b[q + 13], sectionIndex: b.readUInt16LE(q + 14) });
  }
  return { b, sections, symbols };
}

function validateObject(path) {
  const elf = parseElf(path);
  const expectedNames = new Set(config.functions.map(fn => fn.name));
  const expectedSections = new Set(config.functions.map(fn => `.text.${fn.name}`));
  const destinationNames = new Set([...config.branchIdentityContract.primaryEntries, ...config.branchIdentityContract.secondaryEntries]);
  const symbolByIndex = new Map(elf.symbols.map(symbol => [symbol.index, symbol]));
  let totalBytes = 0, totalInstructions = 0, totalRelocations = 0, returnSites = 0;
  const seenUndefined = new Set();
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    const matchingSections = elf.sections.filter(candidate => candidate.name === `.text.${fn.name}`);
    check(matchingSections.length === 1, `${fn.name}: missing or conflicting function section`);
    const section = matchingSections[0];
    check(section.type === 1 && section.flags === 6 && section.align === 4 && section.address === 0,
      `${fn.name}: section type/flags/alignment/address mismatch`);
    check(section.size === template.bodySize && section.size <= 16 * 1024 * 1024,
      `${fn.name}: section size mismatch or disassembly ceiling exceeded`);
    const matchingSymbols = elf.symbols.filter(candidate => candidate.name === fn.name && candidate.sectionIndex === section.index);
    check(matchingSymbols.length === 1, `${fn.name}: missing or conflicting function symbol`);
    const symbol = matchingSymbols[0];
    check(symbol && (symbol.info >> 4) === 1 && (symbol.info & 15) === 2 && symbol.other === 0 &&
      symbol.value === 0 && symbol.size === template.bodySize,
      `${fn.name}: global function symbol boundary contract mismatch`);
    const words = templateWords[fn.template];
    for (let offset = 0; offset < section.size; offset += 4) {
      const actual = section.data.readUInt32LE(offset) >>> 0;
      check(actual === words[offset / 4], `${fn.name}+${offset}: instruction encoding/schedule mismatch`);
    }
    const relocSections = elf.sections.filter(candidate => (candidate.type === 9 || candidate.type === 4) && candidate.info === section.index);
    check(relocSections.length === 1 && relocSections[0].type === 9, `${fn.name}: exactly one REL relocation section is required`);
    const rel = relocSections[0];
    check(rel.entrySize === 8 && rel.size === fn.directTransfers.length * 8 && rel.link === elf.sections.find(s => s.type === 2).index,
      `${fn.name}: relocation-section structure mismatch`);
    const actualRelocations = [];
    for (let p = 0; p < rel.size; p += 8) {
      const offset = rel.data.readUInt32LE(p), info = rel.data.readUInt32LE(p + 4);
      const type = info & 0xff, target = symbolByIndex.get(info >>> 8);
      check(target, `${fn.name}: relocation has invalid symbol index`);
      actualRelocations.push({ offset, kind: type === 28 ? "R_ARM_CALL" : type === 29 ? "R_ARM_JUMP24" : `ARM_${type}`, symbol: target.name });
      check(destinationNames.has(target.name) && (target.info >> 4) === 1 &&
        (target.sectionIndex === 0 ? target.value === 0 && (target.info & 15) === 0 : (target.info & 15) === 2),
        `${fn.name}: branch destination must remain a global symbolic entry`);
      seenUndefined.add(target.name);
    }
    for (let index = 0; index < fn.directTransfers.length; index++) {
      const expected = fn.directTransfers[index], actual = actualRelocations[index];
      check(actual && actual.offset === expected.offset && actual.kind === expected.kind && actual.symbol === expected.symbol,
        `${fn.name}: relocation ${index} schedule mismatch`);
    }
    totalBytes += section.size;
    totalInstructions += section.size / 4;
    totalRelocations += actualRelocations.length;
    returnSites += fn.template.startsWith("optional_") ? 1 : 1;
  }
  check(seenUndefined.size === 25 && [...seenUndefined].every(name => destinationNames.has(name)),
    "undefined destination-symbol set differs from the 25 identity classes");
  check(totalBytes === 648 && totalInstructions === 162 && totalRelocations === 28 && returnSites === 24,
    "object aggregate totals changed");
  return elf.sections.filter(section => expectedSections.has(section.name)).map(section => section.name);
}

function executable(name, environmentName) {
  const fromEnvironment = process.env[environmentName];
  if (fromEnvironment) return fromEnvironment;
  const direct = spawnSync("sh", ["-c", `command -v ${name}`], { encoding: "utf8" });
  if (direct.status === 0 && direct.stdout.trim()) return direct.stdout.trim();
  if (existsSync("/nix/store")) {
    const matches = readdirSync("/nix/store").filter(entry =>
      (entry.includes("gcc-arm-embedded") || entry.includes("arm-none-eabi-binutils")) &&
      existsSync(join("/nix/store", entry, "bin", name))).sort().reverse();
    if (matches.length) return join("/nix/store", matches[0], "bin", name);
  }
  fail(`cannot find ${name}; set ${environmentName}`);
}

function run(command, arguments_, label) {
  const result = spawnSync(command, arguments_, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (result.error || result.status !== 0) fail(`${label} failed: ${result.error?.message ?? result.stderr ?? result.stdout}`.trim());
  return result.stdout;
}

function parseArguments() {
  const args = process.argv.slice(2);
  if (args.length === 0) return null;
  if (args.length === 1 && !args[0].startsWith("-")) return resolve(args[0]);
  if (args.length === 2 && args[0] === "--object") return resolve(args[1]);
  fail(`usage: ${basename(process.argv[1])} [--object] [object.o]`);
}

let temporary;
try {
  validateConfigurationAndSource();
  let objectPath = parseArguments();
  if (!objectPath) {
    temporary = mkdtempSync(join(tmpdir(), "arm-duplicate-templates-78-"));
    objectPath = join(temporary, "arm_duplicate_templates_78.o");
    run(executable("arm-none-eabi-as", "ARM_NONE_EABI_AS"), ["-o", objectPath, sourcePath], "assembly");
  }
  check(existsSync(objectPath), `object does not exist: ${objectPath}`);
  const sections = validateObject(objectPath);
  const objdump = executable("arm-none-eabi-objdump", "ARM_NONE_EABI_OBJDUMP");
  for (const section of sections) {
    const output = run(objdump, ["-d", "-j", section, objectPath], `disassembly of ${section}`);
    check(output.includes(`Disassembly of section ${section}:`), `${section}: disassembler did not emit the requested section`);
  }
  console.log("arm duplicate templates 78: validated 24 functions, 648 bytes, 162 instructions, 28 direct transfers, 8 local branches, 24 returns, and 25 destination classes");
} catch (error) {
  console.error(`arm duplicate templates 78: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
