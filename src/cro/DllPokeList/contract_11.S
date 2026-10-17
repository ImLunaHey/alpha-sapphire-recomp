.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000106AC, "ax", %progbits
.balign 4
.global func_000106AC
.type func_000106AC, %function
func_000106AC:
    and r1, r1, #0xFF
    orr r1, r1, r1, lsl #8
    orr r1, r1, r1, lsl #16
    str r1, [r0]
    strh r1, [r0, #4]
    bx lr
.size func_000106AC, . - func_000106AC
