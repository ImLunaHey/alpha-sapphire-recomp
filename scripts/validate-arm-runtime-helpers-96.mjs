#!/usr/bin/env node

import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const SHT = { PROGBITS: 1, SYMTAB: 2, STRTAB: 3, RELA: 4, NOBITS: 8, REL: 9 };
const SHF_EXECINSTR = 4;
const R_ARM_CALL = 28;
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const configPath = join(root, "config/arm-runtime-helpers-96.json");
const sourcePath = join(root, "src/main/arm_runtime_helpers_96.S");

const rows = {
  func_00136740: [["ldr", "r0, [pc, #56]", 0xe59f0038], ["mov", "r1, #512", 0xe3a01c02], ["push", "{r4, lr}", 0xe92d4010], ["bl", "func_00301FBC", 0xebfffffe]],
  func_00176610: [["push", "{r4, lr}", 0xe92d4010], ["bl", "func_00178A6C", 0xebfffffe], ["ldr", "r0, [r0, #12]", 0xe590000c], ["pop", "{r4, pc}", 0xe8bd8010]],
  func_001D6C74: [["push", "{r4, lr}", 0xe92d4010], ["mov", "r4, r0", 0xe1a04000], ["mov", "r1, #536", 0xe3a01f86], ["bl", "func_00301FBC", 0xebfffffe]],
  func_001F02C4: [["push", "{r4, lr}", 0xe92d4010], ["mov", "r4, r0", 0xe1a04000], ["mov", "r1, #120", 0xe3a01078], ["bl", "func_00301FBC", 0xebfffffe]],
  func_0038CD1C: [["push", "{r4, lr}", 0xe92d4010], ["bl", "func_003918E8", 0xebfffffe], ["mov", "r0, #1", 0xe3a00001], ["pop", "{r4, pc}", 0xe8bd8010]],
  func_003A38A4: [["push", "{r4, r5, r6, lr}", 0xe92d4070], ["mov", "r4, r0", 0xe1a04000], ["mov", "r1, #9216", 0xe3a01b09], ["bl", "func_00301FBC", 0xebfffffe]],
  func_0040ECC4: [["push", "{r4, lr}", 0xe92d4010], ["mov", "r4, r0", 0xe1a04000], ["mov", "r1, #80", 0xe3a01050], ["bl", "func_00301FBC", 0xebfffffe]],
  func_00410BD0: [["push", "{r4, lr}", 0xe92d4010], ["mov", "r4, r0", 0xe1a04000], ["mov", "r1, #108", 0xe3a0106c], ["bl", "func_00301FBC", 0xebfffffe]],
  func_0043D504: [["push", "{r4, r5, r6, lr}", 0xe92d4070], ["sub", "sp, sp, #16", 0xe24dd010], ["mov", "r4, r0", 0xe1a04000], ["bl", "func_0014E348", 0xebfffffe]],
  func_00441C68: [["push", "{r4, r5, r6, lr}", 0xe92d4070], ["mov", "r4, r0", 0xe1a04000], ["mov", "r5, r1", 0xe1a05001], ["bl", "func_0014E348", 0xebfffffe]],
  func_0045BECC: [["push", "{r4, r5, r6, r7, lr}", 0xe92d40f0], ["sub", "sp, sp, #1024", 0xe24ddb01], ["sub", "sp, sp, #580", 0xe24ddf91], ["bl", "func_0014E348", 0xebfffffe]],
  func_0052A420: [["push", "{r4, lr}", 0xe92d4010], ["mov", "r4, r0", 0xe1a04000], ["mov", "r1, #88", 0xe3a01058], ["bl", "func_00301FBC", 0xebfffffe]],
};

const sha = value => createHash("sha256").update(value).digest("hex");
const fail = message => { throw new Error(message); };
const readCapped = path => {
  const size = statSync(path).size;
  if (size > MAX_FILE) fail(`${path}: file exceeds 64 MiB cap`);
  return readFileSync(path);
};
const eq = (actual, expected, label) => { if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`); };
const unique = (xs, label) => { if (new Set(xs).size !== xs.length) fail(`duplicate ${label}`); };
const range = (off, size, length, label) => {
  if (!Number.isSafeInteger(off) || !Number.isSafeInteger(size) || off < 0 || size < 0 || off + size > length) fail(`truncated ${label}`);
};
const cstr = (buf, off, label) => {
  if (off < 0 || off >= buf.length) fail(`bad ${label} string offset`);
  const end = buf.indexOf(0, off);
  if (end < 0) fail(`unterminated ${label} string`);
  return buf.toString("utf8", off, end);
};

function loadContract() {
  const raw = readCapped(configPath);
  const c = JSON.parse(raw);
  eq(c.schemaVersion, 1, "schema version");
  eq(c.source, "src/main/arm_runtime_helpers_96.S", "source path");
  eq(c.mode, "arm", "mode");
  eq(c.totalBodySize, 192, "total body size");
  eq(c.totalAdjacentSize, 0, "adjacent ownership");
  const source = readCapped(sourcePath);
  eq(sha(source), c.sourceSha256, "source SHA-256");
  const names = Object.keys(rows);
  eq(c.functions.length, names.length, "function count");
  unique(c.functions.map(x => x.name), "configured function name");
  for (let i = 0; i < names.length; i++) {
    const f = c.functions[i];
    eq(f.name, names[i], `function order ${i}`);
    eq(f.size, 16, `${f.name} size`);
    if (!Array.isArray(f.adjacentWords) || f.adjacentWords.length) fail(`${f.name} owns adjacent data`);
    eq(f.calls.length, 1, `${f.name} call count`);
    const call = rows[f.name].map((x, j) => ({ x, j })).find(y => y.x[0] === "bl");
    eq(f.calls[0].offset, call.j * 4, `${f.name} call offset`);
    eq(f.calls[0].kind, "R_ARM_CALL", `${f.name} relocation kind`);
    eq(f.calls[0].mnemonic, "bl", `${f.name} call mnemonic`);
    eq(f.calls[0].symbol, call.x[1], `${f.name} call target`);
  }
  const instruction = names.flatMap(n => rows[n].map((x, i) => `${n}:${(i * 4).toString(16)}:${x[0]}:${x[1]}`)).join("\n");
  const calls = c.functions.map(f => `${f.name}:${f.calls[0].offset.toString(16)}:bl:${f.calls[0].symbol}`).join("\n");
  const returns = ["func_00176610:c:pop:{r4, pc}", "func_0038CD1C:c:pop:{r4, pc}"].join("\n");
  const pc = "func_00136740:0:ldr:40:ipc_callback_table_65";
  const relocs = c.functions.map(f => `${f.name}:${f.calls[0].offset.toString(16)}:R_ARM_CALL:${f.calls[0].symbol}`).join("\n");
  eq(sha(instruction), c.instructionScheduleSha256, "instruction schedule SHA-256");
  eq(sha(calls), c.branchScheduleSha256, "branch schedule SHA-256");
  eq(sha(returns), c.returnScheduleSha256, "return schedule SHA-256");
  eq(sha(pc), c.pcRelativeScheduleSha256, "PC-relative schedule SHA-256");
  eq(sha(relocs), c.relocationScheduleSha256, "relocation schedule SHA-256");
  eq(c.pcRelativeDataAccesses.length, 1, "PC-relative access count");
  const p = c.pcRelativeDataAccesses[0];
  eq(`${p.function}:${p.offset.toString(16)}:${p.mnemonic}:${p.targetOffset.toString(16)}:${p.symbol}`, pc, "PC-relative identity reuse");
  eq(p.ownership, "external-unowned-word", "PC-relative ownership");
  if (!c.reusedSymbolicIdentities.includes("ipc_callback_table_65") || c.newSymbolicIdentities.includes("ipc_callback_table_65")) fail("ipc_callback_table_65 must be reused, never newly owned");
  const b = c.branchIdentityContract;
  eq(b.mode, "arm", "branch mode"); eq(b.minimumAlignment, 4, "branch alignment");
  const targets = ["func_0014E348", "func_00178A6C", "func_00301FBC", "func_003918E8"];
  const calledTargets = new Set(c.functions.map(f => f.calls[0].symbol));
  if (calledTargets.size !== targets.length || targets.some(x => !calledTargets.has(x))) fail("branch primary-entry coverage mismatch");
  unique(b.primaryEntries, "primary branch identity");
  if (JSON.stringify(b.primaryEntries) !== JSON.stringify(targets)) fail("branch primary-entry partition mismatch");
  if (b.secondaryEntries.length || b.secondaryEntryRelations.length || b.sharedClasses.length || b.thumbPrimaryEntries.length) fail("secondary, shared, or Thumb branch identity forbidden");
  if (!b.classesPairwiseDistinct || JSON.stringify(b.singletonClasses) !== JSON.stringify(targets) || JSON.stringify(b.armPrimaryEntries) !== JSON.stringify(targets)) fail("ARM singleton identity partition mismatch");
  const expectedReuse = ["func_0014E348", "func_00178A6C", "func_00301FBC"];
  if (JSON.stringify(c.reusedBranchIdentities) !== JSON.stringify(expectedReuse) || JSON.stringify(c.newBranchIdentities) !== JSON.stringify(["func_003918E8"])) fail("new/reused branch identity contract mismatch");
  unique([...names, ...targets, "ipc_callback_table_65"], "owned/reference identity");
  return c;
}

function parseElf(buf, label) {
  if (buf.length > MAX_FILE) fail(`${label}: file exceeds 64 MiB cap`);
  range(0, 52, buf.length, `${label} ELF header`);
  if (buf.toString("binary", 0, 4) !== "\x7fELF" || buf[4] !== 1 || buf[5] !== 1 || buf[6] !== 1) fail(`${label}: requires ELF32 little-endian version 1`);
  eq(buf.readUInt16LE(16), 1, `${label} ELF type`);
  eq(buf.readUInt16LE(18), 40, `${label} machine`);
  const shoff = buf.readUInt32LE(32), shentsize = buf.readUInt16LE(46), shnum = buf.readUInt16LE(48), shstrndx = buf.readUInt16LE(50);
  eq(shentsize, 40, `${label} section-header size`);
  if (!shnum || shnum > MAX_SECTIONS) fail(`${label}: section count outside cap`);
  if (shstrndx >= shnum) fail(`${label}: invalid shstrndx`);
  range(shoff, shnum * 40, buf.length, `${label} section headers`);
  const sections = [];
  let execSize = 0;
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * 40;
    const s = { index: i, nameOff: buf.readUInt32LE(o), type: buf.readUInt32LE(o + 4), flags: buf.readUInt32LE(o + 8), addr: buf.readUInt32LE(o + 12), off: buf.readUInt32LE(o + 16), size: buf.readUInt32LE(o + 20), link: buf.readUInt32LE(o + 24), info: buf.readUInt32LE(o + 28), align: buf.readUInt32LE(o + 32), entsize: buf.readUInt32LE(o + 36) };
    if (s.type !== SHT.NOBITS) range(s.off, s.size, buf.length, `${label} section ${i}`);
    if (s.flags & SHF_EXECINSTR) { execSize += s.size; if (execSize > MAX_EXEC) fail(`${label}: executable data exceeds 16 MiB cap`); }
    sections.push(s);
  }
  const shstr = sections[shstrndx];
  if (shstr.type !== SHT.STRTAB) fail(`${label}: shstrtab is not STRTAB`);
  const shnames = buf.subarray(shstr.off, shstr.off + shstr.size);
  for (const s of sections) s.name = cstr(shnames, s.nameOff, `${label} section-name`);
  const symbols = [], relocs = [];
  for (const s of sections) {
    if (s.type === SHT.SYMTAB) {
      if (s.entsize !== 16 || s.size % 16 || s.link >= sections.length || sections[s.link].type !== SHT.STRTAB) fail(`${label}: malformed symbol table`);
      if (symbols.length + s.size / 16 > MAX_SYMBOLS) fail(`${label}: symbol count exceeds cap`);
      const strings = sections[s.link], str = buf.subarray(strings.off, strings.off + strings.size);
      const table = [];
      for (let o = 0; o < s.size; o += 16) {
        const p = s.off + o, info = buf[p + 12], other = buf[p + 13];
        const sym = { name: cstr(str, buf.readUInt32LE(p), `${label} symbol`), value: buf.readUInt32LE(p + 4), size: buf.readUInt32LE(p + 8), bind: info >> 4, type: info & 15, visibility: other & 3, shndx: buf.readUInt16LE(p + 14) };
        table.push(sym); symbols.push(sym);
      }
      s.symbols = table;
    }
  }
  for (const s of sections) if (s.type === SHT.REL || s.type === SHT.RELA) {
    const es = s.type === SHT.REL ? 8 : 12;
    if (s.entsize !== es || s.size % es || s.link >= sections.length || !sections[s.link].symbols || s.info >= sections.length) fail(`${label}: malformed relocation section`);
    if (relocs.length + s.size / es > MAX_RELOCS) fail(`${label}: relocation count exceeds cap`);
    for (let o = 0; o < s.size; o += es) {
      const p = s.off + o, info = buf.readUInt32LE(p + 4), symIndex = info >>> 8;
      if (symIndex >= sections[s.link].symbols.length) fail(`${label}: bad relocation symbol index`);
      relocs.push({ section: s.info, offset: buf.readUInt32LE(p), type: info & 255, symbol: sections[s.link].symbols[symIndex].name });
    }
  }
  return { buf, sections, symbols, relocs, execSize };
}

function validateObjects(buffers, labels, c) {
  const elfs = buffers.map((b, i) => parseElf(b, labels[i]));
  const totals = elfs.reduce((a, e) => ({ sections: a.sections + e.sections.length, symbols: a.symbols + e.symbols.length, relocs: a.relocs + e.relocs.length, exec: a.exec + e.execSize }), { sections: 0, symbols: 0, relocs: 0, exec: 0 });
  if (totals.sections > MAX_SECTIONS) fail("composite section count exceeds cap");
  if (totals.symbols > MAX_SYMBOLS) fail("composite symbol count exceeds cap");
  if (totals.relocs > MAX_RELOCS) fail("composite relocation count exceeds cap");
  if (totals.exec > MAX_EXEC) fail("composite executable data exceeds 16 MiB cap");
  const names = Object.keys(rows), owned = new Map();
  for (const e of elfs) for (const s of e.sections) if (names.includes(s.name.slice(6)) && s.name.startsWith(".text.")) {
    const n = s.name.slice(6); if (owned.has(n)) fail(`duplicate owned section ${s.name}`); owned.set(n, { e, s });
  }
  eq(owned.size, names.length, "owned section completeness");
  const allSymbols = elfs.flatMap(e => e.symbols);
  for (const n of names) {
    const { e, s } = owned.get(n);
    eq(s.name, `.text.${n}`, `${n} section name`); eq(s.type, SHT.PROGBITS, `${n} section type`); eq(s.flags, 6, `${n} section flags`); eq(s.align, 4, `${n} section alignment`); eq(s.size, 16, `${n} section size`);
    const data = e.buf.subarray(s.off, s.off + s.size);
    rows[n].forEach((insn, i) => eq(data.readUInt32LE(i * 4), insn[2] >>> 0, `${n}+${i * 4} instruction`));
    const inSection = e.symbols.filter(x => x.shndx === s.index);
    const fsyms = inSection.filter(x => x.name === n);
    eq(fsyms.length, 1, `${n} function symbol count`);
    const f = fsyms[0]; eq(f.bind, 1, `${n} binding`); eq(f.type, 2, `${n} symbol type`); eq(f.visibility, 0, `${n} visibility`); eq(f.value, 0, `${n} symbol offset`); eq(f.size, 16, `${n} symbol span`);
    const maps = inSection.filter(x => x.name.startsWith("$"));
    eq(maps.length, 1, `${n} mapping-symbol count`); eq(maps[0].name, "$a", `${n} ARM mapping`); eq(maps[0].value, 0, `${n} mapping offset`); eq(maps[0].bind, 0, `${n} mapping binding`); eq(maps[0].type, 0, `${n} mapping type`);
    const foreign = inSection.filter(x => x.name && x.name !== n && !x.name.startsWith("$"));
    if (foreign.length) fail(`${n}: foreign/nested symbol ${foreign[0].name}`);
    const rs = e.relocs.filter(x => x.section === s.index);
    eq(rs.length, 1, `${n} relocation count`);
    const want = c.functions.find(x => x.name === n).calls[0];
    eq(rs[0].offset, want.offset, `${n} relocation offset`); eq(rs[0].type, R_ARM_CALL, `${n} relocation type`); eq(rs[0].symbol, want.symbol, `${n} relocation target`);
  }
  const targets = c.branchIdentityContract.primaryEntries;
  const definedIdentities = [];
  for (const t of targets) {
    const occurrences = allSymbols.filter(x => x.name === t);
    if (occurrences.some(x => x.bind !== 1 || x.visibility !== 0 || (x.type !== 0 && x.type !== 2) || (x.value & 1))) fail(`${t}: call target is not a default-visible global ARM identity`);
    const defs = allSymbols.filter(x => x.name === t && x.shndx !== 0);
    if (defs.length) {
      if (defs.length !== 1 || defs[0].value % 4) fail(`${t}: duplicate or unaligned definition`);
      const owner = elfs.find(e => e.symbols.includes(defs[0])), section = owner?.sections[defs[0].shndx];
      if (!section || !(section.flags & SHF_EXECINSTR)) fail(`${t}: definition is not executable`);
      const armMaps = owner.symbols.filter(x => x.shndx === section.index && x.name === "$a" && x.value <= defs[0].value);
      const thumbOrData = owner.symbols.filter(x => x.shndx === section.index && (x.name === "$t" || x.name === "$d") && x.value <= defs[0].value);
      const lastArm = Math.max(-1, ...armMaps.map(x => x.value)), lastOther = Math.max(-1, ...thumbOrData.map(x => x.value));
      if (lastArm < lastOther || lastArm < 0) fail(`${t}: definition lacks an active ARM mapping`);
      definedIdentities.push(`${elfs.indexOf(owner)}:${section.index}:${defs[0].value}`);
    }
    if (!allSymbols.some(x => x.name === t)) fail(`${t}: missing call-target symbol`);
  }
  unique(definedIdentities, "resolved branch identity");
  if (allSymbols.some(x => x.name === "ipc_callback_table_65" && x.shndx !== 0)) fail("ipc_callback_table_65 must remain external and unowned");
  const selected = allSymbols.filter(x => names.includes(x.name) && x.shndx !== 0);
  eq(selected.length, names.length, "selected symbol collision/completeness");
  return { functions: names.length, bytes: names.length * 16, instructions: names.length * 4, relocations: names.length };
}

function buildFixture({ unrelated = 0, mutateWord = false, relocType = R_ARM_CALL, duplicate = false, mapping = "$a", foreign = false } = {}) {
  const funcs = Object.keys(rows), targets = [...new Set(funcs.map(n => rows[n].find(x => x[0] === "bl")[1]))];
  const secs = [{ name: "", type: 0, flags: 0, align: 0, data: Buffer.alloc(0) }];
  for (const n of funcs) { const d = Buffer.alloc(16); rows[n].forEach((x, i) => d.writeUInt32LE((mutateWord && n === funcs[0] && i === 0 ? x[2] ^ 1 : x[2]) >>> 0, i * 4)); secs.push({ name: `.text.${n}`, type: 1, flags: 6, align: 4, data: d, func: n }); }
  if (duplicate) secs.push({ name: `.text.${funcs[0]}`, type: 1, flags: 6, align: 4, data: Buffer.alloc(16) });
  for (let i = 0; i < unrelated; i++) secs.push({ name: `.unrelated.${i}`, type: 1, flags: 0, align: 1, data: Buffer.alloc(0) });
  const textIndices = new Map(secs.filter(x => x.func).map((x, i) => [x.func, secs.indexOf(x)]));
  const strParts = [Buffer.from([0])], strOff = new Map();
  const addStr = x => { if (!strOff.has(x)) { strOff.set(x, Buffer.concat(strParts).length); strParts.push(Buffer.from(x + "\0")); } return strOff.get(x); };
  addStr(mapping); funcs.forEach(addStr); targets.forEach(addStr); if (foreign) addStr("foreign_owned_symbol");
  const syms = [{ name: "", value: 0, size: 0, info: 0, other: 0, shndx: 0 }];
  for (const n of funcs) { syms.push({ name: mapping, value: 0, size: 0, info: 0, other: 0, shndx: textIndices.get(n) }); syms.push({ name: n, value: 0, size: 16, info: 0x12, other: 0, shndx: textIndices.get(n) }); }
  if (foreign) syms.push({ name: "foreign_owned_symbol", value: 4, size: 0, info: 0x10, other: 0, shndx: textIndices.get(funcs[0]) });
  const firstGlobal = syms.length;
  const targetSym = new Map(); for (const t of targets) { targetSym.set(t, syms.length); syms.push({ name: t, value: 0, size: 0, info: 0x10, other: 0, shndx: 0 }); }
  const strtabIndex = secs.length; secs.push({ name: ".strtab", type: 3, flags: 0, align: 1, data: Buffer.concat(strParts) });
  const symtabIndex = secs.length, symData = Buffer.alloc(syms.length * 16);
  syms.forEach((x, i) => { const o = i * 16; symData.writeUInt32LE(x.name ? strOff.get(x.name) : 0, o); symData.writeUInt32LE(x.value, o + 4); symData.writeUInt32LE(x.size, o + 8); symData[o + 12] = x.info; symData[o + 13] = x.other; symData.writeUInt16LE(x.shndx, o + 14); });
  secs.push({ name: ".symtab", type: 2, flags: 0, align: 4, entsize: 16, link: strtabIndex, info: firstGlobal, data: symData });
  for (const n of funcs) { const call = rows[n].map((x, i) => ({ x, i })).find(y => y.x[0] === "bl"), d = Buffer.alloc(8); d.writeUInt32LE(call.i * 4, 0); d.writeUInt32LE((targetSym.get(call.x[1]) << 8) | relocType, 4); secs.push({ name: `.rel.text.${n}`, type: 9, flags: 0, align: 4, entsize: 8, link: symtabIndex, info: textIndices.get(n), data: d }); }
  const shstrIndex = secs.length;
  const shParts = [Buffer.from([0])], shOff = [];
  for (const s of [...secs, { name: ".shstrtab" }]) { shOff.push(Buffer.concat(shParts).length); shParts.push(Buffer.from(s.name + "\0")); }
  secs.push({ name: ".shstrtab", type: 3, flags: 0, align: 1, data: Buffer.concat(shParts) });
  let pos = 52; for (let i = 1; i < secs.length; i++) { const s = secs[i], a = Math.max(1, s.align || 1); pos = Math.ceil(pos / a) * a; s.off = pos; pos += s.data.length; }
  pos = Math.ceil(pos / 4) * 4; const shoff = pos, out = Buffer.alloc(shoff + secs.length * 40);
  out.write("\x7fELF", 0, "binary"); out[4] = 1; out[5] = 1; out[6] = 1; out.writeUInt16LE(1, 16); out.writeUInt16LE(40, 18); out.writeUInt32LE(1, 20); out.writeUInt32LE(shoff, 32); out.writeUInt16LE(52, 40); out.writeUInt16LE(40, 46); out.writeUInt16LE(secs.length, 48); out.writeUInt16LE(shstrIndex, 50);
  secs.forEach((s, i) => { if (i) s.data.copy(out, s.off); const o = shoff + i * 40; out.writeUInt32LE(shOff[i], o); out.writeUInt32LE(s.type, o + 4); out.writeUInt32LE(s.flags, o + 8); out.writeUInt32LE(s.off || 0, o + 16); out.writeUInt32LE(s.data.length, o + 20); out.writeUInt32LE(s.link || 0, o + 24); out.writeUInt32LE(s.info || 0, o + 28); out.writeUInt32LE(s.align || 0, o + 32); out.writeUInt32LE(s.entsize || 0, o + 36); });
  return out;
}

function selfTest(c) {
  const ok = x => validateObjects([x], ["self-test"], c);
  ok(buildFixture()); ok(buildFixture({ unrelated: 12000 }));
  const hostile = [
    ["schedule", () => buildFixture({ mutateWord: true })], ["mode", () => buildFixture({ mapping: "$t" })],
    ["relocation", () => buildFixture({ relocType: 10 })], ["duplicate", () => buildFixture({ duplicate: true })],
    ["truncation", () => buildFixture().subarray(0, 80)], ["foreign-symbol", () => buildFixture({ foreign: true })],
    ["secondary-entry", () => buildFixture({ foreign: true })], ["misplaced-data", () => buildFixture({ mapping: "$d" })],
  ];
  for (const [name, make] of hostile) { let rejected = false; try { ok(make()); } catch { rejected = true; } if (!rejected) fail(`self-test failed to reject ${name} fixture`); }
  return hostile.length + 2;
}

try {
  const c = loadContract();
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") {
    const tests = selfTest(c);
    console.log(`arm-runtime-helpers-96 validator self-test: ok (${tests} fixtures; 12,000-section composite accepted)`);
  } else {
    if (!args.length) fail("usage: validate-arm-runtime-helpers-96.mjs <object> [object ...] | --self-test");
    const buffers = args.map(readCapped);
    const total = validateObjects(buffers, args, c);
    console.log(`arm-runtime-helpers-96: ok (${total.functions} functions, ${total.instructions} instructions, ${total.bytes} bytes, ${total.relocations} R_ARM_CALL relocations)`);
  }
} catch (error) {
  console.error(`arm-runtime-helpers-96: ${error.message}`);
  process.exitCode = 1;
}
