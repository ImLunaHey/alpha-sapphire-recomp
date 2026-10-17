# ARM runtime helpers 137

This batch contains two 40-byte ARM accessors at `func_004B2644` and
`func_004B2674`. Each checks two availability bytes, follows the owned pointer,
and returns either zero or a halfword from offset 24 or 26. The functions have
no calls, relocations, literal pools, adjacent data, or external identities.

`config/arm-runtime-helpers-137.json` records the function boundaries, control
flow, memory-operation counts, returns, ownership exclusions, and validation
contract. `src/main/arm_runtime_helpers_137.S` is the reviewed clean-room
implementation. The validator checks the source and object structurally and
then confirms both functions as exact matches against the ignored local target.
No target object, extracted byte stream, or private report is tracked.
