#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-09-proposal.json");
const QUARANTINED_UNIT = "DllGameClearSave";
const QUARANTINED_FUNCTION = "func_000006DC";
const QUARANTINED_SOURCE = "src/cro/DllGameClearSave/contract_09.S";
const QUARANTINED_TRAINER_UNIT = "DllTrainerCase";
const QUARANTINED_TRAINER_SOURCE = "src/cro/DllTrainerCase/contract_09.S";

const CONTRACT = [
  ["DllDendouPC", "func_00001840", 0x1840, 172, "contract-09-record-finalization", "3387a729db70f080f5b10452d173d3ab9cbe0a1755ee146594d21c8e5d923dcb"],
  ["DllDialogCommon", "func_000002C0", 0x02C0, 332, "contract-09-dialog-state-update", "0a590bcff6f0146d6f3700ce3fed4dc4be7acd9c9eba3631220b70f4b85538ef"],
  ["DllFieldEventFishing", "func_00001058", 0x1058, 192, "contract-09-fishing-object-setup", "ce3d66a1ef7acd4ee5c7929d39d8330bc35bc4c581f9395e82e32af04c47ef3d"],
  ["DllFieldEventPokeRideAction", "func_00000494", 0x0494, 304, "contract-09-ride-action-update", "646c3eda6dd902a65987a0f2a71f729b040b3600809c17cac0be7c8df97953ad"],
  ["DllLangSelect", "func_00000EB0", 0x0EB0, 168, "contract-09-language-layout-update", "433d718a35068c6d0435a1be8ecdf5bc14bf4a6074e445808bee15ecdb5a1e91"],
  ["DllPssAssistPower", "func_0000081C", 0x081C, 240, "contract-09-assist-power-lifecycle", "196e6f3125ad7c9afb50d15436195d1c598cdc4d52e2e2e7be39536862262baf"],
].map(([unit, name, address, size, semantics, sha256]) => ({
  unit, name, address, size, semantics, sha256, source: `src/cro/${unit}/contract_09.S`,
}));

function fail(message) { throw new Error(`CRO contract 09 validation: ${message}`); }
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
      "usage: validate-cro-contract-09.mjs [--manifest <path>] [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined || (key === "manifest" && options[key] === CONFIG_PATH), `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(options.manifest === CONFIG_PATH || options.manifest === PROPOSAL_PATH,
    "--manifest may select only config/cro-sources.json or config/cro-contract-09-proposal.json");
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
    if (owned.length === 0) check(overlap.length === 0, `${fn.name} overlaps an existing claim`);
    else check(overlap.length === 1 && overlap[0].name === fn.name && overlap[0].address === fn.address &&
      overlap[0].size === fn.size && overlap[0].semantics === fn.semantics, `${fn.name} integrated claim is not exact`);
  }
}

function validatePublicContract(manifestPath) {
  const proposal = readManifest(PROPOSAL_PATH), existing = readManifest(CONFIG_PATH);
  for (const manifest of [proposal, existing]) {
    check(!manifest.units.some((unit) => unit.name === QUARANTINED_TRAINER_UNIT),
      `${QUARANTINED_TRAINER_UNIT} quarantined ownership remains registered`);
    check(!manifest.units.some((unit) => unit.sources.some((source) => source.path === QUARANTINED_TRAINER_SOURCE)),
      `${QUARANTINED_TRAINER_UNIT} quarantined source remains registered`);
    check(!manifest.units.some((unit) => unit.sources.some((source) => source.path === QUARANTINED_SOURCE)),
      `${QUARANTINED_UNIT} quarantined source remains registered`);
    const quarantined = manifest.units.find((unit) => unit.name === QUARANTINED_UNIT);
    check(!quarantined || !quarantined.functions.some((claim) => claim.name === QUARANTINED_FUNCTION),
      `${QUARANTINED_FUNCTION} quarantined claim remains registered`);
  }
  check(!existsSync(join(ROOT, QUARANTINED_SOURCE)), `${QUARANTINED_SOURCE} remains in the working tree`);
  check(!existsSync(join(ROOT, QUARANTINED_TRAINER_SOURCE)), `${QUARANTINED_TRAINER_SOURCE} remains in the working tree`);
  validateProposal(proposal, existing);
  const selected = manifestPath === PROPOSAL_PATH ? proposal : existing;
  const units = new Map();
  for (const fn of CONTRACT) {
    const unit = selected.units.find((entry) => entry.name === fn.unit);
    check(unit && Array.isArray(unit.sources) && Array.isArray(unit.functions), `${fn.unit} is absent from the selected manifest`);
    check(unit.sources.filter((entry) => entry.path === fn.source && entry.mode === "arm").length === 1,
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
    check(lines.filter((line) => /^[0-9A-F]{8},/u.test(line)).length > 1, `${fn.unit} would incorrectly appear function-complete`);

    const sourcePath = resolve(ROOT, fn.source);
    check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() && !lstatSync(sourcePath).isSymbolicLink(),
      `${fn.source} is not an owned regular file`);
    const sourceText = readFileSync(sourcePath, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(sourceText), `${fn.source} contains encoded data`);
    check((sourceText.match(/^\.section \.text\.func_[0-9A-F]{8}, "ax", %progbits$/gmu) ?? []).length === 1,
      `${fn.source} does not define exactly one executable section`);
    for (const fragment of [`.section .text.${fn.name}, "ax", %progbits`, `.global ${fn.name}`,
      `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`]) {
      check(sourceText.split(fragment).length === 2, `${fn.source} lacks one exact ${fn.name} declaration`);
    }
  }
  check(CONTRACT.length === 6 && units.size === 6 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 1408 &&
    CONTRACT.reduce((sum, fn) => sum + fn.size / 4, 0) === 352, "aggregate contract totals are invalid");
  const ownedPaths = [PROPOSAL_PATH, join(ROOT, "docs/specs/cro/contract_09.md"),
    ...CONTRACT.map((fn) => resolve(ROOT, fn.source))];
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
    const expectedNames = unit.functions.map((claim) => `.text.${claim.name}`);
    expectedNames.sort();
    const actualNames = allocated.map(([name]) => name).sort();
    check(actualNames.length === expectedNames.length && actualNames.every((name, index) => name === expectedNames[index]),
      `${unitName} has missing or extra allocated bytes`);
    const fn = CONTRACT.find((entry) => entry.unit === unitName), section = `.text.${fn.name}`;
    const sectionInfo = allocated.filter(([name]) => name === section);
    check(sectionInfo.length === 1 && sectionInfo[0][1] === fn.size && sectionInfo[0][2].includes("X"),
      `${fn.name} section boundary or flags are invalid`);
    const symbols = run(readelf, ["--symbols", "--wide", object]);
    const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolLines[0]),
      `${fn.name} is not one exact global function symbol`);
    const bytes = sectionBytes(readelf, object, section);
    check(bytes.length === fn.size && createHash("sha256").update(bytes).digest("hex") === fn.sha256,
      `${fn.name} instruction bytes do not match the contract`);
    check(/There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
      `${unitName} unexpectedly has relocations`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  const units = validatePublicContract(options.manifest);
  if (options.objectDirectory) validateObjects(units, options.objectDirectory, options.readelf);
  console.log(`Validated CRO contract 09: 6 ARM functions in 6 units (1,408 bytes, 352 instructions, zero relocations/adjacent bytes); DllGameClearSave and DllTrainerCase are quarantined${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
