#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { armReadelf } from "./arm-readelf.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "config/arm-ipc-templates-61.json");
const expectedFunctions = new Map([
  ["func_00176684", 32],
  ["func_001766A4", 32],
  ["func_001766C4", 60],
  ["func_00176700", 60],
  ["func_0017673C", 60],
  ["func_00176778", 60],
  ["func_001767CC", 40],
  ["func_001767F4", 44],
  ["func_00176820", 96],
  ["func_00176880", 32],
  ["func_001768A0", 40],
  ["func_001768C8", 52],
  ["func_001768FC", 36],
  ["func_00176920", 44],
  ["func_0017694C", 48],
  ["func_0017697C", 36],
  ["func_001769A0", 44],
  ["func_001769D8", 40],
  ["func_00176A0C", 40],
  ["func_00176A34", 64],
]);
const expectedCalls = new Map([
  ["func_001766A4", [[16, "func_0017D058"]]],
  ["func_001767CC", [[16, "func_0017D058"]]],
  ["func_001767F4", [[16, "func_0017D058"]]],
  ["func_00176880", [[16, "func_0017D058"]]],
  ["func_001768A0", [[16, "func_0017D058"]]],
  ["func_001768C8", [[16, "func_0017D058"]]],
  ["func_001768FC", [[16, "func_0017D058"]]],
  ["func_00176920", [[16, "func_0017D058"]]],
  ["func_0017697C", [[16, "func_0017D058"]]],
  ["func_001769A0", [[16, "func_0017D058"]]],
  ["func_001769D8", [[16, "func_0017D058"]]],
  ["func_00176A34", [[28, "func_0017CEF4"]]],
]);

function fail(message) {
  throw new Error(message);
}

function sameArray(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function validateSourceAndConfig() {
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  if (config.schemaVersion !== 1) fail("schemaVersion must be 1");
  if (config.source !== "src/main/arm_ipc_templates_61.S") fail("unexpected source path");
  if (config.mode !== "arm") fail("mode must be arm");
  if (config.totalBodySize !== 960) fail("totalBodySize must be 960");
  if (config.cumulativePoolSlots !== 684 || config.cumulativePoolClasses !== 363) {
    fail("cumulative literal-pool accounting must be 684/363");
  }

  const sourcePath = resolve(root, config.source);
  const source = readFileSync(sourcePath);
  const sourceHash = createHash("sha256").update(source).digest("hex");
  if (sourceHash !== config.sourceSha256) {
    fail(`source SHA-256 mismatch: expected ${config.sourceSha256}, got ${sourceHash}`);
  }

  if (!Array.isArray(config.functions) || config.functions.length !== expectedFunctions.size) {
    fail(`expected ${expectedFunctions.size} function records`);
  }
  const seen = new Set();
  let sizeTotal = 0;
  let callTotal = 0;
  for (const fn of config.functions) {
    if (seen.has(fn.name)) fail(`duplicate function record ${fn.name}`);
    seen.add(fn.name);
    if (!expectedFunctions.has(fn.name)) fail(`unexpected function ${fn.name}`);
    if (fn.size !== expectedFunctions.get(fn.name)) fail(`${fn.name}: unexpected size ${fn.size}`);
    if (fn.size % 4 !== 0) fail(`${fn.name}: body size is not ARM aligned`);
    sizeTotal += fn.size;
    if (!Array.isArray(fn.literals) || fn.literals.length !== 0) fail(`${fn.name}: literals must be empty`);

    const actualCalls = (fn.branches ?? []).map((branch) => {
      if (branch.kind !== "R_ARM_CALL" || branch.mnemonic !== "bl") {
        fail(`${fn.name}: invalid direct-call kind or mnemonic`);
      }
      if (branch.offset % 4 !== 0 || branch.offset < 0 || branch.offset >= fn.size) {
        fail(`${fn.name}: invalid direct-call offset ${branch.offset}`);
      }
      return [branch.offset, branch.symbol];
    });
    sameArray(actualCalls, expectedCalls.get(fn.name) ?? [], `${fn.name} calls`);
    callTotal += actualCalls.length;
  }
  sameArray([...seen], [...expectedFunctions.keys()], "function order");
  if (sizeTotal !== 960) fail(`function sizes sum to ${sizeTotal}, not 960`);
  if (callTotal !== 12) fail(`expected 12 physical direct calls, got ${callTotal}`);

  for (const key of ["literalIdentities", "reusedLiteralIdentities", "newLiteralIdentities"]) {
    if (!Array.isArray(config[key]) || config[key].length !== 0) fail(`${key} must be empty`);
  }
  const contract = config.branchIdentityContract;
  if (!contract || contract.mode !== "arm" || contract.minimumAlignment !== 4) {
    fail("invalid ARM branch identity contract");
  }
  sameArray(contract.primaryEntries, ["func_0017D058", "func_0017CEF4"], "primary entries");
  sameArray(contract.secondaryEntries, [], "secondary entries");
  sameArray(contract.sharedClasses, [{ symbol: "func_0017D058", siteCount: 11 }], "shared classes");
  sameArray(contract.singletonClasses, ["func_0017CEF4"], "singleton classes");
  if (contract.classesPairwiseDistinct !== true) fail("call identities must be pairwise distinct");

  const text = source.toString("utf8");
  const beginNames = [...text.matchAll(/^BEGIN\s+(\w+)\s*$/gm)].map((match) => match[1]);
  const endNames = [...text.matchAll(/^END\s+(\w+)\s*$/gm)].map((match) => match[1]);
  sameArray(beginNames, [...expectedFunctions.keys()], "source BEGIN order");
  sameArray(endNames, [...expectedFunctions.keys()], "source END order");
  const sourceCalls = [...text.matchAll(/^bl\s+(\w+)\s*$/gm)].map((match) => match[1]);
  if (sourceCalls.length !== 12) fail(`source contains ${sourceCalls.length} direct calls, not 12`);
  if (sourceCalls.filter((name) => name === "func_0017D058").length !== 11 ||
      sourceCalls.filter((name) => name === "func_0017CEF4").length !== 1) {
    fail("source direct-call identities do not satisfy the 11/1 contract");
  }
  if (/\b(?:\.word|\.long|\.4byte|ltorg|literal)\b/i.test(text)) {
    fail("source contains a literal-pool/data directive");
  }
  return config;
}

function parseReadelf(output) {
  const sections = new Map();
  const symbols = new Map();
  const relocations = new Map();
  let relocationSection = null;

  for (const line of output.split(/\r?\n/)) {
    const section = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+\S+\s+\S+\s+([0-9a-fA-F]+)\s+/);
    if (section) sections.set(section[1], { name: section[2], size: Number.parseInt(section[3], 16) });

    const symbol = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+FUNC\s+GLOBAL\s+\S+\s+(\d+)\s+(\S+)\s*$/);
    if (symbol) {
      symbols.set(symbol[4], {
        value: Number.parseInt(symbol[1], 16),
        size: Number.parseInt(symbol[2], 10),
        sectionIndex: symbol[3],
      });
    }

    const heading = line.match(/^Relocation section '(\.rela?\.text\.([^']+))'/);
    if (heading) {
      relocationSection = heading[2];
      relocations.set(relocationSection, []);
      continue;
    }
    if (/^Relocation section /.test(line)) {
      relocationSection = null;
      continue;
    }
    if (relocationSection) {
      const relocation = line.match(/^\s*([0-9a-fA-F]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/);
      if (relocation) {
        relocations.get(relocationSection).push({
          offset: Number.parseInt(relocation[1], 16),
          kind: relocation[2],
          symbol: relocation[3],
        });
      }
    }
  }
  return { sections, symbols, relocations };
}

function validateObject(objectPath, readelf, config) {
  if (!existsSync(objectPath)) fail(`object does not exist: ${objectPath}`);
  let output;
  try {
    output = execFileSync(readelf, ["-h", "-S", "-W", "-s", "-r", objectPath], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const detail = error.stderr?.toString().trim();
    fail(`readelf failed${detail ? `: ${detail}` : ""}`);
  }
  if (!/^\s*Machine:\s+ARM\s*$/m.test(output)) fail("object is not an ARM ELF file");
  if (!/^\s*Type:\s+REL\b/m.test(output)) fail("object is not relocatable");

  const parsed = parseReadelf(output);
  for (const fn of config.functions) {
    const symbol = parsed.symbols.get(fn.name);
    if (!symbol) fail(`${fn.name}: missing global FUNC symbol`);
    if (symbol.value !== 0 || symbol.value % 4 !== 0) fail(`${fn.name}: invalid symbol value/alignment`);
    if (symbol.size !== fn.size) fail(`${fn.name}: object size ${symbol.size}, expected ${fn.size}`);
    const section = parsed.sections.get(symbol.sectionIndex);
    if (!section) fail(`${fn.name}: missing symbol section`);
    if (section.name !== `.text.${fn.name}`) fail(`${fn.name}: unexpected section ${section.name}`);
    if (section.size !== fn.size) fail(`${fn.name}: section size ${section.size}, expected ${fn.size}`);

    const actual = (parsed.relocations.get(fn.name) ?? []).map((relocation) => [
      relocation.offset,
      relocation.kind,
      relocation.symbol,
    ]);
    const expected = fn.branches.map((branch) => [branch.offset, branch.kind, branch.symbol]);
    sameArray(actual, expected, `${fn.name} object relocations`);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length > 2) fail("usage: validate-arm-ipc-templates-61.mjs [objectPath [readelf]]");
  const config = validateSourceAndConfig();
  if (args[0]) validateObject(resolve(process.cwd(), args[0]), args[1] ?? armReadelf(), config);
  console.log(`arm-ipc-templates-61: OK (20 functions, 960 bytes, 12 calls, 0 literals, cumulative 684/363${args[0] ? ", object checked" : ""})`);
}

try {
  main();
} catch (error) {
  console.error(`arm-ipc-templates-61: ${error.message}`);
  process.exitCode = 1;
}
