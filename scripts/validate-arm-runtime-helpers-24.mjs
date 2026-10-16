import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-24.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-24 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm") fail("manifest schema or mode is invalid");
if (!Array.isArray(manifest.functions) || manifest.functions.length !== 1) fail("manifest must describe one function");
const [entry] = manifest.functions;
if (entry.name !== "func_002DC7A0" || entry.size !== 204 || manifest.totalSize !== 204) {
  fail("manifest function identity or size is invalid");
}
if (manifest.bodyEndOffset !== 0xcc) fail("function body must end at relative +0xcc");
const constant = manifest.adjacentConstant;
if (constant?.offset !== 0xcc || constant.label !== ".Lcrc32_polynomial_24" ||
    constant.size !== 4 || constant.minimumAlignment !== 4 || constant.value !== "0xEDB88320" ||
    constant.contract !== "standard-reflected-crc32-polynomial") {
  fail("adjacent CRC-32 polynomial contract is invalid");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (!sourceText.includes("ldr r5, .Lcrc32_polynomial_24") ||
    !sourceText.includes(".word 0xEDB88320") ||
    !sourceText.includes(".Lcrc32_polynomial_24:")) {
  fail("source must define and load the local reflected CRC-32 polynomial constant");
}
if (/\.global\s+(?:\.L)?crc32_polynomial_24|\.type\s+(?:\.L)?crc32_polynomial_24/.test(sourceText)) {
  fail("adjacent polynomial data must not be exported or typed as an inventoried symbol");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-24.mjs [base-object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let symbols;
  try {
    const inspectOptions = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], inspectOptions);
    symbols = execFileSync(readelf, ["-sW", objectPath], inspectOptions);
  } catch (error) {
    fail(`could not inspect base object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("base object is not ARM");

  const matches = [];
  const exportedConstants = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 8 || !fields[0].endsWith(":")) continue;
    const symbol = {
      value: Number.parseInt(fields[1], 16),
      size: Number.parseInt(fields[2], 10),
      type: fields[3],
      bind: fields[4],
      section: fields[6],
      name: fields.slice(7).join(" "),
    };
    if (symbol.name === entry.name) matches.push(symbol);
    if (symbol.name === "crc32_polynomial_24" || symbol.name === constant.label) exportedConstants.push(symbol);
  }
  if (matches.length !== 1) fail(`base object must contain exactly one ${entry.name}`);
  if (exportedConstants.some((symbol) => symbol.bind === "GLOBAL" || symbol.type === "FUNC" || symbol.type === "OBJECT")) {
    fail("adjacent polynomial data must not be an exported or typed inventory symbol");
  }
  const functionSymbol = matches[0];
  if (functionSymbol.size !== entry.size || functionSymbol.type !== "FUNC" ||
      functionSymbol.bind !== "GLOBAL" || functionSymbol.section === "UND") {
    fail(`${entry.name} is not a defined ${entry.size}-byte global function`);
  }
  const constantAddress = functionSymbol.value + constant.offset;
  if (constantAddress % constant.minimumAlignment !== 0) {
    fail("adjacent polynomial data must be four-byte aligned at function-relative +0xcc");
  }

  let sectionDump;
  try {
    sectionDump = execFileSync(readelf, ["-x", functionSymbol.section, objectPath], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    fail(`could not inspect function section bytes: ${error.message}`);
  }
  const bytes = new Map();
  for (const line of sectionDump.split("\n")) {
    const match = line.match(/^\s*0x([0-9a-fA-F]+)\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
    if (!match) continue;
    let address = Number.parseInt(match[1], 16);
    for (const word of match[2].trim().split(/\s+/)) {
      for (let index = 0; index < 8; index += 2) bytes.set(address++, Number.parseInt(word.slice(index, index + 2), 16));
    }
  }
  const actual = [0, 1, 2, 3].map((index) => bytes.get(constantAddress + index));
  if (actual.some((value) => value === undefined) ||
      actual[0] !== 0x20 || actual[1] !== 0x83 || actual[2] !== 0xb8 || actual[3] !== 0xed) {
    fail("adjacent polynomial data does not contain little-endian 0xEDB88320");
  }
}

console.log("Validated ARM runtime helpers batch 24: 1 function, 204 bytes, adjacent reflected CRC-32 polynomial pinned.");
