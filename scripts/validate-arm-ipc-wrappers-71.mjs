#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_BUFFER = 16 * 1024 * 1024;
const PINNED_SOURCE_SHA256 = '99caf0aefb769a3c02d06a16c2bfc99c6b38c055302fff9b559d8d7a3911d101';
const root = new URL('../', import.meta.url);
const configPath = new URL('config/arm-ipc-wrappers-71.json', root);
const sourcePath = new URL('src/main/arm_ipc_wrappers_71.S', root);
const specPath = new URL('docs/specs/main/arm_ipc_wrappers_71.md', root);

function fail(message) { throw new Error(message); }
function same(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(message);
}
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
if (config.schemaVersion !== 1 || config.source !== 'src/main/arm_ipc_wrappers_71.S' || config.mode !== 'arm') fail('invalid schema, source, or mode');

const expectedFunctions = [
  ['func_0018BD3C', 84, 'func_0018BD90', 84],
  ['func_0018BD90', 396, 'func_0018BF20', 400],
  ['func_0018BF64', 92, 'func_0018BFC4', 96],
  ['func_0018BFC4', 60, 'func_0018C008', 68],
];
if (config.functions.length !== 4 || config.totalBodySize !== 632 ||
    config.functions.reduce((sum, func) => sum + func.size, 0) !== 632 ||
    config.functions.reduce((sum, func) => sum + func.size / 4, 0) !== 158) fail('body accounting must be 4 functions / 632 bytes / 158 instructions');
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const func = config.functions[index];
  const [name, size, nextGlobal, nextGlobalOffset] = expectedFunctions[index];
  if (func.name !== name || func.section !== `.text.${name}` || func.size !== size ||
      func.nextGlobal !== nextGlobal || func.nextGlobalOffset !== nextGlobalOffset) fail(`extent contract differs for ${name}`);
}

const expectedLiterals = [
  ['func_0018BD90', 396, [12], 'ipc_dispatch_owner_vtable_71'],
  ['func_0018BF64', 92, [8], 'ipc_text_owner_vtable_71'],
  ['func_0018BFC4', 60, [0], 'ipc_allocator_dispatch_owner_68'],
  ['func_0018BFC4', 64, [36], 'ipc_service_registry_owner_71'],
];
const literals = config.functions.flatMap((func) => func.literals.map((literal) => [func.name, literal.offset, literal.loadOffsets, literal.symbol]));
same(literals, expectedLiterals, 'literal slot/reach contract differs');
const literalIdentities = ['ipc_dispatch_owner_vtable_71', 'ipc_text_owner_vtable_71', 'ipc_allocator_dispatch_owner_68', 'ipc_service_registry_owner_71'];
const reusedIdentities = ['ipc_allocator_dispatch_owner_68'];
const newIdentities = ['ipc_dispatch_owner_vtable_71', 'ipc_text_owner_vtable_71', 'ipc_service_registry_owner_71'];
same(config.literalIdentities, literalIdentities, 'literal identities differ');
same(config.reusedLiteralIdentities, reusedIdentities, 'reused literal identities differ');
same(config.newLiteralIdentities, newIdentities, 'new literal identities differ');
if (new Set(config.literalIdentities).size !== 4 || new Set(config.newLiteralIdentities).size !== 3 ||
    config.newLiteralIdentities.some((identity) => reusedIdentities.includes(identity)) ||
    config.literalIdentities.some((identity) => ![...newIdentities, ...reusedIdentities].includes(identity))) fail('literal identity classes overlap or are incomplete');
if (config.cumulativePoolSlots !== 742 || config.cumulativePoolClasses !== 390 ||
    config.cumulativePoolSlots - literals.length !== 738 ||
    config.cumulativePoolClasses - config.newLiteralIdentities.length !== 387) fail('cumulative accounting must be 742/390 from 738/387');

const expectedBranches = [
  ['func_0018BD3C', 44, 'R_ARM_CALL', 'bl', 'func_0018D65C'],
  ['func_0018BD90', 32, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BD90', 144, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BD90', 156, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BD90', 272, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BD90', 284, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BD90', 368, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BD90', 380, 'R_ARM_JUMP24', 'blne', 'func_0018DB10'],
  ['func_0018BF64', 40, 'R_ARM_CALL', 'blx', 'func_001003E8'],
  ['func_0018BF64', 56, 'R_ARM_CALL', 'bl', 'func_00184990'],
  ['func_0018BF64', 80, 'R_ARM_CALL', 'blx', 'func_001003CC'],
  ['func_0018BFC4', 28, 'R_ARM_CALL', 'bl', 'func_001888A8'],
  ['func_0018BFC4', 44, 'R_ARM_CALL', 'bl', 'func_00171324'],
];
const branches = config.functions.flatMap((func) => func.branches.map((branch) => [func.name, branch.offset, branch.kind, branch.mnemonic, branch.symbol]));
same(branches, expectedBranches, 'symbolic transfer schedule differs');
const primaryEntries = ['func_0018D65C', 'func_00184990', 'func_0018DB10', 'func_001003E8', 'func_001003CC', 'func_001888A8', 'func_00171324'];
const armEntries = ['func_0018D65C', 'func_00184990', 'func_0018DB10', 'func_001888A8', 'func_00171324'];
const thumbEntries = ['func_001003E8', 'func_001003CC'];
const contract = config.branchIdentityContract;
if (contract.mode !== 'arm' || contract.minimumAlignment !== 2 || !contract.classesPairwiseDistinct) fail('invalid transfer identity mode/alignment/distinctness');
same(contract.primaryEntries, primaryEntries, 'primary transfer identities differ');
same(contract.secondaryEntries, [], 'secondary transfer identities must be empty');
same(contract.secondaryEntryRelations, [], 'secondary transfer relations must be empty');
same(contract.sharedClasses, [{ symbol: 'func_00184990', sites: [
  { function: 'func_0018BD90', offset: 32 }, { function: 'func_0018BD90', offset: 144 },
  { function: 'func_0018BD90', offset: 156 }, { function: 'func_0018BD90', offset: 272 },
  { function: 'func_0018BD90', offset: 284 }, { function: 'func_0018BD90', offset: 368 },
  { function: 'func_0018BF64', offset: 56 },
]}], 'shared transfer class differs');
same(contract.singletonClasses, ['func_0018D65C', 'func_0018DB10', 'func_001003E8', 'func_001003CC', 'func_001888A8', 'func_00171324'], 'singleton transfer classes differ');
same(contract.armPrimaryEntries, armEntries, 'ARM transfer identities differ');
same(contract.thumbPrimaryEntries, thumbEntries, 'Thumb transfer identities differ');
if (new Set(primaryEntries).size !== 7 || armEntries.some((entry) => thumbEntries.includes(entry)) ||
    [...armEntries, ...thumbEntries].some((entry) => !primaryEntries.includes(entry))) fail('ARM/Thumb transfer identity partition is invalid');

const tools = resolveTools();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail('usage: validate-arm-ipc-wrappers-71.mjs [object]');
const temp = mkdtempSync(join(tmpdir(), 'arm-ipc-71-'));
try {
  const standalone = join(temp, 'batch71.o');
  const foreignSource = join(temp, 'foreign.S');
  const foreign = join(temp, 'foreign.o');
  const combined = join(temp, 'combined.o');
  const hostileSource = join(temp, 'hostile.S');
  const hostile = join(temp, 'hostile.o');
  const hostileCombined = join(temp, 'hostile-combined.o');
  const identitiesSource = join(temp, 'identities.S');
  const identities = join(temp, 'identities.o');
  run(tools.as, ['-march=armv6k', '-mfpu=vfpv2', '-o', standalone, sourcePath.pathname]);
  writeFileSync(foreignSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.validator_foreign,"ax",%progbits\n.global validator_foreign\nvalidator_foreign:\n bl validator_foreign_call\n ldr r0,.Lforeign\n bx lr\n.Lforeign:\n .word validator_foreign_data\n');
  run(tools.as, ['-march=armv6k', '-o', foreign, foreignSource]);
  run(tools.ld, ['-r', '-o', combined, foreign, standalone]);
  writeFileSync(hostileSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.func_0018BF64,"ax",%progbits\n.word 0\n');
  run(tools.as, ['-march=armv6k', '-o', hostile, hostileSource]);
  run(tools.ld, ['-r', '-o', hostileCombined, standalone, hostile]);
  writeFileSync(identitiesSource, `.syntax unified\n.arch armv6k\n${armEntries.map((name, index) => `.section .text.identity_arm_${index},"ax",%progbits\n.balign 4\n.arm\n.global ${name}\n.type ${name},%function\n${name}:\n bx lr`).join('\n')}\n${thumbEntries.map((name, index) => `.section .text.identity_thumb_${index},"ax",%progbits\n.balign 2\n.thumb\n.thumb_func\n.global ${name}\n.type ${name},%function\n${name}:\n bx lr`).join('\n')}\n`);
  run(tools.as, ['-march=armv6k', '-o', identities, identitiesSource]);

  const referenceBytes = new Map();
  function checkOwnedObject(object, label, captureReference = false) {
    const sections = sectionRows(run(tools.readelf, ['-SW', object]));
    const symbols = symbolRows(run(tools.readelf, ['-sW', object]));
    const relocations = relocationRows(run(tools.readelf, ['-rW', object]));
    const expectedRelocations = [];
    let instructionCount = 0;
    for (const func of config.functions) {
      const sectionSize = Math.max(func.size, ...func.literals.map((literal) => literal.offset + 4), func.size);
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
      if (captureReference) referenceBytes.set(func.section, bytes);
      else if (!bytes.equals(referenceBytes.get(func.section))) fail(`${label}: bytes differ for ${func.section}`);
      const reaches = literalReaches(bytes, func.size);
      const expectedReaches = func.literals.flatMap((literal) => literal.loadOffsets.map((offset) => ({ offset, target: literal.offset })));
      same(reaches.map(({ offset, target }) => ({ offset, target })), expectedReaches, `${label}: literal reaches differ for ${func.name}`);
      if (reaches.some((reach) => reach.displacement > 4095 || reach.target % 4 !== 0)) fail(`${label}: invalid ARM literal reach in ${func.name}`);
    }
    if (instructionCount !== 158) fail(`${label}: instruction count must be 158`);
    const owned = new Set(config.functions.map((func) => func.section));
    const actual = relocations.filter((entry) => owned.has(entry.section));
    const key = (entry) => `${entry.section}:${entry.offset}:${entry.type}:${entry.symbol}`;
    same(actual.map(key).sort(), expectedRelocations.map(key).sort(), `${label}: relocation contract differs`);
    if (actual.filter((entry) => entry.type === 'R_ARM_ABS32').length !== 4 ||
        actual.filter((entry) => entry.type === 'R_ARM_CALL').length !== 12 ||
        actual.filter((entry) => entry.type === 'R_ARM_JUMP24').length !== 1) fail(`${label}: relocation kind counts differ`);
  }

  checkOwnedObject(standalone, 'standalone', true);
  checkOwnedObject(combined, 'foreign relocatable fixture');
  const identitySymbols = symbolRows(run(tools.readelf, ['-sW', identities]));
  for (const name of armEntries) {
    const entries = identitySymbols.get(name) || [];
    if (entries.length !== 1 || entries[0].type !== 'FUNC' || entries[0].value % 4 !== 0) fail(`ARM identity fixture has wrong state/alignment for ${name}`);
  }
  for (const name of thumbEntries) {
    const entries = identitySymbols.get(name) || [];
    if (entries.length !== 1 || entries[0].type !== 'FUNC' || entries[0].value % 2 !== 1) fail(`Thumb identity fixture has wrong state/alignment for ${name}`);
  }
  let rejectedHostile = false;
  try { checkOwnedObject(hostileCombined, 'hostile same-section fixture'); } catch { rejectedHostile = true; }
  if (!rejectedHostile) fail('hostile same-section fixture was not rejected');
  if (supplied.length === 1) checkOwnedObject(supplied[0], 'supplied');
  console.log(`arm-ipc-wrappers-71: PASS (${digest}; 4 functions, 632 bytes, 158 instructions; 13 transfers [11 ARM, 2 Thumb]; 4 slots/3 new classes; cumulative 742/390; foreign accepted, hostile rejected)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
