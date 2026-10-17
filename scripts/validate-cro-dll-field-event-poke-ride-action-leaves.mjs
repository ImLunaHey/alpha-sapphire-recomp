#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config/cro-dll-field-event-poke-ride-action-leaves.json");
const INTEGRATED_PATH = join(ROOT, "config/cro-sources.json");
const INVENTORY_PATH = join(ROOT, "symbols/cro/DllFieldEventPokeRideAction.csv");
const PARTITION_PATH = join(ROOT, "symbols/cro-partitions/DllFieldEventPokeRideAction.json");
const MAX_FILE = 64 * 1024 * 1024;
const UNIT = "DllFieldEventPokeRideAction";

const EXPECTED_FUNCTIONS = [
  ["func_00000158", 0x158, 0x22c], ["func_00000394", 0x394, 0x00c],
  ["func_000003A0", 0x3a0, 0x008], ["func_000003A8", 0x3a8, 0x0ec],
  ["func_00000494", 0x494, 0x130], ["func_000005D0", 0x5d0, 0x08c],
  ["func_0000065C", 0x65c, 0x038], ["func_0000087C", 0x87c, 0x054],
  ["func_000008DC", 0x8dc, 0x050], ["func_00000938", 0x938, 0x020],
  ["func_00000964", 0x964, 0x014],
];
const LEAVES = new Map(EXPECTED_FUNCTIONS.slice(1, 3).map(([name, address, size]) => [name, { address, size }]));
const POOLS = [
  ...Array.from({ length: 43 }, (_, index) => [4 + index * 8, 4]),
  [0x384, 0x10], [0x5c4, 0x0c], [0x694, 0x1c], [0x874, 0x08],
  [0x8d0, 0x0c], [0x92c, 0x0c], [0x958, 0x0c], [0x978, 0x14], [0x9ec, 0x28],
];

function fail(message) { throw new Error(`DllFieldEventPokeRideAction leaves: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function hash(value) { return createHash("sha256").update(value).digest("hex"); }
function exactKeys(value, keys, label) {
  check(value && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === [...keys].sort().join(","), `${label} has an invalid schema`);
}
function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}
function readRegular(path, label, maximum = MAX_FILE) {
  check(existsSync(path), `${label} is missing`);
  const info = lstatSync(path);
  check(info.isFile() && !info.isSymbolicLink() && info.size > 0 && info.size <= maximum,
    `${label} is not a bounded regular file`);
  return readFileSync(path);
}

function validateConfiguration(config) {
  exactKeys(config, ["schemaVersion", "unit", "source", "sourceHash", "protectedSource", "protectedSourceHash",
    "specification", "specificationHash", "architecture", "mode", "functions", "validation"], "configuration");
  check(config.schemaVersion === 1 && config.unit === UNIT && config.architecture === "ARMv6K" && config.mode === "arm",
    "unit or architecture identity changed");
  check(config.source === `src/cro/${UNIT}/semantic_leaves.S` &&
    config.protectedSource === `src/cro/${UNIT}/contract_09.S` &&
    config.specification === `docs/specs/cro/${UNIT}_full_unit.md`, "owned path identity changed");
  for (const [key, label] of [["sourceHash", "source"], ["protectedSourceHash", "protected source"],
    ["specificationHash", "specification"]])
    check(typeof config[key] === "string" && /^[0-9a-f]{64}$/u.test(config[key]), `${label} hash is invalid`);
  check(Array.isArray(config.functions) && config.functions.length === 2, "exactly two leaf claims are required");
  for (let index = 0; index < config.functions.length; index++) {
    const fn = config.functions[index], [name, expected] = [...LEAVES][index];
    exactKeys(fn, ["name", "address", "size", "instructionCount", "semantics", "bodyHash"], `function ${index}`);
    check(fn.name === name && fn.address === expected.address && fn.size === expected.size &&
      fn.instructionCount === fn.size / 4 && fn.semantics === (index === 0 ? "store-context-pair" : "constant-success") &&
      /^[0-9a-f]{64}$/u.test(fn.bodyHash), `${name} contract changed`);
  }
  exactKeys(config.validation, ["targetRevision", "requireExactPublicPartition", "requireUniqueOwnership",
    "forbidEncodedPayload", "forbidAllocatedData", "forbidRelocations", "complete"], "validation policy");
  check(config.validation.targetRevision === "AS_EUR_REV2" && config.validation.requireExactPublicPartition === true &&
    config.validation.requireUniqueOwnership === true && config.validation.forbidEncodedPayload === true &&
    config.validation.forbidAllocatedData === true && config.validation.forbidRelocations === true &&
    config.validation.complete === false, "validation policy must remain strict and incomplete");
}

function validateSource(config, source, protectedSource, specification) {
  check(hash(source) === config.sourceHash, "semantic leaf source differs from its reviewed hash");
  check(hash(protectedSource) === config.protectedSourceHash, "protected func_00000494 source changed");
  check(hash(specification) === config.specificationHash, "neutral full-unit specification changed without review");
  const text = source.toString("utf8"), protectedText = protectedSource.toString("utf8");
  check(!/^\s*\.(?:byte|hword|short|word|long|inst|4byte)\b/imu.test(text), "source contains encoded payload");
  check((text.match(/^FUNCTION_BEGIN func_[0-9A-F]{8}$/gmu) ?? []).length === 2 &&
    (text.match(/^FUNCTION_END func_[0-9A-F]{8}$/gmu) ?? []).length === 2, "source function schedule is incomplete");
  for (const fn of config.functions) {
    check(text.split(`FUNCTION_BEGIN ${fn.name}`).length === 2 && text.split(`FUNCTION_END ${fn.name}`).length === 2,
      `${fn.name} is not defined exactly once`);
    check(!protectedText.includes(fn.name), `${fn.name} conflicts with the protected source`);
  }
  check((protectedText.match(/^func_00000494:$/gmu) ?? []).length === 1 &&
    (protectedText.match(/^\.size func_00000494, \. - func_00000494$/gmu) ?? []).length === 1,
    "protected func_00000494 declaration is not singular");
  check(specification.includes("Until those conditions pass together, the unit remains partial") &&
    specification.includes("opaque target payload"), "specification no longer records the complete-unit blocker");
}

function validateOwnership(config, integrated) {
  exactKeys(integrated, ["schemaVersion", "units"], "integrated manifest");
  check(integrated.schemaVersion === 1 && Array.isArray(integrated.units), "integrated manifest is invalid");
  const owners = integrated.units.filter((unit) => unit.sources?.some((source) => source.path === config.source));
  check(owners.length === 1 && owners[0].name === UNIT, "semantic source ownership is not unique");
  const unit = integrated.units.find((entry) => entry.name === UNIT);
  check(unit && unit.sources.length === 2 && unit.sources[0].path === config.protectedSource && unit.sources[0].mode === "arm" &&
    unit.sources[1].path === config.source && unit.sources[1].mode === "arm", "unit source ownership/order changed");
  const expectedClaims = [
    ...config.functions.map(({ name, address, size, semantics }) => ({ name, address, size, semantics })),
    { name: "func_00000494", address: 0x494, size: 0x130, semantics: "contract-09-ride-action-update" },
  ];
  check(JSON.stringify(unit.functions) === JSON.stringify(expectedClaims), "integrated function claims are not exact");
  const files = readdirSync(join(ROOT, `src/cro/${UNIT}`), { withFileTypes: true })
    .filter((entry) => entry.isFile()).map((entry) => `src/cro/${UNIT}/${entry.name}`).sort();
  check(JSON.stringify(files) === JSON.stringify([config.protectedSource, config.source].sort()),
    "unit source directory contains an unreviewed file");
}

function validatePublicMetadata(inventory, partition) {
  const lines = inventory.trimEnd().split(/\r?\n/u);
  check(lines.slice(0, 4).join("\n") === ["# Format,CRO_FUNCTIONS_V1", `# Module,cro/${UNIT}`,
    "# TextSize,00000A14", "Location,Name,Namespace,Mode,Size,Segment"].join("\n"), "inventory header changed");
  const expectedRows = EXPECTED_FUNCTIONS.map(([name, address, size]) =>
    `${address.toString(16).toUpperCase().padStart(8, "0")},"${name}","Global",$a,${size.toString(16).toUpperCase().padStart(8, "0")},".text"`);
  check(JSON.stringify(lines.slice(4)) === JSON.stringify(expectedRows), "public function inventory is not exact");

  exactKeys(partition, ["format", "module", "textSize", "functions", "gaps", "pools", "unknown"], "partition");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 0xa14, "partition identity changed");
  const expectedFunctions = EXPECTED_FUNCTIONS.map(([name, address, size]) => ({ name, address, size, mode: "arm" }));
  check(JSON.stringify(partition.functions) === JSON.stringify(expectedFunctions), "partition function boundaries are not exact");
  const expectedGaps = [
    ...Array.from({ length: 43 }, (_, index) => ({ address: index * 8, size: 4, mode: "arm" })),
    { address: 0x6b0, size: 0x1c4, mode: "arm" }, { address: 0x98c, size: 0x60, mode: "arm" },
  ];
  const expectedPools = POOLS.map(([address, size]) => ({ address, size }));
  check(JSON.stringify(partition.gaps) === JSON.stringify(expectedGaps), "partition code fragments/veneers are not exact");
  check(JSON.stringify(partition.pools) === JSON.stringify(expectedPools), "partition pool schedule is not exact");
  check(Array.isArray(partition.unknown) && partition.unknown.length === 0, "partition retains unknown text");
  const code = partition.functions.reduce((sum, entry) => sum + entry.size, 0) +
    partition.gaps.reduce((sum, entry) => sum + entry.size, 0);
  const pools = partition.pools.reduce((sum, entry) => sum + entry.size, 0);
  check(code === 2248 && pools === 332 && code + pools === partition.textSize,
    "partition does not prove the 2,248-code/332-pool accounting");
}

function cstring(buffer, start, label) {
  const end = buffer.indexOf(0, start);
  check(start >= 0 && start < buffer.length && end >= start, `${label} string is invalid`);
  return buffer.toString("utf8", start, end);
}
function parseObject(buffer) {
  check(Buffer.isBuffer(buffer) && buffer.length >= 52 && buffer.length <= MAX_FILE, "object size is invalid");
  check(buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1])) &&
    buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40, "object is not ARM ELF32 ET_REL");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48), shstrndx = buffer.readUInt16LE(50);
  check(count > 0 && count < 4096 && shstrndx > 0 && shstrndx < count && shoff + count * 40 <= buffer.length,
    "object section table is invalid");
  const sections = [];
  for (let index = 0; index < count; index++) {
    const at = shoff + index * 40;
    const section = { index, nameOffset: buffer.readUInt32LE(at), type: buffer.readUInt32LE(at + 4),
      flags: buffer.readUInt32LE(at + 8), offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), info: buffer.readUInt32LE(at + 28), align: buffer.readUInt32LE(at + 32),
      entsize: buffer.readUInt32LE(at + 36) };
    check(section.type === 8 || section.offset + section.size <= buffer.length, `section ${index} exceeds the object`);
    sections.push(section);
  }
  const namesSection = sections[shstrndx];
  check(namesSection.type === 3, "section-name table is invalid");
  const names = buffer.subarray(namesSection.offset, namesSection.offset + namesSection.size), byName = new Map();
  for (const section of sections) {
    section.name = section.index === 0 ? "" : cstring(names, section.nameOffset, `section ${section.index}`);
    section.data = section.type === 8 ? Buffer.alloc(0) : buffer.subarray(section.offset, section.offset + section.size);
    check(!byName.has(section.name), `duplicate section ${section.name}`); byName.set(section.name, section);
  }
  const symtab = sections.find((section) => section.type === 2);
  check(symtab && symtab.entsize === 16 && symtab.size % 16 === 0 && sections[symtab.link]?.type === 3,
    "symbol table is invalid");
  const stringsSection = sections[symtab.link], strings = buffer.subarray(stringsSection.offset, stringsSection.offset + stringsSection.size);
  const symbols = [];
  for (let at = symtab.offset; at < symtab.offset + symtab.size; at += 16) {
    const shndx = buffer.readUInt16LE(at + 14);
    check(shndx < sections.length || shndx === 0xfff1, "symbol section index is invalid");
    symbols.push({ name: cstring(strings, buffer.readUInt32LE(at), "symbol"), value: buffer.readUInt32LE(at + 4),
      size: buffer.readUInt32LE(at + 8), info: buffer[at + 12], shndx });
  }
  return { sections, byName, symbols };
}

function validateObject(config, buffer) {
  const elf = parseObject(buffer), expectedSections = new Set(config.functions.map((fn) => `.text.${fn.name}`));
  expectedSections.add(".text.func_00000494");
  const allocated = elf.sections.filter((section) => section.size > 0 && (section.flags & 2));
  check(allocated.every((section) => expectedSections.has(section.name) && section.type === 1 && section.flags === 6),
    "object contains foreign executable payload or allocated data");
  check(allocated.length === expectedSections.size, "object is missing an owned executable section");
  for (const fn of config.functions) {
    const section = elf.byName.get(`.text.${fn.name}`);
    check(section && section.size === fn.size && section.align >= 4 && hash(section.data) === fn.bodyHash,
      `${fn.name} object body differs from the reviewed implementation`);
    const symbols = elf.symbols.filter((symbol) => symbol.name === fn.name);
    check(symbols.length === 1 && symbols[0].shndx === section.index && symbols[0].value === 0 &&
      symbols[0].size === fn.size && (symbols[0].info >>> 4) === 1 && (symbols[0].info & 0xf) === 2,
      `${fn.name} global function symbol is invalid`);
    check(!elf.sections.some((entry) => (entry.type === 9 || entry.type === 4) && entry.info === section.index && entry.size > 0),
      `${fn.name} unexpectedly has relocations`);
  }
  const undefinedGlobals = elf.symbols.filter((symbol) => symbol.shndx === 0 && (symbol.info >>> 4) !== 0 && symbol.name);
  check(undefinedGlobals.length === 0, "object contains undefined globals");
}

function loadInputs() {
  const config = JSON.parse(readRegular(CONFIG_PATH, "configuration", 1024 * 1024));
  const sourcePath = resolve(ROOT, config.source), protectedPath = resolve(ROOT, config.protectedSource), specPath = resolve(ROOT, config.specification);
  for (const [path, label] of [[sourcePath, "source"], [protectedPath, "protected source"], [specPath, "specification"]])
    check(inside(ROOT, path), `${label} escapes the repository`);
  return { config, source: readRegular(sourcePath, "source", 1024 * 1024),
    protectedSource: readRegular(protectedPath, "protected source", 1024 * 1024),
    specification: readRegular(specPath, "specification", 1024 * 1024),
    integrated: JSON.parse(readRegular(INTEGRATED_PATH, "integrated manifest", 16 * 1024 * 1024)),
    inventory: readRegular(INVENTORY_PATH, "public inventory", 1024 * 1024).toString("utf8"),
    partition: JSON.parse(readRegular(PARTITION_PATH, "public partition", 1024 * 1024)) };
}
function validateInputs(inputs) {
  validateConfiguration(inputs.config);
  validateSource(inputs.config, inputs.source, inputs.protectedSource, inputs.specification);
  validateOwnership(inputs.config, inputs.integrated);
  validatePublicMetadata(inputs.inventory, inputs.partition);
}
function selfTest(inputs) {
  validateInputs(inputs);
  assert.throws(() => validateSource(inputs.config, Buffer.concat([inputs.source, Buffer.from("\n")]), inputs.protectedSource,
    inputs.specification), /source differs/u);
  assert.throws(() => validateConfiguration({ ...inputs.config, validation: { ...inputs.config.validation, complete: true } }),
    /strict and incomplete/u);
  const hostileManifest = structuredClone(inputs.integrated);
  hostileManifest.units.find((entry) => entry.name === UNIT).functions[0].size += 4;
  assert.throws(() => validateOwnership(inputs.config, hostileManifest), /claims are not exact/u);
  assert.throws(() => validatePublicMetadata(inputs.inventory, { ...inputs.partition, unknown: [{ address: 0, size: 4 }] }),
    /unknown text/u);
  assert.throws(() => validatePublicMetadata(inputs.inventory.replace("000003A0", "000003A4"), inputs.partition),
    /inventory is not exact/u);
}

function main() {
  const args = process.argv.slice(2), inputs = loadInputs();
  if (args.length === 0) validateInputs(inputs);
  else if (args.length === 1 && args[0] === "--self-test") selfTest(inputs);
  else if (args.length === 2 && args[0] === "--object") {
    validateInputs(inputs);
    const objectPath = resolve(args[1]);
    check(existsSync(objectPath) && statSync(objectPath).isFile(), "object is not a regular file");
    validateObject(inputs.config, readRegular(objectPath, "object"));
  } else fail("usage: validate-cro-dll-field-event-poke-ride-action-leaves.mjs [--self-test | --object PATH]");
  console.log(`Validated ${UNIT}: 2 semantic leaves (20 bytes), exact public text partition, completion held false.`);
}

main();
