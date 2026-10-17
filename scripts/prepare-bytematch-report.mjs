#!/usr/bin/env node

import {
  closeSync, constants, existsSync, fstatSync, fsyncSync, lstatSync, openSync,
  readFileSync, readlinkSync, readdirSync, renameSync, unlinkSync, writeSync,
} from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePublicCroMetadataTree } from "./validate-public-cro-metadata.mjs";
import { validatePublicationTree } from "./validate-publication-integrity.mjs";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const CRO_UNIT_PATTERN = /^cro\/(Dll[A-Za-z0-9_]+)$/;
const FUNCTION_PATTERN = /^func_[0-9A-Fa-f]+$/;
const DECIMAL_PATTERN = /^\d+$/;
const CREDIT_FIELD_PATTERN = /^(?:fuzzy_match_percent|matched_(?:code|data|functions)(?:_percent)?|complete_(?:code|data)(?:_percent)?)$/;
const VACUOUS_ZERO_FUNCTION_PERCENTAGES = new Set([
  "fuzzy_match_percent",
  "matched_code_percent",
  "matched_functions_percent",
  "complete_code_percent",
]);
const PERCENT_DECIMAL_TOLERANCE = 0.000005;
const STAT = Object.freeze({ bigint: true });
let temporarySequence = 0;

function fail(message) {
  throw new Error(`ByteMatch report validation failed: ${message}`);
}

function numeric(value, context) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && DECIMAL_PATTERN.test(value)) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  fail(`${context} is not a finite non-negative number`);
}

const directoryIdentity = stat => [stat.dev, stat.ino, stat.mode, stat.uid, stat.gid, stat.rdev];
const leafIdentity = stat => [stat.dev, stat.ino, stat.mode, stat.nlink, stat.uid, stat.gid,
  stat.rdev, stat.size, stat.blocks, stat.mtimeNs, stat.ctimeNs];
function sameIdentity(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
function lstatMaybe(path) {
  try { return lstatSync(path, STAT); } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

export function writeAtomicPublication(rootPath, outputPath, bytes) {
  const rootAbsolute = resolve(rootPath), outputAbsolute = resolve(outputPath);
  const relativeOutput = relative(rootAbsolute, outputAbsolute);
  if (rootAbsolute !== rootPath || !relativeOutput || relativeOutput === ".."
      || relativeOutput.startsWith("../") || relativeOutput.includes("\\")) {
    fail("output path is outside the canonical repository root");
  }
  const parts = relativeOutput.split("/");
  if (parts.some(part => !part || part === "." || part === "..")) fail("output path is noncanonical");
  const directories = [];
  let temporaryFd, temporaryPath, renamed = false;
  try {
    if (process.platform !== "linux" || !constants.O_NOFOLLOW || !constants.O_DIRECTORY)
      fail("safe report publication is unavailable");
    const rootStat = lstatSync(rootAbsolute, STAT);
    if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) fail("unsafe publication root");
    let parent = openSync(rootAbsolute, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
    directories.push({ fd: parent, identity: directoryIdentity(rootStat), path: rootAbsolute });
    let canonicalParent = rootAbsolute;
    for (const part of parts.slice(0, -1)) {
      const candidate = `/proc/self/fd/${parent}/${part}`, before = lstatSync(candidate, STAT);
      if (!before.isDirectory() || before.isSymbolicLink()) fail("unsafe publication parent");
      parent = openSync(candidate, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
      canonicalParent = join(canonicalParent, part);
      directories.push({ fd: parent, identity: directoryIdentity(before), path: canonicalParent });
    }
    const verifyParents = () => {
      for (const directory of directories) {
        if (!sameIdentity(directoryIdentity(fstatSync(directory.fd, STAT)), directory.identity)
            || readlinkSync(`/proc/self/fd/${directory.fd}`) !== directory.path) {
          fail("publication parent changed");
        }
      }
    };
    verifyParents();
    const name = parts.at(-1), targetPath = `/proc/self/fd/${parent}/${name}`;
    const targetBefore = lstatMaybe(targetPath);
    if (targetBefore && (!targetBefore.isFile() || targetBefore.isSymbolicLink() || targetBefore.nlink !== 1n))
      fail("unsafe existing report output");
    for (let attempt = 0; attempt < 16 && temporaryFd === undefined; attempt++) {
      const temporaryName = `.${name}.tmp-${process.pid}-${temporarySequence++}`;
      temporaryPath = `/proc/self/fd/${parent}/${temporaryName}`;
      try {
        temporaryFd = openSync(temporaryPath, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL
          | constants.O_NOFOLLOW, 0o644);
      } catch (error) {
        if (error?.code !== "EEXIST") throw error;
      }
    }
    if (temporaryFd === undefined) fail("unable to reserve report output");
    const opened = fstatSync(temporaryFd, STAT);
    if (!opened.isFile() || opened.isSymbolicLink() || opened.nlink !== 1n
        || readlinkSync(`/proc/self/fd/${temporaryFd}`) !== join(canonicalParent, temporaryPath.split("/").at(-1)))
      fail("unsafe temporary report output");
    let written = 0;
    while (written < bytes.length) written += writeSync(temporaryFd, bytes, written, bytes.length - written);
    fsyncSync(temporaryFd);
    const complete = fstatSync(temporaryFd, STAT);
    if (!sameIdentity([opened.dev, opened.ino], [complete.dev, complete.ino])
        || !complete.isFile() || complete.nlink !== 1n || complete.size !== BigInt(bytes.length))
      fail("temporary report output changed");
    verifyParents();
    const targetNow = lstatMaybe(targetPath);
    if ((targetBefore === null) !== (targetNow === null)
        || (targetBefore && !sameIdentity(leafIdentity(targetBefore), leafIdentity(targetNow))))
      fail("report output changed before publication");
    renameSync(temporaryPath, targetPath);
    renamed = true;
    const published = lstatSync(targetPath, STAT);
    if (!published.isFile() || published.isSymbolicLink() || published.nlink !== 1n
        || published.dev !== complete.dev || published.ino !== complete.ino
        || published.size !== BigInt(bytes.length)
        || readlinkSync(`/proc/self/fd/${temporaryFd}`) !== outputAbsolute)
      fail("published report output is unsafe");
    verifyParents();
    fsyncSync(parent);
  } catch (error) {
    if (error?.message?.startsWith("ByteMatch report validation failed:")) throw error;
    fail(`safe report publication failed: ${error.message}`);
  } finally {
    if (!renamed && temporaryFd !== undefined && temporaryPath) {
      try {
        const opened = fstatSync(temporaryFd, STAT), current = lstatMaybe(temporaryPath);
        if (current && current.dev === opened.dev && current.ino === opened.ino) unlinkSync(temporaryPath);
      } catch { /* The reserved path is already absent or no longer ours. */ }
    }
    if (temporaryFd !== undefined) closeSync(temporaryFd);
    for (const directory of directories.reverse()) closeSync(directory.fd);
  }
}

function readCroManifest(path) {
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.units)
      || manifest.unitCount !== manifest.units.length) {
    fail("unexpected CRO unit manifest shape");
  }
  return manifest;
}

function readCroCsvFiles(directory) {
  const files = new Map();
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.name.endsWith(".csv")) continue;
    if (!entry.isFile()) fail(`${entry.name} is not a regular CRO inventory file`);
    const stem = basename(entry.name, ".csv");
    if (files.has(stem)) fail(`duplicate CRO inventory ${stem}`);
    files.set(stem, readFileSync(join(directory, entry.name), "utf8"));
  }
  return files;
}

function readCroSourceClaims(path) {
  const config = JSON.parse(readFileSync(path, "utf8"));
  if (config?.schemaVersion !== 1 || !Array.isArray(config.units)
      || Object.keys(config).sort().join(",") !== "schemaVersion,units") {
    fail("unexpected authored CRO source configuration shape");
  }
  const claims = new Map();
  for (const unit of config.units) {
    if (!unit || Object.keys(unit).sort().join(",") !== "functions,name,sources"
        || !/^Dll[A-Za-z0-9_]+$/.test(unit.name) || claims.has(unit.name)
        || !Array.isArray(unit.sources) || unit.sources.length === 0
        || !Array.isArray(unit.functions) || unit.functions.length === 0) {
      fail("authored CRO source configuration contains an invalid or duplicate unit");
    }
    const functions = new Map();
    for (const fn of unit.functions) {
      if (!fn || !FUNCTION_PATTERN.test(fn.name) || !Number.isInteger(fn.address)
          || fn.address < 0 || !Number.isInteger(fn.size) || fn.size <= 0
          || functions.has(fn.name)) {
        fail(`authored CRO source configuration contains an invalid claim for ${unit.name}`);
      }
      functions.set(fn.name, { address: fn.address, size: fn.size });
    }
    claims.set(unit.name, functions);
  }
  return claims;
}

function parseCroCsvFunctions(text, stem) {
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === "") lines.pop();
  if (lines.length < 4 || lines[1] !== `# Module,cro/${stem}`
      || lines[3] !== "Location,Name,Namespace,Mode,Size,Segment") {
    fail(`${stem}.csv has an unexpected public inventory header`);
  }
  return lines.slice(4).map((line, index) => {
    const match = /^[0-9A-F]{8},"(func_[0-9A-F]{8})","Global",(?:\$a|\$t),([0-9A-F]{8}),"\.text"$/.exec(line);
    if (!match) fail(`${stem}.csv line ${index + 5} is not canonical neutral function metadata`);
    return { name: match[1], size: Number.parseInt(match[2], 16) };
  });
}

function assertNoCroCredit(value, context, allowedVacuous = new Set()) {
  if (!value || typeof value !== "object") return;
  for (const [key, raw] of Object.entries(value)) {
    if (!CREDIT_FIELD_PATTERN.test(key)) continue;
    const amount = numeric(raw, `${context}.${key}`);
    if (amount !== 0 && !(amount === 100 && allowedVacuous.has(key))) {
      fail(`${context}.${key} grants ${amount} credit to an incomplete CRO unit`);
    }
  }
}

function normalizeZeroFunctionCro(unit) {
  for (const key of VACUOUS_ZERO_FUNCTION_PERCENTAGES) {
    if (Object.hasOwn(unit.measures, key)
        && numeric(unit.measures[key], `${unit.name}.measures.${key}`) === 100) unit.measures[key] = 0;
  }
}

export function validateAndNormalizeReport({ report, project, manifest, csvFiles, croClaims = new Map() }) {
  const measures = report?.measures;
  const units = report?.units;
  const expected = project?.progress;
  if (report?.version !== 2 || !measures || !Array.isArray(units) || !expected) {
    fail("unexpected objdiff report shape or project metadata");
  }
  if (measures.matched_code_percent !== expected.matchedCodePercent
      || measures.matched_functions !== expected.matchedFunctions
      || measures.total_functions !== expected.totalFunctions
      || measures.total_units !== expected.totalUnits
      || units.length !== expected.totalUnits) {
    fail("report measures do not match progress/project.json");
  }

  const expectedNames = new Set(["main/code"]);
  if (!(croClaims instanceof Map)) fail("authored CRO claims are not a map");
  for (const entry of manifest.units) {
    if (!entry || typeof entry.name !== "string" || !CRO_UNIT_PATTERN.test(entry.name)
        || expectedNames.has(entry.name)) fail("CRO manifest contains an invalid or duplicate unit name");
    expectedNames.add(entry.name);
  }
  for (const stem of croClaims.keys()) {
    if (!expectedNames.has(`cro/${stem}`)) fail(`authored CRO source unit ${stem} is not in the manifest`);
  }
  if (manifest.unitCount !== manifest.units.length || expectedNames.size !== manifest.unitCount + 1) {
    fail("CRO manifest count is inconsistent");
  }
  if (units.length !== expectedNames.size) fail("report does not contain the exact published unit count");
  const byName = new Map();
  for (const unit of units) {
    if (!unit || typeof unit.name !== "string" || byName.has(unit.name)) {
      fail("report unit names are missing or duplicated");
    }
    byName.set(unit.name, unit);
  }
  const actualNames = [...byName.keys()].sort();
  const wantedNames = [...expectedNames].sort();
  if (JSON.stringify(actualNames) !== JSON.stringify(wantedNames)) {
    fail("report unit names do not exactly match main/code plus the CRO manifest");
  }
  if (JSON.stringify(byName.get("main/code").metadata) !==
      JSON.stringify({ complete: false, source_path: "src/main" })) {
    fail("main/code must publish its src/main source directory");
  }

  const functions = units.flatMap((unit) => unit.functions ?? []);
  if (functions.length !== expected.totalFunctions
      || functions.some((fn) => !FUNCTION_PATTERN.test(fn.name)
        || !DECIMAL_PATTERN.test(fn.size) || !DECIMAL_PATTERN.test(fn.address)
        || Object.keys(fn.metadata ?? {}).length !== 0)) {
    fail("function inventory is incomplete or contains unexpected metadata");
  }

  if (!(csvFiles instanceof Map) || csvFiles.size !== manifest.unitCount) {
    fail("public CRO inventory set does not match the manifest count");
  }
  for (const entry of manifest.units) {
    const stem = CRO_UNIT_PATTERN.exec(entry.name)[1], unit = byName.get(entry.name);
    if (!csvFiles.has(stem)) fail(`${entry.name} has no public CSV inventory`);
    const expectedMetadata = {
      complete: false,
      ...(croClaims.has(stem) ? { source_path: `src/cro/${stem}` } : {}),
    };
    if (JSON.stringify(unit.metadata) !== JSON.stringify(expectedMetadata)) {
      fail(`${entry.name} must remain explicitly incomplete and publish only an authored source path`);
    }
    const csvFunctions = parseCroCsvFunctions(csvFiles.get(stem), stem);
    const reportFunctions = unit.functions ?? [];
    if (reportFunctions.length !== csvFunctions.length
        || numeric(unit.measures?.total_functions ?? 0, `${entry.name}.total_functions`) !== csvFunctions.length) {
      fail(`${entry.name} function count differs from its public CSV inventory`);
    }
    const csvByName = new Map(csvFunctions.map((fn) => [fn.name, fn]));
    const reportNames = new Set(reportFunctions.map((fn) => fn.name));
    if (csvByName.size !== csvFunctions.length || reportNames.size !== reportFunctions.length
        || JSON.stringify([...reportNames].sort()) !== JSON.stringify([...csvByName.keys()].sort())
        || reportFunctions.some((fn) => {
      const csv = csvByName.get(fn.name);
      return !csv || numeric(fn.size, `${entry.name}.${fn.name}.size`) !== csv.size;
    })) fail(`${entry.name} function names or sizes differ from its public CSV inventory`);
    const codeBytes = csvFunctions.reduce((sum, fn) => sum + fn.size, 0);
    if (numeric(unit.measures?.total_code ?? 0, `${entry.name}.total_code`) !== codeBytes) {
      fail(`${entry.name} total code differs from its accepted public function bytes`);
    }

    const zeroFunctionUnit = csvFunctions.length === 0;
    const claims = croClaims.get(stem) ?? new Map();
    let claimedBytes = 0;
    for (const [name, claim] of claims) {
      const csv = csvByName.get(name);
      if (!csv || csv.size !== claim.size) fail(`${entry.name}/${name} claim differs from its public CSV boundary`);
      claimedBytes += claim.size;
    }
    const matchedCode = numeric(unit.measures?.matched_code ?? 0, `${entry.name}.matched_code`);
    const matchedFunctions = numeric(unit.measures?.matched_functions ?? 0, `${entry.name}.matched_functions`);
    const matchedData = numeric(unit.measures?.matched_data ?? 0, `${entry.name}.matched_data`);
    if (matchedCode !== claimedBytes || matchedFunctions !== claims.size || matchedData !== 0) {
      fail(`${entry.name} credit differs from its explicitly authored CRO claims`);
    }
    for (const section of unit.sections ?? []) {
      if (section.name !== ".text") assertNoCroCredit(section, `${entry.name}.${section.name ?? "section"}`);
      else if (numeric(section.matched_data ?? 0, `${entry.name}.text.matched_data`) !== 0) {
        fail(`${entry.name}.text grants matched-data credit`);
      }
    }
    for (const fn of reportFunctions) {
      if (claims.has(fn.name)) {
        if (numeric(fn.fuzzy_match_percent ?? 0, `${entry.name}.${fn.name}.fuzzy_match_percent`) !== 100) {
          fail(`${entry.name}/${fn.name} is claimed but is not an exact objdiff match`);
        }
        assertNoCroCredit(fn, `${entry.name}.${fn.name}`, new Set(["fuzzy_match_percent"]));
      } else {
        assertNoCroCredit(fn, `${entry.name}.${fn.name}`);
      }
    }
    if (claims.size === 0) {
      assertNoCroCredit(unit.measures, `${entry.name}.measures`,
        zeroFunctionUnit ? VACUOUS_ZERO_FUNCTION_PERCENTAGES : new Set());
    }
    const actualMatchedCodePercent = numeric(unit.measures?.matched_code_percent ?? 0,
      `${entry.name}.matched_code_percent`);
    // objdiff computes percentages through a 32-bit float, then serializes a
    // shortened decimal. Allow at most half a unit at its observed sixth
    // decimal place; materially different credit still fails closed.
    const expectedMatchedCodePercent = Math.fround(claimedBytes * 100 / codeBytes);
    if (claims.size > 0
        && Math.abs(actualMatchedCodePercent - expectedMatchedCodePercent) > PERCENT_DECIMAL_TOLERANCE) {
      fail(`${entry.name} matched-code percentage differs from its authored claims`);
    }
    if (zeroFunctionUnit) normalizeZeroFunctionCro(unit);
  }
  for (const stem of csvFiles.keys()) {
    if (!expectedNames.has(`cro/${stem}`)) fail(`public CSV inventory ${stem} is not in the manifest`);
  }

  const serialized = JSON.stringify(report).toLowerCase();
  const forbidden = [".3ds", ".cia", ".cxi", ".ncch", "baserom", "/private/", "/extracted/"];
  if (forbidden.some((value) => serialized.includes(value))) {
    fail("report contains a forbidden proprietary path marker");
  }
  return report;
}

export function prepareReport({ rootPath = root, update = false, afterValidation } = {}) {
  rootPath = resolve(rootPath);
  const project = JSON.parse(readFileSync(join(rootPath, "progress", "project.json"), "utf8"));
  const snapshot = join(rootPath, "progress", "reports", project.version, "report.json");
  const generated = join(rootPath, "build", project.version, "report.json");
  const input = update ? generated : snapshot;
  const output = update ? snapshot : generated;
  if (!existsSync(input)) fail(`${input} does not exist`);

  const validated = validatePublicationTree({ root: rootPath, reportInput: relative(rootPath, input) });
  if (afterValidation !== undefined) {
    if (typeof afterValidation !== "function") fail("invalid post-validation test hook");
    afterValidation();
  }
  validatePublicCroMetadataTree(rootPath, { requireComplete: true });
  const manifest = readCroManifest(join(rootPath, "progress", "units", `${project.version}.cro.json`));
  const report = validated.report;
  validateAndNormalizeReport({ report, project, manifest,
    csvFiles: readCroCsvFiles(join(rootPath, "symbols", "cro")),
    croClaims: readCroSourceClaims(join(rootPath, "config", "cro-sources.json")) });

  // Keep the checked-in snapshot compact: reports contain tens of thousands of
  // function records and formatting adds substantial repository churn.
  writeAtomicPublication(rootPath, output, Buffer.from(JSON.stringify(report)));
  console.log(`${update ? "Updated" : "Prepared"} ${output} from a validated objdiff report.`);
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).some((argument) => argument !== "--update"))
      fail("usage: prepare-bytematch-report.mjs [--update]");
    prepareReport({ update: process.argv.includes("--update") });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
