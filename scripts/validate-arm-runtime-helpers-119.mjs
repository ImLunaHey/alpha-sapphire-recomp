#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_FILE = 64 * 1024 * 1024;
const MAX_EXEC = 16 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const MAX_RELOCS = 1_000_000;
const CONFIG_HASH = "bc0f393d15583ead7a81e6327a560038783dc5f5610687119c8999829f3ced1d";
const SOURCE_HASH = "27ff1d957c3a31dbba00c76b734b7fe687966896d891b8903d43f73b1bfec0bd";
const SPEC_HASH = "f6602136c1cff57a3ba5943ef7f348cd40028095fe152c7997869b91a54cebde";
const ATTRIBUTES = Buffer.from("411b000000616561626900011100000005364b000609080109010a02", "hex");

const FUNCTIONS = [
  { name: "func_004A9DA4", words: [0xe1a03001,0xe1a01000,0xe3a02070,0xe1a00003,0xeafffffe], relocs: [{ offset:16, type:29, symbol:"func_00300B28" }] },
  { name: "func_004A9DF4", words: [0xe1a03000,0xe1b00001,0xe92d4010,0x0a000005,0xe3a02008,0xe1a01003,0xfafffffe,0xe3500000,0x03a00001,0x13a00000,0xe8bd8010], relocs: [{ offset:24, type:28, symbol:"func_00100218" }] },
  { name: "func_004B22CC", words: [0xe92d4070,0xe1a05002,0xe1a04000,0xe3a02006,0xfafffffe,0xe3500000,0x1a000012,0xe5940018,0xe595100c,0xe1500001,0x1a00000e,0xe5940010,0xe5951004,0xe1500001,0x1a00000a,0xe5d40014,0xe5d51008,0xe1500001,0x1a000006,0xe3a02014,0xe285101f,0xe284002b,0xfafffffe,0xe3500000,0x13a00001,0xe8bd8070,0xe3a00002,0xe8bd8070], relocs: [{ offset:16, type:28, symbol:"func_00100218" },{ offset:88, type:28, symbol:"func_00100218" }] },
  { name: "func_004B233C", words: [0xe92d4070,0xe1a04000,0xe1a05001,0xe3a02006,0xfafffffe,0xe3500000,0x1a000012,0xe5940018,0xe5951018,0xe1500001,0x1a00000e,0xe5940010,0xe5951010,0xe1500001,0x1a00000a,0xe5d40014,0xe5d51014,0xe1500001,0x1a000006,0xe3a02014,0xe285102b,0xe284002b,0xfafffffe,0xe3500000,0x13a00001,0xe8bd8070,0xe3a00002,0xe8bd8070], relocs: [{ offset:16, type:28, symbol:"func_00100218" },{ offset:88, type:28, symbol:"func_00100218" }] }
].map(f => ({ ...f, size: f.words.length * 4 }));
const EXTERNALS = ["func_00100218", "func_00300B28"];

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function bounded(buffer, offset, size, what) {
  check(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset <= buffer.length - size, `${what} is outside the file`);
  return buffer.subarray(offset, offset + size);
}
function stringAt(buffer, offset, what) {
  check(Number.isInteger(offset) && offset >= 0 && offset < buffer.length, `${what} string offset is invalid`);
  const end = buffer.indexOf(0, offset); check(end >= 0, `${what} string is unterminated`);
  return buffer.toString("utf8", offset, end);
}
function parseElf(buffer) {
  check(buffer.length <= MAX_FILE, "complete input exceeds 64 MiB");
  check(buffer.length >= 52 && buffer.subarray(0,7).equals(Buffer.from([0x7f,0x45,0x4c,0x46,1,1,1])), "not ELF32 little-endian version 1");
  check(buffer[7]===0 && buffer[8]===0 && buffer.subarray(9,16).every(x=>x===0), "noncanonical ELF identification");
  check(buffer.readUInt16LE(16)===1 && buffer.readUInt16LE(18)===40 && buffer.readUInt32LE(20)===1, "not ARM ET_REL version 1");
  check(buffer.readUInt32LE(24)===0 && buffer.readUInt32LE(28)===0 && buffer.readUInt32LE(36)===0x05000000, "entry/program headers/EABI flags mismatch");
  check(buffer.readUInt16LE(40)===52 && buffer.readUInt16LE(42)===0 && buffer.readUInt16LE(44)===0 && buffer.readUInt16LE(46)===40, "noncanonical ELF header sizes");
  const shoff=buffer.readUInt32LE(32), shnum=buffer.readUInt16LE(48), shstrndx=buffer.readUInt16LE(50);
  check(shoff>=52 && !(shoff&3) && shnum>0 && shnum<=MAX_SECTIONS && shstrndx>0 && shstrndx<shnum, "invalid or excessive section table");
  bounded(buffer,shoff,shnum*40,"section table");
  const sections=[];
  for(let i=0;i<shnum;i++){const p=shoff+i*40;sections.push({index:i,nameOffset:buffer.readUInt32LE(p),type:buffer.readUInt32LE(p+4),flags:buffer.readUInt32LE(p+8),addr:buffer.readUInt32LE(p+12),offset:buffer.readUInt32LE(p+16),size:buffer.readUInt32LE(p+20),link:buffer.readUInt32LE(p+24),info:buffer.readUInt32LE(p+28),align:buffer.readUInt32LE(p+32),entsize:buffer.readUInt32LE(p+36)});}
  check(Object.values(sections[0]).every(v=>v===0),"section zero is not canonical");
  check(sections[shstrndx].type===3,"section-name table is invalid");
  const shstrings=bounded(buffer,sections[shstrndx].offset,sections[shstrndx].size,"section-name table");
  let execSize=0,symbolCount=0,relocCount=0;
  for(const s of sections){s.name=stringAt(shstrings,s.nameOffset,`section ${s.index}`);if(s.type!==8)bounded(buffer,s.offset,s.size,`section ${s.name}`);if(s.flags&4){execSize+=s.size;check(execSize<=MAX_EXEC,"aggregate executable data exceeds 16 MiB");}if(s.type===2||s.type===11){check(s.entsize===16&&s.size%16===0,"malformed symbol table");symbolCount+=s.size/16;}if(s.type===9||s.type===4){const n=s.type===9?8:12;check(s.entsize===n&&s.size%n===0,"malformed relocation table");relocCount+=s.size/n;}}
  check(symbolCount<=MAX_SYMBOLS,"aggregate symbol count exceeds 1,000,000");check(relocCount<=MAX_RELOCS,"aggregate relocation count exceeds 1,000,000");
  const symtabs=sections.filter(s=>s.type===2||s.type===11);check(symtabs.length===1&&symtabs[0].type===2,"expected exactly one SYMTAB and no DYNSYM");
  const symtab=symtabs[0];check(symtab.flags===0&&symtab.addr===0&&symtab.align===4&&!(symtab.offset&3)&&symtab.link<shnum&&sections[symtab.link].type===3,"invalid SYMTAB metadata");
  const strings=bounded(buffer,sections[symtab.link].offset,sections[symtab.link].size,"symbol strings"),symbols=[];
  for(let i=0;i<symtab.size/16;i++){const p=symtab.offset+i*16,n=buffer.readUInt32LE(p);symbols.push({index:i,nameOffset:n,name:n?stringAt(strings,n,`symbol ${i}`):"",value:buffer.readUInt32LE(p+4),size:buffer.readUInt32LE(p+8),bind:buffer[p+12]>>>4,type:buffer[p+12]&15,other:buffer[p+13],shndx:buffer.readUInt16LE(p+14)});}
  check(symtab.info<=symbols.length&&symbols.every((s,i)=>i<symtab.info?s.bind===0:s.bind!==0),"invalid local/global symbol partition");
  check(symbols.length&&Object.values(symbols[0]).every(v=>v===0||v===""),"null symbol is not canonical");
  return {buffer,sections,symtab,symbols,relocs:sections.filter(s=>s.type===9||s.type===4),shoff};
}
function validateObject(buffer) {
  const elf=parseElf(buffer), byName=new Map(elf.sections.map(s=>[s.name,s]));
  const wantedSections=FUNCTIONS.map(f=>`.text.${f.name}`);
  check(JSON.stringify(elf.sections.filter(s=>(s.flags&4)&&s.size).map(s=>s.name))===JSON.stringify(wantedSections),"nonempty executable section set is not exact");
  for(const fn of FUNCTIONS){const section=byName.get(`.text.${fn.name}`);check(section&&elf.sections.filter(s=>s.name===section.name).length===1,`${fn.name}: missing or duplicate section`);check(section.type===1&&section.flags===6&&section.addr===0&&section.size===fn.size&&section.align===4&&section.link===0&&section.info===0&&section.entsize===0&&!(section.offset&3),`${fn.name}: section metadata mismatch`);const bytes=bounded(buffer,section.offset,section.size,fn.name);fn.words.forEach((word,i)=>check(bytes.readUInt32LE(i*4)===word,`${fn.name}: instruction mismatch at +${i*4}`));const members=elf.symbols.filter(s=>s.shndx===section.index);check(members.filter(s=>s.bind===0&&s.type===3&&s.name===""&&s.value===0&&s.size===0&&s.other===0).length===1,`${fn.name}: section symbol mismatch`);check(members.filter(s=>s.bind===0&&s.type===0&&s.name==="$a"&&s.value===0&&s.size===0&&s.other===0).length===1,`${fn.name}: ARM mapping mismatch`);check(members.filter(s=>s.bind===1&&s.type===2&&s.name===fn.name&&s.value===0&&s.size===fn.size&&s.other===0).length===1,`${fn.name}: function symbol mismatch`);check(members.length===3,`${fn.name}: extra owned symbol`);
    const rs=elf.relocs.filter(s=>s.name===`.rel.text.${fn.name}`);check(rs.length===1,`${fn.name}: REL section set mismatch`);const rel=rs[0];check(rel.type===9&&rel.flags===0x40&&rel.addr===0&&rel.align===4&&rel.entsize===8&&rel.link===elf.symtab.index&&rel.info===section.index&&rel.size===fn.relocs.length*8,`${fn.name}: REL metadata mismatch`);const seen=new Set();for(let i=0;i<rel.size;i+=8){const off=buffer.readUInt32LE(rel.offset+i),info=buffer.readUInt32LE(rel.offset+i+4),type=info&255,sym=elf.symbols[info>>>8],want=fn.relocs.find(r=>r.offset===off);check(sym&&want&&!seen.has(off)&&type===want.type&&sym.name===want.symbol,`${fn.name}: relocation slot/type/identity mismatch`);check(bytes.readUInt32LE(off)===(type===28?0xfafffffe:0xeafffffe),`${fn.name}: relocation addend mismatch`);seen.add(off);}}
  check(elf.relocs.length===FUNCTIONS.length,"extra relocation section");
  const attrs=elf.sections.filter(s=>s.name===".ARM.attributes");check(attrs.length===1&&attrs[0].type===0x70000003&&attrs[0].flags===0&&attrs[0].addr===0&&attrs[0].align===1&&attrs[0].link===0&&attrs[0].info===0&&attrs[0].entsize===0&&bounded(buffer,attrs[0].offset,attrs[0].size,"attributes").equals(ATTRIBUTES),"ARM attributes mismatch");
  for(const name of EXTERNALS){const xs=elf.symbols.filter(s=>s.name===name);check(xs.length===1&&xs[0].bind===1&&xs[0].type===0&&xs[0].other===0&&xs[0].value===0&&xs[0].size===0&&xs[0].shndx===0,`${name}: undefined identity mismatch`);}
  const globals=elf.symbols.filter(s=>s.bind!==0), names=new Set([...FUNCTIONS.map(f=>f.name),...EXTERNALS]);check(globals.length===names.size&&globals.every(s=>names.has(s.name)),"global symbol set is not exact");
  const locals=elf.symbols.filter(s=>s.bind===0&&s.name);check(locals.length===FUNCTIONS.length&&locals.every(s=>s.name==="$a"),"named local symbol set is not exact");
}
function hasDefinition(text,name){const clean=text.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/[^\n]*/g,"");return new RegExp(`(?:^|\\n)\\s*(?:${name}\\s*:|\\.(?:set|equ|equiv|thumb_set)\\s+${name}\\s*,)|\\b${name}\\s*\\([^;]*\\)\\s*\\{`).test(clean);}
function validatePinned() {
  const configPath=path.join(ROOT,"config/arm-runtime-helpers-119.json"),sourcePath=path.join(ROOT,"src/main/arm_runtime_helpers_119.S"),specPath=path.join(ROOT,"docs/specs/main/arm_runtime_helpers_119.md");
  const configBytes=fs.readFileSync(configPath),config=JSON.parse(configBytes);check(hash(configBytes)===CONFIG_HASH,"configuration hash mismatch");check(config.sourceHash===SOURCE_HASH&&hash(fs.readFileSync(sourcePath))===SOURCE_HASH,"source hash mismatch");check(hash(fs.readFileSync(specPath))===SPEC_HASH,"specification hash mismatch");
  check(config.functions.length===4&&config.totalBodySize===288&&config.expectedInstructionCount===72&&config.expectedRelocationCount===6,"configuration aggregate mismatch");
  for(const relative of fs.readdirSync(path.join(ROOT,"src"),{recursive:true})){const filename=`src/${relative}`;if(filename===config.source||!/\.(?:S|s|c|cc|cpp|h|inc)$/.test(filename))continue;const text=fs.readFileSync(path.join(ROOT,filename),"utf8");for(const fn of FUNCTIONS)check(!hasDefinition(text,fn.name),`duplicate source owner for ${fn.name} in ${filename}`);}
  for(const relative of fs.readdirSync(path.join(ROOT,"config"),{recursive:true})){if(relative==="arm-runtime-helpers-119.json"||!relative.endsWith(".json"))continue;const other=JSON.parse(fs.readFileSync(path.join(ROOT,"config",relative),"utf8"));for(const entry of Array.isArray(other.functions)?other.functions:[]){const m=/^func_([0-9A-F]{8})$/.exec(entry.name??"");if(!m)continue;const start=parseInt(m[1],16),size=entry.ownedSize??entry.size??1;for(const fn of FUNCTIONS){const own=parseInt(fn.name.slice(5),16);check(start>=own+fn.size||start+size<=own,`overlapping config owner for ${fn.name} in ${relative}`);}}}
}
function findAssembler(){const candidates=[process.env.ARM_AS,"arm-none-eabi-as"];try{for(const entry of fs.readdirSync("/nix/store"))candidates.push(path.join("/nix/store",entry,"bin/arm-none-eabi-as"));}catch{}for(const candidate of candidates.filter(Boolean)){const r=spawnSync(candidate,["--version"]);if(!r.error&&r.status===0)return candidate;}fail("arm-none-eabi-as not found; set ARM_AS");}
function assemble(as,source,object){const r=spawnSync(as,["-march=armv6k","-mfpu=vfpv2","-o",object,source],{encoding:"utf8"});check(!r.error&&r.status===0,`assembly failed: ${r.error?.message||r.stderr}`);}
function selfTest(){const temp=fs.mkdtempSync(path.join(os.tmpdir(),"rt119-"));let rejected=0;try{const as=findAssembler(),object=path.join(temp,"good.o");assemble(as,path.join(ROOT,"src/main/arm_runtime_helpers_119.S"),object);const good=fs.readFileSync(object);validateObject(good);const reject=(label,change,pattern)=>{const b=Buffer.from(good),elf=parseElf(b);change(b,elf);let error;try{validateObject(b);}catch(e){error=e;}check(error&&(!pattern||pattern.test(error.message)),`hostile fixture accepted: ${label}`);rejected++;};reject("instruction",(b,e)=>{const s=e.sections.find(x=>x.name===".text.func_004A9DF4");b[s.offset]^=1;});reject("relocation type",(b,e)=>{const s=e.relocs[0];b.writeUInt32LE((b.readUInt32LE(s.offset+4)&~255)|2,s.offset+4);});reject("relocation slot",(b,e)=>{const s=e.relocs[0];b.writeUInt32LE(0,s.offset);});reject("function size",(b,e)=>{const s=e.symbols.find(x=>x.name===FUNCTIONS[0].name),p=e.symtab.offset+s.index*16;b.writeUInt32LE(s.size+4,p+8);});reject("mapping",(b,e)=>{const s=e.symbols.find(x=>x.name==="$a"),p=e.symtab.offset+s.index*16;b.writeUInt32LE(4,p+4);});reject("section flags",(b,e)=>{const s=e.sections.find(x=>x.name===`.text.${FUNCTIONS[0].name}`);b.writeUInt32LE(2,e.shoff+s.index*40+8);});reject("attributes",(b,e)=>{const s=e.sections.find(x=>x.name===".ARM.attributes");b[s.offset+s.size-1]^=1;});reject("ELF flags",b=>b.writeUInt32LE(0,36));reject("DYNSYM",(b,e)=>{b.writeUInt32LE(11,e.shoff+e.symtab.index*40+4);});for(const n of [0,1,7,51,good.length-1]){let error;try{validateObject(good.subarray(0,n));}catch(e){error=e;}check(error,`truncation ${n} accepted`);rejected++;}const composite=path.join(temp,"composite.S"),compositeObject=path.join(temp,"composite.o");let extra=fs.readFileSync(path.join(ROOT,"src/main/arm_runtime_helpers_119.S"),"utf8");for(let i=0;i<12000;i++)extra+=`\n.section .text.rt119_empty_${i},\"ax\",%progbits\n`;fs.writeFileSync(composite,extra);assemble(as,composite,compositeObject);validateObject(fs.readFileSync(compositeObject));const oversized=Buffer.alloc(MAX_FILE+1);let error;try{validateObject(oversized);}catch(e){error=e;}check(error&&/64 MiB/.test(error.message),"file cap fixture accepted");rejected++;process.stdout.write(`arm-runtime-helpers-119 self-test: ok (${rejected} hostile fixtures; 12,000-section composite)\n`);}finally{fs.rmSync(temp,{recursive:true,force:true});}}
function main(){validatePinned();const args=process.argv.slice(2);if(args.length===1&&args[0]==="--self-test")return selfTest();check(args.length===1&&!args[0].startsWith("-"),"usage: validate-arm-runtime-helpers-119.mjs <object-file> | --self-test");const stat=fs.statSync(args[0]);check(stat.size<=MAX_FILE,"complete input exceeds 64 MiB before read");validateObject(fs.readFileSync(args[0]));process.stdout.write(`arm-runtime-helpers-119 validation: ok (${args[0]})\n`);}

try{main();}catch(error){process.stderr.write(`arm-runtime-helpers-119 validation failed: ${error.message}\n`);process.exitCode=1;}
