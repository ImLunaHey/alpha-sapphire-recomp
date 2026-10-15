import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifest = JSON.parse(
  readFileSync(join(root, "config", "targets", "AS_EUR_REV2.json"), "utf8")
);
const input = process.argv[2] ?? join(root, "symbols", "code.bin.csv");
const lines = readFileSync(input, "utf8").trim().split(/\r?\n/);

if (lines.shift() !== "Location,Name,Namespace,Mode,Size,Segment") {
  throw new Error("Unexpected function inventory header");
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

const textStart = Number.parseInt(manifest.code.segments.text.address, 16);
const textSize = Number.parseInt(manifest.code.segments.text.size, 16);
const textEnd = textStart + textSize;
const entries = lines.filter(Boolean).map((line, index) => {
  const fields = parseCsv(line);
  if (fields.length !== 6) {
    throw new Error(`Line ${index + 2} has ${fields.length} fields; expected 6`);
  }
  const [location, name, namespace, mode, size, segment] = fields;
  return {
    location: Number.parseInt(location, 16),
    name,
    namespace,
    mode,
    size: Number.parseInt(size, 16),
    segment
  };
});

if (entries.length === 0) {
  throw new Error("Function inventory is empty");
}

const seen = new Set();
let arm = 0;
let thumb = 0;
let bodyBytes = 0;
for (const [index, entry] of entries.entries()) {
  if (!Number.isSafeInteger(entry.location) || !Number.isSafeInteger(entry.size)) {
    throw new Error(`Invalid hexadecimal value on inventory line ${index + 2}`);
  }
  if (entry.location < textStart || entry.location >= textEnd) {
    throw new Error(`${entry.name} starts outside the executable text segment`);
  }
  if (entry.size <= 0 || entry.size > textSize) {
    throw new Error(`${entry.name} has an invalid inferred body size`);
  }
  if (entry.location + entry.size > textEnd) {
    throw new Error(`${entry.name} extends beyond the executable text segment`);
  }
  if (entry.segment !== ".text") {
    throw new Error(`${entry.name} belongs to unexpected segment ${entry.segment}`);
  }
  if (seen.has(entry.location)) {
    throw new Error(`Duplicate function entry at 0x${entry.location.toString(16)}`);
  }
  seen.add(entry.location);
  if (entry.mode === "$a") {
    arm++;
    if (entry.location % 4 !== 0 || entry.size % 4 !== 0) {
      throw new Error(`${entry.name} has an unaligned ARM entry or size`);
    }
  } else if (entry.mode === "$t") {
    thumb++;
    if (entry.location % 2 !== 0 || entry.size % 2 !== 0) {
      throw new Error(`${entry.name} has an unaligned Thumb entry or size`);
    }
  } else {
    throw new Error(`${entry.name} has unknown instruction mode ${entry.mode}`);
  }
  bodyBytes += entry.size;
}

for (let index = 1; index < entries.length; index++) {
  if (entries[index - 1].location >= entries[index].location) {
    throw new Error("Function inventory is not strictly address-sorted");
  }
  if (entries[index - 1].location + entries[index - 1].size > entries[index].location) {
    throw new Error(
      `${entries[index - 1].name} overlaps ${entries[index].name} in the function inventory`
    );
  }
}

const coverage = (bodyBytes / textSize) * 100;
console.log(
  `Validated ${entries.length} inferred functions (${arm} ARM, ${thumb} Thumb); ` +
    `Ghidra body coverage ${coverage.toFixed(2)}%.`
);
console.log("Function boundaries are heuristic until independently confirmed during matching.");
