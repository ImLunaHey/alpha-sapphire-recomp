#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(root, 'config/arm-runtime-helpers-83.json');
const specPath = resolve(root, 'docs/specs/main/arm_runtime_helpers_83.md');
const expected = Object.freeze({
  fullHash: 'c41dd06cf0bf0a4a284b7f34513e2c62e9c2cc83f24696a4f5703345b96e02f5',
  branchHash: '7d88e228bc5f563d2640f26a2d86937003c8624fbd6f1393dcc0135fd3221d05',
  returnHash: '2a25c82d5b243a55da47748a2db72fce47fb8b81883586bae6e4b55d237d2e15',
});
const fail = message => { throw new Error(message); };
const sha256 = value => createHash('sha256').update(value).digest('hex');

function argumentsFor(argv) {
  const crossPrefix = process.env.CROSS_COMPILE || '';
  const result = {
    object: null,
    as: process.env.ARM_NONE_EABI_AS || `${crossPrefix}as`.replace(/^as$/, 'arm-none-eabi-as'),
    objdump: process.env.ARM_NONE_EABI_OBJDUMP ||
      `${crossPrefix}objdump`.replace(/^objdump$/, 'arm-none-eabi-objdump'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--object' || value === '-o') result.object = argv[++i];
    else if (value.startsWith('--object=')) result.object = value.slice(9);
    else if (value === '--as') result.as = argv[++i];
    else if (value.startsWith('--as=')) result.as = value.slice(5);
    else if (value === '--objdump') result.objdump = argv[++i];
    else if (value.startsWith('--objdump=')) result.objdump = value.slice(10);
    else if (value === '--help' || value === '-h') {
      console.log('Usage: validate-arm-runtime-helpers-83.mjs [--object FILE] [--as FILE] [--objdump FILE]');
      process.exit(0);
    } else if (!value.startsWith('-') && result.object === null) result.object = value;
    else fail(`unknown or incomplete argument: ${value ?? '<missing>'}`);
  }
  return result;
}

function run(command, args) {
  const child = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (child.error) fail(`cannot run ${command}: ${child.error.message}`);
  if (child.status !== 0) fail(`${command} failed (${child.status}):\n${child.stderr || child.stdout}`);
  return child.stdout;
}

function cString(bytes, offset) {
  if (offset < 0 || offset >= bytes.length) return '';
  let end = offset;
  while (end < bytes.length && bytes[end] !== 0) end += 1;
  return bytes.toString('utf8', offset, end);
}

function readElf(path) {
  const bytes = readFileSync(path);
  if (bytes.length < 52 || bytes.toString('binary', 0, 4) !== '\x7fELF') fail(`${path}: not an ELF file`);
  if (bytes[4] !== 1 || bytes[5] !== 1) fail(`${path}: expected ELF32 little-endian`);
  if (bytes.readUInt16LE(18) !== 40) fail(`${path}: expected EM_ARM`);
  const shoff = bytes.readUInt32LE(32);
  const shentsize = bytes.readUInt16LE(46);
  const shnum = bytes.readUInt16LE(48);
  const shstrndx = bytes.readUInt16LE(50);
  if (shentsize < 40 || shoff + shentsize * shnum > bytes.length || shstrndx >= shnum) fail(`${path}: malformed section table`);
  const sections = [];
  for (let index = 0; index < shnum; index += 1) {
    const at = shoff + index * shentsize;
    sections.push({ index, nameOffset: bytes.readUInt32LE(at), type: bytes.readUInt32LE(at + 4), flags: bytes.readUInt32LE(at + 8), addr: bytes.readUInt32LE(at + 12), offset: bytes.readUInt32LE(at + 16), size: bytes.readUInt32LE(at + 20), link: bytes.readUInt32LE(at + 24), info: bytes.readUInt32LE(at + 28), align: bytes.readUInt32LE(at + 32), entsize: bytes.readUInt32LE(at + 36) });
  }
  const shstr = sections[shstrndx];
  const shstrBytes = bytes.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(shstrBytes, section.nameOffset);
  const symbols = [];
  for (const table of sections.filter(section => section.type === 2)) {
    const strings = sections[table.link];
    if (!strings || table.entsize < 16 || table.offset + table.size > bytes.length) fail(`${path}: malformed symbol table`);
    const stringBytes = bytes.subarray(strings.offset, strings.offset + strings.size);
    for (let at = table.offset; at + table.entsize <= table.offset + table.size; at += table.entsize) {
      const info = bytes[at + 12];
      symbols.push({ name: cString(stringBytes, bytes.readUInt32LE(at)), value: bytes.readUInt32LE(at + 4), size: bytes.readUInt32LE(at + 8), bind: info >>> 4, type: info & 15, shndx: bytes.readUInt16LE(at + 14) });
    }
  }
  return { bytes, sections, symbols };
}

function parseInstructions(text, name, base) {
  const instructions = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{8}\s+)+([a-zA-Z][a-zA-Z0-9.]*)\s*(.*?)\s*$/);
    if (!match) continue;
    const address = Number.parseInt(match[1], 16);
    let operands = match[3].replace(/\s+@.*$/, '').trim().replace(/\s+/g, ' ');
    const mnemonic = match[2].toLowerCase();
    if (/^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le)?$/.test(mnemonic)) {
      const target = operands.match(/^([0-9a-fA-F]+)/);
      if (!target) fail(`${name}: cannot parse branch operand '${operands}'`);
      operands = (Number.parseInt(target[1], 16) - base).toString(16);
    }
    instructions.push({ name, offset: address - base, mnemonic, operands });
  }
  return instructions;
}

function inspectDisassembly(objdump, objectPath, names, base) {
  const all = [];
  for (const name of names) {
    const section = `.text.${name}`;
    const args = ['-d', '-j', section];
    if (base !== 0) args.push(`--adjust-vma=0x${base.toString(16)}`);
    const parsed = parseInstructions(run(objdump, [...args, objectPath]), name, base);
    if (parsed.length !== 7) fail(`${name}: expected 7 instructions, found ${parsed.length}`);
    all.push(...parsed);
  }
  return all;
}

function canonicalSchedules(instructions) {
  const full = instructions.map(i => `${i.name}:${i.offset.toString(16)}:${i.mnemonic}:${i.operands}`);
  const branches = instructions.filter(i => /^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le)?$/.test(i.mnemonic)).map(i => `${i.name}:${i.offset.toString(16)}:${i.mnemonic}:${i.operands}`);
  const returns = instructions.filter(i => i.mnemonic === 'bx' && i.operands === 'lr').map(i => `${i.name}:${i.offset.toString(16)}:${i.mnemonic}:${i.operands}`);
  return { full, branches, returns };
}

function validateObject(path, config, expectedFullHash, objdump, allowForeign) {
  const elf = readElf(path);
  const names = config.functions.map(item => item.name);
  const expectedSections = new Set(names.map(name => `.text.${name}`));
  let total = 0;
  for (const item of config.functions) {
    const sectionName = `.text.${item.name}`;
    const matches = elf.sections.filter(section => section.name === sectionName);
    if (matches.length !== 1) fail(`${item.name}: expected exactly one ${sectionName} section`);
    const section = matches[0];
    if (section.type !== 1 || (section.flags & 0x6) !== 0x6 || (section.flags & ~0x6) !== 0) fail(`${item.name}: section must be AX PROGBITS`);
    if (section.size !== item.size || section.align !== 4) fail(`${item.name}: expected size ${item.size} and alignment 4`);
    total += section.size;
    const definitions = elf.symbols.filter(symbol => symbol.name === item.name && symbol.shndx !== 0);
    if (definitions.length !== 1) fail(`${item.name}: expected exactly one definition`);
    const symbol = definitions[0];
    if (symbol.shndx !== section.index || symbol.bind !== 1 || symbol.type !== 2 || symbol.value !== section.addr || symbol.size !== item.size) fail(`${item.name}: invalid global function symbol boundary`);
  }
  if (total !== config.totalBodySize || config.totalAdjacentSize !== 0) fail(`invalid aggregate body/adjacent size`);
  if (!allowForeign) {
    const exports = elf.symbols.filter(symbol => symbol.bind === 1 && symbol.type === 2 && symbol.shndx !== 0).map(symbol => symbol.name).sort();
    if (exports.join('\n') !== [...names].sort().join('\n')) fail('standalone object does not export exactly the configured functions');
  }
  for (const section of elf.sections) {
    if ((section.type === 9 || section.type === 4) && expectedSections.has(elf.sections[section.info]?.name) && section.size !== 0) fail(`${elf.sections[section.info].name}: relocations are forbidden`);
  }
  const instructions = inspectDisassembly(objdump, path, names, 0);
  const highInstructions = inspectDisassembly(objdump, path, names, 0x1000000);
  const schedules = canonicalSchedules(instructions);
  const highSchedules = canonicalSchedules(highInstructions);
  for (const key of ['full', 'branches', 'returns']) {
    if (schedules[key].join('\n') !== highSchedules[key].join('\n')) fail(`16MiB disassembly changed the ${key} schedule`);
  }
  if (instructions.length !== 168) fail(`expected 168 instructions, found ${instructions.length}`);
  if (schedules.branches.length !== 9 || schedules.returns.length !== 24) fail(`expected 9 local branches and 24 returns`);
  const memory = instructions.filter(i => /^(?:ldr|str|ldm|stm|vldr|vstr|vldm|vstm)/.test(i.mnemonic));
  if (memory.length !== 81) fail(`expected 81 memory operations, found ${memory.length}`);
  if (instructions.some(i => /^(?:bl|blx)$/.test(i.mnemonic))) fail('calls are forbidden');
  if (instructions.some(i => /^(?:ldr|str|ldm|stm|vldr|vstr|vldm|vstm)/.test(i.mnemonic) && /\bpc\b/.test(i.operands))) fail('PC-relative data access is forbidden');
  if (sha256(schedules.full.join('\n')) !== expectedFullHash) fail(`full instruction schedule hash mismatch (got ${sha256(schedules.full.join('\n'))})`);
  if (sha256(schedules.branches.join('\n')) !== config.branchScheduleSha256) fail('branch schedule hash mismatch');
  if (sha256(schedules.returns.join('\n')) !== config.returnScheduleSha256) fail('return schedule hash mismatch');
}

let temporary = null;
try {
  const options = argumentsFor(process.argv.slice(2));
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.schemaVersion !== 1 || config.mode !== 'arm' || config.totalBodySize !== 672 || config.totalAdjacentSize !== 0) fail('invalid batch contract in config');
  if (!Array.isArray(config.functions) || config.functions.length !== 24 || new Set(config.functions.map(item => item.name)).size !== 24) fail('config must contain 24 unique functions');
  if (config.functions.some(item => item.size !== 28 || item.calls?.length !== 0 || item.adjacentWords?.length !== 0)) fail('every configured function must be 28-byte, call-free, and data-free');
  if (config.branchScheduleSha256 !== expected.branchHash || config.returnScheduleSha256 !== expected.returnHash) fail('config schedule hashes do not match the batch contract');
  if (config.pcRelativeDataAccesses?.length !== 0 || Object.keys(config.symbolicIdentities || {}).length !== 0 || Object.keys(config.symbolicSlots || {}).length !== 0) fail('config contains forbidden data or symbolic dependencies');
  const sourcePath = resolve(root, config.source);
  const sourceHash = sha256(readFileSync(sourcePath));
  if (!/^[0-9a-f]{64}$/.test(config.sourceSha256) || sourceHash !== config.sourceSha256) fail(`source SHA-256 mismatch (got ${sourceHash})`);
  const spec = readFileSync(specPath, 'utf8');
  const specSourceHash = spec.match(/Source SHA-256: `([0-9a-f]{64})`/);
  const fullHash = spec.match(/full mnemonic\/operand instruction-schedule SHA-256 is\s+`([0-9a-f]{64})`/);
  if (!specSourceHash || specSourceHash[1] !== sourceHash) fail('specification source SHA-256 mismatch');
  if (!fullHash) fail('specification full schedule hash is missing');
  if (fullHash[1] !== expected.fullHash) fail('specification full schedule hash does not match the batch contract');
  let objectPath = options.object && resolve(process.cwd(), options.object);
  if (!objectPath) {
    temporary = mkdtempSync(resolve(tmpdir(), 'arm-runtime-helpers-83-'));
    objectPath = resolve(temporary, 'arm_runtime_helpers_83.o');
    run(options.as, ['-march=armv6k', '-mfpu=vfpv2', '-o', objectPath, sourcePath]);
  }
  validateObject(objectPath, config, fullHash[1], options.objdump, options.object !== null);
  console.log(`arm-runtime-helpers-83: OK (${config.functions.length} functions, ${config.totalBodySize} bytes)`);
} catch (error) {
  console.error(`arm-runtime-helpers-83: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
