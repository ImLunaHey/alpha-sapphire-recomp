#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SOURCE = path.join(ROOT, 'src/main/arm_runtime_helpers_98.S');
const CONFIG = path.join(ROOT, 'config/arm-runtime-helpers-98.json');
const SPEC = path.join(ROOT, 'docs/specs/main/arm_runtime_helpers_98.md');
const LIMIT = { input: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16384, symbols: 1_000_000, relocs: 1_000_000 };
const DIGEST = {
  source: '7d457e9d5c0bbd5ac9a5a1dc13ba3c685289b2dd7e26ac85d22a5067697235de',
  config: '4ba6d995dbf831ae752998fc9c9c4229bc907cbc71037b57f9fe5b2bc876fc4d',
  spec: 'ff3b3c0f362b16048d248ad8cc5e2f4acf2d4b58797c9769853a3e1b1f83775c',
};
const EMPTY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const FUNCS = [
  ['func_001D0078', [0xe3500000, 0x15900010, 0x028f0000, 0xe12fff1e]],
  ['func_0034ACD4', [0xe5900028, 0xe5901000, 0xe5911034, 0xe12fff11]],
  ['func_0034B0B0', [0xe5900028, 0xe5902000, 0xe5922030, 0xe12fff12]],
  ['func_003A6524', [0xe5902000, 0xe592300c, 0xe3a02028, 0xe12fff13]],
  ['func_003AB314', [0xe5900010, 0xe3500000, 0x1590000c, 0xe12fff1e]],
  ['func_004C51EC', [0xe5900028, 0xe5901000, 0xe5911010, 0xe12fff11]],
  ['func_004C520C', [0xe5900028, 0xe5901000, 0xe5911014, 0xe12fff11]],
];
const INSN = [
  'func_001D0078:0:cmp:r0, #0','func_001D0078:4:ldrne:r0, [r0, #16]','func_001D0078:8:addeq:r0, pc, #0','func_001D0078:c:bx:lr',
  'func_0034ACD4:0:ldr:r0, [r0, #40]','func_0034ACD4:4:ldr:r1, [r0]','func_0034ACD4:8:ldr:r1, [r1, #52]','func_0034ACD4:c:bx:r1',
  'func_0034B0B0:0:ldr:r0, [r0, #40]','func_0034B0B0:4:ldr:r2, [r0]','func_0034B0B0:8:ldr:r2, [r2, #48]','func_0034B0B0:c:bx:r2',
  'func_003A6524:0:ldr:r2, [r0]','func_003A6524:4:ldr:r3, [r2, #12]','func_003A6524:8:mov:r2, #40','func_003A6524:c:bx:r3',
  'func_003AB314:0:ldr:r0, [r0, #16]','func_003AB314:4:cmp:r0, #0','func_003AB314:8:ldrne:r0, [r0, #12]','func_003AB314:c:bx:lr',
  'func_004C51EC:0:ldr:r0, [r0, #40]','func_004C51EC:4:ldr:r1, [r0]','func_004C51EC:8:ldr:r1, [r1, #16]','func_004C51EC:c:bx:r1',
  'func_004C520C:0:ldr:r0, [r0, #40]','func_004C520C:4:ldr:r1, [r0]','func_004C520C:8:ldr:r1, [r1, #20]','func_004C520C:c:bx:r1',
];
const EXPECT_HASH = {
  insn: 'c89563e118c0d0e51870dec97cbff2b7593405f1f372a4c58b92414e607bb7a2',
  returns: '487c135bc3dfcecd4b04fd414e1881706db7798ed0e48add60c420aca13e2515',
  indirect: '95e2b2c17a62c71250e4c7ef9c01c493c94f6df70e5f693793aac4f8cf0d9dea',
  pc: 'cc3b1e584a87e774ec02a4a0faf217e3901cef9530456b38250f4cdc73f36f4d',
};
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const fail = m => { throw new Error(m); };
const check = (v, m) => { if (!v) fail(m); };
const add = (a, b, max, what) => { check(Number.isSafeInteger(a) && Number.isSafeInteger(b) && a >= 0 && b >= 0 && a <= max - b, `${what} out of bounds`); return a + b; };

function validateInputs(source = SOURCE, config = CONFIG, spec = SPEC) {
  const sb = fs.readFileSync(source), cb = fs.readFileSync(config), db = fs.readFileSync(spec);
  check(sha(sb) === DIGEST.source, 'source digest drift');
  check(sha(cb) === DIGEST.config, 'config digest drift');
  check(sha(db) === DIGEST.spec, 'spec digest drift');
  const c = JSON.parse(cb);
  check(c.sourceSha256 === DIGEST.source && c.totalBodySize === 112 && c.totalAdjacentSize === 0, 'config totals/source digest');
  check(c.mode === 'arm' && c.functions?.length === 7, 'config mode/function count');
  check(c.instructionScheduleSha256 === EXPECT_HASH.insn && c.branchScheduleSha256 === EMPTY && c.returnScheduleSha256 === EXPECT_HASH.returns && c.indirectTransferScheduleSha256 === EXPECT_HASH.indirect && c.pcRelativeScheduleSha256 === EXPECT_HASH.pc && c.relocationScheduleSha256 === EMPTY, 'config schedule digest');
  check(c.functions.every((f, i) => f.name === FUNCS[i][0] && f.size === 16 && f.adjacentWords?.length === 0 && f.calls?.length === 0), 'config function contract');
  check(c.pcRelativeDataAccesses?.length === 1 && c.pcRelativeDataAccesses[0].ownership === 'external-unowned-payload', 'unowned payload contract');
  check(c.bodyIdentityRelations?.length === 1 && c.bodyIdentityRelations[0].function === 'func_003AB314' && c.bodyIdentityRelations[0].canonical === 'func_001233C4', 'duplicate relation contract');
  check(sha(INSN.join('\n')) === EXPECT_HASH.insn, 'internal instruction schedule');
  check(sha(['func_001D0078:c:bx:lr','func_003AB314:c:bx:lr'].join('\n')) === EXPECT_HASH.returns, 'internal return schedule');
  check(sha(['func_0034ACD4:c:bx:r1','func_0034B0B0:c:bx:r2','func_003A6524:c:bx:r3','func_004C51EC:c:bx:r1','func_004C520C:c:bx:r1'].join('\n')) === EXPECT_HASH.indirect, 'internal indirect schedule');
  check(sha('func_001D0078:8:addeq:10:runtime_inline_fallback_payload_98') === EXPECT_HASH.pc, 'internal PC-relative schedule');
}

function cstr(buf, off, what) {
  check(off >= 0 && off < buf.length, `${what} string offset`);
  const end = buf.indexOf(0, off); check(end >= 0, `${what} unterminated string`);
  return buf.toString('utf8', off, end);
}
function parseElf(buf) {
  check(buf.length <= LIMIT.input, 'input byte limit exceeded');
  check(buf.length >= 52 && buf.subarray(0,4).equals(Buffer.from([0x7f,69,76,70])), 'not ELF');
  check(buf[4] === 1 && buf[5] === 1 && buf[6] === 1, 'wrong ELF class/endianness/version');
  check(buf.readUInt16LE(16) === 1, 'ELF must be relocatable');
  check(buf.readUInt16LE(18) === 40, 'wrong machine/mode');
  check(buf.readUInt32LE(20) === 1 && buf.readUInt16LE(40) === 52 && buf.readUInt16LE(46) === 40, 'bad ELF header');
  const shoff = buf.readUInt32LE(32), shnum = buf.readUInt16LE(48), shstrndx = buf.readUInt16LE(50);
  check(shnum > 0 && shnum <= LIMIT.sections, 'section count limit exceeded');
  check(shstrndx > 0 && shstrndx < shnum, 'bad section-name table');
  check(add(shoff, shnum * 40, buf.length, 'section headers') <= buf.length, 'section headers truncated');
  const sections = [];
  for (let i=0;i<shnum;i++) { const p=shoff+i*40; sections.push({i, no:buf.readUInt32LE(p), type:buf.readUInt32LE(p+4), flags:buf.readUInt32LE(p+8), addr:buf.readUInt32LE(p+12), off:buf.readUInt32LE(p+16), size:buf.readUInt32LE(p+20), link:buf.readUInt32LE(p+24), info:buf.readUInt32LE(p+28), align:buf.readUInt32LE(p+32), entsize:buf.readUInt32LE(p+36)}); }
  const shs=sections[shstrndx]; check(shs.type===3 && add(shs.off,shs.size,buf.length,'section-name table')<=buf.length,'bad section-name table');
  const shstr=buf.subarray(shs.off,shs.off+shs.size); for(const s of sections) s.name=cstr(shstr,s.no,'section');
  let exec=0, syms=0, rels=0;
  for(const s of sections) {
    if(s.type!==8) check(add(s.off,s.size,buf.length,`section ${s.name}`)<=buf.length,`section ${s.name} truncated`);
    if(s.flags&4) { check(exec <= LIMIT.exec-s.size,'executable byte limit exceeded'); exec+=s.size; }
    if(s.type===2||s.type===11) { check(s.entsize===16 && s.size%16===0,'bad symbol table'); syms+=s.size/16; check(syms<=LIMIT.symbols,'symbol count limit exceeded'); }
    if(s.type===9||s.type===4) { const es=s.type===9?8:12; check(s.entsize===es&&s.size%es===0,'bad relocation table'); rels+=s.size/es; check(rels<=LIMIT.relocs,'relocation count limit exceeded'); }
  }
  const symbols=[];
  for(const tab of sections.filter(s=>s.type===2||s.type===11)) {
    check(tab.link<sections.length && sections[tab.link].type===3,'bad symbol string table'); const st=sections[tab.link], strings=buf.subarray(st.off,st.off+st.size);
    for(let o=0;o<tab.size;o+=16) { const p=tab.off+o, no=buf.readUInt32LE(p), x={name:cstr(strings,no,'symbol'),value:buf.readUInt32LE(p+4),size:buf.readUInt32LE(p+8),info:buf[p+12],other:buf[p+13],shndx:buf.readUInt16LE(p+14),tab,index:o/16}; symbols.push(x); }
  }
  return {buf,sections,symbols,exec,syms,rels};
}

function validateElf(buf) {
  const e=parseElf(buf), owned=new Map();
  for(const [name,words] of FUNCS) {
    const sn='.text.'+name, ss=e.sections.filter(s=>s.name===sn); check(ss.length===1,`${name}: missing/duplicate section`); const s=ss[0]; owned.set(s.i,name);
    check(s.type===1 && s.flags===6 && s.align===4 && s.size===16,`${name}: section contract`);
    const got=e.buf.subarray(s.off,s.off+16), want=Buffer.alloc(16); words.forEach((w,i)=>want.writeUInt32LE(w>>>0,i*4)); check(got.equals(want),`${name}: instruction/operand schedule mismatch`);
    const f=e.symbols.filter(x=>x.name===name); check(f.length===1,`${name}: missing/duplicate symbol`); const z=f[0];
    check(z.shndx===s.i && z.value===0 && z.size===16 && (z.info>>4)===1 && (z.info&15)===2 && (z.other&3)===0,`${name}: symbol contract`);
    const maps=e.symbols.filter(x=>x.shndx===s.i && x.name==='$a'); check(maps.length===1 && maps[0].value===0 && (maps[0].info>>4)===0,`${name}: mapping symbol contract`);
    check(!e.symbols.some(x=>x.shndx===s.i && x.name==='$d'),`${name}: data mapping forbidden`);
    check(!e.symbols.some(x=>x.shndx===s.i && x.name && x.name!==name && x.name!=='$a' && x.name!=='func_001233C4'),`${name}: foreign symbol capture/nested entry`);
  }
  for(const r of e.sections.filter(s=>s.type===9||s.type===4)) check(!owned.has(r.info),'relocation in owned section');
  check([...owned.keys()].reduce((n,i)=>n+e.sections[i].size,0)===112,'body total');
  const dupe=e.symbols.filter(x=>x.name==='func_001233C4');
  if(dupe.length) {
    check(dupe.length===1,'canonical duplicate symbol multiplicity'); const c=dupe[0], d=e.symbols.find(x=>x.name==='func_003AB314');
    check(c.shndx>0&&c.shndx<e.sections.length&&c.size===16,'canonical duplicate symbol contract');
    check(!(c.shndx===d.shndx&&c.value===d.value),'duplicate relation illegally aliased/folded');
    const s=e.sections[c.shndx]; check(add(s.off,c.value, e.buf.length,'canonical body')+16<=s.off+s.size,'canonical body span');
    check(e.buf.subarray(s.off+c.value,s.off+c.value+16).equals(e.buf.subarray(e.sections[d.shndx].off,e.sections[d.shndx].off+16)),'duplicate relation body mismatch');
  }
  return e;
}

const align=(n,a)=>(n+a-1)&~(a-1);
function strtab(names) { const chunks=[Buffer.from([0])], map=new Map(); let n=1; for(const x of names){ if(map.has(x))continue; map.set(x,n); const b=Buffer.from(x+'\0'); chunks.push(b); n+=b.length; } return {buf:Buffer.concat(chunks),map}; }
function buildElf({foreign=0, mutate, alias=false, canonical=true, extraReloc=false}={}) {
  const secs=[{name:'',type:0,flags:0,align:0,data:Buffer.alloc(0)}];
  for(const [name,words] of FUNCS){const b=Buffer.alloc(16);words.forEach((w,i)=>b.writeUInt32LE(w>>>0,i*4));secs.push({name:'.text.'+name,type:1,flags:6,align:4,data:b});}
  let canonIndex=0;
  if(canonical){canonIndex=secs.length;secs.push({name:'.text.func_001233C4.fixture',type:1,flags:6,align:4,data:Buffer.from(secs[5].data)});}
  for(let i=0;i<foreign;i++)secs.push({name:`.text.foreign_${i}`,type:1,flags:6,align:4,data:Buffer.alloc(4)});
  const symNames=['$a',...FUNCS.map(x=>x[0]),...(canonical?['func_001233C4']:[])], st=strtab(symNames); const strIndex=secs.length; secs.push({name:'.strtab',type:3,flags:0,align:1,data:st.buf});
  const syms=[Buffer.alloc(16)];
  for(let i=1;i<=7;i++){const b=Buffer.alloc(16);b.writeUInt32LE(st.map.get('$a'),0);b.writeUInt16LE(i,14);syms.push(b);}
  if(canonical){const b=Buffer.alloc(16);b.writeUInt32LE(st.map.get('$a'),0);b.writeUInt16LE(canonIndex,14);syms.push(b);}
  const firstGlobal=syms.length;
  FUNCS.forEach(([name],j)=>{const b=Buffer.alloc(16);b.writeUInt32LE(st.map.get(name),0);b.writeUInt32LE(16,8);b[12]=0x12;b.writeUInt16LE(j+1,14);syms.push(b);});
  if(canonical){const b=Buffer.alloc(16);b.writeUInt32LE(st.map.get('func_001233C4'),0);b.writeUInt32LE(16,8);b[12]=0x12;b.writeUInt16LE(alias?5:canonIndex,14);syms.push(b);}
  const symIndex=secs.length;secs.push({name:'.symtab',type:2,flags:0,align:4,entsize:16,link:strIndex,info:firstGlobal,data:Buffer.concat(syms)});
  if(extraReloc)secs.push({name:'.rel.text.func_001D0078',type:9,flags:0,align:4,entsize:8,link:symIndex,info:1,data:Buffer.alloc(8)});
  if(mutate)mutate(secs,{symIndex,strIndex,canonIndex});
  const sht=strtab([...secs.map(s=>s.name),'.shstrtab']); const shstrIndex=secs.length;secs.push({name:'.shstrtab',type:3,flags:0,align:1,data:sht.buf});
  let off=52; for(const s of secs){if(!s.data) s.data=Buffer.alloc(s.size||0);off=align(off,Math.max(1,s.align||1));s.off=off;s.size=s.data.length;off+=s.data.length;} const shoff=align(off,4), out=Buffer.alloc(shoff+secs.length*40);
  out.set([0x7f,69,76,70,1,1,1],0);out.writeUInt16LE(1,16);out.writeUInt16LE(40,18);out.writeUInt32LE(1,20);out.writeUInt32LE(shoff,32);out.writeUInt16LE(52,40);out.writeUInt16LE(40,46);out.writeUInt16LE(secs.length,48);out.writeUInt16LE(shstrIndex,50);
  secs.forEach((s,i)=>{s.data.copy(out,s.off);const p=shoff+i*40;out.writeUInt32LE(sht.map.get(s.name)||0,p);out.writeUInt32LE(s.type||0,p+4);out.writeUInt32LE(s.flags||0,p+8);out.writeUInt32LE(s.off,p+16);out.writeUInt32LE(s.size,p+20);out.writeUInt32LE(s.link||0,p+24);out.writeUInt32LE(s.info||0,p+28);out.writeUInt32LE(s.align||0,p+32);out.writeUInt32LE(s.entsize||0,p+36);}); return out;
}

function expectReject(label, fn, pattern) { try{fn();fail(`self-test accepted ${label}`);}catch(e){if(String(e.message).startsWith('self-test accepted'))throw e;check(pattern.test(String(e.message)),`self-test ${label} wrong rejection: ${e.message}`);} }
function testCaps() {
  expectReject('oversized input',()=>parseElf(Buffer.alloc(LIMIT.input+1)),/input byte limit/);
  const base=buildElf({canonical:false});
  const patchHeader=(off,val)=>{const b=Buffer.from(base);b.writeUInt16LE(val,off);return b;};
  expectReject('section cap',()=>parseElf(patchHeader(48,LIMIT.sections+1)),/section count limit/);
  const synthetic=(kind,count,entsize)=>buildElf({canonical:false,mutate:secs=>secs.push({name:'.hostile',type:kind,flags:kind===1?4:0,align:4,entsize,data:Buffer.alloc(count*entsize)})});
  expectReject('executable cap',()=>parseElf(synthetic(1,LIMIT.exec/4+1,4)),/executable byte limit/);
  expectReject('symbol cap',()=>parseElf(synthetic(2,LIMIT.symbols+1,16)),/symbol count limit/);
  expectReject('relocation cap',()=>parseElf(synthetic(9,LIMIT.relocs+1,8)),/relocation count limit/);
}
function selfTest() {
  validateInputs(); const valid=buildElf({foreign:12000}); const e=validateElf(valid); check(e.sections.filter(s=>s.flags&4).length>=12008,'foreign composite coverage');
  { const wrongMachine=Buffer.from(buildElf()); wrongMachine.writeUInt16LE(3,18); expectReject('wrong mode',()=>validateElf(wrongMachine),/wrong machine\/mode/); }
  const bad=(label,mutate,pattern)=>expectReject(label,()=>validateElf(buildElf({mutate})),pattern);
  bad('wrong condition/operand',s=>s[1].data.writeUInt32LE(0xe5900010,4),/instruction/);
  bad('wrong indirect register',s=>s[2].data.writeUInt32LE(0xe12fff12,12),/instruction/);
  bad('direct branch/call substitution',s=>s[2].data.writeUInt32LE(0xeb000000,12),/instruction/);
  bad('truncated section',s=>s[1].data=s[1].data.subarray(0,12),/section contract/);
  bad('duplicate section',s=>s.push({...s[1],data:Buffer.from(s[1].data)}),/missing\/duplicate section/);
  bad('non-executable owned section',s=>{s[1].flags=2;},/section contract/);
  bad('owned post-body data',s=>s[1].data=Buffer.concat([s[1].data,Buffer.alloc(4)]),/section contract/);
  expectReject('extra relocation',()=>validateElf(buildElf({extraReloc:true})),/relocation in owned/);
  expectReject('alias/folding',()=>validateElf(buildElf({alias:true})),/aliased\/folded/);
  bad('misplaced mapping',s=>{const t=s.find(x=>x.name==='.symtab');t.data.writeUInt32LE(4,16+4);},/mapping symbol/);
  bad('data mapping',s=>{const t=s.find(x=>x.name==='.strtab');t.data=Buffer.from(t.data.toString('binary').replace('$a\0','$d\0'),'binary');},/mapping symbol/);
  bad('foreign symbol capture',s=>{const strings=s.find(x=>x.name==='.strtab'), no=strings.data.length;strings.data=Buffer.concat([strings.data,Buffer.from('evil_capture\0')]);const z=Buffer.alloc(16);z.writeUInt32LE(no,0);z[12]=0x10;z.writeUInt16LE(1,14);const t=s.find(x=>x.name==='.symtab');t.data=Buffer.concat([t.data,z]);},/foreign symbol/);
  bad('canonical body mismatch',s=>s[s.findIndex(x=>x.name==='.text.func_001233C4.fixture')].data.writeUInt32LE(0,0),/body mismatch/);
  testCaps();
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'arm98-')); try { for(const [label,file,digest] of [['source',SOURCE,DIGEST.source],['config',CONFIG,DIGEST.config],['spec',SPEC,DIGEST.spec]]) { const p=path.join(tmp,path.basename(file)); const b=Buffer.concat([fs.readFileSync(file),Buffer.from(' ')]);fs.writeFileSync(p,b);const args={source:SOURCE,config:CONFIG,spec:SPEC};args[label]=p;expectReject(`${label} digest drift`,()=>validateInputs(args.source,args.config,args.spec),new RegExp(`${label} digest drift`)); check(sha(fs.readFileSync(file))===digest,`${label} unexpectedly changed`); } } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
  console.log(`ok: batch98 self-test (7 functions, 112 bytes, 28 instructions, 17 memory ops; ${e.sections.length} sections composite)`);
}

try {
  const args=process.argv.slice(2);
  if(args.includes('--self-test')) selfTest();
  else { validateInputs(); const files=args.filter(x=>!x.startsWith('--')); check(files.length===1,'usage: validate-arm-runtime-helpers-98.mjs --self-test | <ELF object>'); const e=validateElf(fs.readFileSync(files[0])); console.log(`ok: ${files[0]} (${e.sections.length} sections, ${e.syms} symbols, ${e.rels} relocations)`); }
} catch(e) { console.error(`error: ${e.message}`); process.exitCode=1; }
