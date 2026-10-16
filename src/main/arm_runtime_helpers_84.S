.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00374084,"ax",%progbits
.balign 4
.global func_00374084
.type func_00374084, %function
func_00374084:
	ldr	r2, [r0, #60]
	cmp	r2, #0
	mov	r2, #0
	moveq	r2, #1
	streq	r1, [r0, #60]
	mov	r0, r2
	bx	lr
.size func_00374084, .-func_00374084

.section .text.func_00381F50,"ax",%progbits
.balign 4
.global func_00381F50
.type func_00381F50, %function
func_00381F50:
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	strb	r1, [r0, #8]
	str	r1, [r0, #12]
	str	r1, [r0, #16]
	bx	lr
.size func_00381F50, .-func_00381F50

.section .text.func_003BCE64,"ax",%progbits
.balign 4
.global func_003BCE64
.type func_003BCE64, %function
func_003BCE64:
	ldr	r2, [r0]
	str	r1, [r0]
	str	r0, [r1, #4]
	cmp	r2, #0
	str	r2, [r1]
	strne	r1, [r2, #4]
	bx	lr
.size func_003BCE64, .-func_003BCE64

.section .text.func_00410860,"ax",%progbits
.balign 4
.global func_00410860
.type func_00410860, %function
func_00410860:
	ldr	r2, [r0, #4]
	mov	r3, #28
	and	r1, r3, r1, lsl #2
	bic	r2, r2, #28
	orr	r1, r1, r2
	str	r1, [r0, #4]
	bx	lr
.size func_00410860, .-func_00410860

.section .text.func_00416A5C,"ax",%progbits
.balign 4
.global func_00416A5C
.type func_00416A5C, %function
func_00416A5C:
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	str	r1, [r0, #8]
	str	r1, [r0, #12]
	strh	r1, [r0, #16]
	bx	lr
.size func_00416A5C, .-func_00416A5C

.section .text.func_004174F8,"ax",%progbits
.balign 4
.global func_004174F8
.type func_004174F8, %function
func_004174F8:
	ldr	r2, [r0, #44]
	mov	r3, #31457280
	and	r1, r3, r1, lsl #21
	bic	r2, r2, #31457280
	orr	r1, r1, r2
	str	r1, [r0, #44]
	bx	lr
.size func_004174F8, .-func_004174F8

.section .text.func_00462AA0,"ax",%progbits
.balign 4
.global func_00462AA0
.type func_00462AA0, %function
func_00462AA0:
	ldr	r2, [r0, #16]
	cmp	r2, r1
	movcc	r1, #0
	subcs	r1, r2, r1
	str	r1, [r0, #16]
	mov	r0, r1
	bx	lr
.size func_00462AA0, .-func_00462AA0

.section .text.func_00462ABC,"ax",%progbits
.balign 4
.global func_00462ABC
.type func_00462ABC, %function
func_00462ABC:
	ldr	r2, [r0, #52]
	mov	r3, #12288
	and	r1, r3, r1, lsl #12
	bic	r2, r2, #12288
	orr	r1, r1, r2
	str	r1, [r0, #52]
	bx	lr
.size func_00462ABC, .-func_00462ABC

.section .text.func_00462BB4,"ax",%progbits
.balign 4
.global func_00462BB4
.type func_00462BB4, %function
func_00462BB4:
	ldr	r2, [r0, #4]
	mov	r3, #4
	and	r1, r3, r1, lsl #2
	bic	r2, r2, #4
	orr	r1, r1, r2
	str	r1, [r0, #4]
	bx	lr
.size func_00462BB4, .-func_00462BB4

.section .text.func_00466E2C,"ax",%progbits
.balign 4
.global func_00466E2C
.type func_00466E2C, %function
func_00466E2C:
	ldrb	r2, [r0, #230]
	mov	r3, #6
	and	r1, r3, r1, lsl #1
	bic	r2, r2, #6
	orr	r1, r1, r2
	strb	r1, [r0, #230]
	bx	lr
.size func_00466E2C, .-func_00466E2C

.section .text.func_004A9EE8,"ax",%progbits
.balign 4
.global func_004A9EE8
.type func_004A9EE8, %function
func_004A9EE8:
	ldr	r2, [r0, #48]
	cmp	r2, r1
	ldrls	r0, [r0, #52]
	cmpls	r1, r0
	movcs	r0, #0
	movcc	r0, #1
	bx	lr
.size func_004A9EE8, .-func_004A9EE8

.section .text.func_004AA7C4,"ax",%progbits
.balign 4
.global func_004AA7C4
.type func_004AA7C4, %function
func_004AA7C4:
	ldrh	ip, [r0, #14]
	strh	ip, [r1]
	ldrh	r1, [r0, #16]
	strh	r1, [r2]
	ldrh	r0, [r0, #18]
	strh	r0, [r3]
	bx	lr
.size func_004AA7C4, .-func_004AA7C4

.section .text.func_004ACF2C,"ax",%progbits
.balign 4
.global func_004ACF2C
.type func_004ACF2C, %function
func_004ACF2C:
	ldr	r1, [r0, #48]
	cmp	r1, #0
	ldrne	r0, [r0, #44]
	moveq	r0, #0
	ldrne	r0, [r0, #4]
	ldrne	r0, [r0, #8]
	bx	lr
.size func_004ACF2C, .-func_004ACF2C

.section .text.func_004B2818,"ax",%progbits
.balign 4
.global func_004B2818
.type func_004B2818, %function
func_004B2818:
	ldrb	r1, [r0, #4]
	cmp	r1, #0
	ldrne	r0, [r0]
	mvneq	r0, #0
	addne	r0, r0, #768
	ldrsbne	r0, [r0, #36]
	bx	lr
.size func_004B2818, .-func_004B2818

.section .text.func_004BE66C,"ax",%progbits
.balign 4
.global func_004BE66C
.type func_004BE66C, %function
func_004BE66C:
	ldrh	r0, [r0, #248]
	cmp	r0, #0
	beq	.L004BE66C_18
	mvn	r1, #0
	add	r0, r1, r0, lsr #1
	uxth	r0, r0
.L004BE66C_18:
	bx	lr
.size func_004BE66C, .-func_004BE66C

.section .text.func_004BF510,"ax",%progbits
.balign 4
.global func_004BF510
.type func_004BF510, %function
func_004BF510:
	ldrh	r1, [r0, #8]
	sub	r2, r1, #256
	subs	r2, r2, #1
	ldreq	r1, [r0, #12]
	movne	r0, #0
	addeq	r0, r0, r1
	bx	lr
.size func_004BF510, .-func_004BF510

.section .text.func_004BF544,"ax",%progbits
.balign 4
.global func_004BF544
.type func_004BF544, %function
func_004BF544:
	ldrh	r1, [r0, #16]
	sub	r2, r1, #256
	subs	r2, r2, #1
	ldreq	r1, [r0, #20]
	movne	r0, #0
	addeq	r0, r0, r1
	bx	lr
.size func_004BF544, .-func_004BF544

.section .text.func_0011BF04,"ax",%progbits
.balign 4
.global func_0011BF04
.type func_0011BF04, %function
func_0011BF04:
	ldr	r2, [r0, #28]
	bic	r0, r1, #-16777216
	rsb	r1, r0, r0, lsl #3
	add	r0, r1, r0, lsl #4
	add	r0, r2, r0, lsl #2
	bx	lr
.size func_0011BF04, .-func_0011BF04

.section .text.func_00136B1C,"ax",%progbits
.balign 4
.global func_00136B1C
.type func_00136B1C, %function
func_00136B1C:
	mov	r2, #0
	add	r3, r0, #8
	str	r2, [r0]
	strd	r2, [r0, #4]
	str	r3, [r0, #12]
	bx	lr
.size func_00136B1C, .-func_00136B1C

.section .text.func_00177280,"ax",%progbits
.balign 4
.global func_00177280
.type func_00177280, %function
func_00177280:
	ldrb	r2, [r0, #4]
	cmp	r2, r1
	addhi	r0, r0, r1
	movls	r0, #0
	ldrbhi	r0, [r0, #5]
	bx	lr
.size func_00177280, .-func_00177280

.section .text.func_00179DB8,"ax",%progbits
.balign 4
.global func_00179DB8
.type func_00179DB8, %function
func_00179DB8:
	add	r0, r0, r1, lsl #2
	ldr	r1, [r0, #20]
	str	r1, [r2]
	ldr	r0, [r0, #28]
	str	r0, [r3]
	bx	lr
.size func_00179DB8, .-func_00179DB8

.section .text.func_0017CAAC,"ax",%progbits
.balign 4
.global func_0017CAAC
.type func_0017CAAC, %function
func_0017CAAC:
	cmp	r1, #0
	cmpne	r0, #0
	beq	.L0017CAAC_14
	ldm	r0, {r0, r2}
	stm	r1, {r0, r2}
.L0017CAAC_14:
	bx	lr
.size func_0017CAAC, .-func_0017CAAC

.section .text.func_0017E840,"ax",%progbits
.balign 4
.global func_0017E840
.type func_0017E840, %function
func_0017E840:
	mov	r2, #0
	strh	r1, [r0, #10]
	str	r2, [r0]
	str	r2, [r0, #4]
	strh	r2, [r0, #8]
	bx	lr
.size func_0017E840, .-func_0017E840

.section .text.func_00195C28,"ax",%progbits
.balign 4
.global func_00195C28
.type func_00195C28, %function
func_00195C28:
	vldmia	r1!, {s0-s4}
	mov	r2, r0
	vldmia	r1, {s5-s8}
	vstmia	r2!, {s0-s4}
	vstmia	r2, {s5-s8}
	bx	lr
.size func_00195C28, .-func_00195C28
