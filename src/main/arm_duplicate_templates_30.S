.syntax unified
.arch armv6k
.arm

.macro INTRUSIVE_COLORED_TREE_RANGE_ERASE name, recycle_helper
    .section .text.\name, "ax", %progbits
    .align 2
    .global \name
    .type \name, %function
\name:
    push	{r4, r5, r6, r7, r8, r9, sl, lr}
    mov	r6, r0
    mov	r4, r1
    mov	r7, #0
    ldr	r0, [r1, #16]
    str	r0, [r6]
    ldr	r1, [r1, #16]
    ldr	ip, [r2]
    ldr	r0, [r1, #8]
    cmp	ip, r0
    ldreq	r0, [r3]
    cmpeq	r0, r1
    bne .Ldt30_\@_0098
    ldr	r0, [r4, #20]
    cmp	r0, #0
    beq .Ldt30_\@_0098
    ldr	r5, [r1, #4]
    cmp	r5, #0
    beq .Ldt30_\@_0070
.Ldt30_\@_004c:
    ldr	r1, [r5, #12]
    mov	r0, r4
    bl \recycle_helper
    ldr	r2, [r4, #4]
    ldr	r1, [r5, #8]
    str	r2, [r5, #12]
    str	r5, [r4, #4]
    movs	r5, r1
    bne .Ldt30_\@_004c
.Ldt30_\@_0070:
    ldr	r0, [r4, #16]
    str	r0, [r0, #8]
    ldr	r0, [r4, #16]
    str	r7, [r0, #4]
    ldr	r0, [r4, #16]
    str	r0, [r0, #12]
    str	r7, [r4, #20]
    ldr	r0, [r4, #16]
    str	r0, [r6]
.Ldt30_\@_0094:
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt30_\@_0098:
    ldr	r1, [r3]
    mov	r0, ip
    cmp	ip, r1
    movne	r8, #1
    beq .Ldt30_\@_0094
.Ldt30_\@_00ac:
    ldr	ip, [r0, #12]
    mov	r1, r0
    cmp	ip, #0
    movne	r1, ip
    strne	ip, [r2]
    beq .Ldt30_\@_00d8
.Ldt30_\@_00c4:
    ldr	r1, [r1, #8]
    cmp	r1, #0
    strne	r1, [r2]
    bne .Ldt30_\@_00c4
    b .Ldt30_\@_0114
.Ldt30_\@_00d8:
    ldr	ip, [r0, #4]
    mov	lr, r1
    ldr	r1, [ip, #12]
    cmp	lr, r1
    bne .Ldt30_\@_0104
.Ldt30_\@_00ec:
    mov	r1, ip
    str	ip, [r2]
    ldr	ip, [ip, #4]
    ldr	lr, [ip, #12]
    cmp	r1, lr
    beq .Ldt30_\@_00ec
.Ldt30_\@_0104:
    ldr	r1, [r2]
    ldr	r1, [r1, #12]
    cmp	r1, ip
    strne	ip, [r2]
.Ldt30_\@_0114:
    ldr	ip, [r4, #16]
    mov	r1, r0
    cmp	r0, ip
    moveq	r1, ip
    beq .Ldt30_\@_0534
    ldr	ip, [r0, #12]
    cmp	ip, #0
    beq .Ldt30_\@_0148
.Ldt30_\@_0134:
    mov	r1, ip
    ldr	ip, [ip, #8]
    cmp	ip, #0
    bne .Ldt30_\@_0134
    b .Ldt30_\@_0178
.Ldt30_\@_0148:
    ldr	ip, [r0, #4]
    ldr	r5, [ip, #12]
    cmp	r0, r5
    bne .Ldt30_\@_016c
.Ldt30_\@_0158:
    mov	r1, ip
    ldr	ip, [ip, #4]
    ldr	lr, [ip, #12]
    cmp	r1, lr
    beq .Ldt30_\@_0158
.Ldt30_\@_016c:
    ldr	lr, [r1, #12]
    cmp	lr, ip
    movne	r1, ip
.Ldt30_\@_0178:
    ldr	lr, [r0, #8]
    ldr	ip, [r0, #12]
    mov	r5, r0
    cmp	lr, #0
    beq .Ldt30_\@_0204
    cmp	ip, #0
    moveq	ip, lr
    beq .Ldt30_\@_01bc
    mov	r0, ip
    ldr	ip, [ip, #8]
    cmp	ip, #0
    beq .Ldt30_\@_01b8
.Ldt30_\@_01a8:
    ldr	r0, [r0, #8]
    ldr	ip, [r0, #8]
    cmp	ip, #0
    bne .Ldt30_\@_01a8
.Ldt30_\@_01b8:
    ldr	ip, [r0, #12]
.Ldt30_\@_01bc:
    cmp	r0, r5
    beq .Ldt30_\@_02c8
    str	r0, [lr, #4]
    ldr	lr, [r5, #8]
    str	lr, [r0, #8]
    ldr	lr, [r5, #12]
    cmp	lr, r0
    beq .Ldt30_\@_0270
    cmp	ip, #0
    ldrne	lr, [r0, #4]
    strne	lr, [ip, #4]
    ldr	lr, [r0, #4]
    str	ip, [lr, #8]
    ldr	lr, [r5, #12]
    str	lr, [r0, #12]
    ldr	lr, [r5, #12]
    str	r0, [lr, #4]
    b .Ldt30_\@_0278
.Ldt30_\@_0204:
    cmp	ip, #0
    bne .Ldt30_\@_01bc
    ldr	ip, [r0, #4]
    ldr	lr, [r4, #16]
    cmp	lr, ip
    bne .Ldt30_\@_0234
    str	ip, [lr, #12]
    ldr	lr, [r4, #16]
    str	ip, [lr, #8]
    ldr	lr, [r4, #16]
    str	r7, [lr, #4]
    b .Ldt30_\@_0388
.Ldt30_\@_0234:
    ldr	r5, [ip, #8]
    cmp	r5, r0
    bne .Ldt30_\@_0258
    str	r7, [ip, #8]
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #8]
    cmp	r9, r0
    streq	ip, [lr, #8]
    b .Ldt30_\@_0388
.Ldt30_\@_0258:
    str	r7, [ip, #12]
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #12]
    cmp	r9, r0
    streq	ip, [lr, #12]
    b .Ldt30_\@_0388
.Ldt30_\@_0270:
    cmp	ip, #0
    strne	r0, [ip, #4]
.Ldt30_\@_0278:
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #4]
    cmp	r9, r5
    streq	r0, [lr, #4]
    beq .Ldt30_\@_02a0
    ldr	lr, [r5, #4]
    ldr	r9, [lr, #8]
    cmp	r9, r5
    streq	r0, [lr, #8]
    strne	r0, [lr, #12]
.Ldt30_\@_02a0:
    ldr	lr, [r5, #4]
    cmp	ip, #0
    moveq	ip, r0
    str	lr, [r0, #4]
    ldrb	r9, [r5]
    ldrb	lr, [r0]
    strb	r9, [r0]
    mov	r0, r5
    strb	lr, [r5]
    b .Ldt30_\@_0388
.Ldt30_\@_02c8:
    ldr	lr, [r0, #4]
    str	lr, [ip, #4]
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #4]
    cmp	r9, r5
    streq	ip, [lr, #4]
    beq .Ldt30_\@_02f8
    ldr	lr, [r5, #4]
    ldr	r9, [lr, #8]
    cmp	r9, r5
    streq	ip, [lr, #8]
    strne	ip, [lr, #12]
.Ldt30_\@_02f8:
    ldr	r9, [r4, #16]
    ldr	lr, [r9, #8]
    cmp	lr, r5
    bne .Ldt30_\@_0340
    ldr	lr, [r5, #12]
    cmp	lr, #0
    ldreq	lr, [r5, #4]
    streq	lr, [r9, #8]
    beq .Ldt30_\@_0340
    ldr	sl, [ip, #8]
    mov	lr, ip
    cmp	sl, #0
    beq .Ldt30_\@_033c
.Ldt30_\@_032c:
    mov	lr, sl
    ldr	sl, [sl, #8]
    cmp	sl, #0
    bne .Ldt30_\@_032c
.Ldt30_\@_033c:
    str	lr, [r9, #8]
.Ldt30_\@_0340:
    ldr	r9, [r4, #16]
    ldr	lr, [r9, #12]
    cmp	lr, r5
    bne .Ldt30_\@_0388
    ldr	lr, [r5, #8]
    cmp	lr, #0
    ldreq	lr, [r5, #4]
    streq	lr, [r9, #12]
    beq .Ldt30_\@_0388
    ldr	r5, [ip, #12]
    mov	lr, ip
    cmp	r5, #0
    beq .Ldt30_\@_0384
.Ldt30_\@_0374:
    mov	lr, r5
    ldr	r5, [r5, #12]
    cmp	r5, #0
    bne .Ldt30_\@_0374
.Ldt30_\@_0384:
    str	lr, [r9, #12]
.Ldt30_\@_0388:
    ldr	lr, [r4, #16]
    cmp	lr, ip
    ldrbne	lr, [r0]
    cmpne	lr, #0
    beq .Ldt30_\@_051c
    b .Ldt30_\@_04fc
.Ldt30_\@_03a0:
    ldr	r5, [ip, #4]
    ldr	lr, [r5, #8]
    cmp	lr, ip
    bne .Ldt30_\@_05bc
    ldr	lr, [r5, #12]
    cmp	lr, #0
    beq .Ldt30_\@_04d4
    ldrb	r5, [lr]
    cmp	r5, #0
    beq .Ldt30_\@_0464
.Ldt30_\@_03c8:
    ldr	r5, [lr, #8]
    cmp	r5, #0
    ldrbne	r9, [r5]
    cmpne	r9, #1
    beq .Ldt30_\@_04e0
.Ldt30_\@_03dc:
    ldr	r9, [lr, #12]
    cmp	r9, #0
    ldrbne	r9, [r9]
    cmpne	r9, #1
    beq .Ldt30_\@_054c
.Ldt30_\@_03f0:
    ldr	r5, [ip, #4]
    ldrb	r5, [r5]
    strb	r5, [lr]
    ldr	r5, [ip, #4]
    strb	r8, [r5]
    ldr	lr, [lr, #12]
    cmp	lr, #0
    strbne	r8, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #12]
    ldr	r9, [r5, #8]
    str	r9, [lr, #12]
    ldr	r9, [r5, #8]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_\@_045c
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #8]
    cmp	sl, lr
    streq	r5, [r9, #8]
    strne	r5, [r9, #12]
.Ldt30_\@_045c:
    str	lr, [r5, #8]
    b .Ldt30_\@_0668
.Ldt30_\@_0464:
    strb	r8, [lr]
    ldr	lr, [ip, #4]
    strb	r7, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #12]
    ldr	r9, [r5, #8]
    str	r9, [lr, #12]
    ldr	r9, [r5, #8]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_\@_04bc
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #8]
    cmp	sl, lr
    streq	r5, [r9, #8]
    strne	r5, [r9, #12]
.Ldt30_\@_04bc:
    str	lr, [r5, #8]
    str	r5, [lr, #4]
    ldr	r5, [ip, #4]
    ldr	lr, [r5, #12]
    cmp	lr, #0
    bne .Ldt30_\@_03c8
.Ldt30_\@_04d4:
    strb	r7, [ip]
    mov	ip, r5
    b .Ldt30_\@_04fc
.Ldt30_\@_04e0:
    ldr	r9, [lr, #12]
    cmp	r9, #0
    ldrbne	r9, [r9]
    cmpne	r9, #1
    bne .Ldt30_\@_03dc
.Ldt30_\@_04f4:
    strb	r7, [lr]
    ldr	ip, [ip, #4]
.Ldt30_\@_04fc:
    ldr	lr, [r4, #16]
    ldr	lr, [lr, #4]
    cmp	lr, ip
    beq .Ldt30_\@_0518
    ldrb	lr, [ip]
    cmp	lr, #1
    beq .Ldt30_\@_03a0
.Ldt30_\@_0518:
    strb	r8, [ip]
.Ldt30_\@_051c:
    ldr	ip, [r4, #4]
    str	ip, [r0, #12]
    str	r0, [r4, #4]
    ldr	r0, [r4, #20]
    sub	r0, r0, #1
    str	r0, [r4, #20]
.Ldt30_\@_0534:
    str	r1, [r6]
    ldr	r0, [r2]
    ldr	r1, [r3]
    cmp	r0, r1
    bne .Ldt30_\@_00ac
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt30_\@_054c:
    cmp	r5, #0
    strbne	r8, [r5]
    strb	r7, [lr]
    ldr	r5, [lr, #8]
    ldr	r9, [r5, #12]
    str	r9, [lr, #8]
    ldr	r9, [r5, #12]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_\@_05a0
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #12]
    cmp	sl, lr
    streq	r5, [r9, #12]
    strne	r5, [r9, #8]
.Ldt30_\@_05a0:
    str	lr, [r5, #12]
    str	r5, [lr, #4]
    ldr	lr, [ip, #4]
    ldr	lr, [lr, #12]
    cmp	lr, #0
    bne .Ldt30_\@_03f0
    b .Ldt30_\@_0518
.Ldt30_\@_05bc:
    cmp	lr, #0
    beq .Ldt30_\@_04d4
    ldrb	r5, [lr]
    cmp	r5, #0
    beq .Ldt30_\@_0670
.Ldt30_\@_05d0:
    ldr	r9, [lr, #12]
    cmp	r9, #0
    ldrbne	r5, [r9]
    cmpne	r5, #1
    beq .Ldt30_\@_06e4
.Ldt30_\@_05e4:
    ldr	r5, [lr, #8]
    cmp	r5, #0
    ldrbne	r5, [r5]
    cmpne	r5, #1
    beq .Ldt30_\@_06fc
.Ldt30_\@_05f8:
    ldr	r5, [ip, #4]
    ldrb	r5, [r5]
    strb	r5, [lr]
    ldr	r5, [ip, #4]
    strb	r8, [r5]
    ldr	lr, [lr, #8]
    cmp	lr, #0
    strbne	r8, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #8]
    ldr	r9, [r5, #12]
    str	r9, [lr, #8]
    ldr	r9, [r5, #12]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_\@_0664
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #12]
    cmp	sl, lr
    streq	r5, [r9, #12]
    strne	r5, [r9, #8]
.Ldt30_\@_0664:
    str	lr, [r5, #12]
.Ldt30_\@_0668:
    str	r5, [lr, #4]
    b .Ldt30_\@_0518
.Ldt30_\@_0670:
    strb	r8, [lr]
    ldr	lr, [ip, #4]
    strb	r7, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #8]
    ldr	r9, [r5, #12]
    str	r9, [lr, #8]
    ldr	r9, [r5, #12]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_\@_06c8
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #12]
    cmp	sl, lr
    streq	r5, [r9, #12]
    strne	r5, [r9, #8]
.Ldt30_\@_06c8:
    str	lr, [r5, #12]
    str	r5, [lr, #4]
    ldr	r5, [ip, #4]
    ldr	lr, [r5, #8]
    cmp	lr, #0
    beq .Ldt30_\@_04d4
    b .Ldt30_\@_05d0
.Ldt30_\@_06e4:
    ldr	r5, [lr, #8]
    cmp	r5, #0
    ldrbne	r5, [r5]
    cmpne	r5, #1
    bne .Ldt30_\@_05e4
    b .Ldt30_\@_04f4
.Ldt30_\@_06fc:
    cmp	r9, #0
    strbne	r8, [r9]
    strb	r7, [lr]
    ldr	r9, [lr, #12]
    ldr	r5, [r9, #8]
    str	r5, [lr, #12]
    ldr	r5, [r9, #8]
    cmp	r5, #0
    strne	lr, [r5, #4]
    ldr	r5, [lr, #4]
    str	r5, [r9, #4]
    ldr	r5, [r4, #16]
    ldr	sl, [r5, #4]
    cmp	sl, lr
    streq	r9, [r5, #4]
    beq .Ldt30_\@_0750
    ldr	r5, [lr, #4]
    ldr	sl, [r5, #8]
    cmp	sl, lr
    streq	r9, [r5, #8]
    strne	r9, [r5, #12]
.Ldt30_\@_0750:
    str	lr, [r9, #8]
    str	r9, [lr, #4]
    ldr	lr, [ip, #4]
    ldr	lr, [lr, #8]
    cmp	lr, #0
    bne .Ldt30_\@_05f8
    b .Ldt30_\@_0518
    .size \name, .-\name
.endm

INTRUSIVE_COLORED_TREE_RANGE_ERASE func_0055AB74, func_0055B2E0
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_0055B688, func_0055BDF4
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_0055E69C, func_0055EE08
INTRUSIVE_COLORED_TREE_RANGE_ERASE func_00560330, func_00560A9C
