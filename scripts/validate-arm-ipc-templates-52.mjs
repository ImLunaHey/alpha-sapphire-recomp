import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-52.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_52.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 52 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;

const primaryEntries = [
  "func_00174F18", "func_00175338", "func_0016B22C", "func_00176A0C",
  "func_00145D54", "func_00145D44", "func_00300B28", "func_00176A34",
  "func_001750A0", "func_001673F4", "func_00302F52", "func_00136240",
];
const secondaryEntries = [
  "service_record_lookup_secondary_52", "service_buffer_notify_secondary_52",
];
const literalIdentities = [
  "ipc_record_tag_52", "ipc_guard_state_52", "ipc_service_handle_52",
  "ipc_shared_object_52", "ipc_fixed_extent_52", "ipc_fallback_entry_52",
];
const expectedFunctions = [
  { name: "func_00167224", size: 368, branches: [
    { offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_record_lookup_secondary_52" },
    { offset: 84, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174F18" },
    { offset: 104, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00175338" },
    { offset: 128, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0016B22C" },
    { offset: 152, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00176A0C" },
    { offset: 196, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00145D54" },
    { offset: 208, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00145D44" },
    { offset: 260, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00300B28" },
    { offset: 276, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00176A34" },
    { offset: 300, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001750A0" },
    { offset: 340, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001673F4" },
    { offset: 352, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_buffer_notify_secondary_52" },
  ], literals: [{ offset: 368, symbol: "ipc_record_tag_52" }] },
  { name: "func_00167398", size: 72, branches: [
    { offset: 24, kind: "R_ARM_CALL", mnemonic: "blx", symbol: "func_00302F52" },
    { offset: 40, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00136240" },
  ], literals: [
    { offset: 72, symbol: "ipc_guard_state_52" },
    { offset: 76, symbol: "ipc_service_handle_52" },
    { offset: 80, symbol: "ipc_shared_object_52" },
    { offset: 84, symbol: "ipc_fixed_extent_52" },
    { offset: 88, symbol: "ipc_fallback_entry_52" },
  ] },
  { name: "func_001673F4", size: 52, branches: [], literals: [] },
];
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 2, primaryEntries, secondaryEntries,
  sharedClasses: [],
  singletonClasses: [...secondaryEntries.slice(0, 1), ...primaryEntries.slice(0, 10),
    ...secondaryEntries.slice(1), ...primaryEntries.slice(10)],
  classesPairwiseDistinct: true,
  armPrimaryEntries: [
    "func_00174F18", "func_00175338", "func_0016B22C", "func_00176A0C",
    "func_00145D54", "func_00145D44", "func_00300B28", "func_00176A34",
    "func_001750A0", "func_001673F4", "func_00136240",
  ],
  thumbPrimaryEntries: ["func_00302F52"],
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_52.S" ||
    manifest.sourceSha256 !== "dac5eb198c2bad0e8bc94e13bbcdfb8ca60b3ae757f1d03e397ab7ec68f42463" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 492 ||
    manifest.cumulativePoolSlots !== 642 || manifest.cumulativePoolClasses !== 335 ||
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
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-52-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_52.o");
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
  console.log("Validated ARM IPC template batch 52 (492 body bytes, 14 branches, 6 literal slots, 6 new classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
