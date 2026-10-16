import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-46.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sourcePath = join(root, manifest.source ?? "");
const source = readFileSync(sourcePath);
const sourceSha256 = createHash("sha256").update(source).digest("hex");

const expectedFunctions = new Map([
  ["func_00201668", [108, 3, 5]],
  ["func_002C36DC", [112, 3, 2]],
  ["func_0010FCF4", [132, 6, 5]],
  ["func_0015FFE8", [136, 2, 2]],
  ["func_001D2314", [136, 1, 3]],
  ["func_002C3404", [136, 3, 5]],
]);
const expectedShared = new Map([
  ["func_00146000", 3],
  ["func_001602B8", 3],
  ["func_00160380", 4],
  ["func_00125E50", 2],
]);
const expectedPrimary = [
  "func_00146000", "func_002DD944", "func_001602B8", "func_00160380",
  "func_00125E50", "func_002FF034", "func_0015EC10", "func_00529BDC",
];
const expectedSecondary = ["service_open_31", "service_scale_dispatch_secondary_46"];

function fail(message) {
  throw new Error(`ARM IPC template 46 validation failed: ${message}`);
}

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_46.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 760 ||
    manifest.cumulativePoolSlots !== 594 || manifest.cumulativePoolClasses !== 302 ||
    manifest.sourceSha256 !== sourceSha256 || manifest.functions?.length !== 6) {
  fail("unexpected manifest header, totals, or source digest");
}

let totalBytes = 0;
let totalBranches = 0;
let totalSlots = 0;
const seenFunctions = new Set();
const branchCounts = new Map();
const literalSequence = [];
for (const entry of manifest.functions) {
  const expected = expectedFunctions.get(entry?.name);
  if (!expected || seenFunctions.has(entry.name) || entry.size !== expected[0] ||
      entry.branches?.length !== expected[1] || entry.literals?.length !== expected[2]) {
    fail(`invalid function entry ${entry?.name ?? "<missing>"}`);
  }
  seenFunctions.add(entry.name);
  totalBytes += entry.size;
  totalBranches += entry.branches.length;
  totalSlots += entry.literals.length;
  for (const branch of entry.branches) {
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    if (!Number.isInteger(branch.offset) || branch.offset < 0 || branch.offset >= entry.size ||
        branch.offset % 4 !== 0 || !["bl", "blne", "b"].includes(branch.mnemonic) ||
        branch.kind !== expectedKind || typeof branch.symbol !== "string") {
      fail(`invalid branch in ${entry.name} at ${branch.offset}`);
    }
    branchCounts.set(branch.symbol, (branchCounts.get(branch.symbol) ?? 0) + 1);
  }
  for (let index = 0; index < entry.literals.length; index += 1) {
    const literal = entry.literals[index];
    if (literal.offset !== entry.size + index * 4 || typeof literal.symbol !== "string") {
      fail(`invalid positional literal in ${entry.name}`);
    }
    literalSequence.push(literal.symbol);
  }
}
if (totalBytes !== 760 || totalBranches !== 18 || totalSlots !== 22 ||
    seenFunctions.size !== expectedFunctions.size) {
  fail("unexpected aggregate function, branch, or literal count");
}
if (JSON.stringify(literalSequence) !== JSON.stringify(manifest.literalIdentities) ||
    new Set(literalSequence).size !== 22) {
  fail("literal positions and identities are not a 22-slot bijection");
}
const reused = new Set(manifest.reusedLiteralIdentities);
const fresh = new Set(manifest.newLiteralIdentities);
if (reused.size !== 6 || fresh.size !== 16 ||
    [...reused].some((identity) => fresh.has(identity) || !literalSequence.includes(identity)) ||
    [...fresh].some((identity) => !literalSequence.includes(identity))) {
  fail("invalid reused/new literal partition");
}

const contract = manifest.branchIdentityContract;
const allBranchIdentities = [...expectedPrimary, ...expectedSecondary];
if (contract?.mode !== "arm" || contract.minimumAlignment !== 4 ||
    JSON.stringify(contract.primaryEntries) !== JSON.stringify(expectedPrimary) ||
    JSON.stringify(contract.secondaryEntries) !== JSON.stringify(expectedSecondary) ||
    contract.classesPairwiseDistinct !== true || branchCounts.size !== allBranchIdentities.length ||
    allBranchIdentities.some((identity) => !branchCounts.has(identity)) ||
    [...expectedShared].some(([identity, count]) => branchCounts.get(identity) !== count) ||
    allBranchIdentities.some((identity) =>
      !expectedShared.has(identity) && branchCounts.get(identity) !== 1)) {
  fail("invalid branch identity contract");
}

const [objectPath, readelf = "arm-none-eabi-readelf"] = process.argv.slice(2);
if (objectPath !== undefined) {
  const result = spawnSync(readelf, ["--symbols", "--relocs", "--wide", objectPath], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  const output = result.stdout;
  for (const entry of manifest.functions) {
    const symbolPattern = new RegExp(
      `\\b[0-9a-fA-F]+\\s+${entry.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${entry.name}\\b`
    );
    if (!symbolPattern.test(output)) fail(`missing or incorrectly sized symbol ${entry.name}`);

    const sectionPattern = new RegExp(
      `Relocation section '\\.?rel\\.text\\.${entry.name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}'[\\s\\S]*?(?=Relocation section |Symbol table |$)`
    );
    const block = output.match(sectionPattern)?.[0];
    if (block === undefined) fail(`missing relocation section for ${entry.name}`);
    const actual = [...block.matchAll(/^([0-9a-fA-F]{8})\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/gm)]
      .map((match) => ({ offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3] }));
    const wanted = [
      ...entry.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol })),
      ...entry.literals.map(({ offset, symbol }) => ({ offset, kind: "R_ARM_ABS32", symbol })),
    ].sort((a, b) => a.offset - b.offset);
    actual.sort((a, b) => a.offset - b.offset);
    if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
      fail(`unexpected positional relocations for ${entry.name}`);
    }
  }
}

console.log("Validated ARM IPC template batch 46 (760 body bytes, 18 branches, 22 literal slots).");
