import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-25.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-25 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002DAC28", 88, [[88, "R_ARM_ABS32", "runtime_descriptor_25"]]],
  ["func_002DAFBC", 48, [[48, "u32", 1812433253], [52, "u32", 1566083941], [56, "R_ARM_ABS32", "runtime_prng_parameter_c_25"]]],
  ["func_002DB1B0", 56, [[56, "f32", 32], [60, "R_ARM_ABS32", "runtime_interpolation_table_25"]]],
];
if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" || manifest.totalBodySize !== 192 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, words] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.adjacentWords) ||
      JSON.stringify(entry.adjacentWords.map((word) => [word.offset, word.kind, word.symbol ?? word.value])) !== JSON.stringify(words)) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
const identities = manifest.symbolicIdentities;
if (identities === null || typeof identities !== "object" || Array.isArray(identities) ||
    Object.keys(identities).sort().join(",") !== "runtime_descriptor_25,runtime_interpolation_table_25,runtime_prng_parameter_c_25" ||
    identities.runtime_descriptor_25?.minimumSlotAlignment !== 4 ||
    identities.runtime_descriptor_25.equality !== "batch-local-distinct" ||
    identities.runtime_descriptor_25.usage !== "copied-only" ||
    identities.runtime_prng_parameter_c_25?.minimumSlotAlignment !== 4 ||
    identities.runtime_prng_parameter_c_25.equality !== "batch-local-distinct" ||
    identities.runtime_prng_parameter_c_25.usage !== "integer-copied-only" ||
    identities.runtime_interpolation_table_25?.minimumSlotAlignment !== 4 ||
    identities.runtime_interpolation_table_25.minimumPointeeAlignment !== 4 ||
    identities.runtime_interpolation_table_25.equality !== "batch-local-distinct" ||
    identities.runtime_interpolation_table_25.usage !== "f32-record-reads-at-8n-and-8n-plus-4") {
  fail("symbolic identity contracts are invalid");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
for (const identity of Object.keys(identities)) {
  if (!sourceText.includes(`.word ${identity}`) || !sourceText.includes(`.global ${identity}`)) {
    fail(`source must use symbolic identity ${identity}`);
  }
  if (new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`source must not define or embed ${identity}`);
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-25.mjs [base-object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let symbols;
  let relocations;
  try {
    const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], options);
    symbols = execFileSync(readelf, ["-sW", objectPath], options);
    relocations = execFileSync(readelf, ["-rW", objectPath], options);
  } catch (error) {
    fail(`could not inspect base object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("base object is not ARM");

  const parsedSymbols = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 8 || !fields[0].endsWith(":")) continue;
    parsedSymbols.push({
      value: Number.parseInt(fields[1], 16),
      size: Number.parseInt(fields[2], 10),
      type: fields[3],
      bind: fields[4],
      section: fields[6],
      name: fields.slice(7).join(" "),
    });
  }
  const functionSymbols = new Map();
  for (const [name, size] of expectedFunctions) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === name);
    if (matches.length !== 1) fail(`base object must contain exactly one ${name}`);
    const symbol = matches[0];
    if (symbol.size !== size || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") {
      fail(`${name} is not a defined ${size}-byte global function`);
    }
    functionSymbols.set(name, symbol);
  }
  for (const identity of Object.keys(identities)) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === identity);
    if (matches.length !== 1 || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") {
      fail(`${identity} must remain one undefined global symbol`);
    }
  }

  for (const [name, , words] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    for (const [offset, kind, value] of words) {
      if ((symbol.value + offset) % 4 !== 0) fail(`${name} adjacent word at +0x${offset.toString(16)} is misaligned`);
      if (kind !== "R_ARM_ABS32") continue;
      const matches = [];
      for (const line of relocations.split("\n")) {
        const fields = line.trim().split(/\s+/);
        if (fields.length >= 5 && fields[2] === kind && fields[4] === value) {
          matches.push(Number.parseInt(fields[0], 16));
        }
      }
      if (matches.length !== 1 || matches[0] !== symbol.value + offset) {
        fail(`${value} must have one ${kind} relocation at ${name}+0x${offset.toString(16)}`);
      }
    }
  }

  const publicWords = [
    ["func_002DAFBC", 48, 0x6c078965],
    ["func_002DAFBC", 52, 0x5d588b65],
    ["func_002DB1B0", 56, 0x42000000],
  ];
  const sectionBytes = new Map();
  for (const [name, offset, expected] of publicWords) {
    const symbol = functionSymbols.get(name);
    if (!sectionBytes.has(symbol.section)) {
      let dump;
      try {
        dump = execFileSync(readelf, ["-x", symbol.section, objectPath], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      } catch (error) {
        fail(`could not inspect ${name} section bytes: ${error.message}`);
      }
      const bytes = new Map();
      for (const line of dump.split("\n")) {
        const match = line.match(/^\s*0x([0-9a-fA-F]+)\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
        if (!match) continue;
        let address = Number.parseInt(match[1], 16);
        for (const word of match[2].trim().split(/\s+/)) {
          for (let index = 0; index < 8; index += 2) bytes.set(address++, Number.parseInt(word.slice(index, index + 2), 16));
        }
      }
      sectionBytes.set(symbol.section, bytes);
    }
    const bytes = sectionBytes.get(symbol.section);
    const address = symbol.value + offset;
    const actual = (bytes.get(address) | (bytes.get(address + 1) << 8) |
      (bytes.get(address + 2) << 16) | (bytes.get(address + 3) << 24)) >>> 0;
    if (actual !== expected) fail(`${name}+0x${offset.toString(16)} has unexpected public literal 0x${actual.toString(16)}`);
  }
}

console.log("Validated ARM runtime helpers batch 25: 3 functions, 192 body bytes, 3 symbolic relocations and 3 public words pinned.");
