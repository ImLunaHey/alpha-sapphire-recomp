#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MAX_BUFFER = 16 * 1024 * 1024;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "config/arm-ipc-templates-65.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
const expectedNames = [
  "func_00181E14", "func_00181EE0", "func_001820E4", "func_00182290",
  "func_0018230C", "func_001823AC", "func_00182458", "func_0018246C",
];
const expectedSizes = [204, 244, 176, 124, 48, 144, 20, 100];
const expectedHash = "f8aec9e9ec353c1fa8c159d1b273e5f4a045f8dcba591d424481e697df14d056";
const ownedSectionSizes = new Map([
  ["func_00181E14", 204], ["func_00181EE0", 244], ["func_001820E4", 188],
  ["func_00182290", 124], ["func_0018230C", 56], ["func_001823AC", 156],
  ["func_00182458", 20], ["func_0018246C", 104],
]);

function fail(message) {
  throw new Error(`arm-ipc-templates-65: ${message}`);
}

function same(actual, expected, what) {
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    fail(`${what} mismatch\nexpected ${JSON.stringify(expected)}\nactual   ${JSON.stringify(actual)}`);
}

function findTool(name, explicit) {
  if (explicit) {
    if (!existsSync(explicit)) fail(`${name} not found at ${explicit}`);
    return explicit;
  }
  const probe = spawnSync("sh", ["-c", `command -v ${name}`], { encoding: "utf8", maxBuffer: MAX_BUFFER });
  if (probe.status === 0 && probe.stdout.trim()) return probe.stdout.trim();
  if (existsSync("/nix/store")) {
    for (const entry of readdirSync("/nix/store").sort()) {
      const candidate = join("/nix/store", entry, "bin", name);
      if (existsSync(candidate)) return candidate;
    }
  }
  fail(`cannot locate ${name}; set ARM_AS/ARM_READELF/ARM_LD`);
}

function run(tool, args, input) {
  const result = spawnSync(tool, args, { encoding: "utf8", maxBuffer: MAX_BUFFER, input });
  if (result.error) fail(`${basename(tool)} failed: ${result.error.message}`);
  if (result.status !== 0) fail(`${basename(tool)} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

const as = findTool("arm-none-eabi-as", process.env.ARM_AS);
const readelf = findTool("arm-none-eabi-readelf", process.env.ARM_READELF);
const siblingLd = join(dirname(as), "arm-none-eabi-ld");
const ld = findTool("arm-none-eabi-ld", process.env.ARM_LD || (existsSync(siblingLd) ? siblingLd : undefined));

function validateManifest() {
  if (config.schemaVersion !== 1 || config.mode !== "arm") fail("unexpected schema or mode");
  if (config.source !== "src/main/arm_ipc_templates_65.S") fail("unexpected source path");
  if (config.sourceSha256 !== expectedHash) fail("manifest sourceSha256 is not the pinned batch-65 hash");
  same(config.functions.map(({ name }) => name), expectedNames, "function order");
  same(config.functions.map(({ size }) => size), expectedSizes, "function sizes");
  if (config.totalBodySize !== 1060 || expectedSizes.reduce((a, b) => a + b, 0) !== 1060)
    fail("totalBodySize must be 1060");
  if (config.cumulativePoolSlots !== 709 || config.cumulativePoolClasses !== 372)
    fail("cumulative pool accounting must be 709 slots / 372 classes");
  const literals = config.functions.flatMap(f => f.literals.map(x => x.symbol));
  if (literals.length !== 9) fail("expected exactly nine literal slots");
  same(config.literalIdentities, [
    "service_zero_scalar_51", "ipc_unit_scalar_54", "ipc_step_scalar_a_65",
    "ipc_step_scalar_b_65", "ipc_gain_scalar_65", "ipc_callback_table_65",
    "ipc_allocator_owner_65",
  ], "literal identity order");
  same(config.reusedLiteralIdentities, ["service_zero_scalar_51", "ipc_unit_scalar_54"], "reused literals");
  same(config.newLiteralIdentities, [
    "ipc_step_scalar_a_65", "ipc_step_scalar_b_65", "ipc_gain_scalar_65",
    "ipc_callback_table_65", "ipc_allocator_owner_65",
  ], "new literals");
  const counts = Object.fromEntries(config.literalIdentities.map(s => [s, literals.filter(x => x === s).length]));
  same(counts, {
    service_zero_scalar_51: 3, ipc_unit_scalar_54: 1, ipc_step_scalar_a_65: 1,
    ipc_step_scalar_b_65: 1, ipc_gain_scalar_65: 1, ipc_callback_table_65: 1,
    ipc_allocator_owner_65: 1,
  }, "literal slot classes");
  const branches = config.functions.flatMap(f => f.branches);
  if (branches.length !== 13) fail("expected exactly 13 symbolic branch sites");
  const branchCounts = new Map();
  for (const b of branches) branchCounts.set(b.symbol, (branchCounts.get(b.symbol) || 0) + 1);
  if (branchCounts.size !== 12 || branchCounts.get("func_0017EA90") !== 2 ||
      [...branchCounts].some(([s, n]) => s !== "func_0017EA90" && n !== 1))
    fail("branch identity classes do not satisfy the 13-site / 12-class contract");
  const contract = config.branchIdentityContract;
  if (contract.mode !== "arm" || contract.minimumAlignment !== 4 || !contract.classesPairwiseDistinct)
    fail("invalid branch identity contract");
  same(contract.primaryEntries, [
    "func_0017541C", "func_0018773C", "func_00187790", "func_00187838",
    "func_00187DA0", "func_00187DB0", "func_00188228", "func_001882A4",
    "func_001882F8", "func_0017EA3C", "func_0017EA90",
  ], "primary branch entries");
  same(contract.secondaryEntries, ["service_link_secondary_64"], "secondary branch entries");
}

function sourceCheck() {
  const sourcePath = join(root, config.source);
  const bytes = readFileSync(sourcePath);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== expectedHash || digest !== config.sourceSha256)
    fail(`source hash mismatch: expected ${expectedHash}, got ${digest}`);
  return sourcePath;
}

function sections(object) {
  const out = run(readelf, ["-SW", object]);
  const found = [];
  for (const line of out.split(/\r?\n/)) {
    const m = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+[0-9a-fA-F]+\s+[0-9a-fA-F]+\s+([0-9a-fA-F]+)/);
    if (m) found.push({ index: Number(m[1]), name: m[2], type: m[3], size: parseInt(m[4], 16) });
  }
  return found;
}

function sectionHex(object, section) {
  const out = run(readelf, ["-x", section, object]);
  const chunks = [];
  for (const line of out.split(/\r?\n/)) {
    const m = line.match(/^\s*0x[0-9a-fA-F]+\s+((?:[0-9a-fA-F]{8}\s*){1,4})/);
    if (m) chunks.push(m[1].replace(/\s/g, "").toLowerCase());
  }
  return chunks.join("");
}

function relocations(object) {
  const out = run(readelf, ["-rW", object]);
  const byOwner = new Map(expectedNames.map(n => [n, []]));
  let owner = null;
  for (const line of out.split(/\r?\n/)) {
    const h = line.match(/^Relocation section '\.rel(?:a)?\.text\.(func_[0-9A-F]+)'/);
    if (h) { owner = byOwner.has(h[1]) ? h[1] : null; continue; }
    if (!owner) continue;
    const m = line.match(/^([0-9a-fA-F]{8,16})\s+[0-9a-fA-F]+\s+(R_ARM_\S+)\s+[0-9a-fA-F]+\s+(\S+)/);
    if (m) byOwner.get(owner).push({ offset: parseInt(m[1], 16), kind: m[2], symbol: m[3].split(/[+-]/)[0] });
  }
  return byOwner;
}

function validateObject(object, reference) {
  const header = run(readelf, ["-hW", object]);
  if (!/Type:\s+REL \(Relocatable file\)/.test(header) || !/Machine:\s+ARM/.test(header))
    fail(`${object} is not a relocatable ARM ELF object`);
  const allSections = sections(object);
  const owned = allSections.filter(s => expectedNames.includes(s.name.replace(/^\.text\./, "")));
  same(owned.map(s => s.name), expectedNames.map(n => `.text.${n}`), `${object} owned-section order`);
  for (const s of owned) {
    const name = s.name.slice(6);
    if (s.type !== "PROGBITS" || s.size !== ownedSectionSizes.get(name))
      fail(`${object} ${s.name} must be executable schedule plus its adjacent literals (${ownedSectionSizes.get(name)} bytes)`);
    const actualHex = sectionHex(object, s.name);
    const referenceHex = sectionHex(reference, s.name);
    if (actualHex !== referenceHex) fail(`${object} ${s.name} differs from the exact normative schedule`);
  }
  const syms = run(readelf, ["-sW", object]);
  for (let i = 0; i < expectedNames.length; i++) {
    const escaped = expectedNames[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rows = syms.split(/\r?\n/).filter(l => new RegExp(`\\bFUNC\\s+GLOBAL\\s+DEFAULT\\s+\\d+\\s+${escaped}$`).test(l));
    if (rows.length !== 1) fail(`${object} must define exactly one global function ${expectedNames[i]}`);
    const m = rows[0].match(/^\s*\d+:\s+([0-9a-fA-F]+)\s+(\d+)\s+/);
    if (!m || parseInt(m[1], 16) !== 0 || Number(m[2]) !== expectedSizes[i])
      fail(`${object} has wrong value/size for ${expectedNames[i]}`);
  }
  const actualRelocs = relocations(object);
  for (const fn of config.functions) {
    const expected = [
      ...fn.branches.map(({ offset, kind, symbol }) => ({ offset, kind, symbol })),
      ...fn.literals.map(({ offset, symbol }) => ({ offset, kind: "R_ARM_ABS32", symbol })),
    ].sort((a, b) => a.offset - b.offset);
    same(actualRelocs.get(fn.name), expected, `${object} relocations for ${fn.name}`);
  }
}

try {
  validateManifest();
  const source = sourceCheck();
  const work = mkdtempSync(join(tmpdir(), "arm-ipc-65-"));
  const reference = join(work, "batch65.o");
  run(as, ["-o", reference, source]);
  validateObject(reference, reference);

  // Exercise the same owned-section checks against a relocatable combined object.
  const foreignObject = join(work, "foreign.o");
  const combined = join(work, "combined.o");
  run(as, ["-o", foreignObject, "-"], `.syntax unified
.arch armv6k
.arm
.section .text.arm_ipc_65_validator_foreign,"ax",%progbits
.global arm_ipc_65_validator_foreign
.type arm_ipc_65_validator_foreign,%function
arm_ipc_65_validator_foreign:
bx lr
.size arm_ipc_65_validator_foreign,.-arm_ipc_65_validator_foreign
`);
  run(ld, ["-r", "-o", combined, foreignObject, reference]);
  validateObject(combined, reference);

  const supplied = process.argv.slice(2).filter(x => x !== "--object");
  if (supplied.length > 1) fail("usage: validate-arm-ipc-templates-65.mjs [object]");
  if (supplied.length === 1) validateObject(resolve(supplied[0]), reference);
  console.log(`arm-ipc-templates-65: OK (${supplied.length ? "standalone, combined fixture, and supplied object" : "standalone and combined fixture"}; 1060 body bytes; 709 slots / 372 classes)`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
