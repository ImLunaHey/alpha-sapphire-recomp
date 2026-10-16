#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const CONFIG_PATH = join(ROOT, "config/arm-runtime-helpers-81.json");
const SPEC_PATH = join(ROOT, "docs/specs/main/arm_runtime_helpers_81.md");
const SOURCE_PATH = join(ROOT, "src/main/arm_runtime_helpers_81.S");
const MAX_BUFFER = 16 * 1024 * 1024;

const EXPECTED = Object.freeze({
  sourceSha256: "11c6e6e1a3bcb1c9d60892ff54e22c37a2e9c391d092f989d1dc69e325e707da",
  configSha256: "8bfea0848f53ac4fad0a19eab2315b563d7828dbfe58d59472cab37cbf9793a9",
  specSha256: "6d60fc044982a1637a4c782b1d41c4f70d74b7a4d7aa9f25e5573fd4916c9082",
  instructionScheduleSha256: "554c8432b1bb7fbbc5825d2dff5b22603be9a0fe233debf0c60fb74e31b573f0",
  branchScheduleSha256: "172dbb4273c55ac3b13d05b1176703eae08e3bb26f331d228070b0e5e4ab8860",
  returnScheduleSha256: "d8005464a744f8dab787f10a214a0062a8bb33b92d1e0006be3298ea64d68b53",
  functions: 24,
  bytes: 820,
  instructions: 205,
  branches: 8,
  returns: 24,
  memoryOperations: 87,
});

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function run(tool, args) {
  const result = spawnSync(tool, args, { encoding: "utf8", maxBuffer: MAX_BUFFER });
  if (result.error) fail(`${basename(tool)} failed: ${result.error.message}`);
  if (result.status !== 0) {
    fail(`${basename(tool)} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function pathCandidates(name) {
  const candidates = [];
  const fromPath = spawnSync("sh", ["-c", `command -v ${name}`], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });
  if (fromPath.status === 0 && fromPath.stdout.trim()) candidates.push(fromPath.stdout.trim());
  if (existsSync("/nix/store")) {
    for (const entry of readdirSync("/nix/store")) {
      if (!entry.includes("arm-none-eabi-binutils-2.44")) continue;
      candidates.push(join("/nix/store", entry, "bin", name));
    }
  }
  return candidates.filter((item, index, all) => existsSync(item) && all.indexOf(item) === index);
}

function findTool(name, envName) {
  const explicit = process.env[envName];
  const candidates = explicit ? [explicit] : pathCandidates(name);
  for (const candidate of candidates) {
    const version = spawnSync(candidate, ["--version"], { encoding: "utf8", maxBuffer: MAX_BUFFER });
    if (version.status === 0 && /\b2\.44\b/.test(version.stdout)) return candidate;
  }
  fail(`GNU Arm binutils 2.44 tool ${name} not found (set ${envName})`);
}

function extractSpecSchedule(spec) {
  const match = spec.match(/## Exact schedules[\s\S]*?```asm\n([\s\S]*?)\n```/);
  assert(match, "exact schedule assembly block is missing from specification");
  const lines = match[1].split("\n");
  const schedule = [];
  let name = null;
  let offset = null;
  for (const line of lines) {
    let found = line.match(/^(func_[0-9A-F]+):$/);
    if (found) {
      name = found[1];
      continue;
    }
    found = line.match(/^\.Lfunc_[0-9A-F]+_([0-9a-f]+):$/);
    if (found) {
      offset = found[1];
      continue;
    }
    found = line.match(/^\s+([a-z][a-z0-9.]*)\s+(.+)$/);
    if (!found || name === null || offset === null) continue;
    const operands = found[2].replace(/\.Lfunc_[0-9A-F]+_([0-9a-f]+)/g, "$1");
    schedule.push({ name, offset, mnemonic: found[1], operands });
    offset = null;
  }
  return schedule;
}

function parseSectionDisassembly(text, expectedName) {
  const schedule = [];
  let sawHeader = false;
  for (const line of text.split("\n")) {
    if (line === `00000000 <${expectedName}>:`) sawHeader = true;
    const found = line.match(/^\s*([0-9a-f]+):\s+[0-9a-f]+\s+([a-z][a-z0-9.]*)\s*(.*?)\s*$/);
    if (!found || !sawHeader) continue;
    let mnemonic = found[2];
    let operands = found[3].replace(/(?:^|\s+)@.*$/, "").replace(/\s+<[^>]+>$/, "").trim();
    // Binutils prints the ARM architectural NOP encoding as an alias.  The
    // contract schedule intentionally spells out its MOV form.
    if (mnemonic === "nop" && /@ \(mov r0, r0\)/.test(found[3])) {
      mnemonic = "mov";
      operands = "r0, r0";
    }
    schedule.push({ name: expectedName, offset: found[1], mnemonic, operands });
  }
  assert(sawHeader, `${expectedName}: symbol header missing from section-scoped disassembly`);
  return schedule;
}

function scheduleLine(item) {
  return `${item.name}:${item.offset}:${item.mnemonic}:${item.operands}`;
}

function branchLine(item) {
  return `${item.name}:${item.offset}:${item.mnemonic}:${item.operands}`;
}

function isDirectBranch(item) {
  return /^b(?:eq|ne|cs|cc|hi|ls|ge|lt|gt|le|vs|vc|mi|pl)$/.test(item.mnemonic);
}

function isMemoryOperation(item) {
  return /^(?:(?:ldr|ldrb|ldrh|ldrsb|str|strb|strh)(?:eq|ne|cs|cc|hi|ls|ge|lt|gt|le|vs|vc|mi|pl)?|push|pop|stm|vldr|vstr|vldmia|vstmia)$/.test(item.mnemonic);
}

function parseSections(objdump, objectPath) {
  const output = run(objdump, ["-h", objectPath]);
  const sections = new Map();
  for (const line of output.split("\n")) {
    const found = line.match(/^\s*\d+\s+(\S+)\s+([0-9a-fA-F]{8})\s/);
    if (found) sections.set(found[1], Number.parseInt(found[2], 16));
  }
  return sections;
}

function parseDefinedGlobalFunctions(readelf, objectPath) {
  const output = run(readelf, ["-Ws", objectPath]);
  const symbols = new Map();
  for (const line of output.split("\n")) {
    const found = line.match(/^\s*\d+:\s+[0-9a-fA-F]+\s+(\d+)\s+FUNC\s+GLOBAL\s+DEFAULT\s+(\d+)\s+(\S+)$/);
    if (found) symbols.set(found[3], Number(found[1]));
  }
  return symbols;
}

function relocationSections(readelf, objectPath) {
  const output = run(readelf, ["-rW", objectPath]);
  return [...output.matchAll(/Relocation section '([^']+)'/g)].map((match) => match[1]);
}

function validateObject(objectPath, tools, config, expectedSchedule, standalone) {
  const sections = parseSections(tools.objdump, objectPath);
  const symbols = parseDefinedGlobalFunctions(tools.readelf, objectPath);
  const selectedNames = new Set(config.functions.map(({ name }) => name));

  for (const { name, size } of config.functions) {
    assert(sections.get(`.text.${name}`) === size, `${name}: section size is not ${size}`);
    assert(symbols.get(name) === size, `${name}: global function symbol is missing or has wrong size`);
  }
  if (standalone) {
    const actualSelectedSections = [...sections].filter(([name]) => name.startsWith(".text.func_") && name !== ".text");
    assert(actualSelectedSections.length === config.functions.length, "unexpected owned function section in standalone object");
    const globalFunctions = [...symbols.keys()];
    assert(globalFunctions.length === selectedNames.size && globalFunctions.every((name) => selectedNames.has(name)),
      "standalone object exports an unexpected global function");
  }

  const actualSchedule = [];
  for (const { name } of config.functions) {
    const scoped = run(tools.objdump, ["-d", "-j", `.text.${name}`, objectPath]);
    actualSchedule.push(...parseSectionDisassembly(scoped, name));
  }
  assert(actualSchedule.length === EXPECTED.instructions,
    `instruction count ${actualSchedule.length} != ${EXPECTED.instructions}`);
  assert(actualSchedule.map(scheduleLine).join("\n") === expectedSchedule.map(scheduleLine).join("\n"),
    "mnemonic/operand schedule differs from specification");

  const branches = actualSchedule.filter(isDirectBranch);
  const returns = actualSchedule.filter((item) => item.mnemonic === "bx" && item.operands === "lr");
  const memoryOperations = actualSchedule.filter(isMemoryOperation);
  assert(branches.length === EXPECTED.branches, `local branch count ${branches.length} != ${EXPECTED.branches}`);
  assert(branches.every((item) => item.mnemonic !== "b"), "unconditional local branch found");
  assert(returns.length === EXPECTED.returns, `return count ${returns.length} != ${EXPECTED.returns}`);
  assert(memoryOperations.length === EXPECTED.memoryOperations,
    `memory-operation count ${memoryOperations.length} != ${EXPECTED.memoryOperations}`);
  assert(!actualSchedule.some((item) => /^(?:bl|blx)$/.test(item.mnemonic)), "call instruction found");
  assert(!actualSchedule.some((item) => /(?:^|[^a-z])pc(?:$|[^a-z])/.test(item.operands)),
    "PC-relative access found");

  for (const item of branches) {
    const size = config.functions.find(({ name }) => name === item.name).size;
    const target = Number.parseInt(item.operands, 16);
    assert(Number.isInteger(target) && target >= 0 && target < size && target % 4 === 0,
      `${item.name}:${item.offset}: branch leaves owned function`);
  }

  assert(sha256(branches.map(branchLine).join("\n")) === EXPECTED.branchScheduleSha256,
    "direct-branch schedule hash mismatch");
  assert(sha256(returns.map(scheduleLine).join("\n")) === EXPECTED.returnScheduleSha256,
    "return schedule hash mismatch");
  assert(!relocationSections(tools.readelf, objectPath).some((name) =>
    config.functions.some(({ name: fn }) => name === `.rel.text.${fn}` || name === `.rela.text.${fn}`)),
  "relocation targets an owned function section");
  return { actualSchedule, branches, returns, memoryOperations };
}

const source = readFileSync(SOURCE_PATH);
const configBytes = readFileSync(CONFIG_PATH);
const specBytes = readFileSync(SPEC_PATH);
assert(sha256(source) === EXPECTED.sourceSha256, "source SHA-256 mismatch");
assert(sha256(configBytes) === EXPECTED.configSha256, "config SHA-256 mismatch");
assert(sha256(specBytes) === EXPECTED.specSha256, "specification SHA-256 mismatch");

const config = JSON.parse(configBytes);
const spec = specBytes.toString("utf8");
assert(config.source === "src/main/arm_runtime_helpers_81.S", "unexpected source path in config");
assert(config.sourceSha256 === EXPECTED.sourceSha256, "config source SHA-256 mismatch");
assert(config.mode === "arm", "config mode is not ARM");
assert(config.totalBodySize === EXPECTED.bytes && config.totalAdjacentSize === 0, "config size totals mismatch");
assert(config.functions.length === EXPECTED.functions, "config function count mismatch");
assert(new Set(config.functions.map(({ name }) => name)).size === EXPECTED.functions, "duplicate function name");
assert(config.functions.every(({ calls, adjacentWords }) => calls.length === 0 && adjacentWords.length === 0),
  "config permits a call or adjacent data");
assert(config.branchScheduleSha256 === EXPECTED.branchScheduleSha256, "config branch hash mismatch");
assert(config.returnScheduleSha256 === EXPECTED.returnScheduleSha256, "config return hash mismatch");
assert(spec.includes(`canonical full mnemonic/operand instruction-schedule SHA-256 is\n\`${EXPECTED.instructionScheduleSha256}\``),
  "specification instruction schedule hash mismatch");
assert(spec.includes(`Source SHA-256: \`${EXPECTED.sourceSha256}\``), "specification source hash mismatch");

const expectedSchedule = extractSpecSchedule(spec);
assert(expectedSchedule.length === EXPECTED.instructions, "specification instruction count mismatch");
assert(expectedSchedule.reduce((sum, item) => sum + (Number.parseInt(item.offset, 16) % 4 === 0 ? 4 : 0), 0)
  === EXPECTED.bytes, "specification instruction byte total mismatch");

const tools = {
  as: findTool("arm-none-eabi-as", "ARM_AS"),
  objdump: findTool("arm-none-eabi-objdump", "ARM_OBJDUMP"),
  readelf: findTool("arm-none-eabi-readelf", "ARM_READELF"),
  ld: findTool("arm-none-eabi-ld", "ARM_LD"),
};
const supplied = process.argv.slice(2);
assert(supplied.length <= 1, "usage: validate-arm-runtime-helpers-81.mjs [object]");
const work = mkdtempSync(join(tmpdir(), "arm-runtime-helpers-81-"));
try {
  const standalone = join(work, "arm_runtime_helpers_81.o");
  run(tools.as, ["-march=armv6k", "-mfpu=vfpv2", "-o", standalone, SOURCE_PATH]);
  const standaloneMetrics = validateObject(standalone, tools, config, expectedSchedule, true);
  assert(relocationSections(tools.readelf, standalone).length === 0, "standalone object has a relocation section");

  const hostileSource = join(work, "hostile.S");
  const hostileObject = join(work, "hostile.o");
  const combinedObject = join(work, "combined.o");
  writeFileSync(hostileSource, `.syntax unified
.arch armv6k
.arm
.section .text.func_003997E4.hostile,"ax",%progbits
.global hostile_func_003997E4
.type hostile_func_003997E4,%function
hostile_func_003997E4:
  bl hostile_undefined_external
  bx lr
.size hostile_func_003997E4,.-hostile_func_003997E4
.section .data.hostile,"aw",%progbits
.word hostile_undefined_external
`);
  run(tools.as, ["-march=armv6k", "-o", hostileObject, hostileSource]);
  run(tools.ld, ["-r", "-o", combinedObject, hostileObject, standalone]);
  const combinedMetrics = validateObject(combinedObject, tools, config, expectedSchedule, false);
  assert(relocationSections(tools.readelf, combinedObject).length > 0,
    "hostile combined-object fixture unexpectedly has no foreign relocations");
  assert(combinedMetrics.actualSchedule.map(scheduleLine).join("\n") ===
    standaloneMetrics.actualSchedule.map(scheduleLine).join("\n"),
  "foreign combined object changed section-scoped schedule");
  if (supplied.length === 1) {
    validateObject(resolve(supplied[0]), tools, config, expectedSchedule, false);
  }

  console.log(`arm runtime/helper batch 81 validated: ${EXPECTED.functions} functions, ${EXPECTED.bytes} bytes, ` +
    `${EXPECTED.instructions} instructions, ${EXPECTED.branches} conditional local branches, ` +
    `${EXPECTED.returns} returns, ${EXPECTED.memoryOperations} memory operations`);
  console.log(`source sha256 ${EXPECTED.sourceSha256}`);
  console.log(`instruction schedule sha256 ${EXPECTED.instructionScheduleSha256}`);
  console.log(`branch schedule sha256 ${EXPECTED.branchScheduleSha256}`);
  console.log(`return schedule sha256 ${EXPECTED.returnScheduleSha256}`);
  console.log("standalone and hostile combined-object checks passed; zero owned relocations/calls/PC-relative/adjacent/external data");
} finally {
  rmSync(work, { recursive: true, force: true });
}
