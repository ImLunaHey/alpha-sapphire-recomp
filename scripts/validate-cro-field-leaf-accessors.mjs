#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const UNIT = "DllField";
const SOURCE = "src/cro/DllField/leaf_accessors.S";
const SEMANTICS = "leaf-accessor";
const FUNCTION_KEYS = "address,name,semantics,size";
const SOURCE_KEYS = "mode,path";

const SCHEDULES = new Map([
  ["func_000209B8", ["mov r1, #1", "strb r1, [r0, #0x28]", "bx lr"]],
  ["func_0002EABC", ["str r1, [r0, #0x1C]", "strb r2, [r0, #0x20]", "strb r3, [r0, #0x21]", "bx lr"]],
  ["func_0003501C", ["sub r0, r0, #1", "cmp r0, #4", "movcc r0, #1", "movcs r0, #0", "bx lr"]],
  ["func_000395D4", ["mov r2, #1", "str r1, [r0, #0x1E4]", "strb r2, [r0, #0x1E0]", "bx lr"]],
  ["func_0003B5C4", ["mov r1, #0", "strb r1, [r0, #0x4E0]", "bx lr"]],
  ["func_0006B744", ["ldr r0, [r0, #0x430]", "cmp r0, #0", "movne r0, #1", "bx lr"]],
  ["func_0007042C", ["ldr r0, [r0, #0x24]", "cmp r0, #0", "addne r0, r0, #4", "bx lr"]],
  ["func_00070CC4", ["ldr r0, [r0, #0x24]", "cmp r0, #0", "ldrne r0, [r0, #4]", "strne r1, [r0, #0x94]", "bx lr"]],
  ["func_00078028", ["ldr r0, [r0, #4]", "cmp r0, #0", "movne r0, #1", "bx lr"]],
  ["func_00081B68", ["ldrh r0, [r0, #8]", "and r0, r0, #0xFF", "bx lr"]],
  ["func_00082DBC", ["ldrb r0, [r0, #0x20]", "mov r2, #1", "str r0, [r1, #4]", "str r2, [r1]", "bx lr"]],
  ["func_00089720", ["ldrb r0, [r0, #0x119]", "cmp r0, #0", "movne r0, #1", "bx lr"]],
  ["func_0008B4B4", ["ldrh r0, [r0, #8]", "and r0, r0, #0xFF", "bx lr"]],
  ["func_0008BE50", ["ldr r0, [r0, #0x60]", "ldr r0, [r0, #0x1C]", "ldr r0, [r0, #0x20]", "bx lr"]],
  ["func_00090350", ["ldrb r0, [r0, #0x23C]", "cmp r0, #7", "moveq r0, #0", "movne r0, #1", "bx lr"]],
  ["func_0009F3E4", ["ldr r1, [r0, #0xAB0]", "mov r2, #0", "strb r2, [r0, #0xABA]", "str r1, [r0, #0xAA4]", "bx lr"]],
  ["func_0009F58C", ["ldr r1, [r0, #0xAA4]", "mov r2, #1", "strb r2, [r0, #0xABA]", "str r1, [r0, #0xAB0]", "bx lr"]],
  ["func_000D9C78", ["ldr r0, [r0, #0x1C]", "ldr r0, [r0, #0x0C]", "bx lr"]],
  ["func_000D9C84", ["ldr r0, [r0, #0x1C]", "ldr r0, [r0, #0x14]", "bx lr"]],
  ["func_000D9D18", ["ldrb r0, [r0, #0x28]", "cmp r0, #5", "moveq r0, #1", "movne r0, #0", "bx lr"]],
  ["func_000E5C38", ["ldrh r0, [r0, #0xDC]", "cmp r0, #4", "moveq r0, #1", "movne r0, #0", "bx lr"]],
]);

function fail(message) { throw new Error(`CRO DllField leaf-accessor validation: ${message}`); }
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
      "usage: validate-cro-field-leaf-accessors.mjs [--object-directory <path> --readelf <path> --objdump <path>]");
    const key = { "--object-directory": "objectDirectory", "--readelf": "readelf", "--objdump": "objdump" }[option];
    check(result[key] === undefined, `${option} was supplied more than once`);
    result[key] = resolve(value);
  }
  const count = [result.objectDirectory, result.readelf, result.objdump].filter((value) => value !== undefined).length;
  check(count === 0 || count === 3, "object validation requires --object-directory, --readelf, and --objdump together");
  if (count) {
    check(existsSync(result.objectDirectory) && statSync(result.objectDirectory).isDirectory(), "object directory is not a directory");
    for (const key of ["readelf", "objdump"])
      check(existsSync(result[key]) && statSync(result[key]).isFile(), `${key} is not a regular file`);
  }
  return result;
}
function normalizeInstruction(text) {
  let result = text.split(/[;@]/u)[0].trim().toLowerCase().replace(/\s+/gu, " ");
  if (result === "msr sp_hyp, lr, lsl pc") result = "bx lr";
  return result.replace(/#(?:0x[0-9a-f]+|[0-9]+)/gu, (token) => `#${Number(token.slice(1))}`);
}

function validateContract() {
  let config;
  try { config = JSON.parse(readFileSync(CONFIG_PATH, "utf8")); }
  catch (error) { fail(`cannot read config/cro-sources.json: ${error.message}`); }
  exactKeys(config, "schemaVersion,units", "config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "config version or units are invalid");
  const units = config.units.filter((entry) => entry.name === UNIT);
  check(units.length === 1, `${UNIT} ownership must be unique`);
  const unit = units[0];
  exactKeys(unit, "functions,name,sources", UNIT);
  check(Array.isArray(unit.sources) && Array.isArray(unit.functions), `${UNIT} ownership lists are invalid`);
  let previousSource = "";
  for (const [index, source] of unit.sources.entries()) {
    exactKeys(source, SOURCE_KEYS, `${UNIT} source ${index}`);
    check(source.mode === "arm" && typeof source.path === "string" && source.path > previousSource,
      `${UNIT} sources are not sorted ARM ownership`);
    previousSource = source.path;
  }
  check(unit.sources.filter((entry) => entry.path === SOURCE && entry.mode === "arm").length === 1,
    `${SOURCE} ownership is missing or ambiguous`);
  const sourceOwners = config.units.filter((entry) => entry.sources.some((source) => source.path === SOURCE));
  check(sourceOwners.length === 1 && sourceOwners[0].name === UNIT, `${SOURCE} ownership is not disjoint`);
  const sourcePath = resolve(ROOT, SOURCE);
  check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() &&
    !lstatSync(sourcePath).isSymbolicLink(), `${SOURCE} is not an owned regular file`);
  const assembly = readFileSync(sourcePath, "utf8");
  check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(assembly), `${SOURCE} contains encoded instructions or data`);
  check(!/\b(?:push|pop|stm|ldm|blx?|b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le))\b/iu.test(
    assembly.replace(/^\s*bx\s+lr\s*$/gimu, "")), `${SOURCE} contains a stack operation, call, or non-return branch`);
  check(!/\bpc\b/iu.test(assembly), `${SOURCE} contains PC-relative data or literals`);

  const functions = unit.functions.filter((fn) => fn.semantics === SEMANTICS);
  check(functions.length === SCHEDULES.size, `expected ${SCHEDULES.size} reviewed leaf accessors, found ${functions.length}`);
  let previousAddress = -1, bytes = 0, instructions = 0;
  const found = new Set();
  for (const [index, fn] of functions.entries()) {
    exactKeys(fn, FUNCTION_KEYS, `leaf accessor ${index}`);
    check(Number.isSafeInteger(fn.address) && fn.address > previousAddress, `${fn.name} is duplicated or unsorted`);
    previousAddress = fn.address;
    check(/^func_[0-9A-F]{8}$/u.test(fn.name) && fn.name === `func_${fn.address.toString(16).toUpperCase().padStart(8, "0")}`,
      `${fn.name} has an invalid address identity`);
    const schedule = SCHEDULES.get(fn.name);
    check(schedule !== undefined && fn.size === schedule.length * 4, `${fn.name} has an invalid schedule size`);
    check(!found.has(fn.name), `${fn.name} is claimed more than once`);
    found.add(fn.name); bytes += fn.size; instructions += schedule.length;
    const lines = readFileSync(join(ROOT, "symbols", "cro", `${UNIT}.csv`), "utf8").split(/\r?\n/u);
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(lines.filter((line) => line === row).length === 1, `public inventory lacks the exact ARM boundary for ${fn.name}`);
    check(lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1, `public inventory is ambiguous for ${fn.name}`);
  }
  check(bytes === 344 && instructions === 86, "aggregate contract must be exactly 344 bytes and 86 instructions");
  for (const name of SCHEDULES.keys()) {
    const owners = config.units.filter((entry) => entry.functions.some((fn) => fn.name === name));
    check(owners.length === 1 && owners[0].name === UNIT && found.has(name), `${name} ownership is missing or not disjoint`);
  }
  for (let index = 1; index < unit.functions.length; index++) {
    const left = unit.functions[index - 1], right = unit.functions[index];
    check(left.address < right.address && left.address + left.size <= right.address,
      `${left.name} and ${right.name} overlap or are not address-sorted`);
  }
  return { unit, functions };
}

function parseDisassembly(output) {
  const result = new Map();
  let current;
  for (const line of output.split("\n")) {
    const label = /^\s*[0-9a-f]+\s+<(func_[0-9A-F]{8})>:\s*$/iu.exec(line);
    if (label) { current = label[1].toUpperCase().replace("FUNC_", "func_"); result.set(current, []); continue; }
    const instruction = /^\s*([0-9a-f]+):\s+[0-9a-f]{8}\s+(.+?)\s*$/iu.exec(line);
    if (instruction && current) result.get(current).push({ offset: Number.parseInt(instruction[1], 16), text: normalizeInstruction(instruction[2]) });
  }
  return result;
}

function validateObject(contract, directory, readelf, objdump) {
  const object = join(directory, `${UNIT}.o`);
  check(existsSync(object) && lstatSync(object).isFile() && !lstatSync(object).isSymbolicLink(), `${UNIT} object is missing`);
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    `${UNIT} is not a relocatable ARM ELF`);
  const sectionsText = run(readelf, ["--sections", "--wide", object]);
  const sectionLines = sectionsText.split("\n");
  const allocated = [];
  for (const line of sectionLines) {
    const match = /^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    if (match && match[4].includes("A")) allocated.push({ index: Number(match[1]), name: match[2], size: Number.parseInt(match[3], 16), flags: match[4], line });
  }
  const configured = contract.unit.functions.map((fn) => `.text.${fn.name}`).sort();
  const allocatedNames = allocated.map((section) => section.name).sort();
  check(allocatedNames.length === configured.length && allocatedNames.every((name, index) => name === configured[index]),
    `${UNIT} has missing or extra allocated payload`);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  check(!/^[ \t]*\d+:[ \t]+\S+[ \t]+\d+[ \t]+\S+[ \t]+\S+[ \t]+\S+[ \t]+UND[ \t]+\S+/mu.test(symbols),
    `${UNIT} has undefined symbols`);
  for (const fn of contract.unit.functions) {
    const section = allocated.filter((entry) => entry.name === `.text.${fn.name}`);
    check(section.length === 1 && section[0].size === fn.size && section[0].flags === "AX",
      `${fn.name} does not own exactly one correctly sized AX section`);
    const functionSymbols = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
    check(functionSymbols.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+${section[0].index}\\s+${fn.name}$`, "u").test(functionSymbols[0]),
      `${fn.name} does not have exactly one global FUNC claim`);
    const armMappings = symbols.split("\n").filter((line) =>
      new RegExp(`^\\s*\\d+:\\s+00000000\\s+0\\s+NOTYPE\\s+LOCAL\\s+DEFAULT\\s+${section[0].index}\\s+\\$a$`, "u").test(line));
    check(armMappings.length === 1, `${fn.name} does not have exactly one ARM mapping symbol`);
  }
  const decoded = parseDisassembly(run(objdump, ["-d", "-marmv6k", object]));
  for (const fn of contract.functions) {
    const actual = decoded.get(fn.name), expected = SCHEDULES.get(fn.name).map(normalizeInstruction);
    check(actual && actual.length === expected.length && actual.every((item, index) => item.offset === index * 4 && item.text === expected[index]),
      `${fn.name} instruction schedule, predication, or order differs from the contract`);
  }
  check(/There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
    `${UNIT} unexpectedly has relocations`);
}

try {
  const options = parseArguments(process.argv.slice(2));
  const contract = validateContract();
  if (options.objectDirectory) validateObject(contract, options.objectDirectory, options.readelf, options.objdump);
  console.log(`Validated 21 DllField ARM leaf accessors (344 bytes, 86 instructions)${options.objectDirectory ? " and object" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
