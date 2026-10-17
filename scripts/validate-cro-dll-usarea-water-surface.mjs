#!/usr/bin/env node

import crypto from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllUSAreaWaterSurface";
const CONFIG = join(ROOT, "config", "cro-sources.json");
const INVENTORY = join(ROOT, "symbols", "cro", `${UNIT}.csv`);
const PARTITION = join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`);
const SPEC = join(ROOT, "docs", "specs", "cro", `${UNIT}.md`);
const SOURCES = [
  "src/cro/DllUSAreaWaterSurface/contract_08.S",
  "src/cro/DllUSAreaWaterSurface/accepted_methods.S",
];
const FUNCTIONS = [
  ["func_00000570", 0x570, 152, "contract-08-water-surface-loop", "34ffe2a5f72a9c42259e1a11ffb19384978f12a0a61d35176d225ba8d1f13ff3"],
  ["func_00000610", 0x610, 248, "water-surface-enable-predicate", "135aa7cf432bc27f4f3961e9b8c9b92bcc6c733d139ebc675e2a86a55c989230"],
].map(([name, address, size, semantics, bodyHash]) => ({ name, address, size, semantics, bodyHash }));

function fail(message) { throw new Error(`${UNIT} validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function hash(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
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
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-dll-usarea-water-surface.mjs [--object <path> --readelf <path>]");
    const key = option.slice(2);
    check(options[key] === undefined, `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check((options.object === undefined) === (options.readelf === undefined), "--object and --readelf must be supplied together");
  for (const [label, path] of Object.entries(options)) check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  return options;
}

function validateRepository() {
  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  exactKeys(config, "schemaVersion,units", "config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "config is invalid");
  const unit = config.units.find((entry) => entry?.name === UNIT);
  exactKeys(unit, "functions,name,sources", UNIT);
  check(unit.sources.length === SOURCES.length && unit.functions.length === FUNCTIONS.length, "owned source or function count differs");
  for (const [index, source] of SOURCES.entries()) {
    exactKeys(unit.sources[index], "mode,path", `source ${index}`);
    check(unit.sources[index].path === source && unit.sources[index].mode === "arm", `source ${index} ownership differs`);
    const path = resolve(ROOT, source);
    check(inside(ROOT, path) && existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(), `${source} is not a regular owned file`);
    const text = readFileSync(path, "utf8");
    check(!/\.incbin\b|^\s*\.(?:byte|hword|short|word|long|quad|inst|ascii|asciz|string)\b/imu.test(text), `${source} contains encoded data`);
    check(!/^\s*\.(?:data|rodata|bss)\b/imu.test(text), `${source} contains an authored data section`);
  }
  for (const [index, fn] of FUNCTIONS.entries()) {
    const claim = unit.functions[index];
    exactKeys(claim, "address,name,semantics,size", `${fn.name} claim`);
    check(claim.name === fn.name && claim.address === fn.address && claim.size === fn.size && claim.semantics === fn.semantics,
      `${fn.name} ownership differs`);
  }

  const rows = readFileSync(INVENTORY, "utf8").split(/\r?\n/u).filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === FUNCTIONS.length, "public inventory has missing or extra function rows");
  for (const [index, fn] of FUNCTIONS.entries()) {
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(rows[index] === row, `${fn.name} public inventory boundary differs`);
  }

  const partition = JSON.parse(readFileSync(PARTITION, "utf8"));
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", "partition");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 0xA4C, "partition identity differs");
  check(partition.functions.length === FUNCTIONS.length, "partition function count differs");
  for (const [index, fn] of FUNCTIONS.entries()) {
    const entry = partition.functions[index];
    exactKeys(entry, "address,mode,name,size", `${fn.name} partition entry`);
    check(entry.name === fn.name && entry.address === fn.address && entry.size === fn.size && entry.mode === "arm", `${fn.name} partition boundary differs`);
  }
  check(partition.gaps.some((gap) => gap.address === 0x0C8 && gap.size === 0x1A8) &&
    partition.gaps.some((gap) => gap.address === 0x70C && gap.size === 0x134) && partition.unknown.length > 0,
  "partition no longer records the unresolved code/data remainder");

  const spec = readFileSync(SPEC, "utf8");
  for (const digest of FUNCTIONS.filter((fn) => fn.name !== "func_00000570").map((fn) => fn.bodyHash))
    check(spec.includes(digest), `public specification lacks accepted digest ${digest}`);
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

function validateObject(object, readelf) {
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header), "object is not a relocatable ARM ELF");
  const sections = run(readelf, ["--sections", "--wide", object]);
  const allocated = sections.split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match && match[4].includes("A") && Number.parseInt(match[3], 16) !== 0
      ? [{ name: match[1], type: match[2], size: Number.parseInt(match[3], 16), flags: match[4] }] : [];
  });
  const expected = new Set(FUNCTIONS.map((fn) => `.text.${fn.name}`));
  check(allocated.length === FUNCTIONS.length && allocated.every((section) => expected.has(section.name) && section.type === "PROGBITS" && section.flags.includes("X")),
    "nonempty allocated section set is not exact executable-only ownership");

  const symbols = run(readelf, ["--symbols", "--wide", object]);
  check(!/^\s*\d+:\s+\S+\s+\d+\s+\S+\s+GLOBAL\s+\S+\s+UND\s+/mu.test(symbols), "undefined global symbol is forbidden");
  const globals = symbols.split("\n").filter((line) => /\sGLOBAL\s+DEFAULT\s+\d+\s+func_[0-9A-F]{8}\s*$/u.test(line));
  check(globals.length === FUNCTIONS.length, "global function symbol set is not exact");
  for (const fn of FUNCTIONS) {
    const section = allocated.find((entry) => entry.name === `.text.${fn.name}`);
    check(section?.size === fn.size, `${fn.name} section size differs`);
    const bytes = sectionBytes(readelf, object, section.name);
    check(bytes.length === fn.size && hash(bytes) === fn.bodyHash, `${fn.name} body differs from the accepted public digest`);
    const matches = globals.filter((line) => new RegExp(`\\s${fn.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${fn.name}\\s*$`, "u").test(line));
    check(matches.length === 1, `${fn.name} function symbol differs`);
  }
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  check(/There are no relocations in this file\./u.test(relocations), "reconstructed unit must contain zero relocations");
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateRepository();
  if (options.object) validateObject(options.object, options.readelf);
  console.log(`Validated ${FUNCTIONS.length} ${UNIT} functions (400 bytes; 1 newly reconstructed function / 248 bytes)${options.object ? " and isolated object" : ""}; unresolved module remainder retained.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
