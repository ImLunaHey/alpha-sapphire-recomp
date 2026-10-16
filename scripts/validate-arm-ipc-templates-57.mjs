import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-ipc-templates-57.json");
const priorConfigPath = join(root, "config/arm-ipc-templates-56.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const priorConfig = JSON.parse(readFileSync(priorConfigPath, "utf8"));
const sourcePath = join(root, config.source ?? "");
const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
const maxBuffer = 16 * 1024 * 1024;

const literalIdentities = [
  "ipc_bit_prefix_masks_57",
  "ipc_render_context_54",
  "ipc_layout_callback_context_55",
  "ipc_bit_suffix_masks_57",
  "ipc_runtime_callback_table_57",
  "ipc_runtime_owner_slot_57",
  "ipc_record_table_descriptor_57",
  "ipc_record_upper_bound_57",
];
const reusedLiteralIdentities = ["ipc_render_context_54", "ipc_layout_callback_context_55"];
const newLiteralIdentities = literalIdentities.filter((name) => !reusedLiteralIdentities.includes(name));
const primaryEntries = ["func_00175D64", "func_00144D28", "func_0016BADC", "func_0015EC10"];
const secondaryEntries = ["service_cache_lookup_secondary_57"];
const expectedContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries,
  secondaryEntries,
  sharedClasses: [{ symbol: "func_00144D28", siteCount: 2 }],
  singletonClasses: [
    "func_00175D64",
    "service_cache_lookup_secondary_57",
    "func_0016BADC",
    "func_0015EC10",
  ],
  classesPairwiseDistinct: true,
};

const functions = new Map();
let bodyBytes = 0;
let branchCount = 0;
let slotCount = 0;
for (const entry of config.functions ?? []) {
  const allowedBranches = new Set([...primaryEntries, ...secondaryEntries]);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      !Number.isInteger(entry.size) || entry.size <= 0 || entry.size % 4 !== 0 ||
      !Array.isArray(entry.branches) || !Array.isArray(entry.literals) || functions.has(entry.name) ||
      entry.branches.some((branch) => !Number.isInteger(branch.offset) || branch.offset < 0 ||
        branch.offset >= entry.size || branch.offset % 4 !== 0 ||
        !["R_ARM_CALL", "R_ARM_JUMP24"].includes(branch.kind) ||
        !["bl", "b"].includes(branch.mnemonic) ||
        (branch.mnemonic === "bl" ? branch.kind !== "R_ARM_CALL" : branch.kind !== "R_ARM_JUMP24") ||
        !allowedBranches.has(branch.symbol)) ||
      entry.literals.some((literal, index) => literal.offset !== entry.size + index * 4 ||
        !literalIdentities.includes(literal.symbol))) {
    throw new Error("Invalid IPC template 57 positional relocation mapping entry");
  }
  functions.set(entry.name, entry);
  bodyBytes += entry.size;
  branchCount += entry.branches.length;
  slotCount += entry.literals.length;
}

const literalSequence = config.functions.flatMap((entry) => entry.literals.map(({ symbol }) => symbol));
if (config.schemaVersion !== 1 || config.source !== "src/main/arm_ipc_templates_57.S" ||
    config.sourceSha256 !== "f21809ff595f7a38f70837f2a19644e2ff79d276b7ed281ec0ba36f58bc912f1" ||
    sourceHash !== config.sourceSha256 || config.mode !== "arm" || config.totalBodySize !== 692 ||
    config.cumulativePoolSlots !== 684 || config.cumulativePoolClasses !== 363 ||
    priorConfig.cumulativePoolSlots !== 674 || priorConfig.cumulativePoolClasses !== 357 ||
    config.cumulativePoolSlots !== priorConfig.cumulativePoolSlots + slotCount ||
    config.cumulativePoolClasses !== priorConfig.cumulativePoolClasses + newLiteralIdentities.length ||
    functions.size !== 5 || bodyBytes !== 692 || branchCount !== 6 || slotCount !== 10 ||
    new Set(literalSequence).size !== 8 ||
    JSON.stringify(config.literalIdentities) !== JSON.stringify(literalIdentities) ||
    JSON.stringify(config.reusedLiteralIdentities) !== JSON.stringify(reusedLiteralIdentities) ||
    JSON.stringify(config.newLiteralIdentities) !== JSON.stringify(newLiteralIdentities) ||
    JSON.stringify(config.branchIdentityContract) !== JSON.stringify(expectedContract)) {
  throw new Error("Unexpected IPC template 57 positional relocation manifest format");
}

const [objectPath, readelf = "arm-none-eabi-readelf"] = process.argv.slice(2);
if (objectPath !== undefined) {
  const runReadelf = (...args) => {
    const result = spawnSync(readelf, args, { encoding: "utf8", maxBuffer });
    if (result.status !== 0) throw new Error(result.stderr || `readelf ${args.join(" ")} failed`);
    return result.stdout;
  };
  const symbols = runReadelf("-sW", objectPath);
  for (const entry of config.functions) {
    const symbolPattern = new RegExp(`\\b${entry.size}\\s+FUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${entry.name}$`, "m");
    if (!symbolPattern.test(symbols)) {
      throw new Error(`ARM IPC template 57 function ${entry.name} has an invalid symbol size`);
    }
  }

  const relocations = runReadelf("-rW", objectPath);
  for (const entry of config.functions) {
    const header = `Relocation section '.rel.text.${entry.name}'`;
    const start = relocations.indexOf(header);
    if (start < 0) throw new Error(`Missing relocation section for ${entry.name}`);
    const next = relocations.indexOf("Relocation section '", start + header.length);
    const section = relocations.slice(start, next < 0 ? undefined : next);
    const expected = [
      ...entry.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol })),
      ...entry.literals.map(({ offset, symbol }) => ({ offset, kind: "R_ARM_ABS32", symbol })),
    ];
    for (const relocation of expected) {
      const offset = relocation.offset.toString(16).padStart(8, "0");
      const linePattern = new RegExp(`^${offset}\\s+\\S+\\s+${relocation.kind}\\s+\\S+\\s+${relocation.symbol}(?:\\s|$)`, "m");
      if (!linePattern.test(section)) {
        throw new Error(`${entry.name} is missing ${relocation.kind} relocation to ${relocation.symbol} at ${relocation.offset}`);
      }
    }
    const actualCount = [...section.matchAll(/^\s*[0-9a-fA-F]{8}\s+\S+\s+R_ARM_\S+/gm)].length;
    if (actualCount !== expected.length) {
      throw new Error(`${entry.name} has unexpected relocations`);
    }
  }
}

console.log("ARM IPC template batch 57 validation passed");
