#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validator = path.join(root, "scripts/validate-cro-dll-battle-record-leaves-01.mjs");
const result = spawnSync(process.execPath, [validator, ...process.argv.slice(2)], {
  cwd: root,
  env: { ...process.env, DLLBATTLE_BATCH: "record-ops-04" },
  encoding: "utf8",
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  console.error(`DllBattle record ops 04: could not start shared strict validator: ${result.error.message}`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
