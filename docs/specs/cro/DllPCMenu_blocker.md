# DllPCMenu provenance quarantine

This is an analysis-only provenance record for `cro/DllPCMenu`. The review was
performed on 2026-10-18 against repository revision
`feb14f0fa394072dcc3dcbf34e30a272940fcae1`.

## Allowed observations and tools

The review used Git 2.53.0, ripgrep 15.2.0, Node.js 24.21.0, and npm 11.19.0.
It was limited to reproducible observations from tracked public repository
material:

- [CLEAN_ROOM](../../CLEAN_ROOM.md) defines the required provenance and role
  separation.
- [the public unit manifest](../../../config/publication-units.json),
  [neutral inventory](../../../symbols/cro/DllPCMenu.csv), and
  [partition metadata](../../../symbols/cro-partitions/DllPCMenu.json) establish
  only that the permanent link unit exists and remains incomplete.
- `git log --follow -- src/cro/DllPCMenu.c` traces the withdrawn source only to
  the repository mass-wave commit `7b14dec`; `rg -l DllPCMenu docs/specs`
  finds no independently reviewed unit behavior specification.

The implementation source was not opened or inspected. No ROM, extracted
asset, proprietary or leaked source, private path, disassembly, target-derived
instruction schedule, or register, offset, symbol, or relocation ledger was
used or reproduced.

## Stop condition

The available record does not establish admissible unit-specific observations,
an approved behavior specification, separated implementation provenance, or an
independent implementation review. The unsupported source, authored-source
registration, and match credit are therefore withdrawn without reproducing or
reworking the source. Neutral inventory remains structural metadata only and
does not authorize implementation or credit.

Implementation remains blocked until an analysis contributor records
reproducible behavior and interface observations with admissible provenance, a
reviewer approves that specification, and a distinct implementation contributor
works only from the approved handoff. Any future claim must then pass the
repository's deterministic build and independent byte-identity review.
