import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(
  readFileSync(join(root, "config", "arm-runtime-svc-thunks.json"), "utf8")
);
const source = readFileSync(
  join(root, "src", "main", "arm_runtime_svc_thunks.S"),
  "utf8"
);

const expectedRows = [
  ["func_001000E4", "thumbThunk", 8, "func_001000EC", 1],
  ["func_001003E0", "thumbThunk", 8, "func_001003E8", 1],
  ["func_00100B6C", "thumbThunk", 8, "func_00100B7E", 11],
  ["func_00108808", "svc", 24, "SVC_GET_RESOURCE_LIMIT"],
  ["func_0010E24C", "svc", 24, "SVC_CREATE_ADDRESS_ARBITER"],
  ["func_00117830", "svc", 24, "SVC_CONNECT_TO_PORT"],
  ["func_00117848", "svc", 36, "SVC_CONTROL_MEMORY"],
  ["func_0011786C", "svc", 24, "SVC_CREATE_MUTEX"],
  ["func_00117884", "svc", 36, "SVC_CREATE_THREAD"],
  ["func_00123D48", "svc", 24, "SVC_GET_PROCESS_ID"],
  ["func_00123D60", "svc", 20, "SVC_SLEEP_THREAD"],
  ["func_00123D74", "svc", 36, "SVC_WAIT_SYNCHRONIZATION_N"],
  ["func_00144D04", "svc", 24, "SVC_CREATE_EVENT"],
  ["func_0015EB4C", "svc", 24, "SVC_ARBITRATE_ADDRESS"],
  ["func_0015EB64", "svc", 24, "SVC_BREAK"],
  ["func_00177EE4", "svc", 28, "SVC_CREATE_MEMORY_BLOCK"],
  ["func_0017E30C", "svc", 24, "SVC_GET_THREAD_ID"],
  ["func_0019BEB0", "svc", 28, "SVC_GET_HANDLE_INFO"],
  ["func_0019BE80", "svc", 24, "SVC_CREATE_TIMER"],
  ["func_0019BECC", "svc", 24, "SVC_GET_THREAD_PRIORITY"],
  ["func_0019BEE4", "svc", 24, "SVC_SET_TIMER"],
  ["func_001B04B8", "returnStub", 4],
  ["func_001B6AB8", "returnStub", 4],
  ["func_001BD0B8", "returnStub", 4],
  ["func_003009EC", "thumbThunk", 8, "func_003009F4", 1],
];

if (
  config.schemaVersion !== 1 ||
  !Array.isArray(config.functions) ||
  config.functions.length !== expectedRows.length
) {
  throw new Error("Unexpected ARM runtime/SVC coverage mapping format");
}

const expected = new Map();
for (const row of expectedRows) {
  const [name, kind, size, detail, pcDelta] = row;
  expected.set(name, { name, kind, size, detail, pcDelta });
}

const configured = new Map();
for (const entry of config.functions) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    !/^func_[0-9A-F]{8}$/.test(entry.name) ||
    configured.has(entry.name)
  ) {
    throw new Error("Invalid or duplicate ARM runtime/SVC coverage entry");
  }
  const wanted = expected.get(entry.name);
  if (wanted === undefined || entry.kind !== wanted.kind || entry.size !== wanted.size) {
    throw new Error(`Coverage mismatch for ${entry.name}`);
  }
  if (wanted.kind === "svc" && entry.service !== wanted.detail) {
    throw new Error(`Service mismatch for ${entry.name}`);
  }
  if (
    wanted.kind === "thumbThunk" &&
    (entry.destination !== wanted.detail || entry.pcDelta !== wanted.pcDelta)
  ) {
    throw new Error(`Thumb destination mismatch for ${entry.name}`);
  }
  configured.set(entry.name, entry);
}

if (/^\s*\.(?:word|inst|byte|short|hword|long)\b/m.test(source)) {
  throw new Error("ARM runtime/SVC source contains embedded instruction/data words");
}
if (/^\s*svc\s+(?:#?0x|#?[0-9])/m.test(source)) {
  throw new Error("SVC instructions must use public symbolic identifiers");
}
const publicServices = new Map([
  ["SVC_CONTROL_MEMORY", "0x01"],
  ["SVC_CREATE_THREAD", "0x08"],
  ["SVC_SLEEP_THREAD", "0x0A"],
  ["SVC_GET_THREAD_PRIORITY", "0x0B"],
  ["SVC_CREATE_MUTEX", "0x13"],
  ["SVC_CREATE_EVENT", "0x17"],
  ["SVC_CREATE_TIMER", "0x1A"],
  ["SVC_SET_TIMER", "0x1B"],
  ["SVC_CREATE_MEMORY_BLOCK", "0x1E"],
  ["SVC_CREATE_ADDRESS_ARBITER", "0x21"],
  ["SVC_ARBITRATE_ADDRESS", "0x22"],
  ["SVC_WAIT_SYNCHRONIZATION_N", "0x25"],
  ["SVC_GET_HANDLE_INFO", "0x29"],
  ["SVC_CONNECT_TO_PORT", "0x2D"],
  ["SVC_GET_PROCESS_ID", "0x35"],
  ["SVC_GET_THREAD_ID", "0x37"],
  ["SVC_GET_RESOURCE_LIMIT", "0x38"],
  ["SVC_BREAK", "0x3C"],
]);
for (const [identifier, number] of publicServices) {
  const definition = new RegExp(`^\\.equ ${identifier},\\s+${number}$`, "m");
  if (!definition.test(source)) {
    throw new Error(`Missing public service identifier ${identifier} = ${number}`);
  }
}
if (!/^\.equ USER_BREAK_UNLOAD_RO,\s+4$/m.test(source)) {
  throw new Error("Missing public UNLOAD_RO break reason");
}

const actual = new Map();
function record(name, kind, detail, pcDelta) {
  if (actual.has(name)) throw new Error(`Duplicate source definition for ${name}`);
  actual.set(name, { kind, detail, pcDelta });
}

const requiredSingleOutputMacro = `.macro SINGLE_OUTPUT name, service
    BEGIN_ARM_FUNCTION \\name
    push {r0}
    svc \\service
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    bx lr
    END_ARM_FUNCTION \\name
.endm`;
if (!source.includes(requiredSingleOutputMacro)) {
  throw new Error("Single-output SVC macro has an unexpected shape");
}
for (const match of source.matchAll(
  /^SINGLE_OUTPUT (func_[0-9A-F]{8}), (SVC_[A-Z0-9_]+)$/gm
)) {
  record(match[1], "svc", match[2]);
}
for (const match of source.matchAll(
  /^BEGIN_ARM_FUNCTION (func_[0-9A-F]{8})\n([\s\S]*?)^END_ARM_FUNCTION \1$/gm
)) {
  const services = [...match[2].matchAll(/^\s*svc (SVC_[A-Z0-9_]+)$/gm)];
  if (services.length !== 1) {
    throw new Error(`Expected one symbolic SVC instruction in ${match[1]}`);
  }
  record(match[1], "svc", services[0][1]);
}
for (const match of source.matchAll(
  /^ARM_TO_THUMB (func_[0-9A-F]{8}), (func_[0-9A-F]{8}), ([0-9]+)$/gm
)) {
  record(match[1], "thumbThunk", match[2], Number.parseInt(match[3], 10));
}
for (const match of source.matchAll(/^ARM_RETURN_STUB (func_[0-9A-F]{8})$/gm)) {
  record(match[1], "returnStub");
}

for (const [name, wanted] of expected) {
  const found = actual.get(name);
  if (
    found === undefined ||
    found.kind !== wanted.kind ||
    found.detail !== wanted.detail ||
    found.pcDelta !== wanted.pcDelta
  ) {
    throw new Error(`Assembly coverage mismatch for ${name}`);
  }
}
if (actual.size !== expected.size) {
  throw new Error(`Expected ${expected.size} source definitions, found ${actual.size}`);
}
const exactSvcBodies = new Map([
  [
    "func_00117848",
    `    push {r0, r4}
    ldr r0, [sp, #8]
    ldr r4, [sp, #12]
    svc SVC_CONTROL_MEMORY
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    pop {r4}
    bx lr\n`,
  ],
  [
    "func_00117884",
    `    push {r0, r4}
    ldr r0, [sp, #8]
    ldr r4, [sp, #12]
    svc SVC_CREATE_THREAD
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    pop {r4}
    bx lr\n`,
  ],
  [
    "func_00123D60",
    `    mov r0, #0
    mov r1, r0
    mov r0, r0
    svc SVC_SLEEP_THREAD
    bx lr\n`,
  ],
  [
    "func_00123D74",
    `    push {r0, r4}
    ldr r0, [sp, #8]
    ldr r4, [sp, #12]
    svc SVC_WAIT_SYNCHRONIZATION_N
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    pop {r4}
    bx lr\n`,
  ],
  [
    "func_0015EB64",
    `    mov r2, r1
    mov r1, r0
    mov r0, #USER_BREAK_UNLOAD_RO
    mov r0, r0
    svc SVC_BREAK
    bx lr\n`,
  ],
  [
    "func_00177EE4",
    `    push {r0}
    ldr r0, [sp, #4]
    svc SVC_CREATE_MEMORY_BLOCK
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    bx lr\n`,
  ],
  [
    "func_0019BEB0",
    `    push {r0}
    svc SVC_GET_HANDLE_INFO
    ldr r3, [sp]
    str r1, [r3]
    str r2, [r3, #4]
    add sp, sp, #4
    bx lr\n`,
  ],
]);
for (const [name, body] of exactSvcBodies) {
  if (!source.includes(`BEGIN_ARM_FUNCTION ${name}\n${body}END_ARM_FUNCTION ${name}`)) {
    throw new Error(`Exact assembly shape mismatch for ${name}`);
  }
}
const requiredThumbMacro = `.macro ARM_TO_THUMB name, destination, pc_delta
    BEGIN_ARM_FUNCTION \\name
    add r12, pc, #\\pc_delta
    bx r12
    END_ARM_FUNCTION \\name
.endm`;
if (!source.includes(requiredThumbMacro)) {
  throw new Error("ARM-to-Thumb macro has an unexpected shape");
}
const requiredReturnMacro = `.macro ARM_RETURN_STUB name
    BEGIN_ARM_FUNCTION \\name
    mov pc, lr
    END_ARM_FUNCTION \\name
.endm`;
if (!source.includes(requiredReturnMacro)) {
  throw new Error("ARM return stubs must retain non-interworking return semantics");
}

const [objectPath, readelf] = process.argv.slice(2);
if ((objectPath === undefined) !== (readelf === undefined)) {
  throw new Error("Object and readelf paths must be provided together");
}
if (objectPath === undefined) {
  console.log(`Validated deterministic source coverage for ${actual.size} ARM runtime/SVC routines.`);
  process.exit(0);
}

function inspect(args) {
  const result = spawnSync(readelf, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw result.error ?? new Error(`readelf exited with status ${result.status}`);
  }
  return result.stdout;
}

const sectionOutput = inspect(["--sections", "--wide", objectPath]);
const symbolOutput = inspect(["--symbols", "--wide", objectPath]);
const relocationOutput = inspect(["--relocs", "--wide", objectPath]);
const sections = new Map();
const sectionPattern =
  /^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+\S+\s+\S+\s+([0-9A-Fa-f]+)\s+\S+\s+(\S*)\s+\S+\s+\S+\s+(\d+)\s*$/gm;
for (const match of sectionOutput.matchAll(sectionPattern)) {
  sections.set(match[2], {
    index: Number.parseInt(match[1], 10),
    type: match[3],
    size: Number.parseInt(match[4], 16),
    flags: match[5],
    alignment: Number.parseInt(match[6], 10),
  });
}

const symbols = new Map();
const symbolPattern =
  /^\s*\d+:\s+([0-9A-Fa-f]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/gm;
for (const match of symbolOutput.matchAll(symbolPattern)) {
  const entries = symbols.get(match[7]) ?? [];
  entries.push({
    value: Number.parseInt(match[1], 16),
    size: Number.parseInt(match[2], 10),
    type: match[3],
    binding: match[4],
    visibility: match[5],
    sectionIndex: match[6],
  });
  symbols.set(match[7], entries);
}

for (const [name, wanted] of expected) {
  const sectionName = `.text.${name}`;
  const section = sections.get(sectionName);
  if (
    section === undefined ||
    section.type !== "PROGBITS" ||
    section.size !== wanted.size ||
    !section.flags.includes("A") ||
    !section.flags.includes("X") ||
    section.alignment !== 4
  ) {
    throw new Error(`Invalid executable section for ${name}`);
  }
  const entries = symbols.get(name) ?? [];
  if (
    entries.length !== 1 ||
    entries[0].value !== 0 ||
    entries[0].size !== wanted.size ||
    entries[0].type !== "FUNC" ||
    entries[0].binding !== "GLOBAL" ||
    entries[0].visibility !== "DEFAULT" ||
    Number.parseInt(entries[0].sectionIndex, 10) !== section.index
  ) {
    throw new Error(`Invalid function symbol for ${name}`);
  }
  if (relocationOutput.includes(sectionName)) {
    throw new Error(`Unexpected relocation for ${name}`);
  }
}

console.log(`Validated ${expected.size} ARM runtime/SVC sections and symbols (${expectedRows.reduce((sum, row) => sum + row[2], 0)} bytes).`);
