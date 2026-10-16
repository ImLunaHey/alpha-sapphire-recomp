import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-26.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_26.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json", "arm-ipc-templates-16.json", "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json", "arm-ipc-templates-19.json", "arm-ipc-templates-20.json",
  "arm-ipc-templates-21.json", "arm-ipc-templates-22.json", "arm-ipc-templates-23.json",
  "arm-ipc-templates-24.json", "arm-ipc-templates-25.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");

function fail(message) { throw new Error(`ARM IPC template 26 validation failed: ${message}`); }

const templates = new Map([
  ["inline_entry_no_params", { size: 40, literals: [] }],
  ["inline_global_no_params", { size: 44, literals: ["handle"] }],
]);
const expected = new Map([
  ["func_00125E28", ["inline_entry_no_params", 23]],
  ["func_001644DC", ["inline_entry_no_params", 57]],
  ["func_00174748", ["inline_entry_no_params", 25]],
  ["func_0017A618", ["inline_entry_no_params", 12]],
  ["func_0017A640", ["inline_entry_no_params", 20]],
  ["func_002C5640", ["inline_entry_no_params", 8]],
  ["func_002C5744", ["inline_entry_no_params", 10]],
  ["func_001FB3DC", ["inline_global_no_params", 9, "ipc_handle_slot_epsilon"]],
  ["func_001FB550", ["inline_global_no_params", 3, "ipc_handle_slot_epsilon"]],
  ["func_00202894", ["inline_global_no_params", 17, "ipc_handle_slot_mu"]],
  ["func_002028C4", ["inline_global_no_params", 18, "ipc_handle_slot_mu"]],
  ["func_00202D78", ["inline_global_no_params", 5, "ipc_handle_slot_zeta"]],
  ["func_002C6348", ["inline_global_no_params", 44, "ipc_handle_slot_gamma"]],
  ["func_002C63B4", ["inline_global_no_params", 39, "ipc_handle_slot_gamma"]],
  ["func_002C6420", ["inline_global_no_params", 38, "ipc_handle_slot_gamma"]],
  ["func_002DE8C0", ["inline_global_no_params", 58, "ipc_handle_slot_beta"]],
  ["func_002DE9C8", ["inline_global_no_params", 57, "ipc_handle_slot_beta"]],
]);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_26.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 17) fail("unexpected manifest format or cardinality");
const functions = new Map();
const batchInlineOccurrences = [];
const batchSlots = [];
let bytes = 0;
for (const entry of manifest.functions) {
  const definition = templates.get(entry?.template);
  const wanted = expected.get(entry?.name);
  const inlineCommand = `ipc_inline_command_id_${wanted?.[1]}_no_params`;
  if (!definition || !wanted || entry.mode !== "arm" || entry.size !== definition.size || functions.has(entry.name) ||
      entry.template !== wanted[0] || entry.inlineCommand !== inlineCommand ||
      (definition.literals.length === 0 ? entry.handle !== undefined : entry.handle !== wanted[2])) {
    fail("invalid or duplicate function mapping");
  }
  const keys = ["name", "mode", "size", "template", "inlineCommand", ...definition.literals].sort().join(",");
  if (Object.keys(entry).sort().join(",") !== keys) fail(`unexpected fields for ${entry.name}`);
  functions.set(entry.name, entry);
  bytes += entry.size;
  batchInlineOccurrences.push(entry.inlineCommand);
  for (const key of definition.literals) batchSlots.push(entry[key]);
}
const inlineClasses = new Set(batchInlineOccurrences);
const handleCounts = new Map([...new Set(batchSlots)].map((identity) =>
  [identity, batchSlots.filter((value) => value === identity).length]));
const wantedHandleCounts = new Map([
  ["ipc_handle_slot_epsilon", 2], ["ipc_handle_slot_mu", 2], ["ipc_handle_slot_zeta", 1],
  ["ipc_handle_slot_gamma", 3], ["ipc_handle_slot_beta", 2],
]);
if (functions.size !== 17 || bytes !== 720 || batchSlots.length !== 10 || inlineClasses.size !== 16 ||
    batchInlineOccurrences.filter((identity) => identity === "ipc_inline_command_id_57_no_params").length !== 2 ||
    JSON.stringify([...handleCounts]) !== JSON.stringify([...wantedHandleCounts])) {
  fail("batch totals must be 17 functions, 720 bytes, 10 reused slots in five classes, and 17 inline occurrences in 16 classes");
}

const allSlots = [];
const priorInline = new Set();
for (const path of priorManifestPaths) {
  const prior = JSON.parse(readFileSync(path, "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") allSlots.push(entry[key]);
    }
    if (typeof entry.inlineCommand === "string") priorInline.add(entry.inlineCommand);
  }
}
allSlots.push(...batchSlots);
if (allSlots.length !== 337 || new Set(allSlots).size !== 177) fail("the fourteen IPC batches must form 337 slots and 177 classes");
for (const identity of inlineClasses) {
  const isEstablished = identity === "ipc_inline_command_id_3_no_params" || identity === "ipc_inline_command_id_10_no_params";
  if (priorInline.has(identity) !== isEstablished) fail(`unexpected prior inline-command identity status for ${identity}`);
}

function canonical(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
}
function expectedBody(name, template, command) {
  if (template === "inline_entry_no_params") return canonical(`
    push {r4,lr}
    mrc p15,0,r4,c13,c0,3
    mov r1,#(${command} << 16)
    str r1,[r4,#128]!
    ldr r0,[r0]
    svc #50
    and r1,r0,#0x80000000
    cmp r1,#0
    ldrge r0,[r4,#4]
    pop {r4,pc}`);
  return canonical(`
    push {r4,lr}
    mrc p15,0,r4,c13,c0,3
    mov r0,#(${command} << 16)
    str r0,[r4,#128]!
    ldr r0,.Lhandle_${name}
    ldr r0,[r0]
    svc #50
    and r1,r0,#0x80000000
    cmp r1,#0
    ldrge r0,[r4,#4]
    pop {r4,pc}`);
}
for (const [name, [template, command]] of expected) {
  const marker = `IPC_BEGIN ${name}\n`;
  const start = source.indexOf(marker);
  const remainder = source.slice(start + marker.length);
  const end = remainder.search(/^IPC_END_(?:ENTRY|HANDLE) /m);
  if (start < 0 || end < 0 || canonical(remainder.slice(0, end)) !== expectedBody(name, template, command)) {
    fail(`complete mnemonic schedule differs for ${name}`);
  }
}
if ((source.match(/^IPC_BEGIN (func_[0-9A-F]{8})$/gm) ?? []).length !== 17 ||
    (source.match(/^IPC_END_ENTRY /gm) ?? []).length !== 7 ||
    (source.match(/^IPC_END_HANDLE /gm) ?? []).length !== 10) fail("body and pool boundaries differ");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are forbidden");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\handle$/.test(line)) fail("pool words must use the named handle symbol");
}
if (/^\s*blx?\s+/m.test(source)) fail("direct calls are forbidden");
if ((source.match(/^\s*svc #50$/gm) ?? []).length !== 17) fail("each schedule must issue SendSyncRequest exactly once");
if (createHash("sha256").update(source).digest("hex") !== "602b0cdfa685d82bece1f72de0bba68620c2e120eb192334cf56a4556bcf4302") fail("deterministic assembly schedules changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "8e20296fc742e774d331b21894f68bc88769dd5fa8150ca1f88733249dbfbaed") fail("deterministic manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf must be provided together");
if (!objectPath) {
  console.log(`Validated deterministic source coverage and 337-slot/177-class IPC structure for 17 ARM functions (${bytes} bytes).`);
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
for (const [name, entry] of functions) {
  const definition = templates.get(entry.template);
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (!section || section.size !== entry.size + definition.literals.length * 4 || !section.flags.includes("A") ||
      !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${name}`);
  const symbol = symbols.get(name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size || symbol[0].type !== "FUNC" ||
      symbol[0].binding !== "GLOBAL" || Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${name}`);
  const wanted = definition.literals.map((key, index) => ({ offset: entry.size + index * 4, type: "R_ARM_ABS32", symbol: entry[key] }));
  const actual = relocations.get(sectionName) ?? [];
  if (actual.length !== wanted.length || wanted.some((value, index) => JSON.stringify(value) !== JSON.stringify(actual[index]))) {
    fail(`invalid ordered relocations for ${name}`);
  }
}
for (const identity of wantedHandleCounts.keys()) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" ||
      symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid identity ${identity}`);
}
console.log(`Validated 17 ARM IPC sections, symbols, no direct calls, and 10 ordered literal relocations (${bytes} bytes).`);
