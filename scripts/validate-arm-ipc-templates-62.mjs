#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-ipc-templates-62.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

function command(program, args) {
  return execFileSync(program, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parseSource() {
  check(config.schemaVersion === 1, "unsupported schemaVersion");
  check(config.mode === "arm", "batch must use ARM mode");
  check(/^[0-9a-f]{64}$/.test(config.sourceSha256 ?? ""), "sourceSha256 is missing or malformed");
  check(sha256(source) === config.sourceSha256, "sourceSha256 does not match the assembly source");
  check(config.functions.length === 15, "expected exactly 15 functions");
  check(new Set(config.functions.map(({ name }) => name)).size === 15, "function names must be unique");
  check(config.functions.reduce((sum, fn) => sum + fn.size, 0) === 864, "function sizes must total 864 bytes");
  check(config.totalBodySize === 864, "totalBodySize must be 864");
  check(config.cumulativePoolSlots === 686 && config.cumulativePoolClasses === 364,
    "cumulative literal accounting must be 686/364");

  const lines = source.split(/\r?\n/).map((line) => line.trim());
  const bodies = new Map();
  let current = null;
  for (const line of lines) {
    const begin = /^BEGIN\s+(\w+)$/.exec(line);
    const end = /^END\s+(\w+)$/.exec(line);
    if (begin) {
      check(current === null, `nested BEGIN at ${begin[1]}`);
      current = { name: begin[1], instructions: [] };
      check(!bodies.has(current.name), `duplicate BEGIN for ${current.name}`);
      continue;
    }
    if (end) {
      check(current !== null && current.name === end[1], `mismatched END for ${end[1]}`);
      bodies.set(current.name, current.instructions);
      current = null;
      continue;
    }
    if (current && line && !line.startsWith(".") && !line.startsWith("@")) {
      current.instructions.push(line);
    }
  }
  check(current === null, "unterminated function body");
  check(bodies.size === config.functions.length, "source function count differs from config");

  for (const fn of config.functions) {
    const instructions = bodies.get(fn.name);
    check(instructions, `source is missing ${fn.name}`);
    check(instructions.length * 4 === fn.size,
      `${fn.name}: source body is ${instructions.length * 4} bytes, expected ${fn.size}`);
  }

  const sourceCalls = [];
  for (const [name, instructions] of bodies) {
    instructions.forEach((instruction, index) => {
      const match = /^bl\s+(\w+)$/.exec(instruction);
      if (match) sourceCalls.push({ name, offset: index * 4, symbol: match[1] });
    });
  }
  const configuredCalls = config.functions.flatMap((fn) =>
    fn.branches.map((branch) => ({ name: fn.name, offset: branch.offset, symbol: branch.symbol,
      kind: branch.kind, mnemonic: branch.mnemonic })));
  check(sourceCalls.length === 3 && configuredCalls.length === 3, "expected exactly three direct calls");
  for (const expected of configuredCalls) {
    check(expected.kind === "R_ARM_CALL" && expected.mnemonic === "bl",
      `${expected.name}: invalid direct-call contract`);
    check(sourceCalls.some((call) => call.name === expected.name && call.offset === expected.offset &&
      call.symbol === expected.symbol), `${expected.name}: source call does not match config`);
  }

  const words = lines.flatMap((line, index) => {
    const match = /^\.word\s+(\w+)$/.exec(line);
    return match ? [{ line: index, symbol: match[1] }] : [];
  });
  const configuredLiterals = config.functions.flatMap((fn) =>
    fn.literals.map((literal) => ({ name: fn.name, ...literal })));
  check(words.length === 2 && configuredLiterals.length === 2, "expected exactly two literal slots");
  check(words.every(({ symbol }) => symbol === "service_record_tag_62"),
    "both literal slots must use service_record_tag_62");
  check(configuredLiterals.every(({ symbol }) => symbol === "service_record_tag_62"),
    "configured literals must share service_record_tag_62");
  check(JSON.stringify(config.literalIdentities) === JSON.stringify(["service_record_tag_62"]) &&
    JSON.stringify(config.newLiteralIdentities) === JSON.stringify(["service_record_tag_62"]) &&
    config.reusedLiteralIdentities.length === 0, "literal identity classes do not match the contract");

  const contract = config.branchIdentityContract;
  check(contract.mode === "arm" && contract.minimumAlignment === 4 &&
    contract.secondaryEntries.length === 0 && contract.sharedClasses.length === 0 &&
    contract.classesPairwiseDistinct === true, "branch identity contract is malformed");
  const callSymbols = configuredCalls.map(({ symbol }) => symbol);
  check(new Set(callSymbols).size === 3 &&
    JSON.stringify(contract.primaryEntries) === JSON.stringify(callSymbols) &&
    JSON.stringify(contract.singletonClasses) === JSON.stringify(callSymbols),
    "direct-call identities must be three pairwise-distinct primary entries");
}

function parseSections(output) {
  const byName = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)/.exec(line);
    if (match) byName.set(match[2], { index: Number(match[1]), type: match[3], size: parseInt(match[4], 16) });
  }
  return byName;
}

function parseSymbols(output) {
  const symbols = [];
  for (const line of output.split(/\r?\n/)) {
    const match = /^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/.exec(line);
    if (match) symbols.push({ value: parseInt(match[1], 16), size: Number(match[2]), type: match[3],
      bind: match[4], visibility: match[5], ndx: match[6], name: match[7] });
  }
  return symbols;
}

function parseRelocations(output) {
  const bySection = new Map();
  let section = null;
  for (const line of output.split(/\r?\n/)) {
    const heading = /^Relocation section '(?:\.rel|\.rela)([^']+)'/.exec(line);
    if (heading) {
      section = heading[1];
      if (!bySection.has(section)) bySection.set(section, []);
      continue;
    }
    if (!section) continue;
    const match = /^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/.exec(line);
    if (match) bySection.get(section).push({ offset: parseInt(match[1], 16), kind: match[2], symbol: match[3] });
  }
  return bySection;
}

function validateObject(objectPath, readelf) {
  const absoluteObject = resolve(process.cwd(), objectPath);
  const header = command(readelf, ["-hW", absoluteObject]);
  check(/Machine:\s+ARM\b/.test(header), "object is not for ARM");
  check(/Type:\s+REL\b/.test(header), "object must be relocatable");

  const sections = parseSections(command(readelf, ["-SW", absoluteObject]));
  const symbols = parseSymbols(command(readelf, ["-sW", absoluteObject]));
  const relocations = parseRelocations(command(readelf, ["-rW", absoluteObject]));

  for (const fn of config.functions) {
    const sectionName = `.text.${fn.name}`;
    const section = sections.get(sectionName);
    check(section?.type === "PROGBITS", `${fn.name}: missing executable PROGBITS section`);
    const expectedSectionSize = fn.size + fn.literals.length * 4;
    check(section.size === expectedSectionSize,
      `${fn.name}: section size ${section.size}, expected ${expectedSectionSize}`);
    const candidates = symbols.filter((symbol) => symbol.name === fn.name);
    check(candidates.length === 1, `${fn.name}: expected one symbol`);
    const symbol = candidates[0];
    check(symbol.value === 0 && symbol.size === fn.size && symbol.type === "FUNC" &&
      symbol.bind === "GLOBAL" && Number(symbol.ndx) === section.index,
      `${fn.name}: symbol metadata does not match the contract`);

    const expectedRelocations = [
      ...fn.branches.map(({ offset, kind, symbol: target }) => ({ offset, kind, symbol: target })),
      ...fn.literals.map(({ offset, symbol: target }) => ({ offset, kind: "R_ARM_ABS32", symbol: target })),
    ].sort((a, b) => a.offset - b.offset);
    const actualRelocations = (relocations.get(sectionName) ?? []).sort((a, b) => a.offset - b.offset);
    check(actualRelocations.length === expectedRelocations.length,
      `${fn.name}: relocation count ${actualRelocations.length}, expected ${expectedRelocations.length}`);
    expectedRelocations.forEach((expected, index) => {
      const actual = actualRelocations[index];
      check(actual.offset === expected.offset && actual.kind === expected.kind && actual.symbol === expected.symbol,
        `${fn.name}: relocation at index ${index} does not match the contract`);
    });
  }
}

try {
  check(process.argv.length === 2 || process.argv.length === 4,
    "usage: validate-arm-ipc-templates-62.mjs [objectPath readelf]");
  parseSource();
  if (process.argv.length === 4) validateObject(process.argv[2], process.argv[3]);
  console.log(`arm-ipc-templates-62: validated source${process.argv.length === 4 ? " and object" : ""} (15 functions, 864 body bytes, 3 calls, 2 literal slots, cumulative 686/364)`);
} catch (error) {
  console.error(`arm-ipc-templates-62: ${error.message}`);
  process.exitCode = 1;
}
