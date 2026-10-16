import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-duplicate-templates-67.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath);
const sourceText = source.toString("utf8");

function fail(message) {
  throw new Error(`arm duplicate templates 67: ${message}`);
}

function same(actual, expected, context) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${context}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function validateConfigAndSource() {
  same(config.version, 1, "config version");
  same(config.source, "src/main/arm_duplicate_templates_67.S", "source path");
  same(config.mode, "arm", "instruction mode");

  const digest = createHash("sha256").update(source).digest("hex");
  same(digest, config.sourceSha256, "source SHA-256");

  const expectedNames = [
    "func_0056E4F0",
    "func_0056E6A8",
    "func_0056B390",
    "func_0056B550",
  ];
  same(config.functions.map(({ name }) => name), expectedNames, "function order");
  same(config.expectedBodyBytes, 736, "total body bytes");
  same(
    config.functions.reduce((sum, fn) => sum + fn.nextGlobalOffset, 0),
    config.expectedBodyBytes,
    "function boundary total",
  );

  const clear = config.templates.clear_intrusive_owner;
  const release = config.templates.release_or_grow_pointer_storage;
  same(clear, {
    bodySize: 212,
    instructionCount: 53,
    count: 2,
    internalLabels: 6,
    directCalls: 2,
    indirectCalls: 1,
    ownedLiteralCount: 0,
  }, "clear template metadata");
  same(release, {
    bodySize: 156,
    instructionCount: 39,
    count: 2,
    internalLabels: 4,
    directCalls: 2,
    indirectCalls: 1,
    ownedLiteralCount: 0,
  }, "release template metadata");

  const sourceInvocations = [...sourceText.matchAll(
    /^DT67_(CLEAR|RELEASE)\s+([^\s,]+)(?:,\s*([^\s]+))?\s*$/gm,
  )].map((match) => match.slice(1));
  same(sourceInvocations, [
    ["CLEAR", "func_0056E4F0", undefined],
    ["CLEAR", "func_0056E6A8", undefined],
    ["RELEASE", "func_0056B390", "func_0056B42C"],
    ["RELEASE", "func_0056B550", "func_0056B5EC"],
  ], "macro instantiations");

  if (!/^\.syntax unified$/m.test(sourceText)
      || !/^\.arch armv6k$/m.test(sourceText)
      || !/^\.fpu vfpv2$/m.test(sourceText)
      || !/^\.arm$/m.test(sourceText)) {
    fail("source is missing the required ARMv6K/VFPv2 unified-syntax directives");
  }
  if (/^\s*\.(?:byte|short|hword|word|long|quad|incbin|ltorg|pool)\b/m.test(sourceText)
      || /\bldr(?:\w*)\s+[^\n,]+,\s*=/i.test(sourceText)) {
    fail("source contains literal data or a literal-pool pseudo-instruction");
  }

  for (const fn of config.functions) {
    const template = config.templates[fn.template];
    if (!template) fail(`${fn.name} names an unknown template`);
    same(fn.nextGlobalOffset, template.bodySize, `${fn.name} boundary`);
    same(fn.internalLabelOffsets.length, template.internalLabels, `${fn.name} label count`);
    same(fn.directTransfers.length, template.directCalls, `${fn.name} direct-call count`);
    for (const transfer of fn.directTransfers) {
      if (transfer.kind !== "R_ARM_CALL" || !/^func_[0-9A-F]{8}$/.test(transfer.symbol)) {
        fail(`${fn.name} has a non-symbolic or non-call direct transfer`);
      }
      if (transfer.offset < 0 || transfer.offset + 4 > template.bodySize || transfer.offset % 4) {
        fail(`${fn.name} has an out-of-bounds direct transfer`);
      }
    }
  }
}

function runReadelf(readelf, args, objectPath) {
  try {
    return execFileSync(readelf, [...args, objectPath], {
      encoding: "utf8",
      maxBuffer: MAX_BUFFER,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    fail(`readelf ${args.join(" ")} failed: ${detail}`);
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
    if (match) {
      symbols.push({
        value: Number.parseInt(match[1], 16),
        size: Number(match[2]),
        type: match[3],
        bind: match[4],
        visibility: match[5],
        ndx: match[6],
        name: match[7],
      });
    }
  }
  return symbols;
}

function parseRelocations(text) {
  const bySection = new Map();
  let targetSection = null;
  for (const line of text.split("\n")) {
    const heading = line.match(/^Relocation section '(\.rela?)([^']+)'/);
    if (heading) {
      targetSection = heading[2];
      if (!bySection.has(targetSection)) bySection.set(targetSection, []);
      continue;
    }
    if (!targetSection || !/^\s*[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+R_ARM_/.test(line)) continue;
    const fields = line.trim().split(/\s+/);
    bySection.get(targetSection).push({
      offset: Number.parseInt(fields[0], 16),
      kind: fields[2],
      symbol: fields[4],
    });
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

function localBranchDestinations(bytes) {
  const destinations = new Set();
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const word = bytes.readUInt32LE(offset);
    const isBranchImmediate = (word & 0x0e000000) === 0x0a000000;
    const links = (word & 0x01000000) !== 0;
    if (!isBranchImmediate || links) continue;
    let immediate = word & 0x00ffffff;
    if (immediate & 0x00800000) immediate -= 0x01000000;
    destinations.add(offset + 8 + immediate * 4);
  }
  return [...destinations].sort((a, b) => a - b);
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
  if (!/Class:\s+ELF32\b/.test(header)
      || !/Data:\s+2's complement, little endian\b/.test(header)
      || !/Type:\s+REL\b/.test(header)
      || !/Machine:\s+ARM\b/.test(header)) {
    fail("object is not a little-endian ELF32 ARM relocatable file");
  }

  const sections = parseSections(runReadelf(readelf, ["-SW"], objectPath));
  const symbols = parseSymbols(runReadelf(readelf, ["-sW"], objectPath));
  const relocations = parseRelocations(runReadelf(readelf, ["-rW"], objectPath));
  const bodies = new Map();

  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    if (!section) fail(`${fn.name} section is missing`);
    const template = config.templates[fn.template];
    same(section.type, "PROGBITS", `${fn.name} section type`);
    same(section.size, template.bodySize, `${fn.name} section size`);

    const symbol = symbols.find(({ name }) => name === fn.name);
    if (!symbol) fail(`${fn.name} symbol is missing`);
    same(symbol.value, 0, `${fn.name} symbol start`);
    same(symbol.size, template.bodySize, `${fn.name} symbol size`);
    same([symbol.type, symbol.bind, symbol.visibility], ["FUNC", "GLOBAL", "DEFAULT"], `${fn.name} symbol attributes`);
    same(symbol.ndx, String(section.index), `${fn.name} symbol section`);
    const otherGlobals = symbols.filter(({ bind, ndx, name }) => bind === "GLOBAL" && ndx === String(section.index) && name !== fn.name);
    same(otherGlobals.map(({ name }) => name), [], `${fn.name} trailing globals`);

    const bytes = readSectionBytes(readelf, objectPath, sectionName);
    same(bytes.length, template.bodySize, `${fn.name} dumped body size`);
    same(bytes.length / 4, template.instructionCount, `${fn.name} instruction slots`);
    same(localBranchDestinations(bytes), fn.internalLabelOffsets, `${fn.name} local branch destinations`);
    same(countRegisterBlx(bytes), template.indirectCalls, `${fn.name} indirect linked transfers`);

    const actualRelocations = relocations.get(sectionName) ?? [];
    same(actualRelocations, fn.directTransfers.map(({ offset, kind, symbol: target }) => ({ offset, kind, symbol: target })), `${fn.name} relocations`);
    for (const transfer of actualRelocations) {
      const word = bytes.readUInt32LE(transfer.offset);
      if ((word & 0x0f000000) !== 0x0b000000) fail(`${fn.name}+${transfer.offset} is not an ARM BL instruction`);
    }
    bodies.set(fn.name, normalizedBody(bytes, fn.directTransfers));
  }

  const pairs = [
    ["func_0056E4F0", "func_0056E6A8"],
    ["func_0056B390", "func_0056B550"],
  ];
  for (const [left, right] of pairs) {
    if (!bodies.get(left).equals(bodies.get(right))) fail(`${left}/${right} normalized bodies differ`);
  }

  const ownedSections = new Set(config.functions.map(({ name }) => `.text.${name}`));
  for (const [sectionName, records] of relocations) {
    if (ownedSections.has(sectionName)) continue;
    if (records.some(({ symbol }) => config.functions.some(({ name }) => name === symbol))) {
      fail(`unexpected relocation into the batch from ${sectionName}`);
    }
  }
}

validateConfigAndSource();

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("arm duplicate templates 67: source/config checks passed (4 functions, 736 bytes, 2 normalized pairs)");
} else if (args.length === 2) {
  validateObject(resolve(args[0]), args[1]);
  console.log("arm duplicate templates 67: source/config and object checks passed (4 functions, 736 bytes, 8 symbolic calls, 0 literals)");
} else {
  fail("usage: node scripts/validate-arm-duplicate-templates-67.mjs [objectPath readelf]");
}
