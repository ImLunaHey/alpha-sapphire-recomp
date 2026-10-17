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

POD_BEGIN func_0006482C
    ldr r2, [r1]
    str r2, [r0]
    ldrh r3, [r1, #4]
    strh r3, [r0, #4]
    bx lr
POD_END func_0006482C

POD_BEGIN func_00064840
    ldr r2, [r1]
    str r2, [r0]
    ldrb r3, [r1, #4]
    strb r3, [r0, #4]
    bx lr
POD_END func_00064840

POD_BEGIN func_00077720
    mov r1, #0
    str r1, [r0]
    strh r1, [r0, #4]
    bx lr
POD_END func_00077720

POD_BEGIN func_0007A7CC
    ldr r2, [r1]
    ldr r3, [r1, #4]
    str r2, [r0]
    str r3, [r0, #4]
    bx lr
POD_END func_0007A7CC

POD_BEGIN func_000D3230
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
POD_END func_000D3230

POD_BEGIN func_000D3244
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    bx lr
POD_END func_000D3244

POD_BEGIN func_000D3258
    mov r1, #0
    str r1, [r0]
    strb r1, [r0, #4]
    bx lr
POD_END func_000D3258
