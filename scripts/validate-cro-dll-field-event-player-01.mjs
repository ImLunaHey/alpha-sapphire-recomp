#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "config", "cro-dll-field-event-player-01.json");
const integrationPath = join(root, "config", "cro-sources.json");
const inventoryPath = join(root, "symbols", "cro", "DllFieldEventPlayer.csv");
const sourcePath = join(root, "src", "cro", "DllFieldEventPlayer", "contract_01.S");
const EXPECTED_OPERATION_HASH = "a1199f664aff9da18ec15521205e54bde5d7c32481df33d59493f28843c76240";
const EXPECTED_CONTROL_HASH = "da33bec8fe3543289de3f96c3cb9cbc1034d27e2b50c972c0fa6fc127df021d8";
const MAX_MANIFEST_SIZE = 1024 * 1024;

function check(value, message) {
  if (!value) throw new Error(message);
}

function exactKeys(value, keys, label) {
  check(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
  check(Object.keys(value).sort().join("\0") === [...keys].sort().join("\0"), `${label} keys differ`);
}

function sha(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function readManifest() {
  const bytes = readFileSync(manifestPath);
  check(bytes.length <= MAX_MANIFEST_SIZE, "manifest exceeds size cap");
  return JSON.parse(bytes.toString("utf8"));
}

function renderSource(manifest) {
  const labels = new Map(manifest.basicBlocks.map(block => [block.startOffset, block.label]));
  const lines = [
    "/* Independently implemented from docs/specs/cro/DllFieldEventPlayer_01.md. */",
    ".syntax unified", ".arch armv6k", ".fpu vfp", ".arm", "",
    '.section .text.func_00002000, "ax", %progbits', ".balign 4",
    ".global func_00002000", ".type func_00002000, %function", "func_00002000:",
  ];
  for (const operation of manifest.operations) {
    const label = labels.get(operation.offset);
    if (label && operation.offset !== 0) lines.push(`${label}:`);
    let operands = operation.operands;
    if (operation.mnemonic === "bl") {
      const veneer = Number.parseInt(operands.slice("veneer_".length), 16);
      const delta = manifest.function.address + operation.offset - veneer;
      operands = `. - 0x${delta.toString(16).toUpperCase()}`;
    }
    lines.push(`    ${operation.mnemonic}\t${operands}`);
  }
  lines.push(".size func_00002000, . - func_00002000", "");
  return lines.join("\n");
}

function validateObject(objectPath, readelfPath) {
  const result = spawnSync(readelfPath, ["--sections", "--symbols", "--relocs", "--wide", objectPath], {
    encoding: "utf8", maxBuffer: 4 * 1024 * 1024,
  });
  check(!result.error && result.status === 0, `readelf could not inspect ${objectPath}`);
  const output = result.stdout;
  const executable = [...output.matchAll(/^\s*\[\s*\d+\]\s+(\S+)\s+PROGBITS\s+\S+\s+\S+\s+([0-9a-f]+)\s+\S+\s+AX\s+/gimu)]
    .map(match => [match[1], Number.parseInt(match[2], 16)]);
  check(JSON.stringify(executable) === JSON.stringify([
    [".text.func_000036D4", 8], [".text.func_00002000", 2016],
  ]), "DllFieldEventPlayer executable sections differ");
  check(/^\s*\d+:\s+00000000\s+2016\s+FUNC\s+GLOBAL\s+DEFAULT\s+\d+\s+func_00002000$/mu.test(output),
    "func_00002000 object symbol differs");
  check(/^\s*\d+:\s+00000000\s+8\s+FUNC\s+GLOBAL\s+DEFAULT\s+\d+\s+func_000036D4$/mu.test(output),
    "func_000036D4 object symbol differs");
  check(/There are no relocations in this file\./u.test(output), "DllFieldEventPlayer object has relocations");
}

function validate(manifest) {
  exactKeys(manifest, ["schemaVersion", "targetRevision", "unit", "function", "abi", "frame",
    "callContracts", "calls", "literalPool", "basicBlocks", "operations", "operationScheduleSha256",
    "controlFlowSha256"], "manifest");
  check(manifest.schemaVersion === 1 && manifest.targetRevision === "AS_EUR_REV2"
    && manifest.unit === "DllFieldEventPlayer", "manifest identity differs");
  exactKeys(manifest.function, ["name", "address", "size", "mode", "instructionCount"], "function");
  check(manifest.function.name === "func_00002000" && manifest.function.address === 0x2000
    && manifest.function.size === 2016 && manifest.function.mode === "arm"
    && manifest.function.instructionCount === 504, "function boundary differs");

  check(Array.isArray(manifest.operations) && manifest.operations.length === 504, "operation count differs");
  const allowedMnemonics = new Set(["add", "addne", "and", "andne", "b", "bcc", "bcs", "beq", "bge", "bl", "blt",
    "bne", "cmp", "cmpne", "ldm", "ldr", "ldrb", "ldrbne", "ldrd", "mov", "moveq", "movge", "movlt",
    "movne", "mvn", "nop", "pop", "push", "stm", "str", "strb", "strh", "strd", "sub", "subs",
    "tst", "vcvt.f32.s32", "vldmia", "vldr", "vmov.f32", "vmul.f32", "vstmia", "vstr",
    "vsub.f32"]);
  for (let index = 0; index < manifest.operations.length; index++) {
    const operation = manifest.operations[index];
    exactKeys(operation, ["offset", "width", "mnemonic", "operands"], `operation ${index}`);
    check(operation.offset === index * 4 && operation.width === 4, `operation ${index} is not contiguous ARM`);
    check(allowedMnemonics.has(operation.mnemonic), `operation ${index} mnemonic is not approved`);
    check(typeof operation.operands === "string" && operation.operands.length <= 96,
      `operation ${index} operands are invalid`);
    check(!/[0-9a-f]{8}\s+[0-9a-f]{8}|(?:^|\W)0x[0-9a-f]{8}(?:$|\W)/i.test(operation.operands),
      `operation ${index} resembles encoded target data`);
  }
  check(manifest.operationScheduleSha256 === EXPECTED_OPERATION_HASH
    && sha(manifest.operations) === EXPECTED_OPERATION_HASH, "operation schedule hash differs");

  check(Array.isArray(manifest.callContracts) && manifest.callContracts.length === 30,
    "call-contract count differs");
  const contractNames = new Set();
  const contractRoles = new Map();
  for (const contract of manifest.callContracts) {
    exactKeys(contract, ["veneer", "arguments", "result", "role"], "call contract");
    check(/^veneer_00000[0-2][0-9a-f]{2}$/.test(contract.veneer), "non-neutral veneer identity");
    check(!contractNames.has(contract.veneer), "duplicate veneer contract");
    check(Array.isArray(contract.arguments) && contract.arguments.length <= 5
      && contract.arguments.every(value => typeof value === "string"), "invalid call arguments");
    check(typeof contract.result === "string" && typeof contract.role === "string", "invalid call contract text");
    contractNames.add(contract.veneer);
    contractRoles.set(contract.veneer, contract.role);
  }
  check(Array.isArray(manifest.calls) && manifest.calls.length === 54, "call count differs");
  const operationCalls = manifest.operations.filter(operation => operation.mnemonic === "bl");
  check(operationCalls.length === manifest.calls.length, "operation/call ledger count differs");
  manifest.calls.forEach((call, index) => {
    exactKeys(call, ["offset", "veneer", "contract"], `call ${index}`);
    check(call.offset === operationCalls[index].offset && call.veneer === operationCalls[index].operands,
      `call ${index} differs from operation schedule`);
    check(contractNames.has(call.veneer) && contractRoles.get(call.veneer) === call.contract,
      `call ${index} lacks its abstract contract`);
  });

  check(Array.isArray(manifest.basicBlocks) && manifest.basicBlocks.length === 90, "basic-block count differs");
  let cursor = 0;
  const starts = new Set(manifest.basicBlocks.map(block => block.startOffset));
  for (const [index, block] of manifest.basicBlocks.entries()) {
    exactKeys(block, ["label", "startOffset", "endOffsetExclusive", "successors"], `block ${index}`);
    check(block.startOffset === cursor && block.endOffsetExclusive > cursor
      && block.endOffsetExclusive <= 2016 && block.endOffsetExclusive % 4 === 0, `block ${index} extent differs`);
    check(block.label === `.L${(0x2000 + cursor).toString(16).toUpperCase().padStart(4, "0")}`,
      `block ${index} label differs`);
    check(Array.isArray(block.successors) && block.successors.length <= 2
      && block.successors.every(value => Number.isInteger(value) && value >= 0 && value < 2016),
      `block ${index} successors are invalid`);
    cursor = block.endOffsetExclusive;
  }
  check(cursor === 2016, "basic blocks do not cover the function");
  for (const block of manifest.basicBlocks) for (const successor of block.successors)
    check(starts.has(successor), `successor ${successor} is not a block leader`);
  check(manifest.controlFlowSha256 === EXPECTED_CONTROL_HASH
    && sha(manifest.basicBlocks) === EXPECTED_CONTROL_HASH, "control-flow schedule hash differs");

  exactKeys(manifest.literalPool, ["startAddress", "size", "entries"], "literal pool");
  check(manifest.literalPool.startAddress === 0x27e0 && manifest.literalPool.size === 28
    && Array.isArray(manifest.literalPool.entries) && manifest.literalPool.entries.length === 7,
    "literal-pool extent differs");
  const expectedLiteralSections = [".data", ".text", ".bss", ".rodata", ".rodata", ".rodata", "undefined-import"];
  const expectedAddends = [0, 696, 0, 16, 0, 8, 0];
  manifest.literalPool.entries.forEach((entry, index) => {
    exactKeys(entry, ["address", "identity", "targetSection", "addend"], `literal ${index}`);
    check(entry.address === 0x27e0 + index * 4 && entry.targetSection === expectedLiteralSections[index]
      && entry.addend === expectedAddends[index] && /^[A-Za-z_][A-Za-z0-9_]*$/.test(entry.identity),
      `literal ${index} differs`);
  });

  const inventory = readFileSync(inventoryPath, "utf8");
  check(inventory.includes('00002000,"func_00002000","Global",$a,000007E0,".text"'),
    "public inventory boundary differs");
  check(!JSON.stringify(manifest).includes("/home/") && !JSON.stringify(manifest).includes("_ZN"),
    "manifest leaks a private path or target symbol");

  const source = readFileSync(sourcePath, "utf8");
  check(source === renderSource(manifest), "implementation source differs from the approved symbolic schedule");
  check(!/\.incbin\b|^\s*\.(?:byte|hword|short|word|long|quad|ascii|asciz|string|inst)\b/imu.test(source),
    "implementation contains opaque byte or data emission");

  const integration = JSON.parse(readFileSync(integrationPath, "utf8"));
  const unit = integration.units.find(entry => entry.name === "DllFieldEventPlayer");
  check(unit && JSON.stringify(unit.sources) === JSON.stringify([
    { path: "src/cro/DllFieldEventPlayer.c", mode: "arm" },
    { path: "src/cro/DllFieldEventPlayer/contract_01.S", mode: "arm" },
  ]), "integrated source ownership differs");
  check(JSON.stringify(unit.functions) === JSON.stringify([
    { name: "func_00002000", address: 0x2000, size: 2016, semantics: "field-event-player-selection" },
    { name: "func_000036D4", address: 0x36d4, size: 8, semantics: "store-u8", offset: 217 },
  ]), "integrated function claims differ");
}

const manifest = readManifest();
validate(manifest);

const objectIndex = process.argv.indexOf("--object");
const readelfIndex = process.argv.indexOf("--readelf");
check((objectIndex < 0) === (readelfIndex < 0), "--object and --readelf must be supplied together");
if (objectIndex >= 0) {
  check(process.argv[objectIndex + 1] && process.argv[readelfIndex + 1], "object validation arguments are incomplete");
  validateObject(resolve(process.argv[objectIndex + 1]), resolve(process.argv[readelfIndex + 1]));
}

if (process.argv.includes("--self-test")) {
  const hostile = structuredClone(manifest);
  hostile.operations[0].operands = "{r0}";
  let rejected = false;
  try { validate(hostile); } catch { rejected = true; }
  check(rejected, "hostile schedule mutation was accepted");
}

console.log("Validated DllFieldEventPlayer batch 01: 504 operations, 90 blocks, 54 calls, 30 veneer contracts, 7 pool identities.");
