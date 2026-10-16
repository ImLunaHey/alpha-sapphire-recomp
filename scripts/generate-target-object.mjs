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
  ipcUniqueTemplatesPath,
  ipcTemplates15Path,
  ipcTemplates16Path,
  ipcTemplates17Path,
  ipcTemplates18Path,
  ipcTemplates19Path,
  ipcTemplates20Path,
  ipcTemplates21Path,
  ipcTemplates22Path,
  ipcTemplates23Path,
  ipcTemplates24Path,
  ipcTemplates25Path,
  ipcTemplates26Path,
  ipcTemplates27Path,
  ipcTemplates28Path,
  ipcTemplates29Path,
  ipcTemplates30Path,
  ipcTemplates31Path,
  ipcTemplates32Path,
  ipcTemplates33Path,
  ipcTemplates34Path,
  ipcTemplates35Path,
  ipcTemplates36Path,
  ipcTemplates37Path,
  ipcTemplates38Path,
  ipcTemplates39Path,
  ipcTemplates40Path,
  ipcTemplates41Path,
  ipcTemplates42Path,
  ipcTemplates43Path,
  ipcTemplates44Path,
  ipcTemplates45Path,
  duplicateTemplates19Path,
  duplicateTemplates21Path,
  duplicateTemplates22Path,
  duplicateTemplates23Path,
  duplicateTemplates24Path,
  duplicateTemplates25Path,
  duplicateTemplates26Path,
  duplicateTemplates27Path,
  duplicateTemplates29Path,
  duplicateTemplates30Path,
  duplicateTemplates31Path,
  duplicateTemplates32Path,
  duplicateTemplates33Path,
  duplicateTemplates34Path,
  duplicateTemplates35Path,
  duplicateTemplates36Path,
  duplicateTemplates37Path,
  duplicateTemplates38Path,
  duplicateTemplates39Path,
  duplicateTemplates40Path,
  duplicateTemplates41Path,
  duplicateTemplates42Path,
  duplicateTemplates43Path,
  duplicateTemplates44Path,
  duplicateTemplates45Path,
  duplicateTemplates46Path,
  duplicateTemplates47Path,
  duplicateTemplates48Path,
  duplicateTemplates49Path,
  duplicateContainerTemplatesPath,
  runtimeHelpers23Path,
  runtimeHelpers24Path,
  runtimeHelpers25Path,
  runtimeHelpers26Path,
  runtimeHelpers27Path,
  runtimeHelpers29Path,
  runtimeHelpers30Path,
  runtimeHelpers31Path,
  runtimeHelpers32Path,
  runtimeHelpers33Path,
  runtimeHelpers34Path,
  runtimeHelpers36Path,
  runtimeHelpers37Path,
  runtimeHelpers38Path,
  runtimeHelpers41Path,
  runtimeHelpers43Path,
  runtimeHelpers44Path,
  runtimeHelpers46Path,
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
  !ipcUniqueTemplatesPath ||
  !ipcTemplates15Path ||
  !ipcTemplates16Path ||
  !ipcTemplates17Path ||
  !ipcTemplates18Path ||
  !ipcTemplates19Path ||
  !ipcTemplates20Path ||
  !ipcTemplates21Path ||
  !ipcTemplates22Path ||
  !ipcTemplates23Path ||
  !ipcTemplates24Path ||
  !ipcTemplates25Path ||
  !ipcTemplates26Path ||
  !ipcTemplates27Path ||
  !ipcTemplates28Path ||
  !ipcTemplates29Path ||
  !ipcTemplates30Path ||
  !ipcTemplates31Path ||
  !ipcTemplates32Path ||
  !ipcTemplates33Path ||
  !ipcTemplates34Path ||
  !ipcTemplates35Path ||
  !ipcTemplates36Path ||
  !ipcTemplates37Path ||
  !ipcTemplates38Path ||
  !ipcTemplates39Path ||
  !ipcTemplates40Path ||
  !ipcTemplates41Path ||
  !ipcTemplates42Path ||
  !ipcTemplates43Path ||
  !ipcTemplates44Path ||
  !ipcTemplates45Path ||
  !duplicateTemplates19Path ||
  !duplicateTemplates21Path ||
  !duplicateTemplates22Path ||
  !duplicateTemplates23Path ||
  !duplicateTemplates24Path ||
  !duplicateTemplates25Path ||
  !duplicateTemplates26Path ||
  !duplicateTemplates27Path ||
  !duplicateTemplates29Path ||
  !duplicateTemplates30Path ||
  !duplicateTemplates31Path ||
  !duplicateTemplates32Path ||
  !duplicateTemplates33Path ||
  !duplicateTemplates34Path ||
  !duplicateTemplates35Path ||
  !duplicateTemplates36Path ||
  !duplicateTemplates37Path ||
  !duplicateTemplates38Path ||
  !duplicateTemplates39Path ||
  !duplicateTemplates40Path ||
  !duplicateTemplates41Path ||
  !duplicateTemplates42Path ||
  !duplicateTemplates43Path ||
  !duplicateTemplates44Path ||
  !duplicateTemplates45Path ||
  !duplicateTemplates46Path ||
  !duplicateTemplates47Path ||
  !duplicateTemplates48Path ||
  !duplicateTemplates49Path ||
  !duplicateContainerTemplatesPath ||
  !runtimeHelpers23Path ||
  !runtimeHelpers24Path ||
  !runtimeHelpers25Path ||
  !runtimeHelpers26Path ||
  !runtimeHelpers27Path ||
  !runtimeHelpers29Path ||
  !runtimeHelpers30Path ||
  !runtimeHelpers31Path ||
  !runtimeHelpers32Path ||
  !runtimeHelpers33Path ||
  !runtimeHelpers34Path ||
  !runtimeHelpers36Path ||
  !runtimeHelpers37Path ||
  !runtimeHelpers38Path ||
  !runtimeHelpers41Path ||
  !runtimeHelpers43Path ||
  !runtimeHelpers44Path ||
  !runtimeHelpers46Path ||
  !literalIdentitiesPath ||
  !targetConfigPath
) {
  throw new Error(
    "Expected all configured source-normalization mappings, target literal identities, and target config paths, including duplicate template batch 49"
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

const ipcUniqueTemplatesConfig = JSON.parse(readFileSync(ipcUniqueTemplatesPath, "utf8"));
if (ipcUniqueTemplatesConfig.schemaVersion !== 1 ||
    !Array.isArray(ipcUniqueTemplatesConfig.functions) ||
    ipcUniqueTemplatesConfig.functions.length !== 29) {
  throw new Error("Unexpected unique IPC mapping format");
}
const ipcUniqueTemplates = new Map();
const ipcUniqueTemplateSizes = new Map([
  ["global_one_word", 48],
  ["global_six_mixed", 84],
  ["handle_word_byte", 72],
  ["handle_word", 60],
  ["handle_word_two_bytes", 80],
]);
const ipcUniqueTemplateCounts = new Map();
let configuredIpcUniqueBytes = 0;
for (const entry of ipcUniqueTemplatesConfig.functions) {
  const expectedSize = ipcUniqueTemplateSizes.get(entry?.template);
  const hasHandle = entry?.template === "global_one_word" || entry?.template === "global_six_mixed";
  if (entry === null || typeof entry !== "object" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || entry.mode !== "arm" ||
      expectedSize === undefined || entry.size !== expectedSize ||
      !/^ipc_command_func_[0-9A-F]{8}$/.test(entry.command) ||
      (hasHandle && !/^ipc_handle_slot_(?:alpha|delta|epsilon|gamma|zeta)$/.test(entry.handle)) ||
      (!hasHandle && entry.handle !== undefined) || ipcUniqueTemplates.has(entry.name)) {
    throw new Error("Invalid or duplicate unique IPC mapping entry");
  }
  ipcUniqueTemplates.set(entry.name, entry);
  ipcUniqueTemplateCounts.set(entry.template, (ipcUniqueTemplateCounts.get(entry.template) ?? 0) + 1);
  configuredIpcUniqueBytes += entry.size;
}
if (configuredIpcUniqueBytes !== 1916 ||
    ipcUniqueTemplateCounts.get("global_one_word") !== 8 ||
    ipcUniqueTemplateCounts.get("global_six_mixed") !== 5 ||
    ipcUniqueTemplateCounts.get("handle_word_byte") !== 6 ||
    ipcUniqueTemplateCounts.get("handle_word") !== 6 ||
    ipcUniqueTemplateCounts.get("handle_word_two_bytes") !== 4 ||
    ipcUniqueTemplateCounts.size !== 5) {
  throw new Error("Unexpected unique IPC template totals");
}

const ipcTemplates15Config = JSON.parse(readFileSync(ipcTemplates15Path, "utf8"));
if (ipcTemplates15Config.schemaVersion !== 1 ||
    !Array.isArray(ipcTemplates15Config.functions) || ipcTemplates15Config.functions.length !== 23) {
  throw new Error("Unexpected IPC template 15 mapping format");
}
const ipcTemplates15 = new Map();
const ipcTemplate15Definitions = new Map([
  ["handle_pointer_one", { size: 44, count: 7, literals: ["command"] }],
  ["thirteen_descriptor", { size: 140, count: 2, literals: ["command"] }],
  ["mixed_static_mapped", { size: 92, count: 3, literals: ["command"] }],
  ["global_one_output_aux", { size: 136, count: 2, literals: ["command", "auxiliary", "handle"] }],
  ["global_temp_tls", { size: 132, count: 2, literals: ["command", "handle"] }],
  ["global_byte_halfwords", { size: 88, count: 3, literals: ["command", "handle"] }],
  ["global_mapped_buffer", { size: 64, count: 4, literals: ["command", "handle"] }],
]);
const ipcTemplate15Counts = new Map();
let configuredIpcTemplate15Bytes = 0;
let configuredIpcTemplate15Slots = 0;
for (const entry of ipcTemplates15Config.functions) {
  const definition = ipcTemplate15Definitions.get(entry?.template);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.mode !== "arm" || definition === undefined || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      ipcTemplates15.has(entry.name)) {
    throw new Error("Invalid or duplicate IPC template 15 mapping entry");
  }
  ipcTemplates15.set(entry.name, entry);
  ipcTemplate15Counts.set(entry.template, (ipcTemplate15Counts.get(entry.template) ?? 0) + 1);
  configuredIpcTemplate15Bytes += entry.size;
  configuredIpcTemplate15Slots += definition.literals.length;
}
for (const [name, definition] of ipcTemplate15Definitions) {
  if (ipcTemplate15Counts.get(name) !== definition.count) {
    throw new Error(`Unexpected ${name} IPC template 15 cardinality`);
  }
}
if (ipcTemplate15Counts.size !== 7 || configuredIpcTemplate15Bytes !== 1920 ||
    configuredIpcTemplate15Slots !== 36) {
  throw new Error("Unexpected IPC template 15 totals");
}

const ipcTemplates16Config = JSON.parse(readFileSync(ipcTemplates16Path, "utf8"));
if (ipcTemplates16Config.schemaVersion !== 1 ||
    !Array.isArray(ipcTemplates16Config.functions) || ipcTemplates16Config.functions.length !== 16) {
  throw new Error("Unexpected IPC template 16 mapping format");
}
const ipcTemplates16 = new Map();
const ipcTemplate16Definitions = new Map([
  ["global_two_descriptors_output", { size: 120, count: 2, literals: ["command", "handle"] }],
  ["global_aux_three_descriptors", { size: 116, count: 2, literals: ["command", "auxiliary", "handle"] }],
  ["handle_static_descriptor", { size: 76, count: 3, literals: ["command"] }],
  ["global_three_bytes", { size: 72, count: 3, literals: ["command", "handle"] }],
  ["global_two_mapped", { size: 104, count: 2, literals: ["command", "handle"] }],
  ["global_fixed_output", { size: 104, count: 2, literals: ["command", "handle"] }],
  ["handle_two_halfword_outputs", { size: 104, count: 2, literals: ["command"] }],
]);
const ipcTemplate16Counts = new Map();
let configuredIpcTemplate16Bytes = 0;
let configuredIpcTemplate16Slots = 0;
for (const entry of ipcTemplates16Config.functions) {
  const definition = ipcTemplate16Definitions.get(entry?.template);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.mode !== "arm" || definition === undefined || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      ipcTemplates16.has(entry.name)) {
    throw new Error("Invalid or duplicate IPC template 16 mapping entry");
  }
  ipcTemplates16.set(entry.name, entry);
  ipcTemplate16Counts.set(entry.template, (ipcTemplate16Counts.get(entry.template) ?? 0) + 1);
  configuredIpcTemplate16Bytes += entry.size;
  configuredIpcTemplate16Slots += definition.literals.length;
}
for (const [name, definition] of ipcTemplate16Definitions) {
  if (ipcTemplate16Counts.get(name) !== definition.count) {
    throw new Error(`Unexpected ${name} IPC template 16 cardinality`);
  }
}
if (ipcTemplate16Counts.size !== 7 || configuredIpcTemplate16Bytes !== 1540 ||
    configuredIpcTemplate16Slots !== 29) {
  throw new Error("Unexpected IPC template 16 totals");
}

const ipcTemplates17Config = JSON.parse(readFileSync(ipcTemplates17Path, "utf8"));
if (ipcTemplates17Config.schemaVersion !== 1 ||
    !Array.isArray(ipcTemplates17Config.functions) || ipcTemplates17Config.functions.length !== 18) {
  throw new Error("Unexpected IPC template 17 mapping format");
}
const ipcTemplates17 = new Map();
const ipcTemplate17Definitions = new Map([
  ["handle_mapped_three_outputs", { size: 100, count: 2, literals: ["command"] }],
  ["handle_descriptor_two_outputs", { size: 96, count: 2, literals: ["command"] }],
  ["handle_mapped_mixed_outputs", { size: 92, count: 2, literals: ["command"] }],
  ["handle_two_bytes_one_output", { size: 92, count: 2, literals: ["command"] }],
  ["handle_static_one_output", { size: 92, count: 2, literals: ["command"] }],
  ["global_words_byte_mapped", { size: 84, count: 2, literals: ["command", "handle"] }],
  ["global_two_descriptors", { size: 84, count: 2, literals: ["command", "handle"] }],
  ["handle_halfword_one_output", { size: 84, count: 2, literals: ["command"] }],
  ["global_fixed_mapped", { size: 80, count: 2, literals: ["command", "handle"] }],
]);
const ipcTemplate17Counts = new Map();
let configuredIpcTemplate17Bytes = 0;
let configuredIpcTemplate17Slots = 0;
for (const entry of ipcTemplates17Config.functions) {
  const definition = ipcTemplate17Definitions.get(entry?.template);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.mode !== "arm" || definition === undefined || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      ipcTemplates17.has(entry.name)) {
    throw new Error("Invalid or duplicate IPC template 17 mapping entry");
  }
  ipcTemplates17.set(entry.name, entry);
  ipcTemplate17Counts.set(entry.template, (ipcTemplate17Counts.get(entry.template) ?? 0) + 1);
  configuredIpcTemplate17Bytes += entry.size;
  configuredIpcTemplate17Slots += definition.literals.length;
}
for (const [name, definition] of ipcTemplate17Definitions) {
  if (ipcTemplate17Counts.get(name) !== definition.count) {
    throw new Error(`Unexpected ${name} IPC template 17 cardinality`);
  }
}
if (ipcTemplate17Counts.size !== 9 || configuredIpcTemplate17Bytes !== 1608 ||
    configuredIpcTemplate17Slots !== 24) {
  throw new Error("Unexpected IPC template 17 totals");
}

const ipcTemplates18Config = JSON.parse(readFileSync(ipcTemplates18Path, "utf8"));
if (ipcTemplates18Config.schemaVersion !== 1 ||
    !Array.isArray(ipcTemplates18Config.functions) || ipcTemplates18Config.functions.length !== 25) {
  throw new Error("Unexpected IPC template 18 mapping format");
}
const ipcTemplates18 = new Map();
const ipcTemplate18Definitions = new Map([
  ["handle_mapped_byte_io", { size: 80, count: 2, literals: ["command"] }],
  ["handle_two_mapped", { size: 80, count: 2, literals: ["command"] }],
  ["handle_byte_descriptor", { size: 80, count: 2, literals: ["command"] }],
  ["global_constant_32", { size: 52, count: 3, literals: ["command", "handle"] }],
  ["handle_no_input_output", { size: 52, count: 3, literals: ["command"] }],
  ["global_halfword", { size: 52, count: 3, literals: ["command", "handle"] }],
  ["global_static_descriptor_word", { size: 76, count: 2, literals: ["command", "handle"] }],
  ["global_six_static_descriptor", { size: 72, count: 2, literals: ["command", "handle"] }],
  ["global_mapped_output", { size: 72, count: 2, literals: ["command", "handle"] }],
  ["handle_halfword_mapped", { size: 72, count: 2, literals: ["command"] }],
  ["handle_mapped_byte_output", { size: 72, count: 2, literals: ["command"] }],
]);
const ipcTemplate18Counts = new Map();
let configuredIpcTemplate18Bytes = 0;
let configuredIpcTemplate18Slots = 0;
for (const entry of ipcTemplates18Config.functions) {
  const definition = ipcTemplate18Definitions.get(entry?.template);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.mode !== "arm" || definition === undefined || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      ipcTemplates18.has(entry.name)) {
    throw new Error("Invalid or duplicate IPC template 18 mapping entry");
  }
  ipcTemplates18.set(entry.name, entry);
  ipcTemplate18Counts.set(entry.template, (ipcTemplate18Counts.get(entry.template) ?? 0) + 1);
  configuredIpcTemplate18Bytes += entry.size;
  configuredIpcTemplate18Slots += definition.literals.length;
}
for (const [name, definition] of ipcTemplate18Definitions) {
  if (ipcTemplate18Counts.get(name) !== definition.count) {
    throw new Error(`Unexpected ${name} IPC template 18 cardinality`);
  }
}
if (ipcTemplate18Counts.size !== 11 || configuredIpcTemplate18Bytes !== 1676 ||
    configuredIpcTemplate18Slots !== 37) {
  throw new Error("Unexpected IPC template 18 totals");
}

const ipcTemplates19Config = JSON.parse(readFileSync(ipcTemplates19Path, "utf8"));
if (ipcTemplates19Config.schemaVersion !== 1 ||
    !Array.isArray(ipcTemplates19Config.functions) || ipcTemplates19Config.functions.length !== 23) {
  throw new Error("Unexpected IPC template 19 mapping format");
}
const ipcTemplates19 = new Map();
const ipcTemplate19Definitions = new Map([
  ["global_static_descriptor", { size: 68, count: 2, literals: ["command", "handle"] }],
  ["global_byte_word_output", { size: 68, count: 2, literals: ["command", "handle"] }],
  ["inline_mixed_output", { size: 64, count: 2, literals: [], inlineCommand: "ipc_inline_command_id_48_no_params" }],
  ["handle_fixed_32", { size: 64, count: 2, literals: ["command"] }],
  ["global_mapped_buffer", { size: 64, count: 2, literals: ["command", "handle"] }],
  ["handle_byte_output", { size: 64, count: 2, literals: ["command"] }],
  ["handle_halfword_zero_word", { size: 64, count: 2, literals: ["command"] }],
  ["inline_no_input", { size: 40, count: 3, literals: [], inlineCommand: "ipc_inline_command_id_3_no_params" }],
  ["global_word_byte_output", { size: 60, count: 2, literals: ["command", "handle"] }],
  ["global_five_word", { size: 60, count: 2, literals: ["command", "handle"] }],
  ["global_word_32", { size: 56, count: 2, literals: ["command", "handle"] }],
]);
const ipcTemplate19Counts = new Map();
let configuredIpcTemplate19Bytes = 0;
let configuredIpcTemplate19Slots = 0;
for (const entry of ipcTemplates19Config.functions) {
  const definition = ipcTemplate19Definitions.get(entry?.template);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.mode !== "arm" || definition === undefined || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      (definition.literals.length === 0 && entry.inlineCommand !== definition.inlineCommand) ||
      ipcTemplates19.has(entry.name)) {
    throw new Error("Invalid or duplicate IPC template 19 mapping entry");
  }
  ipcTemplates19.set(entry.name, entry);
  ipcTemplate19Counts.set(entry.template, (ipcTemplate19Counts.get(entry.template) ?? 0) + 1);
  configuredIpcTemplate19Bytes += entry.size;
  configuredIpcTemplate19Slots += definition.literals.length;
}
for (const [name, definition] of ipcTemplate19Definitions) {
  if (ipcTemplate19Counts.get(name) !== definition.count) {
    throw new Error(`Unexpected ${name} IPC template 19 cardinality`);
  }
}
if (ipcTemplate19Counts.size !== 11 || configuredIpcTemplate19Bytes !== 1384 ||
    configuredIpcTemplate19Slots !== 30) {
  throw new Error("Unexpected IPC template 19 totals");
}

const ipcTemplates20Config = JSON.parse(readFileSync(ipcTemplates20Path, "utf8"));
if (ipcTemplates20Config.schemaVersion !== 1 ||
    !Array.isArray(ipcTemplates20Config.functions) || ipcTemplates20Config.functions.length !== 24) {
  throw new Error("Unexpected IPC template 20 mapping format");
}
const ipcTemplates20 = new Map();
const ipcTemplate20Definitions = new Map([
  ["handle_four_word_output", { size: 72, count: 2, literals: ["command"] }],
  ["handle_mixed_stack", { size: 68, count: 2, literals: ["command"] }],
  ["global_byte", { size: 56, count: 2, literals: ["command", "handle"] }],
  ["handle_two_reg_stack", { size: 52, count: 2, literals: ["command"] }],
  ["handle_word_32", { size: 52, count: 2, literals: ["command"] }],
  ["handle_byte_output", { size: 52, count: 2, literals: ["command"] }],
  ["inline_31_output", { size: 52, count: 2, literals: [], inlineCommand: "ipc_inline_command_id_31_no_params" }],
  ["inline_global_43", { size: 44, count: 2, literals: ["handle"], inlineCommand: "ipc_inline_command_id_43_no_params" }],
  ["handle_two_word_stm", { size: 44, count: 2, literals: ["command"] }],
  ["inline_global_2", { size: 44, count: 2, literals: ["handle"], inlineCommand: "ipc_inline_command_id_2_no_params" }],
  ["handle_literal_no_input", { size: 40, count: 2, literals: ["command"] }],
  ["inline_14_no_input", { size: 40, count: 2, literals: [], inlineCommand: "ipc_inline_command_id_14_no_params" }],
]);
const ipcTemplate20Counts = new Map();
let configuredIpcTemplate20Bytes = 0;
let configuredIpcTemplate20Slots = 0;
for (const entry of ipcTemplates20Config.functions) {
  const definition = ipcTemplate20Definitions.get(entry?.template);
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.mode !== "arm" || definition === undefined || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      (definition.inlineCommand === undefined) !== (entry.inlineCommand === undefined) ||
      (definition.inlineCommand !== undefined && entry.inlineCommand !== definition.inlineCommand) ||
      ipcTemplates20.has(entry.name)) {
    throw new Error("Invalid or duplicate IPC template 20 mapping entry");
  }
  ipcTemplates20.set(entry.name, entry);
  ipcTemplate20Counts.set(entry.template, (ipcTemplate20Counts.get(entry.template) ?? 0) + 1);
  configuredIpcTemplate20Bytes += entry.size;
  configuredIpcTemplate20Slots += definition.literals.length;
}
for (const [name, definition] of ipcTemplate20Definitions) {
  if (ipcTemplate20Counts.get(name) !== definition.count) {
    throw new Error(`Unexpected ${name} IPC template 20 cardinality`);
  }
}
if (ipcTemplate20Counts.size !== 12 || configuredIpcTemplate20Bytes !== 1232 ||
    configuredIpcTemplate20Slots !== 22) {
  throw new Error("Unexpected IPC template 20 totals");
}

const ipcTemplates21Config = JSON.parse(readFileSync(ipcTemplates21Path, "utf8"));
const ipcTemplate21Definitions = new Map([
  ["four_word_two_outputs_static", { size: 160, literals: ["command"] }], ["eleven_word_two_static", { size: 156, literals: ["command"] }],
  ["structured_mapped", { size: 144, literals: ["command"] }], ["four_mixed_outputs_static", { size: 136, literals: ["command"] }],
  ["scaled_static_buffer", { size: 136, literals: ["command"] }], ["global_struct_mixed", { size: 136, literals: ["command", "handle"] }],
  ["dual_static_output", { size: 128, literals: ["command"] }], ["static_mapped_output", { size: 128, literals: ["command"] }],
  ["mapped_preserved_static", { size: 128, literals: ["command"] }], ["global_helper_structure", { size: 124, literals: ["command", "handle"], call: "func_0016C090" }],
  ["static_two_outputs", { size: 120, literals: ["command"] }], ["mapped_static_output", { size: 120, literals: ["command"] }],
]);
const ipcTemplates21 = new Map();
let configuredIpcTemplate21Bytes = 0;
let configuredIpcTemplate21Slots = 0;
for (const entry of ipcTemplates21Config.functions ?? []) {
  const definition = ipcTemplate21Definitions.get(entry?.template);
  if (!definition || entry.mode !== "arm" || entry.size !== definition.size || definition.literals.some((key) => typeof entry[key] !== "string") ||
      (definition.call === undefined ? entry.call !== undefined : entry.call !== definition.call) || ipcTemplates21.has(entry.name)) throw new Error("Invalid IPC template 21 mapping entry");
  ipcTemplates21.set(entry.name, entry); configuredIpcTemplate21Bytes += entry.size; configuredIpcTemplate21Slots += definition.literals.length;
}
if (ipcTemplates21.size !== 12 || configuredIpcTemplate21Bytes !== 1616 || configuredIpcTemplate21Slots !== 14) throw new Error("Unexpected IPC template 21 totals");

const ipcTemplates22Config = JSON.parse(readFileSync(ipcTemplates22Path, "utf8"));
const ipcTemplate22Definitions = new Map([
  ["global_twelve_word", { size: 120, literals: ["command", "handle"] }],
  ["inline_global_six_outputs", { size: 116, literals: ["handle"], inlineCommand: "ipc_inline_command_id_10_no_params" }],
  ["global_mapped_static", { size: 116, literals: ["command", "handle"] }],
  ["structured_mapped", { size: 116, literals: ["command"] }],
  ["two_descriptor_pairs", { size: 116, literals: ["command"] }],
  ["mixed_static", { size: 112, literals: ["command"] }],
  ["structure_halfword", { size: 112, literals: ["command"] }],
  ["scaled_static", { size: 112, literals: ["command"] }],
]);
const ipcTemplates22 = new Map();
let configuredIpcTemplate22Bytes = 0;
let configuredIpcTemplate22Slots = 0;
for (const entry of ipcTemplates22Config.functions ?? []) {
  const definition = ipcTemplate22Definitions.get(entry?.template);
  if (!definition || entry.mode !== "arm" || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      (definition.inlineCommand === undefined ? entry.inlineCommand !== undefined : entry.inlineCommand !== definition.inlineCommand) ||
      ipcTemplates22.has(entry.name)) throw new Error("Invalid IPC template 22 mapping entry");
  ipcTemplates22.set(entry.name, entry);
  configuredIpcTemplate22Bytes += entry.size;
  configuredIpcTemplate22Slots += definition.literals.length;
}
if (ipcTemplates22.size !== 8 || configuredIpcTemplate22Bytes !== 920 || configuredIpcTemplate22Slots !== 10) throw new Error("Unexpected IPC template 22 totals");

const ipcTemplates23Config = JSON.parse(readFileSync(ipcTemplates23Path, "utf8"));
const ipcTemplate23Definitions = new Map([
  ["multi_output_descriptors", { size: 112, literals: ["command"] }],
  ["global_static_byte", { size: 108, literals: ["command", "handle"] }],
  ["global_four_outputs", { size: 104, literals: ["command", "handle"] }],
  ["three_descriptor_pairs", { size: 104, literals: ["command"] }],
  ["structure_three_outputs", { size: 104, literals: ["command"] }],
  ["mapped_halfword_output", { size: 104, literals: ["command"] }],
  ["auxiliary_static", { size: 104, literals: ["command", "auxiliary", "staticDescriptor"] }],
  ["mapped_descriptor_output", { size: 104, literals: ["command"] }],
]);
const ipcTemplates23 = new Map();
let configuredIpcTemplate23Bytes = 0;
let configuredIpcTemplate23Slots = 0;
for (const entry of ipcTemplates23Config.functions ?? []) {
  const definition = ipcTemplate23Definitions.get(entry?.template);
  if (!definition || entry.mode !== "arm" || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") || ipcTemplates23.has(entry.name)) {
    throw new Error("Invalid IPC template 23 mapping entry");
  }
  ipcTemplates23.set(entry.name, entry);
  configuredIpcTemplate23Bytes += entry.size;
  configuredIpcTemplate23Slots += definition.literals.length;
}
if (ipcTemplates23.size !== 8 || configuredIpcTemplate23Bytes !== 844 || configuredIpcTemplate23Slots !== 12) throw new Error("Unexpected IPC template 23 totals");

const ipcTemplates24Config = JSON.parse(readFileSync(ipcTemplates24Path, "utf8"));
const ipcTemplate24Definitions = new Map([
  ["temporary_static_output", { size: 104, literals: ["command"] }],
  ["temporary_static_halfword_output", { size: 100, literals: ["command"] }],
  ["global_named_static_descriptor", { size: 100, literals: ["command", "staticDescriptor", "handle"] }],
  ["entry_static_output", { size: 100, literals: ["command"] }],
  ["entry_three_word_static_output", { size: 96, literals: ["command"] }],
  ["global_mixed_zero_pair", { size: 96, literals: ["command", "handle"] }],
  ["global_two_descriptor_pairs", { size: 92, literals: ["command", "handle"] }],
  ["entry_counted_pointer", { size: 92, literals: ["command"] }],
]);
const ipcTemplates24 = new Map();
let configuredIpcTemplate24Bytes = 0;
let configuredIpcTemplate24Slots = 0;
for (const entry of ipcTemplates24Config.functions ?? []) {
  const definition = ipcTemplate24Definitions.get(entry?.template);
  if (!definition || entry.mode !== "arm" || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") || ipcTemplates24.has(entry.name)) {
    throw new Error("Invalid IPC template 24 mapping entry");
  }
  ipcTemplates24.set(entry.name, entry);
  configuredIpcTemplate24Bytes += entry.size;
  configuredIpcTemplate24Slots += definition.literals.length;
}
if (ipcTemplates24.size !== 8 || configuredIpcTemplate24Bytes !== 780 || configuredIpcTemplate24Slots !== 12) throw new Error("Unexpected IPC template 24 totals");

const ipcTemplates25Config = JSON.parse(readFileSync(ipcTemplates25Path, "utf8"));
const ipcTemplate25Definitions = new Map([
  ["entry_two_descriptor_pairs", { size: 92, literals: ["command"] }],
  ["entry_pair_output_descriptor", { size: 92, literals: ["command"] }],
  ["entry_counted_pair_output", { size: 92, literals: ["command"] }],
  ["inline_global_four_outputs", { size: 92, literals: ["handle"], inlineCommand: "ipc_inline_command_id_22_no_params" }],
  ["entry_byte_aux_descriptor", { size: 92, literals: ["command", "auxiliary"] }],
  ["temporary_static_output", { size: 92, literals: ["command"] }],
  ["temporary_static_output_compact", { size: 88, literals: ["command"] }],
  ["entry_nine_words_descriptor", { size: 88, literals: ["command"] }],
]);
const ipcTemplates25 = new Map();
let configuredIpcTemplate25Bytes = 0;
let configuredIpcTemplate25Slots = 0;
for (const entry of ipcTemplates25Config.functions ?? []) {
  const definition = ipcTemplate25Definitions.get(entry?.template);
  if (!definition || entry.mode !== "arm" || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      (definition.inlineCommand === undefined ? entry.inlineCommand !== undefined : entry.inlineCommand !== definition.inlineCommand) ||
      ipcTemplates25.has(entry.name)) {
    throw new Error("Invalid IPC template 25 mapping entry");
  }
  ipcTemplates25.set(entry.name, entry);
  configuredIpcTemplate25Bytes += entry.size;
  configuredIpcTemplate25Slots += definition.literals.length;
}
if (ipcTemplates25.size !== 8 || configuredIpcTemplate25Bytes !== 728 || configuredIpcTemplate25Slots !== 9) throw new Error("Unexpected IPC template 25 totals");

const ipcTemplates26Config = JSON.parse(readFileSync(ipcTemplates26Path, "utf8"));
const ipcTemplate26Definitions = new Map([
  ["inline_entry_no_params", { size: 40, literals: [] }],
  ["inline_global_no_params", { size: 44, literals: ["handle"] }],
]);
const ipcTemplate26Expected = new Map([
  ["func_00125E28", ["inline_entry_no_params", "ipc_inline_command_id_23_no_params"]],
  ["func_001644DC", ["inline_entry_no_params", "ipc_inline_command_id_57_no_params"]],
  ["func_00174748", ["inline_entry_no_params", "ipc_inline_command_id_25_no_params"]],
  ["func_0017A618", ["inline_entry_no_params", "ipc_inline_command_id_12_no_params"]],
  ["func_0017A640", ["inline_entry_no_params", "ipc_inline_command_id_20_no_params"]],
  ["func_002C5640", ["inline_entry_no_params", "ipc_inline_command_id_8_no_params"]],
  ["func_002C5744", ["inline_entry_no_params", "ipc_inline_command_id_10_no_params"]],
  ["func_001FB3DC", ["inline_global_no_params", "ipc_inline_command_id_9_no_params", "ipc_handle_slot_epsilon"]],
  ["func_001FB550", ["inline_global_no_params", "ipc_inline_command_id_3_no_params", "ipc_handle_slot_epsilon"]],
  ["func_00202894", ["inline_global_no_params", "ipc_inline_command_id_17_no_params", "ipc_handle_slot_mu"]],
  ["func_002028C4", ["inline_global_no_params", "ipc_inline_command_id_18_no_params", "ipc_handle_slot_mu"]],
  ["func_00202D78", ["inline_global_no_params", "ipc_inline_command_id_5_no_params", "ipc_handle_slot_zeta"]],
  ["func_002C6348", ["inline_global_no_params", "ipc_inline_command_id_44_no_params", "ipc_handle_slot_gamma"]],
  ["func_002C63B4", ["inline_global_no_params", "ipc_inline_command_id_39_no_params", "ipc_handle_slot_gamma"]],
  ["func_002C6420", ["inline_global_no_params", "ipc_inline_command_id_38_no_params", "ipc_handle_slot_gamma"]],
  ["func_002DE8C0", ["inline_global_no_params", "ipc_inline_command_id_58_no_params", "ipc_handle_slot_beta"]],
  ["func_002DE9C8", ["inline_global_no_params", "ipc_inline_command_id_57_no_params", "ipc_handle_slot_beta"]],
]);
const ipcTemplates26 = new Map();
let configuredIpcTemplate26Bytes = 0;
let configuredIpcTemplate26Slots = 0;
for (const entry of ipcTemplates26Config.functions ?? []) {
  const definition = ipcTemplate26Definitions.get(entry?.template);
  const wanted = ipcTemplate26Expected.get(entry?.name);
  if (!definition || !wanted || entry.mode !== "arm" || entry.size !== definition.size ||
      entry.template !== wanted[0] || entry.inlineCommand !== wanted[1] ||
      definition.literals.some((key, index) => entry[key] !== wanted[index + 2]) || ipcTemplates26.has(entry.name)) {
    throw new Error("Invalid IPC template 26 mapping entry");
  }
  ipcTemplates26.set(entry.name, entry);
  configuredIpcTemplate26Bytes += entry.size;
  configuredIpcTemplate26Slots += definition.literals.length;
}
if (ipcTemplates26.size !== 17 || configuredIpcTemplate26Bytes !== 720 || configuredIpcTemplate26Slots !== 10) throw new Error("Unexpected IPC template 26 totals");

const ipcTemplates27Config = JSON.parse(readFileSync(ipcTemplates27Path, "utf8"));
const ipcTemplate27Definitions = new Map([
  ["inline_global_word3", { size: 56, literals: ["handle"] }],
  ["inline_global_byte2", { size: 56, literals: ["handle"] }],
  ["inline_global_word2", { size: 56, literals: ["handle"] }],
  ["literal_entry_word3", { size: 52, literals: ["command"] }],
  ["literal_entry_words2_3", { size: 52, literals: ["command"] }],
  ["inline_entry_byte2", { size: 52, literals: [] }],
  ["inline_entry_halfword2", { size: 52, literals: [] }],
  ["inline_entry_word2", { size: 52, literals: [] }],
]);
const ipcTemplates27 = new Map();
let configuredIpcTemplate27Bytes = 0;
let configuredIpcTemplate27Slots = 0;
for (const entry of ipcTemplates27Config.functions ?? []) {
  const definition = ipcTemplate27Definitions.get(entry?.template);
  const inline = entry?.template?.startsWith("inline_");
  if (!definition || entry.size !== definition.size ||
      definition.literals.some((key) => typeof entry[key] !== "string") ||
      (inline ? !/^ipc_inline_command_id_\d+_no_params$/.test(entry.inlineCommand) : entry.inlineCommand !== undefined) ||
      ipcTemplates27.has(entry.name)) {
    throw new Error("Invalid IPC template 27 mapping entry");
  }
  ipcTemplates27.set(entry.name, entry);
  configuredIpcTemplate27Bytes += entry.size;
  configuredIpcTemplate27Slots += definition.literals.length;
}
if (ipcTemplates27Config.schemaVersion !== 1 || ipcTemplates27Config.mode !== "arm" ||
    ipcTemplates27.size !== 22 || configuredIpcTemplate27Bytes !== 1208 || configuredIpcTemplate27Slots !== 18) {
  throw new Error("Unexpected IPC template 27 totals");
}

const ipcTemplates28Config = JSON.parse(readFileSync(ipcTemplates28Path, "utf8"));
const ipcTemplate28Expected = new Map([
  ["func_00118300", [48, "ipc_command_func_00118300"]],
  ["func_001190E0", [52, "ipc_command_func_001190E0", "ipc_handle_slot_xi"]],
  ["func_00125E50", [52, "ipc_command_func_00126808"]],
  ["func_00126600", [48, "ipc_command_func_00126600", "ipc_handle_slot_alpha"]],
  ["func_001266FC", [60, "ipc_command_func_001266FC", "ipc_handle_slot_alpha"]],
  ["func_001338B8", [52, "ipc_command_func_001338B8"]],
  ["func_00145FC0", [60, "ipc_handle_slot_nu"]],
  ["func_00160844", [56, "ipc_command_func_00160844"]],
  ["func_001709BC", [56, "ipc_command_func_001709BC"]],
  ["func_00170C80", [56, "ipc_command_func_00170C80", "ipc_handle_slot_xi"]],
  ["func_001F6F04", [56, "ipc_command_func_001F6F04"]],
  ["func_001F72F4", [56, "ipc_command_func_001F72F4"]],
  ["func_001F7330", [56, "ipc_command_func_001F7330"]],
  ["func_00202DFC", [60, "ipc_command_func_00202DFC", "ipc_handle_slot_zeta"]],
  ["func_00202EC0", [60, "ipc_handle_slot_zeta"]],
  ["func_00203128", [60, "ipc_command_func_00202DFC", "ipc_handle_slot_xi"]],
  ["func_0020316C", [48, "ipc_handle_slot_xi"]],
  ["func_002C35DC", [48, "ipc_command_func_0010986C"]],
  ["func_002C55B4", [52, "ipc_command_func_002C6104"]],
  ["func_002C581C", [64, "ipc_command_func_002C581C"]],
  ["func_002C596C", [60, "ipc_command_func_002C596C"]],
  ["func_002CCFD0", [64, "ipc_command_func_002C8E54"]],
  ["func_002DD9FC", [60, "ipc_command_func_002DD9FC", "ipc_handle_slot_alpha"]],
  ["func_002E419C", [64, "ipc_command_func_002E419C"]],
  ["func_002E43E0", [64, "ipc_command_func_002C90EC"]],
  ["func_002E68D4", [60, "ipc_command_func_002E68D4", "ipc_handle_slot_lambda"]],
  ["func_002E6B0C", [60, "ipc_command_func_002E6B0C", "ipc_handle_slot_lambda"]],
]);
const ipcTemplates28 = new Map();
let configuredIpcTemplate28Bytes = 0;
let configuredIpcTemplate28Slots = 0;
for (const entry of ipcTemplates28Config.functions ?? []) {
  const wanted = ipcTemplate28Expected.get(entry?.name);
  const identities = [entry?.command, entry?.handle].filter((value) => typeof value === "string");
  if (!wanted || entry.size !== wanted[0] || JSON.stringify(identities) !== JSON.stringify(wanted.slice(1)) ||
      ipcTemplates28.has(entry.name)) throw new Error("Invalid IPC template 28 mapping entry");
  ipcTemplates28.set(entry.name, entry);
  configuredIpcTemplate28Bytes += entry.size;
  configuredIpcTemplate28Slots += identities.length;
}
if (ipcTemplates28Config.schemaVersion !== 1 || ipcTemplates28Config.mode !== "arm" ||
    ipcTemplates28.size !== 27 || configuredIpcTemplate28Bytes !== 1532 || configuredIpcTemplate28Slots !== 36) {
  throw new Error("Unexpected IPC template 28 totals");
}

const ipcTemplates29Config = JSON.parse(readFileSync(ipcTemplates29Path, "utf8"));
const ipcTemplate29Expected = new Map([
  ["func_00110264", [72, "ipc_command_func_00110264", "ipc_handle_slot_alpha"]],
  ["func_001102B4", [84, "ipc_command_func_002C6378", "ipc_handle_slot_alpha"]],
  ["func_00110374", [68, "ipc_command_func_00110374", "ipc_handle_slot_alpha"]],
  ["func_00118594", [60, "ipc_command_func_00118594", "ipc_handle_slot_kappa"]],
  ["func_0011BA30", [72, "ipc_aux_func_0011BA30_tls_descriptor", "ipc_handle_slot_lambda"]],
  ["func_00124838", [64, "ipc_command_func_002C63E4", "ipc_handle_slot_nu"]],
  ["func_00124880", [72, "ipc_command_func_001338B8", "ipc_handle_slot_nu"]],
  ["func_00124FE0", [56]],
  ["func_00125584", [68, "ipc_command_func_002C8F10", "ipc_handle_slot_omicron"]],
  ["func_001266B4", [68, "ipc_handle_slot_alpha"]],
  ["func_00133918", [64, "ipc_command_func_00133918"]],
  ["func_00133C10", [80, "ipc_command_func_00133C10", "ipc_handle_slot_alpha"]],
  ["func_00133CBC", [84, "ipc_command_func_00133CBC", "ipc_handle_slot_alpha"]],
  ["func_001342C8", [68, "ipc_handle_slot_lambda"]],
  ["func_0015F308", [64, "ipc_command_func_0015F308", "ipc_handle_slot_iota"]],
  ["func_0016FF3C", [68, "ipc_command_func_0016FF3C", "ipc_handle_slot_iota"]],
  ["func_00174400", [80]],
  ["func_00174450", [76, "ipc_command_func_00174450"]],
  ["func_001F1474", [76, "ipc_command_func_001F1474", "ipc_aux_func_001F1474_static_descriptor", "ipc_handle_slot_iota"]],
  ["func_001F14CC", [84, "ipc_command_func_001F14CC", "ipc_aux_func_001F16F8_static_descriptor", "ipc_handle_slot_iota"]],
  ["func_001F15DC", [68, "ipc_command_func_001F15DC", "ipc_aux_func_001F1474_static_descriptor", "ipc_handle_slot_iota"]],
  ["func_001F709C", [84, "ipc_command_func_001F709C"]],
  ["func_001F7164", [80, "ipc_command_func_001F7164"]],
  ["func_001F7298", [88, "ipc_command_func_001F7298"]],
]);
const ipcTemplates29 = new Map();
let configuredIpcTemplate29Bytes = 0;
let configuredIpcTemplate29Slots = 0;
for (const entry of ipcTemplates29Config.functions ?? []) {
  const wanted = ipcTemplate29Expected.get(entry?.name);
  const identities = [entry?.command, entry?.auxiliary, entry?.staticDescriptor, entry?.handle]
    .filter((value) => typeof value === "string");
  if (!wanted || entry.size !== wanted[0] || JSON.stringify(identities) !== JSON.stringify(wanted.slice(1)) ||
      ipcTemplates29.has(entry.name)) throw new Error("Invalid IPC template 29 mapping entry");
  ipcTemplates29.set(entry.name, entry);
  configuredIpcTemplate29Bytes += entry.size;
  configuredIpcTemplate29Slots += identities.length;
}
if (ipcTemplates29Config.schemaVersion !== 1 || ipcTemplates29Config.mode !== "arm" ||
    ipcTemplates29.size !== 24 || configuredIpcTemplate29Bytes !== 1748 || configuredIpcTemplate29Slots !== 40) {
  throw new Error("Unexpected IPC template 29 totals");
}

const ipcTemplates30Config = JSON.parse(readFileSync(ipcTemplates30Path, "utf8"));
const ipcTemplate30Expected = new Map([
  ["func_001F736C", [76, "ipc_command_func_001F736C"]],
  ["func_001F74B0", [84, "ipc_command_func_001F74B0"]],
  ["func_001F75B4", [72, "ipc_command_func_001F75B4"]],
  ["func_001F7668", [84, "ipc_command_func_001F7668"]],
  ["func_001F774C", [72, "ipc_command_func_001F774C"]],
  ["func_001F7868", [80, "ipc_command_func_001F7868"]],
  ["func_001FB478", [76, "ipc_command_func_001FB478", "ipc_handle_slot_epsilon"]],
  ["func_001FB5B8", [80, "ipc_command_func_001FB5B8", "ipc_handle_slot_epsilon"]],
  ["func_001FB6AC", [68, "ipc_command_func_002C576C", "ipc_handle_slot_epsilon"]],
  ["func_001FF934", [72, "ipc_command_func_00132E48", "ipc_handle_slot_eta"]],
  ["func_00202DA8", [76, "ipc_command_func_00202DA8", "ipc_handle_slot_zeta"]],
  ["func_002C55EC", [76, "ipc_command_func_002C55EC", "ipc_aux_func_002C59AC_word1"]],
  ["func_002C57CC", [76, "ipc_command_func_002C6624"]],
  ["func_002C5860", [80]],
  ["func_002C5924", [68, "ipc_command_func_002DE78C"]],
  ["func_002C5A54", [72, "ipc_command_func_002C5A54"]],
  ["func_002C5B14", [68, "ipc_command_func_00126A20"]],
  ["func_002C94A8", [88, "ipc_command_func_002C94A8"]],
  ["func_002CCCA4", [84, "ipc_command_func_00118594"]],
  ["func_002DE588", [76, "ipc_command_func_00126740", "ipc_handle_slot_beta"]],
  ["func_002DEA80", [76, "ipc_command_func_002DEA80", "ipc_handle_slot_beta"]],
  ["func_002DEAD4", [80, "ipc_command_func_002DEAD4", "ipc_handle_slot_beta"]],
  ["func_002DEDB0", [68, "ipc_command_func_002C63E4", "ipc_handle_slot_beta"]],
  ["func_002E6918", [72, "ipc_aux_func_001F16F8_static_descriptor", "ipc_handle_slot_lambda"]],
  ["func_002E6968", [88, "ipc_command_func_002E6968", "ipc_aux_func_002E6968_static_descriptor", "ipc_handle_slot_lambda"]],
]);
const ipcTemplates30 = new Map();
let configuredIpcTemplate30Bytes = 0;
let configuredIpcTemplate30Slots = 0;
for (const entry of ipcTemplates30Config.functions ?? []) {
  const wanted = ipcTemplate30Expected.get(entry?.name);
  const identities = [entry?.command, entry?.auxiliary, entry?.staticDescriptor, entry?.handle]
    .filter((value) => typeof value === "string");
  if (!wanted || entry.size !== wanted[0] || JSON.stringify(identities) !== JSON.stringify(wanted.slice(1)) ||
      ipcTemplates30.has(entry.name)) throw new Error("Invalid IPC template 30 mapping entry");
  ipcTemplates30.set(entry.name, entry);
  configuredIpcTemplate30Bytes += entry.size;
  configuredIpcTemplate30Slots += identities.length;
}
if (ipcTemplates30Config.schemaVersion !== 1 || ipcTemplates30Config.mode !== "arm" ||
    ipcTemplates30.size !== 25 || configuredIpcTemplate30Bytes !== 1912 || configuredIpcTemplate30Slots !== 37) {
  throw new Error("Unexpected IPC template 30 totals");
}

const ipcTemplates31Config = JSON.parse(readFileSync(ipcTemplates31Path, "utf8"));
const ipcTemplate31BranchIdentityContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries: [
    "service_shutdown_prepare_31", "service_shutdown_secondary_31",
    "service_shutdown_finish_31", "func_002C6104", "func_002C6254",
    "func_002C62B0", "func_002C62EC", "service_startup_31",
    "runtime_failure_raise_entry_31", "service_request_size_31", "func_002C6450",
    "func_002C6378", "func_002C63B4", "func_002C63E4", "func_002C6420",
    "func_002C6480", "func_002C64BC", "func_002C64F8", "func_002C6534",
    "func_002C65E8", "func_002C6624",
  ],
  secondaryEntries: ["service_open_31"],
  sharedClasses: [{ symbol: "runtime_failure_raise_entry_31", siteCount: 17 }],
  singletonClasses: [
    "service_shutdown_prepare_31", "service_shutdown_secondary_31",
    "service_shutdown_finish_31", "func_002C6104", "func_002C6254",
    "func_002C62B0", "func_002C62EC", "service_startup_31",
    "service_request_size_31", "service_open_31", "func_002C6450",
    "func_002C6378", "func_002C63B4", "func_002C63E4", "func_002C6420",
    "func_002C6480", "func_002C64BC", "func_002C64F8", "func_002C6534",
    "func_002C65E8", "func_002C6624",
  ],
  classesPairwiseDistinct: true,
};
const ipcTemplate31Expected = new Map([
  ["func_002C5C4C", [36, 3, 1]], ["func_002C5C74", [28, 2, 0]],
  ["func_002C5D80", [56, 2, 1]], ["func_002C5DBC", [28, 2, 0]],
  ["func_002C5DD8", [56, 2, 1]], ["func_002C5E14", [160, 7, 2]],
  ["func_002C5EBC", [28, 2, 0]], ["func_002C5ED8", [28, 2, 0]],
  ["func_002C5EF4", [28, 2, 0]], ["func_002C5F10", [36, 2, 1]],
  ["func_002C5F38", [28, 2, 0]], ["func_002C5F54", [28, 2, 0]],
  ["func_002C5F70", [28, 2, 0]], ["func_002C601C", [64, 2, 0]],
  ["func_002C60CC", [28, 2, 0]], ["func_002C60E8", [28, 2, 0]],
]);
const ipcTemplates31 = new Map();
let configuredIpcTemplate31Bytes = 0;
let configuredIpcTemplate31Branches = 0;
let configuredIpcTemplate31Slots = 0;
for (const entry of ipcTemplates31Config.functions ?? []) {
  const wanted = ipcTemplate31Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== wanted[2] || ipcTemplates31.has(entry.name)) {
    throw new Error("Invalid IPC template 31 mapping entry");
  }
  ipcTemplates31.set(entry.name, entry);
  configuredIpcTemplate31Bytes += entry.size;
  configuredIpcTemplate31Branches += entry.branches.length;
  configuredIpcTemplate31Slots += entry.literals.length;
}
if (ipcTemplates31Config.schemaVersion !== 1 || ipcTemplates31Config.mode !== "arm" ||
    ipcTemplates31Config.sharedBranchIdentity !== "runtime_failure_raise_entry_31" ||
    JSON.stringify(ipcTemplates31Config.branchIdentityContract) !==
      JSON.stringify(ipcTemplate31BranchIdentityContract) ||
    ipcTemplates31Config.cumulativePoolSlots !== 474 || ipcTemplates31Config.cumulativePoolClasses !== 237 ||
    ipcTemplates31.size !== 16 || configuredIpcTemplate31Bytes !== 688 ||
    configuredIpcTemplate31Branches !== 38 || configuredIpcTemplate31Slots !== 6) {
  throw new Error("Unexpected IPC template 31 totals");
}

const ipcTemplates32Config = JSON.parse(readFileSync(ipcTemplates32Path, "utf8"));
const ipcTemplate32Singletons = [
  "func_001FFCB8", "func_001FF5F0", "func_001FFD74", "func_001FF6AC",
  "func_001FFDE4", "func_001FF71C", "func_001FFE54", "func_001FF78C",
  "func_001FFEAC", "func_001FF7E4", "func_001FFF40", "func_001FF878",
  "func_0020004C", "func_001FF984", "func_0020010C", "func_001FFA44",
  "func_00200154", "func_001FFA8C", "func_002001B0", "func_001FFAE8",
  "func_002001F8", "func_001FFB30",
];
const ipcTemplate32Expected = new Map([
  ["func_001FF27C", 92], ["func_001FF320", 92], ["func_001FF388", 92],
  ["func_001FF3F0", 64], ["func_001FF460", 104], ["func_001FF54C", 92],
  ["func_001FFBC8", 48], ["func_001FFC7C", 48], ["func_00200254", 64],
  ["func_002002A0", 48], ["func_002002DC", 64],
]);
const ipcTemplates32 = new Map();
let configuredIpcTemplate32Bytes = 0;
for (const entry of ipcTemplates32Config.functions ?? []) {
  const wantedSize = ipcTemplate32Expected.get(entry?.name);
  if (entry.size !== wantedSize || entry.branches?.length !== 2 || entry.literals?.length !== 3 ||
      ipcTemplates32.has(entry.name)) throw new Error("Invalid IPC template 32 mapping entry");
  ipcTemplates32.set(entry.name, entry);
  configuredIpcTemplate32Bytes += entry.size;
}
if (ipcTemplates32Config.schemaVersion !== 1 || ipcTemplates32Config.mode !== "arm" ||
    ipcTemplates32Config.cumulativePoolSlots !== 507 ||
    ipcTemplates32Config.cumulativePoolClasses !== 238 || ipcTemplates32.size !== 11 ||
    configuredIpcTemplate32Bytes !== 808 ||
    JSON.stringify(ipcTemplates32Config.literalIdentities) !== JSON.stringify([
      "ipc_handle_slot_theta", "ipc_handle_slot_eta", "ipc_unavailable_status_32",
    ]) || JSON.stringify(ipcTemplates32Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, singletonClasses: ipcTemplate32Singletons,
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 32 totals or identity contract");
}

const ipcTemplates33Config = JSON.parse(readFileSync(ipcTemplates33Path, "utf8"));
const ipcTemplate33PrimaryEntries = [
  "func_00124880", "func_00124FB0", "func_001602B8", "func_00160380", "func_001F4A1C",
];
const ipcTemplate33Expected = new Map([
  ["func_002009A4", [68, 2, 2]], ["func_002009F0", [56, 2, 0]],
  ["func_00200A28", [116, 6, 3]], ["func_00200ABC", [56, 2, 0]],
  ["func_00200B2C", [60, 2, 0]], ["func_00200B68", [56, 2, 0]],
  ["func_00200BA0", [56, 2, 0]], ["func_00200BD8", [56, 2, 0]],
]);
const ipcTemplates33 = new Map();
let configuredIpcTemplate33Bytes = 0;
let configuredIpcTemplate33Branches = 0;
let configuredIpcTemplate33Slots = 0;
for (const entry of ipcTemplates33Config.functions ?? []) {
  const wanted = ipcTemplate33Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== wanted[2] || ipcTemplates33.has(entry.name)) {
    throw new Error("Invalid IPC template 33 mapping entry");
  }
  ipcTemplates33.set(entry.name, entry);
  configuredIpcTemplate33Bytes += entry.size;
  configuredIpcTemplate33Branches += entry.branches.length;
  configuredIpcTemplate33Slots += entry.literals.length;
}
if (ipcTemplates33Config.schemaVersion !== 1 || ipcTemplates33Config.mode !== "arm" ||
    ipcTemplates33Config.cumulativePoolSlots !== 512 ||
    ipcTemplates33Config.cumulativePoolClasses !== 243 || ipcTemplates33.size !== 8 ||
    configuredIpcTemplate33Bytes !== 524 || configuredIpcTemplate33Branches !== 20 ||
    configuredIpcTemplate33Slots !== 5 ||
    JSON.stringify(ipcTemplates33Config.literalIdentities) !== JSON.stringify([
      "service_seed_halfword_33", "service_request_kind_33", "service_lock_object_33",
      "service_operation_object_33", "service_result_object_33",
    ]) || JSON.stringify(ipcTemplates33Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate33PrimaryEntries,
      sharedClasses: [
        { symbol: "func_00124880", siteCount: 8 },
        { symbol: "func_00124FB0", siteCount: 8 },
        { symbol: "func_00160380", siteCount: 2 },
      ],
      singletonClasses: ["func_001602B8", "func_001F4A1C"],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 33 totals or identity contract");
}

const ipcTemplates34Config = JSON.parse(readFileSync(ipcTemplates34Path, "utf8"));
const ipcTemplate34UninventoriedPrimaryEntry = "service_publish_operation_34";
const ipcTemplate34PrimaryEntries = [
  "func_00124880", "func_00124FB0", "func_00118C2C", ipcTemplate34UninventoriedPrimaryEntry,
  "func_00145FC0",
];
const ipcTemplate34Expected = new Map([
  ["func_00109738", [40, 2, 0]], ["func_0010EFD8", [52, 2, 2]],
  ["func_0010F014", [116, 5, 1]], ["func_0010F158", [40, 2, 1]],
  ["func_0010F184", [108, 5, 1]], ["func_0011863C", [68, 2, 1]],
  ["func_0012439C", [152, 6, 1]],
]);
const ipcTemplates34 = new Map();
let configuredIpcTemplate34Bytes = 0;
let configuredIpcTemplate34Branches = 0;
let configuredIpcTemplate34Slots = 0;
for (const entry of ipcTemplates34Config.functions ?? []) {
  const wanted = ipcTemplate34Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== wanted[2] || ipcTemplates34.has(entry.name)) {
    throw new Error("Invalid IPC template 34 mapping entry");
  }
  ipcTemplates34.set(entry.name, entry);
  configuredIpcTemplate34Bytes += entry.size;
  configuredIpcTemplate34Branches += entry.branches.length;
  configuredIpcTemplate34Slots += entry.literals.length;
}
if (ipcTemplates34Config.schemaVersion !== 1 || ipcTemplates34Config.mode !== "arm" ||
    ipcTemplates34Config.cumulativePoolSlots !== 519 ||
    ipcTemplates34Config.cumulativePoolClasses !== 249 || ipcTemplates34.size !== 7 ||
    configuredIpcTemplate34Bytes !== 576 || configuredIpcTemplate34Branches !== 24 ||
    configuredIpcTemplate34Slots !== 7 ||
    JSON.stringify(ipcTemplates34Config.literalIdentities) !== JSON.stringify([
      "service_seed_byte_34", "service_request_kind_alpha_34", "service_guard_state_34",
      "service_request_kind_beta_34", "service_request_kind_gamma_34", "service_request_kind_delta_34",
    ]) || JSON.stringify(ipcTemplates34Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate34PrimaryEntries,
      sharedClasses: [
        { symbol: "func_00124880", siteCount: 8 },
        { symbol: "func_00124FB0", siteCount: 11 },
        { symbol: "func_00118C2C", siteCount: 2 },
        { symbol: "service_publish_operation_34", siteCount: 2 },
      ],
      singletonClasses: ["func_00145FC0"],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 34 totals or identity contract");
}

const ipcTemplates35Config = JSON.parse(readFileSync(ipcTemplates35Path, "utf8"));
const ipcTemplate35PrimaryEntries = [
  "func_001240C4", "func_001182D0", "func_00118C94", "func_0012408C",
  "func_00125584", "func_00146000", "func_001260B4", "func_001266B4",
  "func_00126414", "func_00126000", "func_001266FC", "func_00124BA4",
  "func_00145FC0", "func_00124FB0", "func_00125E50", "func_00133ECC",
  "func_00124838", "func_002028C4", "func_002030EC", "func_002C6660",
];
const ipcTemplate35Expected = new Map([
  ["func_0010EC28", [32, 2, 0]], ["func_0010F1F4", [32, 1, 0]],
  ["func_00118294", [36, 1, 2]], ["func_00118578", [28, 2, 0]],
  ["func_0011B11C", [44, 3, 0]], ["func_0011B818", [44, 5, 0]],
  ["func_0012437C", [32, 2, 0]], ["func_00125DC0", [36, 1, 2]],
  ["func_001265DC", [36, 5, 0]], ["func_00178238", [40, 2, 0]],
  ["func_0020282C", [20, 1, 0]], ["func_00203050", [40, 1, 0]],
  ["func_002C669C", [28, 2, 0]],
]);
const ipcTemplates35 = new Map();
let configuredIpcTemplate35Bytes = 0;
let configuredIpcTemplate35Branches = 0;
let configuredIpcTemplate35Slots = 0;
for (const entry of ipcTemplates35Config.functions ?? []) {
  const wanted = ipcTemplate35Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== wanted[2] || ipcTemplates35.has(entry.name)) {
    throw new Error("Invalid IPC template 35 mapping entry");
  }
  ipcTemplates35.set(entry.name, entry);
  configuredIpcTemplate35Bytes += entry.size;
  configuredIpcTemplate35Branches += entry.branches.length;
  configuredIpcTemplate35Slots += entry.literals.length;
}
if (ipcTemplates35Config.schemaVersion !== 1 || ipcTemplates35Config.mode !== "arm" ||
    ipcTemplates35Config.cumulativePoolSlots !== 523 ||
    ipcTemplates35Config.cumulativePoolClasses !== 253 || ipcTemplates35.size !== 13 ||
    configuredIpcTemplate35Bytes !== 448 || configuredIpcTemplate35Branches !== 28 ||
    configuredIpcTemplate35Slots !== 4 ||
    JSON.stringify(ipcTemplates35Config.literalIdentities) !== JSON.stringify([
      "service_state_slot_35", "service_request_kind_35",
      "service_initialized_byte_35", "service_session_object_35",
    ]) || JSON.stringify(ipcTemplates35Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate35PrimaryEntries,
      sharedClasses: [
        { symbol: "func_001260B4", siteCount: 3 },
        { symbol: "func_00126414", siteCount: 3 },
        { symbol: "func_00126000", siteCount: 2 },
        { symbol: "func_00124BA4", siteCount: 2 },
        { symbol: "func_00124FB0", siteCount: 2 },
        { symbol: "func_00146000", siteCount: 2 },
      ],
      singletonClasses: [
        "func_001240C4", "func_001182D0", "func_00118C94", "func_0012408C",
        "func_00125584", "func_001266B4", "func_001266FC", "func_00145FC0",
        "func_00125E50", "func_00133ECC", "func_00124838", "func_002028C4",
        "func_002030EC", "func_002C6660",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 35 totals or identity contract");
}

const ipcTemplates36Config = JSON.parse(readFileSync(ipcTemplates36Path, "utf8"));
const ipcTemplate36PrimaryEntries = [
  "func_001260B4", "func_001103C0", "func_00126414", "func_001182C0",
  "func_00118300", "func_00146000", "func_001240C4", "func_00160078",
  "func_00164F74", "func_00164EE4", "func_0016516C", "func_001F70F4",
  "func_00124FB0", "func_001F712C",
];
const ipcTemplate36Expected = new Map([
  ["func_00109C40", [36, 3]], ["func_0010EC48", [52, 3]],
  ["func_001456E4", [32, 2]], ["func_001487E8", [52, 2]],
  ["func_00148E3C", [44, 3]], ["func_001F4204", [52, 3]],
  ["func_001F4238", [56, 3]],
]);
const ipcTemplates36 = new Map();
let configuredIpcTemplate36Bytes = 0;
let configuredIpcTemplate36Branches = 0;
for (const entry of ipcTemplates36Config.functions ?? []) {
  const wanted = ipcTemplate36Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== 0 || ipcTemplates36.has(entry.name)) {
    throw new Error("Invalid IPC template 36 mapping entry");
  }
  ipcTemplates36.set(entry.name, entry);
  configuredIpcTemplate36Bytes += entry.size;
  configuredIpcTemplate36Branches += entry.branches.length;
}
if (ipcTemplates36Config.schemaVersion !== 1 || ipcTemplates36Config.mode !== "arm" ||
    ipcTemplates36Config.cumulativePoolSlots !== 523 ||
    ipcTemplates36Config.cumulativePoolClasses !== 253 || ipcTemplates36.size !== 7 ||
    configuredIpcTemplate36Bytes !== 324 || configuredIpcTemplate36Branches !== 19 ||
    JSON.stringify(ipcTemplates36Config.literalIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates36Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate36PrimaryEntries,
      sharedClasses: [
        { symbol: "func_001240C4", siteCount: 3 },
        { symbol: "func_001260B4", siteCount: 2 },
        { symbol: "func_00126414", siteCount: 2 },
        { symbol: "func_00124FB0", siteCount: 2 },
      ],
      singletonClasses: [
        "func_001103C0", "func_001182C0", "func_00118300", "func_00146000",
        "func_00160078", "func_00164F74", "func_00164EE4", "func_0016516C",
        "func_001F70F4", "func_001F712C",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 36 totals or identity contract");
}

const ipcTemplates37Config = JSON.parse(readFileSync(ipcTemplates37Path, "utf8"));
const ipcTemplate37PrimaryEntries = [
  "func_001260B4", "func_00133CBC", "func_00124BA4", "func_00126414",
  "func_00118AE4", "func_00124FB0", "func_001240C4", "func_001F73F4",
  "func_001FB610", "func_001FB670", "func_001F4188", "func_001F48EC",
];
const ipcTemplate37Expected = new Map([
  ["func_001260E8", [84, 4]], ["func_00170868", [40, 2]],
  ["func_001F48EC", [92, 2]], ["func_001FAF1C", [116, 2]],
  ["func_001FAF90", [72, 2]], ["func_0036C428", [60, 2]],
  ["func_004E61F4", [92, 2]],
]);
const ipcTemplates37 = new Map();
let configuredIpcTemplate37Bytes = 0;
let configuredIpcTemplate37Branches = 0;
for (const entry of ipcTemplates37Config.functions ?? []) {
  const wanted = ipcTemplate37Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== 0 || ipcTemplates37.has(entry.name)) {
    throw new Error("Invalid IPC template 37 mapping entry");
  }
  ipcTemplates37.set(entry.name, entry);
  configuredIpcTemplate37Bytes += entry.size;
  configuredIpcTemplate37Branches += entry.branches.length;
}
if (ipcTemplates37Config.schemaVersion !== 1 || ipcTemplates37Config.mode !== "arm" ||
    ipcTemplates37Config.cumulativePoolSlots !== 523 ||
    ipcTemplates37Config.cumulativePoolClasses !== 253 || ipcTemplates37.size !== 7 ||
    configuredIpcTemplate37Bytes !== 556 || configuredIpcTemplate37Branches !== 16 ||
    JSON.stringify(ipcTemplates37Config.literalIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates37Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate37PrimaryEntries,
      sharedClasses: [{ symbol: "func_00124FB0", siteCount: 5 }],
      singletonClasses: [
        "func_001260B4", "func_00133CBC", "func_00124BA4", "func_00126414",
        "func_00118AE4", "func_001240C4", "func_001F73F4", "func_001FB610",
        "func_001FB670", "func_001F4188", "func_001F48EC",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 37 totals or identity contract");
}

const ipcTemplates38Config = JSON.parse(readFileSync(ipcTemplates38Path, "utf8"));
const ipcTemplate38PrimaryEntries = ["func_001603A0"];
const ipcTemplate38Expected = new Map([
  ["func_0010E86C", [48, 0]], ["func_001E70E0", [52, 0]],
  ["func_001FBDEC", [52, 0]], ["func_002BDCA4", [28, 0]],
  ["func_002C2B9C", [20, 0]], ["func_003BAF34", [32, 1]],
  ["func_003BAFD4", [40, 1]], ["func_003BAFFC", [32, 1]],
  ["func_003BCEB0", [24, 0]],
]);
const ipcTemplates38 = new Map();
let configuredIpcTemplate38Bytes = 0;
let configuredIpcTemplate38Branches = 0;
for (const entry of ipcTemplates38Config.functions ?? []) {
  const wanted = ipcTemplate38Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== 0 || ipcTemplates38.has(entry.name)) {
    throw new Error("Invalid IPC template 38 mapping entry");
  }
  ipcTemplates38.set(entry.name, entry);
  configuredIpcTemplate38Bytes += entry.size;
  configuredIpcTemplate38Branches += entry.branches.length;
}
if (ipcTemplates38Config.schemaVersion !== 1 || ipcTemplates38Config.mode !== "arm" ||
    ipcTemplates38Config.cumulativePoolSlots !== 523 ||
    ipcTemplates38Config.cumulativePoolClasses !== 253 || ipcTemplates38.size !== 9 ||
    configuredIpcTemplate38Bytes !== 328 || configuredIpcTemplate38Branches !== 3 ||
    JSON.stringify(ipcTemplates38Config.literalIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates38Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate38PrimaryEntries,
      sharedClasses: [{ symbol: "func_001603A0", siteCount: 3 }],
      singletonClasses: [], classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 38 totals or identity contract");
}

const ipcTemplates39Config = JSON.parse(readFileSync(ipcTemplates39Path, "utf8"));
const ipcTemplate39PrimaryEntries = [
  "func_001240C4", "func_001F72F4", "func_00146000", "func_001FB6AC",
  "func_00124FB0", "func_001FB6F8", "func_001FB4CC",
];
const ipcTemplate39LiteralIdentities = [
  "service_result_normalization_39", "lazy_service_cell_39",
  "service_default_word_39", "service_fallback_state_39",
  "service_filtered_status_39", "required_handle_error_39",
];
const ipcTemplate39Expected = new Map([
  ["func_001F461C", [108, 2, 1]], ["func_001F78E8", [28, 1, 1]],
  ["func_001FAFD8", [76, 2, 2]], ["func_001FB388", [80, 3, 1]],
  ["func_004A7960", [36, 1, 1]], ["func_004A79A8", [36, 1, 1]],
]);
const ipcTemplates39 = new Map();
let configuredIpcTemplate39Bytes = 0;
let configuredIpcTemplate39Branches = 0;
let configuredIpcTemplate39Slots = 0;
for (const entry of ipcTemplates39Config.functions ?? []) {
  const wanted = ipcTemplate39Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] || entry.branches?.length !== wanted[1] ||
      entry.literals?.length !== wanted[2] || ipcTemplates39.has(entry.name)) {
    throw new Error("Invalid IPC template 39 mapping entry");
  }
  ipcTemplates39.set(entry.name, entry);
  configuredIpcTemplate39Bytes += entry.size;
  configuredIpcTemplate39Branches += entry.branches.length;
  configuredIpcTemplate39Slots += entry.literals.length;
}
if (ipcTemplates39Config.schemaVersion !== 1 || ipcTemplates39Config.mode !== "arm" ||
    ipcTemplates39Config.cumulativePoolSlots !== 530 ||
    ipcTemplates39Config.cumulativePoolClasses !== 259 || ipcTemplates39.size !== 6 ||
    configuredIpcTemplate39Bytes !== 364 || configuredIpcTemplate39Branches !== 10 ||
    configuredIpcTemplate39Slots !== 7 ||
    JSON.stringify(ipcTemplates39Config.literalIdentities) !== JSON.stringify(ipcTemplate39LiteralIdentities) ||
    JSON.stringify(ipcTemplates39Config.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates39Config.newLiteralIdentities) !== JSON.stringify(ipcTemplate39LiteralIdentities) ||
    JSON.stringify(ipcTemplates39Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate39PrimaryEntries,
      sharedClasses: [{ symbol: "func_00124FB0", siteCount: 4 }],
      singletonClasses: [
        "func_001240C4", "func_001F72F4", "func_00146000", "func_001FB6AC",
        "func_001FB6F8", "func_001FB4CC",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 39 totals or identity contract");
}

const ipcTemplates40Config = JSON.parse(readFileSync(ipcTemplates40Path, "utf8"));
const ipcTemplate40PrimaryEntries = ["func_001603A0", "func_0011B11C"];
const ipcTemplate40LiteralIdentities = [
  "service_completion_code_40", "service_name_token_40",
  "service_event_state_40", "service_wait_pair_40",
];
const ipcTemplate40Expected = new Map([
  ["func_0010EE40", [44,
    [{ offset: 20, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" }],
    [{ offset: 44, symbol: "service_completion_code_40" }]]],
  ["func_0010EEEC", [72,
    [{ offset: 12, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0011B11C" }],
    [{ offset: 72, symbol: "service_name_token_40" },
      { offset: 76, symbol: "service_event_state_40" }]]],
  ["func_0013F2F0", [72,
    [{ offset: 44, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" }],
    [{ offset: 72, symbol: "service_completion_code_40" }]]],
  ["func_001781F0", [56,
    [{ offset: 40, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" }], []]],
  ["func_002BEAAC", [60,
    [{ offset: 36, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" }],
    [{ offset: 60, symbol: "service_wait_pair_40" },
      { offset: 64, symbol: "service_completion_code_40" }]]],
  ["func_003BB84C", [76,
    [{ offset: 48, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" }], []]],
]);
const ipcTemplates40 = new Map();
let configuredIpcTemplate40Bytes = 0;
let configuredIpcTemplate40Branches = 0;
let configuredIpcTemplate40Slots = 0;
for (const entry of ipcTemplates40Config.functions ?? []) {
  const wanted = ipcTemplate40Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] ||
      JSON.stringify(entry.branches) !== JSON.stringify(wanted[1]) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wanted[2]) ||
      ipcTemplates40.has(entry.name)) {
    throw new Error("Invalid IPC template 40 mapping entry");
  }
  ipcTemplates40.set(entry.name, entry);
  configuredIpcTemplate40Bytes += entry.size;
  configuredIpcTemplate40Branches += entry.branches.length;
  configuredIpcTemplate40Slots += entry.literals.length;
}
if (ipcTemplates40Config.schemaVersion !== 1 || ipcTemplates40Config.mode !== "arm" ||
    ipcTemplates40Config.cumulativePoolSlots !== 536 ||
    ipcTemplates40Config.cumulativePoolClasses !== 263 || ipcTemplates40.size !== 6 ||
    configuredIpcTemplate40Bytes !== 380 || configuredIpcTemplate40Branches !== 6 ||
    configuredIpcTemplate40Slots !== 6 ||
    JSON.stringify(ipcTemplates40Config.literalIdentities) !== JSON.stringify(ipcTemplate40LiteralIdentities) ||
    JSON.stringify(ipcTemplates40Config.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates40Config.newLiteralIdentities) !== JSON.stringify(ipcTemplate40LiteralIdentities) ||
    JSON.stringify(ipcTemplates40Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate40PrimaryEntries,
      sharedClasses: [{ symbol: "func_001603A0", siteCount: 5 }],
      singletonClasses: ["func_0011B11C"],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 40 totals or identity contract");
}

const ipcTemplates41Config = JSON.parse(readFileSync(ipcTemplates41Path, "utf8"));
const ipcTemplate41PrimaryEntries = [
  "func_00124BA4", "func_00146000", "func_001602B8", "func_001603A0",
  "func_00160380", "func_00145550", "func_00150874", "func_00174748",
  "func_0017080C",
];
const ipcTemplate41LiteralIdentities = [
  "ipc_handle_slot_alpha", "service_absent_result_41_a",
  "service_handle_replacement_41_a", "service_absent_result_41_b",
  "service_handle_replacement_41_b", "service_guard_state_41",
  "service_owned_handle_41", "service_finalize_token_41",
  "service_cleanup_vtable_41",
];
const ipcTemplate41Expected = new Map([
  ["func_0010FF44", [64,
    [{ offset: 52, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_00124BA4" }],
    [{ offset: 64, symbol: "ipc_handle_slot_alpha" },
      { offset: 68, symbol: "service_absent_result_41_a" },
      { offset: 72, symbol: "service_handle_replacement_41_a" }]]],
  ["func_00132EE8", [60,
    [{ offset: 36, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_00146000" }],
    [{ offset: 60, symbol: "service_absent_result_41_b" },
      { offset: 64, symbol: "service_handle_replacement_41_b" }]]],
  ["func_0013ADA8", [92,
    [{ offset: 16, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
      { offset: 32, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 60, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" },
      { offset: 68, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_00145550" },
      { offset: 80, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" }], []]],
  ["func_0013B0A8", [80,
    [{ offset: 8, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00150874" }], []]],
  ["func_00165A60", [68,
    [{ offset: 28, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174748" },
      { offset: 60, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017080C" }],
    [{ offset: 68, symbol: "service_guard_state_41" },
      { offset: 72, symbol: "service_owned_handle_41" },
      { offset: 76, symbol: "service_finalize_token_41" }]]],
  ["func_001FBE68", [60, [], [{ offset: 60, symbol: "service_cleanup_vtable_41" }]]],
]);
const ipcTemplates41 = new Map();
let configuredIpcTemplate41Bytes = 0;
let configuredIpcTemplate41Branches = 0;
let configuredIpcTemplate41Slots = 0;
for (const entry of ipcTemplates41Config.functions ?? []) {
  const wanted = ipcTemplate41Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] ||
      JSON.stringify(entry.branches) !== JSON.stringify(wanted[1]) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wanted[2]) ||
      ipcTemplates41.has(entry.name)) {
    throw new Error("Invalid IPC template 41 mapping entry");
  }
  ipcTemplates41.set(entry.name, entry);
  configuredIpcTemplate41Bytes += entry.size;
  configuredIpcTemplate41Branches += entry.branches.length;
  configuredIpcTemplate41Slots += entry.literals.length;
}
if (ipcTemplates41Config.schemaVersion !== 1 || ipcTemplates41Config.mode !== "arm" ||
    ipcTemplates41Config.cumulativePoolSlots !== 545 ||
    ipcTemplates41Config.cumulativePoolClasses !== 271 || ipcTemplates41.size !== 6 ||
    configuredIpcTemplate41Bytes !== 424 || configuredIpcTemplate41Branches !== 10 ||
    configuredIpcTemplate41Slots !== 9 ||
    JSON.stringify(ipcTemplates41Config.literalIdentities) !== JSON.stringify(ipcTemplate41LiteralIdentities) ||
    JSON.stringify(ipcTemplates41Config.reusedLiteralIdentities) !== JSON.stringify(["ipc_handle_slot_alpha"]) ||
    JSON.stringify(ipcTemplates41Config.newLiteralIdentities) !==
      JSON.stringify(ipcTemplate41LiteralIdentities.slice(1)) ||
    JSON.stringify(ipcTemplates41Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate41PrimaryEntries,
      sharedClasses: [{ symbol: "func_00160380", siteCount: 2 }],
      singletonClasses: [
        "func_00124BA4", "func_00146000", "func_001602B8", "func_001603A0",
        "func_00145550", "func_00150874", "func_00174748", "func_0017080C",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 41 totals or identity contract");
}

const ipcTemplates42Config = JSON.parse(readFileSync(ipcTemplates42Path, "utf8"));
const ipcTemplate42PrimaryEntries = [
  "func_00108808", "func_001603A0", "func_001103FC", "func_003BD0B8",
  "func_002CCD5C",
];
const ipcTemplate42LiteralIdentities = [
  "service_resource_state_42", "service_wait_handle_42",
  "service_cleanup_vtable_42_a", "service_cleanup_vtable_42_b",
  "service_nonpositive_result_42", "service_dispatch_state_42",
  "service_unavailable_result_42", "service_cleanup_vtable_42_c",
];
const ipcTemplate42Expected = new Map([
  ["func_0010703C", [80,
    [{ offset: 36, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00108808" }],
    [{ offset: 80, symbol: "service_resource_state_42" }]]],
  ["func_001260B4", [48,
    [{ offset: 36, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 44, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_001103FC" }],
    [{ offset: 48, symbol: "service_wait_handle_42" }]]],
  ["func_003BAF98", [56,
    [{ offset: 52, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_003BD0B8" }],
    [{ offset: 56, symbol: "service_cleanup_vtable_42_a" }]]],
  ["func_002BC658", [80, [], [{ offset: 80, symbol: "service_cleanup_vtable_42_b" }]]],
  ["func_002CC8D0", [80,
    [{ offset: 68, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002CCD5C" }],
    [{ offset: 80, symbol: "service_nonpositive_result_42" },
      { offset: 84, symbol: "service_dispatch_state_42" },
      { offset: 88, symbol: "service_unavailable_result_42" }]]],
  ["func_002CC9F8", [84,
    [{ offset: 68, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002CCD5C" }],
    [{ offset: 84, symbol: "service_cleanup_vtable_42_c" },
      { offset: 88, symbol: "service_dispatch_state_42" }]]],
]);
const ipcTemplates42 = new Map();
let configuredIpcTemplate42Bytes = 0;
let configuredIpcTemplate42Branches = 0;
let configuredIpcTemplate42Slots = 0;
for (const entry of ipcTemplates42Config.functions ?? []) {
  const wanted = ipcTemplate42Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] ||
      JSON.stringify(entry.branches) !== JSON.stringify(wanted[1]) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wanted[2]) ||
      ipcTemplates42.has(entry.name)) {
    throw new Error("Invalid IPC template 42 mapping entry");
  }
  ipcTemplates42.set(entry.name, entry);
  configuredIpcTemplate42Bytes += entry.size;
  configuredIpcTemplate42Branches += entry.branches.length;
  configuredIpcTemplate42Slots += entry.literals.length;
}
if (ipcTemplates42Config.schemaVersion !== 1 ||
    ipcTemplates42Config.source !== "src/main/arm_ipc_templates_42.S" ||
    ipcTemplates42Config.sourceSha256 !== "3dc0bbf83e9192949ca45eb61cc1c56bdc3eab28ebf68eebc0f7105129c037ce" ||
    ipcTemplates42Config.mode !== "arm" || ipcTemplates42Config.totalBodySize !== 428 ||
    ipcTemplates42Config.cumulativePoolSlots !== 554 ||
    ipcTemplates42Config.cumulativePoolClasses !== 279 || ipcTemplates42.size !== 6 ||
    configuredIpcTemplate42Bytes !== 428 || configuredIpcTemplate42Branches !== 6 ||
    configuredIpcTemplate42Slots !== 9 ||
    JSON.stringify(ipcTemplates42Config.literalIdentities) !== JSON.stringify(ipcTemplate42LiteralIdentities) ||
    JSON.stringify(ipcTemplates42Config.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates42Config.newLiteralIdentities) !== JSON.stringify(ipcTemplate42LiteralIdentities) ||
    JSON.stringify(ipcTemplates42Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate42PrimaryEntries,
      sharedClasses: [{ symbol: "func_002CCD5C", siteCount: 2 }],
      singletonClasses: [
        "func_00108808", "func_001603A0", "func_001103FC", "func_003BD0B8",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 42 totals or identity contract");
}

const ipcTemplates43Config = JSON.parse(readFileSync(ipcTemplates43Path, "utf8"));
const ipcTemplate43PrimaryEntries = [
  "func_001644DC", "func_0017080C", "func_001602B8", "func_001603A0",
  "func_00160380", "func_00174314", "func_00178228", "func_00124BA4",
];
const ipcTemplate43LiteralIdentities = [
  "service_dispatch_state_42", "service_unavailable_result_42",
  "service_lifecycle_object_43", "service_initialized_byte_35",
  "service_replacement_source_43", "service_thread_completion_counts_43",
  "ipc_handle_slot_alpha", "service_absent_result_41_a",
  "service_handle_replacement_41_a", "service_wait_handle_42",
];
const ipcTemplate43Expected = new Map([
  ["func_00148344", [88,
    [{ offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001644DC" },
      { offset: 72, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_0017080C" }],
    [{ offset: 88, symbol: "service_dispatch_state_42" },
      { offset: 92, symbol: "service_unavailable_result_42" }]]],
  ["func_0010FB40", [92,
    [{ offset: 16, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
      { offset: 72, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 80, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" }], []]],
  ["func_00164F80", [92,
    [{ offset: 12, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
      { offset: 36, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174314" },
      { offset: 76, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_00160380" },
      { offset: 88, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_00160380" }],
    [{ offset: 92, symbol: "service_lifecycle_object_43" },
      { offset: 96, symbol: "service_initialized_byte_35" },
      { offset: 100, symbol: "service_replacement_source_43" }]]],
  ["func_0017080C", [92,
    [{ offset: 64, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00178228" }], []]],
  ["func_0018C6B4", [92,
    [{ offset: 16, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
      { offset: 40, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 56, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 88, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_00160380" }],
    [{ offset: 92, symbol: "service_thread_completion_counts_43" }]]],
  ["func_00126414", [96,
    [{ offset: 48, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_00124BA4" },
      { offset: 88, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_001603A0" }],
    [{ offset: 96, symbol: "ipc_handle_slot_alpha" },
      { offset: 100, symbol: "service_absent_result_41_a" },
      { offset: 104, symbol: "service_handle_replacement_41_a" },
      { offset: 108, symbol: "service_wait_handle_42" }]]],
]);
const ipcTemplates43 = new Map();
let configuredIpcTemplate43Bytes = 0;
let configuredIpcTemplate43Branches = 0;
let configuredIpcTemplate43Slots = 0;
for (const entry of ipcTemplates43Config.functions ?? []) {
  const wanted = ipcTemplate43Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] ||
      JSON.stringify(entry.branches) !== JSON.stringify(wanted[1]) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wanted[2]) ||
      ipcTemplates43.has(entry.name)) {
    throw new Error("Invalid IPC template 43 mapping entry");
  }
  ipcTemplates43.set(entry.name, entry);
  configuredIpcTemplate43Bytes += entry.size;
  configuredIpcTemplate43Branches += entry.branches.length;
  configuredIpcTemplate43Slots += entry.literals.length;
}
if (ipcTemplates43Config.schemaVersion !== 1 ||
    ipcTemplates43Config.source !== "src/main/arm_ipc_templates_43.S" ||
    ipcTemplates43Config.sourceSha256 !== "812e8825f7eed3894cc7094c8d6c504e06459f742ae0c67760816ac4bb9f5b96" ||
    ipcTemplates43Config.mode !== "arm" || ipcTemplates43Config.totalBodySize !== 552 ||
    ipcTemplates43Config.cumulativePoolSlots !== 564 ||
    ipcTemplates43Config.cumulativePoolClasses !== 282 || ipcTemplates43.size !== 6 ||
    configuredIpcTemplate43Bytes !== 552 || configuredIpcTemplate43Branches !== 16 ||
    configuredIpcTemplate43Slots !== 10 ||
    JSON.stringify(ipcTemplates43Config.literalIdentities) !== JSON.stringify(ipcTemplate43LiteralIdentities) ||
    JSON.stringify(ipcTemplates43Config.reusedLiteralIdentities) !== JSON.stringify([
      "service_dispatch_state_42", "service_unavailable_result_42", "service_initialized_byte_35",
      "ipc_handle_slot_alpha", "service_absent_result_41_a", "service_handle_replacement_41_a",
      "service_wait_handle_42",
    ]) ||
    JSON.stringify(ipcTemplates43Config.newLiteralIdentities) !== JSON.stringify([
      "service_lifecycle_object_43", "service_replacement_source_43",
      "service_thread_completion_counts_43",
    ]) ||
    JSON.stringify(ipcTemplates43Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate43PrimaryEntries,
      sharedClasses: [
        { symbol: "func_001602B8", siteCount: 3 },
        { symbol: "func_001603A0", siteCount: 4 },
        { symbol: "func_00160380", siteCount: 4 },
      ],
      singletonClasses: [
        "func_001644DC", "func_0017080C", "func_00174314", "func_00178228",
        "func_00124BA4",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 43 totals or identity contract");
}

const ipcTemplates44Config = JSON.parse(readFileSync(ipcTemplates44Path, "utf8"));
const ipcTemplate44PrimaryEntries = [
  "func_00146000", "func_00174DD0", "func_001603A0", "func_001781F0",
  "func_0017E324", "func_001602B8", "func_00160380", "func_002DE7D4",
  "func_001397B8",
];
const ipcTemplate44SecondaryEntries = [
  "service_mark_ready_secondary_44",
];
const ipcTemplate44LiteralIdentities = [
  "service_reference_state_44", "ipc_handle_slot_nu", "service_handle_replacement_41_b",
  "service_unlink_context_44", "service_completion_code_40",
  "service_thread_completion_counts_43", "service_acquisition_input_44",
  "service_cleanup_vtable_44",
];
const ipcTemplate44Expected = new Map([
  ["func_00160594", [100,
    [{ offset: 80, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_00146000" }],
    [{ offset: 100, symbol: "service_reference_state_44" },
      { offset: 104, symbol: "ipc_handle_slot_nu" },
      { offset: 108, symbol: "service_handle_replacement_41_b" }]]],
  ["func_00166FE4", [112,
    [{ offset: 28, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00174DD0" },
      { offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_mark_ready_secondary_44" },
      { offset: 60, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 72, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001781F0" }], []]],
  ["func_001780E8", [104,
    [{ offset: 64, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 76, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017E324" }],
    [{ offset: 104, symbol: "service_unlink_context_44" }]]],
  ["func_0018C62C", [128,
    [{ offset: 24, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
      { offset: 52, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 88, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
      { offset: 116, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" }],
    [{ offset: 128, symbol: "service_completion_code_40" },
      { offset: 132, symbol: "service_thread_completion_counts_43" }]]],
  ["func_002DDD28", [104,
    [{ offset: 56, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002DE7D4" },
      { offset: 64, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_00146000" }],
    [{ offset: 104, symbol: "service_acquisition_input_44" }]]],
  ["func_0042D5E0", [100,
    [{ offset: 20, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001397B8" }],
    [{ offset: 100, symbol: "service_cleanup_vtable_44" }]]],
]);
const ipcTemplates44 = new Map();
let configuredIpcTemplate44Bytes = 0;
let configuredIpcTemplate44Branches = 0;
let configuredIpcTemplate44Slots = 0;
for (const entry of ipcTemplates44Config.functions ?? []) {
  const wanted = ipcTemplate44Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] ||
      JSON.stringify(entry.branches) !== JSON.stringify(wanted[1]) ||
      JSON.stringify(entry.literals) !== JSON.stringify(wanted[2]) ||
      ipcTemplates44.has(entry.name)) {
    throw new Error("Invalid IPC template 44 mapping entry");
  }
  ipcTemplates44.set(entry.name, entry);
  configuredIpcTemplate44Bytes += entry.size;
  configuredIpcTemplate44Branches += entry.branches.length;
  configuredIpcTemplate44Slots += entry.literals.length;
}
if (ipcTemplates44Config.schemaVersion !== 1 ||
    ipcTemplates44Config.source !== "src/main/arm_ipc_templates_44.S" ||
    ipcTemplates44Config.sourceSha256 !== "c7a7ba889a8d1b328b68e463380ab4afcff0864e3b722117102027b5bd6a0b60" ||
    ipcTemplates44Config.mode !== "arm" || ipcTemplates44Config.totalBodySize !== 648 ||
    ipcTemplates44Config.cumulativePoolSlots !== 572 ||
    ipcTemplates44Config.cumulativePoolClasses !== 286 || ipcTemplates44.size !== 6 ||
    configuredIpcTemplate44Bytes !== 648 || configuredIpcTemplate44Branches !== 14 ||
    configuredIpcTemplate44Slots !== 8 ||
    JSON.stringify(ipcTemplates44Config.literalIdentities) !== JSON.stringify(ipcTemplate44LiteralIdentities) ||
    JSON.stringify(ipcTemplates44Config.reusedLiteralIdentities) !== JSON.stringify([
      "ipc_handle_slot_nu", "service_handle_replacement_41_b",
      "service_completion_code_40", "service_thread_completion_counts_43",
    ]) ||
    JSON.stringify(ipcTemplates44Config.newLiteralIdentities) !== JSON.stringify([
      "service_reference_state_44", "service_unlink_context_44",
      "service_acquisition_input_44", "service_cleanup_vtable_44",
    ]) ||
    JSON.stringify(ipcTemplates44Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate44PrimaryEntries,
      secondaryEntries: ipcTemplate44SecondaryEntries,
      sharedClasses: [
        { symbol: "func_00146000", siteCount: 2 },
        { symbol: "func_001603A0", siteCount: 4 },
      ],
      singletonClasses: [
        "func_00174DD0", "service_mark_ready_secondary_44", "func_001781F0",
        "func_0017E324", "func_001602B8", "func_00160380",
        "func_002DE7D4", "func_001397B8",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 44 totals or identity contract");
}

const ipcTemplates45Config = JSON.parse(readFileSync(ipcTemplates45Path, "utf8"));
const ipcTemplate45PrimaryEntries = [
  "func_001603A0", "func_001781F0", "func_001602B8", "func_00164F74",
  "func_0017A640", "func_0017A5B8", "func_001780E8", "func_00160380",
  "func_00177FF0", "func_0017048C", "func_00132A14", "func_002C23C8",
  "func_002C5C4C", "func_002C2454", "func_00150874", "func_002E6CA4",
];
const ipcTemplate45SecondaryEntries = [
  "service_result_wait_secondary_45", "service_payload_submit_secondary_45",
  "service_session_reset_secondary_45",
];
const ipcTemplate45Expected = new Map([
  ["func_00174314", [236, [
    { offset: 28, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
    { offset: 56, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
    { offset: 68, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001781F0" },
    { offset: 100, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
    { offset: 112, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00164F74" },
    { offset: 124, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017A640" },
    { offset: 136, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017A5B8" },
    { offset: 160, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001780E8" },
    { offset: 220, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" },
  ]]],
  ["func_001745F8", [268, [
    { offset: 16, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
    { offset: 32, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00177FF0" },
    { offset: 264, kind: "R_ARM_JUMP24", mnemonic: "b", symbol: "func_00160380" },
  ]]],
  ["func_0019B5B0", [120, [
    { offset: 68, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
  ]]],
  ["func_002BC2F8", [172, [
    { offset: 44, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_0017048C" },
    { offset: 60, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
    { offset: 84, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00132A14" },
    { offset: 124, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002C23C8" },
    { offset: 136, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002C5C4C" },
    { offset: 148, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002C2454" },
  ]]],
  ["func_0042F6BC", [96, [
    { offset: 20, kind: "R_ARM_JUMP24", mnemonic: "blne", symbol: "func_001603A0" },
    { offset: 28, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_result_wait_secondary_45" },
    { offset: 44, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_payload_submit_secondary_45" },
    { offset: 68, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_001602B8" },
    { offset: 84, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00160380" },
  ]]],
  ["func_00430818", [152, [
    { offset: 28, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_00150874" },
    { offset: 124, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "service_session_reset_secondary_45" },
    { offset: 136, kind: "R_ARM_CALL", mnemonic: "bl", symbol: "func_002E6CA4" },
  ]]],
]);
const ipcTemplates45 = new Map();
let configuredIpcTemplate45Bytes = 0;
let configuredIpcTemplate45Branches = 0;
for (const entry of ipcTemplates45Config.functions ?? []) {
  const wanted = ipcTemplate45Expected.get(entry?.name);
  if (!wanted || entry.size !== wanted[0] ||
      JSON.stringify(entry.branches) !== JSON.stringify(wanted[1]) ||
      JSON.stringify(entry.literals) !== "[]" || ipcTemplates45.has(entry.name)) {
    throw new Error("Invalid IPC template 45 mapping entry");
  }
  ipcTemplates45.set(entry.name, entry);
  configuredIpcTemplate45Bytes += entry.size;
  configuredIpcTemplate45Branches += entry.branches.length;
}
if (ipcTemplates45Config.schemaVersion !== 1 ||
    ipcTemplates45Config.source !== "src/main/arm_ipc_templates_45.S" ||
    ipcTemplates45Config.sourceSha256 !== "a4a0c254ae97f9e36dbedf8cccf3d2e349eb490bf491bf0d600dc2280d543621" ||
    ipcTemplates45Config.mode !== "arm" || ipcTemplates45Config.totalBodySize !== 1044 ||
    ipcTemplates45Config.cumulativePoolSlots !== 572 ||
    ipcTemplates45Config.cumulativePoolClasses !== 286 || ipcTemplates45.size !== 6 ||
    configuredIpcTemplate45Bytes !== 1044 || configuredIpcTemplate45Branches !== 27 ||
    JSON.stringify(ipcTemplates45Config.literalIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates45Config.reusedLiteralIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates45Config.newLiteralIdentities) !== "[]" ||
    JSON.stringify(ipcTemplates45Config.branchIdentityContract) !== JSON.stringify({
      mode: "arm", minimumAlignment: 4, primaryEntries: ipcTemplate45PrimaryEntries,
      secondaryEntries: ipcTemplate45SecondaryEntries,
      sharedClasses: [
        { symbol: "func_001603A0", siteCount: 5 },
        { symbol: "func_001602B8", siteCount: 3 },
        { symbol: "func_00160380", siteCount: 3 },
      ],
      singletonClasses: [
        "func_001781F0", "func_00164F74", "func_0017A640", "func_0017A5B8",
        "func_001780E8", "func_00177FF0", "func_0017048C", "func_00132A14",
        "func_002C23C8", "func_002C5C4C", "func_002C2454",
        "service_result_wait_secondary_45", "service_payload_submit_secondary_45",
        "func_00150874", "service_session_reset_secondary_45", "func_002E6CA4",
      ],
      classesPairwiseDistinct: true,
    })) {
  throw new Error("Unexpected IPC template 45 totals or identity contract");
}

const duplicateTemplates19Config = JSON.parse(readFileSync(duplicateTemplates19Path, "utf8"));
if (duplicateTemplates19Config.version !== 1 || duplicateTemplates19Config.mode !== "arm" ||
    duplicateTemplates19Config.expectedBodyBytes !== 904 ||
    !Array.isArray(duplicateTemplates19Config.functions) ||
    duplicateTemplates19Config.functions.length !== 14 ||
    duplicateTemplates19Config.literalIdentities === null ||
    typeof duplicateTemplates19Config.literalIdentities !== "object") {
  throw new Error("Unexpected duplicate template 19 mapping format");
}
const duplicateTemplates19 = new Map();
let configuredDuplicateTemplate19Bytes = 0;
let configuredDuplicateTemplate19Slots = 0;
for (const entry of duplicateTemplates19Config.functions) {
  const definition = duplicateTemplates19Config.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      definition === undefined || !Number.isInteger(definition.bodySize) ||
      !Array.isArray(entry.literals) || entry.literals.some((literal, index) =>
        literal === null || typeof literal !== "object" ||
        literal.offset !== definition.bodySize + index * 4 ||
        typeof duplicateTemplates19Config.literalIdentities[literal.identity] !== "string") ||
      duplicateTemplates19.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 19 mapping entry");
  }
  duplicateTemplates19.set(entry.name, entry);
  configuredDuplicateTemplate19Bytes += definition.bodySize;
  configuredDuplicateTemplate19Slots += entry.literals.length;
}
if (configuredDuplicateTemplate19Bytes !== 904 || configuredDuplicateTemplate19Slots !== 20 ||
    Object.keys(duplicateTemplates19Config.templates ?? {}).length !== 6 ||
    Object.keys(duplicateTemplates19Config.literalIdentities).length !== 14) {
  throw new Error("Unexpected duplicate template 19 totals");
}

const duplicateTemplates21Config = JSON.parse(readFileSync(duplicateTemplates21Path, "utf8"));
if (duplicateTemplates21Config.version !== 1 || duplicateTemplates21Config.mode !== "arm" ||
    duplicateTemplates21Config.expectedBodyBytes !== 536 ||
    !Array.isArray(duplicateTemplates21Config.functions) ||
    duplicateTemplates21Config.functions.length !== 19 ||
    duplicateTemplates21Config.literalIdentities === null ||
    typeof duplicateTemplates21Config.literalIdentities !== "object") {
  throw new Error("Unexpected duplicate template 21 mapping format");
}
const duplicateTemplates21 = new Map();
let configuredDuplicateTemplate21Bytes = 0;
let configuredDuplicateTemplate21Slots = 0;
for (const entry of duplicateTemplates21Config.functions) {
  const definition = duplicateTemplates21Config.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      definition === undefined || !Number.isInteger(definition.bodySize) ||
      !Number.isInteger(definition.literalCount) || !Array.isArray(entry.literals) ||
      entry.literals.length !== definition.literalCount || entry.literals.some((literal, index) =>
        literal === null || typeof literal !== "object" ||
        literal.offset !== definition.bodySize + index * 4 ||
        typeof duplicateTemplates21Config.literalIdentities[literal.identity] !== "string") ||
      duplicateTemplates21.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 21 mapping entry");
  }
  duplicateTemplates21.set(entry.name, entry);
  configuredDuplicateTemplate21Bytes += definition.bodySize;
  configuredDuplicateTemplate21Slots += entry.literals.length;
}
if (configuredDuplicateTemplate21Bytes !== 536 || configuredDuplicateTemplate21Slots !== 12 ||
    Object.keys(duplicateTemplates21Config.templates ?? {}).length !== 6 ||
    Object.keys(duplicateTemplates21Config.literalIdentities).length !== 11) {
  throw new Error("Unexpected duplicate template 21 totals");
}

const duplicateTemplates22Config = JSON.parse(readFileSync(duplicateTemplates22Path, "utf8"));
if (duplicateTemplates22Config.version !== 1 || duplicateTemplates22Config.mode !== "arm" ||
    duplicateTemplates22Config.expectedBodyBytes !== 432 ||
    !Array.isArray(duplicateTemplates22Config.functions) ||
    duplicateTemplates22Config.functions.length !== 15 ||
    duplicateTemplates22Config.literalIdentities?.presence !== "duplicate_template_22_presence_identity") {
  throw new Error("Unexpected duplicate template 22 mapping format");
}
const duplicateTemplates22 = new Map();
let configuredDuplicateTemplate22Bytes = 0;
let configuredDuplicateTemplate22Slots = 0;
for (const entry of duplicateTemplates22Config.functions) {
  const definition = duplicateTemplates22Config.templates?.[entry?.template];
  const isSelector = entry?.template === "member_presence_identity_selector";
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      definition === undefined || !Number.isInteger(definition.bodySize) ||
      !Number.isInteger(definition.literalCount) || !Array.isArray(entry.literals) ||
      entry.literals.length !== definition.literalCount || entry.literals.some((literal, index) =>
        literal === null || typeof literal !== "object" ||
        literal.offset !== definition.bodySize + index * 4 ||
        typeof duplicateTemplates22Config.literalIdentities[literal.identity] !== "string") ||
      (isSelector ? !/^func_[0-9A-F]{8}$/.test(entry.call) || definition.callOffset !== 12 :
        entry.call !== undefined || definition.callOffset !== undefined) ||
      duplicateTemplates22.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 22 mapping entry");
  }
  duplicateTemplates22.set(entry.name, entry);
  configuredDuplicateTemplate22Bytes += definition.bodySize;
  configuredDuplicateTemplate22Slots += entry.literals.length;
}
if (configuredDuplicateTemplate22Bytes !== 432 || configuredDuplicateTemplate22Slots !== 2 ||
    Object.keys(duplicateTemplates22Config.templates ?? {}).length !== 6 ||
    Object.keys(duplicateTemplates22Config.literalIdentities).length !== 1) {
  throw new Error("Unexpected duplicate template 22 totals");
}

const duplicateTemplates23Config = JSON.parse(readFileSync(duplicateTemplates23Path, "utf8"));
if (duplicateTemplates23Config.version !== 1 || duplicateTemplates23Config.mode !== "arm" ||
    duplicateTemplates23Config.expectedBodyBytes !== 424 ||
    !Array.isArray(duplicateTemplates23Config.functions) ||
    duplicateTemplates23Config.functions.length !== 24 ||
    duplicateTemplates23Config.literalIdentities === null ||
    typeof duplicateTemplates23Config.literalIdentities !== "object") {
  throw new Error("Unexpected duplicate template 23 mapping format");
}
const duplicateTemplates23 = new Map();
let configuredDuplicateTemplate23Bytes = 0;
let configuredDuplicateTemplate23Slots = 0;
for (const entry of duplicateTemplates23Config.functions) {
  const definition = duplicateTemplates23Config.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      definition === undefined || !Number.isInteger(definition.bodySize) ||
      !Number.isInteger(definition.literalCount) || !Array.isArray(entry.literals) ||
      entry.literals.length !== definition.literalCount || entry.literals.some((literal, index) =>
        literal === null || typeof literal !== "object" ||
        literal.offset !== definition.bodySize + index * 4 ||
        typeof duplicateTemplates23Config.literalIdentities[literal.identity] !== "string") ||
      duplicateTemplates23.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 23 mapping entry");
  }
  duplicateTemplates23.set(entry.name, entry);
  configuredDuplicateTemplate23Bytes += definition.bodySize;
  configuredDuplicateTemplate23Slots += entry.literals.length;
}
if (configuredDuplicateTemplate23Bytes !== 424 || configuredDuplicateTemplate23Slots !== 16 ||
    Object.keys(duplicateTemplates23Config.templates ?? {}).length !== 6 ||
    Object.keys(duplicateTemplates23Config.literalIdentities).length !== 16) {
  throw new Error("Unexpected duplicate template 23 totals");
}

const duplicateTemplates24Config = JSON.parse(readFileSync(duplicateTemplates24Path, "utf8"));
if (duplicateTemplates24Config.version !== 1 || duplicateTemplates24Config.mode !== "arm" ||
    duplicateTemplates24Config.expectedBodyBytes !== 640 ||
    !Array.isArray(duplicateTemplates24Config.functions) ||
    duplicateTemplates24Config.functions.length !== 42) {
  throw new Error("Unexpected duplicate template 24 mapping format");
}
const duplicateTemplates24 = new Map();
let configuredDuplicateTemplate24Bytes = 0;
for (const entry of duplicateTemplates24Config.functions) {
  const definition = duplicateTemplates24Config.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      definition === undefined || !Number.isInteger(definition.bodySize) ||
      definition.literalCount !== 0 || !Array.isArray(entry.literals) || entry.literals.length !== 0 ||
      duplicateTemplates24.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 24 mapping entry");
  }
  duplicateTemplates24.set(entry.name, entry);
  configuredDuplicateTemplate24Bytes += definition.bodySize;
}
if (configuredDuplicateTemplate24Bytes !== 640 ||
    Object.keys(duplicateTemplates24Config.templates ?? {}).length !== 18) {
  throw new Error("Unexpected duplicate template 24 totals");
}

const duplicateTemplates25Config = JSON.parse(readFileSync(duplicateTemplates25Path, "utf8"));
if (duplicateTemplates25Config.version !== 1 || duplicateTemplates25Config.mode !== "arm" ||
    duplicateTemplates25Config.expectedBodyBytes !== 300 ||
    !Array.isArray(duplicateTemplates25Config.functions) ||
    duplicateTemplates25Config.functions.length !== 15 ||
    duplicateTemplates25Config.literalIdentities === null ||
    typeof duplicateTemplates25Config.literalIdentities !== "object") {
  throw new Error("Unexpected duplicate template 25 mapping format");
}
const duplicateTemplates25 = new Map();
let configuredDuplicateTemplate25Bytes = 0;
let configuredDuplicateTemplate25Slots = 0;
for (const entry of duplicateTemplates25Config.functions) {
  const definition = duplicateTemplates25Config.templates?.[entry?.template];
  if (entry === null || typeof entry !== "object" || !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      definition === undefined || !Number.isInteger(definition.bodySize) ||
      !Number.isInteger(definition.literalCount) || !Array.isArray(entry.literals) ||
      entry.literals.length !== definition.literalCount || entry.literals.some((literal, index) => {
        const identity = duplicateTemplates25Config.literalIdentities[literal?.identity];
        return literal === null || typeof literal !== "object" ||
          literal.offset !== definition.bodySize + index * 4 || identity === null ||
          typeof identity !== "object" || typeof identity.symbol !== "string" ||
          !["data-address", "rodata-address", "unsigned-scalar"].includes(identity.class);
      }) || duplicateTemplates25.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 25 mapping entry");
  }
  duplicateTemplates25.set(entry.name, entry);
  configuredDuplicateTemplate25Bytes += definition.bodySize;
  configuredDuplicateTemplate25Slots += entry.literals.length;
}
if (configuredDuplicateTemplate25Bytes !== 300 || configuredDuplicateTemplate25Slots !== 10 ||
    Object.keys(duplicateTemplates25Config.templates ?? {}).length !== 7 ||
    Object.keys(duplicateTemplates25Config.literalIdentities).length !== 9) {
  throw new Error("Unexpected duplicate template 25 totals");
}

const duplicateTemplates26Config = JSON.parse(readFileSync(duplicateTemplates26Path, "utf8"));
const duplicateTemplates26ExpectedTemplates = new Map([
  ["signed_code_normalize", { bodySize: 60, count: 3, branchOffset: 56, branchKind: "tail-transfer", relocationKind: "R_ARM_JUMP24" }],
  ["table_signed_code_dispatch", { bodySize: 52, count: 3, branchOffset: 32, branchKind: "conditional-link", relocationKind: "R_ARM_JUMP24" }],
]);
if (duplicateTemplates26Config.version !== 1 || duplicateTemplates26Config.mode !== "arm" ||
    duplicateTemplates26Config.expectedBodyBytes !== 336 ||
    JSON.stringify(duplicateTemplates26Config.templates) !==
      JSON.stringify(Object.fromEntries(duplicateTemplates26ExpectedTemplates)) ||
    !Array.isArray(duplicateTemplates26Config.functions) ||
    duplicateTemplates26Config.functions.length !== 6) {
  throw new Error("Unexpected duplicate template 26 mapping format");
}
const duplicateTemplates26 = new Map();
let configuredDuplicateTemplate26Bytes = 0;
for (const entry of duplicateTemplates26Config.functions) {
  const definition = duplicateTemplates26ExpectedTemplates.get(entry?.template);
  const expectedKeys = entry?.template === "table_signed_code_dispatch"
    ? "branchTarget,name,tableBlock,template" : "branchTarget,name,template";
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== expectedKeys ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || !/^func_[0-9A-F]{8}$/.test(entry.branchTarget) ||
      definition === undefined || duplicateTemplates26.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 26 mapping entry");
  }
  duplicateTemplates26.set(entry.name, entry);
  configuredDuplicateTemplate26Bytes += definition.bodySize;
}
const duplicateTemplate26Blocks = duplicateTemplates26Config.tableBlocks;
const duplicateTemplate26BlockEntries = Object.entries(duplicateTemplate26Blocks ?? {});
if (configuredDuplicateTemplate26Bytes !== 336 || duplicateTemplate26BlockEntries.length !== 3 ||
    duplicateTemplate26BlockEntries.some(([, block]) => block?.alignment !== 4 ||
      block.contentEqualityClass !== "duplicate_template_26_decode_table_contents" ||
      JSON.stringify(Object.entries(block.views ?? {}).map(([name, view]) =>
        [name, view.bodyRelativeOffset, view.size, view.contentEqualityClass])) !== JSON.stringify([
          ["selector", -332, 64, "duplicate_template_26_selector_contents"],
          ["wordDisplacements", -268, undefined, "duplicate_template_26_word_displacement_contents"],
          ["shiftWidths", -228, undefined, "duplicate_template_26_shift_width_contents"],
        ]))) {
  throw new Error("Unexpected duplicate template 26 totals or table-view identities");
}

const duplicateTemplates27Config = JSON.parse(readFileSync(duplicateTemplates27Path, "utf8"));
const duplicateTemplate27Definition = {
  bodySize: 1628, instructionCount: 407, count: 10, internalLabels: 49,
};
if (duplicateTemplates27Config.version !== 1 || duplicateTemplates27Config.mode !== "arm" ||
    duplicateTemplates27Config.expectedBodyBytes !== 16280 ||
    JSON.stringify(duplicateTemplates27Config.templates) !== JSON.stringify({
      intrusive_colored_tree_erase: duplicateTemplate27Definition,
    }) || !Array.isArray(duplicateTemplates27Config.functions) ||
    duplicateTemplates27Config.functions.length !== 10) {
  throw new Error("Unexpected duplicate template 27 mapping format");
}
const duplicateTemplates27 = new Map();
for (const entry of duplicateTemplates27Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) ||
      entry.template !== "intrusive_colored_tree_erase" || duplicateTemplates27.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 27 mapping entry");
  }
  duplicateTemplates27.set(entry.name, entry);
}

const duplicateTemplates29Config = JSON.parse(readFileSync(duplicateTemplates29Path, "utf8"));
const duplicateTemplate29Definition = {
  bodySize: 1884, instructionCount: 471, count: 5, internalLabels: 59, callOffset: 84,
};
if (duplicateTemplates29Config.version !== 1 || duplicateTemplates29Config.mode !== "arm" ||
    duplicateTemplates29Config.expectedBodyBytes !== 9420 ||
    JSON.stringify(duplicateTemplates29Config.templates) !== JSON.stringify({
      intrusive_colored_tree_range_erase: duplicateTemplate29Definition,
    }) || !Array.isArray(duplicateTemplates29Config.functions) ||
    duplicateTemplates29Config.functions.length !== 5) {
  throw new Error("Unexpected duplicate template 29 mapping format");
}
const duplicateTemplates29 = new Map();
for (const entry of duplicateTemplates29Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "helper,name,template" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || !/^func_[0-9A-F]{8}$/.test(entry.helper) ||
      entry.template !== "intrusive_colored_tree_range_erase" || duplicateTemplates29.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 29 mapping entry");
  }
  duplicateTemplates29.set(entry.name, entry);
}

const duplicateTemplates30Config = JSON.parse(readFileSync(duplicateTemplates30Path, "utf8"));
const duplicateTemplate30Definition = {
  bodySize: 1900, instructionCount: 475, count: 4, internalLabels: 59, callOffset: 84,
};
const duplicateTemplates30Expected = [
  ["func_0055AB74", "func_0055B2E0"],
  ["func_0055B688", "func_0055BDF4"],
  ["func_0055E69C", "func_0055EE08"],
  ["func_00560330", "func_00560A9C"],
];
if (duplicateTemplates30Config.version !== 1 || duplicateTemplates30Config.mode !== "arm" ||
    duplicateTemplates30Config.source !== "src/main/arm_duplicate_templates_30.S" ||
    duplicateTemplates30Config.expectedBodyBytes !== 7600 ||
    JSON.stringify(duplicateTemplates30Config.templates) !== JSON.stringify({
      intrusive_colored_tree_range_erase: duplicateTemplate30Definition,
    }) || !Array.isArray(duplicateTemplates30Config.functions) ||
    JSON.stringify(duplicateTemplates30Config.functions.map(({ name, helper }) => [name, helper])) !==
      JSON.stringify(duplicateTemplates30Expected)) {
  throw new Error("Unexpected duplicate template 30 mapping format");
}
const duplicateTemplates30 = new Map();
for (const entry of duplicateTemplates30Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "helper,name,template" ||
      entry.template !== "intrusive_colored_tree_range_erase" || duplicateTemplates30.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 30 mapping entry");
  }
  duplicateTemplates30.set(entry.name, entry);
}

const duplicateTemplates31Config = JSON.parse(readFileSync(duplicateTemplates31Path, "utf8"));
const duplicateTemplate31Definition = {
  bodySize: 1416, instructionCount: 354, count: 2, internalLabels: 12, calls: 0,
};
const duplicateTemplates31SlotContract = [
  { identity: "q15_coefficients", bodyOffset: -1288, uses: [124, 216, 264, 292, 876, 1148] },
  { identity: "permutation_indices", bodyOffset: -1280, uses: [56, 1300] },
];
const duplicateTemplates31Expected = [
  ["func_001AB5F4", "first_transform_q15_coefficients", "first_transform_permutation_indices"],
  ["func_001AD528", "second_transform_q15_coefficients", "second_transform_permutation_indices"],
];
if (duplicateTemplates31Config.version !== 1 || duplicateTemplates31Config.mode !== "arm" ||
    duplicateTemplates31Config.source !== "src/main/arm_duplicate_templates_31.S" ||
    duplicateTemplates31Config.expectedBodyBytes !== 2832 ||
    JSON.stringify(duplicateTemplates31Config.templates) !== JSON.stringify({
      fixed_point_complex_transform_64: duplicateTemplate31Definition,
    }) || JSON.stringify(duplicateTemplates31Config.slotContract) !==
      JSON.stringify(duplicateTemplates31SlotContract) ||
    !Array.isArray(duplicateTemplates31Config.functions) ||
    JSON.stringify(duplicateTemplates31Config.functions.map(
      ({ name, coefficientIdentity, permutationIdentity }) => [name, coefficientIdentity, permutationIdentity]
    )) !== JSON.stringify(duplicateTemplates31Expected)) {
  throw new Error("Unexpected duplicate template 31 mapping format");
}
const duplicateTemplates31Identities = duplicateTemplates31Config.literalIdentities;
if (duplicateTemplates31Identities === null || typeof duplicateTemplates31Identities !== "object" ||
    Object.keys(duplicateTemplates31Identities).length !== 4 ||
    new Set(Object.values(duplicateTemplates31Identities).map(({ symbol }) => symbol)).size !== 4 ||
    Object.values(duplicateTemplates31Identities).some((identity) => identity === null ||
      typeof identity !== "object" || !/^transform31_[a-z0-9_]+$/.test(identity.symbol) ||
      identity.segment !== "rodata" || identity.alignment !== 4)) {
  throw new Error("Unexpected duplicate template 31 symbolic identity contract");
}
const duplicateTemplates31 = new Map();
for (const entry of duplicateTemplates31Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "coefficientIdentity,name,permutationIdentity,template" ||
      entry.template !== "fixed_point_complex_transform_64" ||
      duplicateTemplates31Identities[entry.coefficientIdentity] === undefined ||
      duplicateTemplates31Identities[entry.permutationIdentity] === undefined ||
      entry.coefficientIdentity === entry.permutationIdentity || duplicateTemplates31.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 31 mapping entry");
  }
  duplicateTemplates31.set(entry.name, entry);
}

const duplicateTemplates32Config = JSON.parse(readFileSync(duplicateTemplates32Path, "utf8"));
const duplicateTemplate32Definition = {
  bodySize: 1276, instructionCount: 319, count: 2, internalLabels: 10, calls: 0,
};
const duplicateTemplates32SlotContract = [
  { identity: "q15_coefficients", bodyOffset: -12, uses: [424, 1052, 1140, 1188, 1224] },
  { identity: "permutation_and_late_coefficients", bodyOffset: -4, uses: [832, 980] },
  { identity: "reverse_stage_coefficients", bodyOffset: 2692, uses: [696] },
];
const duplicateTemplates32Expected = [
  ["func_001AB0F8", "first_transform_q15_coefficients", "first_transform_permutation_indices", "first_transform_reverse_stage_coefficients"],
  ["func_001AD02C", "second_transform_q15_coefficients", "second_transform_permutation_indices", "second_transform_reverse_stage_coefficients"],
];
if (duplicateTemplates32Config.version !== 1 || duplicateTemplates32Config.mode !== "arm" ||
    duplicateTemplates32Config.source !== "src/main/arm_duplicate_templates_32.S" ||
    duplicateTemplates32Config.expectedBodyBytes !== 2552 ||
    JSON.stringify(duplicateTemplates32Config.templates) !== JSON.stringify({
      inverse_fixed_point_complex_transform_64: duplicateTemplate32Definition,
    }) || JSON.stringify(duplicateTemplates32Config.slotContract) !==
      JSON.stringify(duplicateTemplates32SlotContract) ||
    !Array.isArray(duplicateTemplates32Config.functions) ||
    JSON.stringify(duplicateTemplates32Config.functions.map(
      ({ name, coefficientIdentity, permutationIdentity, reverseIdentity }) =>
        [name, coefficientIdentity, permutationIdentity, reverseIdentity]
    )) !== JSON.stringify(duplicateTemplates32Expected)) {
  throw new Error("Unexpected duplicate template 32 mapping format");
}
const duplicateTemplates32Identities = duplicateTemplates32Config.literalIdentities;
if (duplicateTemplates32Identities === null || typeof duplicateTemplates32Identities !== "object" ||
    Object.keys(duplicateTemplates32Identities).length !== 6 ||
    new Set(Object.values(duplicateTemplates32Identities).map(({ symbol }) => symbol)).size !== 6 ||
    Object.values(duplicateTemplates32Identities).some((identity) => identity === null ||
      typeof identity !== "object" || !/^transform(?:31|32)_[a-z0-9_]+$/.test(identity.symbol) ||
      identity.segment !== "rodata" || identity.alignment !== 4) ||
    duplicateTemplates32Identities.first_transform_q15_coefficients.symbol !==
      duplicateTemplates31Identities.first_transform_q15_coefficients.symbol ||
    duplicateTemplates32Identities.first_transform_permutation_indices.symbol !==
      duplicateTemplates31Identities.first_transform_permutation_indices.symbol ||
    duplicateTemplates32Identities.second_transform_q15_coefficients.symbol !==
      duplicateTemplates31Identities.second_transform_q15_coefficients.symbol ||
    duplicateTemplates32Identities.second_transform_permutation_indices.symbol !==
      duplicateTemplates31Identities.second_transform_permutation_indices.symbol) {
  throw new Error("Unexpected duplicate template 32 symbolic identity contract");
}
const duplicateTemplates32 = new Map();
for (const entry of duplicateTemplates32Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "coefficientIdentity,name,permutationIdentity,reverseIdentity,template" ||
      entry.template !== "inverse_fixed_point_complex_transform_64" ||
      duplicateTemplates32Identities[entry.coefficientIdentity] === undefined ||
      duplicateTemplates32Identities[entry.permutationIdentity] === undefined ||
      duplicateTemplates32Identities[entry.reverseIdentity] === undefined ||
      new Set([entry.coefficientIdentity, entry.permutationIdentity, entry.reverseIdentity]).size !== 3 ||
      duplicateTemplates32.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 32 mapping entry");
  }
  duplicateTemplates32.set(entry.name, entry);
}

const duplicateTemplates33Config = JSON.parse(readFileSync(duplicateTemplates33Path, "utf8"));
const duplicateTemplate33Definition = {
  bodySize: 892, instructionCount: 223, count: 9, internalLabels: 20, calls: 2,
};
const duplicateTemplates33CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const duplicateTemplates33Expected = [
  "func_0015E4C4", "func_0017DAEC", "func_0017DE68", "func_005622E0", "func_0056348C",
  "func_00563FA0", "func_00564AB4", "func_005654C8", "func_00565FDC",
];
if (duplicateTemplates33Config.version !== 1 || duplicateTemplates33Config.mode !== "arm" ||
    duplicateTemplates33Config.source !== "src/main/arm_duplicate_templates_33.S" ||
    duplicateTemplates33Config.expectedBodyBytes !== 8028 ||
    JSON.stringify(duplicateTemplates33Config.templates) !== JSON.stringify({
      pooled_intrusive_colored_tree_insert: duplicateTemplate33Definition,
    }) || JSON.stringify(duplicateTemplates33Config.callContract) !==
      JSON.stringify(duplicateTemplates33CallContract) ||
    !Array.isArray(duplicateTemplates33Config.functions) ||
    JSON.stringify(duplicateTemplates33Config.functions.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates33Expected)) {
  throw new Error("Unexpected duplicate template 33 mapping format");
}
const duplicateTemplates33 = new Map();
for (const entry of duplicateTemplates33Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      entry.template !== "pooled_intrusive_colored_tree_insert" ||
      duplicateTemplates33.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 33 mapping entry");
  }
  duplicateTemplates33.set(entry.name, entry);
}

const duplicateTemplates34Config = JSON.parse(readFileSync(duplicateTemplates34Path, "utf8"));
const duplicateTemplate34Definition = {
  bodySize: 1176, instructionCount: 294, count: 3, internalLabels: 32, calls: 15, poolSlots: 2,
};
const duplicateTemplates34CallContract = [
  { offset: 44, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 80, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 112, kind: "R_ARM_CALL", symbol: "func_0018C780" },
  { offset: 136, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 292, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 328, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 468, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 612, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 624, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 680, kind: "R_ARM_CALL", symbol: "operation" },
  { offset: 716, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 884, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 1044, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 1132, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 1144, kind: "R_ARM_CALL", symbol: "func_00160380" },
];
const duplicateTemplates34PoolContract = [
  { offset: 1176, kind: "R_ARM_ABS32", symbol: "resource_operation_state_34", loadOffset: 20 },
  { offset: 1180, kind: "R_ARM_ABS32", symbol: "resource_unavailable_status_34", loadOffset: 72 },
];
const duplicateTemplates34Expected = [
  ["func_002E25B0", "func_002E3F10"],
  ["func_002E4960", "func_002E422C"],
  ["func_002E52EC", "func_002E435C"],
];
if (duplicateTemplates34Config.version !== 1 || duplicateTemplates34Config.mode !== "arm" ||
    duplicateTemplates34Config.source !== "src/main/arm_duplicate_templates_34.S" ||
    duplicateTemplates34Config.expectedBodyBytes !== 3528 ||
    JSON.stringify(duplicateTemplates34Config.templates) !== JSON.stringify({
      serialized_resource_operation_wrapper: duplicateTemplate34Definition,
    }) || JSON.stringify(duplicateTemplates34Config.callContract) !==
      JSON.stringify(duplicateTemplates34CallContract) ||
    JSON.stringify(duplicateTemplates34Config.poolContract) !==
      JSON.stringify(duplicateTemplates34PoolContract) ||
    JSON.stringify(duplicateTemplates34Config.functions?.map(({ name, operation }) => [name, operation])) !==
      JSON.stringify(duplicateTemplates34Expected)) {
  throw new Error("Unexpected duplicate template 34 mapping format");
}
const duplicateTemplates34 = new Map();
for (const entry of duplicateTemplates34Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,operation,template" ||
      entry.template !== "serialized_resource_operation_wrapper" ||
      duplicateTemplates34.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 34 mapping entry");
  }
  duplicateTemplates34.set(entry.name, entry);
}

const duplicateTemplates35Config = JSON.parse(readFileSync(duplicateTemplates35Path, "utf8"));
const duplicateTemplate35Definition = {
  bodySize: 876, instructionCount: 219, count: 4, internalLabels: 20, calls: 2,
};
const duplicateTemplates35CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const duplicateTemplates35Expected = [
  "func_0017D780", "func_0055A01C", "func_0055B31C", "func_0055BE30",
];
if (duplicateTemplates35Config.version !== 1 || duplicateTemplates35Config.mode !== "arm" ||
    duplicateTemplates35Config.source !== "src/main/arm_duplicate_templates_35.S" ||
    duplicateTemplates35Config.expectedBodyBytes !== 3504 ||
    JSON.stringify(duplicateTemplates35Config.templates) !== JSON.stringify({
      pooled_compact_colored_tree_insert: duplicateTemplate35Definition,
    }) || JSON.stringify(duplicateTemplates35Config.callContract) !==
      JSON.stringify(duplicateTemplates35CallContract) ||
    !Array.isArray(duplicateTemplates35Config.functions) ||
    JSON.stringify(duplicateTemplates35Config.functions.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates35Expected)) {
  throw new Error("Unexpected duplicate template 35 mapping format");
}
const duplicateTemplates35 = new Map();
for (const entry of duplicateTemplates35Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      entry.template !== "pooled_compact_colored_tree_insert" ||
      duplicateTemplates35.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 35 mapping entry");
  }
  duplicateTemplates35.set(entry.name, entry);
}

const duplicateTemplates36Config = JSON.parse(readFileSync(duplicateTemplates36Path, "utf8"));
const duplicateTemplate36Definition = {
  bodySize: 892, instructionCount: 223, count: 3, internalLabels: 20, calls: 2,
};
const duplicateTemplates36CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const duplicateTemplates36Expected = [
  "func_00183AAC", "func_0018A0BC", "func_00568108",
];
if (duplicateTemplates36Config.version !== 1 || duplicateTemplates36Config.mode !== "arm" ||
    duplicateTemplates36Config.source !== "src/main/arm_duplicate_templates_36.S" ||
    duplicateTemplates36Config.expectedBodyBytes !== 2676 ||
    JSON.stringify(duplicateTemplates36Config.templates) !== JSON.stringify({
      pooled_halfword_key_colored_tree_insert: duplicateTemplate36Definition,
    }) || JSON.stringify(duplicateTemplates36Config.callContract) !==
      JSON.stringify(duplicateTemplates36CallContract) ||
    !Array.isArray(duplicateTemplates36Config.functions) ||
    JSON.stringify(duplicateTemplates36Config.functions.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates36Expected)) {
  throw new Error("Unexpected duplicate template 36 mapping format");
}
const duplicateTemplates36 = new Map();
for (const entry of duplicateTemplates36Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      entry.template !== "pooled_halfword_key_colored_tree_insert" ||
      duplicateTemplates36.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 36 mapping entry");
  }
  duplicateTemplates36.set(entry.name, entry);
}

const duplicateTemplates37Config = JSON.parse(readFileSync(duplicateTemplates37Path, "utf8"));
const duplicateTemplate37Definition = {
  bodySize: 892, instructionCount: 223, count: 3, internalLabels: 21, calls: 2,
};
const duplicateTemplates37CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const duplicateTemplates37Expected = [
  "func_00557CAC", "func_00558928", "func_00559478",
];
if (duplicateTemplates37Config.version !== 1 || duplicateTemplates37Config.mode !== "arm" ||
    duplicateTemplates37Config.source !== "src/main/arm_duplicate_templates_37.S" ||
    duplicateTemplates37Config.expectedBodyBytes !== 2676 ||
    JSON.stringify(duplicateTemplates37Config.templates) !== JSON.stringify({
      pooled_word_pair_colored_tree_insert: duplicateTemplate37Definition,
    }) || JSON.stringify(duplicateTemplates37Config.callContract) !==
      JSON.stringify(duplicateTemplates37CallContract) ||
    !Array.isArray(duplicateTemplates37Config.functions) ||
    JSON.stringify(duplicateTemplates37Config.functions.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates37Expected)) {
  throw new Error("Unexpected duplicate template 37 mapping format");
}
const duplicateTemplates37 = new Map();
for (const entry of duplicateTemplates37Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      entry.template !== "pooled_word_pair_colored_tree_insert" ||
      duplicateTemplates37.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 37 mapping entry");
  }
  duplicateTemplates37.set(entry.name, entry);
}

const duplicateTemplates38Config = JSON.parse(readFileSync(duplicateTemplates38Path, "utf8"));
const duplicateTemplate38Definition = {
  bodySize: 828, instructionCount: 207, count: 3, internalLabels: 22, calls: 1, literalCount: 4,
};
const duplicateTemplates38CallContract = [
  { offset: 20, kind: "R_ARM_CALL", symbol: "func_00312920" },
];
const duplicateTemplates38SlotContract = [
  { offset: 828, loadOffset: 8, role: "derived_dispatch_identity" },
  { offset: 832, loadOffset: 100, role: "shared_dispatch_identity_1" },
  { offset: 836, loadOffset: 164, role: "shared_dispatch_identity_2" },
  { offset: 840, loadOffset: 328, role: "shared_dispatch_identity_3" },
];
const duplicateTemplates38Expected = [
  ["func_002EB58C", "derived_002EB58C"],
  ["func_002EC008", "derived_002EC008"],
  ["func_002F9B78", "derived_002F9B78"],
];
const duplicateTemplates38Identities = duplicateTemplates38Config.literalIdentities;
if (duplicateTemplates38Config.version !== 1 || duplicateTemplates38Config.mode !== "arm" ||
    duplicateTemplates38Config.source !== "src/main/arm_duplicate_templates_38.S" ||
    duplicateTemplates38Config.expectedBodyBytes !== 2484 ||
    JSON.stringify(duplicateTemplates38Config.templates) !== JSON.stringify({
      staged_polymorphic_aggregate_teardown: duplicateTemplate38Definition,
    }) || JSON.stringify(duplicateTemplates38Config.callContract) !==
      JSON.stringify(duplicateTemplates38CallContract) ||
    JSON.stringify(duplicateTemplates38Config.slotContract) !==
      JSON.stringify(duplicateTemplates38SlotContract) ||
    duplicateTemplates38Identities === null || typeof duplicateTemplates38Identities !== "object" ||
    Object.keys(duplicateTemplates38Identities).length !== 6 ||
    new Set(Object.values(duplicateTemplates38Identities).map(({ symbol }) => symbol)).size !== 6 ||
    !Array.isArray(duplicateTemplates38Config.functions) ||
    JSON.stringify(duplicateTemplates38Config.functions.map(({ name, literals }) =>
      [name, literals?.[0]?.identity])) !== JSON.stringify(duplicateTemplates38Expected)) {
  throw new Error("Unexpected duplicate template 38 mapping format");
}
const duplicateTemplates38 = new Map();
for (const entry of duplicateTemplates38Config.functions) {
  const derivedIdentity = `derived_${entry.name.slice(5)}`;
  const expectedIdentities = [derivedIdentity, "shared_1", "shared_2", "shared_3"];
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      entry.template !== "staged_polymorphic_aggregate_teardown" ||
      !Array.isArray(entry.literals) || entry.literals.length !== 4 ||
      entry.literals.some((literal, index) => literal === null || typeof literal !== "object" ||
        Object.keys(literal).sort().join(",") !== "identity,loadOffset,offset" ||
        literal.offset !== duplicateTemplates38SlotContract[index].offset ||
        literal.loadOffset !== duplicateTemplates38SlotContract[index].loadOffset ||
        literal.identity !== expectedIdentities[index] ||
        duplicateTemplates38Identities[literal.identity]?.symbol === undefined) ||
      duplicateTemplates38.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 38 mapping entry");
  }
  duplicateTemplates38.set(entry.name, entry);
}

const duplicateTemplates39Config = JSON.parse(readFileSync(duplicateTemplates39Path, "utf8"));
const duplicateTemplate39Definition = {
  bodySize: 192, instructionCount: 48, count: 12, internalLabels: 5, calls: 6, literalCount: 3,
};
const duplicateTemplates39CallContract = [
  { offset: 12, kind: "R_ARM_CALL", symbol: "func_00178DFC" },
  { offset: 48, kind: "R_ARM_CALL", symbol: "func_00184990", addend: -4 },
  { offset: 68, kind: "R_ARM_CALL", symbol: "$self" },
  { offset: 80, kind: "R_ARM_CALL", symbol: "func_00171FC0" },
  { offset: 140, kind: "R_ARM_CALL", symbol: "func_00178974" },
  { offset: 164, kind: "R_ARM_CALL", symbol: "func_0017933C" },
];
const duplicateTemplates39SlotContract = [
  { offset: 192, loadOffset: 16, role: "derived_dispatch_identity" },
  { offset: 196, loadOffset: 84, role: "shared_registry_identity" },
  { offset: 200, loadOffset: 124, role: "diagnostic_descriptor_identity" },
];
const duplicateTemplates39Expected = [
  ["func_001628A0", "dispatch_001628A0", "descriptor_001628A0"],
  ["func_00163AA4", "dispatch_00163AA4", "descriptor_00163AA4"],
  ["func_00172534", "dispatch_00172534", "descriptor_pair_00172534"],
  ["func_00173064", "dispatch_00173064", "descriptor_pair_00172534"],
  ["func_00270F44", "dispatch_00270F44", "descriptor_00270F44"],
  ["func_00278924", "dispatch_00278924", "descriptor_00278924"],
  ["func_00287E00", "dispatch_00287E00", "descriptor_00287E00"],
  ["func_0028F9E0", "dispatch_0028F9E0", "descriptor_pair_0028F9E0"],
  ["func_002914EC", "dispatch_002914EC", "descriptor_pair_002914EC"],
  ["func_002948AC", "dispatch_002948AC", "descriptor_pair_0028F9E0"],
  ["func_0029DB3C", "dispatch_0029DB3C", "descriptor_0029DB3C"],
  ["func_0029FAC4", "dispatch_0029FAC4", "descriptor_pair_002914EC"],
];
const duplicateTemplates39Identities = duplicateTemplates39Config.literalIdentities;
if (duplicateTemplates39Config.version !== 1 || duplicateTemplates39Config.mode !== "arm" ||
    duplicateTemplates39Config.source !== "src/main/arm_duplicate_templates_39.S" ||
    duplicateTemplates39Config.expectedBodyBytes !== 2304 ||
    JSON.stringify(duplicateTemplates39Config.templates) !== JSON.stringify({
      typed_record_create_and_register: duplicateTemplate39Definition,
    }) || JSON.stringify(duplicateTemplates39Config.callContract) !==
      JSON.stringify(duplicateTemplates39CallContract) ||
    JSON.stringify(duplicateTemplates39Config.slotContract) !==
      JSON.stringify(duplicateTemplates39SlotContract) ||
    duplicateTemplates39Identities === null || typeof duplicateTemplates39Identities !== "object" ||
    Object.keys(duplicateTemplates39Identities).length !== 22 ||
    new Set(Object.values(duplicateTemplates39Identities).map(({ symbol }) => symbol)).size !== 22 ||
    !Array.isArray(duplicateTemplates39Config.functions) ||
    JSON.stringify(duplicateTemplates39Config.functions.map(({ name, literals }) =>
      [name, literals?.[0]?.identity, literals?.[2]?.identity])) !== JSON.stringify(duplicateTemplates39Expected)) {
  throw new Error("Unexpected duplicate template 39 mapping format");
}
const duplicateTemplates39 = new Map();
const duplicateTemplates39Occurrences = new Map(
  Object.keys(duplicateTemplates39Identities).map((identity) => [identity, 0])
);
for (const entry of duplicateTemplates39Config.functions) {
  const expected = duplicateTemplates39Expected[duplicateTemplates39.size];
  const expectedIdentities = [expected[1], "registry", expected[2]];
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      entry.template !== "typed_record_create_and_register" || entry.name !== expected[0] ||
      !Array.isArray(entry.literals) || entry.literals.length !== 3 ||
      entry.literals.some((literal, index) => literal === null || typeof literal !== "object" ||
        Object.keys(literal).sort().join(",") !== "identity,loadOffset,offset" ||
        literal.offset !== duplicateTemplates39SlotContract[index].offset ||
        literal.loadOffset !== duplicateTemplates39SlotContract[index].loadOffset ||
        literal.identity !== expectedIdentities[index] ||
        duplicateTemplates39Identities[literal.identity]?.symbol === undefined) ||
      duplicateTemplates39.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 39 mapping entry");
  }
  for (const { identity } of entry.literals) {
    duplicateTemplates39Occurrences.set(identity, duplicateTemplates39Occurrences.get(identity) + 1);
  }
  duplicateTemplates39.set(entry.name, entry);
}
if (duplicateTemplates39Occurrences.get("registry") !== 12 ||
    duplicateTemplates39Occurrences.get("descriptor_pair_00172534") !== 2 ||
    duplicateTemplates39Occurrences.get("descriptor_pair_0028F9E0") !== 2 ||
    duplicateTemplates39Occurrences.get("descriptor_pair_002914EC") !== 2 ||
    [...duplicateTemplates39Occurrences].filter(([identity]) =>
      identity !== "registry" && !identity.startsWith("descriptor_pair_"))
      .some(([, count]) => count !== 1)) {
  throw new Error("Duplicate template 39 does not define the approved 36-slot, 22-class ledger");
}

const duplicateTemplates40Config = JSON.parse(readFileSync(duplicateTemplates40Path, "utf8"));
const duplicateTemplate40Definition = {
  bodySize: 944, instructionCount: 236, count: 2, internalLabels: 21, calls: 2, literalCount: 1,
};
const duplicateTemplates40CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const duplicateTemplates40SlotContract = [
  { offset: 944, loadOffset: 200, role: "shared_node_payload_dispatch_identity" },
];
const duplicateTemplates40Expected = ["func_005522B8", "func_00552D08"];
const duplicateTemplates40Identities = duplicateTemplates40Config.literalIdentities;
if (duplicateTemplates40Config.version !== 1 || duplicateTemplates40Config.mode !== "arm" ||
    duplicateTemplates40Config.source !== "src/main/arm_duplicate_templates_40.S" ||
    duplicateTemplates40Config.expectedBodyBytes !== 1888 ||
    JSON.stringify(duplicateTemplates40Config.templates) !== JSON.stringify({
      pooled_red_black_tree_node_insert: duplicateTemplate40Definition,
    }) || JSON.stringify(duplicateTemplates40Config.callContract) !==
      JSON.stringify(duplicateTemplates40CallContract) ||
    JSON.stringify(duplicateTemplates40Config.slotContract) !==
      JSON.stringify(duplicateTemplates40SlotContract) ||
    JSON.stringify(duplicateTemplates40Identities) !== JSON.stringify({
      node_payload_dispatch: {
        symbol: "arm_duplicate_templates_40_shared_node_payload_dispatch_identity",
        class: "read-only-address",
      },
    }) || !Array.isArray(duplicateTemplates40Config.functions) ||
    JSON.stringify(duplicateTemplates40Config.functions.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates40Expected)) {
  throw new Error("Unexpected duplicate template 40 mapping format");
}
const duplicateTemplates40 = new Map();
for (const entry of duplicateTemplates40Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      entry.template !== "pooled_red_black_tree_node_insert" ||
      JSON.stringify(entry.literals) !== JSON.stringify([{
        offset: 944, loadOffset: 200, identity: "node_payload_dispatch",
      }]) || duplicateTemplates40.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 40 mapping entry");
  }
  duplicateTemplates40.set(entry.name, entry);
}

const duplicateTemplates41Config = JSON.parse(readFileSync(duplicateTemplates41Path, "utf8"));
const duplicateTemplate41Definition = {
  bodySize: 1160, instructionCount: 290, count: 2, internalLabels: 32, calls: 15, poolSlots: 2,
};
const duplicateTemplates41CallContract = [
  { offset: 36, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 72, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 104, kind: "R_ARM_CALL", symbol: "func_0018C780" },
  { offset: 128, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 292, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 328, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 468, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 612, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 624, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 664, kind: "R_ARM_CALL", symbol: "operation" },
  { offset: 700, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 868, kind: "R_ARM_CALL", symbol: "func_001602B8" },
  { offset: 1028, kind: "R_ARM_CALL", symbol: "func_00160380" },
  { offset: 1116, kind: "R_ARM_CALL", symbol: "func_0017048C" },
  { offset: 1128, kind: "R_ARM_CALL", symbol: "func_00160380" },
];
const duplicateTemplates41PoolContract = [
  { offset: 1160, kind: "R_ARM_ABS32", symbol: "resource_operation_state_41", loadOffset: 20 },
  { offset: 1164, kind: "R_ARM_ABS32", symbol: "resource_unavailable_status_41", loadOffset: 64 },
];
const duplicateTemplates41Expected = [
  ["func_002E3518", "func_002E40B0"],
  ["func_002E4E5C", "func_002E42FC"],
];
if (duplicateTemplates41Config.version !== 1 || duplicateTemplates41Config.mode !== "arm" ||
    duplicateTemplates41Config.source !== "src/main/arm_duplicate_templates_41.S" ||
    duplicateTemplates41Config.expectedBodyBytes !== 2320 ||
    JSON.stringify(duplicateTemplates41Config.templates) !== JSON.stringify({
      serialized_resource_operation_register_wrapper: duplicateTemplate41Definition,
    }) || JSON.stringify(duplicateTemplates41Config.callContract) !==
      JSON.stringify(duplicateTemplates41CallContract) ||
    JSON.stringify(duplicateTemplates41Config.poolContract) !==
      JSON.stringify(duplicateTemplates41PoolContract) ||
    JSON.stringify(duplicateTemplates41Config.functions?.map(({ name, operation }) => [name, operation])) !==
      JSON.stringify(duplicateTemplates41Expected)) {
  throw new Error("Unexpected duplicate template 41 mapping format");
}
const duplicateTemplates41 = new Map();
for (const entry of duplicateTemplates41Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,operation,template" ||
      entry.template !== "serialized_resource_operation_register_wrapper" ||
      duplicateTemplates41.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 41 mapping entry");
  }
  duplicateTemplates41.set(entry.name, entry);
}

const duplicateTemplates42Config = JSON.parse(readFileSync(duplicateTemplates42Path, "utf8"));
const duplicateTemplate42Definition = {
  bodySize: 920, instructionCount: 230, count: 2, internalLabels: 22, calls: 2, poolSlots: 0,
};
const duplicateTemplates42CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 128, kind: "R_ARM_CALL", symbol: "func_00184990" },
];
const duplicateTemplates42Expected = ["func_0016F5B4", "func_005538C8"];
if (duplicateTemplates42Config.version !== 1 || duplicateTemplates42Config.mode !== "arm" ||
    duplicateTemplates42Config.source !== "src/main/arm_duplicate_templates_42.S" ||
    duplicateTemplates42Config.expectedBodyBytes !== 1840 ||
    JSON.stringify(duplicateTemplates42Config.templates) !== JSON.stringify({
      pooled_u64_key_red_black_tree_node_insertion: duplicateTemplate42Definition,
    }) || JSON.stringify(duplicateTemplates42Config.callContract) !==
      JSON.stringify(duplicateTemplates42CallContract) ||
    JSON.stringify(duplicateTemplates42Config.poolContract) !== JSON.stringify([]) ||
    JSON.stringify(duplicateTemplates42Config.functions?.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates42Expected)) {
  throw new Error("Unexpected duplicate template 42 mapping format");
}
const duplicateTemplates42 = new Map();
for (const entry of duplicateTemplates42Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      entry.template !== "pooled_u64_key_red_black_tree_node_insertion" ||
      duplicateTemplates42.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 42 mapping entry");
  }
  duplicateTemplates42.set(entry.name, entry);
}

const duplicateTemplates43Config = JSON.parse(readFileSync(duplicateTemplates43Path, "utf8"));
const duplicateTemplate43Definition = {
  bodySize: 892, instructionCount: 223, count: 2, internalLabels: 21, calls: 3, poolSlots: 0,
};
const duplicateTemplates43CallContract = [
  { offset: 116, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 132, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 216, kind: "R_ARM_CALL", symbol: "payloadInitializer" },
];
const duplicateTemplates43Expected = [
  ["func_0018FC6C", "func_0018E1E0"],
  ["func_00560E5C", "func_0029F668"],
];
if (duplicateTemplates43Config.version !== 1 || duplicateTemplates43Config.mode !== "arm" ||
    duplicateTemplates43Config.source !== "src/main/arm_duplicate_templates_43.S" ||
    duplicateTemplates43Config.expectedBodyBytes !== 1784 ||
    JSON.stringify(duplicateTemplates43Config.templates) !== JSON.stringify({
      pooled_word_key_red_black_tree_node_insertion: duplicateTemplate43Definition,
    }) || JSON.stringify(duplicateTemplates43Config.callContract) !==
      JSON.stringify(duplicateTemplates43CallContract) ||
    JSON.stringify(duplicateTemplates43Config.poolContract) !== JSON.stringify([]) ||
    JSON.stringify(duplicateTemplates43Config.functions?.map(({ name, payloadInitializer }) =>
      [name, payloadInitializer])) !== JSON.stringify(duplicateTemplates43Expected)) {
  throw new Error("Unexpected duplicate template 43 mapping format");
}
const duplicateTemplates43 = new Map();
for (const entry of duplicateTemplates43Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,payloadInitializer,template" ||
      entry.template !== "pooled_word_key_red_black_tree_node_insertion" ||
      duplicateTemplates43.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 43 mapping entry");
  }
  duplicateTemplates43.set(entry.name, entry);
}

const duplicateTemplates44Config = JSON.parse(readFileSync(duplicateTemplates44Path, "utf8"));
const duplicateTemplate44Definition = {
  bodySize: 636, instructionCount: 159, count: 2, internalLabels: 11, calls: 2, poolSlots: 0,
};
const duplicateTemplates44CallContract = [
  { offset: 56, kind: "R_ARM_CALL", symbol: "func_0015EC10" },
  { offset: 72, kind: "R_ARM_CALL", symbol: "func_0015EC10" },
];
const duplicateTemplates44Expected = ["func_0016FF88", "func_001F3884"];
if (duplicateTemplates44Config.version !== 1 || duplicateTemplates44Config.mode !== "arm" ||
    duplicateTemplates44Config.source !== "src/main/arm_duplicate_templates_44.S" ||
    duplicateTemplates44Config.expectedBodyBytes !== 1272 ||
    JSON.stringify(duplicateTemplates44Config.templates) !== JSON.stringify({
      adaptive_arithmetic_decoder_symbol: duplicateTemplate44Definition,
    }) || JSON.stringify(duplicateTemplates44Config.callContract) !==
      JSON.stringify(duplicateTemplates44CallContract) ||
    JSON.stringify(duplicateTemplates44Config.poolContract) !== JSON.stringify([]) ||
    JSON.stringify(duplicateTemplates44Config.functions?.map(({ name }) => name)) !==
      JSON.stringify(duplicateTemplates44Expected)) {
  throw new Error("Unexpected duplicate template 44 mapping format");
}
const duplicateTemplates44 = new Map();
for (const entry of duplicateTemplates44Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "name,template" ||
      entry.template !== "adaptive_arithmetic_decoder_symbol" ||
      duplicateTemplates44.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 44 mapping entry");
  }
  duplicateTemplates44.set(entry.name, entry);
}

const duplicateTemplates45Config = JSON.parse(readFileSync(duplicateTemplates45Path, "utf8"));
const duplicateTemplate45Definition = {
  bodySize: 580, instructionCount: 145, count: 2, internalLabels: 13, calls: 2, poolSlots: 3,
};
const duplicateTemplates45CallContract = [
  { offset: 224, kind: "R_ARM_CALL", symbol: "func_00184990" },
  { offset: 544, kind: "R_ARM_CALL", symbol: "func_00160F9C" },
];
const duplicateTemplates45SlotContract = [
  { offset: 580, loadOffset: 24, role: "signed_divide_by_24_identity" },
  { offset: 584, loadOffset: 28, role: "primary_dispatch_identity" },
  { offset: 588, loadOffset: 36, role: "secondary_dispatch_identity" },
];
const duplicateTemplates45Identities = {
  divide_by_24: { symbol: "arm_duplicate_templates_45_divide_by_24_identity", class: "arithmetic-scalar" },
  primary_0056FDB0: { symbol: "func_0056FDB0_primary_dispatch_identity", class: "dispatch-identity" },
  secondary_0056FDB0: { symbol: "func_0056FDB0_secondary_dispatch_identity", class: "dispatch-identity" },
  primary_00570000: { symbol: "func_00570000_primary_dispatch_identity", class: "dispatch-identity" },
  secondary_00570000: { symbol: "func_00570000_secondary_dispatch_identity", class: "dispatch-identity" },
};
const duplicateTemplates45Expected = [
  ["func_0056FDB0", ["divide_by_24", "primary_0056FDB0", "secondary_0056FDB0"]],
  ["func_00570000", ["divide_by_24", "primary_00570000", "secondary_00570000"]],
];
if (duplicateTemplates45Config.version !== 1 || duplicateTemplates45Config.mode !== "arm" ||
    duplicateTemplates45Config.source !== "src/main/arm_duplicate_templates_45.S" ||
    duplicateTemplates45Config.expectedBodyBytes !== 1160 ||
    JSON.stringify(duplicateTemplates45Config.templates) !== JSON.stringify({
      polymorphic_record_vector_insert: duplicateTemplate45Definition,
    }) || JSON.stringify(duplicateTemplates45Config.callContract) !==
      JSON.stringify(duplicateTemplates45CallContract) ||
    JSON.stringify(duplicateTemplates45Config.slotContract) !==
      JSON.stringify(duplicateTemplates45SlotContract) ||
    JSON.stringify(duplicateTemplates45Config.literalIdentities) !==
      JSON.stringify(duplicateTemplates45Identities) ||
    JSON.stringify(duplicateTemplates45Config.functions?.map(({ name, literals }) =>
      [name, literals?.map(({ offset, loadOffset, identity }) => [offset, loadOffset, identity])])) !==
      JSON.stringify(duplicateTemplates45Expected.map(([name, identities]) => [name,
        identities.map((identity, index) => [580 + index * 4, [24, 28, 36][index], identity])]))) {
  throw new Error("Unexpected duplicate template 45 mapping format");
}
const duplicateTemplates45 = new Map();
for (const entry of duplicateTemplates45Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      entry.template !== "polymorphic_record_vector_insert" ||
      duplicateTemplates45.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 45 mapping entry");
  }
  duplicateTemplates45.set(entry.name, entry);
}

const duplicateTemplates46Config = JSON.parse(readFileSync(duplicateTemplates46Path, "utf8"));
const duplicateTemplate46Definition = {
  bodySize: 508, instructionCount: 127, count: 2, internalLabels: 11,
  calls: 2, indirectCalls: 4, poolSlots: 2,
};
const duplicateTemplates46CallContract = [
  { offset: 96, kind: "R_ARM_CALL", symbol: "func_002F7B18" },
  { offset: 192, kind: "R_ARM_CALL", symbol: "func_004B9B50" },
];
const duplicateTemplates46CallIdentities = {
  func_002F7B18: {
    callerObject: { defined: false, binding: "GLOBAL", type: "NOTYPE", section: "UND", size: 0 },
    targetObject: { defined: true, binding: "GLOBAL", type: "FUNC", section: ".text.func_002F7B18", size: 868, sectionType: "PROGBITS", sectionFlags: "AX", sectionAlignment: 4 },
  },
  func_004B9B50: {
    callerObject: { defined: false, binding: "GLOBAL", type: "NOTYPE", section: "UND", size: 0 },
    targetObject: { defined: true, binding: "GLOBAL", type: "FUNC", section: ".text.func_004B9B50", size: 32, sectionType: "PROGBITS", sectionFlags: "AX", sectionAlignment: 4 },
  },
};
const duplicateTemplates46SlotContract = [
  { offset: 508, loadOffset: 28, role: "required_flags_identity" },
  { offset: 512, loadOffset: 108, role: "object_dispatch_identity" },
];
const duplicateTemplates46Identities = {
  required_flags_002EBDF8: { symbol: "func_002EBDF8_required_flags_identity", class: "required-flags" },
  object_dispatch_002EBDF8: { symbol: "func_002EBDF8_object_dispatch_identity", class: "dispatch-identity" },
  required_flags_002F9968: { symbol: "func_002F9968_required_flags_identity", class: "required-flags" },
  object_dispatch_002F9968: { symbol: "func_002F9968_object_dispatch_identity", class: "dispatch-identity" },
};
const duplicateTemplates46Expected = [
  ["func_002EBDF8", ["required_flags_002EBDF8", "object_dispatch_002EBDF8"]],
  ["func_002F9968", ["required_flags_002F9968", "object_dispatch_002F9968"]],
];
if (duplicateTemplates46Config.version !== 1 || duplicateTemplates46Config.mode !== "arm" ||
    duplicateTemplates46Config.source !== "src/main/arm_duplicate_templates_46.S" ||
    duplicateTemplates46Config.expectedBodyBytes !== 1016 ||
    JSON.stringify(duplicateTemplates46Config.templates) !== JSON.stringify({
      conditional_object_resolve_and_append: duplicateTemplate46Definition,
    }) || JSON.stringify(duplicateTemplates46Config.callContract) !==
      JSON.stringify(duplicateTemplates46CallContract) ||
    JSON.stringify(duplicateTemplates46Config.callIdentities) !==
      JSON.stringify(duplicateTemplates46CallIdentities) ||
    JSON.stringify(duplicateTemplates46Config.slotContract) !==
      JSON.stringify(duplicateTemplates46SlotContract) ||
    JSON.stringify(duplicateTemplates46Config.literalIdentities) !==
      JSON.stringify(duplicateTemplates46Identities) ||
    JSON.stringify(duplicateTemplates46Config.functions?.map(({ name, literals }) =>
      [name, literals?.map(({ offset, loadOffset, identity }) => [offset, loadOffset, identity])])) !==
      JSON.stringify(duplicateTemplates46Expected.map(([name, mapped]) => [name,
        mapped.map((identity, index) => [508 + index * 4, [28, 108][index], identity])]))) {
  throw new Error("Unexpected duplicate template 46 mapping format");
}
const duplicateTemplates46 = new Map();
for (const entry of duplicateTemplates46Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !== "literals,name,template" ||
      entry.template !== "conditional_object_resolve_and_append" ||
      duplicateTemplates46.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 46 mapping entry");
  }
  duplicateTemplates46.set(entry.name, entry);
}

const duplicateTemplates47Config = JSON.parse(readFileSync(duplicateTemplates47Path, "utf8"));
const duplicateTemplate47Definition = {
  bodySize: 524, instructionCount: 131, count: 2, internalLabels: 6,
  directCalls: 15, indirectCalls: 3, poolSlots: 3,
};
const duplicateTemplates47CommonCalls = [
  { offset: 44, kind: "R_ARM_CALL", symbol: "func_00170DA4" },
  { offset: 64, kind: "R_ARM_CALL", symbol: "func_0056D0B8" },
  { offset: 112, kind: "R_ARM_CALL", symbol: "func_00184990", addend: -4 },
  { offset: 248, kind: "R_ARM_CALL", symbol: "func_001524C8" },
  { offset: 264, kind: "R_ARM_CALL", symbol: "func_0017F0D8" },
  { offset: 288, kind: "R_ARM_CALL", symbol: "func_00173A64" },
  { offset: 308, kind: "R_ARM_CALL", symbol: "func_001734DC" },
  { offset: 340, kind: "R_ARM_CALL", symbol: "func_001734DC" },
  { offset: 372, kind: "R_ARM_CALL", symbol: "func_001734DC" },
  { offset: 384, kind: "R_ARM_CALL", symbol: "func_00170E24" },
  { offset: 400, kind: "R_ARM_CALL", symbol: "func_001734DC" },
  { offset: 428, kind: "R_ARM_CALL", symbol: "func_00170E24" },
];
const duplicateTemplates47IndirectCalls = [
  { offset: 88, target: "service_dispatch_slot_252" },
  { offset: 212, target: "constructed_object_dispatch_slot_52" },
  { offset: 496, target: "constructed_object_dispatch_slot_4" },
];
const duplicateTemplates47LabelOffsets = [136, 324, 356, 416, 444, 500];
const duplicateTemplates47SlotContract = [
  { offset: 524, loadOffset: 292, kind: "R_ARM_ABS32", identity: "duplicate47_result_status_identity" },
  { offset: 528, loadOffset: 324, kind: "R_ARM_ABS32", identity: "duplicate47_invalid_context_status_identity" },
  { offset: 532, loadOffset: 356, kind: "R_ARM_ABS32", identity: "duplicate47_incompatible_service_status_identity" },
];
const duplicateTemplates47LiteralEquality = {
  pairwiseDistinct: [
    "duplicate47_result_status_identity",
    "duplicate47_invalid_context_status_identity",
    "duplicate47_incompatible_service_status_identity",
  ],
  sharedAcrossAllExpansions: true,
};
const duplicateTemplates47Expected = [
  {
    name: "func_0053A57C", template: "service_context_record_operation",
    nextGlobalOffset: 536, anonymousMaterialOffset: null,
    directCalls: [
      { offset: 128, kind: "R_ARM_CALL", symbol: "func_0053D290", role: "constructor" },
      { offset: 144, kind: "R_ARM_CALL", symbol: "func_002AD354", role: "builder" },
      { offset: 236, kind: "R_ARM_CALL", symbol: "func_002AD3EC", role: "cleanup" },
    ],
  },
  {
    name: "func_0053A794", template: "service_context_record_operation",
    nextGlobalOffset: 852, anonymousMaterialOffset: 536,
    directCalls: [
      { offset: 128, kind: "R_ARM_CALL", symbol: "func_0053ECFC", role: "constructor" },
      { offset: 144, kind: "R_ARM_CALL", symbol: "func_002AD444", role: "builder" },
      { offset: 236, kind: "R_ARM_CALL", symbol: "func_002AD4DC", role: "cleanup" },
    ],
  },
];
if (duplicateTemplates47Config.version !== 1 || duplicateTemplates47Config.mode !== "arm" ||
    duplicateTemplates47Config.source !== "src/main/arm_duplicate_templates_47.S" ||
    duplicateTemplates47Config.expectedBodyBytes !== 1048 ||
    JSON.stringify(duplicateTemplates47Config.templates) !== JSON.stringify({
      service_context_record_operation: duplicateTemplate47Definition,
    }) || JSON.stringify(duplicateTemplates47Config.commonDirectCalls) !==
      JSON.stringify(duplicateTemplates47CommonCalls) ||
    JSON.stringify(duplicateTemplates47Config.indirectCalls) !==
      JSON.stringify(duplicateTemplates47IndirectCalls) ||
    JSON.stringify(duplicateTemplates47Config.internalLabelOffsets) !==
      JSON.stringify(duplicateTemplates47LabelOffsets) ||
    JSON.stringify(duplicateTemplates47Config.slotContract) !==
      JSON.stringify(duplicateTemplates47SlotContract) ||
    JSON.stringify(duplicateTemplates47Config.literalEquality) !==
      JSON.stringify(duplicateTemplates47LiteralEquality) ||
    JSON.stringify(duplicateTemplates47Config.functions) !== JSON.stringify(duplicateTemplates47Expected)) {
  throw new Error("Unexpected duplicate template 47 mapping format");
}
const duplicateTemplates47 = new Map();
for (const entry of duplicateTemplates47Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !==
        "anonymousMaterialOffset,directCalls,name,nextGlobalOffset,template" ||
      entry.template !== "service_context_record_operation" ||
      duplicateTemplates47.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 47 mapping entry");
  }
  duplicateTemplates47.set(entry.name, entry);
}

const duplicateTemplates48Config = JSON.parse(readFileSync(duplicateTemplates48Path, "utf8"));
const duplicateTemplate48Definition = {
  bodySize: 272, instructionCount: 68, count: 3, internalLabels: 4,
  directCalls: 12, indirectCalls: 0, poolSlots: 0, postBodyIdentifiers: 3,
};
const duplicateTemplates48CommonCalls = [
  { offset: 12, kind: "R_ARM_CALL", symbol: "func_0012B95C" },
  { offset: 28, kind: "R_ARM_CALL", symbol: "func_0036F398" },
  { offset: 48, kind: "R_ARM_CALL", symbol: "func_0036F398" },
  { offset: 68, kind: "R_ARM_CALL", symbol: "func_0036F4D0" },
  { offset: 84, kind: "R_ARM_CALL", symbol: "func_0036F4D0" },
  { offset: 96, kind: "R_ARM_CALL", symbol: "func_0036F28C" },
  { offset: 112, kind: "R_ARM_CALL", symbol: "func_00123480" },
  { offset: 156, kind: "R_ARM_CALL", symbol: "func_003AB384" },
  { offset: 184, kind: "R_ARM_CALL", symbol: "func_0012B95C", addend: 16 },
  { offset: 220, kind: "R_ARM_CALL", symbol: "func_0011EF4C" },
  { offset: 256, kind: "R_ARM_CALL", symbol: "func_0011EF4C" },
];
const duplicateTemplates48LabelOffsets = [140, 196, 224, 260];
const duplicateTemplates48IdentifierContract = [
  { role: "shared_identifier_one", offset: 272, addressInstructionOffset: 24,
    nulTerminatedBytes: 21, reservedSpan: 24, sharedAcrossAllExpansions: true },
  { role: "shared_identifier_two", offset: 296, addressInstructionOffset: 40,
    nulTerminatedBytes: 23, reservedSpan: 24, sharedAcrossAllExpansions: true },
  { role: "expansion_identifier_three", offset: 320, addressInstructionOffset: 88,
    pairwiseDistinctAcrossExpansions: true },
];
const duplicateTemplates48Expected = [
  { name: "func_00368600", template: "registry_pair_attachment", constructor: "func_0019C0F8",
    constructorCallOffset: 132, identifierThreeBytes: 20, templateMaterialEndOffset: 340,
    anonymousMaterialOffset: null, nextGlobalOffset: 340 },
  { name: "func_00368CE0", template: "registry_pair_attachment", constructor: "func_0019C160",
    constructorCallOffset: 132, identifierThreeBytes: 22, templateMaterialEndOffset: 342,
    anonymousMaterialOffset: null, nextGlobalOffset: 344 },
  { name: "func_00369104", template: "registry_pair_attachment", constructor: "func_0019C190",
    constructorCallOffset: 132, identifierThreeBytes: 22, templateMaterialEndOffset: 342,
    anonymousMaterialOffset: 344, nextGlobalOffset: 444 },
];
if (duplicateTemplates48Config.version !== 1 || duplicateTemplates48Config.mode !== "arm" ||
    duplicateTemplates48Config.source !== "src/main/arm_duplicate_templates_48.S" ||
    duplicateTemplates48Config.expectedBodyBytes !== 816 ||
    JSON.stringify(duplicateTemplates48Config.templates) !== JSON.stringify({
      registry_pair_attachment: duplicateTemplate48Definition,
    }) || JSON.stringify(duplicateTemplates48Config.commonDirectCalls) !==
      JSON.stringify(duplicateTemplates48CommonCalls) ||
    JSON.stringify(duplicateTemplates48Config.internalLabelOffsets) !==
      JSON.stringify(duplicateTemplates48LabelOffsets) ||
    JSON.stringify(duplicateTemplates48Config.identifierContract) !==
      JSON.stringify(duplicateTemplates48IdentifierContract) ||
    JSON.stringify(duplicateTemplates48Config.functions) !== JSON.stringify(duplicateTemplates48Expected)) {
  throw new Error("Unexpected duplicate template 48 mapping format");
}
const duplicateTemplates48 = new Map();
for (const entry of duplicateTemplates48Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      entry.template !== "registry_pair_attachment" || duplicateTemplates48.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 48 mapping entry");
  }
  duplicateTemplates48.set(entry.name, entry);
}

const duplicateTemplates49Config = JSON.parse(readFileSync(duplicateTemplates49Path, "utf8"));
const duplicateTemplate49Definition = {
  bodySize: 380, instructionCount: 95, count: 2, internalLabels: 5,
  directCalls: 2, indirectCalls: 1, tailBranches: 1, poolSlots: 1,
};
const duplicateTemplates49CommonCalls = [
  { offset: 324, kind: "R_ARM_CALL", symbol: "func_00398FC0" },
];
const duplicateTemplates49IndirectCalls = [
  { offset: 108, target: "selected_object_dispatch_slot_28" },
];
const duplicateTemplates49TailBranches = [
  { offset: 376, kind: "R_ARM_JUMP24", symbol: "func_0014EA68", addend: -4 },
];
const duplicateTemplates49LabelOffsets = [80, 96, 296, 348, 356];
const duplicateTemplates49SlotContract = [
  { offset: 380, loadOffset: 32, kind: "R_ARM_ABS32",
    identity: "duplicate49_shared_registry_identity", sharedAcrossAllExpansions: true },
];
const duplicateTemplates49Expected = [
  { name: "func_00493D18", template: "indexed_halfword_pair_dispatch", helper: "func_0049866C",
    helperCallOffset: 264, anonymousMaterialOffset: 384, nextGlobalOffset: 912 },
  { name: "func_004977B4", template: "indexed_halfword_pair_dispatch", helper: "func_004995CC",
    helperCallOffset: 264, anonymousMaterialOffset: 384, nextGlobalOffset: 912 },
];
if (duplicateTemplates49Config.version !== 1 || duplicateTemplates49Config.mode !== "arm" ||
    duplicateTemplates49Config.source !== "src/main/arm_duplicate_templates_49.S" ||
    duplicateTemplates49Config.expectedBodyBytes !== 760 ||
    JSON.stringify(duplicateTemplates49Config.templates) !== JSON.stringify({
      indexed_halfword_pair_dispatch: duplicateTemplate49Definition,
    }) || JSON.stringify(duplicateTemplates49Config.commonDirectCalls) !==
      JSON.stringify(duplicateTemplates49CommonCalls) ||
    JSON.stringify(duplicateTemplates49Config.indirectCalls) !==
      JSON.stringify(duplicateTemplates49IndirectCalls) ||
    JSON.stringify(duplicateTemplates49Config.tailBranches) !==
      JSON.stringify(duplicateTemplates49TailBranches) ||
    JSON.stringify(duplicateTemplates49Config.internalLabelOffsets) !==
      JSON.stringify(duplicateTemplates49LabelOffsets) ||
    JSON.stringify(duplicateTemplates49Config.slotContract) !==
      JSON.stringify(duplicateTemplates49SlotContract) ||
    JSON.stringify(duplicateTemplates49Config.functions) !== JSON.stringify(duplicateTemplates49Expected)) {
  throw new Error("Unexpected duplicate template 49 positional relocation manifest format");
}
const duplicateTemplates49 = new Map();
for (const entry of duplicateTemplates49Config.functions) {
  if (entry === null || typeof entry !== "object" ||
      Object.keys(entry).sort().join(",") !==
        "anonymousMaterialOffset,helper,helperCallOffset,name,nextGlobalOffset,template" ||
      entry.template !== "indexed_halfword_pair_dispatch" || duplicateTemplates49.has(entry.name)) {
    throw new Error("Invalid or duplicate duplicate-template 49 mapping entry");
  }
  duplicateTemplates49.set(entry.name, entry);
}

const duplicateContainerTemplatesConfig = JSON.parse(
  readFileSync(duplicateContainerTemplatesPath, "utf8")
);
if (duplicateContainerTemplatesConfig.schemaVersion !== 1 ||
    !Array.isArray(duplicateContainerTemplatesConfig.functions) ||
    duplicateContainerTemplatesConfig.functions.length !== 11) {
  throw new Error("Unexpected duplicate container mapping format");
}
const duplicateContainerTemplates = new Map();
const duplicateContainerTemplateCounts = new Map();
let configuredDuplicateContainerBytes = 0;
for (const entry of duplicateContainerTemplatesConfig.functions) {
  const expectedSize = entry?.template === "range_erase_a" ? 320 :
    entry?.template === "range_erase_b" ? 312 :
    entry?.template === "vector_append_4" ? 292 : undefined;
  const isRangeErase = entry?.template === "range_erase_a" || entry?.template === "range_erase_b";
  if (entry === null || typeof entry !== "object" ||
      !/^func_[0-9A-F]{8}$/.test(entry.name) || entry.size !== expectedSize ||
      (isRangeErase && (!/^func_[0-9A-F]{8}$/.test(entry.recycler) ||
        !/^func_[0-9A-F]{8}$/.test(entry.erase))) ||
      (!isRangeErase && (entry.recycler !== undefined || entry.erase !== undefined)) ||
      duplicateContainerTemplates.has(entry.name)) {
    throw new Error("Invalid or duplicate container template mapping entry");
  }
  duplicateContainerTemplates.set(entry.name, entry);
  duplicateContainerTemplateCounts.set(
    entry.template,
    (duplicateContainerTemplateCounts.get(entry.template) ?? 0) + 1
  );
  configuredDuplicateContainerBytes += entry.size;
}
if (configuredDuplicateContainerBytes !== 3412 ||
    duplicateContainerTemplateCounts.get("range_erase_a") !== 5 ||
    duplicateContainerTemplateCounts.get("range_erase_b") !== 3 ||
    duplicateContainerTemplateCounts.get("vector_append_4") !== 3 ||
    duplicateContainerTemplateCounts.size !== 3) {
  throw new Error("Unexpected duplicate container template totals");
}

const runtimeHelpers23Config = JSON.parse(readFileSync(runtimeHelpers23Path, "utf8"));
const runtimeHelpers23Entry = runtimeHelpers23Config.functions?.[0];
if (runtimeHelpers23Config.schemaVersion !== 1 || runtimeHelpers23Config.mode !== "arm" ||
    runtimeHelpers23Config.totalSize !== 252 || runtimeHelpers23Config.bodyEndOffset !== 252 ||
    runtimeHelpers23Config.functions?.length !== 1 || runtimeHelpers23Entry?.name !== "func_002DACF0" ||
    runtimeHelpers23Entry.size !== 252 || runtimeHelpers23Config.adjacentRelocation?.offset !== 252 ||
    runtimeHelpers23Config.adjacentRelocation.type !== "R_ARM_ABS32" ||
    runtimeHelpers23Config.adjacentRelocation.symbol !== "runtime_shift_width_table_23" ||
    runtimeHelpers23Config.tableContract?.identity !== "runtime_shift_width_table_23" ||
    runtimeHelpers23Config.tableContract.minimumAlignment !== 1 ||
    JSON.stringify(runtimeHelpers23Config.tableContract.readableIndexRange) !== "[0,10]" ||
    runtimeHelpers23Config.tableContract.contentsSpecified !== false ||
    runtimeHelpers23Config.tableContract.equality !== "audited-runtime-table") {
  throw new Error("Unexpected ARM runtime helper 23 mapping format");
}
let runtimeHelper23Pending = true;

const runtimeHelpers24Config = JSON.parse(readFileSync(runtimeHelpers24Path, "utf8"));
const runtimeHelpers24Entry = runtimeHelpers24Config.functions?.[0];
const runtimeHelpers24Constant = runtimeHelpers24Config.adjacentConstant;
if (runtimeHelpers24Config.schemaVersion !== 1 || runtimeHelpers24Config.mode !== "arm" ||
    runtimeHelpers24Config.totalSize !== 204 || runtimeHelpers24Config.bodyEndOffset !== 204 ||
    runtimeHelpers24Config.functions?.length !== 1 || runtimeHelpers24Entry?.name !== "func_002DC7A0" ||
    runtimeHelpers24Entry.size !== 204 || runtimeHelpers24Constant?.offset !== 204 ||
    runtimeHelpers24Constant.label !== ".Lcrc32_polynomial_24" || runtimeHelpers24Constant.size !== 4 ||
    runtimeHelpers24Constant.minimumAlignment !== 4 || runtimeHelpers24Constant.value !== "0xEDB88320" ||
    runtimeHelpers24Constant.contract !== "standard-reflected-crc32-polynomial") {
  throw new Error("Unexpected ARM runtime helper 24 mapping format");
}
let runtimeHelper24Pending = true;

const runtimeHelpers25Config = JSON.parse(readFileSync(runtimeHelpers25Path, "utf8"));
const runtimeHelpers25Expected = [
  ["func_002DAC28", 88, [[88, "R_ARM_ABS32", "runtime_descriptor_25"]]],
  ["func_002DAFBC", 48, [[48, "u32", 1812433253], [52, "u32", 1566083941], [56, "R_ARM_ABS32", "runtime_prng_parameter_c_25"]]],
  ["func_002DB1B0", 56, [[56, "f32", 32], [60, "R_ARM_ABS32", "runtime_interpolation_table_25"]]],
];
const runtimeHelpers25Identities = runtimeHelpers25Config.symbolicIdentities;
if (runtimeHelpers25Config.schemaVersion !== 1 || runtimeHelpers25Config.mode !== "arm" ||
    runtimeHelpers25Config.totalBodySize !== 192 || runtimeHelpers25Config.functions?.length !== 3 ||
    runtimeHelpers25Identities === null || typeof runtimeHelpers25Identities !== "object" ||
    Object.keys(runtimeHelpers25Identities).sort().join(",") !== "runtime_descriptor_25,runtime_interpolation_table_25,runtime_prng_parameter_c_25" ||
    runtimeHelpers25Identities.runtime_descriptor_25?.minimumSlotAlignment !== 4 ||
    runtimeHelpers25Identities.runtime_descriptor_25.equality !== "batch-local-distinct" ||
    runtimeHelpers25Identities.runtime_descriptor_25.usage !== "copied-only" ||
    runtimeHelpers25Identities.runtime_prng_parameter_c_25?.minimumSlotAlignment !== 4 ||
    runtimeHelpers25Identities.runtime_prng_parameter_c_25.equality !== "batch-local-distinct" ||
    runtimeHelpers25Identities.runtime_prng_parameter_c_25.usage !== "integer-copied-only" ||
    runtimeHelpers25Identities.runtime_interpolation_table_25?.minimumSlotAlignment !== 4 ||
    runtimeHelpers25Identities.runtime_interpolation_table_25.minimumPointeeAlignment !== 4 ||
    runtimeHelpers25Identities.runtime_interpolation_table_25.equality !== "batch-local-distinct" ||
    runtimeHelpers25Identities.runtime_interpolation_table_25.usage !== "f32-record-reads-at-8n-and-8n-plus-4" ||
    runtimeHelpers25Config.functions.some((entry, index) => {
      const [name, size, words] = runtimeHelpers25Expected[index];
      return entry?.name !== name || entry.size !== size || !Array.isArray(entry.adjacentWords) ||
        JSON.stringify(entry.adjacentWords.map((word) => [word.offset, word.kind, word.symbol ?? word.value])) !== JSON.stringify(words);
    })) {
  throw new Error("Unexpected ARM runtime helper 25 mapping format");
}
const runtimeHelpers25ByName = new Map(runtimeHelpers25Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers25Pending = new Set(runtimeHelpers25ByName.keys());

const runtimeHelpers26Config = JSON.parse(readFileSync(runtimeHelpers26Path, "utf8"));
const runtimeHelpers26Expected = [
  ["func_002DBE58", 28, 16, "runtime_stacked_argument_helper_26"],
  ["func_002DBE74", 80, 24, "runtime_record_expander_26"],
];
const runtimeHelpers26Identities = runtimeHelpers26Config.symbolicIdentities;
if (runtimeHelpers26Config.schemaVersion !== 1 || runtimeHelpers26Config.mode !== "arm" ||
    runtimeHelpers26Config.totalBodySize !== 108 || runtimeHelpers26Config.functions?.length !== 2 ||
    runtimeHelpers26Identities === null || typeof runtimeHelpers26Identities !== "object" ||
    Object.keys(runtimeHelpers26Identities).sort().join(",") !==
      "runtime_record_expander_26,runtime_stacked_argument_helper_26" ||
    runtimeHelpers26Identities.runtime_stacked_argument_helper_26?.mode !== "arm" ||
    runtimeHelpers26Identities.runtime_stacked_argument_helper_26.minimumAlignment !== 4 ||
    runtimeHelpers26Identities.runtime_stacked_argument_helper_26.equality !== "batch-local-distinct" ||
    runtimeHelpers26Identities.runtime_stacked_argument_helper_26.usage !== "stacked-fourth-argument-call" ||
    runtimeHelpers26Identities.runtime_record_expander_26?.mode !== "arm" ||
    runtimeHelpers26Identities.runtime_record_expander_26.minimumAlignment !== 4 ||
    runtimeHelpers26Identities.runtime_record_expander_26.equality !== "batch-local-distinct" ||
    runtimeHelpers26Identities.runtime_record_expander_26.usage !== "record-expansion-call" ||
    runtimeHelpers26Config.functions.some((entry, index) => {
      const [name, size, offset, symbol] = runtimeHelpers26Expected[index];
      return entry?.name !== name || entry.size !== size ||
        JSON.stringify(entry.calls) !== JSON.stringify([{ offset, kind: "R_ARM_CALL", symbol }]) ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 26 mapping format");
}
const runtimeHelpers26ByName = new Map(runtimeHelpers26Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers26Pending = new Set(runtimeHelpers26ByName.keys());

const runtimeHelpers27Config = JSON.parse(readFileSync(runtimeHelpers27Path, "utf8"));
const runtimeHelpers27Expected = [
  ["func_002DF13C", 24, [[24, "runtime_once_flag_27"]]],
  ["func_002DFB0C", 64, [
    [64, "runtime_initializer_value_a_27"],
    [68, "runtime_initializer_value_b_27"],
    [72, "runtime_initializer_value_c_27"],
  ]],
];
const runtimeHelpers27ExpectedIdentities = {
  runtime_once_flag_27: {
    minimumSlotAlignment: 4,
    minimumPointeeAlignment: 4,
    equality: "batch-local-distinct",
    usage: "writable-byte-offset-zero",
  },
  runtime_initializer_value_a_27: {
    minimumSlotAlignment: 4,
    equality: "batch-local-distinct",
    usage: "integer-copied-once-complemented-once",
  },
  runtime_initializer_value_b_27: {
    minimumSlotAlignment: 4,
    equality: "batch-local-distinct",
    usage: "integer-copied-once-complemented-once",
  },
  runtime_initializer_value_c_27: {
    minimumSlotAlignment: 4,
    equality: "batch-local-distinct",
    usage: "integer-copied-once",
  },
};
const runtimeHelpers27Identities = runtimeHelpers27Config.symbolicIdentities;
if (runtimeHelpers27Config.schemaVersion !== 1 || runtimeHelpers27Config.mode !== "arm" ||
    runtimeHelpers27Config.totalBodySize !== 88 || runtimeHelpers27Config.functions?.length !== 2 ||
    JSON.stringify(runtimeHelpers27Identities) !== JSON.stringify(runtimeHelpers27ExpectedIdentities) ||
    runtimeHelpers27Config.functions.some((entry, index) => {
      const [name, size, words] = runtimeHelpers27Expected[index];
      return entry?.name !== name || entry.size !== size ||
        !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
        JSON.stringify(entry.adjacentWords) !== JSON.stringify(
          words.map(([offset, symbol]) => ({ offset, kind: "R_ARM_ABS32", symbol }))
        );
    })) {
  throw new Error("Unexpected ARM runtime helper 27 mapping format");
}
const runtimeHelpers27ByName = new Map(runtimeHelpers27Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers27Pending = new Set(runtimeHelpers27ByName.keys());

const runtimeHelpers29Config = JSON.parse(readFileSync(runtimeHelpers29Path, "utf8"));
const runtimeHelpers29Expected = [
  ["func_002D03B4", 284, []],
  ["func_002DFED0", 80, [{ offset: 12, kind: "R_ARM_CALL", symbol: "runtime_record_prepare_29" }]],
];
const runtimeHelpers29ExpectedIdentities = {
  runtime_record_prepare_29: {
    mode: "arm",
    minimumAlignment: 4,
    equality: "batch-local-unique",
    usage: "original-source-output-preparation-call",
  },
};
if (runtimeHelpers29Config.schemaVersion !== 1 || runtimeHelpers29Config.mode !== "arm" ||
    runtimeHelpers29Config.totalBodySize !== 364 || runtimeHelpers29Config.functions?.length !== 2 ||
    JSON.stringify(runtimeHelpers29Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers29ExpectedIdentities) ||
    runtimeHelpers29Config.functions.some((entry, index) => {
      const [name, size, calls] = runtimeHelpers29Expected[index];
      return entry?.name !== name || entry.size !== size ||
        JSON.stringify(entry.calls) !== JSON.stringify(calls) ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 29 mapping format");
}
const runtimeHelpers29ByName = new Map(runtimeHelpers29Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers29Pending = new Set(runtimeHelpers29ByName.keys());

const runtimeHelpers30Config = JSON.parse(readFileSync(runtimeHelpers30Path, "utf8"));
const runtimeHelpers30Expected = [
  ["func_002E6E14", 12, []],
  ["func_002E6E40", 44, [
    { offset: 32, kind: "R_ARM_CALL", symbol: "runtime_variadic_forward_alpha_30" },
  ]],
  ["func_002E6E8C", 44, [
    { offset: 32, kind: "R_ARM_CALL", symbol: "runtime_variadic_forward_beta_30" },
  ]],
  ["func_002E9A1C", 28, [
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_nonzero_dispatch_30" },
  ]],
  ["func_002EDAEC", 52, [
    { offset: 40, kind: "R_ARM_CALL", symbol: "runtime_stack_record_forward_30" },
  ]],
];
const runtimeHelpers30ExpectedIdentities = {
  runtime_variadic_forward_alpha_30: {
    mode: "thumb", minimumAlignment: 2, equality: "batch-local-unique",
    usage: "bounded-variadic-forward-alpha-call",
  },
  runtime_variadic_forward_beta_30: {
    mode: "thumb", minimumAlignment: 2, equality: "batch-local-unique",
    usage: "bounded-variadic-forward-beta-call",
  },
  runtime_nonzero_dispatch_30: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "nonzero-loaded-value-tail-dispatch",
  },
  runtime_stack_record_forward_30: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "zero-filled-stack-record-call",
  },
};
if (runtimeHelpers30Config.schemaVersion !== 1 || runtimeHelpers30Config.mode !== "arm" ||
    runtimeHelpers30Config.totalBodySize !== 180 || runtimeHelpers30Config.functions?.length !== 5 ||
    JSON.stringify(runtimeHelpers30Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers30ExpectedIdentities) ||
    runtimeHelpers30Config.functions.some((entry, index) => {
      const [name, size, calls] = runtimeHelpers30Expected[index];
      return entry?.name !== name || entry.size !== size ||
        JSON.stringify(entry.calls) !== JSON.stringify(calls) ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 30 mapping format");
}
const runtimeHelpers30ByName = new Map(runtimeHelpers30Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers30Pending = new Set(runtimeHelpers30ByName.keys());

const runtimeHelpers31Config = JSON.parse(readFileSync(runtimeHelpers31Path, "utf8"));
const runtimeHelpers31Expected = [
  ["func_002DDA5C", 36, [
    { offset: 16, kind: "R_ARM_CALL", symbol: "runtime_pair_out_query_31" },
    { offset: 24, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DDBAC", 28, [
    { offset: 4, kind: "R_ARM_CALL", symbol: "runtime_zero_arg_query_alpha_31" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DDBC8", 28, [
    { offset: 4, kind: "R_ARM_CALL", symbol: "runtime_zero_arg_query_beta_31" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DE3CC", 36, [
    { offset: 12, kind: "R_ARM_CALL", symbol: "runtime_five_arg_query_31" },
    { offset: 28, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DEEEC", 32, [
    { offset: 12, kind: "R_ARM_CALL", symbol: "runtime_signed_byte_query_31" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
];
const runtimeHelpers31ExpectedIdentities = {
  runtime_pair_out_query_31: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "word-output-pair-query-call",
  },
  runtime_zero_arg_query_alpha_31: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity",
    usage: "zero-argument-status-alpha-call",
  },
  runtime_zero_arg_query_beta_31: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity",
    usage: "zero-argument-status-beta-call",
  },
  runtime_five_arg_query_31: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "five-argument-status-call",
  },
  runtime_signed_byte_query_31: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique",
    usage: "signed-byte-output-query-call",
  },
  runtime_failure_raise_entry_31: {
    mode: "arm", minimumAlignment: 4, equality: "shared-five-site-identity",
    usage: "failure-linked-or-tail-transfer",
  },
};
if (runtimeHelpers31Config.schemaVersion !== 1 || runtimeHelpers31Config.mode !== "arm" ||
    runtimeHelpers31Config.totalBodySize !== 160 || runtimeHelpers31Config.functions?.length !== 5 ||
    JSON.stringify(runtimeHelpers31Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers31ExpectedIdentities) ||
    runtimeHelpers31Config.functions.some((entry, index) => {
      const [name, size, calls] = runtimeHelpers31Expected[index];
      return entry?.name !== name || entry.size !== size ||
        JSON.stringify(entry.calls) !== JSON.stringify(calls) ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 31 mapping format");
}
const runtimeHelpers31ByName = new Map(runtimeHelpers31Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers31Pending = new Set(runtimeHelpers31ByName.keys());

const runtimeHelpers32Config = JSON.parse(readFileSync(runtimeHelpers32Path, "utf8"));
const runtimeHelpers32Expected = [
  ["func_002DD8FC", 52, [
    { offset: 12, kind: "R_ARM_CALL", symbol: "runtime_guard_enter_32" },
    { offset: 28, kind: "R_ARM_CALL", symbol: "runtime_guarded_operation_32" },
    { offset: 36, kind: "R_ARM_CALL", symbol: "runtime_guard_leave_32" },
  ]],
  ["func_002DD9C4", 56, [
    { offset: 44, kind: "R_ARM_CALL", symbol: "runtime_aligned_word_forward_32" },
  ]],
  ["func_002DDE18", 28, [
    { offset: 4, kind: "R_ARM_CALL", symbol: "runtime_zero_arg_query_gamma_32" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DE38C", 64, [
    { offset: 20, kind: "R_ARM_CALL", symbol: "runtime_resource_acquire_alpha_32" },
    { offset: 28, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002DE490", 64, [
    { offset: 20, kind: "R_ARM_CALL", symbol: "runtime_resource_acquire_beta_32" },
    { offset: 28, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
  ["func_002E0B9C", 68, [
    { offset: 12, kind: "R_ARM_CALL", symbol: "runtime_sequence_begin_32" },
    { offset: 20, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
    { offset: 32, kind: "R_ARM_CALL", symbol: "runtime_sequence_apply_32" },
    { offset: 40, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
    { offset: 44, kind: "R_ARM_CALL", symbol: "runtime_sequence_finish_32" },
    { offset: 60, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
  ]],
];
const runtimeHelpers32ExpectedIdentities = {
  runtime_guard_enter_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "guard-enter-call",
  },
  runtime_guarded_operation_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "guarded-operation-call",
  },
  runtime_guard_leave_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "guard-leave-call",
  },
  runtime_aligned_word_forward_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "aligned-stacked-word-forward-call",
  },
  runtime_zero_arg_query_gamma_32: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity", usage: "zero-argument-status-gamma-call",
  },
  runtime_resource_acquire_alpha_32: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity", usage: "resource-acquire-alpha-call",
  },
  runtime_resource_acquire_beta_32: {
    mode: "arm", minimumAlignment: 4, equality: "distinct-operation-identity", usage: "resource-acquire-beta-call",
  },
  runtime_sequence_begin_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "sequence-begin-call",
  },
  runtime_sequence_apply_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "sequence-apply-call",
  },
  runtime_sequence_finish_32: {
    mode: "arm", minimumAlignment: 4, equality: "batch-local-unique", usage: "sequence-finish-call",
  },
  runtime_failure_raise_entry_31: {
    mode: "arm", minimumAlignment: 4, equality: "shared-runtime-31-failure-identity",
    usage: "failure-linked-or-tail-transfer",
  },
};
if (runtimeHelpers32Config.schemaVersion !== 1 || runtimeHelpers32Config.mode !== "arm" ||
    runtimeHelpers32Config.totalBodySize !== 332 || runtimeHelpers32Config.functions?.length !== 6 ||
    JSON.stringify(runtimeHelpers32Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers32ExpectedIdentities) ||
    runtimeHelpers32Config.functions.some((entry, index) => {
      const [name, size, calls] = runtimeHelpers32Expected[index];
      return entry?.name !== name || entry.size !== size ||
        JSON.stringify(entry.calls) !== JSON.stringify(calls) ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 32 mapping format");
}
const runtimeHelpers32ByName = new Map(runtimeHelpers32Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers32Pending = new Set(runtimeHelpers32ByName.keys());

const runtimeHelpers33Config = JSON.parse(readFileSync(runtimeHelpers33Path, "utf8"));
const runtimeHelpers33Pairs = [
  ["func_002DDAA4", "func_002DE630"],
  ["func_002DDB28", "func_002DE678"],
  ["func_002DDC20", "func_002DE744"],
  ["func_002DDCA4", "func_002DE78C"],
  ["func_002DDD94", "func_002DE83C"],
  ["func_002DDFA8", "func_002DE8F0"],
  ["func_002DE02C", "func_002DE938"],
  ["func_002DE0B0", "func_002DE980"],
  ["func_002DE1E4", "func_002DEB2C"],
  ["func_002DE268", "func_002DEB74"],
];
const runtimeHelpers33ExpectedWords = [
  { offset: 124, kind: "R_ARM_ABS32", symbol: "runtime_retry_exhausted_status_33" },
  { offset: 128, kind: "R_ARM_ABS32", symbol: "service_query_accepted_status_31" },
];
const runtimeHelpers33ExpectedIdentities = {
  operations: Object.fromEntries(runtimeHelpers33Pairs.map(([, operation]) => [operation, {
    mode: "arm", minimumAlignment: 4, equality: "pairwise-distinct",
  }])),
  runtime_failure_raise_entry_31: {
    mode: "arm", minimumAlignment: 4, equality: "shared-runtime-31-failure-identity",
  },
  runtime_retry_exhausted_status_33: {
    minimumSlotAlignment: 4, equality: "shared-ten-site-distinct-status",
  },
  service_query_accepted_status_31: {
    minimumSlotAlignment: 4, equality: "shared-ten-site-and-ipc31-query-status",
    distinctFrom: "service_open_accepted_status_31",
  },
};
if (runtimeHelpers33Config.schemaVersion !== 1 || runtimeHelpers33Config.mode !== "arm" ||
    runtimeHelpers33Config.totalBodySize !== 1240 || runtimeHelpers33Config.functions?.length !== 10 ||
    JSON.stringify(runtimeHelpers33Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers33ExpectedIdentities) ||
    runtimeHelpers33Config.functions.some((entry, index) => {
      const [name, operation] = runtimeHelpers33Pairs[index];
      const calls = [
        { offset: 36, kind: "R_ARM_CALL", symbol: operation },
        { offset: 84, kind: "R_ARM_JUMP24", symbol: "runtime_failure_raise_entry_31" },
      ];
      return entry?.name !== name || entry.size !== 124 ||
        JSON.stringify(entry.calls) !== JSON.stringify(calls) ||
        JSON.stringify(entry.adjacentWords) !== JSON.stringify(runtimeHelpers33ExpectedWords);
    })) {
  throw new Error("Unexpected ARM runtime helper 33 mapping format");
}
const runtimeHelpers33ByName = new Map(runtimeHelpers33Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers33Pending = new Set(runtimeHelpers33ByName.keys());

const runtimeHelpers34Config = JSON.parse(readFileSync(runtimeHelpers34Path, "utf8"));
const runtimeHelpers34Expected = [
  ["func_002E173C", 72], ["func_002F32AC", 36], ["func_002F3950", 60],
  ["func_002F398C", 72], ["func_002F78F0", 12], ["func_002FCE50", 16],
  ["func_002FF7C0", 44], ["func_002FFBE0", 24],
];
if (runtimeHelpers34Config.schemaVersion !== 1 || runtimeHelpers34Config.mode !== "arm" ||
    runtimeHelpers34Config.totalBodySize !== 336 || runtimeHelpers34Config.functions?.length !== 8 ||
    JSON.stringify(runtimeHelpers34Config.symbolicIdentities) !== "{}" ||
    runtimeHelpers34Config.functions.some((entry, index) => {
      const [name, size] = runtimeHelpers34Expected[index];
      return entry?.name !== name || entry.size !== size ||
        !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 34 mapping format");
}
const runtimeHelpers34ByName = new Map(runtimeHelpers34Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers34Pending = new Set(runtimeHelpers34ByName.keys());

const runtimeHelpers36Config = JSON.parse(readFileSync(runtimeHelpers36Path, "utf8"));
const runtimeHelpers36Expected = [
  ["func_002F39D4", 116], ["func_002F3ED8", 140], ["func_002F9230", 128],
  ["func_002FF24C", 152], ["func_0030F584", 148],
];
if (runtimeHelpers36Config.schemaVersion !== 1 || runtimeHelpers36Config.mode !== "arm" ||
    runtimeHelpers36Config.totalBodySize !== 684 || runtimeHelpers36Config.functions?.length !== 5 ||
    JSON.stringify(runtimeHelpers36Config.symbolicIdentities) !== "{}" ||
    runtimeHelpers36Config.functions.some((entry, index) => {
      const [name, size] = runtimeHelpers36Expected[index];
      return entry?.name !== name || entry.size !== size ||
        !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 36 mapping format");
}
const runtimeHelpers36ByName = new Map(runtimeHelpers36Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers36Pending = new Set(runtimeHelpers36ByName.keys());

const runtimeHelpers37Config = JSON.parse(readFileSync(runtimeHelpers37Path, "utf8"));
const runtimeHelpers37Expected = [
  ["func_00312F30", 64], ["func_00312F70", 132], ["func_003158B4", 56],
  ["func_0031C05C", 164], ["func_0031D8D0", 132],
];
if (runtimeHelpers37Config.schemaVersion !== 1 || runtimeHelpers37Config.mode !== "arm" ||
    runtimeHelpers37Config.totalBodySize !== 548 || runtimeHelpers37Config.functions?.length !== 5 ||
    JSON.stringify(runtimeHelpers37Config.symbolicIdentities) !== "{}" ||
    runtimeHelpers37Config.functions.some((entry, index) => {
      const [name, size] = runtimeHelpers37Expected[index];
      return entry?.name !== name || entry.size !== size ||
        !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
        !Array.isArray(entry.adjacentWords) || entry.adjacentWords.length !== 0;
    })) {
  throw new Error("Unexpected ARM runtime helper 37 mapping format");
}
const runtimeHelpers37ByName = new Map(runtimeHelpers37Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers37Pending = new Set(runtimeHelpers37ByName.keys());

const runtimeHelpers38Config = JSON.parse(readFileSync(runtimeHelpers38Path, "utf8"));
const runtimeHelpers38Expected = [
  ["func_0031DC98", 48, [[48, "runtime_halfword_fill_38"]]],
  ["func_0031E680", 56, []],
  ["func_0031E6B8", 60, []],
  ["func_0031E6F8", 104, [[104, "runtime_float_zero_38"], [108, "runtime_float_unit_38"]]],
  ["func_0031EE40", 152, [[152, "runtime_float_zero_38"], [156, "runtime_float_unit_38"]]],
  ["func_0031F044", 84, [[84, "runtime_float_zero_38"], [88, "runtime_float_unit_38"]]],
];
const runtimeHelpers38ExpectedIdentities = {
  runtime_halfword_fill_38: {
    minimumSlotAlignment: 4, equality: "singleton-distinct", usage: "low-halfword-counted-fill",
  },
  runtime_float_zero_38: {
    minimumSlotAlignment: 4, equality: "shared-three-site-distinct-zero",
    usage: "vfp-single-additive-zero-and-equality-operand",
  },
  runtime_float_unit_38: {
    minimumSlotAlignment: 4, equality: "shared-three-site-distinct-unit",
    usage: "vfp-single-multiplicative-unit",
  },
};
if (runtimeHelpers38Config.schemaVersion !== 1 || runtimeHelpers38Config.mode !== "arm" ||
    runtimeHelpers38Config.totalBodySize !== 504 || runtimeHelpers38Config.functions?.length !== 6 ||
    JSON.stringify(runtimeHelpers38Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers38ExpectedIdentities) ||
    runtimeHelpers38Config.functions.some((entry, index) => {
      const [name, size, words] = runtimeHelpers38Expected[index];
      const adjacentWords = words.map(([offset, symbol]) => ({ offset, kind: "R_ARM_ABS32", symbol }));
      return entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) || entry.calls.length !== 0 ||
        JSON.stringify(entry.adjacentWords) !== JSON.stringify(adjacentWords);
    })) {
  throw new Error("Unexpected ARM runtime helper 38 mapping format");
}
const runtimeHelpers38ByName = new Map(runtimeHelpers38Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers38Pending = new Set(runtimeHelpers38ByName.keys());

const runtimeHelpers41Config = JSON.parse(readFileSync(runtimeHelpers41Path, "utf8"));
const runtimeHelpers41Expected = [
  ["func_004C58DC", 180], ["func_004D0014", 124], ["func_004D42C8", 156],
  ["func_004E41C8", 116], ["func_004E9FA8", 100], ["func_004EAC54", 132],
  ["func_004F4C90", 144], ["func_00505F2C", 128], ["func_0052B610", 112],
  ["func_0052B680", 100], ["func_0053F700", 120], ["func_0056B030", 144],
  ["func_0056E0BC", 160],
];
const runtimeHelpers41SlotIdentity = "blend_lower_endpoint_threshold_41";
const runtimeHelpers41ExpectedIdentities = {
  [runtimeHelpers41SlotIdentity]: {
    minimumSlotAlignment: 4,
    equality: "singleton-distinct",
    usage: "vfp-single-lower-endpoint-selection-threshold",
  },
};
if (runtimeHelpers41Config.schemaVersion !== 1 || runtimeHelpers41Config.mode !== "arm" ||
    runtimeHelpers41Config.totalBodySize !== 1716 || runtimeHelpers41Config.functions?.length !== 13 ||
    JSON.stringify(runtimeHelpers41Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers41ExpectedIdentities) ||
    runtimeHelpers41Config.functions.some((entry, index) => {
      const [name, size] = runtimeHelpers41Expected[index];
      const words = name === "func_0056B030"
        ? [{ offset: 144, kind: "R_ARM_ABS32", symbol: runtimeHelpers41SlotIdentity }]
        : [];
      return entry?.name !== name || entry.size !== size || !Array.isArray(entry.calls) ||
        entry.calls.length !== 0 || JSON.stringify(entry.adjacentWords) !== JSON.stringify(words);
    })) {
  throw new Error("Unexpected ARM runtime helper 41 mapping format");
}
const runtimeHelpers41ByName = new Map(runtimeHelpers41Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers41Pending = new Set(runtimeHelpers41ByName.keys());

const runtimeHelpers43Config = JSON.parse(readFileSync(runtimeHelpers43Path, "utf8"));
const runtimeHelpers43Expected = [
  ["func_004EA6F8", 16, []], ["func_004EA794", 12, []],
  ["func_004EA7A0", 16, [[12, "R_ARM_JUMP24", "runtime_embedded_payload_transfer_43"]]],
  ["func_004EA7C4", 16, []], ["func_004EA7F8", 16, []],
  ["func_004EA810", 16, []], ["func_004EA820", 20, []],
  ["func_004EA834", 36, [[32, "R_ARM_JUMP24", "runtime_fixed_13_byte_copy_43"]]],
  ["func_004EA858", 36, []],
  ["func_004EA87C", 16, [[12, "R_ARM_JUMP24", "runtime_embedded_payload_transfer_43"]]],
  ["func_004EA89C", 20, [[16, "R_ARM_JUMP24", "runtime_embedded_payload_transfer_43"]]],
  ["func_004EA8EC", 16, []], ["func_004EA924", 16, []], ["func_004EA940", 24, []],
  ["func_004EA958", 32, [[20, "R_ARM_CALL", "runtime_fixed_368_byte_copy_43"]]],
  ["func_004EA998", 12, []],
];
const runtimeHelpers43ExpectedIdentities = {
  runtime_embedded_payload_transfer_43: { mode: "arm", minimumAlignment: 4, equality: "shared-three-site-identity", usage: "embedded-payload-tail-transfer" },
  runtime_fixed_13_byte_copy_43: { mode: "arm", minimumAlignment: 4, equality: "batch-local-distinct", usage: "fixed-13-byte-copy-tail-transfer" },
  runtime_fixed_368_byte_copy_43: { mode: "arm", minimumAlignment: 4, equality: "batch-local-distinct", usage: "fixed-368-byte-copy-call" },
};
if (runtimeHelpers43Config.schemaVersion !== 1 || runtimeHelpers43Config.mode !== "arm" ||
    runtimeHelpers43Config.totalBodySize !== 320 || runtimeHelpers43Config.functions?.length !== 16 ||
    JSON.stringify(runtimeHelpers43Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers43ExpectedIdentities) ||
    runtimeHelpers43Config.functions.some((entry, index) => {
      const [name, size, calls] = runtimeHelpers43Expected[index];
      return entry?.name !== name || entry.size !== size || JSON.stringify(entry.calls) !==
        JSON.stringify(calls.map(([offset, kind, symbol]) => ({ offset, kind, symbol }))) ||
        JSON.stringify(entry.adjacentWords) !== "[]";
    })) {
  throw new Error("Unexpected ARM runtime helper 43 mapping format");
}
const runtimeHelpers43ByName = new Map(runtimeHelpers43Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers43Pending = new Set(runtimeHelpers43ByName.keys());

const runtimeHelpers44Config = JSON.parse(readFileSync(runtimeHelpers44Path, "utf8"));
const runtimeHelpers44Expected = [
  ["func_004EAE00", 16, [], []], ["func_004EAE18", 20, [], []],
  ["func_004F2BC8", 16, [[8, "R_ARM_CALL", "runtime_stack_output_call_44"]], []],
  ["func_004F2C20", 16, [], []], ["func_004F2C40", 24, [], []],
  ["func_004F2C58", 24, [], []], ["func_004F2C70", 24, [], []],
  ["func_004F4F34", 28, [[20, "R_ARM_JUMP24", "runtime_conditional_transfer_44"]], []],
  ["func_00502E20", 44, [], [[44, "opaque_runtime_root_slot_44_a"]]],
  ["func_00506E0C", 20, [[8, "R_ARM_CALL", "runtime_double_transform_44"]], []],
  ["func_00509D48", 40, [], []],
  ["func_0050A61C", 24, [], [[24, "opaque_runtime_root_slot_44_b"]]],
  ["func_0050BCB4", 8, [[4, "R_ARM_JUMP24", "runtime_flagged_tail_44"]], []],
  ["func_0050DC38", 40, [[24, "R_ARM_CALL", "runtime_conditional_release_44"]], []],
  ["func_0050DC60", 32, [[24, "R_ARM_JUMP24", "runtime_zero_count_tail_44"]], []],
  ["func_0050DD10", 16, [], []], ["func_0050DD20", 36, [], []],
  ["func_0050DD44", 12, [[8, "R_ARM_JUMP24", "runtime_zero_pair_tail_44"]], []],
];
const runtimeHelpers44ExpectedIdentities = {
  runtime_stack_output_call_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_004F2BD8", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "stack-output-call" },
  runtime_conditional_transfer_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_00300B28", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "conditional-tail-transfer" },
  runtime_double_transform_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_004F3510", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "double-register-transform-call" },
  runtime_flagged_tail_44: { mode: "arm", minimumAlignment: 4, entryKind: "secondary", targetSymbol: "func_005095B0", targetOffset: 8, targetVisibility: "no-standalone-symbol", equality: "batch-local-distinct", usage: "fixed-flag-tail-transfer" },
  runtime_conditional_release_44: { mode: "arm", minimumAlignment: 4, entryKind: "primary", targetSymbol: "func_001241A0", targetOffset: 0, targetVisibility: "global-function", equality: "batch-local-distinct", usage: "conditional-release-call" },
  runtime_zero_count_tail_44: { mode: "arm", minimumAlignment: 4, entryKind: "secondary", targetSymbol: "func_00132A14", targetOffset: 100, targetVisibility: "no-standalone-symbol", equality: "batch-local-distinct", usage: "zero-count-tail-transfer" },
  runtime_zero_pair_tail_44: { mode: "arm", minimumAlignment: 4, entryKind: "secondary", targetSymbol: "func_00123D60", targetOffset: 12, targetVisibility: "no-standalone-symbol", equality: "batch-local-distinct", usage: "zero-pair-tail-transfer" },
};
const runtimeHelpers44ExpectedBranchContract = {
  mode: "arm",
  minimumAlignment: 4,
  primaryEntries: ["runtime_stack_output_call_44", "runtime_conditional_transfer_44", "runtime_double_transform_44", "runtime_conditional_release_44"],
  secondaryEntries: ["runtime_flagged_tail_44", "runtime_zero_count_tail_44", "runtime_zero_pair_tail_44"],
  singletonClasses: Object.keys(runtimeHelpers44ExpectedIdentities),
};
const runtimeHelpers44ExpectedSlots = {
  opaque_runtime_root_slot_44_a: { segment: "data", minimumAlignment: 4, equality: "distinct-from-slot-b", usage: "indexed-runtime-root" },
  opaque_runtime_root_slot_44_b: { segment: "data", minimumAlignment: 4, equality: "distinct-from-slot-a", usage: "runtime-state-root" },
};
if (runtimeHelpers44Config.schemaVersion !== 1 || runtimeHelpers44Config.mode !== "arm" ||
    runtimeHelpers44Config.totalBodySize !== 440 || runtimeHelpers44Config.functions?.length !== 18 ||
    JSON.stringify(runtimeHelpers44Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers44ExpectedIdentities) ||
    JSON.stringify(runtimeHelpers44Config.branchIdentityContract) !== JSON.stringify(runtimeHelpers44ExpectedBranchContract) ||
    JSON.stringify(runtimeHelpers44Config.symbolicSlots) !== JSON.stringify(runtimeHelpers44ExpectedSlots) ||
    runtimeHelpers44Config.functions.some((entry, index) => {
      const [name, size, calls, words] = runtimeHelpers44Expected[index];
      return entry?.name !== name || entry.size !== size ||
        JSON.stringify(entry.calls) !== JSON.stringify(calls.map(([offset, kind, symbol]) => ({ offset, kind, symbol }))) ||
        JSON.stringify(entry.adjacentWords) !== JSON.stringify(words.map(([offset, symbol]) => ({ offset, kind: "R_ARM_ABS32", symbol })));
    })) {
  throw new Error("Unexpected ARM runtime helper 44 mapping format");
}
const runtimeHelpers44ByName = new Map(runtimeHelpers44Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers44Pending = new Set(runtimeHelpers44ByName.keys());

const runtimeHelpers46Config = JSON.parse(readFileSync(runtimeHelpers46Path, "utf8"));
const runtimeHelpers46Expected = [
  ["func_004E43FC", 44, []], ["func_004E4430", 16, []],
  ["func_004E4670", 60, [[60, "runtime_curve_coefficient_a_46"], [64, "runtime_curve_coefficient_b_46"], [68, "runtime_curve_coefficient_c_46"]]],
  ["func_004E46B8", 52, [[52, "runtime_curve_coefficient_c_46"], [56, "runtime_curve_coefficient_a_46"], [60, "runtime_curve_coefficient_b_46"]]],
  ["func_004E6014", 24, []], ["func_004E6064", 20, []],
  ["func_004E6084", 24, []], ["func_004E68C4", 28, []],
  ["func_004E6FA0", 20, []], ["func_004E7F90", 36, []],
  ["func_004E82C4", 44, []], ["func_004E8384", 60, []],
  ["func_004E8D38", 20, []], ["func_004E8D68", 28, []],
  ["func_004E9E5C", 40, []], ["func_004E9F98", 16, []],
  ["func_004EA03C", 28, []], ["func_00520DDC", 20, []],
  ["func_0053FC5C", 20, []], ["func_005406DC", 40, []],
];
const runtimeHelpers46ExpectedIdentities = {
  runtime_curve_coefficient_a_46: { minimumSlotAlignment: 4, equality: "shared-two-site-pairwise-distinct-a", usage: "vfp-single-curve-coefficient" },
  runtime_curve_coefficient_b_46: { minimumSlotAlignment: 4, equality: "shared-two-site-pairwise-distinct-b", usage: "vfp-single-curve-coefficient" },
  runtime_curve_coefficient_c_46: { minimumSlotAlignment: 4, equality: "shared-two-site-pairwise-distinct-c", usage: "vfp-single-curve-coefficient" },
};
if (runtimeHelpers46Config.schemaVersion !== 1 || runtimeHelpers46Config.mode !== "arm" ||
    runtimeHelpers46Config.totalBodySize !== 640 || runtimeHelpers46Config.functions?.length !== 20 ||
    JSON.stringify(runtimeHelpers46Config.symbolicIdentities) !== JSON.stringify(runtimeHelpers46ExpectedIdentities) ||
    JSON.stringify(runtimeHelpers46Config.symbolicSlots) !== "{}" ||
    runtimeHelpers46Config.functions.some((entry, index) => {
      const [name, size, words] = runtimeHelpers46Expected[index];
      return entry?.name !== name || entry.size !== size || JSON.stringify(entry.calls) !== "[]" ||
        JSON.stringify(entry.adjacentWords) !== JSON.stringify(
          words.map(([offset, symbol]) => ({ offset, kind: "R_ARM_ABS32", symbol }))
        );
    })) {
  throw new Error("Unexpected ARM runtime helper 46 mapping format");
}
const runtimeHelpers46ByName = new Map(runtimeHelpers46Config.functions.map((entry) => [entry.name, entry]));
const runtimeHelpers46Pending = new Set(runtimeHelpers46ByName.keys());

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
const runtimeHelper23Inventory = functionsByName.get(runtimeHelpers23Entry.name);
if (runtimeHelper23Inventory?.mode !== "$a" || runtimeHelper23Inventory.size !== runtimeHelpers23Entry.size) {
  throw new Error("ARM runtime helper 23 is missing from the function inventory");
}
const runtimeHelper23Offset = runtimeHelper23Inventory.address - textStart;
const runtimeHelper23SlotStart = runtimeHelper23Inventory.address + runtimeHelper23Inventory.size;
const runtimeHelper23SlotEnd = runtimeHelper23SlotStart + 4;
if (runtimeHelper23SlotStart % 4 !== 0 || runtimeHelper23Offset < 0 ||
    runtimeHelper23Offset + runtimeHelper23Inventory.size + 4 > code.length ||
    functions.some((candidate) => candidate.address < runtimeHelper23SlotEnd &&
      candidate.address + candidate.size > runtimeHelper23SlotStart)) {
  throw new Error("ARM runtime helper 23 has an invalid adjacent table slot");
}
const runtimeHelper23TableWord = code.readUInt32LE(runtimeHelper23Offset + runtimeHelper23Inventory.size);
if (![...targetSegments.values()].some((segment) =>
  runtimeHelper23TableWord >= segment.address && runtimeHelper23TableWord + 11 <= segment.address + segment.size)) {
  throw new Error("ARM runtime helper 23 table does not cover audited indices 0 through 10");
}
const runtimeHelper24Inventory = functionsByName.get(runtimeHelpers24Entry.name);
if (runtimeHelper24Inventory?.mode !== "$a" || runtimeHelper24Inventory.size !== runtimeHelpers24Entry.size) {
  throw new Error("ARM runtime helper 24 is missing from the function inventory");
}
const runtimeHelper24Offset = runtimeHelper24Inventory.address - textStart;
const runtimeHelper24SlotStart = runtimeHelper24Inventory.address + runtimeHelper24Inventory.size;
const runtimeHelper24SlotEnd = runtimeHelper24SlotStart + runtimeHelpers24Constant.size;
if (runtimeHelper24SlotStart % runtimeHelpers24Constant.minimumAlignment !== 0 || runtimeHelper24Offset < 0 ||
    runtimeHelper24Offset + runtimeHelper24Inventory.size + runtimeHelpers24Constant.size > code.length ||
    functions.some((candidate) => candidate.address < runtimeHelper24SlotEnd &&
      candidate.address + candidate.size > runtimeHelper24SlotStart)) {
  throw new Error("ARM runtime helper 24 has an invalid adjacent polynomial slot");
}
if (code.readUInt32LE(runtimeHelper24Offset + runtimeHelper24Inventory.size) !== 0xEDB88320) {
  throw new Error("ARM runtime helper 24 has an unexpected adjacent polynomial value");
}
const runtimeHelper25PrivateWords = new Map();
for (const mapping of runtimeHelpers25Config.functions) {
  const inventory = functionsByName.get(mapping.name);
  if (inventory?.mode !== "$a" || inventory.size !== mapping.size) {
    throw new Error(`ARM runtime helper 25 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = inventory.address - textStart;
  const slotStart = inventory.address + mapping.size;
  const slotEnd = inventory.address + mapping.adjacentWords.at(-1).offset + 4;
  if (slotStart % 4 !== 0 || offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd && candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 25 function ${mapping.name} has invalid adjacent words`);
  }
  for (const word of mapping.adjacentWords) {
    const privateWord = code.readUInt32LE(offset + word.offset);
    if (word.kind === "R_ARM_ABS32") {
      runtimeHelper25PrivateWords.set(word.symbol, privateWord);
    } else {
      const expected = word.kind === "f32" ? 0x42000000 : word.value;
      if (privateWord !== expected) {
        throw new Error(`ARM runtime helper 25 function ${mapping.name} has an unexpected public adjacent word`);
      }
    }
  }
}
if (runtimeHelper25PrivateWords.size !== 3 || new Set(runtimeHelper25PrivateWords.values()).size !== 3) {
  throw new Error("ARM runtime helper 25 opaque identities do not have the documented distinct equality classes");
}
if (runtimeHelper25PrivateWords.get("runtime_interpolation_table_25") %
    runtimeHelpers25Identities.runtime_interpolation_table_25.minimumPointeeAlignment !== 0) {
  throw new Error("ARM runtime helper 25 interpolation table does not meet its documented alignment");
}
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

function isArmCallTo(instruction, instructionAddress, destinationAddress) {
  if ((instruction >>> 24) !== 0xeb) return false;
  let displacement = instruction & 0x00ffffff;
  if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
  return instructionAddress + 8 + displacement * 4 === destinationAddress;
}

function isArmJumpTo(instruction, instructionAddress, destinationAddress) {
  if ((instruction >>> 24) !== 0xea) return false;
  let displacement = instruction & 0x00ffffff;
  if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
  return instructionAddress + 8 + displacement * 4 === destinationAddress;
}

function isArmBlxImmediateTo(instruction, instructionAddress, destinationAddress) {
  if (((instruction & 0xfe000000) >>> 0) !== 0xfa000000) return false;
  let displacement = (((instruction & 0x00ffffff) << 2) | ((instruction >>> 23) & 2)) >>> 0;
  if ((displacement & 0x02000000) !== 0) displacement -= 0x04000000;
  return instructionAddress + 8 + displacement === destinationAddress;
}

const runtimeHelper43Destinations = new Map();
const runtimeHelper43SiteCounts = new Map();
for (const mapping of runtimeHelpers43Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 43 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM runtime helper 43 function ${mapping.name} has an out-of-bounds body`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = instructionAddress + 8 + displacement * 4;
    const contract = runtimeHelpers43Config.symbolicIdentities[call.symbol];
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    const validBranch = call.kind === "R_ARM_CALL"
      ? isArmCallTo(instruction, instructionAddress, destination)
      : call.kind === "R_ARM_JUMP24" && isArmJumpTo(instruction, instructionAddress, destination);
    const previous = runtimeHelper43Destinations.get(call.symbol);
    if (!contract || contract.mode !== "arm" || destination % contract.minimumAlignment !== 0 ||
        destinationEntry?.mode !== "$a" || !validBranch || (previous !== undefined && previous !== destination)) {
      throw new Error(`ARM runtime helper 43 branch identity ${call.symbol} has an invalid form, mode, or equality`);
    }
    runtimeHelper43Destinations.set(call.symbol, destination);
    runtimeHelper43SiteCounts.set(call.symbol, (runtimeHelper43SiteCounts.get(call.symbol) ?? 0) + 1);
  }
}
if (runtimeHelper43Destinations.size !== 3 ||
    runtimeHelper43SiteCounts.get("runtime_embedded_payload_transfer_43") !== 3 ||
    runtimeHelper43SiteCounts.get("runtime_fixed_13_byte_copy_43") !== 1 ||
    runtimeHelper43SiteCounts.get("runtime_fixed_368_byte_copy_43") !== 1 ||
    new Set(runtimeHelper43Destinations.values()).size !== 3) {
  throw new Error("ARM runtime helper 43 branches do not satisfy the documented equality classes");
}

const runtimeHelper44Destinations = new Map();
const runtimeHelper44PrivateWords = new Map();
for (const mapping of runtimeHelpers44Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 44 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const extent = mapping.size + (mapping.adjacentWords.length ? 4 : 0);
  const slotStart = entry.address + mapping.size;
  const slotEnd = entry.address + extent;
  if (offset < 0 || offset + extent > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 44 function ${mapping.name} has an out-of-bounds body or slot`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = instructionAddress + 8 + displacement * 4;
    const contract = runtimeHelpers44Config.symbolicIdentities[call.symbol];
    const targetEntry = functionsByName.get(contract?.targetSymbol);
    const standaloneEntry = functions.find((candidate) => candidate.address === destination);
    const validBranch = call.kind === "R_ARM_CALL"
      ? isArmCallTo(instruction, instructionAddress, destination)
      : call.kind === "R_ARM_JUMP24" && isArmJumpTo(instruction, instructionAddress, destination);
    const validPrimary = contract?.entryKind === "primary" && contract.targetOffset === 0 &&
      contract.targetVisibility === "global-function" && targetEntry?.mode === "$a" &&
      targetEntry.address === destination && standaloneEntry === targetEntry;
    const validSecondary = contract?.entryKind === "secondary" && contract.targetOffset > 0 &&
      contract.targetVisibility === "no-standalone-symbol" && targetEntry?.mode === "$a" &&
      contract.targetOffset < targetEntry.size && targetEntry.address + contract.targetOffset === destination &&
      standaloneEntry === undefined;
    if (!contract || contract.mode !== "arm" || destination % contract.minimumAlignment !== 0 ||
        !validBranch || (!validPrimary && !validSecondary) || runtimeHelper44Destinations.has(call.symbol)) {
      throw new Error(`ARM runtime helper 44 branch identity ${call.symbol} has an invalid form, mode, or entry relation`);
    }
    runtimeHelper44Destinations.set(call.symbol, destination);
  }
  for (const word of mapping.adjacentWords) {
    const contract = runtimeHelpers44Config.symbolicSlots[word.symbol];
    const slotAddress = entry.address + word.offset;
    const value = code.readUInt32LE(offset + word.offset);
    const dataSegment = targetSegments.get(contract?.segment);
    if (!contract || contract.segment !== "data" || word.kind !== "R_ARM_ABS32" ||
        slotAddress % 4 !== 0 || value % contract.minimumAlignment !== 0 ||
        !dataSegment || value < dataSegment.address || value >= dataSegment.address + dataSegment.size ||
        runtimeHelper44PrivateWords.has(word.symbol)) {
      throw new Error(`ARM runtime helper 44 opaque slot ${word.symbol} has an invalid form or alignment`);
    }
    runtimeHelper44PrivateWords.set(word.symbol, value);
  }
}
if (runtimeHelper44Destinations.size !== 7 || new Set(runtimeHelper44Destinations.values()).size !== 7 ||
    runtimeHelper44PrivateWords.size !== 2 || new Set(runtimeHelper44PrivateWords.values()).size !== 2) {
  throw new Error("ARM runtime helper 44 symbolic identities do not satisfy the documented distinctness contracts");
}

const runtimeHelper46PrivateWords = new Map();
const runtimeHelper46UseCounts = new Map();
for (const mapping of runtimeHelpers46Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 46 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const extent = mapping.adjacentWords.length === 0
    ? mapping.size
    : mapping.adjacentWords.at(-1).offset + 4;
  const slotStart = entry.address + mapping.size;
  const slotEnd = entry.address + extent;
  if (offset < 0 || offset + extent > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 46 function ${mapping.name} has an out-of-bounds body or slot extent`);
  }
  for (const word of mapping.adjacentWords) {
    const contract = runtimeHelpers46Config.symbolicIdentities[word.symbol];
    const slotAddress = entry.address + word.offset;
    const value = code.readUInt32LE(offset + word.offset);
    const previous = runtimeHelper46PrivateWords.get(word.symbol);
    if (!contract || word.kind !== "R_ARM_ABS32" ||
        slotAddress % contract.minimumSlotAlignment !== 0 ||
        (previous !== undefined && previous !== value)) {
      throw new Error(`ARM runtime helper 46 coefficient slot ${word.symbol} violates its placement or equality contract`);
    }
    runtimeHelper46PrivateWords.set(word.symbol, value);
    runtimeHelper46UseCounts.set(word.symbol, (runtimeHelper46UseCounts.get(word.symbol) ?? 0) + 1);
  }
}
if (runtimeHelper46PrivateWords.size !== 3 ||
    new Set(runtimeHelper46PrivateWords.values()).size !== 3 ||
    [...runtimeHelper46UseCounts.values()].some((count) => count !== 2)) {
  throw new Error("ARM runtime helper 46 coefficient identities do not satisfy the documented equality classes");
}

const runtimeHelper26Destinations = new Map();
for (const mapping of runtimeHelpers26Config.functions) {
  const entry = functionsByName.get(mapping.name);
  const call = mapping.calls[0];
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 26 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM runtime helper 26 function ${mapping.name} has an out-of-bounds body`);
  }
  const instructionAddress = entry.address + call.offset;
  const instruction = code.readUInt32LE(offset + call.offset);
  if ((instruction >>> 24) !== 0xeb) {
    throw new Error(`ARM runtime helper 26 function ${mapping.name} does not have an ARM call at its audited offset`);
  }
  let displacement = instruction & 0x00ffffff;
  if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
  const destination = instructionAddress + 8 + displacement * 4;
  const destinationEntry = functions.find((candidate) => candidate.address === destination);
  if (destination % runtimeHelpers26Identities[call.symbol].minimumAlignment !== 0 ||
      destinationEntry?.mode !== "$a" || !isArmCallTo(instruction, instructionAddress, destination)) {
    throw new Error(`ARM runtime helper 26 call identity ${call.symbol} is not an aligned ARM target`);
  }
  runtimeHelper26Destinations.set(call.symbol, destination);
}
if (runtimeHelper26Destinations.size !== 2 ||
    new Set(runtimeHelper26Destinations.values()).size !== 2) {
  throw new Error("ARM runtime helper 26 call identities do not have distinct ARM destinations");
}

const runtimeHelper29Destinations = new Map();
for (const mapping of runtimeHelpers29Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 29 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM runtime helper 29 function ${mapping.name} has an out-of-bounds body`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = instructionAddress + 8 + displacement * 4;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    const contract = runtimeHelpers29Config.symbolicIdentities[call.symbol];
    if (call.kind !== "R_ARM_CALL" || (instruction >>> 24) !== 0xeb ||
        destination % contract.minimumAlignment !== 0 || destinationEntry?.mode !== "$a" ||
        !isArmCallTo(instruction, instructionAddress, destination)) {
      throw new Error(`ARM runtime helper 29 call identity ${call.symbol} is not an aligned ARM target`);
    }
    runtimeHelper29Destinations.set(call.symbol, destination);
  }
}
if (runtimeHelper29Destinations.size !== 1 ||
    !runtimeHelper29Destinations.has("runtime_record_prepare_29")) {
  throw new Error("ARM runtime helper 29 must have one unique ARM call destination");
}

const runtimeHelper30Destinations = new Map();
for (const mapping of runtimeHelpers30Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 30 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM runtime helper 30 function ${mapping.name} has an out-of-bounds body`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    const contract = runtimeHelpers30Config.symbolicIdentities[call.symbol];
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    let destination = instructionAddress + 8 + displacement * 4;
    if (contract.mode === "thumb") {
      let blxDisplacement = (((instruction & 0x00ffffff) << 2) | ((instruction >>> 23) & 2)) >>> 0;
      if ((blxDisplacement & 0x02000000) !== 0) blxDisplacement -= 0x04000000;
      destination = instructionAddress + 8 + blxDisplacement;
    }
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    const validTransfer = contract.mode === "thumb"
      ? call.kind === "R_ARM_CALL" && destinationEntry?.mode === "$t" &&
        isArmBlxImmediateTo(instruction, instructionAddress, destination)
      : call.kind === "R_ARM_CALL"
        ? destinationEntry?.mode === "$a" && isArmCallTo(instruction, instructionAddress, destination)
        : call.kind === "R_ARM_JUMP24" && destinationEntry?.mode === "$a" &&
          isArmJumpTo(instruction, instructionAddress, destination);
    if (destination % contract.minimumAlignment !== 0 || !validTransfer) {
      throw new Error(`ARM runtime helper 30 branch identity ${call.symbol} has an invalid mode or alignment`);
    }
    runtimeHelper30Destinations.set(call.symbol, destination);
  }
}
if (runtimeHelper30Destinations.size !== 4 ||
    new Set(runtimeHelper30Destinations.values()).size !== 4) {
  throw new Error("ARM runtime helper 30 identities must have four distinct destinations");
}

const runtimeHelper31Destinations = new Map();
const runtimeHelper31SiteCounts = new Map();
for (const mapping of runtimeHelpers31Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 31 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM runtime helper 31 function ${mapping.name} has an out-of-bounds body`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = instructionAddress + 8 + displacement * 4;
    const contract = runtimeHelpers31Config.symbolicIdentities[call.symbol];
    const conditionalLinked = (mapping.name === "func_002DDA5C" && call.offset === 24) ||
      (mapping.name === "func_002DEEEC" && call.offset === 20);
    const expectedOpcode = call.kind === "R_ARM_CALL" ? 0xeb : conditionalLinked ? 0x1b : 0xea;
    if ((instruction >>> 24) !== expectedOpcode || destination % contract.minimumAlignment !== 0) {
      throw new Error(`ARM runtime helper 31 branch identity ${call.symbol} has an invalid form or alignment`);
    }
    const previous = runtimeHelper31Destinations.get(call.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM runtime helper 31 identity ${call.symbol} does not have one shared destination`);
    }
    runtimeHelper31Destinations.set(call.symbol, destination);
    runtimeHelper31SiteCounts.set(call.symbol, (runtimeHelper31SiteCounts.get(call.symbol) ?? 0) + 1);
  }
}
const runtimeHelper31Operations = [
  "runtime_pair_out_query_31",
  "runtime_zero_arg_query_alpha_31",
  "runtime_zero_arg_query_beta_31",
  "runtime_five_arg_query_31",
  "runtime_signed_byte_query_31",
];
const runtimeHelper31Failure = runtimeHelper31Destinations.get("runtime_failure_raise_entry_31");
const runtimeHelper31OperationDestinations = runtimeHelper31Operations.map((identity) =>
  runtimeHelper31Destinations.get(identity));
if (runtimeHelper31Destinations.size !== 6 ||
    runtimeHelper31SiteCounts.get("runtime_failure_raise_entry_31") !== 5 ||
    runtimeHelper31Operations.some((identity) => runtimeHelper31SiteCounts.get(identity) !== 1) ||
    new Set(runtimeHelper31OperationDestinations).size !== 5 ||
    runtimeHelper31OperationDestinations.includes(runtimeHelper31Failure) ||
    functions.find((candidate) => candidate.address === runtimeHelper31Failure)?.mode !== "$a" ||
    runtimeHelper31OperationDestinations.some((destination) =>
      functions.find((candidate) => candidate.address === destination)?.mode !== "$a")) {
  throw new Error("ARM runtime helper 31 identity equality contract is invalid");
}

const runtimeHelper32Destinations = new Map();
const runtimeHelper32SiteCounts = new Map();
for (const mapping of runtimeHelpers32Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 32 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM runtime helper 32 function ${mapping.name} has an out-of-bounds body`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = instructionAddress + 8 + displacement * 4;
    const contract = runtimeHelpers32Config.symbolicIdentities[call.symbol];
    const conditionalLinked = call.symbol === "runtime_failure_raise_entry_31" &&
      !((mapping.name === "func_002DDE18" && call.offset === 20) ||
        (mapping.name === "func_002E0B9C" && call.offset === 60));
    const expectedOpcode = call.kind === "R_ARM_CALL" ? 0xeb : conditionalLinked ? 0x1b : 0xea;
    const requiresFunctionRow = call.symbol !== "runtime_sequence_apply_32";
    if ((instruction >>> 24) !== expectedOpcode || destination % contract.minimumAlignment !== 0 ||
        (requiresFunctionRow &&
          functions.find((candidate) => candidate.address === destination)?.mode !== "$a")) {
      throw new Error(`ARM runtime helper 32 branch identity ${call.symbol} has an invalid form, mode, or alignment`);
    }
    const previous = runtimeHelper32Destinations.get(call.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM runtime helper 32 identity ${call.symbol} does not have one shared destination`);
    }
    runtimeHelper32Destinations.set(call.symbol, destination);
    runtimeHelper32SiteCounts.set(call.symbol, (runtimeHelper32SiteCounts.get(call.symbol) ?? 0) + 1);
  }
}
const runtimeHelper32Operations = [
  "runtime_guard_enter_32",
  "runtime_guarded_operation_32",
  "runtime_guard_leave_32",
  "runtime_aligned_word_forward_32",
  "runtime_zero_arg_query_gamma_32",
  "runtime_resource_acquire_alpha_32",
  "runtime_resource_acquire_beta_32",
  "runtime_sequence_begin_32",
  "runtime_sequence_apply_32",
  "runtime_sequence_finish_32",
];
const runtimeHelper32Failure = runtimeHelper32Destinations.get("runtime_failure_raise_entry_31");
const runtimeHelper32OperationDestinations = runtimeHelper32Operations.map((identity) =>
  runtimeHelper32Destinations.get(identity));
if (runtimeHelper32Destinations.size !== 11 ||
    runtimeHelper32SiteCounts.get("runtime_failure_raise_entry_31") !== 6 ||
    runtimeHelper32Operations.some((identity) => runtimeHelper32SiteCounts.get(identity) !== 1) ||
    new Set(runtimeHelper32OperationDestinations).size !== 10 ||
    runtimeHelper32OperationDestinations.includes(runtimeHelper32Failure) ||
    runtimeHelper32Failure !== runtimeHelper31Failure) {
  throw new Error("ARM runtime helper 32 identity equality contract is invalid");
}

const ipcTemplate31Destinations = new Map();
const ipcTemplate31SiteCounts = new Map();
const ipcTemplate31PrimaryEntries = new Set(ipcTemplate31BranchIdentityContract.primaryEntries);
const ipcTemplate31SecondaryEntries = new Set(ipcTemplate31BranchIdentityContract.secondaryEntries);
for (const mapping of ipcTemplates31Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 31 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`ARM IPC template 31 function ${mapping.name} is out of bounds`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : 0xea;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    const isPrimaryEntry = ipcTemplate31PrimaryEntries.has(branch.symbol) && destinationEntry?.mode === "$a";
    const isSecondaryEntry = ipcTemplate31SecondaryEntries.has(branch.symbol) &&
      destinationEntry === undefined;
    if (instruction >>> 24 !== expectedOpcode ||
        destination % ipcTemplate31BranchIdentityContract.minimumAlignment !== 0 ||
        (!isPrimaryEntry && !isSecondaryEntry)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const prior = ipcTemplate31Destinations.get(branch.symbol);
    if (prior !== undefined && prior !== destination) {
      throw new Error(`ARM IPC template 31 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate31Destinations.set(branch.symbol, destination);
    ipcTemplate31SiteCounts.set(branch.symbol, (ipcTemplate31SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
const ipcTemplate31Failure = ipcTemplate31Destinations.get("runtime_failure_raise_entry_31");
const ipcTemplate31Operations = [...ipcTemplate31Destinations.keys()].filter((identity) =>
  identity !== "runtime_failure_raise_entry_31");
if (ipcTemplate31Destinations.size !== 22 || ipcTemplate31Operations.length !== 21 ||
    ipcTemplate31SiteCounts.get("runtime_failure_raise_entry_31") !== 17 ||
    ipcTemplate31Operations.some((identity) => ipcTemplate31SiteCounts.get(identity) !== 1) ||
    new Set(ipcTemplate31Operations.map((identity) => ipcTemplate31Destinations.get(identity))).size !== 21 ||
    new Set(ipcTemplate31Destinations.values()).size !== 22 ||
    ipcTemplate31Failure !== runtimeHelper31Failure) {
  throw new Error("ARM IPC template 31 branch identity equality contract is invalid");
}

const ipcTemplate31LiteralWords = new Map();
for (const mapping of ipcTemplates31Config.functions) {
  const entry = functionsByName.get(mapping.name);
  const offset = entry.address - textStart;
  for (const literal of mapping.literals) {
    const value = code.readUInt32LE(offset + literal.offset);
    const previous = ipcTemplate31LiteralWords.get(literal.symbol);
    if (previous !== undefined && previous !== value) {
      throw new Error(`ARM IPC template 31 literal identity ${literal.symbol} is not shared consistently`);
    }
    ipcTemplate31LiteralWords.set(literal.symbol, value);
  }
}
const ipcTemplate31QueryStatus = ipcTemplate31LiteralWords.get("service_query_accepted_status_31");
const ipcTemplate31OpenStatus = ipcTemplate31LiteralWords.get("service_open_accepted_status_31");
if (ipcTemplate31LiteralWords.size !== 5 || ipcTemplate31QueryStatus === undefined ||
    ipcTemplate31OpenStatus === undefined || ipcTemplate31QueryStatus === ipcTemplate31OpenStatus) {
  throw new Error("ARM IPC template 31 query and open status identities are invalid");
}

const ipcTemplate32Destinations = new Map();
const ipcTemplate32LiteralWords = new Map();
for (const mapping of ipcTemplates32Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 32 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size + 12 > code.length) {
    throw new Error(`ARM IPC template 32 function ${mapping.name} is out of bounds`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : 0xea;
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        functions.find((candidate) => candidate.address === destination)?.mode !== "$a" ||
        ipcTemplate32Destinations.has(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    ipcTemplate32Destinations.set(branch.symbol, destination);
  }
  for (const literal of mapping.literals) {
    const value = code.readUInt32LE(offset + literal.offset);
    const previous = ipcTemplate32LiteralWords.get(literal.symbol);
    if (previous !== undefined && previous !== value) {
      throw new Error(`ARM IPC template 32 literal identity ${literal.symbol} is not shared consistently`);
    }
    ipcTemplate32LiteralWords.set(literal.symbol, value);
  }
}
if (ipcTemplate32Destinations.size !== 22 ||
    new Set(ipcTemplate32Destinations.values()).size !== 22 ||
    ipcTemplate32Singletons.some((identity) => !ipcTemplate32Destinations.has(identity)) ||
    ipcTemplate32LiteralWords.size !== 3 ||
    new Set(ipcTemplate32LiteralWords.values()).size !== 3) {
  throw new Error("ARM IPC template 32 branch or literal equality contract is invalid");
}

const ipcTemplate33Destinations = new Map();
const ipcTemplate33SiteCounts = new Map();
const ipcTemplate33LiteralWords = new Map();
for (const mapping of ipcTemplates33Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 33 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`ARM IPC template 33 function ${mapping.name} is out of bounds`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : 0x1b;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate33PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate33Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 33 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate33Destinations.set(branch.symbol, destination);
    ipcTemplate33SiteCounts.set(branch.symbol, (ipcTemplate33SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
  for (const literal of mapping.literals) {
    ipcTemplate33LiteralWords.set(literal.symbol, code.readUInt32LE(offset + literal.offset));
  }
}
if (ipcTemplate33Destinations.size !== 5 ||
    new Set(ipcTemplate33Destinations.values()).size !== 5 ||
    ipcTemplate33PrimaryEntries.some((identity) => !ipcTemplate33Destinations.has(identity)) ||
    ipcTemplate33SiteCounts.get("func_00124880") !== 8 ||
    ipcTemplate33SiteCounts.get("func_00124FB0") !== 8 ||
    ipcTemplate33SiteCounts.get("func_00160380") !== 2 ||
    ipcTemplate33SiteCounts.get("func_001602B8") !== 1 ||
    ipcTemplate33SiteCounts.get("func_001F4A1C") !== 1 ||
    ipcTemplate33LiteralWords.size !== 5 ||
    new Set(ipcTemplate33LiteralWords.values()).size !== 5) {
  throw new Error("ARM IPC template 33 branch or literal equality contract is invalid");
}

const ipcTemplate34Destinations = new Map();
const ipcTemplate34SiteCounts = new Map();
const ipcTemplate34LiteralWords = new Map();
for (const mapping of ipcTemplates34Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 34 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 34 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : 0xea;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        (branch.symbol !== ipcTemplate34UninventoriedPrimaryEntry && destinationEntry?.mode !== "$a") ||
        !ipcTemplate34PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate34Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 34 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate34Destinations.set(branch.symbol, destination);
    ipcTemplate34SiteCounts.set(branch.symbol, (ipcTemplate34SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
  for (const literal of mapping.literals) {
    const value = code.readUInt32LE(offset + literal.offset);
    const previous = ipcTemplate34LiteralWords.get(literal.symbol);
    if (previous !== undefined && previous !== value) {
      throw new Error(`ARM IPC template 34 literal identity ${literal.symbol} is not shared consistently`);
    }
    ipcTemplate34LiteralWords.set(literal.symbol, value);
  }
}
if (ipcTemplate34Destinations.size !== 5 ||
    new Set(ipcTemplate34Destinations.values()).size !== 5 ||
    ipcTemplate34PrimaryEntries.some((identity) => !ipcTemplate34Destinations.has(identity)) ||
    ipcTemplate34SiteCounts.get("func_00124880") !== 8 ||
    ipcTemplate34SiteCounts.get("func_00124FB0") !== 11 ||
    ipcTemplate34SiteCounts.get("func_00118C2C") !== 2 ||
    ipcTemplate34SiteCounts.get("service_publish_operation_34") !== 2 ||
    ipcTemplate34SiteCounts.get("func_00145FC0") !== 1 ||
    ipcTemplate34Destinations.get("func_00124880") !== ipcTemplate33Destinations.get("func_00124880") ||
    ipcTemplate34Destinations.get("func_00124FB0") !== ipcTemplate33Destinations.get("func_00124FB0") ||
    ipcTemplate34LiteralWords.size !== 6 ||
    new Set(ipcTemplate34LiteralWords.values()).size !== 6) {
  throw new Error("ARM IPC template 34 branch or literal equality contract is invalid");
}

const ipcTemplate35Destinations = new Map();
const ipcTemplate35SiteCounts = new Map();
const ipcTemplate35LiteralWords = new Map();
for (const mapping of ipcTemplates35Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 35 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 35 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : 0xea;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate35PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate35Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 35 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate35Destinations.set(branch.symbol, destination);
    ipcTemplate35SiteCounts.set(branch.symbol, (ipcTemplate35SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
  for (const literal of mapping.literals) {
    const value = code.readUInt32LE(offset + literal.offset);
    const previous = ipcTemplate35LiteralWords.get(literal.symbol);
    if (previous !== undefined && previous !== value) {
      throw new Error(`ARM IPC template 35 literal identity ${literal.symbol} is not shared consistently`);
    }
    ipcTemplate35LiteralWords.set(literal.symbol, value);
  }
}
const ipcTemplate35SharedCounts = new Map([
  ["func_001260B4", 3], ["func_00126414", 3], ["func_00126000", 2],
  ["func_00124BA4", 2], ["func_00124FB0", 2], ["func_00146000", 2],
]);
if (ipcTemplate35Destinations.size !== 20 ||
    new Set(ipcTemplate35Destinations.values()).size !== 20 ||
    ipcTemplate35PrimaryEntries.some((identity) => !ipcTemplate35Destinations.has(identity)) ||
    [...ipcTemplate35SharedCounts].some(([identity, count]) => ipcTemplate35SiteCounts.get(identity) !== count) ||
    ipcTemplate35PrimaryEntries.some((identity) =>
      !ipcTemplate35SharedCounts.has(identity) && ipcTemplate35SiteCounts.get(identity) !== 1) ||
    ipcTemplate35LiteralWords.size !== 4 ||
    new Set(ipcTemplate35LiteralWords.values()).size !== 4) {
  throw new Error("ARM IPC template 35 branch or literal equality contract is invalid");
}

const ipcTemplate36Destinations = new Map();
const ipcTemplate36SiteCounts = new Map();
for (const mapping of ipcTemplates36Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 36 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM IPC template 36 function ${mapping.name} has an invalid body range`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : -1;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate36PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate36Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 36 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate36Destinations.set(branch.symbol, destination);
    ipcTemplate36SiteCounts.set(branch.symbol, (ipcTemplate36SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
const ipcTemplate36SharedCounts = new Map([
  ["func_001240C4", 3], ["func_001260B4", 2],
  ["func_00126414", 2], ["func_00124FB0", 2],
]);
if (ipcTemplate36Destinations.size !== 14 ||
    new Set(ipcTemplate36Destinations.values()).size !== 14 ||
    ipcTemplate36PrimaryEntries.some((identity) => !ipcTemplate36Destinations.has(identity)) ||
    [...ipcTemplate36SharedCounts].some(([identity, count]) => ipcTemplate36SiteCounts.get(identity) !== count) ||
    ipcTemplate36PrimaryEntries.some((identity) =>
      !ipcTemplate36SharedCounts.has(identity) && ipcTemplate36SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 36 branch equality contract is invalid");
}

const ipcTemplate37Destinations = new Map();
const ipcTemplate37SiteCounts = new Map();
for (const mapping of ipcTemplates37Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 37 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM IPC template 37 function ${mapping.name} has an invalid body range`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb :
      branch.mnemonic === "blne" ? 0x1b : branch.mnemonic === "b" ? 0xea : -1;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate37PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate37Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 37 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate37Destinations.set(branch.symbol, destination);
    ipcTemplate37SiteCounts.set(branch.symbol, (ipcTemplate37SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate37Destinations.size !== 12 ||
    new Set(ipcTemplate37Destinations.values()).size !== 12 ||
    ipcTemplate37PrimaryEntries.some((identity) => !ipcTemplate37Destinations.has(identity)) ||
    ipcTemplate37SiteCounts.get("func_00124FB0") !== 5 ||
    ipcTemplate37PrimaryEntries.some((identity) =>
      identity !== "func_00124FB0" && ipcTemplate37SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 37 branch equality contract is invalid");
}

const ipcTemplate38Destinations = new Map();
const ipcTemplate38SiteCounts = new Map();
for (const mapping of ipcTemplates38Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 38 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM IPC template 38 function ${mapping.name} has an invalid body range`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== 0xea || branch.mnemonic !== "b" || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate38PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate38Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 38 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate38Destinations.set(branch.symbol, destination);
    ipcTemplate38SiteCounts.set(branch.symbol, (ipcTemplate38SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate38Destinations.size !== 1 || ipcTemplate38SiteCounts.get("func_001603A0") !== 3 ||
    !ipcTemplate38Destinations.has("func_001603A0")) {
  throw new Error("ARM IPC template 38 branch equality contract is invalid");
}

const ipcTemplate39Destinations = new Map();
const ipcTemplate39SiteCounts = new Map();
for (const mapping of ipcTemplates39Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 39 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 39 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb :
      branch.mnemonic === "bleq" ? 0x0b : branch.mnemonic === "blne" ? 0x1b : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate39PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate39Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 39 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate39Destinations.set(branch.symbol, destination);
    ipcTemplate39SiteCounts.set(branch.symbol, (ipcTemplate39SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate39Destinations.size !== 7 ||
    new Set(ipcTemplate39Destinations.values()).size !== 7 ||
    ipcTemplate39PrimaryEntries.some((identity) => !ipcTemplate39Destinations.has(identity)) ||
    ipcTemplate39SiteCounts.get("func_00124FB0") !== 4 ||
    ipcTemplate39PrimaryEntries.some((identity) =>
      identity !== "func_00124FB0" && ipcTemplate39SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 39 branch equality contract is invalid");
}

const ipcTemplate40Destinations = new Map();
const ipcTemplate40SiteCounts = new Map();
for (const mapping of ipcTemplates40Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 40 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 40 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate40PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate40Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 40 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate40Destinations.set(branch.symbol, destination);
    ipcTemplate40SiteCounts.set(branch.symbol, (ipcTemplate40SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate40Destinations.size !== 2 ||
    new Set(ipcTemplate40Destinations.values()).size !== 2 ||
    ipcTemplate40PrimaryEntries.some((identity) => !ipcTemplate40Destinations.has(identity)) ||
    ipcTemplate40SiteCounts.get("func_001603A0") !== 5 ||
    ipcTemplate40SiteCounts.get("func_0011B11C") !== 1) {
  throw new Error("ARM IPC template 40 branch equality contract is invalid");
}

const ipcTemplate41Destinations = new Map();
const ipcTemplate41SiteCounts = new Map();
for (const mapping of ipcTemplates41Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 41 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 41 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb :
      branch.mnemonic === "blne" ? 0x1b : branch.mnemonic === "b" ? 0xea : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate41PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate41Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 41 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate41Destinations.set(branch.symbol, destination);
    ipcTemplate41SiteCounts.set(branch.symbol, (ipcTemplate41SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate41Destinations.size !== 9 ||
    new Set(ipcTemplate41Destinations.values()).size !== 9 ||
    ipcTemplate41PrimaryEntries.some((identity) => !ipcTemplate41Destinations.has(identity)) ||
    ipcTemplate41SiteCounts.get("func_00160380") !== 2 ||
    ipcTemplate41PrimaryEntries.some((identity) =>
      identity !== "func_00160380" && ipcTemplate41SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 41 branch equality contract is invalid");
}

const ipcTemplate42Destinations = new Map();
const ipcTemplate42SiteCounts = new Map();
for (const mapping of ipcTemplates42Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 42 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 42 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb :
      branch.mnemonic === "blne" ? 0x1b : branch.mnemonic === "b" ? 0xea : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate42PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate42Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 42 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate42Destinations.set(branch.symbol, destination);
    ipcTemplate42SiteCounts.set(branch.symbol, (ipcTemplate42SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate42Destinations.size !== 5 ||
    new Set(ipcTemplate42Destinations.values()).size !== 5 ||
    ipcTemplate42PrimaryEntries.some((identity) => !ipcTemplate42Destinations.has(identity)) ||
    ipcTemplate42SiteCounts.get("func_002CCD5C") !== 2 ||
    ipcTemplate42PrimaryEntries.some((identity) =>
      identity !== "func_002CCD5C" && ipcTemplate42SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 42 branch equality contract is invalid");
}

const ipcTemplate43Destinations = new Map();
const ipcTemplate43SiteCounts = new Map();
for (const mapping of ipcTemplates43Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 43 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 43 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb :
      branch.mnemonic === "blne" ? 0x1b : branch.mnemonic === "b" ? 0xea : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind || destination % 4 !== 0 ||
        destinationEntry?.mode !== "$a" || !ipcTemplate43PrimaryEntries.includes(branch.symbol)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate43Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 43 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate43Destinations.set(branch.symbol, destination);
    ipcTemplate43SiteCounts.set(branch.symbol, (ipcTemplate43SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
if (ipcTemplate43Destinations.size !== 8 ||
    new Set(ipcTemplate43Destinations.values()).size !== 8 ||
    ipcTemplate43PrimaryEntries.some((identity) => !ipcTemplate43Destinations.has(identity)) ||
    ipcTemplate43SiteCounts.get("func_001602B8") !== 3 ||
    ipcTemplate43SiteCounts.get("func_001603A0") !== 4 ||
    ipcTemplate43SiteCounts.get("func_00160380") !== 4 ||
    ipcTemplate43PrimaryEntries.some((identity) =>
      !["func_001602B8", "func_001603A0", "func_00160380"].includes(identity) &&
      ipcTemplate43SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 43 branch equality contract is invalid");
}

const ipcTemplate44Destinations = new Map();
const ipcTemplate44SiteCounts = new Map();
const ipcTemplate44PrimaryEntrySet = new Set(ipcTemplate44PrimaryEntries);
const ipcTemplate44SecondaryEntrySet = new Set(ipcTemplate44SecondaryEntries);
for (const mapping of ipcTemplates44Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 44 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM IPC template 44 function ${mapping.name} has invalid adjacent literal slots`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb : branch.mnemonic === "blne" ? 0x1b : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    const isPrimaryEntry = ipcTemplate44PrimaryEntrySet.has(branch.symbol) && destinationEntry?.mode === "$a";
    const isSecondaryEntry = ipcTemplate44SecondaryEntrySet.has(branch.symbol) && destinationEntry === undefined;
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind ||
        destination % ipcTemplates44Config.branchIdentityContract.minimumAlignment !== 0 ||
        (!isPrimaryEntry && !isSecondaryEntry)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate44Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 44 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate44Destinations.set(branch.symbol, destination);
    ipcTemplate44SiteCounts.set(branch.symbol, (ipcTemplate44SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
const ipcTemplate44AllEntries = [...ipcTemplate44PrimaryEntries, ...ipcTemplate44SecondaryEntries];
if (ipcTemplate44Destinations.size !== 10 ||
    new Set(ipcTemplate44Destinations.values()).size !== 10 ||
    ipcTemplate44AllEntries.some((identity) => !ipcTemplate44Destinations.has(identity)) ||
    ipcTemplate44SiteCounts.get("func_00146000") !== 2 ||
    ipcTemplate44SiteCounts.get("func_001603A0") !== 4 ||
    ipcTemplate44AllEntries.some((identity) =>
      !["func_00146000", "func_001603A0"].includes(identity) &&
      ipcTemplate44SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 44 branch equality contract is invalid");
}

const ipcTemplate45Destinations = new Map();
const ipcTemplate45SiteCounts = new Map();
const ipcTemplate45PrimaryEntrySet = new Set(ipcTemplate45PrimaryEntries);
const ipcTemplate45SecondaryEntrySet = new Set(ipcTemplate45SecondaryEntries);
for (const mapping of ipcTemplates45Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM IPC template 45 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`ARM IPC template 45 function ${mapping.name} has an invalid body range`);
  }
  for (const branch of mapping.branches) {
    const instruction = code.readUInt32LE(offset + branch.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = entry.address + branch.offset + 8 + displacement * 4;
    const expectedOpcode = branch.mnemonic === "bl" ? 0xeb :
      branch.mnemonic === "blne" ? 0x1b : branch.mnemonic === "b" ? 0xea : -1;
    const expectedKind = branch.mnemonic === "bl" ? "R_ARM_CALL" : "R_ARM_JUMP24";
    const destinationEntry = functions.find((candidate) => candidate.address === destination);
    const isPrimaryEntry = ipcTemplate45PrimaryEntrySet.has(branch.symbol) && destinationEntry?.mode === "$a";
    const isSecondaryEntry = ipcTemplate45SecondaryEntrySet.has(branch.symbol) && destinationEntry === undefined;
    if (instruction >>> 24 !== expectedOpcode || branch.kind !== expectedKind ||
        destination % ipcTemplates45Config.branchIdentityContract.minimumAlignment !== 0 ||
        (!isPrimaryEntry && !isSecondaryEntry)) {
      throw new Error(`${mapping.name} has an invalid audited branch at offset ${branch.offset}`);
    }
    const previous = ipcTemplate45Destinations.get(branch.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM IPC template 45 branch identity ${branch.symbol} is not shared consistently`);
    }
    ipcTemplate45Destinations.set(branch.symbol, destination);
    ipcTemplate45SiteCounts.set(branch.symbol, (ipcTemplate45SiteCounts.get(branch.symbol) ?? 0) + 1);
  }
}
const ipcTemplate45AllEntries = [...ipcTemplate45PrimaryEntries, ...ipcTemplate45SecondaryEntries];
if (ipcTemplate45Destinations.size !== 19 ||
    new Set(ipcTemplate45Destinations.values()).size !== 19 ||
    ipcTemplate45AllEntries.some((identity) => !ipcTemplate45Destinations.has(identity)) ||
    ipcTemplate45SiteCounts.get("func_001603A0") !== 5 ||
    ipcTemplate45SiteCounts.get("func_001602B8") !== 3 ||
    ipcTemplate45SiteCounts.get("func_00160380") !== 3 ||
    ipcTemplate45AllEntries.some((identity) =>
      !["func_001603A0", "func_001602B8", "func_00160380"].includes(identity) &&
      ipcTemplate45SiteCounts.get(identity) !== 1)) {
  throw new Error("ARM IPC template 45 branch equality contract is invalid");
}

const runtimeHelper33Destinations = new Map();
const runtimeHelper33SiteCounts = new Map();
const runtimeHelper33PrivateWords = new Map();
for (const mapping of runtimeHelpers33Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 33 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = entry.address + 132;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 33 function ${mapping.name} has invalid adjacent words`);
  }
  for (const call of mapping.calls) {
    const instructionAddress = entry.address + call.offset;
    const instruction = code.readUInt32LE(offset + call.offset);
    let displacement = instruction & 0x00ffffff;
    if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
    const destination = instructionAddress + 8 + displacement * 4;
    const expectedOpcode = call.kind === "R_ARM_CALL" ? 0xeb : 0x1b;
    const expectedOperation = call.kind === "R_ARM_CALL" ? functionsByName.get(call.symbol) : undefined;
    if (instruction >>> 24 !== expectedOpcode || destination % 4 !== 0 ||
        (call.kind === "R_ARM_CALL" &&
          (expectedOperation?.mode !== "$a" || expectedOperation.address !== destination))) {
      throw new Error(`ARM runtime helper 33 branch identity ${call.symbol} has an invalid form, mode, or alignment`);
    }
    const previous = runtimeHelper33Destinations.get(call.symbol);
    if (previous !== undefined && previous !== destination) {
      throw new Error(`ARM runtime helper 33 identity ${call.symbol} does not have one shared destination`);
    }
    runtimeHelper33Destinations.set(call.symbol, destination);
    runtimeHelper33SiteCounts.set(call.symbol, (runtimeHelper33SiteCounts.get(call.symbol) ?? 0) + 1);
  }
  for (const word of mapping.adjacentWords) {
    const value = code.readUInt32LE(offset + word.offset);
    const previous = runtimeHelper33PrivateWords.get(word.symbol);
    if (word.kind !== "R_ARM_ABS32" || (entry.address + word.offset) % 4 !== 0 ||
        (previous !== undefined && previous !== value)) {
      throw new Error(`ARM runtime helper 33 adjacent identity ${word.symbol} is invalid`);
    }
    runtimeHelper33PrivateWords.set(word.symbol, value);
  }
}
const runtimeHelper33Operations = runtimeHelpers33Pairs.map(([, operation]) => operation);
const runtimeHelper33OperationDestinations = runtimeHelper33Operations.map((identity) =>
  runtimeHelper33Destinations.get(identity));
const runtimeHelper33Failure = runtimeHelper33Destinations.get("runtime_failure_raise_entry_31");
const runtimeHelper33Exhausted = runtimeHelper33PrivateWords.get("runtime_retry_exhausted_status_33");
const runtimeHelper33Terminal = runtimeHelper33PrivateWords.get("service_query_accepted_status_31");
if (runtimeHelper33Destinations.size !== 11 ||
    runtimeHelper33Operations.some((identity) => runtimeHelper33SiteCounts.get(identity) !== 1) ||
    runtimeHelper33SiteCounts.get("runtime_failure_raise_entry_31") !== 10 ||
    new Set(runtimeHelper33OperationDestinations).size !== 10 ||
    runtimeHelper33OperationDestinations.includes(runtimeHelper33Failure) ||
    runtimeHelper33Failure !== runtimeHelper31Failure ||
    runtimeHelper33PrivateWords.size !== 2 || runtimeHelper33Terminal !== ipcTemplate31QueryStatus ||
    runtimeHelper33Terminal === ipcTemplate31OpenStatus || runtimeHelper33Exhausted === runtimeHelper33Terminal ||
    [...ipcTemplate31LiteralWords.values()].includes(runtimeHelper33Exhausted)) {
  throw new Error("ARM runtime helper 33 branch or data identity equality contract is invalid");
}

const runtimeHelper27PrivateWords = new Map();
for (const mapping of runtimeHelpers27Config.functions) {
  const inventory = functionsByName.get(mapping.name);
  if (inventory?.mode !== "$a" || inventory.size !== mapping.size) {
    throw new Error(`ARM runtime helper 27 function ${mapping.name} is missing from the function inventory`);
  }
  const offset = inventory.address - textStart;
  const slotStart = inventory.address + mapping.size;
  const slotEnd = inventory.address + mapping.adjacentWords.at(-1).offset + 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 27 function ${mapping.name} has invalid adjacent words`);
  }
  for (const word of mapping.adjacentWords) {
    const contract = runtimeHelpers27Identities[word.symbol];
    const slotAddress = inventory.address + word.offset;
    if (word.kind !== "R_ARM_ABS32" || slotAddress % contract.minimumSlotAlignment !== 0) {
      throw new Error(`ARM runtime helper 27 identity ${word.symbol} has an invalid or misaligned slot`);
    }
    runtimeHelper27PrivateWords.set(word.symbol, code.readUInt32LE(offset + word.offset));
  }
}
if (runtimeHelper27PrivateWords.size !== 4 ||
    new Set(runtimeHelper27PrivateWords.values()).size !== 4) {
  throw new Error("ARM runtime helper 27 opaque identities do not have the documented distinct equality classes");
}

const runtimeHelper38PrivateWords = new Map();
const runtimeHelper38SiteCounts = new Map();
for (const mapping of runtimeHelpers38Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 38 function ${mapping.name} is missing from the function inventory`);
  }
  if (mapping.adjacentWords.length === 0) continue;
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = entry.address + mapping.adjacentWords.at(-1).offset + 4;
  if (offset < 0 || slotStart % 4 !== 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 38 function ${mapping.name} has invalid adjacent words`);
  }
  for (const word of mapping.adjacentWords) {
    const value = code.readUInt32LE(offset + word.offset);
    const previous = runtimeHelper38PrivateWords.get(word.symbol);
    if (word.kind !== "R_ARM_ABS32" || (entry.address + word.offset) % 4 !== 0 ||
        (previous !== undefined && previous !== value)) {
      throw new Error(`ARM runtime helper 38 adjacent identity ${word.symbol} is invalid`);
    }
    runtimeHelper38PrivateWords.set(word.symbol, value);
    runtimeHelper38SiteCounts.set(word.symbol, (runtimeHelper38SiteCounts.get(word.symbol) ?? 0) + 1);
  }
}
if (runtimeHelper38PrivateWords.size !== 3 || new Set(runtimeHelper38PrivateWords.values()).size !== 3 ||
    runtimeHelper38SiteCounts.get("runtime_halfword_fill_38") !== 1 ||
    runtimeHelper38SiteCounts.get("runtime_float_zero_38") !== 3 ||
    runtimeHelper38SiteCounts.get("runtime_float_unit_38") !== 3) {
  throw new Error("ARM runtime helper 38 words do not form the documented three equality classes");
}
for (const mapping of runtimeHelpers41Config.functions) {
  const entry = functionsByName.get(mapping.name);
  if (entry?.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`ARM runtime helper 41 function ${mapping.name} is missing from the function inventory`);
  }
  if (mapping.adjacentWords.length === 0) continue;
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = entry.address + mapping.adjacentWords.at(-1).offset + 4;
  if (offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`ARM runtime helper 41 function ${mapping.name} has invalid adjacent words`);
  }
  for (const word of mapping.adjacentWords) {
    const contract = runtimeHelpers41Config.symbolicIdentities[word.symbol];
    const slotAddress = entry.address + word.offset;
    if (word.kind !== "R_ARM_ABS32" || word.symbol !== runtimeHelpers41SlotIdentity ||
        slotAddress % contract.minimumSlotAlignment !== 0) {
      throw new Error(`ARM runtime helper 41 identity ${word.symbol} has an invalid or misaligned slot`);
    }
    code.readUInt32LE(offset + word.offset);
  }
}
if (runtimeHelper27PrivateWords.get("runtime_once_flag_27") %
    runtimeHelpers27Identities.runtime_once_flag_27.minimumPointeeAlignment !== 0) {
  throw new Error("ARM runtime helper 27 writable byte identity does not meet its documented alignment");
}

function isArmBranchTo(instruction, instructionAddress, destinationAddress, condition, link) {
  if ((instruction >>> 28) !== condition || ((instruction >>> 25) & 0x7) !== 0x5 ||
      ((instruction >>> 24) & 0x1) !== (link ? 1 : 0)) return false;
  let displacement = instruction & 0x00ffffff;
  if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
  return instructionAddress + 8 + displacement * 4 === destinationAddress;
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

const ipcIdentityWords = new Map();
const ipcWordIdentities = new Map();
let ipcMappedBytes = 0;
let ipcMappedSlots = 0;
const ipcMappings = [
  ...[...duplicateIpcAndTables].filter(([, mapping]) => mapping.template !== "table_state"),
  ...ipcUniqueTemplates,
  ...ipcTemplates15,
  ...ipcTemplates16,
  ...ipcTemplates17,
  ...ipcTemplates18,
  ...[...ipcTemplates19].filter(([, mapping]) => ipcTemplate19Definitions.get(mapping.template).literals.length !== 0),
  ...[...ipcTemplates20].filter(([, mapping]) => ipcTemplate20Definitions.get(mapping.template).literals.length !== 0),
  ...ipcTemplates21,
  ...ipcTemplates22,
  ...ipcTemplates23,
];
function registerIpcMapping(name, mapping) {
  const entry = functionsByName.get(name);
  const identities = ipcTemplates30.has(name)
    ? [mapping.command, mapping.auxiliary, mapping.staticDescriptor, mapping.handle].filter((value) => typeof value === "string")
    : ipcTemplates29.has(name)
    ? [mapping.command, mapping.auxiliary, mapping.staticDescriptor, mapping.handle].filter((value) => typeof value === "string")
    : ipcTemplates28.has(name)
    ? [mapping.command, mapping.handle].filter((value) => typeof value === "string")
    : ipcTemplates27.has(name)
    ? ipcTemplate27Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates26.has(name)
    ? ipcTemplate26Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates25.has(name)
    ? ipcTemplate25Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates24.has(name)
    ? ipcTemplate24Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates23.has(name)
    ? ipcTemplate23Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates22.has(name)
    ? ipcTemplate22Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates21.has(name)
    ? ipcTemplate21Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : ipcTemplates20.has(name)
    ? ipcTemplate20Definitions.get(mapping.template).literals.map((key) => mapping[key])
    : mapping.auxiliary === undefined
      ? [mapping.command, ...(mapping.handle === undefined ? [] : [mapping.handle])]
      : [mapping.command, mapping.auxiliary, mapping.handle];
  if (entry === undefined || entry.mode !== "$a" || entry.size !== mapping.size) {
    throw new Error(`${name} is not the configured inventoried ARM IPC function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + identities.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + identities.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds IPC identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} IPC identity slots overlap inventoried function ${overlap.name}`);
  }
  for (let index = 0; index < identities.length; index++) {
    const identity = identities[index];
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = ipcIdentityWords.get(identity);
    const priorIdentity = ipcWordIdentities.get(privateWord);
    if ((priorWord !== undefined && priorWord !== privateWord) ||
        (priorIdentity !== undefined && priorIdentity !== identity)) {
      throw new Error(`Cross-batch IPC identity equality is inconsistent for ${name} slot ${index}`);
    }
    ipcIdentityWords.set(identity, privateWord);
    ipcWordIdentities.set(privateWord, identity);
  }
  ipcMappedBytes += entry.size;
  ipcMappedSlots += identities.length;
}
for (const [name, mapping] of ipcMappings) registerIpcMapping(name, mapping);
if (ipcMappings.length !== 202 || ipcMappedBytes !== 15656 || ipcMappedSlots !== 306 ||
    ipcIdentityWords.size !== 163 || ipcWordIdentities.size !== 163 ||
    !ipcIdentityWords.has("ipc_handle_slot_alpha") ||
    !ipcIdentityWords.has("ipc_handle_slot_gamma") ||
    !ipcIdentityWords.has("ipc_handle_slot_eta") ||
    !ipcIdentityWords.has("ipc_handle_slot_theta") ||
    !ipcIdentityWords.has("ipc_handle_slot_kappa") ||
    !ipcIdentityWords.has("ipc_handle_slot_lambda") ||
    !ipcIdentityWords.has("ipc_handle_slot_mu") ||
    !ipcIdentityWords.has("ipc_aux_literal_class_15")) {
  throw new Error("The 306 IPC slots must form a 163-to-163 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates24) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 16436 || ipcMappedSlots !== 318 ||
    ipcIdentityWords.size !== 171 || ipcWordIdentities.size !== 171) {
  throw new Error("The 318 IPC slots must form a 171-to-171 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates25) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 17164 || ipcMappedSlots !== 327 ||
    ipcIdentityWords.size !== 177 || ipcWordIdentities.size !== 177) {
  throw new Error("The 327 IPC slots must form a 177-to-177 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates26) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 17884 || ipcMappedSlots !== 337 ||
    ipcIdentityWords.size !== 177 || ipcWordIdentities.size !== 177) {
  throw new Error("The 337 IPC slots must form a 177-to-177 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates27) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 19092 || ipcMappedSlots !== 355 ||
    ipcIdentityWords.size !== 180 || ipcWordIdentities.size !== 180 ||
    ipcIdentityWords.get("ipc_command_func_001F7630") !== (2060 << 16) ||
    ipcIdentityWords.get("ipc_handle_slot_nu") % 4 !== 0 ||
    ipcIdentityWords.get("ipc_handle_slot_xi") % 4 !== 0) {
  throw new Error("The 355 IPC slots must form a 180-to-180 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates28) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 20624 || ipcMappedSlots !== 391 ||
    ipcIdentityWords.size !== 198 || ipcWordIdentities.size !== 198) {
  throw new Error("The 391 IPC slots must form a 198-to-198 identity/word bijection");
}
for (const [identity, contract] of Object.entries(ipcTemplates28Config.newCommandIdentities)) {
  const expectedHeader = (contract.commandId << 16) | (contract.normalWords << 6) | contract.translatedWords;
  if (ipcIdentityWords.get(identity) !== expectedHeader) {
    throw new Error(`IPC template 28 command identity ${identity} has the wrong header value`);
  }
}
for (const [name, mapping] of ipcTemplates29) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 22372 || ipcMappedSlots !== 431 ||
    ipcIdentityWords.size !== 216 || ipcWordIdentities.size !== 216 ||
    ipcIdentityWords.get("ipc_handle_slot_omicron") % 4 !== 0) {
  throw new Error("The 431 IPC slots must form a 216-to-216 identity/word bijection");
}
for (const [identity, contract] of Object.entries(ipcTemplates29Config.newCommandIdentities)) {
  const expectedHeader = (contract.commandId << 16) | (contract.normalWords << 6) | contract.translatedWords;
  if (ipcIdentityWords.get(identity) !== expectedHeader) {
    throw new Error(`IPC template 29 command identity ${identity} has the wrong header value`);
  }
}
for (const [name, mapping] of ipcTemplates30) registerIpcMapping(name, mapping);
if (ipcMappedBytes !== 24284 || ipcMappedSlots !== 468 ||
    ipcIdentityWords.size !== 232 || ipcWordIdentities.size !== 232) {
  throw new Error("The 468 IPC slots must form a 232-to-232 identity/word bijection");
}
for (const [identity, contract] of Object.entries(ipcTemplates30Config.newCommandIdentities)) {
  const expectedHeader = (contract.commandId << 16) | (contract.normalWords << 6) | contract.translatedWords;
  if (ipcIdentityWords.get(identity) !== expectedHeader) {
    throw new Error(`IPC template 30 command identity ${identity} has the wrong header value`);
  }
}
for (const [name, mapping] of ipcTemplates31) {
  const entry = functionsByName.get(name);
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`${name} has invalid or overlapping IPC template 31 literal slots`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].symbol;
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = ipcIdentityWords.get(identity);
    const priorIdentity = ipcWordIdentities.get(privateWord);
    if ((priorWord !== undefined && priorWord !== privateWord) ||
        (priorIdentity !== undefined && priorIdentity !== identity)) {
      throw new Error(`IPC template 31 literal equality is inconsistent for ${name} slot ${index}`);
    }
    ipcIdentityWords.set(identity, privateWord);
    ipcWordIdentities.set(privateWord, identity);
  }
  ipcMappedBytes += entry.size;
  ipcMappedSlots += mapping.literals.length;
}
if (ipcMappedBytes !== 24972 || ipcMappedSlots !== 474 ||
    ipcIdentityWords.size !== 237 || ipcWordIdentities.size !== 237) {
  throw new Error("The 474 IPC slots must form a 237-to-237 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates32) {
  const entry = functionsByName.get(name);
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + 12;
  if (slotStart % 4 !== 0 || offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`${name} has invalid or overlapping IPC template 32 literal slots`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].symbol;
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = ipcIdentityWords.get(identity);
    const priorIdentity = ipcWordIdentities.get(privateWord);
    if ((priorWord !== undefined && priorWord !== privateWord) ||
        (priorIdentity !== undefined && priorIdentity !== identity)) {
      throw new Error(`IPC template 32 literal equality is inconsistent for ${name} slot ${index}`);
    }
    ipcIdentityWords.set(identity, privateWord);
    ipcWordIdentities.set(privateWord, identity);
  }
  ipcMappedBytes += entry.size;
  ipcMappedSlots += mapping.literals.length;
}
if (ipcMappedBytes !== 25780 || ipcMappedSlots !== 507 ||
    ipcIdentityWords.size !== 238 || ipcWordIdentities.size !== 238) {
  throw new Error("The 507 IPC slots must form a 238-to-238 identity/word bijection");
}
function registerModernIpcLiterals(name, mapping, batch) {
  const entry = functionsByName.get(name);
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || slotEnd - textStart > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`${name} has invalid or overlapping IPC template ${batch} literal slots`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].symbol;
    const privateWord = code.readUInt32LE(offset + mapping.literals[index].offset);
    const priorWord = ipcIdentityWords.get(identity);
    const priorIdentity = ipcWordIdentities.get(privateWord);
    if ((priorWord !== undefined && priorWord !== privateWord) ||
        (priorIdentity !== undefined && priorIdentity !== identity)) {
      throw new Error(`IPC template ${batch} literal equality is inconsistent for ${name} slot ${index}`);
    }
    ipcIdentityWords.set(identity, privateWord);
    ipcWordIdentities.set(privateWord, identity);
  }
  ipcMappedBytes += entry.size;
  ipcMappedSlots += mapping.literals.length;
}
for (const [name, mapping] of ipcTemplates33) registerModernIpcLiterals(name, mapping, 33);
if (ipcMappedBytes !== 26304 || ipcMappedSlots !== 512 ||
    ipcIdentityWords.size !== 243 || ipcWordIdentities.size !== 243) {
  throw new Error("The 512 IPC slots must form a 243-to-243 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates34) registerModernIpcLiterals(name, mapping, 34);
if (ipcMappedBytes !== 26880 || ipcMappedSlots !== 519 ||
    ipcIdentityWords.size !== 249 || ipcWordIdentities.size !== 249) {
  throw new Error("The 519 IPC slots must form a 249-to-249 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates35) registerModernIpcLiterals(name, mapping, 35);
if (ipcMappedBytes !== 27328 || ipcMappedSlots !== 523 ||
    ipcIdentityWords.size !== 253 || ipcWordIdentities.size !== 253) {
  throw new Error("The 523 IPC slots must form a 253-to-253 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates39) registerModernIpcLiterals(name, mapping, 39);
if (ipcMappedBytes !== 27692 || ipcMappedSlots !== 530 ||
    ipcIdentityWords.size !== 259 || ipcWordIdentities.size !== 259) {
  throw new Error("The 530 IPC slots must form a 259-to-259 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates40) registerModernIpcLiterals(name, mapping, 40);
if (ipcMappedBytes !== 28072 || ipcMappedSlots !== 536 ||
    ipcIdentityWords.size !== 263 || ipcWordIdentities.size !== 263) {
  throw new Error("The 536 IPC slots must form a 263-to-263 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates41) registerModernIpcLiterals(name, mapping, 41);
if (ipcMappedBytes !== 28496 || ipcMappedSlots !== 545 ||
    ipcIdentityWords.size !== 271 || ipcWordIdentities.size !== 271) {
  throw new Error("The 545 IPC slots must form a 271-to-271 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates42) registerModernIpcLiterals(name, mapping, 42);
if (ipcMappedBytes !== 28924 || ipcMappedSlots !== 554 ||
    ipcIdentityWords.size !== 279 || ipcWordIdentities.size !== 279) {
  throw new Error("The 554 IPC slots must form a 279-to-279 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates43) registerModernIpcLiterals(name, mapping, 43);
if (ipcMappedBytes !== 29476 || ipcMappedSlots !== 564 ||
    ipcIdentityWords.size !== 282 || ipcWordIdentities.size !== 282) {
  throw new Error("The 564 IPC slots must form a 282-to-282 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates44) registerModernIpcLiterals(name, mapping, 44);
if (ipcMappedBytes !== 30124 || ipcMappedSlots !== 572 ||
    ipcIdentityWords.size !== 286 || ipcWordIdentities.size !== 286) {
  throw new Error("The 572 IPC slots must form a 286-to-286 identity/word bijection");
}
for (const [name, mapping] of ipcTemplates45) registerModernIpcLiterals(name, mapping, 45);
if (ipcMappedBytes !== 31168 || ipcMappedSlots !== 572 ||
    ipcIdentityWords.size !== 286 || ipcWordIdentities.size !== 286) {
  throw new Error("IPC template 45 must preserve the 572-slot/286-class identity bijection");
}

const duplicateTemplate19IdentityWords = new Map();
for (const [name, mapping] of duplicateTemplates19) {
  const definition = duplicateTemplates19Config.templates[mapping.template];
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 19 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds duplicate-template 19 identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} duplicate-template 19 identity slots overlap inventoried function ${overlap.name}`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].identity;
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = duplicateTemplate19IdentityWords.get(identity);
    if (priorWord !== undefined && priorWord !== privateWord) {
      throw new Error(`Duplicate-template 19 identity equality is inconsistent for ${name} slot ${index}`);
    }
    duplicateTemplate19IdentityWords.set(identity, privateWord);
  }
}
for (const identities of [
  ["objectVtable00170CC0", "objectVtable002AFCCC"],
  ["type002FC244", "type00302C5C", "type00305720"],
  ["activeEntryBase1", "activeEntryBase2", "activeEntryBase3", "activeEntryBase4"],
  ["ownedObjectSlot003B0994", "ownedObjectSlot003B0B80", "ownedObjectSlot003B14C0"],
]) {
  if (new Set(identities.map((identity) => duplicateTemplate19IdentityWords.get(identity))).size !== identities.length) {
    throw new Error("Duplicate-template 19 distinct identity classes alias in the target");
  }
}

const duplicateTemplate21IdentityWords = new Map();
for (const [name, mapping] of duplicateTemplates21) {
  const definition = duplicateTemplates21Config.templates[mapping.template];
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 21 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds duplicate-template 21 identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} duplicate-template 21 identity slots overlap inventoried function ${overlap.name}`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].identity;
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = duplicateTemplate21IdentityWords.get(identity);
    if (priorWord !== undefined && priorWord !== privateWord) {
      throw new Error(`Duplicate-template 21 identity equality is inconsistent for ${name} slot ${index}`);
    }
    duplicateTemplate21IdentityWords.set(identity, privateWord);
  }
}
for (const identities of [
  ["typeShared", "type0028D188", "type00330C0C", "type00374CBC", "type0039BC80"],
  ["dispatchTable0030E398", "dispatchTable0030F074"],
  ["entryTag004BF560", "entryTag004BF594"],
  ["error004A9E30", "error004A9EB4"],
]) {
  if (new Set(identities.map((identity) => duplicateTemplate21IdentityWords.get(identity))).size !== identities.length) {
    throw new Error("Duplicate-template 21 distinct identity classes alias in the target");
  }
}

const duplicateTemplate22IdentityWords = new Map();
for (const [name, mapping] of duplicateTemplates22) {
  const definition = duplicateTemplates22Config.templates[mapping.template];
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 22 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds duplicate-template 22 identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} duplicate-template 22 identity slots overlap inventoried function ${overlap.name}`);
  }
  if (mapping.call !== undefined) {
    const callee = functionsByName.get(mapping.call);
    const callWord = code.readUInt32LE(offset + definition.callOffset);
    if (callee?.mode !== "$a" || !isArmCallTo(callWord, entry.address + definition.callOffset, callee.address)) {
      throw new Error(`${name} does not call ${mapping.call} at audited offset ${definition.callOffset}`);
    }
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].identity;
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = duplicateTemplate22IdentityWords.get(identity);
    if (priorWord !== undefined && priorWord !== privateWord) {
      throw new Error(`Duplicate-template 22 identity equality is inconsistent for ${name} slot ${index}`);
    }
    duplicateTemplate22IdentityWords.set(identity, privateWord);
  }
}
if (duplicateTemplate22IdentityWords.size !== 1 ||
    !duplicateTemplate22IdentityWords.has("presence")) {
  throw new Error("Duplicate-template 22 presence identity class is invalid");
}

const duplicateTemplate23IdentityWords = new Map();
for (const [name, mapping] of duplicateTemplates23) {
  const definition = duplicateTemplates23Config.templates[mapping.template];
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 23 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds duplicate-template 23 identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} duplicate-template 23 identity slots overlap inventoried function ${overlap.name}`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identity = mapping.literals[index].identity;
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const priorWord = duplicateTemplate23IdentityWords.get(identity);
    if (priorWord !== undefined && priorWord !== privateWord) {
      throw new Error(`Duplicate-template 23 identity equality is inconsistent for ${name} slot ${index}`);
    }
    duplicateTemplate23IdentityWords.set(identity, privateWord);
  }
}
if (duplicateTemplate23IdentityWords.size !== 16 ||
    new Set(duplicateTemplate23IdentityWords.values()).size !== 16) {
  throw new Error("Duplicate-template 23 identities must form 16 distinct equality classes");
}

for (const [name, mapping] of duplicateTemplates24) {
  const definition = duplicateTemplates24Config.templates[mapping.template];
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 24 function`);
  }
}

const duplicateTemplate25IdentityWords = new Map();
for (const [name, mapping] of duplicateTemplates25) {
  const definition = duplicateTemplates25Config.templates[mapping.template];
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 25 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + mapping.literals.length * 4;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + mapping.literals.length * 4 > code.length) {
    throw new Error(`${name} has invalid or out-of-bounds duplicate-template 25 identity slots`);
  }
  const overlap = functions.find((candidate) =>
    candidate.address < slotEnd && candidate.address + candidate.size > slotStart);
  if (overlap !== undefined) {
    throw new Error(`${name} duplicate-template 25 identity slots overlap inventoried function ${overlap.name}`);
  }
  for (let index = 0; index < mapping.literals.length; index++) {
    const identityName = mapping.literals[index].identity;
    const identity = duplicateTemplates25Config.literalIdentities[identityName];
    const privateWord = code.readUInt32LE(offset + entry.size + index * 4);
    const segmentName = identity.class === "data-address" ? "data" :
      identity.class === "rodata-address" ? "rodata" : undefined;
    if (segmentName !== undefined) {
      const segment = targetSegments.get(segmentName);
      if (privateWord < segment.address || privateWord >= segment.address + segment.size) {
        throw new Error(`${name} duplicate-template 25 identity ${identityName} is outside ${segmentName}`);
      }
    }
    const priorWord = duplicateTemplate25IdentityWords.get(identityName);
    if (priorWord !== undefined && priorWord !== privateWord) {
      throw new Error(`Duplicate-template 25 identity equality is inconsistent for ${name} slot ${index}`);
    }
    duplicateTemplate25IdentityWords.set(identityName, privateWord);
  }
}
if (duplicateTemplate25IdentityWords.size !== 9 ||
    new Set(duplicateTemplate25IdentityWords.values()).size !== 9) {
  throw new Error("Duplicate-template 25 identities must form 9 distinct equality classes");
}

const duplicateTemplate26ViewContents = new Map();
const duplicateTemplate26BlockAddresses = new Set();
for (const [name, mapping] of duplicateTemplates26) {
  const definition = duplicateTemplates26ExpectedTemplates.get(mapping.template);
  const entry = functionsByName.get(name);
  const destination = functionsByName.get(mapping.branchTarget);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== definition.bodySize ||
      destination === undefined || destination.mode !== "$a") {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 26 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 26 body`);
  }
  const branchWord = code.readUInt32LE(offset + definition.branchOffset);
  const isCall = definition.branchKind === "conditional-link";
  if (!isArmBranchTo(branchWord, entry.address + definition.branchOffset, destination.address,
    isCall ? 0xb : 0xe, isCall)) {
    throw new Error(`${name} does not branch to ${mapping.branchTarget} at its audited offset`);
  }
  if (mapping.tableBlock !== undefined) {
    const block = duplicateTemplate26Blocks[mapping.tableBlock];
    if (block === undefined) throw new Error(`${name} names an unknown duplicate-template 26 table block`);
    const blockAddress = entry.address + block.views.selector.bodyRelativeOffset;
    const blockOffset = offset + block.views.selector.bodyRelativeOffset;
    if (blockAddress % block.alignment !== 0 || blockOffset < 0 ||
        blockOffset + block.views.selector.size > code.length || duplicateTemplate26BlockAddresses.has(blockAddress)) {
      throw new Error(`${name} has an invalid or non-distinct duplicate-template 26 table block`);
    }
    duplicateTemplate26BlockAddresses.add(blockAddress);
    for (const [viewName, view] of Object.entries(block.views).filter(([, view]) => view.size !== undefined)) {
      const bytes = code.subarray(offset + view.bodyRelativeOffset,
        offset + view.bodyRelativeOffset + view.size);
      const prior = duplicateTemplate26ViewContents.get(viewName);
      if (prior !== undefined && !bytes.equals(prior)) {
        throw new Error(`${name} table view ${viewName} violates its documented content equality`);
      }
      duplicateTemplate26ViewContents.set(viewName, bytes);
    }
  }
}
if (duplicateTemplate26BlockAddresses.size !== 3 || duplicateTemplate26ViewContents.size !== 1) {
  throw new Error("Duplicate-template 26 table block/view identity totals are invalid");
}

let duplicateTemplate27Reference;
for (const name of duplicateTemplates27.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate27Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 27 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 27 body`);
  }
  const body = code.subarray(offset, offset + entry.size);
  if (duplicateTemplate27Reference !== undefined && !body.equals(duplicateTemplate27Reference)) {
    throw new Error(`${name} violates duplicate-template 27 complete-body equality`);
  }
  duplicateTemplate27Reference = body;
}

let duplicateTemplate29Reference;
for (const [name, mapping] of duplicateTemplates29) {
  const entry = functionsByName.get(name);
  const helper = functionsByName.get(mapping.helper);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate29Definition.bodySize ||
      helper === undefined || helper.mode !== "$a") {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 29 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 29 body`);
  }
  const callWord = code.readUInt32LE(offset + duplicateTemplate29Definition.callOffset);
  if (!isArmCallTo(callWord, entry.address + duplicateTemplate29Definition.callOffset, helper.address)) {
    throw new Error(`${name} does not call ${mapping.helper} at its audited offset`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  body.fill(0, duplicateTemplate29Definition.callOffset, duplicateTemplate29Definition.callOffset + 4);
  if (duplicateTemplate29Reference !== undefined && !body.equals(duplicateTemplate29Reference)) {
    throw new Error(`${name} violates duplicate-template 29 normalized complete-body equality`);
  }
  duplicateTemplate29Reference = body;
}

let duplicateTemplate30Reference;
for (const [name, mapping] of duplicateTemplates30) {
  const entry = functionsByName.get(name);
  const helper = functionsByName.get(mapping.helper);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate30Definition.bodySize ||
      helper === undefined || helper.mode !== "$a") {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 30 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 30 body`);
  }
  const callWord = code.readUInt32LE(offset + duplicateTemplate30Definition.callOffset);
  if (!isArmCallTo(callWord, entry.address + duplicateTemplate30Definition.callOffset, helper.address)) {
    throw new Error(`${name} does not call ${mapping.helper} at its audited offset`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  body.fill(0, duplicateTemplate30Definition.callOffset, duplicateTemplate30Definition.callOffset + 4);
  if (duplicateTemplate30Reference !== undefined && !body.equals(duplicateTemplate30Reference)) {
    throw new Error(`${name} violates duplicate-template 30 normalized complete-body equality`);
  }
  duplicateTemplate30Reference = body;
}

const duplicateTemplate31UseContract = [
  [56, 1, 1344, -1280], [124, 5, 1420, -1288], [216, 9, 1512, -1288],
  [264, 1, 1560, -1288], [292, 1, 1588, -1288], [876, 14, 2172, -1288],
  [1148, 11, 2444, -1288], [1300, 2, 2588, -1280],
];
let duplicateTemplate31Reference;
for (const name of duplicateTemplates31.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate31Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 31 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 31 body`);
  }
  const body = code.subarray(offset, offset + entry.size);
  for (const [useOffset, register, displacement, slotOffset] of duplicateTemplate31UseContract) {
    const expected = (0xe51f0000 | (register << 12) | displacement) >>> 0;
    if (body.readUInt32LE(useOffset) !== expected || useOffset + 8 - displacement !== slotOffset) {
      throw new Error(`${name} violates the duplicate-template 31 negative-PC load contract at ${useOffset}`);
    }
  }
  if (duplicateTemplate31Reference !== undefined && !body.equals(duplicateTemplate31Reference)) {
    throw new Error(`${name} violates duplicate-template 31 complete-body equality`);
  }
  duplicateTemplate31Reference = body;
}

const duplicateTemplate32UseContract = [
  [424, 7, false, 444, -12], [696, 2, true, 1988, 2692],
  [832, 2, false, 844, -4], [980, 1, false, 992, -4],
  [1052, 9, false, 1072, -12], [1140, 10, false, 1160, -12],
  [1188, 1, false, 1208, -12], [1224, 1, false, 1244, -12],
];
let duplicateTemplate32Reference;
let duplicateTemplate32SlotTranslation;
let duplicateTemplate32ReferenceAddress;
for (const name of duplicateTemplates32.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate32Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 32 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 12 || offset + 2696 > code.length) {
    throw new Error(`${name} has out-of-bounds duplicate-template 32 symbolic slots or body`);
  }
  const body = code.subarray(offset, offset + entry.size);
  for (const [useOffset, register, positive, displacement, slotOffset] of duplicateTemplate32UseContract) {
    const opcode = positive ? 0xe59f0000 : 0xe51f0000;
    const expected = (opcode | (register << 12) | displacement) >>> 0;
    if (body.readUInt32LE(useOffset) !== expected ||
        useOffset + 8 + (positive ? displacement : -displacement) !== slotOffset) {
      throw new Error(`${name} violates the duplicate-template 32 PC-relative load contract at ${useOffset}`);
    }
  }
  const slots = [-12, -4, 2692].map((slotOffset) => entry.address + slotOffset);
  if (new Set(slots).size !== 3 || slots.some((address) => address % 4 !== 0)) {
    throw new Error(`${name} violates the duplicate-template 32 distinct aligned slot contract`);
  }
  if (duplicateTemplate32SlotTranslation !== undefined &&
      slots.some((address, index) => address - duplicateTemplate32SlotTranslation[index] !==
        entry.address - duplicateTemplate32ReferenceAddress)) {
    throw new Error(`${name} violates the duplicate-template 32 uniform slot translation contract`);
  }
  duplicateTemplate32SlotTranslation ??= slots;
  duplicateTemplate32ReferenceAddress ??= entry.address;
  if (duplicateTemplate32Reference !== undefined && !body.equals(duplicateTemplate32Reference)) {
    throw new Error(`${name} violates duplicate-template 32 complete-body equality`);
  }
  duplicateTemplate32Reference = body;
}

const duplicateTemplate33Allocator = functionsByName.get("func_00184990");
if (duplicateTemplate33Allocator?.mode !== "$a") {
  throw new Error("Duplicate-template 33 allocator identity is not an inventoried ARM function");
}
let duplicateTemplate33Reference;
for (const name of duplicateTemplates33.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate33Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 33 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 33 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates33CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate33Allocator.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate33Reference !== undefined && !body.equals(duplicateTemplate33Reference)) {
    throw new Error(`${name} violates duplicate-template 33 normalized complete-body equality`);
  }
  duplicateTemplate33Reference = body;
}

const duplicateTemplate35Allocator = functionsByName.get("func_00184990");
if (duplicateTemplate35Allocator?.mode !== "$a") {
  throw new Error("Duplicate-template 35 allocator identity is not an inventoried ARM function");
}
let duplicateTemplate35Reference;
for (const name of duplicateTemplates35.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate35Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 35 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 35 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates35CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate35Allocator.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate35Reference !== undefined && !body.equals(duplicateTemplate35Reference)) {
    throw new Error(`${name} violates duplicate-template 35 normalized complete-body equality`);
  }
  duplicateTemplate35Reference = body;
}

const duplicateTemplate36Allocator = functionsByName.get("func_00184990");
if (duplicateTemplate36Allocator?.mode !== "$a") {
  throw new Error("Duplicate-template 36 allocator identity is not an inventoried ARM function");
}
let duplicateTemplate36Reference;
for (const name of duplicateTemplates36.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate36Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 36 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 36 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates36CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate36Allocator.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate36Reference !== undefined && !body.equals(duplicateTemplate36Reference)) {
    throw new Error(`${name} violates duplicate-template 36 normalized complete-body equality`);
  }
  duplicateTemplate36Reference = body;
}

const duplicateTemplate37Allocator = functionsByName.get("func_00184990");
if (duplicateTemplate37Allocator?.mode !== "$a") {
  throw new Error("Duplicate-template 37 allocator identity is not an inventoried ARM function");
}
let duplicateTemplate37Reference;
for (const name of duplicateTemplates37.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate37Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 37 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 37 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates37CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate37Allocator.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate37Reference !== undefined && !body.equals(duplicateTemplate37Reference)) {
    throw new Error(`${name} violates duplicate-template 37 normalized complete-body equality`);
  }
  duplicateTemplate37Reference = body;
}

const duplicateTemplate38Helper = functionsByName.get("func_00312920");
if (duplicateTemplate38Helper?.mode !== "$a") {
  throw new Error("Duplicate-template 38 helper identity is not an inventoried ARM function");
}
const duplicateTemplate38LoadContract = [
  [8, 812, 828], [100, 724, 832], [164, 664, 836], [328, 504, 840],
];
let duplicateTemplate38Reference;
let duplicateTemplate38SharedValues;
const duplicateTemplate38DerivedValues = [];
for (const name of duplicateTemplates38.keys()) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate38Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 38 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size + 16 > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 38 body or literal pool`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const [useOffset, displacement, slotOffset] of duplicateTemplate38LoadContract) {
    if (body.readUInt32LE(useOffset) !== ((0xe59f0000 | displacement) >>> 0) ||
        useOffset + 8 + displacement !== slotOffset) {
      throw new Error(`${name} violates the duplicate-template 38 PC-relative load contract at ${useOffset}`);
    }
  }
  for (const call of duplicateTemplates38CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate38Helper.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate38Reference !== undefined && !body.equals(duplicateTemplate38Reference)) {
    throw new Error(`${name} violates duplicate-template 38 normalized complete-body equality`);
  }
  duplicateTemplate38Reference = body;
  const values = duplicateTemplates38SlotContract.map(({ offset: slotOffset }) =>
    code.readUInt32LE(offset + slotOffset));
  duplicateTemplate38DerivedValues.push(values[0]);
  if (duplicateTemplate38SharedValues !== undefined &&
      values.slice(1).some((value, index) => value !== duplicateTemplate38SharedValues[index])) {
    throw new Error(`${name} violates duplicate-template 38 shared literal equality`);
  }
  duplicateTemplate38SharedValues ??= values.slice(1);
}
if (new Set([...duplicateTemplate38DerivedValues, ...duplicateTemplate38SharedValues]).size !== 6) {
  throw new Error("Duplicate-template 38 literal values violate the six-class equality ledger");
}

const duplicateTemplate39Destinations = new Map();
for (const symbol of new Set(duplicateTemplates39CallContract
  .map(({ symbol }) => symbol).filter((symbol) => symbol !== "$self"))) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 39 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplate39Destinations.set(symbol, destination);
}
const duplicateTemplate39LoadContract = [
  [16, 0xe59f10a8, 192], [84, 0xe59f1068, 196], [124, 0xe59f0044, 200],
];
let duplicateTemplate39Reference;
const duplicateTemplate39IdentityValues = new Map();
const duplicateTemplate39ValueIdentities = new Map();
for (const [name, mapping] of duplicateTemplates39) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate39Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 39 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size + 12 > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 39 body or literal pool`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const [useOffset, instruction, slotOffset] of duplicateTemplate39LoadContract) {
    if (body.readUInt32LE(useOffset) !== instruction ||
        useOffset + 8 + (instruction & 0xfff) !== slotOffset) {
      throw new Error(`${name} violates the duplicate-template 39 PC-relative load contract at ${useOffset}`);
    }
  }
  for (const call of duplicateTemplates39CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    const destination = call.symbol === "$self" ? entry.address :
      duplicateTemplate39Destinations.get(call.symbol).address + (call.addend ?? 0);
    if (call.kind !== "R_ARM_CALL" || !isArmCallTo(instruction, entry.address + call.offset, destination)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    if (call.symbol !== "$self") body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate39Reference !== undefined && !body.equals(duplicateTemplate39Reference)) {
    throw new Error(`${name} violates duplicate-template 39 normalized complete-body equality`);
  }
  duplicateTemplate39Reference = body;
  for (let index = 0; index < mapping.literals.length; index += 1) {
    const identity = mapping.literals[index].identity;
    const value = code.readUInt32LE(offset + duplicateTemplates39SlotContract[index].offset);
    const priorValue = duplicateTemplate39IdentityValues.get(identity);
    const priorIdentity = duplicateTemplate39ValueIdentities.get(value);
    if ((priorValue !== undefined && priorValue !== value) ||
        (priorIdentity !== undefined && priorIdentity !== identity)) {
      throw new Error(`${name} violates duplicate-template 39 literal equality class ${identity}`);
    }
    duplicateTemplate39IdentityValues.set(identity, value);
    duplicateTemplate39ValueIdentities.set(value, identity);
  }
}
if (duplicateTemplate39IdentityValues.size !== 22 || duplicateTemplate39ValueIdentities.size !== 22) {
  throw new Error("Duplicate-template 39 literal values violate the 22-class equality ledger");
}

const duplicateTemplate40Allocator = functionsByName.get("func_00184990");
if (duplicateTemplate40Allocator?.mode !== "$a" || duplicateTemplate40Allocator.address % 4 !== 0) {
  throw new Error("Duplicate-template 40 allocator is not an inventoried ARM function");
}
let duplicateTemplate40Reference;
let duplicateTemplate40LiteralValue;
for (const [name] of duplicateTemplates40) {
  const entry = functionsByName.get(name);
  if (entry === undefined || entry.mode !== "$a" || entry.size !== duplicateTemplate40Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 40 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size + 4 > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 40 body or literal pool`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  const load = body.readUInt32LE(200);
  if (load !== 0xe59f12e0 || 200 + 8 + (load & 0xfff) !== 944) {
    throw new Error(`${name} violates the duplicate-template 40 PC-relative load contract`);
  }
  for (const call of duplicateTemplates40CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate40Allocator.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate40Reference !== undefined && !body.equals(duplicateTemplate40Reference)) {
    throw new Error(`${name} violates duplicate-template 40 normalized complete-body equality`);
  }
  duplicateTemplate40Reference = body;
  const literalValue = code.readUInt32LE(offset + 944);
  if (duplicateTemplate40LiteralValue !== undefined && literalValue !== duplicateTemplate40LiteralValue) {
    throw new Error(`${name} violates duplicate-template 40 shared literal equality`);
  }
  duplicateTemplate40LiteralValue = literalValue;
}

const duplicateTemplate41Destinations = new Map();
for (const symbol of new Set([
  ...duplicateTemplates41CallContract.filter(({ symbol }) => symbol !== "operation").map(({ symbol }) => symbol),
  ...duplicateTemplates41Expected.map(([, operation]) => operation),
])) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 41 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplate41Destinations.set(symbol, destination.address);
}
if (new Set(duplicateTemplates41Expected.map(([, operation]) =>
  duplicateTemplate41Destinations.get(operation))).size !== 2) {
  throw new Error("Duplicate-template 41 operation identities must be distinct");
}
let duplicateTemplate41Reference;
let duplicateTemplate41StateWord;
let duplicateTemplate41StatusWord;
for (const [name, operation] of duplicateTemplates41Expected) {
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate41Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 41 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + 8;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + 8 > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`${name} has invalid or overlapping duplicate-template 41 pool slots`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates41CallContract) {
    const symbol = call.symbol === "operation" ? operation : call.symbol;
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate41Destinations.get(symbol))) {
      throw new Error(`${name} does not call ${symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (body.readUInt32LE(20) !== 0xe59f546c || body.readUInt32LE(64) !== 0xe59f7444) {
    throw new Error(`${name} violates the duplicate-template 41 post-body pool-load contract`);
  }
  if (duplicateTemplate41Reference !== undefined && !body.equals(duplicateTemplate41Reference)) {
    throw new Error(`${name} violates duplicate-template 41 normalized complete-body equality`);
  }
  duplicateTemplate41Reference = body;
  const stateWord = code.readUInt32LE(offset + duplicateTemplates41PoolContract[0].offset);
  const statusWord = code.readUInt32LE(offset + duplicateTemplates41PoolContract[1].offset);
  if (stateWord === statusWord ||
      (duplicateTemplate41StateWord !== undefined && stateWord !== duplicateTemplate41StateWord) ||
      (duplicateTemplate41StatusWord !== undefined && statusWord !== duplicateTemplate41StatusWord)) {
    throw new Error(`${name} violates the duplicate-template 41 symbolic pool equality contract`);
  }
  duplicateTemplate41StateWord ??= stateWord;
  duplicateTemplate41StatusWord ??= statusWord;
}

const duplicateTemplate42Allocator = functionsByName.get("func_00184990");
if (duplicateTemplate42Allocator?.mode !== "$a" || duplicateTemplate42Allocator.address % 4 !== 0) {
  throw new Error("Duplicate-template 42 allocator is not an inventoried ARM function");
}
let duplicateTemplate42Reference;
for (const name of duplicateTemplates42Expected) {
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate42Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 42 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 42 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates42CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate42Allocator.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate42Reference !== undefined && !body.equals(duplicateTemplate42Reference)) {
    throw new Error(`${name} violates duplicate-template 42 normalized complete-body equality`);
  }
  duplicateTemplate42Reference = body;
}

const duplicateTemplate43Destinations = new Map();
for (const symbol of new Set([
  "func_00184990",
  ...duplicateTemplates43Expected.map(([, payloadInitializer]) => payloadInitializer),
])) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 43 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplate43Destinations.set(symbol, destination.address);
}
if (new Set(duplicateTemplate43Destinations.values()).size !== 3) {
  throw new Error("Duplicate-template 43 call identities must form three distinct target classes");
}
let duplicateTemplate43Reference;
for (const [name, payloadInitializer] of duplicateTemplates43Expected) {
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate43Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 43 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 43 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates43CallContract) {
    const symbol = call.symbol === "payloadInitializer" ? payloadInitializer : call.symbol;
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate43Destinations.get(symbol))) {
      throw new Error(`${name} does not call ${symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate43Reference !== undefined && !body.equals(duplicateTemplate43Reference)) {
    throw new Error(`${name} violates duplicate-template 43 normalized complete-body equality`);
  }
  duplicateTemplate43Reference = body;
}

const duplicateTemplate44Divider = functionsByName.get("func_0015EC10");
if (duplicateTemplate44Divider?.mode !== "$a" || duplicateTemplate44Divider.address % 4 !== 0) {
  throw new Error("Duplicate-template 44 divider is not an inventoried ARM function");
}
let duplicateTemplate44Reference;
for (const name of duplicateTemplates44Expected) {
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate44Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 44 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + entry.size > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 44 body`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates44CallContract) {
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate44Divider.address)) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate44Reference !== undefined && !body.equals(duplicateTemplate44Reference)) {
    throw new Error(`${name} violates duplicate-template 44 normalized complete-body equality`);
  }
  duplicateTemplate44Reference = body;
}

const duplicateTemplate45Destinations = new Map();
for (const symbol of new Set(duplicateTemplates45CallContract.map(({ symbol }) => symbol))) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 45 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplate45Destinations.set(symbol, destination.address);
}
const duplicateTemplate45IdentityValues = new Map();
const duplicateTemplate45ValueIdentities = new Map();
let duplicateTemplate45BodyReference;
let duplicateTemplate45ExtentReference;
for (const [name] of duplicateTemplates45Expected) {
  const mapping = duplicateTemplates45.get(name);
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate45Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 45 function`);
  }
  const offset = entry.address - textStart;
  const extentSize = entry.size + duplicateTemplate45Definition.poolSlots * 4;
  if (offset < 0 || offset + extentSize > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 45 body-plus-pool extent`);
  }
  const poolStart = entry.address + entry.size;
  const poolEnd = entry.address + extentSize;
  const overlap = functions.find((candidate) => candidate.name !== name &&
    candidate.address < poolEnd && candidate.address + candidate.size > poolStart);
  if (overlap !== undefined) {
    throw new Error(`${name} pool overlaps inventoried function ${overlap.name}`);
  }
  const extent = Buffer.from(code.subarray(offset, offset + extentSize));
  const normalizedBody = Buffer.from(extent.subarray(0, entry.size));
  for (const call of duplicateTemplates45CallContract) {
    const instruction = extent.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" || !isArmCallTo(instruction,
      entry.address + call.offset, duplicateTemplate45Destinations.get(call.symbol))) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    normalizedBody.fill(0, call.offset, call.offset + 4);
    extent.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate45BodyReference !== undefined &&
      !normalizedBody.equals(duplicateTemplate45BodyReference)) {
    throw new Error(`${name} violates duplicate-template 45 normalized complete-body equality`);
  }
  duplicateTemplate45BodyReference = normalizedBody;
  for (const literal of mapping.literals) {
    const slot = duplicateTemplates45SlotContract.find(({ offset: slotOffset, loadOffset }) =>
      slotOffset === literal.offset && loadOffset === literal.loadOffset);
    const identity = duplicateTemplates45Identities[literal.identity];
    if (slot === undefined || identity === undefined) {
      throw new Error(`${name} has an invalid duplicate-template 45 literal mapping`);
    }
    const load = extent.readUInt32LE(literal.loadOffset);
    const immediate = load & 0xfff;
    const loadedAddress = entry.address + literal.loadOffset + 8 +
      ((load & 0x00800000) !== 0 ? immediate : -immediate);
    if (!isAl(load) || (load & 0x0f7f0000) !== 0x051f0000 ||
        loadedAddress !== entry.address + literal.offset) {
      throw new Error(`${name} does not load its ${slot.role} slot at audited offset ${literal.loadOffset}`);
    }
    const privateValue = extent.readUInt32LE(literal.offset);
    const priorValue = duplicateTemplate45IdentityValues.get(literal.identity);
    const priorIdentity = duplicateTemplate45ValueIdentities.get(privateValue);
    if ((priorValue !== undefined && priorValue !== privateValue) ||
        (priorIdentity !== undefined && priorIdentity !== literal.identity)) {
      throw new Error(`${name} violates duplicate-template 45 literal equality classes`);
    }
    duplicateTemplate45IdentityValues.set(literal.identity, privateValue);
    duplicateTemplate45ValueIdentities.set(privateValue, literal.identity);
    extent.fill(0, literal.offset, literal.offset + 4);
  }
  if (duplicateTemplate45ExtentReference !== undefined &&
      !extent.equals(duplicateTemplate45ExtentReference)) {
    throw new Error(`${name} violates duplicate-template 45 normalized body-plus-pool equality`);
  }
  duplicateTemplate45ExtentReference = extent;
}
if (duplicateTemplate45IdentityValues.size !== 5 ||
    duplicateTemplate45ValueIdentities.size !== 5) {
  throw new Error("Duplicate-template 45 literal identities do not form the approved five classes");
}

const duplicateTemplate46Destinations = new Map();
for (const symbol of new Set(duplicateTemplates46CallContract.map(({ symbol }) => symbol))) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 46 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplate46Destinations.set(symbol, destination.address);
}
const duplicateTemplate46IdentityValues = new Map();
const duplicateTemplate46ValueIdentities = new Map();
let duplicateTemplate46BodyReference;
let duplicateTemplate46ExtentReference;
for (const [name] of duplicateTemplates46Expected) {
  const mapping = duplicateTemplates46.get(name);
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate46Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 46 function`);
  }
  const offset = entry.address - textStart;
  const extentSize = entry.size + duplicateTemplate46Definition.poolSlots * 4;
  if (offset < 0 || offset + extentSize > code.length) {
    throw new Error(`${name} has an out-of-bounds duplicate-template 46 body-plus-pool extent`);
  }
  const poolStart = entry.address + entry.size;
  const poolEnd = entry.address + extentSize;
  const overlap = functions.find((candidate) => candidate.name !== name &&
    candidate.address < poolEnd && candidate.address + candidate.size > poolStart);
  if (overlap !== undefined) throw new Error(`${name} pool overlaps inventoried function ${overlap.name}`);
  const extent = Buffer.from(code.subarray(offset, offset + extentSize));
  const normalizedBody = Buffer.from(extent.subarray(0, entry.size));
  for (const call of duplicateTemplates46CallContract) {
    const instruction = extent.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" || !isArmCallTo(instruction,
      entry.address + call.offset, duplicateTemplate46Destinations.get(call.symbol))) {
      throw new Error(`${name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    normalizedBody.fill(0, call.offset, call.offset + 4);
    extent.fill(0, call.offset, call.offset + 4);
  }
  if (duplicateTemplate46BodyReference !== undefined &&
      !normalizedBody.equals(duplicateTemplate46BodyReference)) {
    throw new Error(`${name} violates duplicate-template 46 normalized complete-body equality`);
  }
  duplicateTemplate46BodyReference = normalizedBody;
  for (const literal of mapping.literals) {
    const slot = duplicateTemplates46SlotContract.find(({ offset: slotOffset, loadOffset }) =>
      slotOffset === literal.offset && loadOffset === literal.loadOffset);
    if (slot === undefined || duplicateTemplates46Identities[literal.identity] === undefined) {
      throw new Error(`${name} has an invalid duplicate-template 46 literal mapping`);
    }
    const load = extent.readUInt32LE(literal.loadOffset);
    const immediate = load & 0xfff;
    const loadedAddress = entry.address + literal.loadOffset + 8 +
      ((load & 0x00800000) !== 0 ? immediate : -immediate);
    if (!isAl(load) || (load & 0x0f7f0000) !== 0x051f0000 ||
        loadedAddress !== entry.address + literal.offset) {
      throw new Error(`${name} does not load its ${slot.role} slot at audited offset ${literal.loadOffset}`);
    }
    const privateValue = extent.readUInt32LE(literal.offset);
    const priorValue = duplicateTemplate46IdentityValues.get(literal.identity);
    const priorIdentity = duplicateTemplate46ValueIdentities.get(privateValue);
    if ((priorValue !== undefined && priorValue !== privateValue) ||
        (priorIdentity !== undefined && priorIdentity !== literal.identity)) {
      throw new Error(`${name} violates duplicate-template 46 literal equality classes`);
    }
    duplicateTemplate46IdentityValues.set(literal.identity, privateValue);
    duplicateTemplate46ValueIdentities.set(privateValue, literal.identity);
    extent.fill(0, literal.offset, literal.offset + 4);
  }
  if (duplicateTemplate46ExtentReference !== undefined &&
      !extent.equals(duplicateTemplate46ExtentReference)) {
    throw new Error(`${name} violates duplicate-template 46 normalized body-plus-pool equality`);
  }
  duplicateTemplate46ExtentReference = extent;
}
if (duplicateTemplate46IdentityValues.size !== 4 || duplicateTemplate46ValueIdentities.size !== 4) {
  throw new Error("Duplicate-template 46 literal identities do not form four distinct classes");
}

const duplicateTemplates47AllCalls = new Map();
for (const call of [
  ...duplicateTemplates47CommonCalls,
  ...duplicateTemplates47Expected.flatMap(({ directCalls }) => directCalls),
]) {
  const destination = functionsByName.get(call.symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 47 call identity ${call.symbol} is not an inventoried ARM function`);
  }
  duplicateTemplates47AllCalls.set(call.symbol, destination.address);
}
const duplicateTemplate47IdentityValues = new Map();
const duplicateTemplate47ValueIdentities = new Map();
let duplicateTemplate47BodyReference;
let duplicateTemplate47ExtentReference;
for (const expected of duplicateTemplates47Expected) {
  const mapping = duplicateTemplates47.get(expected.name);
  const entry = functionsByName.get(expected.name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate47Definition.bodySize) {
    throw new Error(`${expected.name} is not the configured inventoried ARM duplicate-template 47 function`);
  }
  const offset = entry.address - textStart;
  const extentSize = entry.size + duplicateTemplate47Definition.poolSlots * 4;
  if (offset < 0 || offset + extentSize > code.length) {
    throw new Error(`${expected.name} has an out-of-bounds duplicate-template 47 body-plus-pool extent`);
  }
  const nextGlobal = functions.reduce((nearest, candidate) =>
    candidate.address > entry.address &&
      (nearest === undefined || candidate.address < nearest.address) ? candidate : nearest,
  undefined);
  if (nextGlobal === undefined || nextGlobal.address - entry.address !== expected.nextGlobalOffset) {
    throw new Error(`${expected.name} does not have its approved next-global boundary`);
  }
  const poolStart = entry.address + entry.size;
  const poolEnd = entry.address + extentSize;
  const overlap = functions.find((candidate) => candidate.name !== expected.name &&
    candidate.address < poolEnd && candidate.address + candidate.size > poolStart);
  if (overlap !== undefined) {
    throw new Error(`${expected.name} pool overlaps inventoried function ${overlap.name}`);
  }
  const extent = Buffer.from(code.subarray(offset, offset + extentSize));
  const normalizedBody = Buffer.from(extent.subarray(0, entry.size));
  const calls = [...duplicateTemplates47CommonCalls, ...mapping.directCalls];
  for (const call of calls) {
    const instruction = extent.readUInt32LE(call.offset);
    const destination = duplicateTemplates47AllCalls.get(call.symbol) + (call.addend ?? 0);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, destination)) {
      throw new Error(`${expected.name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    normalizedBody.fill(0, call.offset, call.offset + 4);
    extent.fill(0, call.offset, call.offset + 4);
  }
  const indirectOffsets = [];
  const localTargets = new Set();
  for (let cursor = 0; cursor < entry.size; cursor += 4) {
    const instruction = extent.readUInt32LE(cursor);
    if ((instruction & 0x0ffffff0) === 0x012fff30) indirectOffsets.push(cursor);
    if ((instruction & 0x0f000000) === 0x0a000000) {
      let displacement = instruction & 0x00ffffff;
      if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
      const target = cursor + 8 + displacement * 4;
      if (target >= 0 && target < entry.size) localTargets.add(target);
    }
  }
  if (JSON.stringify(indirectOffsets) !==
      JSON.stringify(duplicateTemplates47IndirectCalls.map(({ offset: callOffset }) => callOffset))) {
    throw new Error(`${expected.name} has unexpected duplicate-template 47 indirect-call offsets`);
  }
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !==
      JSON.stringify(duplicateTemplates47LabelOffsets)) {
    throw new Error(`${expected.name} has unexpected duplicate-template 47 local branch targets`);
  }
  if (duplicateTemplate47BodyReference !== undefined &&
      !normalizedBody.equals(duplicateTemplate47BodyReference)) {
    throw new Error(`${expected.name} violates duplicate-template 47 normalized complete-body equality`);
  }
  duplicateTemplate47BodyReference = normalizedBody;
  for (const slot of duplicateTemplates47SlotContract) {
    const load = extent.readUInt32LE(slot.loadOffset);
    const immediate = load & 0xfff;
    const loadedAddress = entry.address + slot.loadOffset + 8 +
      ((load & 0x00800000) !== 0 ? immediate : -immediate);
    if (slot.kind !== "R_ARM_ABS32" || !isAl(load) ||
        (load & 0x0f7f0000) !== 0x051f0000 ||
        loadedAddress !== entry.address + slot.offset) {
      throw new Error(`${expected.name} does not load ${slot.identity} at audited offset ${slot.loadOffset}`);
    }
    const privateValue = extent.readUInt32LE(slot.offset);
    const priorValue = duplicateTemplate47IdentityValues.get(slot.identity);
    const priorIdentity = duplicateTemplate47ValueIdentities.get(privateValue);
    if ((priorValue !== undefined && priorValue !== privateValue) ||
        (priorIdentity !== undefined && priorIdentity !== slot.identity)) {
      throw new Error(`${expected.name} violates duplicate-template 47 literal equality classes`);
    }
    duplicateTemplate47IdentityValues.set(slot.identity, privateValue);
    duplicateTemplate47ValueIdentities.set(privateValue, slot.identity);
    extent.fill(0, slot.offset, slot.offset + 4);
  }
  if (duplicateTemplate47ExtentReference !== undefined &&
      !extent.equals(duplicateTemplate47ExtentReference)) {
    throw new Error(`${expected.name} violates duplicate-template 47 normalized body-plus-pool equality`);
  }
  duplicateTemplate47ExtentReference = extent;
}
if (duplicateTemplate47IdentityValues.size !== 3 ||
    duplicateTemplate47ValueIdentities.size !== 3) {
  throw new Error("Duplicate-template 47 literal identities do not form three shared distinct classes");
}

const duplicateTemplates48AllCalls = new Map();
for (const symbol of new Set([
  ...duplicateTemplates48CommonCalls.map(({ symbol }) => symbol),
  ...duplicateTemplates48Expected.map(({ constructor }) => constructor),
])) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 48 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplates48AllCalls.set(symbol, destination.address);
}
let duplicateTemplate48BodyReference;
let duplicateTemplate48SharedIdentifierOne;
let duplicateTemplate48SharedIdentifierTwo;
const duplicateTemplate48ExpansionIdentifiers = [];
for (const expected of duplicateTemplates48Expected) {
  const entry = functionsByName.get(expected.name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate48Definition.bodySize) {
    throw new Error(`${expected.name} is not the configured inventoried ARM duplicate-template 48 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + expected.templateMaterialEndOffset > code.length) {
    throw new Error(`${expected.name} has out-of-bounds duplicate-template 48 material`);
  }
  const nextGlobal = functions.reduce((nearest, candidate) =>
    candidate.address > entry.address &&
      (nearest === undefined || candidate.address < nearest.address) ? candidate : nearest,
  undefined);
  if (nextGlobal === undefined || nextGlobal.address - entry.address !== expected.nextGlobalOffset) {
    throw new Error(`${expected.name} does not have its approved next-global boundary`);
  }
  const material = Buffer.from(code.subarray(offset, offset + expected.templateMaterialEndOffset));
  const normalizedBody = Buffer.from(material.subarray(0, entry.size));
  const calls = [...duplicateTemplates48CommonCalls,
    { offset: expected.constructorCallOffset, kind: "R_ARM_CALL", symbol: expected.constructor }];
  for (const call of calls) {
    const instruction = material.readUInt32LE(call.offset);
    const destination = duplicateTemplates48AllCalls.get(call.symbol) + (call.addend ?? 0);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, destination)) {
      throw new Error(`${expected.name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    normalizedBody.fill(0, call.offset, call.offset + 4);
  }
  const localTargets = new Set();
  const callOffsets = new Set(calls.map(({ offset: callOffset }) => callOffset));
  for (let cursor = 0; cursor < entry.size; cursor += 4) {
    if (callOffsets.has(cursor)) continue;
    const instruction = material.readUInt32LE(cursor);
    if ((instruction & 0x0ffffff0) === 0x012fff30) {
      throw new Error(`${expected.name} has an unexpected duplicate-template 48 indirect call`);
    }
    if ((instruction & 0x0f000000) === 0x0a000000) {
      let displacement = instruction & 0x00ffffff;
      if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
      const target = cursor + 8 + displacement * 4;
      if (target >= 0 && target < entry.size) localTargets.add(target);
    }
  }
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !==
      JSON.stringify(duplicateTemplates48LabelOffsets)) {
    throw new Error(`${expected.name} has unexpected duplicate-template 48 local branch targets`);
  }
  if (duplicateTemplate48BodyReference !== undefined &&
      !normalizedBody.equals(duplicateTemplate48BodyReference)) {
    throw new Error(`${expected.name} violates duplicate-template 48 normalized complete-body equality`);
  }
  duplicateTemplate48BodyReference = normalizedBody;
  for (const identifier of duplicateTemplates48IdentifierContract) {
    const instruction = material.readUInt32LE(identifier.addressInstructionOffset);
    const opcode = instruction >>> 21 & 0xf;
    const immediateByte = instruction & 0xff;
    const rotation = (instruction >>> 8 & 0xf) * 2;
    const immediate = rotation === 0 ? immediateByte :
      ((immediateByte >>> rotation) | (immediateByte << (32 - rotation))) >>> 0;
    const target = identifier.addressInstructionOffset + 8 + (opcode === 4 ? immediate : -immediate);
    if (!isAl(instruction) || (instruction >>> 25 & 1) !== 1 ||
        (instruction >>> 16 & 0xf) !== 15 || (opcode !== 2 && opcode !== 4) ||
        target !== identifier.offset) {
      throw new Error(`${expected.name} does not address ${identifier.role} at its audited offset`);
    }
  }
  const identifierOne = material.subarray(272, 293);
  const identifierTwo = material.subarray(296, 319);
  const identifierThree = material.subarray(320, 320 + expected.identifierThreeBytes);
  if (identifierOne.subarray(0, -1).includes(0) || identifierOne.at(-1) !== 0 ||
      identifierTwo.subarray(0, -1).includes(0) || identifierTwo.at(-1) !== 0 ||
      identifierThree.subarray(0, -1).includes(0) || identifierThree.at(-1) !== 0) {
    throw new Error(`${expected.name} violates duplicate-template 48 identifier termination and length`);
  }
  if ((duplicateTemplate48SharedIdentifierOne !== undefined &&
       !identifierOne.equals(duplicateTemplate48SharedIdentifierOne)) ||
      (duplicateTemplate48SharedIdentifierTwo !== undefined &&
       !identifierTwo.equals(duplicateTemplate48SharedIdentifierTwo))) {
    throw new Error(`${expected.name} violates duplicate-template 48 shared identifier equality`);
  }
  duplicateTemplate48SharedIdentifierOne = Buffer.from(identifierOne);
  duplicateTemplate48SharedIdentifierTwo = Buffer.from(identifierTwo);
  if (duplicateTemplate48ExpansionIdentifiers.some((prior) => identifierThree.equals(prior))) {
    throw new Error(`${expected.name} violates duplicate-template 48 expansion identifier distinction`);
  }
  duplicateTemplate48ExpansionIdentifiers.push(Buffer.from(identifierThree));
}

const duplicateTemplates49Destinations = new Map();
for (const symbol of new Set([
  ...duplicateTemplates49CommonCalls.map(({ symbol }) => symbol),
  ...duplicateTemplates49TailBranches.map(({ symbol }) => symbol),
  ...duplicateTemplates49Expected.map(({ helper }) => helper),
])) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 49 branch identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplates49Destinations.set(symbol, destination.address);
}
let duplicateTemplate49BodyReference;
let duplicateTemplate49SlotValue;
for (const expected of duplicateTemplates49Expected) {
  const entry = functionsByName.get(expected.name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate49Definition.bodySize) {
    throw new Error(`${expected.name} is not the configured inventoried ARM duplicate-template 49 function`);
  }
  const offset = entry.address - textStart;
  if (offset < 0 || offset + expected.anonymousMaterialOffset > code.length) {
    throw new Error(`${expected.name} has out-of-bounds duplicate-template 49 material`);
  }
  const nextGlobal = functions.reduce((nearest, candidate) =>
    candidate.address > entry.address &&
      (nearest === undefined || candidate.address < nearest.address) ? candidate : nearest,
  undefined);
  if (nextGlobal === undefined || nextGlobal.address - entry.address !== expected.nextGlobalOffset) {
    throw new Error(`${expected.name} does not have its approved duplicate-template 49 next-global boundary`);
  }
  const extent = Buffer.from(code.subarray(offset, offset + expected.anonymousMaterialOffset));
  const normalizedBody = Buffer.from(extent.subarray(0, entry.size));
  const calls = [
    ...duplicateTemplates49CommonCalls,
    { offset: expected.helperCallOffset, kind: "R_ARM_CALL", symbol: expected.helper },
  ];
  for (const call of calls) {
    const instruction = extent.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" || !isArmCallTo(instruction, entry.address + call.offset,
      duplicateTemplates49Destinations.get(call.symbol))) {
      throw new Error(`${expected.name} does not call ${call.symbol} at audited offset ${call.offset}`);
    }
    normalizedBody.fill(0, call.offset, call.offset + 4);
  }
  const tail = duplicateTemplates49TailBranches[0];
  if (!isArmJumpTo(extent.readUInt32LE(tail.offset), entry.address + tail.offset,
    duplicateTemplates49Destinations.get(tail.symbol) + tail.addend)) {
    throw new Error(`${expected.name} does not tail-branch to ${tail.symbol}${tail.addend} at audited offset ${tail.offset}`);
  }
  normalizedBody.fill(0, tail.offset, tail.offset + 4);
  if (extent.readUInt32LE(108) !== 0xe12fff31) {
    throw new Error(`${expected.name} does not contain the approved indirect call at offset 108`);
  }
  const localTargets = new Set();
  const externalOffsets = new Set([...calls.map(({ offset: callOffset }) => callOffset), tail.offset]);
  for (let cursor = 0; cursor < entry.size; cursor += 4) {
    if (externalOffsets.has(cursor)) continue;
    const instruction = extent.readUInt32LE(cursor);
    if ((instruction & 0x0f000000) === 0x0a000000) {
      let displacement = instruction & 0x00ffffff;
      if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
      const target = cursor + 8 + displacement * 4;
      if (target >= 0 && target < entry.size) localTargets.add(target);
    }
  }
  if (JSON.stringify([...localTargets].sort((a, b) => a - b)) !==
      JSON.stringify(duplicateTemplates49LabelOffsets)) {
    throw new Error(`${expected.name} has unexpected duplicate-template 49 local branch targets`);
  }
  if (duplicateTemplate49BodyReference !== undefined &&
      !normalizedBody.equals(duplicateTemplate49BodyReference)) {
    throw new Error(`${expected.name} violates duplicate-template 49 normalized complete-body equality`);
  }
  duplicateTemplate49BodyReference = normalizedBody;
  const load = extent.readUInt32LE(32);
  if (((load & 0xfffff000) >>> 0) !== 0xe59f0000 || 32 + 8 + (load & 0xfff) !== 380) {
    throw new Error(`${expected.name} does not load its post-body identity slot at audited offset 32`);
  }
  const slotValue = extent.readUInt32LE(380);
  if (duplicateTemplate49SlotValue !== undefined && slotValue !== duplicateTemplate49SlotValue) {
    throw new Error(`${expected.name} violates duplicate-template 49 shared identity equality`);
  }
  duplicateTemplate49SlotValue = slotValue;
}

const duplicateTemplate34Destinations = new Map();
for (const symbol of new Set([
  ...duplicateTemplates34CallContract.filter(({ symbol }) => symbol !== "operation").map(({ symbol }) => symbol),
  ...duplicateTemplates34Expected.map(([, operation]) => operation),
])) {
  const destination = functionsByName.get(symbol);
  if (destination?.mode !== "$a" || destination.address % 4 !== 0) {
    throw new Error(`Duplicate-template 34 call identity ${symbol} is not an inventoried ARM function`);
  }
  duplicateTemplate34Destinations.set(symbol, destination.address);
}
if (new Set(duplicateTemplates34Expected.map(([, operation]) =>
  duplicateTemplate34Destinations.get(operation))).size !== 3) {
  throw new Error("Duplicate-template 34 operation identities must be pairwise distinct");
}
let duplicateTemplate34Reference;
let duplicateTemplate34StateWord;
let duplicateTemplate34StatusWord;
for (const [name, operation] of duplicateTemplates34Expected) {
  const entry = functionsByName.get(name);
  if (entry?.mode !== "$a" || entry.size !== duplicateTemplate34Definition.bodySize) {
    throw new Error(`${name} is not the configured inventoried ARM duplicate-template 34 function`);
  }
  const offset = entry.address - textStart;
  const slotStart = entry.address + entry.size;
  const slotEnd = slotStart + 8;
  if (slotStart % 4 !== 0 || offset < 0 || offset + entry.size + 8 > code.length ||
      functions.some((candidate) => candidate.address < slotEnd &&
        candidate.address + candidate.size > slotStart)) {
    throw new Error(`${name} has invalid or overlapping duplicate-template 34 pool slots`);
  }
  const body = Buffer.from(code.subarray(offset, offset + entry.size));
  for (const call of duplicateTemplates34CallContract) {
    const symbol = call.symbol === "operation" ? operation : call.symbol;
    const instruction = body.readUInt32LE(call.offset);
    if (call.kind !== "R_ARM_CALL" ||
        !isArmCallTo(instruction, entry.address + call.offset, duplicateTemplate34Destinations.get(symbol))) {
      throw new Error(`${name} does not call ${symbol} at audited offset ${call.offset}`);
    }
    body.fill(0, call.offset, call.offset + 4);
  }
  if (body.readUInt32LE(20) !== 0xe59f547c || body.readUInt32LE(72) !== 0xe59f744c) {
    throw new Error(`${name} violates the duplicate-template 34 post-body pool-load contract`);
  }
  if (duplicateTemplate34Reference !== undefined && !body.equals(duplicateTemplate34Reference)) {
    throw new Error(`${name} violates duplicate-template 34 normalized complete-body equality`);
  }
  duplicateTemplate34Reference = body;
  const stateWord = code.readUInt32LE(offset + 1176);
  const statusWord = code.readUInt32LE(offset + 1180);
  if (stateWord === statusWord ||
      (duplicateTemplate34StateWord !== undefined && stateWord !== duplicateTemplate34StateWord) ||
      (duplicateTemplate34StatusWord !== undefined && statusWord !== duplicateTemplate34StatusWord)) {
    throw new Error(`${name} violates the duplicate-template 34 symbolic pool equality contract`);
  }
  duplicateTemplate34StateWord ??= stateWord;
  duplicateTemplate34StatusWord ??= statusWord;
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
  const ipcUniqueTemplate = ipcUniqueTemplates.get(entry.name);
  const ipcTemplate15 = ipcTemplates15.get(entry.name);
  const ipcTemplate16 = ipcTemplates16.get(entry.name);
  const ipcTemplate17 = ipcTemplates17.get(entry.name);
  const ipcTemplate18 = ipcTemplates18.get(entry.name);
  const ipcTemplate19 = ipcTemplates19.get(entry.name);
  const ipcTemplate20 = ipcTemplates20.get(entry.name);
  const ipcTemplate21 = ipcTemplates21.get(entry.name);
  const ipcTemplate22 = ipcTemplates22.get(entry.name);
  const ipcTemplate23 = ipcTemplates23.get(entry.name);
  const ipcTemplate24 = ipcTemplates24.get(entry.name);
  const ipcTemplate25 = ipcTemplates25.get(entry.name);
  const ipcTemplate26 = ipcTemplates26.get(entry.name);
  const ipcTemplate27 = ipcTemplates27.get(entry.name);
  const ipcTemplate28 = ipcTemplates28.get(entry.name);
  const ipcTemplate29 = ipcTemplates29.get(entry.name);
  const ipcTemplate30 = ipcTemplates30.get(entry.name);
  const ipcTemplate31 = ipcTemplates31.get(entry.name);
  const ipcTemplate32 = ipcTemplates32.get(entry.name);
  const ipcTemplate33 = ipcTemplates33.get(entry.name);
  const ipcTemplate34 = ipcTemplates34.get(entry.name);
  const ipcTemplate35 = ipcTemplates35.get(entry.name);
  const ipcTemplate36 = ipcTemplates36.get(entry.name);
  const ipcTemplate37 = ipcTemplates37.get(entry.name);
  const ipcTemplate38 = ipcTemplates38.get(entry.name);
  const ipcTemplate39 = ipcTemplates39.get(entry.name);
  const ipcTemplate40 = ipcTemplates40.get(entry.name);
  const ipcTemplate41 = ipcTemplates41.get(entry.name);
  const ipcTemplate42 = ipcTemplates42.get(entry.name);
  const ipcTemplate43 = ipcTemplates43.get(entry.name);
  const ipcTemplate44 = ipcTemplates44.get(entry.name);
  const ipcTemplate45 = ipcTemplates45.get(entry.name);
  const duplicateTemplate19 = duplicateTemplates19.get(entry.name);
  const duplicateTemplate21 = duplicateTemplates21.get(entry.name);
  const duplicateTemplate22 = duplicateTemplates22.get(entry.name);
  const duplicateTemplate23 = duplicateTemplates23.get(entry.name);
  const duplicateTemplate24 = duplicateTemplates24.get(entry.name);
  const duplicateTemplate25 = duplicateTemplates25.get(entry.name);
  const duplicateTemplate26 = duplicateTemplates26.get(entry.name);
  const duplicateTemplate27 = duplicateTemplates27.get(entry.name);
  const duplicateTemplate29 = duplicateTemplates29.get(entry.name);
  const duplicateTemplate30 = duplicateTemplates30.get(entry.name);
  const duplicateTemplate31 = duplicateTemplates31.get(entry.name);
  const duplicateTemplate32 = duplicateTemplates32.get(entry.name);
  const duplicateTemplate33 = duplicateTemplates33.get(entry.name);
  const duplicateTemplate34 = duplicateTemplates34.get(entry.name);
  const duplicateTemplate35 = duplicateTemplates35.get(entry.name);
  const duplicateTemplate36 = duplicateTemplates36.get(entry.name);
  const duplicateTemplate37 = duplicateTemplates37.get(entry.name);
  const duplicateTemplate38 = duplicateTemplates38.get(entry.name);
  const duplicateTemplate39 = duplicateTemplates39.get(entry.name);
  const duplicateTemplate40 = duplicateTemplates40.get(entry.name);
  const duplicateTemplate41 = duplicateTemplates41.get(entry.name);
  const duplicateTemplate42 = duplicateTemplates42.get(entry.name);
  const duplicateTemplate43 = duplicateTemplates43.get(entry.name);
  const duplicateTemplate44 = duplicateTemplates44.get(entry.name);
  const duplicateTemplate45 = duplicateTemplates45.get(entry.name);
  const duplicateTemplate46 = duplicateTemplates46.get(entry.name);
  const duplicateTemplate47 = duplicateTemplates47.get(entry.name);
  const duplicateTemplate48 = duplicateTemplates48.get(entry.name);
  const duplicateTemplate49 = duplicateTemplates49.get(entry.name);
  const duplicateContainerTemplate = duplicateContainerTemplates.get(entry.name);
  const runtimeHelper23 = runtimeHelper23Pending && entry.name === runtimeHelpers23Entry.name;
  const runtimeHelper24 = runtimeHelper24Pending && entry.name === runtimeHelpers24Entry.name;
  const runtimeHelper25 = runtimeHelpers25ByName.get(entry.name);
  const runtimeHelper26 = runtimeHelpers26ByName.get(entry.name);
  const runtimeHelper27 = runtimeHelpers27ByName.get(entry.name);
  const runtimeHelper29 = runtimeHelpers29ByName.get(entry.name);
  const runtimeHelper30 = runtimeHelpers30ByName.get(entry.name);
  const runtimeHelper31 = runtimeHelpers31ByName.get(entry.name);
  const runtimeHelper32 = runtimeHelpers32ByName.get(entry.name);
  const runtimeHelper33 = runtimeHelpers33ByName.get(entry.name);
  const runtimeHelper34 = runtimeHelpers34ByName.get(entry.name);
  const runtimeHelper36 = runtimeHelpers36ByName.get(entry.name);
  const runtimeHelper37 = runtimeHelpers37ByName.get(entry.name);
  const runtimeHelper38 = runtimeHelpers38ByName.get(entry.name);
  const runtimeHelper41 = runtimeHelpers41ByName.get(entry.name);
  const runtimeHelper43 = runtimeHelpers43ByName.get(entry.name);
  const runtimeHelper44 = runtimeHelpers44ByName.get(entry.name);
  const runtimeHelper46 = runtimeHelpers46ByName.get(entry.name);
  const instructions = [];
  const configuredMappings = [destination, adjacentGlobalLoad, globalState, duplicateIpcAndTable, multiIdentityGlobal, ipcUniqueTemplate, ipcTemplate15, ipcTemplate16, ipcTemplate17, ipcTemplate18, ipcTemplate19, ipcTemplate20, ipcTemplate21, ipcTemplate22, ipcTemplate23, ipcTemplate24, ipcTemplate25, ipcTemplate26, ipcTemplate27, ipcTemplate28, ipcTemplate29, ipcTemplate30, ipcTemplate31, ipcTemplate32, ipcTemplate33, ipcTemplate34, duplicateTemplate19, duplicateTemplate21, duplicateTemplate22, duplicateTemplate23, duplicateTemplate24, duplicateTemplate25, duplicateTemplate26, duplicateTemplate27, duplicateTemplate29, duplicateTemplate30, duplicateTemplate31, duplicateTemplate32, duplicateTemplate33, duplicateTemplate34, duplicateTemplate35, duplicateTemplate36, duplicateTemplate37, duplicateTemplate38, duplicateTemplate39, duplicateTemplate40, duplicateTemplate41, duplicateTemplate42, duplicateTemplate44, duplicateTemplate46, duplicateTemplate47, duplicateTemplate48, duplicateTemplate49, duplicateContainerTemplate, runtimeHelper23, runtimeHelper24, runtimeHelper25, runtimeHelper26, runtimeHelper27, runtimeHelper29, runtimeHelper30, runtimeHelper31, runtimeHelper32, runtimeHelper33, runtimeHelper34, runtimeHelper36, runtimeHelper37, runtimeHelper38, runtimeHelper41, runtimeHelper43, runtimeHelper44, runtimeHelper46].filter(Boolean);
  if (ipcTemplate35) configuredMappings.push(ipcTemplate35);
  if (ipcTemplate36) configuredMappings.push(ipcTemplate36);
  if (ipcTemplate37) configuredMappings.push(ipcTemplate37);
  if (ipcTemplate38) configuredMappings.push(ipcTemplate38);
  if (ipcTemplate39) configuredMappings.push(ipcTemplate39);
  if (ipcTemplate40) configuredMappings.push(ipcTemplate40);
  if (ipcTemplate41) configuredMappings.push(ipcTemplate41);
  if (ipcTemplate42) configuredMappings.push(ipcTemplate42);
  if (ipcTemplate43) configuredMappings.push(ipcTemplate43);
  if (ipcTemplate44) configuredMappings.push(ipcTemplate44);
  if (ipcTemplate45) configuredMappings.push(ipcTemplate45);
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
      const recyclerOffset = duplicateContainerTemplate?.template.startsWith("range_erase_") ? 92 : -1;
      const eraseOffset = duplicateContainerTemplate?.template === "range_erase_a" ? 304 :
        duplicateContainerTemplate?.template === "range_erase_b" ? 296 : -1;
      const duplicateTemplate22CallOffset = duplicateTemplate22 === undefined ? -1 :
        duplicateTemplates22Config.templates[duplicateTemplate22.template].callOffset ?? -1;
      const duplicateTemplate26Definition = duplicateTemplate26 === undefined ? undefined :
        duplicateTemplates26ExpectedTemplates.get(duplicateTemplate26.template);
      const callee = duplicateTemplate22?.call !== undefined && cursor === duplicateTemplate22CallOffset ? duplicateTemplate22.call :
        ipcTemplate21?.call !== undefined && cursor === 60 ? ipcTemplate21.call :
        ipcTemplate29?.call !== undefined && cursor === 28 ? ipcTemplate29.call :
        cursor === recyclerOffset ? duplicateContainerTemplate.recycler :
        cursor === eraseOffset ? duplicateContainerTemplate.erase : undefined;
      if (duplicateTemplate26Definition !== undefined &&
          cursor === duplicateTemplate26Definition.branchOffset) {
        instructions.push(duplicateTemplate26Definition.branchKind === "conditional-link"
          ? `bllt ${duplicateTemplate26.branchTarget}` : `b ${duplicateTemplate26.branchTarget}`);
        continue;
      }
      if (duplicateTemplate29 !== undefined && cursor === duplicateTemplate29Definition.callOffset) {
        const helper = functionsByName.get(duplicateTemplate29.helper);
        if (entry.mode !== "$a" || helper?.mode !== "$a" ||
            !isArmCallTo(value, entry.address + cursor, helper.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate29.helper} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate29.helper}`);
        continue;
      }
      if (duplicateTemplate30 !== undefined && cursor === duplicateTemplate30Definition.callOffset) {
        const helper = functionsByName.get(duplicateTemplate30.helper);
        if (entry.mode !== "$a" || helper?.mode !== "$a" ||
            !isArmCallTo(value, entry.address + cursor, helper.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate30.helper} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate30.helper}`);
        continue;
      }
      const duplicateTemplate33Call = duplicateTemplate33 === undefined ? undefined :
        duplicateTemplates33CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate33Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate33Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate33Allocator.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate33Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate33Call.symbol}`);
        continue;
      }
      const duplicateTemplate35Call = duplicateTemplate35 === undefined ? undefined :
        duplicateTemplates35CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate35Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate35Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate35Allocator.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate35Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate35Call.symbol}`);
        continue;
      }
      const duplicateTemplate36Call = duplicateTemplate36 === undefined ? undefined :
        duplicateTemplates36CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate36Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate36Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate36Allocator.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate36Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate36Call.symbol}`);
        continue;
      }
      const duplicateTemplate37Call = duplicateTemplate37 === undefined ? undefined :
        duplicateTemplates37CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate37Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate37Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate37Allocator.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate37Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate37Call.symbol}`);
        continue;
      }
      const duplicateTemplate38Call = duplicateTemplate38 === undefined ? undefined :
        duplicateTemplates38CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate38Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate38Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate38Helper.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate38Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate38Call.symbol}`);
        continue;
      }
      const duplicateTemplate39Call = duplicateTemplate39 === undefined ? undefined :
        duplicateTemplates39CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate39Call !== undefined) {
        const symbol = duplicateTemplate39Call.symbol === "$self"
          ? entry.name : duplicateTemplate39Call.symbol;
        const destination = duplicateTemplate39Call.symbol === "$self" ? entry.address :
          duplicateTemplate39Destinations.get(symbol).address + (duplicateTemplate39Call.addend ?? 0);
        if (entry.mode !== "$a" || duplicateTemplate39Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, destination)) {
          throw new Error(`${entry.name} does not call ${symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${symbol}${duplicateTemplate39Call.addend === undefined
          ? "" : ` ${duplicateTemplate39Call.addend < 0 ? "-" : "+"} ${Math.abs(duplicateTemplate39Call.addend)}`}`);
        continue;
      }
      const duplicateTemplate40Call = duplicateTemplate40 === undefined ? undefined :
        duplicateTemplates40CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate40Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate40Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate40Allocator.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate40Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate40Call.symbol}`);
        continue;
      }
      const duplicateTemplate41Call = duplicateTemplate41 === undefined ? undefined :
        duplicateTemplates41CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate41Call !== undefined) {
        const symbol = duplicateTemplate41Call.symbol === "operation"
          ? duplicateTemplate41.operation : duplicateTemplate41Call.symbol;
        if (entry.mode !== "$a" || duplicateTemplate41Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate41Destinations.get(symbol))) {
          throw new Error(`${entry.name} does not call ${symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${symbol}`);
        continue;
      }
      const duplicateTemplate42Call = duplicateTemplate42 === undefined ? undefined :
        duplicateTemplates42CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate42Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate42Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate42Allocator.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate42Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate42Call.symbol}`);
        continue;
      }
      const duplicateTemplate43Call = duplicateTemplate43 === undefined ? undefined :
        duplicateTemplates43CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate43Call !== undefined) {
        const symbol = duplicateTemplate43Call.symbol === "payloadInitializer"
          ? duplicateTemplate43.payloadInitializer : duplicateTemplate43Call.symbol;
        if (entry.mode !== "$a" || duplicateTemplate43Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate43Destinations.get(symbol))) {
          throw new Error(`${entry.name} does not call ${symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${symbol}`);
        continue;
      }
      const duplicateTemplate44Call = duplicateTemplate44 === undefined ? undefined :
        duplicateTemplates44CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate44Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate44Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate44Divider.address)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate44Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate44Call.symbol}`);
        continue;
      }
      const duplicateTemplate45Call = duplicateTemplate45 === undefined ? undefined :
        duplicateTemplates45CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate45Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate45Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor,
              duplicateTemplate45Destinations.get(duplicateTemplate45Call.symbol))) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate45Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate45Call.symbol}`);
        continue;
      }
      const duplicateTemplate46Call = duplicateTemplate46 === undefined ? undefined :
        duplicateTemplates46CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate46Call !== undefined) {
        if (entry.mode !== "$a" || duplicateTemplate46Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor,
              duplicateTemplate46Destinations.get(duplicateTemplate46Call.symbol))) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate46Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${duplicateTemplate46Call.symbol}`);
        continue;
      }
      const duplicateTemplate47Call = duplicateTemplate47 === undefined ? undefined :
        [...duplicateTemplates47CommonCalls, ...duplicateTemplate47.directCalls]
          .find((call) => call.offset === cursor);
      if (duplicateTemplate47Call !== undefined) {
        const destination = duplicateTemplates47AllCalls.get(duplicateTemplate47Call.symbol) +
          (duplicateTemplate47Call.addend ?? 0);
        if (entry.mode !== "$a" || duplicateTemplate47Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, destination)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate47Call.symbol} at audited offset ${cursor}`);
        }
        const addend = duplicateTemplate47Call.addend;
        instructions.push(`bl ${duplicateTemplate47Call.symbol}${addend === undefined
          ? "" : `${addend < 0 ? "-" : "+"}${Math.abs(addend)}`}`);
        continue;
      }
      const duplicateTemplate48Call = duplicateTemplate48 === undefined ? undefined :
        [...duplicateTemplates48CommonCalls,
          { offset: duplicateTemplate48.constructorCallOffset, kind: "R_ARM_CALL",
            symbol: duplicateTemplate48.constructor }]
          .find((call) => call.offset === cursor);
      if (duplicateTemplate48Call !== undefined) {
        const destination = duplicateTemplates48AllCalls.get(duplicateTemplate48Call.symbol) +
          (duplicateTemplate48Call.addend ?? 0);
        if (entry.mode !== "$a" || duplicateTemplate48Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, destination)) {
          throw new Error(`${entry.name} does not call ${duplicateTemplate48Call.symbol} at audited offset ${cursor}`);
        }
        const addend = duplicateTemplate48Call.addend;
        instructions.push(`bl ${duplicateTemplate48Call.symbol}${addend === undefined
          ? "" : `${addend < 0 ? "-" : "+"}${Math.abs(addend)}`}`);
        continue;
      }
      const duplicateTemplate49Transfer = duplicateTemplate49 === undefined ? undefined : [
        ...duplicateTemplates49CommonCalls,
        { offset: duplicateTemplate49.helperCallOffset, kind: "R_ARM_CALL",
          symbol: duplicateTemplate49.helper },
        ...duplicateTemplates49TailBranches,
      ].find((transfer) => transfer.offset === cursor);
      if (duplicateTemplate49Transfer !== undefined) {
        const destination = duplicateTemplates49Destinations.get(duplicateTemplate49Transfer.symbol) +
          (duplicateTemplate49Transfer.addend ?? 0);
        const valid = duplicateTemplate49Transfer.kind === "R_ARM_CALL"
          ? isArmCallTo(value, entry.address + cursor, destination)
          : duplicateTemplate49Transfer.kind === "R_ARM_JUMP24" &&
            isArmJumpTo(value, entry.address + cursor, destination);
        if (entry.mode !== "$a" || !valid) {
          throw new Error(`${entry.name} does not transfer to ${duplicateTemplate49Transfer.symbol} at audited offset ${cursor}`);
        }
        const addend = duplicateTemplate49Transfer.addend;
        instructions.push(`${duplicateTemplate49Transfer.kind === "R_ARM_CALL" ? "bl" : "b"} ` +
          `${duplicateTemplate49Transfer.symbol}${addend === undefined ? "" :
            `${addend < 0 ? "-" : "+"}${Math.abs(addend)}`}`);
        continue;
      }
      const duplicateTemplate34Call = duplicateTemplate34 === undefined ? undefined :
        duplicateTemplates34CallContract.find((call) => call.offset === cursor);
      if (duplicateTemplate34Call !== undefined) {
        const symbol = duplicateTemplate34Call.symbol === "operation"
          ? duplicateTemplate34.operation : duplicateTemplate34Call.symbol;
        if (entry.mode !== "$a" || duplicateTemplate34Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, duplicateTemplate34Destinations.get(symbol))) {
          throw new Error(`${entry.name} does not call ${symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${symbol}`);
        continue;
      }
      const ipcTemplate31Branch = ipcTemplate31?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate31Branch !== undefined) {
        const destinationAddress = ipcTemplate31Destinations.get(ipcTemplate31Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate31Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate31Branch.mnemonic === "blne" ? 0x1b : 0xea;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate31Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate31Branch.mnemonic} ${ipcTemplate31Branch.symbol}`);
        continue;
      }
      const ipcTemplate32Branch = ipcTemplate32?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate32Branch !== undefined) {
        const destinationAddress = ipcTemplate32Destinations.get(ipcTemplate32Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate32Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate32Branch.mnemonic === "blne" ? 0x1b : 0xea;
        if (value >>> 24 !== expectedOpcode || actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate32Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate32Branch.mnemonic} ${ipcTemplate32Branch.symbol}`);
        continue;
      }
      const ipcTemplate33Branch = ipcTemplate33?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate33Branch !== undefined) {
        const destinationAddress = ipcTemplate33Destinations.get(ipcTemplate33Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate33Branch.mnemonic === "bl" ? 0xeb : 0x1b;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate33Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate33Branch.mnemonic} ${ipcTemplate33Branch.symbol}`);
        continue;
      }
      const ipcTemplate34Branch = ipcTemplate34?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate34Branch !== undefined) {
        const destinationAddress = ipcTemplate34Destinations.get(ipcTemplate34Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate34Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate34Branch.mnemonic === "blne" ? 0x1b : 0xea;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate34Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate34Branch.mnemonic} ${ipcTemplate34Branch.symbol}`);
        continue;
      }
      const ipcTemplate35Branch = ipcTemplate35?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate35Branch !== undefined) {
        const destinationAddress = ipcTemplate35Destinations.get(ipcTemplate35Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate35Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate35Branch.mnemonic === "blne" ? 0x1b : 0xea;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate35Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate35Branch.mnemonic} ${ipcTemplate35Branch.symbol}`);
        continue;
      }
      const ipcTemplate36Branch = ipcTemplate36?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate36Branch !== undefined) {
        const destinationAddress = ipcTemplate36Destinations.get(ipcTemplate36Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate36Branch.mnemonic === "bl" ? 0xeb : 0x1b;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate36Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate36Branch.mnemonic} ${ipcTemplate36Branch.symbol}`);
        continue;
      }
      const ipcTemplate37Branch = ipcTemplate37?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate37Branch !== undefined) {
        const destinationAddress = ipcTemplate37Destinations.get(ipcTemplate37Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate37Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate37Branch.mnemonic === "blne" ? 0x1b : 0xea;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate37Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate37Branch.mnemonic} ${ipcTemplate37Branch.symbol}`);
        continue;
      }
      const ipcTemplate38Branch = ipcTemplate38?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate38Branch !== undefined) {
        const destinationAddress = ipcTemplate38Destinations.get(ipcTemplate38Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        if (entry.mode !== "$a" || value >>> 24 !== 0xea || ipcTemplate38Branch.mnemonic !== "b" ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate38Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`b ${ipcTemplate38Branch.symbol}`);
        continue;
      }
      const ipcTemplate39Branch = ipcTemplate39?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate39Branch !== undefined) {
        const destinationAddress = ipcTemplate39Destinations.get(ipcTemplate39Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate39Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate39Branch.mnemonic === "bleq" ? 0x0b :
          ipcTemplate39Branch.mnemonic === "blne" ? 0x1b : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate39Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate39Branch.mnemonic} ${ipcTemplate39Branch.symbol}`);
        continue;
      }
      const ipcTemplate40Branch = ipcTemplate40?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate40Branch !== undefined) {
        const destinationAddress = ipcTemplate40Destinations.get(ipcTemplate40Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate40Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate40Branch.mnemonic === "blne" ? 0x1b : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate40Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate40Branch.mnemonic} ${ipcTemplate40Branch.symbol}`);
        continue;
      }
      const ipcTemplate41Branch = ipcTemplate41?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate41Branch !== undefined) {
        const destinationAddress = ipcTemplate41Destinations.get(ipcTemplate41Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate41Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate41Branch.mnemonic === "blne" ? 0x1b :
          ipcTemplate41Branch.mnemonic === "b" ? 0xea : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate41Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate41Branch.mnemonic} ${ipcTemplate41Branch.symbol}`);
        continue;
      }
      const ipcTemplate42Branch = ipcTemplate42?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate42Branch !== undefined) {
        const destinationAddress = ipcTemplate42Destinations.get(ipcTemplate42Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate42Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate42Branch.mnemonic === "blne" ? 0x1b :
          ipcTemplate42Branch.mnemonic === "b" ? 0xea : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate42Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate42Branch.mnemonic} ${ipcTemplate42Branch.symbol}`);
        continue;
      }
      const ipcTemplate43Branch = ipcTemplate43?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate43Branch !== undefined) {
        const destinationAddress = ipcTemplate43Destinations.get(ipcTemplate43Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate43Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate43Branch.mnemonic === "blne" ? 0x1b :
          ipcTemplate43Branch.mnemonic === "b" ? 0xea : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate43Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate43Branch.mnemonic} ${ipcTemplate43Branch.symbol}`);
        continue;
      }
      const ipcTemplate44Branch = ipcTemplate44?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate44Branch !== undefined) {
        const destinationAddress = ipcTemplate44Destinations.get(ipcTemplate44Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate44Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate44Branch.mnemonic === "blne" ? 0x1b : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate44Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate44Branch.mnemonic} ${ipcTemplate44Branch.symbol}`);
        continue;
      }
      const ipcTemplate45Branch = ipcTemplate45?.branches.find((branch) => branch.offset === cursor);
      if (ipcTemplate45Branch !== undefined) {
        const destinationAddress = ipcTemplate45Destinations.get(ipcTemplate45Branch.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = ipcTemplate45Branch.mnemonic === "bl" ? 0xeb :
          ipcTemplate45Branch.mnemonic === "blne" ? 0x1b :
          ipcTemplate45Branch.mnemonic === "b" ? 0xea : -1;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode ||
            actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${ipcTemplate45Branch.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`${ipcTemplate45Branch.mnemonic} ${ipcTemplate45Branch.symbol}`);
        continue;
      }
      const runtimeHelper26Call = runtimeHelper26?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper26Call !== undefined) {
        const destinationAddress = runtimeHelper26Destinations.get(runtimeHelper26Call.symbol);
        if (entry.mode !== "$a" || runtimeHelper26Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, destinationAddress)) {
          throw new Error(`${entry.name} does not call ${runtimeHelper26Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${runtimeHelper26Call.symbol}`);
        continue;
      }
      const runtimeHelper29Call = runtimeHelper29?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper29Call !== undefined) {
        const destinationAddress = runtimeHelper29Destinations.get(runtimeHelper29Call.symbol);
        if (entry.mode !== "$a" || runtimeHelper29Call.kind !== "R_ARM_CALL" ||
            !isArmCallTo(value, entry.address + cursor, destinationAddress)) {
          throw new Error(`${entry.name} does not call ${runtimeHelper29Call.symbol} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${runtimeHelper29Call.symbol}`);
        continue;
      }
      const runtimeHelper30Call = runtimeHelper30?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper30Call !== undefined) {
        const destinationAddress = runtimeHelper30Destinations.get(runtimeHelper30Call.symbol);
        const contract = runtimeHelpers30Config.symbolicIdentities[runtimeHelper30Call.symbol];
        const transferMatches = contract.mode === "thumb"
          ? isArmBlxImmediateTo(value, entry.address + cursor, destinationAddress)
          : runtimeHelper30Call.kind === "R_ARM_JUMP24"
            ? isArmJumpTo(value, entry.address + cursor, destinationAddress)
            : isArmCallTo(value, entry.address + cursor, destinationAddress);
        if (entry.mode !== "$a" || !transferMatches) {
          throw new Error(`${entry.name} does not branch to ${runtimeHelper30Call.symbol} at audited offset ${cursor}`);
        }
        const mnemonic = contract.mode === "thumb"
          ? "blx"
          : runtimeHelper30Call.kind === "R_ARM_JUMP24" ? "b" : "bl";
        instructions.push(`${mnemonic} ${runtimeHelper30Call.symbol}`);
        continue;
      }
      const runtimeHelper31Call = runtimeHelper31?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper31Call !== undefined) {
        const destinationAddress = runtimeHelper31Destinations.get(runtimeHelper31Call.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const conditionalLinked = (entry.name === "func_002DDA5C" && cursor === 24) ||
          (entry.name === "func_002DEEEC" && cursor === 20);
        const expectedOpcode = runtimeHelper31Call.kind === "R_ARM_CALL" ? 0xeb : conditionalLinked ? 0x1b : 0xea;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode || actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${runtimeHelper31Call.symbol} at audited offset ${cursor}`);
        }
        const mnemonic = runtimeHelper31Call.kind === "R_ARM_CALL" ? "bl" : conditionalLinked ? "blne" : "b";
        instructions.push(`${mnemonic} ${runtimeHelper31Call.symbol}`);
        continue;
      }
      const runtimeHelper32Call = runtimeHelper32?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper32Call !== undefined) {
        const destinationAddress = runtimeHelper32Destinations.get(runtimeHelper32Call.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const conditionalLinked = runtimeHelper32Call.symbol === "runtime_failure_raise_entry_31" &&
          !((entry.name === "func_002DDE18" && cursor === 20) ||
            (entry.name === "func_002E0B9C" && cursor === 60));
        const expectedOpcode = runtimeHelper32Call.kind === "R_ARM_CALL" ? 0xeb : conditionalLinked ? 0x1b : 0xea;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode || actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${runtimeHelper32Call.symbol} at audited offset ${cursor}`);
        }
        const mnemonic = runtimeHelper32Call.kind === "R_ARM_CALL" ? "bl" : conditionalLinked ? "blne" : "b";
        instructions.push(`${mnemonic} ${runtimeHelper32Call.symbol}`);
        continue;
      }
      const runtimeHelper33Call = runtimeHelper33?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper33Call !== undefined) {
        const destinationAddress = runtimeHelper33Destinations.get(runtimeHelper33Call.symbol);
        let displacement = value & 0x00ffffff;
        if ((displacement & 0x00800000) !== 0) displacement -= 0x01000000;
        const actualDestination = entry.address + cursor + 8 + displacement * 4;
        const expectedOpcode = runtimeHelper33Call.kind === "R_ARM_CALL" ? 0xeb : 0x1b;
        if (entry.mode !== "$a" || value >>> 24 !== expectedOpcode || actualDestination !== destinationAddress) {
          throw new Error(`${entry.name} does not branch to ${runtimeHelper33Call.symbol} at audited offset ${cursor}`);
        }
        const mnemonic = runtimeHelper33Call.kind === "R_ARM_CALL" ? "bl" : "blne";
        instructions.push(`${mnemonic} ${runtimeHelper33Call.symbol}`);
        continue;
      }
      const runtimeHelper43Call = runtimeHelper43?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper43Call !== undefined) {
        const destinationAddress = runtimeHelper43Destinations.get(runtimeHelper43Call.symbol);
        const transferMatches = runtimeHelper43Call.kind === "R_ARM_CALL"
          ? isArmCallTo(value, entry.address + cursor, destinationAddress)
          : runtimeHelper43Call.kind === "R_ARM_JUMP24" &&
            isArmJumpTo(value, entry.address + cursor, destinationAddress);
        if (entry.mode !== "$a" || !transferMatches) {
          throw new Error(`${entry.name} does not branch to ${runtimeHelper43Call.symbol} at audited offset ${cursor}`);
        }
        const mnemonic = runtimeHelper43Call.kind === "R_ARM_CALL" ? "bl" : "b";
        instructions.push(`${mnemonic} ${runtimeHelper43Call.symbol}`);
        continue;
      }
      const runtimeHelper44Call = runtimeHelper44?.calls.find((call) => call.offset === cursor);
      if (runtimeHelper44Call !== undefined) {
        const destinationAddress = runtimeHelper44Destinations.get(runtimeHelper44Call.symbol);
        const transferMatches = runtimeHelper44Call.kind === "R_ARM_CALL"
          ? isArmCallTo(value, entry.address + cursor, destinationAddress)
          : runtimeHelper44Call.kind === "R_ARM_JUMP24" &&
            isArmJumpTo(value, entry.address + cursor, destinationAddress);
        if (entry.mode !== "$a" || !transferMatches) {
          throw new Error(`${entry.name} does not branch to ${runtimeHelper44Call.symbol} at audited offset ${cursor}`);
        }
        const mnemonic = runtimeHelper44Call.kind === "R_ARM_CALL" ? "bl" : "b";
        instructions.push(`${mnemonic} ${runtimeHelper44Call.symbol}`);
        continue;
      }
      if (callee !== undefined) {
        const calleeEntry = functionsByName.get(callee);
        if (entry.mode !== "$a" || calleeEntry?.mode !== "$a" ||
            !isArmCallTo(value, entry.address + cursor, calleeEntry.address)) {
          throw new Error(`${entry.name} does not call ${callee} at audited offset ${cursor}`);
        }
        instructions.push(`bl ${callee}`);
        continue;
      }
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
    ...(duplicateTemplate31
      ? [
          `.word ${duplicateTemplates31Identities[duplicateTemplate31.coefficientIdentity].symbol}`,
          ".word 0",
          `.word ${duplicateTemplates31Identities[duplicateTemplate31.permutationIdentity].symbol}`,
          ".space 1276",
          `.global ${duplicateTemplates31Identities[duplicateTemplate31.coefficientIdentity].symbol}`,
          `.global ${duplicateTemplates31Identities[duplicateTemplate31.permutationIdentity].symbol}`,
        ]
      : []),
    ...(duplicateTemplate32
      ? [
          `.word ${duplicateTemplates32Identities[duplicateTemplate32.coefficientIdentity].symbol}`,
          ".word 0",
          `.word ${duplicateTemplates32Identities[duplicateTemplate32.permutationIdentity].symbol}`,
          `.global ${duplicateTemplates32Identities[duplicateTemplate32.coefficientIdentity].symbol}`,
          `.global ${duplicateTemplates32Identities[duplicateTemplate32.permutationIdentity].symbol}`,
          `.global ${duplicateTemplates32Identities[duplicateTemplate32.reverseIdentity].symbol}`,
        ]
      : []),
    entry.mode === "$a" ? ".arm" : ".thumb",
    `.global ${entry.name}`,
    `.type ${entry.name}, %function`,
    ...(entry.mode === "$t" ? [".thumb_func"] : []),
    `${entry.name}:`,
    ...instructions,
    `.size ${entry.name}, .-${entry.name}`,
    ...(duplicateTemplate34
      ? [
          ".word resource_operation_state_34",
          ".word resource_unavailable_status_34",
          ".global resource_operation_state_34",
          ".global resource_unavailable_status_34",
        ]
      : []),
    ...(duplicateTemplate38
      ? duplicateTemplate38.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates38Identities[identity].symbol;
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate39
      ? duplicateTemplate39.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates39Identities[identity].symbol;
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate40
      ? duplicateTemplate40.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates40Identities[identity].symbol;
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate41
      ? duplicateTemplates41PoolContract.flatMap(({ symbol }) =>
          [`.word ${symbol}`, `.global ${symbol}`])
      : []),
    ...(duplicateTemplate45
      ? duplicateTemplate45.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates45Identities[identity].symbol;
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate46
      ? duplicateTemplate46.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates46Identities[identity].symbol;
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate47
      ? duplicateTemplates47SlotContract.flatMap(({ identity }) =>
          [`.word ${identity}`, `.global ${identity}`])
      : []),
    ...(duplicateTemplate48
      ? [
          '.ascii "neutral-shared-id-01\\0"',
          ".space 3",
          '.ascii "neutral-shared-second2\\0"',
          ".space 1",
          `.ascii "${duplicateTemplate48.name === "func_00368600" ? "neutral-expansion-a" :
            duplicateTemplate48.name === "func_00368CE0" ? "neutral-expansion-b01" :
              "neutral-expansion-c02"}\\0"`,
        ]
      : []),
    ...(duplicateTemplate49
      ? [
          ".word duplicate49_shared_registry_identity",
          ".global duplicate49_shared_registry_identity",
        ]
      : []),
    ...(duplicateTemplate32
      ? [
          ".space 1416",
          `.word ${duplicateTemplates32Identities[duplicateTemplate32.reverseIdentity].symbol}`,
        ]
      : []),
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
    ...(ipcUniqueTemplate
      ? [
          `.word ${ipcUniqueTemplate.command}`,
          `.global ${ipcUniqueTemplate.command}`,
          ...(ipcUniqueTemplate.handle === undefined
            ? []
            : [`.word ${ipcUniqueTemplate.handle}`, `.global ${ipcUniqueTemplate.handle}`]),
        ]
      : []),
    ...(ipcTemplate15
      ? ipcTemplate15Definitions.get(ipcTemplate15.template).literals.flatMap((key) => [
          `.word ${ipcTemplate15[key]}`,
          `.global ${ipcTemplate15[key]}`,
        ])
      : []),
    ...(ipcTemplate16
      ? ipcTemplate16Definitions.get(ipcTemplate16.template).literals.flatMap((key) => [
          `.word ${ipcTemplate16[key]}`,
          `.global ${ipcTemplate16[key]}`,
        ])
      : []),
    ...(ipcTemplate17
      ? ipcTemplate17Definitions.get(ipcTemplate17.template).literals.flatMap((key) => [
          `.word ${ipcTemplate17[key]}`,
          `.global ${ipcTemplate17[key]}`,
        ])
      : []),
    ...(ipcTemplate18
      ? ipcTemplate18Definitions.get(ipcTemplate18.template).literals.flatMap((key) => [
          `.word ${ipcTemplate18[key]}`,
          `.global ${ipcTemplate18[key]}`,
        ])
      : []),
    ...(ipcTemplate19
      ? ipcTemplate19Definitions.get(ipcTemplate19.template).literals.flatMap((key) => [
          `.word ${ipcTemplate19[key]}`,
          `.global ${ipcTemplate19[key]}`,
        ])
      : []),
    ...(ipcTemplate20
      ? ipcTemplate20Definitions.get(ipcTemplate20.template).literals.flatMap((key) => [
          `.word ${ipcTemplate20[key]}`,
          `.global ${ipcTemplate20[key]}`,
        ])
      : []),
    ...(ipcTemplate21
      ? ipcTemplate21Definitions.get(ipcTemplate21.template).literals.flatMap((key) => [
          `.word ${ipcTemplate21[key]}`,
          `.global ${ipcTemplate21[key]}`,
        ])
      : []),
    ...(ipcTemplate22
      ? ipcTemplate22Definitions.get(ipcTemplate22.template).literals.flatMap((key) => [
          `.word ${ipcTemplate22[key]}`,
          `.global ${ipcTemplate22[key]}`,
        ])
      : []),
    ...(ipcTemplate23
      ? ipcTemplate23Definitions.get(ipcTemplate23.template).literals.flatMap((key) => [
          `.word ${ipcTemplate23[key]}`,
          `.global ${ipcTemplate23[key]}`,
        ])
      : []),
    ...(ipcTemplate24
      ? ipcTemplate24Definitions.get(ipcTemplate24.template).literals.flatMap((key) => [
          `.word ${ipcTemplate24[key]}`,
          `.global ${ipcTemplate24[key]}`,
        ])
      : []),
    ...(ipcTemplate25
      ? ipcTemplate25Definitions.get(ipcTemplate25.template).literals.flatMap((key) => [
          `.word ${ipcTemplate25[key]}`,
          `.global ${ipcTemplate25[key]}`,
        ])
      : []),
    ...(ipcTemplate26
      ? ipcTemplate26Definitions.get(ipcTemplate26.template).literals.flatMap((key) => [
          `.word ${ipcTemplate26[key]}`,
          `.global ${ipcTemplate26[key]}`,
        ])
      : []),
    ...(ipcTemplate27
      ? ipcTemplate27Definitions.get(ipcTemplate27.template).literals.flatMap((key) => [
          `.word ${ipcTemplate27[key]}`,
          `.global ${ipcTemplate27[key]}`,
        ])
      : []),
    ...(ipcTemplate28
      ? [ipcTemplate28.command, ipcTemplate28.handle].filter((value) => typeof value === "string").flatMap((identity) => [
          `.word ${identity}`,
          `.global ${identity}`,
        ])
      : []),
    ...(ipcTemplate29
      ? [ipcTemplate29.command, ipcTemplate29.auxiliary, ipcTemplate29.staticDescriptor, ipcTemplate29.handle]
        .filter((value) => typeof value === "string").flatMap((identity) => [
          `.word ${identity}`,
          `.global ${identity}`,
        ])
      : []),
    ...(ipcTemplate30
      ? [ipcTemplate30.command, ipcTemplate30.auxiliary, ipcTemplate30.staticDescriptor, ipcTemplate30.handle]
        .filter((value) => typeof value === "string").flatMap((identity) => [
          `.word ${identity}`,
          `.global ${identity}`,
        ])
      : []),
    ...(ipcTemplate31
      ? [
          ...ipcTemplate31.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate31.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate32
      ? [
          ...ipcTemplate32.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...ipcTemplate32.branches.flatMap(({ symbol }) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate33
      ? [
          ...ipcTemplate33.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate33.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate34
      ? [
          ...ipcTemplate34.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate34.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate35
      ? [
          ...ipcTemplate35.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate35.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate36
      ? [...new Set(ipcTemplate36.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
          `.global ${symbol}`,
          `.type ${symbol}, %function`,
        ])
      : []),
    ...(ipcTemplate37
      ? [...new Set(ipcTemplate37.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
          `.global ${symbol}`,
          `.type ${symbol}, %function`,
        ])
      : []),
    ...(ipcTemplate38
      ? [...new Set(ipcTemplate38.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
          `.global ${symbol}`,
          `.type ${symbol}, %function`,
        ])
      : []),
    ...(ipcTemplate39
      ? [
          ...ipcTemplate39.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate39.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate40
      ? [
          ...ipcTemplate40.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate40.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate41
      ? [
          ...ipcTemplate41.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate41.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate42
      ? [
          ...ipcTemplate42.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate42.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate43
      ? [
          ...ipcTemplate43.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate43.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate44
      ? [
          ...ipcTemplate44.literals.flatMap(({ symbol }) => [`.word ${symbol}`, `.global ${symbol}`]),
          ...[...new Set(ipcTemplate44.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
            `.global ${symbol}`,
            `.type ${symbol}, %function`,
          ]),
        ]
      : []),
    ...(ipcTemplate45
      ? [...new Set(ipcTemplate45.branches.map(({ symbol }) => symbol))].flatMap((symbol) => [
          `.global ${symbol}`,
          `.type ${symbol}, %function`,
        ])
      : []),
    ...(duplicateTemplate19
      ? duplicateTemplate19.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates19Config.literalIdentities[identity];
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate21
      ? duplicateTemplate21.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates21Config.literalIdentities[identity];
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate22
      ? duplicateTemplate22.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates22Config.literalIdentities[identity];
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate23
      ? duplicateTemplate23.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates23Config.literalIdentities[identity];
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(duplicateTemplate25
      ? duplicateTemplate25.literals.flatMap(({ identity }) => {
          const symbol = duplicateTemplates25Config.literalIdentities[identity].symbol;
          return [`.word ${symbol}`, `.global ${symbol}`];
        })
      : []),
    ...(runtimeHelper23
      ? [`.word ${runtimeHelpers23Config.adjacentRelocation.symbol}`, `.global ${runtimeHelpers23Config.adjacentRelocation.symbol}`]
      : []),
    ...(runtimeHelper24
      ? [
          `.balign ${runtimeHelpers24Constant.minimumAlignment}`,
          `${runtimeHelpers24Constant.label}:`,
          `.word ${runtimeHelpers24Constant.value}`,
        ]
      : []),
    ...(runtimeHelper25
      ? runtimeHelper25.adjacentWords.flatMap((word) => word.kind === "R_ARM_ABS32"
        ? [`.word ${word.symbol}`, `.global ${word.symbol}`]
        : [`.word ${word.kind === "f32" ? "0x42000000" : word.value}`])
      : []),
    ...(runtimeHelper26
      ? runtimeHelper26.calls.map((call) => `.global ${call.symbol}`)
      : []),
    ...(runtimeHelper27
      ? runtimeHelper27.adjacentWords.flatMap((word) => [`.word ${word.symbol}`, `.global ${word.symbol}`])
      : []),
    ...(runtimeHelper29
      ? runtimeHelper29.calls.flatMap((call) => [
          `.global ${call.symbol}`,
          `.type ${call.symbol}, %function`,
        ])
      : []),
    ...(runtimeHelper30
      ? runtimeHelper30.calls.flatMap((call) => [
          `.global ${call.symbol}`,
          `.type ${call.symbol}, %function`,
        ])
      : []),
    ...(runtimeHelper31
      ? [...new Set(runtimeHelper31.calls.map((call) => call.symbol))].flatMap((identity) => [
          `.global ${identity}`,
          `.type ${identity}, %function`,
        ])
      : []),
    ...(runtimeHelper32
      ? [...new Set(runtimeHelper32.calls.map((call) => call.symbol))].flatMap((identity) => [
          `.global ${identity}`,
          `.type ${identity}, %function`,
        ])
      : []),
    ...(runtimeHelper33
      ? [
          ...runtimeHelper33.adjacentWords.flatMap((word) => [`.word ${word.symbol}`, `.global ${word.symbol}`]),
          ...[...new Set(runtimeHelper33.calls.map((call) => call.symbol))].flatMap((identity) => [
            `.global ${identity}`,
            `.type ${identity}, %function`,
          ]),
        ]
      : []),
    ...(runtimeHelper38
      ? runtimeHelper38.adjacentWords.flatMap((word) => [`.word ${word.symbol}`, `.global ${word.symbol}`])
      : []),
    ...(runtimeHelper41
      ? runtimeHelper41.adjacentWords.flatMap((word) => [`.word ${word.symbol}`, `.global ${word.symbol}`])
      : []),
    ...(runtimeHelper43
      ? [...new Set(runtimeHelper43.calls.map((call) => call.symbol))].flatMap((identity) => [
          `.global ${identity}`,
          `.type ${identity}, %function`,
        ])
      : []),
    ...(runtimeHelper44
      ? [
          ...runtimeHelper44.adjacentWords.flatMap((word) => [`.word ${word.symbol}`, `.global ${word.symbol}`]),
          ...runtimeHelper44.calls.flatMap((call) => [
            `.global ${call.symbol}`,
            `.type ${call.symbol}, %function`,
          ]),
        ]
      : []),
    ...(runtimeHelper46
      ? runtimeHelper46.adjacentWords.flatMap((word) => [`.word ${word.symbol}`, `.global ${word.symbol}`])
      : []),
    ""
  );
  if (runtimeHelper23) runtimeHelper23Pending = false;
  if (runtimeHelper24) runtimeHelper24Pending = false;
  if (runtimeHelper25) runtimeHelpers25Pending.delete(entry.name);
  if (runtimeHelper26) runtimeHelpers26Pending.delete(entry.name);
  if (runtimeHelper27) runtimeHelpers27Pending.delete(entry.name);
  if (runtimeHelper29) runtimeHelpers29Pending.delete(entry.name);
  if (runtimeHelper30) runtimeHelpers30Pending.delete(entry.name);
  if (runtimeHelper31) runtimeHelpers31Pending.delete(entry.name);
  if (runtimeHelper32) runtimeHelpers32Pending.delete(entry.name);
  if (runtimeHelper33) runtimeHelpers33Pending.delete(entry.name);
  if (runtimeHelper34) runtimeHelpers34Pending.delete(entry.name);
  if (runtimeHelper36) runtimeHelpers36Pending.delete(entry.name);
  if (runtimeHelper37) runtimeHelpers37Pending.delete(entry.name);
  if (runtimeHelper38) runtimeHelpers38Pending.delete(entry.name);
  if (runtimeHelper41) runtimeHelpers41Pending.delete(entry.name);
  if (runtimeHelper43) runtimeHelpers43Pending.delete(entry.name);
  if (runtimeHelper44) runtimeHelpers44Pending.delete(entry.name);
  if (runtimeHelper46) runtimeHelpers46Pending.delete(entry.name);
  duplicateIpcAndTables.delete(entry.name);
  multiIdentityGlobals.delete(entry.name);
  ipcUniqueTemplates.delete(entry.name);
  ipcTemplates15.delete(entry.name);
  ipcTemplates16.delete(entry.name);
  ipcTemplates17.delete(entry.name);
  ipcTemplates18.delete(entry.name);
  ipcTemplates19.delete(entry.name);
  ipcTemplates20.delete(entry.name);
  ipcTemplates21.delete(entry.name);
  ipcTemplates22.delete(entry.name);
  ipcTemplates23.delete(entry.name);
  ipcTemplates24.delete(entry.name);
  ipcTemplates25.delete(entry.name);
  ipcTemplates26.delete(entry.name);
  ipcTemplates27.delete(entry.name);
  ipcTemplates28.delete(entry.name);
  ipcTemplates29.delete(entry.name);
  ipcTemplates30.delete(entry.name);
  ipcTemplates31.delete(entry.name);
  ipcTemplates32.delete(entry.name);
  ipcTemplates33.delete(entry.name);
  ipcTemplates34.delete(entry.name);
  ipcTemplates35.delete(entry.name);
  ipcTemplates36.delete(entry.name);
  ipcTemplates37.delete(entry.name);
  ipcTemplates38.delete(entry.name);
  ipcTemplates39.delete(entry.name);
  ipcTemplates40.delete(entry.name);
  ipcTemplates41.delete(entry.name);
  ipcTemplates42.delete(entry.name);
  ipcTemplates43.delete(entry.name);
  ipcTemplates44.delete(entry.name);
  ipcTemplates45.delete(entry.name);
  duplicateTemplates19.delete(entry.name);
  duplicateTemplates21.delete(entry.name);
  duplicateTemplates22.delete(entry.name);
  duplicateTemplates23.delete(entry.name);
  duplicateTemplates24.delete(entry.name);
  duplicateTemplates25.delete(entry.name);
  duplicateTemplates26.delete(entry.name);
  duplicateTemplates27.delete(entry.name);
  duplicateTemplates29.delete(entry.name);
  duplicateTemplates30.delete(entry.name);
  duplicateTemplates31.delete(entry.name);
  duplicateTemplates32.delete(entry.name);
  duplicateTemplates33.delete(entry.name);
  duplicateTemplates34.delete(entry.name);
  duplicateTemplates35.delete(entry.name);
  duplicateTemplates36.delete(entry.name);
  duplicateTemplates37.delete(entry.name);
  duplicateTemplates38.delete(entry.name);
  duplicateTemplates39.delete(entry.name);
  duplicateTemplates40.delete(entry.name);
  duplicateTemplates41.delete(entry.name);
  duplicateTemplates42.delete(entry.name);
  duplicateTemplates43.delete(entry.name);
  duplicateTemplates44.delete(entry.name);
  duplicateTemplates45.delete(entry.name);
  duplicateTemplates46.delete(entry.name);
  duplicateTemplates47.delete(entry.name);
  duplicateTemplates48.delete(entry.name);
  duplicateTemplates49.delete(entry.name);
  duplicateContainerTemplates.delete(entry.name);
}
if (runtimeHelper23Pending) {
  throw new Error("ARM runtime helper 23 mapping is missing from the function inventory");
}
if (runtimeHelper24Pending) {
  throw new Error("ARM runtime helper 24 mapping is missing from the function inventory");
}
if (runtimeHelpers25Pending.size !== 0) {
  throw new Error(`ARM runtime helper 25 mappings missing from the function inventory: ${[...runtimeHelpers25Pending].join(", ")}`);
}
if (runtimeHelpers26Pending.size !== 0) {
  throw new Error(`ARM runtime helper 26 mappings missing from the function inventory: ${[...runtimeHelpers26Pending].join(", ")}`);
}
if (runtimeHelpers27Pending.size !== 0) {
  throw new Error(`ARM runtime helper 27 mappings missing from the function inventory: ${[...runtimeHelpers27Pending].join(", ")}`);
}
if (runtimeHelpers29Pending.size !== 0) {
  throw new Error(`ARM runtime helper 29 mappings missing from the function inventory: ${[...runtimeHelpers29Pending].join(", ")}`);
}
if (runtimeHelpers30Pending.size !== 0) {
  throw new Error(`ARM runtime helper 30 mappings missing from the function inventory: ${[...runtimeHelpers30Pending].join(", ")}`);
}
if (runtimeHelpers31Pending.size !== 0) {
  throw new Error(`ARM runtime helper 31 mappings missing from the function inventory: ${[...runtimeHelpers31Pending].join(", ")}`);
}
if (runtimeHelpers32Pending.size !== 0) {
  throw new Error(`ARM runtime helper 32 mappings missing from the function inventory: ${[...runtimeHelpers32Pending].join(", ")}`);
}
if (runtimeHelpers33Pending.size !== 0) {
  throw new Error(`ARM runtime helper 33 mappings missing from the function inventory: ${[...runtimeHelpers33Pending].join(", ")}`);
}
if (runtimeHelpers34Pending.size !== 0) {
  throw new Error(`ARM runtime helper 34 mappings missing from the function inventory: ${[...runtimeHelpers34Pending].join(", ")}`);
}
if (runtimeHelpers36Pending.size !== 0) {
  throw new Error(`ARM runtime helper 36 mappings missing from the function inventory: ${[...runtimeHelpers36Pending].join(", ")}`);
}
if (runtimeHelpers37Pending.size !== 0) {
  throw new Error(`ARM runtime helper 37 mappings missing from the function inventory: ${[...runtimeHelpers37Pending].join(", ")}`);
}
if (runtimeHelpers38Pending.size !== 0) {
  throw new Error(`ARM runtime helper 38 mappings missing from the function inventory: ${[...runtimeHelpers38Pending].join(", ")}`);
}
if (runtimeHelpers41Pending.size !== 0) {
  throw new Error(`ARM runtime helper 41 mappings missing from the function inventory: ${[...runtimeHelpers41Pending].join(", ")}`);
}
if (runtimeHelpers43Pending.size !== 0) {
  throw new Error(`ARM runtime helper 43 mappings missing from the function inventory: ${[...runtimeHelpers43Pending].join(", ")}`);
}
if (runtimeHelpers44Pending.size !== 0) {
  throw new Error(`ARM runtime helper 44 mappings missing from the function inventory: ${[...runtimeHelpers44Pending].join(", ")}`);
}
if (runtimeHelpers46Pending.size !== 0) {
  throw new Error(`ARM runtime helper 46 mappings missing from the function inventory: ${[...runtimeHelpers46Pending].join(", ")}`);
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
if (ipcUniqueTemplates.size !== 0) {
  throw new Error(
    `Unique IPC mappings missing from the function inventory: ${[...ipcUniqueTemplates.keys()].join(", ")}`
  );
}
if (ipcTemplates15.size !== 0) {
  throw new Error(
    `IPC template 15 mappings missing from the function inventory: ${[...ipcTemplates15.keys()].join(", ")}`
  );
}
if (ipcTemplates16.size !== 0) {
  throw new Error(
    `IPC template 16 mappings missing from the function inventory: ${[...ipcTemplates16.keys()].join(", ")}`
  );
}
if (ipcTemplates17.size !== 0) {
  throw new Error(
    `IPC template 17 mappings missing from the function inventory: ${[...ipcTemplates17.keys()].join(", ")}`
  );
}
if (ipcTemplates18.size !== 0) {
  throw new Error(
    `IPC template 18 mappings missing from the function inventory: ${[...ipcTemplates18.keys()].join(", ")}`
  );
}
if (ipcTemplates19.size !== 0) {
  throw new Error(
    `IPC template 19 mappings missing from the function inventory: ${[...ipcTemplates19.keys()].join(", ")}`
  );
}
if (ipcTemplates20.size !== 0) {
  throw new Error(
    `IPC template 20 mappings missing from the function inventory: ${[...ipcTemplates20.keys()].join(", ")}`
  );
}
if (ipcTemplates21.size !== 0) {
  throw new Error(`IPC template 21 mappings missing from the function inventory: ${[...ipcTemplates21.keys()].join(", ")}`);
}
if (ipcTemplates22.size !== 0) {
  throw new Error(`IPC template 22 mappings missing from the function inventory: ${[...ipcTemplates22.keys()].join(", ")}`);
}
if (ipcTemplates23.size !== 0) {
  throw new Error(`IPC template 23 mappings missing from the function inventory: ${[...ipcTemplates23.keys()].join(", ")}`);
}
if (ipcTemplates24.size !== 0) {
  throw new Error(`IPC template 24 mappings missing from the function inventory: ${[...ipcTemplates24.keys()].join(", ")}`);
}
if (ipcTemplates25.size !== 0) {
  throw new Error(`IPC template 25 mappings missing from the function inventory: ${[...ipcTemplates25.keys()].join(", ")}`);
}
if (ipcTemplates26.size !== 0) {
  throw new Error(`IPC template 26 mappings missing from the function inventory: ${[...ipcTemplates26.keys()].join(", ")}`);
}
if (ipcTemplates27.size !== 0) {
  throw new Error(`IPC template 27 mappings missing from the function inventory: ${[...ipcTemplates27.keys()].join(", ")}`);
}
if (ipcTemplates28.size !== 0) {
  throw new Error(`IPC template 28 mappings missing from the function inventory: ${[...ipcTemplates28.keys()].join(", ")}`);
}
if (ipcTemplates29.size !== 0) {
  throw new Error(`IPC template 29 mappings missing from the function inventory: ${[...ipcTemplates29.keys()].join(", ")}`);
}
if (ipcTemplates30.size !== 0) {
  throw new Error(`IPC template 30 mappings missing from the function inventory: ${[...ipcTemplates30.keys()].join(", ")}`);
}
if (ipcTemplates31.size !== 0) {
  throw new Error(`IPC template 31 mappings missing from the function inventory: ${[...ipcTemplates31.keys()].join(", ")}`);
}
if (ipcTemplates32.size !== 0) {
  throw new Error(`IPC template 32 mappings missing from the function inventory: ${[...ipcTemplates32.keys()].join(", ")}`);
}
if (ipcTemplates33.size !== 0) {
  throw new Error(`IPC template 33 mappings missing from the function inventory: ${[...ipcTemplates33.keys()].join(", ")}`);
}
if (ipcTemplates34.size !== 0) {
  throw new Error(`IPC template 34 mappings missing from the function inventory: ${[...ipcTemplates34.keys()].join(", ")}`);
}
if (ipcTemplates35.size !== 0) {
  throw new Error(`IPC template 35 mappings missing from the function inventory: ${[...ipcTemplates35.keys()].join(", ")}`);
}
if (ipcTemplates36.size !== 0) {
  throw new Error(`IPC template 36 mappings missing from the function inventory: ${[...ipcTemplates36.keys()].join(", ")}`);
}
if (ipcTemplates37.size !== 0) {
  throw new Error(`IPC template 37 mappings missing from the function inventory: ${[...ipcTemplates37.keys()].join(", ")}`);
}
if (ipcTemplates38.size !== 0) {
  throw new Error(`IPC template 38 mappings missing from the function inventory: ${[...ipcTemplates38.keys()].join(", ")}`);
}
if (ipcTemplates39.size !== 0) {
  throw new Error(`IPC template 39 mappings missing from the function inventory: ${[...ipcTemplates39.keys()].join(", ")}`);
}
if (ipcTemplates40.size !== 0) {
  throw new Error(`IPC template 40 mappings missing from the function inventory: ${[...ipcTemplates40.keys()].join(", ")}`);
}
if (ipcTemplates41.size !== 0) {
  throw new Error(`IPC template 41 mappings missing from the function inventory: ${[...ipcTemplates41.keys()].join(", ")}`);
}
if (ipcTemplates42.size !== 0) {
  throw new Error(`IPC template 42 mappings missing from the function inventory: ${[...ipcTemplates42.keys()].join(", ")}`);
}
if (ipcTemplates43.size !== 0) {
  throw new Error(`IPC template 43 mappings missing from the function inventory: ${[...ipcTemplates43.keys()].join(", ")}`);
}
if (ipcTemplates44.size !== 0) {
  throw new Error(`IPC template 44 mappings missing from the function inventory: ${[...ipcTemplates44.keys()].join(", ")}`);
}
if (ipcTemplates45.size !== 0) {
  throw new Error(`IPC template 45 mappings missing from the function inventory: ${[...ipcTemplates45.keys()].join(", ")}`);
}
if (duplicateTemplates19.size !== 0) {
  throw new Error(
    `Duplicate template 19 mappings missing from the function inventory: ${[...duplicateTemplates19.keys()].join(", ")}`
  );
}
if (duplicateTemplates21.size !== 0) {
  throw new Error(
    `Duplicate template 21 mappings missing from the function inventory: ${[...duplicateTemplates21.keys()].join(", ")}`
  );
}
if (duplicateTemplates22.size !== 0) {
  throw new Error(
    `Duplicate template 22 mappings missing from the function inventory: ${[...duplicateTemplates22.keys()].join(", ")}`
  );
}
if (duplicateTemplates23.size !== 0) {
  throw new Error(
    `Duplicate template 23 mappings missing from the function inventory: ${[...duplicateTemplates23.keys()].join(", ")}`
  );
}
if (duplicateTemplates24.size !== 0) {
  throw new Error(
    `Duplicate template 24 mappings missing from the function inventory: ${[...duplicateTemplates24.keys()].join(", ")}`
  );
}
if (duplicateTemplates25.size !== 0) {
  throw new Error(
    `Duplicate template 25 mappings missing from the function inventory: ${[...duplicateTemplates25.keys()].join(", ")}`
  );
}
if (duplicateTemplates26.size !== 0) {
  throw new Error(
    `Duplicate template 26 mappings missing from the function inventory: ${[...duplicateTemplates26.keys()].join(", ")}`
  );
}
if (duplicateTemplates27.size !== 0) {
  throw new Error(
    `Duplicate template 27 mappings missing from the function inventory: ${[...duplicateTemplates27.keys()].join(", ")}`
  );
}
if (duplicateTemplates29.size !== 0) {
  throw new Error(
    `Duplicate template 29 mappings missing from the function inventory: ${[...duplicateTemplates29.keys()].join(", ")}`
  );
}
if (duplicateTemplates30.size !== 0) {
  throw new Error(
    `Duplicate template 30 mappings missing from the function inventory: ${[...duplicateTemplates30.keys()].join(", ")}`
  );
}
if (duplicateTemplates31.size !== 0) {
  throw new Error(
    `Duplicate template 31 mappings missing from the function inventory: ${[...duplicateTemplates31.keys()].join(", ")}`
  );
}
if (duplicateTemplates32.size !== 0) {
  throw new Error(
    `Duplicate template 32 mappings missing from the function inventory: ${[...duplicateTemplates32.keys()].join(", ")}`
  );
}
if (duplicateTemplates33.size !== 0) {
  throw new Error(
    `Duplicate template 33 mappings missing from the function inventory: ${[...duplicateTemplates33.keys()].join(", ")}`
  );
}
if (duplicateTemplates34.size !== 0) {
  throw new Error(
    `Duplicate template 34 mappings missing from the function inventory: ${[...duplicateTemplates34.keys()].join(", ")}`
  );
}
if (duplicateTemplates35.size !== 0) {
  throw new Error(
    `Duplicate template 35 mappings missing from the function inventory: ${[...duplicateTemplates35.keys()].join(", ")}`
  );
}
if (duplicateTemplates36.size !== 0) {
  throw new Error(
    `Duplicate template 36 mappings missing from the function inventory: ${[...duplicateTemplates36.keys()].join(", ")}`
  );
}
if (duplicateTemplates37.size !== 0) {
  throw new Error(
    `Duplicate template 37 mappings missing from the function inventory: ${[...duplicateTemplates37.keys()].join(", ")}`
  );
}
if (duplicateTemplates38.size !== 0) {
  throw new Error(
    `Duplicate template 38 mappings missing from the function inventory: ${[...duplicateTemplates38.keys()].join(", ")}`
  );
}
if (duplicateTemplates39.size !== 0) {
  throw new Error(
    `Duplicate template 39 mappings missing from the function inventory: ${[...duplicateTemplates39.keys()].join(", ")}`
  );
}
if (duplicateTemplates40.size !== 0) {
  throw new Error(
    `Duplicate template 40 mappings missing from the function inventory: ${[...duplicateTemplates40.keys()].join(", ")}`
  );
}
if (duplicateTemplates41.size !== 0) {
  throw new Error(
    `Duplicate template 41 mappings missing from the function inventory: ${[...duplicateTemplates41.keys()].join(", ")}`
  );
}
if (duplicateTemplates42.size !== 0) {
  throw new Error(
    `Duplicate template 42 mappings missing from the function inventory: ${[...duplicateTemplates42.keys()].join(", ")}`
  );
}
if (duplicateTemplates43.size !== 0) {
  throw new Error(
    `Duplicate template 43 mappings missing from the function inventory: ${[...duplicateTemplates43.keys()].join(", ")}`
  );
}
if (duplicateTemplates44.size !== 0) {
  throw new Error(
    `Duplicate template 44 mappings missing from the function inventory: ${[...duplicateTemplates44.keys()].join(", ")}`
  );
}
if (duplicateTemplates45.size !== 0) {
  throw new Error(
    `Duplicate template 45 mappings missing from the function inventory: ${[...duplicateTemplates45.keys()].join(", ")}`
  );
}
if (duplicateTemplates46.size !== 0) {
  throw new Error(
    `Duplicate template 46 mappings missing from the function inventory: ${[...duplicateTemplates46.keys()].join(", ")}`
  );
}
if (duplicateTemplates47.size !== 0) {
  throw new Error(
    `Duplicate template 47 mappings missing from the function inventory: ${[...duplicateTemplates47.keys()].join(", ")}`
  );
}
if (duplicateTemplates48.size !== 0) {
  throw new Error(
    `Duplicate template 48 mappings missing from the function inventory: ${[...duplicateTemplates48.keys()].join(", ")}`
  );
}
if (duplicateTemplates49.size !== 0) {
  throw new Error(
    `Duplicate template 49 mappings missing from the function inventory: ${[...duplicateTemplates49.keys()].join(", ")}`
  );
}
if (duplicateContainerTemplates.size !== 0) {
  throw new Error(
    `Duplicate container mappings missing from the function inventory: ${[...duplicateContainerTemplates.keys()].join(", ")}`
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
const definedFunctionSymbols = symbols.stdout
  .split(/\r?\n/)
  .filter((line) => /\bFUNC\b/.test(line) && /\bGLOBAL\b/.test(line) && !/\bUND\b/.test(line));
if (definedFunctionSymbols.length !== functions.length) {
  throw new Error(
    `Target object has ${definedFunctionSymbols.length} defined global functions; expected ${functions.length}`
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
