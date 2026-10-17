#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/thumb-leaf-helpers-17.json');
const SPEC_PATH = join(ROOT, 'docs/specs/main/thumb_leaf_helpers_17.md');
const SOURCE_PATH = join(ROOT, 'src/main/thumb_leaf_helpers_17.S');
const KNOWN_PREFIX = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';
const LIMIT = Object.freeze({ file: 64 * 1024 * 1024, object: 16 * 1024 * 1024, sections: 16_384, symbols: 1_000_000, relocations: 1_000_000 });
const HASH = Object.freeze({
  config: '319d6b5ab88654e8902558524e2582cf2423c7fb5a14a71d56c97930d3252f8d',
  normalizedConfig: '5a8a274f732a5c4d33dd0a2a818810736ebceae77a6113f991368bf764b527c9',
  specification: 'e39339e99ba8e0ad4252331f4744c55cfa79781ffa5138d2fed416c1d8f3a222',
});
const FUNCTION = Object.freeze({ name: 'func_00103ADE', size: 54, instructions: 25, next: 'func_00103D1C', nextOffset: 574 });
const EXTERNALS = Object.freeze(['func_00303110', 'thumb_secondary_001035A0']);

function fail(message) { throw new Error(message); }
function expect(condition, message) { if (!condition) fail(message); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function keys(value, expected) { return value && typeof value === 'object' && same(Object.keys(value).sort(), [...expected].sort()); }
function boundedRead(path, maximum, label) {
  const stat = statSync(path);
  expect(stat.isFile() && stat.size <= maximum, `${label} is invalid or exceeds ${maximum} bytes`);
  return readFileSync(path);
}

function semanticInstruction(row) {
  expect(keys(row, ['offset', 'width', 'operation', 'form', 'operands']) &&
    Number.isInteger(row.offset) && row.offset >= 0 && (row.width === 2 || row.width === 4),
  `malformed semantic row at ${row?.offset}`);
  const o = row.operands;
  const exact = (operation, form, operands, width = 2) => {
    expect(row.operation === operation && row.form === form && row.width === width && same(o, operands),
      `semantic contract mismatch at +0x${row.offset.toString(16)}`);
  };
  switch (row.offset) {
    case 0: exact('stackSave', 'registerList', { registers: ['r3', 'r4', 'r5', 'r6', 'r7', 'lr'] }); return 'push {r3, r4, r5, r6, r7, lr}';
    case 2: exact('copy', 'lowRegister', { destination: 'r4', source: 'r2', setFlags: true }); return 'lsls r4, r2, #0';
    case 4: exact('copy', 'lowRegister', { destination: 'r6', source: 'r1', setFlags: true }); return 'lsls r6, r1, #0';
    case 6: exact('copy', 'lowRegister', { destination: 'r5', source: 'r3', setFlags: true }); return 'lsls r5, r3, #0';
    case 8: exact('transfer', 'directImmediate', { kind: 'call', destinationSymbol: 'func_00303110', destinationState: 'thumb', stateSwitch: false, targetOffset: 2094642, relocation: 'R_ARM_THM_CALL', implicitAddend: -4 }, 4); return 'bl func_00303110';
    case 12: exact('load', 'wordImmediate5', { destination: 'r1', base: 'r0', byteOffset: 4 }); return 'ldr r1, [r0, #4]';
    case 14: exact('compare', 'lowRegister', { left: 'r1', right: 'r6', setFlags: true }); return 'cmp r1, r6';
    case 16: exact('transfer', 'conditionalImmediate8', { kind: 'branch', condition: 'lessOrEqualSigned', targetOffset: 50, relocation: null }); return 'ble .Lzero';
    case 18: exact('load', 'wordImmediate5', { destination: 'r0', base: 'r0', byteOffset: 0 }); return 'ldr r0, [r0, #0]';
    case 20: exact('logicalShiftLeft', 'immediate5', { destination: 'r1', source: 'r6', amount: 3, setFlags: true }); return 'lsls r1, r6, #3';
    case 22: exact('add', 'lowRegisterThreeOperand', { destination: 'r0', left: 'r0', right: 'r1', setFlags: true }); return 'adds r0, r0, r1';
    case 24: exact('load', 'wordImmediate5', { destination: 'r0', base: 'r0', byteOffset: 0 }); return 'ldr r0, [r0, #0]';
    case 26: exact('add', 'immediate3', { destination: 'r1', source: 'r0', value: 1, setFlags: true }); return 'adds r1, r0, #1';
    case 28: exact('transfer', 'conditionalImmediate8', { kind: 'branch', condition: 'equal', targetOffset: 50, relocation: null }); return 'beq .Lzero';
    case 30: exact('constant', 'immediate8', { destination: 'r1', value: 0, setFlags: true }); return 'movs r1, #0';
    case 32: exact('store', 'spRelativeImmediate8', { source: 'r1', base: 'sp', byteOffset: 0 }); return 'str r1, [sp, #0]';
    case 34: exact('copy', 'lowRegister', { destination: 'r2', source: 'r5', setFlags: true }); return 'lsls r2, r5, #0';
    case 36: exact('copy', 'lowRegister', { destination: 'r1', source: 'r4', setFlags: true }); return 'lsls r1, r4, #0';
    case 38: exact('copy', 'highRegister', { destination: 'r3', source: 'sp', setFlags: false }); return 'mov r3, sp';
    case 40: exact('transfer', 'directImmediate', { kind: 'call', destinationSymbol: 'thumb_secondary_001035A0', destinationState: 'thumb', stateSwitch: false, targetOffset: -1342, relocation: 'R_ARM_THM_CALL', implicitAddend: -4 }, 4); return 'bl thumb_secondary_001035A0';
    case 44: exact('copy', 'highRegister', { destination: 'r1', source: 'sp', setFlags: false }); return 'mov r1, sp';
    case 46: exact('compare', 'lowRegister', { left: 'r0', right: 'r1', setFlags: true }); return 'cmp r0, r1';
    case 48: exact('transfer', 'conditionalImmediate8', { kind: 'branch', condition: 'notEqual', targetOffset: 52, relocation: null }); return 'bne .Lreturn';
    case 50: exact('constant', 'immediate8', { destination: 'r0', value: 0, setFlags: true }); return 'movs r0, #0';
    case 52: exact('transfer', 'stackRestore', { kind: 'return', restoredRegisters: ['r3', 'r4', 'r5', 'r6', 'r7'] }); return 'pop {r3, r4, r5, r6, r7, pc}';
    default: fail(`unexpected semantic offset ${row.offset}`);
  }
}

function schedule(fn) {
  expect(Array.isArray(fn.semantics), 'semantic schedule is missing');
  const rendered = []; let offset = 0;
  for (const row of fn.semantics) {
    expect(row.offset === offset, 'semantic offsets are not contiguous');
    rendered.push(semanticInstruction(row)); offset += row.width;
  }
  expect(offset === FUNCTION.size && rendered.length === FUNCTION.instructions, 'semantic coverage mismatch');
  return rendered;
}

function renderSource(config) {
  const fn = config.functions[0], instructions = schedule(fn);
  const lines = ['/* Clean-room implementation derived solely from thumb-leaf-helpers-17.json. */', '.syntax unified', '.thumb', '',
    `.section .text.${fn.name}, "ax", %progbits`, '.balign 2', `.global ${fn.name}`, `.type ${fn.name}, %function`, '.thumb_func', `${fn.name}:`];
  for (let index = 0; index < fn.semantics.length; index++) {
    const row = fn.semantics[index];
    if (row.offset === 50) lines.push('.Lzero:');
    if (row.offset === 52) lines.push('.Lreturn:');
    if (row.offset === 8 || row.offset === 40) {
      const name = row.operands.destinationSymbol;
      lines.push(`  .global ${name}`, `  .type ${name}, %function`);
    }
    lines.push(`  ${instructions[index]}`);
  }
  lines.push(`.size ${fn.name}, . - ${fn.name}`, '', '.section .note.GNU-stack, "", %progbits', '');
  return Buffer.from(lines.join('\n'));
}

function validateConfig(config, source, configBytes, specBytes) {
  expect(sha256(configBytes) === HASH.config, 'configuration digest mismatch');
  const normalized = structuredClone(config); normalized.sourceHash = null;
  expect(sha256(JSON.stringify(normalized)) === HASH.normalizedConfig, 'normalized configuration contract mismatch');
  expect(sha256(specBytes) === HASH.specification, 'specification digest mismatch');
  expect(config.schemaVersion === 3 && config.source === 'src/main/thumb_leaf_helpers_17.S' && config.mode === 'thumb' && config.minimumAlignment === 2,
    'configuration header mismatch');
  expect(config.sourceHash === sha256(source), 'sourceHash mismatch');
  expect(config.totalBodySize === 54 && config.totalAdjacentSize === 0 && config.expectedInstructionCount === 25 && config.wideInstructionCount === 2,
    'size/instruction aggregate mismatch');
  expect(config.legacyNopCount === 0 && config.localBranchCount === 3 && config.memoryOperationCount === 6 && config.returnCount === 1 &&
    config.indirectCallCount === 0 && config.indirectTailCount === 0 && config.directCallCount === 2 && config.directTailCount === 0,
  'operation aggregate mismatch');
  expect(Array.isArray(config.functions) && config.functions.length === 1, 'selected function count mismatch');
  const fn = config.functions[0]; schedule(fn);
  expect(fn.name === FUNCTION.name && fn.size === FUNCTION.size && fn.instructionCount === FUNCTION.instructions &&
    fn.localBranchCount === 3 && fn.memoryOperationCount === 6 && fn.returnCount === 1 && fn.directCallCount === 2 && fn.directTailCount === 0 &&
    fn.indirectCallCount === 0 && fn.indirectTailCount === 0 && same(fn.legacyNopOffsets, []) && fn.nextGlobal === FUNCTION.next && fn.nextGlobalOffset === FUNCTION.nextOffset,
  'function inventory mismatch');
  expect(same(config.directCalls.map((x) => [x.function, x.offset, x.destinationSymbol, x.relocation, x.implicitAddend]),
    [['func_00103ADE', 8, 'func_00303110', 'R_ARM_THM_CALL', -4], ['func_00103ADE', 40, 'thumb_secondary_001035A0', 'R_ARM_THM_CALL', -4]]),
  'direct-call inventory mismatch');
  expect(same(config.relocations.map((x) => [x.function, x.offset, x.type, x.symbol, x.format, x.implicitAddend]),
    [['func_00103ADE', 8, 'R_ARM_THM_CALL', 'func_00303110', 'REL', -4], ['func_00103ADE', 40, 'R_ARM_THM_CALL', 'thumb_secondary_001035A0', 'REL', -4]]),
  'relocation inventory mismatch');
  expect(same(config.directTails, []) && same(config.pcRelativeDataAccesses, []) && same(config.duplicateBodyClasses, []), 'forbidden inventory is nonempty');
  const contract = config.objectContract;
  expect(contract.elfClass === 'ELF32' && contract.endianness === 'little' && contract.fileType === 'ET_REL' && contract.machine === 'EM_ARM' &&
    contract.elfVersion === 1 && contract.osAbi === 'ELFOSABI_NONE' && contract.abiVersion === 0 && contract.flags === 0x05000000 &&
    contract.executableSectionType === 'SHT_PROGBITS' && same(contract.executableSectionFlags, ['SHF_ALLOC', 'SHF_EXECINSTR']) &&
    contract.executableSectionAlignment === 2 && contract.primarySymbolBinding === 'STB_GLOBAL' && contract.primarySymbolType === 'STT_FUNC' &&
    contract.primarySymbolVisibility === 'STV_DEFAULT' && contract.primarySymbolOther === 0 && contract.primarySymbolThumbValue === 1 &&
    contract.mappingSymbol === '$t' && contract.mappingSymbolBinding === 'STB_LOCAL' && contract.mappingSymbolType === 'STT_NOTYPE' &&
    contract.mappingSymbolVisibility === 'STV_DEFAULT' && contract.mappingSymbolValue === 0 && contract.sectionSymbolBinding === 'STB_LOCAL' &&
    contract.sectionSymbolType === 'STT_SECTION' && contract.externalSymbolBinding === 'STB_GLOBAL' && contract.externalSymbolType === 'STT_FUNC' &&
    contract.externalSymbolVisibility === 'STV_DEFAULT' && contract.externalSymbolOther === 0 && contract.externalSymbolSectionIndex === 'SHN_UNDEF' &&
    contract.externalSymbolValue === 0 && contract.externalSymbolSize === 0 && contract.relocationSectionType === 'SHT_REL' &&
    same(contract.namedAliases, []) && same(contract.unnamedAliases, []), 'object contract mismatch');
}

function range(buffer, offset, size, label) {
  expect(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset + size <= buffer.length, `${label} is outside the object`);
}
function cstring(buffer, section, offset) {
  expect(offset >= 0 && offset < section.size, 'invalid string offset');
  const start = section.offset + offset, end = buffer.indexOf(0, start);
  expect(end >= start && end < section.offset + section.size, 'unterminated string');
  return buffer.toString('utf8', start, end);
}
function parseElf(buffer) {
  expect(buffer.length <= LIMIT.object && buffer.length >= 52 && buffer[0] === 0x7f && buffer.toString('ascii', 1, 4) === 'ELF', 'invalid ELF object');
  expect(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0 && buffer.subarray(9, 16).every((x) => x === 0), 'ELF identity mismatch');
  expect(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 && buffer.readUInt32LE(20) === 1 && buffer.readUInt32LE(36) === 0x05000000, 'ELF header mismatch');
  expect(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 && buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0 && buffer.readUInt16LE(46) === 40, 'ELF layout mismatch');
  const shoff = buffer.readUInt32LE(32); range(buffer, shoff, 40, 'section zero');
  let count = buffer.readUInt16LE(48), namesIndex = buffer.readUInt16LE(50);
  if (count === 0) count = buffer.readUInt32LE(shoff + 20);
  expect(count > 0 && count <= LIMIT.sections, 'section count exceeds limit'); range(buffer, shoff, count * 40, 'section table');
  if (namesIndex === 0xffff) namesIndex = buffer.readUInt32LE(shoff + 24);
  expect(namesIndex > 0 && namesIndex < count, 'invalid section-name table index');
  const sections = [];
  for (let index = 0; index < count; index++) {
    const header = shoff + index * 40;
    sections.push({ index, header, nameOffset: buffer.readUInt32LE(header), type: buffer.readUInt32LE(header + 4), flags: buffer.readUInt32LE(header + 8), address: buffer.readUInt32LE(header + 12), offset: buffer.readUInt32LE(header + 16), size: buffer.readUInt32LE(header + 20), link: buffer.readUInt32LE(header + 24), info: buffer.readUInt32LE(header + 28), align: buffer.readUInt32LE(header + 32), entsize: buffer.readUInt32LE(header + 36) });
  }
  expect(Object.entries(sections[0]).every(([key, value]) => ['index', 'header'].includes(key) || value === 0), 'noncanonical null section');
  const names = sections[namesIndex]; expect(names.type === 3, 'invalid section-name string table'); range(buffer, names.offset, names.size, 'section names');
  for (const section of sections) {
    section.name = cstring(buffer, names, section.nameOffset);
    expect(section.align === 0 || (section.align & (section.align - 1)) === 0, `${section.name}: invalid alignment`);
    if (section.type !== 8 && section.size) range(buffer, section.offset, section.size, section.name);
  }
  const symbols = [], tables = new Map(); let symbolCount = 0;
  for (const section of sections.filter((x) => x.type === 2 || x.type === 11)) {
    expect(section.entsize === 16 && section.size % 16 === 0 && section.link < count && sections[section.link].type === 3, 'invalid symbol table');
    const table = new Map(); tables.set(section.index, table); symbolCount += section.size / 16;
    expect(symbolCount <= LIMIT.symbols, 'symbol count exceeds limit');
    for (let index = 0; index < section.size / 16; index++) {
      const entry = section.offset + index * 16;
      const symbol = { table: section.index, index, entry, nameOffset: buffer.readUInt32LE(entry), value: buffer.readUInt32LE(entry + 4), size: buffer.readUInt32LE(entry + 8), info: buffer[entry + 12], other: buffer[entry + 13], shndx: buffer.readUInt16LE(entry + 14) };
      symbol.name = cstring(buffer, sections[section.link], symbol.nameOffset); symbols.push(symbol); table.set(index, symbol);
    }
    const zero = table.get(0); expect(zero && zero.name === '' && zero.value === 0 && zero.size === 0 && zero.info === 0 && zero.other === 0 && zero.shndx === 0, 'noncanonical null symbol');
  }
  const relocations = []; let relocationCount = 0;
  for (const section of sections.filter((x) => x.type === 9 || x.type === 4)) {
    const size = section.type === 9 ? 8 : 12;
    expect(section.entsize === size && section.size % size === 0 && section.link < count && section.info < count && tables.has(section.link), 'invalid relocation section');
    relocationCount += section.size / size; expect(relocationCount <= LIMIT.relocations, 'relocation count exceeds limit');
    for (let index = 0; index < section.size / size; index++) {
      const entry = section.offset + index * size, info = buffer.readUInt32LE(entry + 4), symbol = tables.get(section.link).get(info >>> 8);
      expect(symbol, 'invalid relocation symbol');
      const offset = buffer.readUInt32LE(entry), target = sections[section.info];
      expect(offset <= target.size && 4 <= target.size - offset, 'relocation is outside its target section');
      relocations.push({ section: section.index, target: section.info, offset, type: info & 255, symbol: symbol.name });
    }
  }
  return { buffer, sections, symbols, relocations };
}

function bytes(elf, section) { return elf.buffer.subarray(section.offset, section.offset + section.size); }
function sectionContract(section) {
  return [section.name, section.type, section.flags, section.address, section.size, section.link, section.info, section.align, section.entsize];
}
function symbolContract(symbol) {
  return [symbol.name, symbol.value, symbol.size, symbol.info, symbol.other, symbol.shndx];
}
function validateObject(buffer, reference) {
  const elf = parseElf(buffer), ref = parseElf(reference);
  expect(same(elf.sections.map(sectionContract), ref.sections.map(sectionContract)), 'section inventory or metadata mismatch');
  expect(same(elf.symbols.map(symbolContract), ref.symbols.map(symbolContract)), 'symbol inventory or metadata mismatch');
  const selected = elf.sections.filter((x) => x.name === '.text.func_00103ADE');
  const refSection = ref.sections.find((x) => x.name === '.text.func_00103ADE');
  expect(selected.length === 1 && refSection, 'selected section missing or duplicated');
  const section = selected[0];
  expect(section.type === 1 && section.flags === 6 && section.address === 0 && section.size === 54 && section.link === 0 && section.info === 0 && section.align === 2 && section.entsize === 0, 'selected section contract mismatch');
  expect(bytes(elf, section).equals(bytes(ref, refSection)), 'encoded instruction semantics mismatch');
  expect(elf.sections.filter((x) => (x.flags & 4) && x.size).reduce((sum, x) => sum + x.size, 0) === 54, 'extra executable ownership');
  const symtabs = elf.sections.filter((x) => x.type === 2 || x.type === 11); expect(symtabs.length === 1 && symtabs[0].type === 2, 'symbol table inventory mismatch');
  const symtab = symtabs[0], table = elf.symbols.filter((x) => x.table === symtab.index);
  expect(symtab.flags === 0 && symtab.address === 0 && symtab.align === 4 && symtab.entsize === 16 && symtab.info > 0 && symtab.info <= table.length && table.every((x, i) => ((x.info >>> 4) === 0) === (i < symtab.info)), 'symbol table partition mismatch');
  const primary = elf.symbols.filter((x) => x.name === FUNCTION.name);
  expect(primary.length === 1 && primary[0].shndx === section.index && primary[0].value === 1 && primary[0].size === 54 && primary[0].info === 0x12 && primary[0].other === 0, 'primary symbol mismatch');
  const owned = elf.symbols.filter((x) => x.shndx === section.index);
  const sectionSymbols = owned.filter((x) => (x.info & 15) === 3), mappings = owned.filter((x) => /^\$(?:t|d|a)(?:\.|$)/.test(x.name));
  expect(owned.length === 3 && sectionSymbols.length === 1 && sectionSymbols[0].name === '' && sectionSymbols[0].value === 0 && sectionSymbols[0].size === 0 && sectionSymbols[0].info === 3 && sectionSymbols[0].other === 0, 'section symbol or alias mismatch');
  expect(mappings.length === 1 && mappings[0].name === '$t' && mappings[0].value === 0 && mappings[0].size === 0 && mappings[0].info === 0 && mappings[0].other === 0, 'Thumb mapping mismatch');
  for (const name of EXTERNALS) {
    const found = elf.symbols.filter((x) => x.name === name);
    expect(found.length === 1 && found[0].shndx === 0 && found[0].value === 0 && found[0].size === 0 && found[0].info === 0x12 && found[0].other === 0, `${name}: external symbol mismatch`);
  }
  expect(same(elf.relocations.map((x) => [x.target, x.offset, x.type, x.symbol]), [[section.index, 8, 10, EXTERNALS[0]], [section.index, 40, 10, EXTERNALS[1]]]), 'relocation inventory mismatch');
  const relsecs = elf.sections.filter((x) => x.type === 9 || x.type === 4);
  expect(relsecs.length === 1 && relsecs[0].name === '.rel.text.func_00103ADE' && relsecs[0].type === 9 && relsecs[0].flags === 0x40 && relsecs[0].address === 0 && relsecs[0].size === 16 && relsecs[0].link === symtab.index && relsecs[0].info === section.index && relsecs[0].align === 4 && relsecs[0].entsize === 8, 'relocation section mismatch');
  return { elf, section, symtab, primary: primary[0], mapping: mappings[0], external: elf.symbols.find((x) => x.name === EXTERNALS[0]), relocationSection: relsecs[0] };
}

function tool(kind) {
  const explicit = process.env[`ARM_NONE_EABI_${kind.toUpperCase()}`]; if (explicit) return explicit;
  const prefix = process.env.CROSS_COMPILE ?? process.env.ARM_NONE_EABI_PREFIX; if (prefix) return `${prefix}${kind}`;
  return existsSync(`${KNOWN_PREFIX}${kind}`) ? `${KNOWN_PREFIX}${kind}` : `arm-none-eabi-${kind}`;
}
function run(program, args) {
  const result = spawnSync(program, args, { encoding: 'utf8', maxBuffer: LIMIT.file });
  if (result.error) fail(`could not run ${program}: ${result.error.message}`);
  expect(result.status === 0, `${program} failed:\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  expect(!(result.stderr ?? '').trim(), `${program} emitted warnings:\n${result.stderr}`);
}
function assemble(source, object) { run(tool('gcc'), ['-c', '-x', 'assembler-with-cpp', '-mthumb', '-march=armv6k', '-Wall', '-Wextra', '-Werror', source, '-o', object]); }
function mutate32(buffer, offset, value) { const copy = Buffer.from(buffer); copy.writeUInt32LE(value, offset); return copy; }
function mustReject(label, action) { let rejected = false; try { action(); } catch { rejected = true; } expect(rejected, `self-test did not reject ${label}`); }

function selfTest(config, source, configBytes, specBytes, object, reference, parsed) {
  const { section, symtab, primary, mapping, external, relocationSection } = parsed;
  const badInstruction = Buffer.from(object); badInstruction[section.offset] ^= 1;
  mustReject('instruction mutation', () => validateObject(badInstruction, reference));
  mustReject('owned trailing byte', () => validateObject(mutate32(object, section.header + 20, 55), reference));
  mustReject('section alignment', () => validateObject(mutate32(object, section.header + 32, 4), reference));
  mustReject('section flags', () => validateObject(mutate32(object, section.header + 8, 7), reference));
  const badPrimary = Buffer.from(object); badPrimary[primary.entry + 12] = 0x11;
  mustReject('primary type', () => validateObject(badPrimary, reference));
  const badMapping = Buffer.from(object); badMapping[mapping.entry + 13] = 1;
  mustReject('mapping visibility', () => validateObject(badMapping, reference));
  const badExternal = Buffer.from(object); badExternal.writeUInt16LE(section.index, external.entry + 14);
  mustReject('defined external', () => validateObject(badExternal, reference));
  const badRelocation = Buffer.from(object); badRelocation.writeUInt32LE((badRelocation.readUInt32LE(relocationSection.offset + 4) & ~0xff) | 30, relocationSection.offset + 4);
  mustReject('relocation type', () => validateObject(badRelocation, reference));
  mustReject('RELA substitution', () => validateObject(mutate32(object, relocationSection.header + 4, 4), reference));
  mustReject('relocation ownership', () => validateObject(mutate32(object, relocationSection.header + 28, 1), reference));
  mustReject('symbol partition', () => validateObject(mutate32(object, symtab.header + 28, symtab.info + 1), reference));
  const badNullSection = Buffer.from(object); badNullSection.writeUInt32LE(1, parsed.elf.sections[0].header + 8);
  mustReject('null section', () => validateObject(badNullSection, reference));
  const dataSection = parsed.elf.sections.find((x) => x.name === '.data');
  expect(dataSection, 'self-test fixture lacks .data');
  mustReject('foreign non-executable payload', () => validateObject(mutate32(object, dataSection.header + 20, 1), reference));
  const foreignSymbol = parsed.elf.symbols.find((x) => x.name === '' && x.shndx !== 0 && x.shndx !== section.index);
  expect(foreignSymbol, 'self-test fixture lacks a foreign section symbol');
  const badSymbol = Buffer.from(object); badSymbol[foreignSymbol.entry + 13] = 1;
  mustReject('foreign symbol metadata', () => validateObject(badSymbol, reference));
  const changedConfig = structuredClone(config); changedConfig.functions[0].size++;
  mustReject('normalized config drift', () => validateConfig(changedConfig, source, configBytes, specBytes));
  mustReject('source digest', () => validateConfig({ ...config, sourceHash: '0'.repeat(64) }, source, configBytes, specBytes));
  mustReject('config bytes', () => validateConfig(config, source, Buffer.concat([configBytes, Buffer.from('\n')]), specBytes));
  mustReject('specification bytes', () => validateConfig(config, source, configBytes, Buffer.concat([specBytes, Buffer.from('\n')])));
  const tooManySections = Buffer.from(object); tooManySections.writeUInt16LE(LIMIT.sections + 1, 48);
  mustReject('section count cap', () => parseElf(tooManySections));
  mustReject('symbol count cap', () => parseElf(mutate32(object, symtab.header + 20, (LIMIT.symbols + 1) * 16)));
  mustReject('relocation count cap', () => parseElf(mutate32(object, relocationSection.header + 20, (LIMIT.relocations + 1) * 8)));
  console.log('self-test: ok (21 deterministic rejection cases)');
}

function main() {
  const configBytes = boundedRead(CONFIG_PATH, LIMIT.file, 'configuration');
  const specBytes = boundedRead(SPEC_PATH, LIMIT.file, 'specification');
  const source = boundedRead(SOURCE_PATH, LIMIT.file, 'source');
  let config; try { config = JSON.parse(configBytes); } catch (error) { fail(`invalid configuration JSON: ${error.message}`); }
  validateConfig(config, source, configBytes, specBytes);
  const rendered = renderSource(config); expect(source.equals(rendered), 'source does not exactly implement the semantic schedule');
  const args = process.argv.slice(2), self = args.includes('--self-test'), objectArgs = args.filter((x) => x !== '--self-test');
  expect(objectArgs.length <= 1, 'usage: validate-thumb-leaf-helpers-17.mjs [--self-test] [object]');
  const temp = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-17-'));
  try {
    const referenceSource = join(temp, 'reference.S'), referenceObject = join(temp, 'reference.o'), sourceObject = join(temp, 'source.o');
    writeFileSync(referenceSource, rendered); assemble(referenceSource, referenceObject); assemble(SOURCE_PATH, sourceObject);
    const reference = boundedRead(referenceObject, LIMIT.object, 'reference object'), object = boundedRead(sourceObject, LIMIT.object, 'source object');
    const parsed = validateObject(object, reference);
    if (objectArgs[0]) validateObject(boundedRead(resolve(objectArgs[0]), LIMIT.object, 'supplied object'), reference);
    if (self) selfTest(config, source, configBytes, specBytes, object, reference, parsed);
    console.log('thumb-leaf-helpers-17: ok (54 bytes, 25 instructions, 2 relocations)');
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

try { main(); } catch (error) { console.error(`thumb-leaf-helpers-17: ${error.message}`); process.exitCode = 1; }
