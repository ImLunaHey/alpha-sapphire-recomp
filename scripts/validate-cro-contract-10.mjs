#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-10-proposal.json");

const CONTRACT = [
  ["DllCommWait", "func_00000808", 0x0808, 328, "contract-10-wait-scene-setup", "6410a5680728d09dd8e6549651be0f4728935e0ed337d00d4a0fd223572acf8e"],
  ["DllFieldEventSecretBaseMyBasePc", "func_00003644", 0x3644, 368, "contract-10-secret-base-menu-update", "8a46fd6fc4c9a2c527449285692436550fa68110650b79a2d3bcffea720a4d6a"],
  ["DllFieldEventSlopeSlip", "func_00000308", 0x0308, 344, "contract-10-slope-slip-action", "51a178c7c81800240299e32992cf89822fec5cf140b68f02825e308e8b33cb9f"],
  ["DllStartMenu", "func_000014D4", 0x14D4, 416, "contract-10-start-menu-state-update", "689dc98ea99351bfe43444c3c4dc796f85ae7e6e13f552433b31927faae48be0"],
  ["DllUSAreaTenji", "func_0000007C", 0x007C, 292, "contract-10-area-display-setup", "3f69e61f624296c0a5dd43280af863ffc868a38cce9cb09f38a851df844ef068"],
  ["DllUSGymFighting", "func_000006FC", 0x06FC, 152, "contract-10-gym-fighting-event", "76f0642a25e2f34de6494771eb8d024d1c8b555337e664763e36388a07a6d94d"],
  ["DllUSGymFire", "func_00000DCC", 0x0DCC, 224, "contract-10-gym-fire-object-setup", "984d6534477ff789271a7776b6a1d10c2d537b7c1f858b1cffa92565fe04e99a"],
  ["DllUSPassage", "func_000019F4", 0x19F4, 488, "contract-10-passage-state-update", "70fd8be721ab195ceac4e6d657b31ae3858f7eedb37f0113ba37de4b0ce63665"],
].map(([unit, name, address, size, semantics, sha256]) => ({
  unit, name, address, size, semantics, sha256, source: `src/cro/${unit}/contract_10.S`,
}));
const SINGLE_FUNCTION_UNITS = new Set(["DllFieldEventSlopeSlip", "DllUSAreaTenji", "DllUSGymFire"]);

function fail(message) { throw new Error(`CRO contract 10 validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function exactKeys(value, keys, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === keys, `${label} has an invalid schema`);
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
  const options = { manifest: CONFIG_PATH };
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--manifest", "--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-contract-10.mjs [--manifest <path>] [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined || (key === "manifest" && options[key] === CONFIG_PATH), `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(options.manifest === CONFIG_PATH || options.manifest === PROPOSAL_PATH,
    "--manifest may select only config/cro-sources.json or config/cro-contract-10-proposal.json");
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
function sectionBytes(readelf, object, section) {
  const groups = [];
  for (const line of run(readelf, ["--hex-dump", section, object]).split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      groups.push(token);
    }
  }
  return Buffer.from(groups.join(""), "hex");
}

function validateProposal(proposal, existing) {
  check(proposal.units.length === CONTRACT.length, "proposal has an unexpected unit count");
  for (const fn of CONTRACT) {
    const unit = proposal.units.find((entry) => entry.name === fn.unit);
    exactKeys(unit, "functions,name,sources", `${fn.unit} proposal`);
    check(unit.sources.length === 1 && unit.functions.length === 1, `${fn.unit} proposal ownership is not singular`);
    exactKeys(unit.sources[0], "mode,path", `${fn.unit} proposal source`);
    exactKeys(unit.functions[0], "address,name,semantics,size", `${fn.unit} proposal claim`);
    const source = unit.sources[0], claim = unit.functions[0];
    check(source.path === fn.source && source.mode === "arm", `${fn.unit} proposal source is not exact`);
    check(claim.name === fn.name && claim.address === fn.address && claim.size === fn.size && claim.semantics === fn.semantics,
      `${fn.name} proposal claim is not exact`);
    const oldUnit = existing.units.find((entry) => entry.name === fn.unit);
    if (!oldUnit) continue;
    const owned = oldUnit.sources.filter((entry) => entry.path === fn.source);
    const overlap = oldUnit.functions.filter((entry) => entry.name === fn.name ||
      (entry.address < fn.address + fn.size && fn.address < entry.address + entry.size));
    check(owned.length <= 1 && (owned.length === 0 || owned[0].mode === "arm"), `${fn.unit} source ownership conflicts`);
    if (owned.length === 0) {
      check(fn.unit === "DllUSGymFighting" ? overlap.length === 1 : overlap.length === 0,
        `${fn.name} overlaps an existing claim`);
    }
    else check(overlap.length === 1 && overlap[0].name === fn.name && overlap[0].address === fn.address &&
      overlap[0].size === fn.size && overlap[0].semantics === fn.semantics, `${fn.name} integrated claim is not exact`);
  }
}

function validatePublicContract(manifestPath) {
  const proposal = readManifest(PROPOSAL_PATH), existing = readManifest(CONFIG_PATH);
  validateProposal(proposal, existing);
  const selected = manifestPath === PROPOSAL_PATH ? proposal : existing;
  const units = new Map();
  for (const fn of CONTRACT) {
    const unit = selected.units.find((entry) => entry.name === fn.unit);
    check(unit && Array.isArray(unit.sources) && Array.isArray(unit.functions), `${fn.unit} is absent from the selected manifest`);
    const selectedSource = fn.unit === "DllUSGymFighting" && manifestPath === CONFIG_PATH
      ? "src/cro/DllUSGymFighting/complete.S" : fn.source;
    check(unit.sources.filter((entry) => entry.path === selectedSource && entry.mode === "arm").length === 1,
      `${fn.unit} lacks one exact ARM source claim`);
    const claims = unit.functions.filter((entry) => entry.name === fn.name);
    check(claims.length === 1 && claims[0].address === fn.address && claims[0].size === fn.size &&
      claims[0].semantics === fn.semantics, `${fn.name} selected-manifest claim is not exact`);
    units.set(fn.unit, unit);

    const inventory = join(ROOT, "symbols", "cro", `${fn.unit}.csv`);
    check(existsSync(inventory) && lstatSync(inventory).isFile() && !lstatSync(inventory).isSymbolicLink(),
      `${fn.unit} public inventory is missing`);
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    const lines = readFileSync(inventory, "utf8").split(/\r?\n/u);
    check(lines.filter((line) => line === row).length === 1 && lines.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name} lacks one exact global ARM inventory boundary`);
    const acceptedCount = lines.filter((line) => /^[0-9A-F]{8},/u.test(line)).length;
    check(SINGLE_FUNCTION_UNITS.has(fn.unit) ? acceptedCount === 1 : acceptedCount > 1,
      `${fn.unit} public accepted-function inventory changed unexpectedly`);

    const sourcePath = resolve(ROOT, selectedSource);
    check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() && !lstatSync(sourcePath).isSymbolicLink(),
      `${selectedSource} is not an owned regular file`);
    const sourceText = readFileSync(sourcePath, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(sourceText), `${selectedSource} contains encoded instructions`);
    const complete = fn.unit === "DllUSGymFighting" && manifestPath === CONFIG_PATH;
    check(complete || (sourceText.match(/^\.section \.text\.func_[0-9A-F]{8}, "ax", %progbits$/gmu) ?? []).length === 1,
      `${selectedSource} does not define the expected executable section`);
    const fragments = complete
      ? [`.section .text.DllUSGymFighting, "ax", %progbits`, `.global ${fn.name}`, `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`]
      : [`.section .text.${fn.name}, "ax", %progbits`, `.global ${fn.name}`, `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`];
    for (const fragment of fragments) {
      check(sourceText.split(fragment).length === 2, `${selectedSource} lacks one exact ${fn.name} declaration`);
    }
  }
  check(CONTRACT.length === 8 && units.size === 8 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 2612 &&
    CONTRACT.reduce((sum, fn) => sum + fn.size / 4, 0) === 653, "aggregate contract totals are invalid");
  const ownedPaths = [PROPOSAL_PATH, join(ROOT, "docs/specs/cro/contract_10.md"),
    ...CONTRACT.map((fn) => resolve(ROOT, fn.unit === "DllUSGymFighting" && manifestPath === CONFIG_PATH
      ? "src/cro/DllUSGymFighting/complete.S" : fn.source))];
  const forbiddenPath = new RegExp(`(?:${["", "mnt", "storage"].join("\\/")}|\\.${["3", "ds"].join("")}\\b|${["target", "cro-split"].join("\\/")}|${["AS_EUR_REV2", "target"].join("\\/")})`, "iu");
  for (const path of ownedPaths) {
    const text = readFileSync(path, "utf8");
    check(!forbiddenPath.test(text),
      `${relative(ROOT, path)} contains a ROM or private-target path`);
  }
  return units;
}

function validateObjects(units, directory, readelf) {
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
    const complete = unitName === "DllUSGymFighting";
    const expectedNames = complete ? [".bss.DllUSGymFighting", ".data.DllUSGymFighting", ".rodata.DllUSGymFighting", ".text.DllUSGymFighting"] : unit.functions.filter((claim) => CONTRACT.some((fn) => fn.unit === unitName && fn.name === claim.name))
      .map((claim) => `.text.${claim.name}`).sort();
    const actualNames = allocated.map(([name]) => name).sort();
    check(actualNames.length === expectedNames.length && actualNames.every((name, index) => name === expectedNames[index]),
      `${unitName} has missing or extra allocated bytes`);
    const fn = CONTRACT.find((entry) => entry.unit === unitName), section = complete ? ".text.DllUSGymFighting" : `.text.${fn.name}`;
    const sectionInfo = allocated.filter(([name]) => name === section);
    check(sectionInfo.length === 1 && sectionInfo[0][1] === (complete ? 0xbec : fn.size) && sectionInfo[0][2].includes("X"),
      `${fn.name} section boundary or flags are invalid`);
    const symbols = run(readelf, ["--symbols", "--wide", object]);
    const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+${complete ? "000006fc" : "00000000"}\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "iu").test(symbolLines[0]),
      `${fn.name} is not one exact global function symbol`);
    const sectionData = sectionBytes(readelf, object, section);
    const bytes = complete ? sectionData.subarray(fn.address, fn.address + fn.size) : sectionData;
    check(bytes.length === fn.size && createHash("sha256").update(bytes).digest("hex") === fn.sha256,
      `${fn.name} instruction bytes do not match the contract`);
    check(complete || /There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
      `${unitName} unexpectedly has relocations`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  const units = validatePublicContract(options.manifest);
  if (options.objectDirectory) validateObjects(units, options.objectDirectory, options.readelf);
  console.log(`Validated CRO contract 10: 8 ARM functions in 8 units (2,612 bytes, 653 instructions, zero relocations/adjacent bytes)${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
