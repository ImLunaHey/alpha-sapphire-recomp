import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-32.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_32.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 32 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_001FF27C", 92, [[40, "R_ARM_CALL", "bl", "func_001FFCB8"], [80, "R_ARM_CALL", "bl", "func_001FF5F0"]]],
  ["func_001FF320", 92, [[40, "R_ARM_CALL", "bl", "func_001FFD74"], [80, "R_ARM_CALL", "bl", "func_001FF6AC"]]],
  ["func_001FF388", 92, [[40, "R_ARM_CALL", "bl", "func_001FFDE4"], [80, "R_ARM_CALL", "bl", "func_001FF71C"]]],
  ["func_001FF3F0", 64, [[28, "R_ARM_CALL", "bl", "func_001FFE54"], [56, "R_ARM_JUMP24", "blne", "func_001FF78C"]]],
  ["func_001FF460", 104, [[48, "R_ARM_CALL", "bl", "func_001FFEAC"], [92, "R_ARM_CALL", "bl", "func_001FF7E4"]]],
  ["func_001FF54C", 92, [[40, "R_ARM_CALL", "bl", "func_001FFF40"], [80, "R_ARM_CALL", "bl", "func_001FF878"]]],
  ["func_001FFBC8", 48, [[16, "R_ARM_JUMP24", "b", "func_0020004C"], [40, "R_ARM_JUMP24", "b", "func_001FF984"]]],
  ["func_001FFC7C", 48, [[16, "R_ARM_JUMP24", "b", "func_0020010C"], [40, "R_ARM_JUMP24", "b", "func_001FFA44"]]],
  ["func_00200254", 64, [[28, "R_ARM_CALL", "bl", "func_00200154"], [56, "R_ARM_JUMP24", "blne", "func_001FFA8C"]]],
  ["func_002002A0", 48, [[16, "R_ARM_JUMP24", "b", "func_002001B0"], [40, "R_ARM_JUMP24", "b", "func_001FFAE8"]]],
  ["func_002002DC", 64, [[28, "R_ARM_CALL", "bl", "func_002001F8"], [56, "R_ARM_JUMP24", "blne", "func_001FFB30"]]],
];
const literalIdentities = ["ipc_handle_slot_theta", "ipc_handle_slot_eta", "ipc_unavailable_status_32"];
const reusedLiteralIdentities = ["ipc_handle_slot_theta", "ipc_handle_slot_eta"];
const newLiteralIdentities = ["ipc_unavailable_status_32"];
const branchIdentityContract = {
  mode: "arm",
  minimumAlignment: 4,
  singletonClasses: expectedFunctions.flatMap(([, , branches]) => branches.map(([, , , symbol]) => symbol)),
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_32.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 808 ||
    manifest.cumulativePoolSlots !== 507 || manifest.cumulativePoolClasses !== 238 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify(reusedLiteralIdentities) ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 11) {
  fail("unexpected manifest schema, totals, or identity contract");
}

let bodyBytes = 0;
let callCount = 0;
let jumpCount = 0;
const branchSymbols = [];
const batchSlots = [];
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, branches] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const wantedBranches = branches.map(([offset, kind, mnemonic, symbol]) => ({ offset, kind, mnemonic, symbol }));
  const wantedLiterals = literalIdentities.map((symbol, literalIndex) => ({
    offset: size + literalIndex * 4, symbol,
  }));
  if (entry?.name !== name || entry.size !== size ||
      JSON.stringify(entry.branches) !== JSON.stringify(wantedBranches) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wantedLiterals)) {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  bodyBytes += size;
  for (const [, kind, , symbol] of branches) {
    if (kind === "R_ARM_CALL") callCount++;
    else jumpCount++;
    branchSymbols.push(symbol);
  }
  batchSlots.push(...entry.literals.map(({ symbol }) => symbol));
}
if (bodyBytes !== 808 || callCount !== 13 || jumpCount !== 9 || branchSymbols.length !== 22 ||
    new Set(branchSymbols).size !== 22 || batchSlots.length !== 33 ||
    batchSlots.filter((identity) => identity === "ipc_handle_slot_theta").length !== 11 ||
    batchSlots.filter((identity) => identity === "ipc_handle_slot_eta").length !== 11 ||
    batchSlots.filter((identity) => identity === "ipc_unavailable_status_32").length !== 11) {
  fail("body, branch, or literal cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 17 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
];
const priorSlots = [];
for (const name of priorNames) {
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") priorSlots.push(entry[key]);
    }
    if (Array.isArray(entry.literals)) priorSlots.push(...entry.literals.map(({ symbol }) => symbol));
  }
}
if (priorSlots.length !== 474 || new Set(priorSlots).size !== 237 ||
    !priorSlots.includes("ipc_handle_slot_theta") || !priorSlots.includes("ipc_handle_slot_eta") ||
    priorSlots.includes("ipc_unavailable_status_32") || priorSlots.length + batchSlots.length !== 507 ||
    new Set([...priorSlots, ...batchSlots]).size !== 238) {
  fail("prior IPC pool, identity reuse, or batch-local freshness contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 11 ||
    (source.match(/^EP3 func_/gm) ?? []).length !== 11 ||
    (source.match(/^\.global ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32$/gm) ?? []).length !== 1) {
  fail("function, pool, or literal-global counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\p[012]$/.test(line)) fail("pool words must use named symbolic identities");
}
if ((source.match(/^blx\s+/gm) ?? []).length !== 0) fail("BLX transfers are forbidden");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "bf43c65f0a2c5a50b56cc55dce709ffbadf51353b0c33118ac48c9bdec3f116c") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "1405323a5009bb8f423391304ce332bc306c153161da25d551aed9a44ef6722f") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-32.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 507-slot/238-class IPC structure for 11 ARM dual-backend wrappers (808 bytes, 22 branches, 33 symbolic pool slots).");
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
    entries.push({ offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3] });
    relocations.set(relocatedSection, entries);
  }
}
for (const entry of manifest.functions) {
  const sectionName = `.text.${entry.name}`;
  const section = sections.get(sectionName);
  if (!section || section.size !== entry.size + 12 || !section.flags.includes("A") ||
      !section.flags.includes("X") || section.alignment !== 4) fail(`invalid section for ${entry.name}`);
  const symbol = symbols.get(entry.name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size ||
      symbol[0].type !== "FUNC" || symbol[0].binding !== "GLOBAL" ||
      Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${entry.name}`);
  const wanted = [
    ...entry.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol })),
    ...entry.literals.map(({ offset, symbol }) => ({ offset, kind: "R_ARM_ABS32", symbol })),
  ].sort((left, right) => left.offset - right.offset);
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${entry.name}`);
  }
}
for (const identity of branchSymbols) {
  const symbol = symbols.get(identity) ?? [];
  const external = symbol.length === 1 && symbol[0].value === 0 && symbol[0].size === 0 &&
    ["NOTYPE", "FUNC"].includes(symbol[0].type) && symbol[0].binding === "GLOBAL" && symbol[0].section === "UND";
  const definedFunction = symbol.length === 1 && symbol[0].type === "FUNC" &&
    symbol[0].binding === "GLOBAL" && symbol[0].section !== "UND";
  if (!external && !definedFunction) fail(`invalid symbolic branch identity ${identity}`);
}
for (const identity of literalIdentities) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 ||
      symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") {
    fail(`invalid literal identity ${identity}`);
  }
}
console.log("Validated 11 ARM dual-backend wrapper sections, 22 branch relocations, and 33 ordered literal relocations (808 bytes).");
