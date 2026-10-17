#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const SOURCE = "src/cro/DllUSGymFire/duplicate_leaves_01.S";
const INVENTORY = join(ROOT, "symbols/cro/DllUSGymFire.csv");
const PARTITION = join(ROOT, "symbols/cro-partitions/DllUSGymFire.json");
const CONFIG = join(ROOT, "config/cro-sources.json");
const VENEER_HASH = "0312bf80d0c3005ff824cbe7fd69fee6f24c7bf126b40d67c3e3a8cf6427ec71";
const LEAVES = [
  [0x01a0, 20, "gym-fire-record-clear", "0e7762faf1b7806b53935252031950abc21cfc29574c369042eff700f7cc2baa"],
  [0x0690, 8, "gym-fire-return-one", "007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47"],
  [0x0eec, 16, "gym-fire-base-destroy-and-release", "6df58c8c8111b2b3e7824fd55ef235ff8fbf9305b3db6aaf9d6375d3c9eb7f18"],
  [0x0f08, 8, "gym-fire-return-zero-0f08", "6dcd5e75586fe6683156c0d559d4827b73bd48d501fa5781a1c6099aacd7c877"],
  [0x0f10, 8, "gym-fire-return-zero-0f10", "6dcd5e75586fe6683156c0d559d4827b73bd48d501fa5781a1c6099aacd7c877"],
  [0x0f18, 8, "gym-fire-return-zero-0f18", "6dcd5e75586fe6683156c0d559d4827b73bd48d501fa5781a1c6099aacd7c877"],
  [0x0f24, 8, "gym-fire-return-zero-0f24", "6dcd5e75586fe6683156c0d559d4827b73bd48d501fa5781a1c6099aacd7c877"],
];
const CLAIMS = [
  ...Array.from({ length: 52 }, (_, index) => {
    const address = index * 8;
    return { address, size: 4, semantics: `gym-fire-import-veneer-${index.toString(16).toUpperCase().padStart(2, "0")}`, hash: VENEER_HASH, veneer: index };
  }),
  ...LEAVES.map(([address, size, semantics, hash]) => ({ address, size, semantics, hash })),
].map((claim) => ({ ...claim, name: `func_${claim.address.toString(16).toUpperCase().padStart(8, "0")}` }));

function fail(message) { throw new Error(`DllUSGymFire leaves 01 validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function hash(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
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
    check(["--object-directory", "--readelf", "--target"].includes(option) && value !== undefined,
      "usage: validate-cro-dll-us-gym-fire-leaves-01.mjs [--object-directory <path> --readelf <path>] [--target <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined, `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check((options.objectDirectory === undefined) === (options.readelf === undefined),
    "--object-directory and --readelf must be supplied together");
  check(options.target === undefined || options.readelf !== undefined, "--target requires --readelf");
  for (const [key, path] of Object.entries(options)) {
    check(existsSync(path) && (key === "objectDirectory" ? statSync(path).isDirectory() : statSync(path).isFile()), `${key} is invalid`);
  }
  return options;
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
function validateRepository() {
  check(CLAIMS.length === 59 && CLAIMS.reduce((sum, claim) => sum + claim.size, 0) === 284, "claim totals differ");
  const sourcePath = resolve(ROOT, SOURCE);
  check(sourcePath.startsWith(`${ROOT}${sep}`) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() && !lstatSync(sourcePath).isSymbolicLink(),
    "owned source is not a regular in-tree file");
  const source = readFileSync(sourcePath, "utf8");
  check(!/^\s*\.(?:incbin|byte|hword|short|long|quad|ascii|asciz|string|inst)\b/imu.test(source), "source contains opaque encoded material");
  check((source.match(/^\s*\.word dllusgymfire_import_\\import$/gmu) ?? []).length === 1, "source must contain one parameterized neutral veneer slot directive");
  check((source.match(/^GYM_FIRE_VENEER [0-9A-F]{4}, [0-9A-F]{2}$/gmu) ?? []).length === 52, "source does not instantiate exactly 52 veneers");
  check(!/(?:\/home\/|\.3ds\b|target\/cro-split|AS_EUR_REV2\/target)/iu.test(source), "source contains a private or ROM path");

  const inventory = readFileSync(INVENTORY, "utf8").split(/\r?\n/u);
  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  const unit = config.units.find((entry) => entry.name === "DllUSGymFire");
  check(unit && unit.sources.filter((entry) => entry.path === SOURCE && entry.mode === "arm").length === 1, "source ownership is not exact");
  const partition = JSON.parse(readFileSync(PARTITION, "utf8"));
  check(partition.format === 1 && partition.module === "DllUSGymFire" && partition.textSize === 6424, "partition identity differs");
  for (const claim of CLAIMS) {
    const row = `${claim.address.toString(16).toUpperCase().padStart(8, "0")},"${claim.name}","Global",$a,${claim.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(inventory.filter((line) => line === row).length === 1, `${claim.name} inventory boundary differs`);
    check(unit.functions.filter((entry) => entry.name === claim.name && entry.address === claim.address && entry.size === claim.size && entry.semantics === claim.semantics).length === 1,
      `${claim.name} integrated claim differs`);
    check(partition.functions.filter((entry) => entry.name === claim.name && entry.address === claim.address && entry.size === claim.size && entry.mode === "arm").length === 1,
      `${claim.name} partition boundary differs`);
    if (claim.veneer !== undefined) check(partition.pools.filter((entry) => entry.address === claim.address + 4 && entry.size === 4).length === 1,
      `${claim.name} adjacent import pool differs`);
  }
  check(unit.functions.length === 60 && partition.functions.length === 60 && partition.gaps.length === 14 && partition.pools.length === 64 && partition.unknown.length === 3,
    "integrated unit or partition totals differ");
}
function parseAllocatedSections(readelf, object) {
  return run(readelf, ["--sections", "--wide", object]).split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match && match[4].includes("A") && Number.parseInt(match[3], 16) !== 0
      ? [{ name: match[1], type: match[2], size: Number.parseInt(match[3], 16), flags: match[4] }] : [];
  });
}
function validateObject(readelf, object, target) {
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header), "candidate is not a relocatable ARM ELF");
  const sections = parseAllocatedSections(readelf, object);
  const expectedNames = new Set([".text.func_00000DCC", ...CLAIMS.map((claim) => `.text.${claim.name}`)]);
  check(sections.length === expectedNames.size && sections.every(({ name }) => expectedNames.has(name)), "candidate has missing or foreign allocated sections");
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  for (const claim of CLAIMS) {
    const sectionName = `.text.${claim.name}`, expectedSectionSize = claim.veneer === undefined ? claim.size : 8;
    const section = sections.filter((entry) => entry.name === sectionName);
    check(section.length === 1 && section[0].type === "PROGBITS" && section[0].size === expectedSectionSize && section[0].flags.includes("X"),
      `${claim.name} section metadata differs`);
    const symbolLines = symbols.split("\n").filter((line) => new RegExp(`\\s${claim.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${claim.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${claim.name}$`, "u").test(symbolLines[0]),
      `${claim.name} is not one exact global function symbol`);
    const body = sectionBytes(readelf, object, sectionName).subarray(0, claim.size);
    check(body.length === claim.size && hash(body) === claim.hash, `${claim.name} instruction bytes differ`);
    if (target) {
      const targetBody = sectionBytes(readelf, target, sectionName);
      check(targetBody.length === claim.size && body.equals(targetBody), `${claim.name} is not byte-identical to the verification target`);
    }
  }
  const relocations = run(readelf, ["--relocs", "--wide", object]);
  const relocationRows = relocations.split("\n").filter((line) => /^\s*00000004\s+[0-9a-f]+\s+R_ARM_ABS32\s+/iu.test(line));
  check(relocationRows.length === 52, "candidate does not contain exactly 52 veneer-slot relocations");
  for (let index = 0; index < 52; index++) {
    const symbol = `dllusgymfire_import_${index.toString(16).toUpperCase().padStart(2, "0")}`;
    check(relocationRows.filter((line) => line.endsWith(` ${symbol}`)).length === 1, `${symbol} relocation is missing or duplicated`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateRepository();
  if (options.objectDirectory) {
    const object = join(options.objectDirectory, "DllUSGymFire.o");
    check(existsSync(object) && lstatSync(object).isFile() && !lstatSync(object).isSymbolicLink(), "candidate object is missing");
    validateObject(options.readelf, object, options.target);
  }
  console.log(`Validated DllUSGymFire leaves 01: 59 ARM functions, 284 instruction bytes, 52 neutral import-slot relocations${options.objectDirectory ? " and object" : ""}${options.target ? ", target-identical" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
