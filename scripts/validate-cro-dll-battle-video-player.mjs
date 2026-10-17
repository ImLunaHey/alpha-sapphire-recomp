#!/usr/bin/env node

// Target-blind validation: public boundaries, ELF structure, and synthetic behavior.
// Generic ELF parser adapted from validate-cro-dll-battle-state-table-ops-06.mjs.
// No target input, instruction schedule, byte sequence, or digest is accepted here.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UNIT = "DllBattleVideoPlayer";
const SOURCE = "src/cro/DllBattleVideoPlayer/recycle_subtrees.S";
const PRIOR_SOURCE = "src/cro/DllBattleVideoPlayer.c";
const PAIR = [0xDCEC, 0xE494].map((address) => ({
  name: `func_${address.toString(16).toUpperCase().padStart(8, "0")}`,
  address, size: 60, semantics: "recycle-tree-right-node-left",
}));
const PRIOR = { name: "func_0000D950", address: 0xD950, size: 8, semantics: "store-u8", offset: 217 };
const OWNED = [PRIOR, ...PAIR];
const LIMITS = { file: 1024 * 1024, exec: 128, sections: 64, symbols: 128, relocations: 128 };

function fail(message) { throw new Error(`DllBattleVideoPlayer validation: ${message}`); }
function check(value, message) { if (!value) fail(message); }
function same(actual, expected, label) {
  check(JSON.stringify(actual) === JSON.stringify(expected), label);
}
function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024, timeout: 30000 });
  check(!result.error && result.status === 0, `${executable} failed: ${result.error?.message ?? result.stderr?.trim()}`);
  return result.stdout;
}
const compiler = process.env.ARM_NONE_EABI_GCC ?? (process.env.CROSS_COMPILE ? `${process.env.CROSS_COMPILE}gcc` : "arm-none-eabi-gcc");
const objdump = process.env.ARM_OBJDUMP ?? "arm-none-eabi-objdump";
const objcopy = process.env.ARM_OBJCOPY ?? "arm-none-eabi-objcopy";

function boundedAdd(left, right, limit, label) {
  check(Number.isSafeInteger(left) && Number.isSafeInteger(right) && left >= 0 && right >= 0 && left <= limit - right,
    `${label} exceeds its bound`);
  return left + right;
}
function slice(bytes, offset, size, label) { return bytes.subarray(offset, boundedAdd(offset, size, bytes.length, label)); }
function stringAt(bytes, offset, label) {
  check(Number.isInteger(offset) && offset >= 0 && offset < bytes.length, `${label} string offset is invalid`);
  const end = bytes.subarray(offset, Math.min(bytes.length, offset + 4097)).indexOf(0);
  check(end >= 0, `${label} string is unterminated or too long`);
  return bytes.toString("utf8", offset, offset + end);
}

function parseElf(input) {
  const bytes = Buffer.from(input);
  check(bytes.length >= 52 && bytes.length <= LIMITS.file, "ELF size is outside the 1 MiB bound");
  check(bytes.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])), "not ELF32 little-endian version 1");
  check(bytes[7] === 0 && bytes[8] === 0 && bytes.subarray(9, 16).every((byte) => byte === 0), "noncanonical ELF identification");
  check(bytes.readUInt16LE(16) === 1 && bytes.readUInt16LE(18) === 40 && bytes.readUInt32LE(20) === 1, "not an ARM relocatable ELF");
  const shoff = bytes.readUInt32LE(32), shentsize = bytes.readUInt16LE(46), count = bytes.readUInt16LE(48), shstrndx = bytes.readUInt16LE(50);
  check(shoff >= 52 && shoff % 4 === 0 && shentsize === 40 && count > 0 && count <= LIMITS.sections && shstrndx > 0 && shstrndx < count,
    "section table metadata is invalid or exceeds its bound");
  slice(bytes, shoff, count * 40, "section table");
  const sections = [];
  let executable = 0, symbolCount = 0, relocationCount = 0;
  for (let index = 0; index < count; index++) {
    const header = shoff + index * 40;
    sections.push({ index, header, nameOffset: bytes.readUInt32LE(header), type: bytes.readUInt32LE(header + 4), flags: bytes.readUInt32LE(header + 8),
      address: bytes.readUInt32LE(header + 12), offset: bytes.readUInt32LE(header + 16), size: bytes.readUInt32LE(header + 20),
      link: bytes.readUInt32LE(header + 24), info: bytes.readUInt32LE(header + 28), align: bytes.readUInt32LE(header + 32), entsize: bytes.readUInt32LE(header + 36) });
  }
  check(Object.entries(sections[0]).filter(([key]) => !["index", "header"].includes(key)).every(([, value]) => value === 0), "section zero is not canonical");
  check(sections[shstrndx].type === 3, "section-name table is not STRTAB");
  const names = slice(bytes, sections[shstrndx].offset, sections[shstrndx].size, "section-name table");
  const payloads = [{ start: 0, end: 52 }, { start: shoff, end: shoff + count * 40 }];
  for (const section of sections) {
    section.name = stringAt(names, section.nameOffset, `section ${section.index}`);
    check(section.address === 0 && (section.align === 0 || (section.align & (section.align - 1)) === 0), `section ${section.name} metadata is invalid`);
    if (section.type !== 8) {
      slice(bytes, section.offset, section.size, `section ${section.name}`);
      if (section.size) payloads.push({ start: section.offset, end: section.offset + section.size });
    }
    if (section.flags & 4) executable = boundedAdd(executable, section.size, LIMITS.exec, "aggregate executable payload");
    if (section.type === 2 || section.type === 11) {
      check(section.entsize === 16 && section.size % 16 === 0, `symbol table ${section.name} is malformed`);
      symbolCount = boundedAdd(symbolCount, section.size / 16, LIMITS.symbols, "aggregate symbol count");
    }
    if (section.type === 9 || section.type === 4) {
      const width = section.type === 9 ? 8 : 12;
      check(section.entsize === width && section.size % width === 0, `relocation section ${section.name} is malformed`);
      relocationCount = boundedAdd(relocationCount, section.size / width, LIMITS.relocations, "aggregate relocation count");
    }
  }
  payloads.sort((a, b) => a.start - b.start || a.end - b.end);
  for (let index = 1; index < payloads.length; index++) check(payloads[index].start >= payloads[index - 1].end, "ELF payloads or headers overlap");
  check(new Set(sections.map(({ name }) => name)).size === sections.length, "duplicate section name");
  const symtabs = sections.filter(({ type }) => type === 2), dynsyms = sections.filter(({ type }) => type === 11);
  check(symtabs.length === 1 && dynsyms.length === 0, "expected one SYMTAB and no DYNSYM");
  const symtab = symtabs[0];
  check(symtab.link > 0 && symtab.link < sections.length && sections[symtab.link].type === 3, "SYMTAB string link is invalid");
  const strings = slice(bytes, sections[symtab.link].offset, sections[symtab.link].size, "symbol strings"), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const cursor = symtab.offset + index * 16, nameOffset = bytes.readUInt32LE(cursor);
    symbols.push({ index, cursor, name: nameOffset === 0 ? "" : stringAt(strings, nameOffset, "symbol"), value: bytes.readUInt32LE(cursor + 4),
      size: bytes.readUInt32LE(cursor + 8), bind: bytes[cursor + 12] >>> 4, type: bytes[cursor + 12] & 15, other: bytes[cursor + 13], shndx: bytes.readUInt16LE(cursor + 14) });
  }
  check(symtab.info <= symbols.length && symbols.every((symbol, index) => index < symtab.info ? symbol.bind === 0 : symbol.bind !== 0),
    "local/global symbol partition is invalid");
  return { bytes, sections, symbols, symtab, executable, symbolCount, relocationCount };
}

function validateContract(config, inventory) {
  check(config.schemaVersion === 1 && Array.isArray(config.units), "invalid integrated config");
  const units = config.units.filter(({ name }) => name === UNIT);
  check(units.length === 1, "unit ownership is missing or duplicated");
  const unit = units[0];
  same(Object.keys(unit).sort(), ["functions", "name", "sources"], "unexpected unit fields");
  same(unit.sources, [{ path: PRIOR_SOURCE, mode: "arm" }, { path: SOURCE, mode: "arm" }], "source ownership differs");
  same(unit.functions, OWNED, "function claims exceed the prior leaf and approved pair, or their boundaries/semantics differ");
  for (const source of unit.sources) {
    check(config.units.filter((owner) => owner.sources.some(({ path: entry }) => entry === source.path)).length === 1,
      "source ownership is duplicated");
  }
  for (const fn of OWNED) {
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(inventory.filter((line) => line.includes(`"${fn.name}"`)).length === 1 && inventory.includes(row),
      `${fn.name} public ARM boundary differs`);
  }
}

function validateSource(text) {
  // Permit symbolic code and ordinary section/function scaffolding. No source or
  // instruction digest is pinned: scheduling and register choices are not policy.
  const lines = text.replace(/\/\*[\s\S]*?\*\//gu, "").split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const directives = [
    /^\.syntax unified$/u, /^\.arm$/u, /^\.macro recycle_subtree name$/u, /^\.endm$/u,
    /^\.section \.text\.\\name, "ax", %progbits$/u, /^\.balign 4$/u,
    /^\.global \\name$/u, /^\.type \\name, %function$/u, /^\.size \\name, \. - \\name$/u,
  ];
  const mnemonics = /^(?:cmp|movs?|ldr|str|push|pop|bl|bx|b)(?:eq|ne)?\s+[A-Za-z0-9_.,#{}\[\] \\-]+$/u;
  for (const line of lines) check(directives.some((pattern) => pattern.test(line)) || mnemonics.test(line) ||
    /^(?:\\name|\.L[A-Za-z0-9_]+\\name):$/u.test(line) || /^recycle_subtree func_(?:0000DCEC|0000E494)$/u.test(line),
  `unsupported or opaque source statement: ${line}`);
  check(lines.filter((line) => line.startsWith(".macro ")).length === 1 && lines.filter((line) => line === ".endm").length === 1,
    "expected one symbolic recycler macro");
  same(lines.filter((line) => line.startsWith("recycle_subtree ")), PAIR.map(({ name }) => `recycle_subtree ${name}`), "source claims differ");
}

function validateRepository() {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, "config/cro-sources.json"), "utf8"));
  const inventory = fs.readFileSync(path.join(ROOT, `symbols/cro/${UNIT}.csv`), "utf8").split(/\r?\n/u);
  validateContract(config, inventory);
  for (const file of [SOURCE, PRIOR_SOURCE]) {
    const stat = fs.lstatSync(path.join(ROOT, file));
    check(stat.isFile() && !stat.isSymbolicLink() && stat.size < 64 * 1024, "source is not a bounded regular file");
  }
  validateSource(fs.readFileSync(path.join(ROOT, SOURCE), "utf8"));
  return { config, inventory };
}

function validateObject(input) {
  const elf = parseElf(input);
  const expected = OWNED.map(({ name }) => `.text.${name}`);
  const allocated = elf.sections.filter(({ flags, size }) => (flags & 2) && size);
  check(allocated.length === expected.length && allocated.every(({ name, type, flags }) => expected.includes(name) && type === 1 && flags === 6),
    "foreign executable payload or allocated data");
  check(elf.executable === 128 && elf.relocationCount === 0, "unexpected executable extent or relocation");
  const globals = elf.symbols.filter(({ bind }) => bind !== 0);
  check(globals.length === OWNED.length && globals.every(({ name, bind, type, shndx, other }) =>
    OWNED.some((fn) => fn.name === name) && bind === 1 && type === 2 && shndx > 0 && shndx < elf.sections.length && other === 0),
  "foreign/undefined global, alias, or non-function symbol");
  for (const section of elf.sections) {
    check([0, 1, 2, 3, 8, 0x70000003].includes(section.type), "unsupported section type (including relocations)");
    if (section.type === 1 || section.type === 8) check(section.size === 0 || expected.includes(section.name), "unowned data or literal pool");
    if (section.type === 0x70000003) check(section.name === ".ARM.attributes" && section.flags === 0, "invalid ARM attributes");
  }
  for (const fn of OWNED) {
    const section = elf.sections.find(({ name }) => name === `.text.${fn.name}`);
    check(section?.size === fn.size && section.align === 4 && section.entsize === 0 && section.link === 0 && section.info === 0,
      `${fn.name} section boundary differs`);
    const symbols = elf.symbols.filter(({ name }) => name === fn.name);
    check(symbols.length === 1 && symbols[0].shndx === section.index && symbols[0].value === 0 && symbols[0].size === fn.size,
      `${fn.name} symbol boundary differs`);
    const mappings = elf.symbols.filter(({ shndx, name }) => shndx === section.index && /^\$[atd](?:\.|$)/u.test(name));
    check(mappings.length === 1 && /^\$a(?:\.|$)/u.test(mappings[0].name) && mappings[0].value === 0,
      `${fn.name} ARM mapping or literal ownership differs`);
    check(elf.symbols.filter(({ shndx, type }) => shndx === section.index && type === 2).length === 1,
      `${fn.name} callable identity is aliased`);
  }
  return elf;
}

function readProgram(object, fn) {
  // The base build removes .ARM.attributes. Select the public CPU explicitly so
  // objdump cannot reinterpret interworking instructions using a different ISA.
  const output = run(objdump, ["-m", "armv6k", "-d", "-z", "--no-show-raw-insn", "-j", `.text.${fn.name}`, object]);
  const program = new Map();
  for (const line of output.split("\n")) {
    const match = /^\s*([0-9a-f]+):\s+([a-z]+)\s*(.*?)\s*$/u.exec(line);
    if (!match) continue;
    const at = Number.parseInt(match[1], 16), mnemonic = match[2], args = match[3].split("@")[0].trim();
    check(at % 4 === 0 && at < fn.size && !program.has(at), "ambiguous instruction address");
    const operation = /^(cmp|movs|mov|ldr|str|push|pop|bl|bx|b)(eq|ne)?$/u.exec(mnemonic);
    check(operation, `unsupported instruction ${mnemonic}`);
    program.set(at, { op: operation[1], cond: operation[2], args });
  }
  check(program.size * 4 === fn.size, "object has undecoded executable bytes");
  const calls = [...program.values()].filter(({ op }) => op === "bl");
  check(calls.length === 1 && !calls[0].cond && Number.parseInt(calls[0].args, 16) === 0, "expected one unconditional call to own entry");
  for (const { op, args } of program.values()) if (op === "b") check(program.has(Number.parseInt(args, 16)), "branch leaves own function");
  return program;
}

function register(text) {
  const aliases = { sp: 13, lr: 14, pc: 15, sl: 10, fp: 11, ip: 12 };
  if (Object.hasOwn(aliases, text)) return aliases[text];
  check(/^r(?:[0-9]|1[0-5])$/u.test(text), `invalid register ${text}`);
  return Number(text.slice(1));
}

function execute(program, initial, context, root) {
  const memory = new Map(initial), writes = [], reads = [], stack = new Map(), callRoots = [];
  const regs = Array.from({ length: 16 }, (_, index) => (0xCA000000 + index * 0x101) >>> 0);
  const saved = regs.slice();
  const stackTop = 0x800000, sentinel = 0x100000;
  regs[0] = context; regs[1] = root; regs[13] = stackTop; regs[14] = sentinel;
  let pc = 0, zero = false, steps = 0, calls = 0, depth = 0, maxDepth = 0;
  const returns = [];
  function access(address, write, value) {
    check(address % 4 === 0, "unaligned memory access");
    if (address >= stackTop - 0x10000 && address < stackTop) {
      if (write) stack.set(address, value);
      else { check(stack.has(address), "uninitialized stack read"); return stack.get(address); }
    } else {
      check(memory.has(address), `out-of-fixture memory access at ${address}`);
      if (write) { memory.set(address, value); writes.push(address); }
      else { reads.push(address); return memory.get(address); }
    }
  }
  while (pc !== sentinel) {
    check(++steps < 100000, "execution did not terminate within bound");
    const instruction = program.get(pc);
    check(instruction, "execution escaped its callable identity");
    const { op, cond, args } = instruction;
    let next = pc + 4;
    if ((cond === "eq" && !zero) || (cond === "ne" && zero)) { pc = next; continue; }
    const fields = args.split(/,\s*/u);
    const valueOf = (value) => value.startsWith("#") ? Number(value.slice(1)) >>> 0 : regs[register(value)];
    if (op === "cmp") zero = regs[register(fields[0])] === valueOf(fields[1]);
    else if (op === "mov" || op === "movs") {
      const rd = register(fields[0]); check(rd < 13, "unsupported move to control register");
      regs[rd] = valueOf(fields[1]); if (op === "movs") zero = regs[rd] === 0;
    } else if (op === "ldr" || op === "str") {
      const transfer = /^(\w+),\s*\[(\w+)(?:,\s*#(\d+))?\]$/u.exec(args);
      check(transfer, "unsupported memory addressing");
      const rd = register(transfer[1]), rn = register(transfer[2]);
      check(rd < 13 && rn < 13, "unsupported control-register transfer");
      const address = (regs[rn] + Number(transfer[3] ?? 0)) >>> 0;
      if (op === "ldr") regs[rd] = access(address, false);
      else access(address, true, regs[rd]);
    } else if (op === "push" || op === "pop") {
      check(/^\{[\w, -]+\}$/u.test(args), "unsupported register list");
      const list = args.slice(1, -1).split(/,\s*/u).flatMap((item) => {
        if (!item.includes("-")) return [register(item)];
        const [first, last] = item.split("-").map(register);
        check(first <= last, "invalid register range");
        return Array.from({ length: last - first + 1 }, (_, index) => first + index);
      });
      check(new Set(list).size === list.length && list.every((r) => r !== 13), "invalid stack register list");
      list.sort((a, b) => a - b);
      if (op === "push") regs[13] -= list.length * 4;
      list.forEach((r, index) => {
        const address = regs[13] + index * 4;
        if (op === "push") access(address, true, regs[r]);
        else if (r === 15) next = access(address, false);
        else regs[r] = access(address, false);
      });
      if (op === "pop") regs[13] += list.length * 4;
    } else if (op === "b" || op === "bl") {
      next = Number.parseInt(args, 16);
      if (op === "bl") {
        check(regs[0] === context, "recursive context differs");
        callRoots.push(regs[1]);
        regs[14] = pc + 4; returns.push(pc + 4); calls++; depth++; maxDepth = Math.max(maxDepth, depth);
      }
    } else if (op === "bx") next = regs[register(args)];
    else fail(`unsupported operation ${op}`);
    if (returns.length && next === returns.at(-1)) { returns.pop(); depth--; }
    pc = next;
  }
  check(returns.length === 0 && regs[13] === stackTop, "unbalanced return or stack");
  for (let r = 4; r <= 11; r++) check(regs[r] === saved[r], "callee-saved register changed");
  return { memory, writes, reads, calls, callRoots, maxDepth, stackAccesses: stack.size };
}

function shapes(count) {
  if (count === 0) return [null];
  const result = [];
  for (let left = 0; left < count; left++) for (const a of shapes(left)) for (const b of shapes(count - left - 1)) result.push([a, b]);
  return result;
}

function checkBehavior(program) {
  let cases = 0;
  const fixtures = Array.from({ length: 6 }, (_, count) => shapes(count)).flat();
  let left = null, right = null;
  for (let index = 0; index < 32; index++) { left = [left, null]; right = [null, right]; }
  fixtures.push(left, right);
  for (const tree of fixtures) for (const priorLength of [0, 1, 3]) {
    const context = 0x1000, memory = new Map(), nodes = [], inorder = [];
    for (let offset = 0; offset < 16; offset += 4) memory.set(context + offset, 0x11000000 + offset);
    function allocate(shape) {
      if (!shape) return 0;
      const address = 0x2000 + nodes.length * 32; nodes.push(address);
      memory.set(address, address ^ 0x12345678); memory.set(address + 4, address ^ 0x76543210);
      memory.set(address + 8, allocate(shape[0])); inorder.push(address);
      memory.set(address + 12, allocate(shape[1])); memory.set(address + 16, 0xABCDEF01);
      return address;
    }
    const root = allocate(tree), prior = Array.from({ length: priorLength }, (_, index) => 0x6000 + index * 32);
    prior.forEach((address, index) => {
      for (let offset = 0; offset < 20; offset += 4) memory.set(address + offset, address + offset);
      memory.set(address + 12, prior[index + 1] ?? 0);
    });
    memory.set(context + 4, prior[0] ?? 0);
    const expectedCalls = [];
    function trace(address) {
      if (!address) return;
      const rightChild = memory.get(address + 12);
      expectedCalls.push(rightChild);
      trace(rightChild); trace(memory.get(address + 8));
    }
    trace(root);
    const expected = new Map(memory), order = [...inorder, ...prior];
    expected.set(context + 4, order[0] ?? 0);
    inorder.forEach((address, index) => expected.set(address + 12, order[index + 1] ?? 0));
    const result = execute(program, memory, context, root);
    same([...result.memory], [...expected], "tree/list result or preserved fields differ");
    const writable = new Set([context + 4, ...nodes.map((node) => node + 12)]);
    check(result.writes.every((address) => writable.has(address)), "write exceeds contract");
    check(result.calls === nodes.length, "self-call count must include each null right child");
    same(result.callRoots, expectedCalls, "right-subtree recursive argument/order differs");
    if (tree === left) check(result.maxDepth <= 1, "left continuation consumes recursive depth");
    if (tree === right) check(result.maxDepth === nodes.length, "right continuation is not recursive");
    cases++;
  }
  for (const context of [0, 0xBAD000]) {
    const result = execute(program, new Map(), context, 0);
    check(result.reads.length === 0 && result.writes.length === 0 && result.stackAccesses === 0 && result.calls === 0,
      "null root accesses memory or recurses");
    cases++;
  }
  return cases;
}

function validateCandidate(object) {
  const stat = fs.lstatSync(object);
  check(stat.isFile() && !stat.isSymbolicLink() && stat.size <= LIMITS.file, "object is not a bounded regular file");
  const elf = validateObject(fs.readFileSync(object));
  let cases = 0;
  for (const fn of PAIR) cases += checkBehavior(readProgram(object, fn));
  return { elf, cases };
}

function assemble(source, output) {
  run(compiler, ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding", "-fno-pic", "-fno-pie",
    "-Wa,--noexecstack", "-c", source, "-o", output]);
}

function expectReject(callback, label) {
  let rejected = false;
  try { callback(); } catch { rejected = true; }
  check(rejected, `hostile fixture accepted: ${label}`);
}

function selfTest(repository) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "dll-battle-video-player-"));
  try {
    const pair = path.join(directory, "pair.o"), prior = path.join(directory, "prior.o"), object = path.join(directory, "candidate.o");
    assemble(path.join(ROOT, SOURCE), pair);
    run(compiler, ["-march=armv6k", "-marm", "-Os", "-ffreestanding", "-fno-pic", "-fno-pie", "-ffunction-sections",
      "-fno-unwind-tables", "-fno-asynchronous-unwind-tables", "-fno-ident", "-c", path.join(ROOT, PRIOR_SOURCE), "-o", prior]);
    function combine() { run(compiler, ["-nostdlib", "-r", prior, pair, "-o", object]); }
    combine();
    const valid = fs.readFileSync(object), { elf, cases } = validateCandidate(object);
    const stripped = path.join(directory, "stripped.o");
    run(objcopy, ["--remove-section=.text", "--remove-section=.rodata", "--remove-section=.data", "--remove-section=.bss",
      "--remove-section=.note.GNU-stack", "--remove-section=.ARM.attributes", object, stripped]);
    const strippedCases = validateCandidate(stripped).cases;
    let rejected = 0;
    function reject(callback, label) { expectReject(callback, label); rejected++; }
    const mutate = (callback) => { const copy = Buffer.from(valid); callback(copy); return copy; };
    reject(() => validateObject(valid.subarray(0, 30)), "truncated ELF");
    reject(() => validateObject(mutate((bytes) => bytes.writeUInt16LE(3, 18))), "wrong architecture");
    reject(() => validateObject(mutate((bytes) => bytes.writeUInt16LE(65, 48))), "section count limit");
    const section = elf.sections.find(({ name }) => name === `.text.${PAIR[0].name}`);
    reject(() => validateObject(mutate((bytes) => bytes.writeUInt32LE(64, section.header + 20))), "wrong function extent");
    reject(() => validateObject(mutate((bytes) => bytes.writeUInt32LE(3, section.header + 8))), "allocated data");
    reject(() => validateObject(mutate((bytes) => { bytes.writeUInt32LE(9, section.header + 4); bytes.writeUInt32LE(8, section.header + 36); })), "relocation section");
    const symbol = elf.symbols.find(({ name }) => name === PAIR[0].name);
    reject(() => validateObject(mutate((bytes) => bytes.writeUInt16LE(0, symbol.cursor + 14))), "undefined function");
    const mapping = elf.symbols.find(({ shndx, name }) => shndx === section.index && name === "$a");
    reject(() => validateObject(mutate((bytes) => bytes.writeUInt32LE(4, mapping.cursor + 4))), "wrong ARM mapping");
    const config = structuredClone(repository.config), unit = config.units.find(({ name }) => name === UNIT);
    unit.functions.push({ ...PAIR[0] });
    reject(() => validateContract(config, repository.inventory), "duplicate claim");
    reject(() => validateSource(`${fs.readFileSync(path.join(ROOT, SOURCE), "utf8")}\n.word 0\n`), "opaque data directive");
    const source = fs.readFileSync(path.join(ROOT, SOURCE), "utf8"), badSource = path.join(directory, "bad.S");
    // A different legal schedule must pass. Acceptance is behavioral, not an
    // exact instruction-list comparison disguised as a structural check.
    const rescheduled = source.replace("    mov r5, r0\n    mov r4, r1", "    mov r4, r1\n    mov r5, r0")
      .replace("    ldr r1, [r5, #4]\n    ldr r0, [r4, #8]", "    ldr r0, [r4, #8]\n    ldr r1, [r5, #4]");
    check(rescheduled !== source, "rescheduled positive fixture was not constructed");
    validateSource(rescheduled);
    fs.writeFileSync(badSource, rescheduled); assemble(badSource, pair); combine();
    const rescheduledCases = validateCandidate(object).cases;
    for (const [label, altered] of [
      ["left/right traversal swap", source.replace("[r4, #12]", "[r4, #8]")],
      ["wrong context field", source.replaceAll("[r5, #4]", "[r5, #8]")],
      ["payload clobber", source.replace("str r1, [r4, #12]", "str r1, [r4, #4]")],
      ["broken early return", source.replace("bxeq lr", "bxne lr")],
      ["lost context preservation", source.replace("mov r5, r0", "mov r5, r1")],
      ["recursive identity changed", source.replace("bl .Lentry_\\name", "bl .Lloop_\\name")],
      ["foreign allocation", `${source}\n.section .data.foreign, "aw", %progbits\n.space 4\n`],
      ["foreign executable", `${source}\n.section .text.foreign, "ax", %progbits\nnop\n`],
      ["external helper", source.replace("bl .Lentry_\\name", "bl external_helper")],
    ]) {
      fs.writeFileSync(badSource, altered); assemble(badSource, pair); combine();
      reject(() => validateCandidate(object), label);
    }
    return { cases: cases + strippedCases + rescheduledCases, rejected };
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

try {
  let object, test = false;
  for (let index = 2; index < process.argv.length; index++) {
    const arg = process.argv[index];
    if (arg === "--self-test") { check(!test, "duplicate --self-test"); test = true; }
    else {
      check(arg === "--object" && object === undefined && process.argv[index + 1] !== undefined,
        "usage: validator [--self-test] [--object authored-base.o]");
      object = path.resolve(process.argv[++index]);
    }
  }
  const repository = validateRepository();
  const tested = test ? selfTest(repository) : undefined;
  const candidate = object ? validateCandidate(object) : undefined;
  console.log(`Validated ${UNIT}: two 60-byte recyclers; prior 8-byte leaf retained` +
    `${tested ? `; ${tested.cases} synthetic executions and ${tested.rejected} rejected hostile fixtures` : ""}` +
    `${candidate ? `; integrated base object passed ${candidate.cases} synthetic executions` : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
