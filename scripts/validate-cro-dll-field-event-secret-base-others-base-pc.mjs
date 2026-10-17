#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const UNIT = "DllFieldEventSecretBaseOthersBasePc";
const REPORT_UNIT = `cro/${UNIT}`;
const MAX_INPUT_SIZE = 64 * 1024 * 1024;
const EXPECTED_MANIFEST_SHA256 = "866c7c18bae59bb7351473565f0aeed18c35f48640c800e43f89f803a107aaa6";
const EXPECTED_PARTITION_IDENTITY = "c8a0a93c6c516e61a2b98f742d6d93b84fe4f76971e81d8afd30ce32fdbf2ab5";
const EXPECTED_REPORT_UNIT_IDENTITY = "61d0592687658f09c1ff892280b1571c783a7e3f6a5ec64d692b09878f84003b";
const DEFAULT_INPUTS = {
  config: join(ROOT, "config", "cro-sources.json"),
  inventory: join(ROOT, "symbols", "cro", `${UNIT}.csv`),
  partition: join(ROOT, "symbols", "cro-partitions", `${UNIT}.json`),
  manifest: join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json"),
  report: join(ROOT, "progress", "reports", "AS_EUR_REV2", "report.json"),
};

function fail(message) {
  throw new Error(`CRO ${UNIT} validation: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function exactKeys(value, expected, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join(",") === expected, `${label} has an invalid schema`);
}

function insideRoot(path) {
  const fromRoot = relative(ROOT, path);
  return fromRoot !== "" && fromRoot !== ".." && !fromRoot.startsWith(`..${sep}`) &&
    !isAbsolute(fromRoot);
}

function readText(path, label) {
  const absolute = resolve(path);
  check(insideRoot(absolute), `${label} must be a canonical path inside the repository root`);
  const parent = dirname(absolute);
  let parentReal;
  try {
    parentReal = realpathSync(parent);
  } catch (error) {
    fail(`${label} parent is unavailable: ${error.message}`);
  }
  check(parentReal === parent && insideRoot(parentReal),
    `${label} parent is not canonical inside the repository root`);
  let status;
  try {
    status = lstatSync(absolute);
  } catch (error) {
    fail(`${label} is unavailable: ${error.message}`);
  }
  check(status.isFile() && !status.isSymbolicLink(), `${label} is not a non-symlink regular file`);
  check(realpathSync(absolute) === absolute, `${label} path is not canonical`);
  check(status.size <= MAX_INPUT_SIZE, `${label} exceeds the 64 MiB input limit`);
  return readFileSync(absolute, "utf8");
}

function rejectDuplicateJsonKeys(text, label) {
  let cursor = 0;
  const skipWhitespace = () => {
    while (cursor < text.length && /\s/u.test(text[cursor])) cursor += 1;
  };
  const parseString = () => {
    check(text[cursor] === '"', `${label} contains malformed JSON`);
    const start = cursor;
    cursor += 1;
    while (cursor < text.length) {
      if (text[cursor] === "\\") {
        cursor += 2;
      } else if (text[cursor] === '"') {
        cursor += 1;
        try {
          return JSON.parse(text.slice(start, cursor));
        } catch (error) {
          fail(`${label} contains an invalid JSON string: ${error.message}`);
        }
      } else {
        cursor += 1;
      }
    }
    fail(`${label} contains an unterminated JSON string`);
  };
  const parseValue = () => {
    skipWhitespace();
    if (text[cursor] === "{") {
      cursor += 1;
      skipWhitespace();
      const keys = new Set();
      if (text[cursor] === "}") {
        cursor += 1;
        return;
      }
      while (cursor < text.length) {
        skipWhitespace();
        const key = parseString();
        check(!keys.has(key), `${label} contains duplicate JSON key ${JSON.stringify(key)}`);
        keys.add(key);
        skipWhitespace();
        check(text[cursor] === ":", `${label} contains malformed JSON`);
        cursor += 1;
        parseValue();
        skipWhitespace();
        if (text[cursor] === "}") {
          cursor += 1;
          return;
        }
        check(text[cursor] === ",", `${label} contains malformed JSON`);
        cursor += 1;
      }
      fail(`${label} contains an unterminated JSON object`);
    }
    if (text[cursor] === "[") {
      cursor += 1;
      skipWhitespace();
      if (text[cursor] === "]") {
        cursor += 1;
        return;
      }
      while (cursor < text.length) {
        parseValue();
        skipWhitespace();
        if (text[cursor] === "]") {
          cursor += 1;
          return;
        }
        check(text[cursor] === ",", `${label} contains malformed JSON`);
        cursor += 1;
      }
      fail(`${label} contains an unterminated JSON array`);
    }
    if (text[cursor] === '"') {
      parseString();
      return;
    }
    const start = cursor;
    while (cursor < text.length && !/[\s,\]}]/u.test(text[cursor])) cursor += 1;
    check(cursor > start, `${label} contains malformed JSON`);
  };
  parseValue();
  skipWhitespace();
  check(cursor === text.length, `${label} contains trailing JSON content`);
}

function readJson(path, label) {
  const text = readText(path, label);
  rejectDuplicateJsonKeys(text, label);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function identity(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function parseArguments(argv) {
  if (argv.length === 0) return { inputs: DEFAULT_INPUTS, selfTest: false };
  if (argv.length === 1 && argv[0] === "--self-test") return { inputs: DEFAULT_INPUTS, selfTest: true };
  check(argv.length === 2 && argv[0] === "--report" && argv[1].length > 0 && !argv[1].includes("\0"),
    "usage: validate-cro-dll-field-event-secret-base-others-base-pc.mjs [--self-test | --report <path>]");
  return { inputs: { ...DEFAULT_INPUTS, report: resolve(argv[1]) }, selfTest: false };
}

function validatePublicContract(inputs) {
  const config = readJson(inputs.config, "config/cro-sources.json");
  exactKeys(config, "schemaVersion,units", "CRO source config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "CRO source config is invalid");
  check(!config.units.some((entry) => entry?.name === UNIT),
    `${UNIT} must remain absent from the source registry without an approved implementation handoff`);

  const expectedInventory = [
    "# Format,CRO_FUNCTIONS_V1",
    `# Module,${REPORT_UNIT}`,
    "# TextSize,00001D70",
    "Location,Name,Namespace,Mode,Size,Segment",
    "",
  ].join("\n");
  check(readText(inputs.inventory, `${UNIT} inventory`) === expectedInventory,
    "public inventory must retain its exact header and zero accepted function rows");

  const partition = readJson(inputs.partition, `${UNIT} partition`);
  exactKeys(partition, "format,functions,gaps,module,pools,textSize,unknown", `${UNIT} partition`);
  check(identity(partition) === EXPECTED_PARTITION_IDENTITY,
    "partition reviewed function and range identity changed");
  check(partition.format === 1 && partition.module === UNIT && partition.textSize === 7536 &&
    Array.isArray(partition.functions) && partition.functions.length === 0,
  "partition identity, text size, or exact zero-function inventory changed");

  const manifest = readJson(inputs.manifest, "public CRO manifest");
  exactKeys(manifest, "schemaVersion,target,unitCount,units", "public CRO manifest");
  check(manifest.schemaVersion === 1 && manifest.target === "AS_EUR_REV2" &&
    Number.isSafeInteger(manifest.unitCount) && manifest.unitCount === manifest.units?.length,
  "public CRO manifest identity or accounting changed");
  const units = manifest.units.filter((entry) => entry?.name === REPORT_UNIT);
  check(units.length === 1, `public CRO manifest must contain exactly one ${REPORT_UNIT} unit`);
  exactKeys(units[0], "name,sha256,size", `${REPORT_UNIT} manifest entry`);
  check(units[0].name === REPORT_UNIT && units[0].size === 16384 &&
    units[0].sha256 === EXPECTED_MANIFEST_SHA256, "public unit identity, size, or reviewed SHA-256 changed");
}

function validateReport(path) {
  const report = readJson(path, "objdiff report");
  const units = report.units?.filter((entry) => entry?.name === REPORT_UNIT) ?? [];
  check(units.length === 1, `report must contain exactly one ${REPORT_UNIT} unit`);
  const unit = units[0];
  check(identity(unit) === EXPECTED_REPORT_UNIT_IDENTITY,
    "report reviewed function, section, or range identity changed");
  exactKeys(unit, "measures,metadata,name,sections", "report unit");
  exactKeys(unit.metadata, "complete", "report metadata");
  check(unit.name === REPORT_UNIT && unit.metadata.complete === false && !("source_path" in unit.metadata),
    "report identity or completion metadata is not fail-closed");
  exactKeys(unit.measures,
    "complete_code_percent,fuzzy_match_percent,matched_code_percent,matched_functions_percent,total_data,total_units",
    "report measures");
  check(unit.measures.fuzzy_match_percent === 0 && unit.measures.matched_code_percent === 0 &&
    unit.measures.matched_functions_percent === 0 && unit.measures.complete_code_percent === 0 &&
    unit.measures.total_data === "892" && unit.measures.total_units === 1,
  "report accounting changed or unexpected code/function credit appeared");
  check(!Object.hasOwn(unit, "functions"), "zero-function report unit gained a function inventory");
}

function validateInputs(inputs) {
  validatePublicContract(inputs);
  validateReport(inputs.report);
}

function writeFixture(directory, inputs = DEFAULT_INPUTS) {
  mkdirSync(directory, { recursive: true });
  const fixture = {};
  for (const [name, source] of Object.entries(inputs)) {
    const destination = join(directory, `${name}${name === "inventory" ? ".csv" : ".json"}`);
    writeFileSync(destination, readText(source, `fixture source ${name}`));
    fixture[name] = destination;
  }
  return fixture;
}

function expectReject(label, action) {
  let rejected = false;
  try {
    action();
  } catch {
    rejected = true;
  }
  check(rejected, `self-test accepted ${label}`);
}

function runSelfTest() {
  const build = join(ROOT, "build");
  mkdirSync(build, { recursive: true });
  const testRoot = mkdtempSync(join(build, ".others-base-pc-validator-"));
  const outsideRoot = mkdtempSync(join(tmpdir(), "others-base-pc-validator-"));
  try {
    const baseline = writeFixture(join(testRoot, "baseline"));
    validateInputs(baseline);

    const symlinkPath = join(testRoot, "report-symlink.json");
    symlinkSync(baseline.report, symlinkPath);
    expectReject("a symlinked report", () => validateInputs({ ...baseline, report: symlinkPath }));

    const outsideReport = join(outsideRoot, "report.json");
    writeFileSync(outsideReport, readText(DEFAULT_INPUTS.report, "outside-report fixture source"));
    expectReject("an outside-root report", () => validateInputs({ ...baseline, report: outsideReport }));

    const duplicate = writeFixture(join(testRoot, "duplicate"));
    const reportText = readText(duplicate.report, "duplicate-key report fixture");
    writeFileSync(duplicate.report, reportText.replace("{", '{"version":2,'));
    expectReject("a duplicate JSON key", () => validateInputs(duplicate));

    const manifestMutation = writeFixture(join(testRoot, "manifest"));
    const manifest = readJson(manifestMutation.manifest, "manifest mutation fixture");
    manifest.units.find((entry) => entry.name === REPORT_UNIT).sha256 = "0".repeat(64);
    writeFileSync(manifestMutation.manifest, JSON.stringify(manifest));
    expectReject("a manifest identity mutation", () => validateInputs(manifestMutation));

    const coordinated = writeFixture(join(testRoot, "coordinated"));
    const partition = readJson(coordinated.partition, "coordinated partition fixture");
    partition.gaps[0].size = 3;
    partition.pools[0].address = 3;
    partition.pools[0].size = 5;
    partition.gaps[1].size = 5;
    partition.pools[1].address = 13;
    partition.pools[1].size = 3;
    writeFileSync(coordinated.partition, JSON.stringify(partition));
    const report = readJson(coordinated.report, "coordinated report fixture");
    const reportUnit = report.units.find((entry) => entry.name === REPORT_UNIT);
    reportUnit.sections.find((entry) => entry.name === ".bss").size = "4";
    reportUnit.sections.find((entry) => entry.name === ".data").size = "40";
    writeFileSync(coordinated.report, JSON.stringify(report));
    expectReject("coordinated partition/report identity mutations", () => validateInputs(coordinated));

    console.log(`Validated ${REPORT_UNIT} hostile inputs: symlink, outside-root, duplicate key, ` +
      "manifest identity, and coordinated partition/report mutations rejected.");
  } finally {
    rmSync(testRoot, { recursive: true, force: true });
    rmSync(outsideRoot, { recursive: true, force: true });
  }
}

try {
  const options = parseArguments(process.argv.slice(2));
  validateInputs(options.inputs);
  if (options.selfTest) runSelfTest();
  console.log(`Validated ${REPORT_UNIT}: exact zero-function inventory and zero credit; completion remains false.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
