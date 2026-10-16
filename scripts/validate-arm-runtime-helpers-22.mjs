import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "config/arm-runtime-helpers-22.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "config/sources.json"), "utf8"));
const expectedWords = [19650218, 623, 1812433253, 1664525, 1566083941];
const expectedOffsets = [0x134, 0x138, 0x13c, 0x140, 0x144];

function fail(message) {
  console.error(`arm-runtime-helpers-22 validation failed: ${message}`);
  process.exit(1);
}

if (manifest.schemaVersion !== 1 || manifest.mode !== "arm") fail("manifest schema or mode is invalid");
if (!Array.isArray(manifest.functions) || manifest.functions.length !== 1) fail("manifest must describe one function");
const [entry] = manifest.functions;
if (entry.name !== "func_002DAE74" || entry.size !== 308 || manifest.totalSize !== 308) {
  fail("manifest function identity or size is invalid");
}
if (manifest.bodyEndOffset !== 0x134) fail("function body must end at relative +0x134");
if (JSON.stringify(manifest.adjacentWordOffsets) !== JSON.stringify(expectedOffsets)) {
  fail("adjacent constant offsets are invalid");
}
if (JSON.stringify(manifest.adjacentWords) !== JSON.stringify(expectedWords)) fail("public constants are invalid");

const configured = sources.sources.filter((source) => source.path === manifest.source);
if (configured.length !== 1 || configured[0].mode !== manifest.mode) {
  fail(`${manifest.source} must occur once in config/sources.json with ARM mode`);
}
const digest = createHash("sha256").update(readFileSync(join(root, manifest.source))).digest("hex");
if (digest !== manifest.sourceSha256) fail(`source digest ${digest} does not match the reviewed manifest`);

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-runtime-helpers-22.mjs [base-object readelf]");
if (args.length === 2) {
  const [objectPath, readelf] = args;
  let header;
  let symbols;
  let dump;
  try {
    header = execFileSync(readelf, ["-h", objectPath], { encoding: "utf8" });
    symbols = execFileSync(readelf, ["-sW", objectPath], { encoding: "utf8" });
    dump = execFileSync(readelf, ["-x", ".text", objectPath], { encoding: "utf8" });
  } catch (error) {
    fail(`could not inspect base object: ${error.message}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(header)) fail("base object is not ARM");
  const matches = [];
  for (const line of symbols.split("\n")) {
    const fields = line.trim().split(/\s+/);
    if (fields.length >= 8 && fields[0].endsWith(":") && fields.slice(7).join(" ") === entry.name) {
      matches.push({ value: Number.parseInt(fields[1], 16), size: Number.parseInt(fields[2], 10), type: fields[3], bind: fields[4], section: fields[6] });
    }
  }
  if (matches.length !== 1) fail(`base object must contain exactly one ${entry.name}`);
  const symbol = matches[0];
  if (symbol.size !== entry.size) fail(`${entry.name} has size ${symbol.size}, expected ${entry.size}`);
  if (symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.section === "UND") fail(`${entry.name} is not a defined global function`);

  const bytes = new Map();
  for (const line of dump.split("\n")) {
    const match = line.match(/^\s*0x([0-9a-fA-F]+)\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
    if (!match) continue;
    let address = Number.parseInt(match[1], 16);
    for (const group of match[2].trim().split(/\s+/)) {
      for (let offset = 0; offset < 8; offset += 2) bytes.set(address++, group.slice(offset, offset + 2));
    }
  }
  const actual = expectedWords.map((unused, index) => {
    const start = symbol.value + expectedOffsets[index];
    const parts = [0, 1, 2, 3].map((byte) => bytes.get(start + byte));
    if (parts.some((part) => part === undefined)) fail("could not read adjacent constant pool from .text");
    return Number.parseInt(parts.reverse().join(""), 16);
  });
  if (JSON.stringify(actual) !== JSON.stringify(expectedWords)) fail(`adjacent constants are ${JSON.stringify(actual)}`);
}

console.log("Validated ARM runtime helpers batch 22: 1 function, 308 bytes, adjacent constants pinned.");
