import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function loadEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, "$2")];
  }));
}

function sha256(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(path).on("error", reject).on("data", (chunk) => hash.update(chunk)).on("end", () => resolve(hash.digest("hex")));
  });
}

const local = { ...loadEnv(join(root, ".env.local")), ...process.env };
const version = local.VERSION ?? "AS_EUR_REV2";
const target = JSON.parse(readFileSync(join(root, "config", "targets", `${version}.json`), "utf8"));

if (!local.ROM_PATH || !existsSync(local.ROM_PATH)) throw new Error("ROM_PATH does not name a readable target file");
if (statSync(local.ROM_PATH).size !== target.container.size) throw new Error("Target size does not match the manifest");
const romHash = await sha256(local.ROM_PATH);
if (romHash !== target.container.sha256) throw new Error(`Target SHA-256 mismatch: ${romHash}`);
console.log(`${version}: container verified (${target.productCode}, ${target.titleId})`);

if (local.DECOMP_PRIVATE) {
  for (const [name, relative, expected] of [
    ["exheader", "exheader.bin", target.exheader],
    ["code", "code.bin", target.code]
  ]) {
    const path = join(local.DECOMP_PRIVATE, relative);
    if (!existsSync(path)) continue;
    if (statSync(path).size !== expected.size || await sha256(path) !== expected.sha256) throw new Error(`${name} extraction does not match the manifest`);
    console.log(`${version}: ${name} verified`);
  }
}

