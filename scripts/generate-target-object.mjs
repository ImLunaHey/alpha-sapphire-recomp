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
  targetConfigPath,
] = process.argv.slice(2);
if (
  !codePath ||
  !symbolsPath ||
  !assembler ||
  !readelf ||
  !branchThunksPath ||
  !adjacentGlobalLoadsPath ||
  !targetConfigPath
) {
  throw new Error(
    "Expected code, symbol inventory, assembler, readelf, branch thunk mapping, adjacent-global-load mapping, and target config paths"
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

const targetConfig = JSON.parse(readFileSync(targetConfigPath, "utf8"));
const targetSegments = new Map();
for (const name of ["data", "bss"]) {
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
  const instructions = [];
  if (destination && adjacentGlobalLoad) {
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
    ...(adjacentGlobalLoad
      ? [`.word ${adjacentGlobalLoad.identity}`, `.global ${adjacentGlobalLoad.identity}`]
      : []),
    ""
  );
}
if (branchThunks.size !== 0) {
  throw new Error(
    `ARM direct-branch thunks missing from the function inventory: ${[...branchThunks.keys()].join(", ")}`
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
const functionSymbols = symbols.stdout
  .split(/\r?\n/)
  .filter((line) => /\bFUNC\b/.test(line) && /\bGLOBAL\b/.test(line));
if (functionSymbols.length !== functions.length) {
  throw new Error(
    `Target object has ${functionSymbols.length} global functions; expected ${functions.length}`
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
