import { readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const MAX_INPUT = 16 * 1024 * 1024;
const HEADER = "Location,Name,Namespace,Mode,Size,Segment";

function fail(message) {
  throw new Error(`CRO function inventory: ${message}`);
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
      } else quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else value += character;
  }
  if (quoted) fail("unterminated CSV quote");
  values.push(value);
  return values;
}

function bounded(path) {
  const buffer = readFileSync(path);
  if (buffer.length === 0 || buffer.length > MAX_INPUT) fail(`${path} has an invalid size`);
  return buffer;
}

function elfTextSize(path) {
  const buffer = bounded(path);
  if (buffer.length < 52 || !buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])) ||
      buffer[4] !== 1 || buffer[5] !== 1 || buffer.readUInt16LE(16) !== 1 || buffer.readUInt16LE(18) !== 40 ||
      buffer.readUInt16LE(46) !== 40) fail("target is not an ELF32 little-endian ARM ET_REL object");
  const offset = buffer.readUInt32LE(32);
  const count = buffer.readUInt16LE(48);
  const namesIndex = buffer.readUInt16LE(50);
  if (count < 2 || count > 16384 || namesIndex === 0 || namesIndex >= count || offset + count * 40 > buffer.length) {
    fail("target has an invalid section table");
  }
  const sections = [];
  for (let index = 0; index < count; index++) {
    const cursor = offset + index * 40;
    const section = {
      nameOffset: buffer.readUInt32LE(cursor), type: buffer.readUInt32LE(cursor + 4),
      flags: buffer.readUInt32LE(cursor + 8), fileOffset: buffer.readUInt32LE(cursor + 16),
      size: buffer.readUInt32LE(cursor + 20),
    };
    if (section.type !== 8 && section.fileOffset + section.size > buffer.length) fail("target section exceeds file bounds");
    sections.push(section);
  }
  const namesSection = sections[namesIndex];
  if (namesSection.type !== 3) fail("target has no section-name table");
  const names = buffer.subarray(namesSection.fileOffset, namesSection.fileOffset + namesSection.size);
  const sectionName = (start) => {
    if (start >= names.length) fail("target section-name offset is invalid");
    const end = names.indexOf(0, start);
    if (end < 0) fail("target section name is not terminated");
    return names.toString("utf8", start, end);
  };
  const text = sections.filter((section) => sectionName(section.nameOffset) === ".text" &&
    section.type === 1 && (section.flags & 0x6) === 0x6);
  if (text.length !== 1 || text[0].size <= 0) fail("target must have one nonempty executable .text section");
  return text[0].size;
}

export function validateCroInventory(text, { expectedUnit, expectedTextSize } = {}) {
  if (Buffer.byteLength(text) > MAX_INPUT) fail("inventory exceeds size limit");
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === "") lines.pop();
  if (lines.length < 4 || lines[0] !== "# Format,CRO_FUNCTIONS_V1" ||
      !lines[1].startsWith("# Module,") || !/^# TextSize,[0-9A-F]{8}$/.test(lines[2]) || lines[3] !== HEADER) {
    fail("header or metadata is invalid");
  }
  const unit = lines[1].slice("# Module,".length);
  if (!/^cro\/Dll[A-Za-z0-9_]+$/.test(unit) || (expectedUnit && unit !== expectedUnit)) fail("module identity is invalid");
  const textSize = Number.parseInt(lines[2].slice("# TextSize,".length), 16);
  if (!Number.isSafeInteger(textSize) || textSize <= 0 || (expectedTextSize !== undefined && textSize !== expectedTextSize)) {
    fail("text size is invalid or disagrees with the target");
  }
  const manifest = JSON.parse(readFileSync(join(ROOT, "progress", "units", "AS_EUR_REV2.cro.json"), "utf8"));
  if (!manifest.units?.some((entry) => entry.name === unit)) fail("module is absent from the public CRO manifest");

  const entries = lines.slice(4).map((line, index) => {
    const fields = parseCsv(line);
    if (fields.length !== 6) fail(`line ${index + 5} does not have six fields`);
    const [locationHex, name, namespace, mode, sizeHex, segment] = fields;
    if (!/^[0-9A-F]{8}$/.test(locationHex) || !/^[0-9A-F]{8}$/.test(sizeHex)) fail(`line ${index + 5} has noncanonical hex`);
    const location = Number.parseInt(locationHex, 16);
    const size = Number.parseInt(sizeHex, 16);
    if (name !== `func_${locationHex}` || namespace !== "Global" || segment !== ".text") {
      fail(`line ${index + 5} contains non-neutral metadata`);
    }
    const alignment = mode === "$a" ? 4 : mode === "$t" ? 2 : 0;
    if (!alignment || location % alignment !== 0 || size <= 0 || size % alignment !== 0 ||
        location + size > textSize) fail(`${name} has invalid mode, alignment, size, or range`);
    return { location, size, name };
  });
  for (let index = 1; index < entries.length; index++) {
    const previous = entries[index - 1];
    const current = entries[index];
    if (previous.location >= current.location) fail("functions are not strictly address-sorted");
    if (previous.location + previous.size > current.location) fail(`${previous.name} overlaps ${current.name}`);
  }
  return { unit, textSize, functionCount: entries.length, bodyBytes: entries.reduce((sum, entry) => sum + entry.size, 0) };
}

function selfTest() {
  const valid = [
    "# Format,CRO_FUNCTIONS_V1", "# Module,cro/DllTitle", "# TextSize,00000100", HEADER,
    '00000000,"func_00000000","Global",$a,00000008,".text"',
    '00000010,"func_00000010","Global",$t,00000006,".text"', "",
  ].join("\n");
  const result = validateCroInventory(valid, { expectedUnit: "cro/DllTitle", expectedTextSize: 0x100 });
  if (result.functionCount !== 2 || result.bodyBytes !== 14) fail("self-test summary mismatch");
  const rejects = (label, mutation) => {
    try { validateCroInventory(mutation, { expectedUnit: "cro/DllTitle", expectedTextSize: 0x100 }); }
    catch { return; }
    fail(`self-test accepted ${label}`);
  };
  rejects("overlap", valid.replace("00000010,\"func_00000010", "00000004,\"func_00000004"));
  rejects("unaligned ARM", valid.replace("00000000,\"func_00000000", "00000002,\"func_00000002"));
  rejects("out-of-range body", valid.replace("00000008,\".text\"", "00000104,\".text\""));
  rejects("private name", valid.replace("func_00000000", "OriginalName"));
  rejects("wrong module", valid.replace("cro/DllTitle", "cro/DllBattle"));
  console.log("CRO function inventory validator self-test: ok");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--self-test")) selfTest();
  else {
    const inventoryPath = process.argv[2];
    const objectPath = process.argv[3];
    if (!inventoryPath || !objectPath) fail("usage: validate-cro-symbols.mjs <inventory.csv> <target.o>");
    const stem = basename(objectPath, ".o");
    if (!/^Dll[A-Za-z0-9_]+$/.test(stem)) fail("target object name is invalid");
    const result = validateCroInventory(bounded(inventoryPath).toString("utf8"), {
      expectedUnit: `cro/${stem}`,
      expectedTextSize: elfTextSize(objectPath),
    });
    console.log(`Validated ${result.unit}: ${result.functionCount} functions, ${result.bodyBytes} body bytes, ` +
      `${((result.bodyBytes / result.textSize) * 100).toFixed(2)}% conservative text coverage.`);
  }
}
