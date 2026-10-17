.syntax unified
.arch armv6k
.arm

.section .text.func_00012C58, "ax", %progbits
.balign 4
.global func_00012C58
.type func_00012C58, %function
func_00012C58:
    mov r1, #0
    str r1, [r0]
    strb r1, [r0, #4]
    bx lr
.size func_00012C58, . - func_00012C58
