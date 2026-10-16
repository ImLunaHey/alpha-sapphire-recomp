.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT51_ERASE name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push	{r4, r5, r6, r7, r8, r9}
    ldr	ip, [r2]
    ldr	r3, [r1, #16]
    cmp	ip, r3
    streq	r3, [r0]
    beq	.Ldt51_438\@
    ldr	r3, [ip, #12]
    cmp	r3, #0
    beq	.Ldt51_38\@
.Ldt51_24\@:
    mov	ip, r3
    ldr	r3, [r3, #8]
    cmp	r3, #0
    bne	.Ldt51_24\@
    b	.Ldt51_68\@
.Ldt51_38\@:
    ldr	r3, [ip, #4]
    ldr	r5, [r3, #12]
    cmp	ip, r5
    bne	.Ldt51_5c\@
.Ldt51_48\@:
    mov	ip, r3
    ldr	r3, [r3, #4]
    ldr	r4, [r3, #12]
    cmp	ip, r4
    beq	.Ldt51_48\@
.Ldt51_5c\@:
    ldr	r4, [ip, #12]
    cmp	r4, r3
    movne	ip, r3
.Ldt51_68\@:
    ldr	r4, [r2]
    mov	r6, #0
    mov	r3, r4
    ldr	r5, [r4, #8]
    ldr	r2, [r4, #12]
    cmp	r5, #0
    beq	.Ldt51_fc\@
    cmp	r2, #0
    moveq	r2, r5
    beq	.Ldt51_b4\@
    mov	r3, r2
    ldr	r2, [r2, #8]
    cmp	r2, #0
    beq	.Ldt51_b0\@
.Ldt51_a0\@:
    ldr	r3, [r3, #8]
    ldr	r2, [r3, #8]
    cmp	r2, #0
    bne	.Ldt51_a0\@
.Ldt51_b0\@:
    ldr	r2, [r3, #12]
.Ldt51_b4\@:
    cmp	r3, r4
    beq	.Ldt51_1c0\@
    str	r3, [r5, #4]
    ldr	r5, [r4, #8]
    str	r5, [r3, #8]
    ldr	r5, [r4, #12]
    cmp	r5, r3
    beq	.Ldt51_168\@
    cmp	r2, #0
    ldrne	r5, [r3, #4]
    strne	r5, [r2, #4]
    ldr	r5, [r3, #4]
    str	r2, [r5, #8]
    ldr	r5, [r4, #12]
    str	r5, [r3, #12]
    ldr	r5, [r4, #12]
    str	r3, [r5, #4]
    b	.Ldt51_170\@
.Ldt51_fc\@:
    cmp	r2, #0
    bne	.Ldt51_b4\@
    ldr	r2, [r3, #4]
    ldr	r4, [r1, #16]
    cmp	r4, r2
    bne	.Ldt51_12c\@
    str	r2, [r4, #12]
    ldr	r4, [r1, #16]
    str	r2, [r4, #8]
    ldr	r4, [r1, #16]
    str	r6, [r4, #4]
    b	.Ldt51_280\@
.Ldt51_12c\@:
    ldr	r4, [r2, #8]
    cmp	r4, r3
    bne	.Ldt51_150\@
    str	r6, [r2, #8]
    ldr	r4, [r1, #16]
    ldr	r5, [r4, #8]
    cmp	r5, r3
    streq	r2, [r4, #8]
    b	.Ldt51_280\@
.Ldt51_150\@:
    str	r6, [r2, #12]
    ldr	r4, [r1, #16]
    ldr	r7, [r4, #12]
    cmp	r7, r3
    streq	r2, [r4, #12]
    b	.Ldt51_280\@
.Ldt51_168\@:
    cmp	r2, #0
    strne	r3, [r2, #4]
.Ldt51_170\@:
    ldr	r5, [r1, #16]
    ldr	r7, [r5, #4]
    cmp	r7, r4
    streq	r3, [r5, #4]
    beq	.Ldt51_198\@
    ldr	r5, [r4, #4]
    ldr	r7, [r5, #8]
    cmp	r7, r4
    streq	r3, [r5, #8]
    strne	r3, [r5, #12]
.Ldt51_198\@:
    ldr	r5, [r4, #4]
    cmp	r2, #0
    moveq	r2, r3
    str	r5, [r3, #4]
    ldrb	r7, [r4]
    ldrb	r5, [r3]
    strb	r7, [r3]
    mov	r3, r4
    strb	r5, [r4]
    b	.Ldt51_280\@
.Ldt51_1c0\@:
    ldr	r5, [r3, #4]
    str	r5, [r2, #4]
    ldr	r5, [r1, #16]
    ldr	r7, [r5, #4]
    cmp	r7, r4
    streq	r2, [r5, #4]
    beq	.Ldt51_1f0\@
    ldr	r5, [r4, #4]
    ldr	r7, [r5, #8]
    cmp	r7, r4
    streq	r2, [r5, #8]
    strne	r2, [r5, #12]
.Ldt51_1f0\@:
    ldr	r8, [r1, #16]
    ldr	r5, [r8, #8]
    cmp	r5, r4
    bne	.Ldt51_238\@
    ldr	r5, [r4, #12]
    cmp	r5, #0
    ldreq	r5, [r4, #4]
    streq	r5, [r8, #8]
    beq	.Ldt51_238\@
    ldr	r7, [r2, #8]
    mov	r5, r2
    cmp	r7, #0
    beq	.Ldt51_234\@
.Ldt51_224\@:
    mov	r5, r7
    ldr	r7, [r7, #8]
    cmp	r7, #0
    bne	.Ldt51_224\@
.Ldt51_234\@:
    str	r5, [r8, #8]
.Ldt51_238\@:
    ldr	r5, [r1, #16]
    ldr	r7, [r5, #12]
    cmp	r7, r4
    bne	.Ldt51_280\@
    ldr	r7, [r4, #8]
    cmp	r7, #0
    ldreq	r4, [r4, #4]
    streq	r4, [r5, #12]
    beq	.Ldt51_280\@
    ldr	r7, [r2, #12]
    mov	r4, r2
    cmp	r7, #0
    beq	.Ldt51_27c\@
.Ldt51_26c\@:
    mov	r4, r7
    ldr	r7, [r7, #12]
    cmp	r7, #0
    bne	.Ldt51_26c\@
.Ldt51_27c\@:
    str	r4, [r5, #12]
.Ldt51_280\@:
    ldr	r4, [r1, #16]
    cmp	r4, r2
    ldrbne	r4, [r3]
    cmpne	r4, #0
    movne	r5, #1
    beq	.Ldt51_41c\@
    b	.Ldt51_3fc\@
.Ldt51_29c\@:
    ldr	r7, [r2, #4]
    ldr	r4, [r7, #8]
    cmp	r4, r2
    bne	.Ldt51_4b0\@
    ldr	r4, [r7, #12]
    cmp	r4, #0
    beq	.Ldt51_3d4\@
    ldrb	r7, [r4]
    cmp	r7, #0
    beq	.Ldt51_364\@
.Ldt51_2c4\@:
    ldr	r7, [r4, #8]
    cmp	r7, #0
    ldrbne	r8, [r7]
    cmpne	r8, #1
    beq	.Ldt51_3e0\@
.Ldt51_2d8\@:
    ldr	r8, [r4, #12]
    cmp	r8, #0
    ldrbne	r8, [r8]
    cmpne	r8, #1
    beq	.Ldt51_440\@
.Ldt51_2ec\@:
    ldr	r6, [r2, #4]
    ldrb	r6, [r6]
    strb	r6, [r4]
    ldr	r6, [r2, #4]
    strb	r5, [r6]
    ldr	r4, [r4, #12]
    cmp	r4, #0
    strbne	r5, [r4]
    ldr	r6, [r2, #4]
    ldr	r4, [r6, #12]
    ldr	r7, [r4, #8]
    str	r7, [r6, #12]
    ldr	r7, [r4, #8]
    cmp	r7, #0
    strne	r6, [r7, #4]
    ldr	r7, [r6, #4]
    str	r7, [r4, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r6
    streq	r4, [r7, #4]
    beq	.Ldt51_358\@
    ldr	r7, [r6, #4]
    ldr	r8, [r7, #8]
    cmp	r8, r6
    streq	r4, [r7, #8]
    strne	r4, [r7, #12]
.Ldt51_358\@:
    str	r6, [r4, #8]
    str	r4, [r6, #4]
    b	.Ldt51_418\@
.Ldt51_364\@:
    strb	r5, [r4]
    ldr	r4, [r2, #4]
    strb	r6, [r4]
    ldr	r4, [r2, #4]
    ldr	r7, [r4, #12]
    ldr	r8, [r7, #8]
    str	r8, [r4, #12]
    ldr	r8, [r7, #8]
    cmp	r8, #0
    strne	r4, [r8, #4]
    ldr	r8, [r4, #4]
    str	r8, [r7, #4]
    ldr	r8, [r1, #16]
    ldr	r9, [r8, #4]
    cmp	r9, r4
    streq	r7, [r8, #4]
    beq	.Ldt51_3bc\@
    ldr	r8, [r4, #4]
    ldr	r9, [r8, #8]
    cmp	r9, r4
    streq	r7, [r8, #8]
    strne	r7, [r8, #12]
.Ldt51_3bc\@:
    str	r4, [r7, #8]
    str	r7, [r4, #4]
    ldr	r7, [r2, #4]
    ldr	r4, [r7, #12]
    cmp	r4, #0
    bne	.Ldt51_2c4\@
.Ldt51_3d4\@:
    strb	r6, [r2]
    mov	r2, r7
    b	.Ldt51_3fc\@
.Ldt51_3e0\@:
    ldr	r8, [r4, #12]
    cmp	r8, #0
    ldrbne	r8, [r8]
    cmpne	r8, #1
    bne	.Ldt51_2d8\@
.Ldt51_3f4\@:
    strb	r6, [r4]
    ldr	r2, [r2, #4]
.Ldt51_3fc\@:
    ldr	r4, [r1, #16]
    ldr	r4, [r4, #4]
    cmp	r4, r2
    beq	.Ldt51_418\@
    ldrb	r4, [r2]
    cmp	r4, #1
    beq	.Ldt51_29c\@
.Ldt51_418\@:
    strb	r5, [r2]
.Ldt51_41c\@:
    ldr	r2, [r1, #4]
    str	r2, [r3, #12]
    str	r3, [r1, #4]
    ldr	r2, [r1, #20]
    sub	r2, r2, #1
    str	r2, [r1, #20]
    str	ip, [r0]
.Ldt51_438\@:
    pop	{r4, r5, r6, r7, r8, r9}
    bx	lr
.Ldt51_440\@:
    cmp	r7, #0
    strbne	r5, [r7]
    strb	r6, [r4]
    ldr	r6, [r4, #8]
    ldr	r7, [r6, #12]
    str	r7, [r4, #8]
    ldr	r7, [r6, #12]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r6, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r6, [r7, #4]
    beq	.Ldt51_494\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #12]
    cmp	r8, r4
    streq	r6, [r7, #12]
    strne	r6, [r7, #8]
.Ldt51_494\@:
    str	r4, [r6, #12]
    str	r6, [r4, #4]
    ldr	r4, [r2, #4]
    ldr	r4, [r4, #12]
    cmp	r4, #0
    bne	.Ldt51_2ec\@
    b	.Ldt51_418\@
.Ldt51_4b0\@:
    cmp	r4, #0
    beq	.Ldt51_3d4\@
    ldrb	r7, [r4]
    cmp	r7, #0
    beq	.Ldt51_564\@
.Ldt51_4c4\@:
    ldr	r7, [r4, #12]
    cmp	r7, #0
    ldrbne	r8, [r7]
    cmpne	r8, #1
    beq	.Ldt51_5d8\@
.Ldt51_4d8\@:
    ldr	r8, [r4, #8]
    cmp	r8, #0
    ldrbne	r8, [r8]
    cmpne	r8, #1
    beq	.Ldt51_5f0\@
.Ldt51_4ec\@:
    ldr	r6, [r2, #4]
    ldrb	r6, [r6]
    strb	r6, [r4]
    ldr	r6, [r2, #4]
    strb	r5, [r6]
    ldr	r4, [r4, #8]
    cmp	r4, #0
    strbne	r5, [r4]
    ldr	r4, [r2, #4]
    ldr	r6, [r4, #8]
    ldr	r7, [r6, #12]
    str	r7, [r4, #8]
    ldr	r7, [r6, #12]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r6, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r6, [r7, #4]
    beq	.Ldt51_558\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #12]
    cmp	r8, r4
    streq	r6, [r7, #12]
    strne	r6, [r7, #8]
.Ldt51_558\@:
    str	r4, [r6, #12]
    str	r6, [r4, #4]
    b	.Ldt51_418\@
.Ldt51_564\@:
    strb	r5, [r4]
    ldr	r4, [r2, #4]
    strb	r6, [r4]
    ldr	r4, [r2, #4]
    ldr	r7, [r4, #8]
    ldr	r8, [r7, #12]
    str	r8, [r4, #8]
    ldr	r8, [r7, #12]
    cmp	r8, #0
    strne	r4, [r8, #4]
    ldr	r8, [r4, #4]
    str	r8, [r7, #4]
    ldr	r8, [r1, #16]
    ldr	r9, [r8, #4]
    cmp	r9, r4
    streq	r7, [r8, #4]
    beq	.Ldt51_5bc\@
    ldr	r8, [r4, #4]
    ldr	r9, [r8, #12]
    cmp	r9, r4
    streq	r7, [r8, #12]
    strne	r7, [r8, #8]
.Ldt51_5bc\@:
    str	r4, [r7, #12]
    str	r7, [r4, #4]
    ldr	r7, [r2, #4]
    ldr	r4, [r7, #8]
    cmp	r4, #0
    beq	.Ldt51_3d4\@
    b	.Ldt51_4c4\@
.Ldt51_5d8\@:
    ldr	r8, [r4, #8]
    cmp	r8, #0
    ldrbne	r8, [r8]
    cmpne	r8, #1
    bne	.Ldt51_4d8\@
    b	.Ldt51_3f4\@
.Ldt51_5f0\@:
    cmp	r7, #0
    strbne	r5, [r7]
    strb	r6, [r4]
    ldr	r6, [r4, #12]
    ldr	r7, [r6, #8]
    str	r7, [r4, #12]
    ldr	r7, [r6, #8]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r6, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r6, [r7, #4]
    beq	.Ldt51_644\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #8]
    cmp	r8, r4
    streq	r6, [r7, #8]
    strne	r6, [r7, #12]
.Ldt51_644\@:
    str	r4, [r6, #8]
    str	r6, [r4, #4]
    ldr	r4, [r2, #4]
    ldr	r4, [r4, #8]
    cmp	r4, #0
    bne	.Ldt51_4ec\@
    b	.Ldt51_418\@
.size \name, .-\name
.endm

DT51_ERASE func_00551AE4
DT51_ERASE func_00558CA4
DT51_ERASE func_0055CD50
