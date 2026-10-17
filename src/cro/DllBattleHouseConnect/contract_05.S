.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000F54, "ax", %progbits
.balign 4
.global func_00000F54
.type func_00000F54, %function
func_00000F54:
    strb r1, [r0, #0xD9]
    bx lr
.size func_00000F54, . - func_00000F54
