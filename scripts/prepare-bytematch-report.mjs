import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const project = JSON.parse(readFileSync(join(root, "progress", "project.json"), "utf8"));
const snapshot = join(root, "progress", "reports", project.version, "report.json");
const generated = join(root, "build", project.version, "report.json");
const update = process.argv.includes("--update");
const input = update ? generated : snapshot;
const output = update ? snapshot : generated;

function fail(message) {
  throw new Error(`ByteMatch report validation failed: ${message}`);
}

if (!existsSync(input)) fail(`${input} does not exist`);

const report = JSON.parse(readFileSync(input, "utf8"));
const measures = report.measures;
const units = report.units;
const expected = project.progress;

if (report.version !== 2 || !measures || !Array.isArray(units) || units.length !== expected.totalUnits) {
  fail("unexpected objdiff report shape or version");
}
if (measures.matched_code_percent !== expected.matchedCodePercent ||
    measures.matched_functions !== expected.matchedFunctions ||
    measures.total_functions !== expected.totalFunctions ||
    measures.total_units !== expected.totalUnits) {
  fail("report measures do not match progress/project.json");
}

const functions = units.flatMap((unit) => unit.functions ?? []);
if (functions.length !== expected.totalFunctions ||
    functions.some((fn) => !/^func_[0-9A-Fa-f]+$/.test(fn.name) ||
      !/^\d+$/.test(fn.size) || !/^\d+$/.test(fn.address) ||
      Object.keys(fn.metadata ?? {}).length !== 0)) {
  fail("function inventory is incomplete or contains unexpected metadata");
}

const serialized = JSON.stringify(report).toLowerCase();
const forbidden = [".3ds", ".cia", ".cxi", ".ncch", "baserom", "/private/", "/extracted/"];
if (forbidden.some((value) => serialized.includes(value))) {
  fail("report contains a forbidden proprietary path marker");
}

mkdirSync(dirname(output), { recursive: true });
copyFileSync(input, output);
console.log(`${update ? "Updated" : "Prepared"} ${output} from a validated objdiff report.`);
