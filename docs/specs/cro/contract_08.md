# CRO contract 08

This clean-room batch retains seven independently specified ARM functions in
seven previously uncredited CRO units: DllBattleMatch, DllFriendEntry,
DllNuts, DllPssRuleSelect, DllTrialHouseResult, DllUSAreaWaterSurface, and
DllUSGymFlight. The functions cover compact list, table, wide-arithmetic,
vector-state, and interpolation operations. Together they account for 904
executable bytes and 226 ARM instructions.

`scripts/validate-cro-contract-08.mjs` pins the disjoint proposal and its exact
post-integration form, every public function boundary, instruction schedule,
source/section/symbol ownership, and the absence of relocations, emitted data,
literal pools, and adjacent owned bytes. Authoritative objdiff comparison
credits all seven functions and all 904 bytes exactly. The former
`DllWazaOboe` member is withdrawn under its unit-specific provenance blocker;
no part of its instruction ledger or implementation remains in this contract.

The original batch claims no CRO data and completed no unit. A later documented
direct-reverse-engineering contribution completes DllUSAreaWaterSurface's
accepted two-function denominator while leaving its unclassified payload and
all CRO data unmatched.
