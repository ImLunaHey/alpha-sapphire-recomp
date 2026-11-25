import { createHash } from "node:crypto";
import { createReadStream, existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { verifyPrivateCroModules } from "./generate-cro-target-objects.mjs";

const root = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));

function loadEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, "$2")];
  }));
}

function isInside(parent, candidate) {
  const path = relative(parent, candidate);
  return path === "" || (path !== ".." && !path.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(path));
}

function sha256(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(path).on("error", reject).on("data", (chunk) => hash.update(chunk)).on("end", () => resolve(hash.digest("hex")));
  });
}

// NCSD mode: ROM_PATH names the owned cartridge image. Extracted files in
// DECOMP_PRIVATE are checked when present.
async function verifyContainer(local, target, version, log) {
  if (!existsSync(local.ROM_PATH)) throw new Error("ROM_PATH does not name a readable target file");
  if (statSync(local.ROM_PATH).size !== target.container.size) throw new Error("Target size does not match the manifest");
  const romHash = await sha256(local.ROM_PATH);
  if (romHash !== target.container.sha256) throw new Error(`Target SHA-256 mismatch: ${romHash}`);
  log(`${version}: container verified (${target.productCode}, ${target.titleId})`);

  if (local.DECOMP_PRIVATE) {
    for (const [name, relative, expected] of [
      ["exheader", "exheader.bin", target.exheader],
      ["code", "code.bin", target.code]
    ]) {
      const path = join(local.DECOMP_PRIVATE, relative);
      if (!existsSync(path)) continue;
      if (statSync(path).size !== expected.size || await sha256(path) !== expected.sha256) throw new Error(`${name} extraction does not match the manifest`);
      log(`${version}: ${name} verified`);
    }
  }
}

// Pre-extracted mode: no ROM_PATH. DECOMP_PRIVATE must already hold the
// decompressed code.bin and the Dll*.cro set, each identified by its own
// published hash. The exheader differs between distribution formats and is
// not used by the build, so it is not part of this identity check.
async function verifyPreExtracted(local, repositoryRoot, target, version, log) {
  if (!existsSync(local.DECOMP_PRIVATE)) throw new Error("DECOMP_PRIVATE does not name an existing directory");
  const privateRoot = realpathSync(resolve(local.DECOMP_PRIVATE));
  if (isInside(repositoryRoot, privateRoot)) throw new Error("DECOMP_PRIVATE must remain outside the repository");
  if (!statSync(privateRoot).isDirectory()) throw new Error("DECOMP_PRIVATE does not name an existing directory");

  const code = join(privateRoot, "code.bin");
  if (!existsSync(code)) throw new Error("Without ROM_PATH, DECOMP_PRIVATE must contain the decompressed code.bin");
  const codeInfo = lstatSync(code);
  if (!codeInfo.isFile()) throw new Error("code.bin must be a regular file");
  if (codeInfo.size !== target.code.size || await sha256(code) !== target.code.sha256) throw new Error("code extraction does not match the manifest");
  log(`${version}: code verified`);

  const croDirectory = join(privateRoot, "cro-modules");
  if (!existsSync(croDirectory)) throw new Error("Without ROM_PATH, DECOMP_PRIVATE must contain cro-modules/");
  const count = verifyPrivateCroModules({
    root: repositoryRoot,
    manifestPath: join(repositoryRoot, "progress", "units", `${version}.cro.json`),
    privateDirectory: croDirectory,
    expectedTarget: version,
  });
  log(`${version}: ${count} CRO modules verified`);
  log(`${version}: pre-extracted inputs verified (no ROM_PATH; container and exheader not checked)`);
}

export async function verifyTarget({ local, repositoryRoot = root, log = console.log }) {
  const version = local.VERSION ?? "AS_EUR_REV2";
  const target = JSON.parse(readFileSync(join(repositoryRoot, "config", "targets", `${version}.json`), "utf8"));
  if (local.ROM_PATH) return verifyContainer(local, target, version, log);
  if (local.DECOMP_PRIVATE) return verifyPreExtracted(local, repositoryRoot, target, version, log);
  throw new Error("Set ROM_PATH to the target image, or DECOMP_PRIVATE to a directory with pre-extracted code.bin and cro-modules/");
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    await verifyTarget({ local: { ...loadEnv(join(root, ".env.local")), ...process.env } });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
