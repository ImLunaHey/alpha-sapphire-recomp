# DllUSGymFairy publication identity blocker

`cro/DllUSGymFairy` is not a published ByteMatch unit in the repository state
audited below. This analysis-only record documents an assignment identity
mismatch; it is not a behavioral specification, an implementation approval, or
evidence that a target module with this name exists.

## Provenance and method

- Audit date: 2026-10-17, Europe/London (BST, UTC+01:00).
- Repository baseline: `006dd995c04d619025ee19bb4410011320d96eb2`.
- Intended target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe,
  revision 2), as declared by the repository documentation. The target was not
  accessed, executed, or independently verified during this audit.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, and GNU
  Bash 5.3.9.
- Method: read the clean-room and specification policies, then compare the exact
  requested unit identifier against tracked public repository configuration,
  neutral inventory metadata, the checked-in objdiff report, tracked paths, and
  Git history. The comparison was case-sensitive where identifiers are
  authoritative and case-insensitive as a secondary search for spelling variants.

The exact identifier was checked in:

- `config/publication-units.json`, the canonical publication allowlist;
- `progress/units/AS_EUR_REV2.cro.json`, the neutral published-unit inventory;
- `config/cro-sources.json`, the authored-source registry;
- `progress/reports/AS_EUR_REV2/report.json`, the checked-in aggregate report;
- tracked paths and all reachable local Git history.

No ROM, extracted asset, private target byte, proprietary or leaked source,
Nintendo SDK material, generated target object, disassembly, analysis database,
private report, or other implementation-directed target artifact was inspected.
Nothing in this audit was copied from proprietary source.

## Finding

None of the checked publication surfaces contains `cro/DllUSGymFairy`, and no
tracked path or reachable commit contains `DllUSGymFairy`. The six published
units sharing the `cro/DllUSGym` prefix are:

- `cro/DllUSGymElec`
- `cro/DllUSGymEsper`
- `cro/DllUSGymFighting`
- `cro/DllUSGymFire`
- `cro/DllUSGymFlight`
- `cro/DllUSGymWater`

Those names are distinct unit identities. Their proximity does not support
renaming one, treating one as an alias, transferring evidence or credit, or
inferring that a Fairy unit was omitted. This audit makes no new claim about any
of those six units.

At the audited baseline, the aggregate report contains 146 units, 416,672 of
3,719,620 matched code bytes, 4,255 of 14,840 matched functions, and no entry for
the requested name. This documentation change does not alter those values.

## Stop condition and required handoff

There is no defensible unit-scoped implementation, source registration, symbol
inventory, or ByteMatch credit change for `cro/DllUSGymFairy`. Creating any of
them would invent a target identity and violate the repository's evidence gate.

Before further work, the assignment owner must identify an exact unit already
present in the publication allowlist, or a distinct analysis contributor must
provide lawful provenance establishing a new unit identity for this target
revision. A new identity would then require the repository's normal independent
review, neutral inventory, publication configuration, and behavioral
specification process before a separate implementer could write source. This
record supplies none of those approvals.
