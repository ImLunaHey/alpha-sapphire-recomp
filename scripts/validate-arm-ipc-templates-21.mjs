import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-21.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_21.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json", "arm-ipc-templates-16.json", "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json", "arm-ipc-templates-19.json", "arm-ipc-templates-20.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");

function fail(message) { throw new Error(`ARM IPC template 21 validation failed: ${message}`); }

const templates = new Map([
  ["four_word_two_outputs_static", ["IPC_FOUR_WORD_TWO_OUTPUTS_STATIC", 160, ["command"]]],
  ["eleven_word_two_static", ["IPC_ELEVEN_WORD_TWO_STATIC", 156, ["command"]]],
  ["structured_mapped", ["IPC_STRUCTURED_MAPPED", 144, ["command"]]],
  ["four_mixed_outputs_static", ["IPC_FOUR_MIXED_OUTPUTS_STATIC", 136, ["command"]]],
  ["scaled_static_buffer", ["IPC_SCALED_STATIC_BUFFER", 136, ["command"]]],
  ["global_struct_mixed", ["IPC_GLOBAL_STRUCT_MIXED", 136, ["command", "handle"]]],
  ["dual_static_output", ["IPC_DUAL_STATIC_OUTPUT", 128, ["command"]]],
  ["static_mapped_output", ["IPC_STATIC_MAPPED_OUTPUT", 128, ["command"]]],
  ["mapped_preserved_static", ["IPC_MAPPED_PRESERVED_STATIC", 128, ["command"]]],
  ["global_helper_structure", ["IPC_GLOBAL_HELPER_STRUCTURE", 124, ["command", "handle"], "call"]],
  ["static_two_outputs", ["IPC_STATIC_TWO_OUTPUTS", 120, ["command"]]],
  ["mapped_static_output", ["IPC_MAPPED_STATIC_OUTPUT", 120, ["command"]]],
]);
const expected = new Map([
  ["func_002E3F94", ["four_word_two_outputs_static", "ipc_command_func_001FFA8C"]],
  ["func_001325A4", ["eleven_word_two_static", "ipc_command_func_001325A4"]],
  ["func_002C5B84", ["structured_mapped", "ipc_command_func_002C5B84"]],
  ["func_001F6F40", ["four_mixed_outputs_static", "ipc_command_func_001F6F40"]],
  ["func_002E4110", ["scaled_static_buffer", "ipc_command_func_002E4110"]],
  ["func_002E6BA0", ["global_struct_mixed", "ipc_command_func_002E6BA0", "ipc_handle_slot_lambda"]],
  ["func_002E3F10", ["dual_static_output", "ipc_command_func_002E3F10"]],
  ["func_002E422C", ["static_mapped_output", "ipc_command_func_002E422C"]],
  ["func_002E435C", ["mapped_preserved_static", "ipc_command_func_002E435C"]],
  ["func_002E6A88", ["global_helper_structure", "ipc_command_func_002E6A88", "ipc_handle_slot_lambda", "func_0016C090"]],
  ["func_00174770", ["static_two_outputs", "ipc_command_func_00174770"]],
  ["func_00194D78", ["mapped_static_output", "ipc_command_func_002C9190"]],
]);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_21.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 12) fail("unexpected manifest format or cardinality");
const functions = new Map();
const identities = new Set();
let bytes = 0;
let slots = 0;
for (const entry of manifest.functions) {
  const definition = templates.get(entry?.template);
  const wanted = expected.get(entry?.name);
  if (!definition || !wanted || entry.mode !== "arm" || entry.size !== definition[1] || functions.has(entry.name) ||
      entry.template !== wanted[0] || definition[2].some((key, index) => entry[key] !== wanted[index + 1]) ||
      (definition[3] === "call" ? entry.call !== wanted[3] : entry.call !== undefined)) fail("invalid or duplicate function mapping");
  const keys = ["name", "mode", "size", "template", ...definition[2], ...(definition[3] ? [definition[3]] : [])].sort().join(",");
  if (Object.keys(entry).sort().join(",") !== keys) fail(`unexpected fields for ${entry.name}`);
  functions.set(entry.name, entry);
  bytes += entry.size;
  slots += definition[2].length;
  for (const key of definition[2]) identities.add(entry[key]);
}
if (functions.size !== 12 || bytes !== 1616 || slots !== 14 || identities.size !== 13) fail("batch totals must be 12 functions, 1,616 bytes, 14 slots, and 13 classes");

const allSlots = [];
for (const path of [...priorManifestPaths, manifestPath]) {
  const prior = JSON.parse(readFileSync(path, "utf8"));
  for (const entry of prior.functions) for (const key of ["command", "auxiliary", "handle"]) if (typeof entry[key] === "string") allSlots.push(entry[key]);
}
if (allSlots.length !== 284 || new Set(allSlots).size !== 147) fail("the nine IPC batches must form 284 slots and 147 classes");

const macroNames = [...templates.values()].map((value) => value[0]).join("|");
const invocationPattern = new RegExp(`^(${macroNames}) (func_[0-9A-F]{8}), (.+)$`);
const invocations = new Map();
for (const line of source.split("\n")) {
  const match = invocationPattern.exec(line);
  if (match) invocations.set(match[2], [match[1], ...match[3].split(", ")]);
}
for (const [name, entry] of functions) {
  const definition = templates.get(entry.template);
  const wanted = [definition[0], ...definition[2].map((key) => entry[key]), ...(definition[3] ? [entry.call] : [])];
  if (invocations.get(name)?.join("\0") !== wanted.join("\0")) fail(`source invocation differs for ${name}`);
}
if (invocations.size !== 12 || (source.match(/^\.macro IPC_/gm) ?? []).length !== 12) fail("source must contain 12 complete schedules");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are forbidden");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) if (!/^\s*\.word\s+\\(?:command|handle)$/.test(line)) fail("pool words must be named symbols");
if ((source.match(/^\s*bl \\helper$/gm) ?? []).length !== 1) fail("the helper schedule must contain one direct call");

if (createHash("sha256").update(source).digest("hex") !== "21c29af29396c9b9cd22ef6728db5f55b7be9aa36aeb6799386810bebecaaf21") fail("deterministic assembly schedules changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "84686ce9bff589dfc4e773c6ab4a4a276179878d8556c5447553b0e5a66a29b8") fail("deterministic manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf must be provided together");
if (!objectPath) {
  console.log(`Validated deterministic source coverage and 284-slot/147-class IPC structure for 12 ARM functions (${bytes} bytes).`);
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
  const wanted = [...(definition[3] ? [{ offset: 60, type: "R_ARM_CALL", symbol: entry.call }] : []), ...definition[2].map((key, index) => ({ offset: entry.size + index * 4, type: "R_ARM_ABS32", symbol: entry[key] }))];
  const actual = relocations.get(sectionName) ?? [];
  if (actual.length !== wanted.length || wanted.some((value, index) => JSON.stringify(value) !== JSON.stringify(actual[index]))) fail(`invalid ordered relocations for ${name}`);
}
for (const identity of identities) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid identity ${identity}`);
}
console.log(`Validated 12 ARM IPC sections, symbols, one direct call, and ordered literal relocations (${bytes} bytes).`);
