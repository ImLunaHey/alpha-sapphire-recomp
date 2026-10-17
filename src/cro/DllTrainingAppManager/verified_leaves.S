.syntax unified
.arch armv6k
.fpu vfp
.arm

// These leaf routines have identical published range hashes.  Their complete
// behavior and boundaries are specified in docs/specs/cro/DllTrainingAppManager.
.macro RETURN_ONE name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    mov r0, #1
    bx lr
.size \name, . - \name
.endm

RETURN_ONE func_00000140
RETURN_ONE func_000005A0
RETURN_ONE func_000008E8
RETURN_ONE func_000008F0
RETURN_ONE func_00000BEC

.section .text.func_00000B74, "ax", %progbits
.balign 4
.global func_00000B74
.type func_00000B74, %function
func_00000B74:
    bx lr
.size func_00000B74, . - func_00000B74
