import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "config/arm-ipc-templates-54.json");
const sourcePath = join(root, "src/main/arm_ipc_templates_54.S");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const fail = (message) => { throw new Error(`ARM IPC template 54 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;

const primaryEntries = [
  "func_0014DBB8", "func_0013E9CC", "func_00157FBC", "func_00175AD0",
  "func_00176C88", "func_0017C888", "func_00175C54",
];
const secondaryEntries = ["service_geometry_setup_secondary_54"];
const branchEntries = [...primaryEntries, ...secondaryEntries];
const literalIdentities = [
  "ipc_render_context_54", "ipc_coordinate_scale_a_54", "ipc_coordinate_scale_b_54",
  "service_zero_scalar_51", "ipc_default_flags_54", "ipc_unit_scalar_54",
];
const newLiteralIdentities = literalIdentities.filter((identity) => identity !== "service_zero_scalar_51");
const expectedFunctions = [
  { name: "func_001678FC", size: 500, branches: [
    { offset: 28, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0014DBB8" },
    { offset: 96, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0013E9CC" },
    { offset: 108, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00157FBC" },
    { offset: 116, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00175AD0" },
    { offset: 168, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00176C88" },
    { offset: 256, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_geometry_setup_secondary_54" },
    { offset: 296, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00176C88" },
    { offset: 364, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017C888" },
    { offset: 380, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_geometry_setup_secondary_54" },
    { offset: 420, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00176C88" },
    { offset: 488, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00175C54" },
  ], literals: [
    { offset: 500, symbol: "ipc_render_context_54" },
    { offset: 504, symbol: "ipc_coordinate_scale_a_54" },
    { offset: 508, symbol: "ipc_coordinate_scale_b_54" },
    { offset: 512, symbol: "service_zero_scalar_51" },
  ] },
  { name: "func_00167B00", size: 132, branches: [], literals: [
    { offset: 132, symbol: "ipc_default_flags_54" },
    { offset: 136, symbol: "service_zero_scalar_51" },
    { offset: 140, symbol: "ipc_unit_scalar_54" },
  ] },
];
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries,
  sharedClasses: [
    { symbol: "func_00176C88", siteCount: 3 },
    { symbol: "service_geometry_setup_secondary_54", siteCount: 2 },
  ],
  singletonClasses: [
    "func_0014DBB8", "func_0013E9CC", "func_00157FBC", "func_00175AD0",
    "func_0017C888", "func_00175C54",
  ],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_54.S" ||
    manifest.sourceSha256 !== "ed8e302ce8d94ce6d8f21ede5fc96ed4b80ac024a702ef3c7ab2b7748a55f269" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 632 ||
    manifest.cumulativePoolSlots !== 657 || manifest.cumulativePoolClasses !== 347 ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify(["service_zero_scalar_51"]) ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(expectedBranchContract)) {
  fail("unexpected positional relocation manifest contract");
}

const previous = JSON.parse(readFileSync(join(root, "config/arm-ipc-templates-53.json"), "utf8"));
const previousIdentities = new Set();
for (const batch of [13, ...Array.from({ length: 39 }, (_, index) => index + 15)]) {
  const name = batch === 13 ? "arm-ipc-unique-templates-13.json" : `arm-ipc-templates-${batch}.json`;
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const identity of prior.literalIdentities ?? []) previousIdentities.add(identity);
}
if (previous.cumulativePoolSlots + expectedFunctions.flatMap((entry) => entry.literals).length !== 657 ||
    previous.cumulativePoolClasses + newLiteralIdentities.length !== 347 ||
    !previousIdentities.has("service_zero_scalar_51") ||
    newLiteralIdentities.some((identity) => previousIdentities.has(identity))) {
  fail("reused/new literal identity or cumulative accounting contract is invalid");
}

const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
if (sourceHash !== manifest.sourceSha256) fail("source SHA-256 does not match the manifest");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-54.mjs [object readelf]");
let [objectPath, readelf] = args;
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-54-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_54.o");
    execFileSync(compiler, [
      "-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft", "-ffreestanding",
      "-fno-pic", "-fno-pie", "-Wa,--noexecstack", "-x", "assembler-with-cpp", "-c",
      sourcePath, "-o", objectPath,
    ], { stdio: "pipe", maxBuffer });
  }
  if (!readelf) fail("readelf path is required when validating an object");
  const objdump = readelf.replace(/readelf$/, "objdump");
  const symbols = execFileSync(readelf, ["-Ws", objectPath], { encoding: "utf8", maxBuffer });
  for (const entry of expectedFunctions) {
    const section = `.text.${entry.name}`;
    const output = execFileSync(objdump, ["-htr", "-j", section, objectPath], { encoding: "utf8", maxBuffer });
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
  for (const symbol of [...branchEntries, ...literalIdentities]) {
    const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bGLOBAL\\s+DEFAULT\\s+(?:UND|\\d+)\\s+${escaped}$`, "m").test(symbols))
      fail(`missing global symbolic emission for ${symbol}`);
  }
  console.log("Validated ARM IPC template batch 54 (632 body bytes, 11 branches, 7 literal slots, 5 new classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
