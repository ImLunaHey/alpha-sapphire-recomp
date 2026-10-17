#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
if [[ -f "$root/.env.local" ]]; then
  # shellcheck disable=SC1091
  source "$root/.env.local"
fi

: "${DECOMP_PRIVATE:?Set DECOMP_PRIVATE in .env.local}"
module="${1:?Usage: scripts/analyze-cro-target.sh DllName [output.csv] [partition.json] [target-split.o] [base-split.o]}"
[[ "$module" =~ ^Dll[A-Za-z0-9_]+$ ]] || { printf '%s\n' 'Invalid CRO module name' >&2; exit 1; }
target="$root/build/AS_EUR_REV2/target/cro/$module.o"
output="${2:-$root/symbols/cro/$module.csv}"
partition_output="${3:-$root/symbols/cro-partitions/$module.json}"
target_split_output="${4:-$root/build/AS_EUR_REV2/target/cro-split/$module.o}"
base_split_output="${5:-$root/build/AS_EUR_REV2/base/cro-split/$module.o}"
[[ -f "$target" ]] || { printf 'Converted target object is missing: %s\n' "$target" >&2; exit 1; }

headless="${GHIDRA_HEADLESS:-}"
if [[ -z "$headless" ]]; then
  store="$(nix build --no-link --print-out-paths nixpkgs#ghidra)"
  headless="$(find "$store" -type f -path '*/support/analyzeHeadless' -print -quit)"
fi
[[ -x "$headless" ]] || { printf '%s\n' 'Ghidra analyzeHeadless was not found.' >&2; exit 1; }

stage="${CRO_INVENTORY_STAGE:-$DECOMP_PRIVATE/cro-inventory-stage}"
project="${CRO_GHIDRA_PROJECT_ROOT:-$DECOMP_PRIVATE/ghidra-cro}"
mkdir -p "$stage" "$project" "$(dirname "$output")" "$(dirname "$partition_output")" \
  "$(dirname "$target_split_output")" "$(dirname "$base_split_output")"
staged="$stage/$module.csv"
staged_partition="$stage/$module.partition.json"
"$headless" "$project" "AS_EUR_REV2_$module" \
  -import "$target" -overwrite \
  -processor ARM:LE:32:v6
"$headless" "$project" "AS_EUR_REV2_$module" \
  -process "$module.o" -noanalysis \
  -scriptPath "$root/tools/ghidra" \
  -postScript ExportCroFunctions.java "$staged" "cro/$module" \
  -postScript ExportCroPartition.java "$staged" "$staged_partition" "cro/$module"

node "$root/scripts/validate-cro-symbols.mjs" "$staged" "$target"
node "$root/scripts/split-cro-target-object.mjs" "$target" "$staged_partition" \
  "$stage/$module.target-split.o" "$stage/$module.base-split.o"
node "$root/scripts/validate-cro-function-semantics.mjs" "$staged" "$target" "$staged_partition"
install -m 0644 "$staged" "$output"
install -m 0644 "$staged_partition" "$partition_output"
install -m 0644 "$stage/$module.target-split.o" "$target_split_output"
install -m 0644 "$stage/$module.base-split.o" "$base_split_output"
printf 'Published neutral CRO function inventory: %s\n' "$output"
printf 'Published exact CRO partition: %s\n' "$partition_output"
