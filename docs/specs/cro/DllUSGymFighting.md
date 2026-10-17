# `DllUSGymFighting` clean-room status

## Scope and provenance

- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Unit: `cro/DllUSGymFighting`.
- Status summary date: 2026-10-17.

This is not new target analysis and uses no analysis tool. It is a status
summary derived solely from these existing public repository files at commit
`84008d1`:

- `config/cro-sources.json`
- `config/cro-contract-10-proposal.json`
- `docs/specs/cro/contract_10.md`
- `symbols/cro/DllUSGymFighting.csv`
- `symbols/cro-partitions/DllUSGymFighting.json`
- `src/cro/DllUSGymFighting/contract_10.S`

It intentionally omits disassembly, instruction schedules, exhaustive
partitions, relocation ledgers, and binary-derived data tables.

## Public accepted boundary

The public neutral inventory accepts one ARM function:

| Function | Address | Size | Ownership |
| --- | ---: | ---: | --- |
| `func_000006FC` | `0x06FC` | 152 bytes | executable instructions only |

Its independently reviewed implementation is maintained by CRO contract 10.
That contract owns no neighboring literals, padding, relocations, or data.

## High-level interface facts

- The public source configuration uses ARM mode for the repository's ARMv6K
  target.
- The accepted function participates in the gym event update path and operates
  on caller-owned object state. Its exact ABI and byte validation are already
  enforced by the shared contract-10 source and validator.
- Other candidate functions and boundaries are not approved for publication.
  A fresh implementer must derive them independently from observable behavior
  and use target comparison only as blind pass/fail feedback.

## Completion blockers

The unit is not complete. The public inventory claims no executable text
outside the accepted function and no module data, neighboring bytes, or
relocations. Completion requires new approved behavioral specifications and
independent implementations for any further code, data, or linkage.

No claim of complete linkage, byte-identical data, or `metadata.complete=true`
is supported by the current public evidence.

## Quarantine note

An earlier revision of this contribution included material too detailed for
`docs/CLEAN_ROOM.md`. Corrective commits remove that specification and every
implementation or validator derived from it. The removed material must not be
used as an implementation reference.
