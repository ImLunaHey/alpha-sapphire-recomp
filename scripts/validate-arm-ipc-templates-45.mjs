import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-45.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_45.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 45 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_00174314", 236, [
    [28, "R_ARM_JUMP24", "blne", "func_001603A0"],
    [56, "R_ARM_JUMP24", "blne", "func_001603A0"],
    [68, "R_ARM_CALL", "bl", "func_001781F0"],
    [100, "R_ARM_CALL", "bl", "func_001602B8"],
    [112, "R_ARM_CALL", "bl", "func_00164F74"],
    [124, "R_ARM_CALL", "bl", "func_0017A640"],
    [136, "R_ARM_CALL", "bl", "func_0017A5B8"],
    [160, "R_ARM_CALL", "bl", "func_001780E8"],
    [220, "R_ARM_CALL", "bl", "func_00160380"],
  ]],
  ["func_001745F8", 268, [
    [16, "R_ARM_CALL", "bl", "func_001602B8"],
    [32, "R_ARM_CALL", "bl", "func_00177FF0"],
    [264, "R_ARM_JUMP24", "b", "func_00160380"],
  ]],
  ["func_0019B5B0", 120, [
    [68, "R_ARM_JUMP24", "blne", "func_001603A0"],
  ]],
  ["func_002BC2F8", 172, [
    [44, "R_ARM_CALL", "bl", "func_0017048C"],
    [60, "R_ARM_JUMP24", "blne", "func_001603A0"],
    [84, "R_ARM_CALL", "bl", "func_00132A14"],
    [124, "R_ARM_CALL", "bl", "func_002C23C8"],
    [136, "R_ARM_CALL", "bl", "func_002C5C4C"],
    [148, "R_ARM_CALL", "bl", "func_002C2454"],
  ]],
  ["func_0042F6BC", 96, [
    [20, "R_ARM_JUMP24", "blne", "func_001603A0"],
    [28, "R_ARM_CALL", "bl", "service_result_wait_secondary_45"],
    [44, "R_ARM_CALL", "bl", "service_payload_submit_secondary_45"],
    [68, "R_ARM_CALL", "bl", "func_001602B8"],
    [84, "R_ARM_CALL", "bl", "func_00160380"],
  ]],
  ["func_00430818", 152, [
    [28, "R_ARM_CALL", "bl", "func_00150874"],
    [124, "R_ARM_CALL", "bl", "service_session_reset_secondary_45"],
    [136, "R_ARM_CALL", "bl", "func_002E6CA4"],
  ]],
];
const primaryEntries = [
  "func_001603A0", "func_001781F0", "func_001602B8", "func_00164F74",
  "func_0017A640", "func_0017A5B8", "func_001780E8", "func_00160380",
  "func_00177FF0", "func_0017048C", "func_00132A14", "func_002C23C8",
  "func_002C5C4C", "func_002C2454", "func_00150874", "func_002E6CA4",
];
const secondaryEntries = [
  "service_result_wait_secondary_45", "service_payload_submit_secondary_45",
  "service_session_reset_secondary_45",
];
const sharedClasses = [
  { symbol: "func_001603A0", siteCount: 5 },
  { symbol: "func_001602B8", siteCount: 3 },
  { symbol: "func_00160380", siteCount: 3 },
];
const singletonClasses = [
  "func_001781F0", "func_00164F74", "func_0017A640", "func_0017A5B8",
  "func_001780E8", "func_00177FF0", "func_0017048C", "func_00132A14",
  "func_002C23C8", "func_002C5C4C", "func_002C2454",
  "service_result_wait_secondary_45", "service_payload_submit_secondary_45",
  "func_00150874", "service_session_reset_secondary_45", "func_002E6CA4",
];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries,
  sharedClasses, singletonClasses, classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_45.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 1044 ||
    manifest.cumulativePoolSlots !== 572 || manifest.cumulativePoolClasses !== 286 ||
    JSON.stringify(manifest.literalIdentities) !== "[]" ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 6) {
  fail("unexpected manifest schema, totals, or identity contract");
}

let bodyBytes = 0;
let callCount = 0;
let jumpCount = 0;
const branchSymbols = [];
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, branches] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const wantedBranches = branches.map(([offset, kind, mnemonic, symbol]) => ({ offset, kind, mnemonic, symbol }));
  if (entry?.name !== name || entry.size !== size ||
      JSON.stringify(entry.branches) !== JSON.stringify(wantedBranches) ||
      JSON.stringify(entry.literals) !== "[]") {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  bodyBytes += size;
  for (const [, kind, , symbol] of branches) {
    if (kind === "R_ARM_CALL") callCount++;
    else if (kind === "R_ARM_JUMP24") jumpCount++;
    else fail(`invalid branch relocation kind for ${name}`);
    branchSymbols.push(symbol);
  }
}
const branchSiteCounts = new Map();
for (const symbol of branchSymbols) branchSiteCounts.set(symbol, (branchSiteCounts.get(symbol) ?? 0) + 1);
const configuredBranchSymbols = new Set([...primaryEntries, ...secondaryEntries]);
if (bodyBytes !== 1044 || callCount !== 21 || jumpCount !== 6 || branchSymbols.length !== 27 ||
    branchSiteCounts.size !== 19 || configuredBranchSymbols.size !== 19 ||
    branchSymbols.some((symbol) => !configuredBranchSymbols.has(symbol)) ||
    sharedClasses.some(({ symbol, siteCount }) => branchSiteCounts.get(symbol) !== siteCount) ||
    singletonClasses.some((symbol) => branchSiteCounts.get(symbol) !== 1)) {
  fail("body, branch, or identity cardinality differs");
}
const secondarySites = manifest.functions.flatMap((entry) => entry.branches.map((branch) => ({
  functionName: entry.name, ...branch,
}))).filter(({ symbol }) => secondaryEntries.includes(symbol));
if (JSON.stringify(secondarySites) !== JSON.stringify([
  { functionName: "func_0042F6BC", offset: 28, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_result_wait_secondary_45" },
  { functionName: "func_0042F6BC", offset: 44, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_payload_submit_secondary_45" },
  { functionName: "func_00430818", offset: 124, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_session_reset_secondary_45" },
])) fail("secondary-entry ARM BL contract differs");

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 30 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 572 || new Set(priorSlots).size !== 286 ||
    expectedFunctions.some(([name]) => priorFunctions.has(name))) {
  fail("cumulative or disjoint IPC identity contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 6 ||
    (source.match(/^\.word\s+/gm) ?? []).length !== 0 ||
    (source.match(/^bl\s+[A-Za-z_][A-Za-z0-9_]*$/gm) ?? []).length !== 21 ||
    (source.match(/^blne\s+[A-Za-z_][A-Za-z0-9_]*$/gm) ?? []).length !== 5 ||
    (source.match(/^blx\s+r\d+$/gm) ?? []).length !== 4) {
  fail("function, branch, or pool counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "a4a0c254ae97f9e36dbedf8cccf3d2e349eb490bf491bf0d600dc2280d543621") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "2599ca89722c57812da3443ee63ee304e4661f7f7664ff5fcd83563a01383c24") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-45.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and unchanged 572-slot/286-class IPC structure for 6 ARM service adapters (1,044 bytes, 27 symbolic branches, no pool slots).");
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
  if (!section || section.type !== "PROGBITS" || section.size !== entry.size ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    fail(`invalid section for ${entry.name}`);
  }
  const symbol = symbols.get(entry.name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size ||
      symbol[0].type !== "FUNC" || symbol[0].binding !== "GLOBAL" || symbol[0].visibility !== "DEFAULT" ||
      Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${entry.name}`);
  const armMappings = (symbols.get("$a") ?? []).filter((item) => Number(item.section) === section.index);
  const dataMappings = (symbols.get("$d") ?? []).filter((item) => Number(item.section) === section.index);
  if (armMappings.length !== 1 || armMappings[0].value !== 0 || dataMappings.length !== 0) {
    fail(`invalid mapping symbols for ${entry.name}`);
  }
  const wanted = entry.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol }));
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${entry.name}`);
  }
}
for (const identity of configuredBranchSymbols) {
  const symbol = symbols.get(identity) ?? [];
  const external = symbol.length === 1 && symbol[0].value === 0 && symbol[0].size === 0 &&
    ["NOTYPE", "FUNC"].includes(symbol[0].type) && symbol[0].binding === "GLOBAL" &&
    symbol[0].visibility === "DEFAULT" && symbol[0].section === "UND";
  const definedFunction = symbol.length === 1 && symbol[0].type === "FUNC" &&
    symbol[0].binding === "GLOBAL" && symbol[0].visibility === "DEFAULT" && symbol[0].section !== "UND" &&
    symbol[0].value % 4 === 0;
  if (!external && !definedFunction) fail(`invalid symbolic ARM branch identity ${identity}`);
}
console.log("Validated object sections, symbols, and 27 ordered ARM branch relocations for IPC template batch 45.");
