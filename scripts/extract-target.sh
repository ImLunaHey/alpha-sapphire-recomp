#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
if [[ -f "$root/.env.local" ]]; then
  # shellcheck disable=SC1091
  source "$root/.env.local"
fi

: "${ROM_PATH:?Set ROM_PATH in .env.local}"
: "${DECOMP_PRIVATE:?Set DECOMP_PRIVATE in .env.local}"

mkdir -p "$DECOMP_PRIVATE"
private_root="$(realpath "$DECOMP_PRIVATE")"
case "$private_root" in
  "$root"|"$root"/*)
    printf '%s\n' 'DECOMP_PRIVATE must be outside the repository.' >&2
    exit 1
    ;;
esac

tool="${THREEDSTOOL:-$root/.cache/tools-src/3dstool/bin/Release/3dstool}"
if [[ ! -x "$tool" ]]; then
  printf '%s\n' '3dstool is missing; run npm run tools:install-3ds.' >&2
  exit 1
fi

node "$root/scripts/extract-container.mjs"
mkdir -p "$private_root/exefs-packed"
"$tool" -xvtf exefs "$private_root/exefs.bin" --exefs-dir "$private_root/exefs-packed" > "$private_root/exefs-info.txt"
"$tool" -uvf "$private_root/exefs-packed/code.bin" --compress-type blz --compress-out "$private_root/code.bin"

sha256sum "$private_root/exheader.bin" "$private_root/code.bin" > "$private_root/extracted.sha256"
printf 'Private executable extraction ready at %s\n' "$private_root"

