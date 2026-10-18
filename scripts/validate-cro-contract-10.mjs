#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-10-proposal.json");
const QUARANTINED_UNIT = "DllUSPassage";
const QUARANTINED_SOURCE = "src/cro/DllUSPassage/contract_10.S";

const CONTRACT = [
  ["DllCommWait", "func_00000808", 0x0808, 328, "contract-10-wait-scene-setup", "6410a5680728d09dd8e6549651be0f4728935e0ed337d00d4a0fd223572acf8e"],
  ["DllFieldEventSecretBaseMyBasePc", "func_00003644", 0x3644, 368, "contract-10-secret-base-menu-update", "8a46fd6fc4c9a2c527449285692436550fa68110650b79a2d3bcffea720a4d6a"],
  ["DllFieldEventSlopeSlip", "func_00000308", 0x0308, 344, "contract-10-slope-slip-action", "51a178c7c81800240299e32992cf89822fec5cf140b68f02825e308e8b33cb9f"],
  ["DllStartMenu", "func_000014D4", 0x14D4, 416, "contract-10-start-menu-state-update", "689dc98ea99351bfe43444c3c4dc796f85ae7e6e13f552433b31927faae48be0"],
  ["DllUSAreaTenji", "func_0000007C", 0x007C, 292, "contract-10-area-display-setup", "3f69e61f624296c0a5dd43280af863ffc868a38cce9cb09f38a851df844ef068"],
  ["DllUSGymFighting", "func_000006FC", 0x06FC, 152, "contract-10-gym-fighting-event", "76f0642a25e2f34de6494771eb8d024d1c8b555337e664763e36388a07a6d94d"],
  ["DllUSGymFire", "func_00000DCC", 0x0DCC, 224, "contract-10-gym-fire-object-setup", "984d6534477ff789271a7776b6a1d10c2d537b7c1f858b1cffa92565fe04e99a"],
].map(([unit, name, address, size, semantics, sha256]) => ({
  unit, name, address, size, semantics, sha256, source: `src/cro/${unit}/contract_10.S`,
}));
const SINGLE_FUNCTION_UNITS = new Set(["DllFieldEventSlopeSlip", "DllUSAreaTenji", "DllUSGymFighting", "DllUSGymFire"]);
const TENJI_VENEER_SOURCE = "src/cro/DllUSAreaTenji/import_veneers.S";
const TENJI_VENEERS = [
  ["000", "004", "__cro_import_anon_m7c7374617469637c_s0_002fd48"],
  ["008", "00c", "__cro_import_anon_m446c6c4669656c64_s0_0087014"],
  ["010", "014", "__cro_import_anon_m7c7374617469637c_s0_02dc63c"],
  ["018", "01c", "__cro_import_anon_m446c6c4669656c64_s0_00d8e40"],
  ["020", "024", "__cro_import_anon_m446c6c4669656c64_s0_0015d34"],
  ["028", "02c", "__cro_import_anon_m446c6c4669656c64_s0_00d8eb0"],
  ["030", "034", "__cro_import_anon_m446c6c4669656c64_s0_00158d4"],
  ["038", "03c", "__cro_import_anon_m7c7374617469637c_s0_01ff8c0"],
];

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
    if (owned.length === 0) check(overlap.length === 0, `${fn.name} overlaps an existing claim`);
    else check(overlap.length === 1 && overlap[0].name === fn.name && overlap[0].address === fn.address &&
      overlap[0].size === fn.size && overlap[0].semantics === fn.semantics, `${fn.name} integrated claim is not exact`);
  }
}

function validatePublicContract(manifestPath) {
  const proposal = readManifest(PROPOSAL_PATH), existing = readManifest(CONFIG_PATH);
  for (const manifest of [proposal, existing]) {
    check(!manifest.units.some((unit) => unit.name === QUARANTINED_UNIT),
      `${QUARANTINED_UNIT} quarantined ownership remains registered`);
    check(!manifest.units.some((unit) => unit.sources.some((source) => source.path === QUARANTINED_SOURCE)),
      `${QUARANTINED_UNIT} quarantined source remains registered`);
  }
  check(!existsSync(join(ROOT, QUARANTINED_SOURCE)), `${QUARANTINED_SOURCE} remains in the working tree`);
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
    const acceptedCount = lines.filter((line) => /^[0-9A-F]{8},/u.test(line)).length;
    check(SINGLE_FUNCTION_UNITS.has(fn.unit) ? acceptedCount === 1 : acceptedCount > 1,
      `${fn.unit} public accepted-function inventory changed unexpectedly`);

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
  if (manifestPath === CONFIG_PATH) {
    const tenji = units.get("DllUSAreaTenji");
    check(tenji.sources.length === 2 && tenji.sources[1]?.path === TENJI_VENEER_SOURCE && tenji.sources[1]?.mode === "arm",
      "DllUSAreaTenji lacks the independent veneer source");
    const sourcePath = join(ROOT, TENJI_VENEER_SOURCE);
    check(existsSync(sourcePath) && lstatSync(sourcePath).isFile() && !lstatSync(sourcePath).isSymbolicLink(),
      `${TENJI_VENEER_SOURCE} is not an owned regular file`);
    const sourceText = readFileSync(sourcePath, "utf8");
    check((sourceText.match(/^\.section \.text\.import_veneers, "ax", %progbits$/gmu) ?? []).length === 1,
      `${TENJI_VENEER_SOURCE} lacks its one executable section`);
    check(!/^\s*\.(?:byte|hword|short|long|inst)\b/imu.test(sourceText), `${TENJI_VENEER_SOURCE} contains encoded instructions`);
    check(!/^\s*\.type\s+dll_us_area_tenji_import_veneer_/mu.test(sourceText),
      `${TENJI_VENEER_SOURCE} claims accepted function metadata`);
    for (const [code, pool, imported] of TENJI_VENEERS) {
      for (const fragment of [`.global dll_us_area_tenji_import_veneer_${code}`,
        `dll_us_area_tenji_import_veneer_${code}:`, "    ldr pc, [pc, #-4]", `.Lpool_${pool}:`, `    .word ${imported}`]) {
        check(sourceText.split(fragment).length === (fragment === "    ldr pc, [pc, #-4]" ? 9 : 2),
          `${TENJI_VENEER_SOURCE} lacks the canonical ${code}/${pool} veneer contract`);
      }
    }
  }
  check(CONTRACT.length === 7 && units.size === 7 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 2124 &&
    CONTRACT.reduce((sum, fn) => sum + fn.size / 4, 0) === 531, "aggregate contract totals are invalid");
  const ownedPaths = [PROPOSAL_PATH, join(ROOT, "docs/specs/cro/contract_10.md"),
    resolve(ROOT, TENJI_VENEER_SOURCE), ...CONTRACT.map((fn) => resolve(ROOT, fn.source))];
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
    const expectedNames = unit.functions.filter((claim) => CONTRACT.some((fn) => fn.unit === unitName && fn.name === claim.name))
      .map((claim) => `.text.${claim.name}`);
    if (unitName === "DllUSAreaTenji") expectedNames.push(".text.import_veneers");
    if (unitName === "DllStartMenu") expectedNames.push(".text.func_00000E44");
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
    const relocations = run(readelf, ["--relocs", "--wide", object]);
    if (unitName === "DllUSAreaTenji") {
      const veneerSection = allocated.find(([name]) => name === ".text.import_veneers");
      check(veneerSection?.[1] === 64 && veneerSection[2].includes("X"), "DllUSAreaTenji veneer section boundary or flags are invalid");
      const veneerBytes = sectionBytes(readelf, object, ".text.import_veneers");
      check(veneerBytes.length === 64, "DllUSAreaTenji veneer bytes have an invalid size");
      for (const [index, [code, , imported]] of TENJI_VENEERS.entries()) {
        const offset = index * 8;
        check(veneerBytes.readUInt32LE(offset) === 0xe51ff004 && veneerBytes.readUInt32LE(offset + 4) === 0,
          `DllUSAreaTenji veneer ${code} is not canonical readable ARM with a zero relocation addend`);
        const relocation = new RegExp(`^${(offset + 4).toString(16).padStart(8, "0")}\\s+[0-9a-f]+02\\s+R_ARM_ABS32\\s+00000000\\s+${imported}$`, "imu");
        check(relocation.test(relocations), `DllUSAreaTenji veneer ${code} lacks its exact neutral import relocation`);
      }
      check((relocations.match(/R_ARM_ABS32/gu) ?? []).length === TENJI_VENEERS.length,
        "DllUSAreaTenji has an unexpected veneer relocation count");
      const definedVeneers = symbols.split("\n").filter((line) => /\sdll_us_area_tenji_import_veneer_[0-9a-f]+$/u.test(line.trimEnd()));
      check(definedVeneers.length === TENJI_VENEERS.length && definedVeneers.every((line) => /\s0\s+NOTYPE\s+GLOBAL\s+DEFAULT\s+\d+\s/u.test(line)),
        "DllUSAreaTenji veneers must remain non-function symbols");
    } else {
      check(/There are no relocations in this file\./u.test(relocations), `${unitName} unexpectedly has relocations`);
    }
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  const units = validatePublicContract(options.manifest);
  if (options.objectDirectory) validateObjects(units, options.objectDirectory, options.readelf);
  console.log(`Validated CRO contract 10: 7 accepted ARM functions in 7 units (2,124 bytes, 531 instructions), plus 8 unaccepted DllUSAreaTenji veneers with 8 neutral relocations; DllUSPassage is quarantined${options.objectDirectory ? ", and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
