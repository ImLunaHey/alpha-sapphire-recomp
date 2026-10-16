.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004108D4,"ax",%progbits
.balign 4
.global func_004108D4
.type func_004108D4, %function
func_004108D4:
	ldr	r2, [r0]
	lsl	r2, r2, #14
	lsr	r2, r2, #14
	orr	r1, r2, r1, lsl #18
	str	r1, [r0]
	bx	lr
.size func_004108D4, .-func_004108D4

.section .text.func_00417460,"ax",%progbits
.balign 4
.global func_00417460
.type func_00417460, %function
func_00417460:
	cmp	r1, #0
	ldr	r1, [r0, #40]
	orrne	r1, r1, #1
	biceq	r1, r1, #1
	str	r1, [r0, #40]
	bx	lr
.size func_00417460, .-func_00417460

.section .text.func_00438B7C,"ax",%progbits
.balign 4
.global func_00438B7C
.type func_00438B7C, %function
func_00438B7C:
	ldrb	r1, [r0, #265]
	cmp	r1, #1
	ldreq	r0, [r0, #36]
	ldreq	r0, [r0, #128]
	ldrne	r0, [r0, #20]
	bx	lr
.size func_00438B7C, .-func_00438B7C

.section .text.func_0045E658,"ax",%progbits
.balign 4
.global func_0045E658
.type func_0045E658, %function
func_0045E658:
	mov	r1, #0
	str	r1, [r0, #980]
	str	r1, [r0, #984]
	str	r1, [r0, #988]
	str	r1, [r0, #992]
	bx	lr
.size func_0045E658, .-func_0045E658

.section .text.func_00463D38,"ax",%progbits
.balign 4
.global func_00463D38
.type func_00463D38, %function
func_00463D38:
	add	r0, r0, r1, lsl #2
	add	r0, r0, r2
	ldrb	r1, [r0, #52]
	cmp	r1, r3
	strbcc	r3, [r0, #52]
	bx	lr
.size func_00463D38, .-func_00463D38

.section .text.func_00466F00,"ax",%progbits
.balign 4
.global func_00466F00
.type func_00466F00, %function
func_00466F00:
	ldr	r0, [r0]
	uxth	r1, r1
	add	r0, r0, #3824
	mov	r0, r0
	strh	r1, [r0, #228]
	bx	lr
.size func_00466F00, .-func_00466F00

.section .text.func_004B09E0,"ax",%progbits
.balign 4
.global func_004B09E0
.type func_004B09E0, %function
func_004B09E0:
	ldr	r1, [r0, #12]
	ldr	r0, [r0, #16]
	cmp	r1, r0
	movne	r0, r1
	moveq	r0, #0
	bx	lr
.size func_004B09E0, .-func_004B09E0

.section .text.func_004B1444,"ax",%progbits
.balign 4
.global func_004B1444
.type func_004B1444, %function
func_004B1444:
	ldr	r0, [r0]
	ldr	r1, [r1]
	cmp	r0, r1
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_004B1444, .-func_004B1444

.section .text.func_004BF4F8,"ax",%progbits
.balign 4
.global func_004BF4F8
.type func_004BF4F8, %function
func_004BF4F8:
	ldrh	r1, [r0]
	cmp	r1, #768
	ldreq	r1, [r0, #4]
	addeq	r0, r0, r1
	movne	r0, #0
	bx	lr
.size func_004BF4F8, .-func_004BF4F8

.section .text.func_004BF52C,"ax",%progbits
.balign 4
.global func_004BF52C
.type func_004BF52C, %function
func_004BF52C:
	ldrh	r1, [r0]
	cmp	r1, #16640
	ldreq	r1, [r0, #4]
	movne	r0, #0
	addeq	r0, r0, r1
	bx	lr
.size func_004BF52C, .-func_004BF52C

.section .text.func_004C2018,"ax",%progbits
.balign 4
.global func_004C2018
.type func_004C2018, %function
func_004C2018:
	ldr	r1, [r0, #4]
	sub	r2, r1, #512
	subs	r2, r2, #31
	movne	r0, #0
	addeq	r0, r0, #8
	bx	lr
.size func_004C2018, .-func_004C2018

.section .text.func_0010E17C,"ax",%progbits
.balign 4
.global func_0010E17C
.type func_0010E17C, %function
func_0010E17C:
	ldr	r0, [r0, #376]
	ldrb	r0, [r0, #1]
	cmp	r0, #0
	movne	r0, #1
	bx	lr
.size func_0010E17C, .-func_0010E17C

.section .text.func_00110D9C,"ax",%progbits
.balign 4
.global func_00110D9C
.type func_00110D9C, %function
func_00110D9C:
	vldmia	sp, {s0-s1}
	add	r1, r0, #8
	vstmia	r1, {s0-s1}
	strd	r2, [r0]
	bx	lr
.size func_00110D9C, .-func_00110D9C

.section .text.func_001175D0,"ax",%progbits
.balign 4
.global func_001175D0
.type func_001175D0, %function
func_001175D0:
	cmp	r1, #3
	addcc	r0, r0, r1, lsl #2
	movcs	r0, #0
	ldrcc	r0, [r0, #36]
	bx	lr
.size func_001175D0, .-func_001175D0

.section .text.func_00117768,"ax",%progbits
.balign 4
.global func_00117768
.type func_00117768, %function
func_00117768:
	mov	r1, #0
	str	r1, [r0]
	strh	r1, [r0, #4]
	strb	r1, [r0, #6]
	bx	lr
.size func_00117768, .-func_00117768

.section .text.func_0013F33C,"ax",%progbits
.balign 4
.global func_0013F33C
.type func_0013F33C, %function
func_0013F33C:
	ldr	r0, [r0, #12]
	mov	r0, r0
	ldr	r0, [r0, #8]
	ldr	r0, [r0]
	bx	lr
.size func_0013F33C, .-func_0013F33C

.section .text.func_0014B87C,"ax",%progbits
.balign 4
.global func_0014B87C
.type func_0014B87C, %function
func_0014B87C:
	mov	r1, #78
	mul	r0, r0, r1
	add	r0, r0, #57
	bic	r0, r0, #3
	bx	lr
.size func_0014B87C, .-func_0014B87C

.section .text.func_0014DFB4,"ax",%progbits
.balign 4
.global func_0014DFB4
.type func_0014DFB4, %function
func_0014DFB4:
	ldrh	r1, [r0]
	cmp	r1, #16
	ldrheq	r0, [r0, #4]
	movne	r0, #0
	bx	lr
.size func_0014DFB4, .-func_0014DFB4

.section .text.func_00152868,"ax",%progbits
.balign 4
.global func_00152868
.type func_00152868, %function
func_00152868:
	ldr	r0, [r0, #12]
	ldrb	r0, [r0, #10]
	cmp	r0, #0
	movne	r0, #1
	bx	lr
.size func_00152868, .-func_00152868

.section .text.func_00186EC4,"ax",%progbits
.balign 4
.global func_00186EC4
.type func_00186EC4, %function
func_00186EC4:
	add	r0, r0, r1, lsl #1
	mov	r3, #0
	strb	r3, [r0, r2]
	mov	r0, #1
	bx	lr
.size func_00186EC4, .-func_00186EC4

.section .text.func_001950F8,"ax",%progbits
.balign 4
.global func_001950F8
.type func_001950F8, %function
func_001950F8:
	ldr	r2, [r1]
	str	r2, [r0]
	ldrh	r3, [r1, #4]
	strh	r3, [r0, #4]
	bx	lr
.size func_001950F8, .-func_001950F8

.section .text.func_001D25F0,"ax",%progbits
.balign 4
.global func_001D25F0
.type func_001D25F0, %function
func_001D25F0:
	cmp	r0, #2
	cmpne	r0, #4
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_001D25F0, .-func_001D25F0

.section .text.func_002067EC,"ax",%progbits
.balign 4
.global func_002067EC
.type func_002067EC, %function
func_002067EC:
	add	r1, r1, #4
	add	r2, r0, #4
	vldmia	r1, {s0-s6}
	vstmia	r2, {s0-s6}
	bx	lr
.size func_002067EC, .-func_002067EC

.section .text.func_0029C1C0,"ax",%progbits
.balign 4
.global func_0029C1C0
.type func_0029C1C0, %function
func_0029C1C0:
	ldr	r2, [r1, #4]
	str	r2, [r0, #4]
	ldrh	r1, [r1, #8]
	strh	r1, [r0, #8]
	bx	lr
.size func_0029C1C0, .-func_0029C1C0
