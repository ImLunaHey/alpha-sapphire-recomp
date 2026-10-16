import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-22.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_22.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json", "arm-ipc-templates-16.json", "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json", "arm-ipc-templates-19.json", "arm-ipc-templates-20.json",
  "arm-ipc-templates-21.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");

function fail(message) { throw new Error(`ARM IPC template 22 validation failed: ${message}`); }

const templates = new Map([
  ["global_twelve_word", ["IPC_GLOBAL_TWELVE_WORD", 120, ["command", "handle"]]],
  ["inline_global_six_outputs", ["IPC_INLINE_GLOBAL_SIX_OUTPUTS", 116, ["handle"], "ipc_inline_command_id_10_no_params"]],
  ["global_mapped_static", ["IPC_GLOBAL_MAPPED_STATIC", 116, ["command", "handle"]]],
  ["structured_mapped", ["IPC_STRUCTURED_MAPPED", 116, ["command"]]],
  ["two_descriptor_pairs", ["IPC_TWO_DESCRIPTOR_PAIRS", 116, ["command"]]],
  ["mixed_static", ["IPC_MIXED_STATIC", 112, ["command"]]],
  ["structure_halfword", ["IPC_STRUCTURE_HALFWORD", 112, ["command"]]],
  ["scaled_static", ["IPC_SCALED_STATIC", 112, ["command"]]],
]);
const expected = new Map([
  ["func_001FC668", ["global_twelve_word", "ipc_command_func_001FC668", "ipc_handle_slot_kappa"]],
  ["func_00125018", ["inline_global_six_outputs", "ipc_handle_slot_mu"]],
  ["func_00126638", ["global_mapped_static", "ipc_command_func_00126638", "ipc_handle_slot_alpha"]],
  ["func_002C56CC", ["structured_mapped", "ipc_command_func_002C56CC"]],
  ["func_002E4038", ["two_descriptor_pairs", "ipc_command_func_002E4038"]],
  ["func_001F7508", ["mixed_static", "ipc_command_func_001F7508"]],
  ["func_002C58B0", ["structure_halfword", "ipc_command_func_002C58B0"]],
  ["func_002C5AA0", ["scaled_static", "ipc_command_func_002C5AA0"]],
]);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_22.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 8) fail("unexpected manifest format or cardinality");
const functions = new Map();
const identities = new Set();
let bytes = 0;
let slots = 0;
for (const entry of manifest.functions) {
  const definition = templates.get(entry?.template);
  const wanted = expected.get(entry?.name);
  if (!definition || !wanted || entry.mode !== "arm" || entry.size !== definition[1] || functions.has(entry.name) ||
      entry.template !== wanted[0] || definition[2].some((key, index) => entry[key] !== wanted[index + 1]) ||
      (definition[3] === undefined ? entry.inlineCommand !== undefined : entry.inlineCommand !== definition[3])) fail("invalid or duplicate function mapping");
  const keys = ["name", "mode", "size", "template", ...definition[2], ...(definition[3] ? ["inlineCommand"] : [])].sort().join(",");
  if (Object.keys(entry).sort().join(",") !== keys) fail(`unexpected fields for ${entry.name}`);
  functions.set(entry.name, entry);
  bytes += entry.size;
  slots += definition[2].length;
  for (const key of definition[2]) identities.add(entry[key]);
}
if (functions.size !== 8 || bytes !== 920 || slots !== 10 || identities.size !== 10) fail("batch totals must be 8 functions, 920 bytes, 10 slots, and 10 classes");

const allSlots = [];
for (const path of [...priorManifestPaths, manifestPath]) {
  const prior = JSON.parse(readFileSync(path, "utf8"));
  for (const entry of prior.functions) for (const key of ["command", "auxiliary", "handle"]) if (typeof entry[key] === "string") allSlots.push(entry[key]);
}
if (allSlots.length !== 294 || new Set(allSlots).size !== 155) fail("the ten IPC batches must form 294 slots and 155 classes");

const macroNames = [...templates.values()].map((value) => value[0]).join("|");
const invocationPattern = new RegExp(`^(${macroNames}) (func_[0-9A-F]{8}), (.+)$`);
const invocations = new Map();
for (const line of source.split("\n")) {
  const match = invocationPattern.exec(line);
  if (match) invocations.set(match[2], [match[1], ...match[3].split(", ")]);
}
for (const [name, entry] of functions) {
  const definition = templates.get(entry.template);
  const wanted = [definition[0], ...definition[2].map((key) => entry[key])];
  if (invocations.get(name)?.join("\0") !== wanted.join("\0")) fail(`source invocation differs for ${name}`);
}
if (invocations.size !== 8 || (source.match(/^\.macro IPC_/gm) ?? []).length !== 8) fail("source must contain eight complete schedules");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are forbidden");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) if (!/^\s*\.word\s+\\(?:command|handle)$/.test(line)) fail("pool words must be named symbols");
if (/^\s*blx?\s+/m.test(source)) fail("direct calls are forbidden");

if (createHash("sha256").update(source).digest("hex") !== "8cbfffb4a7adf5a971efddd8e17bd3f6e050b771163d1406510dcaae5c53dd7c") fail("deterministic assembly schedules changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "bb6913e0c3427eb8909a90e520863dabcad3133d2ff459eccfe7eb7c4be2c1b1") fail("deterministic manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf must be provided together");
if (!objectPath) {
  console.log(`Validated deterministic source coverage and 294-slot/155-class IPC structure for 8 ARM functions (${bytes} bytes).`);
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
  if (!section || section.size !== entry.size + definition[2].length * 4 || !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${name}`);
  const symbol = symbols.get(name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size || symbol[0].type !== "FUNC" || symbol[0].binding !== "GLOBAL" || Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${name}`);
  const wanted = definition[2].map((key, index) => ({ offset: entry.size + index * 4, type: "R_ARM_ABS32", symbol: entry[key] }));
  const actual = relocations.get(sectionName) ?? [];
  if (actual.length !== wanted.length || wanted.some((value, index) => JSON.stringify(value) !== JSON.stringify(actual[index]))) fail(`invalid ordered relocations for ${name}`);
}
for (const identity of identities) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid identity ${identity}`);
}
console.log(`Validated 8 ARM IPC sections, symbols, no direct calls, and 10 ordered literal relocations (${bytes} bytes).`);
