#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "src/main/arm_ipc_wrappers_107.S";
const CONFIG = "config/arm-ipc-wrappers-107.json";
const SPEC = "docs/specs/main/arm_ipc_wrappers_107.md";
const PINS = {"source":"29c7f84b933a0a530c4de486a17b01f8e40a22c0ffb51af86d0a884244dc1796","config":"178063f334b3f63f835a50ef8ce11d0864ce86bbd10fa25552f6ed326dae3886","spec":"8279228e8d15517a7aaa6518ced79b442ec43a3127bb45d134783bd391e8d0e6"};
const NAME = "func_003AC2A0", SECTION = `.text.${NAME}`;
const START = 0x003ac2a0, BODY = 332, OWNED = 336, IMAGE_BASE = 0x00100000;
const MAX_FILE = 64 * 1024 * 1024, MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384, MAX_SYMBOLS = 1_000_000, MAX_RELOCS = 1_000_000;
const RELOCS = [[328, 29, "func_003A7EE8"], [332, 2, "service_handle_owner_dispatch_107"]];
const LOCAL_BRANCHES = [32, 56, 80, 104, 128, 152, 176, 208, 228, 248, 268, 288, 308];
const SVC_OFFSETS = [36, 60, 84, 108, 132, 156, 180, 212, 232, 252, 272, 292, 312];
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
  check(shoff >= 52 && shoff % 4 === 0, "section table location/alignment");
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
  const payloads = sections.filter((s) => s.type !== 8 && s.size)
    .map((s) => [s.offset, s.offset + s.size]);
  payloads.push([0, 52], [shoff, shoff + count * 40]);
  payloads.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < payloads.length; i++) check(payloads[i][0] >= payloads[i - 1][1], "overlapping ELF payloads/headers");
  for (const s of sections.slice(1)) {
    check(s.align === 0 || (s.align & (s.align - 1)) === 0, "section alignment power of two");
    check(s.align <= 1 || s.offset % s.align === 0, "misaligned section payload");
    check(s.addr === 0, "nonzero relocatable section address");
  }
  check(sections[shstr].type === 3, "section-name table type");
  const names = buffer.subarray(sections[shstr].offset, sections[shstr].offset + sections[shstr].size);
  check(names[0] === 0, "section names must start with null");
  for (const s of sections) s.name = stringAt(names, s.nameOffset);
  check(new Set(sections.map((s) => s.name)).size === count, "duplicate section names");
  const tables = sections.filter((s) => s.type === 2 || s.type === 11);
  check(tables.length === 1 && tables[0].type === 2, "one SYMTAB, no DYNSYM");
  const table = tables[0];
  check(table.flags === 0 && table.align === 4, "symbol table metadata");
  check(table.link < count && sections[table.link].type === 3, "symbol string-table link");
  const strings = sections[table.link];
  const data = buffer.subarray(strings.offset, strings.offset + strings.size);
  check(data[0] === 0, "symbol strings must start with null");
  const symbols = Array.from({ length: table.size / 16 }, (_, index) => {
    const p = table.offset + index * 16;
    return { index, name: stringAt(data, u32(p)), nameOffset: u32(p), value: u32(p + 4), size: u32(p + 8),
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
  const metadata = new Set([".ARM.attributes", ".symtab", ".strtab", ".shstrtab"]);
  for (const s of elf.sections.slice(1)) {
    if (s.name === SECTION || s.name === `.rel${SECTION}` || metadata.has(s.name)) continue;
    check([1, 8].includes(s.type) && s.size === 0 && s.link === 0 && s.info === 0 &&
      s.entsize === 0 && (s.flags & ~7) === 0, "foreign section payload/metadata");
  }
  same([elf.table.name, elf.sections[elf.table.link].name], [".symtab", ".strtab"], "canonical symbol tables");
  const shstr = section(elf, ".shstrtab"), strtab = section(elf, ".strtab");
  check(elf.sections[buffer.readUInt16LE(50)] === shstr, "canonical section-name table");
  for (const s of [shstr, strtab]) same([s.type, s.flags, s.align, s.link, s.info, s.entsize],
    [3, 0, 1, 0, 0, 0], "string-table metadata");
  const shape = (s) => [s.name, s.value, s.size, s.bind, s.type, s.other];
  same(elf.symbols.filter((s) => s.shndx === owned.index).map(shape), [
    ["", 0, 0, 0, 3, 0], ["$a", 0, 0, 0, 0, 0], ["$d", BODY, 0, 0, 0, 0],
    [NAME, 0, BODY, 1, 2, 0],
  ], "complete owned symbols / ARM and data state");
  const undefineds = elf.symbols.filter((s) => s.index > 0 && s.shndx === 0);
  same(undefineds.map(shape), RELOCS.map((r) => [r[2], 0, 0, 1, 0, 0]), "undefined identities");
  const foreignSymbolSections = new Set();
  for (const s of elf.symbols.filter((s) => s.index > 0 && s.shndx !== 0 && s.shndx !== owned.index)) {
    check(s.name === "" && s.value === 0 && s.size === 0 && s.bind === 0 && s.type === 3 && s.other === 0 &&
      s.shndx < elf.sections.length && (elf.sections[s.shndx].name === ".ARM.attributes" ||
        ([1, 8].includes(elf.sections[s.shndx].type) && elf.sections[s.shndx].size === 0)), "foreign or alias symbol");
    check(!foreignSymbolSections.has(s.shndx), "duplicate foreign section symbol");
    foreignSymbolSections.add(s.shndx);
  }
  same(elf.relocations.map((r) => [r.target, r.offset, r.type, r.symbol, r.format, r.explicitAddend]),
    RELOCS.map(([offset, type, symbol]) => [owned.index, offset, type, symbol, 9, 0]), "exact REL relocation contract");
  const relsec = section(elf, `.rel${SECTION}`);
  same([relsec.type, relsec.flags, relsec.addr, relsec.size, relsec.align, relsec.entsize],
    [9, 0x40, 0, RELOCS.length * 8, 4, 8], "relocation section metadata");
  check(elf.sections.filter((s) => s.type === 9 || s.type === 4).length === 1, "exact relocation section set");
  for (const [offset, type] of RELOCS) {
    const word = buffer.readUInt32LE(owned.offset + offset);
    if (type === 2) check(word === 0, "ABS32 zero addend");
    else check(word === (type === 28 ? 0xebfffffe : 0xeafffffe), "branch instruction/state/zero addend");
  }
  const attr = section(elf, ".ARM.attributes");
  same([attr.type, attr.flags, attr.align, attr.link, attr.info, attr.entsize],
    [0x70000003, 0, 1, 0, 0, 0], "attribute section metadata");
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
    check(name === `func_${address}`, "inventory primary entry identity");
    check(row.mode === "$a" || row.mode === "$t", "inventory state");
    check(row.size > 0 && row.address % (mode === "$a" ? 4 : 2) === 0 && row.size % (mode === "$a" ? 4 : 2) === 0,
      "inventory alignment");
    bounded(row.address - IMAGE_BASE, row.size, codeLength, "inventory body"); return row;
  });
  check(new Set(rows.map((r) => r.name)).size === rows.length, "duplicate inventory names");
  limits({ exec: rows.reduce((sum, r) => sum + r.size, 0) });
  for (let i = 1; i < rows.length; i++) check(rows[i - 1].address + rows[i - 1].size <= rows[i].address, "overlapping inventory bodies");
  return rows;
}
function literalIdentity(code, rows) {
  bounded(START - IMAGE_BASE + BODY, 4, code.length, "owned literal slot");
  const identity = code.readUInt32LE(START - IMAGE_BASE + BODY);
  check(identity !== 0 && identity % 4 === 0 &&
    !rows.some((r) => identity >= r.address && identity < r.address + r.size), "opaque dispatch data identity");
  bounded(identity - IMAGE_BASE, 4, code.length, "dispatch identity witness");
  check(code.readUInt32LE(identity - IMAGE_BASE) === START, "dispatch identity first slot must target official entry");
  return identity;
}
function auditLiteralIdentities(code, rows, manifests) {
  const identity = literalIdentity(code, rows);
  for (const [filename, manifest] of manifests) {
    if (filename === CONFIG) continue;
    const identities = manifest.literalIdentities ?? [];
    check(!JSON.stringify(identities).includes('"service_handle_owner_dispatch_107"'), "new literal identity already public");
    for (const fn of manifest.functions ?? []) {
      if (typeof fn !== "object" || !/^func_[0-9A-Fa-f]{8}$/.test(fn.name ?? "")) continue;
      const start = Number.parseInt(fn.name.slice(5), 16);
      for (const literal of fn.literals ?? []) {
        check(literal.symbol !== "service_handle_owner_dispatch_107", "new literal identity already assigned");
        if (!Number.isSafeInteger(literal.offset)) continue;
        bounded(start - IMAGE_BASE + literal.offset, 4, code.length, "public literal identity slot");
        check(code.readUInt32LE(start - IMAGE_BASE + literal.offset) !== identity,
          "new literal identity aliases an existing public slot");
      }
    }
  }
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
  same([rows[index + 1]?.name, rows[index + 1]?.address], ["func_003AC3F0", START + OWNED], "exact following ownership boundary");
  const imageOffset = START - IMAGE_BASE;
  bounded(imageOffset, OWNED, code.length, "owned private image extent");
  check(bytes(target, reference).equals(bytes(elf, candidate)), "base/target neutral owned-section equality");
  const linked = Buffer.from(bytes(elf, candidate));
  const targetLinked = Buffer.from(bytes(target, reference));
  for (const [offset, type, symbol] of RELOCS) {
    if (type === 2) {
      const identity = literalIdentity(code, rows);
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
  check(linked.readUInt32LE(8) === 0xe59f013c, "sole PC-relative load must address the adjacent identity slot");
  same(transfers(code, [rows[index]]).map((t) => [t.from - START, t.destination - START, t.mode]),
    [...LOCAL_BRANCHES.map((offset) => [offset, offset + 12, "$a"]), [328, 0x003a7ee8 - START, "$a"]],
    "exact local and external transfer schedule");
  for (const offset of LOCAL_BRANCHES) check(linked.readUInt32LE(offset) >>> 28 === 0, "local branch condition");
  const svc = [];
  for (let offset = 0; offset < BODY; offset += 4) {
    const word = linked.readUInt32LE(offset);
    if ((word & 0x0f000000) === 0x0f000000 && word >>> 28 !== 15) svc.push([offset, word]);
  }
  same(svc, SVC_OFFSETS.map((offset) => [offset, 0xef000023]), "exact supervisor-call schedule");
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
      if (transfer.from >= START && transfer.from < START + BODY) {
        const offset = transfer.from - START;
        check(LOCAL_BRANCHES.includes(offset) && transfer.destination === transfer.from + 12 &&
          transfer.mode === "$a", "undeclared internal transfer");
        continue;
      }
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
  same(owned, [{ from: START + 8, destination: START + BODY }], "exact PC-relative ownership/reachability");
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
    const pointer = code.readUInt32LE(offset), value = (pointer & 0xfffffffe) >>> 0;
    check(value <= START || value >= START + OWNED, "aligned pointer targets interior/pool");
    if (value === START) { check(pointer === START, "entry pointer has Thumb state"); pointerEntries++; }
  }
  return { directEntryTransfers: entries, alignedEntryPointers: pointerEntries, normalizedDuplicates: 0 };
}
function pinned(source = read(path.join(ROOT, SOURCE)), config = read(path.join(ROOT, CONFIG)), spec = read(path.join(ROOT, SPEC))) {
  check(hash(source) === PINS.source, "pinned source hash");
  check(hash(config) === PINS.config, "pinned config hash"); check(hash(spec) === PINS.spec, "pinned spec hash");
  check(JSON.parse(config).sourceHash === PINS.source, "config/source hash agreement");
}
function rejects(label, action, pattern) {
  try { action(); } catch (error) {
    check(!pattern || pattern.test(error.message), `hostile ${label} failed for wrong reason: ${error.message}`);
    return;
  }
  throw new Error(`hostile self-test accepted ${label}`);
}
function encodeFixture(sections, shstr) {
  const nameParts = [Buffer.from([0])]; let nameSize = 1;
  for (const s of sections.slice(1)) {
    s.nameOffset = nameSize; const part = Buffer.from(`${s.name}\0`);
    nameParts.push(part); nameSize += part.length;
  }
  sections[shstr].data = Buffer.concat(nameParts);
  let cursor = 52;
  for (const s of sections.slice(1)) {
    const align = Math.max(s.align, 1); cursor = Math.ceil(cursor / align) * align;
    s.offset = cursor; s.size = s.data.length;
    if (s.type !== 8) cursor += s.size;
  }
  const shoff = Math.ceil(cursor / 4) * 4, result = Buffer.alloc(shoff + sections.length * 40);
  Buffer.from([127, 69, 76, 70, 1, 1, 1]).copy(result);
  result.writeUInt16LE(1, 16); result.writeUInt16LE(40, 18); result.writeUInt32LE(1, 20);
  result.writeUInt32LE(shoff, 32); result.writeUInt32LE(0x05000000, 36);
  result.writeUInt16LE(52, 40); result.writeUInt16LE(40, 46);
  result.writeUInt16LE(sections.length, 48); result.writeUInt16LE(shstr, 50);
  for (const s of sections.slice(1)) {
    if (s.type !== 8) s.data.copy(result, s.offset);
    const p = shoff + s.index * 40;
    [s.nameOffset, s.type, s.flags, s.addr, s.offset, s.size, s.link, s.info, s.align, s.entsize]
      .forEach((v, i) => result.writeUInt32LE(v, p + i * 4));
  }
  return result;
}
function syntheticEvidence() {
  // Deliberately artificial instructions and data: no assembler, target, ROM,
  // repository inventory, or build report is needed to exercise the contracts.
  const body = Buffer.alloc(OWNED);
  for (let offset = 0; offset < BODY; offset += 4) body.writeUInt32LE(0xe1a00000, offset);
  body.writeUInt32LE(0xe59f013c, 8);
  for (const offset of LOCAL_BRANCHES) body.writeUInt32LE(0x0a000001, offset);
  for (const offset of SVC_OFFSETS) body.writeUInt32LE(0xef000023, offset);
  body.writeUInt32LE(0xeafffffe, 328);

  function objectFixture(payload, resolved) {
    const sections = [{ index: 0 }];
    const add = (name, type, data, metadata = {}) => {
      const s = { index: sections.length, name, type, data, flags: 0, addr: 0,
        link: 0, info: 0, entsize: 0, align: 1, ...metadata };
      sections.push(s); return s;
    };
    const owned = add(SECTION, 1, payload, { flags: 6, align: 4 });
    const rel = resolved ? undefined : add(`.rel${SECTION}`, 9, Buffer.alloc(16),
      { flags: 0x40, info: owned.index, align: 4, entsize: 8 });
    add(".ARM.attributes", 0x70000003, Buffer.from(ATTRIBUTES, "hex"));
    const table = add(".symtab", 2, Buffer.alloc(0), { align: 4, entsize: 16 });
    const strings = add(".strtab", 3, Buffer.alloc(0));
    const names = add(".shstrtab", 3, Buffer.alloc(0));
    const stringParts = [Buffer.from([0])], symbols = [Buffer.alloc(16)]; let stringSize = 1;
    const symbol = (name, value, size, info, shndx) => {
      const data = Buffer.alloc(16);
      if (name) {
        data.writeUInt32LE(stringSize); const part = Buffer.from(`${name}\0`);
        stringParts.push(part); stringSize += part.length;
      }
      data.writeUInt32LE(value, 4); data.writeUInt32LE(size, 8);
      data[12] = info; data.writeUInt16LE(shndx, 14);
      symbols.push(data); return symbols.length - 1;
    };
    symbol("", 0, 0, 3, owned.index); symbol("$a", 0, 0, 0, owned.index);
    if (!resolved) symbol("$d", BODY, 0, 0, owned.index);
    table.info = symbols.length;
    symbol(NAME, 0, BODY, 0x12, owned.index);
    if (rel) {
      RELOCS.forEach(([offset, type, name], i) => {
        rel.data.writeUInt32LE(offset, i * 8);
        rel.data.writeUInt32LE((symbol(name, 0, 0, 0x10, 0) << 8) | type, i * 8 + 4);
      });
      rel.link = table.index;
    }
    table.data = Buffer.concat(symbols); table.link = strings.index;
    strings.data = Buffer.concat(stringParts);
    return encodeFixture(sections, names.index);
  }
  const object = objectFixture(body, false), linked = Buffer.from(body);
  const dispatch = IMAGE_BASE + 0x100; // Synthetic dispatch data outside all fixture bodies.
  linked.writeUInt32LE((0xea000000 | (((0x003a7ee8 - (START + 328 + 8)) / 4) & 0xffffff)) >>> 0, 328);
  linked.writeUInt32LE(dispatch, BODY);
  const code = Buffer.alloc(START - IMAGE_BASE + OWNED + 4);
  linked.copy(code, START - IMAGE_BASE); code.writeUInt32LE(START, dispatch - IMAGE_BASE);
  const duplicateAddress = IMAGE_BASE + 0x1000;
  const csv = Buffer.from(`Location,Name,Namespace,Mode,Size,Segment\n` + [
    [duplicateAddress, BODY], [0x003a7ee8, 4], [START, BODY], [START + OWNED, 4],
  ].map(([address, size]) => {
    const hex = address.toString(16).toUpperCase().padStart(8, "0");
    return `${hex},func_${hex},,$a,${size.toString(16).toUpperCase().padStart(8, "0")},.text`;
  }).join("\n"));
  const rows = inventory(csv, code.length);
  const sourceFiles = [[SOURCE, `${NAME}:\n`], ["fixture.S", "func_00101000:\n"]];
  const manifests = [[CONFIG, { functions: [{ name: NAME, ownedSize: OWNED }] }],
    ["fixture.json", { functions: [{ name: "func_00101000", size: BODY,
      literals: [{ offset: BODY, symbol: "fixture_data" }] }] }]];
  const report = { units: [{ functions: [{ name: NAME, size: BODY, fuzzy_match_percent: 100 }] }] };
  return [object, object, code, rows, sourceFiles, manifests, report];
}
function makeFixture(object, { foreignCount = 0, extraSections = [] } = {}) {
  const elf = parseElf(object);
  const sections = elf.sections.map((s) => ({ ...s, data: Buffer.from(bytes(elf, s)) }));
  const locals = [];
  for (let i = 0; i < foreignCount; i++) {
    const index = sections.length;
    sections.push({ index, name: `.text.fixture.${i}`, type: 1, flags: 6, align: 4,
      addr: 0, link: 0, info: 0, entsize: 0, size: 0, data: Buffer.alloc(0) });
    const symbol = Buffer.alloc(16); symbol[12] = 3; symbol.writeUInt16LE(index, 14); locals.push(symbol);
  }
  for (const extra of extraSections) sections.push({ index: sections.length, addr: 0, flags: 0,
    link: 0, info: 0, entsize: 0, align: 4, ...extra });
  const table = sections[elf.table.index], split = elf.table.info * 16;
  table.data = Buffer.concat([table.data.subarray(0, split), ...locals, table.data.subarray(split)]);
  table.info += foreignCount;
  for (const r of sections.filter((s) => s.type === 9 || s.type === 4)) {
    if (r.index >= elf.sections.length) continue;
    for (let p = 0; p < r.data.length; p += r.entsize) {
      const info = r.data.readUInt32LE(p + 4), symbol = info >>> 8;
      r.data.writeUInt32LE(((symbol + (symbol >= elf.table.info ? foreignCount : 0)) << 8) | (info & 255), p + 4);
    }
  }
  return encodeFixture(sections, object.readUInt16LE(50));
}
function selfTest(object, target, code, rows, sourceFiles, manifests, report) {
  same(options(["--self-test"]), { "--self-test": true }, "standalone self-test arguments");
  for (const args of [[], ["--target", "target.o"], ["--code-bin", "code.bin"],
    ["--self-test", "--target", "target.o"], ["--self-test", "--code-bin", "code.bin"]])
    rejects("incomplete authoritative arguments", () => options(args), /--target and --code-bin/);
  for (const arg of ["--object", "--inventory", "--report"])
    rejects("evidence override without authoritative inputs", () => options(["--self-test", arg, "fixture"]), /require --target and --code-bin/);
  for (const args of [["--self-test", "--self-test"], ["--unknown"], ["--target"]])
    rejects("malformed arguments", () => options(args));
  for (const selfTestArgs of [[], ["--self-test"]]) {
    const args = options([...selfTestArgs, "--target", "target.o", "--code-bin", "code.bin"]);
    check(args["--target"] === path.resolve("target.o") && args["--code-bin"] === path.resolve("code.bin"),
      "authoritative arguments remain available with and without self-tests");
  }
  validateEvidence(object, target, code, rows);
  auditOwnership(sourceFiles, manifests, report);
  auditLiteralIdentities(code, rows, manifests);
  same(auditBinary(code, rows), { directEntryTransfers: 0, alignedEntryPointers: 1, normalizedDuplicates: 0 },
    "synthetic binary audit");
  validateEvidence(makeFixture(object, { foreignCount: 12_000 }), target, code, rows);
  const mutateObject = (label, mutation) => {
    const copy = Buffer.from(object), elf = parseElf(copy); mutation(copy, elf);
    rejects(label, () => validateEvidence(copy, target, code, rows));
  };
  for (let offset = 0; offset < BODY; offset += 4)
    mutateObject(`instruction +${offset}`, (b, e) => { b[section(e, SECTION).offset + offset] ^= 1; });
  mutateObject("pool addend", (b, e) => { b[section(e, SECTION).offset + BODY] ^= 1; });
  mutateObject("branch addend", (b, e) => { b[section(e, SECTION).offset + 328] ^= 1; });
  mutateObject("relocation kind", (b, e) => { b[section(e, `.rel${SECTION}`).offset + 4] ^= 1; });
  mutateObject("relocation symbol", (b, e) => { b[section(e, `.rel${SECTION}`).offset + 5] ^= 1; });
  mutateObject("relocation site", (b, e) => { b.writeUInt32LE(324, section(e, `.rel${SECTION}`).offset); });
  mutateObject("duplicate relocation", (b, e) => {
    const p = section(e, `.rel${SECTION}`).offset; b.copy(b, p + 8, p, p + 8);
  });
  mutateObject("relocation symbol range", (b, e) => { b.writeUInt32LE(0xffffff02, section(e, `.rel${SECTION}`).offset + 4); });
  for (const [field, value] of [[4, 4], [8, 0], [12, 4], [20, 8], [24, 0], [28, 0], [32, 8], [36, 4]])
    mutateObject(`relocation metadata ${field}`, (b, e) => b.writeUInt32LE(value, section(e, `.rel${SECTION}`).header + field));
  mutateObject("ARM mapping", (b, e) => {
    const s = e.symbols.find((s) => s.name === "$a"); b.writeUInt32LE(1, e.table.offset + s.index * 16 + 4);
  });
  mutateObject("function Thumb state", (b, e) => {
    const s = e.symbols.find((s) => s.name === NAME); b.writeUInt32LE(1, e.table.offset + s.index * 16 + 4);
  });
  for (const [name, field, value] of [["$a", 8, 4], ["$a", 12, 2], ["$d", 4, 0],
    [NAME, 8, 4], [NAME, 12, 0x10], [NAME, 13, 1], [NAME, 14, 0],
    ["func_003A7EE8", 4, 4], ["func_003A7EE8", 8, 4], ["func_003A7EE8", 12, 0x12],
    ["service_handle_owner_dispatch_107", 4, 4], ["service_handle_owner_dispatch_107", 8, 4],
    ["service_handle_owner_dispatch_107", 13, 1], ["service_handle_owner_dispatch_107", 14, 1]]) {
    mutateObject(`symbol ${name}/${field}`, (b, e) => {
      const s = e.symbols.find((s) => s.name === name), p = e.table.offset + s.index * 16 + field;
      if (field >= 12) b[p] = value; else b.writeUInt32LE(value, p);
    });
  }
  mutateObject("split identities", (b, e) => {
    const a = e.symbols.find((s) => s.name === "func_003A7EE8"), z = e.symbols.find((s) => s.name === "service_handle_owner_dispatch_107");
    b.writeUInt32LE(a.nameOffset, e.table.offset + z.index * 16);
  });
  mutateObject("missing owned section symbol", (b, e) => {
    const s = e.symbols.find((s) => s.shndx === section(e, SECTION).index && s.type === 3);
    b.writeUInt32LE(4, e.table.offset + s.index * 16 + 4);
  });
  mutateObject("symbol visibility", (b, e) => { b[e.table.offset + 13] = 1; });
  mutateObject("foreign payload", (b, e) => { b.writeUInt32LE(6, section(e, ".ARM.attributes").header + 8); });
  mutateObject("attributes", (b, e) => { b[section(e, ".ARM.attributes").offset + 5] ^= 1; });
  mutateObject("section alignment", (b, e) => { b.writeUInt32LE(2, section(e, SECTION).header + 32); });
  for (const [field, value] of [[4, 8], [8, 7], [12, 4], [20, BODY], [24, 1], [28, 1], [36, 4]])
    mutateObject(`owned metadata ${field}`, (b, e) => b.writeUInt32LE(value, section(e, SECTION).header + field));
  mutateObject("ELF identity", (b) => { b[4] = 2; });
  mutateObject("ELF endian", (b) => { b[5] = 2; });
  mutateObject("ELF ABI", (b) => { b[7] = 1; });
  mutateObject("ELF flags", (b) => { b.writeUInt32LE(0, 36); });
  mutateObject("program headers", (b) => { b.writeUInt32LE(52, 28); });
  mutateObject("entry point", (b) => { b.writeUInt32LE(4, 24); });
  mutateObject("ELF machine", (b) => { b.writeUInt16LE(3, 18); });
  mutateObject("ELF table bounds", (b) => { b.writeUInt32LE(0xffffffff, 32); });
  mutateObject("symbol entry width", (b, e) => { b.writeUInt32LE(1, e.table.header + 36); });
  mutateObject("relocation entry width", (b, e) => { b.writeUInt32LE(1, section(e, `.rel${SECTION}`).header + 36); });
  mutateObject("section zero", (b) => { b.writeUInt32LE(1, b.readUInt32LE(32)); });
  mutateObject("overlapping payload", (b, e) => {
    b.writeUInt32LE(section(e, SECTION).offset, section(e, ".strtab").header + 16);
  });
  mutateObject("symbol string index", (b, e) => { b.writeUInt32LE(0xffffffff, e.table.offset + 16); });
  const wrongTarget = Buffer.from(target), parsedTarget = parseElf(wrongTarget);
  wrongTarget[section(parsedTarget, SECTION).offset] ^= 1;
  rejects("authoritative target body", () => validateEvidence(object, wrongTarget, code, rows));
  for (const offset of [4, 8, 32, 36, 196, 328, 332]) {
    const copy = Buffer.from(code); copy[START - IMAGE_BASE + offset] ^= 1;
    rejects(`authoritative image +${offset}`, () => validateEvidence(object, target, copy, rows));
  }
  const changedBody = Buffer.from(code), changedTarget = Buffer.from(target), targetElf = parseElf(changedTarget);
  changedBody[START - IMAGE_BASE + 328] ^= 1;
  changedTarget[section(targetElf, SECTION).offset + 328] ^= 1;
  rejects("resolved target branch identity", () => validateEvidence(object, changedTarget, changedBody, rows));
  const changedWitness = Buffer.from(code);
  changedWitness[literalIdentity(code, rows) - IMAGE_BASE] ^= 1;
  rejects("dispatch identity witness", () => validateEvidence(object, target, changedWitness, rows));
  const changedRows = structuredClone(rows);
  changedRows.find((r) => r.name === "func_003A7EE8").mode = "$t";
  rejects("destination state", () => validateEvidence(object, target, code, changedRows));
  const changedBoundary = structuredClone(rows);
  changedBoundary.find((r) => r.name === "func_003AC3F0").address += 4;
  rejects("adjacent boundary", () => validateEvidence(object, target, code, changedBoundary));
  rejects("literal identity alias", () => auditLiteralIdentities(code, rows, [...manifests,
    ["hostile.json", { functions: [{ name: NAME, literals: [{ offset: BODY, symbol: "hostile_alias" }] }] }]]));
  const competing = [...sourceFiles, ["src/main/hostile.S", `${NAME}:\n`]];
  rejects("competing source", () => auditOwnership(competing, manifests, report));
  for (const text of [`.global ${NAME}\n`, `.globl ${NAME}\n`, `void ${NAME}(void) {}`])
    rejects("competing source declaration", () => auditOwnership([...sourceFiles, ["hostile.S", text]], manifests, report), /competing source owner/);
  rejects("competing manifest", () => auditOwnership(sourceFiles, [...manifests, ["hostile.json", { functions: [{ name: NAME }] }]], report));
  rejects("string manifest owner", () => auditOwnership(sourceFiles, [...manifests,
    ["hostile.json", { functions: [NAME] }]], report), /competing manifest owner/);
  rejects("overlapping manifest", () => auditOwnership(sourceFiles, [...manifests,
    ["hostile.json", { functions: [{ name: "func_003AC29C", ownedSize: 8 }] }]], report));
  for (const extent of [{ size: 8 }, { bodySize: 8 }, { literals: [{ offset: 4 }] }])
    rejects("overlapping manifest body/pool", () => auditOwnership(sourceFiles, [...manifests,
      ["hostile.json", { functions: [{ name: "func_003AC29C", ...extent }] }]], report), /overlapping manifest extent/);
  for (const manifest of [{ literalIdentities: [RELOCS[1][2]] },
    { functions: [{ name: "func_00101000", literals: [{ offset: 0, symbol: RELOCS[1][2] }] }] }])
    rejects("existing public literal identity", () => auditLiteralIdentities(code, rows, [...manifests,
      ["hostile.json", manifest]]), /new literal identity already/);
  const wrongReport = structuredClone(report);
  wrongReport.units.flatMap((u) => u.functions ?? []).find((f) => f.name === NAME).fuzzy_match_percent = 99;
  rejects("partial report match", () => auditOwnership(sourceFiles, manifests, wrongReport));
  rejects("missing report", () => auditOwnership(sourceFiles, manifests, { units: [] }));
  rejects("duplicate report entry", () => auditOwnership(sourceFiles, manifests,
    { units: [...report.units, ...report.units] }), /authoritative report candidate entry/);
  rejects("wrong report size", () => auditOwnership(sourceFiles, manifests,
    { units: [{ functions: [{ name: NAME, size: BODY + 4 }] }] }), /authoritative report candidate entry/);
  const partial = structuredClone(report);
  partial.units.flatMap((u) => u.functions ?? []).find((f) => f.name === NAME).fuzzy_match_percent = 0.01;
  rejects("partial report match", () => auditOwnership(sourceFiles, manifests, partial));
  rejects("ARM interior inbound", () => checkInbound([{ from: 0x100000, destination: START + 4, mode: "$a" }]));
  rejects("Thumb pool inbound", () => checkInbound([{ from: 0x100000, destination: START + BODY, mode: "$t" }]));
  rejects("wrong inbound state", () => checkInbound([{ from: 0x100000, destination: START, mode: "$t" }]));
  rejects("undeclared internal transfer", () => checkInbound([{ from: START + 4, destination: START + 12, mode: "$a" }]));
  rejects("foreign adjacent literal use", () => checkLiteralReferences([
    { from: START + 8, destination: START + BODY }, { from: 0x100000, destination: START + BODY },
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
  rejects("normalized duplicate", () => auditBinary(duplicatedCode, rows));
  const pointer = Buffer.from(code); pointer.writeUInt32LE(START + 4, 0);
  rejects("interior pointer", () => auditBinary(pointer, rows));
  pointer.writeUInt32LE(START + BODY, 0);
  rejects("pool pointer", () => auditBinary(pointer, rows));
  pointer.writeUInt32LE(START | 1, 0);
  rejects("Thumb entry pointer", () => auditBinary(pointer, rows));
  for (const [name, flags] of [[".text.hostile", 6], [".data.hostile", 3]])
    rejects("foreign payload", () => validateObject(makeFixture(object,
      { extraSections: [{ name, type: 1, flags, data: Buffer.alloc(4) }] })));
  rejects("empty foreign relocation", () => validateObject(makeFixture(object,
    { extraSections: [{ name: ".rel.hostile", type: 9, entsize: 8, data: Buffer.alloc(0) }] })));
  for (const [field, cap] of [["file", MAX_FILE], ["exec", MAX_EXEC], ["sections", MAX_SECTIONS], ["symbols", MAX_SYMBOLS], ["relocs", MAX_RELOCS]]) {
    limits({ [field]: cap }); rejects(`${field} cap`, () => limits({ [field]: cap + 1 }));
  }
  rejects("parser file cap", () => parseElf(Buffer.alloc(MAX_FILE + 1)), /file resource cap/);
  rejects("parser executable cap", () => parseElf(makeFixture(object, { extraSections: [
    { name: ".text.large", type: 1, flags: 6, data: Buffer.alloc(MAX_EXEC) },
  ] })), /executable resource cap/);
  rejects("parser section cap", () => parseElf(makeFixture(object, { foreignCount: MAX_SECTIONS })), /section resource cap/);
  rejects("parser aggregate symbol cap", () => parseElf(makeFixture(object, { extraSections: [
    { name: ".symtab.extra", type: 2, entsize: 16, data: Buffer.alloc(500_001 * 16) },
    { name: ".dynsym.extra", type: 11, entsize: 16, data: Buffer.alloc(500_001 * 16) },
  ] })), /symbol resource cap/);
  rejects("parser combined REL/RELA cap", () => parseElf(makeFixture(object, { extraSections: [
    { name: ".rel.extra", type: 9, entsize: 8, data: Buffer.alloc(500_001 * 8) },
    { name: ".rela.extra", type: 4, entsize: 12, data: Buffer.alloc(500_001 * 12) },
  ] })), /relocation resource cap/);
  for (const key of ["source", "config", "spec"]) {
    const inputs = { source: read(path.join(ROOT, SOURCE)), config: read(path.join(ROOT, CONFIG)), spec: read(path.join(ROOT, SPEC)) };
    inputs[key][0] ^= 1; rejects(`pinned ${key}`, () => pinned(inputs.source, inputs.config, inputs.spec));
  }
  rejects("truncated ELF", () => parseElf(object.subarray(0, 51)));
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
  check(result["--self-test"] || result["--target"], "use --self-test or supply --target and --code-bin for authoritative evidence");
  check(result["--target"] || !["--object", "--inventory", "--report"].some((arg) => result[arg]),
    "--object, --inventory, and --report require --target and --code-bin");
  return result;
}
let temporary;
try {
  const args = options(process.argv.slice(2)); pinned();
  if (args["--self-test"]) {
    selfTest(...syntheticEvidence());
    console.log("arm-ipc-wrappers-107: PASS (standalone synthetic self-tests; 12,000-section composite; ELF/resource/hostile and ownership contracts)");
  }
  if (args["--target"]) {
    let objectPath = args["--object"];
    if (!objectPath) {
      temporary = fs.mkdtempSync(path.join(os.tmpdir(), "arm-ipc-wrappers-107-")); objectPath = path.join(temporary, "lane.o");
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
    auditLiteralIdentities(code, rows, manifests);
    const audit = auditBinary(code, rows);
    console.log("arm-ipc-wrappers-107: PASS (332 body + 4 pool bytes; authoritative equality; ownership/report/identity/duplicate/inbound audits)");
    console.log(JSON.stringify(audit));
  }
} catch (error) {
  console.error(`arm-ipc-wrappers-107: FAIL: ${error.message}`); process.exitCode = 1;
} finally { if (temporary) fs.rmSync(temporary, { recursive: true, force: true }); }
