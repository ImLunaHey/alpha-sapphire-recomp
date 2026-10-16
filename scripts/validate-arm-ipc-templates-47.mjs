import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-47.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_47.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 47 validation failed: ${message}`); };

const primaryEntries = [
  "func_00170548", "func_001602B8", "func_00160380", "func_001745F8",
  "func_00173E98", "func_001706F8", "func_00174704", "func_0017080C",
  "func_0017E47C", "func_00178228", "func_00144D04", "func_001603A0",
];
const secondaryEntries = ["service_queue_finalize_secondary_47"];
const literalSequence = manifest.functions?.flatMap((entry) =>
  entry.literals?.map((literal) => literal.symbol) ?? []) ?? [];
const bodyBytes = manifest.functions?.reduce((sum, entry) => sum + entry.size, 0);
const branchCount = manifest.functions?.reduce((sum, entry) => sum + entry.branches.length, 0);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_47.S" ||
    manifest.sourceSha256 !== "f503115c4af8f7771454d63d9dbc10bf9f2a3c56cd680beb4b1a9e91c931859e" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 988 || bodyBytes !== 988 ||
    manifest.cumulativePoolSlots !== 612 || manifest.cumulativePoolClasses !== 312 ||
    manifest.functions?.length !== 6 || branchCount !== 21 || literalSequence.length !== 18 ||
    new Set(literalSequence).size !== 15 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify([...new Set(literalSequence)]) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify([
      "service_unlink_context_44", "service_owned_handle_41",
      "service_guard_state_41", "service_finalize_token_41", "ipc_handle_slot_xi",
    ]) || JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify([
      "service_transfer_active_error_47", "service_transfer_alignment_error_47",
      "service_transfer_allocation_error_47", "service_ref_lock_47", "service_ref_count_47",
      "service_ref_empty_marker_47", "service_queue_state_47",
      "service_queue_finalize_token_47", "service_name_47", "service_handle_state_error_47",
    ]) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries,
      sharedClasses: [
        { symbol: "func_001602B8", siteCount: 3 },
        { symbol: "func_00160380", siteCount: 5 },
        { symbol: "func_001745F8", siteCount: 2 },
        { symbol: "func_001603A0", siteCount: 2 },
      ],
      singletonClasses: [
        "func_00170548", "service_queue_finalize_secondary_47", "func_00173E98",
        "func_001706F8", "func_00174704", "func_0017080C", "func_0017E47C",
        "func_00178228", "func_00144D04",
      ],
      classesPairwiseDistinct: true,
    })) {
  fail("unexpected positional relocation manifest contract");
}

const names = new Set();
for (const entry of manifest.functions) {
  if (!/^func_[0-9A-F]{8}$/.test(entry.name) || names.has(entry.name) ||
      !Number.isInteger(entry.size) || entry.size <= 0 || entry.size % 4 !== 0 ||
      !Array.isArray(entry.branches) || !Array.isArray(entry.literals)) {
    fail(`invalid function entry ${entry.name ?? "<unnamed>"}`);
  }
  names.add(entry.name);
  for (const branch of entry.branches) {
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    if (!Number.isInteger(branch.offset) || branch.offset < 0 || branch.offset >= entry.size ||
        branch.offset % 4 !== 0 || !["bl", "blne"].includes(branch.mnemonic) ||
        branch.kind !== expectedKind ||
        ![...primaryEntries, ...secondaryEntries].includes(branch.symbol)) {
      fail(`invalid branch mapping in ${entry.name}`);
    }
  }
  entry.literals.forEach((literal, index) => {
    if (literal.offset !== entry.size + index * 4 ||
        !manifest.literalIdentities.includes(literal.symbol)) {
      fail(`invalid literal mapping in ${entry.name}`);
    }
  });
}

const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
if (sourceHash !== manifest.sourceSha256) fail("source SHA-256 does not match the manifest");

let objectPath = process.argv[2];
let readelf = process.argv[3];
let scratch;
if (!objectPath) {
  const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }).trim().split(/\s+/).at(-1);
  const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }).trim();
  const compiler = findTool("arm-none-eabi-gcc");
  readelf = findTool("arm-none-eabi-readelf");
  if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
  scratch = mkdtempSync(join(tmpdir(), "arm-ipc-47-"));
  objectPath = join(scratch, "arm_ipc_templates_47.o");
  execFileSync(compiler, [
    "-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding",
    "-fno-pic", "-fno-pie", "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c",
    sourcePath, "-o", objectPath,
  ], { stdio: "pipe", maxBuffer: 16 * 1024 * 1024 });
}
if (!readelf) fail("readelf path is required when validating an object");

try {
  const output = execFileSync(readelf, ["-SWsWr", objectPath],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const sections = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\.text\.func_[0-9A-F]{8})\s+PROGBITS\s+\S+\s+\S+\s+([0-9a-fA-F]+)/);
    if (match) sections.set(match[1], Number.parseInt(match[2], 16));
  }
  const functionSizes = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\d+:\s+[0-9a-fA-F]+\s+(\d+)\s+FUNC\s+GLOBAL\s+\S+\s+\S+\s+(func_[0-9A-F]{8})\s*$/);
    if (match) functionSizes.set(match[2], Number.parseInt(match[1], 10));
  }
  const relocations = new Map();
  let current;
  for (const line of output.split("\n")) {
    const heading = line.match(/^Relocation section '\.rel(\.text\.func_[0-9A-F]{8})'/);
    if (heading) {
      current = heading[1];
      relocations.set(current, []);
      continue;
    }
    const relocation = line.match(/^([0-9a-fA-F]{8})\s+\S+\s+(R_ARM_[A-Z0-9_]+)\s+\S+\s+(\S+)/);
    if (current && relocation) {
      relocations.get(current).push({
        offset: Number.parseInt(relocation[1], 16), type: relocation[2], symbol: relocation[3],
      });
    }
  }
  for (const entry of manifest.functions) {
    const section = `.text.${entry.name}`;
    if (sections.get(section) !== entry.size + entry.literals.length * 4)
      fail(`unexpected section size for ${entry.name}`);
    if (functionSizes.get(entry.name) !== entry.size) fail(`unexpected function size for ${entry.name}`);
    const expected = [
      ...entry.branches.map((branch) => ({ offset: branch.offset, type: branch.kind, symbol: branch.symbol })),
      ...entry.literals.map((literal) => ({ offset: literal.offset, type: "R_ARM_ABS32", symbol: literal.symbol })),
    ].sort((a, b) => a.offset - b.offset);
    const actual = (relocations.get(section) ?? []).sort((a, b) => a.offset - b.offset);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`unexpected relocations for ${entry.name}`);
  }
  console.log("Validated ARM IPC template batch 47 (988 body bytes, 21 branches, 18 literal slots).");
} finally {
  if (scratch) rmSync(scratch, { recursive: true, force: true });
}
