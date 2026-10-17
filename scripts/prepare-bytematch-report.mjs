#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePublicCroMetadataTree } from "./validate-public-cro-metadata.mjs";

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
const PERCENT_TOLERANCE = 0.000001;

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
    if (JSON.stringify(unit.metadata) !== JSON.stringify({ complete: false })) {
      fail(`${entry.name} must remain explicitly incomplete`);
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
    // objdiff computes percentages through a 32-bit float before JSON
    // serialization, so compare against that representation rather than a
    // separately decimal-rounded value.
    const expectedMatchedCodePercent = Math.fround(claimedBytes * 100 / codeBytes);
    if (claims.size > 0
        && Math.abs(actualMatchedCodePercent - expectedMatchedCodePercent) > PERCENT_TOLERANCE) {
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

function main() {
  const project = JSON.parse(readFileSync(join(root, "progress", "project.json"), "utf8"));
  const snapshot = join(root, "progress", "reports", project.version, "report.json");
  const generated = join(root, "build", project.version, "report.json");
  const update = process.argv.includes("--update");
  if (process.argv.slice(2).some((argument) => argument !== "--update")) {
    fail("usage: prepare-bytematch-report.mjs [--update]");
  }
  const input = update ? generated : snapshot;
  const output = update ? snapshot : generated;
  if (!existsSync(input)) fail(`${input} does not exist`);

  validatePublicCroMetadataTree(root, { requireComplete: true });
  const manifest = readCroManifest(join(root, "progress", "units", `${project.version}.cro.json`));
  const report = JSON.parse(readFileSync(input, "utf8"));
  validateAndNormalizeReport({ report, project, manifest,
    csvFiles: readCroCsvFiles(join(root, "symbols", "cro")),
    croClaims: readCroSourceClaims(join(root, "config", "cro-sources.json")) });

  mkdirSync(dirname(output), { recursive: true });
  // Keep the checked-in snapshot compact: reports contain tens of thousands of
  // function records and formatting adds substantial repository churn.
  writeFileSync(output, JSON.stringify(report));
  console.log(`${update ? "Updated" : "Prepared"} ${output} from a validated objdiff report.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
