#!/usr/bin/env node

import { createHash } from "node:crypto";
import { accessSync, constants, existsSync, readFileSync, readdirSync, realpathSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_BUFFER = 16 * 1024 * 1024;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const CONFIG_PATH = join(ROOT, "config", "arm-runtime-helpers-82.json");
const EXPECTED_SOURCE = "src/main/arm_runtime_helpers_82.S";
const EXPECTED_FULL_HASH = "7ada484f59eb8d6ee0008db333f1b55af83550e1a5e1672f62680af45d287e4c";
const EXPECTED_BRANCH_HASH = "80a1698f9bbb8131b61923d8611548dcda37c333329c2a1b4c123289bda940fb";
const EXPECTED_RETURN_HASH = "d4b4814485e6603dcfa04abc5ddd020d90549b620c06d844db345c86db1213a4";
const EXPECTED_NAMES = [
  "func_002C3128", "func_002C3320", "func_002C3364", "func_002C8880",
  "func_002CACA0", "func_00322440", "func_0032F118", "func_00330488",
  "func_003315DC", "func_003315FC", "func_003316D4", "func_003316F4",
  "func_0033612C", "func_0033C1A4", "func_00387350", "func_00396454",
  "func_003B7E60", "func_003C4E48", "func_003C88C0", "func_004108EC",
  "func_0045ECC0", "func_004623DC", "func_004C0728", "func_004C22F0",
];

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sameArray(actual, expected, what) {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${what} does not match the required ordered inventory`);
  }
}

function executable(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function pathLookup(name) {
  for (const directory of (process.env.PATH ?? "").split(":")) {
    if (!directory) continue;
    const candidate = join(directory, name);
    if (executable(candidate)) return candidate;
  }
  return null;
}

function nixLookup(name) {
  const store = "/nix/store";
  if (!existsSync(store)) return null;
  const candidates = [];
  for (const entry of readdirSync(store)) {
    if (!entry.includes("arm-none-eabi-binutils") && !entry.includes("gcc-arm-embedded")) continue;
    const candidate = join(store, entry, "bin", name);
    if (executable(candidate)) candidates.push(candidate);
  }
  candidates.sort((a, b) => {
    const aPreferred = a.includes("binutils-2.44") ? 0 : 1;
    const bPreferred = b.includes("binutils-2.44") ? 0 : 1;
    return aPreferred - bPreferred || a.localeCompare(b);
  });
  return candidates[0] ?? null;
}

function findTool(kind) {
  const envName = `ARM_${kind.toUpperCase()}`;
  const explicit = process.env[envName];
  if (explicit) {
    const candidate = isAbsolute(explicit) ? explicit : pathLookup(explicit);
    if (!candidate || !executable(candidate)) fail(`${envName} is not executable: ${explicit}`);
    return candidate;
  }
  for (const prefix of ["arm-none-eabi-", "arm-linux-gnueabi-"]) {
    const candidate = pathLookup(`${prefix}${kind}`);
    if (candidate) return candidate;
  }
  const candidate = nixLookup(`arm-none-eabi-${kind}`);
  if (candidate) return candidate;
  fail(`cannot find an ARM ${kind}; set ${envName}`);
}

function run(tool, args) {
  const result = spawnSync(tool, args, {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
    windowsHide: true,
  });
  if (result.error) fail(`${basename(tool)} failed: ${result.error.message}`);
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "no diagnostic").trim();
    fail(`${basename(tool)} ${args.join(" ")} failed (${result.status}): ${detail}`);
  }
  return result.stdout;
}

function validateConfig(config, sourceBytes) {
  if (config.schemaVersion !== 1) fail("config schemaVersion must be 1");
  if (config.source !== EXPECTED_SOURCE) fail(`config source must be ${EXPECTED_SOURCE}`);
  if (config.mode !== "arm") fail("config mode must be arm");
  if (config.totalBodySize !== 768 || config.totalAdjacentSize !== 0) fail("config aggregate sizes are invalid");
  if (config.branchScheduleSha256 !== EXPECTED_BRANCH_HASH) fail("config branch schedule hash is invalid");
  if (config.returnScheduleSha256 !== EXPECTED_RETURN_HASH) fail("config return schedule hash is invalid");
  if (!/^[0-9a-f]{64}$/.test(config.sourceSha256)) fail("config sourceSha256 is not finalized");
  const actualSourceHash = sha256(sourceBytes);
  if (actualSourceHash !== config.sourceSha256) fail(`source SHA-256 mismatch: ${actualSourceHash}`);
  if (!Array.isArray(config.functions)) fail("config functions must be an array");
  sameArray(config.functions.map(({ name }) => name), EXPECTED_NAMES, "config functions");
  for (const fn of config.functions) {
    if (fn.size !== 32) fail(`${fn.name}: configured size must be 32`);
    if (!Array.isArray(fn.calls) || fn.calls.length !== 0) fail(`${fn.name}: calls must be empty`);
    if (!Array.isArray(fn.adjacentWords) || fn.adjacentWords.length !== 0) fail(`${fn.name}: adjacentWords must be empty`);
  }
  const identity = config.identityClasses?.call_free_runtime_helpers_82;
  if (!identity) fail("missing call_free_runtime_helpers_82 identity class");
  sameArray(identity.members ?? [], EXPECTED_NAMES, "identity-class members");
  sameArray(identity.parameters ?? [], ["controlFlowSchedule", "memoryAccessSchedule", "arithmeticSchedule"], "identity-class parameters");
  if (!Array.isArray(config.pcRelativeDataAccesses) || config.pcRelativeDataAccesses.length !== 0) fail("pcRelativeDataAccesses must be empty");
  if (Object.keys(config.symbolicIdentities ?? {}).length !== 0 || Object.keys(config.symbolicSlots ?? {}).length !== 0) fail("symbolic maps must be empty");
}

function parseSections(output) {
  const sections = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(\S+)\s+/);
    if (!match) continue;
    if (sections.has(match[2])) fail(`duplicate section name: ${match[2]}`);
    sections.set(match[2], { index: Number(match[1]), type: match[3], size: parseInt(match[4], 16), flags: match[5] });
  }
  return sections;
}

function parseSymbols(output) {
  const symbols = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/);
    if (!match) continue;
    symbols.push({ value: parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], ndx: match[6], name: match[7] });
  }
  return symbols;
}

function canonicalInstruction(mnemonic, operands) {
  let normalizedMnemonic = mnemonic.toLowerCase();
  let normalizedOperands = operands.trim();
  if (normalizedMnemonic === "nop" && /mov\s+r0,\s*r0/.test(normalizedOperands)) {
    normalizedMnemonic = "mov";
    normalizedOperands = "r0, r0";
  } else {
    normalizedOperands = normalizedOperands.replace(/\s+@.*$/, "");
  }
  normalizedOperands = normalizedOperands
    .replace(/\s+<[^>]*>\s*$/, "")
    .replace(/#0x([0-9a-f]+)/gi, (_, hex) => `#${parseInt(hex, 16)}`)
    .replace(/\s+/g, " ")
    .trim();
  return { mnemonic: normalizedMnemonic, operands: normalizedOperands };
}

function disassembleSection(objdump, objectPath, name) {
  const section = `.text.${name}`;
  const output = run(objdump, ["-d", "-j", section, objectPath]);
  const instructions = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+(?:[0-9a-fA-F]{8}\s+)+([a-zA-Z][a-zA-Z0-9.]*)\s*(.*?)\s*$/);
    if (!match) continue;
    const canonical = canonicalInstruction(match[2], match[3]);
    instructions.push({ offset: parseInt(match[1], 16), ...canonical });
  }
  return instructions;
}

function validateObject(objectPath, tools, supplied) {
  const header = run(tools.readelf, ["-hW", objectPath]);
  if (!/^\s*Class:\s+ELF32\s*$/m.test(header) || !/^\s*Data:\s+2's complement, little endian\s*$/m.test(header) || !/^\s*Machine:\s+ARM\s*$/m.test(header)) {
    fail("object must be ELF32 little-endian ARM");
  }
  const sections = parseSections(run(tools.readelf, ["-SW", objectPath]));
  const symbols = parseSymbols(run(tools.readelf, ["-sW", objectPath]));
  const sectionIndices = new Set();
  for (const name of EXPECTED_NAMES) {
    const sectionName = `.text.${name}`;
    const section = sections.get(sectionName);
    if (!section) fail(`${name}: missing section ${sectionName}`);
    if (section.type !== "PROGBITS" || section.size !== 32 || !section.flags.includes("A") || !section.flags.includes("X") || section.flags.includes("W")) {
      fail(`${name}: section must be 32-byte, read-only executable PROGBITS`);
    }
    sectionIndices.add(String(section.index));
    const matches = symbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1) fail(`${name}: expected exactly one symbol definition`);
    const symbol = matches[0];
    if (symbol.value !== 0 || symbol.size !== 32 || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.ndx !== String(section.index)) {
      fail(`${name}: symbol metadata does not match its owned section`);
    }
    const relocations = run(tools.objdump, ["-r", "-j", sectionName, objectPath]);
    if (/^\s*[0-9a-fA-F]+\s+R_ARM_/m.test(relocations)) fail(`${name}: owned section contains a relocation`);
  }
  if (!supplied) {
    const exportedFunctions = symbols.filter((symbol) => symbol.bind === "GLOBAL" && symbol.type === "FUNC" && symbol.ndx !== "UND").map(({ name }) => name);
    sameArray(exportedFunctions, EXPECTED_NAMES, "standalone exported functions");
  }

  const fullSchedule = [];
  const branchSchedule = [];
  const returnSchedule = [];
  let instructionCount = 0;
  let branchCount = 0;
  let returnCount = 0;
  let memoryCount = 0;
  const conditionalBranch = /^b(?:eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le)$/;
  const memoryOperation = /^(?:ldr|str|ldm|stm|vldr|vstr|vldm|vstm|push|pop)/;
  for (const name of EXPECTED_NAMES) {
    const instructions = disassembleSection(tools.objdump, objectPath, name);
    if (instructions.length !== 8) fail(`${name}: expected 8 instructions, found ${instructions.length}`);
    instructions.forEach((instruction, index) => {
      if (instruction.offset !== index * 4) fail(`${name}: instruction offset schedule is not contiguous ARM state`);
      const offset = instruction.offset.toString(16);
      fullSchedule.push(`${name}:${offset}:${instruction.mnemonic}:${instruction.operands}`);
      if (/^(?:bl|blx)$/.test(instruction.mnemonic)) fail(`${name}: call instruction is forbidden`);
      if (conditionalBranch.test(instruction.mnemonic)) {
        const target = instruction.operands.match(/^([0-9a-f]+)$/)?.[1];
        if (!target) fail(`${name}:${offset}: branch target is not function-local canonical hex`);
        branchSchedule.push(`${name}:${offset}:${instruction.mnemonic}:${target}`);
        branchCount += 1;
      } else if (instruction.mnemonic === "b") {
        fail(`${name}:${offset}: unconditional or unsupported branch is forbidden`);
      }
      if (instruction.mnemonic === "bx" && instruction.operands === "lr") {
        returnSchedule.push(`${name}:${offset}:${instruction.mnemonic}:${instruction.operands}`);
        returnCount += 1;
      } else if (instruction.mnemonic === "bx") {
        fail(`${name}:${offset}: non-return BX is forbidden`);
      }
      if (memoryOperation.test(instruction.mnemonic)) memoryCount += 1;
      instructionCount += 1;
    });
  }
  if (instructionCount !== 192 || branchCount !== 12 || returnCount !== 24 || memoryCount !== 86) {
    fail(`aggregate mismatch: ${instructionCount} instructions, ${branchCount} branches, ${returnCount} returns, ${memoryCount} memory operations`);
  }
  const fullHash = sha256(fullSchedule.join("\n"));
  const branchHash = sha256(branchSchedule.join("\n"));
  const returnHash = sha256(returnSchedule.join("\n"));
  if (fullHash !== EXPECTED_FULL_HASH) fail(`full instruction schedule SHA-256 mismatch: ${fullHash}`);
  if (branchHash !== EXPECTED_BRANCH_HASH) fail(`branch schedule SHA-256 mismatch: ${branchHash}`);
  if (returnHash !== EXPECTED_RETURN_HASH) fail(`return schedule SHA-256 mismatch: ${returnHash}`);
}

function main() {
  if (process.argv.length > 3 || process.argv[2] === "--help" || process.argv[2] === "-h") {
    if (process.argv.length <= 3) {
      console.log("usage: node scripts/validate-arm-runtime-helpers-82.mjs [object-file]");
      return;
    }
    fail("expected at most one object-file argument");
  }
  const sourcePath = join(ROOT, EXPECTED_SOURCE);
  const sourceBytes = readFileSync(sourcePath);
  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  validateConfig(config, sourceBytes);
  const supplied = process.argv.length === 3;
  const tools = { objdump: findTool("objdump"), readelf: findTool("readelf") };
  if (!supplied) tools.as = findTool("as");
  let temporaryDirectory = null;
  let objectPath;
  try {
    if (supplied) {
      objectPath = realpathSync(resolve(process.cwd(), process.argv[2]));
    } else {
      temporaryDirectory = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-82-"));
      objectPath = join(temporaryDirectory, "arm_runtime_helpers_82.o");
      run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", objectPath, sourcePath]);
    }
    validateObject(objectPath, tools, supplied);
  } finally {
    if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
  }
  console.log(`arm runtime/helper batch 82 validated (${supplied ? "supplied object" : "standalone assembly"}): 24 functions, 768 bytes, 192 instructions, 12 conditional branches, 24 returns, 86 memory operations, zero relocations/data`);
}

try {
  main();
} catch (error) {
  console.error(`validate-arm-runtime-helpers-82: ${error.message}`);
  process.exitCode = 1;
}
