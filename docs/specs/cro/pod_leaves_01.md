# CRO POD leaves 01

After the DllGift, [DllGts](DllGts.md), `DllPokeList`, `DllPorocCase`, and
[`DllTradelist`](DllTradelist_blocker.md) quarantines, this batch retains the
remaining supported ARM POD leaves.
The reviewed behaviors initialize or copy small plain-data records composed of
words plus optional byte or halfword tails. The semantic forms cover zeroing
word-based records and copying word-based records with optional tails.

All leaves return directly, use no calls or relocations, and own only their
accepted function sections. Validation pins the unit and boundary of every
claim and its semantic form. The quarantined `DllGift`, `DllGts`, `DllPokeList`,
`DllPorocCase`, and
[`DllTradelist`](DllTradelist_blocker.md) claims are excluded and must remain
absent. Unclaimed code and all CRO data remain unmatched; every participating
unit remains incomplete. See `DllPokeList_blocker.md` for the unit-specific
provenance finding.

DllPorocCase is likewise withdrawn because its independent provenance is
insufficient. Its source and ownership claims are removed while neutral
inventory and incomplete status remain; see `DllPorocCase_blocker.md`.
