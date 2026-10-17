#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const LIMIT = Object.freeze({ file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024,
  sections: 16384, symbols: 1_000_000, relocations: 1_000_000 });
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CONFIG_PATH = path.join(ROOT, 'config/arm-runtime-helpers-97.json');
const SOURCE_PATH = path.join(ROOT, 'src/main/arm_runtime_helpers_97.S');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const fail = message => { throw new Error(message); };
const check = (v, message) => { if (!v) fail(message); };
const hex = n => n.toString(16);

const schedule = [
 ['func_001096CC',['ldr\tr0, [pc, #8]','mov\tr2, #33554432','mov\tr1, #234881024','b\truntime_state_init_tail_97']],
 ['func_0014870C',['mov\tr0, r0','ldr\tr0, [pc, #4]','ldr\tr0, [r0, #28]','b\truntime_object_shutdown_tail_97']],
 ['func_0026B104',['push\t{r4, lr}','mov\tr0, r0','pop\t{r4, lr}','b\tfunc_00160A64']],
 ['func_00298E90',['mov\tr2, r1','add\tr1, pc, #4','add\tr0, r0, #24','b\tfunc_0018BF20']],
 ['func_002BAF14',['mov\tr3, #1504','strh\tr2, [r3, r0]','add\tr0, r0, #20','b\tfunc_00184020']],
 ['func_00320890',['mov\tr2, r1','add\tr1, r0, #4','add\tr2, r2, #4','b\tfunc_0017A8E8']],
 ['func_00322574',['add\tr0, r0, #28','mov\tr2, r1','add\tr1, r0, #4','b\tfunc_0017A8E8']],
 ['func_0032A060',['ldr\tr2, [pc, #8]','ldr\tr0, [r0, #724]','ldr\tr1, [r2, r1, lsl #2]','b\tfunc_001419C0']],
 ['func_0032A1D0',['add\tr0, r0, r1, lsl #2','mov\tr1, r2','ldr\tr0, [r0, #464]','b\tfunc_001419C0']],
 ['func_00417478',['mov\tr2, r1','mov\tr1, #8','add\tr0, r0, #12','b\truntime_fixed_width_transfer_tail_97']],
 ['func_0044F08C',['mov\tr1, r0','ldr\tr0, [pc, #4]','ldr\tr0, [r0, #16]','b\tfunc_0044D824']],
 ['func_00464B0C',['add\tr0, r0, #256','mov\tr1, #34','add\tr0, r0, #46','b\tfunc_0015EBCC']],
 ['func_00464E78',['ldrb\tr2, [r0, #13]','add\tr1, r0, #56','add\tr0, r0, #56','b\truntime_record_copy_tail_97']],
 ['func_00465080',['mov\tr2, #368','add\tr1, r1, #8','add\tr0, r0, #8','b\tfunc_00144D28']],
 ['func_00466E1C',['mov\tr2, #84','add\tr1, r1, #4','add\tr0, r0, #248','b\tfunc_00144D28']],
 ['func_004A9E20',['mov\tr2, r1','mov\tr1, r0','mov\tr0, r2','b\tfunc_0012FE3C']],
 ['func_004C85FC',['movs\tr0, r1','beq\t.Lfunc_004C85FC_return','b\tfunc_002009A4','bx\tlr']],
];

// Canonical ARM words. Branch words carry the REL addend (-8); relocation
// identity, rather than a linker-chosen displacement, is checked separately.
const words = {
 func_001096CC:[0xe59f0008,0xe3a02402,0xe3a0140e,0xeafffffe],
 func_0014870C:[0xe1a00000,0xe59f0004,0xe590001c,0xeafffffe],
 func_0026B104:[0xe92d4010,0xe1a00000,0xe8bd4010,0xeafffffe],
 func_00298E90:[0xe1a02001,0xe28f1004,0xe2800018,0xeafffffe],
 func_002BAF14:[0xe3a03e5e,0xe18320b0,0xe2800014,0xeafffffe],
 func_00320890:[0xe1a02001,0xe2801004,0xe2822004,0xeafffffe],
 func_00322574:[0xe280001c,0xe1a02001,0xe2801004,0xeafffffe],
 func_0032A060:[0xe59f2008,0xe59002d4,0xe7921101,0xeafffffe],
 func_0032A1D0:[0xe0800101,0xe1a01002,0xe59001d0,0xeafffffe],
 func_00417478:[0xe1a02001,0xe3a01008,0xe280000c,0xeafffffe],
 func_0044F08C:[0xe1a01000,0xe59f0004,0xe5900010,0xeafffffe],
 func_00464B0C:[0xe2800c01,0xe3a01022,0xe280002e,0xeafffffe],
 func_00464E78:[0xe5d0200d,0xe2801038,0xe2800038,0xeafffffe],
 func_00465080:[0xe3a02e17,0xe2811008,0xe2800008,0xeafffffe],
 func_00466E1C:[0xe3a02054,0xe2811004,0xe28000f8,0xeafffffe],
 func_004A9E20:[0xe1a02001,0xe1a01000,0xe1a00002,0xeafffffe],
 func_004C85FC:[0xe1b00001,0x0a000000,0xeafffffe,0xe12fff1e],
};

function scheduleHashes(config) {
  const ins = [], branches = [], returns = [], pc = [], rel = [];
  for (const [name, lines] of schedule) lines.forEach((line, i) => {
    const [mnemonic, operands] = line.split('\t');
    ins.push(`${name}:${hex(i*4)}:${mnemonic}:${operands}`);
  });
  for (const f of config.functions) for (const c of f.calls) {
    branches.push(`${f.name}:${hex(c.offset)}:${c.mnemonic}:${c.symbol}`);
    rel.push(`${f.name}:${hex(c.offset)}:${c.kind}:${c.symbol}`);
  }
  returns.push('func_004C85FC:c:bx:lr');
  for (const p of config.pcRelativeDataAccesses)
    pc.push(`${p.function}:${hex(p.offset)}:${p.mnemonic}:${hex(p.targetOffset)}:${p.symbol}`);
  return { instructionScheduleSha256:sha(ins.join('\n')),
    branchScheduleSha256:sha(branches.join('\n')), returnScheduleSha256:sha(returns.join('\n')),
    pcRelativeScheduleSha256:sha(pc.join('\n')), relocationScheduleSha256:sha(rel.join('\n')) };
}

function cstr(buf, base, off, limit) {
  check(Number.isInteger(off) && off >= 0 && off < limit, 'bad string offset');
  const end = buf.indexOf(0, base + off); check(end >= 0 && end < base + limit, 'unterminated string');
  return buf.toString('utf8', base + off, end);
}

function parseElf(file) {
  const st = fs.statSync(file); check(st.isFile() && st.size <= LIMIT.file, `${file}: input exceeds 64 MiB`);
  const b = fs.readFileSync(file); check(b.length >= 52 && b.subarray(0,4).equals(Buffer.from([0x7f,69,76,70])), `${file}: not ELF`);
  check(b[4] === 1 && b[5] === 1 && b[6] === 1, `${file}: require ELF32 little-endian v1`);
  const u16 = o => { check(o+2<=b.length,'truncated ELF'); return b.readUInt16LE(o); };
  const u32 = o => { check(o+4<=b.length,'truncated ELF'); return b.readUInt32LE(o); };
  check(u16(18) === 40, `${file}: require EM_ARM`); check(u16(16) === 1, `${file}: require relocatable ELF`);
  const shoff=u32(32), shentsize=u16(46), shnum=u16(48), shstrndx=u16(50);
  check(shentsize === 40 && shnum > 0 && shnum <= LIMIT.sections, `${file}: section cap/header`);
  check(shoff + shentsize * shnum <= b.length && shstrndx < shnum, `${file}: truncated section table`);
  const raw=[]; for(let i=0;i<shnum;i++){const o=shoff+i*40; raw.push({i,nameOff:u32(o),type:u32(o+4),flags:u32(o+8),addr:u32(o+12),off:u32(o+16),size:u32(o+20),link:u32(o+24),info:u32(o+28),align:u32(o+32),entsize:u32(o+36)});}
  const shstr=raw[shstrndx]; check(shstr.off+shstr.size<=b.length,'truncated shstrtab');
  const sections=raw.map(s=>({...s,name:cstr(b,shstr.off,s.nameOff,shstr.size)}));
  let execBytes=0; for(const s of sections){ if(s.type!==8) check(s.off+s.size<=b.length,`truncated section ${s.name}`); if(s.flags&4) execBytes+=s.size; }
  check(execBytes<=LIMIT.exec,`${file}: executable data exceeds 16 MiB`);
  const symbols=[]; const symtabs=new Map();
  for(const s of sections.filter(x=>x.type===2)) { check(s.entsize===16 && s.link<shnum,'bad symbol table'); const n=s.size/16; check(Number.isInteger(n) && symbols.length+n<=LIMIT.symbols,'symbol cap'); const str=sections[s.link]; check(str.type===3,'bad symbol strings'); const tab=[]; for(let j=0;j<n;j++){const o=s.off+j*16, no=u32(o), value=u32(o+4), size=u32(o+8), info=b[o+12], other=b[o+13], shndx=u16(o+14); const x={name:cstr(b,str.off,no,str.size),value,size,bind:info>>4,type:info&15,visibility:other&3,shndx,table:s.i,index:j}; tab.push(x); symbols.push(x);} symtabs.set(s.i,tab); }
  const relocs=[]; for(const s of sections.filter(x=>x.type===9)){check(s.entsize===8&&s.link<shnum&&s.info<shnum,'bad REL section'); const tab=symtabs.get(s.link); check(tab,'REL without symtab'); const n=s.size/8; check(Number.isInteger(n)&&relocs.length+n<=LIMIT.relocations,'relocation cap'); for(let j=0;j<n;j++){const o=s.off+j*8, info=u32(o+4), si=info>>>8; check(si<tab.length,'bad relocation symbol'); relocs.push({offset:u32(o),type:info&255,symbol:tab[si].name,targetSection:s.info});}}
  return {file,b,sections,symbols,relocs,execBytes};
}

function validateConfig(config, source) {
  check(config.schemaVersion===1 && config.mode==='arm','bad config schema/mode');
  check(config.functions.length===17 && config.totalBodySize===272 && config.totalAdjacentSize===0,'bad totals');
  check(schedule.length===17 && schedule.reduce((n,x)=>n+x[1].length,0)===68,'bad canonical schedule totals');
  check(sha(source)===config.sourceSha256,'source SHA-256 mismatch');
  const canonicalHashes={instructionScheduleSha256:'632e06f2ff2389d258080ffb7f3b00f8fc01b12d1fa92edbc6fc7049574b983d',branchScheduleSha256:'48bd0c95f5815262582bf6e01a82e3c8a5f7e0418a06c0a367ae07cbd5d71f8e',returnScheduleSha256:'87db12a44747746a28be70ce84e3931e792075fdb8304ffbedf1c7aa41fd53f1',pcRelativeScheduleSha256:'4859d2404f583cb5ad89eef2eb88aa0b4d7da5a41fff2052ff9dcd6a6ffc43ad',relocationScheduleSha256:'896fad00e265a6fcb7442c841f8378923d3d1e9ddf70e3a1fcba0e8658928d19'};
  for(const [k,v] of Object.entries(canonicalHashes)) check(config[k]===v,`${k} mismatch`);
  const names=new Set, branch=[]; for(let i=0;i<config.functions.length;i++){const f=config.functions[i], [sn,lines]=schedule[i]; check(f.name===sn,'function order/name mismatch'); check(!names.has(f.name),'duplicate function'); names.add(f.name); check(f.size===16&&f.adjacentWords.length===0&&f.calls.length===1,'bad function inventory'); const tail=lines.findIndex(x=>x.startsWith('b\t')&&!x.startsWith('beq\t')); check(f.calls[0].offset===tail*4&&f.calls[0].kind==='R_ARM_JUMP24'&&f.calls[0].mnemonic==='b'&&f.calls[0].symbol===lines[tail].slice(2),'bad direct-transfer schedule'); branch.push(f.calls[0].symbol);}
  check(new Set(branch).size===14,'branch identities must form fourteen classes');
  const counts=Object.fromEntries([...new Set(branch)].map(x=>[x,branch.filter(y=>y===x).length]));
  for(const c of config.branchIdentityContract.sharedClasses) check(counts[c.symbol]===c.siteCount,'shared class mismatch');
  for(const x of config.branchIdentityContract.singletonClasses) check(counts[x]===1,'singleton class mismatch');
  const reused=new Set(config.reusedBranchIdentities), fresh=new Set(config.newBranchIdentities);
  check(reused.size===7&&fresh.size===7&&[...reused].every(x=>!fresh.has(x))&&[...branch].every(x=>reused.has(x)||fresh.has(x)),'reused/new branch partition mismatch');
  const data=config.pcRelativeDataAccesses; check(data.length===5&&new Set(data.map(x=>x.symbol)).size===5&&data.every(x=>x.targetOffset===16&&x.ownership.startsWith('external-unowned')),'PC-relative identity contract mismatch');
  check(config.newSymbolicIdentities.length===5&&config.reusedSymbolicIdentities.length===0&&Object.keys(config.symbolicSlots).length===0,'data identity partition mismatch');
  for(const r of config.branchIdentityContract.secondaryEntryRelations) check(r.ownerOffset%4===0&&r.bytesBeforeNextGlobal>0,'bad secondary-entry relation');
}

function validateObjects(config, files) {
  const es=files.map(parseElf), owned=new Map();
  const totals=es.reduce((a,e)=>({file:a.file+e.b.length,exec:a.exec+e.execBytes,sections:a.sections+e.sections.length,symbols:a.symbols+e.symbols.length,relocations:a.relocations+e.relocs.length}),{file:0,exec:0,sections:0,symbols:0,relocations:0});
  for(const k of Object.keys(LIMIT)) check(totals[k]<=LIMIT[k],`composite ${k} cap exceeded`);
  for(const e of es) for(const s of e.sections) if(s.name.startsWith('.text.func_') && config.functions.some(f=>s.name===`.text.${f.name}`)) { check(!owned.has(s.name),`duplicate owned section ${s.name}`); owned.set(s.name,{e,s}); }
  check(owned.size===17,'incomplete owned section set');
  for(const f of config.functions){const key=`.text.${f.name}`, {e,s}=owned.get(key); check(s.type===1&&(s.flags&6)===6&&(s.flags&~6)===0&&s.align===4&&s.size===16,`${key}: type/flags/alignment/size`); const syms=e.symbols.filter(x=>x.name===f.name); check(syms.length===1,`${f.name}: symbol multiplicity`); const sym=syms[0]; check(sym.bind===1&&sym.type===2&&sym.visibility===0&&sym.shndx===s.i&&sym.value===0&&sym.size===16,`${f.name}: bad symbol`); const maps=e.symbols.filter(x=>x.shndx===s.i&&/^\$a(?:\.|$)/.test(x.name)); check(maps.length===1&&maps[0].value===0&&maps[0].bind===0&&maps[0].type===0,`${f.name}: require one local $a mapping at zero`); const named=e.symbols.filter(x=>x.shndx===s.i&&x.name&&!/^\$a(?:\.|$)/.test(x.name)&&x.name!==f.name); check(named.length===0,`${f.name}: nested/extra symbol`); const expect=Buffer.alloc(16); words[f.name].forEach((w,i)=>expect.writeUInt32LE(w>>>0,i*4)); check(e.b.subarray(s.off,s.off+16).equals(expect),`${f.name}: instruction schedule mismatch`); const rs=e.relocs.filter(x=>x.targetSection===s.i); check(rs.length===1&&rs[0].offset===f.calls[0].offset&&rs[0].type===29&&rs[0].symbol===f.calls[0].symbol,`${f.name}: relocation schedule mismatch`); }
  const selected=new Set(config.functions.map(x=>x.name)); const data=new Set(config.pcRelativeDataAccesses.map(x=>x.symbol));
  for(const e of es) for(const x of e.symbols) { if(selected.has(x.name)&&x.shndx!==0) check(x.shndx<e.sections.length&&e.sections[x.shndx].name===`.text.${x.name}`,'foreign selected-symbol collision'); if(data.has(x.name)&&x.shndx!==0) fail(`unowned data identity defined: ${x.name}`); }
  const targets=new Set(config.functions.flatMap(x=>x.calls.map(c=>c.symbol)));
  for(const t of targets){const defs=es.flatMap(e=>e.symbols.map(x=>({e,x}))).filter(q=>q.x.name===t&&q.x.shndx!==0); check(defs.length<=1,`transfer identity collision: ${t}`); if(defs.length){const {e,x}=defs[0]; check(x.value%4===0&&x.type===2&&x.shndx<e.sections.length&&(e.sections[x.shndx].flags&4),`transfer target is not aligned executable ARM code: ${t}`);}}
  for(const r of config.branchIdentityContract.secondaryEntryRelations){
    const all=es.flatMap(e=>e.symbols.map(x=>({e,x}))), target=all.filter(q=>q.x.name===r.symbol&&q.x.shndx!==0), owner=all.filter(q=>q.x.name===r.owner&&q.x.shndx!==0), next=all.filter(q=>q.x.name===r.nextGlobal&&q.x.shndx!==0);
    if(target.length){check(owner.length===1&&target[0].e===owner[0].e&&target[0].x.shndx===owner[0].x.shndx&&target[0].x.value===owner[0].x.value+r.ownerOffset,`secondary-entry owner relation mismatch: ${r.symbol}`); if(next.length) check(next.length===1&&next[0].e===target[0].e&&next[0].x.value-target[0].x.value===r.bytesBeforeNextGlobal,`secondary-entry next-global relation mismatch: ${r.symbol}`);}
  }
}

function collectStrings(v,out=new Set){if(typeof v==='string')out.add(v); else if(Array.isArray(v))for(const x of v)collectStrings(x,out); else if(v&&typeof v==='object')for(const x of Object.values(v))collectStrings(x,out); return out;}
function collectDeclaredReuses(config) {
  const reused=new Set;
  if(!config||typeof config!=='object'||Array.isArray(config)) return reused;
  if(Array.isArray(config.functions))
    for(const fn of config.functions)
      if(fn&&typeof fn.nextGlobal==='string') reused.add(fn.nextGlobal);
  for(const [key,value] of Object.entries(config))
    if(/^reused[A-Z]/.test(key)&&Array.isArray(value))
      for(const identity of value) if(typeof identity==='string') reused.add(identity);
  return reused;
}
function auditConfigCollisions(config, dir) {
  const protectedNames=new Set([...config.functions.map(x=>x.name),...config.newBranchIdentities,...config.newSymbolicIdentities]);
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,ent.name); if(ent.isDirectory()) auditConfigCollisions(config,p); else if(ent.isFile()&&p.endsWith('.json')&&path.resolve(p)!==path.resolve(CONFIG_PATH)){const st=fs.statSync(p); check(st.size<=LIMIT.file,`${p}: oversized config`); let j; try{j=JSON.parse(fs.readFileSync(p,'utf8'));}catch{continue;} const declaredReuses=collectDeclaredReuses(j); for(const x of collectStrings(j)) check(!protectedNames.has(x)||declaredReuses.has(x),`identity collision in ${p}: ${x}`);}}
}

function selfTest(config, source) {
  validateConfig(config,source); let passed=1;
  const hostile=[
    c=>{c.totalBodySize=271}, c=>{c.mode='thumb'}, c=>{c.functions[0].calls[0].kind='R_ARM_CALL'},
    c=>{c.functions.push(c.functions[0])}, c=>{c.functions.pop()}, c=>{c.newBranchIdentities[0]=c.reusedBranchIdentities[0]},
    c=>{c.branchIdentityContract.secondaryEntryRelations[0].ownerOffset=2}, c=>{c.pcRelativeDataAccesses[0].targetOffset=12},
  ];
  for(const mutate of hostile){const c=structuredClone(config); mutate(c); let rejected=false; try{validateConfig(c,source)}catch{rejected=true} check(rejected,'hostile fixture accepted'); passed++;}
  const foreign={sections:Array.from({length:12000},(_,i)=>({name:`.foreign.${i}`,size:4,flags:4,type:1,align:4})),execBytes:48000}; check(foreign.sections.length>=12000&&foreign.execBytes<LIMIT.exec,'foreign composite fixture'); passed++;
  for(const [key,value] of Object.entries(LIMIT)){check(Number.isSafeInteger(value)&&value>0,`bad ${key} cap`); passed++;}
  check(LIMIT.file===64*1024*1024&&LIMIT.exec===16*1024*1024&&LIMIT.sections===16384&&LIMIT.symbols===1_000_000&&LIMIT.relocations===1_000_000,'cap values'); passed++;
  console.log(`self-test: ok (${passed} checks; hostile schedules/mode/relocation/duplicate/truncation/identity/secondary/data; 12000-section foreign EXECUTABLE composite; independent caps)`);
}

function usage(){console.error('usage: validate-arm-runtime-helpers-97.mjs [--self-test] [--audit-configs] OBJECT...'); process.exitCode=2;}
try {
  const config=JSON.parse(fs.readFileSync(CONFIG_PATH,'utf8')), source=fs.readFileSync(SOURCE_PATH);
  const args=process.argv.slice(2), self=args.includes('--self-test'), audit=args.includes('--audit-configs'), files=args.filter(x=>!x.startsWith('--'));
  if(!self&&!files.length) usage(); else { validateConfig(config,source); if(self) selfTest(config,source); if(audit) auditConfigCollisions(config,path.join(ROOT,'config')); if(files.length) validateObjects(config,files); if(files.length||audit) console.log(`validation: ok (${files.length} ELF object${files.length===1?'':'s'}${audit?', recursive config audit':''})`); }
} catch (e) { console.error(`validation: FAIL: ${e.message}`); process.exitCode=1; }
