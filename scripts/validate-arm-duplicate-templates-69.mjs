#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-duplicate-templates-69.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = join(root, config.source);

function fail(message) {
  throw new Error(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function run(file, args, options = {}) {
  return execFileSync(file, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: MAX_BUFFER,
    ...options,
  });
}

function findOnPath(name) {
  try {
    return run("sh", ["-c", 'command -v "$1"', "sh", name]).trim();
  } catch {
    return "";
  }
}

function findArmBinDir() {
  const assembler = process.env.ARM_NONE_EABI_AS || findOnPath("arm-none-eabi-as");
  if (assembler) return dirname(assembler);
  if (!statSafe("/nix/store")) fail("arm-none-eabi-as is not available on PATH");
  const matches = run("find", ["/nix/store", "-type", "f", "-path", "*/bin/arm-none-eabi-as"])
    .trim().split("\n").filter(Boolean);
  const preferred = matches.find((path) => path.includes("gcc-arm-embedded-15.2"));
  const selected = preferred || matches[0];
  if (!selected) fail("arm-none-eabi-as was not found");
  return dirname(selected);
}

function statSafe(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

function parseSections(output) {
  const sections = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+/);
    if (match) sections.set(match[2], { index: Number(match[1]), type: match[3], size: parseInt(match[4], 16) });
  }
  return sections;
}

function parseSymbols(output) {
  const symbols = new Map();
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(\S+)\s*$/);
    if (match) symbols.set(match[6], {
      value: parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], ndx: match[5],
    });
  }
  return symbols;
}

function parseRelocations(output) {
  const bySection = new Map();
  let current = null;
  for (const line of output.split("\n")) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?(\.text\.[^']+)'/);
    if (heading) {
      current = heading[1];
      bySection.set(current, []);
      continue;
    }
    if (line.startsWith("Relocation section ")) current = null;
    if (!current) continue;
    const match = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (match) bySection.get(current).push({ offset: parseInt(match[1], 16), kind: match[2], symbol: match[3] });
  }
  return bySection;
}

function sectionBytes(objdump, object, section) {
  const output = run(objdump, ["-s", "-j", section, object]);
  const bytes = [];
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}(?:\s+|$)){1,4})/);
    if (!match) continue;
    for (const group of match[1].trim().split(/\s+/)) {
      for (let i = 0; i < group.length; i += 2) bytes.push(parseInt(group.slice(i, i + 2), 16));
    }
  }
  return Buffer.from(bytes);
}

function parseDisassembly(objdump, object, sectionNames) {
  const args = ["-dr"];
  for (const sectionName of sectionNames) args.push("-j", sectionName);
  args.push(object);
  const output = run(objdump, args);
  const result = new Map();
  let section = null;
  for (const line of output.split("\n")) {
    const heading = line.match(/^Disassembly of section (\.text\.[^:]+):/);
    if (heading) {
      section = heading[1];
      result.set(section, new Map());
      continue;
    }
    if (!section) continue;
    const instruction = line.match(/^\s*([0-9a-fA-F]+):\s+[0-9a-fA-F]{8}\s+(\S+)/);
    if (instruction) result.get(section).set(parseInt(instruction[1], 16), instruction[2]);
  }
  return result;
}

function wordAt(bytes, offset) {
  check(offset >= 0 && offset + 4 <= bytes.length, `word offset ${offset} is out of range`);
  return bytes.readUInt32LE(offset);
}

function signExtend24(value) {
  return (value & 0x800000) ? value - 0x1000000 : value;
}

function branchTarget(word, offset) {
  return offset + 8 + signExtend24(word & 0xffffff) * 4;
}

function normalize(bytes, fn) {
  const normalized = Buffer.from(bytes.subarray(0, config.templates[fn.template].bodySize));
  for (const transfer of fn.directTransfers) normalized.fill(0, transfer.offset, transfer.offset + 4);
  for (const literal of fn.literals) normalized.fill(0, literal.loadOffset, literal.loadOffset + 4);
  return normalized;
}

function validateConfig() {
  check(config.version === 1, "config version must be 1");
  check(config.mode === "arm", "config mode must be ARM");
  check(config.functions.length === 10, "expected exactly 10 functions");
  check(Object.keys(config.templates).length === 5, "expected exactly 5 templates");
  const counts = new Map();
  let bodyBytes = 0;
  let directTransfers = 0;
  let poolSlots = 0;
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    check(template, `${fn.name}: unknown template ${fn.template}`);
    counts.set(fn.template, (counts.get(fn.template) || 0) + 1);
    bodyBytes += template.bodySize;
    directTransfers += fn.directTransfers.length;
    poolSlots += fn.literals.length;
    check(fn.directTransfers.length === template.directTransfers, `${fn.name}: direct-transfer count mismatch`);
    check(fn.literals.length === template.poolSlots, `${fn.name}: pool-slot count mismatch`);
    check(fn.internalLabelOffsets.length === template.internalLabels, `${fn.name}: internal-label count mismatch`);
    check(template.instructionCount * 4 === template.bodySize, `${fn.template}: ARM instruction count/body size mismatch`);
  }
  for (const [name, template] of Object.entries(config.templates)) {
    check(counts.get(name) === template.count && template.count === 2, `${name}: duplicate count mismatch`);
  }
  check(bodyBytes === config.expectedBodyBytes && bodyBytes === 1304, "expected exactly 1304 body bytes");
  check(directTransfers === 28, "expected exactly 28 direct transfers");
  check(poolSlots === 6, "expected exactly 6 literal pool slots");
  const identities = Object.values(config.literalIdentities);
  check(identities.length === 3, "expected exactly 3 literal identity classes");
  check(new Set(identities.map((entry) => entry.symbol)).size === 3, "literal identity symbols must be pairwise distinct");
  check(new Set(identities.map((entry) => entry.class)).size === 3, "literal identity classes must be pairwise distinct");
  const branchContract = config.branchIdentityContract;
  const identitiesUsed = [
    ...branchContract.primaryEntries,
    ...branchContract.secondaryEntries,
    ...branchContract.relationalEntries.map((entry) => `${entry.symbol}${entry.addend}`),
  ];
  check(branchContract.classesPairwiseDistinct && new Set(identitiesUsed).size === identitiesUsed.length,
    "branch identities must be pairwise distinct");
  const conditional = config.functions.flatMap((fn) => fn.directTransfers)
    .filter((transfer) => transfer.mnemonic === "blls");
  check(conditional.length === 2 && conditional.every((transfer) => transfer.kind === "R_ARM_JUMP24"),
    "both conditional blls transfers must use R_ARM_JUMP24");
}

function validateObject(object, tools, label, allowForeign = false, expectFixture = false) {
  const ownedSections = new Set(config.functions.map((fn) => `.text.${fn.name}`));
  const sectionOutput = run(tools.readelf, ["-W", "-S", object]);
  const symbolOutput = run(tools.readelf, ["-W", "-s", object]);
  const relocationOutput = run(tools.readelf, ["-W", "-r", object]);
  const sections = parseSections(sectionOutput);
  const symbols = parseSymbols(symbolOutput);
  const relocations = parseRelocations(relocationOutput);
  const disassembly = parseDisassembly(tools.objdump, object, ownedSections);
  if (!allowForeign) {
    const nonemptyText = [...sections].filter(([name, section]) => name.startsWith(".text") && section.size !== 0).map(([name]) => name);
    check(nonemptyText.length === ownedSections.size && nonemptyText.every((name) => ownedSections.has(name)),
      `${label}: unexpected nonempty text section`);
  } else if (expectFixture) {
    check(sections.get(".text.validator_foreign")?.size === 4, `${label}: foreign section was not preserved`);
  }

  let directCount = 0;
  let absCount = 0;
  const normalizedByTemplate = new Map();
  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const template = config.templates[fn.template];
    const expectedSectionSize = template.bodySize + fn.literals.length * 4;
    const section = sections.get(sectionName);
    check(section?.type === "PROGBITS" && section.size === expectedSectionSize,
      `${label}/${fn.name}: owned section size/type mismatch`);
    const symbol = symbols.get(fn.name);
    check(symbol?.type === "FUNC" && symbol.bind === "GLOBAL" && symbol.value === 0 && symbol.size === template.bodySize,
      `${label}/${fn.name}: function symbol contract mismatch`);
    check(Number(symbol.ndx) === section.index, `${label}/${fn.name}: symbol is not in its owned section`);

    const bytes = sectionBytes(tools.objdump, object, sectionName);
    check(bytes.length === expectedSectionSize, `${label}/${fn.name}: failed to read all section bytes`);
    const instructions = disassembly.get(sectionName);
    check(instructions, `${label}/${fn.name}: section disassembly missing`);
    check([...instructions.keys()].filter((offset) => offset < template.bodySize).length === template.instructionCount,
      `${label}/${fn.name}: instruction count mismatch`);

    const expectedRelocations = [
      ...fn.directTransfers.map((entry) => ({ offset: entry.offset, kind: entry.kind, symbol: entry.symbol })),
      ...fn.literals.map((entry) => ({
        offset: entry.offset, kind: "R_ARM_ABS32", symbol: config.literalIdentities[entry.identity].symbol,
      })),
    ].sort((a, b) => a.offset - b.offset);
    const actualRelocations = (relocations.get(sectionName) || []).sort((a, b) => a.offset - b.offset);
    check(JSON.stringify(actualRelocations) === JSON.stringify(expectedRelocations),
      `${label}/${fn.name}: relocation table mismatch`);
    directCount += fn.directTransfers.length;
    absCount += fn.literals.length;

    const externalOffsets = new Set(fn.directTransfers.map((entry) => entry.offset));
    const localTargets = new Set();
    for (let offset = 0; offset < template.bodySize; offset += 4) {
      const word = wordAt(bytes, offset);
      if ((word & 0x0e000000) === 0x0a000000 && !externalOffsets.has(offset)) {
        const target = branchTarget(word, offset);
        check(target >= 0 && target < template.bodySize && target % 4 === 0,
          `${label}/${fn.name}: branch at +${offset} escapes its function without relocation`);
        localTargets.add(target);
      }
      check((word & 0x0ffffff0) !== 0x012fff30, `${label}/${fn.name}: unexpected indirect call`);
    }
    check(JSON.stringify([...localTargets].sort((a, b) => a - b)) === JSON.stringify(fn.internalLabelOffsets),
      `${label}/${fn.name}: local branch destinations mismatch`);

    for (const transfer of fn.directTransfers) {
      check(instructions.get(transfer.offset) === transfer.mnemonic,
        `${label}/${fn.name}: expected ${transfer.mnemonic} at +${transfer.offset}`);
      if (Object.hasOwn(transfer, "addend")) {
        const encodedAddend = 8 + signExtend24(wordAt(bytes, transfer.offset) & 0xffffff) * 4;
        check(encodedAddend === transfer.addend,
          `${label}/${fn.name}: relational branch addend mismatch`);
      }
    }
    for (const literal of fn.literals) {
      const load = wordAt(bytes, literal.loadOffset);
      check((load & 0x0c500000) === 0x04100000 && ((load >>> 16) & 15) === 15,
        `${label}/${fn.name}: literal load is not an ARM PC-relative LDR`);
      const delta = load & 0xfff;
      const target = literal.loadOffset + 8 + ((load & 0x00800000) ? delta : -delta);
      check(target === literal.offset, `${label}/${fn.name}: PC-relative literal target mismatch`);
    }

    const normalized = normalize(bytes, fn);
    const prior = normalizedByTemplate.get(fn.template);
    if (prior) check(prior.equals(normalized), `${label}/${fn.template}: normalized duplicates differ`);
    else normalizedByTemplate.set(fn.template, normalized);
  }
  check(directCount === 28 && absCount === 6, `${label}: relocation totals mismatch`);
}

validateConfig();
const source = readFileSync(sourcePath);
const sourceHash = createHash("sha256").update(source).digest("hex");
check(config.sourceSha256 !== "PENDING_IMPLEMENTATION", "sourceSha256 is not pinned");
check(config.sourceSha256 === "1dc21320edd37f3ebe49aed20b1b3887085442373f502c5d041997b36474e32c",
  "sourceSha256 does not match the pinned batch-69 hash");
check(sourceHash === config.sourceSha256, `source SHA-256 mismatch: config=${config.sourceSha256}, actual=${sourceHash}`);

const supplied = process.argv.slice(2);
check(supplied.length <= 1, "usage: validate-arm-duplicate-templates-69.mjs [object]");

const armBin = findArmBinDir();
const tools = Object.fromEntries(["as", "ld", "readelf", "objdump"].map((tool) => {
  const path = join(armBin, `arm-none-eabi-${tool}`);
  check(statSafe(path), `${basename(path)} is unavailable beside the assembler`);
  return [tool, path];
}));
const temporary = mkdtempSync(join(tmpdir(), "validate-arm-duplicate-templates-69-"));
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

console.log(`arm duplicate templates 69: PASS (10 functions, 5 duplicate schedules, 1304 body bytes, 28 direct transfers, 6 ABS32 slots, sha256 ${sourceHash})`);
