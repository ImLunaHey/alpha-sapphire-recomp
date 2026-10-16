#!/usr/bin/env node

import { accessSync, constants, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config", "arm-runtime-helpers-80.json");
const specPath = join(root, "docs", "specs", "main", "arm_runtime_helpers_80.md");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expected = {
  functionCount: 24,
  bodyBytes: 924,
  instructions: 231,
  localBranches: 12,
  conditionalBranches: 12,
  unconditionalBranches: 0,
  returnTransfers: 26,
  memoryOperations: 111,
  instructionScheduleSha256: "7333af7d660d872c7eef4b977c18293d2ba7871df6347814d18fea375baab451",
  branchScheduleSha256: "426fc95a7c8a686e90a0da151810b4ca0761cc00b6ade103ba3d1bd94ed9e4cc",
  returnScheduleSha256: "d241e99743a2d87a3f9f3cac8461a62fedfa8f075c7fc0fdb2363e6d45750a31",
  sourceSha256: "66404577d44266f32040c879df3714b2aee4527ee624780e8ad2c2e4900d1894",
  adjacentBytes: 0,
};
const inventory = new Map([
  ["func_0019CC14", [10, 1, 6, 2]], ["func_001C26E0", [10, 1, 5, 1]],
  ["func_002B64C8", [10, 0, 7, 1]], ["func_0038CD2C", [10, 1, 3, 1]],
  ["func_003C531C", [10, 0, 7, 1]], ["func_00410BFC", [10, 0, 5, 1]],
  ["func_00463D84", [10, 0, 4, 1]], ["func_00468EA4", [10, 0, 2, 2]],
  ["func_004AAC64", [10, 2, 1, 1]], ["func_004B0D58", [10, 2, 2, 1]],
  ["func_004B2AA8", [10, 0, 1, 1]], ["func_004B92C4", [10, 0, 5, 1]],
  ["func_004BF910", [10, 2, 2, 1]], ["func_004C7CA4", [10, 1, 6, 1]],
  ["func_004C7CCC", [10, 1, 6, 1]], ["func_0010CAA8", [9, 0, 7, 1]],
  ["func_00112A88", [9, 0, 5, 1]], ["func_00112B2C", [9, 0, 4, 1]],
  ["func_001361B0", [9, 0, 6, 1]], ["func_001D00C0", [9, 0, 6, 1]],
  ["func_002B45C0", [9, 0, 7, 1]], ["func_002B7364", [9, 0, 6, 1]],
  ["func_002C3340", [9, 0, 3, 1]], ["func_00331270", [9, 1, 5, 1]],
]);

function fail(message) {
  throw new Error(`runtime helpers 80 validation failed: ${message}`);
}

function executable(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function findOnPath(name) {
  for (const directory of (process.env.PATH ?? "").split(delimiter)) {
    const candidate = join(directory, name);
    if (directory && executable(candidate)) return candidate;
  }
  return null;
}

function completeBin(directory) {
  if (!directory) return null;
  const tools = Object.fromEntries(
    ["as", "ld", "objdump", "readelf"].map((name) => [name, join(directory, `arm-none-eabi-${name}`)]),
  );
  return Object.values(tools).every(executable) ? tools : null;
}

function runRaw(command, args, options = {}) {
  return spawnSync(command, args, { cwd: root, encoding: "utf8", maxBuffer: MAX_BUFFER, ...options });
}

function resolveToolchain() {
  const directories = [
    process.env.ARM_NONE_EABI_BIN,
    process.env.ARM_TOOLCHAIN_BIN,
    process.env.DEVKITARM && join(process.env.DEVKITARM, "bin"),
    join(root, "node_modules", "@xpack-dev-tools", "arm-none-eabi-gcc", ".content", "bin"),
  ];
  for (const directory of directories) {
    const tools = completeBin(directory);
    if (tools) return tools;
  }
  const assembler = findOnPath("arm-none-eabi-as");
  if (assembler) {
    const tools = completeBin(dirname(assembler));
    if (tools) return tools;
  }
  const nix = findOnPath("nix");
  if (nix) {
    const result = runRaw(nix, ["build", "--no-link", "--print-out-paths", "nixpkgs#pkgsCross.arm-embedded.buildPackages.binutils"]);
    if (result.status === 0) {
      const roots = result.stdout.trim().split(/\s+/).filter((path) => path && !path.endsWith("-man"));
      for (const storeRoot of roots.reverse()) {
        const tools = completeBin(join(storeRoot, "bin"));
        if (tools) return tools;
      }
    }
  }
  fail("GNU Arm binutils not found; set ARM_NONE_EABI_BIN to its bin directory");
}

function run(command, args) {
  const result = runRaw(command, args);
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} ${args.join(" ")} exited ${result.status}\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function parseSections(text) {
  const sections = new Map();
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+([A-Z]*)\s+/);
    if (match) sections.set(match[2], { index: Number(match[1]), type: match[3], size: parseInt(match[4], 16), flags: match[5] });
  }
  return sections;
}

function parseSymbols(text) {
  const symbols = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/);
    if (match) symbols.push({ value: parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], index: match[6], name: match[7].trim() });
  }
  return symbols;
}

const branchMnemonic = /^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const callMnemonic = /^blx?(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const bxMnemonic = /^bx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/;
const memoryMnemonic = /^(?:ldr|str|ldm|stm|push|pop|vldr|vstr|vldm|vstm)/;

function parseInstructions(text, sectionSize, functionName) {
  const instructions = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)(?:\s+(.*?))?\s*$/);
    if (match) instructions.push({
      address: parseInt(match[1], 16),
      mnemonic: match[2].toLowerCase(),
      operands: (match[3] ?? "").replace(/\s+/g, " "),
    });
  }
  if (!instructions.length) fail(`${functionName}: section-scoped disassembly contained no instructions`);

  const metrics = { count: instructions.length, branches: 0, conditionalBranches: 0, unconditionalBranches: 0, calls: 0, externalBranches: 0, pcRelativeData: 0, memory: 0, instructionSites: [], branchSites: [], returnSites: [] };
  for (const instruction of instructions) {
    const offset = instruction.address.toString(16);
    metrics.instructionSites.push(`${functionName}:${offset}:${instruction.mnemonic}:${instruction.operands}`);
    if (memoryMnemonic.test(instruction.mnemonic)) metrics.memory += 1;
    if (callMnemonic.test(instruction.mnemonic)) metrics.calls += 1;
    if (branchMnemonic.test(instruction.mnemonic)) {
      metrics.branches += 1;
      if (instruction.mnemonic === "b" || instruction.mnemonic === "bal") metrics.unconditionalBranches += 1;
      else metrics.conditionalBranches += 1;
      const target = instruction.operands.match(/^([0-9a-fA-F]+)\b/);
      if (!target || parseInt(target[1], 16) >= sectionSize) metrics.externalBranches += 1;
      metrics.branchSites.push(`${functionName}:${offset}:${instruction.mnemonic}:${target?.[1].toLowerCase() ?? "?"}`);
    }
    const lrReturn = bxMnemonic.test(instruction.mnemonic) && /^lr\b/.test(instruction.operands);
    const pcReturn = /^(?:pop\S*|ldm\S*)$/.test(instruction.mnemonic) && /\bpc\}/.test(instruction.operands);
    if (lrReturn || pcReturn) metrics.returnSites.push(`${functionName}:${offset}:${instruction.mnemonic}:${instruction.operands}`);
    else if (bxMnemonic.test(instruction.mnemonic) || pcReturn) metrics.externalBranches += 1;
    if (/\[\s*pc(?:\s*,|\s*\])/.test(instruction.operands) || /^adr(?:l)?$/.test(instruction.mnemonic)) metrics.pcRelativeData += 1;
  }
  return metrics;
}

function validateObject(objectPath, tools, label, allowForeign = false) {
  const sections = parseSections(run(tools.readelf, ["-SW", objectPath]));
  const symbols = parseSymbols(run(tools.readelf, ["-sW", objectPath]));
  const relocations = run(tools.readelf, ["-rW", objectPath]);
  const totals = { bytes: 0, instructions: 0, branches: 0, conditionalBranches: 0, unconditionalBranches: 0, returns: 0, memory: 0, instructionSites: [], branchSites: [], returnSites: [] };

  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    if (!section) fail(`${label}: missing owned section ${sectionName}`);
    if (section.type !== "PROGBITS" || !section.flags.includes("A") || !section.flags.includes("X")) fail(`${label}: ${sectionName} must be executable PROGBITS`);
    if (section.size !== fn.size) fail(`${label}: ${sectionName} is ${section.size} bytes, expected ${fn.size}`);
    if (new RegExp(`\\.rel(?:a)?${sectionName.replaceAll(".", "\\.")}\\b`).test(relocations)) fail(`${label}: ${sectionName} has relocations`);

    const matches = symbols.filter((symbol) => symbol.name === fn.name);
    if (matches.length !== 1) fail(`${label}: expected one symbol named ${fn.name}, found ${matches.length}`);
    const symbol = matches[0];
    if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || Number(symbol.index) !== section.index || symbol.value !== 0 || symbol.size !== fn.size) fail(`${label}: malformed function symbol ${fn.name}`);

    const metrics = parseInstructions(run(tools.objdump, ["-d", "-j", sectionName, objectPath]), fn.size, fn.name);
    const wanted = inventory.get(fn.name);
    const actual = [metrics.count, metrics.branches, metrics.memory, metrics.returnSites.length];
    if (!wanted || actual.join("/") !== wanted.join("/")) fail(`${label}: ${fn.name} metrics ${actual.join("/")}, expected ${wanted?.join("/")}`);
    if (metrics.calls || metrics.externalBranches || metrics.pcRelativeData) fail(`${label}: ${fn.name} has calls/external branches/PC-relative data ${metrics.calls}/${metrics.externalBranches}/${metrics.pcRelativeData}`);
    totals.bytes += section.size;
    totals.instructions += metrics.count;
    totals.branches += metrics.branches;
    totals.conditionalBranches += metrics.conditionalBranches;
    totals.unconditionalBranches += metrics.unconditionalBranches;
    totals.returns += metrics.returnSites.length;
    totals.memory += metrics.memory;
    totals.instructionSites.push(...metrics.instructionSites);
    totals.branchSites.push(...metrics.branchSites);
    totals.returnSites.push(...metrics.returnSites);
  }

  const owned = config.functions.map((fn) => `.text.${fn.name}`);
  if (!allowForeign) {
    const functionSections = [...sections.keys()].filter((name) => name.startsWith(".text.func_"));
    if (functionSections.length !== config.functions.length) fail(`${label}: expected ${config.functions.length} owned sections, found ${functionSections.length}`);
    const exports = symbols.filter((symbol) => symbol.bind === "GLOBAL" && symbol.type === "FUNC" && symbol.index !== "UND").map((symbol) => symbol.name).sort();
    if (exports.join("\0") !== config.functions.map((fn) => fn.name).sort().join("\0")) fail(`${label}: exported function set does not exactly match configured functions`);
    if ([...sections.entries()].some(([name, section]) => section.flags.includes("X") && section.size && !owned.includes(name))) fail(`${label}: unexpected nonempty executable section`);
    if (!/There are no relocations in this file\./.test(relocations)) fail(`${label}: object contains relocations`);
  }

  if (totals.bytes !== expected.bodyBytes || totals.instructions !== expected.instructions || totals.branches !== expected.localBranches) fail(`${label}: aggregate bytes/instructions/branches ${totals.bytes}/${totals.instructions}/${totals.branches}`);
  if (totals.conditionalBranches !== expected.conditionalBranches || totals.unconditionalBranches !== expected.unconditionalBranches || totals.returns !== expected.returnTransfers) fail(`${label}: conditional/unconditional branches and returns ${totals.conditionalBranches}/${totals.unconditionalBranches}/${totals.returns}`);
  if (totals.memory !== expected.memoryOperations) fail(`${label}: memory operations ${totals.memory}`);
  const instructionDigest = createHash("sha256").update(totals.instructionSites.join("\n")).digest("hex");
  const branchDigest = createHash("sha256").update(totals.branchSites.join("\n")).digest("hex");
  const returnDigest = createHash("sha256").update(totals.returnSites.join("\n")).digest("hex");
  if (instructionDigest !== expected.instructionScheduleSha256) fail(`${label}: exact mnemonic/operand instruction schedule mismatch (${instructionDigest})`);
  if (branchDigest !== expected.branchScheduleSha256 || returnDigest !== expected.returnScheduleSha256) fail(`${label}: direct-branch or return offset/target schedule mismatch (${branchDigest}/${returnDigest})`);
  return totals;
}

function validateConfigAndSource() {
  if (config.schemaVersion !== 1 || config.mode !== "arm") fail("unexpected config schema or mode");
  if (config.functions.length !== expected.functionCount || inventory.size !== expected.functionCount) fail("function count is not 24");
  if (new Set(config.functions.map((fn) => fn.name)).size !== expected.functionCount) fail("configured function names are not unique");
  if (config.totalBodySize !== expected.bodyBytes || config.totalAdjacentSize !== expected.adjacentBytes) fail("configured aggregate sizes are incorrect");
  if (config.branchScheduleSha256 !== expected.branchScheduleSha256 || config.returnScheduleSha256 !== expected.returnScheduleSha256) fail("configured schedule hashes are incorrect");
  if (config.functions.reduce((sum, fn) => sum + fn.size, 0) !== expected.bodyBytes) fail("function sizes do not total 924");
  if (config.functions.some((fn) => fn.calls.length || fn.adjacentWords.length)) fail("calls or adjacent data are configured");
  if (config.pcRelativeDataAccesses.length || Object.keys(config.symbolicIdentities).length || Object.keys(config.symbolicSlots).length) fail("unexpected symbolic or PC-relative configuration");
  const identity = config.identityClasses.call_free_runtime_helpers_80;
  if (!identity || identity.members.join("\0") !== config.functions.map((fn) => fn.name).join("\0")) fail("identity class does not cover functions in order");
  if (identity.parameters.join("\0") !== ["controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule"].join("\0")) fail("identity class parameters are incorrect");
  const sourcePath = join(root, config.source);
  const digest = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
  if (digest !== expected.sourceSha256 || digest !== config.sourceSha256) fail(`source SHA-256 ${digest} does not match config/validator`);
  const spec = readFileSync(specPath, "utf8");
  const sourceHashLines = spec.match(/^Source SHA-256: `[^`]+`$/gm) ?? [];
  if (sourceHashLines.length !== 1 || sourceHashLines[0] !== `Source SHA-256: \`${digest}\``) fail("specification source SHA-256 is missing or stale");
  return sourcePath;
}

const sourcePath = validateConfigAndSource();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail("usage: validate-arm-runtime-helpers-80.mjs [object]");
const tools = resolveToolchain();
const temporary = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-80-"));
try {
  const objectPath = join(temporary, "runtime80.o");
  run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath]);
  const standalone = validateObject(objectPath, tools, "standalone");

  const fixtureSource = join(temporary, "hostile.S");
  const fixtureObject = join(temporary, "hostile.o");
  const combinedObject = join(temporary, "combined.o");
  writeFileSync(fixtureSource, ".syntax unified\n.arm\n.section .text.validator_hostile,\"ax\",%progbits\n.global runtime80_validator_hostile\n.type runtime80_validator_hostile, %function\nruntime80_validator_hostile:\n  bl runtime80_foreign_undefined\n  ldr r0, [pc]\n  bx r3\n  .word runtime80_foreign_undefined\n.size runtime80_validator_hostile, .-runtime80_validator_hostile\n");
  run(tools.as, ["-march=armv6k", "-o", fixtureObject, fixtureSource]);
  run(tools.ld, ["-r", "-o", combinedObject, objectPath, fixtureObject]);
  const combinedSections = parseSections(run(tools.readelf, ["-SW", combinedObject]));
  const foreignSection = combinedSections.get(".text.validator_hostile");
  const foreignRelocations = run(tools.readelf, ["-rW", combinedObject]);
  const foreignDisassembly = run(tools.objdump, ["-d", "-j", ".text.validator_hostile", combinedObject]);
  if (!foreignSection || foreignSection.size !== 16 || !/\.rel(?:a)?\.text\.validator_hostile\b/.test(foreignRelocations) ||
      !/\bbl\b/.test(foreignDisassembly) || !/\bldr\b[^\n]*\[pc\]/.test(foreignDisassembly) || !/\bbx\b[^\n]*r3/.test(foreignDisassembly)) {
    fail("combined foreign fixture did not contain the intended hostile constructs");
  }
  validateObject(combinedObject, tools, "combined", true);
  if (supplied.length === 1) validateObject(resolve(supplied[0]), tools, "supplied", true);

  console.log(`arm runtime helpers 80: ${config.functions.length} functions, ${standalone.bytes} bytes, ${standalone.instructions} instructions, ${standalone.branches} local branches, ${standalone.returns} returns, ${standalone.memory} memory operations; standalone and hostile combined checks passed`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
