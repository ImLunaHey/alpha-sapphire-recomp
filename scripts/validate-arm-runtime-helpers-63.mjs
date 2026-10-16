import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-runtime-helpers-63.json");
const specPath = resolve(root, "docs/specs/main/arm_runtime_helpers_63.md");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath, "utf8").trimEnd();
const spec = readFileSync(specPath, "utf8");
const schedule = spec.match(/```asm\n([\s\S]*?)\n```/);

function fail(message) {
  console.error(`arm runtime helpers 63 validation failed: ${message}`);
  process.exit(1);
}

if (!schedule) fail("the specification has no assembly schedule");
if (source !== schedule[1].trimEnd()) {
  fail(`${config.source} differs from the approved exact schedule`);
}
if (config.schemaVersion !== 1 || config.mode !== "arm") {
  fail("unexpected configuration schema or instruction mode");
}
if (config.totalAdjacentSize !== 0 || config.pcRelativeDataAccesses.length !== 0) {
  fail("batch 63 must remain zero-adjacent-data and PC-relative-data-free");
}
const configuredTotal = config.functions.reduce((total, fn) => total + fn.size, 0);
if (configuredTotal !== config.totalBodySize || configuredTotal !== 3004) {
  fail(`configured body total is ${configuredTotal}, expected 3004`);
}

const declared = [...source.matchAll(/^\.global\s+(func_[0-9A-F]+)$/gm)].map((match) => match[1]);
const configured = config.functions.map((fn) => fn.name);
if (declared.length !== configured.length || declared.some((name, index) => name !== configured[index])) {
  fail("source function order does not match the configuration");
}
for (const fn of config.functions) {
  if (fn.calls.length !== 0 || fn.adjacentWords.length !== 0) {
    fail(`${fn.name} must remain call-free with no adjacent words`);
  }
  if (!source.includes(`.size ${fn.name}, .-${fn.name}`)) {
    fail(`${fn.name} has no matching size directive`);
  }
}

const [objectPath, readelf = "arm-none-eabi-readelf", ...options] = process.argv.slice(2);
if (options.some((option) => option !== "--target-object")) {
  fail(`unknown option: ${options.find((option) => option !== "--target-object")}`);
}

if (objectPath) {
  const runReadelf = (...args) => execFileSync(readelf, args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  let symbols;
  let relocations;
  try {
    symbols = runReadelf("-Ws", objectPath);
    relocations = runReadelf("-rW", objectPath);
  } catch (error) {
    fail(`could not inspect ${objectPath}: ${error.message}`);
  }

  for (const fn of config.functions) {
    const escaped = fn.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rows = symbols.split("\n").filter((line) => new RegExp(`\\b${escaped}$`).test(line.trim()));
    const row = rows.find((line) => /\bFUNC\b/.test(line) && /\bGLOBAL\b/.test(line));
    if (!row) fail(`${fn.name} is missing from ${objectPath}`);
    const fields = row.trim().split(/\s+/);
    const value = Number.parseInt(fields[1], 16);
    const size = Number.parseInt(fields[2], 10);
    if (size !== fn.size) fail(`${fn.name} has size ${size}, expected ${fn.size}`);
    if ((value & 1) !== 0) fail(`${fn.name} is marked as Thumb instead of ARM`);
    const relocationSection = new RegExp(`Relocation section '[^']*${escaped}[^']*'`);
    if (relocationSection.test(relocations)) fail(`${fn.name} contains relocations`);
  }
}

console.log(`Validated ${config.functions.length} ARM runtime helpers (3004 bytes, zero relocations).`);
