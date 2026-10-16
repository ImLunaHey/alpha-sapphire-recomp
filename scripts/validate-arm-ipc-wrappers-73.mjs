#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(root, 'config/arm-ipc-wrappers-73.json');
const sourcePath = join(root, 'src/main/arm_ipc_wrappers_73.S');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

function findTool(name) {
  const envName = `ARM_NONE_EABI_${name.toUpperCase()}`;
  if (process.env[envName]) return process.env[envName];
  try {
    return execFileSync('sh', ['-c', `command -v arm-none-eabi-${name}`], {
      encoding: 'utf8', maxBuffer: MAX_BUFFER,
    }).trim();
  } catch {}
  if (existsSync('/nix/store')) {
    const matches = readdirSync('/nix/store')
      .filter((entry) => entry.includes('gcc-arm-embedded-15.2') || entry.includes('arm-none-eabi-binutils'))
      .map((entry) => join('/nix/store', entry, 'bin', `arm-none-eabi-${name}`))
      .filter(existsSync)
      .sort((a, b) => Number(b.includes('gcc-arm-embedded-15.2')) - Number(a.includes('gcc-arm-embedded-15.2')));
    if (matches.length) return matches[0];
  }
  throw new Error(`arm-none-eabi-${name} was not found`);
}

const tool = Object.fromEntries(['as', 'objdump', 'readelf', 'objcopy', 'ld'].map((name) => [name, findTool(name)]));
function run(program, args) {
  return execFileSync(program, args, { encoding: 'utf8', maxBuffer: MAX_BUFFER });
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}
function assemble(source, output) {
  run(tool.as, ['-march=armv6k', '-mfpu=vfpv2', '-o', output, source]);
}

function checkManifest() {
  assert(config.schemaVersion === 1 && config.mode === 'arm', 'unexpected manifest schema or mode');
  assert(config.source === 'src/main/arm_ipc_wrappers_73.S', 'unexpected source path');
  assert(config.totalBodySize === 428, 'total body size must be 428');
  assert(config.cumulativePoolSlots === 751 && config.cumulativePoolClasses === 398,
    'cumulative literal identity totals must remain 751/398');
  assert(config.functions.length === 6, 'exactly six functions are required');
  assert(config.functions.reduce((sum, fn) => sum + fn.size, 0) === 428, 'function sizes do not total 428');
  assert(config.functions.every((fn) => fn.nextGlobalOffset === fn.size), 'nearest-global boundary mismatch');
  assert(config.functions.every((fn) => fn.literals.length === 0), 'literal slots are forbidden');
  assert(config.literalIdentities.length === 0 && config.reusedLiteralIdentities.length === 0 &&
    config.newLiteralIdentities.length === 0, 'literal identity arrays must be empty');
  const branches = config.functions.flatMap((fn) => fn.branches.map((branch) => ({ ...branch, fn })));
  assert(branches.length === 13, 'exactly thirteen symbolic transfers are required');
  const entries = config.branchIdentityContract.primaryEntries;
  assert(entries.length === 13 && new Set(entries).size === 13, 'branch classes must be pairwise distinct');
  assert(config.branchIdentityContract.secondaryEntries.length === 0 &&
    config.branchIdentityContract.secondaryEntryRelations.length === 0 &&
    config.branchIdentityContract.sharedClasses.length === 0, 'secondary/shared branch identities are forbidden');
  assert(config.branchIdentityContract.classesPairwiseDistinct === true &&
    config.branchIdentityContract.minimumAlignment === 4, 'branch identity contract mismatch');
  assert(sha256(sourcePath) === config.sourceSha256, 'assembly source SHA-256 does not match the manifest');
  return branches;
}

function sections(object) {
  const output = run(tool.objdump, ['-h', object]);
  const result = new Map();
  for (const line of output.split('\n')) {
    const match = line.match(/^\s*\d+\s+(\S+)\s+([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+2\*\*\d+/);
    if (match) result.set(match[1], Number.parseInt(match[2], 16));
  }
  return result;
}

function symbols(object) {
  const output = run(tool.readelf, ['-sW', object]);
  const result = [];
  for (const line of output.split('\n')) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/);
    if (match) result.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3],
      bind: match[4], visibility: match[5], ndx: match[6], name: match[7] });
  }
  return result;
}

function sectionIndexes(object) {
  const output = run(tool.readelf, ['-SW', object]);
  const result = new Map();
  for (const line of output.split('\n')) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)/);
    if (match) result.set(match[2], match[1]);
  }
  return result;
}

function relocations(object) {
  const output = run(tool.readelf, ['-rW', object]);
  const result = new Map();
  let target = null;
  for (const line of output.split('\n')) {
    const heading = line.match(/^Relocation section '\.rela?(\.[^']+)'/);
    if (heading) {
      target = heading[1];
      if (!result.has(target)) result.set(target, []);
      continue;
    }
    if (!target) continue;
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match) result.get(target).push({ offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3] });
  }
  return result;
}

function disassemble(object, section) {
  const output = run(tool.objdump, ['-d', '-j', section, object]);
  const instructions = [];
  for (const line of output.split('\n')) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+([0-9a-fA-F]{8})\s+(\S+)(?:\s+(.*?))?\s*$/);
    if (match) instructions.push({ offset: Number.parseInt(match[1], 16), word: match[2].toLowerCase(),
      mnemonic: match[3], operands: (match[4] || '').replace(/\s+/g, ' ').trim() });
  }
  return instructions;
}

function dumpSection(object, section, destination) {
  run(tool.objcopy, [`--dump-section`, `${section}=${destination}`, object]);
  return readFileSync(destination);
}

function normalizedBytes(bytes, branchOffsets) {
  const copy = Buffer.from(bytes);
  for (const offset of branchOffsets) {
    assert(offset + 4 <= copy.length, `relocation outside section at +${offset}`);
    copy[offset] = 0;
    copy[offset + 1] = 0;
    copy[offset + 2] = 0;
  }
  return copy;
}

function validateObject(candidate, reference, scratch) {
  const expectedBranches = checkManifest();
  const candidateSections = sections(candidate);
  const referenceSections = sections(reference);
  const candidateSymbols = symbols(candidate);
  const indexes = sectionIndexes(candidate);
  const candidateRelocs = relocations(candidate);
  const referenceRelocs = relocations(reference);

  for (const fn of config.functions) {
    assert(candidateSections.get(fn.section) === fn.size, `${fn.section}: expected exactly ${fn.size} bytes`);
    assert(referenceSections.get(fn.section) === fn.size, `${fn.section}: reference size mismatch`);
    const sectionIndex = indexes.get(fn.section);
    assert(sectionIndex !== undefined, `${fn.section}: section index missing`);
    const matching = candidateSymbols.filter((symbol) => symbol.name === fn.name && symbol.ndx === sectionIndex);
    assert(matching.length === 1, `${fn.name}: expected one defining symbol`);
    const symbol = matching[0];
    assert(symbol.value === 0 && symbol.size === fn.size && symbol.type === 'FUNC' && symbol.bind === 'GLOBAL',
      `${fn.name}: global function extent mismatch`);
    const intrusiveGlobals = candidateSymbols.filter((other) => other.ndx === sectionIndex &&
      (other.bind === 'GLOBAL' || other.bind === 'WEAK') && other.name !== fn.name);
    assert(intrusiveGlobals.length === 0, `${fn.name}: unexpected interstitial global ${intrusiveGlobals[0]?.name}`);

    const expectedRelocs = fn.branches.map(({ offset, kind, symbol: name }) => ({ offset, kind, symbol: name }));
    const actualRelocs = candidateRelocs.get(fn.section) || [];
    assert(JSON.stringify(actualRelocs) === JSON.stringify(expectedRelocs), `${fn.section}: relocation schedule mismatch`);
    assert(JSON.stringify(referenceRelocs.get(fn.section) || []) === JSON.stringify(expectedRelocs),
      `${fn.section}: locked reference relocation mismatch`);

    const branchOffsets = expectedRelocs.map(({ offset }) => offset);
    const actualBytes = normalizedBytes(dumpSection(candidate, fn.section, join(scratch, `${fn.name}.actual.bin`)), branchOffsets);
    const expectedBytes = normalizedBytes(dumpSection(reference, fn.section, join(scratch, `${fn.name}.expected.bin`)), branchOffsets);
    assert(actualBytes.equals(expectedBytes), `${fn.section}: executable bytes differ outside relocation payloads`);

    const actualInstructions = disassemble(candidate, fn.section);
    const expectedInstructions = disassemble(reference, fn.section);
    assert(actualInstructions.length === fn.size / 4, `${fn.section}: instruction count mismatch`);
    for (let index = 0; index < expectedInstructions.length; index += 1) {
      const actual = actualInstructions[index];
      const expected = expectedInstructions[index];
      assert(actual.offset === expected.offset && actual.mnemonic === expected.mnemonic,
        `${fn.section}+${expected.offset}: mnemonic schedule mismatch`);
      if (!branchOffsets.includes(expected.offset)) {
        assert(actual.operands === expected.operands, `${fn.section}+${expected.offset}: operand schedule mismatch`);
      }
    }
    assert(!actualInstructions.some(({ mnemonic, operands }) => mnemonic.startsWith('ldr') && /\bpc\b/.test(operands)),
      `${fn.section}: PC-relative literal load is forbidden`);
  }
  assert(expectedBranches.length === 13, 'internal transfer-count failure');
}

function expectRejected(label, fixture, reference, scratch) {
  let rejected = false;
  try { validateObject(fixture, reference, scratch); } catch { rejected = true; }
  assert(rejected, `hostile fixture was accepted: ${label}`);
}

function selfTest(reference, scratch) {
  const foreignSource = join(scratch, 'foreign.S');
  const foreignObject = join(scratch, 'foreign.o');
  const combined = join(scratch, 'combined.o');
  writeFileSync(foreignSource, '.syntax unified\n.arm\n.section .text.foreign,"ax",%progbits\n.global foreign_fixture\nforeign_fixture:\n bx lr\n');
  assemble(foreignSource, foreignObject);
  run(tool.ld, ['-r', '-o', combined, reference, foreignObject]);
  validateObject(combined, reference, scratch);

  const source = readFileSync(sourcePath, 'utf8');
  const extraSource = join(scratch, 'extra.S');
  const extraObject = join(scratch, 'extra.o');
  writeFileSync(extraSource, source.replace('END func_0018CD64', 'nop\nEND func_0018CD64'));
  assemble(extraSource, extraObject);
  expectRejected('trailing executable material', extraObject, reference, scratch);

  const symbolSource = join(scratch, 'symbol.S');
  const symbolObject = join(scratch, 'symbol.o');
  writeFileSync(symbolSource, source.replace('bl func_001602B8', 'bl func_00132A14'));
  assemble(symbolSource, symbolObject);
  expectRejected('wrong symbolic destination', symbolObject, reference, scratch);

  const globalSource = join(scratch, 'global.S');
  const globalObject = join(scratch, 'global.o');
  writeFileSync(globalSource, source.replace('END func_0018CD64', '.global hostile_boundary\nhostile_boundary:\nEND func_0018CD64'));
  assemble(globalSource, globalObject);
  expectRejected('interstitial global boundary', globalObject, reference, scratch);

  const corruptObject = join(scratch, 'corrupt.o');
  const corruptBin = join(scratch, 'corrupt.bin');
  const bytes = dumpSection(reference, '.text.func_0018CD64', corruptBin);
  bytes[0] ^= 1;
  writeFileSync(corruptBin, bytes);
  run(tool.objcopy, ['--update-section', `.text.func_0018CD64=${corruptBin}`, reference, corruptObject]);
  expectRejected('changed executable instruction', corruptObject, reference, scratch);
}

const scratch = mkdtempSync(join(tmpdir(), 'arm-ipc-wrappers-73-'));
try {
  const reference = join(scratch, 'reference.o');
  assemble(sourcePath, reference);
  const argument = process.argv[2];
  if (argument && argument !== '--self-test') validateObject(resolve(argument), reference, scratch);
  else validateObject(reference, reference, scratch);
  if (argument === '--self-test') selfTest(reference, scratch);
  console.log(`arm-ipc-wrappers-73: validated 6 functions, 428 bytes, 107 instructions, 13 relocations, 0 literals, identities 751/398${argument === '--self-test' ? '; fixtures passed' : ''}`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
