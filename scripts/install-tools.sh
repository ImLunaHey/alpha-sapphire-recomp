#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
version='v3.8.2'
machine="$(uname -m)"

case "$machine" in
  x86_64)
    asset='objdiff-cli-linux-x86_64'
    expected='e5445089a6f707e30cb5e02992451b604619cedfd2660ee2373a86bfefd9e718'
    ;;
  aarch64|arm64)
    asset='objdiff-cli-linux-aarch64'
    expected='087516e73e1b3223b39974f00bc2810fea5c3dc2c93a8e1f06442ec68acaacb4'
    ;;
  *)
    printf 'Unsupported machine for the pinned objdiff binary: %s\n' "$machine" >&2
    exit 1
    ;;
esac

directory="$root/.cache/tools"
destination="$directory/objdiff-cli"
partial="$destination.part"
mkdir -p "$directory"

if [[ -x "$destination" ]] && [[ "$(sha256sum "$destination" | cut -d' ' -f1)" == "$expected" ]]; then
  "$destination" --version
  exit 0
fi

curl --fail --location --silent --show-error \
  "https://github.com/encounter/objdiff/releases/download/$version/$asset" \
  --output "$partial"

actual="$(sha256sum "$partial" | cut -d' ' -f1)"
if [[ "$actual" != "$expected" ]]; then
  printf 'objdiff-cli checksum mismatch: got %s\n' "$actual" >&2
  exit 1
fi

chmod +x "$partial"
mv "$partial" "$destination"
"$destination" --version

