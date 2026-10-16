import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-42.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_42.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 42 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_0010703C", 80,
    [[36, "R_ARM_CALL", "bl", "func_00108808"]],
    [[80, "service_resource_state_42"]]],
  ["func_001260B4", 48,
    [[36, "R_ARM_JUMP24", "blne", "func_001603A0"],
      [44, "R_ARM_JUMP24", "b", "func_001103FC"]],
    [[48, "service_wait_handle_42"]]],
  ["func_003BAF98", 56,
    [[52, "R_ARM_JUMP24", "b", "func_003BD0B8"]],
    [[56, "service_cleanup_vtable_42_a"]]],
  ["func_002BC658", 80, [], [[80, "service_cleanup_vtable_42_b"]]],
  ["func_002CC8D0", 80,
    [[68, "R_ARM_CALL", "bl", "func_002CCD5C"]],
    [[80, "service_nonpositive_result_42"], [84, "service_dispatch_state_42"],
      [88, "service_unavailable_result_42"]]],
  ["func_002CC9F8", 84,
    [[68, "R_ARM_CALL", "bl", "func_002CCD5C"]],
    [[84, "service_cleanup_vtable_42_c"], [88, "service_dispatch_state_42"]]],
];
const literalIdentities = [
  "service_resource_state_42", "service_wait_handle_42",
  "service_cleanup_vtable_42_a", "service_cleanup_vtable_42_b",
  "service_nonpositive_result_42", "service_dispatch_state_42",
  "service_unavailable_result_42", "service_cleanup_vtable_42_c",
];
const reusedLiteralIdentities = [];
const newLiteralIdentities = [...literalIdentities];
const primaryEntries = [
  "func_00108808", "func_001603A0", "func_001103FC", "func_003BD0B8",
  "func_002CCD5C",
];
const sharedClasses = [{ symbol: "func_002CCD5C", siteCount: 2 }];
const singletonClasses = [
  "func_00108808", "func_001603A0", "func_001103FC", "func_003BD0B8",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, sharedClasses,
  singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_42.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 428 ||
    manifest.cumulativePoolSlots !== 554 || manifest.cumulativePoolClasses !== 279 ||
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
if (bodyBytes !== 428 || callCount !== 3 || jumpCount !== 3 || branchSymbols.length !== 6 ||
    branchSiteCounts.size !== 5 ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1) ||
    batchSlots.length !== 9 || new Set(batchSlots).size !== 8) {
  fail("body, branch, pool slot, or identity cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 27 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 545 || priorIdentities.size !== 271 ||
    newLiteralIdentities.some((identity) => priorIdentities.has(identity)) ||
    expectedFunctions.some(([name]) => priorFunctions.has(name)) ||
    priorSlots.length + batchSlots.length !== 554 ||
    new Set([...priorSlots, ...batchSlots]).size !== 279) {
  fail("cumulative, freshness, or disjoint IPC identity contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^\.word\s+/gm) ?? []).length !== 9 ||
    (source.match(/^bl\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 3 ||
    (source.match(/^blne\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 1 ||
    (source.match(/^b\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 2) {
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
    manifest.sourceSha256 !== "3dc0bbf83e9192949ca45eb61cc1c56bdc3eab28ebf68eebc0f7105129c037ce") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "3e587b0526aef558bdb93a929bcc1b7d6e692cb155b9b89d63ac178636de6c6d") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-42.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 554-slot/279-class IPC structure for 6 ARM service adapters (428 bytes, 6 symbolic branches, 9 pool slots).");
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
      dataMappings.length !== 1 || dataMappings[0].value !== entry.size) {
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
console.log("Validated 6 ARM service adapter sections, 6 ordered symbolic branch relocations, and 9 ordered literal relocations (428 bytes).");
