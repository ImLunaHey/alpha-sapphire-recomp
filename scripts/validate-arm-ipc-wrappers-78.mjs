#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const configPath = join(root, 'config', 'arm-ipc-wrappers-78.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const sourcePath = join(root, config.source);
const MAX_EXEC_SECTION = 16 * 1024 * 1024;
const MAX_ELF = 64 * 1024 * 1024;

function fail(message) { throw new Error(message); }
function run(tool, args, options = {}) {
  try { return execFileSync(tool, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }); }
  catch (error) {
    const detail = String(error.stderr || error.stdout || error.message).trim();
    fail(`${basename(tool)} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
}
function executable(command) {
  if (!command) return null;
  if (command.includes('/')) return existsSync(command) ? command : null;
  try { return execFileSync('sh', ['-c', 'command -v "$1"', 'sh', command], { encoding: 'utf8' }).trim() || null; }
  catch { return null; }
}
function nixTool(name) {
  try {
    for (const entry of readdirSync('/nix/store')) {
      if (!/(arm-none-eabi|gcc-arm-embedded|llvm)/.test(entry)) continue;
      const candidate = join('/nix/store', entry, 'bin', name);
      if (existsSync(candidate)) return candidate;
    }
  } catch {}
  return null;
}
function findTool(kind) {
  const upper = kind.toUpperCase().replace('-', '_');
  const prefix = process.env.CROSS_COMPILE || '';
  const candidates = [
    process.env[`ARM_${upper}`], process.env[upper],
    prefix && `${prefix}${kind}`, `arm-none-eabi-${kind}`,
    `arm-linux-gnueabihf-${kind}`,
  ];
  for (const candidate of candidates) {
    const found = executable(candidate);
    if (found) return found;
  }
  return nixTool(`arm-none-eabi-${kind}`);
}

const tools = {
  as: findTool('as'),
  objdump: findTool('objdump'),
  ld: findTool('ld'),
};
if (!tools.as || !tools.objdump) fail('ARM assembler/objdump not found (set ARM_AS/ARM_OBJDUMP or CROSS_COMPILE)');

function assemble(source, output) {
  run(tools.as, ['-o', output, source]);
}
function u16(b, o) { if (o + 2 > b.length) fail('truncated ELF'); return b.readUInt16LE(o); }
function u32(b, o) { if (o + 4 > b.length) fail('truncated ELF'); return b.readUInt32LE(o); }
function bounded(buffer, offset, size, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset + size > buffer.length)
    fail(`out-of-bounds ${what}`);
  return buffer.subarray(offset, offset + size);
}
function cstring(buffer, offset) {
  if (offset < 0 || offset >= buffer.length) fail('bad ELF string offset');
  const end = buffer.indexOf(0, offset);
  if (end < 0) fail('unterminated ELF string');
  return buffer.toString('utf8', offset, end);
}
function parseElf(path) {
  const b = readFileSync(path);
  if (b.length > MAX_ELF) fail(`ELF exceeds ${MAX_ELF} byte validation limit`);
  if (b.length < 52 || b.subarray(0, 4).toString('hex') !== '7f454c46') fail('not an ELF file');
  if (b[4] !== 1 || b[5] !== 1 || u16(b, 18) !== 40) fail('expected little-endian ELF32 for ARM');
  if (u16(b, 16) !== 1) fail('expected a relocatable ELF object');
  const shoff = u32(b, 32), shentsize = u16(b, 46), shnum = u16(b, 48), shstrndx = u16(b, 50);
  if (shentsize < 40 || !shnum || shstrndx >= shnum) fail('unsupported ELF section table');
  bounded(b, shoff, shentsize * shnum, 'section table');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * shentsize;
    sections.push({ index: i, nameOffset: u32(b,o), type: u32(b,o+4), flags: u32(b,o+8),
      offset: u32(b,o+16), size: u32(b,o+20), link: u32(b,o+24), info: u32(b,o+28), entsize: u32(b,o+36) });
  }
  const shstr = sections[shstrndx];
  const names = bounded(b, shstr.offset, shstr.size, 'section-name table');
  for (const s of sections) {
    s.name = cstring(names, s.nameOffset);
    if (s.type !== 8) s.data = bounded(b, s.offset, s.size, `section ${s.name}`);
    if ((s.flags & 4) && s.size > MAX_EXEC_SECTION) fail(`executable section ${s.name} exceeds 16 MiB`);
  }
  const symbolTables = new Map();
  for (const s of sections.filter(x => x.type === 2)) {
    if (s.link >= sections.length || s.entsize < 16 || s.size % s.entsize) fail('malformed symbol table');
    const strings = sections[s.link].data;
    const symbols = [];
    for (let o = 0; o < s.size; o += s.entsize) {
      const at = s.offset + o;
      symbols.push({ name: cstring(strings, u32(b,at)), value: u32(b,at+4), size: u32(b,at+8),
        info: b[at+12], shndx: u16(b,at+14) });
    }
    symbolTables.set(s.index, symbols);
  }
  const relocations = [];
  for (const s of sections.filter(x => x.type === 9 || x.type === 4)) {
    const width = s.type === 9 ? 8 : 12;
    if (s.info >= sections.length || !symbolTables.has(s.link) || s.entsize < width || s.size % s.entsize) fail('malformed relocation section');
    const symbols = symbolTables.get(s.link);
    for (let o = 0; o < s.size; o += s.entsize) {
      const at = s.offset + o, info = u32(b,at+4), symbolIndex = info >>> 8;
      if (symbolIndex >= symbols.length) fail('bad relocation symbol index');
      relocations.push({ section: sections[s.info].name, offset: u32(b,at), type: info & 255, symbol: symbols[symbolIndex].name });
    }
  }
  return { b, sections, symbolTables, relocations };
}

function checkConfig() {
  if (config.mode !== 'arm' || config.functions.length !== 5 || config.totalBodySize !== 552 || config.totalAdjacentSize !== 8)
    fail('config batch totals are not 5 functions / 552 body bytes / 8 adjacent bytes');
  if (config.cumulativePoolSlots !== 783 || config.cumulativePoolClasses !== 414) fail('config cumulative pool totals are not 783/414');
  const branches = config.functions.flatMap(f => f.branches.map(x => ({ ...x, function: f.name, section: f.section })));
  if (branches.length !== 8) fail('config does not contain exactly eight transfers');
  const identities = new Set(branches.map(x => x.symbol));
  if (identities.size !== 7) fail('config does not contain exactly seven transfer classes');
  const shared = branches.filter(x => x.symbol === 'func_00160380');
  if (shared.length !== 2 || shared[0].offset !== 168 || shared[1].offset !== 328) fail('shared func_00160380 contract is wrong');
  const secondary = config.branchIdentityContract.secondaryEntryRelations;
  if (secondary.length !== 1 || secondary[0].symbol !== 'service_record_enable_secondary_78' || secondary[0].owner !== 'func_001947D8' || secondary[0].ownerOffset !== 72 || secondary[0].bytesBeforeNextGlobal !== 52)
    fail('secondary-entry relationship is wrong');
  const literals = config.functions.flatMap(f => f.literals);
  if (literals.length !== 2 || literals.some(x => x.symbol !== 'ipc_shared_control_owner_72')) fail('two reused literal slots are required');
  const boundaries = [
    ['func_00190A7C', '.text.func_00190A7C', 56, 'func_00190AB8', 60],
    ['func_00190AB8', '.text.func_00190AB8', 360, 'func_00190C20', 360],
    ['func_00190CD8', '.text.func_00190CD8', 36, 'func_00190D00', 40],
    ['func_00190FCC', '.text.func_00190FCC', 88, 'func_00191024', 88],
    ['func_00191080', '.text.func_00191080', 12, 'func_00191090', 16],
  ];
  const actualBoundaries = config.functions.map(f => [f.name, f.section, f.size, f.nextGlobal, f.nextGlobalOffset]);
  if (JSON.stringify(actualBoundaries) !== JSON.stringify(boundaries)) fail('function order, sizes, or following-global boundaries differ from the contract');
  const transferContract = [
    ['func_00190A7C',36,'R_ARM_CALL','bl','func_00192C4C'],
    ['func_00190AB8',100,'R_ARM_CALL','bl','func_001602B8'],
    ['func_00190AB8',168,'R_ARM_CALL','bl','func_00160380'],
    ['func_00190AB8',328,'R_ARM_CALL','bl','func_00160380'],
    ['func_00190CD8',20,'R_ARM_CALL','bl','func_00192BF8'],
    ['func_00190FCC',12,'R_ARM_CALL','bl','func_00188184'],
    ['func_00190FCC',20,'R_ARM_CALL','bl','func_001935F4'],
    ['func_00190FCC',64,'R_ARM_JUMP24','blne','service_record_enable_secondary_78'],
  ];
  const actualTransfers = config.functions.flatMap(f => f.branches.map(b => [f.name,b.offset,b.kind,b.mnemonic,b.symbol]));
  if (JSON.stringify(actualTransfers) !== JSON.stringify(transferContract)) fail('direct-transfer schedule differs from the contract');
  const literalContract = [['func_00190A7C',56,32],['func_00190CD8',36,16]];
  const actualLiterals = config.functions.flatMap(f => f.literals.map(l => [f.name,l.offset,...l.loadOffsets]));
  if (JSON.stringify(actualLiterals) !== JSON.stringify(literalContract)) fail('literal slot/load boundaries differ from the contract');
  if (JSON.stringify(config.branchIdentityContract.primaryEntries) !== JSON.stringify(['func_00192C4C','func_001602B8','func_00160380','func_00192BF8','func_00188184','func_001935F4']) ||
      JSON.stringify(config.branchIdentityContract.secondaryEntries) !== JSON.stringify(['service_record_enable_secondary_78']) || !config.branchIdentityContract.classesPairwiseDistinct)
    fail('primary/secondary transfer identity partition is wrong');
  if (JSON.stringify(config.reusedLiteralIdentities) !== JSON.stringify(['ipc_shared_control_owner_72']) || config.newLiteralIdentities.length !== 0)
    fail('reused/new literal identity partition is wrong');
}

function disassembly(path, section, bodySize) {
  const output = run(tools.objdump, ['-d', '-j', section, path]);
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+((?:[0-9a-fA-F]{8}\s+)+)\s*(.*?)\s*$/);
    if (!match) continue;
    const offset = Number.parseInt(match[1], 16);
    if (offset < bodySize) instructions.push({
      offset,
      encoding: match[2].replace(/\s+/g, '').toLowerCase(),
      mnemonic: match[3].trim().split(/\s+/, 1)[0].toLowerCase(),
    });
  }
  return instructions;
}

function validateObject(path, canonicalPath) {
  const elf = parseElf(path), canonical = parseElf(canonicalPath);
  const expectedRelocs = [];
  const relevantSectionIndexes = new Set();
  let bodyTotal = 0, adjacentTotal = 0, instructionTotal = 0;
  for (const f of config.functions) {
    const section = elf.sections.filter(s => s.name === f.section);
    const reference = canonical.sections.filter(s => s.name === f.section);
    if (section.length !== 1 || reference.length !== 1) fail(`${f.section}: expected exactly one section`);
    const owned = f.size + f.literals.length * 4;
    if (!(section[0].flags & 4) || section[0].size !== owned) fail(`${f.section}: expected executable size ${owned}, got ${section[0].size}`);
    relevantSectionIndexes.add(section[0].index);
    if (!section[0].data.equals(reference[0].data)) fail(`${f.section}: bytes differ from normative schedule`);
    bodyTotal += f.size; adjacentTotal += owned - f.size;
    const funcs = [...elf.symbolTables.values()].flat().filter(s => s.name === f.name && (s.info & 15) === 2 && s.shndx === section[0].index);
    if (funcs.length !== 1 || (funcs[0].info >>> 4) !== 1 || funcs[0].value !== 0 || funcs[0].size !== f.size)
      fail(`${f.name}: expected one global STT_FUNC of size ${f.size} at section offset zero`);
    const actualDis = disassembly(path, f.section, f.size);
    const referenceDis = disassembly(canonicalPath, f.section, f.size);
    const normalized = xs => xs.map(x => ({ offset: x.offset, encoding: x.encoding }));
    if (actualDis.length !== f.size / 4 || JSON.stringify(normalized(actualDis)) !== JSON.stringify(normalized(referenceDis)))
      fail(`${f.name}: section-scoped ARM disassembly differs from normative schedule`);
    instructionTotal += actualDis.length;
    for (const branch of f.branches) expectedRelocs.push({ section: f.section, offset: branch.offset,
      type: branch.kind === 'R_ARM_CALL' ? 28 : 29, symbol: branch.symbol });
    for (const literal of f.literals) expectedRelocs.push({ section: f.section, offset: literal.offset, type: 2, symbol: literal.symbol });
  }
  const globalFunctionsInBatch = [...elf.symbolTables.values()].flat()
    .filter(s => relevantSectionIndexes.has(s.shndx) && (s.info >>> 4) === 1 && (s.info & 15) === 2)
    .map(s => s.name).sort();
  const expectedFunctions = config.functions.map(f => f.name).sort();
  if (JSON.stringify(globalFunctionsInBatch) !== JSON.stringify(expectedFunctions))
    fail('named sections must contain exactly the five contracted global STT_FUNC symbols');
  if (bodyTotal !== 552 || adjacentTotal !== 8 || instructionTotal !== 138) fail('object totals are not 552 bytes / 8 adjacent bytes / 138 instructions');
  const relevant = new Set(config.functions.map(f => f.section));
  const actualRelocs = elf.relocations.filter(r => relevant.has(r.section)).sort(compareReloc);
  expectedRelocs.sort(compareReloc);
  if (JSON.stringify(actualRelocs) !== JSON.stringify(expectedRelocs)) fail(`relocation contract mismatch\nexpected ${JSON.stringify(expectedRelocs)}\nactual   ${JSON.stringify(actualRelocs)}`);
}
function compareReloc(a,b) { return a.section.localeCompare(b.section) || a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol); }

function sourceHash(path) { return createHash('sha256').update(readFileSync(path)).digest('hex'); }
const args = process.argv.slice(2);
const selfTest = args.includes('--self-test');
const positional = args.filter(x => x !== '--self-test' && x !== '--object');
if (args.includes('--object') && positional.length !== 1) fail('usage: validate-arm-ipc-wrappers-78.mjs [--self-test] [--object] [object-or-source]');
if (positional.length > 1) fail('usage: validate-arm-ipc-wrappers-78.mjs [--self-test] [object-or-source]');
checkConfig();
if (sourceHash(sourcePath) !== config.sourceSha256 || config.sourceSha256 !== config.normalizedScheduleSha256)
  fail('source/config normative schedule SHA-256 mismatch');

const scratch = mkdtempSync(join(tmpdir(), 'validate-arm-ipc-78-'));
try {
  const canonical = join(scratch, 'canonical.o');
  assemble(sourcePath, canonical);
  let candidate = positional[0] ? resolve(positional[0]) : canonical;
  if (candidate !== canonical && ['.s', '.S'].includes(extname(candidate))) {
    const assembled = join(scratch, 'candidate.o'); assemble(candidate, assembled); candidate = assembled;
  }
  validateObject(candidate, canonical);
  if (selfTest) {
    for (const [name, from, to] of [
      ['hostile-destination', 'func_00160380', 'func_00160381'],
      ['hostile-literal', 'ipc_shared_control_owner_72', 'ipc_shared_control_owner_73'],
    ]) {
      const s = join(scratch, `${name}.S`), o = join(scratch, `${name}.o`);
      writeFileSync(s, readFileSync(sourcePath, 'utf8').replaceAll(from, to)); assemble(s, o);
      let rejected = false; try { validateObject(o, canonical); } catch { rejected = true; }
      if (!rejected) fail(`${name} self-test was not rejected`);
    }
    if (tools.ld) {
      const foreignSource = join(scratch, 'foreign.S'), foreignObject = join(scratch, 'foreign.o'), combined = join(scratch, 'combined.o');
      writeFileSync(foreignSource, `.syntax unified
.arm
.section .text.foreign,"ax",%progbits
.global foreign_78
.type foreign_78,%function
foreign_78:
 bx lr
.size foreign_78,.-foreign_78
.global func_00192C4C,func_001602B8,func_00160380,func_00192BF8
.global func_00188184,func_001935F4,service_record_enable_secondary_78
func_00192C4C: bx lr
func_001602B8: bx lr
func_00160380: bx lr
func_00192BF8: bx lr
func_00188184: bx lr
func_001935F4: bx lr
service_record_enable_secondary_78: bx lr
.section .data.foreign,"aw",%progbits
.global ipc_shared_control_owner_72
ipc_shared_control_owner_72: .word 0
`);
      assemble(foreignSource, foreignObject); run(tools.ld, ['-r', '-o', combined, canonical, foreignObject]); validateObject(combined, canonical);
    }
  }
  console.log(`arm-ipc-wrappers-78: OK (${selfTest ? 'standalone, foreign-combined, hostile; ' : ''}5 functions, 552 body bytes, 138 instructions, 8 adjacent bytes, 8 transfers/7 classes, pools 783/414)`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
