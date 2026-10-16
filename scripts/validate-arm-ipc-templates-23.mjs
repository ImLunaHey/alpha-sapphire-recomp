import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-23.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_23.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json", "arm-ipc-templates-16.json", "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json", "arm-ipc-templates-19.json", "arm-ipc-templates-20.json",
  "arm-ipc-templates-21.json", "arm-ipc-templates-22.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");

function fail(message) { throw new Error(`ARM IPC template 23 validation failed: ${message}`); }

const templates = new Map([
  ["multi_output_descriptors", { size: 112, literals: ["command"] }],
  ["global_static_byte", { size: 108, literals: ["command", "handle"] }],
  ["global_four_outputs", { size: 104, literals: ["command", "handle"] }],
  ["three_descriptor_pairs", { size: 104, literals: ["command"] }],
  ["structure_three_outputs", { size: 104, literals: ["command"] }],
  ["mapped_halfword_output", { size: 104, literals: ["command"] }],
  ["auxiliary_static", { size: 104, literals: ["command", "auxiliary", "staticDescriptor"] }],
  ["mapped_descriptor_output", { size: 104, literals: ["command"] }],
]);
const expected = new Map([
  ["func_002C9334", ["multi_output_descriptors", "ipc_command_func_002C9334"]],
  ["func_001F152C", ["global_static_byte", "ipc_command_func_002C9220", "ipc_handle_slot_iota"]],
  ["func_00133DA4", ["global_four_outputs", "ipc_command_func_002C6104", "ipc_handle_slot_alpha"]],
  ["func_001F7030", ["three_descriptor_pairs", "ipc_command_func_001F7030"]],
  ["func_001F73F4", ["structure_three_outputs", "ipc_command_func_001F73F4"]],
  ["func_002C5548", ["mapped_halfword_output", "ipc_command_func_002C5548"]],
  ["func_002C59AC", ["auxiliary_static", "ipc_command_func_002C59AC", "ipc_aux_func_002C59AC_word1", "ipc_aux_func_002C59AC_static_descriptor"]],
  ["func_002CCB34", ["mapped_descriptor_output", "ipc_command_func_002CCB34"]],
]);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_23.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 8) fail("unexpected manifest format or cardinality");
const functions = new Map();
const identities = new Set();
let bytes = 0;
let slots = 0;
for (const entry of manifest.functions) {
  const definition = templates.get(entry?.template);
  const wanted = expected.get(entry?.name);
  if (!definition || !wanted || entry.mode !== "arm" || entry.size !== definition.size || functions.has(entry.name) ||
      entry.template !== wanted[0] || definition.literals.some((key, index) => entry[key] !== wanted[index + 1])) fail("invalid or duplicate function mapping");
  const keys = ["name", "mode", "size", "template", ...definition.literals].sort().join(",");
  if (Object.keys(entry).sort().join(",") !== keys) fail(`unexpected fields for ${entry.name}`);
  functions.set(entry.name, entry);
  bytes += entry.size;
  slots += definition.literals.length;
  for (const key of definition.literals) identities.add(entry[key]);
}
if (functions.size !== 8 || bytes !== 844 || slots !== 12 || identities.size !== 12) fail("batch totals must be 8 functions, 844 bytes, 12 slots, and 12 classes");

const allSlots = [];
for (const path of [...priorManifestPaths, manifestPath]) {
  const prior = JSON.parse(readFileSync(path, "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") allSlots.push(entry[key]);
    }
  }
}
if (allSlots.length !== 306 || new Set(allSlots).size !== 163) fail("the eleven IPC batches must form 306 slots and 163 classes");

const invocations = new Map();
for (const match of source.matchAll(/^IPC_BEGIN (func_[0-9A-F]{8})$/gm)) invocations.set(match[1], true);
if (invocations.size !== 8 || [...functions.keys()].some((name) => !invocations.has(name))) fail("source must contain all eight complete schedules exactly once");
if ((source.match(/^IPC_END_(?:ONE|TWO) /gm) ?? []).length !== 7 ||
    (source.match(/^\s*\.size func_002C59AC,/gm) ?? []).length !== 1) fail("body and pool boundaries differ");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are forbidden");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+(?:\\command|\\handle|ipc_[A-Za-z0-9_]+)$/.test(line)) fail("pool words must be named symbols");
}
if (/^\s*blx?\s+/m.test(source)) fail("direct calls are forbidden");
if ((source.match(/^\s*svc #50$/gm) ?? []).length !== 8) fail("each schedule must issue SendSyncRequest exactly once");

if (createHash("sha256").update(source).digest("hex") !== "e1bd4afa9db54886eb6586f2d74ffa106d90df72420cdf08cbf55653aa2ed538") fail("deterministic assembly schedules changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "8a4918df8fc4644af8b302a490e865d7e9dfeb34054774a5f7e2976eaa78f6c1") fail("deterministic manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf must be provided together");
if (!objectPath) {
  console.log(`Validated deterministic source coverage and 306-slot/163-class IPC structure for 8 ARM functions (${bytes} bytes).`);
  process.exit(0);
}
function inspect(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`readelf exited ${result.status}`);
  return result.stdout;
}
const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const sections = new Map();
for (const match of sectionOutput.matchAll(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm)) sections.set(match[2], { index: Number(match[1]), size: Number.parseInt(match[4], 16), flags: match[5], alignment: Number(match[6]) });
const symbols = new Map();
for (const match of symbolOutput.matchAll(/^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm)) {
  const values = symbols.get(match[7]) ?? [];
  values.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], binding: match[4], section: match[6] });
  symbols.set(match[7], values);
}
const relocations = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading) { relocatedSection = heading[1]; continue; }
  const match = /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
  if (match && relocatedSection) (relocations.get(relocatedSection) ?? (relocations.set(relocatedSection, []), relocations.get(relocatedSection))).push({ offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] });
}
for (const [name, entry] of functions) {
  const definition = templates.get(entry.template);
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (!section || section.size !== entry.size + definition.literals.length * 4 || !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${name}`);
  const symbol = symbols.get(name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size || symbol[0].type !== "FUNC" || symbol[0].binding !== "GLOBAL" || Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${name}`);
  const wanted = definition.literals.map((key, index) => ({ offset: entry.size + index * 4, type: "R_ARM_ABS32", symbol: entry[key] }));
  const actual = relocations.get(sectionName) ?? [];
  if (actual.length !== wanted.length || wanted.some((value, index) => JSON.stringify(value) !== JSON.stringify(actual[index]))) fail(`invalid ordered relocations for ${name}`);
}
for (const identity of identities) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid identity ${identity}`);
}
console.log(`Validated 8 ARM IPC sections, symbols, no direct calls, and 12 ordered literal relocations (${bytes} bytes).`);
