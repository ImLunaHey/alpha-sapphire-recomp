import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const configPath = join(root, "config/arm-ipc-templates-59.json");
const priorConfigPath = join(root, "config/arm-ipc-templates-58.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const priorConfig = JSON.parse(readFileSync(priorConfigPath, "utf8"));
const objectPath = process.argv[2];
const readelf = process.argv[3];

const expectedPrimaryEntries = [
  "func_0016B378", "func_00176AE8", "func_00176A74", "func_0017D058",
  "func_0017CEC0", "func_001766C4", "func_00176700", "func_001768FC",
  "func_00176920", "func_001769D8", "func_001769A0", "func_0017697C",
  "func_001767C0", "func_0017673C", "func_001766A4", "func_0017694C",
  "func_001769CC", "func_001767CC", "func_001767F4",
];
const expectedSharedClasses = [
  { symbol: "func_0017D058", siteCount: 4 },
  { symbol: "func_00176700", siteCount: 2 },
];
const expectedSingletonClasses = expectedPrimaryEntries.filter(
  (symbol) => !expectedSharedClasses.some((entry) => entry.symbol === symbol),
);

function fail(message) {
  throw new Error(`ARM IPC template 59 validation failed: ${message}`);
}

if (config.schemaVersion !== 1 || config.source !== "src/main/arm_ipc_templates_59.S" ||
    config.mode !== "arm" || config.totalBodySize !== 1484 ||
    config.cumulativePoolSlots !== 684 || config.cumulativePoolClasses !== 363 ||
    !Array.isArray(config.functions) || config.functions.length !== 22 ||
    JSON.stringify(config.literalIdentities) !== "[]" ||
    JSON.stringify(config.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(config.newLiteralIdentities) !== "[]") {
  fail("unexpected manifest header or literal accounting");
}
if (priorConfig.cumulativePoolSlots !== 684 || priorConfig.cumulativePoolClasses !== 363 ||
    config.cumulativePoolSlots !== priorConfig.cumulativePoolSlots ||
    config.cumulativePoolClasses !== priorConfig.cumulativePoolClasses) {
  fail("cumulative literal accounting does not remain at 684 slots in 363 classes");
}

const sourcePath = join(root, config.source);
const source = readFileSync(sourcePath);
const sourceSha256 = createHash("sha256").update(source).digest("hex");
if (config.sourceSha256 !== sourceSha256) fail("source SHA-256 does not match the manifest");

const functions = new Map();
let totalBodySize = 0;
let totalBranches = 0;
const siteCounts = new Map();
for (const entry of config.functions) {
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      !Number.isInteger(entry.size) || entry.size <= 0 || entry.size % 4 !== 0 ||
      !Array.isArray(entry.branches) || !Array.isArray(entry.literals) || entry.literals.length !== 0 ||
      functions.has(entry.name)) {
    fail("invalid or duplicate function entry");
  }
  const offsets = new Set();
  for (const branch of entry.branches) {
    if (branch === null || typeof branch !== "object" ||
        !Number.isInteger(branch.offset) || branch.offset < 0 || branch.offset >= entry.size ||
        branch.offset % 4 !== 0 || branch.kind !== "R_ARM_CALL" || branch.mnemonic !== "bl" ||
        !expectedPrimaryEntries.includes(branch.symbol) || offsets.has(branch.offset)) {
      fail(`invalid branch entry for ${entry.name}`);
    }
    offsets.add(branch.offset);
    siteCounts.set(branch.symbol, (siteCounts.get(branch.symbol) ?? 0) + 1);
  }
  functions.set(entry.name, entry);
  totalBodySize += entry.size;
  totalBranches += entry.branches.length;
}
if (totalBodySize !== config.totalBodySize || totalBranches !== 23) {
  fail("configured totals are not 1,484 body bytes and 23 call sites");
}
if (siteCounts.size !== 19 || expectedPrimaryEntries.some((symbol) => {
  const shared = expectedSharedClasses.find((entry) => entry.symbol === symbol);
  return siteCounts.get(symbol) !== (shared?.siteCount ?? 1);
})) {
  fail("call-site identity multiplicities are invalid");
}

const contract = config.branchIdentityContract;
if (contract?.mode !== "arm" || contract.minimumAlignment !== 4 ||
    JSON.stringify(contract.primaryEntries) !== JSON.stringify(expectedPrimaryEntries) ||
    JSON.stringify(contract.secondaryEntries) !== "[]" ||
    JSON.stringify(contract.sharedClasses) !== JSON.stringify(expectedSharedClasses) ||
    JSON.stringify(contract.singletonClasses) !== JSON.stringify(expectedSingletonClasses) ||
    contract.classesPairwiseDistinct !== true) {
  fail("branch identity contract is invalid");
}

if (objectPath === undefined && readelf === undefined) {
  console.log("Validated deterministic source coverage for ARM IPC template 59: 22 functions, 1,484 bytes, 23 symbolic calls, zero literal slots, cumulative 684/363.");
  process.exit(0);
}
if (objectPath === undefined || readelf === undefined) {
  fail("object and readelf paths must be provided together");
}
if (!existsSync(objectPath)) fail(`object does not exist: ${objectPath}`);
function runReadelf(args) {
  const result = spawnSync(readelf, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  return result.stdout;
}

const symbolsOutput = runReadelf(["--symbols", "--wide", objectPath]);
const symbols = new Map();
for (const line of symbolsOutput.split(/\r?\n/)) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+FUNC\s+GLOBAL\s+\S+\s+(\d+)\s+(\S+)\s*$/);
  if (match) symbols.set(match[4], { value: Number.parseInt(match[1], 16), size: Number(match[2]), section: Number(match[3]) });
}
for (const entry of config.functions) {
  const symbol = symbols.get(entry.name);
  if (symbol?.size !== entry.size || symbol.value % 4 !== 0) {
    fail(`${entry.name} is missing, misaligned, or has an unexpected body size`);
  }
}

const relocationsOutput = runReadelf(["--relocs", "--wide", objectPath]);
const relocationsBySection = new Map();
let relocationSection;
for (const line of relocationsOutput.split(/\r?\n/)) {
  const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
  if (heading) {
    relocationSection = heading[1];
    if (!relocationsBySection.has(relocationSection)) relocationsBySection.set(relocationSection, []);
    continue;
  }
  const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_[A-Z0-9_]+)\s+[0-9a-fA-F]+\s+(\S+)/);
  if (match && relocationSection) {
    relocationsBySection.get(relocationSection).push({
      offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3],
    });
  }
}
let checkedBranches = 0;
for (const entry of config.functions) {
  const section = `.text.${entry.name}`;
  const relocations = relocationsBySection.get(section) ?? [];
  const relevant = relocations.filter((relocation) => relocation.offset < entry.size);
  if (relevant.length !== entry.branches.length) {
    fail(`${entry.name} has ${relevant.length} body relocations; expected ${entry.branches.length}`);
  }
  for (const branch of entry.branches) {
    if (!relevant.some((relocation) => relocation.offset === branch.offset &&
        relocation.kind === branch.kind && relocation.symbol === branch.symbol)) {
      fail(`${entry.name} is missing ${branch.kind} to ${branch.symbol} at offset ${branch.offset}`);
    }
    checkedBranches++;
  }
}
if (checkedBranches !== 23) fail("did not verify all 23 symbolic calls");

console.log("ARM IPC template 59 validation passed: 22 functions, 1,484 bytes, 23 symbolic calls, zero literal slots, cumulative 684/363.");
