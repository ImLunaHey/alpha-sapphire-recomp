.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001E5234,"ax",%progbits
.balign 4
.global func_001E5234
.type func_001E5234, %function
func_001E5234:
.Lfunc_001E5234_0:
	push	{r4, lr}
.Lfunc_001E5234_4:
	mov	r0, #368
.Lfunc_001E5234_8:
	add	r0, r0, #12
.Lfunc_001E5234_c:
	pop	{r4, pc}
.size func_001E5234, .-func_001E5234

.section .text.func_00410B00,"ax",%progbits
.balign 4
.global func_00410B00
.type func_00410B00, %function
func_00410B00:
.Lfunc_00410B00_0:
	ldm	r1, {r1, r2}
.Lfunc_00410B00_4:
	str	r1, [r0, #64]
.Lfunc_00410B00_8:
	str	r2, [r0, #68]
.Lfunc_00410B00_c:
	bx	lr
.size func_00410B00, .-func_00410B00

.section .text.func_00410B10,"ax",%progbits
.balign 4
.global func_00410B10
.type func_00410B10, %function
func_00410B10:
.Lfunc_00410B10_0:
	mov	r2, #1
.Lfunc_00410B10_4:
	str	r1, [r0, #72]
.Lfunc_00410B10_8:
	strb	r2, [r0, #120]
.Lfunc_00410B10_c:
	bx	lr
.size func_00410B10, .-func_00410B10

.section .text.func_00410B20,"ax",%progbits
.balign 4
.global func_00410B20
.type func_00410B20, %function
func_00410B20:
.Lfunc_00410B20_0:
	cmp	r1, #0
.Lfunc_00410B20_4:
	cmpne	r1, #1
.Lfunc_00410B20_8:
	strbeq	r1, [r0, #10]
.Lfunc_00410B20_c:
	bx	lr
.size func_00410B20, .-func_00410B20

.section .text.func_00410C48,"ax",%progbits
.balign 4
.global func_00410C48
.type func_00410C48, %function
func_00410C48:
.Lfunc_00410C48_0:
	cmp	r1, #0
.Lfunc_00410C48_4:
	cmpne	r1, #1
.Lfunc_00410C48_8:
	strbeq	r1, [r0, #14]
.Lfunc_00410C48_c:
	bx	lr
.size func_00410C48, .-func_00410C48

.section .text.func_00417664,"ax",%progbits
.balign 4
.global func_00417664
.type func_00417664, %function
func_00417664:
.Lfunc_00417664_0:
	cmp	r0, #900
.Lfunc_00417664_4:
	movlt	r0, #1
.Lfunc_00417664_8:
	movge	r0, #0
.Lfunc_00417664_c:
	bx	lr
.size func_00417664, .-func_00417664

.section .text.func_0041B354,"ax",%progbits
.balign 4
.global func_0041B354
.type func_0041B354, %function
func_0041B354:
.Lfunc_0041B354_0:
	mov	r1, #0
.Lfunc_0041B354_4:
	strb	r1, [r0, #50]
.Lfunc_0041B354_8:
	strb	r1, [r0, #49]
.Lfunc_0041B354_c:
	bx	lr
.size func_0041B354, .-func_0041B354

.section .text.func_0043436C,"ax",%progbits
.balign 4
.global func_0043436C
.type func_0043436C, %function
func_0043436C:
.Lfunc_0043436C_0:
	add	r1, r0, #4096
.Lfunc_0043436C_4:
	mov	r0, #0
.Lfunc_0043436C_8:
	str	r0, [r1, #896]
.Lfunc_0043436C_c:
	bx	lr
.size func_0043436C, .-func_0043436C

.section .text.func_0043ED68,"ax",%progbits
.balign 4
.global func_0043ED68
.type func_0043ED68, %function
func_0043ED68:
.Lfunc_0043ED68_0:
	ldr	r1, [r0, #200]
.Lfunc_0043ED68_4:
	orr	r1, r1, #32
.Lfunc_0043ED68_8:
	str	r1, [r0, #200]
.Lfunc_0043ED68_c:
	bx	lr
.size func_0043ED68, .-func_0043ED68

.section .text.func_0043ED78,"ax",%progbits
.balign 4
.global func_0043ED78
.type func_0043ED78, %function
func_0043ED78:
.Lfunc_0043ED78_0:
	ldr	r1, [r0, #200]
.Lfunc_0043ED78_4:
	bic	r1, r1, #32
.Lfunc_0043ED78_8:
	str	r1, [r0, #200]
.Lfunc_0043ED78_c:
	bx	lr
.size func_0043ED78, .-func_0043ED78

.section .text.func_0045A8B4,"ax",%progbits
.balign 4
.global func_0045A8B4
.type func_0045A8B4, %function
func_0045A8B4:
.Lfunc_0045A8B4_0:
	mov	r1, #0
.Lfunc_0045A8B4_4:
	strb	r1, [r0, #1593]
.Lfunc_0045A8B4_8:
	strb	r1, [r0, #1592]
.Lfunc_0045A8B4_c:
	bx	lr
.size func_0045A8B4, .-func_0045A8B4

.section .text.func_0045AFEC,"ax",%progbits
.balign 4
.global func_0045AFEC
.type func_0045AFEC, %function
func_0045AFEC:
.Lfunc_0045AFEC_0:
	add	r1, r0, #768
.Lfunc_0045AFEC_4:
	mvn	r0, #0
.Lfunc_0045AFEC_8:
	strh	r0, [r1, #40]
.Lfunc_0045AFEC_c:
	bx	lr
.size func_0045AFEC, .-func_0045AFEC

.section .text.func_00461228,"ax",%progbits
.balign 4
.global func_00461228
.type func_00461228, %function
func_00461228:
.Lfunc_00461228_0:
	add	r1, r0, #20480
.Lfunc_00461228_4:
	mov	r0, #0
.Lfunc_00461228_8:
	strb	r0, [r1, #516]
.Lfunc_00461228_c:
	bx	lr
.size func_00461228, .-func_00461228

.section .text.func_004650D0,"ax",%progbits
.balign 4
.global func_004650D0
.type func_004650D0, %function
func_004650D0:
.Lfunc_004650D0_0:
	mov	r1, #0
.Lfunc_004650D0_4:
	str	r1, [r0, #4]
.Lfunc_004650D0_8:
	str	r1, [r0, #8]
.Lfunc_004650D0_c:
	bx	lr
.size func_004650D0, .-func_004650D0

.section .text.func_00465BA8,"ax",%progbits
.balign 4
.global func_00465BA8
.type func_00465BA8, %function
func_00465BA8:
.Lfunc_00465BA8_0:
	ldr	r0, [r0, #1396]
.Lfunc_00465BA8_4:
	ands	r0, r0, r1
.Lfunc_00465BA8_8:
	movne	r0, #1
.Lfunc_00465BA8_c:
	bx	lr
.size func_00465BA8, .-func_00465BA8

.section .text.func_00466AD8,"ax",%progbits
.balign 4
.global func_00466AD8
.type func_00466AD8, %function
func_00466AD8:
.Lfunc_00466AD8_0:
	ldr	r1, [r0, #712]
.Lfunc_00466AD8_4:
	orr	r1, r1, #3
.Lfunc_00466AD8_8:
	str	r1, [r0, #712]
.Lfunc_00466AD8_c:
	bx	lr
.size func_00466AD8, .-func_00466AD8

.section .text.func_00466AF8,"ax",%progbits
.balign 4
.global func_00466AF8
.type func_00466AF8, %function
func_00466AF8:
.Lfunc_00466AF8_0:
	ldr	r1, [r0, #712]
.Lfunc_00466AF8_4:
	bic	r1, r1, #12
.Lfunc_00466AF8_8:
	str	r1, [r0, #712]
.Lfunc_00466AF8_c:
	bx	lr
.size func_00466AF8, .-func_00466AF8

.section .text.func_00472110,"ax",%progbits
.balign 4
.global func_00472110
.type func_00472110, %function
func_00472110:
.Lfunc_00472110_0:
	ldr	r0, [r0, #476]
.Lfunc_00472110_4:
	cmp	r0, #0
.Lfunc_00472110_8:
	movne	r0, #1
.Lfunc_00472110_c:
	bx	lr
.size func_00472110, .-func_00472110

.section .text.func_00489060,"ax",%progbits
.balign 4
.global func_00489060
.type func_00489060, %function
func_00489060:
.Lfunc_00489060_0:
	add	r0, r0, r1, lsl #2
.Lfunc_00489060_4:
	add	r0, r0, #14976
.Lfunc_00489060_8:
	str	r2, [r0]
.Lfunc_00489060_c:
	bx	lr
.size func_00489060, .-func_00489060

.section .text.func_004A95F0,"ax",%progbits
.balign 4
.global func_004A95F0
.type func_004A95F0, %function
func_004A95F0:
.Lfunc_004A95F0_0:
	mrc	15, 0, r1, c13, c0, 3
.Lfunc_004A95F0_4:
	ldr	r0, [r0]
.Lfunc_004A95F0_8:
	ldr	r0, [r1, r0, lsl #2]
.Lfunc_004A95F0_c:
	bx	lr
.size func_004A95F0, .-func_004A95F0

.section .text.func_004B1904,"ax",%progbits
.balign 4
.global func_004B1904
.type func_004B1904, %function
func_004B1904:
.Lfunc_004B1904_0:
	ldr	r2, [r0]
.Lfunc_004B1904_4:
	ldr	r1, [r0, #4]
.Lfunc_004B1904_8:
	mov	r0, r2
.Lfunc_004B1904_c:
	bx	lr
.size func_004B1904, .-func_004B1904

.section .text.func_004B2834,"ax",%progbits
.balign 4
.global func_004B2834
.type func_004B2834, %function
func_004B2834:
.Lfunc_004B2834_0:
	vldr	s1, [r0, #92]
.Lfunc_004B2834_4:
	vldr	s2, [r0, #76]
.Lfunc_004B2834_8:
	vdiv.f32	s0, s1, s2
.Lfunc_004B2834_c:
	bx	lr
.size func_004B2834, .-func_004B2834

.section .text.func_004C4E2C,"ax",%progbits
.balign 4
.global func_004C4E2C
.type func_004C4E2C, %function
func_004C4E2C:
.Lfunc_004C4E2C_0:
	ldrb	r0, [r0, #169]
.Lfunc_004C4E2C_4:
	cmp	r0, #0
.Lfunc_004C4E2C_8:
	movne	r0, #1
.Lfunc_004C4E2C_c:
	bx	lr
.size func_004C4E2C, .-func_004C4E2C

.section .text.func_004D8268,"ax",%progbits
.balign 4
.global func_004D8268
.type func_004D8268, %function
func_004D8268:
.Lfunc_004D8268_0:
	vldmia	r0, {s0-s3}
.Lfunc_004D8268_4:
	mov	r0, r1
.Lfunc_004D8268_8:
	vstmia	r1, {s0-s3}
.Lfunc_004D8268_c:
	bx	lr
.size func_004D8268, .-func_004D8268
