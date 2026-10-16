import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-33.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_33.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 33 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_002009A4", 68, [[32, "R_ARM_CALL", "bl", "func_00124880"], [44, "R_ARM_JUMP24", "blne", "func_00124FB0"]], [[68, "service_seed_halfword_33"], [72, "service_request_kind_33"]]],
  ["func_002009F0", 56, [[24, "R_ARM_CALL", "bl", "func_00124880"], [36, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_00200A28", 116, [[16, "R_ARM_CALL", "bl", "func_00124880"], [28, "R_ARM_JUMP24", "blne", "func_00124FB0"], [36, "R_ARM_CALL", "bl", "func_001602B8"], [44, "R_ARM_CALL", "bl", "func_001F4A1C"], [60, "R_ARM_CALL", "bl", "func_00160380"], [88, "R_ARM_CALL", "bl", "func_00160380"]], [[116, "service_lock_object_33"], [120, "service_operation_object_33"], [124, "service_result_object_33"]]],
  ["func_00200ABC", 56, [[20, "R_ARM_CALL", "bl", "func_00124880"], [32, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_00200B2C", 60, [[32, "R_ARM_CALL", "bl", "func_00124880"], [44, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_00200B68", 56, [[20, "R_ARM_CALL", "bl", "func_00124880"], [32, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_00200BA0", 56, [[20, "R_ARM_CALL", "bl", "func_00124880"], [32, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
  ["func_00200BD8", 56, [[20, "R_ARM_CALL", "bl", "func_00124880"], [32, "R_ARM_JUMP24", "blne", "func_00124FB0"]], []],
];
const literalIdentities = [
  "service_seed_halfword_33", "service_request_kind_33", "service_lock_object_33",
  "service_operation_object_33", "service_result_object_33",
];
const branchIdentityContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries: ["func_00124880", "func_00124FB0", "func_001602B8", "func_00160380", "func_001F4A1C"],
  sharedClasses: [
    { symbol: "func_00124880", siteCount: 8 },
    { symbol: "func_00124FB0", siteCount: 8 },
    { symbol: "func_00160380", siteCount: 2 },
  ],
  singletonClasses: ["func_001602B8", "func_001F4A1C"],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_33.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 524 ||
    manifest.cumulativePoolSlots !== 512 || manifest.cumulativePoolClasses !== 243 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 8) {
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
    else jumpCount++;
    branchSymbols.push(symbol);
  }
  batchSlots.push(...entry.literals.map(({ symbol }) => symbol));
}
const branchSiteCounts = new Map();
for (const symbol of branchSymbols) branchSiteCounts.set(symbol, (branchSiteCounts.get(symbol) ?? 0) + 1);
if (bodyBytes !== 524 || callCount !== 12 || jumpCount !== 8 || branchSymbols.length !== 20 ||
    branchSiteCounts.size !== 5 || branchSiteCounts.get("func_00124880") !== 8 ||
    branchSiteCounts.get("func_00124FB0") !== 8 || branchSiteCounts.get("func_00160380") !== 2 ||
    branchSiteCounts.get("func_001602B8") !== 1 || branchSiteCounts.get("func_001F4A1C") !== 1 ||
    batchSlots.length !== 5 || new Set(batchSlots).size !== 5 ||
    JSON.stringify(batchSlots) !== JSON.stringify(literalIdentities)) {
  fail("body, branch, or literal cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 18 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 507 || new Set(priorSlots).size !== 238 ||
    literalIdentities.some((identity) => priorSlots.includes(identity)) ||
    priorSlots.length + batchSlots.length !== 512 ||
    new Set([...priorSlots, ...batchSlots]).size !== 243) {
  fail("prior IPC pool or batch-local freshness contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 8 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 8 ||
    (source.match(/^\.word service_(?:seed_halfword|request_kind|lock_object|operation_object|result_object)_33$/gm) ?? []).length !== 5) {
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
    manifest.sourceSha256 !== "2ce57845445d2ea880e118deed800e846f0c8b0d9a9beae4d4f8d88021db41bf") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "a2d36a526cc2468c5297b03e61ae1bc9984b2f03454d613cde91488552d34411") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-33.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 512-slot/243-class IPC structure for 8 ARM service wrappers (524 bytes, 20 branches, 5 symbolic pool slots).");
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
  if (!section || section.size !== entry.size + entry.literals.length * 4 || !section.flags.includes("A") ||
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
for (const identity of new Set(branchSymbols)) {
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
console.log("Validated 8 ARM service wrapper sections, 20 branch relocations, and 5 ordered literal relocations (524 bytes).");
