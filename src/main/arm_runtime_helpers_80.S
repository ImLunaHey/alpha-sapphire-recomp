.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro FN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro END name
.size \name, .-\name
.endm

FN func_0019CC14
	push	{r4, r5, lr}
	subs	r2, r2, #1
	poplt	{r4, r5, pc}
.L0019CC14_loop:
	ldr	lr, [r1], #4
	umull	r4, r5, lr, lr
	subs	r2, r2, #1
	str	r4, [r0], #4
	str	r5, [r0], #4
	bge	.L0019CC14_loop
	pop	{r4, r5, pc}
END func_0019CC14

FN func_001C26E0
	ldrb	r2, [r0, #38]
	tst	r2, #4
	bne	.L001C26E0_store
	ldr	r3, [r0]
	orr	r2, r2, #4
	strb	r2, [r0, #38]
	add	r3, r3, #1
	str	r3, [r0]
.L001C26E0_store:
	strb	r1, [r0, #39]
	bx	lr
END func_001C26E0

FN func_002B64C8
	mov	r2, #0
	add	r1, r0, #4
	str	r2, [r0]
	str	r1, [r0, #4]
	str	r2, [r0, #12]
	str	r1, [r0, #8]
	str	r2, [r0, #16]
	str	r2, [r0, #20]
	str	r2, [r0, #24]
	bx	lr
END func_002B64C8

FN func_0038CD2C
	cmp	r1, #0
	ldrshge	r3, [r0, #32]
	cmpge	r3, r1
	ble	.L0038CD2C_return
	ldr	r0, [r0, #48]
	add	r1, r1, r1, lsl #1
	mov	r3, #4
	add	r1, r3, r1, lsl #2
	str	r2, [r0, r1]
.L0038CD2C_return:
	bx	lr
END func_0038CD2C

FN func_003C531C
	ldr	r2, [r1]
	mov	r3, #0
	str	r2, [r0]
	ldr	r1, [r1, #4]
	add	r2, r0, #12
	str	r1, [r0, #4]
	str	r2, [r0, #12]
	str	r3, [r0, #8]
	str	r2, [r0, #16]
	bx	lr
END func_003C531C

FN func_00410BFC
	push	{r4}
	ldrb	r3, [r0, #15]
	mov	ip, #1
	add	r4, r0, r1, lsl #2
	bic	r1, r3, ip, lsl r1
	mov	r2, #0
	strb	r1, [r0, #15]
	str	r2, [r4, #16]
	pop	{r4}
	bx	lr
END func_00410BFC

FN func_00463D84
	vldmia	r2, {s0-s7}
	add	r1, r1, r1, lsl #2
	add	r2, r2, #32
	add	r0, r0, r1, lsl #3
	add	r0, r0, #72
	vstmia	r0, {s0-s7}
	add	r0, r0, #32
	ldm	r2, {r1, r2}
	stm	r0, {r1, r2}
	bx	lr
END func_00463D84

FN func_00468EA4
	cmp	r0, #1
	moveq	r0, #212
	bxeq	lr
	mov	r2, #0
	mov	r1, r2
	mov	r0, r2
	push	{r4, lr}
	mov	r0, r0
	mov	r0, #0
	pop	{r4, pc}
END func_00468EA4

FN func_004AAC64
	ldr	r0, [r0, #12]
	mov	r1, #8
	bics	r1, r1, r0
	bne	.L004AAC64_true
	mov	r1, #4
	bics	r0, r1, r0
	movne	r0, #0
	bne	.L004AAC64_return
.L004AAC64_true:
	mov	r0, #1
.L004AAC64_return:
	bx	lr
END func_004AAC64

FN func_004B0D58
	ldr	r0, [r0, #64]
	ldrh	r0, [r0, #20]
	cmp	r0, #16
	cmpne	r0, #64
	beq	.L004B0D58_true
	cmp	r0, #128
	movne	r0, #0
	bne	.L004B0D58_return
.L004B0D58_true:
	mov	r0, #1
.L004B0D58_return:
	bx	lr
END func_004B0D58

FN func_004B2AA8
	ldr	r0, [r0]
	lsl	r1, r0, #16
	lsl	r2, r0, #24
	lsr	r1, r1, #24
	orr	r2, r2, r1, lsl #16
	lsl	r1, r0, #8
	lsr	r1, r1, #24
	orr	r1, r2, r1, lsl #8
	orr	r0, r1, r0, lsr #24
	bx	lr
END func_004B2AA8

FN func_004B92C4
	ldr	r1, [r1]
	ldr	r2, [r1, #4]!
	cmp	r2, #0
	addne	r1, r1, r2
	moveq	r1, #0
	ldr	r2, [r1, #72]
	add	r1, r1, #16
	str	r1, [r0, #4]
	str	r2, [r0]
	bx	lr
END func_004B92C4

FN func_004BF910
	ldr	r1, [r0, #28]
	cmn	r1, #1
	beq	.L004BF910_zero
	ldrh	r2, [r0, #24]
	sub	r3, r2, #8192
	subs	r3, r3, #528
	addeq	r0, r0, r1
	beq	.L004BF910_return
.L004BF910_zero:
	mov	r0, #0
.L004BF910_return:
	bx	lr
END func_004BF910

FN func_004C7CA4
	ldrb	r1, [r0, #28]
	cmp	r1, #0
	ldreq	r0, [r0, #52]
	beq	.L004C7CA4_load
	ldrb	r1, [r0, #29]
	cmp	r1, #0
	ldreq	r0, [r0, #68]
	ldrne	r0, [r0, #48]
.L004C7CA4_load:
	vldr	s0, [r0]
	bx	lr
END func_004C7CA4

FN func_004C7CCC
	ldrb	r1, [r0, #28]
	cmp	r1, #0
	ldreq	r0, [r0, #52]
	beq	.L004C7CCC_load
	ldrb	r1, [r0, #29]
	cmp	r1, #0
	ldreq	r0, [r0, #68]
	ldrne	r0, [r0, #48]
.L004C7CCC_load:
	vldr	s0, [r0, #4]
	bx	lr
END func_004C7CCC

FN func_0010CAA8
	vldmia	sp, {s0-s1}
	vstr	s1, [r0, #40]
	str	r1, [r0, #72]
	str	r2, [r0, #32]
	vstr	s0, [r0, #44]
	str	r3, [r0, #52]
	add	r0, r0, #12
	str	r0, [r2, #3336]
	bx	lr
END func_0010CAA8

FN func_00112A88
	str	r1, [r0]
	ldr	ip, [r1, #40]!
	add	r1, r1, #248
	str	r1, [r0, #8]
	mvn	r2, #0
	mov	r3, #0
	str	ip, [r0, #4]
	strd	r2, [r0, #12]
	bx	lr
END func_00112A88

FN func_00112B2C
	push	{r4, r5}
	mov	r5, #255
	stm	r0, {r1, r2, r3, r5}
	mov	r4, #30
	add	r5, r0, #16
	mov	ip, #0
	stm	r5, {r4, ip}
	pop	{r4, r5}
	bx	lr
END func_00112B2C

FN func_001361B0
	ldr	r2, [r0, #368]
	cmp	r2, #0
	streq	r1, [r0, #364]
	strne	r1, [r2]
	mov	r2, #0
	str	r1, [r0, #368]
	str	r2, [r1]
	ldr	r0, [r0, #372]
	bx	lr
END func_001361B0

FN func_001D00C0
	push	{r4, r5}
	cmp	r0, #0
	ldr	ip, [sp, #8]
	ldrd	r4, [sp, #12]
	stmne	r0, {r1, r2, r3, ip}
	strdne	r4, [r0, #16]
	pop	{r4, r5}
	mov	r0, r1
	bx	lr
END func_001D00C0

FN func_002B45C0
	mov	r1, #0
	str	r1, [r0, #8]
	str	r0, [r0]
	str	r1, [r0, #12]
	str	r1, [r0, #16]
	str	r1, [r0, #20]
	str	r1, [r0, #24]
	str	r0, [r0, #4]
	bx	lr
END func_002B45C0

FN func_002B7364
	mov	r2, #0
	add	r1, r0, #4
	str	r2, [r0]
	str	r1, [r0, #4]
	str	r2, [r0, #12]
	str	r1, [r0, #8]
	str	r2, [r0, #16]
	str	r2, [r0, #20]
	bx	lr
END func_002B7364

FN func_002C3340
	ldr	r0, [r0, #104]
	mov	r0, r0
	mov	r2, #12
	and	r1, r2, r1, lsl #2
	ldrh	r2, [r0, #30]
	bic	r2, r2, #12
	orr	r1, r1, r2
	strh	r1, [r0, #30]
	bx	lr
END func_002C3340

FN func_00331270
	ldrb	r1, [r0, #12]
	cmp	r1, #0
	beq	.L00331270_return
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	str	r1, [r0, #8]
	strb	r1, [r0, #12]
.L00331270_return:
	bx	lr
END func_00331270
