# DllPoke3Select clean-room quarantine

## Scope and provenance

Analysis-only status for Pokémon Alpha Sapphire, target revision
`AS_EUR_REV2`, unit `cro/DllPoke3Select`, dated **2026-10-17**. This document
does not provide a behavioral contract, authorize implementation, or claim new
match credit.

- Analysis role: independent specification reviewer; no implementation work.
- Reviewed baseline: commit `f6034fcbd092eb50ddea804a68bcaa50d0aef772`.
- Audit tools: Git **2.53.0** and Node.js **v24.21.0**.
- Reviewed evidence: the clean-room policy, tracked-file inventory, commit
  metadata and file statistics, the unit's source-manifest entry, and its
  committed public report record.

No ROM, CRO, extracted asset, private artifact, disassembly, target byte
sequence, instruction schedule, register/offset/relocation ledger, or existing
implementation body was inspected. The existing generic contract document and
assembly source were deliberately not opened and do not support this review.

## Public status

The committed report records 23 accepted functions and 9,356 accepted code
bytes for the unit. It credits one 68-byte function, reports 0.72680634% matched
code, and sets `metadata.complete` to `false`. These are historical report
facts, not independently observed behavior and not a whole-unit proof.

## Quarantine finding

Git history shows that commit
`a1ee50288f7bda1ac801775f5fb00a5c6364a8e7` added the generic contract document,
the DllPoke3Select assembly implementation, its source-manifest claim, and its
validator/report update together under one author and committer identity. The
tracked history therefore does not demonstrate the distinct analysis and
implementation roles required by `docs/CLEAN_ROOM.md`.

No unit-specific, independently authored behavioral specification is present
under `docs/specs/cro/`. The allowed metadata establishes only identity,
layout accounting, and historical match status; it does not establish inputs,
outputs, side effects, error behavior, ABI semantics, or data ownership.
Consequently, it is insufficient for an independent implementer to reproduce
even the currently credited function without consulting target-derived aids.

Treat the existing 68-byte claim as provenance-quarantined. Remove the
unsupported DllPoke3Select implementation source from the active build, remove
its source-manifest claim, and regenerate the active report so that it awards
no match credit for that source. Any validator entry that endorses the removed
claim must also cease to treat it as accepted implementation. Preserve the old
68-byte result only as a fact in immutable Git history and in this provenance
record; do not preserve it as active report credit, present it as strict
clean-room work, or use its implementation as evidence for new work. This
review makes no finding that the bytes are incorrect; it finds that the
committed provenance is insufficient for the requested clean-room
classification.

For rejection checks only, the quarantined historical identity is
`func_00002694` at address `0x2694`, size 68, in ARM mode. These identity and
boundary fields are accounting metadata, not behavioral or implementation
evidence, and they do not authorize an active source claim.

This document authorizes only removal of the quarantined claim and fail-closed
verification that the claim remains absent; it authorizes no replacement
implementation or match credit.

## Unblocking requirements

Before implementation, a separate analysis role must produce a reviewed,
unit-specific specification from authorized externally observable behavior and
document the target revision, observation method, tools and versions, and
date. A distinct implementer who has not seen target internals or the existing
implementation must work only from that specification. Exact-head validation
must then prove the complete unit, including code, data, and relocation
behavior, while retaining `metadata.complete=false` until whole-unit identity
is established. Reintroducing any source or match credit requires that new
analysis/specification/implementation chain and fresh deterministic proof; the
quarantined source and its historical match result cannot be grandfathered
back into the active baseline.
