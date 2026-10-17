#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/thumb-leaf-helpers-25.json");
const specPath = join(root, "docs/specs/main/thumb_leaf_helpers_25.md");
const sourcePath = join(root, "src/main/thumb_leaf_helpers_25.S");
const LIMITS = { file: 64 * 1024 * 1024, exec: 16 * 1024 * 1024, sections: 16_384, symbols: 1_000_000, relocs: 1_000_000 };
const expectedRawConfigHash = "a9dcc95b25832ef5ef4dca3b775d5c209013cb81dda0fa754176453924f9d706";
const expectedConfigHash = "e9de1c714da1b203bb85e23beebc8d4a782d40b34f4e1c407bd47893e959ad90";
const expectedSourceHash = "dbaa98e715ca155ea8e0481e3149df1b59f35a3fd51467e1c185836ca8e48892";
const expectedSpecHash = "5e272227bd16f169f3feffcf032c5d6310c6510e155e4d6fd25d9e5f11ec62c3";
const expectedBodyHash = "5ebc2c26c5e23cb14a1c8aab6f06efc5d152a99dac3c8da808fd38f22f67ba9d";
const expectedLinkedHash = "54847505fdf787c18429817b7d969e7c30a6854bd8dee943b9ea9c156ba6127b";
const expectedAttributes = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");
const expectedText = Buffer.from(
  "feb504000121c0688905764b0843e060010310d599108843e060810606d4e26a61688a4200d80a00511a21601843e06020346079febd9843e060800602d52000" +
  "fff7feff6949e0680140012903d02000fff7feffbfe02168002600290bdac94321600121a66009030843e0606068411c61600078febd5d4908420dd005212660" +
  "0903884340210843e06021696068401ae169401aa0609ee02169002915d1c00313d4e069fff7feef0028206118d0e0680121c9020843e0608105890f03d1ff21" +
  "01310843e0602069606060690090e068c1061bd5c0030fd52000fff7feff15e02000243020610120e061e06803210902884301218902e4e721696068401aa169" +
  "41180098fff7feef0028a0dbe068c0032ad56168e06a884200d808002169451ae069471b1bd0a06901902000fff7feff01984119a0610098fff7feef002886db" +
  "e068012149040843e060000202d5a0694019a061e1692069c91b45180de02000fff7feffe769f5e725696168a069e769491be56240186560a061e06810218843" +
  "e0604005800f02d02000fff7feffe0680121a66009030843e060000205d52069e06260600120c043febd220039002800fff7feff411c0ed029180028e1620dd0" +
  "401e2060681c6060e068012149040843e0602878febd0020c043febd20006560fff7fefff7e7",
  "hex",
);
const calls = [
  [64, "func_00301DC8", -1674, "thumb"], [80, "func_00301D1C", -1846, "thumb"],
  [164, "func_002FECF8", -14170, "arm"], [218, "func_00301D7C", -1750, "thumb"],
  [260, "func_003022C8", -394, "arm"], [300, "func_00301D7C", -1750, "thumb"],
  [312, "func_003022C8", -394, "arm"], [352, "func_00301D7C", -1750, "thumb"],
  [394, "func_00103568", -2092778, "thumb"], [432, "func_003023F0", -98, "thumb"],
  [480, "func_0030242A", -40, "thumb"],
];
const externalNames = [...new Set(calls.map((row) => row[1]))].sort();

const sha256 = (data) => createHash("sha256").update(data).digest("hex");
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function limits({ file = 0, exec = 0, sections = 0, symbols = 0, relocs = 0 }) {
  assert.ok(file <= LIMITS.file, "complete input exceeds 64 MiB");
  assert.ok(exec <= LIMITS.exec, "aggregate executable data exceeds 16 MiB");
  assert.ok(sections <= LIMITS.sections, "section count exceeds 16,384");
  assert.ok(symbols <= LIMITS.symbols, "aggregate symbol count exceeds 1,000,000");
  assert.ok(relocs <= LIMITS.relocs, "aggregate relocation count exceeds 1,000,000");
}
function applyCall(text, place, target, state) {
  const base = state === "arm" ? (((2 + place + 4) & ~3) - 2) : place + 4;
  const displacement = target - base;
  assert.equal(displacement & 1, 0); if (state === "arm") assert.equal(displacement & 3, 0);
  assert.ok(displacement >= -0x400000 && displacement < 0x400000);
  const out = Buffer.from(text);
  out.writeUInt16LE(0xf000 | ((displacement >> 12) & 0x7ff), place);
  out.writeUInt16LE((state === "arm" ? 0xe800 : 0xf800) | ((displacement >> 1) & 0x7ff), place + 2);
  return out;
}
function linkedText() { let out = Buffer.from(expectedText); for (const [p, , t, s] of calls) out = applyCall(out, p, t, s); return out; }

function validateInputs(config, source, configBytes, spec) {
  assert.equal(sha256(configBytes), expectedRawConfigHash, "raw configuration contract changed");
  const normalized = structuredClone(config); normalized.sourceHash = null;
  assert.equal(sha256(stable(normalized)), expectedConfigHash, "normalized configuration contract changed");
  assert.equal(config.sourceHash, expectedSourceHash); assert.equal(sha256(source), expectedSourceHash); assert.equal(sha256(spec), expectedSpecHash);
  assert.deepEqual({ source: config.source, arch: config.architecture, mode: config.mode, align: config.minimumAlignment,
    modulo: config.requiredEntryModulo4, body: config.totalBodySize, adjacent: config.totalAdjacentSize,
    instructions: config.expectedInstructionCount, wide: config.wideInstructionCount, branches: config.localBranchCount,
    memory: config.memoryOperationCount, returns: config.returnCount, direct: config.directCallCount, indirect: config.indirectCallCount },
  { source: "src/main/thumb_leaf_helpers_25.S", arch: "ARMv6K", mode: "thumb", align: 2, modulo: 2,
    body: 486, adjacent: 0, instructions: 232, wide: 11, branches: 30, memory: 83, returns: 5, direct: 11, indirect: 0 });
  assert.equal(config.functions.length, 1); assert.equal(config.functions[0].name, "func_00302452");
  assert.deepEqual(config.pcRelativeDataAccesses.map((x) => [x.offset, x.targetOffset, x.requiredEntryModulo4]), [[10,486,2],[68,490,2],[118,494,2]]);
  assert.deepEqual(config.directCalls.map((x) => [x.offset,x.destinationSymbol,x.targetOffset,x.destinationState]), calls);
  assert.equal(expectedText.length, 486); assert.equal(sha256(expectedText), expectedBodyHash); assert.equal(sha256(linkedText()), expectedLinkedHash);
  assert.doesNotMatch(source, /^\s*\.(?:byte|hword|short|word|long|quad|incbin|space|skip|fill|ltorg)\b/m, "data or padding emission forbidden");
}

function parseElf(bytes) {
  limits({ file: bytes.length }); assert.ok(bytes.length >= 52, "truncated ELF header");
  assert.equal(bytes.subarray(0,4).toString("hex"), "7f454c46"); assert.deepEqual([...bytes.subarray(4,9)], [1,1,1,0,0]);
  assert.ok(bytes.subarray(9,16).every((x) => x === 0)); assert.equal(bytes.readUInt16LE(16),1); assert.equal(bytes.readUInt16LE(18),40);
  assert.equal(bytes.readUInt32LE(20),1); assert.equal(bytes.readUInt32LE(24),0); assert.equal(bytes.readUInt32LE(28),0); assert.equal(bytes.readUInt32LE(36),0x05000000);
  assert.equal(bytes.readUInt16LE(40),52); assert.equal(bytes.readUInt16LE(42),0); assert.equal(bytes.readUInt16LE(44),0);
  const shoff=bytes.readUInt32LE(32), entsize=bytes.readUInt16LE(46), count=bytes.readUInt16LE(48), shstrndx=bytes.readUInt16LE(50);
  assert.equal(entsize,40); assert.ok(count>0,"extended section numbering forbidden"); limits({file:bytes.length,sections:count});
  assert.ok(shstrndx<count); assert.ok(shoff<=bytes.length && count*entsize<=bytes.length-shoff,"truncated section header table");
  const raw=Array.from({length:count},(_,index)=>{const h=shoff+index*entsize;return {index,headerOffset:h,nameOffset:bytes.readUInt32LE(h),type:bytes.readUInt32LE(h+4),flags:bytes.readUInt32LE(h+8),addr:bytes.readUInt32LE(h+12),offset:bytes.readUInt32LE(h+16),size:bytes.readUInt32LE(h+20),link:bytes.readUInt32LE(h+24),info:bytes.readUInt32LE(h+28),align:bytes.readUInt32LE(h+32),entsize:bytes.readUInt32LE(h+36)}});
  assert.ok(Object.entries(raw[0]).filter(([k])=>!["index","headerOffset"].includes(k)).every(([,v])=>v===0));
  const shstr=raw[shstrndx]; assert.equal(shstr.type,3);
  for(const s of raw) if(s.type!==8) assert.ok(s.offset<=bytes.length && s.size<=bytes.length-s.offset,"section data out of range");
  const cstring=(s,o)=>{assert.ok(o<s.size,"string offset out of range");const start=s.offset+o,end=bytes.indexOf(0,start);assert.ok(end>=start&&end<s.offset+s.size,"unterminated string");return bytes.toString("utf8",start,end)};
  const sections=raw.map((s)=>({...s,name:cstring(shstr,s.nameOffset)})); let exec=0,symbols=0,relocs=0;
  for(const s of sections){if(s.flags&4)exec+=s.size;if(s.type===2||s.type===11){assert.equal(s.entsize,16);assert.equal(s.size%16,0);symbols+=s.size/16}if(s.type===9||s.type===4){const w=s.type===9?8:12;assert.equal(s.entsize,w);assert.equal(s.size%w,0);relocs+=s.size/w}}
  limits({file:bytes.length,exec,sections:count,symbols,relocs}); return {bytes,sections,shoff,shentsize:entsize,shstr,cstring};
}
function symbolsOf(elf,table){assert.ok(table.link<elf.sections.length);const strings=elf.sections[table.link];assert.equal(strings.type,3);const out=[];for(let o=0;o<table.size;o+=16){const at=table.offset+o;out.push({index:out.length,entryOffset:at,name:elf.cstring(strings,elf.bytes.readUInt32LE(at)),value:elf.bytes.readUInt32LE(at+4),size:elf.bytes.readUInt32LE(at+8),bind:elf.bytes[at+12]>>>4,type:elf.bytes[at+12]&15,other:elf.bytes[at+13],shndx:elf.bytes.readUInt16LE(at+14)})}return out}

function validateObject(bytes) {
  const elf=parseElf(bytes), matches=elf.sections.filter((s)=>s.name===".text.func_00302452"); assert.equal(matches.length,1); const text=matches[0];
  assert.deepEqual(elf.sections.filter((s)=>(s.flags&4)&&s.size).map((s)=>s.name),[text.name]);
  assert.deepEqual({type:text.type,flags:text.flags,size:text.size,align:text.align,addr:text.addr},{type:1,flags:6,size:486,align:2,addr:0});
  assert.deepEqual(bytes.subarray(text.offset,text.offset+text.size),expectedText);
  const tabs=elf.sections.filter((s)=>s.type===2);assert.equal(tabs.length,1);assert.equal(elf.sections.filter((s)=>s.type===11).length,0);const symtab=tabs[0],symbols=symbolsOf(elf,symtab);
  assert.ok(symtab.info<=symbols.length&&symbols.every((s,i)=>i<symtab.info?s.bind===0:s.bind!==0));const named=(n)=>symbols.filter((s)=>s.name===n);
  const primary=named("func_00302452");assert.equal(primary.length,1);assert.deepEqual({value:primary[0].value,size:primary[0].size,bind:primary[0].bind,type:primary[0].type,other:primary[0].other,shndx:primary[0].shndx},{value:1,size:486,bind:1,type:2,other:0,shndx:text.index});
  const mapping=named("$t");assert.equal(mapping.length,1);assert.deepEqual({value:mapping[0].value,size:mapping[0].size,bind:mapping[0].bind,type:mapping[0].type,other:mapping[0].other,shndx:mapping[0].shndx},{value:0,size:0,bind:0,type:0,other:0,shndx:text.index});
  assert.deepEqual(symbols.filter((s)=>s.name&&s.shndx===0&&s.type===2).map((s)=>s.name).sort(),externalNames);
  for(const n of externalNames){const s=named(n);assert.equal(s.length,1);assert.deepEqual({value:s[0].value,size:s[0].size,bind:s[0].bind,type:s[0].type,other:s[0].other,shndx:s[0].shndx},{value:0,size:0,bind:1,type:2,other:0,shndx:0})}
  assert.equal(elf.sections.filter((s)=>s.type===4).length,0);const rels=elf.sections.filter((s)=>s.type===9);assert.equal(rels.length,1);const rel=rels[0];assert.deepEqual({info:rel.info,link:rel.link,entsize:rel.entsize,size:rel.size},{info:text.index,link:symtab.index,entsize:8,size:88});
  const actual=[];for(let o=0;o<rel.size;o+=8){const at=rel.offset+o,place=bytes.readUInt32LE(at),info=bytes.readUInt32LE(at+4),symbol=symbols[info>>>8],row=calls.find((x)=>x[0]===place);assert.ok(symbol,"invalid relocation symbol");assert.equal(info&255,10);assert.ok(row);assert.equal(bytes.readUInt16LE(text.offset+place),0xf7ff);assert.equal(bytes.readUInt16LE(text.offset+place+2),row[3]==="arm"?0xeffe:0xfffe);actual.push([place,symbol.name])}
  assert.deepEqual(actual,calls.map(([p,n])=>[p,n]));const attrs=elf.sections.filter((s)=>s.name===".ARM.attributes");assert.equal(attrs.length,1);assert.equal(attrs[0].type,0x70000003);assert.deepEqual(bytes.subarray(attrs[0].offset,attrs[0].offset+attrs[0].size),expectedAttributes);
  return {elf,text,symtab,symbols,rel};
}
function validateTarget(bytes){const elf=parseElf(bytes),m=elf.sections.filter((s)=>s.name===".text.func_00302452");assert.equal(m.length,1);const text=m[0];assert.deepEqual({type:text.type,flags:text.flags,size:text.size,align:text.align},{type:1,flags:6,size:486,align:2});assert.deepEqual(bytes.subarray(text.offset,text.offset+text.size),linkedText())}
function ownershipAudit(){for(const f of readdirSync(join(root,"config")).filter((n)=>/^thumb-leaf-helpers-\d+\.json$/.test(n)&&n!=="thumb-leaf-helpers-25.json")){const x=JSON.parse(readFileSync(join(root,"config",f)));assert.ok(!(x.functions??[]).some((fn)=>fn.name==="func_00302452"),`duplicate owner in ${f}`)}for(const f of readdirSync(join(root,"src/main")).filter((n)=>/\.S$/.test(n)&&n!=="thumb_leaf_helpers_25.S")){const s=readFileSync(join(root,"src/main",f),"utf8");assert.doesNotMatch(s,/^func_00302452:\s*$/m,`duplicate definition in ${f}`)}}
function findAssembler(){const xs=process.env.ARM_AS?[process.env.ARM_AS]:["arm-none-eabi-as","arm-linux-gnueabi-as","arm-linux-gnueabihf-as"];try{for(const e of readdirSync("/nix/store").sort()){const x=join("/nix/store",e,"bin/arm-none-eabi-as");if(existsSync(x))xs.push(x)}}catch{}for(const x of xs){const r=spawnSync(x,["--version"]);if(!r.error&&r.status===0)return x}return null}
function assembleAndTest(){const assembler=findAssembler();assert.ok(assembler,"no ARM GNU assembler found");const scratch=mkdtempSync(join(tmpdir(),"thumb25-"));try{const output=join(scratch,"thumb25.o"),r=spawnSync(assembler,["-march=armv6k","-mthumb","-o",output,sourcePath],{encoding:"utf8"});assert.equal(r.status,0,r.stderr||r.stdout);const valid=readFileSync(output),base=validateObject(valid);const reject=(label,mutation,parser=validateObject)=>{const copy=Buffer.from(valid);mutation(copy,base);assert.throws(()=>parser(copy),undefined,`${label} accepted`)};reject("instruction mutation",(c,s)=>{c[s.text.offset]^=1});reject("relocation mutation",(c,s)=>{c[s.rel.offset+4]^=1});reject("invalid relocation symbol",(c,s)=>{c.writeUInt32LE(0xffffff0a,s.rel.offset+4)});reject("attribute mutation",(c,s)=>{c[s.elf.sections.find((x)=>x.name===".ARM.attributes").offset+1]^=1});reject("adjacent executable byte",(c,s)=>{c.writeUInt32LE(487,s.text.headerOffset+20)});reject("mapping mutation",(c,s)=>{const x=s.symbols.find((z)=>z.name==="$t");c.writeUInt32LE(2,x.entryOffset+4)});reject("primary mutation",(c,s)=>{const x=s.symbols.find((z)=>z.name==="func_00302452");c.writeUInt32LE(3,x.entryOffset+4)});reject("RELA substitution",(c,s)=>{c.writeUInt32LE(4,s.rel.headerOffset+4)});reject("out-of-range section",(c,s)=>{c.writeUInt32LE(c.length,s.text.headerOffset+16)},parseElf);reject("unterminated section string",(c,s)=>{c[s.elf.shstr.offset+s.elf.shstr.size-1]=88},parseElf);const truncated=valid.subarray(0,base.elf.shoff+base.elf.shentsize*base.elf.sections.length-1);assert.throws(()=>parseElf(truncated),/truncated section header table/)}finally{rmSync(scratch,{recursive:true,force:true})}}

const configBytes=readFileSync(configPath),config=JSON.parse(configBytes),source=readFileSync(sourcePath,"utf8"),spec=readFileSync(specPath);validateInputs(config,source,configBytes,spec);ownershipAudit();const reversed=Object.fromEntries(Object.entries(config).reverse()),normalized=structuredClone(reversed);normalized.sourceHash=null;assert.equal(sha256(stable(normalized)),expectedConfigHash);
assert.throws(()=>limits({file:LIMITS.file+1}));assert.throws(()=>limits({exec:LIMITS.exec+1}));assert.throws(()=>limits({sections:LIMITS.sections+1}));assert.throws(()=>limits({symbols:LIMITS.symbols+1}));assert.throws(()=>limits({relocs:LIMITS.relocs+1}));assert.throws(()=>parseElf(Buffer.alloc(51)));
const args=process.argv.slice(2);if(args.length===0||(args.length===1&&args[0]==="--self-test"))validateInputs(config,source,configBytes,spec);else if(args.length===1&&args[0]==="--assemble")assembleAndTest();else if(args.length===2&&args[0]==="--object")validateObject(readFileSync(args[1]));else if(args.length===2&&args[0]==="--target")validateTarget(readFileSync(args[1]));else throw new Error("usage: validate-thumb-leaf-helpers-25.mjs [--self-test | --assemble | --object PATH | --target PATH]");
console.log("thumb-leaf-helpers-25: validation passed");
