#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_FILE_SIZE = 64 * 1024 * 1024;
const MAX_EXEC_SIZE = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCATIONS = 1_000_000;
const EXPECTED_INSTRUCTIONS = 16;
const EXPECTED_MEMORY_OPERATIONS = 10;
const EXPECTED_RETURNS = 4;
const EXPECTED_RELOCATIONS = 4;
const CONTRACT = Object.freeze({
  sourceSha256: "24d67594c923e7f4f89785677c6476034e6a411647258de4a3123208abad1b66",
  instructionScheduleSha256: "b9b1d0eadc506d2b3e8ba5f93ccadf1c0aa785f9ad9f8495d0cdddb6d4f56ffe",
  branchScheduleSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  returnScheduleSha256: "e969b87ead54a26ce3e1cd501eff68295ff949b3fea8b89f11129399228d0a57",
  pcRelativeScheduleSha256: "50f72f2bafb1eee9223ddbfdb97ffbd7557c2519408eeb56886e181422c33750",
  relocationScheduleSha256: "51b4aca4ed9093f661ca679be2c4216d97f21169b8448b106dbbab4c7c2ca699",
  names: ["func_00109724", "func_00136BFC", "func_001D2C7C", "func_0032F1B0"],
  symbols: [
    "global_state_02", "runtime_float_zero_38",
    "runtime_default_pair_95", "runtime_indexed_word_table_95",
  ],
});
const KNOWN_TOOL_PREFIX = "/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-runtime-helpers-95.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expected = new Map(config.functions.map((fn) => [fn.name, fn]));

function fail(message) { throw new Error(message); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function usage() { return "usage: validate-arm-runtime-helpers-95.mjs [source|SOURCE|OBJECT|--source [SOURCE]|--object OBJECT|--self-test]"; }

function parseArguments(argv) {
  if (argv.length === 1 && argv[0] === "--self-test") return { kind: "source", path: join(root, config.source), selfTest: true };
  if (argv.length === 0 || (argv.length === 1 && argv[0] === "source")) return { kind: "source", path: join(root, config.source) };
  if (argv[0] === "--object") {
    if (argv.length !== 2) fail(usage());
    return { kind: "object", path: resolve(argv[1]) };
  }
  if (argv[0] === "--source") {
    if (argv.length > 2) fail(usage());
    return { kind: "source", path: argv[1] ? resolve(argv[1]) : join(root, config.source) };
  }
  if (argv.length !== 1 || argv[0].startsWith("-")) fail(usage());
  const path = resolve(argv[0]);
  let header;
  try {
    if (statSync(path).size > MAX_FILE_SIZE) fail("input exceeds the 64 MiB limit");
    header = readFileSync(path).subarray(0, 4);
  } catch (error) { fail(`cannot read input: ${error.message}`); }
  return { kind: header.equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) ? "object" : "source", path };
}

function boundedFile(path, label) {
  const size = statSync(path).size;
  if (size > MAX_FILE_SIZE) fail(`${label} exceeds the 64 MiB limit`);
  return readFileSync(path);
}

function commandCandidates(kind) {
  const sdk = process.env.DEVKITARM;
  const cross = process.env.CROSS_COMPILE;
  const variable = process.env[`ARM_${kind.toUpperCase()}`] || process.env[`ARM_NONE_EABI_${kind.toUpperCase()}`];
  return [variable, cross && `${cross}${kind}`, `${KNOWN_TOOL_PREFIX}${kind}`, sdk && join(sdk, `bin/arm-none-eabi-${kind}`),
    `arm-none-eabi-${kind}`, `arm-linux-gnueabihf-${kind}`, kind === "objdump" && "objdump"].filter(Boolean);
}

function runFirst(candidates, args, label, maxBuffer = 1024 * 1024) {
  const errors = [];
  for (const command of [...new Set(candidates)]) {
    const result = spawnSync(command, args, { encoding: "utf8", maxBuffer, timeout: 30000 });
    if (result.error?.code === "ENOENT") continue;
    if (!result.error && result.status === 0) return result.stdout;
    errors.push(`${command}: ${result.error?.message || result.stderr?.trim() || `exit status ${result.status}`}`);
  }
  fail(`${label} failed${errors.length ? ` (${errors.join("; ")})` : ": no suitable tool found"}`);
}

function assemble(sourcePath, objectPath) {
  const source = boundedFile(sourcePath, "source");
  if (sha256(source) !== config.sourceSha256) fail("source SHA-256 does not match the specification");
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath], "assembly");
}

function checkedRange(offset, size, limit, label) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > limit || size > limit - offset) {
    fail(`${label} is outside the file`);
  }
}

function cString(table, offset, label) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= table.length) fail(`${label} has an invalid string offset`);
  const end = table.indexOf(0, offset);
  if (end < 0) fail(`${label} has an unterminated string`);
  return table.toString("utf8", offset, end);
}

function parseElf(data) {
  if (data.length < 52 || !data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))) fail("input is not an ELF file");
  if (data[4] !== 1 || data[5] !== 1 || data[6] !== 1) fail("expected a 32-bit little-endian ELF object");
  if (data.readUInt16LE(16) !== 1 || data.readUInt16LE(18) !== 40) fail("expected a relocatable ARM ELF object");
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  let shnum = data.readUInt16LE(48);
  let shstrndx = data.readUInt16LE(50);
  if (shentsize < 40 || shoff === 0) fail("ELF section table is missing or malformed");
  checkedRange(shoff, shentsize, data.length, "section header zero");
  if (shnum === 0) shnum = data.readUInt32LE(shoff + 20);
  if (shstrndx === 0xffff) shstrndx = data.readUInt32LE(shoff + 24);
  if (shnum < 1 || shnum > MAX_SECTIONS) fail(`ELF section count must be between 1 and ${MAX_SECTIONS}`);
  checkedRange(shoff, shentsize * shnum, data.length, "section header table");
  if (shstrndx >= shnum) fail("invalid section-name string-table index");
  const sections = [];
  let execSize = 0;
  for (let index = 0; index < shnum; index++) {
    const at = shoff + index * shentsize;
    const section = { index, nameOffset: data.readUInt32LE(at), type: data.readUInt32LE(at + 4), flags: data.readUInt32LE(at + 8),
      addr: data.readUInt32LE(at + 12), offset: data.readUInt32LE(at + 16), size: data.readUInt32LE(at + 20),
      link: data.readUInt32LE(at + 24), info: data.readUInt32LE(at + 28), align: data.readUInt32LE(at + 32), entsize: data.readUInt32LE(at + 36) };
    if (section.type !== 8) checkedRange(section.offset, section.size, data.length, `section ${index}`);
    if ((section.flags & 4) !== 0 && (execSize += section.size) > MAX_EXEC_SIZE) fail("executable section data exceeds the 16 MiB limit");
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail("section-name table is not a string table");
  const names = data.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(names, section.nameOffset, `section ${section.index}`);
  return { sections, shoff, shentsize };
}

function validateConfig() {
  const scalarKeys = ["sourceSha256", "instructionScheduleSha256", "branchScheduleSha256", "returnScheduleSha256", "pcRelativeScheduleSha256", "relocationScheduleSha256"];
  if (config.schemaVersion !== 1 || config.source !== "src/main/arm_runtime_helpers_95.S" || config.mode !== "arm" ||
      config.totalBodySize !== 64 || config.totalAdjacentSize !== 16 || config.functions?.length !== 4 || config.pcRelativeDataAccesses?.length !== 4 ||
      scalarKeys.some((key) => config[key] !== CONTRACT[key]) || JSON.stringify(config.functions.map(({ name }) => name)) !== JSON.stringify(CONTRACT.names)) {
    fail("configuration shape or fixed totals mismatch");
  }
  for (let index = 0; index < config.functions.length; index++) {
    const fn = config.functions[index];
    const adjacent = fn.adjacentWords;
    if (!/^func_[0-9A-F]{8}$/.test(fn.name) || fn.size !== 16 || fn.calls?.length !== 0 || adjacent?.length !== 1 ||
        adjacent[0].offset !== 16 || adjacent[0].kind !== "R_ARM_ABS32" || adjacent[0].symbol !== CONTRACT.symbols[index]) fail(`invalid function contract: ${fn.name || "<unnamed>"}`);
  }
  const identity = config.identityClasses?.literal_backed_call_free_runtime_helpers_95;
  if (JSON.stringify(identity?.members) !== JSON.stringify(CONTRACT.names) || JSON.stringify(identity?.parameters) !== JSON.stringify(["controlFlowSchedule", "memoryAccessSchedule", "literalRole"])) fail("identity-class contract mismatch");
  const accesses = [["func_00109724", 4, "ldr"], ["func_00136BFC", 4, "vldr"], ["func_001D2C7C", 0, "ldr"], ["func_0032F1B0", 0, "ldr"]];
  for (let i = 0; i < accesses.length; i++) {
    const access = config.pcRelativeDataAccesses[i];
    if (access.function !== accesses[i][0] || access.offset !== accesses[i][1] || access.mnemonic !== accesses[i][2] || access.targetOffset !== 16 ||
        access.symbol !== CONTRACT.symbols[i] || access.ownership !== "owned-adjacent-word") fail("PC-relative access contract mismatch");
  }
  const reusedSymbols = ["global_state_02", "runtime_float_zero_38"];
  const newSymbols = CONTRACT.symbols.filter((name) => !reusedSymbols.includes(name));
  if (JSON.stringify(Object.keys(config.symbolicIdentities ?? {})) !== JSON.stringify(newSymbols) ||
      JSON.stringify(config.reusedSymbolicIdentities) !== JSON.stringify(reusedSymbols) || Object.keys(config.symbolicSlots ?? {}).length !== 0) fail("symbolic identity partition mismatch");
  for (const symbol of newSymbols) {
    if (config.symbolicIdentities[symbol]?.minimumSlotAlignment !== 4 || config.symbolicIdentities[symbol]?.equality !== "singleton-distinct") fail(`invalid symbolic identity ${symbol}`);
  }
  validateCollisionExclusions(new Set(CONTRACT.names), new Set(newSymbols));
}

function validateCollisionExclusions(selectedNames, newSymbols) {
  const selectedIntervals = config.functions.map((fn) => ({ name: fn.name, start: Number.parseInt(fn.name.slice(5), 16), end: Number.parseInt(fn.name.slice(5), 16) + 20 }));
  for (const file of readdirSync(join(root, "config")).sort()) {
    if (!file.endsWith(".json") || file === "arm-runtime-helpers-95.json") continue;
    const document = JSON.parse(boundedFile(join(root, "config", file), `configuration ${file}`));
    const objects = [];
    const visit = (value) => {
      if (typeof value === "string") {
        if (selectedNames.has(value) || newSymbols.has(value)) fail(`configured identity collision for ${value} in ${file}`);
      } else if (value && typeof value === "object") {
        if (!Array.isArray(value)) objects.push(value);
        for (const child of Object.values(value)) visit(child);
      }
    };
    visit(document);
    for (const fn of objects) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(fn.name ?? "");
      if (!match || !Number.isSafeInteger(fn.size) || fn.size < 0) continue;
      const start = Number.parseInt(match[1], 16);
      const adjacentEnd = Array.isArray(fn.adjacentWords) ? Math.max(0, ...fn.adjacentWords.map((word) => Number.isSafeInteger(word.offset) ? word.offset + 4 : 0)) : 0;
      const end = start + Math.max(fn.size, adjacentEnd);
      for (const selected of selectedIntervals) if (start < selected.end && selected.start < end) fail(`configured interval ${fn.name} in ${file} overlaps ${selected.name}`);
    }
  }
}

function validateSections(sections) {
  const owned = new Map();
  for (const [name] of expected) {
    const matches = sections.filter((section) => section.name === `.text.${name}`);
    if (matches.length !== 1) fail(`expected exactly one .text.${name} section`);
    const section = matches[0];
    if (section.type !== 1 || section.flags !== 6 || section.align !== 4 || section.size !== 20) fail(`${section.name} must be a 20-byte AX PROGBITS section aligned to 4`);
    owned.set(section.index, { name, section });
  }
  return owned;
}

function readSymbols(data, sections) {
  const tables = new Map();
  let total = 0;
  for (const symtab of sections.filter((section) => section.type === 2 || section.type === 11)) {
    if (symtab.entsize < 16 || symtab.size % symtab.entsize || symtab.link >= sections.length || sections[symtab.link].type !== 3) fail("malformed ELF symbol table");
    const stringsSection = sections[symtab.link];
    const strings = data.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size);
    const entries = [];
    total += symtab.size / symtab.entsize;
    if (total > MAX_SYMBOLS) fail(`ELF symbol count exceeds ${MAX_SYMBOLS}`);
    for (let index = 0; index < symtab.size / symtab.entsize; index++) {
      const at = symtab.offset + index * symtab.entsize;
      entries.push({ index, at, name: cString(strings, data.readUInt32LE(at), `symbol ${index}`), value: data.readUInt32LE(at + 4), size: data.readUInt32LE(at + 8), info: data[at + 12], other: data[at + 13], shndx: data.readUInt16LE(at + 14) });
    }
    tables.set(symtab.index, entries);
  }
  return tables;
}

function validateSymbols(tables, owned) {
  const symbols = [...tables.values()].flat();
  for (const [sectionIndex, owner] of owned) {
    const inSection = symbols.filter((symbol) => symbol.shndx === sectionIndex && symbol.name);
    const functions = inSection.filter((symbol) => symbol.name === owner.name);
    if (functions.length !== 1 || functions[0].value !== owner.section.addr || functions[0].size !== 16 || functions[0].info !== 0x12 || functions[0].other !== 0) fail(`${owner.name} must be a default-visible global function spanning 16 bytes`);
    const arm = inSection.filter((symbol) => /^\$a(?:\.\d+)?$/.test(symbol.name));
    const data = inSection.filter((symbol) => /^\$d(?:\.\d+)?$/.test(symbol.name));
    const allowed = new Set([owner.name, ...arm.map((s) => s.name), ...data.map((s) => s.name)]);
    if (arm.length !== 1 || arm[0].value !== owner.section.addr || arm[0].size !== 0 || arm[0].info !== 0 || arm[0].other !== 0 ||
        data.length !== 1 || data[0].value !== owner.section.addr + 16 || data[0].size !== 0 || data[0].info !== 0 || data[0].other !== 0 ||
        inSection.some((symbol) => !allowed.has(symbol.name))) fail(`${owner.name} must have exact $a/$d mapping transitions and no foreign named symbol`);
  }
  for (const symbol of CONTRACT.symbols) {
    const matches = symbols.filter((entry) => entry.name === symbol);
    if (matches.length !== 1 || matches[0].shndx !== 0 || matches[0].value !== 0 || matches[0].size !== 0 || matches[0].info !== 0x10 || matches[0].other !== 0) fail(`${symbol} must be one undefined default-visible global identity`);
  }
}

function validateRelocations(data, sections, tables, owned) {
  const schedule = [];
  let count = 0;
  for (const relocation of sections.filter((section) => section.type === 4 || section.type === 9)) {
    const minimum = relocation.type === 4 ? 12 : 8;
    if (relocation.info >= sections.length || !tables.has(relocation.link) || relocation.entsize < minimum || relocation.size % relocation.entsize) fail(`relocation section ${relocation.name} is malformed`);
    count += relocation.size / relocation.entsize;
    if (count > MAX_RELOCATIONS) fail(`ELF relocation count exceeds ${MAX_RELOCATIONS}`);
    const owner = owned.get(relocation.info);
    if (!owner && relocation.size) continue;
    const symbols = tables.get(relocation.link);
    for (let index = 0; index < relocation.size / relocation.entsize; index++) {
      const at = relocation.offset + index * relocation.entsize;
      const offset = data.readUInt32LE(at);
      const info = data.readUInt32LE(at + 4);
      const type = info & 0xff;
      const symbol = symbols[info >>> 8];
      if (!symbol) fail("relocation references an invalid symbol");
      if (offset !== owner.section.addr + 16 || type !== 2) fail(`${owner.name} must have only its adjacent R_ARM_ABS32 relocation`);
      schedule.push(`${owner.name}:10:R_ARM_ABS32:${symbol.name}`);
    }
  }
  if (schedule.length !== EXPECTED_RELOCATIONS) fail(`owned relocation total mismatch: ${schedule.length}`);
  schedule.sort((left, right) => CONTRACT.names.indexOf(left.split(":")[0]) - CONTRACT.names.indexOf(right.split(":")[0]));
  if (sha256(schedule.join("\n")) !== config.relocationScheduleSha256) fail("adjacent-relocation schedule SHA-256 mismatch");
}

function normalizeOperands(text) { return text.replace(/\s*(?:@|;)\s.*$/, "").trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ", "); }
function canonicalInstruction(insn) { return `${insn.name}:${insn.offset.toString(16)}:${insn.mnemonic}:${insn.operands}`; }

function disassembleSection(objectPath, name, section) {
  const output = runFirst(commandCandidates("objdump"), ["-d", "-j", section.name, objectPath], `disassembly of ${section.name}`, 2 * 1024 * 1024);
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = /^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{2}\s+){3}[0-9a-fA-F]{2}\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*)$/.exec(line) || /^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*)$/.exec(line);
    if (!match) continue;
    const address = Number.parseInt(match[1], 16);
    if (address >= section.addr && address < section.addr + 16) instructions.push({ name, offset: address - section.addr, mnemonic: match[2].toLowerCase(), operands: normalizeOperands(match[3]) });
  }
  if (instructions.length !== 4 || instructions.some((insn, index) => insn.offset !== index * 4)) fail(`${section.name} does not contain four contiguous ARM instructions`);
  return instructions;
}

function validateSchedules(objectPath, owned) {
  const instructions = [];
  for (const name of expected.keys()) instructions.push(...disassembleSection(objectPath, name, [...owned.values()].find((entry) => entry.name === name).section));
  if (instructions.length !== EXPECTED_INSTRUCTIONS || sha256(instructions.map(canonicalInstruction).join("\n")) !== config.instructionScheduleSha256) fail("instruction schedule SHA-256 mismatch");
  const returns = instructions.filter((insn) => insn.mnemonic === "bx" && insn.operands.toLowerCase() === "lr");
  if (returns.length !== EXPECTED_RETURNS || sha256(returns.map(canonicalInstruction).join("\n")) !== config.returnScheduleSha256) fail("return-transfer schedule mismatch");
  const branchMnemonic = /^(?:b|bl|blx)(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
  const branches = instructions.filter((insn) => branchMnemonic.test(insn.mnemonic) && insn.mnemonic !== "bx");
  if (branches.some((insn) => /^blx?/.test(insn.mnemonic)) || sha256(branches.map(canonicalInstruction).join("\n")) !== config.branchScheduleSha256) fail("call/direct-branch schedule mismatch");
  const memory = instructions.filter((insn) => /^(?:ldr|str|ldm|stm|vldr|vstr|vldm|vstm)/.test(insn.mnemonic));
  if (memory.length !== EXPECTED_MEMORY_OPERATIONS) fail(`memory-operation total mismatch: ${memory.length}`);
  if (instructions.some((insn) => insn.mnemonic === "bx" ? insn.operands.toLowerCase() !== "lr" : /\bpc\b/i.test(insn.operands) && !["ldr", "vldr"].includes(insn.mnemonic))) fail("indirect transfer or undeclared PC-relative access is forbidden");
  const pc = instructions.filter((insn) => /\bpc\b/i.test(insn.operands));
  const pcSchedule = pc.map((insn) => {
    const contract = config.pcRelativeDataAccesses.find((access) => access.function === insn.name && access.offset === insn.offset && access.mnemonic === insn.mnemonic);
    if (!contract || contract.targetOffset !== 16) fail("unexpected PC-relative data access");
    const displacement = /\[pc(?:, #([+-]?\d+))?\]/i.exec(insn.operands);
    const target = insn.offset + 8 + Number(displacement?.[1] ?? 0);
    if (target !== contract.targetOffset) fail("PC-relative access does not target its owned adjacent word");
    return `${insn.name}:${insn.offset.toString(16)}:${insn.mnemonic}:10:${contract.symbol}`;
  });
  if (pcSchedule.length !== 4 || sha256(pcSchedule.join("\n")) !== config.pcRelativeScheduleSha256) fail("PC-relative access schedule mismatch");
}

function validateObject(path, standalone = false) {
  const data = boundedFile(path, "object");
  const { sections } = parseElf(data);
  const owned = validateSections(sections);
  const tables = readSymbols(data, sections);
  validateSymbols(tables, owned);
  validateRelocations(data, sections, tables, owned);
  validateSchedules(path, owned);
  if (standalone) {
    if (sections.some((section) => (section.flags & 4) && section.size && !owned.has(section.index))) fail("standalone object has foreign executable data");
    const allRelocations = sections.filter((section) => section.type === 4 || section.type === 9).reduce((sum, section) => sum + section.size / section.entsize, 0);
    if (allRelocations !== 4) fail("standalone object has foreign relocations");
  }
}

function expectValidationFailure(path, label) {
  try { validateObject(path); } catch { return; }
  fail(`${label} was accepted unexpectedly`);
}

function runSelfTest(probePath, directory) {
  const foreignSource = join(directory, "foreign.S");
  const foreignObject = join(directory, "foreign.o");
  const compositeObject = join(directory, "composite.o");
  const foreignSections = [".syntax unified", ".arm"];
  for (let index = 0; index < 12000; index++) foreignSections.push(`.section .text.runtime95_foreign_${index},\"ax\",%progbits`, ".byte 0");
  writeFileSync(foreignSource, `${foreignSections.join("\n")}\n`);
  runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", foreignObject, foreignSource], "12k-section fixture assembly");
  runFirst(commandCandidates("ld"), ["-r", "-o", compositeObject, probePath, foreignObject], "12k-section composite link");
  validateObject(compositeObject);
  const compositeSections = parseElf(boundedFile(compositeObject, "12k-section composite")).sections;
  if (compositeSections.filter((section) => section.name.startsWith(".text.runtime95_foreign_")).length < 12000) fail("valid composite retained fewer than 12,000 unrelated sections");

  const mutate = (label, callback) => {
    const bytes = Buffer.from(boundedFile(probePath, "probe object"));
    callback(bytes);
    const path = join(directory, `hostile-${label}.o`);
    writeFileSync(path, bytes);
    expectValidationFailure(path, `hostile ${label}`);
  };
  mutate("schedule", (bytes) => { const section = parseElf(bytes).sections.find((entry) => entry.name === `.text.${CONTRACT.names[0]}`); bytes[section.offset] ^= 1; });
  mutate("mode", (bytes) => { const at = bytes.indexOf(Buffer.from([0x24, 0x61, 0x00])); if (at < 0) fail("missing ARM mapping name"); bytes[at + 1] = 0x74; });
  const truncatedPath = join(directory, "hostile-truncated.o");
  const probe = boundedFile(probePath, "probe object");
  writeFileSync(truncatedPath, probe.subarray(0, probe.length - 1));
  expectValidationFailure(truncatedPath, "hostile truncated object");
  mutate("misplaced-data", (bytes) => {
    const { sections } = parseElf(bytes);
    const symbol = [...readSymbols(bytes, sections).values()].flat().find((entry) => /^\$d(?:\.\d+)?$/.test(entry.name));
    if (!symbol) fail("missing data mapping symbol");
    bytes.writeUInt32LE(12, symbol.at + 4);
  });

  const fragment = (label, lines) => {
    const source = join(directory, `${label}.S`);
    const object = join(directory, `${label}-fragment.o`);
    const linked = join(directory, `hostile-${label}.o`);
    writeFileSync(source, `${lines.join("\n")}\n`);
    runFirst(commandCandidates("as"), ["-march=armv6k", "-mfpu=vfpv2", "-o", object, source], `${label} fixture assembly`);
    runFirst(commandCandidates("ld"), ["-r", "-o", linked, probePath, object], `${label} fixture link`);
    expectValidationFailure(linked, `hostile ${label}`);
  };
  fragment("relocation", [".syntax unified", ".arm", `.section .text.${CONTRACT.names[0]},\"ax\",%progbits`, ".reloc 0, R_ARM_ABS32, runtime95_hostile_external"]);
  fragment("foreign-symbol", [".syntax unified", ".arm", `.section .text.${CONTRACT.names[0]},\"ax\",%progbits`, ".global runtime95_foreign_symbol", "runtime95_foreign_symbol:"]);
  mutate("duplicate", (bytes) => {
    const parsed = parseElf(bytes); const first = parsed.sections.find((s) => s.name === `.text.${CONTRACT.names[0]}`); const second = parsed.sections.find((s) => s.name === `.text.${CONTRACT.names[1]}`);
    bytes.writeUInt32LE(first.nameOffset, parsed.shoff + second.index * parsed.shentsize);
  });
}

let temporaryDirectory;
try {
  validateConfig();
  const input = parseArguments(process.argv.slice(2));
  if (!existsSync(input.path)) fail(`input does not exist: ${input.path}`);
  let objectPath = input.path;
  if (input.kind === "source") {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-95-"));
    objectPath = join(temporaryDirectory, "probe.o");
    assemble(input.path, objectPath);
  }
  validateObject(objectPath, input.kind === "source");
  if (input.selfTest) runSelfTest(objectPath, temporaryDirectory);
  console.log(`validated arm runtime helpers 95: 4 functions, 64 body bytes + 16 adjacent bytes, 16 instructions, 10 memory operations, 4 returns, 4 relocations${input.selfTest ? "; 12k-section composite and hostile checks passed" : ""}`);
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
}
