#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const SOURCE = "src/cro/DllFieldEventSlopeSlip/clean_room_01.S";
const CONFIG = join(ROOT, "config/cro-sources.json");
const INVENTORY = join(ROOT, "symbols/cro/DllFieldEventSlopeSlip.csv");
const STORAGE = "slope_slip_config";
const FUNCTIONS = [
  ["func_000000D0", 0x00d0, 64, "family-a-constructor", "9ee7417f9d69d41667a54f74b84ae971d26f5b74dba604e7bc585de4675e77a0"],
  ["func_00000110", 0x0110, 8, "constant-true-predicate", "007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47"],
  ["func_000002C8", 0x02c8, 16, "cleanup-wrapper", "67a53f7e116adb2d7804b04f85f83db72c39ded8018aed8c83ef3c8b63db9393"],
  ["func_000002D8", 0x02d8, 4, "cleanup-tail", "95e42043d67d169026448754274f2f66e41e160067d92c50b7fa32bab6537902"],
  ["func_000002DC", 0x02dc, 44, "family-b-constructor", "f605307ded830ed4419e354ce5fb97dac9f56d447d86d177b15065d01a43dec7"],
  ["func_00000464", 0x0464, 8, "constant-true-predicate", "007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47"],
  ["func_000006BC", 0x06bc, 16, "cleanup-wrapper", "4594b152d4e668ddf3746606a1d44f18997aa608255373443b1a1c3677a2e760"],
  ["func_000006CC", 0x06cc, 4, "cleanup-tail", "f12b17257eb64a2259176fc6a16b448d9c62177e48c93a33ceccda0c9a46c644"],
  ["func_000006D0", 0x06d0, 64, "family-c-constructor", "085ba1259f8462696ad303379ec691e364966c4e9091cdb894d25bbcd2233bfd"],
  ["func_00000710", 0x0710, 8, "constant-true-predicate", "007f34a6c3441b0240da53f253e513b959105da2d8803255e1856aa48f48db47"],
  ["func_00000918", 0x0918, 16, "cleanup-wrapper", "13a36ee374073b327f7785d1b215150d467a6b8d6a2b41238513ca080e4c3eaf"],
  ["func_00000928", 0x0928, 4, "cleanup-tail", "c01ecdad1f4f2975bb8d894554d11b3d67c7078a56ffd370c9877b09d1482755"],
  ["func_0000092C", 0x092c, 32, "initialize-four-float-configuration", "bcde484a634d3e89d050243084594622c876d038437ef4297433c1e94911b33d"],
].map(([name, address, size, semantics, sha256]) => ({ name, address, size, semantics, sha256 }));
const POOLS = [
  { name: "__cro_pool_0000094c", section: ".pool.__cro_pool_0000094c", size: 8,
    sha256: "9b8a435d08dd19ef314fe68e9407f44e62f6cf704b86769af3fe676548495e3a", relocations: 0 },
  { name: "__cro_pool_00000954", section: ".pool.__cro_pool_00000954", size: 4,
    sha256: null, relocations: 1 },
];
const EXPECTED_ALLOCATED = new Set([
  ".text.func_00000308",
  ...FUNCTIONS.map(({ name }) => `.text.${name}`),
  ...POOLS.map(({ section }) => section),
]);

function fail(message) { throw new Error(`DllFieldEventSlopeSlip clean-room 01 validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function hash(bytes) { return createHash("sha256").update(bytes).digest("hex"); }
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
function parseArguments(argv) {
  if (argv.length === 0) return {};
  if (argv.length === 1 && argv[0] === "--self-test") return { selfTest: true };
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index], value = argv[index + 1];
    check(["--object", "--object-directory", "--readelf"].includes(option) && value !== undefined,
      "usage: validate-cro-field-event-slope-slip-01.mjs [--self-test | (--object <path> | --object-directory <path>) --readelf <path>]");
    const key = option === "--object-directory" ? "objectDirectory" : option.slice(2);
    check(options[key] === undefined, `${option} was supplied more than once`);
    options[key] = resolve(value);
  }
  check(Boolean(options.object) !== Boolean(options.objectDirectory), "select exactly one object input form");
  check(options.readelf !== undefined, "--readelf is required for object validation");
  if (options.objectDirectory) options.object = join(options.objectDirectory, "DllFieldEventSlopeSlip.o");
  check(existsSync(options.object) && lstatSync(options.object).isFile() && !lstatSync(options.object).isSymbolicLink(), "object is not a regular file");
  check(statSync(options.object).size <= 64 * 1024 * 1024, "object exceeds 64 MiB");
  check(existsSync(options.readelf) && lstatSync(options.readelf).isFile(), "readelf is not a regular file");
  return options;
}

function validateRepository() {
  check(FUNCTIONS.length === 13 && FUNCTIONS.reduce((sum, fn) => sum + fn.size, 0) === 288,
    "pinned function aggregate differs");
  check(POOLS.length === 2 && POOLS.reduce((sum, pool) => sum + pool.size, 0) === 12 &&
    FUNCTIONS.every((fn) => /^[0-9a-f]{64}$/u.test(fn.sha256)) && /^[0-9a-f]{64}$/u.test(POOLS[0].sha256) && POOLS[1].sha256 === null,
  "pinned pool/hash aggregate differs");

  const sourcePath = resolve(ROOT, SOURCE);
  check(inside(ROOT, sourcePath) && existsSync(sourcePath) && lstatSync(sourcePath).isFile() && !lstatSync(sourcePath).isSymbolicLink(),
    "owned source is missing or unsafe");
  const text = readFileSync(sourcePath, "utf8");
  check(!/(?:\/mnt\/|\/home\/|[A-Za-z]:\\\\|ROM_PATH|DECOMP_PRIVATE|\.incbin\b)/u.test(text),
    "source contains a private artifact reference");
  check(!/^\s*\.(?:byte|hword|short|long|quad|ascii|asciz|string|inst)\b/imu.test(text),
    "source contains opaque encoded data or a string");
  for (const fn of FUNCTIONS) {
    if (["func_000000D0", "func_000002DC", "func_000006D0", "func_0000092C"].includes(fn.name)) {
      for (const fragment of [`.section .text.${fn.name}, "ax", %progbits`, `.global ${fn.name}`,
        `.type ${fn.name}, %function`, `.size ${fn.name}, . - ${fn.name}`]) {
        check(text.includes(fragment), `${fn.name} source declaration is absent`);
      }
    } else {
      const macro = fn.semantics === "constant-true-predicate" ? "RETURN_TRUE" :
        fn.semantics === "cleanup-wrapper" ? "CLEANUP_WRAPPER" : "CLEANUP_TAIL";
      check(new RegExp(`^${macro} ${fn.name}(?:, 0x[0-9A-Fa-f]+)?$`, "mu").test(text), `${fn.name} macro declaration is absent`);
    }
  }
  for (const pool of POOLS) {
    for (const fragment of [`.section ${pool.section}, "a", %progbits`, `.global ${pool.name}`,
      `.type ${pool.name}, %object`, `.size ${pool.name}, . - ${pool.name}`]) {
      check(text.includes(fragment), `${pool.name} source declaration is absent`);
    }
  }
  check(text.includes(`.word ${STORAGE}`), "initializer storage relocation expression is absent");

  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  const unit = config.units?.find((entry) => entry.name === "DllFieldEventSlopeSlip");
  check(unit && Array.isArray(unit.sources) && Array.isArray(unit.functions), "integrated unit is malformed");
  check(unit.sources.filter((source) => source.path === SOURCE && source.mode === "arm").length === 1,
    "owned source lacks one exact ARM claim");
  for (const fn of FUNCTIONS) {
    const claims = unit.functions.filter((claim) => claim.name === fn.name);
    check(claims.length === 1 && claims[0].address === fn.address && claims[0].size === fn.size && claims[0].semantics === fn.semantics,
      `${fn.name} integrated claim differs`);
  }

  const inventory = readFileSync(INVENTORY, "utf8").split(/\r?\n/u);
  for (const fn of FUNCTIONS) {
    const row = `${fn.address.toString(16).toUpperCase().padStart(8, "0")},"${fn.name}","Global",$a,${fn.size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(inventory.filter((line) => line === row).length === 1 && inventory.filter((line) => line.includes(`"${fn.name}"`)).length === 1,
      `${fn.name} public boundary differs`);
  }
}

function parseSections(output) {
  const sections = [];
  for (const line of output.split("\n")) {
    const match = /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-f]+\s+[0-9a-f]+\s+([0-9a-f]+)\s+[0-9a-f]+\s+(\S*)\s+(\d+)\s+(\d+)\s+(\d+)$/iu.exec(line);
    if (match) sections.push({ index: Number(match[1]), name: match[2], type: match[3], size: Number.parseInt(match[4], 16),
      flags: match[5], link: Number(match[6]), info: Number(match[7]), align: Number(match[8]) });
  }
  return sections;
}
function parseSymbols(output) {
  const symbols = [];
  for (const line of output.split("\n")) {
    const match = /^\s*(\d+):\s+([0-9a-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)$/iu.exec(line);
    if (match) symbols.push({ index: Number(match[1]), value: Number.parseInt(match[2], 16), size: Number(match[3]),
      type: match[4], bind: match[5], visibility: match[6], section: match[7], name: match[8] });
  }
  return symbols;
}

function validateObject(object, readelf) {
  const header = run(readelf, ["--file-header", object]);
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header),
    "object is not ARM ET_REL");
  const sections = parseSections(run(readelf, ["--sections", "--wide", object]));
  check(sections.length > 0 && sections.length <= 16384, "section table is empty or excessive");
  const allocated = sections.filter((section) => section.size > 0 && section.flags.includes("A"));
  check(allocated.length === EXPECTED_ALLOCATED.size && allocated.every(({ name }) => EXPECTED_ALLOCATED.has(name)),
    "allocated section set has missing or extra bytes");

  const symbols = parseSymbols(run(readelf, ["--symbols", "--wide", object]));
  check(symbols.length <= 1000000, "symbol count is excessive");
  for (const fn of FUNCTIONS) {
    const sectionName = `.text.${fn.name}`, matches = sections.filter(({ name }) => name === sectionName);
    check(matches.length === 1 && matches[0].type === "PROGBITS" && matches[0].size === fn.size && matches[0].flags === "AX" &&
      matches[0].link === 0 && matches[0].info === 0 && matches[0].align === 4, `${fn.name} section metadata differs`);
    const globals = symbols.filter((symbol) => symbol.name === fn.name);
    check(globals.length === 1 && globals[0].value === 0 && globals[0].size === fn.size && globals[0].type === "FUNC" &&
      globals[0].bind === "GLOBAL" && globals[0].visibility === "DEFAULT" && Number(globals[0].section) === matches[0].index,
    `${fn.name} global symbol differs`);
    const bytes = sectionBytes(readelf, object, sectionName);
    check(bytes.length === fn.size && hash(bytes) === fn.sha256, `${fn.name} bytes differ from the target-derived hash`);
  }
  for (const pool of POOLS) {
    const matches = sections.filter(({ name }) => name === pool.section);
    check(matches.length === 1 && matches[0].type === "PROGBITS" && matches[0].size === pool.size && matches[0].flags === "A" &&
      matches[0].link === 0 && matches[0].info === 0 && matches[0].align === 4, `${pool.name} section metadata differs`);
    const globals = symbols.filter((symbol) => symbol.name === pool.name);
    check(globals.length === 1 && globals[0].value === 0 && globals[0].size === pool.size && globals[0].type === "OBJECT" &&
      globals[0].bind === "GLOBAL" && globals[0].visibility === "DEFAULT" && Number(globals[0].section) === matches[0].index,
    `${pool.name} global object symbol differs`);
    const bytes = sectionBytes(readelf, object, pool.section);
    check(bytes.length === pool.size, `${pool.name} byte count differs`);
    if (pool.sha256) check(hash(bytes) === pool.sha256, `${pool.name} bytes differ from the lawful numeric hash`);
    else check(bytes.equals(Buffer.alloc(pool.size)), `${pool.name} unresolved addend is not canonical zero`);
  }

  const relocations = run(readelf, ["--relocs", "--wide", object]);
  check((relocations.match(/^Relocation section /gmu) ?? []).length === 1, "object must contain exactly one relocation section");
  for (const fn of FUNCTIONS) check(!relocations.includes(`.rel.text.${fn.name}`), `${fn.name} unexpectedly has relocations`);
  check(!relocations.includes(".rel.pool.__cro_pool_0000094c"), "numeric float pool unexpectedly has relocations");
  const storageBlock = /Relocation section '\.rel\.pool\.__cro_pool_00000954'[^\n]*contains 1 entry:\n[^\n]*\n([^\n]+)/u.exec(relocations);
  check(storageBlock && /^00000000\s+[0-9a-f]+02\s+R_ARM_ABS32\s+00000000\s+slope_slip_config\s*$/iu.test(storageBlock[1].trim()),
    "initializer storage pool must have exactly one offset-zero R_ARM_ABS32 relocation to its neutral storage symbol");
  const storageSymbols = symbols.filter(({ name }) => name === STORAGE);
  check(storageSymbols.length === 1 && storageSymbols[0].value === 0 && storageSymbols[0].size === 0 && storageSymbols[0].type === "NOTYPE" &&
    storageSymbols[0].bind === "GLOBAL" && storageSymbols[0].visibility === "DEFAULT" && storageSymbols[0].section === "UND",
  "initializer storage symbol must be one neutral undefined global");
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateRepository();
  if (options.object) validateObject(options.object, options.readelf);
  if (options.selfTest) {
    const numericPool = Buffer.alloc(8);
    numericPool.writeFloatLE(0.7, 0);
    numericPool.writeFloatLE(1.0, 4);
    check(hash(numericPool) === POOLS[0].sha256, "numeric pool hash invariant failed");
  }
  console.log(`Validated DllFieldEventSlopeSlip clean-room: 13 ARM functions (288 bytes), two numeric/storage pools (12 bytes), one exact storage relocation${options.object ? ", and object" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
