#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-06-proposal.json");

// Numeric ARM words make disassembler aliases irrelevant while pinning every
// instruction, condition code, register, immediate and control-flow delta.
const CONTRACT = [
  ["DllBoxSearch", "func_00002C0C", 0x2C0C, "contract-06-box-search-dispatch", [
    0xE52DE004, 0xE24DD00C, 0xEDDF0A09, 0xE28D1004, 0xEDCD0A00, 0xE1A0300D,
    0xEC810A02, 0xE3A02055, 0xE5900004, 0xE3A01001, 0xEBFFF59D, 0xE28DD00C,
    0xE49DF004,
  ]],
  ["DllDendouDemo", "func_000022D4", 0x22D4, "contract-06-float-vector-fill", [
    0xED9F0A08, 0xED800A00, 0xED800A01, 0xED800A02, 0xED800A03, 0xED800A04,
    0xED800A05, 0xED800A06, 0xED800A07, 0xE12FFF1E,
  ]],
  ["DllFieldEventSkatePipe", "func_00000BD4", 0xBD4, "contract-06-skate-pipe-dispatch", [
    0xE92D4030, 0xE1A04000, 0xE5900018, 0xE24DD03C, 0xE1A05001, 0xE590210C,
    0xE1A0000D, 0xE592107C, 0xEBFFFD05, 0xE5940020, 0xE3A03001, 0xE1A0200D,
    0xE1A01005, 0xEBFFFD0C, 0xE5940020, 0xE28D2038, 0xE1A0100D, 0xEBFFFD12,
    0xE59D0038, 0xEBFFFD18, 0xE28DD03C, 0xE8BD8030,
  ]],
  ["DllHeading", "func_0000545C", 0x545C, "contract-06-heading-dispatch", [
    0xE92D4038, 0xE1A04000, 0xE59F0034, 0xE3A03000, 0xE0805181, 0xE5941010,
    0xE5D52004, 0xE2840004, 0xEBFFEB25, 0xE3A00001, 0xE58D0000, 0xE5D52004,
    0xE5941010, 0xE3A03000, 0xE2840004, 0xEBFFEAEE, 0xE8BD8038,
  ]],
  ["DllStatus", "func_00007898", 0x7898, "contract-06-status-pair-store", [
    0xE92D0030, 0xE59D400C, 0xE59DC008, 0xE3540000, 0x159F1048, 0x11C123D8,
    0x1A00000D, 0xE35C0000, 0x0A00000A, 0xE591C088, 0xE35C0000, 0x1A000004,
    0xE591408C, 0xE3140001, 0x0A000004, 0xE3540000, 0x0A000002, 0xE591308C,
    0xE1A0200C, 0xEA000000, 0xE1C128F8, 0xE1C020F0, 0xE8BD0030, 0xE12FFF1E,
  ]],
  ["DllUSR113", "func_00000CD4", 0xCD4, "contract-06-indexed-buffer-read", [
    0xE92D4010, 0xE2514000, 0xE24DD040, 0xE1A02000, 0xAA000006, 0xE3A02000,
    0xE1A01002, 0xE1A00002, 0xEBFFFCD7, 0xE28DD040, 0xE3A00001, 0xE8BD8010,
    0xE5921014, 0xE28D0020, 0xE3A02020, 0xEBFFFCD6, 0xE28D0020, 0xEC900A08,
    0xEC8D0A08, 0xE7DD0004, 0xE28DD040, 0xE8BD8010,
  ]],
  ["DllUSGymElec", "func_00001FB0", 0x1FB0, "contract-06-gym-object-state", [
    0xE3700018, 0xE92D4010, 0x0A000012, 0xE0800101, 0xE5904018, 0xE3540000,
    0x0A00000E, 0xE5940000, 0xE3A01000, 0xE59020F4, 0xE1A00004, 0xE12FFF32,
    0xE3500000, 0x0A000006, 0xE5940000, 0xE3A01000, 0xED9F0A06, 0xE59020D4,
    0xE1A00004, 0xE12FFF32, 0xE3A00001, 0xE8BD8010, 0xE3A00000, 0xE8BD8010,
  ]],
  ["DllVSDemo", "func_000018A8", 0x18A8, "contract-06-vs-demo-placement", [
    0xE52DE004, 0xE24DD014, 0xED9F0A0C, 0xEDDF0A0C, 0xED8D0A00, 0xED8D0A01,
    0xE28D2008, 0xE1A0100D, 0xE3A00000, 0xEC820A02, 0xEBFFFA36, 0xE1A0100D,
    0xE3A00001, 0xEBFFFA33, 0xE28DD014, 0xE49DF004,
  ]],
].map(([unit, name, address, semantics, words]) => ({
  unit, name, address, semantics, words, size: words.length * 4,
  source: `src/cro/${unit}/contract_06.S`,
}));

function fail(message) { throw new Error(`CRO contract 06 validation: ${message}`); }
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
  const options = { manifest: CONFIG_PATH };
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--manifest", "--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-contract-06.mjs [--manifest <path>] [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined || (key === "manifest" && options[key] === CONFIG_PATH), `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(options.manifest === CONFIG_PATH || options.manifest === PROPOSAL_PATH,
    "--manifest may select only config/cro-sources.json or config/cro-contract-06-proposal.json");
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
function readManifest(path) {
  let manifest;
  try { manifest = JSON.parse(readFileSync(path, "utf8")); }
  catch (error) { fail(`cannot read ${relative(ROOT, path)}: ${error.message}`); }
  check(manifest?.schemaVersion === 1 && Array.isArray(manifest.units), "manifest schema is invalid");
  const names = manifest.units.map((unit) => unit.name);
  check(names.every((name, index) => index === 0 || name > names[index - 1]), "manifest units are not sorted");
  return manifest;
}

function validatePublicContract(manifestPath) {
  const manifest = readManifest(manifestPath);
  const proposal = readManifest(PROPOSAL_PATH);
  const existing = manifestPath === PROPOSAL_PATH ? readManifest(CONFIG_PATH) : undefined;
  check(proposal.units.length === CONTRACT.length, "proposal has an unexpected unit count");
  const units = new Map();
  for (const fn of CONTRACT) {
    const proposed = proposal.units.find((entry) => entry.name === fn.unit);
    check(proposed && Object.keys(proposed).sort().join(",") === "functions,name,sources" &&
      proposed.sources.length === 1 && Object.keys(proposed.sources[0]).sort().join(",") === "mode,path" &&
      proposed.sources[0].path === fn.source && proposed.sources[0].mode === "arm" &&
      proposed.functions.length === 1, `${fn.unit} proposal ownership is not exact`);
    const proposedClaim = proposed.functions[0];
    check(Object.keys(proposedClaim).sort().join(",") === "address,name,semantics,size" &&
      proposedClaim.name === fn.name && proposedClaim.address === fn.address && proposedClaim.size === fn.size &&
      proposedClaim.semantics === fn.semantics, `${fn.name} proposal claim is not exact`);
    if (existing) {
      const oldUnit = existing.units.find((entry) => entry.name === fn.unit);
      check(!oldUnit || (!oldUnit.sources.some((source) => source.path === fn.source) &&
        !oldUnit.functions.some((claim) => claim.name === fn.name ||
          (claim.address === fn.address && claim.size === fn.size))), `${fn.name} proposal overlaps an existing public claim`);
    }

    const unit = manifest.units.find((entry) => entry.name === fn.unit);
    check(unit && Array.isArray(unit.sources) && Array.isArray(unit.functions), `${fn.unit} is absent from the selected manifest`);
    check(unit.sources.filter((source) => source.path === fn.source && source.mode === "arm").length === 1,
      `${fn.unit} lacks one exact ARM source claim`);
    const claims = unit.functions.filter((claim) => claim.name === fn.name);
    check(claims.length === 1 && Object.keys(claims[0]).sort().join(",") === "address,name,semantics,size" &&
      claims[0].address === fn.address && claims[0].size === fn.size && claims[0].semantics === fn.semantics,
    `${fn.name} selected-manifest claim is not exact`);
    units.set(fn.unit, unit);

    const inventory = join(ROOT, "symbols", "cro", `${fn.unit}.csv`);
    check(existsSync(inventory) && lstatSync(inventory).isFile() && !lstatSync(inventory).isSymbolicLink(),
      `${fn.unit} public inventory is missing`);
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    const lines = readFileSync(inventory, "utf8").split(/\r?\n/u);
    check(lines.filter((line) => line === row).length === 1 && lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name} lacks one exact global ARM inventory boundary`);
    check(lines.filter((line) => /^[0-9A-F]{8},/u.test(line)).length > 1,
      `${fn.unit} would incorrectly appear function-complete`);

    const sourcePath = resolve(ROOT, fn.source);
    check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() && !lstatSync(sourcePath).isSymbolicLink(),
      `${fn.source} is not an owned regular file`);
    const source = readFileSync(sourcePath, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(source), `${fn.source} contains encoded data`);
    check((source.match(/^\.section \.text\.func_[0-9A-F]{8}, "ax", %progbits$/gmu) ?? []).length === 1,
      `${fn.source} does not define exactly one executable function section`);
    for (const fragment of [`.section .text.${fn.name}, "ax", %progbits`, `.global ${fn.name}`,
      `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`]) {
      check(source.split(fragment).length === 2, `${fn.source} lacks one exact ${fn.name} declaration`);
    }
  }
  check(CONTRACT.length === 8 && units.size === 8 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 592 &&
    CONTRACT.reduce((sum, fn) => sum + fn.words.length, 0) === 148, "aggregate contract totals are invalid");
  return units;
}

function validateObjects(units, directory, readelf) {
  for (const [unitName] of units) {
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
    const fn = CONTRACT.find((entry) => entry.unit === unitName);
    check(allocated.length === 1 && allocated[0][0] === `.text.${fn.name}`,
      `${unitName} has missing or adjacent allocated bytes`);
    check(allocated[0][1] === fn.size && allocated[0][2].includes("X"), `${fn.name} section boundary or flags are invalid`);
    const symbols = run(readelf, ["--symbols", "--wide", object]);
    const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolLines[0]),
      `${fn.name} is not one exact global function symbol`);
    const expected = fn.words.map(littleEndianHex);
    const actual = sectionBytes(readelf, object, `.text.${fn.name}`);
    check(actual.length === expected.length && actual.every((word, index) => word === expected[index]),
      `${fn.name} instruction schedule differs at word ${actual.findIndex((word, index) => word !== expected[index])}`);
    check(/There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
      `${unitName} unexpectedly has relocations`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  const units = validatePublicContract(options.manifest);
  if (options.objectDirectory) validateObjects(units, options.objectDirectory, options.readelf);
  console.log(`Validated CRO contract 06: 8 ARM functions in 8 units (592 bytes, 148 instructions, zero relocations/adjacent bytes)${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
