#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { accessSync, constants, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const configPath = join(root, 'config/arm-runtime-helpers-84.json');
const sourcePath = join(root, 'src/main/arm_runtime_helpers_84.S');
const MAX_EXECUTABLE_BYTES = 16 * 1024 * 1024;
const SOURCE_SHA256 = '28ac90e90e33f8cad7e98194a8622dfccf970ef414d52d481a17813a67f15ea7';
const FULL_SCHEDULE_SHA256 = '00cd5c2fe1f7ea32e1e75f39d23b1e49363b7112788443e14d8edad4a265534a';
const BRANCH_SCHEDULE_SHA256 = 'd235b2514febf7dc606fced98a672c741a92186d99170e07d4df0a6eb598f111';
const RETURN_SCHEDULE_SHA256 = 'a9b10daa10e814689bcb34e8c17d721525f2a1d4199d4963f99479da476ec65d';
const EXPECTED_INSTRUCTIONS = 161;
const EXPECTED_LOCAL_BRANCHES = 2;
const EXPECTED_RETURNS = 24;
const EXPECTED_MEMORY_OPERATIONS = 69;

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function executable(path) {
  try { accessSync(path, constants.X_OK); return true; } catch { return false; }
}

function commandPath(command) {
  if (command.includes('/')) return executable(command) ? command : null;
  for (const directory of (process.env.PATH ?? '').split(':')) {
    const path = join(directory || '.', command);
    if (executable(path)) return path;
  }
  return null;
}

function findNixTool(name) {
  let entries = [];
  try { entries = readdirSync('/nix/store'); } catch { return null; }
  const preferred = entries
    .filter((entry) => entry.includes('arm-none-eabi') && executable(join('/nix/store', entry, 'bin', name)))
    .sort((a, b) => {
      const a244 = a.includes('binutils-2.44') ? 0 : 1;
      const b244 = b.includes('binutils-2.44') ? 0 : 1;
      return a244 - b244 || a.localeCompare(b);
    });
  return preferred.length ? join('/nix/store', preferred[0], 'bin', name) : null;
}

function discoverTool(envName, suffix) {
  const explicit = process.env[envName];
  if (explicit) {
    const found = commandPath(explicit);
    if (!found) fail(`${envName} does not name an executable: ${explicit}`);
    return found;
  }
  const prefix = process.env.CROSS_COMPILE ?? '';
  const names = prefix ? [`${prefix}${suffix}`, `arm-none-eabi-${suffix}`] : [`arm-none-eabi-${suffix}`];
  for (const name of names) {
    const found = commandPath(name);
    if (found) return found;
  }
  const nix = findNixTool(`arm-none-eabi-${suffix}`);
  if (nix) return nix;
  fail(`cannot find ARM ${suffix}; set ${envName} or CROSS_COMPILE`);
}

function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options });
  if (result.error) fail(`${basename(tool)} failed to start: ${result.error.message}`);
  if (result.status !== 0) fail(`${basename(tool)} ${args.join(' ')} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function checkedRange(offset, size, limit, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > limit || size > limit - offset)
    fail(`${what} is outside the ELF file`);
}

function parseElf(path) {
  const data = readFileSync(path);
  if (data.length < 52 || data.toString('latin1', 0, 4) !== '\x7fELF') fail('not an ELF file');
  if (data[4] !== 1 || data[5] !== 1 || data[6] !== 1) fail('expected ELF32 little-endian version 1');
  if (data.readUInt16LE(16) !== 1 || data.readUInt16LE(18) !== 40) fail('expected an ELF32 ARM relocatable object');
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  const shnum = data.readUInt16LE(48);
  const shstrndx = data.readUInt16LE(50);
  if (shentsize !== 40 || shnum === 0 || shstrndx >= shnum) fail('unsupported or malformed section table');
  checkedRange(shoff, shentsize * shnum, data.length, 'section table');
  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const at = shoff + index * shentsize;
    const section = {
      index, nameOffset: data.readUInt32LE(at), type: data.readUInt32LE(at + 4),
      flags: data.readUInt32LE(at + 8), address: data.readUInt32LE(at + 12),
      offset: data.readUInt32LE(at + 16), size: data.readUInt32LE(at + 20),
      link: data.readUInt32LE(at + 24), info: data.readUInt32LE(at + 28),
      align: data.readUInt32LE(at + 32), entrySize: data.readUInt32LE(at + 36),
    };
    if (section.type !== 8) checkedRange(section.offset, section.size, data.length, `section ${index}`);
    sections.push(section);
  }
  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail('section-name table is not a string table');
  function stringAt(table, offset, what) {
    if (offset >= table.size) fail(`${what} string offset is out of bounds`);
    const start = table.offset + offset;
    const end = data.indexOf(0, start);
    if (end < 0 || end >= table.offset + table.size) fail(`${what} is unterminated`);
    return data.toString('utf8', start, end);
  }
  for (const section of sections) section.name = stringAt(shstr, section.nameOffset, `section ${section.index} name`);
  const executableSections = sections.filter((section) => (section.flags & 4) !== 0);
  let executableTotal = 0;
  for (const section of executableSections) {
    if (section.size > MAX_EXECUTABLE_BYTES) fail(`${section.name} exceeds the 16 MiB executable-section limit`);
    executableTotal += section.size;
    if (executableTotal > MAX_EXECUTABLE_BYTES) fail('aggregate executable data exceeds the 16 MiB limit');
  }
  const symbols = [];
  for (const symtab of sections.filter((section) => section.type === 2)) {
    if (symtab.link >= sections.length || sections[symtab.link].type !== 3 || symtab.entrySize !== 16 || symtab.size % 16)
      fail('malformed symbol table');
    const strings = sections[symtab.link];
    for (let at = symtab.offset; at < symtab.offset + symtab.size; at += 16) {
      const nameOffset = data.readUInt32LE(at);
      symbols.push({
        name: stringAt(strings, nameOffset, 'symbol name'), value: data.readUInt32LE(at + 4),
        size: data.readUInt32LE(at + 8), info: data[at + 12], other: data[at + 13],
        sectionIndex: data.readUInt16LE(at + 14),
      });
    }
  }
  for (const relocation of sections.filter((section) => section.type === 4 || section.type === 9)) {
    if (relocation.size !== 0) fail(`relocations are forbidden (${relocation.name})`);
  }
  return { sections, executableSections, symbols };
}

function parseDisassembly(output, functionName) {
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-f]+):\s+[0-9a-f]+\s+([a-z][a-z0-9.]*)\s*(.*?)\s*$/i);
    if (!match) continue;
    let operands = match[3].replace(/\s+@.*$/, '').trim().replace(/\s+/g, ' ');
    instructions.push({ offset: Number.parseInt(match[1], 16), offsetHex: match[1].toLowerCase(), mnemonic: match[2].toLowerCase(), operands });
  }
  if (!instructions.length) fail(`no instructions disassembled for ${functionName}`);
  return instructions;
}

function validateObject(path, config, objdump) {
  const elf = parseElf(path);
  const expectedSections = new Set(config.functions.map(({ name }) => `.text.${name}`));
  for (const section of elf.executableSections) {
    if (section.size !== 0 && !expectedSections.has(section.name)) fail(`unexpected nonempty executable section ${section.name}`);
  }
  const fullSchedule = [];
  const branchSchedule = [];
  const returnSchedule = [];
  let instructionCount = 0;
  let memoryCount = 0;
  for (const expected of config.functions) {
    const sectionName = `.text.${expected.name}`;
    const matches = elf.sections.filter((section) => section.name === sectionName);
    if (matches.length !== 1) fail(`expected exactly one ${sectionName} section`);
    const section = matches[0];
    if ((section.flags & 6) !== 6 || section.type !== 1 || section.address !== 0 || section.size !== expected.size || section.align !== 4)
      fail(`${sectionName} has incorrect type, flags, address, size, or alignment`);
    const symbols = elf.symbols.filter((symbol) => symbol.name === expected.name);
    if (symbols.length !== 1) fail(`expected exactly one ${expected.name} symbol`);
    const symbol = symbols[0];
    if ((symbol.info >> 4) !== 1 || (symbol.info & 15) !== 2 || symbol.other !== 0 || symbol.sectionIndex !== section.index || symbol.value !== 0 || symbol.size !== expected.size)
      fail(`${expected.name} has incorrect binding, type, visibility, section, value, or size`);
    const output = run(objdump, ['-d', '-j', sectionName, path]);
    const instructions = parseDisassembly(output, expected.name);
    if (instructions.length * 4 !== expected.size || instructions.at(-1).offset + 4 !== expected.size)
      fail(`${expected.name} disassembly does not exactly cover its function boundary`);
    instructionCount += instructions.length;
    for (const instruction of instructions) {
      const { offset, offsetHex, mnemonic, operands } = instruction;
      const canonicalOperands = /^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)
        ? (operands.match(/^([0-9a-f]+)\b/i)?.[1].toLowerCase() ?? operands)
        : operands;
      fullSchedule.push(`${expected.name}:${offsetHex}:${mnemonic}:${canonicalOperands}`);
      if (/^(ldr|str|ldm|stm|vldr|vstr|vldm|vstm)/.test(mnemonic)) memoryCount++;
      if (/\b(?:pc|r15)\b/i.test(operands)) fail(`${expected.name}+0x${offsetHex} uses PC-relative data`);
      if (/^blx?(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)) fail(`${expected.name}+0x${offsetHex} contains a call`);
      if (mnemonic === 'bx') {
        if (operands !== 'lr') fail(`${expected.name}+0x${offsetHex} has a non-return indirect branch`);
        returnSchedule.push(`${expected.name}:${offsetHex}:${mnemonic}:${operands}`);
      } else if (/^bx/.test(mnemonic)) {
        fail(`${expected.name}+0x${offsetHex} has a non-return indirect branch`);
      } else if (/^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)) {
        const targetMatch = operands.match(/^([0-9a-f]+)\b/i);
        if (!targetMatch) fail(`${expected.name}+0x${offsetHex} has an unparseable branch target`);
        const target = Number.parseInt(targetMatch[1], 16);
        if (target < 0 || target >= expected.size || target % 4) fail(`${expected.name}+0x${offsetHex} branches outside its function`);
        branchSchedule.push(`${expected.name}:${offsetHex}:${mnemonic}:${target.toString(16)}`);
      }
    }
  }
  const allowedGlobals = new Set(config.functions.map(({ name }) => name));
  for (const symbol of elf.symbols) {
    if ((symbol.info >> 4) === 1 && symbol.sectionIndex !== 0 && !allowedGlobals.has(symbol.name))
      fail(`unexpected defined global symbol ${symbol.name}`);
  }
  if (instructionCount !== EXPECTED_INSTRUCTIONS) fail(`instruction count ${instructionCount}, expected ${EXPECTED_INSTRUCTIONS}`);
  if (branchSchedule.length !== EXPECTED_LOCAL_BRANCHES) fail(`local-branch count ${branchSchedule.length}, expected ${EXPECTED_LOCAL_BRANCHES}`);
  if (returnSchedule.length !== EXPECTED_RETURNS) fail(`return count ${returnSchedule.length}, expected ${EXPECTED_RETURNS}`);
  if (memoryCount !== EXPECTED_MEMORY_OPERATIONS) fail(`memory-operation count ${memoryCount}, expected ${EXPECTED_MEMORY_OPERATIONS}`);
  const fullHash = sha256(fullSchedule.join('\n'));
  const branchHash = sha256(branchSchedule.join('\n'));
  const returnHash = sha256(returnSchedule.join('\n'));
  if (fullHash !== FULL_SCHEDULE_SHA256) fail(`instruction schedule SHA-256 mismatch: ${fullHash}`);
  if (branchHash !== config.branchScheduleSha256) fail(`branch schedule SHA-256 mismatch: ${branchHash}`);
  if (returnHash !== config.returnScheduleSha256) fail(`return schedule SHA-256 mismatch: ${returnHash}`);
  return { instructionCount, branchCount: branchSchedule.length, returnCount: returnSchedule.length, memoryCount };
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
if (config.schemaVersion !== 1 || config.mode !== 'arm' || config.source !== 'src/main/arm_runtime_helpers_84.S') fail('neutral config header does not match batch 84');
if (config.functions.length !== 24 || config.totalBodySize !== 644 || config.totalAdjacentSize !== 0) fail('neutral config totals do not match batch 84');
if (config.functions.some((entry) => entry.calls.length || entry.adjacentWords.length)) fail('calls and adjacent data must be empty');
if (config.pcRelativeDataAccesses.length || Object.keys(config.symbolicIdentities).length || Object.keys(config.symbolicSlots).length) fail('PC-relative and symbolic schedules must be empty');
if (config.branchScheduleSha256 !== BRANCH_SCHEDULE_SHA256 || config.returnScheduleSha256 !== RETURN_SCHEDULE_SHA256) fail('neutral schedule hashes do not match batch 84');
const identity = config.identityClasses?.call_free_runtime_helpers_84;
if (!identity || JSON.stringify(identity.members) !== JSON.stringify(config.functions.map(({ name }) => name)) || JSON.stringify(identity.parameters) !== JSON.stringify(['controlFlowSchedule', 'memoryAccessSchedule', 'arithmeticSchedule']))
  fail('neutral identity class does not exactly match batch 84');
const source = readFileSync(sourcePath);
const sourceHash = sha256(source);
if (config.sourceSha256 !== SOURCE_SHA256 || sourceHash !== SOURCE_SHA256) fail(`source SHA-256 mismatch: ${sourceHash}`);

const assembler = discoverTool('ARM_NONE_EABI_AS', 'as');
const objdump = discoverTool('ARM_NONE_EABI_OBJDUMP', 'objdump');
const temporary = mkdtempSync(join(tmpdir(), 'arm-runtime-helpers-84-'));
try {
  const objectPath = join(temporary, 'helpers.o');
  run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', objectPath, sourcePath]);
  const counts = validateObject(objectPath, config, objdump);

  const hostileSource = join(temporary, 'hostile.S');
  const hostileObject = join(temporary, 'hostile.o');
  writeFileSync(hostileSource, `${source.toString('utf8')}\n.section .text.hostile,"ax",%progbits\n.global hostile\n.type hostile,%function\nhostile:\n  bx lr\n.size hostile,.-hostile\n`);
  run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', hostileObject, hostileSource]);
  let rejected = false;
  try { validateObject(hostileObject, config, objdump); } catch { rejected = true; }
  if (!rejected) fail('hostile combined object was not rejected');

  console.log(`validated arm-runtime-helpers-84: 24 functions, 644 bytes, ${counts.instructionCount} instructions, ${counts.branchCount} local branches, ${counts.returnCount} returns, ${counts.memoryCount} memory operations, 0 relocations/calls/PC-relative accesses/adjacent bytes`);
  console.log(`source SHA-256 ${sourceHash}; hostile combined-object check rejected as expected`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
