.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002DB7A0,"ax",%progbits
.balign 4
.global func_002DB7A0
.type func_002DB7A0, %function
func_002DB7A0:
	vpush	{d8-d15}
	add	r2, r1, #48
	sub	sp, sp, #40
	vldr	s10, [r1, #20]
	vldr	s30, [r1, #40]
	vldr	s7, [r1, #16]
	vldr	s13, [r1, #44]
	vmul.f32	s22, s10, s30
	vldr	s8, [r1, #24]
	vldr	s23, [r1, #60]
	vldr	s11, [r1, #28]
	vldr	s14, [r1, #32]
	vldr	s12, [r1, #36]
	vldr	s9, [r1, #12]
	vmul.f32	s29, s7, s30
	vldmia	r2, {s1-s3}
	vmul.f32	s19, s8, s13
	vmul.f32	s24, s7, s13
	vldmia	r1, {s4-s6}
	vmul.f32	s15, s10, s13
	vstr	s22, [sp]
	vmul.f32	s22, s22, s23
	vmul.f32	s17, s10, s14
	vmul.f32	s20, s11, s12
	vmul.f32	s26, s29, s2
	vmul.f32	s21, s8, s14
	vstr	s24, [sp, #4]
	vmul.f32	s31, s7, s12
	vmul.f32	s24, s24, s3
	vmul.f32	s0, s11, s30
	vmul.f32	s16, s11, s14
	vmla.f32	s22, s19, s2
	vmul.f32	s18, s8, s12
	vmul.f32	s28, s15, s3
	vmla.f32	s26, s17, s3
	vstr	s29, [sp, #28]
	add	r2, sp, #20
	vmul.f32	s25, s31, s23
	vmla.f32	s24, s21, s23
	vstr	s0, [sp, #16]
	vstr	s17, [sp, #32]
	vmla.f32	s22, s20, s3
	vstmia	r2, {s15-s16}
	add	r2, sp, #8
	vmla.f32	s28, s18, s23
	vstmia	r2, {s17-s18}
	vmla.f32	s26, s18, s1
	vmla.f32	s25, s15, s1
	vmla.f32	s24, s0, s1
	vmul.f32	s15, s29, s23
	vldr	s17, [sp, #4]
	vmul.f32	s18, s22, s4
	vmul.f32	s31, s31, s3
	vmul.f32	s29, s17, s2
	vmla.f32	s28, s0, s2
	vldr	s17, [sp, #8]
	vldr	s0, [sp]
	vmla.f32	s25, s16, s2
	vldr	s27, .Lfunc_002DB7A0_35c
	vmla.f32	s15, s19, s1
	vmla.f32	s18, s5, s24
	vmla.f32	s31, s0, s1
	vmla.f32	s29, s17, s23
	vmla.f32	s15, s16, s3
	vmla.f32	s18, s6, s25
	vmla.f32	s31, s21, s2
	vmla.f32	s29, s20, s1
	vmla.f32	s18, s9, s26
	vmls.f32	s18, s4, s28
	vmls.f32	s18, s5, s15
	vmls.f32	s18, s6, s29
	vmls.f32	s18, s9, s31
	vcmp.f32	s18, s27
	vmrs	APSR_nzcv, fpscr
	moveq	r0, #0
	beq .Lfunc_002DB7A0_350
	vmul.f32	s25, s11, s2
	vmul.f32	s24, s30, s23
	vmul.f32	s22, s12, s23
	vmul.f32	s27, s14, s23
	vmul.f32	s17, s8, s23
	vmul.f32	s19, s7, s23
	vmul.f32	s31, s30, s2
	vmul.f32	s16, s30, s1
	vmul.f32	s21, s7, s2
	vldr	s15, .Lfunc_002DB7A0_360
	vmls.f32	s25, s10, s23
	vmov.f32	s23, s24
	vmls.f32	s22, s13, s2
	vmls.f32	s27, s13, s1
	vmul.f32	s20, s8, s1
	vmls.f32	s19, s11, s1
	vmls.f32	s31, s12, s3
	vmls.f32	s23, s13, s3
	vmls.f32	s16, s14, s3
	vstr	s25, [sp, #8]
	vdiv.f32	s0, s15, s18
	vmul.f32	s15, s12, s1
	vmls.f32	s21, s10, s1
	vmls.f32	s17, s11, s3
	vmul.f32	s18, s10, s3
	vmul.f32	s1, s6, s19
	vstr	s23, [sp]
	vmul.f32	s24, s10, s23
	vmul.f32	s25, s4, s23
	vstr	s22, [sp, #4]
	vmov.f32	s23, s22
	vmul.f32	s28, s7, s31
	vmul.f32	s29, s5, s16
	vmls.f32	s15, s14, s2
	vmls.f32	s18, s8, s2
	vmov.f32	s22, s24
	vldr	s24, [sp, #4]
	vmls.f32	s25, s6, s27
	vmul.f32	s26, s7, s24
	vmul.f32	s24, s8, s27
	vmls.f32	s28, s10, s16
	vmls.f32	s22, s8, s23
	vmul.f32	s23, s6, s23
	vmls.f32	s29, s6, s15
	vmls.f32	s25, s9, s16
	vmls.f32	s26, s10, s27
	vmla.f32	s24, s11, s16
	vmov.f32	s16, s3
	vmul.f32	s27, s5, s27
	vmla.f32	s23, s9, s31
	vmls.f32	s22, s11, s31
	vmls.f32	s29, s4, s31
	vstr	s25, [sp, #36]
	vmov.f32	s25, s19
	vmls.f32	s20, s7, s16
	vmov.f32	s19, s1
	vmul.f32	s16, s5, s17
	vmul.f32	s1, s9, s21
	vldr	s3, [sp, #8]
	vmla.f32	s27, s9, s15
	vldr	s2, [sp, #4]
	vmla.f32	s19, s9, s20
	vmla.f32	s16, s6, s3
	vmls.f32	s1, s4, s3
	vnmul.f32	s3, s6, s21
	vmls.f32	s27, s4, s2
	vldr	s2, [sp, #12]
	vmls.f32	s2, s10, s30
	vmls.f32	s19, s4, s17
	vmov.f32	s17, s25
	vmla.f32	s16, s9, s18
	vldr	s10, [sp]
	vmls.f32	s3, s4, s18
	vmls.f32	s1, s5, s17
	vmls.f32	s3, s5, s20
	vmov.f32	s17, s23
	vmls.f32	s24, s7, s10
	vmls.f32	s26, s11, s15
	vmla.f32	s28, s8, s15
	vldr	s15, [sp, #24]
	vldr	s25, [sp, #36]
	vmls.f32	s17, s5, s10
	vldr	s10, [sp, #16]
	vmls.f32	s15, s7, s13
	vmul.f32	s25, s25, s0
	vmls.f32	s10, s8, s13
	vldr	s13, [sp, #32]
	vmul.f32	s20, s22, s0
	vmul.f32	s21, s24, s0
	vmls.f32	s13, s7, s12
	vldr	s7, [sp, #20]
	vmul.f32	s17, s17, s0
	vmul.f32	s22, s26, s0
	vmls.f32	s7, s11, s12
	vldr	s11, [sp, #28]
	vmul.f32	s3, s3, s0
	vmul.f32	s18, s27, s0
	vmls.f32	s11, s8, s14
	vmul.f32	s14, s16, s0
	vmul.f32	s16, s19, s0
	vmul.f32	s19, s1, s0
	vmul.f32	s1, s5, s10
	vmul.f32	s8, s6, s15
	vmul.f32	s12, s9, s13
	vnmul.f32	s13, s6, s13
	vmul.f32	s23, s28, s0
	vmul.f32	s24, s29, s0
	vstr	s14, [r0, #8]
	vstr	s25, [r0, #20]
	vstr	s16, [r0, #24]
	vstr	s20, [r0]
	vmla.f32	s1, s6, s7
	vmla.f32	s8, s9, s11
	vmls.f32	s12, s4, s7
	vmls.f32	s13, s4, s2
	vstr	s17, [r0, #4]
	vstr	s21, [r0, #16]
	vstr	s22, [r0, #32]
	vstr	s3, [r0, #56]
	add	r1, r0, #36
	vmla.f32	s1, s9, s2
	vmls.f32	s8, s4, s10
	vmls.f32	s12, s5, s15
	vmls.f32	s13, s5, s11
	vmul.f32	s1, s1, s0
	vmul.f32	s2, s8, s0
	vmul.f32	s3, s12, s0
	vmul.f32	s0, s13, s0
	vstr	s1, [r0, #12]
	vstr	s2, [r0, #28]
	vstr	s3, [r0, #44]
	vstr	s0, [r0, #60]
	add	r0, r0, #48
	vstmia	r1, {s18-s19}
	vstmia	r0, {s23-s24}
	mov	r0, #1
.Lfunc_002DB7A0_350:
	add	sp, sp, #40
	vpop	{d8-d15}
	bx	lr
.size func_002DB7A0, .-func_002DB7A0
.Lfunc_002DB7A0_35c:
	.float 0.0
.Lfunc_002DB7A0_360:
	.float 1.0

.section .text.func_00486734,"ax",%progbits
.balign 4
.global func_00486734
.type func_00486734, %function
func_00486734:
	push	{r4, r5, r6}
	vpush	{d8}
	vldr	s5, [r1]
	vldr	s6, [r2]
	ldr	r6, [sp, #32]
	vldr	s4, [r1, #8]
	vsub.f32	s5, s5, s6
	vldr	s1, [r2, #8]
	vldr	s3, [r1, #4]
	vldr	s2, [r2, #4]
	vsub.f32	s1, s4, s1
	vldmia	r6!, {s4}
	vsub.f32	s2, s3, s2
	vldmia	r6, {s6-s7}
	vldr	s3, .Lfunc_00486734_3d8
	ldr	r4, [sp, #24]
	vmul.f32	s4, s5, s4
	ldr	ip, [sp, #28]
	ldr	r5, [sp, #20]
	vmla.f32	s4, s2, s6
	vmla.f32	s4, s1, s7
	vcmpe.f32	s4, s3
	vmrs	APSR_nzcv, fpscr
	bcc .Lfunc_00486734_3c8
	vldr	s4, [r4]
	vldr	s10, [ip]
	vldr	s9, [r4, #4]
	vmul.f32	s4, s4, s5
	vmul.f32	s5, s10, s5
	vldr	s8, [ip, #4]
	vldr	s7, [r4, #8]
	vldr	s6, [ip, #8]
	vmla.f32	s4, s9, s2
	vmla.f32	s5, s8, s2
	vmla.f32	s4, s7, s1
	vmla.f32	s5, s6, s1
	vcmpe.f32	s3, s4
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_00486734_b8
	vcmpe.f32	s5, s3
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_b8
	ldm	r2, {r3, r4, ip}
	stm	r0, {r3, r4}
	str	ip, [r0, #8]
	b .Lfunc_00486734_388
.Lfunc_00486734_b8:
	vldr	s1, [r1]
	vldr	s9, [r3]
	vldr	s2, [r1, #8]
	vldr	s6, [r3, #8]
	vsub.f32	s1, s1, s9
	vldr	s7, [r1, #4]
	vsub.f32	s2, s2, s6
	vmov.f32	s6, s10
	vldr	s8, [r3, #4]
	vldr	s9, [r4]
	vldr	s12, [r4, #4]
	vsub.f32	s7, s7, s8
	vldr	s11, [ip, #4]
	vldr	s10, [r4, #8]
	vmul.f32	s6, s6, s1
	vmul.f32	s1, s9, s1
	vldr	s8, [ip, #8]
	vmla.f32	s6, s11, s7
	vmla.f32	s1, s12, s7
	vmla.f32	s6, s8, s2
	vmla.f32	s1, s10, s2
	vcmpe.f32	s1, s3
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_00486734_138
	vcmpe.f32	s6, s1
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_138
	ldm	r3, {r4, ip}
	ldr	r3, [r3, #8]
	stm	r0, {r4, ip}
	str	r3, [r0, #8]
	b .Lfunc_00486734_388
.Lfunc_00486734_138:
	vmul.f32	s8, s4, s6
	vmls.f32	s8, s1, s5
	vcmpe.f32	s8, s3
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_1a0
	vcmpe.f32	s4, s3
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_00486734_1a0
	vcmpe.f32	s1, s3
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_1a0
	vsub.f32	s2, s4, s1
	vdiv.f32	s1, s4, s2
	vldr	s4, [r2]
	vmul.f32	s3, s9, s1
	vmul.f32	s2, s12, s1
	vmul.f32	s1, s10, s1
	vadd.f32	s3, s4, s3
	vstr	s3, [r0]
	vldr	s3, [r2, #4]
	vadd.f32	s2, s3, s2
	vstr	s2, [r0, #4]
	vldr	s2, [r2, #8]
	vadd.f32	s1, s2, s1
	vstr	s1, [r0, #8]
	b .Lfunc_00486734_388
.Lfunc_00486734_1a0:
	vldr	s7, [r1]
	vldr	s12, [r5]
	vldr	s2, [r1, #8]
	vldr	s9, [r5, #8]
	vsub.f32	s7, s7, s12
	vldr	s10, [r1, #4]
	vldr	s11, [r5, #4]
	vldr	s12, [ip]
	vsub.f32	s9, s2, s9
	vsub.f32	s10, s10, s11
	vldr	s11, [r4]
	vldr	s16, [ip, #4]
	vldr	s15, [r4, #4]
	vldr	s14, [ip, #8]
	vmul.f32	s2, s12, s7
	vmul.f32	s7, s11, s7
	vldr	s13, [r4, #8]
	vmla.f32	s2, s16, s10
	vmla.f32	s7, s15, s10
	vmla.f32	s2, s14, s9
	vmla.f32	s7, s13, s9
	vcmpe.f32	s2, s3
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_00486734_21c
	vcmpe.f32	s7, s2
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_21c
	ldm	r5, {r3, r4, ip}
	stm	r0, {r3, r4}
	str	ip, [r0, #8]
	b .Lfunc_00486734_388
.Lfunc_00486734_21c:
	vmul.f32	s9, s7, s5
	vmls.f32	s9, s4, s2
	vcmpe.f32	s9, s3
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_284
	vcmpe.f32	s5, s3
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_00486734_284
	vcmpe.f32	s2, s3
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_284
	vsub.f32	s2, s5, s2
	vldr	s4, [r2]
	vdiv.f32	s1, s5, s2
	vmul.f32	s2, s12, s1
	vmul.f32	s3, s16, s1
	vmul.f32	s1, s14, s1
	vadd.f32	s2, s4, s2
	vstr	s2, [r0]
	vldr	s2, [r2, #4]
	vadd.f32	s2, s2, s3
	vstr	s2, [r0, #4]
	vldr	s2, [r2, #8]
	vadd.f32	s1, s2, s1
	vstr	s1, [r0, #8]
	b .Lfunc_00486734_388
.Lfunc_00486734_284:
	vmul.f32	s4, s1, s2
	vmls.f32	s4, s7, s6
	vcmpe.f32	s4, s3
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_00486734_310
	vsub.f32	s5, s6, s1
	vcmpe.f32	s5, s3
	vmrs	APSR_nzcv, fpscr
	vsubge.f32	s1, s7, s2
	vcmpege.f32	s1, s3
	vmrsge	APSR_nzcv, fpscr
	blt .Lfunc_00486734_310
	vadd.f32	s2, s5, s1
	vldr	s3, [r5]
	vldr	s7, [r3]
	add	r2, r3, #4
	vldr	s4, [r5, #4]
	vsub.f32	s3, s3, s7
	vdiv.f32	s1, s5, s2
	vldmia	r2, {s5-s6}
	vldr	s2, [r5, #8]
	vsub.f32	s4, s4, s5
	vsub.f32	s2, s2, s6
	vmul.f32	s3, s3, s1
	vmul.f32	s4, s4, s1
	vmul.f32	s1, s2, s1
	vadd.f32	s2, s7, s3
	vstr	s2, [r0]
	vldr	s2, [r3, #4]
	vadd.f32	s2, s2, s4
	vstr	s2, [r0, #4]
	vldr	s2, [r3, #8]
	vadd.f32	s1, s2, s1
	vstr	s1, [r0, #8]
	b .Lfunc_00486734_388
.Lfunc_00486734_310:
	vadd.f32	s2, s8, s9
	vldr	s1, .Lfunc_00486734_3dc
	vldr	s7, [r2]
	vadd.f32	s3, s2, s4
	vdiv.f32	s2, s1, s3
	vmul.f32	s1, s9, s2
	vmul.f32	s3, s11, s1
	vmul.f32	s6, s15, s1
	vmul.f32	s4, s13, s1
	vmul.f32	s1, s8, s2
	vadd.f32	s3, s7, s3
	vmul.f32	s2, s12, s1
	vmul.f32	s5, s16, s1
	vmul.f32	s1, s14, s1
	vstr	s3, [r0]
	vldr	s3, [r2, #4]
	vadd.f32	s3, s3, s6
	vstr	s3, [r0, #4]
	vldr	s3, [r2, #8]
	vadd.f32	s3, s3, s4
	vstr	s3, [r0, #8]
	vldr	s3, [r0]
	vadd.f32	s2, s3, s2
	vstr	s2, [r0]
	vldr	s2, [r0, #4]
	vadd.f32	s2, s2, s5
	vstr	s2, [r0, #4]
	vldr	s2, [r0, #8]
	vadd.f32	s1, s2, s1
	vstr	s1, [r0, #8]
.Lfunc_00486734_388:
	vldr	s2, [r0]
	vldr	s6, [r1]
	vldr	s3, [r0, #4]
	vldr	s4, [r1, #4]
	vsub.f32	s2, s2, s6
	vldr	s1, [r0, #8]
	vsub.f32	s3, s3, s4
	vldr	s5, [r1, #8]
	vsub.f32	s1, s1, s5
	vmul.f32	s2, s2, s2
	vmla.f32	s2, s3, s3
	vmla.f32	s2, s1, s1
	vcmpe.f32	s2, s0
	vmrs	APSR_nzcv, fpscr
	movls	r0, #1
	bls .Lfunc_00486734_3cc
.Lfunc_00486734_3c8:
	mov	r0, #0
.Lfunc_00486734_3cc:
	vpop	{d8}
	pop	{r4, r5, r6}
	bx	lr
.size func_00486734, .-func_00486734
.Lfunc_00486734_3d8:
	.float 0.0
.Lfunc_00486734_3dc:
	.float 1.0

.section .text.func_0054EA0C,"ax",%progbits
.balign 4
.global func_0054EA0C
.type func_0054EA0C, %function
func_0054EA0C:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
	cmp	r1, #0
	beq .Lfunc_0054EA0C_1a0
	vldr	s1, [r0, #24]
	vldr	s2, [r0, #16]
	mov	fp, #8
	vcmpe.f32	s1, s0
	mov	r6, #4
	vstr	s2, [r0, #20]
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_0054EA0C_e8
	cmp	r2, #0
	vstr	s0, [r0, #16]
	ldrheq	r2, [r0, #32]
	ldr	r4, [r0, #12]
	cmp	r2, #0
	ble .Lfunc_0054EA0C_a4
	mov	r3, #0
	mov	r0, r4
	add	ip, r4, #4
.Lfunc_0054EA0C_50:
	ldr	r7, [r0]
	cmp	r7, #7
	movne	r5, #1
	moveq	r5, #0
	cmp	r7, #6
	movne	r7, #1
	moveq	r7, #0
	cmp	r5, #0
	beq .Lfunc_0054EA0C_cc
	cmp	r7, #0
	beq .Lfunc_0054EA0C_b0
	add	r5, r4, r3, lsl #4
	ldr	r5, [r5, #8]
	ldr	r5, [r5]
	str	r5, [r1]
.Lfunc_0054EA0C_8c:
	subs	r2, r2, #1
	add	r1, r1, #4
	add	r0, r0, #16
	add	ip, ip, #16
	add	r3, r3, #1
	bne .Lfunc_0054EA0C_50
.Lfunc_0054EA0C_a4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
	mov	r0, #1
	bx	lr
.Lfunc_0054EA0C_b0:
	ldrh	r5, [ip]
	add	r7, r4, r3, lsl #4
	ldr	r7, [r7, #8]
	add	r5, r6, r5, lsl #2
	ldr	r5, [r7, r5]
	str	r5, [r1]
	b .Lfunc_0054EA0C_8c
.Lfunc_0054EA0C_cc:
	ldrh	r5, [ip]
	add	r7, r4, r3, lsl #4
	ldr	r7, [r7, #8]
	add	r5, fp, r5, lsl #3
	ldr	r5, [r7, r5]
	str	r5, [r1]
	b .Lfunc_0054EA0C_8c
.Lfunc_0054EA0C_e8:
	vcmpe.f32	s2, s0
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_0054EA0C_134
	ldrh	r3, [r0, #32]
	ldr	r4, [r0, #12]
	mov	ip, #0
	cmp	r3, #0
	beq .Lfunc_0054EA0C_130
	tst	r3, #1
	sub	r3, r4, #10
	strhne	ip, [r3, #16]!
	ldrh	r4, [r0, #32]
	lsrs	r4, r4, #1
	beq .Lfunc_0054EA0C_130
.Lfunc_0054EA0C_120:
	strh	ip, [r3, #16]
	subs	r4, r4, #1
	strh	ip, [r3, #32]!
	bne .Lfunc_0054EA0C_120
.Lfunc_0054EA0C_130:
	strh	ip, [r0, #2]
.Lfunc_0054EA0C_134:
	cmp	r2, #0
	vstr	s0, [r0, #16]
	ldrheq	r2, [r0, #32]
	ldr	r3, [r0, #12]
	mov	r5, #0
	cmp	r2, #0
	ble .Lfunc_0054EA0C_1a0
	mvn	r7, #3
	vldr	s5, .Lfunc_0054EA0C_3a8
	vldr	s8, .Lfunc_0054EA0C_3ac
	vldr	s6, .Lfunc_0054EA0C_3b0
	vmul.f32	s2, s0, s5
	vldr	s7, .Lfunc_0054EA0C_3b4
	mvn	r8, #7
.Lfunc_0054EA0C_16c:
	ldr	r0, [r3]
	cmp	r0, #6
	beq .Lfunc_0054EA0C_1ac
	cmp	r0, #7
	beq .Lfunc_0054EA0C_290
	ldr	r0, [r3, #8]
	ldr	r0, [r0]
	str	r0, [r1]
.Lfunc_0054EA0C_18c:
	add	r5, r5, #1
	cmp	r5, r2
	add	r3, r3, #16
	add	r1, r1, #4
	blt .Lfunc_0054EA0C_16c
.Lfunc_0054EA0C_1a0:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
	mov	r0, #0
	bx	lr
.Lfunc_0054EA0C_1ac:
	ldrh	r9, [r3, #4]
	cmp	r9, #0
	beq .Lfunc_0054EA0C_238
	ldr	r0, [r3, #12]
	ldrh	ip, [r3, #6]
	add	r0, r0, ip
	cmp	ip, #0
	ldrbne	r4, [r0, #-1]
	vmovne	s3, r4
	vcvtne.f32.u32	s3, s3
	vmoveq.f32	s3, s6
.Lfunc_0054EA0C_1d8:
	ldrb	r4, [r0], #1
	vmov	s4, r4
	vcvt.f32.u32	s4, s4
	vcmp.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	bne .Lfunc_0054EA0C_204
	ldr	r0, [r3, #8]
	add	ip, r6, ip, lsl #2
	ldr	r0, [r0, ip]
	str	r0, [r1]
	b .Lfunc_0054EA0C_18c
.Lfunc_0054EA0C_204:
	vcmpe.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	ble .Lfunc_0054EA0C_21c
	add	r0, ip, #1
	strh	ip, [r3, #6]
	b .Lfunc_0054EA0C_244
.Lfunc_0054EA0C_21c:
	vmov.f32	s3, s4
	add	ip, ip, #1
	cmp	ip, r9
	blt .Lfunc_0054EA0C_1d8
	vmov.f32	s4, s1
	add	r0, ip, #1
	b .Lfunc_0054EA0C_244
.Lfunc_0054EA0C_238:
	vmov.f32	s4, s1
	vmov.f32	s3, s6
	mov	r0, #1
.Lfunc_0054EA0C_244:
	ldr	ip, [r3, #8]
	add	r4, r7, r0, lsl #2
	vmul.f32	s4, s4, s5
	vmul.f32	s3, s3, s5
	add	r4, r4, ip
	add	r0, ip, r0, lsl #2
	vsub.f32	s9, s4, s3
	vsub.f32	s4, s2, s3
	vdiv.f32	s3, s4, s9
	vldr	s4, [r4]
	vadd.f32	s10, s3, s3
	vmul.f32	s9, s3, s3
	vldr	s3, [r0]
	vsub.f32	s3, s4, s3
	vsub.f32	s10, s10, s8
	vmul.f32	s9, s9, s10
	vmla.f32	s4, s9, s3
	vstr	s4, [r1]
	b .Lfunc_0054EA0C_18c
.Lfunc_0054EA0C_290:
	ldrh	r9, [r3, #4]
	cmp	r9, #0
	beq .Lfunc_0054EA0C_31c
	ldr	r0, [r3, #12]
	ldrh	ip, [r3, #6]
	add	r0, r0, ip
	cmp	ip, #0
	ldrbne	r4, [r0, #-1]
	vmovne	s3, r4
	vcvtne.f32.u32	s3, s3
	vmoveq.f32	s3, s6
.Lfunc_0054EA0C_2bc:
	ldrb	r4, [r0], #1
	vmov	s4, r4
	vcvt.f32.u32	s4, s4
	vcmp.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	bne .Lfunc_0054EA0C_2e8
	ldr	r0, [r3, #8]
	add	ip, fp, ip, lsl #3
	ldr	r0, [r0, ip]
	str	r0, [r1]
	b .Lfunc_0054EA0C_18c
.Lfunc_0054EA0C_2e8:
	vcmpe.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	ble .Lfunc_0054EA0C_300
	add	r0, ip, #1
	strh	ip, [r3, #6]
	b .Lfunc_0054EA0C_328
.Lfunc_0054EA0C_300:
	vmov.f32	s3, s4
	add	ip, ip, #1
	cmp	ip, r9
	blt .Lfunc_0054EA0C_2bc
	vmov.f32	s4, s1
	add	r0, ip, #1
	b .Lfunc_0054EA0C_328
.Lfunc_0054EA0C_31c:
	vmov.f32	s4, s1
	vmov.f32	s3, s6
	mov	r0, #1
.Lfunc_0054EA0C_328:
	ldr	ip, [r3, #8]
	lsl	r0, r0, #1
	vmul.f32	s4, s4, s5
	vmul.f32	s3, s3, s5
	add	r9, r6, r0, lsl #2
	add	r9, r9, ip
	add	sl, r7, r0, lsl #2
	vldr	s12, [r9]
	add	sl, sl, ip
	add	r4, r8, r0, lsl #2
	vldr	s11, [sl]
	add	r4, r4, ip
	add	r0, ip, r0, lsl #2
	vsub.f32	s4, s4, s3
	vsub.f32	s10, s2, s3
	vldr	s9, [r4]
	vldr	s13, [r0]
	vsub.f32	s13, s9, s13
	vdiv.f32	s3, s10, s4
	vmul.f32	s12, s12, s3
	vsub.f32	s4, s3, s7
	vmul.f32	s3, s3, s3
	vmla.f32	s12, s4, s11
	vadd.f32	s11, s4, s4
	vmul.f32	s4, s12, s4
	vsub.f32	s11, s11, s7
	vmul.f32	s11, s3, s11
	vmul.f32	s3, s4, s10
	vmla.f32	s3, s11, s13
	vadd.f32	s3, s3, s9
	vstr	s3, [r1]
	b .Lfunc_0054EA0C_18c
.size func_0054EA0C, .-func_0054EA0C
.Lfunc_0054EA0C_3a8:
	.float 0.0333333333333333333333333333333333
.Lfunc_0054EA0C_3ac:
	.float 3.0
.Lfunc_0054EA0C_3b0:
	.float 0.0
.Lfunc_0054EA0C_3b4:
	.float 1.0

.section .text.func_0054EDC4,"ax",%progbits
.balign 4
.global func_0054EDC4
.type func_0054EDC4, %function
func_0054EDC4:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
	cmp	r1, #0
	beq .Lfunc_0054EDC4_1a0
	vldr	s1, [r0, #24]
	vldr	s2, [r0, #16]
	mov	fp, #8
	vcmpe.f32	s1, s0
	mov	r6, #4
	vstr	s2, [r0, #20]
	vmrs	APSR_nzcv, fpscr
	bhi .Lfunc_0054EDC4_e8
	cmp	r2, #0
	vstr	s0, [r0, #16]
	ldrheq	r2, [r0, #32]
	ldr	r4, [r0, #12]
	cmp	r2, #0
	ble .Lfunc_0054EDC4_a4
	mov	r3, #0
	mov	r0, r4
	add	ip, r4, #4
.Lfunc_0054EDC4_50:
	ldr	r7, [r0]
	cmp	r7, #7
	movne	r5, #1
	moveq	r5, #0
	cmp	r7, #6
	movne	r7, #1
	moveq	r7, #0
	cmp	r5, #0
	beq .Lfunc_0054EDC4_cc
	cmp	r7, #0
	beq .Lfunc_0054EDC4_b0
	add	r5, r4, r3, lsl #4
	ldr	r5, [r5, #8]
	ldr	r5, [r5]
	str	r5, [r1]
.Lfunc_0054EDC4_8c:
	subs	r2, r2, #1
	add	r1, r1, #4
	add	r0, r0, #16
	add	ip, ip, #16
	add	r3, r3, #1
	bne .Lfunc_0054EDC4_50
.Lfunc_0054EDC4_a4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
	mov	r0, #1
	bx	lr
.Lfunc_0054EDC4_b0:
	ldrh	r5, [ip]
	add	r7, r4, r3, lsl #4
	ldr	r7, [r7, #8]
	add	r5, r6, r5, lsl #2
	ldr	r5, [r7, r5]
	str	r5, [r1]
	b .Lfunc_0054EDC4_8c
.Lfunc_0054EDC4_cc:
	ldrh	r5, [ip]
	add	r7, r4, r3, lsl #4
	ldr	r7, [r7, #8]
	add	r5, fp, r5, lsl #3
	ldr	r5, [r7, r5]
	str	r5, [r1]
	b .Lfunc_0054EDC4_8c
.Lfunc_0054EDC4_e8:
	vcmpe.f32	s2, s0
	vmrs	APSR_nzcv, fpscr
	blt .Lfunc_0054EDC4_134
	ldrh	r3, [r0, #32]
	ldr	r4, [r0, #12]
	mov	ip, #0
	cmp	r3, #0
	beq .Lfunc_0054EDC4_130
	tst	r3, #1
	sub	r3, r4, #10
	strhne	ip, [r3, #16]!
	ldrh	r4, [r0, #32]
	lsrs	r4, r4, #1
	beq .Lfunc_0054EDC4_130
.Lfunc_0054EDC4_120:
	strh	ip, [r3, #16]
	subs	r4, r4, #1
	strh	ip, [r3, #32]!
	bne .Lfunc_0054EDC4_120
.Lfunc_0054EDC4_130:
	strh	ip, [r0, #2]
.Lfunc_0054EDC4_134:
	cmp	r2, #0
	vstr	s0, [r0, #16]
	ldrheq	r2, [r0, #32]
	ldr	r3, [r0, #12]
	mov	r5, #0
	cmp	r2, #0
	ble .Lfunc_0054EDC4_1a0
	mvn	r7, #3
	vldr	s5, .Lfunc_0054EDC4_3a8
	vldr	s8, .Lfunc_0054EDC4_3ac
	vldr	s6, .Lfunc_0054EDC4_3b0
	vmul.f32	s2, s0, s5
	vldr	s7, .Lfunc_0054EDC4_3b4
	mvn	r8, #7
.Lfunc_0054EDC4_16c:
	ldr	r0, [r3]
	cmp	r0, #6
	beq .Lfunc_0054EDC4_1ac
	cmp	r0, #7
	beq .Lfunc_0054EDC4_290
	ldr	r0, [r3, #8]
	ldr	r0, [r0]
	str	r0, [r1]
.Lfunc_0054EDC4_18c:
	add	r5, r5, #1
	cmp	r5, r2
	add	r3, r3, #16
	add	r1, r1, #4
	blt .Lfunc_0054EDC4_16c
.Lfunc_0054EDC4_1a0:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
	mov	r0, #0
	bx	lr
.Lfunc_0054EDC4_1ac:
	ldrh	r9, [r3, #4]
	cmp	r9, #0
	beq .Lfunc_0054EDC4_238
	ldrh	ip, [r3, #6]
	ldr	r0, [r3, #12]
	cmp	ip, #0
	add	r0, r0, ip, lsl #1
	ldrhne	r4, [r0, #-2]
	vmovne	s3, r4
	vcvtne.f32.u32	s3, s3
	vmoveq.f32	s3, s6
.Lfunc_0054EDC4_1d8:
	ldrh	r4, [r0], #2
	vmov	s4, r4
	vcvt.f32.u32	s4, s4
	vcmp.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	bne .Lfunc_0054EDC4_204
	ldr	r0, [r3, #8]
	add	ip, r6, ip, lsl #2
	ldr	r0, [r0, ip]
	str	r0, [r1]
	b .Lfunc_0054EDC4_18c
.Lfunc_0054EDC4_204:
	vcmpe.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	ble .Lfunc_0054EDC4_21c
	add	r0, ip, #1
	strh	ip, [r3, #6]
	b .Lfunc_0054EDC4_244
.Lfunc_0054EDC4_21c:
	vmov.f32	s3, s4
	add	ip, ip, #1
	cmp	ip, r9
	blt .Lfunc_0054EDC4_1d8
	vmov.f32	s4, s1
	add	r0, ip, #1
	b .Lfunc_0054EDC4_244
.Lfunc_0054EDC4_238:
	vmov.f32	s4, s1
	vmov.f32	s3, s6
	mov	r0, #1
.Lfunc_0054EDC4_244:
	ldr	ip, [r3, #8]
	add	r4, r7, r0, lsl #2
	vmul.f32	s4, s4, s5
	vmul.f32	s3, s3, s5
	add	r4, r4, ip
	add	r0, ip, r0, lsl #2
	vsub.f32	s9, s4, s3
	vsub.f32	s4, s2, s3
	vdiv.f32	s3, s4, s9
	vldr	s4, [r4]
	vadd.f32	s10, s3, s3
	vmul.f32	s9, s3, s3
	vldr	s3, [r0]
	vsub.f32	s3, s4, s3
	vsub.f32	s10, s10, s8
	vmul.f32	s9, s9, s10
	vmla.f32	s4, s9, s3
	vstr	s4, [r1]
	b .Lfunc_0054EDC4_18c
.Lfunc_0054EDC4_290:
	ldrh	r9, [r3, #4]
	cmp	r9, #0
	beq .Lfunc_0054EDC4_31c
	ldrh	ip, [r3, #6]
	ldr	r0, [r3, #12]
	cmp	ip, #0
	add	r0, r0, ip, lsl #1
	ldrhne	r4, [r0, #-2]
	vmovne	s3, r4
	vcvtne.f32.u32	s3, s3
	vmoveq.f32	s3, s6
.Lfunc_0054EDC4_2bc:
	ldrh	r4, [r0], #2
	vmov	s4, r4
	vcvt.f32.u32	s4, s4
	vcmp.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	bne .Lfunc_0054EDC4_2e8
	ldr	r0, [r3, #8]
	add	ip, fp, ip, lsl #3
	ldr	r0, [r0, ip]
	str	r0, [r1]
	b .Lfunc_0054EDC4_18c
.Lfunc_0054EDC4_2e8:
	vcmpe.f32	s4, s0
	vmrs	APSR_nzcv, fpscr
	ble .Lfunc_0054EDC4_300
	add	r0, ip, #1
	strh	ip, [r3, #6]
	b .Lfunc_0054EDC4_328
.Lfunc_0054EDC4_300:
	vmov.f32	s3, s4
	add	ip, ip, #1
	cmp	ip, r9
	blt .Lfunc_0054EDC4_2bc
	vmov.f32	s4, s1
	add	r0, ip, #1
	b .Lfunc_0054EDC4_328
.Lfunc_0054EDC4_31c:
	vmov.f32	s4, s1
	vmov.f32	s3, s6
	mov	r0, #1
.Lfunc_0054EDC4_328:
	ldr	ip, [r3, #8]
	lsl	r0, r0, #1
	vmul.f32	s4, s4, s5
	vmul.f32	s3, s3, s5
	add	r9, r6, r0, lsl #2
	add	r9, r9, ip
	add	sl, r7, r0, lsl #2
	vldr	s12, [r9]
	add	sl, sl, ip
	add	r4, r8, r0, lsl #2
	vldr	s11, [sl]
	add	r4, r4, ip
	add	r0, ip, r0, lsl #2
	vsub.f32	s4, s4, s3
	vsub.f32	s10, s2, s3
	vldr	s9, [r4]
	vldr	s13, [r0]
	vsub.f32	s13, s9, s13
	vdiv.f32	s3, s10, s4
	vmul.f32	s12, s12, s3
	vsub.f32	s4, s3, s7
	vmul.f32	s3, s3, s3
	vmla.f32	s12, s4, s11
	vadd.f32	s11, s4, s4
	vmul.f32	s4, s12, s4
	vsub.f32	s11, s11, s7
	vmul.f32	s11, s3, s11
	vmul.f32	s3, s4, s10
	vmla.f32	s3, s11, s13
	vadd.f32	s3, s3, s9
	vstr	s3, [r1]
	b .Lfunc_0054EDC4_18c
.size func_0054EDC4, .-func_0054EDC4
.Lfunc_0054EDC4_3a8:
	.float 0.0333333333333333333333333333333333
.Lfunc_0054EDC4_3ac:
	.float 3.0
.Lfunc_0054EDC4_3b0:
	.float 0.0
.Lfunc_0054EDC4_3b4:
	.float 1.0
