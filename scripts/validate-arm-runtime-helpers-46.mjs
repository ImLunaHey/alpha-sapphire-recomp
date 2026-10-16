import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-46.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-46 validation failed: ${message}`);
  process.exit(1);
}

const schedules = new Map([
  ["func_004E43FC", ["push {r4,lr}", "mov r4,r0", "ldr r0,[r0,#52]", "cmp r0,#0", "bne 1f", "mov r2,#0", "mov r1,r2", "mov r0,r2", "mov r0,r0", "1:", "ldr r0,[r4,#52]", "pop {r4,pc}"]],
  ["func_004E4430", ["ldr r0,[r0,#52]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
  ["func_004E4670", ["vadd.f32 s7,s2,s4", "vsub.f32 s1,s1,s3", "vldr s8,.lfunc_004e4670_coefficient_c", "vldr s6,.lfunc_004e4670_coefficient_a", "vldr s5,.lfunc_004e4670_coefficient_b", "vnmls.f32 s4,s2,s8", "vmla.f32 s7,s1,s6", "vmls.f32 s4,s1,s5", "vmul.f32 s1,s7,s5", "vmul.f32 s3,s4,s6", "vmul.f32 s1,s1,s0", "vmul.f32 s1,s1,s0", "vmla.f32 s1,s3,s0", "vadd.f32 s0,s1,s2", "bx lr"]],
  ["func_004E46B8", ["vldr s8,.lfunc_004e46b8_coefficient_c", "vadd.f32 s5,s2,s4", "vsub.f32 s3,s1,s3", "vnmls.f32 s4,s2,s8", "vldr s7,.lfunc_004e46b8_coefficient_a", "vldr s6,.lfunc_004e46b8_coefficient_b", "vmla.f32 s5,s3,s7", "vmls.f32 s4,s3,s6", "vmla.f32 s4,s5,s0", "vmla.f32 s2,s0,s4", "vmla.f32 s1,s0,s2", "vmov.f32 s0,s1", "bx lr"]],
  ["func_004E6014", ["ldrb r0,[r0,#10]", "cmp r0,#0", "cmpne r0,#1", "movne r0,#2", "beq 1f", "1:", "bx lr"]],
  ["func_004E6064", ["ldrb r0,[r0,#15]", "mov r2,#1", "ands r0,r0,r2,lsl r1", "movne r0,#1", "bx lr"]],
  ["func_004E6084", ["ldrb r0,[r0,#14]", "cmp r0,#0", "cmpne r0,#1", "movne r0,#2", "beq 1f", "1:", "bx lr"]],
  ["func_004E68C4", ["ldr r0,[r0,#40]", "mov r2,#1", "and r0,r0,#7680", "lsr r0,r0,#9", "ands r0,r0,r2,lsl r1", "movne r0,#1", "bx lr"]],
  ["func_004E6FA0", ["ldrb r0,[r0,#195]", "cmp r0,#3", "moveq r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E7F90", ["cmp r1,#100", "movcs r0,#0", "bcs 1f", "add r0,r0,r1,lsl #4", "add r0,r0,#4", "vldmia r0,{s0-s3}", "mov r0,#1", "vstmia r2,{s0-s3}", "1:", "bx lr"]],
  ["func_004E82C4", ["add r1,r0,#768", "ldrh r0,[r1,#40]", "sub r2,r0,#65280", "subs r2,r2,#255", "beq 1f", "ldrh r1,[r1,#46]", "cmp r0,r1", "moveq r0,#1", "beq 2f", "1:", "mov r0,#0", "2:", "bx lr"]],
  ["func_004E8384", ["cmp r1,#5", "movcs r0,#0", "bcs 1f", "add r0,r0,r1,lsl #4", "add r1,r0,#30720", "vldr s0,[r1,#640]", "ldr r0,[r1,#644]!", "add r1,r1,#4", "vldmia r1,{s1-s2}", "vstr s0,[r2]", "str r0,[r2,#4]!", "add r2,r2,#4", "mov r0,#1", "vstmia r2,{s1-s2}", "1:", "bx lr"]],
  ["func_004E8D38", ["ldr r1,[r0,#4]", "tst r1,#1", "moveq r0,#0", "addne r0,r0,#8", "bx lr"]],
  ["func_004E8D68", ["add r0,r0,#19456", "add r0,r0,#552", "ldr r0,[r0]", "cmp r0,#0", "moveq r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004E9E5C", ["ldr r0,[r0,#20]", "mov r1,#0", "cmp r0,#0", "beq 2f", "1:", "tst r0,#1", "addne r1,r1,#1", "lsrs r0,r0,#1", "bne 1b", "2:", "and r0,r1,#255", "bx lr"]],
  ["func_004E9F98", ["ldr r2,[r0,#8]!", "ldr r1,[r0,#4]", "mov r0,r2", "bx lr"]],
  ["func_004EA03C", ["ldr r0,[r0,#4]", "lsl r0,r0,#24", "lsrs r0,r0,#28", "cmpne r0,#1", "movne r0,#0", "beq 1f", "1:", "bx lr"]],
  ["func_00520DDC", ["add r0,r0,r1,lsl #3", "ldr r0,[r0,#12]", "str r0,[r2]", "mov r0,#0", "bx lr"]],
  ["func_0053FC5C", ["mov r2,#1", "strb r2,[r0,#4]", "ldr r1,[r1]", "str r1,[r0]", "bx lr"]],
  ["func_005406DC", ["mov r1,#15", "1:", "ldrb r2,[r0,r1]", "add r2,r2,#1", "ands r2,r2,#255", "strb r2,[r0,r1]", "bne 2f", "sub r1,r1,#1", "cmp r1,#0", "bgt 1b", "2:", "bx lr"]],
]);
const expectedWords = new Map([
  ["func_004E4670", [
    { offset: 60, kind: "R_ARM_ABS32", symbol: "runtime_curve_coefficient_a_46" },
    { offset: 64, kind: "R_ARM_ABS32", symbol: "runtime_curve_coefficient_b_46" },
    { offset: 68, kind: "R_ARM_ABS32", symbol: "runtime_curve_coefficient_c_46" },
  ]],
  ["func_004E46B8", [
    { offset: 52, kind: "R_ARM_ABS32", symbol: "runtime_curve_coefficient_c_46" },
    { offset: 56, kind: "R_ARM_ABS32", symbol: "runtime_curve_coefficient_a_46" },
    { offset: 60, kind: "R_ARM_ABS32", symbol: "runtime_curve_coefficient_b_46" },
  ]],
]);
const expectedClasses = {
  tri_state_byte_canonicalizers_46: { members: ["func_004E6014", "func_004E6084"], parameters: ["fieldOffset"] },
  indexed_bit_tests_46: { members: ["func_004E6064", "func_004E68C4"], parameters: ["sourceWidth", "fieldOffset", "preMask", "preShift"] },
  bounded_four_word_copies_46: { members: ["func_004E7F90", "func_004E8384"], parameters: ["limit", "sourceLayout", "transferSchedule"] },
};
const expectedIdentities = {
  runtime_curve_coefficient_a_46: { minimumSlotAlignment: 4, equality: "shared-two-site-pairwise-distinct-a", usage: "vfp-single-curve-coefficient" },
  runtime_curve_coefficient_b_46: { minimumSlotAlignment: 4, equality: "shared-two-site-pairwise-distinct-b", usage: "vfp-single-curve-coefficient" },
  runtime_curve_coefficient_c_46: { minimumSlotAlignment: 4, equality: "shared-two-site-pairwise-distinct-c", usage: "vfp-single-curve-coefficient" },
};
const expectedFunctions = [...schedules.keys()];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_46.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 640 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
let totalSize = 0;
for (let index = 0; index < expectedFunctions.length; index += 1) {
  const name = expectedFunctions[index];
  const entry = manifest.functions[index];
  const size = schedules.get(name).filter((line) => !line.endsWith(":")).length * 4;
  if (entry?.name !== name || entry.size !== size || JSON.stringify(entry.calls) !== "[]" ||
      JSON.stringify(entry.adjacentWords) !== JSON.stringify(expectedWords.get(name) ?? [])) {
    fail(`manifest entry for ${name} is invalid`);
  }
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize ||
    JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedClasses) ||
    JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedIdentities) ||
    JSON.stringify(manifest.symbolicSlots) !== "{}") {
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
  const next = source.indexOf("FUNCTION_BEGIN ", finish + end.length);
  const tail = source.slice(finish + end.length, next < 0 ? source.length : next);
  const words = [...tail.matchAll(/^\s*\.word\s+(\S+)\s*$/gm)].map((match) => match[1]);
  if (JSON.stringify(words) !== JSON.stringify((expectedWords.get(name) ?? []).map(({ symbol }) => symbol))) fail(`adjacent word schedule for ${name} differs from the approved contract`);
}
for (const identity of Object.keys(expectedIdentities)) {
  if ((source.match(new RegExp(`^\\.global ${identity}$`, "gm")) ?? []).length !== 1 ||
      (source.match(new RegExp(`^\\s*\\.word ${identity}$`, "gm")) ?? []).length !== 2) {
    fail(`coefficient identity ${identity} declaration or use count is invalid`);
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-46.mjs [object readelf]");
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
    const extent = entry.size + entry.adjacentWords.length * 4;
    if (!section || section.size !== extent || !section.flags.includes("A") || !section.flags.includes("X") || section.alignment < 4 ||
        matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== entry.size || matches[0].type !== "FUNC" ||
        matches[0].bind !== "GLOBAL" || matches[0].section !== section.index) fail(`${entry.name} does not occupy its exact aligned executable function section`);
  }
  const actualRelocations = new Map(expectedFunctions.map((name) => [name, []]));
  let relocationSection;
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '\.(?:rel|rela)\.text\.(func_[0-9A-F]{8})'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (relocationSection && fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) {
      actualRelocations.get(relocationSection)?.push({ offset: Number.parseInt(fields[0], 16), kind: fields[2], symbol: fields[4] });
    }
  }
  for (const entry of manifest.functions) {
    if (JSON.stringify(actualRelocations.get(entry.name)) !== JSON.stringify(entry.adjacentWords)) fail(`relocations for ${entry.name} differ from the coefficient-slot contract`);
  }
  for (const identity of Object.keys(expectedIdentities)) {
    const matches = parsedSymbols.filter(({ name }) => name === identity);
    if (matches.length !== 1 || matches[0].type !== "NOTYPE" || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") fail(`${identity} must be one undefined global coefficient identity`);
  }
}

console.log("Validated ARM runtime helpers batch 46: 20 functions, 640 body bytes, and six symbolic coefficient slots.");
