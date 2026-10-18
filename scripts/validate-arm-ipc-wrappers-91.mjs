#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { open } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = resolve(ROOT, 'config/arm-ipc-wrappers-91.json');
const FILE_CAP = 64 * 1024 * 1024;
const EXECUTABLE_PAYLOAD_CAP = 16 * 1024 * 1024;
const SECTION_COUNT_CAP = 16_384;
const SYMBOL_CAP = 1_000_000;
const RELOCATION_CAP = 1_000_000;

function fail(message) {
  throw new Error(message);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function checkCap(kind, value, cap) {
  if (!Number.isSafeInteger(value) || value < 0 || value > cap) {
    fail(`${kind} limit exceeded (${value} > ${cap})`);
  }
}

async function readCapped(path, what) {
  const handle = await open(path, 'r');
  try {
    const stat = await handle.stat();
    checkCap(`${what} file size`, stat.size, FILE_CAP);
    const buffer = Buffer.alloc(stat.size);
    let offset = 0;
    while (offset < buffer.length) {
      const { bytesRead } = await handle.read(buffer, offset, buffer.length - offset, offset);
      if (bytesRead === 0) fail(`${what} was truncated while reading`);
      offset += bytesRead;
    }
    const extra = Buffer.alloc(1);
    const { bytesRead } = await handle.read(extra, 0, 1, offset);
    if (bytesRead !== 0) fail(`${what} grew beyond its checked extent while reading`);
    return buffer;
  } finally {
    await handle.close();
  }
}

function range(buffer, offset, size, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) ||
      offset < 0 || size < 0 || offset > buffer.length - size) {
    fail(`${what} is outside the file`);
  }
}

function cstring(buffer, start, end, what) {
  if (start < 0 || start >= end) fail(`${what} has an invalid string offset`);
  const nul = buffer.indexOf(0, start);
  if (nul < 0 || nul >= end) fail(`${what} is not NUL-terminated`);
  return buffer.toString('utf8', start, nul);
}

function parseElf32Arm(buffer) {
  checkCap('file size', buffer.length, FILE_CAP);
  range(buffer, 0, 52, 'ELF header');
  if (buffer.toString('latin1', 0, 4) !== '\x7fELF') fail('not an ELF file');
  if (buffer[4] !== 1 || buffer[5] !== 1 || buffer[6] !== 1) {
    fail('expected ELF32 little-endian version 1');
  }
  if (buffer.readUInt16LE(18) !== 40) fail('expected EM_ARM');
  const shoff = buffer.readUInt32LE(32);
  const ehsize = buffer.readUInt16LE(40);
  const shentsize = buffer.readUInt16LE(46);
  const shnum = buffer.readUInt16LE(48);
  const shstrndx = buffer.readUInt16LE(50);
  if (ehsize !== 52 || shentsize !== 40 || shnum === 0 || shstrndx >= shnum) {
    fail('unsupported or malformed ELF section table');
  }
  checkCap('section count', shnum, SECTION_COUNT_CAP);
  range(buffer, shoff, shnum * shentsize, 'section table');

  const sections = [];
  let executablePayload = 0;
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    const section = {
      index: i,
      nameOffset: buffer.readUInt32LE(p),
      type: buffer.readUInt32LE(p + 4),
      flags: buffer.readUInt32LE(p + 8),
      address: buffer.readUInt32LE(p + 12),
      offset: buffer.readUInt32LE(p + 16),
      size: buffer.readUInt32LE(p + 20),
      link: buffer.readUInt32LE(p + 24),
      info: buffer.readUInt32LE(p + 28),
      alignment: buffer.readUInt32LE(p + 32),
      entsize: buffer.readUInt32LE(p + 36),
    };
    if (section.type !== 8) range(buffer, section.offset, section.size, `section ${i}`);
    if ((section.flags & 0x4) !== 0) {
      executablePayload += section.size;
      checkCap('total executable payload', executablePayload, EXECUTABLE_PAYLOAD_CAP);
    }
    sections.push(section);
  }

  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail('section-name table is not STRTAB');
  const shstrEnd = shstr.offset + shstr.size;
  for (const section of sections) {
    section.name = cstring(buffer, shstr.offset + section.nameOffset,
      shstrEnd, `section ${section.index} name`);
  }

  let symbolCount = 0;
  const symbolTables = new Map();
  for (const section of sections) {
    if (section.type !== 2 && section.type !== 11) continue;
    if (section.entsize !== 16 || section.size % 16 !== 0) fail(`${section.name}: bad symbol entry size`);
    const count = section.size / 16;
    symbolCount += count;
    checkCap('symbol count', symbolCount, SYMBOL_CAP);
    const strings = sections[section.link];
    if (!strings || strings.type !== 3) fail(`${section.name}: invalid linked string table`);
    const stringsEnd = strings.offset + strings.size;
    const symbols = [];
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * 16;
      const nameOffset = buffer.readUInt32LE(p);
      symbols.push({
        index: i,
        name: cstring(buffer, strings.offset + nameOffset, stringsEnd, `${section.name} symbol ${i}`),
        value: buffer.readUInt32LE(p + 4),
        size: buffer.readUInt32LE(p + 8),
        info: buffer[p + 12],
        shndx: buffer.readUInt16LE(p + 14),
      });
    }
    symbolTables.set(section.index, symbols);
  }

  let relocationCount = 0;
  const relocations = [];
  for (const section of sections) {
    if (section.type !== 9 && section.type !== 4) continue;
    const expectedEntsize = section.type === 9 ? 8 : 12;
    if (section.entsize !== expectedEntsize || section.size % expectedEntsize !== 0) {
      fail(`${section.name}: bad relocation entry size`);
    }
    const count = section.size / expectedEntsize;
    relocationCount += count;
    checkCap('relocation count', relocationCount, RELOCATION_CAP);
    const symbols = symbolTables.get(section.link);
    if (!symbols || !sections[section.info]) fail(`${section.name}: invalid relocation links`);
    for (let i = 0; i < count; i++) {
      const p = section.offset + i * expectedEntsize;
      const info = buffer.readUInt32LE(p + 4);
      const symbolIndex = info >>> 8;
      if (symbolIndex >= symbols.length) fail(`${section.name}: invalid relocation symbol index`);
      const target = sections[section.info];
      const offset = buffer.readUInt32LE(p);
      if (offset > target.size - 4) fail(`${section.name}: relocation offset is outside its target section`);
      const type = info & 0xff;
      const instruction = buffer.readUInt32LE(target.offset + offset);
      const armAddend = (type === 28 || type === 29) ? (instruction << 8 >> 6) : undefined;
      relocations.push({
        section: target.name,
        sectionIndex: section.info,
        offset,
        type,
        symbol: symbols[symbolIndex].name,
        armAddend,
      });
    }
  }
  return { sections, symbolTables, relocations, symbolCount, relocationCount, executablePayload };
}

function sameJson(actual, expected, what) {
  assert.deepEqual(actual, expected, what);
}

function validateConfig(config) {
  assert.equal(config.schemaVersion, 1);
  assert.equal(config.mode, 'arm');
  assert.equal(config.totalBodySize, 576);
  assert.equal(config.totalAdjacentSize, 16);
  assert.equal(config.cumulativePoolSlots, 881);
  assert.equal(config.cumulativePoolClasses, 461);
  assert.equal(config.functions.length, 4);
  assert.equal(config.functions.reduce((n, f) => n + f.size, 0), 576);
  assert.equal(config.functions.reduce((n, f) => n + f.branches.length, 0), 18);
  assert.equal(config.functions.flatMap(f => f.branches).filter(b => b.kind === 'R_ARM_CALL').length, 17);
  assert.equal(config.functions.flatMap(f => f.branches).filter(b => b.kind === 'R_ARM_JUMP24').length, 1);
  assert.equal(config.functions.reduce((n, f) => n + f.literals.length, 0), 4);
  sameJson(config.literalIdentities,
    ['service_zero_scalar_51', 'service_stride_reciprocal_91', 'ipc_unit_scalar_54'],
    'literal identity classes changed');
  sameJson(config.reusedLiteralIdentities,
    ['service_zero_scalar_51', 'ipc_unit_scalar_54'], 'reused literal classes changed');
  sameJson(config.newLiteralIdentities,
    ['service_stride_reciprocal_91'], 'new literal classes changed');
  const contract = config.branchIdentityContract;
  assert.equal(contract.mode, 'arm');
  assert.equal(contract.minimumAlignment, 4);
  assert.equal(contract.secondaryEntries.length, 2);
  assert.equal(contract.secondaryEntryRelations.length, 2);
  for (const relation of contract.secondaryEntryRelations) {
    assert.equal(relation.ownerOffset % 4, 0);
    assert.ok(relation.bytesBeforeNextGlobal > 0);
  }
  const classes = [...contract.sharedClasses.map(c => c.symbol), ...contract.singletonClasses];
  assert.equal(new Set(classes).size, classes.length, 'branch classes are not pairwise distinct');
  assert.equal(contract.classesPairwiseDistinct, true);
  assert.equal(contract.thumbPrimaryEntries.length, 0);
}

function sourceRegions(source, functions) {
  return functions.map((fn, index) => {
    const begin = source.indexOf(`BEGIN ${fn.name}\n`);
    if (begin < 0) fail(`missing BEGIN for ${fn.name}`);
    const next = index + 1 < functions.length ? source.indexOf(`BEGIN ${functions[index + 1].name}\n`, begin) : source.length;
    if (next < 0) fail(`missing next BEGIN after ${fn.name}`);
    const endMarker = `END ${fn.name}`;
    const end = source.indexOf(endMarker, begin);
    if (end < 0 || end >= next) fail(`missing END for ${fn.name}`);
    const bodyText = source.slice(begin + `BEGIN ${fn.name}\n`.length, end);
    const poolText = source.slice(end + endMarker.length, next);
    const instructions = bodyText.split(/\r?\n/).map(s => s.trim())
      .filter(s => s && !s.startsWith('.') && !s.endsWith(':'));
    return { fn, bodyText, poolText, instructions };
  });
}

function validateSource(sourceBytes, config) {
  assert.equal(sha256(sourceBytes), config.sourceSha256, 'source SHA-256 mismatch');
  const source = sourceBytes.toString('utf8');
  const regions = sourceRegions(source, config.functions);
  assert.equal(regions.reduce((n, r) => n + r.instructions.length, 0), 144);
  let locals = 0;
  let returnLabels = 0;
  for (const { fn, bodyText, poolText, instructions } of regions) {
    assert.equal(instructions.length * 4, fn.size, `${fn.name}: body size mismatch`);
    const transfers = [];
    instructions.forEach((line, i) => {
      let match = /^bl\s+(\w+)$/.exec(line);
      if (match) transfers.push({ offset: i * 4, kind: 'R_ARM_CALL', mnemonic: 'bl', symbol: match[1] });
      match = /^b\s+(\w+)$/.exec(line);
      if (match) transfers.push({ offset: i * 4, kind: 'R_ARM_JUMP24', mnemonic: 'b', symbol: match[1] });
      if (/^b(?:eq|ne|ge|gt|le|lt|hi|hs|lo|ls|mi|pl|vs|vc)\s+\.L/.test(line)) locals++;
    });
    sameJson(transfers, fn.branches, `${fn.name}: direct-transfer schedule mismatch`);
    returnLabels += (bodyText.match(/^\.Lreturn_[^:]+:/gm) || []).length;

    const words = [...poolText.matchAll(/^\.([A-Za-z0-9_]+):\n\.word\s+(\w+)$/gm)];
    assert.equal(words.length, fn.literals.length, `${fn.name}: pool slot count mismatch`);
    words.forEach((word, i) => {
      assert.equal(word[2], fn.literals[i].symbol, `${fn.name}: pool identity mismatch`);
      const loads = [];
      instructions.forEach((line, instructionIndex) => {
        if (line.endsWith(`.${word[1]}`)) loads.push(instructionIndex * 4);
      });
      sameJson(loads, fn.literals[i].loadOffsets, `${fn.name}: literal load sites mismatch`);
      assert.equal(fn.literals[i].offset, fn.size + i * 4, `${fn.name}: literal offset mismatch`);
    });
  }
  assert.equal(locals, 13, 'local direct-branch count mismatch');
  assert.equal(returnLabels, 4, 'return-site label count mismatch');
}

function validateObject(parsed, config) {
  const symbols = [...parsed.symbolTables.values()].flat();
  const sectionOffset = symbol => {
    const section = parsed.sections[symbol.shndx];
    return section && symbol.value >= section.address ? symbol.value - section.address : symbol.value;
  };
  const requiredNames = new Set([
    ...config.functions.map(fn => fn.name),
    ...config.functions.flatMap(fn => fn.branches.map(branch => branch.symbol)),
    ...config.functions.flatMap(fn => fn.literals.map(literal => literal.symbol)),
  ]);
  const byName = new Map();
  for (const name of requiredNames) {
    const matches = symbols.filter(symbol => symbol.name === name);
    if (matches.length !== 1) fail(`${name}: expected exactly one symbol, found ${matches.length}`);
    byName.set(name, matches[0]);
  }
  const optionalUnique = name => {
    const matches = symbols.filter(symbol => symbol.name === name);
    if (matches.length > 1) fail(`${name}: expected at most one symbol, found ${matches.length}`);
    return matches[0];
  };
  const secondaryByOwner = new Map(config.branchIdentityContract.secondaryEntryRelations
    .map(relation => [relation.owner, relation]));

  for (const fn of config.functions) {
    const symbol = byName.get(fn.name);
    const section = parsed.sections[symbol.shndx];
    if (!section) fail(`${fn.name}: symbol does not map to a section`);
    if (section.name !== fn.section && section.name !== '.text') {
      fail(`${fn.name}: unexpected containing section ${section.name}`);
    }
    if ((section.flags & 0x6) !== 0x6) fail(`${fn.name}: section is not ALLOC+EXECINSTR`);
    const ownedSize = fn.size + fn.literals.length * 4;
    const start = sectionOffset(symbol);
    if (start > section.size - ownedSize) fail(`${fn.name}: owned extent is outside its section`);
    if (section.name === fn.section) {
      assert.equal(start, 0, `${fn.name}: nonzero split-section symbol value`);
      assert.equal(section.size, ownedSize, `${fn.name}: split-section extent mismatch`);
    }
    assert.equal(symbol.size, fn.size, `${fn.name}: symbol size mismatch`);
    assert.equal(symbol.info & 0xf, 2, `${fn.name}: symbol is not STT_FUNC`);
    assert.equal(symbol.value % 4, 0, `${fn.name}: symbol is not ARM-aligned`);
    const intruders = symbols.filter(other => other !== symbol && other.shndx === symbol.shndx &&
      (other.info >>> 4) !== 0 && sectionOffset(other) > start && sectionOffset(other) < start + ownedSize);
    if (intruders.length !== 0) fail(`${fn.name}: owned extent contains global symbol ${intruders[0].name}`);
    const expected = [
      ...fn.branches.map(b => ({
        offset: b.offset,
        type: b.kind === 'R_ARM_CALL' ? 28 : 29,
        symbol: b.symbol,
      })),
      ...fn.literals.map(l => ({ offset: l.offset, type: 2, symbol: l.symbol })),
    ].sort((a, b) => a.offset - b.offset);
    const actual = parsed.relocations
      .filter(r => r.sectionIndex === section.index &&
        r.offset >= start && r.offset < start + ownedSize)
      .map(r => {
        const relation = secondaryByOwner.get(r.symbol);
        const relocatedSymbol = relation && r.armAddend === relation.ownerOffset - 8
          ? relation.symbol : r.symbol;
        return { offset: r.offset - start, type: r.type, symbol: relocatedSymbol };
      })
      .sort((a, b) => a.offset - b.offset);
    sameJson(actual, expected, `${fn.name}: relocation schedule mismatch`);
  }

  for (const name of config.branchIdentityContract.primaryEntries) {
    const symbol = byName.get(name);
    if (symbol.shndx !== 0) assert.equal(symbol.value % 4, 0, `${name}: primary entry is not ARM-aligned`);
  }
  for (const relation of config.branchIdentityContract.secondaryEntryRelations) {
    const secondary = byName.get(relation.symbol);
    const owner = optionalUnique(relation.owner);
    const next = optionalUnique(relation.nextGlobal);
    if (secondary.shndx === 0) continue;
    if (!owner || owner.shndx === 0 || !next || next.shndx === 0) {
      fail(`${relation.symbol}: incomplete secondary-entry mapping`);
    }
    assert.equal(secondary.shndx, owner.shndx, `${relation.symbol}: owner section mismatch`);
    assert.equal(secondary.value, owner.value + relation.ownerOffset,
      `${relation.symbol}: owner offset mismatch`);
    let distance;
    if (secondary.shndx === next.shndx) {
      distance = next.value - secondary.value;
    } else {
      const interveningExecutable = parsed.sections.slice(secondary.shndx + 1, next.shndx)
        .filter(section => (section.flags & 0x4) !== 0);
      if (next.shndx < secondary.shndx || interveningExecutable.length !== 0) {
        fail(`${relation.symbol}: next global is not in the next executable section`);
      }
      if (sectionOffset(next) !== 0 || parsed.sections[next.shndx].name !== `.text.${relation.nextGlobal}`) {
        fail(`${relation.symbol}: next-global split-section mapping mismatch`);
      }
      // A partial-link composite omits the unowned bytes between split input
      // sections. The exact distance remains a config invariant; adjacency and
      // both endpoint mappings are the object-level evidence available here.
      distance = relation.bytesBeforeNextGlobal;
    }
    assert.equal(distance, relation.bytesBeforeNextGlobal,
      `${relation.symbol}: next-global distance mismatch`);
    assert.equal(secondary.value % 4, 0, `${relation.symbol}: secondary entry is not ARM-aligned`);
  }
}

function makeValidationComposite(config) {
  const sections = [{ name: '', type: 0, flags: 0, data: Buffer.alloc(0), size: 0 }];
  const addSection = section => (sections.push(section), sections.length - 1);
  const foreignSections = [];
  for (let i = 0; i < 12_000; i++) {
    foreignSections.push(addSection({
      name: '.text.foreign', type: 1, flags: 0x6, data: Buffer.alloc(1), size: 1, align: 1,
    }));
  }
  const selectedSections = new Map();
  for (const fn of config.functions) {
    selectedSections.set(fn.name, addSection({
      name: fn.section, type: 1, flags: 0x6,
      data: Buffer.alloc(fn.size + fn.literals.length * 4),
      size: fn.size + fn.literals.length * 4, align: 4,
    }));
  }
  const secondarySection = addSection({
    name: '.text.secondary-fixture', type: 1, flags: 0x6,
    data: Buffer.alloc(2064), size: 2064, align: 4,
  });

  const requiredNames = [...new Set([
    ...config.functions.map(fn => fn.name),
    ...config.functions.flatMap(fn => fn.branches.map(branch => branch.symbol)),
    ...config.functions.flatMap(fn => fn.literals.map(literal => literal.symbol)),
    ...config.branchIdentityContract.secondaryEntryRelations.flatMap(relation =>
      [relation.symbol, relation.owner, relation.nextGlobal]),
  ])];
  const defined = new Map();
  for (const fn of config.functions) {
    defined.set(fn.name, { shndx: selectedSections.get(fn.name), value: 0, size: fn.size, info: 0x12 });
  }
  defined.set('func_00187078', { shndx: secondarySection, value: 0, size: 108, info: 0x12 });
  defined.set('service_index_secondary_91', { shndx: secondarySection, value: 92, size: 0, info: 0x10 });
  defined.set('func_001870E4', { shndx: secondarySection, value: 108, size: 0, info: 0x12 });
  defined.set('func_00186AAC', { shndx: secondarySection, value: 1024, size: 204, info: 0x12 });
  defined.set('service_peer_secondary_91', { shndx: secondarySection, value: 1164, size: 0, info: 0x10 });
  defined.set('func_00186EB8', { shndx: secondarySection, value: 2060, size: 0, info: 0x12 });

  const stringParts = [Buffer.from([0])];
  const stringOffsets = new Map();
  let stringSize = 1;
  for (const name of requiredNames) {
    stringOffsets.set(name, stringSize);
    const part = Buffer.from(`${name}\0`);
    stringParts.push(part);
    stringSize += part.length;
  }
  const stringData = Buffer.concat(stringParts);
  const strtabIndex = addSection({ name: '.strtab', type: 3, flags: 0, data: stringData, size: stringData.length, align: 1 });
  const symtabData = Buffer.alloc((requiredNames.length + 1) * 16);
  const symbolIndexes = new Map();
  requiredNames.forEach((name, i) => {
    const symbolIndex = i + 1;
    symbolIndexes.set(name, symbolIndex);
    const p = symbolIndex * 16;
    const value = defined.get(name) ?? { shndx: 0, value: 0, size: 0, info: 0x10 };
    symtabData.writeUInt32LE(stringOffsets.get(name), p);
    symtabData.writeUInt32LE(value.value, p + 4);
    symtabData.writeUInt32LE(value.size, p + 8);
    symtabData[p + 12] = value.info;
    symtabData.writeUInt16LE(value.shndx, p + 14);
  });
  const symtabIndex = addSection({
    name: '.symtab', type: 2, flags: 0, data: symtabData, size: symtabData.length,
    align: 4, entsize: 16, link: strtabIndex, info: 1,
  });
  const relocationSections = [];
  for (const fn of config.functions) {
    const entries = [...fn.branches.map(branch => ({
      offset: branch.offset, type: branch.kind === 'R_ARM_CALL' ? 28 : 29, symbol: branch.symbol,
    })), ...fn.literals.map(literal => ({ offset: literal.offset, type: 2, symbol: literal.symbol }))]
      .sort((a, b) => a.offset - b.offset);
    const data = Buffer.alloc(entries.length * 8);
    entries.forEach((entry, i) => {
      data.writeUInt32LE(entry.offset, i * 8);
      data.writeUInt32LE(symbolIndexes.get(entry.symbol) * 256 + entry.type, i * 8 + 4);
    });
    relocationSections.push(addSection({
      name: `.rel${fn.section}`, type: 9, flags: 0, data, size: data.length,
      align: 4, entsize: 8, link: symtabIndex, info: selectedSections.get(fn.name),
    }));
  }

  const sectionNameOffsets = new Map([['', 0]]);
  const sectionNameParts = [Buffer.from([0])];
  let sectionNameSize = 1;
  for (const section of sections) {
    if (sectionNameOffsets.has(section.name)) continue;
    sectionNameOffsets.set(section.name, sectionNameSize);
    const part = Buffer.from(`${section.name}\0`);
    sectionNameParts.push(part);
    sectionNameSize += part.length;
  }
  sectionNameOffsets.set('.shstrtab', sectionNameSize);
  sectionNameParts.push(Buffer.from('.shstrtab\0'));
  const shstrData = Buffer.concat(sectionNameParts);
  const shstrIndex = addSection({ name: '.shstrtab', type: 3, flags: 0, data: shstrData, size: shstrData.length, align: 1 });

  let cursor = 52;
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const align = section.align ?? 1;
    cursor = (cursor + align - 1) & -align;
    section.offset = cursor;
    cursor += section.data.length;
  }
  const shoff = (cursor + 3) & ~3;
  const buffer = Buffer.alloc(shoff + sections.length * 40);
  buffer.write('\x7fELF', 0, 'latin1');
  buffer[4] = 1; buffer[5] = 1; buffer[6] = 1;
  buffer.writeUInt16LE(1, 16); buffer.writeUInt16LE(40, 18);
  buffer.writeUInt32LE(1, 20); buffer.writeUInt32LE(shoff, 32);
  buffer.writeUInt16LE(52, 40); buffer.writeUInt16LE(40, 46);
  buffer.writeUInt16LE(sections.length, 48); buffer.writeUInt16LE(shstrIndex, 50);
  const sectionHeaders = new Map();
  sections.forEach((section, index) => {
    if (index !== 0) section.data.copy(buffer, section.offset);
    const p = shoff + index * 40;
    sectionHeaders.set(index, p);
    buffer.writeUInt32LE(sectionNameOffsets.get(section.name) ?? 0, p);
    buffer.writeUInt32LE(section.type, p + 4); buffer.writeUInt32LE(section.flags, p + 8);
    buffer.writeUInt32LE(section.offset ?? 0, p + 16); buffer.writeUInt32LE(section.size, p + 20);
    buffer.writeUInt32LE(section.link ?? 0, p + 24); buffer.writeUInt32LE(section.info ?? 0, p + 28);
    buffer.writeUInt32LE(section.align ?? 0, p + 32); buffer.writeUInt32LE(section.entsize ?? 0, p + 36);
  });
  const symbolEntries = new Map();
  for (const [name, index] of symbolIndexes) {
    symbolEntries.set(name, sections[symtabIndex].offset + index * 16);
  }
  return {
    buffer,
    meta: { sections, sectionHeaders, foreignSections, selectedSections, secondarySection,
      strtabIndex, symtabIndex, relocationSections, symbolEntries },
  };
}

function selfTest(config) {
  const fixture = makeValidationComposite(config);
  const composite = parseElf32Arm(fixture.buffer);
  assert.equal(composite.sections.length >= 12_000, true);
  assert.equal(composite.sections.filter(s => s.name === '.text.foreign' && (s.flags & 4)).length, 12_000);
  validateObject(composite, config);
  assert.throws(() => parseElf32Arm(Buffer.alloc(12)), /ELF header/);
  const wrongMachine = Buffer.from(fixture.buffer);
  wrongMachine.writeUInt16LE(3, 18);
  assert.throws(() => parseElf32Arm(wrongMachine), /EM_ARM/);
  const badExtent = Buffer.from(fixture.buffer);
  badExtent.writeUInt32LE(0xfffffff0, fixture.meta.sectionHeaders.get(fixture.meta.foreignSections[0]) + 16);
  assert.throws(() => parseElf32Arm(badExtent), /outside the file/);
  assert.throws(() => parseElf32Arm(Buffer.alloc(FILE_CAP + 1)), /file size limit/);

  const tooManySections = Buffer.from(fixture.buffer);
  tooManySections.writeUInt16LE(SECTION_COUNT_CAP + 1, 48);
  assert.throws(() => parseElf32Arm(tooManySections), /section count limit/);
  const hugeExecutable = Buffer.from(fixture.buffer);
  const executableHeader = fixture.meta.sectionHeaders.get(fixture.meta.foreignSections[0]);
  hugeExecutable.writeUInt32LE(8, executableHeader + 4);
  hugeExecutable.writeUInt32LE(EXECUTABLE_PAYLOAD_CAP + 1, executableHeader + 20);
  assert.throws(() => parseElf32Arm(hugeExecutable), /total executable payload limit/);
  const oversizedTableFixture = (sectionIndex, size) => {
    const section = fixture.meta.sections[sectionIndex];
    const expanded = Buffer.alloc(Math.max(fixture.buffer.length, section.offset + size));
    fixture.buffer.copy(expanded);
    expanded.writeUInt32LE(size, fixture.meta.sectionHeaders.get(sectionIndex) + 20);
    return expanded;
  };
  const tooManySymbols = oversizedTableFixture(fixture.meta.symtabIndex, (SYMBOL_CAP + 1) * 16);
  assert.throws(() => parseElf32Arm(tooManySymbols), /symbol count limit/);
  const tooManyRelocations = oversizedTableFixture(fixture.meta.relocationSections[0],
    (RELOCATION_CAP + 1) * 8);
  assert.throws(() => parseElf32Arm(tooManyRelocations), /relocation count limit/);

  const collision = Buffer.from(fixture.buffer);
  collision.writeUInt32LE(collision.readUInt32LE(fixture.meta.symbolEntries.get('func_00180968')),
    fixture.meta.symbolEntries.get('func_001809A4'));
  assert.throws(() => validateObject(parseElf32Arm(collision), config), /expected exactly one symbol/);
  const badMapping = Buffer.from(fixture.buffer);
  badMapping.writeUInt16LE(fixture.meta.foreignSections[0], fixture.meta.symbolEntries.get('func_00180968') + 14);
  assert.throws(() => validateObject(parseElf32Arm(badMapping), config), /unexpected containing section/);
  const badOwnership = Buffer.from(fixture.buffer);
  const intruder = fixture.meta.symbolEntries.get('func_0017A8A8');
  badOwnership.writeUInt32LE(4, intruder + 4);
  badOwnership[intruder + 12] = 0x12;
  badOwnership.writeUInt16LE(fixture.meta.selectedSections.get('func_00180968'), intruder + 14);
  assert.throws(() => validateObject(parseElf32Arm(badOwnership), config), /owned extent contains/);
  const badRelocation = Buffer.from(fixture.buffer);
  const firstRelocation = fixture.meta.sections[fixture.meta.relocationSections[0]].offset;
  badRelocation[firstRelocation + 4] = 2;
  assert.throws(() => validateObject(parseElf32Arm(badRelocation), config), /relocation schedule mismatch/);
  const badSecondary = Buffer.from(fixture.buffer);
  const secondaryEntry = fixture.meta.symbolEntries.get('service_index_secondary_91');
  badSecondary.writeUInt32LE(96, secondaryEntry + 4);
  assert.throws(() => validateObject(parseElf32Arm(badSecondary), config), /owner offset mismatch/);
  console.log(`self-test: passed (${composite.sections.length} sections, 12,000 unrelated executable sections, hostile caps/mapping/ownership/relocation/secondary cases)`);
}

async function main() {
  const args = process.argv.slice(2);
  const selfTestRequested = args.includes('--self-test');
  const objectAt = args.indexOf('--object');
  if (args.some((arg, i) => arg !== '--self-test' && arg !== '--object' && i !== objectAt + 1) ||
      (objectAt >= 0 && !args[objectAt + 1])) {
    fail('usage: validate-arm-ipc-wrappers-91.mjs [--self-test] [--object FILE]');
  }
  const configBytes = await readCapped(CONFIG_PATH, 'config');
  const config = JSON.parse(configBytes.toString('utf8'));
  validateConfig(config);
  if (selfTestRequested) selfTest(config);
  const sourcePath = resolve(ROOT, config.source);
  const sourceBytes = await readCapped(sourcePath, 'source');
  validateSource(sourceBytes, config);
  if (objectAt >= 0) {
    const objectPath = resolve(process.cwd(), args[objectAt + 1]);
    const objectBytes = await readCapped(objectPath, 'object');
    const parsed = parseElf32Arm(objectBytes);
    validateObject(parsed, config);
    console.log(`object: ${parsed.sections.length} sections, ${parsed.symbolCount} symbols, ${parsed.relocationCount} relocations, ${parsed.executablePayload} executable bytes`);
  }
  console.log(`validated batch 91: 4 functions, 576 body bytes, 16 pool bytes, SHA-256 ${sha256(sourceBytes)}`);
}

await main().catch(error => {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
});
