#!/usr/bin/env node

// Public quarantine accounting only. Never reads source contents or build inputs.
import { closeSync, constants, fstatSync, lstatSync, openSync, readFileSync,
  readdirSync, realpathSync, mkdtempSync, mkdirSync, renameSync, writeFileSync,
  symlinkSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
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

function checkedPath(root, path, directory = false) {
  safePath(path);
  const absoluteRoot = resolve(root);
  // Check every ancestor as well as every relative component before any read.
  const chain = [];
  for (let cursor = absoluteRoot;; cursor = dirname(cursor)) {
    chain.unshift(cursor);
    if (dirname(cursor) === cursor) break;
  }
  let cursor = absoluteRoot;
  for (const part of path.split("/")) { cursor = join(cursor, part); chain.push(cursor); }
  for (const [index, candidate] of chain.entries()) {
    const stat = lstatSync(candidate);
    check(!stat.isSymbolicLink(), "symlink in public input path");
    const isDirectory = index < chain.length - 1 || directory;
    check(isDirectory ? stat.isDirectory() : stat.isFile(), "public input has an unsafe file type");
    if (!isDirectory) check(stat.size > 0 && stat.size <= 32 * 1024 * 1024,
      "public input size is invalid");
  }
  return cursor;
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode
    && left.size === right.size && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}

function stableRead(root, path, directory, reader, afterOpen) {
  const expected = checkedPath(root, path, directory);
  check(Number.isInteger(constants.O_NOFOLLOW) && (!directory || Number.isInteger(constants.O_DIRECTORY)),
    "platform lacks no-follow descriptor support");
  const flags = constants.O_RDONLY | constants.O_NOFOLLOW | (directory ? constants.O_DIRECTORY : 0);
  let descriptor;
  try {
    descriptor = openSync(expected, flags);
    const before = fstatSync(descriptor, { bigint: true });
    check(directory ? before.isDirectory() : before.isFile(), "descriptor has an unsafe file type");
    if (!directory) check(before.size > 0n && before.size <= 32n * 1024n * 1024n,
      "public input size is invalid");
    const descriptorPath = `/proc/self/fd/${descriptor}`;
    check(realpathSync(descriptorPath) === expected, "public input canonical identity changed");
    if (afterOpen) afterOpen();
    const result = reader(descriptor, descriptorPath);
    const after = fstatSync(descriptor, { bigint: true });
    check(sameFile(before, after), "public input changed while being read");
    check(realpathSync(descriptorPath) === expected, "public input canonical identity changed");
    check(checkedPath(root, path, directory) === expected, "public input path changed while being read");
    const current = lstatSync(expected, { bigint: true });
    check(current.dev === after.dev && current.ino === after.ino,
      "public input path was reassigned while being read");
    return result;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function readStableFile(root, path, afterOpen) {
  return stableRead(root, path, false, descriptor => readFileSync(descriptor, "utf8"), afterOpen);
}

function readStableDirectory(root, path, afterOpen) {
  return stableRead(root, path, true, (_descriptor, descriptorPath) => readdirSync(descriptorPath), afterOpen);
}

function readState(root) {
  const raw = {};
  for (const [key, path] of Object.entries(PATHS)) raw[key] = readStableFile(root, path);
  for (const [key, expected] of Object.entries(NEUTRAL_HASHES)) {
    check(createHash("sha256").update(raw[key]).digest("hex") === expected,
      `${key} neutral inventory changed`);
  }
  const state = { csv: raw.csv, partitionText: raw.partition, blocker: raw.blocker };
  for (const key of ["report", "project", "config", "manifest", "partition"])
    state[key] = strictJson(raw[key], PATHS[key]);
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
      safePath(source.path);
      check(source.path.startsWith("src/cro/"), "unsafe config source path");
    }
  }

  check(report.version === 2 && Array.isArray(report.units), "invalid report");
  unique(report.units.map(unit => unit.name), "report units");
  check(Array.isArray(manifest.units), "invalid neutral manifest");
  unique(manifest.units.map(unit => unit.name), "manifest units");
  const manifestUnit = manifest.units.find(entry => entry.name === UNIT);
  check(Object.entries(NEUTRAL_MANIFEST_UNIT).every(([key, value]) => manifestUnit?.[key] === value),
    "quarantined manifest entry changed");
  validatePublicCroMetadata({ manifest, csvFiles: new Map([[STEM, state.csv]]),
    partitionFiles: new Map([[STEM, state.partitionText]]) });
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

  const sums = { total_code: 0, total_data: 0, total_functions: 0,
    matched_code: 0, matched_data: 0, matched_functions: 0 };
  let fuzzyBytes = 0, completedUnits = 0;
  const claims = new Map(config.units.map(entry => [entry.name, entry]));
  for (const entry of report.units) {
    check(object(entry.measures) && (entry.functions === undefined || Array.isArray(entry.functions)),
      "invalid aggregate unit");
    check(typeof entry.metadata?.complete === "boolean", "invalid unit completion status");
    if (entry.metadata.complete) completedUnits++;
    const functions = entry.functions ?? [];
    for (const key of Object.keys(sums)) sums[key] += number(entry.measures[key] ?? 0, key);
    check(number(entry.measures.total_functions ?? 0, "function denominator") === functions.length,
      "unit function denominator differs from inventory");
    let bytes = 0, exactFunctions = 0, exactBytes = 0;
    for (const fn of functions) {
      const size = number(fn.size, "function size"), fuzzy = number(fn.fuzzy_match_percent ?? 0, "fuzzy percentage");
      check(fuzzy <= 100, "invalid fuzzy percentage");
      bytes += size; fuzzyBytes += size * fuzzy / 100;
      if (fuzzy === 100) { exactFunctions++; exactBytes += size; }
    }
    check(bytes === number(entry.measures.total_code ?? 0, "code denominator")
      && exactFunctions === number(entry.measures.matched_functions ?? 0, "matched functions")
      && exactBytes === number(entry.measures.matched_code ?? 0, "matched code"),
    "aggregate unit credit differs from function inventory");
    if (!entry.name.startsWith("cro/")) continue;
    const count = number(entry.measures.matched_functions ?? 0, "CRO matched functions");
    const matched = number(entry.measures.matched_code ?? 0, "CRO matched bytes");
    const claim = claims.get(entry.name.slice(4));
    check(count === (claim?.functions.length ?? 0)
      && matched === (claim?.functions.reduce((sum, fn) => sum + number(fn.size, "claim size"), 0) ?? 0),
    "CRO aggregate differs from public ownership claims");
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
  rejects("credit reassigned to an unowned CRO with consistent global totals", candidate => {
    const claimed = new Set(candidate.config.units.map(entry => `cro/${entry.name}`));
    const receiver = candidate.report.units.find(entry => entry.name.startsWith("cro/")
      && entry.name !== UNIT && !claimed.has(entry.name) && entry.functions?.length);
    check(receiver !== undefined, "synthetic reassignment receiver is missing");
    receiver.functions[0].fuzzy_match_percent = 100;
    updateProgress(candidate, receiver);
  }, /CRO aggregate differs/);
  rejects("quarantined manifest size", candidate => {
    candidate.manifest.units.find(unit => unit.name === UNIT).size++;
  }, /quarantined manifest entry/);
  rejects("quarantined manifest hash", candidate => {
    candidate.manifest.units.find(unit => unit.name === UNIT).sha256 = "0".repeat(64);
  }, /quarantined manifest entry/);
  rejects("quarantined manifest name", candidate => {
    candidate.manifest.units.find(unit => unit.name === UNIT).name = `${UNIT}Renamed`;
  }, /quarantined manifest entry/);
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
    mkdirSync(join(fixture, "src/cro"), { recursive: true });
    writeFileSync(join(fixture, PATHS.manifest), `${JSON.stringify(state.manifest, null, "\t")}\n`);
    assert.doesNotThrow(() => validate(readState(fixture)), "harmless manifest formatting"); accepted++;
    const manifest = structuredClone(state.manifest);
    const unrelated = manifest.units.find(unit => unit.name !== UNIT);
    unrelated.size += 4096;
    unrelated.sha256 = "0".repeat(64);
    writeFileSync(join(fixture, PATHS.manifest), JSON.stringify(manifest));
    assert.doesNotThrow(() => validate(readState(fixture)), "unrelated manifest record change"); accepted++;
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
    const directRace = join(temporary, "public", "direct-race.json");
    const directOriginal = join(temporary, "public", "direct-race-original.json");
    writeFileSync(directRace, "{}");
    assert.throws(() => readStableFile(temporary, "public/direct-race.json", () => {
      renameSync(directRace, directOriginal);
      symlinkSync("fixture.json", directRace);
    }), /canonical identity|symlink|changed|reassigned/); rejected++;
    rmSync(directRace); renameSync(directOriginal, directRace);
    const racedDirectory = join(temporary, "raced-directory");
    const heldDirectory = join(temporary, "held-directory");
    mkdirSync(racedDirectory); writeFileSync(join(racedDirectory, "fixture.json"), "{}");
    assert.throws(() => readStableFile(temporary, "raced-directory/fixture.json", () => {
      renameSync(racedDirectory, heldDirectory);
      symlinkSync("public", racedDirectory);
    }), /canonical identity|symlink|changed|reassigned/); rejected++;
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
