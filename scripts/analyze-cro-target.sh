#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
if [[ -f "$root/.env.local" ]]; then
  # shellcheck disable=SC1091
  source "$root/.env.local"
fi

: "${DECOMP_PRIVATE:?Set DECOMP_PRIVATE in .env.local}"
module="${1:?Usage: scripts/analyze-cro-target.sh DllName [output.csv]}"
[[ "$module" =~ ^Dll[A-Za-z0-9_]+$ ]] || { printf '%s\n' 'Invalid CRO module name' >&2; exit 1; }
target="$root/build/AS_EUR_REV2/target/cro/$module.o"
output="${2:-$root/symbols/cro/$module.csv}"
[[ -f "$target" ]] || { printf 'Converted target object is missing: %s\n' "$target" >&2; exit 1; }

headless="${GHIDRA_HEADLESS:-}"
if [[ -z "$headless" ]]; then
  store="$(nix build --no-link --print-out-paths nixpkgs#ghidra)"
  headless="$(find "$store" -type f -path '*/support/analyzeHeadless' -print -quit)"
fi
[[ -x "$headless" ]] || { printf '%s\n' 'Ghidra analyzeHeadless was not found.' >&2; exit 1; }

stage="$DECOMP_PRIVATE/cro-inventory-stage"
project="$DECOMP_PRIVATE/ghidra-cro"
mkdir -p "$stage" "$project" "$(dirname "$output")"
staged="$stage/$module.csv"
"$headless" "$project" "AS_EUR_REV2_$module" \
  -import "$target" -overwrite \
  -processor ARM:LE:32:v6 \
  -scriptPath "$root/tools/ghidra" \
  -postScript ExportCroFunctions.java "$staged" "cro/$module"

node "$root/scripts/validate-cro-symbols.mjs" "$staged" "$target"
install -m 0644 "$staged" "$output"
printf 'Published neutral CRO function inventory: %s\n' "$output"
