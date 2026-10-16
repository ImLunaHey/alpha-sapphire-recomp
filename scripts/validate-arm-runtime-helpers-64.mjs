#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_BUFFER = 16 * 1024 * 1024;
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const configPath = resolve(repoRoot, "config/arm-runtime-helpers-64.json");

function fail(message) {
  throw new Error(message);
}

function run(tool, args) {
  const result = spawnSync(tool, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });

  if (result.error) {
    fail(`unable to run ${tool}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    fail(`${tool} exited with status ${result.status}${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout;
}

function parseSections(output) {
  const sections = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s/);
    if (match) sections.set(match[1], Number.parseInt(match[2], 16));
  }
  return sections;
}

function parseSymbols(output) {
  const symbols = new Map();
  for (const line of output.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 8 && /^\d+:$/.test(fields[0])) {
      symbols.set(fields.slice(7).join(" "), {
        size: Number.parseInt(fields[2], 10),
        type: fields[3],
        bind: fields[4],
        sectionIndex: fields[6],
      });
    }
  }
  return symbols;
}

const config = JSON.parse(await readFile(configPath, "utf8"));
const sourcePath = resolve(repoRoot, config.source);
const source = await readFile(sourcePath);
const sourceHash = createHash("sha256").update(source).digest("hex");

if (sourceHash !== config.sourceSha256) {
  fail(`source hash mismatch: expected ${config.sourceSha256}, got ${sourceHash}`);
}
if (config.mode !== "arm") fail(`unexpected mode ${JSON.stringify(config.mode)}`);
if (config.totalAdjacentSize !== 0) fail("batch 64 must have zero adjacent data");
if (config.pcRelativeDataAccesses?.length !== 0) fail("batch 64 must not declare PC-relative data accesses");
if (config.functions.some((fn) => fn.calls.length !== 0 || fn.adjacentWords.length !== 0)) {
  fail("batch 64 functions must be call-free and have no adjacent words");
}

const configuredTotal = config.functions.reduce((sum, fn) => sum + fn.size, 0);
if (configuredTotal !== config.totalBodySize) {
  fail(`configured function sizes total ${configuredTotal}, expected ${config.totalBodySize}`);
}

const [externalObjectPath, externalReadelf] = process.argv.slice(2);
const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "arm-runtime-helpers-64-"));
const objectPath = externalObjectPath ? resolve(externalObjectPath) :
  resolve(temporaryDirectory, "arm_runtime_helpers_64.o");

try {
  let assembler = process.env.ARM_NONE_EABI_AS;
  let readelf = externalReadelf || process.env.ARM_NONE_EABI_READELF;
  if (!externalObjectPath && (!assembler || !readelf)) {
    const toolchain = run("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"]).trim();
    assembler ||= resolve(toolchain, "bin/arm-none-eabi-as");
    readelf ||= resolve(toolchain, "bin/arm-none-eabi-readelf");
  }
  readelf ||= "arm-none-eabi-readelf";

  if (!externalObjectPath) {
    run(assembler, ["-march=armv6k", "-mcpu=mpcore", "-o", objectPath, sourcePath]);
  }

  const header = run(readelf, ["-hW", objectPath]);
  if (!/^\s*Class:\s+ELF32\s*$/m.test(header)) fail("assembled object is not ELF32");
  if (!/^\s*Data:\s+2's complement, little endian\s*$/m.test(header)) fail("assembled object is not little-endian");
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("assembled object is not ARM");

  const sectionOutput = run(readelf, ["-SW", objectPath]);
  const sections = parseSections(sectionOutput);

  const symbolOutput = run(readelf, ["-sW", objectPath]);
  const symbols = parseSymbols(symbolOutput);
  let assembledTotal = 0;

  for (const fn of config.functions) {
    const symbol = symbols.get(fn.name);
    if (!symbol) fail(`missing function symbol ${fn.name}`);
    if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.sectionIndex === "UND") {
      fail(`${fn.name} is not a defined global function`);
    }
    if (symbol.size !== fn.size) {
      fail(`${fn.name} has size ${symbol.size}, expected ${fn.size}`);
    }

    const sectionName = `.text.${fn.name}`;
    const sectionSize = sections.get(sectionName);
    if (sectionSize === undefined) fail(`missing section ${sectionName}`);
    if (sectionSize !== fn.size) {
      fail(`${sectionName} has size ${sectionSize}, expected ${fn.size}`);
    }
    assembledTotal += sectionSize;
  }

  if (assembledTotal !== config.totalBodySize) {
    fail(`assembled function sizes total ${assembledTotal}, expected ${config.totalBodySize}`);
  }

  const relocations = run(readelf, ["-rW", objectPath]);
  for (const fn of config.functions) {
    if (new RegExp(`Relocation section '\\.rela?\\.text\\.${fn.name}'`).test(relocations)) {
      fail(`${fn.name} is not relocation-free`);
    }
  }

  console.log(`validated ${config.functions.length} ARM functions (${assembledTotal} bytes, zero relocations)`);
  console.log(`source sha256 ${sourceHash}`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
