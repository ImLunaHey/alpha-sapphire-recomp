import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-45.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-45 validation failed: ${message}`);
  process.exit(1);
}

const schedules = new Map([
  ["func_004E503C", ["ldr r2,[r0,#32]!", "ldr r1,[r0,#4]", "mov r0,r2", "bx lr"]],
  ["func_004E5400", ["ldr r0,[r0,#48]", "and r0,r0,#3968", "lsr r0,r0,#7", "bx lr"]],
  ["func_004E5CE4", ["ldr r0,[r0]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
  ["func_004E5DA8", ["ldr r0,[r0,#12]", "add r1,r1,r1,lsl #1", "add r0,r0,r1,lsl #2", "bx lr"]],
  ["func_004E5EAC", ["ldr r0,[r0,#4]", "and r0,r0,#28", "lsr r0,r0,#2", "bx lr"]],
  ["func_004E6078", ["add r0,r0,r1,lsl #2", "ldr r0,[r0,#16]", "bx lr"]],
  ["func_004E60D8", ["ldrd r0,[r0,#24]", "sub r0,r1,r0", "asr r0,r0,#3", "bx lr"]],
  ["func_004E65F0", ["ldrh r0,[r0]", "bic r0,r0,#64512", "bx lr"]],
  ["func_004E6970", ["ldr r0,[r0,#44]", "and r0,r0,#31457280", "lsr r0,r0,#21", "bx lr"]],
  ["func_004E6AF8", ["add r0,r0,r1,lsl #2", "ldr r0,[r0,#48]", "bx lr"]],
  ["func_004E6B20", ["ldrh r0,[r0]", "cmp r0,#900", "movcc r0,#1", "movcs r0,#0", "bx lr"]],
  ["func_004E6E80", ["ldrb r1,[r0,#177]", "cmp r1,#0", "ldrne r0,[r0,#148]", "moveq r0,#0", "bx lr"]],
  ["func_004E7048", ["ldrb r0,[r0,#195]", "cmp r0,#0", "moveq r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E71E0", ["ldrb r0,[r0,#195]", "cmp r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E71F0", ["ldr r0,[r0,#92]", "and r0,r0,#2", "lsr r0,r0,#1", "bx lr"]],
  ["func_004E74B4", ["ldr r0,[r0,#200]", "and r0,r0,#64", "lsr r0,r0,#6", "bx lr"]],
  ["func_004E76B0", ["ldr r2,[r1,#86]", "str r2,[r0]", "ldrh r1,[r1,#90]", "strh r1,[r0,#4]", "bx lr"]],
  ["func_004E86B8", ["add r0,r0,#768", "ldrh r0,[r0,#40]", "bx lr"]],
  ["func_004E8938", ["add r0,r0,r1,lsl #2", "ldr r0,[r0,#36]", "bx lr"]],
  ["func_004E8944", ["add r0,r0,r1", "ldrb r0,[r0,#11]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
  ["func_004E8958", ["add r0,r0,r1", "ldrb r0,[r0,#4]", "cmp r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E9420", ["ldr r0,[r0]", "cmp r0,#0", "moveq r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E9C00", ["ldr r0,[r0,#4]", "cmp r0,#0", "moveq r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E9CB0", ["add r1,r1,r1,lsl #4", "add r0,r0,r1,lsl #1", "add r0,r0,#4", "bx lr"]],
  ["func_004E9F48", ["ldr r0,[r0,#52]", "and r0,r0,#2048", "lsr r0,r0,#11", "bx lr"]],
  ["func_004E9F68", ["ldr r0,[r0,#52]", "and r0,r0,#1024", "lsr r0,r0,#10", "bx lr"]],
  ["func_004E9F88", ["ldr r0,[r0,#52]", "and r0,r0,#67108864", "lsr r0,r0,#26", "bx lr"]],
  ["func_004EA52C", ["add r0,r0,#256", "ldrh r0,[r0,#168]", "ands r0,r0,#2", "movne r0,#1", "bx lr"]],
  ["func_004EA56C", ["add r0,r0,#256", "ldrh r0,[r0,#168]", "ands r0,r0,#1", "movne r0,#1", "bx lr"]],
  ["func_004EA5F4", ["ldr r0,[r0,#48]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
]);
const expectedFunctions = [...schedules.keys()];
const expectedClasses = {
  indexed_word_loads_45: { members: ["func_004E6078", "func_004E6AF8", "func_004E8938"], parameters: ["baseDisplacement"] },
  word_bit_extractors_45: { members: ["func_004E5400", "func_004E5EAC", "func_004E6970", "func_004E71F0", "func_004E74B4", "func_004E9F48", "func_004E9F68", "func_004E9F88"], parameters: ["fieldOffset", "mask", "rightShift"] },
  nonnull_word_normalizers_45: { members: ["func_004E5CE4", "func_004EA5F4"], parameters: ["fieldOffset"] },
  zero_test_normalizers_45: { members: ["func_004E7048", "func_004E9420", "func_004E9C00"], parameters: ["accessWidth", "fieldOffset"] },
  split_halfword_bit_tests_45: { members: ["func_004EA52C", "func_004EA56C"], parameters: ["testedBit"] },
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_45.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 500 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
let totalSize = 0;
for (let index = 0; index < expectedFunctions.length; index++) {
  const name = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== schedules.get(name).length * 4 ||
      JSON.stringify(entry.calls) !== "[]" || JSON.stringify(entry.adjacentWords) !== "[]") {
    fail(`manifest entry for ${name} is invalid`);
  }
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize ||
    JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedClasses) ||
    JSON.stringify(manifest.symbolicIdentities) !== "{}" ||
    JSON.stringify(manifest.symbolicSlots) !== "{}") {
  fail("manifest totals, identity classes, or empty symbolic contracts are invalid");
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
    .replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\{\s+/g, "{")
    .replace(/\s+\}/g, "}").trim().toLowerCase();
}
for (const name of expectedFunctions) {
  const begin = `BEGIN_FUNCTION ${name}`;
  const end = `END_FUNCTION ${name}`;
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (start < 0 || finish < 0 || source.indexOf(begin, start + 1) >= 0 || source.indexOf(end, finish + 1) >= 0) fail(`source boundaries for ${name} are invalid`);
  const actual = source.slice(start + begin.length, finish).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(schedules.get(name))) fail(`instruction schedule for ${name} differs from the approved contract`);
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-45.mjs [object readelf]");
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
  }
  let relocationSection;
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '\.(?:rel|rela)\.text\.(func_[0-9A-F]{8})'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (selected.has(relocationSection) && fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) {
      fail(`${relocationSection} unexpectedly contains relocation ${fields[2]}`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 45: 30 functions, 500 body bytes, and zero relocations.");
