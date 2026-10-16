.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro function name
	.section .text.\name, "ax", %progbits
	.balign 4
	.global \name
	.type \name, %function
\name:
.endm

.macro endfunction name
	.size \name, . - \name
.endm

function func_00184020
cmp	r2, #8
	bhi .Lfunc_00184020_c8
	beq .Lfunc_00184020_b4
	cmp	r2, #4
	bhi .Lfunc_00184020_4c
	beq .Lfunc_00184020_80
	cmp	r2, #2
	bcc .Lfunc_00184020_38
	beq .Lfunc_00184020_74
	ldrh	r2, [r1], #2
	ldrb	r3, [r1], #1
	strh	r2, [r0], #2
	strb	r3, [r0], #1
	bx	lr
.Lfunc_00184020_38:
	cmp	r2, #1
	bcc .Lfunc_00184020_48
	ldrb	r3, [r1], #1
	strb	r3, [r0], #1
.Lfunc_00184020_48:
	bx	lr
.Lfunc_00184020_4c:
	cmp	r2, #6
	beq .Lfunc_00184020_a0
	bcc .Lfunc_00184020_8c
	ldr	r2, [r1], #4
	ldrh	r3, [r1], #2
	str	r2, [r0], #4
	ldrb	ip, [r1], #1
	strh	r3, [r0], #2
	strb	ip, [r0], #1
	bx	lr
.Lfunc_00184020_74:
	ldrh	r3, [r1], #2
	strh	r3, [r0], #2
	bx	lr
.Lfunc_00184020_80:
	ldr	r3, [r1], #4
	str	r3, [r0], #4
	bx	lr
.Lfunc_00184020_8c:
	ldr	r2, [r1], #4
	ldrb	r3, [r1], #1
	str	r2, [r0], #4
	strb	r3, [r0], #1
	bx	lr
.Lfunc_00184020_a0:
	ldr	r2, [r1], #4
	ldrh	r3, [r1], #2
	str	r2, [r0], #4
	strh	r3, [r0], #2
	bx	lr
.Lfunc_00184020_b4:
	ldr	r2, [r1], #4
	ldr	r3, [r1], #4
	str	r2, [r0], #4
	str	r3, [r0], #4
	bx	lr
.Lfunc_00184020_c8:
	tst	r1, #1
	subne	r2, r2, #1
	ldrbne	r3, [r1], #1
	strbne	r3, [r0], #1
	tst	r1, #2
	subne	r2, r2, #2
	ldrbne	r3, [r1], #1
	ldrbne	ip, [r1], #1
	strbne	r3, [r0], #1
	strbne	ip, [r0], #1
	ands	r3, r0, #3
	bne .Lfunc_00184020_160
	push	{r4, r5, r6, r7, r8, r9, sl, lr}
	subs	r2, r2, #32
	bcc .Lfunc_00184020_120
.Lfunc_00184020_104:
	ldm	r1!, {r4, r5, r6, r7}
	ldm	r1!, {r8, r9, sl, lr}
	pld	[r1, #64]
	subs	r2, r2, #32
	stmia	r0!, {r4, r5, r6, r7}
	stmia	r0!, {r8, r9, sl, lr}
	bcs .Lfunc_00184020_104
.Lfunc_00184020_120:
	lsls	ip, r2, #28
	ldmcs	r1!, {r3, r4, ip, lr}
	stmiacs	r0!, {r3, r4, ip, lr}
	ldmmi	r1!, {r3, r4}
	stmiami	r0!, {r3, r4}
	pop	{r4, r5, r6, r7, r8, r9, sl, lr}
	lsls	ip, r2, #30
	ldrcs	r3, [r1], #4
	strcs	r3, [r0], #4
	bxeq	lr
	lsls	r2, r2, #31
	ldrhcs	r3, [r1], #2
	ldrbmi	r2, [r1], #1
	strhcs	r3, [r0], #2
	strbmi	r2, [r0], #1
	bx	lr
.Lfunc_00184020_160:
	bic	r0, r0, #3
	cmp	r3, #2
	beq .Lfunc_00184020_20c
	bhi .Lfunc_00184020_2a8
	ldr	ip, [r0]
	lsl	ip, ip, #24
	lsr	ip, ip, #24
	subs	r2, r2, #32
	blt .Lfunc_00184020_1dc
	push	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00184020_188:
	ldmge	r1!, {r4, r5, r6, r7, r8, r9, sl, lr}
	lsrge	r3, r4, #24
	orrge	r4, ip, r4, lsl #8
	lsrge	ip, r5, #24
	orrge	r5, r3, r5, lsl #8
	lsrge	r3, r6, #24
	orrge	r6, ip, r6, lsl #8
	lsrge	ip, r7, #24
	orrge	r7, r3, r7, lsl #8
	lsrge	r3, r8, #24
	orrge	r8, ip, r8, lsl #8
	lsrge	ip, r9, #24
	orrge	r9, r3, r9, lsl #8
	lsrge	r3, sl, #24
	orrge	sl, ip, sl, lsl #8
	lsrge	ip, lr, #24
	orrge	lr, r3, lr, lsl #8
	stmiage	r0!, {r4, r5, r6, r7, r8, r9, sl, lr}
	subsge	r2, r2, #32
	bge .Lfunc_00184020_188
	pop	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00184020_1dc:
	add	r2, r2, #32
	subs	r2, r2, #4
.Lfunc_00184020_1e4:
	ldrge	r3, [r1], #4
	orrge	ip, ip, r3, lsl #8
	strge	ip, [r0], #4
	lsrge	ip, r3, #24
	subsge	r2, r2, #4
	bge .Lfunc_00184020_1e4
	add	r2, r2, #4
	sub	r1, r1, #1
	add	r2, r2, #1
	b .Lfunc_00184020_340
.Lfunc_00184020_20c:
	ldr	ip, [r0]
	lsl	ip, ip, #16
	lsr	ip, ip, #16
	subs	r2, r2, #32
	blt .Lfunc_00184020_278
	push	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00184020_224:
	ldmge	r1!, {r4, r5, r6, r7, r8, r9, sl, lr}
	lsrge	r3, r4, #16
	orrge	r4, ip, r4, lsl #16
	lsrge	ip, r5, #16
	orrge	r5, r3, r5, lsl #16
	lsrge	r3, r6, #16
	orrge	r6, ip, r6, lsl #16
	lsrge	ip, r7, #16
	orrge	r7, r3, r7, lsl #16
	lsrge	r3, r8, #16
	orrge	r8, ip, r8, lsl #16
	lsrge	ip, r9, #16
	orrge	r9, r3, r9, lsl #16
	lsrge	r3, sl, #16
	orrge	sl, ip, sl, lsl #16
	lsrge	ip, lr, #16
	orrge	lr, r3, lr, lsl #16
	stmiage	r0!, {r4, r5, r6, r7, r8, r9, sl, lr}
	subsge	r2, r2, #32
	bge .Lfunc_00184020_224
	pop	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00184020_278:
	add	r2, r2, #32
	subs	r2, r2, #4
.Lfunc_00184020_280:
	ldrge	r3, [r1], #4
	orrge	ip, ip, r3, lsl #16
	strge	ip, [r0], #4
	lsrge	ip, r3, #16
	subsge	r2, r2, #4
	bge .Lfunc_00184020_280
	add	r2, r2, #4
	sub	r1, r1, #2
	add	r2, r2, #2
	b .Lfunc_00184020_340
.Lfunc_00184020_2a8:
	ldr	ip, [r0]
	lsl	ip, ip, #8
	lsr	ip, ip, #8
	subs	r2, r2, #32
	blt .Lfunc_00184020_314
	push	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00184020_2c0:
	ldmge	r1!, {r4, r5, r6, r7, r8, r9, sl, lr}
	lsrge	r3, r4, #8
	orrge	r4, ip, r4, lsl #24
	lsrge	ip, r5, #8
	orrge	r5, r3, r5, lsl #24
	lsrge	r3, r6, #8
	orrge	r6, ip, r6, lsl #24
	lsrge	ip, r7, #8
	orrge	r7, r3, r7, lsl #24
	lsrge	r3, r8, #8
	orrge	r8, ip, r8, lsl #24
	lsrge	ip, r9, #8
	orrge	r9, r3, r9, lsl #24
	lsrge	r3, sl, #8
	orrge	sl, ip, sl, lsl #24
	lsrge	ip, lr, #8
	orrge	lr, r3, lr, lsl #24
	stmiage	r0!, {r4, r5, r6, r7, r8, r9, sl, lr}
	subsge	r2, r2, #32
	bge .Lfunc_00184020_2c0
	pop	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00184020_314:
	add	r2, r2, #32
	subs	r2, r2, #4
.Lfunc_00184020_31c:
	ldrge	r3, [r1], #4
	orrge	ip, ip, r3, lsl #24
	strge	ip, [r0], #4
	lsrge	ip, r3, #8
	subsge	r2, r2, #4
	bge .Lfunc_00184020_31c
	add	r2, r2, #4
	sub	r1, r1, #3
	add	r2, r2, #3
.Lfunc_00184020_340:
	tst	r2, #4
	ldrbne	r3, [r1], #1
	ldrbne	ip, [r1], #1
	strbne	r3, [r0], #1
	strbne	ip, [r0], #1
	ldrbne	r3, [r1], #1
	ldrbne	ip, [r1], #1
	strbne	r3, [r0], #1
	strbne	ip, [r0], #1
	tst	r2, #2
	ldrbne	r3, [r1], #1
	ldrbne	ip, [r1], #1
	strbne	r3, [r0], #1
	strbne	ip, [r0], #1
	tst	r2, #1
	ldrbne	r3, [r1], #1
	strbne	r3, [r0], #1
	bx	lr
endfunction func_00184020

function func_001F245C
push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
	sub	sp, sp, #20
	add	r7, r0, #4
	add	r3, r2, #2048
	mov	ip, #0
	ldr	r4, [r0]
	ldrb	r5, [r0, #3]
	str	r3, [sp, #8]
	bic	r0, r4, #-16777216
	orr	r0, r0, r5, lsl #24
	lsrs	r0, r0, #8
	str	r0, [sp]
	bne .Lfunc_001F245C_4c
	ldr	r0, [r7]
	ldrb	r3, [r7, #3]
	add	r7, r7, #4
	bic	r0, r0, #-16777216
	orr	r0, r0, r3, lsl #24
	str	r0, [sp]
.Lfunc_001F245C_4c:
	mov	r8, #1
	mov	r6, #0
	rsb	r5, r8, r8, lsl #9
	str	r5, [sp, #4]
	mov	r5, #1024
	str	r5, [sp, #12]
	ldrh	r9, [r7]
	mov	r4, #9
	mov	r3, r6
	mov	r5, #2
	lsl	r9, r9, #2
	add	r0, r7, #2
	add	r9, r9, #4
	b .Lfunc_001F245C_d0
.Lfunc_001F245C_84:
	cmp	r3, r4
	bcs .Lfunc_001F245C_a4
.Lfunc_001F245C_8c:
	ldrb	sl, [r0], #1
	add	r3, r3, #8
	cmp	r3, r4
	add	r5, r5, #1
	orr	r6, sl, r6, lsl #8
	bcc .Lfunc_001F245C_8c
.Lfunc_001F245C_a4:
	ldr	sl, [sp, #12]
	cmp	r8, sl
	bcs .Lfunc_001F245C_cc
	sub	sl, r3, r4
	add	lr, r2, r8, lsl #1
	lsr	fp, r6, sl
	ldr	sl, [sp, #4]
	add	r8, r8, #1
	and	sl, sl, fp
	strh	sl, [lr]
.Lfunc_001F245C_cc:
	sub	r3, r3, r4
.Lfunc_001F245C_d0:
	cmp	r5, r9
	cmpcs	r4, r3
	bls .Lfunc_001F245C_84
	add	r0, r9, r7
	str	r0, [sp, #4]
	ldr	r0, [sp, #8]
	mov	r6, #31
	str	r6, [sp, #16]
	str	r0, [sp, #12]
	ldr	r0, [sp, #4]
	mov	r8, #1
	mov	r5, #0
	mov	r4, #5
	ldrb	r7, [r0], #1
	mov	r3, r5
	mov	sl, #64
	mov	r6, r8
	lsl	r7, r7, #2
	add	r9, r7, #4
	b .Lfunc_001F245C_16c
.Lfunc_001F245C_120:
	cmp	r3, r4
	bcs .Lfunc_001F245C_140
.Lfunc_001F245C_128:
	ldrb	r7, [r0], #1
	add	r3, r3, #8
	cmp	r3, r4
	add	r6, r6, #1
	orr	r5, r7, r5, lsl #8
	bcc .Lfunc_001F245C_128
.Lfunc_001F245C_140:
	cmp	r8, sl
	bcs .Lfunc_001F245C_168
	ldr	r7, [sp, #12]
	sub	fp, r3, r4
	add	lr, r7, r8, lsl #1
	ldr	r7, [sp, #16]
	lsr	fp, r5, fp
	and	r7, r7, fp
	add	r8, r8, #1
	strh	r7, [lr]
.Lfunc_001F245C_168:
	sub	r3, r3, r4
.Lfunc_001F245C_16c:
	cmp	r6, r9
	cmpcs	r4, r3
	bls .Lfunc_001F245C_120
	ldr	r0, [sp, #4]
	ldr	r6, [sp]
	mov	r3, #0
	add	r5, r9, r0
	cmp	r6, ip
	mov	r4, r3
	mov	r0, r4
	movhi	fp, #8
	bls .Lfunc_001F245C_320
.Lfunc_001F245C_19c:
	add	r7, r2, #2
	mov	lr, #256
.Lfunc_001F245C_1a4:
	cmp	r0, #0
	bne .Lfunc_001F245C_1b8
	ldrb	r4, [r5, r3]
	mov	r0, fp
	add	r3, r3, #1
.Lfunc_001F245C_1b8:
	sub	r0, r0, #1
	ldrh	r8, [r7]
	lsr	r6, r4, r0
	and	r6, r6, #1
	lsl	r9, r8, #25
	tst	r8, lr, lsr r6
	lsr	r8, r9, #24
	add	r8, r8, #2
	add	r6, r6, r8
	bic	r7, r7, #3
	addeq	r7, r7, r6, lsl #1
	beq .Lfunc_001F245C_1a4
	add	r6, r7, r6, lsl #1
	ldrh	r6, [r6]
	cmp	r6, #256
	strbcc	r6, [r1, ip]
	addcc	ip, ip, #1
	bcc .Lfunc_001F245C_314
	and	r6, r6, #255
	add	r6, r6, #3
	str	r6, [sp, #4]
	ldr	r6, [sp, #8]
	mov	lr, #16
	add	r6, r6, #2
.Lfunc_001F245C_218:
	cmp	r0, #0
	bne .Lfunc_001F245C_22c
	ldrb	r4, [r5, r3]
	mov	r0, fp
	add	r3, r3, #1
.Lfunc_001F245C_22c:
	sub	r0, r0, #1
	ldrh	r8, [r6]
	lsr	r7, r4, r0
	and	r7, r7, #1
	lsl	r9, r8, #29
	tst	r8, lr, lsr r7
	lsr	r8, r9, #28
	add	r8, r8, #2
	add	r7, r7, r8
	bic	r6, r6, #3
	add	r6, r6, r7, lsl #1
	beq .Lfunc_001F245C_218
	ldrh	r7, [r6]
	mov	r6, #0
	cmp	r7, #0
	beq .Lfunc_001F245C_2bc
	sub	r7, r7, #1
	mov	r6, #1
	lsl	r7, r7, #16
	lsrs	r7, r7, #16
	rsbne	r9, r6, r6, lsl #16
	beq .Lfunc_001F245C_2bc
.Lfunc_001F245C_284:
	cmp	r0, #0
	and	r8, r9, r6, lsl #1
	bne .Lfunc_001F245C_29c
	ldrb	r4, [r5, r3]
	mov	r0, fp
	add	r3, r3, #1
.Lfunc_001F245C_29c:
	sub	r0, r0, #1
	sub	r7, r7, #1
	lsr	r6, r4, r0
	lsl	r7, r7, #16
	and	r6, r6, #1
	lsrs	r7, r7, #16
	orr	r6, r6, r8
	bne .Lfunc_001F245C_284
.Lfunc_001F245C_2bc:
	add	r7, r6, #1
	ldr	r6, [sp, #4]
	uxth	r7, r7
	add	r8, ip, r6
	ldr	r6, [sp]
	cmp	r8, r6
	subhi	r6, r6, ip
	uxthhi	r6, r6
	strhi	r6, [sp, #4]
	ldrls	r6, [sp, #4]
	sub	r8, r6, #1
	cmp	r6, #0
	uxth	r6, r8
	beq .Lfunc_001F245C_314
.Lfunc_001F245C_2f4:
	sub	r8, ip, r7
	sub	r9, r6, #1
	ldrb	r8, [r1, r8]
	cmp	r6, #0
	uxth	r6, r9
	strb	r8, [r1, ip]
	add	ip, ip, #1
	bne .Lfunc_001F245C_2f4
.Lfunc_001F245C_314:
	ldr	r6, [sp]
	cmp	ip, r6
	bcc .Lfunc_001F245C_19c
.Lfunc_001F245C_320:
	add	sp, sp, #20
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
endfunction func_001F245C

function func_0050F0C4
add	r2, r0, #5120
	push	{r4, r5, r6, r7, r8}
	add	r2, r2, #700
	add	r1, r0, #5632
	ldr	ip, [r2]
	ldrh	r5, [r1, #184]
	mov	r4, #2
	cmp	ip, #13
	orr	r3, r5, r4, lsl ip
	uxth	r3, r3
	ble .Lfunc_0050F0C4_7c
	strh	r3, [r1, #184]
	ldr	ip, [r0, #20]
	ldr	r5, [r0, #8]
	add	r6, ip, #1
	str	r6, [r0, #20]
	strb	r3, [r5, ip]
	ldrh	r5, [r1, #184]
	ldr	r3, [r0, #20]
	ldr	ip, [r0, #8]
	add	r6, r3, #1
	lsr	r5, r5, #8
	str	r6, [r0, #20]
	strb	r5, [ip, r3]
	ldr	r3, [r2]
	rsb	ip, r3, #16
	sub	r3, r3, #13
	lsr	ip, r4, ip
	strh	ip, [r1, #184]
	str	r3, [r2]
	b .Lfunc_0050F0C4_88
.Lfunc_0050F0C4_7c:
	add	ip, ip, #3
	strh	r3, [r1, #184]
	str	ip, [r2]
.Lfunc_0050F0C4_88:
	ldr	ip, [r2]
	mov	r3, #0
	cmp	ip, #9
	addle	ip, ip, #7
	ble .Lfunc_0050F0C4_f0
	ldrh	r6, [r1, #184]
	mov	r5, #0
	orr	ip, r6, r5, lsl ip
	strh	ip, [r1, #184]
	ldr	r5, [r0, #20]
	ldr	r6, [r0, #8]
	add	r7, r5, #1
	str	r7, [r0, #20]
	strb	ip, [r6, r5]
	ldrh	r6, [r1, #184]
	ldr	ip, [r0, #20]
	ldr	r5, [r0, #8]
	add	r7, ip, #1
	lsr	r6, r6, #8
	str	r7, [r0, #20]
	strb	r6, [r5, ip]
	ldr	ip, [r2]
	rsb	r5, ip, #16
	sub	ip, ip, #9
	lsr	r5, r3, r5
	strh	r5, [r1, #184]
.Lfunc_0050F0C4_f0:
	cmp	ip, #16
	str	ip, [r2]
	beq .Lfunc_0050F0C4_1b8
	cmp	ip, #8
	blt .Lfunc_0050F0C4_134
	ldr	ip, [r0, #20]
	ldr	r6, [r0, #8]
	ldrh	r5, [r1, #184]
	add	r8, ip, #1
	str	r8, [r0, #20]
	strb	r5, [r6, ip]
	ldrh	ip, [r1, #184]
	lsr	ip, ip, #8
	strh	ip, [r1, #184]
	ldr	ip, [r2]
	sub	r5, ip, #8
	str	r5, [r2]
.Lfunc_0050F0C4_134:
	add	r5, r0, #5120
	add	r5, r5, #692
	ldr	ip, [r2]
	ldr	r6, [r5]
	sub	r6, r6, ip
	add	r6, r6, #11
	cmp	r6, #9
	bge .Lfunc_0050F0C4_2b0
	ldrh	r7, [r1, #184]
	cmp	ip, #13
	ble .Lfunc_0050F0C4_1f8
	mov	r6, #2
	orr	ip, r7, r6, lsl ip
	strh	ip, [r1, #184]
	ldr	r6, [r0, #20]
	ldr	r7, [r0, #8]
	add	r8, r6, #1
	str	r8, [r0, #20]
	strb	ip, [r7, r6]
	ldrh	r7, [r1, #184]
	ldr	ip, [r0, #20]
	ldr	r6, [r0, #8]
	add	r8, ip, #1
	lsr	r7, r7, #8
	str	r8, [r0, #20]
	strb	r7, [r6, ip]
	ldr	ip, [r2]
	rsb	r6, ip, #16
	sub	ip, ip, #13
	lsr	r4, r4, r6
	strh	r4, [r1, #184]
	str	ip, [r2]
	b .Lfunc_0050F0C4_20c
.Lfunc_0050F0C4_1b8:
	ldr	ip, [r0, #20]
	ldr	r6, [r0, #8]
	ldrh	r5, [r1, #184]
	add	r7, ip, #1
	str	r7, [r0, #20]
	strb	r5, [r6, ip]
	ldrh	r5, [r1, #184]
	ldr	ip, [r0, #20]
	ldr	r6, [r0, #8]
	add	r7, ip, #1
	lsr	r5, r5, #8
	str	r7, [r0, #20]
	strb	r5, [r6, ip]
	strh	r3, [r1, #184]
	str	r3, [r2]
	b .Lfunc_0050F0C4_134
.Lfunc_0050F0C4_1f8:
	add	r6, ip, #3
	orr	ip, r7, r4, lsl ip
	strh	ip, [r1, #184]
	mov	ip, r6
	str	r6, [r2]
.Lfunc_0050F0C4_20c:
	cmp	ip, #9
	addle	ip, ip, #7
	ble .Lfunc_0050F0C4_26c
	ldrh	r6, [r1, #184]
	mov	r4, #0
	orr	ip, r6, r4, lsl ip
	strh	ip, [r1, #184]
	ldr	r4, [r0, #20]
	ldr	r6, [r0, #8]
	add	r7, r4, #1
	str	r7, [r0, #20]
	strb	ip, [r6, r4]
	ldrh	r6, [r1, #184]
	ldr	ip, [r0, #20]
	ldr	r4, [r0, #8]
	add	r7, ip, #1
	lsr	r6, r6, #8
	str	r7, [r0, #20]
	strb	r6, [r4, ip]
	ldr	ip, [r2]
	rsb	r4, ip, #16
	sub	ip, ip, #9
	lsr	r4, r3, r4
	strh	r4, [r1, #184]
.Lfunc_0050F0C4_26c:
	cmp	ip, #16
	str	ip, [r2]
	beq .Lfunc_0050F0C4_2c0
	cmp	ip, #8
	blt .Lfunc_0050F0C4_2b0
	ldr	r3, [r0, #20]
	ldr	r4, [r0, #8]
	ldrh	ip, [r1, #184]
	add	r6, r3, #1
	str	r6, [r0, #20]
	strb	ip, [r4, r3]
	ldrh	r0, [r1, #184]
	lsr	r0, r0, #8
	strh	r0, [r1, #184]
	ldr	r0, [r2]
	sub	r0, r0, #8
	str	r0, [r2]
.Lfunc_0050F0C4_2b0:
	mov	r0, #7
	str	r0, [r5]
	pop	{r4, r5, r6, r7, r8}
	bx	lr
.Lfunc_0050F0C4_2c0:
	ldr	ip, [r0, #20]
	ldr	r6, [r0, #8]
	ldrh	r4, [r1, #184]
	add	r7, ip, #1
	str	r7, [r0, #20]
	strb	r4, [r6, ip]
	ldrh	r4, [r1, #184]
	ldr	ip, [r0, #20]
	ldr	r6, [r0, #8]
	add	r7, ip, #1
	lsr	r4, r4, #8
	str	r7, [r0, #20]
	strb	r4, [r6, ip]
	strh	r3, [r1, #184]
	str	r3, [r2]
	b .Lfunc_0050F0C4_2b0
endfunction func_0050F0C4

function func_002FB3D0
push	{r4, r5, r6, r7, r8}
	ldrb	r3, [r1, #192]
	cmp	r3, #0
	beq .Lfunc_002FB3D0_2c
	ldm	r0, {r4, ip}
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #32
	str	ip, [r0]
.Lfunc_002FB3D0_2c:
	ldr	ip, [r1, #188]
	add	r3, r1, #188
	cmp	ip, #0
	addne	r3, r3, ip
	moveq	r3, #0
	cmp	r3, #0
	beq .Lfunc_002FB3D0_b0
	ldrb	ip, [r3, #4]
	cmp	ip, #0
	beq .Lfunc_002FB3D0_b0
	ldr	r3, [r3]
	cmp	r3, #268435456
	beq .Lfunc_002FB3D0_270
	bgt .Lfunc_002FB3D0_80
	cmp	r3, #-2147483648
	beq .Lfunc_002FB3D0_94
	cmp	r3, #67108864
	beq .Lfunc_002FB3D0_2a8
	cmp	r3, #134217728
	bne .Lfunc_002FB3D0_b0
	b .Lfunc_002FB3D0_28c
.Lfunc_002FB3D0_80:
	cmp	r3, #536870912
	beq .Lfunc_002FB3D0_254
	cmp	r3, #1073741824
	bne .Lfunc_002FB3D0_b0
	b .Lfunc_002FB3D0_2a8
.Lfunc_002FB3D0_94:
	ldm	r0, {r4, ip}
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #28
.Lfunc_002FB3D0_ac:
	str	ip, [r0]
.Lfunc_002FB3D0_b0:
	ldm	r0, {r4, ip}
	bic	r7, r5, #255
	add	r3, r2, #4
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #392
	str	ip, [r0]
	ldr	r4, [r2]
	ldm	r3, {r3, ip}
	ldr	r2, [r2, #12]
	lsl	r6, r4, #16
	and	r4, r4, #255
	asr	r5, r6, #24
	orr	r4, r4, r7
	lsl	r5, r5, #8
	bic	r4, r4, #65280
	and	r5, r5, #65280
	orr	r4, r4, r5
	lsl	r6, ip, #2
	ldr	ip, [r0, #4]
	mov	r5, #32
	str	r5, [r0, #4]
	ldr	r7, [r0, #8]
	cmp	r7, #32
	movcs	r5, r7
	str	r5, [r0, #8]
	ldr	r7, [r0]
	add	r7, r7, #31
	bic	r7, r7, #31
	add	r6, r6, r7
	stm	r0, {r6, ip}
	ldr	r5, [r0, #8]
	cmp	r5, ip
	movcc	r5, ip
	cmp	r3, #0
	mov	ip, r0
	str	r5, [r0, #8]
	beq .Lfunc_002FB3D0_2c4
	ldr	r5, [ip, #4]
	ldr	r7, [ip]
	add	r8, r7, r5
	sub	r7, r5, #1
	sub	r5, r8, #1
	bic	r5, r5, r7
	add	r5, r5, #20
	str	r5, [ip]
	ldr	r8, [ip, #4]
	add	r5, r5, r8
	sub	r5, r5, #1
	bic	r5, r5, r7
	add	r5, r5, r3, lsl #2
.Lfunc_002FB3D0_184:
	lsl	ip, r4, #16
	str	r5, [r0]
	asrs	ip, ip, #24
	cmpne	r1, #0
	ldrne	ip, [r1, #40]
	cmpne	ip, #0
	beq .Lfunc_002FB3D0_208
	ldr	r4, [r0, #4]
	ldr	r5, [r0]
	mul	r2, ip, r2
	add	r5, r5, r4
	sub	r4, r4, #1
	sub	r5, r5, #1
	bic	r4, r5, r4
	add	r4, r4, #44
	lsl	r5, ip, #2
	str	r4, [r0]
	ldr	ip, [r0, #4]
	mov	r1, r0
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, r5
	lsl	r4, r2, #2
	str	ip, [r1]
	ldr	r2, [r1, #4]
	add	ip, ip, r2
	sub	r2, r2, #1
	sub	ip, ip, #1
	bic	r2, ip, r2
	add	r2, r2, r4
	str	r2, [r0]
.Lfunc_002FB3D0_208:
	ldr	r1, [r0, #4]
	ldr	r2, [r0]
	cmp	r3, #0
	add	r2, r2, r1
	sub	r1, r1, #1
	sub	r2, r2, #1
	bic	r1, r2, r1
	add	r1, r1, #20
	beq .Lfunc_002FB3D0_248
	str	r1, [r0]
	ldr	r2, [r0, #4]
	add	r1, r1, r2
	sub	r2, r2, #1
	sub	r1, r1, #1
	bic	r1, r1, r2
	add	r1, r1, r3, lsl #2
.Lfunc_002FB3D0_248:
	str	r1, [r0]
	pop	{r4, r5, r6, r7, r8}
	bx	lr
.Lfunc_002FB3D0_254:
	ldm	r0, {r4, ip}
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #36
	b .Lfunc_002FB3D0_ac
.Lfunc_002FB3D0_270:
	ldm	r0, {r4, ip}
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #8
	b .Lfunc_002FB3D0_ac
.Lfunc_002FB3D0_28c:
	ldm	r0, {r4, ip}
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #24
	b .Lfunc_002FB3D0_ac
.Lfunc_002FB3D0_2a8:
	ldm	r0, {r4, ip}
	add	r4, r4, ip
	sub	ip, ip, #1
	sub	r4, r4, #1
	bic	ip, r4, ip
	add	ip, ip, #40
	b .Lfunc_002FB3D0_ac
.Lfunc_002FB3D0_2c4:
	ldr	r5, [ip, #4]
	ldr	r6, [ip]
	add	r6, r6, r5
	sub	r5, r5, #1
	sub	r6, r6, #1
	bic	r5, r6, r5
	add	r5, r5, #20
	b .Lfunc_002FB3D0_184
endfunction func_002FB3D0
