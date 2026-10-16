#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const TOOL_PREFIX = '/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-';
const here = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = resolve(here, '..');
const configPath = join(root, 'config', 'arm-ipc-wrappers-83.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

const sectionHashes = new Map([
  ['func_0017A8A8', 'ac31cd8efce9cc9cb86c1adfb874c64c4c54e09ca30f6d1a4bc09cc3ace6cb6c'],
  ['func_0017A8E8', '666bfb4b2815924ee2ed424fb6381eca19849944d39c4dec8fc9c798c6bcc0a3'],
  ['func_0017AA68', '2934bcc1042ff83c65e24ad2012f7a5c004cbf75728b269e699e541940aec754'],
  ['func_0017ABB8', 'f5ad8928be7d31f509f13f276b7566db5008995a2791d8555d259cc2152adc13'],
]);

const expectedFunctions = [
  ['func_0017A8A8', '.text.func_0017A8A8', 44, 'func_0017A8E8', 64, [], []],
  ['func_0017A8E8', '.text.func_0017A8E8', 36, 'func_0017AA68', 384, [], []],
  ['func_0017AA68', '.text.func_0017AA68', 316, 'func_0017ABB8', 336, [], [
    [316, [8], 'ipc_controller_record_vtable_83'],
    [320, [80], 'ipc_default_flags_54'],
    [324, [92], 'ipc_layout_record_tag_55'],
    [328, [104], 'ipc_controller_variant_tag_83'],
    [332, [116], 'ipc_controller_fallback_tag_83'],
  ]],
  ['func_0017ABB8', '.text.func_0017ABB8', 188, 'func_0017B42C', 2164, [], [
    [188, [0], 'ipc_controller_state_vtable_83'],
    [192, [4], 'ipc_unit_scalar_54'],
    [196, [8], 'service_zero_scalar_51'],
  ]],
];
const expectedLiteralIdentities = [
  'ipc_controller_record_vtable_83', 'ipc_default_flags_54', 'ipc_layout_record_tag_55',
  'ipc_controller_variant_tag_83', 'ipc_controller_fallback_tag_83',
  'ipc_controller_state_vtable_83', 'ipc_unit_scalar_54', 'service_zero_scalar_51',
];

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function same(actual, expected, message) {
  check(JSON.stringify(actual) === JSON.stringify(expected), message);
}
function validateManifest() {
  same(Object.keys(config).sort(), [
    'branchIdentityContract', 'cumulativePoolClasses', 'cumulativePoolSlots', 'functions',
    'literalIdentities', 'mode', 'newLiteralIdentities', 'normalizedScheduleSha256',
    'reusedLiteralIdentities', 'schemaVersion', 'source', 'sourceSha256',
    'totalAdjacentSize', 'totalBodySize',
  ].sort(), 'unexpected manifest keys');
  check(config.schemaVersion === 1 && config.mode === 'arm', 'unexpected schema or mode');
  check(config.source === 'src/main/arm_ipc_wrappers_83.S', 'unexpected source path');
  check(config.sourceSha256 === '2984e4b8a6e0c08867792f222ea99cd3107ebea5f23df78e958e6c2639c54e4f' &&
    config.normalizedScheduleSha256 === config.sourceSha256, 'unexpected normative schedule hash');
  check(config.totalBodySize === 584 && config.totalAdjacentSize === 32,
    'unexpected body or adjacent size');
  check(config.cumulativePoolSlots === 820 && config.cumulativePoolClasses === 428,
    'unexpected cumulative pool totals');
  same(config.functions.map(fn => [fn.name, fn.section, fn.size, fn.nextGlobal,
    fn.nextGlobalOffset, fn.branches, fn.literals.map(lit => [lit.offset, lit.loadOffsets, lit.symbol])]),
  expectedFunctions, 'function boundary/transfer/literal contract changed');
  same(config.literalIdentities, expectedLiteralIdentities, 'literal identities changed');
  same(config.reusedLiteralIdentities,
    ['ipc_default_flags_54', 'ipc_layout_record_tag_55', 'ipc_unit_scalar_54', 'service_zero_scalar_51'],
    'reused literal identities changed');
  same(config.newLiteralIdentities, ['ipc_controller_record_vtable_83',
    'ipc_controller_variant_tag_83', 'ipc_controller_fallback_tag_83',
    'ipc_controller_state_vtable_83'], 'new literal identities changed');
  same(config.branchIdentityContract, { mode: 'arm', minimumAlignment: 4,
    primaryEntries: [], secondaryEntries: [], secondaryEntryRelations: [], sharedClasses: [],
    singletonClasses: [], classesPairwiseDistinct: true }, 'branch identity contract changed');
}
function range(offset, size, limit, what) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0,
    `${what}: invalid range`);
  check(offset <= limit && size <= limit - offset, `${what}: range outside file`);
}
function cstring(bytes, offset, what) {
  check(Number.isInteger(offset) && offset >= 0 && offset < bytes.length, `${what}: bad string offset`);
  const end = bytes.indexOf(0, offset);
  check(end !== -1, `${what}: unterminated string`);
  check(end - offset <= 4096, `${what}: string exceeds 4096 bytes`);
  return bytes.subarray(offset, end).toString('utf8');
}

function parseElf(path) {
  check(statSync(path).size <= MAX_FILE, `${path}: ELF exceeds 64 MiB`);
  const file = readFileSync(path);
  check(file.length >= 52, `${path}: truncated ELF header`);
  check(file[0] === 0x7f && file[1] === 0x45 && file[2] === 0x4c && file[3] === 0x46,
    `${path}: not an ELF file`);
  check(file[4] === 1, `${path}: expected ELF32`);
  check(file[5] === 1, `${path}: expected little-endian ELF`);
  check(file[6] === 1, `${path}: unsupported ELF version`);
  const v = new DataView(file.buffer, file.byteOffset, file.byteLength);
  const u16 = o => v.getUint16(o, true);
  const u32 = o => v.getUint32(o, true);
  check(u16(16) === 1, `${path}: expected relocatable ELF`);
  check(u16(18) === 40, `${path}: expected ARM ELF`);
  check(u32(20) === 1, `${path}: bad ELF version`);
  check(u16(40) >= 52, `${path}: short ELF header`);
  const shoff = u32(32);
  const shentsize = u16(46);
  let shnum = u16(48);
  let shstrndx = u16(50);
  check(shentsize >= 40, `${path}: section header is too small`);
  range(shoff, shentsize, file.length, `${path}: section table`);
  if (shnum === 0) shnum = u32(shoff + 20);
  check(shnum > 0 && shnum <= MAX_SECTIONS, `${path}: invalid/excessive section count ${shnum}`);
  range(shoff, shentsize * shnum, file.length, `${path}: section table`);
  if (shstrndx === 0xffff) shstrndx = u32(shoff + 24);
  check(shstrndx < shnum, `${path}: invalid section-name table index`);

  const sections = [];
  let execBytes = 0;
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    const s = {
      index: i, nameOffset: u32(p), type: u32(p + 4), flags: u32(p + 8),
      addr: u32(p + 12), offset: u32(p + 16), size: u32(p + 20),
      link: u32(p + 24), info: u32(p + 28), align: u32(p + 32), entsize: u32(p + 36),
    };
    if (s.type !== 8) range(s.offset, s.size, file.length, `${path}: section ${i}`);
    if (s.flags & 4) {
      check(s.size <= MAX_EXEC - execBytes, `${path}: executable sections exceed 16 MiB`);
      execBytes += s.size;
    }
    sections.push(s);
  }
  const shstr = sections[shstrndx];
  check(shstr.type === 3, `${path}: section-name table is not STRTAB`);
  const names = file.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const s of sections) s.name = cstring(names, s.nameOffset, `${path}: section ${s.index} name`);

  const symbols = [];
  for (const tab of sections.filter(s => s.type === 2)) {
    check(tab.entsize >= 16 && tab.size % tab.entsize === 0, `${path}: malformed symbol table`);
    check(tab.link < shnum && sections[tab.link].type === 3, `${path}: invalid symbol string table`);
    const strings = file.subarray(sections[tab.link].offset, sections[tab.link].offset + sections[tab.link].size);
    const count = tab.size / tab.entsize;
    for (let i = 0; i < count; i++) {
      const p = tab.offset + i * tab.entsize;
      const symbol = {
        table: tab.index, index: i, name: cstring(strings, u32(p), `${path}: symbol ${i}`),
        value: u32(p + 4), size: u32(p + 8), info: file[p + 12], other: file[p + 13], shndx: u16(p + 14),
      };
      symbols.push(symbol);
    }
  }
  check(symbols.length > 0, `${path}: missing symbol table`);

  const relocations = [];
  for (const rel of sections.filter(s => s.type === 9 || s.type === 4)) {
    const minimum = rel.type === 9 ? 8 : 12;
    check(rel.entsize >= minimum && rel.size % rel.entsize === 0, `${path}: malformed relocation section`);
    check(rel.info < shnum, `${path}: invalid relocation target`);
    const tabSymbols = symbols.filter(s => s.table === rel.link);
    check(tabSymbols.length > 0, `${path}: relocation has invalid symbol table`);
    const byIndex = new Map(tabSymbols.map(s => [s.index, s]));
    for (let p = rel.offset; p < rel.offset + rel.size; p += rel.entsize) {
      const info = u32(p + 4);
      const symbol = byIndex.get(info >>> 8);
      check(symbol, `${path}: relocation has invalid symbol index`);
      relocations.push({ target: rel.info, offset: u32(p), type: info & 0xff, symbol: symbol.name });
    }
  }
  return { path, file, v, sections, symbols, relocations };
}

function one(items, description) {
  check(items.length === 1, `expected exactly one ${description}, found ${items.length}`);
  return items[0];
}

function validateObject(path, objdump) {
  const elf = parseElf(path);
  let totalBody = 0;
  let totalPool = 0;
  const selectedIndices = new Set();
  for (const fn of config.functions) {
    const section = one(elf.sections.filter(s => s.name === fn.section), `section ${fn.section}`);
    selectedIndices.add(section.index);
    check((section.flags & 6) === 6 && section.type === 1, `${fn.section}: expected executable PROGBITS`);
    const expectedSectionSize = fn.size + fn.literals.length * 4;
    check(section.size === expectedSectionSize, `${fn.section}: size ${section.size}, expected ${expectedSectionSize}`);
    check(section.align >= 4, `${fn.section}: alignment is below 4`);
    const bytes = elf.file.subarray(section.offset, section.offset + section.size);
    check(sha256(bytes) === sectionHashes.get(fn.name), `${fn.section}: instruction/pool schedule mismatch`);

    const symbol = one(elf.symbols.filter(s => s.name === fn.name && (s.info >>> 4) === 1),
      `global symbol ${fn.name}`);
    check(symbol.shndx === section.index && symbol.value === 0, `${fn.name}: wrong section or value`);
    check(symbol.size === fn.size, `${fn.name}: size ${symbol.size}, expected ${fn.size}`);
    check((symbol.info >>> 4) === 1 && (symbol.info & 15) === 2, `${fn.name}: expected global function symbol`);

    let branches = 0;
    let returns = 0;
    for (let off = 0; off < fn.size; off += 4) {
      const word = elf.v.getUint32(section.offset + off, true);
      if ((word & 0x0ffffff0) === 0x012fff10 && (word & 15) === 14) returns++;
      if ((word & 0x0e000000) === 0x0a000000) {
        branches++;
        let displacement = word & 0x00ffffff;
        if (displacement & 0x00800000) displacement -= 0x01000000;
        const target = off + 8 + displacement * 4;
        check(target >= 0 && target < fn.size && target % 4 === 0, `${fn.name}+0x${off.toString(16)}: branch escapes body`);
      }
    }
    const expectedBranches = fn.name === 'func_0017AA68' ? 16 : 0;
    check(branches === expectedBranches, `${fn.name}: found ${branches} local branches, expected ${expectedBranches}`);
    check(returns === 1, `${fn.name}: expected exactly one bx lr return`);

    const result = spawnSync(objdump, ['-d', '-j', fn.section, path], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 10000 });
    check(result.status === 0, `${fn.section}: scoped disassembly failed: ${(result.stderr || '').trim()}`);
    const addresses = [...result.stdout.matchAll(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+/gm)]
      .map(match => Number.parseInt(match[1], 16)).filter(address => address < fn.size);
    check(addresses.length === fn.size / 4, `${fn.section}: scoped disassembly did not cover the body`);
    check(addresses.every((address, i) => address === i * 4), `${fn.section}: non-contiguous disassembly`);
    totalBody += fn.size;
    totalPool += fn.literals.length * 4;
  }
  check(totalBody === config.totalBodySize, `total body size ${totalBody}, expected ${config.totalBodySize}`);
  check(totalPool === config.totalAdjacentSize, `total pool size ${totalPool}, expected ${config.totalAdjacentSize}`);

  const expectedRelocs = new Map();
  for (const fn of config.functions) {
    const section = one(elf.sections.filter(s => s.name === fn.section), `section ${fn.section}`);
    for (const lit of fn.literals) expectedRelocs.set(`${section.index}:${lit.offset}`, lit.symbol);
  }
  const actual = elf.relocations.filter(r => selectedIndices.has(r.target));
  check(actual.length === 8, `selected sections have ${actual.length} relocations, expected 8`);
  for (const relocation of actual) {
    const key = `${relocation.target}:${relocation.offset}`;
    check(relocation.type === 2, `relocation ${key}: expected R_ARM_ABS32, got ${relocation.type}`);
    check(expectedRelocs.get(key) === relocation.symbol, `relocation ${key}: wrong literal identity ${relocation.symbol}`);
    expectedRelocs.delete(key);
  }
  check(expectedRelocs.size === 0, `missing ${expectedRelocs.size} literal relocations`);

  for (const name of config.literalIdentities) {
    const symbol = one(elf.symbols.filter(s => s.name === name && (s.info >>> 4) === 1),
      `global literal symbol ${name}`);
    check(symbol.other === 0, `${name}: expected default visibility`);
    if (symbol.shndx === 0) {
      check(symbol.value === 0 && symbol.size === 0, `${name}: invalid undefined symbol`);
    } else {
      check(symbol.shndx < elf.sections.length, `${name}: invalid definition section`);
      const section = elf.sections[symbol.shndx];
      check(symbol.value <= section.size && symbol.size <= section.size - symbol.value,
        `${name}: definition outside its section`);
      check((symbol.info & 15) === 0 || (symbol.info & 15) === 1,
        `${name}: defined literal must be NOTYPE or OBJECT`);
    }
  }
}

function findTool(name) {
  const fixed = `${TOOL_PREFIX}${name}`;
  if (existsSync(fixed)) return fixed;
  const candidate = spawnSync('sh', ['-c', `command -v arm-none-eabi-${name}`], { encoding: 'utf8' });
  check(candidate.status === 0 && candidate.stdout.trim(), `cannot find arm-none-eabi-${name}`);
  return candidate.stdout.trim();
}

function parseArgs(args) {
  let source;
  let object;
  let sourceOnly = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--source') { check(i + 1 < args.length, '--source needs a path'); source = args[++i]; }
    else if (arg === '--object') { check(i + 1 < args.length, '--object needs a path'); object = args[++i]; }
    else if (arg === '--source-only') { sourceOnly = true; }
    else if (arg === '--help' || arg === '-h') {
      console.log(`usage: ${basename(process.argv[1])} [source.S] [object.o] [--source source.S] [--object object.o]`);
      process.exit(0);
    } else if (arg.startsWith('-')) fail(`unknown option ${arg}`);
    else if (resolve(arg) === configPath || extname(arg).toLowerCase() === '.json') {
      check(resolve(arg) === configPath, `unexpected config ${arg}`);
    } else {
      check(statSync(arg).size <= MAX_FILE, `${arg}: input exceeds 64 MiB`);
      const bytes = readFileSync(arg);
      const isElf = bytes.length >= 4 && bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46;
      if (isElf) { check(!object, 'multiple object paths'); object = arg; }
      else { check(!source, 'multiple source paths'); source = arg; }
    }
  }
  check(!(sourceOnly && object), '--source-only cannot be combined with an object');
  if ((!source && !object) || sourceOnly) source ??= join(root, config.source);
  return { source, object, sourceOnly };
}

let temporary;
try {
  validateManifest();
  const args = parseArgs(process.argv.slice(2));
  if (args.source) {
    check(statSync(args.source).size <= MAX_FILE, `${args.source}: source exceeds 64 MiB`);
    const sourceBytes = readFileSync(args.source);
    check(sha256(sourceBytes) === config.sourceSha256, `${args.source}: source SHA-256 does not match the normative schedule`);
  }
  if (args.sourceOnly) {
    console.log('arm-ipc-wrappers-83: validated source');
    process.exit(0);
  }
  let object = args.object;
  if (!object) {
    temporary = mkdtempSync(join(tmpdir(), 'arm-ipc-wrappers-83-'));
    object = join(temporary, 'probe.o');
    const assembler = findTool('as');
    const result = spawnSync(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', object, args.source],
      { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 20000 });
    check(result.status === 0, `assembly failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  validateObject(object, findTool('objdump'));
  console.log(`arm-ipc-wrappers-83: validated ${args.source ? 'source' : 'object'}${args.source && args.object ? ' and object' : ''}`);
} catch (error) {
  console.error(`arm-ipc-wrappers-83: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
