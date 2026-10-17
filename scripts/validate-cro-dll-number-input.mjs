#!/usr/bin/env node

// Preserve public records at 22a89bceec7ba65539d88e098c69934cc1a59525.
// This is neither a target comparison nor evidence for the existing source claim.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  closeSync, constants, fstatSync, linkSync, lstatSync, mkdirSync, mkdtempSync, openSync,
  readlinkSync, readSync, renameSync, rmSync, symlinkSync, truncateSync, utimesSync, writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const UNIT = "cro/DllNumberInput";
const MAX_BYTES = 16 * 1024 * 1024;
const FILES = Object.freeze({
  blocker: "docs/specs/cro/DllNumberInput_blocker.md",
  config: "config/cro-sources.json",
  inventory: "symbols/cro/DllNumberInput.csv",
  partition: "symbols/cro-partitions/DllNumberInput.json",
  manifest: "progress/units/AS_EUR_REV2.cro.json",
  report: "progress/reports/AS_EUR_REV2/report.json",
});
const DIGESTS = Object.freeze({
  blocker: "3cc76e411ccbc2cff94978a06b555f83dc9439e8404c4b8c2223642ff0d77a74",
  inventory: "bd961e9ddd7b7d1a19c0048c5b84e58b30d240da5cb23ccfd736e3a52d2a063d",
  partition: "d5f2568d552f9d0a9e4430564c72cc5b1d5aae934386c7f58170bccb983e90da",
  // Canonical public config entry only; do not interpret or expand its claim.
  claim: "4b9c555a6f6936e946896edc3a17a42aef5eb4336a055940dc255e1ad9bbda8f",
});
const FUNCTIONS = [
  ["func_00000258", "708", "3320"],
  ["func_0000086C", "344", "4028"],
  ["func_00000AC4", "744", "4372"],
  ["func_00000DB0", "72", "5116"],
  ["func_0000111C", "144", "5188"],
  ["func_000011B0", "156", "5332"],
  ["func_00001358", "396", "5488"],
  ["func_000015F4", "204", "5884"],
  ["func_00001968", "20", "6088"],
];
const MATCHED = "func_00001968";
const EXPECTED_REPORT_UNIT = {
  name: UNIT,
  measures: {
    fuzzy_match_percent: 0.71736014,
    total_code: "2788", matched_code: "20", matched_code_percent: 0.7173601,
    total_data: "2016", total_functions: 9, matched_functions: 1,
    matched_functions_percent: 11.111112, total_units: 1,
  },
  sections: [[".bss", "16"], [".data", "4"], [".pool", "536"],
    [".rodata", "1460"], [".text", "6108"]]
    .map(([name, size]) => ({ name, size, metadata: {} })),
  functions: FUNCTIONS.map(([name, size, address]) => ({
    name, size, address, metadata: {}, ...(name === MATCHED ? { fuzzy_match_percent: 100 } : {}),
  })),
  metadata: { complete: false, source_path: "src/cro/DllNumberInput" },
};

function check(condition, label) {
  if (!condition) throw new Error(label);
}

function same(actual, expected, label) {
  // Never expose input values, assertion diffs, system errors, or supplied paths.
  try { assert.deepStrictEqual(actual, expected); } catch { throw new Error(label); }
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object")
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function contained(root, path) {
  const suffix = relative(root, path);
  return suffix !== "" && !isAbsolute(suffix) && suffix !== ".." && !suffix.startsWith(`..${sep}`);
}

const INPUT_IO = Object.freeze({ openSync, closeSync, fstatSync, lstatSync, readlinkSync, readSync });
const STAT_OPTIONS = Object.freeze({ bigint: true });

function snapshot(stat) {
  // atime changes on reads. All other identity, ownership, type, allocation,
  // length and nanosecond time fields must stay unchanged, including on dirs.
  return ["dev", "ino", "mode", "nlink", "uid", "gid", "rdev", "size", "blksize",
    "blocks", "mtimeNs", "ctimeNs", "birthtimeNs"].map(key => stat[key]);
}

function unchanged(before, after) {
  same(snapshot(after), snapshot(before), "changed public input");
}

function pathParts(input) {
  check(typeof input === "string" && input.length > 0 && !isAbsolute(input)
    && !input.includes("\0") && !input.includes("\\"), "invalid path");
  const parts = input.split("/");
  check(parts.every(part => part !== "" && part !== "." && part !== ".."), "path escape");
  return parts;
}

function withPinnedParent(root, input, action, io = INPUT_IO) {
  const directories = [];
  try {
    // Node has no openat API. Linux procfs provides the kernel-owned fd anchor:
    // every lookup below it contains ONE component, opened with O_NOFOLLOW.
    // Never reopen an input through its absolute, attacker-mutable ancestors.
    // Other platforms / missing procfs are deliberately unsupported, fail closed.
    // Canonical fd names and full ancestor snapshots reject even move/restore
    // races. This relies on a trusted Linux kernel/procfs and filesystem stat
    // semantics; it is not a transaction against a privileged mount attacker.
    // Unrelated ancestor mutations may conservatively reject a validation run.
    check(process.platform === "linux" && constants.O_NOFOLLOW && constants.O_DIRECTORY,
      "safe traversal unavailable");
    check(isAbsolute(root) && resolve(root) === root, "invalid root");
    const parts = pathParts(input);
    function pin(path, canonicalPath) {
      const before = io.lstatSync(path, STAT_OPTIONS);
      check(before.isDirectory(), "non-directory or symlink parent");
      const fd = io.openSync(path, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
      directories.push({ fd, path, canonicalPath, before });
      unchanged(before, io.fstatSync(fd, STAT_OPTIONS));
      check(io.readlinkSync(`/proc/self/fd/${fd}`) === canonicalPath, "noncanonical parent");
      return fd;
    }
    let canonicalPath = "/";
    let parent = pin("/", canonicalPath);
    for (const part of [...root.split("/").filter(Boolean), ...parts.slice(0, -1)]) {
      canonicalPath = join(canonicalPath, part);
      parent = pin(`/proc/self/fd/${parent}/${part}`, canonicalPath);
    }
    const verify = () => {
      for (const directory of directories) {
        unchanged(directory.before, io.fstatSync(directory.fd, STAT_OPTIONS));
        unchanged(directory.before, io.lstatSync(directory.path, STAT_OPTIONS));
        check(io.readlinkSync(`/proc/self/fd/${directory.fd}`) === directory.canonicalPath,
          "moved public parent");
      }
    };
    verify();
    const result = action(`/proc/self/fd/${parent}/${parts.at(-1)}`, verify);
    verify();
    return result;
  } catch {
    throw new Error("public input rejected (path, file type, size, encoding, or stability)");
  } finally {
    for (const { fd } of directories.reverse()) io.closeSync(fd);
  }
}

function readText(root, input, io = INPUT_IO) {
  return withPinnedParent(root, input, (path, verify) => {
    let fd;
    try {
      const before = io.lstatSync(path, STAT_OPTIONS);
      check(before.isFile() && before.nlink === 1n && before.size > 0n
        && before.size <= BigInt(MAX_BYTES), "invalid input file");
      fd = io.openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
      const opened = io.fstatSync(fd, STAT_OPTIONS);
      unchanged(before, opened);
      verify();
      check(io.readlinkSync(`/proc/self/fd/${fd}`) === join(root, input), "moved public input");
      // Bound the actual read as well as the initial stat, including concurrent growth.
      const bytes = Buffer.alloc(Number(opened.size) + 1);
      let length = 0;
      while (length < bytes.length) {
        const count = io.readSync(fd, bytes, length, bytes.length - length, null);
        if (count === 0) break;
        length += count;
      }
      unchanged(opened, io.fstatSync(fd, STAT_OPTIONS));
      unchanged(opened, io.lstatSync(path, STAT_OPTIONS));
      verify();
      // Close the former fstat/lstat gap as well as changes during ancestor checks.
      unchanged(opened, io.fstatSync(fd, STAT_OPTIONS));
      check(length === Number(opened.size), "changed input length");
      return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes.subarray(0, length));
    } finally {
      if (fd !== undefined) io.closeSync(fd);
    }
  }, io);
}

function rejectDuplicateKeys(text) {
  // Scan JSON string tokens before parsing the document. Decode each key so
  // escaped spellings share one identity. Syntax errors still fail JSON.parse.
  const stack = [];
  for (let index = 0; index < text.length;) {
    const character = text[index];
    if (character === "{" || character === "[") {
      stack.push(character === "{" ? new Set() : null);
      check(stack.length <= 256, "JSON nesting limit");
      index++;
    } else if (character === "}" || character === "]") {
      stack.pop(); index++;
    } else if (character === '"') {
      const start = index++;
      let closed = false;
      while (index < text.length) {
        const next = text[index++];
        if (next === "\\") index++;
        else if (next === '"') { closed = true; break; }
      }
      check(closed, "invalid JSON string");
      let next = index;
      while (/[\t\n\r ]/u.test(text[next] ?? "")) next++;
      if (text[next] !== ":") continue;
      const key = JSON.parse(text.slice(start, index));
      const keys = stack.at(-1);
      check(keys instanceof Set && !keys.has(key), "duplicate JSON key");
      keys.add(key);
    } else index++;
  }
}

function parseJson(text) {
  try {
    rejectDuplicateKeys(text);
    return JSON.parse(text);
  } catch { throw new Error("public JSON rejected (syntax, duplicate key, or nesting)"); }
}

function exactKeys(value, keys, label) {
  check(value !== null && typeof value === "object" && !Array.isArray(value), label);
  same(Object.keys(value).sort(), keys.slice().sort(), label);
}

function onlyUnit(document, name, label) {
  check(Array.isArray(document.units), label);
  const units = document.units.filter(unit => unit?.name === name);
  check(units.length === 1, label);
  return units[0];
}

function checkSourceOwnership(root, config, claim) {
  for (const entry of config.units) {
    if (entry === claim) continue;
    check(Array.isArray(entry?.sources), "invalid public source paths");
    for (const source of entry.sources) {
      pathParts(source?.path);
      const path = resolve(root, source.path);
      const unitPath = join(root, "src/cro/DllNumberInput");
      check(path !== unitPath && !contained(unitPath, path), "public source ownership changed");
      // Reject aliases conservatively. Inspect only directory/file metadata;
      // never open or read source contents (including the preserved unit claim).
      withPinnedParent(root, source.path, (leaf, verify) => {
        const before = lstatSync(leaf, STAT_OPTIONS);
        check(before.isFile() && before.nlink === 1n, "source alias or invalid source path");
        verify();
        unchanged(before, lstatSync(leaf, STAT_OPTIONS));
      });
    }
  }
}

function checkReportEnvelope(report) {
  exactKeys(report, ["version", "measures", "units"], "report schema changed");
  check(report.version === 2 && Array.isArray(report.units), "report version or units changed");
  exactKeys(report.measures, Object.keys(EXPECTED_REPORT_UNIT.measures), "report measures schema changed");
  for (const [key, example] of Object.entries(EXPECTED_REPORT_UNIT.measures)) {
    const value = report.measures[key];
    check(typeof example === "string" ? typeof value === "string" && /^(0|[1-9][0-9]*)$/u.test(value)
      : typeof value === "number" && Number.isFinite(value) && value >= 0
        && (key.endsWith("percent") ? value <= 100 : Number.isSafeInteger(value)),
    "report measures type changed");
  }
}

function validate(root = ROOT) {
  const texts = Object.fromEntries(Object.entries(FILES).map(([key, path]) => [key, readText(root, path)]));
  for (const key of ["blocker", "inventory", "partition"])
    check(sha256(texts[key]) === DIGESTS[key], `${key} baseline content changed`);

  const config = parseJson(texts.config);
  exactKeys(config, ["schemaVersion", "units"], "source config schema changed");
  check(config.schemaVersion === 1, "source config version changed");
  const claim = onlyUnit(config, "DllNumberInput", "source claim identity changed");
  check(sha256(canonical(claim)) === DIGESTS.claim, "public source ownership or claim changed");
  checkSourceOwnership(root, config, claim);

  // Exact partition digest preserves every published boundary, not just totals.
  const partition = parseJson(texts.partition);
  check(partition.format === 1 && partition.module === "DllNumberInput" && partition.textSize === 6744,
    "partition identity changed");
  for (const [key, count, size] of [["functions", 9, 2788], ["gaps", 91, 3320],
    ["pools", 99, 536], ["unknown", 4, 100]]) {
    check(Array.isArray(partition[key]) && partition[key].length === count
      && partition[key].reduce((sum, entry) => sum + entry.size, 0) === size, "partition accounting changed");
  }

  const manifest = parseJson(texts.manifest);
  exactKeys(manifest, ["schemaVersion", "target", "unitCount", "units"], "manifest schema changed");
  check(manifest.schemaVersion === 1 && manifest.target === "AS_EUR_REV2"
    && manifest.unitCount === 145 && manifest.units?.length === 145, "manifest public identity changed");
  same(onlyUnit(manifest, UNIT, "manifest unit identity changed"), {
    name: UNIT, size: 16384,
    sha256: "bdb609c76b5589a33dacb3c94a39b0c8356c54445c757b733ce0fd94bdabc692",
  }, "manifest unit identity changed");

  const report = parseJson(texts.report);
  checkReportEnvelope(report);
  // Ignore other units' results. Lock all fields for this unit, including the
  // exact existing matched function set, accounting, and complete=false.
  same(onlyUnit(report, UNIT, "report unit identity changed"), EXPECTED_REPORT_UNIT,
    "published report baseline changed (schema, identity, accounting, or credit)");
  return texts;
}

function selfTest(originals) {
  // All fixtures, including the simulated outside-root input, stay inside the
  // assigned worktree. Remove only the unique directory created by this run.
  const temporary = mkdtempSync(join(ROOT, ".dll-number-input-test-"));
  const fixture = join(temporary, "repo");
  let negativeTests = 0;
  function rejected(action) {
    assert.throws(action, error => error instanceof Error && !error.message.includes(temporary)
      && !error.message.includes(ROOT));
    negativeTests++;
  }
  function replace(key, content, action = () => validate(fixture)) {
    const path = join(fixture, FILES[key]);
    try { writeFileSync(path, content); rejected(action); }
    finally { writeFileSync(path, originals[key]); }
  }
  function mutate(key, update) {
    const value = JSON.parse(originals[key]);
    update(value);
    replace(key, JSON.stringify(value));
  }
  function acceptedMutation(key, update) {
    const path = join(fixture, FILES[key]);
    const value = JSON.parse(originals[key]);
    update(value);
    try { writeFileSync(path, JSON.stringify(value)); validate(fixture); }
    finally { writeFileSync(path, originals[key]); }
  }
  try {
    for (const [key, path] of Object.entries(FILES)) {
      mkdirSync(dirname(join(fixture, path)), { recursive: true });
      writeFileSync(join(fixture, path), originals[key]);
    }
    // Synthetic unrelated source files support metadata-only ownership checks.
    // Do not copy, open, or read any repository source file.
    for (const unit of JSON.parse(originals.config).units) {
      if (unit.name === "DllNumberInput") continue;
      for (const source of unit.sources) {
        const path = join(fixture, source.path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, "synthetic unrelated source fixture\n");
      }
    }
    validate(fixture);
    same(parseJson('{"a":{"x":1},"b":{"x":2},"text":"\\\"key\\\":{}"}'),
      { a: { x: 1 }, b: { x: 2 }, text: '"key":{}' }, "JSON positive self-test");
    const outside = join(temporary, "outside.json");
    writeFileSync(outside, "{}");
    rejected(() => readText(fixture, outside));
    rejected(() => readText(fixture, "../outside.json"));
    rejected(() => readText(fixture, "missing.json"));
    rejected(() => readText(fixture, "config"));
    rejected(() => readText(fixture, "config/../config/cro-sources.json"));

    const copy = join(fixture, "copy");
    for (const [key, path] of Object.entries(FILES)) {
      const leaf = join(fixture, path);
      // A followed link would otherwise pass the complete baseline check.
      writeFileSync(copy, originals[key]);
      rmSync(leaf);
      try { symlinkSync(copy, leaf); rejected(() => validate(fixture)); }
      finally { rmSync(leaf); writeFileSync(leaf, originals[key]); }
      replace(key, "");
      replace(key, Buffer.from([0xff]));
      replace(key, "{}", () => {
        truncateSync(leaf, MAX_BYTES + 1);
        validate(fixture);
      });
    }
    symlinkSync(join(fixture, "config"), join(fixture, "linked-parent"), "dir");
    rejected(() => readText(fixture, "linked-parent/cro-sources.json"));
    symlinkSync(fixture, join(temporary, "linked-root"), "dir");
    rejected(() => readText(join(temporary, "linked-root"), FILES.config));

    // Deterministic reproductions at the exact I/O boundaries: no scheduling
    // luck, target input, external preload, or production-only test switches.
    const raceParent = join(fixture, "race-parent");
    const raceLeaf = join(raceParent, "input.json");
    const raceInput = "race-parent/input.json";
    const movedParent = join(temporary, "moved-parent");
    mkdirSync(raceParent);
    const resetRace = () => writeFileSync(raceLeaf, '{"safe":true}');
    resetRace();
    same(readText(fixture, raceInput), '{"safe":true}', "stable read positive");
    for (const boundary of ["parent-open", "leaf-open", "read"]) {
      let injected = false;
      let reads = 0;
      const swap = action => {
        injected = true;
        renameSync(raceParent, movedParent);
        try {
          symlinkSync(movedParent, raceParent, "dir");
          return action();
        } finally {
          rmSync(raceParent);
          renameSync(movedParent, raceParent);
        }
      };
      const io = {
        ...INPUT_IO,
        openSync(path, flags) {
          const suffix = boundary === "parent-open" ? "/race-parent" : "/input.json";
          if (!injected && boundary !== "read" && path.endsWith(suffix))
            return swap(() => openSync(path, flags));
          return openSync(path, flags);
        },
        readSync(...args) {
          reads++;
          if (!injected && boundary === "read") return swap(() => readSync(...args));
          return readSync(...args);
        },
      };
      rejected(() => readText(fixture, raceInput, io));
      check(injected, "parent race regression did not execute");
      if (boundary !== "read") same(reads, 0, "parent race read before rejection");
    }
    console.log("Review reproduction passed: parent symlink swaps at directory open, leaf open, and read rejected.");

    for (const boundary of ["before-open", "during-read", "final-lstat", "after-final-lstat"]) {
      resetRace();
      let injected = false;
      let leafStats = 0;
      const rewrite = () => {
        injected = true;
        // Same inode and length; force a different timestamp even on a fast FS.
        writeFileSync(raceLeaf, '{"safe":null}');
        utimesSync(raceLeaf, 1, 1);
      };
      const io = {
        ...INPUT_IO,
        openSync(path, flags) {
          if (boundary === "before-open" && path.endsWith("/input.json")) rewrite();
          return openSync(path, flags);
        },
        readSync(...args) {
          if (!injected && boundary === "during-read") rewrite();
          return readSync(...args);
        },
        lstatSync(path, options) {
          if (path.endsWith("/input.json")) {
            leafStats++;
            if (leafStats === 2 && boundary === "final-lstat") rewrite();
          }
          const stat = lstatSync(path, options);
          if (leafStats === 2 && path.endsWith("/input.json") && boundary === "after-final-lstat") rewrite();
          return stat;
        },
      };
      rejected(() => readText(fixture, raceInput, io));
      check(injected, "file stability regression did not execute");
    }
    // Inject sub-millisecond changes that the old mtimeMs/ctimeMs guards miss,
    // and isolated size changes, at each of the four file comparison stages.
    for (const boundary of ["opened", "after-read", "final-lstat", "final-fstat"]) {
      for (const field of ["size", "mtimeNs", "ctimeNs"]) {
        let leafFd;
        let fdStats = 0;
        let leafStats = 0;
        let injected = false;
        const changedStat = stat => {
          injected = true;
          return Object.assign(Object.create(Object.getPrototypeOf(stat)), stat, { [field]: stat[field] + 1n });
        };
        const io = {
          ...INPUT_IO,
          openSync(path, flags) {
            const fd = openSync(path, flags);
            if (path.endsWith("/input.json")) leafFd = fd;
            return fd;
          },
          fstatSync(fd, options) {
            const stat = fstatSync(fd, options);
            if (fd === leafFd) {
              fdStats++;
              if ((boundary === "opened" && fdStats === 1)
                || (boundary === "after-read" && fdStats === 2)
                || (boundary === "final-fstat" && fdStats === 3)) return changedStat(stat);
            }
            return stat;
          },
          lstatSync(path, options) {
            const stat = lstatSync(path, options);
            if (path.endsWith("/input.json") && ++leafStats === 2 && boundary === "final-lstat")
              return changedStat(stat);
            return stat;
          },
        };
        rejected(() => readText(fixture, raceInput, io));
        check(injected, "snapshot regression did not execute");
      }
    }
    console.log("Review reproduction passed: same-inode rewrites before open and around final stats rejected.");

    const sourceTarget = join(fixture, "src/cro/DllNumberInput/alias-target.S");
    mkdirSync(dirname(sourceTarget), { recursive: true });
    writeFileSync(sourceTarget, "synthetic alias fixture; never read\n");
    const alias = join(fixture, "source-alias");
    for (const directoryAlias of [false, true]) {
      try {
        symlinkSync(directoryAlias ? dirname(sourceTarget) : sourceTarget, alias,
          directoryAlias ? "dir" : "file");
        mutate("config", value => { value.units.push({ name: "Other", sources: [
          { path: directoryAlias ? "source-alias/alias-target.S" : "source-alias" },
        ] }); });
      } finally { rmSync(alias); }
    }
    try {
      linkSync(sourceTarget, alias);
      mutate("config", value => { value.units.push({ name: "Other", sources: [{ path: "source-alias" }] }); });
      rejected(() => readText(fixture, "source-alias"));
    } finally { rmSync(alias); }
    console.log("Review reproduction passed: source ownership aliases through leaf and parent symlinks rejected without reading sources.");

    for (const key of ["config", "partition", "manifest", "report"]) {
      const value = JSON.parse(originals[key]);
      const firstKey = Object.keys(value)[0];
      const prefix = `${JSON.stringify(firstKey)}:${JSON.stringify(value[firstKey])},`;
      // Keep all parsed baseline values valid so duplicate rejection is required.
      replace(key, `{${prefix}${originals[key].trimStart().slice(1)}`);
      const escapedKey = `"\\u${firstKey.charCodeAt(0).toString(16).padStart(4, "0")}${firstKey.slice(1)}"`;
      replace(key, `{${escapedKey}:${JSON.stringify(value[firstKey])},${originals[key].trimStart().slice(1)}`);
      replace(key, '{"duplicate":1,"duplicate":2}');
      replace(key, '{"duplicate":1,"\\u0064uplicate":2}');
      replace(key, '{"nested":[{"x":1,"\\u0078":2}]}');
      replace(key, '{"unterminated":');
      // Test the duplicate detector independently of identity/digest guards.
      rejected(() => parseJson('{"a":1,"a":2}'));
      rejected(() => parseJson('{"a":1,"\\u0061":2}'));
    }
    replace("blocker", `${originals.blocker}\nNew claim.\n`);
    replace("inventory", originals.inventory.replace("func_00000258", "func_00000259"));
    mutate("partition", value => { value.functions[0].size += 4; });
    mutate("config", value => { value.schemaVersion = 2; });
    mutate("config", value => { value.units.push(value.units.find(unit => unit.name === "DllNumberInput")); });
    mutate("config", value => { value.units.find(unit => unit.name === "DllNumberInput").sources[0].mode = "thumb"; });
    mutate("config", value => { value.units.push({ name: "Other", sources: [{ path: "src/cro/DllNumberInput/new.S" }] }); });
    mutate("manifest", value => { value.target = "AS_EUR_REV1"; });
    mutate("manifest", value => { value.units.find(unit => unit.name === UNIT).sha256 = "0".repeat(64); });
    mutate("manifest", value => { value.units.find(unit => unit.name === UNIT).size++; });
    mutate("manifest", value => { value.units.find(unit => unit.name === UNIT).name += "Changed"; });
    const reportMutation = update => mutate("report", value => update(value.units.find(unit => unit.name === UNIT)));
    reportMutation(unit => { unit.metadata.complete = true; });
    reportMutation(unit => { unit.metadata.source_path += "Changed"; });
    reportMutation(unit => { unit.measures.matched_code = "24"; });
    reportMutation(unit => { unit.measures.total_data = "2017"; });
    reportMutation(unit => { unit.functions[0].fuzzy_match_percent = 100; });
    reportMutation(unit => { delete unit.functions.at(-1).fuzzy_match_percent; });
    reportMutation(unit => { unit.functions[0].address = "0"; });
    reportMutation(unit => { unit.functions[0] = unit.functions[1]; });
    reportMutation(unit => { unit.sections[0].size = "17"; });
    reportMutation(unit => { unit.extraCredit = true; });
    mutate("report", value => { value.units.push(value.units.find(unit => unit.name === UNIT)); });
    mutate("report", value => { value.version = 999; });
    mutate("report", value => { delete value.version; delete value.measures; });
    for (const key of ["version", "measures", "units"])
      mutate("report", value => { delete value[key]; });
    mutate("report", value => { value.extra = {}; });
    mutate("report", value => { value.measures = null; });
    mutate("report", value => { delete value.measures.total_code; });
    mutate("report", value => { value.measures.total_code = 123; });
    mutate("report", value => { value.measures.matched_code_percent = "1"; });
    mutate("report", value => { value.measures.total_functions = 1.5; });
    // Unrelated accounting can evolve without granting this unit new credit.
    acceptedMutation("report", value => {
      value.measures.total_code = "4000000";
      value.measures.matched_code = "500000";
      value.measures.total_functions++;
      value.measures.total_units++;
      value.units.push({ name: "cro/Unrelated", measures: { matched_code: "100" } });
    });
    acceptedMutation("config", value => {
      value.units.find(unit => unit.name !== "DllNumberInput").unrelatedMetadata = "allowed";
    });
    console.log("Review reproduction passed: report version=999 and missing root version/measures rejected; unrelated accounting accepted.");
    validate(fixture);
    console.log(`DllNumberInput self-tests passed: positive fixtures and ${negativeTests} negative cases.`);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

try {
  check(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === "--self-test"),
    "usage: validate-cro-dll-number-input.mjs [--self-test]");
  const originals = validate();
  if (process.argv[2] === "--self-test") selfTest(originals);
  console.log("Preserved cro/DllNumberInput published baseline: 1/9 functions, 20/2788 code bytes, complete=false; no fresh comparison or credit.");
} catch {
  console.error("cro/DllNumberInput baseline preservation failed; public input or baseline rejected.");
  process.exitCode = 1;
}
