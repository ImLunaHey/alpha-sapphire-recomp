import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-53.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_53.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 53 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;

const primaryEntries = [
  "func_00173ACC", "func_00177E8C", "func_00188184", "func_00176C20",
  "func_00302F52", "func_0015EC10",
];
const literalIdentities = [
  "ipc_time_magic_a_53", "ipc_time_magic_b_53", "ipc_time_magic_c_53",
  "ipc_time_scale_53", "service_zero_scalar_51", "ipc_time_limit_53",
  "ipc_statistics_guard_53", "ipc_statistics_state_53",
];
const newLiteralIdentities = literalIdentities.filter((identity) => identity !== "service_zero_scalar_51");
const expectedFunctions = [
  { name: "func_00167608", size: 540, branches: [
    { offset: 64, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00173ACC" },
    { offset: 292, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00177E8C" },
    { offset: 480, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00188184" },
    { offset: 492, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00176C20" },
  ], literals: [
    { offset: 540, symbol: "ipc_time_magic_a_53" },
    { offset: 544, symbol: "ipc_time_magic_b_53" },
    { offset: 548, symbol: "ipc_time_magic_c_53" },
    { offset: 552, symbol: "ipc_time_scale_53" },
    { offset: 556, symbol: "service_zero_scalar_51" },
    { offset: 560, symbol: "ipc_time_limit_53" },
  ] },
  { name: "func_0016783C", size: 84, branches: [
    { offset: 24, kind: "R_ARM_CALL", mnemonic: "blx", symbol: "func_00302F52" },
  ], literals: [
    { offset: 84, symbol: "ipc_statistics_guard_53" },
    { offset: 88, symbol: "ipc_statistics_state_53" },
  ] },
  { name: "func_001678A4", size: 88, branches: [
    { offset: 36, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0015EC10" },
  ], literals: [] },
];
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 2, primaryEntries, secondaryEntries: [],
  sharedClasses: [], singletonClasses: primaryEntries, classesPairwiseDistinct: true,
  armPrimaryEntries: [
    "func_00173ACC", "func_00177E8C", "func_00188184", "func_00176C20", "func_0015EC10",
  ],
  thumbPrimaryEntries: ["func_00302F52"],
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_53.S" ||
    manifest.sourceSha256 !== "05f68669b519004019a575c9a007da1ed3ce5a05822fe7b4f8735a3fc9119291" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 712 ||
    manifest.cumulativePoolSlots !== 650 || manifest.cumulativePoolClasses !== 342 ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify(["service_zero_scalar_51"]) ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(expectedBranchContract)) {
  fail("unexpected positional relocation manifest contract");
}

const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
if (sourceHash !== manifest.sourceSha256) fail("source SHA-256 does not match the manifest");

let objectPath = process.argv[2];
let readelf = process.argv[3];
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-53-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_53.o");
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
  console.log("Validated ARM IPC template batch 53 (712 body bytes, 6 branches, 8 literal slots, 7 new classes)." );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
