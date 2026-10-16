import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config/arm-runtime-helpers-21.json");
const sourcesPath = join(root, "config/sources.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sources = JSON.parse(readFileSync(sourcesPath, "utf8"));

function fail(message) {
  console.error(`arm-runtime-helpers-21 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm") {
  fail("manifest schema or instruction mode is invalid");
}
if (!Array.isArray(manifest.functions) || manifest.functions.length !== 3) {
  fail("manifest must describe exactly three functions");
}

const names = new Set();
let totalSize = 0;
for (const entry of manifest.functions) {
  if (typeof entry.name !== "string" || !Number.isInteger(entry.size) || entry.size <= 0) {
    fail("manifest contains an invalid function entry");
  }
  if (names.has(entry.name)) fail(`duplicate manifest symbol ${entry.name}`);
  names.add(entry.name);
  totalSize += entry.size;
}
if (totalSize !== manifest.totalSize) {
  fail(`manifest sizes total ${totalSize}, expected ${manifest.totalSize}`);
}

const configured = sources.sources.filter((entry) => entry.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}

const source = readFileSync(join(root, manifest.source));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== manifest.sourceSha256) {
  fail(`source digest ${digest} does not match the reviewed manifest`);
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) {
  fail("usage: validate-arm-runtime-helpers-21.mjs [base-object readelf]");
}

if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let symbols;
  try {
    header = execFileSync(readelf, ["-h", objectPath], { encoding: "utf8" });
    symbols = execFileSync(readelf, ["-sW", objectPath], { encoding: "utf8" });
  } catch (error) {
    fail(`could not inspect base object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("base object is not ARM");

  const table = new Map();
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length < 8 || !fields[0].endsWith(":")) continue;
    const name = fields.slice(7).join(" ");
    if (!names.has(name)) continue;
    if (table.has(name)) fail(`base object contains duplicate symbol ${name}`);
    table.set(name, {
      size: Number.parseInt(fields[2], 10),
      type: fields[3],
      bind: fields[4],
      section: fields[6],
    });
  }

  for (const entry of manifest.functions) {
    const symbol = table.get(entry.name);
    if (!symbol) fail(`base object is missing ${entry.name}`);
    if (symbol.size !== entry.size) {
      fail(`${entry.name} has size ${symbol.size}, expected ${entry.size}`);
    }
    if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") {
      fail(`${entry.name} is not a defined global function`);
    }
  }
}

console.log(
  `Validated ARM runtime helpers batch 21: ${manifest.functions.length} functions, ${manifest.totalSize} bytes.`,
);
