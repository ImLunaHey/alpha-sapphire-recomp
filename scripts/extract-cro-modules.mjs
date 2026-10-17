import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  realpathSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { basename, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = realpathSync(join(fileURLToPath(new URL(".", import.meta.url)), ".."));
const INVALID_OFFSET = 0xffffffff;
const MAX_METADATA_SIZE = 64 * 1024 * 1024;
const COPY_BUFFER_SIZE = 1024 * 1024;

function loadEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, "$2")];
      }),
  );
}

function isInside(parent, candidate) {
  const path = relative(parent, candidate);
  return path === "" || (!path.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && path !== ".." && !isAbsolute(path));
}

function checkedNumber(value, label) {
  if (typeof value === "bigint") {
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label} exceeds JavaScript's safe integer range`);
    return Number(value);
  }
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} is invalid`);
  return value;
}

function align(value, alignment) {
  if (!Number.isSafeInteger(alignment) || alignment <= 0 || (alignment & (alignment - 1)) !== 0) {
    throw new Error(`Invalid alignment ${alignment}`);
  }
  return checkedNumber(Math.ceil(value / alignment) * alignment, "aligned offset");
}

function add(...values) {
  return checkedNumber(values.reduce((sum, value) => sum + value, 0), "file offset");
}

const local = { ...loadEnv(join(root, ".env.local")), ...process.env };
if (!local.ROM_PATH || !local.DECOMP_PRIVATE) {
  throw new Error("ROM_PATH and DECOMP_PRIVATE are required (configure them in .env.local)");
}

const romPath = realpathSync(resolve(local.ROM_PATH));
const privateRequested = resolve(local.DECOMP_PRIVATE);
mkdirSync(privateRequested, { recursive: true });
const privateRoot = realpathSync(privateRequested);
if (isInside(root, romPath)) throw new Error("ROM_PATH must remain outside the repository");
if (isInside(root, privateRoot)) throw new Error("DECOMP_PRIVATE must remain outside the repository");
if (!statSync(romPath).isFile()) throw new Error("ROM_PATH must name a regular file");

const outputRequested = join(privateRoot, "cro-modules");
mkdirSync(outputRequested, { recursive: true });
const outputRoot = realpathSync(outputRequested);
if (!isInside(privateRoot, outputRoot) || isInside(root, outputRoot)) {
  throw new Error("CRO output directory must resolve inside DECOMP_PRIVATE and outside the repository");
}
const fd = openSync(romPath, "r");
const romSize = statSync(romPath).size;

function readAt(offset, length, label = "target") {
  checkedNumber(offset, `${label} offset`);
  checkedNumber(length, `${label} length`);
  if (add(offset, length) > romSize) throw new Error(`${label} extends beyond the target image`);
  const output = Buffer.alloc(length);
  let cursor = 0;
  while (cursor < length) {
    const count = readSync(fd, output, cursor, length - cursor, offset + cursor);
    if (count === 0) throw new Error(`Unexpected end of target while reading ${label}`);
    cursor += count;
  }
  return output;
}

function section(metadata, index, name) {
  const offset = metadata.readUInt32LE(4 + index * 8);
  const size = metadata.readUInt32LE(8 + index * 8);
  if (size > MAX_METADATA_SIZE) throw new Error(`${name} metadata is unreasonably large`);
  return { offset, size };
}

function extractFile(sourceOffset, size, destination) {
  if (add(sourceOffset, size) > romSize) throw new Error(`${basename(destination)} extends beyond the target image`);
  const temporary = `${destination}.tmp-${process.pid}`;
  const output = openSync(temporary, "wx", 0o600);
  const digest = createHash("sha256");
  const buffer = Buffer.allocUnsafe(COPY_BUFFER_SIZE);
  let cursor = 0;
  try {
    while (cursor < size) {
      const wanted = Math.min(buffer.length, size - cursor);
      const count = readSync(fd, buffer, 0, wanted, sourceOffset + cursor);
      if (count === 0) throw new Error(`Unexpected end of target while extracting ${basename(destination)}`);
      let written = 0;
      while (written < count) written += writeSync(output, buffer, written, count - written);
      digest.update(buffer.subarray(0, count));
      cursor += count;
    }
  } catch (error) {
    closeSync(output);
    try { unlinkSync(temporary); } catch {}
    throw error;
  }
  closeSync(output);
  renameSync(temporary, destination);
  return digest.digest("hex");
}

try {
  const ncsd = readAt(0, 0x200, "NCSD header");
  if (ncsd.toString("ascii", 0x100, 0x104) !== "NCSD") throw new Error("Target is not an NCSD image");
  const partitionOffset = ncsd.readUInt32LE(0x120) * 0x200;
  const partitionSize = ncsd.readUInt32LE(0x124) * 0x200;
  if (partitionOffset === 0 || partitionSize === 0 || add(partitionOffset, partitionSize) > romSize) {
    throw new Error("NCSD partition 0 has invalid bounds");
  }

  const ncch = readAt(partitionOffset, 0x200, "NCCH header");
  if (ncch.toString("ascii", 0x100, 0x104) !== "NCCH") throw new Error("Partition 0 is not NCCH");
  if ((ncch[0x18f] & 0x04) === 0) throw new Error("Encrypted NCCH is unsupported; provide a lawfully decrypted dump");
  const mediaUnit = 0x200 * (2 ** ncch[0x18e]);
  const romfsRelative = ncch.readUInt32LE(0x1b0) * mediaUnit;
  const romfsSize = ncch.readUInt32LE(0x1b4) * mediaUnit;
  const romfsOffset = add(partitionOffset, romfsRelative);
  if (romfsRelative === 0 || romfsSize === 0 || add(romfsRelative, romfsSize) > partitionSize) {
    throw new Error("NCCH RomFS has invalid bounds");
  }

  const ivfc = readAt(romfsOffset, 0x5c, "IVFC header");
  if (ivfc.toString("ascii", 0, 4) !== "IVFC" || ivfc.readUInt32LE(4) !== 0x10000) {
    throw new Error("RomFS does not contain an IVFC v1 header");
  }
  const masterHashSize = ivfc.readUInt32LE(8);
  const ivfcHeaderSize = ivfc.readUInt32LE(0x54);
  const level3BlockPower = ivfc.readUInt32LE(0x4c);
  if (ivfcHeaderSize < 0x5c || ivfcHeaderSize > 0x1000) throw new Error("IVFC header size is invalid");
  if (level3BlockPower < 9 || level3BlockPower > 20) throw new Error("IVFC level-3 block size is invalid");
  const level3Relative = align(align(ivfcHeaderSize, 0x20) + masterHashSize, 2 ** level3BlockPower);
  const level3Size = checkedNumber(ivfc.readBigUInt64LE(0x44), "IVFC level-3 size");
  if (add(level3Relative, level3Size) > romfsSize) throw new Error("IVFC level 3 extends beyond RomFS");
  const level3Offset = add(romfsOffset, level3Relative);

  const metadata = readAt(level3Offset, 0x28, "RomFS metadata header");
  if (metadata.readUInt32LE(0) !== 0x28) throw new Error("RomFS metadata header size is invalid");
  const dirTable = section(metadata, 1, "directory table");
  const fileTable = section(metadata, 3, "file table");
  const dataOffset = metadata.readUInt32LE(0x24);
  for (const [name, value] of [["directory table", dirTable], ["file table", fileTable]]) {
    if (add(value.offset, value.size) > level3Size) throw new Error(`RomFS ${name} is out of bounds`);
  }
  if (dataOffset > level3Size) throw new Error("RomFS file-data offset is out of bounds");

  const dirs = readAt(add(level3Offset, dirTable.offset), dirTable.size, "RomFS directory table");
  const files = readAt(add(level3Offset, fileTable.offset), fileTable.size, "RomFS file table");
  if (dirs.length < 0x18) throw new Error("RomFS root-directory entry is truncated");
  let entryOffset = dirs.readUInt32LE(0x0c);
  const visited = new Set();
  const selected = [];
  while (entryOffset !== INVALID_OFFSET) {
    if (visited.has(entryOffset)) throw new Error("RomFS root file list contains a cycle");
    visited.add(entryOffset);
    if (entryOffset > files.length - 0x20) throw new Error("RomFS root file entry is out of bounds");
    const parent = files.readUInt32LE(entryOffset);
    const sibling = files.readUInt32LE(entryOffset + 4);
    const fileOffset = checkedNumber(files.readBigUInt64LE(entryOffset + 8), "RomFS file offset");
    const fileSize = checkedNumber(files.readBigUInt64LE(entryOffset + 16), "RomFS file size");
    const nameSize = files.readUInt32LE(entryOffset + 28);
    if (parent !== 0) throw new Error("RomFS root file has a non-root parent");
    if ((nameSize & 1) !== 0 || nameSize > 0x1000 || entryOffset + 0x20 + nameSize > files.length) {
      throw new Error("RomFS root file name is invalid");
    }
    const name = files.subarray(entryOffset + 0x20, entryOffset + 0x20 + nameSize).toString("utf16le");
    if (name.includes("/") || name.includes("\\") || name.includes("\0") || basename(name) !== name) {
      throw new Error("RomFS root file name is unsafe");
    }
    if (/^Dll[^/\\]*\.cro$/iu.test(name) || /^static\.(?:crs|crr)$/iu.test(name)) {
      if (add(fileOffset, fileSize) > level3Size - dataOffset) throw new Error(`${name} data is out of bounds`);
      selected.push({ name, offset: fileOffset, size: fileSize, tableOffset: entryOffset });
    }
    entryOffset = sibling;
  }

  // Some retail titles place the signed-module support files below a directory
  // even when their CROs live at the RomFS root. Walk the compact file-entry
  // table only to find these two fixed basenames; no other nested data is read.
  let tableOffset = 0;
  while (tableOffset < files.length) {
    if (tableOffset > files.length - 0x20) throw new Error("RomFS file table has a truncated entry");
    const fileOffset = checkedNumber(files.readBigUInt64LE(tableOffset + 8), "RomFS file offset");
    const fileSize = checkedNumber(files.readBigUInt64LE(tableOffset + 16), "RomFS file size");
    const nameSize = files.readUInt32LE(tableOffset + 28);
    if ((nameSize & 1) !== 0 || nameSize > 0x1000 || tableOffset + 0x20 + nameSize > files.length) {
      throw new Error("RomFS file-table name is invalid");
    }
    const name = files.subarray(tableOffset + 0x20, tableOffset + 0x20 + nameSize).toString("utf16le");
    if (/^static\.(?:crs|crr)$/iu.test(name)) {
      if (add(fileOffset, fileSize) > level3Size - dataOffset) throw new Error(`${name} data is out of bounds`);
      const existing = selected.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
      if (existing && existing.tableOffset !== tableOffset) throw new Error(`RomFS contains duplicate support file ${name}`);
      if (!existing) selected.push({ name, offset: fileOffset, size: fileSize, tableOffset });
    }
    tableOffset = align(tableOffset + 0x20 + nameSize, 4);
  }

  selected.sort((left, right) => left.name.localeCompare(right.name, "en"));
  const moduleCount = selected.filter(({ name }) => name.toLowerCase().endsWith(".cro")).length;
  if (moduleCount === 0) throw new Error("No root Dll*.cro modules were found");
  const names = new Set(selected.map(({ name }) => name.toLowerCase()));
  if (names.size !== selected.length) throw new Error("RomFS contains duplicate selected filenames");
  if (!names.has("static.crs") || !names.has("static.crr")) {
    const missing = ["static.crs", "static.crr"].filter((name) => !names.has(name));
    throw new Error(`RomFS extraction inventory is missing ${missing.join(" and ")}`);
  }

  const inventory = [];
  for (const entry of selected) {
    const sourceOffset = add(level3Offset, dataOffset, entry.offset);
    const sha256 = extractFile(sourceOffset, entry.size, join(outputRoot, entry.name));
    inventory.push({ name: entry.name, size: entry.size, sha256 });
  }
  const inventoryPath = join(outputRoot, "inventory.json");
  const inventoryTemporary = `${inventoryPath}.tmp-${process.pid}`;
  writeFileSync(inventoryTemporary, `${JSON.stringify({
    format: 1,
    target: local.VERSION || "AS_EUR_REV2",
    moduleCount,
    supportFileCount: inventory.length - moduleCount,
    files: inventory,
  }, null, 2)}\n`, { mode: 0o600, flag: "wx" });
  renameSync(inventoryTemporary, inventoryPath);
  console.log(`Extracted ${moduleCount} CRO modules and ${inventory.length - moduleCount} support files to ${outputRoot}`);
} finally {
  closeSync(fd);
}
