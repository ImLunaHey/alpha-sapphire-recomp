#!/usr/bin/env bash
set -euo pipefail

# Build and execute only our passage sources. No local environment file,
# extraction step, target object, report, or game image is used.
root="$(git rev-parse --show-toplevel)"
cd "$root"
toolchain="$(nix build --no-link --print-out-paths "$root#toolchain")"
passage_python="$(nix build --no-link --print-out-paths --impure --expr '
  let f = builtins.getFlake (toString ./.);
      p = f.inputs.nixpkgs.legacyPackages.x86_64-linux;
  in p.python3.withPackages (ps: [ps.unicorn])
')"
node "$root/scripts/validate-cro-dll-uspassage.mjs" --self-test \
  --compiler "$toolchain/bin/arm-none-eabi-gcc" \
  --python "$passage_python/bin/python3"
