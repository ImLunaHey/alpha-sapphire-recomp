#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "config/arm-runtime-helpers-87.json");
const EXPECTED_INSTRUCTION_HASH =
  "03ab6545f47ecbc6e24aecebfae9f21f0a80c0e587ce61ec9b0de3648cdc7e52";
const EXPECTED_FUNCTIONS = 24;
const EXPECTED_BYTES = 480;
const EXPECTED_INSTRUCTIONS = 120;
const EXPECTED_BRANCHES = 1;
const EXPECTED_RETURNS = 24;
const EXPECTED_MEMORY = 54;

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  if (result.error) fail(`could not run ${command}: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

async function executable(path) {
  try {
    await access(path, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function discoverToolchain() {
  const prefixes = [];
  for (const key of ["CROSS_COMPILE", "CROSS"]) {
    if (process.env[key]) prefixes.push(process.env[key]);
  }
  if (process.env.DEVKITARM) {
    prefixes.push(join(process.env.DEVKITARM, "bin/arm-none-eabi-"));
  }
  prefixes.push(
    "/opt/devkitpro/devkitARM/bin/arm-none-eabi-",
    "/usr/local/bin/arm-none-eabi-",
    "arm-none-eabi-",
  );

  const pathDirs = (process.env.PATH || "").split(delimiter);
  for (const prefix of [...new Set(prefixes)]) {
    const candidates = prefix.includes("/")
      ? [prefix]
      : pathDirs.map((entry) => join(entry, prefix));
    for (const candidate of candidates) {
      if (
        await executable(`${candidate}as`) &&
        await executable(`${candidate}ld`) &&
        await executable(`${candidate}objdump`)
      ) {
        return {
          as: `${candidate}as`,
          ld: `${candidate}ld`,
          objdump: `${candidate}objdump`,
        };
      }
    }
  }
  fail(
    "ARM GNU toolchain not found; set CROSS_COMPILE to the arm-none-eabi- prefix",
  );
}

function checkedRange(buffer, offset, size, what) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0) {
    fail(`invalid ${what} range`);
  }
  if (offset > buffer.length || size > buffer.length - offset) {
    fail(`${what} lies outside the ELF file`);
  }
}

function parseElf(buffer, label) {
  checkedRange(buffer, 0, 52, `${label} ELF header`);
  if (buffer.subarray(0, 4).toString("hex") !== "7f454c46") fail(`${label}: not ELF`);
  if (buffer[4] !== 1 || buffer[5] !== 1 || buffer[6] !== 1) {
    fail(`${label}: expected ELF32 little-endian version 1`);
  }
  if (buffer.readUInt16LE(16) !== 1 || buffer.readUInt16LE(18) !== 40) {
    fail(`${label}: expected an ARM relocatable object`);
  }

  const shoff = buffer.readUInt32LE(32);
  const shentsize = buffer.readUInt16LE(46);
  let shnum = buffer.readUInt16LE(48);
  let shstrndx = buffer.readUInt16LE(50);
  if (shentsize < 40) fail(`${label}: undersized section-header entries`);
  checkedRange(buffer, shoff, shentsize, `${label} section zero`);
  if (shnum === 0) shnum = buffer.readUInt32LE(shoff + 20);
  if (shnum < 1 || shnum > 0xffff) fail(`${label}: unreasonable section count ${shnum}`);
  checkedRange(buffer, shoff, shentsize * shnum, `${label} section-header table`);
  if (shstrndx === 0xffff) shstrndx = buffer.readUInt32LE(shoff + 24);
  if (shstrndx >= shnum) fail(`${label}: invalid section-name table index`);

  const sections = [];
  for (let index = 0; index < shnum; index++) {
    const at = shoff + index * shentsize;
    const section = {
      index,
      nameOffset: buffer.readUInt32LE(at),
      type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8),
      addr: buffer.readUInt32LE(at + 12),
      offset: buffer.readUInt32LE(at + 16),
      size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24),
      info: buffer.readUInt32LE(at + 28),
      align: buffer.readUInt32LE(at + 32),
      entsize: buffer.readUInt32LE(at + 36),
    };
    if (section.type !== 8) {
      checkedRange(buffer, section.offset, section.size, `${label} section ${index}`);
    }
    sections.push(section);
  }

  const shstr = sections[shstrndx];
  if (shstr.type !== 3) fail(`${label}: section-name table is not a string table`);
  function stringAt(table, offset, what) {
    if (offset >= table.size) fail(`${label}: invalid ${what} string offset`);
    const start = table.offset + offset;
    const end = buffer.indexOf(0, start);
    if (end < start || end >= table.offset + table.size) fail(`${label}: unterminated ${what}`);
    return buffer.toString("utf8", start, end);
  }
  for (const section of sections) section.name = stringAt(shstr, section.nameOffset, "section name");

  const symbols = [];
  for (const table of sections.filter((section) => section.type === 2)) {
    if (table.link >= sections.length || sections[table.link].type !== 3) {
      fail(`${label}: symbol table has an invalid string-table link`);
    }
    if (table.entsize < 16 || table.size % table.entsize !== 0) {
      fail(`${label}: malformed symbol table`);
    }
    const strings = sections[table.link];
    for (let offset = 0; offset < table.size; offset += table.entsize) {
      const at = table.offset + offset;
      const nameOffset = buffer.readUInt32LE(at);
      symbols.push({
        name: nameOffset === 0 ? "" : stringAt(strings, nameOffset, "symbol name"),
        value: buffer.readUInt32LE(at + 4),
        size: buffer.readUInt32LE(at + 8),
        info: buffer[at + 12],
        other: buffer[at + 13],
        shndx: buffer.readUInt16LE(at + 14),
      });
    }
  }
  return { buffer, sections, symbols };
}

function validateElf(elf, config, label, minimumSections = 0) {
  if (elf.sections.length < minimumSections) {
    fail(`${label}: expected at least ${minimumSections} sections, found ${elf.sections.length}`);
  }
  const selected = new Set();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const matches = elf.sections.filter((section) => section.name === sectionName);
    if (matches.length !== 1) fail(`${label}: expected exactly one ${sectionName}`);
    const section = matches[0];
    selected.add(section.index);
    if (section.type !== 1 || (section.flags & 0x6) !== 0x6) {
      fail(`${label}: ${sectionName} is not executable allocated PROGBITS`);
    }
    if (section.size !== fn.size || section.addr !== 0 || section.align < 4) {
      fail(`${label}: invalid size/address/alignment for ${sectionName}`);
    }
    const symbols = elf.symbols.filter((symbol) => symbol.name === fn.name && symbol.shndx !== 0);
    if (symbols.length !== 1) fail(`${label}: expected one definition of ${fn.name}`);
    const symbol = symbols[0];
    if (
      symbol.shndx !== section.index || symbol.value !== 0 || symbol.size !== fn.size ||
      (symbol.info >> 4) !== 1 || (symbol.info & 0xf) !== 2
    ) {
      fail(`${label}: invalid symbol metadata for ${fn.name}`);
    }
  }
  for (const section of elf.sections) {
    if ((section.type === 4 || section.type === 9) && selected.has(section.info) && section.size !== 0) {
      fail(`${label}: relocation section ${section.name} targets an owned function`);
    }
  }
}

function parseDisassembly(text, fn) {
  const instructions = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{8}|(?:[0-9a-fA-F]{2}\s+){3}[0-9a-fA-F]{2})\s+([A-Za-z][A-Za-z0-9.]*)\s*(.*?)\s*$/);
    if (!match) continue;
    instructions.push({
      fn,
      offset: Number.parseInt(match[1], 16),
      mnemonic: match[2].toLowerCase(),
      operands: match[3].replace(/\s+@.*$/, "").replace(/\s+/g, " ").trim(),
    });
  }
  return instructions;
}

function isCall(mnemonic) {
  return /^(bl|blx)(?:[a-z]{2})?$/.test(mnemonic);
}

function isDirectBranch(mnemonic) {
  return /^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic);
}

function isMemory(mnemonic) {
  return /^(ldr|str|ldm|stm|swp)(?:b|bt|h|sb|sh|d|ex|exb|exh|exd|ia|ib|da|db|fd|fa|ed|ea)?(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic);
}

function disassembleOwned(objdump, object, config) {
  const all = [];
  for (const fn of config.functions) {
    const section = `.text.${fn.name}`;
    const output = run(objdump, ["-d", "-j", section, object]);
    const instructions = parseDisassembly(output, fn.name);
    if (instructions.length !== fn.size / 4) {
      fail(`${fn.name}: expected ${fn.size / 4} ARM instructions, found ${instructions.length}`);
    }
    for (let index = 0; index < instructions.length; index++) {
      if (instructions[index].offset !== index * 4) fail(`${fn.name}: non-contiguous disassembly`);
    }
    all.push(...instructions);
  }
  return all;
}

function validateSchedule(instructions, config) {
  const calls = instructions.filter((instruction) => isCall(instruction.mnemonic));
  const branches = instructions.filter((instruction) => isDirectBranch(instruction.mnemonic));
  const returns = instructions.filter(
    (instruction) => instruction.mnemonic === "bx" && instruction.operands === "lr",
  );
  const memory = instructions.filter((instruction) => isMemory(instruction.mnemonic));
  const pcRelative = instructions.filter(
    (instruction) => /\bpc\b/.test(instruction.operands) || instruction.mnemonic === "adr",
  );
  if (instructions.length !== EXPECTED_INSTRUCTIONS) fail("instruction total is not 120");
  if (calls.length !== 0) fail("call schedule is not empty");
  if (branches.length !== EXPECTED_BRANCHES) fail("direct-branch total is not 1");
  if (returns.length !== EXPECTED_RETURNS) fail("return total is not 24");
  if (memory.length !== EXPECTED_MEMORY) fail("memory-operation total is not 54");
  if (pcRelative.length !== 0) fail("PC-relative access found");

  const fullSchedule = instructions.map(
    (instruction) => `${instruction.fn}:${instruction.offset.toString(16)}:${instruction.mnemonic}:${instruction.operands}`,
  ).join("\n");
  if (sha256(fullSchedule) !== EXPECTED_INSTRUCTION_HASH) fail("instruction schedule hash mismatch");

  const branch = branches[0];
  if (
    branch.fn !== "func_003304A8" || branch.offset !== 0xc || branch.mnemonic !== "beq" ||
    !/^10\s+<func_003304A8\+0x10>$/.test(branch.operands)
  ) {
    fail("unexpected local branch schedule");
  }
  const branchSchedule = branches.map(
    (instruction) => `${instruction.fn}:${instruction.offset.toString(16)}:${instruction.mnemonic}:${instruction.operands}`,
  ).join("\n");
  const returnSchedule = returns.map(
    (instruction) => `${instruction.fn}:${instruction.offset.toString(16)}:${instruction.mnemonic}:${instruction.operands}`,
  ).join("\n");
  if (sha256(branchSchedule) !== config.branchScheduleSha256) fail("branch schedule hash mismatch");
  if (sha256(returnSchedule) !== config.returnScheduleSha256) fail("return schedule hash mismatch");
}

function validateConfig(config, sourceBytes) {
  if (config.schemaVersion !== 1 || config.mode !== "arm") fail("invalid config schema or mode");
  if (config.functions?.length !== EXPECTED_FUNCTIONS) fail("function total is not 24");
  const names = new Set(config.functions.map((fn) => fn.name));
  if (names.size !== EXPECTED_FUNCTIONS) fail("function names are not unique");
  if (config.functions.some((fn) => fn.size !== 20 || fn.calls?.length || fn.adjacentWords?.length)) {
    fail("invalid function size/call/adjacent-data inventory");
  }
  if (config.totalBodySize !== EXPECTED_BYTES || config.functions.reduce((n, fn) => n + fn.size, 0) !== EXPECTED_BYTES) {
    fail("body-byte total is not 480");
  }
  if (config.totalAdjacentSize !== 0 || config.pcRelativeDataAccesses?.length !== 0) {
    fail("adjacent or PC-relative data inventory is not empty");
  }
  if (config.source !== "src/main/arm_runtime_helpers_87.S") fail("unexpected source path");
  if (sha256(sourceBytes) !== config.sourceSha256) fail("source SHA-256 mismatch");
  if (EXPECTED_INSTRUCTION_HASH !== "03ab6545f47ecbc6e24aecebfae9f21f0a80c0e587ce61ec9b0de3648cdc7e52") {
    fail("instruction schedule hash constant is corrupt");
  }
}

function hostileSource(sectionCount) {
  const lines = [
    ".syntax unified", ".arch armv6k", ".arm",
    '.section .text.hostile_before,"ax",%progbits',
    ".global hostile_before", ".type hostile_before, %function", "hostile_before:",
    "ldr r0, .Lhostile_word", "bl hostile_external", "bx lr", ".Lhostile_word:",
    ".word hostile_external", ".size hostile_before, .-hostile_before",
  ];
  for (let index = 0; index < sectionCount; index++) {
    lines.push(`.section .hostile.${index},"",%progbits`, `.byte ${index & 0xff}`);
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  const sourcePath = join(ROOT, config.source);
  const sourceBytes = await readFile(sourcePath);
  validateConfig(config, sourceBytes);
  const tools = await discoverToolchain();
  const scratch = await mkdtemp(join(tmpdir(), "arm-runtime-helpers-87-"));
  try {
    const isolated = join(scratch, "isolated.o");
    const hostileAsm = join(scratch, "hostile.S");
    const hostileObj = join(scratch, "hostile.o");
    const composite = join(scratch, "composite.o");
    run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", isolated, sourcePath]);
    const isolatedElf = parseElf(await readFile(isolated), "isolated object");
    validateElf(isolatedElf, config, "isolated object");
    const isolatedSchedule = disassembleOwned(tools.objdump, isolated, config);
    validateSchedule(isolatedSchedule, config);

    await writeFile(hostileAsm, hostileSource(12050));
    run(tools.as, ["-march=armv6k", "-o", hostileObj, hostileAsm]);
    const hostileElf = parseElf(await readFile(hostileObj), "hostile object");
    if (hostileElf.sections.length < 12000) fail("high-section-count ELF exercise was ineffective");
    run(tools.ld, ["-r", "-o", composite, hostileObj, isolated]);
    const compositeElf = parseElf(await readFile(composite), "hostile composite");
    validateElf(compositeElf, config, "hostile composite", 12000);
    const compositeSchedule = disassembleOwned(tools.objdump, composite, config);
    validateSchedule(compositeSchedule, config);
    if (JSON.stringify(isolatedSchedule) !== JSON.stringify(compositeSchedule)) {
      fail("owned disassembly changed in the hostile composite");
    }

    console.log(
      `arm-runtime-helpers-87: ok (${EXPECTED_FUNCTIONS} functions, ${EXPECTED_BYTES} bytes, ` +
      `${EXPECTED_INSTRUCTIONS} instructions, ${EXPECTED_BRANCHES} local branch, ` +
      `${EXPECTED_RETURNS} returns, ${EXPECTED_MEMORY} memory operations; isolated + hostile composite)`,
    );
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

await main().catch((error) => {
  console.error(`arm-runtime-helpers-87: ${error.message}`);
  process.exitCode = 1;
});
