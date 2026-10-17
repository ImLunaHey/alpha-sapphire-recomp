.syntax unified
.arch armv6k
.arm

.macro POD_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro POD_END name
.size \name, . - \name
.endm

POD_BEGIN func_0000B8B8
    ldr r2, [r1]
    str r2, [r0]
    ldrh r3, [r1, #4]
    strh r3, [r0, #4]
    bx lr
POD_END func_0000B8B8

POD_BEGIN func_0000B8CC
    ldr r2, [r1]
    ldr r3, [r1, #4]
    str r2, [r0]
    str r3, [r0, #4]
    bx lr
POD_END func_0000B8CC
