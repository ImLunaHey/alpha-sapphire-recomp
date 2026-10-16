#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCATIONS = 1_000_000;
const CONFIG_SHA256 = '008cc5b14267268e6440d49a988aab5033cbe40a85fabbd3a01e1028fd5bcdb0';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const configPath = path.join(root, 'config', 'arm-ipc-wrappers-85.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

function fail(message) {
  console.error(`arm-ipc-wrappers-85: ${message}`);
  process.exit(1);
}

function boundedRead(filename, description) {
  let st;
  try { st = fs.statSync(filename); } catch (error) { fail(`${description}: ${error.message}`); }
  if (!st.isFile()) fail(`${description} is not a regular file`);
  if (st.size > MAX_FILE) fail(`${description} exceeds the 64 MiB limit`);
  return fs.readFileSync(filename);
}

const configHash = crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex');
if (configHash !== CONFIG_SHA256) fail('public batch config metadata or digest drifted');

function checkedRange(offset, size, limit, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > limit || size > limit - offset)
    fail(`invalid ${what} range`);
}

function cstring(buffer, offset, what) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= buffer.length) fail(`invalid ${what} string offset`);
  const end = buffer.indexOf(0, offset);
  if (end < 0) fail(`unterminated ${what} string`);
  return buffer.toString('utf8', offset, end);
}

function parseElf(buffer, filename) {
  if (buffer.length < 52 || buffer[0] !== 0x7f || buffer.toString('ascii', 1, 4) !== 'ELF') fail(`${filename}: not an ELF file`);
  if (buffer[4] !== 1 || buffer[5] !== 1 || buffer[6] !== 1) fail(`${filename}: expected ELF32 little-endian version 1`);
  const u16 = offset => buffer.readUInt16LE(offset);
  const u32 = offset => buffer.readUInt32LE(offset);
  if (u16(16) !== 1 || u16(18) !== 40) fail(`${filename}: expected an ARM relocatable object`);
  const shoff = u32(32), shentsize = u16(46), shnumRaw = u16(48), shstrRaw = u16(50);
  if (shentsize < 40) fail(`${filename}: invalid section-header size`);
  let shnum = shnumRaw;
  if (shnum === 0) {
    checkedRange(shoff, shentsize, buffer.length, 'extended section header');
    shnum = u32(shoff + 20);
  }
  if (shnum === 0 || shnum > MAX_SECTIONS) fail(`${filename}: section count exceeds ${MAX_SECTIONS}`);
  checkedRange(shoff, shnum * shentsize, buffer.length, 'section-header table');
  const raw = new Array(shnum);
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    raw[i] = { index: i, nameOffset: u32(p), type: u32(p + 4), flags: u32(p + 8), addr: u32(p + 12), offset: u32(p + 16), size: u32(p + 20), link: u32(p + 24), info: u32(p + 28), align: u32(p + 32), entsize: u32(p + 36) };
    if (raw[i].type !== 8) checkedRange(raw[i].offset, raw[i].size, buffer.length, `section ${i}`);
  }
  let shstr = shstrRaw;
  if (shstr === 0xffff) shstr = raw[0].link;
  if (shstr >= shnum) fail(`${filename}: invalid section-name table`);
  const names = buffer.subarray(raw[shstr].offset, raw[shstr].offset + raw[shstr].size);
  const sections = raw.map(section => ({ ...section, name: cstring(names, section.nameOffset, 'section') }));
  const byName = new Map();
  for (const section of sections) {
    if (!byName.has(section.name)) byName.set(section.name, []);
    byName.get(section.name).push(section);
  }
  let execSize = 0;
  for (const section of sections) if ((section.flags & 4) !== 0) {
    execSize += section.size;
    if (execSize > MAX_EXEC) fail(`${filename}: executable content exceeds 16 MiB`);
  }

  const symbols = [];
  const symtabs = new Map();
  for (const table of sections) if (table.type === 2 || table.type === 11) {
    if (table.link >= sections.length || sections[table.link].type !== 3 || table.entsize < 16 || table.size % table.entsize !== 0)
      fail(`${filename}: malformed symbol table ${table.name}`);
    const stringsSection = sections[table.link];
    const strings = buffer.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size);
    const entries = [];
    const count = table.size / table.entsize;
    if (count > MAX_SYMBOLS || symbols.length > MAX_SYMBOLS - count) fail(`${filename}: unreasonable symbol count`);
    for (let i = 0; i < count; i++) {
      const p = table.offset + i * table.entsize;
      const symbol = { index: i, table: table.index, name: cstring(strings, u32(p), 'symbol'), value: u32(p + 4), size: u32(p + 8), info: buffer[p + 12], other: buffer[p + 13], shndx: u16(p + 14) };
      entries.push(symbol);
      symbols.push(symbol);
    }
    symtabs.set(table.index, entries);
  }

  const relocations = [];
  for (const relsec of sections) if (relsec.type === 9 || relsec.type === 4) {
    const entrySize = relsec.type === 9 ? 8 : 12;
    if (relsec.info >= sections.length || !symtabs.has(relsec.link) || relsec.entsize < entrySize || relsec.size % relsec.entsize !== 0)
      fail(`${filename}: malformed relocation section ${relsec.name}`);
    const syms = symtabs.get(relsec.link);
    for (let p = relsec.offset; p < relsec.offset + relsec.size; p += relsec.entsize) {
      const info = u32(p + 4), symbolIndex = info >>> 8;
      if (symbolIndex >= syms.length) fail(`${filename}: invalid relocation symbol index`);
      if (relocations.length >= MAX_RELOCATIONS) fail(`${filename}: unreasonable relocation count`);
      relocations.push({ sectionIndex: relsec.info, offset: u32(p), type: info & 0xff, symbol: syms[symbolIndex], addend: relsec.type === 4 ? buffer.readInt32LE(p + 8) : null });
    }
  }
  return { buffer, sections, byName, symbols, relocations };
}

const relocationTypes = { R_ARM_ABS32: 2, R_ARM_CALL: 28, R_ARM_JUMP24: 29 };

function uniqueSymbol(elf, name) {
  const found = elf.symbols.filter(symbol => symbol.name === name);
  if (found.length !== 1) fail(`expected exactly one symbol named ${name}, found ${found.length}`);
  return found[0];
}

function sectionBytes(elf, section) {
  return elf.buffer.subarray(section.offset, section.offset + section.size);
}

function validateObject(elf, reference) {
  let bodyTotal = 0, adjacentTotal = 0;
  const selectedIndexes = new Set();
  for (const fn of config.functions) {
    const matching = elf.byName.get(fn.section) ?? [];
    if (matching.length !== 1) fail(`expected exactly one ${fn.section} section`);
    const section = matching[0];
    selectedIndexes.add(section.index);
    const adjacent = Math.max(fn.size, ...fn.literals.map(literal => literal.offset + 4)) - fn.size;
    const expectedSectionSize = fn.size + adjacent;
    if (section.type !== 1 || (section.flags & 6) !== 6 || section.addr !== 0 || section.align < 4 || section.size !== expectedSectionSize)
      fail(`${fn.section}: expected AX PROGBITS of ${expectedSectionSize} bytes aligned to 4`);
    const symbol = uniqueSymbol(elf, fn.name);
    if (symbol.shndx !== section.index || symbol.value !== 0 || symbol.size !== fn.size || (symbol.info >>> 4) !== 1 || (symbol.info & 15) !== 2)
      fail(`${fn.name}: incorrect global function symbol definition`);
    const unexpectedGlobals = elf.symbols.filter(candidate => candidate.shndx === section.index && (candidate.info >>> 4) !== 0 && candidate.name !== fn.name);
    if (unexpectedGlobals.length) fail(`${fn.section}: unexpected global symbol ${unexpectedGlobals[0].name}`);
    const interiorDataMapping = elf.symbols.find(candidate => candidate.shndx === section.index && candidate.name === '$d' && candidate.value < fn.size);
    if (interiorDataMapping) fail(`${fn.section}: data mapping symbol appears inside executable body`);
    const refSection = reference.byName.get(fn.section)?.[0];
    if (!refSection || !sectionBytes(elf, section).equals(sectionBytes(reference, refSection)))
      fail(`${fn.name}: executable body or owned literal words differ from the normative schedule`);
    bodyTotal += fn.size;
    adjacentTotal += adjacent;
  }
  if (bodyTotal !== config.totalBodySize || adjacentTotal !== config.totalAdjacentSize) fail('configured body/material totals are inconsistent');

  const expectedRelocs = [];
  for (const fn of config.functions) {
    const section = elf.byName.get(fn.section)[0];
    for (const branch of fn.branches) expectedRelocs.push({ section: section.index, offset: branch.offset, type: relocationTypes[branch.kind], symbol: branch.symbol });
    for (const literal of fn.literals) expectedRelocs.push({ section: section.index, offset: literal.offset, type: relocationTypes.R_ARM_ABS32, symbol: literal.symbol });
  }
  const actualRelocs = elf.relocations.filter(relocation => selectedIndexes.has(relocation.sectionIndex));
  if (actualRelocs.length !== expectedRelocs.length) fail(`selected sections contain ${actualRelocs.length} relocations; expected ${expectedRelocs.length}`);
  if (actualRelocs.some(relocation => relocation.addend !== null)) fail('selected sections must use exact REL relocation form');
  const actualKeys = actualRelocs.map(item => `${item.sectionIndex}:${item.offset}:${item.type}:${item.symbol.name}`).sort();
  const expectedKeys = expectedRelocs.map(item => `${item.section}:${item.offset}:${item.type}:${item.symbol}`).sort();
  if (actualKeys.some((value, index) => value !== expectedKeys[index])) fail('direct-transfer or literal relocation contract mismatch');

  for (const relocation of elf.relocations) {
    if (selectedIndexes.has(relocation.sectionIndex) || ![28, 29].includes(relocation.type) || !selectedIndexes.has(relocation.symbol.shndx)) continue;
    const targetFn = config.functions.find(fn => elf.byName.get(fn.section)?.[0]?.index === relocation.symbol.shndx);
    if (!targetFn) continue;
    let encodedAddend = relocation.addend;
    if (encodedAddend === null) {
      const source = elf.sections[relocation.sectionIndex];
      checkedRange(relocation.offset, 4, source.size, 'branch relocation');
      let immediate = sectionBytes(elf, source).readUInt32LE(relocation.offset) & 0x00ffffff;
      if ((immediate & 0x00800000) !== 0) immediate -= 0x01000000;
      encodedAddend = immediate * 4;
    }
    const targetOffset = relocation.symbol.value + encodedAddend + 8;
    if (targetOffset > 0 && targetOffset < targetFn.size)
      fail(`${targetFn.name}: outside relocation targets executable interior +${targetOffset}`);
  }

  const branchDefinitions = [];
  for (const name of new Set([...config.branchIdentityContract.primaryEntries, ...config.branchIdentityContract.secondaryEntries])) {
    const symbol = uniqueSymbol(elf, name);
    if ((symbol.info >>> 4) !== 1 || symbol.other !== 0) fail(`${name}: expected a default-visible global branch identity`);
    if (symbol.shndx === 0) {
      if (symbol.value !== 0 || symbol.size !== 0 || ![0, 2].includes(symbol.info & 15))
        fail(`${name}: invalid undefined branch-reference metadata`);
    } else {
      const section = elf.sections[symbol.shndx];
      if (!section || (section.flags & 6) !== 6 || (symbol.info & 15) !== 2 ||
          (symbol.value & 3) !== 0 || symbol.value > section.size || symbol.size > section.size - symbol.value)
        fail(`${name}: invalid defined ARM branch-reference mode`);
      branchDefinitions.push(`${symbol.shndx}:${symbol.value}`);
    }
  }
  if (new Set(branchDefinitions).size !== branchDefinitions.length) fail('defined branch identities are not pairwise distinct');
  const literalDefinitions = [];
  for (const name of config.literalIdentities) {
    const symbol = uniqueSymbol(elf, name);
    if ((symbol.info >>> 4) !== 1 || symbol.other !== 0) fail(`${name}: expected a default-visible global literal identity`);
    if (symbol.shndx === 0) {
      if (symbol.value !== 0 || symbol.size !== 0 || ![0, 1].includes(symbol.info & 15))
        fail(`${name}: invalid undefined literal-reference metadata`);
    } else {
      const section = elf.sections[symbol.shndx];
      if (!section || (section.flags & 2) === 0 || ![0, 1].includes(symbol.info & 15) ||
          symbol.value > section.size || symbol.size > section.size - symbol.value)
        fail(`${name}: invalid defined literal-reference mode`);
      literalDefinitions.push(`${symbol.shndx}:${symbol.value}`);
    }
  }
  if (new Set(literalDefinitions).size !== literalDefinitions.length) fail('defined literal identities are not pairwise distinct');

  let localBranches = 0, indirectCalls = 0, returns = 0;
  for (const fn of config.functions) {
    const section = elf.byName.get(fn.section)[0];
    const bytes = sectionBytes(elf, section);
    const relocAt = new Set(actualRelocs.filter(r => r.sectionIndex === section.index && (r.type === 28 || r.type === 29)).map(r => r.offset));
    for (let offset = 0; offset < fn.size; offset += 4) {
      const word = bytes.readUInt32LE(offset);
      if ((word & 0x0e000000) === 0x0a000000 && !relocAt.has(offset)) {
        localBranches++;
        let displacement = word & 0x00ffffff;
        if (displacement & 0x00800000) displacement -= 0x01000000;
        const target = offset + 8 + displacement * 4;
        if (target < 0 || target >= fn.size || (target & 3) !== 0) fail(`${fn.name}+${offset}: local branch escapes its executable body`);
      }
      if ((word & 0x0ffffff0) === 0x012fff30) indirectCalls++;
      if ((word & 0x0fffffff) === 0x012fff1e || ((word & 0x0e100000) === 0x08100000 && (word & 0x00008000) !== 0 && (word & 0x000f0000) === 0x000d0000)) returns++;
    }
    for (const literal of fn.literals) for (const loadOffset of literal.loadOffsets) {
      const word = bytes.readUInt32LE(loadOffset);
      if ((word & 0x0f7f0000) !== 0x051f0000) fail(`${fn.name}+${loadOffset}: expected a PC-relative literal load`);
      const delta = word & 0xfff;
      const target = loadOffset + 8 + ((word & 0x00800000) ? delta : -delta);
      if (target !== literal.offset) fail(`${fn.name}+${loadOffset}: literal load does not reference its declared slot`);
    }
  }
  if (localBranches !== 14 || indirectCalls !== 0 || returns !== 5) fail(`control-flow shape mismatch (local=${localBranches}, indirect=${indirectCalls}, returns=${returns})`);
  const calls = actualRelocs.filter(r => r.type === 28).length;
  const tails = actualRelocs.filter(r => r.type === 29).length;
  if (calls !== 8 || tails !== 3) fail(`external transfer shape mismatch (calls=${calls}, jump24=${tails})`);
}

function resolveAssembler() {
  const candidates = [process.env.ARM_AS, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : null, 'arm-none-eabi-as', 'arm-linux-gnueabi-as'].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
    if (!probe.error && probe.status === 0) return candidate;
  }
  fail('no GNU ARM assembler found (set ARM_AS or CROSS_COMPILE)');
}

function resolveObjdump(assembler) {
  const sibling = assembler.endsWith('as') ? `${assembler.slice(0, -2)}objdump` : null;
  const candidates = [process.env.ARM_OBJDUMP, sibling, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}objdump` : null, 'arm-none-eabi-objdump', 'arm-linux-gnueabi-objdump'].filter(Boolean);
  for (const candidate of [...new Set(candidates)]) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
    if (!probe.error && probe.status === 0) return candidate;
  }
  fail('no GNU ARM objdump found (set ARM_OBJDUMP or CROSS_COMPILE)');
}

function resolveLinker(assembler) {
  const sibling = assembler.endsWith('as') ? `${assembler.slice(0, -2)}ld` : null;
  const candidates = [process.env.ARM_LD, sibling, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}ld` : null, 'arm-none-eabi-ld', 'arm-linux-gnueabi-ld'].filter(Boolean);
  for (const candidate of [...new Set(candidates)]) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
    if (!probe.error && probe.status === 0) return candidate;
  }
  fail('no GNU ARM linker found (set ARM_LD or CROSS_COMPILE)');
}

function validateScopedDisassembly(objdump, filename) {
  for (const fn of config.functions) {
    const run = spawnSync(objdump, ['-d', '-j', fn.section, filename], { encoding: 'utf8', timeout: 10000, maxBuffer: 4 * 1024 * 1024 });
    if (run.error) fail(`objdump failed: ${run.error.message}`);
    if (run.status !== 0) fail(`objdump rejected ${fn.section}: ${(run.stderr || run.stdout).trim()}`);
    let instructions = 0;
    for (const line of run.stdout.split(/\r?\n/)) {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+/);
      if (match && Number.parseInt(match[1], 16) < fn.size) instructions++;
    }
    if (instructions !== fn.size / 4) fail(`${fn.section}: scoped disassembly contains ${instructions} body instructions; expected ${fn.size / 4}`);
  }
}

function assemble(assembler, source, output) {
  const run = spawnSync(assembler, ['-o', output, source], { encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024 });
  if (run.error) fail(`assembler failed: ${run.error.message}`);
  if (run.status !== 0) fail(`assembler rejected ${source}: ${(run.stderr || run.stdout).trim()}`);
  boundedRead(output, 'assembled object');
}

let objectArg = null;
let sourceArg = null;
let selfTest = false;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--object') {
    if (++i >= process.argv.length || objectArg) fail('usage: validate-arm-ipc-wrappers-85.mjs [source] | --object object.o');
    objectArg = process.argv[i];
  } else if (arg === '--self-test') selfTest = true;
  else if (arg.startsWith('-') || sourceArg) fail('usage: validate-arm-ipc-wrappers-85.mjs [source] | --object object.o [--self-test]');
  else sourceArg = arg;
}
if (objectArg && sourceArg) fail('source and --object modes are mutually exclusive');

const canonicalSource = path.resolve(root, config.source);
const canonicalBytes = boundedRead(canonicalSource, 'canonical source');
const canonicalHash = crypto.createHash('sha256').update(canonicalBytes).digest('hex');
if (canonicalHash !== config.sourceSha256 || canonicalHash !== config.normalizedScheduleSha256) fail('canonical source SHA-256 does not match the config');
const assembler = resolveAssembler();
const objdump = resolveObjdump(assembler);
const linker = selfTest ? resolveLinker(assembler) : null;
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'arm-ipc-wrappers-85-'));
try {
  const referencePath = path.join(temporary, 'reference.o');
  assemble(assembler, canonicalSource, referencePath);
  const reference = parseElf(boundedRead(referencePath, 'reference object'), referencePath);
  let candidate, candidatePath;
  if (objectArg) {
    candidatePath = path.resolve(objectArg);
    candidate = parseElf(boundedRead(candidatePath, 'candidate object'), objectArg);
  }
  else {
    const requestedSource = path.resolve(sourceArg ?? canonicalSource);
    const requestedBytes = boundedRead(requestedSource, 'source');
    const requestedHash = crypto.createHash('sha256').update(requestedBytes).digest('hex');
    if (requestedHash !== config.sourceSha256) fail('source SHA-256 does not match the normative schedule');
    candidatePath = path.join(temporary, 'candidate.o');
    assemble(assembler, requestedSource, candidatePath);
    candidate = parseElf(boundedRead(candidatePath, 'candidate object'), candidatePath);
  }
  validateScopedDisassembly(objdump, candidatePath);
  validateObject(candidate, reference);
  if (selfTest) {
    const foreignSource = path.join(temporary, 'foreign-12k.S');
    const foreignObject = path.join(temporary, 'foreign-12k.o');
    const compositePath = path.join(temporary, 'composite-12k.o');
    const lines = ['.syntax unified', '.arch armv6k', '.arm',
      '.section .text.foreign85,"ax",%progbits', '.global foreign_85',
      '.type foreign_85,%function', 'foreign_85:', 'bx lr', '.size foreign_85,.-foreign_85'];
    for (const name of [...config.branchIdentityContract.secondaryEntries,
      ...config.branchIdentityContract.primaryEntries]) {
      lines.push(`.global ${name}`, `.type ${name},%function`, `${name}:`, 'bx lr',
        `.size ${name},.-${name}`);
    }
    lines.push('.section .data.refs85,"aw",%progbits');
    for (const name of config.literalIdentities) {
      lines.push(`.global ${name}`, `.type ${name},%object`, `${name}:`, '.word 0', `.size ${name},4`);
    }
    for (let index = 0; index < 12050; index++) {
      lines.push(`.section .foreign85.${index},"",%progbits`, `.byte ${index & 0xff}`);
    }
    fs.writeFileSync(foreignSource, `${lines.join('\n')}\n`);
    assemble(assembler, foreignSource, foreignObject);
    const foreign = parseElf(boundedRead(foreignObject, '12k-section foreign object'), foreignObject);
    if (foreign.sections.length < 12000) fail('12k-section foreign-object exercise was ineffective');
    const link = spawnSync(linker, ['-r', '-o', compositePath, foreignObject, referencePath],
      { encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024 });
    if (link.error || link.status !== 0) fail(`12k-section composite link failed: ${link.error?.message ?? (link.stderr || link.stdout).trim()}`);
    const composite = parseElf(boundedRead(compositePath, '12k-section valid composite'), compositePath);
    if (composite.sections.length < 12000) fail('12k-section valid-composite exercise was ineffective');
    validateScopedDisassembly(objdump, compositePath);
    validateObject(composite, reference);
    const hostile = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--object', foreignObject],
      { encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024, env: process.env });
    if (hostile.error || hostile.status === 0) fail('12k-section hostile object was not rejected');
  }
  console.log(`arm-ipc-wrappers-85: validation passed${selfTest ? ' (valid/hostile 12k-section self-test)' : ''}`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
