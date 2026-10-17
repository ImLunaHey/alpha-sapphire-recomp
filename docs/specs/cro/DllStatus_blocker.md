# DllStatus clean-room evidence blocker

## Scope and provenance

- Role: specification review only, scoped to `cro/DllStatus`.
- Review date: 2026-10-17.
- Public repository baseline: `d0b633a097ca1d1686bc979aa8e5705ca2bfc9f3`.
- Target revision: `AS_EUR_REV2`, confirmed from committed provenance metadata;
  this review made no new target observation.
- Review tools: Git 2.53.0, Node.js v24.21.0, ripgrep 15.2.0, and
  GitHub public search.

The reviewer read the complete [clean-room protocol](../../CLEAN_ROOM.md)
before assessing the evidence available to an independent implementation role.
No implementation was authored as part of this review.

Admitted evidence consists of the repository's clean-room and specification
guidance, public project provenance, unit/publication documentation, and
repository metadata establishing the unit's registered scope. No ROM,
extracted artifact, proprietary or leaked source, private target path, target
disassembly, copied bytes, or target-derived implementation aid was used.
Existing implementation contents and match claims were not treated as
behavioral evidence.

## Public-source search record

At `2026-10-17T22:21:34+01:00`, the reviewer queried GitHub's public search
service through its authenticated public REST endpoint. The corresponding
browser URLs and exact queries were:

- [`"DllStatus" "Alpha Sapphire"`](https://github.com/search?q=%22DllStatus%22+%22Alpha+Sapphire%22&type=code)
  in public code;
- [`"DllStatus.cro" pokemon`](https://github.com/search?q=%22DllStatus.cro%22+pokemon&type=code)
  in public code; and
- [`pokemon alpha sapphire decompilation`](https://github.com/search?q=pokemon+alpha+sapphire+decompilation&type=repositories)
  in public repositories.

The first and third queries returned no results. The second returned only an
unrelated binary-checksum inventory, which was excluded without using its
contents. No query produced public source code, behavioral documentation, a
callable interface, or independently reproducible observations for this unit.
GitHub search is index-dependent and cannot prove that no public evidence
exists; it establishes only that these recorded queries supplied none for this
review.

## Decision

The repository records a pre-existing partial claim for this unit. This review
does not reproduce, independently validate, renew, enumerate, or extend that
claim.

**Blocked: the admitted evidence does not support an independent clean-room
implementation or any additional match credit.** It provides no approved
unit-specific contract for callable interfaces, parameter meanings and valid
domains, observable results, state transitions, side effects, dependency
behavior, ownership and lifetime rules, failure cases, data semantics, or
complete-link ownership.

Structural metadata, generic ABI facts, and an existing match result cannot
supply those missing semantics. Accordingly, this review authorizes no source,
registry, validator, report, or progress change.

## Evidence required next

A separate analyst must produce an independently attributable neutral behavior
specification with target revision, observation date, tools and versions,
reproducible permitted observations or cited public sources, and testable
behavior covering the missing contracts above. Data or complete-link work also
requires supported data meaning, initialization and lifetime rules, and
dependency, import/export, and relocation ownership contracts.

Only after independent review and approval may a distinct target-blind
implementer work from that specification. Any later equivalence claim requires
authorized verification with the applicable external inputs and attributable
tool results. This document is a qualitative blocker, not a behavior
specification or an equivalence claim.
