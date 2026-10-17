#!/usr/bin/env node

// Public quarantine accounting only. Never reads source contents or build inputs.
import { closeSync, constants, fstatSync, lstatSync, openSync, readFileSync,
  readdirSync, realpathSync, linkSync, mkdtempSync, mkdirSync, renameSync, writeFileSync,
  symlinkSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { validatePublicCroMetadata } from "./validate-public-cro-metadata.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UNIT = "cro/DllHologramMail";
const STEM = "DllHologramMail";
const PATHS = Object.freeze({
  report: "progress/reports/AS_EUR_REV2/report.json",
  project: "progress/project.json",
  config: "config/cro-sources.json",
  manifest: "progress/units/AS_EUR_REV2.cro.json",
  csv: "symbols/cro/DllHologramMail.csv",
  partition: "symbols/cro-partitions/DllHologramMail.json",
  blocker: "docs/specs/cro/DllHologramMail_blocker.md",
});
const NEUTRAL_HASHES = Object.freeze({
  csv: "ad44c386a905a9d032ea92dce301b6799933bb5f3ff52a797f16a21e58527a1c",
  partition: "b145cfddfc8b517b02dd28173e40d5f92e5774f7608daf72f0e51698bfb2e964",
  blocker: "271d36087c63026660934702b659a317abf41abfcae344a843d70fef6f417ab7",
});
const QUARANTINE_CONFIG_HASH = "b5fed57b169260fc1525360989b8ac85ad14ad0f3e8222f691ccccfc7c828658";
const QUARANTINE_REPORT_HASH = "4dec7b632d3d3b59f0fa954597f4987000b76e3fa9e9289dfa5f3e74cf2367f5";
const MANIFEST_IDENTITY_HASH = "63d9fa129138a4b4f8988dd34d1cdc0745ba5570853a57364fad86e536d89a2d";
const REPORT_NEUTRAL_INVENTORY_HASH = "ca28a60465dd1a78f18f96c22e8813e1335dcd1ded373b566874ffedf381a1d2";
const NEUTRAL_MANIFEST_UNIT = Object.freeze({
  name: UNIT,
  size: 86016,
  sha256: "df70175c2ccfb8a56cb61b93092d47787eac7dcdbabc06775ebd56a33819c30d",
});
const CREDIT = /fuzzy|match|complet|credit/i;

function check(condition, message) {
  if (!condition) throw new Error(`DllHologramMail quarantine: ${message}`);
}

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function keys(value, expected, label) {
  check(object(value) && Object.keys(value).sort().join(",") === [...expected].sort().join(","),
    `${label} has an invalid schema`);
}

function number(value, label) {
  check(typeof value === "number" || typeof value === "string" && /^(?:0|[1-9][0-9]*)$/.test(value),
    `${label} is malformed`);
  const result = Number(value);
  check(Number.isFinite(result) && result >= 0, `${label} is malformed`);
  return result;
}

function unique(values, label) {
  check(values.every(value => typeof value === "string") && new Set(values).size === values.length,
    `${label} has missing or duplicate names`);
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (object(value)) return Object.fromEntries(Object.keys(value).sort()
    .map(key => [key, canonical(value[key])]));
  return value;
}

function strictJson(text, label) {
  let value;
  try { value = JSON.parse(text); } catch { check(false, `${label} is malformed JSON`); }
  // JSON.parse establishes syntax first; scan string tokens to retain duplicate keys,
  // including escaped spellings, which JSON.parse alone would silently discard.
  const stack = [];
  for (let index = 0; index < text.length;) {
    const char = text[index];
    if (char === "{") { stack.push(new Set()); index++; continue; }
    if (char === "[") { stack.push(null); index++; continue; }
    if (char === "}" || char === "]") { stack.pop(); index++; continue; }
    if (char !== '"') { index++; continue; }
    const start = index++;
    while (index < text.length) {
      const next = text[index++];
      if (next === "\\") index++;
      else if (next === '"') break;
    }
    let cursor = index;
    while (/\s/.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const key = JSON.parse(text.slice(start, index)), owner = stack.at(-1);
    check(owner instanceof Set && !owner.has(key), `${label} contains a duplicate JSON key`);
    owner.add(key);
  }
  function finite(node) {
    if (typeof node === "number") check(Number.isFinite(node), `${label} contains a non-finite number`);
    else if (node && typeof node === "object") Object.values(node).forEach(finite);
  }
  finite(value);
  return value;
}

function safePath(path) {
  check(typeof path === "string" && path.length > 0 && !isAbsolute(path)
    && !path.includes("\\") && path.split("/").every(part => /^[A-Za-z0-9_.-]+$/.test(part)
      && part !== "." && part !== ".."), "unsafe public path");
}

function checkedPathState(root, path, directory = false) {
  safePath(path);
  const absoluteRoot = resolve(root);
  // The trusted repository root and every descendant ancestor of the leaf are retained.
  // System directories above the repository are outside the published input boundary.
  const chain = [absoluteRoot];
  let cursor = absoluteRoot;
  for (const part of path.split("/")) { cursor = join(cursor, part); chain.push(cursor); }
  const snapshots = [];
  for (const [index, candidate] of chain.entries()) {
    const stat = lstatSync(candidate, { bigint: true });
    check(!stat.isSymbolicLink(), "symlink in public input path");
    const isDirectory = index < chain.length - 1 || directory;
    check(isDirectory ? stat.isDirectory() : stat.isFile(), "public input has an unsafe file type");
    if (!isDirectory) {
      check(stat.nlink === 1n, "hardlinked public input is forbidden");
      check(stat.size > 0n && stat.size <= 32n * 1024n * 1024n, "public input size is invalid");
    }
    snapshots.push({ path: candidate, dev: stat.dev, ino: stat.ino, mode: stat.mode, nlink: stat.nlink });
  }
  return { absolute: cursor, snapshots };
}

function checkedPath(root, path, directory = false) {
  return checkedPathState(root, path, directory).absolute;
}

function stableSnapshots(snapshots) {
  for (const expected of snapshots) {
    const current = lstatSync(expected.path, { bigint: true });
    check(!current.isSymbolicLink() && current.dev === expected.dev && current.ino === expected.ino
      && current.mode === expected.mode && current.nlink === expected.nlink,
    "public input ancestor identity changed");
  }
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode
    && left.nlink === right.nlink && left.size === right.size
    && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}

function stableRead(root, path, directory, reader, hooks = {}) {
  const initial = checkedPathState(root, path, directory);
  const expected = initial.absolute;
  check(Number.isInteger(constants.O_NOFOLLOW) && Number.isInteger(constants.O_NONBLOCK)
    && (!directory || Number.isInteger(constants.O_DIRECTORY)),
  "platform lacks no-follow/nonblocking descriptor support");
  const flags = constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK
    | (directory ? constants.O_DIRECTORY : 0);
  let descriptor;
  try {
    if (hooks.beforeOpen) hooks.beforeOpen();
    descriptor = openSync(expected, flags);
    const before = fstatSync(descriptor, { bigint: true });
    check(directory ? before.isDirectory() : before.isFile(), "descriptor has an unsafe file type");
    if (!directory) {
      check(before.nlink === 1n, "hardlinked public input is forbidden");
      check(before.size > 0n && before.size <= 32n * 1024n * 1024n, "public input size is invalid");
    }
    const initialLeaf = initial.snapshots.at(-1);
    check(before.dev === initialLeaf.dev && before.ino === initialLeaf.ino
      && before.mode === initialLeaf.mode && before.nlink === initialLeaf.nlink,
    "public input leaf identity changed before open");
    stableSnapshots(initial.snapshots);
    const descriptorPath = `/proc/self/fd/${descriptor}`;
    check(realpathSync(descriptorPath) === expected, "public input canonical identity changed");
    if (hooks.afterOpen) hooks.afterOpen();
    const result = reader(descriptor, descriptorPath);
    const after = fstatSync(descriptor, { bigint: true });
    check(sameFile(before, after), "public input changed while being read");
    check(realpathSync(descriptorPath) === expected, "public input canonical identity changed");
    stableSnapshots(initial.snapshots);
    check(checkedPathState(root, path, directory).absolute === expected,
      "public input path changed while being read");
    const current = lstatSync(expected, { bigint: true });
    check(current.dev === after.dev && current.ino === after.ino,
      "public input path was reassigned while being read");
    return result;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function readStableFile(root, path, hooks) {
  return stableRead(root, path, false, descriptor => readFileSync(descriptor, "utf8"), hooks);
}

function readStableDirectory(root, path, hooks) {
  return stableRead(root, path, true, (_descriptor, descriptorPath) => readdirSync(descriptorPath), hooks);
}

function readMetadataDirectory(root, path, extension) {
  const names = readStableDirectory(root, path).sort();
  unique(names, `${path} entries`);
  check(names.length === 145 && names.every(name =>
    new RegExp(`^Dll[A-Za-z0-9_]+\\${extension}$`).test(name)),
  `${path} must contain the complete canonical metadata set`);
  return new Map(names.map(name => [name.slice(0, -extension.length),
    readStableFile(root, `${path}/${name}`)]));
}

function readState(root) {
  const raw = {};
  for (const [key, path] of Object.entries(PATHS)) {
    if (key !== "csv" && key !== "partition") raw[key] = readStableFile(root, path);
  }
  const csvFiles = readMetadataDirectory(root, "symbols/cro", ".csv");
  const partitionFiles = readMetadataDirectory(root, "symbols/cro-partitions", ".json");
  raw.csv = csvFiles.get(STEM);
  raw.partition = partitionFiles.get(STEM);
  for (const [key, expected] of Object.entries(NEUTRAL_HASHES)) {
    check(createHash("sha256").update(raw[key]).digest("hex") === expected,
      `${key} neutral inventory changed`);
  }
  const state = { csv: raw.csv, partitionText: raw.partition, blocker: raw.blocker,
    csvFiles, partitionFiles, partitions: new Map() };
  for (const key of ["report", "project", "config", "manifest", "partition"])
    state[key] = strictJson(raw[key], PATHS[key]);
  for (const [stem, text] of partitionFiles)
    state.partitions.set(stem, strictJson(text, `symbols/cro-partitions/${stem}.json`));
  state.sourcePaths = new Set();
  for (const entry of state.config.units ?? []) for (const source of entry.sources ?? []) {
    checkedPath(root, source.path);
    state.sourcePaths.add(source.path);
  }
  state.sourceEntries = readStableDirectory(root, "src/cro");
  return state;
}

function noCredit(node) {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    check(!/^source_?path$/i.test(key), "unit contains source_path");
    if (CREDIT.test(key)) {
      if (/^(?:complete|completed|completion)$/i.test(key) && value === false) continue;
      check((typeof value === "number" && Number.isFinite(value) && value === 0)
        || value === "0", "unit contains positive or malformed match/completion credit");
    } else noCredit(value);
  }
}

function noOwnership(node) {
  if (typeof node === "string") check(!/hologrammail/i.test(node), "config owns quarantined unit");
  else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      check(!/hologrammail/i.test(key), "config owns quarantined unit");
      noOwnership(value);
    }
  }
}

function percent(numerator, denominator) {
  // objdiff divides in float32 before multiplying by 100, then emits the
  // shortest decimal which round-trips to that float32 value.
  const result = Math.fround(Math.fround(numerator / denominator) * 100);
  for (let digits = 1; digits <= 9; digits++) {
    const shortened = Number(result.toPrecision(digits));
    if (Math.fround(shortened) === result) return shortened;
  }
  check(false, "float32 percentage cannot be represented");
}

function validate(state) {
  const { report, project, config, manifest, partition } = state;
  check(Array.isArray(state.sourceEntries) && state.sourceEntries.every(name =>
    typeof name === "string" && !/hologrammail/i.test(name)),
  "quarantined source file or directory exists");
  check(typeof state.blocker === "string" && ["2026-10-17", "AS_EUR_REV2", UNIT,
    "d7a0c7eeff0bc6c4752e29ed2b9ff315d01b8bea", "7b14dec", "No behavioral contract",
    "blocked and incomplete", "Resumption requires", "Git 2.53.0", "Node v24.21.0"]
    .every(marker => state.blocker.includes(marker)), "missing or insufficient provenance blocker");
  keys(config, ["schemaVersion", "units"], "config");
  check(config.schemaVersion === 1 && Array.isArray(config.units), "invalid config");
  noOwnership(config);
  const configIdentity = { schemaVersion: config.schemaVersion, unit: UNIT,
    owners: config.units.filter(entry => JSON.stringify(entry).toLowerCase().includes("hologrammail")) };
  check(createHash("sha256").update(JSON.stringify(configIdentity)).digest("hex")
    === QUARANTINE_CONFIG_HASH, "quarantined config identity changed");
  unique(config.units.map(unit => unit.name), "config units");
  for (const unit of config.units) {
    keys(unit, ["name", "sources", "functions"], "config unit");
    check(/^Dll[A-Za-z0-9_]+$/.test(unit.name) && Array.isArray(unit.sources)
      && unit.sources.length > 0 && Array.isArray(unit.functions) && unit.functions.length > 0,
    "invalid config ownership schema");
    for (const source of unit.sources) {
      keys(source, ["path", "mode"], "config source");
      safePath(source.path);
      check(source.path === `src/cro/${unit.name}.c`
        || source.path.startsWith(`src/cro/${unit.name}/`), "unsafe config source path");
      check(source.mode === "arm" || source.mode === "thumb", "invalid config source mode");
      check(state.sourcePaths.has(source.path), "config source claim is not a canonical existing path");
      const topLevel = source.path.slice("src/cro/".length).split("/")[0];
      check(state.sourceEntries.includes(topLevel), "config source claim is missing");
    }
    unique(unit.functions.map(fn => fn.name), "config functions");
    for (const fn of unit.functions) {
      check(object(fn) && ["address", "name", "offset", "semantics", "size"].every(key =>
        key === "offset" || Object.hasOwn(fn, key)), "invalid config function claim");
      check(Object.keys(fn).every(key => ["address", "name", "offset", "semantics", "size"].includes(key)),
        "invalid config function claim");
      number(fn.address, "claim address");
      number(fn.size, "claim size");
      check(typeof fn.name === "string" && typeof fn.semantics === "string" && fn.semantics.length > 0,
        "invalid config function claim");
    }
  }

  check(report.version === 2 && Array.isArray(report.units), "invalid report");
  unique(report.units.map(unit => unit.name), "report units");
  check(Array.isArray(manifest.units), "invalid neutral manifest");
  unique(manifest.units.map(unit => unit.name), "manifest units");
  check(createHash("sha256").update(JSON.stringify(canonical(manifest))).digest("hex")
    === MANIFEST_IDENTITY_HASH, "canonical manifest identity changed");
  const manifestUnit = manifest.units.find(entry => entry.name === UNIT);
  check(Object.entries(NEUTRAL_MANIFEST_UNIT).every(([key, value]) => manifestUnit?.[key] === value),
    "quarantined manifest entry changed");
  validatePublicCroMetadata({ manifest, csvFiles: state.csvFiles,
    partitionFiles: state.partitionFiles, requireComplete: true });
  const names = ["main/code", ...manifest.units.map(unit => unit.name)].sort();
  check(JSON.stringify(report.units.map(unit => unit.name).sort())
    === JSON.stringify(names), "missing or unexpected report unit");
  check(config.units.every(entry => names.includes(`cro/${entry.name}`)),
    "config owns unknown report unit");
  const unit = report.units.find(entry => entry.name === UNIT);
  check(unit !== undefined, "missing quarantined unit");
  keys(unit.metadata, ["complete"], "unit metadata");
  check(unit.metadata.complete === false, "unit metadata.complete must be false");
  noCredit(unit);
  keys(unit, ["name", "measures", "sections", "functions", "metadata"], "quarantined report unit");
  check(Array.isArray(unit.functions) && unit.functions.length === 44
    && Array.isArray(unit.sections) && unit.sections.length === 5, "neutral report inventory lost");
  unique(unit.functions.map(fn => fn.name), "unit functions");
  unique(unit.sections.map(section => section.name), "unit sections");
  const measures = unit.measures;
  check(object(measures), "missing unit measures");
  for (const [key, expected] of Object.entries({ total_code: 14536, total_data: 9152,
    total_functions: 44, total_units: 1 }))
    check(number(measures[key], `unit ${key}`) === expected, "unit neutral denominators changed");

  check(partition.module === STEM && partition.textSize === 56924
    && partition.functions.length === 44, "neutral partition changed");
  for (const [index, fn] of unit.functions.entries()) {
    const neutral = partition.functions[index];
    check(fn.name === neutral.name && number(fn.size, "function size") === neutral.size,
    "report functions differ from retained neutral inventory");
    number(fn.address, "function identity");
    keys(fn.metadata, [], "function metadata");
  }
  const sectionSizes = { ".bss": 532, ".data": 104, ".rodata": 5180,
    ".pool": partition.pools.reduce((sum, entry) => sum + entry.size, 0),
    ".text": [...partition.functions, ...partition.gaps].reduce((sum, entry) => sum + entry.size, 0) };
  for (const section of unit.sections) {
    check(Object.hasOwn(sectionSizes, section.name)
      && number(section.size, "section size") === sectionSizes[section.name],
    "report sections differ from retained neutral inventory");
    keys(section.metadata, [], "section metadata");
  }
  const neutralReport = {
    name: unit.name,
    measures: Object.fromEntries(Object.entries(measures).filter(([key]) => !CREDIT.test(key))),
    sections: unit.sections.map(({ name, size, metadata }) => ({ name, size, metadata })),
    functions: unit.functions.map(({ name, size, address, metadata }) => ({ name, size, address, metadata })),
  };
  check(createHash("sha256").update(JSON.stringify(neutralReport)).digest("hex")
    === "76004a1ca284e6ed65f550d1e43ca5c6992afac1bfba45cc8831199da0c8f141",
  "neutral report fields changed");
  check(createHash("sha256").update(JSON.stringify(canonical(unit))).digest("hex")
    === QUARANTINE_REPORT_HASH, "quarantined report unit identity changed");

  const neutralInventory = report.units.map(entry => ({
    name: entry.name,
    sections: (entry.sections ?? []).map(({ name, size, metadata }) => ({ name, size, metadata })),
    functions: (entry.functions ?? []).map(({ name, size, address, metadata }) =>
      ({ name, size, address, metadata })),
  }));
  check(createHash("sha256").update(JSON.stringify(neutralInventory)).digest("hex")
    === REPORT_NEUTRAL_INVENTORY_HASH, "canonical report neutral inventory changed");

  const sums = { total_code: 0, total_data: 0, total_functions: 0,
    matched_code: 0, matched_data: 0, matched_functions: 0 };
  let fuzzyBytes = 0, completedUnits = 0;
  const claims = new Map(config.units.map(entry => [entry.name, entry]));
  for (const entry of report.units) {
    check(object(entry) && Object.keys(entry).every(key =>
      ["name", "measures", "sections", "functions", "metadata"].includes(key))
      && ["name", "measures", "sections", "metadata"].every(key => Object.hasOwn(entry, key))
      && object(entry.measures) && Array.isArray(entry.sections)
      && (entry.functions === undefined || Array.isArray(entry.functions)), "invalid aggregate unit");
    check(typeof entry.metadata?.complete === "boolean", "invalid unit completion status");
    const functions = entry.functions ?? [];
    const sections = entry.sections;
    unique(functions.map(fn => fn.name), `${entry.name} functions`);
    unique(sections.map(section => section.name), `${entry.name} sections`);
    for (const section of sections) {
      check(object(section) && Object.keys(section).every(key =>
        ["name", "size", "fuzzy_match_percent", "metadata"].includes(key))
        && typeof section.name === "string", "invalid report section schema");
      keys(section.metadata, [], "section metadata");
      if (Object.hasOwn(section, "size")) number(section.size, "section size");
      if (Object.hasOwn(section, "fuzzy_match_percent")) {
        const fuzzy = number(section.fuzzy_match_percent, "section fuzzy percentage");
        check(fuzzy <= 100, "invalid section fuzzy percentage");
      }
    }
    for (const key of Object.keys(sums)) sums[key] += number(entry.measures[key] ?? 0, key);
    check(number(entry.measures.total_functions ?? 0, "function denominator") === functions.length,
      "unit function denominator differs from inventory");
    let bytes = 0, exactFunctions = 0, exactBytes = 0;
    for (const fn of functions) {
      check(object(fn) && Object.keys(fn).every(key =>
        ["name", "size", "address", "fuzzy_match_percent", "metadata"].includes(key))
        && ["name", "size", "address", "metadata"].every(key => Object.hasOwn(fn, key)),
      "invalid report function schema");
      keys(fn.metadata, [], "function metadata");
      const size = number(fn.size, "function size"), fuzzy = number(fn.fuzzy_match_percent ?? 0, "fuzzy percentage");
      check(fuzzy <= 100, "invalid fuzzy percentage");
      number(fn.address, "function address");
      bytes += size; fuzzyBytes += size * fuzzy / 100;
      if (fuzzy === 100) { exactFunctions++; exactBytes += size; }
    }
    check(bytes === number(entry.measures.total_code ?? 0, "code denominator")
      && exactFunctions === number(entry.measures.matched_functions ?? 0, "matched functions")
      && exactBytes === number(entry.measures.matched_code ?? 0, "matched code"),
    "aggregate unit credit differs from function inventory");
    const totalCode = number(entry.measures.total_code ?? 0, "code denominator");
    check(number(entry.measures.total_units ?? 0, "unit denominator") === 1
      && number(entry.measures.matched_data ?? 0, "matched data") === 0
      && number(entry.measures.matched_code_percent ?? 0, "matched code percentage")
        === (totalCode === 0 ? 0 : percent(exactBytes, totalCode))
      && number(entry.measures.matched_functions_percent ?? 0, "matched function percentage")
        === (functions.length === 0 ? 0 : percent(exactFunctions, functions.length)),
    "unit measures differ from function evidence");
    if (entry.metadata.complete) {
      check(exactFunctions === functions.length && exactBytes === totalCode,
        "unit completion lacks whole-unit proof");
      completedUnits++;
    }
    if (!entry.name.startsWith("cro/")) continue;
    const stem = entry.name.slice(4), partitionEntry = state.partitions.get(stem);
    check(partitionEntry !== undefined, "report unit lacks canonical partition inventory");
    const claim = claims.get(stem);
    keys(entry.metadata, claim ? ["complete", "source_path"] : ["complete"], "unit metadata");
    if (claim) check(entry.metadata.source_path === `src/cro/${stem}`,
      "report source_path differs from config ownership");
    check(functions.length === partitionEntry.functions.length,
      "report function inventory differs from canonical partition");
    const textSection = sections.find(section => section.name === ".text");
    const poolSection = sections.find(section => section.name === ".pool");
    check(sections.map(section => section.name).join(",") === ".bss,.data,.pool,.rodata,.text"
      && textSection !== undefined && poolSection !== undefined, "report section inventory is not canonical");
    const expectedText = [...partitionEntry.functions, ...partitionEntry.gaps]
      .reduce((sum, range) => sum + number(range.size, "partition range size"), 0);
    const expectedPool = partitionEntry.pools.reduce((sum, range) =>
      sum + Math.ceil(number(range.size, "partition pool size") / 4) * 4, 0);
    check(number(textSection.size, "text section size") === expectedText
      && number(poolSection.size, "pool section size") === expectedPool,
    "report section sizes differ from canonical partition");
    let expectedAddress = expectedText - totalCode;
    for (let index = 0; index < functions.length; index++) {
      const fn = functions[index], neutral = partitionEntry.functions[index];
      check(fn.name === neutral.name && number(fn.size, "function size") === neutral.size
        && number(fn.address, "function address") === expectedAddress,
      "report function identity differs from canonical partition");
      expectedAddress += neutral.size;
    }
    const totalData = sections.filter(section => section.name !== ".text")
      .reduce((sum, section) => sum + number(section.size ?? 0, "data section size"), 0);
    check(number(entry.measures.total_data ?? 0, "data denominator") === totalData,
      "unit data denominator differs from section inventory");
    const count = number(entry.measures.matched_functions ?? 0, "CRO matched functions");
    const matched = number(entry.measures.matched_code ?? 0, "CRO matched bytes");
    const neutralByName = new Map(partitionEntry.functions.map(fn => [fn.name, fn]));
    for (const fn of claim?.functions ?? []) {
      const neutral = neutralByName.get(fn.name);
      check(neutral && number(fn.address, "claim address") === neutral.address
        && number(fn.size, "claim size") === neutral.size,
      "config claim differs from canonical partition function");
      if (Object.hasOwn(fn, "offset")) number(fn.offset, "claim source offset");
    }
    const exactNames = functions.filter(fn => fn.fuzzy_match_percent === 100).map(fn => fn.name).sort();
    const claimedNames = (claim?.functions ?? []).map(fn => fn.name).sort();
    check(JSON.stringify(exactNames) === JSON.stringify(claimedNames)
      && count === claimedNames.length
      && matched === (claim?.functions.reduce((sum, fn) => sum + number(fn.size, "claim size"), 0) ?? 0),
    "CRO function evidence differs from public ownership claims");
  }
  for (const [key, expected] of Object.entries(sums)) {
    check(number(report.measures[key] ?? 0, `report ${key}`) === expected,
      "global report aggregate is inconsistent");
  }
  check(report.measures.total_units === report.units.length && project.version === "AS_EUR_REV2"
    && project.progress.totalUnits === report.units.length
    && project.progress.totalFunctions === sums.total_functions
    && project.progress.matchedFunctions === sums.matched_functions
    && project.progress.completeUnits === completedUnits, "project/report totals differ");
  const codePercent = percent(sums.matched_code, sums.total_code);
  check(report.measures.matched_code_percent === codePercent
    && project.progress.matchedCodePercent === codePercent
    && report.measures.matched_functions_percent === percent(sums.matched_functions, sums.total_functions)
    && report.measures.fuzzy_match_percent === percent(fuzzyBytes, sums.total_code),
  "project/report float32 percentages differ");
}

function selfTest(state) {
  let accepted = 0, rejected = 0;
  function accepts(label, mutate) {
    const candidate = structuredClone(state); mutate(candidate);
    assert.doesNotThrow(() => validate(candidate), label); accepted++;
  }
  function rejects(label, mutate, pattern) {
    const candidate = structuredClone(state); mutate(candidate);
    assert.throws(() => validate(candidate), pattern, label); rejected++;
  }
  const target = candidate => candidate.report.units.find(unit => unit.name === UNIT);
  const reportUnit = (candidate, name) => candidate.report.units.find(unit => unit.name === `cro/${name}`);
  function updateProgress(candidate, entry) {
    const exact = (entry.functions ?? []).filter(fn => fn.fuzzy_match_percent === 100);
    entry.measures.matched_functions = exact.length;
    entry.measures.matched_code = String(exact.reduce((sum, fn) => sum + Number(fn.size), 0));
    entry.measures.matched_code_percent = percent(Number(entry.measures.matched_code), Number(entry.measures.total_code));
    entry.measures.matched_functions_percent = percent(exact.length, entry.measures.total_functions);
    const all = candidate.report.units.flatMap(unit => unit.functions ?? []);
    const fuzzyBytes = all.reduce((sum, fn) => sum + Number(fn.size) * (fn.fuzzy_match_percent ?? 0) / 100, 0);
    for (const key of ["total_code", "total_data", "total_functions", "matched_code", "matched_data", "matched_functions"])
      candidate.report.measures[key] = candidate.report.units.reduce((sum, unit) => sum + Number(unit.measures[key] ?? 0), 0);
    const measures = candidate.report.measures;
    measures.matched_code_percent = percent(measures.matched_code, measures.total_code);
    measures.matched_functions_percent = percent(measures.matched_functions, measures.total_functions);
    measures.fuzzy_match_percent = percent(fuzzyBytes, measures.total_code);
    entry.measures.fuzzy_match_percent = percent((entry.functions ?? []).reduce((sum, fn) =>
      sum + Number(fn.size) * (fn.fuzzy_match_percent ?? 0) / 100, 0), Number(entry.measures.total_code));
    candidate.project.progress.matchedFunctions = measures.matched_functions;
    candidate.project.progress.matchedCodePercent = measures.matched_code_percent;
    candidate.project.progress.completeUnits = candidate.report.units.filter(unit => unit.metadata.complete).length;
  }
  accepts("unrelated main/code match with consistent aggregates", candidate => {
    const main = candidate.report.units.find(unit => unit.name === "main/code");
    (main.functions.find(fn => fn.fuzzy_match_percent !== 100) ?? main.functions[0]).fuzzy_match_percent = 100;
    updateProgress(candidate, main);
  });
  accepts("unrelated main/code completion with consistent aggregates", candidate => {
    const main = candidate.report.units.find(unit => unit.name === "main/code");
    for (const fn of main.functions) fn.fuzzy_match_percent = 100;
    main.metadata.complete = true;
    updateProgress(candidate, main);
  });
  for (const location of [candidate => target(candidate), candidate => target(candidate).measures,
    candidate => target(candidate).sections[0], candidate => target(candidate).functions[0]]) {
    for (const key of ["fuzzy_match_percent", "matched_code", "matched_functions", "complete_code_percent"]) {
      for (const value of [1, "1", -1, null, "NaN", true, {}, []])
        rejects(`${key} invalid credit`, candidate => { location(candidate)[key] = value; }, /credit/);
    }
    rejects("source_path", candidate => { location(candidate).source_path = "src/cro/quarantined"; }, /source_path/);
    rejects("nested credit", candidate => { location(candidate).extra = { matched_data: 1 }; }, /credit/);
  }
  for (const complete of [true, 0, "false", null])
    rejects("completion", candidate => { target(candidate).metadata.complete = complete; }, /complete/);
  rejects("ownership", candidate => { candidate.config.units.push({ name: STEM, sources: [], functions: [] }); }, /owns/);
  rejects("count-preserving ownership substitution", candidate => { candidate.config.units[0].name = STEM; }, /owns/);
  rejects("aliased ownership", candidate => { candidate.config.units[0].sources[0].path = `src/cro/${STEM}.c`; }, /owns/);
  rejects("unsafe ownership path", candidate => { candidate.config.units[0].sources[0].path = "src/cro/../other.c"; }, /unsafe/);
  rejects("source file", candidate => { candidate.sourceEntries.push(`${STEM}.c`); }, /source file or directory/);
  rejects("source directory", candidate => { candidate.sourceEntries.push(STEM); }, /source file or directory/);
  rejects("renamed source", candidate => { candidate.sourceEntries.push(`${STEM}_replacement.c`); }, /source file or directory/);
  rejects("missing blocker", candidate => { candidate.blocker = ""; }, /blocker/);
  rejects("duplicate unit", candidate => { candidate.report.units.push(structuredClone(target(candidate))); }, /duplicate/);
  rejects("missing unit", candidate => { candidate.report.units = candidate.report.units.filter(unit => unit.name !== UNIT); }, /missing/);
  rejects("unexpected publication field", candidate => { target(candidate).unexpected_publication_field = 0; }, /schema|identity/);
  rejects("missing inventory", candidate => { target(candidate).functions.pop(); }, /inventory/);
  rejects("changed neutral identity", candidate => { target(candidate).functions[0].address = "0"; }, /neutral report/);
  rejects("denominator change", candidate => { target(candidate).measures.total_code = "0"; }, /denominators/);
  rejects("aggregate mismatch", candidate => { candidate.project.progress.matchedFunctions++; }, /totals differ/);
  rejects("report aggregate mismatch", candidate => { candidate.report.measures.matched_code = "1"; }, /aggregate/);
  rejects("completed-unit count mismatch", candidate => { candidate.project.progress.completeUnits++; }, /totals differ/);
  rejects("unrelated function identity and address replacement", candidate => {
    const fn = reportUnit(candidate, "DllBackGround").functions[0];
    fn.name = "unsupported_function_identity";
    fn.address = "999999999";
  }, /neutral inventory|function identity/);
  rejects("unproved unrelated completion with coordinated project count", candidate => {
    reportUnit(candidate, "DllBackGround").metadata.complete = true;
    candidate.project.progress.completeUnits++;
  }, /whole-unit proof/);
  rejects("invented unrelated matched data with coordinated root", candidate => {
    reportUnit(candidate, "DllBackGround").measures.matched_data = 1;
    candidate.report.measures.matched_data = 1;
  }, /matched data|measures/);
  rejects("corrupt unrelated section and coordinated data totals", candidate => {
    const entry = reportUnit(candidate, "DllBackGround");
    entry.sections.find(section => section.name === ".rodata").size = "9781";
    entry.measures.total_data = "10773";
    candidate.report.measures.total_data = "2121693";
  }, /neutral inventory|data denominator/);
  rejects("coordinated claimed config manifest and report ghost", candidate => {
    const original = "DllBackGround", ghost = "DllGhostClaim";
    candidate.config.units.find(entry => entry.name === original).name = ghost;
    candidate.manifest.units.find(entry => entry.name === `cro/${original}`).name = `cro/${ghost}`;
    const entry = reportUnit(candidate, original);
    entry.name = `cro/${ghost}`;
    entry.metadata.source_path = `src/cro/${ghost}`;
  }, /manifest identity|metadata|canonical|config source|unsafe/);
  rejects("coordinated unclaimed manifest and report ghost", candidate => {
    const claimed = new Set(candidate.config.units.map(entry => entry.name));
    const original = candidate.manifest.units.find(entry => !claimed.has(entry.name.slice(4))).name.slice(4);
    const ghost = "DllGhostUnclaimed";
    candidate.manifest.units.find(entry => entry.name === `cro/${original}`).name = `cro/${ghost}`;
    reportUnit(candidate, original).name = `cro/${ghost}`;
  }, /manifest identity|canonical/);
  rejects("credit reassigned to an unowned CRO with consistent global totals", candidate => {
    const claimed = new Set(candidate.config.units.map(entry => `cro/${entry.name}`));
    const receiver = candidate.report.units.find(entry => entry.name.startsWith("cro/")
      && entry.name !== UNIT && !claimed.has(entry.name) && entry.functions?.length);
    check(receiver !== undefined, "synthetic reassignment receiver is missing");
    receiver.functions[0].fuzzy_match_percent = 100;
    updateProgress(candidate, receiver);
  }, /CRO function evidence differs|ownership claims/);
  rejects("quarantined manifest size", candidate => {
    candidate.manifest.units.find(unit => unit.name === UNIT).size++;
  }, /canonical manifest identity|quarantined manifest entry/);
  rejects("quarantined manifest hash", candidate => {
    candidate.manifest.units.find(unit => unit.name === UNIT).sha256 = "0".repeat(64);
  }, /canonical manifest identity|quarantined manifest entry/);
  rejects("quarantined manifest name", candidate => {
    candidate.manifest.units.find(unit => unit.name === UNIT).name = `${UNIT}Renamed`;
  }, /canonical manifest identity|quarantined manifest entry/);
  for (const text of ['{"a":0,"a":1}', '{"a":0,"\\u0061":1}', '{"nested":{"x":1,"x":2}}',
    '{"a":', '{"a":1e999}']) {
    assert.throws(() => strictJson(text, "synthetic"), /duplicate|malformed|non-finite/); rejected++;
  }
  assert.deepEqual(strictJson('{"a":[{"x":0},{"x":1}]}', "synthetic"), { a: [{ x: 0 }, { x: 1 }] });
  accepted++;
  const temporary = mkdtempSync(join(tmpdir(), "hologram-quarantine-"));
  try {
    const fixture = join(temporary, "repository");
    for (const [key, path] of Object.entries(PATHS)) {
      mkdirSync(dirname(join(fixture, path)), { recursive: true });
      const content = key === "csv" ? state.csv : key === "partition" ? state.partitionText
        : key === "blocker" ? state.blocker : JSON.stringify(state[key]);
      writeFileSync(join(fixture, path), content);
    }
    for (const [stem, content] of state.csvFiles)
      writeFileSync(join(fixture, "symbols/cro", `${stem}.csv`), content);
    for (const [stem, content] of state.partitionFiles)
      writeFileSync(join(fixture, "symbols/cro-partitions", `${stem}.json`), content);
    mkdirSync(join(fixture, "src/cro"), { recursive: true });
    for (const source of state.config.units.flatMap(entry => entry.sources)) {
      const path = join(fixture, source.path);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, "/* synthetic name fixture */\n");
    }
    writeFileSync(join(fixture, PATHS.manifest), `${JSON.stringify(state.manifest, null, "\t")}\n`);
    assert.doesNotThrow(() => validate(readState(fixture)), "harmless manifest formatting"); accepted++;
    const manifest = structuredClone(state.manifest);
    const unrelated = manifest.units.find(unit => unit.name !== UNIT);
    unrelated.size += 4096;
    unrelated.sha256 = "0".repeat(64);
    writeFileSync(join(fixture, PATHS.manifest), JSON.stringify(manifest));
    assert.throws(() => validate(readState(fixture)), /manifest identity/,
      "unrelated canonical manifest record change"); rejected++;
    mkdirSync(join(temporary, "public"));
    writeFileSync(join(temporary, "public", "fixture.json"), "{}");
    symlinkSync("fixture.json", join(temporary, "public", "linked.json"));
    symlinkSync("public", join(temporary, "linked-directory"));
    for (const path of ["public/linked.json", "linked-directory/fixture.json", "../fixture.json", "/fixture.json",
      "public/../public/fixture.json", "public/../../fixture.json", "./public/fixture.json",
      "public//fixture.json", "public/./fixture.json", "public\\fixture.json", "public/%2e%2e/fixture.json"]) {
      assert.throws(() => checkedPath(temporary, path), /symlink|unsafe/); rejected++;
    }
    assert.equal(readStableFile(temporary, "public/fixture.json"), "{}");
    accepted++;
    const directHardlink = join(temporary, "public", "direct-hardlink.json");
    linkSync(join(temporary, "public", "fixture.json"), directHardlink);
    assert.throws(() => readStableFile(temporary, "public/direct-hardlink.json"), /hardlinked/); rejected++;
    rmSync(directHardlink);
    const directRace = join(temporary, "public", "direct-race.json");
    const directOriginal = join(temporary, "public", "direct-race-original.json");
    writeFileSync(directRace, "{}");
    assert.throws(() => readStableFile(temporary, "public/direct-race.json", { afterOpen: () => {
      renameSync(directRace, directOriginal);
      symlinkSync("fixture.json", directRace);
    } }), /canonical identity|symlink|changed|reassigned/); rejected++;
    rmSync(directRace); renameSync(directOriginal, directRace);
    const racedDirectory = join(temporary, "raced-directory");
    const heldDirectory = join(temporary, "held-directory");
    mkdirSync(racedDirectory); writeFileSync(join(racedDirectory, "fixture.json"), "{}");
    assert.throws(() => readStableFile(temporary, "raced-directory/fixture.json", { afterOpen: () => {
      renameSync(racedDirectory, heldDirectory);
      symlinkSync("public", racedDirectory);
    } }), /canonical identity|symlink|changed|reassigned|ancestor/); rejected++;
    const preOpenDirectory = join(temporary, "pre-open-directory");
    const heldPreOpenDirectory = join(temporary, "held-pre-open-directory");
    mkdirSync(preOpenDirectory); writeFileSync(join(preOpenDirectory, "fixture.json"), "{}");
    assert.throws(() => readStableFile(temporary, "pre-open-directory/fixture.json", { beforeOpen: () => {
      renameSync(preOpenDirectory, heldPreOpenDirectory);
      mkdirSync(preOpenDirectory);
      linkSync(join(heldPreOpenDirectory, "fixture.json"), join(preOpenDirectory, "fixture.json"));
    } }), /ancestor identity|hardlinked|leaf identity/); rejected++;
    const fifoRace = join(temporary, "public", "fifo-race.json");
    writeFileSync(fifoRace, "{}");
    assert.throws(() => readStableFile(temporary, "public/fifo-race.json", { beforeOpen: () => {
      rmSync(fifoRace);
      const result = spawnSync("mkfifo", [fifoRace], { encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr || "mkfifo failed");
    } }), /unsafe file type|leaf identity|canonical identity/); rejected++;
  } finally { rmSync(temporary, { recursive: true, force: true }); }
  console.log(`Passed ${accepted + rejected} synthetic quarantine tests (${accepted} acceptance, ${rejected} rejection).`);
}

try {
  const args = process.argv.slice(2);
  check(args.length === 0 || args.length === 1 && args[0] === "--self-test",
    "usage: validate-cro-dll-hologram-mail.mjs [--self-test]");
  const state = readState(ROOT);
  validate(state);
  if (args.includes("--self-test")) selfTest(state);
  console.log("Validated public DllHologramMail quarantine, retained inventory, and current report/project aggregates.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
