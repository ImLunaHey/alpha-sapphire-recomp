# CRO POD leaves 01

This batch covers 28 ARM leaves totaling 528 code bytes across 13 CRO units.
The reviewed behaviors initialize or copy small plain-data records composed of
words plus optional byte or halfword tails. The nine semantic forms cover
zeroing one to three words, zeroing word/byte/halfword combinations, and
copying one or two words with optional byte or halfword tails.

All leaves return directly, use no calls or relocations, and own only their
accepted function sections. Validation pins the unit and boundary of every
claim, its semantic form, 132 instructions in aggregate, and the exact
28-function/528-byte result. The quarantined `DllGift` claim is excluded and
must remain absent. Unclaimed code and all CRO data remain unmatched; all 13
units remain incomplete.
