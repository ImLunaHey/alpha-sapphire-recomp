import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-39.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_39.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 39 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_001F461C", 108,
    [[32, "R_ARM_CALL", "bl", "func_001240C4"], [48, "R_ARM_CALL", "bl", "func_001F72F4"]],
    [[108, "service_result_normalization_39"]]],
  ["func_001F78E8", 28,
    [[16, "R_ARM_JUMP24", "bleq", "func_00146000"]],
    [[28, "lazy_service_cell_39"]]],
  ["func_001FAFD8", 76,
    [[32, "R_ARM_CALL", "bl", "func_001FB6AC"], [44, "R_ARM_JUMP24", "blne", "func_00124FB0"]],
    [[76, "service_default_word_39"], [80, "service_fallback_state_39"]]],
  ["func_001FB388", 80,
    [[12, "R_ARM_CALL", "bl", "func_001FB6F8"], [24, "R_ARM_CALL", "bl", "func_001FB4CC"],
      [68, "R_ARM_JUMP24", "blne", "func_00124FB0"]],
    [[80, "service_filtered_status_39"]]],
  ["func_004A7960", 36,
    [[24, "R_ARM_JUMP24", "bleq", "func_00124FB0"]],
    [[36, "required_handle_error_39"]]],
  ["func_004A79A8", 36,
    [[24, "R_ARM_JUMP24", "bleq", "func_00124FB0"]],
    [[36, "required_handle_error_39"]]],
];
const literalIdentities = [
  "service_result_normalization_39", "lazy_service_cell_39",
  "service_default_word_39", "service_fallback_state_39",
  "service_filtered_status_39", "required_handle_error_39",
];
const primaryEntries = [
  "func_001240C4", "func_001F72F4", "func_00146000", "func_001FB6AC",
  "func_00124FB0", "func_001FB6F8", "func_001FB4CC",
];
const sharedClasses = [{ symbol: "func_00124FB0", siteCount: 4 }];
const singletonClasses = [
  "func_001240C4", "func_001F72F4", "func_00146000", "func_001FB6AC",
  "func_001FB6F8", "func_001FB4CC",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, sharedClasses,
  singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_39.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 364 ||
    manifest.cumulativePoolSlots !== 530 || manifest.cumulativePoolClasses !== 259 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(literalIdentities) ||
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
if (bodyBytes !== 364 || callCount !== 5 || jumpCount !== 5 || branchSymbols.length !== 10 ||
    branchSiteCounts.size !== 7 ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1) ||
    batchSlots.length !== 7 || new Set(batchSlots).size !== 6) {
  fail("body, branch, pool slot, or identity cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 24 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 523 || new Set(priorSlots).size !== 253 ||
    batchSlots.some((identity) => priorSlots.includes(identity)) ||
    priorSlots.length + batchSlots.length !== 530 ||
    new Set([...priorSlots, ...batchSlots]).size !== 259) {
  fail("cumulative IPC pool identity contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^\s*\.word\s+/gm) ?? []).length !== 7 ||
    (source.match(/^bl\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 5 ||
    (source.match(/^bl(?:eq|ne)\s+func_[0-9A-F]{8}$/gm) ?? []).length !== 5) {
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
    manifest.sourceSha256 !== "b72f8de7a536570f3781b71da408a27a6190b0af3653eee308924f6a14b99a1c") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "905a0332eb1f0a164de8ff42fa4d5b2e5ef78b9fcc9495a6103f20e5cae83e4d") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-39.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 530-slot/259-class IPC structure for 6 ARM service adapters (364 bytes, 10 symbolic branches, 7 pool slots).");
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
console.log("Validated 6 ARM service adapter sections, 10 ordered symbolic branch relocations, and 7 ordered literal relocations (364 bytes).");
