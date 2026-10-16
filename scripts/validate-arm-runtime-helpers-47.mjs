import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-47.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-47 validation failed: ${message}`);
  process.exit(1);
}

const schedules = new Map([
  ["func_004CD0DC", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#240", "add r1,r1,r2,lsl #2", "ldr r0,[r0,r1]", "lsl r0,r0,#26", "lsr r0,r0,#29", "bx lr"]],
  ["func_004CD674", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#240", "add r1,r1,r2,lsl #2", "ldr r0,[r0,r1]", "lsl r0,r0,#23", "lsr r0,r0,#29", "bx lr"]],
  ["func_004CD698", ["ldr r0,[r0,#120]", "ldrb r0,[r0,r1]", "bx lr"]],
  ["func_004CD6A4", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#220", "add r1,r1,r2,lsl #2", "ldrb r0,[r0,r1]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
  ["func_004CD6C8", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#240", "add r1,r1,r2,lsl #2", "ldr r0,[r0,r1]", "lsl r0,r0,#20", "lsr r0,r0,#29", "bx lr"]],
  ["func_004CD7D8", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#240", "add r1,r1,r2,lsl #2", "ldr r0,[r0,r1]", "lsr r0,r0,#28", "bx lr"]],
  ["func_004CD7F8", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#223", "add r1,r1,r2,lsl #2", "ldrb r0,[r0,r1]", "bx lr"]],
  ["func_004CD814", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#240", "add r1,r1,r2,lsl #2", "ldr r0,[r0,r1]", "lsl r0,r0,#16", "lsr r0,r0,#28", "bx lr"]],
  ["func_004CD85C", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#240", "add r1,r1,r2,lsl #2", "ldr r0,[r0,r1]", "lsl r0,r0,#12", "lsr r0,r0,#28", "bx lr"]],
  ["func_004CD880", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#276", "add r1,r1,r2,lsl #2", "ldrb r0,[r0,r1]", "bx lr"]],
  ["func_004CD89C", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#225", "add r1,r1,r2,lsl #2", "ldrb r0,[r0,r1]", "bx lr"]],
  ["func_004CD8B8", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#227", "add r1,r1,r2,lsl #2", "ldrb r0,[r0,r1]", "bx lr"]],
  ["func_004CD8D4", ["ldr r0,[r0,#128]", "lsl r2,r2,#3", "ldr r0,[r0,r1,lsl #4]", "lsr r0,r0,r2", "ands r0,r0,#255", "movne r0,#1", "bx lr"]],
  ["func_004CD8F0", ["rsb r2,r1,r1,lsl #5", "ldr r0,[r0,#108]", "add r2,r2,r2,lsl #1", "mov r1,#226", "add r1,r1,r2,lsl #2", "ldrb r0,[r0,r1]", "bx lr"]],
  ["func_004CDC60", ["add r1,r1,r1,lsl #4", "ldr r0,[r0,#48]", "add r1,r1,r1,lsl #2", "add r0,r0,r1,lsl #2", "add r1,r2,r2,lsl #1", "add r0,r0,#84", "add r0,r0,r1,lsl #3", "add r1,r0,#164", "ldrd r0,[r1]", "strd r0,[r3]", "bx lr"]],
  ["func_004CDC8C", ["add r1,r1,r1,lsl #4", "ldr r0,[r0,#48]", "add r3,r1,r1,lsl #2", "add r1,r2,r2,lsl #1", "add r0,r0,r3,lsl #2", "add r0,r0,r1,lsl #3", "ldrb r0,[r0,#234]", "bx lr"]],
  ["func_004CDCAC", ["ldr r0,[r0,#40]", "add r3,r1,r1,lsl #1", "add r1,r3,r1,lsl #3", "ldr r0,[r0,#52]", "add r0,r0,r1,lsl #2", "add r0,r0,r2,lsl #2", "ldr r0,[r0,#28]", "bx lr"]],
  ["func_004CFE50", ["vldmia r0,{s0-s3}", "add r2,r0,#16", "add r0,r0,#32", "vstmia r1,{s0-s3}", "vldmia r2,{s0-s3}", "add r2,r1,#16", "add r1,r1,#32", "vstmia r2,{s0-s3}", "vldmia r0,{s0-s3}", "vstmia r1,{s0-s3}", "bx lr"]],
  ["func_004CFE7C", ["ldr r2,[r1,#12]", "ldr r3,[r1,#28]", "ldr r1,[r1,#44]", "str r1,[r0,#8]", "strd r2,[r0]", "bx lr"]],
  ["func_004CFFE4", ["vldmia r2!,{s5}", "vldr s1,[r1]", "vldr s0,[r1,#4]", "vldr s2,[r1,#8]", "vadd.f32 s1,s1,s5", "vldmia r2,{s3-s4}", "vadd.f32 s0,s0,s3", "vadd.f32 s2,s2,s4", "vstr s1,[r0]", "vstr s0,[r0,#4]", "vstr s2,[r0,#8]", "bx lr"]],
]);
const expectedClasses = {
  indexed_372_byte_record_accessors_47: {
    members: ["func_004CD0DC", "func_004CD674", "func_004CD6A4", "func_004CD6C8", "func_004CD7D8", "func_004CD7F8", "func_004CD814", "func_004CD85C", "func_004CD880", "func_004CD89C", "func_004CD8B8", "func_004CD8F0"],
    parameters: ["fieldOffset", "fieldWidth", "extraction", "normalization"],
  },
  indexed_nested_record_accessors_47: {
    members: ["func_004CDC60", "func_004CDC8C", "func_004CDCAC"],
    parameters: ["rootOffset", "outerStride", "innerStride", "fieldOffset", "resultWidth"],
  },
  fixed_float_word_transfers_47: {
    members: ["func_004CFE50", "func_004CFE7C", "func_004CFFE4"],
    parameters: ["sourceLayout", "destinationLayout", "transferSchedule", "arithmetic"],
  },
};
const expectedFunctions = [...schedules.keys()];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_47.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 652 ||
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
    .replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\{\s+/g, "{")
    .replace(/\s+\}/g, "}").trim().toLowerCase();
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
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-47.mjs [object readelf]");
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

console.log("Validated ARM runtime helpers batch 47: 20 functions, 652 body bytes, and no relocations.");
