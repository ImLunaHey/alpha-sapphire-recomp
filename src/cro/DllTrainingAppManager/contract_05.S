.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000BE4, "ax", %progbits
.balign 4
.global func_00000BE4
.type func_00000BE4, %function
func_00000BE4:
    strb r1, [r0, #0xD9]
    bx lr
.size func_00000BE4, . - func_00000BE4
