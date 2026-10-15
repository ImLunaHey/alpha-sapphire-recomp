#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

mapfile -d '' files < <(git ls-files -z)
bad=0

for file in "${files[@]}"; do
  lower="${file,,}"
  case "$lower" in
    *.3ds|*.3dsx|*.cia|*.cci|*.cxi|*.ncch|*.rom|*.romfs|*.exefs|*.code|baserom*|original/*|private/*|extracted/*)
      printf 'blocked proprietary path: %s\n' "$file" >&2
      bad=1
      continue
      ;;
  esac

  [[ -f "$file" ]] || continue
  size="$(stat -c %s "$file")"
  if (( size > 10485760 )); then
    printf 'blocked file over 10 MiB (review and use an external artifact): %s\n' "$file" >&2
    bad=1
  fi

  magic="$(dd if="$file" bs=1 skip=256 count=4 status=none 2>/dev/null || true)"
  if [[ "$magic" == 'NCSD' || "$magic" == 'NCCH' ]]; then
    printf 'blocked Nintendo container signature: %s\n' "$file" >&2
    bad=1
  fi
done

if (( bad != 0 )); then
  exit 1
fi

printf '%s\n' 'Repository safety check passed: no obvious ROM/container files tracked.'

