#!/usr/bin/env node

import { accessSync, constants, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "config", "arm-runtime-helpers-78.json"), "utf8"));
const expected = {
  functionCount: 24,
  bodyBytes: 1184,
  instructions: 296,
  localBranches: 15,
  conditionalBranches: 15,
  unconditionalBranches: 0,
  returnTransfers: 25,
  memoryOperations: 128,
  branchScheduleSha256: "0195cd294593170b5f577d545a459564a702ab2c5db702d1f375a9b24e1551dd",
  returnScheduleSha256: "5b66418a9c0df004456d4f8428271747fdd399e8d77931a6886358e165cabbef",
  adjacentBytes: 0,
};
const inventory = new Map([
  ["func_003B7DD8", [13, 0, 9]], ["func_0040FE1C", [13, 2, 8]],
  ["func_0045A6E8", [13, 1, 4]], ["func_0045BFF8", [13, 1, 3]],
  ["func_0045E0C0", [13, 1, 2]], ["func_00460C9C", [13, 0, 10]],
  ["func_0047BEC0", [13, 3, 1]], ["func_004BE764", [13, 0, 2]],
  ["func_0010E14C", [12, 1, 6]], ["func_001134A0", [12, 0, 7]],
  ["func_0014AF14", [12, 0, 10]], ["func_00177298", [12, 1, 4]],
  ["func_001CBF1C", [12, 1, 3]], ["func_001F9244", [12, 0, 8]],
  ["func_002AFFDC", [12, 0, 9]], ["func_00337878", [12, 0, 2]],
  ["func_0034ABEC", [12, 2, 5]], ["func_00398928", [12, 0, 4]],
  ["func_00398B2C", [12, 0, 4]], ["func_00399FC8", [12, 0, 4]],
  ["func_003BCE80", [12, 0, 8]], ["func_003FF134", [12, 1, 4]],
  ["func_0044AACC", [12, 1, 5]], ["func_0045A438", [12, 0, 6]],
]);

function fail(message) {
  throw new Error(`runtime helpers 78 validation failed: ${message}`);
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
const memoryMnemonic = /^(?:ldr|str|ldm|stm|push|pop|vldr|vstr)/;

function parseInstructions(text, sectionSize, functionName) {
  const instructions = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)(?:\s+(.*?))?\s*$/);
    if (match) instructions.push({ address: parseInt(match[1], 16), mnemonic: match[2].toLowerCase(), operands: match[3] ?? "" });
  }
  if (!instructions.length) fail(`${functionName}: section-scoped disassembly contained no instructions`);

  const metrics = { count: instructions.length, branches: 0, conditionalBranches: 0, unconditionalBranches: 0, calls: 0, externalBranches: 0, pcRelativeData: 0, memory: 0, branchSites: [], returnSites: [] };
  for (const instruction of instructions) {
    if (memoryMnemonic.test(instruction.mnemonic)) metrics.memory += 1;
    if (callMnemonic.test(instruction.mnemonic)) metrics.calls += 1;
    if (branchMnemonic.test(instruction.mnemonic)) {
      metrics.branches += 1;
      if (instruction.mnemonic === "b" || instruction.mnemonic === "bal") metrics.unconditionalBranches += 1;
      else metrics.conditionalBranches += 1;
      const target = instruction.operands.match(/^([0-9a-fA-F]+)\b/);
      if (!target || parseInt(target[1], 16) >= sectionSize) metrics.externalBranches += 1;
      metrics.branchSites.push(`${functionName}:${instruction.address.toString(16)}:${instruction.mnemonic}:${target?.[1].toLowerCase() ?? "?"}`);
    }
    const isLrBranch = /^bx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(instruction.mnemonic) && /^lr\b/.test(instruction.operands);
    const isReturn = isLrBranch ||
      (/^(?:pop\S*|ldm\S*)$/.test(instruction.mnemonic) && /\bpc\}/.test(instruction.operands));
    if (isReturn) metrics.returnSites.push(`${functionName}:${instruction.address.toString(16)}:${instruction.mnemonic}:${instruction.operands.replace(/\s+/g, " ")}`);
    else if ((/^bx/.test(instruction.mnemonic) && !isLrBranch) || (/^(?:pop\S*|ldm\S*)$/.test(instruction.mnemonic) && /\bpc\}/.test(instruction.operands))) metrics.externalBranches += 1;
    if (/\[\s*pc(?:\s*,|\s*\])/.test(instruction.operands) || /^adr(?:l)?$/.test(instruction.mnemonic)) metrics.pcRelativeData += 1;
  }
  return metrics;
}

function validateObject(objectPath, tools, label, allowForeign = false) {
  const sections = parseSections(run(tools.readelf, ["-SW", objectPath]));
  const symbols = parseSymbols(run(tools.readelf, ["-sW", objectPath]));
  const relocations = run(tools.readelf, ["-rW", objectPath]);
  const totals = { bytes: 0, instructions: 0, branches: 0, conditionalBranches: 0, unconditionalBranches: 0, returns: 0, memory: 0, branchSites: [], returnSites: [] };

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
    const expectedMetrics = inventory.get(fn.name);
    if (!expectedMetrics || metrics.count !== expectedMetrics[0] || metrics.branches !== expectedMetrics[1] || metrics.memory !== expectedMetrics[2]) fail(`${label}: ${fn.name} metrics ${metrics.count}/${metrics.branches}/${metrics.memory}, expected ${expectedMetrics?.join("/")}`);
    if (metrics.calls || metrics.externalBranches || metrics.pcRelativeData) fail(`${label}: ${fn.name} has calls/external branches/PC-relative data ${metrics.calls}/${metrics.externalBranches}/${metrics.pcRelativeData}`);
    totals.bytes += section.size;
    totals.instructions += metrics.count;
    totals.branches += metrics.branches;
    totals.conditionalBranches += metrics.conditionalBranches;
    totals.unconditionalBranches += metrics.unconditionalBranches;
    totals.returns += metrics.returnSites.length;
    totals.memory += metrics.memory;
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
  const branchDigest = createHash("sha256").update(totals.branchSites.join("\n")).digest("hex");
  const returnDigest = createHash("sha256").update(totals.returnSites.join("\n")).digest("hex");
  if (branchDigest !== expected.branchScheduleSha256 || returnDigest !== expected.returnScheduleSha256) fail(`${label}: direct-branch or return offset/target schedule mismatch (${branchDigest}/${returnDigest})`);
  return totals;
}

function validateConfigAndSource() {
  if (config.schemaVersion !== 1 || config.mode !== "arm") fail("unexpected config schema or mode");
  if (config.functions.length !== expected.functionCount || inventory.size !== expected.functionCount) fail("function count is not 24");
  if (config.totalBodySize !== expected.bodyBytes || config.totalAdjacentSize !== expected.adjacentBytes) fail("configured aggregate sizes are incorrect");
  if (config.branchScheduleSha256 !== expected.branchScheduleSha256 || config.returnScheduleSha256 !== expected.returnScheduleSha256) fail("configured schedule hashes are incorrect");
  if (config.functions.reduce((sum, fn) => sum + fn.size, 0) !== expected.bodyBytes) fail("function sizes do not total 1184");
  if (config.functions.some((fn) => fn.calls.length || fn.adjacentWords.length)) fail("calls or adjacent data are configured");
  if (config.pcRelativeDataAccesses.length || Object.keys(config.symbolicIdentities).length || Object.keys(config.symbolicSlots).length) fail("unexpected symbolic or PC-relative configuration");
  const identity = config.identityClasses.call_free_runtime_helpers_78;
  if (!identity || identity.members.join("\0") !== config.functions.map((fn) => fn.name).join("\0")) fail("identity class does not cover functions in order");
  if (identity.parameters.join("\0") !== ["controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule"].join("\0")) fail("identity class parameters are incorrect");
  const sourcePath = join(root, config.source);
  const digest = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
  if (digest !== config.sourceSha256) fail(`source SHA-256 ${digest} does not match ${config.sourceSha256}`);
  return sourcePath;
}

const sourcePath = validateConfigAndSource();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail("usage: validate-arm-runtime-helpers-78.mjs [object]");
const tools = resolveToolchain();
const temporary = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-78-"));
try {
  const objectPath = join(temporary, "runtime78.o");
  run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath]);
  const standalone = validateObject(objectPath, tools, "standalone");

  const probeSource = join(temporary, "probe.S");
  const probeObject = join(temporary, "probe.o");
  const combinedObject = join(temporary, "combined.o");
  writeFileSync(probeSource, ".syntax unified\n.arm\n.section .text.validator_probe,\"ax\",%progbits\n.global runtime78_validator_probe\n.type runtime78_validator_probe, %function\nruntime78_validator_probe:\n  bl runtime78_foreign_undefined\n  ldr r0, [pc]\n  bx lr\n  .word runtime78_foreign_undefined\n.size runtime78_validator_probe, .-runtime78_validator_probe\n");
  run(tools.as, ["-march=armv6k", "-o", probeObject, probeSource]);
  run(tools.ld, ["-r", "-o", combinedObject, objectPath, probeObject]);
  const combinedSections = parseSections(run(tools.readelf, ["-SW", combinedObject]));
  const foreignSection = combinedSections.get(".text.validator_probe");
  const foreignRelocations = run(tools.readelf, ["-rW", combinedObject]);
  const foreignDisassembly = run(tools.objdump, ["-d", "-j", ".text.validator_probe", combinedObject]);
  if (!foreignSection || foreignSection.size !== 16 || !/\.rel(?:a)?\.text\.validator_probe\b/.test(foreignRelocations) ||
      !/\bbl\b/.test(foreignDisassembly) || !/\bldr\b[^\n]*\[pc\]/.test(foreignDisassembly)) {
    fail("combined foreign fixture did not contain the intended hostile constructs");
  }
  validateObject(combinedObject, tools, "combined", true);
  if (supplied.length === 1) validateObject(resolve(supplied[0]), tools, "supplied", true);

  console.log(`arm runtime helpers 78: ${config.functions.length} functions, ${standalone.bytes} bytes, ${standalone.instructions} instructions, ${standalone.branches} local branches; standalone and combined checks passed`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
