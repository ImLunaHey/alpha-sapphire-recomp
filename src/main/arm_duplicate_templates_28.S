.syntax unified
.arm

.macro INTRUSIVE_COLORED_TREE_ERASE_B name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9}
    ldr ip, [r2]
    ldr r3, [r1, #16]
    cmp ip, r3
    streq r3, [r0]
    beq .Ldt28_\@_0438
    ldr r3, [ip, #12]
    cmp r3, #0
    beq .Ldt28_\@_0038
.Ldt28_\@_0024:
    mov ip, r3
    ldr r3, [r3, #8]
    cmp r3, #0
    bne .Ldt28_\@_0024
    b .Ldt28_\@_0068
.Ldt28_\@_0038:
    ldr r3, [ip, #4]
    ldr r5, [r3, #12]
    cmp ip, r5
    bne .Ldt28_\@_005c
.Ldt28_\@_0048:
    mov ip, r3
    ldr r3, [r3, #4]
    ldr r4, [r3, #12]
    cmp ip, r4
    beq .Ldt28_\@_0048
.Ldt28_\@_005c:
    ldr r4, [ip, #12]
    cmp r4, r3
    movne ip, r3
.Ldt28_\@_0068:
    ldr r4, [r2]
    mov r6, #0
    mov r3, r4
    ldr r5, [r4, #8]
    ldr r2, [r4, #12]
    cmp r5, #0
    beq .Ldt28_\@_00fc
    cmp r2, #0
    moveq r2, r5
    beq .Ldt28_\@_00b4
    mov r3, r2
    ldr r2, [r2, #8]
    cmp r2, #0
    beq .Ldt28_\@_00b0
.Ldt28_\@_00a0:
    ldr r3, [r3, #8]
    ldr r2, [r3, #8]
    cmp r2, #0
    bne .Ldt28_\@_00a0
.Ldt28_\@_00b0:
    ldr r2, [r3, #12]
.Ldt28_\@_00b4:
    cmp r3, r4
    beq .Ldt28_\@_01c0
    str r3, [r5, #4]
    ldr r5, [r4, #8]
    str r5, [r3, #8]
    ldr r5, [r4, #12]
    cmp r5, r3
    beq .Ldt28_\@_0168
    cmp r2, #0
    ldrne r5, [r3, #4]
    strne r5, [r2, #4]
    ldr r5, [r3, #4]
    str r2, [r5, #8]
    ldr r5, [r4, #12]
    str r5, [r3, #12]
    ldr r5, [r4, #12]
    str r3, [r5, #4]
    b .Ldt28_\@_0170
.Ldt28_\@_00fc:
    cmp r2, #0
    bne .Ldt28_\@_00b4
    ldr r2, [r3, #4]
    ldr r4, [r1, #16]
    cmp r4, r2
    bne .Ldt28_\@_012c
    str r2, [r4, #12]
    ldr r4, [r1, #16]
    str r2, [r4, #8]
    ldr r4, [r1, #16]
    str r6, [r4, #4]
    b .Ldt28_\@_0280
.Ldt28_\@_012c:
    ldr r4, [r2, #8]
    cmp r4, r3
    bne .Ldt28_\@_0150
    str r6, [r2, #8]
    ldr r4, [r1, #16]
    ldr r5, [r4, #8]
    cmp r5, r3
    streq r2, [r4, #8]
    b .Ldt28_\@_0280
.Ldt28_\@_0150:
    str r6, [r2, #12]
    ldr r4, [r1, #16]
    ldr r7, [r4, #12]
    cmp r7, r3
    streq r2, [r4, #12]
    b .Ldt28_\@_0280
.Ldt28_\@_0168:
    cmp r2, #0
    strne r3, [r2, #4]
.Ldt28_\@_0170:
    ldr r5, [r1, #16]
    ldr r7, [r5, #4]
    cmp r7, r4
    streq r3, [r5, #4]
    beq .Ldt28_\@_0198
    ldr r5, [r4, #4]
    ldr r7, [r5, #8]
    cmp r7, r4
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt28_\@_0198:
    ldr r5, [r4, #4]
    cmp r2, #0
    moveq r2, r3
    str r5, [r3, #4]
    ldrb r7, [r4]
    ldrb r5, [r3]
    strb r7, [r3]
    mov r3, r4
    strb r5, [r4]
    b .Ldt28_\@_0280
.Ldt28_\@_01c0:
    ldr r5, [r3, #4]
    str r5, [r2, #4]
    ldr r5, [r1, #16]
    ldr r7, [r5, #4]
    cmp r7, r4
    streq r2, [r5, #4]
    beq .Ldt28_\@_01f0
    ldr r5, [r4, #4]
    ldr r7, [r5, #8]
    cmp r7, r4
    streq r2, [r5, #8]
    strne r2, [r5, #12]
.Ldt28_\@_01f0:
    ldr r8, [r1, #16]
    ldr r5, [r8, #8]
    cmp r5, r4
    bne .Ldt28_\@_0238
    ldr r5, [r4, #12]
    cmp r5, #0
    ldreq r5, [r4, #4]
    streq r5, [r8, #8]
    beq .Ldt28_\@_0238
    ldr r7, [r2, #8]
    mov r5, r2
    cmp r7, #0
    beq .Ldt28_\@_0234
.Ldt28_\@_0224:
    mov r5, r7
    ldr r7, [r7, #8]
    cmp r7, #0
    bne .Ldt28_\@_0224
.Ldt28_\@_0234:
    str r5, [r8, #8]
.Ldt28_\@_0238:
    ldr r5, [r1, #16]
    ldr r7, [r5, #12]
    cmp r7, r4
    bne .Ldt28_\@_0280
    ldr r7, [r4, #8]
    cmp r7, #0
    ldreq r4, [r4, #4]
    streq r4, [r5, #12]
    beq .Ldt28_\@_0280
    ldr r7, [r2, #12]
    mov r4, r2
    cmp r7, #0
    beq .Ldt28_\@_027c
.Ldt28_\@_026c:
    mov r4, r7
    ldr r7, [r7, #12]
    cmp r7, #0
    bne .Ldt28_\@_026c
.Ldt28_\@_027c:
    str r4, [r5, #12]
.Ldt28_\@_0280:
    ldr r4, [r1, #16]
    cmp r4, r2
    ldrbne r4, [r3]
    cmpne r4, #0
    movne r5, #1
    beq .Ldt28_\@_041c
    b .Ldt28_\@_03fc
.Ldt28_\@_029c:
    ldr r7, [r2, #4]
    ldr r4, [r7, #8]
    cmp r4, r2
    bne .Ldt28_\@_04b0
    ldr r4, [r7, #12]
    cmp r4, #0
    beq .Ldt28_\@_03d4
    ldrb r7, [r4]
    cmp r7, #0
    beq .Ldt28_\@_0364
.Ldt28_\@_02c4:
    ldr r7, [r4, #8]
    cmp r7, #0
    ldrbne r8, [r7]
    cmpne r8, #1
    beq .Ldt28_\@_03e0
.Ldt28_\@_02d8:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    beq .Ldt28_\@_0440
.Ldt28_\@_02ec:
    ldr r6, [r2, #4]
    ldrb r6, [r6]
    strb r6, [r4]
    ldr r6, [r2, #4]
    strb r5, [r6]
    ldr r4, [r4, #12]
    cmp r4, #0
    strbne r5, [r4]
    ldr r6, [r2, #4]
    ldr r4, [r6, #12]
    ldr r7, [r4, #8]
    str r7, [r6, #12]
    ldr r7, [r4, #8]
    cmp r7, #0
    strne r6, [r7, #4]
    ldr r7, [r6, #4]
    str r7, [r4, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r6
    streq r4, [r7, #4]
    beq .Ldt28_\@_0358
    ldr r7, [r6, #4]
    ldr r8, [r7, #8]
    cmp r8, r6
    streq r4, [r7, #8]
    strne r4, [r7, #12]
.Ldt28_\@_0358:
    str r6, [r4, #8]
    str r4, [r6, #4]
    b .Ldt28_\@_0418
.Ldt28_\@_0364:
    strb r5, [r4]
    ldr r4, [r2, #4]
    strb r6, [r4]
    ldr r4, [r2, #4]
    ldr r7, [r4, #12]
    ldr r8, [r7, #8]
    str r8, [r4, #12]
    ldr r8, [r7, #8]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r7, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r7, [r8, #4]
    beq .Ldt28_\@_03bc
    ldr r8, [r4, #4]
    ldr r9, [r8, #8]
    cmp r9, r4
    streq r7, [r8, #8]
    strne r7, [r8, #12]
.Ldt28_\@_03bc:
    str r4, [r7, #8]
    str r7, [r4, #4]
    ldr r7, [r2, #4]
    ldr r4, [r7, #12]
    cmp r4, #0
    bne .Ldt28_\@_02c4
.Ldt28_\@_03d4:
    strb r6, [r2]
    mov r2, r7
    b .Ldt28_\@_03fc
.Ldt28_\@_03e0:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    bne .Ldt28_\@_02d8
.Ldt28_\@_03f4:
    strb r6, [r4]
    ldr r2, [r2, #4]
.Ldt28_\@_03fc:
    ldr r4, [r1, #16]
    ldr r4, [r4, #4]
    cmp r4, r2
    beq .Ldt28_\@_0418
    ldrb r4, [r2]
    cmp r4, #1
    beq .Ldt28_\@_029c
.Ldt28_\@_0418:
    strb r5, [r2]
.Ldt28_\@_041c:
    ldr r2, [r1, #4]
    str r2, [r3, #12]
    str r3, [r1, #4]
    ldr r2, [r1, #20]
    sub r2, r2, #1
    str r2, [r1, #20]
    str ip, [r0]
.Ldt28_\@_0438:
    pop {r4, r5, r6, r7, r8, r9}
    bx lr
.Ldt28_\@_0440:
    cmp r7, #0
    strbne r5, [r7]
    strb r6, [r4]
    ldr r6, [r4, #8]
    ldr r7, [r6, #12]
    str r7, [r4, #8]
    ldr r7, [r6, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r6, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r6, [r7, #4]
    beq .Ldt28_\@_0494
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r6, [r7, #12]
    strne r6, [r7, #8]
.Ldt28_\@_0494:
    str r4, [r6, #12]
    str r6, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #12]
    cmp r4, #0
    bne .Ldt28_\@_02ec
    b .Ldt28_\@_0418
.Ldt28_\@_04b0:
    cmp r4, #0
    beq .Ldt28_\@_03d4
    ldrb r7, [r4]
    cmp r7, #0
    beq .Ldt28_\@_0564
.Ldt28_\@_04c4:
    ldr r7, [r4, #12]
    cmp r7, #0
    ldrbne r8, [r7]
    cmpne r8, #1
    beq .Ldt28_\@_05d8
.Ldt28_\@_04d8:
    ldr r8, [r4, #8]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    beq .Ldt28_\@_05f0
.Ldt28_\@_04ec:
    ldr r6, [r2, #4]
    ldrb r6, [r6]
    strb r6, [r4]
    ldr r6, [r2, #4]
    strb r5, [r6]
    ldr r4, [r4, #8]
    cmp r4, #0
    strbne r5, [r4]
    ldr r4, [r2, #4]
    ldr r6, [r4, #8]
    ldr r7, [r6, #12]
    str r7, [r4, #8]
    ldr r7, [r6, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r6, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r6, [r7, #4]
    beq .Ldt28_\@_0558
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r6, [r7, #12]
    strne r6, [r7, #8]
.Ldt28_\@_0558:
    str r4, [r6, #12]
    str r6, [r4, #4]
    b .Ldt28_\@_0418
.Ldt28_\@_0564:
    strb r5, [r4]
    ldr r4, [r2, #4]
    strb r6, [r4]
    ldr r4, [r2, #4]
    ldr r7, [r4, #8]
    ldr r8, [r7, #12]
    str r8, [r4, #8]
    ldr r8, [r7, #12]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r7, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r7, [r8, #4]
    beq .Ldt28_\@_05bc
    ldr r8, [r4, #4]
    ldr r9, [r8, #12]
    cmp r9, r4
    streq r7, [r8, #12]
    strne r7, [r8, #8]
.Ldt28_\@_05bc:
    str r4, [r7, #12]
    str r7, [r4, #4]
    ldr r7, [r2, #4]
    ldr r4, [r7, #8]
    cmp r4, #0
    beq .Ldt28_\@_03d4
    b .Ldt28_\@_04c4
.Ldt28_\@_05d8:
    ldr r8, [r4, #8]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    bne .Ldt28_\@_04d8
    b .Ldt28_\@_03f4
.Ldt28_\@_05f0:
    cmp r7, #0
    strbne r5, [r7]
    strb r6, [r4]
    ldr r6, [r4, #12]
    ldr r7, [r6, #8]
    str r7, [r4, #12]
    ldr r7, [r6, #8]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r6, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r6, [r7, #4]
    beq .Ldt28_\@_0644
    ldr r7, [r4, #4]
    ldr r8, [r7, #8]
    cmp r8, r4
    streq r6, [r7, #8]
    strne r6, [r7, #12]
.Ldt28_\@_0644:
    str r4, [r6, #8]
    str r6, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #8]
    cmp r4, #0
    bne .Ldt28_\@_04ec
    b .Ldt28_\@_0418
    .size \name, . - \name
.endm

INTRUSIVE_COLORED_TREE_ERASE_B func_0014456C
INTRUSIVE_COLORED_TREE_ERASE_B func_0018330C
INTRUSIVE_COLORED_TREE_ERASE_B func_00551088
INTRUSIVE_COLORED_TREE_ERASE_B func_0055266C
INTRUSIVE_COLORED_TREE_ERASE_B func_00557610
INTRUSIVE_COLORED_TREE_ERASE_B func_00558028
INTRUSIVE_COLORED_TREE_ERASE_B func_00561C44
INTRUSIVE_COLORED_TREE_ERASE_B func_00568484
INTRUSIVE_COLORED_TREE_ERASE_B func_00568B20
