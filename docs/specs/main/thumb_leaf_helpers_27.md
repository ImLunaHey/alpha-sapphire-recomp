# Thumb leaf/helper batch 27

This batch owns the single 88-byte function `func_00100134`. Its clean-room
behavior fetches a singleton slot, allocates and publishes a 32-byte object
when the slot is empty, initializes its fields in the required order,
optionally initializes the final field, and returns the object. A terminal ARM
veneer transfers to the following Thumb entry after the fatal path.

The section deliberately mixes 30 Thumb instructions, three literal words,
and two ARM instructions, with mapping symbols marking each region. Four
symbolic calls use `R_ARM_THM_CALL`; the middle literal alone uses
`R_ARM_ABS32` for an external Thumb secondary entry. Validation pins the
function boundary, state transitions, literal ownership, relocations, and the
88-byte aggregate without publishing target bytes or raw disassembly.
