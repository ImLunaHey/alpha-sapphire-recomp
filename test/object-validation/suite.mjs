import { readFile } from "node:fs/promises";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

import { expect, test } from "vitest";

import { resolveArmTools, toolEnvironment } from "../../scripts/build-support.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const MAIN_OBJECT = join(ROOT, "build", "AS_EUR_REV2", "base", "code.o");
const CRO_OBJECTS = join(ROOT, "build", "AS_EUR_REV2", "base", "cro-code");
const manifest = JSON.parse(await readFile(new URL("./manifest.json", import.meta.url), "utf8"));
const tools = await resolveArmTools(ROOT);
const exactPathValidators = new Set(["scripts/validate-arm-runtime-helpers-60.mjs"]);

class ExitSignal extends Error {
  constructor(code) {
    super(`validator called process.exit(${code})`);
    this.code = code;
  }
}

function shellWords(value) {
  const words = [];
  const pattern = /"([^"]*)"|'([^']*)'|([^\s]+)/gu;
  for (const match of value.matchAll(pattern)) words.push(match[1] ?? match[2] ?? match[3]);
  return words;
}

function expandArguments(value) {
  let expanded = value
    .replaceAll('"$output"', JSON.stringify(MAIN_OBJECT))
    .replaceAll('"$(dirname "$readelf")/arm-none-eabi-as"', JSON.stringify(tools.assembler))
    .replaceAll('"$(dirname "$readelf")/arm-none-eabi-ld"', JSON.stringify(tools.linker))
    .replaceAll('"$(dirname "$readelf")/arm-none-eabi-objdump"', JSON.stringify(tools.objdump))
    .replaceAll('"$readelf"', JSON.stringify(tools.readelf))
    .replaceAll('"$ARM_OBJDUMP"', JSON.stringify(tools.objdump));
  expanded = expanded.replace(/"\$root\/([^"]+)"/gu, (_, path) => JSON.stringify(join(ROOT, path)));
  return shellWords(expanded);
}

function parse(command, id) {
  const match = /(?:^| )node "\$root\/(scripts\/[^"]+\.mjs)"(?: (.*))?$/u.exec(command);
  if (!match) throw new Error(`unsupported object-validation command: ${command}`);
  return {
    id,
    command,
    file: match[1],
    args: expandArguments(match[2] ?? ""),
  };
}

const cases = manifest.map(parse);

async function runValidator(entry) {
  const originalArgv = process.argv;
  const originalExit = process.exit;
  const originalExitCode = process.exitCode;
  const originalEnvironment = { ...process.env };
  Object.assign(process.env, toolEnvironment(tools), {
    ARM_NONE_EABI_AS: tools.assembler,
    ARM_NONE_EABI_OBJDUMP: tools.objdump,
    ARM_DUPLICATE_TEMPLATES_81_AS: tools.assembler,
    ARM_DUPLICATE_TEMPLATES_81_OBJDUMP: tools.objdump,
  });
  let temporary;
  let args = entry.args;
  if (!exactPathValidators.has(entry.file) &&
      args.some((argument) => argument === MAIN_OBJECT || argument.startsWith(`${CRO_OBJECTS}/`) || argument === CRO_OBJECTS)) {
    temporary = mkdtempSync(join(tmpdir(), "base-object-vitest-"));
    const localMain = join(temporary, "code.o");
    const localCro = join(temporary, "cro-code");
    if (args.includes(MAIN_OBJECT)) cpSync(MAIN_OBJECT, localMain);
    if (args.some((argument) => argument.startsWith(CRO_OBJECTS))) cpSync(CRO_OBJECTS, localCro, { recursive: true });
    args = args.map((argument) => {
      if (argument === MAIN_OBJECT) return localMain;
      if (argument === CRO_OBJECTS) return localCro;
      if (argument.startsWith(`${CRO_OBJECTS}/`)) return join(localCro, argument.slice(CRO_OBJECTS.length + 1));
      return argument;
    });
  }
  process.argv = [process.execPath, join(ROOT, entry.file), ...args];
  process.exitCode = undefined;
  process.exit = (code = 0) => { throw new ExitSignal(code); };
  try {
    try {
      const url = pathToFileURL(join(ROOT, entry.file));
      url.searchParams.set("vitestObjectCase", String(entry.id));
      await import(url.href);
    } catch (error) {
      if (!(error instanceof ExitSignal) || error.code !== 0) throw error;
    }
    expect(process.exitCode, `${entry.file} set a failing exit code`).not.toBe(1);
  } finally {
    process.argv = originalArgv;
    process.exit = originalExit;
    process.exitCode = originalExitCode;
    if (temporary) rmSync(temporary, { recursive: true, force: true });
    for (const key of Object.keys(process.env)) if (!(key in originalEnvironment)) delete process.env[key];
    Object.assign(process.env, originalEnvironment);
  }
}

export function registerObjectValidationShard(shard, shardCount) {
  const selected = cases.filter((_, index) => index % shardCount === shard);
  test(`object validation shard ${shard + 1}/${shardCount} is populated`, () => {
    expect(selected.length).toBeGreaterThan(40);
  });
  test.each(selected)("$command", runValidator);
}
