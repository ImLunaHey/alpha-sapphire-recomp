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
node "$root/scripts/validate-arm-ipc-templates-25.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-26.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-27.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-28.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-29.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-30.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-31.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-32.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-33.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-34.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-35.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-36.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-37.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-38.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-39.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-40.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-41.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-42.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-43.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-44.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-45.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-46.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-47.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-48.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-49.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-50.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-51.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-52.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-53.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-54.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-55.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-56.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-57.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-58.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-59.mjs" "$output" "$readelf"
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
node "$root/scripts/validate-arm-runtime-helpers-25.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-26.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-27.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-28.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-29.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-30.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-31.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-32.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-33.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-34.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-35.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-36.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-37.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-38.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-39.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-40.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-41.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-42.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-43.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-44.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-45.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-46.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-47.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-48.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-49.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-50.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-51.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-52.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-53.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-54.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-55.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-56.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-57.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-58.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-59.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-60.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-61.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-62.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-63.mjs" "$output" "$readelf"
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
node "$root/scripts/validate-arm-duplicate-templates-26.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-27.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-28.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-29.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-30.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-31.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-32.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-33.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-34.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-35.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-36.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-37.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-38.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-39.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-40.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-41.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-42.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-43.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-44.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-45.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-46.mjs" "$output" --base
node "$root/scripts/validate-arm-duplicate-templates-47.mjs" "$output" --base
node "$root/scripts/validate-arm-duplicate-templates-48.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-49.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-50.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-51.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-52.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-53.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-54.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-55.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-56.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-57.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-58.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-60.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-61.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-62.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-63.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-64.mjs" "$output" "$readelf"
ARM_READELF="$readelf" node "$root/scripts/validate-arm-ipc-templates-60.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-64.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-65.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-61.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-65.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-66.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-62.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-66.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-67.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-ipc-templates-63.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-67.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-68.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-69.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-70.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-71.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-72.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-73.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-duplicate-templates-74.mjs" "$output"
node "$root/scripts/validate-arm-duplicate-templates-75.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  CROSS_COMPILE="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-duplicate-templates-76.mjs" --target-object "$output" --no-fixtures
node "$root/scripts/validate-arm-duplicate-templates-77.mjs" "$output"
node "$root/scripts/validate-arm-ipc-templates-64.mjs" "$output" "$readelf"
ARM_READELF="$readelf" node "$root/scripts/validate-arm-ipc-templates-65.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-templates-66.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-67.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-68.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-69.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-70.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-71.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-72.mjs" "$output"
ARM_NONE_EABI_PREFIX="$(dirname "$readelf")/arm-none-eabi-" \
  node "$root/scripts/validate-arm-ipc-wrappers-73.mjs" "$output"
ARM_AS="$(dirname "$readelf")/arm-none-eabi-as" \
  ARM_OBJDUMP="$(dirname "$readelf")/arm-none-eabi-objdump" \
  node "$root/scripts/validate-arm-ipc-wrappers-74.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-68.mjs" "$output" "$readelf"
node "$root/scripts/validate-arm-runtime-helpers-69.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-70.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-71.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-72.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-73.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-74.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-75.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-76.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-77.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-78.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-79.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-80.mjs" "$output"
node "$root/scripts/validate-arm-runtime-helpers-81.mjs" "$output"
printf 'Built %s clean-room source object(s) into %s\n' "${#objects[@]}" "$output"
