#!/usr/bin/env node

import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const TARGET = "AS_EUR_REV2";
const EXPECTED_UNITS = 145;
const MAX_FILE_SIZE = 16 * 1024 * 1024;
const CSV_HEADER = "Location,Name,Namespace,Mode,Size,Segment";
const UNIT_PATTERN = /^cro\/(Dll[A-Za-z0-9_]+)$/;
const STEM_PATTERN = /^Dll[A-Za-z0-9_]+$/;
const FUNCTION_PATTERN = /^func_([0-9A-F]{8})$/;

function fail(message) {
  throw new Error(`public CRO metadata: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, expected, context) {
  check(value && typeof value === "object" && !Array.isArray(value), `${context} must be an object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  check(JSON.stringify(actual) === JSON.stringify(wanted),
    `${context} fields must be exactly ${wanted.join(", ")}`);
}

function rejectDuplicateJsonKeys(text, context) {
  const stack = [];
  for (let index = 0; index < text.length;) {
    const character = text[index];
    if (character === "{") { stack.push({ type: "object", keys: new Set() }); index++; continue; }
    if (character === "[") { stack.push({ type: "array" }); index++; continue; }
    if (character === "}" || character === "]") { stack.pop(); index++; continue; }
    if (character !== '"') { index++; continue; }
    const start = index++;
    let escaped = false;
    while (index < text.length) {
      const current = text[index++];
      if (escaped) escaped = false;
      else if (current === "\\") escaped = true;
      else if (current === '"') break;
    }
    check(index <= text.length && text[index - 1] === '"', `${context} has an unterminated string`);
    let cursor = index;
    while (/\s/.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const owner = stack.at(-1);
    check(owner?.type === "object", `${context} has a key outside an object`);
    let key;
    try { key = JSON.parse(text.slice(start, index)); } catch { fail(`${context} contains an invalid key`); }
    check(!owner.keys.has(key), `${context} contains duplicate key ${key}`);
    owner.keys.add(key);
  }
}

function checkedEnd(address, size, textSize, context) {
  check(Number.isSafeInteger(address) && address >= 0, `${context} address is invalid`);
  check(Number.isSafeInteger(size) && size > 0, `${context} size is invalid`);
  const end = address + size;
  check(Number.isSafeInteger(end) && end <= textSize, `${context} exceeds .text`);
  return end;
}

function internalModuleName(publicStem) {
  // This is the sole filename/internal-marker case discrepancy in this target.
  return publicStem === "DllEshop" ? "DllEShop" : publicStem;
}

function validateManifest(manifest) {
  exactKeys(manifest, ["schemaVersion", "target", "unitCount", "units"], "manifest");
  check(manifest.schemaVersion === 1 && manifest.target === TARGET,
    `manifest must describe ${TARGET} schema 1`);
  check(manifest.unitCount === EXPECTED_UNITS && Array.isArray(manifest.units)
    && manifest.units.length === EXPECTED_UNITS, `manifest must contain exactly ${EXPECTED_UNITS} units`);
  const units = new Map();
  let previous = "";
  for (let index = 0; index < manifest.units.length; index++) {
    const unit = manifest.units[index];
    exactKeys(unit, ["name", "sha256", "size"], `manifest unit ${index}`);
    const match = typeof unit.name === "string" ? UNIT_PATTERN.exec(unit.name) : null;
    check(match && unit.name > previous, "manifest unit names must be canonical, unique, and sorted");
    check(Number.isSafeInteger(unit.size) && unit.size > 0 && unit.size <= 0xffffffff,
      `${unit.name} manifest size is invalid`);
    check(typeof unit.sha256 === "string" && /^[0-9a-f]{64}$/.test(unit.sha256),
      `${unit.name} manifest SHA-256 is invalid`);
    previous = unit.name;
    units.set(match[1], unit);
  }
  check(units.has("DllEshop") && !units.has("DllEShop"),
    "manifest must use the canonical public DllEshop spelling");
  return units;
}

function parseCsv(text, stem, manifestUnit) {
  check(typeof text === "string" && Buffer.byteLength(text) > 0 && Buffer.byteLength(text) <= MAX_FILE_SIZE,
    `${stem}.csv size is invalid`);
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === "") lines.pop();
  check(lines.length >= 4 && lines[0] === "# Format,CRO_FUNCTIONS_V1"
    && lines[1] === `# Module,cro/${stem}` && /^# TextSize,[0-9A-F]{8}$/.test(lines[2])
    && lines[3] === CSV_HEADER, `${stem}.csv header or module identity is invalid`);
  const textSize = Number.parseInt(lines[2].slice("# TextSize,".length), 16);
  check(textSize > 0 && textSize <= manifestUnit.size,
    `${stem}.csv text size is invalid or exceeds the manifest module size`);
  const functions = [];
  for (let index = 4; index < lines.length; index++) {
    const match = /^([0-9A-F]{8}),"(func_[0-9A-F]{8})","Global",(\$a|\$t),([0-9A-F]{8}),"\.text"$/.exec(lines[index]);
    check(match, `${stem}.csv line ${index + 1} is not canonical neutral metadata`);
    const address = Number.parseInt(match[1], 16), size = Number.parseInt(match[4], 16);
    const mode = match[3] === "$a" ? "arm" : "thumb", alignment = mode === "arm" ? 4 : 2;
    check(match[2] === `func_${match[1]}`, `${stem}.csv line ${index + 1} function identity is not neutral`);
    const end = checkedEnd(address, size, textSize, `${stem}.csv ${match[2]}`);
    check(address % alignment === 0 && size % alignment === 0,
      `${stem}.csv ${match[2]} is misaligned for ${mode}`);
    if (functions.length) check(functions.at(-1).end <= address,
      `${stem}.csv functions overlap or are not address-sorted`);
    functions.push({ name: match[2], address, size, mode, end });
  }
  return { textSize, functions };
}

function parsePartition(text, stem, manifestUnit) {
  check(typeof text === "string" && Buffer.byteLength(text) > 0 && Buffer.byteLength(text) <= MAX_FILE_SIZE,
    `${stem}.json size is invalid`);
  rejectDuplicateJsonKeys(text, `${stem}.json`);
  let partition;
  try { partition = JSON.parse(text); } catch { fail(`${stem}.json is not valid JSON`); }
  exactKeys(partition, ["format", "functions", "gaps", "module", "pools", "textSize", "unknown"],
    `${stem}.json`);
  check(partition.format === 1, `${stem}.json format must be 1`);
  check(partition.module === internalModuleName(stem),
    `${stem}.json module must be ${internalModuleName(stem)}`);
  check(Number.isSafeInteger(partition.textSize) && partition.textSize > 0
    && partition.textSize <= manifestUnit.size, `${stem}.json text size is invalid or exceeds the manifest module size`);
  for (const key of ["functions", "gaps", "pools", "unknown"])
    check(Array.isArray(partition[key]), `${stem}.json ${key} must be an array`);
  const ranges = [];
  const functions = [];
  const names = new Set();
  for (let index = 0; index < partition.functions.length; index++) {
    const entry = partition.functions[index], context = `${stem}.json function ${index}`;
    exactKeys(entry, ["address", "mode", "name", "size"], context);
    const nameMatch = typeof entry.name === "string" ? FUNCTION_PATTERN.exec(entry.name) : null;
    check(nameMatch && Number.parseInt(nameMatch[1], 16) === entry.address,
      `${context} name is not the neutral address identity`);
    check(!names.has(entry.name), `${context} name is duplicated`); names.add(entry.name);
    check(entry.mode === "arm" || entry.mode === "thumb", `${context} mode is invalid`);
    const alignment = entry.mode === "arm" ? 4 : 2;
    const end = checkedEnd(entry.address, entry.size, partition.textSize, context);
    check(entry.address % alignment === 0 && entry.size % alignment === 0, `${context} is misaligned`);
    const value = { kind: "function", ...entry, end };
    functions.push(value); ranges.push(value);
  }
  for (const [kind, entries] of [["gap", partition.gaps], ["pool", partition.pools], ["unknown", partition.unknown]]) {
    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index], context = `${stem}.json ${kind} ${index}`;
      exactKeys(entry, kind === "gap" ? ["address", "mode", "size"] : ["address", "size"], context);
      const end = checkedEnd(entry.address, entry.size, partition.textSize, context);
      if (kind === "gap") {
        check(entry.mode === "arm" || entry.mode === "thumb", `${context} mode is invalid`);
        const alignment = entry.mode === "arm" ? 4 : 2;
        check(entry.address % alignment === 0 && entry.size % alignment === 0, `${context} is misaligned`);
      }
      ranges.push({ kind, ...entry, end });
    }
  }
  ranges.sort((left, right) => left.address - right.address || left.end - right.end || left.kind.localeCompare(right.kind));
  check(ranges.length > 0, `${stem}.json does not classify .text`);
  let cursor = 0;
  for (const range of ranges) {
    check(range.address === cursor, range.address < cursor
      ? `${stem}.json ranges overlap at 0x${range.address.toString(16)}`
      : `${stem}.json leaves a hole at 0x${cursor.toString(16)}`);
    cursor = range.end;
  }
  check(cursor === partition.textSize, `${stem}.json leaves a hole at 0x${cursor.toString(16)}`);
  return { textSize: partition.textSize, functions };
}

export function validatePublicCroMetadata({ manifest, csvFiles, partitionFiles, requireComplete = false }) {
  const manifestUnits = validateManifest(manifest);
  check(csvFiles instanceof Map && partitionFiles instanceof Map, "artifact collections must be maps");
  const csvStems = [...csvFiles.keys()].sort(), partitionStems = [...partitionFiles.keys()].sort();
  check(JSON.stringify(csvStems) === JSON.stringify(partitionStems),
    "CSV and partition file sets must be identical");
  check(csvStems.length > 0, "at least one paired metadata unit is required during staged publication");
  check(csvStems.length <= EXPECTED_UNITS, `metadata set exceeds ${EXPECTED_UNITS} units`);
  const complete = csvStems.length === EXPECTED_UNITS;
  if (requireComplete || complete) {
    check(JSON.stringify(csvStems) === JSON.stringify([...manifestUnits.keys()].sort()),
      `complete publication must exactly match all ${EXPECTED_UNITS} manifest units`);
  }
  let functions = 0, textBytes = 0;
  for (const stem of csvStems) {
    check(STEM_PATTERN.test(stem) && manifestUnits.has(stem), `${stem} is not a canonical manifest module`);
    const csv = parseCsv(csvFiles.get(stem), stem, manifestUnits.get(stem));
    const partition = parsePartition(partitionFiles.get(stem), stem, manifestUnits.get(stem));
    check(csv.textSize === partition.textSize, `${stem} CSV and partition text sizes differ`);
    check(csv.functions.length === partition.functions.length,
      `${stem} CSV and partition function counts differ`);
    for (let index = 0; index < csv.functions.length; index++) {
      const left = csv.functions[index], right = partition.functions[index];
      check(left.name === right.name && left.address === right.address && left.size === right.size
        && left.mode === right.mode, `${stem} function ${index} differs between CSV and partition`);
    }
    functions += csv.functions.length; textBytes += csv.textSize;
  }
  return { unitCount: csvStems.length, functionCount: functions, textBytes, complete };
}

function readArtifactDirectory(directory, extension) {
  const files = new Map();
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.name.endsWith(extension)) continue;
    check(entry.isFile() && !entry.isSymbolicLink(), `${entry.name} must be a regular file`);
    const stem = basename(entry.name, extension);
    check(STEM_PATTERN.test(stem), `${entry.name} has a noncanonical module filename`);
    const path = join(directory, entry.name), stat = lstatSync(path);
    check(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= MAX_FILE_SIZE,
      `${entry.name} size or file type is invalid`);
    check(!files.has(stem), `${entry.name} is duplicated`);
    files.set(stem, readFileSync(path, "utf8"));
  }
  return files;
}

export function validatePublicCroMetadataTree(root = ROOT, options = {}) {
  const manifestText = readFileSync(join(root, "progress", "units", `${TARGET}.cro.json`), "utf8");
  rejectDuplicateJsonKeys(manifestText, "manifest");
  const manifest = JSON.parse(manifestText);
  return validatePublicCroMetadata({ manifest,
    csvFiles: readArtifactDirectory(join(root, "symbols", "cro"), ".csv"),
    partitionFiles: readArtifactDirectory(join(root, "symbols", "cro-partitions"), ".json"),
    requireComplete: options.requireComplete ?? false });
}

function main() {
  const args = process.argv.slice(2);
  check(args.every(argument => argument === "--require-complete"),
    "usage: validate-public-cro-metadata.mjs [--require-complete]");
  const result = validatePublicCroMetadataTree(ROOT, { requireComplete: args.includes("--require-complete") });
  console.log(`Validated ${result.unitCount}/${EXPECTED_UNITS} public CRO metadata units: `
    + `${result.functionCount} neutral functions, ${result.textBytes} .text bytes${result.complete ? " (complete set)" : " (staged set)"}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
