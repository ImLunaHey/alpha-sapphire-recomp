.syntax unified
.arch armv6k
.arm

.macro LEAF_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro LEAF_END name
    bx lr
.size \name, . - \name
.endm

LEAF_BEGIN func_000209B8
    mov r1, #1
    strb r1, [r0, #0x28]
LEAF_END func_000209B8

LEAF_BEGIN func_0002EABC
    str r1, [r0, #0x1C]
    strb r2, [r0, #0x20]
    strb r3, [r0, #0x21]
LEAF_END func_0002EABC

LEAF_BEGIN func_0003501C
    sub r0, r0, #1
    cmp r0, #4
    movcc r0, #1
    movcs r0, #0
LEAF_END func_0003501C

LEAF_BEGIN func_000395D4
    mov r2, #1
    str r1, [r0, #0x1E4]
    strb r2, [r0, #0x1E0]
LEAF_END func_000395D4

LEAF_BEGIN func_0003B5C4
    mov r1, #0
    strb r1, [r0, #0x4E0]
LEAF_END func_0003B5C4

LEAF_BEGIN func_0006B744
    ldr r0, [r0, #0x430]
    cmp r0, #0
    movne r0, #1
LEAF_END func_0006B744

LEAF_BEGIN func_0007042C
    ldr r0, [r0, #0x24]
    cmp r0, #0
    addne r0, r0, #4
LEAF_END func_0007042C

LEAF_BEGIN func_00070CC4
    ldr r0, [r0, #0x24]
    cmp r0, #0
    ldrne r0, [r0, #4]
    strne r1, [r0, #0x94]
LEAF_END func_00070CC4

LEAF_BEGIN func_00078028
    ldr r0, [r0, #4]
    cmp r0, #0
    movne r0, #1
LEAF_END func_00078028

LEAF_BEGIN func_00081B68
    ldrh r0, [r0, #8]
    and r0, r0, #0xFF
LEAF_END func_00081B68

LEAF_BEGIN func_00082DBC
    ldrb r0, [r0, #0x20]
    mov r2, #1
    str r0, [r1, #4]
    str r2, [r1]
LEAF_END func_00082DBC

LEAF_BEGIN func_00089720
    ldrb r0, [r0, #0x119]
    cmp r0, #0
    movne r0, #1
LEAF_END func_00089720

LEAF_BEGIN func_0008B4B4
    ldrh r0, [r0, #8]
    and r0, r0, #0xFF
LEAF_END func_0008B4B4

LEAF_BEGIN func_0008BE50
    ldr r0, [r0, #0x60]
    ldr r0, [r0, #0x1C]
    ldr r0, [r0, #0x20]
LEAF_END func_0008BE50

LEAF_BEGIN func_00090350
    ldrb r0, [r0, #0x23C]
    cmp r0, #7
    moveq r0, #0
    movne r0, #1
LEAF_END func_00090350

LEAF_BEGIN func_0009F3E4
    ldr r1, [r0, #0xAB0]
    mov r2, #0
    strb r2, [r0, #0xABA]
    str r1, [r0, #0xAA4]
LEAF_END func_0009F3E4

LEAF_BEGIN func_0009F58C
    ldr r1, [r0, #0xAA4]
    mov r2, #1
    strb r2, [r0, #0xABA]
    str r1, [r0, #0xAB0]
LEAF_END func_0009F58C

LEAF_BEGIN func_000D9C78
    ldr r0, [r0, #0x1C]
    ldr r0, [r0, #0x0C]
LEAF_END func_000D9C78

LEAF_BEGIN func_000D9C84
    ldr r0, [r0, #0x1C]
    ldr r0, [r0, #0x14]
LEAF_END func_000D9C84

LEAF_BEGIN func_000D9D18
    ldrb r0, [r0, #0x28]
    cmp r0, #5
    moveq r0, #1
    movne r0, #0
LEAF_END func_000D9D18

LEAF_BEGIN func_000E5C38
    ldrh r0, [r0, #0xDC]
    cmp r0, #4
    moveq r0, #1
    movne r0, #0
LEAF_END func_000E5C38
