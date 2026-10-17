# DllPssRuleSelect specification review blocker

## Scope and provenance

- Role: specification review only, scoped to `cro/DllPssRuleSelect`.
- Review date: 2026-10-17.
- Exact repository baseline: `d35ca78d30e12985bcdd12105d8391d6a7e42543`.
- Target identifier: `AS_EUR_REV2`, confirmed from committed metadata;
  this review makes no new target observation.
- Review tools: Git 2.53.0, Node.js v24.21.0, ripgrep 15.2.0.

The reviewer read the complete [clean-room protocol](../../CLEAN_ROOM.md)
before reviewing the supplied neutral analysis handoff. This reviewer did
not perform that analysis and has not authored implementation. The handoff
identifies the same baseline, target identifier, and analysis date. Its
reported check outcomes are analyst statements, not verification performed
by this reviewer.

Admitted repository evidence consists of `docs/specs/README.md`,
`CONTRIBUTING.md`, `docs/PROVENANCE.md`, `docs/CRO_UNITS.md`,
`docs/CRO_TARGET_OBJECTS.md`, the existing approved shared specification,
and public repository metadata sufficient to confirm the unit's registered
scope and prior published claim. Existing unit blocker documents supplied
documentation conventions only. Package scripts and
`scripts/check-no-rom.sh` were reviewed to select a focused safety check.

No external public source was consulted and no target behavior was observed.
No disassembly, proprietary artifact, ignored verification input, or
quarantined history was inspected. Existing implementation contents were not
used as evidence. No behavior was inferred from names, layouts, hashes, or
similarity to another unit.

## Existing claim and review decision

The repository records a prior partial claim for this unit. This review does
not re-derive, independently validate, renew, enumerate, or extend that
claim. The admitted evidence supplies no approved unit-specific behavioral,
data, or link contract for additional work.

**Blocked: no implementation-grade behavioral specification can be approved
from the admitted evidence.** The handoff supplies no independently observed
parameter meanings, valid domains, results, state effects, dependency
behavior, lifetime rules, failure cases, signatures, or unit-specific
calling contracts. The reviewed repository evidence does not fill those
gaps. Generic target-wrapper ABI metadata cannot establish a callable
unit-specific interface. No source-level specification establishes ownership
or meaning for remaining data or the dependencies and relocation ownership
needed for a complete link.

Consequently, no new behavior, data, or link contract is approved. A passing
structural or safety check cannot supply the missing behavioral evidence or
establish deterministic code/data/link equivalence. This is a conclusive
blocker for the evidence reviewed, not a claim that future permitted
observations could never resolve it.

## Evidence required next

A separate analyst must provide an independently attributable neutral
specification for review, with the applicable target revision, observation
date, tools and versions, and reproducible observations or cited public
sources. For each proposed function it must establish the callable signature
and calling convention, parameter meanings and valid domains, observable
results, state transitions and side effects, dependency contracts,
ownership/lifetime rules, and failure and boundary cases. It must include
enough permitted observations to define testable expected behavior.

Any proposed data or complete-link work additionally needs independently
supported source-level data meaning and ownership, initialization and
lifetime rules, and import/export, dependency, and relocation ownership
contracts. Target implementation details, proprietary payloads, structural
resemblance, and quarantined history are not substitutes for this evidence.

Only after specification approval may a distinct implementer work from that
approved handoff. Any later equivalence claim requires genuine verification
with the applicable external inputs and attributable tool results; this
document supplies no such result.

This review authorizes no implementation, validator, or new equivalence
claim. It changes no source, registry, or progress report. This document is a
unit evidence blocker, not an approved behavioral specification.
