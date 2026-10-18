#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, symlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const PROPOSAL_PATH = join(ROOT, "config", "cro-contract-11-proposal.json");
const QUARANTINED_SOURCE = "src/cro/DllPokeList/contract_11.S";

const CONTRACT = [
  ["DllField", "func_0006B434", 0x6B434, 20, "contract-11-optional-callback-tailcall", "2e8bd4505b9d5d4550ff480d46fa00ae685dcba2f1139ec60435004e9bab035e"],
  ["DllGts", "func_0000BED0", 0xBED0, 60, "contract-11-linked-list-transfer", "b59ca3ef039222756d61c51c1e3ba34b47cfb7a40325b4aaacb88419a5cec2c2"],
  ["DllKawaigari", "func_00000C78", 0x0C78, 12, "contract-11-default-dispatch", "80a5309d8fdd2ca6200b70f54d70c29747b062094ceea48ed7f3c375e5067906"],
  ["DllSangoZukan", "func_0002A830", 0x2A830, 24, "contract-11-eight-byte-fill", "946797a2896ecb43e1dd3bf951dec82053555432d122aeeec462096328a0143c"],
  ["DllSkyTrip", "func_00008048", 0x8048, 60, "contract-11-vector-normalize", "5f2de655d01a22a8d1721260dd8dda4dafd1a39ecaec2deee716cdd99c5267b7"],
  ["DllTitle", "func_0001C3C8", 0x1C3C8, 20, "contract-11-title-global-clear", "2eb59411a86f4d590d1ce69a71e13e1b864898f0bb335bbd0b4b1d325894d541"],
].map(([unit, name, address, size, semantics, sha256]) => ({
  unit, name, address, size, semantics, sha256, source: `src/cro/${unit}/contract_11.S`,
}));

function fail(message) { throw new Error(`CRO contract 11 validation: ${message}`); }
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
      "usage: validate-cro-contract-11.mjs [--manifest <path>] [--object-directory <path> --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined || (key === "manifest" && options[key] === CONFIG_PATH), `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(options.manifest === CONFIG_PATH || options.manifest === PROPOSAL_PATH,
    "--manifest may select only config/cro-sources.json or config/cro-contract-11-proposal.json");
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
function selfTestQuarantinedSource() {
  let checkedPath, restoredRejected = false, lookupFailureRejected = false;
  try {
    validateQuarantinedSource((path) => { checkedPath = path; return { isSymbolicLink: () => true }; });
  } catch (error) {
    restoredRejected = error.message.includes(`${QUARANTINED_SOURCE} remains in the working tree`);
  }
  check(checkedPath === join(ROOT, QUARANTINED_SOURCE) && restoredRejected,
    "quarantined-source hostile self-test did not reject a restored entry");
  validateQuarantinedSource(() => { throw Object.assign(new Error("missing"), { code: "ENOENT" }); });
  try {
    validateQuarantinedSource(() => { throw Object.assign(new Error("denied"), { code: "EACCES" }); });
  } catch (error) {
    lookupFailureRejected = error.message.includes(`cannot inspect ${QUARANTINED_SOURCE}: denied`);
  }
  check(lookupFailureRejected, "quarantined-source hostile self-test accepted an inspection failure");
  const fixture = mkdtempSync(join(ROOT, ".contract11-quarantine-"));
  try {
    const dangling = join(fixture, "contract_11.S");
    symlinkSync(join(fixture, "missing-target"), dangling);
    let danglingRejected = false;
    try { validateAbsentPath(dangling, QUARANTINED_SOURCE); }
    catch (error) { danglingRejected = error.message.includes(`${QUARANTINED_SOURCE} remains in the working tree`); }
    check(danglingRejected, "quarantined-source hostile self-test accepted a dangling symlink");
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
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
  check(existing.units.every((unit) => unit.sources.every((source) => source.path !== QUARANTINED_SOURCE)),
    `${QUARANTINED_SOURCE} remains registered`);
  validateQuarantinedSource();
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
    check(acceptedCount > unit.functions.length, `${fn.unit} would incorrectly appear function-complete`);

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
  check(CONTRACT.length === 6 && units.size === 6 && CONTRACT.reduce((sum, fn) => sum + fn.size, 0) === 196 &&
    CONTRACT.reduce((sum, fn) => sum + fn.size / 4, 0) === 49, "aggregate contract totals are invalid");
  const ownedPaths = [PROPOSAL_PATH, join(ROOT, "docs/specs/cro/contract_11.md"),
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
    const expectedNames = unit.functions.map((claim) => `.text.${claim.name}`).sort();
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
  selfTestQuarantinedSource();
  const options = parseArguments(process.argv.slice(2));
  const units = validatePublicContract(options.manifest);
  if (options.objectDirectory) validateObjects(units, options.objectDirectory, options.readelf);
  console.log(`Validated the configured CRO contract 11 claims${options.objectDirectory ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
