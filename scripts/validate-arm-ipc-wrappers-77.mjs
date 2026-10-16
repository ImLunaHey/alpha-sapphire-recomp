#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const CONFIG_PATH = resolve(ROOT, 'config/arm-ipc-wrappers-77.json');
const SPEC_PATH = resolve(ROOT, 'docs/specs/main/arm_ipc_wrappers_77.md');
const MAX_EXEC_SECTION = 16 * 1024 * 1024;
const MAX_OBJECT = 256 * 1024 * 1024;
const R_ARM_ABS32 = 2;
const R_ARM_CALL = 28;
const R_ARM_JUMP24 = 29;

function fail(message) { throw new Error(message); }
function assert(ok, message) { if (!ok) fail(message); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function unique(values, what) {
  assert(new Set(values).size === values.length, `duplicate ${what}`);
}
function bounded(buffer, offset, length, what) {
  assert(Number.isSafeInteger(offset) && Number.isSafeInteger(length), `invalid ${what} bounds`);
  assert(offset >= 0 && length >= 0 && offset <= buffer.length && length <= buffer.length - offset,
    `${what} lies outside the ELF file`);
  return buffer.subarray(offset, offset + length);
}
function cstring(buffer, offset, what) {
  assert(Number.isInteger(offset) && offset >= 0 && offset < buffer.length, `invalid ${what} string offset`);
  const end = buffer.indexOf(0, offset);
  assert(end !== -1, `unterminated ${what} string`);
  return buffer.toString('utf8', offset, end);
}

function validateContract(config, spec, source) {
  assert(config.schemaVersion === 1, 'unsupported config schemaVersion');
  assert(config.source === 'src/main/arm_ipc_wrappers_77.S', 'unexpected configured source');
  assert(config.mode === 'arm', 'batch must use ARM mode');
  assert(config.totalBodySize === 460 && config.totalAdjacentSize === 16, 'unexpected configured totals');
  assert(config.cumulativePoolSlots === 781 && config.cumulativePoolClasses === 414,
    'unexpected cumulative pool totals');
  assert(config.sourceSha256 === config.normalizedScheduleSha256, 'source and schedule hashes differ');
  assert(sha256(source) === config.sourceSha256, 'assembly source SHA-256 mismatch');

  const blocks = [...spec.matchAll(/```asm\n([\s\S]*?)```/g)];
  assert(blocks.length === 1, 'spec must contain exactly one normative asm block');
  const schedule = Buffer.from(`${blocks[0][1]}`);
  assert(schedule.equals(source), 'source does not exactly equal the normative schedule');
  assert(sha256(schedule) === config.normalizedScheduleSha256, 'normative schedule SHA-256 mismatch');
  assert(spec.includes(`Implementation source SHA-256: \`${config.sourceSha256}\``),
    'spec source hash does not match config');
  assert(spec.includes(`Normalized normative-schedule SHA-256: \`${config.normalizedScheduleSha256}\``),
    'spec schedule hash does not match config');

  assert(Array.isArray(config.functions) && config.functions.length === 5, 'expected five functions');
  unique(config.functions.map(f => f.name), 'function name');
  unique(config.functions.map(f => f.section), 'function section');
  assert(config.functions.reduce((n, f) => n + f.size, 0) === config.totalBodySize,
    'body sizes do not equal totalBodySize');
  const literals = config.functions.flatMap(f => f.literals.map(l => ({ ...l, function: f.name })));
  const branches = config.functions.flatMap(f => f.branches.map(b => ({ ...b, function: f.name })));
  assert(literals.length * 4 === config.totalAdjacentSize, 'literal slots do not equal totalAdjacentSize');
  assert(branches.length === 7 && literals.length === 4, 'unexpected relocation counts in config');
  unique(literals.map(l => `${l.function}:${l.offset}`), 'literal slot');
  for (const f of config.functions) {
    assert(f.section === `.text.${f.name}`, `section/name mismatch for ${f.name}`);
    assert(Number.isInteger(f.size) && f.size > 0 && !(f.size & 3), `invalid size for ${f.name}`);
    assert(Number.isInteger(f.nextGlobalOffset) && f.nextGlobalOffset >= f.size,
      `invalid following-global offset for ${f.name}`);
    for (const b of f.branches) {
      assert(b.offset >= 0 && b.offset + 4 <= f.size && !(b.offset & 3), `invalid branch offset in ${f.name}`);
      assert((b.kind === 'R_ARM_CALL' && b.mnemonic === 'bl') ||
        (b.kind === 'R_ARM_JUMP24' && b.mnemonic === 'b'), `invalid branch kind/mnemonic in ${f.name}`);
    }
    for (const l of f.literals) {
      assert(l.offset >= f.size && !(l.offset & 3), `invalid literal offset in ${f.name}`);
      assert(Array.isArray(l.loadOffsets) && l.loadOffsets.length > 0, `missing literal load in ${f.name}`);
      assert(l.loadOffsets.every(x => x >= 0 && x + 4 <= f.size && !(x & 3)),
        `invalid literal load offset in ${f.name}`);
    }
  }
  const literalNames = literals.map(l => l.symbol);
  unique(literalNames, 'literal identity');
  assert(JSON.stringify(config.literalIdentities) === JSON.stringify(literalNames), 'literal identity order mismatch');
  assert(config.reusedLiteralIdentities.length === 0, 'batch must not reuse literal identities');
  assert(JSON.stringify(config.newLiteralIdentities) === JSON.stringify(literalNames), 'new literal identities mismatch');

  const bic = config.branchIdentityContract;
  assert(bic.mode === 'arm' && bic.minimumAlignment === 4, 'invalid branch identity mode/alignment');
  const destinations = [...new Set(branches.map(b => b.symbol))];
  assert(JSON.stringify(bic.primaryEntries) === JSON.stringify(destinations), 'primary-entry order mismatch');
  assert(bic.secondaryEntries.length === 0 && bic.secondaryEntryRelations.length === 0,
    'unexpected secondary entries');
  assert(bic.classesPairwiseDistinct === true, 'destination classes must be pairwise distinct');
  const occurrences = new Map(destinations.map(x => [x, []]));
  for (const b of branches) occurrences.get(b.symbol).push({ function: b.function, offset: b.offset });
  const shared = [...occurrences].filter(([, sites]) => sites.length > 1)
    .map(([symbol, sites]) => ({ symbol, sites }));
  const singletons = [...occurrences].filter(([, sites]) => sites.length === 1).map(([symbol]) => symbol);
  assert(JSON.stringify(bic.sharedClasses) === JSON.stringify(shared), 'shared destination classes mismatch');
  assert(JSON.stringify(bic.singletonClasses) === JSON.stringify(singletons), 'singleton destination classes mismatch');
}

function parseElf(path) {
  const st = statSync(path);
  assert(st.isFile() && st.size <= MAX_OBJECT, `ELF must be a file no larger than ${MAX_OBJECT} bytes`);
  const b = readFileSync(path);
  assert(b.length >= 52 && b[0] === 0x7f && b.toString('ascii', 1, 4) === 'ELF', 'not an ELF file');
  assert(b[4] === 1 && b[5] === 1 && b[6] === 1, 'expected ELF32 little-endian version 1');
  assert(b.readUInt16LE(16) === 1, 'expected a relocatable ELF object');
  assert(b.readUInt16LE(18) === 40, 'expected EM_ARM');
  const shoff = b.readUInt32LE(32);
  const shentsize = b.readUInt16LE(46);
  const shnum = b.readUInt16LE(48);
  const shstrndx = b.readUInt16LE(50);
  assert(shentsize >= 40 && shnum > 0 && shstrndx < shnum, 'invalid section-header table');
  bounded(b, shoff, shentsize * shnum, 'section-header table');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    sections.push({ index: i, nameOffset: b.readUInt32LE(p), type: b.readUInt32LE(p + 4),
      flags: b.readUInt32LE(p + 8), addr: b.readUInt32LE(p + 12), offset: b.readUInt32LE(p + 16),
      size: b.readUInt32LE(p + 20), link: b.readUInt32LE(p + 24), info: b.readUInt32LE(p + 28),
      addralign: b.readUInt32LE(p + 32), entsize: b.readUInt32LE(p + 36) });
  }
  const shstr = sections[shstrndx];
  const shstrData = bounded(b, shstr.offset, shstr.size, 'section-name table');
  for (const s of sections) {
    s.name = cstring(shstrData, s.nameOffset, 'section');
    if (s.type !== 8) bounded(b, s.offset, s.size, `section ${s.name}`);
    if (s.flags & 0x4) assert(s.size <= MAX_EXEC_SECTION,
      `executable section ${s.name} exceeds the ${MAX_EXEC_SECTION}-byte limit`);
  }
  const symbolsByTable = new Map();
  for (const s of sections.filter(x => x.type === 2 || x.type === 11)) {
    assert(s.link < sections.length && s.entsize >= 16 && s.size % s.entsize === 0, `invalid symbol table ${s.name}`);
    const strings = sections[s.link];
    const strData = bounded(b, strings.offset, strings.size, `strings for ${s.name}`);
    const symbols = [];
    for (let off = 0; off < s.size; off += s.entsize) {
      const p = s.offset + off;
      const nameOffset = b.readUInt32LE(p);
      symbols.push({ index: symbols.length, name: cstring(strData, nameOffset, 'symbol'),
        value: b.readUInt32LE(p + 4), size: b.readUInt32LE(p + 8),
        bind: b[p + 12] >>> 4, type: b[p + 12] & 15, shndx: b.readUInt16LE(p + 14) });
    }
    symbolsByTable.set(s.index, symbols);
  }
  const relocations = [];
  for (const s of sections.filter(x => x.type === 9 || x.type === 4)) {
    const rela = s.type === 4;
    const minimum = rela ? 12 : 8;
    assert(s.info < sections.length && symbolsByTable.has(s.link) && s.entsize >= minimum && s.size % s.entsize === 0,
      `invalid relocation section ${s.name}`);
    const symbols = symbolsByTable.get(s.link);
    for (let off = 0; off < s.size; off += s.entsize) {
      const p = s.offset + off;
      const info = b.readUInt32LE(p + 4);
      const symbolIndex = info >>> 8;
      assert(symbolIndex < symbols.length, `bad relocation symbol index in ${s.name}`);
      relocations.push({ target: s.info, offset: b.readUInt32LE(p), type: info & 0xff,
        symbol: symbols[symbolIndex].name, symbolRecord: symbols[symbolIndex] });
    }
  }
  return { buffer: b, sections, symbols: [...symbolsByTable.values()].flat(), relocations };
}

function sectionMap(elf) {
  const map = new Map();
  for (const section of elf.sections) {
    if (!map.has(section.name)) map.set(section.name, []);
    map.get(section.name).push(section);
  }
  return map;
}

function expectedRelocations(config, functionSpec) {
  return [
    ...functionSpec.branches.map(x => ({ offset: x.offset,
      type: x.kind === 'R_ARM_CALL' ? R_ARM_CALL : R_ARM_JUMP24, symbol: x.symbol })),
    ...functionSpec.literals.map(x => ({ offset: x.offset, type: R_ARM_ABS32, symbol: x.symbol })),
  ].sort((a, z) => a.offset - z.offset || a.type - z.type || a.symbol.localeCompare(z.symbol));
}

function normalizeSection(bytes, relocs) {
  const out = Buffer.from(bytes);
  for (const r of relocs) {
    assert(r.offset + 4 <= out.length && !(r.offset & 3), `relocation at invalid section offset ${r.offset}`);
    if (r.type === R_ARM_ABS32) out.writeUInt32LE(0, r.offset);
    else if (r.type === R_ARM_CALL || r.type === R_ARM_JUMP24)
      out.writeUInt32LE((out.readUInt32LE(r.offset) & 0xff000000) >>> 0, r.offset);
  }
  return out;
}

function validateObject(config, candidate, reference) {
  const cm = sectionMap(candidate);
  const rm = sectionMap(reference);
  const namedSectionIndices = config.functions.map(f => {
    assert(cm.get(f.section)?.length === 1, `expected exactly one ${f.section} section`);
    return cm.get(f.section)[0].index;
  });
  assert(namedSectionIndices.every((value, index) => index === 0 || value > namedSectionIndices[index - 1]),
    'named function sections are not in documented order');
  let instructionCount = 0;
  for (const f of config.functions) {
    assert(rm.get(f.section)?.length === 1, `reference lacks unique ${f.section}`);
    const cs = cm.get(f.section)[0], rs = rm.get(f.section)[0];
    const expectedSize = f.size + f.literals.length * 4;
    assert(cs.size === expectedSize, `${f.section} has size ${cs.size}, expected ${expectedSize}`);
    assert((cs.flags & 0x6) === 0x6 && cs.type === 1 && cs.addralign >= 4,
      `${f.section} has invalid type, flags, or alignment`);
    const funcs = candidate.symbols.filter(s => s.shndx === cs.index && s.type === 2 && s.bind !== 0);
    assert(funcs.length === 1, `${f.section} must contain exactly one global/weak STT_FUNC`);
    const sym = funcs[0];
    assert(sym.name === f.name && sym.value === 0 && sym.size === f.size && sym.bind === 1,
      `invalid function symbol ${f.name}`);
    const actualRelocs = candidate.relocations.filter(r => r.target === cs.index)
      .map(r => ({ offset: r.offset, type: r.type, symbol: r.symbol }))
      .sort((a, z) => a.offset - z.offset || a.type - z.type || a.symbol.localeCompare(z.symbol));
    const wantedRelocs = expectedRelocations(config, f);
    assert(JSON.stringify(actualRelocs) === JSON.stringify(wantedRelocs), `relocations differ in ${f.section}`);
    const refRelocs = reference.relocations.filter(r => r.target === rs.index);
    const cb = bounded(candidate.buffer, cs.offset, cs.size, f.section);
    const rb = bounded(reference.buffer, rs.offset, rs.size, `reference ${f.section}`);
    assert(normalizeSection(cb, actualRelocs).equals(normalizeSection(rb, refRelocs)),
      `instruction/data bytes differ in ${f.section}`);
    instructionCount += f.size / 4;
  }
  assert(instructionCount === 115, `expected 115 instructions, got ${instructionCount}`);
}

function findTool(envName, names) {
  if (process.env[envName]) return process.env[envName];
  for (const name of names) {
    const r = spawnSync('sh', ['-c', 'command -v "$1"', 'sh', name], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  fail(`cannot find ${names.join(' or ')}; set ${envName}`);
}
function run(tool, args, what) {
  const r = spawnSync(tool, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  assert(!r.error && r.status === 0, `${what} failed: ${(r.stderr || r.error?.message || '').trim()}`);
  return r.stdout;
}
function disassembleSections(tool, objectPath, config, elf) {
  const byName = sectionMap(elf);
  let count = 0;
  for (const f of config.functions) {
    const s = byName.get(f.section)[0];
    const start = s.addr;
    const output = run(tool, ['-d', '-j', f.section, `--start-address=${start}`, `--stop-address=${start + f.size}`, objectPath],
      `section-scoped disassembly of ${f.section}`);
    const lines = output.split('\n').filter(line => /^\s*[0-9a-fA-F]+:\s+[0-9a-fA-F]{8}\s+/.test(line));
    assert(lines.length === f.size / 4, `disassembler emitted ${lines.length} instructions for ${f.section}`);
    count += lines.length;
  }
  assert(count === 115, `section-scoped disassembly count is ${count}, expected 115`);
}

function main() {
  assert(process.argv.length === 3, `usage: ${basename(process.argv[1])} <arm-relocatable-object>`);
  const objectPath = resolve(process.argv[2]);
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  const spec = readFileSync(SPEC_PATH, 'utf8');
  const sourcePath = resolve(ROOT, config.source);
  const source = readFileSync(sourcePath);
  validateContract(config, spec, source);

  const assembler = findTool('ARM_AS', ['arm-none-eabi-as']);
  const objdump = findTool('ARM_OBJDUMP', ['arm-none-eabi-objdump', 'llvm-objdump']);
  const temp = mkdtempSync(resolve(tmpdir(), 'ipc-wrappers-77-'));
  try {
    const referencePath = resolve(temp, 'reference.o');
    run(assembler, ['-o', referencePath, sourcePath], 'reference assembly');
    const candidate = parseElf(objectPath);
    const reference = parseElf(referencePath);
    validateObject(config, candidate, reference);
    disassembleSections(objdump, objectPath, config, candidate);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
  console.log('validated IPC wrapper batch 77: 5 functions, 115 instructions, 7 branch relocations, 4 literal relocations');
}

try { main(); } catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
