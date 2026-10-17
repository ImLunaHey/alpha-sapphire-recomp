.syntax unified
.arch armv6k
.arm

.section .text.func_0001C208, "ax", %progbits
.balign 4
.global func_0001C208
.type func_0001C208, %function
func_0001C208:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
.size func_0001C208, . - func_0001C208
