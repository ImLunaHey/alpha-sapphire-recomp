import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const [codePath, symbolsPath, assembler, readelf, branchThunksPath] = process.argv.slice(2);
if (!codePath || !symbolsPath || !assembler || !readelf || !branchThunksPath) {
  throw new Error(
    "Expected code, symbol inventory, assembler, readelf, and branch thunk mapping paths"
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
  const instructions = [];
  if (destination) {
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
