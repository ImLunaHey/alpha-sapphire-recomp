.syntax unified
.arch armv6k
.arm

.macro INTRUSIVE_COLORED_TREE_ERASE name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9}
    ldr ip, [r2]
    ldr r3, [r1, #16]
    cmp ip, r3
    streq r3, [r0]
    beq .Ldt27_\@_0434
    ldr r3, [ip, #12]
    cmp r3, #0
    beq .Ldt27_\@_0038
.Ldt27_\@_0024:
    mov ip, r3
    ldr r3, [r3, #8]
    cmp r3, #0
    bne .Ldt27_\@_0024
    b .Ldt27_\@_0068
.Ldt27_\@_0038:
    ldr r3, [ip, #4]
    ldr r5, [r3, #12]
    cmp ip, r5
    bne .Ldt27_\@_005c
.Ldt27_\@_0048:
    mov ip, r3
    ldr r3, [r3, #4]
    ldr r4, [r3, #12]
    cmp ip, r4
    beq .Ldt27_\@_0048
.Ldt27_\@_005c:
    ldr r4, [ip, #12]
    cmp r4, r3
    movne ip, r3
.Ldt27_\@_0068:
    ldr r4, [r2]
    mov r7, #0
    mov r3, r4
    ldr r5, [r4, #8]
    ldr r2, [r4, #12]
    cmp r5, #0
    beq .Ldt27_\@_00fc
    cmp r2, #0
    moveq r2, r5
    beq .Ldt27_\@_00b4
    mov r3, r2
    ldr r2, [r2, #8]
    cmp r2, #0
    beq .Ldt27_\@_00b0
.Ldt27_\@_00a0:
    ldr r3, [r3, #8]
    ldr r2, [r3, #8]
    cmp r2, #0
    bne .Ldt27_\@_00a0
.Ldt27_\@_00b0:
    ldr r2, [r3, #12]
.Ldt27_\@_00b4:
    cmp r3, r4
    beq .Ldt27_\@_01c0
    str r3, [r5, #4]
    ldr r5, [r4, #8]
    str r5, [r3, #8]
    ldr r5, [r4, #12]
    cmp r5, r3
    beq .Ldt27_\@_0168
    cmp r2, #0
    ldrne r5, [r3, #4]
    strne r5, [r2, #4]
    ldr r5, [r3, #4]
    str r2, [r5, #8]
    ldr r5, [r4, #12]
    str r5, [r3, #12]
    ldr r5, [r4, #12]
    str r3, [r5, #4]
    b .Ldt27_\@_0170
.Ldt27_\@_00fc:
    cmp r2, #0
    bne .Ldt27_\@_00b4
    ldr r2, [r3, #4]
    ldr r4, [r1, #16]
    cmp r4, r2
    bne .Ldt27_\@_012c
    str r2, [r4, #12]
    ldr r4, [r1, #16]
    str r2, [r4, #8]
    ldr r4, [r1, #16]
    str r7, [r4, #4]
    b .Ldt27_\@_0280
.Ldt27_\@_012c:
    ldr r4, [r2, #8]
    cmp r4, r3
    bne .Ldt27_\@_0150
    str r7, [r2, #8]
    ldr r4, [r1, #16]
    ldr r5, [r4, #8]
    cmp r5, r3
    streq r2, [r4, #8]
    b .Ldt27_\@_0280
.Ldt27_\@_0150:
    str r7, [r2, #12]
    ldr r4, [r1, #16]
    ldr r6, [r4, #12]
    cmp r6, r3
    streq r2, [r4, #12]
    b .Ldt27_\@_0280
.Ldt27_\@_0168:
    cmp r2, #0
    strne r3, [r2, #4]
.Ldt27_\@_0170:
    ldr r5, [r1, #16]
    ldr r6, [r5, #4]
    cmp r6, r4
    streq r3, [r5, #4]
    beq .Ldt27_\@_0198
    ldr r5, [r4, #4]
    ldr r6, [r5, #8]
    cmp r6, r4
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt27_\@_0198:
    ldr r5, [r4, #4]
    cmp r2, #0
    moveq r2, r3
    str r5, [r3, #4]
    ldrb r6, [r4]
    ldrb r5, [r3]
    strb r6, [r3]
    mov r3, r4
    strb r5, [r4]
    b .Ldt27_\@_0280
.Ldt27_\@_01c0:
    ldr r5, [r3, #4]
    str r5, [r2, #4]
    ldr r5, [r1, #16]
    ldr r6, [r5, #4]
    cmp r6, r4
    streq r2, [r5, #4]
    beq .Ldt27_\@_01f0
    ldr r5, [r4, #4]
    ldr r6, [r5, #8]
    cmp r6, r4
    streq r2, [r5, #8]
    strne r2, [r5, #12]
.Ldt27_\@_01f0:
    ldr r6, [r1, #16]
    ldr r5, [r6, #8]
    cmp r5, r4
    bne .Ldt27_\@_0238
    ldr r5, [r4, #12]
    cmp r5, #0
    ldreq r5, [r4, #4]
    streq r5, [r6, #8]
    beq .Ldt27_\@_0238
    ldr r8, [r2, #8]
    mov r5, r2
    cmp r8, #0
    beq .Ldt27_\@_0234
.Ldt27_\@_0224:
    mov r5, r8
    ldr r8, [r8, #8]
    cmp r8, #0
    bne .Ldt27_\@_0224
.Ldt27_\@_0234:
    str r5, [r6, #8]
.Ldt27_\@_0238:
    ldr r5, [r1, #16]
    ldr r6, [r5, #12]
    cmp r6, r4
    bne .Ldt27_\@_0280
    ldr r6, [r4, #8]
    cmp r6, #0
    ldreq r4, [r4, #4]
    streq r4, [r5, #12]
    beq .Ldt27_\@_0280
    ldr r6, [r2, #12]
    mov r4, r2
    cmp r6, #0
    beq .Ldt27_\@_027c
.Ldt27_\@_026c:
    mov r4, r6
    ldr r6, [r6, #12]
    cmp r6, #0
    bne .Ldt27_\@_026c
.Ldt27_\@_027c:
    str r4, [r5, #12]
.Ldt27_\@_0280:
    ldr r4, [r1, #16]
    cmp r4, r2
    ldrbne r4, [r3]
    cmpne r4, #0
    movne r6, #1
    beq .Ldt27_\@_0418
    b .Ldt27_\@_03f8
.Ldt27_\@_029c:
    ldr r5, [r2, #4]
    ldr r4, [r5, #8]
    cmp r4, r2
    bne .Ldt27_\@_04ac
    ldr r4, [r5, #12]
    cmp r4, #0
    beq .Ldt27_\@_03d0
    ldrb r5, [r4]
    cmp r5, #0
    beq .Ldt27_\@_0360
.Ldt27_\@_02c4:
    ldr r5, [r4, #8]
    cmp r5, #0
    ldrbne r8, [r5]
    cmpne r8, #1
    beq .Ldt27_\@_03dc
.Ldt27_\@_02d8:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    beq .Ldt27_\@_043c
.Ldt27_\@_02ec:
    ldr r5, [r2, #4]
    ldrb r5, [r5]
    strb r5, [r4]
    ldr r5, [r2, #4]
    strb r6, [r5]
    ldr r4, [r4, #12]
    cmp r4, #0
    strbne r6, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #12]
    ldr r7, [r5, #8]
    str r7, [r4, #12]
    ldr r7, [r5, #8]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_\@_0358
    ldr r7, [r4, #4]
    ldr r8, [r7, #8]
    cmp r8, r4
    streq r5, [r7, #8]
    strne r5, [r7, #12]
.Ldt27_\@_0358:
    str r4, [r5, #8]
    b .Ldt27_\@_0558
.Ldt27_\@_0360:
    strb r6, [r4]
    ldr r4, [r2, #4]
    strb r7, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #12]
    ldr r8, [r5, #8]
    str r8, [r4, #12]
    ldr r8, [r5, #8]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r5, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r5, [r8, #4]
    beq .Ldt27_\@_03b8
    ldr r8, [r4, #4]
    ldr r9, [r8, #8]
    cmp r9, r4
    streq r5, [r8, #8]
    strne r5, [r8, #12]
.Ldt27_\@_03b8:
    str r4, [r5, #8]
    str r5, [r4, #4]
    ldr r5, [r2, #4]
    ldr r4, [r5, #12]
    cmp r4, #0
    bne .Ldt27_\@_02c4
.Ldt27_\@_03d0:
    strb r7, [r2]
    mov r2, r5
    b .Ldt27_\@_03f8
.Ldt27_\@_03dc:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    bne .Ldt27_\@_02d8
.Ldt27_\@_03f0:
    strb r7, [r4]
    ldr r2, [r2, #4]
.Ldt27_\@_03f8:
    ldr r4, [r1, #16]
    ldr r4, [r4, #4]
    cmp r4, r2
    beq .Ldt27_\@_0414
    ldrb r4, [r2]
    cmp r4, #1
    beq .Ldt27_\@_029c
.Ldt27_\@_0414:
    strb r6, [r2]
.Ldt27_\@_0418:
    ldr r2, [r1, #4]
    str r2, [r3, #12]
    str r3, [r1, #4]
    ldr r2, [r1, #20]
    sub r2, r2, #1
    str r2, [r1, #20]
    str ip, [r0]
.Ldt27_\@_0434:
    pop {r4, r5, r6, r7, r8, r9}
    bx lr
.Ldt27_\@_043c:
    cmp r5, #0
    strbne r6, [r5]
    strb r7, [r4]
    ldr r5, [r4, #8]
    ldr r7, [r5, #12]
    str r7, [r4, #8]
    ldr r7, [r5, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_\@_0490
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r5, [r7, #12]
    strne r5, [r7, #8]
.Ldt27_\@_0490:
    str r4, [r5, #12]
    str r5, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #12]
    cmp r4, #0
    bne .Ldt27_\@_02ec
    b .Ldt27_\@_0414
.Ldt27_\@_04ac:
    cmp r4, #0
    beq .Ldt27_\@_03d0
    ldrb r5, [r4]
    cmp r5, #0
    beq .Ldt27_\@_0560
.Ldt27_\@_04c0:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r5, [r8]
    cmpne r5, #1
    beq .Ldt27_\@_05d4
.Ldt27_\@_04d4:
    ldr r5, [r4, #8]
    cmp r5, #0
    ldrbne r5, [r5]
    cmpne r5, #1
    beq .Ldt27_\@_05ec
.Ldt27_\@_04e8:
    ldr r5, [r2, #4]
    ldrb r5, [r5]
    strb r5, [r4]
    ldr r5, [r2, #4]
    strb r6, [r5]
    ldr r4, [r4, #8]
    cmp r4, #0
    strbne r6, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #8]
    ldr r7, [r5, #12]
    str r7, [r4, #8]
    ldr r7, [r5, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_\@_0554
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r5, [r7, #12]
    strne r5, [r7, #8]
.Ldt27_\@_0554:
    str r4, [r5, #12]
.Ldt27_\@_0558:
    str r5, [r4, #4]
    b .Ldt27_\@_0414
.Ldt27_\@_0560:
    strb r6, [r4]
    ldr r4, [r2, #4]
    strb r7, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #8]
    ldr r8, [r5, #12]
    str r8, [r4, #8]
    ldr r8, [r5, #12]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r5, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r5, [r8, #4]
    beq .Ldt27_\@_05b8
    ldr r8, [r4, #4]
    ldr r9, [r8, #12]
    cmp r9, r4
    streq r5, [r8, #12]
    strne r5, [r8, #8]
.Ldt27_\@_05b8:
    str r4, [r5, #12]
    str r5, [r4, #4]
    ldr r5, [r2, #4]
    ldr r4, [r5, #8]
    cmp r4, #0
    beq .Ldt27_\@_03d0
    b .Ldt27_\@_04c0
.Ldt27_\@_05d4:
    ldr r5, [r4, #8]
    cmp r5, #0
    ldrbne r5, [r5]
    cmpne r5, #1
    bne .Ldt27_\@_04d4
    b .Ldt27_\@_03f0
.Ldt27_\@_05ec:
    cmp r8, #0
    strbne r6, [r8]
    strb r7, [r4]
    ldr r5, [r4, #12]
    ldr r7, [r5, #8]
    str r7, [r4, #12]
    ldr r7, [r5, #8]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_\@_0640
    ldr r7, [r4, #4]
    ldr r8, [r7, #8]
    cmp r8, r4
    streq r5, [r7, #8]
    strne r5, [r7, #12]
.Ldt27_\@_0640:
    str r4, [r5, #8]
    str r5, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #8]
    cmp r4, #0
    bne .Ldt27_\@_04e8
    b .Ldt27_\@_0414
    .size \name, .-\name
.endm

INTRUSIVE_COLORED_TREE_ERASE func_00182CB0
INTRUSIVE_COLORED_TREE_ERASE func_00189A24
INTRUSIVE_COLORED_TREE_ERASE func_00192484
INTRUSIVE_COLORED_TREE_ERASE func_00553230
INTRUSIVE_COLORED_TREE_ERASE func_00559984
INTRUSIVE_COLORED_TREE_ERASE func_0055A388
INTRUSIVE_COLORED_TREE_ERASE func_0055EE44
INTRUSIVE_COLORED_TREE_ERASE func_0056265C
INTRUSIVE_COLORED_TREE_ERASE func_00564E30
INTRUSIVE_COLORED_TREE_ERASE func_00567A70
