#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, openSync, closeSync, fstatSync, readSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/arm-ipc-wrappers-94.json');
const FILE_CAP = 64 * 1024 * 1024;
const EXEC_CAP = 16 * 1024 * 1024;
const SECTION_CAP = 16_384;
const SYMBOL_CAP = 1_000_000;
const RELOCATION_CAP = 1_000_000;
const ELF_FLAGS = 0x05000000;
const EXPECTED_SOURCE_HASH = '2758855600930c169c71d865467df566e1271b6885da54b51787ea455e41c4ac';
const EXPECTED_CONFIG_CONTRACT = 'affe8174d9701df7b3144fe88992c4b7eac692a9b7ba85ef2a82d6b969bb7035';
const EXPECTED_SECTION_HASHES = new Map([
  ['func_00181890', '64b956dc5ac03b94c96d9021a100a26feb7fd5ed432441e8e4fa749f5670c447'],
  ['func_00181FD4', '36ae8c168ca41afc871be87cea79acf6451af47957a4edfacc5e276aa452fe76'],
  ['func_001821A0', '0f5dffe28a77edc2c956415cb1e600d3b2d2228e9b9433ae20618c3d40a446d2'],
]);
const EXPECTED_FUNCTIONS = [
  { name: 'func_00181890', section: '.text.func_00181890', size: 216,
    nextGlobal: 'func_0018196C', nextGlobalOffset: 220,
    branches: [
      { offset: 192, kind: 'R_ARM_CALL', transfer: 'linked', symbol: 'func_00174DD0' },
      { offset: 204, kind: 'R_ARM_CALL', transfer: 'linked', symbol: 'func_0018C888' },
    ], indirectCalls: [], returnOffsets: [16, 212],
    literals: [{ offset: 216, loadOffsets: [32], symbol: 'service_request_sequence_94' }] },
  { name: 'func_00181FD4', section: '.text.func_00181FD4', size: 260,
    nextGlobal: 'func_001820E4', nextGlobalOffset: 272,
    branches: [40, 100, 204].map(offset => ({ offset, kind: 'R_ARM_CALL',
      transfer: 'linked-state-exchange', symbol: 'func_00302F52' })),
    indirectCalls: [{ offset: 180, sourceRegister: 'r3', stateExchange: true }],
    returnOffsets: [256], literals: [
      { offset: 260, loadOffsets: [12, 96, 132, 200, 236], symbol: 'service_callback_registry_guard_94' },
      { offset: 264, loadOffsets: [16, 140, 244], symbol: 'service_callback_registry_sentinel_94' },
      { offset: 268, loadOffsets: [76, 116, 220], symbol: 'service_callback_registry_anchor_94' },
    ] },
  { name: 'func_001821A0', section: '.text.func_001821A0', size: 232,
    nextGlobal: 'func_00182290', nextGlobalOffset: 240,
    branches: [160, 220].map(offset => ({ offset, kind: 'R_ARM_CALL', transfer: 'linked', symbol: 'func_0016DFE8' })),
    indirectCalls: [], returnOffsets: [168, 228], literals: [
      { offset: 232, loadOffsets: [12], symbol: 'service_geometry_defaults_94' },
      { offset: 236, loadOffsets: [16], symbol: 'service_packed_coordinate_bias_94' },
    ] },
];
const LITERALS = ['service_request_sequence_94', 'service_callback_registry_guard_94',
  'service_callback_registry_sentinel_94', 'service_callback_registry_anchor_94',
  'service_geometry_defaults_94', 'service_packed_coordinate_bias_94'];
const BRANCH_CONTRACT = {
  mode: 'arm', minimumAlignment: 2,
  primaryEntries: ['func_00174DD0', 'func_0018C888', 'func_00302F52', 'func_0016DFE8'],
  secondaryEntries: [], secondaryEntryRelations: [],
  sharedClasses: [
    { symbol: 'func_00302F52', sites: [40, 100, 204].map(offset => ({ function: 'func_00181FD4', offset })) },
    { symbol: 'func_0016DFE8', sites: [160, 220].map(offset => ({ function: 'func_001821A0', offset })) },
  ],
  singletonClasses: ['func_00174DD0', 'func_0018C888'], classesPairwiseDistinct: true,
  armPrimaryEntries: ['func_00174DD0', 'func_0018C888', 'func_0016DFE8'],
  thumbPrimaryEntries: ['func_00302F52'],
};

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
    check(size <= FILE_CAP, `${path}: file exceeds ${FILE_CAP} bytes`);
    const result = Buffer.alloc(size);
    let done = 0;
    while (done < size) {
      const amount = readSync(fd, result, done, size - done, done);
      check(amount > 0, `${path}: truncated while reading`);
      done += amount;
    }
    return result;
  } finally { closeSync(fd); }
}
function cstring(buffer, start, end, label) {
  check(start >= 0 && start < end, `${label}: invalid string offset`);
  const nul = buffer.indexOf(0, start);
  check(nul >= start && nul < end, `${label}: unterminated string`);
  return buffer.toString('utf8', start, nul);
}

function parseElf(buffer) {
  check(buffer.length <= FILE_CAP, 'ELF file limit exceeded');
  range(buffer.length, 0, 52, 'ELF header');
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), 'not ELF');
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1 && buffer[7] === 0 && buffer[8] === 0,
    'requires ELF32 little-endian System V ABI version 0');
  check(buffer.subarray(9, 16).every(byte => byte === 0), 'nonzero ELF identification padding');
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 && buffer.readUInt32LE(20) === 1,
    'requires ELF32 ARM ET_REL version 1');
  check(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0 && buffer.readUInt32LE(36) === ELF_FLAGS,
    'invalid entry point, program-header offset, or ARM EABI flags');
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0 &&
    buffer.readUInt16LE(46) === 40, 'invalid ELF header or program-header sizes');
  const shoff = buffer.readUInt32LE(32);
  let count = buffer.readUInt16LE(48);
  let namesIndex = buffer.readUInt16LE(50);
  range(buffer.length, shoff, 40, 'section zero');
  if (count === 0) count = buffer.readUInt32LE(shoff + 20);
  if (namesIndex === 0xffff) namesIndex = buffer.readUInt32LE(shoff + 24);
  check(count > 0 && count <= SECTION_CAP, `section count exceeds ${SECTION_CAP}`);
  check(namesIndex < count, 'bad section-name index');
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
      check(executablePayload <= EXEC_CAP, `executable payload exceeds ${EXEC_CAP}`);
    }
    sections.push(section);
  }
  const zero = sections[0];
  check(zero.nameOffset === 0 && zero.type === 0 && zero.flags === 0 && zero.address === 0 && zero.offset === 0 &&
    zero.size === 0 && zero.link === 0 && zero.info === 0 && zero.align === 0 && zero.entsize === 0,
  'noncanonical null section');
  const names = sections[namesIndex];
  check(names.type === 3, 'section names are not a STRTAB');
  for (const section of sections) section.name = cstring(buffer,
    names.offset + section.nameOffset, names.offset + names.size, `section ${section.index} name`);
  const symbolTables = new Map();
  let symbolCount = 0;
  for (const section of sections.filter(s => s.type === 2 || s.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbols`);
    const amount = section.size / 16;
    symbolCount += amount;
    check(symbolCount <= SYMBOL_CAP, `symbol count exceeds ${SYMBOL_CAP}`);
    const strings = sections[section.link];
    check(strings?.type === 3, `${section.name}: invalid string-table link`);
    const symbols = [];
    for (let i = 0; i < amount; i++) {
      const p = section.offset + i * 16;
      const no = buffer.readUInt32LE(p);
      symbols.push({ table: section.index, entryOffset: p, index: i,
        name: cstring(buffer, strings.offset + no, strings.offset + strings.size, `${section.name} symbol ${i}`),
        value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), info: buffer[p + 12],
        other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14) });
    }
    symbolTables.set(section.index, symbols);
  }
  const relocations = [];
  let relocationCount = 0;
  for (const section of sections.filter(s => s.type === 9 || s.type === 4)) {
    const width = section.type === 9 ? 8 : 12;
    check(section.entsize === width && section.size % width === 0, `${section.name}: malformed relocations`);
    const amount = section.size / width;
    relocationCount += amount;
    check(relocationCount <= RELOCATION_CAP, `relocation count exceeds ${RELOCATION_CAP}`);
    const symbols = symbolTables.get(section.link);
    const target = sections[section.info];
    check(symbols && target, `${section.name}: invalid relocation links`);
    for (let i = 0; i < amount; i++) {
      const p = section.offset + i * width;
      const offset = buffer.readUInt32LE(p);
      range(target.size, offset, 4, `${section.name} relocation ${i}`);
      const info = buffer.readUInt32LE(p + 4), symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length, `${section.name}: invalid relocation symbol`);
      relocations.push({ entryOffset: p, sectionIndex: section.info, offset, type: info & 0xff,
        symbol: symbols[symbolIndex].name, symbolIndex, symbolTable: section.link });
    }
  }
  return { buffer, sections, symbolTables, relocations, sectionCount: count, executablePayload };
}

function validateConfig(config) {
  const normalized = structuredClone(config);
  normalized.sourceHash = null;
  assert.equal(sha256(Buffer.from(JSON.stringify(normalized))), EXPECTED_CONFIG_CONTRACT,
    'normalized configuration contract mismatch');
  assert.equal(config.schemaVersion, 1);
  assert.equal(config.source, 'src/main/arm_ipc_wrappers_94.S');
  assert.equal(config.sourceHash, EXPECTED_SOURCE_HASH);
  assert.equal(config.mode, 'arm');
  assert.equal(config.totalBodySize, 708);
  assert.equal(config.totalAdjacentSize, 24);
  assert.equal(config.cumulativePoolSlots, 892);
  assert.equal(config.cumulativePoolClasses, 469);
  assert.deepEqual(config.functions, EXPECTED_FUNCTIONS);
  assert.deepEqual(config.literalIdentities, LITERALS);
  assert.deepEqual(config.reusedLiteralIdentities, []);
  assert.deepEqual(config.newLiteralIdentities, LITERALS);
  assert.deepEqual(config.branchIdentityContract, BRANCH_CONTRACT);
  assert.deepEqual(config.selectionNotes, { skippedEarlierUnmatched: [{ name: 'func_00180F24', size: 1356,
    reason: 'large multi-loop scheduler/dispatcher outside the bounded wrapper cohort' }],
    nextUnselectedSuitable: 'func_00183E28' });
  assert.equal(new Set(LITERALS).size, 6, 'literal identities must be pairwise distinct');
  const classes = [...config.branchIdentityContract.sharedClasses.map(x => x.symbol),
    ...config.branchIdentityContract.singletonClasses];
  assert.equal(new Set(classes).size, 4, 'branch identity classes must be pairwise distinct');
  assert.equal(config.functions.reduce((n, f) => n + f.size, 0), 708);
  assert.equal(config.functions.reduce((n, f) => n + f.literals.length * 4, 0), 24);
  assert.equal(config.functions.reduce((n, f) => n + f.branches.length, 0), 7);
  assert.equal(config.functions.reduce((n, f) => n + f.indirectCalls.length, 0), 1);
  assert.equal(config.functions.reduce((n, f) => n + f.returnOffsets.length, 0), 5);
}

function validateSource(source) {
  assert.equal(sha256(source), EXPECTED_SOURCE_HASH, 'source hash mismatch');
  const text = source.toString('utf8');
  assert.match(text, /^\.syntax unified$/m);
  assert.match(text, /^\.arm$/m);
  assert.match(text, /^\.fpu vfpv2$/m);
  assert.doesNotMatch(text, /\.fpu\s+(?!vfpv2\b)/);
  for (const fn of EXPECTED_FUNCTIONS) {
    assert.equal((text.match(new RegExp(`BEGIN ${fn.name}`, 'g')) || []).length, 1);
    assert.equal((text.match(new RegExp(`END ${fn.name}`, 'g')) || []).length, 1);
  }
  for (const identity of LITERALS) {
    assert.equal((text.match(new RegExp(`\\.word\\s+${identity}\\b`, 'g')) || []).length, 1,
      `${identity}: source identity occurrence mismatch`);
  }
  assert.equal((text.match(/^\s*blx\s+r3\s*$/gm) || []).length, 1, 'indirect BLX contract changed');
  assert.equal((text.match(/^\s*blx\s+func_00302F52\s*$/gm) || []).length, 3, 'Thumb call count changed');
  assert.equal((text.match(/^\s*bl\s+func_/gm) || []).length, 4, 'ARM direct call count changed');
}

function requiredSymbols(parsed) {
  return [...parsed.symbolTables.values()].flat();
}
function identityKey(symbol) {
  return symbol.shndx === 0 ? `u:${symbol.table}:${symbol.index}` : `d:${symbol.shndx}:${symbol.value & ~1}`;
}
function decodeLiteralTarget(word, at) {
  check((word & 0x0e5f0000) === 0x041f0000 && (word & (1 << 20)) !== 0, `+${at}: not PC-relative LDR`);
  const displacement = word & 0xfff;
  return at + 8 + (((word >>> 23) & 1) ? displacement : -displacement);
}
function validateObject(buffer) {
  const parsed = parseElf(buffer);
  const symbols = requiredSymbols(parsed);
  const byName = name => {
    const found = symbols.filter(s => s.name === name);
    check(found.length === 1, `${name}: expected exactly one symbol, found ${found.length}`);
    return found[0];
  };
  const sectionNames = new Map();
  for (const section of parsed.sections) {
    if (!sectionNames.has(section.name)) sectionNames.set(section.name, []);
    sectionNames.get(section.name).push(section);
  }
  const required = new Set([...EXPECTED_FUNCTIONS.map(f => f.name),
    ...EXPECTED_FUNCTIONS.flatMap(f => f.branches.map(b => b.symbol)), ...LITERALS]);
  for (const name of required) byName(name);
  const branchNames = [...new Set(EXPECTED_FUNCTIONS.flatMap(f => f.branches.map(b => b.symbol)))];
  const branchSymbols = branchNames.map(name => {
    const symbol = byName(name);
    check((symbol.info >>> 4) === 1 && symbol.other === 0, `${name}: branch identity must be global default-visible`);
    if (symbol.shndx === 0) {
      check(symbol.value === 0 && symbol.size === 0 && (symbol.info & 15) === 0,
        `${name}: undefined branch identity must be zero NOTYPE`);
    } else {
      check(symbol.shndx < parsed.sections.length && (symbol.info & 15) === 2,
        `${name}: resolved branch identity must be a function`);
      const destination = parsed.sections[symbol.shndx], thumb = name === 'func_00302F52';
      check(destination.type === 1 && (destination.flags & 4) !== 0 && destination.align >= (thumb ? 2 : 4) &&
        (symbol.value & 1) === (thumb ? 1 : 0) && (symbol.value & ~1) < destination.size,
      `${name}: resolved branch state or destination is invalid`);
    }
    return symbol;
  });
  const literalSymbols = LITERALS.map(name => {
    const symbol = byName(name);
    check(symbol.shndx === 0 && symbol.value === 0 && symbol.size === 0 && symbol.info === 0x10 && symbol.other === 0,
      `${name}: literal identity must be unique undefined global NOTYPE`);
    return symbol;
  });
  const externalKeys = [...branchSymbols, ...literalSymbols].map(identityKey);
  check(new Set(externalKeys).size === externalKeys.length, 'external identities must be pairwise distinct');
  let callCount = 0, absCount = 0;
  for (const fn of EXPECTED_FUNCTIONS) {
    const sections = sectionNames.get(fn.section) || [];
    check(sections.length === 1, `${fn.name}: expected one primary section`);
    const section = sections[0];
    check(section.type === 1 && section.flags === 6 && section.address === 0, `${fn.name}: section is not canonical AX PROGBITS`);
    check(section.size === fn.nextGlobalOffset && section.size === fn.size + fn.literals.length * 4,
      `${fn.name}: owned extent mismatch`);
    check(section.align === 4, `${fn.name}: section alignment mismatch`);
    const symbol = byName(fn.name);
    check(symbol.shndx === section.index && symbol.value === 0 && symbol.size === fn.size &&
      symbol.info === 0x12 && symbol.other === 0, `${fn.name}: primary ownership mismatch`);
    const sectionSymbol = symbols.filter(s => s.shndx === section.index && s.name === '' && s.value === 0 &&
      s.size === 0 && s.info === 3 && s.other === 0);
    check(sectionSymbol.length === 1, `${fn.name}: canonical section symbol mismatch`);
    const mappings = symbols.filter(s => s.shndx === section.index && (s.name === '$a' || s.name === '$d'));
    check(mappings.length === 2 && mappings.some(s => s.name === '$a' && s.value === 0) &&
      mappings.some(s => s.name === '$d' && s.value === fn.size) &&
      mappings.every(s => s.size === 0 && s.info === 0 && s.other === 0), `${fn.name}: ARM/data mapping contract mismatch`);
    const allowed = new Set([symbol, sectionSymbol[0], ...mappings]);
    const intruder = symbols.find(s => s.shndx === section.index && !allowed.has(s));
    check(!intruder, `${fn.name}: unexpected alias or owner ${intruder?.name || '<unnamed>'}`);
    check(!externalKeys.includes(identityKey(symbol)), `${fn.name}: external identity aliases owned function`);
    const extent = buffer.subarray(section.offset, section.offset + section.size);
    assert.equal(sha256(extent), EXPECTED_SECTION_HASHES.get(fn.name), `${fn.name}: byte schedule mismatch`);
    const expectedRelocs = [...fn.branches.map(b => ({ offset: b.offset, type: 28, symbol: b.symbol })),
      ...fn.literals.map(l => ({ offset: l.offset, type: 2, symbol: l.symbol }))]
      .sort((a, b) => a.offset - b.offset);
    const actual = parsed.relocations.filter(r => r.sectionIndex === section.index)
      .map(({ offset, type, symbol }) => ({ offset, type, symbol })).sort((a, b) => a.offset - b.offset);
    assert.deepEqual(actual, expectedRelocs, `${fn.name}: relocation schedule mismatch`);
    for (const branch of fn.branches) {
      const word = extent.readUInt32LE(branch.offset);
      if (branch.transfer === 'linked-state-exchange') {
        check((word & 0xfe000000) >>> 0 === 0xfa000000, `${fn.name}+${branch.offset}: not immediate BLX`);
      } else check((word & 0xff000000) >>> 0 === 0xeb000000, `${fn.name}+${branch.offset}: not ARM BL`);
      callCount++;
    }
    for (const indirect of fn.indirectCalls) {
      const word = extent.readUInt32LE(indirect.offset);
      check((word & 0x0ffffff0) === 0x012fff30 && (word & 15) === 3,
        `${fn.name}+${indirect.offset}: not BLX r3`);
    }
    for (const literal of fn.literals) {
      check(extent.readUInt32LE(literal.offset) === 0, `${fn.name}+${literal.offset}: nonzero literal addend`);
      for (const load of literal.loadOffsets) {
        check(decodeLiteralTarget(extent.readUInt32LE(load), load) === literal.offset,
          `${fn.name}+${load}: literal mapping mismatch`);
      }
      absCount++;
    }
  }
  const returns = [
    ['.text.func_00181890', 16, 0x012fff1e], ['.text.func_00181890', 212, 0xe8bd8070],
    ['.text.func_00181FD4', 256, 0xe8bd87f0], ['.text.func_001821A0', 168, 0xe8bd80f0],
    ['.text.func_001821A0', 228, 0xe8bd80f0],
  ];
  for (const [name, offset, expected] of returns) {
    const section = sectionNames.get(name)[0];
    assert.equal(buffer.readUInt32LE(section.offset + offset), expected, `${name}+${offset}: return mismatch`);
  }
  assert.equal(callCount, 7);
  assert.equal(absCount, 6);
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
  check(nix.status === 0, 'cannot locate the pinned GNU Arm assembler');
  return join(nix.stdout.trim().split(/\s+/).at(-1), 'bin/arm-none-eabi-as');
}
function assemble(assembler, sourcePath) {
  const temporary = mkdtempSync(join(tmpdir(), 'arm-ipc-wrappers-94-'));
  const object = join(temporary, 'batch.o');
  const args = ['-mcpu=cortex-a9', '-mfpu=vfpv2', '-o', object, sourcePath];
  const result = spawnSync(assembler, args, { encoding: 'utf8' });
  if (result.status !== 0) fail(`assembler failed:\n${result.stderr || result.stdout}`);
  return { temporary, object, buffer: readCapped(object), args };
}

function makeComposite(buffer) {
  const parsed = parseElf(buffer);
  const foreignCount = 12_001;
  const count = parsed.sectionCount + foreignCount;
  check(count <= SECTION_CAP, 'composite section count exceeds cap');
  const oldHeaders = buffer.readUInt32LE(32);
  const payload = buffer.length;
  const newHeaders = (payload + foreignCount + 3) & ~3;
  const result = Buffer.alloc(newHeaders + count * 40);
  buffer.copy(result);
  result.fill(0xa5, payload, payload + foreignCount);
  buffer.copy(result, newHeaders, oldHeaders, oldHeaders + parsed.sectionCount * 40);
  const textName = parsed.sections.find(s => s.name === '.text').nameOffset;
  for (let i = 0; i < foreignCount; i++) {
    const p = newHeaders + (parsed.sectionCount + i) * 40;
    result.writeUInt32LE(textName, p);
    result.writeUInt32LE(1, p + 4);
    result.writeUInt32LE(6, p + 8);
    result.writeUInt32LE(payload + i, p + 16);
    result.writeUInt32LE(1, p + 20);
    result.writeUInt32LE(1, p + 32);
  }
  result.writeUInt32LE(newHeaders, 32);
  result.writeUInt16LE(count, 48);
  return result;
}
function expectReject(label, action) {
  try { action(); } catch { return; }
  fail(`self-test accepted hostile ${label}`);
}
function clone(value) { return structuredClone(value); }
function selfTest(buffer, source, config, assembler) {
  const composite = makeComposite(buffer);
  const validated = validateObject(composite);
  check(validated.sectionCount - parseElf(buffer).sectionCount > 12_000,
    'composite lacks more than 12,000 foreign sections');
  check(validated.sections.slice(-12_001).every(s => s.size === 1 && s.type === 1 && (s.flags & 6) === 6),
    'foreign sections are not genuine nonempty executable sections');
  const resolved = Buffer.from(composite), resolvedElf = parseElf(resolved), resolvedSymbols = requiredSymbols(resolvedElf);
  const branchNames = [...new Set(EXPECTED_FUNCTIONS.flatMap(fn => fn.branches.map(branch => branch.symbol)))];
  branchNames.forEach((name, index) => {
    const symbol = resolvedSymbols.find(item => item.name === name);
    const section = resolvedElf.sections.at(-12_001 + index);
    resolved.writeUInt32LE(name === 'func_00302F52' ? 1 : 0, symbol.entryOffset + 4);
    resolved[symbol.entryOffset + 12] = 0x12;
    resolved.writeUInt16LE(section.index, symbol.entryOffset + 14);
    resolved.writeUInt32LE(4, resolved.readUInt32LE(32) + section.index * 40 + 32);
  });
  validateObject(resolved);
  const badResolvedState = Buffer.from(resolved), badResolvedElf = parseElf(badResolvedState);
  const thumbDestination = requiredSymbols(badResolvedElf).find(item => item.name === 'func_00302F52');
  badResolvedState.writeUInt32LE(0, thumbDestination.entryOffset + 4);
  expectReject('resolved branch state', () => validateObject(badResolvedState));
  const sourceMutation = Buffer.from(source); sourceMutation[sourceMutation.indexOf('vfpv2')] ^= 1;
  expectReject('source mutation', () => validateSource(sourceMutation));
  const alias = clone(config); alias.newLiteralIdentities[5] = alias.newLiteralIdentities[0];
  expectReject('literal identity alias', () => validateConfig(alias));
  const extraConfig = clone(config); extraConfig.unexpected = true;
  expectReject('extra configuration key', () => validateConfig(extraConfig));
  const branchAlias = clone(config); branchAlias.branchIdentityContract.singletonClasses[1] = 'func_00174DD0';
  expectReject('branch identity alias', () => validateConfig(branchAlias));
  const badHeader = Buffer.from(buffer); badHeader.writeUInt16LE(2, 16);
  expectReject('ELF type', () => parseElf(badHeader));
  const badMachine = Buffer.from(buffer); badMachine.writeUInt16LE(3, 18);
  expectReject('ELF machine', () => parseElf(badMachine));
  const badOsAbi = Buffer.from(buffer); badOsAbi[7] = 3;
  expectReject('ELF OSABI', () => parseElf(badOsAbi));
  const badAbiVersion = Buffer.from(buffer); badAbiVersion[8] = 1;
  expectReject('ELF ABI version', () => parseElf(badAbiVersion));
  const badEntry = Buffer.from(buffer); badEntry.writeUInt32LE(4, 24);
  expectReject('ELF entry point', () => parseElf(badEntry));
  const badProgram = Buffer.from(buffer); badProgram.writeUInt32LE(52, 28); badProgram.writeUInt16LE(32, 42); badProgram.writeUInt16LE(1, 44);
  expectReject('program headers', () => parseElf(badProgram));
  const badFlags = Buffer.from(buffer); badFlags.writeUInt32LE(ELF_FLAGS ^ 1, 36);
  expectReject('ARM EABI flags', () => parseElf(badFlags));
  const badNull = Buffer.from(buffer); badNull.writeUInt32LE(1, badNull.readUInt32LE(32) + 8);
  expectReject('noncanonical null section', () => parseElf(badNull));
  const tooMany = Buffer.from(buffer); tooMany.writeUInt16LE(SECTION_CAP + 1, 48);
  expectReject('section limit', () => parseElf(tooMany));
  const hugeExec = Buffer.from(buffer), exec = parseElf(hugeExec).sections.find(s => s.name === '.text.func_00181890');
  hugeExec.writeUInt32LE(EXEC_CAP + 1, hugeExec.readUInt32LE(32) + exec.index * 40 + 20);
  expectReject('executable limit', () => parseElf(hugeExec));
  const hugeSymbols = Buffer.from(buffer), symtab = parseElf(hugeSymbols).sections.find(s => s.type === 2);
  hugeSymbols.writeUInt32LE((SYMBOL_CAP + 1) * 16, hugeSymbols.readUInt32LE(32) + symtab.index * 40 + 20);
  expectReject('symbol limit', () => parseElf(hugeSymbols));
  const hugeRelocs = Buffer.from(buffer), rel = parseElf(hugeRelocs).sections.find(s => s.type === 9);
  hugeRelocs.writeUInt32LE((RELOCATION_CAP + 1) * 8, hugeRelocs.readUInt32LE(32) + rel.index * 40 + 20);
  expectReject('relocation limit', () => parseElf(hugeRelocs));
  const badByte = Buffer.from(buffer), first = parseElf(badByte).sections.find(s => s.name === '.text.func_00181890');
  badByte[first.offset] ^= 1;
  expectReject('instruction byte', () => validateObject(badByte));
  const badIdentity = Buffer.from(buffer), p = parseElf(badIdentity);
  const literalReloc = p.relocations.find(r => r.symbol === LITERALS[0]);
  const replacement = [...p.symbolTables.get(literalReloc.symbolTable)].find(s => s.name === LITERALS[1]);
  badIdentity.writeUInt32LE((replacement.index << 8) | 2, literalReloc.entryOffset + 4);
  expectReject('relocation identity', () => validateObject(badIdentity));
  const mappingDrift = Buffer.from(buffer), mappingParsed = parseElf(mappingDrift);
  const firstSection = mappingParsed.sections.find(s => s.name === '.text.func_00181890');
  const firstMapping = requiredSymbols(mappingParsed).find(s => s.shndx === firstSection.index && s.name.startsWith('$a'));
  mappingDrift.writeUInt32LE(4, firstMapping.entryOffset + 4);
  expectReject('mapping drift', () => validateObject(mappingDrift));
  const unnamedAlias = Buffer.from(buffer), aliasParsed = parseElf(unnamedAlias);
  const nullSymbol = requiredSymbols(aliasParsed).find(s => s.index === 0);
  unnamedAlias[nullSymbol.entryOffset + 12] = 2;
  unnamedAlias.writeUInt16LE(firstSection.index, nullSymbol.entryOffset + 14);
  expectReject('unnamed local function alias', () => validateObject(unnamedAlias));
  const externalType = Buffer.from(buffer), externalParsed = parseElf(externalType);
  const armExternal = requiredSymbols(externalParsed).find(s => s.name === 'func_00174DD0');
  externalType[armExternal.entryOffset + 12] = 0x11;
  expectReject('external destination type', () => validateObject(externalType));
  const literalBinding = Buffer.from(buffer), literalParsed = parseElf(literalBinding);
  const literalSymbol = requiredSymbols(literalParsed).find(s => s.name === LITERALS[0]);
  literalBinding[literalSymbol.entryOffset + 12] = 0;
  expectReject('literal identity binding', () => validateObject(literalBinding));
  const reservedOther = Buffer.from(buffer), otherParsed = parseElf(reservedOther);
  const ownedFunction = requiredSymbols(otherParsed).find(s => s.name === EXPECTED_FUNCTIONS[0].name);
  reservedOther[ownedFunction.entryOffset + 13] = 0x80;
  expectReject('reserved symbol visibility bits', () => validateObject(reservedOther));
  const second = assemble(assembler, join(ROOT, config.source));
  try {
    assert.deepEqual(second.args.slice(0, 2), ['-mcpu=cortex-a9', '-mfpu=vfpv2'], 'toolchain flags drifted');
    assert.equal(sha256(second.buffer), sha256(buffer), 'pinned toolchain is not reproducible');
    validateObject(second.buffer);
  } finally { rmSync(second.temporary, { recursive: true, force: true }); }
}

let temporary;
try {
  const configBytes = readCapped(CONFIG_PATH);
  const config = JSON.parse(configBytes.toString('utf8'));
  validateConfig(config);
  const source = readCapped(join(ROOT, config.source));
  validateSource(source);
  const objectArg = process.argv.slice(2).find(arg => !arg.startsWith('--'));
  const assembler = locateAssembler();
  let buffer;
  if (objectArg) buffer = readCapped(resolve(objectArg));
  else ({ temporary, buffer } = assemble(assembler, join(ROOT, config.source)));
  validateObject(buffer);
  if (process.argv.includes('--self-test')) selfTest(buffer, source, config, assembler);
  console.log(`arm-ipc-wrappers-94: ok (177 instructions, 7 direct calls, 1 indirect BLX, 5 returns, 6 literals${process.argv.includes('--self-test') ? ', self-test' : ''})`);
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
