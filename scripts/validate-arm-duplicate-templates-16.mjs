import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'config/arm-duplicate-templates-16.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const source = fs.readFileSync(path.join(root, manifest.source), 'utf8');
const fail = (message) => { throw new Error(`arm duplicate templates 16: ${message}`); };

if (manifest.schemaVersion !== 1 || manifest.mode !== 'arm') fail('unsupported manifest schema or mode');
const functions = manifest.groups.flatMap((group) => group.functions.map((name) => ({ ...group, name })));
const names = functions.map(({ name }) => name);
const bodyBytes = functions.reduce((sum, entry) => sum + entry.size, 0);
if (new Set(names).size !== names.length || names.length !== manifest.functionCount) fail('invalid function inventory');
if (bodyBytes !== manifest.bodyBytes) fail(`body total ${bodyBytes} does not equal ${manifest.bodyBytes}`);
for (const { template, name } of functions) {
  const registration = new RegExp(`^${template}\\s+${name}$`, 'gm');
  if ([...source.matchAll(registration)].length !== 1) fail(`expected one ${template} invocation for ${name}`);
}
if (/^\s*\.(?:inst|byte|hword|short|long)\b/m.test(source)) fail('raw encoding directive in source');
const sourceWords = [...source.matchAll(/^\s*\.word\s+([^\s/]+)\s*$/gm)].map((match) => match[1]);
const expectedSourceWords = [
  '\\name\\()_coefficient_table',
  'arm_duplicate_templates_16_initial_float',
  '\\name\\()_type_identity',
  '\\name\\()_type_identity',
  'arm_duplicate_templates_16_empty_identity',
  'arm_duplicate_templates_16_primary_table'
];
if (JSON.stringify(sourceWords) !== JSON.stringify(expectedSourceWords)) fail('symbolic literal declarations changed');

if (process.argv.length === 2) {
  console.log(`Validated ${names.length} source registrations (${bodyBytes} ARM bytes).`);
  process.exit(0);
}
if (process.argv.length !== 3) fail('usage: validate-arm-duplicate-templates-16.mjs [base-object]');

const elf = fs.readFileSync(path.resolve(process.argv[2]));
if (elf.length < 52 || !elf.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))) fail('invalid ELF');
if (elf[4] !== 1 || elf[5] !== 1) fail('expected ELF32 little-endian');
const u16 = (offset) => elf.readUInt16LE(offset);
const u32 = (offset) => elf.readUInt32LE(offset);
const sectionOffset = u32(32);
const sectionEntrySize = u16(46);
const sectionCount = u16(48);
const sectionNameIndex = u16(50);
if (sectionEntrySize < 40 || sectionNameIndex >= sectionCount) fail('invalid section table');
const sections = [];
for (let index = 0; index < sectionCount; index += 1) {
  const offset = sectionOffset + index * sectionEntrySize;
  sections.push({
    index,
    nameOffset: u32(offset),
    type: u32(offset + 4),
    offset: u32(offset + 16),
    size: u32(offset + 20),
    link: u32(offset + 24),
    info: u32(offset + 28),
    entrySize: u32(offset + 36)
  });
}
const shstr = sections[sectionNameIndex];
const readString = (table, offset) => {
  const start = table.offset + offset;
  const end = elf.indexOf(0, start);
  if (end < start || end >= table.offset + table.size) fail('invalid ELF string');
  return elf.toString('utf8', start, end);
};
for (const section of sections) section.name = readString(shstr, section.nameOffset);
const byName = new Map(sections.map((section) => [section.name, section]));
const symtab = sections.find((section) => section.type === 2);
if (!symtab || symtab.entrySize < 16 || symtab.link >= sections.length) fail('missing symbol table');
const strtab = sections[symtab.link];
const symbols = [];
for (let offset = 0; offset < symtab.size; offset += symtab.entrySize) {
  const at = symtab.offset + offset;
  symbols.push({
    name: readString(strtab, u32(at)),
    value: u32(at + 4),
    size: u32(at + 8),
    info: elf[at + 12],
    sectionIndex: u16(at + 14)
  });
}
const symbolByName = new Map(symbols.filter(({ name }) => name).map((symbol) => [symbol.name, symbol]));
const resolvedLiterals = (group, name) => group.literalSymbols.map((symbol) => symbol.replace('$function', name));
const loadChecks = new Map([
  ['PACKED_DUAL_TRANSFORM', [[20, 0, 1]]],
  ['ALLOCATED_OBJECT_INITIALIZER', [[56, 0, 4], [68, 1, 1]]],
  ['TYPE_CHAIN_ATTACHMENT', [[28, 0, 1]]],
  ['PRIMARY_SECONDARY_LOOKUP', [[0, 0, 1], [16, 1, 1]]],
  ['REPEATED_RECORD_INITIALIZER', []]
]);

for (const group of manifest.groups) {
  let referenceBody;
  for (const name of group.functions) {
    const section = byName.get(`.text.${name}`);
    const symbol = symbolByName.get(name);
    const literalSymbols = resolvedLiterals(group, name);
    const expectedSectionSize = group.size + literalSymbols.length * 4;
    if (!section || section.size !== expectedSectionSize) fail(`${name} section has wrong size`);
    if (!symbol || (symbol.info & 15) !== 2 || symbol.value !== 0 || symbol.size !== group.size || symbol.sectionIndex !== section.index) {
      fail(`${name} function symbol is invalid`);
    }
    const body = elf.subarray(section.offset, section.offset + group.size);
    if (referenceBody && !body.equals(referenceBody)) fail(`${name} differs from its template peers`);
    referenceBody = body;
    for (const [instructionOffset, slot, scale] of loadChecks.get(group.template) ?? []) {
      const instruction = body.readUInt32LE(instructionOffset);
      const displacement = scale === 1 ? instruction & 0xfff : (instruction & 0xff) * 4;
      const target = instructionOffset + 8 + ((instruction & 0x00800000) === 0 ? -displacement : displacement);
      if (target !== group.size + slot * 4) fail(`${name} literal load at ${instructionOffset} misses slot ${slot}`);
    }
    const relocationSection = sections.find((candidate) => candidate.type === 9 && candidate.info === section.index);
    const expected = literalSymbols.map((literalSymbol, index) => ({
      offset: group.size + index * 4,
      symbol: literalSymbol
    }));
    const actual = [];
    if (relocationSection) {
      const entrySize = relocationSection.entrySize || 8;
      for (let offset = 0; offset < relocationSection.size; offset += entrySize) {
        const at = relocationSection.offset + offset;
        const info = u32(at + 4);
        actual.push({ offset: u32(at), type: info & 255, symbol: symbols[info >>> 8]?.name });
      }
    }
    if (actual.length !== expected.length) fail(`${name} has wrong relocation count`);
    for (let index = 0; index < expected.length; index += 1) {
      if (actual[index].offset !== expected[index].offset || actual[index].type !== 2 || actual[index].symbol !== expected[index].symbol) {
        fail(`${name} has an invalid symbolic literal relocation`);
      }
      if (symbolByName.get(expected[index].symbol)?.sectionIndex !== 0) fail(`${expected[index].symbol} must remain undefined`);
    }
  }
}
console.log(`Validated ${names.length} base functions (${bodyBytes} ARM bytes) and symbolic literal relocations.`);
