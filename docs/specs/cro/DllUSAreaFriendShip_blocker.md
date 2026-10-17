# DllUSAreaFriendShip clean-room evidence blocker

## Scope and provenance

- Role: specification review only, scoped to `cro/DllUSAreaFriendShip`.
- Review date: 2026-10-17.
- Public repository baseline: `7c52f1651ca3f782fd48c7866491c82387660d12`.
- Target revision: `AS_EUR_REV2`, confirmed from committed provenance metadata;
  this review made no new target observation.
- Review tools: Git 2.53.0, Node.js v24.21.0, ripgrep 15.2.0, GitHub
  CLI 2.102.0, and public web search.

The reviewer read the complete [clean-room protocol](../../CLEAN_ROOM.md)
before assessing the evidence available to an independent implementation role.
No implementation was authored as part of this review.

Admitted evidence consists of the repository's clean-room and specification
guidance, public project provenance, unit/publication documentation, neutral
function-boundary metadata, and public search results. No ROM, extracted
artifact, proprietary or leaked source, private target path, target
disassembly, copied bytes, or target-derived implementation aid was used.
Existing implementation contents, exact instruction schedules, and match
claims were not treated as behavioral evidence.

## Public-source search record

At `2026-10-17T23:15:31+01:00`, the reviewer queried GitHub's authenticated
public code-search endpoint. The corresponding browser URLs and exact queries
were:

- [`"DllUSAreaFriendShip" "Alpha Sapphire"`](https://github.com/search?q=%22DllUSAreaFriendShip%22+%22Alpha+Sapphire%22&type=code);
- [`"DllUSAreaFriendShip.cro" pokemon`](https://github.com/search?q=%22DllUSAreaFriendShip.cro%22+pokemon&type=code); and
- [`"DllUSAreaFriendShip"`](https://github.com/search?q=%22DllUSAreaFriendShip%22&type=code).

The first two queries returned zero results. The third returned seven results,
all from this repository and therefore not independent evidence. GitHub
reported each search complete, but its index cannot prove that no public
evidence exists.

A separate public web search for the same identifiers found no unit-specific
result. Nintendo's public [*Pokémon Alpha Sapphire* electronic
manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/manual-3DS-pokemon-alpha-sapphire-version-en?_a=DATC1RAAZAA0)
describes the Player Search System and the user-visible friend list at a
product level, but it does not identify this CRO, associate the CRO with that
feature, or specify any callable interface or behavior. General public
descriptions of Pokémon friendship mechanics likewise do not establish a
relationship to this unit. These materials cannot support a unit contract.

## Existing accounting

The committed baseline report has SHA-256
`fa8b3f300eaba7ba1f49c9e5e61b4803ea8ed30b36f551853111a4d50373c0b1`.
It records six functions and 1,992 accounted code bytes for this unit, with two
functions and 144 bytes matched (33.333336% of functions and 7.228915% of
code). It records 6,268 data bytes and does not mark the unit complete.

Those figures are pre-existing accounting, not results produced or
independently verified by this review. This review makes no source, registry,
validator, report, or progress change, so its exact byte, function, data, and
completed-unit deltas are all zero.

## Decision

**Blocked: the admitted evidence does not support an independent clean-room
implementation or any additional match credit.** It provides no approved
unit-specific contract for callable interfaces, parameter meanings and valid
domains, observable results, state transitions, side effects, dependency
behavior, ownership and lifetime rules, failure cases, data semantics, or
complete-link ownership.

The shared contract document says that a private-target analyst supplied
operation schedules and that a separate target-blind agent implemented them,
but it does not identify attributable role artifacts or record the analyst's
observation date and tools. This review therefore neither renews nor withdraws
the existing claim; it only declines to use that claim as evidence for more
work.

## Evidence required next

A separate analyst must produce an independently attributable neutral behavior
specification with target revision, observation date, tools and versions,
reproducible permitted observations or cited public sources, and testable
behavior covering the missing contracts above. The role handoff must identify
the approved analyst artifact without including target code, copied
instructions, disassembly, or binary-derived tables. Data or complete-link work
also requires supported data meaning, initialization and lifetime rules, and
dependency, import/export, and relocation ownership contracts.

Only after independent review and approval may a distinct target-blind
implementer work from that specification. Any later equivalence claim requires
authorized verification with the applicable external inputs and attributable
tool results. This document is a qualitative blocker, not a behavior
specification or an equivalence claim.
