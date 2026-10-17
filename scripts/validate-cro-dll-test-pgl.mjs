#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "src/cro/DllTestPGL/dispatcher_prefix.S";
const SECTION = ".text.__cro_gap_000000bc";
const BODY_HASH = "d354f6231d0117c94d6cadc81c07f710cf32306924ea71c539770f09139be214";
const EXPECTED_WORDS = [0xe59f2080, 0xe3510005, 0xe92d4010, 0x379ff101, 0xea000015];
const EXPECTED_PARTITION = {
  format: 1,
  module: "DllTestPGL",
  textSize: 364,
  functions: [{ name: "func_00000000", address: 0, size: 8, mode: "arm" }],
  gaps: [
    { address: 8, size: 124, mode: "arm" },
    { address: 188, size: 20, mode: "arm" },
    { address: 228, size: 96, mode: "arm" },
  ],
  pools: [
    { address: 132, size: 56 },
    { address: 208, size: 20 },
    { address: 324, size: 40 },
  ],
  unknown: [],
};

function fail(message) { throw new Error(`DllTestPGL clean-room prefix: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function hash(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", timeout: 120000, maxBuffer: 4 * 1024 * 1024, ...options });
  check(!result.error && result.status === 0,
    `${path.basename(command)} failed${result.stderr ? `: ${result.stderr.trim()}` : ""}`);
  return result;
}

function findTools() {
  const explicit = process.env.ARM_NONE_EABI_BIN;
  let root = explicit;
  if (!root) {
    const built = run("nix", ["build", "--no-link", "--print-out-paths", path.join(ROOT, "#binutils")], { cwd: ROOT });
    root = built.stdout.trim().split(/\s+/u)[0];
    check(root, "nix did not return the pinned binutils output");
    root = path.join(root, "bin");
  }
  const tools = Object.fromEntries(["as", "objcopy", "readelf"].map(name =>
    [name, path.join(root, `arm-none-eabi-${name}`)]));
  for (const [name, executable] of Object.entries(tools)) {
    check(fs.statSync(executable, { throwIfNoEntry: false })?.isFile(), `${name} tool is unavailable`);
  }
  return tools;
}

function validateRepository() {
  const sourcePath = path.join(ROOT, SOURCE);
  const source = fs.readFileSync(sourcePath);
  const text = source.toString("utf8");
  check(!/(?:^|\/)(?:private|original|extracted)(?:\/|$)|ROM_PATH|DECOMP_PRIVATE|\.incbin\b/iu.test(text),
    "source refers to a forbidden private input");
  check(!/^\s*\.(?:byte|hword|short|word|long|quad|inst|ascii|asciz|string)\b/imu.test(text),
    "source embeds opaque bytes or data");

  const partition = JSON.parse(fs.readFileSync(path.join(ROOT, "symbols/cro-partitions/DllTestPGL.json"), "utf8"));
  check(JSON.stringify(partition) === JSON.stringify(EXPECTED_PARTITION), "public partition differs from the reviewed complete text accounting");
  const ranges = [...partition.functions, ...partition.gaps, ...partition.pools]
    .map(range => ({ start: range.address, end: range.address + range.size })).sort((a, b) => a.start - b.start);
  check(ranges[0].start === 0 && ranges.at(-1).end === partition.textSize &&
    ranges.every((range, index) => index === 0 || ranges[index - 1].end === range.start),
  "partition does not tile the complete text segment");

  const config = JSON.parse(fs.readFileSync(path.join(ROOT, "config/cro-sources.json"), "utf8"));
  const unit = config.units.find(entry => entry.name === "DllTestPGL");
  check(unit && JSON.stringify(unit.sources) === JSON.stringify([
    { path: "src/cro/DllTestPGL/contract_05.S", mode: "arm" },
    { path: SOURCE, mode: "arm" },
  ]) &&
    unit.functions.length === 1 && unit.functions[0].name === "func_00000000",
  "split dispatcher fragment must be built without becoming contiguous function ownership");

  const report = JSON.parse(fs.readFileSync(path.join(ROOT, "progress/reports/AS_EUR_REV2/report.json"), "utf8"));
  const reportUnit = report.units.find(entry => entry.name === "cro/DllTestPGL");
  check(reportUnit?.metadata?.complete === false, "published unit must remain incomplete");
}

function assembleAndValidate() {
  const tools = findTools();
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "dlltestpgl-prefix-"));
  try {
    const object = path.join(temporary, "prefix.o"), binary = path.join(temporary, "prefix.bin");
    run(tools.as, ["-o", object, path.join(ROOT, SOURCE)], { cwd: ROOT });
    run(tools.objcopy, ["-O", "binary", "-j", SECTION, object, binary], { cwd: ROOT });
    const body = fs.readFileSync(binary);
    check(body.length === 20 && hash(body) === BODY_HASH, "assembled prefix does not match its published verification identity");
    check(EXPECTED_WORDS.every((word, index) => body.readUInt32LE(index * 4) === word),
      "assembled prefix instruction words differ");
    const relocations = run(tools.readelf, ["-r", object], { cwd: ROOT }).stdout;
    check(/There are no relocations in this file\./u.test(relocations), "prefix unexpectedly contains a relocation");
    if (process.argv.includes("--self-test")) {
      const changed = Buffer.from(body); changed[0] ^= 1;
      check(hash(changed) !== BODY_HASH, "hash self-test did not reject a changed instruction");
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

check(process.argv.slice(2).every(argument => argument === "--self-test"), "usage: validate-cro-dll-test-pgl.mjs [--self-test]");
validateRepository();
assembleAndValidate();
process.stdout.write("DllTestPGL clean-room prefix: ok (20 exact code bytes; 364 text bytes classified; completion withheld)\n");
