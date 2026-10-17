#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/thumb-leaf-helpers-24.json");
const specPath = join(root, "docs/specs/main/thumb_leaf_helpers_24.md");
const sourcePath = join(root, "src/main/thumb_leaf_helpers_24.S");
const LIMITS = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16_384, symbols: 1_000_000, relocs: 1_000_000 };
const expectedRawConfigHash = "b9e3c916e65c28d0b61387c6229546834887bb7fd81a5deb83d9b5c8a6f59ab3";
const expectedConfigHash = "8e250a2ff9a2267d1c01e1e611c20d03ebd32920953bfc083aa775f721490b05";
const expectedSourceHash = "6de411330334cba00bcdf99300d52d4e625839f45a1489c21f0dc36a6131f0c8";
const expectedSpecHash = "c8cd97b36c9db1a3834868fa4de92b9fa82ad7bcebf198584398cee1d7578bd2";
const expectedBodyHash = "ec525836b782deb192b969d4102dba72747a6d74708b021609049c39cdf91cae";
const expectedLinkedHash = "af14dc80dd0a51ee08d6e75b7c730baea3f0fd49a848222afce4b31fafe98d51";
const expectedAttributes = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");
const expectedText = Buffer.from(
  "f3b50400002081b0b8e0e16820008847002872d0252802d06268a168abe0594f" +
  "00267f44e168200088470500202808db312d06d2781920380078002801d00643" +
  "f0e7b00701d5042086430020e0610700a0612a2d0ad02800fff7feff002827d0" +
  "303db80000190090856119e00298ba00121902c891610290e168200088470500" +
  "012f17d1e06900281fda202086431ce000980a21806948430099401930388861" +
  "e168200088470500fff7feff0028efd1012f0ad02e2d08d1e168200088470500" +
  "202006437f1c022fc3dba069002803da4042a06101200643f00701d010208643" +
  "6c2d0bd0682d09d04c2d3cd06a2d38d0742d38d07a2d36d016e041e0e168" +
  "2f00200088470500b84209d16c2f29d001208002e168064320008847050004e0" +
  "6c2f1dd0ff2001300643002d29d028004138192803d80120c002064320352660" +
  "029a290020001600fff7feef002810d001280bd0f61df008c0000830029055e7" +
  "4020e1e78020d5e70020d3e7361d02964ce76268a16828009047206a401c2062" +
  "44e7206afebd",
  "hex",
);
const calls = [
  [88, "func_002FFB94", 3392, "thumb"],
  [168, "func_002FFB94", 3392, "thumb"],
  [326, "arm_secondary_00106078", -2067932, "arm"],
];

const sha256 = (data) => createHash("sha256").update(data).digest("hex");
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function limits({ file = 0, exec = 0, sections = 0, symbols = 0, relocs = 0 }) {
  assert.ok(file <= LIMITS.file, "complete input exceeds 64 MiB");
  assert.ok(exec <= LIMITS.exec, "aggregate executable data exceeds 16 MiB");
  assert.ok(sections <= LIMITS.sections, "section count exceeds 16,384");
  assert.ok(symbols <= LIMITS.symbols, "aggregate symbol count exceeds 1,000,000");
  assert.ok(relocs <= LIMITS.relocs, "aggregate relocation count exceeds 1,000,000");
}
function applyCall(text, place, target, state) {
  const base = state === "arm" ? ((place + 4) & ~3) : place + 4;
  const displacement = target - base;
  assert.equal(displacement & 1, 0);
  if (state === "arm") assert.equal(displacement & 3, 0);
  assert.ok(displacement >= -0x400000 && displacement < 0x400000);
  const out = Buffer.from(text);
  out.writeUInt16LE(0xf000 | ((displacement >> 12) & 0x7ff), place);
  out.writeUInt16LE((state === "arm" ? 0xe800 : 0xf800) | ((displacement >> 1) & 0x7ff), place + 2);
  return out;
}
function linkedText() {
  let out = Buffer.from(expectedText);
  for (const [place, , target, state] of calls) out = applyCall(out, place, target, state);
  return out;
}

function validateInputs(config, source, configBytes, spec) {
  assert.equal(sha256(configBytes), expectedRawConfigHash, "raw configuration contract changed");
  const normalized = structuredClone(config); normalized.sourceHash = null;
  assert.equal(sha256(stable(normalized)), expectedConfigHash, "normalized configuration contract changed");
  assert.equal(config.sourceHash, expectedSourceHash);
  assert.equal(sha256(source), expectedSourceHash, "source digest changed");
  assert.equal(sha256(spec), expectedSpecHash, "specification digest changed");
  assert.deepEqual({ source: config.source, architecture: config.architecture, mode: config.mode,
    alignment: config.minimumAlignment, modulo: config.requiredEntryModulo4, body: config.totalBodySize,
    adjacent: config.totalAdjacentSize, instructions: config.expectedInstructionCount, wide: config.wideInstructionCount,
    branches: config.localBranchCount, memory: config.memoryOperationCount, returns: config.returnCount,
    indirect: config.indirectCallCount, direct: config.directCallCount },
  { source: "src/main/thumb_leaf_helpers_24.S", architecture: "ARMv6K", mode: "thumb", alignment: 2,
    modulo: 0, body: 388, adjacent: 0, instructions: 191, wide: 3, branches: 46, memory: 35,
    returns: 1, indirect: 8, direct: 3 });
  assert.equal(config.functions.length, 1);
  assert.equal(config.functions[0].name, "func_002FEE54");
  assert.deepEqual(config.functions[0].indirectCallOffsets, [14, 40, 124, 164, 188, 258, 280, 374]);
  assert.deepEqual(config.pcRelativeDataAccesses.map((row) => [row.offset, row.targetOffset, row.requiredEntryModulo4]), [[30, 388, 0]]);
  assert.equal(expectedText.length, 388);
  assert.equal(sha256(expectedText), expectedBodyHash);
  assert.equal(sha256(linkedText()), expectedLinkedHash);
  assert.doesNotMatch(source, /^\s*\.(?:byte|hword|short|word|long|quad|incbin|space|skip|fill|ltorg)\b/m,
    "data, padding, and literal-pool emission are forbidden");
}

function parseElf(bytes) {
  limits({ file: bytes.length });
  assert.ok(bytes.length >= 52, "truncated ELF header");
  assert.equal(bytes.subarray(0, 4).toString("hex"), "7f454c46");
  assert.deepEqual([...bytes.subarray(4, 9)], [1, 1, 1, 0, 0]);
  assert.ok(bytes.subarray(9, 16).every((byte) => byte === 0));
  assert.equal(bytes.readUInt16LE(16), 1); assert.equal(bytes.readUInt16LE(18), 40);
  assert.equal(bytes.readUInt32LE(20), 1); assert.equal(bytes.readUInt32LE(24), 0);
  assert.equal(bytes.readUInt32LE(28), 0); assert.equal(bytes.readUInt32LE(36), 0x05000000);
  assert.equal(bytes.readUInt16LE(40), 52); assert.equal(bytes.readUInt16LE(42), 0); assert.equal(bytes.readUInt16LE(44), 0);
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46);
  const shnum = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  assert.equal(shentsize, 40); assert.ok(shnum > 0, "extended section numbering forbidden");
  limits({ file: bytes.length, sections: shnum });
  assert.ok(shstrndx < shnum); assert.ok(shoff <= bytes.length && shnum * shentsize <= bytes.length - shoff, "truncated section header table");
  const raw = Array.from({ length: shnum }, (_, index) => {
    const h = shoff + index * shentsize;
    return { index, headerOffset: h, nameOffset: bytes.readUInt32LE(h), type: bytes.readUInt32LE(h + 4),
      flags: bytes.readUInt32LE(h + 8), addr: bytes.readUInt32LE(h + 12), offset: bytes.readUInt32LE(h + 16),
      size: bytes.readUInt32LE(h + 20), link: bytes.readUInt32LE(h + 24), info: bytes.readUInt32LE(h + 28),
      align: bytes.readUInt32LE(h + 32), entsize: bytes.readUInt32LE(h + 36) };
  });
  assert.ok(Object.entries(raw[0]).filter(([key]) => !["index", "headerOffset"].includes(key)).every(([, value]) => value === 0));
  const shstr = raw[shstrndx]; assert.equal(shstr.type, 3);
  for (const section of raw) if (section.type !== 8) assert.ok(section.offset <= bytes.length && section.size <= bytes.length - section.offset, "section data out of range");
  const cstring = (section, offset) => {
    assert.ok(offset < section.size, "string offset out of range");
    const start = section.offset + offset, end = bytes.indexOf(0, start);
    assert.ok(end >= start && end < section.offset + section.size, "unterminated string");
    return bytes.toString("utf8", start, end);
  };
  const sections = raw.map((section) => ({ ...section, name: cstring(shstr, section.nameOffset) }));
  let exec = 0, symbols = 0, relocs = 0;
  for (const section of sections) {
    if (section.flags & 4) exec += section.size;
    if (section.type === 2 || section.type === 11) { assert.equal(section.entsize, 16); assert.equal(section.size % 16, 0); symbols += section.size / 16; }
    if (section.type === 9 || section.type === 4) { const width = section.type === 9 ? 8 : 12; assert.equal(section.entsize, width); assert.equal(section.size % width, 0); relocs += section.size / width; }
  }
  limits({ file: bytes.length, exec, sections: shnum, symbols, relocs });
  return { bytes, sections, shoff, shentsize, shstr, cstring };
}
function symbolsOf(elf, table) {
  assert.ok(table.link < elf.sections.length); const strings = elf.sections[table.link]; assert.equal(strings.type, 3);
  const out = [];
  for (let offset = 0; offset < table.size; offset += 16) {
    const at = table.offset + offset;
    out.push({ index: out.length, entryOffset: at, name: elf.cstring(strings, elf.bytes.readUInt32LE(at)),
      value: elf.bytes.readUInt32LE(at + 4), size: elf.bytes.readUInt32LE(at + 8), bind: elf.bytes[at + 12] >>> 4,
      type: elf.bytes[at + 12] & 15, other: elf.bytes[at + 13], shndx: elf.bytes.readUInt16LE(at + 14) });
  }
  return out;
}
function validateObject(bytes) {
  const elf = parseElf(bytes), matches = elf.sections.filter((section) => section.name === ".text.func_002FEE54");
  assert.equal(matches.length, 1); const text = matches[0];
  assert.deepEqual(elf.sections.filter((section) => (section.flags & 4) && section.size).map((section) => section.name), [text.name]);
  assert.deepEqual({ type: text.type, flags: text.flags, size: text.size, align: text.align, addr: text.addr }, { type: 1, flags: 6, size: 388, align: 2, addr: 0 });
  assert.deepEqual(bytes.subarray(text.offset, text.offset + text.size), expectedText);
  const tabs = elf.sections.filter((section) => section.type === 2); assert.equal(tabs.length, 1);
  assert.equal(elf.sections.filter((section) => section.type === 11).length, 0); const symtab = tabs[0], symbols = symbolsOf(elf, symtab);
  assert.deepEqual(symbols[0], { index: 0, entryOffset: symbols[0].entryOffset, name: "", value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: 0 });
  assert.ok(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0));
  const named = (name) => symbols.filter((symbol) => symbol.name === name);
  const primary = named("func_002FEE54"); assert.equal(primary.length, 1);
  assert.deepEqual({ value: primary[0].value, size: primary[0].size, bind: primary[0].bind, type: primary[0].type, other: primary[0].other, shndx: primary[0].shndx },
    { value: 1, size: 388, bind: 1, type: 2, other: 0, shndx: text.index });
  const mapping = named("$t"); assert.equal(mapping.length, 1);
  assert.deepEqual({ value: mapping[0].value, size: mapping[0].size, bind: mapping[0].bind, type: mapping[0].type, other: mapping[0].other, shndx: mapping[0].shndx },
    { value: 0, size: 0, bind: 0, type: 0, other: 0, shndx: text.index });
  assert.equal(symbols.filter((symbol) => symbol.type === 3 && symbol.shndx === text.index).length, 1);
  const externalNames = ["func_002FFB94", "arm_secondary_00106078"];
  assert.deepEqual(symbols.filter((symbol) => symbol.name).map((symbol) => symbol.name), ["$t", "func_002FEE54", ...externalNames]);
  for (const name of externalNames) { const symbol = named(name); assert.equal(symbol.length, 1); assert.deepEqual({ value: symbol[0].value, size: symbol[0].size, bind: symbol[0].bind, type: symbol[0].type, other: symbol[0].other, shndx: symbol[0].shndx }, { value: 0, size: 0, bind: 1, type: 2, other: 0, shndx: 0 }); }
  assert.equal(symbols.filter((symbol) => symbol.shndx === text.index).length, 3);
  assert.equal(elf.sections.filter((section) => section.type === 4).length, 0);
  const rels = elf.sections.filter((section) => section.type === 9); assert.equal(rels.length, 1); const rel = rels[0];
  assert.deepEqual({ info: rel.info, link: rel.link, entsize: rel.entsize, size: rel.size }, { info: text.index, link: symtab.index, entsize: 8, size: 24 });
  const actual = [];
  for (let offset = 0; offset < rel.size; offset += 8) {
    const at = rel.offset + offset, place = bytes.readUInt32LE(at), info = bytes.readUInt32LE(at + 4), symbol = symbols[info >>> 8];
    assert.ok(symbol, "invalid relocation symbol"); assert.equal(info & 255, 10); const state = calls.find((row) => row[0] === place)?.[3]; assert.ok(state);
    assert.equal(bytes.readUInt16LE(text.offset + place), 0xf7ff); assert.equal(bytes.readUInt16LE(text.offset + place + 2), state === "arm" ? 0xeffe : 0xfffe);
    actual.push([place, symbol.name]);
  }
  assert.deepEqual(actual, calls.map(([place, name]) => [place, name]));
  const attrs = elf.sections.filter((section) => section.name === ".ARM.attributes"); assert.equal(attrs.length, 1); assert.equal(attrs[0].type, 0x70000003);
  assert.deepEqual(bytes.subarray(attrs[0].offset, attrs[0].offset + attrs[0].size), expectedAttributes);
  return { elf, text, symtab, symbols, rel };
}
function validateTarget(bytes) {
  const elf = parseElf(bytes), sections = elf.sections.filter((section) => section.name === ".text.func_002FEE54"); assert.equal(sections.length, 1); const text = sections[0];
  assert.deepEqual({ type: text.type, flags: text.flags, size: text.size, align: text.align }, { type: 1, flags: 6, size: 388, align: 2 });
  assert.deepEqual(bytes.subarray(text.offset, text.offset + text.size), linkedText());
}

function findAssembler() {
  const candidates = process.env.ARM_AS ? [process.env.ARM_AS] : ["arm-none-eabi-as", "arm-linux-gnueabi-as", "arm-linux-gnueabihf-as"];
  try { for (const entry of readdirSync("/nix/store").sort()) { const candidate = join("/nix/store", entry, "bin/arm-none-eabi-as"); if (existsSync(candidate)) candidates.push(candidate); } } catch {}
  for (const candidate of candidates) { const result = spawnSync(candidate, ["--version"]); if (!result.error && result.status === 0) return candidate; }
  return null;
}
function assembleAndTest() {
  const assembler = findAssembler(); assert.ok(assembler, "no ARM GNU assembler found"); const scratch = mkdtempSync(join(tmpdir(), "thumb24-"));
  try {
    const output = join(scratch, "thumb24.o"), result = spawnSync(assembler, ["-march=armv6k", "-mthumb", "-o", output, sourcePath], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout); const valid = readFileSync(output), base = validateObject(valid);
    const reject = (label, mutation, parser = validateObject) => { const copy = Buffer.from(valid); mutation(copy, base); assert.throws(() => parser(copy), undefined, `${label} accepted`); };
    reject("instruction mutation", (copy, state) => { copy[state.text.offset] ^= 1; });
    reject("relocation mutation", (copy, state) => { copy[state.rel.offset + 4] ^= 1; });
    reject("invalid relocation symbol", (copy, state) => { copy.writeUInt32LE(0xffffff0a, state.rel.offset + 4); });
    reject("attribute mutation", (copy, state) => { copy[state.elf.sections.find((section) => section.name === ".ARM.attributes").offset + 1] ^= 1; });
    reject("adjacent executable byte", (copy, state) => { copy.writeUInt32LE(389, state.text.headerOffset + 20); });
    reject("mapping mutation", (copy, state) => { const s = state.symbols.find((symbol) => symbol.name === "$t"); copy.writeUInt32LE(2, s.entryOffset + 4); });
    reject("primary mutation", (copy, state) => { const s = state.symbols.find((symbol) => symbol.name === "func_002FEE54"); copy.writeUInt32LE(3, s.entryOffset + 4); });
    reject("RELA substitution", (copy, state) => { copy.writeUInt32LE(4, state.rel.headerOffset + 4); });
    reject("out-of-range section", (copy, state) => { copy.writeUInt32LE(copy.length, state.text.headerOffset + 16); }, parseElf);
    reject("unterminated section string", (copy, state) => { copy[state.elf.shstr.offset + state.elf.shstr.size - 1] = 88; }, parseElf);
    const truncated = valid.subarray(0, base.elf.shoff + base.elf.shentsize * base.elf.sections.length - 1); assert.throws(() => parseElf(truncated), /truncated section header table/);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}

const configBytes = readFileSync(configPath), config = JSON.parse(configBytes), source = readFileSync(sourcePath, "utf8"), spec = readFileSync(specPath);
validateInputs(config, source, configBytes, spec);
const reversed = Object.fromEntries(Object.entries(config).reverse()), normalized = structuredClone(reversed); normalized.sourceHash = null; assert.equal(sha256(stable(normalized)), expectedConfigHash);
assert.throws(() => limits({ file: LIMITS.file + 1 })); assert.throws(() => limits({ exec: LIMITS.exec + 1 })); assert.throws(() => limits({ sections: LIMITS.sections + 1 })); assert.throws(() => limits({ symbols: LIMITS.symbols + 1 })); assert.throws(() => limits({ relocs: LIMITS.relocs + 1 })); assert.throws(() => parseElf(Buffer.alloc(51)));
const args = process.argv.slice(2);
if (args.length === 0 || (args.length === 1 && args[0] === "--self-test")) validateInputs(config, source, configBytes, spec);
else if (args.length === 1 && args[0] === "--assemble") assembleAndTest();
else if (args.length === 2 && args[0] === "--object") validateObject(readFileSync(args[1]));
else if (args.length === 2 && args[0] === "--target") validateTarget(readFileSync(args[1]));
else throw new Error("usage: validate-thumb-leaf-helpers-24.mjs [--self-test | --assemble | --object PATH | --target PATH]");
console.log("thumb-leaf-helpers-24: validation passed");
