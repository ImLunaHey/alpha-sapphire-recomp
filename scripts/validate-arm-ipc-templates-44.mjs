import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-44.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_44.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 44 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_00160594", 100,
    [[80, "R_ARM_JUMP24", "blne", "func_00146000"]],
    [[100, "service_reference_state_44"], [104, "ipc_handle_slot_nu"],
      [108, "service_handle_replacement_41_b"]]],
  ["func_00166FE4", 112,
    [[28, "R_ARM_CALL", "bl", "func_00174DD0"],
      [32, "R_ARM_CALL", "bl", "service_mark_ready_secondary_44"],
      [60, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [72, "R_ARM_CALL", "bl", "func_001781F0"]], []],
  ["func_001780E8", 104,
    [[64, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [76, "R_ARM_CALL", "bl", "func_0017E324"]],
    [[104, "service_unlink_context_44"]]],
  ["func_0018C62C", 128,
    [[24, "R_ARM_CALL", "bl", "func_001602B8"],
      [52, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [88, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [116, "R_ARM_CALL", "bl", "func_00160380"]],
    [[128, "service_completion_code_40"],
      [132, "service_thread_completion_counts_43"]]],
  ["func_002DDD28", 104,
    [[56, "R_ARM_CALL", "bl", "func_002DE7D4"],
      [64, "R_ARM_JUMP24", "blne", "func_00146000"]],
    [[104, "service_acquisition_input_44"]]],
  ["func_0042D5E0", 100,
    [[20, "R_ARM_CALL", "bl", "func_001397B8"]],
    [[100, "service_cleanup_vtable_44"]]],
];
const literalIdentities = [
  "service_reference_state_44", "ipc_handle_slot_nu",
  "service_handle_replacement_41_b", "service_unlink_context_44",
  "service_completion_code_40", "service_thread_completion_counts_43",
  "service_acquisition_input_44", "service_cleanup_vtable_44",
];
const reusedLiteralIdentities = [
  "ipc_handle_slot_nu", "service_handle_replacement_41_b",
  "service_completion_code_40", "service_thread_completion_counts_43",
];
const newLiteralIdentities = [
  "service_reference_state_44", "service_unlink_context_44",
  "service_acquisition_input_44", "service_cleanup_vtable_44",
];
const primaryEntries = [
  "func_00146000", "func_00174DD0", "func_001603A0", "func_001781F0",
  "func_0017E324", "func_001602B8", "func_00160380", "func_002DE7D4",
  "func_001397B8",
];
const secondaryEntries = [
  "service_mark_ready_secondary_44",
];
const sharedClasses = [
  { symbol: "func_00146000", siteCount: 2 },
  { symbol: "func_001603A0", siteCount: 4 },
];
const singletonClasses = [
  "func_00174DD0", "service_mark_ready_secondary_44", "func_001781F0",
  "func_0017E324", "func_001602B8", "func_00160380",
  "func_002DE7D4", "func_001397B8",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries,
  sharedClasses, singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_44.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 648 ||
    manifest.cumulativePoolSlots !== 572 || manifest.cumulativePoolClasses !== 286 ||
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
const configuredBranchSymbols = new Set([...primaryEntries, ...secondaryEntries]);
if (bodyBytes !== 648 || callCount !== 8 || jumpCount !== 6 || branchSymbols.length !== 14 ||
    branchSiteCounts.size !== 10 || configuredBranchSymbols.size !== 10 ||
    branchSymbols.some((symbol) => !configuredBranchSymbols.has(symbol)) ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1) ||
    batchSlots.length !== 8 || new Set(batchSlots).size !== 8) {
  fail("body, branch, pool slot, or identity cardinality differs");
}
const secondarySites = manifest.functions.flatMap((entry) => entry.branches.map((branch) => ({
  functionName: entry.name, ...branch,
}))).filter(({ symbol }) => secondaryEntries.includes(symbol));
if (JSON.stringify(secondarySites) !== JSON.stringify([
  { functionName: "func_00166FE4", offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_mark_ready_secondary_44" },
])) fail("secondary-entry ARM BL contract differs");

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 29 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 564 || priorIdentities.size !== 282 ||
    newLiteralIdentities.some((identity) => priorIdentities.has(identity)) ||
    reusedLiteralIdentities.some((identity) => !priorIdentities.has(identity)) ||
    expectedFunctions.some(([name]) => priorFunctions.has(name)) ||
    priorSlots.length + batchSlots.length !== 572 ||
    new Set([...priorSlots, ...batchSlots]).size !== 286) {
  fail("cumulative, freshness, reuse, or disjoint IPC identity contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^\.word\s+/gm) ?? []).length !== 8 ||
    (source.match(/^bl\s+[A-Za-z_][A-Za-z0-9_]*$/gm) ?? []).length !== 8 ||
    (source.match(/^blne\s+[A-Za-z_][A-Za-z0-9_]*$/gm) ?? []).length !== 6 ||
    (source.match(/^blx\s+/gm) ?? []).length !== 0) {
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
    manifest.sourceSha256 !== "c7a7ba889a8d1b328b68e463380ab4afcff0864e3b722117102027b5bd6a0b60") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "30e3c022160e336bdccacb14edd4bd603f9dd86acca820cbee25e95ba2aac28b") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-44.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 572-slot/286-class IPC structure for 6 ARM service adapters (648 bytes, 14 symbolic branches, 8 pool slots).");
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
console.log("Validated 6 ARM service adapter sections, 14 ordered symbolic branch relocations, and 8 ordered literal relocations (648 bytes).");
