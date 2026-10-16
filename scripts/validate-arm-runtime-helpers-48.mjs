import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-48.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-48 validation failed: ${message}`);
  process.exit(1);
}

const outerSchedule = (byteOffset, dirtyOffset, mask) => [
  "rsb r1,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r1,r1,r1,lsl #1",
  "add r0,r0,r1,lsl #2", `strb r2,[r0,#${byteOffset}]`, `ldr r1,[r0,#${dirtyOffset}]`,
  `orr r1,r1,#${mask}`, `str r1,[r0,#${dirtyOffset}]`, "bx lr",
];
const nestedSchedule = (byteOffset, mask) => [
  "rsb r1,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r1,r1,r1,lsl #1",
  "add r0,r0,r1,lsl #2", "add r1,r2,r2,lsl #3", "add r2,r0,r1,lsl #2",
  `strb r3,[r2,#${byteOffset}]`, "ldr r2,[r0,r1,lsl #2]", `orr r2,r2,#${mask}`,
  "str r2,[r0,r1,lsl #2]", "bx lr",
];
const deepSchedule = (byteOffset, mask) => [
  "rsb r1,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r1,r1,r1,lsl #1", "ldr r12,[sp]",
  "add r0,r0,r1,lsl #2", "add r1,r2,r2,lsl #3", "add r0,r0,r1,lsl #2",
  "add r0,r0,r3,lsl #3", `strb r12,[r0,#${byteOffset}]`, "ldr r1,[r0,#8]",
  `orr r1,r1,#${mask}`, "str r1,[r0,#8]", "bx lr",
];
const accessorSchedule = (byteOffset) => [
  "rsb r1,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r1,r1,r1,lsl #1",
  "add r2,r2,r2,lsl #3", `mov r3,#${byteOffset}`, "add r0,r0,r1,lsl #2",
  "add r1,r3,r2,lsl #2", "ldrb r0,[r0,r1]", "bx lr",
];

const schedules = new Map([
  ["func_00398958", outerSchedule(222, 216, 1)],
  ["func_00398D9C", outerSchedule(221, 216, 1)],
  ["func_00398E30", outerSchedule(223, 216, 1)],
  ["func_00399520", nestedSchedule(6, 4)],
  ["func_00399588", outerSchedule(276, 272, 1)],
  ["func_003995AC", outerSchedule(225, 216, 2)],
  ["func_003995D0", outerSchedule(227, 216, 2)],
  ["func_003995F4", deepSchedule(14, 4)],
  ["func_00399628", accessorSchedule(4)],
  ["func_0039964C", accessorSchedule(7)],
  ["func_00399670", outerSchedule(226, 216, 2)],
  ["func_00399694", nestedSchedule(4, 1)],
  ["func_003996C0", deepSchedule(12, 1)],
  ["func_003996F4", nestedSchedule(7, 8)],
  ["func_00399808", deepSchedule(15, 8)],
  ["func_003998FC", accessorSchedule(5)],
  ["func_003999B8", nestedSchedule(5, 2)],
  ["func_003999E4", deepSchedule(13, 2)],
  ["func_00399A18", nestedSchedule(32, 16)],
  ["func_00399AD4", nestedSchedule(33, 32)],
]);
const expectedClasses = {
  outer_record_byte_dirty_stores_48: {
    members: ["func_00398958", "func_00398D9C", "func_00398E30", "func_00399588", "func_003995AC", "func_003995D0", "func_00399670"],
    parameters: ["byteOffset", "dirtyWordOffset", "dirtyMask"],
  },
  nested_record_byte_dirty_stores_48: {
    members: ["func_00399520", "func_00399694", "func_003996F4", "func_003999B8", "func_00399A18", "func_00399AD4"],
    parameters: ["byteOffset", "dirtyMask"],
  },
  deep_entry_byte_dirty_stores_48: {
    members: ["func_003995F4", "func_003996C0", "func_00399808", "func_003999E4"],
    parameters: ["byteOffset", "dirtyMask"],
  },
  nested_record_byte_accessors_48: {
    members: ["func_00399628", "func_0039964C", "func_003998FC"],
    parameters: ["byteOffset"],
  },
};
const expectedFunctions = [...schedules.keys()];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_48.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 832 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
let totalSize = 0;
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const name = expectedFunctions[index];
  const entry = manifest.functions[index];
  const size = schedules.get(name).length * 4;
  if (entry?.name !== name || entry.size !== size || JSON.stringify(entry.calls) !== "[]" ||
      JSON.stringify(entry.adjacentWords) !== "[]") fail(`manifest entry for ${name} is invalid`);
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize ||
    JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedClasses) ||
    JSON.stringify(manifest.symbolicIdentities) !== "{}" || JSON.stringify(manifest.symbolicSlots) !== "{}") {
  fail("manifest totals, identity classes, or symbolic contracts are invalid");
}

const selected = new Set(expectedFunctions);
for (const name of readdirSync(join(root, "config"))) {
  if (name === manifestName || !/^arm-.*\.json$/.test(name)) continue;
  const other = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of other.functions ?? []) if (selected.has(entry.name)) fail(`${entry.name} overlaps selection in config/${name}`);
}
const configured = sources.sources.filter(({ path }) => path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== "arm") fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);

const source = readFileSync(join(root, manifest.source), "utf8");
if (!source.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n")) fail("source preamble is invalid");
function normalize(line) {
  return line.replace(/\/\*.*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*,\s*/g, ",")
    .replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").trim().toLowerCase();
}
for (const name of expectedFunctions) {
  const begin = `/* BEGIN_FUNCTION ${name} */`;
  const end = `/* END_FUNCTION ${name} */`;
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (start < 0 || finish < 0 || source.indexOf(begin, start + 1) >= 0 || source.indexOf(end, finish + 1) >= 0) fail(`source boundaries for ${name} are invalid`);
  const actual = source.slice(start + begin.length, finish).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(schedules.get(name))) fail(`instruction schedule for ${name} differs from the approved contract`);
}
if (/^\s*\.word\b/m.test(source)) fail("source must not contain adjacent words or literal-pool data");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-48.mjs [object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header, sections, symbols, relocations;
  try {
    const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], options);
    sections = execFileSync(readelf, ["-SW", objectPath], options);
    symbols = execFileSync(readelf, ["-sW", objectPath], options);
    relocations = execFileSync(readelf, ["-rW", objectPath], options);
  } catch (error) { fail(`could not inspect object: ${error.message}`); }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("object is not ARM");
  const parsedSections = new Map();
  for (const line of sections.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s+\S+\s+(\S+)\s+\S+\s+\S+\s+(\d+)\s*$/);
    if (match) parsedSections.set(match[2], { index: match[1], size: Number.parseInt(match[3], 16), flags: match[4], alignment: Number.parseInt(match[5], 10) });
  }
  const parsedSymbols = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 8 && fields[0].endsWith(":")) parsedSymbols.push({ value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10), type: fields[3], bind: fields[4], section: fields[6], name: fields.slice(7).join(" ") });
  }
  for (const entry of manifest.functions) {
    const section = parsedSections.get(`.text.${entry.name}`);
    const matches = parsedSymbols.filter(({ name }) => name === entry.name);
    if (!section || section.size !== entry.size || !section.flags.includes("A") || !section.flags.includes("X") || section.alignment < 4 ||
        matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== entry.size || matches[0].type !== "FUNC" ||
        matches[0].bind !== "GLOBAL" || matches[0].section !== section.index) fail(`${entry.name} does not occupy its exact aligned executable function section`);
    if (new RegExp(`^Relocation section '\\.(?:rel|rela)\\.text\\.${entry.name}'`, "m").test(relocations)) fail(`${entry.name} must not have relocations`);
  }
}

console.log("Validated ARM runtime helpers batch 48: 20 functions, 832 body bytes, and no relocations.");
