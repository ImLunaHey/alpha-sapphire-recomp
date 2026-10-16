import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestName = "arm-runtime-helpers-42.json";
const manifest = JSON.parse(readFileSync(join(root, "config", manifestName), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));
const expectedSourceHash = "03af44500a18cd10fe363eb1693cf524f9dd819922d859d9489fc54ea4f4b369";
const expectedFunctions = [
  ["func_004E3D8C", 60], ["func_004E4168", 72], ["func_004E5DDC", 44],
  ["func_004E5E08", 36], ["func_004E60F4", 92], ["func_004E65FC", 72],
  ["func_004E6644", 84], ["func_004E6698", 88], ["func_004E66F0", 72],
  ["func_004E6738", 84], ["func_004E678C", 84], ["func_004E690C", 84],
  ["func_004E69D4", 84], ["func_004E6B34", 44], ["func_004E6B60", 48],
  ["func_004E6D2C", 36], ["func_004E6D68", 48], ["func_004E6FB4", 36],
  ["func_004E6FE4", 40], ["func_004E7064", 92], ["func_004E7124", 52],
  ["func_004E7700", 28], ["func_004E771C", 44], ["func_004E7BB8", 92],
  ["func_004EC724", 96], ["func_0056DCE4", 96],
];
const expectedIdentityClasses = {
  active_520_byte_record_helpers_42: {
    members: ["func_004E6644", "func_004E6698", "func_004E66F0"],
    parameters: ["resultKind", "byte540Polarity"],
  },
  fixed_width_uppercase_widening_42: {
    members: ["func_004E6738", "func_004E690C", "func_004E69D4"],
    parameters: ["sourceOffset", "maximumBytes", "sourceRegisterSchedule"],
  },
  halfword_pair_predicate_42: {
    members: ["func_004E6B34", "func_004E6B60"],
    parameters: ["invertResult"],
  },
  packed_display_field_helpers_42: {
    members: ["func_004E6FB4", "func_004E7064"],
    parameters: ["alternateSentinelFastPath"],
  },
  fixed_three_slot_occupancy_42: {
    members: ["func_004E7700", "func_004E771C"],
    parameters: ["indexedOrAllSlots"],
  },
};

function fail(message) {
  console.error(`arm-runtime-helpers-42 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_runtime_helpers_42.S" ||
    manifest.sourceSha256 !== expectedSourceHash || manifest.mode !== "arm" ||
    manifest.totalBodySize !== 1708 || !Array.isArray(manifest.functions) ||
    manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, source, digest, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) ||
      entry.calls.length !== 0 || !Array.isArray(entry.adjacentWords) ||
      entry.adjacentWords.length !== 0) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (JSON.stringify(manifest.identityClasses) !== JSON.stringify(expectedIdentityClasses)) {
  fail("structural identity classes are invalid");
}
if (JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify({})) {
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
if (/^\s*\.(?:word|long|4byte)\b/m.test(sourceText)) fail("source must not contain data words");
if (!sourceText.startsWith(".syntax unified\n.arch armv6k\n.fpu vfpv2\n.arm\n")) {
  fail("ARMv6K/VFPv2 source preamble is invalid");
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

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-42.mjs [base-object readelf]");
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
    const section = parsedSections.get(`.text.${name}`);
    if (!section || section.size !== size || !section.flags.includes("A") ||
        !section.flags.includes("X") || section.alignment < 4) {
      fail(`${name} must occupy one aligned executable section of exactly ${size} bytes`);
    }
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1 || matches[0].value !== 0 || matches[0].size !== size ||
        matches[0].type !== "FUNC" || matches[0].bind !== "GLOBAL" ||
        matches[0].section !== section.index) {
      fail(`${name} must be one defined ${size}-byte global function spanning its section`);
    }
  }

  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) { relocationSection = heading[1]; continue; }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 3 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2]) &&
        expectedFunctions.some(([name]) => relocationSection === `.text.${name}`)) {
      fail(`${relocationSection} must not contain relocations`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 42: 26 functions, 1,708 body bytes, no calls, adjacent data, or relocations.");
