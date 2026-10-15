import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function env(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(readFileSync(path, "utf8").split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const i = line.indexOf("=");
    return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, "$2")];
  }));
}

const local = { ...env(join(root, ".env.local")), ...process.env };
if (!local.ROM_PATH || !local.DECOMP_PRIVATE) throw new Error("ROM_PATH and DECOMP_PRIVATE are required");
mkdirSync(local.DECOMP_PRIVATE, { recursive: true });

const fd = openSync(local.ROM_PATH, "r");
const readAt = (offset, length) => {
  const output = Buffer.alloc(length);
  let cursor = 0;
  while (cursor < length) {
    const count = readSync(fd, output, cursor, length - cursor, offset + cursor);
    if (count === 0) throw new Error(`Unexpected end of target at 0x${(offset + cursor).toString(16)}`);
    cursor += count;
  }
  return output;
};

try {
  const ncsd = readAt(0, 0x200);
  if (ncsd.toString("ascii", 0x100, 0x104) !== "NCSD") throw new Error("Target is not an NCSD image");
  const partition0 = ncsd.readUInt32LE(0x120) * 0x200;
  const ncch = readAt(partition0, 0x200);
  if (ncch.toString("ascii", 0x100, 0x104) !== "NCCH") throw new Error("Partition 0 is not NCCH");
  if ((ncch[0x18f] & 0x04) === 0) throw new Error("Encrypted NCCH is unsupported; provide a lawfully decrypted dump");

  const exheaderSize = ncch.readUInt32LE(0x180);
  const exefsOffset = ncch.readUInt32LE(0x1a0) * 0x200;
  const exefsSize = ncch.readUInt32LE(0x1a4) * 0x200;
  if (exheaderSize === 0 || exefsSize === 0) throw new Error("Executable partition has no ExHeader or ExeFS");

  writeFileSync(join(local.DECOMP_PRIVATE, "exheader.bin"), readAt(partition0 + 0x200, 0x800));
  writeFileSync(join(local.DECOMP_PRIVATE, "exefs.bin"), readAt(partition0 + exefsOffset, exefsSize));
  writeFileSync(join(local.DECOMP_PRIVATE, "container-layout.json"), `${JSON.stringify({ partition0, exheaderSize, exefsOffset, exefsSize }, null, 2)}\n`);
} finally {
  closeSync(fd);
}
