#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_BUFFER = 16 * 1024 * 1024;
const PINNED_SOURCE_SHA256 = '2fd6bdebe246629d9628b2c20020414baa552fa11af8a731659e751668a2b6c3';
const root = new URL('../', import.meta.url);
const configPath = new URL('config/arm-ipc-wrappers-68.json', root);
const sourcePath = new URL('src/main/arm_ipc_wrappers_68.S', root);
const specPath = new URL('docs/specs/main/arm_ipc_wrappers_68.md', root);

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
if (config.source !== 'src/main/arm_ipc_wrappers_68.S' || config.mode !== 'arm') fail('invalid source or mode');

const expectedFunctions = [
  ['func_00184990', 72, 'func_001849DC', 76],
  ['func_00186A54', 88, 'func_00186AAC', 88],
  ['func_00188090', 244, 'func_00188184', 244],
  ['func_00188228', 124, 'func_001882A4', 124],
  ['func_001882F8', 16, 'func_00188308', 16],
  ['func_00188308', 28, 'func_00188324', 28],
  ['func_00188324', 16, 'func_00188338', 20],
  ['func_0018850C', 44, 'func_00188538', 44],
];
if (config.functions.length !== 8 || config.totalBodySize !== 632 ||
    config.functions.reduce((sum, func) => sum + func.size, 0) !== 632 ||
    config.functions.reduce((sum, func) => sum + func.size / 4, 0) !== 158) fail('body accounting must be 8 functions / 632 bytes / 158 instructions');
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const func = config.functions[index];
  const [name, size, nextGlobal, nextGlobalOffset] = expectedFunctions[index];
  if (func.name !== name || func.section !== `.text.${name}` || func.size !== size ||
      func.nextGlobal !== nextGlobal || func.nextGlobalOffset !== nextGlobalOffset) fail(`extent contract differs for ${name}`);
}
if (config.functions[6].anonymousMaterialOffset !== 16) fail('anonymous material contract differs');

const literals = config.functions.flatMap((func) => func.literals.map((literal) => ({ ...literal, function: func.name })));
if (literals.length !== 1 || JSON.stringify(literals[0]) !== JSON.stringify({ offset: 72, loadOffsets: [4], symbol: 'ipc_allocator_dispatch_owner_68', function: 'func_00184990' })) fail('literal slot/reach contract differs');
if (JSON.stringify(config.literalIdentities) !== JSON.stringify(['ipc_allocator_dispatch_owner_68']) ||
    config.reusedLiteralIdentities.length !== 0 || JSON.stringify(config.newLiteralIdentities) !== JSON.stringify(['ipc_allocator_dispatch_owner_68'])) fail('literal identities differ');
if (config.cumulativePoolSlots !== 724 || config.cumulativePoolClasses !== 377 ||
    config.cumulativePoolSlots - literals.length !== 723 || config.cumulativePoolClasses - config.newLiteralIdentities.length !== 376) fail('cumulative accounting must be 724/377 from 723/376');

const expectedBranches = [
  ['func_00184990', 48, 'R_ARM_CALL', 'bl', 'func_002FECF8'],
  ['func_00186A54', 56, 'R_ARM_CALL', 'bl', 'func_00186EB8'], ['func_00186A54', 68, 'R_ARM_CALL', 'bl', 'func_0018C008'],
  ['func_00188090', 104, 'R_ARM_CALL', 'bl', 'func_0018CB00'], ['func_00188090', 112, 'R_ARM_CALL', 'bl', 'func_0018CA98'],
  ['func_00188090', 176, 'R_ARM_CALL', 'bl', 'func_0018CB5C'], ['func_00188090', 208, 'R_ARM_CALL', 'bl', 'func_00191024'],
  ['func_00188228', 24, 'R_ARM_CALL', 'bl', 'func_0017541C'], ['func_00188228', 32, 'R_ARM_CALL', 'bl', 'func_0018CCF4'],
  ['func_00188228', 80, 'R_ARM_CALL', 'bl', 'func_0018CD00'], ['func_001882F8', 12, 'R_ARM_JUMP24', 'b', 'func_0017A8E8'],
  ['func_00188308', 8, 'R_ARM_CALL', 'bl', 'func_001882A4'], ['func_00188308', 16, 'R_ARM_CALL', 'bl', 'service_list_reset_secondary_68'],
];
const branches = config.functions.flatMap((func) => func.branches.map((branch) => [func.name, branch.offset, branch.kind, branch.mnemonic, branch.symbol]));
if (JSON.stringify(branches) !== JSON.stringify(expectedBranches)) fail('symbolic transfer schedule differs');
const contract = config.branchIdentityContract;
const destinations = expectedBranches.map((entry) => entry[4]);
if (contract.mode !== 'arm' || contract.minimumAlignment !== 4 || !contract.classesPairwiseDistinct ||
    JSON.stringify(contract.primaryEntries) !== JSON.stringify(destinations.slice(0, 12)) ||
    JSON.stringify(contract.secondaryEntries) !== JSON.stringify(['service_list_reset_secondary_68']) ||
    JSON.stringify(contract.singletonClasses) !== JSON.stringify(destinations) || contract.sharedClasses.length !== 0 ||
    JSON.stringify(contract.secondaryEntryRelations) !== JSON.stringify([{ symbol: 'service_list_reset_secondary_68', owner: 'func_0017A640', ownerOffset: 608, nextGlobal: 'func_0017A8A8', bytesBeforeNextGlobal: 8 }])) fail('branch identity contract differs');

const tools = resolveTools();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail('usage: validate-arm-ipc-wrappers-68.mjs [object]');
const temp = mkdtempSync(join(tmpdir(), 'arm-ipc-68-'));
try {
  const standalone = join(temp, 'batch68.o');
  const fixtureSource = join(temp, 'fixture.S');
  const fixture = join(temp, 'fixture.o');
  const combined = join(temp, 'combined.o');
  run(tools.as, ['-march=armv6k', '-mfpu=vfpv2', '-o', standalone, sourcePath.pathname]);
  writeFileSync(fixtureSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.validator_fixture,"ax",%progbits\n.global validator_fixture\nvalidator_fixture:\n bx lr\n');
  run(tools.as, ['-march=armv6k', '-o', fixture, fixtureSource]);
  run(tools.ld, ['-r', '-o', combined, fixture, standalone]);

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
    if (instructionCount !== 158) fail(`${label}: instruction count must be 158`);
    const owned = new Set(config.functions.map((func) => func.section));
    const actual = relocations.filter((entry) => owned.has(entry.section));
    const key = (entry) => `${entry.section}:${entry.offset}:${entry.type}:${entry.symbol}`;
    if (JSON.stringify(actual.map(key).sort()) !== JSON.stringify(expectedRelocations.map(key).sort())) fail(`${label}: relocation contract differs`);
    if (actual.filter((entry) => entry.type === 'R_ARM_ABS32').length !== 1 || actual.filter((entry) => entry.type === 'R_ARM_CALL').length !== 12 || actual.filter((entry) => entry.type === 'R_ARM_JUMP24').length !== 1) fail(`${label}: relocation kind counts differ`);
  }

  checkOwnedObject(standalone, 'standalone');
  checkOwnedObject(combined, 'relocatable fixture');
  if (supplied.length === 1) checkOwnedObject(supplied[0], 'supplied');
  console.log(`arm-ipc-wrappers-68: PASS (${digest}; 8 functions, 632 bytes, 158 instructions; 13 transfers; 1 slot/class; cumulative 724/377)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
