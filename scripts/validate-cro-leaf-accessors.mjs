#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const UNIT = "DllBattle";
const SOURCE = "src/cro/DllBattle/leaf_accessors.S";
const SEMANTICS = "leaf-accessor";
const FUNCTION_KEYS = "address,name,semantics,size";
const SOURCE_KEYS = "mode,path";

const SCHEDULES = new Map([
  ["func_00015B74", ["cmp r0, #2", "cmpne r0, #3", "moveq r0, #1", "movne r0, #0", "bx lr"]],
  ["func_0001D5FC", ["add r0, r0, #0xC00", "add r0, r0, #0xA4", "bx lr"]],
  ["func_0001D900", ["add r0, r0, #0x4600", "ldrh r0, [r0, #0x74]", "bx lr"]],
  ["func_0003AFDC", ["mov r1, #0", "str r1, [r0, #0x6BC]", "bx lr"]],
  ["func_00047B98", ["ldr r0, [r0, #0x84C]", "ldrsb r0, [r0, #4]", "bx lr"]],
  ["func_0004F18C", ["ldr r0, [r0, #4]", "ldr r0, [r0, #0x10]", "ldrb r0, [r0, #6]", "bx lr"]],
  ["func_0004F19C", ["ldr r0, [r0, #0x1C]", "ldrb r0, [r0, #1]", "bx lr"]],
  ["func_0004F340", ["ldrb r0, [r0, #0x1B]", "and r0, r0, #0x40", "lsr r0, r0, #6", "bx lr"]],
  ["func_0004F788", ["mov r1, #0", "str r1, [r0, #0x0C]", "bx lr"]],
  ["func_0004FBA0", ["cmp r0, #2", "cmpne r0, #5", "moveq r0, #1", "movne r0, #0", "bx lr"]],
  ["func_0004FFC0", ["ldr r0, [r0, #4]", "ldr r0, [r0, #0x10]", "ldrb r0, [r0, #0x10]", "bx lr"]],
  ["func_00050078", ["ldr r0, [r0, #0x1C]", "ldrb r0, [r0, #9]", "bx lr"]],
  ["func_00050268", ["cmp r0, #12", "movhs r0, #0", "movlo r0, #1", "bx lr"]],
  ["func_00050278", ["cmp r0, #1", "cmpne r0, #6", "moveq r0, #1", "movne r0, #0", "bx lr"]],
  ["func_000506C0", ["ldr r0, [r0, #0xDB4]", "strb r1, [r0, #4]", "bx lr"]],
  ["func_000506CC", ["cmp r0, #6", "movlo r0, #1", "movhs r0, #0", "bx lr"]],
  ["func_000506DC", ["ldr r0, [r0, #4]", "ldr r0, [r0, #0x10]", "ldrb r0, [r0, #1]", "bx lr"]],
  ["func_00050788", ["cmp r0, #12", "movhs r0, #1", "movlo r0, #0", "bx lr"]],
  ["func_000507E8", ["add r0, r0, #0x1000", "ldrb r0, [r0, #0x93]", "and r0, r0, #1", "bx lr"]],
  ["func_00050A40", ["add r0, r0, #0x100", "ldrh r0, [r0, #0x62]", "bx lr"]],
  ["func_00050B78", ["mov r1, #1", "orr r0, r1, r0, lsl #9", "bx lr"]],
  ["func_00050EC8", ["mov r1, #6", "strb r1, [r0, #0x10]", "bx lr"]],
  ["func_00050ED4", ["add r0, r0, #0x1000", "ldr r0, [r0, #0x80]", "cmp r0, #0", "movne r0, #1", "bx lr"]],
  ["func_00050FC4", ["add r0, r0, #0x100", "ldrh r0, [r0, #0x60]", "bx lr"]],
  ["func_00051134", ["ldr r1, [r0, #0x18]", "tst r1, #0x01000000", "orrne r1, r1, #0x10000000", "strne r1, [r0, #0x18]", "bx lr"]],
  ["func_00051B2C", ["ldr r0, [r0, #0x14]", "uxth r0, r0", "bx lr"]],
  ["func_00056AE4", ["ldrb r0, [r0, #0x1B]", "and r0, r0, #0x20", "lsr r0, r0, #5", "bx lr"]],
  ["func_00057380", ["rsb r1, r1, r1, lsl #3", "add r0, r0, r1, lsl #1", "add r0, r0, #0x100", "ldrh r0, [r0, #0x16]", "bx lr"]],
  ["func_00059524", ["ldr r0, [r0, #4]", "ldr r0, [r0, #0x10]", "ldrb r0, [r0]", "bx lr"]],
  ["func_0005E920", ["ldr r0, [r0, #0x10]", "ldr r0, [r0, #0xA8]", "ands r0, r0, r1", "movne r0, #1", "bx lr"]],
  ["func_00062290", ["ldrb r2, [r0, #0x18]", "cmp r2, r1", "ldrhi r0, [r0, r1, lsl #2]", "movls r0, #0", "bx lr"]],
  ["func_0007C16C", ["ldrb r0, [r0, #0x698]", "cmp r0, #3", "moveq r0, #1", "movne r0, #0", "bx lr"]],
  ["func_0007C1FC", ["ldrb r2, [r0, #0x18]", "cmp r2, r1", "ldrhi r0, [r0, r1, lsl #2]", "movls r0, #0", "bx lr"]],
  ["func_0007C980", ["mov r1, #504", "and r0, r1, r0, lsl #3", "orr r0, r0, #3", "bx lr"]],
  ["func_000864BC", ["ldrh r1, [r0, #2]", "orr r1, r1, #0x8000", "strh r1, [r0, #2]", "bx lr"]],
  ["func_00087A6C", ["ldrb r0, [r0, #0x10]", "cmp r0, #6", "moveq r0, #1", "movne r0, #0", "bx lr"]],
  ["func_00088EA8", ["ldr r1, [r0, #0x18]", "orr r1, r1, #0x04000000", "str r1, [r0, #0x18]", "bx lr"]],
  ["func_000A6C6C", ["cmp r0, r1", "movlt r0, r1", "bx lr"]],
  ["func_000C4AE0", ["ldr r0, [r1, #0x18]", "cmp r0, #0", "movne r0, #1", "bx lr"]],
  ["func_000D0C68", ["ldrb r0, [r0, #0x81C]", "and r0, r0, #4", "lsr r0, r0, #2", "bx lr"]],
  ["func_000D1730", ["ldrb r0, [r0, #5]", "cmp r0, #0", "movne r0, #1", "bx lr"]],
  ["func_000D1990", ["ldrb r1, [r0, #0x1B]", "tst r1, #0x20", "ldrhne r0, [r0, #0xF4]", "ldrheq r0, [r0, #0x0C]", "bx lr"]],
  ["func_000D19CC", ["add r0, r0, #0x100", "ldrh r0, [r0, #0x5C]", "bx lr"]],
  ["func_000D1A58", ["add r0, r0, #0x100", "ldrh r0, [r0, #0x50]", "bx lr"]],
  ["func_000D1AA4", ["ldrb r2, [r0, #0x19]", "cmp r2, r1", "ldrbhi r0, [r0, r1]", "movls r0, #6", "bx lr"]],
]);

function fail(message) { throw new Error(`CRO leaf-accessor validation: ${message}`); }
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
      "usage: validate-cro-leaf-accessors.mjs [--object-directory <path> --readelf <path> --objdump <path>]");
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
  result = result.replace(/^movcs\b/u, "movhs").replace(/^movcc\b/u, "movlo");
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
  const sourceOwners = config.units.filter((entry) =>
    Array.isArray(entry.sources) && entry.sources.some((source) => source.path === SOURCE));
  check(sourceOwners.length === 1 && sourceOwners[0].name === UNIT, `${SOURCE} ownership is not disjoint`);
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
  const sourcePath = resolve(ROOT, SOURCE);
  check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() &&
    !lstatSync(sourcePath).isSymbolicLink(), `${SOURCE} is not an owned regular file`);
  const assembly = readFileSync(sourcePath, "utf8");
  check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(assembly), `${SOURCE} contains encoded instructions or data`);
  check(!/\b(?:blx?|b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le))\b/iu.test(
    assembly.replace(/^\s*bx\s+lr\s*$/gimu, "")), `${SOURCE} contains a call or non-return branch`);

  const functions = unit.functions.filter((fn) => fn.semantics === SEMANTICS);
  check(functions.length === SCHEDULES.size, `expected ${SCHEDULES.size} leaf accessors, found ${functions.length}`);
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
    const inventory = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
    const expectedRow = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    const lines = readFileSync(inventory, "utf8").split(/\r?\n/u);
    check(lines.filter((line) => line === expectedRow).length === 1, `public inventory lacks the exact ARM boundary for ${fn.name}`);
    check(lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1, `public inventory is ambiguous for ${fn.name}`);
  }
  for (const name of SCHEDULES.keys()) check(found.has(name), `${name} is not claimed by ${UNIT}`);
  check(bytes === 708 && instructions === 177, "aggregate contract must be exactly 708 bytes and 177 instructions");
  const claimed = new Map();
  for (const owner of config.units) for (const fn of owner.functions) {
    if (!SCHEDULES.has(fn.name)) continue;
    check(!claimed.has(fn.name), `${fn.name} is owned by both ${claimed.get(fn.name)} and ${owner.name}`);
    claimed.set(fn.name, owner.name);
  }
  check([...claimed.values()].every((owner) => owner === UNIT), "leaf accessor ownership is not disjoint");
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
  const allocatedNames = [];
  for (const line of sectionLines) {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    if (match && match[3].includes("A")) allocatedNames.push(match[1]);
  }
  const configured = contract.unit.functions.map((fn) => `.text.${fn.name}`).sort();
  allocatedNames.sort();
  check(allocatedNames.length === configured.length && allocatedNames.every((name, index) => name === configured[index]),
    `${UNIT} has missing or non-code allocated payload`);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  check(!/^\s*\d+:\s+\S+\s+\d+\s+\S+\s+GLOBAL\s+\S+\s+UND\s+/mu.test(symbols), `${UNIT} has undefined globals`);
  const decoded = parseDisassembly(run(objdump, ["-d", "-marmv6k", object]));
  for (const fn of contract.functions) {
    const section = `.text.${fn.name}`;
    const sectionMatches = sectionLines.filter((line) => line.includes(section));
    check(sectionMatches.length === 1 && new RegExp(`PROGBITS\\s+\\S+\\s+\\S+\\s+${fn.size.toString(16).padStart(6, "0")}\\s+\\S+\\s+AX\\s`, "iu").test(sectionMatches[0]),
      `${fn.name} section size or flags are invalid`);
    const symbolMatches = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
    check(symbolMatches.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolMatches[0]),
      `${fn.name} symbol size or binding is invalid`);
    const actual = decoded.get(fn.name), expected = SCHEDULES.get(fn.name).map(normalizeInstruction);
    check(actual && actual.length === expected.length && actual.every((item, index) => item.offset === index * 4 && item.text === expected[index]),
      `${fn.name} instruction schedule or order differs from the contract`);
  }
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  check(/There are no relocations in this file\./u.test(relocations), `${UNIT} unexpectedly has relocations`);
}

try {
  const options = parseArguments(process.argv.slice(2));
  const contract = validateContract();
  if (options.objectDirectory) validateObject(contract, options.objectDirectory, options.readelf, options.objdump);
  console.log(`Validated 45 DllBattle ARM leaf accessors (708 bytes, 177 instructions)${options.objectDirectory ? " and object" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
