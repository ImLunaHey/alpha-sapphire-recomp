import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-48.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_48.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 48 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;

const primaryEntries = [
  "func_001602B8", "func_001608E4", "func_00160380", "func_00170A3C",
  "func_0014967C", "func_00174848", "func_001342C8",
];
const literalIdentities = [
  "service_queue_core_state_48", "service_queue_submit_error_48",
  "service_session_lock_48", "service_session_state_48",
];
const literalSequence = manifest.functions?.flatMap((entry) =>
  entry.literals?.map((literal) => literal.symbol) ?? []) ?? [];
const bodyBytes = manifest.functions?.reduce((sum, entry) => sum + entry.size, 0);
const branchCount = manifest.functions?.reduce((sum, entry) => sum + entry.branches.length, 0);

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_48.S" ||
    manifest.sourceSha256 !== "b39863a8d60fe67aca4d9fb05b0a1f5e3638f80a77e8f841d3d7cf366aa068a1" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 492 || bodyBytes !== 492 ||
    manifest.cumulativePoolSlots !== 622 || manifest.cumulativePoolClasses !== 316 ||
    manifest.functions?.length !== 6 || branchCount !== 19 || literalSequence.length !== 10 ||
    new Set(literalSequence).size !== 4 ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries: [],
      sharedClasses: [
        { symbol: "func_001602B8", siteCount: 6 },
        { symbol: "func_00160380", siteCount: 6 },
        { symbol: "func_00170A3C", siteCount: 2 },
        { symbol: "func_0014967C", siteCount: 2 },
      ],
      singletonClasses: ["func_001608E4", "func_00174848", "func_001342C8"],
      classesPairwiseDistinct: true,
    })) {
  fail("unexpected positional relocation manifest contract");
}

const names = new Set();
const branchCounts = new Map();
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
        branch.offset % 4 !== 0 || !["bl", "b"].includes(branch.mnemonic) ||
        branch.kind !== expectedKind || !primaryEntries.includes(branch.symbol)) {
      fail(`invalid branch mapping in ${entry.name}`);
    }
    branchCounts.set(branch.symbol, (branchCounts.get(branch.symbol) ?? 0) + 1);
  }
  entry.literals.forEach((literal, index) => {
    if (literal.offset !== entry.size + index * 4 || !literalIdentities.includes(literal.symbol)) {
      fail(`invalid literal mapping in ${entry.name}`);
    }
  });
}
if (branchCounts.size !== 7 || primaryEntries.some((symbol) => !branchCounts.has(symbol))) {
  fail("branch identities are incomplete");
}

const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
if (sourceHash !== manifest.sourceSha256) fail("source SHA-256 does not match the manifest");

let objectPath = process.argv[2];
let readelf = process.argv[3];
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-48-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_48.o");
    execFileSync(compiler, [
      "-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding",
      "-fno-pic", "-fno-pie", "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c",
      sourcePath, "-o", objectPath,
    ], { stdio: "pipe", maxBuffer });
  }
  if (!readelf) fail("readelf path is required when validating an object");
  const objdump = readelf.replace(/readelf$/, "objdump");
  for (const entry of manifest.functions) {
    const section = `.text.${entry.name}`;
    const output = execFileSync(objdump, ["-htr", "-j", section, objectPath], {
      encoding: "utf8", maxBuffer,
    });
    const sectionMatch = output.match(new RegExp(
      `^\\s*\\d+\\s+${section.replaceAll(".", "\\.")}\\s+([0-9a-fA-F]+)`, "m"));
    if (Number.parseInt(sectionMatch?.[1] ?? "", 16) !== entry.size + entry.literals.length * 4)
      fail(`unexpected section size for ${entry.name}`);
    const symbolMatch = output.match(new RegExp(
      `^[0-9a-fA-F]+\\s+g\\s+F\\s+${section.replaceAll(".", "\\.")}\\s+([0-9a-fA-F]+)\\s+${entry.name}$`, "m"));
    if (Number.parseInt(symbolMatch?.[1] ?? "", 16) !== entry.size)
      fail(`unexpected function size for ${entry.name}`);
    const expected = [
      ...entry.branches.map((branch) => ({ offset: branch.offset, type: branch.kind, symbol: branch.symbol })),
      ...entry.literals.map((literal) => ({ offset: literal.offset, type: "R_ARM_ABS32", symbol: literal.symbol })),
    ].sort((a, b) => a.offset - b.offset);
    const actual = [...output.matchAll(/^([0-9a-fA-F]{8})\s+(R_ARM_[A-Z0-9_]+)\s+(\S+)$/gm)]
      .map((match) => ({ offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] }))
      .sort((a, b) => a.offset - b.offset);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`unexpected relocations for ${entry.name}`);
  }
  console.log("Validated ARM IPC template batch 48 (492 body bytes, 19 branches, 10 literal slots, 4 new classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
