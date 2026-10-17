#!/usr/bin/env node

// Unit-specific quarantine checks only. Repository-wide publication integrity,
// stable input traversal, inventory binding, and aggregate derivation belong to
// validate-publication-integrity.mjs.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstatSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readStable, validatePublicationTree } from "./validate-publication-integrity.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UNIT = "cro/DllHologramMail";
const STEM = "DllHologramMail";
const BLOCKER = "docs/specs/cro/DllHologramMail_blocker.md";
const BLOCKER_SHA256 = "a31ef886d379ee59a9fc4aa40b74da3c06fa88711135ac46a1e4bbfe06e20940";
const VALIDATE_COMMAND =
  "node --check scripts/validate-cro-dll-hologram-mail.mjs && node scripts/validate-cro-dll-hologram-mail.mjs --self-test";
const CENTRAL_CHECK = "node scripts/validate-publication-integrity.mjs --self-test";
const UNIT_CHECK = "npm run validate:cro-dll-hologram-mail";

function check(condition, message) {
  if (!condition) throw new Error(`DllHologramMail quarantine: ${message}`);
}

function same(left, right, message) {
  try { assert.deepStrictEqual(left, right); } catch { throw new Error(`DllHologramMail quarantine: ${message}`); }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function validateUnitState(state) {
  check(sha256(state.blocker) === BLOCKER_SHA256, "reviewed provenance blocker changed");
  const blockerText = Buffer.from(state.blocker).toString("utf8");
  check(/No behavioral contract\s+is approved\./u.test(blockerText)
    && blockerText.includes("separate implementation role"), "blocker no longer records the clean-room stop condition");
  check(!state.config.units.some(unit => unit.name === STEM), "CRO config still claims the quarantined unit");
  check(!state.config.units.some(unit => unit.sources?.some(source =>
    typeof source.path === "string" && source.path.includes(STEM))), "a CRO source still aliases the quarantined unit");
  check(state.sourceEntries.every(name => name !== STEM && !name.startsWith(`${STEM}.`)
    && !name.startsWith(`${STEM}_`)), "a quarantined source file or directory exists");

  const units = state.report.units.filter(unit => unit.name === UNIT);
  check(units.length === 1, "report must contain exactly one neutral unit");
  const unit = units[0];
  same(unit.metadata, { complete: false }, "unit metadata grants ownership or completion");
  check(Number(unit.measures.matched_functions ?? 0) === 0
    && Number(unit.measures.matched_code ?? 0) === 0
    && Number(unit.measures.matched_data ?? 0) === 0, "unit retains match credit");
  check((unit.functions ?? []).every(fn => Number(fn.fuzzy_match_percent ?? 0) === 0),
    "a unit function retains fuzzy or exact credit");
  check((unit.sections ?? []).every(section => section.name !== ".text"
    || Number(section.fuzzy_match_percent ?? 0) === 0), "the text section retains credit");

  check(state.package.scripts?.["validate:cro-dll-hologram-mail"] === VALIDATE_COMMAND,
    "focused validator command is not exact");
  const chain = state.package.scripts?.check?.split(" && ").map(command => command.trim()) ?? [];
  const central = chain.indexOf(CENTRAL_CHECK), focused = chain.indexOf(UNIT_CHECK);
  check(central >= 0 && focused === central + 1, "npm check does not run the focused gate immediately after the central gate");
}

function json(path) {
  return JSON.parse(readStable(ROOT, path).toString("utf8"));
}

function readState(report) {
  const croRoot = join(ROOT, "src/cro");
  const sourceEntries = readdirSync(croRoot, { withFileTypes: true }).map(entry => entry.name);
  for (const name of sourceEntries.filter(name => name === STEM || name.startsWith(`${STEM}.`)
    || name.startsWith(`${STEM}_`))) {
    const stat = lstatSync(join(croRoot, name));
    check(!stat.isSymbolicLink(), "quarantined source alias is a symlink");
  }
  return {
    report,
    config: json("config/cro-sources.json"),
    package: json("package.json"),
    blocker: readStable(ROOT, BLOCKER),
    sourceEntries,
  };
}

function selfTest(state) {
  let accepted = 0, rejected = 0;
  const accept = (label, mutate = () => {}) => {
    const candidate = structuredClone(state); mutate(candidate);
    assert.doesNotThrow(() => validateUnitState(candidate), label); accepted++;
  };
  const reject = (label, mutate, pattern) => {
    const candidate = structuredClone(state); mutate(candidate);
    assert.throws(() => validateUnitState(candidate), pattern, label); rejected++;
  };
  const target = candidate => candidate.report.units.find(unit => unit.name === UNIT);

  accept("canonical quarantined publication");
  accept("unrelated report progress", candidate => {
    const other = candidate.report.units.find(unit => unit.name !== UNIT && unit.functions?.length);
    other.functions[0].fuzzy_match_percent = 100;
  });
  reject("restored ownership", candidate => candidate.config.units.push({
    name: STEM, sources: [{ path: `src/cro/${STEM}.c`, mode: "arm" }], functions: [],
  }), /claims/);
  reject("aliased ownership", candidate => {
    candidate.config.units[0].sources[0].path = `src/cro/${STEM}_replacement.c`;
  }, /aliases/);
  for (const name of [STEM, `${STEM}.c`, `${STEM}_replacement.c`])
    reject(`source entry ${name}`, candidate => candidate.sourceEntries.push(name), /source file/);
  reject("missing blocker", candidate => { candidate.blocker = Buffer.from(""); }, /blocker/);
  reject("rewritten blocker", candidate => {
    candidate.blocker = Buffer.concat([Buffer.from(candidate.blocker), Buffer.from("\n")]);
  },
    /blocker/);
  reject("ownership metadata", candidate => { target(candidate).metadata.source_path = `src/cro/${STEM}`; },
    /metadata/);
  reject("completion metadata", candidate => { target(candidate).metadata.complete = true; }, /metadata/);
  reject("function count credit", candidate => { target(candidate).measures.matched_functions = 1; }, /credit/);
  reject("code credit", candidate => { target(candidate).measures.matched_code = "8"; }, /credit/);
  reject("data credit", candidate => { target(candidate).measures.matched_data = "1"; }, /credit/);
  reject("function score", candidate => { target(candidate).functions[0].fuzzy_match_percent = 1; }, /credit/);
  reject("text score", candidate => {
    target(candidate).sections.find(section => section.name === ".text").fuzzy_match_percent = 1;
  }, /credit/);
  reject("duplicate unit", candidate => candidate.report.units.push(structuredClone(target(candidate))), /exactly one/);
  reject("missing unit", candidate => {
    candidate.report.units = candidate.report.units.filter(unit => unit.name !== UNIT);
  }, /exactly one/);
  reject("removed focused command", candidate => { delete candidate.package.scripts["validate:cro-dll-hologram-mail"]; },
    /command/);
  reject("bypassed check chain", candidate => {
    candidate.package.scripts.check = candidate.package.scripts.check.replace(UNIT_CHECK, "true");
  }, /npm check/);
  reject("focused gate before central gate", candidate => {
    const commands = candidate.package.scripts.check.split(" && ");
    const central = commands.indexOf(CENTRAL_CHECK), focused = commands.indexOf(UNIT_CHECK);
    [commands[central], commands[focused]] = [commands[focused], commands[central]];
    candidate.package.scripts.check = commands.join(" && ");
  }, /npm check/);
  console.log(`Passed ${accepted + rejected} focused quarantine tests (${accepted} acceptance, ${rejected} rejection).`);
}

try {
  const args = process.argv.slice(2);
  check(args.length === 0 || (args.length === 1 && args[0] === "--self-test"),
    "usage: validate-cro-dll-hologram-mail.mjs [--self-test]");
  const publication = validatePublicationTree();
  const state = readState(publication.report);
  validateUnitState(state);
  if (args[0] === "--self-test") selfTest(state);
  console.log("Validated the unit-specific DllHologramMail provenance quarantine.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
