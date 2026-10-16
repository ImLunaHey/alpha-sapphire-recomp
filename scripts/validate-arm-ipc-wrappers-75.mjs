#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-ipc-wrappers-75.json");
const specPath = join(root, "docs/specs/main/arm_ipc_wrappers_75.md");
const MAX_SECTION_SIZE = 16 * 1024 * 1024;
const EXPECTED_SOURCE_HASH = "3dc6df1e646475226164c631b1b346cd823532640bdab0b341644bede9bcfec9";
const EXPECTED_CONFIG_HASH = "ff20e7c55f0eda01f208e7c20fd4f36f88221081718fecac0e5c72d398ed5ec1";
const EXPECTED_SCHEDULE_HASH = "4cc927a474cbc01cfe2a3abc27aeee62478ca6205e5fda873f96cd5d69717627";
const EXPECTED_TOTAL_BODY = 484;
const EXPECTED_TOTAL_INSNS = 121;
const EXPECTED_TOTAL_ADJACENT = 4;
const EXPECTED_POOL_SLOTS = 771;
const EXPECTED_POOL_CLASSES = 406;
const EXPECTED_GAPS = new Map([
  ["func_0018E8C0", 128],
  ["func_0018ECD4", 184],
]);
const RELOC_NAMES = new Map([[2, "R_ARM_ABS32"], [28, "R_ARM_CALL"], [29, "R_ARM_JUMP24"]]);

function fail(message) {
  throw new Error(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: MAX_SECTION_SIZE, ...options });
  if (result.error || result.status !== 0) {
    const detail = [result.error?.message, result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    fail(`${basename(command)} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout;
}

function findProgram(environmentName, candidates) {
  if (process.env[environmentName]) return process.env[environmentName];
  const crossName = candidates[0].replace("arm-none-eabi-", "");
  const expanded = process.env.CROSS_COMPILE
    ? [`${process.env.CROSS_COMPILE}${crossName}`, ...candidates]
    : candidates;
  for (const candidate of expanded) {
    const probe = spawnSync("sh", ["-c", "command -v -- \"$1\"", "sh", candidate], { encoding: "utf8" });
    if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  }
  const toolName = candidates[0];
  const bundled = join(root, "node_modules", "@xpack-dev-tools", "arm-none-eabi-gcc", ".content", "bin", toolName);
  if (existsSync(bundled)) return bundled;
  if (existsSync("/nix/store")) {
    const search = spawnSync("find", ["/nix/store", "-type", "f", "-path", `*/bin/${toolName}`], {
      encoding: "utf8", maxBuffer: MAX_SECTION_SIZE,
    });
    const matches = search.status === 0 ? search.stdout.trim().split("\n").filter(Boolean) : [];
    const selected = matches.find((path) => path.includes("gcc-arm-embedded-15.2")) ?? matches[0];
    if (selected) return selected;
  }
  fail(`no suitable tool found (set ${environmentName})`);
}

function parseElf(file) {
  const bytes = readFileSync(file);
  check(bytes.length >= 52, `${file}: truncated ELF header`);
  check(bytes.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), `${file}: not ELF`);
  check(bytes[4] === 1 && bytes[5] === 1, `${file}: expected ELF32 little-endian`);
  check(bytes.readUInt16LE(18) === 40, `${file}: expected EM_ARM`);
  const shoff = bytes.readUInt32LE(32);
  const shentsize = bytes.readUInt16LE(46);
  const shnum = bytes.readUInt16LE(48);
  const shstrndx = bytes.readUInt16LE(50);
  check(shentsize >= 40 && shnum > 0 && shstrndx < shnum, `${file}: invalid section table`);
  check(shoff + shentsize * shnum <= bytes.length, `${file}: section table outside file`);

  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const at = shoff + index * shentsize;
    sections.push({
      index,
      nameOffset: bytes.readUInt32LE(at),
      type: bytes.readUInt32LE(at + 4),
      flags: bytes.readUInt32LE(at + 8),
      offset: bytes.readUInt32LE(at + 16),
      size: bytes.readUInt32LE(at + 20),
      link: bytes.readUInt32LE(at + 24),
      info: bytes.readUInt32LE(at + 28),
      align: bytes.readUInt32LE(at + 32),
      entrySize: bytes.readUInt32LE(at + 36),
    });
  }
  const stringAt = (section, offset) => {
    check(section && section.offset + section.size <= bytes.length, `${file}: string table outside file`);
    check(offset < section.size, `${file}: string offset outside table`);
    let end = section.offset + offset;
    while (end < section.offset + section.size && bytes[end] !== 0) end++;
    return bytes.toString("utf8", section.offset + offset, end);
  };
  const shstr = sections[shstrndx];
  for (const section of sections) {
    section.name = stringAt(shstr, section.nameOffset);
    check(section.size <= MAX_SECTION_SIZE, `${file}: section ${section.name} exceeds 16 MiB`);
    if (section.type !== 8) check(section.offset + section.size <= bytes.length, `${file}: section ${section.name} outside file`);
  }

  const symtab = sections.find((section) => section.type === 2);
  check(symtab && symtab.entrySize >= 16 && symtab.link < sections.length, `${file}: missing valid symbol table`);
  const strtab = sections[symtab.link];
  const symbols = [];
  for (let at = symtab.offset; at + 16 <= symtab.offset + symtab.size; at += symtab.entrySize) {
    const info = bytes[at + 12];
    symbols.push({
      index: symbols.length,
      name: stringAt(strtab, bytes.readUInt32LE(at)),
      value: bytes.readUInt32LE(at + 4),
      size: bytes.readUInt32LE(at + 8),
      bind: info >>> 4,
      type: info & 15,
      shndx: bytes.readUInt16LE(at + 14),
    });
  }

  const relocations = [];
  for (const section of sections.filter((candidate) => candidate.type === 9)) {
    check(section.entrySize >= 8 && section.info < sections.length, `${file}: malformed relocation section ${section.name}`);
    for (let at = section.offset; at + 8 <= section.offset + section.size; at += section.entrySize) {
      const info = bytes.readUInt32LE(at + 4);
      const symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length, `${file}: bad relocation symbol index`);
      relocations.push({
        section: sections[section.info].name,
        offset: bytes.readUInt32LE(at),
        type: info & 0xff,
        symbol: symbols[symbolIndex].name,
      });
    }
  }
  return { bytes, sections, symbols, relocations };
}

function sourceInstructionCounts(source, config) {
  const counts = new Map();
  let current = null;
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.replace(/\/\*.*?\*\//g, "").trim();
    const begin = /^BEGIN\s+(\w+)$/.exec(line);
    const end = /^END\s+(\w+)$/.exec(line);
    if (begin) {
      check(current === null, `nested BEGIN at ${begin[1]}`);
      current = begin[1];
      counts.set(current, 0);
    } else if (end) {
      check(current === end[1], `mismatched END ${end[1]}`);
      current = null;
    } else if (current && line && !line.startsWith(".") && !line.endsWith(":")) {
      counts.set(current, counts.get(current) + 1);
    }
  }
  check(current === null, "unterminated function in source schedule");
  check(counts.size === config.functions.length, "source does not contain exactly seven function schedules");
  for (const fn of config.functions) check(counts.get(fn.name) === fn.size / 4, `${fn.name}: source instruction schedule mismatch`);
  return [...counts.values()].reduce((sum, count) => sum + count, 0);
}

function validateConfig(config) {
  check(config.schemaVersion === 1 && config.mode === "arm", "unexpected config schema or mode");
  check(config.normalizedScheduleSha256 === EXPECTED_SCHEDULE_HASH, "normalized schedule hash mismatch");
  check(config.functions.length === 7, "expected exactly seven functions");
  check(config.totalBodySize === EXPECTED_TOTAL_BODY, "expected 484 body bytes");
  check(config.totalAdjacentSize === EXPECTED_TOTAL_ADJACENT, "expected four adjacent bytes");
  check(config.cumulativePoolSlots === EXPECTED_POOL_SLOTS && config.cumulativePoolClasses === EXPECTED_POOL_CLASSES,
    "expected cumulative literal totals 771/406");
  check(config.functions.reduce((sum, fn) => sum + fn.size, 0) === EXPECTED_TOTAL_BODY, "function sizes do not total 484");
  check(config.functions.reduce((sum, fn) => sum + fn.size / 4, 0) === EXPECTED_TOTAL_INSNS, "expected 121 instructions");
  check(JSON.stringify(config.literalIdentities) === JSON.stringify(["ipc_shared_control_owner_72"]), "literal identity mismatch");
  check(JSON.stringify(config.reusedLiteralIdentities) === JSON.stringify(config.literalIdentities), "literal must be reused");
  check(config.newLiteralIdentities.length === 0, "batch must create no literal class");
  for (const fn of config.functions) {
    const adjacent = fn.literals.length * 4;
    const gap = fn.nextGlobalOffset - fn.size - adjacent;
    check(gap === (EXPECTED_GAPS.get(fn.name) ?? 0), `${fn.name}: following-global ownership/gap mismatch`);
  }
  const branchCount = config.functions.reduce((sum, fn) => sum + fn.branches.length, 0);
  check(branchCount === 11, "expected eleven symbolic direct transfers");
  const contract = config.branchIdentityContract;
  check(contract.mode === "arm" && contract.minimumAlignment === 4, "invalid branch mode/alignment contract");
  check(contract.primaryEntries.length === 7 && new Set(contract.primaryEntries).size === 7, "expected seven distinct primary classes");
  check(contract.secondaryEntries.length === 0 && contract.secondaryEntryRelations.length === 0, "secondary entries are forbidden");
  check(contract.classesPairwiseDistinct === true, "primary classes must be pairwise distinct");
  const classified = [...contract.sharedClasses.map((entry) => entry.symbol), ...contract.singletonClasses];
  check(classified.length === 7 && new Set(classified).size === 7,
    "shared and singleton branch classes must partition seven classes");
  check(classified.every((name) => contract.primaryEntries.includes(name)), "branch classification differs from primary entries");
}

function validateObject(file, config, objdump) {
  const elf = parseElf(file);
  const sectionByName = new Map(elf.sections.map((section) => [section.name, section]));
  const batchNames = new Set(config.functions.map((fn) => fn.name));
  const definedBatchFunctions = elf.symbols.filter((symbol) =>
    batchNames.has(symbol.name) && symbol.bind === 1 && symbol.type === 2 && symbol.shndx !== 0);
  check(definedBatchFunctions.length === 7, `${file}: expected exactly seven defined global functions`);

  const expectedRelocations = [];
  for (const fn of config.functions) {
    const section = sectionByName.get(fn.section);
    const adjacent = fn.literals.length * 4;
    check(section && section.type === 1 && (section.flags & 6) === 6, `${file}: missing executable section ${fn.section}`);
    check(section.align >= 4 && section.size === fn.size + adjacent,
      `${file}: ${fn.section} must own only its body${adjacent ? " and literal" : ""}`);
    const symbol = elf.symbols.find((candidate) => candidate.name === fn.name && candidate.bind === 1 && candidate.type === 2);
    check(symbol && elf.sections[symbol.shndx]?.name === fn.section, `${file}: bad function symbol ${fn.name}`);
    check(symbol.value === 0 && symbol.size === fn.size, `${file}: bad boundary/size for ${fn.name}`);
    for (const branch of fn.branches) expectedRelocations.push({
      section: fn.section, offset: branch.offset, type: branch.kind, symbol: branch.symbol,
    });
    for (const literal of fn.literals) expectedRelocations.push({
      section: fn.section, offset: literal.offset, type: "R_ARM_ABS32", symbol: literal.symbol,
    });
  }
  const relevantRelocations = elf.relocations
    .filter((relocation) => config.functions.some((fn) => fn.section === relocation.section))
    .map((relocation) => ({ ...relocation, type: RELOC_NAMES.get(relocation.type) ?? `type-${relocation.type}` }));
  const key = (relocation) => `${relocation.section}:${relocation.offset}:${relocation.type}:${relocation.symbol}`;
  check(JSON.stringify(relevantRelocations.map(key).sort()) === JSON.stringify(expectedRelocations.map(key).sort()),
    `${file}: symbolic relocation schedule mismatch`);
  const directRelocations = relevantRelocations.filter((relocation) =>
    relocation.type === "R_ARM_CALL" || relocation.type === "R_ARM_JUMP24");
  check(directRelocations.length === 11, `${file}: expected eleven direct-transfer relocations`);
  check(JSON.stringify([...new Set(directRelocations.map((relocation) => relocation.symbol))].sort()) ===
      JSON.stringify([...config.branchIdentityContract.primaryEntries].sort()),
    `${file}: direct transfers must form exactly seven primary classes`);
  const literalRelocations = relevantRelocations.filter((relocation) => relocation.type === "R_ARM_ABS32");
  check(literalRelocations.length === 1 && literalRelocations[0].symbol === "ipc_shared_control_owner_72",
    `${file}: expected one reused literal relocation`);
  const literalSymbol = elf.symbols.find((symbol) => symbol.name === "ipc_shared_control_owner_72");
  check(literalSymbol && literalSymbol.shndx === 0, `${file}: reused literal identity must remain externally owned`);

  let disassembledInstructions = 0;
  for (const fn of config.functions) {
    const output = run(objdump, ["-d", "--section", fn.section, file]);
    const instructionLines = output.split(/\r?\n/).filter((line) =>
      /^\s*[0-9a-fA-F]+:\s+(?:[0-9a-fA-F]{8}|(?:[0-9a-fA-F]{2}\s+){4})\s/.test(line));
    check(instructionLines.length === (fn.size + fn.literals.length * 4) / 4,
      `${file}: disassembly word count mismatch for ${fn.name}`);
    disassembledInstructions += fn.size / 4;
  }
  check(disassembledInstructions === EXPECTED_TOTAL_INSNS, `${file}: expected 121 disassembled body instructions`);
  return elf;
}

function assemble(assembler, source, output) {
  run(assembler, ["-march=armv6k", "-mfpu=vfpv2", "-o", output, source]);
}

function compareBatchSections(left, right, config) {
  for (const fn of config.functions) {
    const a = left.sections.find((section) => section.name === fn.section);
    const b = right.sections.find((section) => section.name === fn.section);
    check(a && b, `foreign-context comparison missing ${fn.section}`);
    check(left.bytes.subarray(a.offset, a.offset + a.size).equals(right.bytes.subarray(b.offset, b.offset + b.size)),
      `foreign/hostile context changed ${fn.section}`);
  }
}

function rejectHostileMutation(canonical, config) {
  const target = canonical.sections.find((section) => section.name === config.functions[0].section);
  check(target, "hostile self-test cannot find its owned section");
  const bytes = Buffer.from(canonical.bytes);
  bytes[target.offset] ^= 1;
  let rejected = false;
  try {
    compareBatchSections(canonical, { ...canonical, bytes }, config);
  } catch {
    rejected = true;
  }
  check(rejected, "hostile owned-section mutation was accepted");
}

const configBytes = readFileSync(configPath);
check(sha256(configBytes) === EXPECTED_CONFIG_HASH, "batch config SHA-256 mismatch");
const config = JSON.parse(configBytes.toString("utf8"));
validateConfig(config);
const sourcePath = join(root, config.source);
const sourceBytes = readFileSync(sourcePath);
const source = sourceBytes.toString("utf8");
const sourceHash = sha256(sourceBytes);
check(sourceHash === EXPECTED_SOURCE_HASH, "implementation source SHA-256 mismatch");
check(sourceHash === config.sourceSha256, "implementation source/config SHA-256 mismatch");
const spec = readFileSync(specPath, "utf8");
check(spec.includes(`Implementation source SHA-256: \`${sourceHash}\``), "implementation source/spec SHA-256 mismatch");
check(sourceInstructionCounts(source, config) === EXPECTED_TOTAL_INSNS, "source schedule must contain 121 instructions");

const assembler = findProgram("ARM_AS", ["arm-none-eabi-as", "arm-linux-gnueabi-as", "arm-linux-gnueabihf-as"]);
const objdump = findProgram("ARM_OBJDUMP", [
  assembler.replace(/as$/, "objdump"),
  "arm-none-eabi-objdump", "arm-linux-gnueabi-objdump", "arm-linux-gnueabihf-objdump",
]);
const temporary = mkdtempSync(join(tmpdir(), "arm-ipc-wrappers-75-"));
try {
  const standaloneObject = join(temporary, "standalone.o");
  assemble(assembler, sourcePath, standaloneObject);
  const standalone = validateObject(standaloneObject, config, objdump);

  const hostileSource = join(temporary, "foreign-hostile.S");
  const hostileObject = join(temporary, "foreign-hostile.o");
  const includePath = sourcePath.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  writeFileSync(hostileSource,
    `.syntax unified\n.thumb\n.section .foreign_before,"ax",%progbits\n.byte 0x75\n.include "${includePath}"\n.section .foreign_after,"a",%progbits\n.byte 0x57\n`);
  assemble(assembler, hostileSource, hostileObject);
  const hostile = validateObject(hostileObject, config, objdump);
  compareBatchSections(standalone, hostile, config);
  rejectHostileMutation(standalone, config);

  const supplied = process.argv[2];
  check(process.argv.length <= 3, "usage: validate-arm-ipc-wrappers-75.mjs [object-file]");
  if (supplied) validateObject(resolve(supplied), config, objdump);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

console.log("arm IPC wrappers 75 validation passed: 7 functions, 484 bytes, 121 instructions, 11 transfers, 771/406 literals");
