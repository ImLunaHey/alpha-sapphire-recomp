#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(root, 'config/arm-ipc-wrappers-92.json');
const config = JSON.parse(readBounded(configPath).toString('utf8'));

const bodies = new Map([
  ['func_00180C80', '0095a990ae33f4fa7414a47ff9571993981d7b3beaae22071d1809b46f188d1e'],
  ['func_00180D20', 'bb18556f922888dbe52cea803bdf55d1ce105cba7728cc97fedc0665e8fbc5d0'],
  ['func_00180D68', 'ffbbbebec56cbe8866e4601504f749764f9de2bac232797bf37882a80e936b02'],
  ['func_00180E3C', 'd73065807ba10f5ef7dffaa3ef0a1576b518767e8a22cddb50829449e2b9cbc9'],
]);

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function inRange(start, size, total, label) {
  check(Number.isSafeInteger(start) && Number.isSafeInteger(size) && start >= 0 && size >= 0,
    `${label}: invalid range`);
  check(start <= total && size <= total - start, `${label}: range exceeds file`);
}
function readBounded(path) {
  const size = statSync(path).size;
  check(size <= MAX_FILE, `file exceeds ${MAX_FILE}-byte limit: ${path}`);
  return readFileSync(path);
}
function cString(buffer, start, end, label) {
  check(start >= 0 && start < end, `${label}: invalid string offset`);
  const zero = buffer.indexOf(0, start);
  check(zero >= 0 && zero < end, `${label}: unterminated string`);
  return buffer.toString('utf8', start, zero);
}

function parseElf(buffer) {
  check(buffer.length <= MAX_FILE, 'ELF exceeds file-size limit');
  check(buffer.length >= 52, 'truncated ELF header');
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), 'not ELF');
  check(buffer[4] === 1 && buffer[5] === 1 && buffer[6] === 1, 'requires ELF32 little-endian v1');
  const u16 = offset => buffer.readUInt16LE(offset);
  const u32 = offset => buffer.readUInt32LE(offset);
  check(u16(16) === 1, 'requires a relocatable ELF');
  check(u16(18) === 40, 'requires EM_ARM');
  check(u16(40) === 52 && u16(46) === 40, 'unexpected ELF header sizes');
  const shoff = u32(32);
  let count = u16(48);
  let shstrndx = u16(50);
  inRange(shoff, 40, buffer.length, 'section header zero');
  if (count === 0) count = u32(shoff + 20);
  if (shstrndx === 0xffff) shstrndx = u32(shoff + 24);
  check(count > 0 && count <= MAX_SECTIONS, `section count ${count} exceeds limit`);
  check(shstrndx < count, 'invalid section-name table index');
  inRange(shoff, count * 40, buffer.length, 'section table');
  const sections = [];
  let execPayload = 0;
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    const section = {
      index, nameOffset: u32(at), type: u32(at + 4), flags: u32(at + 8),
      offset: u32(at + 16), size: u32(at + 20), link: u32(at + 24),
      info: u32(at + 28), align: u32(at + 32), entsize: u32(at + 36),
    };
    if (section.type !== 8) inRange(section.offset, section.size, buffer.length, `section ${index}`);
    if ((section.flags & 4) !== 0 && section.type !== 8) {
      execPayload += section.size;
      check(execPayload <= MAX_EXEC, `executable payload exceeds ${MAX_EXEC}-byte limit`);
    }
    sections.push(section);
  }
  const names = sections[shstrndx];
  check(names.type === 3, 'section-name table is not STRTAB');
  for (const section of sections) {
    section.name = cString(buffer, names.offset + section.nameOffset, names.offset + names.size,
      `section ${section.index} name`);
  }
  let symbolCount = 0;
  const symbolTables = new Map();
  for (const section of sections.filter(s => s.type === 2 || s.type === 11)) {
    check(section.entsize === 16 && section.size % 16 === 0, `${section.name}: malformed symbol table`);
    const amount = section.size / 16;
    symbolCount += amount;
    check(symbolCount <= MAX_SYMBOLS, `symbol count exceeds ${MAX_SYMBOLS}`);
    check(section.link < sections.length && sections[section.link].type === 3,
      `${section.name}: invalid string-table link`);
    const strings = sections[section.link];
    const symbols = [];
    for (let i = 0; i < amount; i++) {
      const at = section.offset + i * 16;
      const nameOffset = u32(at);
      symbols.push({
        index: i,
        name: nameOffset === 0 ? '' : cString(buffer, strings.offset + nameOffset,
          strings.offset + strings.size, `${section.name} symbol ${i}`),
        value: u32(at + 4), size: u32(at + 8), info: buffer[at + 12],
        other: buffer[at + 13], shndx: u16(at + 14),
      });
    }
    symbolTables.set(section.index, symbols);
  }
  let relocationCount = 0;
  const relocations = [];
  for (const section of sections.filter(s => s.type === 9 || s.type === 4)) {
    const expectedEntsize = section.type === 9 ? 8 : 12;
    check(section.entsize === expectedEntsize && section.size % expectedEntsize === 0,
      `${section.name}: malformed relocation table`);
    const amount = section.size / expectedEntsize;
    relocationCount += amount;
    check(relocationCount <= MAX_RELOCS, `relocation count exceeds ${MAX_RELOCS}`);
    check(section.info < sections.length && symbolTables.has(section.link),
      `${section.name}: invalid relocation links`);
    const symbols = symbolTables.get(section.link);
    for (let i = 0; i < amount; i++) {
      const at = section.offset + i * expectedEntsize;
      const info = u32(at + 4);
      const symbolIndex = info >>> 8;
      check(symbolIndex < symbols.length, `${section.name}: invalid relocation symbol`);
      const offset = u32(at);
      const type = info & 0xff;
      const target = sections[section.info];
      const instruction = buffer.readUInt32LE(target.offset + offset);
      const armAddend = (type === 28 || type === 29) ? (instruction << 8 >> 6) : undefined;
      relocations.push({ target: section.info, offset, type,
        symbol: symbols[symbolIndex].name, armAddend });
    }
  }
  return { buffer, sections, symbolTables, relocations, sectionCount: count };
}

function validateElf(buffer) {
  const elf = parseElf(buffer);
  const sectionByName = new Map(elf.sections.map(s => [s.name, s]));
  const allSymbols = [...elf.symbolTables.values()].flat();
  const symbolsByName = new Map(allSymbols.filter(s => s.name).map(s => [s.name, s]));
  const secondaryByOwner = new Map(config.branchIdentityContract.secondaryEntryRelations
    .map(relation => [relation.owner, relation]));
  let callCount = 0;
  let absCount = 0;
  for (const fn of config.functions) {
    const section = sectionByName.get(fn.section);
    check(section && section.type === 1 && (section.flags & 6) === 6, `${fn.name}: missing AX section`);
    check(section.size === fn.nextGlobalOffset, `${fn.name}: section/adjacent extent mismatch`);
    check(section.size === fn.size + fn.literals.length * 4, `${fn.name}: unexpected adjacent material`);
    const symbol = symbolsByName.get(fn.name);
    check(symbol && symbol.shndx === section.index && symbol.value === 0 && symbol.size === fn.size,
      `${fn.name}: invalid function symbol`);
    check((symbol.info >>> 4) === 1 && (symbol.info & 15) === 2, `${fn.name}: symbol is not global FUNC`);
    const actual = elf.relocations.filter(r => r.target === section.index)
      .sort((a, b) => a.offset - b.offset);
    const body = Buffer.from(buffer.subarray(section.offset, section.offset + fn.size));
    for (const relocation of actual) {
      if (relocation.type === 28 && relocation.offset < fn.size) {
        body.writeUInt32LE(0xebfffffe, relocation.offset);
      }
    }
    check(sha256(body) === bodies.get(fn.name), `${fn.name}: instruction body mismatch`);
    const expected = [
      ...fn.branches.map(r => ({ offset: r.offset, type: 28, symbol: r.symbol })),
      ...fn.literals.map(r => ({ offset: r.offset, type: 2, symbol: r.symbol })),
    ].sort((a, b) => a.offset - b.offset);
    check(JSON.stringify(actual.map(({ offset, type, symbol, armAddend }) => {
      const relation = secondaryByOwner.get(symbol);
      return { offset, type, symbol: relation && armAddend === relation.ownerOffset - 8
        ? relation.symbol : symbol };
    })) ===
      JSON.stringify(expected), `${fn.name}: relocation contract mismatch`);
    for (const branch of fn.branches) {
      const word = buffer.readUInt32LE(section.offset + branch.offset);
      check((word >>> 24) === 0xeb, `${fn.name}+${branch.offset}: not an ARM BL`);
      callCount++;
    }
    for (const literal of fn.literals) {
      check(buffer.readUInt32LE(section.offset + literal.offset) === 0,
        `${fn.name}+${literal.offset}: literal addend is not zero`);
      absCount++;
    }
  }
  const owned = new Set(config.functions.map(fn => sectionByName.get(fn.section).index));
  check(elf.relocations.filter(r => owned.has(r.target)).length === callCount + absCount,
    'unexpected relocation in owned extents');
  check(callCount === 15 && absCount === 5, 'incorrect relocation totals');
  checkBranch(buffer, sectionByName.get('.text.func_00180C80'), 36, 52, 0xa);
  checkBranch(buffer, sectionByName.get('.text.func_00180C80'), 104, 124, 0x1);
  checkBranch(buffer, sectionByName.get('.text.func_00180D68'), 28, 80, 0x0);
  checkBranch(buffer, sectionByName.get('.text.func_00180D68'), 48, 68, 0x0);
  const d68 = sectionByName.get('.text.func_00180D68');
  for (const offset of [148, 156, 160, 172])
    check(buffer.readUInt32LE(d68.offset + offset) === 0xe320f000, `scheduling slot +${offset} is not NOP`);
  const d20 = sectionByName.get('.text.func_00180D20');
  check(buffer.readUInt32LE(d20.offset + 40) === 0xec920a06, 'six-scalar VFP load mismatch');
  check(buffer.readUInt32LE(d20.offset + 44) === 0xec800a06, 'six-scalar VFP store mismatch');
  return elf;
}

function checkBranch(buffer, section, offset, target, condition) {
  const word = buffer.readUInt32LE(section.offset + offset);
  check((word >>> 28) === condition && ((word >>> 24) & 15) === 0xa, `bad local branch at +${offset}`);
  let displacement = word & 0x00ffffff;
  if (displacement & 0x00800000) displacement -= 0x01000000;
  check(offset + 8 + displacement * 4 === target, `bad local branch target at +${offset}`);
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k =>
    `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function normalizedScheduleHash() {
  const schedule = { mode: config.mode, totalBodySize: config.totalBodySize,
    totalAdjacentSize: config.totalAdjacentSize, functions: config.functions,
    literalIdentities: config.literalIdentities, reusedLiteralIdentities: config.reusedLiteralIdentities,
    newLiteralIdentities: config.newLiteralIdentities, branchIdentityContract: config.branchIdentityContract };
  return sha256(stable(schedule));
}

function locateAssembler() {
  const candidates = [process.env.ARM_AS,
    process.env.ARM_NONE_EABI_PREFIX && `${process.env.ARM_NONE_EABI_PREFIX}as`,
    process.env.CROSS_COMPILE && `${process.env.CROSS_COMPILE}as`, 'arm-none-eabi-as'].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
    if (!probe.error && probe.status === 0) return candidate;
  }
  const nix = spawnSync('nix', ['build', '--no-link', '--print-out-paths', 'nixpkgs#gcc-arm-embedded'],
    { encoding: 'utf8' });
  check(nix.status === 0, 'cannot locate arm-none-eabi-as');
  return join(nix.stdout.trim().split(/\s+/).at(-1), 'bin/arm-none-eabi-as');
}
function assemble() {
  const temporary = mkdtempSync(join(tmpdir(), 'arm-ipc-92-'));
  const object = join(temporary, 'batch.o');
  const result = spawnSync(locateAssembler(), ['-mcpu=cortex-a9', '-mfpu=vfpv3', '-o', object,
    join(root, config.source)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`assembler failed:\n${result.stderr || result.stdout}`);
  return { temporary, buffer: readBounded(object) };
}

function makeComposite(buffer, count) {
  const oldOffset = buffer.readUInt32LE(32);
  const oldCount = buffer.readUInt16LE(48);
  check(count > 12_000 && count <= MAX_SECTIONS, 'invalid composite count');
  const foreignCount = count - oldCount;
  check(foreignCount >= 12_000, 'composite must contain at least 12,000 foreign sections');
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
  return result;
}
function expectReject(label, action) {
  try { action(); } catch { return; }
  fail(`self-test accepted hostile mutation: ${label}`);
}
function selfTest(buffer) {
  const composite = makeComposite(buffer, 12_051);
  const originalCount = parseElf(buffer).sectionCount;
  const validatedComposite = validateElf(composite);
  check(validatedComposite.sectionCount === 12_051, 'large composite was not fully parsed');
  check(validatedComposite.sections.slice(originalCount).filter(section =>
    section.type === 1 && (section.flags & 6) === 6 && section.size === 1).length >= 12_000,
  'large composite did not retain 12,000 unrelated executable foreign sections');
  expectReject('truncation', () => validateElf(buffer.subarray(0, 51)));
  const byteFlip = Buffer.from(buffer);
  const parsed = parseElf(byteFlip);
  const first = parsed.sections.find(s => s.name === '.text.func_00180C80');
  byteFlip[first.offset] ^= 1;
  expectReject('instruction mutation', () => validateElf(byteFlip));
  const tooManySections = makeComposite(buffer, MAX_SECTIONS);
  tooManySections.writeUInt16LE(MAX_SECTIONS + 1, 48);
  expectReject('section-count overflow', () => parseElf(tooManySections));
  const hugeExec = Buffer.from(buffer);
  const exec = parseElf(hugeExec).sections.find(s => s.name === '.text.func_00180C80');
  hugeExec.writeUInt32LE(MAX_EXEC + 1, hugeExec.readUInt32LE(32) + exec.index * 40 + 20);
  expectReject('executable-payload overflow', () => parseElf(hugeExec));
  const hugeSymbols = Buffer.from(buffer);
  const symtab = parseElf(hugeSymbols).sections.find(s => s.type === 2);
  hugeSymbols.writeUInt32LE((MAX_SYMBOLS + 1) * 16,
    hugeSymbols.readUInt32LE(32) + symtab.index * 40 + 20);
  expectReject('symbol-count overflow', () => parseElf(hugeSymbols));
  const hugeRelocs = Buffer.from(buffer);
  const rel = parseElf(hugeRelocs).sections.find(s => s.type === 9);
  hugeRelocs.writeUInt32LE((MAX_RELOCS + 1) * 8,
    hugeRelocs.readUInt32LE(32) + rel.index * 40 + 20);
  expectReject('relocation-count overflow', () => parseElf(hugeRelocs));
}

let temporary;
try {
  const source = readBounded(join(root, config.source));
  check(config.sourceSha256 === sha256(source), 'sourceSha256 is stale');
  check(config.normalizedScheduleSha256 === normalizedScheduleHash(), 'normalizedScheduleSha256 is stale');
  const objectArg = process.argv.slice(2).find(arg => !arg.startsWith('--'));
  let buffer;
  if (objectArg) buffer = readBounded(resolve(objectArg));
  else ({ temporary, buffer } = assemble());
  validateElf(buffer);
  if (process.argv.includes('--self-test')) selfTest(buffer);
  console.log(`arm-ipc-wrappers-92: ok (139 instructions, 15 calls, 5 literals${process.argv.includes('--self-test') ? ', self-test' : ''})`);
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
