import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-27.json");
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const sourcePath = join(root, "src", "main", "arm_ipc_templates_27.S");
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(`ARM IPC template 27 validation failed: ${message}`);
}

const expected = [
  ["func_0010F828", 56, "inline_global_word3", 2, "handle", "ipc_handle_slot_delta"],
  ["func_00118C94", 56, "inline_global_byte2", 2, "handle", "ipc_handle_slot_nu"],
  ["func_00119F20", 56, "inline_global_word2", 11, "handle", "ipc_handle_slot_delta"],
  ["func_0012696C", 56, "inline_global_byte2", 60, "handle", "ipc_handle_slot_beta"],
  ["func_001269E4", 56, "inline_global_byte2", 59, "handle", "ipc_handle_slot_beta"],
  ["func_00174848", 56, "inline_global_byte2", 1, "handle", "ipc_handle_slot_lambda"],
  ["func_001F7630", 52, "literal_entry_word3", 2060, "command", "ipc_command_func_001F7630"],
  ["func_001F7798", 52, "literal_entry_words2_3", 2052, "command", "ipc_command_func_001F7800"],
  ["func_001FB40C", 56, "inline_global_word3", 11, "handle", "ipc_handle_slot_epsilon"],
  ["func_001FB514", 56, "inline_global_word3", 10, "handle", "ipc_handle_slot_epsilon"],
  ["func_001FB670", 56, "inline_global_word3", 12, "handle", "ipc_handle_slot_epsilon"],
  ["func_00202CF8", 56, "inline_global_byte2", 6, "handle", "ipc_handle_slot_zeta"],
  ["func_002030EC", 56, "inline_global_word2", 3, "handle", "ipc_handle_slot_xi"],
  ["func_002C5514", 52, "inline_entry_byte2", 26],
  ["func_002C5A20", 52, "inline_entry_halfword2", 35],
  ["func_002C6480", 56, "inline_global_byte2", 40, "handle", "ipc_handle_slot_gamma"],
  ["func_002C6534", 56, "inline_global_word3", 15, "handle", "ipc_handle_slot_gamma"],
  ["func_002C6570", 56, "inline_global_byte2", 25, "handle", "ipc_handle_slot_gamma"],
  ["func_002C65AC", 56, "inline_global_byte2", 20, "handle", "ipc_handle_slot_gamma"],
  ["func_002DED74", 56, "inline_global_byte2", 54, "handle", "ipc_handle_slot_beta"],
  ["func_002E24B4", 52, "inline_entry_word2", 6],
  ["func_002E4424", 52, "inline_entry_word2", 22],
];
const expectedNewIdentities = {
  ipc_handle_slot_nu: { minimumAlignment: 4, storage: "writable-initialized", equality: "distinct" },
  ipc_handle_slot_xi: { minimumAlignment: 4, storage: "writable-initialized", equality: "distinct" },
  ipc_command_func_001F7630: { commandId: 2060, normalWords: 0, translatedWords: 0, equality: "distinct" },
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_27.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1208 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expected.length ||
    JSON.stringify(manifest.newSymbolicIdentities) !== JSON.stringify(expectedNewIdentities)) {
  fail("unexpected manifest schema, totals, or new identity contracts");
}
const functions = new Map();
const batchSlots = [];
const inlineOccurrences = [];
let totalBytes = 0;
for (let index = 0; index < expected.length; index++) {
  const [name, size, template, commandId, poolKind, poolIdentity] = expected[index];
  const entry = manifest.functions[index];
  const inline = template.startsWith("inline_");
  const wanted = {
    name, size, template,
    ...(inline ? { inlineCommand: `ipc_inline_command_id_${commandId}_no_params` } : {}),
    ...(poolKind ? { [poolKind]: poolIdentity } : {}),
  };
  if (JSON.stringify(entry) !== JSON.stringify(wanted) || functions.has(name)) {
    fail(`invalid or duplicate function mapping for ${name}`);
  }
  functions.set(name, entry);
  totalBytes += size;
  if (inline) inlineOccurrences.push(entry.inlineCommand);
  if (poolIdentity) batchSlots.push(poolIdentity);
}
if (totalBytes !== 1208 || batchSlots.length !== 18 || inlineOccurrences.length !== 20 ||
    new Set(inlineOccurrences).size !== 17) fail("batch cardinalities differ");
const wantedSlotCounts = new Map([
  ["ipc_handle_slot_delta", 2], ["ipc_handle_slot_nu", 1], ["ipc_handle_slot_beta", 3],
  ["ipc_handle_slot_lambda", 1], ["ipc_command_func_001F7630", 1],
  ["ipc_command_func_001F7800", 1], ["ipc_handle_slot_epsilon", 3],
  ["ipc_handle_slot_zeta", 1], ["ipc_handle_slot_xi", 1], ["ipc_handle_slot_gamma", 4],
]);
const actualSlotCounts = new Map([...new Set(batchSlots)].map((identity) =>
  [identity, batchSlots.filter((value) => value === identity).length]));
if (JSON.stringify([...actualSlotCounts]) !== JSON.stringify([...wantedSlotCounts])) fail("literal identity ledger differs");
for (const id of [2, 6, 11]) {
  if (inlineOccurrences.filter((value) => value === `ipc_inline_command_id_${id}_no_params`).length !== 2) {
    fail(`inline ID ${id} must occur twice`);
  }
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 12 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (allSlots.length !== 355 || new Set(allSlots).size !== 180) {
  fail("IPC batches 12, 13, and 15 through 27 must form 355 slots in 180 classes");
}
const establishedInlineIds = new Set([2, 3, 10, 12, 20, 22, 25]);
for (const identity of new Set(inlineOccurrences)) {
  const id = Number(identity.match(/id_(\d+)_/)[1]);
  if (priorInline.has(identity) !== establishedInlineIds.has(id)) {
    fail(`unexpected prior inline-command status for ID ${id}`);
  }
}

function canonical(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
}
function outputInstructions(template) {
  if (template.endsWith("byte2")) return ["ldrb r0,[r4,#8]", "strb r0,[r5]"];
  if (template.endsWith("halfword2")) return ["ldrh r0,[r4,#8]", "strh r0,[r5]"];
  if (template.endsWith("word2")) return ["ldr r0,[r4,#8]", "str r0,[r5]"];
  if (template.endsWith("word3")) return ["ldr r0,[r4,#12]", "str r0,[r5]"];
  if (template.endsWith("words2_3")) return ["ldrd r0,[r4,#8]", "strd r0,[r5]"];
  fail(`unknown output template ${template}`);
}
function expectedBlock(tuple) {
  const [name, , template, commandId, poolKind, poolIdentity] = tuple;
  const suffix = name.slice("func_".length);
  const globalHandle = template.startsWith("inline_global_");
  const literalHeader = template.startsWith("literal_");
  const lines = [
    `B ${name}`, "push {r4,r5,r6,lr}", `mov r5,${globalHandle ? "r0" : "r1"}`,
    "mrc p15,0,r4,c13,c0,3",
  ];
  if (literalHeader) lines.push(`ldr r1,.Lpool_${name}`);
  else lines.push(`mov ${globalHandle ? "r0" : "r1"},#(${commandId} << 16)`);
  lines.push(`str ${globalHandle ? "r0" : "r1"},[r4,#128]!`);
  if (globalHandle) lines.push(`ldr r0,.Lpool_${name}`, "ldr r0,[r0]");
  else lines.push("ldr r0,[r0]");
  lines.push("svc #50", "ands r1,r0,#0x80000000", `bmi .Lret_${suffix}`,
    ...outputInstructions(template), "ldr r0,[r4,#4]", `.Lret_${suffix}:`,
    "pop {r4,r5,r6,pc}", poolKind ? `EP ${name},${poolIdentity}` : `E ${name}`);
  return lines.join("\n");
}
for (let index = 0; index < expected.length; index++) {
  const name = expected[index][0];
  const start = source.indexOf(`B ${name}\n`);
  const nextName = expected[index + 1]?.[0];
  const end = nextName ? source.indexOf(`B ${nextName}\n`, start) : source.length;
  if (start < 0 || end < 0 || canonical(source.slice(start, end)) !== canonical(expectedBlock(expected[index]))) {
    fail(`complete mnemonic schedule or body/pool boundary differs for ${name}`);
  }
}
if ((source.match(/^B func_[0-9A-F]{8}$/gm) ?? []).length !== 22 ||
    (source.match(/^EP func_/gm) ?? []).length !== 18 || (source.match(/^E func_/gm) ?? []).length !== 4 ||
    (source.match(/^svc #50$/gm) ?? []).length !== 22) fail("function, pool, or SVC counts differ");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are forbidden");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\p$/.test(line)) fail("pool words must use the named symbolic identity");
}
if (/^\s*blx?\s+/m.test(source)) fail("direct calls are forbidden");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "4311ade58296d22a5c693de9870e8f67423e1596c5f941a27792fbaf72a0016f") {
  fail("deterministic assembly schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "c339a2a22f5bbb1b699251aa8f536e922c285c85f69037a5398e8cde1c533bd6") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-27.mjs [base-object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 355-slot/180-class IPC structure for 22 ARM functions (1,208 bytes).");
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
for (const [name, size, , , poolKind, poolIdentity] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  const poolCount = poolKind ? 1 : 0;
  if (!section || section.size !== size + poolCount * 4 || !section.flags.includes("A") ||
      !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${name}`);
  const symbol = symbols.get(name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== size || symbol[0].type !== "FUNC" ||
      symbol[0].binding !== "GLOBAL" || Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${name}`);
  const wanted = poolKind ? [{ offset: size, type: "R_ARM_ABS32", symbol: poolIdentity }] : [];
  const actual = relocations.get(sectionName) ?? [];
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) fail(`invalid ordered relocations for ${name}`);
}
for (const identity of wantedSlotCounts.keys()) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" ||
      symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid symbolic identity ${identity}`);
}
console.log("Validated 22 ARM IPC sections, symbols, no direct calls, and 18 ordered literal relocations (1,208 bytes).");
