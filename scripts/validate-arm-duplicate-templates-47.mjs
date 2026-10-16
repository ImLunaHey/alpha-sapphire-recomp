import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "config/arm-duplicate-templates-47.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const flags = new Set(process.argv.slice(2).filter((arg) => arg.startsWith("--")));
const objectPath = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
const mode = flags.has("--target") ? "target" : flags.has("--base") ? "base" : "source";

function fail(message) {
  throw new Error(`duplicate templates 47: ${message}`);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function validateConfig() {
  const template = config.templates.service_context_record_operation;
  expect(config.mode === "arm", "configuration must select ARM mode");
  expect(template.bodySize === 524 && template.instructionCount === 131,
    "unexpected body geometry in configuration");
  expect(template.count === 2 && config.functions.length === 2,
    "expected exactly two expansions");
  expect(config.expectedBodyBytes === template.bodySize * template.count,
    "expectedBodyBytes is inconsistent");
  expect(template.directCalls === 15 && template.indirectCalls === 3 && template.poolSlots === 3,
    "unexpected call or slot counts");
  expect(new Set(config.internalLabelOffsets).size === 6,
    "internal label offsets must be unique");
  expect(new Set(config.slotContract.map((slot) => slot.identity)).size === 3,
    "slot identities must be pairwise distinct");
}

function validateSource() {
  const sourcePath = path.join(root, config.source);
  const source = fs.readFileSync(sourcePath, "utf8");
  for (const directive of [".syntax unified", ".arch armv6k", ".fpu vfpv2", ".arm",
    ".macro DT47_BODY", ".size \\name, .-\\name", ".endm"]) {
    expect(source.includes(directive), `source is missing ${directive}`);
  }
  for (const fn of config.functions) {
    expect(source.includes(`DT47_BODY ${fn.name},`), `source is missing expansion ${fn.name}`);
    for (const call of fn.directCalls) {
      expect(source.includes(call.symbol), `source is missing ${call.role} ${call.symbol}`);
    }
  }
  for (const call of config.commonDirectCalls) {
    expect(source.includes(call.symbol), `source is missing common call ${call.symbol}`);
  }
  expect(source.includes("bl func_00184990-4"),
    "source is missing the allocator pre-entry addend");
  for (const slot of config.slotContract) {
    expect(source.includes(slot.identity), `source is missing slot identity ${slot.identity}`);
  }
  const expansionCount = (source.match(/^DT47_BODY func_/gm) ?? []).length;
  expect(expansionCount === config.functions.length, `found ${expansionCount} macro expansions`);
  const blxCount = (source.match(/^\s+blx\s+/gm) ?? []).length;
  expect(blxCount === 3, `macro contains ${blxCount} indirect calls instead of 3`);
}

function cString(buffer, offset) {
  const end = buffer.indexOf(0, offset);
  return buffer.toString("utf8", offset, end < 0 ? buffer.length : end);
}

function parseElf(file) {
  const data = fs.readFileSync(file);
  expect(data.length >= 52 && data.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])),
    `${file} is not an ELF object`);
  expect(data[4] === 1 && data[5] === 1, "object must be little-endian ELF32");
  const shoff = data.readUInt32LE(32);
  const shentsize = data.readUInt16LE(46);
  const shnum = data.readUInt16LE(48);
  const shstrndx = data.readUInt16LE(50);
  expect(shentsize >= 40 && shnum > 0 && shstrndx < shnum, "invalid section table");
  const sections = [];
  for (let i = 0; i < shnum; i += 1) {
    const at = shoff + i * shentsize;
    expect(at + 40 <= data.length, "truncated section table");
    sections.push({
      index: i,
      nameOffset: data.readUInt32LE(at),
      type: data.readUInt32LE(at + 4),
      addr: data.readUInt32LE(at + 12),
      offset: data.readUInt32LE(at + 16),
      size: data.readUInt32LE(at + 20),
      link: data.readUInt32LE(at + 24),
      info: data.readUInt32LE(at + 28),
      entsize: data.readUInt32LE(at + 36),
    });
  }
  const shstr = sections[shstrndx];
  const names = data.subarray(shstr.offset, shstr.offset + shstr.size);
  for (const section of sections) section.name = cString(names, section.nameOffset);

  const symbols = [];
  for (const section of sections.filter((item) => item.type === 2)) {
    const stringsSection = sections[section.link];
    expect(stringsSection, `symbol table ${section.name} has no string table`);
    const strings = data.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size);
    const count = section.size / (section.entsize || 16);
    for (let i = 0; i < count; i += 1) {
      const at = section.offset + i * (section.entsize || 16);
      symbols.push({
        table: section.index,
        index: i,
        name: cString(strings, data.readUInt32LE(at)),
        value: data.readUInt32LE(at + 4),
        size: data.readUInt32LE(at + 8),
        info: data[at + 12],
        shndx: data.readUInt16LE(at + 14),
      });
    }
  }
  const symbolByTableIndex = new Map(symbols.map((symbol) => [`${symbol.table}:${symbol.index}`, symbol]));
  const relocs = [];
  for (const section of sections.filter((item) => item.type === 9 || item.type === 4)) {
    const entrySize = section.entsize || (section.type === 9 ? 8 : 12);
    for (let at = section.offset; at < section.offset + section.size; at += entrySize) {
      const info = data.readUInt32LE(at + 4);
      const symbol = symbolByTableIndex.get(`${section.link}:${info >>> 8}`);
      relocs.push({
        section: section.info,
        offset: data.readUInt32LE(at),
        type: info & 0xff,
        symbol: symbol?.name ?? "",
        addend: section.type === 4 ? data.readInt32LE(at + 8) : null,
      });
    }
  }
  return { data, sections, symbols, relocs };
}

function wordAt(bytes, offset) {
  expect(offset >= 0 && offset + 4 <= bytes.length, `word offset ${offset} is out of range`);
  return bytes.readUInt32LE(offset);
}

function branchTarget(word, offset) {
  let displacement = word & 0x00ffffff;
  if (displacement & 0x00800000) displacement -= 0x01000000;
  return offset + 8 + displacement * 4;
}

function validateObject(file) {
  expect(file, `${mode} validation requires an object path`);
  const elf = parseElf(file);
  const normalized = [];
  for (const fn of config.functions) {
    const matches = elf.symbols.filter((symbol) => symbol.name === fn.name && symbol.shndx !== 0);
    expect(matches.length === 1, `expected one defined symbol for ${fn.name}, found ${matches.length}`);
    const symbol = matches[0];
    const section = elf.sections[symbol.shndx];
    expect(section, `${fn.name} has an invalid section index`);
    expect((symbol.info & 0xf) === 2, `${fn.name} is not an ELF function symbol`);
    expect((symbol.value & 1) === 0, `${fn.name} is unexpectedly Thumb-tagged`);
    expect(symbol.size === 524, `${fn.name} has size ${symbol.size}, expected 524`);
    const start = symbol.value - section.addr;
    const totalSize = 536;
    expect(start >= 0 && start + totalSize <= section.size,
      `${fn.name} does not contain its three physical post-body slots`);
    const bytes = Buffer.from(elf.data.subarray(section.offset + start, section.offset + start + totalSize));
    const relativeRelocs = elf.relocs.filter((reloc) =>
      reloc.section === section.index && reloc.offset >= start && reloc.offset < start + totalSize)
      .map((reloc) => ({ ...reloc, offset: reloc.offset - start }));

    const expectedCalls = [...config.commonDirectCalls, ...fn.directCalls]
      .sort((a, b) => a.offset - b.offset);
    const callRelocs = relativeRelocs.filter((reloc) => reloc.type === 28);
    expect(callRelocs.length === 15, `${fn.name} has ${callRelocs.length} R_ARM_CALL relocations`);
    for (const expected of expectedCalls) {
      const matchesAt = callRelocs.filter((reloc) => reloc.offset === expected.offset);
      expect(matchesAt.length === 1,
        `${fn.name}+${expected.offset} does not have exactly one R_ARM_CALL relocation`);
      expect(matchesAt[0].symbol === expected.symbol,
        `${fn.name}+${expected.offset} calls ${matchesAt[0].symbol || "an unnamed symbol"}, expected ${expected.symbol}`);
      const instruction = wordAt(bytes, expected.offset);
      expect((instruction & 0x0f000000) === 0x0b000000,
        `${fn.name}+${expected.offset} is not a direct BL instruction`);
      bytes.writeUInt32LE(0xeb000000, expected.offset);
    }

    const indirectOffsets = [];
    for (let offset = 0; offset < 524; offset += 4) {
      if ((wordAt(bytes, offset) & 0x0ffffff0) === 0x012fff30) indirectOffsets.push(offset);
    }
    expect(JSON.stringify(indirectOffsets) === JSON.stringify(config.indirectCalls.map((call) => call.offset)),
      `${fn.name} indirect-call offsets are ${indirectOffsets.join(", ")}`);

    const localTargets = new Set();
    for (let offset = 0; offset < 524; offset += 4) {
      const instruction = wordAt(bytes, offset);
      if ((instruction & 0x0f000000) === 0x0a000000) {
        const target = branchTarget(instruction, offset);
        if (target >= 0 && target < 524) localTargets.add(target);
      }
    }
    expect(JSON.stringify([...localTargets].sort((a, b) => a - b)) === JSON.stringify(config.internalLabelOffsets),
      `${fn.name} has unexpected local branch targets`);

    const slotRelocs = relativeRelocs.filter((reloc) => reloc.type === 2);
    expect(slotRelocs.length === 3, `${fn.name} has ${slotRelocs.length} R_ARM_ABS32 slots`);
    for (const slot of config.slotContract) {
      const matchesAt = slotRelocs.filter((reloc) => reloc.offset === slot.offset);
      expect(matchesAt.length === 1,
        `${fn.name}+${slot.offset} does not have exactly one R_ARM_ABS32 relocation`);
      expect(matchesAt[0].symbol === slot.identity,
        `${fn.name}+${slot.offset} names ${matchesAt[0].symbol || "an unnamed symbol"}, expected ${slot.identity}`);
      const load = wordAt(bytes, slot.loadOffset);
      expect((load & 0x0f7f0000) === 0x051f0000,
        `${fn.name}+${slot.loadOffset} is not a PC-relative word load`);
      const magnitude = load & 0xfff;
      const address = slot.loadOffset + 8 + ((load & 0x00800000) ? magnitude : -magnitude);
      expect(address === slot.offset,
        `${fn.name}+${slot.loadOffset} loads +${address}, expected +${slot.offset}`);
      bytes.writeUInt32LE(0, slot.offset);
    }
    expect(relativeRelocs.length === 18,
      `${fn.name} has ${relativeRelocs.length} relocations in its body and slots, expected 18`);
    normalized.push({ name: fn.name, bytes });
  }
  expect(normalized[0].bytes.equals(normalized[1].bytes),
    `${normalized[0].name} and ${normalized[1].name} differ after symbolic call/slot normalization`);
}

validateConfig();
validateSource();
if (mode !== "source") validateObject(objectPath);
console.log(`Validated duplicate ARM templates 47 (${mode}).`);
