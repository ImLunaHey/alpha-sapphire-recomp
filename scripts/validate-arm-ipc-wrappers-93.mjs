#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const FILE_CAP = 64 * 1024 * 1024;
const EXEC_CAP = 16 * 1024 * 1024;
const SECTION_CAP = 16_384;
const SYMBOL_CAP = 1_000_000;
const RELOCATION_CAP = 1_000_000;
const EXPECTED_SOURCE_HASH = 'bc1c58ceaedd7bfc24d83cfeee1f364b9cdb937ae256d43a2a4aaa1dad7c97f8';
const EXPECTED_CONFIG_CONTRACT = '3fb00e213e53df0efe5cbed11964b3656f2de2538fd1a39f6e3867b7e6e6d27b';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/arm-ipc-wrappers-93.json');
const BODY_HASHES = new Map([
  ['func_001814C4', '3b729c5cc23e9eef73d7d25ba536b76b8382f21db06b20b43a808c95513e011c'],
  ['func_001816F8', '6a20784f0e4a370feeb60cd99060f317498ba2eb977062dab7ee410d3b88985f'],
]);

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function readCapped(path, label) {
  check(statSync(path).size <= FILE_CAP, `${label} exceeds ${FILE_CAP}-byte file size limit`);
  return readFileSync(path);
}
function range(offset, size, total, label) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0,
    `${label}: invalid range`);
  check(offset <= total && size <= total - offset, `${label}: range outside the file`);
}
function stringAt(buffer, strings, offset, label) {
  check(offset < strings.size, `${label}: string offset outside table`);
  const start = strings.offset + offset;
  const end = buffer.indexOf(0, start);
  check(end >= start && end < strings.offset + strings.size, `${label}: unterminated string`);
  return buffer.toString('utf8', start, end);
}

function parseElf(buffer) {
  check(buffer.length <= FILE_CAP, `ELF exceeds ${FILE_CAP}-byte file size limit`);
  check(buffer.length >= 52, 'truncated ELF header');
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])),
    'requires ELF32 little-endian version 1');
  const u16 = at => buffer.readUInt16LE(at);
  const u32 = at => buffer.readUInt32LE(at);
  check(u16(16) === 1, 'requires relocatable ELF');
  check(u16(18) === 40, 'requires EM_ARM');
  check(u16(40) === 52 && u16(46) === 40, 'unexpected ELF header sizes');
  const shoff = u32(32);
  range(shoff, 40, buffer.length, 'section zero');
  let sectionCount = u16(48);
  let shstrndx = u16(50);
  if (sectionCount === 0) sectionCount = u32(shoff + 20);
  if (shstrndx === 0xffff) shstrndx = u32(shoff + 24);
  check(sectionCount > 0 && sectionCount <= SECTION_CAP,
    `section count ${sectionCount} exceeds ${SECTION_CAP} limit`);
  range(shoff, sectionCount * 40, buffer.length, 'section table');
  check(shstrndx < sectionCount, 'invalid section-name table index');
  const sections = [];
  let executablePayload = 0;
  for (let index = 0; index < sectionCount; index++) {
    const at = shoff + index * 40;
    const section = { index, nameOffset: u32(at), type: u32(at + 4), flags: u32(at + 8),
      address: u32(at + 12), offset: u32(at + 16), size: u32(at + 20), link: u32(at + 24),
      info: u32(at + 28), align: u32(at + 32), entsize: u32(at + 36) };
    if (section.type !== 8) range(section.offset, section.size, buffer.length, `section ${index}`);
    if ((section.flags & 4) !== 0 && section.type !== 8) {
      executablePayload += section.size;
      check(executablePayload <= EXEC_CAP,
        `executable payload exceeds ${EXEC_CAP}-byte limit`);
    }
    sections.push(section);
  }
  const sectionStrings = sections[shstrndx];
  check(sectionStrings.type === 3, 'section-name table is not STRTAB');
  for (const section of sections) {
    section.name = stringAt(buffer, sectionStrings, section.nameOffset, `section ${section.index}`);
  }
  let symbolCount = 0;
  const symbolTables = new Map();
  for (const table of sections.filter(section => section.type === 2 || section.type === 11)) {
    check(table.entsize === 16 && table.size % 16 === 0, `${table.name}: malformed symbol table`);
    const count = table.size / 16;
    symbolCount += count;
    check(symbolCount <= SYMBOL_CAP, `symbol count exceeds ${SYMBOL_CAP} limit`);
    check(table.link < sections.length && sections[table.link].type === 3,
      `${table.name}: invalid string table link`);
    const strings = sections[table.link];
    const symbols = [];
    for (let index = 0; index < count; index++) {
      const at = table.offset + index * 16;
      const nameOffset = u32(at);
      symbols.push({ table: table.index, index, entry: at, nameOffset, name: nameOffset === 0 ? '' :
        stringAt(buffer, strings, nameOffset, `${table.name} symbol ${index}`),
      value: u32(at + 4), size: u32(at + 8), info: buffer[at + 12],
      other: buffer[at + 13], shndx: u16(at + 14) });
    }
    symbolTables.set(table.index, symbols);
  }
  let relocationCount = 0;
  const relocations = [];
  for (const table of sections.filter(section => section.type === 9 || section.type === 4)) {
    const width = table.type === 9 ? 8 : 12;
    check(table.entsize === width && table.size % width === 0,
      `${table.name}: malformed relocation table`);
    const count = table.size / width;
    relocationCount += count;
    check(relocationCount <= RELOCATION_CAP, `relocation count exceeds ${RELOCATION_CAP} limit`);
    check(table.info < sections.length && symbolTables.has(table.link),
      `${table.name}: invalid relocation links`);
    const target = sections[table.info];
    const symbols = symbolTables.get(table.link);
    for (let index = 0; index < count; index++) {
      const at = table.offset + index * width;
      const offset = u32(at);
      const info = u32(at + 4);
      const symbolIndex = info >>> 8;
      const type = info & 0xff;
      check(symbolIndex < symbols.length, `${table.name}: invalid relocation symbol`);
      range(offset, 4, target.size, `${table.name} relocation ${index}`);
      const instruction = buffer.readUInt32LE(target.offset + offset);
      const armAddend = (type === 28 || type === 29) ? (instruction << 8 >> 6) : undefined;
      relocations.push({ target: table.info, offset, type,
        symbol: symbols[symbolIndex].name, armAddend });
    }
  }
  return { buffer, sections, symbolTables, relocations, sectionCount,
    symbolCount, relocationCount, executablePayload };
}

function same(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
}

function validateConfig(config, source) {
  const contract = structuredClone(config);
  contract.sourceHash = null;
  assert.equal(sha256(Buffer.from(JSON.stringify(contract))), EXPECTED_CONFIG_CONTRACT,
    'configuration contract hash mismatch');
  assert.equal(config.schemaVersion, 1);
  assert.equal(config.source, 'src/main/arm_ipc_wrappers_93.S');
  assert.match(config.sourceHash, /^[0-9a-f]{64}$/);
  assert.equal(config.sourceHash, EXPECTED_SOURCE_HASH, 'unexpected sourceHash');
  assert.equal(sha256(source), EXPECTED_SOURCE_HASH, 'source contract hash mismatch');
  assert.equal(config.mode, 'arm');
  assert.equal(config.totalBodySize, 772);
  assert.equal(config.totalAdjacentSize, 0);
  assert.equal(config.cumulativePoolSlots, 886);
  assert.equal(config.cumulativePoolClasses, 463);
  assert.equal(config.functions.length, 2);
  same(config.functions.map(fn => [fn.name, fn.section, fn.size, fn.nextGlobal,
    fn.nextGlobalOffset, fn.returnOffsets]), [
    ['func_001814C4', '.text.func_001814C4', 364, 'func_00181630', 364, [308, 360]],
    ['func_001816F8', '.text.func_001816F8', 408, 'func_00181890', 408, [328, 404]],
  ], 'function extent/return contract changed');
  same(config.functions.flatMap(fn => fn.branches.map(branch =>
    [fn.name, branch.offset, branch.kind, branch.transfer, branch.symbol])), [
    ['func_001814C4', 144, 'R_ARM_CALL', 'linked', 'func_001878A8'],
    ['func_001814C4', 172, 'R_ARM_CALL', 'linked', 'func_001870E4'],
    ['func_001814C4', 204, 'R_ARM_CALL', 'linked', 'func_00187DCC'],
    ['func_001816F8', 208, 'R_ARM_CALL', 'linked', 'func_00187FDC'],
    ['func_001816F8', 368, 'R_ARM_CALL', 'linked', 'func_00187F9C'],
    ['func_001816F8', 392, 'R_ARM_CALL', 'linked', 'service_object_finalize_secondary_93'],
  ], 'direct-call contract changed');
  same(config.functions.flatMap(fn => fn.indirectCalls.map(call =>
    [fn.name, call.offset, call.sourceRegister, call.stateExchange])),
  [['func_001814C4', 292, 'r1', true]], 'indirect-call contract changed');
  check(config.functions.every(fn => fn.literals.length === 0), 'unexpected literal contract');
  same(config.literalIdentities, [], 'literal identities changed');
  same(config.reusedLiteralIdentities, [], 'reused literal identities changed');
  same(config.newLiteralIdentities, [], 'new literal identities changed');
  const branch = config.branchIdentityContract;
  assert.equal(branch.mode, 'arm');
  assert.equal(branch.minimumAlignment, 4);
  same(branch.primaryEntries,
    ['func_001878A8', 'func_001870E4', 'func_00187DCC', 'func_00187FDC', 'func_00187F9C'],
    'primary identities changed');
  same(branch.secondaryEntries, ['service_object_finalize_secondary_93'],
    'secondary identities changed');
  same(branch.secondaryEntryRelations, [{ symbol: 'service_object_finalize_secondary_93',
    owner: 'func_00170340', ownerOffset: 324, nextGlobal: 'func_0017048C',
    bytesBeforeNextGlobal: 8 }], 'secondary relation changed');
  same(branch.sharedClasses, [], 'shared identity classes changed');
  same(branch.singletonClasses,
    [...branch.primaryEntries, 'service_object_finalize_secondary_93'],
    'singleton identity classes changed');
  assert.equal(branch.classesPairwiseDistinct, true);
  same(branch.armPrimaryEntries, branch.primaryEntries, 'ARM primary identities changed');
  same(branch.thumbPrimaryEntries, [], 'unexpected Thumb primary identities');
}

function validateObject(parsed, config) {
  const sectionByName = new Map(parsed.sections.map(section => [section.name, section]));
  const symbols = [...parsed.symbolTables.values()].flat();
  const uniqueSymbol = name => {
    const matches = symbols.filter(symbol => symbol.name === name);
    check(matches.length === 1, `${name}: expected exactly one symbol, found ${matches.length}`);
    return matches[0];
  };
  const definedArmIdentity = (symbol, name, offset = 0) => {
    check((symbol.info >>> 4) === 1 && (symbol.info & 15) === 2 && (symbol.other & 3) === 0,
      `${name}: defined destination must be global default FUNC`);
    check(symbol.shndx > 0 && symbol.shndx < parsed.sections.length,
      `${name}: defined destination has invalid section`);
    const section = parsed.sections[symbol.shndx];
    const value = symbol.value + offset;
    check(section.type === 1 && (section.flags & 4) !== 0,
      `${name}: defined destination is not executable PROGBITS`);
    check(section.align >= 4 && value % 4 === 0 && value < section.size,
      `${name}: defined destination is not aligned ARM code`);
    return `defined:${section.index}:${value}`;
  };
  const destinationIdentity = (symbol, name, offset = 0) => {
    if (symbol.shndx === 0) {
      check(symbol.value === 0 && symbol.size === 0 && (symbol.info >>> 4) === 1 &&
        (symbol.info & 15) === 0 && (symbol.other & 3) === 0,
      `${name}: standalone destination must be undefined global default NOTYPE`);
      return `undefined:${symbol.table}:${symbol.index}:${offset}`;
    }
    return definedArmIdentity(symbol, name, offset);
  };
  let calls = 0;
  for (const fn of config.functions) {
    const section = sectionByName.get(fn.section);
    check(section && section.type === 1 && section.flags === 6 && section.align === 4,
      `${fn.name}: selected section type/flags/alignment mismatch`);
    assert.equal(section.size, fn.size, `${fn.name}: section size mismatch`);
    const symbol = uniqueSymbol(fn.name);
    check(symbol.shndx === section.index && symbol.value === 0 && symbol.size === fn.size,
      `${fn.name}: invalid function symbol extent`);
    check((symbol.info >>> 4) === 1 && (symbol.info & 15) === 2,
      `${fn.name}: symbol is not global FUNC`);
    check((symbol.other & 3) === 0, `${fn.name}: function symbol is not default-visible`);
    const mappings = symbols.filter(item => item.shndx === section.index && /^\$[a-z](?:\.|$)/.test(item.name));
    check(mappings.length === 1 && /^\$a(?:\.|$)/.test(mappings[0].name) && mappings[0].value === 0 &&
      mappings[0].size === 0 && mappings[0].info === 0 && (mappings[0].other & 3) === 0,
    `${fn.name}: ARM mapping-symbol contract mismatch`);
    const unexpected = symbols.filter(item => item.shndx === section.index && item.name &&
      item !== symbol && item !== mappings[0]);
    check(unexpected.length === 0, `${fn.name}: unexpected named alias or owner`);
    const body = Buffer.from(parsed.buffer.subarray(section.offset, section.offset + fn.size));
    const actual = parsed.relocations.filter(relocation => relocation.target === section.index)
      .sort((a, b) => a.offset - b.offset);
    for (const relocation of actual) {
      if (relocation.type === 28) body.writeUInt32LE(0xebfffffe, relocation.offset);
    }
    assert.equal(sha256(body), BODY_HASHES.get(fn.name), `${fn.name}: structured instruction schedule mismatch`);
    const expected = fn.branches.map(entry => ({ offset: entry.offset, type: 28,
      symbol: entry.symbol }));
    const normalized = actual.map(entry => ({ offset: entry.offset, type: entry.type,
      symbol: entry.symbol === 'func_00170340' && entry.armAddend === 316
        ? 'service_object_finalize_secondary_93' : entry.symbol }));
    same(normalized, expected, `${fn.name}: relocation ownership/target/addend mismatch`);
    for (const branch of fn.branches) {
      assert.equal(parsed.buffer.readUInt32LE(section.offset + branch.offset) >>> 24, 0xeb,
        `${fn.name}+${branch.offset}: direct call is not ARM BL`);
      calls++;
    }
  }
  assert.equal(calls, 6, 'incorrect direct-call total');
  const first = sectionByName.get('.text.func_001814C4');
  assert.equal(parsed.buffer.readUInt32LE(first.offset + 292), 0xe12fff31,
    'indirect state-exchanging call is not BLX r1');
  for (const [name, offsets] of [['func_001814C4', [308, 360]], ['func_001816F8', [328, 404]]]) {
    const section = sectionByName.get(`.text.${name}`);
    for (const offset of offsets) {
      const word = parsed.buffer.readUInt32LE(section.offset + offset);
      check(((word & 0xffff8000) >>> 0) === 0xe8bd8000,
        `${name}+${offset}: return is not LDM/POP {...,pc}`);
    }
  }
  const second = sectionByName.get('.text.func_001816F8');
  assert.equal(parsed.buffer.readUInt32LE(second.offset + 216), 0xe320f000,
    'state-preserving scheduling slot is not ARM NOP');
  const identities = [];
  for (const name of config.branchIdentityContract.primaryEntries)
    identities.push(destinationIdentity(uniqueSymbol(name), name));
  const secondaryOwner = uniqueSymbol('func_00170340');
  identities.push(destinationIdentity(secondaryOwner, 'service_object_finalize_secondary_93', 324));
  check(new Set(identities).size === identities.length,
    'direct destination identities are not pairwise distinct');
}

function locateAssembler() {
  const candidates = [process.env.ARM_AS,
    process.env.ARM_NONE_EABI_PREFIX && `${process.env.ARM_NONE_EABI_PREFIX}as`,
    process.env.CROSS_COMPILE && `${process.env.CROSS_COMPILE}as`, 'arm-none-eabi-as'].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
    if (!probe.error && probe.status === 0) return candidate;
  }
  const nix = spawnSync('nix', ['build', '--no-link', '--print-out-paths',
    'nixpkgs#gcc-arm-embedded'], { encoding: 'utf8' });
  check(nix.status === 0, 'cannot locate arm-none-eabi-as');
  return join(nix.stdout.trim().split(/\s+/).at(-1), 'bin/arm-none-eabi-as');
}

function assemble(config) {
  const temporary = mkdtempSync(join(tmpdir(), 'arm-ipc-93-'));
  const object = join(temporary, 'batch.o');
  const result = spawnSync(locateAssembler(), ['-mcpu=cortex-a9', '-mfpu=vfpv2', '-o', object,
    join(ROOT, config.source)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`assembler failed:\n${result.stderr || result.stdout}`);
  return { temporary, buffer: readCapped(object, 'object') };
}

function makeComposite(buffer, count = 12_051) {
  const oldOffset = buffer.readUInt32LE(32);
  const oldCount = buffer.readUInt16LE(48);
  check(count > 12_000 && count <= SECTION_CAP, 'invalid composite section count');
  const foreignCount = count - oldCount;
  check(foreignCount > 12_000, 'composite needs more than 12,000 foreign sections');
  const payloadOffset = buffer.length;
  const newOffset = (payloadOffset + foreignCount + 3) & ~3;
  const result = Buffer.alloc(newOffset + count * 40);
  buffer.copy(result);
  buffer.copy(result, newOffset, oldOffset, oldOffset + oldCount * 40);
  for (let index = oldCount; index < count; index++) {
    const at = newOffset + index * 40;
    result.writeUInt32LE(1, at + 4);
    result.writeUInt32LE(6, at + 8);
    result.writeUInt32LE(payloadOffset + index - oldCount, at + 16);
    result.writeUInt32LE(1, at + 20);
    result.writeUInt32LE(1, at + 32);
  }
  result.writeUInt32LE(newOffset, 32);
  result.writeUInt16LE(count, 48);
  return { buffer: result, oldCount, newOffset };
}

function expectReject(label, action) {
  try { action(); } catch { return; }
  fail(`self-test accepted hostile mutation: ${label}`);
}

function enlarged(buffer, bytes) {
  const result = Buffer.alloc(bytes);
  buffer.copy(result);
  return result;
}

function selfTest(object, config, source) {
  const fixture = makeComposite(object);
  const composite = parseElf(fixture.buffer);
  validateObject(composite, config);
  assert.equal(composite.sectionCount, 12_051);
  assert.ok(composite.sections.slice(fixture.oldCount).filter(section =>
    section.type === 1 && (section.flags & 6) === 6 && section.size === 1).length > 12_000,
  'large composite did not retain more than 12,000 foreign executable sections');
  expectReject('file-size overflow', () => parseElf(Buffer.alloc(FILE_CAP + 1)));
  expectReject('truncation', () => parseElf(object.subarray(0, 51)));
  const instruction = Buffer.from(object);
  const target = parseElf(instruction).sections.find(section => section.name === '.text.func_001814C4');
  instruction[target.offset] ^= 1;
  expectReject('instruction mutation', () => validateObject(parseElf(instruction), config));
  const sections = Buffer.from(fixture.buffer);
  sections.writeUInt16LE(SECTION_CAP + 1, 48);
  expectReject('section-count overflow', () => parseElf(sections));
  const executable = Buffer.from(fixture.buffer);
  for (let index = fixture.oldCount; index < 12_051; index++) {
    const at = fixture.newOffset + index * 40;
    executable.writeUInt32LE(0, at + 16);
    executable.writeUInt32LE(1400, at + 20);
  }
  expectReject('executable-payload overflow', () => parseElf(executable));
  const parsed = parseElf(object);
  const symtab = parsed.sections.find(section => section.type === 2);
  const tooManySymbols = enlarged(object, symtab.offset + (SYMBOL_CAP + 1) * 16);
  tooManySymbols.writeUInt32LE((SYMBOL_CAP + 1) * 16,
    tooManySymbols.readUInt32LE(32) + symtab.index * 40 + 20);
  expectReject('symbol-count overflow', () => parseElf(tooManySymbols));
  const rel = parsed.sections.find(section => section.type === 9);
  const tooManyRelocations = enlarged(object, rel.offset + (RELOCATION_CAP + 1) * 8);
  tooManyRelocations.writeUInt32LE((RELOCATION_CAP + 1) * 8,
    tooManyRelocations.readUInt32LE(32) + rel.index * 40 + 20);
  expectReject('relocation-count overflow', () => parseElf(tooManyRelocations));
  const badRelocation = Buffer.from(object);
  badRelocation[rel.offset + 4] = 2;
  expectReject('relocation type/target mutation', () => validateObject(parseElf(badRelocation), config));
  const baseline = parseElf(object);
  const firstSection = baseline.sections.find(section => section.name === '.text.func_001814C4');
  const mapping = [...baseline.symbolTables.values()].flat().find(symbol =>
    symbol.shndx === firstSection.index && /^\$a(?:\.|$)/.test(symbol.name));
  const primary = name => [...baseline.symbolTables.values()].flat().find(symbol => symbol.name === name);
  const localAlias = Buffer.from(object);
  localAlias.writeUInt32LE(primary('func_001878A8').nameOffset, mapping.entry);
  expectReject('extra local named alias', () => validateObject(parseElf(localAlias), config));
  const globalAlias = Buffer.from(object);
  const owner = primary('func_00170340');
  globalAlias.writeUInt32LE(0, owner.entry + 4);
  globalAlias.writeUInt32LE(0, owner.entry + 8);
  globalAlias[owner.entry + 12] = 0x10;
  globalAlias.writeUInt16LE(firstSection.index, owner.entry + 14);
  expectReject('extra global named alias', () => validateObject(parseElf(globalAlias), config));
  const defineInForeign = (buffer, symbol, sectionIndex, value = 0, info = 0x12) => {
    buffer.writeUInt32LE(value, symbol.entry + 4);
    buffer[symbol.entry + 12] = info;
    buffer.writeUInt16LE(sectionIndex, symbol.entry + 14);
    const header = fixture.newOffset + sectionIndex * 40;
    buffer.writeUInt32LE(4, header + 20);
    buffer.writeUInt32LE(4, header + 32);
  };
  const collapsed = Buffer.from(fixture.buffer);
  const collapsedElf = parseElf(collapsed);
  const collapsedSymbols = [...collapsedElf.symbolTables.values()].flat();
  const foreignIndex = fixture.oldCount;
  for (const name of ['func_001878A8', 'func_001870E4'])
    defineInForeign(collapsed, collapsedSymbols.find(symbol => symbol.name === name), foreignIndex);
  expectReject('destination identity collapse', () => validateObject(parseElf(collapsed), config));
  for (const [label, info, value] of [
    ['destination binding violation', 0x02, 0],
    ['destination type violation', 0x11, 0],
    ['destination state violation', 0x12, 1],
  ]) {
    const hostile = Buffer.from(fixture.buffer);
    const hostileElf = parseElf(hostile);
    const symbol = [...hostileElf.symbolTables.values()].flat().find(item => item.name === 'func_001878A8');
    defineInForeign(hostile, symbol, fixture.oldCount, value, info);
    expectReject(label, () => validateObject(parseElf(hostile), config));
  }
  const configDrift = structuredClone(config);
  configDrift.selectionNotes.nextUnselectedSuitable = 'func_00000000';
  expectReject('configuration contract drift', () => validateConfig(configDrift, source));
  expectReject('source contract drift', () => validateConfig(config, Buffer.concat([source, Buffer.from('\n')])));
  console.log(`self-test: passed (${composite.sectionCount} sections, >12,000 foreign executable sections, hostile mutations and all resource caps)`);
}

let temporary;
try {
  const config = JSON.parse(readCapped(CONFIG_PATH, 'config').toString('utf8'));
  const source = readCapped(join(ROOT, config.source), 'source');
  validateConfig(config, source);
  const args = process.argv.slice(2);
  const selfTestRequested = args.includes('--self-test');
  const objectAt = args.indexOf('--object');
  if (args.some((arg, index) => arg !== '--self-test' && arg !== '--object' && index !== objectAt + 1) ||
      (objectAt >= 0 && !args[objectAt + 1])) {
    fail('usage: validate-arm-ipc-wrappers-93.mjs [--self-test] [--object FILE]');
  }
  let buffer;
  if (objectAt >= 0) buffer = readCapped(resolve(args[objectAt + 1]), 'object');
  else ({ temporary, buffer } = assemble(config));
  const parsed = parseElf(buffer);
  validateObject(parsed, config);
  if (selfTestRequested) selfTest(buffer, config, source);
  console.log(`validated batch 93: 2 functions, 193 instructions, 6 calls, SHA-256 ${sha256(source)}`);
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
