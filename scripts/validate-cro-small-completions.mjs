#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG = join(ROOT, "config", "cro-sources.json");
const SPEC = join(ROOT, "docs", "specs", "cro", "small_unit_completions_01.md");
const COMPLETIONS = Object.freeze([
  {
    unit: "DllContestCommon",
    name: "func_00000030",
    address: 0x30,
    size: 472,
    semantics: "contest-resource-initialization",
    source: "src/cro/DllContestCommon/remaining_01.S",
    sha256: "fa20423c4bdc4b434235edbd87527f1b5f3394743853acd1f3eacfc6d3394712",
  },
  {
    unit: "DllContestOhirome",
    name: "func_00000544",
    address: 0x544,
    size: 332,
    semantics: "contest-introduction-construction",
    source: "src/cro/DllContestOhirome/remaining_01.S",
    sha256: "52ac21b1b42b18b8dbf9bcfb0337f67fa237bb45411944402e2a30d115622db5",
  },
  {
    unit: "DllFieldEventPokeRideAction",
    name: "func_00000158",
    address: 0x158,
    size: 556,
    semantics: "ride-action-resource-initialization",
    source: "src/cro/DllFieldEventPokeRideAction/remaining_01.S",
    sha256: "6bc92aee62ad3d5b00c77db24d42dfacf16825d16dda73a6fbc4c95652a9b030",
  },
  {
    unit: "DllPhotoSaverSecretBase",
    name: "func_00001D60",
    address: 0x1D60,
    size: 536,
    semantics: "secret-base-photo-layout-setup",
    source: "src/cro/DllPhotoSaverSecretBase/remaining_01.S",
    sha256: "e24f74b974477187da4ef14c5d1fc1e67a1ccf79b9772be850beb9b5ed8d2efc",
  },
  {
    unit: "DllStartMenu",
    name: "func_00000E44",
    address: 0xE44,
    size: 440,
    semantics: "start-menu-input-navigation",
    source: "src/cro/DllStartMenu/remaining_01.S",
    sha256: "16b708c9fab4c3d01d531afd944bb50b0f34ee75c613f1437884ed1ad99a4303",
  },
  {
    unit: "DllDialogCommon",
    name: "func_00000780",
    address: 0x780,
    size: 796,
    semantics: "dialog-object-factory-setup",
    source: "src/cro/DllDialogCommon/remaining_02.S",
    specification: "docs/specs/cro/DllDialogCommon_02.md",
    sha256: "6159155d77b7859ed4cdfb21ef02418550d1f833f1475c3c2daa69964114f65a",
  },
]);

function fail(message) {
  throw new Error(`small CRO completion validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function run(executable, args) {
  try {
    return execFileSync(executable, args, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    fail(`${executable} failed: ${error.stderr?.toString().trim() || error.message}`);
  }
}

function parseArguments(argv) {
  if (argv.length === 0) return {};
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index];
    const value = argv[index + 1];
    check(["--object-directory", "--readelf"].includes(option) && value,
      "usage: validate-cro-small-completions.mjs [--object-directory DIR --readelf FILE]");
    values[option.slice(2)] = value;
  }
  check(values["object-directory"] && values.readelf,
    "--object-directory and --readelf must be supplied together");
  return values;
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

function validateSources() {
  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  const sharedSpecification = readFileSync(SPEC, "utf8");
  check(COMPLETIONS.reduce((total, entry) => total + entry.size, 0) === 3132,
    "aggregate completion size changed");

  for (const entry of COMPLETIONS) {
    const specification = entry.specification ?
      readFileSync(join(ROOT, entry.specification), "utf8") : sharedSpecification;
    const unit = config.units.find((candidate) => candidate.name === entry.unit);
    check(unit, `${entry.unit} is absent from config/cro-sources.json`);
    check(unit.sources.filter((source) => source.path === entry.source && source.mode === "arm").length === 1,
      `${entry.unit} lacks its exact ARM source claim`);
    const claim = unit.functions.filter((fn) => fn.name === entry.name);
    check(claim.length === 1 && claim[0].address === entry.address &&
      claim[0].size === entry.size && claim[0].semantics === entry.semantics,
    `${entry.name} has an invalid function claim`);

    const inventory = readFileSync(join(ROOT, "symbols", "cro", `${entry.unit}.csv`), "utf8");
    const accepted = inventory.split(/\r?\n/u).filter((line) => /^[0-9A-F]{8},/u.test(line));
    check(accepted.length === unit.functions.length &&
      accepted.some((line) => line.includes(`"${entry.name}"`)),
    `${entry.unit} is not accepted-function complete`);

    const sourcePath = join(ROOT, entry.source);
    check(existsSync(sourcePath) && lstatSync(sourcePath).isFile() &&
      !lstatSync(sourcePath).isSymbolicLink(), `${entry.source} is not a regular file`);
    const source = readFileSync(sourcePath, "utf8");
    check(!/^\s*\.(?:byte|hword|short|word|long|inst|incbin)\b/imu.test(source),
      `${entry.source} contains encoded data`);
    for (const fragment of [`.section .text.${entry.name}, "ax", %progbits`,
      `.global ${entry.name}`, `.type ${entry.name}, %function`,
      `ASM_FUNC(${entry.name})`, `.size ${entry.name}, . - ${entry.name}`]) {
      check(source.split(fragment).length === 2,
        `${entry.source} lacks one exact ${fragment} declaration`);
    }
    check(specification.includes(entry.unit) &&
      specification.includes(`\`${entry.name}\``),
    `${entry.unit} is missing from the provenance specification`);
  }
}

function validateObjects(directory, readelf) {
  for (const entry of COMPLETIONS) {
    const object = join(directory, `${entry.unit}.o`);
    check(existsSync(object) && lstatSync(object).isFile() &&
      !lstatSync(object).isSymbolicLink(), `${entry.unit}.o is missing`);
    const section = `.text.${entry.name}`;
    const sections = run(readelf, ["--sections", "--wide", object]);
    const sectionLine = sections.split("\n").find((line) =>
      new RegExp(`\\s${section.replaceAll(".", "\\.")}\\s`, "u").test(line));
    check(sectionLine && new RegExp(`\\s${entry.size.toString(16).padStart(6, "0")}\\s+00\\s+AX\\s`, "iu")
      .test(sectionLine), `${entry.name} has an invalid executable section`);

    const symbols = run(readelf, ["--symbols", "--wide", object]);
    const symbolLines = symbols.split("\n").filter((line) =>
      new RegExp(`\\s${entry.name}$`, "u").test(line.trimEnd()));
    check(symbolLines.length === 1 &&
      new RegExp(`^\\s*\\d+:\\s+00000000\\s+${entry.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${entry.name}$`, "u")
        .test(symbolLines[0]), `${entry.name} is not one exact global function symbol`);

    const relocations = run(readelf, ["--relocs", "--wide", object]);
    check(!relocations.includes(`.rel.text.${entry.name}`) &&
      !relocations.includes(`.rela.text.${entry.name}`),
    `${entry.name} unexpectedly has relocations`);
    const bytes = sectionBytes(readelf, object, section);
    check(bytes.length === entry.size &&
      createHash("sha256").update(bytes).digest("hex") === entry.sha256,
    `${entry.name} instruction body differs`);
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateSources();
  if (options["object-directory"]) validateObjects(options["object-directory"], options.readelf);
  console.log(`Validated six accepted-function completions (3,132 bytes)${options["object-directory"] ? " and objects" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
