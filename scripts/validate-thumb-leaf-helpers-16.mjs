#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/thumb-leaf-helpers-16.json');
const SPEC_PATH = join(ROOT, 'docs/specs/main/thumb_leaf_helpers_16.md');
const SOURCE_PATH = join(ROOT, 'src/main/thumb_leaf_helpers_16.S');
const KNOWN_PREFIX = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';
const LIMIT = Object.freeze({ file: 64 * 1024 * 1024, object: 16 * 1024 * 1024, executable: 16 * 1024 * 1024, sections: 16_384, symbols: 1_000_000, relocations: 1_000_000 });
const HASH = Object.freeze({
  config: '3f760e7a48af084d4c5eaf3542c20cf32e24653dd76be2cf419d0dcf9c0b7bf4',
  normalizedConfig: '36594764d38bdcb3ececa6b34cd17a6b4ef1dc4299c275a0248a2c952f124185',
  specification: '96b1c0502b8f34d45839221cc085952f55c25ec5ca73e994553d4f6653614aac',
});
const EXPECTED = new Map([
  ['func_0010046E', { size: 2, instructions: 1, memory: 0, returns: 0, calls: 0, tails: 1, next: 'func_0010048A', nextOffset: 28 }],
  ['func_00102008', { size: 8, instructions: 3, memory: 2, returns: 1, calls: 1, tails: 0, next: 'func_00102046', nextOffset: 62 }],
  ['func_00102E30', { size: 2, instructions: 1, memory: 0, returns: 0, calls: 0, tails: 1, next: 'func_00102E4A', nextOffset: 26 }],
]);
const EXTERNAL_IDENTITIES = [
  { symbol: 'thumb_secondary_00100474', kind: 'secondary-entry', state: 'thumb', targetOffset: 6, ownership: 'external-unowned-post-body', objectSymbol: false, precedingGlobal: { symbol: 'func_0010046E', offset: 0, bodySize: 2, bodyEndOffset: 2 }, followingGlobal: { symbol: 'func_0010048A', offset: 28 } },
  { symbol: 'thumb_secondary_00102E34', kind: 'secondary-entry', state: 'thumb', targetOffset: 4, ownership: 'external-unowned-post-body', objectSymbol: false, precedingGlobal: { symbol: 'func_00102E30', offset: 0, bodySize: 2, bodyEndOffset: 2 }, followingGlobal: { symbol: 'func_00102E4A', offset: 26 } },
  { symbol: 'thumb_secondary_00300AA0', kind: 'secondary-entry', state: 'thumb', targetOffset: 2091672, ownership: 'external-unowned', objectSymbol: true, precedingGlobal: { symbol: 'func_00300A48', offset: 2091584, bodySize: 24, bodyEndOffset: 2091608 }, followingGlobal: { symbol: 'func_00300ABC', offset: 2091700 } },
];

function fail(message) { throw new Error(message); }
function expect(condition, message) { if (!condition) fail(message); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function keys(value, expected) { return value && typeof value === 'object' && same(Object.keys(value).sort(), [...expected].sort()); }
function limit(label, value, maximum) {
  expect(Number.isSafeInteger(value) && value >= 0, `${label} size/count is invalid`);
  expect(value <= maximum, `${label} exceeds limit ${maximum}`);
}
function boundedRead(name, maximum, label) {
  const stat = statSync(name);
  expect(stat.isFile(), `${label} is not a regular file: ${name}`);
  limit(label, stat.size, maximum);
  return readFileSync(name);
}
function registers(values, link = false) {
  return Array.isArray(values) && values.length > 0 && new Set(values).size === values.length &&
    values.every((value) => /^r[0-7]$/.test(value) || (link && value === 'lr'));
}

function semanticInstruction(row, functionName) {
  expect(keys(row, ['offset', 'width', 'operation', 'form', 'operands']) &&
    Number.isInteger(row.offset) && row.offset >= 0 && (row.width === 2 || row.width === 4) &&
    row.operands && typeof row.operands === 'object', `${functionName}: malformed semantic row`);
  const o = row.operands;
  if (row.operation === 'stackSave' && row.form === 'registerList') {
    expect(row.width === 2 && keys(o, ['registers']) && registers(o.registers, true) &&
      same(o.registers, ['r4', 'lr']), `${functionName}: invalid stack-save row`);
    return `push {${o.registers.join(', ')}}`;
  }
  if (row.operation === 'transfer' && row.form === 'stackRestore' && o.kind === 'return') {
    expect(row.width === 2 && keys(o, ['kind', 'restoredRegisters']) &&
      same(o.restoredRegisters, ['r4']), `${functionName}: invalid return row`);
    return `pop {${o.restoredRegisters.join(', ')}, pc}`;
  }
  if (row.operation === 'transfer' && row.form === 'directImmediate' && o.kind === 'call') {
    expect(row.width === 4 && keys(o, ['kind', 'destinationSymbol', 'destinationState', 'stateSwitch', 'targetOffset', 'relocation', 'implicitAddend']) &&
      o.destinationSymbol === 'thumb_secondary_00300AA0' && o.destinationState === 'thumb' &&
      o.stateSwitch === false && o.targetOffset === 2091672 &&
      o.relocation === 'R_ARM_THM_CALL' && o.implicitAddend === -4,
    `${functionName}: invalid direct-call row`);
    return `bl ${o.destinationSymbol}`;
  }
  if (row.operation === 'transfer' && row.form === 'directImmediate16' && o.kind === 'tail') {
    expect(row.width === 2 && keys(o, ['kind', 'condition', 'destinationSymbol', 'destinationState', 'stateSwitch', 'targetOffset', 'relocation', 'implicitAddend']) &&
      o.condition === 'always' && /^thumb_secondary_[0-9A-F]{8}$/.test(o.destinationSymbol) &&
      o.destinationState === 'thumb' && o.stateSwitch === false && o.relocation === null && o.implicitAddend === null,
    `${functionName}: invalid direct-tail row`);
    const displacement = o.targetOffset - 4;
    expect((displacement & 1) === 0 && displacement >= -2048 && displacement <= 2046,
      `${functionName}: tail target is outside Thumb-16 range`);
    const encoding = 0xe000 | ((displacement >> 1) & 0x7ff);
    return `.inst.n 0x${encoding.toString(16).padStart(4, '0')}`;
  }
  fail(`${functionName}: unsupported semantic operation/form ${row.operation}/${row.form}`);
}

function schedule(fn) {
  expect(Array.isArray(fn.semantics), `${fn.name}: semantic schedule is missing`);
  const rendered = [], rows = [];
  let offset = 0;
  for (const row of fn.semantics) {
    expect(row.offset === offset, `${fn.name}: semantic offsets are not contiguous`);
    rows.push(row); rendered.push(semanticInstruction(row, fn.name)); offset += row.width;
  }
  return { rows, rendered, size: offset };
}

function validateObjectContract(contract) {
  expect(contract && contract.elfClass === 'ELF32' && contract.endianness === 'little' &&
    contract.fileType === 'ET_REL' && contract.machine === 'EM_ARM' && contract.elfVersion === 1 &&
    contract.osAbi === 'ELFOSABI_NONE' && contract.abiVersion === 0 && contract.flags === 0x05000000,
  'ELF object contract mismatch');
  expect(contract.executableSectionType === 'SHT_PROGBITS' &&
    same(contract.executableSectionFlags, ['SHF_ALLOC', 'SHF_EXECINSTR']) && contract.executableSectionAlignment === 2,
  'executable-section contract mismatch');
  expect(contract.primarySymbolBinding === 'STB_GLOBAL' && contract.primarySymbolType === 'STT_FUNC' &&
    contract.primarySymbolVisibility === 'STV_DEFAULT' && contract.primarySymbolOther === 0 && contract.primarySymbolThumbValue === 1,
  'primary-symbol contract mismatch');
  expect(contract.mappingSymbol === '$t' && contract.mappingSymbolBinding === 'STB_LOCAL' &&
    contract.mappingSymbolType === 'STT_NOTYPE' && contract.mappingSymbolVisibility === 'STV_DEFAULT' && contract.mappingSymbolValue === 0,
  'mapping-symbol contract mismatch');
  expect(contract.sectionSymbolBinding === 'STB_LOCAL' && contract.sectionSymbolType === 'STT_SECTION',
    'section-symbol contract mismatch');
  expect(contract.externalSymbolBinding === 'STB_GLOBAL' && contract.externalSymbolType === 'STT_FUNC' &&
    contract.externalSymbolVisibility === 'STV_DEFAULT' && contract.externalSymbolOther === 0 &&
    contract.externalSymbolSectionIndex === 'SHN_UNDEF' && contract.externalSymbolValue === 0 && contract.externalSymbolSize === 0,
  'external-symbol contract mismatch');
  expect(contract.relocationSectionType === 'SHT_REL' && same(contract.namedAliases, []) && same(contract.unnamedAliases, []),
    'relocation/alias contract mismatch');
}

function validateConfig(config, source, configBuffer, specification) {
  expect(sha256(configBuffer) === HASH.config, 'configuration digest mismatch');
  const normalized = structuredClone(config); normalized.sourceHash = null;
  expect(sha256(JSON.stringify(normalized)) === HASH.normalizedConfig, 'normalized configuration contract mismatch');
  expect(sha256(specification) === HASH.specification, 'specification digest mismatch');
  expect(config.schemaVersion === 3 && config.mode === 'thumb' && config.minimumAlignment === 2,
    'unsupported configuration header');
  expect(config.source === 'src/main/thumb_leaf_helpers_16.S', 'unexpected source path');
  expect(/^[0-9a-f]{64}$/.test(config.sourceHash) && sha256(source) === config.sourceHash,
    'sourceHash mismatch');
  expect(config.totalBodySize === 12 && config.totalAdjacentSize === 0 &&
    config.expectedInstructionCount === 5 && config.wideInstructionCount === 1,
  'body/instruction aggregate mismatch');
  expect(config.legacyNopCount === 0 && config.localBranchCount === 0 && config.memoryOperationCount === 2 &&
    config.returnCount === 1 && config.indirectCallCount === 0 && config.indirectTailCount === 0 &&
    config.directCallCount === 1 && config.directTailCount === 2,
  'operation aggregate mismatch');
  expect(same(config.pcRelativeDataAccesses, []) && same(config.duplicateBodyClasses, []),
    'empty inventories mismatch');
  expect(same(config.externalEntryIdentities, EXTERNAL_IDENTITIES), 'external-entry identity contract mismatch');
  validateObjectContract(config.objectContract);
  expect(config.semanticEncoding?.instructionRows === 'ordered objects with explicit byte offset and width' &&
    config.semanticEncoding?.registers === 'architectural register roles are named in operands' &&
    config.semanticEncoding?.directTransfers === 'transfer rows name the destination identity and state, signed entry-relative target offset, relocation status, and implicit addend' &&
    config.semanticEncoding?.externalIdentities === 'secondary destinations are neutral linkage identities and do not transfer ownership',
  'semantic-encoding contract mismatch');
  expect(Array.isArray(config.encodingConstraints) && same(config.encodingConstraints.map((x) => x.form),
    ['directImmediate16', 'directImmediate', 'thumbCodeMapping', 'sectionOwnership']),
  'encoding-constraint inventory mismatch');
  expect(Array.isArray(config.functions) && config.functions.length === EXPECTED.size, 'selected function count mismatch');

  const calls = [], tails = [], relocations = [];
  let body = 0, instructions = 0, wide = 0, memory = 0, returns = 0;
  for (const fn of config.functions) {
    const fixed = EXPECTED.get(fn.name);
    expect(fixed, `unexpected function ${fn.name}`);
    const s = schedule(fn);
    expect(fn.size === fixed.size && s.size === fixed.size, `${fn.name}: body size mismatch`);
    expect(fn.instructionCount === fixed.instructions && s.rows.length === fixed.instructions,
      `${fn.name}: instruction count mismatch`);
    expect(fn.legacyNopOffsets?.length === 0 && fn.localBranchCount === 0 &&
      fn.memoryOperationCount === fixed.memory && fn.returnCount === fixed.returns &&
      fn.indirectCallCount === 0 && fn.indirectTailCount === 0 &&
      fn.directCallCount === fixed.calls && fn.directTailCount === fixed.tails,
    `${fn.name}: function inventory mismatch`);
    expect(fn.nextGlobal === fixed.next && fn.nextGlobalOffset === fixed.nextOffset && fn.size < fn.nextGlobalOffset,
      `${fn.name}: ownership boundary mismatch`);
    const derivedMemory = s.rows.filter((row) => row.operation === 'stackSave' || row.form === 'stackRestore');
    const derivedReturns = s.rows.filter((row) => row.operands.kind === 'return');
    const derivedCalls = s.rows.filter((row) => row.operands.kind === 'call');
    const derivedTails = s.rows.filter((row) => row.operands.kind === 'tail');
    expect(derivedMemory.length === fixed.memory && derivedReturns.length === fixed.returns &&
      derivedCalls.length === fixed.calls && derivedTails.length === fixed.tails,
    `${fn.name}: derived semantic counts mismatch`);
    for (const row of derivedCalls) {
      const o = row.operands;
      calls.push({ function: fn.name, offset: row.offset, kind: o.kind, destinationSymbol: o.destinationSymbol,
        destinationState: o.destinationState, stateSwitch: o.stateSwitch, targetOffset: o.targetOffset,
        relocation: o.relocation, implicitAddend: o.implicitAddend });
      relocations.push({ function: fn.name, offset: row.offset, type: o.relocation, symbol: o.destinationSymbol,
        format: 'REL', implicitAddend: o.implicitAddend });
    }
    for (const row of derivedTails) {
      const o = row.operands;
      expect(o.targetOffset >= fn.size && o.targetOffset < fn.nextGlobalOffset,
        `${fn.name}: tail target is not in the unowned post-body interval`);
      tails.push({ function: fn.name, offset: row.offset, kind: o.kind, destinationSymbol: o.destinationSymbol,
        destinationState: o.destinationState, stateSwitch: o.stateSwitch, targetOffset: o.targetOffset,
        relocation: o.relocation, implicitAddend: o.implicitAddend });
    }
    body += fn.size; instructions += fn.instructionCount;
    wide += s.rows.filter((row) => row.width === 4).length;
    memory += derivedMemory.length; returns += derivedReturns.length;
  }
  expect(new Set(config.functions.map((fn) => fn.name)).size === EXPECTED.size, 'duplicate or missing selected function');
  expect(body === 12 && instructions === 5 && wide === 1 && memory === 2 && returns === 1,
    'derived aggregate mismatch');
  expect(same(config.directCalls, calls), 'direct-call inventory mismatch');
  expect(same(config.directTails, tails), 'direct-tail inventory mismatch');
  expect(same(config.relocations, relocations), 'relocation inventory mismatch');
}

function renderSource(config) {
  const lines = ['/* Clean-room implementation derived solely from thumb-leaf-helpers-16.json. */', '.syntax unified', '.thumb'];
  for (const fn of config.functions) {
    const s = schedule(fn);
    lines.push('', `.section .text.${fn.name}, "ax", %progbits`, '.balign 2', `.global ${fn.name}`,
      `.type ${fn.name}, %function`, '.thumb_func', `${fn.name}:`);
    for (const instruction of s.rendered) {
      if (instruction === 'bl thumb_secondary_00300AA0') {
        lines.push('  .global thumb_secondary_00300AA0', '  .type thumb_secondary_00300AA0, %function');
      }
      lines.push(`  ${instruction}`);
    }
    lines.push(`.size ${fn.name}, . - ${fn.name}`);
  }
  lines.push('', '.section .note.GNU-stack, "", %progbits', '');
  return Buffer.from(lines.join('\n'));
}

function range(buffer, offset, size, label) {
  expect(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset + size <= buffer.length, `${label} is outside the object`);
}
function cstring(buffer, section, offset, label) {
  expect(offset >= 0 && offset < section.size, `${label} string offset is invalid`);
  const start = section.offset + offset, end = buffer.indexOf(0, start);
  expect(end >= start && end < section.offset + section.size, `${label} string is unterminated`);
  return buffer.toString('utf8', start, end);
}
function parseElf(buffer) {
  limit('object', buffer.length, LIMIT.object);
  expect(buffer.length >= 52 && buffer[0] === 0x7f && buffer.toString('ascii', 1, 4) === 'ELF', 'not an ELF object');
  expect(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    'ELF identity contract mismatch');
  expect(buffer.subarray(9, 16).every((byte) => byte === 0), 'ELF identity padding is nonzero');
  expect(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 &&
    buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(36) === 0x05000000,
  'ELF header contract mismatch');
  expect(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 && buffer.readUInt16LE(40) === 52 &&
    buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0 && buffer.readUInt16LE(46) === 40,
  'ELF entry point, program headers, or header sizes are invalid');
  const shoff = buffer.readUInt32LE(32), shentsize = buffer.readUInt16LE(46);
  let shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  expect(shentsize === 40, 'section header size is invalid'); range(buffer, shoff, 40, 'section zero');
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  expect(shnum > 0, 'object has no sections'); limit('section count', shnum, LIMIT.sections);
  range(buffer, shoff, shnum * shentsize, 'section table');
  if (shstrndx === 0xffff) shstrndx = buffer.readUInt32LE(shoff + 24);
  expect(shstrndx < shnum, 'section-name table index is invalid');
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const header = shoff + index * shentsize;
    sections.push({ index, header, nameOffset: buffer.readUInt32LE(header), type: buffer.readUInt32LE(header + 4),
      flags: buffer.readUInt32LE(header + 8), address: buffer.readUInt32LE(header + 12),
      offset: buffer.readUInt32LE(header + 16), size: buffer.readUInt32LE(header + 20),
      link: buffer.readUInt32LE(header + 24), info: buffer.readUInt32LE(header + 28), align: buffer.readUInt32LE(header + 32),
      entsize: buffer.readUInt32LE(header + 36) });
  }
  expect(Object.entries(sections[0]).every(([key, value]) => ['index', 'header'].includes(key) || value === 0),
    'section zero is not canonical null');
  const names = sections[shstrndx]; expect(shstrndx > 0 && names.type === 3, 'section-name table is invalid');
  range(buffer, names.offset, names.size, 'section-name table');
  for (const section of sections) section.name = cstring(buffer, names, section.nameOffset, 'section name');
  let executable = 0;
  for (const section of sections) {
    expect(section.align === 0 || (section.align & (section.align - 1)) === 0, `${section.name}: invalid alignment`);
    if (section.type !== 8 && section.size) range(buffer, section.offset, section.size, `section ${section.name}`);
    if (section.flags & 4) { executable += section.size; limit('executable payload', executable, LIMIT.executable); }
  }
  const symbols = [], tables = new Map(); let symbolCount = 0;
  for (const section of sections.filter((item) => item.type === 2 || item.type === 11)) {
    expect(section.entsize === 16 && section.size % section.entsize === 0 && section.link < sections.length,
      'invalid symbol table');
    const count = section.size / section.entsize; symbolCount += count; limit('symbol count', symbolCount, LIMIT.symbols);
    const strings = sections[section.link]; expect(strings.type === 3, 'symbol-name section is not a string table');
    const table = new Map(); tables.set(section.index, table);
    for (let index = 0; index < count; index++) {
      const entry = section.offset + index * section.entsize, nameOffset = buffer.readUInt32LE(entry);
      const symbol = { table: section.index, index, entry, nameOffset, name: cstring(buffer, strings, nameOffset, 'symbol'),
        value: buffer.readUInt32LE(entry + 4), size: buffer.readUInt32LE(entry + 8), info: buffer[entry + 12],
        other: buffer[entry + 13], shndx: buffer.readUInt16LE(entry + 14) };
      symbols.push(symbol); table.set(index, symbol);
    }
    const zero = table.get(0);
    expect(zero && zero.name === '' && zero.value === 0 && zero.size === 0 && zero.info === 0 &&
      zero.other === 0 && zero.shndx === 0, `${section.name}: symbol zero is not canonical null`);
  }
  const relocations = []; let relocationCount = 0;
  for (const section of sections.filter((item) => item.type === 9 || item.type === 4)) {
    const minimum = section.type === 9 ? 8 : 12;
    expect(section.entsize === minimum && section.size % section.entsize === 0 &&
      section.link < sections.length && section.info < sections.length, 'invalid relocation section');
    const count = section.size / section.entsize; relocationCount += count;
    limit('relocation count', relocationCount, LIMIT.relocations);
    const table = tables.get(section.link); expect(table, 'relocation symbol table is invalid');
    for (let index = 0; index < count; index++) {
      const entry = section.offset + index * section.entsize, info = buffer.readUInt32LE(entry + 4), symbol = table.get(info >>> 8);
      expect(symbol, 'relocation symbol index is invalid');
      const offset = buffer.readUInt32LE(entry), target = sections[section.info];
      expect(offset <= target.size && 4 <= target.size - offset, 'relocation is outside its target section');
      relocations.push({ section: section.index, sectionType: section.type, target: section.info,
        offset, type: info & 255, symbol: symbol.name });
    }
  }
  return { buffer, sections, symbols, relocations, sectionCount: shnum, executable };
}
function sectionBytes(elf, section) { return elf.buffer.subarray(section.offset, section.offset + section.size); }
function selectedSection(elf, fn) {
  const matches = elf.sections.filter((section) => section.name === `.text.${fn.name}`);
  expect(matches.length === 1, `${fn.name}: selected section is missing or duplicated`);
  const section = matches[0];
  expect(section.type === 1 && section.flags === 6 && section.address === 0 && section.size === fn.size &&
    section.link === 0 && section.info === 0 && section.align === 2 && section.entsize === 0,
    `${fn.name}: executable-section contract mismatch`);
  return section;
}

function validateObject(buffer, reference, config) {
  const elf = parseElf(buffer);
  const selected = new Map();
  const symbolTables = elf.sections.filter((section) => section.type === 2 || section.type === 11);
  expect(symbolTables.length === 1, 'object must contain exactly one symbol table');
  const symbolTable = symbolTables[0], tableSymbols = elf.symbols.filter((symbol) => symbol.table === symbolTable.index);
  expect(symbolTable.type === 2 && symbolTable.flags === 0 && symbolTable.address === 0 &&
    symbolTable.align === 4 && symbolTable.entsize === 16 && symbolTable.info > 0 &&
    symbolTable.info <= tableSymbols.length && tableSymbols.every((symbol, index) =>
      ((symbol.info >>> 4) === 0) === (index < symbolTable.info)),
  'symbol-table attributes or local/global partition mismatch');
  for (const fn of config.functions) {
    const section = selectedSection(elf, fn), expected = selectedSection(reference, fn);
    selected.set(fn.name, section);
    expect(sectionBytes(elf, section).equals(sectionBytes(reference, expected)),
      `${fn.name}: encoded instruction semantics mismatch`);
    const named = elf.symbols.filter((symbol) => symbol.name === fn.name);
    expect(named.length === 1, `${fn.name}: selected-name collision`);
    const primary = named[0];
    expect(primary.shndx === section.index && primary.value === 1 && primary.size === fn.size &&
      primary.info === 0x12 && primary.other === 0, `${fn.name}: primary-symbol contract mismatch`);
    const sectionSymbols = elf.symbols.filter((symbol) => symbol.shndx === section.index && (symbol.info & 15) === 3);
    expect(sectionSymbols.length === 1 && sectionSymbols[0].info === 0x03 && sectionSymbols[0].other === 0 &&
      sectionSymbols[0].name === '' && sectionSymbols[0].value === 0 && sectionSymbols[0].size === 0,
    `${fn.name}: section-symbol contract mismatch`);
    const mappings = elf.symbols.filter((symbol) => symbol.shndx === section.index && /^\$(?:t|d|a)(?:\.|$)/.test(symbol.name));
    expect(mappings.length === 1 && mappings[0].name === '$t' && mappings[0].value === 0 &&
      mappings[0].size === 0 && mappings[0].info === 0 && mappings[0].other === 0,
    `${fn.name}: Thumb mapping contract mismatch`);
    const allSectionSymbols = elf.symbols.filter((symbol) => symbol.shndx === section.index);
    expect(allSectionSymbols.length === 3 && allSectionSymbols.includes(primary) &&
      allSectionSymbols.includes(sectionSymbols[0]) && allSectionSymbols.includes(mappings[0]),
    `${fn.name}: named or unnamed symbol alias is present`);
    const owners = elf.symbols.filter((symbol) => symbol.shndx === section.index &&
      (symbol.info >> 4) !== 0 && (symbol.info & 15) === 2);
    expect(owners.length === 1 && owners[0] === primary, `${fn.name}: extra executable ownership or alias`);
    const wanted = config.relocations.filter((row) => row.function === fn.name)
      .map((row) => ({ sectionType: 9, offset: row.offset, type: 10, symbol: row.symbol }));
    const actual = elf.relocations.filter((row) => row.target === section.index)
      .map((row) => ({ sectionType: row.sectionType, offset: row.offset, type: row.type, symbol: row.symbol }));
    expect(same(actual, wanted), `${fn.name}: relocation inventory mismatch`);
  }
  const externalName = 'thumb_secondary_00300AA0';
  const external = elf.symbols.filter((symbol) => symbol.name === externalName);
  expect(external.length === 1 && external[0].shndx === 0 && external[0].value === 0 && external[0].size === 0 &&
    external[0].info === 0x12 && external[0].other === 0, 'external call identity contract mismatch');
  for (const name of ['thumb_secondary_00100474', 'thumb_secondary_00102E34'])
    expect(!elf.symbols.some((symbol) => symbol.name === name), `${name}: non-relocated tail identity leaked into symbol table`);
  expect(elf.relocations.length === 1, 'object contains an extra relocation');
  const relocationSections = elf.sections.filter((section) => section.type === 9 || section.type === 4);
  const callSection = selected.get('func_00102008');
  expect(relocationSections.length === 1 && relocationSections[0].name === '.rel.text.func_00102008' &&
    relocationSections[0].type === 9 && relocationSections[0].flags === 0x40 &&
    relocationSections[0].address === 0 && relocationSections[0].size === 8 &&
    relocationSections[0].link === symbolTable.index && relocationSections[0].info === callSection.index &&
    relocationSections[0].align === 4 && relocationSections[0].entsize === 8,
  'relocation-section ownership or attributes mismatch');
  const selectedSections = new Set(selected.values());
  for (const [name, section] of selected) {
    for (const other of elf.sections) {
      if (!selectedSections.has(other) && other.type === 1 && (other.flags & 4) && other.size === section.size)
        expect(!sectionBytes(elf, other).equals(sectionBytes(elf, section)), `${name}: unexpected duplicate executable body`);
    }
  }
  return elf;
}

function tool(kind) {
  const explicit = process.env[`ARM_NONE_EABI_${kind.toUpperCase()}`];
  if (explicit) return explicit;
  const prefix = process.env.CROSS_COMPILE ?? process.env.ARM_NONE_EABI_PREFIX;
  if (prefix) return `${prefix}${kind}`;
  if (existsSync(`${KNOWN_PREFIX}${kind}`)) return `${KNOWN_PREFIX}${kind}`;
  return `arm-none-eabi-${kind}`;
}
function run(program, args) {
  const result = spawnSync(program, args, { encoding: 'utf8', maxBuffer: LIMIT.file });
  if (result.error) fail(`could not run ${program}: ${result.error.message}`);
  expect(result.status === 0, `${program} failed:\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  expect(!(result.stderr ?? '').trim(), `${program} emitted warnings:\n${result.stderr}`);
}
function assemble(source, object) {
  run(tool('gcc'), ['-c', '-x', 'assembler-with-cpp', '-mthumb', '-march=armv6k', '-Wall', '-Wextra', '-Werror', source, '-o', object]);
}
function mutateHeader(buffer, section, field, value) {
  const copy = Buffer.from(buffer); copy.writeUInt32LE(value, section.header + field); return copy;
}
function mustReject(label, action) {
  let rejected = false; try { action(); } catch { rejected = true; }
  expect(rejected, `self-test did not reject ${label}`);
}

function selfTest(config, source, configBuffer, specification, objectBuffer, objectElf, reference, temp) {
  validateObject(objectBuffer, reference, config);
  const fn = config.functions[0], section = selectedSection(objectElf, fn);
  const badByte = Buffer.from(objectBuffer); badByte[section.offset] ^= 1;
  mustReject('instruction mutation', () => validateObject(badByte, reference, config));
  mustReject('owned trailing byte', () => validateObject(mutateHeader(objectBuffer, section, 20, section.size + 1), reference, config));
  mustReject('section alignment', () => validateObject(mutateHeader(objectBuffer, section, 32, 4), reference, config));
  mustReject('section type', () => validateObject(mutateHeader(objectBuffer, section, 4, 8), reference, config));
  mustReject('section flags', () => validateObject(mutateHeader(objectBuffer, section, 8, 7), reference, config));
  mustReject('owned section link', () => validateObject(mutateHeader(objectBuffer, section, 24, 1), reference, config));
  const mapping = objectElf.symbols.find((symbol) => symbol.shndx === section.index && symbol.name === '$t');
  const primary = objectElf.symbols.find((symbol) => symbol.name === fn.name);
  const external = objectElf.symbols.find((symbol) => symbol.name === 'thumb_secondary_00300AA0');
  expect(mapping && primary && external, 'self-test baseline symbols are missing');
  const badMap = Buffer.from(objectBuffer); badMap[mapping.entry + 13] = 1;
  mustReject('mapping visibility', () => validateObject(badMap, reference, config));
  const sectionSymbol = objectElf.symbols.find((symbol) => symbol.shndx === section.index && (symbol.info & 15) === 3);
  const badSectionSymbol = Buffer.from(objectBuffer);
  badSectionSymbol.writeUInt32LE(primary.nameOffset, sectionSymbol.entry);
  mustReject('named section symbol', () => validateObject(badSectionSymbol, reference, config));
  const badPrimary = Buffer.from(objectBuffer); badPrimary[primary.entry + 12] = 0x11;
  mustReject('primary type', () => validateObject(badPrimary, reference, config));
  const badExternal = Buffer.from(objectBuffer); badExternal.writeUInt16LE(section.index, external.entry + 14);
  mustReject('defined external identity', () => validateObject(badExternal, reference, config));
  const relocation = objectElf.relocations[0], relocationSection = objectElf.sections[relocation.section];
  const badRelocation = Buffer.from(objectBuffer);
  const relocationEntry = relocationSection.offset;
  badRelocation.writeUInt32LE((badRelocation.readUInt32LE(relocationEntry + 4) & ~0xff) | 30, relocationEntry + 4);
  mustReject('relocation type', () => validateObject(badRelocation, reference, config));
  mustReject('RELA substitution', () => validateObject(mutateHeader(objectBuffer, relocationSection, 4, 4), reference, config));
  mustReject('relocation-section flags', () => validateObject(mutateHeader(objectBuffer, relocationSection, 8, 0), reference, config));
  mustReject('relocation ownership', () => validateObject(mutateHeader(objectBuffer, relocationSection, 28, section.index), reference, config));
  mustReject('source digest', () => validateConfig({ ...config, sourceHash: '0'.repeat(64) }, source, configBuffer, specification));
  const configDrift = structuredClone(config); configDrift.functions[0].size = 4;
  mustReject('normalized config drift', () => validateConfig(configDrift, source, configBuffer, specification));
  const configBytesDrift = Buffer.concat([configBuffer, Buffer.from('\n')]);
  mustReject('config digest', () => validateConfig(config, source, configBytesDrift, specification));
  mustReject('specification digest', () => validateConfig(config, source, configBuffer,
    Buffer.concat([specification, Buffer.from('\n')])));
  mustReject('file cap', () => limit('file', LIMIT.file + 1, LIMIT.file));
  mustReject('object cap', () => limit('object', LIMIT.object + 1, LIMIT.object));
  mustReject('executable cap', () => parseElf(mutateHeader(objectBuffer, section, 20, LIMIT.executable + 1)));
  const tooManySections = Buffer.from(objectBuffer); tooManySections.writeUInt16LE(LIMIT.sections + 1, 48);
  mustReject('section cap', () => parseElf(tooManySections));
  const symtab = objectElf.sections.find((item) => item.type === 2);
  mustReject('symbol-table partition', () => validateObject(mutateHeader(objectBuffer, symtab, 28, symtab.info + 1), reference, config));
  const nullSymbol = objectElf.symbols.find((symbol) => symbol.table === symtab.index && symbol.index === 0);
  const badNullSymbol = Buffer.from(objectBuffer); badNullSymbol[nullSymbol.entry + 13] = 1;
  mustReject('canonical null symbol', () => validateObject(badNullSymbol, reference, config));
  const badNullSection = Buffer.from(objectBuffer); badNullSection.writeUInt32LE(1, objectElf.sections[0].header + 8);
  mustReject('canonical null section', () => validateObject(badNullSection, reference, config));
  mustReject('symbol cap', () => parseElf(mutateHeader(objectBuffer, symtab, 20, (LIMIT.symbols + 1) * symtab.entsize)));
  mustReject('relocation cap', () => parseElf(mutateHeader(objectBuffer, relocationSection, 20, (LIMIT.relocations + 1) * relocationSection.entsize)));

  const foreignSource = join(temp, 'foreign.S'), foreignObject = join(temp, 'foreign.o'), composite = join(temp, 'composite.o');
  let foreign = '.syntax unified\n.thumb\n';
  for (let index = 0; index < 12_000; index++) foreign += `.section .hostile_${index}, "ax", %progbits\n.byte ${index & 255}\n`;
  foreign += '.section .note.GNU-stack, "", %progbits\n';
  writeFileSync(foreignSource, foreign); assemble(foreignSource, foreignObject);
  run(tool('ld'), ['-r', join(temp, 'source.o'), foreignObject, '-o', composite]);
  const compositeElf = validateObject(boundedRead(composite, LIMIT.object, 'composite object'), reference, config);
  expect(compositeElf.sectionCount > 12_000 && compositeElf.executable >= 12_012,
    'hostile composite did not exercise the large-section path');
  console.log(`self-test: ok (${compositeElf.sectionCount} sections, ${compositeElf.executable} executable bytes)`);
}

function main() {
  const configBuffer = boundedRead(CONFIG_PATH, LIMIT.file, 'config');
  const specification = boundedRead(SPEC_PATH, LIMIT.file, 'specification');
  const source = boundedRead(SOURCE_PATH, LIMIT.file, 'source');
  let config;
  try { config = JSON.parse(configBuffer.toString('utf8')); } catch (error) { fail(`invalid config JSON: ${error.message}`); }
  validateConfig(config, source, configBuffer, specification);
  expect(source.equals(renderSource(config)), 'source does not exactly implement the neutral semantic schedule');
  const args = process.argv.slice(2), self = args.includes('--self-test'), objectArgs = args.filter((item) => item !== '--self-test');
  expect(objectArgs.length <= 1, 'usage: validate-thumb-leaf-helpers-16.mjs [--self-test] [object]');
  const temp = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-16-'));
  try {
    const referenceSourcePath = join(temp, 'reference.S'), referenceObjectPath = join(temp, 'reference.o');
    writeFileSync(referenceSourcePath, renderSource(config)); assemble(referenceSourcePath, referenceObjectPath);
    const reference = parseElf(boundedRead(referenceObjectPath, LIMIT.object, 'reference object'));
    const sourceObjectPath = join(temp, 'source.o'); assemble(SOURCE_PATH, sourceObjectPath);
    const sourceBuffer = boundedRead(sourceObjectPath, LIMIT.object, 'source object');
    const sourceElf = validateObject(sourceBuffer, reference, config);
    if (objectArgs[0]) validateObject(boundedRead(resolve(objectArgs[0]), LIMIT.object, 'object'), reference, config);
    if (self) selfTest(config, source, configBuffer, specification, sourceBuffer, sourceElf, reference, temp);
    console.log(`thumb-leaf-helpers-16: ok (${config.totalBodySize} bytes, ${config.expectedInstructionCount} instructions, ${config.relocations.length} relocation)`);
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

try { main(); } catch (error) {
  console.error(`thumb-leaf-helpers-16: ${error.message}`); process.exitCode = 1;
}
