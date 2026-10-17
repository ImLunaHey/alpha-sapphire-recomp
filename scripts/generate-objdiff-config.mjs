import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const DEFAULT_ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const MAX_OBJECT_SIZE = 64 * 1024 * 1024;
const MAX_SECTIONS = 16_384;
const MAX_SYMBOLS = 1_000_000;
const EXPECTED_CRO_UNITS = 145;
const CRO_OBJECT = /^(Dll[A-Za-z0-9_]+)\.o$/;

function fail(message) {
  throw new Error(`objdiff config: ${message}`);
}

function range(buffer, offset, size, label) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 ||
      offset + size > buffer.length) {
    fail(`${label} is outside the object`);
  }
  return buffer.subarray(offset, offset + size);
}

function cString(buffer, offset, label) {
  if (!Number.isSafeInteger(offset) || offset < 0 || offset >= buffer.length) fail(`${label} has an invalid string offset`);
  const end = buffer.indexOf(0, offset);
  if (end < 0) fail(`${label} is not terminated`);
  return buffer.toString("utf8", offset, end);
}

export function inspectArmObject(path, { requireCode = true, requireFunctions = true } = {}) {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink()) fail(`${path} is not a regular file`);
  if (stat.size < 52 || stat.size > MAX_OBJECT_SIZE) fail(`${path} has an invalid size`);
  const buffer = readFileSync(path);

  if (!buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) ||
      buffer[4] !== 1 || buffer[5] !== 1 || buffer[6] !== 1) {
    fail(`${path} is not ELF32 little-endian version 1`);
  }
  if (buffer.readUInt16LE(16) !== 1 || buffer.readUInt16LE(18) !== 40 || buffer.readUInt32LE(20) !== 1) {
    fail(`${path} is not an ARM ET_REL object`);
  }
  if (buffer.readUInt32LE(28) !== 0 || buffer.readUInt16LE(40) !== 52 || buffer.readUInt16LE(42) !== 0 ||
      buffer.readUInt16LE(44) !== 0 || buffer.readUInt16LE(46) !== 40) {
    fail(`${path} has noncanonical ELF headers`);
  }

  const sectionOffset = buffer.readUInt32LE(32);
  const sectionCount = buffer.readUInt16LE(48);
  const sectionNamesIndex = buffer.readUInt16LE(50);
  if (sectionCount < 2 || sectionCount > MAX_SECTIONS || sectionNamesIndex === 0 || sectionNamesIndex >= sectionCount) {
    fail(`${path} has an invalid section table`);
  }
  range(buffer, sectionOffset, sectionCount * 40, `${path} section table`);
  if (!buffer.subarray(sectionOffset, sectionOffset + 40).equals(Buffer.alloc(40))) {
    fail(`${path} has a noncanonical null section`);
  }

  const sections = [];
  for (let index = 0; index < sectionCount; index++) {
    const cursor = sectionOffset + index * 40;
    const section = {
      index,
      nameOffset: buffer.readUInt32LE(cursor),
      type: buffer.readUInt32LE(cursor + 4),
      flags: buffer.readUInt32LE(cursor + 8),
      offset: buffer.readUInt32LE(cursor + 16),
      size: buffer.readUInt32LE(cursor + 20),
      link: buffer.readUInt32LE(cursor + 24),
      info: buffer.readUInt32LE(cursor + 28),
      alignment: buffer.readUInt32LE(cursor + 32),
      entrySize: buffer.readUInt32LE(cursor + 36),
    };
    if (section.alignment !== 0 && (section.alignment & (section.alignment - 1)) !== 0) {
      fail(`${path} section ${index} has invalid alignment`);
    }
    if (section.type !== 8) range(buffer, section.offset, section.size, `${path} section ${index}`);
    sections.push(section);
  }

  const shstr = sections[sectionNamesIndex];
  if (shstr.type !== 3) fail(`${path} has no section-name string table`);
  const shstrData = range(buffer, shstr.offset, shstr.size, `${path} section names`);
  for (const section of sections) section.name = cString(shstrData, section.nameOffset, `${path} section ${section.index}`);

  const executableSections = sections.filter((section) => (section.type === 1 || (!requireCode && section.type === 8))
    && (section.flags & 0x6) === 0x6);
  const executable = new Set(executableSections.map((section) => section.index));
  if (executable.size === 0) fail(`${path} has no allocated executable section`);
  if (requireCode && !executableSections.some((section) => section.size > 0)) {
    fail(`${path} has no executable code`);
  }

  const functions = new Set();
  const symbolTables = sections.filter((section) => section.type === 2);
  if (symbolTables.length === 0) fail(`${path} has no symbol table`);
  const symbolCounts = new Map();
  for (const table of symbolTables) {
    if (table.entrySize !== 16 || table.size % 16 !== 0 || table.link >= sections.length || sections[table.link].type !== 3) {
      fail(`${path} has a malformed symbol table`);
    }
    const count = table.size / table.entrySize;
    if (count > MAX_SYMBOLS) fail(`${path} has too many symbols`);
    symbolCounts.set(table.index, count);
    const strings = range(buffer, sections[table.link].offset, sections[table.link].size, `${path} symbol strings`);
    for (let index = 1; index < count; index++) {
      const cursor = table.offset + index * 16;
      const nameOffset = buffer.readUInt32LE(cursor);
      const value = buffer.readUInt32LE(cursor + 4);
      const size = buffer.readUInt32LE(cursor + 8);
      const info = buffer[cursor + 12];
      const sectionIndex = buffer.readUInt16LE(cursor + 14);
      if (nameOffset !== 0) cString(strings, nameOffset, `${path} symbol ${index}`);
      if (sectionIndex !== 0 && sectionIndex < 0xff00 && sectionIndex >= sections.length) {
        fail(`${path} symbol ${index} has an invalid section index`);
      }
      if ((info >> 4) === 1 && (info & 0xf) === 2 && executable.has(sectionIndex) && size > 0) {
        const owner = sections[sectionIndex];
        // ARM ELF marks Thumb functions with bit zero in st_value.
        const codeOffset = value & ~1;
        if (codeOffset + size > owner.size) fail(`${path} has a function outside its executable section`);
        const name = cString(strings, nameOffset, `${path} symbol ${index}`);
        if (!name) fail(`${path} has an unnamed global function`);
        functions.add(name);
      }
    }
  }
  for (const table of sections.filter((section) => section.type === 9 || section.type === 4)) {
    const expectedEntrySize = table.type === 9 ? 8 : 12;
    if (table.entrySize !== expectedEntrySize || table.size % expectedEntrySize !== 0 ||
        !symbolCounts.has(table.link) || table.info === 0 || table.info >= sections.length) {
      fail(`${path} has a malformed relocation table`);
    }
    const owner = sections[table.info];
    for (let index = 0; index < table.size / expectedEntrySize; index++) {
      const cursor = table.offset + index * expectedEntrySize;
      const relocationOffset = buffer.readUInt32LE(cursor);
      const symbolIndex = buffer.readUInt32LE(cursor + 4) >>> 8;
      if (relocationOffset >= owner.size || symbolIndex >= symbolCounts.get(table.link)) {
        fail(`${path} relocation ${index} is outside its section or symbol table`);
      }
    }
  }
  if (requireFunctions && functions.size === 0) fail(`${path} has no defined global functions`);
  const hasUnknown = sections.some((section) => section.name.startsWith(".cro.unknown.") && section.size > 0);
  return { buffer, functions, hasUnknown };
}

function ignoredByGit(root, path) {
  const result = spawnSync("git", ["check-ignore", "--quiet", "--", relative(root, path)], { cwd: root });
  return result.status === 0;
}

function containedBy(root, path) {
  const rel = relative(root, path);
  return rel !== "" && rel !== ".." && !rel.startsWith(`..${sep}`);
}

function candidates(directory) {
  if (!existsSync(directory)) return new Map();
  const output = new Map();
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const match = entry.isFile() || entry.isSymbolicLink() ? CRO_OBJECT.exec(entry.name) : null;
    if (match) output.set(match[1], join(directory, entry.name));
  }
  return output;
}

function loadCroAllowlist(root, version) {
  const path = join(root, "progress", "units", `${version}.cro.json`);
  if (!existsSync(path)) fail(`${relative(root, path)} is missing`);
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (manifest?.schemaVersion !== 1 || manifest?.target !== version ||
      manifest?.unitCount !== EXPECTED_CRO_UNITS || !Array.isArray(manifest.units) ||
      manifest.units.length !== EXPECTED_CRO_UNITS) {
    fail(`CRO manifest must contain exactly ${EXPECTED_CRO_UNITS} ${version} units`);
  }
  const names = new Set();
  let previous = "";
  for (const unit of manifest.units) {
    const match = typeof unit?.name === "string" ? /^cro\/(Dll[A-Za-z0-9_]+)$/.exec(unit.name) : null;
    if (!match || !Number.isSafeInteger(unit.size) || unit.size <= 0 ||
        typeof unit.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(unit.sha256)) {
      fail("CRO manifest contains an invalid unit");
    }
    if (unit.name <= previous) fail("CRO manifest units are duplicated or not sorted");
    previous = unit.name;
    names.add(match[1]);
  }
  return names;
}

export function generateObjdiffConfig({ root = DEFAULT_ROOT, version, requireIgnored = true, warn = () => {} } = {}) {
  root = realpathSync(root);
  if (!version) {
    const project = JSON.parse(readFileSync(join(root, "progress", "project.json"), "utf8"));
    version = project.version;
  }
  if (!/^[A-Za-z0-9_]+$/.test(version)) fail("version contains unsafe characters");

  const targetDirectory = join(root, "build", version, "target", "cro-split");
  const baseDirectory = join(root, "build", version, "base", "cro-split");
  const allowlist = loadCroAllowlist(root, version);
  const targets = candidates(targetDirectory);
  const bases = candidates(baseDirectory);
  const names = [...new Set([...targets.keys(), ...bases.keys()])].sort();
  const units = [{
    name: "main/code",
    target_path: `build/${version}/target/code.o`,
    base_path: `build/${version}/base/code.o`,
    metadata: { complete: false },
  }];

  for (const name of names) {
    const target = targets.get(name);
    const base = bases.get(name);
    if (!allowlist.has(name)) {
      warn(`${name}: excluded because it is absent from the public CRO manifest`);
      continue;
    }
    if (!target || !base) {
      warn(`${name}: excluded because its target/base pair is incomplete`);
      continue;
    }
    if (!containedBy(root, target) || !containedBy(root, base) ||
        (requireIgnored && (!ignoredByGit(root, target) || !ignoredByGit(root, base)))) {
      warn(`${name}: excluded because both objects must be ignored build artifacts inside the repository`);
      continue;
    }
    try {
      const targetObject = inspectArmObject(target);
      const baseObject = inspectArmObject(base, { requireCode: false, requireFunctions: false });
      units.push({
        name: `cro/${name}`,
        target_path: `build/${version}/target/cro-split/${name}.o`,
        base_path: `build/${version}/base/cro-split/${name}.o`,
        // Whole-file identity is intentionally stricter than objdiff's code-only
        // score. Anything less remains incomplete until a stronger attestation
        // mechanism is introduced.
        metadata: { complete: targetObject.buffer.equals(baseObject.buffer) &&
          !targetObject.hasUnknown && !baseObject.hasUnknown },
      });
    } catch (error) {
      warn(`${name}: excluded: ${error.message}`);
    }
  }

  return {
    $schema: "https://raw.githubusercontent.com/encounter/objdiff/main/config.schema.json",
    min_version: "2.0.0",
    build_target: false,
    build_base: false,
    units,
  };
}

function parseCli(argv) {
  const options = {};
  let check = false;
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === "--check") check = true;
    else if (argument === "--root") options.root = argv[++index];
    else if (argument === "--version") options.version = argv[++index];
    else if (argument === "--output") options.output = argv[++index];
    else fail(`unknown argument ${argument}`);
  }
  return { ...options, check };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseCli(process.argv.slice(2));
  const root = realpathSync(options.root ?? DEFAULT_ROOT);
  const output = resolve(root, options.output ?? "objdiff.json");
  if (!containedBy(root, output)) fail("output must be inside the repository");
  const config = generateObjdiffConfig({
    root,
    version: options.version,
    warn: (message) => console.error(`warning: ${message}`),
  });
  const serialized = `${JSON.stringify(config, null, 2)}\n`;
  if (options.check) {
    if (!existsSync(output) || readFileSync(output, "utf8") !== serialized) fail(`${relative(root, output)} is stale`);
  } else {
    writeFileSync(output, serialized);
  }
  console.log(`${options.check ? "Verified" : "Generated"} ${relative(root, output)} with ${config.units.length} unit(s).`);
}
