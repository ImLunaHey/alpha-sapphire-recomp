# DllUSPassage provenance blocker

This analysis-only record audits the public evidence for `cro/DllUSPassage`.
It is not a behavioral specification, implementation handoff, equivalence
review, or completion claim.

## Scope and provenance

- Review date: 2026-10-18.
- Public repository baseline:
  `294985cc40908afba5c0dc034a5e0722a97cc1b7`.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not independently inspected, executed, extracted, or compared in this
  review.
- Role: Luna, acting as the analysis-side public-evidence auditor and
  quarantine coordinator. No replacement implementation was authored.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, and GNU
  Bash 5.3.9.
- Method: read the [clean-room protocol](../../CLEAN_ROOM.md),
  [specification policy](../README.md), public provenance, CRO publication
  documentation, neutral inventory and partition metadata, source-claim
  registry, tracked report, and relevant Git history. The implementation file
  was not read or treated as evidence.

No ROM, extracted CRO, private target object, proprietary or leaked source,
Nintendo SDK material, disassembly, analysis database, private comparison
output, generated target content, or target-derived implementation aid was
consulted. Nothing in this audit was copied from proprietary source.

## Public evidence audit

The neutral public inventory identifies a 20,480-byte module and records two
provisional ARM function boundaries totaling 1,304 accepted code bytes. Its
partition metadata accounts for the remaining tracked text as executable
gaps, pools, and unknown ranges. These identity and structural facts do not
establish behavior or implementation provenance.

Before this quarantine, the source registry claimed `func_000019F4` through
the shared CRO contract 10, and the published report credited one of two
accepted functions and 488 of 1,304 code bytes (37.423313%). It credited no
data out of 2,040 bytes and kept `metadata.complete` false. The report snapshot
reviewed for this audit had SHA-256
`fa8b3f300eaba7ba1f49c9e5e61b4803ea8ed30b36f551853111a4d50373c0b1`.

Repository history shows that the claim entered in aggregate commit
`08e23b527903b9f3c964f0559b7027d4a32d9712`. The shared contract records a
function identity, broad semantic label, assembly ownership, and private byte
comparison. No unit-specific, independently attributable analyst handoff was
found that defines the callable interface, valid initial state, inputs,
outputs, state changes, side effects, collaborators, ownership or lifetime
rules, error behavior, or repeatable external observations. Exact comparison
and a descriptive label cannot substitute for that missing specification.

The earlier blocker at
`accb6f77b2605de4aed3fd90a7609be615e8b6ed` correctly stopped additional work,
but deliberately left the historical credit unchanged. The repository's later
provenance-quarantine practice requires unsupported authored claims to fail
closed. This audit therefore withdraws the source registration, implementation
file, and published match credit without alleging copying or invalidating the
neutral inventory.

## Quarantine result and required handoff

The unit now publishes zero matched code bytes, zero matched functions, and
zero matched data, with `metadata.complete: false` and no authored source path.
Both accepted function identities and all neutral partition accounting remain
available as structural inventory. No new match, target comparison, or
behavioral conclusion is claimed.

Further implementation requires a distinct analyst to produce an independently
attributable, unit-specific behavioral and interface specification. It must
record the observer, target revision, date, tools and versions, initial
conditions, stimuli, externally observable results, boundary and failure
cases, repeatability, and uncertainties. It must exclude target bytes,
physical instruction schedules, disassembly, relocation-derived implementation
guidance, and proprietary material.

Only after independent review may a different, target-blind contributor write
original code from that specification. Any later match or complete-unit claim
must pass the repository's deterministic publication gates. Until then,
`metadata.complete` must remain false and no DllUSPassage source or credit may
be restored.
