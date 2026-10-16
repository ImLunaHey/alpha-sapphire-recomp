import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-runtime-helpers-60.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));
const sourcePath = join(root, manifest.source);
const sourceObject = join(root, "build/AS_EUR_REV2/base/objects/main/arm_runtime_helpers_60.o");
const baseObject = join(root, "build/AS_EUR_REV2/base/code.o");
const targetObject = join(root, "build/AS_EUR_REV2/target/code.o");
const allowedObjects = new Set([resolve(sourceObject), resolve(baseObject), resolve(targetObject)]);
const standaloneObject = process.argv[2] === undefined;
const objectPath = resolve(process.argv[2] ?? sourceObject);
const targetMode = objectPath === resolve(targetObject);
const readelf = process.argv[3] ?? "readelf";
const maxBuffer = 16 * 1024 * 1024;
const expectedSourceHash = "286b6aeb54f988f1bac137da797661a0810b46409a9671f3c2cf3ca196bbca02";
const expectedFunctions = [
  ["func_00190658", 560, "94d7d07c97bf347b795d4389a4b1af593be16c0c0be13d407c4662b5fd2eb1bd"],
  ["func_001955F0", 612, "e4f7097b5fd26698abe36c939a840773aa8acf812d01040e2ed3aebf06858fcf"],
  ["func_004D5C5C", 692, "8c1dddbbe9c4cc292e9622e0fedf4c8b66df6c849e2e1b1cb8f7d2e61584f2eb"],
  ["func_003BB0E8", 560, "54927ab162b9645da1e6ad99e795d97a731e2ce9c6c51d7fe4e52bd16593adf3"],
  ["func_0015F800", 552, "84215c0281769e373bdf350a14b399f70bb00ce0367ac93dae6dec23cbe5231f"],
  ["func_001F8244", 520, "914d2d314486d8e80aa21ec70ae38b93fe7ba40fbd09ac656ed0181ab79b6032"],
];
const expectedNames = expectedFunctions.map(([name]) => name);
const expectedByName = new Map(expectedFunctions.map((entry) => [entry[0], entry]));

function fail(message) {
  throw new Error(`ARM runtime helper batch 60 validation failed: ${message}`);
}

function exactKeys(value, keys) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    JSON.stringify(Object.keys(value)) === JSON.stringify(keys);
}

function runReadelf(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer });
  if (result.error) fail(`${readelf} could not run: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${readelf} ${args.join(" ")} exited with status ${result.status}: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

if (!(process.argv.length === 2 || process.argv.length === 4)) {
  fail("usage: validate-arm-runtime-helpers-60.mjs [object readelf]");
}
if (!allowedObjects.has(objectPath)) {
  fail("object must be the batch source object, base code object, or target code object");
}

if (!exactKeys(manifest, [
  "schemaVersion", "source", "mode", "totalBodySize", "totalAdjacentSize",
  "functions", "identityClasses", "symbolicIdentities", "symbolicSlots",
]) || manifest.schemaVersion !== 1 || manifest.mode !== "arm" ||
    manifest.source !== "src/main/arm_runtime_helpers_60.S" ||
    manifest.totalBodySize !== 3496 || manifest.totalAdjacentSize !== 0 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length ||
    !existsSync(sourcePath)) {
  fail("unexpected manifest shape or missing source");
}
if (!existsSync(objectPath)) fail(`object does not exist: ${objectPath}`);

const configuredSources = sources.sources?.filter((entry) => entry?.path === manifest.source) ?? [];
if (configuredSources.length !== 1 || !exactKeys(configuredSources[0], ["path", "mode"]) ||
    configuredSources[0].mode !== manifest.mode) {
  fail("source must be registered exactly once in ARM mode");
}

const names = new Set();
let totalSize = 0;
for (const [index, entry] of manifest.functions.entries()) {
  const expected = expectedFunctions[index];
  if (!exactKeys(entry, ["name", "size", "calls", "adjacentWords"]) ||
      entry.name !== expected[0] || entry.size !== expected[1] ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      !Number.isInteger(entry.size) || entry.size <= 0 || entry.size % 4 !== 0 ||
      names.has(entry.name) || !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail("invalid function manifest entry");
  }
  names.add(entry.name);
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize) fail("manifest size total mismatch");

if (!exactKeys(manifest.identityClasses, ["call_free_runtime_helpers_60"]) ||
    !exactKeys(manifest.identityClasses.call_free_runtime_helpers_60, ["members", "parameters"]) ||
    JSON.stringify(manifest.identityClasses.call_free_runtime_helpers_60.members) !==
      JSON.stringify(expectedNames) ||
    JSON.stringify(manifest.identityClasses.call_free_runtime_helpers_60.parameters) !==
      JSON.stringify(["controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule"]) ||
    !exactKeys(manifest.symbolicIdentities, []) || !exactKeys(manifest.symbolicSlots, [])) {
  fail("unexpected identity or zero-relocation manifest shape");
}

const source = readFileSync(sourcePath, "utf8");
if (createHash("sha256").update(source).digest("hex") !== expectedSourceHash) {
  fail("source does not match the reviewed exact schedule");
}
const definitions = [...source.matchAll(/^\.global\s+(func_[0-9A-F]{8})\s*$/gm)].map((match) => match[1]);
const labels = [...source.matchAll(/^(func_[0-9A-F]{8}):\s*$/gm)].map((match) => match[1]);
const endings = [...source.matchAll(/^\.size\s+(func_[0-9A-F]{8}),\s*\.\s*-\s*\1\s*$/gm)]
  .map((match) => match[1]);
if (JSON.stringify(definitions) !== JSON.stringify(expectedNames) ||
    JSON.stringify(labels) !== JSON.stringify(expectedNames) ||
    JSON.stringify(endings) !== JSON.stringify(expectedNames)) {
  fail("manifest/source function parity mismatch");
}

const sectionText = runReadelf(["--sections", "--wide", objectPath]);
const symbolText = runReadelf(["--symbols", "--wide", objectPath]);
const relocationText = runReadelf(["--relocs", "--wide", objectPath]);

const sections = new Map();
for (const line of sectionText.split(/\r?\n/)) {
  const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+([A-Z]*)\s+/);
  if (match) {
    sections.set(match[2], {
      index: Number(match[1]),
      size: Number.parseInt(match[3], 16),
      flags: match[4],
    });
  }
}

const symbols = [];
for (const line of symbolText.split(/\r?\n/)) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)$/);
  if (match) {
    symbols.push({
      value: Number.parseInt(match[1], 16),
      size: Number(match[2]),
      type: match[3],
      bind: match[4],
      ndx: match[6],
      name: match[7].trim(),
    });
  }
}

const functions = new Map();
for (const entry of manifest.functions) {
  const sectionName = `.text.${entry.name}`;
  const section = sections.get(sectionName);
  const [, expectedSize, expectedHash] = expectedByName.get(entry.name);
  if (!section || !section.flags.includes("A") || !section.flags.includes("X")) {
    fail(`${entry.name} section is missing or non-executable`);
  }
  const matches = symbols.filter((symbol) => symbol.name === entry.name);
  if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" ||
      matches[0].size !== expectedSize || Number(matches[0].ndx) !== section.index ||
      matches[0].value + expectedSize > section.size ||
      (standaloneObject && (matches[0].value !== 0 || section.size !== expectedSize))) {
    fail(`${entry.name} symbol metadata or section size mismatch`);
  }
  const mappings = symbols.filter((symbol) => Number(symbol.ndx) === section.index);
  if (!mappings.some((symbol) => symbol.name === "$a" && symbol.value <= matches[0].value)) {
    fail(`${entry.name} lacks an ARM mapping symbol`);
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
  functions.set(entry.name, { section: sectionName, start, end: start + expectedSize });
}

let relocationSection = null;
let relocationCount = 0;
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
  relocationCount += 1;
}
if (standaloneObject && relocationCount !== 0) {
  fail("standalone zero-relocation object contains relocations");
}

const mode = standaloneObject ? "source" : targetMode ? "target" : "base";
console.log(
  `Validated ${manifest.functions.length} ARM runtime helpers ` +
  `(${totalSize} body bytes, zero adjacent bytes, zero in-body relocations) in ${mode} mode.`,
);
