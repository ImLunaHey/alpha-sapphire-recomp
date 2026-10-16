.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0015DCBC,"ax",%progbits
.balign 4
.global func_0015DCBC
.type func_0015DCBC, %function
func_0015DCBC:
.Lfunc_0015DCBC_0:
	cmp	r2, #0
.Lfunc_0015DCBC_4:
	beq	.Lfunc_0015DCBC_4c
.Lfunc_0015DCBC_8:
	tst	r2, #1
.Lfunc_0015DCBC_c:
	sub	r1, r1, #2
.Lfunc_0015DCBC_10:
	sub	r0, r0, #1
.Lfunc_0015DCBC_14:
	beq	.Lfunc_0015DCBC_24
.Lfunc_0015DCBC_18:
	ldrh	r3, [r1, #2]!
.Lfunc_0015DCBC_1c:
	asr	r3, r3, #8
.Lfunc_0015DCBC_20:
	strb	r3, [r0, #1]!
.Lfunc_0015DCBC_24:
	lsrs	r2, r2, #1
.Lfunc_0015DCBC_28:
	beq	.Lfunc_0015DCBC_4c
.Lfunc_0015DCBC_2c:
	ldrh	r3, [r1, #2]
.Lfunc_0015DCBC_30:
	subs	r2, r2, #1
.Lfunc_0015DCBC_34:
	asr	r3, r3, #8
.Lfunc_0015DCBC_38:
	strb	r3, [r0, #1]
.Lfunc_0015DCBC_3c:
	ldrh	r3, [r1, #4]!
.Lfunc_0015DCBC_40:
	asr	r3, r3, #8
.Lfunc_0015DCBC_44:
	strb	r3, [r0, #2]!
.Lfunc_0015DCBC_48:
	bne	.Lfunc_0015DCBC_2c
.Lfunc_0015DCBC_4c:
	bx	lr
.size func_0015DCBC, .-func_0015DCBC

.section .text.func_0017614C,"ax",%progbits
.balign 4
.global func_0017614C
.type func_0017614C, %function
func_0017614C:
.Lfunc_0017614C_0:
	ldr	r2, [r0]
.Lfunc_0017614C_4:
	ldr	r3, [r1]
.Lfunc_0017614C_8:
	cmp	r2, r3
.Lfunc_0017614C_c:
	bne	.Lfunc_0017614C_18
.Lfunc_0017614C_10:
	cmp	r2, #0
.Lfunc_0017614C_14:
	bne	.Lfunc_0017614C_40
.Lfunc_0017614C_18:
	ldr	r2, [r0, #8]
.Lfunc_0017614C_1c:
	ldr	r3, [r1, #8]
.Lfunc_0017614C_20:
	ldr	r0, [r0, #12]
.Lfunc_0017614C_24:
	ldr	r1, [r1, #12]
.Lfunc_0017614C_28:
	eor	r3, r3, r2
.Lfunc_0017614C_2c:
	eor	r1, r1, r0
.Lfunc_0017614C_30:
	orrs	r1, r1, r3
.Lfunc_0017614C_34:
	bne	.Lfunc_0017614C_48
.Lfunc_0017614C_38:
	orrs	r0, r0, r2
.Lfunc_0017614C_3c:
	beq	.Lfunc_0017614C_48
.Lfunc_0017614C_40:
	mov	r0, #1
.Lfunc_0017614C_44:
	bx	lr
.Lfunc_0017614C_48:
	mov	r0, #0
.Lfunc_0017614C_4c:
	bx	lr
.size func_0017614C, .-func_0017614C

.section .text.func_00187424,"ax",%progbits
.balign 4
.global func_00187424
.type func_00187424, %function
func_00187424:
.Lfunc_00187424_0:
	ldr	r2, [r1]
.Lfunc_00187424_4:
	str	r2, [r0, #12]
.Lfunc_00187424_8:
	ldr	r2, [r1, #4]
.Lfunc_00187424_c:
	str	r2, [r0, #16]
.Lfunc_00187424_10:
	ldrh	r1, [r1, #8]
.Lfunc_00187424_14:
	strh	r1, [r0, #20]
.Lfunc_00187424_18:
	ldr	r2, [r0, #104]
.Lfunc_00187424_1c:
	add	r1, r0, #12
.Lfunc_00187424_20:
	mov	r0, r2
.Lfunc_00187424_24:
	mov	r0, r0
.Lfunc_00187424_28:
	ldr	r2, [r1]
.Lfunc_00187424_2c:
	str	r2, [r0, #20]
.Lfunc_00187424_30:
	ldr	r2, [r1, #4]
.Lfunc_00187424_34:
	str	r2, [r0, #24]
.Lfunc_00187424_38:
	ldrh	r1, [r1, #8]
.Lfunc_00187424_3c:
	strh	r1, [r0, #28]
.Lfunc_00187424_40:
	ldrh	r1, [r0, #108]
.Lfunc_00187424_44:
	orr	r1, r1, #16
.Lfunc_00187424_48:
	strh	r1, [r0, #108]
.Lfunc_00187424_4c:
	bx	lr
.size func_00187424, .-func_00187424

.section .text.func_00196218,"ax",%progbits
.balign 4
.global func_00196218
.type func_00196218, %function
func_00196218:
.Lfunc_00196218_0:
	ldrsb	ip, [r0, #42]
.Lfunc_00196218_4:
	ldr	r1, [r0, #80]
.Lfunc_00196218_8:
	ldr	r2, [r0]
.Lfunc_00196218_c:
	ldr	r3, [r0, #84]
.Lfunc_00196218_10:
	orr	r1, r1, #-2147483648
.Lfunc_00196218_14:
	ror	r1, r1, ip
.Lfunc_00196218_18:
	rsb	ip, ip, #31
.Lfunc_00196218_1c:
	lsr	r1, r1, ip
.Lfunc_00196218_20:
	lsl	r1, r1, ip
.Lfunc_00196218_24:
	ldr	ip, [r0, #56]
.Lfunc_00196218_28:
	str	r1, [r0, #112]
.Lfunc_00196218_2c:
	add	r2, r2, r3
.Lfunc_00196218_30:
	str	r2, [r0, #108]
.Lfunc_00196218_34:
	lsl	r1, ip, #1
.Lfunc_00196218_38:
	str	r1, [r0, #116]
.Lfunc_00196218_3c:
	add	r2, r1, ip
.Lfunc_00196218_40:
	str	r2, [r0, #120]
.Lfunc_00196218_44:
	lsl	r2, ip, #2
.Lfunc_00196218_48:
	str	r2, [r0, #124]
.Lfunc_00196218_4c:
	bx	lr
.size func_00196218, .-func_00196218

.section .text.func_001C23D4,"ax",%progbits
.balign 4
.global func_001C23D4
.type func_001C23D4, %function
func_001C23D4:
.Lfunc_001C23D4_0:
	ldr	r2, [r0, #32]
.Lfunc_001C23D4_4:
	cmp	r2, r1
.Lfunc_001C23D4_8:
	bne	.Lfunc_001C23D4_40
.Lfunc_001C23D4_c:
	ldrb	r0, [r0, #36]
.Lfunc_001C23D4_10:
	tst	r0, #192
.Lfunc_001C23D4_14:
	bne	.Lfunc_001C23D4_40
.Lfunc_001C23D4_18:
	cmp	r2, #16
.Lfunc_001C23D4_1c:
	beq	.Lfunc_001C23D4_48
.Lfunc_001C23D4_20:
	cmp	r2, #17
.Lfunc_001C23D4_24:
	movne	r1, #0
.Lfunc_001C23D4_28:
	beq	.Lfunc_001C23D4_48
.Lfunc_001C23D4_2c:
	and	r0, r0, #32
.Lfunc_001C23D4_30:
	lsr	r0, r0, #5
.Lfunc_001C23D4_34:
	cmp	r1, r0
.Lfunc_001C23D4_38:
	moveq	r0, #0
.Lfunc_001C23D4_3c:
	beq	.Lfunc_001C23D4_44
.Lfunc_001C23D4_40:
	mov	r0, #7
.Lfunc_001C23D4_44:
	bx	lr
.Lfunc_001C23D4_48:
	mov	r1, #1
.Lfunc_001C23D4_4c:
	b	.Lfunc_001C23D4_2c
.size func_001C23D4, .-func_001C23D4

.section .text.func_001CD08C,"ax",%progbits
.balign 4
.global func_001CD08C
.type func_001CD08C, %function
func_001CD08C:
.Lfunc_001CD08C_0:
	and	r1, r0, #3
.Lfunc_001CD08C_4:
	cmp	r1, #2
.Lfunc_001CD08C_8:
	mov	r2, #1
.Lfunc_001CD08C_c:
	mov	r1, #2
.Lfunc_001CD08C_10:
	mov	r3, #3
.Lfunc_001CD08C_14:
	movhi	r2, #3
.Lfunc_001CD08C_18:
	mov	ip, #30
.Lfunc_001CD08C_1c:
	push	{r4}
.Lfunc_001CD08C_20:
	mul	r4, r0, r2
.Lfunc_001CD08C_24:
	lsl	r1, r1, #1
.Lfunc_001CD08C_28:
	orr	r3, r3, r1
.Lfunc_001CD08C_2c:
	and	r4, r4, r3
.Lfunc_001CD08C_30:
	cmp	r1, r4
.Lfunc_001CD08C_34:
	addcc	r2, r2, r1
.Lfunc_001CD08C_38:
	subs	ip, ip, #1
.Lfunc_001CD08C_3c:
	bne	.Lfunc_001CD08C_20
.Lfunc_001CD08C_40:
	mvn	r0, r2
.Lfunc_001CD08C_44:
	pop	{r4}
.Lfunc_001CD08C_48:
	add	r0, r0, #1
.Lfunc_001CD08C_4c:
	bx	lr
.size func_001CD08C, .-func_001CD08C

.section .text.func_003614F4,"ax",%progbits
.balign 4
.global func_003614F4
.type func_003614F4, %function
func_003614F4:
.Lfunc_003614F4_0:
	push	{r4, r5, r6, lr}
.Lfunc_003614F4_4:
	cmp	r1, #2
.Lfunc_003614F4_8:
	ldr	r5, [r0, #4]
.Lfunc_003614F4_c:
	mov	r4, r1
.Lfunc_003614F4_10:
	bcs	.Lfunc_003614F4_38
.Lfunc_003614F4_14:
	ldr	r0, [r5, r4, lsl #2]
.Lfunc_003614F4_18:
	cmp	r0, #0
.Lfunc_003614F4_1c:
	bne	.Lfunc_003614F4_30
.Lfunc_003614F4_20:
	mov	r2, #0
.Lfunc_003614F4_24:
	mov	r1, r2
.Lfunc_003614F4_28:
	mov	r0, r2
.Lfunc_003614F4_2c:
	mov	r0, r0
.Lfunc_003614F4_30:
	ldr	r0, [r5, r4, lsl #2]
.Lfunc_003614F4_34:
	pop	{r4, r5, r6, pc}
.Lfunc_003614F4_38:
	mov	r2, #0
.Lfunc_003614F4_3c:
	mov	r1, r2
.Lfunc_003614F4_40:
	mov	r0, r2
.Lfunc_003614F4_44:
	mov	r0, r0
.Lfunc_003614F4_48:
	ldr	r0, [r5]
.Lfunc_003614F4_4c:
	pop	{r4, r5, r6, pc}
.size func_003614F4, .-func_003614F4

.section .text.func_00398ADC,"ax",%progbits
.balign 4
.global func_00398ADC
.type func_00398ADC, %function
func_00398ADC:
.Lfunc_00398ADC_0:
	rsb	ip, r1, r1, lsl #5
.Lfunc_00398ADC_4:
	ldr	r0, [r0, #108]
.Lfunc_00398ADC_8:
	add	ip, ip, ip, lsl #1
.Lfunc_00398ADC_c:
	mov	r1, #65024
.Lfunc_00398ADC_10:
	add	r0, r0, ip, lsl #2
.Lfunc_00398ADC_14:
	and	r1, r1, r2, lsl #9
.Lfunc_00398ADC_18:
	ldr	r2, [r0, #236]
.Lfunc_00398ADC_1c:
	mov	r3, #4
.Lfunc_00398ADC_20:
	bic	r2, r2, #65024
.Lfunc_00398ADC_24:
	orr	r1, r1, r2
.Lfunc_00398ADC_28:
	str	r1, [r0, #236]
.Lfunc_00398ADC_2c:
	orr	r1, r1, #1
.Lfunc_00398ADC_30:
	strb	r1, [r0, #236]
.Lfunc_00398ADC_34:
	ldr	r2, [r0, #236]
.Lfunc_00398ADC_38:
	ldr	r1, [r0, #244]
.Lfunc_00398ADC_3c:
	and	r2, r3, r2, lsr #6
.Lfunc_00398ADC_40:
	bic	r1, r1, #4
.Lfunc_00398ADC_44:
	orr	r1, r1, r2
.Lfunc_00398ADC_48:
	str	r1, [r0, #244]
.Lfunc_00398ADC_4c:
	bx	lr
.size func_00398ADC, .-func_00398ADC

.section .text.func_003C9A30,"ax",%progbits
.balign 4
.global func_003C9A30
.type func_003C9A30, %function
func_003C9A30:
.Lfunc_003C9A30_0:
	ldr	ip, [r0, #2576]
.Lfunc_003C9A30_4:
	mov	r3, #0
.Lfunc_003C9A30_8:
	add	r2, r0, #2576
.Lfunc_003C9A30_c:
	add	ip, r0, ip, lsl #4
.Lfunc_003C9A30_10:
	str	r3, [ip, #2064]
.Lfunc_003C9A30_14:
	ldr	r3, [r0, #2576]
.Lfunc_003C9A30_18:
	add	r3, r0, r3, lsl #4
.Lfunc_003C9A30_1c:
	str	r1, [r3, #2068]
.Lfunc_003C9A30_20:
	ldr	r3, [r0, #2576]
.Lfunc_003C9A30_24:
	mov	r1, #5
.Lfunc_003C9A30_28:
	add	r0, r0, r3, lsl #4
.Lfunc_003C9A30_2c:
	str	r1, [r0, #2072]
.Lfunc_003C9A30_30:
	ldr	r0, [r2]
.Lfunc_003C9A30_34:
	add	r0, r0, #1
.Lfunc_003C9A30_38:
	asr	r1, r0, #31
.Lfunc_003C9A30_3c:
	add	r1, r0, r1, lsr #27
.Lfunc_003C9A30_40:
	bic	r1, r1, #31
.Lfunc_003C9A30_44:
	sub	r0, r0, r1
.Lfunc_003C9A30_48:
	str	r0, [r2]
.Lfunc_003C9A30_4c:
	bx	lr
.size func_003C9A30, .-func_003C9A30

.section .text.func_003FEB14,"ax",%progbits
.balign 4
.global func_003FEB14
.type func_003FEB14, %function
func_003FEB14:
.Lfunc_003FEB14_0:
	push	{r4, r5, r6, r7, r8, lr}
.Lfunc_003FEB14_4:
	mov	r4, r0
.Lfunc_003FEB14_8:
	mov	r6, r1
.Lfunc_003FEB14_c:
	ldr	r0, [r0, #52]
.Lfunc_003FEB14_10:
	ldr	r5, [sp, #24]
.Lfunc_003FEB14_14:
	mov	r7, r2
.Lfunc_003FEB14_18:
	cmp	r0, #0
.Lfunc_003FEB14_1c:
	mov	r8, r3
.Lfunc_003FEB14_20:
	bne	.Lfunc_003FEB14_34
.Lfunc_003FEB14_24:
	mov	r2, #0
.Lfunc_003FEB14_28:
	mov	r1, r2
.Lfunc_003FEB14_2c:
	mov	r0, r2
.Lfunc_003FEB14_30:
	mov	r0, r0
.Lfunc_003FEB14_34:
	ldr	r0, [r4, #52]
.Lfunc_003FEB14_38:
	ldr	r0, [r0, #144]
.Lfunc_003FEB14_3c:
	strh	r6, [r0, #116]
.Lfunc_003FEB14_40:
	strh	r7, [r0, #118]
.Lfunc_003FEB14_44:
	strh	r8, [r0, #120]
.Lfunc_003FEB14_48:
	strh	r5, [r0, #122]
.Lfunc_003FEB14_4c:
	pop	{r4, r5, r6, r7, r8, pc}
.size func_003FEB14, .-func_003FEB14

.section .text.func_004C5D04,"ax",%progbits
.balign 4
.global func_004C5D04
.type func_004C5D04, %function
func_004C5D04:
.Lfunc_004C5D04_0:
	push	{r4, r5, r6, lr}
.Lfunc_004C5D04_4:
	mov	r1, #16
.Lfunc_004C5D04_8:
	ldr	r0, [r0, #28]
.Lfunc_004C5D04_c:
	ldr	r4, [r0, #12]
.Lfunc_004C5D04_10:
	ldr	r0, [r4, #44]
.Lfunc_004C5D04_14:
	ldr	r2, [r4, #32]
.Lfunc_004C5D04_18:
	rsb	r5, r0, r0, lsl #3
.Lfunc_004C5D04_1c:
	add	r0, r1, r5, lsl #2
.Lfunc_004C5D04_20:
	ldrb	r0, [r2, r0]
.Lfunc_004C5D04_24:
	cmp	r0, #0
.Lfunc_004C5D04_28:
	bne	.Lfunc_004C5D04_3c
.Lfunc_004C5D04_2c:
	mov	r2, #0
.Lfunc_004C5D04_30:
	mov	r1, r2
.Lfunc_004C5D04_34:
	mov	r0, r2
.Lfunc_004C5D04_38:
	mov	r0, r0
.Lfunc_004C5D04_3c:
	ldr	r0, [r4, #32]
.Lfunc_004C5D04_40:
	mov	r1, #8
.Lfunc_004C5D04_44:
	add	r1, r1, r5, lsl #2
.Lfunc_004C5D04_48:
	ldr	r0, [r0, r1]
.Lfunc_004C5D04_4c:
	pop	{r4, r5, r6, pc}
.size func_004C5D04, .-func_004C5D04

.section .text.func_001184C8,"ax",%progbits
.balign 4
.global func_001184C8
.type func_001184C8, %function
func_001184C8:
.Lfunc_001184C8_0:
	mrc	15, 0, r0, c13, c0, 3
.Lfunc_001184C8_4:
	mov	r1, #0
.Lfunc_001184C8_8:
	str	r1, [r0]
.Lfunc_001184C8_c:
	str	r1, [r0, #4]
.Lfunc_001184C8_10:
	str	r1, [r0, #8]
.Lfunc_001184C8_14:
	str	r1, [r0, #12]
.Lfunc_001184C8_18:
	str	r1, [r0, #16]
.Lfunc_001184C8_1c:
	str	r1, [r0, #20]
.Lfunc_001184C8_20:
	str	r1, [r0, #24]
.Lfunc_001184C8_24:
	str	r1, [r0, #28]
.Lfunc_001184C8_28:
	str	r1, [r0, #32]
.Lfunc_001184C8_2c:
	str	r1, [r0, #36]
.Lfunc_001184C8_30:
	str	r1, [r0, #40]
.Lfunc_001184C8_34:
	str	r1, [r0, #44]
.Lfunc_001184C8_38:
	str	r1, [r0, #48]
.Lfunc_001184C8_3c:
	str	r1, [r0, #52]
.Lfunc_001184C8_40:
	str	r1, [r0, #56]
.Lfunc_001184C8_44:
	str	r1, [r0, #60]
.Lfunc_001184C8_48:
	bx	lr
.size func_001184C8, .-func_001184C8

.section .text.func_00134338,"ax",%progbits
.balign 4
.global func_00134338
.type func_00134338, %function
func_00134338:
.Lfunc_00134338_0:
	mov	ip, r0
.Lfunc_00134338_4:
	mov	r0, r2
.Lfunc_00134338_8:
	cmp	r1, r0
.Lfunc_00134338_c:
	push	{r4, r5}
.Lfunc_00134338_10:
	movne	r5, #0
.Lfunc_00134338_14:
	beq	.Lfunc_00134338_44
.Lfunc_00134338_18:
	ldm	r1, {r3, r4}
.Lfunc_00134338_1c:
	cmp	r3, r0
.Lfunc_00134338_20:
	str	r4, [r3, #4]
.Lfunc_00134338_24:
	str	r3, [r4]
.Lfunc_00134338_28:
	ldr	r2, [ip]
.Lfunc_00134338_2c:
	sub	r2, r2, #1
.Lfunc_00134338_30:
	str	r2, [ip]
.Lfunc_00134338_34:
	str	r5, [r1]
.Lfunc_00134338_38:
	str	r5, [r1, #4]
.Lfunc_00134338_3c:
	mov	r1, r3
.Lfunc_00134338_40:
	bne	.Lfunc_00134338_18
.Lfunc_00134338_44:
	pop	{r4, r5}
.Lfunc_00134338_48:
	bx	lr
.size func_00134338, .-func_00134338

.section .text.func_00180ED8,"ax",%progbits
.balign 4
.global func_00180ED8
.type func_00180ED8, %function
func_00180ED8:
.Lfunc_00180ED8_0:
	ldr	r2, [r0, #8]
.Lfunc_00180ED8_4:
	add	r3, r0, #8
.Lfunc_00180ED8_8:
	cmp	r2, r3
.Lfunc_00180ED8_c:
	bxeq	lr
.Lfunc_00180ED8_10:
	push	{r4}
.Lfunc_00180ED8_14:
	ldrb	r4, [r2, #-68]
.Lfunc_00180ED8_18:
	mov	r3, r2
.Lfunc_00180ED8_1c:
	ldr	r2, [r2]
.Lfunc_00180ED8_20:
	cmp	r4, #0
.Lfunc_00180ED8_24:
	mov	ip, r2
.Lfunc_00180ED8_28:
	beq	.Lfunc_00180ED8_38
.Lfunc_00180ED8_2c:
	ldrh	r4, [r3, #-56]
.Lfunc_00180ED8_30:
	orr	r4, r4, r1
.Lfunc_00180ED8_34:
	strh	r4, [r3, #-56]
.Lfunc_00180ED8_38:
	add	r3, r0, #8
.Lfunc_00180ED8_3c:
	cmp	ip, r3
.Lfunc_00180ED8_40:
	bne	.Lfunc_00180ED8_14
.Lfunc_00180ED8_44:
	pop	{r4}
.Lfunc_00180ED8_48:
	bx	lr
.size func_00180ED8, .-func_00180ED8

.section .text.func_0018EA8C,"ax",%progbits
.balign 4
.global func_0018EA8C
.type func_0018EA8C, %function
func_0018EA8C:
.Lfunc_0018EA8C_0:
	ldrb	r1, [r0, #86]
.Lfunc_0018EA8C_4:
	cmp	r1, #0
.Lfunc_0018EA8C_8:
	beq	.Lfunc_0018EA8C_48
.Lfunc_0018EA8C_c:
	mov	r2, #0
.Lfunc_0018EA8C_10:
	strb	r2, [r0, #86]
.Lfunc_0018EA8C_14:
	str	r2, [r0, #4]
.Lfunc_0018EA8C_18:
	str	r2, [r0, #8]
.Lfunc_0018EA8C_1c:
	str	r2, [r0, #12]
.Lfunc_0018EA8C_20:
	str	r2, [r0, #16]
.Lfunc_0018EA8C_24:
	ldrb	r1, [r0, #85]
.Lfunc_0018EA8C_28:
	cmp	r1, #0
.Lfunc_0018EA8C_2c:
	movne	r3, #0
.Lfunc_0018EA8C_30:
	beq	.Lfunc_0018EA8C_48
.Lfunc_0018EA8C_34:
	add	ip, r0, r3, lsl #2
.Lfunc_0018EA8C_38:
	subs	r1, r1, #1
.Lfunc_0018EA8C_3c:
	add	r3, r3, #1
.Lfunc_0018EA8C_40:
	str	r2, [ip, #28]
.Lfunc_0018EA8C_44:
	bne	.Lfunc_0018EA8C_34
.Lfunc_0018EA8C_48:
	bx	lr
.size func_0018EA8C, .-func_0018EA8C

.section .text.func_00202040,"ax",%progbits
.balign 4
.global func_00202040
.type func_00202040, %function
func_00202040:
.Lfunc_00202040_0:
	ldrsh	r1, [r0]
.Lfunc_00202040_4:
	cmp	r1, #40
.Lfunc_00202040_8:
	movlt	r1, #40
.Lfunc_00202040_c:
	strhlt	r1, [r0]
.Lfunc_00202040_10:
	ldrsh	r1, [r0, #2]
.Lfunc_00202040_14:
	cmp	r1, #36
.Lfunc_00202040_18:
	movlt	r1, #36
.Lfunc_00202040_1c:
	strhlt	r1, [r0, #2]
.Lfunc_00202040_20:
	ldrsh	r2, [r0, #6]
.Lfunc_00202040_24:
	mov	r1, #145
.Lfunc_00202040_28:
	cmp	r2, #145
.Lfunc_00202040_2c:
	strhgt	r1, [r0, #6]
.Lfunc_00202040_30:
	ldrsh	r2, [r0, #8]
.Lfunc_00202040_34:
	cmp	r2, #145
.Lfunc_00202040_38:
	strhgt	r1, [r0, #8]
.Lfunc_00202040_3c:
	ldrsh	r2, [r0, #10]
.Lfunc_00202040_40:
	cmp	r2, #145
.Lfunc_00202040_44:
	strhgt	r1, [r0, #10]
.Lfunc_00202040_48:
	bx	lr
.size func_00202040, .-func_00202040

.section .text.func_002168BC,"ax",%progbits
.balign 4
.global func_002168BC
.type func_002168BC, %function
func_002168BC:
.Lfunc_002168BC_0:
	mov	r1, #0
.Lfunc_002168BC_4:
	str	r1, [r0]
.Lfunc_002168BC_8:
	str	r1, [r0, #4]
.Lfunc_002168BC_c:
	str	r1, [r0, #8]
.Lfunc_002168BC_10:
	str	r1, [r0, #12]
.Lfunc_002168BC_14:
	str	r1, [r0, #16]
.Lfunc_002168BC_18:
	str	r1, [r0, #20]
.Lfunc_002168BC_1c:
	str	r1, [r0, #24]
.Lfunc_002168BC_20:
	str	r1, [r0, #28]
.Lfunc_002168BC_24:
	str	r1, [r0, #32]
.Lfunc_002168BC_28:
	str	r1, [r0, #36]
.Lfunc_002168BC_2c:
	str	r1, [r0, #40]
.Lfunc_002168BC_30:
	str	r1, [r0, #44]
.Lfunc_002168BC_34:
	str	r1, [r0, #48]
.Lfunc_002168BC_38:
	str	r1, [r0, #52]
.Lfunc_002168BC_3c:
	str	r1, [r0, #56]
.Lfunc_002168BC_40:
	str	r1, [r0, #60]
.Lfunc_002168BC_44:
	strh	r1, [r0, #64]
.Lfunc_002168BC_48:
	bx	lr
.size func_002168BC, .-func_002168BC

.section .text.func_00330D54,"ax",%progbits
.balign 4
.global func_00330D54
.type func_00330D54, %function
func_00330D54:
.Lfunc_00330D54_0:
	mov	ip, r0
.Lfunc_00330D54_4:
	push	{r4}
.Lfunc_00330D54_8:
	ldr	r1, [ip, #4]
.Lfunc_00330D54_c:
	mov	r3, #128
.Lfunc_00330D54_10:
	mov	r0, #0
.Lfunc_00330D54_14:
	add	r2, ip, #4
.Lfunc_00330D54_18:
	cmp	r1, r2
.Lfunc_00330D54_1c:
	beq	.Lfunc_00330D54_44
.Lfunc_00330D54_20:
	ldrb	r4, [r1, #-115]
.Lfunc_00330D54_24:
	ldr	r2, [r1, #-188]
.Lfunc_00330D54_28:
	add	r2, r2, r4
.Lfunc_00330D54_2c:
	usat	r2, #7, r2
.Lfunc_00330D54_30:
	cmp	r3, r2
.Lfunc_00330D54_34:
	subgt	r0, r1, #268
.Lfunc_00330D54_38:
	ldr	r1, [r1]
.Lfunc_00330D54_3c:
	movgt	r3, r2
.Lfunc_00330D54_40:
	b	.Lfunc_00330D54_14
.Lfunc_00330D54_44:
	pop	{r4}
.Lfunc_00330D54_48:
	bx	lr
.size func_00330D54, .-func_00330D54

.section .text.func_0033D830,"ax",%progbits
.balign 4
.global func_0033D830
.type func_0033D830, %function
func_0033D830:
.Lfunc_0033D830_0:
	ldr	r2, [r0, #68]
.Lfunc_0033D830_4:
	cmp	r2, #0
.Lfunc_0033D830_8:
	beq	.Lfunc_0033D830_44
.Lfunc_0033D830_c:
	ldr	r2, [r0, #72]
.Lfunc_0033D830_10:
	add	r3, r0, #72
.Lfunc_0033D830_14:
	cmp	r2, r3
.Lfunc_0033D830_18:
	beq	.Lfunc_0033D830_44
.Lfunc_0033D830_1c:
	mov	ip, r2
.Lfunc_0033D830_20:
	ldr	r2, [r2, #-4]
.Lfunc_0033D830_24:
	cmp	r2, r1
.Lfunc_0033D830_28:
	bne	.Lfunc_0033D830_34
.Lfunc_0033D830_2c:
	mov	r0, #1
.Lfunc_0033D830_30:
	bx	lr
.Lfunc_0033D830_34:
	ldr	r2, [ip]
.Lfunc_0033D830_38:
	add	r3, r0, #72
.Lfunc_0033D830_3c:
	cmp	r2, r3
.Lfunc_0033D830_40:
	bne	.Lfunc_0033D830_1c
.Lfunc_0033D830_44:
	mov	r0, #0
.Lfunc_0033D830_48:
	bx	lr
.size func_0033D830, .-func_0033D830

.section .text.func_0038CD54,"ax",%progbits
.balign 4
.global func_0038CD54
.type func_0038CD54, %function
func_0038CD54:
.Lfunc_0038CD54_0:
	push	{r4}
.Lfunc_0038CD54_4:
	cmp	r3, #0
.Lfunc_0038CD54_8:
	ldr	ip, [sp, #4]
.Lfunc_0038CD54_c:
	beq	.Lfunc_0038CD54_28
.Lfunc_0038CD54_10:
	ldr	r1, [r0, #64]
.Lfunc_0038CD54_14:
	mov	r4, #0
.Lfunc_0038CD54_18:
	ldr	r3, [r1, #4]
.Lfunc_0038CD54_1c:
	ldr	r1, [r1, #8]
.Lfunc_0038CD54_20:
	ldr	r3, [r3, #172]
.Lfunc_0038CD54_24:
	str	r4, [r3, r1, lsl #2]
.Lfunc_0038CD54_28:
	cmp	ip, #0
.Lfunc_0038CD54_2c:
	beq	.Lfunc_0038CD54_44
.Lfunc_0038CD54_30:
	ldr	r0, [r0, #48]
.Lfunc_0038CD54_34:
	add	r2, r2, r2, lsl #1
.Lfunc_0038CD54_38:
	mvn	r1, #0
.Lfunc_0038CD54_3c:
	ldr	r0, [r0, r2, lsl #2]
.Lfunc_0038CD54_40:
	str	r1, [r0, #12]
.Lfunc_0038CD54_44:
	pop	{r4}
.Lfunc_0038CD54_48:
	bx	lr
.size func_0038CD54, .-func_0038CD54

.section .text.func_004623FC,"ax",%progbits
.balign 4
.global func_004623FC
.type func_004623FC, %function
func_004623FC:
.Lfunc_004623FC_0:
	push	{r4, r5, r6, lr}
.Lfunc_004623FC_4:
	mov	r4, r0
.Lfunc_004623FC_8:
	add	r5, r0, #1024
.Lfunc_004623FC_c:
	ldrb	r0, [r0, #1089]
.Lfunc_004623FC_10:
	add	r5, r5, #65
.Lfunc_004623FC_14:
	lsrs	r0, r0, #7
.Lfunc_004623FC_18:
	bne	.Lfunc_004623FC_2c
.Lfunc_004623FC_1c:
	mov	r2, #0
.Lfunc_004623FC_20:
	mov	r1, r2
.Lfunc_004623FC_24:
	mov	r0, r2
.Lfunc_004623FC_28:
	mov	r0, r0
.Lfunc_004623FC_2c:
	ldrb	r0, [r4, #1089]
.Lfunc_004623FC_30:
	bic	r0, r0, #128
.Lfunc_004623FC_34:
	strb	r0, [r5]
.Lfunc_004623FC_38:
	ldrb	r0, [r4, #1090]
.Lfunc_004623FC_3c:
	cmp	r0, #31
.Lfunc_004623FC_40:
	moveq	r0, #30
.Lfunc_004623FC_44:
	strbeq	r0, [r4, #1090]
.Lfunc_004623FC_48:
	pop	{r4, r5, r6, pc}
.size func_004623FC, .-func_004623FC

.section .text.func_004BE6B0,"ax",%progbits
.balign 4
.global func_004BE6B0
.type func_004BE6B0, %function
func_004BE6B0:
.Lfunc_004BE6B0_0:
	ldr	r1, [r0, #52]
.Lfunc_004BE6B0_4:
	ldr	r0, [r0, #44]
.Lfunc_004BE6B0_8:
	mov	r2, #12
.Lfunc_004BE6B0_c:
	lsl	r3, r0, #28
.Lfunc_004BE6B0_10:
	lsl	ip, r0, #30
.Lfunc_004BE6B0_14:
	lsr	r3, r3, #30
.Lfunc_004BE6B0_18:
	lsr	ip, ip, #25
.Lfunc_004BE6B0_1c:
	add	r3, r3, r3, lsl #2
.Lfunc_004BE6B0_20:
	and	r2, r2, r0, lsr #2
.Lfunc_004BE6B0_24:
	add	r3, ip, r3, lsl #2
.Lfunc_004BE6B0_28:
	add	r2, r2, r3
.Lfunc_004BE6B0_2c:
	mov	r3, #8
.Lfunc_004BE6B0_30:
	and	r3, r3, r0, lsr #6
.Lfunc_004BE6B0_34:
	add	r2, r2, r3
.Lfunc_004BE6B0_38:
	mov	r3, #4
.Lfunc_004BE6B0_3c:
	and	r0, r3, r0, lsr #8
.Lfunc_004BE6B0_40:
	add	r0, r0, r2
.Lfunc_004BE6B0_44:
	add	r0, r0, r1
.Lfunc_004BE6B0_48:
	bx	lr
.size func_004BE6B0, .-func_004BE6B0

.section .text.func_004CC334,"ax",%progbits
.balign 4
.global func_004CC334
.type func_004CC334, %function
func_004CC334:
.Lfunc_004CC334_0:
	ldr	r3, [r0, #32]
.Lfunc_004CC334_4:
	mov	r0, #0
.Lfunc_004CC334_8:
	ldr	ip, [r3, #36]!
.Lfunc_004CC334_c:
	cmp	ip, #0
.Lfunc_004CC334_10:
	addne	r3, r3, ip
.Lfunc_004CC334_14:
	moveq	r3, r0
.Lfunc_004CC334_18:
	cmp	r3, #0
.Lfunc_004CC334_1c:
	moveq	r0, #0
.Lfunc_004CC334_20:
	beq	.Lfunc_004CC334_34
.Lfunc_004CC334_24:
	add	r1, r3, r1, lsl #4
.Lfunc_004CC334_28:
	ldr	r3, [r1, #40]!
.Lfunc_004CC334_2c:
	cmp	r3, #0
.Lfunc_004CC334_30:
	addne	r0, r3, r1
.Lfunc_004CC334_34:
	cmp	r0, #0
.Lfunc_004CC334_38:
	str	r0, [r2, #8]
.Lfunc_004CC334_3c:
	ldrne	r0, [r0, #8]
.Lfunc_004CC334_40:
	mvneq	r0, #1
.Lfunc_004CC334_44:
	strb	r0, [r2, #4]
.Lfunc_004CC334_48:
	bx	lr
.size func_004CC334, .-func_004CC334

.section .text.func_001EF038,"ax",%progbits
.balign 4
.global func_001EF038
.type func_001EF038, %function
func_001EF038:
.Lfunc_001EF038_0:
	add	ip, r0, #4
.Lfunc_001EF038_4:
	str	r2, [r0]
.Lfunc_001EF038_8:
	stm	ip, {r1, r3}
.Lfunc_001EF038_c:
	cmp	r3, #0
.Lfunc_001EF038_10:
	mov	r1, #0
.Lfunc_001EF038_14:
	beq	.Lfunc_001EF038_28
.Lfunc_001EF038_18:
	tst	r3, #1
.Lfunc_001EF038_1c:
	addne	r1, r1, #1
.Lfunc_001EF038_20:
	lsrs	r3, r3, #1
.Lfunc_001EF038_24:
	bne	.Lfunc_001EF038_18
.Lfunc_001EF038_28:
	mov	r2, #0
.Lfunc_001EF038_2c:
	str	r1, [r0, #12]
.Lfunc_001EF038_30:
	strb	r2, [r0, #16]
.Lfunc_001EF038_34:
	str	r2, [r0, #20]
.Lfunc_001EF038_38:
	mvn	r3, #0
.Lfunc_001EF038_3c:
	strb	r2, [r0, #24]
.Lfunc_001EF038_40:
	str	r3, [r0, #28]
.Lfunc_001EF038_44:
	bx	lr
.size func_001EF038, .-func_001EF038
