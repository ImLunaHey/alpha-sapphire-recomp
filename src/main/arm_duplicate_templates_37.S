.syntax unified
.cpu mpcore
.arm

.macro POOLED_WORD_PAIR_COLORED_TREE_INSERT name
    .section .text.\name, "ax", %progbits
    .align 2
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r4, r1
    mov r5, r3
    mov sl, r2
    mov r9, r0
    ldr r2, [r1, #4]
    ldr r8, [sp, #40]
    mov fp, #0
    cmp r2, #0
    ldrne r0, [r2, #12]
    strne r0, [r4, #4]
    bne .Ldt37_\@_00b0
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #24
    strne r0, [r4, #8]
    bne .Ldt37_\@_00b0
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt37_\@_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt37_\@_0070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    add r0, r6, r6, lsl #1
    lsl r0, r0, #3
    bl func_00184990
    str r0, [r7, #8]
    ldr r0, [r4]
    add r1, r6, r6, lsl #1
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r1, lsl #3
    str r0, [r4, #12]
    add r0, r2, #24
    str r0, [r4, #8]
.Ldt37_\@_00b0:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt37_\@_00d8
    ldr r1, [r8]
    str r1, [r0]
    ldr r1, [r8, #4]
    str r1, [r0, #4]
.Ldt37_\@_00d8:
    ldr r0, [r4, #20]
    ldr r1, [r4, #16]
    add r0, r0, #1
    cmp r1, r5
    str r0, [r4, #20]
    beq .Ldt37_\@_0108
    cmp sl, #0
    bne .Ldt37_\@_0108
    ldr r0, [r8]
    ldr r1, [r5, #16]
    cmp r1, r0
    bls .Ldt37_\@_0138
.Ldt37_\@_0108:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt37_\@_0128
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt37_\@_014c
.Ldt37_\@_0128:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt37_\@_014c
.Ldt37_\@_0138:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt37_\@_014c:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt37_\@_0348
.Ldt37_\@_015c:
    ldr r5, [r1, #4]
    ldr r3, [r5, #8]
    cmp r1, r3
    bne .Ldt37_\@_026c
    ldr r3, [r5, #12]
    cmp r3, #0
    beq .Ldt37_\@_0184
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt37_\@_024c
.Ldt37_\@_0184:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt37_\@_01e0
    mov r0, r1
    ldr r1, [r3, #8]
    str r1, [r0, #12]
    ldr r1, [r3, #8]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r0
    streq r3, [r5, #4]
    beq .Ldt37_\@_01d8
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt37_\@_01d8:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt37_\@_01e0:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #8]
    ldr lr, [r3, #12]
    str lr, [r1, #8]
    ldr lr, [r3, #12]
    cmp lr, #0
    strne r1, [lr, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt37_\@_0244
    ldr r5, [r1, #4]
    ldr lr, [r5, #12]
    cmp lr, r1
    streq r3, [r5, #12]
    strne r3, [r5, #8]
.Ldt37_\@_0244:
    str r1, [r3, #12]
    b .Ldt37_\@_0344
.Ldt37_\@_024c:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt37_\@_0348
.Ldt37_\@_026c:
    cmp r3, #0
    beq .Ldt37_\@_0280
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt37_\@_024c
.Ldt37_\@_0280:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt37_\@_02dc
    mov r0, r1
    ldr r1, [r3, #12]
    str r1, [r0, #8]
    ldr r1, [r3, #12]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr r5, [r1, #4]
    cmp r5, r0
    streq r3, [r1, #4]
    beq .Ldt37_\@_02d4
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt37_\@_02d4:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt37_\@_02dc:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #12]
    ldr lr, [r3, #8]
    str lr, [r1, #12]
    ldr lr, [r3, #8]
    cmp lr, #0
    strne r1, [lr, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt37_\@_0340
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt37_\@_0340:
    str r1, [r3, #8]
.Ldt37_\@_0344:
    str r3, [r1, #4]
.Ldt37_\@_0348:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt37_\@_0368
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt37_\@_015c
.Ldt37_\@_0368:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
    .size \name, . - \name
.endm

POOLED_WORD_PAIR_COLORED_TREE_INSERT func_00557CAC
POOLED_WORD_PAIR_COLORED_TREE_INSERT func_00558928
POOLED_WORD_PAIR_COLORED_TREE_INSERT func_00559478

.section .note.GNU-stack, "", %progbits
