#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { closeSync, fstatSync, mkdtempSync, openSync, readSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/arm-ipc-wrappers-95.json');
const SOURCE_PATH = join(ROOT, 'src/main/arm_ipc_wrappers_95.S');
const FILE_CAP = 64 * 1024 * 1024;
const SECTION_CAP = 16_384;
const SYMBOL_CAP = 1_000_000;
const RELOCATION_CAP = 1_000_000;
const EXEC_CAP = 16 * 1024 * 1024;
const ELF_FLAGS = 0x05000000;
const SOURCE_HASH = '74f4c05e6c792936ea65b85f5601d7e471534591de27dde0c77cccc2c2ed1034';
const CONFIG_HASH = '9940418a39a9c4a40a0366961def27c03bea309d04b4ec9fb7a5b33a82a289fa';
const BODY_HASH = '57d216238b9bf7933ee6c0b01172b335c91ee7634db56937729cfd74a3ea3875';
const FUNCTION = 'func_00183E28';
const SECTION = '.text.func_00183E28';
const CALLEE = 'func_0018A0BC';
const BODY_SIZE = 328;
const CALL_OFFSET = 280;
const RETURN_OFFSET = 324;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function range(total, offset, size, label) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= total && size <= total - offset, `${label}: range outside file`);
}
function readCapped(path) {
  const fd = openSync(path, 'r');
  try {
    const size = fstatSync(fd).size;
    check(size <= FILE_CAP, `${path}: exceeds ${FILE_CAP} bytes`);
    const bytes = Buffer.alloc(size);
    let done = 0;
    while (done < size) {
      const amount = readSync(fd, bytes, done, size - done, done);
      check(amount > 0, `${path}: truncated read`);
      done += amount;
    }
    return bytes;
  } finally { closeSync(fd); }
}
function cstring(buffer, start, end, label) {
  check(start >= 0 && start < end, `${label}: invalid offset`);
  const nul = buffer.indexOf(0, start);
  check(nul >= start && nul < end, `${label}: unterminated string`);
  return buffer.toString('utf8', start, nul);
}

function parseElf(buffer) {
  check(buffer.length <= FILE_CAP, 'ELF exceeds file cap');
  range(buffer.length, 0, 52, 'ELF header');
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), 'not ELF');
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    'requires ELF32 little-endian System V ABI version 0');
  check(buffer.subarray(9, 16).every(x => x === 0), 'nonzero ELF identification padding');
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 && buffer.readUInt32LE(20) === 1,
    'requires ELF32 ARM ET_REL version 1');
  check(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 &&
    buffer.readUInt32LE(36) === ELF_FLAGS, 'invalid entry point, program headers, or ARM flags');
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(42) === 0 &&
    buffer.readUInt16LE(44) === 0 && buffer.readUInt16LE(46) === 40, 'invalid ELF header sizes');
  const shoff = buffer.readUInt32LE(32);
  let count = buffer.readUInt16LE(48);
  let namesIndex = buffer.readUInt16LE(50);
  range(buffer.length, shoff, 40, 'section zero');
  if (count === 0) count = buffer.readUInt32LE(shoff + 20);
  if (namesIndex === 0xffff) namesIndex = buffer.readUInt32LE(shoff + 24);
  check(count > 0 && count <= SECTION_CAP, 'invalid section count');
  check(namesIndex < count, 'invalid section-name table index');
  range(buffer.length, shoff, count * 40, 'section table');
  const sections = [];
  let executablePayload = 0;
  for (let index = 0; index < count; index++) {
    const p = shoff + index * 40;
    const section = { index, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4),
      flags: buffer.readUInt32LE(p + 8), address: buffer.readUInt32LE(p + 12),
      offset: buffer.readUInt32LE(p + 16), size: buffer.readUInt32LE(p + 20),
      link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28),
      align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36) };
    if (section.type !== 8) range(buffer.length, section.offset, section.size, `section ${index}`);
    if ((section.flags & 4) !== 0) {
      executablePayload += section.size;
      check(executablePayload <= EXEC_CAP, 'executable payload exceeds cap');
    }
    sections.push(section);
  }
  const zero = sections[0];
  check(Object.entries(zero).filter(([key]) => key !== 'index').every(([, value]) => value === 0),
    'noncanonical null section');
  const names = sections[namesIndex];
  check(names.type === 3, 'section names are not a STRTAB');
  for (const section of sections) section.name = cstring(buffer, names.offset + section.nameOffset,
    names.offset + names.size, `section ${section.index} name`);
  const symbolTables = new Map();
  let symbolCount = 0;
  for (const section of sections.filter(x => x.type === 2 || x.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbols`);
    const amount = section.size / 16;
    symbolCount += amount;
    check(symbolCount <= SYMBOL_CAP, 'symbol count exceeds cap');
    const strings = sections[section.link];
    check(strings?.type === 3, `${section.name}: invalid string table`);
    const symbols = [];
    for (let index = 0; index < amount; index++) {
      const p = section.offset + index * 16;
      const nameOffset = buffer.readUInt32LE(p);
      symbols.push({ table: section.index, index, entryOffset: p,
        name: cstring(buffer, strings.offset + nameOffset, strings.offset + strings.size,
          `${section.name} symbol ${index}`),
        value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8),
        info: buffer[p + 12], other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14) });
    }
    const nullSymbol = symbols[0];
    check(nullSymbol && nullSymbol.name === '' && nullSymbol.value === 0 && nullSymbol.size === 0 &&
      nullSymbol.info === 0 && nullSymbol.other === 0 && nullSymbol.shndx === 0,
    `${section.name}: noncanonical null symbol`);
    symbolTables.set(section.index, symbols);
  }
  const relocations = [];
  let relocationCount = 0;
  for (const section of sections.filter(x => x.type === 9 || x.type === 4)) {
    const width = section.type === 9 ? 8 : 12;
    check(section.entsize === width && section.size % width === 0, `${section.name}: malformed relocations`);
    const amount = section.size / width;
    relocationCount += amount;
    check(relocationCount <= RELOCATION_CAP, 'relocation count exceeds cap');
    const symbols = symbolTables.get(section.link);
    const target = sections[section.info];
    check(symbols && target, `${section.name}: invalid relocation links`);
    for (let index = 0; index < amount; index++) {
      const p = section.offset + index * width;
      const offset = buffer.readUInt32LE(p);
      range(target.size, offset, 4, `${section.name} relocation ${index}`);
      const info = buffer.readUInt32LE(p + 4), symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length, `${section.name}: invalid relocation symbol`);
      relocations.push({ entryOffset: p, sectionIndex: section.info, offset, type: info & 0xff,
        symbol: symbols[symbolIndex].name, symbolTable: section.link, symbolIndex });
    }
  }
  return { buffer, sections, symbolTables, relocations, sectionCount: count };
}

function allSymbols(parsed) { return [...parsed.symbolTables.values()].flat(); }
function oneSymbol(symbols, name) {
  const matches = symbols.filter(x => x.name === name);
  check(matches.length === 1, `${name}: expected one symbol, found ${matches.length}`);
  return matches[0];
}
function validateConfig(bytes) {
  assert.equal(sha256(bytes), CONFIG_HASH, 'configuration contract mismatch');
  const config = JSON.parse(bytes.toString('utf8'));
  assert.equal(config.schemaVersion, 1);
  assert.equal(config.source, 'src/main/arm_ipc_wrappers_95.S');
  assert.equal(config.mode, 'arm');
  assert.equal(config.totalBodySize, BODY_SIZE);
  assert.equal(config.totalAdjacentSize, 0);
  assert.equal(config.cumulativePoolSlots, 892);
  assert.equal(config.cumulativePoolClasses, 469);
  assert.deepEqual(config.functions, [{ name: FUNCTION, section: SECTION, size: BODY_SIZE,
    nextGlobal: 'func_00184020', nextGlobalOffset: 504,
    branches: [{ offset: CALL_OFFSET, kind: 'R_ARM_CALL', transfer: 'linked', symbol: CALLEE }],
    indirectCalls: [], returnOffsets: [RETURN_OFFSET], literals: [] }]);
  assert.deepEqual(config.literalIdentities, []);
  assert.deepEqual(config.reusedLiteralIdentities, []);
  assert.deepEqual(config.newLiteralIdentities, []);
  assert.deepEqual(config.branchIdentityContract, { mode: 'arm', minimumAlignment: 4,
    primaryEntries: [CALLEE], secondaryEntries: [], secondaryEntryRelations: [], sharedClasses: [],
    singletonClasses: [CALLEE], classesPairwiseDistinct: true, armPrimaryEntries: [CALLEE],
    thumbPrimaryEntries: [] });
  assert.deepEqual(config.selectionNotes, { skippedEarlierUnmatched: [{ name: 'func_00180F24', size: 1356,
    reason: 'large multi-loop scheduler/dispatcher outside the bounded wrapper cohort' }],
    unownedBytesBeforeNextGlobal: 176, nextUnselectedSuitable: 'func_00184744' });
  return config;
}
function validateSource(bytes) {
  assert.equal(sha256(bytes), SOURCE_HASH, 'source hash mismatch');
  const source = bytes.toString('utf8');
  assert.equal((source.match(/^\.syntax unified$/gm) || []).length, 1);
  assert.equal((source.match(/^\.arm$/gm) || []).length, 1);
  assert.equal((source.match(/^\.fpu vfpv2$/gm) || []).length, 1);
  assert.equal((source.match(/^\s*bl\s+func_0018A0BC\s*$/gm) || []).length, 1);
  assert.equal((source.match(/^\s*blx?\s+/gm) || []).length, 1);
  assert.doesNotMatch(source, /^\s*\.(?:word|long|4byte)\b/gm);
}

function validateObject(buffer) {
  const parsed = parseElf(buffer);
  const symbols = allSymbols(parsed);
  const sections = parsed.sections.filter(x => x.name === SECTION);
  check(sections.length === 1, `${SECTION}: expected one section`);
  const section = sections[0];
  check(section.type === 1 && section.flags === 6 && section.address === 0 && section.size === BODY_SIZE &&
    section.link === 0 && section.info === 0 && section.align === 4 && section.entsize === 0,
  'owned section extent or attributes mismatch');
  const executableSections = parsed.sections.filter(x => (x.flags & 4) !== 0 && x.size !== 0);
  check(executableSections.length === 1 && executableSections[0] === section,
    'unexpected executable payload outside owned section');
  check(parsed.symbolTables.size === 1, 'expected exactly one symbol table');
  const [symbolTableIndex, tableSymbols] = parsed.symbolTables.entries().next().value;
  const symbolTable = parsed.sections[symbolTableIndex];
  check(symbolTable.type === 2 && symbolTable.flags === 0 && symbolTable.address === 0 &&
    symbolTable.align === 4 && symbolTable.entsize === 16 && symbolTable.info > 0 &&
    symbolTable.info <= tableSymbols.length &&
    tableSymbols.every((symbol, index) => ((symbol.info >>> 4) === 0) === (index < symbolTable.info)),
  'symbol-table attributes or local/global partition mismatch');
  const owner = oneSymbol(symbols, FUNCTION);
  check(owner.shndx === section.index && owner.value === 0 && owner.size === BODY_SIZE &&
    owner.info === 0x12 && owner.other === 0, 'primary function ownership mismatch');
  const callee = oneSymbol(symbols, CALLEE);
  check((callee.info >>> 4) === 1 && callee.other === 0, 'callee must be global and default-visible');
  if (callee.shndx === 0) {
    check(callee.value === 0 && callee.size === 0 && (callee.info & 15) === 0,
      'undefined callee must be zero-sized NOTYPE');
  } else {
    const destination = parsed.sections[callee.shndx];
    check((callee.info & 15) === 2 && destination?.type === 1 && (destination.flags & 4) !== 0 &&
      destination.align >= 4 && (callee.value & 3) === 0 && callee.value < destination.size,
    'resolved callee is not a four-byte-aligned ARM function');
  }
  check(!(callee.shndx === owner.shndx && callee.value === owner.value), 'callee aliases owned function');
  const sectionSymbols = symbols.filter(x => x.shndx === section.index && x.name === '' && x.value === 0 &&
    x.size === 0 && x.info === 3 && x.other === 0);
  check(sectionSymbols.length === 1, 'canonical section symbol mismatch');
  const allSectionSymbols = symbols.filter(x => (x.info & 15) === 3);
  check(allSectionSymbols.every((symbol, index, entries) => symbol.name === '' && symbol.value === 0 &&
    symbol.size === 0 && symbol.info === 3 && symbol.other === 0 && symbol.shndx > 0 &&
    symbol.shndx < parsed.sectionCount &&
    entries.findIndex(candidate => candidate.shndx === symbol.shndx) === index),
  'noncanonical or duplicate section symbol');
  const mappings = symbols.filter(x => x.shndx === section.index && (x.name === '$a' || x.name === '$d' || x.name === '$t'));
  check(mappings.length === 1 && mappings[0].name === '$a' && mappings[0].value === 0 &&
    mappings[0].size === 0 && mappings[0].info === 0 && mappings[0].other === 0,
  'ARM mapping-symbol contract mismatch');
  const allowed = new Set([owner, sectionSymbols[0], mappings[0]]);
  const intruder = symbols.find(x => x.shndx === section.index && !allowed.has(x));
  check(!intruder, `unexpected secondary entry, alias, or owner: ${intruder?.name || '<unnamed>'}`);
  const exactSymbols = new Set([tableSymbols[0], owner, callee, mappings[0], ...allSectionSymbols]);
  const extraSymbol = symbols.find(symbol => !exactSymbols.has(symbol));
  check(!extraSymbol, `unexpected symbol: ${extraSymbol?.name || '<unnamed>'}`);
  const extent = buffer.subarray(section.offset, section.offset + section.size);
  assert.equal(sha256(extent), BODY_HASH, 'ordered 82-slot semantic schedule mismatch');
  const relocs = parsed.relocations.filter(x => x.sectionIndex === section.index)
    .map(({ offset, type, symbol }) => ({ offset, type, symbol }));
  assert.deepEqual(relocs, [{ offset: CALL_OFFSET, type: 28, symbol: CALLEE }], 'relocation schedule mismatch');
  check(parsed.relocations.length === 1, 'unexpected relocation outside owned extent');
  const relocationSections = parsed.sections.filter(x => x.type === 9 || x.type === 4);
  check(relocationSections.length === 1, 'expected exactly one relocation section');
  const relocationSection = relocationSections[0];
  check(relocationSection.name === `.rel${SECTION}` && relocationSection.type === 9 &&
    relocationSection.flags === 0x40 && relocationSection.address === 0 && relocationSection.size === 8 &&
    relocationSection.link === symbolTable.index && relocationSection.info === section.index &&
    relocationSection.align === 4 && relocationSection.entsize === 8,
  'relocation-section ownership or attributes mismatch');
  const call = extent.readUInt32LE(CALL_OFFSET);
  check((call & 0xff000000) >>> 0 === 0xeb000000, 'call site is not linked ARM BL');
  assert.equal(extent.readUInt32LE(RETURN_OFFSET), 0xe8bd80f0, 'return slot mismatch');
  let directTransfers = 0;
  for (let offset = 0; offset < BODY_SIZE; offset += 4) {
    if ((extent.readUInt32LE(offset) & 0x0e000000) === 0x0a000000) directTransfers++;
  }
  assert.equal(directTransfers, 16, 'expected fifteen local branches and one external call');
  assert.equal(parsed.relocations.filter(x => x.sectionIndex === section.index).length, 1,
    'unexpected relocation in owned extent');
  return parsed;
}

function locateAssembler() {
  const candidates = [process.env.ARM_AS,
    process.env.ARM_NONE_EABI_PREFIX && `${process.env.ARM_NONE_EABI_PREFIX}as`,
    process.env.CROSS_COMPILE && `${process.env.CROSS_COMPILE}as`, 'arm-none-eabi-as'].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0 && /GNU assembler/i.test(probe.stdout + probe.stderr)) return candidate;
  }
  const nix = spawnSync('nix', ['build', '--no-link', '--print-out-paths', 'nixpkgs#gcc-arm-embedded'],
    { encoding: 'utf8' });
  check(nix.status === 0, 'cannot locate GNU Arm assembler');
  return join(nix.stdout.trim().split(/\s+/).at(-1), 'bin/arm-none-eabi-as');
}
function assemble(assembler) {
  const temporary = mkdtempSync(join(tmpdir(), 'arm-ipc-wrappers-95-'));
  const object = join(temporary, 'batch.o');
  const result = spawnSync(assembler, ['-mcpu=cortex-a9', '-mfpu=vfpv2', '-o', object, SOURCE_PATH],
    { encoding: 'utf8' });
  if (result.status !== 0) fail(`assembler failed:\n${result.stderr || result.stdout}`);
  return { temporary, buffer: readCapped(object) };
}
function expectReject(label, action) {
  try { action(); } catch { return; }
  fail(`self-test accepted hostile ${label}`);
}
function selfTest(buffer, sourceBytes, configBytes) {
  const sourceMutation = Buffer.from(sourceBytes);
  sourceMutation[sourceMutation.indexOf('vfpv2')] ^= 1;
  expectReject('source mutation', () => validateSource(sourceMutation));
  const configMutation = Buffer.from(configBytes);
  configMutation[configMutation.indexOf('328')] = 0x39;
  expectReject('configuration mutation', () => validateConfig(configMutation));
  const badBody = Buffer.from(buffer), badBodyElf = parseElf(badBody);
  const owned = badBodyElf.sections.find(x => x.name === SECTION);
  badBody[owned.offset] ^= 1;
  expectReject('instruction mutation', () => validateObject(badBody));
  const badReturn = Buffer.from(buffer), returnElf = parseElf(badReturn);
  const returnSection = returnElf.sections.find(x => x.name === SECTION);
  badReturn[returnSection.offset + RETURN_OFFSET] ^= 1;
  expectReject('return mutation', () => validateObject(badReturn));
  const badRelocation = Buffer.from(buffer), relocationElf = parseElf(badRelocation);
  const relocation = relocationElf.relocations.find(x => x.sectionIndex ===
    relocationElf.sections.find(section => section.name === SECTION).index);
  badRelocation.writeUInt32LE((relocation.symbolIndex << 8) | 2, relocation.entryOffset + 4);
  expectReject('relocation kind', () => validateObject(badRelocation));
  const badCallee = Buffer.from(buffer), calleeElf = parseElf(badCallee);
  const callee = oneSymbol(allSymbols(calleeElf), CALLEE);
  badCallee[callee.entryOffset + 12] = 0;
  expectReject('callee binding', () => validateObject(badCallee));
  const badCalleeVisibility = Buffer.from(buffer), calleeVisibilityElf = parseElf(badCalleeVisibility);
  const hiddenCallee = oneSymbol(allSymbols(calleeVisibilityElf), CALLEE);
  badCalleeVisibility[hiddenCallee.entryOffset + 13] = 2;
  expectReject('callee visibility', () => validateObject(badCalleeVisibility));
  const badCalleeType = Buffer.from(buffer), calleeTypeElf = parseElf(badCalleeType);
  const typedCallee = oneSymbol(allSymbols(calleeTypeElf), CALLEE);
  badCalleeType[typedCallee.entryOffset + 12] = 0x12;
  expectReject('undefined callee type', () => validateObject(badCalleeType));
  const interiorAlias = Buffer.from(buffer), interiorAliasElf = parseElf(interiorAlias);
  const aliasOwner = oneSymbol(allSymbols(interiorAliasElf), FUNCTION);
  const aliasCallee = oneSymbol(allSymbols(interiorAliasElf), CALLEE);
  interiorAlias.writeUInt32LE(4, aliasCallee.entryOffset + 4);
  interiorAlias[aliasCallee.entryOffset + 12] = 0x12;
  interiorAlias.writeUInt16LE(aliasOwner.shndx, aliasCallee.entryOffset + 14);
  expectReject('interior function alias', () => validateObject(interiorAlias));
  const badOwner = Buffer.from(buffer), ownerElf = parseElf(badOwner);
  const owner = oneSymbol(allSymbols(ownerElf), FUNCTION);
  badOwner.writeUInt32LE(BODY_SIZE - 4, owner.entryOffset + 8);
  expectReject('owner size', () => validateObject(badOwner));
  const badNullSymbol = Buffer.from(buffer), nullSymbolElf = parseElf(badNullSymbol);
  const nullTable = [...nullSymbolElf.symbolTables.keys()][0];
  badNullSymbol[nullSymbolElf.sections[nullTable].offset + 13] = 1;
  expectReject('null symbol', () => validateObject(badNullSymbol));
  const badSectionSymbol = Buffer.from(buffer), sectionSymbolElf = parseElf(badSectionSymbol);
  const sectionSymbol = allSymbols(sectionSymbolElf).find(symbol =>
    symbol.shndx === sectionSymbolElf.sections.find(candidate => candidate.name === SECTION).index &&
    (symbol.info & 15) === 3);
  badSectionSymbol[sectionSymbol.entryOffset + 13] = 1;
  expectReject('section symbol', () => validateObject(badSectionSymbol));
  const badMapping = Buffer.from(buffer), mappingElf = parseElf(badMapping);
  const mapping = oneSymbol(allSymbols(mappingElf), '$a');
  badMapping[mapping.entryOffset + 12] = 1;
  expectReject('mapping symbol type', () => validateObject(badMapping));
  const badOwnedMetadata = Buffer.from(buffer), ownedMetadataElf = parseElf(badOwnedMetadata);
  const ownedMetadata = ownedMetadataElf.sections.find(section => section.name === SECTION);
  badOwnedMetadata.writeUInt32LE(1, ownedMetadataElf.buffer.readUInt32LE(32) + ownedMetadata.index * 40 + 24);
  expectReject('owned section link', () => validateObject(badOwnedMetadata));
  const badRelocationOwner = Buffer.from(buffer), relocationOwnerElf = parseElf(badRelocationOwner);
  const relocationSection = relocationOwnerElf.sections.find(section => section.type === 9);
  const relocationDecoy = relocationOwnerElf.sections.find(section => section.name === '.ARM.attributes');
  const relocationHeader = relocationOwnerElf.buffer.readUInt32LE(32) + relocationSection.index * 40;
  badRelocationOwner.writeUInt32LE(0, relocationSection.offset);
  badRelocationOwner.writeUInt32LE(relocationDecoy.index,
    relocationHeader + 28);
  expectReject('relocation ownership', () => validateObject(badRelocationOwner));
  const extraExecutable = Buffer.from(buffer), extraExecutableElf = parseElf(extraExecutable);
  const attributes = extraExecutableElf.sections.find(section => section.name === '.ARM.attributes');
  extraExecutable.writeUInt32LE(attributes.flags | 4,
    extraExecutableElf.buffer.readUInt32LE(32) + attributes.index * 40 + 8);
  expectReject('extra executable payload', () => validateObject(extraExecutable));
  const badHeader = Buffer.from(buffer);
  badHeader.writeUInt16LE(2, 16);
  expectReject('ELF type', () => parseElf(badHeader));
  const badNullSection = Buffer.from(buffer);
  badNullSection.writeUInt32LE(1, badNullSection.readUInt32LE(32) + 8);
  expectReject('null section', () => parseElf(badNullSection));
  const badFlags = Buffer.from(buffer);
  badFlags.writeUInt32LE(ELF_FLAGS ^ 1, 36);
  expectReject('ARM flags', () => parseElf(badFlags));
  const tooMany = Buffer.from(buffer);
  tooMany.writeUInt16LE(SECTION_CAP + 1, 48);
  expectReject('section cap', () => parseElf(tooMany));
}

let temporary;
try {
  const args = process.argv.slice(2);
  const self = args.includes('--self-test');
  const positional = args.filter(x => x !== '--self-test' && x !== '--object');
  check(args.every(x => x === '--self-test' || x === '--object' || !x.startsWith('-')) && positional.length <= 1,
    'usage: validate-arm-ipc-wrappers-95.mjs [--self-test] [--object FILE]');
  check(!args.includes('--object') || positional.length === 1,
    'usage: validate-arm-ipc-wrappers-95.mjs [--self-test] [--object FILE]');
  const configBytes = readCapped(CONFIG_PATH);
  validateConfig(configBytes);
  const sourceBytes = readCapped(SOURCE_PATH);
  validateSource(sourceBytes);
  let buffer;
  if (positional.length) buffer = readCapped(resolve(positional[0]));
  else {
    const assembled = assemble(locateAssembler());
    temporary = assembled.temporary;
    buffer = assembled.buffer;
  }
  validateObject(buffer);
  if (self) selfTest(buffer, sourceBytes, configBytes);
  console.log(`arm-ipc-wrappers-95: ok (82 instructions, 1 direct call, 15 local branches, 1 return, 0 literals${self ? ', self-test' : ''})`);
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
