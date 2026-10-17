#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/thumb-leaf-helpers-15.json');
const SOURCE_PATH = join(ROOT, 'src/main/thumb_leaf_helpers_15.S');
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_ENTRIES = 1_000_000;
const ELF_FLAGS = 0x05000000;
const PINNED_TOOL_PREFIX = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';
const EXPECTED_SOURCE_HASH = '5b63305b27568b6c687f1d812599fbf5044636a0e0223d944fd86a8bf3d605b6';
const EXPECTED_CONFIG_CONTRACT = '46f85812d54ab601251c32cf122659372110b66380ca3fa1df9ba7f9d71f28b4';
const FUNCTION = 'func_00303EC8';
const SECONDARY = 'thumb_secondary_00303E38';

function fail(message) { throw new Error(message); }
function expect(value, message) { if (!value) fail(message); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function keys(value, wanted) { return same(Object.keys(value).sort(), [...wanted].sort()); }
function limit(kind, value, maximum) {
  expect(Number.isSafeInteger(value) && value >= 0, `${kind} is invalid`);
  expect(value <= maximum, `${kind} exceeds limit ${maximum}`);
}
function boundedRead(path, maximum, kind) {
  let stat;
  try { stat = statSync(path); } catch { fail(`cannot read ${kind}: ${path}`); }
  expect(stat.isFile(), `${kind} is not a regular file: ${path}`);
  limit(`${kind} size`, stat.size, maximum);
  return readFileSync(path);
}
function lowRegister(value) { return typeof value === 'string' && /^r[0-7]$/.test(value); }
function registers(value, link = false) {
  return Array.isArray(value) && value.length > 0 && new Set(value).size === value.length &&
    value.every((item) => lowRegister(item) || (link && item === 'lr'));
}

function render(row) {
  expect(row && typeof row === 'object' && keys(row, ['offset', 'width', 'operation', 'form', 'operands']) &&
    Number.isInteger(row.offset) && (row.width === 2 || row.width === 4) && row.operands && typeof row.operands === 'object',
  'malformed semantic row');
  const o = row.operands;
  if (row.operation === 'stackSave' && row.form === 'registerList') {
    expect(row.width === 2 && keys(o, ['registers']) && registers(o.registers, true) && o.registers.includes('lr'), 'invalid stack save');
    return `push {${o.registers.join(', ')}}`;
  }
  if (row.operation === 'logicalShiftLeft' && row.form === 'immediate5') {
    expect(row.width === 2 && keys(o, ['destination', 'source', 'amount', 'setFlags']) && lowRegister(o.destination) &&
      lowRegister(o.source) && Number.isInteger(o.amount) && o.amount >= 0 && o.amount <= 31 && o.setFlags === true, 'invalid immediate-five shift');
    return `lsls ${o.destination}, ${o.source}, #${o.amount}`;
  }
  if (row.operation === 'constant' && row.form === 'immediate8') {
    expect(row.width === 2 && keys(o, ['destination', 'value', 'setFlags']) && lowRegister(o.destination) &&
      Number.isInteger(o.value) && o.value >= 0 && o.value <= 255 && o.setFlags === true, 'invalid immediate-eight constant');
    return `movs ${o.destination}, #${o.value}`;
  }
  if (row.operation === 'copy' && row.form === 'highRegister') {
    expect(row.width === 2 && keys(o, ['destination', 'source', 'setFlags']) && lowRegister(o.destination) &&
      o.source === 'sp' && o.setFlags === false, 'invalid high-register copy');
    return `mov ${o.destination}, ${o.source}`;
  }
  if (row.operation === 'transfer' && row.form === 'directImmediate') {
    expect(row.width === 4 && keys(o, ['kind', 'destinationSymbol', 'destinationState', 'stateSwitch', 'relocation']) &&
      o.kind === 'call' && o.destinationSymbol === SECONDARY && o.destinationState === 'thumb' &&
      o.stateSwitch === false && o.relocation === 'R_ARM_THM_CALL', 'invalid direct call');
    return `bl ${o.destinationSymbol}`;
  }
  if (row.operation === 'transfer' && row.form === 'stackRestore') {
    expect(row.width === 2 && keys(o, ['kind', 'restoredRegisters']) && o.kind === 'return' &&
      registers(o.restoredRegisters) && !o.restoredRegisters.includes('lr'), 'invalid stack restore');
    return `pop {${o.restoredRegisters.join(', ')}, pc}`;
  }
  fail(`unsupported semantic row: ${row.operation}/${row.form}`);
}

function semanticSchedule(fn) {
  expect(Array.isArray(fn.semantics), 'semantic rows are missing');
  const assembly = [];
  let offset = 0;
  for (const row of fn.semantics) {
    expect(row.offset === offset, 'semantic offsets are not contiguous');
    assembly.push(render(row));
    offset += row.width;
  }
  return { assembly, size: offset };
}

function validateConfig(config, source) {
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  expect(sha256(Buffer.from(JSON.stringify(normalized))) === EXPECTED_CONFIG_CONTRACT, 'configuration contract hash mismatch');
  expect(config.schemaVersion === 3 && config.source === 'src/main/thumb_leaf_helpers_15.S' && config.mode === 'thumb' &&
    config.minimumAlignment === 2, 'configuration identity mismatch');
  expect(config.sourceHash === EXPECTED_SOURCE_HASH && sha256(source) === EXPECTED_SOURCE_HASH, 'source digest mismatch');
  expect(config.totalBodySize === 14 && config.totalAdjacentSize === 0 && config.expectedInstructionCount === 6 &&
    config.wideInstructionCount === 1 && config.legacyNopCount === 0 && config.localBranchCount === 0 &&
    config.memoryOperationCount === 2 && config.returnCount === 1 && config.indirectCallCount === 0 &&
    config.indirectTailCount === 0 && config.directCallCount === 1, 'configuration aggregate mismatch');
  expect(same(config.pcRelativeDataAccesses, []) && same(config.duplicateBodyClasses, []), 'unexpected data access or duplicate ownership');
  expect(Array.isArray(config.functions) && config.functions.length === 1, 'exactly one function is required');
  const fn = config.functions[0], schedule = semanticSchedule(fn);
  expect(fn.name === FUNCTION && fn.size === 14 && fn.instructionCount === 6 && fn.localBranchCount === 0 &&
    fn.memoryOperationCount === 2 && fn.returnCount === 1 && fn.indirectCallCount === 0 && fn.indirectTailCount === 0 &&
    fn.directCallCount === 1 && same(fn.legacyNopOffsets, []) && fn.nextGlobal === 'func_00303ED8' &&
    fn.nextGlobalOffset === 16 && schedule.size === 14, 'function contract mismatch');
  const wide = fn.semantics.filter((row) => row.width === 4);
  const memory = fn.semantics.filter((row) => row.operation === 'stackSave' || row.form === 'stackRestore');
  const calls = fn.semantics.filter((row) => row.operation === 'transfer' && row.operands.kind === 'call');
  expect(wide.length === 1 && memory.length === 2 && calls.length === 1 && calls[0].offset === 8, 'derived semantic totals mismatch');
  const wantedCall = [{ function: FUNCTION, offset: 8, kind: 'call', destinationSymbol: SECONDARY,
    destinationState: 'thumb', stateSwitch: false, relocation: 'R_ARM_THM_CALL' }];
  expect(same(config.directCalls, wantedCall), 'direct-call inventory mismatch');
  expect(same(config.relocations, [{ function: FUNCTION, offset: 8, type: 'R_ARM_THM_CALL', symbol: SECONDARY }]), 'relocation inventory mismatch');
  expect(Array.isArray(config.externalEntryIdentities) && config.externalEntryIdentities.length === 1, 'external identity inventory mismatch');
  const identity = config.externalEntryIdentities[0];
  expect(same(identity, { symbol: SECONDARY, kind: 'secondary-entry', state: 'thumb', targetOffset: -144,
    ownership: 'external-unowned', precedingGlobal: { symbol: 'func_00303D9C', offset: -300, bodySize: 152, bodyEndOffset: -148 },
    followingGlobal: { symbol: FUNCTION, offset: 0 } }), 'secondary-entry relation mismatch');
  expect(Array.isArray(config.encodingConstraints) && config.encodingConstraints.length === 5, 'encoding constraint inventory mismatch');
  return { fn, assembly: schedule.assembly };
}

function referenceSource(assembly) {
  return ['.syntax unified', '.arch armv6k', '.fpu vfpv2', '.thumb', `.global ${SECONDARY}`, `.type ${SECONDARY}, %function`,
    `.section .text.${FUNCTION}, "ax", %progbits`, '.balign 2', `.global ${FUNCTION}`, `.type ${FUNCTION}, %function`,
    '.thumb_func', `${FUNCTION}:`, ...assembly.map((line) => `  ${line}`), `.size ${FUNCTION}, . - ${FUNCTION}`,
    '.section .note.GNU-stack, "", %progbits', ''].join('\n');
}

function range(buffer, offset, size, what) {
  expect(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= buffer.length && size <= buffer.length - offset, `${what} is outside the object`);
}
function cstring(buffer, section, offset, what) {
  expect(section.type === 3 && Number.isInteger(offset) && offset >= 0 && offset < section.size, `${what} string offset is invalid`);
  const start = section.offset + offset, end = buffer.indexOf(0, start);
  expect(end >= start && end < section.offset + section.size, `${what} string is unterminated`);
  return buffer.toString('utf8', start, end);
}
function parseElf(buffer) {
  limit('file size', buffer.length, MAX_FILE);
  expect(buffer.length >= 52 && buffer[0] === 0x7f && buffer.toString('ascii', 1, 4) === 'ELF', 'not an ELF file');
  expect(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    'expected ELF32 little-endian System V ABI version 0');
  expect(buffer.subarray(9, 16).every((byte) => byte === 0), 'nonzero ELF identification padding');
  expect(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 && buffer.readUInt32LE(20) === 1, 'expected ET_REL ELF32 ARM');
  expect(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 && buffer.readUInt32LE(36) === ELF_FLAGS &&
    buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0 && buffer.readUInt16LE(40) === 52,
    'malformed relocatable ELF header');
  const shoff = buffer.readUInt32LE(32), shentsize = buffer.readUInt16LE(46);
  expect(shoff >= 52 && shentsize === 40, 'malformed section table header');
  range(buffer, shoff, 40, 'section zero');
  let shnum = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  expect(shnum > 0); limit('section count', shnum, MAX_SECTIONS);
  range(buffer, shoff, shnum * 40, 'section table');
  if (shstrndx === 0xffff) shstrndx = buffer.readUInt32LE(shoff + 24);
  expect(shstrndx > 0 && shstrndx < shnum, 'invalid section-name table index');
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const header = shoff + index * 40;
    const section = { index, header, nameOffset: buffer.readUInt32LE(header), type: buffer.readUInt32LE(header + 4),
      flags: buffer.readUInt32LE(header + 8), addr: buffer.readUInt32LE(header + 12), offset: buffer.readUInt32LE(header + 16),
      size: buffer.readUInt32LE(header + 20), link: buffer.readUInt32LE(header + 24), info: buffer.readUInt32LE(header + 28),
      align: buffer.readUInt32LE(header + 32), entsize: buffer.readUInt32LE(header + 36) };
    expect(section.align === 0 || (section.align & (section.align - 1)) === 0, `section ${index} has invalid alignment`);
    if (section.type !== 8) range(buffer, section.offset, section.size, `section ${index}`);
    else expect(section.offset <= buffer.length, `NOBITS section ${index} has invalid offset`);
    sections.push(section);
  }
  expect(sections[0].nameOffset === 0 && sections[0].type === 0 && sections[0].flags === 0 && sections[0].addr === 0 && sections[0].offset === 0 &&
    sections[0].size === 0 && sections[0].link === 0 && sections[0].info === 0 && sections[0].align === 0 &&
    sections[0].entsize === 0, 'noncanonical null section');
  const names = sections[shstrndx];
  expect(names.type === 3, 'section-name table is not STRTAB');
  for (const section of sections) section.name = cstring(buffer, names, section.nameOffset, 'section name');
  let executable = 0;
  for (const section of sections) if (section.flags & 4) {
    limit(`executable section ${section.name} size`, section.size, MAX_EXEC);
    executable += section.size; limit('executable payload', executable, MAX_EXEC);
  }
  const symbols = [], tables = new Map(); let entries = 0;
  for (const section of sections.filter((item) => item.type === 2 || item.type === 11)) {
    expect(section.entsize === 16 && section.size % 16 === 0 && section.link < shnum && sections[section.link].type === 3,
      'malformed symbol table');
    const count = section.size / 16; entries += count; limit('symbol and relocation entries', entries, MAX_ENTRIES);
    const table = new Map(); tables.set(section.index, table);
    for (let index = 0; index < count; index++) {
      const entry = section.offset + index * 16;
      const symbol = { table: section.index, index, entry, nameOffset: buffer.readUInt32LE(entry),
        value: buffer.readUInt32LE(entry + 4), size: buffer.readUInt32LE(entry + 8), info: buffer[entry + 12],
        other: buffer[entry + 13], shndx: buffer.readUInt16LE(entry + 14) };
      symbol.name = cstring(buffer, sections[section.link], symbol.nameOffset, 'symbol');
      expect(symbol.shndx < shnum || symbol.shndx >= 0xff00, 'symbol has invalid section index');
      symbols.push(symbol); table.set(index, symbol);
    }
  }
  const relocs = [];
  for (const section of sections.filter((item) => item.type === 9 || item.type === 4)) {
    const size = section.type === 9 ? 8 : 12;
    expect(section.entsize === size && section.size % size === 0 && section.link < shnum && section.info < shnum,
      'malformed relocation section');
    const table = tables.get(section.link); expect(table, 'relocation links invalid symbol table');
    const count = section.size / size; entries += count; limit('symbol and relocation entries', entries, MAX_ENTRIES);
    for (let index = 0; index < count; index++) {
      const entry = section.offset + index * size, info = buffer.readUInt32LE(entry + 4), symbol = table.get(info >>> 8);
      expect(symbol, 'relocation has invalid symbol index');
      relocs.push({ target: section.info, offset: buffer.readUInt32LE(entry), type: info & 255, symbol: symbol.name });
    }
  }
  return { buffer, sections, symbols, relocs, sectionCount: shnum, executable, entries };
}
function sectionBytes(elf, section) { return elf.buffer.subarray(section.offset, section.offset + section.size); }
function selectedSection(elf) {
  const matches = elf.sections.filter((section) => section.name === `.text.${FUNCTION}`);
  expect(matches.length === 1, 'selected section missing or duplicated');
  const section = matches[0];
  expect(section.type === 1 && section.flags === 6 && section.addr === 0 && section.size === 14 && section.align === 2,
    'selected section type, flags, size, or alignment mismatch');
  return section;
}
function uniqueSymbol(elf, name) {
  const matches = elf.symbols.filter((symbol) => symbol.name === name);
  expect(matches.length === 1, `${name}: missing or collided symbol`);
  return matches[0];
}
function validateObject(buffer, reference) {
  const elf = parseElf(buffer), section = selectedSection(elf), expected = selectedSection(reference);
  expect(sectionBytes(elf, section).equals(sectionBytes(reference, expected)), 'instruction encoding differs from independent semantic reference');
  const fn = uniqueSymbol(elf, FUNCTION);
  expect(fn.shndx === section.index && fn.value === 1 && fn.size === 14 && fn.info === 0x12 && fn.other === 0,
    'selected function symbol contract mismatch');
  const mappings = elf.symbols.filter((symbol) => symbol.shndx === section.index && /^\$(?:t|d|a)(?:\.|$)/.test(symbol.name));
  expect(mappings.length === 1 && mappings[0].name.startsWith('$t') && mappings[0].value === 0 && mappings[0].size === 0 &&
    mappings[0].info === 0 && mappings[0].other === 0, 'continuous Thumb mapping contract mismatch');
  const aliases = elf.symbols.filter((symbol) => symbol.shndx === section.index && symbol !== fn && symbol !== mappings[0] &&
    !(symbol.name === '' && symbol.info === 3 && symbol.value === 0 && symbol.size === 0 && symbol.other === 0));
  expect(aliases.length === 0, 'unexpected alias or executable owner in selected body');
  const selectedRelocs = elf.relocs.filter((reloc) => reloc.target === section.index);
  expect(same(selectedRelocs, [{ target: section.index, offset: 8, type: 10, symbol: SECONDARY }]), 'selected relocation contract mismatch');
  const secondary = uniqueSymbol(elf, SECONDARY);
  expect(secondary.info === 0x12 && secondary.other === 0 && secondary.size === 0, 'secondary identity is not an unowned global function entry');
  if (secondary.shndx === 0) expect(secondary.value === 0, 'undefined secondary identity has a value');
  else {
    expect(secondary.shndx < elf.sections.length && secondary.shndx !== section.index &&
      (elf.sections[secondary.shndx].flags & 4) !== 0 && (secondary.value & 1) === 1, 'defined secondary identity is not external Thumb code');
    const preceding = uniqueSymbol(elf, 'func_00303D9C');
    expect(preceding.shndx === secondary.shndx && preceding.info === 0x12 && preceding.other === 0 &&
      (preceding.value & 1) === 0 && preceding.size === 152,
      'preceding ARM global relation mismatch');
    expect((secondary.value & ~1) - preceding.value === 156, 'secondary offset from preceding global mismatch');
  }
  for (const other of elf.sections) if (other.index !== section.index && other.type === 1 && (other.flags & 4) && other.size === 14)
    expect(!sectionBytes(elf, other).equals(sectionBytes(elf, section)), 'unexpected duplicate executable body');
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
  const result = spawnSync(program, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 30_000 });
  if (result.error) fail(`could not run ${program}: ${result.error.message}`);
  expect(result.status === 0, `${program} failed:\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  expect(!(result.stderr ?? '').trim(), `${program} emitted warnings:\n${result.stderr}`);
}
function assemble(source, object) {
  run(tool('gcc'), ['-c', '-x', 'assembler-with-cpp', '-mthumb', '-march=armv6k', '-Wall', '-Wextra', '-Werror', source, '-o', object]);
}
function mutateSection(buffer, section, field, value) { const result = Buffer.from(buffer); result.writeUInt32LE(value, section.header + field); return result; }
function mustReject(label, action) { let rejected = false; try { action(); } catch { rejected = true; } expect(rejected, `self-test accepted ${label}`); }

function selfTest(config, source, sourceBuffer, sourceElf, reference, temp) {
  validateObject(sourceBuffer, reference);
  const section = selectedSection(sourceElf), fn = uniqueSymbol(sourceElf, FUNCTION), secondary = uniqueSymbol(sourceElf, SECONDARY);
  const byte = Buffer.from(sourceBuffer); byte[section.offset + 2] ^= 1;
  mustReject('instruction mutation', () => validateObject(byte, reference));
  mustReject('owned post-body gap', () => validateObject(mutateSection(sourceBuffer, section, 20, 16), reference));
  mustReject('selected alignment mutation', () => validateObject(mutateSection(sourceBuffer, section, 32, 4), reference));
  const mapping = sourceElf.symbols.find((symbol) => symbol.shndx === section.index && symbol.name === '$t');
  const mapNames = sourceElf.sections[sourceElf.sections[mapping.table].link], dataMap = Buffer.from(sourceBuffer);
  dataMap[mapNames.offset + mapping.nameOffset + 1] = 0x64;
  mustReject('interior data mapping', () => validateObject(dataMap, reference));
  const collision = Buffer.from(sourceBuffer); collision.writeUInt32LE(fn.nameOffset, secondary.entry);
  mustReject('selected-name collision', () => validateObject(collision, reference));
  const alias = Buffer.from(sourceBuffer); alias.writeUInt32LE(1, secondary.entry + 4); alias.writeUInt16LE(section.index, secondary.entry + 14);
  mustReject('extra executable owner', () => validateObject(alias, reference));
  const badDestination = Buffer.from(sourceBuffer); badDestination[secondary.entry + 12] = 0x10;
  mustReject('secondary identity state/type mutation', () => validateObject(badDestination, reference));
  const rel = sourceElf.sections.find((item) => item.type === 9 && item.info === section.index), badReloc = Buffer.from(sourceBuffer);
  badReloc.writeUInt32LE((secondary.index << 8) | 28, rel.offset + 4);
  mustReject('relocation mutation', () => validateObject(badReloc, reference));
  const badConfig = structuredClone(config); badConfig.functions[0].semantics[1].operands.amount = 1;
  mustReject('semantic configuration mutation', () => validateConfig(badConfig, source));
  mustReject('source mutation', () => validateConfig(config, Buffer.concat([source, Buffer.from('\n')])));
  const badType = Buffer.from(sourceBuffer); badType.writeUInt16LE(2, 16);
  mustReject('non-ET_REL header', () => parseElf(badType));
  const badClass = Buffer.from(sourceBuffer); badClass[4] = 2;
  mustReject('non-ELF32 header', () => parseElf(badClass));
  const badOsAbi = Buffer.from(sourceBuffer); badOsAbi[7] = 3;
  mustReject('ELF OSABI mutation', () => parseElf(badOsAbi));
  const badAbiVersion = Buffer.from(sourceBuffer); badAbiVersion[8] = 1;
  mustReject('ELF ABI version mutation', () => parseElf(badAbiVersion));
  const badFlags = Buffer.from(sourceBuffer); badFlags.writeUInt32LE(ELF_FLAGS ^ 1, 36);
  mustReject('ARM EABI flags mutation', () => parseElf(badFlags));
  const badProgram = Buffer.from(sourceBuffer); badProgram.writeUInt32LE(52, 28); badProgram.writeUInt16LE(32, 42); badProgram.writeUInt16LE(1, 44);
  mustReject('program headers', () => parseElf(badProgram));
  const badShent = Buffer.from(sourceBuffer); badShent.writeUInt16LE(44, 46);
  mustReject('malformed section headers', () => parseElf(badShent));
  const badNull = mutateSection(sourceBuffer, sourceElf.sections[0], 8, 1);
  mustReject('noncanonical null section', () => parseElf(badNull));
  const badOther = Buffer.from(sourceBuffer); badOther[fn.entry + 13] = 0x80;
  mustReject('reserved symbol visibility bits', () => validateObject(badOther, reference));
  const manySections = Buffer.from(sourceBuffer); manySections.writeUInt16LE(MAX_SECTIONS + 1, 48);
  mustReject('section count cap', () => parseElf(manySections));
  mustReject('executable size cap', () => parseElf(mutateSection(sourceBuffer, section, 20, MAX_EXEC + 1)));
  const symtab = sourceElf.sections.find((item) => item.type === 2);
  mustReject('symbol/relocation entry cap', () => parseElf(mutateSection(sourceBuffer, symtab, 20, (MAX_ENTRIES + 1) * 16)));
  const badSymEnt = Buffer.from(sourceBuffer); badSymEnt.writeUInt32LE(20, symtab.header + 36);
  mustReject('malformed symbol entry size', () => parseElf(badSymEnt));
  const badRelLink = Buffer.from(sourceBuffer); badRelLink.writeUInt32LE(sourceElf.sections.length + 1, rel.header + 24);
  mustReject('malformed relocation link', () => parseElf(badRelLink));

  const foreignSource = join(temp, 'foreign.S'), foreignObject = join(temp, 'foreign.o'), composite = join(temp, 'composite.o');
  const lines = ['.syntax unified', '.thumb'];
  for (let index = 0; index < 12_001; index++) {
    lines.push(`.section .foreign_${index}, "ax", %progbits`);
    if (index === 0) lines.push('.global foreign_global_alias', 'foreign_global_alias:', '.type foreign_local_alias, %object', 'foreign_local_alias:');
    lines.push(`.byte ${index & 255}`);
  }
  lines.push('.section .note.GNU-stack, "", %progbits', '');
  writeFileSync(foreignSource, lines.join('\n')); assemble(foreignSource, foreignObject);
  run(tool('ld'), ['-r', join(temp, 'source.o'), foreignObject, '-o', composite]);
  const compositeBuffer = boundedRead(composite, MAX_FILE, 'foreign composite'), compositeElf = validateObject(compositeBuffer, reference);
  const foreignExec = compositeElf.sections.filter((item) => (item.flags & 4) && item.size > 0 && item.name.startsWith('.foreign_'));
  expect(foreignExec.length === 12_001 && foreignExec.every((item) => item.size === 1), 'foreign composite did not retain >12,000 genuine nonempty executable sections');
  for (const name of ['foreign_global_alias', 'foreign_local_alias']) {
    const hostile = Buffer.from(compositeBuffer), symbol = uniqueSymbol(compositeElf, name), selected = selectedSection(compositeElf);
    hostile.writeUInt32LE(1, symbol.entry + 4); hostile.writeUInt16LE(selected.index, symbol.entry + 14);
    mustReject(`${name} selected-section alias`, () => validateObject(hostile, reference));
  }
  console.log(`self-test: ok (${compositeElf.sectionCount} sections; ${foreignExec.length} nonempty foreign executable sections)`);
}

function main() {
  const configBuffer = boundedRead(CONFIG_PATH, MAX_FILE, 'config'), source = boundedRead(SOURCE_PATH, MAX_FILE, 'source');
  let config; try { config = JSON.parse(configBuffer.toString('utf8')); } catch (error) { fail(`invalid config JSON: ${error.message}`); }
  const { assembly } = validateConfig(config, source);
  const temp = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-15-'));
  try {
    const referenceSourcePath = join(temp, 'reference.S'), referenceObjectPath = join(temp, 'reference.o');
    writeFileSync(referenceSourcePath, referenceSource(assembly)); assemble(referenceSourcePath, referenceObjectPath);
    const reference = parseElf(boundedRead(referenceObjectPath, MAX_FILE, 'reference object'));
    const sourceObjectPath = join(temp, 'source.o'); assemble(SOURCE_PATH, sourceObjectPath);
    const sourceBuffer = boundedRead(sourceObjectPath, MAX_FILE, 'source object'), sourceElf = validateObject(sourceBuffer, reference);
    const args = process.argv.slice(2), self = args.includes('--self-test'), objectArg = args.find((arg) => arg !== '--self-test');
    if (objectArg) validateObject(boundedRead(resolve(objectArg), MAX_FILE, 'object'), reference);
    if (self) selfTest(config, source, sourceBuffer, sourceElf, reference, temp);
    console.log('thumb-leaf-helpers-15: ok (14 bytes, 6 instructions, 1 R_ARM_THM_CALL)');
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

try { main(); } catch (error) { console.error(`thumb-leaf-helpers-15: ${error.message}`); process.exitCode = 1; }
