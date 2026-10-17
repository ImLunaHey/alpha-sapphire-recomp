.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0002A830, "ax", %progbits
.balign 4
.global func_0002A830
.type func_0002A830, %function
func_0002A830:
    and r1, r1, #0xFF
    orr r1, r1, r1, lsl #8
    orr r1, r1, r1, lsl #16
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
.size func_0002A830, . - func_0002A830
