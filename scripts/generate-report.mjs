import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { generateObjdiffConfig } from "./generate-objdiff-config.mjs";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "progress", "project.json"), "utf8"));
const local = process.argv.includes("--local");

if (!config.decompilationEnabled && !local) {
  console.log("Progress reporting is intentionally disabled until decompilation is authorized.");
  process.exit(0);
}

const objdiffConfig = join(root, "objdiff.json");
const generatedObjdiffConfig = generateObjdiffConfig({
  root,
  version: config.version,
  warn: (message) => console.error(`warning: ${message}`),
});
writeFileSync(objdiffConfig, `${JSON.stringify(generatedObjdiffConfig, null, 2)}\n`);

const localCli = join(root, ".cache", "tools", "objdiff-cli");
const executable = process.env.OBJDIFF_CLI || (existsSync(localCli) ? localCli : "objdiff-cli");
const outputDirectory = join(root, "build", config.version);
const output = join(outputDirectory, "report.json");
mkdirSync(outputDirectory, { recursive: true });

const result = spawnSync(executable, ["report", "generate", "-p", root, "-o", output], {
  cwd: root,
  stdio: "inherit"
});

if (result.error) {
  console.error(`Unable to run objdiff-cli: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);

