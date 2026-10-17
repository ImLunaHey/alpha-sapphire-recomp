.syntax unified
.arch armv6k
.arm

.section .text.func_000079B4, "ax", %progbits
.balign 4
.global func_000079B4
.type func_000079B4, %function
func_000079B4:
    ldr r2, [r1]
    ldr r3, [r1, #4]
    str r2, [r0]
    str r3, [r0, #4]
    bx lr
.size func_000079B4, . - func_000079B4
