#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
toolchain="$(nix build --no-link --print-out-paths nixpkgs#gcc-arm-embedded)"
compiler="$(find "$toolchain" -type f -name arm-none-eabi-gcc -print -quit)"
linker="$(find "$toolchain" -type f -name arm-none-eabi-ld -print -quit)"
readelf="$(find "$toolchain" -type f -name arm-none-eabi-readelf -print -quit)"
[[ -x "$compiler" && -x "$linker" && -x "$readelf" ]] || {
  printf '%s\n' 'GNU Arm compiler tools were not found.' >&2
  exit 1
}

mapfile -d '' sources < <(
  find "$root/src" -type f \( -name '*.c' -o -name '*.S' \) -print0 | sort -z
)
if [[ ${#sources[@]} -eq 0 ]]; then
  printf '%s\n' 'No clean-room C or assembly sources were found.' >&2
  exit 1
fi

declare -A source_modes=()
while IFS=$'\t' read -r path mode; do
  source_modes["$path"]="$mode"
done < <(node -e '
  const config = require(process.argv[1]);
  for (const source of config.sources) console.log(`${source.path}\t${source.mode}`);
' "$root/config/sources.json")

object_root="$root/build/AS_EUR_REV2/base/objects"
mkdir -p "$object_root"
objects=()
for source in "${sources[@]}"; do
  repository_path="${source#"$root/"}"
  relative="${source#"$root/src/"}"
  object="$object_root/${relative%.*}.o"
  mode="${source_modes[$repository_path]:-}"
  case "$mode" in
    arm) mode_flag="-marm" ;;
    thumb) mode_flag="-mthumb" ;;
    *)
      printf 'Missing or invalid instruction mode for %s in config/sources.json\n' "$repository_path" >&2
      exit 1
      ;;
  esac
  mkdir -p "$(dirname "$object")"
  case "$source" in
    *.c)
      "$compiler" \
        -std=c11 -Os -march=armv6k -mcpu=mpcore "$mode_flag" -mfloat-abi=soft \
        -ffreestanding -fno-builtin -fno-common -fomit-frame-pointer \
        -fno-unwind-tables -fno-asynchronous-unwind-tables -fno-stack-protector \
        -fno-pic -fno-pie -fno-ident -ffunction-sections -fdata-sections \
        -Wa,--noexecstack \
        -Wall -Wextra -Werror -c "$source" -o "$object"
      ;;
    *.S)
      "$compiler" \
        -march=armv6k -mcpu=mpcore "$mode_flag" -mfloat-abi=soft \
        -ffreestanding -fno-pic -fno-pie \
        -Wa,--noexecstack \
        -x assembler-with-cpp -c "$source" -o "$object"
      ;;
  esac
  objects+=("$object")
done

output="$root/build/AS_EUR_REV2/base/code.o"
mkdir -p "$(dirname "$output")"
"$linker" -r -o "$output" "${objects[@]}"
node "$root/scripts/validate-arm-opaque-address-returns.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-adjacent-global-loads-09.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-svc-thunks.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-scalar-literal-returns.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-abi-glue-10.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-recycle-subtrees-11.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-11.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-global-state-and-pointer-chases-11.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-thumb-runtime-helpers-12.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-ipc-and-table-templates-12.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-multi-identity-globals-12.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-unique-templates-13.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-15.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-16.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-17.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-18.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-19.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-20.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-21.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-22.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-23.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-24.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-container-templates-13.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-vfp-memory-helpers-13.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-14.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-15.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-16.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-17.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-18.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-19.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-20.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-21.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-22.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-23.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-24.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-14.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-16.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-17.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-18.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-19.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-20.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-21.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-22.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-23.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-24.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-25.mjs" "$output"
printf 'Built %s clean-room source object(s) into %s\n' "${#objects[@]}" "$output"
