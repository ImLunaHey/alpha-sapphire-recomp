import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-43.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-43 validation failed: ${message}`);
  process.exit(1);
}

const schedules = new Map([
  ["func_004EA6F8", ["add r0,r0,#256", "ldrh r0,[r0,#82]", "and r0,r0,#1", "bx lr"]],
  ["func_004EA794", ["add r0,r0,#256", "ldrsb r0,[r0,#120]", "bx lr"]],
  ["func_004EA7A0", ["mov r2,r1", "add r1,r0,#80", "mov r0,r2", "b runtime_embedded_payload_transfer_43"]],
  ["func_004EA7C4", ["add r0,r0,#56", "vldmia r0,{s0-s3}", "vstmia r1,{s0-s3}", "bx lr"]],
  ["func_004EA7F8", ["ldr r2,[r0,#16]!", "ldr r1,[r0,#4]", "mov r0,r2", "bx lr"]],
  ["func_004EA810", ["ldr r2,[r0,#24]!", "ldr r1,[r0,#4]", "mov r0,r2", "bx lr"]],
  ["func_004EA820", ["add r0,r0,#256", "ldrh r0,[r0,#82]", "and r0,r0,#2", "lsr r0,r0,#1", "bx lr"]],
  ["func_004EA834", ["mov r3,r1", "ldr r1,[r0,#8]", "mov r2,#13", "str r1,[r3]", "ldrb r1,[r0,#13]", "strb r1,[r3,#4]", "add r1,r0,#80", "add r0,r3,#6", "b runtime_fixed_13_byte_copy_43"]],
  ["func_004EA858", ["cmp r1,#0", "beq 1f", "ldr r2,[r0,#40]", "str r2,[r1]", "ldr r2,[r0,#28]", "ldr r0,[r0,#24]", "str r0,[r1,#8]", "str r2,[r1,#12]", "1:", "bx lr"]],
  ["func_004EA87C", ["mov r2,r1", "add r1,r0,#106", "mov r0,r2", "b runtime_embedded_payload_transfer_43"]],
  ["func_004EA89C", ["add r1,r1,r1,lsl #4", "add r0,r0,r1,lsl #1", "add r1,r0,#132", "mov r0,r2", "b runtime_embedded_payload_transfer_43"]],
  ["func_004EA8EC", ["ldrb r0,[r0,#54]", "cmp r0,#0", "movne r0,#1", "bx lr"]],
  ["func_004EA924", ["ldr r0,[r0,#44]", "and r0,r0,#0xff0000", "lsr r0,r0,#16", "bx lr"]],
  ["func_004EA940", ["ldrb r0,[r0,#12]", "cmp r0,#24", "cmpne r0,#25", "moveq r0,#1", "movne r0,#0", "bx lr"]],
  ["func_004EA958", ["mov r3,r1", "add r1,r0,#8", "mov r2,#368", "mov r0,r3", "push {r4,lr}", "bl runtime_fixed_368_byte_copy_43", "mov r0,#368", "pop {r4,pc}"]],
  ["func_004EA998", ["ldr r1,[r0,#4]", "ldrd r0,r1,[r1,#16]", "bx lr"]],
]);
const expectedFunctions = [...schedules.keys()];
const expectedCalls = new Map([
  ["func_004EA7A0", [{ offset: 12, kind: "R_ARM_JUMP24", symbol: "runtime_embedded_payload_transfer_43" }]],
  ["func_004EA834", [{ offset: 32, kind: "R_ARM_JUMP24", symbol: "runtime_fixed_13_byte_copy_43" }]],
  ["func_004EA87C", [{ offset: 12, kind: "R_ARM_JUMP24", symbol: "runtime_embedded_payload_transfer_43" }]],
  ["func_004EA89C", [{ offset: 16, kind: "R_ARM_JUMP24", symbol: "runtime_embedded_payload_transfer_43" }]],
  ["func_004EA958", [{ offset: 20, kind: "R_ARM_CALL", symbol: "runtime_fixed_368_byte_copy_43" }]],
]);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_43.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 320 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, mode, function count, or total body size is invalid");
}
let totalSize = 0;
for (let index = 0; index < expectedFunctions.length; index++) {
  const name = expectedFunctions[index];
  const entry = manifest.functions[index];
  const instructionCount = schedules.get(name).filter((line) => !line.endsWith(":")).length;
  if (entry?.name !== name || !Number.isInteger(entry.size) || entry.size !== instructionCount * 4 ||
      JSON.stringify(entry.calls) !== JSON.stringify(expectedCalls.get(name) ?? []) ||
      JSON.stringify(entry.adjacentWords) !== "[]") {
    fail(`manifest entry for ${name} is invalid`);
  }
  totalSize += entry.size;
}
if (totalSize !== manifest.totalBodySize) fail("manifest function sizes do not match totalBodySize");

const expectedClasses = {
  packed_status_bit_accessors_43: { members: ["func_004EA6F8", "func_004EA820"], parameters: ["selectedBit", "normalizingShift"] },
  two_word_pair_accessors_43: { members: ["func_004EA7F8", "func_004EA810"], parameters: ["pairOffset"] },
  embedded_payload_transfer_tails_43: { members: ["func_004EA7A0", "func_004EA87C", "func_004EA89C"], parameters: ["payloadAddressSchedule", "outputRegisterSchedule"] },
};
const expectedIdentities = {
  runtime_embedded_payload_transfer_43: { mode: "arm", minimumAlignment: 4, equality: "shared-three-site-identity", usage: "embedded-payload-tail-transfer" },
  runtime_fixed_13_byte_copy_43: { mode: "arm", minimumAlignment: 4, equality: "batch-local-distinct", usage: "fixed-13-byte-copy-tail-transfer" },
  runtime_fixed_368_byte_copy_43: { mode: "arm", minimumAlignment: 4, equality: "batch-local-distinct", usage: "fixed-368-byte-copy-call" },
};
if (JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedClasses) ||
    JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedIdentities)) {
  fail("identity class or symbolic identity contract is invalid");
}

const selected = new Set(expectedFunctions);
for (const name of readdirSync(join(root, "config"))) {
  if (name === manifestName || !/^arm-.*\.json$/.test(name)) continue;
  const other = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of other.functions ?? []) {
    if (selected.has(entry.name)) fail(`${entry.name} overlaps selection in config/${name}`);
  }
}
const configured = sources.sources.filter(({ path }) => path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== "arm") {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}

const source = readFileSync(join(root, manifest.source), "utf8");
if (!source.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n") ||
    /^\s*\.(?:word|long|4byte)\b/m.test(source)) {
  fail("source preamble or no-adjacent-data contract is invalid");
}
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
  if (start < 0 || finish < 0 || source.indexOf(begin, start + 1) >= 0 || source.indexOf(end, finish + 1) >= 0) {
    fail(`source boundaries for ${name} are invalid`);
  }
  const actual = source.slice(start + begin.length, finish).split("\n").map(normalize).filter(Boolean);
  if (JSON.stringify(actual) !== JSON.stringify(schedules.get(name))) {
    fail(`instruction schedule for ${name} differs from the approved contract`);
  }
}
for (const identity of Object.keys(expectedIdentities)) {
  if ((source.match(new RegExp(`^\\.global ${identity}$`, "gm")) ?? []).length !== 1 ||
      (source.match(new RegExp(`^\\.type ${identity}, %function$`, "gm")) ?? []).length !== 1) {
    fail(`symbol declaration for ${identity} is invalid`);
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-43.mjs [object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header, sections, symbols, relocations;
  try {
    const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], options);
    sections = execFileSync(readelf, ["-SW", objectPath], options);
    symbols = execFileSync(readelf, ["-sW", objectPath], options);
    relocations = execFileSync(readelf, ["-rW", objectPath], options);
  } catch (error) {
    fail(`could not inspect object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("object is not ARM");
  const parsedSections = new Map();
  for (const line of sections.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s+\S+\s+(\S+)\s+\S+\s+\S+\s+(\d+)\s*$/);
    if (match) parsedSections.set(match[2], { index: match[1], size: Number.parseInt(match[3], 16), flags: match[4], alignment: Number.parseInt(match[5], 10) });
  }
  const parsedSymbols = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 8 && fields[0].endsWith(":")) parsedSymbols.push({
      value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10),
      type: fields[3], bind: fields[4], section: fields[6], name: fields.slice(7).join(" "),
    });
  }
  for (const entry of manifest.functions) {
    const section = parsedSections.get(`.text.${entry.name}`);
    const matches = parsedSymbols.filter(({ name }) => name === entry.name);
    if (!section || section.size !== entry.size || !section.flags.includes("A") || !section.flags.includes("X") ||
        section.alignment < 4 || matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== entry.size ||
        matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" || matches[0].section !== section.index) {
      fail(`${entry.name} does not occupy one exact aligned executable function section`);
    }
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
    if (JSON.stringify(actualRelocations.get(entry.name)) !== JSON.stringify(entry.calls)) {
      fail(`relocations for ${entry.name} differ from the symbolic branch contract`);
    }
  }
  for (const identity of Object.keys(expectedIdentities)) {
    const matches = parsedSymbols.filter(({ name }) => name === identity);
    if (matches.length !== 1 || matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") {
      fail(`${identity} must be one undefined global function identity`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 43: 16 functions, 320 body bytes, and five symbolic branches.");
