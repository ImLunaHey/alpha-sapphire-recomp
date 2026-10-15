import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "config/arm-duplicate-templates-17.json"), "utf8"));
const sources = JSON.parse(readFileSync(resolve(root, "config/sources.json"), "utf8"));
const source = readFileSync(resolve(root, manifest.source), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(`arm duplicate templates 17: ${message}`);
}

const macroForTemplate = new Map([
  ["xDirectionScaler", "X_DIRECTION_SCALER"],
  ["yDirectionScaler", "Y_DIRECTION_SCALER"],
  ["saturatingSampleScaler", "SATURATING_SAMPLE_SCALER"],
  ["intrusiveEraseRecycle", "INTRUSIVE_ERASE_RECYCLE"],
  ["taggedPointerLookup", "TAGGED_POINTER_LOOKUP"],
  ["vtableResetRelease", "VTABLE_RESET_RELEASE"],
]);

assert(manifest.version === 1 && manifest.mode === "arm", "invalid manifest header");
assert(manifest.functions.length === 15, "manifest must describe 15 functions");
assert(new Set(manifest.functions.map(({ name }) => name)).size === 15, "function names must be unique");
assert(manifest.functions.reduce((sum, entry) => sum + entry.bodySize, 0) === manifest.expectedBodyBytes,
  "body-byte total does not match manifest");
assert(manifest.expectedBodyBytes === 1520, "expected body-byte total must be 1520");
const configured = sources.sources.filter(({ path }) => path === manifest.source);
assert(configured.length === 1 && configured[0].mode === manifest.mode,
  "source must occur once in config/sources.json with ARM mode");

for (const entry of manifest.functions) {
  const macro = macroForTemplate.get(entry.template);
  assert(macro, `unknown template ${entry.template}`);
  assert(new RegExp(`^${macro}\\s+${entry.name}(?:,|\\s*$)`, "m").test(source),
    `${entry.name} is not emitted by ${macro}`);
  assert((source.match(new RegExp(`\\b${entry.name}\\b`, "g")) ?? []).length === 1,
    `${entry.name} must occur exactly once in the source`);
  for (const literal of entry.literals ?? []) {
    assert(Number.isInteger(literal.offset) && literal.offset >= entry.bodySize,
      `${entry.name} has an invalid literal offset`);
    assert(Number.isInteger(literal.loadOffset) && literal.loadOffset < entry.bodySize,
      `${entry.name} has an invalid literal-load offset`);
    assert(Object.hasOwn(manifest.literalIdentities, literal.identity),
      `${entry.name} names an unknown literal identity`);
  }
  for (const call of entry.calls ?? []) {
    assert(Number.isInteger(call.offset) && call.offset < entry.bodySize && call.target,
      `${entry.name} has an invalid call`);
  }
}

const identitySymbols = Object.values(manifest.literalIdentities);
assert(new Set(identitySymbols).size === identitySymbols.length, "literal identity symbols must be unique");
for (const symbol of identitySymbols) {
  assert(new RegExp(`^\\.extern\\s+${symbol}\\s*$`, "m").test(source),
    `missing external literal identity ${symbol}`);
}

function parseElf(path) {
  const data = readFileSync(path);
  assert(data.length >= 52 && data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])),
    `${path} is not an ELF file`);
  assert(data[4] === 1 && data[5] === 1, "expected ELF32 little-endian input");
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  const shnum = data.readUInt16LE(48);
  const shstrndx = data.readUInt16LE(50);
  assert(shentsize >= 40 && shoff + shentsize * shnum <= data.length, "invalid section table");
  const sections = [];
  for (let index = 0; index < shnum; index += 1) {
    const at = shoff + index * shentsize;
    sections.push({ index, nameOffset: data.readUInt32LE(at), type: data.readUInt32LE(at + 4),
      offset: data.readUInt32LE(at + 16), size: data.readUInt32LE(at + 20),
      link: data.readUInt32LE(at + 24), info: data.readUInt32LE(at + 28),
      entsize: data.readUInt32LE(at + 36) });
  }
  function stringAt(table, offset) {
    let end = offset;
    while (end < table.length && table[end] !== 0) end += 1;
    return table.toString("utf8", offset, end);
  }
  const namesHeader = sections[shstrndx];
  assert(namesHeader, "missing section-name string table");
  const names = data.subarray(namesHeader.offset, namesHeader.offset + namesHeader.size);
  for (const section of sections) section.name = stringAt(names, section.nameOffset);
  const symtab = sections.find(({ type }) => type === 2);
  assert(symtab && symtab.entsize >= 16, "missing ELF symbol table");
  const stringsHeader = sections[symtab.link];
  const strings = data.subarray(stringsHeader.offset, stringsHeader.offset + stringsHeader.size);
  const symbols = [];
  for (let at = symtab.offset; at < symtab.offset + symtab.size; at += symtab.entsize) {
    symbols.push({ name: stringAt(strings, data.readUInt32LE(at)), value: data.readUInt32LE(at + 4),
      size: data.readUInt32LE(at + 8), info: data[at + 12], shndx: data.readUInt16LE(at + 14) });
  }
  const relocations = [];
  for (const relocationSection of sections.filter(({ type }) => type === 9)) {
    const target = sections[relocationSection.info];
    const step = relocationSection.entsize || 8;
    for (let at = relocationSection.offset; at < relocationSection.offset + relocationSection.size; at += step) {
      const info = data.readUInt32LE(at + 4);
      relocations.push({ section: target.name, offset: data.readUInt32LE(at),
        type: info & 0xff, symbol: symbols[info >>> 8]?.name });
    }
  }
  return { data, sections, symbols, relocations };
}

function literalTarget(word, instructionOffset) {
  const pc = instructionOffset + 8;
  const up = (word & (1 << 23)) !== 0;
  const displacement = ((word >>> 26) & 3) === 1 ? word & 0xfff : (word & 0xff) * 4;
  return up ? pc + displacement : pc - displacement;
}

if (process.argv[2]) {
  const elf = parseElf(resolve(process.cwd(), process.argv[2]));
  const symbolByName = new Map(elf.symbols.map((symbol) => [symbol.name, symbol]));
  const bodyByName = new Map();
  for (const entry of manifest.functions) {
    const sectionName = `.text.${entry.name}`;
    const section = elf.sections.find(({ name }) => name === sectionName);
    const symbol = symbolByName.get(entry.name);
    assert(section, `missing section ${sectionName}`);
    assert(symbol && (symbol.info & 0xf) === 2, `missing function symbol ${entry.name}`);
    assert(symbol.shndx === section.index && symbol.value === 0, `${entry.name} must begin its section`);
    assert(symbol.size === entry.bodySize, `${entry.name} has body size ${symbol.size}, expected ${entry.bodySize}`);
    const literals = entry.literals ?? [];
    assert(section.size === entry.bodySize + literals.length * 4, `${sectionName} has the wrong size`);
    const bytes = elf.data.subarray(section.offset, section.offset + section.size);
    bodyByName.set(entry.name, bytes.subarray(0, entry.bodySize));
    const relocations = elf.relocations.filter(({ section: target }) => target === sectionName);
    assert(relocations.length === literals.length + (entry.calls?.length ?? 0),
      `${entry.name} has an unexpected relocation count`);
    for (const literal of literals) {
      const relocation = relocations.find(({ offset }) => offset === literal.offset);
      assert(relocation?.type === 2 && relocation.symbol === manifest.literalIdentities[literal.identity],
        `${entry.name} literal at ${literal.offset} has the wrong identity relocation`);
      assert(literalTarget(bytes.readUInt32LE(literal.loadOffset), literal.loadOffset) === literal.offset,
        `${entry.name} literal load at ${literal.loadOffset} targets the wrong slot`);
    }
    for (const call of entry.calls ?? []) {
      const relocation = relocations.find(({ offset }) => offset === call.offset);
      assert(relocation?.type === 28 && relocation.symbol === call.target,
        `${entry.name} call at ${call.offset} has the wrong ARM call relocation`);
    }
  }
  const groups = new Map();
  for (const entry of manifest.functions) groups.set(entry.template,
    [...(groups.get(entry.template) ?? []), entry.name]);
  for (const [template, names] of groups) {
    for (const name of names.slice(1)) assert(bodyByName.get(names[0]).equals(bodyByName.get(name)),
      `${name} body differs from the ${template} template`);
  }
}

console.log(`Validated ${manifest.functions.length} ARM duplicate-template functions (${manifest.expectedBodyBytes} body bytes).`);
