.syntax unified
.arch armv6k
.arm

.section .text.func_00001EC0, "ax", %progbits
.balign 4
.global func_00001EC0
.type func_00001EC0, %function
func_00001EC0:
    ldr r2, [r1]
    str r2, [r0]
    ldrh r3, [r1, #4]
    strh r3, [r0, #4]
    bx lr
.size func_00001EC0, . - func_00001EC0
