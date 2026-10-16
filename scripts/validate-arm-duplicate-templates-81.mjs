#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "config/arm-duplicate-templates-81.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const sourcePath = path.join(root, config.source);
const fail = message => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const recordsHash = records => hash(`${records.join("\n")}\n`);

function validateConfig() {
  assert(config.version === 1 && config.mode === "arm", "unsupported configuration");
  assert(config.source === "src/main/arm_duplicate_templates_81.S", "unexpected source path");
  assert(config.functions.length === 24, "expected 24 functions");
  assert(Object.keys(config.templates).length === 12, "expected 12 templates");
  const names = new Set(config.functions.map(f => f.name));
  assert(names.size === 24, "function names must be unique");

  let bodyBytes = 0, ownedBytes = 0, instructionCount = 0;
  let directCount = 0, localCount = 0, indirectCalls = 0;
  let indirectTails = 0, returns = 0, slotCount = 0, loadCount = 0;
  const instructionRecords = [], localRecords = [], relocationRecords = [], literalRecords = [];
  const templateMembers = new Map();
  const destinationCounts = new Map();

  for (const f of config.functions) {
    const t = config.templates[f.template];
    assert(t, `${f.name}: unknown template`);
    const members = templateMembers.get(f.template) ?? [];
    members.push(f);
    templateMembers.set(f.template, members);
    assert(t.bodySize === t.instructionCount * 4, `${f.template}: body/instruction mismatch`);
    assert(t.instructions.length === t.instructionCount, `${f.template}: instruction schedule mismatch`);
    assert(f.internalLabelOffsets.length === t.internalLabels, `${f.name}: internal-label count mismatch`);
    assert(f.directTransfers.length === t.directTransfers, `${f.name}: direct-transfer count mismatch`);
    assert(f.localTransfers.length >= t.internalLabels, `${f.name}: too few local transfers`);
    assert((f.indirectCalls ?? []).length === t.indirectCalls, `${f.name}: indirect-call count mismatch`);
    assert((f.indirectTailTransfers ?? []).length === t.indirectTailTransfers, `${f.name}: indirect-tail count mismatch`);
    assert(f.literals.length === t.poolSlots, `${f.name}: literal-slot count mismatch`);
    assert(f.nextGlobalOffset >= t.bodySize, `${f.name}: next global overlaps body`);

    const roleMap = new Map();
    for (const transfer of f.directTransfers) {
      assert(!roleMap.has(transfer.role) || roleMap.get(transfer.role) === transfer.symbol,
        `${f.name}: inconsistent direct-transfer role`);
      roleMap.set(transfer.role, transfer.symbol);
    }
    t.instructions.forEach((instruction, index) => {
      const resolved = instruction.replace(/\{([^}]+)\}/g, (token, role) =>
        roleMap.has(role) ? roleMap.get(role) : token);
      instructionRecords.push(`${f.name}|${index * 4}|${resolved}`);
    });
    for (const x of f.localTransfers) {
      assert(x.offset % 4 === 0 && x.offset < t.bodySize, `${f.name}: invalid local-transfer offset`);
      assert(f.internalLabelOffsets.includes(x.targetOffset), `${f.name}: undeclared local target`);
      localRecords.push(`${f.name}|${x.offset}|${x.mnemonic}|local:+${x.targetOffset}`);
    }
    for (const x of f.directTransfers) {
      assert(x.offset % 4 === 0 && x.offset < t.bodySize, `${f.name}: invalid direct-transfer offset`);
      assert(["R_ARM_CALL", "R_ARM_JUMP24"].includes(x.kind), `${f.name}: invalid transfer relocation`);
      relocationRecords.push(`${f.name}|${x.offset}|${x.kind}|${x.mnemonic}|${x.symbol}`);
      destinationCounts.set(x.symbol, (destinationCounts.get(x.symbol) ?? 0) + 1);
    }
    let previousSlot = t.bodySize - 4;
    for (const literal of f.literals) {
      assert(config.literalIdentities[literal.identity], `${f.name}: unknown literal identity`);
      assert(literal.offset === previousSlot + 4, `${f.name}: non-contiguous or unordered literal slot`);
      assert(literal.loadOffset === literal.loadOffsets[0], `${f.name}: loadOffset compatibility mismatch`);
      assert(literal.loadOffsets.length > 0 && new Set(literal.loadOffsets).size === literal.loadOffsets.length,
        `${f.name}: invalid loadOffsets`);
      for (const loadOffset of literal.loadOffsets) {
        assert(loadOffset % 4 === 0 && loadOffset < t.bodySize, `${f.name}: invalid literal load site`);
        literalRecords.push(`${f.name}|${loadOffset}|${literal.offset}|${literal.identity}`);
      }
      const symbol = config.literalIdentities[literal.identity].symbol;
      relocationRecords.push(`${f.name}|${literal.offset}|R_ARM_ABS32|word|${symbol}`);
      previousSlot = literal.offset;
      loadCount += literal.loadOffsets.length;
    }
    const expectedOwned = t.bodySize + f.literals.length * 4;
    assert((f.templateMaterialEndOffset ?? t.bodySize - 1) === expectedOwned - 1,
      `${f.name}: template material boundary mismatch`);
    assert(f.nextGlobalOffset >= expectedOwned, `${f.name}: next global overlaps owned material`);
    bodyBytes += t.bodySize;
    ownedBytes += expectedOwned;
    instructionCount += t.instructionCount;
    directCount += f.directTransfers.length;
    localCount += f.localTransfers.length;
    indirectCalls += (f.indirectCalls ?? []).length;
    indirectTails += (f.indirectTailTransfers ?? []).length;
    returns += t.returns;
    slotCount += f.literals.length;
  }

  for (const [name, t] of Object.entries(config.templates)) {
    assert(templateMembers.get(name)?.length === t.count && t.count === 2, `${name}: expected a pair`);
  }
  assert(bodyBytes === 1288 && config.expectedBodyBytes === 1288, "body-byte total mismatch");
  assert(ownedBytes === 1376 && config.expectedOwnedBytes === 1376, "owned-byte total mismatch");
  assert(instructionCount === 322 && config.expectedInstructionCount === 322, "instruction total mismatch");
  assert(directCount === 36 && localCount === 32, "transfer totals mismatch");
  assert(indirectCalls === 4 && indirectTails === 2 && returns === 18, "indirect/return totals mismatch");
  assert(slotCount === 22 && loadCount === 28, "literal totals mismatch");

  const identitySymbols = Object.values(config.literalIdentities).map(x => x.symbol);
  assert(Object.keys(config.literalIdentities).length === 18 && new Set(identitySymbols).size === 18,
    "literal identity classes must be 18 distinct symbols");
  assert(config.literalIdentityContract.slotCount === 22 && config.literalIdentityContract.loadSiteCount === 28 &&
    config.literalIdentityContract.classCount === 18 && config.literalIdentityContract.newClassCount === 10 &&
    config.literalIdentityContract.reusedClassCount === 8, "literal identity contract mismatch");
  assert(config.newLiteralIdentities.length === 10 && new Set(config.newLiteralIdentities).size === 10,
    "new identity list mismatch");
  assert(config.reusedLiteralIdentities.length === 8 && new Set(config.reusedLiteralIdentities).size === 8,
    "reused identity list mismatch");
  assert(config.newLiteralIdentities.every(x => identitySymbols.includes(x)) &&
    config.reusedLiteralIdentities.every(x => identitySymbols.includes(x)) &&
    !config.newLiteralIdentities.some(x => config.reusedLiteralIdentities.includes(x)),
    "new/reused identity partition mismatch");

  const branch = config.branchIdentityContract;
  assert(branch.primaryEntries.length === 20 && new Set(branch.primaryEntries).size === 20,
    "branch identity class mismatch");
  assert(branch.thumbEntries.length === 1 && branch.thumbEntries[0] === "func_00302F52",
    "Thumb destination contract mismatch");
  assert(branch.secondaryEntries.length === 0 && branch.secondaryEntryRelations.length === 0,
    "secondary entries are forbidden");
  assert([...destinationCounts.keys()].every(x => branch.primaryEntries.includes(x)) &&
    branch.primaryEntries.every(x => destinationCounts.has(x)), "branch destination set mismatch");
  const shared = new Map(branch.sharedClasses.map(x => [x.symbol, x.siteCount]));
  assert(shared.size === 12 && branch.singletonClasses.length === 8, "shared/singleton branch classes mismatch");
  for (const [symbol, count] of destinationCounts) {
    assert(count === (shared.get(symbol) ?? 1), `${symbol}: branch site count mismatch`);
    assert(count > 1 ? shared.has(symbol) : branch.singletonClasses.includes(symbol),
      `${symbol}: branch class classification mismatch`);
  }

  const order = new Map(config.functions.map((f, i) => [f.name, i]));
  relocationRecords.sort((a, b) => {
    const aa = a.split("|"), bb = b.split("|");
    return order.get(aa[0]) - order.get(bb[0]) || Number(aa[1]) - Number(bb[1]);
  });
  const schedules = {
    instructionSchedule: instructionRecords,
    localTransferSchedule: localRecords,
    relocationSchedule: relocationRecords,
    literalIdentitySchedule: literalRecords,
  };
  for (const [key, records] of Object.entries(schedules)) {
    assert(recordsHash(records) === config.canonicalHashes[key], `${key} canonical hash mismatch`);
  }
  return { templateMembers, relocationRecords };
}

function checkedRange(buffer, offset, length, what) {
  assert(Number.isSafeInteger(offset) && Number.isSafeInteger(length) && offset >= 0 && length >= 0 &&
    offset + length <= buffer.length, `${what}: out of bounds`);
  return buffer.subarray(offset, offset + length);
}

function cString(buffer, offset, what) {
  assert(Number.isSafeInteger(offset) && offset >= 0 && offset < buffer.length, `${what}: bad string offset`);
  const end = buffer.indexOf(0, offset);
  assert(end !== -1, `${what}: unterminated string`);
  return buffer.toString("utf8", offset, end);
}

function parseElf(filename) {
  const data = fs.readFileSync(filename);
  assert(data.length >= 52 && data.length <= 64 * 1024 * 1024, `${filename}: unreasonable ELF size`);
  assert(data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])), `${filename}: not ELF`);
  assert(data[4] === 1 && data[5] === 1 && data[6] === 1, `${filename}: expected ELF32 little-endian v1`);
  assert(data.readUInt16LE(16) === 1 && data.readUInt16LE(18) === 40, `${filename}: expected ARM ET_REL`);
  assert(data.readUInt32LE(20) === 1, `${filename}: unsupported ELF version`);
  const shoff = data.readUInt32LE(32), shentsize = data.readUInt16LE(46);
  const shnum = data.readUInt16LE(48), shstrndx = data.readUInt16LE(50);
  assert(shentsize === 40 && shnum > 0 && shnum <= 0xffff && shstrndx < shnum, `${filename}: invalid section table`);
  checkedRange(data, shoff, shentsize * shnum, `${filename}: section table`);
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * 40;
    sections.push({ index: i, nameOffset: data.readUInt32LE(p), type: data.readUInt32LE(p + 4),
      flags: data.readUInt32LE(p + 8), offset: data.readUInt32LE(p + 16), size: data.readUInt32LE(p + 20),
      link: data.readUInt32LE(p + 24), info: data.readUInt32LE(p + 28),
      align: data.readUInt32LE(p + 32), entsize: data.readUInt32LE(p + 36) });
  }
  const shstr = sections[shstrndx];
  assert(shstr.type === 3, `${filename}: invalid section-name string table`);
  const shstrings = checkedRange(data, shstr.offset, shstr.size, `${filename}: section names`);
  const byName = new Map();
  for (const section of sections) {
    section.name = cString(shstrings, section.nameOffset, `${filename}: section name`);
    if (section.type !== 8) section.data = checkedRange(data, section.offset, section.size, `${filename}:${section.name}`);
    assert(!byName.has(section.name) || section.name === "", `${filename}: duplicate section ${section.name}`);
    if (section.name) byName.set(section.name, section);
  }
  const symbols = [], symbolsByName = new Map();
  for (const symtab of sections.filter(x => x.type === 2)) {
    assert(symtab.entsize === 16 && symtab.size % 16 === 0 && symtab.link < sections.length,
      `${filename}:${symtab.name}: invalid symbol table`);
    const strings = sections[symtab.link];
    assert(strings.type === 3, `${filename}:${symtab.name}: invalid linked string table`);
    for (let p = 0; p < symtab.size; p += 16) {
      const entry = symtab.offset + p;
      const symbol = { table: symtab.index, index: p / 16,
        name: cString(strings.data, data.readUInt32LE(entry), `${filename}: symbol name`),
        value: data.readUInt32LE(entry + 4), size: data.readUInt32LE(entry + 8), info: data[entry + 12],
        shndx: data.readUInt16LE(entry + 14) };
      symbols.push(symbol);
      if (symbol.name) {
        const list = symbolsByName.get(symbol.name) ?? [];
        list.push(symbol); symbolsByName.set(symbol.name, list);
      }
    }
  }
  const relocationsByTarget = new Map();
  for (const relsec of sections.filter(x => x.type === 9)) {
    assert(relsec.entsize === 8 && relsec.size % 8 === 0 && relsec.link < sections.length && relsec.info < sections.length,
      `${filename}:${relsec.name}: invalid REL section`);
    const tableSymbols = symbols.filter(x => x.table === relsec.link);
    const relocs = relocationsByTarget.get(relsec.info) ?? [];
    for (let p = 0; p < relsec.size; p += 8) {
      const entry = relsec.offset + p, info = data.readUInt32LE(entry + 4), symbolIndex = info >>> 8;
      const symbol = tableSymbols.find(x => x.index === symbolIndex);
      assert(symbol, `${filename}:${relsec.name}: bad relocation symbol`);
      relocs.push({ offset: data.readUInt32LE(entry), type: info & 0xff, symbol: symbol.name });
    }
    relocationsByTarget.set(relsec.info, relocs);
  }
  return { data, sections, byName, symbolsByName, relocationsByTarget };
}

function commandCandidates(kind) {
  const upper = kind.toUpperCase();
  const candidates = [process.env[`ARM_DUPLICATE_TEMPLATES_81_${upper}`], process.env[upper]];
  if (process.env.CROSS_COMPILE) candidates.push(`${process.env.CROSS_COMPILE}${kind}`);
  candidates.push(`arm-none-eabi-${kind}`, `arm-linux-gnueabi-${kind}`, `arm-linux-gnueabihf-${kind}`);
  return [...new Set(candidates.filter(Boolean))];
}

function findTool(kind) {
  for (const candidate of commandCandidates(kind)) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf8" });
    if (result.status === 0) return candidate;
  }
  fail(`unable to find ARM GNU ${kind}; set ${kind.toUpperCase()} or CROSS_COMPILE`);
}

function run(tool, args, what) {
  const result = spawnSync(tool, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  assert(!result.error && result.status === 0, `${what} failed: ${(result.stderr || result.error?.message || "").trim()}`);
  return result.stdout;
}

function sectionRelocations(elf, section) {
  return [...(elf.relocationsByTarget.get(section.index) ?? [])].sort((a, b) => a.offset - b.offset);
}

function validateObject(candidatePath, referencePath, objdump, state) {
  const candidate = parseElf(candidatePath), reference = parseElf(referencePath);
  const typeNumbers = { R_ARM_ABS32: 2, R_ARM_CALL: 28, R_ARM_JUMP24: 29 };
  for (const f of config.functions) {
    const sectionName = `.text.${f.name}`;
    const actual = candidate.byName.get(sectionName), expected = reference.byName.get(sectionName);
    assert(actual && expected, `${f.name}: missing owned section`);
    const owned = config.templates[f.template].bodySize + f.literals.length * 4;
    assert(actual.type === 1 && (actual.flags & 6) === 6 && actual.size === owned,
      `${f.name}: section type, flags, or owned boundary mismatch`);
    assert(actual.data.equals(expected.data), `${f.name}: section bytes differ`);
    const functionSymbols = candidate.symbolsByName.get(f.name) ?? [];
    const symbol = functionSymbols.find(x => x.shndx === actual.index && x.value === 0);
    assert(symbol && symbol.size === config.templates[f.template].bodySize && (symbol.info & 15) === 2 && (symbol.info >>> 4) === 1,
      `${f.name}: function symbol boundary/type mismatch`);
    const expectedRelocs = [
      ...f.directTransfers.map(x => ({ offset: x.offset, type: typeNumbers[x.kind], symbol: x.symbol })),
      ...f.literals.map(x => ({ offset: x.offset, type: 2, symbol: config.literalIdentities[x.identity].symbol })),
    ].sort((a, b) => a.offset - b.offset);
    assert(JSON.stringify(sectionRelocations(candidate, actual)) === JSON.stringify(expectedRelocs),
      `${f.name}: relocation schedule mismatch`);
    for (const transfer of f.localTransfers) {
      const word = actual.data.readUInt32LE(transfer.offset);
      assert(((word >>> 25) & 7) === 5 && ((word >>> 24) & 1) === 0,
        `${f.name}+${transfer.offset}: local transfer is not an ARM branch`);
      let displacement = (word & 0x00ffffff) << 2;
      if (displacement & 0x02000000) displacement -= 0x04000000;
      assert(transfer.offset + 8 + displacement === transfer.targetOffset,
        `${f.name}+${transfer.offset}: local branch destination mismatch`);
    }
    for (const literal of f.literals) {
      for (const loadOffset of literal.loadOffsets) {
        const word = actual.data.readUInt32LE(loadOffset);
        assert(((word >>> 26) & 3) === 1 && ((word >>> 25) & 1) === 0 &&
          ((word >>> 24) & 1) === 1 && ((word >>> 22) & 1) === 0 &&
          ((word >>> 21) & 1) === 0 && ((word >>> 20) & 1) === 1 && ((word >>> 16) & 15) === 15,
          `${f.name}+${loadOffset}: literal site is not an ARM PC-relative word load`);
        const magnitude = word & 0xfff;
        const target = loadOffset + 8 + (((word >>> 23) & 1) ? magnitude : -magnitude);
        assert(target === literal.offset, `${f.name}+${loadOffset}: literal-load destination mismatch`);
      }
    }

    const output = run(objdump, ["-d", "-j", sectionName, candidatePath], `${f.name}: section disassembly`);
    const offsets = [];
    for (const line of output.split(/\r?\n/)) {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+/);
      if (match && Number.parseInt(match[1], 16) < config.templates[f.template].bodySize)
        offsets.push(Number.parseInt(match[1], 16));
    }
    const expectedOffsets = Array.from({ length: config.templates[f.template].instructionCount }, (_, i) => i * 4);
    assert(JSON.stringify(offsets) === JSON.stringify(expectedOffsets), `${f.name}: ARM disassembly coverage mismatch`);
  }
  for (const [template, members] of state.templateMembers) {
    const size = config.templates[template].bodySize;
    const a = candidate.byName.get(`.text.${members[0].name}`).data.subarray(0, size);
    const b = candidate.byName.get(`.text.${members[1].name}`).data.subarray(0, size);
    assert(a.equals(b), `${template}: pair bodies are not byte-identical`);
  }
}

let temporary;
try {
  const state = validateConfig();
  const source = fs.readFileSync(sourcePath);
  assert(hash(source) === config.sourceSha256, "source SHA-256 mismatch");
  const args = process.argv.slice(2);
  assert(args.length <= 2, "usage: validate-arm-duplicate-templates-81.mjs [--object] [object.o]");
  let objectPath;
  if (args[0] === "--object") { assert(args.length === 2, "--object requires a path"); objectPath = path.resolve(args[1]); }
  else if (args.length === 1) objectPath = path.resolve(args[0]);
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), "arm-duplicate-templates-81-"));
  const referencePath = path.join(temporary, "reference.o");
  const assembler = findTool("as"), objdump = findTool("objdump");
  run(assembler, ["-o", referencePath, sourcePath], "assembly");
  validateObject(objectPath ?? referencePath, referencePath, objdump, state);
  process.stdout.write("validated arm duplicate templates 81: 24 functions, 12 pairs, 1288 body bytes, 1376 owned bytes, 322 instructions, 36 direct transfers, 32 local transfers, 22 literal slots, 28 load sites, 18 identity classes\n");
} catch (error) {
  process.stderr.write(`validation failed: ${error.message}\n`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
}
