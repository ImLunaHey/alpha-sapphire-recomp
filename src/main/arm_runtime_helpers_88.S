.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00417448,"ax",%progbits
.balign 4
.global func_00417448
.type func_00417448, %function
func_00417448:
.Lfunc_00417448_0:
	ldr	r2, [r0, #44]
.Lfunc_00417448_4:
	and	r1, r1, #31
.Lfunc_00417448_8:
	bic	r2, r2, #31
.Lfunc_00417448_c:
	orr	r1, r1, r2
.Lfunc_00417448_10:
	str	r1, [r0, #44]
.Lfunc_00417448_14:
	bx	lr
.size func_00417448, .-func_00417448

.section .text.func_004174E0,"ax",%progbits
.balign 4
.global func_004174E0
.type func_004174E0, %function
func_004174E0:
.Lfunc_004174E0_0:
	ldr	r2, [r0, #40]
.Lfunc_004174E0_4:
	bic	r2, r2, #256
.Lfunc_004174E0_8:
	bic	r2, r2, #254
.Lfunc_004174E0_c:
	orr	r1, r2, r1, lsl #1
.Lfunc_004174E0_10:
	str	r1, [r0, #40]
.Lfunc_004174E0_14:
	bx	lr
.size func_004174E0, .-func_004174E0

.section .text.func_0015EB38,"ax",%progbits
.balign 4
.global func_0015EB38
.type func_0015EB38, %function
func_0015EB38:
.Lfunc_0015EB38_0:
	cmp	r1, r0
.Lfunc_0015EB38_4:
	bxeq	lr
.Lfunc_0015EB38_8:
	vldmia	r1, {s0-s15}
.Lfunc_0015EB38_c:
	vstmia	r0, {s0-s15}
.Lfunc_0015EB38_10:
	bx	lr
.size func_0015EB38, .-func_0015EB38

.section .text.func_0022D37C,"ax",%progbits
.balign 4
.global func_0022D37C
.type func_0022D37C, %function
func_0022D37C:
.Lfunc_0022D37C_0:
	add	r0, r0, #4
.Lfunc_0022D37C_4:
	push	{r4, lr}
.Lfunc_0022D37C_8:
	mov	r0, r0
.Lfunc_0022D37C_c:
	sub	r0, r0, #4
.Lfunc_0022D37C_10:
	pop	{r4, pc}
.size func_0022D37C, .-func_0022D37C

.section .text.func_0045CCF0,"ax",%progbits
.balign 4
.global func_0045CCF0
.type func_0045CCF0, %function
func_0045CCF0:
.Lfunc_0045CCF0_0:
	add	r0, r0, r1
.Lfunc_0045CCF0_4:
	ldrb	r1, [r0, #97]
.Lfunc_0045CCF0_8:
	add	r1, r1, #1
.Lfunc_0045CCF0_c:
	strb	r1, [r0, #97]
.Lfunc_0045CCF0_10:
	bx	lr
.size func_0045CCF0, .-func_0045CCF0

.section .text.func_0045D09C,"ax",%progbits
.balign 4
.global func_0045D09C
.type func_0045D09C, %function
func_0045D09C:
.Lfunc_0045D09C_0:
	ldr	r0, [r0, #492]
.Lfunc_0045D09C_4:
	cmn	r0, #1
.Lfunc_0045D09C_8:
	movne	r0, #1
.Lfunc_0045D09C_c:
	moveq	r0, #0
.Lfunc_0045D09C_10:
	bx	lr
.size func_0045D09C, .-func_0045D09C

.section .text.func_00462934,"ax",%progbits
.balign 4
.global func_00462934
.type func_00462934, %function
func_00462934:
.Lfunc_00462934_0:
	ldr	r2, [r0, #52]
.Lfunc_00462934_4:
	bic	r2, r2, #2048
.Lfunc_00462934_8:
	orr	r1, r2, r1, lsl #11
.Lfunc_00462934_c:
	str	r1, [r0, #52]
.Lfunc_00462934_10:
	bx	lr
.size func_00462934, .-func_00462934

.section .text.func_0046296C,"ax",%progbits
.balign 4
.global func_0046296C
.type func_0046296C, %function
func_0046296C:
.Lfunc_0046296C_0:
	ldr	r2, [r0, #52]
.Lfunc_0046296C_4:
	bic	r2, r2, #1024
.Lfunc_0046296C_8:
	orr	r1, r2, r1, lsl #10
.Lfunc_0046296C_c:
	str	r1, [r0, #52]
.Lfunc_0046296C_10:
	bx	lr
.size func_0046296C, .-func_0046296C

.section .text.func_00462B58,"ax",%progbits
.balign 4
.global func_00462B58
.type func_00462B58, %function
func_00462B58:
.Lfunc_00462B58_0:
	ldr	r2, [r0, #4]
.Lfunc_00462B58_4:
	bic	r2, r2, #131072
.Lfunc_00462B58_8:
	orr	r1, r2, r1, lsl #17
.Lfunc_00462B58_c:
	str	r1, [r0, #4]
.Lfunc_00462B58_10:
	bx	lr
.size func_00462B58, .-func_00462B58

.section .text.func_00463D08,"ax",%progbits
.balign 4
.global func_00463D08
.type func_00463D08, %function
func_00463D08:
.Lfunc_00463D08_0:
	add	r0, r0, r1, lsl #2
.Lfunc_00463D08_4:
	add	r0, r0, #768
.Lfunc_00463D08_8:
	strh	r2, [r0, #104]
.Lfunc_00463D08_c:
	strh	r3, [r0, #106]
.Lfunc_00463D08_10:
	bx	lr
.size func_00463D08, .-func_00463D08

.section .text.func_00463D50,"ax",%progbits
.balign 4
.global func_00463D50
.type func_00463D50, %function
func_00463D50:
.Lfunc_00463D50_0:
	ldrb	r1, [r0, #953]
.Lfunc_00463D50_4:
	cmp	r1, #15
.Lfunc_00463D50_8:
	addcc	r1, r1, #1
.Lfunc_00463D50_c:
	strbcc	r1, [r0, #953]
.Lfunc_00463D50_10:
	bx	lr
.size func_00463D50, .-func_00463D50

.section .text.func_00466E00,"ax",%progbits
.balign 4
.global func_00466E00
.type func_00466E00, %function
func_00466E00:
.Lfunc_00466E00_0:
	ldrb	r2, [r0, #230]
.Lfunc_00466E00_4:
	bic	r2, r2, #1
.Lfunc_00466E00_8:
	orr	r1, r1, r2
.Lfunc_00466E00_c:
	strb	r1, [r0, #230]
.Lfunc_00466E00_10:
	bx	lr
.size func_00466E00, .-func_00466E00

.section .text.func_00488360,"ax",%progbits
.balign 4
.global func_00488360
.type func_00488360, %function
func_00488360:
.Lfunc_00488360_0:
	add	r0, r0, r1, lsl #2
.Lfunc_00488360_4:
	add	r0, r0, #12288
.Lfunc_00488360_8:
	add	r0, r0, #2768
.Lfunc_00488360_c:
	str	r2, [r0]
.Lfunc_00488360_10:
	bx	lr
.size func_00488360, .-func_00488360

.section .text.func_004AAC8C,"ax",%progbits
.balign 4
.global func_004AAC8C
.type func_004AAC8C, %function
func_004AAC8C:
.Lfunc_004AAC8C_0:
	ldr	r0, [r0, #12]
.Lfunc_004AAC8C_4:
	bics	r0, r1, r0
.Lfunc_004AAC8C_8:
	moveq	r0, #1
.Lfunc_004AAC8C_c:
	movne	r0, #0
.Lfunc_004AAC8C_10:
	bx	lr
.size func_004AAC8C, .-func_004AAC8C

.section .text.func_004AB1DC,"ax",%progbits
.balign 4
.global func_004AB1DC
.type func_004AB1DC, %function
func_004AB1DC:
.Lfunc_004AB1DC_0:
	ldr	r1, [r0, #12]
.Lfunc_004AB1DC_4:
	ldr	r0, [r0, #4]
.Lfunc_004AB1DC_8:
	sub	r0, r1, r0
.Lfunc_004AB1DC_c:
	asr	r0, r0, #1
.Lfunc_004AB1DC_10:
	bx	lr
.size func_004AB1DC, .-func_004AB1DC

.section .text.func_004ADEB4,"ax",%progbits
.balign 4
.global func_004ADEB4
.type func_004ADEB4, %function
func_004ADEB4:
.Lfunc_004ADEB4_0:
	ldrh	r0, [r0, #28]
.Lfunc_004ADEB4_4:
	cmp	r0, #64
.Lfunc_004ADEB4_8:
	moveq	r0, #1
.Lfunc_004ADEB4_c:
	movne	r0, #0
.Lfunc_004ADEB4_10:
	bx	lr
.size func_004ADEB4, .-func_004ADEB4

.section .text.func_004BCA98,"ax",%progbits
.balign 4
.global func_004BCA98
.type func_004BCA98, %function
func_004BCA98:
.Lfunc_004BCA98_0:
	ldr	r0, [r0, #12]
.Lfunc_004BCA98_4:
	cmp	r0, #0
.Lfunc_004BCA98_8:
	ldrne	r1, [r0, #8]
.Lfunc_004BCA98_c:
	addne	r0, r0, r1
.Lfunc_004BCA98_10:
	bx	lr
.size func_004BCA98, .-func_004BCA98

.section .text.func_004C0748,"ax",%progbits
.balign 4
.global func_004C0748
.type func_004C0748, %function
func_004C0748:
.Lfunc_004C0748_0:
	ldr	r1, [r0]
.Lfunc_004C0748_4:
	cmp	r1, #0
.Lfunc_004C0748_8:
	ldrbne	r0, [r0, #80]
.Lfunc_004C0748_c:
	moveq	r0, #1
.Lfunc_004C0748_10:
	bx	lr
.size func_004C0748, .-func_004C0748

.section .text.func_004C7EDC,"ax",%progbits
.balign 4
.global func_004C7EDC
.type func_004C7EDC, %function
func_004C7EDC:
.Lfunc_004C7EDC_0:
	cmp	r1, #3
.Lfunc_004C7EDC_4:
	addcc	r0, r0, r1, lsl #2
.Lfunc_004C7EDC_8:
	movcs	r0, #0
.Lfunc_004C7EDC_c:
	ldrcc	r0, [r0, #12]
.Lfunc_004C7EDC_10:
	bx	lr
.size func_004C7EDC, .-func_004C7EDC

.section .text.func_00115A40,"ax",%progbits
.balign 4
.global func_00115A40
.type func_00115A40, %function
func_00115A40:
.Lfunc_00115A40_0:
	add	r0, r0, #215040
.Lfunc_00115A40_4:
	add	r0, r0, #724
.Lfunc_00115A40_8:
	str	r1, [r0]
.Lfunc_00115A40_c:
	bx	lr
.size func_00115A40, .-func_00115A40

.section .text.func_00136594,"ax",%progbits
.balign 4
.global func_00136594
.type func_00136594, %function
func_00136594:
.Lfunc_00136594_0:
	mov	r0, #436
.Lfunc_00136594_4:
	add	r1, r1, #1
.Lfunc_00136594_8:
	mul	r0, r1, r0
.Lfunc_00136594_c:
	bx	lr
.size func_00136594, .-func_00136594

.section .text.func_0013CC28,"ax",%progbits
.balign 4
.global func_0013CC28
.type func_0013CC28, %function
func_0013CC28:
.Lfunc_0013CC28_0:
	mov	r2, #1
.Lfunc_0013CC28_4:
	str	r1, [r0, #192]
.Lfunc_0013CC28_8:
	strb	r2, [r0, #203]
.Lfunc_0013CC28_c:
	bx	lr
.size func_0013CC28, .-func_0013CC28

.section .text.func_0013E6E4,"ax",%progbits
.balign 4
.global func_0013E6E4
.type func_0013E6E4, %function
func_0013E6E4:
.Lfunc_0013E6E4_0:
	ldr	r0, [r0]
.Lfunc_0013E6E4_4:
	lsl	r0, r0, #8
.Lfunc_0013E6E4_8:
	lsr	r0, r0, #24
.Lfunc_0013E6E4_c:
	bx	lr
.size func_0013E6E4, .-func_0013E6E4

.section .text.func_0016C080,"ax",%progbits
.balign 4
.global func_0016C080
.type func_0016C080, %function
func_0016C080:
.Lfunc_0016C080_0:
	ldr	r0, [r0, #72]
.Lfunc_0016C080_4:
	and	r0, r0, #8
.Lfunc_0016C080_8:
	lsr	r0, r0, #3
.Lfunc_0016C080_c:
	bx	lr
.size func_0016C080, .-func_0016C080
