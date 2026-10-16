#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-duplicate-templates-66.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath, "utf8");
const maxBuffer = 16 * 1024 * 1024;

function fail(message) {
  throw new Error(`arm duplicate templates 66: ${message}`);
}

function same(actual, expected, description) {
  if (actual !== expected) fail(`${description}: expected ${expected}, got ${actual}`);
}

function occurrences(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

if (process.argv.length > 4) {
  fail("usage: validate-arm-duplicate-templates-66.mjs [objectPath [readelf]]");
}

same(config.version, 1, "manifest version");
same(config.mode, "arm", "instruction mode");
same(config.expectedBodyBytes, 944, "total body bytes");
same(config.functions?.length, 4, "function count");
same(createHash("sha256").update(source).digest("hex"), config.sourceSha256, "source SHA-256");

const expectedNames = ["func_0049B080", "func_004A1E14", "func_0056E77C", "func_0056E944"];
same(config.functions.map(({ name }) => name).join(","), expectedNames.join(","), "ordered function names");
same(occurrences(source, /^DT66_RECORD func_/gm), 2, "record macro expansions");
same(occurrences(source, /^DT66_APPEND func_/gm), 2, "append macro expansions");
same(occurrences(source, /^\s+bl\s+/gm), 4, "symbolic call sites in template source");
same(occurrences(source, /^\.size \\name, \.-\\name$/gm), 2, "template size directives");
for (const [macro, templateName] of [["DT66_RECORD", "allocate_and_populate_record"], ["DT66_APPEND", "append_intrusive_record"]]) {
  const body = source.match(new RegExp(`^\\.macro ${macro}[^\\n]*\\n([\\s\\S]*?)^\\.endm$`, "m"))?.[1];
  if (!body) fail(`missing ${macro} definition`);
  same(occurrences(body, /^    [a-z][a-z0-9.]*\s+/gm), config.templates[templateName].instructionCount, `${macro} instruction count`);
}
if (/^\s*\.(?:byte|hword|short|word|long|quad|ascii|asciz|string|incbin)\b/m.test(source)) {
  fail("source contains an owned data or literal directive");
}
for (const line of [
  "    bl      \\allocator",
  "    bl      func_00184990",
  "    bl      func_0020675C",
  "DT66_RECORD func_0049B080, func_0049A0F8",
  "DT66_RECORD func_004A1E14, func_004A0CDC",
]) {
  if (!source.includes(line)) fail(`missing symbolic source line: ${line}`);
}

for (const fn of config.functions) {
  const template = config.templates[fn.template];
  if (!template) fail(`${fn.name} names unknown template ${fn.template}`);
  same(fn.internalLabelOffsets.length, template.internalLabels, `${fn.name} internal-label count`);
  same(fn.directTransfers.length, template.directCalls, `${fn.name} direct-call count`);
  same(fn.nextGlobalOffset >= template.bodySize, true, `${fn.name} next-global boundary`);
  if (fn.anonymousMaterialOffset !== undefined) {
    same(fn.anonymousMaterialOffset, template.bodySize, `${fn.name} anonymous-material boundary`);
  } else {
    same(fn.nextGlobalOffset, template.bodySize, `${fn.name} immediate next-global boundary`);
  }
}
same(config.functions.reduce((sum, fn) => sum + config.templates[fn.template].bodySize, 0), config.expectedBodyBytes, "summed body bytes");
for (const [name, template] of Object.entries(config.templates)) {
  same(config.functions.filter((fn) => fn.template === name).length, template.count, `${name} expansion count`);
  same(template.ownedLiteralCount, 0, `${name} owned literal count`);
}

if (process.argv.length === 2) {
  console.log("arm duplicate templates 66: source and manifest checks passed (source-only mode)");
  process.exit(0);
}

const objectPath = resolve(process.cwd(), process.argv[2]);
const readelf = process.argv[3] ?? process.env.ARM_READELF ?? "arm-none-eabi-readelf";
function inspect(...args) {
  try {
    return execFileSync(readelf, args, { encoding: "utf8", maxBuffer });
  } catch (error) {
    fail(`${readelf} ${args.join(" ")} failed: ${error.message}`);
  }
}

const sectionText = inspect("-WS", objectPath);
const symbolText = inspect("-sW", objectPath);
const relocationText = inspect("-rW", objectPath);

const sections = new Map();
for (const line of sectionText.split("\n")) {
  const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)\s+\S+\s+(\S*)\s+\d+\s+\d+\s+(\d+)\s*$/);
  if (match) {
    sections.set(Number(match[1]), {
      index: Number(match[1]), name: match[2], type: match[3], address: Number.parseInt(match[4], 16),
      size: Number.parseInt(match[5], 16), flags: match[6], alignment: Number(match[7]),
    });
  }
}

const symbols = [];
for (const line of symbolText.split("\n")) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/);
  if (!match || !/^\d+$/.test(match[6])) continue;
  symbols.push({
    value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], bind: match[4],
    visibility: match[5], sectionIndex: Number(match[6]), name: match[7],
  });
}

const relocationSections = [];
let currentRelocations = null;
for (const line of relocationText.split("\n")) {
  const header = line.match(/^Relocation section '([^']+)'/);
  if (header) {
    currentRelocations = { name: header[1], entries: [] };
    relocationSections.push(currentRelocations);
    continue;
  }
  const fields = line.trim().split(/\s+/);
  const typeIndex = fields.findIndex((field) => /^R_ARM_/.test(field));
  if (currentRelocations && typeIndex >= 0 && /^[0-9a-fA-F]+$/.test(fields[0])) {
    currentRelocations.entries.push({
      offset: Number.parseInt(fields[0], 16), type: fields[typeIndex], symbol: fields[typeIndex + 2] ?? fields[typeIndex + 1],
    });
  }
}

function relocationTargetSection(name) {
  if (name.startsWith(".rela")) return name.slice(5);
  if (name.startsWith(".rel")) return name.slice(4);
  return null;
}

const sectionBytes = new Map();
function bytesForSection(section) {
  if (sectionBytes.has(section.index)) return sectionBytes.get(section.index);
  const dump = inspect("-x", String(section.index), objectPath);
  const bytes = Buffer.alloc(section.size);
  let copied = 0;
  for (const line of dump.split("\n")) {
    const match = line.match(/^\s*0x([0-9a-fA-F]+)\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
    if (!match) continue;
    const address = Number.parseInt(match[1], 16);
    const offset = address - section.address;
    const chunk = Buffer.from(match[2].replace(/\s/g, ""), "hex");
    chunk.copy(bytes, offset);
    copied += chunk.length;
  }
  if (copied < section.size) fail(`could not read all bytes from section ${section.name}`);
  sectionBytes.set(section.index, bytes);
  return bytes;
}

const bodies = new Map();
for (const fn of config.functions) {
  const template = config.templates[fn.template];
  const matches = symbols.filter((symbol) => symbol.name === fn.name && symbol.type === "FUNC" && symbol.sectionIndex !== 0);
  same(matches.length, 1, `${fn.name} defined function symbol count`);
  const symbol = matches[0];
  const section = sections.get(symbol.sectionIndex);
  if (!section) fail(`${fn.name} has an unknown section index`);
  same(symbol.bind, "GLOBAL", `${fn.name} binding`);
  same(symbol.size, template.bodySize, `${fn.name} body size`);
  same(template.instructionCount * 4, template.bodySize, `${fn.name} fixed-width instruction count`);
  same(section.type, "PROGBITS", `${fn.name} section type`);
  if (!section.flags.includes("A") || !section.flags.includes("X")) fail(`${fn.name} section is not allocatable executable code`);
  if (section.alignment < 4 || symbol.value % 4 !== 0) fail(`${fn.name} is not four-byte aligned`);

  const start = symbol.value - section.address;
  if (start < 0 || start + symbol.size > section.size) fail(`${fn.name} lies outside ${section.name}`);
  const body = Buffer.from(bytesForSection(section).subarray(start, start + symbol.size));
  bodies.set(fn.name, body);

  const relocs = relocationSections
    .filter((group) => relocationTargetSection(group.name) === section.name)
    .flatMap((group) => group.entries)
    .map((reloc) => ({ ...reloc, sectionOffset: section.address === 0 ? reloc.offset : reloc.offset - section.address }))
    .filter((reloc) => reloc.sectionOffset >= start && reloc.sectionOffset < start + symbol.size)
    .map((reloc) => ({ ...reloc, offset: reloc.sectionOffset - start }));
  same(relocs.length, fn.directTransfers.length, `${fn.name} relocation count`);
  fn.directTransfers.forEach((expected, index) => {
    const actual = relocs[index];
    same(actual.offset, expected.offset, `${fn.name} relocation ${index} offset`);
    same(actual.type, expected.kind, `${fn.name} relocation ${index} kind`);
    same(actual.symbol, expected.symbol, `${fn.name} relocation ${index} symbol`);
  });

  const localBranches = [];
  for (let offset = 0; offset < body.length; offset += 4) {
    const instruction = body.readUInt32LE(offset);
    if ((instruction & 0x0e000000) !== 0x0a000000 || (instruction & 0x01000000) !== 0) continue;
    let displacement = instruction & 0x00ffffff;
    if (displacement & 0x00800000) displacement -= 0x01000000;
    const destination = offset + 8 + displacement * 4;
    if (destination >= 0 && destination < body.length) localBranches.push(destination);
  }
  localBranches.sort((a, b) => a - b);
  same(localBranches.join(","), fn.internalLabelOffsets.join(","), `${fn.name} local branch destinations`);

  const dataMappings = symbols.filter((candidate) =>
    candidate.sectionIndex === symbol.sectionIndex && candidate.name.startsWith("$d") &&
    candidate.value >= symbol.value && candidate.value < symbol.value + symbol.size);
  same(dataMappings.length, 0, `${fn.name} owned literal/data mappings`);

  if (section.size !== symbol.size || start !== 0) {
    const nextGlobals = symbols.filter((candidate) =>
      candidate.sectionIndex === symbol.sectionIndex && candidate.bind === "GLOBAL" && candidate.name !== fn.name &&
      candidate.value > symbol.value).sort((a, b) => a.value - b.value);
    if (nextGlobals.length) same(nextGlobals[0].value - symbol.value, fn.nextGlobalOffset, `${fn.name} next global offset`);
  }
}

for (const names of [["func_0049B080", "func_004A1E14"], ["func_0056E77C", "func_0056E944"]]) {
  const normalized = names.map((name) => {
    const copy = Buffer.from(bodies.get(name));
    const fn = config.functions.find((candidate) => candidate.name === name);
    for (const transfer of fn.directTransfers) copy.fill(0, transfer.offset, transfer.offset + 4);
    return copy;
  });
  assert.deepEqual(normalized[0], normalized[1], `${names.join(" and ")} differ after direct-call normalization`);
}

console.log(`arm duplicate templates 66: validated ${config.functions.length} functions in ${objectPath}`);
