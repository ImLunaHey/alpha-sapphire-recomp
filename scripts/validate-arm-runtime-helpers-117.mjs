#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "config/arm-runtime-helpers-117.json");
const SOURCE_PATH = path.join(ROOT, "src/main/arm_runtime_helpers_117.S");
const SPEC_PATH = path.join(ROOT, "docs/specs/main/arm_runtime_helpers_117.md");
const RAW_CONFIG_HASH = "212656f0127a7c07e486e355c8399515ca5d50b4a75fe64db66297ebf3f5e78a";
const CONTRACT_HASH = "1fb91f4a0d6f5aa8534aa03feb3b1b1b94685bc924e4badee2cc4adb95aaf070";
const SOURCE_HASH = "c4ef9fca50b5af169c050fbb1ba2374d73d0144413f1c6eb617271f46ba94851";
const SPEC_HASH = "1ba37d44761285ecba2f175c0daa41e66de0fc9e1476ba21b856479eac1d3f64";
const ARM_ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");
const LIMITS = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16_384, symbols: 1_000_000, relocs: 1_000_000 };

const FUNCTIONS = [
  { name: "func_004151E0", address: 0x004151e0, size: 128, next: "func_00415260", nextOffset: 128, reloc: { offset: 116, symbol: "func_00124FB0" }, hex: "10402de9021110e20040a0e11900005aff1b04e2040ba0e12115a0e1110051e3200ba0e10300001a640050e3010000bab30050e30f0000da110051e30300001ab40050e3010000bac70050e3090000da110051e30300001ac80050e3010000badb0050e3030000da0400a0e10f10a0e1a42fb0e1feffff1b0400a0e11080bde8" },
  { name: "func_0041E490", address: 0x0041e490, size: 52, next: "func_0041E4C4", nextOffset: 52, reloc: { offset: 24, symbol: "func_0036DF28" }, hex: "10402de9040090e5000050e30200000a1040bde85c10a0e3feffffea0020a0e30210a0e10200a0e10000a0e10000a0e31080bde8" },
  { name: "func_0041E4C4", address: 0x0041e4c4, size: 60, next: "func_0041E534", nextOffset: 112, reloc: { offset: 32, symbol: "func_0036DF4C" }, hex: "10402de9040090e5000050e30400000a0030a0e31040bde80320a0e15c10a0e3feffffea0020a0e30210a0e10200a0e10000a0e10000a0e31080bde8" },
  { name: "func_0041EDB4", address: 0x0041edb4, size: 52, next: "func_0041EDE8", nextOffset: 52, reloc: { offset: 24, symbol: "func_0036DF28" }, hex: "10402de9040090e5000050e30200000a1040bde85b10a0e3feffffea0020a0e30210a0e10200a0e10000a0e10000a0e31080bde8" },
  { name: "func_0041EDE8", address: 0x0041ede8, size: 60, next: "func_0041EE24", nextOffset: 60, reloc: { offset: 32, symbol: "func_0036DF4C" }, hex: "10402de9040090e5000050e30400000a0030a0e31040bde80320a0e15b10a0e3feffffea0020a0e30210a0e10200a0e10000a0e10000a0e31080bde8" },
  { name: "func_00425F04", address: 0x00425f04, size: 48, next: "func_004260C4", nextOffset: 448, reloc: { offset: 44, symbol: "func_00160BA8" }, hex: "0510d0e5000051e328009015000050130200000a1010d0e5010051e30100000a0000a0e31eff2fe10410a0e3feffffea" }
];
const TARGETS = new Map([
  ["func_00124FB0", 0x00124fb0], ["func_0036DF28", 0x0036df28],
  ["func_0036DF4C", 0x0036df4c], ["func_00160BA8", 0x00160ba8]
]);

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha(data) { return crypto.createHash("sha256").update(data).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function bounded(a, b, limit, what) {
  check(Number.isSafeInteger(a) && Number.isSafeInteger(b) && a >= 0 && b >= 0 && a <= limit - b, `${what} is out of bounds`);
  return a + b;
}
function slice(bytes, offset, size, what) { return bytes.subarray(offset, bounded(offset, size, bytes.length, what)); }
function cstring(bytes, offset, what) {
  check(Number.isInteger(offset) && offset >= 0 && offset < bytes.length, `${what} string offset is invalid`);
  const relative = bytes.subarray(offset, Math.min(bytes.length, offset + 4097)).indexOf(0);
  check(relative >= 0, `${what} string is unterminated or exceeds 4096 bytes`);
  return bytes.toString("utf8", offset, offset + relative);
}
function enforce(values) {
  for (const [key, value] of Object.entries(values)) check(Number.isSafeInteger(value) && value >= 0 && value <= LIMITS[key], `${key} limit exceeded`);
}

function parseElf(bytes) {
  enforce({ file: bytes.length });
  check(bytes.length >= 52, "truncated ELF header");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "not ELF32 little-endian version 1");
  check(bytes[7] === 0 && bytes[8] === 0 && bytes.subarray(9, 16).every((v) => v === 0), "noncanonical ELF identification");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "wrong ELF type, machine, or version");
  check(bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0, "relocatable ELF has entry/program headers");
  check(bytes.readUInt32LE(36) === 0x05000000, "ELF flags are not exactly EABI5");
  check(bytes.readUInt16LE(40) === 52 && bytes.readUInt16LE(42) === 0 && bytes.readUInt16LE(44) === 0 && bytes.readUInt16LE(46) === 40, "noncanonical ELF header sizes");
  const shoff = bytes.readUInt32LE(32), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && count > 0 && count < 0xffff, "invalid section table");
  enforce({ sections: count });
  slice(bytes, shoff, count * 40, "section table");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const p = shoff + index * 40;
    sections.push({ index, header: p, nameOffset: bytes.readUInt32LE(p), type: bytes.readUInt32LE(p + 4), flags: bytes.readUInt32LE(p + 8), addr: bytes.readUInt32LE(p + 12), offset: bytes.readUInt32LE(p + 16), size: bytes.readUInt32LE(p + 20), link: bytes.readUInt32LE(p + 24), info: bytes.readUInt32LE(p + 28), align: bytes.readUInt32LE(p + 32), entsize: bytes.readUInt32LE(p + 36) });
  }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(shstrndx > 0 && shstrndx < count && sections[shstrndx].type === 3, "bad section-name table");
  const names = slice(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  let exec = 0, symbolCount = 0, relocCount = 0;
  for (const section of sections) {
    section.name = cstring(names, section.nameOffset, `section ${section.index}`);
    if (section.type !== 8) slice(bytes, section.offset, section.size, `section ${section.name}`);
    if (section.flags & 4) exec = bounded(exec, section.size, LIMITS.exec, "executable bytes");
    if (section.type === 2 || section.type === 11) {
      check(section.entsize === 16 && section.size % 16 === 0, `bad symbol table ${section.name}`);
      symbolCount = bounded(symbolCount, section.size / 16, LIMITS.symbols, "symbols");
    }
    if (section.type === 9 || section.type === 4) {
      const width = section.type === 9 ? 8 : 12;
      check(section.entsize === width && section.size % width === 0, `bad relocation table ${section.name}`);
      relocCount = bounded(relocCount, section.size / width, LIMITS.relocs, "relocations");
    }
  }
  enforce({ exec, symbols: symbolCount, relocs: relocCount });
  const symtabs = sections.filter((s) => s.type === 2), dynsyms = sections.filter((s) => s.type === 11);
  check(symtabs.length === 1 && dynsyms.length === 0, "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.flags === 0 && symtab.addr === 0 && symtab.align === 4 && symtab.link < count && sections[symtab.link].type === 3, "bad SYMTAB metadata");
  const strings = slice(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings");
  const symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const p = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(p);
    symbols.push({ index, entry: p, name: cstring(strings, nameOffset, `symbol ${index}`), value: bytes.readUInt32LE(p + 4), size: bytes.readUInt32LE(p + 8), info: bytes[p + 12], other: bytes[p + 13], shndx: bytes.readUInt16LE(p + 14) });
  }
  check(symbols[0].name === "" && symbols[0].value === 0 && symbols[0].size === 0 && symbols[0].info === 0 && symbols[0].other === 0 && symbols[0].shndx === 0, "symbol zero is not canonical");
  return { bytes, sections, symbols, symtab, shoff, count, shstrndx };
}

function validateObject(bytes) {
  const elf = parseElf(bytes), ownedNames = new Set(FUNCTIONS.map((f) => `.text.${f.name}`));
  const attrs = elf.sections.filter((s) => s.name === ".ARM.attributes");
  check(attrs.length === 1 && slice(bytes, attrs[0].offset, attrs[0].size, "attributes").equals(ARM_ATTRIBUTES), "wrong ARM attributes");
  for (const section of elf.sections) if ((section.flags & 4) && section.size > 0) check(ownedNames.has(section.name), `foreign executable payload ${section.name}`);
  const globalNames = new Set(FUNCTIONS.map((f) => f.name));
  for (const name of TARGETS.keys()) globalNames.add(name);
  const actualGlobals = elf.symbols.filter((s) => (s.info >> 4) !== 0).map((s) => s.name);
  check(actualGlobals.length === globalNames.size && actualGlobals.every((name) => globalNames.has(name)), "global symbol set differs");
  const relocSections = elf.sections.filter((s) => s.type === 9 || s.type === 4);
  check(relocSections.length === FUNCTIONS.length && relocSections.every((s) => s.type === 9), "wrong relocation-section set");
  for (const f of FUNCTIONS) {
    const sectionName = `.text.${f.name}`, matches = elf.sections.filter((s) => s.name === sectionName);
    check(matches.length === 1, `${f.name}: expected one owned section`);
    const section = matches[0], expected = Buffer.from(f.hex, "hex");
    check(section.type === 1 && section.flags === 6 && section.addr === 0 && section.size === f.size && section.align === 4 && section.link === 0 && section.info === 0 && section.entsize === 0, `${f.name}: bad section metadata`);
    check(slice(bytes, section.offset, section.size, f.name).equals(expected), `${f.name}: instruction or relocation addend mismatch`);
    const primary = elf.symbols.filter((s) => s.name === f.name);
    check(primary.length === 1 && primary[0].value === 0 && primary[0].size === f.size && primary[0].info === 0x12 && primary[0].other === 0 && primary[0].shndx === section.index, `${f.name}: bad primary symbol`);
    const mappings = elf.symbols.filter((s) => s.shndx === section.index && s.name.startsWith("$"));
    check(mappings.length === 1 && mappings[0].name === "$a" && mappings[0].value === 0 && mappings[0].size === 0 && mappings[0].info === 0 && mappings[0].other === 0, `${f.name}: bad ARM mapping symbol`);
    const sectionSymbols = elf.symbols.filter((s) => s.shndx === section.index && s.info === 3 && s.name === "");
    check(sectionSymbols.length === 1 && sectionSymbols[0].value === 0 && sectionSymbols[0].size === 0 && sectionSymbols[0].other === 0, `${f.name}: bad section symbol`);
    const named = elf.symbols.filter((s) => s.shndx === section.index && s.name && !s.name.startsWith("$"));
    check(named.length === 1 && named[0] === primary[0], `${f.name}: alias or named-local symbol present`);
    const rels = relocSections.filter((s) => s.info === section.index);
    check(rels.length === 1, `${f.name}: expected one REL section`);
    const rel = rels[0];
    check(rel.name === `.rel${sectionName}` && rel.flags === 64 && rel.addr === 0 && rel.size === 8 && rel.link === elf.symtab.index && rel.align === 4 && rel.entsize === 8, `${f.name}: bad REL metadata`);
    const offset = bytes.readUInt32LE(rel.offset), info = bytes.readUInt32LE(rel.offset + 4), symbol = elf.symbols[info >>> 8];
    check(offset === f.reloc.offset && (info & 0xff) === 29 && symbol?.name === f.reloc.symbol, `${f.name}: bad JUMP24 relocation`);
  }
  for (const [name] of TARGETS) {
    const entries = elf.symbols.filter((s) => s.name === name);
    check(entries.length === 1 && entries[0].value === 0 && entries[0].size === 0 && entries[0].info === 0x10 && entries[0].other === 0 && entries[0].shndx === 0, `${name}: bad undefined symbol`);
  }
  return elf;
}

function verifyRepository() {
  const raw = fs.readFileSync(CONFIG_PATH), config = JSON.parse(raw);
  check(sha(raw) === RAW_CONFIG_HASH && sha(Buffer.from(stable(config))) === CONTRACT_HASH, "config hash mismatch");
  check(sha(fs.readFileSync(SOURCE_PATH)) === SOURCE_HASH && sha(fs.readFileSync(SPEC_PATH)) === SPEC_HASH, "source or spec hash mismatch");
  check(config.sourceHash === SOURCE_HASH && config.totalBodySize === 400 && config.totalAdjacentSize === 0 && config.expectedInstructionCount === 100 && config.expectedRelocationCount === 6, "config totals differ");
  check(config.functions.length === FUNCTIONS.length, "config function count differs");
  for (const f of FUNCTIONS) {
    const row = config.functions.find((x) => x.name === f.name);
    check(row && Number.parseInt(row.address, 16) === f.address && row.size === f.size && row.ownedSize === f.size && row.nextGlobal === f.next && row.nextGlobalOffset === f.nextOffset, `${f.name}: config contract differs`);
  }
  const own = FUNCTIONS.map((f) => [f.address, f.address + f.size, f.name]);
  for (const file of fs.readdirSync(path.join(ROOT, "config")).filter((name) => name.endsWith(".json") && name !== path.basename(CONFIG_PATH))) {
    let other; try { other = JSON.parse(fs.readFileSync(path.join(ROOT, "config", file))); } catch { continue; }
    for (const row of other.functions ?? []) {
      const start = row.address ? Number.parseInt(row.address, 16) : /^func_([0-9A-Fa-f]{8})$/.test(row.name ?? "") ? Number.parseInt(row.name.slice(5), 16) : NaN;
      const size = row.ownedSize ?? row.size;
      if (!Number.isFinite(start) || !Number.isInteger(size) || size <= 0) continue;
      for (const [a, b, name] of own) check(row.name !== name && (start + size <= a || start >= b), `${name}: overlaps ${file}:${row.name}`);
    }
  }
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

function selfTest() {
  verifyRepository();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "runtime117-"));
  try {
    const object = path.join(dir, "lane.o"); assemble(SOURCE_PATH, object);
    const valid = fs.readFileSync(object), base = validateObject(valid);
    const reject = (label, mutate, parser = validateObject) => { const copy = Buffer.from(valid); mutate(copy, base); let rejected = false; try { parser(copy); } catch { rejected = true; } check(rejected, `${label} mutation accepted`); };
    const first = base.sections.find((s) => s.name === `.text.${FUNCTIONS[0].name}`), firstRel = base.sections.find((s) => s.type === 9 && s.info === first.index);
    reject("instruction", (copy) => { copy[first.offset] ^= 1; });
    reject("relocation offset", (copy) => { copy.writeUInt32LE(0, firstRel.offset); });
    reject("relocation type", (copy) => { copy[firstRel.offset + 4] ^= 1; });
    reject("RELA", (copy) => { copy.writeUInt32LE(4, firstRel.header + 4); });
    reject("mapping", (copy, elf) => { const symbol = elf.symbols.find((s) => s.name === "$a" && s.shndx === first.index); copy.writeUInt32LE(4, symbol.entry + 4); });
    reject("primary", (copy, elf) => { const symbol = elf.symbols.find((s) => s.name === FUNCTIONS[0].name); copy.writeUInt32LE(4, symbol.entry + 4); });
    reject("attribute", (copy, elf) => { const section = elf.sections.find((s) => s.name === ".ARM.attributes"); copy[section.offset + 1] ^= 1; });
    reject("foreign executable size", (copy, elf) => { const section = elf.sections.find((s) => s.name === ".text"); copy.writeUInt32LE(4, section.header + 20); });
    reject("section count cap", (copy) => { copy.writeUInt16LE(LIMITS.sections + 1, 48); }, parseElf);
    reject("truncated table", (copy, elf) => { copy.writeUInt32LE(copy.length - 1, 32); }, parseElf);
    const compositeSource = path.join(dir, "composite.S"), compositeObject = path.join(dir, "composite.o");
    let extra = fs.readFileSync(SOURCE_PATH, "utf8");
    for (let i = 0; i < 12_000; i++) extra += `\n.section .text.runtime117_empty_${i}, \"ax\", %progbits\n`;
    fs.writeFileSync(compositeSource, extra); assemble(compositeSource, compositeObject); validateObject(fs.readFileSync(compositeObject));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function parseInventory() {
  const text = fs.readFileSync(path.join(ROOT, "symbols/code.bin.csv"), "utf8").trim().split(/\r?\n/).slice(1);
  return text.map((line) => { const m = line.match(/^([0-9A-F]+),"([^"]+)","[^"]+",\$(.),([0-9A-F]+),/); return m && { address: Number.parseInt(m[1], 16), name: m[2], mode: m[3], size: Number.parseInt(m[4], 16) }; }).filter(Boolean);
}
function resolvedBody(f) {
  const bytes = Buffer.from(f.hex, "hex"), target = TARGETS.get(f.reloc.symbol);
  const delta = target - (f.address + f.reloc.offset + 8);
  check(delta % 4 === 0 && delta >= -0x02000000 && delta <= 0x01fffffc, `${f.name}: target out of ARM branch range`);
  const word = bytes.readUInt32LE(f.reloc.offset), resolved = (word & 0xff000000) | ((delta >> 2) & 0x00ffffff);
  bytes.writeUInt32LE(resolved >>> 0, f.reloc.offset);
  return bytes;
}
function auditPrivate(codePath) {
  verifyRepository();
  const code = fs.readFileSync(codePath), inventory = parseInventory(), byName = new Map(inventory.map((row, i) => [row.name, { row, i }]));
  for (const f of FUNCTIONS) {
    const item = byName.get(f.name); check(item, `${f.name}: missing inventory entry`);
    const { row, i } = item; check(row.address === f.address && row.mode === "a" && row.size === f.size, `${f.name}: inventory boundary/mode differs`);
    const next = inventory[i + 1]; check(next?.name === f.next && next.address - f.address === f.nextOffset, `${f.name}: next-global boundary differs`);
    const offset = f.address - 0x00100000, expected = resolvedBody(f);
    check(offset >= 0 && offset + f.size <= code.length && code.subarray(offset, offset + f.size).equals(expected), `${f.name}: private body bytes differ`);
    let occurrences = 0, cursor = 0; while ((cursor = code.indexOf(expected, cursor)) >= 0) { occurrences++; cursor++; }
    check(occurrences === 1, `${f.name}: body is not unique in private executable`);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "runtime117-private-"));
  try { const object = path.join(dir, "lane.o"); assemble(SOURCE_PATH, object); validateObject(fs.readFileSync(object)); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") { selfTest(); console.log("arm-runtime-helpers-117: PASS (synthetic hostile tests; 12,000-section composite)"); }
  else if (args.length === 2 && args[0] === "--audit-private") { auditPrivate(path.resolve(args[1])); console.log("arm-runtime-helpers-117: PASS (authoritative private bytes, boundaries, uniqueness, and ownership)"); }
  else if (args.length === 1 && !args[0].startsWith("-")) { verifyRepository(); validateObject(fs.readFileSync(path.resolve(args[0]))); console.log("arm-runtime-helpers-117: PASS"); }
  else fail("usage: validate-arm-runtime-helpers-117.mjs <object-file> | --self-test | --audit-private <private-code.bin>");
} catch (error) { console.error(`arm-runtime-helpers-117: FAIL: ${error.message}`); process.exit(1); }
