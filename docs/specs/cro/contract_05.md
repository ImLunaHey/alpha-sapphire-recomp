# CRO contract 05

This clean-room batch covers eight independently specified ARM functions in
seven CRO units. A private-target analyst supplied only neutral function
boundaries and semantic operation schedules. A separate implementation agent,
without access to the ROM, private target objects, target disassembly, or the
private report, authored the seven `contract_05.S` sources from that contract.

The batch contains three eight-byte field setters in DllBattleHouseConnect,
DllTestPGL, and DllTrainingAppManager; two structured copy/constructor helpers
in DllUSAreaFriendShip; and one POD or numeric helper in each of
DllPoke3Select, DllKawaigariArrange, and DllSparring. These eight functions
total 460 executable bytes and 115 ARM instructions.

`scripts/validate-cro-contract-05.mjs` pins the exact public unit/function
inventory, boundaries, instruction schedules, section and symbol ownership,
three resolved local branches, and the absence of relocations, calls, literal
pools, and PC-relative data in the original contract bodies. DllTestPGL also
builds a separately specified 20-byte non-function dispatcher prefix; the
validator permits exactly that section while rejecting other adjacent bytes.
Authoritative objdiff
comparison credits all eight functions and all 460 bytes exactly. It grants no
CRO data or completed-unit credit; even the three modules whose accepted
function inventories are fully matched remain explicitly incomplete because
their data and unclassified payload are not linked.
