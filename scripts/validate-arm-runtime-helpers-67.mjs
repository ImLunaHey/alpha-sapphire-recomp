#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-runtime-helpers-67.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath, "utf8");

function fail(message) {
  throw new Error(`arm-runtime-helpers-67: ${message}`);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function runReadelf(readelf, args) {
  try {
    return execFileSync(readelf, args, {
      encoding: "utf8",
      maxBuffer: MAX_BUFFER,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    fail(`${readelf} ${args.join(" ")} failed: ${detail}`);
  }
}

function validateSource() {
  check(config.schemaVersion === 1, "unsupported config schema");
  check(config.mode === "arm", "config mode must be arm");
  check(config.totalAdjacentSize === 0, "adjacent data must be empty");
  check(Array.isArray(config.pcRelativeDataAccesses) && config.pcRelativeDataAccesses.length === 0,
    "PC-relative data access list must be empty");

  const digest = createHash("sha256").update(source).digest("hex");
  check(digest === config.sourceSha256,
    `source SHA-256 mismatch (expected ${config.sourceSha256}, got ${digest})`);

  for (const directive of [".syntax unified", ".arch armv6k", ".fpu vfpv2", ".arm"]) {
    check(source.split(/\r?\n/).includes(directive), `missing ${directive}`);
  }

  const sectionNames = [...source.matchAll(/^\.section \.text\.([A-Za-z0-9_]+),"ax",%progbits$/gm)]
    .map((match) => match[1]);
  const expectedNames = config.functions.map(({ name }) => name);
  check(JSON.stringify(sectionNames) === JSON.stringify(expectedNames),
    "function section order does not match config");

  for (const { name, calls, adjacentWords } of config.functions) {
    check(Array.isArray(calls) && calls.length === 0, `${name} must be call-free`);
    check(Array.isArray(adjacentWords) && adjacentWords.length === 0,
      `${name} must have no adjacent words`);
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    check(new RegExp(`^\\.global ${escaped}$`, "m").test(source), `${name}: missing global directive`);
    check(new RegExp(`^\\.type ${escaped}, %function$`, "m").test(source), `${name}: missing function type`);
    check(new RegExp(`^${escaped}:$`, "m").test(source), `${name}: missing entry label`);
    check(new RegExp(`^\\.size ${escaped}, \\.-${escaped}$`, "m").test(source), `${name}: missing size directive`);
  }

  const total = config.functions.reduce((sum, fn) => sum + fn.size, 0);
  check(total === config.totalBodySize,
    `configured body sizes total ${total}, expected ${config.totalBodySize}`);
}

function validateObject(objectPath, readelf) {
  const header = runReadelf(readelf, ["-W", "-h", objectPath]);
  check(/^\s*Class:\s+ELF32\s*$/m.test(header), "object is not ELF32");
  check(/^\s*Type:\s+REL\b/m.test(header), "object is not relocatable");
  check(/^\s*Machine:\s+ARM\s*$/m.test(header), "object machine is not ARM");

  const sections = runReadelf(readelf, ["-W", "-S", objectPath]);
  for (const { name, size } of config.functions) {
    const sectionName = `.text.${name}`;
    const line = sections.split(/\r?\n/).find((candidate) =>
      new RegExp(`\\]\\s+${sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`).test(candidate));
    check(line, `${name}: missing ${sectionName}`);
    const fields = line.trim().split(/\s+/);
    const nameIndex = fields.indexOf(sectionName);
    check(nameIndex >= 0 && fields.length > nameIndex + 4, `${name}: unreadable section record`);
    const actualSize = Number.parseInt(fields[nameIndex + 4], 16);
    check(actualSize === size,
      `${name}: section size ${actualSize} does not match configured ${size}`);
  }

  const symbols = runReadelf(readelf, ["-W", "-s", objectPath]);
  for (const { name, size } of config.functions) {
    const rows = symbols.split(/\r?\n/).filter((line) => line.trim().endsWith(` ${name}`));
    check(rows.length === 1, `${name}: expected exactly one symbol, found ${rows.length}`);
    const fields = rows[0].trim().split(/\s+/);
    check(Number.parseInt(fields[2], 10) === size, `${name}: symbol size mismatch`);
    check(fields[3] === "FUNC", `${name}: symbol is not FUNC`);
    check(fields[4] === "GLOBAL", `${name}: symbol is not GLOBAL`);
    check(fields[6] !== "UND", `${name}: symbol is undefined`);
  }

  const relocations = runReadelf(readelf, ["-W", "-r", objectPath]);
  const ownedSections = new Set(config.functions.map(({ name }) => `.text.${name}`));
  let relocatedSection;
  for (const line of relocations.split(/\r?\n/)) {
    const heading = line.match(/^Relocation section '(\.rela?\.\S+)'/);
    if (heading) {
      relocatedSection = heading[1].replace(/^\.rela?/, "");
      continue;
    }
    if (ownedSections.has(relocatedSection) && /^\s*[0-9a-f]+\s+[0-9a-f]+\s+\S+/i.test(line)) {
      fail(`${relocatedSection} contains a relocation`);
    }
  }
}

const args = process.argv.slice(2);
check(args.length === 0 || args.length === 2,
  "usage: validate-arm-runtime-helpers-67.mjs [objectPath readelf]");
validateSource();
if (args.length === 2) validateObject(resolve(args[0]), args[1]);

console.log(`arm-runtime-helpers-67: validated ${config.functions.length} functions (${config.totalBodySize} bytes)${args.length ? ", zero relocations" : " (source only)"}`);
