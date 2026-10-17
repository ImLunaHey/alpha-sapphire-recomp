# CRO contract 07

This clean-room batch adds ten independently specified ARM leaf functions to
two existing CRO units. Four functions belong to DllKawaigari and six belong
to DllSangoZukan. The functions cover small pointer initialization, fixed-size
and sign normalization, equality and state tests, indexed loads, and pointer
chases. Together they account for 156 executable bytes and 39 ARM
instructions.

`scripts/validate-cro-contract-07.mjs` pins the proposal and its disjoint merge
into the public source manifest, every public function boundary, the exact
instruction schedules, source/section/symbol ownership, and the absence of
relocations, data, literal pools, and adjacent owned bytes. Authoritative
objdiff comparison credits all ten functions and all 156 bytes exactly.

The batch claims no CRO data and does not complete either unit. Both modules
retain many unmatched accepted functions and unclassified payload beyond the
ten sections owned here.
