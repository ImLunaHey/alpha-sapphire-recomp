import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { convertCroToElf } from "./generate-cro-target-object.mjs";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const DEFAULT_TARGET = "AS_EUR_REV2";
const DEFAULT_COUNT = 145;

function fail(message) {
  throw new Error(`CRO target batch: ${message}`);
}

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

function isInside(parent, candidate) {
  const path = relative(parent, candidate);
  return path === "" || (path !== ".." && !path.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`)
    && !isAbsolute(path));
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function readManifest(path, expectedTarget, expectedCount) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`cannot read public manifest: ${error.message}`);
  }
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) fail("public manifest must be an object");
  if (manifest.schemaVersion !== 1) fail("public manifest schemaVersion must be 1");
  if (manifest.target !== expectedTarget) fail(`public manifest target must be ${expectedTarget}`);
  if (!Array.isArray(manifest.units) || manifest.unitCount !== manifest.units.length) {
    fail("public manifest unitCount does not match its units array");
  }
  if (expectedCount !== undefined && manifest.units.length !== expectedCount) {
    fail(`expected ${expectedCount} public units, found ${manifest.units.length}`);
  }
  const seen = new Set();
  const records = manifest.units.map((unit) => {
    if (!unit || typeof unit !== "object" || Array.isArray(unit)) fail("public unit must be an object");
    if (Object.keys(unit).sort().join(",") !== "name,sha256,size") fail("public units may contain only name, size, and sha256");
    if (typeof unit.name !== "string" || !/^cro\/Dll[A-Za-z0-9_]+$/u.test(unit.name)) {
      fail(`invalid public unit name ${JSON.stringify(unit.name)}`);
    }
    const moduleName = unit.name.slice(4);
    if (seen.has(moduleName)) fail(`duplicate public unit ${unit.name}`);
    seen.add(moduleName);
    if (!Number.isSafeInteger(unit.size) || unit.size <= 0 || unit.size > 64 * 1024 * 1024) {
      fail(`invalid private size for ${unit.name}`);
    }
    if (typeof unit.sha256 !== "string" || !/^[0-9a-f]{64}$/u.test(unit.sha256)) {
      fail(`invalid SHA-256 for ${unit.name}`);
    }
    return { unitName: unit.name, moduleName, inputName: `${moduleName}.cro`, outputName: `${moduleName}.o`,
      size: unit.size, sha256: unit.sha256 };
  });
  records.sort((left, right) => left.moduleName < right.moduleName ? -1 : left.moduleName > right.moduleName ? 1 : 0);
  return records;
}

function verifyPrivateSet(privateDirectory, records) {
  const expected = new Set(records.map((record) => record.inputName));
  const actual = readdirSync(privateDirectory, { withFileTypes: true })
    .filter((entry) => entry.name.toLowerCase().endsWith(".cro"));
  for (const entry of actual) {
    if (!entry.isFile() || entry.isSymbolicLink()) fail(`private CRO is not a regular file: ${entry.name}`);
    if (!expected.has(entry.name)) fail(`unexpected private CRO: ${entry.name}`);
  }
  for (const record of records) {
    if (!actual.some((entry) => entry.name === record.inputName)) fail(`missing private CRO: ${record.inputName}`);
    readVerifiedCro(privateDirectory, record);
  }
}

function readVerifiedCro(privateDirectory, record) {
  const path = join(privateDirectory, record.inputName);
  const info = lstatSync(path);
  if (!info.isFile() || info.isSymbolicLink()) fail(`private CRO is not a regular file: ${record.inputName}`);
  if (info.size !== record.size) fail(`size mismatch for ${record.inputName}: expected ${record.size}, found ${info.size}`);
  const buffer = readFileSync(path);
  const actual = sha256(buffer);
  if (actual !== record.sha256) fail(`SHA-256 mismatch for ${record.inputName}`);
  return buffer;
}

function convertVerified(privateDirectory, record, convert) {
  const result = convert(readVerifiedCro(privateDirectory, record));
  if (!result || !result.parsed || !Buffer.isBuffer(result.elf)) fail(`converter returned an invalid result for ${record.inputName}`);
  // The retail DllEshop filename declares DllEShop internally. Treat ASCII
  // case as a filesystem spelling detail while still rejecting another name.
  if (typeof result.parsed.moduleName !== "string"
      || result.parsed.moduleName.toLowerCase() !== record.moduleName.toLowerCase()) {
    fail(`${record.inputName} declares module name ${JSON.stringify(result.parsed.moduleName)}`);
  }
  if (result.elf.length === 0) fail(`converter returned an empty object for ${record.inputName}`);
  return result.elf;
}

function verifyOutputSet(outputDirectory, records, privateDirectory, convert) {
  if (!existsSync(outputDirectory)) fail(`target directory is missing: ${outputDirectory}`);
  const info = lstatSync(outputDirectory);
  if (!info.isDirectory() || info.isSymbolicLink()) fail("target CRO output is not a regular directory");
  const expected = new Set(records.map((record) => record.outputName));
  const actual = readdirSync(outputDirectory, { withFileTypes: true });
  for (const entry of actual) {
    if (!entry.isFile() || entry.isSymbolicLink() || !expected.has(entry.name)) fail(`unexpected target output: ${entry.name}`);
  }
  for (const record of records) {
    if (!actual.some((entry) => entry.name === record.outputName)) fail(`missing target output: ${record.outputName}`);
    const expectedObject = convertVerified(privateDirectory, record, convert);
    const outputPath = join(outputDirectory, record.outputName);
    if (!readFileSync(outputPath).equals(expectedObject)) fail(`stale target output: ${record.outputName}`);
  }
}

function ensureOutputBoundary(outputDirectory, root) {
  if (outputDirectory === root) fail("target directory cannot be the repository root");
  if (isInside(root, outputDirectory)) {
    const ignored = spawnSync("git", ["check-ignore", "-q", "--no-index", "--", outputDirectory], { cwd: root });
    if (ignored.status !== 0) fail("target directory inside the repository must be ignored by Git");
  }
  if (existsSync(outputDirectory)) {
    const info = lstatSync(outputDirectory);
    if (!info.isDirectory() || info.isSymbolicLink()) fail("target CRO output is not a regular directory");
  }
}

function publishStage(stage, outputDirectory) {
  if (!existsSync(outputDirectory)) {
    renameSync(stage, outputDirectory);
    return;
  }
  const backup = `${outputDirectory}.backup-${process.pid}`;
  if (existsSync(backup)) fail(`refusing to replace existing batch backup ${backup}`);
  renameSync(outputDirectory, backup);
  try {
    renameSync(stage, outputDirectory);
  } catch (error) {
    renameSync(backup, outputDirectory);
    throw error;
  }
  rmSync(backup, { recursive: true });
}

// Check a private CRO directory against the public manifest without converting
// anything. The expected count defaults to the manifest's own unit count.
export function verifyPrivateCroModules(options) {
  const root = realpathSync(options.root ?? ROOT);
  const privateDirectory = realpathSync(resolve(options.privateDirectory));
  if (isInside(root, privateDirectory)) fail("private CRO directory must remain outside the repository");
  if (!statSync(privateDirectory).isDirectory()) fail("private CRO path is not a directory");
  const records = readManifest(realpathSync(resolve(options.manifestPath)), options.expectedTarget ?? DEFAULT_TARGET,
    options.expectedCount);
  verifyPrivateSet(privateDirectory, records);
  return records.length;
}

export function runCroTargetBatch(options) {
  const root = realpathSync(options.root ?? ROOT);
  const expectedTarget = options.expectedTarget ?? DEFAULT_TARGET;
  const expectedCount = options.expectedCount ?? DEFAULT_COUNT;
  const convert = options.convert ?? convertCroToElf;
  const manifestPath = realpathSync(resolve(options.manifestPath));
  const privateDirectory = realpathSync(resolve(options.privateDirectory));
  const outputDirectory = resolve(options.outputDirectory);
  if (isInside(root, privateDirectory)) fail("private CRO directory must remain outside the repository");
  if (!statSync(privateDirectory).isDirectory()) fail("private CRO path is not a directory");
  const records = readManifest(manifestPath, expectedTarget, expectedCount);
  verifyPrivateSet(privateDirectory, records);
  ensureOutputBoundary(outputDirectory, root);

  if (options.check) {
    verifyOutputSet(outputDirectory, records, privateDirectory, convert);
    return { checked: records.length, generated: 0, outputDirectory };
  }

  mkdirSync(dirname(outputDirectory), { recursive: true });
  const resolvedParent = realpathSync(dirname(outputDirectory));
  const safeOutput = join(resolvedParent, basename(outputDirectory));
  if (safeOutput !== outputDirectory) fail("target directory escapes its resolved parent");
  const stage = `${outputDirectory}.stage-${process.pid}`;
  if (existsSync(stage)) fail(`refusing to replace existing batch stage ${stage}`);
  mkdirSync(stage, { mode: 0o700 });
  try {
    for (const record of records) {
      const elf = convertVerified(privateDirectory, record, convert);
      writeFileSync(join(stage, record.outputName), elf, { flag: "wx", mode: 0o600 });
    }
    publishStage(stage, outputDirectory);
  } catch (error) {
    if (existsSync(stage)) rmSync(stage, { recursive: true });
    throw error;
  }
  return { checked: records.length, generated: records.length, outputDirectory };
}

function parseArguments(argv) {
  const options = { check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") options.check = true;
    else if (["--manifest", "--private-dir", "--output"].includes(argument)) {
      const value = argv[index + 1];
      if (!value) fail(`${argument} requires a path`);
      options[argument.slice(2).replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase())] = resolve(value);
      index += 1;
    } else fail(`unknown argument ${argument}`);
  }
  return options;
}

function main() {
  const cli = parseArguments(process.argv.slice(2));
  const local = { ...loadEnv(join(ROOT, ".env.local")), ...process.env };
  const manifestPath = cli.manifest ?? join(ROOT, "progress", "units", `${DEFAULT_TARGET}.cro.json`);
  const privateDirectory = cli.privateDir ?? (local.DECOMP_PRIVATE && join(local.DECOMP_PRIVATE, "cro-modules"));
  if (!privateDirectory) fail("DECOMP_PRIVATE is required unless --private-dir is supplied");
  const outputDirectory = cli.output ?? join(ROOT, "build", DEFAULT_TARGET, "target", "cro");
  const result = runCroTargetBatch({
    root: ROOT,
    expectedTarget: DEFAULT_TARGET,
    expectedCount: DEFAULT_COUNT,
    manifestPath,
    privateDirectory,
    outputDirectory,
    check: cli.check,
  });
  console.log(cli.check
    ? `Verified ${result.checked} deterministic CRO target objects in ${result.outputDirectory}`
    : `Generated ${result.generated} CRO target objects in ${result.outputDirectory}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
