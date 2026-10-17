#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const CONFIG = join(ROOT, "config/cro-sources.json");
const SOURCE = join(ROOT, "src/cro/DllStartMenu/menu_input_transition.S");
const SOURCE_SHA256 = "3390fcda7973042b02746cada60d6d42325e27e52619653d8f2d038ef9c4bc1b";
const BODY_SHA256 = "cfd13fb01d415321a32bcf9b8647398911a97d1ec4e1c82bbc57e5e400364c00";
const CLAIM = { name: "func_00000E44", address: 0x0E44, size: 440, semantics: "menu-input-transition" };

function fail(message) { throw new Error(`DllStartMenu validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.error) fail(`could not execute ${executable}: ${result.error.message}`);
  if (result.status !== 0) fail(`${executable} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}
function sectionBytes(text) {
  const groups = [];
  for (const line of text.split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      groups.push(token);
    }
  }
  return Buffer.from(groups.join(""), "hex");
}
function validatePublic() {
  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  const unit = config.units.find((entry) => entry.name === "DllStartMenu");
  check(unit && Object.keys(unit).sort().join(",") === "functions,name,sources", "unit config is absent or malformed");
  check(unit.sources.length === 2 && unit.functions.length === 2, "unit must own exactly both accepted functions and sources");
  check(unit.sources.some((entry) => entry.path === "src/cro/DllStartMenu/menu_input_transition.S" && entry.mode === "arm"),
    "menu transition source claim is absent");
  const claim = unit.functions.find((entry) => entry.name === CLAIM.name);
  check(claim && Object.keys(claim).sort().join(",") === "address,name,semantics,size" &&
    Object.entries(CLAIM).every(([key, value]) => claim[key] === value), "menu transition function claim is not exact");
  check(existsSync(SOURCE) && lstatSync(SOURCE).isFile() && !lstatSync(SOURCE).isSymbolicLink(), "source is not a regular file");
  const source = readFileSync(SOURCE);
  check(source.length <= 16 * 1024 && sha256(source) === SOURCE_SHA256, "source differs from the reviewed neutral schedule");
  const text = source.toString("utf8");
  check(!/^\s*\.(?:byte|hword|short|word|long|inst)\b/imu.test(text), "source contains encoded instructions or data");
  for (const fragment of [`.section .text.${CLAIM.name}, "ax", %progbits`, `.global ${CLAIM.name}`,
    `.type ${CLAIM.name}, %function`, `.size ${CLAIM.name}, . - ${CLAIM.name}`]) {
    check(text.split(fragment).length === 2, `source lacks one exact ${fragment} declaration`);
  }
}
function validateObject(object, readelf) {
  check(existsSync(object) && statSync(object).isFile(), "object is not a regular file");
  check(existsSync(readelf) && statSync(readelf).isFile(), "readelf is not a regular file");
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    "object is not relocatable ARM ELF");
  const sections = run(readelf, ["--sections", "--wide", object]);
  const allocated = sections.split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match && match[3].includes("A") && Number.parseInt(match[2], 16) !== 0
      ? [[match[1], Number.parseInt(match[2], 16), match[3]]] : [];
  });
  const expected = [[".text.func_00000E44", 440], [".text.func_000014D4", 416]];
  check(allocated.length === expected.length && expected.every(([name, size]) =>
    allocated.some(([actualName, actualSize, flags]) => actualName === name && actualSize === size && flags.includes("X"))),
  "allocated section ownership is not exact");
  const symbols = run(readelf, ["--symbols", "--wide", object]);
  check(new RegExp(`^\\s*\\d+:\\s+00000000\\s+440\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${CLAIM.name}$`, "mu").test(symbols),
    "function symbol is absent or malformed");
  const body = sectionBytes(run(readelf, ["--hex-dump", `.text.${CLAIM.name}`, object]));
  check(body.length === CLAIM.size && sha256(body) === BODY_SHA256, "function body is not byte-identical");
  check(/There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
    "unit unexpectedly contains relocations");
}
function selfTest() {
  check(sectionBytes("  0x00000000 01020304 05060708 ....\n").equals(Buffer.from("0102030405060708", "hex")),
    "hex parser rejected a valid fixture");
  check(sectionBytes("  0x00000000 01020304 prose\n").equals(Buffer.from("01020304", "hex")),
    "hex parser consumed display text");
  let rejected = false;
  try { check(false, "hostile fixture"); } catch (error) { rejected = /hostile fixture/u.test(error.message); }
  check(rejected, "fail-closed assertion did not reject a hostile fixture");
  console.log("DllStartMenu validator self-test: ok");
}

try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--self-test") selfTest();
  else {
    check(args.length === 0 || (args.length === 4 && args[0] === "--object" && args[2] === "--readelf"),
      "usage: validate-cro-dll-start-menu.mjs [--self-test | --object <path> --readelf <path>]");
    validatePublic();
    if (args.length === 4) validateObject(realpathSync(args[1]), realpathSync(args[3]));
    console.log(`Validated DllStartMenu ${CLAIM.name}: 440 ARM bytes, zero relocations${args.length ? ", object exact" : ""}.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
