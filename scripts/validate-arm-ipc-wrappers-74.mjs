#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const CONFIG_PATH = resolve(ROOT, 'config/arm-ipc-wrappers-74.json');
const SPEC_PATH = resolve(ROOT, 'docs/specs/main/arm_ipc_wrappers_74.md');
const MAX_BUFFER = 16 * 1024 * 1024;
const ARM_RELOC = { R_ARM_ABS32: 2, R_ARM_CALL: 28, R_ARM_JUMP24: 29 };

function fail(message) {
  throw new Error(`arm-ipc-wrappers-74: ${message}`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    ...options,
  });
  if (result.error) fail(`cannot run ${command}: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${command} ${args.join(' ')} failed (${result.status}):\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function findTool(envName, names) {
  if (process.env[envName]) return process.env[envName];
  const crossName = names[0].replace('arm-none-eabi-', '');
  const candidates = process.env.CROSS_COMPILE
    ? [`${process.env.CROSS_COMPILE}${crossName}`, ...names]
    : names;
  for (const name of candidates) {
    const probe = spawnSync('sh', ['-c', 'command -v "$1"', 'sh', name], {
      encoding: 'utf8', maxBuffer: MAX_BUFFER,
    });
    if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  }
  const toolName = names[0];
  const bundled = join(ROOT, 'node_modules', '@xpack-dev-tools', 'arm-none-eabi-gcc', '.content', 'bin', toolName);
  if (existsSync(bundled)) return bundled;
  if (existsSync('/nix/store')) {
    const search = spawnSync('find', ['/nix/store', '-type', 'f', '-path', `*/bin/${toolName}`], {
      encoding: 'utf8', maxBuffer: MAX_BUFFER,
    });
    const matches = search.status === 0 ? search.stdout.trim().split('\n').filter(Boolean) : [];
    const selected = matches.find(path => path.includes('gcc-arm-embedded-15.2')) ?? matches[0];
    if (selected) return selected;
  }
  fail(`missing ARM tool; set ${envName} (${names.join(' or ')})`);
}

function equal(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function sameArray(actual, expected, label) {
  equal(JSON.stringify(actual), JSON.stringify(expected), label);
}

function assertUnique(values, label) {
  equal(new Set(values).size, values.length, `${label} uniqueness`);
}

function extractNormativeAssembly(markdown) {
  const heading = '## Complete normative mnemonic schedules';
  const at = markdown.indexOf(heading);
  if (at < 0) fail('specification is missing the normative schedule heading');
  const match = markdown.slice(at).match(/```asm\n([\s\S]*?)```/);
  if (!match) fail('specification is missing its asm schedule');
  return match[1];
}

function normalizeAssembly(text) {
  return text.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trimEnd() + '\n';
}

function validateContract(config) {
  equal(config.schemaVersion, 1, 'schema version');
  equal(config.mode, 'arm', 'instruction mode');
  equal(config.totalBodySize, 1004, 'total body size');
  equal(config.cumulativePoolSlots, 770, 'cumulative pool slots');
  equal(config.cumulativePoolClasses, 406, 'cumulative pool classes');
  equal(config.functions.length, 5, 'function count');
  equal(config.functions.reduce((n, f) => n + f.size, 0), 1004, 'summed body size');
  equal(config.functions.reduce((n, f) => n + f.size / 4, 0), 251, 'instruction count');
  equal(config.functions.reduce((n, f) => n + f.branches.length, 0), 8, 'transfer count');
  equal(config.functions.reduce((n, f) => n + f.literals.length, 0), 19, 'literal slot count');
  equal(config.literalIdentities.length, 12, 'literal class count');
  equal(config.reusedLiteralIdentities.length, 4, 'reused literal class count');
  equal(config.newLiteralIdentities.length, 8, 'new literal class count');
  assertUnique(config.literalIdentities, 'literal identities');
  assertUnique(config.reusedLiteralIdentities, 'reused identities');
  assertUnique(config.newLiteralIdentities, 'new identities');
  sameArray([...config.reusedLiteralIdentities, ...config.newLiteralIdentities].sort(),
    [...config.literalIdentities].sort(), 'reuse/new literal partition');
  const transferSymbols = config.functions.flatMap(f => f.branches.map(b => b.symbol));
  equal(new Set(transferSymbols).size, 7, 'transfer class count');
  sameArray([...new Set(transferSymbols)].sort(),
    [...config.branchIdentityContract.primaryEntries, ...config.branchIdentityContract.secondaryEntries].sort(),
    'transfer identity classes');
  assertUnique([...config.branchIdentityContract.primaryEntries, ...config.branchIdentityContract.secondaryEntries],
    'transfer identity classes');
  equal(config.branchIdentityContract.mode, 'arm', 'transfer mode');
  equal(config.branchIdentityContract.minimumAlignment, 4, 'transfer alignment');
  equal(config.branchIdentityContract.classesPairwiseDistinct, true, 'transfer distinctness contract');
  equal(config.branchIdentityContract.secondaryEntryRelations.length, 1, 'branch secondary relation count');
  const relation = config.branchIdentityContract.secondaryEntryRelations[0];
  equal(relation.symbol, 'service_factory_secondary_74', 'branch secondary symbol');
  equal(relation.owner, 'func_0018E4D8', 'branch secondary owner');
  equal(relation.ownerOffset, 92, 'branch secondary owner offset');
  equal(relation.nextGlobal, 'func_0018E54C', 'branch secondary next global');
  equal(relation.bytesBeforeNextGlobal, 24, 'branch secondary boundary');
  equal(config.branchIdentityContract.sharedClasses.length, 1, 'shared transfer classes');
  equal(config.branchIdentityContract.sharedClasses[0].sites.length, 2, 'shared transfer sites');
  equal(config.branchIdentityContract.singletonClasses.length, 6, 'singleton transfer classes');

  const literalSecondaries = [
    { symbol: 'ipc_single_factory_secondary_74', owner: 'func_0018EE20', ownerOffset: 84,
      nextGlobal: 'func_0018EFAC', bytesBeforeNextGlobal: 312 },
    { symbol: 'ipc_multi_factory_secondary_74', owner: 'func_0018EE20', ownerOffset: 164,
      nextGlobal: 'func_0018EFAC', bytesBeforeNextGlobal: 232 },
  ];
  for (const relation of literalSecondaries) {
    if (!config.newLiteralIdentities.includes(relation.symbol)) {
      fail(`${relation.symbol} must be a new literal identity`);
    }
    equal(relation.ownerOffset + relation.bytesBeforeNextGlobal, 396,
      `${relation.symbol} owner-to-next-global extent`);
  }
  assertUnique([
    ...literalSecondaries.map(x => x.symbol),
    ...config.branchIdentityContract.primaryEntries,
    ...config.branchIdentityContract.secondaryEntries,
  ], 'code-entry identities');

  const ownedPoolBytes = config.functions.reduce((n, f) => n + f.literals.length * 4, 0);
  equal(ownedPoolBytes, 76, 'owned adjacent bytes');
  const unowned = config.functions.map(f => ({
    name: f.name,
    bytes: f.nextGlobalOffset - f.size - f.literals.length * 4,
  }));
  sameArray(unowned, [
    { name: 'func_0018C2D4', bytes: 20 },
    { name: 'func_0018C8E0', bytes: 0 },
    { name: 'func_0018C9E8', bytes: 0 },
    { name: 'func_0018CB5C', bytes: 0 },
    { name: 'func_0018CCF4', bytes: 0 },
  ], 'unowned interstitial boundaries');
  for (const f of config.functions) {
    equal(f.section, `.text.${f.name}`, `${f.name} section`);
    if (f.size % 4) fail(`${f.name} body is not word aligned`);
    for (const b of f.branches) {
      if (b.offset < 0 || b.offset >= f.size || b.offset % 4) fail(`${f.name} has invalid branch offset ${b.offset}`);
      if (!(b.kind in ARM_RELOC)) fail(`${f.name} has unknown relocation ${b.kind}`);
    }
    for (const literal of f.literals) {
      if (literal.offset < f.size || literal.offset % 4) fail(`${f.name} has invalid literal slot ${literal.offset}`);
      for (const load of literal.loadOffsets) {
        if (load < 0 || load >= f.size || load % 4) fail(`${f.name} has invalid literal load ${load}`);
      }
    }
  }
}

function parseElf(path) {
  const b = readFileSync(path);
  if (b.length < 52 || b[0] !== 0x7f || b.toString('ascii', 1, 4) !== 'ELF') fail(`${path} is not ELF`);
  if (b[4] !== 1 || b[5] !== 1) fail(`${path} must be ELF32 little-endian`);
  equal(b.readUInt16LE(18), 40, `${basename(path)} ELF machine`);
  const shoff = b.readUInt32LE(32);
  const shentsize = b.readUInt16LE(46);
  const shnum = b.readUInt16LE(48);
  const shstrndx = b.readUInt16LE(50);
  if (shentsize < 40 || shoff + shentsize * shnum > b.length) fail(`${path} has invalid section table`);
  const raw = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * shentsize;
    raw.push({ index: i, nameOffset: b.readUInt32LE(p), type: b.readUInt32LE(p + 4),
      flags: b.readUInt32LE(p + 8), offset: b.readUInt32LE(p + 16), size: b.readUInt32LE(p + 20),
      link: b.readUInt32LE(p + 24), info: b.readUInt32LE(p + 28), align: b.readUInt32LE(p + 32),
      entsize: b.readUInt32LE(p + 36) });
  }
  const shstr = raw[shstrndx];
  if (!shstr || shstr.offset + shstr.size > b.length) fail(`${path} has invalid section string table`);
  const cstr = (start, limit = b.length) => {
    let end = start;
    while (end < limit && b[end] !== 0) end++;
    return b.toString('utf8', start, end);
  };
  for (const s of raw) {
    s.name = cstr(shstr.offset + s.nameOffset, shstr.offset + shstr.size);
    if (s.type !== 8 && s.offset + s.size > b.length) fail(`${path} section ${s.name} exceeds file`);
    s.data = s.type === 8 ? Buffer.alloc(s.size) : b.subarray(s.offset, s.offset + s.size);
  }
  const symbols = [];
  for (const table of raw.filter(s => s.type === 2)) {
    const strings = raw[table.link];
    const step = table.entsize || 16;
    if (!strings || step < 16 || table.size % step) fail(`${path} has invalid symbol table`);
    for (let off = 0, index = 0; off < table.size; off += step, index++) {
      const p = table.offset + off;
      symbols.push({ table: table.index, index, name: cstr(strings.offset + b.readUInt32LE(p), strings.offset + strings.size),
        value: b.readUInt32LE(p + 4), size: b.readUInt32LE(p + 8), info: b[p + 12],
        other: b[p + 13], shndx: b.readUInt16LE(p + 14) });
    }
  }
  const symByKey = new Map(symbols.map(s => [`${s.table}:${s.index}`, s]));
  const relocations = [];
  for (const relsec of raw.filter(s => s.type === 9 || s.type === 4)) {
    const target = raw[relsec.info];
    const step = relsec.entsize || (relsec.type === 4 ? 12 : 8);
    if (!target || relsec.size % step) fail(`${path} has invalid relocation section ${relsec.name}`);
    for (let off = 0; off < relsec.size; off += step) {
      const p = relsec.offset + off;
      const info = b.readUInt32LE(p + 4);
      const sym = symByKey.get(`${relsec.link}:${info >>> 8}`);
      relocations.push({ section: target.name, offset: b.readUInt32LE(p), type: info & 0xff,
        symbol: sym?.name ?? '', addend: relsec.type === 4 ? b.readInt32LE(p + 8) : null });
    }
  }
  return { bytes: b, sections: raw, symbols, relocations };
}

function sectionMap(elf) {
  return new Map(elf.sections.map(s => [s.name, s]));
}

function validateElf(elf, config, label) {
  const sections = sectionMap(elf);
  for (const f of config.functions) {
    const section = sections.get(f.section);
    if (!section) fail(`${label}: missing ${f.section}`);
    const expectedSize = f.size + f.literals.length * 4;
    equal(section.size, expectedSize, `${label} ${f.section} owned size`);
    equal(section.align, 4, `${label} ${f.section} alignment`);
    if ((section.flags & 0x6) !== 0x6) fail(`${label}: ${f.section} is not allocatable executable code`);
    const definitions = elf.symbols.filter(s => s.name === f.name && s.shndx === section.index);
    equal(definitions.length, 1, `${label} ${f.name} definition count`);
    equal(definitions[0].value, 0, `${label} ${f.name} section offset`);
    equal(definitions[0].size, f.size, `${label} ${f.name} symbol size`);
    equal(definitions[0].info & 0xf, 2, `${label} ${f.name} symbol type`);

    const relocs = elf.relocations.filter(r => r.section === f.section);
    const expected = [
      ...f.branches.map(x => ({ offset: x.offset, type: ARM_RELOC[x.kind], symbol: x.symbol })),
      ...f.literals.map(x => ({ offset: x.offset, type: ARM_RELOC.R_ARM_ABS32, symbol: x.symbol })),
    ].sort((a, b) => a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol));
    const actual = relocs.map(({ offset, type, symbol }) => ({ offset, type, symbol }))
      .sort((a, b) => a.offset - b.offset || a.type - b.type || a.symbol.localeCompare(b.symbol));
    sameArray(actual, expected, `${label} ${f.section} relocations`);
    for (const literal of f.literals) {
      equal(section.data.readUInt32LE(literal.offset), 0, `${label} ${f.name}+${literal.offset} literal addend`);
      for (const load of literal.loadOffsets) {
        const instruction = section.data.readUInt32LE(load);
        const isCoreLiteralLoad = (instruction & 0x0f7f0000) === 0x051f0000;
        const isVfpLiteralLoad = (instruction & 0x0f3f0f00) === 0x0d1f0a00;
        if (!isCoreLiteralLoad && !isVfpLiteralLoad) {
          fail(`${label}: ${f.name}+${load} is not an audited literal load`);
        }
        const displacement = isVfpLiteralLoad ? (instruction & 0xff) * 4 : instruction & 0xfff;
        const target = load + 8 + ((instruction & 0x00800000) ? displacement : -displacement);
        equal(target, literal.offset, `${label} ${f.name}+${load} literal reach`);
      }
    }
  }
}

function compareOwnedSections(candidate, canonical, config, label) {
  const a = sectionMap(candidate);
  const b = sectionMap(canonical);
  for (const f of config.functions) {
    if (!a.get(f.section).data.equals(b.get(f.section).data)) fail(`${label}: bytes differ in ${f.section}`);
  }
}

function validateSectionScopedDisassembly(objdump, objectPath, config) {
  let total = 0;
  for (const f of config.functions) {
    const output = run(objdump, ['-d', '-j', f.section, objectPath]);
    const instructionLines = output.split('\n').filter(line => {
      const match = line.match(/^\s*([0-9a-f]+):\s+(?:(?:[0-9a-f]{2}\s+){4}|[0-9a-f]{8}\s+)\S/i);
      return match && Number.parseInt(match[1], 16) < f.size;
    });
    equal(instructionLines.length, f.size / 4, `${f.name} section-scoped instruction count`);
    total += instructionLines.length;
    for (const literal of f.literals) {
      for (const load of literal.loadOffsets) {
        const address = load.toString(16);
        if (!instructionLines.some(line => new RegExp(`^\\s*0*${address}:`, 'i').test(line))) {
          fail(`${f.name}: literal load site +${load} was not disassembled`);
        }
      }
    }
  }
  equal(total, 251, 'section-scoped disassembly total');
}

function selfTestForeignAndHostile(canonical, config) {
  // A foreign object may contain arbitrary unrelated sections: validation is deliberately scoped.
  const foreign = { ...canonical, sections: [...canonical.sections, {
    index: 0xffff, name: '.text.foreign', type: 1, flags: 6, offset: 0, size: 4,
    link: 0, info: 0, align: 4, entsize: 0, data: Buffer.from([0, 0, 0, 0]),
  }] };
  validateElf(foreign, config, 'foreign acceptance self-test');
  compareOwnedSections(foreign, canonical, config, 'foreign acceptance self-test');

  const target = config.functions[0];
  const hostileSections = canonical.sections.map(s => ({ ...s, data: Buffer.from(s.data) }));
  hostileSections.find(s => s.name === target.section).data[0] ^= 1;
  let rejected = false;
  try { compareOwnedSections({ ...canonical, sections: hostileSections }, canonical, config, 'hostile rejection self-test'); }
  catch { rejected = true; }
  if (!rejected) fail('hostile byte mutation was accepted');

  const hostileRelocs = canonical.relocations.map(r => ({ ...r }));
  hostileRelocs.find(r => r.section === target.section).symbol = '__hostile_destination';
  rejected = false;
  try { validateElf({ ...canonical, relocations: hostileRelocs }, config, 'hostile rejection self-test'); }
  catch { rejected = true; }
  if (!rejected) fail('hostile relocation mutation was accepted');
}

function assemble(as, source, output) {
  run(as, ['-march=armv6k', '-mfpu=vfpv2', '-o', output, source]);
}

function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  validateContract(config);
  const spec = readFileSync(SPEC_PATH, 'utf8');
  const compactSpec = spec.replace(/\s+/g, ' ');
  for (const fact of [
    '`ipc_single_factory_secondary_74` is `func_0018EE20 + 84`',
    '312 bytes before the next global, `func_0018EFAC`',
    '`ipc_multi_factory_secondary_74` is `func_0018EE20 + 164`',
    '232 bytes before that same next global',
  ]) {
    if (!compactSpec.includes(fact)) fail(`specification is missing secondary-entry fact: ${fact}`);
  }
  const normative = extractNormativeAssembly(spec);
  equal(createHash('sha256').update(normative).digest('hex'),
    '019b11cab1e2bc3be030dcd4865c7ec7941213ee6e2487a8825f0963043ea473',
    'normative schedule SHA-256');

  const sourcePath = resolve(ROOT, process.argv[2] && extname(process.argv[2]) !== '.o'
    ? process.argv[2] : config.source);
  const source = readFileSync(sourcePath, 'utf8');
  equal(normalizeAssembly(source), normalizeAssembly(normative), 'complete mnemonic schedule');
  const sourceHash = createHash('sha256').update(source).digest('hex');
  equal(sourceHash, config.sourceSha256, 'config source SHA-256');
  const specHash = spec.match(/Implementation source SHA-256: `([0-9a-f]{64}|PENDING_IMPLEMENTATION)`\./)?.[1];
  equal(specHash, sourceHash, 'spec source SHA-256');

  const as = findTool('ARM_AS', ['arm-none-eabi-as', 'arm-linux-gnueabi-as']);
  const objdump = findTool('ARM_OBJDUMP', ['arm-none-eabi-objdump', 'arm-linux-gnueabi-objdump']);
  const work = mkdtempSync(`${tmpdir()}/arm-ipc-wrappers-74-`);
  try {
    const canonicalPath = resolve(work, 'canonical.o');
    assemble(as, sourcePath, canonicalPath);
    const canonical = parseElf(canonicalPath);
    validateElf(canonical, config, 'standalone');
    validateSectionScopedDisassembly(objdump, canonicalPath, config);
    selfTestForeignAndHostile(canonical, config);

    const objectArg = process.argv.find((arg, i) => i >= 2 && extname(arg) === '.o');
    if (objectArg) {
      const candidatePath = resolve(ROOT, objectArg);
      if (!existsSync(candidatePath)) fail(`candidate object does not exist: ${candidatePath}`);
      const candidate = parseElf(candidatePath);
      validateElf(candidate, config, 'candidate');
      compareOwnedSections(candidate, canonical, config, 'candidate');
      validateSectionScopedDisassembly(objdump, candidatePath, config);
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  console.log(`arm-ipc-wrappers-74: OK ${sourceHash} (5 functions, 1004 bytes, 251 instructions, 19 slots/12 classes, 8 transfers/7 classes)`);
}

try { main(); }
catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
