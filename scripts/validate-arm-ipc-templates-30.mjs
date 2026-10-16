import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-30.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_30.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 30 validation failed: ${message}`);
}

const expected = [
  ["func_001F736C", 76, ["ipc_command_func_001F736C"]],
  ["func_001F74B0", 84, ["ipc_command_func_001F74B0"]],
  ["func_001F75B4", 72, ["ipc_command_func_001F75B4"]],
  ["func_001F7668", 84, ["ipc_command_func_001F7668"]],
  ["func_001F774C", 72, ["ipc_command_func_001F774C"]],
  ["func_001F7868", 80, ["ipc_command_func_001F7868"]],
  ["func_001FB478", 76, ["ipc_command_func_001FB478", "ipc_handle_slot_epsilon"]],
  ["func_001FB5B8", 80, ["ipc_command_func_001FB5B8", "ipc_handle_slot_epsilon"]],
  ["func_001FB6AC", 68, ["ipc_command_func_002C576C", "ipc_handle_slot_epsilon"]],
  ["func_001FF934", 72, ["ipc_command_func_00132E48", "ipc_handle_slot_eta"]],
  ["func_00202DA8", 76, ["ipc_command_func_00202DA8", "ipc_handle_slot_zeta"]],
  ["func_002C55EC", 76, ["ipc_command_func_002C55EC", "ipc_aux_func_002C59AC_word1"]],
  ["func_002C57CC", 76, ["ipc_command_func_002C6624"]],
  ["func_002C5860", 80, [], "ipc_inline_command_id_11_no_params"],
  ["func_002C5924", 68, ["ipc_command_func_002DE78C"]],
  ["func_002C5A54", 72, ["ipc_command_func_002C5A54"]],
  ["func_002C5B14", 68, ["ipc_command_func_00126A20"]],
  ["func_002C94A8", 88, ["ipc_command_func_002C94A8"]],
  ["func_002CCCA4", 84, ["ipc_command_func_00118594"]],
  ["func_002DE588", 76, ["ipc_command_func_00126740", "ipc_handle_slot_beta"]],
  ["func_002DEA80", 76, ["ipc_command_func_002DEA80", "ipc_handle_slot_beta"]],
  ["func_002DEAD4", 80, ["ipc_command_func_002DEAD4", "ipc_handle_slot_beta"]],
  ["func_002DEDB0", 68, ["ipc_command_func_002C63E4", "ipc_handle_slot_beta"]],
  ["func_002E6918", 72, ["ipc_aux_func_001F16F8_static_descriptor", "ipc_handle_slot_lambda"], "ipc_inline_command_id_51_no_params"],
  ["func_002E6968", 88, ["ipc_command_func_002E6968", "ipc_aux_func_002E6968_static_descriptor", "ipc_handle_slot_lambda"]],
];
const newCommands = {
  ipc_command_func_001F736C: [2121, 1, 0], ipc_command_func_001F74B0: [2159, 1, 0],
  ipc_command_func_001F75B4: [2049, 4, 0], ipc_command_func_001F7668: [2050, 3, 2],
  ipc_command_func_001F774C: [3073, 4, 0], ipc_command_func_001F7868: [2049, 1, 2],
  ipc_command_func_001FB478: [7, 11, 0], ipc_command_func_001FB5B8: [24, 6, 2],
  ipc_command_func_00202DA8: [3, 5, 0], ipc_command_func_002C55EC: [29, 1, 4],
  ipc_command_func_002C5A54: [18, 4, 0], ipc_command_func_002C94A8: [1046, 5, 2],
  ipc_command_func_002DEA80: [11, 4, 0],
  ipc_command_func_002DEAD4: [9, 4, 0], ipc_command_func_002E6968: [52, 1, 6],
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_30.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1912 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 25 ||
    JSON.stringify(manifest.newAuxiliaryIdentities) !== JSON.stringify(["ipc_aux_func_002E6968_static_descriptor"]) ||
    JSON.stringify(manifest.newHandleIdentities) !== JSON.stringify([]) ||
    JSON.stringify(manifest.newInlineIdentities) !== JSON.stringify(["ipc_inline_command_id_51_no_params"])) {
  fail("unexpected manifest schema, totals, or new identity contract");
}

let bodyBytes = 0;
const batchSlots = [];
const batchInline = [];
for (let index = 0; index < expected.length; index++) {
  const [name, size, identities, inline] = expected[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry?.size !== size || typeof entry.template !== "string") {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  const actualIdentities = [entry.command, entry.auxiliary, entry.staticDescriptor, entry.handle]
    .filter((value) => typeof value === "string");
  if (JSON.stringify(actualIdentities) !== JSON.stringify(identities) || entry.inlineCommand !== inline) {
    fail(`invalid identity mapping for ${name}`);
  }
  bodyBytes += size;
  batchSlots.push(...identities);
  if (inline !== undefined) batchInline.push(inline);
}
if (bodyBytes !== 1912 || batchSlots.length !== 37 || new Set(batchSlots).size !== 31 ||
    JSON.stringify(batchInline) !== JSON.stringify([
      "ipc_inline_command_id_11_no_params", "ipc_inline_command_id_51_no_params"])) {
  fail("batch byte, slot, class, or inline cardinality differs");
}

const actualNewCommands = Object.fromEntries(Object.entries(manifest.newCommandIdentities ?? {}).map(
  ([name, value]) => [name, [value.commandId, value.normalWords, value.translatedWords]]));
if (JSON.stringify(actualNewCommands) !== JSON.stringify(newCommands)) fail("new command identity ledger differs");

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 15 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
];
const priorSlots = [];
const priorInline = new Set();
for (const name of priorNames) {
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") priorSlots.push(entry[key]);
    }
    if (typeof entry.inlineCommand === "string") priorInline.add(entry.inlineCommand);
  }
}
const allSlots = [...priorSlots, ...batchSlots];
if (allSlots.length !== 468 || new Set(allSlots).size !== 232) {
  fail("IPC batches 12, 13, and 15 through 30 must form 468 slots in 232 classes");
}
const newPoolIdentities = [...Object.keys(newCommands), "ipc_aux_func_002E6968_static_descriptor"];
if (newPoolIdentities.some((identity) => priorSlots.includes(identity)) ||
    !priorInline.has("ipc_inline_command_id_11_no_params") ||
    priorInline.has("ipc_inline_command_id_51_no_params")) {
  fail("new/reused pool or inline identity ledger differs");
}

if ((source.match(/^B func_[0-9A-F]{8}$/gm) ?? []).length !== 25 ||
    (source.match(/^EP1 func_/gm) ?? []).length !== 12 ||
    (source.match(/^EP2 func_/gm) ?? []).length !== 11 ||
    (source.match(/^EP3 func_/gm) ?? []).length !== 1 ||
    (source.match(/^E func_/gm) ?? []).length !== 1 ||
    (source.match(/^svc #50$/gm) ?? []).length !== 25) {
  fail("function, pool, or SVC counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\p(?:0|1|2)?$/.test(line)) fail("pool words must use named symbolic identities");
}
if ((source.match(/^blx?\s+/gm) ?? []).length !== 0) fail("direct calls are forbidden");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "e0fcaa5df44b4a8f2e74e549de4b8c6c3251d5c2bac01be6fd4196198c52af32") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "d64b205bda80e2f1f320e97238f4c69e16851ddb881730daa3b9d46e1618bc19") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-30.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 468-slot/232-class IPC structure for 25 ARM functions (1,912 bytes).");
  process.exit(0);
}
const [objectPath, readelf] = args;
function inspect(toolArgs) {
  const result = spawnSync(readelf, toolArgs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`readelf exited ${result.status}`);
  return result.stdout;
}
const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const sections = new Map();
for (const match of sectionOutput.matchAll(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm)) {
  sections.set(match[2], { index: Number(match[1]), size: Number.parseInt(match[4], 16), flags: match[5], alignment: Number(match[6]) });
}
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
  if (match && relocatedSection) {
    const entries = relocations.get(relocatedSection) ?? [];
    entries.push({ offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] });
    relocations.set(relocatedSection, entries);
  }
}
for (const [name, size, identities] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (!section || section.size !== size + identities.length * 4 || !section.flags.includes("A") ||
      !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${name}`);
  const symbol = symbols.get(name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== size || symbol[0].type !== "FUNC" ||
      symbol[0].binding !== "GLOBAL" || Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${name}`);
  const wanted = identities.map((identity, index) =>
    ({ offset: size + index * 4, type: "R_ARM_ABS32", symbol: identity }));
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${name}`);
  }
}
for (const identity of new Set(batchSlots)) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" ||
      symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid symbolic identity ${identity}`);
}
console.log("Validated 25 ARM IPC sections, symbols, and 37 ordered literal relocations (1,912 bytes).");
