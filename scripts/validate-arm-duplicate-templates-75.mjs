#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const EXPECTED_HASH = "34b5331b5b761e5b52b80f9f2647458910e4389c3e18a56ea867ef5b43dcdd9a";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-duplicate-templates-75.json");
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
  const bundled = join(root, "node_modules", "@xpack-dev-tools", "arm-none-eabi-gcc", ".content", "bin");
  if (statSafe(join(bundled, "arm-none-eabi-as"))) return bundled;
  if (!statSafe("/nix/store")) fail("arm-none-eabi-as is not available on PATH");
  let matches = run("find", ["/nix/store", "-type", "f", "-path", "*/bin/arm-none-eabi-as"])
    .trim().split("\n").filter(Boolean);
  if (matches.length === 0 && findOnPath("nix")) {
    run("nix", ["build", "--no-link", "--print-out-paths", "nixpkgs#pkgsCross.arm-embedded.buildPackages.binutils"]);
    matches = run("find", ["/nix/store", "-type", "f", "-path", "*/bin/arm-none-eabi-as"])
      .trim().split("\n").filter(Boolean);
  }
  const selected = matches.find((path) => path.includes("gcc-arm-embedded-15.2")) || matches[0];
  if (!selected) fail("arm-none-eabi-as was not found");
  return dirname(selected);
}

function parseSections(output) {
  const result = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/);
    if (match) result.set(match[2], {
      index: Number(match[1]), type: match[3], size: parseInt(match[4], 16),
      flags: match[5], alignment: Number(match[6]),
    });
  }
  return result;
}
function parseSymbols(output) {
  const result = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
    if (match) result.set(match[7], {
      value: parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4],
      visibility: match[5], ndx: match[6],
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
  return result;
}

const literalDestinationRegisters = {
  initialize_pointer_vector: [1],
  grow_record_arena: [],
  register_six_fields: [5],
  visit_matching_member: [],
  replace_owned_dispatch: [1],
  clear_ready_flag: [],
  register_five_fields: [5],
  construct_linked_node: [1],
  format_bounded_pair: [0, 0],
  submit_render_context: [6, 0, 0, 0],
  guarded_service_exchange: [4, 0, 5, 1],
};

function validateConfig() {
  check(config.version === 1 && config.mode === "arm", "expected version 1 ARM config");
  check(config.functions.length === 24, "expected exactly 24 functions");
  check(Object.keys(config.templates).length === 11, "expected exactly eleven templates");
  const counts = new Map();
  const destinations = new Map();
  let bytes = 0, instructions = 0, direct = 0, indirect = 0, conditionalReturns = 0, slots = 0;
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    check(template, `${fn.name}: unknown template`);
    counts.set(fn.template, (counts.get(fn.template) || 0) + 1);
    bytes += template.bodySize;
    instructions += template.instructionCount;
    direct += fn.directTransfers.length;
    indirect += (fn.indirectCalls || []).length;
    conditionalReturns += (fn.conditionalReturns || []).length;
    slots += fn.literals.length;
    check(template.bodySize === template.instructionCount * 4, `${fn.template}: body/instruction mismatch`);
    check(fn.directTransfers.length === template.directTransfers, `${fn.name}: direct-transfer count mismatch`);
    check((fn.indirectCalls || []).length === template.indirectCalls, `${fn.name}: indirect-call count mismatch`);
    check((fn.conditionalReturns || []).length === template.conditionalReturns, `${fn.name}: conditional-return count mismatch`);
    check(fn.literals.length === template.poolSlots, `${fn.name}: pool-slot count mismatch`);
    check(fn.internalLabelOffsets.length === template.internalLabels, `${fn.name}: local-label count mismatch`);
    check(template.addressReferences === 0 && !(fn.addressReferences || []).length, `${fn.name}: unexpected address reference`);
    const materialEnd = Math.max(template.bodySize, ...fn.literals.map((literal) => literal.offset + 4));
    check(fn.templateMaterialEndOffset + 1 === materialEnd, `${fn.name}: material boundary mismatch`);
    check(fn.nextGlobalOffset >= materialEnd, `${fn.name}: next global overlaps owned material`);
    for (const transfer of fn.directTransfers) destinations.set(transfer.symbol, (destinations.get(transfer.symbol) || 0) + 1);
    for (const literal of fn.literals) {
      check(config.literalIdentities[literal.identity], `${fn.name}: unknown literal identity`);
      check(Number.isInteger(literal.offset) && literal.offset >= template.bodySize && literal.offset % 4 === 0,
        `${fn.name}: invalid literal offset`);
      check(Number.isInteger(literal.loadOffset) && literal.loadOffset >= 0 && literal.loadOffset < template.bodySize &&
        literal.loadOffset % 4 === 0, `${fn.name}: invalid literal load offset`);
    }
  }
  for (const [name, template] of Object.entries(config.templates)) {
    check(counts.get(name) === template.count, `${name}: function count mismatch`);
  }
  check(bytes === 2432 && bytes === config.expectedBodyBytes, "expected exactly 2432 body bytes");
  check(instructions === 608 && instructions === config.expectedInstructionCount, "expected exactly 608 instructions");
  check(direct === 76, "expected exactly 76 direct transfers");
  check(indirect === 2, "expected exactly two indirect calls");
  check(conditionalReturns === 4, "expected exactly four conditional returns");
  check(slots === 30, "expected exactly 30 literal slots");
  const identitySymbols = Object.values(config.literalIdentities).map((entry) => entry.symbol);
  check(identitySymbols.length === 20 && new Set(identitySymbols).size === 20,
    "literal identities must contain twenty pairwise-distinct symbols");
  const partition = [...config.reusedLiteralIdentities, ...config.newLiteralIdentities];
  check(partition.length === 20 && new Set(partition).size === 20 &&
    partition.every((symbol) => identitySymbols.includes(symbol)), "literal identity partition mismatch");
  check(config.reusedLiteralIdentities.length === 3 && config.newLiteralIdentities.length === 17,
    "literal identity new/reused partition mismatch");
  const literal = config.literalIdentityContract;
  check(literal.siteCount === 30 && literal.classCount === 20 && literal.newClassCount === 17 &&
    literal.reusedClassCount === 3 && literal.newClassesPairwiseDistinct &&
    literal.newClassesDistinctFromConfiguredClasses, "literal identity contract mismatch");
  const branch = config.branchIdentityContract;
  check(branch.mode === "arm" && branch.minimumAlignment === 4 && branch.classesPairwiseDistinct,
    "branch identity header mismatch");
  const branchSymbols = [...branch.primaryEntries, ...branch.secondaryEntries];
  check(branchSymbols.length === 27 && new Set(branchSymbols).size === 27,
    "branch identities must comprise 27 pairwise-distinct classes");
  check(branch.secondaryEntries.length === 1 && branch.secondaryEntryRelations.length === 1,
    "secondary branch identity count mismatch");
  for (const relation of branch.secondaryEntryRelations) {
    check(branch.secondaryEntries.includes(relation.symbol), `${relation.symbol}: undeclared secondary entry`);
    check(relation.ownerOffset + relation.bytesBeforeNextGlobal ===
      parseInt(relation.nextGlobal.slice(5), 16) - parseInt(relation.owner.slice(5), 16),
    `${relation.symbol}: secondary ownership relation mismatch`);
  }
  for (const entry of branch.sharedClasses) check(destinations.get(entry.symbol) === entry.siteCount,
    `${entry.symbol}: shared site count mismatch`);
  for (const symbol of branch.singletonClasses) check(destinations.get(symbol) === 1, `${symbol}: singleton site count mismatch`);
  check(destinations.size === branchSymbols.length &&
    [...destinations.keys()].every((symbol) => branchSymbols.includes(symbol)), "undeclared direct-transfer identity");
}

function validateSecondaryRelations(symbols, label, requireDefinitions) {
  for (const relation of config.branchIdentityContract.secondaryEntryRelations) {
    const secondary = symbols.get(relation.symbol);
    const owner = symbols.get(relation.owner);
    const next = symbols.get(relation.nextGlobal);
    const defined = Number.isInteger(Number(secondary?.ndx));
    if (requireDefinitions) check(defined, `${label}: secondary fixture did not define ${relation.symbol}`);
    if (!defined) continue;
    check(Number.isInteger(Number(owner?.ndx)) && Number.isInteger(Number(next?.ndx)),
      `${label}: secondary owner boundaries are undefined`);
    check(secondary.ndx === owner.ndx && secondary.ndx === next.ndx,
      `${label}: secondary owner boundaries occupy different sections`);
    check(secondary.value - owner.value === relation.ownerOffset,
      `${label}: secondary owner offset mismatch`);
    check(next.value - secondary.value === relation.bytesBeforeNextGlobal,
      `${label}: secondary next-global distance mismatch`);
  }
}

function validateObject(object, tools, label, options = {}) {
  const { allowForeign = false, expectForeign = false, requireSecondaryDefinitions = false } = options;
  const owned = new Set(config.functions.map((fn) => `.text.${fn.name}`));
  const sections = parseSections(run(tools.readelf, ["-W", "-S", object]));
  const symbols = parseSymbols(run(tools.readelf, ["-W", "-s", object]));
  const relocations = parseRelocations(run(tools.readelf, ["-W", "-r", object]));
  const disassembly = parseDisassembly(tools.objdump, object, owned);
  if (!allowForeign) {
    const text = [...sections].filter(([name, section]) => name.startsWith(".text") && section.size).map(([name]) => name);
    check(text.length === owned.size && text.every((name) => owned.has(name)), `${label}: unexpected nonempty text section`);
  }
  if (expectForeign) check(sections.get(".text.validator_foreign")?.size === 4, `${label}: foreign fixture was not preserved`);
  let instructions = 0, direct = 0, indirect = 0, conditionalReturns = 0, localBranches = 0, slots = 0;
  const normalized = new Map();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const template = config.templates[fn.template];
    const section = sections.get(sectionName);
    const expectedSize = Math.max(template.bodySize, ...fn.literals.map((literal) => literal.offset + 4));
    check(section?.type === "PROGBITS" && section.size === expectedSize && section.flags.includes("A") &&
      section.flags.includes("X") && section.alignment === 4, `${label}/${fn.name}: section contract mismatch`);
    const symbol = symbols.get(fn.name);
    check(symbol?.type === "FUNC" && symbol.bind === "GLOBAL" && symbol.value === 0 && symbol.size === template.bodySize,
      `${label}/${fn.name}: function symbol contract mismatch`);
    check(Number(symbol.ndx) === section.index, `${label}/${fn.name}: function is outside owned section`);
    const bytes = sectionBytes(tools.objdump, object, sectionName);
    check(bytes.length === expectedSize, `${label}/${fn.name}: incomplete section bytes`);
    const decoded = disassembly.get(sectionName);
    const decodedBodyCount = decoded === undefined ? 0 : [...decoded.keys()].filter((offset) => offset < template.bodySize).length;
    check(decodedBodyCount === template.instructionCount, `${label}/${fn.name}: instruction count mismatch`);
    instructions += decodedBodyCount;
    const expectedRelocations = [
      ...fn.directTransfers.map(({ offset, kind, symbol: target }) => ({ offset, kind, symbol: target })),
      ...fn.literals.map((literalEntry) => ({ offset: literalEntry.offset, kind: "R_ARM_ABS32",
        symbol: config.literalIdentities[literalEntry.identity].symbol })),
    ].sort((a, b) => a.offset - b.offset);
    const actualRelocations = (relocations.get(sectionName) || []).sort((a, b) => a.offset - b.offset);
    check(JSON.stringify(actualRelocations) === JSON.stringify(expectedRelocations), `${label}/${fn.name}: relocation mismatch`);
    direct += fn.directTransfers.length;
    const externalOffsets = new Set(fn.directTransfers.map((entry) => entry.offset));
    const localTargets = new Set();
    let functionIndirect = 0, functionConditionalReturns = 0;
    const literalLoadOffsets = new Set(fn.literals.map((literalEntry) => literalEntry.loadOffset));
    for (let offset = 0; offset < template.bodySize; offset += 4) {
      const word = wordAt(bytes, offset);
      if ((word & 0x0e000000) === 0x0a000000 && !externalOffsets.has(offset)) {
        const target = branchTarget(word, offset);
        check(target >= 0 && target < template.bodySize && target % 4 === 0,
          `${label}/${fn.name}: local branch escapes body`);
        localTargets.add(target);
        localBranches++;
      }
      if ((word & 0x0ffffff0) === 0x012fff30) functionIndirect++;
      if ((word & 0x0ffffff0) === 0x012fff10) {
        const register = word & 15;
        const condition = word >>> 28;
        if (register === 14 && condition !== 14) functionConditionalReturns++;
        else check(register === 14, `${label}/${fn.name}: unexpected indirect tail transfer`);
      }
      if ((word & 0x0c500000) === 0x04100000 && ((word >>> 16) & 15) === 15) {
        check(literalLoadOffsets.has(offset), `${label}/${fn.name}: undeclared PC-relative load at +${offset}`);
      }
    }
    check(functionIndirect === template.indirectCalls, `${label}/${fn.name}: indirect-call count mismatch`);
    check(functionConditionalReturns === template.conditionalReturns, `${label}/${fn.name}: conditional-return count mismatch`);
    indirect += functionIndirect;
    conditionalReturns += functionConditionalReturns;
    check(JSON.stringify([...localTargets].sort((a, b) => a - b)) === JSON.stringify(fn.internalLabelOffsets),
      `${label}/${fn.name}: local destinations mismatch`);
    for (const transfer of fn.directTransfers) check(decoded.get(transfer.offset) === transfer.mnemonic,
      `${label}/${fn.name}: expected ${transfer.mnemonic} at +${transfer.offset}`);
    for (const transfer of fn.localTransfers || []) {
      check(decoded.get(transfer.offset) === transfer.mnemonic &&
        branchTarget(wordAt(bytes, transfer.offset), transfer.offset) === transfer.targetOffset,
      `${label}/${fn.name}: local transfer mismatch at +${transfer.offset}`);
    }
    for (const transfer of fn.indirectCalls || []) check(decoded.get(transfer.offset) === transfer.mnemonic,
      `${label}/${fn.name}: indirect call mismatch at +${transfer.offset}`);
    for (const transfer of fn.conditionalReturns || []) check(decoded.get(transfer.offset) === transfer.mnemonic,
      `${label}/${fn.name}: conditional return mismatch at +${transfer.offset}`);
    for (const [index, literalEntry] of fn.literals.entries()) {
      const load = wordAt(bytes, literalEntry.loadOffset);
      check((load & 0x0c500000) === 0x04100000 && ((load >>> 16) & 15) === 15 &&
        ((load >>> 12) & 15) === literalDestinationRegisters[fn.template][index],
      `${label}/${fn.name}: literal-load opcode or destination mismatch`);
      const delta = load & 0xfff;
      const target = literalEntry.loadOffset + 8 + ((load & 0x00800000) ? delta : -delta);
      check(target === literalEntry.offset, `${label}/${fn.name}: literal target mismatch`);
      check(wordAt(bytes, literalEntry.offset) === 0, `${label}/${fn.name}: literal relocation has a nonzero addend`);
      slots++;
    }
    const body = normalizedBody(bytes, fn);
    const prior = normalized.get(fn.template);
    if (prior) check(prior.equals(body), `${label}/${fn.template}: normalized bodies differ`);
    else normalized.set(fn.template, body);
  }
  check(instructions === 608 && direct === 76 && indirect === 2 && conditionalReturns === 4 &&
    localBranches === 42 && slots === 30, `${label}: aggregate totals mismatch`);
  const branchSymbols = [...config.branchIdentityContract.primaryEntries, ...config.branchIdentityContract.secondaryEntries];
  for (const name of branchSymbols) {
    const symbol = symbols.get(name);
    const validUndefined = symbol?.ndx === "UND" && symbol.value === 0 && symbol.size === 0 && symbol.type === "NOTYPE";
    const validDefinition = Number.isInteger(Number(symbol?.ndx)) && symbol.type === "FUNC";
    check(symbol?.bind === "GLOBAL" && symbol.visibility === "DEFAULT" && (validUndefined || validDefinition),
      `${label}: invalid direct-transfer identity ${name}`);
  }
  for (const entry of Object.values(config.literalIdentities)) {
    const symbol = symbols.get(entry.symbol);
    const validUndefined = symbol?.ndx === "UND" && symbol.value === 0 && symbol.size === 0 && symbol.type === "NOTYPE";
    const validDefinition = Number.isInteger(Number(symbol?.ndx)) && symbol.type === "OBJECT";
    check(symbol?.bind === "GLOBAL" && symbol.visibility === "DEFAULT" && (validUndefined || validDefinition),
      `${label}: invalid literal identity ${entry.symbol}`);
  }
  validateSecondaryRelations(symbols, label, requireSecondaryDefinitions);
}

validateConfig();
const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
check(config.sourceSha256 === EXPECTED_HASH, "sourceSha256 does not match the pinned batch-75 hash");
check(sourceHash === config.sourceSha256, `source SHA-256 mismatch: config=${config.sourceSha256}, actual=${sourceHash}`);
const supplied = process.argv.slice(2);
check(supplied.length <= 1, "usage: validate-arm-duplicate-templates-75.mjs [object]");
const armBin = findArmBinDir();
const tools = Object.fromEntries(["as", "ld", "readelf", "objdump"].map((tool) => {
  const path = join(armBin, `arm-none-eabi-${tool}`);
  check(statSafe(path), `${basename(path)} is unavailable beside the assembler`);
  return [tool, path];
}));
const temporary = mkdtempSync(join(tmpdir(), "validate-arm-duplicate-templates-75-"));
try {
  const standalone = join(temporary, "standalone.o");
  run(tools.as, ["-mcpu=arm1176jzf-s", "-mfpu=vfpv2", "-o", standalone, sourcePath]);
  validateObject(standalone, tools, "standalone");

  const foreignSource = join(temporary, "foreign.S");
  const foreignObject = join(temporary, "foreign.o");
  const combined = join(temporary, "combined.o");
  writeFileSync(foreignSource, `.syntax unified
.arm
.section .text.validator_foreign,"ax",%progbits
.global validator_foreign
.type validator_foreign,%function
validator_foreign:
 bx lr
.size validator_foreign,.-validator_foreign
.section .text.validator_secondary_host,"ax",%progbits
.balign 4
.global func_00184744
.type func_00184744,%function
func_00184744:
 .space 584
.global arm_duplicate_templates_75_allocator_preentry
.type arm_duplicate_templates_75_allocator_preentry,%function
arm_duplicate_templates_75_allocator_preentry:
 nop
.global func_00184990
.type func_00184990,%function
func_00184990:
 bx lr
.size func_00184744,.-func_00184744
`);
  run(tools.as, ["-mcpu=arm1176jzf-s", "-o", foreignObject, foreignSource]);
  run(tools.ld, ["-r", "-o", combined, foreignObject, standalone]);
  validateObject(combined, tools, "combined", { allowForeign: true, expectForeign: true, requireSecondaryDefinitions: true });

  const hostileSource = join(temporary, "hostile.S");
  const hostileObject = join(temporary, "hostile.o");
  const hostileCombined = join(temporary, "hostile-combined.o");
  writeFileSync(hostileSource, ".syntax unified\n.arm\n.section .text.func_0011F1F0,\"ax\",%progbits\n.word 0\n");
  run(tools.as, ["-mcpu=arm1176jzf-s", "-o", hostileObject, hostileSource]);
  run(tools.ld, ["-r", "-o", hostileCombined, standalone, hostileObject]);
  let rejectedHostile = false;
  try { validateObject(hostileCombined, tools, "hostile", { allowForeign: true }); } catch { rejectedHostile = true; }
  check(rejectedHostile, "hostile same-section fixture was not rejected");
  if (supplied.length === 1) validateObject(resolve(supplied[0]), tools, "supplied", { allowForeign: true });
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
console.log(`arm duplicate templates 75: PASS (24 functions, 11 templates, 2432 body bytes, 608 instructions, 76 direct transfers, 42 local branches, 2 indirect calls, 4 conditional returns, 30 ABS32 slots/20 classes, sha256 ${sourceHash})`);
