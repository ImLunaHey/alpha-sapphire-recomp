import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-23.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-23 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm") fail("manifest schema or mode is invalid");
if (!Array.isArray(manifest.functions) || manifest.functions.length !== 1) fail("manifest must describe one function");
const [entry] = manifest.functions;
if (entry.name !== "func_002DACF0" || entry.size !== 252 || manifest.totalSize !== 252) {
  fail("manifest function identity or size is invalid");
}
if (manifest.bodyEndOffset !== 0xfc) fail("function body must end at relative +0xfc");
const relocation = manifest.adjacentRelocation;
if (relocation?.offset !== 0xfc || relocation.type !== "R_ARM_ABS32" ||
    relocation.symbol !== "runtime_shift_width_table_23") {
  fail("adjacent symbolic table relocation is invalid");
}
const table = manifest.tableContract;
if (table?.identity !== relocation.symbol || table.minimumAlignment !== 1 ||
    JSON.stringify(table.readableIndexRange) !== "[0,10]" || table.contentsSpecified !== false ||
    table.equality !== "audited-runtime-table") {
  fail("opaque table contract is invalid");
}

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);
const sourceText = source.toString("utf8");
if (!sourceText.includes(".word runtime_shift_width_table_23") ||
    !sourceText.includes(".global runtime_shift_width_table_23")) {
  fail("source must use the symbolic opaque-table word");
}
if (/runtime_shift_width_table_23\s*:/.test(sourceText)) {
  fail("source must not define or embed the opaque runtime table");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-23.mjs [base-object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let symbols;
  let relocations;
  try {
    const inspectOptions = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
    header = execFileSync(readelf, ["-h", objectPath], inspectOptions);
    symbols = execFileSync(readelf, ["-sW", objectPath], inspectOptions);
    relocations = execFileSync(readelf, ["-rW", objectPath], inspectOptions);
  } catch (error) {
    fail(`could not inspect base object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("base object is not ARM");

  const matches = [];
  let tableSymbol;
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
    if (symbol.name === relocation.symbol) {
      if (tableSymbol !== undefined) fail(`base object contains multiple ${relocation.symbol} symbols`);
      tableSymbol = symbol;
    }
  }
  if (matches.length !== 1) fail(`base object must contain exactly one ${entry.name}`);
  const symbol = matches[0];
  if (symbol.size !== entry.size) fail(`${entry.name} has size ${symbol.size}, expected ${entry.size}`);
  if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") {
    fail(`${entry.name} is not a defined global function`);
  }
  if (tableSymbol === undefined || tableSymbol.bind !== "GLOBAL" || tableSymbol.section !== "UND") {
    fail(`${relocation.symbol} must remain a single undefined global symbol`);
  }

  const relocationMatches = [];
  for (const line of relocations.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 5 && fields[2] === relocation.type && fields[4] === relocation.symbol) {
      relocationMatches.push(Number.parseInt(fields[0], 16));
    }
  }
  const expectedOffset = symbol.value + relocation.offset;
  if (relocationMatches.length !== 1 || relocationMatches[0] !== expectedOffset) {
    fail(`${relocation.symbol} must have one ${relocation.type} relocation at function-relative +0xfc`);
  }
}

console.log("Validated ARM runtime helpers batch 23: 1 function, 252 bytes, opaque table relocation pinned.");
