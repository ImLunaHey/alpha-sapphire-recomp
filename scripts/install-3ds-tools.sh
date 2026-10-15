#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
source_dir="$root/.cache/tools-src/3dstool"
commit='3771ae967d64092370b646db86aa626401c279e8'

if [[ ! -d "$source_dir/.git" ]]; then
  mkdir -p "$(dirname "$source_dir")"
  git clone https://github.com/dnasdw/3dstool.git "$source_dir"
  git -C "$source_dir" checkout "$commit"
fi

actual="$(git -C "$source_dir" rev-parse HEAD)"
if [[ "$actual" != "$commit" ]]; then
  printf '3dstool checkout mismatch: got %s, expected %s\n' "$actual" "$commit" >&2
  printf '%s\n' 'Remove the ignored cache checkout manually, then retry.' >&2
  exit 1
fi

if ! command -v nix-shell >/dev/null 2>&1; then
  printf '%s\n' 'nix-shell is required to provide 3dstool build dependencies.' >&2
  exit 1
fi

nix-shell -p openssl curl libiconv cmake gnumake --run \
  "cmake -S '$source_dir' -B '$source_dir/build' -DUSE_DEP=OFF && cmake --build '$source_dir/build' -j$(getconf _NPROCESSORS_ONLN)"

binary="$source_dir/bin/Release/3dstool"
"$binary" --help >/dev/null
printf '3dstool ready at %s\n' "$binary"

