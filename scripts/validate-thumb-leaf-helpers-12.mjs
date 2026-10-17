#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'config/thumb-leaf-helpers-12.json');
const SOURCE_PATH = join(ROOT, 'src/main/thumb_leaf_helpers_12.S');
const MAX_SOURCE = 64 * 1024 * 1024;
const MAX_OBJECT = 16 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384;
const MAX_SYMBOLS = 1000000;
const MAX_RELOCS = 1000000;
const SENTINEL = '0'.repeat(64);

function fail(message) { throw new Error(message); }
function expect(value, message) { if (!value) fail(message); }
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function assertLimit(kind, size, limit) {
  expect(Number.isSafeInteger(size) && size >= 0, `${kind} size is invalid`);
  expect(size <= limit, `${kind} exceeds ${limit}-byte limit`);
}
function boundedRead(path, limit, kind) {
  const st = statSync(path);
  expect(st.isFile(), `${kind} is not a regular file: ${path}`);
  assertLimit(kind, st.size, limit);
  return readFileSync(path);
}
function hashLines(lines) { return sha256(Buffer.from(lines.join('\n'))); }
function sameJson(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

function validateConfig(config, source) {
  expect(config.schemaVersion === 1 && config.mode === 'thumb', 'unsupported configuration');
  expect(config.source === 'src/main/thumb_leaf_helpers_12.S', 'unexpected source path');
  expect(/^[0-9a-f]{64}$/.test(config.sourceSha256), 'sourceSha256 must be lowercase hexadecimal');
  expect(config.sourceSha256 !== SENTINEL, 'sourceSha256 handoff sentinel was not replaced');
  expect(sha256(source) === config.sourceSha256, 'sourceSha256 mismatch');
  expect(config.totalBodySize === 902 && config.totalAdjacentSize === 0, 'body/residue boundary mismatch');
  expect(config.expectedInstructionCount === 444 && config.wideInstructionCount === 7, 'instruction aggregate mismatch');
  expect(config.localBranchCount === 117 && config.memoryOperationCount === 101, 'branch/memory aggregate mismatch');
  expect(config.returnCount === 1 && config.indirectCallCount === 21 && config.indirectTailCount === 0, 'return/indirect aggregate mismatch');
  expect(config.directCallCount === 7 && config.legacyNopCount === 0, 'direct-call/nop aggregate mismatch');
  expect(Array.isArray(config.duplicateBodyClasses) && config.duplicateBodyClasses.length === 0, 'duplicate classes must be empty');
  expect(config.functions.length === 1, 'exactly one function is required');
  const f = config.functions[0];
  expect(f.name === 'func_00101934' && f.size === 902 && f.nextGlobal === 'func_00101CC8', 'function identity/boundary mismatch');
  expect(f.nextGlobalOffset === 916, 'next-global offset mismatch');
  expect(f.instructionCount === 444 && f.localBranchCount === 117 && f.memoryOperationCount === 101, 'function aggregate mismatch');
  expect(f.returnCount === 1 && f.indirectCallCount === 21 && f.indirectTailCount === 0 && f.directCallCount === 7, 'function control aggregate mismatch');
  expect(Array.isArray(f.legacyNopOffsets) && f.legacyNopOffsets.length === 0, 'legacy nop inventory must be empty');

  const entries = f.schedule.split('|');
  expect(entries.length === 444, 'schedule instruction count mismatch');
  const wide = new Set(f.wideInstructionOffsets);
  expect(wide.size === 7 && [...wide].every((x) => Number.isInteger(x)), 'wide-instruction inventory mismatch');
  let offset = 0;
  const records = [];
  const at = new Map();
  for (const instruction of entries) {
    expect(!at.has(offset), `duplicate schedule offset 0x${offset.toString(16)}`);
    at.set(offset, instruction);
    const split = instruction.indexOf(' ');
    const mnemonic = split < 0 ? instruction : instruction.slice(0, split);
    const operands = split < 0 ? '' : instruction.slice(split + 1);
    records.push(`${f.name}:${offset.toString(16)}:${mnemonic}:${operands}`);
    offset += wide.has(offset) ? 4 : 2;
  }
  expect(offset === 902, 'schedule body size mismatch');
  expect([...wide].every((x) => at.has(x)), 'wide-instruction offset is not an instruction');
  expect(hashLines(records) === config.canonicalHashes.instructionSchedule, 'instruction schedule hash mismatch');

  const localRecords = f.localTransfers.map((x) => {
    const [off, mnemonic, target] = x.split(':');
    return `${f.name}:${off}:${mnemonic}:local:${target}`;
  });
  const returnRecords = f.returns.map((x) => { const p=x.split(':'); return `${f.name}:${p[0]}:${p[1]}:${p.slice(2).join(':')}`; });
  const indirectRecords = f.indirectCalls.map((x) => { const p=x.split(':'); return `${f.name}:${p[0]}:${p[1]}:${p.slice(2).join(':')}`; });
  const tailRecords = f.indirectTails.map((x) => { const p=x.split(':'); return `${f.name}:${p[0]}:${p[1]}:${p.slice(2).join(':')}`; });
  const directRecords = f.directCalls.map((x) => `${f.name}:${x.offset.toString(16)}:${x.mnemonic}:${x.symbol}:${x.targetMode}:${x.relocation}`);
  expect(hashLines(localRecords) === config.canonicalHashes.localTransferSchedule, 'local-transfer hash mismatch');
  expect(hashLines(returnRecords) === config.canonicalHashes.returnTransferSchedule, 'return hash mismatch');
  expect(hashLines(indirectRecords) === config.canonicalHashes.indirectCallSchedule, 'indirect-call hash mismatch');
  expect(hashLines(tailRecords) === config.canonicalHashes.indirectTailSchedule, 'indirect-tail hash mismatch');
  expect(hashLines(directRecords) === config.canonicalHashes.directCallSchedule, 'direct-call hash mismatch');
  expect(f.localTransfers.length === 117 && f.returns.length === 1 && f.indirectCalls.length === 21 && f.indirectTails.length === 0, 'control schedule count mismatch');
  expect(f.directCalls.length === 7 && config.directCalls.length === 7 && config.relocations.length === 7, 'direct-call schedule count mismatch');

  for (const item of f.localTransfers) {
    const match = item.match(/^([0-9a-f]+):([a-z]+\.n):\+([0-9a-f]+)$/);
    expect(match, `malformed local transfer: ${item}`);
    const from = parseInt(match[1], 16), target = parseInt(match[3], 16);
    expect(at.get(from) === `${match[2]} local:+${match[3]}`, `local transfer disagrees at 0x${match[1]}`);
    expect(target < 902 && at.has(target), `local target escapes body: ${item}`);
  }
  for (const item of f.returns) { const [o,m,...rest]=item.split(':'); expect(at.get(parseInt(o,16)) === `${m} ${rest.join(':')}`, `return disagrees at 0x${o}`); }
  for (const item of f.indirectCalls) { const [o,m,r]=item.split(':'); expect(at.get(parseInt(o,16)) === `${m} ${r}`, `indirect call disagrees at 0x${o}`); }
  for (const call of f.directCalls) expect(at.get(call.offset) === `${call.mnemonic} ${call.symbol}`, `direct call disagrees at 0x${call.offset.toString(16)}`);
  expect(sameJson(config.directCalls, f.directCalls.map((x) => ({function:f.name,...x}))), 'top-level direct calls disagree');
  expect(sameJson(config.relocations, f.directCalls.map((x) => ({function:f.name,offset:x.offset,type:x.relocation,symbol:x.symbol}))), 'relocation inventory disagrees');

  const memory = entries.filter((x) => /^(?:ldr|ldrb|ldrh|ldrsb|ldrsh|str|strb|strh|push|pop|ldm|stm)/.test(x));
  expect(memory.length === 101, 'derived memory-operation count mismatch');
  expect(!entries.some((x) => /^nop(?:\.| |$)/.test(x)), 'schedule contains a legacy nop');
  for (const pc of config.pcRelativeDataAccesses) {
    expect(pc.function === f.name && pc.mnemonic === 'ldr' && pc.requiredEntryModulo4 === 0, 'PC-relative contract mismatch');
    expect(pc.ownership === 'unowned-post-body' && pc.targetOffset >= 902 && pc.targetOffset < 916, 'PC-relative residue ownership mismatch');
    const insn = at.get(pc.offset), match = insn?.match(/^ldr r([0-7]), \[pc, #(\d+)\]$/);
    expect(match, `PC-relative instruction missing at 0x${pc.offset.toString(16)}`);
    const target = ((pc.offset + 4) & ~3) + Number(match[2]);
    expect(target === pc.targetOffset, `PC-relative target mismatch at 0x${pc.offset.toString(16)}`);
  }
  return f;
}

function range(buffer, offset, size, what) {
  expect(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset + size <= buffer.length, `${what} is outside object`);
}
function cstring(buffer, base, size, offset, what) {
  expect(offset >= 0 && offset < size, `${what} string offset is invalid`);
  const end = buffer.indexOf(0, base + offset);
  expect(end >= 0 && end < base + size, `${what} string is unterminated`);
  return buffer.toString('utf8', base + offset, end);
}
function parseElf(buffer) {
  assertLimit('object', buffer.length, MAX_OBJECT);
  expect(buffer.length >= 52 && buffer[0]===0x7f && buffer.toString('ascii',1,4)==='ELF', 'not an ELF object');
  expect(buffer[4]===1 && buffer[5]===1 && buffer.readUInt16LE(18)===40, 'object must be ELF32 little-endian ARM');
  const shoff=buffer.readUInt32LE(32), shentsize=buffer.readUInt16LE(46);
  let shnum=buffer.readUInt16LE(48), shstrndx=buffer.readUInt16LE(50);
  expect(shentsize >= 40, 'invalid section-header size');
  range(buffer, shoff, 40, 'section zero');
  if (shnum===0) shnum=buffer.readUInt32LE(shoff+20);
  expect(shnum > 0 && shnum <= MAX_SECTIONS, `section count exceeds ${MAX_SECTIONS}`);
  range(buffer, shoff, shnum*shentsize, 'section table');
  if (shstrndx===0xffff) shstrndx=buffer.readUInt32LE(shoff+24);
  expect(shstrndx < shnum, 'invalid section-name table index');
  const sections=[];
  for(let i=0;i<shnum;i++) {
    const p=shoff+i*shentsize;
    sections.push({index:i,header:p,nameOffset:buffer.readUInt32LE(p),type:buffer.readUInt32LE(p+4),flags:buffer.readUInt32LE(p+8),addr:buffer.readUInt32LE(p+12),offset:buffer.readUInt32LE(p+16),size:buffer.readUInt32LE(p+20),link:buffer.readUInt32LE(p+24),info:buffer.readUInt32LE(p+28),align:buffer.readUInt32LE(p+32),entsize:buffer.readUInt32LE(p+36)});
  }
  const names=sections[shstrndx];
  range(buffer,names.offset,names.size,'section-name table');
  for(const s of sections) s.name=cstring(buffer,names.offset,names.size,s.nameOffset,'section name');
  let executable=0;
  for(const s of sections) if (s.flags&4) { executable+=s.size; expect(executable<=MAX_EXEC,`executable payload exceeds ${MAX_EXEC}`); }
  for(const s of sections) if(s.type!==8 && s.size) range(buffer,s.offset,s.size,`section ${s.name}`);

  const symbols=[];
  let symbolCount=0;
  for(const s of sections.filter((x)=>x.type===2 || x.type===11)) {
    expect(s.entsize>=16 && s.size%s.entsize===0 && s.link<sections.length,'invalid symbol table');
    const count=s.size/s.entsize; symbolCount+=count; expect(symbolCount<=MAX_SYMBOLS,`symbol count exceeds ${MAX_SYMBOLS}`);
    const strings=sections[s.link]; expect(strings.type===3,'symbol table has invalid string table');
    for(let i=0;i<count;i++) { const p=s.offset+i*s.entsize, nameOffset=buffer.readUInt32LE(p); symbols.push({table:s.index,index:i,name:cstring(buffer,strings.offset,strings.size,nameOffset,'symbol'),value:buffer.readUInt32LE(p+4),size:buffer.readUInt32LE(p+8),info:buffer[p+12],other:buffer[p+13],shndx:buffer.readUInt16LE(p+14),entry:p}); }
  }
  const symbolMaps=new Map();
  for(const sym of symbols) { if(!symbolMaps.has(sym.table)) symbolMaps.set(sym.table,new Map()); symbolMaps.get(sym.table).set(sym.index,sym); }
  const relocs=[]; let relocationCount=0;
  for(const s of sections.filter((x)=>x.type===9 || x.type===4)) {
    const minimum=s.type===9?8:12; expect(s.entsize>=minimum && s.size%s.entsize===0 && s.info<sections.length,'invalid relocation section');
    const count=s.size/s.entsize; relocationCount+=count; expect(relocationCount<=MAX_RELOCS,`relocation count exceeds ${MAX_RELOCS}`);
    const map=symbolMaps.get(s.link); expect(map,'relocation section has invalid symbol table');
    for(let i=0;i<count;i++) { const p=s.offset+i*s.entsize, info=buffer.readUInt32LE(p+4), symbol=map.get(info>>>8); expect(symbol,'relocation has invalid symbol index'); relocs.push({section:s.index,target:s.info,offset:buffer.readUInt32LE(p),type:info&255,symbol:symbol.name}); }
  }
  return {buffer,sections,symbols,relocs,sectionCount:shnum,symbolCount,relocationCount,executable};
}

function sectionBytes(elf, section) { return elf.buffer.subarray(section.offset,section.offset+section.size); }
function selectedSection(elf) {
  const matches=elf.sections.filter((s)=>s.name==='.text.func_00101934');
  expect(matches.length===1,'selected executable section missing or duplicated');
  const s=matches[0]; expect((s.flags&6)===6 && s.type===1,'selected section is not executable PROGBITS');
  expect(s.size===902,'selected section must exclude all post-body residue');
  expect(s.align===2,'selected section alignment must be exactly two bytes');
  return s;
}
function validateObject(buffer, baseline, config) {
  const elf=parseElf(buffer), section=selectedSection(elf), baseSection=selectedSection(baseline);
  expect(sectionBytes(elf,section).equals(sectionBytes(baseline,baseSection)),'selected instruction bytes differ from neutral schedule');
  const functions=elf.symbols.filter((x)=>x.name==='func_00101934');
  expect(functions.length===1,'selected-name collision');
  const fn=functions[0]; expect(fn.shndx===section.index && fn.value===1 && fn.size===902 && (fn.info>>4)===1 && (fn.info&15)===2,'selected function symbol contract mismatch');
  const owners=elf.symbols.filter((x)=>x.shndx===section.index && (x.info&15)===2 && (x.info>>4)!==0);
  expect(owners.length===1 && owners[0]===fn,'extra executable ownership in selected section');
  for(const other of elf.sections) {
    if(other.index!==section.index && other.type===1 && (other.flags&4) && other.size===section.size)
      expect(!sectionBytes(elf,other).equals(sectionBytes(elf,section)),'unexpected duplicate executable body');
  }
  const maps=elf.symbols.filter((x)=>x.shndx===section.index && /^\$(?:t|d|a)(?:\.|$)/.test(x.name));
  expect(maps.some((x)=>x.name.startsWith('$t') && (x.value&~1)===0),'Thumb mapping must begin at body offset zero');
  expect(!maps.some((x)=>(x.name.startsWith('$d')||x.name.startsWith('$a')) && (x.value&~1)<902),'interior non-Thumb mapping interval');
  const relocs=elf.relocs.filter((x)=>x.target===section.index).map((x)=>({offset:x.offset,type:x.type,symbol:x.symbol}));
  const wanted=config.relocations.map((x)=>({offset:x.offset,type:10,symbol:x.symbol}));
  expect(sameJson(relocs,wanted),'selected relocation inventory mismatch');
  return elf;
}

function tool(name) {
  const envName=`ARM_NONE_EABI_${name.toUpperCase()}`;
  if(process.env[envName]) return process.env[envName];
  const prefix=process.env.CROSS_COMPILE ?? process.env.ARM_NONE_EABI_PREFIX ?? 'arm-none-eabi-';
  return `${prefix}${name}`;
}
function run(program,args,options={}) {
  const result=spawnSync(program,args,{encoding:'utf8',...options});
  if(result.error) fail(`could not run ${program}: ${result.error.message}`);
  expect(result.status===0,`${program} failed:\n${result.stdout??''}${result.stderr??''}`);
  expect(!(result.stderr??'').trim(),`${program} emitted warnings:\n${result.stderr}`);
}
function assemble(sourcePath,objectPath) {
  run(tool('gcc'),['-c','-x','assembler-with-cpp','-mthumb','-march=armv6k','-Wall','-Wextra','-Werror',sourcePath,'-o',objectPath]);
}

function mutation(buffer, elf, section, field, value) { const copy=Buffer.from(buffer); copy.writeUInt32LE(value,section.header+field); return copy; }
function mustReject(label, action) { let rejected=false; try { action(); } catch { rejected=true; } expect(rejected,`self-test failed to reject ${label}`); }
function selfTest(source,config,baselineBuffer,baseline,temp) {
  const section=selectedSection(baseline);
  validateObject(baselineBuffer,baseline,config);
  const badByte=Buffer.from(baselineBuffer); badByte[section.offset]^=1; mustReject('instruction mutation',()=>validateObject(badByte,baseline,config));
  mustReject('owned residue byte',()=>validateObject(mutation(baselineBuffer,baseline,section,20,903),baseline,config));
  mustReject('raised selected alignment',()=>validateObject(mutation(baselineBuffer,baseline,section,32,4),baseline,config));
  const badMapping=Buffer.from(baselineBuffer), t=baseline.symbols.find((x)=>x.shndx===section.index&&x.name==='$t');
  expect(t,'baseline mapping symbol missing');
  const symtab=baseline.sections[t.table], strtab=baseline.sections[symtab.link], nameOffset=badMapping.readUInt32LE(t.entry);
  badMapping[strtab.offset+nameOffset+1]=0x64;
  mustReject('interior data mapping',()=>validateObject(badMapping,baseline,config));
  const collision=Buffer.from(baselineBuffer), victim=baseline.symbols.find((x)=>x.name==='func_00300750');
  const selected=baseline.symbols.find((x)=>x.name==='func_00101934');
  collision.writeUInt32LE(collision.readUInt32LE(selected.entry),victim.entry);
  mustReject('selected-name collision',()=>validateObject(collision,baseline,config));
  const extraOwner=Buffer.from(baselineBuffer);
  extraOwner.writeUInt32LE(1,victim.entry+4); extraOwner.writeUInt32LE(902,victim.entry+8);
  extraOwner[victim.entry+12]=0x12; extraOwner.writeUInt16LE(section.index,victim.entry+14);
  mustReject('extra executable ownership',()=>validateObject(extraOwner,baseline,config));
  const sentinel={...config,sourceSha256:SENTINEL}; mustReject('digest sentinel',()=>validateConfig(sentinel,source));
  mustReject('source cap',()=>assertLimit('source',MAX_SOURCE+1,MAX_SOURCE));
  mustReject('config cap',()=>assertLimit('config',MAX_SOURCE+1,MAX_SOURCE));
  mustReject('object cap',()=>assertLimit('object',MAX_OBJECT+1,MAX_OBJECT));
  mustReject('executable cap',()=>parseElf(mutation(baselineBuffer,baseline,section,20,MAX_EXEC+1)));
  const tooManySections=Buffer.from(baselineBuffer); tooManySections.writeUInt16LE(MAX_SECTIONS+1,48); mustReject('section cap',()=>parseElf(tooManySections));
  const sym=baseline.sections.find((x)=>x.type===2), tooManySymbols=mutation(baselineBuffer,baseline,sym,20,(MAX_SYMBOLS+1)*sym.entsize); mustReject('symbol cap',()=>parseElf(tooManySymbols));
  const rel=baseline.sections.find((x)=>x.type===9), tooManyRelocs=mutation(baselineBuffer,baseline,rel,20,(MAX_RELOCS+1)*rel.entsize); mustReject('relocation cap',()=>parseElf(tooManyRelocs));

  const foreignSource=join(temp,'foreign.S'), foreignObject=join(temp,'foreign.o'), composite=join(temp,'composite.o');
  let text='.syntax unified\n.thumb\n';
  for(let i=0;i<12000;i++) text+=`.section .foreign_${i}, "ax", %progbits\n.byte 0\n`;
  text+='.section .note.GNU-stack, "", %progbits\n';
  writeFileSync(foreignSource,text);
  assemble(foreignSource,foreignObject);
  run(tool('ld'),['-r',join(temp,'baseline.o'),foreignObject,'-o',composite]);
  const compositeBuffer=boundedRead(composite,MAX_OBJECT,'object'), compositeElf=validateObject(compositeBuffer,baseline,config);
  expect(compositeElf.sectionCount>=12000 && compositeElf.executable>=12000,'large foreign executable composite was not exercised');
  console.log(`self-test: ok (${compositeElf.sectionCount} sections, ${compositeElf.executable} executable bytes)`);
}

function main() {
  const configBuffer=boundedRead(CONFIG_PATH,MAX_SOURCE,'config');
  const source=boundedRead(SOURCE_PATH,MAX_SOURCE,'source');
  let config; try { config=JSON.parse(configBuffer.toString('utf8')); } catch(e) { fail(`invalid config JSON: ${e.message}`); }
  validateConfig(config,source);
  const temp=mkdtempSync(join(tmpdir(),'thumb-leaf-helpers-12-'));
  try {
    const baselinePath=join(temp,'baseline.o'); assemble(SOURCE_PATH,baselinePath);
    const baselineBuffer=boundedRead(baselinePath,MAX_OBJECT,'object'), baseline=parseElf(baselineBuffer);
    validateObject(baselineBuffer,baseline,config);
    const args=process.argv.slice(2), self=args.includes('--self-test'), objectArg=args.find((x)=>x!=='--self-test');
    if(objectArg) validateObject(boundedRead(resolve(objectArg),MAX_OBJECT,'object'),baseline,config);
    if(self) selfTest(source,config,baselineBuffer,baseline,temp);
    console.log(`thumb-leaf-helpers-12: ok (${config.totalBodySize} bytes, ${config.expectedInstructionCount} instructions, ${config.directCallCount} relocations)`);
  } finally { rmSync(temp,{recursive:true,force:true}); }
}

try { main(); } catch(error) { console.error(`thumb-leaf-helpers-12: ${error.message}`); process.exitCode=1; }
