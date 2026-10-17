#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-127.json");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_127.S");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_runtime_helpers_127.md");
const RAW_CONFIG_HASH = "2403d05a15e6c88a2ecd93af1522fd18dc59f8ed1dfd2943cb9999b7fa000e5c";
const CONTRACT_HASH = "6d6b3319dace6e9563335babd162dcc0098876b564bee05484b5188be803b770";
const SOURCE_HASH = "c1f139adb24842e240943fc88efb587c526d09aa39f8e19eb0f49d1a0a5ac9ff";
const SPEC_HASH = "c993e153f896d62f89287c9f78feff61c27e58f2fb66cc8dbe911d602912482f";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");
const LIMITS = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16_384, symbols: 1_000_000, relocs: 1_000_000 };

const FUNCTIONS = [
  {
    name: "func_002C0C68", address: 0x002c0c68, body: 108, owned: 108,
    next: "func_002C0CD4", nextOffset: 108, callOffset: 28, target: "func_001950F8",
    words: [3912056944,3785379840,3800042250,3800043345,3785375745,3851423744,3785359364,3959422974,3800374313,3800390698,3788579774,3800387725,3818913792,3854835718,3788575678,3785364513,3854831623,3855945728,3854831624,3854827529,3854827530,3854827531,3854827532,3854827533,3854827534,3854827535,3904733296]
  },
  {
    name: "func_002E0130", address: 0x002e0130, body: 116, owned: 116,
    next: "func_002E01B0", nextOffset: 128, callOffset: 12, target: "func_001744C4",
    words: [3912056944,3785375745,3785379840,3959422974,3851747408,3871280944,3850633216,3851747412,3871280944,3850633220,3851747416,3871280944,3850633224,3851747420,3871280944,3850633228,3851747424,3871280944,3850633232,3851747428,3871280944,3850633236,3851747432,3871280944,3850633240,3851747436,3871280944,3850633244,3904733296]
  },
  {
    name: "func_002F30B0", address: 0x002f30b0, body: 240, owned: 240,
    next: "func_002F31A0", nextOffset: 240, callOffset: 72, target: "func_00184020",
    words: [3912057328,3785375747,3785388032,3800891416,3785392129,3901751306,3795979013,3796893702,3818913793,60817412,3785379842,3758227604,3851616256,3800039455,3821035551,3766878210,3850567680,3785359366,3959422974,3851890740,3818913792,3785367552,3764597123,3766956291,3850600504,3851890740,3764597123,3766956291,3850588220,3851890740,3764597123,3766956291,3854778432,3851890740,3764597123,3766956291,3854762049,3851882548,3764457857,3766948097,3850461252,3851882548,3764457857,3766948097,3850444872,3851882548,3764457857,3766948097,3850436684,3851882548,3764457857,3766948097,3850436688,3851878452,3800039425,3850829876,3764392320,3766944001,3800039452,3904733680]
  }
];
const TARGETS = new Map([["func_001950F8", 0x001950f8], ["func_001744C4", 0x001744c4], ["func_00184020", 0x00184020]]);

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha256(data) { return crypto.createHash("sha256").update(data).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function addChecked(a, b, limit, what) {
  check(Number.isSafeInteger(a) && Number.isSafeInteger(b) && a >= 0 && b >= 0 && a <= limit - b, `${what} is out of bounds`);
  return a + b;
}
function range(buffer, offset, size, what) { return buffer.subarray(offset, addChecked(offset, size, buffer.length, what)); }
function cstring(buffer, offset, what) {
  check(Number.isInteger(offset) && offset >= 0 && offset < buffer.length, `${what} string offset is invalid`);
  const end = buffer.indexOf(0, offset);
  check(end >= 0 && end - offset <= 4096, `${what} string is unterminated or too long`);
  return buffer.toString("utf8", offset, end);
}
function enforceLimits(values) {
  for (const [name, value] of Object.entries(values)) check(Number.isSafeInteger(value) && value >= 0 && value <= LIMITS[name], `${name} limit exceeded`);
}

function parseElf(buffer) {
  enforceLimits({ file: buffer.length });
  check(buffer.length >= 52, "truncated ELF header");
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "not ELF32 little-endian version 1");
  check(buffer[7] === 0 && buffer[8] === 0 && buffer.subarray(9, 16).every((v) => v === 0), "noncanonical ELF identification");
  check(buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40 && buffer.readUInt32LE(20) === 1, "wrong ELF type, machine, or version");
  check(buffer.readUInt32LE(24) === 0 && buffer.readUInt32LE(28) === 0, "relocatable ELF has entry or program headers");
  check(buffer.readUInt32LE(36) === 0x05000000, "ELF flags are not exactly EABI5");
  check(buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(42) === 0 && buffer.readUInt16LE(44) === 0 && buffer.readUInt16LE(46) === 40, "noncanonical ELF header sizes");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && count > 0 && count < 0xffff, "invalid section table");
  enforceLimits({ sections: count });
  range(buffer, shoff, count * 40, "section table");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const p = shoff + index * 40;
    sections.push({ index, header: p, nameOffset: buffer.readUInt32LE(p), type: buffer.readUInt32LE(p + 4), flags: buffer.readUInt32LE(p + 8), addr: buffer.readUInt32LE(p + 12), offset: buffer.readUInt32LE(p + 16), size: buffer.readUInt32LE(p + 20), link: buffer.readUInt32LE(p + 24), info: buffer.readUInt32LE(p + 28), align: buffer.readUInt32LE(p + 32), entsize: buffer.readUInt32LE(p + 36) });
  }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(shstrndx > 0 && shstrndx < count && sections[shstrndx].type === 3, "invalid section-name table");
  const shstrings = range(buffer, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  let exec = 0, symbols = 0, relocs = 0;
  for (const section of sections) {
    section.name = cstring(shstrings, section.nameOffset, `section ${section.index}`);
    if (section.flags & 4) exec = addChecked(exec, section.size, LIMITS.exec, "exec limit");
    if (section.type === 2 || section.type === 11) {
      check(section.entsize === 16 && section.size % 16 === 0, `invalid symbol table ${section.name}`);
      symbols = addChecked(symbols, section.size / 16, LIMITS.symbols, "symbols limit");
    }
    if (section.type === 9 || section.type === 4) {
      const width = section.type === 9 ? 8 : 12;
      check(section.entsize === width && section.size % width === 0, `invalid relocation table ${section.name}`);
      relocs = addChecked(relocs, section.size / width, LIMITS.relocs, "relocs limit");
    }
  }
  enforceLimits({ exec, symbols, relocs });
  for (const section of sections) if (section.type !== 8) range(buffer, section.offset, section.size, `section ${section.name}`);
  const symtabs = sections.filter((s) => s.type === 2), dynsyms = sections.filter((s) => s.type === 11);
  check(symtabs.length === 1 && dynsyms.length === 0, "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.flags === 0 && symtab.addr === 0 && symtab.align === 4 && symtab.offset % 4 === 0 && symtab.link < count && sections[symtab.link].type === 3, "invalid SYMTAB metadata");
  const strings = range(buffer, sections[symtab.link].offset, sections[symtab.link].size, "symbol string table");
  const entries = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const p = symtab.offset + index * 16, nameOffset = buffer.readUInt32LE(p);
    entries.push({ index, entry: p, nameOffset, name: cstring(strings, nameOffset, `symbol ${index}`), value: buffer.readUInt32LE(p + 4), size: buffer.readUInt32LE(p + 8), bind: buffer[p + 12] >>> 4, type: buffer[p + 12] & 15, other: buffer[p + 13], shndx: buffer.readUInt16LE(p + 14) });
  }
  check(symtab.info <= entries.length && entries.every((s, i) => i < symtab.info ? s.bind === 0 : s.bind !== 0), "invalid local/global symbol partition");
  check(entries.length > 0 && entries[0].nameOffset === 0 && entries[0].name === "" && entries[0].value === 0 && entries[0].size === 0 && entries[0].bind === 0 && entries[0].type === 0 && entries[0].other === 0 && entries[0].shndx === 0, "null symbol is not canonical");
  return { buffer, sections, symtab, symbols: entries, relocationSections: sections.filter((s) => s.type === 9 || s.type === 4) };
}

function expectedBytes(fn) {
  const bytes = Buffer.alloc(fn.owned);
  fn.words.forEach((word, index) => bytes.writeUInt32LE(word, index * 4));
  return bytes;
}

function validateObject(buffer) {
  const elf = parseElf(buffer), byName = new Map(elf.sections.map((s) => [s.name, s]));
  const ownedNames = FUNCTIONS.map((fn) => `.text.${fn.name}`);
  check(JSON.stringify(elf.sections.filter((s) => (s.flags & 4) && s.size).map((s) => s.name)) === JSON.stringify(ownedNames), "nonempty executable section set is not exact");
  for (const fn of FUNCTIONS) {
    const section = byName.get(`.text.${fn.name}`);
    check(section && elf.sections.filter((s) => s.name === section.name).length === 1, `${fn.name}: missing or duplicate owned section`);
    check(section.type === 1 && section.flags === 6 && section.addr === 0 && section.size === fn.owned && section.align === 4 && section.link === 0 && section.info === 0 && section.entsize === 0, `${fn.name}: invalid section metadata`);
    check(range(buffer, section.offset, section.size, fn.name).equals(expectedBytes(fn)), `${fn.name}: instruction or relocation addend mismatch`);
    const members = elf.symbols.filter((s) => s.shndx === section.index);
    const canonical = (s, name, bind, type, value, size) => s.name === name && s.bind === bind && s.type === type && s.value === value && s.size === size && s.other === 0;
    check(members.length === 3 && members.filter((s) => canonical(s, "", 0, 3, 0, 0)).length === 1 && members.filter((s) => canonical(s, "$a", 0, 0, 0, 0)).length === 1 && members.filter((s) => canonical(s, fn.name, 1, 2, 0, fn.body)).length === 1, `${fn.name}: section, function, or ARM mapping symbols differ`);
    const rels = elf.relocationSections.filter((s) => s.info === section.index);
    check(rels.length === 1, `${fn.name}: expected one relocation section`);
    const rel = rels[0];
    check(rel.name === `.rel.text.${fn.name}` && rel.type === 9 && rel.flags === 0x40 && rel.addr === 0 && rel.size === 8 && rel.link === elf.symtab.index && rel.align === 4 && rel.entsize === 8, `${fn.name}: invalid REL metadata`);
    const offset = buffer.readUInt32LE(rel.offset), info = buffer.readUInt32LE(rel.offset + 4), symbol = elf.symbols[info >>> 8];
    check(offset === fn.callOffset && (info & 255) === 28 && symbol?.name === fn.target, `${fn.name}: call relocation differs`);
  }
  const attributes = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attributes.length === 1 && attributes[0].type === 0x70000003 && attributes[0].flags === 0 && attributes[0].addr === 0 && attributes[0].align === 1 && attributes[0].link === 0 && attributes[0].info === 0 && attributes[0].entsize === 0 && range(buffer, attributes[0].offset, attributes[0].size, "ARM attributes").equals(ARM_ATTRIBUTES), "ARM attributes differ");
  const expectedGlobals = new Set([...FUNCTIONS.map((fn) => fn.name), ...TARGETS.keys()]);
  const globals = elf.symbols.filter((s) => s.bind !== 0);
  check(globals.length === expectedGlobals.size && globals.every((s) => expectedGlobals.has(s.name)), "global symbol set is not exact");
  for (const [name] of TARGETS) {
    const matches = globals.filter((s) => s.name === name);
    check(matches.length === 1 && matches[0].bind === 1 && matches[0].type === 0 && matches[0].other === 0 && matches[0].value === 0 && matches[0].size === 0 && matches[0].shndx === 0, `invalid undefined call identity ${name}`);
  }
  check(elf.relocationSections.length === FUNCTIONS.length && elf.relocationSections.every((s) => s.type === 9), "relocation section set is not exact");
  return elf;
}

function hasDefinition(text, name) {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,)|\\b${name}\\s*\\([^;]*\\)\\s*\\{`).test(clean);
}

function validateOwnership(config) {
  for (const relative of fs.readdirSync(path.join(ROOT, "src"), { recursive: true })) {
    const filename = `src/${relative}`;
    if (filename === config.source || !/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename)) continue;
    const text = fs.readFileSync(path.join(ROOT, filename), "utf8");
    for (const fn of FUNCTIONS) check(!hasDefinition(text, fn.name), `duplicate source owner for ${fn.name} in ${filename}`);
  }
  for (const relative of fs.readdirSync(path.join(ROOT, "config"), { recursive: true })) {
    if (relative === path.basename(CONFIG_PATH) || !relative.endsWith(".json")) continue;
    let other; try { other = JSON.parse(fs.readFileSync(path.join(ROOT, "config", relative), "utf8")); } catch { continue; }
    for (const row of Array.isArray(other.functions) ? other.functions : []) {
      const match = /^func_([0-9A-Fa-f]{8})$/.exec(row.name ?? "");
      const start = row.address ? Number.parseInt(row.address, 16) : match ? Number.parseInt(match[1], 16) : NaN;
      const size = row.ownedSize ?? row.size;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(size) || size <= 0) continue;
      for (const fn of FUNCTIONS) check(start >= fn.address + fn.owned || start + size <= fn.address, `overlapping config owner for ${fn.name} in ${relative}`);
    }
  }
}

function validatePinnedInputs() {
  const raw = fs.readFileSync(CONFIG_PATH), config = JSON.parse(raw);
  check(sha256(raw) === RAW_CONFIG_HASH, "raw configuration does not equal validator pin");
  check(sha256(Buffer.from(stable(config))) === CONTRACT_HASH, "normalized configuration does not equal validator pin");
  check(config.sourceHash === SOURCE_HASH && sha256(fs.readFileSync(SOURCE_PATH)) === SOURCE_HASH, "assembly source hash mismatch");
  check(sha256(fs.readFileSync(SPEC_PATH)) === SPEC_HASH, "specification hash mismatch");
  check(config.totalBodySize === 464 && config.totalAdjacentSize === 0 && config.expectedInstructionCount === 116 && config.memoryOperationCount === 57 && config.expectedRelocationCount === 3 && config.functions.length === 3, "configuration totals differ");
  for (const fn of FUNCTIONS) {
    const row = config.functions.find((entry) => entry.name === fn.name);
    check(row && Number.parseInt(row.address, 16) === fn.address && row.size === fn.body && row.ownedSize === fn.owned && row.nextGlobal === fn.next && row.nextGlobalOffset === fn.nextOffset, `${fn.name}: configuration contract differs`);
  }
  validateOwnership(config);
}

function findAssembler() {
  const candidates = [process.env.ARM_AS, "arm-none-eabi-as"].filter(Boolean);
  try { for (const entry of fs.readdirSync("/nix/store")) candidates.push(path.join("/nix/store", entry, "bin/arm-none-eabi-as")); } catch {}
  for (const candidate of candidates) if (candidate.includes("/") ? fs.existsSync(candidate) : spawnSync("sh", ["-c", `command -v ${candidate}`]).status === 0) return candidate;
  fail("arm-none-eabi-as not found");
}
function assemble(source, output) {
  const result = spawnSync(findAssembler(), ["-march=armv6k", "-mfpu=vfpv2", "-o", output, source], { encoding: "utf8" });
  check(result.status === 0, result.stderr || result.stdout || "assembly failed");
}

function reject(label, operation, pattern) {
  let error; try { operation(); } catch (caught) { error = caught; }
  check(error && (!pattern || pattern.test(error.message)), `self-test ${label} failed: ${error?.message ?? "accepted"}`);
}

function selfTest() {
  validatePinnedInputs();
  for (const definition of [`${FUNCTIONS[0].name}:`, `.set ${FUNCTIONS[0].name}, other`, `.equ ${FUNCTIONS[0].name}, other`, `.equiv ${FUNCTIONS[0].name}, other`, `.thumb_set ${FUNCTIONS[0].name}, other`, `int ${FUNCTIONS[0].name}(void) { return 0; }`]) check(hasDefinition(definition, FUNCTIONS[0].name), `definition detector missed ${definition}`);
  check(!hasDefinition(`extern int ${FUNCTIONS[0].name}(void);\n/* ${FUNCTIONS[0].name}: */`, FUNCTIONS[0].name), "definition detector rejected declaration or comment");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "runtime127-"));
  try {
    const objectPath = path.join(directory, "lane.o"); assemble(SOURCE_PATH, objectPath);
    const valid = fs.readFileSync(objectPath), base = validateObject(valid);
    let rejected = 0;
    const mutate = (label, change, pattern, parser = validateObject) => {
      const copy = Buffer.from(valid), elf = parseElf(copy); change(copy, elf);
      reject(label, () => parser(copy), pattern); rejected++;
    };
    const sectionHeader = (buffer, section) => buffer.readUInt32LE(32) + section.index * 40;
    const symbolEntry = (elf, symbol) => elf.symtab.offset + symbol.index * 16;
    for (const fn of FUNCTIONS) {
      const section = base.sections.find((s) => s.name === `.text.${fn.name}`);
      for (let offset = 0; offset < fn.owned; offset += 4) mutate(`${fn.name} word ${offset}`, (b) => { b[section.offset + offset] ^= 1; }, /instruction|addend/);
    }
    const first = base.sections.find((s) => s.name === `.text.${FUNCTIONS[0].name}`), firstRel = base.relocationSections.find((s) => s.info === first.index);
    for (const [label, field, value] of [["type",4,8],["flags",8,7],["address",12,4],["size",20,first.size-4],["link",24,1],["info",28,1],["alignment",32,8],["entry-size",36,4]]) mutate(`owned ${label}`, (b) => b.writeUInt32LE(value, sectionHeader(b, first) + field));
    for (const [label, field, value] of [["RELA",4,4],["flags",8,0],["address",12,4],["size",20,16],["link",24,0],["info",28,0],["alignment",32,8],["entry-size",36,4]]) mutate(`relocation ${label}`, (b) => b.writeUInt32LE(value, sectionHeader(b, firstRel) + field));
    mutate("relocation offset", (b) => b.writeUInt32LE(0, firstRel.offset));
    mutate("relocation type", (b) => { const p = firstRel.offset + 4; b.writeUInt32LE((b.readUInt32LE(p) & ~255) | 29, p); });
    mutate("relocation symbol", (b, e) => { const p = firstRel.offset + 4, index = e.symbols.find((s) => s.name === FUNCTIONS[1].target).index; b.writeUInt32LE((index << 8) | 28, p); });
    mutate("relocation symbol bounds", (b) => b.writeUInt32LE(0xffffff1c, firstRel.offset + 4));
    mutate("ARM mapping", (b, e) => b.writeUInt32LE(4, symbolEntry(e, e.symbols.find((s) => s.name === "$a" && s.shndx === first.index)) + 4));
    mutate("function size", (b, e) => b.writeUInt32LE(4, symbolEntry(e, e.symbols.find((s) => s.name === FUNCTIONS[0].name)) + 8));
    mutate("function Thumb state", (b, e) => b.writeUInt32LE(1, symbolEntry(e, e.symbols.find((s) => s.name === FUNCTIONS[0].name)) + 4));
    mutate("section symbol", (b, e) => b.writeUInt32LE(4, symbolEntry(e, e.symbols.find((s) => s.type === 3 && s.shndx === first.index)) + 4));
    mutate("undefined identity metadata", (b, e) => { const s = e.symbols.find((s) => s.name === FUNCTIONS[0].target); b[symbolEntry(e, s) + 12] = 0x12; });
    mutate("split identity", (b, e) => { const a = e.symbols.find((s) => s.name === FUNCTIONS[0].target), z = e.symbols.find((s) => s.name === FUNCTIONS[1].target); b.writeUInt32LE(a.nameOffset, symbolEntry(e, z)); });
    mutate("null symbol", (b, e) => b.writeUInt32LE(1, e.symtab.offset + 4));
    mutate("symbol partition", (b, e) => b.writeUInt32LE(0, sectionHeader(b, e.symtab) + 28));
    mutate("symbol name bounds", (b, e) => b.writeUInt32LE(0xffffffff, symbolEntry(e, e.symbols[1])));
    mutate("ELF class", (b) => { b[4] = 2; });
    mutate("ELF endian", (b) => { b[5] = 2; });
    mutate("ELF machine", (b) => b.writeUInt16LE(3, 18));
    mutate("ELF flags", (b) => b.writeUInt32LE(0, 36));
    mutate("program headers", (b) => b.writeUInt32LE(52, 28));
    mutate("section table bounds", (b) => b.writeUInt32LE(0xfffffff0, 32));
    mutate("section zero", (b) => b.writeUInt32LE(1, b.readUInt32LE(32) + 4));
    mutate("ARM attributes", (b, e) => { const s = e.sections.find((s) => s.name === ".ARM.attributes"); b[s.offset + s.size - 1] ^= 1; });
    const text = base.sections.find((s) => s.name === ".text");
    mutate("foreign executable payload", (b) => b.writeUInt32LE(4, sectionHeader(b, text) + 20));
    for (const size of [0, 1, 7, 51, 52, valid.length - 1]) reject(`truncation ${size}`, () => parseElf(valid.subarray(0, size)));
    reject("file cap", () => parseElf(Buffer.alloc(LIMITS.file + 1)), /file limit/);
    mutate("section cap", (b) => b.writeUInt16LE(LIMITS.sections + 1, 48), /sections limit/, parseElf);
    mutate("exec cap", (b) => b.writeUInt32LE(LIMITS.exec + 1, sectionHeader(b, first) + 20), /exec limit/, parseElf);
    const oversized = (kind, entrySize, pattern) => {
      const copy = Buffer.alloc(17 * 1024 * 1024); valid.copy(copy); const elf = parseElf(valid);
      const candidates = kind === 2 ? [elf.symtab, elf.sections.find((s) => s.name === ".strtab")] : elf.relocationSections.slice(0, 2);
      for (const section of candidates) { const p = sectionHeader(copy, section); copy.writeUInt32LE(kind, p + 4); copy.writeUInt32LE(4096, p + 16); copy.writeUInt32LE(500_001 * entrySize, p + 20); copy.writeUInt32LE(entrySize, p + 36); }
      reject(`aggregate ${pattern.source}`, () => parseElf(copy), pattern);
    };
    oversized(2, 16, /symbols limit/); oversized(9, 8, /relocs limit/);
    const compositeSource = path.join(directory, "composite.S"), compositeObject = path.join(directory, "composite.o");
    let composite = fs.readFileSync(SOURCE_PATH, "utf8");
    for (let i = 0; i < 12_000; i++) composite += `\n.section .text.runtime127_empty_${i}, "ax", %progbits\n`;
    fs.writeFileSync(compositeSource, composite); assemble(compositeSource, compositeObject); validateObject(fs.readFileSync(compositeObject));
    process.stdout.write(`arm-runtime-helpers-127 self-test: ok (${rejected} hostile fixtures; every instruction word; 12,000-section composite)\n`);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

function readBounded(filename, maximum) {
  const descriptor = fs.openSync(filename, "r");
  try {
    const size = fs.fstatSync(descriptor).size;
    check(Number.isSafeInteger(size) && size <= maximum, "input exceeds size bound before read");
    const buffer = Buffer.alloc(size); let total = 0;
    while (total < size) { const count = fs.readSync(descriptor, buffer, total, size - total, null); check(count > 0, "input truncated during read"); total += count; }
    check(fs.readSync(descriptor, Buffer.alloc(1), 0, 1, null) === 0, "input changed during read");
    return buffer;
  } finally { fs.closeSync(descriptor); }
}

function parseInventory() {
  return fs.readFileSync(path.join(ROOT, "symbols/code.bin.csv"), "utf8").trim().split(/\r?\n/).slice(1).map((line) => {
    const fields = line.replaceAll('"', "").split(",");
    return { address: Number.parseInt(fields[0], 16), name: fields[1], mode: fields[3], size: Number.parseInt(fields[4], 16) };
  });
}
function resolvedBytes(fn) {
  const bytes = expectedBytes(fn), target = TARGETS.get(fn.target), delta = target - (fn.address + fn.callOffset + 8);
  check(delta % 4 === 0 && delta >= -0x02000000 && delta <= 0x01fffffc, `${fn.name}: call target is out of range`);
  const word = bytes.readUInt32LE(fn.callOffset);
  bytes.writeUInt32LE(((word & 0xff000000) | ((delta >> 2) & 0x00ffffff)) >>> 0, fn.callOffset);
  return bytes;
}

function validateAuthoritative(objectPath, codePath) {
  validatePinnedInputs();
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "config/targets/AS_EUR_REV2.json")));
  const code = readBounded(codePath, manifest.code.size);
  check(code.length === manifest.code.size && sha256(code) === manifest.code.sha256, "private code.bin does not match AS_EUR_REV2 manifest");
  const object = readBounded(objectPath, LIMITS.file), elf = validateObject(object);
  const targetBuffer = readBounded(path.join(ROOT, "build/AS_EUR_REV2/target/code.o"), LIMITS.file), target = parseElf(targetBuffer);
  const inventory = parseInventory(), report = JSON.parse(fs.readFileSync(path.join(ROOT, "build/AS_EUR_REV2/report.json")));
  const reports = report.units.flatMap((unit) => unit.functions ?? []);
  for (const fn of FUNCTIONS) {
    check(fn.address >= 0x002c0000 && fn.address < 0x00300000 && fn.address % 4 === 0, `${fn.name}: entry outside assigned ARM range`);
    const positions = inventory.map((row, index) => ({ row, index })).filter(({ row }) => row.name === fn.name);
    check(positions.length === 1 && positions[0].row.address === fn.address && positions[0].row.mode === "$a" && positions[0].row.size === fn.body, `${fn.name}: inventory mismatch`);
    const next = inventory[positions[0].index + 1];
    check(next?.name === fn.next && next.address - fn.address === fn.nextOffset && fn.address + fn.owned <= next.address, `${fn.name}: next-global boundary mismatch`);
    const matches = reports.filter((row) => row.name === fn.name);
    check(matches.length === 1 && Number(matches[0].size) === fn.body, `${fn.name}: missing or wrong report boundary`);
    const section = elf.sections.find((s) => s.name === `.text.${fn.name}`), targetSections = target.sections.filter((s) => s.name === `.text.${fn.name}`);
    check(targetSections.length === 1 && targetSections[0].size === fn.body, `${fn.name}: private target section mismatch`);
    const resolved = resolvedBytes(fn), original = range(code, fn.address - 0x00100000, fn.body, `${fn.name} private body`);
    check(range(targetBuffer, targetSections[0].offset, fn.body, `${fn.name} target object`).equals(resolved), `${fn.name}: generated target object disagrees`);
    check(resolved.equals(original), `${fn.name}: authoritative body mismatch`);
    let occurrences = 0, cursor = 0;
    while ((cursor = code.indexOf(resolved, cursor)) >= 0) { occurrences++; cursor++; }
    check(occurrences === 1, `${fn.name}: complete body is not unique`);
  }
  for (const row of inventory.filter((entry) => entry.mode === "$a")) {
    for (let offset = 0; offset + 4 <= row.size; offset += 4) {
      const pc = row.address + offset, word = code.readUInt32LE(pc - 0x00100000); let destination;
      if ((word & 0x0e000000) === 0x0a000000) destination = pc + 8 + ((word << 8) >> 6);
      else if ((word & 0x0f7f0000) === 0x051f0000) destination = pc + 8 + ((word & 0x00800000) ? 1 : -1) * (word & 0xfff);
      if (destination === undefined) continue;
      for (const fn of FUNCTIONS) check(destination <= fn.address || destination >= fn.address + fn.owned || destination === fn.address, `${fn.name}: unexpected branch or PC-relative reference into owned interior`);
    }
  }
  process.stdout.write("arm-runtime-helpers-127 authoritative: ok (3 functions; 464 body bytes; 0 adjacent bytes; 3 calls; byte-exact target/private agreement; no ownership overlap)\n");
}

function main() {
  validatePinnedInputs();
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") return selfTest();
  if (args.length === 3 && args[0] === "--authoritative") return validateAuthoritative(args[1], args[2]);
  check(args.length === 1 && !args[0].startsWith("-"), "usage: validate-arm-runtime-helpers-127.mjs <object-file> | --self-test | --authoritative <object-file> <private-code.bin>");
  validateObject(readBounded(args[0], LIMITS.file));
  process.stdout.write(`arm-runtime-helpers-127 validation: ok (${args[0]})\n`);
}

try { main(); } catch (error) { process.stderr.write(`arm-runtime-helpers-127 validation failed: ${error.message}\n`); process.exitCode = 1; }
