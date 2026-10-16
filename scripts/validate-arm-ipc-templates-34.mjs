import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-34.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_34.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 34 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_00109738", 40, [[12, "R_ARM_CALL", "bl", "func_00124880"], [32, "R_ARM_JUMP24", "b", "func_00124FB0"]], []],
  ["func_0010EFD8", 52, [[28, "R_ARM_CALL", "bl", "func_00124880"], [40, "R_ARM_JUMP24", "blne", "func_00124FB0"]], [[52, "service_seed_byte_34"], [56, "service_request_kind_alpha_34"]]],
  ["func_0010F014", 116, [[32, "R_ARM_CALL", "bl", "func_00118C2C"], [52, "R_ARM_JUMP24", "blne", "func_00124FB0"], [68, "R_ARM_CALL", "bl", "func_00124880"], [80, "R_ARM_JUMP24", "blne", "func_00124FB0"], [92, "R_ARM_CALL", "bl", "service_publish_operation_34"]], [[116, "service_guard_state_34"]]],
  ["func_0010F158", 40, [[16, "R_ARM_CALL", "bl", "func_00124880"], [28, "R_ARM_JUMP24", "blne", "func_00124FB0"]], [[40, "service_request_kind_beta_34"]]],
  ["func_0010F184", 108, [[32, "R_ARM_CALL", "bl", "func_00118C2C"], [52, "R_ARM_JUMP24", "blne", "func_00124FB0"], [68, "R_ARM_CALL", "bl", "func_00124880"], [80, "R_ARM_JUMP24", "blne", "func_00124FB0"], [92, "R_ARM_CALL", "bl", "service_publish_operation_34"]], [[108, "service_guard_state_34"]]],
  ["func_0011863C", 68, [[36, "R_ARM_CALL", "bl", "func_00124880"], [48, "R_ARM_JUMP24", "blne", "func_00124FB0"]], [[68, "service_request_kind_gamma_34"]]],
  ["func_0012439C", 152, [[20, "R_ARM_CALL", "bl", "func_00124880"], [32, "R_ARM_JUMP24", "blne", "func_00124FB0"], [48, "R_ARM_CALL", "bl", "func_00124880"], [60, "R_ARM_JUMP24", "blne", "func_00124FB0"], [80, "R_ARM_CALL", "bl", "func_00145FC0"], [92, "R_ARM_JUMP24", "blne", "func_00124FB0"]], [[152, "service_request_kind_delta_34"]]],
];
const literalIdentities = [
  "service_seed_byte_34", "service_request_kind_alpha_34", "service_guard_state_34",
  "service_request_kind_beta_34", "service_request_kind_gamma_34", "service_request_kind_delta_34",
];
const branchIdentityContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries: ["func_00124880", "func_00124FB0", "func_00118C2C", "service_publish_operation_34", "func_00145FC0"],
  sharedClasses: [
    { symbol: "func_00124880", siteCount: 8 },
    { symbol: "func_00124FB0", siteCount: 11 },
    { symbol: "func_00118C2C", siteCount: 2 },
    { symbol: "service_publish_operation_34", siteCount: 2 },
  ],
  singletonClasses: ["func_00145FC0"],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_34.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 576 ||
    manifest.cumulativePoolSlots !== 519 || manifest.cumulativePoolClasses !== 249 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 7) {
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
const expectedSlots = [
  "service_seed_byte_34", "service_request_kind_alpha_34", "service_guard_state_34",
  "service_request_kind_beta_34", "service_guard_state_34", "service_request_kind_gamma_34",
  "service_request_kind_delta_34",
];
if (bodyBytes !== 576 || callCount !== 13 || jumpCount !== 11 || branchSymbols.length !== 24 ||
    branchSiteCounts.size !== 5 || branchSiteCounts.get("func_00124880") !== 8 ||
    branchSiteCounts.get("func_00124FB0") !== 11 || branchSiteCounts.get("func_00118C2C") !== 2 ||
    branchSiteCounts.get("service_publish_operation_34") !== 2 || branchSiteCounts.get("func_00145FC0") !== 1 ||
    JSON.stringify(batchSlots) !== JSON.stringify(expectedSlots) || new Set(batchSlots).size !== 6) {
  fail("body, branch, or literal cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 19 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
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
if (priorSlots.length !== 512 || new Set(priorSlots).size !== 243 ||
    literalIdentities.some((identity) => priorSlots.includes(identity)) ||
    priorSlots.length + batchSlots.length !== 519 ||
    new Set([...priorSlots, ...batchSlots]).size !== 249) {
  fail("prior IPC pool or batch-local freshness contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 7 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 7 ||
    (source.match(/^\.word service_(?:seed_byte|request_kind_alpha|guard_state|request_kind_beta|request_kind_gamma|request_kind_delta)_34$/gm) ?? []).length !== 7) {
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
    manifest.sourceSha256 !== "8255a430cc0f62af62ec78da6df98be2ffe3fe1a4bc75cdd8bef3dcffad75377") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !== "cfa1fcdc79ecb58e69a87e9d60a044f3eef88633b2e685c436dd5bb8bade781e") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-34.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 519-slot/249-class IPC structure for 7 ARM service wrappers (576 bytes, 24 branches, 7 symbolic pool slots)." );
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
console.log("Validated 7 ARM service wrapper sections, 24 branch relocations, and 7 ordered literal relocations (576 bytes)." );
