# DllStartMenu high-level analysis contract 01

## Scope and provenance

This specification records only externally observable behavior and permitted
structural metadata for the genuine `cro/DllStartMenu` link unit. It contains
no instruction schedule, target bytes, disassembly, proprietary string,
extracted table, asset, or private path.

- Target revision: Pokémon Alpha Sapphire `AS_EUR_REV2`
- Observation date: 2026-10-17
- Observation tool/version: Node.js `v24.21.0`
- Observation method: parse and cross-check the version-controlled public symbol
  CSV and partition JSON with the generated public objdiff report. This method
  supports structural accounting only; no gameplay or other black-box
  behavioral observation was performed or is claimed.
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

## Behavioral evidence status

No independently recorded behavioral observations support semantic claims for
`func_00000E44`. Accordingly, this specification retains none. Future semantic
work requires a separately documented lawful observation method, including its
tool and version, before behavioral facts may be added. Target comparison may
be used only as a blind pass/fail oracle; this specification does not authorize
inspection or reconstruction of the target instruction sequence.

## Fresh implementation status

A fresh implementation role with no access to the quarantined material could
not author a justified candidate from this structural contract. The permitted
public evidence does not establish the function's semantics or ABI. Guessing
those details would invent behavior rather than implement a specification.
`func_00000E44` therefore remains unclaimed and unmatched pending independent
evidence.

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
