import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cpus } from "node:os";
import { dirname, join, resolve } from "node:path";

export function concurrency() {
  const requested = Number.parseInt(process.env.BASE_BUILD_CONCURRENCY ?? "", 10);
  if (Number.isSafeInteger(requested) && requested > 0) return requested;
  return Math.max(1, Math.min(cpus().length, 8));
}

export function run(executable, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(executable, args, { stdio: "inherit", ...options });
    child.once("error", (error) => reject(new Error(`could not execute ${executable}: ${error.message}`)));
    child.once("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${executable} ${signal ? `was killed by ${signal}` : `exited with status ${code}`}`));
    });
  });
}

async function capture(executable, args, cwd) {
  return new Promise((resolveRun, reject) => {
    let stdout = "";
    let stderr = "";
    const child = spawn(executable, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => code === 0
      ? resolveRun(stdout.trim())
      : reject(new Error(`${executable} exited with status ${code}: ${stderr.trim()}`)));
  });
}

export async function mapConcurrent(items, limit, worker) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(workers);
}

export async function resolveArmTools(root) {
  const prefix = process.env.CROSS_COMPILE;
  const compiler = prefix ? `${prefix}gcc` : undefined;
  const configured = {
    compiler,
    linker: compiler ? join(dirname(compiler), "arm-none-eabi-ld") : undefined,
    readelf: compiler ? join(dirname(compiler), "arm-none-eabi-readelf") : undefined,
    binutilsLinker: process.env.ARM_LD,
    binutilsReadelf: process.env.ARM_READELF,
    objcopy: process.env.ARM_OBJCOPY ?? (prefix ? `${prefix}objcopy` : undefined),
    assembler: process.env.ARM_AS ?? (prefix ? `${prefix}as` : undefined),
    objdump: process.env.ARM_OBJDUMP ?? (prefix ? `${prefix}objdump` : undefined),
  };
  if (Object.values(configured).every((path) => path && existsSync(path))) return configured;

  const [toolchain, binutils] = await Promise.all([
    capture("nix", ["build", "--no-link", "--print-out-paths", `${root}#toolchain`], root),
    capture("nix", ["build", "--no-link", "--print-out-paths", `${root}#binutils`], root),
  ]);
  const bin = join(binutils, "bin");
  const tools = {
    compiler: join(toolchain, "bin", "arm-none-eabi-gcc"),
    linker: join(toolchain, "bin", "arm-none-eabi-ld"),
    readelf: join(toolchain, "bin", "arm-none-eabi-readelf"),
    binutilsLinker: join(bin, "arm-none-eabi-ld"),
    binutilsReadelf: join(bin, "arm-none-eabi-readelf"),
    objcopy: join(bin, "arm-none-eabi-objcopy"),
    assembler: join(bin, "arm-none-eabi-as"),
    objdump: join(bin, "arm-none-eabi-objdump"),
  };
  for (const [name, path] of Object.entries(tools)) {
    if (!existsSync(path)) throw new Error(`GNU Arm ${name} was not found at ${path}`);
  }
  return tools;
}

export function toolEnvironment(tools) {
  const prefix = resolve(dirname(tools.compiler), "arm-none-eabi-");
  return {
    ...process.env,
    CROSS_COMPILE: prefix,
    ARM_NONE_EABI_PREFIX: prefix,
    ARM_NONE_EABI_BIN: dirname(tools.readelf),
    ARM_AS: tools.assembler,
    ARM_OBJDUMP: tools.objdump,
    ARM_READELF: tools.binutilsReadelf,
    ARM_LD: tools.binutilsLinker,
    ARM_OBJCOPY: tools.objcopy,
    PATH: `${dirname(tools.readelf)}:${dirname(tools.compiler)}:${process.env.PATH ?? ""}`,
  };
}
