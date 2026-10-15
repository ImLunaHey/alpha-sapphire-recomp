#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"

if [[ -f "$root/.env.local" ]]; then
  # shellcheck disable=SC1091
  source "$root/.env.local"
fi

if [[ -z "${ROM_PATH:-}" ]]; then
  printf '%s\n' 'ROM_PATH is not configured. Copy .env.example to .env.local.' >&2
  exit 1
fi

if [[ ! -f "$ROM_PATH" || ! -r "$ROM_PATH" ]]; then
  printf '%s\n' 'ROM_PATH must name a readable regular file.' >&2
  exit 1
fi

case "$(realpath "$ROM_PATH")" in
  "$root"|"$root"/*)
    printf '%s\n' 'ROM_PATH must remain outside the repository.' >&2
    exit 1
    ;;
esac

printf '%s\n' 'Environment ready: private reference exists outside the repository.'

