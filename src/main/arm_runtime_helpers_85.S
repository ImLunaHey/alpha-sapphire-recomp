.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001960C8,"ax",%progbits
.balign 4
.global func_001960C8
.type func_001960C8, %function
func_001960C8:
	vldmia	r1, {s0-s11}
	mov	r2, r0
	vstmia	r2!, {s0-s2}
	vstmia	r2!, {s4-s6}
	vstmia	r2, {s8-s10}
	bx	lr
.size func_001960C8, .-func_001960C8

.section .text.func_0019B628,"ax",%progbits
.balign 4
.global func_0019B628
.type func_0019B628, %function
func_0019B628:
	vldmia	r1!, {s0-s3}
	vstr	s0, [r0, #12]
	vstr	s1, [r0, #8]
	vstr	s2, [r0, #4]
	vstr	s3, [r0]
	bx	lr
.size func_0019B628, .-func_0019B628

.section .text.func_001C2524,"ax",%progbits
.balign 4
.global func_001C2524
.type func_001C2524, %function
func_001C2524:
	ldrb	r3, [r0, #38]
	str	r1, [r0, #4]
	str	r2, [r0]
	orr	r1, r3, #8
	strb	r1, [r0, #38]
	bx	lr
.size func_001C2524, .-func_001C2524

.section .text.func_001E86B4,"ax",%progbits
.balign 4
.global func_001E86B4
.type func_001E86B4, %function
func_001E86B4:
	ldrb	r0, [r0, #409]
	cmp	r0, #1
	cmpne	r0, #2
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_001E86B4, .-func_001E86B4

.section .text.func_001F46DC,"ax",%progbits
.balign 4
.global func_001F46DC
.type func_001F46DC, %function
func_001F46DC:
	mov	ip, #0
	strh	ip, [r0, #2]
	strb	r1, [r0]
	strb	ip, [r0, #1]
	strd	r2, [r0, #4]
	bx	lr
.size func_001F46DC, .-func_001F46DC

.section .text.func_002C2360,"ax",%progbits
.balign 4
.global func_002C2360
.type func_002C2360, %function
func_002C2360:
	ldr	r0, [r0]
	and	r0, r0, #261120
	cmp	r0, #83968
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_002C2360, .-func_002C2360

.section .text.func_002C6820,"ax",%progbits
.balign 4
.global func_002C6820
.type func_002C6820, %function
func_002C6820:
	ldrh	r2, [r0, #4]
	cmp	r2, r1
	addhi	r0, r0, r1, lsl #3
	addhi	r0, r0, #12
	movls	r0, #0
	bx	lr
.size func_002C6820, .-func_002C6820

.section .text.func_002C9504,"ax",%progbits
.balign 4
.global func_002C9504
.type func_002C9504, %function
func_002C9504:
	movs	r1, r0
	mov	r0, #1
	ldrbne	r1, [r1]
	cmpne	r1, #0
	moveq	r0, #0
	bx	lr
.size func_002C9504, .-func_002C9504

.section .text.func_00320988,"ax",%progbits
.balign 4
.global func_00320988
.type func_00320988, %function
func_00320988:
	mov	r2, #6
	mov	r1, #0
	strb	r2, [r0, #731]
	strb	r1, [r0, #733]
	strb	r1, [r0, #732]
	bx	lr
.size func_00320988, .-func_00320988

.section .text.func_0032AD88,"ax",%progbits
.balign 4
.global func_0032AD88
.type func_0032AD88, %function
func_0032AD88:
	mov	r1, #0
	mov	r2, #47
	str	r1, [r0, #4]
	strb	r2, [r0, #12]
	strb	r1, [r0, #13]
	bx	lr
.size func_0032AD88, .-func_0032AD88

.section .text.func_0032E364,"ax",%progbits
.balign 4
.global func_0032E364
.type func_0032E364, %function
func_0032E364:
	cmp	r1, #0
	addne	r0, r0, #48
	moveq	r0, #0
	stmne	r0, {r1, r2}
	movne	r0, #1
	bx	lr
.size func_0032E364, .-func_0032E364

.section .text.func_00331258,"ax",%progbits
.balign 4
.global func_00331258
.type func_00331258, %function
func_00331258:
	add	r0, r0, #4
	mov	r0, r0
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	bx	lr
.size func_00331258, .-func_00331258

.section .text.func_003361D4,"ax",%progbits
.balign 4
.global func_003361D4
.type func_003361D4, %function
func_003361D4:
	vstr	s0, [r0, #352]
	mov	r3, #0
	str	r1, [r0, #360]
	str	r3, [r0, #356]
	strb	r2, [r0, #307]
	bx	lr
.size func_003361D4, .-func_003361D4

.section .text.func_003700F0,"ax",%progbits
.balign 4
.global func_003700F0
.type func_003700F0, %function
func_003700F0:
	add	r0, r0, r1, lsl #2
	mov	r3, #1
	ldr	r1, [r0, #72]
	orr	r1, r1, r3, lsl r2
	str	r1, [r0, #72]
	bx	lr
.size func_003700F0, .-func_003700F0

.section .text.func_00370284,"ax",%progbits
.balign 4
.global func_00370284
.type func_00370284, %function
func_00370284:
	add	r0, r0, r1, lsl #2
	mov	r3, #1
	ldr	r1, [r0, #72]
	bic	r1, r1, r3, lsl r2
	str	r1, [r0, #72]
	bx	lr
.size func_00370284, .-func_00370284

.section .text.func_00371BB8,"ax",%progbits
.balign 4
.global func_00371BB8
.type func_00371BB8, %function
func_00371BB8:
	ldr	r0, [r0, #4]
	mov	r3, #0
	add	ip, r0, #160
	stm	ip, {r1, r2}
	strb	r3, [r0, #6]
	bx	lr
.size func_00371BB8, .-func_00371BB8

.section .text.func_00371CAC,"ax",%progbits
.balign 4
.global func_00371CAC
.type func_00371CAC, %function
func_00371CAC:
	ldr	r0, [r0, #4]
	ldrb	r2, [r0, #156]
	bic	r2, r2, #4
	orr	r1, r2, r1, lsl #2
	strb	r1, [r0, #156]
	bx	lr
.size func_00371CAC, .-func_00371CAC

.section .text.func_003964E8,"ax",%progbits
.balign 4
.global func_003964E8
.type func_003964E8, %function
func_003964E8:
	ldrd	r2, [r1]
	ldr	r1, [r1, #8]
	str	r1, [r0, #312]
	add	r0, r0, #304
	stm	r0, {r2, r3}
	bx	lr
.size func_003964E8, .-func_003964E8

.section .text.func_00398724,"ax",%progbits
.balign 4
.global func_00398724
.type func_00398724, %function
func_00398724:
	add	r1, r1, r1, lsl #4
	ldr	r0, [r0, #48]
	add	r1, r1, r1, lsl #2
	add	r0, r0, r1, lsl #2
	strh	r2, [r0, #32]
	bx	lr
.size func_00398724, .-func_00398724

.section .text.func_003A1ECC,"ax",%progbits
.balign 4
.global func_003A1ECC
.type func_003A1ECC, %function
func_003A1ECC:
	cmp	r1, #0
	ldreq	r0, [r0, #56]
	ldrne	r0, [r0, #60]
	add	r0, r0, r2, lsl #2
	ldr	r0, [r0, #76]
	bx	lr
.size func_003A1ECC, .-func_003A1ECC

.section .text.func_003A1EE4,"ax",%progbits
.balign 4
.global func_003A1EE4
.type func_003A1EE4, %function
func_003A1EE4:
	cmp	r1, #0
	ldreq	r0, [r0, #56]
	ldrne	r0, [r0, #60]
	add	r0, r0, r2, lsl #2
	ldr	r0, [r0, #84]
	bx	lr
.size func_003A1EE4, .-func_003A1EE4

.section .text.func_003B7E80,"ax",%progbits
.balign 4
.global func_003B7E80
.type func_003B7E80, %function
func_003B7E80:
	ldr	r1, [r0, #-4]
	tst	r1, #1
	subne	r0, r1, #1
	subeq	r0, r0, #16
	ldr	r0, [r0, #8]
	bx	lr
.size func_003B7E80, .-func_003B7E80

.section .text.func_003F8F40,"ax",%progbits
.balign 4
.global func_003F8F40
.type func_003F8F40, %function
func_003F8F40:
	add	r0, r0, #2304
	ldrh	r0, [r0, #246]
	cmp	r0, #3
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_003F8F40, .-func_003F8F40

.section .text.func_0040B0DC,"ax",%progbits
.balign 4
.global func_0040B0DC
.type func_0040B0DC, %function
func_0040B0DC:
	ldr	r2, [r0, #48]
	bic	r2, r2, #267386880
	bic	r2, r2, #1044480
	orr	r1, r2, r1, lsl #12
	str	r1, [r0, #48]
	bx	lr
.size func_0040B0DC, .-func_0040B0DC
