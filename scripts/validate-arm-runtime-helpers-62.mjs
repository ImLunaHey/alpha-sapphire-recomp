import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-runtime-helpers-62.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath, "utf8");
const maxBuffer = 16 * 1024 * 1024;

function fail(message) {
  console.error(`arm runtime helpers 62: ${message}`);
  process.exit(1);
}

if (config.mode !== "arm") fail(`expected ARM mode, got ${config.mode}`);
if (config.totalAdjacentSize !== 0) fail("this batch must not contain adjacent data");
if (config.pcRelativeDataAccesses.length !== 0) fail("this batch must not contain PC-relative data accesses");

let configuredSize = 0;
for (const fn of config.functions) {
  configuredSize += fn.size;
  if (fn.size % 4 !== 0) fail(`${fn.name} has a non-ARM-aligned size`);
  if (fn.calls.length !== 0 || fn.adjacentWords.length !== 0) {
    fail(`${fn.name} must be call-free and have no adjacent words`);
  }

  const start = source.indexOf(`${fn.name}:`);
  const endMarker = `.size ${fn.name}, .-${fn.name}`;
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) fail(`missing source body for ${fn.name}`);
  const body = source.slice(start, end);
  const instructionCount = body.split("\n").filter((line) => /^\s+[A-Za-z]/.test(line)).length;
  if (instructionCount * 4 !== fn.size) {
    fail(`${fn.name} source schedule is ${instructionCount * 4} bytes, expected ${fn.size}`);
  }
  if (/^\s*(?:bl|blx)\s/m.test(body)) fail(`${fn.name} contains a call instruction`);
}

if (configuredSize !== config.totalBodySize) {
  fail(`configured body total is ${configuredSize}, expected ${config.totalBodySize}`);
}

const objectPath = process.argv[2];
if (objectPath) {
  const readelf = process.argv[3] ?? "arm-none-eabi-readelf";
  let symbols;
  let relocations;
  try {
    symbols = execFileSync(readelf, ["-Ws", objectPath], { encoding: "utf8", maxBuffer });
    relocations = execFileSync(readelf, ["-rW", objectPath], { encoding: "utf8", maxBuffer });
  } catch (error) {
    fail(`could not inspect ${objectPath}: ${error.message}`);
  }

  for (const fn of config.functions) {
    const rows = symbols.split("\n").filter((line) => line.trim().endsWith(` ${fn.name}`));
    if (rows.length !== 1) fail(`expected one symbol-table entry for ${fn.name}, found ${rows.length}`);
    const match = rows[0].match(/^\s*\d+:\s+[0-9a-fA-F]+\s+(\d+)\s+FUNC\s+GLOBAL\s+DEFAULT\s+(\S+)\s+(\S+)\s*$/);
    if (!match) fail(`unexpected symbol-table entry for ${fn.name}`);
    if (Number(match[1]) !== fn.size) fail(`${fn.name} is ${match[1]} bytes in ${objectPath}, expected ${fn.size}`);
    if (match[2] === "UND") fail(`${fn.name} is undefined in ${objectPath}`);

    const escaped = fn.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRelocations = new RegExp(`Relocation section '[^']*\\.text\\.${escaped}'[\\s\\S]*?(?=\\nRelocation section|$)`);
    const block = relocations.match(sectionRelocations)?.[0];
    if (block && /\n\s*[0-9a-fA-F]{8,}\s/.test(block)) fail(`${fn.name} has relocations`);
  }
}

console.log(`Validated ${config.functions.length} ARM runtime helpers (batch 62, ${configuredSize} bytes).`);
