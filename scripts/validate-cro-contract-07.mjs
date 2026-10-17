#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-07-proposal.json");

// Numeric ARM words pin each instruction independently of disassembler aliases.
const CONTRACT = [
  ["DllKawaigari", "func_000039EC", 0x39EC, "contract-07-pointer-init",
    [0xE2801E87, 0xE5801CA8, 0xE3A00000, 0xE12FFF1E]],
  ["DllKawaigari", "func_000137C4", 0x137C4, "contract-07-fixed-size",
    [0xE1A00000, 0xE3A00D21, 0xE12FFF1E]],
  ["DllKawaigari", "func_00021EBC", 0x21EBC, "contract-07-zero-halfword-normalize",
    [0xE16F0F10, 0xE6FF0070, 0xE12FFF1E]],
  ["DllKawaigari", "func_0002335C", 0x2335C, "contract-07-sign-size",
    [0xE3500000, 0xB3A00000, 0xA3A00020, 0xE12FFF1E]],
  ["DllSangoZukan", "func_00001788", 0x1788, "contract-07-key-equality",
    [0xE3500FB3, 0x03510000, 0x13A00000, 0x03A00001, 0xE12FFF1E]],
  ["DllSangoZukan", "func_00011AE0", 0x11AE0, "contract-07-default-selection",
    [0xE3510000, 0x0590102C, 0xE5801028, 0xE12FFF1E]],
  ["DllSangoZukan", "func_00015D40", 0x15D40, "contract-07-indexed-load",
    [0xE0800101, 0xE590005C, 0xE12FFF1E]],
  ["DllSangoZukan", "func_00018CB8", 0x18CB8, "contract-07-pointer-chase",
    [0xE5900020, 0xE590000C, 0xE12FFF1E]],
  ["DllSangoZukan", "func_0002A718", 0x2A718, "contract-07-null-test",
    [0xE5900070, 0xE3500000, 0x03A00001, 0x13A00000, 0xE12FFF1E]],
  ["DllSangoZukan", "func_0002A72C", 0x2A72C, "contract-07-state-test",
    [0xE5900070, 0xE3500004, 0x03A00001, 0x13A00000, 0xE12FFF1E]],
].map(([unit, name, address, semantics, words]) => ({
  unit, name, address, semantics, words, size: words.length * 4,
  source: `src/cro/${unit}/contract_07.S`,
}));

function fail(message) { throw new Error(`CRO contract 07 validation: ${message}`); }
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
function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}
function parseArguments(argv) {
  const options = { manifest: CONFIG_PATH };
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--manifest", "--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-contract-07.mjs [--manifest <path>] [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined || (key === "manifest" && options[key] === CONFIG_PATH),
      `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(options.manifest === CONFIG_PATH || options.manifest === PROPOSAL_PATH,
    "--manifest may select only config/cro-sources.json or config/cro-contract-07-proposal.json");
  check((options.objectDirectory === undefined) === (options.readelf === undefined),
    "--object-directory and --readelf must be supplied together");
  if (options.objectDirectory) {
    check(existsSync(options.objectDirectory) && statSync(options.objectDirectory).isDirectory(), "object directory is invalid");
    check(existsSync(options.readelf) && statSync(options.readelf).isFile(), "readelf is invalid");
  }
  return options;
}
function readManifest(path) {
  let manifest;
  try { manifest = JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { fail(`cannot read ${relative(ROOT, path)}: ${error.message}`); }
  exactKeys(manifest, "schemaVersion,units", "manifest");
  check(manifest.schemaVersion === 1 && Array.isArray(manifest.units), "manifest schema is invalid");
  const names = manifest.units.map((unit) => unit.name);
  check(names.every((name, index) => index === 0 || name > names[index - 1]), "manifest units are not sorted");
  return manifest;
}
function littleEndianHex(word) {
  return word.toString(16).padStart(8, "0").match(/../gu).reverse().join("");
}
function sectionBytes(readelf, object, section) {
  const groups = [];
  for (const line of run(readelf, ["--hex-dump", section, object]).split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      groups.push(token.toLowerCase());
    }
  }
  return groups;
}

function validateProposal(proposal, existing) {
  check(proposal.units.length === 2, "proposal has an unexpected unit count");
  const counts = new Map([["DllKawaigari", 4], ["DllSangoZukan", 6]]);
  for (const [unitName, count] of counts) {
    const unit = proposal.units.find((entry) => entry.name === unitName);
    exactKeys(unit, "functions,name,source", `${unitName} proposal`);
    exactKeys(unit.source, "mode,path", `${unitName} proposal source`);
    check(unit.source.path === `src/cro/${unitName}/contract_07.S` && unit.source.mode === "arm",
      `${unitName} proposal source is not exact`);
    check(Array.isArray(unit.functions) && unit.functions.length === count, `${unitName} proposal function count is invalid`);
    const oldUnit = existing.units.find((entry) => entry.name === unitName);
    check(oldUnit, `${unitName} existing unit is missing`);
    const integratedSources = oldUnit.sources.filter((source) => source.path === unit.source.path);
    check(integratedSources.length <= 1 && (integratedSources.length === 0 || integratedSources[0].mode === unit.source.mode),
      `${unitName} proposal source has partial or conflicting ownership`);
    const integrated = integratedSources.length === 1;
    for (const claim of unit.functions) {
      exactKeys(claim, "address,name,semantics,size", `${unitName} proposal claim`);
      const overlaps = oldUnit.functions.filter((old) => old.name === claim.name ||
        (old.address === claim.address && old.size === claim.size));
      if (integrated) {
        check(overlaps.length === 1 && Object.keys(overlaps[0]).sort().join(",") === "address,name,semantics,size" &&
          overlaps[0].name === claim.name && overlaps[0].address === claim.address && overlaps[0].size === claim.size &&
          overlaps[0].semantics === claim.semantics, `${claim.name} integrated claim is not exact`);
      } else {
        check(overlaps.length === 0, `${claim.name} proposal overlaps an existing claim`);
      }
    }
  }
}

function validatePublicContract(manifestPath) {
  const proposal = readManifest(PROPOSAL_PATH);
  const existing = readManifest(CONFIG_PATH);
  validateProposal(proposal, existing);
  const selected = manifestPath === PROPOSAL_PATH ? proposal : existing;
  const selectedByUnit = new Map();

  for (const fn of CONTRACT) {
    const proposedUnit = proposal.units.find((entry) => entry.name === fn.unit);
    const proposedClaims = proposedUnit.functions.filter((claim) => claim.name === fn.name);
    check(proposedClaims.length === 1 && proposedClaims[0].address === fn.address && proposedClaims[0].size === fn.size &&
      proposedClaims[0].semantics === fn.semantics, `${fn.name} proposal claim is not exact`);

    const unit = selected.units.find((entry) => entry.name === fn.unit);
    check(unit, `${fn.unit} is absent from the selected manifest`);
    if (manifestPath === PROPOSAL_PATH) {
      check(unit.source.path === fn.source && unit.source.mode === "arm", `${fn.unit} selected proposal source is not exact`);
    } else {
      check(Array.isArray(unit.sources) && unit.sources.filter((source) => source.path === fn.source && source.mode === "arm").length === 1,
        `${fn.unit} lacks one exact integrated ARM source claim`);
    }
    const claims = unit.functions.filter((claim) => claim.name === fn.name);
    check(claims.length === 1 && Object.keys(claims[0]).sort().join(",") === "address,name,semantics,size" &&
      claims[0].address === fn.address && claims[0].size === fn.size && claims[0].semantics === fn.semantics,
      `${fn.name} selected-manifest claim is not exact`);
    selectedByUnit.set(fn.unit, unit);

    const inventory = join(ROOT, "symbols", "cro", `${fn.unit}.csv`);
    check(existsSync(inventory) && lstatSync(inventory).isFile() && !lstatSync(inventory).isSymbolicLink(),
      `${fn.unit} public inventory is missing`);
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    const lines = readFileSync(inventory, "utf8").split(/\r?\n/u);
    check(lines.filter((line) => line === row).length === 1 && lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name} lacks one exact global ARM inventory boundary`);
  }

  for (const [unitName, unit] of selectedByUnit) {
    const path = resolve(ROOT, `src/cro/${unitName}/contract_07.S`);
    check(inside(ROOT, path) && existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(),
      `${relative(ROOT, path)} is not an owned regular file`);
    const source = readFileSync(path, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(source), `${relative(ROOT, path)} contains encoded data`);
    const owned = CONTRACT.filter((entry) => entry.unit === unitName);
    check((source.match(/^\.section \.text\.func_[0-9A-F]{8}, "ax", %progbits$/gmu) ?? []).length === owned.length,
      `${relative(ROOT, path)} does not define one executable section per function`);
    for (const fn of owned) {
      for (const fragment of [`.section .text.${fn.name}, "ax", %progbits`, `.global ${fn.name}`,
        `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`]) {
        check(source.split(fragment).length === 2, `${relative(ROOT, path)} lacks one exact ${fn.name} declaration`);
      }
    }
    const inventoryLines = readFileSync(join(ROOT, "symbols", "cro", `${unitName}.csv`), "utf8").split(/\r?\n/u);
    check(inventoryLines.filter((line) => /^[0-9A-F]{8},/u.test(line)).length > unit.functions.length,
      `${unitName} would incorrectly appear function-complete`);
  }
  check(CONTRACT.length === 10 && selectedByUnit.size === 2 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 156 &&
    CONTRACT.reduce((sum, fn) => sum + fn.words.length, 0) === 39, "aggregate contract totals are invalid");
  return selectedByUnit;
}

function validateObjects(units, manifestPath, directory, readelf) {
  for (const [unitName, unit] of units) {
    const object = join(directory, `${unitName}.o`);
    check(existsSync(object) && lstatSync(object).isFile() && !lstatSync(object).isSymbolicLink(), `${unitName} object is missing`);
    const header = run(readelf, ["--file-header", object]);
    check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
      `${unitName} is not a relocatable ARM ELF`);
    const sections = run(readelf, ["--sections", "--wide", object]);
    const allocated = sections.split("\n").flatMap((line) => {
      const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
      return match && match[3].includes("A") && Number.parseInt(match[2], 16) !== 0
        ? [[match[1], Number.parseInt(match[2], 16), match[3]]] : [];
    });
    const expectedNames = unit.functions.map((claim) => `.text.${claim.name}`).sort();
    const actualNames = allocated.map(([name]) => name).sort();
    check(actualNames.length === expectedNames.length && actualNames.every((name, index) => name === expectedNames[index]),
      `${unitName} has missing or extra allocated bytes`);
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
  const units = validatePublicContract(options.manifest);
  if (options.objectDirectory) validateObjects(units, options.manifest, options.objectDirectory, options.readelf);
  console.log(`Validated CRO contract 07: 10 ARM functions in 2 units (156 bytes, 39 instructions, zero relocations/adjacent bytes)${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
