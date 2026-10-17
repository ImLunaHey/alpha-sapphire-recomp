#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const sourcePath = join(root, "src/cro/DllUSGymFighting/complete.S");
const partitionPath = join(root, "symbols/cro-partitions/DllUSGymFighting.json");
const csvPath = join(root, "symbols/cro/DllUSGymFighting.csv");
const configPath = join(root, "config/cro-sources.json");

function fail(message) { throw new Error(`DllUSGymFighting validation: ${message}`); }
function check(condition, message) { if (!condition) fail(message); }
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (result.error) fail(`could not execute ${command}: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} exited with status ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}
function parseArgs(argv) {
  if (argv.length === 0) return {};
  check(argv.length === 4 && argv[0] === "--object" && argv[2] === "--readelf",
    "usage: validate-cro-dll-usgym-fighting.mjs [--object <path> --readelf <path>]");
  const object = resolve(argv[1]), readelf = resolve(argv[3]);
  check(existsSync(object) && statSync(object).isFile(), "object is not a regular file");
  check(existsSync(readelf) && statSync(readelf).isFile(), "readelf is not a regular file");
  return { object, readelf };
}

const functions = [
  [0x0d0, 0x38], [0x10c, 8], [0x114, 4], [0x118, 12], [0x124, 0x124], [0x25c, 16], [0x26c, 4],
  [0x270, 4], [0x274, 4], [0x278, 8], [0x280, 8], [0x288, 8], [0x290, 4], [0x294, 8], [0x29c, 4],
  [0x2a0, 0x104], [0x3b0, 0x94], [0x444, 0x29c], [0x6fc, 0x98], [0x798, 0x178], [0x920, 0xf4],
  [0xa18, 0x84], [0xaa8, 0x2c], [0xadc, 0x2c], [0xb10, 0x20], [0xb3c, 0x88],
];
const names = functions.map(([address]) => `func_${address.toString(16).toUpperCase().padStart(8, "0")}`);
const pools = [];
for (let address = 4; address < 0xd0; address += 8) pools.push([address, 4]);
pools.push([0x108, 4], [0x248, 20], [0x3a4, 12], [0x6e0, 28], [0x794, 4], [0x910, 16], [0xa14, 4],
  [0xa9c, 12], [0xad4, 8], [0xb08, 8], [0xb30, 12], [0xb50, 20], [0xbc4, 40]);

function validatePublicFiles() {
  const poolOffsets = new Set(pools.flatMap(([start, size]) => Array.from({ length: size / 4 }, (_, index) => start + index * 4)));
  check(poolOffsets.size * 4 === 292, "text pool accounting is invalid");
  const source = readFileSync(sourcePath, "utf8");
  check(createHash("sha256").update(source).digest("hex") === "eee61a316acbd4448223b94d598c73ee4f80ca6e918031d038bbc03e37b02d3c", "authored source digest changed");
  check(!/^\s*\.(?:byte|hword|short|word|long|inst|2byte|8byte|quad|octa|incbin|include|ascii|asciz|string|fill|zero|float|single|double)\b/imu.test(source),
    "forbidden encoded/data inclusion directive is present");
  check((source.match(/^\s*\.4byte\b/gmu) ?? []).length === 103, "source must contain exactly 103 symbolic/scalar pool words");
  check([...source.matchAll(/^\s*\.space\s+([^\s/]+)\s*$/gmu)].map((match) => match[1]).join(",") === "0x6c,0x38,0x24,0x1b,0x1e,0x27,8,4,4,16",
    "reviewed zero-fill layout changed");
  const textSource = source.slice(source.indexOf(".section .text.DllUSGymFighting"), source.indexOf(".section .rodata.DllUSGymFighting"));
  const instructionLines = textSource.split("\n").filter((line) => /^\s{4}[a-z][a-z0-9.]*\b/u.test(line) && !/^\s*\.4byte\b/u.test(line));
  check(instructionLines.length === 690, "source must contain exactly 690 ARM instruction lines");
  check((source.match(/^\s*ldr\s+pc, \[pc, #-4\]$/gmu) ?? []).length === 26, "veneer count or shape changed");
  check(source.includes("text_00000BAC:\n    mov\tr0, r0") && source.includes("text_00000BB8:\n    mov\tr0, r0"),
    "annotated dispatcher NOPs must retain their mov r0, r0 encoding");
  check((source.match(/^\s*nop$/gmu) ?? []).length === 11, "canonical NOP instruction count changed");
  for (const addend of [0x28, 0x30, 0x38, 0x44, 0x54]) {
    check(source.includes(`.4byte func_00000B3C + 0x${addend.toString(16)}`),
      `jump-table relocation addend 0x${addend.toString(16)} is missing`);
  }
  check(source.includes(".global nnroControlObject_") && source.includes("nnroControlObject_:\n"),
    "named CRO export alias is missing");

  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const unit = config.units.find((entry) => entry.name === "DllUSGymFighting");
  check(unit && unit.sources.length === 1 && unit.sources[0].path === "src/cro/DllUSGymFighting/complete.S" && unit.sources[0].mode === "arm",
    "source ownership is not exact");
  check(unit.functions.length === 26, "manifest must claim all 26 callable boundaries");
  for (let index = 0; index < functions.length; index += 1) {
    const [address, size] = functions[index], claim = unit.functions[index];
    check(claim.name === names[index] && claim.address === address && claim.size === size, `manifest boundary ${names[index]} is invalid`);
  }
  const partition = JSON.parse(readFileSync(partitionPath, "utf8"));
  check(partition.module === "DllUSGymFighting" && partition.textSize === 0xbec && partition.functions.length === 26,
    "partition header or function count is invalid");
  check(partition.gaps.length === 26 && partition.pools.length === 38 && partition.unknown.length === 0,
    "partition must account for veneers and pools without unknown bytes");
  for (let index = 0; index < functions.length; index += 1) {
    const [address, size] = functions[index], entry = partition.functions[index];
    check(entry.name === names[index] && entry.address === address && entry.size === size && entry.mode === "arm",
      `partition boundary ${names[index]} is invalid`);
  }
  const csv = readFileSync(csvPath, "utf8").split(/\r?\n/u);
  check(csv.filter((line) => /^[0-9A-F]{8},/u.test(line)).length === 26, "CSV must contain 26 function rows");
  for (let index = 0; index < functions.length; index += 1) {
    const [address, size] = functions[index];
    const row = `${address.toString(16).toUpperCase().padStart(8, "0")},"${names[index]}","Global",$a,${size.toString(16).toUpperCase().padStart(8, "0")},".text"`;
    check(csv.filter((line) => line === row).length === 1, `CSV boundary ${names[index]} is invalid`);
  }
}

function parseSections(text) {
  return text.split("\n").flatMap((line) => {
    const match = /^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+(\S+)/iu.exec(line);
    return match && match[3].includes("A") && Number.parseInt(match[2], 16) > 0
      ? [[match[1], Number.parseInt(match[2], 16), match[3]]] : [];
  });
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
  check(/^\s*Type:\s+REL \(Relocatable file\)$/mu.test(header) && /^\s*Machine:\s+ARM$/mu.test(header), "object is not ARM REL");
  const sections = parseSections(run(readelf, ["--sections", "--wide", object]));
  const expected = [[".bss.DllUSGymFighting", 16], [".data.DllUSGymFighting", 4], [".rodata.DllUSGymFighting", 428], [".text.DllUSGymFighting", 3052]];
  const actual = sections.map(([name, size]) => [name, size]).sort(([a], [b]) => a.localeCompare(b));
  check(JSON.stringify(actual) === JSON.stringify(expected), "allocated section set or sizes are invalid");
  check(sections.find(([name]) => name === ".text.DllUSGymFighting")[2].includes("X"), "text is not executable");

  const symbols = run(readelf, ["--symbols", "--wide", object]).split("\n");
  for (let index = 0; index < functions.length; index += 1) {
    const [address, size] = functions[index], name = names[index];
    const lines = symbols.filter((line) => new RegExp(`\\s${name}$`, "u").test(line.trimEnd()));
    const pattern = new RegExp(`^\\s*\\d+:\\s+${address.toString(16).padStart(8, "0")}\\s+${size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${name}$`, "iu");
    check(lines.length === 1 && pattern.test(lines[0]), `object symbol ${name} is invalid`);
  }
  const exportLines = symbols.filter((line) => /\snnroControlObject_$/u.test(line.trimEnd()));
  check(exportLines.length === 1 && /^\s*\d+:\s+00000b3c\s+136\s+FUNC\s+GLOBAL\s+DEFAULT\s+\d+\s+nnroControlObject_$/iu.test(exportLines[0]),
    "named CRO export symbol is invalid");

  const text = sectionBytes(readelf, object, ".text.DllUSGymFighting");
  const rodata = sectionBytes(readelf, object, ".rodata.DllUSGymFighting");
  check(createHash("sha256").update(text).digest("hex") === "7a291b8a470bd7b12a3bb116a651be5beddf6472425052fafb3d139cc235babb", "authored text digest changed");
  check(createHash("sha256").update(rodata).digest("hex") === "3d50965c61f99ced47b3a74732be741fe8305f2947e8e96d42c84b05b236ad12", "authored rodata digest changed");

  const importNames = [
    "m7c7374617469637c_s0_034fa84", "m7c7374617469637c_s0_034c708", "m7c7374617469637c_s0_00e8294", "m7c7374617469637c_s0_01ff8c0",
    "m7c7374617469637c_s0_001fa90", "m446c6c4669656c64_s0_00e5b70", "m7c7374617469637c_s0_0291544", "m7c7374617469637c_s0_0272748",
    "m7c7374617469637c_s0_0352ee0", "m7c7374617469637c_s0_03529f8", "m7c7374617469637c_s0_0352160", "m7c7374617469637c_s0_0352328",
    "m7c7374617469637c_s0_028b374", "m7c7374617469637c_s0_028b69c", "m446c6c4669656c64_s0_008f4c4", "m446c6c4669656c64_s0_00e5ba0",
    "m7c7374617469637c_s0_03dbdec", "m446c6c4669656c64_s0_008a5b0", "m7c7374617469637c_s0_0352e54", "m7c7374617469637c_s0_03525b4",
    "m7c7374617469637c_s0_035bb70", "m7c7374617469637c_s0_035baf8", "m7c7374617469637c_s0_000018d", "m7c7374617469637c_s0_0023480",
    "m7c7374617469637c_s0_0352e74", "m7c7374617469637c_s0_0000295",
  ];
  const expectedRelocations = importNames.map((name, index) => [".text.DllUSGymFighting", index * 8 + 4, `__cro_import_anon_${name}`, 0]);
  expectedRelocations.push(
    [".text.DllUSGymFighting", 0x6e0, ".rodata.DllUSGymFighting", 0xa4],
    [".text.DllUSGymFighting", 0x6e8, ".rodata.DllUSGymFighting", 0],
    [".text.DllUSGymFighting", 0xa9c, ".rodata.DllUSGymFighting", 0x174],
    [".text.DllUSGymFighting", 0xaa0, "__cro_import_anon_m7c7374617469637c_s0_0281b00", 0],
    [".text.DllUSGymFighting", 0xaa4, ".rodata.DllUSGymFighting", 0x6c],
    [".text.DllUSGymFighting", 0xad4, ".rodata.DllUSGymFighting", 0x174],
    [".text.DllUSGymFighting", 0xad8, "__cro_import_anon_m7c7374617469637c_s0_0281b94", 0],
    [".text.DllUSGymFighting", 0xb08, ".rodata.DllUSGymFighting", 0x174],
    [".text.DllUSGymFighting", 0xb0c, "__cro_import_anon_m7c7374617469637c_s0_0281b94", 0],
    [".text.DllUSGymFighting", 0xb38, ".bss.DllUSGymFighting", 0],
    ...[0x28, 0x30, 0x38, 0x44, 0x54].map((addend, index) => [".text.DllUSGymFighting", 0xb50 + index * 4, "func_00000B3C", addend]),
    [".text.DllUSGymFighting", 0xbc4, ".data.DllUSGymFighting", 0],
    [".text.DllUSGymFighting", 0xbcc, ".text.DllUSGymFighting", 0xbe8],
    [".text.DllUSGymFighting", 0xbd0, ".text.DllUSGymFighting", 0xbec],
    [".text.DllUSGymFighting", 0xbd4, ".rodata.DllUSGymFighting", 0x1ac],
    [".text.DllUSGymFighting", 0xbd8, ".rodata.DllUSGymFighting", 0x1ac],
    [".text.DllUSGymFighting", 0xbe8, ".text.DllUSGymFighting", 0xb10],
    [".rodata.DllUSGymFighting", 0xc8, "__cro_import_anon_m7c7374617469637c_s1_005a468", 8],
    [".rodata.DllUSGymFighting", 0xcc, ".rodata.DllUSGymFighting", 0xe8],
    [".rodata.DllUSGymFighting", 0xd0, "__cro_import_anon_m7c7374617469637c_s1_0045df8", 0],
    [".rodata.DllUSGymFighting", 0xd4, "__cro_import_anon_m7c7374617469637c_s1_005a458", 8],
    [".rodata.DllUSGymFighting", 0xd8, ".rodata.DllUSGymFighting", 0x103],
    [".rodata.DllUSGymFighting", 0xdc, "__cro_import_anon_m7c7374617469637c_s1_005a468", 8],
    [".rodata.DllUSGymFighting", 0xe0, ".rodata.DllUSGymFighting", 0x121],
    [".rodata.DllUSGymFighting", 0xe4, ".rodata.DllUSGymFighting", 0xd4],
    [".rodata.DllUSGymFighting", 0x150, ".rodata.DllUSGymFighting", 0xc8],
    ...[[0x154, "func_0000025C"], [0x158, "func_00000118"], [0x15c, "func_0000010C"], [0x160, "func_00000114"],
      [0x164, "func_00000124"], [0x168, "func_00000118"]].map(([offset, symbol]) => [".rodata.DllUSGymFighting", offset, symbol, 0]),
    [".rodata.DllUSGymFighting", 0x170, ".rodata.DllUSGymFighting", 0xdc],
    ...[[0x174, "func_00000ADC"], [0x178, "func_00000AA8"], [0x17c, "func_00000920"], [0x180, "func_000003B0"],
      [0x184, "func_0000025C"], [0x188, "func_0000025C"], [0x18c, "func_0000025C"], [0x190, "func_0000025C"],
      [0x194, "func_000003B0"], [0x198, "func_0000025C"], [0x19c, "func_0000025C"], [0x1a0, "func_0000025C"],
      [0x1a4, "func_0000025C"], [0x1a8, "func_0000025C"]].map(([offset, symbol]) => [".rodata.DllUSGymFighting", offset, symbol, 0]),
  );
  const entries = [];
  let relocationSection;
  for (const line of run(readelf, ["--relocs", "--wide", object]).split("\n")) {
    const heading = /^Relocation section '\.rel(\.\S+)'/u.exec(line);
    if (heading) { relocationSection = heading[1]; continue; }
    const match = /^\s*([0-9a-f]{8})\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)\s*$/iu.exec(line);
    if (match) entries.push([relocationSection, Number.parseInt(match[1], 16), match[3], match[2]]);
  }
  check(entries.length === expectedRelocations.length && entries.length === 77, "relocation count is invalid");
  for (let index = 0; index < expectedRelocations.length; index += 1) {
    const [section, offset, symbol, addend] = expectedRelocations[index], entry = entries[index];
    check(entry[0] === section && entry[1] === offset && entry[2] === symbol && entry[3] === "R_ARM_ABS32",
      `relocation ${index} output/type/target is invalid`);
    const bytes = section === ".text.DllUSGymFighting" ? text : rodata;
    check(bytes.readUInt32LE(offset) === addend, `relocation ${index} addend is invalid`);
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  validatePublicFiles();
  if (options.object) validateObject(options.object, options.readelf);
  console.log(`Validated DllUSGymFighting: 690 ARM instructions, 292 text-pool bytes, 26 functions, and 77 ABS32 relocations${options.object ? " in the clean-room object" : ""}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
