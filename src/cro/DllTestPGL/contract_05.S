.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000000, "ax", %progbits
.balign 4
.global func_00000000
.type func_00000000, %function
func_00000000:
    strb r1, [r0, #0xD9]
    bx lr
.size func_00000000, . - func_00000000
