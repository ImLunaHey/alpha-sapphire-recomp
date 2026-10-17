# DllNuts clean-room implementation blocker

## Scope and provenance

This implementation-role note covers only `cro/DllNuts` for Pokémon Alpha
Sapphire `AS_EUR_REV2`. It records a process review of the public repository at
base commit `26e6883b388d2f5042a409f6b6b008e44a8ec80c` on 2026-10-17.

This note contains no target behavior, implementation detail, binary-derived
layout, or match claim. It adds no implementation, behavior specification,
match credit, data reconstruction, or completion claim. The repository-wide
publication-integrity gate remains responsible for publication validation; a
bespoke DllNuts validator is not warranted for this documentation-only change.

## Blocker and exit criteria

No independently authored, approved behavior specification is available for
DllNuts behavior that remains unimplemented. Without such a specification, an
implementation role has no clean-room basis for the required inputs, outputs,
state transitions, side effects, or external-call contracts. Implementation is
therefore blocked rather than inferred from target-derived guidance.

A separate analysis role must first publish a neutral behavior specification
with provenance, observations, uncertainties, and the target revision. A
distinct implementation role may then write original code using only that
approved specification and public platform documentation. Any future match
claim must be built deterministically and proven byte-identical through objdiff
and the published report.

This decision follows the role separation and stop conditions in
`docs/CLEAN_ROOM.md`.
