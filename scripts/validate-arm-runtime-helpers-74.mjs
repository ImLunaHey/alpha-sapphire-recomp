#!/usr/bin/env node

import { accessSync, constants, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config", "arm-runtime-helpers-74.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expected = {
  functionCount: 24,
  bodyBytes: 1564,
  instructions: 391,
  localBranches: 40,
  conditionalBranches: 39,
  unconditionalBranches: 1,
  returnTransfers: 31,
  memoryOperations: 161,
  branchScheduleSha256: "d22cdc708fa5822758532fa075906bed58a4c059b245b402225c4dc81324f409",
  returnScheduleSha256: "330800e8c829324d7acf881694313b160f34f0fbb14a29722f04ce1cd912e33c",
  adjacentBytes: 0,
};
const inventory = new Map([
  ["func_0012F94C", [17, 3, 6]], ["func_0016999C", [17, 3, 8]],
  ["func_001C1D18", [17, 0, 10]], ["func_001FAD44", [17, 0, 9]],
  ["func_0034AE00", [17, 1, 9]], ["func_0039873C", [17, 3, 6]],
  ["func_003988E4", [17, 3, 6]], ["func_00417130", [17, 0, 5]],
  ["func_004425C4", [17, 3, 8]], ["func_0044A808", [17, 3, 8]],
  ["func_004C1F0C", [17, 4, 4]], ["func_0013F44C", [16, 2, 3]],
  ["func_0018EBE4", [16, 1, 12]], ["func_00328DBC", [16, 4, 4]],
  ["func_0032EB64", [16, 0, 9]], ["func_0034B0CC", [16, 1, 8]],
  ["func_0041087C", [16, 0, 5]], ["func_004175D0", [16, 0, 5]],
  ["func_00466688", [16, 3, 5]], ["func_004BE6FC", [16, 0, 2]],
  ["func_0014DFCC", [15, 4, 3]], ["func_001765B8", [15, 2, 4]],
  ["func_00198CDC", [15, 0, 9]], ["func_001C21FC", [15, 0, 13]],
]);

function fail(message) {
  throw new Error(`runtime helpers 74 validation failed: ${message}`);
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
  return spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
    ...options,
  });
}

function resolveToolchain() {
  const explicit = [
    process.env.ARM_NONE_EABI_BIN,
    process.env.ARM_TOOLCHAIN_BIN,
    process.env.DEVKITARM && join(process.env.DEVKITARM, "bin"),
    join(root, "node_modules", "@xpack-dev-tools", "arm-none-eabi-gcc", ".content", "bin"),
  ];
  for (const directory of explicit) {
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
    const result = runRaw(nix, [
      "build", "--no-link", "--print-out-paths",
      "nixpkgs#pkgsCross.arm-embedded.buildPackages.binutils",
    ]);
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
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} exited ${result.status}\n${result.stderr || result.stdout}`);
  }
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
    if (match) symbols.push({ value: parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], visibility: match[5], index: match[6], name: match[7].trim() });
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
    if (!match) continue;
    instructions.push({ address: parseInt(match[1], 16), mnemonic: match[2].toLowerCase(), operands: match[3] ?? "" });
  }
  if (!instructions.length) fail(`${functionName}: section-scoped disassembly contained no instructions`);

  let branches = 0;
  let conditionalBranches = 0;
  let unconditionalBranches = 0;
  let calls = 0;
  let externalBranches = 0;
  let pcRelativeData = 0;
  let memory = 0;
  const branchSites = [];
  const returnSites = [];
  for (const instruction of instructions) {
    if (memoryMnemonic.test(instruction.mnemonic)) memory += 1;
    if (callMnemonic.test(instruction.mnemonic)) calls += 1;
    if (branchMnemonic.test(instruction.mnemonic)) {
      branches += 1;
      if (instruction.mnemonic === "b" || instruction.mnemonic === "bal") unconditionalBranches += 1;
      else conditionalBranches += 1;
      const target = instruction.operands.match(/^([0-9a-fA-F]+)\b/);
      if (!target || parseInt(target[1], 16) >= sectionSize) externalBranches += 1;
      branchSites.push(`${functionName}:${instruction.address.toString(16)}:${instruction.mnemonic}:${target?.[1].toLowerCase() ?? "?"}`);
    }
    const isLrBranch = /^bx(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?$/.test(instruction.mnemonic) && /^lr\b/.test(instruction.operands);
    const isReturn = isLrBranch ||
      (/^(?:pop\S*|ldm\S*)$/.test(instruction.mnemonic) && /\bpc\}/.test(instruction.operands));
    if (isReturn) returnSites.push(`${functionName}:${instruction.address.toString(16)}:${instruction.mnemonic}:${instruction.operands.replace(/\s+/g, " ")}`);
    else if ((/^bx/.test(instruction.mnemonic) && !isLrBranch) || (/^(?:pop\S*|ldm\S*)$/.test(instruction.mnemonic) && /\bpc\}/.test(instruction.operands))) {
      externalBranches += 1;
    }
    if (/\[\s*pc(?:\s*,|\s*\])/.test(instruction.operands) || /^adr(?:l)?$/.test(instruction.mnemonic)) {
      pcRelativeData += 1;
    }
  }
  return { count: instructions.length, branches, conditionalBranches, unconditionalBranches, calls, externalBranches, pcRelativeData, memory, branchSites, returnSites };
}

function validateObject(objectPath, tools, label, allowProbe = false) {
  const sectionText = run(tools.readelf, ["-SW", objectPath]);
  const sections = parseSections(sectionText);
  const symbols = parseSymbols(run(tools.readelf, ["-sW", objectPath]));
  const relocations = run(tools.readelf, ["-rW", objectPath]);
  let totals = { bytes: 0, instructions: 0, branches: 0, conditionalBranches: 0, unconditionalBranches: 0, returns: 0, memory: 0, branchSites: [], returnSites: [] };

  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    if (!section) fail(`${label}: missing owned section ${sectionName}`);
    if (section.type !== "PROGBITS" || !section.flags.includes("A") || !section.flags.includes("X")) {
      fail(`${label}: ${sectionName} must be executable PROGBITS`);
    }
    if (section.size !== fn.size) fail(`${label}: ${sectionName} is ${section.size} bytes, expected ${fn.size}`);
    if (new RegExp(`\\.rel(?:a)?${sectionName.replaceAll(".", "\\.")}\\b`).test(relocations)) {
      fail(`${label}: ${sectionName} has relocations`);
    }

    const matches = symbols.filter((symbol) => symbol.name === fn.name);
    if (matches.length !== 1) fail(`${label}: expected one symbol named ${fn.name}, found ${matches.length}`);
    const symbol = matches[0];
    if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || Number(symbol.index) !== section.index || symbol.value !== 0 || symbol.size !== fn.size) {
      fail(`${label}: malformed function symbol ${fn.name}`);
    }

    const disassembly = run(tools.objdump, ["-d", "-j", sectionName, objectPath]);
    const metrics = parseInstructions(disassembly, fn.size, fn.name);
    const expectedMetrics = inventory.get(fn.name);
    if (!expectedMetrics) fail(`no structural inventory for ${fn.name}`);
    if (metrics.count !== expectedMetrics[0] || metrics.branches !== expectedMetrics[1] || metrics.memory !== expectedMetrics[2]) {
      fail(`${label}: ${fn.name} metrics ${metrics.count}/${metrics.branches}/${metrics.memory}, expected ${expectedMetrics.join("/")}`);
    }
    if (metrics.calls !== 0 || metrics.externalBranches !== 0 || metrics.pcRelativeData !== 0) {
      fail(`${label}: ${fn.name} has calls/external branches/PC-relative data ${metrics.calls}/${metrics.externalBranches}/${metrics.pcRelativeData}`);
    }
    totals.bytes += section.size;
    totals.instructions += metrics.count;
    totals.branches += metrics.branches;
    totals.conditionalBranches += metrics.conditionalBranches;
    totals.unconditionalBranches += metrics.unconditionalBranches;
    totals.returns += metrics.returnSites.length;
    totals.branchSites.push(...metrics.branchSites);
    totals.returnSites.push(...metrics.returnSites);
    totals.memory += metrics.memory;
  }

  const owned = config.functions.map((fn) => `.text.${fn.name}`);
  if (!allowProbe) {
    const functionSections = [...sections.keys()].filter((name) => name.startsWith(".text.func_"));
    if (functionSections.length !== config.functions.length) {
      fail(`${label}: expected ${config.functions.length} owned sections, found ${functionSections.length}`);
    }
    const exportedFunctions = symbols
      .filter((symbol) => symbol.bind === "GLOBAL" && symbol.type === "FUNC" && symbol.index !== "UND")
      .map((symbol) => symbol.name)
      .sort();
    const expectedExports = config.functions.map((fn) => fn.name).sort();
    if (exportedFunctions.join("\0") !== expectedExports.join("\0")) {
      fail(`${label}: exported function set does not exactly match the configured functions`);
    }
  }
  if (totals.bytes !== expected.bodyBytes || totals.instructions !== expected.instructions || totals.branches !== expected.localBranches) {
    fail(`${label}: aggregate bytes/instructions/branches ${totals.bytes}/${totals.instructions}/${totals.branches}`);
  }
  if (totals.conditionalBranches !== expected.conditionalBranches || totals.unconditionalBranches !== expected.unconditionalBranches || totals.returns !== expected.returnTransfers) {
    fail(`${label}: conditional/unconditional branches and returns ${totals.conditionalBranches}/${totals.unconditionalBranches}/${totals.returns}`);
  }
  if (totals.memory !== expected.memoryOperations) fail(`${label}: memory operations ${totals.memory}`);
  const branchDigest = createHash("sha256").update(totals.branchSites.join("\n")).digest("hex");
  const returnDigest = createHash("sha256").update(totals.returnSites.join("\n")).digest("hex");
  if (branchDigest !== expected.branchScheduleSha256 || returnDigest !== expected.returnScheduleSha256) {
    fail(`${label}: direct-branch or return offset/target schedule mismatch (${branchDigest}/${returnDigest})`);
  }
  if (!allowProbe && [...sections.entries()].some(([name, section]) => section.flags.includes("X") && section.size && !owned.includes(name))) {
    fail(`${label}: unexpected nonempty executable section`);
  }
  return totals;
}

function validateConfigAndSource() {
  if (config.schemaVersion !== 1 || config.mode !== "arm") fail("unexpected config schema or mode");
  if (config.functions.length !== expected.functionCount || inventory.size !== expected.functionCount) fail("function count is not 24");
  if (config.totalBodySize !== expected.bodyBytes || config.totalAdjacentSize !== expected.adjacentBytes) fail("configured aggregate sizes are incorrect");
  if (config.functions.reduce((sum, fn) => sum + fn.size, 0) !== expected.bodyBytes) fail("function sizes do not total 1564");
  if (config.functions.some((fn) => fn.calls.length || fn.adjacentWords.length)) fail("calls or adjacent data are configured");
  if (config.pcRelativeDataAccesses.length || Object.keys(config.symbolicIdentities).length || Object.keys(config.symbolicSlots).length) fail("unexpected symbolic or PC-relative configuration");
  const identity = config.identityClasses.call_free_runtime_helpers_74;
  if (!identity || identity.members.join("\0") !== config.functions.map((fn) => fn.name).join("\0")) fail("identity class does not cover functions in order");
  const sourcePath = join(root, config.source);
  const digest = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
  if (digest !== config.sourceSha256) fail(`source SHA-256 ${digest} does not match ${config.sourceSha256}`);
  return sourcePath;
}

const sourcePath = validateConfigAndSource();
const supplied = process.argv.slice(2);
if (supplied.length > 1) fail("usage: validate-arm-runtime-helpers-74.mjs [object]");
const tools = resolveToolchain();
const temporary = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-74-"));
try {
  const objectPath = join(temporary, "runtime74.o");
  run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath]);
  const standalone = validateObject(objectPath, tools, "standalone");

  const probeSource = join(temporary, "probe.S");
  const probeObject = join(temporary, "probe.o");
  const combinedObject = join(temporary, "combined.o");
  writeFileSync(probeSource, ".syntax unified\n.arm\n.section .text.validator_probe,\"ax\",%progbits\n.global runtime74_validator_probe\nruntime74_validator_probe:\n  bx lr\n");
  run(tools.as, ["-march=armv6k", "-o", probeObject, probeSource]);
  run(tools.ld, ["-r", "-o", combinedObject, objectPath, probeObject]);
  validateObject(combinedObject, tools, "combined", true);
  if (supplied.length === 1) validateObject(resolve(supplied[0]), tools, "supplied", true);

  console.log(`arm runtime helpers 74: ${config.functions.length} functions, ${standalone.bytes} bytes, ${standalone.instructions} instructions, ${standalone.branches} local branches; standalone and combined checks passed`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
