import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-26.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-26 validation failed: ${message}`);
  process.exit(1);
}

const expectedFunctions = [
  ["func_002DBE58", 28, 16, "runtime_stacked_argument_helper_26"],
  ["func_002DBE74", 80, 24, "runtime_record_expander_26"],
];
if (manifest.schemaVersion !== 1 || manifest.mode !== "arm" || manifest.totalBodySize !== 108 ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== expectedFunctions.length) {
  fail("manifest schema, mode, function count, or total body size is invalid");
}
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, offset, symbol] = expectedFunctions[index];
  const entry = manifest.functions[index];
  if (entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) ||
      JSON.stringify(entry.calls) !== JSON.stringify([{ offset, kind: "R_ARM_CALL", symbol }]) ||
      !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0) {
    fail(`manifest entry for ${name} is invalid`);
  }
}

const identities = manifest.symbolicIdentities;
const identityNames = expectedFunctions.map((entry) => entry[3]);
if (identities === null || typeof identities !== "object" || Array.isArray(identities) ||
    Object.keys(identities).sort().join(",") !== [...identityNames].sort().join(",")) {
  fail("symbolic identity set is invalid");
}
for (const [identity, usage] of [
  ["runtime_stacked_argument_helper_26", "stacked-fourth-argument-call"],
  ["runtime_record_expander_26", "record-expansion-call"],
]) {
  const contract = identities[identity];
  if (contract?.mode !== "arm" || contract.minimumAlignment !== 4 ||
      contract.equality !== "batch-local-distinct" || contract.usage !== usage) {
    fail(`symbolic identity contract for ${identity} is invalid`);
  }
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (/^\s*\.word\b/m.test(sourceText)) fail("source must not contain literal or adjacent data words");
for (const identity of identityNames) {
  if (!sourceText.includes(`bl ${identity}`) || !sourceText.includes(`.global ${identity}`)) {
    fail(`source must call symbolic identity ${identity}`);
  }
  if (new RegExp(`^${identity}\\s*:`, "m").test(sourceText)) {
    fail(`source must not define or embed ${identity}`);
  }
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-26.mjs [base-object readelf]");
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
  for (const identity of identityNames) {
    const matches = parsedSymbols.filter((symbol) => symbol.name === identity);
    if (matches.length !== 1 || matches[0].bind !== "GLOBAL" || matches[0].section !== "UND") {
      fail(`${identity} must remain one undefined global ARM call identity`);
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
  for (const [name, size, offset, identity] of expectedFunctions) {
    const symbol = functionSymbols.get(name);
    const bodyRelocations = parsedRelocations.filter((relocation) =>
      relocation.section === `.text.${name}` &&
      relocation.offset >= symbol.value && relocation.offset < symbol.value + size);
    if (bodyRelocations.length !== 1 || bodyRelocations[0].offset !== symbol.value + offset ||
        bodyRelocations[0].kind !== "R_ARM_CALL" || bodyRelocations[0].symbol !== identity) {
      fail(`${name} must have only one R_ARM_CALL relocation to ${identity} at +0x${offset.toString(16)}`);
    }
  }
}

console.log("Validated ARM runtime helpers batch 26: 2 functions, 108 body bytes, 2 distinct symbolic ARM calls, no adjacent data.");
