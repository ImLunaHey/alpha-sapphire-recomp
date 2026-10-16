#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_BUFFER = 16 * 1024 * 1024;
const PINNED_SOURCE_SHA256 = 'e2480389de33b142512bf4a004a51bbc95c080e38bf35f84fdb8a799b54a33ca';
const root = new URL('../', import.meta.url);
const configPath = new URL('config/arm-ipc-wrappers-72.json', root);
const sourcePath = new URL('src/main/arm_ipc_wrappers_72.S', root);
const specPath = new URL('docs/specs/main/arm_ipc_wrappers_72.md', root);

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
if (config.schemaVersion !== 1 || config.source !== 'src/main/arm_ipc_wrappers_72.S' || config.mode !== 'arm') fail('invalid schema, source, or mode');

const expectedFunctions = [
  ['func_0018C18C', 152, 'func_0018C238', 172],
  ['func_0018C238', 152, 'func_0018C2D4', 156],
  ['func_0018C3EC', 300, 'func_0018C62C', 576],
  ['func_0018CA70', 40, 'func_0018CA98', 40],
];
if (config.functions.length !== 4 || config.totalBodySize !== 644 ||
    config.functions.reduce((sum, func) => sum + func.size, 0) !== 644 ||
    config.functions.reduce((sum, func) => sum + func.size / 4, 0) !== 161) fail('body accounting must be 4 functions / 644 bytes / 161 instructions');
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const func = config.functions[index];
  const [name, size, nextGlobal, nextGlobalOffset] = expectedFunctions[index];
  if (func.name !== name || func.section !== `.text.${name}` || func.size !== size ||
      func.nextGlobal !== nextGlobal || func.nextGlobalOffset !== nextGlobalOffset) fail(`extent contract differs for ${name}`);
}

const expectedLiterals = [
  ['func_0018C18C', 152, [8], 'ipc_state_flags_72'],
  ['func_0018C18C', 156, [24], 'ipc_frame_payload_table_72'],
  ['func_0018C18C', 160, [28, 56, 132], 'ipc_shared_control_owner_72'],
  ['func_0018C18C', 164, [84, 92], 'ipc_shutdown_service_owner_72'],
  ['func_0018C18C', 168, [124], 'ipc_registration_handle_72'],
  ['func_0018C238', 152, [144], 'ipc_shared_control_owner_72'],
  ['func_0018C3EC', 300, [20], 'ipc_exchange_context_72'],
  ['func_0018C3EC', 304, [24], 'ipc_submission_owner_72'],
  ['func_0018C3EC', 308, [44], 'ipc_payload_stride_72'],
];
const literals = config.functions.flatMap((func) => func.literals.map((literal) => [func.name, literal.offset, literal.loadOffsets, literal.symbol]));
same(literals, expectedLiterals, 'literal slot/reach contract differs');
const literalIdentities = ['ipc_state_flags_72', 'ipc_frame_payload_table_72', 'ipc_shared_control_owner_72', 'ipc_shutdown_service_owner_72', 'ipc_registration_handle_72', 'ipc_exchange_context_72', 'ipc_submission_owner_72', 'ipc_payload_stride_72'];
same(config.literalIdentities, literalIdentities, 'literal identities differ');
same(config.reusedLiteralIdentities, [], 'reused literal identities must be empty');
same(config.newLiteralIdentities, literalIdentities, 'new literal identities differ');
if (new Set(literalIdentities).size !== 8 || config.cumulativePoolSlots !== 751 || config.cumulativePoolClasses !== 398 ||
    config.cumulativePoolSlots - literals.length !== 742 ||
    config.cumulativePoolClasses - config.newLiteralIdentities.length !== 390) fail('cumulative accounting must be 751/398 from 742/390');

const expectedBranches = [
  ['func_0018C18C', 36, 'R_ARM_CALL', 'bl', 'func_0018C62C'],
  ['func_0018C18C', 60, 'R_ARM_CALL', 'bl', 'ipc_refresh_secondary_72'],
  ['func_0018C18C', 88, 'R_ARM_CALL', 'bl', 'func_001600B0'],
  ['func_0018C18C', 100, 'R_ARM_CALL', 'bl', 'func_00132A14'],
  ['func_0018C18C', 128, 'R_ARM_JUMP24', 'b', 'ipc_registration_secondary_72'],
  ['func_0018C18C', 136, 'R_ARM_CALL', 'bl', 'func_0018C6B4'],
  ['func_0018C238', 32, 'R_ARM_CALL', 'bl', 'func_00179DD0'],
  ['func_0018C238', 148, 'R_ARM_JUMP24', 'b', 'func_00179FBC'],
  ['func_0018C3EC', 8, 'R_ARM_CALL', 'bl', 'func_0017E4D8'],
  ['func_0018C3EC', 28, 'R_ARM_CALL', 'bl', 'func_00186EB8'],
  ['func_0018C3EC', 96, 'R_ARM_CALL', 'bl', 'ipc_publish_secondary_72'],
  ['func_0018C3EC', 112, 'R_ARM_CALL', 'bl', 'ipc_publish_secondary_72'],
  ['func_0018C3EC', 128, 'R_ARM_CALL', 'bl', 'func_0018E820'],
  ['func_0018C3EC', 144, 'R_ARM_CALL', 'bl', 'func_0018E820'],
  ['func_0018C3EC', 156, 'R_ARM_CALL', 'bl', 'func_0018E5C0'],
  ['func_0018C3EC', 168, 'R_ARM_CALL', 'bl', 'func_0018E76C'],
  ['func_0018C3EC', 184, 'R_ARM_CALL', 'bl', 'func_0018E7A0'],
  ['func_0018C3EC', 196, 'R_ARM_CALL', 'bl', 'func_0018E54C'],
  ['func_0018C3EC', 212, 'R_ARM_CALL', 'bl', 'func_0018E5F4'],
  ['func_0018C3EC', 268, 'R_ARM_JUMP24', 'blne', 'func_001603A0'],
  ['func_0018CA70', 24, 'R_ARM_CALL', 'bl', 'func_00190C20'],
];
const branches = config.functions.flatMap((func) => func.branches.map((branch) => [func.name, branch.offset, branch.kind, branch.mnemonic, branch.symbol]));
same(branches, expectedBranches, 'symbolic transfer schedule differs');
const primaryEntries = ['func_0018C62C', 'func_001600B0', 'func_00132A14', 'func_0018C6B4', 'func_00179DD0', 'func_00179FBC', 'func_0017E4D8', 'func_00186EB8', 'func_0018E820', 'func_0018E5C0', 'func_0018E76C', 'func_0018E7A0', 'func_0018E54C', 'func_0018E5F4', 'func_001603A0', 'func_00190C20'];
const secondaryEntries = ['ipc_publish_secondary_72', 'ipc_registration_secondary_72', 'ipc_refresh_secondary_72'];
const secondaryRelations = [
  { symbol: 'ipc_publish_secondary_72', owner: 'func_0018C008', ownerOffset: 32, nextGlobal: 'func_0018C18C', bytesBeforeNextGlobal: 356 },
  { symbol: 'ipc_registration_secondary_72', owner: 'func_00132C20', ownerOffset: 172, nextGlobal: 'func_00132CFC', bytesBeforeNextGlobal: 48 },
  { symbol: 'ipc_refresh_secondary_72', owner: 'func_0018C3EC', ownerOffset: 312, nextGlobal: 'func_0018C62C', bytesBeforeNextGlobal: 264 },
];
const sharedClasses = [
  { symbol: 'ipc_publish_secondary_72', sites: [{ function: 'func_0018C3EC', offset: 96 }, { function: 'func_0018C3EC', offset: 112 }] },
  { symbol: 'func_0018E820', sites: [{ function: 'func_0018C3EC', offset: 128 }, { function: 'func_0018C3EC', offset: 144 }] },
];
const singletonClasses = ['func_0018C62C', 'ipc_refresh_secondary_72', 'func_001600B0', 'func_00132A14', 'ipc_registration_secondary_72', 'func_0018C6B4', 'func_00179DD0', 'func_00179FBC', 'func_0017E4D8', 'func_00186EB8', 'func_0018E5C0', 'func_0018E76C', 'func_0018E7A0', 'func_0018E54C', 'func_0018E5F4', 'func_001603A0', 'func_00190C20'];
const contract = config.branchIdentityContract;
if (contract.mode !== 'arm' || contract.minimumAlignment !== 4 || !contract.classesPairwiseDistinct) fail('invalid transfer identity mode/alignment/distinctness');
same(contract.primaryEntries, primaryEntries, 'primary transfer identities differ');
same(contract.secondaryEntries, secondaryEntries, 'secondary transfer identities differ');
same(contract.secondaryEntryRelations, secondaryRelations, 'secondary transfer relations differ');
same(contract.sharedClasses, sharedClasses, 'shared transfer classes differ');
same(contract.singletonClasses, singletonClasses, 'singleton transfer classes differ');
const branchSymbols = branches.map((entry) => entry[4]);
const transferIdentities = [...primaryEntries, ...secondaryEntries];
if (new Set(transferIdentities).size !== 19 || branchSymbols.some((symbol) => !transferIdentities.includes(symbol)) ||
    transferIdentities.some((symbol) => !branchSymbols.includes(symbol))) fail('transfer identity classes are incomplete');

const tools = resolveTools();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail('usage: validate-arm-ipc-wrappers-72.mjs [object]');
const temp = mkdtempSync(join(tmpdir(), 'arm-ipc-72-'));
try {
  const standalone = join(temp, 'batch72.o');
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
  writeFileSync(hostileSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.func_0018C3EC,"ax",%progbits\n.word 0\n');
  run(tools.as, ['-march=armv6k', '-o', hostile, hostileSource]);
  run(tools.ld, ['-r', '-o', hostileCombined, standalone, hostile]);

  const relationSymbols = new Set(secondaryRelations.flatMap((relation) => [relation.owner, relation.symbol, relation.nextGlobal]));
  const relationAssembly = secondaryRelations.map((relation, index) => `.section .text.identity_relation_${index},"ax",%progbits\n.balign 4\n.arm\n.global ${relation.owner},${relation.symbol},${relation.nextGlobal}\n.type ${relation.owner},%function\n.type ${relation.symbol},%function\n.type ${relation.nextGlobal},%function\n${relation.owner}:\n.space ${relation.ownerOffset}\n${relation.symbol}:\n.space ${relation.bytesBeforeNextGlobal}\n${relation.nextGlobal}:\n bx lr`).join('\n');
  const primaryAssembly = primaryEntries.filter((name) => !relationSymbols.has(name)).map((name, index) => `.section .text.identity_primary_${index},"ax",%progbits\n.balign 4\n.arm\n.global ${name}\n.type ${name},%function\n${name}:\n bx lr`).join('\n');
  writeFileSync(identitiesSource, `.syntax unified\n.arch armv6k\n${relationAssembly}\n${primaryAssembly}\n`);
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
      const lines = disassembly.split('\n');
      instructionCount += lines.filter((line) => { const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+/); return match && Number.parseInt(match[1], 16) < func.size; }).length;
      for (const branch of func.branches) {
        const line = lines.find((candidate) => new RegExp(`^\\s*${branch.offset.toString(16)}:`).test(candidate));
        if (!line || !new RegExp(`\\b${branch.mnemonic}\\b`).test(line)) fail(`${label}: wrong transfer mnemonic at ${func.name}+${branch.offset}`);
      }
      const bytes = sectionBytes(run(tools.objdump, ['-s', '-j', func.section, object]), sectionSize);
      if (bytes.length !== sectionSize) fail(`${label}: could not read all bytes for ${func.section}`);
      if (captureReference) referenceBytes.set(func.section, bytes);
      else if (!bytes.equals(referenceBytes.get(func.section))) fail(`${label}: bytes differ for ${func.section}`);
      const reaches = literalReaches(bytes, func.size).map(({ offset, target }) => ({ offset, target }));
      const expectedReaches = func.literals.flatMap((literal) => literal.loadOffsets.map((offset) => ({ offset, target: literal.offset }))).sort((a, b) => a.offset - b.offset);
      same(reaches, expectedReaches, `${label}: literal reaches differ for ${func.name}`);
    }
    if (instructionCount !== 161) fail(`${label}: instruction count must be 161`);
    const owned = new Set(config.functions.map((func) => func.section));
    const actual = relocations.filter((entry) => owned.has(entry.section));
    const key = (entry) => `${entry.section}:${entry.offset}:${entry.type}:${entry.symbol}`;
    same(actual.map(key).sort(), expectedRelocations.map(key).sort(), `${label}: relocation contract differs`);
    if (actual.filter((entry) => entry.type === 'R_ARM_ABS32').length !== 9 ||
        actual.filter((entry) => entry.type === 'R_ARM_CALL').length !== 18 ||
        actual.filter((entry) => entry.type === 'R_ARM_JUMP24').length !== 3) fail(`${label}: relocation kind counts differ`);
  }

  checkOwnedObject(standalone, 'standalone', true);
  checkOwnedObject(combined, 'foreign relocatable fixture');
  const identitySymbols = symbolRows(run(tools.readelf, ['-sW', identities]));
  function oneIdentity(name) {
    const entries = identitySymbols.get(name) || [];
    if (entries.length !== 1 || entries[0].type !== 'FUNC' || entries[0].bind !== 'GLOBAL' || entries[0].value % 4 !== 0) fail(`identity fixture has wrong type/alignment for ${name}`);
    return entries[0];
  }
  const identityKeys = transferIdentities.map((name) => { const entry = oneIdentity(name); return `${entry.index}:${entry.value}`; });
  if (new Set(identityKeys).size !== transferIdentities.length) fail('identity fixture does not keep all transfer classes distinct');
  for (const relation of secondaryRelations) {
    const owner = oneIdentity(relation.owner);
    const secondary = oneIdentity(relation.symbol);
    const nextGlobal = oneIdentity(relation.nextGlobal);
    if (owner.index !== secondary.index || secondary.index !== nextGlobal.index ||
        secondary.value - owner.value !== relation.ownerOffset ||
        nextGlobal.value - secondary.value !== relation.bytesBeforeNextGlobal) fail(`secondary positional relation differs for ${relation.symbol}`);
  }
  let rejectedHostile = false;
  try { checkOwnedObject(hostileCombined, 'hostile same-section fixture'); } catch { rejectedHostile = true; }
  if (!rejectedHostile) fail('hostile same-section fixture was not rejected');
  if (supplied.length === 1) checkOwnedObject(supplied[0], 'supplied');
  console.log(`arm-ipc-wrappers-72: PASS (${digest}; 4 functions, 644 bytes, 161 instructions; 21 transfers/19 classes; 9 slots/8 new classes; cumulative 751/398; secondary relations exact; foreign accepted, hostile rejected)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
