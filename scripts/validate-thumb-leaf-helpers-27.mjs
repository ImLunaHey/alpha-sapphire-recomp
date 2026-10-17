#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/thumb-leaf-helpers-27.json");
const sourcePath = join(root, "src/main/thumb_leaf_helpers_27.S");
const LIMITS = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16384, symbols: 1000000, relocs: 1000000 };
const expectedConfigHash = "8b5ab91040e63961e45fae188ad0e312e3d3135df9f88ac464aa7f51bd1d15f2";
const calls = [
  [2, "func_00153770", "arm"],
  [16, "func_002FECF8", "arm"],
  [52, "func_001000EC", "thumb"],
  [62, "func_002FED34", "arm"],
];
const relocations = [...calls.map(([offset, symbol]) => [offset, 10, symbol]), [72, 2, "thumb_secondary_00100130"]];
const mappings = [["$t", 0], ["$d", 68], ["$a", 80]];
const thumbSchedule = [
  [0, "push", "{r4, r5, r6, lr}"], [2, "blx", "0 <func_00153770>"],
  [6, "ldr", "r4, [r0, #0]"], [8, "movs", "r5, r0"], [10, "cmp", "r4, #0"],
  [12, "bne.n", "3a <func_00100134+0x3a>"], [14, "movs", "r0, #32"],
  [16, "blx", "0 <func_002FECF8>"], [20, "movs", "r4, r0"],
  [22, "beq.n", "3e <func_00100134+0x3e>"], [24, "ldr", "r1, [pc, #40]"],
  [26, "str", "r4, [r5, #0]"], [28, "str", "r1, [r4, #4]"], [30, "movs", "r0, #0"],
  [32, "ldr", "r1, [pc, #36]"], [34, "str", "r0, [r4, #0]"],
  [36, "str", "r1, [r4, #8]"], [38, "strb", "r0, [r4, #12]"],
  [40, "ldr", "r1, [pc, #32]"], [42, "str", "r0, [r4, #16]"],
  [44, "str", "r0, [r4, #20]"], [46, "cmp", "r1, #0"], [48, "str", "r0, [r4, #24]"],
  [50, "beq.n", "38 <func_00100134+0x38>"], [52, "bl", "0 <func_001000EC>"],
  [56, "str", "r0, [r4, #28]"], [58, "movs", "r0, r4"],
  [60, "pop", "{r4, r5, r6, pc}"], [62, "blx", "0 <func_002FED34>"], [66, "movs", "r0, r0"],
];
const armSchedule = [[80, "add", "ip, pc, #1"], [84, "bx", "ip"]];
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function cap(values = {}) {
  for (const [key, maximum] of Object.entries(LIMITS)) assert.ok((values[key] ?? 0) <= maximum, `${key} resource cap exceeded`);
}

function validateInputs(config, source) {
  assert.deepEqual({
    schema: config.schemaVersion, source: config.source, architecture: config.architecture, mode: config.mode,
    minimumAlignment: config.minimumAlignment, modulo: config.requiredEntryModulo4, size: config.totalBodySize,
    instructions: config.expectedInstructionCount, thumb: config.thumbInstructionCount, arm: config.armInstructionCount,
    wide: config.wideInstructionCount, nops: config.legacyNopCount, branches: config.localBranchCount,
    memory: config.memoryOperationCount, returns: config.returnCount, calls: config.directCallCount,
  }, {
    schema: 3, source: "src/main/thumb_leaf_helpers_27.S", architecture: "ARMv6K", mode: "thumb",
    minimumAlignment: 2, modulo: 0, size: 88, instructions: 32, thumb: 30, arm: 2,
    wide: 4, nops: 1, branches: 3, memory: 13, returns: 1, calls: 4,
  });
  assert.equal(config.sourceHash, sha256(source), "source hash mismatch");
  assert.deepEqual(config.mappingSymbols.map(({ name, offset }) => [name, offset]), mappings);
  assert.equal(config.objectContract.executableSectionAlignment, 2);
  assert.deepEqual(config.relocations.map(({ offset, type, symbol, implicitAddend }) =>
    [offset, type, symbol, implicitAddend]), [
    [2, "R_ARM_THM_CALL", "func_00153770", -4], [16, "R_ARM_THM_CALL", "func_002FECF8", -4],
    [52, "R_ARM_THM_CALL", "func_001000EC", -4], [62, "R_ARM_THM_CALL", "func_002FED34", -4],
    [72, "R_ARM_ABS32", "thumb_secondary_00100130", 1],
  ]);
  assert.deepEqual(config.literalWords, [
    { offset: 68, identity: "null-a", value: 0, relocation: null },
    { offset: 72, identity: "thumb_secondary_00100130", symbol: "thumb_secondary_00100130", addend: 1, relocation: "R_ARM_ABS32" },
    { offset: 76, identity: "optional-hook", value: 0, relocation: null },
  ]);
  assert.deepEqual(config.functions.map(({ name, size, nextGlobal, nextGlobalOffset }) => [name, size, nextGlobal, nextGlobalOffset]),
    [["func_00100134", 88, "func_0010018C", 88]]);
  assert.match(source, /^\.syntax unified$/m); assert.match(source, /^\.arch armv6k$/m);
  assert.match(source, /^\.thumb$/m); assert.match(source, /^\.arm$/m);
  assert.match(source, /^\s*add r12, pc, #1$/m); assert.match(source, /^\s*bx r12$/m);
  assert.match(source, /^\s*\.word thumb_secondary_00100130 \+ 1$/m);
  assert.equal((source.match(/^\s*\.word\b/gm) ?? []).length, 3);
  assert.doesNotMatch(source, /^\s*\.inst(?:\.\w+)?\b/m, "encoded instructions are forbidden");
}

function parseElf(bytes) {
  cap({ file: bytes.length }); assert.ok(bytes.length >= 52, "truncated ELF header");
  assert.equal(bytes.subarray(0, 4).toString("hex"), "7f454c46");
  assert.deepEqual([...bytes.subarray(4, 9)], [1, 1, 1, 0, 0]); assert.ok(bytes.subarray(9, 16).every((x) => x === 0));
  assert.deepEqual([bytes.readUInt16LE(16), bytes.readUInt16LE(18), bytes.readUInt32LE(20)], [1, 40, 1]);
  assert.deepEqual([bytes.readUInt32LE(24), bytes.readUInt32LE(28), bytes.readUInt32LE(36)], [0, 0, 0x05000000]);
  assert.deepEqual([bytes.readUInt16LE(40), bytes.readUInt16LE(42), bytes.readUInt16LE(44)], [52, 0, 0]);
  const shoff = bytes.readUInt32LE(32), entsize = bytes.readUInt16LE(46), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  assert.equal(entsize, 40); assert.ok(count > 0 && shstrndx < count); cap({ sections: count });
  assert.ok(shoff <= bytes.length && count * entsize <= bytes.length - shoff, "truncated section table");
  const raw = Array.from({ length: count }, (_, index) => { const at = shoff + index * entsize; return {
    index, headerOffset: at, nameOffset: bytes.readUInt32LE(at), type: bytes.readUInt32LE(at + 4), flags: bytes.readUInt32LE(at + 8),
    addr: bytes.readUInt32LE(at + 12), offset: bytes.readUInt32LE(at + 16), size: bytes.readUInt32LE(at + 20),
    link: bytes.readUInt32LE(at + 24), info: bytes.readUInt32LE(at + 28), align: bytes.readUInt32LE(at + 32), entsize: bytes.readUInt32LE(at + 36),
  }; });
  assert.ok(Object.entries(raw[0]).filter(([key]) => !["index", "headerOffset"].includes(key)).every(([, value]) => value === 0));
  for (const section of raw) if (section.type !== 8) assert.ok(section.offset <= bytes.length && section.size <= bytes.length - section.offset, "section outside file");
  const shstr = raw[shstrndx]; assert.equal(shstr.type, 3);
  const string = (section, offset) => { assert.ok(offset < section.size, "string offset outside table"); const start = section.offset + offset, end = bytes.indexOf(0, start); assert.ok(end >= start && end < section.offset + section.size, "unterminated string"); return bytes.toString("utf8", start, end); };
  const sections = raw.map((section) => ({ ...section, name: string(shstr, section.nameOffset) }));
  let exec = 0, symbols = 0, relocs = 0;
  for (const section of sections) { if (section.flags & 4) exec += section.size; if ([2, 11].includes(section.type)) { assert.equal(section.entsize, 16); assert.equal(section.size % 16, 0); symbols += section.size / 16; } if ([4, 9].includes(section.type)) { const width = section.type === 9 ? 8 : 12; assert.equal(section.entsize, width); assert.equal(section.size % width, 0); relocs += section.size / width; } }
  cap({ file: bytes.length, exec, sections: count, symbols, relocs }); return { bytes, sections, shoff, entsize, shstr, string };
}

function symbolsOf(elf, table) {
  assert.ok(table.link < elf.sections.length); const strings = elf.sections[table.link]; assert.equal(strings.type, 3); const result = [];
  for (let offset = 0; offset < table.size; offset += 16) { const at = table.offset + offset; result.push({
    index: result.length, entryOffset: at, name: elf.string(strings, elf.bytes.readUInt32LE(at)), value: elf.bytes.readUInt32LE(at + 4),
    size: elf.bytes.readUInt32LE(at + 8), bind: elf.bytes[at + 12] >>> 4, type: elf.bytes[at + 12] & 15,
    other: elf.bytes[at + 13], shndx: elf.bytes.readUInt16LE(at + 14),
  }); } return result;
}

function validateObject(bytes, expectedText = null) {
  const elf = parseElf(bytes), matches = elf.sections.filter(({ name }) => name === ".text.func_00100134"); assert.equal(matches.length, 1);
  const text = matches[0]; assert.deepEqual([text.type, text.flags, text.addr, text.size], [1, 6, 0, 88]);
  assert.equal(text.align, 2, "executable section alignment must remain exactly two bytes");
  if (expectedText !== null) assert.deepEqual(bytes.subarray(text.offset, text.offset + text.size), expectedText, "assembled instruction/data schedule changed");
  const symtabs = elf.sections.filter(({ type }) => type === 2); assert.equal(symtabs.length, 1); assert.equal(elf.sections.filter(({ type }) => type === 11).length, 0);
  const symtab = symtabs[0], symbols = symbolsOf(elf, symtab), named = (name) => symbols.filter((symbol) => symbol.name === name);
  assert.ok(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0));
  const primary = named("func_00100134"); assert.equal(primary.length, 1); assert.deepEqual([primary[0].value, primary[0].size, primary[0].bind, primary[0].type, primary[0].other, primary[0].shndx], [1, 88, 1, 2, 0, text.index]);
  assert.deepEqual(symbols.filter((symbol) => symbol.shndx === text.index && ["$t", "$d", "$a"].includes(symbol.name)).map(({ name, value }) => [name, value]), mappings);
  const undefinedExpected = ["func_001000EC", "func_00153770", "func_002FECF8", "func_002FED34", "thumb_secondary_00100130"].sort();
  assert.deepEqual(symbols.filter((symbol) => symbol.name && symbol.shndx === 0).map(({ name }) => name).sort(), undefinedExpected);
  const relas = elf.sections.filter(({ type }) => type === 4); assert.equal(relas.length, 0); const rels = elf.sections.filter(({ type }) => type === 9); assert.equal(rels.length, 1);
  const rel = rels[0]; assert.deepEqual([rel.info, rel.link, rel.entsize, rel.size], [text.index, symtab.index, 8, 40]); const actual = [];
  for (let offset = 0; offset < rel.size; offset += 8) { const at = rel.offset + offset, place = bytes.readUInt32LE(at), info = bytes.readUInt32LE(at + 4), symbol = symbols[info >>> 8]; assert.ok(symbol); actual.push([place, info & 255, symbol.name]); }
  assert.deepEqual(actual, relocations); assert.equal(bytes.readUInt32LE(text.offset + 68), 0); assert.equal(bytes.readUInt32LE(text.offset + 72), 1); assert.equal(bytes.readUInt32LE(text.offset + 76), 0);
  for (const [offset, , state] of calls) { assert.equal(bytes.readUInt16LE(text.offset + offset), 0xf7ff); assert.equal(bytes.readUInt16LE(text.offset + offset + 2), state === "arm" ? 0xeffe : 0xfffe); }
  return { elf, text, symtab, symbols, rel };
}

function tool(name, environment) {
  const candidates = process.env[environment] ? [process.env[environment]] : [`arm-none-eabi-${name}`, `arm-linux-gnueabi-${name}`, `arm-linux-gnueabihf-${name}`];
  try { for (const entry of readdirSync("/nix/store").sort()) { const candidate = join("/nix/store", entry, `bin/arm-none-eabi-${name}`); if (existsSync(candidate)) candidates.push(candidate); } } catch {}
  return candidates.find((candidate) => { const result = spawnSync(candidate, ["--version"]); return !result.error && result.status === 0; });
}

function disassemblySchedule(objdump, object) {
  const result = spawnSync(objdump, ["-D", object], { encoding: "utf8" }); assert.equal(result.status, 0, result.stderr || result.stdout);
  const owned = result.stdout.split("Disassembly of section .text.func_00100134:")[1]?.split(/\nDisassembly of section /)[0] ?? "";
  const rows = []; for (const line of owned.split(/\r?\n/)) { const match = line.match(/^\s*([0-9a-f]+):\s+(?:[0-9a-f]{4,8}\s+)+([^\s]+)\s*(.*)$/i); if (!match) continue; const offset = Number.parseInt(match[1], 16); if ((offset < 68) || offset >= 80) rows.push([offset, match[2], match[3].replace(/\s+@.*$/, "").trim()]); }
  assert.deepEqual(rows, [...thumbSchedule, ...armSchedule]);
  assert.equal(rows.filter(([, mnemonic]) => ["ldr", "str", "strb"].includes(mnemonic)).length, 13);
  assert.equal(rows.filter(([, mnemonic]) => ["beq.n", "bne.n"].includes(mnemonic)).length, 3);
  assert.equal(rows.filter(([, mnemonic]) => ["bl", "blx"].includes(mnemonic)).length, 4);
  assert.deepEqual(rows.filter(([, mnemonic]) => mnemonic === "pop"), [[60, "pop", "{r4, r5, r6, pc}"]]);
}

function ownershipAudit() {
  for (const file of readdirSync(join(root, "config")).filter((name) => /^thumb-leaf-helpers-\d+\.json$/.test(name) && name !== "thumb-leaf-helpers-27.json")) {
    const candidate = JSON.parse(readFileSync(join(root, "config", file))); assert.ok(!(candidate.functions ?? []).some(({ name }) => name === "func_00100134"), `duplicate owner ${file}`);
  }
  for (const file of readdirSync(join(root, "src/main")).filter((name) => name.endsWith(".S") && name !== "thumb_leaf_helpers_27.S")) assert.doesNotMatch(readFileSync(join(root, "src/main", file), "utf8"), /^func_00100134:\s*$/m, `duplicate definition ${file}`);
}

function assembleAndTest() {
  const assembler = tool("as", "ARM_AS"), objdump = tool("objdump", "ARM_OBJDUMP"), objcopy = tool("objcopy", "ARM_OBJCOPY"); assert.ok(assembler && objdump && objcopy, "GNU Arm assembler tools are required");
  const scratch = mkdtempSync(join(tmpdir(), "thumb27-")); try { const object = join(scratch, "thumb27.o"), assembled = spawnSync(assembler, ["-march=armv6k", "-mthumb", "-o", object, sourcePath], { encoding: "utf8" }); assert.equal(assembled.status, 0, assembled.stderr || assembled.stdout); const aligned = spawnSync(objcopy, ["--set-section-alignment", ".text.func_00100134=2", object], { encoding: "utf8" }); assert.equal(aligned.status, 0, aligned.stderr || aligned.stdout); const valid = readFileSync(object), initial = validateObject(valid), expectedText = Buffer.from(valid.subarray(initial.text.offset, initial.text.offset + initial.text.size)), base = validateObject(valid, expectedText); disassemblySchedule(objdump, object);
    const reject = (label, mutation, parser = (copy) => validateObject(copy, expectedText)) => { const copy = Buffer.from(valid); mutation(copy, base); assert.throws(() => parser(copy), undefined, `${label} mutation accepted`); };
    reject("instruction", (copy, state) => { copy[state.text.offset] ^= 1; }); reject("literal", (copy, state) => { copy[state.text.offset + 68] = 1; });
    reject("relocation", (copy, state) => { copy[state.rel.offset + 4] ^= 1; }); reject("mapping", (copy, state) => { copy.writeUInt32LE(2, state.symbols.find(({ name }) => name === "$t").entryOffset + 4); });
    reject("primary", (copy, state) => { copy.writeUInt32LE(3, state.symbols.find(({ name }) => name === "func_00100134").entryOffset + 4); });
    reject("RELA", (copy, state) => { copy.writeUInt32LE(4, state.rel.headerOffset + 4); }); reject("range", (copy, state) => { copy.writeUInt32LE(copy.length, state.text.headerOffset + 16); }, parseElf);
    assert.throws(() => parseElf(valid.subarray(0, base.elf.shoff + base.elf.entsize * base.elf.sections.length - 1)), /truncated section table/);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}

const configBytes = readFileSync(configPath), config = JSON.parse(configBytes), source = readFileSync(sourcePath, "utf8");
assert.equal(sha256(configBytes), expectedConfigHash, "configuration contract changed"); validateInputs(config, source); ownershipAudit();
for (const [key, maximum] of Object.entries(LIMITS)) assert.throws(() => cap({ [key]: maximum + 1 })); assert.throws(() => parseElf(Buffer.alloc(51)));
const args = process.argv.slice(2);
if (args.length === 0 || (args.length === 1 && args[0] === "--self-test")) validateInputs(config, source);
else if (args.length === 1 && args[0] === "--assemble") assembleAndTest();
else if (args.length === 2 && args[0] === "--object") validateObject(readFileSync(args[1]));
else throw new Error("usage: validate-thumb-leaf-helpers-27.mjs [--self-test | --assemble | --object PATH]");
console.log("thumb-leaf-helpers-27: validation passed");
