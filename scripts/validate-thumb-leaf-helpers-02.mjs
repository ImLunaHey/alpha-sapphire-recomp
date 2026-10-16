#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(root, 'config', 'thumb-leaf-helpers-02.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const sourcePath = resolve(root, config.source);
const MAX_FILE_SIZE = 64 * 1024 * 1024;
const MAX_EXECUTABLE_SIZE = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 4_194_304;

function fail(message) {
  throw new Error(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sum(field) {
  return config.functions.reduce((n, fn) => n + fn[field], 0);
}

function validateManifest() {
  check(config.schemaVersion === 1, 'unsupported configuration schema');
  check(config.mode === 'thumb', 'configuration is not Thumb mode');
  check(config.minimumAlignment === 2, 'unexpected minimum alignment');
  check(config.functions.length === 24, 'expected exactly 24 functions');
  check(new Set(config.functions.map((fn) => fn.name)).size === 24,
    'function names are not unique');
  check(sum('size') === config.totalBodySize && config.totalBodySize === 848,
    'body-size total is not 848');
  check(config.totalAdjacentSize === 0, 'adjacent data must not be owned');
  check(sum('instructionCount') === config.expectedInstructionCount &&
    config.expectedInstructionCount === 424, 'instruction total is not 424');
  check(config.functions.reduce((n, fn) => n + fn.localTransfers.length, 0) ===
    config.localBranchCount && config.localBranchCount === 85,
    'local-branch total is not 85');
  check(sum('memoryOperationCount') === config.memoryOperationCount &&
    config.memoryOperationCount === 124, 'memory-operation total is not 124');
  check(config.functions.reduce((n, fn) => n + fn.returns.length, 0) ===
    config.returnCount && config.returnCount === 34, 'return total is not 34');
  check(config.functions.reduce((n, fn) => n + fn.indirectCalls.length, 0) ===
    config.indirectCallCount && config.indirectCallCount === 2,
    'indirect-call total is not 2');
  check(config.indirectTailCount === 0, 'indirect tails must be empty');
  check(config.directCalls.length === 0 && config.relocations.length === 0,
    'calls and relocations must be empty');

  for (const fn of config.functions) {
    check(fn.size === fn.instructionCount * 2,
      `${fn.name}: body is not entirely 16-bit instructions`);
    check(fn.nextGlobalOffset >= fn.size,
      `${fn.name}: next-global boundary overlaps its body`);
    check(fn.schedule.split('|').length === fn.instructionCount,
      `${fn.name}: schedule length mismatch`);
    for (const record of fn.localTransfers) {
      const match = record.match(/^([0-9a-f]+):([a-z]+\.n):\+([0-9a-f]+)$/);
      check(match, `${fn.name}: malformed local-transfer record`);
      const offset = Number.parseInt(match[1], 16);
      const targetOffset = Number.parseInt(match[3], 16);
      check(offset >= 0 && offset < fn.size && targetOffset >= 0 &&
        targetOffset < fn.size && !(offset & 1) && !(targetOffset & 1),
      `${fn.name}: invalid local branch boundary`);
    }
  }

  check(config.pcRelativeDataAccesses.length === 12,
    'expected exactly twelve PC-relative data accesses');
  const pcRelativeSites = new Set();
  for (const pc of config.pcRelativeDataAccesses) {
    const pcFn = config.functions.find((fn) => fn.name === pc.function);
    const site = `${pc.function}:${pc.offset}`;
    check(pcFn && pc.ownership === 'unowned-post-body' &&
      pc.mnemonic === 'ldr' && pc.requiredEntryAlignment === 4 &&
      pc.offset >= 0 && pc.offset < pcFn.size && !(pc.offset & 1) &&
      pc.targetOffset >= pcFn.size && pc.targetOffset < pcFn.nextGlobalOffset &&
      !(pc.targetOffset & 3) && !pcRelativeSites.has(site),
    'invalid or duplicate unowned post-body literal contract');
    pcRelativeSites.add(site);
  }

  const declared = new Set(config.duplicateBodyClasses.flatMap((c) => c.members));
  check(declared.size === 2 && config.duplicateBodyClasses.length === 1,
    'unexpected duplicate-body declarations');
}

function u16(buffer, offset, little) {
  check(offset >= 0 && offset + 2 <= buffer.length, 'truncated ELF u16');
  return little ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset);
}

function u32(buffer, offset, little) {
  check(offset >= 0 && offset + 4 <= buffer.length, 'truncated ELF u32');
  return little ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}

function range(buffer, offset, size, what) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) &&
    offset >= 0 && size >= 0 && offset <= buffer.length &&
    size <= buffer.length - offset, `${what} lies outside the ELF file`);
  return buffer.subarray(offset, offset + size);
}

function cString(table, offset, what) {
  check(offset >= 0 && offset < table.length, `${what} string offset is invalid`);
  const end = table.indexOf(0, offset);
  check(end !== -1, `${what} string is unterminated`);
  return table.toString('utf8', offset, end);
}

function parseElf(buffer) {
  check(buffer.length <= MAX_FILE_SIZE, 'ELF file exceeds 64 MiB');
  check(buffer.length >= 52 && buffer[0] === 0x7f &&
    buffer.toString('ascii', 1, 4) === 'ELF', 'not an ELF file');
  const elfClass = buffer[4];
  const data = buffer[5];
  check(elfClass === 1, 'ELF is not ELF32');
  check(data === 1 || data === 2, 'unsupported ELF byte order');
  check(buffer[6] === 1, 'unsupported ELF version');
  const little = data === 1;
  const headerSize = 52;
  check(buffer.length >= headerSize, 'truncated ELF header');
  const type = u16(buffer, 16, little);
  const machine = u16(buffer, 18, little);
  const shoff = u32(buffer, 32, little);
  const ehsize = u16(buffer, 40, little);
  const shentsize = u16(buffer, 46, little);
  let shnum = u16(buffer, 48, little);
  let shstrndx = u16(buffer, 50, little);
  const expectedShSize = 40;
  check(ehsize >= headerSize, 'invalid ELF header size');
  check(shentsize >= expectedShSize, 'section-header entry is too small');
  check(shoff > 0 && shoff <= buffer.length, 'invalid section-header offset');
  check(shoff + shentsize <= buffer.length, 'missing ELF section zero');

  function rawSection(index) {
    const at = shoff + index * shentsize;
    range(buffer, at, expectedShSize, `section header ${index}`);
    return {
      nameOffset: u32(buffer, at, little), type: u32(buffer, at + 4, little),
      flags: u32(buffer, at + 8, little), address: u32(buffer, at + 12, little),
      offset: u32(buffer, at + 16, little), size: u32(buffer, at + 20, little),
      link: u32(buffer, at + 24, little), info: u32(buffer, at + 28, little),
      align: u32(buffer, at + 32, little), entsize: u32(buffer, at + 36, little),
    };
  }

  const zero = rawSection(0);
  if (shnum === 0) shnum = zero.size;
  if (shstrndx === 0xffff) shstrndx = zero.link;
  check(Number.isSafeInteger(shnum) && shnum > 0 && shnum <= MAX_SECTIONS,
    'invalid or excessive section count');
  check(shoff + shnum * shentsize <= buffer.length,
    'section-header table is truncated');
  check(shstrndx < shnum, 'section-name table index is invalid');

  const sections = Array.from({ length: shnum }, (_, index) => ({
    index, ...rawSection(index),
  }));
  for (const section of sections) {
    check(section.align === 0 || (section.align & (section.align - 1)) === 0,
      `section ${section.index} has non-power-of-two alignment`);
    if (section.type !== 8) range(buffer, section.offset, section.size,
      `section ${section.index}`);
  }
  const executableSize = sections.reduce((size, section) =>
    size + ((section.flags & 4) !== 0 ? section.size : 0), 0);
  check(executableSize <= MAX_EXECUTABLE_SIZE,
    'ELF executable sections exceed 16 MiB');
  const shstr = sections[shstrndx];
  check(shstr.type === 3 || shstrndx === 0, 'invalid section-name string table');
  const names = shstrndx === 0 ? Buffer.from([0]) :
    range(buffer, shstr.offset, shstr.size, 'section-name string table');
  for (const section of sections) {
    section.name = cString(names, section.nameOffset, `section ${section.index}`);
    section.bytes = section.type === 8 ? Buffer.alloc(0) :
      range(buffer, section.offset, section.size, section.name || `section ${section.index}`);
  }
  for (const section of sections.filter((candidate) => candidate.type === 4 || candidate.type === 9)) {
    const minimumEntrySize = section.type === 4 ? 12 : 8;
    check(section.info < sections.length, `${section.name}: invalid relocation target section`);
    check(section.link < sections.length && sections[section.link].type === 2,
      `${section.name}: relocation section does not link a symbol table`);
    check(section.entsize >= minimumEntrySize && section.size % section.entsize === 0,
      `${section.name}: malformed relocation entries`);
  }
  return { buffer, elfClass, little, type, machine, sections };
}

function parseSymbols(elf) {
  const symbols = [];
  for (const table of elf.sections.filter((s) => s.type === 2)) {
    check(table.link < elf.sections.length, `${table.name}: invalid linked string table`);
    const strings = elf.sections[table.link];
    check(strings.type === 3, `${table.name}: symbol names do not use a string table`);
    const minimum = 16;
    check(table.entsize >= minimum && table.entsize !== 0 &&
      table.size % table.entsize === 0, `${table.name}: invalid symbol entry size`);
    const count = table.size / table.entsize;
    check(count <= MAX_SYMBOLS, `${table.name}: excessive symbol count`);
    for (let i = 0; i < count; i++) {
      const at = table.offset + i * table.entsize;
      const nameOffset = u32(elf.buffer, at, elf.little);
      const value = u32(elf.buffer, at + 4, elf.little);
      const size = u32(elf.buffer, at + 8, elf.little);
      const info = elf.buffer[at + 12];
      const shndx = u16(elf.buffer, at + 14, elf.little);
      symbols.push({ table: table.name, index: i,
        name: cString(strings.bytes, nameOffset, `${table.name} symbol ${i}`),
        bind: info >> 4, type: info & 15, shndx, value, size });
    }
  }
  check(symbols.length > 0, 'ELF has no static symbol table');
  return symbols;
}

function normalizeInstruction(text) {
  return text.trim().toLowerCase()
    .replace(/\s*(?:@|;)\s.*$/, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\[\s*/g, '[').replace(/\s*\]/g, ']')
    .replace(/\{\s*/g, '{').replace(/\s*\}/g, '}');
}

function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, { encoding: 'utf8', ...options });
  if (result.error) fail(`cannot run ${tool}: ${result.error.message}`);
  if (result.status !== 0) fail(`${tool} failed (${result.status}):\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function tool(name, fallback) {
  if (process.env[name]) return process.env[name];
  const prefix = process.env.CROSS_COMPILE || process.env.CROSS || '';
  return prefix ? `${prefix}${fallback}` : `arm-none-eabi-${fallback}`;
}

function parseDisassembly(text, fn) {
  const instructions = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+([0-9a-fA-F]{4,8})\s+([a-zA-Z][^\r\n]*)$/);
    if (!match) continue;
    const offset = Number.parseInt(match[1], 16);
    const byteCount = match[2].length / 2;
    const instruction = normalizeInstruction(match[3]);
    const split = instruction.indexOf(' ');
    instructions.push({ offset, byteCount,
      mnemonic: split < 0 ? instruction : instruction.slice(0, split),
      operands: split < 0 ? '' : instruction.slice(split + 1), instruction });
  }
  check(instructions.length === fn.instructionCount,
    `${fn.name}: disassembled ${instructions.length}, expected ${fn.instructionCount}`);
  return instructions;
}

function branchTarget(operands) {
  const match = operands.match(/^(?:0x)?([0-9a-f]+)(?:\s|$)/);
  check(match, `cannot decode local branch operand ${operands}`);
  return Number.parseInt(match[1], 16);
}

function canonicalize(fn, instructions) {
  const expectedSchedule = fn.schedule.split('|').map(normalizeInstruction);
  const locals = new Map(fn.localTransfers.map((record) => {
    const match = record.match(/^([0-9a-f]+):([a-z]+\.n):\+([0-9a-f]+)$/);
    return [Number.parseInt(match[1], 16), {
      mnemonic: match[2], targetOffset: Number.parseInt(match[3], 16),
    }];
  }));
  return instructions.map((insn, index) => {
    check(insn.offset === index * 2 && insn.byteCount === 2,
      `${fn.name}: instruction at +${insn.offset.toString(16)} is not the expected 16-bit slot`);
    const expected = expectedSchedule[index];
    const local = locals.get(insn.offset);
    if (local) {
      check(insn.mnemonic === local.mnemonic,
        `${fn.name}+${insn.offset.toString(16)}: expected ${local.mnemonic}, got ${insn.mnemonic}`);
      check(branchTarget(insn.operands) === local.targetOffset,
        `${fn.name}+${insn.offset.toString(16)}: incorrect local target`);
      return `${insn.mnemonic} local:+${local.targetOffset.toString(16)}`;
    }
    check(insn.instruction === expected,
      `${fn.name}+${insn.offset.toString(16)}: expected '${expected}', got '${insn.instruction}'`);
    return insn.instruction;
  });
}

function transferRecord(record, kind) {
  const match = record.match(/^([0-9a-f]+):([^:]+):(.+)$/);
  check(match, `malformed ${kind} record '${record}'`);
  return { offset: Number.parseInt(match[1], 16), mnemonic: match[2], operand: match[3] };
}

function literalImmediate(operands) {
  const match = operands.match(/^r[0-9]+, \[pc, #(\d+)\]$/);
  check(match, `cannot decode PC-relative load '${operands}'`);
  return Number.parseInt(match[1], 10);
}

function validateObject(objectPath, objdump) {
  check(statSync(objectPath).size <= MAX_FILE_SIZE, 'ELF file exceeds 64 MiB');
  const elf = parseElf(readFileSync(objectPath));
  check(elf.type === 1, 'ELF is not relocatable');
  check(elf.machine === 40, 'ELF is not for ARM');
  const sectionsByName = new Map();
  for (const section of elf.sections) {
    if (!sectionsByName.has(section.name)) sectionsByName.set(section.name, []);
    sectionsByName.get(section.name).push(section);
  }
  const symbols = parseSymbols(elf);

  const instructionRecords = [];
  const localRecords = [];
  const returnRecords = [];
  const indirectCallRecords = [];
  const bodies = new Map();
  let memoryOperations = 0;
  for (const fn of config.functions) {
    const ownedSections = sectionsByName.get(`.text.${fn.name}`) || [];
    check(ownedSections.length === 1,
      `${fn.name}: expected one dedicated text section, found ${ownedSections.length}`);
    const section = ownedSections[0];
    check(section.type === 1 && (section.flags & 6) === 6,
      `${fn.name}: section is not allocatable executable PROGBITS`);
    check(section.size === fn.size, `${fn.name}: section size ${section.size}, expected ${fn.size}`);
    check(section.align === config.minimumAlignment,
      `${fn.name}: section alignment is not exactly two bytes`);
    const ownedSymbols = symbols.filter((s) => s.name === fn.name);
    check(ownedSymbols.length === 1, `${fn.name}: expected exactly one owned symbol`);
    const symbol = ownedSymbols[0];
    check(symbol.bind === 1 && symbol.type === 2, `${fn.name}: symbol is not global STT_FUNC`);
    check(symbol.shndx === section.index, `${fn.name}: symbol belongs to the wrong section`);
    check((symbol.value & 1) === 1, `${fn.name}: symbol does not carry Thumb state`);
    check((symbol.value & ~1) === 0 && symbol.size === fn.size,
      `${fn.name}: symbol boundary does not equal its section body`);
    const output = run(objdump,
      ['-d', '-M', 'force-thumb', '--section', section.name, objectPath]);
    const instructions = parseDisassembly(output, fn);
    const canonical = canonicalize(fn, instructions);
    const declaredPcAccesses = config.pcRelativeDataAccesses.filter((pc) => pc.function === fn.name);
    const decodedPcOffsets = instructions
      .filter((instruction) => instruction.mnemonic === 'ldr' && /^r[0-9]+, \[pc, #/.test(instruction.operands))
      .map((instruction) => instruction.offset);
    check(decodedPcOffsets.length === declaredPcAccesses.length &&
      decodedPcOffsets.every((offset) => declaredPcAccesses.some((access) => access.offset === offset)),
    `${fn.name}: PC-relative access inventory is incomplete or has extra entries`);
    for (const access of declaredPcAccesses) {
      const instruction = instructions[access.offset / 2];
      check(instruction?.mnemonic === access.mnemonic,
        `${fn.name}+${access.offset.toString(16)}: PC-relative access is missing`);
      const entry = section.address + (symbol.value & ~1);
      check(entry % access.requiredEntryAlignment === 0,
        `${fn.name}: entry violates required four-byte placement`);
      const architecturalPc = (entry + access.offset + 4) & ~3;
      const decodedTarget = architecturalPc + literalImmediate(instruction.operands);
      check(decodedTarget - entry === access.targetOffset,
        `${fn.name}+${access.offset.toString(16)}: incorrect PC-relative target`);
      check(access.targetOffset >= section.size && access.targetOffset < fn.nextGlobalOffset,
        `${fn.name}: PC-relative target was incorrectly owned`);
    }
    let functionMemoryOperations = 0;
    for (let i = 0; i < canonical.length; i++) {
      instructionRecords.push(`${fn.name}:${(i * 2).toString(16)}:${canonical[i].replace(' ', ':')}`);
      if (fn.localTransfers.some((record) =>
        Number.parseInt(record.slice(0, record.indexOf(':')), 16) === i * 2)) {
        localRecords.push(`${fn.name}:${(i * 2).toString(16)}:${canonical[i].replace(' ', ':')}`);
      }
      if (/^(ldr|ldrb|ldrh|ldmia|str|strb|strh|push|pop)\b/.test(canonical[i])) {
        memoryOperations++;
        functionMemoryOperations++;
      }
    }
    check(functionMemoryOperations === fn.memoryOperationCount,
      `${fn.name}: decoded ${functionMemoryOperations} memory operations, expected ${fn.memoryOperationCount}`);
    for (const transfer of fn.returns.map((r) => transferRecord(r, 'return'))) {
      const insn = instructions[transfer.offset / 2];
      check(insn.mnemonic === transfer.mnemonic && insn.operands === transfer.operand,
        `${fn.name}+${transfer.offset.toString(16)}: incorrect return transfer`);
      returnRecords.push(`${fn.name}:${transfer.offset.toString(16)}:${transfer.mnemonic}:${transfer.operand}`);
    }
    for (const transfer of fn.indirectCalls.map((r) => transferRecord(r, 'indirect call'))) {
      const insn = instructions[transfer.offset / 2];
      check(insn.mnemonic === transfer.mnemonic && insn.operands === transfer.operand,
        `${fn.name}+${transfer.offset.toString(16)}: incorrect indirect call`);
      indirectCallRecords.push(
        `${fn.name}:${transfer.offset.toString(16)}:${transfer.mnemonic}:${transfer.operand}`);
    }
    bodies.set(fn.name, section.bytes);
  }
  const ownedSectionIndexes = new Set(config.functions.map((fn) =>
    sectionsByName.get(`.text.${fn.name}`)[0].index));
  const ownedRelocations = elf.sections.filter((section) =>
    (section.type === 4 || section.type === 9) && section.size !== 0 &&
    ownedSectionIndexes.has(section.info));
  check(ownedRelocations.length === 0,
    `owned section has relocations in '${ownedRelocations[0]?.name}'`);
  check(memoryOperations === config.memoryOperationCount,
    `decoded ${memoryOperations} memory operations, expected ${config.memoryOperationCount}`);
  check(sha256(instructionRecords.join('\n')) === config.canonicalHashes.instructionSchedule,
    'instruction-schedule hash mismatch');
  check(sha256(localRecords.join('\n')) === config.canonicalHashes.localTransferSchedule,
    'local-transfer hash mismatch');
  check(sha256(returnRecords.join('\n')) === config.canonicalHashes.returnTransferSchedule,
    'return-transfer hash mismatch');
  check(sha256(indirectCallRecords.join('\n')) === config.canonicalHashes.indirectCallSchedule,
    'indirect-call schedule hash mismatch');

  const classKey = (names) => [...names].sort().join('\0');
  const actualClasses = new Map();
  for (const fn of config.functions) {
    const key = sha256(bodies.get(fn.name));
    if (!actualClasses.has(key)) actualClasses.set(key, []);
    actualClasses.get(key).push(fn.name);
  }
  const actualDuplicates = new Set([...actualClasses.values()].filter((c) => c.length > 1).map(classKey));
  const expectedDuplicates = new Set(config.duplicateBodyClasses.map((c) => classKey(c.members)));
  check(actualDuplicates.size === expectedDuplicates.size &&
    [...actualDuplicates].every((c) => expectedDuplicates.has(c)),
    'duplicate-body classes do not match the manifest');
}

function syntheticManySectionElf(count) {
  check(count > 0 && count <= MAX_SECTIONS + 1, 'bad synthetic section count');
  const buffer = Buffer.alloc(52 + count * 40);
  buffer.write('\x7fELF', 0, 'binary');
  buffer[4] = 1; buffer[5] = 1; buffer[6] = 1;
  buffer.writeUInt16LE(1, 16); buffer.writeUInt16LE(40, 18);
  buffer.writeUInt32LE(1, 20); buffer.writeUInt32LE(52, 32);
  buffer.writeUInt16LE(52, 40); buffer.writeUInt16LE(40, 46);
  buffer.writeUInt16LE(0, 48); buffer.writeUInt16LE(0, 50);
  buffer.writeUInt32LE(count, 52 + 20);
  return buffer;
}

function syntheticOversizeExecutableElf() {
  const buffer = Buffer.alloc(52 + 2 * 40);
  buffer.write('\x7fELF', 0, 'binary');
  buffer[4] = 1; buffer[5] = 1; buffer[6] = 1;
  buffer.writeUInt16LE(1, 16); buffer.writeUInt16LE(40, 18);
  buffer.writeUInt32LE(1, 20); buffer.writeUInt32LE(52, 32);
  buffer.writeUInt16LE(52, 40); buffer.writeUInt16LE(40, 46);
  buffer.writeUInt16LE(2, 48); buffer.writeUInt16LE(0, 50);
  const section = 52 + 40;
  buffer.writeUInt32LE(8, section + 4); // SHT_NOBITS avoids allocating section payload.
  buffer.writeUInt32LE(6, section + 8); // SHF_ALLOC | SHF_EXECINSTR
  buffer.writeUInt32LE(MAX_EXECUTABLE_SIZE + 1, section + 20);
  buffer.writeUInt32LE(1, section + 32);
  return buffer;
}

function selfTest() {
  const many = syntheticManySectionElf(MAX_SECTIONS);
  const parsed = parseElf(many);
  check(parsed.sections.length === MAX_SECTIONS, 'extended section count self-test failed');
  let rejected = 0;
  for (const hostile of [
    many.subarray(0, many.length - 1),
    syntheticManySectionElf(MAX_SECTIONS + 1),
    syntheticOversizeExecutableElf(),
    Buffer.alloc(MAX_FILE_SIZE + 1),
    Buffer.from('not ELF'),
  ]) {
    try { parseElf(hostile); } catch { rejected++; }
  }
  check(rejected === 5, 'hostile/large-section ELF self-test failed');
}

function foreignCompositeSelfTest(objectPath, objdump) {
  const temporary = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-02-foreign-'));
  try {
  const source = join(temporary, 'foreign.S');
  const foreignObject = join(temporary, 'foreign.o');
  const combinedObject = join(temporary, 'combined.o');
  const lines = [
    '.syntax unified', '.arch armv6k', '.arm',
    '.section .text.thumb_leaf02_foreign,"ax",%progbits',
    '.global thumb_leaf02_foreign', '.type thumb_leaf02_foreign,%function',
    'thumb_leaf02_foreign:', ' bl thumb_leaf02_undefined', ' bx lr',
    '.size thumb_leaf02_foreign,.-thumb_leaf02_foreign',
  ];
  for (let index = 0; index < 12_050; index++) {
    lines.push(`.section .thumb_leaf02_foreign.${index},"",%progbits`, `.byte ${index & 0xff}`);
  }
  writeFileSync(source, `${lines.join('\n')}\n`);
  run(tool('AS', 'as'), ['-march=armv6k', '-o', foreignObject, source]);
  run(tool('LD', 'ld'), ['-r', '-o', combinedObject, objectPath, foreignObject]);
  const combined = parseElf(readFileSync(combinedObject));
  check(combined.sections.length >= 12_000,
    'high-section-count foreign composite self-test was ineffective');
  const foreign = combined.sections.find((section) => section.name === '.text.thumb_leaf02_foreign');
  check(foreign && combined.sections.some((section) =>
    (section.type === 4 || section.type === 9) && section.size !== 0 && section.info === foreign.index),
  'foreign composite does not contain its intended unrelated relocation');
  validateObject(combinedObject, objdump);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

function objectArgument(args) {
  if (args.length === 1 && args[0] === '--source-only') {
    return { object: null, sourceOnly: true };
  }
  let object = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--self-test' || arg === '--self-test-only') continue;
    if (arg === '--object') {
      check(i + 1 < args.length && !args[i + 1].startsWith('--'),
        '--object requires a path');
      check(object === null, 'object path was provided more than once');
      object = args[++i];
      continue;
    }
    if (arg.startsWith('--object=')) {
      check(arg.length > '--object='.length, '--object requires a path');
      check(object === null, 'object path was provided more than once');
      object = arg.slice('--object='.length);
      continue;
    }
    check(!arg.startsWith('--'), `unknown option '${arg}'`);
    check(object === null, 'object path was provided more than once');
    object = arg;
  }
  return { object, sourceOnly: false };
}

function main() {
  validateManifest();
  const source = readFileSync(sourcePath);
  check(sha256(source) === config.sourceSha256, 'source SHA-256 mismatch');
  if (process.argv.includes('--self-test-only')) {
    selfTest();
    console.log('ELF parser self-tests passed');
    return;
  }
  if (process.argv.includes('--self-test')) selfTest();

  const { object: objectArg, sourceOnly } = objectArgument(process.argv.slice(2));
  if (sourceOnly) {
    console.log(`validated source manifest for ${config.functions.length} Thumb functions`);
    return;
  }
  const objdump = tool('OBJDUMP', 'objdump');
  let objectPath = objectArg ? resolve(process.cwd(), objectArg) : null;
  let temporary = null;
  try {
    if (!objectPath) {
      temporary = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-02-'));
      objectPath = join(temporary, 'thumb_leaf_helpers_02.o');
      run(tool('AS', 'as'), ['-march=armv6k', '-mthumb', '-o', objectPath, sourcePath]);
    } else {
      check(existsSync(objectPath), `object does not exist: ${objectPath}`);
    }
    validateObject(objectPath, objdump);
    if (process.argv.includes('--self-test')) foreignCompositeSelfTest(objectPath, objdump);
  } finally {
    if (temporary) rmSync(temporary, { recursive: true, force: true });
  }
  console.log(`validated ${config.functions.length} Thumb functions, ${config.totalBodySize} bytes, ` +
    `${config.expectedInstructionCount} instructions` +
    (process.argv.includes('--self-test') ? '; hostile 12k-section foreign composite passed' : ''));
}

try {
  main();
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
}
