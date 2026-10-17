#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { validateCroInventory } from "./validate-cro-symbols.mjs";
import { parseFunctionInventory } from "./split-cro-target-object.mjs";

const MAX_INPUT = 64 * 1024 * 1024;
const CSV_HEADER = "Location,Name,Namespace,Mode,Size,Segment";

function fail(message) { throw new Error(`CRO semantic inventory: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function add(left, right, limit, message) {
  check(Number.isSafeInteger(left) && Number.isSafeInteger(right) && left >= 0 && right >= 0, message);
  const result = left + right; check(Number.isSafeInteger(result) && result <= limit, message); return result;
}
function cstring(buffer, offset, context) {
  check(offset >= 0 && offset < buffer.length, `${context} string offset is invalid`);
  const end = buffer.indexOf(0, offset); check(end >= 0, `${context} string is unterminated`);
  return buffer.toString("utf8", offset, end);
}

function parseCsvRows(text) {
  const lines = text.split(/\r?\n/); if (lines.at(-1) === "") lines.pop();
  check(lines.length >= 4 && lines[3] === CSV_HEADER, "CSV header is invalid");
  return lines.slice(4).map((line, lineIndex) => {
    // The neutral exporter quotes only fields which never contain quotes or commas.
    const match = /^([0-9A-F]{8}),"(func_[0-9A-F]{8})","Global",(\$a|\$t),([0-9A-F]{8}),"\.text"$/.exec(line);
    check(match, `CSV line ${lineIndex + 5} is not canonical`);
    return { address: Number.parseInt(match[1], 16), name: match[2], mode: match[3] === "$a" ? "arm" : "thumb",
      size: Number.parseInt(match[4], 16) };
  });
}

function parseTargetElf(buffer) {
  check(Buffer.isBuffer(buffer) && buffer.length >= 52 && buffer.length <= MAX_INPUT, "target ELF size is invalid");
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f,0x45,0x4c,0x46,1,1,1]))
    && buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40
    && buffer.readUInt32LE(20) === 1 && buffer.readUInt16LE(40) === 52 && buffer.readUInt16LE(46) === 40,
  "target is not ELF32 little-endian ARM ET_REL");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(count >= 7 && count <= 4096 && shstrndx > 0 && shstrndx < count, "target section table is invalid");
  add(shoff, count * 40, buffer.length, "target section table is out of bounds");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    const section = { index, nameOffset: buffer.readUInt32LE(at), type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8), offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), info: buffer.readUInt32LE(at + 28), align: buffer.readUInt32LE(at + 32),
      entsize: buffer.readUInt32LE(at + 36) };
    if (section.type !== 8) add(section.offset, section.size, buffer.length, `section ${index} is out of bounds`);
    sections.push(section);
  }
  const shstr = sections[shstrndx]; check(shstr.type === 3, "section-name table is invalid");
  const names = buffer.subarray(shstr.offset, shstr.offset + shstr.size), byName = new Map();
  for (const section of sections) {
    section.name = section.index ? cstring(names, section.nameOffset, `section ${section.index}`) : "";
    check(!byName.has(section.name), `duplicate section ${section.name}`); byName.set(section.name, section);
  }
  const text = byName.get(".text");
  check(text?.type === 1 && text.flags === 6 && text.size > 0, "target has no canonical executable .text");
  text.data = buffer.subarray(text.offset, text.offset + text.size);
  const marker = byName.get(".cro.module");
  check(marker?.type === 1 && marker.size > 1, "target has no CRO module marker");
  const markerData = buffer.subarray(marker.offset, marker.offset + marker.size);
  check(markerData.at(-1) === 0 && markerData.indexOf(0) === markerData.length - 1,
    "target CRO module marker is invalid");
  const moduleName = markerData.subarray(0, -1).toString("utf8");
  check(/^[A-Za-z_][A-Za-z0-9_]{0,254}$/.test(moduleName), "target CRO module identity is invalid");
  const symtab = byName.get(".symtab");
  check(symtab?.type === 2 && symtab.entsize === 16 && symtab.size % 16 === 0
    && symtab.link < sections.length && sections[symtab.link].type === 3, "target symbol table is invalid");
  const strsec = sections[symtab.link], strings = buffer.subarray(strsec.offset, strsec.offset + strsec.size), symbols = [];
  for (let index = 0; index < symtab.size / 16; index++) {
    const at = symtab.offset + index * 16, shndx = buffer.readUInt16LE(at + 14);
    check(shndx < sections.length, `symbol ${index} section index is invalid`);
    symbols.push({ index, name: cstring(strings, buffer.readUInt32LE(at), `symbol ${index}`),
      value: buffer.readUInt32LE(at + 4), size: buffer.readUInt32LE(at + 8), info: buffer[at + 12], shndx });
  }
  const relocations = [];
  for (const section of sections) {
    if (section.type === 4) fail("RELA sections are unsupported");
    if (section.type !== 9 || section.info !== text.index) continue;
    check(section.name === ".rel.text" && section.flags === 0x40 && section.entsize === 8
      && section.size % 8 === 0 && section.link === symtab.index, ".text relocation section is invalid");
    for (let at = section.offset; at < section.offset + section.size; at += 8) {
      const offset = buffer.readUInt32LE(at), info = buffer.readUInt32LE(at + 4), symbolIndex = info >>> 8;
      check((info & 0xff) === 2, `.text relocation at 0x${offset.toString(16)} is not R_ARM_ABS32`);
      check(offset % 4 === 0 && offset + 4 <= text.size, `.text relocation at 0x${offset.toString(16)} is invalid`);
      check(symbolIndex > 0 && symbolIndex < symbols.length, `.text relocation symbol is invalid`);
      relocations.push({ offset, symbol: symbols[symbolIndex], type: 2 });
    }
  }
  relocations.sort((a,b) => a.offset - b.offset);
  for (let i = 1; i < relocations.length; i++) check(relocations[i-1].offset !== relocations[i].offset,
    `duplicate .text relocation at 0x${relocations[i].offset.toString(16)}`);
  return { text, symbols, relocations, moduleName };
}

function toolCandidateWorks(command) {
  const result = spawnSync(command, ["--version"], { encoding: "utf8", timeout: 10000, maxBuffer: 1024 * 1024 });
  return !result.error && result.status === 0 && /GNU objdump/i.test(result.stdout);
}

function findObjdump(explicit) {
  const candidates = [explicit, process.env.ARM_OBJDUMP,
    process.env.ARM_NONE_EABI_BIN && join(process.env.ARM_NONE_EABI_BIN, "arm-none-eabi-objdump"),
    "arm-none-eabi-objdump"].filter(Boolean);
  for (const candidate of candidates) if (toolCandidateWorks(candidate)) return candidate;
  const built = spawnSync("nix", ["build", "--no-link", "--print-out-paths",
    "nixpkgs#pkgsCross.arm-embedded.buildPackages.binutils"],
  { encoding: "utf8", timeout: 120000, maxBuffer: 4 * 1024 * 1024 });
  if (!built.error && built.status === 0) {
    for (const root of built.stdout.trim().split(/\s+/).filter(Boolean)) {
      const candidate = join(root, "bin", "arm-none-eabi-objdump");
      if (toolCandidateWorks(candidate)) return candidate;
    }
  }
  fail("GNU arm-none-eabi-objdump is required (set ARM_OBJDUMP)");
}

function parseDisassembly(output) {
  const instructions = [];
  for (const line of output.split("\n")) {
    const columns = line.split("\t");
    const addressMatch = /^\s*([0-9a-f]+):\s*$/i.exec(columns[0] ?? "");
    const encoding = (columns[1] ?? "").trim();
    if (!addressMatch || !/^[0-9a-f]{4,8}(?:\s+[0-9a-f]{4,8})*$/i.test(encoding)) continue;
    const encodings = encoding.split(/\s+/), size = encodings.reduce((sum, word) => sum + word.length / 2, 0);
    const assembly = columns.slice(2).join("\t").trim();
    instructions.push({ address: Number.parseInt(addressMatch[1], 16), size, assembly });
  }
  return instructions;
}

function validateTiling(functions, text, objdump) {
  const directory = mkdtempSync(join(tmpdir(), "cro-semantic-"));
  const finalInstructions = new Map();
  try {
    for (const mode of ["arm", "thumb"]) {
      const selected = functions.filter(fn => fn.mode === mode); if (!selected.length) continue;
      let cursor = 0; const packedRanges = [];
      for (const fn of selected) { packedRanges.push({ ...fn, packed: cursor }); cursor += fn.size; }
      const packed = Buffer.alloc(cursor);
      for (const fn of packedRanges) text.subarray(fn.address, fn.address + fn.size).copy(packed, fn.packed);
      const path = join(directory, `${mode}.bin`); writeFileSync(path, packed, { mode: 0o600 });
      const args = ["-D", "-b", "binary", "-m", "arm"];
      if (mode === "thumb") args.push("-M", "force-thumb");
      args.push(path);
      const result = spawnSync(objdump, args, { encoding: "utf8", timeout: 120000,
        maxBuffer: Math.min(256 * 1024 * 1024, Math.max(4 * 1024 * 1024, packed.length * 160)) });
      check(!result.error && result.status === 0, `${mode} disassembler failed`);
      const decoded = parseDisassembly(result.stdout);
      for (const fn of packedRanges) {
        const instructions = decoded.filter(item => item.address >= fn.packed && item.address < fn.packed + fn.size);
        let at = fn.packed;
        check(instructions.length > 0, `${fn.name} has no decoded instructions`);
        for (const instruction of instructions) {
          check(instruction.address === at, `${fn.name} is not exactly instruction-tiled at +0x${(at-fn.packed).toString(16)}`);
          check(instruction.size === 2 || instruction.size === 4,
            `${fn.name} has an invalid ${instruction.size}-byte instruction at packed 0x${instruction.address.toString(16)} (${instruction.assembly})`);
          check(!/(undefined|\(bad\)|\.word|\.short)/i.test(instruction.assembly), `${fn.name} contains an undefined instruction`);
          at += instruction.size;
        }
        check(at === fn.packed + fn.size, `${fn.name} has a partial or overlong final instruction`);
        finalInstructions.set(fn.name, instructions.at(-1).assembly);
      }
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
  return finalInstructions;
}

function signExtend(value, bits) { const shift = 32 - bits; return (value << shift) >> shift; }
function armBranchTarget(word, address) { return (address + 8 + signExtend(word & 0xffffff, 24) * 4) >>> 0; }
function thumbBranchTarget16(half, address) { return (address + 4 + signExtend(half & 0x7ff, 11) * 2) >>> 0; }
function thumbBranchTarget32(first, second, address) {
  const s = (first >>> 10) & 1, j1 = (second >>> 13) & 1, j2 = (second >>> 11) & 1;
  const i1 = (~(j1 ^ s)) & 1, i2 = (~(j2 ^ s)) & 1;
  const encoded = (s << 24) | (i1 << 23) | (i2 << 22) | ((first & 0x3ff) << 12) | ((second & 0x7ff) << 1);
  return (address + 4 + signExtend(encoded, 25)) >>> 0;
}

function containing(ranges, offset, size) { return ranges.find(range => offset >= range.address && offset + size <= range.end); }

function directFlows(range, text) {
  const flows = [];
  for (let address = range.address; address < range.end;) {
    if (range.mode === "arm") {
      const word = text.readUInt32LE(address);
      if ((word & 0x0e000000) === 0x0a000000) flows.push({ source: address, target: armBranchTarget(word, address) });
      address += 4;
      continue;
    }
    const first = text.readUInt16LE(address);
    const wide = (first & 0xe000) === 0xe000 && (first & 0x1800) !== 0;
    if (!wide) {
      if ((first & 0xf800) === 0xe000) flows.push({ source: address, target: thumbBranchTarget16(first, address) });
      else if ((first & 0xf000) === 0xd000 && ((first >>> 8) & 0xf) < 0xe) {
        flows.push({ source: address, target: (address + 4 + signExtend(first & 0xff, 8) * 2) >>> 0 });
      }
      address += 2;
      continue;
    }
    const second = text.readUInt16LE(address + 2);
    if ((first & 0xf800) === 0xf000 && ((second & 0xd000) === 0x9000 || (second & 0xd000) === 0xd000)) {
      flows.push({ source: address, target: thumbBranchTarget32(first, second, address) });
    }
    address += 4;
  }
  return flows;
}

function isTerminalAssembly(assembly) {
  const normalized = assembly.replace(/\s+/g, " ").trim().toLowerCase();
  const mnemonic = normalized.split(/[\s\t]+/, 1)[0];
  if (/^b(?:\.[a-z]+|[a-z]{0,2})?$/.test(mnemonic) && !/^bl/.test(mnemonic)) return true;
  if (/^bx(?:j)?(?:\.[a-z]+)?$/.test(mnemonic)) return true;
  if (/^(pop|ldm[a-z]*|ldr[a-z]*|mov[a-z]*|subs[a-z]*)\b/.test(mnemonic) && /\bpc\b/.test(normalized)) return true;
  return /^(udf|bkpt|svc)\b/.test(mnemonic);
}

export function validateCroFunctionSemantics(csvText, targetBuffer, partitionInput, options = {}) {
  check(Buffer.byteLength(csvText) <= MAX_INPUT, "CSV exceeds the size limit");
  const summary = validateCroInventory(csvText, options.inventoryOptions);
  const functions = parseCsvRows(csvText), target = parseTargetElf(targetBuffer);
  const partition = parseFunctionInventory(partitionInput);
  check(partition.module === target.moduleName, "partition module disagrees with target marker");
  check(partition.textSize === target.text.size && partition.textSize === summary.textSize,
    "partition, CSV, and target text sizes disagree");
  check(partition.functions.length === functions.length, "partition function set differs from CSV");
  const partitionFunctions = new Map(partition.ranges.filter(range => range.kind === "function").map(range => [range.name, range]));
  for (const fn of functions) {
    const range = partitionFunctions.get(fn.name);
    check(range && range.address === fn.address && range.size === fn.size && range.mode === fn.mode,
      `${fn.name} differs between CSV and partition`);
  }
  const pools = partition.ranges.filter(range => range.kind === "pool");
  for (const pool of pools) for (const fn of functions) check(pool.end <= fn.address || pool.address >= fn.address + fn.size,
    `${pool.name} overlaps ${fn.name}`);
  for (const relocation of target.relocations) {
    check(!functions.some(fn => relocation.offset < fn.address + fn.size && relocation.offset + 4 > fn.address),
      `relocation output at 0x${relocation.offset.toString(16)} overlaps a function body`);
    check(containing(pools, relocation.offset, 4),
      `relocation output at 0x${relocation.offset.toString(16)} is not covered by a pool`);
  }
  const relocByOffset = new Map(target.relocations.map(rel => [rel.offset, rel]));
  for (const fn of functions) {
    if (fn.mode === "arm" && fn.size === 4) {
      const word = target.text.data.readUInt32LE(fn.address);
      if (word === 0xe51ff004) {
        const relocation = relocByOffset.get(fn.address + 4);
        check(relocation && relocation.symbol.shndx === 0 && containing(pools, fn.address + 4, 4),
          `${fn.name} veneer lacks an undefined ABS32 import slot at +4 in a pool`);
      } else if (word === 0xe12fff1e || word === 0xe1a0f00e) {
        // Canonical one-instruction return/tail forms.
      } else if (((word & 0xff000000) >>> 0) === 0xea000000) {
        const destination = armBranchTarget(word, fn.address);
        check(destination % 4 === 0 && destination < target.text.size && destination !== fn.address,
          `${fn.name} direct ARM tail destination is invalid`);
      } else fail(`${fn.name} has a noncanonical four-byte ARM body`);
    } else if (fn.mode === "thumb" && fn.size === 2) {
      const half = target.text.data.readUInt16LE(fn.address);
      if (half === 0x4770) continue;
      if ((half & 0xf800) === 0xe000) {
        const destination = thumbBranchTarget16(half, fn.address);
        check(destination % 2 === 0 && destination < target.text.size && destination !== fn.address,
          `${fn.name} direct Thumb tail destination is invalid`);
      } else fail(`${fn.name} has a noncanonical two-byte Thumb body`);
    } else if (fn.mode === "thumb" && fn.size === 4) {
      const first = target.text.data.readUInt16LE(fn.address), second = target.text.data.readUInt16LE(fn.address + 2);
      if (first === 0xf8df && second === 0xf000) {
        check(fn.address % 4 === 0, `${fn.name} Thumb veneer entry is not four-byte aligned`);
        const relocation = relocByOffset.get(fn.address + 4);
        check(relocation && relocation.symbol.shndx === 0 && containing(pools, fn.address + 4, 4),
          `${fn.name} veneer lacks an undefined ABS32 import slot at +4 in a pool`);
      } else if ((first & 0xf800) === 0xf000 && (second & 0xd000) === 0x9000) {
        const destination = thumbBranchTarget32(first, second, fn.address);
        check(destination % 2 === 0 && destination < target.text.size && destination !== fn.address,
          `${fn.name} direct Thumb tail destination is invalid`);
      } else fail(`${fn.name} has a noncanonical four-byte Thumb body`);
    }
  }
  const objdump = findObjdump(options.objdump);
  const finalInstructions = validateTiling(functions, target.text.data, objdump);
  for (const fn of functions) check(isTerminalAssembly(finalInstructions.get(fn.name)),
    `${fn.name} does not end in an independently decoded terminal instruction`);

  const exports = new Set(target.symbols.filter(symbol => symbol.shndx === target.text.index
    && (symbol.info >> 4) === 1).map(symbol => symbol.value & ~1));
  const codeRanges = partition.ranges.filter(range => range.kind === "function" || range.kind === "gap");
  const flows = codeRanges.flatMap(range => directFlows(range, target.text.data));
  const incoming = new Set(flows.map(flow => flow.target));
  let independentlyEvidencedEntries = 0;
  for (const fn of functions) {
    const evidenced = exports.has(fn.address) || incoming.has(fn.address);
    if (evidenced) independentlyEvidencedEntries++;
    else check(fn.size > 4, `${fn.name} lacks structural-export or direct-flow entry evidence`);
  }
  for (const flow of flows) {
    const owner = functions.find(fn => flow.target > fn.address && flow.target < fn.address + fn.size);
    const sourceOwner = functions.find(fn => flow.source >= fn.address && flow.source < fn.address + fn.size);
    check(!owner || sourceOwner === owner,
      `external direct flow at 0x${flow.source.toString(16)} enters the interior of ${owner?.name}`);
  }
  return { unit: summary.unit, functionCount: functions.length, bodyBytes: summary.bodyBytes,
    poolCount: pools.length, textRelocations: target.relocations.length, independentlyEvidencedEntries };
}

function bounded(path) { const data = readFileSync(path); check(data.length > 0 && data.length <= MAX_INPUT, `${path} size is invalid`); return data; }

function main() {
  const args = process.argv.slice(2);
  check(args.length === 3, "usage: validate-cro-function-semantics.mjs <inventory.csv> <target.o> <partition.json>");
  const stem = basename(args[1], ".o"); check(/^Dll[A-Za-z0-9_]+$/.test(stem), "target object name is invalid");
  const result = validateCroFunctionSemantics(bounded(args[0]).toString("utf8"), bounded(args[1]), bounded(args[2]), {
    inventoryOptions: { expectedUnit: `cro/${stem}` },
  });
  console.log(`Semantically validated ${result.unit}: ${result.functionCount} functions, ${result.poolCount} pools, ${result.textRelocations} text relocations.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
