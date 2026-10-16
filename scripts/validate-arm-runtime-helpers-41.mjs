import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-41.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));
const expectedSourceHash = "a70860fa970031cc6addac2743202f369c8ee278933f06e17807bcf2d4ea3452";
const expectedFunctions = [
  ["func_004C58DC", 180], ["func_004D0014", 124], ["func_004D42C8", 156],
  ["func_004E41C8", 116], ["func_004E9FA8", 100], ["func_004EAC54", 132],
  ["func_004F4C90", 144], ["func_00505F2C", 128], ["func_0052B610", 112],
  ["func_0052B680", 100], ["func_0053F700", 120], ["func_0056B030", 144],
  ["func_0056E0BC", 160],
];
const slotOwner = "func_0056B030";
const slotIdentity = "blend_lower_endpoint_threshold_41";
const expectedIdentityClasses = {
  mode_indexed_packed_selector_41: {
    members: ["func_004E9FA8", "func_004EAC54"],
    parameters: ["sourceWordOffset", "selectorCount", "fieldWidth", "descendingBitPosition"],
  },
  bounded_fixed_width_stream_read_41: {
    members: ["func_0052B610", "func_0052B680"],
    parameters: ["payloadWidth", "availabilityThreshold", "outputStoreWidth", "cursorAdvance"],
  },
};
const expectedSymbolicIdentities = {
  [slotIdentity]: {
    minimumSlotAlignment: 4,
    equality: "singleton-distinct",
    usage: "vfp-single-lower-endpoint-selection-threshold",
  },
};

function fail(message) {
  console.error(`arm-runtime-helpers-41 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_41.S" ||
    manifest.sourceSha256 !== expectedSourceHash || manifest.mode !== "arm" ||
    manifest.totalBodySize !== 1716 || !Array.isArray(manifest.functions) ||
    manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, digest, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size] = expectedFunctions[index];
  const expectedWords = name === slotOwner
    ? [{ offset: 144, kind: "R_ARM_ABS32", symbol: slotIdentity }]
    : [];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) ||
      entry.calls.length !== 0 || JSON.stringify(entry.adjacentWords) !== JSON.stringify(expectedWords)) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedIdentityClasses)) {
  fail("structural identity classes are invalid");
}
if (JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedSymbolicIdentities)) {
  fail("symbolic identity contract is invalid");
}

const selected = new Set(expectedFunctions.map(([name]) => name));
for (const name of readdirSync(join(root, "config"))) {
  if (name === manifestName || !/^arm-.*\.json$/.test(name)) continue;
  const other = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of other.functions ?? []) {
    if (selected.has(entry.name)) fail(`${entry.name} overlaps selection in config/${name}`);
  }
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== expectedSourceHash) fail(`source digest ${digest} does not match the reviewed schedule`);
const sourceText = source.toString("utf8");
if (/^\s*(?:bl|blx)\b/m.test(sourceText)) fail("source must not contain calls");
if (!sourceText.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n")) {
  fail("ARMv6K/VFPv2 source preamble is invalid");
}
const dataWords = sourceText.match(/^\s*\.(?:word|long|4byte)\b.*$/gm) ?? [];
if (dataWords.length !== 1 || dataWords[0].trim() !== `.word ${slotIdentity}`) {
  fail("source must contain exactly the approved symbolic adjacent word");
}
for (const [name] of expectedFunctions) {
  const declarations = [
    `.section .text.${name}, "ax", %progbits`, `.global ${name}`,
    `.type ${name}, %function`, `${name}:`, `.size ${name}, .-${name}`,
  ];
  for (const declaration of declarations) {
    if (!sourceText.includes(declaration)) fail(`source declaration for ${name} is missing`);
  }
}
const sizeDirective = sourceText.indexOf(`.size ${slotOwner}, .-${slotOwner}`);
const slotLabel = sourceText.indexOf(".Lblend_lower_endpoint_threshold_41:");
const slotWord = sourceText.indexOf(`.word ${slotIdentity}`);
if (!(sizeDirective >= 0 && sizeDirective < slotLabel && slotLabel < slotWord)) {
  fail("symbolic slot must follow the endpoint helper body and size declaration");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-41.mjs [base-object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let sections;
  let symbols;
  let relocations;
  try {
    const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], options);
    sections = execFileSync(readelf, ["-SW", objectPath], options);
    symbols = execFileSync(readelf, ["-sW", objectPath], options);
    relocations = execFileSync(readelf, ["-rW", objectPath], options);
  } catch (error) {
    fail(`could not inspect object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("object is not ARM");

  const parsedSections = new Map();
  for (const line of sections.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s+\S+\s+(\S+)\s+\S+\s+\S+\s+(\d+)\s*$/);
    if (match) parsedSections.set(match[2], {
      index: match[1], size: Number.parseInt(match[3], 16), flags: match[4],
      alignment: Number.parseInt(match[5], 10),
    });
  }
  const parsedSymbols = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 8 || !fields[0].endsWith(":")) continue;
    parsedSymbols.push({
      value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10),
      type: fields[3], bind: fields[4], section: fields[6], name: fields.slice(7).join(" "),
    });
  }
  for (const [name, size] of expectedFunctions) {
    const sectionName = `.text.${name}`;
    const section = parsedSections.get(sectionName);
    const expectedSectionSize = size + (name === slotOwner ? 4 : 0);
    if (!section || section.size !== expectedSectionSize || !section.flags.includes("A") ||
        !section.flags.includes("X") || section.alignment < 4) {
      fail(`${name} must occupy one aligned executable section with the approved body and slot extent`);
    }
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== size ||
        matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" ||
        matches[0].section !== section.index) {
      fail(`${name} must be one defined ${size}-byte global function spanning its body`);
    }
  }
  const identitySymbols = parsedSymbols.filter((symbol) => symbol.name === slotIdentity);
  if (identitySymbols.length !== 1 || identitySymbols[0].section !== "UND" ||
      identitySymbols[0].bind !== "GLOBAL") {
    fail("adjacent scalar identity must remain one undefined global symbol");
  }

  const actualRelocations = [];
  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2]) &&
        expectedFunctions.some(([name]) => relocationSection === `.text.${name}`)) {
      actualRelocations.push({
        section: relocationSection,
        offset: Number.parseInt(fields[0], 16),
        kind: fields[2],
        symbol: fields[4],
      });
    }
  }
  const expectedRelocations = [{
    section: `.text.${slotOwner}`, offset: 144, kind: "R_ARM_ABS32", symbol: slotIdentity,
  }];
  if (JSON.stringify(actualRelocations) !== JSON.stringify(expectedRelocations)) {
    fail(`object relocations are ${JSON.stringify(actualRelocations)}`);
  }
}

console.log("Validated ARM runtime helpers batch 41: 13 functions, 1,716 body bytes, no calls or body relocations, and one symbolic adjacent scalar slot.");
