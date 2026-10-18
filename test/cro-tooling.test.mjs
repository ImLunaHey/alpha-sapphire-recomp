import { readFile } from "node:fs/promises";
import process from "node:process";

import { expect, test } from "vitest";
import { transformWithOxc } from "vite";

const root = new URL("../", import.meta.url);
const syntaxOnly = [
  "scripts/generate-cro-symbols.mjs",
  "scripts/generate-objdiff-config.mjs",
  "scripts/split-cro-target-object.mjs",
  "scripts/validate-cro-function-semantics.mjs",
];
const executable = [
  ["scripts/test-public-cro-metadata.mjs", []],
  ["scripts/validate-public-cro-metadata.mjs", ["--require-complete"]],
  ["scripts/test-prepare-bytematch-report.mjs", []],
  ["scripts/test-cro-function-semantics.mjs", []],
  ["scripts/test-generate-cro-symbols.mjs", []],
  ["scripts/test-generate-objdiff-config.mjs", []],
  ["scripts/validate-split-cro-target-object.mjs", ["--self-test"]],
];

test.each(syntaxOnly)("%s parses", async (file) => {
  await transformWithOxc(await readFile(new URL(file, root), "utf8"), file, { lang: "js" });
});

test.each(executable)("%s succeeds", async (file, args) => {
  const originalArgv = process.argv;
  const originalExitCode = process.exitCode;
  process.argv = [process.execPath, new URL(file, root).pathname, ...args];
  process.exitCode = undefined;
  try {
    const url = new URL(file, root);
    url.searchParams.set("vitestCroToolingCase", file);
    await import(url.href);
    expect(process.exitCode, `${file} set a failing exit code`).not.toBe(1);
  } finally {
    process.argv = originalArgv;
    process.exitCode = originalExitCode;
  }
});
