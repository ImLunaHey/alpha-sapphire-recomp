#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_BUFFER = 16 * 1024 * 1024;
const root = new URL('../', import.meta.url);
const configPath = new URL('config/arm-ipc-templates-66.json', root);
const sourcePath = new URL('src/main/arm_ipc_templates_66.S', root);
const specPath = new URL('docs/specs/main/arm_ipc_templates_66.md', root);

function fail(message) {
  throw new Error(message);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    ...options,
  });
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
  fail('GNU Arm tools not found; set ARM_NONE_EABI_PREFIX (for example, /opt/toolchain/bin/arm-none-eabi-)');
}

function normalize(text) {
  return `${text.replace(/\r\n/g, '\n').trimEnd()}\n`;
}

function sectionRows(readelfSections) {
  const rows = new Map();
  for (const line of readelfSections.split('\n')) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+/);
    if (match) {
      if (rows.has(match[1])) fail(`duplicate section ${match[1]}`);
      rows.set(match[1], Number.parseInt(match[2], 16));
    }
  }
  return rows;
}

function symbolRows(readelfSymbols) {
  const rows = new Map();
  for (const line of readelfSymbols.split('\n')) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
    if (!match) continue;
    const [, value, size, type, bind, visibility, index, name] = match;
    const entry = { value: Number.parseInt(value, 16), size: Number(size), type, bind, visibility, index };
    if (!rows.has(name)) rows.set(name, []);
    rows.get(name).push(entry);
  }
  return rows;
}

function relocationRows(readelfRelocations) {
  const rows = [];
  let targetSection = null;
  for (const line of readelfRelocations.split('\n')) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
    if (heading) {
      targetSection = heading[1];
      continue;
    }
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match && targetSection) {
      rows.push({ section: targetSection, offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] });
    }
  }
  return rows;
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const source = readFileSync(sourcePath, 'utf8');
const spec = readFileSync(specPath, 'utf8');
const scheduleMatch = spec.match(/## Complete normative mnemonic schedules[\s\S]*?```asm\n([\s\S]*?)```/);
if (!scheduleMatch) fail('normative assembly schedule is missing from the specification');
if (normalize(source) !== normalize(scheduleMatch[1])) fail('source differs from the complete normative schedule');

const digest = createHash('sha256').update(source).digest('hex');
if (config.sourceSha256 !== '77a5c8a918294b5848ec8a99a2949784ea2d9414e1a4384ef2d12321c48d9727') {
  fail('manifest sourceSha256 does not match the pinned batch-66 hash');
}
if (digest !== config.sourceSha256) fail(`sourceSha256 mismatch: expected ${config.sourceSha256}, got ${digest}`);
if (config.mode !== 'arm') fail('manifest mode must be arm');
if (config.functions.length !== 3) fail('expected exactly three functions');
if (config.functions.reduce((sum, func) => sum + func.size, 0) !== 1064 || config.totalBodySize !== 1064) {
  fail('body accounting must be exactly 3 functions / 1064 bytes');
}
const literals = config.functions.flatMap((func) => func.literals.map((literal) => ({ ...literal, function: func.name })));
if (literals.length !== 7) fail('expected exactly seven physical literal slots');
if (new Set(literals.map((literal) => literal.symbol)).size !== 3) fail('expected exactly three literal classes');
if (literals.filter((literal) => literal.symbol === 'ipc_allocator_owner_65').length !== 2) {
  fail('ipc_allocator_owner_65 must be reused by exactly two slots');
}
if (config.cumulativePoolSlots !== 716 || config.cumulativePoolClasses !== 374) {
  fail('cumulative accounting must be 716 slots / 374 classes');
}
if (config.branchIdentityContract.mode !== 'arm' || config.branchIdentityContract.minimumAlignment !== 4) {
  fail('branch identity contract must require four-byte-aligned ARM entries');
}
const declaredBranches = config.functions.flatMap((func) => func.branches.map((branch) => ({ ...branch, function: func.name })));
if (declaredBranches.length !== 1 || declaredBranches[0].kind !== 'R_ARM_JUMP24' ||
    declaredBranches[0].mnemonic !== 'blne' || declaredBranches[0].symbol !== 'func_00301FBC') {
  fail('expected exactly the specified conditional symbolic transfer');
}

const tools = resolveTools();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail('usage: validate-arm-ipc-templates-66.mjs [object]');
const temp = mkdtempSync(join(tmpdir(), 'arm-ipc-66-'));
try {
  const standalone = join(temp, 'batch66.o');
  const companionSource = join(temp, 'companion.S');
  const companion = join(temp, 'companion.o');
  const combined = join(temp, 'combined.o');
  run(tools.as, ['-march=armv6k', '-o', standalone, sourcePath.pathname]);
  writeFileSync(companionSource, '.syntax unified\n.arch armv6k\n.arm\n.section .text.validator_companion,"ax",%progbits\n.global validator_companion\nvalidator_companion:\n bx lr\n');
  run(tools.as, ['-march=armv6k', '-o', companion, companionSource]);
  run(tools.ld, ['-r', '-o', combined, standalone, companion]);

  function checkOwnedObject(object, label) {
    const sections = sectionRows(run(tools.readelf, ['-SW', object]));
    const symbols = symbolRows(run(tools.readelf, ['-sW', object]));
    const relocations = relocationRows(run(tools.readelf, ['-rW', object]));
    const expectedRelocations = [];

    for (const func of config.functions) {
      const section = `.text.${func.name}`;
      const expectedSectionSize = func.size + func.literals.length * 4;
      if (sections.get(section) !== expectedSectionSize) {
        fail(`${label}: ${section} size must be ${expectedSectionSize}, got ${sections.get(section)}`);
      }
      const entries = symbols.get(func.name) || [];
      if (entries.length !== 1 || entries[0].size !== func.size || entries[0].value !== 0 ||
          entries[0].type !== 'FUNC' || entries[0].bind !== 'GLOBAL') {
        fail(`${label}: invalid owned function symbol ${func.name}`);
      }
      for (const branch of func.branches) {
        expectedRelocations.push({ section, offset: branch.offset, type: branch.kind, symbol: branch.symbol });
      }
      for (const literal of func.literals) {
        expectedRelocations.push({ section, offset: literal.offset, type: 'R_ARM_ABS32', symbol: literal.symbol });
      }

      // Deliberately disassemble only the owned section, never the whole object.
      const disassembly = run(tools.objdump, ['-dr', '-j', section, object]);
      for (const branch of func.branches) {
        const offset = branch.offset.toString(16);
        const line = disassembly.split('\n').find((candidate) => new RegExp(`^\\s*${offset}:`).test(candidate));
        if (!line || !new RegExp(`\\b${branch.mnemonic}\\b`).test(line)) {
          fail(`${label}: ${func.name}+0x${offset} is not ${branch.mnemonic}`);
        }
      }
    }

    const ownedSections = new Set(config.functions.map((func) => `.text.${func.name}`));
    const actualOwned = relocations.filter((relocation) => ownedSections.has(relocation.section));
    const canonical = (entry) => `${entry.section}:${entry.offset}:${entry.type}:${entry.symbol}`;
    const actualKeys = actualOwned.map(canonical).sort();
    const expectedKeys = expectedRelocations.map(canonical).sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
      fail(`${label}: owned relocation contract differs\nexpected ${expectedKeys.join(', ')}\nactual ${actualKeys.join(', ')}`);
    }
    const transfers = actualOwned.filter((entry) => entry.type === 'R_ARM_JUMP24');
    if (transfers.length !== 1) fail(`${label}: expected exactly one R_ARM_JUMP24 transfer`);
  }

  checkOwnedObject(standalone, 'standalone');
  checkOwnedObject(combined, 'combined');
  if (supplied.length === 1) checkOwnedObject(supplied[0], 'supplied');
  console.log(`arm-ipc-templates-66: PASS (${digest}; 3 functions, 1064 bytes; 7 slots/3 classes; cumulative 716/374)`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
