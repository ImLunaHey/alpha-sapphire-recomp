#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, fstatSync, mkdtempSync, openSync, readSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/arm-ipc-wrappers-96.json');
const SPEC_PATH = join(ROOT, 'docs/specs/main/arm_ipc_wrappers_96.md');
const SOURCE_PATH = join(ROOT, 'src/main/arm_ipc_wrappers_96.S');
const SOURCE_HASH = 'ab4de9019cd279168e2574358d6214f5eb85400b11486403854bf0907ebe58d1';
const CONFIG_HASH = '0d4f92557f70f2a1dbca5831309eff452a2536ec082458d05ff377615f1c0622';
const NORMALIZED_CONFIG_HASH = '7d241d2cf71b0eb257db4f2baa25f7bf9962d2fcc3fb1f5fb9f6a5b7499d02ab';
const SPEC_HASH = 'c2efd3b08a9500605878de0eee593c153a94b141d6d0322d0b1a49658f633007';
const BODY_HASH = 'ad5851c98521c269988970123af4dd151a878c813c70163b951e9d9d4961d2ac';
const SECTION = '.text.func_00184744';
const FUNCTION = 'func_00184744';
const BODY_SIZE = 568;
const ELF_FLAGS = 0x05000000;
const FILE_CAP = 64 * 1024 * 1024;
const SECTION_CAP = 16_384;
const SYMBOL_CAP = 1_000_000;
const RELOCATION_CAP = 1_000_000;
const EXECUTABLE_CAP = 16 * 1024 * 1024;

const CALLS = [
  [36, 'func_0010048A', true], [60, 'func_001003E8', true],
  [104, 'func_0010048A', true], [148, 'func_0010048A', true],
  [200, 'func_001862A0', false], [216, 'func_001862A0', false],
  [228, 'func_0018CD7C', false], [244, 'func_0018D190', false],
  [252, 'func_0017F4A4', false], [268, 'func_001862FC', false],
  [276, 'func_001862FC', false], [340, 'func_0010046E', true],
  [364, 'func_0010046E', true], [392, 'func_001862A0', false],
  [408, 'func_001862A0', false], [420, 'func_0018CD7C', false],
  [436, 'func_0018D190', false], [464, 'func_0018CD7C', false],
  [480, 'func_0018A7B4', false], [512, 'func_001003FA', true],
  [528, 'func_0018CD7C', false],
];
const CALLEES = [...new Set(CALLS.map(([, symbol]) => symbol))];
const RETURN_OFFSETS = [328, 564];
const PC_REFERENCES = new Map([
  [28, 0xe28f1f85], [92, 0xe59fb1d8], [332, 0xe59f10ec], [356, 0xe59f10d8],
]);

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
    check(size <= FILE_CAP, `${path}: exceeds file cap`);
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
  check(buffer.length <= FILE_CAP, 'object exceeds file cap');
  range(buffer.length, 0, 52, 'ELF header');
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), 'not ELF');
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    'requires ELF32 little-endian System V ABI version 0');
  check(buffer.subarray(9, 16).every(byte => byte === 0), 'nonzero ELF identification padding');
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 &&
    buffer.readUInt32LE(20) === 1, 'requires ARM ET_REL ELF version 1');
  check(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 &&
    buffer.readUInt32LE(36) === ELF_FLAGS, 'invalid entry point, program headers, or ARM flags');
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(42) === 0 &&
    buffer.readUInt16LE(44) === 0 && buffer.readUInt16LE(46) === 40,
    'invalid ELF header sizes');
  const shoff = buffer.readUInt32LE(32);
  let sectionCount = buffer.readUInt16LE(48);
  let namesIndex = buffer.readUInt16LE(50);
  range(buffer.length, shoff, 40, 'section zero');
  if (sectionCount === 0) sectionCount = buffer.readUInt32LE(shoff + 20);
  if (namesIndex === 0xffff) namesIndex = buffer.readUInt32LE(shoff + 24);
  check(sectionCount > 0 && sectionCount <= SECTION_CAP && namesIndex < sectionCount,
    'invalid section count or names index');
  range(buffer.length, shoff, sectionCount * 40, 'section table');
  const sections = [];
  let executableSize = 0;
  for (let index = 0; index < sectionCount; index++) {
    const p = shoff + index * 40;
    const section = { index, headerOffset: p, nameOffset: buffer.readUInt32LE(p),
      type: buffer.readUInt32LE(p + 4), flags: buffer.readUInt32LE(p + 8),
      address: buffer.readUInt32LE(p + 12), offset: buffer.readUInt32LE(p + 16),
      size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24),
      info: buffer.readUInt32LE(p + 28), align: buffer.readUInt32LE(p + 32),
      entsize: buffer.readUInt32LE(p + 36) };
    if (section.type !== 8) range(buffer.length, section.offset, section.size, `section ${index}`);
    if ((section.flags & 4) !== 0) {
      executableSize += section.size;
      check(executableSize <= EXECUTABLE_CAP, 'executable payload exceeds cap');
    }
    sections.push(section);
  }
  check(Object.entries(sections[0]).filter(([key]) => key !== 'index' && key !== 'headerOffset')
    .every(([, value]) => value === 0), 'noncanonical null section');
  const names = sections[namesIndex];
  check(names.type === 3, 'section-name table is not STRTAB');
  for (const section of sections) section.name = cstring(buffer,
    names.offset + section.nameOffset, names.offset + names.size, `section ${section.index} name`);

  const symbolTables = new Map();
  let symbolCount = 0;
  for (const section of sections.filter(candidate => candidate.type === 2 || candidate.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbols`);
    const count = section.size / 16;
    symbolCount += count;
    check(symbolCount <= SYMBOL_CAP, 'symbol count exceeds cap');
    const strings = sections[section.link];
    check(strings?.type === 3, `${section.name}: invalid string table`);
    const symbols = [];
    for (let index = 0; index < count; index++) {
      const p = section.offset + index * 16;
      const nameOffset = buffer.readUInt32LE(p);
      symbols.push({ table: section.index, index, entryOffset: p,
        name: cstring(buffer, strings.offset + nameOffset, strings.offset + strings.size,
          `${section.name} symbol ${index}`), value: buffer.readUInt32LE(p + 4),
        size: buffer.readUInt32LE(p + 8), info: buffer[p + 12], other: buffer[p + 13],
        shndx: buffer.readUInt16LE(p + 14) });
    }
    const zero = symbols[0];
    check(zero && zero.name === '' && zero.value === 0 && zero.size === 0 && zero.info === 0 &&
      zero.other === 0 && zero.shndx === 0, `${section.name}: noncanonical null symbol`);
    symbolTables.set(section.index, symbols);
  }

  const relocations = [];
  let relocationCount = 0;
  for (const section of sections.filter(candidate => candidate.type === 9 || candidate.type === 4)) {
    const width = section.type === 9 ? 8 : 12;
    check(section.entsize === width && section.size % width === 0,
      `${section.name}: malformed relocations`);
    relocationCount += section.size / width;
    check(relocationCount <= RELOCATION_CAP, 'relocation count exceeds cap');
    const symbols = symbolTables.get(section.link), target = sections[section.info];
    check(symbols && target, `${section.name}: invalid relocation links`);
    for (let index = 0; index < section.size / width; index++) {
      const p = section.offset + index * width;
      const offset = buffer.readUInt32LE(p), info = buffer.readUInt32LE(p + 4);
      range(target.size, offset, 4, `${section.name} relocation ${index}`);
      const symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length, `${section.name}: invalid relocation symbol`);
      relocations.push({ entryOffset: p, relocationSection: section.index,
        sectionIndex: section.info, offset, type: info & 0xff, symbolIndex,
        symbol: symbols[symbolIndex].name });
    }
  }
  return { buffer, sections, symbolTables, relocations, sectionCount };
}

function allSymbols(parsed) { return [...parsed.symbolTables.values()].flat(); }
function oneSymbol(symbols, name) {
  const matches = symbols.filter(symbol => symbol.name === name);
  check(matches.length === 1, `${name}: expected one symbol, found ${matches.length}`);
  return matches[0];
}
function validateConfig(bytes) {
  assert.equal(sha256(bytes), CONFIG_HASH, 'configuration contract mismatch');
  const config = JSON.parse(bytes.toString('utf8'));
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  assert.equal(sha256(Buffer.from(JSON.stringify(normalized))), NORMALIZED_CONFIG_HASH,
    'normalized configuration contract mismatch');
  assert.equal(config.schemaVersion, 1);
  assert.equal(config.source, 'src/main/arm_ipc_wrappers_96.S');
  assert.equal(config.sourceHash, SOURCE_HASH);
  assert.equal(config.mode, 'arm');
  assert.equal(config.totalBodySize, BODY_SIZE);
  assert.equal(config.totalAdjacentSize, 0);
  assert.equal(config.cumulativePoolSlots, 892);
  assert.equal(config.cumulativePoolClasses, 469);
  assert.deepEqual(config.functions[0].branches.map(branch =>
    [branch.offset, branch.symbol, branch.transfer === 'linked-state-exchange']), CALLS);
  assert.deepEqual(config.functions[0].returnOffsets, RETURN_OFFSETS);
  assert.deepEqual(config.functions[0].postBodyReferences.map(reference =>
    [reference.offset, reference.targetOffset, reference.bytesOwnedByBatch, reference.relocation]),
  [[28, 568, false, null], [92, 572, false, null], [332, 576, false, null],
    [356, 580, false, null]]);
  assert.equal(config.postBodyReferenceContract.remainingUnownedGapBytes, 20);
  assert.deepEqual(config.postBodyReferenceContract.knownSecondaryEntry,
    { symbol: 'arm_duplicate_templates_75_allocator_preentry', owner: FUNCTION,
      ownerOffset: 584, nextGlobal: 'func_00184990', bytesBeforeNextGlobal: 4 });
  return config;
}
function validateSource(bytes) {
  assert.equal(sha256(bytes), SOURCE_HASH, 'source hash mismatch');
  const source = bytes.toString('utf8');
  assert.equal((source.match(/^\.syntax unified$/gm) || []).length, 1);
  assert.equal((source.match(/^\.arm$/gm) || []).length, 1);
  assert.equal((source.match(/^\.fpu vfpv2$/gm) || []).length, 1);
  assert.equal((source.match(/^\s*blx?\s+/gm) || []).length, 21);
  assert.equal((source.match(/^\s*nop\s*$/gm) || []).length, 6);
  assert.doesNotMatch(source, /^\s*\.(?:word|long|4byte|byte|hword|short|incbin)\b/gm);
  assert.doesNotMatch(source, /service_(?:inline_match_key|match_key_pointer|parse_class_[ab]_pointer)_96/);
}

function validateObject(buffer) {
  const parsed = parseElf(buffer), symbols = allSymbols(parsed);
  const ownedMatches = parsed.sections.filter(section => section.name === SECTION);
  check(ownedMatches.length === 1, `${SECTION}: expected one section`);
  const owned = ownedMatches[0];
  check(owned.type === 1 && owned.flags === 6 && owned.address === 0 && owned.size === BODY_SIZE &&
    owned.link === 0 && owned.info === 0 && owned.align === 4 && owned.entsize === 0,
    'owned section metadata mismatch');
  const executable = parsed.sections.filter(section => (section.flags & 4) !== 0 && section.size !== 0);
  check(executable.length === 1 && executable[0] === owned, 'unexpected executable payload');
  check(parsed.symbolTables.size === 1, 'expected exactly one symbol table');
  const [symbolTableIndex, tableSymbols] = parsed.symbolTables.entries().next().value;
  const symbolTable = parsed.sections[symbolTableIndex];
  check(symbolTable.type === 2 && symbolTable.flags === 0 && symbolTable.address === 0 &&
    symbolTable.align === 4 && symbolTable.entsize === 16 && symbolTable.info > 0 &&
    symbolTable.info <= tableSymbols.length && tableSymbols.every((symbol, index) =>
      ((symbol.info >>> 4) === 0) === (index < symbolTable.info)),
    'symbol-table metadata or partition mismatch');

  const owner = oneSymbol(symbols, FUNCTION);
  check(owner.shndx === owned.index && owner.value === 0 && owner.size === BODY_SIZE &&
    owner.info === 0x12 && owner.other === 0, 'function owner mismatch');
  const ownedSectionSymbols = symbols.filter(symbol => symbol.shndx === owned.index &&
    symbol.name === '' && symbol.value === 0 && symbol.size === 0 && symbol.info === 3 && symbol.other === 0);
  check(ownedSectionSymbols.length === 1, 'canonical owned section symbol mismatch');
  const mappingSymbols = symbols.filter(symbol => symbol.shndx === owned.index &&
    (symbol.name === '$a' || symbol.name === '$d' || symbol.name === '$t'));
  check(mappingSymbols.length === 1 && mappingSymbols[0].name === '$a' &&
    mappingSymbols[0].value === 0 && mappingSymbols[0].size === 0 && mappingSymbols[0].info === 0 &&
    mappingSymbols[0].other === 0, 'ARM mapping-symbol contract mismatch');
  const allowedOwned = new Set([owner, ownedSectionSymbols[0], mappingSymbols[0]]);
  check(!symbols.some(symbol => symbol.shndx === owned.index && !allowedOwned.has(symbol)),
    'unexpected alias, secondary entry, or data mapping in owned section');
  for (const name of CALLEES) {
    const callee = oneSymbol(symbols, name);
    check(callee.shndx === 0 && callee.value === 0 && callee.size === 0 && callee.info === 0x10 &&
      callee.other === 0, `${name}: undefined destination metadata mismatch`);
  }
  check(symbols.filter(symbol => symbol.shndx === 0 && symbol.index !== 0).length === CALLEES.length,
    'unexpected undefined symbols');

  const extent = buffer.subarray(owned.offset, owned.offset + owned.size);
  assert.equal(sha256(extent), BODY_HASH, 'ordered 142-slot semantic schedule mismatch');
  const expectedRelocations = CALLS.map(([offset, symbol]) => ({ offset, type: 28, symbol }));
  const actualRelocations = parsed.relocations.filter(relocation => relocation.sectionIndex === owned.index)
    .map(({ offset, type, symbol }) => ({ offset, type, symbol }));
  assert.deepEqual(actualRelocations, expectedRelocations, 'relocation schedule mismatch');
  assert.equal(parsed.relocations.length, CALLS.length, 'unexpected relocation outside owned extent');
  const relocationSections = parsed.sections.filter(section => section.type === 9 || section.type === 4);
  check(relocationSections.length === 1, 'expected one SHT_REL section');
  const rel = relocationSections[0];
  check(rel.name === `.rel${SECTION}` && rel.type === 9 && rel.flags === 0x40 && rel.address === 0 &&
    rel.size === CALLS.length * 8 && rel.link === symbolTable.index && rel.info === owned.index &&
    rel.align === 4 && rel.entsize === 8, 'relocation-section metadata mismatch');
  for (const [offset,, exchange] of CALLS) {
    assert.equal(extent.readUInt32LE(offset), exchange ? 0xfafffffe : 0xebfffffe,
      `call at +${offset}: transfer state or zero addend mismatch`);
  }
  for (const [offset, opcode] of PC_REFERENCES)
    assert.equal(extent.readUInt32LE(offset), opcode, `PC-relative reference at +${offset} mismatch`);
  for (const offset of RETURN_OFFSETS)
    assert.equal(extent.readUInt32LE(offset), 0xe8bd8ff0, `return at +${offset} mismatch`);
  let transfers = 0;
  for (let offset = 0; offset < BODY_SIZE; offset += 4)
    if ((extent.readUInt32LE(offset) & 0x0e000000) === 0x0a000000) transfers++;
  assert.equal(transfers, 36, 'expected 21 calls and 15 local branches');
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
  const temporary = mkdtempSync(join(tmpdir(), 'arm-ipc-wrappers-96-'));
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
function selfTest(buffer, sourceBytes, configBytes, specBytes) {
  const badSource = Buffer.from(sourceBytes);
  badSource[badSource.indexOf('vfpv2')] ^= 1;
  expectReject('source mutation', () => validateSource(badSource));
  const badConfig = Buffer.from(configBytes);
  badConfig[badConfig.indexOf('568')] = 0x39;
  expectReject('configuration mutation', () => validateConfig(badConfig));
  const badSpec = Buffer.concat([specBytes, Buffer.from('\n')]);
  expectReject('specification mutation', () => check(sha256(badSpec) === SPEC_HASH,
    'specification contract mismatch'));
  const badBody = Buffer.from(buffer), bodyElf = parseElf(badBody);
  const bodySection = bodyElf.sections.find(section => section.name === SECTION);
  badBody[bodySection.offset + 4] ^= 1;
  expectReject('instruction mutation', () => validateObject(badBody));
  const badPcReference = Buffer.from(buffer), pcElf = parseElf(badPcReference);
  const pcSection = pcElf.sections.find(section => section.name === SECTION);
  badPcReference[pcSection.offset + 28] ^= 1;
  expectReject('unowned PC-reference target', () => validateObject(badPcReference));
  const badRelocation = Buffer.from(buffer), relocationElf = parseElf(badRelocation);
  const relocation = relocationElf.relocations[0];
  badRelocation.writeUInt32LE((relocation.symbolIndex << 8) | 2, relocation.entryOffset + 4);
  expectReject('relocation kind', () => validateObject(badRelocation));
  const badCall = Buffer.from(buffer), callElf = parseElf(badCall);
  const callSection = callElf.sections.find(section => section.name === SECTION);
  badCall.writeUInt32LE(0xebfffffe, callSection.offset + 36);
  expectReject('call state transition', () => validateObject(badCall));
  const badOwner = Buffer.from(buffer), ownerElf = parseElf(badOwner);
  const owner = oneSymbol(allSymbols(ownerElf), FUNCTION);
  badOwner.writeUInt32LE(BODY_SIZE - 4, owner.entryOffset + 8);
  expectReject('owner extent', () => validateObject(badOwner));
  const badCallee = Buffer.from(buffer), calleeElf = parseElf(badCallee);
  const callee = oneSymbol(allSymbols(calleeElf), CALLEES[0]);
  badCallee[callee.entryOffset + 12] = 0x12;
  expectReject('destination type', () => validateObject(badCallee));
  const badMapping = Buffer.from(buffer), mappingElf = parseElf(badMapping);
  const mapping = oneSymbol(allSymbols(mappingElf), '$a');
  badMapping[mapping.entryOffset + 12] = 1;
  expectReject('mapping symbol', () => validateObject(badMapping));
  const extraExecutable = Buffer.from(buffer), executableElf = parseElf(extraExecutable);
  const attributes = executableElf.sections.find(section => section.name === '.ARM.attributes');
  extraExecutable.writeUInt32LE(attributes.flags | 4, attributes.headerOffset + 8);
  expectReject('extra executable section', () => validateObject(extraExecutable));
  const badNullSection = Buffer.from(buffer);
  badNullSection.writeUInt32LE(1, badNullSection.readUInt32LE(32) + 8);
  expectReject('null section', () => parseElf(badNullSection));
  const badFlags = Buffer.from(buffer);
  badFlags.writeUInt32LE(ELF_FLAGS ^ 1, 36);
  expectReject('ARM flags', () => parseElf(badFlags));
  const tooMany = Buffer.from(buffer);
  tooMany.writeUInt16LE(SECTION_CAP + 1, 48);
  expectReject('section cap', () => parseElf(tooMany));
  const symbolCap = Buffer.from(buffer), symbolElf = parseElf(symbolCap);
  const symbolSection = symbolElf.sections.find(section => section.type === 2);
  symbolCap.writeUInt32LE((SYMBOL_CAP + 1) * 16, symbolSection.headerOffset + 20);
  expectReject('symbol cap', () => parseElf(symbolCap));
  const relocationCap = Buffer.from(buffer), relocationCapElf = parseElf(relocationCap);
  const relocationSection = relocationCapElf.sections.find(section => section.type === 9);
  relocationCap.writeUInt32LE((RELOCATION_CAP + 1) * 8, relocationSection.headerOffset + 20);
  expectReject('relocation cap', () => parseElf(relocationCap));
  const executableCap = Buffer.from(buffer), executableCapElf = parseElf(executableCap);
  const bss = executableCapElf.sections.find(section => section.type === 8);
  check(bss, 'self-test fixture lacks NOBITS section');
  executableCap.writeUInt32LE(bss.flags | 4, bss.headerOffset + 8);
  executableCap.writeUInt32LE(EXECUTABLE_CAP + 1, bss.headerOffset + 20);
  expectReject('executable cap', () => parseElf(executableCap));
  expectReject('file cap', () => parseElf(Buffer.alloc(FILE_CAP + 1)));
}

let temporary;
try {
  const args = process.argv.slice(2);
  const self = args.includes('--self-test');
  const positional = args.filter(argument => argument !== '--self-test' && argument !== '--object');
  check(args.every(argument => argument === '--self-test' || argument === '--object' ||
    !argument.startsWith('-')) && positional.length <= 1 &&
    (!args.includes('--object') || positional.length === 1),
  'usage: validate-arm-ipc-wrappers-96.mjs [--self-test] [--object FILE]');
  const configBytes = readCapped(CONFIG_PATH);
  validateConfig(configBytes);
  const specBytes = readCapped(SPEC_PATH);
  assert.equal(sha256(specBytes), SPEC_HASH, 'specification contract mismatch');
  const sourceBytes = readCapped(SOURCE_PATH);
  validateSource(sourceBytes);
  let objectBytes;
  if (positional.length) objectBytes = readCapped(resolve(positional[0]));
  else {
    const assembled = assemble(locateAssembler());
    temporary = assembled.temporary;
    objectBytes = assembled.buffer;
  }
  validateObject(objectBytes);
  if (self) selfTest(objectBytes, sourceBytes, configBytes, specBytes);
  console.log(`arm-ipc-wrappers-96: ok (142 instructions, 21 direct calls, 15 local branches, ` +
    `2 returns, 4 unowned PC references, 0 literals${self ? ', self-test' : ''})`);
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
