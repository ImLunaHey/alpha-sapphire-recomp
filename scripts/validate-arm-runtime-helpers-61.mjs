#!/usr/bin/env node

import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const maxBuffer = 16 * 1024 * 1024;
const configPath = join(root, "config", "arm-runtime-helpers-61.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = join(root, config.source);
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  console.error("arm runtime helpers 61 validation failed: " + message);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message ?? result.stderr.trim() ?? result.stdout.trim();
    fail(command + " failed: " + detail);
  }
  return result.stdout;
}

function findFile(directory, basename) {
  for (const entry of readdirSync(directory)) {
    const candidate = join(directory, entry);
    const info = statSync(candidate);
    if (info.isDirectory()) {
      const nested = findFile(candidate, basename);
      if (nested) return nested;
    } else if (entry === basename) {
      return candidate;
    }
  }
  return undefined;
}

function toolchainTools() {
  const output = run("nix", [
    "build",
    "--no-link",
    "--print-out-paths",
    "nixpkgs#gcc-arm-embedded",
  ]);
  const roots = output.trim().split(/\s+/).filter(Boolean);
  for (const toolchainRoot of roots) {
    const compiler = findFile(toolchainRoot, "arm-none-eabi-gcc");
    const readelf = findFile(toolchainRoot, "arm-none-eabi-readelf");
    if (compiler && readelf) return { compiler, readelf };
  }
  fail("GNU Arm compiler tools were not found");
}

if (config.schemaVersion !== 1 || config.mode !== "arm") {
  fail("configuration must use schema version 1 and ARM mode");
}
if (config.totalBodySize !== 3592 || config.totalAdjacentSize !== 0) {
  fail("configuration totals do not match the approved batch boundary");
}
if (!Array.isArray(config.functions) || config.functions.length !== 6) {
  fail("configuration must describe six functions");
}

let configuredTotal = 0;
const expectedNames = new Set();
for (const entry of config.functions) {
  if (!entry.name || !Number.isInteger(entry.size) || entry.size <= 0) {
    fail("every function needs a name and positive integer size");
  }
  if (expectedNames.has(entry.name)) fail("duplicate configured function " + entry.name);
  expectedNames.add(entry.name);
  configuredTotal += entry.size;
  if (!Array.isArray(entry.calls) || entry.calls.length !== 0) {
    fail(entry.name + " must remain call-free");
  }
  if (!Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail(entry.name + " must not own adjacent data");
  }
}
if (configuredTotal !== config.totalBodySize) {
  fail("configured function sizes do not add up to totalBodySize");
}

const sectionDeclarations = [...source.matchAll(/^\.section\s+\.text\.([A-Za-z0-9_]+),"ax",%progbits$/gm)];
if (sectionDeclarations.length !== config.functions.length) {
  fail("source does not have exactly one executable section per configured function");
}

for (const entry of config.functions) {
  const bodyMatch = source.match(
    new RegExp(
      "^\\.section \\.text\\." + entry.name +
        ",\"ax\",%progbits\\n[\\s\\S]*?^" + entry.name +
        ":\\n([\\s\\S]*?)^\\.size " + entry.name + ", \\.-" + entry.name + "$",
      "m",
    ),
  );
  if (!bodyMatch) fail("missing or malformed source body for " + entry.name);
  const body = bodyMatch[1];
  const instructionLines = body
    .split("\n")
    .filter((line) => /^\s+[A-Za-z]/.test(line));
  if (instructionLines.length * 4 !== entry.size) {
    fail(
      entry.name + " source schedule is " + instructionLines.length * 4 +
        " bytes, expected " + entry.size,
    );
  }

  for (const line of instructionLines) {
    const trimmed = line.trim();
    const mnemonic = trimmed.split(/\s+/, 1)[0];
    if (/^blx?$/.test(mnemonic)) fail(entry.name + " contains a call instruction");
    if (/^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(mnemonic)) {
      const target = trimmed.slice(mnemonic.length).trim();
      if (!target.startsWith(".L" + entry.name + "_")) {
        fail(entry.name + " has an out-of-body direct branch: " + trimmed);
      }
    }
  }
}

const pcAccesses = config.pcRelativeDataAccesses;
if (
  !Array.isArray(pcAccesses) ||
  pcAccesses.length !== 1 ||
  pcAccesses[0].function !== "func_00195248" ||
  pcAccesses[0].baseLabel !== ".Lfunc_00195248_248" ||
  pcAccesses[0].ownedAdjacentBytes !== 0
) {
  fail("PC-relative byte-table metadata does not match the approved symbolic access");
}
if (!/^\.Lfunc_00195248_20:\n\s+add\s+r6, pc, #544$/m.test(source)) {
  fail("func_00195248 does not retain its instruction-relative lookup-base calculation");
}

let objectPath = process.argv[2] ? resolve(process.argv[2]) : undefined;
let readelfPath = process.argv[3] ? resolve(process.argv[3]) : undefined;
let scratch;
try {
  if (!objectPath) {
    const tools = toolchainTools();
    scratch = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-61-"));
    objectPath = join(scratch, "arm_runtime_helpers_61.o");
    readelfPath = tools.readelf;
    run(tools.compiler, [
      "-march=armv6k",
      "-mcpu=mpcore",
      "-marm",
      "-mfloat-abi=soft",
      "-ffreestanding",
      "-fno-pic",
      "-fno-pie",
      "-Wa,--noexecstack",
      "-x",
      "assembler-with-cpp",
      "-c",
      sourcePath,
      "-o",
      objectPath,
    ]);
  } else {
    if (!existsSync(objectPath)) fail("object does not exist: " + objectPath);
    readelfPath ??= "readelf";
  }

  const sectionsText = run(readelfPath, ["-SW", objectPath]);
  const symbolsText = run(readelfPath, ["-Ws", objectPath]);
  const relocationsText = run(readelfPath, ["-rW", objectPath]);

  const sections = new Map();
  for (const line of sectionsText.split("\n")) {
    const match = line.match(
      /^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)/,
    );
    if (match) {
      sections.set(match[2], {
        index: match[1],
        size: Number.parseInt(match[3], 16),
      });
    }
  }

  const symbols = new Map();
  for (const line of symbolsText.split("\n")) {
    const match = line.match(
      /^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+FUNC\s+GLOBAL\s+\S+\s+(\S+)\s+(\S+)\s*$/,
    );
    if (match) {
      symbols.set(match[4], {
        value: Number.parseInt(match[1], 16),
        size: Number.parseInt(match[2], 10),
        sectionIndex: match[3],
      });
    }
  }

  for (const entry of config.functions) {
    const sectionName = ".text." + entry.name;
    const section = sections.get(sectionName);
    if (!section) fail("object is missing section " + sectionName);
    if (section.size !== entry.size) {
      fail(sectionName + " is " + section.size + " bytes, expected " + entry.size);
    }
    const symbol = symbols.get(entry.name);
    if (!symbol) fail("object is missing global function symbol " + entry.name);
    if (symbol.size !== entry.size) {
      fail(entry.name + " symbol is " + symbol.size + " bytes, expected " + entry.size);
    }
    if (symbol.sectionIndex !== section.index) {
      fail(entry.name + " is not defined in " + sectionName);
    }
    if ((symbol.value & 1) !== 0) fail(entry.name + " is not an ARM-state symbol");
    if (
      relocationsText.includes(".rel" + sectionName) ||
      relocationsText.includes(".rela" + sectionName)
    ) {
      fail(entry.name + " emitted a relocation");
    }
  }

  console.log(
    "Validated " + config.functions.length + " ARM runtime helpers (" +
      config.totalBodySize + " body bytes, zero adjacent bytes and zero relocations).",
  );
} finally {
  if (scratch) rmSync(scratch, { recursive: true, force: true });
}
