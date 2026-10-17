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

POD_BEGIN func_0001EDEC
    mov r1, #0
    strb r1, [r0]
    str r1, [r0, #4]
    bx lr
POD_END func_0001EDEC

POD_BEGIN func_0007AD9C
    ldr r2, [r1]
    str r2, [r0]
    ldrh r3, [r1, #4]
    strh r3, [r0, #4]
    bx lr
POD_END func_0007AD9C

POD_BEGIN func_0009138C
    ldr r2, [r1]
    str r2, [r0]
    ldrb r3, [r1, #4]
    strb r3, [r0, #4]
    bx lr
POD_END func_0009138C

POD_BEGIN func_000929A4
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
POD_END func_000929A4

POD_BEGIN func_000EA4C8
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
POD_END func_000EA4C8
