import { readFile } from "node:fs/promises";
import process from "node:process";

import { expect, test } from "vitest";
import { transformWithOxc } from "vite";

const root = new URL("../../", import.meta.url);
const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const scripts = packageJson.scripts;

class ExitSignal extends Error {
  constructor(code) {
    super(`validator called process.exit(${code})`);
    this.code = code;
  }
}

function splitCommand(command) {
  return command.split(" && ").map((part) => part.trim());
}

function expandLifecycle(name, stack = []) {
  if (stack.includes(name)) {
    throw new Error(`npm lifecycle cycle: ${[...stack, name].join(" -> ")}`);
  }

  return [`pre${name}`, name, `post${name}`].flatMap((scriptName) => {
    const command = scripts[scriptName];
    if (!command) return [];

    return splitCommand(command).flatMap((part) => {
      const nested = /^npm run ([a-z0-9:-]+)$/.exec(part);
      return nested ? expandLifecycle(nested[1], [...stack, name]) : [{ scriptName, command: part }];
    });
  });
}

function collectCases() {
  const expanded = expandLifecycle("check:legacy");
  const executedScripts = new Set(
    expanded
      .map(({ command }) => /^node (scripts\/[a-zA-Z0-9._/-]+\.mjs)(?: |$)/.exec(command)?.[1])
      .filter(Boolean),
  );
  const seen = new Set();

  return expanded.flatMap(({ scriptName, command }, index) => {
    const syntax = /^node --check (scripts\/[a-zA-Z0-9._/-]+\.mjs)$/.exec(command);
    if (syntax && executedScripts.has(syntax[1])) return [];
    if (seen.has(command)) return [];
    seen.add(command);

    if (syntax) return [{ id: index, scriptName, command, kind: "syntax", file: syntax[1] }];

    const invocation = /^node (scripts\/[a-zA-Z0-9._/-]+\.mjs)(?: (.*))?$/.exec(command);
    if (!invocation) throw new Error(`unsupported repository-boundary command: ${command}`);
    const args = invocation[2]?.split(" ").filter(Boolean) ?? [];
    return [{ id: index, scriptName, command, kind: "validator", file: invocation[1], args }];
  });
}

async function parseModule(file) {
  const source = await readFile(new URL(file, root), "utf8");
  await transformWithOxc(source, file, { lang: "js" });
}

async function runValidator(entry) {
  if (entry.file === "scripts/check-no-rom.mjs") {
    const { validateRepositoryBoundary } = await import(new URL(entry.file, root));
    expect(await validateRepositoryBoundary()).toBeGreaterThan(0);
    return;
  }

  const originalArgv = process.argv;
  const originalExit = process.exit;
  const originalExitCode = process.exitCode;
  process.argv = [process.execPath, new URL(entry.file, root).pathname, ...entry.args];
  process.exitCode = undefined;
  process.exit = (code = 0) => {
    throw new ExitSignal(code);
  };

  try {
    try {
      const moduleUrl = new URL(entry.file, root);
      moduleUrl.searchParams.set("vitestCase", String(entry.id));
      await import(moduleUrl.href);
    } catch (error) {
      if (!(error instanceof ExitSignal) || error.code !== 0) throw error;
    }
    expect(process.exitCode, `${entry.file} set a failing exit code`).not.toBe(1);
  } finally {
    process.argv = originalArgv;
    process.exit = originalExit;
    process.exitCode = originalExitCode;
  }
}

const cases = collectCases();

export function registerRepositoryBoundaryShard(shard, shardCount) {
  const selected = cases.filter((_, index) => index % shardCount === shard);

  test(`manifest shard ${shard + 1}/${shardCount} is populated`, () => {
    expect(selected.length).toBeGreaterThan(40);
  });

  test.each(selected)("$scriptName: $command", async (entry) => {
    if (entry.kind === "syntax") await parseModule(entry.file);
    else await runValidator(entry);
  });
}
