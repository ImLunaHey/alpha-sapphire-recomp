#!/usr/bin/env node

import assert from "node:assert/strict";

import { convertCroToElf } from "./generate-cro-target-object.mjs";
import { makeCro } from "./validate-cro-target-object.mjs";
import { validateCroFunctionSemantics } from "./validate-cro-function-semantics.mjs";

function cstring(buffer, offset) { const end = buffer.indexOf(0, offset); return buffer.toString("utf8", offset, end); }
function elfLayout(buffer) {
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50), sections=[];
  for (let i=0;i<count;i++) { const at=shoff+i*40; sections.push({index:i,nameOffset:buffer.readUInt32LE(at),type:buffer.readUInt32LE(at+4),offset:buffer.readUInt32LE(at+16),size:buffer.readUInt32LE(at+20),link:buffer.readUInt32LE(at+24),info:buffer.readUInt32LE(at+28)}); }
  const ns=sections[shstrndx], names=buffer.subarray(ns.offset,ns.offset+ns.size);
  for(const s of sections) s.name=s.index?cstring(names,s.nameOffset):"";
  const byName=new Map(sections.map(s=>[s.name,s])), symtab=byName.get(".symtab"), stringsSection=sections[symtab.link];
  const strings=buffer.subarray(stringsSection.offset,stringsSection.offset+stringsSection.size), symbols=[];
  for(let i=0;i<symtab.size/16;i++){const at=symtab.offset+i*16;symbols.push({index:i,name:cstring(strings,buffer.readUInt32LE(at)),info:buffer[at+12],shndx:buffer.readUInt16LE(at+14)});}
  return {byName,symbols};
}

function fixture() {
  const target=Buffer.from(convertCroToElf(makeCro().cro).elf), elf=elfLayout(target);
  const text=elf.byName.get(".text"), rel=elf.byName.get(".rel.text");
  for(const [offset,word] of [[0,0xe51ff004],[4,0],[8,0xe12fff1e],[12,0xe1a0f00e],[16,0xeafffffc],[20,0],
    [24,0xeafffffb],[28,0xeafffffb]]) target.writeUInt32LE(word,text.offset+offset);
  target.writeUInt32LE(4,rel.offset);
  target.writeUInt32LE(20,rel.offset+8);
  const csv=["# Format,CRO_FUNCTIONS_V1","# Module,cro/DllTitle","# TextSize,00000040","Location,Name,Namespace,Mode,Size,Segment",
    '00000000,"func_00000000","Global",$a,00000004,".text"',
    '00000008,"func_00000008","Global",$a,00000004,".text"',
    '0000000C,"func_0000000C","Global",$a,00000004,".text"',
    '00000010,"func_00000010","Global",$a,00000004,".text"',""].join("\n");
  const partition={format:1,module:"TestCro",textSize:0x40,functions:[
    {name:"func_00000000",address:0,size:4,mode:"arm"},{name:"func_00000008",address:8,size:4,mode:"arm"},
    {name:"func_0000000C",address:12,size:4,mode:"arm"},{name:"func_00000010",address:16,size:4,mode:"arm"}],
  pools:[{address:4,size:4},{address:20,size:4}],gaps:[{address:24,size:40,mode:"arm"}]};
  return {target,csv,partition,elf};
}

function rejects(label, mutate, pattern) {
  const f=fixture(); mutate(f);
  assert.throws(()=>validateCroFunctionSemantics(f.csv,f.target,JSON.stringify(f.partition),
    {inventoryOptions:{expectedUnit:"cro/DllTitle",expectedTextSize:0x40}}),pattern,label);
}

const good=fixture();
const result=validateCroFunctionSemantics(good.csv,good.target,JSON.stringify(good.partition),
  {inventoryOptions:{expectedUnit:"cro/DllTitle",expectedTextSize:0x40}});
assert.deepEqual([result.functionCount,result.poolCount,result.textRelocations],[4,2,2]);
rejects("relocation in body",f=>{f.target.writeUInt32LE(0,f.elf.byName.get(".rel.text").offset);},/overlaps a function/);
rejects("relocation outside pool",f=>{f.partition.pools[1]={address:24,size:4};f.partition.gaps=[{address:20,size:4,mode:"arm"},{address:28,size:36,mode:"arm"}];},/not covered by a pool/);
rejects("bad veneer opcode",f=>{f.target.writeUInt32LE(0xe1a00000,f.elf.byName.get(".text").offset);},/noncanonical/);
rejects("defined veneer slot",f=>{const rel=f.elf.byName.get(".rel.text"),textSymbol=f.elf.symbols.find(s=>(s.info&15)===3&&s.shndx===f.elf.byName.get(".text").index);f.target.writeUInt32LE((textSymbol.index<<8)|2,rel.offset+4);},/undefined ABS32/);
rejects("self branch",f=>{f.target.writeUInt32LE(0xeafffffe,f.elf.byName.get(".text").offset+16);},/destination is invalid/);
rejects("partition mismatch",f=>{f.partition.functions[1].size=8;},/(overlap|differs)/);
rejects("pool overlaps function",f=>{f.partition.pools[0]={address:0,size:8};},/overlap/);
rejects("external interior entry",f=>{
  f.csv=f.csv.replace('00000008,"func_00000008","Global",$a,00000004,".text"',
    '00000008,"func_00000008","Global",$a,00000008,".text"')
    .replace('0000000C,"func_0000000C","Global",$a,00000004,".text"\n',"");
  f.partition.functions=f.partition.functions.filter(fn=>fn.address!==12);
  f.partition.functions.find(fn=>fn.address===8).size=8;
},/external direct flow.*interior/);
rejects("undefined instruction",f=>{const text=f.elf.byName.get(".text");f.target.writeUInt32LE(0xffffffff,text.offset+24);f.target.writeUInt32LE(0xffffffff,text.offset+28);f.csv=f.csv.replace('\n', '\n').replace('00000010,"func_00000010","Global",$a,00000004,".text"\n','00000010,"func_00000010","Global",$a,00000004,".text"\n00000018,"func_00000018","Global",$a,00000008,".text"\n');f.partition.functions.push({name:"func_00000018",address:24,size:8,mode:"arm"});f.partition.gaps=[];f.partition.pools.push({address:32,size:32});},/(undefined instruction|not covered by a pool)/);

console.log("CRO semantic inventory self-test: ok (instruction tiling, canonical veneers/tails, pools, 9 hostile cases)");
