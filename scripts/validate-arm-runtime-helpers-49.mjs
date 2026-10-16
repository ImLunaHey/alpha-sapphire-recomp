import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-49.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-49 validation failed: ${message}`);
  process.exit(1);
}

const selectedPrefix = (scratch) => [
  `ldrb ${scratch},[r0,#28]`, `cmp ${scratch},#0`, "ldreq r0,[r0,#52]", "beq 1f",
  `ldrb ${scratch},[r0,#29]`, `cmp ${scratch},#0`, "ldreq r0,[r0,#68]", "ldrne r0,[r0,#48]", "1:",
];
const maskTest = ["ands r0,r0,r1", "movne r0,#1", "bx lr"];
const indexedPrefix = [
  ...selectedPrefix("r3"), "cmp r2,#2", "addlo r0,r0,r2,lsl #4",
];
const schedules = new Map([
  ["func_004C75A8", [...selectedPrefix("r1"), "ldrsb r0,[r0,#10]", "bx lr"]],
  ["func_004C75D0", [...selectedPrefix("r1"), "ldrsb r0,[r0,#9]", "bx lr"]],
  ["func_004C7748", [...selectedPrefix("r1"), "ldrh r0,[r0]", "bx lr"]],
  ["func_004C7770", [...selectedPrefix("r1"), "ldrh r0,[r0,#2]", "bx lr"]],
  ["func_004C77F4", [...selectedPrefix("r1"), "ldrsb r0,[r0,#8]", "bx lr"]],
  ["func_004C781C", [...selectedPrefix("r1"), "ldrh r1,[r0]", "ldrh r0,[r0,#4]", "sub r0,r1,r0", "bx lr"]],
  ["func_004C784C", [...selectedPrefix("r1"), "ldrh r1,[r0,#2]", "ldrh r0,[r0,#6]", "sub r0,r1,r0", "bx lr"]],
  ["func_004C7CF4", [...selectedPrefix("r2"), "ldr r0,[r0,#8]", ...maskTest]],
  ["func_004C7D4C", [...selectedPrefix("r2"), "ldr r2,[r0,#12]", "ldr r0,[r0,#20]", "orr r0,r0,r2", ...maskTest]],
  ["func_004C7E2C", [...selectedPrefix("r2"), "ldr r0,[r0,#12]", ...maskTest]],
  ["func_004C7E5C", [...selectedPrefix("r2"), "ldr r2,[r0,#16]", "str r2,[r1]", "ldr r2,[r0,#20]", "str r2,[r1,#4]", "ldr r0,[r0,#24]", "str r0,[r1,#8]", "bx lr"]],
  ["func_004C80D0", [...selectedPrefix("r2"), "cmp r1,#2", "addlo r0,r0,r1,lsl #4", "ldr r0,[r0,#4]", "bx lr"]],
  ["func_004C8400", [...indexedPrefix, "ldr r0,[r0]", ...maskTest]],
  ["func_004C8438", [...indexedPrefix, "ldr r2,[r0,#4]", "ldr r0,[r0,#12]", "orr r0,r0,r2", ...maskTest]],
  ["func_004C84B0", [...indexedPrefix, "ldr r0,[r0,#8]", ...maskTest]],
  ["func_004C84E8", [...indexedPrefix, "ldr r0,[r0,#4]", ...maskTest]],
  ["func_004C8668", ["ldr r0,[r0,#376]", "cmp r1,#3", "mvnhs r0,#0", "addlo r0,r0,r1,lsl #2", "ldrlo r0,[r0,#40]", "bx lr"]],
  ["func_004C8768", ["ldrh r2,[r0,#4]", "cmp r2,r1", "bls 1f", "ldr r0,[r0]", "add r0,r0,r1,lsl #6", "ldrb r1,[r0,#4]", "cmp r1,#0", "bne 2f", "1:", "mov r0,#0", "2:", "bx lr"]],
  ["func_004C8DC0", ["ldr r0,[r0,#4]", "ldr r2,[r0,#172]", "cmp r2,r1", "movls r0,#0", "bls 1f", "ldr r0,[r0,#168]", "add r2,r1,r1,lsl #1", "add r1,r2,r1,lsl #3", "add r0,r0,r1,lsl #2", "ldrsb r0,[r0]", "1:", "bx lr"]],
  ["func_004C8EC0", ["ldr r0,[r0]", "ldr r0,[r0,#16]", "ldr r2,[r0,#4]", "cmp r2,r1", "ldrhi r0,[r0]", "addhi r1,r1,r1,lsl #3", "movls r0,#0", "addhi r0,r0,r1,lsl #3", "bx lr"]],
  ["func_004C8FB4", ["ldr r0,[r0,#12]", "add r1,r1,r1,lsl #1", "ldr r0,[r0,#20]", "ldr r0,[r0]", "add r0,r0,r1,lsl #2", "str r0,[r2,#4]", "bx lr"]],
  ["func_004C90B8", ["cmp r1,#0", "blt 1f", "ldr r0,[r0,#12]", "ldr r2,[r0,#16]", "cmp r2,r1", "bls 1f", "ldr r0,[r0,#12]", "ldr r0,[r0,r1,lsl #2]", "ldr r0,[r0]", "bx lr", "1:", "mov r0,#0", "bx lr"]],
]);
const expectedClasses = {
  selected_view_scalar_accessors_49: {
    members: ["func_004C75A8", "func_004C75D0", "func_004C7748", "func_004C7770", "func_004C77F4", "func_004C781C", "func_004C784C"],
    parameters: ["loadWidth", "signedness", "firstOffset", "secondOffset"],
  },
  selected_view_mask_accessors_49: {
    members: ["func_004C7CF4", "func_004C7D4C", "func_004C7E2C", "func_004C8400", "func_004C8438", "func_004C84B0", "func_004C84E8"],
    parameters: ["selectorScratch", "subrecordIndex", "wordOffsets"],
  },
  selected_view_copy_or_index_49: {
    members: ["func_004C7E5C", "func_004C80D0"],
    parameters: ["operation"],
  },
};
const expectedFunctions = [...schedules.keys()];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_49.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1008 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
let totalSize = 0;
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const name = expectedFunctions[index];
  const entry = manifest.functions[index];
  const size = schedules.get(name).filter((line) => !line.endsWith(":")).length * 4;
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
  const begin = `FUNCTION_BEGIN ${name}`;
  const end = `FUNCTION_END ${name}`;
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (start < 0 || finish < 0 || source.indexOf(begin, start + 1) >= 0 || source.indexOf(end, finish + 1) >= 0) fail(`source boundaries for ${name} are invalid`);
  const actual = source.slice(start + begin.length, finish).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(schedules.get(name))) fail(`instruction schedule for ${name} differs from the approved contract`);
}
if (/^\s*\.word\b/m.test(source)) fail("source must not contain adjacent words or literal-pool data");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-49.mjs [object readelf]");
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

console.log("Validated ARM runtime helpers batch 49: 22 functions, 1,008 body bytes, and no relocations.");
