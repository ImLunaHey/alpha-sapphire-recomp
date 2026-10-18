# DllFieldEventPokeRideAction quarantine note

## Current status (2026-10-18)

The earlier quarantined artifacts were not consulted or reused. A fresh
contribution used the direct reverse-engineering route permitted by
`docs/CLEAN_ROOM.md` to implement the bounded ride-action resource
initializer as readable symbolic ARM assembly. Its 556-byte section is
byte-identical under the pinned toolchain and has no relocations.

Both accepted functions are now matched (860 of 860 accepted bytes). No
unowned code, data, pools, or unknown ranges are claimed, and
`metadata.complete` remains `false`. This section supersedes the historical
implementation-status statements below while retaining the quarantine record.

The attempted full-unit analysis and follow-on implementation in PR #16 were
quarantined on 2026-10-17 because the analysis recorded restricted
target-derived implementation detail and the same role then used that material
to produce exact source. Those artifacts and all associated ownership, build,
validation, and public-inventory changes were removed.

The repository retains only the previously reviewed contract-09 contribution.
The unit remains incomplete. Further work requires a fresh, independently
produced neutral specification and strict separation between analysis and
implementation roles; no quarantined material may be reused.
