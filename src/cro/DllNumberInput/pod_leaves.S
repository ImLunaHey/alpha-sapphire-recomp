.syntax unified
.arch armv6k
.arm

.section .text.func_00001968, "ax", %progbits
.balign 4
.global func_00001968
.type func_00001968, %function
func_00001968:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
.size func_00001968, . - func_00001968
