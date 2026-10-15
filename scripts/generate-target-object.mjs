import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const [
  codePath,
  symbolsPath,
  assembler,
  readelf,
  branchThunksPath,
  adjacentGlobalLoadsPath,
  globalStatePath,
  duplicateIpcAndTablesPath,
  multiIdentityGlobalsPath,
  literalIdentitiesPath,
  targetConfigPath,
] = process.argv.slice(2);
if (
  !codePath ||
  !symbolsPath ||
  !assembler ||
  !readelf ||
  !branchThunksPath ||
  !adjacentGlobalLoadsPath ||
  !globalStatePath ||
  !duplicateIpcAndTablesPath ||
  !multiIdentityGlobalsPath ||
  !literalIdentitiesPath ||
  !targetConfigPath
) {
  throw new Error(
    "Expected code, symbol inventory, assembler, readelf, branch thunk mapping, adjacent-global-load mapping, global-state mapping, duplicate IPC/table mapping, multi-identity mapping, target literal identities, and target config paths"
  );
}

function parseCsv(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index++;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

const lines = readFileSync(symbolsPath, "utf8").trim().split(/\r?\n/);
if (lines.shift() !== "Location,Name,Namespace,Mode,Size,Segment") {
  throw new Error("Unexpected function inventory header");
}
const functions = lines.filter(Boolean).map((line) => {
  const [location, name, , mode, size] = parseCsv(line);
  return {
    address: Number.parseInt(location, 16),
    name,
    mode,
    size: Number.parseInt(size, 16)
  };
});

const adjacentGlobalLoadsConfig = JSON.parse(
  readFileSync(adjacentGlobalLoadsPath, "utf8")
);
if (
  adjacentGlobalLoadsConfig.schemaVersion !== 1 ||
  !Array.isArray(adjacentGlobalLoadsConfig.functions) ||
  adjacentGlobalLoadsConfig.functions.length !== 79
) {
  throw new Error("Unexpected ARM adjacent-global-load mapping format");
}
const adjacentGlobalLoads = new Map();
for (const entry of adjacentGlobalLoadsConfig.functions) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    !/^global_load_(?:0[1-9]|[1-3][0-9]|4[0-7])$/.test(entry.identity) ||
    !["data", "bss"].includes(entry.segment) ||
    !["u32", "u8", "s8"].includes(entry.read) ||
    !Number.isInteger(entry.displacement) ||
    entry.displacement < 0 ||
    adjacentGlobalLoads.has(entry.name)
  ) {
    throw new Error("Invalid or duplicate ARM adjacent-global-load mapping entry");
  }
  adjacentGlobalLoads.set(entry.name, entry);
}
for (const name of ["func_0010702C", "func_002BA6CC"]) {
  if (adjacentGlobalLoads.has(name)) {
    throw new Error(`Excluded scalar function must not be configured: ${name}`);
  }
}

const globalStateConfig = JSON.parse(readFileSync(globalStatePath, "utf8"));
if (globalStateConfig.schemaVersion !== 1 || !Array.isArray(globalStateConfig.functions) || globalStateConfig.functions.length !== 97) {
  throw new Error("Unexpected ARM global-state mapping format");
}
const globalStates = new Map();
for (const entry of globalStateConfig.functions) {
  if (typeof entry?.name !== "string" || typeof entry.identity !== "string" ||
      !["data", "bss"].includes(entry.segment) || !Number.isInteger(entry.size) ||
      typeof entry.behavior !== "string" || globalStates.has(entry.name)) {
    throw new Error("Invalid or duplicate ARM global-state mapping entry");
  }
  globalStates.set(entry.name, entry);
}

const duplicateIpcAndTablesConfig = JSON.parse(readFileSync(duplicateIpcAndTablesPath, "utf8"));
if (
  duplicateIpcAndTablesConfig.schemaVersion !== 1 ||
  !Array.isArray(duplicateIpcAndTablesConfig.functions) ||
  duplicateIpcAndTablesConfig.functions.length !== 28
) {
  throw new Error("Unexpected duplicate IPC/table mapping format");
}
const duplicateIpcAndTables = new Map();
for (const entry of duplicateIpcAndTablesConfig.functions) {
  if (
    typeof entry?.name !== "string" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    !["ipc_one", "ipc_two", "table_state"].includes(entry.template) ||
    duplicateIpcAndTables.has(entry.name)
  ) {
    throw new Error("Invalid or duplicate IPC/table mapping entry");
  }
  if (entry.template === "table_state") {
    if (!Array.isArray(entry.tables) || entry.tables.length !== 6 ||
        entry.tables.some((identity) => typeof identity !== "string")) {
      throw new Error(`Invalid table identities for ${entry.name}`);
    }
  } else if (typeof entry.command !== "string" || typeof entry.handle !== "string") {
    throw new Error(`Invalid IPC identities for ${entry.name}`);
  }
  duplicateIpcAndTables.set(entry.name, entry);
}

const multiIdentityGlobalsConfig = JSON.parse(readFileSync(multiIdentityGlobalsPath, "utf8"));
if (multiIdentityGlobalsConfig.schemaVersion !== 1 ||
    !Array.isArray(multiIdentityGlobalsConfig.functions) ||
    multiIdentityGlobalsConfig.functions.length !== 9) {
  throw new Error("Unexpected multi-identity mapping format");
}
const multiIdentityGlobals = new Map();
const multiIdentityNames = new Map();
const multiIdentityTemplateNames = new Set([
  "construct_five_words", "store_pair_stmia", "store_pair_offsets_4_8",
  "store_pair_offsets_0_8", "byte_indexed_word", "store_three_offsets_140_0_64",
  "clear_and_store_text_pair", "sentinel_indexed_word", "initialize_sparse_fields",
]);
let configuredMultiIdentityBytes = 0;
let configuredMultiIdentitySlots = 0;
for (const entry of multiIdentityGlobalsConfig.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,size,slots,template" ||
      typeof entry.name !== "string" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      !Number.isInteger(entry.size) || entry.size < 16 || entry.size > 32 || entry.size % 4 !== 0 ||
      !multiIdentityTemplateNames.has(entry.template) || !Array.isArray(entry.slots) ||
      entry.slots.length < 2 || entry.slots.length > 3 ||
      entry.slots.some((slot) => slot === null || typeof slot !== "object" ||
        Object.keys(slot).sort().join(",") !== "identity,segment" ||
        !/^(?:multi_identity_(?:0[1-9]|1[0-5])|global_state_19|global_load_46)$/.test(slot.identity) ||
        !["text", "rodata", "data", "bss"].includes(slot.segment)) ||
      multiIdentityGlobals.has(entry.name)) {
    throw new Error("Invalid or duplicate multi-identity mapping entry");
  }
  for (const slot of entry.slots) {
    const priorSegment = multiIdentityNames.get(slot.identity)?.segment;
    if (priorSegment !== undefined && priorSegment !== slot.segment) {
      throw new Error(`Conflicting segment classes for ${slot.identity}`);
    }
    const priorCount = multiIdentityNames.get(slot.identity)?.count ?? 0;
    multiIdentityNames.set(slot.identity, { segment: slot.segment, count: priorCount + 1 });
  }
  multiIdentityGlobals.set(entry.name, entry);
  configuredMultiIdentityBytes += entry.size;
  configuredMultiIdentitySlots += entry.slots.length;
}
if (configuredMultiIdentityBytes !== 220 || configuredMultiIdentitySlots !== 19 ||
    multiIdentityNames.size !== 17 || multiIdentityNames.get("global_state_19")?.count !== 1 ||
    multiIdentityNames.get("global_load_46")?.count !== 1) {
  throw new Error("Unexpected multi-identity manifest totals or reused identities");
}
for (let number = 1; number <= 15; number++) {
  const identity = `multi_identity_${String(number).padStart(2, "0")}`;
  const expectedCount = [3, 4].includes(number) ? 2 : 1;
  if (multiIdentityNames.get(identity)?.count !== expectedCount) {
    throw new Error(`Unexpected occurrence count for ${identity}`);
  }
}

const literalIdentityConfig = JSON.parse(readFileSync(literalIdentitiesPath, "utf8"));
if (literalIdentityConfig.version !== 1 ||
    Object.keys(literalIdentityConfig).sort().join(",") !== "armAdjacentAbsoluteLiterals,version" ||
    literalIdentityConfig.armAdjacentAbsoluteLiterals === null ||
    typeof literalIdentityConfig.armAdjacentAbsoluteLiterals !== "object" ||
    Array.isArray(literalIdentityConfig.armAdjacentAbsoluteLiterals)) {
  throw new Error("Unexpected target literal identity mapping format");
}

const targetConfig = JSON.parse(readFileSync(targetConfigPath, "utf8"));
const targetSegments = new Map();
for (const name of ["text", "rodata", "data", "bss"]) {
  const segment = targetConfig?.code?.segments?.[name];
  const address = Number.parseInt(segment?.address, 16);
  const size = Number.parseInt(segment?.size, 16);
  if (!Number.isInteger(address) || !Number.isInteger(size) || size <= 0) {
    throw new Error(`Invalid target ${name} segment`);
  }
  targetSegments.set(name, { address, size });
}

const branchThunkConfig = JSON.parse(readFileSync(branchThunksPath, "utf8"));
if (branchThunkConfig.schemaVersion !== 1 || !Array.isArray(branchThunkConfig.thunks)) {
  throw new Error("Unexpected ARM direct-branch thunk mapping format");
}
const branchThunks = new Map();
for (const thunk of branchThunkConfig.thunks) {
  if (
    typeof thunk?.name !== "string" ||
    !/^func_[0-9A-F]{8}$/.test(thunk.name) ||
    typeof thunk.destination !== "string" ||
    !/^(?:func_[0-9A-F]{8}|observed_[A-Za-z0-9_]+)$/.test(thunk.destination)
  ) {
    throw new Error("Invalid ARM direct-branch thunk mapping entry");
  }
  if (branchThunks.has(thunk.name)) {
    throw new Error(`Duplicate ARM direct-branch thunk mapping for ${thunk.name}`);
  }
  branchThunks.set(thunk.name, thunk.destination);
}

const buildDirectory = join(root, "build", "AS_EUR_REV2");
const targetDirectory = join(buildDirectory, "target");
mkdirSync(targetDirectory, { recursive: true });
const assemblyPath = join(targetDirectory, "code.s");
const objectPath = join(targetDirectory, "code.o");
const baseObjectPath = join(buildDirectory, "base", "code.o");
const code = readFileSync(codePath);
const textStart = 0x00100000;
const functionsByName = new Map(functions.map((entry) => [entry.name, entry]));
const identityWords = new Map();
const wordIdentities = new Map();

function expectedReadInstruction(read, displacement) {
  if (read === "u32" && displacement <= 4095) {
    return (0xe5900000 | displacement) >>> 0;
  }
  if (read === "u8" && displacement <= 4095) {
    return (0xe5d00000 | displacement) >>> 0;
  }
  if (read === "s8" && displacement <= 255) {
    return (0xe1d000d0 | ((displacement & 0xf0) << 4) | (displacement & 0x0f)) >>> 0;
  }
  throw new Error(`Displacement is not encodable for ${read}`);
}

function isAl(instruction) {
  return instruction >>> 28 === 0xe;
}

function isLiteralLoad(instruction, destination, displacement) {
  return isAl(instruction) &&
    ((instruction >>> 26) & 0x3) === 0x1 &&
    ((instruction >>> 25) & 0x1) === 0 &&
    ((instruction >>> 24) & 0x1) === 1 &&
    ((instruction >>> 23) & 0x1) === 1 &&
    ((instruction >>> 22) & 0x1) === 0 &&
    ((instruction >>> 21) & 0x1) === 0 &&
    ((instruction >>> 20) & 0x1) === 1 &&
    ((instruction >>> 16) & 0xf) === 15 &&
    ((instruction >>> 12) & 0xf) === destination &&
    (instruction & 0xfff) === displacement;
}

function isBxLr(instruction) {
  return isAl(instruction) &&
    (instruction & 0x0ffffff0) === 0x012fff10 &&
    (instruction & 0xf) === 14;
}

for (const [name, mapping] of adjacentGlobalLoads) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== 12) {
    throw new Error(`${name} is not an inventoried 12-byte ARM function`);
  }
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + 4;
  const offset = entry.address - textStart;
  if (slotStart % 4 !== 0 || offset < 0 || offset + 16 > code.length) {
    throw new Error(`${name} has an invalid or out-of-bounds adjacent identity slot`);
  }
  const overlap = functions.find(
    (candidate) =>
      candidate.address < slotEnd && candidate.address + candidate.size > slotStart
  );
  if (overlap !== undefined) {
    throw new Error(`${name} identity slot overlaps inventoried function ${overlap.name}`);
  }
  const first = code.readUInt32LE(offset);
  const second = code.readUInt32LE(offset + 4);
  const third = code.readUInt32LE(offset + 8);
  if (
    first !== 0xe59f0004 ||
    second !== expectedReadInstruction(mapping.read, mapping.displacement) ||
    third !== 0xe12fff1e
  ) {
    throw new Error(`${name} does not have the configured obtain-base, read, return shape`);
  }
  const privateWord = code.readUInt32LE(offset + 12);
  const segment = targetSegments.get(mapping.segment);
  if (
    privateWord < segment.address ||
    privateWord >= segment.address + segment.size
  ) {
    throw new Error(`${name} identity word is outside its declared segment class`);
  }
  const priorWord = identityWords.get(mapping.identity);
  const priorIdentity = wordIdentities.get(privateWord);
  if (
    (priorWord !== undefined && priorWord !== privateWord) ||
    (priorIdentity !== undefined && priorIdentity !== mapping.identity)
  ) {
    throw new Error(`Neutral identity equality is inconsistent for ${name}`);
  }
  identityWords.set(mapping.identity, privateWord);
  wordIdentities.set(privateWord, mapping.identity);
}
if (identityWords.size !== 47 || wordIdentities.size !== 47) {
  throw new Error("Expected a biconditional mapping of 47 private words to 47 identities");
}

const globalStateIdentities = new Map();
for (const mapping of globalStates.values()) globalStateIdentities.set(mapping.identity, mapping.segment);
for (const [name, identity] of Object.entries(literalIdentityConfig.armAdjacentAbsoluteLiterals)) {
  const segmentName = globalStateIdentities.get(identity);
  if (segmentName === undefined) continue;
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a") {
    throw new Error(`${name} cannot seed reused identity ${identity}`);
  }
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + 4;
  const offset = entry.address - textStart;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + 4 > code.length) {
    throw new Error(`${name} has an invalid reused-identity slot`);
  }
  const overlap = functions.find((candidate) => candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) throw new Error(`${name} reused-identity slot overlaps ${overlap.name}`);
  const privateWord = code.readUInt32LE(offset + entry.size);
  const segment = targetSegments.get(segmentName);
  if (privateWord < segment.address || privateWord >= segment.address + segment.size) {
    throw new Error(`${name} reused identity is outside its declared segment class`);
  }
  const priorWord = identityWords.get(identity);
  const priorIdentity = wordIdentities.get(privateWord);
  if ((priorWord !== undefined && priorWord !== privateWord) ||
      (priorIdentity !== undefined && priorIdentity !== identity)) {
    throw new Error(`Target literal identity equality is inconsistent for ${name}`);
  }
  identityWords.set(identity, privateWord);
  wordIdentities.set(privateWord, identity);
}
for (const identity of globalStateIdentities.keys()) {
  if (identity.startsWith("opaque_") && !identityWords.has(identity)) {
    throw new Error(`Missing independent target literal seed for ${identity}`);
  }
}

for (const [name, mapping] of globalStates) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`${name} is not an inventoried ${mapping.size}-byte ARM function`);
  }
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + 4;
  const offset = entry.address - textStart;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + 4 > code.length) {
    throw new Error(`${name} has an invalid or out-of-bounds adjacent identity slot`);
  }
  if (mapping.behavior === "paired_store64:base_r2:a0_low:a1_high:4") {
    const obtainIdentity = code.readUInt32LE(offset);
    const pairedStore = code.readUInt32LE(offset + 4);
    const returnInstruction = code.readUInt32LE(offset + 8);
    const splitImmediate = ((pairedStore >>> 4) & 0xf0) | (pairedStore & 0x0f);
    if (entry.size !== 12 ||
        !isLiteralLoad(obtainIdentity, 2, 4) ||
        !isAl(pairedStore) ||
        (pairedStore & 0x0ff000f0) !== 0x01c000f0 ||
        ((pairedStore >>> 16) & 0xf) !== 2 ||
        ((pairedStore >>> 12) & 0xf) !== 0 ||
        splitImmediate !== 4 ||
        !isBxLr(returnInstruction)) {
      throw new Error(`${name} does not have the audited paired 64-bit store form`);
    }
  } else if (mapping.behavior === "clear_advance_clear:base_r1:zero_r0:offsets_0_4") {
    const obtainIdentity = code.readUInt32LE(offset);
    const makeZero = code.readUInt32LE(offset + 4);
    const firstClear = code.readUInt32LE(offset + 8);
    const advancePointer = code.readUInt32LE(offset + 12);
    const secondClear = code.readUInt32LE(offset + 16);
    const returnInstruction = code.readUInt32LE(offset + 20);
    if (entry.size !== 24 ||
        ![obtainIdentity, makeZero, firstClear, advancePointer, secondClear, returnInstruction].every(isAl) ||
        (obtainIdentity & 0x0fff0000) !== 0x059f0000 ||
        ((obtainIdentity >>> 12) & 0xf) !== 1 ||
        (obtainIdentity & 0xfff) !== 16 ||
        (makeZero & 0x0fff0000) !== 0x03a00000 ||
        ((makeZero >>> 12) & 0xf) !== 0 ||
        (makeZero & 0xfff) !== 0 ||
        (firstClear & 0x0ff00000) !== 0x05800000 ||
        ((firstClear >>> 16) & 0xf) !== 1 ||
        ((firstClear >>> 12) & 0xf) !== 0 ||
        (firstClear & 0xfff) !== 0 ||
        (advancePointer & 0x0ff00000) !== 0x02800000 ||
        ((advancePointer >>> 16) & 0xf) !== 1 ||
        ((advancePointer >>> 12) & 0xf) !== 1 ||
        (advancePointer & 0xfff) !== 4 ||
        (secondClear & 0x0ff00000) !== 0x05800000 ||
        ((secondClear >>> 16) & 0xf) !== 1 ||
        ((secondClear >>> 12) & 0xf) !== 0 ||
        (secondClear & 0xfff) !== 0 ||
        (returnInstruction & 0x0fffffff) !== 0x012fff1e) {
      throw new Error(`${name} does not have the audited ordered pointer-advance clear form`);
    }
  }
  const overlap = functions.find((candidate) => candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) throw new Error(`${name} identity slot overlaps inventoried function ${overlap.name}`);
  const privateWord = code.readUInt32LE(offset + entry.size);
  const segment = targetSegments.get(mapping.segment);
  if (privateWord < segment.address || privateWord >= segment.address + segment.size) {
    throw new Error(`${name} identity word is outside its declared segment class`);
  }
  const priorWord = identityWords.get(mapping.identity);
  const priorIdentity = wordIdentities.get(privateWord);
  if ((priorWord !== undefined && priorWord !== privateWord) ||
      (priorIdentity !== undefined && priorIdentity !== mapping.identity)) {
    throw new Error(`Neutral identity equality is inconsistent for ${name}`);
  }
  identityWords.set(mapping.identity, privateWord);
  wordIdentities.set(privateWord, mapping.identity);
}

const multiIdentityTemplates = new Map([
  ["construct_five_words", [0xe59f3018, 0xe59fc018, 0xe5803000, 0xe89c1008, 0xe580100c, 0xe5802010, 0xe9801008, 0xe12fff1e]],
  ["store_pair_stmia", [0xe59f1008, 0xe59f2008, 0xe8800006, 0xe12fff1e]],
  ["store_pair_offsets_4_8", [0xe59f200c, 0xe5802004, 0xe59f2008, 0xe5802008, 0xe12fff1e]],
  ["store_pair_offsets_0_8", [0xe59f100c, 0xe59f200c, 0xe5801000, 0xe5802008, 0xe12fff1e]],
  ["byte_indexed_word", [0xe59f000c, 0xe5d01001, 0xe59f0008, 0xe7900101, 0xe12fff1e]],
  ["store_three_offsets_140_0_64", [0xe59f2018, 0xe59f1010, 0xe580208c, 0xe59f2010, 0xe5801000, 0xe5802040, 0xe12fff1e]],
  ["clear_and_store_text_pair", [0xe59f2014, 0xe3a01000, 0xe5801024, 0xe59f100c, 0xe5a0201c, 0xe5801004, 0xe12fff1e]],
  ["sentinel_indexed_word", [0xe3500008, 0x059f000c, 0xe59f100c, 0x05d00001, 0xe7910100, 0xe12fff1e]],
  ["initialize_sparse_fields", [0xe59f1018, 0xe59f2018, 0xe5801000, 0xe3a01000, 0xe580211c, 0xe5c01118, 0xe58010e4, 0xe12fff1e]],
]);
const batchIdentityWords = new Map();
const batchWordIdentities = new Map();
let multiIdentityBytes = 0;
let multiIdentitySlots = 0;
for (const [name, mapping] of multiIdentityGlobals) {
  const entry = functionsByName.get(name);
  const expectedInstructions = multiIdentityTemplates.get(mapping.template);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== mapping.size ||
      expectedInstructions === undefined || expectedInstructions.length * 4 !== entry.size) {
    throw new Error(`${name} is not the configured inventoried ARM function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.slots.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 ||
      offset + entry.size + mapping.slots.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds adjacent identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} identity slots overlap inventoried function ${overlap.name}`);
  }
  for (let index = 0; index < expectedInstructions.length; index++) {
    if (code.readUInt32LE(offset + index * 4) !== expectedInstructions[index]) {
      throw new Error(`${name} does not match deterministic template ${mapping.template}`);
    }
  }
  for (let index = 0; index < mapping.slots.length; index++) {
    const slot = mapping.slots[index];
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const segment = targetSegments.get(slot.segment);
    if (privateWord < segment.address || privateWord >= segment.address + segment.size) {
      throw new Error(`${name} slot ${index} is outside its declared segment class`);
    }
    const priorWord = identityWords.get(slot.identity);
    const priorIdentity = wordIdentities.get(privateWord);
    if ((priorWord !== undefined && priorWord !== privateWord) ||
        (priorIdentity !== undefined && priorIdentity !== slot.identity)) {
      throw new Error(`Cross-batch neutral identity equality is inconsistent for ${name} slot ${index}`);
    }
    const priorBatchWord = batchIdentityWords.get(slot.identity);
    const priorBatchIdentity = batchWordIdentities.get(privateWord);
    if ((priorBatchWord !== undefined && priorBatchWord !== privateWord) ||
        (priorBatchIdentity !== undefined && priorBatchIdentity !== slot.identity)) {
      throw new Error(`Batch neutral identity equality is inconsistent for ${name} slot ${index}`);
    }
    identityWords.set(slot.identity, privateWord);
    wordIdentities.set(privateWord, slot.identity);
    batchIdentityWords.set(slot.identity, privateWord);
    batchWordIdentities.set(privateWord, slot.identity);
  }
  multiIdentityBytes += entry.size;
  multiIdentitySlots += mapping.slots.length;
}
if (multiIdentityBytes !== 220 || multiIdentitySlots !== 19 || batchIdentityWords.size !== 17 ||
    batchWordIdentities.size !== 17 ||
    !batchIdentityWords.has("global_state_19") || !batchIdentityWords.has("global_load_46")) {
  throw new Error("Multi-identity batch totals or cross-batch identity reuses are invalid");
}

const assembly = [
  ".syntax unified",
  ".arch armv6k",
  ""
];
for (const entry of functions) {
  const alignment = entry.mode === "$a" ? 4 : 2;
  const offset = entry.address - textStart;
  if (entry.size % alignment !== 0) {
    throw new Error(`${entry.name} has a size incompatible with ${entry.mode} mode`);
  }
  const destination = branchThunks.get(entry.name);
  const adjacentGlobalLoad = adjacentGlobalLoads.get(entry.name);
  const globalState = globalStates.get(entry.name);
  const duplicateIpcAndTable = duplicateIpcAndTables.get(entry.name);
  const multiIdentityGlobal = multiIdentityGlobals.get(entry.name);
  const instructions = [];
  const configuredMappings = [destination, adjacentGlobalLoad, globalState, duplicateIpcAndTable, multiIdentityGlobal].filter(Boolean);
  if (configuredMappings.length > 1) {
    throw new Error(`${entry.name} has conflicting target-generation mappings`);
  } else if (destination) {
    if (entry.mode !== "$a" || entry.size !== 4) {
      throw new Error(`${entry.name} is not a four-byte ARM function`);
    }
    instructions.push(`b ${destination}`);
    branchThunks.delete(entry.name);
  } else {
    for (let cursor = 0; cursor < entry.size; cursor += alignment) {
      const value = alignment === 4
        ? code.readUInt32LE(offset + cursor)
        : code.readUInt16LE(offset + cursor);
      instructions.push(
        alignment === 4
          ? `.inst 0x${value.toString(16).padStart(8, "0")}`
          : `.inst.n 0x${value.toString(16).padStart(4, "0")}`
      );
    }
  }
  assembly.push(
    `.section .text.${entry.name},"ax",%progbits`,
    `.balign ${alignment}`,
    entry.mode === "$a" ? ".arm" : ".thumb",
    `.global ${entry.name}`,
    `.type ${entry.name}, %function`,
    ...(entry.mode === "$t" ? [".thumb_func"] : []),
    `${entry.name}:`,
    ...instructions,
    `.size ${entry.name}, .-${entry.name}`,
    ...(adjacentGlobalLoad || globalState
      ? [`.word ${(adjacentGlobalLoad ?? globalState).identity}`, `.global ${(adjacentGlobalLoad ?? globalState).identity}`]
      : []),
    ...(duplicateIpcAndTable?.template === "table_state"
      ? duplicateIpcAndTable.tables.map((identity) => `.global ${identity}`)
      : duplicateIpcAndTable
        ? [
            `.word ${duplicateIpcAndTable.command}`,
            `.word ${duplicateIpcAndTable.handle}`,
            `.global ${duplicateIpcAndTable.command}`,
            `.global ${duplicateIpcAndTable.handle}`,
          ]
        : []),
    ...(multiIdentityGlobal
      ? multiIdentityGlobal.slots.flatMap((slot) => [`.word ${slot.identity}`, `.global ${slot.identity}`])
      : []),
    ""
  );
  duplicateIpcAndTables.delete(entry.name);
  multiIdentityGlobals.delete(entry.name);
}
if (branchThunks.size !== 0) {
  throw new Error(
    `ARM direct-branch thunks missing from the function inventory: ${[...branchThunks.keys()].join(", ")}`
  );
}
if (duplicateIpcAndTables.size !== 0) {
  throw new Error(
    `Duplicate IPC/table mappings missing from the function inventory: ${[...duplicateIpcAndTables.keys()].join(", ")}`
  );
}
if (multiIdentityGlobals.size !== 0) {
  throw new Error(
    `Multi-identity mappings missing from the function inventory: ${[...multiIdentityGlobals.keys()].join(", ")}`
  );
}
writeFileSync(assemblyPath, `${assembly.join("\n")}\n`);

const assembled = spawnSync(
  assembler,
  ["-mcpu=mpcore", "-o", objectPath, assemblyPath],
  { cwd: root, stdio: "inherit" }
);
if (assembled.error || assembled.status !== 0) {
  throw assembled.error ?? new Error(`Assembler exited with status ${assembled.status}`);
}

const symbols = spawnSync(readelf, ["--symbols", "--wide", objectPath], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024
});
if (symbols.error || symbols.status !== 0) {
  throw symbols.error ?? new Error(`readelf exited with status ${symbols.status}`);
}
const functionSymbols = symbols.stdout
  .split(/\r?\n/)
  .filter((line) => /\bFUNC\b/.test(line) && /\bGLOBAL\b/.test(line));
if (functionSymbols.length !== functions.length) {
  throw new Error(
    `Target object has ${functionSymbols.length} global functions; expected ${functions.length}`
  );
}

const config = {
  $schema: "https://raw.githubusercontent.com/encounter/objdiff/main/config.schema.json",
  min_version: "2.0.0",
  build_target: false,
  build_base: false,
  units: [
    {
      name: "main/code",
      target_path: relative(root, objectPath),
      ...(existsSync(baseObjectPath) ? { base_path: relative(root, baseObjectPath) } : {}),
      metadata: { complete: false }
    }
  ]
};
writeFileSync(join(root, "objdiff.json"), `${JSON.stringify(config, null, 2)}\n`);
console.log(`Built an ignored target object with ${functions.length} conservative functions.`);
console.log("Generated ignored objdiff.json for the main/code inventory unit.");
