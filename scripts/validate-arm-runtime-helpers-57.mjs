import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-runtime-helpers-57.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sourcePath = join(root, manifest.source);
const standaloneObject = process.argv[2] === undefined;
const objectPath = process.argv[2] ??
  join(root, "build/AS_EUR_REV2/base/objects/main/arm_runtime_helpers_57.o");
const readelf = process.argv[3] ?? "readelf";
const maxBuffer = 16 * 1024 * 1024;
const expectedFunctions = [
  ["func_005225C4", 1384, "10ba547a6e6b998c71aa7e953d2e97a48143e4fbee193cea35e28a0dcc77af6d"],
  ["func_002BA030", 1120, "664558fab4e780a81c43c826429afd714899b06e50146a2c6effa6a9b3f77fb0"],
  ["func_0038811C", 952, "4066b52fb226479e232fc55b58ba1a624eb37c874efad0cf5d830cadfbf2c9a4"],
  ["func_004BA018", 912, "a2b685522fe5f3548542abefa3493c81e33071fadb029e0c6042972aa88b4912"],
];
const expectedHashes = new Map(expectedFunctions.map(([name, , hash]) => [name, hash]));

function fail(message) {
  throw new Error(`ARM runtime helper batch 57 validation failed: ${message}`);
}

function runReadelf(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer });
  if (result.error) fail(`${readelf} could not run: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${readelf} ${args.join(" ")} exited with status ${result.status}: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

if (process.argv.length === 3 || process.argv.length > 4) {
  fail("usage: validate-arm-runtime-helpers-57.mjs [object readelf]");
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_runtime_helpers_57.S" ||
    manifest.totalBodySize !== 4368 || !Array.isArray(manifest.functions) ||
    manifest.functions.length !== expectedFunctions.length || !existsSync(sourcePath) ||
    manifest.functions.some((entry, index) =>
      entry?.name !== expectedFunctions[index][0] || entry?.size !== expectedFunctions[index][1])) {
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
const identity = manifest.identityClasses?.call_free_runtime_helpers_57;
if (JSON.stringify(identity?.members) !== JSON.stringify(expectedFunctions.map(([name]) => name)) ||
    JSON.stringify(identity?.parameters) !== JSON.stringify([
      "controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule", "resultMaterialization",
    ]) || Object.keys(manifest.identityClasses ?? {}).length !== 1) {
  fail("unexpected identity-class manifest shape");
}
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
  if (!section || !section.flags.includes("A") || !section.flags.includes("X")) {
    fail(`${entry.name} section is missing or non-executable`);
  }
  const matches = symbols.filter((symbol) => symbol.name === entry.name);
  if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" ||
      matches[0].size !== entry.size || Number(matches[0].ndx) !== section.index ||
      matches[0].value + matches[0].size > section.size ||
      (standaloneObject && (matches[0].value !== 0 || section.size !== entry.size))) {
    fail(`${entry.name} symbol metadata or section range mismatch`);
  }
  const mapping = symbols.filter((symbol) => symbol.name === "$a" && Number(symbol.ndx) === section.index);
  if (!mapping.some((symbol) => symbol.value <= matches[0].value)) {
    fail(`${entry.name} lacks an ARM mapping symbol covering its range`);
  }

  const hexText = runReadelf(["--hex-dump", sectionName, objectPath]);
  const hexWords = [];
  for (const line of hexText.split(/\r?\n/)) {
    const fields = line.trim().split(/\s+/);
    if (!/^0x[0-9a-fA-F]+$/.test(fields[0] ?? "")) continue;
    for (const field of fields.slice(1)) {
      if (!/^[0-9a-fA-F]{8}$/.test(field)) break;
      hexWords.push(field);
    }
  }
  const sectionBytes = Buffer.from(hexWords.join(""), "hex");
  if (sectionBytes.length !== section.size) fail(`${entry.name} section hex dump size mismatch`);
  const body = sectionBytes.subarray(matches[0].value, matches[0].value + matches[0].size);
  const digest = createHash("sha256").update(body).digest("hex");
  if (digest !== expectedHashes.get(entry.name)) {
    fail(`${entry.name} instruction schedule hash mismatch`);
  }

  functions.set(entry.name, {
    section: sectionName,
    start: matches[0].value,
    end: matches[0].value + matches[0].size,
  });
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
    if (fn.section === relocationSection && offset >= fn.start && offset < fn.end) {
      fail(`object contains a relocation inside ${name}`);
    }
  }
}

console.log(`Validated ${manifest.functions.length} ARM runtime helpers (${totalSize} bytes, zero relocations, zero adjacent words).`);
