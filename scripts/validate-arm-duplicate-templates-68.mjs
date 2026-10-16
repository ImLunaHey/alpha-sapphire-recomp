import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-duplicate-templates-68.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath);
const sourceText = source.toString("utf8");

function fail(message) {
  throw new Error(`arm duplicate templates 68: ${message}`);
}

function same(actual, expected, context) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${context}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function expectedSectionSize(fn) {
  const template = config.templates[fn.template];
  if (fn.templateMaterialEndOffset !== undefined) return fn.templateMaterialEndOffset + 1;
  return template.bodySize;
}

function expectedRelocations(fn) {
  return [
    ...fn.directTransfers.map(({ offset, kind, symbol }) => ({ offset, kind, symbol })),
    ...fn.literals.map(({ offset, identity }) => ({
      offset,
      kind: "R_ARM_ABS32",
      symbol: config.literalIdentities[identity].symbol,
    })),
  ].sort((left, right) => left.offset - right.offset);
}

function validateConfigAndSource() {
  same(config.version, 1, "config version");
  same(config.source, "src/main/arm_duplicate_templates_68.S", "source path");
  same(config.mode, "arm", "instruction mode");
  same(createHash("sha256").update(source).digest("hex"), config.sourceSha256, "source SHA-256");
  same(config.expectedBodyBytes, 764, "total body bytes");
  same(config.functions.map(({ name }) => name), [
    "func_00498858", "func_004997B8",
    "func_004C8A2C", "func_004C8A84", "func_004C8ADC",
    "func_0053BDE0", "func_0053D934",
  ], "function order");
  same(config.functions.reduce((sum, fn) => sum + config.templates[fn.template].bodySize, 0),
    config.expectedBodyBytes, "body-byte total");

  same(config.templates, {
    reset_ten_slot_owner: { bodySize: 144, instructionCount: 36, count: 2, internalLabels: 3, directTransfers: 1, indirectCalls: 0, poolSlots: 2 },
    find_linked_object_by_identity: { bodySize: 84, instructionCount: 21, count: 3, internalLabels: 3, directTransfers: 1, indirectCalls: 1, poolSlots: 1 },
    route_or_initialize_owner: { bodySize: 112, instructionCount: 28, count: 2, internalLabels: 3, directTransfers: 7, indirectCalls: 0, poolSlots: 0 },
  }, "template metadata");

  const identityEntries = Object.entries(config.literalIdentities);
  same(identityEntries.map(([, value]) => value.symbol), [
    "arm_duplicate_templates_68_reset_derived_00498858_identity",
    "arm_duplicate_templates_68_reset_derived_004997B8_identity",
    "arm_duplicate_templates_68_reset_shared_base_identity",
    "arm_duplicate_templates_68_find_004C8A2C_identity",
    "arm_duplicate_templates_68_find_004C8A84_identity",
    "arm_duplicate_templates_68_find_004C8ADC_identity",
  ], "identity symbols");
  same(new Set(identityEntries.map(([, value]) => value.symbol)).size, identityEntries.length,
    "identity symbol distinctness");

  const invocations = [...sourceText.matchAll(/^DT68_(RESET|FIND|ROUTE)\s+([^\n]+)$/gm)]
    .map((match) => [match[1], ...match[2].split(/,\s*/)]);
  same(invocations, [
    ["RESET", "func_00498858", "arm_duplicate_templates_68_reset_derived_00498858_identity", "arm_duplicate_templates_68_reset_shared_base_identity"],
    ["RESET", "func_004997B8", "arm_duplicate_templates_68_reset_derived_004997B8_identity", "arm_duplicate_templates_68_reset_shared_base_identity"],
    ["FIND", "func_004C8A2C", "arm_duplicate_templates_68_find_004C8A2C_identity"],
    ["FIND", "func_004C8A84", "arm_duplicate_templates_68_find_004C8A84_identity"],
    ["FIND", "func_004C8ADC", "arm_duplicate_templates_68_find_004C8ADC_identity"],
    ["ROUTE", "func_0053BDE0"],
    ["ROUTE", "func_0053D934"],
  ], "macro instantiations and identity sharing");

  if (!/^\.syntax unified$/m.test(sourceText) || !/^\.arch armv6k$/m.test(sourceText)
      || !/^\.fpu vfpv2$/m.test(sourceText) || !/^\.arm$/m.test(sourceText)) {
    fail("source is missing the required ARMv6K/VFPv2 unified-syntax directives");
  }
  if (/^\s*\.(?:byte|short|hword|long|quad|incbin|ltorg|pool)\b/m.test(sourceText)
      || /\bldr(?:\w*)\s+[^\n,]+,\s*=/i.test(sourceText)) {
    fail("source contains unapproved literal data or a literal-pool pseudo-instruction");
  }
  const words = [...sourceText.matchAll(/^\s*\.word\s+(\S+)\s*$/gm)].map((match) => match[1]);
  same(words, ["\\derived_identity", "\\base_identity", "\\type_identity"], "symbolic pool declarations");
  for (const label of ["reset_derived", "reset_base", "reset_release_loop", "reset_clear", "reset_pair_loop", "find_identity", "find_compare", "find_found", "find_return", "route_missing", "route_secondary", "route_finish"]) {
    if (!sourceText.includes(`.Ldt68_${label}\\@`)) fail(`macro-local label ${label} is not expansion-unique`);
  }

  const identityUses = new Map(identityEntries.map(([key]) => [key, 0]));
  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    if (!template) fail(`${fn.name} names an unknown template`);
    same(fn.internalLabelOffsets.length, template.internalLabels, `${fn.name} local-label count`);
    same(fn.directTransfers.length, template.directTransfers, `${fn.name} direct-transfer count`);
    same(fn.literals.length, template.poolSlots, `${fn.name} pool-slot count`);
    same(fn.literals.map(({ offset }) => offset),
      Array.from({ length: template.poolSlots }, (_, index) => template.bodySize + index * 4),
      `${fn.name} pool layout`);
    if (fn.templateMaterialEndOffset !== undefined) {
      same(fn.nextGlobalOffset, fn.templateMaterialEndOffset + 1, `${fn.name} next-global boundary`);
    } else {
      same(fn.anonymousMaterialOffset, template.bodySize, `${fn.name} anonymous-material boundary`);
      if (!(fn.nextGlobalOffset > fn.anonymousMaterialOffset)) fail(`${fn.name} next global does not follow anonymous material`);
    }
    for (const transfer of fn.directTransfers) {
      if (!/^R_ARM_(?:CALL|JUMP24)$/.test(transfer.kind) || !/^func_[0-9A-F]{8}$/.test(transfer.symbol)) {
        fail(`${fn.name} has a malformed direct transfer`);
      }
      if (transfer.offset % 4 || transfer.offset < 0 || transfer.offset + 4 > template.bodySize) {
        fail(`${fn.name} has an out-of-body direct transfer`);
      }
    }
    for (const literal of fn.literals) {
      if (!config.literalIdentities[literal.identity]) fail(`${fn.name} names an unknown identity`);
      identityUses.set(literal.identity, identityUses.get(literal.identity) + 1);
      if (literal.loadOffset % 4 || literal.loadOffset < 0 || literal.loadOffset + 4 > template.bodySize) {
        fail(`${fn.name} has an out-of-body literal load`);
      }
    }
  }
  same(Object.fromEntries(identityUses), {
    reset_derived_00498858: 1,
    reset_derived_004997B8: 1,
    reset_shared_base: 2,
    find_004C8A2C: 1,
    find_004C8A84: 1,
    find_004C8ADC: 1,
  }, "identity reference counts");
}

function runReadelf(readelf, args, objectPath) {
  try {
    return execFileSync(readelf, [...args, objectPath], {
      encoding: "utf8", maxBuffer: MAX_BUFFER, stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    fail(`readelf ${args.join(" ")} failed: ${error.stderr?.toString().trim() || error.message}`);
  }
}

function parseSections(text) {
  const sections = new Map();
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+/);
    if (match) sections.set(match[2], { index: Number(match[1]), type: match[3], size: Number.parseInt(match[4], 16) });
  }
  return sections;
}

function parseSymbols(text) {
  const symbols = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/);
    if (match) symbols.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4], visibility: match[5], ndx: match[6], name: match[7] });
  }
  return symbols;
}

function parseRelocations(text) {
  const bySection = new Map();
  let targetSection = null;
  for (const line of text.split("\n")) {
    const heading = line.match(/^Relocation section '\.rela?([^']+)'/);
    if (heading) {
      targetSection = heading[1];
      if (!bySection.has(targetSection)) bySection.set(targetSection, []);
      continue;
    }
    if (!targetSection || !/^\s*[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+R_ARM_/.test(line)) continue;
    const fields = line.trim().split(/\s+/);
    bySection.get(targetSection).push({ offset: Number.parseInt(fields[0], 16), kind: fields[2], symbol: fields[4] });
  }
  return bySection;
}

function readSectionBytes(readelf, objectPath, sectionName) {
  const dump = runReadelf(readelf, ["-x", sectionName], objectPath);
  let hex = "";
  for (const line of dump.split("\n")) {
    const match = line.match(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}(?:\s+|$)){1,4})/);
    if (match) hex += match[1].replace(/\s/g, "");
  }
  if (!hex) fail(`could not read bytes for ${sectionName}`);
  return Buffer.from(hex, "hex");
}

function localBranchDestinations(bytes, directOffsets) {
  const destinations = new Set();
  for (let offset = 0; offset < bytes.length; offset += 4) {
    if (directOffsets.has(offset)) continue;
    const word = bytes.readUInt32LE(offset);
    if ((word & 0x0f000000) !== 0x0a000000) continue;
    let immediate = word & 0x00ffffff;
    if (immediate & 0x00800000) immediate -= 0x01000000;
    destinations.add(offset + 8 + immediate * 4);
  }
  return [...destinations].sort((left, right) => left - right);
}

function literalLoadTarget(bytes, offset) {
  const word = bytes.readUInt32LE(offset);
  if ((word & 0x0e5f0000) !== 0x041f0000 || (word & 0x00100000) === 0) {
    fail(`instruction at +${offset} is not an immediate ARM PC-relative LDR`);
  }
  const displacement = word & 0xfff;
  return offset + 8 + ((word & 0x00800000) ? displacement : -displacement);
}

function countRegisterBlx(bytes) {
  let count = 0;
  for (let offset = 0; offset < bytes.length; offset += 4) {
    if ((bytes.readUInt32LE(offset) & 0x0ffffff0) === 0x012fff30) count += 1;
  }
  return count;
}

function normalizedBody(bytes, transfers) {
  const normalized = Buffer.from(bytes);
  for (const { offset } of transfers) {
    const word = normalized.readUInt32LE(offset);
    normalized.writeUInt32LE((word & 0xff000000) >>> 0, offset);
  }
  return normalized;
}

function validateObject(objectPath, readelf) {
  const header = runReadelf(readelf, ["-hW"], objectPath);
  if (!/Class:\s+ELF32\b/.test(header) || !/Data:\s+2's complement, little endian\b/.test(header)
      || !/Type:\s+REL\b/.test(header) || !/Machine:\s+ARM\b/.test(header)) {
    fail("object is not a little-endian ELF32 ARM relocatable file");
  }
  const sections = parseSections(runReadelf(readelf, ["-SW"], objectPath));
  const symbols = parseSymbols(runReadelf(readelf, ["-sW"], objectPath));
  const relocations = parseRelocations(runReadelf(readelf, ["-rW"], objectPath));
  const bodies = new Map();

  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const template = config.templates[fn.template];
    const section = sections.get(sectionName);
    if (!section) fail(`${fn.name} section is missing`);
    same(section.type, "PROGBITS", `${fn.name} section type`);
    same(section.size, expectedSectionSize(fn), `${fn.name} exact owned section size`);
    const symbol = symbols.find(({ name }) => name === fn.name);
    if (!symbol) fail(`${fn.name} symbol is missing`);
    same({ value: symbol.value, size: symbol.size, type: symbol.type, bind: symbol.bind, visibility: symbol.visibility, ndx: symbol.ndx },
      { value: 0, size: template.bodySize, type: "FUNC", bind: "GLOBAL", visibility: "DEFAULT", ndx: String(section.index) },
      `${fn.name} symbol boundary and attributes`);
    same(symbols.filter(({ bind, ndx, name }) => bind === "GLOBAL" && ndx === String(section.index) && name !== fn.name)
      .map(({ name }) => name), [], `${fn.name} unexpected globals`);

    const sectionBytes = readSectionBytes(readelf, objectPath, sectionName);
    same(sectionBytes.length, expectedSectionSize(fn), `${fn.name} dumped section size`);
    const body = sectionBytes.subarray(0, template.bodySize);
    same(body.length / 4, template.instructionCount, `${fn.name} instruction count`);
    const directOffsets = new Set(fn.directTransfers.map(({ offset }) => offset));
    same(localBranchDestinations(body, directOffsets), fn.internalLabelOffsets, `${fn.name} local branch destinations`);
    same(countRegisterBlx(body), template.indirectCalls, `${fn.name} indirect linked transfers`);
    same(relocations.get(sectionName) ?? [], expectedRelocations(fn), `${fn.name} ordered relocations`);

    for (const transfer of fn.directTransfers) {
      const word = body.readUInt32LE(transfer.offset);
      const opcode = word & 0x0f000000;
      const expectedOpcode = transfer.kind === "R_ARM_CALL" ? 0x0b000000 : 0x0a000000;
      same(opcode, expectedOpcode, `${fn.name}+${transfer.offset} transfer opcode`);
    }
    for (const literal of fn.literals) {
      same(literalLoadTarget(body, literal.loadOffset), literal.offset, `${fn.name}+${literal.loadOffset} literal target`);
      same(sectionBytes.readUInt32LE(literal.offset), 0, `${fn.name}+${literal.offset} unresolved pool word`);
    }
    bodies.set(fn.name, normalizedBody(body, fn.directTransfers));
  }

  for (const names of [
    ["func_00498858", "func_004997B8"],
    ["func_004C8A2C", "func_004C8A84", "func_004C8ADC"],
    ["func_0053BDE0", "func_0053D934"],
  ]) {
    for (const name of names.slice(1)) {
      if (!bodies.get(names[0]).equals(bodies.get(name))) fail(`${names[0]}/${name} normalized bodies differ`);
    }
  }

  const identitySymbols = new Set(Object.values(config.literalIdentities).map(({ symbol }) => symbol));
  for (const identity of identitySymbols) {
    const symbol = symbols.find(({ name }) => name === identity);
    if (!symbol) fail(`identity symbol ${identity} is missing`);
    same([symbol.bind, symbol.ndx], ["GLOBAL", "UND"], `${identity} remains unresolved`);
  }
  const ownedSections = new Set(config.functions.map(({ name }) => `.text.${name}`));
  for (const [sectionName, records] of relocations) {
    if (!ownedSections.has(sectionName) && records.some(({ symbol }) => identitySymbols.has(symbol))) {
      fail(`unexpected identity relocation from ${sectionName}`);
    }
  }
}

validateConfigAndSource();
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("arm duplicate templates 68: source/config checks passed (7 functions, 764 body bytes, 7 symbolic pool slots)");
} else if (args.length === 2) {
  validateObject(resolve(args[0]), args[1]);
  console.log("arm duplicate templates 68: source/config and object checks passed (7 functions, 764 body bytes, 19 direct transfers, 7 symbolic pool slots, 3 normalized groups)");
} else {
  fail("usage: node scripts/validate-arm-duplicate-templates-68.mjs [object-file readelf]");
}
