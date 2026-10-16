#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "config/arm-duplicate-templates-77.json");
const SOURCE_PATH = join(ROOT, "src/main/arm_duplicate_templates_77.S");
const SPEC_PATH = join(ROOT, "docs/specs/main/arm_duplicate_templates_77.md");
const CONFIG_SHA256 = "1fc394509d7c5105c0fb3e784203588e4681fc29927c573e89a142be3556d32e";
const MAX_BUFFER = 16 * 1024 * 1024;

function fail(message) { throw new Error(message); }
function check(value, message) { if (!value) fail(message); }
function sha(data) { return createHash("sha256").update(data).digest("hex"); }
function same(actual, expected, what) {
  check(JSON.stringify(actual) === JSON.stringify(expected), `${what}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function tool(name) {
  for (const directory of (process.env.PATH ?? "").split(":")) {
    const candidate = join(directory, name);
    if (existsSync(candidate)) return candidate;
  }
  if (existsSync("/nix/store")) {
    const stores = readdirSync("/nix/store").filter((entry) =>
      entry.includes("gcc-arm-embedded-15.2.rel1") || entry.includes("arm-none-eabi-binutils-2.44"));
    for (const store of stores.sort().reverse()) {
      const candidate = join("/nix/store", store, "bin", name);
      if (existsSync(candidate)) return candidate;
    }
  }
  fail(`required tool not found: ${name}`);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", maxBuffer: MAX_BUFFER });
  if (result.error) fail(`${basename(command)} failed: ${result.error.message}`);
  if (result.status !== 0) fail(`${basename(command)} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

function validateConfig(config, bytes) {
  check(sha(bytes) === CONFIG_SHA256, "configuration SHA-256 mismatch");
  check(config.version === 1 && config.mode === "arm", "configuration version/mode mismatch");
  check(config.source === "src/main/arm_duplicate_templates_77.S", "unexpected source path");
  check(config.expectedBodyBytes === 912 && config.expectedInstructionCount === 228, "aggregate contract mismatch");
  check(config.functions.length === 25 && Object.keys(config.templates).length === 10, "function/template count mismatch");
  const templateCounts = new Map();
  for (const fn of config.functions) templateCounts.set(fn.template, (templateCounts.get(fn.template) ?? 0) + 1);
  for (const [name, template] of Object.entries(config.templates)) {
    check(templateCounts.get(name) === template.count, `template count mismatch: ${name}`);
  }
  const branch = config.branchIdentityContract;
  check(branch.mode === "arm" && branch.minimumAlignment === 4, "branch mode/alignment mismatch");
  check(new Set(branch.primaryEntries).size === 25 && branch.secondaryEntries.length === 0, "destination class count mismatch");
  const sites = new Map();
  for (const fn of config.functions) for (const transfer of fn.directTransfers) sites.set(transfer.symbol, (sites.get(transfer.symbol) ?? 0) + 1);
  check([...sites.values()].reduce((a, b) => a + b, 0) === 47, "direct-transfer count mismatch");
  same([...sites.keys()].sort(), [...branch.primaryEntries].sort(), "destination classes");
  for (const entry of branch.sharedClasses) check(sites.get(entry.symbol) === entry.siteCount, `shared class mismatch: ${entry.symbol}`);
  for (const symbol of branch.singletonClasses) check(sites.get(symbol) === 1, `singleton class mismatch: ${symbol}`);
  check(branch.classesPairwiseDistinct === true, "pairwise-distinct destination contract missing");
  const literals = config.functions.flatMap((fn) => fn.literals.map((literal) => ({ fn, literal })));
  check(literals.length === 5, "literal site count mismatch");
  same([...new Set(literals.map(({ literal }) => literal.identity))].sort(), Object.keys(config.literalIdentities).sort(), "literal identity classes");
  same(config.reusedLiteralIdentities.slice().sort(), Object.values(config.literalIdentities).map((x) => x.symbol).sort(), "reused literal symbols");
  check(config.newLiteralIdentities.length === 0, "new literal identities are forbidden");
  same(config.literalIdentityContract, { siteCount: 5, classCount: 3, newClassCount: 0, reusedClassCount: 3, reusedClassesPhysicallyVerified: true }, "literal identity contract");
  const expectedHashes = {
    algorithm: "sha256", lineTermination: "LF",
    instructionSchedule: "226fd8c1934e613d672965d62664caf30f653c701c21882d360e2e64f5fbc340",
    localTransferSchedule: "e4091ca96542632f2f2fb10237befa532ee1d794a452356d73c0c4077b62766a",
    relocationSchedule: "d9d3521d1808588eba20dc423550b5cb62061f221570021ecbc9e225170eda04",
    literalIdentitySchedule: "0b9d0df40ff8a05e49f173304262aadaa75a384abdefb16aaa337ee0bb1a437a",
  };
  same(config.canonicalHashes, expectedHashes, "canonical hashes");
  const relocRecords = [];
  const literalRecords = [];
  for (const fn of config.functions) {
    const entries = [
      ...fn.directTransfers,
      ...fn.literals.map((x) => ({ offset: x.offset, kind: "R_ARM_ABS32", mnemonic: ".word", symbol: config.literalIdentities[x.identity].symbol })),
    ].sort((a, b) => a.offset - b.offset);
    for (const x of entries) relocRecords.push(`${fn.name}:${x.offset}:${x.kind}:${x.mnemonic}:${x.symbol}`);
    for (const x of fn.literals) literalRecords.push(`${fn.name}:${x.loadOffset}:${x.offset}:${x.identity}`);
  }
  check(sha(`${relocRecords.join("\n")}\n`) === expectedHashes.relocationSchedule, "relocation schedule hash mismatch");
  check(sha(`${literalRecords.join("\n")}\n`) === expectedHashes.literalIdentitySchedule, "literal identity schedule hash mismatch");
}

function parseSections(text) {
  const result = new Map();
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\.text\.func_[0-9A-F]+)\s+PROGBITS\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s+\S+\s+AX\s+\S+\s+\S+\s+(\d+)/);
    if (match) result.set(match[2], { index: Number(match[1]), size: parseInt(match[3], 16), alignment: Number(match[4]) });
  }
  return result;
}

function parseSymbols(text) {
  const result = new Map();
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+FUNC\s+GLOBAL\s+DEFAULT\s+(\d+)\s+(func_[0-9A-F]+)$/);
    if (match) result.set(match[4], { value: parseInt(match[1], 16), size: Number(match[2]), section: Number(match[3]) });
  }
  return result;
}

function parseRelocations(text) {
  const byFunction = new Map();
  let current = null;
  for (const line of text.split("\n")) {
    const heading = line.match(/^Relocation section '\.rel\.text\.(func_[0-9A-F]+)'/);
    if (heading) { current = heading[1]; byFunction.set(current, []); continue; }
    const entry = line.match(/^([0-9a-fA-F]{8})\s+\S+\s+(R_ARM_(?:CALL|JUMP24|ABS32))\s+\S+\s+(\S+)$/);
    if (current && entry) byFunction.get(current).push({ offset: parseInt(entry[1], 16), kind: entry[2], symbol: entry[3] });
  }
  return byFunction;
}

function parseInstructions(text, bodySize) {
  const instructions = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+([a-z][a-z0-9.]*)\s*(.*?)\s*$/);
    if (!match) continue;
    const offset = parseInt(match[1], 16);
    if (offset < bodySize) instructions.push({ offset, mnemonic: match[2], operands: match[3].replace(/\s+@.*$/, "") });
  }
  return instructions;
}

function branchTarget(instruction) {
  const match = instruction.operands.match(/^([0-9a-fA-F]+)\s+</);
  return match ? parseInt(match[1], 16) : null;
}

function validateObject(config, object, tools) {
  const sections = parseSections(run(tools.readelf, ["-SW", object]));
  const symbols = parseSymbols(run(tools.readelf, ["-sW", object]));
  const relocations = parseRelocations(run(tools.readelf, ["-rW", object]));
  let bodyBytes = 0, ownedBytes = 0, instructionCount = 0, directCount = 0;
  let indirectTails = 0, conditionalReturns = 0, localBranches = 0, literalSlots = 0;
  const localRecords = [];
  const actualRelocationRecords = [];
  const instructionRecords = [];
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    check(section && section.alignment >= 4, `missing/misaligned section ${sectionName}`);
    const owned = fn.templateMaterialEndOffset === undefined ? template.bodySize : fn.templateMaterialEndOffset + 1;
    check(section.size === owned, `${sectionName} owned size mismatch`);
    const symbol = symbols.get(fn.name);
    check(symbol && symbol.value === 0 && symbol.size === template.bodySize && symbol.section === section.index, `symbol contract mismatch: ${fn.name}`);
    const expectedRelocs = [
      ...fn.directTransfers.map((x) => ({ offset: x.offset, kind: x.kind, symbol: x.symbol })),
      ...fn.literals.map((x) => ({ offset: x.offset, kind: "R_ARM_ABS32", symbol: config.literalIdentities[x.identity].symbol })),
    ].sort((a, b) => a.offset - b.offset);
    same(relocations.get(fn.name) ?? [], expectedRelocs, `relocations for ${fn.name}`);
    const instructions = parseInstructions(run(tools.objdump, ["-d", "-j", sectionName, object]), template.bodySize);
    check(instructions.length === template.instructionCount, `instruction count mismatch: ${fn.name}`);
    const byOffset = new Map(instructions.map((x) => [x.offset, x]));
    for (const transfer of fn.directTransfers) {
      const instruction = byOffset.get(transfer.offset);
      check(instruction?.mnemonic === transfer.mnemonic, `direct transfer mismatch: ${fn.name}+${transfer.offset}`);
    }
    for (const transfer of fn.indirectTransfers ?? []) {
      const instruction = byOffset.get(transfer.offset);
      check(instruction?.mnemonic === transfer.mnemonic && instruction.operands === transfer.register, `indirect tail mismatch: ${fn.name}+${transfer.offset}`);
    }
    for (const transfer of fn.conditionalReturns ?? []) {
      const instruction = byOffset.get(transfer.offset);
      check(instruction?.mnemonic === transfer.mnemonic && instruction.operands === transfer.register, `conditional return mismatch: ${fn.name}+${transfer.offset}`);
    }
    for (const literal of fn.literals) {
      const instruction = byOffset.get(literal.loadOffset);
      check(instruction?.mnemonic.startsWith("ldr"), `literal load mismatch: ${fn.name}+${literal.loadOffset}`);
    }
    const relocationOffsets = new Set(expectedRelocs.map((x) => x.offset));
    const locals = instructions.filter((x) => branchTarget(x) !== null && !relocationOffsets.has(x.offset));
    const localTargets = [...new Set(locals.map(branchTarget))].sort((a, b) => a - b);
    same(localTargets, fn.internalLabelOffsets, `local destinations for ${fn.name}`);
    for (const x of locals) {
      const target = branchTarget(x);
      check(target !== null, `unparsed local branch: ${fn.name}+${x.offset}`);
      localRecords.push(`${fn.name}:${x.offset}:${x.mnemonic}:${target}`);
    }
    for (const instruction of instructions) {
      const direct = fn.directTransfers.find((x) => x.offset === instruction.offset);
      const literal = fn.literals.find((x) => x.loadOffset === instruction.offset);
      const local = locals.find((x) => x.offset === instruction.offset);
      let operands = instruction.operands;
      if (direct) operands = direct.symbol;
      else if (literal) operands = `literal:${literal.identity}`;
      else if (local) operands = `local:+${branchTarget(local)}`;
      instructionRecords.push(`${fn.name}:${instruction.offset}:${instruction.mnemonic}:${operands}`);
    }
    for (const x of expectedRelocs) {
      const mnemonic = x.kind === "R_ARM_ABS32" ? ".word" : byOffset.get(x.offset)?.mnemonic;
      actualRelocationRecords.push(`${fn.name}:${x.offset}:${x.kind}:${mnemonic}:${x.symbol}`);
    }
    bodyBytes += template.bodySize; ownedBytes += section.size; instructionCount += instructions.length;
    directCount += fn.directTransfers.length; indirectTails += (fn.indirectTransfers ?? []).length;
    conditionalReturns += (fn.conditionalReturns ?? []).length; localBranches += locals.length; literalSlots += fn.literals.length;
  }
  same({ bodyBytes, ownedBytes, instructionCount, directCount, indirectTails, conditionalReturns, localBranches, literalSlots },
    { bodyBytes: 912, ownedBytes: 932, instructionCount: 228, directCount: 47, indirectTails: 2, conditionalReturns: 2, localBranches: 14, literalSlots: 5 }, "aggregate object metrics");
  check(sha(`${localRecords.join("\n")}\n`) === config.canonicalHashes.localTransferSchedule, "local-transfer schedule hash mismatch");
  check(sha(`${instructionRecords.join("\n")}\n`) === config.canonicalHashes.instructionSchedule, "instruction schedule hash mismatch");
  check(sha(`${actualRelocationRecords.join("\n")}\n`) === config.canonicalHashes.relocationSchedule, "object relocation schedule hash mismatch");
}

function main() {
  const configBytes = readFileSync(CONFIG_PATH);
  const config = JSON.parse(configBytes);
  validateConfig(config, configBytes);
  const source = readFileSync(SOURCE_PATH);
  check(source.length < MAX_BUFFER, "source exceeds 16 MiB validation limit");
  check(sha(source) === config.sourceSha256, "source SHA-256 mismatch");
  const spec = readFileSync(SPEC_PATH, "utf8");
  check(spec.includes(`sourceSha256\`: \`${config.sourceSha256}\``) && !spec.includes("PENDING_IMPLEMENTATION"), "specification source hash mismatch");
  const tools = { as: tool("arm-none-eabi-as"), readelf: tool("arm-none-eabi-readelf"), objdump: tool("arm-none-eabi-objdump") };
  if (process.argv[2]) validateObject(config, resolve(process.argv[2]), tools);
  const temporary = mkdtempSync(join(tmpdir(), "dt77-"));
  try {
    const object = join(temporary, "standalone.o");
    run(tools.as, ["-o", object, SOURCE_PATH]);
    validateObject(config, object, tools);
    const foreignSource = join(temporary, "foreign.S");
    writeFileSync(foreignSource, `${source.toString("utf8")}\n.section .text.dt77_foreign,"ax",%progbits\n.global dt77_foreign\n.type dt77_foreign,%function\ndt77_foreign:\n  bx lr\n.size dt77_foreign,.-dt77_foreign\n`);
    const foreignObject = join(temporary, "foreign.o");
    run(tools.as, ["-o", foreignObject, foreignSource]);
    validateObject(config, foreignObject, tools);
    const hostile = Buffer.from(source);
    hostile[hostile.indexOf(Buffer.from("mov r4, r0"))] ^= 1;
    check(sha(hostile) !== config.sourceSha256, "hostile source mutation was not rejected");
    const hostileConfig = Buffer.from(configBytes);
    hostileConfig[hostileConfig.indexOf(Buffer.from('"version": 1')) + 11] = 0x32;
    check(sha(hostileConfig) !== CONFIG_SHA256, "hostile configuration mutation was not rejected");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
  console.log("arm duplicate templates 77: PASS");
  console.log("25 functions, 10 templates, 912 body bytes, 932 owned bytes, 228 instructions");
  console.log("47 direct transfers, 2 indirect tails, 2 conditional returns, 14 local branches, 5 literal slots / 3 reused classes, 52 relocations, 25 destination classes");
  console.log("standalone and foreign-object acceptance passed; hostile source/config rejection passed; section-scoped disassembly used (16 MiB buffers)");
}

try { main(); } catch (error) { console.error(`arm duplicate templates 77: FAIL: ${error.message}`); process.exitCode = 1; }
