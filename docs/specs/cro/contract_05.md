# CRO contract 05

This clean-room batch covers seven independently specified ARM functions in
six CRO units. A private-target analyst supplied only neutral function
boundaries and semantic operation schedules. A separate implementation agent,
without access to the ROM, private target objects, target disassembly, or the
private report, authored the six active `contract_05.S` sources from that
contract.

The active batch totals 392 executable bytes and 98 ARM instructions. A
provenance-quarantined unit formerly included in this batch is not endorsed by
this contract and carries no active source or match credit.

`scripts/validate-cro-contract-05.mjs` pins the exact public unit/function
inventory, boundaries, instruction schedules, section and symbol ownership,
three resolved local branches, and the absence of relocations, calls, literal
pools, PC-relative data, and adjacent owned bytes. Authoritative objdiff
comparison credits all seven active functions and all 392 bytes exactly. It grants no
CRO data or completed-unit credit; even the three modules whose accepted
function inventories are fully matched remain explicitly incomplete because
their data and unclassified payload are not linked.
