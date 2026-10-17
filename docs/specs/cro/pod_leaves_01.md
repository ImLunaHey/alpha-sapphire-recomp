# CRO POD leaves 01

This batch covers 26 ARM leaves totaling 488 code bytes across 12 CRO units.
The reviewed behaviors initialize or copy small plain-data records composed of
words plus optional byte or halfword tails. The nine semantic forms cover
zeroing one to three words, zeroing word/byte/halfword combinations, and
copying one or two words with optional byte or halfword tails.

All leaves return directly, use no calls or relocations, and own only their
accepted function sections. Validation pins the unit and boundary of every
claim, its semantic form, 122 instructions in aggregate, and the exact
26-function/488-byte result. The quarantined `DllGift` and
[`DllTradelist`](DllTradelist_blocker.md) claims are excluded and must remain
absent. Unclaimed code and all CRO data remain unmatched; all 12
units remain incomplete.
