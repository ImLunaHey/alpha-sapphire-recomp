#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = resolve(ROOT, 'config/arm-ipc-templates-64.json');
const EXPECTED_SOURCE = 'src/main/arm_ipc_templates_64.S';
const EXPECTED_SHA256 = 'a2162e582126ac1851b2f597ea5d2305b298c4aa38ba13dba6d6cc55e092a009';
const MAX_BUFFER = 16 * 1024 * 1024;

const EXPECTED_LOCAL_BRANCHES = new Map([
  ['func_001819D8', [
    { offset: 36, mnemonic: 'beq', target: '.Lreturn_001819D8', targetOffset: 124 },
    { offset: 44, mnemonic: 'beq', target: '.Lnext_001819D8', targetOffset: 108 },
    { offset: 52, mnemonic: 'bgt', target: '.Lnext_001819D8', targetOffset: 108 },
    { offset: 68, mnemonic: 'beq', target: '.Lnext_001819D8', targetOffset: 108 },
    { offset: 120, mnemonic: 'blt', target: '.Lloop_001819D8', targetOffset: 32 },
  ]],
  ['func_00181AB8', [
    { offset: 40, mnemonic: 'beq', target: '.Lreturn_00181AB8', targetOffset: 128 },
    { offset: 48, mnemonic: 'beq', target: '.Lnext_00181AB8', targetOffset: 112 },
    { offset: 56, mnemonic: 'bgt', target: '.Lnext_00181AB8', targetOffset: 112 },
    { offset: 72, mnemonic: 'beq', target: '.Lnext_00181AB8', targetOffset: 112 },
    { offset: 124, mnemonic: 'blt', target: '.Lloop_00181AB8', targetOffset: 36 },
  ]],
  ['func_00181B78', [
    { offset: 32, mnemonic: 'beq', target: '.Lreturn_00181B78', targetOffset: 148 },
    { offset: 60, mnemonic: 'beq', target: '.Lsuccess_00181B78', targetOffset: 144 },
    { offset: 68, mnemonic: 'beq', target: '.Lnext_00181B78', targetOffset: 128 },
    { offset: 76, mnemonic: 'bgt', target: '.Lnext_00181B78', targetOffset: 128 },
    { offset: 92, mnemonic: 'beq', target: '.Lnext_00181B78', targetOffset: 128 },
    { offset: 140, mnemonic: 'blt', target: '.Lloop_00181B78', targetOffset: 56 },
  ]],
  ['func_00181C14', [
    { offset: 36, mnemonic: 'beq', target: '.Lreturn_00181C14', targetOffset: 124 },
    { offset: 44, mnemonic: 'beq', target: '.Lnext_00181C14', targetOffset: 108 },
    { offset: 52, mnemonic: 'bgt', target: '.Lnext_00181C14', targetOffset: 108 },
    { offset: 68, mnemonic: 'beq', target: '.Lnext_00181C14', targetOffset: 108 },
    { offset: 120, mnemonic: 'blt', target: '.Lloop_00181C14', targetOffset: 32 },
  ]],
  ['func_00181CB0', [
    { offset: 44, mnemonic: 'beq', target: '.Lrestore_00181CB0', targetOffset: 132 },
    { offset: 52, mnemonic: 'beq', target: '.Lnext_00181CB0', targetOffset: 116 },
    { offset: 60, mnemonic: 'bgt', target: '.Lnext_00181CB0', targetOffset: 116 },
    { offset: 76, mnemonic: 'beq', target: '.Lnext_00181CB0', targetOffset: 116 },
    { offset: 128, mnemonic: 'blt', target: '.Lloop_00181CB0', targetOffset: 40 },
  ]],
  ['func_00181D40', [
    { offset: 36, mnemonic: 'beq', target: '.Lreturn_00181D40', targetOffset: 124 },
    { offset: 44, mnemonic: 'beq', target: '.Lnext_00181D40', targetOffset: 108 },
    { offset: 52, mnemonic: 'bgt', target: '.Lnext_00181D40', targetOffset: 108 },
    { offset: 68, mnemonic: 'beq', target: '.Lnext_00181D40', targetOffset: 108 },
    { offset: 120, mnemonic: 'blt', target: '.Lloop_00181D40', targetOffset: 32 },
  ]],
]);

function fail(message) {
  throw new Error(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function unique(values) {
  return new Set(values).size === values.length;
}

function loadInputs() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  check(config.source === EXPECTED_SOURCE, `unexpected source path: ${config.source}`);
  const source = readFileSync(resolve(ROOT, config.source), 'utf8');
  const digest = createHash('sha256').update(source).digest('hex');
  check(digest === EXPECTED_SHA256, `source fingerprint mismatch: ${digest}`);
  check(config.sourceSha256 === EXPECTED_SHA256, 'config sourceSha256 is stale');
  return { config, source };
}

function flattenBranches(config) {
  return config.functions.flatMap(({ name, branches }) =>
    branches.map((branch) => ({ functionName: name, ...branch })));
}

function flattenLiterals(config) {
  return config.functions.flatMap(({ name, literals }) =>
    literals.map((literal) => ({ functionName: name, ...literal })));
}

function validateConfig(config) {
  check(config.schemaVersion === 1, 'schemaVersion must be 1');
  check(config.mode === 'arm', 'mode must be arm');
  check(config.totalBodySize === 1000, 'totalBodySize must be 1000');
  check(config.cumulativePoolSlots === 690 + 10, 'cumulativePoolSlots must be 700');
  check(config.cumulativePoolClasses === 366 + 1, 'cumulativePoolClasses must be 367');
  check(config.functions.length === 13, 'expected exactly 13 functions');
  check(unique(config.functions.map(({ name }) => name)), 'function names must be unique');
  check(config.functions.reduce((total, { size }) => total + size, 0) === 1000,
    'function sizes must total 1000 bytes');

  const branches = flattenBranches(config);
  check(branches.length === 5, 'expected exactly five inter-section transfers');
  const literals = flattenLiterals(config);
  check(literals.length === 10, 'expected exactly ten physical literal slots');
  check(literals.filter(({ symbol }) => symbol === 'ipc_shared_owner_63').length === 9,
    'ipc_shared_owner_63 must be reused by nine slots');
  check(literals.filter(({ symbol }) => symbol === 'ipc_halfword_owner_64').length === 1,
    'ipc_halfword_owner_64 must own one slot');
  const literalClasses = ['ipc_shared_owner_63', 'ipc_halfword_owner_64'];
  check(JSON.stringify(config.literalIdentities) === JSON.stringify(literalClasses),
    'literalIdentities contract mismatch');
  check(JSON.stringify(config.reusedLiteralIdentities) ===
    JSON.stringify(['ipc_shared_owner_63']), 'reusedLiteralIdentities contract mismatch');
  check(JSON.stringify(config.newLiteralIdentities) ===
    JSON.stringify(['ipc_halfword_owner_64']), 'newLiteralIdentities contract mismatch');

  const contract = config.branchIdentityContract;
  check(contract.mode === 'arm' && contract.minimumAlignment === 4,
    'branch identity mode/alignment mismatch');
  const primary = ['func_0017541C', 'func_00188A8C'];
  check(JSON.stringify(contract.primaryEntries) === JSON.stringify(primary),
    'primary-entry contract mismatch');
  check(JSON.stringify(contract.secondaryEntries) ===
    JSON.stringify(['service_link_secondary_64']), 'secondary-entry contract mismatch');
  check(contract.classesPairwiseDistinct === true &&
    unique([...contract.primaryEntries, ...contract.secondaryEntries]),
  'transfer identities must be pairwise distinct');

  const counts = new Map();
  for (const { symbol } of branches) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
  check(contract.sharedClasses.length === 1 &&
    contract.sharedClasses[0].symbol === 'func_00188A8C' &&
    contract.sharedClasses[0].siteCount === 3 && counts.get('func_00188A8C') === 3,
  'shared transfer class mismatch');
  const singletons = ['func_0017541C', 'service_link_secondary_64'];
  check(JSON.stringify(contract.singletonClasses) === JSON.stringify(singletons),
    'singleton transfer classes mismatch');
  for (const symbol of singletons) {
    check(counts.get(symbol) === 1, `${symbol}: singleton transfer count mismatch`);
  }
  check(counts.size === 3, 'unexpected transfer identity');
}

function parseSource(source) {
  const functions = new Map();
  let current = null;
  let adjacent = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    const begin = /^BEGIN\s+(\w+)$/.exec(line);
    const end = /^END\s+(\w+)$/.exec(line);
    if (begin) {
      check(current === null, `nested BEGIN at ${begin[1]}`);
      check(!functions.has(begin[1]), `duplicate BEGIN for ${begin[1]}`);
      current = { name: begin[1], offset: 0, instructions: [], labels: new Map(), literals: [] };
      functions.set(current.name, current);
      adjacent = null;
      continue;
    }
    if (end) {
      check(current !== null, `END without BEGIN for ${end[1]}`);
      check(current.name === end[1], `mismatched END for ${end[1]}`);
      adjacent = current;
      current = null;
      continue;
    }
    const owner = current ?? adjacent;
    if (!owner || line === '') continue;
    const label = /^(\.L\w+):$/.exec(line);
    if (label) {
      check(!owner.labels.has(label[1]), `${owner.name}: duplicate label ${label[1]}`);
      owner.labels.set(label[1], owner.offset);
      continue;
    }
    const literal = /^\.word\s+([A-Za-z_]\w*)$/.exec(line);
    if (literal && !current) {
      owner.literals.push({ offset: owner.offset, symbol: literal[1] });
      owner.offset += 4;
      continue;
    }
    if (current) {
      owner.instructions.push({ offset: owner.offset, line });
      owner.offset += 4;
    }
  }
  check(current === null, `unterminated function ${current?.name}`);
  return functions;
}

function symbolicTransfers(body) {
  const transfers = [];
  for (const { offset, line } of body.instructions) {
    const match = /^(b(?:l|lx)?(?:eq|ne|lt|gt)?)\s+([A-Za-z_]\w*)$/.exec(line);
    if (match && !/^(?:r(?:1[0-5]|[0-9])|sp|lr|pc)$/.test(match[2])) {
      transfers.push({ offset, mnemonic: match[1], symbol: match[2] });
    }
  }
  return transfers;
}

function localBranches(body) {
  const branches = [];
  for (const { offset, line } of body.instructions) {
    const match = /^(b(?:l|lx)?(?:eq|ne|lt|gt)?)\s+(\.L\w+)$/.exec(line);
    if (match) {
      branches.push({
        offset,
        mnemonic: match[1],
        target: match[2],
        targetOffset: body.labels.get(match[2]),
      });
    }
  }
  return branches;
}

function validateSource(config, source) {
  check(source.startsWith('.syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n'),
    'source must use the normative ARMv6K/VFPv2 header');
  const functions = parseSource(source);
  check(functions.size === 13, 'source function count mismatch');

  for (const entry of config.functions) {
    const body = functions.get(entry.name);
    check(body, `missing source body for ${entry.name}`);
    const bodySize = body.instructions.length * 4;
    check(bodySize === entry.size, `${entry.name}: source body size mismatch`);
    check(body.offset === entry.size + entry.literals.length * 4,
      `${entry.name}: section extent mismatch`);
    check(JSON.stringify(symbolicTransfers(body)) === JSON.stringify(entry.branches.map(
      ({ offset, mnemonic, symbol }) => ({ offset, mnemonic, symbol }))),
    `${entry.name}: inter-section transfer schedule mismatch`);
    check(JSON.stringify(body.literals) === JSON.stringify(entry.literals),
      `${entry.name}: adjacent literal schedule mismatch`);
    check(JSON.stringify(localBranches(body)) ===
      JSON.stringify(EXPECTED_LOCAL_BRANCHES.get(entry.name) ?? []),
    `${entry.name}: local branch schedule mismatch`);
  }
  check([...functions.values()].reduce((sum, body) => sum + body.instructions.length * 4, 0) ===
    1000, 'source function bodies must total 1000 bytes');
  check([...functions.values()].reduce((sum, body) => sum + body.literals.length, 0) === 10,
    'source must contain ten adjacent literal slots');
}

function runReadelf(readelf, args) {
  try {
    return execFileSync(readelf, args, {
      encoding: 'utf8',
      maxBuffer: MAX_BUFFER,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    fail(`${readelf} ${args.join(' ')} failed: ${detail}`);
  }
}

function parseSections(output) {
  const sections = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = /^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\b/.exec(line);
    if (match) sections.set(match[2], { index: Number(match[1]), size: Number.parseInt(match[3], 16) });
  }
  return sections;
}

function parseSymbols(output) {
  const symbols = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = /^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    symbols.set(match[7].replace(/\s+\(.*\)$/, ''), {
      value: Number.parseInt(match[1], 16),
      size: Number.parseInt(match[2], 10),
      type: match[3],
      bind: match[4],
      index: match[6],
    });
  }
  return symbols;
}

function parseRelocations(output) {
  const relocations = [];
  let section = null;
  for (const line of output.split(/\r?\n/)) {
    const heading = /^Relocation section '([^']+)'/.exec(line);
    if (heading) {
      section = heading[1].replace(/^\.rel(?:a)?/, '');
      continue;
    }
    const match = /^\s*([0-9a-fA-F]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
    if (section && match) {
      relocations.push({ section, offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3] });
    }
  }
  return relocations;
}

function parseHexDump(output) {
  const chunks = [];
  for (const line of output.split(/\r?\n/)) {
    const fields = line.trim().split(/\s+/);
    if (!/^0x[0-9a-fA-F]+$/.test(fields[0] ?? '')) continue;
    for (const field of fields.slice(1)) {
      if (!/^[0-9a-fA-F]{8}$/.test(field)) break;
      chunks.push(field);
    }
  }
  return Buffer.from(chunks.join(''), 'hex');
}

function armLocalBranchWord(branch) {
  const conditions = new Map([['beq', 0x0], ['blt', 0xb], ['bgt', 0xc]]);
  const condition = conditions.get(branch.mnemonic);
  check(condition !== undefined, `unsupported local branch mnemonic ${branch.mnemonic}`);
  const displacement = branch.targetOffset - (branch.offset + 8);
  check(displacement % 4 === 0, `unaligned local branch at 0x${branch.offset.toString(16)}`);
  return ((condition << 28) | 0x0a000000 | ((displacement / 4) & 0x00ffffff)) >>> 0;
}

function validateObject(config, objectPath, readelf) {
  const sections = parseSections(runReadelf(readelf, ['-SW', objectPath]));
  const symbols = parseSymbols(runReadelf(readelf, ['-sW', objectPath]));
  const relocations = parseRelocations(runReadelf(readelf, ['-rW', objectPath]));
  const expectedRelocations = [];

  for (const entry of config.functions) {
    const sectionName = `.text.${entry.name}`;
    const section = sections.get(sectionName);
    check(section, `${entry.name}: missing section ${sectionName}`);
    check(section.size === entry.size + entry.literals.length * 4,
      `${entry.name}: section size mismatch`);
    const symbol = symbols.get(entry.name);
    check(symbol && symbol.value === 0 && symbol.size === entry.size && symbol.type === 'FUNC' &&
      symbol.bind === 'GLOBAL' && Number(symbol.index) === section.index,
    `${entry.name}: function symbol metadata mismatch`);
    for (const branch of entry.branches) {
      expectedRelocations.push({ section: sectionName, offset: branch.offset,
        kind: branch.kind, symbol: branch.symbol });
    }
    for (const literal of entry.literals) {
      expectedRelocations.push({ section: sectionName, offset: literal.offset,
        kind: 'R_ARM_ABS32', symbol: literal.symbol });
    }
  }

  // A combined object may contain relocations for other batches. Only the 13
  // sections owned by this batch participate in this relocation contract.
  const ownedSections = new Set(config.functions.map(({ name }) => `.text.${name}`));
  const actualOwned = relocations.filter(({ section }) => ownedSections.has(section));
  check(actualOwned.length === expectedRelocations.length,
    `owned relocation count mismatch: expected ${expectedRelocations.length}, got ${actualOwned.length}`);
  check(actualOwned.length === 15, 'expected five transfer and ten literal relocations');
  for (const expected of expectedRelocations) {
    check(actualOwned.some((actual) => actual.section === expected.section &&
      actual.offset === expected.offset && actual.kind === expected.kind &&
      actual.symbol === expected.symbol),
    `missing relocation ${expected.section}+0x${expected.offset.toString(16)} ` +
      `${expected.kind} ${expected.symbol}`);
  }
  for (const name of new Set(expectedRelocations.map(({ symbol }) => symbol))) {
    check(symbols.get(name)?.bind === 'GLOBAL', `${name}: missing global symbol`);
  }

  for (const [functionName, branches] of EXPECTED_LOCAL_BRANCHES) {
    const entry = config.functions.find(({ name }) => name === functionName);
    const bytes = parseHexDump(runReadelf(readelf, ['-x', `.text.${functionName}`, objectPath]));
    check(bytes.length === entry.size + entry.literals.length * 4,
      `${functionName}: section hex extent mismatch`);
    for (const branch of branches) {
      check(bytes.readUInt32LE(branch.offset) === armLocalBranchWord(branch),
        `${functionName}: local branch encoding mismatch at 0x${branch.offset.toString(16)}`);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  check(args.length <= 2, 'usage: validate-arm-ipc-templates-64.mjs [objectPath [readelf]]');
  const { config, source } = loadInputs();
  validateConfig(config);
  validateSource(config, source);
  if (args.length === 0) {
    console.log('arm-ipc-templates-64: source checks passed');
    return;
  }
  validateObject(config, resolve(process.cwd(), args[0]), args[1] ?? 'arm-none-eabi-readelf');
  console.log('arm-ipc-templates-64: source and object checks passed');
}

try {
  main();
} catch (error) {
  console.error(`arm-ipc-templates-64: ${error.message}`);
  process.exitCode = 1;
}
