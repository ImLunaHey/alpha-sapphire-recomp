.syntax unified
.arm
.text

.macro INTRUSIVE_COLORED_TREE_RANGE_ERASE name, recycle_helper
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, lr}
    mov r6, r0
    mov r4, r1
    mov r7, #0
    ldr r0, [r1, #16]
    str r0, [r6]
    ldr r0, [r1, #16]
    ldr ip, [r2]
    ldr r1, [r0, #8]
    cmp ip, r1
    ldreq r1, [r3]
    cmpeq r1, r0
    bne .Ldt29_\@_0098
    ldr r1, [r4, #20]
    cmp r1, #0
    beq .Ldt29_\@_0098
    ldr r5, [r0, #4]
    cmp r5, #0
    beq .Ldt29_\@_0070
.Ldt29_\@_004c:
    ldr r1, [r5, #12]
    mov r0, r4
    bl \recycle_helper
    ldr r2, [r4, #4]
    ldr r1, [r5, #8]
    str r2, [r5, #12]
    str r5, [r4, #4]
    movs r5, r1
    bne .Ldt29_\@_004c
.Ldt29_\@_0070:
    ldr r0, [r4, #16]
    str r0, [r0, #8]
    ldr r0, [r4, #16]
    str r7, [r0, #4]
    ldr r0, [r4, #16]
    str r0, [r0, #12]
    str r7, [r4, #20]
    ldr r0, [r4, #16]
    str r0, [r6]
.Ldt29_\@_0094:
    pop {r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt29_\@_0098:
    mov r8, #1
.Ldt29_\@_009c:
    ldr r1, [r3]
    ldr r0, [r2]
    cmp r0, r1
    beq .Ldt29_\@_0094
    ldr ip, [r0, #12]
    mov r1, r0
    cmp ip, #0
    movne r1, ip
    strne ip, [r2]
    beq .Ldt29_\@_00d8
.Ldt29_\@_00c4:
    ldr r1, [r1, #8]
    cmp r1, #0
    strne r1, [r2]
    bne .Ldt29_\@_00c4
    b .Ldt29_\@_0114
.Ldt29_\@_00d8:
    ldr ip, [r0, #4]
    mov lr, r1
    ldr r1, [ip, #12]
    cmp lr, r1
    bne .Ldt29_\@_0104
.Ldt29_\@_00ec:
    mov r1, ip
    str ip, [r2]
    ldr ip, [ip, #4]
    ldr lr, [ip, #12]
    cmp r1, lr
    beq .Ldt29_\@_00ec
.Ldt29_\@_0104:
    ldr r1, [r2]
    ldr r1, [r1, #12]
    cmp r1, ip
    strne ip, [r2]
.Ldt29_\@_0114:
    ldr ip, [r4, #16]
    mov r1, r0
    cmp r0, ip
    moveq r1, ip
    beq .Ldt29_\@_0534
    ldr ip, [r0, #12]
    cmp ip, #0
    beq .Ldt29_\@_0148
.Ldt29_\@_0134:
    mov r1, ip
    ldr ip, [ip, #8]
    cmp ip, #0
    bne .Ldt29_\@_0134
    b .Ldt29_\@_0178
.Ldt29_\@_0148:
    ldr ip, [r0, #4]
    ldr r5, [ip, #12]
    cmp r0, r5
    bne .Ldt29_\@_016c
.Ldt29_\@_0158:
    mov r1, ip
    ldr ip, [ip, #4]
    ldr lr, [ip, #12]
    cmp r1, lr
    beq .Ldt29_\@_0158
.Ldt29_\@_016c:
    ldr lr, [r1, #12]
    cmp lr, ip
    movne r1, ip
.Ldt29_\@_0178:
    ldr lr, [r0, #8]
    ldr ip, [r0, #12]
    mov r5, r0
    cmp lr, #0
    beq .Ldt29_\@_0204
    cmp ip, #0
    moveq ip, lr
    beq .Ldt29_\@_01bc
    mov r0, ip
    ldr ip, [ip, #8]
    cmp ip, #0
    beq .Ldt29_\@_01b8
.Ldt29_\@_01a8:
    ldr r0, [r0, #8]
    ldr ip, [r0, #8]
    cmp ip, #0
    bne .Ldt29_\@_01a8
.Ldt29_\@_01b8:
    ldr ip, [r0, #12]
.Ldt29_\@_01bc:
    cmp r0, r5
    beq .Ldt29_\@_02c8
    str r0, [lr, #4]
    ldr lr, [r5, #8]
    str lr, [r0, #8]
    ldr lr, [r5, #12]
    cmp lr, r0
    beq .Ldt29_\@_0270
    cmp ip, #0
    ldrne lr, [r0, #4]
    strne lr, [ip, #4]
    ldr lr, [r0, #4]
    str ip, [lr, #8]
    ldr lr, [r5, #12]
    str lr, [r0, #12]
    ldr lr, [r5, #12]
    str r0, [lr, #4]
    b .Ldt29_\@_0278
.Ldt29_\@_0204:
    cmp ip, #0
    bne .Ldt29_\@_01bc
    ldr ip, [r0, #4]
    ldr lr, [r4, #16]
    cmp lr, ip
    bne .Ldt29_\@_0234
    str ip, [lr, #12]
    ldr lr, [r4, #16]
    str ip, [lr, #8]
    ldr lr, [r4, #16]
    str r7, [lr, #4]
    b .Ldt29_\@_0388
.Ldt29_\@_0234:
    ldr r5, [ip, #8]
    cmp r5, r0
    bne .Ldt29_\@_0258
    str r7, [ip, #8]
    ldr lr, [r4, #16]
    ldr r9, [lr, #8]
    cmp r9, r0
    streq ip, [lr, #8]
    b .Ldt29_\@_0388
.Ldt29_\@_0258:
    str r7, [ip, #12]
    ldr lr, [r4, #16]
    ldr r9, [lr, #12]
    cmp r9, r0
    streq ip, [lr, #12]
    b .Ldt29_\@_0388
.Ldt29_\@_0270:
    cmp ip, #0
    strne r0, [ip, #4]
.Ldt29_\@_0278:
    ldr lr, [r4, #16]
    ldr r9, [lr, #4]
    cmp r9, r5
    streq r0, [lr, #4]
    beq .Ldt29_\@_02a0
    ldr lr, [r5, #4]
    ldr r9, [lr, #8]
    cmp r9, r5
    streq r0, [lr, #8]
    strne r0, [lr, #12]
.Ldt29_\@_02a0:
    ldr lr, [r5, #4]
    cmp ip, #0
    moveq ip, r0
    str lr, [r0, #4]
    ldrb r9, [r5]
    ldrb lr, [r0]
    strb r9, [r0]
    mov r0, r5
    strb lr, [r5]
    b .Ldt29_\@_0388
.Ldt29_\@_02c8:
    ldr lr, [r0, #4]
    str lr, [ip, #4]
    ldr lr, [r4, #16]
    ldr r9, [lr, #4]
    cmp r9, r5
    streq ip, [lr, #4]
    beq .Ldt29_\@_02f8
    ldr lr, [r5, #4]
    ldr r9, [lr, #8]
    cmp r9, r5
    streq ip, [lr, #8]
    strne ip, [lr, #12]
.Ldt29_\@_02f8:
    ldr r9, [r4, #16]
    ldr lr, [r9, #8]
    cmp lr, r5
    bne .Ldt29_\@_0340
    ldr lr, [r5, #12]
    cmp lr, #0
    ldreq lr, [r5, #4]
    streq lr, [r9, #8]
    beq .Ldt29_\@_0340
    ldr sl, [ip, #8]
    mov lr, ip
    cmp sl, #0
    beq .Ldt29_\@_033c
.Ldt29_\@_032c:
    mov lr, sl
    ldr sl, [sl, #8]
    cmp sl, #0
    bne .Ldt29_\@_032c
.Ldt29_\@_033c:
    str lr, [r9, #8]
.Ldt29_\@_0340:
    ldr r9, [r4, #16]
    ldr lr, [r9, #12]
    cmp lr, r5
    bne .Ldt29_\@_0388
    ldr lr, [r5, #8]
    cmp lr, #0
    ldreq lr, [r5, #4]
    streq lr, [r9, #12]
    beq .Ldt29_\@_0388
    ldr r5, [ip, #12]
    mov lr, ip
    cmp r5, #0
    beq .Ldt29_\@_0384
.Ldt29_\@_0374:
    mov lr, r5
    ldr r5, [r5, #12]
    cmp r5, #0
    bne .Ldt29_\@_0374
.Ldt29_\@_0384:
    str lr, [r9, #12]
.Ldt29_\@_0388:
    ldr lr, [r4, #16]
    cmp lr, ip
    ldrbne lr, [r0]
    cmpne lr, #0
    beq .Ldt29_\@_051c
    b .Ldt29_\@_04fc
.Ldt29_\@_03a0:
    ldr r5, [ip, #4]
    ldr lr, [r5, #8]
    cmp lr, ip
    bne .Ldt29_\@_05ac
    ldr lr, [r5, #12]
    cmp lr, #0
    beq .Ldt29_\@_04d4
    ldrb r5, [lr]
    cmp r5, #0
    beq .Ldt29_\@_0464
.Ldt29_\@_03c8:
    ldr r5, [lr, #8]
    cmp r5, #0
    ldrbne r9, [r5]
    cmpne r9, #1
    beq .Ldt29_\@_04e0
.Ldt29_\@_03dc:
    ldr r9, [lr, #12]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    beq .Ldt29_\@_053c
.Ldt29_\@_03f0:
    ldr r5, [ip, #4]
    ldrb r5, [r5]
    strb r5, [lr]
    ldr r5, [ip, #4]
    strb r8, [r5]
    ldr lr, [lr, #12]
    cmp lr, #0
    strbne r8, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #12]
    ldr r9, [r5, #8]
    str r9, [lr, #12]
    ldr r9, [r5, #8]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_\@_045c
    ldr r9, [lr, #4]
    ldr sl, [r9, #8]
    cmp sl, lr
    streq r5, [r9, #8]
    strne r5, [r9, #12]
.Ldt29_\@_045c:
    str lr, [r5, #8]
    b .Ldt29_\@_0658
.Ldt29_\@_0464:
    strb r8, [lr]
    ldr lr, [ip, #4]
    strb r7, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #12]
    ldr r9, [r5, #8]
    str r9, [lr, #12]
    ldr r9, [r5, #8]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_\@_04bc
    ldr r9, [lr, #4]
    ldr sl, [r9, #8]
    cmp sl, lr
    streq r5, [r9, #8]
    strne r5, [r9, #12]
.Ldt29_\@_04bc:
    str lr, [r5, #8]
    str r5, [lr, #4]
    ldr r5, [ip, #4]
    ldr lr, [r5, #12]
    cmp lr, #0
    bne .Ldt29_\@_03c8
.Ldt29_\@_04d4:
    strb r7, [ip]
    mov ip, r5
    b .Ldt29_\@_04fc
.Ldt29_\@_04e0:
    ldr r9, [lr, #12]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    bne .Ldt29_\@_03dc
.Ldt29_\@_04f4:
    strb r7, [lr]
    ldr ip, [ip, #4]
.Ldt29_\@_04fc:
    ldr lr, [r4, #16]
    ldr lr, [lr, #4]
    cmp lr, ip
    beq .Ldt29_\@_0518
    ldrb lr, [ip]
    cmp lr, #1
    beq .Ldt29_\@_03a0
.Ldt29_\@_0518:
    strb r8, [ip]
.Ldt29_\@_051c:
    ldr ip, [r4, #4]
    str ip, [r0, #12]
    str r0, [r4, #4]
    ldr r0, [r4, #20]
    sub r0, r0, #1
    str r0, [r4, #20]
.Ldt29_\@_0534:
    str r1, [r6]
    b .Ldt29_\@_009c
.Ldt29_\@_053c:
    cmp r5, #0
    strbne r8, [r5]
    strb r7, [lr]
    ldr r5, [lr, #8]
    ldr r9, [r5, #12]
    str r9, [lr, #8]
    ldr r9, [r5, #12]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_\@_0590
    ldr r9, [lr, #4]
    ldr sl, [r9, #12]
    cmp sl, lr
    streq r5, [r9, #12]
    strne r5, [r9, #8]
.Ldt29_\@_0590:
    str lr, [r5, #12]
    str r5, [lr, #4]
    ldr lr, [ip, #4]
    ldr lr, [lr, #12]
    cmp lr, #0
    bne .Ldt29_\@_03f0
    b .Ldt29_\@_0518
.Ldt29_\@_05ac:
    cmp lr, #0
    beq .Ldt29_\@_04d4
    ldrb r5, [lr]
    cmp r5, #0
    beq .Ldt29_\@_0660
.Ldt29_\@_05c0:
    ldr r5, [lr, #12]
    cmp r5, #0
    ldrbne r9, [r5]
    cmpne r9, #1
    beq .Ldt29_\@_06d4
.Ldt29_\@_05d4:
    ldr r9, [lr, #8]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    beq .Ldt29_\@_06ec
.Ldt29_\@_05e8:
    ldr r5, [ip, #4]
    ldrb r5, [r5]
    strb r5, [lr]
    ldr r5, [ip, #4]
    strb r8, [r5]
    ldr lr, [lr, #8]
    cmp lr, #0
    strbne r8, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #8]
    ldr r9, [r5, #12]
    str r9, [lr, #8]
    ldr r9, [r5, #12]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_\@_0654
    ldr r9, [lr, #4]
    ldr sl, [r9, #12]
    cmp sl, lr
    streq r5, [r9, #12]
    strne r5, [r9, #8]
.Ldt29_\@_0654:
    str lr, [r5, #12]
.Ldt29_\@_0658:
    str r5, [lr, #4]
    b .Ldt29_\@_0518
.Ldt29_\@_0660:
    strb r8, [lr]
    ldr lr, [ip, #4]
    strb r7, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #8]
    ldr r9, [r5, #12]
    str r9, [lr, #8]
    ldr r9, [r5, #12]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_\@_06b8
    ldr r9, [lr, #4]
    ldr sl, [r9, #12]
    cmp sl, lr
    streq r5, [r9, #12]
    strne r5, [r9, #8]
.Ldt29_\@_06b8:
    str lr, [r5, #12]
    str r5, [lr, #4]
    ldr r5, [ip, #4]
    ldr lr, [r5, #8]
    cmp lr, #0
    beq .Ldt29_\@_04d4
    b .Ldt29_\@_05c0
.Ldt29_\@_06d4:
    ldr r9, [lr, #8]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    bne .Ldt29_\@_05d4
    b .Ldt29_\@_04f4
.Ldt29_\@_06ec:
    cmp r5, #0
    strbne r8, [r5]
    strb r7, [lr]
    ldr r5, [lr, #12]
    ldr r9, [r5, #8]
    str r9, [lr, #12]
    ldr r9, [r5, #8]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_\@_0740
    ldr r9, [lr, #4]
    ldr sl, [r9, #8]
    cmp sl, lr
    streq r5, [r9, #8]
    strne r5, [r9, #12]
.Ldt29_\@_0740:
    str lr, [r5, #8]
    str r5, [lr, #4]
    ldr lr, [ip, #4]
    ldr lr, [lr, #8]
    cmp lr, #0
    bne .Ldt29_\@_05e8
    b .Ldt29_\@_0518
    .size \name, . - \name
.endm

INTRUSIVE_COLORED_TREE_RANGE_ERASE func_0055F81C, func_0055FF78
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_00562CF4, func_00563450
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_00563808, func_00563F64
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_0056431C, func_00564A78
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_00565844, func_00565FA0
