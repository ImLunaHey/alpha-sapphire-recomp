#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePublicCroMetadataTree } from "./validate-public-cro-metadata.mjs";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllDendouPC";
const REPORT_UNIT = `cro/${UNIT}`;
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const SOURCE_PATH = join(ROOT, "src", "cro", UNIT, "contract_09.S");
const INVENTORY_PATH = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION_PATH = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const MANIFEST_PATH = join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json");
const SPEC_PATH = join(ROOT, "docs", "specs", "cro", `${UNIT}.md`);
const DEFAULT_REPORT_PATH = join(ROOT, "progress", "reports", "AS_EUR_REV2", "report.json");
const MAX_INPUT_SIZE = 64 * 1024 * 1024;

function fail(message) {
  throw new Error(`CRO ${UNIT} validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function readText(path, label) {
  check(inside(ROOT, path) && existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(),
    `${label} is not an owned regular file`);
  check(statSync(path).size <= MAX_INPUT_SIZE, `${label} exceeds the 64 MiB input limit`);
  return readFileSync(path, "utf8");
}

function readJson(path, label) {
  const text = readText(path, label);
  rejectDuplicateJsonKeys(text, label);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function rejectDuplicateJsonKeys(text, label) {
  const stack = [];
  for (let index = 0; index < text.length;) {
    const character = text[index];
    if (character === "{") { stack.push({ type: "object", keys: new Set() }); index++; continue; }
    if (character === "[") { stack.push({ type: "array" }); index++; continue; }
    if (character === "}" || character === "]") { stack.pop(); index++; continue; }
    if (character !== '"') { index++; continue; }
    const start = index++;
    let escaped = false;
    while (index < text.length) {
      const current = text[index++];
      if (escaped) escaped = false;
      else if (current === "\\") escaped = true;
      else if (current === '"') break;
    }
    check(index <= text.length && text[index - 1] === '"', `${label} has an unterminated string`);
    let cursor = index;
    while (/\s/u.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const owner = stack.at(-1);
    check(owner?.type === "object", `${label} has a key outside an object`);
    let key;
    try { key = JSON.parse(text.slice(start, index)); }
    catch { fail(`${label} contains an invalid key`); }
    check(!owner.keys.has(key), `${label} contains duplicate key ${key}`);
    owner.keys.add(key);
  }
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: MAX_INPUT_SIZE });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}

function parseArguments(argv) {
  const options = { report: DEFAULT_REPORT_PATH };
  const supplied = new Set();
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--target", "--readelf", "--objdiff", "--report"].includes(option) && value !== undefined,
      "usage: validate-cro-dll-dendou-pc.mjs [--report <path>] " +
      "[--object <path> --readelf <path>] [--target <path> --objdiff <path>]");
    const key = option.slice(2);
    check(!supplied.has(key), `${option} was supplied more than once`);
    supplied.add(key);
    options[key] = resolve(value);
  }
  check((options.object === undefined) === (options.readelf === undefined),
    "--object and --readelf must be supplied together");
  check((options.target === undefined) === (options.objdiff === undefined),
    "--target and --objdiff must be supplied together");
  check(options.target === undefined || options.object !== undefined,
    "focused comparison also requires --object and --readelf");
  for (const [label, path] of Object.entries(options)) {
    check(existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(),
      `${label} is not a non-symlink regular file`);
  }
  return options;
}

function parseInventory() {
  const lines = readText(INVENTORY_PATH, `${UNIT} inventory`).split(/\r?\n/u);
  check(lines[0] === "# Format,CRO_FUNCTIONS_V1" && lines[1] === `# Module,${REPORT_UNIT}` &&
    lines[2] === "# TextSize,00003228" && lines[3] === "Location,Name,Namespace,Mode,Size,Segment",
  "public inventory header changed");
  const functions = new Map();
  for (const [index, line] of lines.slice(4).entries()) {
    if (line === "" && index === lines.length - 5) continue;
    const match = /^([0-9A-F]{8}),"(func_[0-9A-F]{8})","Global",\$(a|t),([0-9A-F]{8}),"\.text"$/u.exec(line);
    check(match !== null, `public inventory line ${index + 5} is not canonical`);
    const fn = { name: match[2], address: Number.parseInt(match[1], 16), mode: match[3] === "a" ? "arm" : "thumb",
      size: Number.parseInt(match[4], 16) };
    check(!functions.has(fn.name), `public inventory duplicates ${fn.name}`);
    functions.set(fn.name, fn);
  }
  check(functions.size === 17 && [...functions.values()].reduce((sum, fn) => sum + fn.size, 0) === 5556,
    "public accepted-function accounting changed");
  return functions;
}

function validatePublicContract() {
  const publicSet = validatePublicCroMetadataTree(ROOT, { requireComplete: true });
  check(publicSet.unitCount === 145 && publicSet.complete === true,
    "aggregate public CRO metadata validation did not prove the complete set");
  const functions = parseInventory();
  const config = readJson(CONFIG_PATH, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  const units = config.units.filter((entry) => entry?.name === UNIT);
  check(units.length === 1, `${UNIT} must have exactly one source-config entry`);
  const unit = units[0];
  exactKeys(unit, "functions,name,sources", UNIT);
  check(unit.sources.length === 1 && unit.functions.length === 1, `${UNIT} ownership must remain singular`);
  exactKeys(unit.sources[0], "mode,path", `${UNIT} source`);
  check(unit.sources[0].path === `src/cro/${UNIT}/contract_09.S` && unit.sources[0].mode === "arm",
    `${UNIT} source identity changed`);
  const claim = unit.functions[0];
  exactKeys(claim, "address,name,semantics,size", `${UNIT} claim`);
  const accepted = functions.get(claim.name);
  check(accepted?.address === claim.address && accepted.size === claim.size && accepted.mode === "arm" &&
    claim.size === 172 && claim.semantics === "contract-09-record-finalization",
  `${UNIT} claim differs from its public boundary or reviewed semantic label`);

  const source = readText(SOURCE_PATH, `${UNIT} source`);
  check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(source), "source contains encoded data");
  check(!/^\s*(?:\.(?:incbin|include)\b|#\s*include\b)/imu.test(source),
    "source imports content outside its owned regular file");
  for (const fragment of [`.section .text.${claim.name}, "ax", %progbits`, `.global ${claim.name}`,
    `.type ${claim.name}, %function`, `.size ${claim.name}, . - ${claim.name}`]) {
    check(source.split(fragment).length === 2, `source lacks one exact ${claim.name} declaration`);
  }

  const partition = readJson(PARTITION_PATH, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 12840,
    "partition identity or text size changed");
  const groups = [["functions", 17, 5556], ["gaps", 171, 6280], ["pools", 175, 964], ["unknown", 1, 40]];
  const entrySchemas = new Map([["functions", "address,mode,name,size"], ["gaps", "address,mode,size"],
    ["pools", "address,size"], ["unknown", "address,size"]]);
  for (const [name, count, bytes] of groups) {
    check(Array.isArray(partition[name]) && partition[name].length === count,
      `partition ${name} count changed`);
    check(partition[name].reduce((sum, entry) => sum + entry.size, 0) === bytes,
      `partition ${name} byte count changed`);
    for (const [index, entry] of partition[name].entries()) {
      exactKeys(entry, entrySchemas.get(name), `partition ${name} entry ${index}`);
    }
  }
  const intervals = groups.flatMap(([name]) => partition[name].map((entry) => ({ address: entry.address, size: entry.size })))
    .sort((left, right) => left.address - right.address);
  let cursor = 0;
  for (const interval of intervals) {
    check(Number.isSafeInteger(interval.address) && Number.isSafeInteger(interval.size) && interval.size > 0,
      "partition contains an invalid interval");
    check(interval.address === cursor, "partition no longer covers text exactly without overlap");
    cursor += interval.size;
  }
  check(cursor === partition.textSize, "partition does not cover the complete text segment");
  check(partition.functions.length === functions.size && partition.functions.every((entry) => {
    const fn = functions.get(entry.name);
    return fn?.address === entry.address && fn.size === entry.size && fn.mode === entry.mode;
  }), "partition functions differ from the public inventory");

  const manifest = readJson(MANIFEST_PATH, "public CRO manifest");
  exactKeys(manifest, "schemaVersion,target,unitCount,units", "public CRO manifest");
  check(manifest.schemaVersion === 1 && manifest.target === "AS_EUR_REV2" && manifest.unitCount === 145 &&
    Array.isArray(manifest.units) && manifest.units.length === manifest.unitCount,
  "public CRO manifest schema or target changed");
  const manifestUnits = manifest.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(manifestUnits.length === 1, "public manifest must contain the unit exactly once");
  exactKeys(manifestUnits[0], "name,sha256,size", "public manifest unit");
  check(manifestUnits[0].size === 28672 && typeof manifestUnits[0].sha256 === "string" &&
    /^[0-9a-f]{64}$/u.test(manifestUnits[0].sha256),
    "public manifest unit identity or size changed");

  const spec = readText(SPEC_PATH, `${UNIT} provenance specification`);
  for (const marker of ["AS_EUR_REV2", "2026-10-17", "Node.js 24.21.0", "Git 2.53.0",
    "analysis/verification role", "No implementation was written or changed", "metadata.complete", "deterministic whole-unit identity proof"]) {
    check(spec.includes(marker), `provenance specification lacks ${marker}`);
  }
  const ownedText = `${source}\n${spec}`;
  check(!/(?:\.3ds\b|\.cia\b|\.cxi\b|\.ncch\b|baserom|\/private\/|\/extracted\/)/iu.test(ownedText),
    "owned text contains a forbidden private or container path marker");
  return { claim, functions, packedStart: groups.find(([name]) => name === "gaps")[2] };
}

function validateReport(path, contract) {
  const report = readJson(path, "objdiff report");
  exactKeys(report, "measures,units,version", "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  exactKeys(unit, "functions,measures,metadata,name,sections", "report unit");
  check(JSON.stringify(unit.metadata) === JSON.stringify({ complete: false, source_path: `src/cro/${UNIT}/contract_09.S` }),
    "report metadata is not exact and fail-closed");
  exactKeys(unit.measures,
    "fuzzy_match_percent,matched_code,matched_code_percent,matched_functions,matched_functions_percent,total_code,total_data,total_functions,total_units",
    "report measures");
  check(unit.measures?.total_code === "5556" && unit.measures?.matched_code === "172" &&
    unit.measures?.total_data === "1908" && unit.measures?.total_functions === 17 &&
    unit.measures?.matched_functions === 1 && unit.measures?.total_units === 1 &&
    unit.measures?.matched_code_percent === 3.0957525 && unit.measures?.matched_functions_percent === 5.882353 &&
    unit.measures?.fuzzy_match_percent === 3.0957522,
  "report accounting differs from the public claim");

  check(Array.isArray(unit.functions) && unit.functions.length === contract.functions.size,
    "report function count differs from the public inventory");
  let expectedAddress = contract.packedStart;
  const acceptedFunctions = [...contract.functions.values()];
  for (const [index, fn] of unit.functions.entries()) {
    const accepted = acceptedFunctions[index];
    const matched = fn.name === contract.claim.name;
    exactKeys(fn, matched ? "address,fuzzy_match_percent,metadata,name,size" : "address,metadata,name,size",
      `report function ${fn.name}`);
    check(fn.name === accepted?.name && fn.size === String(accepted.size) && fn.address === String(expectedAddress) &&
      JSON.stringify(fn.metadata) === "{}", `report function ${fn.name} differs from the public packed inventory`);
    if (matched) check(fn.fuzzy_match_percent === 100, "the reviewed claim is not an exact report match");
    expectedAddress += accepted.size;
  }
  check(expectedAddress === 11836, "report packed function coverage does not reconcile with .text");

  const expectedSections = new Map([[".text", "11836"], [".pool", "964"], [".rodata", "868"],
    [".data", "60"], [".bss", "16"]]);
  check(Array.isArray(unit.sections) && unit.sections.length === expectedSections.size,
    "report section inventory changed");
  const seenSections = new Set();
  for (const section of unit.sections) {
    exactKeys(section, "metadata,name,size", `report section ${section.name}`);
    check(!seenSections.has(section.name) && expectedSections.get(section.name) === section.size &&
      JSON.stringify(section.metadata) === "{}", `report ${section.name} accounting or metadata changed`);
    seenSections.add(section.name);
  }
  check(seenSections.size === expectedSections.size && [...expectedSections.keys()].every((name) => seenSections.has(name)),
    "report section set is incomplete");
}

function relocationCount(output) {
  return output.split("\n").filter((line) => /^\s*[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+/u.test(line)).length;
}

function validateObject(object, readelf, claim) {
  const section = `.text.${claim.name}`;
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    "authored object is not a relocatable ARM ELF");
  const sections = run(readelf, ["--sections", "--wide", object]);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const sectionRecords = sections.split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match ? [{ name: match[1], type: match[2], size: Number.parseInt(match[3], 16), flags: match[4], line }] : [];
  });
  const sectionMatches = sectionRecords.filter((entry) => entry.name === section);
  check(sectionMatches.length === 1 && sectionMatches[0].type === "PROGBITS" && sectionMatches[0].size === claim.size &&
    sectionMatches[0].flags.includes("A") && sectionMatches[0].flags.includes("X"),
    "authored executable section is not the reviewed 172-byte boundary");
  const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${claim.name}$`, "u").test(line.trimEnd()));
  check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${claim.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${claim.name}$`, "u").test(symbolLines[0]),
    "authored function symbol does not match the reviewed claim");
  check(relocationCount(relocations) === 0, "authored object unexpectedly contains relocations");
  const allocated = sectionRecords.filter((entry) => entry.size > 0 && entry.flags.includes("A"));
  check(allocated.length === 1 && allocated[0].name === section,
    "authored object contains unowned allocated code or data");
}

function validateFocusedComparison(target, object, objdiff, claim) {
  const output = run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", claim.name]);
  let report;
  try { report = JSON.parse(output); }
  catch { fail("objdiff did not emit JSON"); }
  const left = report?.left?.symbols?.filter((symbol) => symbol.name === claim.name) ?? [];
  const right = report?.right?.symbols?.filter((symbol) => symbol.name === claim.name) ?? [];
  check(left.length === 1 && right.length === 1 && left[0].size === String(claim.size) &&
    right[0].size === String(claim.size) && left[0].match_percent === 100 && right[0].match_percent === 100,
  "objdiff does not report one exact reviewed-function match");
}

try {
  const options = parseArguments(process.argv.slice(2));
  const contract = validatePublicContract();
  validateReport(options.report, contract);
  if (options.object) validateObject(options.object, options.readelf, contract.claim);
  if (options.target) validateFocusedComparison(options.target, options.object, options.objdiff, contract.claim);
  console.log(`Validated ${REPORT_UNIT}: 1/17 functions and 172/5556 accepted code bytes; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
