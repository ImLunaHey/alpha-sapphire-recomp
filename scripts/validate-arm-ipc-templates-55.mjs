import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-ipc-templates-55.json"), "utf8"));
const sourcePath = join(root, "src/main/arm_ipc_templates_55.S");
const fail = (message) => { throw new Error(`ARM IPC template 55 validation failed: ${message}`); };
const maxBuffer = 16 * 1024 * 1024;
const sourceSha256 = "8c1dec3a5db2c65896795627a05c58247cdf92a5b6a9a7d954badafca2ba4b51";
const primaryEntries = [
  "func_00167B00", "func_00144D28", "func_00175D58", "func_00175870",
  "func_00175978", "func_0012B9A0", "func_0017492C", "func_0016B654",
  "func_0016B6A4", "func_0013E9CC", "func_00157FBC", "func_00157C04",
  "func_0016E0C8",
];
const secondaryEntries = ["service_layout_fallback_secondary_55"];
const branchEntries = [...primaryEntries, ...secondaryEntries];
const literalIdentities = [
  "service_zero_scalar_51", "ipc_unit_scalar_54", "ipc_default_flags_54",
  "ipc_render_context_54", "ipc_layout_callback_context_55", "ipc_layout_record_tag_55",
];
const reusedLiteralIdentities = literalIdentities.slice(0, 4);
const newLiteralIdentities = literalIdentities.slice(4);
const expectedFunctions = [
  { name: "func_00167B90", size: 424, branches: [
    [24, "R_ARM_CALL", "bl", "func_00167B00"], [48, "R_ARM_CALL", "bl", "func_00144D28"],
    [152, "R_ARM_CALL", "bl", "func_00175D58"], [224, "R_ARM_CALL", "bl", "func_00175870"],
    [272, "R_ARM_CALL", "bl", "func_00175D58"],
    [408, "R_ARM_CALL", "bl", "service_layout_fallback_secondary_55"],
  ], literals: [[424, "service_zero_scalar_51"], [428, "ipc_unit_scalar_54"], [432, "ipc_default_flags_54"]] },
  { name: "func_00167D44", size: 396, branches: [
    [32, "R_ARM_CALL", "bl", "func_00167B00"], [56, "R_ARM_CALL", "bl", "func_00144D28"],
    [176, "R_ARM_CALL", "bl", "func_00175D58"], [228, "R_ARM_CALL", "bl", "func_00175978"],
    [276, "R_ARM_CALL", "bl", "func_0012B9A0"], [348, "R_ARM_CALL", "bl", "func_00175D58"],
    [372, "R_ARM_CALL", "bl", "func_0017492C"],
  ], literals: [[396, "service_zero_scalar_51"], [400, "ipc_unit_scalar_54"],
    [404, "ipc_render_context_54"], [408, "ipc_layout_callback_context_55"]] },
  { name: "func_00167EE0", size: 220, branches: [
    [96, "R_ARM_CALL", "bl", "func_0016B654"], [108, "R_ARM_CALL", "bl", "func_0016B6A4"],
    [124, "R_ARM_CALL", "bl", "func_0013E9CC"], [136, "R_ARM_CALL", "bl", "func_00157FBC"],
    [208, "R_ARM_CALL", "bl", "func_00157C04"],
  ], literals: [] },
  { name: "func_00167FF8", size: 268, branches: [
    [196, "R_ARM_CALL", "bl", "func_0013E9CC"], [216, "R_ARM_CALL", "bl", "func_0016B654"],
    [228, "R_ARM_CALL", "bl", "func_0016B6A4"], [240, "R_ARM_CALL", "bl", "func_00157FBC"],
    [260, "R_ARM_JUMP24", "b", "func_0016E0C8"],
  ], literals: [[268, "ipc_layout_record_tag_55"]] },
].map((entry) => ({ ...entry,
  branches: entry.branches.map(([offset, kind, mnemonic, symbol]) => ({ offset, kind, mnemonic, symbol })),
  literals: entry.literals.map(([offset, symbol]) => ({ offset, symbol })),
}));
const expectedBranchContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries,
  sharedClasses: [
    { symbol: "func_00175D58", siteCount: 4 }, { symbol: "func_00167B00", siteCount: 2 },
    { symbol: "func_00144D28", siteCount: 2 }, { symbol: "func_0016B654", siteCount: 2 },
    { symbol: "func_0016B6A4", siteCount: 2 }, { symbol: "func_0013E9CC", siteCount: 2 },
    { symbol: "func_00157FBC", siteCount: 2 },
  ],
  singletonClasses: ["func_00175870", "service_layout_fallback_secondary_55", "func_00175978",
    "func_0012B9A0", "func_0017492C", "func_00157C04", "func_0016E0C8"],
  classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_55.S" ||
    manifest.sourceSha256 !== sourceSha256 || manifest.mode !== "arm" || manifest.totalBodySize !== 1308 ||
    manifest.cumulativePoolSlots !== 665 || manifest.cumulativePoolClasses !== 349 ||
    JSON.stringify(manifest.functions) !== JSON.stringify(expectedFunctions) ||
    JSON.stringify(manifest.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== JSON.stringify(reusedLiteralIdentities) ||
    JSON.stringify(manifest.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(expectedBranchContract)) {
  fail("unexpected positional relocation manifest contract");
}

const previous = JSON.parse(readFileSync(join(root, "config/arm-ipc-templates-54.json"), "utf8"));
const previousIdentities = new Set();
for (const batch of [13, ...Array.from({ length: 40 }, (_, index) => index + 15)]) {
  const name = batch === 13 ? "arm-ipc-unique-templates-13.json" : `arm-ipc-templates-${batch}.json`;
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const identity of prior.literalIdentities ?? []) previousIdentities.add(identity);
}
const slotCount = expectedFunctions.flatMap((entry) => entry.literals).length;
if (previous.cumulativePoolSlots + slotCount !== 665 ||
    previous.cumulativePoolClasses + newLiteralIdentities.length !== 349 ||
    reusedLiteralIdentities.some((identity) => !previousIdentities.has(identity)) ||
    newLiteralIdentities.some((identity) => previousIdentities.has(identity)) ||
    new Set(literalIdentities).size !== literalIdentities.length) {
  fail("reused/new literal identity or cumulative accounting contract is invalid");
}
if (createHash("sha256").update(readFileSync(sourcePath)).digest("hex") !== sourceSha256)
  fail("source SHA-256 does not match the manifest");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-55.mjs [object readelf]");
let [objectPath, readelf] = args;
const scratch = mkdtempSync(join(tmpdir(), "arm-ipc-55-"));
try {
  if (!objectPath) {
    const toolchain = execFileSync("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#gcc-arm-embedded"],
      { encoding: "utf8", maxBuffer }).trim().split(/\s+/).at(-1);
    const findTool = (name) => execFileSync("find", [toolchain, "-type", "f", "-name", name, "-print", "-quit"],
      { encoding: "utf8", maxBuffer }).trim();
    const compiler = findTool("arm-none-eabi-gcc");
    readelf = findTool("arm-none-eabi-readelf");
    if (!compiler || !readelf) fail("GNU Arm compiler tools were not found");
    objectPath = join(scratch, "arm_ipc_templates_55.o");
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
  for (const symbol of [...branchEntries, ...literalIdentities]) {
    const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bGLOBAL\\s+DEFAULT\\s+(?:UND|\\d+)\\s+${escaped}$`, "m").test(symbols))
      fail(`missing global symbolic emission for ${symbol}`);
  }
  console.log("Validated ARM IPC template batch 55 (1,308 body bytes, 23 branches, 8 literal slots, 2 new classes).");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
