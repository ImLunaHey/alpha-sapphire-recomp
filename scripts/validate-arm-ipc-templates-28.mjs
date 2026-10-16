import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-28.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_28.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 28 validation failed: ${message}`);
}

const expected = [
  ["func_00118300", 48, ["ipc_command_func_00118300"]],
  ["func_001190E0", 52, ["ipc_command_func_001190E0", "ipc_handle_slot_xi"]],
  ["func_00125E50", 52, ["ipc_command_func_00126808"]],
  ["func_00126600", 48, ["ipc_command_func_00126600", "ipc_handle_slot_alpha"]],
  ["func_001266FC", 60, ["ipc_command_func_001266FC", "ipc_handle_slot_alpha"]],
  ["func_001338B8", 52, ["ipc_command_func_001338B8"]],
  ["func_00145FC0", 60, ["ipc_handle_slot_nu"], "ipc_inline_command_id_4_no_params"],
  ["func_00160844", 56, ["ipc_command_func_00160844"]],
  ["func_001709BC", 56, ["ipc_command_func_001709BC"]],
  ["func_00170C80", 56, ["ipc_command_func_00170C80", "ipc_handle_slot_xi"]],
  ["func_001F6F04", 56, ["ipc_command_func_001F6F04"]],
  ["func_001F72F4", 56, ["ipc_command_func_001F72F4"]],
  ["func_001F7330", 56, ["ipc_command_func_001F7330"]],
  ["func_00202DFC", 60, ["ipc_command_func_00202DFC", "ipc_handle_slot_zeta"]],
  ["func_00202EC0", 60, ["ipc_handle_slot_zeta"], "ipc_inline_command_id_9_no_params"],
  ["func_00203128", 60, ["ipc_command_func_00202DFC", "ipc_handle_slot_xi"]],
  ["func_0020316C", 48, ["ipc_handle_slot_xi"], "ipc_inline_command_id_23_no_params"],
  ["func_002C35DC", 48, ["ipc_command_func_0010986C"]],
  ["func_002C55B4", 52, ["ipc_command_func_002C6104"]],
  ["func_002C581C", 64, ["ipc_command_func_002C581C"]],
  ["func_002C596C", 60, ["ipc_command_func_002C596C"]],
  ["func_002CCFD0", 64, ["ipc_command_func_002C8E54"]],
  ["func_002DD9FC", 60, ["ipc_command_func_002DD9FC", "ipc_handle_slot_alpha"]],
  ["func_002E419C", 64, ["ipc_command_func_002E419C"]],
  ["func_002E43E0", 64, ["ipc_command_func_002C90EC"]],
  ["func_002E68D4", 60, ["ipc_command_func_002E68D4", "ipc_handle_slot_lambda"]],
  ["func_002E6B0C", 60, ["ipc_command_func_002E6B0C", "ipc_handle_slot_lambda"]],
];
const newCommands = {
  ipc_command_func_00118300: [2158, 3, 0], ipc_command_func_001190E0: [20, 1, 0],
  ipc_command_func_00126600: [66, 2, 0], ipc_command_func_001266FC: [62, 2, 0],
  ipc_command_func_001338B8: [1, 2, 2], ipc_command_func_00160844: [21, 2, 2],
  ipc_command_func_001709BC: [12, 1, 0], ipc_command_func_00170C80: [2, 0, 2],
  ipc_command_func_001F6F04: [2066, 2, 0], ipc_command_func_001F72F4: [2130, 4, 0],
  ipc_command_func_001F7330: [2139, 2, 0], ipc_command_func_00202DFC: [1, 1, 2],
  ipc_command_func_002C581C: [16, 1, 2], ipc_command_func_002C596C: [7, 2, 0],
  ipc_command_func_002DD9FC: [77, 2, 0], ipc_command_func_002E419C: [11, 1, 2],
  ipc_command_func_002E68D4: [39, 1, 0], ipc_command_func_002E6B0C: [36, 1, 0],
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_28.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1532 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 27 ||
    JSON.stringify(manifest.newInlineIdentities) !== JSON.stringify(["ipc_inline_command_id_4_no_params"])) {
  fail("unexpected manifest schema, totals, or inline identity contract");
}
let bodyBytes = 0;
const batchSlots = [];
for (let index = 0; index < expected.length; index++) {
  const [name, size, identities, inline] = expected[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry?.size !== size || typeof entry.template !== "string") {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  const actualIdentities = [entry.command, entry.handle].filter((value) => typeof value === "string");
  if (JSON.stringify(actualIdentities) !== JSON.stringify(identities) || entry.inlineCommand !== inline) {
    fail(`invalid identity mapping for ${name}`);
  }
  bodyBytes += size;
  batchSlots.push(...identities);
}
if (bodyBytes !== 1532 || batchSlots.length !== 36 || new Set(batchSlots).size !== 28) {
  fail("batch byte, slot, or identity cardinality differs");
}
const actualNewCommands = Object.fromEntries(Object.entries(manifest.newCommandIdentities ?? {}).map(
  ([name, value]) => [name, [value.commandId, value.normalWords, value.translatedWords]]));
if (JSON.stringify(actualNewCommands) !== JSON.stringify(newCommands)) fail("new command identity ledger differs");
if (manifest.functions.filter((entry) => entry.command === "ipc_command_func_00202DFC").length !== 2) {
  fail("the new ID-1 command identity must be shared exactly twice");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 13 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (allSlots.length !== 391 || new Set(allSlots).size !== 198) {
  fail("IPC batches 12, 13, and 15 through 28 must form 391 slots in 198 classes");
}
if (priorInline.has("ipc_inline_command_id_4_no_params") ||
    !priorInline.has("ipc_inline_command_id_9_no_params") ||
    !priorInline.has("ipc_inline_command_id_23_no_params")) {
  fail("inline command identity reuse ledger differs");
}

if ((source.match(/^B func_[0-9A-F]{8}$/gm) ?? []).length !== 27 ||
    (source.match(/^EP1 func_/gm) ?? []).length !== 18 ||
    (source.match(/^EP2 func_/gm) ?? []).length !== 9 ||
    (source.match(/^svc #50$/gm) ?? []).length !== 27 ||
    (source.match(/^mov r0,r0$/gm) ?? []).length !== 6) {
  fail("function, pool, SVC, or historical no-op counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\p(?:0|1)?$/.test(line)) fail("pool words must use named symbolic identities");
}
if (/^\s*blx?\s+/m.test(source)) fail("direct calls are forbidden");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "44ba7c9302f92b7f6fb467d9f8b2821f7588011cbdc70289a7ef7fdb14387f51") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "7a615b78dc1ddf8a04c9c5dc53435b321ffcf3c4f967397dbc84b15106265da6") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-28.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 391-slot/198-class IPC structure for 27 ARM functions (1,532 bytes).");
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
  const wanted = identities.map((identity, index) => ({ offset: size + index * 4, type: "R_ARM_ABS32", symbol: identity }));
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${name}`);
  }
}
for (const identity of new Set(batchSlots)) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" ||
      symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid symbolic identity ${identity}`);
}
console.log("Validated 27 ARM IPC sections, symbols, no direct calls, and 36 ordered literal relocations (1,532 bytes).");
