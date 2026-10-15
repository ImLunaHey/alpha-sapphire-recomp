import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const configPath = join(root, "config", "arm-direct-branch-thunks.json");
const sourcePath = join(root, "src", "main", "arm_direct_branch_thunks.S");
const config = JSON.parse(readFileSync(configPath, "utf8"));

if (config.schemaVersion !== 1 || !Array.isArray(config.thunks)) {
  throw new Error("Unexpected ARM direct-branch thunk mapping format");
}
if (config.thunks.length !== 27) {
  throw new Error(`Expected 27 ARM direct-branch thunks, found ${config.thunks.length}`);
}

const expected = new Map();
for (const thunk of config.thunks) {
  if (
    typeof thunk?.name !== "string" ||
    !/^func_[0-9A-F]{8}$/.test(thunk.name) ||
    typeof thunk.destination !== "string" ||
    !/^(?:func_[0-9A-F]{8}|observed_[A-Za-z0-9_]+)$/.test(thunk.destination)
  ) {
    throw new Error("Invalid ARM direct-branch thunk mapping entry");
  }
  if (expected.has(thunk.name)) {
    throw new Error(`Duplicate ARM direct-branch thunk mapping for ${thunk.name}`);
  }
  expected.set(thunk.name, thunk.destination);
}

const source = readFileSync(sourcePath, "utf8");
const actual = new Map();
const definitionPattern = /^(func_[0-9A-F]{8}):\n[ \t]+b ([A-Za-z0-9_]+)$/gm;
for (const match of source.matchAll(definitionPattern)) {
  if (actual.has(match[1])) {
    throw new Error(`Duplicate ARM direct-branch thunk definition for ${match[1]}`);
  }
  actual.set(match[1], match[2]);
}

for (const [name, destination] of expected) {
  if (actual.get(name) !== destination) {
    throw new Error(`Assembly mapping mismatch for ${name}`);
  }
}
for (const name of actual.keys()) {
  if (!expected.has(name)) {
    throw new Error(`Unconfigured ARM direct-branch thunk definition for ${name}`);
  }
}
if (actual.size !== expected.size) {
  throw new Error(`Expected ${expected.size} assembly definitions, found ${actual.size}`);
}

console.log(`Validated ${actual.size} symbolic ARM direct-branch thunks.`);
