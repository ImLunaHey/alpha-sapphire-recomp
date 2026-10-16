#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/arm-duplicate-templates-76.json');
const SPEC_PATH = join(ROOT, 'docs/specs/main/arm_duplicate_templates_76.md');
const EXPECTED_CONFIG_SHA256 = 'b144be4627eaf4025f1c9c985ffb51dae2e00b4ed7724d1b6e2ba98f3dc20fb0';
const MAX_BUFFER = 16 * 1024 * 1024;
const EXPECTED_SECONDARY = [
  ['arm_duplicate_templates_76_route_secondary', 'func_00419288', 92, 'func_004196BC', 984],
  ['arm_duplicate_templates_74_fallback_secondary', 'func_0014E904', 352, 'func_0014EA68', 4],
  ['arm_duplicate_templates_76_ready_secondary', 'func_00179080', 88, 'func_00179138', 96],
  ['arm_duplicate_templates_76_forward_secondary', 'func_003C6088', 1236, 'func_003C69D4', 1144],
];

function fail(message) { throw new Error(message); }
function sha(data) { return createHash('sha256').update(data).digest('hex'); }
function recordsSha(records) { return sha(`${records.join('\n')}\n`); }
function assert(condition, message) { if (!condition) fail(message); }

function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    ...options,
  });
  if (result.error) fail(`${basename(tool)} failed to start: ${result.error.message}`);
  if (result.status !== 0) fail(`${basename(tool)} ${args.join(' ')} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function locateTool(name, envName) {
  const explicit = process.env[envName];
  if (explicit) return explicit;
  const prefix = process.env.CROSS_COMPILE ?? 'arm-none-eabi-';
  const candidate = `${prefix}${name}`;
  const found = spawnSync('sh', ['-c', 'command -v "$1"', 'sh', candidate], { encoding: 'utf8' });
  if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  const devkit = process.env.DEVKITARM;
  if (devkit && existsSync(join(devkit, 'bin', candidate))) return join(devkit, 'bin', candidate);
  const toolName = `arm-none-eabi-${name}`;
  const bundled = join(ROOT, 'node_modules', '@xpack-dev-tools', 'arm-none-eabi-gcc', '.content', 'bin', toolName);
  if (existsSync(bundled)) return bundled;
  if (existsSync('/nix/store')) {
    const search = spawnSync('find', ['/nix/store', '-type', 'f', '-path', `*/bin/${toolName}`], {
      encoding: 'utf8',
      maxBuffer: MAX_BUFFER,
    });
    const matches = search.status === 0 ? search.stdout.trim().split('\n').filter(Boolean) : [];
    const selected = matches.find((path) => path.includes('gcc-arm-embedded-15.2')) ?? matches[0];
    if (selected) return selected;
  }
  fail(`missing ${candidate}; set ${envName}, CROSS_COMPILE, or DEVKITARM`);
}

function parseArgs(argv) {
  const result = { source: null, target: null, fixtures: true };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--source') result.source = resolve(argv[++i] ?? fail('--source needs a path'));
    else if (argv[i] === '--target-object') result.target = resolve(argv[++i] ?? fail('--target-object needs a path'));
    else if (argv[i] === '--no-fixtures') result.fixtures = false;
    else if (argv[i] === '--help') {
      console.log('usage: validate-arm-duplicate-templates-76.mjs [--source file] [--target-object ELF] [--no-fixtures]');
      process.exit(0);
    } else fail(`unknown argument: ${argv[i]}`);
  }
  return result;
}

function ownedSize(fn, template) {
  return fn.templateMaterialEndOffset === undefined ? template.bodySize : fn.templateMaterialEndOffset + 1;
}

function validateMetadata(config, sourceBytes, enforceHashes) {
  assert(config.version === 1 && config.mode === 'arm', 'unsupported config version/mode');
  assert(config.functions.length === 25, 'expected 25 functions');
  assert(Object.keys(config.templates).length === 11, 'expected 11 templates');
  assert(config.expectedBodyBytes === 1356, 'expected 1,356 body bytes');
  assert(config.expectedInstructionCount === 339, 'expected 339 instructions');
  const names = new Set(config.functions.map((fn) => fn.name));
  assert(names.size === 25, 'function names must be unique');
  let bytes = 0, instructions = 0, direct = 0, indirect = 0, localLabels = 0, addresses = 0, slots = 0;
  const counts = new Map();
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    assert(template, `${fn.name}: unknown template`);
    bytes += template.bodySize;
    instructions += template.instructionCount;
    direct += (fn.directTransfers ?? []).length;
    indirect += (fn.indirectCalls ?? []).length;
    localLabels += fn.internalLabelOffsets.length;
    addresses += (fn.addressReferences ?? []).length;
    slots += fn.literals.length;
    counts.set(fn.template, (counts.get(fn.template) ?? 0) + 1);
    assert(fn.nextGlobalOffset >= ownedSize(fn, template), `${fn.name}: next global overlaps owned material`);
    assert(fn.internalLabelOffsets.every((n) => n >= 0 && n < template.bodySize && n % 4 === 0), `${fn.name}: invalid local label`);
    assert((fn.directTransfers ?? []).every((x) => x.offset < template.bodySize && x.offset % 4 === 0), `${fn.name}: invalid direct-transfer offset`);
    assert(fn.literals.every((x) => x.offset >= template.bodySize && x.offset < ownedSize(fn, template)), `${fn.name}: literal is outside owned pool`);
  }
  for (const [name, template] of Object.entries(config.templates)) assert(counts.get(name) === template.count, `${name}: template count mismatch`);
  assert(bytes === 1356 && instructions === 339, 'aggregate body metric mismatch');
  assert(direct === 43 && indirect === 6 && localLabels === 12 && addresses === 2 && slots === 15, 'aggregate event metric mismatch');
  assert(Object.keys(config.literalIdentities).length === 13, 'expected 13 literal classes');
  assert(config.literalIdentityContract.siteCount === 15 && config.literalIdentityContract.classCount === 13, 'literal contract mismatch');
  assert(config.branchIdentityContract.secondaryEntryRelations.map((x) => [x.symbol, x.owner, x.ownerOffset, x.nextGlobal, x.bytesBeforeNextGlobal]).every((x, i) => JSON.stringify(x) === JSON.stringify(EXPECTED_SECONDARY[i])), 'secondary ownership relations changed');
  assert(config.addressIdentityContract.kind === 'post-body-address-only' && config.addressIdentityContract.siteCount === 2 && config.addressIdentityContract.relocationFree === true && config.addressIdentityContract.bytesOwnedByBatch === false, 'address-only contract mismatch');
  if (enforceHashes) {
    assert(sha(readFileSync(CONFIG_PATH)) === EXPECTED_CONFIG_SHA256, 'config SHA-256 mismatch');
    assert(sha(sourceBytes) === config.sourceSha256, 'source SHA-256 mismatch');
    const spec = readFileSync(SPEC_PATH, 'utf8');
    assert(spec.includes(`sourceSha256\`: \`${config.sourceSha256}\``), 'spec/source SHA-256 mismatch');
  }
}

function parseSections(readelfText) {
  const sections = new Map();
  for (const line of readelfText.split('\n')) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+(\S*)/);
    if (match) sections.set(match[1], { type: match[2], size: Number.parseInt(match[3], 16), flags: match[4] });
  }
  return sections;
}

function parseSymbols(readelfText) {
  const symbols = new Map();
  for (const line of readelfText.split('\n')) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(\S+)\s*$/);
    if (match) symbols.set(match[6], { value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], ndx: match[5] });
  }
  return symbols;
}

function parseDisassembly(text, fn) {
  const instructions = [];
  const relocations = [];
  for (const line of text.split('\n')) {
    let match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)(?:\s+(.*?))?\s*$/);
    if (match) {
      instructions.push({ offset: Number.parseInt(match[1], 16), mnemonic: match[2], operands: (match[3] ?? '').replace(/\s+@.*$/, '').trim().replace(/\s+/g, ' ') });
      continue;
    }
    match = line.match(/^\s*([0-9a-fA-F]+):\s+(R_ARM_[A-Z0-9_]+)\s+(\S+)\s*$/);
    if (match) relocations.push({ offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3].replace(/[+-]0x[0-9a-fA-F]+$/, '') });
  }
  const bodySize = fn._template.bodySize;
  return { instructions: instructions.filter((x) => x.offset < bodySize), relocations };
}

function normalizeFunction(fn, parsed) {
  const directAt = new Map((fn.directTransfers ?? []).map((x) => [x.offset, x]));
  const literalAt = new Map(fn.literals.map((x) => [x.loadOffset, x]));
  const addressAt = new Map((fn.addressReferences ?? []).map((x) => [x.offset, x]));
  const relocAt = new Set(parsed.relocations.map((x) => x.offset));
  const instructionRecords = [];
  const localRecords = [];
  for (const insn of parsed.instructions) {
    let mnemonic = insn.mnemonic;
    let operands = insn.operands;
    const direct = directAt.get(insn.offset);
    const literal = literalAt.get(insn.offset);
    const address = addressAt.get(insn.offset);
    if (direct) {
      assert(mnemonic === direct.mnemonic, `${fn.name}+${insn.offset}: direct mnemonic mismatch`);
      operands = direct.symbol;
    } else if (literal) {
      operands = `literal:${literal.identity}`;
    } else if (address) {
      const adrMatch = operands.match(/^([^,]+), pc, #(\d+)$/);
      assert(mnemonic === 'add' && adrMatch && insn.offset + 8 + Number(adrMatch[2]) === address.targetOffset, `${fn.name}+${insn.offset}: address target mismatch`);
      operands = `address:+${address.targetOffset}`;
      assert(!relocAt.has(insn.offset), `${fn.name}+${insn.offset}: address reference has relocation`);
    } else if (/^b(?!l)/.test(mnemonic)) {
      const match = operands.match(/^([0-9a-fA-F]+)\s/);
      assert(match, `${fn.name}+${insn.offset}: cannot parse local target`);
      const target = Number.parseInt(match[1], 16);
      assert(fn.internalLabelOffsets.includes(target), `${fn.name}+${insn.offset}: undeclared local target ${target}`);
      operands = `local:+${target}`;
      localRecords.push(`${fn.name}:${insn.offset}:${mnemonic}:${target}`);
    }
    instructionRecords.push(`${fn.name}:${insn.offset}:${mnemonic}:${operands}`);
  }
  return { instructionRecords, localRecords };
}

function expectedRelocations(fn, config) {
  const result = (fn.directTransfers ?? []).map((x) => ({ offset: x.offset, kind: x.kind, mnemonic: x.mnemonic, symbol: x.symbol }));
  for (const literal of fn.literals) result.push({ offset: literal.offset, kind: 'R_ARM_ABS32', mnemonic: '.word', symbol: config.literalIdentities[literal.identity].symbol });
  return result.sort((a, b) => a.offset - b.offset);
}

function validateObject(objectPath, config, tools) {
  const metadata = run(tools.readelf, ['-SW', '-sW', objectPath]);
  const sections = parseSections(metadata);
  const symbols = parseSymbols(metadata);
  const instructionRecords = [], localRecords = [], relocationRecords = [], literalRecords = [];
  let instructionCount = 0, bodyBytes = 0, directCount = 0, indirectCount = 0;
  for (const rawFn of config.functions) {
    const fn = { ...rawFn, _template: config.templates[rawFn.template] };
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    assert(section, `${fn.name}: missing section`);
    assert(section.type === 'PROGBITS' && section.flags.includes('A') && section.flags.includes('X'), `${fn.name}: section must be allocatable/executable PROGBITS`);
    assert(section.size === ownedSize(fn, fn._template), `${fn.name}: section/owned-material size mismatch`);
    const symbol = symbols.get(fn.name);
    assert(symbol && symbol.type === 'FUNC' && symbol.bind === 'GLOBAL', `${fn.name}: missing global function symbol`);
    assert(symbol.value === 0 && symbol.size === fn._template.bodySize, `${fn.name}: function boundary mismatch`);
    const parsed = parseDisassembly(run(tools.objdump, ['-dr', '-j', sectionName, objectPath]), fn);
    assert(parsed.instructions.length === fn._template.instructionCount, `${fn.name}: instruction count mismatch`);
    const expectedRelocs = expectedRelocations(fn, config);
    assert(parsed.relocations.length === expectedRelocs.length, `${fn.name}: relocation count mismatch`);
    for (let i = 0; i < expectedRelocs.length; i++) {
      const actual = parsed.relocations[i], expected = expectedRelocs[i];
      assert(actual.offset === expected.offset && actual.kind === expected.kind && actual.symbol === expected.symbol, `${fn.name}: relocation ${i} mismatch`);
      relocationRecords.push(`${fn.name}:${expected.offset}:${expected.kind}:${expected.mnemonic}:${expected.symbol}`);
    }
    const normalized = normalizeFunction(fn, parsed);
    instructionRecords.push(...normalized.instructionRecords);
    localRecords.push(...normalized.localRecords);
    for (const literal of fn.literals) literalRecords.push(`${fn.name}:${literal.loadOffset}:${literal.offset}:${literal.identity}`);
    const indirect = parsed.instructions.filter((x) => x.mnemonic === 'blx');
    assert(indirect.length === (fn.indirectCalls ?? []).length, `${fn.name}: indirect-call count mismatch`);
    for (let i = 0; i < indirect.length; i++) assert(indirect[i].offset === fn.indirectCalls[i].offset && indirect[i].operands === fn.indirectCalls[i].register, `${fn.name}: indirect call mismatch`);
    instructionCount += parsed.instructions.length;
    bodyBytes += fn._template.bodySize;
    directCount += (fn.directTransfers ?? []).length;
    indirectCount += indirect.length;
  }
  assert(instructionCount === 339 && bodyBytes === 1356 && directCount === 43 && indirectCount === 6, 'object aggregate mismatch');
  assert(localRecords.length === 16 && relocationRecords.length === 58 && literalRecords.length === 15, 'object event aggregate mismatch');
  const actualHashes = {
    instructionSchedule: recordsSha(instructionRecords),
    localTransferSchedule: recordsSha(localRecords),
    relocationSchedule: recordsSha(relocationRecords),
    literalIdentitySchedule: recordsSha(literalRecords),
  };
  for (const [key, value] of Object.entries(actualHashes)) assert(value === config.canonicalHashes[key], `${key} digest mismatch: ${value}`);
  return actualHashes;
}

function readElfSections(path) {
  const data = readFileSync(path);
  assert(data.length >= 52 && data.readUInt32LE(0) === 0x464c457f, `${path}: not ELF`);
  assert(data[4] === 1 && data[5] === 1, `${path}: expected ELF32 little-endian`);
  const shoff = data.readUInt32LE(32), shentsize = data.readUInt16LE(46), shnum = data.readUInt16LE(48), shstrndx = data.readUInt16LE(50);
  assert(shentsize >= 40 && shoff + shentsize * shnum <= data.length, `${path}: invalid section table`);
  const headers = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    headers.push({ nameOffset: data.readUInt32LE(p), address: data.readUInt32LE(p + 12), offset: data.readUInt32LE(p + 16), size: data.readUInt32LE(p + 20) });
  }
  const stringsHeader = headers[shstrndx];
  const strings = data.subarray(stringsHeader.offset, stringsHeader.offset + stringsHeader.size);
  const result = new Map();
  for (const header of headers) {
    let end = header.nameOffset;
    while (end < strings.length && strings[end] !== 0) end++;
    const name = strings.subarray(header.nameOffset, end).toString();
    if (name) result.set(name, { ...header, bytes: data.subarray(header.offset, header.offset + header.size) });
  }
  return result;
}

function compareTarget(generatedPath, targetPath, config) {
  const generated = readElfSections(generatedPath), target = readElfSections(targetPath);
  for (const fn of config.functions) {
    const name = `.text.${fn.name}`;
    const a = generated.get(name), b = target.get(name);
    assert(a && b, `${fn.name}: target comparison section missing`);
    const size = ownedSize(fn, config.templates[fn.template]);
    assert(b.bytes.length >= size, `${fn.name}: target section is too short`);
    const aa = Buffer.from(a.bytes.subarray(0, size)), bb = Buffer.from(b.bytes.subarray(0, size));
    for (const transfer of fn.directTransfers ?? []) {
      aa.fill(0, transfer.offset, transfer.offset + 4); bb.fill(0, transfer.offset, transfer.offset + 4);
    }
    for (const literal of fn.literals) {
      aa.fill(0, literal.offset, literal.offset + 4); bb.fill(0, literal.offset, literal.offset + 4);
    }
    assert(aa.equals(bb), `${fn.name}: normalized target bytes differ`);
  }
}

function assemble(sourcePath, objectPath, assembler) {
  run(assembler, ['-march=armv6k', '-mfpu=vfpv2', '-o', objectPath, sourcePath]);
}

function fixtureChecks(sourceText, config, tools, temporary) {
  const foreignSource = join(temporary, 'foreign.S');
  const foreignObject = join(temporary, 'foreign.o');
  writeFileSync(foreignSource, `${sourceText}\n.section .text.foreign_fixture,"ax",%progbits\n.word 0xe1a00000\n`);
  assemble(foreignSource, foreignObject, tools.as);
  validateObject(foreignObject, config, tools);

  const hostileText = sourceText.replace('    mov r6, r0\n    mov r4, r1', '    mov r6, r1\n    mov r4, r1');
  assert(hostileText !== sourceText, 'could not construct hostile fixture');
  const hostileSource = join(temporary, 'hostile.S');
  const hostileObject = join(temporary, 'hostile.o');
  writeFileSync(hostileSource, hostileText);
  assemble(hostileSource, hostileObject, tools.as);
  let rejected = false;
  try { validateObject(hostileObject, config, tools); } catch { rejected = true; }
  assert(rejected, 'hostile operand fixture was accepted');
}

const args = parseArgs(process.argv);
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const sourcePath = args.source ?? join(ROOT, config.source);
const sourceBytes = readFileSync(sourcePath);
const enforceHashes = sourcePath === join(ROOT, config.source);
validateMetadata(config, sourceBytes, enforceHashes);
const tools = {
  as: locateTool('as', 'ARM_AS'),
  objdump: locateTool('objdump', 'ARM_OBJDUMP'),
  readelf: locateTool('readelf', 'ARM_READELF'),
};
const temporary = mkdtempSync(join(tmpdir(), 'arm-duplicate-templates-76-'));
try {
  const objectPath = join(temporary, 'batch76.o');
  assemble(sourcePath, objectPath, tools.as);
  validateObject(objectPath, config, tools);
  if (args.target) {
    validateObject(args.target, config, tools);
    compareTarget(objectPath, args.target, config);
  }
  if (args.fixtures) fixtureChecks(sourceBytes.toString('utf8'), config, tools, temporary);
  console.log(`arm duplicate templates 76: ok (25 functions, 11 templates, 1356 bytes, 339 instructions, 58 relocations${args.target ? ', target compared' : ''})`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
