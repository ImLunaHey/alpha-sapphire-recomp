# DllUSGymFire small-routine reuse specification

## Clean-room boundary

This analysis was performed for `AS_EUR_REV2` at repository revision
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`. Private verification material was
used only to test candidate equivalence. This reduced specification contains no
target disassembly, bulk partition, literal-access schedule, callback table, or
import-address table.

The implementation may use only the accepted boundaries and behaviors below.
The corresponding target bytes must be established independently by the
repository's target-aware validator.

## Reusable public patterns

- The 52 veneers described in `DllUSGymFire_complete.md` use the public
  four-byte ARM linker-veneer pattern. Their adjacent destinations remain
  separate neutral identities rather than copied import names.
- `func_000001A0` uses the public three-word-clear leaf pattern: write zero at
  offsets 0, 4, and 8, then return.
- `func_00000690` uses the public constant-return pattern with value one.
- `func_00000EEC` uses the public call/restore/tail-transfer pattern. Its two
  dependencies are the accepted neutral base-destruction and release veneers.
- `func_00000F08`, `func_00000F10`, `func_00000F18`, and `func_00000F24` use
  the public zero-return leaf pattern.

These mappings justify exactly 59 newly authored functions and 284 instruction
bytes. They do not justify adjacent pool contents, any other candidate entry,
or any larger lifecycle/state-machine routine.

## Explicit exclusions

Static analysis found other possible small entry points, but their public entry
evidence depended on an exhaustive target-derived callback schedule. They are
not included in the public inventory or implementation. Larger routines were
also excluded because no complete public behavioral counterpart was
established.

Further promotion requires a concise, independently reviewable specification
that does not reproduce a binary-derived table.
