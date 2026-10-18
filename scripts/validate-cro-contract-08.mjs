#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-08-proposal.json");
const QUARANTINED_UNIT = "DllWazaOboe";
const QUARANTINED_SOURCE = "src/cro/DllWazaOboe/contract_08.S";

// Numeric ARM words pin every instruction independently of disassembler aliases.
const CONTRACT = [
  ["DllBattleMatch", "func_0000BE2C", 0xBE2C, "contract-08-linked-list-transfer", [
    0xE3510000, 0x012FFF1E, 0xE92D4030, 0xE1A05000, 0xE1A04001, 0xE1A00005,
    0xE594100C, 0xEBFFFFF7, 0xE5951004, 0xE5940008, 0xE584100C, 0xE5854004,
    0xE1B04000, 0x1AFFFFF6, 0xE8BD8030,
  ]],
  ["DllFriendEntry", "func_000019DC", 0x19DC, "contract-08-wide-multiply-accumulate", [
    0xE92D5FF0, 0xE3A04000, 0xE1A06004, 0xE1A07004, 0xE1A0B000, 0xE8905000,
    0xE1A05FC3, 0xE089A29C, 0xE1A01FCE, 0xE0209294, 0xE08A929E, 0xE020069C,
    0xE022A291, 0xE0999000, 0xE022249E, 0xE0A20004, 0xE086239C, 0xE0246394,
    0xE088639E, 0xE024459C, 0xE0218391, 0xE0922009, 0xE021159E, 0xE1A05FC0,
    0xE0A42007, 0xE0900002, 0xE0A52FC2, 0xE0900006, 0xE0A11002, 0xE3530000,
    0xAA000001, 0xE090000C, 0xE0A1100E, 0xE59D2028, 0xEBFFF9E7, 0xE59B2004,
    0xE1A02FA2, 0xE0900002, 0xE2A11000, 0xE8BD9FF0,
  ]],
  ["DllNuts", "func_00004D84", 0x4D84, "contract-08-vector-state-update", [
    0xE92D0030, 0xE59F4078, 0xE3A02000, 0xEDDF1A1B, 0xE1A05002, 0xE0821182,
    0xE0801101, 0xE5D13038, 0xE3530001, 0x1A000010, 0xED910A0C, 0xEDD10A0B,
    0xED911A0D, 0xEE300A61, 0xEE10CA10, 0xE15C0004, 0x9A000006, 0xE2813020,
    0xEC930A03, 0xED810A0B, 0xE5C15038, 0xE2811030, 0xECC10A02, 0xEA000002,
    0xEDC10A0B, 0xED810A0C, 0xED811A0D, 0xE2822001, 0xE352000A, 0xBAFFFFE6,
    0xE8BD0030, 0xE12FFF1E,
  ]],
  ["DllPssRuleSelect", "func_00001484", 0x1484, "contract-08-rule-table-expand", [
    0xE59F3074, 0xE92D0FF0, 0xE3A0C000, 0xE7934101, 0xE59F3068, 0xE3540000,
    0x859FB064, 0xE7936101, 0x9A000011, 0xE06C318C, 0xE7D6100C, 0xE0803103,
    0xE28CC001, 0xE2817035, 0xE08B5181, 0xE2818023, 0xED950A00, 0xE2819011,
    0xE281A047, 0xED830A21, 0xE5955004, 0xE2811059, 0xE583109C, 0xE2833088,
    0xE154000C, 0xE88307A0, 0x8AFFFFED, 0xE5824000, 0xE8BD0FF0, 0xE2800084,
    0xE12FFF1E,
  ]],
  ["DllTrialHouseResult", "func_000018B8", 0x18B8, "contract-08-result-table-lookup", [
    0xE92D4070, 0xE5900018, 0xEBFFF9EA, 0xE59F406C, 0xE3A01000, 0xE1A05001,
    0xE5942000, 0xE1520000, 0x13A01001, 0x0A000011, 0xE0812101, 0xE7943102,
    0xE1530000, 0x0A00000D, 0xE0842102, 0xE5922014, 0xE1520000, 0x1A000001,
    0xE2811001, 0xEA000007, 0xE2811002, 0xE3510009, 0x3AFFFFF2, 0xE3A02000,
    0xE1A01002, 0xE1A00002, 0xEBFFF9D4, 0xE1A01005, 0xE0810101, 0xE0840100,
    0xE590000C, 0xE8BD8070,
  ]],
  ["DllUSAreaWaterSurface", "func_00000570", 0x570, "contract-08-water-surface-loop", [
    0xE92D40F0, 0xE1A05001, 0xE1A07002, 0xE1A00001, 0xED2D8B04, 0xEEF08A40,
    0xE24DD014, 0xEBFFFEBF, 0xE2506000, 0x8D9F8A1B, 0x8D9F9A1B, 0xE3A04000,
    0x9A000015, 0xED8D8A00, 0xED8D8A01, 0xED8D8A02, 0xED8D9A03, 0xE5950000,
    0xE1A0300D, 0xE1A02007, 0xE1A01004, 0xE590C054, 0xE1A00005, 0xE12FFF3C,
    0xEDCD8A03, 0xE5950000, 0xE1A0300D, 0xE1A02007, 0xE1A01004, 0xE590C050,
    0xE1A00005, 0xE12FFF3C, 0xE2844001, 0xE1540006, 0x3AFFFFE9, 0xE28DD014,
    0xECBD8B04, 0xE8BD80F0,
  ]],
  ["DllUSGymFlight", "func_00000FA4", 0xFA4, "contract-08-flight-interpolation", [
    0xE92D4070, 0xE1A04000, 0xE5B050CC, 0xE2800008, 0xE24DD010, 0xE8900041,
    0xE1A01005, 0xE0460000, 0xEBFFFC2D, 0xE59410C8, 0xE59420D0, 0xED9F0A19,
    0xE2811001, 0xE0800002, 0xE1510005, 0xE58400D0, 0xB1A06000, 0xEEB01A40,
    0xEEF00A40, 0xE58410C8, 0xE1A0000D, 0xE58460D0, 0xEC800A03, 0xED940A34,
    0xEDDF0A0D, 0xEEB80AC0, 0xEE200A20, 0xED8D0A01, 0xE59400DC, 0xE3500000,
    0x11A0100D, 0x1BFFFC04, 0xE59400DC, 0xE5901000, 0xE5911008, 0xE12FFF31,
    0xE28DD010, 0xE8BD8070,
  ]],
].map(([unit, name, address, semantics, words]) => ({
  unit, name, address, semantics, words, size: words.length * 4,
  source: `src/cro/${unit}/contract_08.S`,
}));

function fail(message) { throw new Error(`CRO contract 08 validation: ${message}`); }
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
  const options = { manifest: CONFIG_PATH, selfTest: false };
  if (argv.includes("--self-test")) {
    check(argv.filter((argument) => argument === "--self-test").length === 1, "--self-test was supplied more than once");
    options.selfTest = true;
    argv = argv.filter((argument) => argument !== "--self-test");
  }
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--manifest", "--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-contract-08.mjs [--manifest <path>] [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined || (key === "manifest" && options[key] === CONFIG_PATH),
      `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(options.manifest === CONFIG_PATH || options.manifest === PROPOSAL_PATH,
    "--manifest may select only config/cro-sources.json or config/cro-contract-08-proposal.json");
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
function validateAbsentPath(path, label, inspectSource = lstatSync) {
  let absent = false;
  try { inspectSource(path); }
  catch (error) {
    if (error?.code === "ENOENT") absent = true;
    else fail(`cannot inspect ${label}: ${error?.message ?? error}`);
  }
  check(absent, `${label} remains in the working tree`);
}
function validateQuarantinedSource(inspectSource = lstatSync) {
  validateAbsentPath(join(ROOT, QUARANTINED_SOURCE), QUARANTINED_SOURCE, inspectSource);
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
  check(proposal.units.length === CONTRACT.length, "proposal has an unexpected unit count");
  for (const fn of CONTRACT) {
    const unit = proposal.units.find((entry) => entry.name === fn.unit);
    exactKeys(unit, "functions,name,sources", `${fn.unit} proposal`);
    check(unit.sources.length === 1, `${fn.unit} proposal source count is invalid`);
    exactKeys(unit.sources[0], "mode,path", `${fn.unit} proposal source`);
    check(unit.sources[0].path === fn.source && unit.sources[0].mode === "arm", `${fn.unit} proposal source is not exact`);
    check(unit.functions.length === 1, `${fn.unit} proposal function count is invalid`);
    const claim = unit.functions[0];
    exactKeys(claim, "address,name,semantics,size", `${fn.unit} proposal claim`);
    check(claim.name === fn.name && claim.address === fn.address && claim.size === fn.size && claim.semantics === fn.semantics,
      `${fn.name} proposal claim is not exact`);

    const oldUnit = existing.units.find((entry) => entry.name === fn.unit);
    if (!oldUnit) continue;
    const ownedSources = oldUnit.sources.filter((source) => source.path === fn.source);
    check(ownedSources.length <= 1 && (ownedSources.length === 0 || ownedSources[0].mode === "arm"),
      `${fn.unit} proposal source has partial or conflicting ownership`);
    const overlaps = oldUnit.functions.filter((old) => old.name === fn.name ||
      (old.address === fn.address && old.size === fn.size));
    if (ownedSources.length === 1) {
      check(overlaps.length === 1 && Object.keys(overlaps[0]).sort().join(",") === "address,name,semantics,size" &&
        overlaps[0].name === fn.name && overlaps[0].address === fn.address && overlaps[0].size === fn.size &&
        overlaps[0].semantics === fn.semantics, `${fn.name} integrated claim is not exact`);
    } else {
      check(overlaps.length === 0, `${fn.name} proposal overlaps an existing claim`);
    }
  }
}

function validatePublicContract(manifestPath, inspectSource = lstatSync) {
  const proposal = readManifest(PROPOSAL_PATH);
  const existing = readManifest(CONFIG_PATH);
  for (const manifest of [proposal, existing]) {
    check(!manifest.units.some((unit) => unit.name === QUARANTINED_UNIT),
      `${QUARANTINED_UNIT} quarantined ownership remains registered`);
    check(!manifest.units.some((unit) => unit.sources.some((source) => source.path === QUARANTINED_SOURCE)),
      `${QUARANTINED_UNIT} quarantined source remains registered`);
  }
  validateQuarantinedSource(inspectSource);
  validateProposal(proposal, existing);
  const selected = manifestPath === PROPOSAL_PATH ? proposal : existing;
  const units = new Map();
  for (const fn of CONTRACT) {
    const unit = selected.units.find((entry) => entry.name === fn.unit);
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
    check(lines.filter((line) => /^[0-9A-F]{8},/u.test(line)).length > unit.functions.length,
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
  check(CONTRACT.length === 7 && units.size === 7 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 904 &&
    CONTRACT.reduce((sum, fn) => sum + fn.words.length, 0) === 226, "aggregate contract totals are invalid");
  return units;
}

function runRestorationSelfTest() {
  const expectFilesystemRejection = (label, inspectSource) => {
    for (const manifest of [CONFIG_PATH, PROPOSAL_PATH]) {
      let rejected = false;
      try { validatePublicContract(manifest, inspectSource); }
      catch (error) { rejected = error.message.includes(`${QUARANTINED_SOURCE} remains in the working tree`); }
      check(rejected, `${label} was accepted for ${relative(ROOT, manifest)}`);
    }
  };
  expectFilesystemRejection("restored quarantined source", () => ({ isSymbolicLink: () => false }));
  expectFilesystemRejection("dangling quarantined-source symlink", () => ({ isSymbolicLink: () => true }));
  for (const manifest of [CONFIG_PATH, PROPOSAL_PATH]) {
    let rejected = false;
    try {
      validatePublicContract(manifest, () => {
        throw Object.assign(new Error("deterministic inspection failure"), { code: "EACCES" });
      });
    } catch (error) {
      rejected = error.message.includes(
        `cannot inspect ${QUARANTINED_SOURCE}: deterministic inspection failure`);
    }
    check(rejected, `quarantined-source inspection failure was accepted for ${relative(ROOT, manifest)}`);
  }
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
    const expectedNames = unit.functions.map((claim) => `.text.${claim.name}`).sort();
    const actualNames = allocated.map(([name]) => name).sort();
    check(actualNames.length === expectedNames.length && actualNames.every((name, index) => name === expectedNames[index]),
      `${unitName} has missing or extra allocated bytes`);
    const fn = CONTRACT.find((entry) => entry.unit === unitName);
    const section = `.text.${fn.name}`;
    const sectionInfo = allocated.filter(([name]) => name === section);
    check(sectionInfo.length === 1 && sectionInfo[0][1] === fn.size && sectionInfo[0][2].includes("X"),
      `${fn.name} section boundary or flags are invalid`);
    const symbols = run(readelf, ["--symbols", "--wide", object]);
    const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${fn.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}$`, "u").test(symbolLines[0]),
      `${fn.name} is not one exact global function symbol`);
    const expected = fn.words.map(littleEndianHex);
    const actual = sectionBytes(readelf, object, section);
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
  if (options.selfTest) runRestorationSelfTest();
  console.log(`Validated CRO contract 08: 7 ARM functions in 7 units (904 bytes, 226 instructions, zero relocations/adjacent bytes); DllWazaOboe is quarantined${options.objectDirectory ? " and objects" : ""}; hostile restoration test ${options.selfTest ? "passed" : "not run"}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
