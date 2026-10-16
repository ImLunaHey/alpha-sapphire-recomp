import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-41.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_41.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 41 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_0010FF44", 64,
    [[52, "R_ARM_JUMP24", "blne", "func_00124BA4"]],
    [[64, "ipc_handle_slot_alpha"], [68, "service_absent_result_41_a"],
      [72, "service_handle_replacement_41_a"]]],
  ["func_00132EE8", 60,
    [[36, "R_ARM_JUMP24", "blne", "func_00146000"]],
    [[60, "service_absent_result_41_b"], [64, "service_handle_replacement_41_b"]]],
  ["func_0013ADA8", 92,
    [[16, "R_ARM_CALL", "bl", "func_001602B8"],
      [32, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [60, "R_ARM_CALL", "bl", "func_00160380"],
      [68, "R_ARM_JUMP24", "b", "func_00145550"],
      [80, "R_ARM_CALL", "bl", "func_00160380"]], []],
  ["func_0013B0A8", 80,
    [[8, "R_ARM_CALL", "bl", "func_00150874"]], []],
  ["func_00165A60", 68,
    [[28, "R_ARM_CALL", "bl", "func_00174748"],
      [60, "R_ARM_CALL", "bl", "func_0017080C"]],
    [[68, "service_guard_state_41"], [72, "service_owned_handle_41"],
      [76, "service_finalize_token_41"]]],
  ["func_001FBE68", 60, [], [[60, "service_cleanup_vtable_41"]]],
];
const literalIdentities = [
  "ipc_handle_slot_alpha", "service_absent_result_41_a",
  "service_handle_replacement_41_a", "service_absent_result_41_b",
  "service_handle_replacement_41_b", "service_guard_state_41",
  "service_owned_handle_41", "service_finalize_token_41",
  "service_cleanup_vtable_41",
];
const reusedLiteralIdentities = ["ipc_handle_slot_alpha"];
const newLiteralIdentities = literalIdentities.slice(1);
const primaryEntries = [
  "func_00124BA4", "func_00146000", "func_001602B8", "func_001603A0",
  "func_00160380", "func_00145550", "func_00150874", "func_00174748",
  "func_0017080C",
];
const sharedClasses = [{ symbol: "func_00160380", siteCount: 2 }];
const singletonClasses = [
  "func_00124BA4", "func_00146000", "func_001602B8", "func_001603A0",
  "func_00145550", "func_00150874", "func_00174748", "func_0017080C",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, sharedClasses,
  singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_41.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 424 ||
    manifest.cumulativePoolSlots !== 545 || manifest.cumulativePoolClasses !== 271 ||
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
if (bodyBytes !== 424 || callCount !== 6 || jumpCount !== 4 || branchSymbols.length !== 10 ||
    branchSiteCounts.size !== 9 ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1) ||
    batchSlots.length !== 9 || new Set(batchSlots).size !== 9) {
  fail("body, branch, pool slot, or identity cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 26 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 536 || priorIdentities.size !== 263 ||
    !priorIdentities.has("ipc_handle_slot_alpha") ||
    newLiteralIdentities.some((identity) => priorIdentities.has(identity)) ||
    expectedFunctions.some(([name]) => priorFunctions.has(name)) ||
    priorSlots.length + batchSlots.length !== 545 ||
    new Set([...priorSlots, ...batchSlots]).size !== 271) {
  fail("cumulative, reuse, freshness, or disjoint IPC identity contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^\.word\s+/gm) ?? []).length !== 9 ||
    (source.match(/^bl\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^blne\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 3 ||
    (source.match(/^b\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 1) {
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
    manifest.sourceSha256 !== "a58678608993a75f7520f4fe4458c39d82f4541f2c0f745227adc86c731da63b") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "5375a015fbd54200b883f3894d44d251d6975179a50262cd545c14423b983c24") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-41.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 545-slot/271-class IPC structure for 6 ARM service adapters (424 bytes, 10 symbolic branches, 9 pool slots).");
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
      (entry.literals.length === 0 ? dataMappings.length !== 0 :
        dataMappings.length !== 1 || dataMappings[0].value !== entry.size)) {
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
console.log("Validated 6 ARM service adapter sections, 10 ordered symbolic branch relocations, and 9 ordered literal relocations (424 bytes).");
