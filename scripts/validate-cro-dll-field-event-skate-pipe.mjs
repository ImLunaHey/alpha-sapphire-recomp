#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const SOURCE = "src/cro/DllFieldEventSkatePipe/skate_pipe_dispatch.S";
const SOURCE_PATH = join(ROOT, SOURCE);
const CONFIG_PATH = join(ROOT, "config/cro-sources.json");
const SPEC_PATH = join(ROOT, "docs/specs/cro/DllFieldEventSkatePipe.md");
const SOURCE_HASH = "349ac940955dc1091e4813bfe6db94027d122de31d215c51ae7a37cdb5017505";
const SPEC_HASH = "3a5465419600539e92fe07cf9affa71f16740c8f88cb50ba8ce47fd504ec8960";
const BODY_HASH = "f483416ab94d9b828e9c847c98e2af72311fa8f7969a26b8ea9765b2c2848ba3";
const MAX_FILE_SIZE = 64 * 1024 * 1024;

const INSTRUCTIONS = [
  "vldr s2, [pc, #0xD0]", "cmp r1, #2", "mov r3, #0", "mov r12, #1", "beq .Lselector_2",
  "cmp r1, #3", "beq .Lselector_3", "cmp r1, #0", "mov r3, #2", "mov r12, #3",
  "beq .Lselector_0", "cmp r1, #1", "beq .Lselector_1", "b .Lreturn_zero",
  "vcmpe.f32 s1, s2", "vmrs APSR_nzcv, fpscr", "bcs .Lselector_2_nonnegative", "mov r1, #6",
  "strb r3, [r2]", "b . + 0x19C", "nop", "bgt .Lpositive_4", "b .Lreturn_zero",
  "vcmpe.f32 s1, s2", "vmrs APSR_nzcv, fpscr", "bcc .Lnegative_7", "ble .Lreturn_zero",
  "mov r1, #5", "strb r12, [r2]", "b . + 0x174", "vcmpe.f32 s0, s2",
  "vmrs APSR_nzcv, fpscr", "bcs .Lselector_0_nonnegative", "mov r1, #5", "strb r3, [r2]",
  "b . + 0x15C", "nop", "ble .Lreturn_zero", "mov r1, #4", "strb r12, [r2]",
  "b . + 0x148", "vcmpe.f32 s0, s2", "vmrs APSR_nzcv, fpscr",
  "bcs .Lselector_1_nonnegative", "mov r1, #7", "strb r3, [r2]", "b . + 0x130", "nop",
  "ble .Lreturn_zero", "mov r1, #6", "strb r12, [r2]", "b . + 0x11C", "mov r0, #0", "bx lr",
];
const LOCAL_BRANCHES = new Map([
  [0x10, 0x38], [0x18, 0x5c], [0x28, 0x78], [0x30, 0xa4], [0x34, 0xd0],
  [0x40, 0x50], [0x54, 0x98], [0x58, 0xd0], [0x64, 0xb0], [0x68, 0xd0],
  [0x80, 0x90], [0x94, 0xd0], [0xac, 0xbc], [0xc0, 0xd0],
]);
const TAIL_BRANCHES = [0x4c, 0x74, 0x8c, 0xa0, 0xb8, 0xcc];

function fail(message) { throw new Error(`DllFieldEventSkatePipe validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function regular(path, label) {
  check(existsSync(path) && lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink(), `${label} is not a regular file`);
  check(statSync(path).size <= MAX_FILE_SIZE, `${label} exceeds the size limit`);
}
function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: ROOT, encoding: "utf8", maxBuffer: MAX_FILE_SIZE });
  check(!result.error && result.status === 0,
    `${executable} failed: ${(result.error?.message || result.stderr || result.stdout || "unknown error").trim()}`);
  return result.stdout;
}
function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--readelf", "--target", "--objdiff"].includes(option) && value !== undefined,
      "usage: validator [--object <path> --readelf <path> [--target <path> --objdiff <path>]]");
    const key = option.slice(2);
    check(options[key] === undefined, `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check((options.object === undefined) === (options.readelf === undefined), "--object and --readelf must be supplied together");
  check((options.target === undefined) === (options.objdiff === undefined), "--target and --objdiff must be supplied together");
  check(options.target === undefined || options.object !== undefined,
    "opaque comparison also requires --object and --readelf");
  for (const [label, path] of Object.entries(options)) regular(path, label);
  return options;
}
function sourceInstructions(source) {
  const match = /^func_000009EC:\n([\s\S]*?)^\.size func_000009EC, \. - func_000009EC$/mu.exec(source);
  check(match, "source function boundary is missing");
  return match[1].split(/\r?\n/u).map((line) => line.replace(/\s*@.*$/u, "").trim())
    .filter((line) => line && !line.endsWith(":"));
}
function sectionBytes(readelf, object, section) {
  const output = [];
  for (const line of run(readelf, ["--hex-dump", section, object]).split("\n")) {
    const match = /^\s*0x[0-9a-f]+\s+(.+)$/iu.exec(line);
    if (!match) continue;
    for (const token of match[1].trim().split(/\s+/u)) {
      if (!/^[0-9a-f]{8}$/iu.test(token)) break;
      output.push(...Buffer.from(token, "hex"));
    }
  }
  return Buffer.from(output);
}
function branchTarget(body, offset) {
  const word = body.readUInt32LE(offset);
  check((word & 0x0e000000) === 0x0a000000, `word at +0x${offset.toString(16)} is not an ARM direct branch`);
  let displacement = (word & 0x00ffffff) << 2;
  if ((displacement & 0x02000000) !== 0) displacement -= 0x04000000;
  return offset + 8 + displacement;
}

function validateRepository() {
  regular(SOURCE_PATH, SOURCE); regular(CONFIG_PATH, "config/cro-sources.json"); regular(SPEC_PATH, "specification");
  const source = readFileSync(SOURCE_PATH, "utf8");
  check(sha256(source) === SOURCE_HASH, "implementation source differs from the reviewed schedule");
  check(sha256(readFileSync(SPEC_PATH)) === SPEC_HASH, "approved neutral specification differs from the validator pin");
  check(JSON.stringify(sourceInstructions(source)) === JSON.stringify(INSTRUCTIONS), "54-operation source schedule differs");
  check(INSTRUCTIONS.length === 54 && LOCAL_BRANCHES.size === 14 && TAIL_BRANCHES.length === 6,
    "validator operation or branch accounting differs");
  check(!/^\s*\.(?:byte|hword|short|word|long|4byte|inst)\b/imu.test(source), "encoded instruction or data directive is forbidden");
  check((source.match(/^\s*nop\s*$/gmu) ?? []).length === 3 &&
    (source.match(/^\s*vcmpe\.f32\s+/gmu) ?? []).length === 4 &&
    (source.match(/^\s*vmrs APSR_nzcv, fpscr\s*$/gmu) ?? []).length === 4 &&
    (source.match(/^\s*strb\s+/gmu) ?? []).length === 6 &&
    (source.match(/^\s*\.float 0\.0\s*$/gmu) ?? []).length === 1,
  "source semantic operation counts differ");

  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  const unit = config?.units?.find((entry) => entry.name === "DllFieldEventSkatePipe");
  check(unit && JSON.stringify(unit.sources) === JSON.stringify([
    { path: "src/cro/DllFieldEventSkatePipe/contract_06.S", mode: "arm" },
    { path: SOURCE, mode: "arm" },
  ]), "unit source registration differs");
  check(JSON.stringify(unit.functions) === JSON.stringify([
    { name: "func_000009EC", address: 2540, size: 216, semantics: "skate-pipe-direction-dispatch" },
    { name: "func_00000BD4", address: 3028, size: 88, semantics: "contract-06-skate-pipe-dispatch" },
  ]), "unit function ownership differs");
}

function validateObject(object, readelf) {
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    "object is not an ARM relocatable ELF");
  const sections = run(readelf, ["--sections", "--wide", object]).split("\n").flatMap((line) => {
    const match = /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)\s+\S+\s+\S+\s+(\S+)/iu.exec(line);
    return match ? [{ index: Number(match[1]), name: match[2], type: match[3], size: Number.parseInt(match[4], 16), flags: match[5], align: Number(match[6]) }] : [];
  });
  const allocated = sections.filter(({ size, flags }) => size !== 0 && flags.includes("A"));
  check(JSON.stringify(allocated.map(({ name, size, flags, align }) => [name, size, flags, align])) === JSON.stringify([
    [".text.func_00000BD4", 88, "AX", 4], [".text.func_000009EC", 216, "AX", 4],
    [".pool.__cro_pool_00000ac4", 4, "A", 1],
  ]), "allocated section ownership, order, flags, size, or alignment differs");

  const symbols = run(readelf, ["--symbols", "--wide", object]);
  for (const [name, size, type, sectionName, mapping] of [
    ["func_000009EC", 216, "FUNC", ".text.func_000009EC", "$a"],
    ["func_00000BD4", 88, "FUNC", ".text.func_00000BD4", "$a"],
    ["__cro_pool_00000ac4", 4, "OBJECT", ".pool.__cro_pool_00000ac4", "$d"],
  ]) {
    const section = sections.find((entry) => entry.name === sectionName);
    check(section, `${sectionName} is missing`);
    const owners = symbols.split("\n").filter((line) => new RegExp(`\\s${name}$`, "u").test(line.trimEnd()));
    check(owners.length === 1 && new RegExp(`^\\s*\\d+:\\s+00000000\\s+${size}\\s+${type}\\s+GLOBAL\\s+DEFAULT\\s+${section.index}\\s+${name}$`, "u").test(owners[0]),
      `${name} symbol ownership differs`);
    check(new RegExp(`^\\s*\\d+:\\s+00000000\\s+0\\s+NOTYPE\\s+LOCAL\\s+DEFAULT\\s+${section.index}\\s+\\${mapping}$`, "mu").test(symbols),
      `${sectionName} lacks its mapping symbol at zero`);
  }
  check(/There are no relocations in this file\./u.test(run(readelf, ["--relocs", "--wide", object])),
    "linked unit must have no relocations");

  const body = sectionBytes(readelf, object, ".text.func_000009EC");
  const pool = sectionBytes(readelf, object, ".pool.__cro_pool_00000ac4");
  check(body.length === 216 && sha256(body) === BODY_HASH, "216-byte body is not byte-identical to the approved identity");
  check(pool.length === 4 && pool.equals(Buffer.alloc(4)), "adjacent pool is not positive binary32 zero");
  for (const [offset, target] of LOCAL_BRANCHES) check(branchTarget(body, offset) === target,
    `local branch at +0x${offset.toString(16)} has the wrong destination`);
  for (const offset of TAIL_BRANCHES) check(0x9ec + branchTarget(body, offset) === 0xbd4,
    `tail branch at +0x${offset.toString(16)} does not identify func_00000BD4`);
}

function validateObjdiff(target, object, objdiff) {
  const output = run(objdiff, ["diff", "-1", target, "-2", object, "-o", "-", "--format", "json", "func_000009EC"]);
  let report;
  try { report = JSON.parse(output); }
  catch { fail("objdiff did not emit JSON"); }

  check(Array.isArray(report?.left?.symbols) && Array.isArray(report?.right?.symbols) &&
    Array.isArray(report?.left?.sections), "objdiff report schema is incomplete");
  for (const [name, size] of [["func_000009EC", "216"], ["func_00000BD4", "88"]]) {
    const left = report.left.symbols.filter((symbol) => symbol.name === name);
    const right = report.right.symbols.filter((symbol) => symbol.name === name);
    check(left.length === 1 && right.length === 1, `objdiff did not resolve exactly one ${name} on each side`);
    check(left[0].size === size && right[0].size === size &&
      left[0].match_percent === 100 && right[0].match_percent === 100,
    `objdiff does not report an exact ${size}-byte match for ${name}`);
  }

  const expectedCredit = new Map([
    [".text.func_000009EC", "216"], [".text.func_00000BD4", "88"],
    [".pool.__cro_pool_00000ac4", "4"],
  ]);
  const credited = report.left.sections.filter((section) => Number(section.match_percent) > 0);
  check(credited.length === expectedCredit.size, "objdiff reports an unexpected number of positive-credit sections");
  for (const section of credited) {
    check(expectedCredit.get(section.name) === section.size && section.match_percent === 100,
      `objdiff reports unexpected or partial credit for ${section.name}`);
    expectedCredit.delete(section.name);
  }
  check(expectedCredit.size === 0,
    `objdiff omitted positive credit for ${[...expectedCredit.keys()].join(", ")}`);
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateRepository();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.target) validateObjdiff(options.target, options.object, options.objdiff);
  console.log(`Validated DllFieldEventSkatePipe func_000009EC (216 bytes, 54 ARM operations, 4-byte zero pool${options.object ? ", linked object" : ""}${options.target ? ", opaque objdiff 304/304 accepted code bytes and 4/4 owned pool bytes; link unit remains incomplete" : ""}).`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
