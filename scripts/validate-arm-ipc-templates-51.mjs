import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-51.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_51.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 51 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;

const primaryEntries = [
  "func_0017ABB8", "func_001757E8", "func_001754A8", "func_0010018C",
  "func_001602B8", "func_00174E80", "func_00160380", "func_0017048C",
  "func_0015E354",
];
const literalIdentities = [
  "service_dispatch_root_51", "service_record_vtable_51", "service_zero_scalar_51",
  "service_instance_vtable_51", "service_instance_index_bias_51",
  "service_instance_template_51", "service_instance_slot_bias_51",
];
const expectedFunctions = [
  { name: "func_001668E8", size: 24, branches: [],
    literals: [{ offset: 24, symbol: "service_dispatch_root_51" }] },
  { name: "func_00166904", size: 52, branches: [], literals: [
    { offset: 52, symbol: "service_record_vtable_51" },
    { offset: 56, symbol: "service_zero_scalar_51" },
  ] },
  { name: "func_00166F10", size: 212, branches: [], literals: [] },
  { name: "func_00167054", size: 116, branches: [
    { offset: 8, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017ABB8" },
    { offset: 20, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001757E8" },
    { offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001754A8" },
    { offset: 72, kind: "R_ARM_CALL", mnemonic: "blx", symbol: "func_0010018C" },
  ], literals: [
    { offset: 116, symbol: "service_instance_vtable_51" },
    { offset: 120, symbol: "service_instance_index_bias_51" },
    { offset: 124, symbol: "service_instance_template_51" },
    { offset: 128, symbol: "service_instance_slot_bias_51" },
  ] },
  { name: "func_001670D8", size: 200, branches: [
    { offset: 24, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
    { offset: 40, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174E80" },
    { offset: 60, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" },
    { offset: 88, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174E80" },
    { offset: 116, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174E80" },
    { offset: 140, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" },
    { offset: 172, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017048C" },
    { offset: 196, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_00160380" },
  ], literals: [] },
  { name: "func_001671A0", size: 132, branches: [
    { offset: 24, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0015E354" },
    { offset: 52, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174E80" },
    { offset: 80, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174E80" },
    { offset: 108, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174E80" },
  ], literals: [] },
];
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 2, primaryEntries, secondaryEntries: [],
  sharedClasses: [
    { symbol: "func_00174E80", siteCount: 6 },
    { symbol: "func_00160380", siteCount: 3 },
  ],
  singletonClasses: [
    "func_0017ABB8", "func_001757E8", "func_001754A8", "func_0010018C",
    "func_001602B8", "func_0017048C", "func_0015E354",
  ],
  classesPairwiseDistinct: true,
  armPrimaryEntries: [
    "func_0017ABB8", "func_001757E8", "func_001754A8", "func_001602B8",
    "func_00174E80", "func_00160380", "func_0017048C", "func_0015E354",
  ],
  thumbPrimaryEntries: ["func_0010018C"],
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_51.S" ||
    manifest.sourceSha256 !== "3c2dc42b638ca5f4239ce3af6d4382ba6a9e3bd60824f9cd617e99b0c2c88605" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 736 ||
    manifest.cumulativePoolSlots !== 636 || manifest.cumulativePoolClasses !== 329 ||
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
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-51-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_51.o");
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
  console.log("Validated ARM IPC template batch 51 (736 body bytes, 16 branches, 7 literal slots, 7 new classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
