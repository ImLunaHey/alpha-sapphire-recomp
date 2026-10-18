#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  closeSync, constants, fstatSync, linkSync, lstatSync, mkdirSync, mkdtempSync,
  openSync, readlinkSync, readSync, renameSync,
  rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const TARGET = "AS_EUR_REV2";
const UNIT_COUNT = 146;
const CRO_COUNT = 145;
const MAX_INPUT = 16 * 1024 * 1024;
const MAX_OBJECT = 64 * 1024 * 1024;
const UNIT = /^(?:main\/code|cro\/Dll[A-Za-z0-9_]+)$/u;
const FUNCTION = /^func_[0-9A-F]{8}$/u;
const DECIMAL = /^(?:0|[1-9][0-9]*)$/u;
const EXPECTED = Object.freeze({
  universe: "b1f9e5cad6b1afd9bf0c7d70a7158709ac77f2a1197c4e70c46964f703cb66a2",
  manifest: "ae2c9b80c5db4a7f099ed98d45cf292c77a87353bfaa9cafc5ea66192dd7d92e",
  mainInventory: "4b7bcc35a838a2d4fe1c0cdbac2ccbe36b4df1ac24b91f1f8660693967c8c2fe",
  croInventories: "210bd4b2a804b67f33727ead82d77b944771e3fd060563bb36935861299b62c4",
  croPartitions: "9b741f8fbadd2d65f64f4401c7599ee5ef118b3f75a62c3c2a412356b5f60fec",
  mainConfig: "f007fd8a8646c8e62f6d187ff82f02e14d91054db5802ba74237dbb244beb27c",
  croConfig: "77575f2d510cb76c927d78cba40eb82d87f75899f60efaec9e0ed3291bb6e958",
  sources: "4cf24c9e58d2d966e194c865e88dc719834691f4b821248e1cac94bd29352590",
  mainObject: "6d1c9dddd30dfe48c9131ec3b1ab9c962c9a5c67240f915be256a3135ea501dc",
  croObjects: "d0d7e38f59493a997e0ad576a41b54d3584ee9ce66744a5c4351aa6a4a31f878",
  reportFunctions: "521114c4754e0ad9b835ba2bf0a9cb01637801ac5d730430a8d804ebd3a5b636",
  reportSections: "900ec7e6960d2caa67a3ab1832e75b8986d689eaddbc0a97eb831d116888e0b9",
});

function check(value, message) { if (!value) throw new Error(message); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function same(left, right, message) {
  try { assert.deepStrictEqual(left, right); } catch { throw new Error(message); }
}
function exactKeys(value, keys, message) {
  check(value && typeof value === "object" && !Array.isArray(value), message);
  same(Object.keys(value).sort(), [...keys].sort(), message);
}
function canonicalPath(path) {
  check(typeof path === "string" && path && !isAbsolute(path) && !path.includes("\0")
    && !path.includes("\\"), "noncanonical publication path");
  const parts = path.split("/");
  check(parts.every(part => part && part !== "." && part !== ".."), "noncanonical publication path");
  return parts;
}

const IO = Object.freeze({ closeSync, fstatSync, lstatSync, openSync, readlinkSync, readSync });
const STAT = Object.freeze({ bigint: true });
const leafSnapshot = stat => [stat.dev, stat.ino, stat.mode, stat.nlink, stat.uid, stat.gid,
  stat.rdev, stat.size, stat.blocks, stat.mtimeNs, stat.ctimeNs];
const directoryIdentity = stat => [stat.dev, stat.ino, stat.mode, stat.uid, stat.gid, stat.rdev];

export function readStable(root, input, limit = MAX_INPUT, io = IO) {
  const directories = [];
  let leaf;
  try {
    check(process.platform === "linux" && constants.O_NOFOLLOW && constants.O_DIRECTORY,
      "safe publication traversal unavailable");
    check(isAbsolute(root) && resolve(root) === root, "noncanonical publication root");
    const parts = canonicalPath(input);
    const rootBefore = io.lstatSync(root, STAT);
    check(rootBefore.isDirectory() && !rootBefore.isSymbolicLink(), "invalid publication root");
    let parent = io.openSync(root, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
    directories.push({ fd: parent, identity: directoryIdentity(rootBefore), path: root });
    let canonicalParent = root;
    for (const part of parts.slice(0, -1)) {
      const path = `/proc/self/fd/${parent}/${part}`;
      const before = io.lstatSync(path, STAT);
      check(before.isDirectory() && !before.isSymbolicLink(), "invalid publication parent");
      parent = io.openSync(path, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
      canonicalParent = join(canonicalParent, part);
      directories.push({ fd: parent, identity: directoryIdentity(before), path: canonicalParent });
    }
    const verifyDirectories = () => {
      for (const directory of directories) {
        same(directoryIdentity(io.fstatSync(directory.fd, STAT)), directory.identity,
          "publication parent identity changed");
        check(io.readlinkSync(`/proc/self/fd/${directory.fd}`) === directory.path,
          "publication parent moved");
      }
    };
    verifyDirectories();
    const path = `/proc/self/fd/${parent}/${parts.at(-1)}`;
    const before = io.lstatSync(path, STAT);
    check(before.isFile() && !before.isSymbolicLink() && before.nlink === 1n && before.size > 0n
      && before.size <= BigInt(limit), "invalid publication input");
    leaf = io.openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const opened = io.fstatSync(leaf, STAT);
    same(leafSnapshot(opened), leafSnapshot(before), "publication input changed before open");
    check(io.readlinkSync(`/proc/self/fd/${leaf}`) === join(root, input), "publication input moved");
    const output = Buffer.alloc(Number(opened.size) + 1);
    let length = 0;
    while (length < output.length) {
      const count = io.readSync(leaf, output, length, output.length - length, null);
      if (!count) break;
      length += count;
    }
    same(leafSnapshot(io.fstatSync(leaf, STAT)), leafSnapshot(opened), "publication input changed during read");
    same(leafSnapshot(io.lstatSync(path, STAT)), leafSnapshot(opened), "publication input path changed");
    verifyDirectories();
    same(leafSnapshot(io.fstatSync(leaf, STAT)), leafSnapshot(opened), "publication input changed after read");
    check(length === Number(opened.size), "publication input length changed");
    return output.subarray(0, length);
  } catch {
    throw new Error("publication input rejected (path, type, alias, size, or race)");
  } finally {
    if (leaf !== undefined) io.closeSync(leaf);
    for (const { fd } of directories.reverse()) io.closeSync(fd);
  }
}

export function rejectDuplicateJsonKeys(text) {
  const stack = [];
  for (let index = 0; index < text.length;) {
    const char = text[index];
    if (char === "{" || char === "[") { stack.push(char === "{" ? new Set() : null); index++; continue; }
    if (char === "}" || char === "]") { stack.pop(); index++; continue; }
    if (char !== '"') { index++; continue; }
    const start = index++;
    let closed = false;
    while (index < text.length) {
      const next = text[index++];
      if (next === "\\") index++;
      else if (next === '"') { closed = true; break; }
    }
    check(closed, "invalid JSON string");
    let cursor = index;
    while (/[\t\n\r ]/u.test(text[cursor] ?? "")) cursor++;
    if (text[cursor] !== ":") continue;
    const owner = stack.at(-1), key = JSON.parse(text.slice(start, index));
    check(owner instanceof Set && !owner.has(key), "duplicate JSON key");
    owner.add(key);
  }
}
function parseJson(buffer, label) {
  const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(buffer);
  rejectDuplicateJsonKeys(text);
  try { return JSON.parse(text); } catch { throw new Error(`${label} is not canonical JSON`); }
}
function treeDigest(files) {
  const hash = createHash("sha256");
  for (const [path, buffer] of [...files].sort(([a], [b]) => a.localeCompare(b)))
    hash.update(path).update("\0").update(sha256(buffer)).update("\0");
  return hash.digest("hex");
}
function integer(value, label) {
  check((typeof value === "string" && DECIMAL.test(value)) || Number.isSafeInteger(value), label);
  const number = Number(value);
  check(Number.isSafeInteger(number) && number >= 0, label);
  return number;
}
function percent(value, label) {
  check(typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100, label);
  return value;
}
function closePercent(actual, expected, label) {
  check(Math.abs(actual - Math.fround(expected)) <= 0.000005, label);
}

function parseInventory(buffer, croStem = null) {
  const lines = buffer.toString("utf8").trimEnd().split(/\r?\n/u);
  if (croStem !== null) {
    check(lines[0] === "# Format,CRO_FUNCTIONS_V1" && lines[1] === `# Module,cro/${croStem}`
      && /^# TextSize,[0-9A-F]{8}$/u.test(lines[2]), "invalid CRO inventory header");
    lines.splice(0, 3);
  }
  check(lines.shift() === "Location,Name,Namespace,Mode,Size,Segment", "invalid function inventory header");
  return lines.map(line => {
    const match = /^([0-9A-F]{8}),"(func_[0-9A-F]{8})","Global",(\$a|\$t),([0-9A-F]{8}),"\.text"$/u.exec(line);
    check(match && match[2] === `func_${match[1]}`, "invalid function inventory row");
    return { name: match[2], location: Number.parseInt(match[1], 16), mode: match[3],
      size: Number.parseInt(match[4], 16) };
  });
}

function elfFunctions(buffer) {
  check(buffer.length >= 52 && buffer.subarray(0, 7).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]))
    && buffer.readUInt16LE(16) === 1 && buffer.readUInt16LE(18) === 40, "invalid evidence object");
  const shoff = buffer.readUInt32LE(32), count = buffer.readUInt16LE(48);
  check(count >= 2 && count <= 16384 && shoff + count * 40 <= buffer.length, "invalid evidence sections");
  const sections = Array.from({ length: count }, (_, index) => {
    const at = shoff + index * 40;
    return { index, type: buffer.readUInt32LE(at + 4), flags: buffer.readUInt32LE(at + 8),
      offset: buffer.readUInt32LE(at + 16), size: buffer.readUInt32LE(at + 20),
      link: buffer.readUInt32LE(at + 24), entry: buffer.readUInt32LE(at + 36) };
  });
  const functions = new Map();
  for (const table of sections.filter(section => section.type === 2)) {
    check(table.entry === 16 && table.size % 16 === 0 && sections[table.link]?.type === 3,
      "invalid evidence symbols");
    const strings = sections[table.link];
    const stringAt = offset => {
      check(offset < strings.size, "invalid evidence string");
      const start = strings.offset + offset, end = buffer.indexOf(0, start);
      check(end >= start && end < strings.offset + strings.size, "invalid evidence string");
      return buffer.toString("utf8", start, end);
    };
    for (let index = 1; index < table.size / 16; index++) {
      const at = table.offset + index * 16, info = buffer[at + 12], section = buffer.readUInt16LE(at + 14);
      if ((info >> 4) !== 1 || (info & 15) !== 2 || section === 0 || section >= sections.length) continue;
      const name = stringAt(buffer.readUInt32LE(at)), size = buffer.readUInt32LE(at + 8);
      if (FUNCTION.test(name)) {
        check(size > 0 && !functions.has(name), "duplicate evidence function");
        functions.set(name, size);
      }
    }
  }
  return functions;
}

function sourceEntries(mainConfig, croConfig) {
  exactKeys(mainConfig, ["schemaVersion", "sources"], "invalid main source config");
  exactKeys(croConfig, ["schemaVersion", "units"], "invalid CRO source config");
  check(mainConfig.schemaVersion === 1 && croConfig.schemaVersion === 1, "invalid source config version");
  const paths = [], claims = new Map(), sourcePaths = new Map();
  for (const source of mainConfig.sources) {
    exactKeys(source, ["path", "mode"], "invalid main source entry");
    check(source.path.startsWith("src/main/") && ["arm", "thumb"].includes(source.mode), "invalid main source");
    paths.push(source.path);
  }
  let previous = "";
  for (const unit of croConfig.units) {
    exactKeys(unit, ["name", "sources", "functions"], "invalid CRO source unit");
    check(/^Dll[A-Za-z0-9_]+$/u.test(unit.name) && unit.name > previous, "invalid CRO source order");
    previous = unit.name;
    const functions = new Map();
    for (const source of unit.sources) {
      check(source && typeof source.path === "string" && source.path.startsWith("src/cro/")
        && ["arm", "thumb"].includes(source.mode), "invalid CRO source");
      paths.push(source.path);
    }
    sourcePaths.set(unit.name,
      unit.sources.length === 1 ? unit.sources[0].path : `src/cro/${unit.name}`);
    for (const fn of unit.functions) {
      check(FUNCTION.test(fn?.name) && Number.isSafeInteger(fn.address) && Number.isSafeInteger(fn.size)
        && fn.size > 0 && !functions.has(fn.name), "invalid CRO function claim");
      functions.set(fn.name, { address: fn.address, size: fn.size });
    }
    claims.set(unit.name, functions);
  }
  check(new Set(paths).size === paths.length, "duplicate source ownership");
  return { paths, claims, sourcePaths };
}

export function validateSnapshot(snapshot, expected = EXPECTED) {
  const json = key => parseJson(snapshot.get(key), key);
  const universe = json("config/publication-units.json"), manifest = json(`progress/units/${TARGET}.cro.json`);
  const report = json(`progress/reports/${TARGET}/report.json`), project = json("progress/project.json");
  const mainConfig = json("config/sources.json"), croConfig = json("config/cro-sources.json");
  check(sha256(snapshot.get("config/publication-units.json")) === expected.universe, "publication universe changed");
  check(sha256(snapshot.get(`progress/units/${TARGET}.cro.json`)) === expected.manifest, "manifest changed");
  check(sha256(snapshot.get("symbols/code.bin.csv")) === expected.mainInventory, "main inventory changed");
  check(sha256(snapshot.get("config/sources.json")) === expected.mainConfig, "main source config changed");
  check(sha256(snapshot.get("config/cro-sources.json")) === expected.croConfig, "CRO source config changed");
  exactKeys(universe, ["schemaVersion", "target", "unitCount", "units"], "invalid publication universe");
  exactKeys(manifest, ["schemaVersion", "target", "unitCount", "units"], "invalid manifest");
  check(universe.schemaVersion === 1 && universe.target === TARGET && universe.unitCount === UNIT_COUNT
    && universe.units?.length === UNIT_COUNT, "invalid publication universe");
  check(manifest.schemaVersion === 1 && manifest.target === TARGET && manifest.unitCount === CRO_COUNT
    && manifest.units?.length === CRO_COUNT, "invalid manifest universe");
  const names = universe.units;
  check(names[0] === "main/code" && names.every((name, index) => UNIT.test(name)
    && (index <= 1 || name > names[index - 1])) && new Set(names).size === UNIT_COUNT,
  "publication names are not fixed, canonical, unique, and sorted");
  same(manifest.units.map(unit => unit.name), names.slice(1), "config and manifest universes differ");
  check(report.version === 2 && Array.isArray(report.units), "invalid report envelope");
  same(report.units.map(unit => unit.name).sort(), [...names].sort(), "config, manifest, and report universes differ");
  check(new Set(report.units.map(unit => unit.name)).size === UNIT_COUNT, "duplicate report unit");

  const croInventoryFiles = new Map(), partitionFiles = new Map(), inventories = new Map(), textSizes = new Map();
  inventories.set("main/code", parseInventory(snapshot.get("symbols/code.bin.csv")));
  for (const name of names.slice(1)) {
    const stem = name.slice(4), inventoryPath = `symbols/cro/${stem}.csv`;
    const partitionPath = `symbols/cro-partitions/${stem}.json`;
    croInventoryFiles.set(inventoryPath, snapshot.get(inventoryPath));
    partitionFiles.set(partitionPath, snapshot.get(partitionPath));
    inventories.set(name, parseInventory(snapshot.get(inventoryPath), stem));
    const partition = json(partitionPath);
    textSizes.set(name, [...partition.functions, ...partition.gaps]
      .reduce((sum, range) => sum + range.size, 0));
    same(partition.functions.map(fn => [fn.name, fn.address, fn.size, fn.mode]),
      inventories.get(name).map(fn => [fn.name, fn.location, fn.size, fn.mode === "$a" ? "arm" : "thumb"]),
      `${name} inventory and partition differ`);
  }
  check(treeDigest(croInventoryFiles) === expected.croInventories, "CRO inventory universe changed");
  check(treeDigest(partitionFiles) === expected.croPartitions, "CRO partition universe changed");
  const { paths: sources, claims, sourcePaths } = sourceEntries(mainConfig, croConfig);
  const sourceFiles = new Map(sources.map(path => [path, snapshot.get(path)]));
  check(treeDigest(sourceFiles) === expected.sources, "publication source evidence changed");
  const mainObjectPath = `build/${TARGET}/base/code.o`, mainObject = snapshot.get(mainObjectPath);
  check(sha256(mainObject) === expected.mainObject, "main object evidence changed");
  const mainEvidence = elfFunctions(mainObject), croObjectFiles = new Map(), croEvidence = new Map();
  for (const [stem, functions] of claims) {
    const path = `build/${TARGET}/base/cro-code/${stem}.o`, buffer = snapshot.get(path);
    croObjectFiles.set(path, buffer);
    const evidence = elfFunctions(buffer);
    same([...evidence].sort(), [...functions].map(([name, claim]) => [name, claim.size]).sort(),
      `${stem} object and config claims differ`);
    croEvidence.set(stem, evidence);
  }
  check(treeDigest(croObjectFiles) === expected.croObjects, "CRO object evidence changed");

  const identities = [], sectionIdentities = [];
  const totals = { code: 0, matchedCode: 0, data: 0, functions: 0, matchedFunctions: 0, fuzzy: 0 };
  for (const name of names) {
    const unit = report.units.find(candidate => candidate.name === name), inventory = inventories.get(name);
    check(unit && (unit.functions === undefined || Array.isArray(unit.functions)) && Array.isArray(unit.sections),
      `${name} report shape is invalid`);
    const reportFunctions = unit.functions ?? [];
    const expectedMetadata = { complete: false, ...(name === "main/code" || claims.has(name.slice(4))
      ? { source_path: name === "main/code" ? "src/main" : sourcePaths.get(name.slice(4)) } : {}) };
    same(unit.metadata, expectedMetadata, `${name} completion/source metadata is unsupported`);
    check(reportFunctions.length === inventory.length, `${name} function count differs from inventory`);
    let code = 0, matchedCode = 0, matchedFunctions = 0, fuzzyBytes = 0, previousAddress = -1;
    for (let index = 0; index < inventory.length; index++) {
      const actual = reportFunctions[index], canonical = inventory[index];
      exactKeys(actual, actual.fuzzy_match_percent === undefined
        ? ["name", "size", "address", "metadata"] : ["name", "size", "address", "metadata", "fuzzy_match_percent"],
      `${name} function schema changed`);
      const size = integer(actual.size, "invalid report function size"), address = integer(actual.address,
        "invalid report function address"), score = actual.fuzzy_match_percent === undefined ? 0
          : percent(actual.fuzzy_match_percent, "invalid report function score");
      check(actual.name === canonical.name && size === canonical.size && address > previousAddress
        && Object.keys(actual.metadata).length === 0, `${name} function identity differs from inventory`);
      previousAddress = address; code += size; fuzzyBytes += size * score / 100;
      if (score === 100) { matchedCode += size; matchedFunctions++; }
      identities.push([name, actual.name, address, size, score]);
      const evidence = name === "main/code" ? mainEvidence : croEvidence.get(name.slice(4));
      if (score > 0) check(evidence?.has(actual.name) && (score < 100 || evidence.get(actual.name) === size),
        `${name} credits ${actual.name} without object evidence`);
      if (name !== "main/code") {
        const claim = claims.get(name.slice(4))?.get(actual.name);
        check((score === 100) === Boolean(claim), `${name} function credit differs from config claims`);
        if (claim) check(claim.address === canonical.location && claim.size === size,
          `${name} claim identity differs from inventory`);
      }
    }
    const data = unit.sections.filter(section => section.name !== ".text" && !section.name.startsWith(".text."))
      .reduce((sum, section) => sum + integer(section.size ?? 0, `${name} invalid section size`), 0);
    const sectionNames = unit.sections.map(section => section.name);
    check(sectionNames.every(section => typeof section === "string")
      && new Set(sectionNames).size === sectionNames.length, `${name} has duplicate/invalid sections`);
    for (const section of unit.sections) {
      check(section && typeof section === "object" && !Array.isArray(section)
        && Object.keys(section).every(key => ["name", "size", "fuzzy_match_percent", "metadata"].includes(key)),
      `${name} section schema changed`);
      check(section.metadata && Object.keys(section.metadata).length === 0, `${name} section metadata changed`);
      const sectionSize = integer(section.size ?? 0, `${name}.${section.name}.size`);
      sectionIdentities.push([name, section.name, sectionSize, section.fuzzy_match_percent ?? null]);
      if (section.fuzzy_match_percent !== undefined && section.name !== ".text")
        check(sectionSize === 0 && percent(section.fuzzy_match_percent,
          `${name}.${section.name}.fuzzy_match_percent`) === 100,
        `${name} grants unsupported section data credit`);
    }
    const textSection = unit.sections.find(section => section.name === ".text");
    const derivedTextSize = name === "main/code"
      ? Math.max(...reportFunctions.map(fn => integer(fn.address, "function address")
        + integer(fn.size, "function size"))) : textSizes.get(name);
    check(textSection && integer(textSection.size, `${name} text size`) === derivedTextSize,
      `${name} text section differs from function/partition evidence`);
    const measures = unit.measures;
    const measureKeys = new Set(["fuzzy_match_percent", "total_code", "matched_code",
      "matched_code_percent", "total_data", "matched_data", "matched_data_percent", "total_functions",
      "matched_functions", "matched_functions_percent", "complete_code_percent", "complete_data_percent",
      "total_units"]);
    check(measures && typeof measures === "object" && !Array.isArray(measures)
      && Object.keys(measures).every(key => measureKeys.has(key)), `${name} measure schema changed`);
    check(integer(measures.total_code ?? 0, `${name} total_code`) === code
      && integer(measures.matched_code ?? 0, `${name} matched_code`) === matchedCode
      && integer(measures.total_functions ?? 0, `${name} total_functions`) === inventory.length
      && integer(measures.matched_functions ?? 0, `${name} matched_functions`) === matchedFunctions
      && integer(measures.total_units, `${name} total_units`) === 1, `${name} derived measures differ`);
    check(integer(measures.total_data ?? 0, `${name} total_data`) === data,
      `${name} data measures differ from sections`);
    check(integer(measures.matched_data ?? 0, `${name} matched_data`) === 0,
      `${name} grants unsupported matched-data credit`);
    if (measures.matched_data_percent !== undefined)
      check(data === 0 && percent(measures.matched_data_percent, `${name} matched data percent`) === 100,
        `${name} grants unsupported matched-data credit`);
    if (measures.complete_code_percent !== undefined)
      check(percent(measures.complete_code_percent, `${name} complete code percent`) === 0,
        `${name} grants unsupported completion credit`);
    if (measures.complete_data_percent !== undefined)
      check(data === 0 && percent(measures.complete_data_percent, `${name} complete data percent`) === 100,
        `${name} grants unsupported complete-data credit`);
    closePercent(percent(measures.matched_code_percent ?? 0, `${name} code percent`), code ? matchedCode * 100 / code : 0,
      `${name} matched code percent differs`);
    closePercent(percent(measures.matched_functions_percent ?? 0, `${name} function percent`), inventory.length
      ? matchedFunctions * 100 / inventory.length : 0, `${name} matched function percent differs`);
    closePercent(percent(measures.fuzzy_match_percent ?? 0, `${name} fuzzy percent`), code ? fuzzyBytes * 100 / code : 0,
      `${name} fuzzy percent differs`);
    if (textSection.fuzzy_match_percent !== undefined)
      closePercent(percent(textSection.fuzzy_match_percent, `${name} text fuzzy percent`),
        measures.fuzzy_match_percent ?? 0, `${name} text credit differs from unit credit`);
    totals.code += code; totals.matchedCode += matchedCode; totals.data += data;
    totals.functions += inventory.length; totals.matchedFunctions += matchedFunctions; totals.fuzzy += fuzzyBytes;
  }
  check(sha256(JSON.stringify(identities)) === expected.reportFunctions, "report function identities/credit changed");
  check(sha256(JSON.stringify(sectionIdentities)) === expected.reportSections,
    "report section identities/credit changed");
  exactKeys(report.measures, ["fuzzy_match_percent", "total_code", "matched_code", "matched_code_percent",
    "total_data", "total_functions", "matched_functions", "matched_functions_percent", "total_units"],
  "root measure schema changed");
  check(integer(report.measures.total_code, "root total_code") === totals.code
    && integer(report.measures.matched_code, "root matched_code") === totals.matchedCode
    && integer(report.measures.total_data, "root total_data") === totals.data
    && integer(report.measures.total_functions, "root total_functions") === totals.functions
    && integer(report.measures.matched_functions, "root matched_functions") === totals.matchedFunctions
    && integer(report.measures.total_units, "root total_units") === UNIT_COUNT, "root aggregates differ");
  closePercent(percent(report.measures.matched_code_percent, "root code percent"), totals.matchedCode * 100 / totals.code,
    "root matched code percent differs");
  closePercent(percent(report.measures.matched_functions_percent, "root function percent"),
    totals.matchedFunctions * 100 / totals.functions, "root matched function percent differs");
  closePercent(percent(report.measures.fuzzy_match_percent, "root fuzzy percent"), totals.fuzzy * 100 / totals.code,
    "root fuzzy percent differs");
  exactKeys(project.progress, ["matchedCodePercent", "matchedFunctions", "totalFunctions", "completeUnits",
    "totalUnits"], "project progress schema changed");
  check(project.version === TARGET && project.progress.totalUnits === UNIT_COUNT
    && project.progress.totalFunctions === totals.functions
    && project.progress.matchedFunctions === totals.matchedFunctions
    && project.progress.matchedCodePercent === report.measures.matched_code_percent
    && project.progress.completeUnits === 0, "project aggregates differ from report");
  return { units: UNIT_COUNT, functions: totals.functions, matchedFunctions: totals.matchedFunctions,
    code: totals.code, matchedCode: totals.matchedCode, data: totals.data };
}

function loadSnapshot(root = ROOT, reportInput = `progress/reports/${TARGET}/report.json`) {
  const snapshot = new Map(), add = (path, limit) => snapshot.set(path, readStable(root, path, limit));
  for (const path of ["config/publication-units.json", `progress/units/${TARGET}.cro.json`,
    "progress/project.json", "config/sources.json",
    "config/cro-sources.json", "symbols/code.bin.csv"]) add(path);
  snapshot.set(`progress/reports/${TARGET}/report.json`, readStable(root, reportInput));
  const universe = parseJson(snapshot.get("config/publication-units.json"), "publication universe");
  for (const name of universe.units.slice(1)) {
    const stem = name.slice(4);
    add(`symbols/cro/${stem}.csv`); add(`symbols/cro-partitions/${stem}.json`);
  }
  const mainConfig = parseJson(snapshot.get("config/sources.json"), "main source config");
  const croConfig = parseJson(snapshot.get("config/cro-sources.json"), "CRO source config");
  const { paths, claims } = sourceEntries(mainConfig, croConfig);
  for (const path of paths) add(path);
  add(`build/${TARGET}/base/code.o`, MAX_OBJECT);
  for (const stem of claims.keys()) add(`build/${TARGET}/base/cro-code/${stem}.o`, MAX_OBJECT);
  return snapshot;
}

function selfTest(snapshot) {
  const reject = action => assert.throws(action);
  const mutateJson = (path, update) => {
    const copy = new Map(snapshot), value = parseJson(copy.get(path), path); update(value);
    copy.set(path, Buffer.from(JSON.stringify(value))); return copy;
  };
  const reportPath = `progress/reports/${TARGET}/report.json`;
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[0].functions[0].name = "func_00ABCDEF")));
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[0].functions[0].address = "4")));
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[0].functions[0].size = "4")));
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[0].functions[0].fuzzy_match_percent = 100)));
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[1].functions.push({
    name: "func_00ABCDEF", size: "4", address: "999999", fuzzy_match_percent: 100, metadata: {} }))))
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[1].measures.total_data = "999")));
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.units[0].metadata.complete = true)));
  reject(() => validateSnapshot(mutateJson(reportPath, value => value.measures.matched_functions++)));
  const coordinated = mutateJson("config/publication-units.json", value => value.units[1] = "cro/DllGhost");
  coordinated.set(`progress/units/${TARGET}.cro.json`, Buffer.from(JSON.stringify({
    ...parseJson(coordinated.get(`progress/units/${TARGET}.cro.json`)), units: [{ name: "cro/DllGhost", size: 4,
      sha256: "0".repeat(64) }, ...parseJson(coordinated.get(`progress/units/${TARGET}.cro.json`)).units.slice(1)] })));
  const coordinatedReport = parseJson(coordinated.get(reportPath), reportPath);
  coordinatedReport.units.find(unit => unit.name === "cro/DllBackGround").name = "cro/DllGhost";
  coordinated.set(reportPath, Buffer.from(JSON.stringify(coordinatedReport)));
  const coordinatedConfig = parseJson(coordinated.get("config/cro-sources.json"), "CRO config");
  coordinatedConfig.units.find(unit => unit.name === "DllBackGround").name = "DllGhost";
  coordinated.set("config/cro-sources.json", Buffer.from(JSON.stringify(coordinatedConfig)));
  reject(() => validateSnapshot(coordinated));
  const laundered = new Map(snapshot), launderedReport = parseJson(laundered.get(reportPath), reportPath);
  const main = launderedReport.units.find(unit => unit.name === "main/code");
  const partial = main.functions.find(fn => fn.name === "func_003A6544");
  partial.fuzzy_match_percent = 100;
  main.measures.matched_code = String(Number(main.measures.matched_code) + Number(partial.size));
  main.measures.matched_functions++;
  launderedReport.measures.matched_code = String(Number(launderedReport.measures.matched_code) + Number(partial.size));
  launderedReport.measures.matched_functions++;
  laundered.set(reportPath, Buffer.from(JSON.stringify(launderedReport)));
  const launderedProject = parseJson(laundered.get("progress/project.json"), "project");
  launderedProject.progress.matchedFunctions++;
  laundered.set("progress/project.json", Buffer.from(JSON.stringify(launderedProject)));
  reject(() => validateSnapshot(laundered));
  const dataLaundered = new Map(snapshot), dataReport = parseJson(dataLaundered.get(reportPath), reportPath);
  const dataUnit = dataReport.units.find(unit => unit.name === "cro/DllBackGround");
  dataUnit.sections.find(section => section.name === ".data").size = "999";
  dataUnit.measures.total_data = String(Number(dataUnit.measures.total_data) + 999);
  dataReport.measures.total_data = String(Number(dataReport.measures.total_data) + 999);
  dataLaundered.set(reportPath, Buffer.from(JSON.stringify(dataReport)));
  reject(() => validateSnapshot(dataLaundered));
  reject(() => parseJson(Buffer.from('{"a":1,"\\u0061":2}'), "duplicate fixture"));

  const temporary = mkdtempSync(join(ROOT, ".publication-integrity-test-"));
  try {
    const root = join(temporary, "repo"); mkdirSync(join(root, "inputs"), { recursive: true });
    writeFileSync(join(root, "inputs/value"), "stable");
    same(readStable(root, "inputs/value").toString(), "stable", "stable read failed");
    reject(() => readStable(root, "inputs/../inputs/value"));
    const outside = join(temporary, "outside"); writeFileSync(outside, "outside");
    symlinkSync(outside, join(root, "inputs/link")); reject(() => readStable(root, "inputs/link"));
    symlinkSync(join(root, "inputs"), join(root, "linked-inputs"), "dir");
    reject(() => readStable(root, "linked-inputs/value"));
    linkSync(join(root, "inputs/value"), join(root, "inputs/hard")); reject(() => readStable(root, "inputs/value"));
    rmSync(join(root, "inputs/hard"));
    let churned = false;
    const churnIo = { ...IO, readSync(...args) {
      if (!churned) { churned = true; writeFileSync(join(root, "inputs/unrelated"), "churn"); }
      return IO.readSync(...args);
    } };
    same(readStable(root, "inputs/value", MAX_INPUT, churnIo).toString(), "stable",
      "unrelated ancestor churn changed validation");
    check(churned, "ancestor churn fixture did not execute");
    const fifo = join(root, "inputs/fifo");
    const made = process.platform === "linux" && spawnSync("mkfifo", [fifo]).status === 0;
    if (made) reject(() => readStable(root, "inputs/fifo"));
    const original = IO, moved = join(temporary, "moved"), input = "inputs/value";
    let injected = false;
    const raceIo = { ...original, readSync(...args) {
      if (!injected) { injected = true; renameSync(join(root, "inputs"), moved); symlinkSync(moved, join(root, "inputs"), "dir"); }
      return original.readSync(...args);
    } };
    reject(() => readStable(root, input, MAX_INPUT, raceIo));
    check(injected, "race fixture did not execute");
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}

export function validatePublicationTree({ root = ROOT,
  reportInput = `progress/reports/${TARGET}/report.json`, runSelfTest = false } = {}) {
  const snapshot = loadSnapshot(root, reportInput);
  const result = validateSnapshot(snapshot);
  if (runSelfTest) selfTest(snapshot);
  const reportBytes = Buffer.from(snapshot.get(`progress/reports/${TARGET}/report.json`));
  return { ...result, reportBytes, report: parseJson(reportBytes, "validated report") };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) try {
  check(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === "--self-test"),
    "usage: validate-publication-integrity.mjs [--self-test]");
  const runSelfTest = process.argv[2] === "--self-test";
  const result = validatePublicationTree({ runSelfTest });
  console.log(`Validated fixed publication: ${result.units} units, ${result.functions} functions, `
    + `${result.matchedFunctions} exact functions, ${result.matchedCode}/${result.code} code bytes, `
    + `${result.data} data bytes; hostile tests ${runSelfTest ? "passed" : "not run"}.`);
} catch (error) {
  console.error(`Publication integrity validation failed: ${error.message}`);
  process.exitCode = 1;
}
