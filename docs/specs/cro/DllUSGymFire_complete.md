# DllUSGymFire clean-room status

## Scope and provenance

This specification covers `cro/DllUSGymFire` for `AS_EUR_REV2`. Analysis began
from repository revision `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb` and was
corrected and revalidated on 2026-10-17 after rebasing onto `main` revision
`f01ec98c75c3363c29e8f36086776f0d848222b6`.
Analysis used the repository's public metadata and validators plus a privately
held verification input located through the ignored root `.env.local`. No ROM,
target object, extracted asset, Nintendo SDK material, private path, or
binary-derived string/table is included.

Exact tools used for the corrective verification were Node.js v24.21.0, Arm GNU
Toolchain GCC 14.2.1 20241119 (`14.2.Rel1`, build `arm-14.52`) with its
2.43.1.20241119 `readelf`, the separately pinned GNU binutils 2.44 assembler,
`objdump`, and `objcopy`, and `objdiff-cli` 3.8.2. Repository methods were
`split-cro-target-object.mjs`, `validate-cro-function-semantics.mjs`,
`validate-cro-dll-us-gym-fire-leaves-01.mjs`, `generate-objdiff-config.mjs`,
and the standard base/report validation commands.

The analysis and implementation roles were separated. Delegated analysis roles
identified candidate public duplicate patterns and emitted neutral behavioral
facts. The implementation role authored source only from the reduced facts in
these three specifications, then used the private object only through
fail-closed validators as a post-authorship check. The corrective review
discarded every implementation whose reproducibility depended on an omitted
target-derived schedule. This document intentionally omits exhaustive
instruction, literal, relocation, container, and link-layout schedules.

The method was: validate public boundaries; match each tiny behavior to an
existing public source pattern; author ARM source using neutral identities;
build with the pinned toolchain; verify section/symbol/body contracts; normalize
each veneer import by its accepted ordinal; and finally compare function bytes
and relocation offset/type/normalized-symbol/addend against the private split
target. Runtime behavior of foreign imports was not exercised.

## Accepted implementation contract

All accepted entries are ARM and four-byte aligned.

- The interval beginning at `0x0000` contains 52 four-byte import veneers. For
  veneer index `n` in `[0, 52)`, the public entry is at `8*n`, and its adjacent
  four-byte import slot is at `8*n + 4`. Each veneer transfers control through
  its own neutral imported identity, `dllusgymfire_import_00` through
  `dllusgymfire_import_33`. Imported proprietary names are not part of the
  contract.
- `func_000001A0`, size 20, clears the first three words of the record addressed
  by its first argument and returns normally.
- `func_00000690`, size 8, returns one.
- `func_00000F08`, `func_00000F10`, `func_00000F18`, and `func_00000F24` are
  eight-byte zero-return leaves.
- `func_00000DCC`, size 224, remains governed by
  `docs/specs/cro/contract_10.md`.

The 58 newly accepted functions total 268 instruction bytes. With the existing
contract-10 function, the public accepted set is 59 functions and 492
instruction bytes. Adjacent veneer slots are relocation-bearing data and are
not claimed as matched data.

## Required verification

The unit-specific validator must fail closed unless all of these remain true:

- the source, public CSV, partition, and source manifest agree on every accepted
  boundary and semantic label;
- the linked object has exactly the unit's accepted executable sections;
- each accepted function body has its pinned byte hash;
- every veneer owns exactly one `R_ARM_ABS32` relocation at its adjacent slot,
  using only the corresponding neutral import identity;
- optional target-aware mode proves every accepted function body byte-identical
  and proves each veneer relocation's normalized module offset, `R_ARM_ABS32`
  type, one-to-one ordinal import identity, and zero addend without making the
  private target a repository dependency.

The generic semantic validator must also accept the partition, instruction
tiling, terminal instructions, pools, and text relocations.

## Completion status and blockers

This is not a full-link specification. `metadata.complete` must remain false.
The complete-unit gate cannot pass because independently derivable behavioral
specifications and clean-room constructions are still missing for most code,
all substantive read-only/writable data, exact external binding identities,
and the remaining unknown ranges. The normalized split-target artifact also
differs structurally from the cached comparison artifact, so whole-file ELF
identity is not yet a settled completion target.

No unmatched bytes, opaque resource selectors, coordinate records, type names,
or full relocation schedules may be copied into public source or documentation
to bypass those blockers.

`func_00000EEC` is explicitly quarantined. Its earlier implementation used
numeric branch displacements observed from the verification target without a
reproducible neutral linkage contract. It is not accepted or authored here.
