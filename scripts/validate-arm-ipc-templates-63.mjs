#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = resolve(ROOT, 'config/arm-ipc-templates-63.json');
const EXPECTED_SOURCE = 'src/main/arm_ipc_templates_63.S';
const EXPECTED_SHA256 = 'eb6518eda0ae95f9375de609cbe76109401a3e8da57f50bbfe55eba8756a7582';
const MAX_BUFFER = 16 * 1024 * 1024;

const EXPECTED_LOCAL_BRANCHES = [
  { offset: 8, mnemonic: 'beq', target: '.Lsuccess_63', targetOffset: 44 },
  { offset: 16, mnemonic: 'beq', target: '.Lnull_left_63', targetOffset: 52 },
  { offset: 24, mnemonic: 'beq', target: '.Lnull_right_63', targetOffset: 64 },
  { offset: 40, mnemonic: 'bne', target: '.Lreturn_63', targetOffset: 48 },
  { offset: 60, mnemonic: 'b', target: '.Lcompare_63', targetOffset: 0 },
  { offset: 72, mnemonic: 'b', target: '.Lcompare_63', targetOffset: 0 },
];

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
  check(config.totalBodySize === 820, 'totalBodySize must be 820');
  check(config.cumulativePoolSlots === 690, 'cumulativePoolSlots must be 690');
  check(config.cumulativePoolClasses === 366, 'cumulativePoolClasses must be 366');
  check(config.functions.length === 12, 'expected exactly 12 functions');
  check(unique(config.functions.map(({ name }) => name)), 'function names must be unique');
  check(config.functions.reduce((total, { size }) => total + size, 0) === 820,
    'function sizes must total 820 bytes');

  const branches = flattenBranches(config);
  check(branches.length === 12, 'expected exactly 12 inter-section transfers');
  const literals = flattenLiterals(config);
  check(literals.length === 4, 'expected exactly four physical literal slots');
  check(literals.filter(({ symbol }) => symbol === 'ipc_empty_text_63').length === 1,
    'empty-text class must have one slot');
  check(literals.filter(({ symbol }) => symbol === 'ipc_shared_owner_63').length === 3,
    'shared-owner class must have three slots');
  const literalClasses = ['ipc_empty_text_63', 'ipc_shared_owner_63'];
  check(JSON.stringify(config.literalIdentities) === JSON.stringify(literalClasses),
    'literalIdentities contract mismatch');
  check(config.reusedLiteralIdentities.length === 0, 'no literal identity may be reused');
  check(JSON.stringify(config.newLiteralIdentities) === JSON.stringify(literalClasses),
    'newLiteralIdentities contract mismatch');

  const contract = config.branchIdentityContract;
  check(contract.mode === 'arm' && contract.minimumAlignment === 4,
    'branch identity mode/alignment mismatch');
  const primary = ['func_00184990', 'func_0010046E', 'func_00188A8C'];
  check(JSON.stringify(contract.primaryEntries) === JSON.stringify(primary),
    'primary-entry contract mismatch');
  check(contract.secondaryEntries.length === 0, 'secondaryEntries must be empty');
  check(unique(contract.primaryEntries) && contract.classesPairwiseDistinct === true,
    'primary transfer identities must be pairwise distinct');

  const counts = new Map();
  for (const { symbol } of branches) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
  const shared = new Map(contract.sharedClasses.map(({ symbol, siteCount }) =>
    [symbol, siteCount]));
  check(shared.size === 2 && shared.get('func_00184990') === 8 &&
    shared.get('func_00188A8C') === 3, 'shared transfer classes mismatch');
  for (const [symbol, count] of shared) {
    check(counts.get(symbol) === count, `shared transfer count mismatch for ${symbol}`);
  }
  check(JSON.stringify(contract.singletonClasses) === JSON.stringify(['func_0010046E']),
    'singleton transfer class mismatch');
  check(counts.get('func_0010046E') === 1, 'comparison transfer count must be one');
  check(unique([...shared.keys(), ...contract.singletonClasses]),
    'shared and singleton transfer identities must be disjoint');
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
    const match = /^(b(?:l|lx)?(?:eq|ne|lt)?)\s+([A-Za-z_]\w*)$/.exec(line);
    if (match && !/^(?:r(?:1[0-5]|[0-9])|sp|lr|pc)$/.test(match[2])) {
      transfers.push({ offset, mnemonic: match[1], symbol: match[2] });
    }
  }
  return transfers;
}

function localBranches(body) {
  const branches = [];
  for (const { offset, line } of body.instructions) {
    const match = /^(b(?:l|lx)?(?:eq|ne|lt)?)\s+(\.L\w+)$/.exec(line);
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
  check(functions.size === 12, 'source function count mismatch');

  for (const entry of config.functions) {
    const body = functions.get(entry.name);
    check(body, `missing source body for ${entry.name}`);
    const bodySize = body.instructions.length * 4;
    check(bodySize === entry.size, `${entry.name}: source body size mismatch`);
    check(body.offset === entry.size + entry.literals.length * 4,
      `${entry.name}: section extent mismatch`);

    const actualBranches = symbolicTransfers(body);
    check(actualBranches.length === entry.branches.length,
      `${entry.name}: inter-section transfer count mismatch`);
    for (let index = 0; index < entry.branches.length; index += 1) {
      const actual = actualBranches[index];
      const expected = entry.branches[index];
      check(actual.offset === expected.offset && actual.mnemonic === expected.mnemonic &&
        actual.symbol === expected.symbol,
      `${entry.name}: transfer mismatch at configured site ${index}`);
    }
    check(JSON.stringify(body.literals) === JSON.stringify(entry.literals),
      `${entry.name}: adjacent literal schedule mismatch`);

    const expectedLocals = entry.name === 'func_0017F3F8' ? EXPECTED_LOCAL_BRANCHES : [];
    check(JSON.stringify(localBranches(body)) === JSON.stringify(expectedLocals),
      `${entry.name}: local branch schedule mismatch`);
  }
  check([...functions.values()].reduce((sum, body) => sum + body.instructions.length * 4, 0) === 820,
    'source function bodies must total 820 bytes');
  check([...functions.values()].reduce((sum, body) => sum + body.literals.length, 0) === 4,
    'source must contain four adjacent literal slots');
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
  const conditions = new Map([['beq', 0x0], ['bne', 0x1], ['b', 0xe]]);
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

  const ownedSections = new Set(config.functions.map(({ name }) => `.text.${name}`));
  const actualOwned = relocations.filter(({ section }) => ownedSections.has(section));
  check(actualOwned.length === expectedRelocations.length,
    `owned relocation count mismatch: expected ${expectedRelocations.length}, got ${actualOwned.length}`);
  check(actualOwned.length === 16, 'expected 12 transfer and four literal relocations');
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

  const compareBytes = parseHexDump(runReadelf(readelf,
    ['-x', '.text.func_0017F3F8', objectPath]));
  check(compareBytes.length === 80, 'comparison section hex extent mismatch');
  for (const branch of EXPECTED_LOCAL_BRANCHES) {
    check(compareBytes.readUInt32LE(branch.offset) === armLocalBranchWord(branch),
      `local branch encoding mismatch at func_0017F3F8+0x${branch.offset.toString(16)}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  check(args.length <= 2, 'usage: validate-arm-ipc-templates-63.mjs [objectPath [readelf]]');
  const { config, source } = loadInputs();
  validateConfig(config);
  validateSource(config, source);
  if (args.length === 0) {
    console.log('arm-ipc-templates-63: source checks passed');
    return;
  }
  validateObject(config, resolve(process.cwd(), args[0]), args[1] ?? 'arm-none-eabi-readelf');
  console.log('arm-ipc-templates-63: source and object checks passed');
}

try {
  main();
} catch (error) {
  console.error(`arm-ipc-templates-63: ${error.message}`);
  process.exitCode = 1;
}
