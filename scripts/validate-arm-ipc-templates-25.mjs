import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-25.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_25.S");
const priorManifestPaths = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  "arm-ipc-templates-15.json", "arm-ipc-templates-16.json", "arm-ipc-templates-17.json",
  "arm-ipc-templates-18.json", "arm-ipc-templates-19.json", "arm-ipc-templates-20.json",
  "arm-ipc-templates-21.json", "arm-ipc-templates-22.json", "arm-ipc-templates-23.json",
  "arm-ipc-templates-24.json",
].map((name) => join(root, "config", name));
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const source = readFileSync(sourcePath, "utf8");

function fail(message) { throw new Error(`ARM IPC template 25 validation failed: ${message}`); }

const templates = new Map([
  ["entry_two_descriptor_pairs", { size: 92, literals: ["command"] }],
  ["entry_pair_output_descriptor", { size: 92, literals: ["command"] }],
  ["entry_counted_pair_output", { size: 92, literals: ["command"] }],
  ["inline_global_four_outputs", { size: 92, literals: ["handle"], inlineCommand: "ipc_inline_command_id_22_no_params" }],
  ["entry_byte_aux_descriptor", { size: 92, literals: ["command", "auxiliary"] }],
  ["temporary_static_output", { size: 92, literals: ["command"] }],
  ["temporary_static_output_compact", { size: 88, literals: ["command"] }],
  ["entry_nine_words_descriptor", { size: 88, literals: ["command"] }],
]);
const expected = new Map([
  ["func_00164EE4", ["entry_two_descriptor_pairs", "ipc_command_func_00164EE4"]],
  ["func_001F6E74", ["entry_pair_output_descriptor", "ipc_command_func_001F6E74"]],
  ["func_001F76EC", ["entry_counted_pair_output", "ipc_command_func_001F76EC"]],
  ["func_001FB610", ["inline_global_four_outputs", "ipc_handle_slot_epsilon"]],
  ["func_002C5668", ["entry_byte_aux_descriptor", "ipc_command_func_0016511C", "ipc_aux_func_002C59AC_word1"]],
  ["func_002C576C", ["temporary_static_output", "ipc_command_func_002C576C"]],
  ["func_001747EC", ["temporary_static_output_compact", "ipc_command_func_001747EC"]],
  ["func_001F6D38", ["entry_nine_words_descriptor", "ipc_command_func_001F6D38"]],
]);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_25.S" ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 8) fail("unexpected manifest format or cardinality");
const functions = new Map();
const batchIdentities = new Set();
const inlineIdentities = new Set();
let bytes = 0;
let slots = 0;
for (const entry of manifest.functions) {
  const definition = templates.get(entry?.template);
  const wanted = expected.get(entry?.name);
  if (!definition || !wanted || entry.mode !== "arm" || entry.size !== definition.size || functions.has(entry.name) ||
      entry.template !== wanted[0] || definition.literals.some((key, index) => entry[key] !== wanted[index + 1]) ||
      (definition.inlineCommand === undefined ? entry.inlineCommand !== undefined : entry.inlineCommand !== definition.inlineCommand)) {
    fail("invalid or duplicate function mapping");
  }
  const keys = ["name", "mode", "size", "template", ...definition.literals,
    ...(definition.inlineCommand ? ["inlineCommand"] : [])].sort().join(",");
  if (Object.keys(entry).sort().join(",") !== keys) fail(`unexpected fields for ${entry.name}`);
  functions.set(entry.name, entry);
  bytes += entry.size;
  slots += definition.literals.length;
  for (const key of definition.literals) batchIdentities.add(entry[key]);
  if (definition.inlineCommand) inlineIdentities.add(entry.inlineCommand);
}
if (functions.size !== 8 || bytes !== 728 || slots !== 9 || batchIdentities.size !== 9 ||
    inlineIdentities.size !== 1 || !inlineIdentities.has("ipc_inline_command_id_22_no_params")) {
  fail("batch totals must be 8 functions, 728 bytes, 9 slots, 9 represented identities, and one inline identity");
}

const allSlots = [];
for (const path of [...priorManifestPaths, manifestPath]) {
  const prior = JSON.parse(readFileSync(path, "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") allSlots.push(entry[key]);
    }
  }
}
if (allSlots.length !== 327 || new Set(allSlots).size !== 177) fail("the thirteen IPC batches must form 327 slots and 177 classes");

const expectedBodies = new Map([
  ["func_00164EE4", `push {r4,r5,r6,lr}\nldr r12,[sp,#16]\nmrc p15,0,r4,c13,c0,3\nldr r6,.Lcommand_func_00164EE4\nmov r5,#0\nstr r6,[r4,#128]!\nadd lr,r4,#4\nstm lr,{r1,r12}\norr r1,r5,r12,lsl #14\nadd r5,r4,#12\norr r1,r1,#2\nstm r5,{r1,r2}\nmov r1,#1024\norr r1,r1,r12,lsl #14\nadd r5,r4,#20\norr r1,r1,#2\nstm r5,{r1,r3}\nldr r0,[r0]\nsvc #50\nand r1,r0,#0x80000000\ncmp r1,#0\nldrge r0,[r4,#4]\npop {r4,r5,r6,pc}`],
  ["func_001F6E74", `push {r4,r5,r6,r7,r8,lr}\nmov r5,r1\nldr r1,[sp,#28]\nldr r12,[sp,#24]\nmrc p15,0,r4,c13,c0,3\nldr r7,.Lcommand_func_001F6E74\nmov r6,#0\nstr r7,[r4,#128]!\nstr r1,[r4,#12]\norr r1,r6,r1,lsl #14\nadd r6,r4,#16\norr r1,r1,#2\nstm r6,{r1,r12}\nstrd r2,[r4,#4]\nldr r0,[r0]\nsvc #50\nands r1,r0,#0x80000000\nbmi 1f\nadd r1,r4,#8\nldrd r0,[r1]\nstrd r0,[r5]\nldr r0,[r4,#4]\n1:\npop {r4,r5,r6,r7,r8,pc}`],
  ["func_001F76EC", `push {r4,r5,r6,r7,r8,lr}\nadd r4,sp,#28\nmov r5,r1\nldm r4,{r1,r6}\nldr r12,[sp,#24]\nmrc p15,0,r4,c13,c0,3\nldr r7,.Lcommand_func_001F76EC\nstr r7,[r4,#128]!\nadd r7,r4,#20\nstr r1,[r4,#12]\nstrd r2,[r4,#4]\nmov r2,#10\norr r1,r2,r1,lsl #4\nstr r6,[r4,#16]\nstm r7,{r1,r12}\nldr r0,[r0]\nsvc #50\nands r1,r0,#0x80000000\nbmi 1f\nldr r0,[r4,#8]\nstr r0,[r5]\nldr r0,[r4,#4]\n1:\npop {r4,r5,r6,r7,r8,pc}`],
  ["func_001FB610", `push {r4,r5,r6,r7,r8,lr}\nmov r5,r0\nmov r6,r1\nmov r7,r2\nmov r8,r3\nmrc p15,0,r4,c13,c0,3\nmov r0,#(22 << 16)\nstr r0,[r4,#128]!\nldr r0,.Lhandle_func_001FB610\nldr r0,[r0]\nsvc #50\nands r1,r0,#0x80000000\nbmi 1f\nldr r0,[r4,#8]\nstr r0,[r5]\nldr r0,[r4,#12]\nstr r0,[r6]\nldr r0,[r4,#16]\nstr r0,[r7]\nldr r0,[r4,#20]\nstr r0,[r8]\nldr r0,[r4,#4]\n1:\npop {r4,r5,r6,r7,r8,pc}`],
  ["func_002C5668", `push {r0,r1,r2,r3,r4,r5,r6,lr}\nldr r2,[sp,#32]\nmrc p15,0,r4,c13,c0,3\nldr r5,.Lcommand_func_002C5668\nmov r12,#0\nstr r5,[r4,#128]!\nldrb r5,[sp,#8]\nadd r6,r4,#8\nstrb r5,[r4,#4]\nldr r5,.Lauxiliary_func_002C5668\nstr r1,[r4,#16]\norr r1,r12,r2,lsl #14\nstm r6,{r2,r5}\nadd r5,r4,#20\norr r1,r1,#2\nstm r5,{r1,r3}\nldr r0,[r0]\nsvc #50\nand r1,r0,#0x80000000\ncmp r1,#0\nldrge r0,[r4,#4]\nadd sp,sp,#16\npop {r4,r5,r6,pc}`],
  ["func_002C576C", `push {r4,r5,r6,r7,r8,lr}\nmov r6,r2\nmrc p15,0,r5,c13,c0,3\nldr r12,.Lcommand_func_002C576C\nmov r2,#0\nstr r12,[r5,#128]!\nstr r3,[r5,#4]\nmrc p15,0,r12,c13,c0,3\nadd r4,r12,#384\norr r2,r2,r3,lsl #14\nldm r4,{r7,r8}\norr r2,r2,#2\nstr r2,[r12,#384]!\nstr r1,[r12,#4]\nldr r0,[r0]\nsvc #50\nstm r4,{r7,r8}\nands r1,r0,#0x80000000\nbmi 1f\nldr r0,[r5,#8]\nstr r0,[r6]\nldr r0,[r5,#4]\n1:\npop {r4,r5,r6,r7,r8,pc}`],
  ["func_001747EC", `push {r4,r5,r6,r7,r8,lr}\nmov r6,r1\nmrc p15,0,r5,c13,c0,3\nldr r12,.Lcommand_func_001747EC\nmov r1,#0\nstr r12,[r5,#128]!\nstr r3,[r5,#4]\nmrc p15,0,r12,c13,c0,3\nadd r4,r12,#384\norr r1,r1,r3,lsl #14\nldm r4,{r7,r8}\norr r1,r1,#2\nstm r4,{r1,r2}\nldr r0,[r0]\nsvc #50\nstm r4,{r7,r8}\nands r1,r0,#0x80000000\nbmi 1f\nldr r0,[r5,#8]\nstr r0,[r6]\nldr r0,[r5,#4]\n1:\npop {r4,r5,r6,r7,r8,pc}`],
  ["func_001F6D38", `push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}\nadd r4,sp,#40\nldm r4,{r5,r6,r7,r8,r9,r12}\nmrc p15,0,r4,c13,c0,3\nldr r10,.Lcommand_func_001F6D38\nmov r11,#0\nstr r10,[r4,#128]!\nadd lr,r4,#4\nadd r10,r4,#36\nstm lr,{r1,r2,r3,r5,r7}\norr r1,r11,r7,lsl #14\norr r1,r1,#2\nstr r8,[r4,#24]\nstm r10,{r1,r6}\nadd r10,r4,#28\nstm r10,{r9,r12}\nldr r0,[r0]\nsvc #50\nand r1,r0,#0x80000000\ncmp r1,#0\nldrge r0,[r4,#4]\npop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}`],
]);
function canonical(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
}
for (const [name, expectedBody] of expectedBodies) {
  const start = source.indexOf(`IPC_BEGIN ${name}\n`);
  const endPattern = name === "func_002C5668" ? /^\s*\.size func_002C5668,/m : /^IPC_END_(?:ONE|HANDLE) /m;
  const remainder = source.slice(start + `IPC_BEGIN ${name}\n`.length);
  const end = remainder.search(endPattern);
  if (start < 0 || end < 0 || canonical(remainder.slice(0, end)) !== expectedBody) fail(`complete mnemonic schedule differs for ${name}`);
}
if ((source.match(/^IPC_BEGIN (func_[0-9A-F]{8})$/gm) ?? []).length !== 8 ||
    (source.match(/^IPC_END_(?:ONE|HANDLE) /gm) ?? []).length !== 7 ||
    (source.match(/^\s*\.size func_002C5668,/gm) ?? []).length !== 1) fail("body and pool boundaries differ");
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) fail("raw instruction or anonymous data directives are forbidden");
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+(?:\\command|\\handle|ipc_[A-Za-z0-9_]+)$/.test(line)) fail("pool words must be named symbols");
}
if (/^\s*blx?\s+/m.test(source)) fail("direct calls are forbidden");
if ((source.match(/^\s*svc #50$/gm) ?? []).length !== 8) fail("each schedule must issue SendSyncRequest exactly once");
if ((source.match(/^\s*bmi 1f$/gm) ?? []).length !== 5 || (source.match(/^1:$/gm) ?? []).length !== 5) fail("conditional branch targets differ");

if (createHash("sha256").update(source).digest("hex") !== "48f169b9e1f44e62750469d37eed546c8348aa326106e188f20d8d4526542cf9") fail("deterministic assembly schedules changed without validator review");
if (createHash("sha256").update(manifestText).digest("hex") !== "ba57873c54b37aad02ee0a91f12c1a3a58a26c8c9269a3b63dcbba1a70b8b09e") fail("deterministic manifest changed without validator review");

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) fail("object and readelf must be provided together");
if (!objectPath) {
  console.log(`Validated deterministic source coverage and 327-slot/177-class IPC structure for 8 ARM functions (${bytes} bytes).`);
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
for (const identity of batchIdentities) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 || symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") fail(`invalid identity ${identity}`);
}
console.log(`Validated 8 ARM IPC sections, symbols, no direct calls, and 9 ordered literal relocations (${bytes} bytes).`);
