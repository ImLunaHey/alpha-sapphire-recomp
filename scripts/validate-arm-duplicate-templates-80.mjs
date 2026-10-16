#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = resolve(ROOT, 'config/arm-duplicate-templates-80.json');
const EXEC_LIMIT = 16 * 1024 * 1024;
const ARM_MACHINE = 40;
const RELOC_NAMES = new Map([[2, 'R_ARM_ABS32'], [28, 'R_ARM_CALL'], [29, 'R_ARM_JUMP24']]);

function fail(message) { throw new Error(message); }
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function run(tool, args, options = {}) {
  const r = spawnSync(tool, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options });
  if (r.error) fail(`cannot run ${tool}: ${r.error.message}`);
  if (r.status !== 0) fail(`${basename(tool)} failed (${r.status}): ${(r.stderr || r.stdout).trim()}`);
  return r.stdout;
}
function findTool(kind) {
  const explicit = process.env[kind === 'as' ? 'ARM_NONE_EABI_AS' : 'ARM_NONE_EABI_OBJDUMP'];
  const prefix = process.env.CROSS_COMPILE || '';
  const candidates = [explicit, prefix && `${prefix}${kind}`, `arm-none-eabi-${kind}`].filter(Boolean);
  for (const candidate of candidates) {
    const r = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (!r.error && r.status === 0) return candidate;
  }
  fail(`unable to find ARM ${kind}; set ${kind === 'as' ? 'ARM_NONE_EABI_AS' : 'ARM_NONE_EABI_OBJDUMP'} or CROSS_COMPILE`);
}
function u16(b, o) { if (o < 0 || o + 2 > b.length) fail('truncated ELF'); return b.readUInt16LE(o); }
function u32(b, o) { if (o < 0 || o + 4 > b.length) fail('truncated ELF'); return b.readUInt32LE(o); }
function range(b, off, size, what) {
  if (!Number.isSafeInteger(off) || !Number.isSafeInteger(size) || off < 0 || size < 0 || off + size > b.length)
    fail(`${what} is outside the ELF file`);
  return b.subarray(off, off + size);
}
function cstring(b, off) {
  if (off < 0 || off >= b.length) fail('invalid ELF string offset');
  const end = b.indexOf(0, off);
  if (end < 0) fail('unterminated ELF string');
  return b.toString('utf8', off, end);
}

function parseElf(path) {
  const b = readFileSync(path);
  if (b.length < 52 || b.toString('latin1', 0, 4) !== '\x7fELF') fail(`${path}: not ELF`);
  if (b[4] !== 1 || b[5] !== 1 || b[6] !== 1) fail(`${path}: requires 32-bit little-endian ELF v1`);
  if (u16(b, 18) !== ARM_MACHINE) fail(`${path}: not an ARM ELF`);
  const shoff = u32(b, 32), shentsize = u16(b, 46), shnum = u16(b, 48), shstrndx = u16(b, 50);
  if (shentsize < 40 || shnum === 0 || shnum > 65535 || shstrndx >= shnum) fail(`${path}: invalid section table`);
  range(b, shoff, shentsize * shnum, 'section table');
  const sections = [];
  for (let i = 0; i < shnum; i++) {
    const o = shoff + i * shentsize;
    sections.push({ index: i, nameOff: u32(b,o), type: u32(b,o+4), flags: u32(b,o+8), addr: u32(b,o+12), offset: u32(b,o+16), size: u32(b,o+20), link: u32(b,o+24), info: u32(b,o+28), align: u32(b,o+32), entsize: u32(b,o+36) });
  }
  const shstrSec = sections[shstrndx];
  const shstr = range(b, shstrSec.offset, shstrSec.size, 'section-name table');
  let executableBytes = 0;
  for (const s of sections) {
    s.name = cstring(shstr, s.nameOff);
    if (s.type !== 8) range(b, s.offset, s.size, `section ${s.name}`);
    if (s.flags & 4) {
      executableBytes += s.size;
      if (executableBytes > EXEC_LIMIT) fail(`${path}: executable sections exceed 16 MiB`);
    }
  }
  const symbols = [];
  for (const s of sections.filter(x => x.type === 2)) {
    if (s.link >= sections.length || s.entsize < 16 || s.size % s.entsize) fail(`${path}: malformed symbol table`);
    const strings = sections[s.link];
    const str = range(b, strings.offset, strings.size, 'symbol string table');
    for (let o = 0, index = 0; o < s.size; o += s.entsize, index++) {
      const p = s.offset + o, nameOff = u32(b,p), shndx = u16(b,p+14);
      symbols.push({ index, table: s.index, name: cstring(str,nameOff), value: u32(b,p+4), size: u32(b,p+8), info: b[p+12], other: b[p+13], shndx, section: shndx < sections.length ? sections[shndx] : null });
    }
  }
  const byTableIndex = new Map(symbols.map(s => [`${s.table}:${s.index}`, s]));
  const relocs = [];
  for (const s of sections.filter(x => x.type === 9)) {
    if (s.link >= sections.length || s.info >= sections.length || s.entsize < 8 || s.size % s.entsize) fail(`${path}: malformed relocation section`);
    for (let o = 0; o < s.size; o += s.entsize) {
      const p = s.offset + o, info = u32(b,p+4), sym = byTableIndex.get(`${s.link}:${info >>> 8}`);
      if (!sym) fail(`${path}: relocation references invalid symbol`);
      relocs.push({ target: sections[s.info], offset: u32(b,p), type: info & 0xff, symbol: sym });
    }
  }
  return { path, b, sections, symbols, relocs };
}

function definitions(objects, name) {
  return objects.flatMap(o => o.symbols.filter(s => s.name === name && s.shndx !== 0 && s.section).map(s => ({ object:o, symbol:s })));
}
function resolvedDefinitions(objects, name) {
  return objects.flatMap(o => o.symbols.filter(s => s.name === name && s.shndx !== 0).map(s => ({ object:o, symbol:s })));
}
function sectionBytes(object, section) { return range(object.b, section.offset, section.size, `section ${section.name}`); }
function expectedRelocations(fn, cfg) {
  const direct = fn.directTransfers.map(x => ({ offset:x.offset, kind:x.kind, mnemonic:x.mnemonic, symbol:x.symbol }));
  const literals = fn.literals.map(x => ({ offset:x.offset, kind:'R_ARM_ABS32', mnemonic:'word', symbol:cfg.literalIdentities[x.identity].symbol }));
  return [...direct, ...literals].sort((a,b) => a.offset-b.offset);
}
function validateDisassembly(objdump, object, section, bodySize, fn) {
  const out = run(objdump, ['-d', '-m', 'arm', '-j', section.name, '--start-address=0', `--stop-address=${bodySize}`, object.path]);
  const offsets = [];
  for (const line of out.split(/\r?\n/)) {
    const m = line.match(/^\s*([0-9a-fA-F]+):\s+([0-9a-fA-F]{8})\s+\S/);
    if (m) offsets.push(parseInt(m[1],16));
  }
  const wanted = Array.from({length: bodySize / 4}, (_,i) => i*4);
  if (offsets.length !== wanted.length || offsets.some((x,i) => x !== wanted[i]))
    fail(`${fn.name}: section-scoped ARM disassembly is not ${wanted.length} contiguous instructions`);
}
function canonicalChecks(cfg) {
  const instruction = [], local = [], relocation = [], literal = [];
  const templateCounts = new Map();
  let ownedBytes = 0, directCount = 0, returnCount = 0, postBodyCount = 0;
  for (const fn of cfg.functions) {
    const t = cfg.templates[fn.template];
    if (!t) fail(`${fn.name}: unknown template`);
    templateCounts.set(fn.template, (templateCounts.get(fn.template) || 0) + 1);
    if (t.bodySize !== t.instructionCount * 4 || fn.internalLabelOffsets.length !== t.internalLabels) fail(`${fn.name}: malformed template dimensions`);
    if (fn.directTransfers.length !== t.directTransfers || fn.localTransfers.length !== t.internalLabels) fail(`${fn.name}: transfer count mismatch`);
    if (fn.nextGlobalOffset < t.bodySize || (fn.nextGlobalOffset & 3)) fail(`${fn.name}: invalid next-global boundary`);
    for (const x of fn.localTransfers) if ((x.offset & 3) || (x.targetOffset & 3) || x.offset >= t.bodySize || x.targetOffset >= t.bodySize) fail(`${fn.name}: invalid local transfer`);
    for (const x of fn.postBodyReferences) if (x.offset >= t.bodySize || x.targetOffset < t.bodySize || x.targetOffset >= fn.nextGlobalOffset) fail(`${fn.name}: invalid post-body reference`);
    ownedBytes += fn.templateMaterialEndOffset === undefined ? t.bodySize : fn.templateMaterialEndOffset + 1;
    directCount += fn.directTransfers.length;
    returnCount += t.returns;
    postBodyCount += fn.postBodyReferences.length;
    t.instructions.forEach((ins,i) => {
      let resolved = ins;
      for (const d of fn.directTransfers) resolved = resolved.replace(`{${d.role}}`, d.symbol);
      const localSite = fn.localTransfers.find(x => x.offset === i*4);
      if (localSite) resolved = `${localSite.mnemonic} local:+${localSite.targetOffset}`;
      instruction.push(`${fn.name}|${i*4}|${resolved}`);
    });
    fn.localTransfers.forEach(x => local.push(`${fn.name}|${x.offset}|${x.mnemonic}|local:+${x.targetOffset}`));
    expectedRelocations(fn,cfg).forEach(x => relocation.push(`${fn.name}|${x.offset}|${x.kind}|${x.mnemonic}|${x.symbol}`));
    fn.literals.forEach(x => literal.push(`${fn.name}|${x.loadOffset}|${x.offset}|${x.identity}`));
  }
  const groups = { instructionSchedule:instruction, localTransferSchedule:local, relocationSchedule:relocation, literalIdentitySchedule:literal };
  for (const [key, lines] of Object.entries(groups)) {
    const got = sha256(`${lines.join('\n')}\n`);
    if (got !== cfg.canonicalHashes[key]) fail(`${key} hash mismatch: ${got}`);
  }
  if (instruction.length !== cfg.expectedInstructionCount) fail('instruction total mismatch');
  if (cfg.functions.reduce((n,f)=>n+cfg.templates[f.template].bodySize,0) !== cfg.expectedBodyBytes) fail('body-byte total mismatch');
  if (ownedBytes !== cfg.expectedOwnedBytes) fail('owned-byte total mismatch');
  for (const [name,t] of Object.entries(cfg.templates)) if ((templateCounts.get(name)||0)!==t.count) fail(`${name}: function count mismatch`);
  if (directCount !== 29 || returnCount !== 5 || postBodyCount !== cfg.postBodyReferenceContract.siteCount || literal.length !== cfg.literalIdentityContract.siteCount) fail('aggregate contract mismatch');
}

function validateObjects(objects, reference, cfg, objdump) {
  const ownerNames = new Set(cfg.functions.map(f => f.name));
  for (const fn of cfg.functions) {
    const defs = definitions(objects, fn.name);
    if (defs.length !== 1) fail(`${fn.name}: expected exactly one definition, found ${defs.length}`);
    const { object, symbol } = defs[0], t = cfg.templates[fn.template];
    const expectedSection = `.text.${fn.name}`;
    if (symbol.section.name !== expectedSection || !(symbol.section.flags & 4)) fail(`${fn.name}: must own executable section ${expectedSection}`);
    if ((symbol.info & 15) !== 2 || symbol.value !== 0 || symbol.size !== t.bodySize) fail(`${fn.name}: invalid function symbol boundary`);
    const ownedEnd = fn.templateMaterialEndOffset === undefined ? t.bodySize : fn.templateMaterialEndOffset + 1;
    if (symbol.section.size !== ownedEnd) fail(`${fn.name}: section owns ${symbol.section.size} bytes, expected ${ownedEnd}`);
    const refDef = definitions([reference], fn.name)[0];
    const actual = sectionBytes(object,symbol.section), expected = sectionBytes(reference,refDef.symbol.section);
    if (actual.length !== expected.length) fail(`${fn.name}: material size mismatch`);
    const masked = new Set(fn.directTransfers.map(x=>x.offset));
    for (let i=0;i<actual.length;i++) {
      const transferWord = masked.has(i & ~3);
      if ((!transferWord || i % 4 === 3) && actual[i] !== expected[i]) fail(`${fn.name}: byte mismatch at +${i}`);
    }
    const actualRel = object.relocs.filter(r=>r.target.index===symbol.section.index).sort((a,b)=>a.offset-b.offset);
    const wanted = expectedRelocations(fn,cfg);
    if (actualRel.length !== wanted.length) fail(`${fn.name}: expected ${wanted.length} relocations, found ${actualRel.length}`);
    wanted.forEach((w,i) => {
      const a=actualRel[i], kind=RELOC_NAMES.get(a.type);
      if (a.offset!==w.offset || kind!==w.kind || a.symbol.name!==w.symbol) fail(`${fn.name}: bad relocation at index ${i}`);
    });
    validateDisassembly(objdump, object, symbol.section, t.bodySize, fn);
  }
  for (const object of objects) {
    for (const s of object.symbols) if (ownerNames.has(s.name) && s.shndx !== 0 && !s.section) fail(`${s.name}: invalid definition`);
  }
  validateResolvedIdentities(objects,cfg);
}
function validateResolvedIdentities(objects,cfg) {
  const addressOf = name => {
    const ds=resolvedDefinitions(objects,name);
    if (ds.length>1) fail(`${name}: multiple definitions make identity ambiguous`);
    if (!ds.length) return null;
    const d=ds[0];
    return d.symbol.section ? `${resolve(d.object.path)}:${d.symbol.section.index}:${d.symbol.value}` : `special:${d.symbol.shndx}:${d.symbol.value}`;
  };
  const branchNames=[...cfg.branchIdentityContract.primaryEntries,...cfg.branchIdentityContract.secondaryEntries];
  const branchSeen=new Map();
  for (const name of branchNames) {
    const ds=resolvedDefinitions(objects,name);
    if (ds.length && ((ds[0].symbol.value & ~1) % cfg.branchIdentityContract.minimumAlignment)) fail(`${name}: insufficient branch-target alignment`);
    const a=addressOf(name); if (a && branchSeen.has(a)) fail(`${name} aliases branch class ${branchSeen.get(a)}`); if(a) branchSeen.set(a,name);
  }
  const literalNames=Object.values(cfg.literalIdentities).map(x=>x.symbol), literalSeen=new Map();
  for (const name of literalNames) { const a=addressOf(name); if (a && literalSeen.has(a)) fail(`${name} aliases literal class ${literalSeen.get(a)}`); if(a) literalSeen.set(a,name); }
  for (const rel of cfg.branchIdentityContract.secondaryEntryRelations) {
    const sd=definitions(objects,rel.symbol), od=definitions(objects,rel.owner), nd=definitions(objects,rel.nextGlobal);
    if (sd.length && od.length && (sd[0].object.path!==od[0].object.path || sd[0].symbol.section.index!==od[0].symbol.section.index || sd[0].symbol.value!==od[0].symbol.value+rel.ownerOffset)) fail(`${rel.symbol}: secondary owner relation mismatch`);
    if (sd.length && nd.length && sd[0].object.path===nd[0].object.path && sd[0].symbol.section.index===nd[0].symbol.section.index && nd[0].symbol.value-sd[0].symbol.value!==rel.bytesBeforeNextGlobal) fail(`${rel.symbol}: next-global relation mismatch`);
  }
}

let temp;
try {
  const cfg=JSON.parse(readFileSync(CONFIG_PATH,'utf8'));
  canonicalChecks(cfg);
  const source=resolve(ROOT,cfg.source), sourceData=readFileSync(source);
  const sourceHash=sha256(sourceData);
  if (sourceHash!==cfg.sourceSha256) fail(`source SHA-256 mismatch: ${sourceHash}`);
  const rawArgs=process.argv.slice(2);
  if (rawArgs.includes('--help')) { console.log(`usage: ${basename(process.argv[1])} [--object OBJECT | OBJECT]...\nValidates the canonical source when no object is supplied; additional objects may provide foreign symbol definitions.`); process.exit(0); }
  const paths=[];
  for(let i=0;i<rawArgs.length;i++) {
    if(rawArgs[i]==='--object') { if(++i>=rawArgs.length) fail('--object requires a path'); paths.push(resolve(rawArgs[i])); }
    else if(rawArgs[i].startsWith('-')) fail(`unknown option: ${rawArgs[i]}`);
    else paths.push(resolve(rawArgs[i]));
  }
  const as=findTool('as'), objdump=findTool('objdump');
  temp=mkdtempSync(resolve(tmpdir(),'dt80-'));
  const referencePath=resolve(temp,'reference.o');
  run(as,['-o',referencePath,source]);
  const reference=parseElf(referencePath);
  for(const p of paths) if(!existsSync(p)) fail(`object not found: ${p}`);
  const objects=paths.length ? paths.map(parseElf) : [reference];
  validateObjects(objects,reference,cfg,objdump);
  console.log(`arm duplicate templates 80: OK; ${cfg.functions.length} functions, ${cfg.expectedInstructionCount} instructions, ${cfg.expectedBodyBytes} body bytes, ${cfg.expectedOwnedBytes} owned bytes; source sha256 ${sourceHash}`);
} catch (e) {
  console.error(`arm duplicate templates 80: FAIL: ${e.message}`);
  process.exitCode=1;
} finally { if(temp) rmSync(temp,{recursive:true,force:true}); }
