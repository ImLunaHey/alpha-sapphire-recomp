#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllPhotoSaver";
const FUNCTION = "func_00000000";
const SECTION = `.text.${FUNCTION}`;
const CONFIG_PATH = join(ROOT, "config", "cro-sources.json");
const SOURCE_PATH = join(ROOT, "src", "cro", "DllPhotoSaver.c");
const INVENTORY_PATH = join(ROOT, "symbols", "cro", "DllPhotoSaver.csv");

function fail(message) {
  throw new Error(`CRO DllPhotoSaver validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}

function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--target", "--readelf", "--objdiff"].includes(option) && value !== undefined,
      "usage: validate-cro-photo-saver-01.mjs [--object <path> --readelf <path>] [--target <path> --objdiff <path>]");
    result[option.slice(2)] = resolve(value);
  }
  check((result.object === undefined) === (result.readelf === undefined), "--object and --readelf must be supplied together");
  check((result.target === undefined) === (result.objdiff === undefined), "--target and --objdiff must be supplied together");
  check(result.target === undefined || result.object !== undefined, "authoritative comparison also requires --object and --readelf");
  for (const [label, path] of Object.entries(result)) {
    check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  }
  return result;
}

function validatePublicContract() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  exactKeys(config, "schemaVersion,units", "config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "config version or units are invalid");
  const unit = config.units.find((entry) => entry?.name === UNIT);
  check(unit !== undefined, `config lacks ${UNIT}`);
  exactKeys(unit, "functions,name,sources", UNIT);
  check(unit.sources.length === 1, `${UNIT} must have one source`);
  exactKeys(unit.sources[0], "mode,path", `${UNIT} source`);
  check(unit.sources[0].path === "src/cro/DllPhotoSaver.c" && unit.sources[0].mode === "arm", `${UNIT} source identity is invalid`);
  check(unit.functions.length === 1, `${UNIT} must claim one function`);
  const fn = unit.functions[0];
  exactKeys(fn, "address,name,offset,semantics,size", `${UNIT} function`);
  check(fn.name === FUNCTION && fn.address === 0 && fn.size === 8 && fn.semantics === "store-u8" && fn.offset === 217,
    `${UNIT} function contract is invalid`);

  const rows = readFileSync(INVENTORY_PATH, "utf8").split(/\r?\n/u).filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === 1, `${UNIT} public inventory must contain exactly one neutral function`);
  check(rows[0] === '00000000,"func_00000000","Global",$a,00000008,".text"', `${UNIT} public inventory boundary changed`);

  const source = readFileSync(SOURCE_PATH, "utf8");
  check(!/\b(?:asm|__asm__|__attribute__)\b/u.test(source), "source uses an opaque compiler escape hatch");
  const normalized = source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "").replace(/\s+/gu, " ").trim();
  check(normalized === "#include <stdint.h> void func_00000000(uint8_t *base, uint8_t value) { base[217] = value; }",
    "source no longer expresses the reviewed byte-store semantics");
}

function validateObject(object, readelf) {
  const sections = run(readelf, ["--sections", "--wide", object]);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const hex = run(readelf, ["--hex-dump", SECTION, object]);
  const sectionLines = sections.split("\n").filter((line) => line.includes(SECTION));
  check(sectionLines.length === 1 && /PROGBITS\s+\S+\s+\S+\s+000008\s+\S+\s+AX\s/u.test(sectionLines[0]),
    "authored executable section is not an 8-byte AX PROGBITS section");
  const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${FUNCTION}$`, "u").test(line.trimEnd()));
  check(symbolLines.length === 1 && /00000000\s+8\s+FUNC\s+GLOBAL\s+DEFAULT\s+\d+\s+func_00000000$/u.test(symbolLines[0].trim()),
    "authored function symbol is invalid");
  check(!relocations.includes(`'.rel${SECTION}'`) && !relocations.includes(`'.rela${SECTION}'`), "authored function unexpectedly has relocations");
  const words = [...hex.matchAll(/^\s*0x[0-9a-f]+\s+([0-9a-f]{8})\s+([0-9a-f]{8})/gimu)].flatMap((match) => [match[1], match[2]]);
  check(words.length === 2 && words[0] === "d910c0e5" && words[1] === "1eff2fe1",
    "compiled instructions are not the reviewed store-byte and return sequence");
  for (const forbidden of [".text ", ".data ", ".bss ", ".rodata "]) {
    check(!sections.split("\n").some((line) => line.includes(`] ${forbidden}`)), `base object retains unowned ${forbidden.trim()} data`);
  }
}

function validateObjdiff(target, object, objdiff) {
  const output = run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", FUNCTION]);
  let report;
  try {
    report = JSON.parse(output);
  } catch {
    fail("objdiff did not emit JSON");
  }
  const left = report?.left?.symbols?.filter((symbol) => symbol.name === FUNCTION) ?? [];
  const right = report?.right?.symbols?.filter((symbol) => symbol.name === FUNCTION) ?? [];
  check(left.length === 1 && right.length === 1, "objdiff did not resolve exactly one function on each side");
  check(left[0].size === "8" && right[0].size === "8" && left[0].match_percent === 100 && right[0].match_percent === 100,
    "objdiff does not report an exact 8-byte function match");
  const accidental = report.left.sections.filter((section) => section.name !== SECTION && section.match_percent > 0);
  check(accidental.length === 0, `objdiff reports accidental non-code credit in ${accidental.map((section) => section.name).join(", ")}`);
}

try {
  const options = parseArguments(process.argv.slice(2));
  validatePublicContract();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.target) validateObjdiff(options.target, options.object, options.objdiff);
  console.log(`Validated ${UNIT}/${FUNCTION}: independently authored 8-byte ARM store leaf${options.target ? ", authoritative objdiff 100%" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
