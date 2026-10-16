#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-runtime-helpers-68.json");
const EXPECTED_SOURCE = "src/main/arm_runtime_helpers_68.S";
const EXPECTED_SHA256 = "c2a036877e7fa24c944d6c31b6258fdb11e2fad8d3934365068fffee771ea83c";
const config = JSON.parse(readFileSync(configPath, "utf8"));
check(config.source === EXPECTED_SOURCE, `unexpected source path: ${config.source}`);
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath);
const sourceText = source.toString("utf8");
const expectedBranches = new Map([
  ["func_004945A4", 6], ["func_0052B6E4", 1], ["func_00498184", 3],
  ["func_004140A8", 8], ["func_0041415C", 8], ["func_004942A0", 6],
  ["func_00499124", 2], ["func_004957A4", 2], ["func_00441514", 7],
  ["func_00498B60", 2], ["func_0045C0E8", 7], ["func_00463DCC", 3],
  ["func_00410A6C", 0], ["func_004415BC", 7], ["func_004198F0", 2],
  ["func_004A0338", 5], ["func_004AC534", 4], ["func_00415F9C", 2],
  ["func_00442550", 6], ["func_0044A794", 6], ["func_0047DB94", 2],
  ["func_0049A0F8", 1], ["func_004A0CDC", 1], ["func_00415EC4", 5],
]);

function fail(message) {
  throw new Error(`arm-runtime-helpers-68: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function run(tool, args) {
  const result = spawnSync(tool, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) fail(`unable to run ${tool}: ${result.error.message}`);
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    fail(`${tool} ${args.join(" ")} exited with ${result.status}${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout;
}

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateSource() {
  check(config.schemaVersion === 1 && config.mode === "arm", "invalid schema or instruction mode");
  check(config.functions.length === 24, `expected 24 functions, found ${config.functions.length}`);
  check(config.totalBodySize === 3596, `expected 3596 body bytes, found ${config.totalBodySize}`);
  check(config.totalAdjacentSize === 0, "adjacent data must remain empty");
  check(Array.isArray(config.pcRelativeDataAccesses) && config.pcRelativeDataAccesses.length === 0,
    "PC-relative data access manifest must remain empty");
  check(config.symbolicIdentities && Object.keys(config.symbolicIdentities).length === 0,
    "symbolic identity manifest must remain empty");
  check(config.symbolicSlots && Object.keys(config.symbolicSlots).length === 0,
    "symbolic slot manifest must remain empty");
  check(config.functions.reduce((sum, fn) => sum + fn.size, 0) === 3596,
    "configured function sizes do not total 3596 bytes");
  check(config.functions.reduce((sum, fn) => sum + fn.size / 4, 0) === 899,
    "configured function sizes do not total 899 ARM instructions");

  const digest = createHash("sha256").update(source).digest("hex");
  check(config.sourceSha256 === EXPECTED_SHA256, "config sourceSha256 is stale");
  check(digest === EXPECTED_SHA256,
    `source SHA-256 mismatch (expected ${EXPECTED_SHA256}, got ${digest})`);
  check(sourceText.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n"),
    "source preamble must select unified ARMv6K/VFPv2 ARM state");
  check(!/^\s*\.(?:byte|2byte|hword|short|word|long|quad|ascii|asciz|string|incbin)\b/m.test(sourceText),
    "source contains adjacent or embedded data");
  check(!/^\s*(?:bl|blx)\b/im.test(sourceText), "source contains a call instruction");
  check(!/\b(?:ldr|vldr)\s+[^\n]*\bpc\b/i.test(sourceText), "source contains a PC-relative load");

  const sections = [...sourceText.matchAll(/^\.section \.text\.([A-Za-z0-9_]+),"ax",%progbits$/gm)]
    .map((match) => match[1]);
  const names = config.functions.map((fn) => fn.name);
  check(JSON.stringify(sections) === JSON.stringify(names), "source section order differs from config");
  for (const fn of config.functions) {
    check(fn.size % 4 === 0, `${fn.name}: size is not ARM-instruction aligned`);
    check(Array.isArray(fn.calls) && fn.calls.length === 0, `${fn.name}: calls manifest is not empty`);
    check(Array.isArray(fn.adjacentWords) && fn.adjacentWords.length === 0,
      `${fn.name}: adjacent-word manifest is not empty`);
    const name = escaped(fn.name);
    for (const pattern of [
      new RegExp(`^\\.global ${name}$`, "m"),
      new RegExp(`^\\.type ${name}, %function$`, "m"),
      new RegExp(`^${name}:$`, "m"),
      new RegExp(`^\\.size ${name}, \\.-${name}$`, "m"),
    ]) check(pattern.test(sourceText), `${fn.name}: incomplete function directives`);
  }
  return digest;
}

function parseSections(output) {
  const sections = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+([0-9a-f]+)\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/i);
    if (match) sections.set(match[2], {
      index: Number.parseInt(match[1], 10),
      address: Number.parseInt(match[3], 16),
      size: Number.parseInt(match[4], 16),
      flags: match[5],
    });
  }
  return sections;
}

function parseSymbols(output) {
  const symbols = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\d+:\s+([0-9a-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(.+)$/i);
    if (!match) continue;
    const name = match[6].trim();
    const row = {
      value: Number.parseInt(match[1], 16), size: Number.parseInt(match[2], 10),
      type: match[3], bind: match[4], sectionIndex: match[5],
    };
    if (!symbols.has(name)) symbols.set(name, []);
    symbols.get(name).push(row);
  }
  return symbols;
}

function validateOwnedRelocations(output, ownedSections) {
  let relocatedSection = "";
  for (const line of output.split(/\r?\n/)) {
    const heading = line.match(/^Relocation section '(\.rela?\.\S+)'/);
    if (heading) {
      relocatedSection = heading[1].replace(/^\.rela?/, "");
      continue;
    }
    if (ownedSections.has(relocatedSection) && /^\s*[0-9a-f]+\s+[0-9a-f]+\s+\S+/i.test(line)) {
      fail(`${relocatedSection}: contains a relocation`);
    }
  }
}

function parseInstructions(output) {
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-f]+):\s+[0-9a-f]+\s+([a-z][a-z0-9.]*)\s*(.*)$/i);
    if (match) instructions.push({
      address: Number.parseInt(match[1], 16), mnemonic: match[2].toLowerCase(), operands: match[3].trim(),
    });
  }
  return instructions;
}

function validateObject(objectPath, readelf, objdump) {
  const header = run(readelf, ["-hW", objectPath]);
  check(/^\s*Class:\s+ELF32\s*$/m.test(header), "object is not ELF32");
  check(/^\s*Data:\s+2's complement, little endian\s*$/m.test(header), "object is not little-endian");
  check(/^\s*Type:\s+REL\b/m.test(header), "object is not relocatable");
  check(/^\s*Machine:\s+ARM\s*$/m.test(header), "object machine is not ARM");

  const sections = parseSections(run(readelf, ["-SW", objectPath]));
  const symbols = parseSymbols(run(readelf, ["-sW", objectPath]));
  const ownedSections = new Set(config.functions.map((fn) => `.text.${fn.name}`));
  let bytes = 0;
  let instructionCount = 0;
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    check(section, `${fn.name}: missing owned section ${sectionName}`);
    check(section.flags.includes("A") && section.flags.includes("X"), `${sectionName}: is not executable/allocated`);
    check(section.size === fn.size, `${sectionName}: size ${section.size}, expected ${fn.size}`);
    const rows = symbols.get(fn.name) ?? [];
    check(rows.length === 1, `${fn.name}: expected one symbol, found ${rows.length}`);
    const symbol = rows[0];
    check(symbol.type === "FUNC" && symbol.bind === "GLOBAL" && symbol.sectionIndex !== "UND",
      `${fn.name}: is not a defined global function`);
    check(symbol.size === fn.size, `${fn.name}: symbol size ${symbol.size}, expected ${fn.size}`);
    check(symbol.value % 4 === 0, `${fn.name}: ARM boundary is not four-byte aligned`);

    const disassembly = run(objdump, ["-d", "-w", `--section=${sectionName}`, objectPath]);
    const instructions = parseInstructions(disassembly)
      .filter((instruction) => instruction.address >= symbol.value && instruction.address < symbol.value + symbol.size);
    check(instructions.length === fn.size / 4,
      `${fn.name}: decoded ${instructions.length} instructions, expected ${fn.size / 4}`);
    for (let index = 0; index < instructions.length; index += 1) {
      check(instructions[index].address === symbol.value + index * 4,
        `${fn.name}: instruction boundary gap at index ${index}`);
    }
    check(!instructions.some(({ mnemonic }) => mnemonic === "bl" || mnemonic === "blx"),
      `${fn.name}: contains a call instruction`);
    check(!instructions.some(({ mnemonic, operands }) => /^(?:ldr|vldr)/.test(mnemonic) && /\bpc\b/i.test(operands)),
      `${fn.name}: contains a PC-relative data access`);

    const branches = instructions.filter(({ mnemonic }) =>
      /^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le)?$/.test(mnemonic));
    check(branches.length === expectedBranches.get(fn.name),
      `${fn.name}: has ${branches.length} local branches, expected ${expectedBranches.get(fn.name)}`);
    for (const branch of branches) {
      const target = branch.operands.match(/^([0-9a-f]+)\b/i);
      check(target, `${fn.name}: cannot decode branch target from '${branch.operands}'`);
      const address = Number.parseInt(target[1], 16);
      check(address >= symbol.value && address < symbol.value + symbol.size && address % 4 === 0,
        `${fn.name}: branch target 0x${address.toString(16)} escapes its function body`);
    }
    bytes += fn.size;
    instructionCount += instructions.length;
  }
  check(bytes === 3596 && instructionCount === 899,
    `object totals are ${bytes} bytes/${instructionCount} instructions, expected 3596/899`);
  validateOwnedRelocations(run(readelf, ["-rW", objectPath]), ownedSections);
  return instructionCount;
}

const digest = validateSource();
const args = process.argv.slice(2);
check(args.length === 0 || args.length === 2 || args.length === 3,
  "usage: validate-arm-runtime-helpers-68.mjs [objectPath readelf [objdump]]");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-68-"));
try {
  let objectPath;
  let readelf;
  let objdump;
  if (args.length) {
    objectPath = resolve(args[0]);
    readelf = args[1];
    objdump = args[2] ?? join(dirname(readelf), basename(readelf).replace(/readelf$/, "objdump"));
  } else {
    const toolchain = run("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"]).trim();
    const bin = join(toolchain, "bin");
    const assembler = process.env.ARM_NONE_EABI_AS ?? join(bin, "arm-none-eabi-as");
    readelf = process.env.ARM_NONE_EABI_READELF ?? join(bin, "arm-none-eabi-readelf");
    objdump = process.env.ARM_NONE_EABI_OBJDUMP ?? join(bin, "arm-none-eabi-objdump");
    objectPath = join(temporaryDirectory, "arm_runtime_helpers_68.o");
    run(assembler, ["-march=armv6k", "-mcpu=mpcore", "-mfpu=vfpv2", "-o", objectPath, sourcePath]);
  }
  const instructions = validateObject(objectPath, readelf, objdump);
  console.log(`arm-runtime-helpers-68: validated 24 functions (3596 bytes, ${instructions} instructions), local branches, zero calls/relocations/adjacent data`);
  console.log(`source sha256 ${digest}`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
