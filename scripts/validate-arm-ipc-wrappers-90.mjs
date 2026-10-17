#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONFIG_PATH = path.join(ROOT, 'config/arm-ipc-wrappers-90.json');
const SOURCE_REL = 'src/main/arm_ipc_wrappers_90.S';
const SOURCE_SHA = '722c34ca0723741e510c155d1012bdd987e479be3cb619e726fe028d972d6104';
const SCHEDULE_SHA = 'df36366b0d78387b99b64c88944124d22a745b0b7bed2fb58aef75ea9395d069';
const MAX_FILE = 64 * 1024 * 1024, MAX_SECTION = 16 * 1024 * 1024;
const MAX_SECTIONS = 16384, MAX_SYMBOLS = 1000000, MAX_RELOCS = 1000000;
const ARM = 40, SHT_PROGBITS = 1, SHT_SYMTAB = 2, SHT_STRTAB = 3;
const SHT_NOBITS = 8, SHT_REL = 9, SHT_RELA = 4, SHF_EXECINSTR = 4;
const STB_GLOBAL = 1, STT_FUNC = 2, R_ARM_ABS32 = 2, R_ARM_CALL = 28;

function fail(message) { throw new Error(message); }
function check(ok, message) { if (!ok) fail(message); }
function sha256(data) { return crypto.createHash('sha256').update(data).digest('hex'); }
function range(off, size, limit, what) {
  check(Number.isSafeInteger(off) && Number.isSafeInteger(size) && off >= 0 && size >= 0 && off <= limit && size <= limit - off, `${what} out of bounds`);
}
function cstr(buf, off, what) {
  check(Number.isInteger(off) && off >= 0 && off < buf.length, `${what} string offset`);
  const end = buf.indexOf(0, off); check(end >= 0, `${what} unterminated string`);
  return buf.toString('utf8', off, end);
}
function words(...xs) { const b = Buffer.alloc(xs.length * 4); xs.forEach((x,i)=>b.writeUInt32LE(x>>>0,i*4)); return b; }

const EXPECTED = {
  func_00180770: words(
    0xe92d4070,0xe24dd030,0xed9f0a2d,0xe1a05000,
    0xed8d0a08,0xed8d0a04,0xed8d0a00,0xed8d0a09,0xed8d0a05,0xed8d0a01,
    0xed8d0a0a,0xed8d0a06,0xed8d0a02,0xed8d0a0b,0xed8d0a07,0xed8d0a03,
    0xe3a00000,0xe58d0000,0xe58d0004,0xe58d0008,0xe58d000c,0xe58d0010,
    0xe58d0014,0xe58d0018,0xe58d001c,0xe58d0020,0xe58d0024,0xe58d0028,0xe58d002c,
    0xe5950008,0xe3a04000,0xe3500000,0xda00000d,0xe7956104,0xe3560000,0x0a000006,
    0xe1a0200d,0xe1a01004,0xe1a00005,0xebfffffe,0xe1a0100d,0xe1a00006,0xebfffffe,
    0xe5950008,0xe2844001,0xe1500004,0xcafffff1,0xe28dd030,0xe8bd8070),
  func_0018085C: words(
    0xeddf0a0c,0xe0801101,0xeeb40ae0,0xeef1fa10,0x3eb00a60,0xedd10a12,
    0xeef40a40,0xeef1fa10,0x0a000003,0xed810a12,0xe1d012b0,0xe3811008,0xe1c012b0,0xe12fff1e),
  func_00180898: words(
    0xeddf0a0b,0xeeb40ae0,0xeef1fa10,0x3eb00a60,0xedd00a09,0xeef40a40,
    0xeef1fa10,0x0a000003,0xe1d012b0,0xed800a09,0xe3811040,0xe1c012b0,0xe12fff1e)
};

const FUNCS = [
  {name:'func_00180770', section:'.text.func_00180770', body:196, full:200, pool:196,
   calls:[[156,'service_state_apply_secondary_90'],[168,'func_0018C714']], locals:[128,140,184], returns:[192], load:8},
  {name:'func_0018085C', section:'.text.func_0018085C', body:56, full:60, pool:56,
   calls:[], locals:[32], returns:[52], load:0},
  {name:'func_00180898', section:'.text.func_00180898', body:52, full:56, pool:52,
   calls:[], locals:[28], returns:[48], load:0}
];

function loadContract() {
  const raw = fs.readFileSync(CONFIG_PATH);
  const c = JSON.parse(raw);
  check(c.source === SOURCE_REL, 'configured source path changed');
  check(c.sourceSha256 === SOURCE_SHA, 'configured source hash changed');
  check(c.normalizedScheduleSha256 === SCHEDULE_SHA, 'normalized schedule hash changed');
  check(c.mode === 'arm' && c.totalBodySize === 304 && c.totalAdjacentSize === 12, 'configured totals changed');
  check(c.cumulativePoolSlots === 877 && c.cumulativePoolClasses === 460, 'configured cumulative totals changed');
  check(JSON.stringify(c.literalIdentities) === '["service_zero_scalar_51"]' &&
        JSON.stringify(c.reusedLiteralIdentities) === '["service_zero_scalar_51"]' &&
        JSON.stringify(c.newLiteralIdentities) === '[]', 'literal identity contract changed');
  check(c.functions.length === 3, 'function count changed');
  for (let i=0;i<3;i++) {
    const a=c.functions[i], b=FUNCS[i];
    check(a.name===b.name && a.section===b.section && a.size===b.body && a.nextGlobalOffset===b.full, `function contract changed: ${b.name}`);
  }
  const bc=c.branchIdentityContract;
  check(bc.mode==='arm' && bc.minimumAlignment===4 && bc.classesPairwiseDistinct===true, 'branch identity contract changed');
  check(JSON.stringify(bc.primaryEntries)==='["func_0018C714"]' && JSON.stringify(bc.secondaryEntries)==='["service_state_apply_secondary_90"]', 'branch identities changed');
  const rel=bc.secondaryEntryRelations?.[0];
  check(rel?.symbol==='service_state_apply_secondary_90' && rel.owner==='func_001878A8' && rel.ownerOffset===108 && rel.nextGlobal==='func_00187C24' && rel.bytesBeforeNextGlobal===784, 'secondary relation changed');
  const sourcePath=path.resolve(ROOT,c.source);
  check(sourcePath.startsWith(ROOT+path.sep), 'source escapes repository');
  const st=fs.lstatSync(sourcePath); check(st.isFile() && !st.isSymbolicLink(), 'source is not a regular file');
  check(sha256(fs.readFileSync(sourcePath))===SOURCE_SHA, 'source SHA-256 mismatch');
  return c;
}

function parseElf(file) {
  const st=fs.lstatSync(file); check(st.isFile() && !st.isSymbolicLink(), 'input must be a regular non-symlink file');
  check(st.size <= MAX_FILE, 'ELF exceeds 64 MiB');
  const b=fs.readFileSync(file); check(b.length>=52, 'truncated ELF header');
  check(b[0]===0x7f && b.toString('ascii',1,4)==='ELF' && b[4]===1 && b[5]===1 && b[6]===1, 'not ELF32 little-endian version 1');
  check(b.readUInt16LE(16)===1 && b.readUInt16LE(18)===ARM, 'requires ARM ET_REL');
  check(b.readUInt32LE(20)===1 && b.readUInt16LE(40)===52 && b.readUInt16LE(46)===40, 'malformed ELF header sizes');
  const shoff=b.readUInt32LE(32), shnum=b.readUInt16LE(48), shstrndx=b.readUInt16LE(50);
  check(shnum>0 && shnum<=MAX_SECTIONS && shstrndx>0 && shstrndx<shnum, 'invalid or excessive section count');
  range(shoff,shnum*40,b.length,'section table');
  const secs=[];
  for(let i=0;i<shnum;i++) {
    const o=shoff+i*40;
    const s={index:i,nameOff:b.readUInt32LE(o),type:b.readUInt32LE(o+4),flags:b.readUInt32LE(o+8),offset:b.readUInt32LE(o+16),size:b.readUInt32LE(o+20),link:b.readUInt32LE(o+24),info:b.readUInt32LE(o+28),align:b.readUInt32LE(o+32),entsize:b.readUInt32LE(o+36)};
    check(s.size<=MAX_SECTION,`section ${i} exceeds 16 MiB`);
    if(s.type!==SHT_NOBITS) range(s.offset,s.size,b.length,`section ${i}`);
    check(!(s.type===SHT_NOBITS && (s.flags&SHF_EXECINSTR)),`executable NOBITS section ${i}`);
    secs.push(s);
  }
  const shstr=secs[shstrndx]; check(shstr.type===SHT_STRTAB,'invalid shstrtab');
  const names=b.subarray(shstr.offset,shstr.offset+shstr.size);
  for(const s of secs) s.name=cstr(names,s.nameOff,`section ${s.index}`);
  const symbols=[], symtabs=new Map(); let symbolCount=0;
  for(const s of secs) if(s.type===SHT_SYMTAB) {
    check(s.entsize===16 && s.size%16===0 && s.link<secs.length && secs[s.link].type===SHT_STRTAB,'malformed symbol table');
    symbolCount+=s.size/16; check(symbolCount<=MAX_SYMBOLS,'symbol cap exceeded');
    const str=secs[s.link], strb=b.subarray(str.offset,str.offset+str.size), tab=[];
    for(let j=0;j<s.size/16;j++) { const o=s.offset+j*16, name=cstr(strb,b.readUInt32LE(o),`symbol ${j}`); const info=b[o+12];
      const x={table:s.index,index:j,name,value:b.readUInt32LE(o+4),size:b.readUInt32LE(o+8),bind:info>>4,type:info&15,shndx:b.readUInt16LE(o+14)};
      check(x.shndx<secs.length || x.shndx===0 || x.shndx>=0xff00,'invalid symbol section index'); tab.push(x); symbols.push(x);
    } symtabs.set(s.index,tab);
  }
  let relocCount=0; const relocs=[];
  for(const s of secs) if(s.type===SHT_REL || s.type===SHT_RELA) {
    const es=s.type===SHT_REL?8:12; check(s.entsize===es && s.size%es===0 && s.link<secs.length && symtabs.has(s.link) && s.info<secs.length,'malformed relocation section');
    relocCount+=s.size/es; check(relocCount<=MAX_RELOCS,'relocation cap exceeded'); const tab=symtabs.get(s.link);
    for(let j=0;j<s.size/es;j++){const o=s.offset+j*es, info=b.readUInt32LE(o+4), si=info>>>8; check(si<tab.length,'relocation symbol index');
      relocs.push({section:s.info,offset:b.readUInt32LE(o),type:info&255,symbol:tab[si],rela:s.type===SHT_RELA});}
  }
  return {b,secs,symbols,relocs};
}

function mappingAt(elf, secIndex, offset) {
  const maps=elf.symbols.filter(x=>x.shndx===secIndex && /^\$(a|d|t)(?:\.|$)/.test(x.name) && x.value<=offset).sort((a,b)=>a.value-b.value);
  return maps.length ? maps.at(-1).name[1] : null;
}

function validateElf(file) {
  loadContract(); const e=parseElf(file);
  const globalDefs=new Map();
  for(const s of e.symbols) if(s.bind===STB_GLOBAL && s.shndx>0 && s.shndx<0xff00) {
    check(!globalDefs.has(s.name),`duplicate global definition: ${s.name}`); globalDefs.set(s.name,s);
  }
  let bodies=0, adjacent=0, slots=0, classes=new Set(), reused=new Set(), newClasses=new Set();
  let branchRelocs=0, localBranches=0, indirectCalls=0, returns=0, externalTails=0;
  const selected=[];
  for(const f of FUNCS) {
    const matches=e.secs.filter(s=>s.name===f.section); check(matches.length===1,`missing or duplicate section ${f.section}`); const sec=matches[0];
    check(sec.type===SHT_PROGBITS && (sec.flags&SHF_EXECINSTR),`${f.section} is not executable PROGBITS`);
    check(sec.size===f.full,`${f.name} section size`); const data=e.b.subarray(sec.offset,sec.offset+sec.size), expected=EXPECTED[f.name];
    check(data.subarray(0,f.body).equals(expected),`${f.name} instruction schedule mismatch`);
    const defs=e.symbols.filter(s=>s.name===f.name && s.bind===STB_GLOBAL && s.type===STT_FUNC && s.shndx===sec.index && s.value===0 && s.size===f.body);
    check(defs.length===1,`${f.name} function symbol contract`);
    const aliases=e.symbols.filter(s=>s.shndx===sec.index && s.value===0 && s.name && !/^\$/.test(s.name) && s.name!==f.name);
    check(aliases.length===0,`${f.name} entry alias`);
    const interior=e.symbols.filter(s=>s.shndx===sec.index && s.type===STT_FUNC && s.value>0 && s.value<f.body);
    check(interior.length===0,`${f.name} interior function entry`);
    const maps=e.symbols.filter(s=>s.shndx===sec.index && /^\$(a|d|t)(?:\.|$)/.test(s.name)).map(s=>[s.name[1],s.value]).sort((a,b)=>a[1]-b[1]);
    check(maps.length===2 && maps[0][0]==='a' && maps[0][1]===0 && maps[1][0]==='d' && maps[1][1]===f.pool,`${f.name} mapping-symbol contract`);
    check(mappingAt(e,sec.index,f.body-4)==='a' && mappingAt(e,sec.index,f.pool)==='d',`${f.name} mapping state`);
    const rs=e.relocs.filter(r=>r.section===sec.index); check(rs.length===f.calls.length+1,`${f.name} relocation count`);
    for(const [off,target] of f.calls){const rr=rs.filter(r=>r.offset===off); check(rr.length===1 && !rr[0].rela && rr[0].type===R_ARM_CALL && rr[0].symbol.name===target,`call relocation ${f.name}+${off}`); branchRelocs++;}
    const lr=rs.filter(r=>r.offset===f.pool); check(lr.length===1 && !lr[0].rela && lr[0].type===R_ARM_ABS32 && lr[0].symbol.name==='service_zero_scalar_51',`literal relocation ${f.name}`);
    check(data.readUInt32LE(f.pool)===0,'literal relocation field/addend changed');
    bodies+=f.body; adjacent+=f.full-f.body; slots++; classes.add(lr[0].symbol.name); reused.add(lr[0].symbol.name);
    localBranches+=f.locals.length; returns+=f.returns.length; selected.push({sec,data,f});
  }
  check(bodies===304 && adjacent===12 && slots===3 && classes.size===1 && reused.size===1 && newClasses.size===0,'recomputed literal/body totals');
  check(branchRelocs===2 && localBranches===5 && indirectCalls===0 && returns===3 && externalTails===0,'recomputed control-flow totals');
  check(classes.has('service_zero_scalar_51'),'literal identity/reuse mismatch');
  check(e.relocs.filter(r=>FUNCS.some(f=>e.secs[r.section]?.name===f.section)).length===5,'unexpected selected relocation');
  check(new Set(FUNCS.flatMap(f=>f.calls.map(x=>x[1]))).size===2,'call classes not pairwise distinct');
  for(const {sec,data,f} of selected) for(const x of e.secs) if(x.index!==sec.index && x.type===SHT_PROGBITS && (x.flags&SHF_EXECINSTR) && x.size>=f.body) {
    const foreign=e.b.subarray(x.offset,x.offset+x.size); check(foreign.indexOf(data.subarray(0,f.body))<0,`duplicated selected body ${f.name}`);
  }
  for(const name of ['service_state_apply_secondary_90','func_0018C714']) {
    const d=globalDefs.get(name); if(d){check(d.type===STT_FUNC && d.value%4===0 && mappingAt(e,d.shndx,d.value)==='a',`wrong-mode target ${name}`);
      const aliases=e.symbols.filter(s=>s.shndx===d.shndx && s.value===d.value && s.name && !/^\$/.test(s.name) && s.name!==name);
      check(aliases.length===0,`target alias ${name}`);}
  }
  const secondary=globalDefs.get('service_state_apply_secondary_90'), owner=globalDefs.get('func_001878A8'), next=globalDefs.get('func_00187C24');
  if(secondary||owner||next){check(secondary&&owner&&next&&owner.shndx===secondary.shndx,'secondary owner globals'); check(secondary.value-owner.value===108,'secondary entry relation');}
  return {bodyBytes:bodies,adjacentBytes:adjacent,slots,classes:classes.size,calls:branchRelocs,localBranches,returns};
}

function buildFixture(opts={}) {
  const secs=[{name:'',type:0,flags:0,data:Buffer.alloc(0),align:0}];
  const add=(name,type,flags,data,align=4)=>{secs.push({name,type,flags,data,align}); return secs.length-1;};
  const cfg={};
  for(const f of FUNCS) cfg[f.name]=add(f.section,SHT_PROGBITS,6,Buffer.concat([EXPECTED[f.name],Buffer.alloc(4)]));
  const foreign=[]; for(let i=0;i<(opts.foreignCount||0);i++) foreign.push(add(`.text.foreign.${i}`,SHT_PROGBITS,6,Buffer.from([i&255]),1));
  const owner=add('.text.secondary-owner',SHT_PROGBITS,6,Buffer.alloc(896),4);
  const primary=add('.text.primary-target',SHT_PROGBITS,6,Buffer.alloc(4),4);
  const symbols=[{name:'',bind:0,type:0,shndx:0,value:0,size:0}];
  const symIndex=new Map();
  const sym=(name,bind,type,shndx,value,size=0)=>{const i=symbols.length; symbols.push({name,bind,type,shndx,value,size}); if(name) symIndex.set(name,i); return i;};
  const mapPos={};
  for(const f of FUNCS){const si=cfg[f.name]; mapPos[`${f.name}:a`]=sym('$a',0,0,si,0); mapPos[`${f.name}:d`]=sym('$d',0,0,si,f.pool);}
  sym('$a',0,0,owner,0); sym('$a',0,0,primary,0);
  const firstGlobal=symbols.length;
  for(const f of FUNCS) sym(f.name,STB_GLOBAL,STT_FUNC,cfg[f.name],0,f.body);
  sym('func_001878A8',STB_GLOBAL,STT_FUNC,owner,0,896);
  sym('service_state_apply_secondary_90',STB_GLOBAL,STT_FUNC,owner,108,0);
  sym('func_00187C24',STB_GLOBAL,STT_FUNC,owner,892,4);
  sym('func_0018C714',STB_GLOBAL,STT_FUNC,primary,0,4);
  sym('service_zero_scalar_51',STB_GLOBAL,0,0,0,0);
  sym('other_literal',STB_GLOBAL,0,0,0,0);
  if(opts.paddingSymbols) for(let i=0;i<opts.paddingSymbols;i++) symbols.push({name:'',bind:STB_GLOBAL,type:0,shndx:0,value:0,size:0});
  const strParts=[Buffer.from([0])], strOff=new Map([['',0]]); let strLen=1;
  for(const s of symbols) if(s.name&&!strOff.has(s.name)){strOff.set(s.name,strLen);const z=Buffer.from(s.name+'\0');strParts.push(z);strLen+=z.length;}
  const strtab=add('.strtab',SHT_STRTAB,0,Buffer.concat(strParts),1);
  const symdata=Buffer.alloc(symbols.length*16);
  symbols.forEach((s,i)=>{const o=i*16;symdata.writeUInt32LE(strOff.get(s.name)||0,o);symdata.writeUInt32LE(s.value>>>0,o+4);symdata.writeUInt32LE(s.size>>>0,o+8);symdata[o+12]=(s.bind<<4)|s.type;symdata.writeUInt16LE(s.shndx,o+14);});
  const symtab=add('.symtab',SHT_SYMTAB,0,symdata,4); secs[symtab].link=strtab;secs[symtab].info=firstGlobal;secs[symtab].entsize=16;
  const relocMeta=[];
  for(const f of FUNCS){const entries=[];for(const [off,target] of f.calls)entries.push([off,R_ARM_CALL,symIndex.get(target)]);entries.push([f.pool,R_ARM_ABS32,symIndex.get('service_zero_scalar_51')]);
    const rd=Buffer.alloc(entries.length*8); entries.forEach(([off,type,si],i)=>{rd.writeUInt32LE(off,i*8);rd.writeUInt32LE((si<<8)|type,i*8+4);});
    const ri=add(`.rel${f.section}`,SHT_REL,0,rd,4);secs[ri].link=symtab;secs[ri].info=cfg[f.name];secs[ri].entsize=8;
    entries.forEach((x,i)=>relocMeta.push({func:f.name,kind:x[1]===R_ARM_CALL?'call':'pool',entry:i,relsec:ri}));
  }
  if(opts.paddingRelocs){const rd=Buffer.alloc(opts.paddingRelocs*8);const ri=add('.rel.padding',SHT_REL,0,rd,4);secs[ri].link=symtab;secs[ri].info=foreign[0]||owner;secs[ri].entsize=8;}
  const shParts=[Buffer.from([0])];let shLen=1;for(const s of secs.slice(1)){s.nameOff=shLen;const z=Buffer.from(s.name+'\0');shParts.push(z);shLen+=z.length;}
  const shstr=add('.shstrtab',SHT_STRTAB,0,Buffer.alloc(0),1);secs[shstr].nameOff=shLen;shParts.push(Buffer.from('.shstrtab\0'));secs[shstr].data=Buffer.concat(shParts);secs[shstr].size=secs[shstr].data.length;
  let off=52;for(const s of secs.slice(1)){const a=s.align||1;off=(off+a-1)&~(a-1);s.offset=off;s.size=s.data.length;off+=s.size;}off=(off+3)&~3;const shoff=off,total=shoff+secs.length*40;
  const out=Buffer.alloc(total);out.writeUInt32BE(0x7f454c46,0);out[4]=1;out[5]=1;out[6]=1;out.writeUInt16LE(1,16);out.writeUInt16LE(ARM,18);out.writeUInt32LE(1,20);out.writeUInt32LE(shoff,32);out.writeUInt32LE(0x05000000,36);out.writeUInt16LE(52,40);out.writeUInt16LE(40,46);out.writeUInt16LE(secs.length,48);out.writeUInt16LE(shstr,50);
  for(const s of secs.slice(1))s.data.copy(out,s.offset);
  secs.forEach((s,i)=>{const o=shoff+i*40;out.writeUInt32LE(s.nameOff||0,o);out.writeUInt32LE(s.type||0,o+4);out.writeUInt32LE(s.flags||0,o+8);out.writeUInt32LE(s.offset||0,o+16);out.writeUInt32LE(s.size||0,o+20);out.writeUInt32LE(s.link||0,o+24);out.writeUInt32LE(s.info||0,o+28);out.writeUInt32LE(s.align||0,o+32);out.writeUInt32LE(s.entsize||0,o+36);s.header=o;});
  for(const m of relocMeta)m.fileOffset=secs[m.relsec].offset+m.entry*8;
  const symbolFile=(name)=>secs[symtab].offset+symIndex.get(name)*16;
  return {out,secs,cfg,mapPos,symbols,symtab,strtab,strOff,relocMeta,symbolFile,foreignCount:foreign.length};
}

function selfTest() {
  loadContract(); const dir=fs.mkdtempSync(path.join(process.env.TMPDIR||'/tmp','ipc90-'));
  let passed=0, hostile=0;
  const run=(buf,ok,label,needle='')=>{const p=path.join(dir,`${passed+hostile}-${label}.o`);fs.writeFileSync(p,buf);let err=null;try{validateElf(p);}catch(e){err=e;}
    if(ok){if(err)fail(`self-test ${label}: ${err.message}`);passed++;}else{if(!err||!err.message.includes(needle))fail(`self-test ${label} unexpectedly ${err?'failed: '+err.message:'passed'}`);hostile++;}};
  try {
    const base=buildFixture();run(base.out,true,'positive');
    const large=buildFixture({foreignCount:12001});check(large.foreignCount>12000,'large fixture construction');run(large.out,true,'foreign-12001-exec-sections');
    for(const f of FUNCS){const x=Buffer.from(base.out), sec=base.secs[base.cfg[f.name]];x[sec.offset]^=1;run(x,false,`instruction-${f.name}`,'instruction schedule');}
    for(const f of FUNCS)for(const off of f.locals){const x=Buffer.from(base.out),sec=base.secs[base.cfg[f.name]];x[sec.offset+off]^=1;run(x,false,`local-branch-${f.name}-${off}`,'instruction schedule');}
    for(const m of base.relocMeta.filter(x=>x.kind==='call')){let x=Buffer.from(base.out);x[base.secs[base.cfg[m.func]].offset+FUNCS.find(f=>f.name===m.func).calls[m.entry][0]]^=1;run(x,false,`call-field-${m.func}-${m.entry}`,'instruction schedule');
      x=Buffer.from(base.out);const wrongTarget=base.symbols.findIndex(s=>s.name==='other_literal');x.writeUInt32LE((wrongTarget<<8)|R_ARM_CALL,m.fileOffset+4);run(x,false,`call-target-${m.func}-${m.entry}`,'call relocation');}
    for(const m of base.relocMeta.filter(x=>x.kind==='pool')){const f=FUNCS.find(q=>q.name===m.func);let x=Buffer.from(base.out);x[base.secs[base.cfg[m.func]].offset+f.pool]=1;run(x,false,`pool-field-${m.func}`,'literal relocation field');
      x=Buffer.from(base.out);const otherIndex=base.symbols.findIndex(s=>s.name==='other_literal');x.writeUInt32LE((otherIndex<<8)|R_ARM_ABS32,m.fileOffset+4);run(x,false,`pool-target-${m.func}`,'literal relocation');}
    for(const f of FUNCS){let x=Buffer.from(base.out);x.writeUInt32LE(f.full+4,base.secs[base.cfg[f.name]].header+20);run(x,false,`section-size-${f.name}`,'section size');
      x=Buffer.from(base.out);x.writeUInt32LE(4,base.symbolFile(f.name)+4);run(x,false,`function-symbol-${f.name}`,'function symbol');
      x=Buffer.from(base.out);const mi=base.mapPos[`${f.name}:d`];x.writeUInt32LE(4,base.secs[base.symtab].offset+mi*16+4);run(x,false,`mapping-interior-${f.name}`,'mapping-symbol');
      x=Buffer.from(base.out);const ai=base.mapPos[`${f.name}:a`];x.writeUInt32LE(f.pool,base.secs[base.symtab].offset+ai*16+4);run(x,false,`mapping-pool-${f.name}`,'mapping-symbol');}
    let x=Buffer.from(base.out);x.writeUInt32LE(112,base.symbolFile('service_state_apply_secondary_90')+4);run(x,false,'secondary-relation','secondary entry relation');
    x=Buffer.from(base.out);const firstCall=base.relocMeta.find(m=>m.kind==='call');const ownerIndex=base.symbols.findIndex(s=>s.name==='func_001878A8');x.writeUInt32LE((ownerIndex<<8)|R_ARM_CALL,firstCall.fileOffset+4);run(x,false,'secondary-substitution','call relocation');
    x=Buffer.from(base.out);x.writeUInt16LE(0,base.symbolFile('service_state_apply_secondary_90')+14);run(x,false,'secondary-owner-collision','secondary owner globals');
    x=Buffer.from(base.out);const prim=base.symbolFile('func_0018C714');x.writeUInt32LE(2,prim+4);run(x,false,'primary-wrong-mode','wrong-mode');
    x=Buffer.from(base.out);x.writeUInt16LE(MAX_SECTIONS+1,48);run(x,false,'section-cap','section count');
    x=Buffer.from(base.out);x.writeUInt32LE(MAX_SECTION+1,base.secs[base.cfg.func_00180770].header+20);run(x,false,'section-byte-cap','16 MiB');
    const manySym=buildFixture({paddingSymbols:MAX_SYMBOLS});run(manySym.out,false,'symbol-cap','symbol cap');
    const manyRel=buildFixture({paddingRelocs:MAX_RELOCS+1});run(manyRel.out,false,'relocation-cap','relocation cap');
    x=Buffer.from(base.out);x[0]=0;run(x,false,'bad-elf-magic','not ELF32');
    x=Buffer.from(base.out);x.writeUInt32LE(base.secs[base.cfg.func_00180770].nameOff,base.secs[base.cfg.func_0018085C].header);run(x,false,'duplicate-configured-section','duplicate section');
    x=Buffer.from(base.out);x.writeUInt32LE(base.secs.find(s=>s.name==='.text.secondary-owner').nameOff,base.secs[base.cfg.func_00180770].header);run(x,false,'missing-configured-section','missing or duplicate section');
    x=Buffer.from(base.out);const ownerSec=base.secs.find(s=>s.name==='.text.secondary-owner');x.writeUInt32LE(SHT_NOBITS,ownerSec.header+4);run(x,false,'executable-nobits','executable NOBITS');
    x=Buffer.from(base.out);EXPECTED.func_00180770.copy(x,ownerSec.offset);run(x,false,'duplicated-body','duplicated selected body');
    x=Buffer.from(base.out);const other=base.symbolFile('other_literal'), fn=base.symbolFile('func_00180770');x.writeUInt32LE(x.readUInt32LE(fn),other);x[other+12]=(STB_GLOBAL<<4)|STT_FUNC;x.writeUInt16LE(base.cfg.func_00180770,other+14);run(x,false,'duplicate-global-definition','duplicate global definition');
    x=Buffer.from(base.out);x[other+12]=(STB_GLOBAL<<4);x.writeUInt16LE(base.cfg.func_00180770,other+14);run(x,false,'selected-entry-alias','entry alias');
    x=Buffer.from(base.out);x[other+12]=(STB_GLOBAL<<4)|STT_FUNC;x.writeUInt32LE(4,other+4);x.writeUInt16LE(base.cfg.func_00180770,other+14);run(x,false,'interior-function-entry','interior function entry');
    const firstPool=base.relocMeta.find(m=>m.kind==='pool');x=Buffer.from(base.out);x.writeUInt32LE((base.symbols.findIndex(s=>s.name==='service_zero_scalar_51')<<8)|R_ARM_CALL,firstPool.fileOffset+4);run(x,false,'pool-relocation-kind','literal relocation');
    x=Buffer.from(base.out);x.writeUInt32LE(4,firstPool.fileOffset);run(x,false,'pool-relocation-offset','literal relocation');
    const secondCall=base.relocMeta.find(m=>m.kind==='call');x=Buffer.from(base.out);x.writeUInt32LE((base.symbols.findIndex(s=>s.name==='service_state_apply_secondary_90')<<8)|R_ARM_ABS32,secondCall.fileOffset+4);run(x,false,'call-relocation-kind','call relocation');
    x=Buffer.from(base.out);x.writeUInt32LE(152,secondCall.fileOffset);run(x,false,'call-relocation-offset','call relocation');
    x=Buffer.from(base.out);x[other+12]=(STB_GLOBAL<<4)|STT_FUNC;x.writeUInt32LE(108,other+4);x.writeUInt16LE(base.secs.indexOf(ownerSec),other+14);run(x,false,'secondary-entry-alias','target alias');
    const huge=path.join(dir,'file-cap.o');fs.writeFileSync(huge,base.out);fs.truncateSync(huge,MAX_FILE+1);let err=null;try{validateElf(huge);}catch(e){err=e;}check(err?.message.includes('64 MiB'),'file cap self-test');hostile++;
    return {positive:passed,hostile};
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
}

function main() {
  const args=process.argv.slice(2);
  if(args.length===1&&args[0]==='--self-test'){const r=selfTest();console.log(`arm-ipc-wrappers-90 self-test: ${r.positive} positive, ${r.hostile} hostile cases passed`);return;}
  if(args.length!==1)fail('usage: validate-arm-ipc-wrappers-90.mjs <arm-relocatable.o> | --self-test');
  const r=validateElf(path.resolve(args[0]));console.log(`arm-ipc-wrappers-90: ok (${r.bodyBytes} body + ${r.adjacentBytes} adjacent bytes, ${r.slots} slots/${r.classes} class, ${r.calls} calls, ${r.localBranches} local branches, ${r.returns} returns)`);
}

try { main(); } catch(e) { console.error(`arm-ipc-wrappers-90: ${e.message}`); process.exitCode=1; }
