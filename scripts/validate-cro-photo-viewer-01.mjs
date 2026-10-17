#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllPhotoViewer";

function fail(message) {
  throw new Error(`CRO ${UNIT} analysis 01 validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function readJson(...parts) {
  return JSON.parse(readFileSync(join(ROOT, ...parts), "utf8"));
}

function sum(entries) {
  return entries.reduce((total, entry) => total + entry.size, 0);
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
    check(["--object", "--readelf", "--target", "--objdiff"].includes(option) && value !== undefined,
      "usage: validate-cro-photo-viewer-01.mjs [--object <path> --readelf <path>] [--target <path> --objdiff <path>]");
    options[option.slice(2)] = resolve(value);
  }
  check((options.object === undefined) === (options.readelf === undefined), "--object and --readelf must be supplied together");
  check((options.target === undefined) === (options.objdiff === undefined), "--target and --objdiff must be supplied together");
  check(options.target === undefined || options.object !== undefined, "authoritative comparison also requires the base object");
  for (const [label, path] of Object.entries(options)) {
    check(existsSync(path) && statSync(path).isFile(), `${label} is not a regular file`);
  }
  return options;
}

function validateInventory() {
  const partition = readJson("symbols", "cro-partitions", `${UNIT}.json`);
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 5384,
    "partition identity or text size changed");
  check(Array.isArray(partition.functions) && Array.isArray(partition.gaps) &&
    Array.isArray(partition.pools) && Array.isArray(partition.unknown), "partition arrays are missing");
  check(partition.functions.length === 2 && sum(partition.functions) === 604,
    "accepted function inventory is not exactly 2 functions / 604 bytes");
  check(partition.gaps.length === 86 && sum(partition.gaps) === 3944,
    "unclaimed executable inventory is not exactly 86 ranges / 3,944 bytes");
  check(partition.pools.length === 81 && sum(partition.pools) === 444,
    "pool inventory is not exactly 81 ranges / 444 bytes");
  check(partition.unknown.length === 11 && sum(partition.unknown) === 392,
    "unknown residue is not exactly 11 ranges / 392 bytes");
  check(sum(partition.functions) + sum(partition.gaps) + sum(partition.pools) +
    sum(partition.unknown) === partition.textSize, "partition does not account for the full text extent");

  const functions = partition.functions.map(({ name, address, size, mode }) => ({ name, address, size, mode }));
  check(JSON.stringify(functions) === JSON.stringify([
    { name: "func_00000F20", address: 3872, size: 596, mode: "arm" },
    { name: "func_0000133C", address: 4924, size: 8, mode: "arm" },
  ]), "accepted function boundaries changed");

  const csv = readFileSync(join(ROOT, "symbols", "cro", `${UNIT}.csv`), "utf8");
  const rows = csv.split(/\r?\n/u).filter((line) => /^[0-9A-F]{8},/u.test(line));
  check(rows.length === 2, "public CSV does not contain exactly two functions");
  check(rows[0] === '00000F20,"func_00000F20","Global",$a,00000254,".text"' &&
    rows[1] === '0000133C,"func_0000133C","Global",$a,00000008,".text"',
  "public CSV boundaries changed");
}

function validateCurrentClaim() {
  const config = readJson("config", "cro-sources.json");
  const unit = config.units?.find((entry) => entry?.name === UNIT);
  check(unit?.sources?.length === 1 && unit.sources[0]?.path === "src/cro/DllPhotoViewer.c" &&
    unit.sources[0]?.mode === "arm", "authored source binding changed");
  check(unit?.functions?.length === 1, "the unit must claim only its implemented leaf");
  const fn = unit.functions[0];
  check(fn?.name === "func_0000133C" && fn.address === 4924 && fn.size === 8 &&
    fn.semantics === "store-u8" && fn.offset === 217, "leaf claim changed");

  const source = readFileSync(join(ROOT, "src", "cro", `${UNIT}.c`), "utf8");
  const normalized = source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/.*$/gmu, "")
    .replace(/\s+/gu, " ").trim();
  check(normalized === "#include <stdint.h> void func_0000133C(uint8_t *base, uint8_t value) { base[217] = value; }",
    "leaf source no longer expresses the reviewed byte-store contract");
}

function validateAnalysisHandoff() {
  const spec = readFileSync(join(ROOT, "docs", "specs", "cro", `${UNIT}_analysis_01.md`), "utf8");
  for (const required of [
    /Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`/u,
    /complete `\.text` partition accounts for all 5,384 bytes without holes/u,
    /100 text relocation words in total/u,
    /186 absolute type-2 relocation outputs/u,
    /`\.rodata` 932 bytes, `\.data` 4 bytes, and zero-initialized/u,
    /data denominator is 1,456 bytes/u,
    /all remaining code boundaries/u,
  ]) check(required.test(spec.replace(/\s+/gu, " ")), `analysis handoff lacks required evidence: ${required}`);
  check(!spec.includes("/home/") && !spec.includes("ROM_PATH=") && !spec.includes("DECOMP_PRIVATE="),
    "analysis handoff contains a private path or environment assignment");

  const links = readFileSync(join(ROOT, "docs", "specs", "cro", `${UNIT}_analysis_02.md`), "utf8");
  const normalizedLinks = links.replace(/\s+/gu, " ");
  for (const required of [
    /reproduced the authorized root checkout's existing structural and split target objects exactly/u,
    /zero relocation records for both `\.text\.func_00000F20` \(596 bytes\) and `\.text\.func_0000133C` \(8 bytes\)/u,
    /retains external call relocations cannot obtain an exact function match/u,
    /all 17 anonymous import-slot bindings/u,
    /comparison blocker and unresolved behavioral\/helper\/resource contracts remain/u,
  ]) check(required.test(normalizedLinks), `link-boundary handoff lacks required evidence: ${required}`);
  const imports = links.match(/`__cro_import_anon_m[0-9a-f]+_s0_[0-9a-f]{7}`/gu) ?? [];
  check(new Set(imports).size === 17, "link-boundary handoff does not contain exactly 17 neutral import identities");
  check(!links.includes("/home/") && !links.includes("ROM_PATH=") && !links.includes("DECOMP_PRIVATE="),
    "link-boundary handoff contains a private path or environment assignment");
}

function validatePublishedState() {
  const report = readJson("progress", "reports", "AS_EUR_REV2", "report.json");
  const unit = report.units?.find((entry) => entry?.name === `cro/${UNIT}`);
  check(unit !== undefined, "published report lacks the unit");
  check(unit.metadata?.complete === false, "unit must remain incomplete while residue is unimplemented");
  check(unit.measures?.total_code === "604" && unit.measures?.matched_code === "8" &&
    unit.measures?.total_data === "1456" && unit.measures?.total_functions === 2 &&
    unit.measures?.matched_functions === 1, "published report no longer matches the reviewed baseline");
}

function validateObject(object, readelf) {
  const section = ".text.func_0000133C";
  const sections = run(readelf, ["--sections", "--wide", object]);
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const sectionLines = sections.split("\n").filter((line) => line.includes(section));
  check(sectionLines.length === 1 && /PROGBITS\s+\S+\s+\S+\s+000008\s+\S+\s+AX\s/u.test(sectionLines[0]),
    "leaf section is not an 8-byte executable PROGBITS section");
  const symbolLines = symbols.split("\n").filter((line) => /\sfunc_0000133C$/u.test(line.trimEnd()));
  check(symbolLines.length === 1 && /00000000\s+8\s+FUNC\s+GLOBAL\s+DEFAULT\s+\d+\s+func_0000133C$/u.test(symbolLines[0].trim()),
    "leaf symbol is invalid");
  check(!relocations.includes(`'.rel${section}'`) && !relocations.includes(`'.rela${section}'`),
    "leaf unexpectedly has relocations");
}

function validateObjdiff(target, object, objdiff) {
  const output = run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", "func_0000133C"]);
  let result;
  try { result = JSON.parse(output); } catch { fail("objdiff did not emit JSON"); }
  for (const [side, objectReport] of [["target", result?.left], ["base", result?.right]]) {
    const functions = objectReport?.symbols?.filter((symbol) => symbol.name === "func_0000133C") ?? [];
    check(functions.length === 1 && functions[0].size === "8" && functions[0].match_percent === 100,
      `${side} does not report one exact 8-byte leaf match`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateInventory();
  validateCurrentClaim();
  validateAnalysisHandoff();
  validatePublishedState();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.target) validateObjdiff(options.target, options.object, options.objdiff);
  console.log(`Validated ${UNIT} analysis 01: 8/604 accepted code bytes, 0/1,456 data bytes, 392 unknown text bytes; complete=false${options.target ? ", authoritative leaf objdiff=100%" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
