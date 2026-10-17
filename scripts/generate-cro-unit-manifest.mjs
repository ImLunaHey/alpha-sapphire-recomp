import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const DEFAULT_TARGET = "AS_EUR_REV2";
const DEFAULT_UNIT_COUNT = 145;

function loadEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, "$2")];
      }),
  );
}

function fail(message) {
  throw new Error(`CRO unit inventory: ${message}`);
}

export function buildCroUnitManifest(inventory, options = {}) {
  const expectedCount = options.expectedCount ?? DEFAULT_UNIT_COUNT;
  const target = options.target ?? DEFAULT_TARGET;
  if (!inventory || typeof inventory !== "object" || Array.isArray(inventory)) fail("input must be an object");
  if (!Array.isArray(inventory.files)) fail("input files must be an array");
  if (!Number.isSafeInteger(expectedCount) || expectedCount < 1) fail("expected unit count is invalid");
  if (!/^[A-Z0-9_]+$/u.test(target)) fail("target identifier is invalid");

  const seenFiles = new Set();
  const seenUnits = new Set();
  const units = [];
  for (const entry of inventory.files) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail("file entry must be an object");
    if (typeof entry.name !== "string" || !/^Dll[A-Za-z0-9_]+\.cro$/u.test(entry.name)) continue;
    const fileKey = entry.name.toLowerCase();
    if (seenFiles.has(fileKey)) fail(`duplicate module ${entry.name}`);
    seenFiles.add(fileKey);
    if (!Number.isSafeInteger(entry.size) || entry.size <= 0 || entry.size > 0xffffffff) {
      fail(`invalid size for ${entry.name}`);
    }
    if (typeof entry.sha256 !== "string" || !/^[0-9a-fA-F]{64}$/u.test(entry.sha256)) {
      fail(`invalid SHA-256 for ${entry.name}`);
    }
    const name = `cro/${entry.name.slice(0, -4)}`;
    if (seenUnits.has(name)) fail(`duplicate unit ${name}`);
    seenUnits.add(name);
    // Explicit reconstruction is the privacy boundary: no input keys other
    // than the three reviewed scalar values can enter the public manifest.
    units.push({ name, size: entry.size, sha256: entry.sha256.toLowerCase() });
  }

  if (inventory.moduleCount !== undefined && inventory.moduleCount !== units.length) {
    fail(`input moduleCount ${inventory.moduleCount} does not match ${units.length} module entries`);
  }
  if (units.length !== expectedCount) fail(`expected ${expectedCount} modules, found ${units.length}`);
  units.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
  return { schemaVersion: 1, target, unitCount: units.length, units };
}

export function serializeCroUnitManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function parseArguments(argv) {
  const options = { check: false, input: undefined, output: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") options.check = true;
    else if (argument === "--input" || argument === "--output") {
      const value = argv[index + 1];
      if (!value) fail(`${argument} requires a path`);
      options[argument.slice(2)] = resolve(value);
      index += 1;
    } else fail(`unknown argument ${argument}`);
  }
  return options;
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const local = { ...loadEnv(join(root, ".env.local")), ...process.env };
  const input = options.input ?? (local.DECOMP_PRIVATE && join(local.DECOMP_PRIVATE, "cro-modules", "inventory.json"));
  const output = options.output ?? join(root, "progress", "units", `${DEFAULT_TARGET}.cro.json`);
  if (!input) fail("DECOMP_PRIVATE is required unless --input is supplied");
  const inventory = JSON.parse(readFileSync(input, "utf8"));
  const serialized = serializeCroUnitManifest(buildCroUnitManifest(inventory));
  if (options.check) {
    if (!existsSync(output) || readFileSync(output, "utf8") !== serialized) fail(`${output} is stale; regenerate it`);
    console.log(`Verified ${DEFAULT_UNIT_COUNT} public CRO units in ${output}`);
    return;
  }
  mkdirSync(dirname(output), { recursive: true });
  const temporary = `${output}.tmp-${process.pid}`;
  writeFileSync(temporary, serialized, { flag: "wx" });
  renameSync(temporary, output);
  console.log(`Wrote ${DEFAULT_UNIT_COUNT} public CRO units to ${output}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
