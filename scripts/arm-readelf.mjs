import { existsSync } from "node:fs";

// Resolves the ARM readelf from the configured toolchain so validators do not
// depend on a host binutils install; falls back to readelf on PATH.
export function armReadelf() {
  if (process.env.ARM_READELF) return process.env.ARM_READELF;
  const prefixed = process.env.CROSS_COMPILE && `${process.env.CROSS_COMPILE}readelf`;
  if (prefixed && existsSync(prefixed)) return prefixed;
  return "readelf";
}
