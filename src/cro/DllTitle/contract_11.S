.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0001C3C8, "ax", %progbits
.balign 4
.global func_0001C3C8
.type func_0001C3C8, %function
func_0001C3C8:
    ldr r0, [pc, #0xC]
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
.size func_0001C3C8, . - func_0001C3C8
