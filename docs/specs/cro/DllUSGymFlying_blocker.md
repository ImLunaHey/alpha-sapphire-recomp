# DllUSGymFlying publication identity blocker

`cro/DllUSGymFlying` is not a published ByteMatch unit in the repository state
audited below. This analysis-only record documents an assignment identity
mismatch; it is not a behavioral specification, an implementation approval, or
evidence that a target module with this name exists.

## Provenance and method

- Audit date: 2026-10-17, Europe/London (BST, UTC+01:00).
- Repository baseline: `07d03aeab825754cbbbe0b29bdf4243304ac255a` on
  `main`.
- Intended target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe,
  revision 2), as declared by the repository documentation. The target was not
  accessed, executed, or independently verified during this audit.
- Method: read the clean-room and specification policies, then compare the exact
  requested unit identifier against tracked public repository configuration,
  neutral inventory metadata, the checked-in objdiff report, tracked paths, and
  reachable Git history. Identifier comparisons were case-sensitive where names
  are authoritative and case-insensitive as a secondary spelling check.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, and GNU
  Bash 5.3.9.

The exact identifier was checked in:

- `config/publication-units.json`, the canonical publication allowlist;
- `progress/units/AS_EUR_REV2.cro.json`, the neutral published-unit inventory;
- `config/cro-sources.json`, the authored-source registry;
- `progress/reports/AS_EUR_REV2/report.json`, the checked-in aggregate report;
- tracked repository paths; and
- all reachable local Git history.

No ROM, extracted asset, private target byte, proprietary or leaked source,
Nintendo SDK material, generated target object, disassembly, analysis database,
private report, or other implementation-directed target artifact was inspected.
Nothing in this audit was copied from proprietary source.

## Finding

None of the checked publication surfaces contains `cro/DllUSGymFlying`, and no
tracked path or reachable commit contains `DllUSGymFlying`. The repository does
publish the distinct identifier `cro/DllUSGymFlight`; its similar spelling does
not establish an alias, authorize a rename, or transfer that unit's evidence or
ByteMatch credit to the requested name.

At the audited baseline, the aggregate report contains 146 units, 416,672 of
3,719,620 matched code bytes, and 4,255 of 14,840 matched functions. There is no
entry for `cro/DllUSGymFlying`. This documentation change does not alter those
values.

## Roles and stop condition

This audit was performed by one coordinator using only tracked public material.
No separately assigned analyst established the requested unit identity or
observed target behavior, no independent reviewer approved a behavioral
specification, and no target-blind implementer received a reviewed handoff. The
work therefore records a stop condition only and claims no strict clean-room
implementation progress.

There is no defensible unit-scoped implementation, source registration, symbol
inventory, or ByteMatch credit change for `cro/DllUSGymFlying`. Creating any of
them would invent a target identity and violate the repository's evidence gate.

Before further work, the assignment owner must identify an exact unit already
present in the publication allowlist, or a distinct analysis contributor must
provide lawful provenance establishing a new unit identity for this target
revision. A new identity would then require the repository's normal independent
review, neutral inventory, publication configuration, and behavioral
specification process before a separate implementer could write source. This
record supplies none of those approvals.
