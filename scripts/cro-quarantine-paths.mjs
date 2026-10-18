import { lstatSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { join, resolve } from "node:path";

function reject(prefix, message) {
  throw new Error(`${prefix}: ${message}`);
}

function validateAbsentAt(candidate, label, prefix, inspect = lstatSync) {
  try {
    inspect(candidate);
  } catch (error) {
    if (error?.code === "ENOENT") return;
    reject(prefix, `cannot inspect ${label}: ${error?.message ?? error}`);
  }
  reject(prefix, `${label} remains in the working tree`);
}

export function validateAbsentPaths(root, paths, prefix, inspect = lstatSync) {
  for (const path of paths) validateAbsentAt(resolve(root, path), path, prefix, inspect);
}

export function selfTestAbsentPaths(root, paths, prefix) {
  for (const path of paths) {
    let checkedPath;
    try {
      validateAbsentPaths(root, [path], prefix, candidate => {
        checkedPath = candidate;
        return {};
      });
      reject(prefix, `${path} hostile self-test accepted a restored entry`);
    } catch (error) {
      if (!error.message.includes(`${path} remains in the working tree`)) throw error;
    }
    if (checkedPath !== resolve(root, path))
      reject(prefix, `${path} hostile self-test inspected the wrong path`);

    validateAbsentPaths(root, [path], prefix,
      () => { throw Object.assign(new Error("missing"), { code: "ENOENT" }); });

    try {
      validateAbsentPaths(root, [path], prefix,
        () => { throw Object.assign(new Error("denied"), { code: "EACCES" }); });
      reject(prefix, `${path} hostile self-test accepted an inspection failure`);
    } catch (error) {
      if (!error.message.includes(`cannot inspect ${path}: denied`)) throw error;
    }
  }

  const fixture = mkdtempSync(join(root, ".cro-quarantine-"));
  try {
    for (const [index, path] of paths.entries()) {
      const dangling = join(fixture, `dangling-${index}`);
      symlinkSync(join(fixture, `missing-${index}`), dangling);
      try {
        validateAbsentAt(dangling, path, prefix);
        reject(prefix, `${path} hostile self-test accepted a dangling symlink`);
      } catch (error) {
        if (!error.message.includes(`${path} remains in the working tree`)) throw error;
      }
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}
