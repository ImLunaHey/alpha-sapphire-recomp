# CRO POD leaves 01

This batch covers 29 ARM leaves totaling 548 code bytes across 14 CRO units.
The reviewed behaviors initialize or copy small plain-data records composed of
words plus optional byte or halfword tails. The nine semantic forms cover
zeroing one to three words, zeroing word/byte/halfword combinations, and
copying one or two words with optional byte or halfword tails.

All leaves return directly, use no calls or relocations, and own only their
accepted function sections. Validation pins the unit and boundary of every
claim, its semantic form, 137 instructions in aggregate, and the exact
29-function/548-byte result. Unclaimed code and all CRO data remain unmatched;
all 14 units remain incomplete.
