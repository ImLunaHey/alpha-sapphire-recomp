import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-50.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_50.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 50 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;

const primaryEntries = [
  "func_0014983C", "func_0017A8A8", "func_0014B890",
  "func_001668E8", "func_00174B00", "func_00174A8C",
];
const literalIdentities = [
  "ipc_record_tag_50", "ipc_record_kind_a_50", "ipc_record_kind_b_50",
];
const expectedFunctions = [
  { name: "func_001664C4", size: 156,
    branches: [{ offset: 48, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0014983C" }],
    literals: [
      { offset: 156, symbol: "ipc_record_tag_50" },
      { offset: 160, symbol: "ipc_record_kind_a_50" },
      { offset: 164, symbol: "ipc_record_kind_b_50" },
    ] },
  { name: "func_0016656C", size: 72, branches: [], literals: [] },
  { name: "func_001665B4", size: 80, branches: [], literals: [] },
  { name: "func_00166604", size: 136, branches: [
    { offset: 16, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017A8A8" },
    { offset: 64, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0014B890" },
    { offset: 72, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001668E8" },
    { offset: 108, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001668E8" },
    { offset: 128, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_001668E8" },
  ], literals: [] },
  { name: "func_0016668C", size: 80,
    branches: [{ offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174B00" }],
    literals: [] },
  { name: "func_001666EC", size: 52, branches: [
    { offset: 16, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017A8A8" },
    { offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174A8C" },
    { offset: 44, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_001668E8" },
  ], literals: [] },
  { name: "func_00166720", size: 104, branches: [], literals: [] },
];
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries: [],
  sharedClasses: [
    { symbol: "func_0017A8A8", siteCount: 2 },
    { symbol: "func_001668E8", siteCount: 4 },
  ],
  singletonClasses: ["func_0014983C", "func_0014B890", "func_00174B00", "func_00174A8C"],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_50.S" ||
    manifest.sourceSha256 !== "b3ab71740aaef8dcb5b3f631f1dca40ab7b5f84b2796e9e855a355b965db979d" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 680 ||
    manifest.cumulativePoolSlots !== 629 || manifest.cumulativePoolClasses !== 322 ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(expectedBranchContract)) {
  fail("unexpected positional relocation manifest contract");
}

const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
if (sourceHash !== manifest.sourceSha256) fail("source SHA-256 does not match the manifest");

let objectPath = process.argv[2];
let readelf = process.argv[3];
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-50-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_50.o");
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
  console.log("Validated ARM IPC template batch 50 (680 body bytes, 10 branches, 3 literal slots, 3 new classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
