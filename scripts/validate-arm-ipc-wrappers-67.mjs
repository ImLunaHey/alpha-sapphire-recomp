#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_BUFFER = 16 * 1024 * 1024;
const PINNED_SOURCE_SHA256 = 'b2365ca6075733886325a4d2fd89550848954c5a1b3f66e0d990792a078ad630';
const root = new URL('../', import.meta.url);
const configPath = new URL('config/arm-ipc-wrappers-67.json', root);
const sourcePath = new URL('src/main/arm_ipc_wrappers_67.S', root);
const specPath = new URL('docs/specs/main/arm_ipc_wrappers_67.md', root);

function fail(message) {
  throw new Error(message);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: MAX_BUFFER, ...options });
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${command} ${args.join(' ')} failed (${result.status})\n${result.stderr || result.stdout}`);
  }
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

function normalize(text) {
  return `${text.replace(/\r\n/g, '\n').trimEnd()}\n`;
}

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
    if (heading) {
      section = heading[1];
      continue;
    }
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match && section) {
      rows.push({ section, offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] });
    }
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

function literalTargets(bytes, bodySize) {
  const targets = [];
  for (let offset = 0; offset < bodySize; offset += 4) {
    const word = bytes.readUInt32LE(offset);
    const isImmediatePcLoad = (word & 0x0f7f0000) === 0x051f0000;
    if (!isImmediatePcLoad) continue;
    const displacement = word & 0xfff;
    const target = offset + 8 + ((word & 0x00800000) ? displacement : -displacement);
    if (target >= bodySize && target < bytes.length) targets.push({ offset, target, displacement });
  }
  return targets;
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const source = readFileSync(sourcePath, 'utf8');
const spec = readFileSync(specPath, 'utf8');
const schedule = spec.match(/## Complete normative mnemonic schedules[\s\S]*?```asm\n([\s\S]*?)```/);
if (!schedule) fail('normative assembly schedule is missing');
if (normalize(source) !== normalize(schedule[1])) fail('source differs from the complete normative schedule');

const digest = createHash('sha256').update(source).digest('hex');
if (digest !== PINNED_SOURCE_SHA256 || config.sourceSha256 !== PINNED_SOURCE_SHA256) fail('source hash is not pinned');
if (!spec.includes(`Source SHA-256: \`${PINNED_SOURCE_SHA256}\`.`)) fail('specification does not record the source hash');
if (config.source !== 'src/main/arm_ipc_wrappers_67.S' || config.mode !== 'arm') fail('invalid source or mode');
if (config.functions.length !== 2 || config.totalBodySize !== 812 ||
    config.functions.reduce((sum, func) => sum + func.size, 0) !== 812) fail('body accounting must be 2 functions / 812 bytes');

const literals = config.functions.flatMap((func) => func.literals.map((literal) => ({ ...literal, function: func.name })));
const classes = new Set(literals.map((literal) => literal.symbol));
if (literals.length !== 7 || classes.size !== 5) fail('literal accounting must be 7 slots / 5 classes');
if (config.cumulativePoolSlots !== 723 || config.cumulativePoolClasses !== 376) fail('cumulative accounting must be 723/376');
if (config.cumulativePoolSlots - literals.length !== 716 ||
    config.cumulativePoolClasses - config.newLiteralIdentities.length !== 374) fail('cumulative baseline must be 716/374');
if (JSON.stringify([...classes].sort()) !== JSON.stringify([...config.literalIdentities].sort())) fail('literal identity classes differ');
if (new Set(config.literalIdentities).size !== 5 || new Set(config.newLiteralIdentities).size !== 2) fail('literal identity lists contain duplicates');
for (const symbol of config.newLiteralIdentities) {
  if (config.reusedLiteralIdentities.includes(symbol)) fail(`${symbol} is both new and reused`);
}
const multiplicities = new Map([...classes].map((symbol) => [symbol, literals.filter((item) => item.symbol === symbol).length]));
if (multiplicities.get('ipc_allocator_owner_65') !== 2 || multiplicities.get('ipc_record_tree_owner_66') !== 2 ||
    multiplicities.get('ipc_dirty_flag_owner_66') !== 1 || multiplicities.get('ipc_record_tag_67') !== 1 ||
    multiplicities.get('ipc_release_callback_owner_67') !== 1) fail('literal equality-class multiplicities differ');

const contract = config.branchIdentityContract;
if (contract.mode !== 'arm' || contract.minimumAlignment !== 4 || !contract.classesPairwiseDistinct) fail('invalid branch identity contract');
if (JSON.stringify(contract.primaryEntries) !== JSON.stringify(['func_00301FBC', 'func_0017D1D4']) || contract.secondaryEntries.length !== 0) fail('branch entry classes differ');
const branches = config.functions.flatMap((func) => func.branches.map((branch) => ({ ...branch, function: func.name })));
if (branches.length !== 5 || branches.filter((item) => item.symbol === 'func_00301FBC' && item.kind === 'R_ARM_JUMP24' && item.mnemonic === 'blne').length !== 4 ||
    branches.filter((item) => item.symbol === 'func_0017D1D4' && item.kind === 'R_ARM_CALL' && item.mnemonic === 'bl').length !== 1) fail('symbolic transfer classes differ');

const tools = resolveTools();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail('usage: validate-arm-ipc-wrappers-67.mjs [object]');
const temp = mkdtempSync(join(tmpdir(), 'arm-ipc-67-'));
try {
  const standalone = join(temp, 'batch67.o');
  const fixtureSource = join(temp, 'fixture.S');
  const fixture = join(temp, 'fixture.o');
  const combined = join(temp, 'combined.o');
  run(tools.as, ['-march=armv6k', '-o', standalone, sourcePath.pathname]);
  writeFileSync(fixtureSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.validator_fixture,"ax",%progbits\n.global validator_fixture\nvalidator_fixture:\n bx lr\n');
  run(tools.as, ['-march=armv6k', '-o', fixture, fixtureSource]);
  run(tools.ld, ['-r', '-o', combined, fixture, standalone]);

  function checkOwnedObject(object, label) {
    const sections = sectionRows(run(tools.readelf, ['-SW', object]));
    const symbols = symbolRows(run(tools.readelf, ['-sW', object]));
    const relocations = relocationRows(run(tools.readelf, ['-rW', object]));
    const expected = [];
    for (const func of config.functions) {
      const section = `.text.${func.name}`;
      const sectionSize = func.size + func.literals.length * 4;
      if (func.size % 4 !== 0 || sections.get(section) !== sectionSize) fail(`${label}: invalid size for ${section}`);
      const entries = symbols.get(func.name) || [];
      if (entries.length !== 1 || entries[0].value !== 0 || entries[0].size !== func.size || entries[0].type !== 'FUNC' || entries[0].bind !== 'GLOBAL') {
        fail(`${label}: invalid function symbol ${func.name}`);
      }
      for (const branch of func.branches) expected.push({ section, offset: branch.offset, type: branch.kind, symbol: branch.symbol });
      for (const literal of func.literals) expected.push({ section, offset: literal.offset, type: 'R_ARM_ABS32', symbol: literal.symbol });

      const disassembly = run(tools.objdump, ['-dr', '-j', section, object]);
      for (const branch of func.branches) {
        const line = disassembly.split('\n').find((candidate) => new RegExp(`^\\s*${branch.offset.toString(16)}:`).test(candidate));
        if (!line || !new RegExp(`\\b${branch.mnemonic}\\b`).test(line)) fail(`${label}: wrong transfer mnemonic at ${func.name}+${branch.offset}`);
      }
      const bytes = sectionBytes(run(tools.objdump, ['-s', '-j', section, object]), sectionSize);
      if (bytes.length !== sectionSize) fail(`${label}: could not read all bytes for ${section}`);
      const reaches = literalTargets(bytes, func.size);
      const reachedSlots = [...new Set(reaches.map((reach) => reach.target))].sort((a, b) => a - b);
      const expectedSlots = func.literals.map((literal) => literal.offset).sort((a, b) => a - b);
      if (JSON.stringify(reachedSlots) !== JSON.stringify(expectedSlots)) fail(`${label}: literal reach set differs for ${func.name}`);
      if (reaches.some((reach) => reach.displacement > 4095 || reach.target % 4 !== 0)) fail(`${label}: invalid ARM literal reach in ${func.name}`);
    }
    const owned = new Set(config.functions.map((func) => `.text.${func.name}`));
    const actual = relocations.filter((entry) => owned.has(entry.section));
    const key = (entry) => `${entry.section}:${entry.offset}:${entry.type}:${entry.symbol}`;
    const actualKeys = actual.map(key).sort();
    const expectedKeys = expected.map(key).sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) fail(`${label}: relocation contract differs`);
    if (actual.filter((entry) => entry.type === 'R_ARM_ABS32').length !== 7 ||
        actual.filter((entry) => entry.type === 'R_ARM_JUMP24').length !== 4 ||
        actual.filter((entry) => entry.type === 'R_ARM_CALL').length !== 1) fail(`${label}: relocation kind counts differ`);
  }

  checkOwnedObject(standalone, 'standalone');
  checkOwnedObject(combined, 'relocatable fixture');
  if (supplied.length === 1) checkOwnedObject(supplied[0], 'supplied');
  console.log(`arm-ipc-wrappers-67: PASS (${digest}; 2 functions, 812 bytes; 7 slots/5 classes; cumulative 723/376)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
