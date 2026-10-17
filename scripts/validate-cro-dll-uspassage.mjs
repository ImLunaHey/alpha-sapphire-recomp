#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "src/cro/DllUSPassage/construct_objects.S";
const SOURCE_HASH = "32eb86ab44453c83b10b9846ffeb19f2dd75e82ad72d89ced2e988d4eeba25ef";
const REQUIRED_HASH = "29fdcae73468ad66dba3dd60de6b32cae142afbacc16f44f8aa6bb120bc95da1";
const NEW = { name: "func_000013BC", address: 0x13bc, size: 816,
  hash: "fd142db2ee0b88a5fb4eaa852acda6e55588a27c3d08a8577b91fece8eb87df9" };
const OLD = { name: "func_000019F4", address: 0x19f4, size: 488,
  semantics: "contract-10-passage-state-update",
  hash: "70fd8be721ab195ceac4e6d657b31ae3858f7eedb37f0113ba37de4b0ce63665" };
const OLD_SOURCE = "src/cro/DllUSPassage/contract_10.S";
const MAX_FILE = 1024 * 1024;

function check(value, message) { if (!value) throw new Error(`DllUSPassage validation: ${message}`); }
function hash(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function exact(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label}: schema differs`);
}
function regular(path) {
  const info = lstatSync(path);
  check(info.isFile() && !info.isSymbolicLink() && info.size <= MAX_FILE, `${path}: expected a bounded regular file`);
  return readFileSync(path);
}
function range(bytes, offset, size) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= bytes.length - size, "ELF range exceeds file");
  return bytes.subarray(offset, offset + size);
}
function string(bytes, offset) {
  check(offset >= 0 && offset < bytes.length, "ELF string offset exceeds table");
  const end = bytes.indexOf(0, offset);
  check(end >= offset && end - offset < 1024, "ELF string is unterminated or too long");
  return bytes.toString("utf8", offset, end);
}

function parseObject(input) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= MAX_FILE, "ELF size outside bounds");
  check(bytes.subarray(0, 16).equals(Buffer.from([0x7f, 69, 76, 70, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
    "expected canonical little-endian ELF32 identification");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1 &&
    bytes.readUInt32LE(24) === 0 && bytes.readUInt32LE(28) === 0 && bytes.readUInt32LE(36) === 0x05000000,
    "expected relocatable ARM EABI5 header");
  check(bytes.readUInt16LE(40) === 52 && bytes.readUInt16LE(42) === 0 && bytes.readUInt16LE(44) === 0 &&
    bytes.readUInt16LE(46) === 40, "ELF header sizes differ");
  const table = bytes.readUInt32LE(32), count = bytes.readUInt16LE(48), namesIndex = bytes.readUInt16LE(50);
  check(table >= 52 && table % 4 === 0 && count > 0 && count <= 64 && namesIndex > 0 && namesIndex < count,
    "section table bounds differ");
  range(bytes, table, count * 40);
  const sections = [];
  for (let index = 0; index < count; index++) {
    const header = table + index * 40;
    const fields = Array.from({ length: 10 }, (_, j) => bytes.readUInt32LE(header + j * 4));
    const [nameOffset, type, flags, address, offset, size, link, info, align, entsize] = fields;
    if (index === 0) check(fields.every((v) => v === 0), "null section differs");
    check(address === 0 && (align === 0 || (align & (align - 1)) === 0), "section address/alignment differs");
    check(type !== 4 && type !== 9 && type !== 11, "relocations or dynamic symbols are forbidden");
    if (type !== 8) range(bytes, offset, size);
    sections.push({ index, header, nameOffset, type, flags, address, offset, size, link, info, align, entsize });
  }
  const spans = [[0, 52], [table, table + count * 40],
    ...sections.filter((s) => s.type !== 8 && s.size).map((s) => [s.offset, s.offset + s.size])]
    .sort((a, b) => a[0] - b[0]);
  check(spans.every((span, index) => index === 0 || span[0] >= spans[index - 1][1]), "ELF payloads overlap");
  check(sections[namesIndex].type === 3, "section names are not STRTAB");
  const names = range(bytes, sections[namesIndex].offset, sections[namesIndex].size);
  for (const section of sections) section.name = string(names, section.nameOffset);
  check(new Set(sections.map((s) => s.name)).size === count, "duplicate section names");
  const symtabs = sections.filter((s) => s.type === 2);
  check(symtabs.length === 1, "expected one symbol table");
  const symtab = symtabs[0];
  check(symtab.entsize === 16 && symtab.size > 0 && symtab.size % 16 === 0 && symtab.size <= 4096 &&
    symtab.link > 0 && symtab.link < count && sections[symtab.link].type === 3 && symtab.align === 4 && symtab.flags === 0,
    "symbol table metadata differs");
  const strings = range(bytes, sections[symtab.link].offset, sections[symtab.link].size), symbols = [];
  for (let cursor = symtab.offset; cursor < symtab.offset + symtab.size; cursor += 16) {
    symbols.push({ cursor, name: string(strings, bytes.readUInt32LE(cursor)), value: bytes.readUInt32LE(cursor + 4),
      size: bytes.readUInt32LE(cursor + 8), bind: bytes[cursor + 12] >>> 4, type: bytes[cursor + 12] & 15,
      other: bytes[cursor + 13], section: bytes.readUInt16LE(cursor + 14) });
  }
  check(symtab.info <= symbols.length && symbols.every((s, i) => i < symtab.info ? s.bind === 0 : s.bind !== 0),
    "symbol binding partition differs");
  check(symbols[0].name === "" && symbols[0].value === 0 && symbols[0].size === 0 && symbols[0].bind === 0 &&
    symbols[0].type === 0 && symbols[0].other === 0 && symbols[0].section === 0, "null symbol differs");
  return { bytes, sections, symbols };
}

// Composite objects are temporary authored test fixtures only. This validator
// is deliberately disconnected from config, package scripts and build/report gates.
export function validatePassageObject(input, composite = false) {
  const elf = parseObject(input), expected = composite ? [NEW, OLD] : [NEW];
  const allocated = elf.sections.filter((s) => (s.flags & 2) && s.size);
  check(allocated.length === expected.length && allocated.every((s) => expected.some((fn) => s.name === `.text.${fn.name}`)),
    "allocated section set differs (pool/data/gap bytes forbidden)");
  const globals = elf.symbols.filter((s) => s.bind !== 0);
  check(globals.length === expected.length && globals.every((s) => expected.some((fn) => fn.name === s.name)),
    "global/undefined symbol set differs");
  for (const section of elf.sections) {
    check(["", ".text", ".data", ".bss", ".note.GNU-stack", ".ARM.attributes", ".symtab", ".strtab", ".shstrtab",
      ...expected.map((fn) => `.text.${fn.name}`)].includes(section.name), "foreign section is forbidden");
    if ([".text", ".data", ".bss", ".note.GNU-stack"].includes(section.name))
      check(section.size === 0, "bookkeeping section contains extra bytes");
    check(!(section.flags & 4) || !section.size || allocated.includes(section), "foreign executable payload");
    check(section.type !== 8 || section.size === 0, "nonempty BSS is forbidden");
  }
  for (const fn of expected) {
    const section = allocated.find((s) => s.name === `.text.${fn.name}`);
    check(section.type === 1 && section.flags === 6 && section.size === fn.size && section.align === 4 &&
      section.link === 0 && section.info === 0 && section.entsize === 0, `${fn.name}: section boundary/flags differ`);
    const members = elf.symbols.filter((s) => s.section === section.index);
    check(members.length === 3 && members.some((s) => s.name === "" && s.type === 3 && s.bind === 0 && s.value === 0 && s.size === 0) &&
      members.some((s) => s.name === "$a" && s.type === 0 && s.bind === 0 && s.value === 0 && s.size === 0) &&
      members.some((s) => s.name === fn.name && s.type === 2 && s.bind === 1 && s.value === 0 && s.size === fn.size && s.other === 0),
    `${fn.name}: exact global ARM function/mapping symbols differ`);
    check(hash(range(elf.bytes, section.offset, section.size)) === fn.hash, `${fn.name}: authored body hash differs`);
  }
  return elf;
}

export function validatePassageRepository() {
  const source = regular(join(ROOT, SOURCE));
  check(hash(source) === SOURCE_HASH, "source differs from unintegrated schedule candidate");
  check(!/\.incbin\b|^\s*\.(?:byte|hword|short|word|long|quad|inst|fill|space|skip|org)\b/imu.test(source.toString()),
    "encoded payload or artificial size padding");
  const manifest = JSON.parse(regular(join(ROOT, "config/cro-sources.json")));
  const units = manifest.units.filter((unit) => unit.name === "DllUSPassage");
  check(units.length === 1, "unit ownership is missing or duplicated");
  const unit = units[0];
  exact(unit, "functions,name,sources", "unit");
  check(Array.isArray(unit.sources) && unit.sources.length === 1 && Array.isArray(unit.functions) && unit.functions.length === 1,
    "unmatched candidate must remain unintegrated: expected only the HEAD contract-10 source and claim");
  exact(unit.sources[0], "mode,path", "source");
  check(unit.sources[0].path === OLD_SOURCE && unit.sources[0].mode === "arm", "HEAD source ownership differs");
  check(!manifest.units.some((u) => u.sources.some((entry) => entry.path === SOURCE)),
    "unmatched source must not be configured for builds or reports");
  const claim = unit.functions[0];
  exact(claim, "address,name,semantics,size", "claim");
  check(claim.name === OLD.name && claim.address === OLD.address && claim.size === OLD.size && claim.semantics === OLD.semantics,
    "HEAD function claim differs");
  for (const path of ["package.json", "scripts/build-base.sh", "scripts/validate-cro-contract-10.mjs"]) {
    const text = regular(join(ROOT, path)).toString();
    check(!text.includes("validate-cro-dll-uspassage.mjs") && !text.includes("cro-uspassage"),
      `${path}: unmatched candidate must not enter package/build/contract gates`);
  }
  const inventory = regular(join(ROOT, "symbols/cro/DllUSPassage.csv")).toString().split(/\r?\n/u);
  check(inventory.filter((line) => /^[0-9A-F]{8},/u.test(line)).length === 2, "public inventory changed");
  for (const fn of [NEW, OLD]) {
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(inventory.filter((line) => line === row).length === 1 && inventory.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name}: public boundary differs`);
  }
  const files = readdirSync(join(ROOT, "src/cro/DllUSPassage")).filter((name) => /\.(?:S|c)$/u.test(name)).sort();
  check(JSON.stringify(files) === JSON.stringify(["construct_objects.S", "contract_10.S"]), "unexpected unit source owner");
  return unit;
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: MAX_FILE });
  check(!result.error && result.status === 0, `${executable}: ${result.error?.message ?? result.stderr?.trim() ?? result.status}`);
  if (result.stdout.trim()) console.log(result.stdout.trim());
}

function rejectionTests(input, composite) {
  const elf = validatePassageObject(input, composite);
  function reject(label, change) {
    const bytes = Buffer.from(input);
    change(bytes);
    let rejected = false;
    try { validatePassageObject(bytes, composite); } catch { rejected = true; }
    check(rejected, `mutation accepted: ${label}`);
  }
  reject("wrong architecture", (b) => b.writeUInt16LE(3, 18));
  reject("truncated section table", (b) => b.writeUInt32LE(b.length - 1, 32));
  reject("excessive section count", (b) => b.writeUInt16LE(65535, 48));
  for (const fn of composite ? [NEW, OLD] : [NEW]) {
    const section = elf.sections.find((s) => s.name === `.text.${fn.name}`);
    const symbol = elf.symbols.find((s) => s.name === fn.name);
    reject(`${fn.name} instruction`, (b) => { b[section.offset + 4] ^= 1; });
    reject(`${fn.name} boundary`, (b) => b.writeUInt32LE(fn.size + 4, section.header + 20));
    reject(`${fn.name} alignment`, (b) => b.writeUInt32LE(1, section.header + 32));
    reject(`${fn.name} Thumb entry`, (b) => b.writeUInt32LE(1, symbol.cursor + 4));
    reject(`${fn.name} undefined`, (b) => b.writeUInt16LE(0, symbol.cursor + 14));
    reject(`${fn.name} symbol size`, (b) => b.writeUInt32LE(fn.size - 4, symbol.cursor + 8));
    reject(`${fn.name} relocation`, (b) => b.writeUInt32LE(9, section.header + 4));
  }
  const empty = elf.sections.find((s) => s.name === ".data");
  check(empty && empty.size === 0, "self-test fixture lacks empty .data");
  reject("extra allocated bytes", (b) => {
    b.writeUInt32LE(8, empty.header + 4); // NOBITS: do not rely on file overlap rejection.
    b.writeUInt32LE(4, empty.header + 20);
  });
  const strings = elf.sections.find((s) => s.name === ".strtab");
  reject("metadata promoted to allocated bytes", (b) => b.writeUInt32LE(2, strings.header + 8));
  console.log(`Passed fail-closed ${composite ? "composite" : "isolated"} ELF mutation checks.`);
}

function selfTest(options) {
  check(options.compiler && options.python, "--self-test requires --compiler and --python (with unicorn)");
  const directory = mkdtempSync(join(tmpdir(), "dll-uspassage-authored-"));
  try {
    const common = ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-Wa,--noexecstack", "-c"];
    const own = join(directory, "construct.o"), old = join(directory, "contract10.o"), both = join(directory, "DllUSPassage.o");
    run(options.compiler, [...common, join(ROOT, SOURCE), "-o", own]);
    run(options.compiler, [...common, join(ROOT, OLD_SOURCE), "-o", old]);
    run(options.linker ?? join(dirname(options.compiler), "arm-none-eabi-ld"), ["-r", "-o", both, old, own]);
    rejectionTests(regular(own), false);
    rejectionTests(regular(both), true);
    const elf = validatePassageObject(regular(own), false), section = elf.sections.find((s) => s.name === `.text.${NEW.name}`);
    const body = join(directory, "authored-body.bin");
    writeFileSync(body, range(elf.bytes, section.offset, section.size));
    run(options.python, [join(ROOT, "scripts/test-cro-dll-uspassage.py"), body]);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

function main(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    check(["--self-test", "--require-exact", "--object", "--compiler", "--linker", "--python"].includes(arg), "unknown argument");
    const key = arg.slice(2);
    check(options[key] === undefined, "duplicate argument");
    if (key === "self-test" || key === "require-exact") options[key] = true;
    else {
      check(argv[index + 1] && !argv[index + 1].startsWith("--"), `${arg}: missing path`);
      options[key] = resolve(argv[++index]);
    }
  }
  check(options["self-test"] || !options.compiler && !options.linker && !options.python, "tool paths require --self-test");
  validatePassageRepository();
  if (options.object) validatePassageObject(regular(options.object));
  if (options["self-test"]) selfTest(options);
  console.log(`Unintegrated DllUSPassage evidence: 204 instructions / 816 bytes; authored SHA-256 ${NEW.hash}.`);
  console.log(`Required SHA-256 ${REQUIRED_HASH}; exact match: ${NEW.hash === REQUIRED_HASH}. No config/build/report claim.`);
  if (options["require-exact"]) check(NEW.hash === REQUIRED_HASH, "required digest not achieved; integration remains disabled");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
