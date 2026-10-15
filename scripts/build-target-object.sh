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
  "$code" "$symbols" "$assembler" "$readelf" \
  "$root/config/arm-direct-branch-thunks.json" \
  "$root/config/arm-adjacent-global-loads-09.json" \
  "$root/config/arm-global-state-and-pointer-chases-11.json" \
  "$root/config/arm-duplicate-ipc-and-table-templates-12.json" \
  "$root/config/arm-multi-identity-globals-12.json" \
  "$root/config/arm-ipc-unique-templates-13.json" \
  "$root/config/arm-ipc-templates-15.json" \
  "$root/config/arm-ipc-templates-16.json" \
  "$root/config/arm-ipc-templates-17.json" \
  "$root/config/arm-ipc-templates-18.json" \
  "$root/config/arm-duplicate-container-templates-13.json" \
  "$root/config/target-literal-identities/AS_EUR_REV2.json" \
  "$root/config/targets/AS_EUR_REV2.json"
node "$root/scripts/validate-arm-adjacent-global-loads-09.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-global-state-and-pointer-chases-11.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-duplicate-ipc-and-table-templates-12.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-multi-identity-globals-12.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-ipc-unique-templates-13.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-15.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-16.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-17.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-18.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
node "$root/scripts/validate-arm-duplicate-container-templates-13.mjs" \
  "$root/build/AS_EUR_REV2/target/code.o" "$readelf"
