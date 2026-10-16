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
  duplicateContainerTemplatesPath,
  runtimeHelpers23Path,
  runtimeHelpers24Path,
  runtimeHelpers25Path,
  runtimeHelpers26Path,
  runtimeHelpers27Path,
  runtimeHelpers29Path,
  runtimeHelpers30Path,
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
  !duplicateContainerTemplatesPath ||
  !runtimeHelpers23Path ||
  !runtimeHelpers24Path ||
  !runtimeHelpers25Path ||
  !runtimeHelpers26Path ||
  !runtimeHelpers27Path ||
  !runtimeHelpers29Path ||
  !runtimeHelpers30Path ||
  !literalIdentitiesPath ||
  !targetConfigPath
) {
  throw new Error(
    "Expected code, symbol inventory, assembler, readelf, branch thunk mapping, adjacent-global-load mapping, global-state mapping, duplicate IPC/table mapping, multi-identity mapping, unique IPC mapping, IPC template 15 mapping, IPC template 16 mapping, IPC template 17 mapping, IPC template 18 mapping, IPC template 19 mapping, IPC template 20 mapping, IPC template 21 mapping, IPC template 22 mapping, IPC template 23 mapping, IPC template 24 mapping, IPC template 25 mapping, IPC template 26 mapping, IPC template 27 mapping, IPC template 28 mapping, duplicate template 19 mapping, duplicate template 21 mapping, duplicate template 22 mapping, duplicate template 23 mapping, duplicate template 24 mapping, duplicate template 25 mapping, duplicate template 26 mapping, duplicate template 27 mapping, duplicate template 29 mapping, duplicate template 30 mapping, duplicate container mapping, runtime helper 23 mapping, runtime helper 24 mapping, runtime helper 25 mapping, runtime helper 26 mapping, runtime helper 27 mapping, runtime helper 29 mapping, runtime helper 30 mapping, target literal identities, and target config paths"
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
  const identities = ipcTemplates28.has(name)
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
  const duplicateContainerTemplate = duplicateContainerTemplates.get(entry.name);
  const runtimeHelper23 = runtimeHelper23Pending && entry.name === runtimeHelpers23Entry.name;
  const runtimeHelper24 = runtimeHelper24Pending && entry.name === runtimeHelpers24Entry.name;
  const runtimeHelper25 = runtimeHelpers25ByName.get(entry.name);
  const runtimeHelper26 = runtimeHelpers26ByName.get(entry.name);
  const runtimeHelper27 = runtimeHelpers27ByName.get(entry.name);
  const runtimeHelper29 = runtimeHelpers29ByName.get(entry.name);
  const runtimeHelper30 = runtimeHelpers30ByName.get(entry.name);
  const instructions = [];
  const configuredMappings = [destination, adjacentGlobalLoad, globalState, duplicateIpcAndTable, multiIdentityGlobal, ipcUniqueTemplate, ipcTemplate15, ipcTemplate16, ipcTemplate17, ipcTemplate18, ipcTemplate19, ipcTemplate20, ipcTemplate21, ipcTemplate22, ipcTemplate23, ipcTemplate24, ipcTemplate25, ipcTemplate26, ipcTemplate27, ipcTemplate28, duplicateTemplate19, duplicateTemplate21, duplicateTemplate22, duplicateTemplate23, duplicateTemplate24, duplicateTemplate25, duplicateTemplate26, duplicateTemplate27, duplicateTemplate29, duplicateTemplate30, duplicateContainerTemplate, runtimeHelper23, runtimeHelper24, runtimeHelper25, runtimeHelper26, runtimeHelper27, runtimeHelper29, runtimeHelper30].filter(Boolean);
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
    ""
  );
  if (runtimeHelper23) runtimeHelper23Pending = false;
  if (runtimeHelper24) runtimeHelper24Pending = false;
  if (runtimeHelper25) runtimeHelpers25Pending.delete(entry.name);
  if (runtimeHelper26) runtimeHelpers26Pending.delete(entry.name);
  if (runtimeHelper27) runtimeHelpers27Pending.delete(entry.name);
  if (runtimeHelper29) runtimeHelpers29Pending.delete(entry.name);
  if (runtimeHelper30) runtimeHelpers30Pending.delete(entry.name);
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
