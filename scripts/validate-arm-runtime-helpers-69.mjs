#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "config/arm-runtime-helpers-69.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const sourcePath = path.join(root, config.source);
const source = fs.readFileSync(sourcePath, "utf8");
const expectedBranchCounts = new Map([
  ["func_004C7A54", 6], ["func_005757BC", 10], ["func_005759F4", 9],
  ["func_004B5F14", 6], ["func_0045A144", 4], ["func_004A8C08", 0],
  ["func_005224B4", 11], ["func_005758E4", 9], ["func_0014E240", 16],
  ["func_0040282C", 7], ["func_001CFC08", 11], ["func_00111008", 10],
  ["func_004B60DC", 9], ["func_00110F14", 10], ["func_00190568", 3],
  ["func_00195160", 8], ["func_001FAE40", 5], ["func_0056DD44", 10],
  ["func_001F3D9C", 9], ["func_00549E14", 4], ["func_00188338", 8],
  ["func_0013F394", 17], ["func_001C3238", 13], ["func_0014E170", 7],
]);

function fail(message) {
  throw new Error(message);
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function checkConfigAndSource() {
  if (config.schemaVersion !== 1 || config.mode !== "arm") fail("unsupported config schema or mode");
  if (!/^[0-9a-f]{64}$/.test(config.sourceSha256)) fail("sourceSha256 is not pinned");
  const actualHash = sha256(source);
  if (actualHash !== config.sourceSha256) {
    fail(`source SHA-256 mismatch: expected ${config.sourceSha256}, got ${actualHash}`);
  }
  if (config.totalAdjacentSize !== 0) fail("batch must have zero adjacent data");
  const total = config.functions.reduce((sum, fn) => sum + fn.size, 0);
  if (total !== config.totalBodySize) fail(`configured body-size total is ${total}, not ${config.totalBodySize}`);
  const names = config.functions.map((fn) => fn.name);
  if (new Set(names).size !== names.length) fail("duplicate configured function name");
  for (const fn of config.functions) {
    if (fn.size <= 0 || fn.size % 4 !== 0) fail(`${fn.name}: invalid ARM body size`);
    if (!Array.isArray(fn.calls) || fn.calls.length !== 0) fail(`${fn.name}: calls must be empty`);
    if (!Array.isArray(fn.adjacentWords) || fn.adjacentWords.length !== 0) {
      fail(`${fn.name}: adjacent data must be empty`);
    }
  }
  if (config.pcRelativeDataAccesses?.length !== 0) fail("PC-relative data schedule must be empty");

  const sectionNames = [...source.matchAll(/^\.section\s+\.text\.([A-Za-z0-9_]+),"ax",%progbits\s*$/gm)].map((m) => m[1]);
  if (sectionNames.join("\n") !== names.join("\n")) fail("source section schedule/order differs from config");

  const forbiddenData = /^\s*\.(?:byte|hword|short|word|long|quad|ascii|asciz|string|incbin|space|skip|zero|fill)\b/m;
  if (forbiddenData.test(source)) fail("source contains data or padding directives");
  if (/\[[^\]\n]*\bpc\b[^\]\n]*\]|\badr(?:l)?(?:[a-z]{0,2})?\b|=\s*[A-Za-z_.]/i.test(source)) {
    fail("source contains a PC-relative data access");
  }

  const sectionPattern = /^\.section\s+\.text\.([A-Za-z0-9_]+),"ax",%progbits\s*$([\s\S]*?)(?=^\.section\s+\.text\.|(?![\s\S]))/gm;
  const bodies = [...source.matchAll(sectionPattern)];
  if (bodies.length !== names.length) fail("could not parse every owned source section");
  for (const match of bodies) {
    const name = match[1];
    const body = match[2];
    if (!new RegExp(`^${name}:\\s*$`, "m").test(body)) fail(`${name}: missing entry label`);
    if (!new RegExp(`^\\.size\\s+${name},\\s*\\.-${name}\\s*$`, "m").test(body)) fail(`${name}: missing exact .size`);
    const localLabels = new Set([...body.matchAll(/^\s*(\.L[A-Za-z0-9_]+):\s*$/gm)].map((m) => m[1]));
    let branches = 0;
    for (const line of body.split(/\r?\n/)) {
      const code = line.replace(/@.*$/, "").trim();
      if (!code || code.startsWith(".")) continue;
      const insn = code.match(/^([a-z][a-z0-9.]*)\s*(.*)$/i);
      if (!insn) continue;
      const mnemonic = insn[1].toLowerCase();
      const operand = insn[2].trim();
      if (/^bl(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic) ||
          /^blx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)) {
        fail(`${name}: call instruction ${code}`);
      }
      if (/^bx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)) {
        if (operand !== "lr") fail(`${name}: non-return indirect branch ${code}`);
        continue;
      }
      if (/\bpc\b/i.test(operand) && mnemonic !== "pop") {
        fail(`${name}: PC-relative or computed-PC instruction ${code}`);
      }
      if (/^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)) {
        branches++;
        if (!localLabels.has(operand)) fail(`${name}: branch target is not function-local: ${operand}`);
      }
    }
    if (branches !== expectedBranchCounts.get(name)) {
      fail(`${name}: expected ${expectedBranchCounts.get(name)} local branches, found ${branches}`);
    }
  }
}

function cString(buffer, offset) {
  if (offset < 0 || offset >= buffer.length) return "";
  const end = buffer.indexOf(0, offset);
  return buffer.toString("utf8", offset, end < 0 ? buffer.length : end);
}

function parseElf(file) {
  const data = fs.readFileSync(file);
  if (data.length < 52 || data.toString("binary", 0, 4) !== "\x7fELF") fail(`${file}: not an ELF file`);
  if (data[4] !== 1 || data[5] !== 1) fail(`${file}: expected ELF32 little-endian object`);
  const u16 = (off) => data.readUInt16LE(off);
  const u32 = (off) => data.readUInt32LE(off);
  if (u16(16) !== 1) fail(`${file}: expected relocatable ELF object`);
  if (u16(18) !== 40) fail(`${file}: expected ARM ELF machine`);
  const shoff = u32(32);
  const shentsize = u16(46);
  const shnum = u16(48);
  const shstrndx = u16(50);
  if (shentsize < 40 || shnum === 0 || shstrndx >= shnum) fail(`${file}: malformed section table`);
  if (shoff + shentsize * shnum > data.length) fail(`${file}: truncated section table`);
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const off = shoff + i * shentsize;
    sections.push({
      index: i, nameOffset: u32(off), type: u32(off + 4), flags: u32(off + 8),
      addr: u32(off + 12), offset: u32(off + 16), size: u32(off + 20),
      link: u32(off + 24), info: u32(off + 28), align: u32(off + 32), entsize: u32(off + 36),
    });
  }
  const shstr = sections[shstrndx];
  if (shstr.offset + shstr.size > data.length) fail(`${file}: truncated section-name table`);
  const shstrData = data.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) {
    section.name = cString(shstrData, section.nameOffset);
    if (section.type !== 8 && section.offset + section.size > data.length) fail(`${file}: truncated ${section.name}`);
    section.data = section.type === 8 ? Buffer.alloc(section.size) : data.subarray(section.offset, section.offset + section.size);
  }
  const symbols = [];
  for (const symtab of sections.filter((s) => s.type === 2)) {
    const strings = sections[symtab.link];
    if (!strings || strings.type !== 3) fail(`${file}: malformed symbol string table`);
    const stride = symtab.entsize || 16;
    if (stride < 16 || symtab.size % stride !== 0) fail(`${file}: malformed symbol table`);
    for (let off = 0; off < symtab.size; off += stride) {
      const absolute = symtab.offset + off;
      const nameOffset = u32(absolute);
      const info = data[absolute + 12];
      symbols.push({
        name: cString(strings.data, nameOffset), value: u32(absolute + 4), size: u32(absolute + 8),
        bind: info >>> 4, type: info & 15, shndx: u16(absolute + 14),
      });
    }
  }
  return { data, sections, symbols };
}

function findExecutable(names) {
  for (const candidate of names.filter(Boolean)) {
    if (candidate.includes(path.sep)) {
      try { fs.accessSync(candidate, fs.constants.X_OK); return candidate; } catch { continue; }
    }
    const probe = spawnSync("sh", ["-c", 'command -v "$1"', "sh", candidate], {
      encoding: "utf8", maxBuffer: MAX_BUFFER,
    });
    if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  }
  return null;
}

function assemble(output) {
  let assembler = findExecutable([
    process.env.ARM_NONE_EABI_AS,
    "arm-none-eabi-as", "arm-linux-gnueabi-as", "arm-linux-gnueabihf-as",
    process.env.AS,
  ]);
  if (!assembler) {
    const toolchain = spawnSync("nix", [
      "build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded",
    ], { cwd: root, encoding: "utf8", maxBuffer: MAX_BUFFER });
    if (toolchain.status === 0 && toolchain.stdout.trim()) {
      const candidate = path.join(toolchain.stdout.trim(), "bin", "arm-none-eabi-as");
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        assembler = candidate;
      } catch {
        // The common diagnostic below also covers an incomplete Nix toolchain.
      }
    }
  }
  if (!assembler) fail("no GNU ARM assembler found (set ARM_NONE_EABI_AS or AS)");
  const result = spawnSync(assembler, ["-o", output, sourcePath], {
    cwd: root, encoding: "utf8", maxBuffer: MAX_BUFFER,
  });
  if (result.error) fail(`assembler failed: ${result.error.message}`);
  if (result.status !== 0) fail(`assembler exited ${result.status}:\n${result.stderr || result.stdout}`);
}

function validateObject(file, expected, enforceOwnedOrder) {
  const actual = parseElf(file);
  let lastIndex = -1;
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const matches = actual.sections.filter((s) => s.name === sectionName);
    if (matches.length !== 1) fail(`${file}: expected exactly one ${sectionName} section`);
    const section = matches[0];
    if (enforceOwnedOrder && section.index <= lastIndex) fail(`${file}: owned section order differs from config`);
    lastIndex = section.index;
    if (section.type !== 1 || (section.flags & 0x6) !== 0x6) fail(`${file}: ${sectionName} is not executable PROGBITS`);
    if (section.align < 4 || section.size !== fn.size) {
      fail(`${file}: ${sectionName} expected size/alignment ${fn.size}/4, got ${section.size}/${section.align}`);
    }
    const expectedSection = expected.sections.find((s) => s.name === sectionName);
    if (!expectedSection || !section.data.equals(expectedSection.data)) fail(`${file}: ${sectionName} instruction schedule differs`);
    const defs = actual.symbols.filter((s) => s.name === fn.name && s.shndx === section.index);
    if (defs.length !== 1) fail(`${file}: expected exactly one definition of ${fn.name}`);
    const symbol = defs[0];
    if (symbol.bind !== 1 || symbol.type !== 2 || symbol.value !== 0 || symbol.size !== fn.size) {
      fail(`${file}: ${fn.name} must be a global function spanning exactly its owned section`);
    }
    for (const reloc of actual.sections.filter((s) => (s.type === 4 || s.type === 9) && s.info === section.index)) {
      if (reloc.size !== 0) fail(`${file}: ${sectionName} has relocations in ${reloc.name}`);
    }
  }
}

let temporary;
try {
  checkConfigAndSource();
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), "arm-runtime-helpers-69-"));
  const expectedPath = path.join(temporary, "expected.o");
  assemble(expectedPath);
  const expected = parseElf(expectedPath);
  const input = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : expectedPath;
  validateObject(input, expected, input === expectedPath);
  console.log(`validated ARM runtime/helper batch 69: ${config.functions.length} functions, ${config.totalBodySize} bytes, ${path.relative(root, input) || input}`);
} catch (error) {
  console.error(`validate-arm-runtime-helpers-69: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
}
