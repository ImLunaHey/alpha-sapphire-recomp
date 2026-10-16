#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config', 'arm-runtime-helpers-85.json');
const FULL_SCHEDULE_SHA256 = '93e2c0c506c285cd93272516e2336f89f404a7811f115e387a6f5abd61cf4f6a';
const MAX_FILE_BYTES = 64 * 1024 * 1024;
const MAX_EXEC_SECTION_BYTES = 16 * 1024 * 1024;
const MAX_SECTIONS = 4096;

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canRun(command) {
  if (!command || /[\0\r\n]/u.test(command)) return false;
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', stdio: 'ignore' });
  return !result.error && result.status === 0;
}

function discoverTool(kind) {
  const explicit = process.env[`ARM_NONE_EABI_${kind.toUpperCase()}`];
  if (explicit) {
    if (!canRun(explicit)) fail(`${kind}: configured tool is not executable: ${explicit}`);
    return explicit;
  }
  const prefix = process.env.CROSS_COMPILE ?? '';
  const candidates = [
    prefix ? `${prefix}${kind}` : '',
    `arm-none-eabi-${kind}`,
    `arm-linux-gnueabi-${kind}`,
    `arm-linux-gnueabihf-${kind}`,
  ];
  for (const candidate of [...new Set(candidates)]) {
    if (canRun(candidate)) return candidate;
  }
  fail(`unable to find an Arm GNU ${kind}; set ARM_NONE_EABI_${kind.toUpperCase()} or CROSS_COMPILE`);
}

function run(command, args, description) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (result.error) fail(`${description}: ${result.error.message}`);
  if (result.status !== 0) fail(`${description} failed (${result.status}): ${(result.stderr || result.stdout).trim()}`);
  return result.stdout;
}

function checkedRange(offset, size, limit, label) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 ||
      offset > limit || size > limit - offset) {
    fail(`ELF ${label} is out of bounds`);
  }
}

function cString(buffer, tableStart, tableSize, offset, label) {
  if (!Number.isInteger(offset) || offset < 0 || offset >= tableSize) fail(`ELF ${label} string offset is out of bounds`);
  const start = tableStart + offset;
  const end = buffer.indexOf(0, start);
  if (end < start || end >= tableStart + tableSize) fail(`ELF ${label} string is unterminated`);
  return buffer.toString('utf8', start, end);
}

function parseElf(path) {
  const fileSize = statSync(path).size;
  if (fileSize > MAX_FILE_BYTES) fail(`ELF file exceeds ${MAX_FILE_BYTES} bytes`);
  const b = readFileSync(path);
  if (b.length < 52 || b[0] !== 0x7f || b.toString('ascii', 1, 4) !== 'ELF') fail('not an ELF file');
  if (b[4] !== 1 || b[5] !== 1 || b[6] !== 1) fail('expected ELF32 little-endian version 1');
  if (b.readUInt16LE(16) !== 1 || b.readUInt16LE(18) !== 40) fail('expected a relocatable Arm ELF object');
  const shoff = b.readUInt32LE(32);
  const ehsize = b.readUInt16LE(40);
  const shentsize = b.readUInt16LE(46);
  const shnum = b.readUInt16LE(48);
  const shstrndx = b.readUInt16LE(50);
  if (ehsize !== 52 || shentsize !== 40 || shnum === 0 || shnum > MAX_SECTIONS || shstrndx >= shnum) {
    fail('unsupported or malformed ELF section table');
  }
  checkedRange(shoff, shentsize * shnum, b.length, 'section table');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    const section = {
      index: i,
      nameOffset: b.readUInt32LE(p),
      type: b.readUInt32LE(p + 4),
      flags: b.readUInt32LE(p + 8),
      addr: b.readUInt32LE(p + 12),
      offset: b.readUInt32LE(p + 16),
      size: b.readUInt32LE(p + 20),
      link: b.readUInt32LE(p + 24),
      info: b.readUInt32LE(p + 28),
      align: b.readUInt32LE(p + 32),
      entsize: b.readUInt32LE(p + 36),
    };
    if (section.type !== 8) checkedRange(section.offset, section.size, b.length, `section ${i}`);
    if ((section.flags & 4) !== 0 && section.size > MAX_EXEC_SECTION_BYTES) {
      fail(`executable section ${i} exceeds ${MAX_EXEC_SECTION_BYTES} bytes`);
    }
    sections.push(section);
  }
  const names = sections[shstrndx];
  if (names.type !== 3) fail('section-name table is not a string table');
  for (const section of sections) {
    section.name = cString(b, names.offset, names.size, section.nameOffset, 'section-name');
  }
  const symbols = [];
  for (const symtab of sections.filter((s) => s.type === 2)) {
    if (symtab.entsize !== 16 || symtab.size % 16 !== 0 || symtab.link >= sections.length) fail('malformed ELF symbol table');
    const strings = sections[symtab.link];
    if (strings.type !== 3) fail('symbol table does not link to a string table');
    for (let p = symtab.offset; p < symtab.offset + symtab.size; p += 16) {
      const nameOffset = b.readUInt32LE(p);
      symbols.push({
        name: nameOffset === 0 ? '' : cString(b, strings.offset, strings.size, nameOffset, 'symbol-name'),
        value: b.readUInt32LE(p + 4),
        size: b.readUInt32LE(p + 8),
        bind: b[p + 12] >>> 4,
        type: b[p + 12] & 15,
        shndx: b.readUInt16LE(p + 14),
      });
    }
  }
  return { sections, symbols };
}

function parseDisassembly(output, functionName, expectedSize) {
  const instructions = [];
  for (const line of output.split(/\r?\n/u)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+([0-9a-fA-F]{8})\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*?)\s*$/u);
    if (!match) continue;
    const offset = Number.parseInt(match[1], 16);
    if (offset >= expectedSize) fail(`${functionName}: instruction outside function boundary`);
    instructions.push({
      offset,
      mnemonic: match[3].toLowerCase(),
      operands: match[4].trim().replace(/\s+@.*$/u, ''),
    });
  }
  if (instructions.length !== expectedSize / 4) fail(`${functionName}: expected ${expectedSize / 4} instructions, found ${instructions.length}`);
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].offset !== i * 4) fail(`${functionName}: non-contiguous instruction schedule`);
  }
  return instructions;
}

function validateObject(path, config, objdump, composite) {
  const elf = parseElf(path);
  const expectedNames = new Set(config.functions.map((f) => f.name));
  const expectedSections = new Set(config.functions.map((f) => `.text.${f.name}`));
  const nonemptyExec = elf.sections.filter((s) => (s.flags & 4) !== 0 && s.size !== 0);
  const unexpectedExec = nonemptyExec.filter((s) => !expectedSections.has(s.name));
  if (unexpectedExec.length) fail(`unexpected executable section: ${unexpectedExec[0].name || '<unnamed>'}`);
  if (nonemptyExec.length !== config.functions.length) fail(`expected ${config.functions.length} owned executable sections, found ${nonemptyExec.length}`);
  const relocations = elf.sections.filter((s) => (s.type === 4 || s.type === 9) && s.size !== 0);
  if (relocations.length) fail(`relocations are forbidden (${relocations[0].name})`);
  const definedGlobals = elf.symbols.filter((s) => (s.bind === 1 || s.bind === 2) && s.shndx !== 0);
  const unexpectedGlobals = definedGlobals.filter((s) => !expectedNames.has(s.name));
  if (unexpectedGlobals.length) fail(`unexpected defined global: ${unexpectedGlobals[0].name || '<anonymous>'}`);
  if (definedGlobals.length !== config.functions.length) fail(`expected ${config.functions.length} defined globals, found ${definedGlobals.length}`);

  const fullSchedule = [];
  const branchSchedule = [];
  const returnSchedule = [];
  let totalSize = 0;
  let memoryOperations = 0;
  let returns = 0;
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const sections = elf.sections.filter((s) => s.name === sectionName);
    if (sections.length !== 1) fail(`${fn.name}: expected exactly one owned section`);
    const section = sections[0];
    if (section.type !== 1 || (section.flags & 6) !== 6 || section.size !== fn.size || section.align !== 4) {
      fail(`${fn.name}: section type, flags, size, or alignment mismatch`);
    }
    totalSize += section.size;
    const matches = definedGlobals.filter((s) => s.name === fn.name);
    if (matches.length !== 1 || matches[0].type !== 2 || matches[0].shndx !== section.index ||
        matches[0].value !== 0 || matches[0].size !== fn.size) {
      fail(`${fn.name}: global function symbol boundary mismatch`);
    }
    const output = run(objdump, ['-d', '-j', sectionName, path], `disassemble ${fn.name}`);
    const instructions = parseDisassembly(output, fn.name, fn.size);
    for (const insn of instructions) {
      const entry = `${fn.name}:${insn.offset.toString(16)}:${insn.mnemonic}:${insn.operands}`;
      fullSchedule.push(entry);
      if (/^(?:vldm|vstm|vldr|vstr|ldr|str|ldm|stm)/u.test(insn.mnemonic)) memoryOperations++;
      if (/^blx?/u.test(insn.mnemonic)) fail(`${fn.name}: call instruction is forbidden`);
      if (/^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/u.test(insn.mnemonic)) {
        branchSchedule.push(`${fn.name}:${insn.offset.toString(16)}:${insn.mnemonic}:${insn.operands}`);
      }
      if (insn.mnemonic === 'bx' && insn.operands === 'lr') {
        returnSchedule.push(entry);
        returns++;
      } else if (insn.mnemonic === 'bx' || /\bpc\b/iu.test(insn.operands)) {
        fail(`${fn.name}: indirect branch or PC-relative access is forbidden`);
      }
    }
  }
  if (totalSize !== config.totalBodySize || totalSize !== 576) fail(`body-size total mismatch: ${totalSize}`);
  if (fullSchedule.length !== 144) fail(`instruction total mismatch: ${fullSchedule.length}`);
  if (memoryOperations !== 61) fail(`memory-operation total mismatch: ${memoryOperations}`);
  if (returns !== 24) fail(`return total mismatch: ${returns}`);
  if (branchSchedule.length !== 0) fail(`direct-branch total mismatch: ${branchSchedule.length}`);
  const fullHash = sha256(fullSchedule.join('\n'));
  if (fullHash !== FULL_SCHEDULE_SHA256) fail(`full instruction schedule hash mismatch: ${fullHash}`);
  if (sha256(branchSchedule.join('\n')) !== config.branchScheduleSha256) fail('direct-branch schedule hash mismatch');
  if (sha256(returnSchedule.join('\n')) !== config.returnScheduleSha256) fail('return schedule hash mismatch');
  if (config.totalAdjacentSize !== 0 || config.pcRelativeDataAccesses.length !== 0) fail('configuration requires adjacent or PC-relative data');
  return { composite, totalSize, instructions: fullSchedule.length, memoryOperations, returns };
}

function quoteInclude(path) {
  return path.replace(/\\/gu, '\\\\').replace(/"/gu, '\\"');
}

function expectRejected(action, pattern, label) {
  try {
    action();
  } catch (error) {
    if (pattern.test(String(error.message))) return;
    fail(`${label} produced the wrong rejection: ${error.message}`);
  }
  fail(`${label} was incorrectly accepted`);
}

function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  if (config.schemaVersion !== 1 || config.mode !== 'arm' || config.totalBodySize !== 576 ||
      config.totalAdjacentSize !== 0 || !Array.isArray(config.functions) || config.functions.length !== 24 ||
      !Array.isArray(config.pcRelativeDataAccesses) || config.pcRelativeDataAccesses.length !== 0) {
    fail('configuration shape or fixed totals mismatch');
  }
  const configuredNames = new Set();
  for (const fn of config.functions) {
    if (!/^func_[0-9A-F]{8}$/u.test(fn.name) || configuredNames.has(fn.name) || fn.size !== 24 ||
        !Array.isArray(fn.calls) || fn.calls.length !== 0 ||
        !Array.isArray(fn.adjacentWords) || fn.adjacentWords.length !== 0) {
      fail(`invalid function contract: ${fn.name ?? '<unnamed>'}`);
    }
    configuredNames.add(fn.name);
  }
  const sourcePath = resolve(ROOT, config.source);
  if (!existsSync(sourcePath)) fail(`missing source: ${config.source}`);
  const source = readFileSync(sourcePath);
  if (sha256(source) !== config.sourceSha256) fail('source SHA-256 mismatch');
  if (!source.toString('utf8').includes('\n\tmov\tr0, r0\n')) fail('legacy mov r0, r0 spelling is missing');
  const assembler = discoverTool('as');
  const objdump = discoverTool('objdump');
  const temp = mkdtempSync(join(tmpdir(), 'arm-runtime-helpers-85-'));
  try {
    const isolated = join(temp, 'isolated.o');
    run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', isolated, sourcePath], 'assemble isolated object');
    const result = validateObject(isolated, config, objdump, false);

    const include = quoteInclude(sourcePath);
    const compositeSource = join(temp, 'composite.S');
    const composite = join(temp, 'composite.o');
    writeFileSync(compositeSource, `.include "${include}"\n.section .note.runtime_helpers_85,"",%note\n.Lcomposite_note:\n.byte 85\n`);
    run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', composite, compositeSource], 'assemble composite object');
    validateObject(composite, config, objdump, true);

    const execSource = join(temp, 'hostile-exec.S');
    const execObject = join(temp, 'hostile-exec.o');
    writeFileSync(execSource, `.include "${include}"\n.section .text.hostile,"ax",%progbits\n.word 0xe1a00000\n`);
    run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', execObject, execSource], 'assemble hostile executable object');
    expectRejected(() => validateObject(execObject, config, objdump, true), /unexpected executable section/u, 'hostile executable section');

    const globalSource = join(temp, 'hostile-global.S');
    const globalObject = join(temp, 'hostile-global.o');
    writeFileSync(globalSource, `.include "${include}"\n.section .data.hostile,"aw",%progbits\n.global hostile_global_85\nhostile_global_85:\n.word 0\n`);
    run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', globalObject, globalSource], 'assemble hostile global object');
    expectRejected(() => validateObject(globalObject, config, objdump, true), /unexpected defined global/u, 'hostile defined global');

    console.log(`arm-runtime-helpers-85: OK (${result.totalSize} bytes, ${result.instructions} instructions, ${result.memoryOperations} memory operations, ${result.returns} returns; isolated, composite, and hostile checks passed)`);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(`arm-runtime-helpers-85: FAIL: ${error.message}`);
  process.exitCode = 1;
}
