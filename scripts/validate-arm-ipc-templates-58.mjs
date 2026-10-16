import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [objectPath, readelf = "arm-none-eabi-readelf"] = process.argv.slice(2);

const config = JSON.parse(readFileSync(join(root, "config/arm-ipc-templates-58.json"), "utf8"));
const sourcePath = join(root, config.source ?? "");
const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
const primaryEntries = [
  "func_00168EC0", "func_0016BC84", "func_00168E50", "func_0016BD80",
  "func_0016BD00", "func_00176EFC", "func_00175F08", "func_00168AC8",
  "func_00175F68",
];
const sharedClasses = [
  { symbol: "func_00168EC0", siteCount: 14 },
  { symbol: "func_0016BC84", siteCount: 4 },
  { symbol: "func_00168E50", siteCount: 15 },
  { symbol: "func_0016BD80", siteCount: 3 },
  { symbol: "func_0016BD00", siteCount: 6 },
  { symbol: "func_00176EFC", siteCount: 2 },
  { symbol: "func_00175F08", siteCount: 2 },
  { symbol: "func_00168AC8", siteCount: 2 },
  { symbol: "func_00175F68", siteCount: 2 },
];

let bodyBytes = 0;
let branchSites = 0;
const names = new Set();
const observedCounts = new Map();
for (const entry of config.functions ?? []) {
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      names.has(entry.name) || !Number.isInteger(entry.size) || entry.size <= 0 || entry.size % 4 !== 0 ||
      !Array.isArray(entry.branches) || !Array.isArray(entry.literals) || entry.literals.length !== 0) {
    throw new Error("Invalid IPC template 58 function entry");
  }
  names.add(entry.name);
  bodyBytes += entry.size;
  for (const branch of entry.branches) {
    if (!Number.isInteger(branch.offset) || branch.offset < 0 || branch.offset >= entry.size ||
        branch.offset % 4 !== 0 || !["b", "bl"].includes(branch.mnemonic) ||
        branch.kind !== (branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24") ||
        !primaryEntries.includes(branch.symbol)) {
      throw new Error(`Invalid IPC template 58 transfer in ${entry.name}`);
    }
    observedCounts.set(branch.symbol, (observedCounts.get(branch.symbol) ?? 0) + 1);
    branchSites++;
  }
}

if (config.schemaVersion !== 1 || config.source !== "src/main/arm_ipc_templates_58.S" ||
    config.sourceSha256 !== sourceHash || config.mode !== "arm" || config.totalBodySize !== 1176 ||
    config.cumulativePoolSlots !== 684 || config.cumulativePoolClasses !== 363 ||
    config.functions?.length !== 19 || bodyBytes !== 1176 || branchSites !== 50 ||
    JSON.stringify(config.literalIdentities) !== "[]" ||
    JSON.stringify(config.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(config.newLiteralIdentities) !== "[]" ||
    JSON.stringify(config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries, secondaryEntries: [],
      sharedClasses, singletonClasses: [], classesPairwiseDistinct: true,
    }) ||
    sharedClasses.some(({ symbol, siteCount }) => observedCounts.get(symbol) !== siteCount)) {
  throw new Error("Unexpected IPC template 58 positional relocation manifest format");
}

if (!objectPath) {
  console.log("validated ARM IPC template batch 58 manifest: 19 functions, 1176 bytes, 50 transfers, 0 literal slots (684/363 cumulative)");
  process.exit(0);
}

const targetObjectMode = /(?:^|[/\\])target(?:[/\\])/.test(objectPath);
const maxBuffer = targetObjectMode ? 16 * 1024 * 1024 : 4 * 1024 * 1024;
function inspect(...args) {
  const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer });
  if (result.status !== 0) {
    throw new Error(result.stderr || `${readelf} failed with status ${result.status}`);
  }
  return result.stdout;
}

const symbolText = inspect("-sW", objectPath);
const symbols = new Map();
for (const line of symbolText.split(/\r?\n/)) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\S+)\s+(\S+)\s*$/);
  if (!match) continue;
  const [, value, size, type, bind, ndx, name] = match;
  if (!symbols.has(name) || type === "FUNC") {
    symbols.set(name, { value: Number.parseInt(value, 16), size: Number(size), type, bind, ndx });
  }
}
for (const entry of config.functions) {
  const symbol = symbols.get(entry.name);
  if (!symbol || symbol.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.ndx === "UND" ||
      symbol.size !== entry.size || symbol.value % 4 !== 0) {
    throw new Error(`ARM IPC template 58 function ${entry.name} has an invalid symbol`);
  }
}
for (const name of primaryEntries) {
  const symbol = symbols.get(name);
  if (!symbol || !["FUNC", "NOTYPE"].includes(symbol.type) || symbol.bind !== "GLOBAL") {
    throw new Error(`ARM IPC template 58 transfer identity ${name} is missing`);
  }
}

const relocationText = inspect("-rW", objectPath);
const relocations = [];
let relocationSection = "";
for (const line of relocationText.split(/\r?\n/)) {
  const heading = line.match(/^Relocation section '([^']+)'/);
  if (heading) {
    relocationSection = heading[1];
    continue;
  }
  const match = line.match(/^\s*([0-9a-fA-F]+)\s+\S+\s+(R_ARM_(?:CALL|JUMP24))\s+\S+\s+(\S+)/);
  if (match) {
    relocations.push({ section: relocationSection, offset: Number.parseInt(match[1], 16), kind: match[2], symbol: match[3] });
  }
}

for (const entry of config.functions) {
  const sectionNames = new Set([`.rel.text.${entry.name}`, `.rela.text.${entry.name}`]);
  const actual = relocations.filter((relocation) => sectionNames.has(relocation.section));
  if (actual.length !== entry.branches.length) {
    throw new Error(`${entry.name} has ${actual.length} symbolic transfers; expected ${entry.branches.length}`);
  }
  for (const branch of entry.branches) {
    if (!actual.some((relocation) => relocation.offset === branch.offset &&
        relocation.kind === branch.kind && relocation.symbol === branch.symbol)) {
      throw new Error(`${entry.name} is missing ${branch.kind} ${branch.symbol} at offset ${branch.offset}`);
    }
  }
}

console.log("validated ARM IPC template batch 58: 19 functions, 1176 bytes, 50 transfers, 0 literal slots (684/363 cumulative)");
