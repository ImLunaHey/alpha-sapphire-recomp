#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(repoRoot, "config/arm-duplicate-templates-65.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(repoRoot, config.source);
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(`arm duplicate templates 65: ${message}`);
}

function same(actual, expected, description) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${description}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function parseArgs(argv) {
  let objectPath;
  let readelf = "readelf";
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--object") objectPath = argv[++i];
    else if (argv[i] === "--readelf") readelf = argv[++i];
    else if (argv[i] === "--source-only") objectPath = undefined;
    else if (argv[i] === "--help") {
      console.log("usage: validate-arm-duplicate-templates-65.mjs [combined-object [readelf]]\n       validate-arm-duplicate-templates-65.mjs [--object FILE] [--readelf PROGRAM]");
      process.exit(0);
    } else if (argv[i].startsWith("-")) fail(`unknown option ${argv[i]}`);
    else positional.push(argv[i]);
  }
  if (positional.length > 2) fail("too many positional arguments");
  if (objectPath && positional.length) fail("specify the object either positionally or with --object");
  if (!objectPath) objectPath = positional[0];
  if (positional[1]) readelf = positional[1];
  return { objectPath, readelf };
}

function validateConfiguration() {
  if (config.version !== 1 || config.mode !== "arm") fail("unexpected configuration version or mode");
  const templates = Object.values(config.templates);
  if (templates.length !== 1) fail("exactly one template is required");
  const template = templates[0];
  same(config.expectedBodyBytes, template.bodySize * template.count, "aggregate body size");
  same(template.bodySize, template.instructionCount * 4, "ARM instruction/body size relationship");
  same(config.functions.length, template.count, "function/template expansion count");
  same(template.internalLabels, config.internalLabelOffsets.length, "internal-label count");
  for (const fn of config.functions) {
    same(fn.nextGlobalOffset >= template.bodySize, true, `${fn.name} next-global boundary`);
    if (fn.anonymousMaterialOffset !== undefined) {
      same(fn.anonymousMaterialOffset, template.bodySize, `${fn.name} anonymous-material boundary`);
      same(fn.nextGlobalOffset > fn.anonymousMaterialOffset, true, `${fn.name} anonymous-material extent`);
    } else {
      same(fn.nextGlobalOffset, template.bodySize, `${fn.name} immediate next-global boundary`);
    }
    same(fn.directTransfers.map(({ offset }) => offset), config.directTransferOffsets, `${fn.name} direct-transfer offsets`);
    same(fn.directTransfers.length, template.directCalls, `${fn.name} direct-call count`);
  }
}

function validateSource() {
  if (config.sourceSha256) {
    const digest = createHash("sha256").update(source).digest("hex");
    same(digest, config.sourceSha256, "source SHA-256");
  }
  for (const directive of [".syntax unified", ".arch armv6k", ".fpu vfpv2", ".arm"]) {
    if (!source.includes(directive)) fail(`missing source directive ${directive}`);
  }

  const macroMatch = source.match(/\.macro\s+DT65_BODY\s+name\s*\n([\s\S]*?)\n\.endm/);
  if (!macroMatch) fail("DT65_BODY macro is missing or malformed");
  const lines = macroMatch[1].split(/\r?\n/).map((line) => line.replace(/(?:^|\s)(?:@|\/\/).*$/, "").trim()).filter(Boolean);
  const instructions = [];
  const labels = new Map();
  for (const line of lines) {
    if (line.endsWith(":")) {
      const label = line.slice(0, -1);
      if (label !== "\\name") labels.set(label, instructions.length * 4);
    } else if (!line.startsWith(".")) {
      instructions.push(line);
    }
  }

  const template = Object.values(config.templates)[0];
  same(instructions.length, template.instructionCount, "source instruction count");
  same(instructions.length * 4, template.bodySize, "source body size");
  same([...labels.values()].sort((a, b) => a - b), config.internalLabelOffsets, "source internal-label offsets");

  const localTargets = [];
  const directCalls = [];
  const indirectCalls = [];
  for (let i = 0; i < instructions.length; i += 1) {
    const offset = i * 4;
    const [mnemonic, ...rest] = instructions[i].split(/\s+/);
    const operand = rest.join(" ");
    if (/^b(?:eq|ne)?$/.test(mnemonic) && labels.has(operand)) localTargets.push(labels.get(operand));
    if (mnemonic === "bl") directCalls.push({ offset, symbol: operand });
    if (mnemonic === "blx") indirectCalls.push({ offset, register: operand });
  }
  same([...new Set(localTargets)].sort((a, b) => a - b), config.internalLabelOffsets, "source local-branch destinations");
  same(directCalls.map(({ offset }) => offset), config.directTransferOffsets, "source direct-call offsets");
  same(directCalls.map(({ symbol }) => symbol), config.functions[0].directTransfers.map(({ symbol }) => symbol), "source direct-call symbols");
  same(indirectCalls, [{ offset: 164, register: "r1" }, { offset: 204, register: "r1" }], "source indirect-call sites");
  same(indirectCalls.length, template.indirectCalls, "source indirect-call count");

  if (/\.(?:word|long|ltorg|pool)\b|(?:^|[,\s])=\s*[^=]/m.test(macroMatch[1])) fail("template contains literal data or a literal-pool request");
  same((source.match(/^DT65_BODY\s+(\w+)\s*$/gm) ?? []).map((line) => line.split(/\s+/)[1]), config.functions.map(({ name }) => name), "macro expansion order");
}

function parseElf32(buffer) {
  if (buffer.length < 52 || buffer.toString("ascii", 0, 4) !== "\x7fELF") fail("combined object is not ELF");
  if (buffer[4] !== 1 || buffer[5] !== 1) fail("combined object must be 32-bit little-endian ELF");
  const u16 = (offset) => buffer.readUInt16LE(offset);
  const u32 = (offset) => buffer.readUInt32LE(offset);
  if (u16(18) !== 40) fail("combined object is not ARM ELF");
  const shoff = u32(32);
  const shentsize = u16(46);
  const shnum = u16(48);
  const shstrndx = u16(50);
  if (!shoff || shentsize < 40 || !shnum || shstrndx >= shnum) fail("combined object has malformed section headers");
  const sections = Array.from({ length: shnum }, (_, index) => {
    const at = shoff + index * shentsize;
    if (at + 40 > buffer.length) fail("combined object has truncated section headers");
    return { index, nameOffset: u32(at), type: u32(at + 4), offset: u32(at + 16), size: u32(at + 20), link: u32(at + 24), info: u32(at + 28), entsize: u32(at + 36) };
  });
  const getBytes = (section) => {
    if (section.offset + section.size > buffer.length) fail("combined object has a truncated section");
    return buffer.subarray(section.offset, section.offset + section.size);
  };
  const cString = (bytes, offset) => {
    const end = bytes.indexOf(0, offset);
    return bytes.toString("utf8", offset, end < 0 ? bytes.length : end);
  };
  const shstr = getBytes(sections[shstrndx]);
  for (const section of sections) section.name = cString(shstr, section.nameOffset);

  const symbols = [];
  for (const section of sections.filter(({ type }) => type === 2)) {
    const strings = getBytes(sections[section.link]);
    const bytes = getBytes(section);
    const entsize = section.entsize || 16;
    for (let at = 0; at + 16 <= bytes.length; at += entsize) {
      symbols.push({ table: section.index, index: at / entsize, name: cString(strings, bytes.readUInt32LE(at)), value: bytes.readUInt32LE(at + 4), size: bytes.readUInt32LE(at + 8), info: bytes[at + 12], shndx: bytes.readUInt16LE(at + 14) });
    }
  }
  const relocations = [];
  for (const section of sections.filter(({ type }) => type === 9 || type === 4)) {
    const bytes = getBytes(section);
    const entsize = section.entsize || (section.type === 9 ? 8 : 12);
    const table = symbols.filter(({ table }) => table === section.link);
    for (let at = 0; at + entsize <= bytes.length; at += entsize) {
      const info = bytes.readUInt32LE(at + 4);
      relocations.push({ targetSection: section.info, offset: bytes.readUInt32LE(at), type: info & 0xff, symbol: table.find(({ index }) => index === (info >>> 8))?.name });
    }
  }
  return { sections, symbols, relocations, getBytes };
}

function signed24(value) {
  return value & 0x00800000 ? value | 0xff000000 : value;
}

function validateObject(objectPath, readelf) {
  let header;
  try {
    header = execFileSync(readelf, ["-hW", objectPath], { encoding: "utf8", maxBuffer: MAX_BUFFER });
  } catch (error) {
    fail(`readelf failed for ${objectPath}: ${error.message}`);
  }
  if (!/Machine:\s+ARM\b/.test(header)) fail("readelf did not identify an ARM object");

  const elf = parseElf32(readFileSync(objectPath));
  const template = Object.values(config.templates)[0];
  for (const fn of config.functions) {
    const symbol = elf.symbols.find(({ name, info }) => name === fn.name && (info & 0x0f) === 2);
    if (!symbol) fail(`${fn.name} function symbol is missing from combined object`);
    same(symbol.size, template.bodySize, `${fn.name} object body size`);
    const section = elf.sections[symbol.shndx];
    if (!section) fail(`${fn.name} has an invalid section index`);
    const start = symbol.value;
    const bytes = elf.getBytes(section).subarray(start, start + symbol.size);
    same(bytes.length, template.bodySize, `${fn.name} available object bytes`);

    const localTargets = [];
    const indirectCalls = [];
    let pcLiteralLoads = 0;
    for (let offset = 0; offset < bytes.length; offset += 4) {
      const word = bytes.readUInt32LE(offset);
      if ((word & 0x0ffffff0) === 0x012fff30) indirectCalls.push({ offset, register: `r${word & 0xf}` });
      if ((word & 0x0e000000) === 0x0a000000 && !config.directTransferOffsets.includes(offset)) {
        const target = offset + 8 + (signed24(word & 0x00ffffff) << 2);
        if (target >= 0 && target < template.bodySize) localTargets.push(target);
      }
      if ((word & 0x0c100000) === 0x04100000 && ((word >>> 16) & 0xf) === 15) pcLiteralLoads += 1;
    }
    same([...new Set(localTargets)].sort((a, b) => a - b), config.internalLabelOffsets, `${fn.name} object local-branch destinations`);
    same(indirectCalls, [{ offset: 164, register: "r1" }, { offset: 204, register: "r1" }], `${fn.name} object indirect calls`);
    same(pcLiteralLoads, template.ownedLiteralCount, `${fn.name} object literal loads`);

    const functionRelocations = elf.relocations
      .filter(({ targetSection, offset }) => targetSection === symbol.shndx && offset >= start && offset < start + symbol.size)
      .map(({ offset, type, symbol: relocationSymbol }) => ({ offset: offset - start, type, symbol: relocationSymbol }));
    same(functionRelocations, fn.directTransfers.map(({ offset, symbol: relocationSymbol }) => ({ offset, type: 28, symbol: relocationSymbol })), `${fn.name} ordered R_ARM_CALL relocations`);
  }
}

const { objectPath, readelf } = parseArgs(process.argv.slice(2));
validateConfiguration();
validateSource();
if (objectPath) validateObject(resolve(objectPath), readelf);
console.log(`validated arm duplicate templates 65 (${objectPath ? "source + combined object" : "source only"})`);
