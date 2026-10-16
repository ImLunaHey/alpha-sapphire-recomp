#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SOURCE_LIMIT = 64 * 1024 * 1024;
const OBJECT_LIMIT = 16 * 1024 * 1024;
const SECTION_LIMIT = 16384;
const SYMBOL_LIMIT = 1000000;
const RELOCATION_LIMIT = 1000000;
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const configPath = join(root, 'config', 'thumb-leaf-helpers-05.json');

function fail(message) { throw new Error(message); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function boundedRead(path, limit, kind) {
  const data = readFileSync(path);
  if (data.length > limit) fail(`${kind} exceeds ${limit} bytes: ${path}`);
  return data;
}

const config = JSON.parse(boundedRead(configPath, SOURCE_LIMIT, 'config'));
const canonicalSource = resolve(root, config.source);

function records() {
  const instruction = [], local = [], returns = [], indirect = [], tails = [], direct = [];
  for (const fn of config.functions) {
    let offset = 0;
    const wide = new Set(fn.wideInstructionOffsets);
    for (const text of fn.schedule.split('|')) {
      const split = text.indexOf(' ');
      const mnemonic = split < 0 ? text : text.slice(0, split);
      const operands = split < 0 ? '' : text.slice(split + 1);
      instruction.push(`${fn.name}:${offset.toString(16)}:${mnemonic}:${operands}`);
      offset += wide.has(offset) ? 4 : 2;
    }
    if (offset !== fn.size) fail(`config schedule size mismatch for ${fn.name}`);
    for (const item of fn.localTransfers) {
      const [off, mnemonic, target] = item.split(':');
      local.push(`${fn.name}:${off}:${mnemonic}:local:${target}`);
    }
    for (const item of fn.returns) returns.push(`${fn.name}:${item}`);
    for (const item of fn.indirectCalls) indirect.push(`${fn.name}:${item}`);
    for (const item of fn.indirectTails) tails.push(`${fn.name}:${item}`);
    for (const call of fn.directCalls) direct.push(`${fn.name}:${call.offset.toString(16)}:${call.mnemonic}:${call.symbol}:${call.targetMode}:${call.relocation}`);
  }
  return { instructionSchedule: instruction, localTransferSchedule: local,
    returnTransferSchedule: returns, indirectCallSchedule: indirect,
    indirectTailSchedule: tails, directCallSchedule: direct };
}

function validateConfig() {
  const rec = records();
  for (const [key, lines] of Object.entries(rec)) {
    if (sha256(lines.join('\n')) !== config.canonicalHashes[key]) fail(`config ${key} hash mismatch`);
  }
  const totals = config.functions.reduce((a, f) => {
    a.size += f.size; a.instructions += f.instructionCount;
    a.wide += f.wideInstructionOffsets.length; a.local += f.localBranchCount;
    a.memory += f.memoryOperationCount; a.returns += f.returnCount;
    a.indirect += f.indirectCallCount; a.tails += f.indirectTailCount;
    a.direct += f.directCallCount; return a;
  }, { size: 0, instructions: 0, wide: 0, local: 0, memory: 0, returns: 0, indirect: 0, tails: 0, direct: 0 });
  const wanted = [config.totalBodySize, config.expectedInstructionCount, config.wideInstructionCount,
    config.localBranchCount, config.memoryOperationCount, config.returnCount,
    config.indirectCallCount, config.indirectTailCount, config.directCallCount];
  const got = [totals.size, totals.instructions, totals.wide, totals.local, totals.memory,
    totals.returns, totals.indirect, totals.tails, totals.direct];
  if (wanted.some((v, i) => v !== got[i])) fail('config aggregate mismatch');
  if (config.directCalls.length !== 68 || config.relocations.length !== 68) fail('config must describe exactly 68 calls');
  if (config.pcRelativeDataAccesses.length !== 16) fail('config must describe exactly 16 PC-relative targets');
}

function elf32(data, label) {
  if (data.length < 52 || data.toString('binary', 0, 4) !== '\x7fELF') fail(`${label}: not an ELF file`);
  if (data[4] !== 1 || data[5] !== 1) fail(`${label}: expected ELF32 little-endian`);
  const u16 = o => data.readUInt16LE(o), u32 = o => data.readUInt32LE(o);
  if (u16(16) !== 1 || u16(18) !== 40) fail(`${label}: expected relocatable ARM ELF`);
  const shoff = u32(32), shentsize = u16(46), shnum = u16(48), shstrndx = u16(50);
  if (shentsize < 40 || shnum === 0 || shnum > SECTION_LIMIT || shstrndx >= shnum) fail(`${label}: invalid section table`);
  if (shoff + shentsize * shnum > data.length) fail(`${label}: truncated section table`);
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * shentsize;
    sections.push({ index: i, nameOff: u32(o), type: u32(o + 4), flags: u32(o + 8),
      offset: u32(o + 16), size: u32(o + 20), link: u32(o + 24), info: u32(o + 28),
      align: u32(o + 32), entsize: u32(o + 36) });
  }
  for (const s of sections) if (s.type !== 8 && s.offset + s.size > data.length) fail(`${label}: truncated section`);
  const executableBytes = sections.reduce((total, section) => total + ((section.flags & 4) ? section.size : 0), 0);
  if (executableBytes > OBJECT_LIMIT) fail(`${label}: executable sections exceed ${OBJECT_LIMIT} bytes`);
  const shstr = sections[shstrndx];
  const stringAt = (section, off) => {
    if (!section || off >= section.size) return '';
    const start = section.offset + off, endLimit = section.offset + section.size;
    let end = start; while (end < endLimit && data[end] !== 0) end++;
    return data.toString('utf8', start, end);
  };
  for (const s of sections) s.name = stringAt(shstr, s.nameOff);
  const symbols = [];
  for (const tab of sections.filter(s => s.type === 2)) {
    const ent = tab.entsize || 16;
    if (ent < 16 || tab.size % ent || tab.size / ent > SYMBOL_LIMIT || tab.link >= sections.length) fail(`${label}: invalid symbol table`);
    const strings = sections[tab.link];
    for (let i = 0; i < tab.size / ent; i++) {
      const o = tab.offset + i * ent;
      symbols.push({ table: tab.index, index: i, name: stringAt(strings, u32(o)), value: u32(o + 4),
        size: u32(o + 8), info: data[o + 12], other: data[o + 13], shndx: u16(o + 14) });
    }
  }
  if (symbols.length > SYMBOL_LIMIT) fail(`${label}: too many symbols`);
  const symbolsByTable = new Map();
  for (const s of symbols) { if (!symbolsByTable.has(s.table)) symbolsByTable.set(s.table, []); symbolsByTable.get(s.table)[s.index] = s; }
  const relocs = [];
  for (const rs of sections.filter(s => s.type === 9 || s.type === 4)) {
    const ent = rs.entsize || (rs.type === 9 ? 8 : 12);
    if (ent < (rs.type === 9 ? 8 : 12) || rs.size % ent || rs.size / ent > RELOCATION_LIMIT || rs.info >= sections.length) fail(`${label}: invalid relocation table`);
    const stab = symbolsByTable.get(rs.link);
    if (!stab) fail(`${label}: relocation table has no symbol table`);
    for (let i = 0; i < rs.size / ent; i++) {
      const o = rs.offset + i * ent, info = u32(o + 4), symbol = stab[info >>> 8];
      if (!symbol) fail(`${label}: invalid relocation symbol`);
      relocs.push({ targetSection: rs.info, offset: u32(o), type: info & 0xff, symbol: symbol.name,
        symbolInfo: symbol.info, symbolShndx: symbol.shndx, symbolValue: symbol.value });
    }
  }
  if (relocs.length > RELOCATION_LIMIT) fail(`${label}: too many relocations`);
  return { data, sections, symbols, relocs, label };
}

function definitions(elf) {
  const map = new Map();
  for (const sym of elf.symbols) {
    if (sym.shndx === 0 || sym.shndx >= elf.sections.length || (sym.info & 15) !== 2) continue;
    if (!map.has(sym.name)) map.set(sym.name, []);
    map.get(sym.name).push(sym);
  }
  return map;
}

function body(elf, sym) {
  const section = elf.sections[sym.shndx], start = sym.value & ~1;
  if (!(section.flags & 4) || start + sym.size > section.size) fail(`${elf.label}: invalid executable body for ${sym.name}`);
  return elf.data.subarray(section.offset + start, section.offset + start + sym.size);
}

function validateThumbMapping(elf, sym) {
  const start = sym.value & ~1, end = start + sym.size;
  const mappings = elf.symbols
    .filter(item => item.shndx === sym.shndx && /^\$[atdx](?:\.|$)/.test(item.name))
    .sort((a, b) => a.value - b.value || a.index - b.index);
  const covering = mappings.filter(item => item.value <= start);
  const coverageOffset = covering.length ? covering[covering.length - 1].value : -1;
  const coverage = covering.filter(item => item.value === coverageOffset);
  if (coverage.length === 0 || coverage.some(item => !/^\$t(?:\.|$)/.test(item.name))) {
    fail(`${elf.label}: ${sym.name} body offset 0 is not covered by Thumb mapping`);
  }
  const nonThumbMapping = mappings.find(item =>
    !/^\$t(?:\.|$)/.test(item.name) && item.value >= start && item.value < end);
  if (nonThumbMapping) {
    fail(`${elf.label}: non-Thumb mapping symbol ${nonThumbMapping.name} in ${sym.name}+0x${(nonThumbMapping.value - start).toString(16)}`);
  }
}

function callMode(bytes, offset) {
  if (offset + 4 > bytes.length) return null;
  const first = bytes.readUInt16LE(offset), second = bytes.readUInt16LE(offset + 2);
  if ((first & 0xf800) !== 0xf000 || (second & 0xc000) !== 0xc000) return null;
  return (second & 0x1000) ? 'bl' : 'blx';
}

function validateObject(candidate, reference) {
  const defs = definitions(candidate), refs = definitions(reference);
  const expectedNames = new Set(config.functions.map(f => f.name));
  for (const fn of config.functions) {
    const found = defs.get(fn.name) || [], refFound = refs.get(fn.name) || [];
    if (found.length !== 1 || refFound.length !== 1) fail(`${candidate.label}: expected one definition of ${fn.name}`);
    const sym = found[0], ref = refFound[0], section = candidate.sections[sym.shndx];
    if ((sym.info >>> 4) !== 1 || (sym.value & 1) !== 1 || sym.size !== fn.size) fail(`${candidate.label}: bad global Thumb symbol/size for ${fn.name}`);
    if (section.align !== config.minimumAlignment) fail(`${candidate.label}: ${fn.name} section alignment must be exactly ${config.minimumAlignment}`);
    validateThumbMapping(reference, ref);
    validateThumbMapping(candidate, sym);
    if (!body(candidate, sym).equals(body(reference, ref))) fail(`${candidate.label}: instruction schedule mismatch in ${fn.name}`);
  }
  const expected = new Map(config.directCalls.map(c => [`${c.function}:${c.offset}`, c]));
  const seen = new Set();
  for (const fn of config.functions) {
    const sym = defs.get(fn.name)[0], bytes = body(candidate, sym), start = sym.value & ~1;
    const within = candidate.relocs.filter(r => r.targetSection === sym.shndx && r.offset >= start && r.offset < start + sym.size);
    for (const rel of within) {
      const off = rel.offset - start, key = `${fn.name}:${off}`, want = expected.get(key);
      const referenceTypeIsValid = rel.symbolShndx === 0
        ? [0, 2].includes(rel.symbolInfo & 15) && rel.symbolValue === 0
        : (rel.symbolInfo & 15) === 2;
      if (!want || rel.type !== 10 || rel.symbol !== want.symbol ||
          ![1, 2].includes(rel.symbolInfo >>> 4) || !referenceTypeIsValid) {
        fail(`${candidate.label}: unexpected or invalid relocation reference in ${fn.name}+0x${off.toString(16)}`);
      }
      if (callMode(bytes, off) !== want.mnemonic || (want.targetMode === 'thumb') !== (want.mnemonic === 'bl')) fail(`${candidate.label}: call mode mismatch in ${fn.name}+0x${off.toString(16)}`);
      if (seen.has(key)) fail(`${candidate.label}: duplicate call relocation at ${key}`);
      seen.add(key);
    }
  }
  if (seen.size !== expected.size) fail(`${candidate.label}: expected ${expected.size} selected call relocations, found ${seen.size}`);
  for (const pc of config.pcRelativeDataAccesses) {
    if (!expectedNames.has(pc.function) || pc.requiredEntryModulo4 !== 0 || pc.ownership !== 'unowned-post-body') fail('invalid PC-relative config');
    const fn = config.functions.find(f => f.name === pc.function);
    if (pc.offset >= fn.size || pc.targetOffset < fn.size) fail(`invalid PC-relative bounds for ${pc.function}`);
    const sym = defs.get(pc.function)[0], bytes = body(candidate, sym);
    const encoding = bytes.readUInt16LE(pc.offset);
    const requiredClass = pc.mnemonic === 'ldr' ? 0x4800 : pc.mnemonic === 'add' ? 0xa000 : -1;
    if ((encoding & 0xf800) !== requiredClass) fail(`${candidate.label}: wrong PC-relative form in ${pc.function}+0x${pc.offset.toString(16)}`);
    const target = ((pc.offset + 4) & ~3) + (encoding & 0xff) * 4;
    if (target !== pc.targetOffset) fail(`${candidate.label}: wrong PC target in ${pc.function}+0x${pc.offset.toString(16)}`);
  }
}

function compile(sourcePath, outputPath) {
  const candidates = [];
  if (process.env.ARM_CC) candidates.push([process.env.ARM_CC, []]);
  if (process.env.CROSS_COMPILE) candidates.push([`${process.env.CROSS_COMPILE}gcc`, []]);
  candidates.push(['arm-none-eabi-gcc', []], ['arm-linux-gnueabi-gcc', []],
    ['clang', ['--target=arm-none-eabi']], ['clang-19', ['--target=arm-none-eabi']],
    ['clang-18', ['--target=arm-none-eabi']], ['clang-17', ['--target=arm-none-eabi']]);
  const args = ['-c', '-x', 'assembler-with-cpp', '-march=armv6k', '-mthumb', sourcePath, '-o', outputPath];
  const errors = [];
  for (const [command, prefix] of candidates) {
    const run = spawnSync(command, [...prefix, ...args], { encoding: 'utf8', maxBuffer: 16384 });
    if (!run.error && run.status === 0 && existsSync(outputPath)) return;
    if (run.error?.code !== 'ENOENT') errors.push(`${command}: ${(run.stderr || run.error?.message || `exit ${run.status}`).slice(0, 300)}`);
  }
  fail(`unable to assemble ARM source${errors.length ? ` (${errors.join('; ')})` : ''}`);
}

function usage() { fail('usage: validate-thumb-leaf-helpers-05.mjs [source.S] [--object object.o]'); }

let sourcePath = canonicalSource, objectPath = null, positional = null;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--object') { if (++i >= process.argv.length || objectPath) usage(); objectPath = resolve(process.argv[i]); }
  else if (arg.startsWith('-') || positional) usage();
  else positional = resolve(arg);
}
if (positional) {
  if (objectPath) sourcePath = positional;
  else if (extname(positional).toLowerCase() === '.o') objectPath = positional;
  else sourcePath = positional;
}

let scratch;
try {
  validateConfig();
  const source = boundedRead(sourcePath, SOURCE_LIMIT, 'source');
  if (sha256(source) !== config.sourceSha256) fail(`source SHA-256 mismatch: ${sourcePath}`);
  scratch = mkdtempSync(join(tmpdir(), 'thumb-leaf-05-'));
  const referencePath = join(scratch, 'reference.o');
  compile(sourcePath, referencePath);
  const reference = elf32(boundedRead(referencePath, SOURCE_LIMIT, 'reference object'), 'reference object');
  let candidate = reference;
  if (objectPath) candidate = elf32(boundedRead(objectPath, SOURCE_LIMIT, 'object'), objectPath);
  validateObject(candidate, reference);
  console.log(`validated ${config.functions.length} Thumb functions, ${config.totalBodySize} bytes, ${config.directCallCount} calls, and ${config.pcRelativeDataAccesses.length} unowned PC targets`);
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (scratch) rmSync(scratch, { recursive: true, force: true });
}
