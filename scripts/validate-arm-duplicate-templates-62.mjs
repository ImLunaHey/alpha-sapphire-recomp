import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "config/arm-duplicate-templates-62.json"), "utf8"));
const source = readFileSync(join(root, config.source), "utf8");
const expectedFunctions = [
  {
    name: "func_0052DCB4", template: "exact_tree_fetch_or_create",
    templateMaterialEndOffset: 307, anonymousMaterialOffset: 308, nextGlobalOffset: 356,
  },
  {
    name: "func_0056CF84", template: "exact_tree_fetch_or_create",
    templateMaterialEndOffset: 307, anonymousMaterialOffset: null, nextGlobalOffset: 308,
  },
];
const expectedTransfers = [
  { offset: 28, kind: "R_ARM_CALL", symbol: "func_0017EA3C", role: "enter_owner_guard" },
  { offset: 44, kind: "R_ARM_CALL", symbol: "func_0017E30C", role: "obtain_lookup_key" },
  { offset: 52, kind: "R_ARM_JUMP24", symbol: "func_001603A0", role: "lookup_key_failure" },
  { offset: 148, kind: "R_ARM_CALL", symbol: "func_0017E30C", role: "obtain_first_creation_token" },
  { offset: 160, kind: "R_ARM_JUMP24", symbol: "func_001603A0", role: "first_creation_token_failure" },
  { offset: 180, kind: "R_ARM_CALL", symbol: "func_0018D348", role: "first_owner_operation" },
  { offset: 192, kind: "R_ARM_CALL", symbol: "func_0018D6D4", role: "attach_owner_member" },
  { offset: 204, kind: "R_ARM_CALL", symbol: "func_0017E30C", role: "obtain_second_creation_token" },
  { offset: 216, kind: "R_ARM_JUMP24", symbol: "func_001603A0", role: "second_creation_token_failure" },
  { offset: 236, kind: "R_ARM_CALL", symbol: "func_0018D348", role: "second_owner_operation" },
  { offset: 260, kind: "R_ARM_CALL", symbol: "func_0017EA90", role: "leave_owner_guard" },
];
const expectedSlot = [{
  offset: 304, loadOffset: 32, kind: "R_ARM_ABS32",
  identity: "duplicate62_shared_context_identity", sharedAcrossAllExpansions: true,
}];
const expectedTemplate = {
  bodySize: 304, instructionCount: 76, count: 2, internalLabels: 7,
  directTransfers: 11, indirectCalls: 0, tailBranches: 0, poolSlots: 1,
};

if (config.version !== 1 || config.source !== "src/main/arm_duplicate_templates_62.S" ||
    config.mode !== "arm" || config.expectedBodyBytes !== 608 ||
    JSON.stringify(config.templates) !== JSON.stringify({ exact_tree_fetch_or_create: expectedTemplate }) ||
    JSON.stringify(config.directTransfers) !== JSON.stringify(expectedTransfers) ||
    JSON.stringify(config.internalLabelOffsets) !== JSON.stringify([80, 108, 128, 132, 256, 276, 292]) ||
    JSON.stringify(config.slotContract) !== JSON.stringify(expectedSlot) ||
    JSON.stringify(config.functions) !== JSON.stringify(expectedFunctions)) {
  throw new Error("Unexpected duplicate template 62 manifest format");
}

if (!source.includes(".macro DT62_BODY name") ||
    !source.includes(".size \\name, .-\\name\n.Ldt62_context\\@:\n    .word duplicate62_shared_context_identity") ||
    (source.match(/^DT62_BODY func_[0-9A-F]{8}$/gm) ?? []).join("\n") !==
      expectedFunctions.map(({ name }) => `DT62_BODY ${name}`).join("\n") ||
    /(?:\.inst|\.byte|\.hword|\.space|anonymous)/.test(source)) {
  throw new Error("Duplicate template 62 source violates its symbolic clean-room contract");
}

const [objectPath, readelfArgument] = process.argv.slice(2);
if (objectPath === undefined) {
  console.log("Validated ARM duplicate template batch 62 source contract");
  process.exit(0);
}
if (readelfArgument === undefined) {
  throw new Error("Expected readelf path when validating an object");
}

function runReadelf(args) {
  const result = spawnSync(readelfArgument, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}: ${result.stderr}`);
  }
  return result.stdout;
}

const sectionOutput = runReadelf(["--section-headers", "--wide", objectPath]);
const symbolOutput = runReadelf(["--symbols", "--wide", objectPath]);
const relocationOutput = runReadelf(["--relocs", "--wide", objectPath]);
const sections = new Map();
for (const line of sectionOutput.split(/\r?\n/)) {
  const match = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+\S+\s+([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)/);
  if (match) sections.set(Number(match[1]), { name: match[2], address: Number.parseInt(match[3], 16), size: Number.parseInt(match[4], 16) });
}
const symbols = new Map();
for (const line of symbolOutput.split(/\r?\n/)) {
  const match = line.match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+\S+\s+(\d+)\s+(\S+)$/);
  if (match) symbols.set(match[6], {
    value: Number.parseInt(match[1], 16), size: Number(match[2]), type: match[3],
    bind: match[4], sectionIndex: Number(match[5]),
  });
}

function sectionBytes(sectionName) {
  const output = runReadelf([`--hex-dump=${sectionName}`, objectPath]);
  const chunks = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
    if (match) chunks.push(...match[1].trim().split(/\s+/).map((word) => Buffer.from(word, "hex")));
  }
  return Buffer.concat(chunks);
}

const relocationsBySection = new Map();
let relocationSection;
for (const line of relocationOutput.split(/\r?\n/)) {
  const heading = line.match(/^Relocation section '\.rel(\.text\.[^']+)'/);
  if (heading) {
    relocationSection = heading[1];
    relocationsBySection.set(relocationSection, []);
    continue;
  }
  const relocation = line.match(/^\s*([0-9a-fA-F]+)\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
  if (relocationSection && relocation) {
    relocationsBySection.get(relocationSection).push({
      offset: Number.parseInt(relocation[1], 16), kind: relocation[2], symbol: relocation[3],
    });
  }
}

let normalizedReference;
for (const expected of expectedFunctions) {
  const symbol = symbols.get(expected.name);
  const section = symbol === undefined ? undefined : sections.get(symbol.sectionIndex);
  const expectedSectionName = `.text.${expected.name}`;
  if (symbol?.type !== "FUNC" || symbol.bind !== "GLOBAL" || symbol.size !== expectedTemplate.bodySize ||
      section?.name !== expectedSectionName || section.size !== expected.templateMaterialEndOffset + 1 ||
      symbol.value !== section.address) {
    throw new Error(`${expected.name} does not have its exact 304-byte body and sole post-body slot`);
  }
  const bytes = sectionBytes(expectedSectionName);
  if (bytes.length !== 308) throw new Error(`${expected.name} section contains anonymous or missing material`);
  const body = Buffer.from(bytes.subarray(0, expectedTemplate.bodySize));
  if (body.length / 4 !== expectedTemplate.instructionCount) {
    throw new Error(`${expected.name} does not have exactly 76 ARM instructions`);
  }
  const relocations = relocationsBySection.get(expectedSectionName) ?? [];
  const expectedRelocations = [
    ...expectedTransfers.map(({ offset, kind, symbol: destination }) => ({ offset, kind, symbol: destination })),
    { offset: 304, kind: "R_ARM_ABS32", symbol: expectedSlot[0].identity },
  ];
  if (JSON.stringify(relocations) !== JSON.stringify(expectedRelocations)) {
    throw new Error(`${expected.name} has unexpected ordered relocations`);
  }
  for (const transfer of expectedTransfers) {
    const opcode = body.readUInt32LE(transfer.offset) >>> 24;
    const expectedOpcode = transfer.kind === "R_ARM_CALL" ? 0xeb : 0x1b;
    if (opcode !== expectedOpcode) throw new Error(`${expected.name} has the wrong linked opcode at +${transfer.offset}`);
    body.fill(0, transfer.offset, transfer.offset + 4);
  }
  const load = body.readUInt32LE(expectedSlot[0].loadOffset);
  const loadTarget = expectedSlot[0].loadOffset + 8 + (load & 0xfff);
  if ((load & 0x0fff0000) !== 0x059f0000 || loadTarget !== expectedSlot[0].offset) {
    throw new Error(`${expected.name} does not load its post-body identity slot at the audited offset`);
  }
  const localTargets = new Set();
  for (let cursor = 0; cursor < body.length; cursor += 4) {
    if (expectedTransfers.some(({ offset }) => offset === cursor)) continue;
    const instruction = body.readUInt32LE(cursor);
    if ((instruction & 0x0e000000) !== 0x0a000000) continue;
    let displacement = instruction & 0x00ffffff;
    if (displacement & 0x00800000) displacement -= 0x01000000;
    const target = cursor + 8 + displacement * 4;
    if (target < 0 || target >= expectedTemplate.bodySize) {
      throw new Error(`${expected.name} has an unexpected external branch`);
    }
    localTargets.add(target);
  }
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !== JSON.stringify(config.internalLabelOffsets)) {
    throw new Error(`${expected.name} has unexpected complete local branch destinations`);
  }
  if (normalizedReference !== undefined && !body.equals(normalizedReference)) {
    throw new Error(`${expected.name} violates normalized complete-body identity`);
  }
  normalizedReference = body;
}

console.log("Validated 2 ARM duplicate template batch 62 functions (608 body bytes, 22 transfers, 2 shared-identity slots)");
