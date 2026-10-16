.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00480588,"ax",%progbits
.balign 4
.global func_00480588
.type func_00480588, %function
func_00480588:
.Lfunc_00480588_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_00480588_4:
	mov	r5, #0
.Lfunc_00480588_8:
	ldr	ip, [r1, #16]!
.Lfunc_00480588_c:
	add	r7, r1, #16
.Lfunc_00480588_10:
	str	ip, [r0]
.Lfunc_00480588_14:
	ldr	r3, [r1, #4]
.Lfunc_00480588_18:
	str	r3, [r0, #4]
.Lfunc_00480588_1c:
	ldr	r2, [r1, #8]
.Lfunc_00480588_20:
	str	r2, [r0, #8]
.Lfunc_00480588_24:
	mul	r2, r3, r2
.Lfunc_00480588_28:
	ldr	r3, [r1, #12]
.Lfunc_00480588_2c:
	subs	r1, ip, #1
.Lfunc_00480588_30:
	moveq	r6, #1
.Lfunc_00480588_34:
	mul	r2, r2, r3
.Lfunc_00480588_38:
	movne	r6, r2
.Lfunc_00480588_3c:
	str	r2, [r0, #16]
.Lfunc_00480588_40:
	cmpne	r1, #1
.Lfunc_00480588_44:
	str	r3, [r0, #12]
.Lfunc_00480588_48:
	beq	.Lfunc_00480588_70
.Lfunc_00480588_4c:
	tst	r1, #1
.Lfunc_00480588_50:
	muleq	r6, r2, r2
.Lfunc_00480588_54:
	sub	r1, r1, #1
.Lfunc_00480588_58:
	lsrs	r1, r1, #1
.Lfunc_00480588_5c:
	beq	.Lfunc_00480588_70
.Lfunc_00480588_60:
	mul	r3, r6, r2
.Lfunc_00480588_64:
	subs	r1, r1, #1
.Lfunc_00480588_68:
	mul	r6, r3, r2
.Lfunc_00480588_6c:
	bne	.Lfunc_00480588_60
.Lfunc_00480588_70:
	cmp	ip, #1
.Lfunc_00480588_74:
	mulgt	r8, r2, r2
.Lfunc_00480588_78:
	mov	r3, #1
.Lfunc_00480588_7c:
	bgt	.Lfunc_00480588_90
.Lfunc_00480588_80:
	b	.Lfunc_00480588_d0
.Lfunc_00480588_84:
	cmp	r3, #0
.Lfunc_00480588_88:
	moveq	r1, #1
.Lfunc_00480588_8c:
	beq	.Lfunc_00480588_c0
.Lfunc_00480588_90:
	cmp	r3, #1
.Lfunc_00480588_94:
	mov	r1, r2
.Lfunc_00480588_98:
	beq	.Lfunc_00480588_c0
.Lfunc_00480588_9c:
	tst	r3, #1
.Lfunc_00480588_a0:
	sub	r4, r3, #1
.Lfunc_00480588_a4:
	moveq	r1, r8
.Lfunc_00480588_a8:
	lsrs	r4, r4, #1
.Lfunc_00480588_ac:
	beq	.Lfunc_00480588_c0
.Lfunc_00480588_b0:
	mul	r1, r1, r2
.Lfunc_00480588_b4:
	subs	r4, r4, #1
.Lfunc_00480588_b8:
	mul	r1, r1, r2
.Lfunc_00480588_bc:
	bne	.Lfunc_00480588_b0
.Lfunc_00480588_c0:
	add	r3, r3, #1
.Lfunc_00480588_c4:
	cmp	ip, r3
.Lfunc_00480588_c8:
	add	r5, r5, r1
.Lfunc_00480588_cc:
	bgt	.Lfunc_00480588_84
.Lfunc_00480588_d0:
	str	r7, [r0, #56]
.Lfunc_00480588_d4:
	ldr	r1, [r7]
.Lfunc_00480588_d8:
	cmp	r2, #1
.Lfunc_00480588_dc:
	add	r3, r7, r5, lsl #5
.Lfunc_00480588_e0:
	str	r1, [r0, #20]
.Lfunc_00480588_e4:
	ldr	r1, [r7, #4]
.Lfunc_00480588_e8:
	mov	ip, #1
.Lfunc_00480588_ec:
	str	r1, [r0, #24]
.Lfunc_00480588_f0:
	ldr	r1, [r7, #8]
.Lfunc_00480588_f4:
	str	r1, [r0, #28]
.Lfunc_00480588_f8:
	ldr	r1, [r7, #16]
.Lfunc_00480588_fc:
	str	r1, [r0, #32]
.Lfunc_00480588_100:
	ldr	r1, [r7, #20]
.Lfunc_00480588_104:
	str	r1, [r0, #36]
.Lfunc_00480588_108:
	ldr	r1, [r7, #24]
.Lfunc_00480588_10c:
	str	r1, [r0, #40]
.Lfunc_00480588_110:
	ble	.Lfunc_00480588_1cc
.Lfunc_00480588_114:
	ldr	r1, [r0, #56]
.Lfunc_00480588_118:
	vldr	s6, [r0, #32]
.Lfunc_00480588_11c:
	add	r2, r0, #32
.Lfunc_00480588_120:
	add	r1, r1, ip, lsl #5
.Lfunc_00480588_124:
	mov	r4, r2
.Lfunc_00480588_128:
	vldr	s0, [r1, #16]
.Lfunc_00480588_12c:
	vldr	s1, [r1]
.Lfunc_00480588_130:
	vldr	s3, [r1, #4]
.Lfunc_00480588_134:
	vcmpe.f32	s6, s0
.Lfunc_00480588_138:
	vldr	s2, [r1, #8]
.Lfunc_00480588_13c:
	vldr	s5, [r1, #20]
.Lfunc_00480588_140:
	vldr	s4, [r1, #24]
.Lfunc_00480588_144:
	add	r1, r0, #20
.Lfunc_00480588_148:
	vmrs	APSR_nzcv, fpscr
.Lfunc_00480588_14c:
	add	ip, ip, #1
.Lfunc_00480588_150:
	vmovgt.f32	s0, s6
.Lfunc_00480588_154:
	vstr	s0, [r4]
.Lfunc_00480588_158:
	vldr	s0, [r2, #4]
.Lfunc_00480588_15c:
	vcmpe.f32	s0, s5
.Lfunc_00480588_160:
	vmrs	APSR_nzcv, fpscr
.Lfunc_00480588_164:
	vmovgt.f32	s5, s0
.Lfunc_00480588_168:
	vstr	s5, [r4, #4]
.Lfunc_00480588_16c:
	vldr	s0, [r2, #8]
.Lfunc_00480588_170:
	vcmpe.f32	s0, s4
.Lfunc_00480588_174:
	vmrs	APSR_nzcv, fpscr
.Lfunc_00480588_178:
	vmovgt.f32	s4, s0
.Lfunc_00480588_17c:
	vstr	s4, [r2, #8]
.Lfunc_00480588_180:
	vldr	s0, [r0, #20]
.Lfunc_00480588_184:
	mov	r2, r1
.Lfunc_00480588_188:
	vcmpe.f32	s0, s1
.Lfunc_00480588_18c:
	vmrs	APSR_nzcv, fpscr
.Lfunc_00480588_190:
	vmovle.f32	s1, s0
.Lfunc_00480588_194:
	vstr	s1, [r2]
.Lfunc_00480588_198:
	vldr	s0, [r1, #4]
.Lfunc_00480588_19c:
	vcmpe.f32	s0, s3
.Lfunc_00480588_1a0:
	vmrs	APSR_nzcv, fpscr
.Lfunc_00480588_1a4:
	vmovle.f32	s3, s0
.Lfunc_00480588_1a8:
	vstr	s3, [r2, #4]
.Lfunc_00480588_1ac:
	vldr	s0, [r1, #8]
.Lfunc_00480588_1b0:
	vcmpe.f32	s0, s2
.Lfunc_00480588_1b4:
	vmrs	APSR_nzcv, fpscr
.Lfunc_00480588_1b8:
	vmovle.f32	s2, s0
.Lfunc_00480588_1bc:
	vstr	s2, [r1, #8]
.Lfunc_00480588_1c0:
	ldr	r1, [r0, #16]
.Lfunc_00480588_1c4:
	cmp	r1, ip
.Lfunc_00480588_1c8:
	bgt	.Lfunc_00480588_114
.Lfunc_00480588_1cc:
	add	r1, r3, r6, lsl #3
.Lfunc_00480588_1d0:
	str	r3, [r0, #60]
.Lfunc_00480588_1d4:
	str	r1, [r0, #64]
.Lfunc_00480588_1d8:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_00480588_1dc:
	bx	lr
.size func_00480588, .-func_00480588

.section .text.func_004A810C,"ax",%progbits
.balign 4
.global func_004A810C
.type func_004A810C, %function
func_004A810C:
.Lfunc_004A810C_0:
	push	{r4, lr}
.Lfunc_004A810C_4:
	ldr	r3, [r1, #4]
.Lfunc_004A810C_8:
	add	r2, r1, #8
.Lfunc_004A810C_c:
	ands	r3, r3, #255
.Lfunc_004A810C_10:
	movne	ip, #0
.Lfunc_004A810C_14:
	strb	r3, [r0, #12]
.Lfunc_004A810C_18:
	beq	.Lfunc_004A810C_38
.Lfunc_004A810C_1c:
	ldr	lr, [r2], #4
.Lfunc_004A810C_20:
	add	r4, r0, ip, lsl #2
.Lfunc_004A810C_24:
	subs	r3, r3, #1
.Lfunc_004A810C_28:
	add	lr, lr, r1
.Lfunc_004A810C_2c:
	add	ip, ip, #1
.Lfunc_004A810C_30:
	str	lr, [r4, #16]
.Lfunc_004A810C_34:
	bne	.Lfunc_004A810C_1c
.Lfunc_004A810C_38:
	ldr	r1, [r2, #20]
.Lfunc_004A810C_3c:
	str	r1, [r0, #156]
.Lfunc_004A810C_40:
	pop	{r4, lr}
.Lfunc_004A810C_44:
	mov	r0, r0
.Lfunc_004A810C_48:
	push	{r4, r5, r6, r7}
.Lfunc_004A810C_4c:
	mov	r2, #0
.Lfunc_004A810C_50:
	ldr	r1, [r0, #156]
.Lfunc_004A810C_54:
	ldrb	r7, [r0, #12]
.Lfunc_004A810C_58:
	mov	ip, r2
.Lfunc_004A810C_5c:
	lsl	r1, r1, #2
.Lfunc_004A810C_60:
	cmp	r7, #0
.Lfunc_004A810C_64:
	add	r1, r1, r7, lsl #2
.Lfunc_004A810C_68:
	bls	.Lfunc_004A810C_d0
.Lfunc_004A810C_6c:
	add	r3, r0, ip, lsl #2
.Lfunc_004A810C_70:
	ldr	r3, [r3, #16]
.Lfunc_004A810C_74:
	ldr	r4, [r3, #24]
.Lfunc_004A810C_78:
	ldr	r5, [r3, #28]
.Lfunc_004A810C_7c:
	add	r4, r4, r3
.Lfunc_004A810C_80:
	cmp	r5, #0
.Lfunc_004A810C_84:
	mov	r3, #0
.Lfunc_004A810C_88:
	bls	.Lfunc_004A810C_c0
.Lfunc_004A810C_8c:
	add	r6, r3, r3, lsl #2
.Lfunc_004A810C_90:
	add	r6, r4, r6, lsl #2
.Lfunc_004A810C_94:
	ldrh	r6, [r6]
.Lfunc_004A810C_98:
	cmp	r6, #0
.Lfunc_004A810C_9c:
	beq	.Lfunc_004A810C_b4
.Lfunc_004A810C_a0:
	cmp	r6, #1
.Lfunc_004A810C_a4:
	addeq	r2, r2, #2
.Lfunc_004A810C_a8:
	beq	.Lfunc_004A810C_b4
.Lfunc_004A810C_ac:
	cmp	r6, #2
.Lfunc_004A810C_b0:
	addeq	r2, r2, #6
.Lfunc_004A810C_b4:
	add	r3, r3, #1
.Lfunc_004A810C_b8:
	cmp	r5, r3
.Lfunc_004A810C_bc:
	bhi	.Lfunc_004A810C_8c
.Lfunc_004A810C_c0:
	add	r3, ip, #1
.Lfunc_004A810C_c4:
	and	ip, r3, #255
.Lfunc_004A810C_c8:
	cmp	r7, ip
.Lfunc_004A810C_cc:
	bhi	.Lfunc_004A810C_6c
.Lfunc_004A810C_d0:
	cmp	r7, #0
.Lfunc_004A810C_d4:
	mov	r3, #0
.Lfunc_004A810C_d8:
	add	r6, r1, r2, lsl #2
.Lfunc_004A810C_dc:
	beq	.Lfunc_004A810C_130
.Lfunc_004A810C_e0:
	tst	r7, #1
.Lfunc_004A810C_e4:
	mov	r1, #0
.Lfunc_004A810C_e8:
	beq	.Lfunc_004A810C_f8
.Lfunc_004A810C_ec:
	ldr	r2, [r0, #16]
.Lfunc_004A810C_f0:
	mov	r1, #1
.Lfunc_004A810C_f4:
	ldrb	r3, [r2, #6]
.Lfunc_004A810C_f8:
	lsrs	r2, r7, #1
.Lfunc_004A810C_fc:
	mov	ip, #0
.Lfunc_004A810C_100:
	beq	.Lfunc_004A810C_12c
.Lfunc_004A810C_104:
	add	r4, r0, r1, lsl #2
.Lfunc_004A810C_108:
	subs	r2, r2, #1
.Lfunc_004A810C_10c:
	ldr	r5, [r4, #16]
.Lfunc_004A810C_110:
	ldr	r4, [r4, #20]
.Lfunc_004A810C_114:
	add	r1, r1, #2
.Lfunc_004A810C_118:
	ldrb	r5, [r5, #6]
.Lfunc_004A810C_11c:
	ldrb	r4, [r4, #6]
.Lfunc_004A810C_120:
	add	r3, r3, r5
.Lfunc_004A810C_124:
	add	ip, ip, r4
.Lfunc_004A810C_128:
	bne	.Lfunc_004A810C_104
.Lfunc_004A810C_12c:
	add	r3, r3, ip
.Lfunc_004A810C_130:
	add	r1, r3, #1
.Lfunc_004A810C_134:
	sub	r2, r7, r3
.Lfunc_004A810C_138:
	cmp	r7, #0
.Lfunc_004A810C_13c:
	mul	r5, r2, r1
.Lfunc_004A810C_140:
	mov	r4, #0
.Lfunc_004A810C_144:
	add	r2, r6, r5, lsl #2
.Lfunc_004A810C_148:
	bls	.Lfunc_004A810C_1b4
.Lfunc_004A810C_14c:
	add	r1, r0, r4, lsl #2
.Lfunc_004A810C_150:
	ldr	r1, [r1, #16]
.Lfunc_004A810C_154:
	ldrb	r1, [r1, #6]
.Lfunc_004A810C_158:
	cmp	r1, #0
.Lfunc_004A810C_15c:
	bne	.Lfunc_004A810C_1a4
.Lfunc_004A810C_160:
	mov	r1, r7
.Lfunc_004A810C_164:
	mov	r3, #0
.Lfunc_004A810C_168:
	add	r2, r2, #152
.Lfunc_004A810C_16c:
	add	ip, r0, r3, lsl #2
.Lfunc_004A810C_170:
	ldr	ip, [ip, #16]
.Lfunc_004A810C_174:
	ldrb	r6, [ip, #6]
.Lfunc_004A810C_178:
	cmp	r6, #0
.Lfunc_004A810C_17c:
	beq	.Lfunc_004A810C_194
.Lfunc_004A810C_180:
	ldrb	ip, [ip, #20]
.Lfunc_004A810C_184:
	cmp	ip, #1
.Lfunc_004A810C_188:
	moveq	ip, #200
.Lfunc_004A810C_18c:
	movne	ip, #192
.Lfunc_004A810C_190:
	add	r2, r2, ip
.Lfunc_004A810C_194:
	sub	r1, r1, #1
.Lfunc_004A810C_198:
	cmp	r1, #0
.Lfunc_004A810C_19c:
	add	r3, r3, #1
.Lfunc_004A810C_1a0:
	bgt	.Lfunc_004A810C_16c
.Lfunc_004A810C_1a4:
	add	r1, r4, #1
.Lfunc_004A810C_1a8:
	and	r4, r1, #255
.Lfunc_004A810C_1ac:
	cmp	r7, r4
.Lfunc_004A810C_1b0:
	bhi	.Lfunc_004A810C_14c
.Lfunc_004A810C_1b4:
	add	r0, r2, r7, lsl #2
.Lfunc_004A810C_1b8:
	add	r0, r0, r7, lsl #2
.Lfunc_004A810C_1bc:
	add	r0, r0, #4
.Lfunc_004A810C_1c0:
	add	r0, r0, r5, lsl #2
.Lfunc_004A810C_1c4:
	pop	{r4, r5, r6, r7}
.Lfunc_004A810C_1c8:
	bx	lr
.size func_004A810C, .-func_004A810C

.section .text.func_004BB600,"ax",%progbits
.balign 4
.global func_004BB600
.type func_004BB600, %function
func_004BB600:
.Lfunc_004BB600_0:
	push	{r4, r5}
.Lfunc_004BB600_4:
	ldr	r3, [r0, #52]
.Lfunc_004BB600_8:
	add	ip, r1, r1, lsl #1
.Lfunc_004BB600_c:
	add	r4, ip, r1, lsl #3
.Lfunc_004BB600_10:
	ldr	r1, [r3, r4, lsl #2]
.Lfunc_004BB600_14:
	cmp	r1, #0
.Lfunc_004BB600_18:
	beq	.Lfunc_004BB600_d0
.Lfunc_004BB600_1c:
	ldrh	ip, [r2]
.Lfunc_004BB600_20:
	ldrh	r3, [r1, #4]
.Lfunc_004BB600_24:
	orr	r3, r3, ip
.Lfunc_004BB600_28:
	strh	r3, [r2]
.Lfunc_004BB600_2c:
	ldr	r3, [r1, #88]
.Lfunc_004BB600_30:
	str	r3, [r2, #60]
.Lfunc_004BB600_34:
	ldr	r3, [r1, #92]
.Lfunc_004BB600_38:
	str	r3, [r2, #64]
.Lfunc_004BB600_3c:
	ldr	r3, [r1, #96]
.Lfunc_004BB600_40:
	str	r3, [r2, #68]
.Lfunc_004BB600_44:
	ldr	r3, [r1, #100]
.Lfunc_004BB600_48:
	str	r3, [r2, #72]
.Lfunc_004BB600_4c:
	ldr	r3, [r1, #104]
.Lfunc_004BB600_50:
	str	r3, [r2, #76]
.Lfunc_004BB600_54:
	mov	r3, #0
.Lfunc_004BB600_58:
	add	ip, r1, r3, lsl #2
.Lfunc_004BB600_5c:
	add	r5, r2, r3, lsl #2
.Lfunc_004BB600_60:
	ldr	ip, [ip, #108]
.Lfunc_004BB600_64:
	add	r3, r3, #1
.Lfunc_004BB600_68:
	cmp	r3, #6
.Lfunc_004BB600_6c:
	str	ip, [r5, #36]
.Lfunc_004BB600_70:
	blt	.Lfunc_004BB600_58
.Lfunc_004BB600_74:
	ldr	r3, [r1, #132]
.Lfunc_004BB600_78:
	add	ip, r1, #12
.Lfunc_004BB600_7c:
	add	r5, r2, #232
.Lfunc_004BB600_80:
	str	r3, [r2, #80]
.Lfunc_004BB600_84:
	ldrb	r3, [r1, #164]
.Lfunc_004BB600_88:
	lsr	r3, r3, #4
.Lfunc_004BB600_8c:
	strb	r3, [r2, #3]
.Lfunc_004BB600_90:
	add	r3, r2, #280
.Lfunc_004BB600_94:
	vldmia	ip, {s0-s5}
.Lfunc_004BB600_98:
	add	ip, r1, #36
.Lfunc_004BB600_9c:
	vstmia	r5, {s0-s5}
.Lfunc_004BB600_a0:
	add	r5, r2, #256
.Lfunc_004BB600_a4:
	vldmia	ip, {s0-s5}
.Lfunc_004BB600_a8:
	add	ip, r1, #60
.Lfunc_004BB600_ac:
	vstmia	r5, {s0-s5}
.Lfunc_004BB600_b0:
	vldmia	ip, {s0-s5}
.Lfunc_004BB600_b4:
	vstmia	r3, {s0-s5}
.Lfunc_004BB600_b8:
	ldr	r3, [r1, #192]
.Lfunc_004BB600_bc:
	str	r3, [r2, #8]
.Lfunc_004BB600_c0:
	ldrh	r3, [r1, #84]
.Lfunc_004BB600_c4:
	strh	r3, [r2, #32]
.Lfunc_004BB600_c8:
	ldrh	r1, [r1, #86]
.Lfunc_004BB600_cc:
	strh	r1, [r2, #34]
.Lfunc_004BB600_d0:
	ldr	r1, [r0, #52]
.Lfunc_004BB600_d4:
	add	r1, r1, r4, lsl #2
.Lfunc_004BB600_d8:
	ldr	r3, [r1, #24]
.Lfunc_004BB600_dc:
	ldr	r3, [r3, #12]
.Lfunc_004BB600_e0:
	str	r3, [r2, #304]
.Lfunc_004BB600_e4:
	ldr	r3, [r1, #24]
.Lfunc_004BB600_e8:
	ldr	r3, [r3, #28]
.Lfunc_004BB600_ec:
	str	r3, [r2, #308]
.Lfunc_004BB600_f0:
	ldr	r1, [r1, #24]
.Lfunc_004BB600_f4:
	ldr	r1, [r1, #44]
.Lfunc_004BB600_f8:
	str	r1, [r2, #312]
.Lfunc_004BB600_fc:
	ldr	r0, [r0, #52]
.Lfunc_004BB600_100:
	add	r1, r0, r4, lsl #2
.Lfunc_004BB600_104:
	ldr	r0, [r1, #4]
.Lfunc_004BB600_108:
	cmp	r0, #0
.Lfunc_004BB600_10c:
	beq	.Lfunc_004BB600_140
.Lfunc_004BB600_110:
	ldrb	r3, [r0, #24]
.Lfunc_004BB600_114:
	ldm	r0, {r4, ip}
.Lfunc_004BB600_118:
	cmp	r3, #12
.Lfunc_004BB600_11c:
	str	r4, [r2, #316]
.Lfunc_004BB600_120:
	str	ip, [r2, #320]
.Lfunc_004BB600_124:
	ldrb	r0, [r2, #2]
.Lfunc_004BB600_128:
	moveq	r3, #1
.Lfunc_004BB600_12c:
	movne	r3, #0
.Lfunc_004BB600_130:
	cmp	r3, #0
.Lfunc_004BB600_134:
	orrne	r0, r0, #1
.Lfunc_004BB600_138:
	biceq	r0, r0, #1
.Lfunc_004BB600_13c:
	strb	r0, [r2, #2]
.Lfunc_004BB600_140:
	ldr	r0, [r1, #8]
.Lfunc_004BB600_144:
	cmp	r0, #0
.Lfunc_004BB600_148:
	beq	.Lfunc_004BB600_180
.Lfunc_004BB600_14c:
	ldrb	r3, [r0, #24]
.Lfunc_004BB600_150:
	cmp	r3, #12
.Lfunc_004BB600_154:
	add	r3, r0, #8
.Lfunc_004BB600_158:
	moveq	r0, #1
.Lfunc_004BB600_15c:
	ldm	r3, {r4, ip}
.Lfunc_004BB600_160:
	movne	r0, #0
.Lfunc_004BB600_164:
	cmp	r0, #0
.Lfunc_004BB600_168:
	str	r4, [r2, #324]
.Lfunc_004BB600_16c:
	str	ip, [r2, #328]
.Lfunc_004BB600_170:
	ldrb	r0, [r2, #2]
.Lfunc_004BB600_174:
	orrne	r0, r0, #2
.Lfunc_004BB600_178:
	biceq	r0, r0, #2
.Lfunc_004BB600_17c:
	strb	r0, [r2, #2]
.Lfunc_004BB600_180:
	ldr	r0, [r1, #12]
.Lfunc_004BB600_184:
	cmp	r0, #0
.Lfunc_004BB600_188:
	beq	.Lfunc_004BB600_1c4
.Lfunc_004BB600_18c:
	ldrb	r1, [r0, #24]
.Lfunc_004BB600_190:
	cmp	r1, #12
.Lfunc_004BB600_194:
	add	r1, r0, #16
.Lfunc_004BB600_198:
	moveq	r0, #1
.Lfunc_004BB600_19c:
	ldr	r3, [r1]
.Lfunc_004BB600_1a0:
	ldr	r1, [r1, #4]
.Lfunc_004BB600_1a4:
	movne	r0, #0
.Lfunc_004BB600_1a8:
	cmp	r0, #0
.Lfunc_004BB600_1ac:
	str	r1, [r2, #336]
.Lfunc_004BB600_1b0:
	str	r3, [r2, #332]
.Lfunc_004BB600_1b4:
	ldrb	r0, [r2, #2]
.Lfunc_004BB600_1b8:
	orrne	r0, r0, #4
.Lfunc_004BB600_1bc:
	biceq	r0, r0, #4
.Lfunc_004BB600_1c0:
	strb	r0, [r2, #2]
.Lfunc_004BB600_1c4:
	pop	{r4, r5}
.Lfunc_004BB600_1c8:
	bx	lr
.size func_004BB600, .-func_004BB600

.section .text.func_003A6D48,"ax",%progbits
.balign 4
.global func_003A6D48
.type func_003A6D48, %function
func_003A6D48:
.Lfunc_003A6D48_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_003A6D48_4:
	mov	r3, r0
.Lfunc_003A6D48_8:
	ldr	r0, [r0, #8]
.Lfunc_003A6D48_c:
	ldr	r2, [r3, #52]
.Lfunc_003A6D48_10:
	ldr	r0, [r0, #4]
.Lfunc_003A6D48_14:
	cmp	r2, #0
.Lfunc_003A6D48_18:
	beq	.Lfunc_003A6D48_78
.Lfunc_003A6D48_1c:
	ldrh	ip, [r0]
.Lfunc_003A6D48_20:
	cmp	ip, #0
.Lfunc_003A6D48_24:
	beq	.Lfunc_003A6D48_74
.Lfunc_003A6D48_28:
	uxth	ip, ip
.Lfunc_003A6D48_2c:
	cmp	ip, #10
.Lfunc_003A6D48_30:
	beq	.Lfunc_003A6D48_44
.Lfunc_003A6D48_34:
	cmp	ip, #16
.Lfunc_003A6D48_38:
	addne	r0, r0, #2
.Lfunc_003A6D48_3c:
	beq	.Lfunc_003A6D48_54
.Lfunc_003A6D48_40:
	b	.Lfunc_003A6D48_60
.Lfunc_003A6D48_44:
	subs	r2, r2, #1
.Lfunc_003A6D48_48:
	add	r0, r0, #2
.Lfunc_003A6D48_4c:
	beq	.Lfunc_003A6D48_78
.Lfunc_003A6D48_50:
	b	.Lfunc_003A6D48_60
.Lfunc_003A6D48_54:
	ldrh	ip, [r0, #2]
.Lfunc_003A6D48_58:
	add	ip, ip, #2
.Lfunc_003A6D48_5c:
	add	r0, r0, ip, lsl #1
.Lfunc_003A6D48_60:
	ldrh	ip, [r0]
.Lfunc_003A6D48_64:
	cmp	ip, #0
.Lfunc_003A6D48_68:
	bne	.Lfunc_003A6D48_28
.Lfunc_003A6D48_6c:
	cmp	r2, #0
.Lfunc_003A6D48_70:
	beq	.Lfunc_003A6D48_78
.Lfunc_003A6D48_74:
	mov	r0, #0
.Lfunc_003A6D48_78:
	cmp	r0, #0
.Lfunc_003A6D48_7c:
	mov	ip, #0
.Lfunc_003A6D48_80:
	beq	.Lfunc_003A6D48_1a4
.Lfunc_003A6D48_84:
	ldr	ip, [r3, #48]
.Lfunc_003A6D48_88:
	mov	r7, #1
.Lfunc_003A6D48_8c:
	mov	r5, #0
.Lfunc_003A6D48_90:
	add	r2, r0, ip, lsl #1
.Lfunc_003A6D48_94:
	ldrh	ip, [r2]
.Lfunc_003A6D48_98:
	cmp	ip, #16
.Lfunc_003A6D48_9c:
	beq	.Lfunc_003A6D48_b8
.Lfunc_003A6D48_a0:
	strb	r5, [r3, #61]
.Lfunc_003A6D48_a4:
	ldrh	ip, [r2]
.Lfunc_003A6D48_a8:
	cmp	ip, #0
.Lfunc_003A6D48_ac:
	cmpne	ip, #10
.Lfunc_003A6D48_b0:
	addne	r2, r2, #2
.Lfunc_003A6D48_b4:
	b	.Lfunc_003A6D48_17c
.Lfunc_003A6D48_b8:
	strb	r7, [r3, #61]
.Lfunc_003A6D48_bc:
	ldrh	ip, [r2]
.Lfunc_003A6D48_c0:
	add	r4, r3, #64
.Lfunc_003A6D48_c4:
	cmp	ip, #16
.Lfunc_003A6D48_c8:
	ldrheq	ip, [r2, #4]
.Lfunc_003A6D48_cc:
	movne	ip, #0
.Lfunc_003A6D48_d0:
	strh	ip, [r4]
.Lfunc_003A6D48_d4:
	ldrh	ip, [r2]
.Lfunc_003A6D48_d8:
	cmp	ip, #16
.Lfunc_003A6D48_dc:
	bne	.Lfunc_003A6D48_f4
.Lfunc_003A6D48_e0:
	ldrh	ip, [r2, #2]
.Lfunc_003A6D48_e4:
	sub	ip, ip, #1
.Lfunc_003A6D48_e8:
	cmp	ip, #15
.Lfunc_003A6D48_ec:
	uxthcc	ip, ip
.Lfunc_003A6D48_f0:
	bcc	.Lfunc_003A6D48_f8
.Lfunc_003A6D48_f4:
	mov	ip, #0
.Lfunc_003A6D48_f8:
	cmp	ip, #16
.Lfunc_003A6D48_fc:
	str	ip, [r4, #4]
.Lfunc_003A6D48_100:
	movhi	ip, #16
.Lfunc_003A6D48_104:
	strhi	ip, [r4, #4]
.Lfunc_003A6D48_108:
	cmp	ip, #0
.Lfunc_003A6D48_10c:
	mov	ip, #0
.Lfunc_003A6D48_110:
	bls	.Lfunc_003A6D48_164
.Lfunc_003A6D48_114:
	ldrh	r6, [r2]
.Lfunc_003A6D48_118:
	cmp	r6, #16
.Lfunc_003A6D48_11c:
	bne	.Lfunc_003A6D48_148
.Lfunc_003A6D48_120:
	ldrh	r6, [r2, #2]
.Lfunc_003A6D48_124:
	cmp	r6, #16
.Lfunc_003A6D48_128:
	movhi	r6, r5
.Lfunc_003A6D48_12c:
	bhi	.Lfunc_003A6D48_14c
.Lfunc_003A6D48_130:
	cmp	r6, #0
.Lfunc_003A6D48_134:
	subne	r8, r6, #1
.Lfunc_003A6D48_138:
	cmpne	r8, ip
.Lfunc_003A6D48_13c:
	addhi	r6, r2, ip, lsl #1
.Lfunc_003A6D48_140:
	ldrhhi	r6, [r6, #6]
.Lfunc_003A6D48_144:
	bhi	.Lfunc_003A6D48_14c
.Lfunc_003A6D48_148:
	mov	r6, #0
.Lfunc_003A6D48_14c:
	add	r8, r4, ip, lsl #1
.Lfunc_003A6D48_150:
	add	ip, ip, #1
.Lfunc_003A6D48_154:
	strh	r6, [r8, #8]
.Lfunc_003A6D48_158:
	ldr	r6, [r4, #4]
.Lfunc_003A6D48_15c:
	cmp	r6, ip
.Lfunc_003A6D48_160:
	bhi	.Lfunc_003A6D48_114
.Lfunc_003A6D48_164:
	ldrh	ip, [r2]
.Lfunc_003A6D48_168:
	cmp	ip, #16
.Lfunc_003A6D48_16c:
	bne	.Lfunc_003A6D48_17c
.Lfunc_003A6D48_170:
	ldrh	ip, [r2, #2]
.Lfunc_003A6D48_174:
	add	ip, ip, #2
.Lfunc_003A6D48_178:
	add	r2, r2, ip, lsl #1
.Lfunc_003A6D48_17c:
	sub	ip, r2, r0
.Lfunc_003A6D48_180:
	ldrh	r2, [r2]
.Lfunc_003A6D48_184:
	lsr	ip, ip, #1
.Lfunc_003A6D48_188:
	cmp	r2, #0
.Lfunc_003A6D48_18c:
	strbeq	r7, [r3, #60]
.Lfunc_003A6D48_190:
	beq	.Lfunc_003A6D48_1a4
.Lfunc_003A6D48_194:
	cmp	r2, #10
.Lfunc_003A6D48_198:
	strne	ip, [r3, #48]
.Lfunc_003A6D48_19c:
	strbne	r5, [r3, #60]
.Lfunc_003A6D48_1a0:
	beq	.Lfunc_003A6D48_1b0
.Lfunc_003A6D48_1a4:
	str	ip, [r1]
.Lfunc_003A6D48_1a8:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_003A6D48_1ac:
	bx	lr
.Lfunc_003A6D48_1b0:
	ldr	r2, [r3, #52]
.Lfunc_003A6D48_1b4:
	str	r5, [r3, #48]
.Lfunc_003A6D48_1b8:
	strb	r7, [r3, #60]
.Lfunc_003A6D48_1bc:
	add	r2, r2, #1
.Lfunc_003A6D48_1c0:
	str	r2, [r3, #52]
.Lfunc_003A6D48_1c4:
	b	.Lfunc_003A6D48_1a4
.size func_003A6D48, .-func_003A6D48

.section .text.func_0015FA28,"ax",%progbits
.balign 4
.global func_0015FA28
.type func_0015FA28, %function
func_0015FA28:
.Lfunc_0015FA28_0:
	push	{r4, r5, r6, r7}
.Lfunc_0015FA28_4:
	ldr	ip, [r0]
.Lfunc_0015FA28_8:
	ldrb	r4, [r0, #3]
.Lfunc_0015FA28_c:
	ldrb	r3, [r0]
.Lfunc_0015FA28_10:
	bic	ip, ip, #-16777216
.Lfunc_0015FA28_14:
	orr	r4, ip, r4, lsl #24
.Lfunc_0015FA28_18:
	and	ip, r3, #240
.Lfunc_0015FA28_1c:
	cmp	ip, #48
.Lfunc_0015FA28_20:
	tsteq	r3, #15
.Lfunc_0015FA28_24:
	lsr	r5, r4, #8
.Lfunc_0015FA28_28:
	mvnne	r0, #0
.Lfunc_0015FA28_2c:
	bne	.Lfunc_0015FA28_98
.Lfunc_0015FA28_30:
	cmp	r1, #4
.Lfunc_0015FA28_34:
	mov	r3, r1
.Lfunc_0015FA28_38:
	bls	.Lfunc_0015FA28_13c
.Lfunc_0015FA28_3c:
	cmp	r5, #0
.Lfunc_0015FA28_40:
	add	r0, r0, #4
.Lfunc_0015FA28_44:
	sub	r6, r3, #4
.Lfunc_0015FA28_48:
	bne	.Lfunc_0015FA28_70
.Lfunc_0015FA28_4c:
	cmp	r6, #4
.Lfunc_0015FA28_50:
	blt	.Lfunc_0015FA28_13c
.Lfunc_0015FA28_54:
	ldr	r1, [r0]
.Lfunc_0015FA28_58:
	ldrb	r3, [r0, #3]
.Lfunc_0015FA28_5c:
	add	r0, r0, #4
.Lfunc_0015FA28_60:
	bic	r1, r1, #-16777216
.Lfunc_0015FA28_64:
	sub	r6, r6, #4
.Lfunc_0015FA28_68:
	orrs	r5, r1, r3, lsl #24
.Lfunc_0015FA28_6c:
	beq	.Lfunc_0015FA28_1a0
.Lfunc_0015FA28_70:
	ldrb	r1, [r0], #1
.Lfunc_0015FA28_74:
	subs	r3, r6, #1
.Lfunc_0015FA28_78:
	and	ip, r1, #127
.Lfunc_0015FA28_7c:
	bmi	.Lfunc_0015FA28_13c
.Lfunc_0015FA28_80:
	tst	r1, #128
.Lfunc_0015FA28_84:
	beq	.Lfunc_0015FA28_a0
.Lfunc_0015FA28_88:
	add	r1, ip, #3
.Lfunc_0015FA28_8c:
	cmp	r1, r5
.Lfunc_0015FA28_90:
	bls	.Lfunc_0015FA28_12c
.Lfunc_0015FA28_94:
	mvn	r0, #3
.Lfunc_0015FA28_98:
	pop	{r4, r5, r6, r7}
.Lfunc_0015FA28_9c:
	bx	lr
.Lfunc_0015FA28_a0:
	add	r1, ip, #1
.Lfunc_0015FA28_a4:
	cmp	r1, r5
.Lfunc_0015FA28_a8:
	bhi	.Lfunc_0015FA28_94
.Lfunc_0015FA28_ac:
	subs	r6, r3, r1
.Lfunc_0015FA28_b0:
	bmi	.Lfunc_0015FA28_13c
.Lfunc_0015FA28_b4:
	ldrb	r3, [r0], #1
.Lfunc_0015FA28_b8:
	sub	r5, r5, r1
.Lfunc_0015FA28_bc:
	sub	r1, r1, #1
.Lfunc_0015FA28_c0:
	cmn	r1, #-2147483647
.Lfunc_0015FA28_c4:
	strb	r3, [r2], #1
.Lfunc_0015FA28_c8:
	bls	.Lfunc_0015FA28_e0
.Lfunc_0015FA28_cc:
	ldrb	r3, [r0], #1
.Lfunc_0015FA28_d0:
	subs	r1, r1, #1
.Lfunc_0015FA28_d4:
	strb	r3, [r2], #1
.Lfunc_0015FA28_d8:
	bne	.Lfunc_0015FA28_cc
.Lfunc_0015FA28_dc:
	b	.Lfunc_0015FA28_198
.Lfunc_0015FA28_e0:
	cmp	r1, #0
.Lfunc_0015FA28_e4:
	ble	.Lfunc_0015FA28_198
.Lfunc_0015FA28_e8:
	tst	r1, #1
.Lfunc_0015FA28_ec:
	sub	r3, r0, #1
.Lfunc_0015FA28_f0:
	sub	ip, r2, #1
.Lfunc_0015FA28_f4:
	beq	.Lfunc_0015FA28_100
.Lfunc_0015FA28_f8:
	ldrb	r4, [r3, #1]!
.Lfunc_0015FA28_fc:
	strb	r4, [ip, #1]!
.Lfunc_0015FA28_100:
	asrs	r4, r1, #1
.Lfunc_0015FA28_104:
	beq	.Lfunc_0015FA28_120
.Lfunc_0015FA28_108:
	ldrb	r7, [r3, #1]
.Lfunc_0015FA28_10c:
	subs	r4, r4, #1
.Lfunc_0015FA28_110:
	strb	r7, [ip, #1]
.Lfunc_0015FA28_114:
	ldrb	r7, [r3, #2]!
.Lfunc_0015FA28_118:
	strb	r7, [ip, #2]!
.Lfunc_0015FA28_11c:
	bne	.Lfunc_0015FA28_108
.Lfunc_0015FA28_120:
	add	r0, r0, r1
.Lfunc_0015FA28_124:
	add	r2, r2, r1
.Lfunc_0015FA28_128:
	b	.Lfunc_0015FA28_198
.Lfunc_0015FA28_12c:
	subs	r6, r3, #1
.Lfunc_0015FA28_130:
	ldrb	r3, [r0], #1
.Lfunc_0015FA28_134:
	sub	r5, r5, r1
.Lfunc_0015FA28_138:
	bpl	.Lfunc_0015FA28_148
.Lfunc_0015FA28_13c:
	pop	{r4, r5, r6, r7}
.Lfunc_0015FA28_140:
	mvn	r0, #1
.Lfunc_0015FA28_144:
	bx	lr
.Lfunc_0015FA28_148:
	sub	r1, r1, #1
.Lfunc_0015FA28_14c:
	cmn	r1, #-2147483647
.Lfunc_0015FA28_150:
	strb	r3, [r2], #1
.Lfunc_0015FA28_154:
	bls	.Lfunc_0015FA28_168
.Lfunc_0015FA28_158:
	subs	r1, r1, #1
.Lfunc_0015FA28_15c:
	strb	r3, [r2], #1
.Lfunc_0015FA28_160:
	bne	.Lfunc_0015FA28_158
.Lfunc_0015FA28_164:
	b	.Lfunc_0015FA28_198
.Lfunc_0015FA28_168:
	cmp	r1, #0
.Lfunc_0015FA28_16c:
	ble	.Lfunc_0015FA28_198
.Lfunc_0015FA28_170:
	sub	ip, r2, #1
.Lfunc_0015FA28_174:
	tst	r1, #1
.Lfunc_0015FA28_178:
	strbne	r3, [ip, #1]!
.Lfunc_0015FA28_17c:
	asrs	r4, r1, #1
.Lfunc_0015FA28_180:
	beq	.Lfunc_0015FA28_194
.Lfunc_0015FA28_184:
	strb	r3, [ip, #1]
.Lfunc_0015FA28_188:
	subs	r4, r4, #1
.Lfunc_0015FA28_18c:
	strb	r3, [ip, #2]!
.Lfunc_0015FA28_190:
	bne	.Lfunc_0015FA28_184
.Lfunc_0015FA28_194:
	add	r2, r2, r1
.Lfunc_0015FA28_198:
	cmp	r5, #0
.Lfunc_0015FA28_19c:
	bne	.Lfunc_0015FA28_70
.Lfunc_0015FA28_1a0:
	cmp	r6, #32
.Lfunc_0015FA28_1a4:
	pop	{r4, r5, r6, r7}
.Lfunc_0015FA28_1a8:
	mvngt	r0, #2
.Lfunc_0015FA28_1ac:
	movle	r0, #0
.Lfunc_0015FA28_1b0:
	bx	lr
.size func_0015FA28, .-func_0015FA28

.section .text.func_001F8E2C,"ax",%progbits
.balign 4
.global func_001F8E2C
.type func_001F8E2C, %function
func_001F8E2C:
.Lfunc_001F8E2C_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_001F8E2C_4:
	mov	r6, #0
.Lfunc_001F8E2C_8:
	mov	r5, #1
.Lfunc_001F8E2C_c:
	ldr	r1, [r0, #192]
.Lfunc_001F8E2C_10:
	str	r6, [r1]
.Lfunc_001F8E2C_14:
	ldrb	r1, [r0, #12]
.Lfunc_001F8E2C_18:
	cmp	r1, #1
.Lfunc_001F8E2C_1c:
	movls	r1, #0
.Lfunc_001F8E2C_20:
	bls	.Lfunc_001F8E2C_40
.Lfunc_001F8E2C_24:
	bic	r1, r5, r1
.Lfunc_001F8E2C_28:
	cmp	r1, #1
.Lfunc_001F8E2C_2c:
	bne	.Lfunc_001F8E2C_40
.Lfunc_001F8E2C_30:
	ldr	r3, [r0, #184]
.Lfunc_001F8E2C_34:
	ldr	r2, [r0, #192]
.Lfunc_001F8E2C_38:
	ldr	r3, [r3]
.Lfunc_001F8E2C_3c:
	str	r3, [r2, #4]
.Lfunc_001F8E2C_40:
	ldrb	r2, [r0, #12]
.Lfunc_001F8E2C_44:
	add	r1, r1, #1
.Lfunc_001F8E2C_48:
	mvn	ip, #3
.Lfunc_001F8E2C_4c:
	cmp	r2, r1
.Lfunc_001F8E2C_50:
	mov	r4, #4
.Lfunc_001F8E2C_54:
	ble	.Lfunc_001F8E2C_9c
.Lfunc_001F8E2C_58:
	ldr	r7, [r0, #184]
.Lfunc_001F8E2C_5c:
	ldr	r3, [r0, #192]
.Lfunc_001F8E2C_60:
	add	r2, ip, r1, lsl #2
.Lfunc_001F8E2C_64:
	add	r8, r4, r1, lsl #2
.Lfunc_001F8E2C_68:
	ldr	r7, [r7, r2]
.Lfunc_001F8E2C_6c:
	ldr	r2, [r3, r2]
.Lfunc_001F8E2C_70:
	add	r2, r2, r7
.Lfunc_001F8E2C_74:
	str	r2, [r3, r1, lsl #2]
.Lfunc_001F8E2C_78:
	ldr	r7, [r0, #184]
.Lfunc_001F8E2C_7c:
	ldr	r3, [r0, #192]
.Lfunc_001F8E2C_80:
	ldr	r7, [r7, r1, lsl #2]
.Lfunc_001F8E2C_84:
	add	r1, r1, #2
.Lfunc_001F8E2C_88:
	add	r2, r2, r7
.Lfunc_001F8E2C_8c:
	str	r2, [r3, r8]
.Lfunc_001F8E2C_90:
	ldrb	r2, [r0, #12]
.Lfunc_001F8E2C_94:
	cmp	r2, r1
.Lfunc_001F8E2C_98:
	bgt	.Lfunc_001F8E2C_58
.Lfunc_001F8E2C_9c:
	ldr	r1, [r0, #196]
.Lfunc_001F8E2C_a0:
	mov	r3, #1
.Lfunc_001F8E2C_a4:
	mov	r2, #0
.Lfunc_001F8E2C_a8:
	str	r6, [r1]
.Lfunc_001F8E2C_ac:
	ldrb	r7, [r0, #12]
.Lfunc_001F8E2C_b0:
	mov	r1, r3
.Lfunc_001F8E2C_b4:
	add	r7, r7, #1
.Lfunc_001F8E2C_b8:
	cmp	r7, #1
.Lfunc_001F8E2C_bc:
	bls	.Lfunc_001F8E2C_fc
.Lfunc_001F8E2C_c0:
	add	r7, r0, r1, lsl #2
.Lfunc_001F8E2C_c4:
	ldr	r7, [r7, #12]
.Lfunc_001F8E2C_c8:
	ldrb	r7, [r7, #6]
.Lfunc_001F8E2C_cc:
	cmp	r7, #0
.Lfunc_001F8E2C_d0:
	ldr	r7, [r0, #196]
.Lfunc_001F8E2C_d4:
	beq	.Lfunc_001F8E2C_130
.Lfunc_001F8E2C_d8:
	mov	r8, r3
.Lfunc_001F8E2C_dc:
	add	r9, r3, #1
.Lfunc_001F8E2C_e0:
	and	r3, r9, #255
.Lfunc_001F8E2C_e4:
	str	r8, [r7, r1, lsl #2]
.Lfunc_001F8E2C_e8:
	ldrb	r7, [r0, #12]
.Lfunc_001F8E2C_ec:
	add	r1, r1, #1
.Lfunc_001F8E2C_f0:
	add	r7, r7, #1
.Lfunc_001F8E2C_f4:
	cmp	r7, r1
.Lfunc_001F8E2C_f8:
	bhi	.Lfunc_001F8E2C_c0
.Lfunc_001F8E2C_fc:
	ldrb	r3, [r0, #12]
.Lfunc_001F8E2C_100:
	ldr	r1, [r0, #188]
.Lfunc_001F8E2C_104:
	ldr	r2, [r0, #200]
.Lfunc_001F8E2C_108:
	sub	r3, r3, r1
.Lfunc_001F8E2C_10c:
	add	r1, r1, #1
.Lfunc_001F8E2C_110:
	str	r6, [r2]
.Lfunc_001F8E2C_114:
	mul	r2, r3, r1
.Lfunc_001F8E2C_118:
	cmp	r2, #1
.Lfunc_001F8E2C_11c:
	bls	.Lfunc_001F8E2C_1a4
.Lfunc_001F8E2C_120:
	bic	r1, r5, r2
.Lfunc_001F8E2C_124:
	cmp	r1, #1
.Lfunc_001F8E2C_128:
	bne	.Lfunc_001F8E2C_158
.Lfunc_001F8E2C_12c:
	b	.Lfunc_001F8E2C_148
.Lfunc_001F8E2C_130:
	add	r8, r2, #1
.Lfunc_001F8E2C_134:
	str	r2, [r7, r1, lsl #2]
.Lfunc_001F8E2C_138:
	ldr	r2, [r0, #188]
.Lfunc_001F8E2C_13c:
	add	r2, r2, r8
.Lfunc_001F8E2C_140:
	and	r2, r2, #255
.Lfunc_001F8E2C_144:
	b	.Lfunc_001F8E2C_e8
.Lfunc_001F8E2C_148:
	ldr	r5, [r0, #176]
.Lfunc_001F8E2C_14c:
	ldr	r3, [r0, #200]
.Lfunc_001F8E2C_150:
	ldr	r5, [r5]
.Lfunc_001F8E2C_154:
	str	r5, [r3, #4]
.Lfunc_001F8E2C_158:
	add	r1, r1, #1
.Lfunc_001F8E2C_15c:
	cmp	r1, r2
.Lfunc_001F8E2C_160:
	bcs	.Lfunc_001F8E2C_1a4
.Lfunc_001F8E2C_164:
	ldr	r7, [r0, #176]
.Lfunc_001F8E2C_168:
	ldr	r5, [r0, #200]
.Lfunc_001F8E2C_16c:
	add	r3, ip, r1, lsl #2
.Lfunc_001F8E2C_170:
	add	r6, r4, r1, lsl #2
.Lfunc_001F8E2C_174:
	ldr	r7, [r7, r3]
.Lfunc_001F8E2C_178:
	ldr	r3, [r5, r3]
.Lfunc_001F8E2C_17c:
	add	r3, r3, r7
.Lfunc_001F8E2C_180:
	str	r3, [r5, r1, lsl #2]
.Lfunc_001F8E2C_184:
	ldr	r7, [r0, #176]
.Lfunc_001F8E2C_188:
	ldr	r5, [r0, #200]
.Lfunc_001F8E2C_18c:
	ldr	r7, [r7, r1, lsl #2]
.Lfunc_001F8E2C_190:
	add	r1, r1, #2
.Lfunc_001F8E2C_194:
	cmp	r1, r2
.Lfunc_001F8E2C_198:
	add	r3, r3, r7
.Lfunc_001F8E2C_19c:
	str	r3, [r5, r6]
.Lfunc_001F8E2C_1a0:
	bcc	.Lfunc_001F8E2C_164
.Lfunc_001F8E2C_1a4:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_001F8E2C_1a8:
	bx	lr
.size func_001F8E2C, .-func_001F8E2C

.section .text.func_0049F360,"ax",%progbits
.balign 4
.global func_0049F360
.type func_0049F360, %function
func_0049F360:
.Lfunc_0049F360_0:
	push	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_0049F360_4:
	mov	r4, r0
.Lfunc_0049F360_8:
	mvn	r5, #0
.Lfunc_0049F360_c:
	mov	r0, #0
.Lfunc_0049F360_10:
	mov	r6, #1
.Lfunc_0049F360_14:
	add	r2, r4, r0, lsl #2
.Lfunc_0049F360_18:
	ldr	ip, [r2, #4]
.Lfunc_0049F360_1c:
	cmp	ip, #0
.Lfunc_0049F360_20:
	beq	.Lfunc_0049F360_194
.Lfunc_0049F360_24:
	ldm	r1, {r3, r7}
.Lfunc_0049F360_28:
	ldr	r2, [r1, #8]
.Lfunc_0049F360_2c:
	sxtb	r8, r3
.Lfunc_0049F360_30:
	cmp	r8, #0
.Lfunc_0049F360_34:
	biceq	r3, r3, #255
.Lfunc_0049F360_38:
	orreq	r3, r3, r6
.Lfunc_0049F360_3c:
	lsl	r8, r3, #8
.Lfunc_0049F360_40:
	asrs	r8, r8, #24
.Lfunc_0049F360_44:
	bne	.Lfunc_0049F360_58
.Lfunc_0049F360_48:
	lsl	r8, r6, #16
.Lfunc_0049F360_4c:
	bic	r3, r3, #16711680
.Lfunc_0049F360_50:
	and	r8, r8, #16711680
.Lfunc_0049F360_54:
	orr	r3, r3, r8
.Lfunc_0049F360_58:
	ldrsb	r9, [ip, #20]!
.Lfunc_0049F360_5c:
	sxtb	r8, r3
.Lfunc_0049F360_60:
	cmp	r9, r8
.Lfunc_0049F360_64:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_68:
	ldrsb	r8, [ip, #1]
.Lfunc_0049F360_6c:
	lsl	r9, r3, #16
.Lfunc_0049F360_70:
	asr	r9, r9, #24
.Lfunc_0049F360_74:
	cmp	r8, r9
.Lfunc_0049F360_78:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_7c:
	ldrsb	r9, [ip, #2]
.Lfunc_0049F360_80:
	lsl	sl, r3, #8
.Lfunc_0049F360_84:
	asr	sl, sl, #24
.Lfunc_0049F360_88:
	cmp	r9, sl
.Lfunc_0049F360_8c:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_90:
	ldrb	r9, [ip, #3]
.Lfunc_0049F360_94:
	lsr	r3, r3, #24
.Lfunc_0049F360_98:
	cmp	r9, r3
.Lfunc_0049F360_9c:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_a0:
	ldrsh	r3, [ip, #4]
.Lfunc_0049F360_a4:
	sxth	r9, r7
.Lfunc_0049F360_a8:
	cmp	r3, r9
.Lfunc_0049F360_ac:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_b0:
	ldrsh	r9, [ip, #6]
.Lfunc_0049F360_b4:
	asr	r7, r7, #16
.Lfunc_0049F360_b8:
	cmp	r9, r7
.Lfunc_0049F360_bc:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_c0:
	cmn	r3, #1
.Lfunc_0049F360_c4:
	bne	.Lfunc_0049F360_18c
.Lfunc_0049F360_c8:
	ldr	r3, [ip, #8]
.Lfunc_0049F360_cc:
	cmp	r3, #0
.Lfunc_0049F360_d0:
	beq	.Lfunc_0049F360_194
.Lfunc_0049F360_d4:
	cmp	r2, #0
.Lfunc_0049F360_d8:
	beq	.Lfunc_0049F360_194
.Lfunc_0049F360_dc:
	cmp	r8, #0
.Lfunc_0049F360_e0:
	beq	.Lfunc_0049F360_f0
.Lfunc_0049F360_e4:
	cmp	r8, #1
.Lfunc_0049F360_e8:
	beq	.Lfunc_0049F360_140
.Lfunc_0049F360_ec:
	b	.Lfunc_0049F360_194
.Lfunc_0049F360_f0:
	ldrsh	ip, [r3]
.Lfunc_0049F360_f4:
	ldrsh	r7, [r2]
.Lfunc_0049F360_f8:
	cmp	ip, r7
.Lfunc_0049F360_fc:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_100:
	ldrsh	ip, [r3, #2]
.Lfunc_0049F360_104:
	ldrsh	r7, [r2, #2]
.Lfunc_0049F360_108:
	cmp	ip, r7
.Lfunc_0049F360_10c:
	moveq	ip, #0
.Lfunc_0049F360_110:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_114:
	add	r7, r3, ip, lsl #1
.Lfunc_0049F360_118:
	add	r8, r2, ip, lsl #1
.Lfunc_0049F360_11c:
	ldrsh	r7, [r7, #4]
.Lfunc_0049F360_120:
	ldrsh	r8, [r8, #4]
.Lfunc_0049F360_124:
	cmp	r7, r8
.Lfunc_0049F360_128:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_12c:
	add	ip, ip, #1
.Lfunc_0049F360_130:
	sxth	ip, ip
.Lfunc_0049F360_134:
	cmp	ip, #14
.Lfunc_0049F360_138:
	blt	.Lfunc_0049F360_114
.Lfunc_0049F360_13c:
	b	.Lfunc_0049F360_18c
.Lfunc_0049F360_140:
	ldrsh	ip, [r3]
.Lfunc_0049F360_144:
	ldrsh	r7, [r2]
.Lfunc_0049F360_148:
	cmp	ip, r7
.Lfunc_0049F360_14c:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_150:
	ldrsh	ip, [r3, #2]
.Lfunc_0049F360_154:
	ldrsh	r7, [r2, #2]
.Lfunc_0049F360_158:
	cmp	ip, r7
.Lfunc_0049F360_15c:
	moveq	ip, #0
.Lfunc_0049F360_160:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_164:
	add	r7, r3, ip, lsl #1
.Lfunc_0049F360_168:
	add	r8, r2, ip, lsl #1
.Lfunc_0049F360_16c:
	ldrsh	r7, [r7, #4]
.Lfunc_0049F360_170:
	ldrsh	r8, [r8, #4]
.Lfunc_0049F360_174:
	cmp	r7, r8
.Lfunc_0049F360_178:
	bne	.Lfunc_0049F360_194
.Lfunc_0049F360_17c:
	add	ip, ip, #1
.Lfunc_0049F360_180:
	sxth	ip, ip
.Lfunc_0049F360_184:
	cmp	ip, #13
.Lfunc_0049F360_188:
	blt	.Lfunc_0049F360_164
.Lfunc_0049F360_18c:
	mov	r5, r0
.Lfunc_0049F360_190:
	b	.Lfunc_0049F360_1a0
.Lfunc_0049F360_194:
	add	r0, r0, #1
.Lfunc_0049F360_198:
	cmp	r0, #20
.Lfunc_0049F360_19c:
	blt	.Lfunc_0049F360_14
.Lfunc_0049F360_1a0:
	mov	r0, r5
.Lfunc_0049F360_1a4:
	pop	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_0049F360_1a8:
	bx	lr
.size func_0049F360, .-func_0049F360

.section .text.func_002F774C,"ax",%progbits
.balign 4
.global func_002F774C
.type func_002F774C, %function
func_002F774C:
.Lfunc_002F774C_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_002F774C_4:
	and	r6, r2, #255
.Lfunc_002F774C_8:
	lsl	r7, r2, #16
.Lfunc_002F774C_c:
	bic	r5, r5, #255
.Lfunc_002F774C_10:
	ldr	ip, [sp, #20]
.Lfunc_002F774C_14:
	asr	r2, r7, #24
.Lfunc_002F774C_18:
	orr	r5, r5, r6
.Lfunc_002F774C_1c:
	lsl	r2, r2, #8
.Lfunc_002F774C_20:
	and	r2, r2, #65280
.Lfunc_002F774C_24:
	bic	r5, r5, #65280
.Lfunc_002F774C_28:
	orr	r5, r5, r2
.Lfunc_002F774C_2c:
	lsl	r6, ip, #2
.Lfunc_002F774C_30:
	ldr	r4, [sp, #24]
.Lfunc_002F774C_34:
	ldr	r2, [r0, #4]
.Lfunc_002F774C_38:
	mov	ip, #32
.Lfunc_002F774C_3c:
	str	ip, [r0, #4]
.Lfunc_002F774C_40:
	ldr	r7, [r0, #8]
.Lfunc_002F774C_44:
	cmp	r7, #32
.Lfunc_002F774C_48:
	movcc	r7, ip
.Lfunc_002F774C_4c:
	str	r7, [r0, #8]
.Lfunc_002F774C_50:
	ldr	r7, [r0]
.Lfunc_002F774C_54:
	str	r2, [r0, #4]
.Lfunc_002F774C_58:
	add	r7, r7, #31
.Lfunc_002F774C_5c:
	bic	r7, r7, #31
.Lfunc_002F774C_60:
	add	r6, r6, r7
.Lfunc_002F774C_64:
	str	r6, [r0]
.Lfunc_002F774C_68:
	ldr	ip, [r0, #8]
.Lfunc_002F774C_6c:
	cmp	ip, r2
.Lfunc_002F774C_70:
	movcs	r2, ip
.Lfunc_002F774C_74:
	str	r2, [r0, #8]
.Lfunc_002F774C_78:
	ldr	r6, [r0, #4]
.Lfunc_002F774C_7c:
	ldr	r7, [r0]
.Lfunc_002F774C_80:
	cmp	r3, #0
.Lfunc_002F774C_84:
	lsl	ip, r3, #2
.Lfunc_002F774C_88:
	mov	r2, r0
.Lfunc_002F774C_8c:
	beq	.Lfunc_002F774C_18c
.Lfunc_002F774C_90:
	add	r8, r7, r6
.Lfunc_002F774C_94:
	sub	r7, r6, #1
.Lfunc_002F774C_98:
	sub	r6, r8, #1
.Lfunc_002F774C_9c:
	bic	r6, r6, r7
.Lfunc_002F774C_a0:
	add	r6, r6, #20
.Lfunc_002F774C_a4:
	str	r6, [r2]
.Lfunc_002F774C_a8:
	ldr	r8, [r2, #4]
.Lfunc_002F774C_ac:
	add	r6, r6, r8
.Lfunc_002F774C_b0:
	sub	r6, r6, #1
.Lfunc_002F774C_b4:
	bic	r6, r6, r7
.Lfunc_002F774C_b8:
	add	r6, r6, ip
.Lfunc_002F774C_bc:
	lsl	r2, r5, #16
.Lfunc_002F774C_c0:
	str	r6, [r0]
.Lfunc_002F774C_c4:
	asrs	r2, r2, #24
.Lfunc_002F774C_c8:
	cmpne	r1, #0
.Lfunc_002F774C_cc:
	ldrne	r2, [r1, #40]
.Lfunc_002F774C_d0:
	cmpne	r2, #0
.Lfunc_002F774C_d4:
	beq	.Lfunc_002F774C_140
.Lfunc_002F774C_d8:
	ldr	r5, [r0, #4]
.Lfunc_002F774C_dc:
	ldr	r6, [r0]
.Lfunc_002F774C_e0:
	mul	r4, r2, r4
.Lfunc_002F774C_e4:
	add	r6, r6, r5
.Lfunc_002F774C_e8:
	sub	r5, r5, #1
.Lfunc_002F774C_ec:
	sub	r6, r6, #1
.Lfunc_002F774C_f0:
	bic	r5, r6, r5
.Lfunc_002F774C_f4:
	add	r5, r5, #44
.Lfunc_002F774C_f8:
	lsl	r6, r2, #2
.Lfunc_002F774C_fc:
	str	r5, [r0]
.Lfunc_002F774C_100:
	ldr	r2, [r0, #4]
.Lfunc_002F774C_104:
	mov	r1, r0
.Lfunc_002F774C_108:
	add	r5, r5, r2
.Lfunc_002F774C_10c:
	sub	r2, r2, #1
.Lfunc_002F774C_110:
	sub	r5, r5, #1
.Lfunc_002F774C_114:
	bic	r2, r5, r2
.Lfunc_002F774C_118:
	add	r2, r2, r6
.Lfunc_002F774C_11c:
	lsl	r5, r4, #2
.Lfunc_002F774C_120:
	str	r2, [r1]
.Lfunc_002F774C_124:
	ldr	r4, [r1, #4]
.Lfunc_002F774C_128:
	add	r2, r2, r4
.Lfunc_002F774C_12c:
	sub	r4, r4, #1
.Lfunc_002F774C_130:
	sub	r2, r2, #1
.Lfunc_002F774C_134:
	bic	r2, r2, r4
.Lfunc_002F774C_138:
	add	r2, r2, r5
.Lfunc_002F774C_13c:
	str	r2, [r0]
.Lfunc_002F774C_140:
	ldr	r1, [r0, #4]
.Lfunc_002F774C_144:
	ldr	r2, [r0]
.Lfunc_002F774C_148:
	cmp	r3, #0
.Lfunc_002F774C_14c:
	add	r2, r2, r1
.Lfunc_002F774C_150:
	sub	r1, r1, #1
.Lfunc_002F774C_154:
	sub	r2, r2, #1
.Lfunc_002F774C_158:
	bic	r1, r2, r1
.Lfunc_002F774C_15c:
	add	r1, r1, #20
.Lfunc_002F774C_160:
	beq	.Lfunc_002F774C_180
.Lfunc_002F774C_164:
	str	r1, [r0]
.Lfunc_002F774C_168:
	ldr	r2, [r0, #4]
.Lfunc_002F774C_16c:
	add	r1, r1, r2
.Lfunc_002F774C_170:
	sub	r2, r2, #1
.Lfunc_002F774C_174:
	sub	r1, r1, #1
.Lfunc_002F774C_178:
	bic	r1, r1, r2
.Lfunc_002F774C_17c:
	add	r1, r1, ip
.Lfunc_002F774C_180:
	str	r1, [r0]
.Lfunc_002F774C_184:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_002F774C_188:
	bx	lr
.Lfunc_002F774C_18c:
	add	r7, r7, r6
.Lfunc_002F774C_190:
	sub	r6, r6, #1
.Lfunc_002F774C_194:
	sub	r7, r7, #1
.Lfunc_002F774C_198:
	bic	r6, r7, r6
.Lfunc_002F774C_19c:
	add	r6, r6, #20
.Lfunc_002F774C_1a0:
	b	.Lfunc_002F774C_bc
.size func_002F774C, .-func_002F774C
