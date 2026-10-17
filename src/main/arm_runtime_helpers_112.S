.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001767B4, "ax", %progbits
.balign 4
.global func_001767B4
.type func_001767B4, %function
func_001767B4:
    ldr r1, [r0, #60]
    add r0, r0, r1
    bx lr
.size func_001767B4, . - func_001767B4

.section .text.func_001870E4, "ax", %progbits
.balign 4
.global func_001870E4
.type func_001870E4, %function
func_001870E4:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    str r1, [r0, #12]
    str r1, [r0, #16]
    str r1, [r0, #20]
    strb r1, [r0, #17]
    bx lr
.size func_001870E4, . - func_001870E4

.section .note.GNU-stack, "", %progbits
