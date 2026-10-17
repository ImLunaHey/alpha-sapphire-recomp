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

POD_BEGIN func_00010678
    mov r1, #0
    str r1, [r0]
    strh r1, [r0, #4]
    bx lr
POD_END func_00010678

POD_BEGIN func_00010688
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
POD_END func_00010688

POD_BEGIN func_00010698
    ldr r2, [r1]
    str r2, [r0]
    ldrh r3, [r1, #4]
    strh r3, [r0, #4]
    bx lr
POD_END func_00010698
