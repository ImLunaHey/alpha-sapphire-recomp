import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-35.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_35.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 35 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_0010EC28", 32, [[8, "R_ARM_CALL", "bl", "func_001240C4"], [24, "R_ARM_CALL", "bl", "func_001182D0"]], []],
  ["func_0010F1F4", 32, [[20, "R_ARM_CALL", "bl", "func_00118C94"]], []],
  ["func_00118294", 36, [[24, "R_ARM_CALL", "bl", "func_0012408C"]], [[36, "service_state_slot_35"], [40, "service_request_kind_35"]]],
  ["func_00118578", 28, [[4, "R_ARM_CALL", "bl", "func_00125584"], [20, "R_ARM_JUMP24", "b", "func_00146000"]], []],
  ["func_0011B11C", 44, [[12, "R_ARM_CALL", "bl", "func_001260B4"], [24, "R_ARM_CALL", "bl", "func_001266B4"], [32, "R_ARM_CALL", "bl", "func_00126414"]], []],
  ["func_0011B818", 44, [[8, "R_ARM_CALL", "bl", "func_001260B4"], [12, "R_ARM_CALL", "bl", "func_00126000"], [20, "R_ARM_CALL", "bl", "func_001266FC"], [32, "R_ARM_JUMP24", "blne", "func_00124BA4"], [40, "R_ARM_JUMP24", "b", "func_00126414"]], []],
  ["func_0012437C", 32, [[8, "R_ARM_CALL", "bl", "func_00145FC0"], [20, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_00125DC0", 36, [[28, "R_ARM_JUMP24", "b", "func_00125E50"]], [[36, "service_initialized_byte_35"], [40, "service_session_object_35"]]],
  ["func_001265DC", 36, [[4, "R_ARM_CALL", "bl", "func_001260B4"], [8, "R_ARM_CALL", "bl", "func_00126000"], [12, "R_ARM_CALL", "bl", "func_00133ECC"], [24, "R_ARM_JUMP24", "blne", "func_00124BA4"], [32, "R_ARM_JUMP24", "b", "func_00126414"]], []],
  ["func_00178238", 40, [[12, "R_ARM_CALL", "bl", "func_00124838"], [24, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_0020282C", 20, [[8, "R_ARM_CALL", "bl", "func_002028C4"]], []],
  ["func_00203050", 40, [[12, "R_ARM_CALL", "bl", "func_002030EC"]], []],
  ["func_002C669C", 28, [[4, "R_ARM_CALL", "bl", "func_002C6660"], [20, "R_ARM_JUMP24", "b", "func_00146000"]], []],
];
const literalIdentities = [
  "service_state_slot_35", "service_request_kind_35",
  "service_initialized_byte_35", "service_session_object_35",
];
const primaryEntries = [
  "func_001240C4", "func_001182D0", "func_00118C94", "func_0012408C",
  "func_00125584", "func_00146000", "func_001260B4", "func_001266B4",
  "func_00126414", "func_00126000", "func_001266FC", "func_00124BA4",
  "func_00145FC0", "func_00124FB0", "func_00125E50", "func_00133ECC",
  "func_00124838", "func_002028C4", "func_002030EC", "func_002C6660",
];
const sharedClasses = [
  { symbol: "func_001260B4", siteCount: 3 },
  { symbol: "func_00126414", siteCount: 3 },
  { symbol: "func_00126000", siteCount: 2 },
  { symbol: "func_00124BA4", siteCount: 2 },
  { symbol: "func_00124FB0", siteCount: 2 },
  { symbol: "func_00146000", siteCount: 2 },
];
const singletonClasses = [
  "func_001240C4", "func_001182D0", "func_00118C94", "func_0012408C",
  "func_00125584", "func_001266B4", "func_001266FC", "func_00145FC0",
  "func_00125E50", "func_00133ECC", "func_00124838", "func_002028C4",
  "func_002030EC", "func_002C6660",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, sharedClasses,
  singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_35.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 448 ||
    manifest.cumulativePoolSlots !== 523 || manifest.cumulativePoolClasses !== 253 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 13) {
  fail("unexpected manifest schema, totals, or identity contract");
}

let bodyBytes = 0;
let callCount = 0;
let jumpCount = 0;
const branchSymbols = [];
const batchSlots = [];
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, branches, literals] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const wantedBranches = branches.map(([offset, kind, mnemonic, symbol]) => ({ offset, kind, mnemonic, symbol }));
  const wantedLiterals = literals.map(([offset, symbol]) => ({ offset, symbol }));
  if (entry?.name !== name || entry.size !== size ||
      JSON.stringify(entry.branches) !== JSON.stringify(wantedBranches) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wantedLiterals)) {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  bodyBytes += size;
  for (const [, kind, , symbol] of branches) {
    if (kind === "R_ARM_CALL") callCount++;
    else if (kind === "R_ARM_JUMP24") jumpCount++;
    else fail(`invalid branch relocation kind for ${name}`);
    branchSymbols.push(symbol);
  }
  batchSlots.push(...entry.literals.map(({ symbol }) => symbol));
}
const branchSiteCounts = new Map();
for (const symbol of branchSymbols) branchSiteCounts.set(symbol, (branchSiteCounts.get(symbol) ?? 0) + 1);
if (bodyBytes !== 448 || callCount !== 19 || jumpCount !== 9 || branchSymbols.length !== 28 ||
    branchSiteCounts.size !== 20 ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1) ||
    JSON.stringify(batchSlots) !== JSON.stringify(literalIdentities) ||
    new Set(batchSlots).size !== 4) {
  fail("body, branch, or literal cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 20 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 519 || new Set(priorSlots).size !== 249 ||
    literalIdentities.some((identity) => priorSlots.includes(identity)) ||
    priorSlots.length + batchSlots.length !== 523 ||
    new Set([...priorSlots, ...batchSlots]).size !== 253) {
  fail("prior IPC pool or batch-local freshness contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 13 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 13 ||
    (source.match(/^\.word service_(?:state_slot|request_kind|initialized_byte|session_object)_35$/gm) ?? []).length !== 4) {
  fail("function, pool, or literal-global counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+[A-Za-z_][A-Za-z0-9_]*$/.test(line)) fail("pool words must use named symbolic identities");
}
if ((source.match(/^blx\s+/gm) ?? []).length !== 0) fail("BLX transfers are forbidden");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "9595710f86e442ce123f6cfd39894ddb3cb8e3b5269ab9a6b92a0cc0dae0aaae") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "705de31d299fb1d92c6c436f470e5e2a8f30a5005370b4425a9e5b3ce0a3992e") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-35.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 523-slot/253-class IPC structure for 13 ARM service wrappers (448 bytes, 28 branches, 4 symbolic pool slots).");
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
  sections.set(match[2], { index: Number(match[1]), type: match[3], size: Number.parseInt(match[4], 16), flags: match[5], alignment: Number(match[6]) });
}
const symbols = new Map();
for (const match of symbolOutput.matchAll(/^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm)) {
  const values = symbols.get(match[7]) ?? [];
  values.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], binding: match[4], visibility: match[5], section: match[6] });
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
  if (!section || section.type !== "PROGBITS" || section.size !== entry.size + entry.literals.length * 4 ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    fail(`invalid section for ${entry.name}`);
  }
  const symbol = symbols.get(entry.name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size ||
      symbol[0].type !== "FUNC" || symbol[0].binding !== "GLOBAL" || symbol[0].visibility !== "DEFAULT" ||
      Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${entry.name}`);
  const armMappings = (symbols.get("$a") ?? []).filter((item) => Number(item.section) === section.index);
  const dataMappings = (symbols.get("$d") ?? []).filter((item) => Number(item.section) === section.index);
  if (armMappings.length !== 1 || armMappings[0].value !== 0 ||
      dataMappings.length !== (entry.literals.length === 0 ? 0 : 1) ||
      (dataMappings.length === 1 && dataMappings[0].value !== entry.size)) {
    fail(`invalid mapping-symbol transition for ${entry.name}`);
  }
  const wanted = [
    ...entry.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol })),
    ...entry.literals.map(({ offset, symbol }) => ({ offset, kind: "R_ARM_ABS32", symbol })),
  ].sort((left, right) => left.offset - right.offset);
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${entry.name}`);
  }
}
for (const identity of new Set(branchSymbols)) {
  const symbol = symbols.get(identity) ?? [];
  const external = symbol.length === 1 && symbol[0].value === 0 && symbol[0].size === 0 &&
    ["NOTYPE", "FUNC"].includes(symbol[0].type) && symbol[0].binding === "GLOBAL" &&
    symbol[0].visibility === "DEFAULT" && symbol[0].section === "UND";
  const definedFunction = symbol.length === 1 && symbol[0].type === "FUNC" &&
    symbol[0].binding === "GLOBAL" && symbol[0].visibility === "DEFAULT" && symbol[0].section !== "UND";
  if (!external && !definedFunction) fail(`invalid symbolic branch identity ${identity}`);
}
for (const identity of literalIdentities) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 ||
      symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" ||
      symbol[0].visibility !== "DEFAULT" || symbol[0].section !== "UND") {
    fail(`invalid literal identity ${identity}`);
  }
}
console.log("Validated 13 ARM service wrapper sections, 28 branch relocations, and 4 ordered literal relocations (448 bytes).");
