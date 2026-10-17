# CRO contract 06

This clean-room batch covers eight independently specified ARM functions in
eight previously uncredited CRO units. The public contract consists of neutral
function boundaries and semantic operation schedules; the authored assembly is
isolated to one executable section per accepted function.

The batch adds one function each in DllBoxSearch, DllDendouDemo,
DllFieldEventSkatePipe, DllHeading, DllStatus, DllUSR113, DllUSGymElec, and
DllVSDemo. Together they account for 592 executable bytes and 148 ARM
instructions.

`scripts/validate-cro-contract-06.mjs` pins the exact proposal, public
unit/function inventory, boundaries, instruction schedules, section and symbol
ownership, local and direct control-flow encodings, and the absence of
relocations, literal pools, data, and adjacent owned bytes. The private split
target comparison matches all eight functions byte-for-byte. The contract
claims no CRO data and no completed units; all eight modules retain unmatched
functions, data, or unclassified payload.
