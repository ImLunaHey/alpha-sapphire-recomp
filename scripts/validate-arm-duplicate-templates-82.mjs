#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { accessSync, constants, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { delimiter, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..');
const configPath = join(root, 'config', 'arm-duplicate-templates-82.json');
const specPath = join(root, 'docs', 'specs', 'main', 'arm_duplicate_templates_82.md');
const expectedNames = ['func_0029F368', 'func_0029F40C'];
const expectedTarget = 'func_0013335C';
const R_ARM_JUMP24 = 29;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function canonicalHash(lines) { return sha256(`${lines.join('\n')}\n`); }
function own(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }

function exactKeys(object, keys, where) {
  check(object && typeof object === 'object' && !Array.isArray(object), `${where} must be an object`);
  const actual = Object.keys(object).sort();
  const wanted = [...keys].sort();
  check(JSON.stringify(actual) === JSON.stringify(wanted), `${where} has unexpected or missing keys`);
}

function validateConfig(c) {
  check(c.version === 1 && c.source === 'src/main/arm_duplicate_templates_82.S', 'wrong config identity');
  check(c.mode === 'arm' && c.expectedBodyBytes === 16 && c.expectedOwnedBytes === 16 && c.expectedInstructionCount === 4,
    'wrong aggregate contract');
  exactKeys(c.templates, ['fixed_mode_five_tail'], 'templates');
  const t = c.templates.fixed_mode_five_tail;
  check(t.bodySize === 8 && t.count === 2 && t.directTransfers === 1 && t.directCalls === 0 && t.tailTransfers === 1,
    'wrong template transfer contract');
  check(t.indirectCalls === 0 && t.indirectTailTransfers === 0 && t.returns === 0 && t.instructionCount === 2,
    'wrong template control-flow contract');
  check(t.internalLabels === 0 && t.addressReferences === 0 && t.poolSlots === 0, 'wrong template data contract');
  check(JSON.stringify(t.instructions) === JSON.stringify(['mov r1, #5', 'b {tail}']), 'wrong instruction template');
  check(Object.keys(c.literalIdentities).length === 0 && c.reusedLiteralIdentities.length === 0 && c.newLiteralIdentities.length === 0,
    'literal identities are forbidden');
  const b = c.branchIdentityContract;
  check(b.minimumAlignment === 4 && JSON.stringify(b.primaryEntries) === JSON.stringify([expectedTarget]), 'wrong branch identity');
  check(b.thumbEntries.length === 0 && b.secondaryEntries.length === 0 && b.secondaryEntryRelations.length === 0,
    'secondary/thumb entries are forbidden');
  check(JSON.stringify(b.sharedClasses) === JSON.stringify([{ symbol: expectedTarget, siteCount: 2 }]) && b.singletonClasses.length === 0,
    'wrong branch class');
  check(b.classesPairwiseDistinct === true, 'branch distinctness contract missing');
  const l = c.literalIdentityContract;
  for (const key of ['slotCount', 'loadSiteCount', 'classCount', 'newClassCount', 'reusedClassCount']) check(l[key] === 0, `literal ${key} must be zero`);
  for (const key of ['newClassesPairwiseDistinct', 'newClassesDistinctFromConfiguredClasses', 'reusedClassesPhysicallyVerified']) check(l[key] === true, `literal ${key} must be true`);
  check(c.functions.length === 2, 'exactly two functions are required');
  const expectedNext = [['func_0029F368', 'func_0029F370', 8], ['func_0029F40C', 'func_0029F418', 12]];
  c.functions.forEach((f, i) => {
    const [name, next, nextOffset] = expectedNext[i];
    check(f.name === name && f.template === 'fixed_mode_five_tail', `wrong function ${i}`);
    check(f.nextGlobal === next && f.nextGlobalOffset === nextOffset, `wrong boundary for ${name}`);
    check(f.internalLabelOffsets.length === 0 && f.localTransfers.length === 0 && f.indirectCalls.length === 0 &&
      f.indirectTailTransfers.length === 0 && f.literals.length === 0, `forbidden records in ${name}`);
    check(JSON.stringify(f.directTransfers) === JSON.stringify([{ offset: 4, kind: 'R_ARM_JUMP24', mnemonic: 'b', symbol: expectedTarget, role: 'tail' }]),
      `wrong direct transfer in ${name}`);
  });
  check(c.functions[1].nextGlobalOffset - t.bodySize === 4, 'documented unowned gap must be four bytes');
  check(JSON.stringify(c.canonicalRecordFormat) === JSON.stringify({
    instruction: 'function|offset|resolved instruction',
    localTransfer: 'function|offset|mnemonic|local:+target',
    relocation: 'function|offset|kind|mnemonic-or-word|symbol',
    literalIdentity: 'function|loadOffset|slotOffset|identity-key'
  }), 'wrong canonical record format');
  const instructionRecords = expectedNames.flatMap(name => [
    `${name}|0|mov r1, #5`, `${name}|4|b ${expectedTarget}`
  ]);
  const relocationRecords = expectedNames.map(name => `${name}|4|R_ARM_JUMP24|b|${expectedTarget}`);
  const emptyHash = canonicalHash([]);
  check(c.canonicalHashes.algorithm === 'sha256' && c.canonicalHashes.lineTermination === 'LF', 'wrong canonical hash format');
  check(c.canonicalHashes.instructionSchedule === canonicalHash(instructionRecords), 'instruction schedule hash mismatch');
  check(c.canonicalHashes.localTransferSchedule === emptyHash, 'local transfer schedule must be empty');
  check(c.canonicalHashes.relocationSchedule === canonicalHash(relocationRecords), 'relocation schedule hash mismatch');
  check(c.canonicalHashes.literalIdentitySchedule === emptyHash, 'literal schedule must be empty');
}

function executable(name) {
  if (!name || /[\0\r\n]/.test(name)) return null;
  const candidates = isAbsolute(name) || name.includes('/') ? [name] : (process.env.PATH || '').split(delimiter).map(p => join(p, name));
  for (const candidate of candidates) {
    try { accessSync(candidate, constants.X_OK); return candidate; } catch { /* keep looking */ }
  }
  return null;
}

function toolPair() {
  const pairs = [];
  if (process.env.AS || process.env.OBJDUMP) {
    check(process.env.AS && process.env.OBJDUMP, 'AS and OBJDUMP must be set together');
    pairs.push([process.env.AS, process.env.OBJDUMP, 'environment']);
  }
  if (own(process.env, 'CROSS_COMPILE')) {
    const p = process.env.CROSS_COMPILE;
    check(p && !/[\0\r\n\s]/.test(p), 'invalid CROSS_COMPILE');
    pairs.push([`${p}as`, `${p}objdump`, 'CROSS_COMPILE']);
  }
  for (const p of ['arm-none-eabi-', 'arm-linux-gnueabihf-', 'arm-linux-gnueabi-']) pairs.push([`${p}as`, `${p}objdump`, p]);
  for (const [asName, objdumpName, origin] of pairs) {
    const as = executable(asName), objdump = executable(objdumpName);
    if (!as || !objdump) continue;
    const av = spawnSync(as, ['--version'], { encoding: 'utf8' });
    const ov = spawnSync(objdump, ['--version'], { encoding: 'utf8' });
    if (av.status === 0 && ov.status === 0) return { as, objdump, origin };
  }
  fail('no usable ARM GNU assembler/objdump pair (set AS+OBJDUMP or CROSS_COMPILE)');
}

function run(tool, args, options = {}) {
  const r = spawnSync(tool, args, { encoding: 'utf8', ...options });
  check(!r.error, `could not run ${tool}: ${r.error?.message}`);
  check(r.status === 0, `${tool} failed (${r.status}): ${(r.stderr || r.stdout || '').trim()}`);
  return r.stdout;
}

function parseElf(input) {
  const b = Buffer.from(input);
  const need = (offset, size, what) => check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset + size <= b.length,
    `${what} is outside ELF bounds`);
  need(0, 52, 'ELF header');
  check(b.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), 'not ELF');
  check(b[4] === 1 && b[5] === 1 && b[6] === 1, 'ELF must be 32-bit little-endian current-version');
  check(b.readUInt16LE(16) === 1 && b.readUInt16LE(18) === 40, 'ELF must be relocatable ARM');
  check(b.readUInt32LE(20) === 1 && b.readUInt16LE(40) === 52, 'invalid ELF header');
  const shoff = b.readUInt32LE(32), shentsize = b.readUInt16LE(46), shnum = b.readUInt16LE(48), shstrndx = b.readUInt16LE(50);
  check(shentsize === 40 && shnum > 0 && shnum <= 256 && shstrndx > 0 && shstrndx < shnum, 'unsupported section table');
  need(shoff, shentsize * shnum, 'section table');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * 40;
    const s = { index: i, nameOffset: b.readUInt32LE(o), type: b.readUInt32LE(o + 4), flags: b.readUInt32LE(o + 8),
      offset: b.readUInt32LE(o + 16), size: b.readUInt32LE(o + 20), link: b.readUInt32LE(o + 24), info: b.readUInt32LE(o + 28),
      align: b.readUInt32LE(o + 32), entsize: b.readUInt32LE(o + 36) };
    if (s.type !== 8) need(s.offset, s.size, `section ${i}`);
    sections.push(s);
  }
  const cstring = (table, offset, what) => {
    check(offset < table.length, `${what} string offset out of bounds`);
    const end = table.indexOf(0, offset);
    check(end >= 0, `${what} string is unterminated`);
    return table.toString('utf8', offset, end);
  };
  const names = sections[shstrndx];
  check(names.type === 3, 'section-name table is not STRTAB');
  const nameData = b.subarray(names.offset, names.offset + names.size);
  for (const s of sections) s.name = cstring(nameData, s.nameOffset, 'section');
  const symbols = [];
  for (const s of sections.filter(x => x.type === 2)) {
    check(s.entsize === 16 && s.size % 16 === 0 && s.size / 16 <= 4096, 'invalid symbol table');
    check(s.link < sections.length && sections[s.link].type === 3, 'invalid symbol string table link');
    const strings = b.subarray(sections[s.link].offset, sections[s.link].offset + sections[s.link].size);
    for (let n = 0; n < s.size / 16; n++) {
      const o = s.offset + n * 16, nameOffset = b.readUInt32LE(o);
      symbols.push({ index: n, table: s.index, name: cstring(strings, nameOffset, 'symbol'), value: b.readUInt32LE(o + 4),
        size: b.readUInt32LE(o + 8), bind: b[o + 12] >>> 4, type: b[o + 12] & 15, other: b[o + 13], shndx: b.readUInt16LE(o + 14) });
    }
  }
  check(sections.filter(x => x.type === 2).length === 1, 'exactly one symbol table is required');
  const symbolTable = sections.find(x => x.type === 2);
  const relocations = [];
  for (const s of sections.filter(x => x.type === 9 || x.type === 4)) {
    check(s.type === 9 && s.entsize === 8 && s.size % 8 === 0 && s.size / 8 <= 4096, 'only bounded REL relocations are allowed');
    check(s.link === symbolTable.index && s.info < sections.length, 'invalid relocation links');
    for (let n = 0; n < s.size / 8; n++) {
      const o = s.offset + n * 8, info = b.readUInt32LE(o + 4), symIndex = info >>> 8;
      check(symIndex < symbols.length, 'relocation symbol index out of bounds');
      relocations.push({ section: sections[s.info], offset: b.readUInt32LE(o), type: info & 0xff, symbol: symbols[symIndex], fileOffset: o + 4 });
    }
  }
  return { bytes: b, sections, symbols, relocations };
}

function validateObject(input) {
  const elf = parseElf(input);
  const allocatedData = elf.sections.filter(s => (s.flags & 2) !== 0 && (s.flags & 4) === 0 && s.size !== 0);
  check(allocatedData.length === 0, 'allocated literal/data section found');
  const executableSections = elf.sections.filter(s => (s.flags & 4) !== 0 && s.size !== 0);
  check(executableSections.length === 2, 'exactly two nonempty executable sections are required');
  const bodies = [];
  for (const name of expectedNames) {
    const sectionName = `.text.${name}`;
    const section = executableSections.find(s => s.name === sectionName);
    check(section, `missing owned section ${sectionName}`);
    check(section.type === 1 && section.size === 8 && section.align >= 4 && (section.align & (section.align - 1)) === 0,
      `${sectionName} must be an aligned eight-byte PROGBITS section`);
    const defs = elf.symbols.filter(s => s.shndx === section.index && s.name && !s.name.startsWith('$'));
    check(defs.length === 1 && defs[0].name === name && defs[0].value === 0 && defs[0].size === 8 && defs[0].type === 2 && defs[0].bind === 1 && defs[0].other === 0,
      `${name} must be the sole global function spanning its section`);
    const mapping = elf.symbols.filter(s => s.shndx === section.index && s.name.startsWith('$'));
    check(mapping.length <= 1 && mapping.every(s => s.name === '$a' && s.value === 0 && s.size === 0 && s.type === 0 && s.bind === 0),
      `${name} has an unexpected local/mapping symbol`);
    const body = elf.bytes.subarray(section.offset, section.offset + section.size);
    check(body.readUInt32LE(0) === 0xe3a01005, `${name}+0 must be mov r1, #5`);
    check(((body.readUInt32LE(4) & 0xff000000) >>> 0) === 0xea000000, `${name}+4 must be an unconditional non-link ARM branch`);
    const rels = elf.relocations.filter(r => r.section.index === section.index);
    check(rels.length === 1 && rels[0].offset === 4 && rels[0].type === R_ARM_JUMP24 && rels[0].symbol.name === expectedTarget,
      `${name} must have one R_ARM_JUMP24 tail relocation at +4`);
    bodies.push(body);
  }
  check(bodies[0].equals(bodies[1]), 'duplicate function bodies differ');
  check(elf.relocations.length === 2, 'extra relocation/address reference found');
  const globalDefinedFunctions = elf.symbols.filter(s => s.bind !== 0 && s.type === 2 && s.shndx !== 0).map(s => s.name).sort();
  check(JSON.stringify(globalDefinedFunctions) === JSON.stringify([...expectedNames].sort()), 'unexpected exported function');
  const tailSymbols = elf.symbols.filter(s => s.name === expectedTarget);
  check(tailSymbols.length === 1 && tailSymbols[0].shndx === 0, 'tail target must remain one undefined external symbol');
  return elf;
}

function validateDisassembly(objdump, objectPath) {
  for (const name of expectedNames) {
    const section = `.text.${name}`;
    const output = run(objdump, ['-dr', '-j', section, objectPath]);
    const instructions = [];
    for (const line of output.split(/\r?\n/)) {
      const m = line.match(/^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{8}|(?:[0-9a-fA-F]{2}\s+){3}[0-9a-fA-F]{2})\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*?)\s*$/);
      if (m) instructions.push({ offset: Number.parseInt(m[1], 16), mnemonic: m[2].toLowerCase(), operands: m[3].toLowerCase() });
    }
    check(instructions.length === 2, `${name}: scoped disassembly did not contain exactly two instructions`);
    check(instructions[0].offset === 0 && instructions[0].mnemonic === 'mov' && /^r1,\s*#(?:5|0x5)$/.test(instructions[0].operands),
      `${name}: disassembly does not begin with mov r1, #5`);
    check(instructions[1].offset === 4 && instructions[1].mnemonic === 'b', `${name}: disassembly does not end with b`);
    check(output.includes('R_ARM_JUMP24') && output.includes(expectedTarget), `${name}: disassembly lacks the symbolic tail relocation`);
  }
}

function expectRejected(label, callback) {
  try { callback(); } catch { return; }
  fail(`hostile self-check was accepted: ${label}`);
}

function hostileChecks(validElf) {
  expectRejected('truncated ELF', () => parseElf(validElf.subarray(0, 51)));
  const parsed = parseElf(validElf);
  const changedBody = Buffer.from(validElf);
  const second = parsed.sections.find(s => s.name === `.text.${expectedNames[1]}`);
  changedBody[second.offset] ^= 1;
  expectRejected('non-identical duplicate', () => validateObject(changedBody));
  const changedReloc = Buffer.from(validElf);
  changedReloc.writeUInt32LE((changedReloc.readUInt32LE(parsed.relocations[0].fileOffset) & 0xffffff00) | 28, parsed.relocations[0].fileOffset);
  expectRejected('R_ARM_CALL substitution', () => validateObject(changedReloc));
  const hostileSize = Buffer.from(validElf);
  const shoff = hostileSize.readUInt32LE(32);
  hostileSize.writeUInt32LE(0xffffffff, shoff + second.index * 40 + 20);
  expectRejected('out-of-bounds section', () => parseElf(hostileSize));
}

function main() {
  const configText = readFileSync(configPath, 'utf8');
  const config = JSON.parse(configText);
  validateConfig(config);
  const sourcePath = join(root, config.source);
  const source = readFileSync(sourcePath);
  const sourceHash = sha256(source);
  check(/^[0-9a-f]{64}$/.test(config.sourceSha256) && config.sourceSha256 === sourceHash, 'sourceSha256 mismatch');
  const spec = readFileSync(specPath, 'utf8');
  check(spec.includes(`sourceSha256\`: \`${sourceHash}\``), 'specification sourceSha256 mismatch');
  check(!configText.includes('PENDING_IMPLEMENTATION'), 'config hash placeholder remains');

  const tools = toolPair();
  const temporary = mkdtempSync(join(tmpdir(), 'arm-duplicate-templates-82-'));
  try {
    const objectPath = join(temporary, 'arm_duplicate_templates_82.o');
    // Absolute paths and a foreign cwd make this a real standalone/cwd-independence check.
    run(tools.as, ['-march=armv6k', '-mfpu=vfpv2', '-o', objectPath, sourcePath], { cwd: temporary });
    const object = readFileSync(objectPath);
    validateObject(object);
    validateDisassembly(tools.objdump, objectPath);
    hostileChecks(object);
    console.log(`arm duplicate templates 82: OK (16 bytes, 4 instructions, 2 R_ARM_JUMP24 tails; ${tools.origin})`);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

try { main(); } catch (error) { console.error(`arm duplicate templates 82: FAIL: ${error.message}`); process.exitCode = 1; }
