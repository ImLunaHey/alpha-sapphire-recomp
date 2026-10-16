.syntax unified
.arch armv6k
.arm

.extern func_001B0468
.extern func_001B6A68
.extern func_001BD068

.macro SIGNED_CODE_NORMALIZE name, refill
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    clz r10, r3
    lsl r3, r3, r10
    add r3, r3, r3
    rsb r9, r10, #32
    lsr r6, r3, r9
    mov r9, #1
    add r6, r6, r9, lsl r10
    tst r6, #1
    rsbne r6, r6, #1
    asr r6, r6, #1
    lsl r3, r3, r10
    sub r2, r2, r10, lsl #1
    subs r2, r2, #1
    movge pc, lr
    b \refill
    .size \name, .-\name
.endm

.macro TABLE_SIGNED_CODE_DISPATCH name, refill
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    lsr r6, r3, #26
    sub r5, pc, #344
    ldrb r5, [r5, r6]
    sub r6, pc, #248
    ldrb r6, [r6, r5]
    lsl r3, r3, r6
    subs r2, r2, r6
    mov r8, lr
    bllt \refill
    sub r6, pc, #312
    ldr r5, [r6, r5, lsl #2]
    mov lr, r8
    add pc, r5, r6
    .size \name, .-\name
.endm

TABLE_SIGNED_CODE_DISPATCH func_001AE6D0, func_001B0468
SIGNED_CODE_NORMALIZE func_001B047C, func_001B0468
TABLE_SIGNED_CODE_DISPATCH func_001B4CD0, func_001B6A68
SIGNED_CODE_NORMALIZE func_001B6A7C, func_001B6A68
TABLE_SIGNED_CODE_DISPATCH func_001BB2D0, func_001BD068
SIGNED_CODE_NORMALIZE func_001BD07C, func_001BD068
