#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultConfig = resolve(repoRoot, "config/arm-ipc-templates-60.json");

function fail(message) {
  throw new Error(`arm IPC templates 60: ${message}`);
}

function absoluteFromRoot(path) {
  return isAbsolute(path) ? path : resolve(repoRoot, path);
}

function run(program, args) {
  try {
    return execFileSync(program, args, {
      encoding: "utf8",
      maxBuffer: MAX_BUFFER,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    fail(`${program} ${args.join(" ")} failed: ${detail}`);
  }
}

function parseArguments(argv) {
  let objectPath = null;
  let configPath = defaultConfig;

  for (let i = 0; i < argv.length; i += 1) {
    const argument = argv[i];
    if (argument === "--object") {
      if (++i >= argv.length) fail("--object requires a path");
      objectPath = absoluteFromRoot(argv[i]);
    } else if (argument === "--config") {
      if (++i >= argv.length) fail("--config requires a path");
      configPath = absoluteFromRoot(argv[i]);
    } else if (!argument.startsWith("-") && objectPath === null) {
      objectPath = absoluteFromRoot(argument);
    } else {
      fail(`unknown argument ${argument}`);
    }
  }

  return { objectPath, configPath };
}

function validateConfig(config) {
  if (config.schemaVersion !== 1) fail("unsupported config schema");
  if (config.mode !== "arm") fail("config mode must be arm");
  if (!Array.isArray(config.functions) || config.functions.length !== 13) {
    fail("config must describe exactly 13 functions");
  }

  const names = new Set();
  let totalSize = 0;
  let callCount = 0;
  for (const fn of config.functions) {
    if (!/^func_[0-9A-F]{8}$/.test(fn.name)) fail(`invalid function name ${fn.name}`);
    if (names.has(fn.name)) fail(`duplicate function ${fn.name}`);
    names.add(fn.name);
    if (!Number.isInteger(fn.size) || fn.size <= 0 || fn.size % 4 !== 0) {
      fail(`invalid size for ${fn.name}`);
    }
    totalSize += fn.size;
    if (!Array.isArray(fn.branches) || !Array.isArray(fn.literals)) {
      fail(`missing branch/literal arrays for ${fn.name}`);
    }
    if (fn.literals.length !== 0) fail(`${fn.name} must have zero literal slots`);
    for (const branch of fn.branches) {
      if (branch.kind !== "R_ARM_CALL" || branch.mnemonic !== "bl") {
        fail(`invalid direct-call contract in ${fn.name}`);
      }
      if (!Number.isInteger(branch.offset) || branch.offset < 0 || branch.offset % 4 !== 0) {
        fail(`invalid direct-call offset in ${fn.name}`);
      }
      callCount += 1;
    }
  }
  if (totalSize !== config.totalBodySize || totalSize !== 924) {
    fail(`body-size sum is ${totalSize}, expected 924`);
  }
  if (callCount !== 16) fail(`direct-call count is ${callCount}, expected 16`);
  if (config.literalIdentities?.length !== 0 || config.reusedLiteralIdentities?.length !== 0 ||
      config.newLiteralIdentities?.length !== 0) {
    fail("literal identity arrays must be empty");
  }
}

function bodyFor(source, name) {
  const begin = `BEGIN ${name}`;
  const end = `END ${name}`;
  const beginAt = source.indexOf(begin);
  const endAt = source.indexOf(end, beginAt + begin.length);
  if (beginAt < 0 || endAt < 0) fail(`source body missing for ${name}`);
  return source.slice(beginAt + begin.length, endAt);
}

function sourceInstructions(body) {
  return body.split(/\r?\n/)
    .map((line) => line.replace(/@.*$/, "").trim())
    .filter((line) => line && !line.endsWith(":") && !line.startsWith("."));
}

function validateSource(config, source) {
  const digest = createHash("sha256").update(source).digest("hex");
  if (digest !== config.sourceSha256) {
    fail(`source SHA-256 mismatch: got ${digest}`);
  }
  if (/\.(?:word|long)|\.ltorg|\.pool|\bldr\s+\w+\s*,\s*=/im.test(source)) {
    fail("source contains a forbidden literal-pool construct");
  }

  const declaredBodies = [...source.matchAll(/^BEGIN\s+(func_[0-9A-F]{8})\s*$/gm)].map((m) => m[1]);
  const expectedBodies = config.functions.map((fn) => fn.name);
  if (JSON.stringify(declaredBodies) !== JSON.stringify(expectedBodies)) {
    fail("source function order does not match config");
  }

  for (const fn of config.functions) {
    const instructions = sourceInstructions(bodyFor(source, fn.name));
    if (instructions.length * 4 !== fn.size) {
      fail(`${fn.name} has ${instructions.length * 4} source bytes, expected ${fn.size}`);
    }
    const calls = instructions
      .map((instruction, index) => ({ instruction, offset: index * 4 }))
      .filter(({ instruction }) => /^bl\s+/.test(instruction))
      .map(({ instruction, offset }) => ({
        offset,
        kind: "R_ARM_CALL",
        mnemonic: "bl",
        symbol: instruction.replace(/^bl\s+/, "").trim(),
      }));
    if (JSON.stringify(calls) !== JSON.stringify(fn.branches)) {
      fail(`${fn.name} source calls do not match config`);
    }
  }
}

function readelfTool() {
  return process.env.ARM_READELF || process.env.READELF || "readelf";
}

function parseSectionSizes(output) {
  const sizes = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*\[\s*\d+\]\s+(\S+)\s+\S+\s+[0-9a-f]+\s+[0-9a-f]+\s+([0-9a-f]+)/i);
    if (match) sizes.set(match[1], Number.parseInt(match[2], 16));
  }
  return sizes;
}

function parseRelocations(output) {
  const relocations = new Map();
  let functionName = null;
  for (const line of output.split(/\r?\n/)) {
    const heading = line.match(/^Relocation section '\.rel(?:a)?\.text\.(func_[0-9A-F]{8})'/);
    if (heading) {
      functionName = heading[1];
      relocations.set(functionName, []);
      continue;
    }
    if (line.startsWith("Relocation section ")) functionName = null;
    if (functionName === null) continue;
    const entry = line.match(/^\s*([0-9a-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/i);
    if (entry) {
      relocations.get(functionName).push({
        offset: Number.parseInt(entry[1], 16),
        kind: entry[2],
        symbol: entry[3],
      });
    }
  }
  return relocations;
}

function validateObject(config, objectPath) {
  const tool = readelfTool();
  const header = run(tool, ["-hW", objectPath]);
  if (!/^\s*Class:\s+ELF32\s*$/m.test(header) || !/^\s*Machine:\s+ARM\s*$/m.test(header)) {
    fail("object is not an ELF32 ARM object");
  }

  const sections = parseSectionSizes(run(tool, ["-SW", objectPath]));
  const relocations = parseRelocations(run(tool, ["-rW", objectPath]));
  let totalSize = 0;
  let totalRelocations = 0;
  for (const fn of config.functions) {
    const section = `.text.${fn.name}`;
    const size = sections.get(section);
    if (size !== fn.size) fail(`${section} size is ${size ?? "missing"}, expected ${fn.size}`);
    totalSize += size;

    const actual = relocations.get(fn.name) ?? [];
    const expected = fn.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol }));
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`${fn.name} relocations do not match config`);
    }
    totalRelocations += actual.length;
  }
  if (totalSize !== 924 || totalRelocations !== 16) {
    fail(`object totals are ${totalSize} bytes and ${totalRelocations} relocations`);
  }
}

const { objectPath, configPath } = parseArguments(process.argv.slice(2));
const config = JSON.parse(readFileSync(configPath, "utf8"));
validateConfig(config);
const sourcePath = absoluteFromRoot(config.source);
const source = readFileSync(sourcePath, "utf8");
validateSource(config, source);
if (objectPath !== null) validateObject(config, objectPath);

console.log(
  objectPath === null
    ? "arm IPC templates 60: source/config validation passed (object validation not requested)"
    : "arm IPC templates 60: source/config/object validation passed",
);
