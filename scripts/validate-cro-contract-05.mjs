#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");

// Numeric ARM words make aliases chosen by a particular disassembler irrelevant
// while still fixing every instruction, condition code, register and branch delta.
const CONTRACT = [
  ["DllBattleHouseConnect", "func_00000F54", 0xF54, "contract-05-store-u8", [
    0xE5C010D9, 0xE12FFF1E,
  ]],
  ["DllKawaigariArrange", "func_00005028", 0x5028, "contract-05-kawaigari-arrange", [
    0xE5901034, 0xE1A02001, 0xE591100C, 0xE5D2303B, 0xE1D104F0, 0xE1D114F2,
    0xE3530000, 0x0A000006, 0xE3500000, 0xB0800001, 0xBA000001, 0xE1510000,
    0xD0400001, 0xE5C2003D, 0xE12FFF1E, 0xE3500000, 0xB0800001, 0xBA000001,
    0xE1510000, 0xD0400001, 0xE5C2003C, 0xE592000C, 0xE590002C, 0xE5900000,
    0xE5C2003F, 0xE12FFF1E,
  ]],
  ["DllPoke3Select", "func_00002694", 0x2694, "contract-05-poke3-select", [
    0xEC910A03, 0xE3A0C000, 0xED800A01, 0xEDC00A02, 0xED801A03, 0xEC910A03,
    0xED800A07, 0xEDC00A08, 0xED801A09, 0xEC920A03, 0xED800A04, 0xEDC00A05,
    0xED801A06, 0xE580302C, 0xE580C028, 0xE5C0C030, 0xE12FFF1E,
  ]],
  ["DllSparring", "func_0000CE58", 0xCE58, "contract-05-sparring-write", [
    0xE92D01F0, 0xE0811181, 0xE3A06010, 0xE5905000, 0xE59DC014, 0xEE003A10,
    0xE0858101, 0xE3A04004, 0xE5C8C000, 0xE086C101, 0xE5906000, 0xE0844101,
    0xEEF80A40, 0xE3A0700C, 0xE7862004, 0xE5902000, 0xEE003A10, 0xE0875101,
    0xE3A07014, 0xE7823005, 0xE5902000, 0xE0871101, 0xEEB80A40, 0xE082200C,
    0xEDC20A00, 0xE5900000, 0xE0800001, 0xED800A00, 0xE8BD01F0, 0xE12FFF1E,
  ]],
  ["DllTestPGL", "func_00000000", 0, "contract-05-store-u8", [
    0xE5C010D9, 0xE12FFF1E,
  ]],
  ["DllTrainingAppManager", "func_00000BE4", 0xBE4, "contract-05-store-u8", [
    0xE5C010D9, 0xE12FFF1E,
  ]],
  ["DllUSAreaFriendShip", "func_00001AC0", 0x1AC0, "contract-05-friendship-copy", [
    0xE5912000, 0xE2813014, 0xE5802000, 0xE5912004, 0xE5802004, 0xE5D12008,
    0xE5C02008, 0xE1D120BA, 0xE1C020BA, 0xE591200C, 0xE580200C, 0xE5912010,
    0xE5802010, 0xE2802014, 0xEC930A03, 0xEC820A03, 0xE5911020, 0xE5801020,
    0xE12FFF1E,
  ]],
  ["DllUSAreaFriendShip", "func_00001B0C", 0x1B0C, "contract-05-friendship-pack", [
    0xE52D4004, 0xE28DC008, 0xE59D4004, 0xED9D0A05, 0xECDC0A02, 0xE59DC010,
    0xE8800006, 0xE2801014, 0xE5C03008, 0xE1C040BA, 0xEDC00A03, 0xED801A04,
    0xE89C100C, 0xE881100C, 0xED800A08, 0xE49D4004, 0xE12FFF1E,
  ]],
].map(([unit, name, address, semantics, words]) => ({
  unit, name, address, semantics, words, size: words.length * 4,
  source: `src/cro/${unit}/contract_05.S`,
}));

function fail(message) { throw new Error(`CRO contract 05 validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
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
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-contract-05.mjs [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : "readelf";
    check(options[key] === undefined, `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check((options.objectDirectory === undefined) === (options.readelf === undefined),
    "--object-directory and --readelf must be supplied together");
  if (options.objectDirectory) {
    check(existsSync(options.objectDirectory) && statSync(options.objectDirectory).isDirectory(), "object directory is invalid");
    check(existsSync(options.readelf) && statSync(options.readelf).isFile(), "readelf is invalid");
  }
  return options;
}
function littleEndianHex(word) {
  return word.toString(16).padStart(8, "0").match(/../gu).reverse().join("");
}
function sectionBytes(readelf, object, section) {
  const output = run(readelf, ["--hex-dump", section, object]);
  const groups = [];
  for (const line of output.split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      groups.push(token.toLowerCase());
    }
  }
  return groups;
}

function validatePublicContract() {
  let config;
  try { config = JSON.parse(readFileSync(CONFIG_PATH, "utf8")); }
  catch (error) { fail(`cannot read config/cro-sources.json: ${error.message}`); }
  check(config?.schemaVersion === 1 && Array.isArray(config.units), "config schema is invalid");
  const unitNames = config.units.map((unit) => unit.name);
  check(unitNames.every((name, index) => index === 0 || name > unitNames[index - 1]), "config units are not sorted");

  const byUnit = new Map();
  for (const fn of CONTRACT) {
    const unit = config.units.find((entry) => entry.name === fn.unit);
    const trainingSupplement = fn.unit === "DllTrainingAppManager";
    const exactSources = trainingSupplement
      ? unit?.sources.length === 2 &&
        unit.sources[0].path === fn.source && unit.sources[0].mode === "arm" &&
        unit.sources[1].path === "src/cro/DllTrainingAppManager/verified_leaves.S" && unit.sources[1].mode === "arm"
      : unit?.sources.length === 1 && unit.sources[0].path === fn.source && unit.sources[0].mode === "arm";
    check(unit && exactSources,
      `${fn.unit} does not have exact ARM source ownership`);
    const claim = unit.functions.find((entry) => entry.name === fn.name);
    check(claim && Object.keys(claim).sort().join(",") === "address,name,semantics,size" &&
      claim.address === fn.address && claim.size === fn.size && claim.semantics === fn.semantics,
    `${fn.name} config claim is not exact`);
    check(unit.functions.length === (trainingSupplement ? 7 : CONTRACT.filter((entry) => entry.unit === fn.unit).length),
      `${fn.unit} has an unexpected function claim`);
    byUnit.set(fn.unit, unit);

    const inventory = join(ROOT, "symbols", "cro", `${fn.unit}.csv`);
    check(existsSync(inventory) && lstatSync(inventory).isFile() && !lstatSync(inventory).isSymbolicLink(),
      `${fn.unit} public inventory is missing`);
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    const lines = readFileSync(inventory, "utf8").split(/\r?\n/u);
    check(lines.filter((line) => line === row).length === 1 && lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name} lacks one exact global ARM inventory boundary`);
  }

  for (const unit of byUnit.values()) {
    const path = resolve(ROOT, unit.sources[0].path);
    check(inside(ROOT, path) && existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(),
      `${unit.sources[0].path} is not an owned regular file`);
    const source = readFileSync(path, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(source), `${unit.sources[0].path} contains encoded data`);
    const owned = CONTRACT.filter((entry) => entry.unit === unit.name);
    check((source.match(/^\.section \.text\.func_[0-9A-F]{8}, "ax", %progbits$/gmu) ?? []).length === owned.length,
      `${unit.sources[0].path} does not define one executable section per function`);
    for (const fn of owned) {
      for (const fragment of [`.section .text.${fn.name}, "ax", %progbits`, `.global ${fn.name}`,
        `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`]) {
        check(source.split(fragment).length === 2, `${fn.source} lacks one exact ${fn.name} declaration`);
      }
    }
  }
  check(CONTRACT.length === 8 && byUnit.size === 7 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 460 &&
    CONTRACT.reduce((sum, fn) => sum + fn.words.length, 0) === 115, "aggregate contract totals are invalid");
  return byUnit;
}

function validateObjects(byUnit, directory, readelf) {
  for (const [unitName, unit] of byUnit) {
    const object = join(directory, `${unitName}.o`);
    check(existsSync(object) && lstatSync(object).isFile() && !lstatSync(object).isSymbolicLink(), `${unitName} object is missing`);
    const header = run(readelf, ["--file-header", object]);
    check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
      `${unitName} is not a relocatable ARM ELF`);
    const sections = run(readelf, ["--sections", "--wide", object]);
    const allocated = sections.split("\n").flatMap((line) => {
      const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
      return match && match[3].includes("A") ? [[match[1], Number.parseInt(match[2], 16), match[3]]] : [];
    });
    const expectedNames = unit.functions.map((fn) => `.text.${fn.name}`).sort();
    const actualNames = allocated.map(([name]) => name).sort();
    check(actualNames.length === expectedNames.length && actualNames.every((name, index) => name === expectedNames[index]),
      `${unitName} has missing or adjacent allocated bytes`);
    const symbols = run(readelf, ["--symbols", "--wide", object]);
    for (const fn of CONTRACT.filter((entry) => entry.unit === unitName)) {
      const section = `.text.${fn.name}`;
      const sectionInfo = allocated.filter(([name]) => name === section);
      check(sectionInfo.length === 1 && sectionInfo[0][1] === fn.size && sectionInfo[0][2].includes("X"),
        `${fn.name} section boundary or flags are invalid`);
      const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
      check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolLines[0]),
        `${fn.name} is not one exact global function symbol`);
      const expected = fn.words.map(littleEndianHex);
      const actual = sectionBytes(readelf, object, section);
      check(actual.length === expected.length && actual.every((word, index) => word === expected[index]),
        `${fn.name} instruction schedule differs at word ${actual.findIndex((word, index) => word !== expected[index])}`);
    }
    check(/There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
      `${unitName} unexpectedly has relocations`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  const units = validatePublicContract();
  if (options.objectDirectory) validateObjects(units, options.objectDirectory, options.readelf);
  console.log(`Validated CRO contract 05: 8 ARM functions in 7 units (460 bytes, 115 instructions, zero relocations/adjacent bytes)${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
