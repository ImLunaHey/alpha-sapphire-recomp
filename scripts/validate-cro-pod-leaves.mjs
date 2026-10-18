#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { selfTestAbsentPaths, validateAbsentPaths } from "./cro-quarantine-paths.mjs";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const FUNCTION_KEYS = "address,name,semantics,size";
const SOURCE_KEYS = "mode,path";
const UNIT_KEYS = "functions,name,sources";
const QUARANTINED_UNITS = ["DllGift", "DllGts", "DllPokeList", "DllPorocCase", "DllTradelist"];
const QUARANTINED_PATHS = QUARANTINED_UNITS.flatMap((unit) =>
  [`src/cro/${unit}.c`, `src/cro/${unit}/pod_leaves.S`]);
const DLL_POKE_LIST_PATHS = ["src/cro/DllPokeList.c", "src/cro/DllPokeList/pod_leaves.S"];
const DLL_GTS_PATHS = ["src/cro/DllGts.c", "src/cro/DllGts/pod_leaves.S"];
const POROC_CASE_PATHS = ["src/cro/DllPorocCase.c", "src/cro/DllPorocCase/pod_leaves.S"];

const SCHEDULES = new Map([
  ["pod-zero-word-halfword", ["mov r1, #0", "str r1, [r0]", "strh r1, [r0, #4]", "bx lr"]],
  ["pod-zero-word-byte", ["mov r1, #0", "str r1, [r0]", "strb r1, [r0, #4]", "bx lr"]],
  ["pod-zero-byte-word", ["mov r1, #0", "strb r1, [r0]", "str r1, [r0, #4]", "bx lr"]],
  ["pod-zero-two-words", ["mov r1, #0", "str r1, [r0]", "str r1, [r0, #4]", "bx lr"]],
  ["pod-zero-two-words-halfword", ["mov r1, #0", "str r1, [r0]", "str r1, [r0, #4]", "strh r1, [r0, #8]", "bx lr"]],
  ["pod-zero-three-words", ["mov r1, #0", "str r1, [r0]", "str r1, [r0, #4]", "str r1, [r0, #8]", "bx lr"]],
  ["pod-copy-word-halfword", ["ldr r2, [r1]", "str r2, [r0]", "ldrh r3, [r1, #4]", "strh r3, [r0, #4]", "bx lr"]],
  ["pod-copy-word-byte", ["ldr r2, [r1]", "str r2, [r0]", "ldrb r3, [r1, #4]", "strb r3, [r0, #4]", "bx lr"]],
  ["pod-copy-two-words", ["ldr r2, [r1]", "ldr r3, [r1, #4]", "str r2, [r0]", "str r3, [r0, #4]", "bx lr"]],
]);

const EXPECTED = [
  ["DllBattle", "func_0006482C", "pod-copy-word-halfword"],
  ["DllBattle", "func_00064840", "pod-copy-word-byte"],
  ["DllBattle", "func_00077720", "pod-zero-word-halfword"],
  ["DllBattle", "func_0007A7CC", "pod-copy-two-words"],
  ["DllBattle", "func_000D3230", "pod-zero-two-words-halfword"],
  ["DllBattle", "func_000D3244", "pod-zero-three-words"],
  ["DllBattle", "func_000D3258", "pod-zero-word-byte"],
  ["DllConfig", "func_00001EC0", "pod-copy-word-halfword"],
  ["DllContest", "func_00012C58", "pod-zero-word-byte"],
  ["DllField", "func_0001EDEC", "pod-zero-byte-word"],
  ["DllField", "func_0007AD9C", "pod-copy-word-halfword"],
  ["DllField", "func_0009138C", "pod-copy-word-byte"],
  ["DllField", "func_000929A4", "pod-zero-two-words-halfword"],
  ["DllField", "func_000EA4C8", "pod-zero-two-words"],
  ["DllNumberInput", "func_00001968", "pod-zero-two-words-halfword"],
  ["DllPssIconSelect", "func_00002E44", "pod-zero-two-words"],
  ["DllSecretBaseQR", "func_000021A4", "pod-copy-two-words"],
  ["DllSecretBaseQR", "func_000021B8", "pod-copy-word-byte"],
  ["DllTrialDownload", "func_00006F28", "pod-zero-two-words-halfword"],
  ["DllUSSecretBase", "func_000079B4", "pod-copy-two-words"],
];

function fail(message) { throw new Error(`CRO POD-leaf validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}
function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}
function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}
function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object-directory", "--readelf", "--objdump"].includes(option) && value !== undefined,
      "usage: validate-cro-pod-leaves.mjs [--object-directory <path> --readelf <path> --objdump <path>]");
    const key = { "--object-directory": "objectDirectory", "--readelf": "readelf", "--objdump": "objdump" }[option];
    check(result[key] === undefined, `${option} was supplied more than once`);
    result[key] = resolve(value);
  }
  const supplied = [result.objectDirectory, result.readelf, result.objdump].filter((value) => value !== undefined).length;
  check(supplied === 0 || supplied === 3, "object validation requires --object-directory, --readelf, and --objdump together");
  if (supplied) {
    check(existsSync(result.objectDirectory) && statSync(result.objectDirectory).isDirectory(), "object directory is not a directory");
    for (const key of ["readelf", "objdump"]) check(existsSync(result[key]) && statSync(result[key]).isFile(), `${key} is not a regular file`);
  }
  return result;
}

function expectedSize(semantics) { return SCHEDULES.get(semantics).length * 4; }
function normalizeInstruction(text) {
  const normalized = text.split(";")[0].trim().toLowerCase().replace(/\s+/gu, " ").replace(/#0x0\b/gu, "#0");
  // Some current GNU objdump releases choose an ARMv8 system-register alias
  // for the ARMv6K `bx lr` encoding even though the input ELF is ARMv6K.
  if (normalized === "msr sp_hyp, lr, lsl pc") return "bx lr";
  return normalized;
}

function validateContract() {
  let config;
  try { config = JSON.parse(readFileSync(CONFIG_PATH, "utf8")); }
  catch (error) { fail(`cannot read config/cro-sources.json: ${error.message}`); }
  exactKeys(config, "schemaVersion,units", "config");
  check(config.schemaVersion === 1 && Array.isArray(config.units) && config.units.length > 0, "config version or units are invalid");
  check(!config.units.some((unit) => QUARANTINED_UNITS.includes(unit?.name)),
    `${QUARANTINED_UNITS.join(" and ")} must remain absent from authored CRO claims`);
  check(!config.units.some((unit) => Array.isArray(unit?.sources) &&
    unit.sources.some((source) => QUARANTINED_PATHS.includes(source?.path))),
  `${QUARANTINED_UNITS.join(" and ")} quarantined source paths must remain unclaimed`);
  validateAbsentPaths(ROOT, QUARANTINED_PATHS, "CRO POD-leaf validation");

  const expected = new Map(EXPECTED.map(([unit, name, semantics]) => [name, { unit, semantics }]));
  const found = new Map(), affected = new Set(EXPECTED.map(([unit]) => unit));
  let previousUnit = "";
  for (const [unitIndex, unit] of config.units.entries()) {
    exactKeys(unit, UNIT_KEYS, `unit ${unitIndex}`);
    check(typeof unit.name === "string" && /^Dll[A-Za-z0-9_]+$/u.test(unit.name) && unit.name > previousUnit,
      `unit ${unitIndex} has an invalid, duplicate, or unsorted name`);
    previousUnit = unit.name;
    check(Array.isArray(unit.sources) && unit.sources.length > 0 && Array.isArray(unit.functions) && unit.functions.length > 0,
      `${unit.name} has an empty source or function list`);
    let previousSource = "";
    for (const [sourceIndex, source] of unit.sources.entries()) {
      exactKeys(source, SOURCE_KEYS, `${unit.name} source ${sourceIndex}`);
      check(source.mode === "arm" && typeof source.path === "string" && source.path > previousSource,
        `${unit.name} source ${sourceIndex} is not normalized ARM ownership`);
      previousSource = source.path;
      const path = resolve(ROOT, source.path);
      check(source.path.startsWith(`src/cro/${unit.name}`) && inside(ROOT, path) && existsSync(path) &&
        lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(), `${unit.name} source ${sourceIndex} is not an owned regular file`);
    }
    if (affected.has(unit.name)) {
      const podPath = `src/cro/${unit.name}/pod_leaves.S`;
      const expectedSources = unit.functions.some((fn) => fn.semantics === "store-u8")
        ? [`src/cro/${unit.name}.c`, podPath] : [podPath];
      check(expectedSources.every((path) =>
        unit.sources.filter((source) => source.path === path && source.mode === "arm").length === 1),
      `${unit.name} POD source ownership is not normalized`);
      const assembly = readFileSync(resolve(ROOT, podPath), "utf8");
      check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(assembly),
        `${podPath} contains encoded instruction or data directives`);
    }
    let previousAddress = -1;
    for (const [functionIndex, fn] of unit.functions.entries()) {
      check(fn !== null && typeof fn === "object" && !Array.isArray(fn), `${unit.name} function ${functionIndex} is invalid`);
      check(Number.isSafeInteger(fn.address) && fn.address > previousAddress,
        `${unit.name} function ${functionIndex} is duplicated or unsorted`);
      previousAddress = fn.address;
      if (!String(fn.semantics).startsWith("pod-")) continue;
      exactKeys(fn, FUNCTION_KEYS, `${unit.name} POD function ${functionIndex}`);
      check(/^func_[0-9A-F]{8}$/u.test(fn.name) && fn.name === `func_${fn.address.toString(16).toUpperCase().padStart(8, "0")}`,
        `${unit.name} POD function ${functionIndex} has an invalid identity`);
      check(SCHEDULES.has(fn.semantics) && fn.size === expectedSize(fn.semantics), `${fn.name} has an invalid POD semantic or size`);
      check(!found.has(fn.name), `${fn.name} is claimed more than once`);
      found.set(fn.name, { unit: unit.name, fn });
    }
  }
  check(found.size === expected.size, `expected ${expected.size} POD functions, found ${found.size}`);
  for (const [name, contract] of expected) {
    const actual = found.get(name);
    check(actual && actual.unit === contract.unit && actual.fn.semantics === contract.semantics,
      `${name} does not match its reviewed unit and semantics`);
  }

  for (const { unit, fn } of found.values()) {
    const inventory = join(ROOT, "symbols", "cro", `${unit}.csv`);
    check(existsSync(inventory) && lstatSync(inventory).isFile() && !lstatSync(inventory).isSymbolicLink(), `${unit} public inventory is missing`);
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    const lines = readFileSync(inventory, "utf8").split(/\r?\n/u);
    check(lines.filter((line) => line === row).length === 1, `${unit} public inventory lacks the exact ARM boundary for ${fn.name}`);
    check(lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1, `${unit} public inventory is ambiguous for ${fn.name}`);
  }

  const functions = [...found.values()];
  const totals = { bytes: 0, instructions: 0, loads: 0, stores: 0, zeroes: 0, returns: 0 };
  for (const { fn } of functions) {
    const schedule = SCHEDULES.get(fn.semantics);
    totals.bytes += fn.size; totals.instructions += schedule.length;
    totals.loads += schedule.filter((item) => /^ldr(?:b|h)?\b/u.test(item)).length;
    totals.stores += schedule.filter((item) => /^str(?:b|h)?\b/u.test(item)).length;
    totals.zeroes += schedule.filter((item) => item === "mov r1, #0").length;
    totals.returns += schedule.filter((item) => item === "bx lr").length;
  }
  check(affected.size === 9 && totals.bytes === 376 && totals.instructions === 94 && totals.loads === 18 &&
    totals.stores === 45 && totals.zeroes === 11 && totals.returns === 20, "aggregate POD contract totals are invalid");
  return { config, functions, affected };
}

function parseDisassembly(output) {
  const result = new Map();
  let current;
  for (const line of output.split("\n")) {
    const label = /^\s*[0-9a-f]+\s+<(func_[0-9A-F]{8})>:\s*$/iu.exec(line);
    if (label) { current = label[1].toUpperCase().replace("FUNC_", "func_"); result.set(current, []); continue; }
    const instruction = /^\s*[0-9a-f]+:\s+[0-9a-f]{8}\s+(.+?)\s*$/iu.exec(line);
    if (instruction && current) result.get(current).push(normalizeInstruction(instruction[1]));
  }
  return result;
}

function validateObjects(contract, directory, readelf, objdump) {
  const expectedObjects = contract.config.units.map((unit) => `${unit.name}.o`).sort();
  const actualObjects = readdirSync(directory).filter((entry) => entry.endsWith(".o")).sort();
  check(actualObjects.length === expectedObjects.length && actualObjects.every((entry, index) => entry === expectedObjects[index]),
    "object directory contents differ from config");

  for (const unitName of [...contract.affected].sort()) {
    const unit = contract.config.units.find((entry) => entry.name === unitName);
    const object = join(directory, `${unitName}.o`);
    check(existsSync(object) && lstatSync(object).isFile() && !lstatSync(object).isSymbolicLink(), `${unitName} object is missing`);
    const header = run(readelf, ["--file-header", object]);
    check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header), `${unitName} is not a relocatable ARM ELF`);
    const sections = run(readelf, ["--sections", "--wide", object]);
    const allocatedNames = [];
    for (const line of sections.split("\n")) {
      const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
      if (match && match[3].includes("A")) allocatedNames.push(match[1]);
    }
    const configured = unit.functions.map((fn) => `.text.${fn.name}`).sort();
    allocatedNames.sort();
    check(allocatedNames.length === configured.length && allocatedNames.every((name, index) => name === configured[index]),
      `${unitName} has missing or accidental allocated payload`);
    const symbols = run(readelf, ["--symbols", "--wide", object]);
    for (const fn of unit.functions) {
      const sectionLine = sections.split("\n").filter((line) => line.includes(`.text.${fn.name}`));
      check(sectionLine.length === 1 && new RegExp(`PROGBITS\\s+\\S+\\s+\\S+\\s+${fn.size.toString(16).padStart(6, "0")}\\s+\\S+\\s+AX\\s`, "iu").test(sectionLine[0]),
        `${fn.name} section size or flags are invalid`);
      const symbolLine = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
      check(symbolLine.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolLine[0]),
        `${fn.name} symbol size or binding is invalid`);
    }
    const relocations = run(readelf, ["--relocs", "--wide", object]);
    check(/There are no relocations in this file\./u.test(relocations), `${unitName} unexpectedly has relocations`);
    const decoded = parseDisassembly(run(objdump, ["-d", object]));
    for (const { fn } of contract.functions.filter((entry) => entry.unit === unitName)) {
      const actual = decoded.get(fn.name), expected = SCHEDULES.get(fn.semantics);
      check(actual && actual.length === expected.length && actual.every((instruction, index) => instruction === expected[index]),
        `${fn.name} instruction schedule is not exactly ${expected.join("; ")}`);
    }
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  selfTestAbsentPaths(ROOT, [...DLL_GTS_PATHS, ...DLL_POKE_LIST_PATHS, ...POROC_CASE_PATHS], "CRO POD-leaf validation");
  const contract = validateContract();
  if (options.objectDirectory) validateObjects(contract, options.objectDirectory, options.readelf, options.objdump);
  console.log(`Validated 20 ARM POD leaves in 9 CRO units (376 bytes, 94 instructions)${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
