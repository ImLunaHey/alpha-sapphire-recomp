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

LEAF_BEGIN func_00015B74
    cmp r0, #2
    cmpne r0, #3
    moveq r0, #1
    movne r0, #0
LEAF_END func_00015B74

LEAF_BEGIN func_0001D5FC
    add r0, r0, #0xC00
    add r0, r0, #0xA4
LEAF_END func_0001D5FC

LEAF_BEGIN func_0001D900
    add r0, r0, #0x4600
    ldrh r0, [r0, #0x74]
LEAF_END func_0001D900

LEAF_BEGIN func_0003AFDC
    mov r1, #0
    str r1, [r0, #0x6BC]
LEAF_END func_0003AFDC

LEAF_BEGIN func_00047B98
    ldr r0, [r0, #0x84C]
    ldrsb r0, [r0, #4]
LEAF_END func_00047B98

LEAF_BEGIN func_0004F18C
    ldr r0, [r0, #4]
    ldr r0, [r0, #0x10]
    ldrb r0, [r0, #6]
LEAF_END func_0004F18C

LEAF_BEGIN func_0004F19C
    ldr r0, [r0, #0x1C]
    ldrb r0, [r0, #1]
LEAF_END func_0004F19C

LEAF_BEGIN func_0004F340
    ldrb r0, [r0, #0x1B]
    and r0, r0, #0x40
    lsr r0, r0, #6
LEAF_END func_0004F340

LEAF_BEGIN func_0004F788
    mov r1, #0
    str r1, [r0, #0x0C]
LEAF_END func_0004F788

LEAF_BEGIN func_0004FBA0
    cmp r0, #2
    cmpne r0, #5
    moveq r0, #1
    movne r0, #0
LEAF_END func_0004FBA0

LEAF_BEGIN func_0004FFC0
    ldr r0, [r0, #4]
    ldr r0, [r0, #0x10]
    ldrb r0, [r0, #0x10]
LEAF_END func_0004FFC0

LEAF_BEGIN func_00050078
    ldr r0, [r0, #0x1C]
    ldrb r0, [r0, #9]
LEAF_END func_00050078

LEAF_BEGIN func_00050268
    cmp r0, #12
    movhs r0, #0
    movlo r0, #1
LEAF_END func_00050268

LEAF_BEGIN func_00050278
    cmp r0, #1
    cmpne r0, #6
    moveq r0, #1
    movne r0, #0
LEAF_END func_00050278

LEAF_BEGIN func_000506C0
    ldr r0, [r0, #0xDB4]
    strb r1, [r0, #4]
LEAF_END func_000506C0

LEAF_BEGIN func_000506CC
    cmp r0, #6
    movlo r0, #1
    movhs r0, #0
LEAF_END func_000506CC

LEAF_BEGIN func_000506DC
    ldr r0, [r0, #4]
    ldr r0, [r0, #0x10]
    ldrb r0, [r0, #1]
LEAF_END func_000506DC

LEAF_BEGIN func_00050788
    cmp r0, #12
    movhs r0, #1
    movlo r0, #0
LEAF_END func_00050788

LEAF_BEGIN func_000507E8
    add r0, r0, #0x1000
    ldrb r0, [r0, #0x93]
    and r0, r0, #1
LEAF_END func_000507E8

LEAF_BEGIN func_00050A40
    add r0, r0, #0x100
    ldrh r0, [r0, #0x62]
LEAF_END func_00050A40

LEAF_BEGIN func_00050B78
    mov r1, #1
    orr r0, r1, r0, lsl #9
LEAF_END func_00050B78

LEAF_BEGIN func_00050EC8
    mov r1, #6
    strb r1, [r0, #0x10]
LEAF_END func_00050EC8

LEAF_BEGIN func_00050ED4
    add r0, r0, #0x1000
    ldr r0, [r0, #0x80]
    cmp r0, #0
    movne r0, #1
LEAF_END func_00050ED4

LEAF_BEGIN func_00050FC4
    add r0, r0, #0x100
    ldrh r0, [r0, #0x60]
LEAF_END func_00050FC4

LEAF_BEGIN func_00051134
    ldr r1, [r0, #0x18]
    tst r1, #0x01000000
    orrne r1, r1, #0x10000000
    strne r1, [r0, #0x18]
LEAF_END func_00051134

LEAF_BEGIN func_00051B2C
    ldr r0, [r0, #0x14]
    uxth r0, r0
LEAF_END func_00051B2C

LEAF_BEGIN func_00056AE4
    ldrb r0, [r0, #0x1B]
    and r0, r0, #0x20
    lsr r0, r0, #5
LEAF_END func_00056AE4

LEAF_BEGIN func_00057380
    rsb r1, r1, r1, lsl #3
    add r0, r0, r1, lsl #1
    add r0, r0, #0x100
    ldrh r0, [r0, #0x16]
LEAF_END func_00057380

LEAF_BEGIN func_00059524
    ldr r0, [r0, #4]
    ldr r0, [r0, #0x10]
    ldrb r0, [r0]
LEAF_END func_00059524

LEAF_BEGIN func_0005E920
    ldr r0, [r0, #0x10]
    ldr r0, [r0, #0xA8]
    ands r0, r0, r1
    movne r0, #1
LEAF_END func_0005E920

LEAF_BEGIN func_00062290
    ldrb r2, [r0, #0x18]
    cmp r2, r1
    ldrhi r0, [r0, r1, lsl #2]
    movls r0, #0
LEAF_END func_00062290

LEAF_BEGIN func_0007C16C
    ldrb r0, [r0, #0x698]
    cmp r0, #3
    moveq r0, #1
    movne r0, #0
LEAF_END func_0007C16C

LEAF_BEGIN func_0007C1FC
    ldrb r2, [r0, #0x18]
    cmp r2, r1
    ldrhi r0, [r0, r1, lsl #2]
    movls r0, #0
LEAF_END func_0007C1FC

LEAF_BEGIN func_0007C980
    mov r1, #504
    and r0, r1, r0, lsl #3
    orr r0, r0, #3
LEAF_END func_0007C980

LEAF_BEGIN func_000864BC
    ldrh r1, [r0, #2]
    orr r1, r1, #0x8000
    strh r1, [r0, #2]
LEAF_END func_000864BC

LEAF_BEGIN func_00087A6C
    ldrb r0, [r0, #0x10]
    cmp r0, #6
    moveq r0, #1
    movne r0, #0
LEAF_END func_00087A6C

LEAF_BEGIN func_00088EA8
    ldr r1, [r0, #0x18]
    orr r1, r1, #0x04000000
    str r1, [r0, #0x18]
LEAF_END func_00088EA8

LEAF_BEGIN func_000A6C6C
    cmp r0, r1
    movlt r0, r1
LEAF_END func_000A6C6C

LEAF_BEGIN func_000C4AE0
    ldr r0, [r1, #0x18]
    cmp r0, #0
    movne r0, #1
LEAF_END func_000C4AE0

LEAF_BEGIN func_000D0C68
    ldrb r0, [r0, #0x81C]
    and r0, r0, #4
    lsr r0, r0, #2
LEAF_END func_000D0C68

LEAF_BEGIN func_000D1730
    ldrb r0, [r0, #5]
    cmp r0, #0
    movne r0, #1
LEAF_END func_000D1730

LEAF_BEGIN func_000D1990
    ldrb r1, [r0, #0x1B]
    tst r1, #0x20
    ldrhne r0, [r0, #0xF4]
    ldrheq r0, [r0, #0x0C]
LEAF_END func_000D1990

LEAF_BEGIN func_000D19CC
    add r0, r0, #0x100
    ldrh r0, [r0, #0x5C]
LEAF_END func_000D19CC

LEAF_BEGIN func_000D1A58
    add r0, r0, #0x100
    ldrh r0, [r0, #0x50]
LEAF_END func_000D1A58

LEAF_BEGIN func_000D1AA4
    ldrb r2, [r0, #0x19]
    cmp r2, r1
    ldrbhi r0, [r0, r1]
    movls r0, #6
LEAF_END func_000D1AA4
