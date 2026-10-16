# Probe-verified ARM runtime/helper batch 57

## Scope and provenance

This clean-room specification covers four currently unmatched ARM-state, call-free runtime helpers totaling 4,368 executable bytes. Evidence was limited to the current unmatched report, neutral symbol inventory, bounded private-target control/data-flow inspection, and independently assembled exact-schedule probes. The selection excludes all earlier configured functions plus duplicate batch 57 and IPC batch 53 reservations.

None contains a direct or indirect call, PC-relative literal load, literal pool, adjacent word, relocation, or symbolic identity. Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16 matched all four complete bodies and all 4,368 body bytes. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed mnemonic, operand, register, condition, addressing mode, VFP operation, and instruction order.

## Table-free bounded record and bit-field transformation

`func_005225C4` is 1,384 bytes. Execute the displayed bounded record-selection and packed-field update schedule. The helper derives all masks and selector values from its arguments and stack inputs; it does not consult an address literal or external routine.

```asm
	push	{r0, r1, r2, r4, r5, r6, r7, r8, r9, sl, fp, lr}
	sub	sp, sp, #8
	mov	ip, #7
	mov	r4, #4
	add	r2, r2, #1
	mvn	r5, #0
	ldr	r1, [sp, #12]
	mov	r9, #0
	ldrh	r8, [r1, #2]
	mov	r1, #0
	str	r2, [sp, #4]
	cmp	r8, #0
	moveq	ip, #138
	moveq	r4, #3
	cmp	r2, #0
	ble	.L005225C4_560
	add	r2, r0, #2560
	add	r3, r0, #5120
	str	r2, [sp]
	add	r3, r3, #700
	add	r2, r0, #5632
.L005225C4_54:
	ldr	r6, [sp, #12]
	mov	r7, r8
	add	r1, r1, #1
	add	r6, r6, r9, lsl #2
	cmp	r1, ip
	ldrh	r8, [r6, #6]
	bge	.L005225C4_78
	cmp	r7, r8
	beq	.L005225C4_550
.L005225C4_78:
	cmp	r4, r1
	ble	.L005225C4_138
	cmp	r1, #1
	movle	r1, #1
	add	fp, r1, #1
	cmp	fp, #1
	addgt	r1, r0, r7, lsl #2
	mov	ip, #1
	addgt	r6, r1, #2560
	ble	.L005225C4_524
.L005225C4_a0:
	ldrh	r4, [r6, #126]
	ldr	r5, [r3]
	ldrh	sl, [r6, #124]
	ldrh	lr, [r2, #184]
	rsb	r1, r4, #16
	cmp	r5, r1
	ble	.L005225C4_118
	orr	r5, lr, sl, lsl r5
	strh	r5, [r2, #184]
	ldr	r1, [r0, #20]
	ldr	lr, [r0, #8]
	sub	r4, r4, #16
	strb	r5, [lr, r1]
	ldr	r1, [r0, #20]
	add	r5, r1, #1
	str	r5, [r0, #20]
	ldrh	lr, [r2, #184]
	ldr	r1, [r0, #8]
	lsr	lr, lr, #8
	strb	lr, [r1, r5]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldr	r1, [r3]
	rsb	r5, r1, #16
	add	r1, r1, r4
	lsr	r4, sl, r5
	strh	r4, [r2, #184]
	str	r1, [r3]
	b	.L005225C4_128
.L005225C4_118:
	add	r1, r5, r4
	orr	r4, lr, sl, lsl r5
	strh	r4, [r2, #184]
	str	r1, [r3]
.L005225C4_128:
	add	ip, ip, #1
	cmp	ip, fp
	blt	.L005225C4_a0
	b	.L005225C4_524
.L005225C4_138:
	cmp	r7, #0
	beq	.L005225C4_2f4
	cmp	r7, r5
	beq	.L005225C4_1dc
	add	r4, r0, r7, lsl #2
	add	r4, r4, #2560
	ldr	ip, [r3]
	ldrh	r5, [r4, #126]
	ldrh	r4, [r4, #124]
	rsb	r6, r5, #16
	cmp	ip, r6
	ldrh	r6, [r2, #184]
	ble	.L005225C4_1c8
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	ldr	r6, [r0, #8]
	ldr	sl, [r0, #20]
	sub	r5, r5, #16
	strb	ip, [r6, sl]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldrh	r6, [r2, #184]
	ldr	sl, [r0, #8]
	lsr	r6, r6, #8
	strb	r6, [sl, ip]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldr	ip, [r3]
	rsb	r6, ip, #16
	add	ip, ip, r5
	lsr	r4, r4, r6
	strh	r4, [r2, #184]
	str	ip, [r3]
	b	.L005225C4_1d8
.L005225C4_1c8:
	add	r5, r5, ip
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	str	r5, [r3]
.L005225C4_1d8:
	sub	r1, r1, #1
.L005225C4_1dc:
	ldr	ip, [sp]
	ldrh	r6, [r2, #184]
	ldrh	r5, [ip, #190]
	ldr	ip, [r3]
	rsb	r4, r5, #16
	cmp	ip, r4
	ldr	r4, [sp]
	ldrh	r4, [r4, #188]
	ble	.L005225C4_25c
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	ldr	r6, [r0, #8]
	ldr	sl, [r0, #20]
	sub	r5, r5, #16
	strb	ip, [r6, sl]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldrh	r6, [r2, #184]
	ldr	sl, [r0, #8]
	lsr	r6, r6, #8
	strb	r6, [sl, ip]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldr	ip, [r3]
	rsb	r6, ip, #16
	add	ip, ip, r5
	lsr	r4, r4, r6
	strh	r4, [r2, #184]
	str	ip, [r3]
	b	.L005225C4_270
.L005225C4_25c:
	add	r5, r5, ip
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	mov	ip, r5
	str	r5, [r3]
.L005225C4_270:
	ldrh	r4, [r2, #184]
	cmp	ip, #14
	sub	r1, r1, #3
	ble	.L005225C4_2e0
	lsl	r5, r1, ip
	uxth	ip, r1
	orr	r1, r4, r5
	strh	r1, [r2, #184]
	ldr	r4, [r0, #8]
	ldr	r5, [r0, #20]
	strb	r1, [r4, r5]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldrh	r4, [r2, #184]
	ldr	r5, [r0, #8]
	lsr	r4, r4, #8
	strb	r4, [r5, r1]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldr	r1, [r3]
	rsb	r4, r1, #16
	sub	r1, r1, #14
	lsr	ip, ip, r4
	strh	ip, [r2, #184]
	str	r1, [r3]
	b	.L005225C4_524
.L005225C4_2e0:
	orr	r1, r4, r1, lsl ip
	add	r5, ip, #2
	strh	r1, [r2, #184]
	str	r5, [r3]
	b	.L005225C4_524
.L005225C4_2f4:
	ldr	ip, [sp]
	cmp	r1, #10
	bgt	.L005225C4_414
	ldrh	r5, [ip, #194]
	ldr	ip, [r3]
	ldrh	r6, [r2, #184]
	rsb	r4, r5, #16
	cmp	ip, r4
	ldr	r4, [sp]
	ldrh	r4, [r4, #192]
	ble	.L005225C4_37c
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	ldr	r6, [r0, #8]
	ldr	sl, [r0, #20]
	sub	r5, r5, #16
	strb	ip, [r6, sl]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldrh	r6, [r2, #184]
	ldr	sl, [r0, #8]
	lsr	r6, r6, #8
	strb	r6, [sl, ip]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldr	ip, [r3]
	rsb	r6, ip, #16
	add	ip, ip, r5
	lsr	r4, r4, r6
	strh	r4, [r2, #184]
	str	ip, [r3]
	b	.L005225C4_390
.L005225C4_37c:
	add	r5, r5, ip
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	mov	ip, r5
	str	r5, [r3]
.L005225C4_390:
	ldrh	r4, [r2, #184]
	cmp	ip, #13
	sub	r1, r1, #3
	ble	.L005225C4_400
	lsl	r5, r1, ip
	uxth	ip, r1
	orr	r1, r4, r5
	strh	r1, [r2, #184]
	ldr	r4, [r0, #8]
	ldr	r5, [r0, #20]
	strb	r1, [r4, r5]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldrh	r4, [r2, #184]
	ldr	r5, [r0, #8]
	lsr	r4, r4, #8
	strb	r4, [r5, r1]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldr	r1, [r3]
	rsb	r4, r1, #16
	sub	r1, r1, #13
	lsr	ip, ip, r4
	strh	ip, [r2, #184]
	str	r1, [r3]
	b	.L005225C4_524
.L005225C4_400:
	orr	r1, r4, r1, lsl ip
	add	r5, ip, #3
	strh	r1, [r2, #184]
	str	r5, [r3]
	b	.L005225C4_524
.L005225C4_414:
	ldrh	r5, [ip, #198]
	ldr	ip, [r3]
	ldrh	r6, [r2, #184]
	rsb	r4, r5, #16
	cmp	ip, r4
	ldr	r4, [sp]
	ldrh	r4, [r4, #196]
	ble	.L005225C4_490
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	ldr	r6, [r0, #8]
	ldr	sl, [r0, #20]
	sub	r5, r5, #16
	strb	ip, [r6, sl]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldrh	r6, [r2, #184]
	ldr	sl, [r0, #8]
	lsr	r6, r6, #8
	strb	r6, [sl, ip]
	ldr	ip, [r0, #20]
	add	ip, ip, #1
	str	ip, [r0, #20]
	ldr	ip, [r3]
	rsb	r6, ip, #16
	add	ip, ip, r5
	lsr	r4, r4, r6
	strh	r4, [r2, #184]
	str	ip, [r3]
	b	.L005225C4_4a4
.L005225C4_490:
	add	r5, r5, ip
	orr	ip, r6, r4, lsl ip
	strh	ip, [r2, #184]
	mov	ip, r5
	str	r5, [r3]
.L005225C4_4a4:
	ldrh	r4, [r2, #184]
	cmp	ip, #9
	sub	r1, r1, #11
	ble	.L005225C4_514
	lsl	r5, r1, ip
	uxth	ip, r1
	orr	r1, r4, r5
	strh	r1, [r2, #184]
	ldr	r4, [r0, #8]
	ldr	r5, [r0, #20]
	strb	r1, [r4, r5]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldrh	r4, [r2, #184]
	ldr	r5, [r0, #8]
	lsr	r4, r4, #8
	strb	r4, [r5, r1]
	ldr	r1, [r0, #20]
	add	r1, r1, #1
	str	r1, [r0, #20]
	ldr	r1, [r3]
	rsb	r4, r1, #16
	sub	r1, r1, #9
	lsr	ip, ip, r4
	strh	ip, [r2, #184]
	str	r1, [r3]
	b	.L005225C4_524
.L005225C4_514:
	orr	r1, r4, r1, lsl ip
	add	r5, ip, #7
	strh	r1, [r2, #184]
	str	r5, [r3]
.L005225C4_524:
	cmp	r8, #0
	mov	r5, r7
	mov	r1, #0
	moveq	ip, #138
	beq	.L005225C4_54c
	cmp	r5, r8
	moveq	ip, #6
	movne	ip, #7
	movne	r4, #4
	bne	.L005225C4_550
.L005225C4_54c:
	mov	r4, #3
.L005225C4_550:
	ldr	r6, [sp, #4]
	add	r9, r9, #1
	cmp	r9, r6
	blt	.L005225C4_54
.L005225C4_560:
	add	sp, sp, #20
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
```

## Bounded halfword-string rewrite and normalization

`func_002BA030` is 1,120 bytes. Execute the displayed bounded halfword-string normalization schedule. It recognizes and rewrites delimiter/wildcard-shaped code-unit sequences entirely from immediate values and caller buffers.

```asm
	push	{r4, r5, r6, r7, r8, r9}
	sub	r3, r2, #5
	cmp	r3, #255
	mov	r6, #0
	sub	ip, r2, #4
	add	r7, r1, r2, lsl #1
	bcs	.L002BA030_44
	ldrh	r3, [r1]
	cmp	r3, #46
	ldrheq	r3, [r1, #2]
	cmpeq	r3, #42
	bne	.L002BA030_44
	ldrh	r3, [r7, #-4]
	cmp	r3, #46
	ldrheq	r3, [r7, #-2]
	cmpeq	r3, #42
	beq	.L002BA030_7c
.L002BA030_44:
	cmp	ip, #253
	mov	r4, #92
	mov	r5, #98
	sub	r8, r2, #3
	bcs	.L002BA030_15c
	ldrh	r9, [r1]
	mvn	r3, #2
	lsr	ip, r8, #1
	cmp	r9, #46
	eor	r3, r3, r2
	beq	.L002BA030_d8
	cmp	r9, #94
	beq	.L002BA030_148
	b	.L002BA030_15c
.L002BA030_7c:
	cmp	r2, #4
	mov	r3, #0
	beq	.L002BA030_c4
	add	r3, r1, #2
	tst	r2, #1
	sub	r1, r0, #2
	beq	.L002BA030_a0
	ldrh	r4, [r3, #2]!
	strh	r4, [r1, #2]!
.L002BA030_a0:
	lsrs	ip, ip, #1
	beq	.L002BA030_c0
.L002BA030_a8:
	ldrh	r4, [r3, #2]
	subs	ip, ip, #1
	strh	r4, [r1, #2]
	ldrh	r4, [r3, #4]!
	strh	r4, [r1, #4]!
	bne	.L002BA030_a8
.L002BA030_c0:
	sub	r3, r2, #4
.L002BA030_c4:
	add	r0, r0, r3, lsl #1
	strh	r6, [r0]
	mov	r0, #1
.L002BA030_d0:
	pop	{r4, r5, r6, r7, r8, r9}
	bx	lr
.L002BA030_d8:
	ldrh	r9, [r1, #2]
	cmp	r9, #42
	ldrheq	r9, [r7, #-2]
	cmpeq	r9, #36
	bne	.L002BA030_15c
	cmp	r2, #3
	mov	r7, #0
	beq	.L002BA030_134
	tst	r3, #1
	add	r3, r1, #2
	sub	r1, r0, #2
	beq	.L002BA030_110
	ldrh	r7, [r3, #2]!
	strh	r7, [r1, #2]!
.L002BA030_110:
	cmp	ip, #0
	beq	.L002BA030_130
.L002BA030_118:
	ldrh	r7, [r3, #2]
	subs	ip, ip, #1
	strh	r7, [r1, #2]
	ldrh	r7, [r3, #4]!
	strh	r7, [r1, #4]!
	bne	.L002BA030_118
.L002BA030_130:
	mov	r7, r8
.L002BA030_134:
	add	r0, r0, r7, lsl #1
	strh	r5, [r0, #2]
	strh	r6, [r0, #4]
	strh	r4, [r0]
	b	.L002BA030_2e8
.L002BA030_148:
	ldrh	r9, [r7, #-4]
	cmp	r9, #46
	ldrheq	r9, [r7, #-2]
	cmpeq	r9, #42
	beq	.L002BA030_238
.L002BA030_15c:
	sub	ip, r2, #2
	cmp	r8, #251
	lsr	r3, ip, #1
	bcs	.L002BA030_180
	ldrh	r9, [r1]
	cmp	r9, #94
	ldrheq	r9, [r7, #-2]
	cmpeq	r9, #36
	beq	.L002BA030_28c
.L002BA030_180:
	cmp	ip, #251
	bcs	.L002BA030_1a8
	ldrh	r9, [r1]
	sub	ip, r2, #1
	cmp	r9, #94
	lsr	ip, ip, #1
	beq	.L002BA030_2f4
	ldrh	r9, [r7, #-2]
	cmp	r9, #36
	beq	.L002BA030_354
.L002BA030_1a8:
	cmp	r8, #253
	bcs	.L002BA030_1d8
	ldrh	ip, [r7, #-4]
	cmp	ip, #46
	ldrheq	ip, [r7, #-2]
	cmpeq	ip, #42
	beq	.L002BA030_3a8
	ldrh	ip, [r1]
	cmp	ip, #46
	ldrheq	ip, [r1, #2]
	cmpeq	ip, #42
	beq	.L002BA030_404
.L002BA030_1d8:
	cmp	r2, #252
	movcs	r0, #0
	bcs	.L002BA030_d0
	strh	r4, [r0]
	cmp	r2, #0
	mov	r3, #0
	strh	r5, [r0, #2]
	beq	.L002BA030_340
	tst	r2, #1
	sub	r1, r1, #2
	add	r3, r0, #2
	beq	.L002BA030_210
	ldrh	ip, [r1, #2]!
	strh	ip, [r3, #2]!
.L002BA030_210:
	lsrs	ip, r2, #1
	beq	.L002BA030_230
.L002BA030_218:
	ldrh	r7, [r1, #2]
	subs	ip, ip, #1
	strh	r7, [r3, #2]
	ldrh	r7, [r1, #4]!
	strh	r7, [r3, #4]!
	bne	.L002BA030_218
.L002BA030_230:
	mov	r3, r2
	b	.L002BA030_340
.L002BA030_238:
	strh	r4, [r0]
	cmp	r2, #3
	mov	r4, #0
	strh	r5, [r0, #2]
	beq	.L002BA030_284
	tst	r3, #1
	add	r3, r0, #2
	beq	.L002BA030_260
	ldrh	r4, [r1, #2]!
	strh	r4, [r3, #2]!
.L002BA030_260:
	cmp	ip, #0
	beq	.L002BA030_280
.L002BA030_268:
	ldrh	r4, [r1, #2]
	subs	ip, ip, #1
	strh	r4, [r3, #2]
	ldrh	r4, [r1, #4]!
	strh	r4, [r3, #4]!
	bne	.L002BA030_268
.L002BA030_280:
	mov	r4, r8
.L002BA030_284:
	add	r0, r0, r4, lsl #1
	b	.L002BA030_3fc
.L002BA030_28c:
	strh	r4, [r0]
	cmp	r2, #2
	mov	ip, #0
	strh	r5, [r0, #2]
	beq	.L002BA030_2d8
	tst	r2, #1
	add	ip, r0, #2
	beq	.L002BA030_2b4
	ldrh	r7, [r1, #2]!
	strh	r7, [ip, #2]!
.L002BA030_2b4:
	cmp	r3, #0
	beq	.L002BA030_2d4
.L002BA030_2bc:
	ldrh	r7, [r1, #2]
	subs	r3, r3, #1
	strh	r7, [ip, #2]
	ldrh	r7, [r1, #4]!
	strh	r7, [ip, #4]!
	bne	.L002BA030_2bc
.L002BA030_2d4:
	sub	ip, r2, #2
.L002BA030_2d8:
	add	r0, r0, ip, lsl #1
	strh	r5, [r0, #6]
	strh	r6, [r0, #8]
	strh	r4, [r0, #4]
.L002BA030_2e8:
	pop	{r4, r5, r6, r7, r8, r9}
	mov	r0, #1
	bx	lr
.L002BA030_2f4:
	strh	r4, [r0]
	cmp	r2, #1
	mov	r3, #0
	strh	r5, [r0, #2]
	beq	.L002BA030_340
	tst	r2, #1
	add	r3, r0, #2
	bne	.L002BA030_31c
	ldrh	r7, [r1, #2]!
	strh	r7, [r3, #2]!
.L002BA030_31c:
	cmp	ip, #0
	beq	.L002BA030_3a0
.L002BA030_324:
	ldrh	r7, [r1, #2]
	subs	ip, ip, #1
	strh	r7, [r3, #2]
	ldrh	r7, [r1, #4]!
	strh	r7, [r3, #4]!
	bne	.L002BA030_324
	b	.L002BA030_3a0
.L002BA030_340:
	add	r0, r0, r3, lsl #1
	strh	r5, [r0, #6]
	strh	r6, [r0, #8]
	strh	r4, [r0, #4]
	b	.L002BA030_2e8
.L002BA030_354:
	strh	r4, [r0]
	cmp	r2, #1
	mov	r3, #0
	strh	r5, [r0, #2]
	beq	.L002BA030_340
	tst	r2, #1
	sub	r1, r1, #2
	add	r3, r0, #2
	bne	.L002BA030_380
	ldrh	r7, [r1, #2]!
	strh	r7, [r3, #2]!
.L002BA030_380:
	cmp	ip, #0
	beq	.L002BA030_3a0
.L002BA030_388:
	ldrh	r7, [r1, #2]
	subs	ip, ip, #1
	strh	r7, [r3, #2]
	ldrh	r7, [r1, #4]!
	strh	r7, [r3, #4]!
	bne	.L002BA030_388
.L002BA030_3a0:
	sub	r3, r2, #1
	b	.L002BA030_340
.L002BA030_3a8:
	strh	r4, [r0]
	cmp	r2, #2
	mov	ip, #0
	strh	r5, [r0, #2]
	beq	.L002BA030_3f8
	sub	ip, r1, #2
	tst	r2, #1
	add	r1, r0, #2
	beq	.L002BA030_3d4
	ldrh	r4, [ip, #2]!
	strh	r4, [r1, #2]!
.L002BA030_3d4:
	cmp	r3, #0
	beq	.L002BA030_3f4
.L002BA030_3dc:
	ldrh	r4, [ip, #2]
	subs	r3, r3, #1
	strh	r4, [r1, #2]
	ldrh	r4, [ip, #4]!
	strh	r4, [r1, #4]!
	bne	.L002BA030_3dc
.L002BA030_3f4:
	sub	ip, r2, #2
.L002BA030_3f8:
	add	r0, r0, ip, lsl #1
.L002BA030_3fc:
	strh	r6, [r0, #4]
	b	.L002BA030_2e8
.L002BA030_404:
	cmp	r2, #2
	mov	ip, #0
	beq	.L002BA030_44c
	tst	r2, #1
	add	r1, r1, #2
	sub	ip, r0, #2
	beq	.L002BA030_428
	ldrh	r7, [r1, #2]!
	strh	r7, [ip, #2]!
.L002BA030_428:
	cmp	r3, #0
	beq	.L002BA030_448
.L002BA030_430:
	ldrh	r7, [r1, #2]
	subs	r3, r3, #1
	strh	r7, [ip, #2]
	ldrh	r7, [r1, #4]!
	strh	r7, [ip, #4]!
	bne	.L002BA030_430
.L002BA030_448:
	sub	ip, r2, #2
.L002BA030_44c:
	add	r0, r0, ip, lsl #1
	strh	r5, [r0, #2]
	strh	r6, [r0, #4]
	strh	r4, [r0]
	b	.L002BA030_2e8
```

## Bounded indexed-container search and removal

`func_0038811C` is 952 bytes. Execute the displayed bounded indexed-container search/removal schedule. Preserve the exact traversal, packed-key comparisons, structure updates, and early-return control flow.

```asm
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
	cmp	r2, #0
	mvn	r4, #15
	mov	r7, #16
	blt	.L0038811C_304
	ldr	r0, [r0, #164]
	cmp	r0, #0
	beq	.L0038811C_3b0
	ldr	r3, [r0, #16]
	cmp	r3, #0
	ldrhi	ip, [r0, #20]
	mov	r3, #0
	bls	.L0038811C_3b0
.L0038811C_34:
	ldr	r5, [ip, r3, lsl #4]
	cmp	r5, r2
	bne	.L0038811C_e4
	add	ip, ip, r3, lsl #4
	mov	r9, #0
	ldr	r5, [ip, #8]
	mov	r2, r9
	cmp	r5, #0
	ldrhi	r6, [ip, #12]
	bls	.L0038811C_cc
.L0038811C_5c:
	ldr	r8, [r6, r2, lsl #4]
	cmp	r8, r1
	bne	.L0038811C_f8
	sub	r1, r5, #1
	cmp	r1, r2
	bls	.L0038811C_a8
.L0038811C_74:
	ldr	r1, [ip, #12]
	add	r5, r7, r2, lsl #4
	add	r6, r1, r5
	add	r1, r1, r2, lsl #4
	ldm	r6, {r5, r8, r9}
	add	r2, r2, #1
	ldr	r6, [r6, #12]
	str	r6, [r1, #12]
	stm	r1, {r5, r8, r9}
	ldr	r1, [ip, #8]
	sub	r1, r1, #1
	cmp	r1, r2
	bhi	.L0038811C_74
.L0038811C_a8:
	add	r2, ip, #8
	mov	r1, #0
	ldm	r2, {r2, r5}
	mov	r9, #1
	add	r4, r4, r2, lsl #4
	str	r1, [r5, r4]
	ldr	r1, [ip, #8]
	sub	r1, r1, #1
	str	r1, [ip, #8]
.L0038811C_cc:
	cmp	r9, #0
	beq	.L0038811C_3b0
	ldr	r1, [ip, #8]
	cmp	r1, #0
	beq	.L0038811C_108
	b	.L0038811C_39c
.L0038811C_e4:
	ldr	r5, [r0, #16]
	add	r3, r3, #1
	cmp	r5, r3
	bhi	.L0038811C_34
	b	.L0038811C_3b0
.L0038811C_f8:
	add	r2, r2, #1
	cmp	r5, r2
	bhi	.L0038811C_5c
	b	.L0038811C_3b0
.L0038811C_108:
	ldr	r1, [r0, #16]
	mov	lr, #1
	sub	r1, r1, #1
	cmp	r1, r3
	movhi	sl, #4
	movhi	fp, #20
	bls	.L0038811C_228
.L0038811C_124:
	ldr	r1, [r0, #20]
	add	ip, sl, r3, lsl #4
	add	r2, fp, r3, lsl #4
	ldr	ip, [r1, ip]
	ldr	r2, [r1, r2]
	cmp	ip, r2
	bne	.L0038811C_260
	add	r5, r7, r3, lsl #4
	add	r4, r1, r3, lsl #4
	ldr	r5, [r1, r5]
	mov	r2, #24
	add	r1, r2, r3, lsl #4
	str	r5, [r4]
	ldr	r2, [r0, #20]
	mov	ip, #8
	add	r4, ip, r3, lsl #4
	ldr	r1, [r2, r1]
	str	r1, [r2, r4]
	ldr	r2, [r0, #20]
	cmp	r1, #0
	beq	.L0038811C_214
	and	r1, r1, #1
	cmp	r1, #1
	bne	.L0038811C_1a4
	mov	r5, #28
	add	r5, r5, r3, lsl #4
	mov	ip, #12
	ldr	r5, [r2, r5]
	add	ip, ip, r3, lsl #4
	ldr	r2, [r2, ip]
	vldmia	r5, {s0-s3}
	vstmia	r2, {s0-s3}
.L0038811C_1a4:
	ldr	r2, [r0, #20]
	ldr	r2, [r2, r4]
	cmp	r2, r1
	bls	.L0038811C_214
	mov	r2, #28
	mov	ip, #12
	add	r2, r2, r3, lsl #4
	add	ip, ip, r3, lsl #4
.L0038811C_1c4:
	ldr	r5, [r0, #20]
	ldr	r6, [r5, r2]
	ldr	r5, [r5, ip]
	add	r6, r6, r1, lsl #4
	add	r5, r5, r1, lsl #4
	vldmia	r6, {s0-s3}
	add	r6, r7, r1, lsl #4
	add	r1, r1, #2
	vstmia	r5, {s0-s3}
	ldr	r5, [r0, #20]
	ldr	r8, [r5, r2]
	ldr	r5, [r5, ip]
	add	r8, r8, r6
	add	r5, r5, r6
	vldmia	r8, {s0-s3}
	vstmia	r5, {s0-s3}
	ldr	r5, [r0, #20]
	ldr	r5, [r5, r4]
	cmp	r5, r1
	bhi	.L0038811C_1c4
.L0038811C_214:
	ldr	r1, [r0, #16]
	add	r3, r3, #1
	sub	r1, r1, #1
	cmp	r1, r3
	bhi	.L0038811C_124
.L0038811C_228:
	ldr	r2, [r0, #20]
	mvn	r1, #0
	str	r1, [r2, r3, lsl #4]
	ldr	r5, [r0, #20]
	mov	r1, #8
	add	ip, r1, r3, lsl #4
	ldr	r1, [r5, ip]
	cmp	r1, #0
	beq	.L0038811C_2d8
	and	r1, r1, #1
	cmp	r1, #1
	mov	r2, #0
	bne	.L0038811C_280
	b	.L0038811C_268
.L0038811C_260:
	mov	lr, #0
	b	.L0038811C_228
.L0038811C_268:
	mov	r2, #12
	add	r6, r2, r3, lsl #4
	mov	r4, #0
	ldr	r5, [r5, r6]
	mov	r2, #1
	str	r4, [r5]
.L0038811C_280:
	ldr	r4, [r0, #20]
	ldr	r4, [r4, ip]
	cmp	r4, r1
	bls	.L0038811C_2d8
	mov	r5, #12
	mov	r4, #0
	add	r3, r5, r3, lsl #4
.L0038811C_29c:
	ldr	r5, [r0, #20]
	add	r1, r1, #2
	ldr	r5, [r5, r3]
	add	r5, r5, r2, lsl #4
	add	r2, r2, #1
	str	r4, [r5]
	ldr	r5, [r0, #20]
	ldr	r5, [r5, r3]
	add	r5, r5, r2, lsl #4
	add	r2, r2, #1
	str	r4, [r5]
	ldr	r5, [r0, #20]
	ldr	r5, [r5, ip]
	cmp	r5, r1
	bhi	.L0038811C_29c
.L0038811C_2d8:
	ldr	r2, [r0, #20]
	mov	r1, #0
	cmp	lr, #0
	str	r1, [r2, ip]
	beq	.L0038811C_2f8
	ldr	r1, [r0, #16]
	sub	r1, r1, #1
	str	r1, [r0, #16]
.L0038811C_2f8:
	cmp	r9, #0
	bne	.L0038811C_39c
	b	.L0038811C_3b0
.L0038811C_304:
	ldr	r0, [r0, #168]
	cmp	r0, #0
	beq	.L0038811C_3b0
	ldr	r2, [r0, #16]
	cmp	r2, #0
	addhi	r3, r0, #16
	mov	r2, #0
	ldmhi	r3, {r3, ip}
	bls	.L0038811C_3b0
.L0038811C_328:
	ldr	r5, [ip, r2, lsl #4]
	cmp	r5, r1
	bne	.L0038811C_3a4
	sub	r1, r3, #1
	cmp	r1, r2
	bls	.L0038811C_37c
.L0038811C_340:
	ldr	r1, [r0, #20]
	add	r3, r7, r2, lsl #4
	add	r6, r1, r3
	add	r1, r1, r2, lsl #4
	ldm	r6, {r3, ip}
	add	r6, r6, #8
	add	r2, r2, #1
	ldm	r6, {r5, r6}
	stm	r1, {r3, ip}
	add	r1, r1, #8
	stm	r1, {r5, r6}
	ldr	r1, [r0, #16]
	sub	r1, r1, #1
	cmp	r1, r2
	bhi	.L0038811C_340
.L0038811C_37c:
	ldr	r3, [r0, #16]
	ldr	r2, [r0, #20]
	mov	r1, #0
	add	r3, r4, r3, lsl #4
	str	r1, [r2, r3]
	ldr	r1, [r0, #16]
	sub	r1, r1, #1
	str	r1, [r0, #16]
.L0038811C_39c:
	mov	r0, #1
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.L0038811C_3a4:
	add	r2, r2, #1
	cmp	r3, r2
	bhi	.L0038811C_328
.L0038811C_3b0:
	mov	r0, #0
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
```

## Fixed-point coordinate and extent transformation

`func_004BA018` is 912 bytes. Execute the displayed fixed-point coordinate and extent transformation. Preserve the exact signed-load, multiply/accumulate, shift, clamp, and packed-store order.

```asm
	push	{r4, r5, r6, r7, r8, r9}
	mov	r6, #0
	ldrh	r3, [r2, #32]
	ldr	ip, [r1]
	rsb	r4, r3, r3, lsl #4
	add	r3, r4, r3, lsl #6
	add	r3, ip, r3, lsl #3
	ldr	ip, [r0]
	add	r5, r3, #4
	ldrb	ip, [ip, #6]
	tst	ip, #16
	beq	.L004BA018_170
.L004BA018_30:
	add	r3, r5, r6
	ldrb	r3, [r3, #356]
	cmp	r3, #0
	beq	.L004BA018_160
	ldrh	r3, [r2, #32]
	ldr	ip, [r1]
	ldrb	r8, [r2, #64]
	add	r7, r6, r6, lsl #1
	rsb	r9, r3, r3, lsl #4
	add	r3, r9, r3, lsl #6
	add	r7, r7, r6, lsl #3
	add	r3, ip, r3, lsl #3
	add	r3, r3, r6, lsl #4
	add	r7, r5, r7, lsl #2
	ldrb	r9, [r3, #436]
	add	r4, r2, #64
	add	ip, r7, #4
	smulbb	r8, r9, r8
	lsr	r8, r8, #8
	strb	r8, [r7, #11]
	ldrb	r8, [r3, #437]
	ldrb	r9, [r2, #65]
	smulbb	r8, r8, r9
	lsr	r8, r8, #8
	strb	r8, [r7, #12]
	ldrb	r9, [r3, #438]
	ldrb	r8, [r4, #2]
	smulbb	r8, r9, r8
	lsr	r8, r8, #8
	strb	r8, [r7, #13]
	ldrb	r9, [r3, #440]
	ldrb	r8, [r4, #4]
	smulbb	r8, r9, r8
	lsr	r8, r8, #8
	strb	r8, [ip, #4]
	ldrb	r8, [r3, #441]
	ldrb	r9, [r4, #5]
	smulbb	r8, r8, r9
	lsr	r8, r8, #8
	strb	r8, [ip, #5]
	ldrb	r9, [r3, #442]
	ldrb	r8, [r4, #6]
	smulbb	r8, r9, r8
	lsr	r8, r8, #8
	strb	r8, [ip, #6]
	ldrb	r8, [r3, #444]
	ldrb	r9, [r4, #8]
	smulbb	r8, r8, r9
	lsr	r8, r8, #8
	strb	r8, [ip, #10]
	ldrb	r9, [r3, #445]
	ldrb	r8, [r4, #9]
	smulbb	r8, r9, r8
	lsr	r8, r8, #8
	strb	r8, [ip, #11]
	ldrb	r4, [r4, #10]
	ldrb	r8, [r3, #446]
	smulbb	r4, r8, r4
	lsr	r4, r4, #8
	strb	r4, [ip, #12]
	ldrb	r4, [r3, #448]
	strb	r4, [ip, #13]
	ldrb	r4, [r3, #449]
	strb	r4, [ip, #14]
	ldrb	r3, [r3, #450]
	strb	r3, [ip, #15]
	ldr	r3, [r0]
	ldrb	r3, [r3, #6]
	and	r3, r3, #32
	lsr	r3, r3, #5
	strb	r3, [r7, #6]
	ldr	r3, [r0]
	ldrb	r3, [r3, #6]
	and	r3, r3, #64
	lsr	r3, r3, #6
	strb	r3, [r7, #7]
.L004BA018_160:
	add	r6, r6, #1
	cmp	r6, #8
	blt	.L004BA018_30
	b	.L004BA018_2d0
.L004BA018_170:
	add	r3, r5, r6
	ldrb	r3, [r3, #356]
	cmp	r3, #0
	beq	.L004BA018_2c4
	ldrh	ip, [r2, #32]
	ldr	r4, [r1]
	ldrb	r7, [r2, #64]
	add	r8, r6, r6, lsl #1
	rsb	r9, ip, ip, lsl #4
	add	ip, r9, ip, lsl #6
	add	r8, r8, r6, lsl #3
	add	ip, r4, ip, lsl #3
	add	ip, ip, r6, lsl #4
	add	r8, r5, r8, lsl #2
	ldrb	r9, [ip, #436]
	add	r3, r2, #64
	add	r4, r8, #4
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r8, #11]
	ldrb	r9, [ip, #437]
	ldrb	r7, [r2, #65]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r8, #12]
	ldrb	r7, [ip, #438]
	ldrb	r9, [r3, #2]
	smulbb	r7, r7, r9
	lsr	r7, r7, #8
	strb	r7, [r8, #13]
	ldrb	r7, [ip, #440]
	ldrb	r9, [r3, #4]
	smulbb	r7, r7, r9
	lsr	r7, r7, #8
	strb	r7, [r4, #4]
	ldrb	r9, [ip, #441]
	ldrb	r7, [r3, #5]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r4, #5]
	ldrb	r7, [ip, #442]
	ldrb	r9, [r3, #6]
	smulbb	r7, r7, r9
	lsr	r7, r7, #8
	strb	r7, [r4, #6]
	ldrb	r9, [ip, #444]
	ldrb	r7, [r3, #8]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r4, #10]
	ldrb	r9, [ip, #445]
	ldrb	r7, [r3, #9]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r4, #11]
	ldrb	r9, [ip, #446]
	ldrb	r7, [r3, #10]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r4, #12]
	ldrb	r9, [ip, #448]
	ldrb	r7, [r3, #12]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r4, #13]
	ldrb	r9, [ip, #449]
	ldrb	r7, [r3, #13]
	smulbb	r7, r9, r7
	lsr	r7, r7, #8
	strb	r7, [r4, #14]
	ldrb	ip, [ip, #450]
	ldrb	r3, [r3, #14]
	smulbb	r3, ip, r3
	lsr	r3, r3, #8
	strb	r3, [r4, #15]
	ldr	r3, [r0]
	ldrb	r3, [r3, #6]
	and	r3, r3, #32
	lsr	r3, r3, #5
	strb	r3, [r8, #6]
	ldr	r3, [r0]
	ldrb	r3, [r3, #6]
	and	r3, r3, #64
	lsr	r3, r3, #6
	strb	r3, [r8, #7]
.L004BA018_2c4:
	add	r6, r6, #1
	cmp	r6, #8
	blt	.L004BA018_170
.L004BA018_2d0:
	ldrh	r0, [r2, #32]
	add	ip, r2, #60
	add	r3, r2, #64
	ldr	r1, [r1]
	rsb	r2, r0, r0, lsl #4
	add	r0, r2, r0, lsl #6
	ldrb	r2, [r3]
	add	r1, r1, r0, lsl #3
	mov	r4, #255
	ldrb	r0, [r1, #564]!
	smulbb	r0, r2, r0
	ldrb	r2, [ip]
	add	r0, r2, r0, lsr #8
	cmp	r0, #255
	mov	r2, #0
	movgt	r0, r4
	bgt	.L004BA018_31c
	cmp	r0, #0
	movlt	r0, r2
.L004BA018_31c:
	strb	r0, [r5]
	ldrb	r0, [r3, #1]
	ldrb	r2, [r1, #1]
	mov	r4, #255
	smulbb	r0, r0, r2
	ldrb	r2, [ip, #1]
	add	r0, r2, r0, lsr #8
	cmp	r0, #255
	mov	r2, #0
	movgt	r0, r4
	bgt	.L004BA018_350
	cmp	r0, #0
	movlt	r0, r2
.L004BA018_350:
	strb	r0, [r5, #1]
	ldrb	r0, [r3, #2]
	ldrb	r1, [r1, #2]
	mov	r2, #255
	smulbb	r0, r0, r1
	ldrb	r1, [ip, #2]
	add	r0, r1, r0, lsr #8
	cmp	r0, #255
	mov	r1, #0
	movgt	r0, r2
	bgt	.L004BA018_384
	cmp	r0, #0
	movlt	r0, r1
.L004BA018_384:
	strb	r0, [r5, #2]
	pop	{r4, r5, r6, r7, r8, r9}
	bx	lr
```
