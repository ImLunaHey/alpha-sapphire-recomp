#!/usr/bin/env node

import { createHash } from "node:crypto";
import { accessSync, constants, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "config/arm-runtime-helpers-86.json");
const FULL_SCHEDULE_SHA256 = "16ed62fd49078a8a0a0873df31a65303743892dd5fdc3e4910c31497eed2a550";
const EXPECTED = {
  func_004108D4: "002090e50227a0e12227a0e1011982e1001080e51eff2fe1",
  func_00417460: "000051e3281090e5011081130110c103281080e51eff2fe1",
  func_00438B7C: "0911d0e5010051e32400900580009005140090151eff2fe1",
  func_0045E658: "0010a0e3d41380e5d81380e5dc1380e5e01380e51eff2fe1",
  func_00463D38: "010180e0020080e03410d0e5030051e13430c0351eff2fe1",
  func_00466F00: "000090e57110ffe6ef0e80e20000a0e1b41ec0e11eff2fe1",
  func_004B09E0: "0c1090e5100090e5000051e10100a0110000a0031eff2fe1",
  func_004B1444: "000090e5001091e5010050e10100a0030000a0131eff2fe1",
  func_004BF4F8: "b010d0e1030c51e304109005010080000000a0131eff2fe1",
  func_004BF52C: "b010d0e1410c51e3041090050000a013010080001eff2fe1",
  func_004C2018: "041090e5022c41e21f2052e20000a013080080021eff2fe1",
  func_0010E17C: "780190e50100d0e5000050e30100a0131eff2fe1",
  func_00110D9C: "020a9dec081080e2020a81ecf020c0e11eff2fe1",
  func_001175D0: "030051e3010180300000a023240090351eff2fe1",
  func_00117768: "0010a0e3001080e5b410c0e10610c0e51eff2fe1",
  func_0013F33C: "0c0090e50000a0e1080090e5000090e51eff2fe1",
  func_0014B87C: "4e10a0e3900100e0390080e20300c0e31eff2fe1",
  func_0014DFB4: "b010d0e1100051e3b400d0010000a0131eff2fe1",
  func_00152868: "0c0090e50a00d0e5000050e30100a0131eff2fe1",
  func_00186EC4: "810080e00030a0e30230c0e70100a0e31eff2fe1",
  func_001950F8: "002091e5002080e5b430d1e1b430c0e11eff2fe1",
  func_001D25F0: "020050e3040050130100a0030000a0131eff2fe1",
  func_002067EC: "041081e2042080e2070a91ec070a82ec1eff2fe1",
  func_0029C1C0: "042091e5042080e5b810d1e1b810c0e11eff2fe1",
};

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }

function commandWorks(command) {
  const result = spawnSync(command, ["--version"], { encoding: "utf8", timeout: 5000 });
  return !result.error && result.status === 0;
}

function discoverTools() {
  const direct = { as: process.env.AS, objdump: process.env.OBJDUMP, ld: process.env.LD };
  if (direct.as || direct.objdump || direct.ld) {
    check(direct.as && direct.objdump && direct.ld, "AS, OBJDUMP, and LD must be set together");
    for (const [kind, command] of Object.entries(direct)) check(commandWorks(command), `${kind} tool is unavailable: ${command}`);
    return direct;
  }
  const prefixes = [process.env.CROSS_COMPILE, process.env.ARM_NONE_EABI_PREFIX, "arm-none-eabi-"].filter(Boolean);
  for (const prefix of [...new Set(prefixes)]) {
    const tools = { as: `${prefix}as`, objdump: `${prefix}objdump`, ld: `${prefix}ld` };
    if (Object.values(tools).every(commandWorks)) return tools;
  }
  fail("ARM tools not found; set CROSS_COMPILE or AS/OBJDUMP/LD");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT, encoding: "utf8", maxBuffer: 8 * 1024 * 1024, timeout: 30000, ...options,
  });
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function cString(buffer, start, limit, context) {
  check(Number.isSafeInteger(start) && start >= 0 && start < limit, `${context}: invalid string offset`);
  let end = start;
  while (end < limit && buffer[end] !== 0) end++;
  check(end < limit, `${context}: unterminated string`);
  return buffer.toString("utf8", start, end);
}

function parseElf(path) {
  const buffer = readFileSync(path);
  check(buffer.length >= 52 && buffer.length <= 16 * 1024 * 1024, "ELF has invalid size");
  check(buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), "not an ELF file");
  check(buffer[4] === 1 && buffer[5] === 1, "ELF must be 32-bit little-endian");
  check(buffer.readUInt16LE(18) === 40, "ELF machine is not ARM");
  const sectionOffset = buffer.readUInt32LE(32);
  const entrySize = buffer.readUInt16LE(46);
  const count = buffer.readUInt16LE(48);
  const namesIndex = buffer.readUInt16LE(50);
  check(entrySize >= 40 && count > 0 && count <= 4096 && namesIndex < count, "invalid ELF section table");
  check(sectionOffset + entrySize * count <= buffer.length, "section table exceeds ELF bounds");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = sectionOffset + index * entrySize;
    const section = {
      index, nameOffset: buffer.readUInt32LE(at), type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8), address: buffer.readUInt32LE(at + 12),
      offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), info: buffer.readUInt32LE(at + 28),
      align: buffer.readUInt32LE(at + 32), entrySize: buffer.readUInt32LE(at + 36),
    };
    check(section.type === 8 || section.offset + section.size <= buffer.length, `section ${index} exceeds ELF bounds`);
    sections.push(section);
  }
  const names = sections[namesIndex];
  check(names.type === 3 && names.offset + names.size <= buffer.length, "invalid section-name table");
  for (const section of sections) section.name = cString(buffer, names.offset + section.nameOffset, names.offset + names.size, "section name");

  const symbols = [];
  for (const table of sections.filter(section => section.type === 2)) {
    check(table.entrySize >= 16 && table.size % table.entrySize === 0 && table.link < sections.length, "invalid symbol table");
    const strings = sections[table.link];
    check(strings.type === 3, "symbol table has invalid string table");
    for (let offset = 0; offset < table.size; offset += table.entrySize) {
      const at = table.offset + offset;
      const nameOffset = buffer.readUInt32LE(at);
      symbols.push({
        name: cString(buffer, strings.offset + nameOffset, strings.offset + strings.size, "symbol name"),
        value: buffer.readUInt32LE(at + 4), size: buffer.readUInt32LE(at + 8),
        type: buffer[at + 12] & 15, bind: buffer[at + 12] >>> 4, sectionIndex: buffer.readUInt16LE(at + 14),
      });
    }
  }
  return { buffer, sections, symbols };
}

function sectionBytes(elf, section) {
  check(section.type !== 8, `${section.name} unexpectedly has no file bytes`);
  return elf.buffer.subarray(section.offset, section.offset + section.size);
}

function auditElf(path, config, { strict }) {
  const elf = parseElf(path);
  const expectedNames = new Set(config.functions.map(item => item.name));
  const ownedSections = new Set();
  let previousIndex = -1;
  let totalSize = 0;
  for (const item of config.functions) {
    const sectionName = `.text.${item.name}`;
    const matches = elf.sections.filter(section => section.name === sectionName);
    check(matches.length === 1, `${sectionName}: expected exactly one section`);
    const section = matches[0];
    check(section.index > previousIndex, `${sectionName}: section order differs from configuration`);
    previousIndex = section.index;
    ownedSections.add(section.index);
    check(section.type === 1 && (section.flags & 6) === 6 && section.align === 4, `${sectionName}: invalid executable section`);
    check(section.size === item.size, `${sectionName}: expected ${item.size} bytes, found ${section.size}`);
    check(sectionBytes(elf, section).toString("hex") === EXPECTED[item.name], `${sectionName}: exact bytes differ`);
    const symbols = elf.symbols.filter(symbol => symbol.name === item.name);
    check(symbols.length === 1, `${item.name}: expected exactly one symbol`);
    const symbol = symbols[0];
    check(symbol.bind === 1 && symbol.type === 2 && symbol.sectionIndex === section.index, `${item.name}: symbol is not a global function in its owned section`);
    check(symbol.value === section.address && symbol.size === item.size && (symbol.value & 3) === 0, `${item.name}: invalid symbol boundary or ARM alignment`);
    totalSize += section.size;
  }
  check(totalSize === 524 && totalSize === config.totalBodySize, `aggregate body size is ${totalSize}, expected 524`);
  for (const section of elf.sections.filter(section => section.type === 4 || section.type === 9)) {
    check(section.size === 0, `${section.name}: relocations are forbidden`);
  }
  if (strict) {
    const extras = elf.sections.filter(section => (section.flags & 4) !== 0 && section.size !== 0 && !ownedSections.has(section.index));
    check(extras.length === 0, `unexpected executable section(s): ${extras.map(section => section.name).join(", ")}`);
    const extraGlobals = elf.symbols.filter(symbol => symbol.bind === 1 && symbol.sectionIndex !== 0 && !expectedNames.has(symbol.name));
    check(extraGlobals.length === 0, `unexpected defined global(s): ${extraGlobals.map(symbol => symbol.name).join(", ")}`);
  }
  return elf;
}

function disassemble(tools, object, config) {
  const all = [];
  for (const item of config.functions) {
    const section = `.text.${item.name}`;
    const output = run(tools.objdump, ["-d", "-j", section, object]);
    const instructions = [];
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*?)\s*$/);
      if (!match) continue;
      const offset = Number.parseInt(match[1], 16);
      let operands = match[3].replace(/\s+@.*$/, "").trim().replace(/\s+/g, " ");
      instructions.push({ name: item.name, offset, mnemonic: match[2].toLowerCase(), operands });
    }
    check(instructions.length === item.size / 4, `${item.name}: disassembly is not exactly ${item.size / 4} ARM instructions`);
    check(instructions[0].offset === 0 && instructions.every((instruction, index) => instruction.offset === index * 4), `${item.name}: disassembly is outside its bounded body`);
    all.push(...instructions);
  }
  return all;
}

function scheduleEntry(instruction) {
  return `${instruction.name}:${instruction.offset.toString(16)}:${instruction.mnemonic}:${instruction.operands}`;
}

function auditSchedule(instructions, config) {
  check(instructions.length === 131, `instruction count is ${instructions.length}, expected 131`);
  const schedule = instructions.map(scheduleEntry).join("\n");
  check(sha256(schedule) === FULL_SCHEDULE_SHA256, "full instruction schedule hash differs");
  const calls = instructions.filter(item => /^blx?$/.test(item.mnemonic));
  check(calls.length === 0, `found ${calls.length} call(s)`);
  const directBranches = instructions.filter(item => /^(b|beq|bne|bcs|bcc|bmi|bpl|bvs|bvc|bhi|bls|bge|blt|bgt|ble|bal)$/.test(item.mnemonic));
  const branchSchedule = directBranches.map(scheduleEntry).join("\n");
  check(sha256(branchSchedule) === config.branchScheduleSha256 && directBranches.length === 0, "direct-branch schedule differs");
  const returns = instructions.filter(item => item.mnemonic === "bx" && item.operands === "lr");
  check(returns.length === 24, `return count is ${returns.length}, expected 24`);
  check(sha256(returns.map(scheduleEntry).join("\n")) === config.returnScheduleSha256, "return schedule hash differs");
  const memory = instructions.filter(item => /^(ldr|str|ldm|stm|vldr|vstr|vldm|vstm)/.test(item.mnemonic));
  check(memory.length === 52, `memory-operation count is ${memory.length}, expected 52`);
  check(!memory.some(item => /\bpc\b/i.test(item.operands)), "PC-relative memory access found");
  const nops = instructions.filter(item => item.mnemonic === "nop" && item.operands === "@ (mov r0, r0)");
  check(nops.length === 2 && nops[0].name === "func_00466F00" && nops[0].offset === 12 && nops[1].name === "func_0013F33C" && nops[1].offset === 4, "legacy mov no-op schedule differs");
}

function assemble(tools, source, output) {
  run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", output, source]);
}

function expectRejected(action, description) {
  try { action(); } catch { return; }
  fail(`hostile ${description} was accepted`);
}

function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  check(config.schemaVersion === 1 && config.mode === "arm", "unsupported configuration");
  check(config.functions.length === 24 && Object.keys(EXPECTED).length === 24, "expected exactly 24 configured functions");
  check(config.totalAdjacentSize === 0 && config.pcRelativeDataAccesses.length === 0, "configuration permits forbidden adjacent or PC-relative data");
  check(config.functions.every(item => item.calls.length === 0 && item.adjacentWords.length === 0), "configuration permits calls or adjacent words");
  const source = resolve(ROOT, config.source);
  accessSync(source, constants.R_OK);
  const sourceBytes = readFileSync(source);
  check(sha256(sourceBytes) === config.sourceSha256, "source SHA-256 differs from configuration");
  const normalizedSource = sourceBytes.toString("utf8").replace(/[ \t]+/g, " ");
  check((normalizedSource.match(/\bmov r0, r0\b/g) || []).length === 2, "source must contain exactly two explicit 'mov r0, r0' no-ops");

  const tools = discoverTools();
  const temporary = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-86-"));
  try {
    const isolated = join(temporary, "isolated.o");
    assemble(tools, source, isolated);
    auditElf(isolated, config, { strict: true });
    auditSchedule(disassemble(tools, isolated, config), config);

    const benignSource = join(temporary, "benign.S");
    const benignObject = join(temporary, "benign.o");
    const composite = join(temporary, "composite.o");
    writeFileSync(benignSource, ".syntax unified\n.arm\n.section .text.composite_sentinel,\"ax\",%progbits\n.global composite_sentinel\n.type composite_sentinel,%function\ncomposite_sentinel:\n bx lr\n.size composite_sentinel,.-composite_sentinel\n");
    assemble(tools, benignSource, benignObject);
    run(tools.ld, ["-r", "-o", composite, isolated, benignObject]);
    auditElf(composite, config, { strict: false });
    auditSchedule(disassemble(tools, composite, config), config);

    expectRejected(() => auditElf(composite, config, { strict: true }), "extra executable section/global");
    const globalSource = join(temporary, "hostile-global.S");
    const globalObject = join(temporary, "hostile-global.o");
    const globalComposite = join(temporary, "hostile-global-composite.o");
    writeFileSync(globalSource, ".data\n.global hostile_data_global\nhostile_data_global:\n .word 0\n");
    assemble(tools, globalSource, globalObject);
    run(tools.ld, ["-r", "-o", globalComposite, isolated, globalObject]);
    expectRejected(() => auditElf(globalComposite, config, { strict: true }), "extra non-executable global");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
  console.log("arm-runtime-helpers-86: validated 24 functions, 524 bytes, 131 instructions, 52 memory operations, and 24 returns");
}

try { main(); } catch (error) {
  console.error(`arm-runtime-helpers-86: ${error.message}`);
  process.exitCode = 1;
}
