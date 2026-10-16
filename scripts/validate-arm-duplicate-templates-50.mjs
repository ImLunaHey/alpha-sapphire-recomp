#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config/arm-duplicate-templates-50.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function fail(message) {
  console.error(`duplicate templates 50: ${message}`);
  process.exit(1);
}

function run(program, args) {
  try {
    return execFileSync(program, args, {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    fail(`${program} failed: ${detail}`);
  }
}

function discoverTools() {
  const storePath = run("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"]).trim();
  const bin = join(storePath, "bin");
  return {
    assembler: join(bin, "arm-none-eabi-as"),
    readelf: join(bin, "arm-none-eabi-readelf"),
    objdump: join(bin, "arm-none-eabi-objdump"),
  };
}

let temporaryDirectory;
let objectPath = process.argv[2] ? resolve(process.argv[2]) : undefined;
let readelf = process.argv[3] ? resolve(process.argv[3]) : undefined;
let objdump;

if (readelf) {
  objdump = join(dirname(readelf), "arm-none-eabi-objdump");
}

if (!objectPath) {
  const tools = discoverTools();
  temporaryDirectory = mkdtempSync(join(tmpdir(), "dt50-"));
  objectPath = join(temporaryDirectory, "arm_duplicate_templates_50.o");
  readelf = tools.readelf;
  objdump = tools.objdump;
  run(tools.assembler, ["-o", objectPath, join(root, manifest.source)]);
} else if (!readelf) {
  const tools = discoverTools();
  readelf = tools.readelf;
  objdump = tools.objdump;
}

try {
  const template = manifest.templates.intrusive_red_black_tree_erase;
  if (manifest.mode !== "arm" || manifest.relocations.length !== 0) {
    fail("manifest must describe a relocation-free ARM batch");
  }
  if (manifest.functions.length !== template.count) {
    fail(`manifest count mismatch: expected ${template.count}, found ${manifest.functions.length}`);
  }
  if (manifest.expectedBodyBytes !== template.bodySize * template.count) {
    fail("manifest total body size is inconsistent");
  }

  const symbolsText = run(readelf, ["-sW", objectPath]);
  const symbols = new Map();
  for (const line of symbolsText.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+FUNC\s+GLOBAL\s+DEFAULT\s+(\d+)\s+(\S+)$/);
    if (match) symbols.set(match[4], { value: Number.parseInt(match[1], 16), size: Number(match[2]), sectionIndex: Number(match[3]) });
  }

  const sectionsText = run(readelf, ["-SW", objectPath]);
  const sectionNames = new Map();
  for (const line of sectionsText.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)/);
    if (match) sectionNames.set(Number(match[1]), match[2]);
  }

  const relocationText = run(readelf, ["-rW", objectPath]);
  const relocationOffsets = new Map();
  let relocationTarget;
  for (const line of relocationText.split("\n")) {
    const header = line.match(/^Relocation section '\.rela?(\S+)'/);
    if (header) {
      relocationTarget = header[1];
      if (!relocationOffsets.has(relocationTarget)) relocationOffsets.set(relocationTarget, []);
      continue;
    }
    const entry = line.match(/^\s*([0-9a-fA-F]+)\s+/);
    if (relocationTarget && entry) {
      relocationOffsets.get(relocationTarget).push(Number.parseInt(entry[1], 16));
    }
  }
  const bodies = [];
  for (const entry of manifest.functions) {
    const symbol = symbols.get(entry.name);
    if (!symbol) fail(`missing function symbol ${entry.name}`);
    if (symbol.size !== template.bodySize) {
      fail(`${entry.name} has size ${symbol.size}, expected ${template.bodySize}`);
    }
    const section = sectionNames.get(symbol.sectionIndex);
    if (!section) fail(`could not resolve the section for ${entry.name}`);
    const nextGlobal = symbols.get(entry.nextGlobal);
    if (
      nextGlobal &&
      nextGlobal.sectionIndex === symbol.sectionIndex &&
      nextGlobal.value !== symbol.value + symbol.size
    ) {
      fail(`${entry.nextGlobal} does not begin immediately after ${entry.name}`);
    }
    if ((relocationOffsets.get(section) ?? []).some(
      (offset) => offset >= symbol.value && offset < symbol.value + symbol.size,
    )) {
      fail(`${entry.name} unexpectedly has relocations`);
    }

    const dump = run(objdump, ["-s", "-j", section, objectPath]);
    const bytes = [];
    for (const line of dump.split("\n")) {
      const match = line.match(/^\s*[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
      if (!match) continue;
      for (const word of match[1].trim().split(/\s+/)) {
        for (let index = 0; index < word.length; index += 2) bytes.push(Number.parseInt(word.slice(index, index + 2), 16));
      }
    }
    const body = Buffer.from(bytes).subarray(symbol.value, symbol.value + symbol.size);
    if (body.length !== template.bodySize) fail(`could not read the complete body of ${entry.name}`);
    bodies.push(body);

    const disassembly = run(objdump, ["-d", "-j", section, objectPath]);
    const instructions = [];
    const branchTargets = new Set();
    for (const line of disassembly.split("\n")) {
      const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)\s*(.*)$/);
      if (!match) continue;
      const address = Number.parseInt(match[1], 16);
      if (address < symbol.value || address >= symbol.value + symbol.size) continue;
      instructions.push(address);
      const mnemonic = match[2];
      if (/^blx?$/.test(mnemonic)) fail(`${entry.name} unexpectedly contains a direct call`);
      if (/^b(?!x)[a-z]*$/.test(mnemonic)) {
        const targetMatch = match[3].match(/^([0-9a-fA-F]+)/);
        if (!targetMatch) fail(`could not parse a branch target in ${entry.name}`);
        const target = Number.parseInt(targetMatch[1], 16);
        if (target < symbol.value || target >= symbol.value + symbol.size) {
          fail(`${entry.name} has a non-local branch`);
        }
        branchTargets.add(target - symbol.value);
      }
    }
    if (instructions.length !== template.instructionCount) {
      fail(`${entry.name} has ${instructions.length} instructions, expected ${template.instructionCount}`);
    }
    const actualOffsets = [...branchTargets].sort((a, b) => a - b);
    if (JSON.stringify(actualOffsets) !== JSON.stringify(manifest.internalLabelOffsets)) {
      fail(`${entry.name} internal branch-target offsets do not match the manifest`);
    }
  }

  for (let index = 1; index < bodies.length; index += 1) {
    if (!bodies[0].equals(bodies[index])) {
      fail(`${manifest.functions[index].name} is not byte-identical to ${manifest.functions[0].name}`);
    }
  }

  console.log(`Validated ${manifest.functions.length} duplicate-template batch 50 functions (${manifest.expectedBodyBytes} body bytes, no relocations).`);
} finally {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
}
