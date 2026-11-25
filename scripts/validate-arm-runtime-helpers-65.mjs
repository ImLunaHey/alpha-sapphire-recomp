#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { armReadelf } from "./arm-readelf.mjs";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-runtime-helpers-65.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const sourcePath = resolve(root, config.source);
const source = readFileSync(sourcePath, "utf8");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function finish(mode) {
  if (failures.length) {
    for (const failure of failures) console.error(`error: ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `validated arm-runtime-helpers-65 (${config.functions.length} functions, ` +
      `${config.totalBodySize} body bytes, ${config.totalAdjacentSize} adjacent bytes; ${mode})`,
  );
}

function inspectSource() {
  check(config.schemaVersion === 1, "unsupported config schema version");
  check(config.mode === "arm", "config mode must be arm");
  check(config.totalAdjacentSize === 0, "batch must have zero adjacent data");
  check(config.pcRelativeDataAccesses?.length === 0, "PC-relative data accesses must be empty");
  check(Object.keys(config.symbolicIdentities ?? {}).length === 0, "symbolic identities must be empty");
  check(Object.keys(config.symbolicSlots ?? {}).length === 0, "symbolic slots must be empty");

  const digest = createHash("sha256").update(source).digest("hex");
  check(digest === config.sourceSha256, `source SHA-256 mismatch: got ${digest}`);
  check(/^\.syntax unified$/m.test(source), "source must select unified syntax");
  check(/^\.arch armv6k$/m.test(source), "source must select ARMv6K");
  check(/^\.arm$/m.test(source), "source must select ARM state");
  check(!/^\s*\.(?:word|long|quad|byte|hword|short|incbin|ltorg|pool)\b/m.test(source), "source contains adjacent or literal-pool data");
  check(!/\bpc\b/i.test(source), "source contains a PC-relative/PC-register operand");
  check(!/^\s*blx?\b/im.test(source), "source contains a call instruction");

  const configuredNames = new Set(config.functions.map(({ name }) => name));
  const globalNames = [...source.matchAll(/^\.global\s+(\S+)$/gm)].map((match) => match[1]);
  check(globalNames.length === configuredNames.size, "unexpected number of global symbols");
  check(globalNames.every((name) => configuredNames.has(name)), "source exports a symbol outside the batch");

  let bodyTotal = 0;
  for (const fn of config.functions) {
    check(Array.isArray(fn.calls) && fn.calls.length === 0, `${fn.name}: calls must be empty`);
    check(Array.isArray(fn.adjacentWords) && fn.adjacentWords.length === 0, `${fn.name}: adjacent words must be empty`);
    const section = `.section .text.${fn.name},"ax",%progbits`;
    check(source.includes(section), `${fn.name}: missing dedicated executable section`);
    check(source.includes(`.type ${fn.name}, %function`), `${fn.name}: missing function type`);
    check(source.includes(`.size ${fn.name}, .-${fn.name}`), `${fn.name}: missing exact size directive`);

    const escaped = fn.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockMatch = source.match(
      new RegExp(`^${escaped}:\\n([\\s\\S]*?)^\\.size ${escaped}, \\.-${escaped}$`, "m"),
    );
    check(Boolean(blockMatch), `${fn.name}: cannot locate function body`);
    if (!blockMatch) continue;

    const labels = new Set(
      [...blockMatch[1].matchAll(/^([.$A-Za-z_][\w.$]*):$/gm)].map((match) => match[1]),
    );
    const instructions = blockMatch[1]
      .split("\n")
      .map((line) => line.replace(/@.*$/, "").trim())
      .filter((line) => line && !line.startsWith(".") && !line.endsWith(":"));
    const actualSize = instructions.length * 4;
    check(actualSize === fn.size, `${fn.name}: source body is ${actualSize} bytes, expected ${fn.size}`);

    for (const instruction of instructions) {
      const branch = instruction.match(/^b(?:eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\s+([^\s,]+)$/i);
      if (branch) check(labels.has(branch[1]), `${fn.name}: branch leaves function: ${instruction}`);
    }
    bodyTotal += actualSize;
  }
  check(bodyTotal === config.totalBodySize, `source body total is ${bodyTotal}, expected ${config.totalBodySize}`);
}

function runReadelf(readelf, args) {
  const result = spawnSync(readelf, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) throw new Error(`${readelf}: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${readelf} ${args.join(" ")} failed: ${result.stderr.trim()}`);
  return result.stdout;
}

function inspectObject(objectPath, readelf) {
  const headerText = runReadelf(readelf, ["-hW", objectPath]);
  const sectionText = runReadelf(readelf, ["-SW", objectPath]);
  const symbolText = runReadelf(readelf, ["-sW", objectPath]);
  const relocationText = runReadelf(readelf, ["-rW", objectPath]);
  check(/^\s*Machine:\s+ARM\s*$/m.test(headerText), "object is not an ARM ELF file");

  const sections = new Map();
  for (const line of sectionText.split("\n")) {
    const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+\S+\s+(\S+)/i);
    if (match) {
      sections.set(Number(match[1]), {
        name: match[2],
        type: match[3],
        address: Number.parseInt(match[4], 16),
        size: Number.parseInt(match[6], 16),
        flags: match[7],
      });
    }
  }

  const symbols = new Map();
  for (const line of symbolText.split("\n")) {
    const match = line.match(/^\s*\d+:\s+([0-9a-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/i);
    if (!match || !config.functions.some(({ name }) => name === match[7])) continue;
    const entries = symbols.get(match[7]) ?? [];
    entries.push({
      value: Number.parseInt(match[1], 16),
      size: Number(match[2]),
      type: match[3],
      bind: match[4],
      visibility: match[5],
      index: match[6],
    });
    symbols.set(match[7], entries);
  }

  const liveSymbols = new Map();
  for (const fn of config.functions) {
    const entries = (symbols.get(fn.name) ?? []).filter(({ index }) => /^\d+$/.test(index));
    check(entries.length === 1, `${fn.name}: expected one defined symbol, found ${entries.length}`);
    if (entries.length !== 1) continue;
    const symbol = entries[0];
    const section = sections.get(Number(symbol.index));
    check(symbol.type === "FUNC", `${fn.name}: symbol type is ${symbol.type}, expected FUNC`);
    check(symbol.bind === "GLOBAL", `${fn.name}: symbol binding is ${symbol.bind}, expected GLOBAL`);
    check(symbol.size === fn.size, `${fn.name}: object size is ${symbol.size}, expected ${fn.size}`);
    check(Boolean(section), `${fn.name}: section index ${symbol.index} is missing`);
    check(section?.flags.includes("X"), `${fn.name}: containing section is not executable`);
    if (section?.name === `.text.${fn.name}`) {
      check(section.size === fn.size, `${fn.name}: dedicated section size is ${section.size}, expected ${fn.size}`);
    }
    liveSymbols.set(fn.name, { ...symbol, section });
  }

  let relocationSection = "";
  for (const line of relocationText.split("\n")) {
    const heading = line.match(/^Relocation section '(\.rela?\.\S+)'/);
    if (heading) {
      relocationSection = heading[1].replace(/^\.rela?/, "");
      continue;
    }
    const entry = line.match(/^\s*([0-9a-f]+)\s+[0-9a-f]+\s+\S+/i);
    if (!entry) continue;
    const offset = Number.parseInt(entry[1], 16);
    for (const fn of config.functions) {
      const symbol = liveSymbols.get(fn.name);
      if (!symbol?.section || symbol.section.name !== relocationSection) continue;
      const start = symbol.value - symbol.section.address;
      if (offset >= start && offset < start + symbol.size) {
        failures.push(`${fn.name}: relocation at offset 0x${offset.toString(16)}`);
      }
    }
  }
}

if (process.argv.length > 4) {
  console.error("usage: validate-arm-runtime-helpers-65.mjs [object-path [readelf]]");
  process.exit(2);
}

inspectSource();
if (process.argv[2]) {
  try {
    inspectObject(resolve(process.cwd(), process.argv[2]), process.argv[3] ?? armReadelf());
  } catch (error) {
    failures.push(error.message);
  }
}
finish(process.argv[2] ? "source + object" : "source only");
