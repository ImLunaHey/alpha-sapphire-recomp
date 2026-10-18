import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { armReadelf } from "./arm-readelf.mjs";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-runtime-helpers-51.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sourcePath = join(root, manifest.source);
const objectPath = process.argv[2] ??
  join(root, "build/AS_EUR_REV2/base/objects/main/arm_runtime_helpers_51.o");
const readelf = process.argv[3] ?? armReadelf();
const maxBuffer = 16 * 1024 * 1024;

function fail(message) {
  throw new Error(`ARM runtime helper batch 51 validation failed: ${message}`);
}

function runReadelf(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer });
  if (result.error) fail(`${readelf} could not run: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${readelf} ${args.join(" ")} exited with status ${result.status}: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" ||
    manifest.totalBodySize !== 1168 || !Array.isArray(manifest.functions) ||
    manifest.functions.length !== 15 || !existsSync(sourcePath)) {
  fail("unexpected manifest shape or missing source");
}
if (!existsSync(objectPath)) fail(`object does not exist: ${objectPath}`);

const names = new Set();
let totalSize = 0;
for (const entry of manifest.functions) {
  if (!/^func_[0-9A-F]{8}$/.test(entry?.name) || !Number.isInteger(entry.size) ||
      entry.size <= 0 || entry.size % 4 !== 0 || names.has(entry.name) ||
      !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail("invalid function manifest entry");
  }
  names.add(entry.name);
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize) fail("manifest body-size total mismatch");
if (Object.keys(manifest.symbolicIdentities ?? {}).length !== 0 ||
    Object.keys(manifest.symbolicSlots ?? {}).length !== 0) {
  fail("zero-relocation batch unexpectedly has symbolic identities or slots");
}

const source = readFileSync(sourcePath, "utf8");
const definitions = [...source.matchAll(/^function\s+(func_[0-9A-F]{8})\s*$/gm)].map((match) => match[1]);
const endings = [...source.matchAll(/^endfunction\s+(func_[0-9A-F]{8})\s*$/gm)].map((match) => match[1]);
if (definitions.length !== names.size || new Set(definitions).size !== names.size ||
    definitions.some((name) => !names.has(name)) ||
    endings.length !== definitions.length || endings.some((name, index) => name !== definitions[index])) {
  fail("manifest/source function parity mismatch");
}

const sectionText = runReadelf(["--sections", "--wide", objectPath]);
const symbolText = runReadelf(["--symbols", "--wide", objectPath]);
const relocationText = runReadelf(["--relocs", "--wide", objectPath]);

const sections = new Map();
for (const line of sectionText.split(/\r?\n/)) {
  const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+([A-Z]*)\s+/);
  if (match) sections.set(match[2], { index: Number(match[1]), size: Number.parseInt(match[3], 16), flags: match[4] });
}

const symbols = [];
for (const line of symbolText.split(/\r?\n/)) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)$/);
  if (match) {
    symbols.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], ndx: match[6], name: match[7].trim() });
  }
}

const functions = new Map();
for (const entry of manifest.functions) {
  const sectionName = `.text.${entry.name}`;
  const section = sections.get(sectionName);
  if (!section || section.size !== entry.size || !section.flags.includes("A") || !section.flags.includes("X")) {
    fail(`${entry.name} section is missing, non-executable, or has the wrong size`);
  }
  const matches = symbols.filter((symbol) => symbol.name === entry.name);
  if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" ||
      matches[0].size !== entry.size || Number(matches[0].ndx) !== section.index || matches[0].value !== 0) {
    fail(`${entry.name} symbol metadata mismatch`);
  }
  const mapping = symbols.filter((symbol) => symbol.name === "$a" && Number(symbol.ndx) === section.index);
  if (!mapping.some((symbol) => symbol.value === 0)) fail(`${entry.name} lacks an ARM mapping symbol at offset zero`);
  functions.set(entry.name, { section: sectionName, value: matches[0].value, size: matches[0].size });
}

let relocationSection = null;
for (const line of relocationText.split(/\r?\n/)) {
  const header = line.match(/^Relocation section '(\.rela?\..+)'/);
  if (header) {
    relocationSection = header[1].replace(/^\.rela?/, "");
    continue;
  }
  const relocation = line.match(/^\s*([0-9a-fA-F]+)\s+/);
  if (!relocation || !relocationSection) continue;
  const offset = Number.parseInt(relocation[1], 16);
  for (const [name, fn] of functions) {
    if (fn.section === relocationSection && offset >= fn.value && offset < fn.value + fn.size) {
      fail(`object contains a relocation inside ${name}`);
    }
  }
}

console.log(`Validated ${manifest.functions.length} ARM runtime helpers (${totalSize} bytes, zero relocations, zero adjacent words).`);
