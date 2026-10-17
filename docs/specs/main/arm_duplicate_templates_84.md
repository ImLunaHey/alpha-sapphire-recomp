# ARM duplicate templates 84

This batch covers 30 independently specified ARM call wrappers totaling 320
executable bytes. The clean-room contract divides them into five reusable
forms: ten direct push-and-call wrappers, eight wrappers preserving `r0`, five
preserving `r0` and `r5`, four preserving `r1`, and three using the wider
`r0`-preserving frame. Each wrapper returns through its callee and introduces
no literal pool or adjacent payload.

The public contract pins 80 ARM instructions and 30 `R_ARM_CALL` relocations,
including each function boundary, template membership, and symbolic callee.
Validation checks source ownership, object structure, relocation identity, and
the exact 30-function/320-byte aggregate without publishing target bytes or
private disassembly.
