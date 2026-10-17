import {
  closeSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
} from "node:fs";
import { cpus } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const VERSION = "AS_EUR_REV2";
const EXPECTED_COUNT = 145;

function fail(message) {
  throw new Error(`CRO symbol batch: ${message}`);
}

export function readModuleManifest(path, expectedCount = EXPECTED_COUNT) {
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (manifest?.schemaVersion !== 1 || manifest?.target !== VERSION ||
      manifest?.unitCount !== expectedCount || !Array.isArray(manifest.units) ||
      manifest.units.length !== expectedCount) fail(`manifest must contain exactly ${expectedCount} units`);
  const modules = [];
  let previous = "";
  for (const unit of manifest.units) {
    const match = typeof unit?.name === "string" ? /^cro\/(Dll[A-Za-z0-9_]+)$/.exec(unit.name) : null;
    if (!match || unit.name <= previous) fail("manifest units are invalid, duplicated, or unsorted");
    previous = unit.name;
    modules.push(match[1]);
  }
  return modules;
}

export function verifyExactFileSet(directory, modules, extension) {
  if (!existsSync(directory)) fail(`${directory} does not exist`);
  const expected = modules.map((module) => `${module}${extension}`);
  const actual = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^Dll[A-Za-z0-9_]+\.[A-Za-z0-9]+$/.test(entry.name))
    .map((entry) => entry.name).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    const expectedSet = new Set(expected);
    const actualSet = new Set(actual);
    const missing = expected.filter((name) => !actualSet.has(name));
    const extra = actual.filter((name) => !expectedSet.has(name));
    fail(`file set mismatch (missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"})`);
  }
}

export function compareInventories(generated, published, modules) {
  verifyExactFileSet(generated, modules, ".csv");
  verifyExactFileSet(published, modules, ".csv");
  for (const module of modules) {
    if (!readFileSync(join(generated, `${module}.csv`)).equals(readFileSync(join(published, `${module}.csv`)))) {
      fail(`${module}.csv is stale`);
    }
  }
}

export function publishInventories(generated, published, modules) {
  verifyExactFileSet(generated, modules, ".csv");
  const parent = dirname(published);
  mkdirSync(parent, { recursive: true });
  const next = mkdtempSync(join(parent, ".cro.next-"));
  const backup = join(parent, `.cro.previous-${process.pid}-${Date.now()}`);
  let movedOld = false;
  try {
    for (const module of modules) copyFileSync(join(generated, `${module}.csv`), join(next, `${module}.csv`));
    verifyExactFileSet(next, modules, ".csv");
    if (existsSync(published)) {
      renameSync(published, backup);
      movedOld = true;
    }
    renameSync(next, published);
    if (movedOld) rmSync(backup, { recursive: true });
  } catch (error) {
    if (!existsSync(published) && movedOld && existsSync(backup)) renameSync(backup, published);
    if (existsSync(next)) rmSync(next, { recursive: true });
    throw error;
  }
}

export function compareArtifactSet(specifications, modules) {
  for (const specification of specifications) {
    verifyExactFileSet(specification.generated, modules, specification.extension);
    verifyExactFileSet(specification.published, modules, specification.extension);
    for (const module of modules) {
      const name = `${module}${specification.extension}`;
      if (!readFileSync(join(specification.generated, name)).equals(readFileSync(join(specification.published, name)))) {
        fail(`${name} is stale in ${specification.published}`);
      }
    }
  }
}

export function publishArtifactSet(specifications, modules, { remove = (path) => rmSync(path, { recursive: true }) } = {}) {
  const transaction = `${process.pid}-${Date.now()}`;
  const prepared = specifications.map((specification) => {
    verifyExactFileSet(specification.generated, modules, specification.extension);
    const parent = dirname(specification.published);
    mkdirSync(parent, { recursive: true });
    const next = mkdtempSync(join(parent, `.${specification.label}.next-`));
    for (const module of modules) {
      const name = `${module}${specification.extension}`;
      copyFileSync(join(specification.generated, name), join(next, name));
    }
    verifyExactFileSet(next, modules, specification.extension);
    return { ...specification, next, backup: join(parent, `.${specification.label}.previous-${transaction}`),
      movedOld: false, movedNew: false };
  });
  try {
    for (const item of prepared) {
      if (existsSync(item.published)) {
        renameSync(item.published, item.backup);
        item.movedOld = true;
      }
    }
    for (const item of prepared) {
      renameSync(item.next, item.published);
      item.movedNew = true;
    }
  } catch (error) {
    for (const item of prepared.toReversed()) {
      if (item.movedNew && existsSync(item.published)) rmSync(item.published, { recursive: true });
      if (item.movedOld && existsSync(item.backup)) renameSync(item.backup, item.published);
      if (existsSync(item.next)) rmSync(item.next, { recursive: true });
    }
    throw error;
  }
  const cleanupErrors = [];
  for (const item of prepared) {
    if (!item.movedOld) continue;
    try { remove(item.backup); }
    catch (error) { cleanupErrors.push(error); }
  }
  if (cleanupErrors.length > 0) {
    throw new AggregateError(cleanupErrors,
      "published CRO artifacts successfully, but could not remove one or more previous artifact backups");
  }
}

function envFile(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, "utf8").split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, "$2")];
    }));
}

function parseArguments(argv) {
  const options = { check: false, jobs: Math.min(4, cpus().length) };
  for (let index = 0; index < argv.length; index++) {
    if (argv[index] === "--check") options.check = true;
    else if (argv[index] === "--jobs") options.jobs = Number(argv[++index]);
    else fail(`unknown argument ${argv[index]}`);
  }
  if (!Number.isSafeInteger(options.jobs) || options.jobs < 1 || options.jobs > 16) fail("jobs must be an integer from 1 to 16");
  return options;
}

function findHeadless(environment) {
  if (environment.GHIDRA_HEADLESS && existsSync(environment.GHIDRA_HEADLESS)) return environment.GHIDRA_HEADLESS;
  const result = spawnSync("nix", ["build", "--no-link", "--print-out-paths", ".#ghidra"], {
    cwd: ROOT, encoding: "utf8",
  });
  if (result.status !== 0) fail(`unable to resolve Ghidra: ${result.stderr.trim()}`);
  const store = result.stdout.trim().split(/\r?\n/).at(-1);
  const find = spawnSync("find", [store, "-type", "f", "-path", "*/support/analyzeHeadless", "-print", "-quit"], {
    encoding: "utf8",
  });
  const headless = find.stdout.trim();
  if (find.status !== 0 || !headless) fail("Ghidra analyzeHeadless was not found");
  return headless;
}

async function analyzeAll(modules, options, environment, runRoot) {
  const output = join(runRoot, "output");
  const partitions = join(runRoot, "partitions");
  const targetSplit = join(runRoot, "target-split");
  const baseSplit = join(runRoot, "base-split");
  mkdirSync(output, { recursive: true });
  mkdirSync(partitions, { recursive: true });
  mkdirSync(targetSplit, { recursive: true });
  mkdirSync(baseSplit, { recursive: true });
  let cursor = 0;
  let completed = 0;
  let firstFailure;
  const worker = async () => {
    while (!firstFailure) {
      const index = cursor++;
      if (index >= modules.length) return;
      const module = modules[index];
      const moduleRoot = join(runRoot, "workers", module);
      const logPath = join(runRoot, "logs", `${module}.log`);
      mkdirSync(moduleRoot, { recursive: true });
      mkdirSync(dirname(logPath), { recursive: true });
      const log = openSync(logPath, "w", 0o600);
      const status = await new Promise((resolvePromise) => {
        const child = spawn("bash", [join(ROOT, "scripts", "analyze-cro-target.sh"), module,
          join(output, `${module}.csv`), join(partitions, `${module}.json`),
          join(targetSplit, `${module}.o`), join(baseSplit, `${module}.o`)], {
          cwd: ROOT,
          env: {
            ...environment,
            GHIDRA_HEADLESS: environment.GHIDRA_HEADLESS,
            CRO_GHIDRA_PROJECT_ROOT: join(moduleRoot, "project"),
            CRO_INVENTORY_STAGE: join(moduleRoot, "raw"),
          },
          stdio: ["ignore", log, log],
        });
        child.once("error", () => resolvePromise(-1));
        child.once("exit", (code) => resolvePromise(code ?? -1));
      });
      closeSync(log);
      if (status !== 0) {
        firstFailure = `${module} failed (log: ${logPath})`;
        return;
      }
      completed++;
      console.log(`[${completed}/${modules.length}] ${module}`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(options.jobs, modules.length) }, worker));
  if (firstFailure) fail(firstFailure);
  return { output, partitions, targetSplit, baseSplit };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const manifestPath = join(ROOT, "progress", "units", `${VERSION}.cro.json`);
  const modules = readModuleManifest(manifestPath);
  const targets = join(ROOT, "build", VERSION, "target", "cro");
  verifyExactFileSet(targets, modules, ".o");
  const environment = { ...envFile(join(ROOT, ".env.local")), ...process.env };
  if (!environment.DECOMP_PRIVATE) fail("DECOMP_PRIVATE is required");
  environment.GHIDRA_HEADLESS = findHeadless(environment);
  const batchRoot = join(environment.DECOMP_PRIVATE, "cro-ghidra-batch");
  mkdirSync(batchRoot, { recursive: true });
  const runRoot = mkdtempSync(join(batchRoot, "run-"));
  console.log(`Analyzing ${modules.length} CROs with ${options.jobs} worker(s).`);
  const generated = await analyzeAll(modules, options, environment, runRoot);
  verifyExactFileSet(generated.output, modules, ".csv");
  verifyExactFileSet(generated.partitions, modules, ".json");
  verifyExactFileSet(generated.targetSplit, modules, ".o");
  verifyExactFileSet(generated.baseSplit, modules, ".o");
  const specifications = [
    { label: "cro-symbols", generated: generated.output, published: join(ROOT, "symbols", "cro"), extension: ".csv" },
    { label: "cro-partitions", generated: generated.partitions, published: join(ROOT, "symbols", "cro-partitions"), extension: ".json" },
    { label: "cro-target-split", generated: generated.targetSplit,
      published: join(ROOT, "build", VERSION, "target", "cro-split"), extension: ".o" },
    { label: "cro-base-split", generated: generated.baseSplit,
      published: join(ROOT, "build", VERSION, "base", "cro-split"), extension: ".o" },
  ];
  if (options.check) {
    compareArtifactSet(specifications, modules);
    console.log(`Verified ${modules.length} deterministic CRO inventories and split object pairs.`);
  } else {
    publishArtifactSet(specifications, modules);
    console.log(`Published ${modules.length} CRO inventories and split object pairs transactionally.`);
  }
  rmSync(runRoot, { recursive: true });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
