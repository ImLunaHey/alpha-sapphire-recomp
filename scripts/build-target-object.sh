#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
if [[ -f "$root/.env.local" ]]; then
  # shellcheck disable=SC1091
  source "$root/.env.local"
fi

: "${DECOMP_PRIVATE:?Set DECOMP_PRIVATE in .env.local}"
code="$DECOMP_PRIVATE/code.bin"
symbols="$root/symbols/code.bin.csv"
[[ -f "$code" ]] || { printf '%s\n' 'Private code.bin is missing; run npm run target:extract.' >&2; exit 1; }
[[ -f "$symbols" ]] || { printf '%s\n' 'Function inventory is missing; run npm run target:analyze.' >&2; exit 1; }

toolchain="$(nix build --no-link --print-out-paths nixpkgs#gcc-arm-embedded)"
assembler="$(find "$toolchain" -type f -name arm-none-eabi-as -print -quit)"
readelf="$(find "$toolchain" -type f -name arm-none-eabi-readelf -print -quit)"
[[ -x "$assembler" && -x "$readelf" ]] || {
  printf '%s\n' 'GNU Arm assembler tools were not found.' >&2
  exit 1
}

node "$root/scripts/generate-target-object.mjs" \
  "$code" "$symbols" "$assembler" "$readelf"
