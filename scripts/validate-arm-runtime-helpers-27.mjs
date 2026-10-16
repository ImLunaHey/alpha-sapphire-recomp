import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-27.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-27 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002DF13C", 24, [[24, "runtime_once_flag_27"]]],
  ["func_002DFB0C", 64, [
    [64, "runtime_initializer_value_a_27"],
    [68, "runtime_initializer_value_b_27"],
    [72, "runtime_initializer_value_c_27"],
  ]],
];
const expectedIdentityContracts = {
  runtime_once_flag_27: {
    minimumSlotAlignment: 4,
    minimumPointeeAlignment: 4,
    equality: "batch-local-distinct",
    usage: "writable-byte-offset-zero",
  },
  runtime_initializer_value_a_27: {
    minimumSlotAlignment: 4,
    equality: "batch-local-distinct",
    usage: "integer-copied-once-complemented-once",
  },
  runtime_initializer_value_b_27: {
    minimumSlotAlignment: 4,
    equality: "batch-local-distinct",
    usage: "integer-copied-once-complemented-once",
  },
  runtime_initializer_value_c_27: {
    minimumSlotAlignment: 4,
    equality: "batch-local-distinct",
    usage: "integer-copied-once",
  },
};

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" || manifest.totalBodySize !== 88 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, words] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const expectedWords = words.map(([offset, symbol]) => ({ offset, kind: "R_ARM_ABS32", symbol }));
  if (entry?.name !== name || entry.size !== size ||
      !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
      JSON.stringify(entry.adjacentWords) !== JSON.stringify(expectedWords)) {
    fail(`manifest entry for ${name} is invalid`);
  }
}
if (manifest.symbolicIdentities === null || typeof manifest.symbolicIdentities !== "object" ||
    Array.isArray(manifest.symbolicIdentities) ||
    JSON.stringify(manifest.symbolicIdentities) !== JSON.stringify(expectedIdentityContracts)) {
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
for (const identity of Object.keys(expectedIdentityContracts)) {
  if (!sourceText.includes(`.word ${identity}`) || !sourceText.includes(`.global ${identity}`)) {
    fail(`source must use symbolic identity ${identity}`);
  }
  if (new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`source must not define or embed ${identity}`);
  }
}
if (/^\s*(?:bl|blx)\b/m.test(sourceText)) fail("source must not contain calls");

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-27.mjs [base-object readelf]");
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
  for (const identity of Object.keys(expectedIdentityContracts)) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === identity);
    if (matches.length !== 1 || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") {
      fail(`${identity} must remain one undefined global symbol`);
    }
  }

  const parsedRelocations = [];
  let relocationSection = "";
  for (const line of relocations.split("\n")) {
    const heading = line.match(/^Relocation section '(?:\.rel|\.rela)([^']+)'/);
    if (heading) {
      relocationSection = heading[1];
      continue;
    }
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5 && /^[0-9a-fA-F]+$/.test(fields[0]) && /^R_ARM_/.test(fields[2])) {
      parsedRelocations.push({
        section: relocationSection,
        offset: Number.parseInt(fields[0], 16),
        kind: fields[2],
        symbol: fields[4],
      });
    }
  }
  for (const [name, size, words] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const section = `.text.${name}`;
    const lastOffset = words.at(-1)[0];
    const relevant = parsedRelocations.filter((relocation) =>
      relocation.section === section && relocation.offset >= symbol.value &&
      relocation.offset < symbol.value + lastOffset + 4);
    const expected = words.map(([offset, identity]) => ({
      section,
      offset: symbol.value + offset,
      kind: "R_ARM_ABS32",
      symbol: identity,
    }));
    if (JSON.stringify(relevant) !== JSON.stringify(expected)) {
      fail(`${name} does not have exactly the documented adjacent R_ARM_ABS32 relocations`);
    }
    if (relevant.some((relocation) => relocation.offset < symbol.value + size || relocation.offset % 4 !== 0)) {
      fail(`${name} has a relocation inside its body or a misaligned adjacent slot`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 27: 2 functions, 88 body bytes, no calls, 4 distinct symbolic adjacent slots.");
