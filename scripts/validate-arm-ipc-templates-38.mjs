import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "arm-ipc-templates-38.json");
const sourcePath = join(root, "src", "main", "arm_ipc_templates_38.S");
const manifestText = readFileSync(manifestPath, "utf8");
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(manifestText);

function fail(message) {
  throw new Error(`ARM IPC template 38 validation failed: ${message}`);
}

const expectedFunctions = [
  ["func_0010E86C", 48, []],
  ["func_001E70E0", 52, []],
  ["func_001FBDEC", 52, []],
  ["func_002BDCA4", 28, []],
  ["func_002C2B9C", 20, []],
  ["func_003BAF34", 32, [[24, "R_ARM_JUMP24", "b", "func_001603A0"]]],
  ["func_003BAFD4", 40, [[32, "R_ARM_JUMP24", "b", "func_001603A0"]]],
  ["func_003BAFFC", 32, [[24, "R_ARM_JUMP24", "b", "func_001603A0"]]],
  ["func_003BCEB0", 24, []],
];
const primaryEntries = ["func_001603A0"];
const sharedClasses = [{ symbol: "func_001603A0", siteCount: 3 }];
const branchIdentityContract = {
  mode: "arm", minimumAlignment: 4, primaryEntries, sharedClasses,
  singletonClasses: [], classesPairwiseDistinct: true,
};

if (manifest.schemaVersion !== 1 || manifest.source !== "src/main/arm_ipc_templates_38.S" ||
    manifest.mode !== "arm" || manifest.totalBodySize !== 328 ||
    manifest.cumulativePoolSlots !== 523 || manifest.cumulativePoolClasses !== 253 ||
    JSON.stringify(manifest.literalIdentities) !== "[]" ||
    JSON.stringify(manifest.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.newLiteralIdentities) !== "[]" ||
    JSON.stringify(manifest.branchIdentityContract) !== JSON.stringify(branchIdentityContract) ||
    !Array.isArray(manifest.functions) || manifest.functions.length !== 9) {
  fail("unexpected manifest schema, totals, or identity contract");
}

let bodyBytes = 0;
const branchSymbols = [];
for (let index = 0; index < expectedFunctions.length; index++) {
  const [name, size, branches] = expectedFunctions[index];
  const entry = manifest.functions[index];
  const wantedBranches = branches.map(([offset, kind, mnemonic, symbol]) => ({ offset, kind, mnemonic, symbol }));
  if (entry?.name !== name || entry.size !== size ||
      JSON.stringify(entry.branches) !== JSON.stringify(wantedBranches) ||
      JSON.stringify(entry.literals) !== "[]") {
    fail(`invalid or reordered function mapping for ${name}`);
  }
  bodyBytes += size;
  for (const [, kind, , symbol] of branches) {
    if (kind !== "R_ARM_JUMP24") fail(`invalid branch relocation kind for ${name}`);
    branchSymbols.push(symbol);
  }
}
if (bodyBytes !== 328 || branchSymbols.length !== 3 ||
    branchSymbols.some((symbol) => symbol !== "func_001603A0")) {
  fail("body or branch cardinality differs");
}

const priorNames = [
  "arm-duplicate-ipc-and-table-templates-12.json", "arm-ipc-unique-templates-13.json",
  ...Array.from({ length: 23 }, (_, index) => `arm-ipc-templates-${index + 15}.json`),
];
const priorSlots = [];
for (const name of priorNames) {
  const prior = JSON.parse(readFileSync(join(root, "config", name), "utf8"));
  for (const entry of prior.functions) {
    for (const key of ["command", "auxiliary", "staticDescriptor", "handle"]) {
      if (typeof entry[key] === "string") priorSlots.push(entry[key]);
    }
    if (Array.isArray(entry.literals)) priorSlots.push(...entry.literals.map(({ symbol }) => symbol));
  }
}
if (priorSlots.length !== 523 || new Set(priorSlots).size !== 253) {
  fail("prior IPC pool cumulative contract differs");
}

if ((source.match(/^BEGIN func_[0-9A-F]{8}$/gm) ?? []).length !== 9 ||
    (source.match(/^END func_[0-9A-F]{8}$/gm) ?? []).length !== 9 ||
    (source.match(/^b func_001603A0$/gm) ?? []).length !== 3 ||
    (source.match(/^svc #0x[0-9a-f]+$/gm) ?? []).length !== 9 ||
    (source.match(/^\s*\.word\s+/gm) ?? []).length !== 0) {
  fail("function, service, branch, or pool counts differ");
}
if (/^\s*\.(?:inst|long|4byte|byte|hword|short)\b/im.test(source)) {
  fail("raw instruction or anonymous data directives are forbidden");
}
if (createHash("sha256").update(source).digest("hex") !== manifest.sourceSha256 ||
    manifest.sourceSha256 !== "f7b75c855ff9434b9fcc82a90facec308fe42d5cacee07a9ff8f5381f2eeec18") {
  fail("complete deterministic mnemonic schedules changed without manifest and validator review");
}
if (createHash("sha256").update(manifestText).digest("hex") !==
    "3b727688ffc2d956b5784a2ac7470795fec992c658bd19f21d7850da50b7eeb5") {
  fail("deterministic manifest changed without validator review");
}

const args = process.argv.slice(2);
if (args.length !== 0 && args.length !== 2) fail("usage: validate-arm-ipc-templates-38.mjs [object readelf]");
if (args.length === 0) {
  console.log("Validated deterministic source coverage and unchanged 523-slot/253-class IPC structure for 9 ARM service adapters (328 bytes, 3 symbolic branches, no pool slots).");
  process.exit(0);
}

const [objectPath, readelf] = args;
function inspect(toolArgs) {
  const result = spawnSync(readelf, toolArgs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`readelf exited ${result.status}`);
  return result.stdout;
}
const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const sections = new Map();
for (const match of sectionOutput.matchAll(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm)) {
  sections.set(match[2], { index: Number(match[1]), type: match[3], size: Number.parseInt(match[4], 16), flags: match[5], alignment: Number(match[6]) });
}
const symbols = new Map();
for (const match of symbolOutput.matchAll(/^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm)) {
  const values = symbols.get(match[7]) ?? [];
  values.push({ value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3], binding: match[4], visibility: match[5], section: match[6] });
  symbols.set(match[7], values);
}
const relocations = new Map();
let relocatedSection;
for (const line of relocationOutput.split("\n")) {
  const heading = /^Relocation section '\.rela?(\S+)'/.exec(line);
  if (heading) { relocatedSection = heading[1]; continue; }
  const match = /^\s*([0-9A-Fa-f]+)\s+\S+\s+(R_ARM_\S+)\s+\S+\s+(\S+)/.exec(line);
  if (match && relocatedSection) {
    const entries = relocations.get(relocatedSection) ?? [];
    entries.push({ offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3] });
    relocations.set(relocatedSection, entries);
  }
}
for (const entry of manifest.functions) {
  const sectionName = `.text.${entry.name}`;
  const section = sections.get(sectionName);
  if (!section || section.type !== "PROGBITS" || section.size !== entry.size ||
      !section.flags.includes("A") || !section.flags.includes("X") || section.alignment !== 4) {
    fail(`invalid section for ${entry.name}`);
  }
  const symbol = symbols.get(entry.name) ?? [];
  if (symbol.length !== 1 || symbol[0].value !== 0 || symbol[0].size !== entry.size ||
      symbol[0].type !== "FUNC" || symbol[0].binding !== "GLOBAL" || symbol[0].visibility !== "DEFAULT" ||
      Number(symbol[0].section) !== section.index) fail(`invalid symbol for ${entry.name}`);
  const armMappings = (symbols.get("$a") ?? []).filter((item) => Number(item.section) === section.index);
  const dataMappings = (symbols.get("$d") ?? []).filter((item) => Number(item.section) === section.index);
  if (armMappings.length !== 1 || armMappings[0].value !== 0 || dataMappings.length !== 0) {
    fail(`invalid mapping symbols for ${entry.name}`);
  }
  const wanted = entry.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol }));
  if (JSON.stringify(relocations.get(sectionName) ?? []) !== JSON.stringify(wanted)) {
    fail(`invalid ordered relocations for ${entry.name}`);
  }
}
for (const identity of new Set(branchSymbols)) {
  const symbol = symbols.get(identity) ?? [];
  const external = symbol.length === 1 && symbol[0].value === 0 && symbol[0].size === 0 &&
    ["NOTYPE", "FUNC"].includes(symbol[0].type) && symbol[0].binding === "GLOBAL" &&
    symbol[0].visibility === "DEFAULT" && symbol[0].section === "UND";
  const definedFunction = symbol.length === 1 && symbol[0].type === "FUNC" &&
    symbol[0].binding === "GLOBAL" && symbol[0].visibility === "DEFAULT" && symbol[0].section !== "UND";
  if (!external && !definedFunction) fail(`invalid symbolic branch identity ${identity}`);
}
console.log("Validated 9 ARM service adapter sections and 3 ordered symbolic branch relocations (328 bytes, no pool slots).");
