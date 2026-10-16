import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-43.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_43.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 43 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_00148344", 88,
    [[32, "R_ARM_CALL", "bl", "func_001644DC"],
      [72, "R_ARM_JUMP24", "blne", "func_0017080C"]],
    [[88, "service_dispatch_state_42"], [92, "service_unavailable_result_42"]]],
  ["func_0010FB40", 92,
    [[16, "R_ARM_CALL", "bl", "func_001602B8"],
      [72, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [80, "R_ARM_CALL", "bl", "func_00160380"]], []],
  ["func_00164F80", 92,
    [[12, "R_ARM_CALL", "bl", "func_001602B8"],
      [36, "R_ARM_CALL", "bl", "func_00174314"],
      [76, "R_ARM_JUMP24", "b", "func_00160380"],
      [88, "R_ARM_JUMP24", "b", "func_00160380"]],
    [[92, "service_lifecycle_object_43"], [96, "service_initialized_byte_35"],
      [100, "service_replacement_source_43"]]],
  ["func_0017080C", 92,
    [[64, "R_ARM_CALL", "bl", "func_00178228"]], []],
  ["func_0018C6B4", 92,
    [[16, "R_ARM_CALL", "bl", "func_001602B8"],
      [40, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [56, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [88, "R_ARM_JUMP24", "b", "func_00160380"]],
    [[92, "service_thread_completion_counts_43"]]],
  ["func_00126414", 96,
    [[48, "R_ARM_JUMP24", "blne", "func_00124BA4"],
      [88, "R_ARM_JUMP24", "b", "func_001603A0"]],
    [[96, "ipc_handle_slot_alpha"], [100, "service_absent_result_41_a"],
      [104, "service_handle_replacement_41_a"], [108, "service_wait_handle_42"]]],
];
const literalIdentities = [
  "service_dispatch_state_42", "service_unavailable_result_42",
  "service_lifecycle_object_43", "service_initialized_byte_35",
  "service_replacement_source_43", "service_thread_completion_counts_43",
  "ipc_handle_slot_alpha", "service_absent_result_41_a",
  "service_handle_replacement_41_a", "service_wait_handle_42",
];
const reusedLiteralIdentities = [
  "service_dispatch_state_42", "service_unavailable_result_42",
  "service_initialized_byte_35", "ipc_handle_slot_alpha",
  "service_absent_result_41_a", "service_handle_replacement_41_a",
  "service_wait_handle_42",
];
const newLiteralIdentities = [
  "service_lifecycle_object_43", "service_replacement_source_43",
  "service_thread_completion_counts_43",
];
const primaryEntries = [
  "func_001644DC", "func_0017080C", "func_001602B8", "func_001603A0",
  "func_00160380", "func_00174314", "func_00178228", "func_00124BA4",
];
const sharedClasses = [
  { symbol: "func_001602B8", siteCount: 3 },
  { symbol: "func_001603A0", siteCount: 4 },
  { symbol: "func_00160380", siteCount: 4 },
];
const singletonClasses = [
  "func_001644DC", "func_0017080C", "func_00174314", "func_00178228",
  "func_00124BA4",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, sharedClasses,
  singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_43.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 552 ||
    manifest.cumulativePoolSlots !== 564 || manifest.cumulativePoolClasses !== 282 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify(reusedLiteralIdentities) ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 6) {
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
  batchSlots.push(...literals.map(([, symbol]) => symbol));
}
const branchSiteCounts = new Map();
for (const symbol of branchSymbols) branchSiteCounts.set(symbol, (branchSiteCounts.get(symbol) ?? 0) + 1);
if (bodyBytes !== 552 || callCount !== 7 || jumpCount !== 9 || branchSymbols.length !== 16 ||
    branchSiteCounts.size !== 8 ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1) ||
    batchSlots.length !== 10 || new Set(batchSlots).size !== 10) {
  fail("body, branch, pool slot, or identity cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 28 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
];
const priorSlots = [];
const priorFunctions = new Set();
for (const name of priorNames) {
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of prior.functions) {
    priorFunctions.add(entry.name);
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") priorSlots.push(entry[key]);
    }
    if (Array.isArray(entry.literals)) priorSlots.push(...entry.literals.map(({ symbol }) => symbol));
  }
}
const priorIdentities = new Set(priorSlots);
if (priorSlots.length !== 554 || priorIdentities.size !== 279 ||
    newLiteralIdentities.some((identity) => priorIdentities.has(identity)) ||
    reusedLiteralIdentities.some((identity) => !priorIdentities.has(identity)) ||
    expectedFunctions.some(([name]) => priorFunctions.has(name)) ||
    priorSlots.length + batchSlots.length !== 564 ||
    new Set([...priorSlots, ...batchSlots]).size !== 282) {
  fail("cumulative, freshness, reuse, or disjoint IPC identity contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^\.word\s+/gm) ?? []).length !== 10 ||
    (source.match(/^bl\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 7 ||
    (source.match(/^blne\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 5 ||
    (source.match(/^b\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 4) {
  fail("function, branch, or pool counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+[A-Za-z_][A-Za-z0-9_]*$/.test(line)) {
    fail("pool words must use named symbolic identities");
  }
}
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "812e8825f7eed3894cc7094c8d6c504e06459f742ae0c67760816ac4bb9f5b96") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "2d0c4901feff1ef573eb4117861d09c35c83841d2e8441e02fdfb49cf04a8e18") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-43.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 564-slot/282-class IPC structure for 6 ARM service adapters (552 bytes, 16 symbolic branches, 10 pool slots).");
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
  const validDataMappings = entry.literals.length === 0
    ? dataMappings.length === 0
    : dataMappings.length === 1 && dataMappings[0].value === entry.size;
  if (armMappings.length !== 1 || armMappings[0].value !== 0 || !validDataMappings) {
    fail(`invalid mapping symbols for ${entry.name}`);
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
    symbol[0].binding === "GLOBAL" && symbol[0].visibility === "DEFAULT" && symbol[0].section !== "UND" &&
    symbol[0].value % 4 === 0;
  if (!external && !definedFunction) fail(`invalid symbolic ARM branch identity ${identity}`);
}
for (const identity of new Set(batchSlots)) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 ||
      symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" ||
      symbol[0].visibility !== "DEFAULT" || symbol[0].section !== "UND") {
    fail(`invalid symbolic literal identity ${identity}`);
  }
}
console.log("Validated 6 ARM service adapter sections, 16 ordered symbolic branch relocations, and 10 ordered literal relocations (552 bytes).");
