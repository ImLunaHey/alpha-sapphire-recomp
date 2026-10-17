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

POD_BEGIN func_000021A4
    ldr r2, [r1]
    ldr r3, [r1, #4]
    str r2, [r0]
    str r3, [r0, #4]
    bx lr
POD_END func_000021A4

POD_BEGIN func_000021B8
    ldr r2, [r1]
    str r2, [r0]
    ldrb r3, [r1, #4]
    strb r3, [r0, #4]
    bx lr
POD_END func_000021B8
