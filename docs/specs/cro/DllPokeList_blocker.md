# DllPokeList clean-room blocker

## Scope and provenance

This record covers `cro/DllPokeList` for Pokemon Alpha Sapphire
`AS_EUR_REV2`. The provenance audit was performed on 2026-10-17 against local
`main` revision `b5579407168078336446552a8575a3c3b5ac835f` after reading
`docs/CLEAN_ROOM.md` in full.

The audit used Git 2.53.0, Node.js v24.21.0, and only the repository's
committed clean-room policy, neutral symbol inventory, partition metadata,
source registry, public report, and unit history. `ROM_PATH` and
`DECOMP_PRIVATE` were unset, `objdiff` was unavailable on `PATH`, and no ROM,
CRO, extracted asset, target object, disassembly, proprietary source or
header, private path, instruction schedule, register/offset/relocation ledger,
or target-derived implementation aid was used.

The distinct reviewer was the read-only provenance-audit agent recorded by the
T3 delegated task `dll-poke-list-provenance-audit-r1` (provider `codex`, model
`gpt-6.1-sol`). Its terminal record identifies the reviewed baseline, reviewer
role, repository-only evidence, no-edit disposition, and finding that strict
two-party provenance was not auditable. The reviewer reported that opening an
existing validator unexpectedly exposed embedded instruction schedules; it did
not reproduce or use them as behavioral evidence and opened no target artifact.
That reviewer is not an analyst or implementer for any future replacement.

This is a provenance and publication record, not a behavioral specification.
No implementation was attempted.

## Quarantine finding

The public baseline report credited a small set of provisional implementations
within the unit while leaving its data unmatched. Those implementations entered
through bulk commits `7b14dec86f268f5fc974cfb4e36a8361fd31639f` and
`936c3918c587693a9ed8326aba58b49a43a3a73e`, the latter alongside
implementation-oriented contract material.

Repository history contains no independently attributed, unit-specific
analysis artifact, approved neutral behavioral specification, isolated
implementer handoff, or implementation-role attestation for these functions.
The shared batch documents do not record function-specific observations,
inputs, outputs, side effects, preconditions, edge cases, analyst identity,
tool version, or observation date. Byte identity and short semantic labels do
not establish strict two-party clean-room provenance.

Because provenance is insufficient, all provisional implementations and their
source-registry claims are quarantined rather than rewritten. The neutral CSV
inventory, partition, and public unit manifest remain structural accounting
only; they do not establish behavior. After quarantine the unit receives no
match credit, remains explicitly incomplete, and publishes no authored source
path. The exact accounting remains confined to the machine-readable
publication files and their validators.

## Stop condition

Implementation remains blocked until a separate analysis contributor provides
a reviewed, provenance-bearing neutral behavioral and interface specification
derived without prohibited material. A distinct implementer who has not seen
target internals may then write original source solely from that specification.

Promotion additionally requires a deterministic build, a focused fail-closed
validator, and authoritative byte-identical objdiff/report evidence. The
repository's central publication-integrity gate remains responsible for safe
evidence reads, the fixed unit universe, complete inventory/partition/source
and object evidence, derived function and aggregate measures, and hostile
coordinated-mutation coverage. This quarantine adds no duplicate unit gate.

Those prerequisites are not present, so no replacement source, match credit,
or completion claim is justified.
