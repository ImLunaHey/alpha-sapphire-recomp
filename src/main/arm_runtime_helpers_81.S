.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003997E4,"ax",%progbits
.balign 4
.global func_003997E4
.type func_003997E4, %function
func_003997E4:
	rsb	r1, r1, r1, lsl #5
	ldr	r0, [r0, #108]
	add	r1, r1, r1, lsl #1
	add	r2, r2, r2, lsl #3
	add	r0, r0, r1, lsl #2
	add	r0, r0, r2, lsl #2
	add	r0, r0, r3, lsl #3
	ldrb	r0, [r0, #15]
	bx	lr
.size func_003997E4, .-func_003997E4

.section .text.func_00399920,"ax",%progbits
.balign 4
.global func_00399920
.type func_00399920, %function
func_00399920:
	rsb	r1, r1, r1, lsl #5
	ldr	r0, [r0, #108]
	add	r1, r1, r1, lsl #1
	add	r2, r2, r2, lsl #3
	add	r0, r0, r1, lsl #2
	add	r0, r0, r2, lsl #2
	add	r0, r0, r3, lsl #3
	ldrb	r0, [r0, #13]
	bx	lr
.size func_00399920, .-func_00399920

.section .text.func_003C15C4,"ax",%progbits
.balign 4
.global func_003C15C4
.type func_003C15C4, %function
func_003C15C4:
	vstr	s0, [r0, #32]
	ldr	r0, [r0, #224]
	cmp	r0, #0
	beq	.Lfunc_003C15C4_20
.Lfunc_003C15C4_10:
	vstr	s0, [r0, #32]
	ldr	r0, [r0, #192]
	cmp	r0, #0
	bne	.Lfunc_003C15C4_10
.Lfunc_003C15C4_20:
	bx	lr
.size func_003C15C4, .-func_003C15C4

.section .text.func_0040B068,"ax",%progbits
.balign 4
.global func_0040B068
.type func_0040B068, %function
func_0040B068:
	add	r0, r0, #56
	mov	r0, r0
	ldr	r2, [r0, #48]
	mov	r3, #3968
	and	r1, r3, r1, lsl #7
	bic	r2, r2, #3968
	orr	r1, r1, r2
	str	r1, [r0, #48]
	bx	lr
.size func_0040B068, .-func_0040B068

.section .text.func_00410A48,"ax",%progbits
.balign 4
.global func_00410A48
.type func_00410A48, %function
func_00410A48:
	mov	r3, #1
	lsl	r3, r3, r1
	add	r0, r0, #56
	add	r1, r0, r1, lsl #2
	str	r2, [r1, #24]
	ldrh	r1, [r0, #22]
	orr	r1, r1, r3
	strh	r1, [r0, #22]
	bx	lr
.size func_00410A48, .-func_00410A48

.section .text.func_00410C24,"ax",%progbits
.balign 4
.global func_00410C24
.type func_00410C24, %function
func_00410C24:
	push	{r4}
	ldrb	r3, [r0, #15]
	mov	r4, #1
	add	ip, r0, r1, lsl #2
	orr	r1, r3, r4, lsl r1
	strb	r1, [r0, #15]
	str	r2, [ip, #16]
	pop	{r4}
	bx	lr
.size func_00410C24, .-func_00410C24

.section .text.func_004176B0,"ax",%progbits
.balign 4
.global func_004176B0
.type func_004176B0, %function
func_004176B0:
	ldrh	r2, [r0]
	mov	r1, #0
	strh	r1, [r0, #2]
	add	r2, r2, #1
	uxth	r2, r2
	cmp	r2, #900
	strh	r2, [r0]
	strhcs	r1, [r0]
	bx	lr
.size func_004176B0, .-func_004176B0

.section .text.func_0042566C,"ax",%progbits
.balign 4
.global func_0042566C
.type func_0042566C, %function
func_0042566C:
	ldr	r2, [r1]
	str	r2, [r0]
	ldr	r2, [r1, #4]
	str	r2, [r0, #4]
	ldr	r2, [r1, #8]
	str	r2, [r0, #8]
	ldr	r1, [r1, #12]
	str	r1, [r0, #12]
	bx	lr
.size func_0042566C, .-func_0042566C

.section .text.func_00425690,"ax",%progbits
.balign 4
.global func_00425690
.type func_00425690, %function
func_00425690:
	push	{r4}
	mov	r4, #0
	vldr	s0, [sp, #4]
	str	r4, [r0, #16]
	str	r4, [r0, #20]
	stm	r0, {r1, r2, r3}
	vstr	s0, [r0, #12]
	pop	{r4}
	bx	lr
.size func_00425690, .-func_00425690

.section .text.func_00430238,"ax",%progbits
.balign 4
.global func_00430238
.type func_00430238, %function
func_00430238:
	ldrb	r1, [r0, #131]
	cmp	r1, #0
	bne	.Lfunc_00430238_1c
	mov	r2, #1
	mov	r1, #7
	strb	r2, [r0, #131]
	str	r1, [r0, #120]
.Lfunc_00430238_1c:
	mov	r0, #1
	bx	lr
.size func_00430238, .-func_00430238

.section .text.func_0043D440,"ax",%progbits
.balign 4
.global func_0043D440
.type func_0043D440, %function
func_0043D440:
	ldr	r1, [r0]
	cmp	r1, #0
	bne	.Lfunc_0043D440_1c
	ldr	r1, [r0, #8]
	ldr	r0, [r0, #12]
	orrs	r0, r0, r1
	beq	.Lfunc_0043D440_20
.Lfunc_0043D440_1c:
	mov	r0, #1
.Lfunc_0043D440_20:
	bx	lr
.size func_0043D440, .-func_0043D440

.section .text.func_00464770,"ax",%progbits
.balign 4
.global func_00464770
.type func_00464770, %function
func_00464770:
	ldr	r2, [r0, #48]
	cmp	r2, #1440
	movhi	r2, #1440
	cmp	r2, r1
	movcc	r1, #0
	subcs	r1, r2, r1
	str	r2, [r0, #48]
	str	r1, [r0, #48]
	bx	lr
.size func_00464770, .-func_00464770

.section .text.func_00464C14,"ax",%progbits
.balign 4
.global func_00464C14
.type func_00464C14, %function
func_00464C14:
	ldr	r3, [r0, #72]
	ldr	r2, [r0, #76]
	lsl	r1, r1, #3
	and	r1, r1, #8
	bic	r3, r3, #8
	add	r0, r0, #72
	orr	r1, r1, r3
	stm	r0, {r1, r2}
	bx	lr
.size func_00464C14, .-func_00464C14

.section .text.func_0010BD24,"ax",%progbits
.balign 4
.global func_0010BD24
.type func_0010BD24, %function
func_0010BD24:
	ldr	r0, [r0, #12]
	cmp	r0, #0
	beq	.Lfunc_0010BD24_1c
	ldr	r0, [r0, #4]
	cmn	r0, #1
	movne	r0, #1
	moveq	r0, #0
.Lfunc_0010BD24_1c:
	bx	lr
.size func_0010BD24, .-func_0010BD24

.section .text.func_00112B0C,"ax",%progbits
.balign 4
.global func_00112B0C
.type func_00112B0C, %function
func_00112B0C:
	ldrb	r1, [r0, #2]
	mvn	r3, #0
	mov	r2, #0
	strh	r3, [r0]
	bic	r1, r1, #15
	strb	r2, [r0, #3]
	strb	r1, [r0, #2]
	bx	lr
.size func_00112B0C, .-func_00112B0C

.section .text.func_00113D20,"ax",%progbits
.balign 4
.global func_00113D20
.type func_00113D20, %function
func_00113D20:
	add	r1, r0, #20480
	mov	r3, #0
	str	r3, [r1, #688]
	str	r3, [r1, #700]
	str	r3, [r1, #704]
	str	r3, [r1, #708]
	strb	r3, [r1, #712]
	bx	lr
.size func_00113D20, .-func_00113D20

.section .text.func_00115A20,"ax",%progbits
.balign 4
.global func_00115A20
.type func_00115A20, %function
func_00115A20:
	mov	r1, #0
	mvn	r2, #0
	str	r1, [r0, #4]
	str	r2, [r0]
	str	r1, [r0, #8]
	str	r1, [r0, #12]
	str	r1, [r0, #16]
	bx	lr
.size func_00115A20, .-func_00115A20

.section .text.func_00139414,"ax",%progbits
.balign 4
.global func_00139414
.type func_00139414, %function
func_00139414:
	ldrsb	r1, [r0, #12]
	cmp	r1, #0
	beq	.Lfunc_00139414_1c
	ldr	r2, [r0, #4]
	mov	r1, #0
	strh	r1, [r2]
	strh	r1, [r0, #10]
.Lfunc_00139414_1c:
	bx	lr
.size func_00139414, .-func_00139414

.section .text.func_001783B8,"ax",%progbits
.balign 4
.global func_001783B8
.type func_001783B8, %function
func_001783B8:
	ldrh	r3, [r0, #54]
	add	r2, r0, #36
	and	r1, r1, #1
	and	r0, r3, #1
	bic	r3, r3, #1
	orr	r1, r1, r3
	strh	r1, [r2, #18]
	bx	lr
.size func_001783B8, .-func_001783B8

.section .text.func_0018749C,"ax",%progbits
.balign 4
.global func_0018749C
.type func_0018749C, %function
func_0018749C:
	vstr	s0, [r0, #100]
	ldr	r0, [r0, #104]
	mov	r0, r0
	ldrh	r1, [r0, #108]
	vstr	s0, [r0, #104]
	orr	r1, r1, #1
	strh	r1, [r0, #108]
	bx	lr
.size func_0018749C, .-func_0018749C

.section .text.func_001C4934,"ax",%progbits
.balign 4
.global func_001C4934
.type func_001C4934, %function
func_001C4934:
	cmp	r1, #0
	ldrne	r3, [r0, #144]
	strne	r3, [r1]
	ldr	r1, [r0, #144]
	eor	r1, r1, r2
	str	r1, [r0, #144]
	mov	r0, #0
	bx	lr
.size func_001C4934, .-func_001C4934

.section .text.func_001FA404,"ax",%progbits
.balign 4
.global func_001FA404
.type func_001FA404, %function
func_001FA404:
	add	r2, r0, #4
	tst	r2, #15
	mov	r1, #0
	andne	r1, r2, #15
	rsbne	r1, r1, #16
	add	r0, r0, r1
	add	r0, r0, #52
	bx	lr
.size func_001FA404, .-func_001FA404

.section .text.func_002537A8,"ax",%progbits
.balign 4
.global func_002537A8
.type func_002537A8, %function
func_002537A8:
	ldrb	r2, [r0, #117]
	cmp	r2, #0
	beq	.Lfunc_002537A8_1c
	add	r1, r1, #4
	add	r0, r0, #44
	vldmia	r1, {s0-s6}
	vstmia	r0, {s0-s6}
.Lfunc_002537A8_1c:
	bx	lr
.size func_002537A8, .-func_002537A8

.section .text.func_002B7F84,"ax",%progbits
.balign 4
.global func_002B7F84
.type func_002B7F84, %function
func_002B7F84:
	mov	r3, #0
	str	r3, [r0, #8]
	add	r3, r0, #12
	str	r0, [r0]
	stm	r3, {r1, r2}
	add	r3, r0, #4
	stm	r3, {r0, r2}
	bx	lr
.size func_002B7F84, .-func_002B7F84
