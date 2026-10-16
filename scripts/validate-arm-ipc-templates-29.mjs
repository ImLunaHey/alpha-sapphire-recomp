import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-29.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_29.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 29 validation failed: ${message}`);
}

const expected = [
  ["func_00110264", 72, ["ipc_command_func_00110264", "ipc_handle_slot_alpha"]],
  ["func_001102B4", 84, ["ipc_command_func_002C6378", "ipc_handle_slot_alpha"]],
  ["func_00110374", 68, ["ipc_command_func_00110374", "ipc_handle_slot_alpha"]],
  ["func_00118594", 60, ["ipc_command_func_00118594", "ipc_handle_slot_kappa"]],
  ["func_0011BA30", 72, ["ipc_aux_func_0011BA30_tls_descriptor", "ipc_handle_slot_lambda"], "ipc_inline_command_id_8_no_params"],
  ["func_00124838", 64, ["ipc_command_func_002C63E4", "ipc_handle_slot_nu"]],
  ["func_00124880", 72, ["ipc_command_func_001338B8", "ipc_handle_slot_nu"]],
  ["func_00124FE0", 56, [], "ipc_inline_command_id_1_32_normal", "func_00144D28", 28],
  ["func_00125584", 68, ["ipc_command_func_002C8F10", "ipc_handle_slot_omicron"]],
  ["func_001266B4", 68, ["ipc_handle_slot_alpha"], "ipc_inline_command_id_68_no_params"],
  ["func_00133918", 64, ["ipc_command_func_00133918"]],
  ["func_00133C10", 80, ["ipc_command_func_00133C10", "ipc_handle_slot_alpha"]],
  ["func_00133CBC", 84, ["ipc_command_func_00133CBC", "ipc_handle_slot_alpha"]],
  ["func_001342C8", 68, ["ipc_handle_slot_lambda"], "ipc_inline_command_id_5_no_params"],
  ["func_0015F308", 64, ["ipc_command_func_0015F308", "ipc_handle_slot_iota"]],
  ["func_0016FF3C", 68, ["ipc_command_func_0016FF3C", "ipc_handle_slot_iota"]],
  ["func_00174400", 80, [], "ipc_inline_command_id_24_no_params"],
  ["func_00174450", 76, ["ipc_command_func_00174450"]],
  ["func_001F1474", 76, ["ipc_command_func_001F1474", "ipc_aux_func_001F1474_static_descriptor", "ipc_handle_slot_iota"]],
  ["func_001F14CC", 84, ["ipc_command_func_001F14CC", "ipc_aux_func_001F16F8_static_descriptor", "ipc_handle_slot_iota"]],
  ["func_001F15DC", 68, ["ipc_command_func_001F15DC", "ipc_aux_func_001F1474_static_descriptor", "ipc_handle_slot_iota"]],
  ["func_001F709C", 84, ["ipc_command_func_001F709C"]],
  ["func_001F7164", 80, ["ipc_command_func_001F7164"]],
  ["func_001F7298", 88, ["ipc_command_func_001F7298"]],
];
const newCommands = {
  ipc_command_func_00110264: [2, 2, 0], ipc_command_func_00110374: [49, 4, 0],
  ipc_command_func_00118594: [2, 2, 2], ipc_command_func_00133918: [22, 1, 2],
  ipc_command_func_00133C10: [12, 4, 4], ipc_command_func_00133CBC: [15, 4, 0],
  ipc_command_func_0015F308: [8, 0, 4], ipc_command_func_0016FF3C: [62, 1, 2],
  ipc_command_func_00174450: [19, 1, 2], ipc_command_func_001F1474: [4, 0, 6],
  ipc_command_func_001F14CC: [36, 1, 2], ipc_command_func_001F15DC: [39, 0, 2],
  ipc_command_func_001F709C: [2124, 9, 2], ipc_command_func_001F7164: [2057, 6, 2],
  ipc_command_func_001F7298: [2129, 9, 2],
};
const newInline = ["ipc_inline_command_id_1_32_normal", "ipc_inline_command_id_68_no_params", "ipc_inline_command_id_24_no_params"];

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_29.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1748 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 24 ||
    JSON.stringify(manifest.newInlineIdentities) !== JSON.stringify(newInline) ||
    JSON.stringify(manifest.newAuxiliaryIdentities) !== JSON.stringify([
      "ipc_aux_func_0011BA30_tls_descriptor", "ipc_aux_func_001F1474_static_descriptor"]) ||
    JSON.stringify(manifest.newHandleIdentities) !== JSON.stringify(["ipc_handle_slot_omicron"])) {
  fail("unexpected manifest schema, totals, or new identity contract");
}

let bodyBytes = 0;
const batchSlots = [];
const batchInline = [];
for (let index = 0; index < expected.length; index++) {
  const [name, size, identities, inline, call] = expected[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry?.size !== size || typeof entry.template !== "string") {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  const actualIdentities = [entry.command, entry.auxiliary, entry.staticDescriptor, entry.handle]
    .filter((value) => typeof value === "string");
  if (JSON.stringify(actualIdentities) !== JSON.stringify(identities) ||
      entry.inlineCommand !== inline || entry.call !== call) {
    fail(`invalid identity or call mapping for ${name}`);
  }
  bodyBytes += size;
  batchSlots.push(...identities);
  if (inline !== undefined) batchInline.push(inline);
}
if (bodyBytes !== 1748 || batchSlots.length !== 40 || new Set(batchSlots).size !== 28 ||
    batchInline.length !== 5) fail("batch byte, slot, class, or inline cardinality differs");

const actualNewCommands = Object.fromEntries(Object.entries(manifest.newCommandIdentities ?? {}).map(
  ([name, value]) => [name, [value.commandId, value.normalWords, value.translatedWords]]));
if (JSON.stringify(actualNewCommands) !== JSON.stringify(newCommands)) fail("new command identity ledger differs");
if (expected.filter(([, , identities]) => identities.includes("ipc_handle_slot_omicron")).length !== 1 ||
    expected.filter(([, , identities]) => identities.includes("ipc_aux_func_001F1474_static_descriptor")).length !== 2) {
  fail("new handle or shared auxiliary identity cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 14 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
];
const allSlots = [];
const priorInline = new Set();
for (const name of priorNames) {
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") allSlots.push(entry[key]);
    }
    if (typeof entry.inlineCommand === "string") priorInline.add(entry.inlineCommand);
  }
}
allSlots.push(...batchSlots);
if (allSlots.length !== 431 || new Set(allSlots).size !== 216) {
  fail("IPC batches 12, 13, and 15 through 29 must form 431 slots in 216 classes");
}
if (!priorInline.has("ipc_inline_command_id_8_no_params") ||
    !priorInline.has("ipc_inline_command_id_5_no_params") ||
    newInline.some((identity) => priorInline.has(identity))) fail("inline command identity reuse ledger differs");

if ((source.match(/^B func_[0-9A-F]{8}$/gm) ?? []).length !== 24 ||
    (source.match(/^EP1 func_/gm) ?? []).length !== 7 ||
    (source.match(/^EP2 func_/gm) ?? []).length !== 12 ||
    (source.match(/^EP3 func_/gm) ?? []).length !== 3 ||
    (source.match(/^E func_/gm) ?? []).length !== 2 ||
    (source.match(/^svc #50$/gm) ?? []).length !== 24 ||
    (source.match(/^mov r0,r0$/gm) ?? []).length !== 2) {
  fail("function, pool, SVC, or historical no-op counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\p(?:0|1|2)?$/.test(line)) fail("pool words must use named symbolic identities");
}
if ((source.match(/^bl func_00144D28$/gm) ?? []).length !== 1 ||
    (source.match(/^blx?\s+/gm) ?? []).length !== 1) fail("exactly one named direct call is required");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "ab9299730a2b605a2cf7454b8c29ef49ca268ed1e28852a8eb20ae79a8a7aab1") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "626360c8d9aec996f373110204096ece36b0613e153215db4e06a64d085964d0") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-29.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 431-slot/216-class IPC structure for 24 ARM functions (1,748 bytes).");
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
for (const [name, size, identities, , call, callOffset] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (!section || section.size !== size + identities.length * 4 || !section.flags.includes("A") ||
      !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${name}`);
  const symbol = symbols.get(name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== size || symbol[0].type !== "FUNC" ||
      symbol[0].binding !== "GLOBAL" || Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${name}`);
  const wanted = [
    ...(call ? [{ offset: callOffset, type: "R_ARM_CALL", symbol: call }] : []),
    ...identities.map((identity, index) => ({ offset: size + index * 4, type: "R_ARM_ABS32", symbol: identity })),
  ];
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${name}`);
  }
}
for (const identity of new Set(batchSlots)) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" ||
      symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid symbolic identity ${identity}`);
}
console.log("Validated 24 ARM IPC sections, symbols, one named call, and 40 ordered literal relocations (1,748 bytes).");
