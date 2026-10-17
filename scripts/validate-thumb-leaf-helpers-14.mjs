#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/thumb-leaf-helpers-14.json');
const SOURCE_PATH = join(ROOT, 'src/main/thumb_leaf_helpers_14.S');
const MAX_SOURCE = 64 * 1024 * 1024;
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const SENTINEL = '0'.repeat(64);
const PINNED_TOOL_PREFIX = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';
const EXPECTED_SOURCE_HASH = '6e10b61b3acb577fe1a4ea22b38149e606a0b570bb0ce12711d2ec2e4f6955ac';
const EXPECTED_CONFIG_CONTRACT = 'c1d0d1f354e1ae5027515c982a1874e9e6fc6fdd1b8e131067d931c3222a0c58';
const EXPECTED = new Map([
  ['func_003026AC', { size: 158, instructions: 73, branches: 17, memory: 15, returns: 4, calls: 6 }],
]);

function fail(message) { throw new Error(message); }
function expect(condition, message) { if (!condition) fail(message); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function hashLines(lines) { return sha256(Buffer.from(lines.join('\n'))); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function limit(kind, value, maximum) {
  expect(Number.isSafeInteger(value) && value >= 0, `${kind} size/count is invalid`);
  expect(value <= maximum, `${kind} exceeds limit ${maximum}`);
}
function boundedRead(path, maximum, kind) {
  const stat = statSync(path);
  expect(stat.isFile(), `${kind} is not a regular file: ${path}`);
  limit(kind, stat.size, maximum);
  return readFileSync(path);
}

function keys(value, expected) { return same(Object.keys(value).sort(), [...expected].sort()); }
function lowRegister(value) { return typeof value === 'string' && /^r[0-7]$/.test(value); }
function registers(values, allowLink = false) {
  return Array.isArray(values) && values.length > 0 &&
    values.every((value) => lowRegister(value) || (allowLink && value === 'lr')) &&
    new Set(values).size === values.length;
}
function integer(value, maximum) { return Number.isInteger(value) && value >= 0 && value <= maximum; }
const CONDITIONS = new Map([
  ['equal', 'beq.n'], ['notEqual', 'bne.n'], ['negative', 'bmi.n'],
  ['nonNegative', 'bpl.n'], ['unsignedLowerOrSame', 'bls.n'],
  ['signedGreater', 'bgt.n'], ['signedLess', 'blt.n'], ['always', 'b.n'],
]);

function semanticInstruction(row, scope) {
  expect(row !== null && typeof row === 'object' &&
    keys(row, ['offset', 'width', 'operation', 'form', 'operands']) &&
    Number.isInteger(row.offset) && row.offset >= 0 && (row.width === 2 || row.width === 4) &&
    row.operands !== null && typeof row.operands === 'object', `${scope}: malformed semantic row`);
  const o = row.operands;
  if (row.operation === 'stackSave' && row.form === 'registerList') {
    expect(row.width === 2 && keys(o, ['registers']) && registers(o.registers, true) && o.registers.includes('lr'), `${scope}: invalid stack-save row`);
    return `push {${o.registers.join(', ')}}`;
  }
  if (row.operation === 'copy' && row.form === 'lowRegister') {
    expect(row.width === 2 && keys(o, ['destination', 'source', 'setFlags']) && lowRegister(o.destination) && lowRegister(o.source) && o.setFlags === true, `${scope}: invalid register-copy row`);
    return `movs ${o.destination}, ${o.source}`;
  }
  if (row.operation === 'negate' && row.form === 'lowRegister') {
    expect(row.width === 2 && keys(o, ['destination', 'source', 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o.source) && o.setFlags === true, `${scope}: invalid negate row`);
    return `negs ${o.destination}, ${o.source}`;
  }
  if (row.operation === 'constant' && row.form === 'immediate8') {
    expect(row.width === 2 && keys(o, ['destination', 'value', 'setFlags']) && lowRegister(o.destination) && integer(o.value, 255) && o.setFlags === true, `${scope}: invalid constant row`);
    return `movs ${o.destination}, #${o.value}`;
  }
  if (row.operation === 'compare' && row.form === 'immediate8') {
    expect(row.width === 2 && keys(o, ['left', 'rightImmediate']) && lowRegister(o.left) && integer(o.rightImmediate, 255), `${scope}: invalid compare row`);
    return `cmp ${o.left}, #${o.rightImmediate}`;
  }
  if (row.operation === 'transfer' && o.kind === 'branch') {
    const mnemonic = CONDITIONS.get(o.condition);
    expect(row.width === 2 && keys(o, ['kind', 'condition', 'destinationOffset']) && mnemonic &&
      integer(o.destinationOffset, 0xffff) &&
      ((o.condition === 'always') === (row.form === 'localUnconditional')) &&
      (o.condition === 'always' || row.form === 'localConditional'), `${scope}: invalid local-transfer row`);
    return `${mnemonic} .L_${scope}_${o.destinationOffset.toString(16)}`;
  }
  if (row.operation === 'transfer' && row.form === 'stackRestore' && o.kind === 'return') {
    expect(row.width === 2 && keys(o, ['kind', 'restoredRegisters']) && registers(o.restoredRegisters), `${scope}: invalid return row`);
    return `pop {${o.restoredRegisters.join(', ')}, pc}`;
  }
  if (row.operation === 'transfer' && row.form === 'directImmediate' && o.kind === 'call') {
    expect(row.width === 4 && keys(o, ['kind', 'destinationSymbol', 'destinationState', 'stateSwitch', 'relocation']) &&
      /^func_[0-9A-F]{8}$/.test(o.destinationSymbol) && (o.destinationState === 'arm' || o.destinationState === 'thumb') &&
      o.stateSwitch === (o.destinationState === 'arm') && o.relocation === 'R_ARM_THM_CALL', `${scope}: invalid direct-call row`);
    return `${o.stateSwitch ? 'blx' : 'bl'} ${o.destinationSymbol}`;
  }
  if (row.operation === 'load' && row.form === 'immediateOffset') {
    expect(row.width === 2 && keys(o, ['width', 'destination', 'base', 'offset']) && o.width === 'word' &&
      lowRegister(o.destination) && lowRegister(o.base) && integer(o.offset, 124) && o.offset % 4 === 0, `${scope}: invalid immediate load row`);
    return `ldr ${o.destination}, [${o.base}, #${o.offset}]`;
  }
  if (row.operation === 'load' && row.form === 'registerOffset') {
    expect(row.width === 2 && keys(o, ['width', 'destination', 'base', 'index']) && o.width === 'word' &&
      lowRegister(o.destination) && lowRegister(o.base) && lowRegister(o.index), `${scope}: invalid indexed load row`);
    return `ldr ${o.destination}, [${o.base}, ${o.index}]`;
  }
  if (row.operation === 'store' && row.form === 'immediateOffset') {
    expect(row.width === 2 && keys(o, ['width', 'source', 'base', 'offset']) && o.width === 'byte' &&
      lowRegister(o.source) && lowRegister(o.base) && integer(o.offset, 31), `${scope}: invalid store row`);
    return `strb ${o.source}, [${o.base}, #${o.offset}]`;
  }
  if (row.operation === 'bitTest' && row.form === 'lowRegister') {
    expect(row.width === 2 && keys(o, ['left', 'right']) && lowRegister(o.left) && lowRegister(o.right), `${scope}: invalid bit-test row`);
    return `tst ${o.left}, ${o.right}`;
  }
  if (row.operation === 'logicalShiftLeft' && row.form === 'immediate5') {
    expect(row.width === 2 && keys(o, ['destination', 'source', 'amount', 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o.source) && integer(o.amount, 31) && o.setFlags === true, `${scope}: invalid shift row`);
    return `lsls ${o.destination}, ${o.source}, #${o.amount}`;
  }
  if (row.operation === 'logicalShiftRight' && row.form === 'immediate5') {
    expect(row.width === 2 && keys(o, ['destination', 'source', 'amount', 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o.source) && integer(o.amount, 32) && o.amount > 0 && o.setFlags === true, `${scope}: invalid shift row`);
    return `lsrs ${o.destination}, ${o.source}, #${o.amount}`;
  }
  if ((row.operation === 'bitwiseOr' || row.operation === 'bitClear') && row.form === 'lowRegister') {
    const rightKey = row.operation === 'bitwiseOr' ? 'right' : 'mask';
    expect(row.width === 2 && keys(o, ['destination', rightKey, 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o[rightKey]) && o.setFlags === true, `${scope}: invalid bitwise row`);
    return `${row.operation === 'bitwiseOr' ? 'orrs' : 'bics'} ${o.destination}, ${o[rightKey]}`;
  }
  if (row.operation === 'add' && (row.form === 'twoOperandImmediate8' || row.form === 'threeOperandImmediate3')) {
    const maximum = row.form === 'threeOperandImmediate3' ? 7 : 255;
    expect(row.width === 2 && keys(o, ['destination', 'left', 'rightImmediate', 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o.left) && integer(o.rightImmediate, maximum) && o.setFlags === true &&
      (row.form === 'threeOperandImmediate3' || o.destination === o.left), `${scope}: invalid addition row`);
    if (row.form === 'twoOperandImmediate8') return `adds ${o.destination}, #${o.rightImmediate}`;
    const encoding = 0x1c00 | (o.rightImmediate << 6) | (registerNumber(o.left) << 3) | registerNumber(o.destination);
    return `.inst.n 0x${encoding.toString(16).padStart(4, '0')}`;
  }
  if (row.operation === 'add' && row.form === 'lowRegister') {
    expect(row.width === 2 && keys(o, ['destination', 'left', 'right', 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o.left) && lowRegister(o.right) && o.setFlags === true, `${scope}: invalid register addition row`);
    return `adds ${o.destination}, ${o.left}, ${o.right}`;
  }
  if (row.operation === 'subtract' && row.form === 'twoOperandImmediate8') {
    expect(row.width === 2 && keys(o, ['destination', 'left', 'rightImmediate', 'setFlags']) && lowRegister(o.destination) &&
      o.destination === o.left && integer(o.rightImmediate, 255) && o.setFlags === true, `${scope}: invalid subtraction row`);
    return `subs ${o.destination}, #${o.rightImmediate}`;
  }
  if (row.operation === 'address' && row.form === 'pcRelativeImmediate8') {
    expect(row.width === 2 && keys(o, ['destination', 'targetOffset', 'targetIdentity', 'requiredEntryModulo4', 'relocation']) &&
      lowRegister(o.destination) && integer(o.targetOffset, 0xffff) &&
      o.targetIdentity === 'opaque_cross_interval_00302844' && o.requiredEntryModulo4 === 0 && o.relocation === null,
      `${scope}: invalid PC-relative address row`);
    const base = (row.offset + 4) & ~3, displacement = o.targetOffset - base;
    expect(displacement >= 0 && displacement <= 1020 && displacement % 4 === 0, `${scope}: invalid PC-relative displacement`);
    const encoding = 0xa000 | (registerNumber(o.destination) << 8) | (displacement >>> 2);
    return `.inst.n 0x${encoding.toString(16).padStart(4, '0')}`;
  }
  fail(`${scope}: unsupported semantic operation/form ${row.operation}/${row.form}`);
}

function instructionMap(fn) {
  expect(Array.isArray(fn.semantics), `${fn.name}: semantic rows are missing`);
  const map = new Map(), assembly = new Map(), records = [];
  let offset = 0;
  for (const row of fn.semantics) {
    expect(row?.offset === offset && !map.has(offset), `${fn.name}: semantic offsets are not contiguous`);
    const rendered = semanticInstruction(row, fn.name);
    map.set(offset, row); assembly.set(offset, rendered);
    records.push(`${fn.name}:${offset.toString(16)}:${JSON.stringify({ width: row.width, operation: row.operation, form: row.form, operands: row.operands })}`);
    offset += row.width;
  }
  return { entries: fn.semantics, map, assembly, records, size: offset };
}

function validateConfig(config, source) {
  const contract = structuredClone(config); contract.sourceHash = null;
  expect(sha256(Buffer.from(JSON.stringify(contract))) === EXPECTED_CONFIG_CONTRACT, 'configuration contract hash mismatch');
  expect(config.schemaVersion === 3 && config.mode === 'thumb' && config.minimumAlignment === 2, 'unsupported configuration');
  expect(config.source === 'src/main/thumb_leaf_helpers_14.S', 'unexpected source path');
  expect(/^[0-9a-f]{64}$/.test(config.sourceHash) && config.sourceHash !== SENTINEL, 'sourceHash must be a non-sentinel lowercase digest');
  expect(config.sourceHash === EXPECTED_SOURCE_HASH && sha256(source) === config.sourceHash, 'sourceHash mismatch');
  expect(config.totalBodySize === 158 && config.totalAdjacentSize === 0, 'body/adjacent aggregate mismatch');
  expect(config.expectedInstructionCount === 73 && config.wideInstructionCount === 6, 'instruction aggregate mismatch');
  expect(config.legacyNopCount === 0 && config.localBranchCount === 17, 'nop/branch aggregate mismatch');
  expect(config.memoryOperationCount === 15 && config.returnCount === 4, 'memory/return aggregate mismatch');
  expect(config.indirectCallCount === 0 && config.indirectTailCount === 0 && config.directCallCount === 6, 'call aggregate mismatch');
  expect(Array.isArray(config.pcRelativeDataAccesses) && config.pcRelativeDataAccesses.length === 1, 'PC-relative inventory mismatch');
  expect(Array.isArray(config.duplicateBodyClasses) && config.duplicateBodyClasses.length === 0, 'duplicate body inventory must be empty');
  expect(config.functions.length === 1, 'exactly one function is required');

  const allInstructionRecords = [], allLocal = [], allReturns = [], allIndirect = [], allTails = [], allDirect = [];
  const derivedCalls = [], derivedRelocs = [];
  let body = 0, instructions = 0, wideCount = 0, branches = 0, memory = 0, returns = 0, calls = 0;
  for (const fn of config.functions) {
    const fixed = EXPECTED.get(fn.name);
    expect(fixed, `unexpected function ${fn.name}`);
    const schedule = instructionMap(fn);
    expect(schedule.size === fixed.size && fn.size === fixed.size, `${fn.name}: body size mismatch`);
    expect(schedule.entries.length === fixed.instructions && fn.instructionCount === fixed.instructions, `${fn.name}: instruction count mismatch`);
    expect(fn.localBranchCount === fixed.branches && fn.memoryOperationCount === fixed.memory, `${fn.name}: branch/memory count mismatch`);
    expect(fn.returnCount === fixed.returns && fn.directCallCount === fixed.calls, `${fn.name}: return/call count mismatch`);
    expect(fn.indirectCallCount === 0 && fn.indirectTailCount === 0, `${fn.name}: unexpected indirect transfer`);
    expect(fn.legacyNopOffsets.length === 0, `${fn.name}: legacy nop inventory mismatch`);
    const wideEntries = schedule.entries.filter((row) => row.width === 4);
    const memoryEntries = schedule.entries.filter((row) => row.operation === 'stackSave' || row.operation === 'load' || row.operation === 'store' || row.operands.kind === 'return');
    const localEntries = schedule.entries.filter((row) => row.operands.kind === 'branch');
    const returnEntries = schedule.entries.filter((row) => row.operands.kind === 'return');
    const callEntries = schedule.entries.filter((row) => row.operands.kind === 'call');
    expect(memoryEntries.length === fixed.memory, `${fn.name}: derived memory count mismatch`);
    expect(localEntries.length === fixed.branches, `${fn.name}: local transfer count mismatch`);
    expect(returnEntries.length === fixed.returns, `${fn.name}: return schedule count mismatch`);
    expect(callEntries.length === fixed.calls, `${fn.name}: direct-call count mismatch`);
    for (const row of localEntries) {
      expect(row.operands.destinationOffset < fn.size && schedule.map.has(row.operands.destinationOffset), `${fn.name}: local target escapes body`);
      allLocal.push(`${fn.name}:${row.offset.toString(16)}:${JSON.stringify(row.operands)}`);
    }
    for (const row of returnEntries) allReturns.push(`${fn.name}:${row.offset.toString(16)}:${JSON.stringify(row.operands)}`);
    for (const row of callEntries) {
      const o = row.operands;
      derivedCalls.push({ function: fn.name, offset: row.offset, kind: o.kind, destinationSymbol: o.destinationSymbol, destinationState: o.destinationState, stateSwitch: o.stateSwitch, relocation: o.relocation });
      derivedRelocs.push({ function: fn.name, offset: row.offset, type: o.relocation, symbol: o.destinationSymbol });
      allDirect.push(`${fn.name}:${row.offset.toString(16)}:${JSON.stringify(o)}`);
    }
    allInstructionRecords.push(...schedule.records);
    body += fn.size; instructions += fn.instructionCount; wideCount += wideEntries.length;
    branches += localEntries.length; memory += memoryEntries.length; returns += returnEntries.length; calls += callEntries.length;
  }
  expect(EXPECTED.size === config.functions.length, 'missing selected function');
  expect(body === 158 && instructions === 73 && wideCount === 6 && branches === 17 && memory === 15 && returns === 4 && calls === 6, 'derived aggregate mismatch');
  expect(same(config.directCalls, derivedCalls), 'top-level direct-call inventory disagrees');
  expect(same(config.relocations, derivedRelocs), 'top-level relocation inventory disagrees');
  const access = config.pcRelativeDataAccesses[0], address = config.functions[0].semantics.find((row) => row.operation === 'address');
  expect(access.function === config.functions[0].name && access.offset === address.offset &&
    access.targetOffset === address.operands.targetOffset && access.targetIdentity === address.operands.targetIdentity &&
    access.requiredEntryModulo4 === address.operands.requiredEntryModulo4 && access.ownership === 'unowned-cross-interval' &&
    access.relocation === null, 'PC-relative top-level inventory disagrees');
}

function registerNumber(text) {
  const match = text.match(/^r([0-7])$/);
  expect(match, `immediate3 operand is not a low register: ${text}`);
  return Number(match[1]);
}
function referenceSource(config) {
  const lines = ['.syntax unified', '.arch armv6k', '.fpu vfpv2', '.thumb', '.global func_002FF7EC', '.type func_002FF7EC, %function'];
  for (const fn of config.functions) {
    const schedule = instructionMap(fn);
    const targets = new Set(schedule.entries.filter((row) => row.operands.kind === 'branch').map((row) => row.operands.destinationOffset));
    lines.push(`.section .text.${fn.name}, "ax", %progbits`, '.balign 2', `.global ${fn.name}`, `.type ${fn.name}, %function`, '.thumb_func', `${fn.name}:`);
    for (const [offset, instruction] of schedule.assembly) {
      if (targets.has(offset)) lines.push(`.L_${fn.name}_${offset.toString(16)}:`);
      lines.push(`  ${instruction}`);
    }
    lines.push(`.size ${fn.name}, . - ${fn.name}`);
  }
  lines.push('.section .note.GNU-stack, "", %progbits', '');
  return lines.join('\n');
}

function range(buffer, offset, size, what) {
  expect(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset + size <= buffer.length, `${what} is outside object`);
}
function cstring(buffer, section, offset, what) {
  expect(offset >= 0 && offset < section.size, `${what} string offset is invalid`);
  const end = buffer.indexOf(0, section.offset + offset);
  expect(end >= 0 && end < section.offset + section.size, `${what} string is unterminated`);
  return buffer.toString('utf8', section.offset + offset, end);
}
function parseElf(buffer) {
  limit('file', buffer.length, MAX_FILE);
  expect(buffer.length >= 52 && buffer[0] === 0x7f && buffer.toString('ascii', 1, 4) === 'ELF', 'not an ELF file');
  expect(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1, 'expected ELF32 little-endian version 1');
  expect(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40,
    'expected relocatable ARM ELF');
  expect(buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(24) === 0,
    'invalid ELF version or entry point');
  expect(buffer.readUInt32LE(28) === 0 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0,
    'program headers are not permitted');
  expect(buffer.readUInt16LE(40) === 52, 'unexpected ELF header size');
  const shoff = buffer.readUInt32LE(32), shentsize = buffer.readUInt16LE(46);
  let shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  expect(shentsize === 40, 'unexpected section header size');
  range(buffer, shoff, 40, 'section zero');
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  expect(shnum > 0, 'object has no sections'); limit('section count', shnum, MAX_SECTIONS);
  range(buffer, shoff, shnum * shentsize, 'section table');
  if (shstrndx === 0xffff) shstrndx = buffer.readUInt32LE(shoff + 24);
  expect(shstrndx < shnum, 'section-name table index is invalid');
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const header = shoff + index * shentsize;
    sections.push({ index, header, nameOffset: buffer.readUInt32LE(header), type: buffer.readUInt32LE(header + 4), flags: buffer.readUInt32LE(header + 8), offset: buffer.readUInt32LE(header + 16), size: buffer.readUInt32LE(header + 20), link: buffer.readUInt32LE(header + 24), info: buffer.readUInt32LE(header + 28), align: buffer.readUInt32LE(header + 32), entsize: buffer.readUInt32LE(header + 36) });
  }
  const names = sections[shstrndx]; range(buffer, names.offset, names.size, 'section-name table');
  for (const section of sections) section.name = cstring(buffer, names, section.nameOffset, 'section name');
  let executable = 0;
  for (const section of sections) {
    if (section.type !== 8 && section.size) range(buffer, section.offset, section.size, `section ${section.name}`);
    if (section.flags & 4) { executable += section.size; limit('executable payload', executable, MAX_EXEC); }
  }
  const symbols = [], maps = new Map(); let symbolCount = 0;
  for (const section of sections.filter((item) => item.type === 2 || item.type === 11)) {
    expect(section.entsize >= 16 && section.size % section.entsize === 0 && section.link < sections.length, 'invalid symbol table');
    const count = section.size / section.entsize; symbolCount += count; limit('symbol count', symbolCount, MAX_SYMBOLS);
    const strings = sections[section.link]; expect(strings.type === 3, 'symbol names are not a string table');
    const table = new Map(); maps.set(section.index, table);
    for (let index = 0; index < count; index++) {
      const entry = section.offset + index * section.entsize, nameOffset = buffer.readUInt32LE(entry);
      const symbol = { table: section.index, index, entry, nameOffset, name: cstring(buffer, strings, nameOffset, 'symbol'), value: buffer.readUInt32LE(entry + 4), size: buffer.readUInt32LE(entry + 8), info: buffer[entry + 12], other: buffer[entry + 13], shndx: buffer.readUInt16LE(entry + 14) };
      symbols.push(symbol); table.set(index, symbol);
    }
  }
  const relocs = []; let relocationCount = 0;
  for (const section of sections.filter((item) => item.type === 9 || item.type === 4)) {
    const minimum = section.type === 9 ? 8 : 12;
    expect(section.entsize >= minimum && section.size % section.entsize === 0 && section.info < sections.length, 'invalid relocation section');
    const count = section.size / section.entsize; relocationCount += count; limit('relocation count', relocationCount, MAX_RELOCS);
    const table = maps.get(section.link); expect(table, 'relocation symbol table is invalid');
    for (let index = 0; index < count; index++) {
      const entry = section.offset + index * section.entsize, info = buffer.readUInt32LE(entry + 4), symbol = table.get(info >>> 8);
      expect(symbol, 'relocation symbol index is invalid');
      relocs.push({ section: section.index, target: section.info, offset: buffer.readUInt32LE(entry), type: info & 255, symbol: symbol.name });
    }
  }
  return { buffer, sections, symbols, relocs, sectionCount: shnum, symbolCount, relocationCount, executable };
}
function bytes(elf, section) { return elf.buffer.subarray(section.offset, section.offset + section.size); }
function selectedSection(elf, fn) {
  const matches = elf.sections.filter((section) => section.name === `.text.${fn.name}`);
  expect(matches.length === 1, `${fn.name}: selected section missing or duplicated`);
  const section = matches[0];
  expect(section.type === 1 && (section.flags & 6) === 6, `${fn.name}: selected section is not executable PROGBITS`);
  expect(section.size === fn.size, `${fn.name}: selected section size mismatch`);
  expect(section.align === 2, `${fn.name}: selected section alignment must be exactly two`);
  return section;
}
function validateObject(buffer, reference, config) {
  const elf = parseElf(buffer);
  for (const fn of config.functions) {
    const section = selectedSection(elf, fn), expected = selectedSection(reference, fn);
    expect(bytes(elf, section).equals(bytes(reference, expected)), `${fn.name}: instruction semantics differ from canonical schedule`);
    const named = elf.symbols.filter((symbol) => symbol.name === fn.name);
    expect(named.length === 1, `${fn.name}: selected-name collision`);
    const symbol = named[0];
    expect(symbol.shndx === section.index && symbol.value === 1 && symbol.size === fn.size &&
      (symbol.info >> 4) === 1 && (symbol.info & 15) === 2 && (symbol.other & 3) === 0,
    `${fn.name}: function symbol contract mismatch`);
    const mappings = elf.symbols.filter((item) => item.shndx === section.index && /^\$(?:t|d|a)(?:\.|$)/.test(item.name));
    expect(mappings.length === 1 && mappings[0].name.startsWith('$t') && (mappings[0].value & ~1) === 0 &&
      mappings[0].size === 0 && mappings[0].info === 0 && (mappings[0].other & 3) === 0,
    `${fn.name}: Thumb mapping-symbol contract mismatch`);
    const unexpected = elf.symbols.filter((item) => item.shndx === section.index && item.name &&
      item !== symbol && item !== mappings[0]);
    expect(unexpected.length === 0, `${fn.name}: unexpected named alias or owner`);
    const actualRelocs = elf.relocs.filter((item) => item.target === section.index).map((item) => ({ offset: item.offset, type: item.type, symbol: item.symbol }));
    const wantedRelocs = fn.semantics.filter((row) => row.operands.kind === 'call')
      .map((row) => ({ offset: row.offset, type: 10, symbol: row.operands.destinationSymbol }));
    expect(same(actualRelocs, wantedRelocs), `${fn.name}: relocation inventory mismatch`);
    const address = fn.semantics.find((row) => row.operation === 'address');
    const halfword = bytes(elf, section).readUInt16LE(address.offset);
    expect((halfword & 0xf800) === 0xa000, `${fn.name}: PC-relative row is not an address-forming instruction`);
    const target = ((address.offset + 4) & ~3) + ((halfword & 0xff) << 2);
    expect(target === address.operands.targetOffset && address.operands.requiredEntryModulo4 === 0,
      `${fn.name}: PC-relative opaque identity placement mismatch`);
    for (const other of elf.sections) {
      if (other.index !== section.index && other.type === 1 && (other.flags & 4) && other.size === section.size)
        expect(!bytes(elf, other).equals(bytes(elf, section)), `${fn.name}: unexpected duplicate executable body`);
    }
  }
  const destination = elf.symbols.filter((symbol) => symbol.name === 'func_002FF7EC');
  expect(destination.length === 1, 'func_002FF7EC: destination-name collision');
  expect((destination[0].info >> 4) === 1 && (destination[0].info & 15) === 2,
    'func_002FF7EC: destination must be a global function');
  if (destination[0].shndx === 0) expect(destination[0].value === 0, 'func_002FF7EC: undefined ARM destination has nonzero value');
  else {
    expect(destination[0].shndx < elf.sections.length && (elf.sections[destination[0].shndx].flags & 4),
      'func_002FF7EC: defined destination is not executable');
    expect((destination[0].value & 1) === 0, 'func_002FF7EC: destination is not ARM state');
  }
  return elf;
}

function tool(kind) {
  const explicit = process.env[`ARM_NONE_EABI_${kind.toUpperCase()}`];
  if (explicit) return explicit;
  const prefix = process.env.CROSS_COMPILE ?? process.env.ARM_NONE_EABI_PREFIX ?? 'arm-none-eabi-';
  if (prefix === 'arm-none-eabi-' && existsSync(`${PINNED_TOOL_PREFIX}${kind}`)) return `${PINNED_TOOL_PREFIX}${kind}`;
  return `${prefix}${kind}`;
}
function run(program, args) {
  const result = spawnSync(program, args, { encoding: 'utf8' });
  if (result.error) fail(`could not run ${program}: ${result.error.message}`);
  expect(result.status === 0, `${program} failed:\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  expect(!(result.stderr ?? '').trim(), `${program} emitted warnings:\n${result.stderr}`);
}
function assemble(source, object) { run(tool('gcc'), ['-c', '-x', 'assembler-with-cpp', '-mthumb', '-march=armv6k', '-Wall', '-Wextra', '-Werror', source, '-o', object]); }
function mutateHeader(buffer, section, field, value) { const copy = Buffer.from(buffer); copy.writeUInt32LE(value, section.header + field); return copy; }
function mustReject(label, action) { let rejected = false; try { action(); } catch { rejected = true; } expect(rejected, `self-test did not reject ${label}`); }

function selfTest(source, config, sourceBuffer, sourceElf, reference, temp) {
  validateObject(sourceBuffer, reference, config);
  const fn = config.functions[0], section = selectedSection(sourceElf, fn);
  const badByte = Buffer.from(sourceBuffer); badByte[section.offset] ^= 1;
  mustReject('instruction mutation', () => validateObject(badByte, reference, config));
  mustReject('owned trailing byte', () => validateObject(mutateHeader(sourceBuffer, section, 20, section.size + 1), reference, config));
  mustReject('selected alignment mutation', () => validateObject(mutateHeader(sourceBuffer, section, 32, 4), reference, config));
  const thumb = sourceElf.symbols.find((item) => item.shndx === section.index && item.name === '$t');
  expect(thumb, 'self-test baseline lacks Thumb mapping symbol');
  const badMap = Buffer.from(sourceBuffer), symtab = sourceElf.sections[thumb.table], strings = sourceElf.sections[symtab.link];
  badMap[strings.offset + thumb.nameOffset + 1] = 0x64;
  mustReject('data mapping mutation', () => validateObject(badMap, reference, config));
  const victim = sourceElf.symbols.find((item) => item.shndx === 0 && item.name && !EXPECTED.has(item.name));
  const selected = sourceElf.symbols.find((item) => item.name === fn.name);
  expect(victim && selected, 'self-test symbol victim missing');
  const collision = Buffer.from(sourceBuffer); collision.writeUInt32LE(selected.nameOffset, victim.entry);
  mustReject('selected-name collision', () => validateObject(collision, reference, config));
  const extraOwner = Buffer.from(sourceBuffer);
  extraOwner.writeUInt32LE(1, victim.entry + 4); extraOwner.writeUInt32LE(fn.size, victim.entry + 8); extraOwner[victim.entry + 12] = 0x12; extraOwner.writeUInt16LE(section.index, victim.entry + 14);
  mustReject('extra executable ownership', () => validateObject(extraOwner, reference, config));
  mustReject('source digest sentinel', () => validateConfig({ ...config, sourceHash: SENTINEL }, source));
  const hostileConfig = structuredClone(config); hostileConfig.functions[0].semantics[1].operands.destination = 'r5';
  mustReject('semantic configuration mutation', () => validateConfig(hostileConfig, source));
  mustReject('source cap', () => limit('source', MAX_SOURCE + 1, MAX_SOURCE));
  mustReject('config cap', () => limit('config', MAX_SOURCE + 1, MAX_SOURCE));
  mustReject('file cap', () => limit('file', MAX_FILE + 1, MAX_FILE));
  const badType = Buffer.from(sourceBuffer); badType.writeUInt16LE(2, 16);
  mustReject('non-relocatable ELF type', () => parseElf(badType));
  const badVersion = Buffer.from(sourceBuffer); badVersion[6] = 0;
  mustReject('invalid ELF identification version', () => parseElf(badVersion));
  const badProgramHeaders = Buffer.from(sourceBuffer);
  badProgramHeaders.writeUInt32LE(52, 28); badProgramHeaders.writeUInt16LE(32, 42); badProgramHeaders.writeUInt16LE(1, 44);
  mustReject('unexpected program headers', () => parseElf(badProgramHeaders));
  const badSectionHeaderSize = Buffer.from(sourceBuffer); badSectionHeaderSize.writeUInt16LE(44, 46);
  mustReject('noncanonical section header size', () => parseElf(badSectionHeaderSize));
  mustReject('executable cap', () => parseElf(mutateHeader(sourceBuffer, section, 20, MAX_EXEC + 1)));
  const tooManySections = Buffer.from(sourceBuffer); tooManySections.writeUInt16LE(MAX_SECTIONS + 1, 48);
  mustReject('section cap', () => parseElf(tooManySections));
  const symSection = sourceElf.sections.find((item) => item.type === 2);
  mustReject('symbol cap', () => parseElf(mutateHeader(sourceBuffer, symSection, 20, (MAX_SYMBOLS + 1) * symSection.entsize)));
  const relSection = sourceElf.sections.find((item) => item.type === 9);
  mustReject('relocation cap', () => parseElf(mutateHeader(sourceBuffer, relSection, 20, (MAX_RELOCS + 1) * relSection.entsize)));

  const foreignSource = join(temp, 'foreign.S'), foreignObject = join(temp, 'foreign.o'), composite = join(temp, 'composite.o');
  let foreign = '.syntax unified\n.thumb\n';
  for (let index = 0; index < 12_001; index++) {
    foreign += `.section .hostile_${index}, "ax", %progbits\n`;
    if (index === 0) foreign += '.global foreign_global_alias_victim\nforeign_global_alias_victim:\n.type foreign_local_alias_victim, %object\nforeign_local_alias_victim:\n';
    foreign += `.byte ${index & 255}\n`;
  }
  foreign += '.section .note.GNU-stack, "", %progbits\n';
  writeFileSync(foreignSource, foreign);
  assemble(foreignSource, foreignObject);
  run(tool('ld'), ['-r', join(temp, 'source.o'), foreignObject, '-o', composite]);
  const compositeBuffer = boundedRead(composite, MAX_FILE, 'object'), compositeElf = validateObject(compositeBuffer, reference, config);
  const executableSections = compositeElf.sections.filter((item) => (item.flags & 4) && item.size > 0).length;
  expect(executableSections > 12_001 && compositeElf.executable >= 12_159, 'foreign composite did not exercise >12,000 nonempty foreign executable sections');
  const selectedCompositeSection = selectedSection(compositeElf, fn);
  for (const [label, name, info] of [
    ['global NOTYPE alias', 'foreign_global_alias_victim', 0x10],
    ['local OBJECT alias', 'foreign_local_alias_victim', 0x01],
  ]) {
    const hostile = Buffer.from(compositeBuffer);
    const alias = compositeElf.symbols.find((item) => item.name === name);
    expect(alias, `self-test baseline lacks ${name}`);
    hostile.writeUInt32LE(1, alias.entry + 4);
    hostile[alias.entry + 12] = info;
    hostile.writeUInt16LE(selectedCompositeSection.index, alias.entry + 14);
    mustReject(label, () => validateObject(hostile, reference, config));
  }
  console.log(`self-test: ok (${compositeElf.sectionCount} sections, ${compositeElf.executable} executable bytes)`);
}

function main() {
  const configBuffer = boundedRead(CONFIG_PATH, MAX_SOURCE, 'config');
  const source = boundedRead(SOURCE_PATH, MAX_SOURCE, 'source');
  let config; try { config = JSON.parse(configBuffer.toString('utf8')); } catch (error) { fail(`invalid config JSON: ${error.message}`); }
  validateConfig(config, source);
  const temp = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-14-'));
  try {
    const referenceSourcePath = join(temp, 'reference.S'), referenceObjectPath = join(temp, 'reference.o');
    writeFileSync(referenceSourcePath, referenceSource(config)); assemble(referenceSourcePath, referenceObjectPath);
    const reference = parseElf(boundedRead(referenceObjectPath, MAX_FILE, 'reference object'));
    const sourceObjectPath = join(temp, 'source.o'); assemble(SOURCE_PATH, sourceObjectPath);
    const sourceBuffer = boundedRead(sourceObjectPath, MAX_FILE, 'object'), sourceElf = validateObject(sourceBuffer, reference, config);
    const args = process.argv.slice(2), self = args.includes('--self-test'), objectArg = args.find((item) => item !== '--self-test');
    if (objectArg) validateObject(boundedRead(resolve(objectArg), MAX_FILE, 'object'), reference, config);
    if (self) selfTest(source, config, sourceBuffer, sourceElf, reference, temp);
    console.log(`thumb-leaf-helpers-14: ok (${config.totalBodySize} bytes, ${config.expectedInstructionCount} instructions, ${config.directCallCount} relocations)`);
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

try { main(); } catch (error) { console.error(`thumb-leaf-helpers-14: ${error.message}`); process.exitCode = 1; }
