#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const EXPECTED_HASH = "f8d7097f62b286ea195b75fc80b82b81ac7deb8d0e227b52187c36c3486756dd";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-duplicate-templates-71.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = join(root, config.source);

function fail(message) { throw new Error(message); }
function check(condition, message) { if (!condition) fail(message); }
function run(file, args, options = {}) {
  return execFileSync(file, args, {
    cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: MAX_BUFFER, ...options,
  });
}
function findOnPath(name) {
  try { return run("sh", ["-c", 'command -v "$1"', "sh", name]).trim(); } catch { return ""; }
}
function statSafe(path) { try { return statSync(path); } catch { return null; } }
function findArmBinDir() {
  const assembler = process.env.ARM_NONE_EABI_AS || findOnPath("arm-none-eabi-as");
  if (assembler) return dirname(assembler);
  if (!statSafe("/nix/store")) fail("arm-none-eabi-as is not available on PATH");
  const matches = run("find", ["/nix/store", "-type", "f", "-path", "*/bin/arm-none-eabi-as"])
    .trim().split("\n").filter(Boolean);
  const selected = matches.find((path) => path.includes("gcc-arm-embedded-15.2")) || matches[0];
  if (!selected) fail("arm-none-eabi-as was not found");
  return dirname(selected);
}

function parseSections(output) {
  const result = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+/);
    if (match) result.set(match[2], { index: Number(match[1]), type: match[3], size: parseInt(match[4], 16) });
  }
  return result;
}
function parseSymbols(output) {
  const result = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(\S+)\s*$/);
    if (match) result.set(match[6], {
      value: parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], ndx: match[5],
    });
  }
  return result;
}
function parseRelocations(output) {
  const result = new Map();
  let current = null;
  for (const line of output.split("\n")) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
    if (heading) { current = heading[1]; result.set(current, []); continue; }
    if (line.startsWith("Relocation section ")) current = null;
    if (!current) continue;
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match) result.get(current).push({ offset: parseInt(match[1], 16), kind: match[2], symbol: match[3] });
  }
  return result;
}
function sectionBytes(objdump, object, section) {
  const bytes = [];
  for (const line of run(objdump, ["-s", "-j", section, object]).split("\n")) {
    const match = line.match(/^\s*[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}(?:\s+|$)){1,4})/);
    if (!match) continue;
    for (const group of match[1].trim().split(/\s+/)) {
      for (let index = 0; index < group.length; index += 2) bytes.push(parseInt(group.slice(index, index + 2), 16));
    }
  }
  return Buffer.from(bytes);
}
function parseDisassembly(objdump, object, sections) {
  const args = ["-dr"];
  for (const section of sections) args.push("-j", section);
  args.push(object);
  const result = new Map();
  let current = null;
  for (const line of run(objdump, args).split("\n")) {
    const heading = line.match(/^Disassembly of section (\.text\.[^:]+):/);
    if (heading) { current = heading[1]; result.set(current, new Map()); continue; }
    if (!current) continue;
    const instruction = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)/);
    if (instruction) result.get(current).set(parseInt(instruction[1], 16), instruction[2]);
  }
  return result;
}
function wordAt(bytes, offset) {
  check(offset >= 0 && offset + 4 <= bytes.length, `word offset ${offset} is out of range`);
  return bytes.readUInt32LE(offset);
}
function branchTarget(word, offset) {
  let displacement = word & 0xffffff;
  if (displacement & 0x800000) displacement -= 0x1000000;
  return offset + 8 + displacement * 4;
}
function normalizedBody(bytes, fn) {
  const result = Buffer.from(bytes.subarray(0, config.templates[fn.template].bodySize));
  for (const transfer of fn.directTransfers) result.fill(0, transfer.offset, transfer.offset + 4);
  for (const literal of fn.literals) result.fill(0, literal.loadOffset, literal.loadOffset + 4);
  return result;
}

function validateConfig() {
  check(config.version === 1 && config.mode === "arm", "expected version 1 ARM config");
  check(config.functions.length === 24, "expected exactly 24 functions");
  check(Object.keys(config.templates).length === 6, "expected exactly six templates");
  const counts = new Map();
  const destinations = new Map();
  const identities = new Map();
  let bytes = 0, instructions = 0, direct = 0, indirect = 0, slots = 0;
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    check(template, `${fn.name}: unknown template`);
    counts.set(fn.template, (counts.get(fn.template) || 0) + 1);
    bytes += template.bodySize;
    instructions += template.instructionCount;
    direct += fn.directTransfers.length;
    indirect += template.indirectCalls;
    slots += fn.literals.length;
    check(template.bodySize === template.instructionCount * 4, `${fn.template}: body/instruction mismatch`);
    check(fn.directTransfers.length === template.directTransfers, `${fn.name}: direct-transfer count mismatch`);
    check(fn.literals.length === template.poolSlots, `${fn.name}: pool-slot count mismatch`);
    check(fn.internalLabelOffsets.length === template.internalLabels, `${fn.name}: local-label count mismatch`);
    const materialEnd = fn.templateMaterialEndOffset ?? (template.bodySize - 1);
    check(materialEnd + 1 === template.bodySize + fn.literals.length * 4, `${fn.name}: delayed material boundary mismatch`);
    check(fn.nextGlobalOffset >= materialEnd + 1, `${fn.name}: next global overlaps owned material`);
    if (fn.anonymousMaterialOffset !== undefined) {
      check(fn.anonymousMaterialOffset === materialEnd + 1, `${fn.name}: anonymous material boundary mismatch`);
      check(fn.nextGlobalOffset > fn.anonymousMaterialOffset, `${fn.name}: anonymous material is empty`);
    }
    for (const transfer of fn.directTransfers) destinations.set(transfer.symbol, (destinations.get(transfer.symbol) || 0) + 1);
    for (const literal of fn.literals) identities.set(literal.identity, (identities.get(literal.identity) || 0) + 1);
  }
  for (const [name, template] of Object.entries(config.templates)) {
    check(counts.get(name) === template.count, `${name}: function count mismatch`);
  }
  check(bytes === 2532 && bytes === config.expectedBodyBytes, "expected exactly 2532 body bytes");
  check(instructions === 633, "expected exactly 633 instructions");
  check(direct === 66, "expected exactly 66 direct transfers");
  check(indirect === 10, "expected exactly ten indirect calls");
  check(slots === 12, "expected exactly twelve pool slots");
  check(Object.keys(config.literalIdentities).length === 7 && identities.size === 7, "expected exactly seven literal classes");
  const literalSymbols = Object.values(config.literalIdentities).map((entry) => entry.symbol);
  check(new Set(literalSymbols).size === 7, "literal classes must be pairwise distinct");
  check(config.reusedLiteralIdentities.length === 1 && config.reusedLiteralIdentities[0] === "service_query_accepted_status_31",
    "reused literal identity mismatch");
  check(config.newLiteralIdentities.length === 6 && config.newLiteralIdentities.every((symbol) => literalSymbols.includes(symbol)),
    "new literal identity mismatch");
  for (const [identity, count] of identities) {
    const expected = identity === "retry_base_status" || identity === "accepted_status" ? 3
      : identity === "nested_dispatch" ? 2 : 1;
    check(count === expected, `${identity}: literal class count mismatch`);
  }
  const branch = config.branchIdentityContract;
  check(branch.mode === "arm" && branch.minimumAlignment === 4 && branch.classesPairwiseDistinct,
    "branch identity header mismatch");
  const branchSymbols = [...branch.primaryEntries, ...branch.secondaryEntries];
  check(new Set(branchSymbols).size === branchSymbols.length, "branch identities must be pairwise distinct");
  for (const entry of branch.sharedClasses) check(destinations.get(entry.symbol) === entry.siteCount,
    `${entry.symbol}: shared site count mismatch`);
  for (const symbol of branch.singletonClasses) check(destinations.get(symbol) === 1, `${symbol}: singleton site count mismatch`);
  const relation = branch.secondaryEntryRelations;
  check(relation.length === 1 && relation[0].symbol === "shared_completion_secondary_71" &&
    relation[0].owner === "func_00312530" && relation[0].ownerOffset === 416 &&
    relation[0].nextGlobal === "func_00312920" && relation[0].bytesBeforeNextGlobal === 592,
  "secondary-entry relation mismatch");
}

function validateObject(object, tools, label, allowForeign = false, expectFixture = false) {
  const owned = new Set(config.functions.map((fn) => `.text.${fn.name}`));
  const sections = parseSections(run(tools.readelf, ["-W", "-S", object]));
  const symbols = parseSymbols(run(tools.readelf, ["-W", "-s", object]));
  const relocations = parseRelocations(run(tools.readelf, ["-W", "-r", object]));
  const disassembly = parseDisassembly(tools.objdump, object, owned);
  if (!allowForeign) {
    const text = [...sections].filter(([name, section]) => name.startsWith(".text") && section.size).map(([name]) => name);
    check(text.length === owned.size && text.every((name) => owned.has(name)), `${label}: unexpected nonempty text section`);
  } else if (expectFixture) {
    check(sections.get(".text.validator_foreign")?.size === 4, `${label}: foreign fixture was not preserved`);
  }
  let direct = 0, slots = 0, instructions = 0, indirect = 0;
  const normalized = new Map();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const template = config.templates[fn.template];
    const expectedSize = (fn.templateMaterialEndOffset ?? (template.bodySize - 1)) + 1;
    const section = sections.get(sectionName);
    check(section?.type === "PROGBITS" && section.size === expectedSize, `${label}/${fn.name}: section contract mismatch`);
    const symbol = symbols.get(fn.name);
    check(symbol?.type === "FUNC" && symbol.bind === "GLOBAL" && symbol.value === 0 && symbol.size === template.bodySize,
      `${label}/${fn.name}: function symbol contract mismatch`);
    check(Number(symbol.ndx) === section.index, `${label}/${fn.name}: function is outside owned section`);
    const bytes = sectionBytes(tools.objdump, object, sectionName);
    check(bytes.length === expectedSize, `${label}/${fn.name}: incomplete section bytes`);
    const decoded = disassembly.get(sectionName);
    const bodyInstructions = [...decoded.keys()].filter((offset) => offset < template.bodySize);
    check(bodyInstructions.length === template.instructionCount, `${label}/${fn.name}: instruction count mismatch`);
    instructions += bodyInstructions.length;
    const expectedRelocations = [
      ...fn.directTransfers.map(({ offset, kind, symbol: target }) => ({ offset, kind, symbol: target })),
      ...fn.literals.map((literal) => ({
        offset: literal.offset, kind: "R_ARM_ABS32", symbol: config.literalIdentities[literal.identity].symbol,
      })),
    ].sort((a, b) => a.offset - b.offset);
    const actualRelocations = (relocations.get(sectionName) || []).sort((a, b) => a.offset - b.offset);
    check(JSON.stringify(actualRelocations) === JSON.stringify(expectedRelocations), `${label}/${fn.name}: relocation mismatch`);
    direct += fn.directTransfers.length;
    slots += fn.literals.length;
    const externalOffsets = new Set(fn.directTransfers.map((entry) => entry.offset));
    const literalLoads = new Map(fn.literals.map((entry) => [entry.loadOffset, entry.offset]));
    const localTargets = new Set();
    let functionIndirect = 0;
    for (let offset = 0; offset < template.bodySize; offset += 4) {
      const word = wordAt(bytes, offset);
      if ((word & 0x0e000000) === 0x0a000000 && !externalOffsets.has(offset)) {
        const target = branchTarget(word, offset);
        check(target >= 0 && target < template.bodySize && target % 4 === 0,
          `${label}/${fn.name}: local branch escapes body`);
        localTargets.add(target);
      }
      if ((word & 0x0ffffff0) === 0x012fff30) functionIndirect++;
      if ((word & 0x0c500000) === 0x04100000 && ((word >>> 16) & 15) === 15) {
        check(literalLoads.has(offset), `${label}/${fn.name}: undeclared PC-relative load at +${offset}`);
      }
    }
    check(functionIndirect === template.indirectCalls, `${label}/${fn.name}: indirect-call count mismatch`);
    indirect += functionIndirect;
    check(JSON.stringify([...localTargets].sort((a, b) => a - b)) === JSON.stringify(fn.internalLabelOffsets),
      `${label}/${fn.name}: local destinations mismatch`);
    for (const transfer of fn.directTransfers) check(decoded.get(transfer.offset) === transfer.mnemonic,
      `${label}/${fn.name}: expected ${transfer.mnemonic} at +${transfer.offset}`);
    for (const literal of fn.literals) {
      const load = wordAt(bytes, literal.loadOffset);
      const delta = load & 0xfff;
      const target = literal.loadOffset + 8 + ((load & 0x00800000) ? delta : -delta);
      check(target === literal.offset, `${label}/${fn.name}: literal target mismatch`);
    }
    const body = normalizedBody(bytes, fn);
    const prior = normalized.get(fn.template);
    if (prior) check(prior.equals(body), `${label}/${fn.template}: normalized bodies differ`);
    else normalized.set(fn.template, body);
  }
  check(instructions === 633 && direct === 66 && indirect === 10 && slots === 12, `${label}: aggregate totals mismatch`);
}

validateConfig();
const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
check(config.sourceSha256 === EXPECTED_HASH, "sourceSha256 does not match the pinned batch-71 hash");
check(sourceHash === config.sourceSha256, `source SHA-256 mismatch: config=${config.sourceSha256}, actual=${sourceHash}`);
const supplied = process.argv.slice(2);
check(supplied.length <= 1, "usage: validate-arm-duplicate-templates-71.mjs [object]");
const armBin = findArmBinDir();
const tools = Object.fromEntries(["as", "ld", "readelf", "objdump"].map((tool) => {
  const path = join(armBin, `arm-none-eabi-${tool}`);
  check(statSafe(path), `${basename(path)} is unavailable beside the assembler`);
  return [tool, path];
}));
const temporary = mkdtempSync(join(tmpdir(), "validate-arm-duplicate-templates-71-"));
try {
  const standalone = join(temporary, "standalone.o");
  run(tools.as, ["-mcpu=arm1176jzf-s", "-mfpu=vfpv2", "-o", standalone, sourcePath]);
  validateObject(standalone, tools, "standalone");
  const foreignSource = join(temporary, "foreign.S");
  const foreignObject = join(temporary, "foreign.o");
  const combined = join(temporary, "combined.o");
  writeFileSync(foreignSource, ".syntax unified\n.arm\n.section .text.validator_foreign,\"ax\",%progbits\n.global validator_foreign\n.type validator_foreign,%function\nvalidator_foreign:\n bx lr\n.size validator_foreign,.-validator_foreign\n");
  run(tools.as, ["-mcpu=arm1176jzf-s", "-o", foreignObject, foreignSource]);
  run(tools.ld, ["-r", "-o", combined, foreignObject, standalone]);
  validateObject(combined, tools, "combined", true, true);
  if (supplied.length === 1) validateObject(resolve(supplied[0]), tools, "supplied", true);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
console.log(`arm duplicate templates 71: PASS (24 functions, 6 templates, 2532 body bytes, 633 instructions, 66 direct transfers, 10 indirect calls, 12 ABS32 slots, 7 classes, sha256 ${sourceHash})`);
