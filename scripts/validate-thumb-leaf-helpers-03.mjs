#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const configPath = join(root, 'config/thumb-leaf-helpers-03.json');
const defaultSource = join(root, 'src/main/thumb_leaf_helpers_03.S');
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const knownPrefix = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';

process.on('uncaughtException', error => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});

function fail(message) { throw new Error(message); }
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function checkedRange(offset, size, limit, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > limit || size > limit - offset)
    fail(`${what} is outside the file`);
}
function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, { encoding: 'utf8', maxBuffer: MAX_EXEC, timeout: 30000, ...options });
  if (result.error) fail(`${basename(tool)} failed: ${result.error.message}`);
  if (result.status !== 0) fail(`${basename(tool)} failed (${result.status}): ${(result.stderr || result.stdout).trim()}`);
  return result.stdout;
}
function tools() {
  const prefix = process.env.CROSS_COMPILE || knownPrefix;
  const as = `${prefix}as`, objdump = `${prefix}objdump`, ld = `${prefix}ld`;
  if (!existsSync(as) || !existsSync(objdump) || !existsSync(ld)) fail(`Arm tools not found at ${prefix}`);
  return { as, objdump, ld };
}

function parseElf(path) {
  const st = statSync(path);
  if (!st.isFile()) fail(`${path} is not a regular file`);
  if (st.size > MAX_FILE) fail(`ELF exceeds the ${MAX_FILE}-byte file limit`);
  const b = readFileSync(path);
  if (b.length < 52 || b[0] !== 0x7f || b.toString('ascii', 1, 4) !== 'ELF') fail('not an ELF file');
  if (b[4] !== 1) fail('ELF must be 32-bit');
  if (b[5] !== 1) fail('ELF must be little-endian');
  const u16 = o => { checkedRange(o, 2, b.length, 'ELF field'); return b.readUInt16LE(o); };
  const u32 = o => { checkedRange(o, 4, b.length, 'ELF field'); return b.readUInt32LE(o); };
  if (u16(16) !== 1) fail('ELF must be relocatable');
  if (u16(18) !== 40) fail('ELF machine must be ARM');
  const shoff = u32(32), shentsize = u16(46);
  let shnum = u16(48), shstrndx = u16(50);
  if (shentsize < 40) fail('section header entries are too small');
  checkedRange(shoff, shentsize, b.length, 'section header zero');
  if (shnum === 0) shnum = u32(shoff + 20);
  if (shnum < 1 || shnum > MAX_SECTIONS) fail(`section count must be 1..${MAX_SECTIONS}`);
  checkedRange(shoff, shentsize * shnum, b.length, 'section header table');
  if (shstrndx === 0xffff) shstrndx = u32(shoff + 24);
  if (shstrndx >= shnum) fail('invalid section-name string table index');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * shentsize;
    const s = { index: i, nameOffset: u32(o), type: u32(o + 4), flags: u32(o + 8), addr: u32(o + 12), offset: u32(o + 16), size: u32(o + 20), link: u32(o + 24), info: u32(o + 28), align: u32(o + 32), entsize: u32(o + 36) };
    if (s.type !== 8) checkedRange(s.offset, s.size, b.length, `section ${i}`);
    sections.push(s);
  }
  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail('section-name table is not a string table');
  function stringAt(section, offset, what) {
    if (offset >= section.size) fail(`${what} string offset is invalid`);
    const start = section.offset + offset, end = b.indexOf(0, start);
    if (end < start || end >= section.offset + section.size) fail(`${what} is not NUL terminated`);
    return b.toString('utf8', start, end);
  }
  for (const s of sections) s.name = stringAt(shstr, s.nameOffset, `section ${s.index} name`);
  const executableBytes = sections.reduce((n, s) => n + ((s.flags & 4) ? s.size : 0), 0);
  if (executableBytes > MAX_EXEC) fail(`executable sections exceed ${MAX_EXEC} bytes`);
  const symbols = [];
  for (const s of sections.filter(x => x.type === 2 || x.type === 11)) {
    if (s.link >= sections.length || sections[s.link].type !== 3) fail(`symbol table ${s.name} has an invalid string table`);
    if (s.entsize < 16 || s.size % s.entsize) fail(`symbol table ${s.name} has invalid entries`);
    const strings = sections[s.link], count = s.size / s.entsize;
    for (let i = 0; i < count; i++) {
      const o = s.offset + i * s.entsize, nameOffset = u32(o);
      symbols.push({ table: s.index, index: i, name: nameOffset ? stringAt(strings, nameOffset, `symbol ${i} name`) : '', value: u32(o + 4), size: u32(o + 8), info: b[o + 12], other: b[o + 13], shndx: u16(o + 14) });
    }
  }
  const symByTable = new Map();
  for (const sym of symbols) {
    if (!symByTable.has(sym.table)) symByTable.set(sym.table, []);
    symByTable.get(sym.table)[sym.index] = sym;
  }
  const relocs = [];
  for (const s of sections.filter(x => x.type === 9 || x.type === 4)) {
    const minimum = s.type === 9 ? 8 : 12;
    if (s.entsize < minimum || s.size % s.entsize) fail(`relocation section ${s.name} has invalid entries`);
    if (s.info >= sections.length || !symByTable.has(s.link)) fail(`relocation section ${s.name} has invalid links`);
    const syms = symByTable.get(s.link), count = s.size / s.entsize;
    for (let i = 0; i < count; i++) {
      const o = s.offset + i * s.entsize, info = u32(o + 4), symIndex = info >>> 8;
      if (!syms[symIndex]) fail(`relocation ${s.name}[${i}] has an invalid symbol`);
      relocs.push({ target: s.info, offset: u32(o), type: info & 0xff, symbol: syms[symIndex].name });
    }
  }
  return { b, sections, symbols, relocs };
}

function canonicalRecords(config) {
  const instruction = [], local = [], returns = [], indirect = [], direct = [];
  for (const f of config.functions) {
    let offset = 0;
    for (const text of f.schedule.split('|')) {
      const split = text.indexOf(' '), mnemonic = split < 0 ? text : text.slice(0, split), operands = split < 0 ? '' : text.slice(split + 1);
      instruction.push(`${f.name}:${offset.toString(16)}:${mnemonic}:${operands}`);
      offset += f.wideInstructionOffsets.includes(offset) ? 4 : 2;
    }
    for (const x of f.localTransfers) { const [o, m, t] = x.split(':'); local.push(`${f.name}:${o}:${m}:local:${t}`); }
    for (const x of f.returns) { const [o, m, ...op] = x.split(':'); returns.push(`${f.name}:${o}:${m}:${op.join(':')}`); }
    for (const x of f.indirectCalls) { const [o, m, ...op] = x.split(':'); indirect.push(`${f.name}:${o}:${m}:${op.join(':')}`); }
    for (const x of f.directCalls) direct.push(`${f.name}:${x.offset.toString(16)}:${x.mnemonic}:${x.symbol}:${x.targetMode}:${x.relocation}`);
  }
  return { instructionSchedule: instruction, localTransferSchedule: local, returnTransferSchedule: returns, indirectCallSchedule: indirect, directCallSchedule: direct };
}

function checkConfig(config) {
  const records = canonicalRecords(config);
  for (const [kind, lines] of Object.entries(records)) {
    const actual = sha256(lines.join('\n'));
    if (actual !== config.canonicalHashes[kind]) fail(`configuration ${kind} hash mismatch`);
  }
  for (const f of config.functions) {
    const seen = []; let offset = 0;
    for (const text of f.schedule.split('|')) {
      const [mnemonic, operand = ''] = text.split(/ (.*)/s);
      if (operand.startsWith('local:+')) seen.push(`${offset.toString(16)}:${mnemonic}:+${operand.slice(7)}`);
      offset += f.wideInstructionOffsets.includes(offset) ? 4 : 2;
    }
    if (seen.join('|') !== f.localTransfers.join('|')) fail(`${f.name}: local-transfer array disagrees with schedule`);
    for (const call of f.directCalls) {
      if ((call.mnemonic === 'bl') !== (call.targetMode === 'thumb') || (call.mnemonic === 'blx') !== (call.targetMode === 'arm') || call.relocation !== 'R_ARM_THM_CALL')
        fail(`${f.name}: invalid direct-call mode contract`);
    }
  }
  const totals = config.functions.reduce((a, f) => ({ size: a.size + f.size, instructions: a.instructions + f.instructionCount, wide: a.wide + f.wideInstructionOffsets.length, local: a.local + f.localBranchCount, memory: a.memory + f.memoryOperationCount, returns: a.returns + f.returnCount, indirect: a.indirect + f.indirectCallCount, direct: a.direct + f.directCallCount }), { size: 0, instructions: 0, wide: 0, local: 0, memory: 0, returns: 0, indirect: 0, direct: 0 });
  const expected = [config.totalBodySize, config.expectedInstructionCount, config.wideInstructionCount, config.localBranchCount, config.memoryOperationCount, config.returnCount, config.indirectCallCount, config.directCallCount];
  if ([totals.size, totals.instructions, totals.wide, totals.local, totals.memory, totals.returns, totals.indirect, totals.direct].some((x, i) => x !== expected[i])) fail('configuration totals are inconsistent');
}

function normalizeInstruction(f, offset, mnemonic, operand) {
  operand = operand.replace(/\s*@.*$/, '').replace(/\s+/g, ' ').replace(/,\s*/g, ', ').trim();
  const local = new Map(f.localTransfers.map(x => { const [o, m, t] = x.split(':'); return [parseInt(o, 16), { mnemonic: m, target: t.slice(1) }]; })).get(offset);
  if (local) return `${local.mnemonic} local:+${local.target}`;
  const call = f.directCalls.find(x => x.offset === offset);
  if (call) return `${call.mnemonic} ${call.symbol}`;
  return `${mnemonic}${operand ? ` ${operand}` : ''}`;
}

function disassemble(objectPath, config, objdump) {
  const args = ['-d'];
  for (const f of config.functions) args.push('-j', `.text.${f.name}`);
  args.push(objectPath);
  const output = run(objdump, args);
  const bySection = new Map(); let current = null;
  for (const line of output.split(/\r?\n/)) {
    const heading = line.match(/^Disassembly of section (.+):$/);
    if (heading) { current = heading[1]; bySection.set(current, []); continue; }
    if (!current) continue;
    const m = line.match(/^\s*([0-9a-fA-F]+):\s+((?:[0-9a-fA-F]{4}\s+)+)\s*([A-Za-z][\w.]*)\s*(.*?)\s*$/);
    if (m) bySection.get(current).push({ offset: parseInt(m[1], 16), width: m[2].trim().split(/\s+/).length * 2, mnemonic: m[3], operand: m[4] });
  }
  for (const f of config.functions) {
    const got = bySection.get(`.text.${f.name}`);
    if (!got) fail(`objdump omitted .text.${f.name}`);
    const expected = f.schedule.split('|');
    if (got.length !== expected.length) fail(`${f.name}: instruction count ${got.length}, expected ${expected.length}`);
    for (let i = 0; i < got.length; i++) {
      const ins = got[i], text = normalizeInstruction(f, ins.offset, ins.mnemonic, ins.operand);
      const direct = f.directCalls.find(x => x.offset === ins.offset);
      if (direct && ins.mnemonic !== direct.mnemonic) fail(`${f.name}+0x${ins.offset.toString(16)}: direct-call mnemonic '${ins.mnemonic}', expected '${direct.mnemonic}'`);
      if (text !== expected[i]) fail(`${f.name}+0x${ins.offset.toString(16)}: '${text}', expected '${expected[i]}'`);
      const expectedWidth = f.wideInstructionOffsets.includes(ins.offset) ? 4 : 2;
      if (ins.width !== expectedWidth) fail(`${f.name}+0x${ins.offset.toString(16)}: width ${ins.width}, expected ${expectedWidth}`);
    }
  }
}

function validateObject(path, config, objdump) {
  const elf = parseElf(path), expectedNames = new Set(config.functions.map(f => f.name));
  const ownedSections = new Map();
  for (const f of config.functions) {
    const sectionName = `.text.${f.name}`, matches = elf.sections.filter(s => s.name === sectionName);
    if (matches.length !== 1) fail(`${sectionName}: expected exactly one section`);
    const s = matches[0]; ownedSections.set(s.index, f);
    if (s.type !== 1 || (s.flags & 6) !== 6) fail(`${sectionName}: expected executable allocatable PROGBITS`);
    if (s.size !== f.size) fail(`${sectionName}: size ${s.size}, expected ${f.size}`);
    if (s.align < 2) fail(`${sectionName}: insufficient alignment`);
    const syms = elf.symbols.filter(x => x.name === f.name);
    if (syms.length !== 1) fail(`${f.name}: expected exactly one symbol`);
    const sym = syms[0];
    if ((sym.info >>> 4) !== 1 || (sym.info & 15) !== 2 || sym.shndx !== s.index || sym.value !== 1 || sym.size !== f.size) fail(`${f.name}: invalid global Thumb function symbol`);
  }
  for (const access of config.pcRelativeDataAccesses) {
    const f = config.functions.find(x => x.name === access.function), s = [...ownedSections].find(([, x]) => x === f)[0];
    const sec = elf.sections[s], o = sec.offset + access.offset, h = elf.b.readUInt16LE(o);
    if ((h & 0xf800) !== 0x4800) fail(`${f.name}+0x${access.offset.toString(16)}: not a Thumb literal load`);
    const target = ((access.offset + 4) & ~3) + ((h & 0xff) << 2);
    if (target !== access.targetOffset) fail(`${f.name}+0x${access.offset.toString(16)}: PC target 0x${target.toString(16)}, expected 0x${access.targetOffset.toString(16)}`);
    if (access.ownership !== 'unowned-post-body' || target < f.size) fail(`${f.name}: PC-relative ownership contract violated`);
  }
  const expectedRelocs = config.relocations.map(r => `${r.function}:${r.offset}:10:${r.symbol}`).sort();
  const actualRelocs = elf.relocs.filter(r => ownedSections.has(r.target)).map(r => `${ownedSections.get(r.target).name}:${r.offset}:${r.type}:${r.symbol}`).sort();
  if (actualRelocs.length !== expectedRelocs.length || actualRelocs.some((x, i) => x !== expectedRelocs[i])) fail(`owned relocation schedule mismatch: ${actualRelocs.join(', ')}`);
  for (const call of config.directCalls) {
    const refs = elf.symbols.filter(x => x.name === call.symbol);
    if (refs.length !== 1 || (refs[0].info >>> 4) !== 1 || (refs[0].info & 15) !== 2)
      fail(`${call.symbol}: expected one global function reference`);
    if (refs[0].shndx !== 0) {
      if (refs[0].shndx >= elf.sections.length || (elf.sections[refs[0].shndx].flags & 4) === 0)
        fail(`${call.symbol}: resolved reference is not in an executable section`);
      const expectedThumbBit = call.targetMode === 'thumb' ? 1 : 0;
      if ((refs[0].value & 1) !== expectedThumbBit)
        fail(`${call.symbol}: resolved reference has the wrong ${call.targetMode} mode`);
    }
  }
  const bodies = new Map();
  for (const [index, f] of ownedSections) { const s = elf.sections[index]; bodies.set(f.name, elf.b.subarray(s.offset, s.offset + s.size)); }
  const configuredClasses = new Set(config.duplicateBodyClasses.map(c => [...c.members].sort().join('|')));
  const foundClasses = new Set();
  const names = [...expectedNames];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) if (bodies.get(names[i]).equals(bodies.get(names[j]))) foundClasses.add([names[i], names[j]].sort().join('|'));
  if (foundClasses.size !== configuredClasses.size || [...foundClasses].some(x => !configuredClasses.has(x))) fail(`duplicate body classes mismatch: ${[...foundClasses].join(', ')}`);
  disassemble(path, config, objdump);
}

function syntheticElf(sectionCount, executableSize = 0) {
  const count = sectionCount;
  const tableSize = count * 40;
  const b = Buffer.alloc(52 + tableSize + 1);
  b.write('\x7fELF', 0, 'binary');
  b[4] = 1; b[5] = 1; b[6] = 1;
  b.writeUInt16LE(1, 16); b.writeUInt16LE(40, 18); b.writeUInt32LE(1, 20);
  b.writeUInt32LE(52, 32); b.writeUInt16LE(52, 40); b.writeUInt16LE(40, 46);
  if (count >= 0xff00) { b.writeUInt16LE(0, 48); b.writeUInt32LE(count, 52 + 20); }
  else b.writeUInt16LE(count, 48);
  const shstr = count - 1;
  b.writeUInt16LE(shstr, 50);
  if (executableSize) {
    const exec = 52 + 40;
    b.writeUInt32LE(8, exec + 4); // SHT_NOBITS: no large payload allocation.
    b.writeUInt32LE(6, exec + 8); // SHF_ALLOC | SHF_EXECINSTR.
    b.writeUInt32LE(executableSize, exec + 20);
    b.writeUInt32LE(1, exec + 32);
  }
  const strings = 52 + shstr * 40;
  b.writeUInt32LE(3, strings + 4);
  b.writeUInt32LE(52 + tableSize, strings + 16);
  b.writeUInt32LE(1, strings + 20);
  b.writeUInt32LE(1, strings + 32);
  return b;
}

function parserSelfTest() {
  const dir = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-03-parser-'));
  try {
    const good = join(dir, 'good.o');
    writeFileSync(good, syntheticElf(MAX_SECTIONS));
    if (parseElf(good).sections.length !== MAX_SECTIONS) fail('extended section-count self-test failed');
    const hostile = [
      syntheticElf(MAX_SECTIONS + 1),
      syntheticElf(3, MAX_EXEC + 1),
      Buffer.alloc(MAX_FILE + 1),
      Buffer.from('not ELF'),
    ];
    let rejected = 0;
    for (let i = 0; i < hostile.length; i++) {
      const path = join(dir, `hostile-${i}.o`);
      writeFileSync(path, hostile[i]);
      try { parseElf(path); } catch { rejected++; }
    }
    if (rejected !== hostile.length) fail('hostile ELF parser self-test failed');
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function foreignCompositeSelfTest(objectPath, objdump, as, ld) {
  const dir = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-03-composite-'));
  try {
    const source = join(dir, 'foreign.S'), foreign = join(dir, 'foreign.o'), combined = join(dir, 'combined.o');
    const lines = [
      '.syntax unified', '.arch armv6k', '.arm',
      '.section .text.thumb_leaf03_foreign,"ax",%progbits',
      '.global thumb_leaf03_foreign', '.type thumb_leaf03_foreign,%function',
      'thumb_leaf03_foreign:', ' bl thumb_leaf03_undefined', ' bx lr',
      '.size thumb_leaf03_foreign,.-thumb_leaf03_foreign',
    ];
    for (let i = 0; i < 12050; i++) lines.push(`.section .thumb_leaf03_foreign.${i},"",%progbits`, `.byte ${i & 0xff}`);
    writeFileSync(source, `${lines.join('\n')}\n`);
    run(as, ['-march=armv6k', '-o', foreign, source]);
    run(ld, ['-r', '-o', combined, objectPath, foreign]);
    const parsed = parseElf(combined);
    if (parsed.sections.length < 12000) fail('high-section-count foreign composite self-test was ineffective');
    const section = parsed.sections.find(s => s.name === '.text.thumb_leaf03_foreign');
    if (!section || !parsed.relocs.some(r => r.target === section.index)) fail('foreign composite lacks its unrelated relocation');
    validateObject(combined, config, objdump);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function usage() { fail('usage: validate-thumb-leaf-helpers-03.mjs [source.S|object.o] [--object object.o] [--source-only] [--self-test|--self-test-only]'); }
const args = process.argv.slice(2); let objectPath = null, sourcePath = defaultSource, sourceOnly = false, selfTest = false, selfTestOnly = false, positional = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--object') { if (objectPath || i + 1 >= args.length) usage(); objectPath = resolve(args[++i]); }
  else if (args[i].startsWith('--object=')) { if (objectPath || args[i].length === 9) usage(); objectPath = resolve(args[i].slice(9)); }
  else if (args[i] === '--source-only') sourceOnly = true;
  else if (args[i] === '--self-test') selfTest = true;
  else if (args[i] === '--self-test-only') selfTestOnly = true;
  else if (args[i].startsWith('-') || positional) usage();
  else positional = resolve(args[i]);
}
if (positional) { if (extname(positional).toLowerCase() === '.o') objectPath = positional; else sourcePath = positional; }
if ((sourceOnly && objectPath) || (selfTestOnly && (sourceOnly || objectPath || positional))) usage();
const config = JSON.parse(readFileSync(configPath, 'utf8'));
checkConfig(config);
const source = readFileSync(sourcePath);
if (config.sourceSha256 && sha256(source) !== config.sourceSha256) fail(`${sourcePath}: source SHA-256 mismatch`);
if (selfTest || selfTestOnly) parserSelfTest();
if (selfTestOnly) { console.log('OK hostile ELF parser self-tests'); process.exit(0); }
if (!objectPath) {
  if (sourceOnly) { console.log(`OK ${config.functions.length} Thumb functions; source SHA-256 verified`); process.exit(0); }
  const dir = mkdtempSync(join(tmpdir(), 'thumb-leaf-helpers-03-'));
  try {
    objectPath = join(dir, 'thumb_leaf_helpers_03.o');
    const { as, objdump, ld } = tools();
    run(as, ['-march=armv6k', '-mthumb', '-o', objectPath, sourcePath]);
    validateObject(objectPath, config, objdump);
    if (selfTest) foreignCompositeSelfTest(objectPath, objdump, as, ld);
  } finally { rmSync(dir, { recursive: true, force: true }); }
} else {
  const { as, objdump, ld } = tools();
  validateObject(objectPath, config, objdump);
  if (selfTest) foreignCompositeSelfTest(objectPath, objdump, as, ld);
}
console.log(`OK ${config.functions.length} Thumb functions, ${config.totalBodySize} bytes, ${config.directCallCount} direct-call relocations${selfTest ? '; hostile 12k-section foreign composite passed' : ''}`);
