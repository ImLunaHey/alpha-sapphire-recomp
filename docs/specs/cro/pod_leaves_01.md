# CRO POD leaves 01

After the DllGift, [DllGts](DllGts.md), `DllPokeList`, and
[`DllTradelist`](DllTradelist_blocker.md) quarantines, this batch retains the
remaining supported ARM POD leaves.
The reviewed behaviors initialize or copy small plain-data records composed of
words plus optional byte or halfword tails. The nine semantic forms cover
zeroing one to three words, zeroing word/byte/halfword combinations, and
copying one or two words with optional byte or halfword tails.

All leaves return directly, use no calls or relocations, and own only their
accepted function sections. Validation pins the unit and boundary of every
claim and its semantic form. The quarantined `DllGift`, `DllGts`, `DllPokeList`, and
[`DllTradelist`](DllTradelist_blocker.md) claims are excluded and must remain
absent. Unclaimed code and all CRO data remain unmatched; every participating
unit remains incomplete. See `DllPokeList_blocker.md` for the unit-specific
provenance finding.
