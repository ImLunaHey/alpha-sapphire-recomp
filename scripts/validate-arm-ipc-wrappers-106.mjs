#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "src/main/arm_ipc_wrappers_106.S";
const CONFIG = "config/arm-ipc-wrappers-106.json";
const SPEC = "docs/specs/main/arm_ipc_wrappers_106.md";
const PINS = { source: "4bdf5a3f25c526fbed907b9051f87092eb0fe5abd254c277b6f0b135ea72b39e", config: "2afef2adf66ca3a3032c06c40d347f3b2ac36a5fa7e94c3f8b98b4992b84feeb", spec: "e89d50bb650438b65b32a6c32e176b1bc9f1ab886c9b2290c603662809c42463" };
const NAME = "func_002AC050", SECTION = `.text.${NAME}`;
const START = 0x002ac050, BODY = 48, OWNED = 52, IMAGE_BASE = 0x00100000;
const MAX_FILE = 64 * 1024 * 1024, MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384, MAX_SYMBOLS = 1_000_000, MAX_RELOCS = 1_000_000;
const RELOCS = [
  [8, 28, "func_00171FC0"], [24, 28, "func_00171324"],
  [44, 29, "func_0017F4A4"], [48, 2, "ipc_service_registry_owner_71"],
];
const ATTRIBUTES = "411b000000616561626900011100000005364b000609080109010a02";
function check(ok, message) { if (!ok) throw new Error(message); }
function same(a, b, message) { check(JSON.stringify(a) === JSON.stringify(b), message); }
function hash(data) { return crypto.createHash("sha256").update(data).digest("hex"); }
function limits({ file = 0, exec = 0, sections = 0, symbols = 0, relocs = 0 } = {}) {
  for (const [label, value, cap] of [["file", file, MAX_FILE], ["executable", exec, MAX_EXEC],
    ["section", sections, MAX_SECTIONS], ["symbol", symbols, MAX_SYMBOLS], ["relocation", relocs, MAX_RELOCS]]) {
    check(Number.isSafeInteger(value) && value >= 0 && value <= cap, `${label} resource cap`);
  }
}
function bounded(offset, size, length, label) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 &&
    offset <= length && size <= length - offset, `out-of-bounds ${label}`);
}
function read(file) {
  const fd = fs.openSync(file, "r");
  try {
    const stat = fs.fstatSync(fd); check(stat.isFile(), "input is not a regular file");
    limits({ file: stat.size });
    const data = Buffer.alloc(stat.size); let offset = 0;
    while (offset < data.length) {
      const count = fs.readSync(fd, data, offset, data.length - offset, offset);
      check(count > 0, "input shrank while reading"); offset += count;
    }
    check(fs.fstatSync(fd).size === data.length, "input changed size while reading");
    return data;
  } finally { fs.closeSync(fd); }
}
function stringAt(buffer, offset) {
  bounded(offset, 1, buffer.length, "string");
  const end = buffer.indexOf(0, offset); check(end >= 0, "unterminated ELF string");
  return buffer.toString("utf8", offset, end);
}
function parseElf(buffer) {
  limits({ file: buffer.length }); bounded(0, 52, buffer.length, "ELF header");
  same([...buffer.subarray(0, 7)], [127, 69, 76, 70, 1, 1, 1], "ELF identity");
  check(buffer.subarray(7, 16).every((v) => v === 0), "ELF ABI/padding");
  const u16 = (n) => buffer.readUInt16LE(n), u32 = (n) => buffer.readUInt32LE(n);
  same([u16(16), u16(18), u32(20), u32(24), u32(28), u32(36)],
    [1, 40, 1, 0, 0, 0x05000000], "ELF type/machine/version/entry/program headers/flags");
  same([u16(40), u16(42), u16(44), u16(46)], [52, 0, 0, 40], "ELF header sizes");
  const shoff = u32(32), count = u16(48), shstr = u16(50);
  limits({ sections: count });
  check(count > 0 && shstr > 0 && shstr < count, "ELF section indexes");
  bounded(shoff, count * 40, buffer.length, "section table");
  check(buffer.subarray(shoff, shoff + 40).every((v) => v === 0), "canonical null section");
  const sections = Array.from({ length: count }, (_, index) => {
    const p = shoff + index * 40;
    return { index, header: p, nameOffset: u32(p), type: u32(p + 4), flags: u32(p + 8),
      addr: u32(p + 12), offset: u32(p + 16), size: u32(p + 20), link: u32(p + 24),
      info: u32(p + 28), align: u32(p + 32), entsize: u32(p + 36) };
  });
  let exec = 0, symbolsCount = 0, relocsCount = 0;
  for (const s of sections) {
    if (s.type !== 8) bounded(s.offset, s.size, buffer.length, "section data");
    if (s.flags & 4) exec += s.size;
    if (s.type === 2 || s.type === 11) {
      check(s.entsize === 16 && s.size % 16 === 0, "symbol entry size"); symbolsCount += s.size / 16;
    }
    if (s.type === 9 || s.type === 4) {
      const step = s.type === 9 ? 8 : 12;
      check(s.entsize === step && s.size % step === 0, "relocation entry size"); relocsCount += s.size / step;
    }
  }
  limits({ file: buffer.length, exec, sections: count, symbols: symbolsCount, relocs: relocsCount });
  check(sections[shstr].type === 3, "section-name table type");
  const names = buffer.subarray(sections[shstr].offset, sections[shstr].offset + sections[shstr].size);
  for (const s of sections) s.name = stringAt(names, s.nameOffset);
  const tables = sections.filter((s) => s.type === 2 || s.type === 11);
  check(tables.length === 1 && tables[0].type === 2, "one SYMTAB, no DYNSYM");
  const table = tables[0];
  check(table.link < count && sections[table.link].type === 3, "symbol string-table link");
  const strings = sections[table.link];
  const data = buffer.subarray(strings.offset, strings.offset + strings.size);
  const symbols = Array.from({ length: table.size / 16 }, (_, index) => {
    const p = table.offset + index * 16;
    return { index, name: stringAt(data, u32(p)), value: u32(p + 4), size: u32(p + 8),
      bind: buffer[p + 12] >>> 4, type: buffer[p + 12] & 15, other: buffer[p + 13], shndx: u16(p + 14) };
  });
  check(symbols.length > 0 && Object.values(symbols[0]).every((v) => v === 0 || v === ""), "canonical null symbol");
  check(table.info <= symbols.length && symbols.every((s, i) => i < table.info ? s.bind === 0 : s.bind !== 0),
    "symbol local/global partition");
  for (const s of symbols) check(s.shndx < count || s.shndx === 0xfff1, "symbol section index");
  const relocations = [];
  for (const r of sections.filter((s) => s.type === 9 || s.type === 4)) {
    check(r.link === table.index && r.info > 0 && r.info < count, "relocation links");
    const target = sections[r.info];
    for (let p = r.offset; p < r.offset + r.size; p += r.entsize) {
      const offset = u32(p), info = u32(p + 4), symbolIndex = info >>> 8;
      bounded(offset, 4, target.size, "relocation destination");
      check(symbolIndex < symbols.length, "relocation symbol index");
      relocations.push({ target: target.index, offset, type: info & 255, symbol: symbols[symbolIndex].name,
        format: r.type, explicitAddend: r.type === 4 ? buffer.readInt32LE(p + 8) : 0 });
    }
  }
  return { buffer, sections, symbols, table, relocations };
}
function section(elf, name) {
  const found = elf.sections.filter((s) => s.name === name);
  check(found.length === 1, `section multiplicity: ${name}`); return found[0];
}
function bytes(elf, s) { return elf.buffer.subarray(s.offset, s.offset + s.size); }
function validateObject(buffer) {
  const elf = parseElf(buffer), owned = section(elf, SECTION);
  same([owned.type, owned.flags, owned.addr, owned.size, owned.align, owned.link, owned.info, owned.entsize],
    [1, 6, 0, OWNED, 4, 0, 0, 0], "owned section contract");
  same(elf.sections.filter((s) => (s.flags & 2) && s.size).map((s) => s.name), [SECTION], "allocated payload set");
  same(elf.sections.filter((s) => (s.flags & 4) && s.size).map((s) => s.name), [SECTION], "executable payload set");
  const allowedSections = new Set(["", ".text", ".data", ".bss", SECTION, `.rel${SECTION}`,
    ".note.GNU-stack", ".ARM.attributes", ".symtab", ".strtab", ".shstrtab"]);
  check(elf.sections.every((s) => allowedSections.has(s.name)), "foreign section");
  check(new Set(elf.sections.map((s) => s.name)).size === elf.sections.length, "duplicate section names");
  for (const name of [".text", ".data", ".bss", ".note.GNU-stack"]) {
    check(elf.sections.filter((s) => s.name === name).every((s) => s.size === 0), `nonempty ${name}`);
  }
  const shape = (s) => [s.name, s.value, s.size, s.bind, s.type, s.other];
  same(elf.symbols.filter((s) => s.shndx === owned.index).map(shape), [
    ["", 0, 0, 0, 3, 0], ["$a", 0, 0, 0, 0, 0], ["$d", BODY, 0, 0, 0, 0],
    [NAME, 0, BODY, 1, 2, 0],
  ], "complete owned symbols / ARM and data state");
  const undefineds = elf.symbols.filter((s) => s.index > 0 && s.shndx === 0);
  same(undefineds.map(shape), RELOCS.map((r) => [r[2], 0, 0, 1, 0, 0]), "undefined identities");
  check(elf.symbols.length === 14, "complete symbol count");
  const ancillarySymbols = [];
  for (const s of elf.symbols.filter((s) => s.index > 0 && s.shndx !== 0 && s.shndx !== owned.index)) {
    check(s.name === "" && s.value === 0 && s.size === 0 && s.bind === 0 && s.type === 3 && s.other === 0 &&
      [".text", ".data", ".bss", ".note.GNU-stack", ".ARM.attributes"].includes(elf.sections[s.shndx].name), "foreign or alias symbol");
    ancillarySymbols.push(elf.sections[s.shndx].name);
  }
  same(ancillarySymbols, [".text", ".data", ".bss", ".note.GNU-stack", ".ARM.attributes"], "complete ancillary section symbols");
  same(elf.relocations.map((r) => [r.target, r.offset, r.type, r.symbol, r.format, r.explicitAddend]),
    RELOCS.map(([offset, type, symbol]) => [owned.index, offset, type, symbol, 9, 0]), "exact REL relocation contract");
  const relsec = section(elf, `.rel${SECTION}`);
  same([relsec.type, relsec.flags, relsec.addr, relsec.size, relsec.align, relsec.entsize],
    [9, 0x40, 0, 32, 4, 8], "relocation section metadata");
  for (const [offset, type] of RELOCS) {
    const word = buffer.readUInt32LE(owned.offset + offset);
    if (type === 2) check(word === 0, "ABS32 zero addend");
    else check(word === (type === 28 ? 0xebfffffe : 0xeafffffe), "branch instruction/state/zero addend");
  }
  const attr = section(elf, ".ARM.attributes");
  same([attr.type, attr.flags, attr.align], [0x70000003, 0, 1], "attribute section metadata");
  check(bytes(elf, attr).toString("hex") === ATTRIBUTES, "ARMv6K/Thumb-1/VFPv2 attributes");
  return elf;
}
function inventory(buffer, codeLength) {
  const lines = buffer.toString("utf8").trim().split(/\r?\n/);
  check(lines.shift() === "Location,Name,Namespace,Mode,Size,Segment", "inventory header");
  limits({ symbols: lines.length });
  const rows = lines.map((line) => {
    const fields = line.replaceAll('"', "").split(",");
    check(fields.length === 6 && /^[0-9A-F]{8}$/.test(fields[0]) && /^[0-9A-F]{8}$/.test(fields[4]), "inventory row");
    const [address, name, , mode, size] = fields;
    const row = { address: Number.parseInt(address, 16), name, mode, size: Number.parseInt(size, 16) };
    check(row.mode === "$a" || row.mode === "$t", "inventory state");
    check(row.size > 0 && row.address % (mode === "$a" ? 4 : 2) === 0 && row.size % (mode === "$a" ? 4 : 2) === 0,
      "inventory alignment");
    bounded(row.address - IMAGE_BASE, row.size, codeLength, "inventory body"); return row;
  });
  check(new Set(rows.map((r) => r.name)).size === rows.length, "duplicate inventory names");
  for (let i = 1; i < rows.length; i++) check(rows[i - 1].address + rows[i - 1].size <= rows[i].address, "overlapping inventory bodies");
  return rows;
}
function validateEvidence(object, targetBuffer, code, rows) {
  limits({ file: code.length });
  const elf = validateObject(object), target = parseElf(targetBuffer);
  const candidate = section(elf, SECTION), reference = section(target, SECTION);
  same([reference.type, reference.flags, reference.size, reference.align], [1, 6, OWNED, 4], "target owned section");
  const owners = target.symbols.filter((s) => s.name === NAME);
  check(owners.length === 1, "target owner count");
  same([owners[0].shndx, owners[0].value, owners[0].size, owners[0].bind, owners[0].type, owners[0].other],
    [reference.index, 0, BODY, 1, 2, 0], "authoritative ARM owner symbol");
  check(target.symbols.some((s) => s.shndx === reference.index && s.name === "$a" && s.value === 0) &&
    target.symbols.some((s) => s.shndx === reference.index && s.name === "$d" && s.value === BODY) &&
    !target.symbols.some((s) => s.shndx === reference.index && /^\$t/.test(s.name)), "authoritative ARM state");
  same(target.relocations.filter((r) => r.target === reference.index)
    .map((r) => [r.offset, r.type, r.symbol, r.format, r.explicitAddend]),
  RELOCS.map(([offset, type, symbol]) => [offset, type, symbol, 9, 0]), "target relocation contract");
  const index = rows.findIndex((r) => r.name === NAME);
  check(index >= 0, "missing inventory candidate");
  same(rows[index], { address: START, name: NAME, mode: "$a", size: BODY }, "candidate inventory contract");
  same([rows[index + 1]?.name, rows[index + 1]?.address], ["func_002AC084", START + OWNED], "exact following ownership boundary");
  const imageOffset = START - IMAGE_BASE;
  bounded(imageOffset, OWNED, code.length, "owned private image extent");
  check(bytes(target, reference).equals(bytes(elf, candidate)), "base/target neutral owned-section equality");
  const linked = Buffer.from(bytes(elf, candidate));
  const targetLinked = Buffer.from(bytes(target, reference));
  for (const [offset, type, symbol] of RELOCS) {
    if (type === 2) {
      const witness = rows.find((r) => r.name === "func_0018BFC4");
      check(witness?.mode === "$a" && witness.size === 60, "literal witness owner");
      bounded(witness.address - IMAGE_BASE + 64, 4, code.length, "literal witness");
      const identity = code.readUInt32LE(witness.address - IMAGE_BASE + 64);
      check(identity !== 0 && identity % 4 === 0 &&
        !rows.some((r) => identity >= r.address && identity < r.address + r.size), "opaque registry data identity");
      linked.writeUInt32LE(identity, offset);
      targetLinked.writeUInt32LE(identity, offset);
    } else {
      const address = Number.parseInt(symbol.slice(5), 16), destination = rows.find((r) => r.name === symbol);
      check(destination?.address === address && destination.mode === "$a" && address % 4 === 0, `ARM primary destination ${symbol}`);
      const displacement = address - (START + offset + 8);
      check(displacement % 4 === 0 && displacement >= -0x2000000 && displacement < 0x2000000, "ARM branch range");
      const opcode = linked.readUInt32LE(offset) & 0xff000000;
      linked.writeUInt32LE((opcode | ((displacement / 4) & 0xffffff)) >>> 0, offset);
      targetLinked.writeUInt32LE((opcode | ((displacement / 4) & 0xffffff)) >>> 0, offset);
    }
  }
  check(linked.equals(code.subarray(imageOffset, imageOffset + OWNED)), "full relocated authoritative byte equality (body and pool)");
  check(targetLinked.equals(code.subarray(imageOffset, imageOffset + OWNED)), "target relocated authoritative byte equality");
  return elf;
}
function walk(directory) {
  const files = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      check(!entry.isSymbolicLink(), "symlink in public ownership inputs");
      if (entry.isDirectory()) visit(child); else if (entry.isFile()) files.push(child);
      check(files.length <= 20_000, "ownership file cap");
    }
  }
  visit(directory); return files;
}
function auditOwnership(sourceFiles, manifests, report) {
  const witnessManifest = manifests.find(([filename]) => filename === "config/arm-ipc-wrappers-71.json")?.[1];
  const witnessFunction = witnessManifest?.functions?.find((fn) => fn.name === "func_0018BFC4");
  check(witnessFunction?.literals?.some((literal) => literal.offset === 64 &&
    literal.symbol === "ipc_service_registry_owner_71"), "public literal identity witness");
  for (const [filename, text] of sourceFiles) {
    if (filename === SOURCE) continue;
    check(!new RegExp(`^\\s*${NAME}\\s*:`, "m").test(text) &&
      !new RegExp(`^\\s*\\.(?:global|globl)\\s+[^\\n]*\\b${NAME}\\b`, "m").test(text) &&
      !new RegExp(`\\b${NAME}\\s*\\([^;{}]*\\)\\s*\\{`).test(text), `competing source owner ${filename}`);
  }
  for (const [filename, manifest] of manifests) {
    if (filename === CONFIG) continue;
    for (const fn of manifest.functions ?? []) {
      const name = typeof fn === "string" ? fn : fn.name;
      check(name !== NAME, `competing manifest owner ${filename}`);
      if (typeof fn !== "object" || !/^func_[0-9A-Fa-f]{8}$/.test(name ?? "")) continue;
      const start = Number.parseInt(name.slice(5), 16);
      const end = start + Math.max(fn.size ?? fn.bodySize ?? 0, fn.ownedSize ?? 0,
        ...(fn.literals ?? []).map((l) => (l.offset ?? 0) + 4));
      check(end <= START || start >= START + OWNED, `overlapping manifest extent ${filename}`);
    }
  }
  const entries = (report.units ?? []).flatMap((u) => u.functions ?? []).filter((f) => f.name === NAME);
  check(entries.length === 1 && Number(entries[0].size) === BODY, "authoritative report candidate entry");
  check(entries[0].fuzzy_match_percent === 100, "candidate is not an exact objdiff match");
}
function signed(value, bits) { return value >= 2 ** (bits - 1) ? value - 2 ** bits : value; }
function transfers(code, rows) {
  const result = [];
  for (const row of rows) {
    const begin = row.address - IMAGE_BASE;
    for (let offset = 0; offset < row.size; offset += row.mode === "$a" ? 4 : 2) {
      const pc = row.address + offset;
      if (row.mode === "$a") {
        const word = code.readUInt32LE(begin + offset);
        if ((word & 0x0e000000) !== 0x0a000000) continue;
        const blx = word >>> 28 === 15;
        result.push({ from: pc, destination: pc + 8 + signed(word & 0xffffff, 24) * 4 + (blx ? ((word >>> 24) & 1) * 2 : 0),
          mode: blx ? "$t" : "$a" });
      } else {
        const word = code.readUInt16LE(begin + offset);
        if ((word & 0xf800) === 0xe000) result.push({ from: pc, destination: pc + 4 + signed(word & 0x7ff, 11) * 2, mode: "$t" });
        else if ((word & 0xf000) === 0xd000 && ((word >>> 8) & 15) < 14)
          result.push({ from: pc, destination: pc + 4 + signed(word & 255, 8) * 2, mode: "$t" });
        else if ((word & 0xf800) === 0xf000 && offset + 4 <= row.size) {
          const low = code.readUInt16LE(begin + offset + 2), op = low & 0xf800;
          if (op === 0xf800 || op === 0xe800) {
            const destination = pc + 4 + signed(((word & 0x7ff) << 12) | ((low & 0x7ff) << 1), 23);
            result.push({ from: pc, destination: op === 0xe800 ? destination - (destination % 4) : destination, mode: op === 0xe800 ? "$a" : "$t" });
            offset += 2;
          }
        }
      }
    }
  }
  return result;
}
function checkInbound(transfersList) {
  let entries = 0;
  for (const transfer of transfersList) {
    if (transfer.destination >= START && transfer.destination < START + OWNED) {
      check(transfer.destination === START, "direct transfer targets interior/pool");
      check(transfer.mode === "$a", "inbound transfer has wrong instruction state"); entries++;
    }
  }
  return entries;
}
function normalizedBody(code, row) {
  const words = [];
  for (let offset = 0; offset < row.size; offset += 4) {
    let word = code.readUInt32LE(row.address - IMAGE_BASE + offset);
    if ((word & 0x0e000000) === 0x0a000000) word = (word & (word >>> 28 === 15 ? 0xfe000000 : 0xff000000)) >>> 0;
    words.push(word);
  }
  return JSON.stringify(words);
}
function literalReferences(code, rows) {
  const references = [];
  for (const row of rows) {
    for (let offset = 0; offset < row.size; offset += row.mode === "$a" ? 4 : 2) {
      const from = row.address + offset, at = from - IMAGE_BASE;
      if (row.mode === "$t") {
        const half = code.readUInt16LE(at);
        if ((half & 0xf800) === 0x4800 || (half & 0xf800) === 0xa000)
          references.push({ from, destination: ((from + 4) & ~3) + (half & 255) * 4 });
        continue;
      }
      const word = code.readUInt32LE(at);
      if (((word >>> 16) & 15) !== 15) continue;
      // Immediate, pre-indexed, PC-relative single and halfword/doubleword loads.
      if (((word >>> 26) & 3) === 1 && !(word & 0x02000000) && (word & 0x01000000) && (word & 0x00100000)) {
        references.push({ from, destination: from + 8 + ((word & 0x00800000) ? 1 : -1) * (word & 0xfff) });
      } else if ((word & 0x0e000090) === 0x00000090 && (word & 0x00400000) && (word & 0x01000000) && (word & 0x60)) {
        const immediate = ((word >>> 4) & 0xf0) | (word & 15);
        references.push({ from, destination: from + 8 + ((word & 0x00800000) ? 1 : -1) * immediate });
      } else if (((word >>> 25) & 7) === 1 && [2, 4].includes((word >>> 21) & 15)) {
        const rotate = ((word >>> 8) & 15) * 2, immediate = word & 255;
        const value = rotate ? ((immediate >>> rotate) | (immediate << (32 - rotate))) >>> 0 : immediate;
        references.push({ from, destination: from + 8 + (((word >>> 21) & 15) === 4 ? value : -value) });
      }
    }
  }
  return references;
}
function checkLiteralReferences(references) {
  const owned = references.filter((r) => r.destination >= START && r.destination < START + OWNED);
  same(owned, [{ from: START + 16, destination: START + BODY }], "exact PC-relative ownership/reachability");
}
function auditBinary(code, rows) {
  const candidate = rows.find((r) => r.name === NAME);
  const normalized = normalizedBody(code, candidate);
  const duplicates = rows.filter((r) => r.name !== NAME && r.mode === "$a" && r.size === BODY && normalizedBody(code, r) === normalized);
  check(duplicates.length === 0, "normalized duplicate body");
  const entries = checkInbound(transfers(code, rows));
  checkLiteralReferences(literalReferences(code, rows));
  let pointerEntries = 0;
  for (let offset = 0; offset + 4 <= code.length; offset += 4) {
    const value = (code.readUInt32LE(offset) & 0xfffffffe) >>> 0;
    check(value <= START || value >= START + OWNED, "aligned pointer targets interior/pool");
    if (value === START) pointerEntries++;
  }
  return { directEntryTransfers: entries, alignedEntryPointers: pointerEntries, normalizedDuplicates: 0 };
}
function pinned(source = read(path.join(ROOT, SOURCE)), config = read(path.join(ROOT, CONFIG)), spec = read(path.join(ROOT, SPEC))) {
  check(hash(source) === PINS.source, "pinned source hash");
  check(hash(config) === PINS.config, "pinned config hash"); check(hash(spec) === PINS.spec, "pinned spec hash");
  check(JSON.parse(config).sourceHash === PINS.source, "config/source hash agreement");
}
// Deliberately generated from public instructions and invented image/data bytes:
// standalone tests must never need a target object, ROM, report, or assembler.
function fixtureElf(body, resolved = false) {
  const sections = [
    { name: "", type: 0 }, { name: ".text", type: 1, flags: 6, align: 4 },
    { name: ".data", type: 1, flags: 3, align: 4 }, { name: ".bss", type: 8, flags: 3, align: 4 },
    { name: SECTION, type: 1, flags: 6, align: 4, data: body },
    { name: `.rel${SECTION}`, type: 9, flags: 0x40, align: 4, entsize: 8, link: 8, info: 4 },
    { name: ".note.GNU-stack", type: 1 },
    { name: ".ARM.attributes", type: 0x70000003, align: 1, data: Buffer.from(ATTRIBUTES, "hex") },
    { name: ".symtab", type: 2, align: 4, entsize: 16, link: 9 },
    { name: ".strtab", type: 3, align: 1 }, { name: ".shstrtab", type: 3, align: 1 },
  ];
  const symbols = [
    {}, ...[1, 2, 3, 4].map((shndx) => ({ shndx, type: 3 })),
    { name: "$a", shndx: 4 }, ...(resolved ? [] : [{ name: "$d", value: BODY, shndx: 4 }]),
    { shndx: 6, type: 3 }, { shndx: 7, type: 3 },
  ];
  sections[8].info = symbols.length;
  symbols.push({ name: NAME, size: BODY, bind: 1, type: 2, shndx: 4 });
  if (!resolved) symbols.push(...RELOCS.map(([, , name]) => ({ name, bind: 1 })));
  let strings = "\0";
  sections[8].data = Buffer.alloc(symbols.length * 16);
  symbols.forEach((s, i) => {
    const at = i * 16, data = sections[8].data;
    if (s.name) { data.writeUInt32LE(Buffer.byteLength(strings), at); strings += `${s.name}\0`; }
    data.writeUInt32LE(s.value ?? 0, at + 4); data.writeUInt32LE(s.size ?? 0, at + 8);
    data[at + 12] = ((s.bind ?? 0) << 4) | (s.type ?? 0); data.writeUInt16LE(s.shndx ?? 0, at + 14);
  });
  sections[9].data = Buffer.from(strings);
  sections[5].data = Buffer.alloc(resolved ? 0 : RELOCS.length * 8);
  if (!resolved) RELOCS.forEach(([offset, type, name], i) => {
    sections[5].data.writeUInt32LE(offset, i * 8);
    sections[5].data.writeUInt32LE((symbols.findIndex((s) => s.name === name) << 8) | type, i * 8 + 4);
  });
  let names = "\0";
  for (const s of sections.slice(1)) { s.nameOffset = Buffer.byteLength(names); names += `${s.name}\0`; }
  sections[10].data = Buffer.from(names);
  let end = 52;
  for (const s of sections.slice(1)) {
    const alignment = s.align || 1;
    end = Math.ceil(end / alignment) * alignment; s.offset = end; end += s.data?.length ?? 0;
  }
  const shoff = Math.ceil(end / 4) * 4, buffer = Buffer.alloc(shoff + sections.length * 40);
  Buffer.from([127, 69, 76, 70, 1, 1, 1]).copy(buffer);
  buffer.writeUInt16LE(1, 16); buffer.writeUInt16LE(40, 18); buffer.writeUInt32LE(1, 20);
  buffer.writeUInt32LE(shoff, 32); buffer.writeUInt32LE(0x05000000, 36);
  buffer.writeUInt16LE(52, 40); buffer.writeUInt16LE(40, 46);
  buffer.writeUInt16LE(sections.length, 48); buffer.writeUInt16LE(10, 50);
  sections.slice(1).forEach((s, i) => {
    const at = shoff + (i + 1) * 40;
    [s.nameOffset, s.type, s.flags, 0, s.offset, s.data?.length, s.link, s.info, s.align, s.entsize]
      .forEach((v, field) => buffer.writeUInt32LE(v ?? 0, at + field * 4));
    s.data?.copy(buffer, s.offset);
  });
  return buffer;
}
function syntheticEvidence() {
  const body = Buffer.alloc(OWNED);
  [0xe92d4010, 0xe1a04000, 0xebfffffe, 0xe1a02000, 0xe59f0018, 0xe3a01004,
    0xebfffffe, 0xe5900030, 0xe1a01004, 0xe8bd4010, 0xe2800018, 0xeafffffe, 0]
    .forEach((word, i) => body.writeUInt32LE(word, i * 4));
  const linked = Buffer.from(body), identity = 0x08001000; // Invented, outside all fixture functions.
  for (const [offset, type, name] of RELOCS) {
    const destination = Number.parseInt(name.slice(5), 16);
    linked.writeUInt32LE(type === 2 ? identity :
      ((type === 28 ? 0xeb000000 : 0xea000000) | (((destination - START - offset - 8) >> 2) & 0xffffff)) >>> 0, offset);
  }
  const code = Buffer.alloc(START - IMAGE_BASE + OWNED + 4);
  linked.copy(code, START - IMAGE_BASE);
  code.writeUInt32LE(identity, 0x0018bfc4 - IMAGE_BASE + 64);
  code.writeUInt32LE((0xea000000 | ((START - IMAGE_BASE - 8) >> 2)) >>> 0, 0);
  code.writeUInt32LE(START, 8); code.writeUInt32LE(START | 1, 12);
  const entries = [
    { address: IMAGE_BASE, name: "func_00100000", mode: "$a", size: BODY },
    ...RELOCS.filter(([, type]) => type !== 2).map(([, , name]) =>
      ({ address: Number.parseInt(name.slice(5), 16), name, mode: "$a", size: 4 })),
    { address: 0x0018bfc4, name: "func_0018BFC4", mode: "$a", size: 60 },
    { address: START, name: NAME, mode: "$a", size: BODY },
    { address: START + OWNED, name: "func_002AC084", mode: "$a", size: 4 },
  ].sort((a, b) => a.address - b.address);
  const hex = (n) => n.toString(16).toUpperCase().padStart(8, "0");
  const csv = Buffer.from("Location,Name,Namespace,Mode,Size,Segment\n" + entries
    .map((r) => `${hex(r.address)},${r.name},,${r.mode},${hex(r.size)},.text`).join("\n") + "\n");
  const sourceFiles = [[SOURCE, `${NAME}:\n`]];
  const manifests = [[CONFIG, { functions: [{ name: NAME, size: BODY, ownedSize: OWNED }] }],
    ["config/arm-ipc-wrappers-71.json", { functions: [{ name: "func_0018BFC4", size: 60,
      literals: [{ offset: 64, symbol: "ipc_service_registry_owner_71" }] }] }]];
  const report = { units: [{ functions: [{ name: NAME, size: BODY, fuzzy_match_percent: 100 }] }] };
  return { object: fixtureElf(body), target: fixtureElf(body),
    code, csv, rows: inventory(csv, code.length), sourceFiles, manifests, report };
}
function rejects(label, action) { let failed = false; try { action(); } catch { failed = true; } check(failed, `hostile self-test accepted ${label}`); }
function selfTest() {
  const { object, target, code, csv, rows, sourceFiles, manifests, report } = syntheticEvidence();
  validateEvidence(object, target, code, rows);
  auditOwnership(sourceFiles, manifests, report);
  same(auditBinary(code, rows), { directEntryTransfers: 1, alignedEntryPointers: 2, normalizedDuplicates: 0 },
    "synthetic binary audit baseline");
  const mutateObject = (label, mutation) => {
    const copy = Buffer.from(object), elf = parseElf(copy); mutation(copy, elf);
    rejects(label, () => validateEvidence(copy, target, code, rows));
  };
  mutateObject("instruction", (b, e) => { b[section(e, SECTION).offset + 4] ^= 1; });
  mutateObject("pool addend", (b, e) => { b[section(e, SECTION).offset + BODY] ^= 1; });
  mutateObject("call addend", (b, e) => { b[section(e, SECTION).offset + 8] ^= 1; });
  mutateObject("relocation kind", (b, e) => { b[section(e, `.rel${SECTION}`).offset + 4] ^= 1; });
  mutateObject("relocation symbol", (b, e) => { b[section(e, `.rel${SECTION}`).offset + 5] ^= 1; });
  mutateObject("ARM mapping", (b, e) => {
    const s = e.symbols.find((s) => s.name === "$a"); b.writeUInt32LE(1, e.table.offset + s.index * 16 + 4);
  });
  mutateObject("function Thumb state", (b, e) => {
    const s = e.symbols.find((s) => s.name === NAME); b.writeUInt32LE(1, e.table.offset + s.index * 16 + 4);
  });
  mutateObject("function size includes pool", (b, e) => {
    const s = e.symbols.find((s) => s.name === NAME); b.writeUInt32LE(OWNED, e.table.offset + s.index * 16 + 8);
  });
  mutateObject("data mapping", (b, e) => {
    const s = e.symbols.find((s) => s.name === "$d"); b.writeUInt32LE(BODY - 4, e.table.offset + s.index * 16 + 4);
  });
  mutateObject("symbol visibility", (b, e) => {
    const s = e.symbols.find((s) => s.name === NAME); b[e.table.offset + s.index * 16 + 13] = 1;
  });
  mutateObject("null symbol", (b, e) => { b[e.table.offset + 13] = 1; });
  mutateObject("symbol local/global partition", (b, e) => { b.writeUInt32LE(1, e.table.header + 28); });
  mutateObject("symbol section index", (b, e) => { b.writeUInt16LE(0xffff, e.table.offset + 16 + 14); });
  mutateObject("symbol string-table link", (b, e) => { b.writeUInt32LE(0, e.table.header + 24); });
  mutateObject("symbol name bounds", (b, e) => { b.writeUInt32LE(0xffffffff, e.table.offset + 16); });
  mutateObject("unterminated string", (b, e) => {
    const s = section(e, ".strtab"); b.fill(65, s.offset, s.offset + s.size);
  });
  mutateObject("foreign payload", (b, e) => { b.writeUInt32LE(6, section(e, ".ARM.attributes").header + 8); });
  mutateObject("attributes", (b, e) => { b[section(e, ".ARM.attributes").offset + 5] ^= 1; });
  mutateObject("section alignment", (b, e) => { b.writeUInt32LE(2, section(e, SECTION).header + 32); });
  mutateObject("ELF machine", (b) => { b.writeUInt16LE(3, 18); });
  mutateObject("ELF identity", (b) => { b[4] = 2; });
  mutateObject("ELF ABI", (b) => { b[7] = 1; });
  mutateObject("ELF flags", (b) => { b.writeUInt32LE(0, 36); });
  mutateObject("ELF program headers", (b) => { b.writeUInt32LE(52, 28); });
  mutateObject("ELF null section", (b) => { b[b.readUInt32LE(32)] = 1; });
  mutateObject("ELF table bounds", (b) => { b.writeUInt32LE(0xffffffff, 32); });
  mutateObject("ELF section data bounds", (b, e) => { b.writeUInt32LE(0xffffffff, section(e, SECTION).header + 16); });
  mutateObject("ELF section-name index", (b) => { b.writeUInt16LE(0, 50); });
  mutateObject("ELF section-name table type", (b, e) => { b.writeUInt32LE(1, section(e, ".shstrtab").header + 4); });
  mutateObject("symbol entry width", (b, e) => { b.writeUInt32LE(1, e.table.header + 36); });
  mutateObject("relocation entry width", (b, e) => { b.writeUInt32LE(1, section(e, `.rel${SECTION}`).header + 36); });
  mutateObject("relocation links", (b, e) => { b.writeUInt32LE(0, section(e, `.rel${SECTION}`).header + 24); });
  mutateObject("relocation symbol bounds", (b, e) => {
    b.writeUInt32LE(0xffffff02, section(e, `.rel${SECTION}`).offset + 4);
  });
  mutateObject("relocation destination bounds", (b, e) => {
    b.writeUInt32LE(OWNED, section(e, `.rel${SECTION}`).offset);
  });
  for (const [label, mutation] of [
    ["owner size", (b, e) => { b.writeUInt32LE(OWNED, e.table.offset + e.symbols.find((s) => s.name === NAME).index * 16 + 8); }],
    ["Thumb state", (b, e) => {
      const strings = section(e, ".strtab"); b[strings.offset + bytes(e, strings).indexOf(Buffer.from("$a")) + 1] = 116;
    }],
  ]) {
    const copy = Buffer.from(target), elf = parseElf(copy); mutation(copy, elf);
    rejects(`target ${label}`, () => validateEvidence(object, copy, code, rows));
  }
  const wrongTargetRelocation = Buffer.from(target), wrongTargetElf = parseElf(wrongTargetRelocation);
  wrongTargetRelocation[section(wrongTargetElf, `.rel${SECTION}`).offset + 4] ^= 1;
  rejects("target relocation kind", () => validateEvidence(object, wrongTargetRelocation, code, rows));
  const wrongTarget = Buffer.from(target), parsedTarget = parseElf(wrongTarget);
  wrongTarget[section(parsedTarget, SECTION).offset] ^= 1;
  rejects("authoritative target body", () => validateEvidence(object, wrongTarget, code, rows));
  for (const offset of [4, 8, 24, 44, 48]) {
    const copy = Buffer.from(code); copy[START - IMAGE_BASE + offset] ^= 1;
    rejects(`authoritative image +${offset}`, () => validateEvidence(object, target, copy, rows));
  }
  const competing = [...sourceFiles, ["src/main/hostile.S", `${NAME}:\n`]];
  rejects("competing source", () => auditOwnership(competing, manifests, report));
  rejects("competing manifest", () => auditOwnership(sourceFiles, [...manifests, ["hostile.json", { functions: [{ name: NAME }] }]], report));
  for (const text of [`.global ${NAME}\n`, `.globl ${NAME}\n`, `void ${NAME}(void) {}`])
    rejects("competing source declaration", () => auditOwnership([...sourceFiles, ["hostile.S", text]], manifests, report));
  for (const fn of [NAME, { name: "func_002AC04C", size: 8 },
    { name: "func_002AC04C", size: 4, literals: [{ offset: 52 }] }])
    rejects("competing manifest extent", () => auditOwnership(sourceFiles, [...manifests, ["hostile.json", { functions: [fn] }]], report));
  rejects("missing public identity witness", () => auditOwnership(sourceFiles, manifests.slice(0, 1), report));
  const wrongReport = structuredClone(report);
  wrongReport.units.flatMap((u) => u.functions ?? []).find((f) => f.name === NAME).fuzzy_match_percent = 99;
  rejects("partial report match", () => auditOwnership(sourceFiles, manifests, wrongReport));
  rejects("missing report", () => auditOwnership(sourceFiles, manifests, { units: [] }));
  rejects("duplicate report owner", () => auditOwnership(sourceFiles, manifests, { units: [...report.units, ...report.units] }));
  const wrongSizeReport = structuredClone(report); wrongSizeReport.units[0].functions[0].size = OWNED;
  rejects("report body size", () => auditOwnership(sourceFiles, manifests, wrongSizeReport));
  const header = "Location,Name,Namespace,Mode,Size,Segment\n";
  for (const [label, contents] of [
    ["header", csv.toString().replace("Location", "Address")],
    ["state", csv.toString().replace("$a", "$d")],
    ["alignment", `${header}002AC051,${NAME},,$a,00000030,.text`],
    ["bounds", `${header}FFFFFFFC,${NAME},,$a,00000004,.text`],
    ["duplicate", `${csv}${csv.toString().split("\n")[1]}\n`],
    ["overlap", `${header}002AC050,a,,$a,00000030,.text\n002AC054,b,,$a,00000004,.text`],
  ]) rejects(`inventory ${label}`, () => inventory(Buffer.from(contents), code.length));
  for (const [label, mutate] of [
    ["candidate mode", (r) => { r.find((v) => v.name === NAME).mode = "$t"; }],
    ["following boundary", (r) => { r.find((v) => v.name === "func_002AC084").address += 4; }],
    ["branch destination state", (r) => { r.find((v) => v.name === RELOCS[0][2]).mode = "$t"; }],
    ["literal witness owner", (r) => { r.find((v) => v.name === "func_0018BFC4").size = 64; }],
  ]) {
    const copy = structuredClone(rows); mutate(copy);
    rejects(label, () => validateEvidence(object, target, code, copy));
  }
  for (const identity of [0, 0x08001001, START]) {
    const copy = Buffer.from(code); copy.writeUInt32LE(identity, 0x0018bfc4 - IMAGE_BASE + 64);
    rejects("invalid literal identity", () => validateEvidence(object, target, copy, rows));
  }
  rejects("ARM interior inbound", () => checkInbound([{ from: 0x100000, destination: START + 4, mode: "$a" }]));
  rejects("Thumb pool inbound", () => checkInbound([{ from: 0x100000, destination: START + BODY, mode: "$t" }]));
  rejects("wrong inbound state", () => checkInbound([{ from: 0x100000, destination: START, mode: "$t" }]));
  rejects("foreign adjacent literal use", () => checkLiteralReferences([
    { from: START + 16, destination: START + BODY }, { from: 0x100000, destination: START + BODY },
  ]));
  for (const [label, mode, data, destinationMode] of [
    ["ARM B", "$a", [0xea000001], "$a"], ["ARM BL", "$a", [0xeb000001], "$a"],
    ["ARM BLX", "$a", [0xfa000001], "$t"],
    ["Thumb B", "$t", [0xe003], "$t"], ["Thumb conditional B", "$t", [0xd003], "$t"],
    ["Thumb BL", "$t", [0xf000, 0xf803], "$t"], ["Thumb BLX", "$t", [0xf000, 0xe804], "$a"],
  ]) {
    const fixture = Buffer.alloc(8), width = mode === "$a" ? 4 : 2;
    data.forEach((v, i) => width === 4 ? fixture.writeUInt32LE(v, i * width) : fixture.writeUInt16LE(v, i * width));
    const decoded = transfers(fixture, [{ address: IMAGE_BASE, size: data.length * width, mode }]);
    same(decoded, [{ from: IMAGE_BASE, destination: IMAGE_BASE + (mode === "$a" || label === "Thumb BLX" ? 12 : 10), mode: destinationMode }], `decode ${label}`);
  }
  const duplicate = rows.find((r) => r.mode === "$a" && r.size === BODY && r.name !== NAME);
  check(duplicate, "duplicate hostile fixture unavailable");
  const duplicatedCode = Buffer.from(code);
  code.copy(duplicatedCode, duplicate.address - IMAGE_BASE, START - IMAGE_BASE, START - IMAGE_BASE + BODY);
  // A duplicate with different branch displacements must still be rejected.
  for (const [offset, type] of RELOCS.filter(([, type]) => type !== 2))
    duplicatedCode.writeUInt32LE(type === 28 ? 0xeb000001 : 0xea000001, duplicate.address - IMAGE_BASE + offset);
  rejects("normalized duplicate", () => auditBinary(duplicatedCode, rows));
  for (const destination of [START + 4, START + BODY]) {
    const inbound = Buffer.from(code);
    inbound.writeUInt32LE((0xea000000 | ((destination - IMAGE_BASE - 8) >> 2)) >>> 0, 0);
    rejects("decoded interior/pool inbound", () => auditBinary(inbound, rows));
    for (const stateBit of [0, 1]) {
      const pointer = Buffer.from(code); pointer.writeUInt32LE(destination | stateBit, 8);
      rejects("interior/pool pointer", () => auditBinary(pointer, rows));
    }
  }
  const foreignLiteral = Buffer.from(code), from = START - 0x100;
  foreignLiteral.writeUInt32LE(0xe59f0128, from - IMAGE_BASE);
  const foreignRows = [...rows, { address: from, name: "func_002ABF50", mode: "$a", size: 4 }];
  rejects("decoded foreign pool reference", () => auditBinary(foreignLiteral, foreignRows));
  for (const [field, cap] of [["file", MAX_FILE], ["exec", MAX_EXEC], ["sections", MAX_SECTIONS], ["symbols", MAX_SYMBOLS], ["relocs", MAX_RELOCS]]) {
    limits({ [field]: cap }); rejects(`${field} cap`, () => limits({ [field]: cap + 1 }));
    for (const invalid of [-1, 0.5, NaN, Infinity]) rejects(`invalid ${field} limit`, () => limits({ [field]: invalid }));
  }
  mutateObject("parser section cap", (b) => { b.writeUInt16LE(MAX_SECTIONS + 1, 48); });
  mutateObject("parser executable cap", (b, e) => {
    const s = section(e, ".bss"); b.writeUInt32LE(4, s.header + 8); b.writeUInt32LE(MAX_EXEC + 1, s.header + 20);
  });
  for (const key of ["source", "config", "spec"]) {
    const inputs = { source: read(path.join(ROOT, SOURCE)), config: read(path.join(ROOT, CONFIG)), spec: read(path.join(ROOT, SPEC)) };
    inputs[key][0] ^= 1; rejects(`pinned ${key}`, () => pinned(inputs.source, inputs.config, inputs.spec));
  }
  rejects("truncated ELF", () => parseElf(object.subarray(0, 51)));
  same(options(["--self-test"]), { "--self-test": true }, "standalone CLI");
  for (const args of [[], ["--target", "target.o"], ["--code-bin", "code.bin"],
    ["--self-test", "--target", "target.o"], ["--self-test", "--object", "lane.o"],
    ["--self-test", "--self-test"], ["--self-test", "--unknown"], ["--target"]])
    rejects("CLI requires standalone tests or paired evidence", () => options(args));
}
function assembler() {
  const candidates = [process.env.ARM_AS, "arm-none-eabi-as"].filter(Boolean);
  try { for (const entry of fs.readdirSync("/nix/store").sort()) {
    const candidate = path.join("/nix/store", entry, "bin/arm-none-eabi-as");
    if (fs.existsSync(candidate)) candidates.push(candidate);
  } } catch {}
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 5000, maxBuffer: 65536 });
    if (!probe.error && probe.status === 0) return candidate;
  }
  throw new Error("ARM assembler unavailable; set ARM_AS or pass --object");
}
function options(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]; check(["--self-test", "--object", "--target", "--code-bin", "--report", "--inventory"].includes(arg), `unknown argument ${arg}`);
    check(!Object.hasOwn(result, arg), `duplicate argument ${arg}`);
    if (arg === "--self-test") result[arg] = true;
    else { check(args[i + 1] && !args[i + 1].startsWith("--"), `${arg} requires a path`); result[arg] = path.resolve(args[++i]); }
  }
  check(Boolean(result["--target"]) === Boolean(result["--code-bin"]), "--target and --code-bin must be supplied together");
  check(result["--target"] || (result["--self-test"] && Object.keys(result).length === 1),
    "use --self-test alone for synthetic tests, or supply --target and --code-bin for authoritative verification");
  return result;
}
function main() {
  const args = options(process.argv.slice(2)); pinned();
  if (args["--self-test"]) {
    selfTest();
    console.log("arm-ipc-wrappers-106: standalone synthetic self-tests PASS (ELF/resource/hostile/ownership contracts)");
  }
  if (!args["--target"]) return;
  let temporary;
  try {
    let objectPath = args["--object"];
    if (!objectPath) {
      temporary = fs.mkdtempSync(path.join(os.tmpdir(), "arm-ipc-wrappers-106-")); objectPath = path.join(temporary, "lane.o");
      const result = spawnSync(assembler(), ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, path.join(ROOT, SOURCE)],
        { encoding: "utf8", timeout: 30000, maxBuffer: 1024 * 1024 });
      check(!result.error && result.status === 0, `assembler failed: ${result.stderr ?? result.error}`);
    }
    const object = read(objectPath), target = read(args["--target"]), code = read(args["--code-bin"]);
    const rows = inventory(read(args["--inventory"] ?? path.join(ROOT, "symbols/code.bin.csv")), code.length);
    const sourceFiles = walk(path.join(ROOT, "src")).filter((f) => /\.(?:S|s|c|cpp|cc|h|inc)$/.test(f))
      .map((f) => [path.relative(ROOT, f), read(f).toString("utf8")]);
    const manifests = walk(path.join(ROOT, "config")).filter((f) => f.endsWith(".json"))
      .map((f) => [path.relative(ROOT, f), JSON.parse(read(f))]);
    const report = JSON.parse(read(args["--report"] ?? path.join(ROOT, "build/AS_EUR_REV2/report.json")));
    auditOwnership(sourceFiles, manifests, report);
    validateEvidence(object, target, code, rows);
    const audit = auditBinary(code, rows);
    console.log("arm-ipc-wrappers-106: PASS (48 body + 4 pool bytes; authoritative equality; ownership/report/duplicate/inbound audits)");
    console.log(JSON.stringify(audit));
  } finally { if (temporary) fs.rmSync(temporary, { recursive: true, force: true }); }
}
try { main(); } catch (error) {
  console.error(`arm-ipc-wrappers-106: FAIL: ${error.message}`); process.exitCode = 1;
}
