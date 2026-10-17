#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { lstatSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const SOURCE_HASH = 'add87794407b2386bfd1256b8c0085b5a10d8074bc5bebdbc9af2702af9c7a34';
const SCHEDULE_HASH = '6e89083902376e755a6f1b1897f452527382d404a4daaa87961d5b79914c5124';
const SOURCE_REL = 'src/main/arm_ipc_wrappers_89.S';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const u32 = (hex) => Number.parseInt(hex, 16) >>> 0;
const CONTRACT = [
  {
    name: 'func_0018067C', section: '.text.func_0018067C', body: 60, full: 68,
    nextGlobal: 'func_001806C0', nextGlobalOffset: 68,
    words: [
      'eddf0a0d','ed9f1a0d','ee700a20','eef40ac1','eef1fa10',
      'ed900a11','3ef00a41','eeb40a60','eef1fa10','0a000003',
      'e1d012b0','edc00a11','e3811008','e1c012b0','e12fff1e',
    ].map(u32),
    branches: [[36, 56]], returns: [56],
    slots: [[60, 'ipc_unit_scalar_54'], [64, 'service_zero_scalar_51']],
  },
  {
    name: 'func_001806E4', section: '.text.func_001806E4', body: 96, full: 104,
    nextGlobal: 'func_0018074C', nextGlobalOffset: 104,
    words: [
      'ed9f1a16','eddf0a16','eeb40ac1','eef1fa10','ceb00a41','ca000002',
      'eeb40ae0','eef1fa10','3eb00a60','e5d03022','e3a02000','e1530001',
      '15c01022','edd00a0f','13a02001','eef40a40','eef1fa10','1d800a0f',
      '03520000','0a000002','e1d012b0','e3811020','e1c012b0','e12fff1e',
    ].map(u32),
    branches: [[20, 36], [76, 92]], returns: [92],
    slots: [[96, 'ipc_unit_scalar_54'], [100, 'service_zero_scalar_51']],
  },
];

function fail(message) { throw new Error(message); }
function check(ok, message) { if (!ok) fail(message); }
function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function range(buf, off, size, what) {
  check(Number.isSafeInteger(off) && Number.isSafeInteger(size) && off >= 0 && size >= 0,
    `${what}: invalid range`);
  check(off <= buf.length && size <= buf.length - off, `${what}: range outside file`);
}
function cstring(buf, start, limit, what) {
  check(Number.isSafeInteger(start) && start >= 0 && start < limit, `${what}: bad string offset`);
  const end = buf.indexOf(0, start);
  check(end >= 0 && end < limit, `${what}: unterminated string`);
  return buf.toString('utf8', start, end);
}
function readRegular(path, limit = MAX_FILE) {
  const st = lstatSync(path);
  check(st.isFile(), `${path}: not a regular file`);
  check(st.size <= limit, `${path}: exceeds ${limit}-byte limit`);
  return readFileSync(path);
}

function parseElf(buf) {
  check(buf.length <= MAX_FILE, 'ELF exceeds 64 MiB');
  range(buf, 0, 52, 'ELF header');
  check(buf[0] === 0x7f && buf.toString('ascii', 1, 4) === 'ELF', 'not ELF');
  check(buf[4] === 1 && buf[5] === 1 && buf[6] === 1, 'requires ELF32 little-endian version 1');
  check(buf.readUInt16LE(16) === 1, 'requires relocatable ELF');
  check(buf.readUInt16LE(18) === 40, 'requires EM_ARM');
  check(buf.readUInt32LE(20) === 1, 'bad ELF version');
  check(buf.readUInt16LE(40) === 52, 'bad ELF header size');
  const shoff = buf.readUInt32LE(32);
  const shentsize = buf.readUInt16LE(46);
  const shnum = buf.readUInt16LE(48);
  const shstrndx = buf.readUInt16LE(50);
  check(shentsize === 40, 'bad section-header size');
  check(shnum > 0 && shnum <= MAX_SECTIONS, 'bad or excessive section count');
  check(shstrndx > 0 && shstrndx < shnum && shstrndx !== 0xffff, 'bad section-name table index');
  range(buf, shoff, shnum * 40, 'section table');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const p = shoff + i * 40;
    const s = {
      index: i, nameOffset: buf.readUInt32LE(p), type: buf.readUInt32LE(p + 4),
      flags: buf.readUInt32LE(p + 8), addr: buf.readUInt32LE(p + 12),
      offset: buf.readUInt32LE(p + 16), size: buf.readUInt32LE(p + 20),
      link: buf.readUInt32LE(p + 24), info: buf.readUInt32LE(p + 28),
      align: buf.readUInt32LE(p + 32), entsize: buf.readUInt32LE(p + 36), headerOffset: p,
    };
    check(s.size <= MAX_EXEC, `section ${i} exceeds 16 MiB`);
    if (s.type !== 8) range(buf, s.offset, s.size, `section ${i}`);
    else check(!(s.flags & 4), `section ${i}: executable NOBITS forbidden`);
    sections.push(s);
  }
  const names = sections[shstrndx];
  check(names.type === 3, 'section-name table is not STRTAB');
  const nameLimit = names.offset + names.size;
  for (const s of sections) s.name = cstring(buf, names.offset + s.nameOffset, nameLimit, `section ${s.index} name`);
  check(sections[0].type === 0 && sections[0].size === 0, 'malformed null section');

  let symbolTotal = 0;
  const symbols = [];
  const symbolTables = new Map();
  for (const s of sections) {
    if (s.type !== 2 && s.type !== 11) continue;
    check(s.type === 2, 'dynamic symbol tables are forbidden');
    check(s.entsize === 16 && s.size % 16 === 0, `${s.name}: malformed symbol table`);
    check(s.link < sections.length && sections[s.link].type === 3, `${s.name}: bad string-table link`);
    const count = s.size / 16;
    symbolTotal += count;
    check(symbolTotal <= MAX_SYMBOLS, 'excessive symbol count');
    const strings = sections[s.link];
    const table = [];
    for (let i = 0; i < count; i++) {
      const p = s.offset + i * 16;
      const nameOff = buf.readUInt32LE(p);
      const sym = {
        table: s.index, index: i,
        name: cstring(buf, strings.offset + nameOff, strings.offset + strings.size, `${s.name} symbol ${i}`),
        value: buf.readUInt32LE(p + 4), size: buf.readUInt32LE(p + 8),
        bind: buf[p + 12] >>> 4, type: buf[p + 12] & 15,
        other: buf[p + 13], shndx: buf.readUInt16LE(p + 14), fileOffset: p,
      };
      check(sym.shndx < sections.length || [0, 0xfff1, 0xfff2].includes(sym.shndx),
        `${s.name} symbol ${i}: bad section index`);
      table.push(sym); symbols.push(sym);
    }
    symbolTables.set(s.index, table);
  }
  check(symbolTables.size === 1, 'requires exactly one static symbol table');

  let relocTotal = 0;
  const relocs = [];
  for (const s of sections) {
    if (s.type !== 9 && s.type !== 4) continue;
    check(s.type === 9, 'RELA relocations are forbidden');
    check(s.entsize === 8 && s.size % 8 === 0, `${s.name}: malformed relocation table`);
    check(symbolTables.has(s.link), `${s.name}: bad symbol-table link`);
    check(s.info < sections.length, `${s.name}: bad target section`);
    const table = symbolTables.get(s.link);
    const count = s.size / 8;
    relocTotal += count;
    check(relocTotal <= MAX_RELOCS, 'excessive relocation count');
    for (let i = 0; i < count; i++) {
      const p = s.offset + i * 8;
      const off = buf.readUInt32LE(p), info = buf.readUInt32LE(p + 4), si = info >>> 8;
      check(si < table.length, `${s.name} relocation ${i}: bad symbol index`);
      check(off <= sections[s.info].size && 4 <= sections[s.info].size - off,
        `${s.name} relocation ${i}: offset outside target`);
      relocs.push({ section: s, target: sections[s.info], offset: off, type: info & 0xff,
        symbol: table[si], fileOffset: p });
    }
  }
  return { buf, sections, symbols, relocs, symbolTotal, relocTotal };
}

function validateElf(buf) {
  const elf = parseElf(buf);
  const byName = new Map();
  for (const s of elf.sections) {
    if (!byName.has(s.name)) byName.set(s.name, []);
    byName.get(s.name).push(s);
  }
  for (const c of CONTRACT) check(byName.get(c.section)?.length === 1, `${c.section}: missing or duplicate`);
  // Foreign executable sections are expected in a repository composite.  They
  // remain bounded by parseElf, and must not contain a second copy of either
  // selected body (which would make ownership ambiguous).
  for (const s of elf.sections) {
    if (!(s.flags & 4) || s.type !== 1 || CONTRACT.some(c => c.section === s.name)) continue;
    const bytes = elf.buf.subarray(s.offset, s.offset + s.size);
    for (const c of CONTRACT) {
      const body = Buffer.alloc(c.body);
      c.words.forEach((word, i) => body.writeUInt32LE(word, i * 4));
      for (let off = 0; off + body.length <= bytes.length; off += 4)
        check(!bytes.subarray(off, off + body.length).equals(body),
          `${s.name}+0x${off.toString(16)}: duplicate selected body ${c.name}`);
    }
  }

  const globalDefs = new Map();
  for (const sym of elf.symbols) {
    if ((sym.bind === 1 || sym.bind === 2) && sym.shndx !== 0) {
      check(!globalDefs.has(sym.name), `duplicate global definition: ${sym.name}`);
      globalDefs.set(sym.name, sym);
    }
  }
  for (const name of [...CONTRACT.map(c => c.name), 'ipc_unit_scalar_54', 'service_zero_scalar_51'])
    check(elf.symbols.filter(sym => sym.name === name).length === 1, `symbol collision or omission: ${name}`);
  let totalBody = 0, totalAdjacent = 0, slots = 0, localBranches = 0, returns = 0;
  const identities = new Set(), seenSlotPairs = [];
  for (const c of CONTRACT) {
    const section = byName.get(c.section)[0];
    check(section.type === 1 && (section.flags & 6) === 6, `${c.section}: requires allocatable PROGBITS code`);
    check(section.addr === 0 && section.align >= 4 && (section.align & (section.align - 1)) === 0,
      `${c.section}: bad address/alignment`);
    check(section.size === c.full, `${c.section}: size ${section.size}, expected ${c.full}`);
    const primary = elf.symbols.filter(s => s.name === c.name && s.bind === 1 && s.type === 2 && s.shndx === section.index);
    check(primary.length === 1 && primary[0].value === 0 && primary[0].size === c.body,
      `${c.name}: requires one global STT_FUNC at offset zero with exact size`);
    for (const sym of elf.symbols) {
      if (sym.shndx === section.index && (sym.bind === 1 || sym.bind === 2))
        check(sym === primary[0], `${c.section}: alias or secondary global entry ${sym.name}`);
    }
    const maps = elf.symbols.filter(s => s.shndx === section.index && /^\$[adt](?:\.|$)/.test(s.name));
    check(maps.length === 2, `${c.section}: unexpected mapping-symbol count`);
    const states = maps.map(s => [s.name[1], s.value]).sort((a,b) => a[1]-b[1]);
    check(states[0][0] === 'a' && states[0][1] === 0 && states[1][0] === 'd' && states[1][1] === c.body,
      `${c.section}: expected ARM at 0 and data at pool start`);
    const body = elf.buf.subarray(section.offset, section.offset + c.body);
    check(body.length === c.words.length * 4, `${c.name}: instruction count mismatch`);
    for (let i = 0; i < c.words.length; i++)
      check(body.readUInt32LE(i * 4) === c.words[i], `${c.name}+0x${(i*4).toString(16)}: instruction mismatch`);
    for (const [off, target] of c.branches) {
      const word = body.readUInt32LE(off), imm = (word << 8) >> 6;
      check(off + 8 + imm === target, `${c.name}+0x${off.toString(16)}: bad local branch target`);
    }
    const sectionRelocs = elf.relocs.filter(r => r.target === section);
    check(sectionRelocs.length === c.slots.length, `${c.section}: wrong relocation count`);
    for (const [off, identity] of c.slots) {
      const matches = sectionRelocs.filter(r => r.offset === off && r.type === 2 && r.symbol.name === identity);
      check(matches.length === 1, `${c.section}+0x${off.toString(16)}: expected R_ARM_ABS32 to ${identity}`);
      check(elf.buf.readUInt32LE(section.offset + off) === 0, `${c.section}+0x${off.toString(16)}: nonzero REL addend`);
      check(matches[0].symbol.bind === 1,
        `${identity}: reused identity must be global`);
      identities.add(identity); seenSlotPairs.push(`${c.section}:${off}:${identity}`); slots++;
    }
    check(sectionRelocs.every(r => r.type === 2 && c.slots.some(([o,n]) => o === r.offset && n === r.symbol.name)),
      `${c.section}: additional or direct-transfer relocation`);
    totalBody += c.body; totalAdjacent += c.full - c.body;
    localBranches += c.branches.length; returns += c.returns.length;
  }
  check(CONTRACT.reduce((n, c) => n + elf.relocs.filter(r => r.target.name === c.section).length, 0) === 4,
    'expected exactly four relocations across selected sections');
  check(totalBody === 156 && totalAdjacent === 16, 'derived body/adjacent totals differ');
  check(slots === 4 && identities.size === 2, 'expected four slots in two classes');
  check(identities.has('ipc_unit_scalar_54') && identities.has('service_zero_scalar_51'), 'literal reuse identities differ');
  check(localBranches === 3 && returns === 2, 'branch/return totals differ');
  check(seenSlotPairs.length === new Set(seenSlotPairs).size, 'literal slot mapping is not bijective');
  return {
    bodyBytes: totalBody, adjacentBytes: totalAdjacent, slots, classes: identities.size,
    reusedClasses: 2, newClasses: 0, branchRelocations: 0, localBranches,
    indirectCalls: 0, returnSites: returns, externalTails: 0,
    sections: elf.sections.length, symbols: elf.symbolTotal, relocations: elf.relocTotal,
  };
}

function validateRepositoryInputs() {
  const source = resolve(ROOT, SOURCE_REL);
  check(!isAbsolute(SOURCE_REL) && relative(ROOT, source) === SOURCE_REL, 'source path escapes repository');
  check(sha256(readRegular(source)) === SOURCE_HASH, 'source SHA-256 mismatch');
  const configPath = resolve(ROOT, 'config/arm-ipc-wrappers-89.json');
  const config = JSON.parse(readRegular(configPath).toString('utf8'));
  check(config.source === SOURCE_REL, 'configured source path mismatch');
  check(config.sourceSha256 === SOURCE_HASH, 'configured source hash mismatch');
  check(config.normalizedScheduleSha256 === SCHEDULE_HASH, 'normalized schedule hash mismatch');
  check(config.mode === 'arm' && config.totalBodySize === 156 && config.totalAdjacentSize === 16,
    'configured mode/size contract mismatch');
  check(config.cumulativePoolSlots === 874 && config.cumulativePoolClasses === 460,
    'configured cumulative pool totals mismatch');
  check(JSON.stringify(config.literalIdentities) === JSON.stringify(['ipc_unit_scalar_54','service_zero_scalar_51']) &&
    JSON.stringify(config.reusedLiteralIdentities) === JSON.stringify(config.literalIdentities) &&
    Array.isArray(config.newLiteralIdentities) && config.newLiteralIdentities.length === 0,
    'configured literal partition mismatch');
  check(config.functions?.length === 2, 'configured function count mismatch');
  for (let i = 0; i < CONTRACT.length; i++) {
    const got = config.functions[i], want = CONTRACT[i];
    check(got.name === want.name && got.section === want.section && got.size === want.body,
      `configured function ${i} mismatch`);
    check(got.nextGlobal === want.nextGlobal && got.nextGlobalOffset === want.nextGlobalOffset,
      `configured adjacency ${i} mismatch`);
    check(JSON.stringify(got.branches) === '[]', `configured function ${i} has transfers`);
    check(got.literals?.length === 2 && got.literals.every((x,j) =>
      x.offset === want.slots[j][0] && x.symbol === want.slots[j][1] &&
      JSON.stringify(x.loadOffsets) === JSON.stringify([j * 4])), `configured literals ${i} mismatch`);
  }
  const bc = config.branchIdentityContract;
  check(bc?.mode === 'arm' && bc.minimumAlignment === 4 &&
    ['primaryEntries','secondaryEntries','secondaryEntryRelations','sharedClasses','singletonClasses','armPrimaryEntries','thumbPrimaryEntries']
      .every(k => Array.isArray(bc[k]) && bc[k].length === 0) && bc.classesPairwiseDistinct === true,
    'configured branch identity contract mismatch');
  const spec = readRegular(resolve(ROOT, 'docs/specs/main/arm_ipc_wrappers_89.md')).toString('utf8');
  check(spec.includes(`Implementation source SHA-256: \`${SOURCE_HASH}\``), 'spec source hash mismatch');
  check(spec.includes(`Normalized normative-schedule SHA-256: \`${SCHEDULE_HASH}\``), 'spec schedule hash mismatch');
  const schedule = spec.match(/```asm\n([\s\S]*?)```/);
  check(schedule !== null, 'spec normative schedule missing');
  const normalized = `${schedule[1].split(/\r?\n/).map(line => line.trim()).filter(Boolean).join('\n')}\n`;
  check(sha256(normalized) === SCHEDULE_HASH, 'recomputed normalized schedule SHA-256 mismatch');
}

function align(n, a) { return Math.ceil(n / a) * a; }
function strtab(strings) {
  const chunks = [Buffer.from([0])], offsets = new Map([['', 0]]); let n = 1;
  for (const s of strings) if (!offsets.has(s)) { const b = Buffer.from(`${s}\0`); offsets.set(s, n); chunks.push(b); n += b.length; }
  return { buf: Buffer.concat(chunks), offsets };
}
function fixture(extraCount = 0, foreignExec = false) {
  const sec = [{ name:'', type:0, flags:0, align:0, data:Buffer.alloc(0) },
    { name:'.text', type:1, flags:6, align:1, data:Buffer.alloc(0) }];
  for (const c of CONTRACT) {
    const data = Buffer.alloc(c.full);
    c.words.forEach((w,i) => data.writeUInt32LE(w, i*4));
    sec.push({ name:c.section, type:1, flags:6, align:4, data });
  }
  const f1 = 2, f2 = 3;
  let foreignIndex = 0;
  if (foreignExec) {
    foreignIndex = sec.length;
    const data = Buffer.alloc(20);
    [0xe3a0002a, 0xe2800001, 0xe1a01000, 0xe12fff1e].forEach((word, i) => data.writeUInt32LE(word, i * 4));
    sec.push({ name:'.text.foreign_fixture', type:1, flags:6, align:4, data });
  }
  const symNames = strtab(['$a','$d','ipc_unit_scalar_54','service_zero_scalar_51',
    ...CONTRACT.map(c=>c.name), ...(foreignExec ? ['foreign_func'] : [])]);
  const symbols = [
    ['',0,0,0,0], ['$a',0,0,0,f1], ['$d',60,0,0,f1], ['$a',0,0,0,f2], ['$d',96,0,0,f2],
    ['ipc_unit_scalar_54',0,0,0x10,0], ['service_zero_scalar_51',0,0,0x10,0],
    [CONTRACT[0].name,0,60,0x12,f1], [CONTRACT[1].name,0,96,0x12,f2],
  ];
  if (foreignExec) symbols.push(['foreign_func', 0, 16, 0x12, foreignIndex]);
  const symbuf = Buffer.alloc(symbols.length * 16);
  symbols.forEach((s,i) => { const p=i*16; symbuf.writeUInt32LE(symNames.offsets.get(s[0]),p); symbuf.writeUInt32LE(s[1],p+4);
    symbuf.writeUInt32LE(s[2],p+8); symbuf[p+12]=s[3]; symbuf.writeUInt16LE(s[4],p+14); });
  const rel1=Buffer.alloc(16), rel2=Buffer.alloc(16);
  [[rel1,60,5,0],[rel1,64,6,8],[rel2,96,5,0],[rel2,100,6,8]].forEach(([b,o,si,p])=>{
    b.writeUInt32LE(o,p); b.writeUInt32LE((si<<8)|2,p+4); });
  const rel1Index=sec.length;
  sec.push({name:'.rel.text.func_0018067C',type:9,flags:0,align:4,entsize:8,info:f1,data:rel1});
  const rel2Index=sec.length;
  sec.push({name:'.rel.text.func_001806E4',type:9,flags:0,align:4,entsize:8,info:f2,data:rel2});
  let foreignRelIndex = 0;
  if (foreignExec) {
    const rel=Buffer.alloc(8); rel.writeUInt32LE(16,0); rel.writeUInt32LE((6<<8)|2,4);
    foreignRelIndex=sec.length;
    sec.push({name:'.rel.text.foreign_fixture',type:9,flags:0,align:4,entsize:8,info:foreignIndex,data:rel});
  }
  for (let i=0;i<extraCount;i++) sec.push({name:`.fixture.${i}`,type:1,flags:0,align:1,data:Buffer.alloc(0)});
  const symIndex=sec.length; sec.push({name:'.symtab',type:2,flags:0,align:4,entsize:16,info:5,data:symbuf});
  const strIndex=sec.length; sec.push({name:'.strtab',type:3,flags:0,align:1,data:symNames.buf});
  const shstrIndex=sec.length;
  const sectionNames=strtab([...sec.map(s=>s.name),'.shstrtab']);
  sec.push({name:'.shstrtab',type:3,flags:0,align:1,data:sectionNames.buf});
  sec[rel1Index].link=symIndex; sec[rel2Index].link=symIndex;
  if (foreignExec) sec[foreignRelIndex].link=symIndex;
  sec[symIndex].link=strIndex;
  let pos=52;
  for (let i=1;i<sec.length;i++) { const s=sec[i]; pos=align(pos,s.align||1); s.offset=pos; pos+=s.data.length; }
  const shoff=align(pos,4), out=Buffer.alloc(shoff+sec.length*40);
  out.write('\x7fELF',0,'binary'); out[4]=1; out[5]=1; out[6]=1;
  out.writeUInt16LE(1,16); out.writeUInt16LE(40,18); out.writeUInt32LE(1,20); out.writeUInt32LE(shoff,32);
  out.writeUInt16LE(52,40); out.writeUInt16LE(40,46); out.writeUInt16LE(sec.length,48); out.writeUInt16LE(shstrIndex,50);
  for (let i=1;i<sec.length;i++) sec[i].data.copy(out,sec[i].offset);
  sec.forEach((s,i)=>{ const p=shoff+i*40; out.writeUInt32LE(sectionNames.offsets.get(s.name)||0,p);
    out.writeUInt32LE(s.type||0,p+4); out.writeUInt32LE(s.flags||0,p+8); out.writeUInt32LE(s.offset||0,p+16);
    out.writeUInt32LE(s.data.length,p+20); out.writeUInt32LE(s.link||0,p+24); out.writeUInt32LE(s.info||0,p+28);
    out.writeUInt32LE(s.align||0,p+32); out.writeUInt32LE(s.entsize||0,p+36); });
  return out;
}

function expectReject(name, mutate) {
  const b=fixture(); const elf=parseElf(b); mutate(b,elf);
  let rejected=false; try { validateElf(b); } catch { rejected=true; }
  check(rejected, `self-test '${name}' was accepted`);
}
function selfTest() {
  validateElf(fixture());
  const composite=fixture(12_001, true); const ct=validateElf(composite);
  check(ct.sections > 12_000, 'large-composite fixture was not large');
  check(ct.relocations === 5, 'foreign composite did not exercise unrelated relocation acceptance');
  expectReject('duplicate body in foreign executable', (b,e)=>{
    const foreign=e.sections.find(s=>s.name==='.text');
    const selected=e.sections.find(s=>s.name===CONTRACT[0].section);
    b.writeUInt32LE(selected.size, foreign.headerOffset+20);
    b.writeUInt32LE(selected.offset, foreign.headerOffset+16);
  });
  expectReject('selected section-name collision', (b,e)=>{
    const foreign=e.sections.find(s=>s.name==='.text');
    const selected=e.sections.find(s=>s.name===CONTRACT[0].section);
    b.writeUInt32LE(selected.nameOffset, foreign.headerOffset);
  });
  expectReject('selected symbol-name collision', (b,e)=>{
    const identity=e.symbols.find(s=>s.name==='ipc_unit_scalar_54');
    const primary=e.symbols.find(s=>s.name===CONTRACT[0].name);
    b.writeUInt32LE(b.readUInt32LE(primary.fileOffset), identity.fileOffset);
  });
  expectReject('body instruction', (b,e)=>b.writeUInt32LE(0,e.sections[2].offset));
  for (const [si,off] of [[2,36],[3,20],[3,76]]) expectReject(`local branch ${si}:${off}`,
    (b,e)=>b.writeUInt32LE((b.readUInt32LE(e.sections[si].offset+off)^1)>>>0,e.sections[si].offset+off));
  for (const [ri] of [[0],[1],[2],[3]]) expectReject(`relocation field ${ri}`,
    (b,e)=>b.writeUInt32LE(e.relocs[ri].offset-4,e.relocs[ri].fileOffset));
  for (const [ri] of [[0],[1],[2],[3]]) expectReject(`relocation identity field ${ri}`,
    (b,e)=>b.writeUInt32LE((7<<8)|2,e.relocs[ri].fileOffset+4));
  expectReject('repeated literal equality', (b,e)=>b.writeUInt32LE((6<<8)|2,e.relocs[2].fileOffset+4));
  expectReject('reused literal identity', (b,e)=>b.writeUInt32LE((7<<8)|2,e.relocs[0].fileOffset+4));
  expectReject('section size', (b,e)=>b.writeUInt32LE(67,e.sections[2].headerOffset+20));
  expectReject('function symbol', (b,e)=>b.writeUInt32LE(4,e.symbols.find(s=>s.name===CONTRACT[0].name).fileOffset+4));
  expectReject('mapping state', (b,e)=>b.writeUInt32LE(4,e.symbols.find(s=>s.name==='$d'&&s.shndx===2).fileOffset+4));
  expectReject('wrong mode mapping', (b,e)=>{ const s=e.symbols.find(s=>s.name==='$a'&&s.shndx===2);
    const strings=e.sections[e.sections[s.table].link]; b[strings.offset+b.readUInt32LE(s.fileOffset)+1]=0x74; });
  return { hostileFixtures: 22, compositeSections: ct.sections };
}

function main() {
  validateRepositoryInputs();
  const args=process.argv.slice(2);
  if (args.includes('--self-test')) {
    const result=selfTest();
    console.log(`arm-ipc-wrappers-89 self-test: ok (${result.hostileFixtures} hostile fixtures, ${result.compositeSections} sections)`);
    if (args.length===1) return;
  }
  const files=args.filter(a=>a!=='--self-test');
  check(files.length===1, 'usage: validate-arm-ipc-wrappers-89.mjs [--self-test] <object.o>');
  const totals=validateElf(readRegular(resolve(files[0])));
  console.log(`arm-ipc-wrappers-89: ok ${JSON.stringify(totals)}`);
}

try { main(); } catch (error) { console.error(`arm-ipc-wrappers-89: ${error.message}`); process.exitCode=1; }
