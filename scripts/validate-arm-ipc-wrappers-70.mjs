#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_BUFFER = 16 * 1024 * 1024;
const PINNED_SOURCE_SHA256 = 'b3a6dd722b089ef5abc32300d2a932dfd3f87a0a182dae933381aec6c647a455';
const root = new URL('../', import.meta.url);
const configPath = new URL('config/arm-ipc-wrappers-70.json', root);
const sourcePath = new URL('src/main/arm_ipc_wrappers_70.S', root);
const specPath = new URL('docs/specs/main/arm_ipc_wrappers_70.md', root);

function fail(message) { throw new Error(message); }

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: MAX_BUFFER, ...options });
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} ${args.join(' ')} failed (${result.status})\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function exists(command) {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', maxBuffer: MAX_BUFFER });
  return !result.error && result.status === 0;
}

function resolveTools() {
  const prefixes = [process.env.ARM_NONE_EABI_PREFIX, 'arm-none-eabi-'].filter(Boolean);
  for (const prefix of prefixes) {
    const tools = Object.fromEntries(['as', 'ld', 'readelf', 'objdump'].map((name) => [name, `${prefix}${name}`]));
    if (Object.values(tools).every(exists)) return tools;
  }
  if (existsSync('/nix/store')) {
    for (const entry of readdirSync('/nix/store').sort()) {
      const prefix = join('/nix/store', entry, 'bin', 'arm-none-eabi-');
      const tools = Object.fromEntries(['as', 'ld', 'readelf', 'objdump'].map((name) => [name, `${prefix}${name}`]));
      if (Object.values(tools).every(existsSync)) return tools;
    }
  }
  fail('GNU Arm tools not found; set ARM_NONE_EABI_PREFIX');
}

function normalize(text) { return `${text.replace(/\r\n/g, '\n').trimEnd()}\n`; }

function sectionRows(text) {
  const rows = new Map();
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+/);
    if (match) rows.set(match[1], Number.parseInt(match[2], 16));
  }
  return rows;
}

function symbolRows(text) {
  const rows = new Map();
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
    if (!match) continue;
    const [, value, size, type, bind, visibility, index, name] = match;
    const entry = { value: Number.parseInt(value, 16), size: Number(size), type, bind, visibility, index };
    if (!rows.has(name)) rows.set(name, []);
    rows.get(name).push(entry);
  }
  return rows;
}

function relocationRows(text) {
  const rows = [];
  let section = null;
  for (const line of text.split('\n')) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
    if (heading) { section = heading[1]; continue; }
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match && section) rows.push({ section, offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] });
  }
  return rows;
}

function sectionBytes(text, expectedSize) {
  const bytes = [];
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
    if (!match) continue;
    for (const group of match[1].trim().split(/\s+/)) {
      for (let index = 0; index < 8; index += 2) bytes.push(Number.parseInt(group.slice(index, index + 2), 16));
    }
  }
  return Buffer.from(bytes.slice(0, expectedSize));
}

function literalReaches(bytes, bodySize) {
  const reaches = [];
  for (let offset = 0; offset < bodySize; offset += 4) {
    const word = bytes.readUInt32LE(offset);
    if ((word & 0x0f7f0000) !== 0x051f0000) continue;
    const displacement = word & 0xfff;
    const target = offset + 8 + ((word & 0x00800000) ? displacement : -displacement);
    if (target >= bodySize && target < bytes.length) reaches.push({ offset, target, displacement });
  }
  return reaches;
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const source = readFileSync(sourcePath, 'utf8');
const spec = readFileSync(specPath, 'utf8');
const schedule = spec.match(/## Complete normative mnemonic schedules[\s\S]*?```asm\n([\s\S]*?)```/);
if (!schedule || normalize(source) !== normalize(schedule[1])) fail('source differs from the complete normative schedule');

const digest = createHash('sha256').update(source).digest('hex');
if (digest !== PINNED_SOURCE_SHA256 || config.sourceSha256 !== PINNED_SOURCE_SHA256) fail('source hash is not pinned');
if (!spec.includes(`Implementation source SHA-256: \`${PINNED_SOURCE_SHA256}\`.`)) fail('specification does not record the source hash');
if (config.source !== 'src/main/arm_ipc_wrappers_70.S' || config.mode !== 'arm') fail('invalid source or mode');

const expectedFunctions = [
  ['func_0018B220', 124, 'func_0018B2AC', 140],
  ['func_0018B2AC', 140, 'func_0018B348', 156],
  ['func_0018B348', 76, 'func_0018B394', 76],
  ['func_0018B394', 92, 'func_0018B3F4', 96],
];
if (config.functions.length !== 4 || config.totalBodySize !== 432 ||
    config.functions.reduce((sum, func) => sum + func.size, 0) !== 432 ||
    config.functions.reduce((sum, func) => sum + func.size / 4, 0) !== 108) fail('body accounting must be 4 functions / 432 bytes / 108 instructions');
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const func = config.functions[index];
  const [name, size, nextGlobal, nextGlobalOffset] = expectedFunctions[index];
  if (func.name !== name || func.section !== `.text.${name}` || func.size !== size ||
      func.nextGlobal !== nextGlobal || func.nextGlobalOffset !== nextGlobalOffset) fail(`extent contract differs for ${name}`);
}

const expectedLiterals = [
  ['func_0018B220', 124, [8], 'ipc_endpoint_primary_vtable_70'],
  ['func_0018B220', 128, [12], 'ipc_endpoint_secondary_vtable_70'],
  ['func_0018B220', 132, [48], 'ipc_endpoint_state_table_70'],
  ['func_0018B220', 136, [76], 'ipc_allocator_dispatch_owner_68'],
  ['func_0018B2AC', 140, [12], 'ipc_allocator_dispatch_owner_68'],
  ['func_0018B2AC', 144, [40], 'ipc_wait_error_code_70'],
  ['func_0018B2AC', 148, [44], 'ipc_wait_log_context_70'],
  ['func_0018B2AC', 152, [100], 'service_timing_scale_46'],
  ['func_0018B394', 92, [12, 64], 'ipc_slot_error_context_70'],
];
const literals = config.functions.flatMap((func) => func.literals.map((literal) => [func.name, literal.offset, literal.loadOffsets, literal.symbol]));
if (JSON.stringify(literals) !== JSON.stringify(expectedLiterals)) fail('literal slot/reach contract differs');
const literalIdentities = [...new Set(expectedLiterals.map((entry) => entry[3]))];
const reusedIdentities = ['ipc_allocator_dispatch_owner_68', 'service_timing_scale_46'];
const newIdentities = literalIdentities.filter((identity) => !reusedIdentities.includes(identity));
if (JSON.stringify(config.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(config.reusedLiteralIdentities) !== JSON.stringify(reusedIdentities) ||
    JSON.stringify(config.newLiteralIdentities) !== JSON.stringify(newIdentities)) fail('literal identities differ');
if (config.cumulativePoolSlots !== 738 || config.cumulativePoolClasses !== 387 ||
    config.cumulativePoolSlots - literals.length !== 729 ||
    config.cumulativePoolClasses - config.newLiteralIdentities.length !== 381) fail('cumulative accounting must be 738/387 from 729/381');

const expectedBranches = [
  ['func_0018B220', 44, 'R_ARM_CALL', 'bl', 'func_00132C04'],
  ['func_0018B2AC', 56, 'R_ARM_CALL', 'bl', 'func_00178974'],
  ['func_0018B2AC', 88, 'R_ARM_CALL', 'bl', 'func_0018DCA8'],
  ['func_0018B2AC', 116, 'R_ARM_CALL', 'bl', 'func_00188878'],
  ['func_0018B348', 48, 'R_ARM_CALL', 'bl', 'func_0018B9B4'],
  ['func_0018B394', 28, 'R_ARM_CALL', 'bl', 'func_00178974'],
  ['func_0018B394', 80, 'R_ARM_CALL', 'bl', 'func_00178974'],
];
const branches = config.functions.flatMap((func) => func.branches.map((branch) => [func.name, branch.offset, branch.kind, branch.mnemonic, branch.symbol]));
if (JSON.stringify(branches) !== JSON.stringify(expectedBranches)) fail('symbolic transfer schedule differs');
const contract = config.branchIdentityContract;
if (contract.mode !== 'arm' || contract.minimumAlignment !== 4 || !contract.classesPairwiseDistinct ||
    JSON.stringify(contract.primaryEntries) !== JSON.stringify(['func_00132C04', 'func_00178974', 'func_0018DCA8', 'func_00188878', 'func_0018B9B4']) ||
    contract.secondaryEntries.length !== 0 || contract.secondaryEntryRelations.length !== 0 ||
    JSON.stringify(contract.sharedClasses) !== JSON.stringify([{ symbol: 'func_00178974', sites: [
      { function: 'func_0018B2AC', offset: 56 }, { function: 'func_0018B394', offset: 28 }, { function: 'func_0018B394', offset: 80 },
    ] }]) ||
    JSON.stringify(contract.singletonClasses) !== JSON.stringify(['func_00132C04', 'func_0018DCA8', 'func_00188878', 'func_0018B9B4'])) fail('branch identity contract differs');

const tools = resolveTools();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail('usage: validate-arm-ipc-wrappers-70.mjs [object]');
const temp = mkdtempSync(join(tmpdir(), 'arm-ipc-70-'));
try {
  const standalone = join(temp, 'batch70.o');
  const foreignSource = join(temp, 'foreign.S');
  const foreign = join(temp, 'foreign.o');
  const combined = join(temp, 'combined.o');
  const hostileSource = join(temp, 'hostile.S');
  const hostile = join(temp, 'hostile.o');
  const hostileCombined = join(temp, 'hostile-combined.o');
  run(tools.as, ['-march=armv6k', '-mfpu=vfpv2', '-o', standalone, sourcePath.pathname]);
  writeFileSync(foreignSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.validator_foreign,"ax",%progbits\n.global validator_foreign\nvalidator_foreign:\n bl validator_foreign_call\n ldr r0,.Lforeign\n bx lr\n.Lforeign:\n .word validator_foreign_data\n');
  run(tools.as, ['-march=armv6k', '-o', foreign, foreignSource]);
  run(tools.ld, ['-r', '-o', combined, foreign, standalone]);
  writeFileSync(hostileSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.func_0018B348,"ax",%progbits\n.word 0\n');
  run(tools.as, ['-march=armv6k', '-o', hostile, hostileSource]);
  run(tools.ld, ['-r', '-o', hostileCombined, standalone, hostile]);

  function checkOwnedObject(object, label) {
    const sections = sectionRows(run(tools.readelf, ['-SW', object]));
    const symbols = symbolRows(run(tools.readelf, ['-sW', object]));
    const relocations = relocationRows(run(tools.readelf, ['-rW', object]));
    const expectedRelocations = [];
    let instructionCount = 0;
    for (const func of config.functions) {
      const sectionSize = Math.max(func.size, ...func.literals.map((literal) => literal.offset + 4));
      if (sections.get(func.section) !== sectionSize) fail(`${label}: invalid size for ${func.section}`);
      const entries = symbols.get(func.name) || [];
      if (entries.length !== 1 || entries[0].value !== 0 || entries[0].size !== func.size || entries[0].type !== 'FUNC' || entries[0].bind !== 'GLOBAL') fail(`${label}: invalid function symbol ${func.name}`);
      for (const branch of func.branches) expectedRelocations.push({ section: func.section, offset: branch.offset, type: branch.kind, symbol: branch.symbol });
      for (const literal of func.literals) expectedRelocations.push({ section: func.section, offset: literal.offset, type: 'R_ARM_ABS32', symbol: literal.symbol });
      const disassembly = run(tools.objdump, ['-dr', '-j', func.section, object]);
      instructionCount += disassembly.split('\n').filter((line) => { const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+/); return match && Number.parseInt(match[1], 16) < func.size; }).length;
      for (const branch of func.branches) {
        const line = disassembly.split('\n').find((candidate) => new RegExp(`^\\s*${branch.offset.toString(16)}:`).test(candidate));
        if (!line || !new RegExp(`\\b${branch.mnemonic}\\b`).test(line)) fail(`${label}: wrong transfer mnemonic at ${func.name}+${branch.offset}`);
      }
      const bytes = sectionBytes(run(tools.objdump, ['-s', '-j', func.section, object]), sectionSize);
      if (bytes.length !== sectionSize) fail(`${label}: could not read all bytes for ${func.section}`);
      const reaches = literalReaches(bytes, func.size);
      const expectedReaches = func.literals.flatMap((literal) => literal.loadOffsets.map((offset) => ({ offset, target: literal.offset })));
      if (JSON.stringify(reaches.map(({ offset, target }) => ({ offset, target }))) !== JSON.stringify(expectedReaches)) fail(`${label}: literal reaches differ for ${func.name}`);
      if (reaches.some((reach) => reach.displacement > 4095 || reach.target % 4 !== 0)) fail(`${label}: invalid ARM literal reach in ${func.name}`);
    }
    if (instructionCount !== 108) fail(`${label}: instruction count must be 108`);
    const owned = new Set(config.functions.map((func) => func.section));
    const actual = relocations.filter((entry) => owned.has(entry.section));
    const key = (entry) => `${entry.section}:${entry.offset}:${entry.type}:${entry.symbol}`;
    if (JSON.stringify(actual.map(key).sort()) !== JSON.stringify(expectedRelocations.map(key).sort())) fail(`${label}: relocation contract differs`);
    if (actual.filter((entry) => entry.type === 'R_ARM_ABS32').length !== 9 ||
        actual.filter((entry) => entry.type === 'R_ARM_CALL').length !== 7) fail(`${label}: relocation kind counts differ`);
  }

  checkOwnedObject(standalone, 'standalone');
  checkOwnedObject(combined, 'foreign relocatable fixture');
  let rejectedHostile = false;
  try { checkOwnedObject(hostileCombined, 'hostile same-section fixture'); } catch { rejectedHostile = true; }
  if (!rejectedHostile) fail('hostile same-section fixture was not rejected');
  if (supplied.length === 1) checkOwnedObject(supplied[0], 'supplied');
  console.log(`arm-ipc-wrappers-70: PASS (${digest}; 4 functions, 432 bytes, 108 instructions; 7 transfers; 9 slots/6 new classes; cumulative 738/387; foreign accepted, hostile rejected)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
