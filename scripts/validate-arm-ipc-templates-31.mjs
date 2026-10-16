import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-31.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_31.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 31 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_002C5C4C", 36, 3, ["service_state_block_31"]],
  ["func_002C5C74", 28, 2, []],
  ["func_002C5D80", 56, 2, ["service_session_handle_31"]],
  ["func_002C5DBC", 28, 2, []],
  ["func_002C5DD8", 56, 2, ["service_session_handle_31"]],
  ["func_002C5E14", 160, 7, ["service_initialized_byte_31", "service_open_accepted_status_31"]],
  ["func_002C5EBC", 28, 2, []],
  ["func_002C5ED8", 28, 2, []],
  ["func_002C5EF4", 28, 2, []],
  ["func_002C5F10", 36, 2, ["service_query_accepted_status_31"]],
  ["func_002C5F38", 28, 2, []],
  ["func_002C5F54", 28, 2, []],
  ["func_002C5F70", 28, 2, []],
  ["func_002C601C", 64, 2, []],
  ["func_002C60CC", 28, 2, []],
  ["func_002C60E8", 28, 2, []],
];
const literalIdentities = [
  "service_state_block_31", "service_session_handle_31",
  "service_initialized_byte_31", "service_open_accepted_status_31",
  "service_query_accepted_status_31",
];
const branchIdentityContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries: [
    "service_shutdown_prepare_31", "service_shutdown_secondary_31",
    "service_shutdown_finish_31", "func_002C6104", "func_002C6254",
    "func_002C62B0", "func_002C62EC", "service_startup_31",
    "runtime_failure_raise_entry_31", "service_request_size_31", "func_002C6450",
    "func_002C6378", "func_002C63B4", "func_002C63E4", "func_002C6420",
    "func_002C6480", "func_002C64BC", "func_002C64F8", "func_002C6534",
    "func_002C65E8", "func_002C6624",
  ],
  secondaryEntries: ["service_open_31"],
  sharedClasses: [{ symbol: "runtime_failure_raise_entry_31", siteCount: 17 }],
  singletonClasses: [
    "service_shutdown_prepare_31", "service_shutdown_secondary_31",
    "service_shutdown_finish_31", "func_002C6104", "func_002C6254",
    "func_002C62B0", "func_002C62EC", "service_startup_31",
    "service_request_size_31", "service_open_31", "func_002C6450",
    "func_002C6378", "func_002C63B4", "func_002C63E4", "func_002C6420",
    "func_002C6480", "func_002C64BC", "func_002C64F8", "func_002C6534",
    "func_002C65E8", "func_002C6624",
  ],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_31.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 688 ||
    manifest.cumulativePoolSlots !== 474 || manifest.cumulativePoolClasses !== 237 ||
    manifest.sharedBranchIdentity !== "runtime_failure_raise_entry_31" ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 16) {
  fail("unexpected manifest schema, totals, or identity contract");
}

let bodyBytes = 0;
let branchCount = 0;
let callCount = 0;
let jumpCount = 0;
let failureCount = 0;
const batchSlots = [];
const operationSymbols = [];
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, branches, literals] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.branches) ||
      entry.branches.length !== branches || !Array.isArray(entry.literals) ||
      JSON.stringify(entry.literals.map(({ symbol }) => symbol)) !== JSON.stringify(literals)) {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  let previous = -1;
  for (const branch of entry.branches) {
    if (!Number.isInteger(branch.offset) || branch.offset < 0 || branch.offset >= size ||
        branch.offset % 4 !== 0 || branch.offset <= previous ||
        !["R_ARM_CALL", "R_ARM_JUMP24"].includes(branch.kind) ||
        !["bl", "blne", "b"].includes(branch.mnemonic) || typeof branch.symbol !== "string" ||
        (branch.kind === "R_ARM_CALL") !== (branch.mnemonic === "bl")) {
      fail(`invalid branch ledger for ${name}`);
    }
    previous = branch.offset;
    branchCount++;
    if (branch.kind === "R_ARM_CALL") callCount++;
    else jumpCount++;
    if (branch.symbol === manifest.sharedBranchIdentity) failureCount++;
    else operationSymbols.push(branch.symbol);
  }
  for (let literalIndex = 0; literalIndex < entry.literals.length; literalIndex++) {
    const literal = entry.literals[literalIndex];
    if (literal.offset !== size + literalIndex * 4 || !literalIdentities.includes(literal.symbol)) {
      fail(`invalid literal ledger for ${name}`);
    }
    batchSlots.push(literal.symbol);
  }
  bodyBytes += size;
}
if (bodyBytes !== 688 || branchCount !== 38 || callCount !== 20 || jumpCount !== 18 ||
    failureCount !== 17 || operationSymbols.length !== 21 || new Set(operationSymbols).size !== 21 ||
    batchSlots.length !== 6 || new Set(batchSlots).size !== 5) {
  fail("body, branch, operation, or literal cardinality differs");
}
const configuredBranchSymbols = new Set([
  ...branchIdentityContract.primaryEntries, ...branchIdentityContract.secondaryEntries,
]);
if (configuredBranchSymbols.size !== 22 ||
    operationSymbols.some((symbol) => !configuredBranchSymbols.has(symbol)) ||
    !configuredBranchSymbols.has(manifest.sharedBranchIdentity)) {
  fail("branch identity entry classification differs");
}
const secondarySites = manifest.functions.flatMap((entry) => entry.branches.map((branch) => ({
  functionName: entry.name, ...branch,
}))).filter(({ symbol }) => branchIdentityContract.secondaryEntries.includes(symbol));
if (secondarySites.length !== 1 || secondarySites[0].functionName !== "func_002C5E14" ||
    secondarySites[0].offset !== 68 || secondarySites[0].kind !== "R_ARM_CALL" ||
    secondarySites[0].mnemonic !== "bl") {
  fail("secondary-entry ARM BL contract differs");
}
if (batchSlots.filter((symbol) => symbol === "service_session_handle_31").length !== 2) {
  fail("literal equality pair differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 16 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
];
const priorSlots = [];
for (const name of priorNames) {
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") priorSlots.push(entry[key]);
    }
  }
}
if (priorSlots.length !== 468 || new Set(priorSlots).size !== 232 ||
    batchSlots.some((identity) => priorSlots.includes(identity)) ||
    priorSlots.length + batchSlots.length !== 474 ||
    new Set([...priorSlots, ...batchSlots]).size !== 237) {
  fail("prior IPC pool or batch-local freshness contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 16 ||
    (source.match(/^EP1 func_/gm) ?? []).length !== 4 ||
    (source.match(/^EP2 func_/gm) ?? []).length !== 1 ||
    (source.match(/^E func_/gm) ?? []).length !== 11 ||
    (source.match(/^svc #35$/gm) ?? []).length !== 2) {
  fail("function, pool, or SVC counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
for (const line of source.match(/^\s*\.word\s+.+$/gm) ?? []) {
  if (!/^\s*\.word\s+\\p[01]?$/.test(line)) fail("pool words must use named symbolic identities");
}
if ((source.match(/^blx\s+/gm) ?? []).length !== 0) fail("BLX transfers are forbidden");
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "b50982d34f8a140487651085d107def2df5890d05302b77fcf00f658d655ff84") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "bd79d8c3d2b2abc8e21d8cf5488bf7874d62e35d0d1db0c2ed8be5b59151a1a5") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-31.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and 474-slot/237-class IPC structure for 16 ARM service wrappers (688 bytes, 38 branches, 6 symbolic pool slots).");
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
  if (!section || section.size !== entry.size + entry.literals.length * 4 ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    fail(`invalid section for ${entry.name}`);
  }
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
for (const identity of new Set([...operationSymbols, manifest.sharedBranchIdentity])) {
  const symbol = symbols.get(identity) ?? [];
  const external = symbol.length === 1 && symbol[0].value === 0 && symbol[0].size === 0 &&
    ["NOTYPE", "FUNC"].includes(symbol[0].type) && symbol[0].binding === "GLOBAL" && symbol[0].section === "UND";
  const definedFunction = symbol.length === 1 && symbol[0].type === "FUNC" &&
    symbol[0].binding === "GLOBAL" && symbol[0].section !== "UND";
  if (!external && !definedFunction) {
    fail(`invalid symbolic identity ${identity}`);
  }
}
for (const identity of new Set(batchSlots)) {
  const symbol = symbols.get(identity) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== 0 ||
      symbol[0].type !== "NOTYPE" || symbol[0].binding !== "GLOBAL" || symbol[0].section !== "UND") {
    fail(`invalid literal identity ${identity}`);
  }
}
console.log("Validated 16 ARM service-wrapper sections, 38 branch relocations, and 6 ordered literal relocations (688 bytes).");
