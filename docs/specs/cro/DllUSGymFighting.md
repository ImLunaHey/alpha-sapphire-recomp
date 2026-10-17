# `DllUSGymFighting` clean-room status

## Scope and provenance

- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Unit: `cro/DllUSGymFighting`.
- Observation date: 2026-10-17.
- This document records only the public inventory and high-level observable
  status needed for independent implementation. It intentionally omits
  disassembly, instruction schedules, exhaustive partitions, relocation
  ledgers, and binary-derived data tables.

## Public accepted boundary

The public neutral inventory accepts one ARM function:

| Function | Address | Size | Ownership |
| --- | ---: | ---: | --- |
| `func_000006FC` | `0x06FC` | 152 bytes | executable instructions only |

Its independently reviewed implementation is maintained by CRO contract 10.
That contract owns no neighboring literals, padding, relocations, or data.

## High-level interface facts

- The unit is an ARM EABI module for the repository's ARMv6K target.
- The accepted function participates in the gym event update path and operates
  on caller-owned object state. Its exact ABI and byte validation are already
  enforced by the shared contract-10 source and validator.
- Other candidate functions and boundaries are not approved for publication.
  A fresh implementer must derive them independently from observable behavior
  and use target comparison only as blind pass/fail feedback.

## Completion blockers

The unit is not complete. Most executable text, all module data, import/export
linkage outside the accepted function, and relocation ownership remain
unimplemented or unverified in the public clean-room inventory. Proprietary
type-name and descriptor payloads are deliberately absent.

No claim of complete linkage, byte-identical data, or `metadata.complete=true`
is supported by the current public evidence.

## Quarantine note

An earlier revision of this contribution included material too detailed for
`docs/CLEAN_ROOM.md`. Corrective commits remove that specification and every
implementation or validator derived from it. The removed material must not be
used as an implementation reference.
