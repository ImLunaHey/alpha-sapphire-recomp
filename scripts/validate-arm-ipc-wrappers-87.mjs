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
const KNOWN_TOOL_PREFIX = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';
const CONFIG_SHA256 = 'c1d471fa474af426db1518b251ccd25889ce1d7ba59430ae88e9cc27b50bd387';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const configPath = path.join(root, 'config', 'arm-ipc-wrappers-87.json');
const configBytes = fs.readFileSync(configPath);
const config = JSON.parse(configBytes);

function fail(message) { throw new Error(`arm-ipc-wrappers-87: ${message}`); }

function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function normalizeSchedule(source) {
  return source.toString('utf8').split(/\r?\n/)
    .map(line => line.replace(/@.*$/, '').trim().replace(/\s+/g, ' '))
    .filter(Boolean).join('\n') + '\n';
}

function boundedRead(filename, description) {
  let st;
  try { st = fs.statSync(filename); } catch (error) { fail(`${description}: ${error.message}`); }
  if (!st.isFile()) fail(`${description} is not a regular file`);
  if (st.size > MAX_FILE) fail(`${description} exceeds the 64 MiB limit`);
  return fs.readFileSync(filename);
}

const configHash = crypto.createHash('sha256').update(configBytes).digest('hex');
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
    raw[i] = { index: i, headerOffset: p, nameOffset: u32(p), type: u32(p + 4), flags: u32(p + 8), addr: u32(p + 12), offset: u32(p + 16), size: u32(p + 20), link: u32(p + 24), info: u32(p + 28), align: u32(p + 32), entsize: u32(p + 36) };
    if (raw[i].size > MAX_EXEC) fail(`${filename}: section ${i} exceeds 16 MiB`);
    if (raw[i].type !== 8) checkedRange(raw[i].offset, raw[i].size, buffer.length, `section ${i}`);
    if (raw[i].type === 8 && (raw[i].flags & 4) !== 0) fail(`${filename}: executable NOBITS section`);
  }
  let shstr = shstrRaw;
  if (shstr === 0xffff) shstr = raw[0].link;
  if (shstr >= shnum || raw[shstr].type !== 3) fail(`${filename}: invalid section-name table`);
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
      const symbol = { index: i, table: table.index, fileOffset: p, name: cstring(strings, u32(p), 'symbol'), value: u32(p + 4), size: u32(p + 8), info: buffer[p + 12], other: buffer[p + 13], shndx: u16(p + 14) };
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
      relocations.push({ sectionIndex: relsec.info, fileOffset: p, offset: u32(p), type: info & 0xff, symbolIndex, symbol: syms[symbolIndex], addend: relsec.type === 4 ? buffer.readInt32LE(p + 8) : null });
    }
  }
  const definitions = new Map();
  for (const symbol of symbols) if (symbol.name && symbol.shndx !== 0 && (symbol.info >>> 4) !== 0) {
    if (definitions.has(symbol.name)) fail(`${filename}: duplicate global definition ${symbol.name}`);
    definitions.set(symbol.name, symbol);
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
  let bodyTotal = 0, adjacentTotal = 0, physicalSlots = 0;
  const selectedIndexes = new Set();
  const exactLayout = [
    ['func_0017F4A4', '.text.func_0017F4A4', 144, 224],
    ['func_0017FB04', '.text.func_0017FB04', 200, 224],
    ['func_0017FBE4', '.text.func_0017FBE4', 200, 776],
    ['func_0017FEEC', '.text.func_0017FEEC', 32, 204],
    ['func_0017FFB8', '.text.func_0017FFB8', 192, 196]
  ];
  if (config.functions.length !== exactLayout.length || config.functions.some((fn, index) =>
    fn.name !== exactLayout[index][0] || fn.section !== exactLayout[index][1] ||
    fn.size !== exactLayout[index][2] || fn.nextGlobalOffset !== exactLayout[index][3]))
    fail('configured function ownership boundaries are inconsistent');
  for (const fn of config.functions) {
    const matching = elf.byName.get(fn.section) ?? [];
    if (matching.length !== 1) fail(`expected exactly one ${fn.section} section`);
    const section = matching[0];
    selectedIndexes.add(section.index);
    const adjacent = Math.max(fn.size, ...fn.literals.map(literal => literal.offset + 4)) - fn.size;
    const expectedSectionSize = fn.size + adjacent;
    if (expectedSectionSize > fn.nextGlobalOffset) fail(`${fn.name}: owned material crosses the next global boundary`);
    if (section.type !== 1 || (section.flags & 6) !== 6 || section.addr !== 0 || section.align < 4 || section.size !== expectedSectionSize)
      fail(`${fn.section}: expected AX PROGBITS of ${expectedSectionSize} bytes aligned to 4`);
    const symbol = uniqueSymbol(elf, fn.name);
    if (symbol.shndx !== section.index || symbol.value !== 0 || symbol.size !== fn.size || (symbol.info >>> 4) !== 1 || (symbol.info & 15) !== 2)
      fail(`${fn.name}: incorrect global function symbol definition`);
    const unexpectedGlobals = elf.symbols.filter(candidate => candidate.shndx === section.index && (candidate.info >>> 4) !== 0 && candidate.name !== fn.name);
    if (unexpectedGlobals.length) fail(`${fn.section}: unexpected global symbol ${unexpectedGlobals[0].name}`);
    const mappings = elf.symbols.filter(candidate => candidate.shndx === section.index && /^\$[adt](?:\.|$)/.test(candidate.name));
    const armMappings = mappings.filter(candidate => /^\$a(?:\.|$)/.test(candidate.name));
    const dataMappings = mappings.filter(candidate => /^\$d(?:\.|$)/.test(candidate.name));
    const expectedMappings = fn.literals.length ? 2 : 1;
    if (armMappings.length !== 1 || armMappings[0].value !== 0 ||
        dataMappings.length !== (fn.literals.length ? 1 : 0) ||
        (dataMappings.length && dataMappings[0].value !== fn.size) || mappings.length !== expectedMappings)
      fail(`${fn.section}: incorrect ARM/data mapping states`);
    const refSection = reference.byName.get(fn.section)?.[0];
    if (!refSection || !sectionBytes(elf, section).equals(sectionBytes(reference, refSection)))
      fail(`${fn.name}: executable body or owned literal words differ from the normative schedule`);
    bodyTotal += fn.size;
    adjacentTotal += adjacent;
    physicalSlots += fn.literals.length;
  }
  if (bodyTotal !== config.totalBodySize || adjacentTotal !== config.totalAdjacentSize) fail('configured body/material totals are inconsistent');
  if (config.functions.length !== 5 || bodyTotal !== 768 || adjacentTotal !== 12 ||
      physicalSlots !== 3 || new Set(config.literalIdentities).size !== 2 ||
      new Set(config.reusedLiteralIdentities).size !== 2 || new Set(config.newLiteralIdentities).size !== 0)
    fail('literal slot or identity-class totals are inconsistent');
  const identityUnion = new Set([...config.reusedLiteralIdentities, ...config.newLiteralIdentities]);
  const newIdentities = new Set(config.newLiteralIdentities);
  if (identityUnion.size !== 2 || newIdentities.size !== 0 ||
      config.literalIdentities.some(name => !identityUnion.has(name)) ||
      config.cumulativePoolSlots !== 847 || config.cumulativePoolSlots - physicalSlots !== 844 ||
      config.cumulativePoolClasses !== 444 || config.cumulativePoolClasses - newIdentities.size !== 444)
    fail('literal equality classes or cumulative totals are inconsistent');

  const expectedRelocs = [];
  for (const fn of config.functions) {
    const section = elf.byName.get(fn.section)[0];
    for (const branch of fn.branches) expectedRelocs.push({ section: section.index, offset: branch.offset, type: relocationTypes[branch.kind], symbol: branch.symbol });
    for (const literal of fn.literals) expectedRelocs.push({ section: section.index, offset: literal.offset, type: relocationTypes.R_ARM_ABS32, symbol: literal.symbol });
  }
  const actualRelocs = elf.relocations.filter(relocation => selectedIndexes.has(relocation.sectionIndex));
  if (expectedRelocs.length !== 17 || config.functions.reduce((n, fn) => n + fn.branches.length, 0) !== 14)
    fail('configured relocation totals are inconsistent');
  const branchNames = new Set(config.functions.flatMap(fn => fn.branches.map(branch => branch.symbol)));
  const contractedBranches = new Set(config.branchIdentityContract.primaryEntries);
  const allContractedBranches = new Set([...contractedBranches, ...config.branchIdentityContract.secondaryEntries]);
  if (branchNames.size !== 10 || contractedBranches.size !== 9 ||
      allContractedBranches.size !== 10 || [...branchNames].some(name => !allContractedBranches.has(name)) ||
      [...allContractedBranches].some(name => !branchNames.has(name)) ||
      config.branchIdentityContract.secondaryEntries.length !== 1 ||
      config.branchIdentityContract.sharedClasses.length !== 0 ||
      config.branchIdentityContract.singletonClasses.length !== 10 ||
      config.branchIdentityContract.secondaryEntryRelations.length !== 1)
    fail('branch identity-class contract is inconsistent');
  if (actualRelocs.length !== expectedRelocs.length) fail(`selected sections contain ${actualRelocs.length} relocations; expected ${expectedRelocs.length}`);
  if (actualRelocs.some(relocation => relocation.addend !== null)) fail('selected sections must use exact REL relocation form');
  const actualKeys = actualRelocs.map(item => `${item.sectionIndex}:${item.offset}:${item.type}:${item.symbol.name}`).sort();
  const expectedKeys = expectedRelocs.map(item => `${item.section}:${item.offset}:${item.type}:${item.symbol}`).sort();
  if (actualKeys.some((value, index) => value !== expectedKeys[index])) fail('direct-transfer or literal relocation contract mismatch');

  const armNames = new Set(config.branchIdentityContract.armPrimaryEntries);
  const thumbNames = new Set(config.branchIdentityContract.thumbPrimaryEntries);
  if (armNames.size !== 7 || thumbNames.size !== 2 ||
      [...armNames, ...thumbNames].some(name => !contractedBranches.has(name)) ||
      [...armNames].some(name => thumbNames.has(name))) fail('primary destination mode partition is inconsistent');
  for (const fn of config.functions) {
    const section = elf.byName.get(fn.section)[0];
    const bytes = sectionBytes(elf, section);
    for (const branch of fn.branches) {
      const word = bytes.readUInt32LE(branch.offset);
      if (branch.mnemonic === 'bl' && (word >>> 24) !== 0xeb)
        fail(`${fn.name}+${branch.offset}: expected unconditional ARM bl`);
      if (branch.mnemonic === 'blx' && (word >>> 25) !== 0x7d)
        fail(`${fn.name}+${branch.offset}: expected ARM-to-Thumb blx`);
      if (branch.mnemonic === 'b' && (word >>> 24) !== 0xea)
        fail(`${fn.name}+${branch.offset}: expected unconditional ARM b`);
      if (branch.mnemonic === 'blx' ? !thumbNames.has(branch.symbol) :
          branch.mnemonic === 'bl' ? !armNames.has(branch.symbol) :
          !config.branchIdentityContract.secondaryEntries.includes(branch.symbol))
        fail(`${fn.name}+${branch.offset}: transfer mnemonic disagrees with destination mode`);
    }
  }

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
      const isThumb = thumbNames.has(name);
      const address = symbol.value & ~1;
      if (!section || (section.flags & 6) !== 6 || (symbol.info & 15) !== 2 ||
          (isThumb ? (symbol.value & 1) !== 1 || (address & 1) !== 0 : (symbol.value & 3) !== 0) ||
          address > section.size || symbol.size > section.size - address)
        fail(`${name}: invalid defined ${isThumb ? 'Thumb' : 'ARM'} branch-reference mode`);
      branchDefinitions.push(`${symbol.shndx}:${address}`);
    }
  }
  if (new Set(branchDefinitions).size !== branchDefinitions.length) fail('defined branch identities are not pairwise distinct');
  const relation = config.branchIdentityContract.secondaryEntryRelations[0];
  if (relation.symbol !== config.branchIdentityContract.secondaryEntries[0] || relation.ownerOffset !== 32 ||
      relation.bytesBeforeNextGlobal !== 44 || relation.owner !== 'func_001873D8' || relation.nextGlobal !== 'func_00187424')
    fail('secondary-entry relation metadata is inconsistent');
  const secondary = uniqueSymbol(elf, relation.symbol);
  if (secondary.shndx !== 0) {
    const owner = uniqueSymbol(elf, relation.owner);
    const nextGlobal = uniqueSymbol(elf, relation.nextGlobal);
    if (owner.shndx !== secondary.shndx || nextGlobal.shndx !== secondary.shndx ||
        (owner.info >>> 4) !== 1 || (owner.info & 15) !== 2 || (owner.value & 3) !== 0 ||
        (nextGlobal.info >>> 4) !== 1 || (nextGlobal.info & 15) !== 2 || (nextGlobal.value & 3) !== 0 ||
        secondary.value !== owner.value + relation.ownerOffset ||
        nextGlobal.value !== secondary.value + relation.bytesBeforeNextGlobal)
      fail('defined secondary entry does not satisfy its owner/next-global relation');
  }
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
  if (localBranches !== 19 || indirectCalls !== 1 || returns !== 4) fail(`control-flow shape mismatch (local=${localBranches}, indirect=${indirectCalls}, returns=${returns})`);
  const calls = actualRelocs.filter(r => r.type === 28).length;
  const jump24 = actualRelocs.filter(r => r.type === 29).length;
  const externalTails = actualRelocs.filter(r => r.type === 29 &&
    (sectionBytes(elf, elf.sections[r.sectionIndex]).readUInt32LE(r.offset) & 0x01000000) === 0).length;
  if (calls !== 13 || jump24 !== 1 || externalTails !== 1)
    fail(`external transfer shape mismatch (calls=${calls}, jump24=${jump24}, tails=${externalTails})`);
}

function resolveAssembler() {
  const candidates = [process.env.ARM_AS, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}as` : null, `${KNOWN_TOOL_PREFIX}as`, 'arm-none-eabi-as', 'arm-linux-gnueabi-as'].filter(Boolean);
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
    if (!probe.error && probe.status === 0) return candidate;
  }
  fail('no GNU ARM assembler found (set ARM_AS or CROSS_COMPILE)');
}

function resolveObjdump(assembler) {
  const sibling = assembler.endsWith('as') ? `${assembler.slice(0, -2)}objdump` : null;
  const candidates = [process.env.ARM_OBJDUMP, sibling, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}objdump` : null, `${KNOWN_TOOL_PREFIX}objdump`, 'arm-none-eabi-objdump', 'arm-linux-gnueabi-objdump'].filter(Boolean);
  for (const candidate of [...new Set(candidates)]) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
    if (!probe.error && probe.status === 0) return candidate;
  }
  fail('no GNU ARM objdump found (set ARM_OBJDUMP or CROSS_COMPILE)');
}

function resolveLinker(assembler) {
  const sibling = assembler.endsWith('as') ? `${assembler.slice(0, -2)}ld` : null;
  const candidates = [process.env.ARM_LD, sibling, process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}ld` : null, `${KNOWN_TOOL_PREFIX}ld`, 'arm-none-eabi-ld', 'arm-linux-gnueabi-ld'].filter(Boolean);
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
    if (++i >= process.argv.length || objectArg) fail('usage: validate-arm-ipc-wrappers-87.mjs [source] | --object object.o');
    objectArg = process.argv[i];
  } else if (arg === '--self-test') selfTest = true;
  else if (arg.startsWith('-') || sourceArg) fail('usage: validate-arm-ipc-wrappers-87.mjs [source] | --object object.o [--self-test]');
  else sourceArg = arg;
}
if (objectArg && sourceArg) fail('source and --object modes are mutually exclusive');

const canonicalSource = path.resolve(root, config.source);
if (config.source !== 'src/main/arm_ipc_wrappers_87.S' ||
    !(canonicalSource === root || canonicalSource.startsWith(`${root}${path.sep}`)))
  fail('configured source path is not the exact repository-contained batch source');
const canonicalBytes = boundedRead(canonicalSource, 'canonical source');
const realRoot = fs.realpathSync(root);
const realSource = fs.realpathSync(canonicalSource);
if (!(realSource === realRoot || realSource.startsWith(`${realRoot}${path.sep}`))) fail('canonical source resolves outside the repository');
if (/(?:^|\n)\s*\.(?:ascii|asciz|string|incbin)\b/i.test(canonicalBytes.toString('utf8')))
  fail('canonical source contains text-like or included material');
const canonicalHash = sha256(canonicalBytes);
if (canonicalHash !== config.sourceSha256) fail('canonical source SHA-256 does not match the config');
if (sha256(normalizeSchedule(canonicalBytes)) !== config.normalizedScheduleSha256) fail('normalized schedule SHA-256 does not match the config');
const assembler = resolveAssembler();
const objdump = resolveObjdump(assembler);
const linker = selfTest ? resolveLinker(assembler) : null;
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'arm-ipc-wrappers-87-'));
try {
  const referencePath = path.join(temporary, 'reference.o');
  assemble(assembler, canonicalSource, referencePath);
  const reference = parseElf(boundedRead(referencePath, 'reference object'), referencePath);
  const selectedReferenceSections = new Set(config.functions.map(fn => reference.byName.get(fn.section)?.[0]?.index));
  const executableReferenceSections = reference.sections.filter(section => (section.flags & 4) !== 0 && section.size !== 0);
  if (selectedReferenceSections.size !== 5 || executableReferenceSections.length !== 5 ||
      executableReferenceSections.some(section => !selectedReferenceSections.has(section.index)))
    fail('canonical source contains an unexpected executable section');
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
    let hostileCases = 0;
    const expectReject = (label, mutate) => {
      const bytes = Buffer.from(reference.buffer);
      mutate(bytes);
      let rejected = false;
      try { validateObject(parseElf(bytes, `hostile-${label}.o`), reference); }
      catch { rejected = true; }
      if (!rejected) fail(`hostile mutation was accepted: ${label}`);
      hostileCases++;
    };
    expectReject('ELF-magic', bytes => { bytes[0] ^= 0xff; });
    expectReject('section-count', bytes => { bytes.writeUInt16LE(MAX_SECTIONS + 1, 48); });
    const firstFn = config.functions[0];
    const firstSection = reference.byName.get(firstFn.section)[0];
    expectReject('body-instruction', bytes => { bytes.writeUInt32LE((bytes.readUInt32LE(firstSection.offset) ^ 1) >>> 0, firstSection.offset); });
    let localBranch = null;
    const relocated = new Set(reference.relocations.filter(r => r.sectionIndex === firstSection.index).map(r => r.offset));
    for (const fn of config.functions) {
      const section = reference.byName.get(fn.section)[0];
      for (let offset = 0; offset < fn.size; offset += 4) {
        const word = reference.buffer.readUInt32LE(section.offset + offset);
        if ((word & 0x0e000000) === 0x0a000000 && !relocated.has(offset)) { localBranch = { section, offset }; break; }
      }
      if (localBranch) break;
    }
    if (!localBranch) fail('self-test could not locate a local branch');
    expectReject('local-branch', bytes => {
      const p = localBranch.section.offset + localBranch.offset;
      bytes.writeUInt32LE((bytes.readUInt32LE(p) ^ 1) >>> 0, p);
    });
    let indirectCall = null;
    for (const fn of config.functions) {
      const section = reference.byName.get(fn.section)[0];
      for (let offset = 0; offset < fn.size; offset += 4) {
        if ((reference.buffer.readUInt32LE(section.offset + offset) & 0x0ffffff0) === 0x012fff30) {
          indirectCall = { section, offset };
          break;
        }
      }
      if (indirectCall) break;
    }
    if (!indirectCall) fail('self-test could not locate the indirect call');
    expectReject('indirect-call', bytes => {
      const p = indirectCall.section.offset + indirectCall.offset;
      bytes.writeUInt32LE((bytes.readUInt32LE(p) ^ 0x10) >>> 0, p);
    });
    const selectedIndexes = new Set(config.functions.map(fn => reference.byName.get(fn.section)[0].index));
    const selectedRelocations = reference.relocations.filter(r => selectedIndexes.has(r.sectionIndex));
    for (const relocation of selectedRelocations) {
      const family = relocation.type === 2 ? 'pool' : 'branch';
      expectReject(`${family}-reloc-offset-${relocation.sectionIndex}-${relocation.offset}`, bytes => {
        bytes.writeUInt32LE(relocation.offset ^ 4, relocation.fileOffset);
      });
      expectReject(`${family}-reloc-type-${relocation.sectionIndex}-${relocation.offset}`, bytes => {
        const info = bytes.readUInt32LE(relocation.fileOffset + 4);
        bytes.writeUInt32LE((info & 0xffffff00) | (relocation.type === 2 ? 28 : 2), relocation.fileOffset + 4);
      });
      expectReject(`${family}-reloc-symbol-${relocation.sectionIndex}-${relocation.offset}`, bytes => {
        bytes.writeUInt32LE(relocation.type, relocation.fileOffset + 4);
      });
    }
    const windowRelocations = selectedRelocations.filter(r => r.symbol.name === 'arm_duplicate_templates_19_byte_window_state');
    if (windowRelocations.length !== 2) fail('self-test expected two byte-window slots');
    expectReject('literal-identity-equality', bytes => {
      const relocation = windowRelocations[1];
      const replacement = selectedRelocations.find(r => r.symbol.name === 'ipc_controller_selector_offset_77');
      bytes.writeUInt32LE((replacement.symbolIndex << 8) | relocation.type, relocation.fileOffset + 4);
    });
    const poolFn = config.functions.find(fn => fn.literals.length);
    const poolSection = reference.byName.get(poolFn.section)[0];
    expectReject('text-like-pool-word', bytes => {
      bytes.write('TEXT', poolSection.offset + poolFn.size, 4, 'ascii');
    });
    expectReject('section-size', bytes => { bytes.writeUInt32LE(firstSection.size - 4, firstSection.headerOffset + 20); });
    const firstFunctionSymbol = reference.symbols.find(s => s.name === firstFn.name);
    expectReject('function-symbol', bytes => { bytes.writeUInt32LE(firstFunctionSymbol.size - 4, firstFunctionSymbol.fileOffset + 8); });
    const firstDataMapping = reference.symbols.find(s => s.shndx === poolSection.index && s.name === '$d');
    expectReject('mapping-symbol', bytes => { bytes.writeUInt32LE(poolFn.size - 4, firstDataMapping.fileOffset + 4); });
    expectReject('executable-NOBITS', bytes => { bytes.writeUInt32LE(8, firstSection.headerOffset + 4); });

    const foreignSource = path.join(temporary, 'foreign-12k.S');
    const foreignObject = path.join(temporary, 'foreign-12k.o');
    const compositePath = path.join(temporary, 'composite-12k.o');
    const lines = ['.syntax unified', '.arch armv6k', '.arm',
      '.section .text.foreign87,"ax",%progbits', '.global foreign_87',
      '.type foreign_87,%function', 'foreign_87:', 'bx lr', '.size foreign_87,.-foreign_87',
      '.balign 4', '.global func_001873D8', '.type func_001873D8,%function', 'func_001873D8:',
      '.space 32', '.global service_flag_apply_secondary_87', '.type service_flag_apply_secondary_87,%function',
      'service_flag_apply_secondary_87:', 'bx lr', '.space 40',
      '.global func_00187424', '.type func_00187424,%function', 'func_00187424:', 'bx lr'];
    const ownedNames = new Set(config.functions.map(fn => fn.name));
    for (const name of config.branchIdentityContract.primaryEntries.filter(name => !ownedNames.has(name))) {
      if (config.branchIdentityContract.thumbPrimaryEntries.includes(name))
        lines.push('.thumb', '.balign 2', `.global ${name}`, `.type ${name},%function`, `.thumb_func`, `${name}:`, 'bx lr', `.size ${name},.-${name}`, '.arm', '.balign 4');
      else
        lines.push(`.global ${name}`, `.type ${name},%function`, `${name}:`, 'bx lr', `.size ${name},.-${name}`);
    }
    lines.push('.section .data.refs87,"aw",%progbits');
    for (const name of config.literalIdentities) {
      lines.push(`.global ${name}`, `.type ${name},%object`, `${name}:`, '.word 0', `.size ${name},4`);
    }
    for (let index = 0; index < 12050; index++) {
      lines.push(`.section .foreign87.${index},"",%progbits`, `.byte ${index & 0xff}`);
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
    const expectCompositeReject = (label, mutate) => {
      const bytes = Buffer.from(composite.buffer);
      mutate(bytes);
      let rejected = false;
      try { validateObject(parseElf(bytes, `hostile-composite-${label}.o`), reference); }
      catch { rejected = true; }
      if (!rejected) fail(`hostile composite mutation was accepted: ${label}`);
      hostileCases++;
    };
    const secondarySymbol = uniqueSymbol(composite, 'service_flag_apply_secondary_87');
    expectCompositeReject('secondary-relation', bytes => {
      bytes.writeUInt32LE(secondarySymbol.value + 4, secondarySymbol.fileOffset + 4);
    });
    expectCompositeReject('secondary-mode', bytes => {
      bytes.writeUInt32LE(secondarySymbol.value | 1, secondarySymbol.fileOffset + 4);
    });
    const ownerSymbol = uniqueSymbol(composite, 'func_001873D8');
    const tailRelocation = composite.relocations.find(relocation => relocation.symbol.name === 'service_flag_apply_secondary_87');
    if (!tailRelocation || tailRelocation.type !== 29 || ownerSymbol.table !== tailRelocation.symbol.table)
      fail('self-test could not locate the secondary-entry tail relocation');
    expectCompositeReject('secondary-owner-substitution', bytes => {
      bytes.writeUInt32LE((ownerSymbol.index << 8) | tailRelocation.type, tailRelocation.fileOffset + 4);
    });
    const hostile = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--object', foreignObject],
      { encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024, env: process.env });
    if (hostile.error || hostile.status === 0) fail('12k-section hostile object was not rejected');
    hostileCases++;
    console.log(`arm-ipc-wrappers-87: ${hostileCases} deterministic hostile mutations rejected`);
  }
  console.log(`arm-ipc-wrappers-87: validation passed${selfTest ? ' (valid/hostile 12k-section self-test)' : ''}`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
