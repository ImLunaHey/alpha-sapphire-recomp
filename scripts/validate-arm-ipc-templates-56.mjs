import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-ipc-templates-56.json"), "utf8"));
const sourcePath = join(root, "src/main/arm_ipc_templates_56.S");
const fail = (message) => { throw new Error(`ARM IPC template 56 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;
const sourceSha256 = "c59dc5d5a23bbd30f4c7453383e627501a5aed814d616a90c94b6cf6bf1005fe";
const primaryEntries = ["func_0012B9A0", "func_00176CFC", "func_0016DFE8", "func_0014E240"];
const secondaryEntries = [];
const literalIdentities = [
  "ipc_scene_type_token_56", "ipc_alpha_scale_56", "arm_duplicate_templates_17_scale_b",
  "ipc_allocator_descriptor_a_56", "service_zero_scalar_51", "ipc_request_record_tag_56",
  "ipc_allocator_descriptor_b_56", "ipc_allocator_descriptor_c_56", "ipc_request_record_tag_alt_56",
];
const reusedLiteralIdentities = ["arm_duplicate_templates_17_scale_b", "service_zero_scalar_51"];
const newLiteralIdentities = literalIdentities.filter((identity) => !reusedLiteralIdentities.includes(identity));
const expectedFunctions = [
  { name: "func_00168130", size: 284, branches: [
    [76, "R_ARM_CALL", "bl", "func_0012B9A0"],
  ], literals: [] },
  { name: "func_0016824C", size: 192, branches: [
    [24, "R_ARM_CALL", "bl", "func_00176CFC"],
  ], literals: [[192, "ipc_scene_type_token_56"], [196, "ipc_alpha_scale_56"],
    [200, "arm_duplicate_templates_17_scale_b"]] },
  { name: "func_00168478", size: 456, branches: [
    [36, "R_ARM_CALL", "bl", "func_0016DFE8"], [196, "R_ARM_CALL", "bl", "func_0016DFE8"],
    [212, "R_ARM_CALL", "bl", "func_0016DFE8"], [364, "R_ARM_CALL", "bl", "func_0016DFE8"],
    [388, "R_ARM_CALL", "bl", "func_0016DFE8"], [440, "R_ARM_CALL", "bl", "func_0016DFE8"],
  ], literals: [[456, "ipc_allocator_descriptor_a_56"], [460, "service_zero_scalar_51"],
    [464, "ipc_request_record_tag_56"], [468, "ipc_allocator_descriptor_b_56"],
    [472, "ipc_allocator_descriptor_c_56"], [476, "ipc_request_record_tag_alt_56"]] },
  { name: "func_00168658", size: 72, branches: [
    [48, "R_ARM_CALL", "bl", "func_0014E240"],
  ], literals: [] },
].map((entry) => ({ ...entry,
  branches: entry.branches.map(([offset, kind, mnemonic, symbol]) => ({ offset, kind, mnemonic, symbol })),
  literals: entry.literals.map(([offset, symbol]) => ({ offset, symbol })),
}));
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries,
  sharedClasses: [{ symbol: "func_0016DFE8", siteCount: 6 }],
  singletonClasses: ["func_0012B9A0", "func_00176CFC", "func_0014E240"],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_56.S" ||
    manifest.sourceSha256 !== sourceSha256 || manifest.mode !== "arm" || manifest.totalBodySize !== 1004 ||
    manifest.cumulativePoolSlots !== 674 || manifest.cumulativePoolClasses !== 357 ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify(reusedLiteralIdentities) ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(expectedBranchContract)) {
  fail("unexpected positional relocation manifest contract");
}

const previous = JSON.parse(readFileSync(join(root, "config/arm-ipc-templates-55.json"), "utf8"));
const previousIpcIdentities = new Set();
for (const batch of [13, ...Array.from({ length: 41 }, (_, index) => index + 15)]) {
  const name = batch === 13 ? "arm-ipc-unique-templates-13.json" : `arm-ipc-templates-${batch}.json`;
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const identity of prior.literalIdentities ?? []) previousIpcIdentities.add(identity);
}
const duplicate17 = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-17.json"), "utf8"));
const ipcNewClasses = literalIdentities.filter((identity) => !previousIpcIdentities.has(identity));
const slotCount = expectedFunctions.flatMap((entry) => entry.literals).length;
if (previous.cumulativePoolSlots + slotCount !== 674 ||
    previous.cumulativePoolClasses + ipcNewClasses.length !== 357 ||
    !previousIpcIdentities.has("service_zero_scalar_51") ||
    previousIpcIdentities.has("arm_duplicate_templates_17_scale_b") ||
    duplicate17.literalIdentities?.scaleB !== "arm_duplicate_templates_17_scale_b" ||
    newLiteralIdentities.some((identity) => previousIpcIdentities.has(identity)) ||
    new Set(literalIdentities).size !== literalIdentities.length) {
  fail("reused/new literal identity, cross-lane reuse, or cumulative accounting contract is invalid");
}
if (createHash("sha256").update(readFileSync(sourcePath)).digest("hex") !== sourceSha256)
  fail("source SHA-256 does not match the manifest");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-56.mjs [object readelf]");
let [objectPath, readelf] = args;
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-56-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_56.o");
    execFileSync(compiler, ["-march=armv6k", "-mcpu=mpcore", "-marm", "-mfloat-abi=soft",
      "-ffreestanding", "-fno-pic", "-fno-pie", "-Wa,--noexecstack", "-x", "assembler-with-cpp",
      "-c", sourcePath, "-o", objectPath], { stdio: "pipe", maxBuffer });
  }
  if (!readelf) fail("readelf path is required when validating an object");
  const objdump = readelf.replace(/readelf$/, "objdump");
  const symbols = execFileSync(readelf, ["-Ws", objectPath], { encoding: "utf8", maxBuffer });
  for (const entry of expectedFunctions) {
    const section = `.text.${entry.name}`;
    const output = execFileSync(objdump, ["-htr", "-j", section, objectPath], { encoding: "utf8", maxBuffer });
    const escapedSection = section.replaceAll(".", "\\.");
    const sectionMatch = output.match(new RegExp(`^\\s*\\d+\\s+${escapedSection}\\s+([0-9a-fA-F]+)`, "m"));
    if (Number.parseInt(sectionMatch?.[1] ?? "", 16) !== entry.size + entry.literals.length * 4)
      fail(`unexpected section size for ${entry.name}`);
    const symbolMatch = output.match(new RegExp(
      `^[0-9a-fA-F]+\\s+g\\s+F\\s+${escapedSection}\\s+([0-9a-fA-F]+)\\s+${entry.name}$`, "m"));
    if (Number.parseInt(symbolMatch?.[1] ?? "", 16) !== entry.size)
      fail(`unexpected function size for ${entry.name}`);
    const expected = [...entry.branches.map((branch) => ({ offset: branch.offset, type: branch.kind, symbol: branch.symbol })),
      ...entry.literals.map((literal) => ({ offset: literal.offset, type: "R_ARM_ABS32", symbol: literal.symbol }))]
      .sort((a, b) => a.offset - b.offset);
    const actual = [...output.matchAll(/^([0-9a-fA-F]{8})\s+(R_ARM_[A-Z0-9_]+)\s+(\S+)$/gm)]
      .map((match) => ({ offset: Number.parseInt(match[1], 16), type: match[2], symbol: match[3] }))
      .sort((a, b) => a.offset - b.offset);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`unexpected relocations for ${entry.name}`);
  }
  for (const symbol of [...primaryEntries, ...literalIdentities]) {
    const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bGLOBAL\\s+DEFAULT\\s+(?:UND|\\d+)\\s+${escaped}$`, "m").test(symbols))
      fail(`missing global symbolic emission for ${symbol}`);
  }
  console.log("Validated ARM IPC template batch 56 (1,004 body bytes, 9 branches, 9 literal slots, 8 new IPC classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
