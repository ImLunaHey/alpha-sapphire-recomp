.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004945A4,"ax",%progbits
.balign 4
.global func_004945A4
.type func_004945A4, %function
func_004945A4:
.Lfunc_004945A4_0:
	push	{r4, r5}
.Lfunc_004945A4_4:
	ldr	r1, [r0]
.Lfunc_004945A4_8:
	add	ip, r0, #8
.Lfunc_004945A4_c:
	tst	r1, #1
.Lfunc_004945A4_10:
	beq .Lfunc_004945A4_9c
.Lfunc_004945A4_14:
	ldr	r1, [r0, #12]
.Lfunc_004945A4_18:
	cmp	r1, ip
.Lfunc_004945A4_1c:
	ldreq	r0, [r0, #44]
.Lfunc_004945A4_20:
	beq .Lfunc_004945A4_94
.Lfunc_004945A4_24:
	ldr	r2, [r1, #4]
.Lfunc_004945A4_28:
	ldr	r5, [r0, #48]
.Lfunc_004945A4_2c:
	cmp	r2, ip
.Lfunc_004945A4_30:
	sub	r3, r1, r5
.Lfunc_004945A4_34:
	beq .Lfunc_004945A4_64
.Lfunc_004945A4_38:
	ldr	r4, [r1, #16]
.Lfunc_004945A4_3c:
	add	r4, r4, #3
.Lfunc_004945A4_40:
	bic	r4, r4, #3
.Lfunc_004945A4_44:
	add	r4, r4, r1
.Lfunc_004945A4_48:
	add	r4, r4, #24
.Lfunc_004945A4_4c:
	mov	r1, r2
.Lfunc_004945A4_50:
	sub	r4, r2, r4
.Lfunc_004945A4_54:
	ldr	r2, [r2, #4]
.Lfunc_004945A4_58:
	add	r3, r3, r4
.Lfunc_004945A4_5c:
	cmp	r2, ip
.Lfunc_004945A4_60:
	bne .Lfunc_004945A4_38
.Lfunc_004945A4_64:
	ldr	r1, [r0, #44]
.Lfunc_004945A4_68:
	ldr	r0, [r0, #8]
.Lfunc_004945A4_6c:
	add	r1, r1, r5
.Lfunc_004945A4_70:
	cmp	r0, ip
.Lfunc_004945A4_74:
	beq .Lfunc_004945A4_8c
.Lfunc_004945A4_78:
	ldr	r2, [r0, #16]
.Lfunc_004945A4_7c:
	add	r2, r2, #3
.Lfunc_004945A4_80:
	bic	r2, r2, #3
.Lfunc_004945A4_84:
	add	r2, r2, #24
.Lfunc_004945A4_88:
	add	r5, r0, r2
.Lfunc_004945A4_8c:
	sub	r0, r1, r5
.Lfunc_004945A4_90:
	add	r0, r0, r3
.Lfunc_004945A4_94:
	pop	{r4, r5}
.Lfunc_004945A4_98:
	bx	lr
.Lfunc_004945A4_9c:
	ldr	r1, [r0, #48]
.Lfunc_004945A4_a0:
	ldr	r2, [r0, #44]
.Lfunc_004945A4_a4:
	ldr	r0, [r0, #8]
.Lfunc_004945A4_a8:
	add	r2, r2, r1
.Lfunc_004945A4_ac:
	cmp	r0, ip
.Lfunc_004945A4_b0:
	beq .Lfunc_004945A4_c8
.Lfunc_004945A4_b4:
	ldr	r1, [r0, #16]
.Lfunc_004945A4_b8:
	add	r1, r1, #3
.Lfunc_004945A4_bc:
	bic	r1, r1, #3
.Lfunc_004945A4_c0:
	add	r1, r1, #24
.Lfunc_004945A4_c4:
	add	r1, r1, r0
.Lfunc_004945A4_c8:
	pop	{r4, r5}
.Lfunc_004945A4_cc:
	sub	r0, r2, r1
.Lfunc_004945A4_d0:
	bx	lr
.size func_004945A4, .-func_004945A4

.section .text.func_0052B6E4,"ax",%progbits
.balign 4
.global func_0052B6E4
.type func_0052B6E4, %function
func_0052B6E4:
.Lfunc_0052B6E4_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_0052B6E4_4:
	mov	ip, #1
.Lfunc_0052B6E4_8:
	ldrd	r2, [r0, #8]
.Lfunc_0052B6E4_c:
	ldr	r4, [r2, #16]
.Lfunc_0052B6E4_10:
	sub	r4, r4, r3
.Lfunc_0052B6E4_14:
	cmp	r4, #8
.Lfunc_0052B6E4_18:
	bcc .Lfunc_0052B6E4_bc
.Lfunc_0052B6E4_1c:
	ldr	ip, [r2, #12]
.Lfunc_0052B6E4_20:
	ldr	r2, [r2, #24]
.Lfunc_0052B6E4_24:
	mov	r7, #0
.Lfunc_0052B6E4_28:
	add	r2, r2, ip
.Lfunc_0052B6E4_2c:
	add	r2, r2, r3
.Lfunc_0052B6E4_30:
	mov	ip, #0
.Lfunc_0052B6E4_34:
	ldrb	r3, [r2, #1]
.Lfunc_0052B6E4_38:
	lsl	r5, ip, #8
.Lfunc_0052B6E4_3c:
	lsl	r8, r7, #16
.Lfunc_0052B6E4_40:
	ldrb	r4, [r2, #4]
.Lfunc_0052B6E4_44:
	orr	r5, r5, r3, lsr #24
.Lfunc_0052B6E4_48:
	lsl	r6, r3, #8
.Lfunc_0052B6E4_4c:
	mov	r3, r5
.Lfunc_0052B6E4_50:
	ldrb	r5, [r2, #2]
.Lfunc_0052B6E4_54:
	ldrb	ip, [r2]
.Lfunc_0052B6E4_58:
	orr	r8, r8, r5, lsr #16
.Lfunc_0052B6E4_5c:
	lsl	r7, r5, #16
.Lfunc_0052B6E4_60:
	ldrb	r5, [r2, #3]
.Lfunc_0052B6E4_64:
	orr	r3, r3, r8
.Lfunc_0052B6E4_68:
	mov	r8, #0
.Lfunc_0052B6E4_6c:
	lsl	r9, r8, #24
.Lfunc_0052B6E4_70:
	orr	r8, r9, r5, lsr #8
.Lfunc_0052B6E4_74:
	orr	r3, r3, r8
.Lfunc_0052B6E4_78:
	orr	r3, r3, r4
.Lfunc_0052B6E4_7c:
	ldrb	r4, [r2, #5]
.Lfunc_0052B6E4_80:
	orr	r3, r3, r4, lsl #8
.Lfunc_0052B6E4_84:
	ldrb	r4, [r2, #6]
.Lfunc_0052B6E4_88:
	ldrb	r2, [r2, #7]
.Lfunc_0052B6E4_8c:
	orr	r3, r3, r4, lsl #16
.Lfunc_0052B6E4_90:
	orr	r3, r3, r2, lsl #24
.Lfunc_0052B6E4_94:
	orr	r2, ip, r6
.Lfunc_0052B6E4_98:
	orr	r2, r2, r7
.Lfunc_0052B6E4_9c:
	orr	r2, r2, r5, lsl #24
.Lfunc_0052B6E4_a0:
	strd	r2, [r1]
.Lfunc_0052B6E4_a4:
	ldr	r1, [r0, #12]
.Lfunc_0052B6E4_a8:
	add	r1, r1, #8
.Lfunc_0052B6E4_ac:
	str	r1, [r0, #12]
.Lfunc_0052B6E4_b0:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_0052B6E4_b4:
	mov	r0, #1
.Lfunc_0052B6E4_b8:
	bx	lr
.Lfunc_0052B6E4_bc:
	strb	ip, [r0, #4]
.Lfunc_0052B6E4_c0:
	mov	r0, #0
.Lfunc_0052B6E4_c4:
	mov	r2, r0
.Lfunc_0052B6E4_c8:
	stm	r1, {r0, r2}
.Lfunc_0052B6E4_cc:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_0052B6E4_d0:
	bx	lr
.size func_0052B6E4, .-func_0052B6E4

.section .text.func_00498184,"ax",%progbits
.balign 4
.global func_00498184
.type func_00498184, %function
func_00498184:
.Lfunc_00498184_0:
	push	{r4, r5, r6, r7, r8, lr}
.Lfunc_00498184_4:
	mov	r4, r2
.Lfunc_00498184_8:
	add	r2, sp, #24
.Lfunc_00498184_c:
	mov	r7, r3
.Lfunc_00498184_10:
	ldm	r2, {r5, r6}
.Lfunc_00498184_14:
	mov	r3, #2
.Lfunc_00498184_18:
	ldrb	r2, [r0, #4]
.Lfunc_00498184_1c:
	cmp	r2, #0
.Lfunc_00498184_20:
	subeq	r1, r1, #256
.Lfunc_00498184_24:
	subeq	r1, r1, #141
.Lfunc_00498184_28:
	subne	r1, r1, #456
.Lfunc_00498184_2c:
	ldr	r2, [r0, #40]
.Lfunc_00498184_30:
	sxth	r1, r1
.Lfunc_00498184_34:
	add	r3, r3, r1, lsl #1
.Lfunc_00498184_38:
	add	ip, r2, r1, lsl #1
.Lfunc_00498184_3c:
	ldrh	r1, [r2, r3]
.Lfunc_00498184_40:
	ldrsh	r2, [ip]
.Lfunc_00498184_44:
	sub	r1, r1, r2
.Lfunc_00498184_48:
	sxth	r1, r1
.Lfunc_00498184_4c:
	cmp	r1, #2
.Lfunc_00498184_50:
	ble .Lfunc_00498184_88
.Lfunc_00498184_54:
	sub	r1, r1, #2
.Lfunc_00498184_58:
	add	r1, r1, r1, lsr #31
.Lfunc_00498184_5c:
	asr	r1, r1, #1
.Lfunc_00498184_60:
	strh	r1, [r4]
.Lfunc_00498184_64:
	ldr	r0, [r0, #40]
.Lfunc_00498184_68:
	add	r0, r0, r2
.Lfunc_00498184_6c:
	str	r0, [r7]
.Lfunc_00498184_70:
	ldrsh	r1, [r4]
.Lfunc_00498184_74:
	add	r0, r0, r1, lsl #1
.Lfunc_00498184_78:
	ldrsb	r1, [r0]
.Lfunc_00498184_7c:
	strh	r1, [r5]
.Lfunc_00498184_80:
	ldrsb	r0, [r0, #1]
.Lfunc_00498184_84:
	b .Lfunc_00498184_b4
.Lfunc_00498184_88:
	cmp	r1, #0
.Lfunc_00498184_8c:
	beq .Lfunc_00498184_a0
.Lfunc_00498184_90:
	mov	r2, #0
.Lfunc_00498184_94:
	mov	r1, r2
.Lfunc_00498184_98:
	mov	r0, r2
.Lfunc_00498184_9c:
	mov r0, r0
.Lfunc_00498184_a0:
	mov	r1, #0
.Lfunc_00498184_a4:
	strh	r1, [r4]
.Lfunc_00498184_a8:
	mvn	r0, #0
.Lfunc_00498184_ac:
	str	r1, [r7]
.Lfunc_00498184_b0:
	strh	r0, [r5]
.Lfunc_00498184_b4:
	strh	r0, [r6]
.Lfunc_00498184_b8:
	pop	{r4, r5, r6, r7, r8, pc}
.size func_00498184, .-func_00498184

.section .text.func_004140A8,"ax",%progbits
.balign 4
.global func_004140A8
.type func_004140A8, %function
func_004140A8:
.Lfunc_004140A8_0:
	push	{r4}
.Lfunc_004140A8_4:
	ldrb	r1, [r0], #1
.Lfunc_004140A8_8:
	cmp	r1, #0
.Lfunc_004140A8_c:
	beq .Lfunc_004140A8_94
.Lfunc_004140A8_10:
	ldrb	r1, [r0], #1
.Lfunc_004140A8_14:
	cmp	r1, #0
.Lfunc_004140A8_18:
	beq .Lfunc_004140A8_94
.Lfunc_004140A8_1c:
	ldrb	r1, [r0], #1
.Lfunc_004140A8_20:
	cmp	r1, #0
.Lfunc_004140A8_24:
	beq .Lfunc_004140A8_94
.Lfunc_004140A8_28:
	ldrb	r1, [r0], #1
.Lfunc_004140A8_2c:
	cmp	r1, #0
.Lfunc_004140A8_30:
	beq .Lfunc_004140A8_94
.Lfunc_004140A8_34:
	ldrsb	r2, [r0]
.Lfunc_004140A8_38:
	sub	r1, r2, #48
.Lfunc_004140A8_3c:
	cmp	r1, #10
.Lfunc_004140A8_40:
	bcs .Lfunc_004140A8_94
.Lfunc_004140A8_44:
	ldrsb	r3, [r0, #1]!
.Lfunc_004140A8_48:
	sub	ip, r2, #48
.Lfunc_004140A8_4c:
	mvn	r1, #47
.Lfunc_004140A8_50:
	sub	r2, r3, #48
.Lfunc_004140A8_54:
	cmp	r2, #10
.Lfunc_004140A8_58:
	bcs .Lfunc_004140A8_94
.Lfunc_004140A8_5c:
	add	ip, ip, ip, lsl #2
.Lfunc_004140A8_60:
	ldrsb	r2, [r0, #1]!
.Lfunc_004140A8_64:
	add	r4, r1, ip, lsl #1
.Lfunc_004140A8_68:
	add	r3, r3, r4
.Lfunc_004140A8_6c:
	sub	ip, r2, #48
.Lfunc_004140A8_70:
	cmp	ip, #10
.Lfunc_004140A8_74:
	bcs .Lfunc_004140A8_94
.Lfunc_004140A8_78:
	add	r3, r3, r3, lsl #2
.Lfunc_004140A8_7c:
	ldrsb	r0, [r0, #1]
.Lfunc_004140A8_80:
	add	ip, r1, r3, lsl #1
.Lfunc_004140A8_84:
	add	r2, r2, ip
.Lfunc_004140A8_88:
	sub	r3, r0, #48
.Lfunc_004140A8_8c:
	cmp	r3, #10
.Lfunc_004140A8_90:
	bcc .Lfunc_004140A8_a0
.Lfunc_004140A8_94:
	pop	{r4}
.Lfunc_004140A8_98:
	mvn	r0, #0
.Lfunc_004140A8_9c:
	bx	lr
.Lfunc_004140A8_a0:
	add	r2, r2, r2, lsl #2
.Lfunc_004140A8_a4:
	pop	{r4}
.Lfunc_004140A8_a8:
	add	r1, r1, r2, lsl #1
.Lfunc_004140A8_ac:
	add	r0, r0, r1
.Lfunc_004140A8_b0:
	bx	lr
.size func_004140A8, .-func_004140A8

.section .text.func_0041415C,"ax",%progbits
.balign 4
.global func_0041415C
.type func_0041415C, %function
func_0041415C:
.Lfunc_0041415C_0:
	push	{r4}
.Lfunc_0041415C_4:
	ldrh	r1, [r0], #2
.Lfunc_0041415C_8:
	cmp	r1, #0
.Lfunc_0041415C_c:
	beq .Lfunc_0041415C_94
.Lfunc_0041415C_10:
	ldrh	r1, [r0], #2
.Lfunc_0041415C_14:
	cmp	r1, #0
.Lfunc_0041415C_18:
	beq .Lfunc_0041415C_94
.Lfunc_0041415C_1c:
	ldrh	r1, [r0], #2
.Lfunc_0041415C_20:
	cmp	r1, #0
.Lfunc_0041415C_24:
	beq .Lfunc_0041415C_94
.Lfunc_0041415C_28:
	ldrh	r1, [r0], #2
.Lfunc_0041415C_2c:
	cmp	r1, #0
.Lfunc_0041415C_30:
	beq .Lfunc_0041415C_94
.Lfunc_0041415C_34:
	ldrh	r2, [r0]
.Lfunc_0041415C_38:
	sub	r1, r2, #48
.Lfunc_0041415C_3c:
	cmp	r1, #10
.Lfunc_0041415C_40:
	bcs .Lfunc_0041415C_94
.Lfunc_0041415C_44:
	ldrh	r3, [r0, #2]!
.Lfunc_0041415C_48:
	sub	ip, r2, #48
.Lfunc_0041415C_4c:
	mvn	r1, #47
.Lfunc_0041415C_50:
	sub	r2, r3, #48
.Lfunc_0041415C_54:
	cmp	r2, #10
.Lfunc_0041415C_58:
	bcs .Lfunc_0041415C_94
.Lfunc_0041415C_5c:
	add	ip, ip, ip, lsl #2
.Lfunc_0041415C_60:
	ldrh	r2, [r0, #2]!
.Lfunc_0041415C_64:
	add	r4, r1, ip, lsl #1
.Lfunc_0041415C_68:
	add	r3, r3, r4
.Lfunc_0041415C_6c:
	sub	ip, r2, #48
.Lfunc_0041415C_70:
	cmp	ip, #10
.Lfunc_0041415C_74:
	bcs .Lfunc_0041415C_94
.Lfunc_0041415C_78:
	add	r3, r3, r3, lsl #2
.Lfunc_0041415C_7c:
	ldrh	r0, [r0, #2]
.Lfunc_0041415C_80:
	add	ip, r1, r3, lsl #1
.Lfunc_0041415C_84:
	add	r2, r2, ip
.Lfunc_0041415C_88:
	sub	r3, r0, #48
.Lfunc_0041415C_8c:
	cmp	r3, #10
.Lfunc_0041415C_90:
	bcc .Lfunc_0041415C_a0
.Lfunc_0041415C_94:
	pop	{r4}
.Lfunc_0041415C_98:
	mvn	r0, #0
.Lfunc_0041415C_9c:
	bx	lr
.Lfunc_0041415C_a0:
	add	r2, r2, r2, lsl #2
.Lfunc_0041415C_a4:
	pop	{r4}
.Lfunc_0041415C_a8:
	add	r1, r1, r2, lsl #1
.Lfunc_0041415C_ac:
	add	r0, r0, r1
.Lfunc_0041415C_b0:
	bx	lr
.size func_0041415C, .-func_0041415C

.section .text.func_004942A0,"ax",%progbits
.balign 4
.global func_004942A0
.type func_004942A0, %function
func_004942A0:
.Lfunc_004942A0_0:
	push	{r4, r5, r6, r7}
.Lfunc_004942A0_4:
	ldrh	r2, [r0, #4]
.Lfunc_004942A0_8:
	strh	r2, [r1, #20]
.Lfunc_004942A0_c:
	ldrh	r1, [r0, #4]
.Lfunc_004942A0_10:
	add	r1, r1, #1
.Lfunc_004942A0_14:
	uxth	r1, r1
.Lfunc_004942A0_18:
	cmp	r1, #16000
.Lfunc_004942A0_1c:
	strh	r1, [r0, #4]
.Lfunc_004942A0_20:
	bcc .Lfunc_004942A0_a8
.Lfunc_004942A0_24:
	ldr	r1, [r0, #12]
.Lfunc_004942A0_28:
	mov	r6, #0
.Lfunc_004942A0_2c:
	add	r2, r0, #8
.Lfunc_004942A0_30:
	cmp	r1, r2
.Lfunc_004942A0_34:
	ldrne	r1, [r1, #4]
.Lfunc_004942A0_38:
	addne	r6, r6, #1
.Lfunc_004942A0_3c:
	bne .Lfunc_004942A0_30
.Lfunc_004942A0_40:
	cmp	r6, #0
.Lfunc_004942A0_44:
	mov	r7, #0
.Lfunc_004942A0_48:
	mov	r5, r7
.Lfunc_004942A0_4c:
	addhi	r3, r0, #8
.Lfunc_004942A0_50:
	bls .Lfunc_004942A0_a4
.Lfunc_004942A0_54:
	ldr	ip, [r0, #12]
.Lfunc_004942A0_58:
	cmp	ip, r3
.Lfunc_004942A0_5c:
	ldrhne	r4, [ip, #20]
.Lfunc_004942A0_60:
	mov	r1, ip
.Lfunc_004942A0_64:
	moveq	r4, #16000
.Lfunc_004942A0_68:
	beq .Lfunc_004942A0_8c
.Lfunc_004942A0_6c:
	ldrh	r2, [r1, #20]
.Lfunc_004942A0_70:
	cmp	r2, r5
.Lfunc_004942A0_74:
	cmpcs	r4, r2
.Lfunc_004942A0_78:
	movhi	ip, r1
.Lfunc_004942A0_7c:
	ldr	r1, [r1, #4]
.Lfunc_004942A0_80:
	movhi	r4, r2
.Lfunc_004942A0_84:
	cmp	r1, r3
.Lfunc_004942A0_88:
	bne .Lfunc_004942A0_6c
.Lfunc_004942A0_8c:
	add	r1, r5, #1
.Lfunc_004942A0_90:
	add	r7, r7, #1
.Lfunc_004942A0_94:
	strh	r5, [ip, #20]
.Lfunc_004942A0_98:
	uxth	r5, r1
.Lfunc_004942A0_9c:
	cmp	r7, r6
.Lfunc_004942A0_a0:
	bcc .Lfunc_004942A0_54
.Lfunc_004942A0_a4:
	strh	r5, [r0, #4]
.Lfunc_004942A0_a8:
	pop	{r4, r5, r6, r7}
.Lfunc_004942A0_ac:
	bx	lr
.size func_004942A0, .-func_004942A0

.section .text.func_00499124,"ax",%progbits
.balign 4
.global func_00499124
.type func_00499124, %function
func_00499124:
.Lfunc_00499124_0:
	push	{r4, r5, r6, r7, r8, lr}
.Lfunc_00499124_4:
	mov	r4, r2
.Lfunc_00499124_8:
	add	r2, sp, #24
.Lfunc_00499124_c:
	sub	r1, r1, #7
.Lfunc_00499124_10:
	ldm	r2, {r5, r6}
.Lfunc_00499124_14:
	sxth	r1, r1
.Lfunc_00499124_18:
	ldr	r2, [r0, #40]
.Lfunc_00499124_1c:
	mov	r7, r3
.Lfunc_00499124_20:
	mov	r3, #2
.Lfunc_00499124_24:
	add	r3, r3, r1, lsl #1
.Lfunc_00499124_28:
	add	ip, r2, r1, lsl #1
.Lfunc_00499124_2c:
	ldrh	r1, [r2, r3]
.Lfunc_00499124_30:
	ldrsh	r2, [ip]
.Lfunc_00499124_34:
	sub	r1, r1, r2
.Lfunc_00499124_38:
	sxth	r1, r1
.Lfunc_00499124_3c:
	cmp	r1, #2
.Lfunc_00499124_40:
	ble .Lfunc_00499124_7c
.Lfunc_00499124_44:
	sub	r1, r1, #2
.Lfunc_00499124_48:
	add	r1, r1, r1, lsr #31
.Lfunc_00499124_4c:
	asr	r1, r1, #1
.Lfunc_00499124_50:
	strh	r1, [r4]
.Lfunc_00499124_54:
	ldr	r0, [r0, #40]
.Lfunc_00499124_58:
	add	r0, r0, r2
.Lfunc_00499124_5c:
	str	r0, [r7]
.Lfunc_00499124_60:
	ldrsh	r1, [r4]
.Lfunc_00499124_64:
	add	r0, r0, r1, lsl #1
.Lfunc_00499124_68:
	ldrsb	r1, [r0]
.Lfunc_00499124_6c:
	strh	r1, [r5]
.Lfunc_00499124_70:
	ldrsb	r0, [r0, #1]
.Lfunc_00499124_74:
	strh	r0, [r6]
.Lfunc_00499124_78:
	pop	{r4, r5, r6, r7, r8, pc}
.Lfunc_00499124_7c:
	cmp	r1, #0
.Lfunc_00499124_80:
	beq .Lfunc_00499124_94
.Lfunc_00499124_84:
	mov	r2, #0
.Lfunc_00499124_88:
	mov	r1, r2
.Lfunc_00499124_8c:
	mov	r0, r2
.Lfunc_00499124_90:
	mov r0, r0
.Lfunc_00499124_94:
	mov	r0, #0
.Lfunc_00499124_98:
	strh	r0, [r4]
.Lfunc_00499124_9c:
	mvn	r1, #0
.Lfunc_00499124_a0:
	str	r0, [r7]
.Lfunc_00499124_a4:
	strh	r1, [r5]
.Lfunc_00499124_a8:
	strh	r1, [r6]
.Lfunc_00499124_ac:
	pop	{r4, r5, r6, r7, r8, pc}
.size func_00499124, .-func_00499124

.section .text.func_004957A4,"ax",%progbits
.balign 4
.global func_004957A4
.type func_004957A4, %function
func_004957A4:
.Lfunc_004957A4_0:
	push	{r4}
.Lfunc_004957A4_4:
	ldrh	r2, [r1]
.Lfunc_004957A4_8:
	strh	r2, [r0]
.Lfunc_004957A4_c:
	ldrh	r2, [r1, #2]
.Lfunc_004957A4_10:
	strh	r2, [r0, #2]
.Lfunc_004957A4_14:
	ldrh	r3, [r1, #4]
.Lfunc_004957A4_18:
	mov	r2, #1
.Lfunc_004957A4_1c:
	strh	r3, [r0, #4]
.Lfunc_004957A4_20:
	add	r3, r1, r2, lsl #1
.Lfunc_004957A4_24:
	add	ip, r0, r2, lsl #1
.Lfunc_004957A4_28:
	ldrh	r4, [r3, #4]
.Lfunc_004957A4_2c:
	add	r2, r2, #2
.Lfunc_004957A4_30:
	strh	r4, [ip, #4]
.Lfunc_004957A4_34:
	ldrh	r3, [r3, #6]
.Lfunc_004957A4_38:
	sxth	r2, r2
.Lfunc_004957A4_3c:
	cmp	r2, #13
.Lfunc_004957A4_40:
	strh	r3, [ip, #6]
.Lfunc_004957A4_44:
	blt .Lfunc_004957A4_20
.Lfunc_004957A4_48:
	mov	r2, #0
.Lfunc_004957A4_4c:
	add	ip, r1, r2, lsl #1
.Lfunc_004957A4_50:
	add	r3, r0, r2, lsl #1
.Lfunc_004957A4_54:
	ldrh	r4, [ip, #32]
.Lfunc_004957A4_58:
	add	r2, r2, #2
.Lfunc_004957A4_5c:
	strh	r4, [r3, #32]
.Lfunc_004957A4_60:
	ldrh	r4, [ip, #44]
.Lfunc_004957A4_64:
	sxth	r2, r2
.Lfunc_004957A4_68:
	cmp	r2, #6
.Lfunc_004957A4_6c:
	strh	r4, [r3, #44]
.Lfunc_004957A4_70:
	ldrh	r4, [ip, #34]
.Lfunc_004957A4_74:
	strh	r4, [r3, #34]
.Lfunc_004957A4_78:
	ldrh	ip, [ip, #46]
.Lfunc_004957A4_7c:
	strh	ip, [r3, #46]
.Lfunc_004957A4_80:
	blt .Lfunc_004957A4_4c
.Lfunc_004957A4_84:
	ldrh	r2, [r1, #56]
.Lfunc_004957A4_88:
	strh	r2, [r0, #56]
.Lfunc_004957A4_8c:
	ldrh	r2, [r1, #60]
.Lfunc_004957A4_90:
	strh	r2, [r0, #60]
.Lfunc_004957A4_94:
	ldrh	r2, [r1, #58]
.Lfunc_004957A4_98:
	strh	r2, [r0, #58]
.Lfunc_004957A4_9c:
	ldrh	r1, [r1, #62]
.Lfunc_004957A4_a0:
	strh	r1, [r0, #62]
.Lfunc_004957A4_a4:
	pop	{r4}
.Lfunc_004957A4_a8:
	bx	lr
.size func_004957A4, .-func_004957A4

.section .text.func_00441514,"ax",%progbits
.balign 4
.global func_00441514
.type func_00441514, %function
func_00441514:
.Lfunc_00441514_0:
	push	{r4, r5, r6, lr}
.Lfunc_00441514_4:
	mov	r5, r0
.Lfunc_00441514_8:
	mov	r4, #0
.Lfunc_00441514_c:
	and	r0, r4, #255
.Lfunc_00441514_10:
	cmp	r0, #3
.Lfunc_00441514_14:
	bcc .Lfunc_00441514_44
.Lfunc_00441514_18:
	mov	r2, #0
.Lfunc_00441514_1c:
	mov	r1, r2
.Lfunc_00441514_20:
	mov	r0, r2
.Lfunc_00441514_24:
	mov r0, r0
.Lfunc_00441514_28:
	mov	r2, #0
.Lfunc_00441514_2c:
	mov	r1, r2
.Lfunc_00441514_30:
	mov	r0, r2
.Lfunc_00441514_34:
	mov r0, r0
.Lfunc_00441514_38:
	nop	{0}
.Lfunc_00441514_3c:
	nop	{0}
.Lfunc_00441514_40:
	b .Lfunc_00441514_98
.Lfunc_00441514_44:
	add	r0, r0, r0, lsl #1
.Lfunc_00441514_48:
	add	r0, r5, r0, lsl #2
.Lfunc_00441514_4c:
	adds	r1, r0, #3296
.Lfunc_00441514_50:
	beq .Lfunc_00441514_28
.Lfunc_00441514_54:
	ldr	r0, [r1]
.Lfunc_00441514_58:
	cmp	r0, #0
.Lfunc_00441514_5c:
	beq .Lfunc_00441514_98
.Lfunc_00441514_60:
	ldr	r0, [r1, #4]
.Lfunc_00441514_64:
	add	r2, r1, #4
.Lfunc_00441514_68:
	cmp	r0, r2
.Lfunc_00441514_6c:
	beq .Lfunc_00441514_98
.Lfunc_00441514_70:
	ldr	r3, [r0, #-12]
.Lfunc_00441514_74:
	add	r2, r1, #4
.Lfunc_00441514_78:
	bic	r3, r3, #31
.Lfunc_00441514_7c:
	str	r3, [r0, #-12]
.Lfunc_00441514_80:
	ldr	r3, [r0, #-120]
.Lfunc_00441514_84:
	bic	r3, r3, #2
.Lfunc_00441514_88:
	str	r3, [r0, #-120]
.Lfunc_00441514_8c:
	ldr	r0, [r0]
.Lfunc_00441514_90:
	cmp	r0, r2
.Lfunc_00441514_94:
	bne .Lfunc_00441514_70
.Lfunc_00441514_98:
	add	r4, r4, #1
.Lfunc_00441514_9c:
	cmp	r4, #3
.Lfunc_00441514_a0:
	bcc .Lfunc_00441514_c
.Lfunc_00441514_a4:
	pop	{r4, r5, r6, pc}
.size func_00441514, .-func_00441514

.section .text.func_00498B60,"ax",%progbits
.balign 4
.global func_00498B60
.type func_00498B60, %function
func_00498B60:
.Lfunc_00498B60_0:
	push	{r4}
.Lfunc_00498B60_4:
	ldrh	r2, [r1]
.Lfunc_00498B60_8:
	strh	r2, [r0]
.Lfunc_00498B60_c:
	ldrh	r2, [r1, #2]
.Lfunc_00498B60_10:
	strh	r2, [r0, #2]
.Lfunc_00498B60_14:
	mov	r2, #0
.Lfunc_00498B60_18:
	add	ip, r1, r2, lsl #1
.Lfunc_00498B60_1c:
	add	r3, r0, r2, lsl #1
.Lfunc_00498B60_20:
	ldrh	r4, [ip, #4]
.Lfunc_00498B60_24:
	add	r2, r2, #2
.Lfunc_00498B60_28:
	strh	r4, [r3, #4]
.Lfunc_00498B60_2c:
	ldrh	ip, [ip, #6]
.Lfunc_00498B60_30:
	sxth	r2, r2
.Lfunc_00498B60_34:
	cmp	r2, #14
.Lfunc_00498B60_38:
	strh	ip, [r3, #6]
.Lfunc_00498B60_3c:
	blt .Lfunc_00498B60_18
.Lfunc_00498B60_40:
	mov	r2, #0
.Lfunc_00498B60_44:
	add	r3, r1, r2, lsl #1
.Lfunc_00498B60_48:
	add	ip, r0, r2, lsl #1
.Lfunc_00498B60_4c:
	ldrh	r4, [r3, #32]
.Lfunc_00498B60_50:
	add	r2, r2, #2
.Lfunc_00498B60_54:
	strh	r4, [ip, #32]
.Lfunc_00498B60_58:
	ldrh	r4, [r3, #44]
.Lfunc_00498B60_5c:
	sxth	r2, r2
.Lfunc_00498B60_60:
	cmp	r2, #6
.Lfunc_00498B60_64:
	strh	r4, [ip, #44]
.Lfunc_00498B60_68:
	ldrh	r4, [r3, #34]
.Lfunc_00498B60_6c:
	strh	r4, [ip, #34]
.Lfunc_00498B60_70:
	ldrh	r3, [r3, #46]
.Lfunc_00498B60_74:
	strh	r3, [ip, #46]
.Lfunc_00498B60_78:
	blt .Lfunc_00498B60_44
.Lfunc_00498B60_7c:
	ldrh	r2, [r1, #56]
.Lfunc_00498B60_80:
	strh	r2, [r0, #56]
.Lfunc_00498B60_84:
	ldrh	r2, [r1, #60]
.Lfunc_00498B60_88:
	strh	r2, [r0, #60]
.Lfunc_00498B60_8c:
	ldrh	r2, [r1, #58]
.Lfunc_00498B60_90:
	strh	r2, [r0, #58]
.Lfunc_00498B60_94:
	ldrh	r1, [r1, #62]
.Lfunc_00498B60_98:
	strh	r1, [r0, #62]
.Lfunc_00498B60_9c:
	pop	{r4}
.Lfunc_00498B60_a0:
	bx	lr
.size func_00498B60, .-func_00498B60

.section .text.func_0045C0E8,"ax",%progbits
.balign 4
.global func_0045C0E8
.type func_0045C0E8, %function
func_0045C0E8:
.Lfunc_0045C0E8_0:
	mov	r3, r0
.Lfunc_0045C0E8_4:
	vldr	s0, [r1]
.Lfunc_0045C0E8_8:
	mov	r0, #0
.Lfunc_0045C0E8_c:
	add	r2, r0, r0, lsl #1
.Lfunc_0045C0E8_10:
	add	r2, r3, r2, lsl #2
.Lfunc_0045C0E8_14:
	vldr	s1, [r2, #4]
.Lfunc_0045C0E8_18:
	vcmp.f32	s1, s0
.Lfunc_0045C0E8_1c:
	vmrs	APSR_nzcv, fpscr
.Lfunc_0045C0E8_20:
	bne .Lfunc_0045C0E8_4c
.Lfunc_0045C0E8_24:
	vldr	s1, [r2, #8]
.Lfunc_0045C0E8_28:
	vldr	s2, [r1, #4]
.Lfunc_0045C0E8_2c:
	vcmp.f32	s1, s2
.Lfunc_0045C0E8_30:
	vmrs	APSR_nzcv, fpscr
.Lfunc_0045C0E8_34:
	bne .Lfunc_0045C0E8_4c
.Lfunc_0045C0E8_38:
	vldr	s1, [r2, #12]
.Lfunc_0045C0E8_3c:
	vldr	s2, [r1, #8]
.Lfunc_0045C0E8_40:
	vcmp.f32	s1, s2
.Lfunc_0045C0E8_44:
	vmrs	APSR_nzcv, fpscr
.Lfunc_0045C0E8_48:
	beq .Lfunc_0045C0E8_88
.Lfunc_0045C0E8_4c:
	vldr	s1, [r2, #16]
.Lfunc_0045C0E8_50:
	vcmp.f32	s1, s0
.Lfunc_0045C0E8_54:
	vmrs	APSR_nzcv, fpscr
.Lfunc_0045C0E8_58:
	bne .Lfunc_0045C0E8_8c
.Lfunc_0045C0E8_5c:
	vldr	s1, [r2, #20]
.Lfunc_0045C0E8_60:
	vldr	s2, [r1, #4]
.Lfunc_0045C0E8_64:
	vcmp.f32	s1, s2
.Lfunc_0045C0E8_68:
	vmrs	APSR_nzcv, fpscr
.Lfunc_0045C0E8_6c:
	bne .Lfunc_0045C0E8_8c
.Lfunc_0045C0E8_70:
	vldr	s1, [r2, #24]
.Lfunc_0045C0E8_74:
	vldr	s2, [r1, #8]
.Lfunc_0045C0E8_78:
	vcmp.f32	s1, s2
.Lfunc_0045C0E8_7c:
	vmrs	APSR_nzcv, fpscr
.Lfunc_0045C0E8_80:
	bne .Lfunc_0045C0E8_8c
.Lfunc_0045C0E8_84:
	add	r0, r0, #1
.Lfunc_0045C0E8_88:
	bx	lr
.Lfunc_0045C0E8_8c:
	add	r0, r0, #2
.Lfunc_0045C0E8_90:
	cmp	r0, #84
.Lfunc_0045C0E8_94:
	blt .Lfunc_0045C0E8_c
.Lfunc_0045C0E8_98:
	mvn	r0, #0
.Lfunc_0045C0E8_9c:
	bx	lr
.size func_0045C0E8, .-func_0045C0E8

.section .text.func_00463DCC,"ax",%progbits
.balign 4
.global func_00463DCC
.type func_00463DCC, %function
func_00463DCC:
.Lfunc_00463DCC_0:
	push	{r4}
.Lfunc_00463DCC_4:
	ldrb	r2, [r1, #36]
.Lfunc_00463DCC_8:
	add	r4, r2, r2, lsl #1
.Lfunc_00463DCC_c:
	mov	r2, #0
.Lfunc_00463DCC_10:
	add	r3, r4, r2
.Lfunc_00463DCC_14:
	add	r3, r3, r3, lsl #2
.Lfunc_00463DCC_18:
	add	r3, r0, r3, lsl #3
.Lfunc_00463DCC_1c:
	ldrb	r3, [r3, #307]
.Lfunc_00463DCC_20:
	cmp	r3, #0
.Lfunc_00463DCC_24:
	beq .Lfunc_00463DCC_70
.Lfunc_00463DCC_28:
	add	r2, r2, #1
.Lfunc_00463DCC_2c:
	cmp	r2, #3
.Lfunc_00463DCC_30:
	bcc .Lfunc_00463DCC_10
.Lfunc_00463DCC_34:
	mov	r2, #0
.Lfunc_00463DCC_38:
	add	r3, r4, r2
.Lfunc_00463DCC_3c:
	add	r2, r2, #1
.Lfunc_00463DCC_40:
	add	r3, r3, r3, lsl #2
.Lfunc_00463DCC_44:
	cmp	r2, #2
.Lfunc_00463DCC_48:
	add	r3, r0, r3, lsl #3
.Lfunc_00463DCC_4c:
	add	ip, r3, #312
.Lfunc_00463DCC_50:
	add	r3, r3, #272
.Lfunc_00463DCC_54:
	vldmia	ip, {s0-s7}
.Lfunc_00463DCC_58:
	add	ip, ip, #32
.Lfunc_00463DCC_5c:
	vstmia	r3, {s0-s7}
.Lfunc_00463DCC_60:
	add	r3, r3, #32
.Lfunc_00463DCC_64:
	vldmia	ip, {s0-s1}
.Lfunc_00463DCC_68:
	vstmia	r3, {s0-s1}
.Lfunc_00463DCC_6c:
	bcc .Lfunc_00463DCC_38
.Lfunc_00463DCC_70:
	add	r2, r2, r4
.Lfunc_00463DCC_74:
	vldmia	r1, {s0-s7}
.Lfunc_00463DCC_78:
	add	r2, r2, r2, lsl #2
.Lfunc_00463DCC_7c:
	add	r0, r0, r2, lsl #3
.Lfunc_00463DCC_80:
	add	r0, r0, #272
.Lfunc_00463DCC_84:
	vstmia	r0, {s0-s7}
.Lfunc_00463DCC_88:
	ldr	r2, [r1, #36]
.Lfunc_00463DCC_8c:
	ldr	r1, [r1, #32]
.Lfunc_00463DCC_90:
	str	r1, [r0, #32]
.Lfunc_00463DCC_94:
	str	r2, [r0, #36]
.Lfunc_00463DCC_98:
	pop	{r4}
.Lfunc_00463DCC_9c:
	bx	lr
.size func_00463DCC, .-func_00463DCC

.section .text.func_00410A6C,"ax",%progbits
.balign 4
.global func_00410A6C
.type func_00410A6C, %function
func_00410A6C:
.Lfunc_00410A6C_0:
	and	r1, r2, #15
.Lfunc_00410A6C_4:
	cmp	r1, #9
.Lfunc_00410A6C_8:
	addls	r1, r1, #48
.Lfunc_00410A6C_c:
	addhi	r1, r1, #87
.Lfunc_00410A6C_10:
	lsr	r2, r2, #4
.Lfunc_00410A6C_14:
	sxtb	r3, r1
.Lfunc_00410A6C_18:
	and	r1, r2, #15
.Lfunc_00410A6C_1c:
	cmp	r1, #9
.Lfunc_00410A6C_20:
	addls	r1, r1, #48
.Lfunc_00410A6C_24:
	addhi	r1, r1, #87
.Lfunc_00410A6C_28:
	strb	r3, [r0, #4]
.Lfunc_00410A6C_2c:
	sxtb	r3, r1
.Lfunc_00410A6C_30:
	lsr	r2, r2, #4
.Lfunc_00410A6C_34:
	and	r1, r2, #15
.Lfunc_00410A6C_38:
	cmp	r1, #9
.Lfunc_00410A6C_3c:
	addls	r1, r1, #48
.Lfunc_00410A6C_40:
	addhi	r1, r1, #87
.Lfunc_00410A6C_44:
	strb	r3, [r0, #3]
.Lfunc_00410A6C_48:
	sxtb	r3, r1
.Lfunc_00410A6C_4c:
	lsr	r2, r2, #4
.Lfunc_00410A6C_50:
	and	r1, r2, #15
.Lfunc_00410A6C_54:
	cmp	r1, #9
.Lfunc_00410A6C_58:
	addls	r1, r1, #48
.Lfunc_00410A6C_5c:
	addhi	r1, r1, #87
.Lfunc_00410A6C_60:
	strb	r3, [r0, #2]
.Lfunc_00410A6C_64:
	lsr	r3, r2, #4
.Lfunc_00410A6C_68:
	sxtb	r2, r1
.Lfunc_00410A6C_6c:
	and	r1, r3, #15
.Lfunc_00410A6C_70:
	cmp	r1, #9
.Lfunc_00410A6C_74:
	addls	r1, r1, #48
.Lfunc_00410A6C_78:
	addhi	r1, r1, #87
.Lfunc_00410A6C_7c:
	strb	r2, [r0, #1]
.Lfunc_00410A6C_80:
	sxtb	r1, r1
.Lfunc_00410A6C_84:
	strb	r1, [r0]
.Lfunc_00410A6C_88:
	mov	r1, #0
.Lfunc_00410A6C_8c:
	strb	r1, [r0, #5]
.Lfunc_00410A6C_90:
	bx	lr
.size func_00410A6C, .-func_00410A6C

.section .text.func_004415BC,"ax",%progbits
.balign 4
.global func_004415BC
.type func_004415BC, %function
func_004415BC:
.Lfunc_004415BC_0:
	cmp	r1, #3
.Lfunc_004415BC_4:
	push	{r4, lr}
.Lfunc_004415BC_8:
	bcc .Lfunc_004415BC_38
.Lfunc_004415BC_c:
	mov	r2, #0
.Lfunc_004415BC_10:
	mov	r1, r2
.Lfunc_004415BC_14:
	mov	r0, r2
.Lfunc_004415BC_18:
	mov r0, r0
.Lfunc_004415BC_1c:
	mov	r2, #0
.Lfunc_004415BC_20:
	mov	r1, r2
.Lfunc_004415BC_24:
	mov	r0, r2
.Lfunc_004415BC_28:
	mov r0, r0
.Lfunc_004415BC_2c:
	nop	{0}
.Lfunc_004415BC_30:
	nop	{0}
.Lfunc_004415BC_34:
	b .Lfunc_004415BC_88
.Lfunc_004415BC_38:
	add	r1, r1, r1, lsl #1
.Lfunc_004415BC_3c:
	add	r0, r0, r1, lsl #2
.Lfunc_004415BC_40:
	adds	r1, r0, #3296
.Lfunc_004415BC_44:
	beq .Lfunc_004415BC_1c
.Lfunc_004415BC_48:
	ldr	r0, [r1]
.Lfunc_004415BC_4c:
	cmp	r0, #0
.Lfunc_004415BC_50:
	beq .Lfunc_004415BC_88
.Lfunc_004415BC_54:
	ldr	r0, [r1, #4]
.Lfunc_004415BC_58:
	add	r2, r1, #4
.Lfunc_004415BC_5c:
	cmp	r0, r2
.Lfunc_004415BC_60:
	beq .Lfunc_004415BC_88
.Lfunc_004415BC_64:
	ldr	r2, [r0, #-12]
.Lfunc_004415BC_68:
	tst	r2, #64
.Lfunc_004415BC_6c:
	beq .Lfunc_004415BC_78
.Lfunc_004415BC_70:
	mov	r0, #1
.Lfunc_004415BC_74:
	pop	{r4, pc}
.Lfunc_004415BC_78:
	ldr	r0, [r0]
.Lfunc_004415BC_7c:
	add	r2, r1, #4
.Lfunc_004415BC_80:
	cmp	r0, r2
.Lfunc_004415BC_84:
	bne .Lfunc_004415BC_64
.Lfunc_004415BC_88:
	mov	r0, #0
.Lfunc_004415BC_8c:
	pop	{r4, pc}
.size func_004415BC, .-func_004415BC

.section .text.func_004198F0,"ax",%progbits
.balign 4
.global func_004198F0
.type func_004198F0, %function
func_004198F0:
.Lfunc_004198F0_0:
	ldr	r1, [r0, #212]
.Lfunc_004198F0_4:
	cmp	r1, #0
.Lfunc_004198F0_8:
	mov	r1, #0
.Lfunc_004198F0_c:
	bxle	lr
.Lfunc_004198F0_10:
	push	{r4, r5, r6}
.Lfunc_004198F0_14:
	mov	r3, #4
.Lfunc_004198F0_18:
	mov	r4, #16
.Lfunc_004198F0_1c:
	ldr	ip, [r0, #4]
.Lfunc_004198F0_20:
	add	r2, r1, r1, lsl #2
.Lfunc_004198F0_24:
	add	r2, r2, r1, lsl #3
.Lfunc_004198F0_28:
	ldr	ip, [ip, r2, lsl #3]
.Lfunc_004198F0_2c:
	cmp	ip, #0
.Lfunc_004198F0_30:
	beq .Lfunc_004198F0_64
.Lfunc_004198F0_34:
	add	ip, ip, #40
.Lfunc_004198F0_38:
	ldr	r5, [r0, #4]
.Lfunc_004198F0_3c:
	vldmia	ip, {s0-s2}
.Lfunc_004198F0_40:
	add	ip, r3, r2, lsl #3
.Lfunc_004198F0_44:
	add	r6, r5, ip
.Lfunc_004198F0_48:
	add	r5, r4, r2, lsl #3
.Lfunc_004198F0_4c:
	vstmia	r6, {s0-s2}
.Lfunc_004198F0_50:
	ldr	r2, [r0, #4]
.Lfunc_004198F0_54:
	add	ip, ip, r2
.Lfunc_004198F0_58:
	add	r2, r2, r5
.Lfunc_004198F0_5c:
	vldmia	ip, {s0-s2}
.Lfunc_004198F0_60:
	vstmia	r2, {s0-s2}
.Lfunc_004198F0_64:
	add	r1, r1, #1
.Lfunc_004198F0_68:
	ldr	r2, [r0, #212]
.Lfunc_004198F0_6c:
	cmp	r2, r1
.Lfunc_004198F0_70:
	bgt .Lfunc_004198F0_1c
.Lfunc_004198F0_74:
	pop	{r4, r5, r6}
.Lfunc_004198F0_78:
	bx	lr
.size func_004198F0, .-func_004198F0

.section .text.func_004A0338,"ax",%progbits
.balign 4
.global func_004A0338
.type func_004A0338, %function
func_004A0338:
.Lfunc_004A0338_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_004A0338_4:
	ldr	r5, [r0, #12]
.Lfunc_004A0338_8:
	ldr	r7, [sp, #24]
.Lfunc_004A0338_c:
	mov	r0, #0
.Lfunc_004A0338_10:
	cmp	r5, #0
.Lfunc_004A0338_14:
	movne	r6, #0
.Lfunc_004A0338_18:
	beq .Lfunc_004A0338_58
.Lfunc_004A0338_1c:
	ldr	r1, [r5, #28]
.Lfunc_004A0338_20:
	add	ip, r5, #24
.Lfunc_004A0338_24:
	cmp	r1, ip
.Lfunc_004A0338_28:
	beq .Lfunc_004A0338_60
.Lfunc_004A0338_2c:
	ldrd	r8, [r1, #8]
.Lfunc_004A0338_30:
	eor	r4, r8, r2
.Lfunc_004A0338_34:
	eor	r0, r9, r3
.Lfunc_004A0338_38:
	orrs	r0, r0, r4
.Lfunc_004A0338_3c:
	ldrne	r1, [r1, #4]
.Lfunc_004A0338_40:
	bne .Lfunc_004A0338_24
.Lfunc_004A0338_44:
	cmp	r1, #0
.Lfunc_004A0338_48:
	beq .Lfunc_004A0338_60
.Lfunc_004A0338_4c:
	ldr	r1, [r1, #16]
.Lfunc_004A0338_50:
	mov	r0, #1
.Lfunc_004A0338_54:
	str	r1, [r7]
.Lfunc_004A0338_58:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_004A0338_5c:
	bx	lr
.Lfunc_004A0338_60:
	ldr	r5, [r5]
.Lfunc_004A0338_64:
	mov	r0, r6
.Lfunc_004A0338_68:
	cmp	r5, #0
.Lfunc_004A0338_6c:
	bne .Lfunc_004A0338_1c
.Lfunc_004A0338_70:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_004A0338_74:
	bx	lr
.size func_004A0338, .-func_004A0338

.section .text.func_004AC534,"ax",%progbits
.balign 4
.global func_004AC534
.type func_004AC534, %function
func_004AC534:
.Lfunc_004AC534_0:
	push	{r4, r5}
.Lfunc_004AC534_4:
	ldr	r3, [r0, #76]
.Lfunc_004AC534_8:
	mov	ip, r3
.Lfunc_004AC534_c:
	ldr	r2, [r3, #4]
.Lfunc_004AC534_10:
	cmp	r2, #0
.Lfunc_004AC534_14:
	ldrne	r4, [r1]
.Lfunc_004AC534_18:
	beq .Lfunc_004AC534_38
.Lfunc_004AC534_1c:
	ldr	r5, [r2, #16]
.Lfunc_004AC534_20:
	cmp	r5, r4
.Lfunc_004AC534_24:
	movcs	ip, r2
.Lfunc_004AC534_28:
	ldrcs	r2, [r2, #8]
.Lfunc_004AC534_2c:
	ldrcc	r2, [r2, #12]
.Lfunc_004AC534_30:
	cmp	r2, #0
.Lfunc_004AC534_34:
	bne .Lfunc_004AC534_1c
.Lfunc_004AC534_38:
	cmp	ip, r3
.Lfunc_004AC534_3c:
	beq .Lfunc_004AC534_50
.Lfunc_004AC534_40:
	ldr	r1, [r1]
.Lfunc_004AC534_44:
	ldr	r2, [ip, #16]
.Lfunc_004AC534_48:
	cmp	r2, r1
.Lfunc_004AC534_4c:
	movls	r3, ip
.Lfunc_004AC534_50:
	ldr	r0, [r0, #76]
.Lfunc_004AC534_54:
	cmp	r3, r0
.Lfunc_004AC534_58:
	moveq	r0, #0
.Lfunc_004AC534_5c:
	beq .Lfunc_004AC534_70
.Lfunc_004AC534_60:
	ldr	r1, [r3, #20]
.Lfunc_004AC534_64:
	ldr	r0, [r1, #4]
.Lfunc_004AC534_68:
	cmp	r0, #0
.Lfunc_004AC534_6c:
	ldreq	r0, [r1]
.Lfunc_004AC534_70:
	pop	{r4, r5}
.Lfunc_004AC534_74:
	bx	lr
.size func_004AC534, .-func_004AC534

.section .text.func_00415F9C,"ax",%progbits
.balign 4
.global func_00415F9C
.type func_00415F9C, %function
func_00415F9C:
.Lfunc_00415F9C_0:
	ldrh	r2, [r0]
.Lfunc_00415F9C_4:
	cmp	r2, #0
.Lfunc_00415F9C_8:
	ldrhne	r3, [r1]
.Lfunc_00415F9C_c:
	cmpne	r3, #0
.Lfunc_00415F9C_10:
	beq .Lfunc_00415F9C_44
.Lfunc_00415F9C_14:
	sub	ip, r2, #65
.Lfunc_00415F9C_18:
	cmp	ip, #25
.Lfunc_00415F9C_1c:
	addls	r2, r2, #32
.Lfunc_00415F9C_20:
	sub	ip, r3, #65
.Lfunc_00415F9C_24:
	cmp	ip, #25
.Lfunc_00415F9C_28:
	addls	r3, r3, #32
.Lfunc_00415F9C_2c:
	uxth	r2, r2
.Lfunc_00415F9C_30:
	uxth	r3, r3
.Lfunc_00415F9C_34:
	cmp	r2, r3
.Lfunc_00415F9C_38:
	addeq	r0, r0, #2
.Lfunc_00415F9C_3c:
	addeq	r1, r1, #2
.Lfunc_00415F9C_40:
	beq .Lfunc_00415F9C_0
.Lfunc_00415F9C_44:
	ldrh	r0, [r0]
.Lfunc_00415F9C_48:
	sub	r2, r0, #65
.Lfunc_00415F9C_4c:
	cmp	r2, #25
.Lfunc_00415F9C_50:
	addls	r0, r0, #32
.Lfunc_00415F9C_54:
	uxth	r2, r0
.Lfunc_00415F9C_58:
	ldrh	r0, [r1]
.Lfunc_00415F9C_5c:
	sub	r1, r0, #65
.Lfunc_00415F9C_60:
	cmp	r1, #25
.Lfunc_00415F9C_64:
	addls	r0, r0, #32
.Lfunc_00415F9C_68:
	uxth	r0, r0
.Lfunc_00415F9C_6c:
	sub	r0, r2, r0
.Lfunc_00415F9C_70:
	bx	lr
.size func_00415F9C, .-func_00415F9C

.section .text.func_00442550,"ax",%progbits
.balign 4
.global func_00442550
.type func_00442550, %function
func_00442550:
.Lfunc_00442550_0:
	push	{r4}
.Lfunc_00442550_4:
	ldr	r2, [r0, #16]
.Lfunc_00442550_8:
	cmp	r2, r1
.Lfunc_00442550_c:
	ldrne	r3, [r0, #20]
.Lfunc_00442550_10:
	cmpne	r3, r1
.Lfunc_00442550_14:
	beq .Lfunc_00442550_5c
.Lfunc_00442550_18:
	ldr	ip, [r0, #24]
.Lfunc_00442550_1c:
	cmp	ip, r1
.Lfunc_00442550_20:
	ldrne	r4, [r0, #28]
.Lfunc_00442550_24:
	cmpne	r4, r1
.Lfunc_00442550_28:
	beq .Lfunc_00442550_5c
.Lfunc_00442550_2c:
	cmp	r2, #0
.Lfunc_00442550_30:
	streq	r1, [r0, #16]
.Lfunc_00442550_34:
	beq .Lfunc_00442550_68
.Lfunc_00442550_38:
	cmp	r3, #0
.Lfunc_00442550_3c:
	streq	r1, [r0, #20]
.Lfunc_00442550_40:
	beq .Lfunc_00442550_68
.Lfunc_00442550_44:
	cmp	ip, #0
.Lfunc_00442550_48:
	streq	r1, [r0, #24]
.Lfunc_00442550_4c:
	beq .Lfunc_00442550_68
.Lfunc_00442550_50:
	cmp	r4, #0
.Lfunc_00442550_54:
	streq	r1, [r0, #28]
.Lfunc_00442550_58:
	beq .Lfunc_00442550_68
.Lfunc_00442550_5c:
	pop	{r4}
.Lfunc_00442550_60:
	mov	r0, #0
.Lfunc_00442550_64:
	bx	lr
.Lfunc_00442550_68:
	pop	{r4}
.Lfunc_00442550_6c:
	mov	r0, #1
.Lfunc_00442550_70:
	bx	lr
.size func_00442550, .-func_00442550

.section .text.func_0044A794,"ax",%progbits
.balign 4
.global func_0044A794
.type func_0044A794, %function
func_0044A794:
.Lfunc_0044A794_0:
	push	{r4}
.Lfunc_0044A794_4:
	ldr	r2, [r0, #4]
.Lfunc_0044A794_8:
	cmp	r2, r1
.Lfunc_0044A794_c:
	ldrne	r3, [r0, #8]
.Lfunc_0044A794_10:
	cmpne	r3, r1
.Lfunc_0044A794_14:
	beq .Lfunc_0044A794_5c
.Lfunc_0044A794_18:
	ldr	ip, [r0, #12]
.Lfunc_0044A794_1c:
	cmp	ip, r1
.Lfunc_0044A794_20:
	ldrne	r4, [r0, #16]
.Lfunc_0044A794_24:
	cmpne	r4, r1
.Lfunc_0044A794_28:
	beq .Lfunc_0044A794_5c
.Lfunc_0044A794_2c:
	cmp	r2, #0
.Lfunc_0044A794_30:
	streq	r1, [r0, #4]
.Lfunc_0044A794_34:
	beq .Lfunc_0044A794_68
.Lfunc_0044A794_38:
	cmp	r3, #0
.Lfunc_0044A794_3c:
	streq	r1, [r0, #8]
.Lfunc_0044A794_40:
	beq .Lfunc_0044A794_68
.Lfunc_0044A794_44:
	cmp	ip, #0
.Lfunc_0044A794_48:
	streq	r1, [r0, #12]
.Lfunc_0044A794_4c:
	beq .Lfunc_0044A794_68
.Lfunc_0044A794_50:
	cmp	r4, #0
.Lfunc_0044A794_54:
	streq	r1, [r0, #16]
.Lfunc_0044A794_58:
	beq .Lfunc_0044A794_68
.Lfunc_0044A794_5c:
	pop	{r4}
.Lfunc_0044A794_60:
	mov	r0, #0
.Lfunc_0044A794_64:
	bx	lr
.Lfunc_0044A794_68:
	pop	{r4}
.Lfunc_0044A794_6c:
	mov	r0, #1
.Lfunc_0044A794_70:
	bx	lr
.size func_0044A794, .-func_0044A794

.section .text.func_0047DB94,"ax",%progbits
.balign 4
.global func_0047DB94
.type func_0047DB94, %function
func_0047DB94:
.Lfunc_0047DB94_0:
	push	{r4, lr}
.Lfunc_0047DB94_4:
	mov	r4, r0
.Lfunc_0047DB94_8:
	vpush	{d8}
.Lfunc_0047DB94_c:
	ldrb	r0, [r0, #10]
.Lfunc_0047DB94_10:
	vldr	s0, [sp, #16]
.Lfunc_0047DB94_14:
	vldr	s16, [sp, #20]
.Lfunc_0047DB94_18:
	vldr	s1, [sp, #24]
.Lfunc_0047DB94_1c:
	vldr	s17, [sp, #28]
.Lfunc_0047DB94_20:
	cmp	r0, #0
.Lfunc_0047DB94_24:
	beq .Lfunc_0047DB94_50
.Lfunc_0047DB94_28:
	mov	r2, #0
.Lfunc_0047DB94_2c:
	mov	r1, r2
.Lfunc_0047DB94_30:
	mov	r0, r2
.Lfunc_0047DB94_34:
	mov r0, r0
.Lfunc_0047DB94_38:
	mov	r0, #2
.Lfunc_0047DB94_3c:
	vstr	s17, [r4, #24]
.Lfunc_0047DB94_40:
	strb	r0, [r4, #10]
.Lfunc_0047DB94_44:
	vstr	s16, [r4, #28]
.Lfunc_0047DB94_48:
	vpop	{d8}
.Lfunc_0047DB94_4c:
	pop	{r4, pc}
.Lfunc_0047DB94_50:
	mov	ip, #0
.Lfunc_0047DB94_54:
	strb	ip, [r4, #11]
.Lfunc_0047DB94_58:
	str	r1, [r4, #4]
.Lfunc_0047DB94_5c:
	strh	r2, [r4, #8]
.Lfunc_0047DB94_60:
	add	r0, r4, #16
.Lfunc_0047DB94_64:
	str	r3, [r4, #12]
.Lfunc_0047DB94_68:
	vstmia	r0, {s0-s1}
.Lfunc_0047DB94_6c:
	b .Lfunc_0047DB94_38
.size func_0047DB94, .-func_0047DB94

.section .text.func_0049A0F8,"ax",%progbits
.balign 4
.global func_0049A0F8
.type func_0049A0F8, %function
func_0049A0F8:
.Lfunc_0049A0F8_0:
	add	r1, r0, #7424
.Lfunc_0049A0F8_4:
	push	{r4, lr}
.Lfunc_0049A0F8_8:
	ldrsb	r2, [r1, #241]
.Lfunc_0049A0F8_c:
	cmp	r2, #32
.Lfunc_0049A0F8_10:
	bge .Lfunc_0049A0F8_58
.Lfunc_0049A0F8_14:
	ldrsb	r1, [r1, #240]
.Lfunc_0049A0F8_18:
	add	r1, r1, r2
.Lfunc_0049A0F8_1c:
	add	r2, r2, #1
.Lfunc_0049A0F8_20:
	asr	r3, r1, #31
.Lfunc_0049A0F8_24:
	add	r3, r1, r3, lsr #27
.Lfunc_0049A0F8_28:
	bic	r3, r3, #31
.Lfunc_0049A0F8_2c:
	sub	r1, r1, r3
.Lfunc_0049A0F8_30:
	add	r3, r1, r1, lsl #1
.Lfunc_0049A0F8_34:
	add	r1, r3, r1, lsl #3
.Lfunc_0049A0F8_38:
	add	r1, r0, r1, lsl #3
.Lfunc_0049A0F8_3c:
	add	r0, r0, #7424
.Lfunc_0049A0F8_40:
	add	r0, r0, #241
.Lfunc_0049A0F8_44:
	add	r1, r1, #4096
.Lfunc_0049A0F8_48:
	add	r1, r1, #752
.Lfunc_0049A0F8_4c:
	strb	r2, [r0]
.Lfunc_0049A0F8_50:
	mov	r0, r1
.Lfunc_0049A0F8_54:
	pop	{r4, pc}
.Lfunc_0049A0F8_58:
	mov	r2, #0
.Lfunc_0049A0F8_5c:
	mov	r1, r2
.Lfunc_0049A0F8_60:
	mov	r0, r2
.Lfunc_0049A0F8_64:
	mov r0, r0
.Lfunc_0049A0F8_68:
	mov	r0, #0
.Lfunc_0049A0F8_6c:
	pop	{r4, pc}
.size func_0049A0F8, .-func_0049A0F8

.section .text.func_004A0CDC,"ax",%progbits
.balign 4
.global func_004A0CDC
.type func_004A0CDC, %function
func_004A0CDC:
.Lfunc_004A0CDC_0:
	add	r1, r0, #7936
.Lfunc_004A0CDC_4:
	push	{r4, lr}
.Lfunc_004A0CDC_8:
	ldrsb	r2, [r1, #93]
.Lfunc_004A0CDC_c:
	cmp	r2, #32
.Lfunc_004A0CDC_10:
	bge .Lfunc_004A0CDC_58
.Lfunc_004A0CDC_14:
	ldrsb	r1, [r1, #92]
.Lfunc_004A0CDC_18:
	add	r1, r1, r2
.Lfunc_004A0CDC_1c:
	add	r2, r2, #1
.Lfunc_004A0CDC_20:
	asr	r3, r1, #31
.Lfunc_004A0CDC_24:
	add	r3, r1, r3, lsr #27
.Lfunc_004A0CDC_28:
	bic	r3, r3, #31
.Lfunc_004A0CDC_2c:
	sub	r1, r1, r3
.Lfunc_004A0CDC_30:
	add	r3, r1, r1, lsl #1
.Lfunc_004A0CDC_34:
	add	r1, r3, r1, lsl #3
.Lfunc_004A0CDC_38:
	add	r1, r0, r1, lsl #3
.Lfunc_004A0CDC_3c:
	add	r0, r0, #7936
.Lfunc_004A0CDC_40:
	add	r0, r0, #93
.Lfunc_004A0CDC_44:
	add	r1, r1, #5120
.Lfunc_004A0CDC_48:
	add	r1, r1, #92
.Lfunc_004A0CDC_4c:
	strb	r2, [r0]
.Lfunc_004A0CDC_50:
	mov	r0, r1
.Lfunc_004A0CDC_54:
	pop	{r4, pc}
.Lfunc_004A0CDC_58:
	mov	r2, #0
.Lfunc_004A0CDC_5c:
	mov	r1, r2
.Lfunc_004A0CDC_60:
	mov	r0, r2
.Lfunc_004A0CDC_64:
	mov r0, r0
.Lfunc_004A0CDC_68:
	mov	r0, #0
.Lfunc_004A0CDC_6c:
	pop	{r4, pc}
.size func_004A0CDC, .-func_004A0CDC

.section .text.func_00415EC4,"ax",%progbits
.balign 4
.global func_00415EC4
.type func_00415EC4, %function
func_00415EC4:
.Lfunc_00415EC4_0:
	cmp	r2, #0
.Lfunc_00415EC4_4:
	push	{r4}
.Lfunc_00415EC4_8:
	ble .Lfunc_00415EC4_28
.Lfunc_00415EC4_c:
	mov	r3, #0
.Lfunc_00415EC4_10:
	mvn	ip, #47
.Lfunc_00415EC4_14:
	str	r3, [r0]
.Lfunc_00415EC4_18:
	b .Lfunc_00415EC4_4c
.Lfunc_00415EC4_1c:
	sub	r4, r3, #48
.Lfunc_00415EC4_20:
	cmp	r4, #10
.Lfunc_00415EC4_24:
	bcc .Lfunc_00415EC4_34
.Lfunc_00415EC4_28:
	pop	{r4}
.Lfunc_00415EC4_2c:
	mov	r0, #0
.Lfunc_00415EC4_30:
	bx	lr
.Lfunc_00415EC4_34:
	ldr	r4, [r0]
.Lfunc_00415EC4_38:
	add	r1, r1, #1
.Lfunc_00415EC4_3c:
	add	r4, r4, r4, lsl #2
.Lfunc_00415EC4_40:
	add	r4, ip, r4, lsl #1
.Lfunc_00415EC4_44:
	add	r3, r3, r4
.Lfunc_00415EC4_48:
	str	r3, [r0]
.Lfunc_00415EC4_4c:
	subs	r2, r2, #1
.Lfunc_00415EC4_50:
	bmi .Lfunc_00415EC4_60
.Lfunc_00415EC4_54:
	ldrsb	r3, [r1]
.Lfunc_00415EC4_58:
	cmp	r3, #0
.Lfunc_00415EC4_5c:
	bne .Lfunc_00415EC4_1c
.Lfunc_00415EC4_60:
	pop	{r4}
.Lfunc_00415EC4_64:
	mov	r0, #1
.Lfunc_00415EC4_68:
	bx	lr
.size func_00415EC4, .-func_00415EC4
