.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0019B290,"ax",%progbits
.balign 4
.global func_0019B290
.type func_0019B290, %function
func_0019B290:
.Lfunc_0019B290_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
.Lfunc_0019B290_4:
	sub	sp, sp, #256
.Lfunc_0019B290_8:
	add	r3, r0, #128
.Lfunc_0019B290_c:
	add	r4, pc, #452
.Lfunc_0019B290_10:
	push	{r1, r2}
.Lfunc_0019B290_14:
	add	r2, pc, #468
.Lfunc_0019B290_18:
	add	r1, sp, #8
.Lfunc_0019B290_1c:
	ldmdb	r2, {r5, fp}
.Lfunc_0019B290_20:
	ldm	r0!, {r6, r7, r8, r9}
.Lfunc_0019B290_24:
	mov	ip, #16777216
.Lfunc_0019B290_28:
	orr	ip, ip, #256
.Lfunc_0019B290_2c:
	sadd16	sl, r6, r7
.Lfunc_0019B290_30:
	ssub16	r7, r6, r7
.Lfunc_0019B290_34:
	sadd16	lr, r9, r8
.Lfunc_0019B290_38:
	ssub16	r8, r9, r8
.Lfunc_0019B290_3c:
	ssub16	r6, sl, lr
.Lfunc_0019B290_40:
	sadd16	sl, sl, lr
.Lfunc_0019B290_44:
	add	lr, r6, r6, lsl #16
.Lfunc_0019B290_48:
	smlad	r9, sl, ip, r5
.Lfunc_0019B290_4c:
	smusd	sl, sl, ip
.Lfunc_0019B290_50:
	smuad	ip, lr, fp
.Lfunc_0019B290_54:
	smusd	lr, lr, fp
.Lfunc_0019B290_58:
	sadd16	r6, r8, r7
.Lfunc_0019B290_5c:
	add	r8, r7, r7, lsl #16
.Lfunc_0019B290_60:
	stmia	r1!, {r9, sl, ip, lr}
.Lfunc_0019B290_64:
	pkhbt	r7, r7, r6
.Lfunc_0019B290_68:
	add	r6, r6, r6, asr #16
.Lfunc_0019B290_6c:
	ldm	r2, {r9, sl, ip, lr}
.Lfunc_0019B290_70:
	pkhbt	r8, r6, r8
.Lfunc_0019B290_74:
	smuad	r6, r7, fp
.Lfunc_0019B290_78:
	smusd	r7, r7, fp
.Lfunc_0019B290_7c:
	smlad	r9, r8, r9, r6
.Lfunc_0019B290_80:
	smlad	sl, r8, sl, r7
.Lfunc_0019B290_84:
	smlad	ip, r8, ip, r7
.Lfunc_0019B290_88:
	smlad	lr, r8, lr, r6
.Lfunc_0019B290_8c:
	ldrb	r8, [r4], #1
.Lfunc_0019B290_90:
	cmp	r0, r3
.Lfunc_0019B290_94:
	stm	r1, {r9, sl, ip, lr}
.Lfunc_0019B290_98:
	add	r1, sp, r8
.Lfunc_0019B290_9c:
	bcc	.Lfunc_0019B290_20
.Lfunc_0019B290_a0:
	ldr	r6, [r1]
.Lfunc_0019B290_a4:
	ldr	r7, [r1, #32]
.Lfunc_0019B290_a8:
	ldr	r8, [r1, #64]
.Lfunc_0019B290_ac:
	ldr	r9, [r1, #96]
.Lfunc_0019B290_b0:
	ldr	sl, [r1, #128]
.Lfunc_0019B290_b4:
	ldr	fp, [r1, #160]
.Lfunc_0019B290_b8:
	ldr	ip, [r1, #192]
.Lfunc_0019B290_bc:
	ldr	lr, [r1, #224]
.Lfunc_0019B290_c0:
	add	r2, pc, #320
.Lfunc_0019B290_c4:
	mov	r3, #32768
.Lfunc_0019B290_c8:
	add	r5, r6, r7
.Lfunc_0019B290_cc:
	sub	r6, r6, r7
.Lfunc_0019B290_d0:
	add	r7, r8, r9
.Lfunc_0019B290_d4:
	sub	r8, r8, r9
.Lfunc_0019B290_d8:
	add	r9, sl, fp
.Lfunc_0019B290_dc:
	sub	sl, sl, fp
.Lfunc_0019B290_e0:
	add	fp, ip, lr
.Lfunc_0019B290_e4:
	sub	ip, ip, lr
.Lfunc_0019B290_e8:
	add	lr, r5, fp
.Lfunc_0019B290_ec:
	sub	fp, r5, fp
.Lfunc_0019B290_f0:
	sub	r5, r7, r9
.Lfunc_0019B290_f4:
	add	r7, r7, r9
.Lfunc_0019B290_f8:
	add	r9, r5, fp
.Lfunc_0019B290_fc:
	add	r5, lr, #128
.Lfunc_0019B290_100:
	add	lr, r5, r7
.Lfunc_0019B290_104:
	sub	r7, r5, r7
.Lfunc_0019B290_108:
	asr	lr, lr, #8
.Lfunc_0019B290_10c:
	pkhbt	lr, lr, r7, lsl #8
.Lfunc_0019B290_110:
	ldmdb	r2, {r0, r1}
.Lfunc_0019B290_114:
	add	ip, ip, r6
.Lfunc_0019B290_118:
	add	sl, sl, r8
.Lfunc_0019B290_11c:
	add	r8, r8, r6
.Lfunc_0019B290_120:
	add	ip, ip, sl
.Lfunc_0019B290_124:
	mla	r7, r0, r9, r3
.Lfunc_0019B290_128:
	mla	r9, r1, r9, r3
.Lfunc_0019B290_12c:
	mla	r5, r0, sl, r3
.Lfunc_0019B290_130:
	mla	sl, r1, sl, r3
.Lfunc_0019B290_134:
	ldm	r2, {r0, r1, r2, r3}
.Lfunc_0019B290_138:
	add	r7, r7, fp, lsl #8
.Lfunc_0019B290_13c:
	add	r9, r9, fp, lsl #8
.Lfunc_0019B290_140:
	add	fp, r5, r6, lsl #8
.Lfunc_0019B290_144:
	add	sl, sl, r6, lsl #8
.Lfunc_0019B290_148:
	mul	r6, r0, ip
.Lfunc_0019B290_14c:
	mul	ip, r1, ip
.Lfunc_0019B290_150:
	ldrd	r0, [sp]
.Lfunc_0019B290_154:
	mla	r6, r2, r8, r6
.Lfunc_0019B290_158:
	mla	r8, r3, r8, ip
.Lfunc_0019B290_15c:
	ldm	r0!, {r2, r3}
.Lfunc_0019B290_160:
	mov	r5, #2048
.Lfunc_0019B290_164:
	add	ip, fp, r6
.Lfunc_0019B290_168:
	sub	r6, fp, r6
.Lfunc_0019B290_16c:
	add	fp, sl, r8
.Lfunc_0019B290_170:
	sub	r8, sl, r8
.Lfunc_0019B290_174:
	smlatb	r7, r7, r3, r5
.Lfunc_0019B290_178:
	smlatt	fp, fp, r3, r5
.Lfunc_0019B290_17c:
	smlabb	sl, lr, r2, r5
.Lfunc_0019B290_180:
	smlatt	ip, ip, r2, r5
.Lfunc_0019B290_184:
	ldm	r0!, {r2, r3}
.Lfunc_0019B290_188:
	asr	r7, r7, #12
.Lfunc_0019B290_18c:
	asr	sl, sl, #12
.Lfunc_0019B290_190:
	pkhbt	r7, r7, fp, lsl #4
.Lfunc_0019B290_194:
	smlatb	lr, lr, r2, r5
.Lfunc_0019B290_198:
	smlatt	r8, r8, r2, r5
.Lfunc_0019B290_19c:
	smlatb	r9, r9, r3, r5
.Lfunc_0019B290_1a0:
	smlatt	r5, r6, r3, r5
.Lfunc_0019B290_1a4:
	pkhbt	r6, sl, ip, lsl #4
.Lfunc_0019B290_1a8:
	ldrb	sl, [r4], #1
.Lfunc_0019B290_1ac:
	asr	lr, lr, #12
.Lfunc_0019B290_1b0:
	pkhbt	r8, lr, r8, lsl #4
.Lfunc_0019B290_1b4:
	asr	r9, r9, #12
.Lfunc_0019B290_1b8:
	pkhbt	r9, r9, r5, lsl #4
.Lfunc_0019B290_1bc:
	stmia	r1!, {r6, r7, r8, r9}
.Lfunc_0019B290_1c0:
	cmp	sl, #255
.Lfunc_0019B290_1c4:
	strd	r0, [sp]
.Lfunc_0019B290_1c8:
	add	r1, sp, sl
.Lfunc_0019B290_1cc:
	bne	.Lfunc_0019B290_a0
.Lfunc_0019B290_1d0:
	add	sp, sp, #264
.Lfunc_0019B290_1d4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.size func_0019B290, .-func_0019B290

.section .text.func_001D1BF8,"ax",%progbits
.balign 4
.global func_001D1BF8
.type func_001D1BF8, %function
func_001D1BF8:
.Lfunc_001D1BF8_0:
	cmp	r0, #0
.Lfunc_001D1BF8_4:
	add	ip, pc, #156
.Lfunc_001D1BF8_8:
	movne	r3, #0
.Lfunc_001D1BF8_c:
	push	{r4}
.Lfunc_001D1BF8_10:
	beq	.Lfunc_001D1BF8_9c
.Lfunc_001D1BF8_14:
	cmp	r2, #1
.Lfunc_001D1BF8_18:
	beq	.Lfunc_001D1BF8_70
.Lfunc_001D1BF8_1c:
	cmp	r2, #2
.Lfunc_001D1BF8_20:
	beq	.Lfunc_001D1BF8_88
.Lfunc_001D1BF8_24:
	b	.Lfunc_001D1BF8_9c
.Lfunc_001D1BF8_28:
	add	r4, r3, r3, lsl #1
.Lfunc_001D1BF8_2c:
	ldr	r4, [r0, r4, lsl #2]
.Lfunc_001D1BF8_30:
	cmp	r4, r1
.Lfunc_001D1BF8_34:
	addne	r3, r3, #1
.Lfunc_001D1BF8_38:
	bne	.Lfunc_001D1BF8_14
.Lfunc_001D1BF8_3c:
	cmp	r2, #1
.Lfunc_001D1BF8_40:
	beq	.Lfunc_001D1BF8_50
.Lfunc_001D1BF8_44:
	cmp	r2, #2
.Lfunc_001D1BF8_48:
	beq	.Lfunc_001D1BF8_60
.Lfunc_001D1BF8_4c:
	b	.Lfunc_001D1BF8_9c
.Lfunc_001D1BF8_50:
	add	r1, r3, r3, lsl #1
.Lfunc_001D1BF8_54:
	add	r0, r0, r1, lsl #2
.Lfunc_001D1BF8_58:
	ldr	ip, [r0, #4]
.Lfunc_001D1BF8_5c:
	b	.Lfunc_001D1BF8_9c
.Lfunc_001D1BF8_60:
	add	r1, r3, r3, lsl #1
.Lfunc_001D1BF8_64:
	add	r0, r0, r1, lsl #2
.Lfunc_001D1BF8_68:
	ldr	ip, [r0, #8]
.Lfunc_001D1BF8_6c:
	b	.Lfunc_001D1BF8_9c
.Lfunc_001D1BF8_70:
	add	r4, r3, r3, lsl #1
.Lfunc_001D1BF8_74:
	add	r4, r0, r4, lsl #2
.Lfunc_001D1BF8_78:
	ldr	r4, [r4, #4]
.Lfunc_001D1BF8_7c:
	cmp	r4, #0
.Lfunc_001D1BF8_80:
	bne	.Lfunc_001D1BF8_28
.Lfunc_001D1BF8_84:
	b	.Lfunc_001D1BF8_9c
.Lfunc_001D1BF8_88:
	add	r4, r3, r3, lsl #1
.Lfunc_001D1BF8_8c:
	add	r4, r0, r4, lsl #2
.Lfunc_001D1BF8_90:
	ldr	r4, [r4, #8]
.Lfunc_001D1BF8_94:
	cmp	r4, #0
.Lfunc_001D1BF8_98:
	bne	.Lfunc_001D1BF8_28
.Lfunc_001D1BF8_9c:
	pop	{r4}
.Lfunc_001D1BF8_a0:
	mov	r0, ip
.Lfunc_001D1BF8_a4:
	bx	lr
.size func_001D1BF8, .-func_001D1BF8

.section .text.func_00172044,"ax",%progbits
.balign 4
.global func_00172044
.type func_00172044, %function
func_00172044:
.Lfunc_00172044_0:
	push	{r4}
.Lfunc_00172044_4:
	ldr	r3, [r0, #48]
.Lfunc_00172044_8:
	mov	ip, r3
.Lfunc_00172044_c:
	ldr	r2, [r3, #4]
.Lfunc_00172044_10:
	cmp	r2, #0
.Lfunc_00172044_14:
	beq	.Lfunc_00172044_34
.Lfunc_00172044_18:
	ldr	r4, [r2, #16]
.Lfunc_00172044_1c:
	cmp	r4, r1
.Lfunc_00172044_20:
	movcs	ip, r2
.Lfunc_00172044_24:
	ldrcs	r2, [r2, #8]
.Lfunc_00172044_28:
	ldrcc	r2, [r2, #12]
.Lfunc_00172044_2c:
	cmp	r2, #0
.Lfunc_00172044_30:
	bne	.Lfunc_00172044_18
.Lfunc_00172044_34:
	cmp	ip, r3
.Lfunc_00172044_38:
	beq	.Lfunc_00172044_48
.Lfunc_00172044_3c:
	ldr	r2, [ip, #16]
.Lfunc_00172044_40:
	cmp	r2, r1
.Lfunc_00172044_44:
	movls	r3, ip
.Lfunc_00172044_48:
	ldr	r0, [r0, #48]
.Lfunc_00172044_4c:
	cmp	r3, r0
.Lfunc_00172044_50:
	ldrne	r0, [r3, #20]
.Lfunc_00172044_54:
	pop	{r4}
.Lfunc_00172044_58:
	moveq	r0, #0
.Lfunc_00172044_5c:
	bx	lr
.size func_00172044, .-func_00172044

.section .text.func_00174064,"ax",%progbits
.balign 4
.global func_00174064
.type func_00174064, %function
func_00174064:
.Lfunc_00174064_0:
	push	{r4}
.Lfunc_00174064_4:
	str	r1, [r0]
.Lfunc_00174064_8:
	mov	r1, #0
.Lfunc_00174064_c:
	ldr	r3, [r0]
.Lfunc_00174064_10:
	ldrex	r2, [r3]
.Lfunc_00174064_14:
	and	ip, r2, #255
.Lfunc_00174064_18:
	cmp	ip, #15
.Lfunc_00174064_1c:
	lsl	ip, r1, #8
.Lfunc_00174064_20:
	biccs	r2, r2, #255
.Lfunc_00174064_24:
	and	r4, ip, #65280
.Lfunc_00174064_28:
	orrcs	r2, r2, r1
.Lfunc_00174064_2c:
	bic	r2, r2, #65280
.Lfunc_00174064_30:
	lsl	ip, r1, #16
.Lfunc_00174064_34:
	orr	r2, r2, r4
.Lfunc_00174064_38:
	and	ip, ip, #16711680
.Lfunc_00174064_3c:
	bic	r2, r2, #16711680
.Lfunc_00174064_40:
	orr	r2, r2, ip
.Lfunc_00174064_44:
	bic	r2, r2, #-16777216
.Lfunc_00174064_48:
	orr	r2, r2, r1, lsl #24
.Lfunc_00174064_4c:
	strex	ip, r2, [r3]
.Lfunc_00174064_50:
	cmp	ip, #0
.Lfunc_00174064_54:
	bne	.Lfunc_00174064_c
.Lfunc_00174064_58:
	pop	{r4}
.Lfunc_00174064_5c:
	bx	lr
.size func_00174064, .-func_00174064

.section .text.func_00175F08,"ax",%progbits
.balign 4
.global func_00175F08
.type func_00175F08, %function
func_00175F08:
.Lfunc_00175F08_0:
	mov	r2, r0
.Lfunc_00175F08_4:
	cmp	r1, #1
.Lfunc_00175F08_8:
	mov	r0, #0
.Lfunc_00175F08_c:
	push	{r4}
.Lfunc_00175F08_10:
	bls	.Lfunc_00175F08_58
.Lfunc_00175F08_14:
	lsl	r3, r1, #30
.Lfunc_00175F08_18:
	sub	r2, r2, #2
.Lfunc_00175F08_1c:
	cmp	r3, #0
.Lfunc_00175F08_20:
	ldrhlt	r0, [r2, #2]!
.Lfunc_00175F08_24:
	lsrs	r1, r1, #2
.Lfunc_00175F08_28:
	mov	r3, #0
.Lfunc_00175F08_2c:
	beq	.Lfunc_00175F08_50
.Lfunc_00175F08_30:
	ldrh	ip, [r2, #2]
.Lfunc_00175F08_34:
	ldrh	r4, [r2, #4]!
.Lfunc_00175F08_38:
	subs	r1, r1, #1
.Lfunc_00175F08_3c:
	add	r0, r0, ip
.Lfunc_00175F08_40:
	add	r3, r3, r4
.Lfunc_00175F08_44:
	uxth	r0, r0
.Lfunc_00175F08_48:
	uxth	r3, r3
.Lfunc_00175F08_4c:
	bne	.Lfunc_00175F08_30
.Lfunc_00175F08_50:
	add	r0, r0, r3
.Lfunc_00175F08_54:
	uxth	r0, r0
.Lfunc_00175F08_58:
	pop	{r4}
.Lfunc_00175F08_5c:
	bx	lr
.size func_00175F08, .-func_00175F08

.section .text.func_0017A5B8,"ax",%progbits
.balign 4
.global func_0017A5B8
.type func_0017A5B8, %function
func_0017A5B8:
.Lfunc_0017A5B8_0:
	mov	r2, #0
.Lfunc_0017A5B8_4:
	push	{r4}
.Lfunc_0017A5B8_8:
	ldr	r3, [r0]
.Lfunc_0017A5B8_c:
	ldrex	r1, [r3]
.Lfunc_0017A5B8_10:
	and	ip, r1, #255
.Lfunc_0017A5B8_14:
	cmp	ip, #15
.Lfunc_0017A5B8_18:
	lsl	ip, r2, #8
.Lfunc_0017A5B8_1c:
	biccs	r1, r1, #255
.Lfunc_0017A5B8_20:
	and	r4, ip, #65280
.Lfunc_0017A5B8_24:
	orrcs	r1, r1, r2
.Lfunc_0017A5B8_28:
	bic	r1, r1, #65280
.Lfunc_0017A5B8_2c:
	lsl	ip, r2, #16
.Lfunc_0017A5B8_30:
	orr	r1, r1, r4
.Lfunc_0017A5B8_34:
	and	ip, ip, #16711680
.Lfunc_0017A5B8_38:
	bic	r1, r1, #16711680
.Lfunc_0017A5B8_3c:
	orr	r1, r1, ip
.Lfunc_0017A5B8_40:
	bic	r1, r1, #-16777216
.Lfunc_0017A5B8_44:
	orr	r1, r1, r2, lsl #24
.Lfunc_0017A5B8_48:
	strex	ip, r1, [r3]
.Lfunc_0017A5B8_4c:
	cmp	ip, #0
.Lfunc_0017A5B8_50:
	bne	.Lfunc_0017A5B8_8
.Lfunc_0017A5B8_54:
	str	r2, [r0]
.Lfunc_0017A5B8_58:
	pop	{r4}
.Lfunc_0017A5B8_5c:
	bx	lr
.size func_0017A5B8, .-func_0017A5B8

.section .text.func_0041091C,"ax",%progbits
.balign 4
.global func_0041091C
.type func_0041091C, %function
func_0041091C:
.Lfunc_0041091C_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_0041091C_4:
	mov	ip, r0
.Lfunc_0041091C_8:
	mov	r0, #0
.Lfunc_0041091C_c:
	ldr	r4, [ip]
.Lfunc_0041091C_10:
	ldr	r5, [r1]
.Lfunc_0041091C_14:
	mov	r7, #1
.Lfunc_0041091C_18:
	b	.Lfunc_0041091C_44
.Lfunc_0041091C_1c:
	add	r0, r0, #1
.Lfunc_0041091C_20:
	lsl	r6, r7, r0
.Lfunc_0041091C_24:
	add	r8, r6, r4
.Lfunc_0041091C_28:
	add	r9, r6, r5
.Lfunc_0041091C_2c:
	sub	r6, r8, #1
.Lfunc_0041091C_30:
	sub	r8, r9, #1
.Lfunc_0041091C_34:
	asr	r6, r6, r0
.Lfunc_0041091C_38:
	asr	r8, r8, r0
.Lfunc_0041091C_3c:
	str	r6, [ip]
.Lfunc_0041091C_40:
	str	r8, [r1]
.Lfunc_0041091C_44:
	ldr	r6, [ip]
.Lfunc_0041091C_48:
	cmp	r6, r2
.Lfunc_0041091C_4c:
	ldrle	r6, [r1]
.Lfunc_0041091C_50:
	cmple	r6, r3
.Lfunc_0041091C_54:
	bgt	.Lfunc_0041091C_1c
.Lfunc_0041091C_58:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_0041091C_5c:
	bx	lr
.size func_0041091C, .-func_0041091C

.section .text.func_0014E104,"ax",%progbits
.balign 4
.global func_0014E104
.type func_0014E104, %function
func_0014E104:
.Lfunc_0014E104_0:
	ldrh	r1, [r0]
.Lfunc_0014E104_4:
	cmp	r1, #0
.Lfunc_0014E104_8:
	mov	r1, #0
.Lfunc_0014E104_c:
	beq	.Lfunc_0014E104_38
.Lfunc_0014E104_10:
	ldrh	r2, [r0]
.Lfunc_0014E104_14:
	cmp	r2, #16
.Lfunc_0014E104_18:
	addne	r0, r0, #2
.Lfunc_0014E104_1c:
	addne	r1, r1, #1
.Lfunc_0014E104_20:
	beq	.Lfunc_0014E104_40
.Lfunc_0014E104_24:
	cmp	r1, #2048
.Lfunc_0014E104_28:
	bcs	.Lfunc_0014E104_38
.Lfunc_0014E104_2c:
	ldrh	r2, [r0]
.Lfunc_0014E104_30:
	cmp	r2, #0
.Lfunc_0014E104_34:
	bne	.Lfunc_0014E104_10
.Lfunc_0014E104_38:
	mov	r0, r1
.Lfunc_0014E104_3c:
	bx	lr
.Lfunc_0014E104_40:
	ldrh	r3, [r0, #2]
.Lfunc_0014E104_44:
	mov	r2, r0
.Lfunc_0014E104_48:
	add	r3, r3, #2
.Lfunc_0014E104_4c:
	add	r0, r0, r3, lsl #1
.Lfunc_0014E104_50:
	sub	r2, r0, r2
.Lfunc_0014E104_54:
	add	r1, r1, r2, asr #1
.Lfunc_0014E104_58:
	b	.Lfunc_0014E104_24
.size func_0014E104, .-func_0014E104

.section .text.func_004157D8,"ax",%progbits
.balign 4
.global func_004157D8
.type func_004157D8, %function
func_004157D8:
.Lfunc_004157D8_0:
	ldrsb	r3, [r0]
.Lfunc_004157D8_4:
	sub	r1, r3, #48
.Lfunc_004157D8_8:
	cmp	r1, #10
.Lfunc_004157D8_c:
	bcs	.Lfunc_004157D8_44
.Lfunc_004157D8_10:
	ldrsb	r2, [r0, #1]!
.Lfunc_004157D8_14:
	mvn	r1, #47
.Lfunc_004157D8_18:
	sub	r3, r3, #48
.Lfunc_004157D8_1c:
	sub	ip, r2, #48
.Lfunc_004157D8_20:
	cmp	ip, #10
.Lfunc_004157D8_24:
	bcs	.Lfunc_004157D8_44
.Lfunc_004157D8_28:
	add	r3, r3, r3, lsl #2
.Lfunc_004157D8_2c:
	ldrsb	r0, [r0, #1]
.Lfunc_004157D8_30:
	add	ip, r1, r3, lsl #1
.Lfunc_004157D8_34:
	add	r2, r2, ip
.Lfunc_004157D8_38:
	sub	r3, r0, #48
.Lfunc_004157D8_3c:
	cmp	r3, #10
.Lfunc_004157D8_40:
	bcc	.Lfunc_004157D8_4c
.Lfunc_004157D8_44:
	mvn	r0, #0
.Lfunc_004157D8_48:
	bx	lr
.Lfunc_004157D8_4c:
	add	r2, r2, r2, lsl #2
.Lfunc_004157D8_50:
	add	r1, r1, r2, lsl #1
.Lfunc_004157D8_54:
	add	r0, r0, r1
.Lfunc_004157D8_58:
	bx	lr
.size func_004157D8, .-func_004157D8

.section .text.func_00470CBC,"ax",%progbits
.balign 4
.global func_00470CBC
.type func_00470CBC, %function
func_00470CBC:
.Lfunc_00470CBC_0:
	mov	r1, #0
.Lfunc_00470CBC_4:
	mov	r2, #1
.Lfunc_00470CBC_8:
	str	r1, [r0]
.Lfunc_00470CBC_c:
	mvn	r3, #0
.Lfunc_00470CBC_10:
	strb	r2, [r0, #4]
.Lfunc_00470CBC_14:
	str	r3, [r0, #8]
.Lfunc_00470CBC_18:
	strb	r1, [r0, #12]
.Lfunc_00470CBC_1c:
	strb	r1, [r0, #13]
.Lfunc_00470CBC_20:
	strb	r1, [r0, #14]
.Lfunc_00470CBC_24:
	strb	r2, [r0, #15]
.Lfunc_00470CBC_28:
	strb	r1, [r0, #16]
.Lfunc_00470CBC_2c:
	strb	r2, [r0, #17]
.Lfunc_00470CBC_30:
	add	ip, r0, #28
.Lfunc_00470CBC_34:
	str	r1, [r0, #20]
.Lfunc_00470CBC_38:
	str	r1, [r0, #24]
.Lfunc_00470CBC_3c:
	stm	ip, {r1, r3}
.Lfunc_00470CBC_40:
	add	r3, r0, #48
.Lfunc_00470CBC_44:
	strb	r1, [r0, #36]
.Lfunc_00470CBC_48:
	str	r1, [r0, #40]
.Lfunc_00470CBC_4c:
	strb	r1, [r0, #44]
.Lfunc_00470CBC_50:
	stm	r3, {r1, r2}
.Lfunc_00470CBC_54:
	strb	r1, [r0, #56]
.Lfunc_00470CBC_58:
	bx	lr
.size func_00470CBC, .-func_00470CBC

.section .text.func_0047CCA0,"ax",%progbits
.balign 4
.global func_0047CCA0
.type func_0047CCA0, %function
func_0047CCA0:
.Lfunc_0047CCA0_0:
	cmp	r1, #0
.Lfunc_0047CCA0_4:
	bxeq	lr
.Lfunc_0047CCA0_8:
	ldrsb	ip, [r0, #10]
.Lfunc_0047CCA0_c:
	mov	r2, #0
.Lfunc_0047CCA0_10:
	cmp	ip, #0
.Lfunc_0047CCA0_14:
	ldrgt	r3, [r0, #24]
.Lfunc_0047CCA0_18:
	bxle	lr
.Lfunc_0047CCA0_1c:
	push	{r4}
.Lfunc_0047CCA0_20:
	ldr	r4, [r3, r2, lsl #2]
.Lfunc_0047CCA0_24:
	cmp	r4, r1
.Lfunc_0047CCA0_28:
	bne	.Lfunc_0047CCA0_48
.Lfunc_0047CCA0_2c:
	mov	r1, #0
.Lfunc_0047CCA0_30:
	str	r1, [r3, r2, lsl #2]
.Lfunc_0047CCA0_34:
	ldrb	r1, [r0, #11]
.Lfunc_0047CCA0_38:
	sub	r1, r1, #1
.Lfunc_0047CCA0_3c:
	strb	r1, [r0, #11]
.Lfunc_0047CCA0_40:
	pop	{r4}
.Lfunc_0047CCA0_44:
	bx	lr
.Lfunc_0047CCA0_48:
	add	r2, r2, #1
.Lfunc_0047CCA0_4c:
	cmp	ip, r2
.Lfunc_0047CCA0_50:
	bgt	.Lfunc_0047CCA0_20
.Lfunc_0047CCA0_54:
	pop	{r4}
.Lfunc_0047CCA0_58:
	bx	lr
.size func_0047CCA0, .-func_0047CCA0

.section .text.func_00136240,"ax",%progbits
.balign 4
.global func_00136240
.type func_00136240, %function
func_00136240:
.Lfunc_00136240_0:
	mov	r2, #0
.Lfunc_00136240_4:
	str	r2, [r0, #4]
.Lfunc_00136240_8:
	strh	r2, [r0, #8]
.Lfunc_00136240_c:
	str	r2, [r0, #12]
.Lfunc_00136240_10:
	strh	r2, [r0, #16]
.Lfunc_00136240_14:
	str	r2, [r0, #20]
.Lfunc_00136240_18:
	add	r1, r0, #24
.Lfunc_00136240_1c:
	mvn	ip, #0
.Lfunc_00136240_20:
	stm	r1, {r2, ip}
.Lfunc_00136240_24:
	str	r2, [r0, #44]
.Lfunc_00136240_28:
	str	r2, [r0, #48]
.Lfunc_00136240_2c:
	str	r2, [r0, #184]
.Lfunc_00136240_30:
	strh	r2, [r0, #188]
.Lfunc_00136240_34:
	str	r2, [r0, #192]
.Lfunc_00136240_38:
	strh	r2, [r0, #196]
.Lfunc_00136240_3c:
	str	r2, [r0, #200]
.Lfunc_00136240_40:
	add	r3, r0, #204
.Lfunc_00136240_44:
	stm	r3, {r2, ip}
.Lfunc_00136240_48:
	str	r2, [r0, #224]
.Lfunc_00136240_4c:
	str	r2, [r0, #228]
.Lfunc_00136240_50:
	strb	r2, [r0, #397]
.Lfunc_00136240_54:
	bx	lr
.size func_00136240, .-func_00136240

.section .text.func_00169050,"ax",%progbits
.balign 4
.global func_00169050
.type func_00169050, %function
func_00169050:
.Lfunc_00169050_0:
	mov	r2, r0
.Lfunc_00169050_4:
	mov	r0, r1
.Lfunc_00169050_8:
	uxth	r1, r2
.Lfunc_00169050_c:
	eor	r1, r1, r2, lsr #16
.Lfunc_00169050_10:
	uxth	r3, r0
.Lfunc_00169050_14:
	eor	r2, r1, r0, lsr #16
.Lfunc_00169050_18:
	eor	r2, r2, r3
.Lfunc_00169050_1c:
	cmp	r2, #16
.Lfunc_00169050_20:
	push	{r4, lr}
.Lfunc_00169050_24:
	bcs	.Lfunc_00169050_54
.Lfunc_00169050_28:
	eor	r4, r0, #268435456
.Lfunc_00169050_2c:
	uxth	r0, r4
.Lfunc_00169050_30:
	eor	r1, r1, r4, lsr #16
.Lfunc_00169050_34:
	eor	r0, r0, r1
.Lfunc_00169050_38:
	cmp	r0, #16
.Lfunc_00169050_3c:
	bcs	.Lfunc_00169050_50
.Lfunc_00169050_40:
	mov	r2, #0
.Lfunc_00169050_44:
	mov	r1, r2
.Lfunc_00169050_48:
	mov	r0, r2
.Lfunc_00169050_4c:
	mov	r0, r0
.Lfunc_00169050_50:
	mov	r0, r4
.Lfunc_00169050_54:
	pop	{r4, pc}
.size func_00169050, .-func_00169050

.section .text.func_00177E8C,"ax",%progbits
.balign 4
.global func_00177E8C
.type func_00177E8C, %function
func_00177E8C:
.Lfunc_00177E8C_0:
	ands	r2, r1, #-2147483648
.Lfunc_00177E8C_4:
	bpl	.Lfunc_00177E8C_10
.Lfunc_00177E8C_8:
	rsbs	r0, r0, #0
.Lfunc_00177E8C_c:
	rsc	r1, r1, #0
.Lfunc_00177E8C_10:
	orr	r2, r2, #1065353216
.Lfunc_00177E8C_14:
	movs	r3, r1
.Lfunc_00177E8C_18:
	add	r2, r2, #251658240
.Lfunc_00177E8C_1c:
	movne	r3, #32
.Lfunc_00177E8C_20:
	movseq	r1, r0
.Lfunc_00177E8C_24:
	bxeq	lr
.Lfunc_00177E8C_28:
	clz	ip, r1
.Lfunc_00177E8C_2c:
	sub	r3, r3, ip
.Lfunc_00177E8C_30:
	lsl	r1, r1, ip
.Lfunc_00177E8C_34:
	orr	r1, r1, r0, lsr r3
.Lfunc_00177E8C_38:
	add	r2, r2, r3, lsl #23
.Lfunc_00177E8C_3c:
	rsb	r3, r3, #32
.Lfunc_00177E8C_40:
	lsls	ip, r0, r3
.Lfunc_00177E8C_44:
	orrs	ip, ip, r1, lsl #25
.Lfunc_00177E8C_48:
	adc	r0, r2, r1, lsr #8
.Lfunc_00177E8C_4c:
	movsne	ip, #67108864
.Lfunc_00177E8C_50:
	biccs	r0, r0, #1
.Lfunc_00177E8C_54:
	bx	lr
.size func_00177E8C, .-func_00177E8C

.section .text.func_001FC974,"ax",%progbits
.balign 4
.global func_001FC974
.type func_001FC974, %function
func_001FC974:
.Lfunc_001FC974_0:
	mov	r0, r0
.Lfunc_001FC974_4:
	ldr	r3, [r0, #252]
.Lfunc_001FC974_8:
	mov	r2, #1
.Lfunc_001FC974_c:
	mov	r1, #0
.Lfunc_001FC974_10:
	cmp	r3, #0
.Lfunc_001FC974_14:
	ldrgt	ip, [r0, #248]
.Lfunc_001FC974_18:
	ble	.Lfunc_001FC974_48
.Lfunc_001FC974_1c:
	add	r0, r1, r1, lsl #1
.Lfunc_001FC974_20:
	cmp	r2, #0
.Lfunc_001FC974_24:
	add	r0, ip, r0, lsl #2
.Lfunc_001FC974_28:
	beq	.Lfunc_001FC974_38
.Lfunc_001FC974_2c:
	ldrb	r2, [r0, #6]
.Lfunc_001FC974_30:
	cmp	r2, #0
.Lfunc_001FC974_34:
	beq	.Lfunc_001FC974_50
.Lfunc_001FC974_38:
	ldrsb	r2, [r0, #5]
.Lfunc_001FC974_3c:
	add	r1, r1, #1
.Lfunc_001FC974_40:
	cmp	r3, r1
.Lfunc_001FC974_44:
	bgt	.Lfunc_001FC974_1c
.Lfunc_001FC974_48:
	mov	r0, #1
.Lfunc_001FC974_4c:
	bx	lr
.Lfunc_001FC974_50:
	mov	r0, #0
.Lfunc_001FC974_54:
	bx	lr
.size func_001FC974, .-func_001FC974

.section .text.func_0047CC48,"ax",%progbits
.balign 4
.global func_0047CC48
.type func_0047CC48, %function
func_0047CC48:
.Lfunc_0047CC48_0:
	push	{r4, r5}
.Lfunc_0047CC48_4:
	ldrsb	ip, [r0, #10]
.Lfunc_0047CC48_8:
	mov	r4, #0
.Lfunc_0047CC48_c:
	mov	r2, r4
.Lfunc_0047CC48_10:
	cmp	ip, #0
.Lfunc_0047CC48_14:
	ldrgt	r3, [r0, #24]
.Lfunc_0047CC48_18:
	ble	.Lfunc_0047CC48_34
.Lfunc_0047CC48_1c:
	ldr	r5, [r3, r2, lsl #2]
.Lfunc_0047CC48_20:
	cmp	r5, #0
.Lfunc_0047CC48_24:
	beq	.Lfunc_0047CC48_40
.Lfunc_0047CC48_28:
	add	r2, r2, #1
.Lfunc_0047CC48_2c:
	cmp	ip, r2
.Lfunc_0047CC48_30:
	bgt	.Lfunc_0047CC48_1c
.Lfunc_0047CC48_34:
	mov	r0, r4
.Lfunc_0047CC48_38:
	pop	{r4, r5}
.Lfunc_0047CC48_3c:
	bx	lr
.Lfunc_0047CC48_40:
	str	r1, [r3, r2, lsl #2]
.Lfunc_0047CC48_44:
	ldrb	r1, [r0, #11]
.Lfunc_0047CC48_48:
	mov	r4, #1
.Lfunc_0047CC48_4c:
	add	r1, r1, #1
.Lfunc_0047CC48_50:
	strb	r1, [r0, #11]
.Lfunc_0047CC48_54:
	b	.Lfunc_0047CC48_34
.size func_0047CC48, .-func_0047CC48

.section .text.func_00152BC4,"ax",%progbits
.balign 4
.global func_00152BC4
.type func_00152BC4, %function
func_00152BC4:
.Lfunc_00152BC4_0:
	ldr	r3, [r0]
.Lfunc_00152BC4_4:
	cmp	r3, #0
.Lfunc_00152BC4_8:
	ldrne	ip, [r3]
.Lfunc_00152BC4_c:
	cmpne	ip, r2
.Lfunc_00152BC4_10:
	bls	.Lfunc_00152BC4_4c
.Lfunc_00152BC4_14:
	add	r2, r3, r2, lsl #3
.Lfunc_00152BC4_18:
	ldr	r2, [r2, #8]
.Lfunc_00152BC4_1c:
	adds	r2, r2, r3
.Lfunc_00152BC4_20:
	beq	.Lfunc_00152BC4_4c
.Lfunc_00152BC4_24:
	ldr	r3, [r2]
.Lfunc_00152BC4_28:
	str	r3, [r1]
.Lfunc_00152BC4_2c:
	ldr	r2, [r2, #8]
.Lfunc_00152BC4_30:
	ldr	r0, [r0, #4]
.Lfunc_00152BC4_34:
	cmn	r2, #1
.Lfunc_00152BC4_38:
	moveq	r0, #0
.Lfunc_00152BC4_3c:
	addne	r0, r0, r2
.Lfunc_00152BC4_40:
	str	r0, [r1, #4]
.Lfunc_00152BC4_44:
	mov	r0, #1
.Lfunc_00152BC4_48:
	bx	lr
.Lfunc_00152BC4_4c:
	mov	r0, #0
.Lfunc_00152BC4_50:
	bx	lr
.size func_00152BC4, .-func_00152BC4

.section .text.func_0016A850,"ax",%progbits
.balign 4
.global func_0016A850
.type func_0016A850, %function
func_0016A850:
.Lfunc_0016A850_0:
	add	r3, r0, r1, lsl #2
.Lfunc_0016A850_4:
	cmp	r1, #100
.Lfunc_0016A850_8:
	push	{r4, lr}
.Lfunc_0016A850_c:
	add	r0, r0, r1, lsl #1
.Lfunc_0016A850_10:
	strcc	r2, [r3, #4]
.Lfunc_0016A850_14:
	bcc	.Lfunc_0016A850_24
.Lfunc_0016A850_18:
	cmp	r1, #200
.Lfunc_0016A850_1c:
	strhcc	r2, [r0, #204]
.Lfunc_0016A850_20:
	bcs	.Lfunc_0016A850_3c
.Lfunc_0016A850_24:
	cmp	r1, #100
.Lfunc_0016A850_28:
	ldrcc	r0, [r3, #4]
.Lfunc_0016A850_2c:
	bcc	.Lfunc_0016A850_50
.Lfunc_0016A850_30:
	cmp	r1, #200
.Lfunc_0016A850_34:
	ldrhcc	r0, [r0, #204]
.Lfunc_0016A850_38:
	bcc	.Lfunc_0016A850_50
.Lfunc_0016A850_3c:
	mov	r2, #0
.Lfunc_0016A850_40:
	mov	r1, r2
.Lfunc_0016A850_44:
	mov	r0, r2
.Lfunc_0016A850_48:
	mov	r0, r0
.Lfunc_0016A850_4c:
	mov	r0, #0
.Lfunc_0016A850_50:
	pop	{r4, pc}
.size func_0016A850, .-func_0016A850

.section .text.func_00170D50,"ax",%progbits
.balign 4
.global func_00170D50
.type func_00170D50, %function
func_00170D50:
.Lfunc_00170D50_0:
	push	{r4}
.Lfunc_00170D50_4:
	ldrd	r2, [r0, #8]
.Lfunc_00170D50_8:
	mov	ip, #1
.Lfunc_00170D50_c:
	ldr	r4, [r2, #16]
.Lfunc_00170D50_10:
	sub	r4, r4, r3
.Lfunc_00170D50_14:
	cmp	r4, #1
.Lfunc_00170D50_18:
	movcc	r2, #0
.Lfunc_00170D50_1c:
	strbcc	ip, [r0, #4]
.Lfunc_00170D50_20:
	bcc	.Lfunc_00170D50_3c
.Lfunc_00170D50_24:
	ldr	r4, [r2, #12]
.Lfunc_00170D50_28:
	ldr	r2, [r2, #24]
.Lfunc_00170D50_2c:
	add	ip, r3, #1
.Lfunc_00170D50_30:
	add	r2, r2, r4
.Lfunc_00170D50_34:
	ldrsb	r2, [r2, r3]
.Lfunc_00170D50_38:
	str	ip, [r0, #12]
.Lfunc_00170D50_3c:
	sxtb	r2, r2
.Lfunc_00170D50_40:
	cmp	r2, #0
.Lfunc_00170D50_44:
	movne	r2, #1
.Lfunc_00170D50_48:
	strb	r2, [r1]
.Lfunc_00170D50_4c:
	pop	{r4}
.Lfunc_00170D50_50:
	bx	lr
.size func_00170D50, .-func_00170D50

.section .text.func_001E711C,"ax",%progbits
.balign 4
.global func_001E711C
.type func_001E711C, %function
func_001E711C:
.Lfunc_001E711C_0:
	push	{r4, r5, r6, lr}
.Lfunc_001E711C_4:
	mov	r4, r0
.Lfunc_001E711C_8:
	ldr	r0, [r0, #8]
.Lfunc_001E711C_c:
	mov	r5, r1
.Lfunc_001E711C_10:
	cmp	r0, #0
.Lfunc_001E711C_14:
	beq	.Lfunc_001E711C_28
.Lfunc_001E711C_18:
	mov	r2, #0
.Lfunc_001E711C_1c:
	mov	r1, r2
.Lfunc_001E711C_20:
	mov	r0, r2
.Lfunc_001E711C_24:
	mov	r0, r0
.Lfunc_001E711C_28:
	ldr	r0, [r4]
.Lfunc_001E711C_2c:
	cmp	r0, #0
.Lfunc_001E711C_30:
	ldrne	r0, [r0, #4]
.Lfunc_001E711C_34:
	strne	r0, [r5, #4]
.Lfunc_001E711C_38:
	bne	.Lfunc_001E711C_4c
.Lfunc_001E711C_3c:
	mov	r2, #0
.Lfunc_001E711C_40:
	mov	r1, r2
.Lfunc_001E711C_44:
	mov	r0, r2
.Lfunc_001E711C_48:
	mov	r0, r0
.Lfunc_001E711C_4c:
	str	r5, [r4, #8]
.Lfunc_001E711C_50:
	pop	{r4, r5, r6, pc}
.size func_001E711C, .-func_001E711C

.section .text.func_001FACE4,"ax",%progbits
.balign 4
.global func_001FACE4
.type func_001FACE4, %function
func_001FACE4:
.Lfunc_001FACE4_0:
	ldr	r3, [r0, #8]
.Lfunc_001FACE4_4:
	ldr	r2, [r3, #8]
.Lfunc_001FACE4_8:
	cmp	r2, #0
.Lfunc_001FACE4_c:
	ble	.Lfunc_001FACE4_4c
.Lfunc_001FACE4_10:
	ldrd	r2, [r3]
.Lfunc_001FACE4_14:
	cmp	r3, r2
.Lfunc_001FACE4_18:
	ble	.Lfunc_001FACE4_30
.Lfunc_001FACE4_1c:
	cmp	r2, r1
.Lfunc_001FACE4_20:
	cmple	r1, r3
.Lfunc_001FACE4_24:
	bge	.Lfunc_001FACE4_4c
.Lfunc_001FACE4_28:
	mov	r0, #1
.Lfunc_001FACE4_2c:
	bx	lr
.Lfunc_001FACE4_30:
	cmp	r1, #0
.Lfunc_001FACE4_34:
	cmpge	r3, r1
.Lfunc_001FACE4_38:
	bgt	.Lfunc_001FACE4_28
.Lfunc_001FACE4_3c:
	cmp	r2, r1
.Lfunc_001FACE4_40:
	ldrle	r0, [r0, #4]
.Lfunc_001FACE4_44:
	cmple	r1, r0
.Lfunc_001FACE4_48:
	blt	.Lfunc_001FACE4_28
.Lfunc_001FACE4_4c:
	mov	r0, #0
.Lfunc_001FACE4_50:
	bx	lr
.size func_001FACE4, .-func_001FACE4

.section .text.func_0045B5D8,"ax",%progbits
.balign 4
.global func_0045B5D8
.type func_0045B5D8, %function
func_0045B5D8:
.Lfunc_0045B5D8_0:
	add	r3, r2, r2, lsl #2
.Lfunc_0045B5D8_4:
	push	{r4, lr}
.Lfunc_0045B5D8_8:
	cmp	r1, #0
.Lfunc_0045B5D8_c:
	add	r4, r0, r3, lsl #2
.Lfunc_0045B5D8_10:
	addeq	r0, r4, #4
.Lfunc_0045B5D8_14:
	beq	.Lfunc_0045B5D8_40
.Lfunc_0045B5D8_18:
	cmp	r1, #1
.Lfunc_0045B5D8_1c:
	addeq	r0, r4, #104
.Lfunc_0045B5D8_20:
	beq	.Lfunc_0045B5D8_40
.Lfunc_0045B5D8_24:
	cmp	r1, #2
.Lfunc_0045B5D8_28:
	beq	.Lfunc_0045B5D8_44
.Lfunc_0045B5D8_2c:
	mov	r2, #0
.Lfunc_0045B5D8_30:
	mov	r1, r2
.Lfunc_0045B5D8_34:
	mov	r0, r2
.Lfunc_0045B5D8_38:
	mov	r0, r0
.Lfunc_0045B5D8_3c:
	add	r0, r4, #4
.Lfunc_0045B5D8_40:
	pop	{r4, pc}
.Lfunc_0045B5D8_44:
	add	r1, r2, r2, lsl #5
.Lfunc_0045B5D8_48:
	add	r0, r0, r1, lsl #1
.Lfunc_0045B5D8_4c:
	add	r0, r0, #204
.Lfunc_0045B5D8_50:
	pop	{r4, pc}
.size func_0045B5D8, .-func_0045B5D8

.section .text.func_004A9E60,"ax",%progbits
.balign 4
.global func_004A9E60
.type func_004A9E60, %function
func_004A9E60:
.Lfunc_004A9E60_0:
	ldr	r0, [r0, #8]
.Lfunc_004A9E60_4:
	ldrh	r1, [r0]
.Lfunc_004A9E60_8:
	cmp	r1, #0
.Lfunc_004A9E60_c:
	ldrheq	r2, [r0, #-2]
.Lfunc_004A9E60_10:
	cmpeq	r2, #47
.Lfunc_004A9E60_14:
	beq	.Lfunc_004A9E60_4c
.Lfunc_004A9E60_18:
	cmp	r1, #46
.Lfunc_004A9E60_1c:
	ldrheq	r2, [r0, #2]
.Lfunc_004A9E60_20:
	cmpeq	r2, #0
.Lfunc_004A9E60_24:
	beq	.Lfunc_004A9E60_4c
.Lfunc_004A9E60_28:
	cmp	r1, #46
.Lfunc_004A9E60_2c:
	ldrheq	r1, [r0, #2]
.Lfunc_004A9E60_30:
	cmpeq	r1, #46
.Lfunc_004A9E60_34:
	bne	.Lfunc_004A9E60_44
.Lfunc_004A9E60_38:
	ldrh	r0, [r0, #4]
.Lfunc_004A9E60_3c:
	cmp	r0, #0
.Lfunc_004A9E60_40:
	beq	.Lfunc_004A9E60_4c
.Lfunc_004A9E60_44:
	mov	r0, #0
.Lfunc_004A9E60_48:
	bx	lr
.Lfunc_004A9E60_4c:
	mov	r0, #1
.Lfunc_004A9E60_50:
	bx	lr
.size func_004A9E60, .-func_004A9E60

.section .text.func_004C7798,"ax",%progbits
.balign 4
.global func_004C7798
.type func_004C7798, %function
func_004C7798:
.Lfunc_004C7798_0:
	ldrb	r3, [r0, #28]
.Lfunc_004C7798_4:
	cmp	r3, #0
.Lfunc_004C7798_8:
	ldreq	r3, [r0, #52]
.Lfunc_004C7798_c:
	beq	.Lfunc_004C7798_20
.Lfunc_004C7798_10:
	ldrb	r3, [r0, #29]
.Lfunc_004C7798_14:
	cmp	r3, #0
.Lfunc_004C7798_18:
	ldreq	r3, [r0, #68]
.Lfunc_004C7798_1c:
	ldrne	r3, [r0, #48]
.Lfunc_004C7798_20:
	ldrh	r3, [r3]
.Lfunc_004C7798_24:
	strh	r3, [r1]
.Lfunc_004C7798_28:
	ldrb	r1, [r0, #28]
.Lfunc_004C7798_2c:
	cmp	r1, #0
.Lfunc_004C7798_30:
	ldreq	r0, [r0, #52]
.Lfunc_004C7798_34:
	beq	.Lfunc_004C7798_48
.Lfunc_004C7798_38:
	ldrb	r1, [r0, #29]
.Lfunc_004C7798_3c:
	cmp	r1, #0
.Lfunc_004C7798_40:
	ldreq	r0, [r0, #68]
.Lfunc_004C7798_44:
	ldrne	r0, [r0, #48]
.Lfunc_004C7798_48:
	ldrh	r0, [r0, #2]
.Lfunc_004C7798_4c:
	strh	r0, [r2]
.Lfunc_004C7798_50:
	bx	lr
.size func_004C7798, .-func_004C7798
