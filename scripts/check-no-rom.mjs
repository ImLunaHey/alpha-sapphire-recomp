#!/usr/bin/env node

import { execFile } from "node:child_process";
import { open, stat } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const MAX_TRACKED_FILE_SIZE = 10 * 1024 * 1024;
const MAGIC_OFFSET = 256;
const MAGIC_LENGTH = 4;
const FILE_CONCURRENCY = 32;
const BLOCKED_EXTENSIONS = new Set([
  ".3ds",
  ".3dsx",
  ".cia",
  ".cci",
  ".cxi",
  ".ncch",
  ".rom",
  ".romfs",
  ".exefs",
  ".code",
  ".cro",
  ".crs",
  ".crr",
]);

function hasBlockedPath(file) {
  const lower = file.toLowerCase();
  const basename = lower.slice(lower.lastIndexOf("/") + 1);
  const extension = basename.includes(".") ? basename.slice(basename.lastIndexOf(".")) : "";

  return (
    BLOCKED_EXTENSIONS.has(extension) ||
    basename.startsWith("baserom") ||
    lower.startsWith("original/") ||
    lower.startsWith("private/") ||
    lower.startsWith("extracted/")
  );
}

async function inspectFile(file) {
  if (hasBlockedPath(file)) {
    return `blocked proprietary path: ${file}`;
  }

  let metadata;
  try {
    metadata = await stat(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }

  if (!metadata.isFile()) return null;
  if (metadata.size > MAX_TRACKED_FILE_SIZE) {
    return `blocked file over 10 MiB (review and use an external artifact): ${file}`;
  }
  if (metadata.size < MAGIC_OFFSET + MAGIC_LENGTH) return null;

  const handle = await open(file, "r");
  try {
    const magic = Buffer.allocUnsafe(MAGIC_LENGTH);
    const { bytesRead } = await handle.read(magic, 0, MAGIC_LENGTH, MAGIC_OFFSET);
    if (bytesRead === MAGIC_LENGTH && (magic.equals(Buffer.from("NCSD")) || magic.equals(Buffer.from("NCCH")))) {
      return `blocked Nintendo container signature: ${file}`;
    }
  } finally {
    await handle.close();
  }

  return null;
}

export async function validateRepositoryBoundary() {
  const { stdout } = await execFileAsync("git", ["ls-files", "-z"], {
    encoding: "buffer",
    maxBuffer: 32 * 1024 * 1024,
  });
  const files = stdout.toString("utf8").split("\0").filter(Boolean);
  const failures = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < files.length) {
      const file = files[nextIndex++];
      const failure = await inspectFile(file);
      if (failure) failures.push(failure);
    }
  }

  await Promise.all(Array.from({ length: Math.min(FILE_CONCURRENCY, files.length) }, () => worker()));

  if (failures.length > 0) {
    failures.sort();
    throw new Error(failures.join("\n"));
  }

  return files.length;
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  try {
    await validateRepositoryBoundary();
    process.stdout.write("Repository safety check passed: no obvious ROM/container files tracked.\n");
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
