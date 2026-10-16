#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config/arm-runtime-helpers-50.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sourcePath = join(root, manifest.source);
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  console.error(`arm runtime helpers 50: ${message}`);
  process.exit(1);
}

function run(tool, args) {
  const result = spawnSync(tool, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    fail(`${basename(tool)} ${args.join(" ")} failed: ${result.error?.message ?? result.stderr.trim()}`);
  }
  return result.stdout;
}

function validateManifestAndSource() {
  if (manifest.schemaVersion !== 1 || manifest.mode !== "arm") fail("invalid manifest header");
  if (manifest.source !== "src/main/arm_runtime_helpers_50.S") fail("unexpected source path");
  if (!Array.isArray(manifest.functions) || manifest.functions.length !== 23) fail("expected 23 functions");
  if (manifest.functions.reduce((sum, fn) => sum + fn.size, 0) !== manifest.totalBodySize || manifest.totalBodySize !== 1128) {
    fail("function sizes do not total 1128 bytes");
  }
  if (Object.keys(manifest.symbolicIdentities ?? {}).length || Object.keys(manifest.symbolicSlots ?? {}).length) {
    fail("batch must not define symbolic data");
  }
  for (const fn of manifest.functions) {
    if (!/^func_[0-9A-F]{8}$/.test(fn.name) || fn.size <= 0 || fn.size % 4 !== 0) fail(`invalid entry for ${fn.name}`);
    if (fn.calls?.length || fn.adjacentWords?.length) fail(`${fn.name} must be call-free and have no adjacent words`);
  }

  for (const directive of [".syntax unified", ".arch armv6k", ".fpu vfpv2", ".arm"]) {
    if (!source.includes(directive)) fail(`missing ${directive}`);
  }
  if (/^\s*\.(?:word|long|quad|ltorg|pool)\b/m.test(source) || /(?:^|\s)(?:bl|blx)\s+/m.test(source) || /=\s*[^,\]]/.test(source)) {
    fail("source contains a call, literal pool, or data word");
  }

  const labels = [...source.matchAll(/^([A-Za-z_][A-Za-z0-9_]*):\s*$/gm)].map((match) => match[1]);
  const expected = manifest.functions.map((fn) => fn.name);
  if (labels.length !== expected.length || labels.some((label, index) => label !== expected[index])) {
    fail("source function order does not match the manifest");
  }
  for (let index = 0; index < expected.length; index += 1) {
    const fn = manifest.functions[index];
    const begin = source.indexOf(`${fn.name}:`);
    const end = index + 1 < expected.length ? source.indexOf(`${expected[index + 1]}:`, begin) : source.length;
    const body = source.slice(begin + fn.name.length + 1, end);
    const instructions = body.split(/\r?\n/).map((line) => line.replace(/@.*$/, "").trim())
      .filter((line) => line && !line.startsWith(".") && !/^\d+:$/.test(line))
      .map((line) => line.replace(/^\d+:\s*/, ""));
    if (instructions.length * 4 !== fn.size) fail(`${fn.name} has ${instructions.length * 4} instruction bytes, expected ${fn.size}`);
    for (const directive of [`.global ${fn.name}`, `.type ${fn.name}, %function`, `.size ${fn.name}, .-${fn.name}`]) {
      if (!source.includes(directive)) fail(`${fn.name} is missing ${directive}`);
    }
  }
}

function parseSections(text) {
  const sections = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)/);
    if (match) sections.set(match[1], match[2]);
  }
  return sections;
}

function parseSymbols(text) {
  const symbols = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(\S+)\s*$/);
    if (!match) continue;
    const [, value, size, type, bind, sectionIndex, name] = match;
    if (!symbols.has(name)) symbols.set(name, []);
    symbols.get(name).push({ value: Number.parseInt(value, 16), size: Number(size), type, bind, sectionIndex });
  }
  return symbols;
}

function inspectObject(objectPath, readelf, work, prefix) {
  const sections = parseSections(run(readelf, ["-SW", objectPath]));
  const symbols = parseSymbols(run(readelf, ["-sW", objectPath]));
  const functions = new Map();
  for (const fn of manifest.functions) {
    const entries = symbols.get(fn.name) ?? [];
    if (entries.length !== 1) fail(`${prefix}: expected one symbol for ${fn.name}, found ${entries.length}`);
    const symbol = entries[0];
    if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.size !== fn.size || (symbol.value & 1) !== 0) {
      fail(`${prefix}: invalid ARM function symbol ${fn.name}`);
    }
    const section = sections.get(symbol.sectionIndex);
    if (!section) fail(`${prefix}: ${fn.name} has no concrete section`);
    functions.set(fn.name, { ...symbol, section });
  }

  const relocationText = run(readelf, ["-rW", objectPath]);
  let relocationSection = null;
  for (const line of relocationText.split(/\r?\n/)) {
    const header = line.match(/^Relocation section '(\.rela?\..+)'/);
    if (header) {
      relocationSection = header[1].replace(/^\.rela?/, "");
      continue;
    }
    const entry = line.match(/^\s*([0-9a-fA-F]+)\s+/);
    if (!entry || !relocationSection) continue;
    const offset = Number.parseInt(entry[1], 16);
    for (const [name, fn] of functions) {
      if (fn.section === relocationSection && offset >= fn.value && offset < fn.value + fn.size) {
        fail(`${prefix}: relocation inside ${name}`);
      }
    }
  }

  const objcopy = join(dirname(readelf), basename(readelf).replace(/readelf$/, "objcopy"));
  const buffers = new Map();
  for (const section of new Set([...functions.values()].map((fn) => fn.section))) {
    const output = join(work, `${prefix}-${buffers.size}.bin`);
    run(objcopy, ["--dump-section", `${section}=${output}`, objectPath]);
    buffers.set(section, readFileSync(output));
  }
  return { functions, buffers };
}

function compareObjects(candidatePath, readelf) {
  const work = mkdtempSync(join(tmpdir(), "runtime-helpers-50-"));
  try {
    const compiler = join(dirname(readelf), basename(readelf).replace(/readelf$/, "gcc"));
    const referencePath = join(work, "reference.o");
    run(compiler, [
      "-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding",
      "-fno-pic", "-fno-pie", "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c",
      sourcePath, "-o", referencePath,
    ]);
    const reference = inspectObject(referencePath, readelf, work, "reference");
    const candidate = inspectObject(candidatePath, readelf, work, "candidate");
    for (const fn of manifest.functions) {
      const left = reference.functions.get(fn.name);
      const right = candidate.functions.get(fn.name);
      const leftBytes = reference.buffers.get(left.section).subarray(left.value, left.value + left.size);
      const rightBytes = candidate.buffers.get(right.section).subarray(right.value, right.value + right.size);
      if (leftBytes.length !== fn.size || rightBytes.length !== fn.size || !leftBytes.equals(rightBytes)) {
        fail(`candidate: instruction bytes differ for ${fn.name}`);
      }
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

validateManifestAndSource();
if (process.argv.length === 3 || process.argv.length > 4) fail("usage: validate-arm-runtime-helpers-50.mjs [object readelf]");
if (process.argv.length === 4) compareObjects(resolve(process.argv[2]), resolve(process.argv[3]));
console.log(`Validated ${manifest.functions.length} ARM runtime helpers (${manifest.totalBodySize} bytes) for batch 50.`);
