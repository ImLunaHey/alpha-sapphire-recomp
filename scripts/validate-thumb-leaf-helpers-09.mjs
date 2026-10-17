#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_FILE_SIZE = 64 * 1024 * 1024;
const MAX_OBJECT_SIZE = 16 * 1024 * 1024;
const MAX_SECTION_SIZE = 16 * 1024 * 1024;
const MAX_SECTION_COUNT = 16384;
const MAX_SYMBOL_COUNT = 1000000;
const MAX_RELOCATION_COUNT = 1000000;
const MAX_TOOL_OUTPUT = 16 * 1024 * 1024;
const TOOL_PREFIX =
  "/nix/store/3y7lyg1ykgxhlb9sa5iy0gb8hnshb302-gcc-arm-embedded-15.2.rel1/bin/arm-none-eabi-";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/thumb-leaf-helpers-09.json");

function fail(message) {
  throw new Error(message);
}

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

function checkedFile(path, limit = MAX_FILE_SIZE) {
  let st;
  try {
    st = statSync(path);
  } catch {
    fail(`cannot read ${path}`);
  }
  if (!st.isFile()) fail(`not a regular file: ${path}`);
  if (st.size > limit) fail(`file exceeds ${limit} byte cap: ${path}`);
  return readFileSync(path);
}

function tool(name) {
  const fixed = TOOL_PREFIX + name;
  return existsSync(fixed) ? fixed : "arm-none-eabi-" + name;
}

function run(program, args, options = {}) {
  const result = spawnSync(program, args, {
    encoding: "utf8",
    maxBuffer: MAX_TOOL_OUTPUT,
    timeout: 30000,
    ...options,
  });
  if (result.error) fail(`${program}: ${result.error.message}`);
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    fail(`${program} failed${detail ? `: ${detail}` : ""}`);
  }
  return result.stdout;
}

// A deliberately small, bounded ELF32 reader. It is generic so hostile inputs
// are rejected before they are passed to binutils.
function parseElf(path) {
  const b = checkedFile(path, MAX_OBJECT_SIZE);
  const need = (offset, size, what) => {
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) ||
        offset < 0 || size < 0 || offset + size > b.length) {
      fail(`ELF bounds error in ${what}`);
    }
  };
  need(0, 52, "header");
  if (b[0] !== 0x7f || b.toString("ascii", 1, 4) !== "ELF")
    fail("object is not ELF");
  if (b[4] !== 1 || b[5] !== 1 || b[6] !== 1)
    fail("expected ELF32 little-endian version 1");
  if (b.readUInt16LE(16) !== 1 || b.readUInt16LE(18) !== 40)
    fail("expected an ARM relocatable object");
  const shoff = b.readUInt32LE(32);
  const shentsize = b.readUInt16LE(46);
  const shnum = b.readUInt16LE(48);
  const shstrndx = b.readUInt16LE(50);
  if (shentsize !== 40) fail("unexpected ELF section-header size");
  if (shnum === 0 || shnum > MAX_SECTION_COUNT)
    fail("invalid or excessive ELF section count");
  if (shstrndx >= shnum) fail("invalid section-name string table");
  need(shoff, shnum * shentsize, "section headers");

  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * shentsize;
    const section = {
      index: i,
      nameOffset: b.readUInt32LE(o),
      type: b.readUInt32LE(o + 4),
      flags: b.readUInt32LE(o + 8),
      addr: b.readUInt32LE(o + 12),
      offset: b.readUInt32LE(o + 16),
      size: b.readUInt32LE(o + 20),
      link: b.readUInt32LE(o + 24),
      info: b.readUInt32LE(o + 28),
      align: b.readUInt32LE(o + 32),
      entsize: b.readUInt32LE(o + 36),
    };
    if ((section.flags & 4) !== 0 && section.size > MAX_SECTION_SIZE)
      fail(`executable ELF section ${i} exceeds 16 MiB cap`);
    if (section.type !== 8) need(section.offset, section.size, `section ${i}`);
    sections.push(section);
  }

  const stringAt = (section, offset, what) => {
    if (!section || section.type !== 3 || offset >= section.size)
      fail(`invalid string-table reference in ${what}`);
    const start = section.offset + offset;
    const limit = section.offset + section.size;
    const end = b.indexOf(0, start);
    if (end < start || end >= limit) fail(`unterminated string in ${what}`);
    return b.toString("utf8", start, end);
  };
  const shstr = sections[shstrndx];
  for (const section of sections)
    section.name = stringAt(shstr, section.nameOffset, "section name");
  const executableSize = sections.reduce(
    (total, section) => total + ((section.flags & 4) !== 0 ? section.size : 0), 0);
  if (executableSize > MAX_SECTION_SIZE)
    fail("executable sections exceed 16 MiB cap");

  const symbols = [];
  const symbolsByTable = new Map();
  const symbolTables = sections.filter((s) => s.type === 2);
  for (const tab of symbolTables) {
    if (tab.entsize !== 16 || tab.size % 16 !== 0 || tab.link >= shnum)
      fail("malformed ELF symbol table");
    const strings = sections[tab.link];
    const tableSymbols = [];
    for (let i = 0; i < tab.size / 16; i++) {
      const o = tab.offset + i * 16;
      const symbol = {
        table: tab.index,
        index: i,
        nameOffset: b.readUInt32LE(o),
        value: b.readUInt32LE(o + 4),
        size: b.readUInt32LE(o + 8),
        info: b[o + 12],
        other: b[o + 13],
        shndx: b.readUInt16LE(o + 14),
      };
      symbol.name = stringAt(strings, symbol.nameOffset, "symbol name");
      symbols.push(symbol);
      tableSymbols.push(symbol);
      if (symbols.length > MAX_SYMBOL_COUNT)
        fail("excessive ELF symbol count");
    }
    symbolsByTable.set(tab.index, tableSymbols);
  }

  const relocations = [];
  for (const rel of sections.filter((s) => s.type === 9)) {
    if (rel.entsize !== 8 || rel.size % 8 !== 0 ||
        rel.link >= shnum || rel.info >= shnum)
      fail("malformed ELF relocation section");
    const table = sections[rel.link];
    if (table.type !== 2) fail("relocation does not link a symbol table");
    const tableSymbols = symbolsByTable.get(table.index);
    for (let i = 0; i < rel.size / 8; i++) {
      const o = rel.offset + i * 8;
      const info = b.readUInt32LE(o + 4);
      const symbol = tableSymbols[info >>> 8];
      if (!symbol) fail("relocation has an invalid symbol index");
      relocations.push({
        section: rel.info,
        offset: b.readUInt32LE(o),
        type: info & 0xff,
        symbol,
      });
      if (relocations.length > MAX_RELOCATION_COUNT)
        fail("excessive ELF relocation count");
    }
  }
  if (sections.some((s) => s.type === 4))
    fail("RELA relocations are not supported for this ARM object");

  return {
    bytes: b,
    sections,
    symbols,
    relocations,
    sectionBytes(section) {
      return b.subarray(section.offset, section.offset + section.size);
    },
  };
}

function canonicalHashes(config) {
  const records = [];
  const locals = [];
  const returns = [];
  const indirectCalls = [];
  const indirectTails = [];
  for (const f of config.functions) {
    let offset = 0;
    for (const instruction of f.schedule.split("|")) {
      const space = instruction.indexOf(" ");
      const mnemonic = space < 0 ? instruction : instruction.slice(0, space);
      let operands = space < 0 ? "" : instruction.slice(space + 1);
      operands = operands.replace(/^local:/, "local:");
      records.push(`${f.name}:${offset.toString(16)}:${mnemonic}:${operands}`);
      offset += f.wideInstructionOffsets.includes(offset) ? 4 : 2;
    }
    for (const item of f.localTransfers) {
      const [at, mnemonic, target] = item.split(":");
      locals.push(`${f.name}:${at}:${mnemonic}:local:${target}`);
    }
    for (const item of f.returns) returns.push(`${f.name}:${item}`);
    for (const item of f.indirectCalls) indirectCalls.push(`${f.name}:${item}`);
    for (const item of f.indirectTails) indirectTails.push(`${f.name}:${item}`);
  }
  const calls = config.directCalls.map((x) =>
    `${x.function}:${x.offset.toString(16)}:${x.mnemonic}:${x.symbol}:${x.targetMode}:${x.relocation}`);
  const actual = {
    instructionSchedule: sha256(records.join("\n")),
    localTransferSchedule: sha256(locals.join("\n")),
    returnTransferSchedule: sha256(returns.join("\n")),
    indirectCallSchedule: sha256(indirectCalls.join("\n")),
    indirectTailSchedule: sha256(indirectTails.join("\n")),
    directCallSchedule: sha256(calls.join("\n")),
  };
  for (const [key, value] of Object.entries(actual))
    if (config.canonicalHashes[key] !== value)
      fail(`configuration canonical hash mismatch: ${key}`);
}

function validateConfigShape(config) {
  if (config.schemaVersion !== 1 || config.mode !== "thumb" ||
      config.minimumAlignment !== 2 || config.totalAdjacentSize !== 0 ||
      !Array.isArray(config.functions) || config.functions.length !== 24 ||
      !Array.isArray(config.pcRelativeDataAccesses) ||
      config.pcRelativeDataAccesses.length !== 42 ||
      !Array.isArray(config.duplicateBodyClasses) ||
      config.duplicateBodyClasses.length !== 0)
    fail("configuration batch shape mismatch");
  const sums = {
    size: 0, instructions: 0, wide: 0, local: 0, memory: 0,
    returns: 0, indirectCalls: 0, indirectTails: 0, directCalls: 0,
  };
  const flattenedCalls = [];
  const functionNames = new Set();
  const scheduledInstructions = new Map();
  for (const f of config.functions) {
    if (!/^func_[0-9A-F]{8}$/.test(f.name) || functionNames.has(f.name))
      fail(`invalid or duplicate configured function: ${f.name}`);
    functionNames.add(f.name);
    const instructions = f.schedule.split("|");
    let offset = 0;
    for (const instruction of instructions) {
      if (!instruction) fail(`empty schedule entry in ${f.name}`);
      scheduledInstructions.set(`${f.name}:${offset}`, instruction);
      offset += f.wideInstructionOffsets.includes(offset) ? 4 : 2;
    }
    if (offset !== f.size || instructions.length !== f.instructionCount ||
        f.localTransfers.length !== f.localBranchCount ||
        f.returns.length !== f.returnCount ||
        f.indirectCalls.length !== f.indirectCallCount ||
        f.indirectTails.length !== f.indirectTailCount ||
        f.directCalls.length !== f.directCallCount)
      fail(`configuration function totals mismatch in ${f.name}`);
    sums.size += f.size;
    sums.instructions += f.instructionCount;
    sums.wide += f.wideInstructionOffsets.length;
    sums.local += f.localBranchCount;
    sums.memory += f.memoryOperationCount;
    sums.returns += f.returnCount;
    sums.indirectCalls += f.indirectCallCount;
    sums.indirectTails += f.indirectTailCount;
    sums.directCalls += f.directCallCount;
    for (const call of f.directCalls)
      flattenedCalls.push({ function: f.name, ...call });
  }
  const expected = [
    ["size", "totalBodySize"],
    ["instructions", "expectedInstructionCount"],
    ["wide", "wideInstructionCount"],
    ["local", "localBranchCount"],
    ["memory", "memoryOperationCount"],
    ["returns", "returnCount"],
    ["indirectCalls", "indirectCallCount"],
    ["indirectTails", "indirectTailCount"],
    ["directCalls", "directCallCount"],
  ];
  for (const [sum, field] of expected)
    if (sums[sum] !== config[field]) fail(`configuration total mismatch: ${field}`);
  const duplicateMembers = new Set();
  for (const duplicateClass of config.duplicateBodyClasses) {
    if (!Array.isArray(duplicateClass.members) || duplicateClass.members.length < 2)
      fail("invalid duplicate-body class");
    for (const member of duplicateClass.members) {
      if (!functionNames.has(member) || duplicateMembers.has(member))
        fail(`invalid or repeated duplicate-body member: ${member}`);
      duplicateMembers.add(member);
    }
    const members = duplicateClass.members.map((name) =>
      config.functions.find((f) => f.name === name));
    if (members.some((f) => f.size !== members[0].size))
      fail("duplicate-body class has inconsistent body sizes");
  }
  if (JSON.stringify(flattenedCalls) !== JSON.stringify(config.directCalls) ||
      JSON.stringify(config.relocations) !== JSON.stringify(config.directCalls.map(
        ({ function: functionName, offset, symbol, relocation }) =>
          ({ function: functionName, offset, type: relocation, symbol }))))
    fail("configuration direct-call inventory mismatch");
  const pcSites = new Set();
  for (const access of config.pcRelativeDataAccesses) {
    const site = `${access.function}:${access.offset}`;
    const instruction = scheduledInstructions.get(site);
    const scheduleMnemonic = access.mnemonic === "adr" ? "add" : access.mnemonic;
    if (!functionNames.has(access.function) || pcSites.has(site) ||
        !instruction?.startsWith(`${scheduleMnemonic} `) ||
        !["ldr", "adr"].includes(access.mnemonic) ||
        ![0, 2].includes(access.requiredEntryModulo4) ||
        access.ownership !== "unowned-post-body")
      fail(`invalid or duplicate PC-relative access contract: ${site}`);
    pcSites.add(site);
  }
}

function parseArguments(argv, config) {
  let source = join(root, config.source);
  let object = null;
  let sourceOnly = false;
  let selfTest = false;
  let selfTestOnly = false;
  let positional = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--object") {
      if (++i >= argv.length || object) fail("usage: validator [source|object] [--object object] [--source-only]");
      object = resolve(argv[i]);
    } else if (arg === "--source-only") {
      sourceOnly = true;
    } else if (arg === "--self-test") {
      selfTest = true;
    } else if (arg === "--self-test-only") {
      selfTestOnly = true;
    } else if (arg.startsWith("-") || positional) {
      fail("usage: validator [source|object] [--object object] [--source-only]");
    } else {
      positional = resolve(arg);
    }
  }
  if (positional) {
    const head = checkedFile(positional).subarray(0, 4);
    if (head.length === 4 && head[0] === 0x7f && head.toString("ascii", 1) === "ELF") {
      if (object) fail("object supplied twice");
      object = positional;
    } else {
      source = positional;
    }
  }
  if ((sourceOnly && object) || (selfTestOnly && (sourceOnly || object || positional)))
    fail("invalid validator option combination");
  return { source, object, sourceOnly, selfTest, selfTestOnly };
}

function normalize(text) {
  return text.replace(/\s*@.*$/, "").trim().replace(/\s+/g, " ").replace(/,\s*/g, ", ");
}

function signExtend(value, bits) {
  const sign = 2 ** (bits - 1);
  return value >= sign ? value - 2 ** bits : value;
}

function validateThumbMapping(elf, section, functionName) {
  const mappings = elf.symbols
    .filter((symbol) => symbol.shndx === section.index && /^\$[atd](?:\.|$)/.test(symbol.name))
    .sort((a, b) => a.value - b.value || a.index - b.index);
  const atStart = mappings.filter((symbol) => symbol.value === 0);
  if (atStart.length === 0 || atStart.some((symbol) => !/^\$t(?:\.|$)/.test(symbol.name)))
    fail(`${functionName} does not begin under an unambiguous Thumb mapping symbol`);
  const interior = mappings.find((symbol) =>
    symbol.value > 0 && symbol.value < section.size && !/^\$t(?:\.|$)/.test(symbol.name));
  if (interior)
    fail(`non-Thumb mapping symbol ${interior.name} in ${functionName}+0x${interior.value.toString(16)}`);
}

function disassemblySchedule(objectPath, functionConfig) {
  const sectionName = `.text.${functionConfig.name}`;
  const output = run(tool("objdump"), [
    "-d", "-M", "force-thumb", "-j", sectionName, objectPath,
  ]);
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+((?:[0-9a-fA-F]{4}\s+)+)\s*([a-z][a-z0-9.]*)\s*(.*?)\s*$/);
    if (!match) continue;
    const offset = Number.parseInt(match[1], 16);
    const words = match[2].trim().split(/\s+/);
    let operands = match[4].replace(/\s*@.*$/, "");
    const direct = functionConfig.directCalls.find((x) => x.offset === offset);
    const local = functionConfig.localTransfers.find((x) =>
      Number.parseInt(x.split(":")[0], 16) === offset);
    if (direct) operands = direct.symbol;
    else if (local) operands = "local" + local.slice(local.lastIndexOf(":+"));
    instructions.push({
      offset,
      width: words.length * 2,
      text: normalize(match[3] + (operands ? " " + operands : "")),
    });
  }
  return instructions;
}

function validateObject(objectPath, referencePath, config) {
  const elf = parseElf(objectPath);
  const reference = parseElf(referencePath);
  const owned = new Set(config.functions.map((f) => `.text.${f.name}`));
  const bodies = new Map();
  let relocationCount = 0;

  for (const f of config.functions) {
    const sectionName = `.text.${f.name}`;
    const sections = elf.sections.filter((s) => s.name === sectionName);
    if (sections.length !== 1) fail(`expected exactly one section ${sectionName}`);
    const section = sections[0];
    if (section.type !== 1 || (section.flags & 0x6) !== 0x6 ||
        section.size !== f.size || section.align !== config.minimumAlignment)
      fail(`section contract mismatch for ${sectionName}`);

    const symbols = elf.symbols.filter((s) => s.name === f.name);
    if (symbols.length !== 1) fail(`expected exactly one symbol ${f.name}`);
    const symbol = symbols[0];
    if ((symbol.info >>> 4) !== 1 || (symbol.info & 0xf) !== 2 ||
        symbol.shndx !== section.index || symbol.value !== 1 ||
        symbol.size !== f.size)
      fail(`global Thumb symbol contract mismatch for ${f.name}`);
    validateThumbMapping(elf, section, f.name);

    const refSection = reference.sections.find((s) => s.name === sectionName);
    if (!refSection) fail(`reference section missing: ${sectionName}`);
    if (!elf.sectionBytes(section).equals(reference.sectionBytes(refSection)))
      fail(`instruction bytes differ in ${f.name}`);
    bodies.set(f.name, elf.sectionBytes(section));

    for (const transfer of f.localTransfers) {
      const [offsetText, mnemonic, targetText] = transfer.split(":");
      const offset = Number.parseInt(offsetText, 16);
      const expectedTarget = Number.parseInt(targetText.slice(1), 16);
      const insn = bodies.get(f.name).readUInt16LE(offset);
      let actualTarget;
      if (mnemonic === "b.n" && (insn & 0xf800) === 0xe000) {
        actualTarget = offset + 4 + signExtend((insn & 0x7ff) << 1, 12);
      } else if (mnemonic !== "b.n" && (insn & 0xf000) === 0xd000 &&
                 (insn & 0x0f00) < 0x0e00) {
        actualTarget = offset + 4 + signExtend((insn & 0xff) << 1, 9);
      } else {
        fail(`local branch encoding mismatch in ${f.name}+${offsetText}`);
      }
      if (actualTarget !== expectedTarget)
        fail(`local branch target mismatch in ${f.name}+${offsetText}`);
    }

    const actualRelocs = elf.relocations
      .filter((r) => r.section === section.index)
      .sort((a, b) => a.offset - b.offset);
    const expectedRelocs = f.directCalls.slice().sort((a, b) => a.offset - b.offset);
    if (actualRelocs.length !== expectedRelocs.length)
      fail(`relocation count mismatch in ${f.name}`);
    for (let i = 0; i < expectedRelocs.length; i++) {
      const a = actualRelocs[i];
      const e = expectedRelocs[i];
      if (a.offset !== e.offset || a.type !== 10 || a.symbol.name !== e.symbol)
        fail(`relocation mismatch in ${f.name} at index ${i}`);
      const bytes = elf.sectionBytes(section);
      const second = bytes.readUInt16LE(e.offset + 2);
      const callBits = second & 0xf800;
      if ((e.targetMode === "thumb" && (e.mnemonic !== "bl" || callBits !== 0xf800)) ||
          (e.targetMode === "arm" && (e.mnemonic !== "blx" || callBits !== 0xe800)))
        fail(`call mode mismatch in ${f.name}+${e.offset.toString(16)}`);
    }
    relocationCount += actualRelocs.length;

    const disassembled = disassemblySchedule(objectPath, f);
    const expected = f.schedule.split("|");
    if (disassembled.length !== expected.length)
      fail(`instruction count mismatch in ${f.name}`);
    for (let i = 0; i < expected.length; i++) {
      const d = disassembled[i];
      const expectedWidth = f.wideInstructionOffsets.includes(d.offset) ? 4 : 2;
      if (d.width !== expectedWidth || d.text !== normalize(expected[i]))
        fail(`schedule mismatch in ${f.name}+${d.offset.toString(16)}: ${d.text}`);
    }
  }
  if (relocationCount !== config.directCallCount)
    fail("total direct-call relocation count mismatch");

  // The manifest is a closed partition of every selected whole-body byte
  // collision. An empty inventory therefore enforces singleton bodies.
  const classKey = (members) => members.slice().sort().join("\0");
  const actualClasses = new Map();
  for (const f of config.functions) {
    // Unresolved call immediates are placeholders in ET_REL. Include their
    // symbolic relocation identity so this key represents the eventual body.
    const callIdentity = f.directCalls.map((call) =>
      `${call.offset}:${call.mnemonic}:${call.symbol}:${call.targetMode}`).join("|");
    // ET_REL call immediates are only placeholders: two sections with the
    // same symbolic calls can still have distinct linked bodies because the
    // relocation calculation includes each call site's place.  Keep such
    // sections distinct here; byte-only sections remain directly comparable.
    const linkedPlaceIdentity = f.directCalls.length ? `\0${f.name}` : "";
    const digest = sha256(Buffer.concat([
      bodies.get(f.name), Buffer.from(`\0${callIdentity}${linkedPlaceIdentity}`, "utf8"),
    ]));
    if (!actualClasses.has(digest)) actualClasses.set(digest, []);
    actualClasses.get(digest).push(f.name);
  }
  const actualDuplicates = new Set([...actualClasses.values()]
    .filter((members) => members.length > 1).map(classKey));
  const expectedDuplicates = new Set(config.duplicateBodyClasses
    .map((duplicateClass) => classKey(duplicateClass.members)));
  if (actualDuplicates.size !== expectedDuplicates.size ||
      [...actualDuplicates].some((key) => !expectedDuplicates.has(key)))
    fail("duplicate-body classes do not match the configuration");

  const expectedNames = new Set(config.functions.map((f) => f.name));
  for (const symbol of elf.symbols) {
    const section = elf.sections[symbol.shndx];
    if (section && owned.has(section.name) && (symbol.info >>> 4) !== 0 &&
        !expectedNames.has(symbol.name))
      fail(`unexpected global symbol in owned section: ${symbol.name}`);
  }

  for (const access of config.pcRelativeDataAccesses) {
    const f = config.functions.find((x) => x.name === access.function);
    const section = elf.sections.find((s) => s.name === `.text.${f.name}`);
    const bytes = elf.sectionBytes(section);
    const insn = bytes.readUInt16LE(access.offset);
    const residue = access.requiredEntryModulo4;
    const base = ((residue + access.offset + 4) & ~3) - residue;
    let target;
    if (access.mnemonic === "ldr" && (insn & 0xf800) === 0x4800)
      target = base + (insn & 0xff) * 4;
    else if (access.mnemonic === "adr" && (insn & 0xf800) === 0xa000)
      target = base + (insn & 0xff) * 4;
    else fail(`PC-relative opcode mismatch in ${access.function}`);
    if (target !== access.targetOffset || ![0, 2].includes(residue) ||
        access.ownership !== "unowned-post-body" || target < f.size)
      fail(`PC-relative target contract mismatch in ${access.function}`);
  }

  // Relocations in unrelated composite-object sections are intentionally
  // accepted. Relocations attached to any owned section were checked above.
  for (const relocation of elf.relocations) {
    const section = elf.sections[relocation.section];
    if (owned.has(section.name) && relocation.type !== 10)
      fail(`unexpected relocation in ${section.name}`);
  }

}

function validateSourceOwnership(referencePath, config) {
  const elf = parseElf(referencePath);
  const owned = new Set(config.functions.map((f) => `.text.${f.name}`));
  for (const section of elf.sections) {
    if ((section.flags & 4) !== 0 && section.size !== 0 && !owned.has(section.name))
      fail(`source owns unexpected executable section: ${section.name}`);
    if ((section.flags & 2) !== 0 && section.size !== 0 && !owned.has(section.name))
      fail(`source owns unexpected allocated data section: ${section.name}`);
  }
  const expected = new Set(config.functions.map((f) => f.name));
  for (const symbol of elf.symbols) {
    if (symbol.shndx !== 0 && (symbol.info >>> 4) !== 0 &&
        (symbol.info & 0xf) === 2 && !expected.has(symbol.name))
      fail(`source defines unexpected global function: ${symbol.name}`);
  }
}

function syntheticElf(sectionCount, executableSize = 0) {
  const tableSize = sectionCount * 40;
  const bytes = Buffer.alloc(52 + tableSize + 1);
  bytes.write("\x7fELF", 0, "binary");
  bytes[4] = 1;
  bytes[5] = 1;
  bytes[6] = 1;
  bytes.writeUInt16LE(1, 16);
  bytes.writeUInt16LE(40, 18);
  bytes.writeUInt32LE(1, 20);
  bytes.writeUInt32LE(52, 32);
  bytes.writeUInt16LE(52, 40);
  bytes.writeUInt16LE(40, 46);
  bytes.writeUInt16LE(sectionCount, 48);
  bytes.writeUInt16LE(sectionCount - 1, 50);
  if (executableSize) {
    const executable = 52 + 40;
    bytes.writeUInt32LE(8, executable + 4);
    bytes.writeUInt32LE(6, executable + 8);
    bytes.writeUInt32LE(executableSize, executable + 20);
    bytes.writeUInt32LE(1, executable + 32);
  }
  const strings = 52 + (sectionCount - 1) * 40;
  bytes.writeUInt32LE(3, strings + 4);
  bytes.writeUInt32LE(52 + tableSize, strings + 16);
  bytes.writeUInt32LE(1, strings + 20);
  bytes.writeUInt32LE(1, strings + 32);
  return bytes;
}

function parserSelfTest() {
  const directory = mkdtempSync(join(tmpdir(), "thumb-leaf-helpers-09-parser-"));
  try {
    const valid = join(directory, "valid.o");
    writeFileSync(valid, syntheticElf(MAX_SECTION_COUNT));
    if (parseElf(valid).sections.length !== MAX_SECTION_COUNT)
      fail("maximum-section-count ELF was not accepted");
    const hostile = [
      syntheticElf(MAX_SECTION_COUNT + 1),
      syntheticElf(3, MAX_SECTION_SIZE + 1),
      Buffer.alloc(MAX_FILE_SIZE + 1),
      Buffer.from("not ELF"),
    ];
    let rejected = 0;
    for (let i = 0; i < hostile.length; i++) {
      const path = join(directory, `hostile-${i}.o`);
      writeFileSync(path, hostile[i]);
      try {
        parseElf(path);
      } catch {
        rejected++;
      }
    }
    if (rejected !== hostile.length)
      fail("hostile ELF parser self-test did not reject every corrupt or over-limit input");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function foreignCompositeSelfTest(referencePath, config) {
  const directory = mkdtempSync(join(tmpdir(), "thumb-leaf-helpers-09-composite-"));
  try {
    const source = join(directory, "foreign.S");
    const foreign = join(directory, "foreign.o");
    const combined = join(directory, "combined.o");
    const lines = [
      ".syntax unified", ".arch armv6k", ".arm",
      '.section .text.thumb_leaf09_foreign,"ax",%progbits',
      ".global thumb_leaf09_foreign", ".type thumb_leaf09_foreign,%function",
      "thumb_leaf09_foreign:", " bl thumb_leaf09_undefined", " bx lr",
      ".size thumb_leaf09_foreign,.-thumb_leaf09_foreign",
    ];
    for (let i = 0; i < 12050; i++)
      lines.push(`.section .thumb_leaf09_foreign.${i},"",%progbits`, `.byte ${i & 0xff}`);
    writeFileSync(source, `${lines.join("\n")}\n`);
    run(tool("as"), ["-march=armv6k", "-o", foreign, source]);
    run(tool("ld"), ["-r", "-o", combined, referencePath, foreign]);
    const parsed = parseElf(combined);
    if (parsed.sections.length < 12000)
      fail("valid high-section-count foreign composite test was ineffective");
    const section = parsed.sections.find((item) => item.name === ".text.thumb_leaf09_foreign");
    if (!section || !parsed.relocations.some((item) => item.section === section.index))
      fail("foreign composite lacks its unrelated relocation");
    validateObject(combined, referencePath, config);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function hostileMappingSelfTest(referencePath, config) {
  const directory = mkdtempSync(join(tmpdir(), "thumb-leaf-helpers-09-mapping-"));
  try {
    const hostile = join(directory, "interior-data-mapping.o");
    const first = config.functions[0];
    run(tool("objcopy"), [
      "--add-symbol", `$d.hostile=.text.${first.name}:2,local`, referencePath, hostile,
    ]);
    let rejected = false;
    try {
      validateObject(hostile, referencePath, config);
    } catch (error) {
      if (/non-Thumb mapping symbol/.test(error.message)) rejected = true;
      else throw error;
    }
    if (!rejected) fail("interior non-Thumb mapping injection was accepted");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

let temp = null;
try {
  const config = JSON.parse(checkedFile(configPath).toString("utf8"));
  validateConfigShape(config);
  canonicalHashes(config);
  const args = parseArguments(process.argv.slice(2), config);
  if (args.selfTest || args.selfTestOnly) parserSelfTest();
  if (args.selfTestOnly) {
    console.log("validated hostile ELF rejection and the 16,384-section parser boundary");
    process.exit(0);
  }
  const source = checkedFile(args.source);
  if (sha256(source) !== config.sourceSha256)
    fail("source SHA-256 does not match configuration");

  temp = mkdtempSync(join(tmpdir(), "thumb-leaf-helpers-09-"));
  const referencePath = join(temp, "reference.o");
  run(tool("as"), [
    "-march=armv6k", "-mthumb", "-o", referencePath, args.source,
  ]);
  validateSourceOwnership(referencePath, config);
  if (args.sourceOnly) {
    console.log(`validated ${config.functions.length} Thumb source functions and source SHA-256`);
    process.exit(0);
  }
  const objectPath = args.object || referencePath;
  validateObject(objectPath, referencePath, config);
  if (args.selfTest) {
    hostileMappingSelfTest(referencePath, config);
    foreignCompositeSelfTest(referencePath, config);
  }
  console.log(`validated ${config.functions.length} Thumb functions, ${config.totalBodySize} bytes, ${config.localBranchCount} local branches, ${config.directCallCount} direct calls, ${config.indirectCallCount} indirect calls, ${config.memoryOperationCount} memory operations, ${config.returnCount} returns, and ${config.pcRelativeDataAccesses.length} unowned PC-relative targets${args.selfTest ? "; hostile inputs and interior non-Thumb mapping rejected; unrelated 12k-section composite accepted" : ""}`);
} catch (error) {
  console.error(`validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temp) rmSync(temp, { recursive: true, force: true });
}
