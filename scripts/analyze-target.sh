#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
if [[ -f "$root/.env.local" ]]; then
  # shellcheck disable=SC1091
  source "$root/.env.local"
fi

: "${DECOMP_PRIVATE:?Set DECOMP_PRIVATE in .env.local}"
code="$DECOMP_PRIVATE/code.bin"
[[ -f "$code" ]] || { printf '%s\n' 'Private code.bin is missing; run npm run target:extract.' >&2; exit 1; }

headless="${GHIDRA_HEADLESS:-}"
if [[ -z "$headless" ]]; then
  store="$(nix build --no-link --print-out-paths nixpkgs#ghidra)"
  headless="$(find "$store" -type f -path '*/support/analyzeHeadless' -print -quit)"
fi
[[ -x "$headless" ]] || { printf '%s\n' 'Ghidra analyzeHeadless was not found.' >&2; exit 1; }

mkdir -p "$DECOMP_PRIVATE/ghidra" "$root/symbols"
"$headless" "$DECOMP_PRIVATE/ghidra" AS_EUR_REV2 \
  -import "$code" \
  -overwrite \
  -loader BinaryLoader \
  -loader-baseAddr 0x00100000 \
  -processor ARM:LE:32:v6 \
  -scriptPath "$root/tools/ghidra" \
  -preScript ConfigureCode.java \
  -postScript ExportFunctions.java "$root/symbols/code.bin.csv"

node "$root/scripts/validate-symbols.mjs"
