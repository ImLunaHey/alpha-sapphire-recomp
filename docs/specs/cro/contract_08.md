# CRO contract 08

This clean-room batch covers eight independently specified ARM functions in
eight previously uncredited CRO units: DllBattleMatch, DllFriendEntry,
DllNuts, DllPssRuleSelect, DllTrialHouseResult, DllUSAreaWaterSurface,
DllUSGymFlight, and DllWazaOboe. The functions cover compact list, table,
wide-arithmetic, vector-state, interpolation, and dispatch operations.
Together they account for 1,052 executable bytes and 263 ARM instructions.

`scripts/validate-cro-contract-08.mjs` pins the disjoint proposal and its exact
post-integration form, every public function boundary, instruction schedule,
source/section/symbol ownership, and the absence of relocations, emitted data,
literal pools, and adjacent owned bytes. Authoritative objdiff comparison
credits all eight functions and all 1,052 bytes exactly.

The batch claims no CRO data and completes no unit. Every module retains
additional unmatched accepted functions as well as unclassified payload.
