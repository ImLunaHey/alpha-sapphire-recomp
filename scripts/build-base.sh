#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
toolchain="$(nix build --no-link --print-out-paths nixpkgs#gcc-arm-embedded)"
compiler="$(find "$toolchain" -type f -name arm-none-eabi-gcc -print -quit)"
linker="$(find "$toolchain" -type f -name arm-none-eabi-ld -print -quit)"
[[ -x "$compiler" && -x "$linker" ]] || {
  printf '%s\n' 'GNU Arm compiler tools were not found.' >&2
  exit 1
}

mapfile -d '' sources < <(find "$root/src" -type f -name '*.c' -print0 | sort -z)
if [[ ${#sources[@]} -eq 0 ]]; then
  printf '%s\n' 'No clean-room C sources were found.' >&2
  exit 1
fi

object_root="$root/build/AS_EUR_REV2/base/objects"
mkdir -p "$object_root"
objects=()
for source in "${sources[@]}"; do
  relative="${source#"$root/src/"}"
  object="$object_root/${relative%.c}.o"
  mkdir -p "$(dirname "$object")"
  "$compiler" \
    -std=c11 -Os -march=armv6k -mcpu=mpcore -mthumb -mfloat-abi=soft \
    -ffreestanding -fno-builtin -fno-common -fomit-frame-pointer \
    -fno-unwind-tables -fno-asynchronous-unwind-tables -fno-stack-protector \
    -fno-pic -fno-pie -fno-ident -ffunction-sections -fdata-sections \
    -Wall -Wextra -Werror -c "$source" -o "$object"
  objects+=("$object")
done

output="$root/build/AS_EUR_REV2/base/code.o"
mkdir -p "$(dirname "$output")"
"$linker" -r -o "$output" "${objects[@]}"
printf 'Built %s clean-room source object(s) into %s\n' "${#objects[@]}" "$output"
