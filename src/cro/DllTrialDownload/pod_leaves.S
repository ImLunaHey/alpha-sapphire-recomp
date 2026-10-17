.syntax unified
.arch armv6k
.arm

.section .text.func_00006F28, "ax", %progbits
.balign 4
.global func_00006F28
.type func_00006F28, %function
func_00006F28:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
.size func_00006F28, . - func_00006F28
