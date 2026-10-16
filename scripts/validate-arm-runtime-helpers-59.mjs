import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-runtime-helpers-59.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));
const sourcePath = join(root, manifest.source);
const standaloneObject = process.argv[2] === undefined;
const objectPath = process.argv[2] ??
  join(root, "build/AS_EUR_REV2/base/objects/main/arm_runtime_helpers_59.o");
const targetObject = /(^|[\\/])target([\\/])/.test(objectPath);
const readelf = process.argv[3] ?? "readelf";
const maxBuffer = 16 * 1024 * 1024;
const expectedFunctions = [
  ["func_002DB7A0", 860, "c68fac0e8ef7e3eaafd45522ebb198675d8c5266cecb34b974b585580a50ac9c", "000000000000803f"],
  ["func_00486734", 984, "0115e450e944567c812950454729f10b68a8420443fd15c8a2ec9c5d2bf66f2b", "000000000000803f"],
  ["func_0054EA0C", 936, "0deedc1a0930ef1ef304e939842f96686aeb8f90bd4889c43222c9c997a5a5b8", "8988083d00004040000000000000803f"],
  ["func_0054EDC4", 936, "2c871eb5df7b88458ba7921b1aafe1e8fecebcc080797d7ff631998928fb402b", "8988083d00004040000000000000803f"],
];
const expectedByName = new Map(expectedFunctions.map((entry) => [entry[0], entry]));

function fail(message) {
  throw new Error(`ARM runtime helper batch 59 validation failed: ${message}`);
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
  fail("usage: validate-arm-runtime-helpers-59.mjs [object readelf]");
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_runtime_helpers_59.S" ||
    manifest.totalBodySize !== 3716 || manifest.totalAdjacentSize !== 48 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length ||
    !existsSync(sourcePath) || manifest.functions.some((entry, index) =>
      entry?.name !== expectedFunctions[index][0] || entry?.size !== expectedFunctions[index][1])) {
  fail("unexpected manifest shape or missing source");
}
if (!existsSync(objectPath)) fail(`object does not exist: ${objectPath}`);
const configuredSources = sources.sources?.filter((entry) => entry?.path === manifest.source) ?? [];
if (configuredSources.length !== 1 || configuredSources[0].mode !== manifest.mode) {
  fail("source must be registered exactly once in ARM mode");
}

const expectedAdjacentWords = new Map([
  ["func_002DB7A0", [[860, "f32", "positive-zero", 0], [864, "f32", "positive-one", 1]]],
  ["func_00486734", [[984, "f32", "positive-zero", 0], [988, "f32", "positive-one", 1]]],
  ["func_0054EA0C", [[936, "f32", "one-divided-by-thirty", 1 / 30], [940, "f32", "positive-three", 3], [944, "f32", "positive-zero", 0], [948, "f32", "positive-one", 1]]],
  ["func_0054EDC4", [[936, "f32", "one-divided-by-thirty", 1 / 30], [940, "f32", "positive-three", 3], [944, "f32", "positive-zero", 0], [948, "f32", "positive-one", 1]]],
]);
const names = new Set();
let totalSize = 0;
let totalAdjacentSize = 0;
for (const entry of manifest.functions) {
  const adjacent = expectedAdjacentWords.get(entry?.name);
  const actualAdjacent = entry?.adjacentWords?.map((word) =>
    [word?.offset, word?.kind, word?.semantic, word?.value]);
  if (!/^func_[0-9A-F]{8}$/.test(entry?.name) || !Number.isInteger(entry.size) ||
      entry.size <= 0 || entry.size % 4 !== 0 || names.has(entry.name) ||
      !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      JSON.stringify(actualAdjacent) !== JSON.stringify(adjacent)) {
    fail("invalid function manifest entry");
  }
  names.add(entry.name);
  totalSize += entry.size;
  totalAdjacentSize += entry.adjacentWords.length * 4;
}
if (totalSize !== manifest.totalBodySize || totalAdjacentSize !== manifest.totalAdjacentSize) {
  fail("manifest size total mismatch");
}
const identity = manifest.identityClasses?.call_free_vfp_runtime_helpers_59;
if (JSON.stringify(identity?.members) !== JSON.stringify(expectedFunctions.map(([name]) => name)) ||
    JSON.stringify(identity?.parameters) !== JSON.stringify([
      "controlFlowSchedule", "memoryAccessSchedule", "vfpOperationSchedule", "publicLiteralSchedule",
    ]) || Object.keys(manifest.identityClasses ?? {}).length !== 1) {
  fail("unexpected identity-class manifest shape");
}
if (Object.keys(manifest.symbolicIdentities ?? {}).length !== 0 ||
    Object.keys(manifest.symbolicSlots ?? {}).length !== 0) {
  fail("zero-relocation batch unexpectedly has symbolic identities or slots");
}

const source = readFileSync(sourcePath, "utf8");
const definitions = [...source.matchAll(/^\.global\s+(func_[0-9A-F]{8})\s*$/gm)].map((match) => match[1]);
const labels = [...source.matchAll(/^(func_[0-9A-F]{8}):\s*$/gm)].map((match) => match[1]);
const endings = [...source.matchAll(/^\.size\s+(func_[0-9A-F]{8}),\s*\.-\1\s*$/gm)].map((match) => match[1]);
if (definitions.length !== names.size || new Set(definitions).size !== names.size ||
    definitions.some((name) => !names.has(name)) ||
    JSON.stringify(labels) !== JSON.stringify(definitions) ||
    JSON.stringify(endings) !== JSON.stringify(definitions)) {
  fail("manifest/source function parity mismatch");
}

const sectionText = runReadelf(["--sections", "--wide", objectPath]);
const symbolText = runReadelf(["--symbols", "--wide", objectPath]);
const relocationText = runReadelf(["--relocs", "--wide", objectPath]);

const sections = new Map();
for (const line of sectionText.split(/\r?\n/)) {
  const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+([A-Z]*)\s+/);
  if (match) sections.set(match[2], {
    index: Number(match[1]), size: Number.parseInt(match[3], 16), flags: match[4],
  });
}

const symbols = [];
for (const line of symbolText.split(/\r?\n/)) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)$/);
  if (match) symbols.push({
    value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3],
    bind: match[4], ndx: match[6], name: match[7].trim(),
  });
}

const functions = new Map();
for (const entry of manifest.functions) {
  const sectionName = `.text.${entry.name}`;
  const section = sections.get(sectionName);
  const [, expectedSize, expectedHash, adjacentHex] = expectedByName.get(entry.name);
  const adjacentSize = adjacentHex.length / 2;
  if (!section || !section.flags.includes("A") || !section.flags.includes("X")) {
    fail(`${entry.name} section is missing or non-executable`);
  }
  const matches = symbols.filter((symbol) => symbol.name === entry.name);
  const requiredSize = expectedSize + (targetObject ? 0 : adjacentSize);
  if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" ||
      matches[0].size !== expectedSize || Number(matches[0].ndx) !== section.index ||
      matches[0].value + requiredSize > section.size ||
      (standaloneObject && (matches[0].value !== 0 || section.size !== expectedSize + adjacentSize))) {
    fail(`${entry.name} symbol metadata, adjacent range, or section size mismatch`);
  }
  const mappings = symbols.filter((symbol) => Number(symbol.ndx) === section.index);
  if (!mappings.some((symbol) => symbol.name === "$a" && symbol.value <= matches[0].value) ||
      (!targetObject && !mappings.some((symbol) =>
        symbol.name === "$d" && symbol.value === matches[0].value + expectedSize))) {
    fail(`${entry.name} lacks exact ARM/data mapping symbols`);
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
  const start = matches[0].value;
  const body = sectionBytes.subarray(start, start + expectedSize);
  if (createHash("sha256").update(body).digest("hex") !== expectedHash) {
    fail(`${entry.name} instruction schedule hash mismatch`);
  }
  if (!targetObject) {
    const adjacent = sectionBytes.subarray(start + expectedSize, start + expectedSize + adjacentSize);
    if (adjacent.toString("hex") !== adjacentHex) {
      fail(`${entry.name} public adjacent literal block mismatch`);
    }
  }
  functions.set(entry.name, { section: sectionName, start, end: start + requiredSize });
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
      fail(`object contains a relocation inside ${name} body or adjacent literal block`);
    }
  }
}

console.log(`Validated ${manifest.functions.length} ARM/VFP runtime helpers (${totalSize} body bytes, ${totalAdjacentSize} public adjacent bytes, zero relocations).`);
