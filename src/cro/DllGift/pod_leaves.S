.syntax unified
.arch armv6k
.arm

.section .text.func_00004C1C, "ax", %progbits
.balign 4
.global func_00004C1C
.type func_00004C1C, %function
func_00004C1C:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
.size func_00004C1C, . - func_00004C1C
