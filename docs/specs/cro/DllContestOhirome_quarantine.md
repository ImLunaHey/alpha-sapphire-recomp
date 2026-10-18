# DllContestOhirome quarantine note

## Current status (2026-10-18)

The earlier quarantine remains in force and none of its material was consulted
or reused. A fresh contribution instead used the explicitly permitted direct
reverse-engineering route in `docs/CLEAN_ROOM.md`. The bounded
`func_00000544` constructor was independently inspected and expressed as
symbolic ARM assembly, then verified byte-for-byte with the pinned toolchain.

Both accepted functions are now matched (340 of 340 accepted bytes). No data,
literal pool, executable gap, or other unclassified range is claimed, so
`metadata.complete` remains `false`. This section supersedes the historical
implementation-status statements below without weakening the quarantine.

The proposed analysis and follow-on implementation in PR #14 were quarantined
on 2026-10-17 because they recorded target-derived physical implementation
details and the same role used those details to produce source. The derived
specification, implementation, validation, inventory, build, and report-credit
changes were removed and must not be reused.

Only the independently reviewed contribution already present on `main` remains.
`cro/DllContestOhirome` is incomplete, and `metadata.complete` must remain
`false`. Further work requires a fresh neutral behavioral specification and a
separate implementer who has not seen the quarantined material, with target
comparison limited to opaque pass/fail as required by
[`docs/CLEAN_ROOM.md`](../../CLEAN_ROOM.md).
