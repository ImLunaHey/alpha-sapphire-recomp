# DllStartMenu high-level analysis contract 01

## Scope and provenance

This specification records only externally observable behavior and permitted
structural metadata for the genuine `cro/DllStartMenu` link unit. It contains
no instruction schedule, target bytes, disassembly, proprietary string,
extracted table, asset, or private path.

- Target revision: Pokémon Alpha Sapphire `AS_EUR_REV2`
- Observation date: 2026-10-17
- Public baseline: commit `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`
- Public inputs: `symbols/cro/DllStartMenu.csv`,
  `symbols/cro-partitions/DllStartMenu.json`, and the current objdiff report
- Private verification inputs were located only through the ignored root
  checkout environment and were not copied into the repository.

An earlier revision of this document contained impermissibly detailed
binary-derived material. That material and its derived implementation were
quarantined and removed in full. This cleaned contract is intentionally
insufficient to recover a particular instruction sequence.

## Public structural accounting

The module has 7,212 text bytes, 712 read-only bytes, 4 writable bytes, and 16
zero-initialized bytes. The public text partition accounts for all 7,212 bytes:

| Class | Ranges | Bytes |
| --- | ---: | ---: |
| accepted ARM functions | 2 | 856 |
| executable gaps | 123 | 5,676 |
| literal/data pools | 123 | 612 |
| unknown residue | 4 | 68 |

The accepted functions are `func_00000E44` at text offset `0x0E44` with size
440 and `func_000014D4` at `0x14D4` with size 416. Only
`func_000014D4` is currently claimed by clean-room source.

The four unknown ranges are `[0x06D0,0x06D8)`, `[0x195C,0x1964)`,
`[0x1B44,0x1B6C)`, and `[0x1C1C,0x1C28)`. They remain deliberately
unclassified. They may not receive function, code, or data ownership without
new independently reviewable evidence.

The converted structural object contains 135 text relocation outputs and 75
read-only relocation outputs, all represented as `R_ARM_ABS32`. These counts
are structural accounting only; this document does not disclose their target
identities, addends, or binary contents.

## Externally observable behavior of `func_00000E44`

The function processes one menu input event against a mutable menu-state
object and returns a consumed/not-consumed result.

- Two event classes request activation or cancellation through an optional
  client callback. If no callback is installed, processing continues to the
  directional-event checks.
- A previous-selection event is consumed. When movement is possible, it
  decrements the current selection, optionally notifies the client, refreshes
  the visible slot states, and activates the new selection.
- A next-selection event is consumed. Its upper bound depends on the current
  menu mode. When movement is possible, it increments the selection,
  optionally notifies the client, refreshes the visible slot states, and
  activates the new selection.
- Boundary directional events are consumed without changing the selection.
- Unsupported events return the not-consumed result.

This behavior may guide future independent black-box work, but it is not a
compile-ready ABI contract. Target comparison may be used only as a blind
pass/fail oracle; this specification does not authorize inspection or
reconstruction of the target instruction sequence.

## Fresh implementation status

A fresh implementation role with no access to the quarantined material could
not author a justified candidate from this contract. Public evidence does not
currently establish the event encoding, state layout, callback ABI,
mode-dependent bounds, or identities and signatures of the collaborating menu
services. Guessing those details would invent observable behavior rather than
implement the specification. `func_00000E44` therefore remains unclaimed and
unmatched pending independent evidence.

## Completion limits

A match for both accepted functions would still not complete this link unit.
Completion additionally requires independent implementations for all
executable gaps, deterministic pool and non-text data ownership, complete
relocation identity, objective classification of all unknown residue, and
whole-object equality under the repository's fail-closed gate.

The read-only section contains proprietary names and structured tables. Those
bytes may not be copied from the target. Without independent public or
black-box evidence that determines them, exact clean-room data reconstruction
remains a concrete blocker and `metadata.complete` must remain false.
