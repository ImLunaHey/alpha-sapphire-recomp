.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002C3128,"ax",%progbits
.balign 4
.global func_002C3128
.type func_002C3128, %function
func_002C3128:
	ldrb	r1, [r0]
	cmp	r1, #0
	beq	.Lfunc_002C3128_1c
	mvn	r2, #0
	mov	r1, #0
	str	r2, [r0, #60]
	strb	r1, [r0]
.Lfunc_002C3128_1c:
	bx	lr
.size func_002C3128, .-func_002C3128

.section .text.func_002C3320,"ax",%progbits
.balign 4
.global func_002C3320
.type func_002C3320, %function
func_002C3320:
	ldr	r0, [r0, #104]
	mov	r0, r0
	ldrh	r2, [r0, #30]
	and	r1, r1, #3
	bic	r2, r2, #3
	orr	r1, r1, r2
	strh	r1, [r0, #30]
	bx	lr
.size func_002C3320, .-func_002C3320

.section .text.func_002C3364,"ax",%progbits
.balign 4
.global func_002C3364
.type func_002C3364, %function
func_002C3364:
	strb	r1, [r0, #5]
	ldr	r0, [r0, #104]
	mov	r0, r0
	ldrh	r2, [r0, #108]
	strb	r1, [r0, #14]
	orr	r1, r2, #32
	strh	r1, [r0, #108]
	bx	lr
.size func_002C3364, .-func_002C3364

.section .text.func_002C8880,"ax",%progbits
.balign 4
.global func_002C8880
.type func_002C8880, %function
func_002C8880:
	mov	ip, #0
	str	r1, [r0, #12]
	str	ip, [r0, #16]
	str	ip, [r0, #32]
	str	ip, [r0, #36]
	str	ip, [r0, #20]
	mov	r0, ip
	bx	lr
.size func_002C8880, .-func_002C8880

.section .text.func_002CACA0,"ax",%progbits
.balign 4
.global func_002CACA0
.type func_002CACA0, %function
func_002CACA0:
	mov	r2, r0
	mov	r0, #0
.Lfunc_002CACA0_8:
	ldrb	r3, [r2, r0]
	cmp	r3, #0
	cmpne	r1, r0
	addhi	r0, r0, #1
	bhi	.Lfunc_002CACA0_8
	bx	lr
.size func_002CACA0, .-func_002CACA0

.section .text.func_00322440,"ax",%progbits
.balign 4
.global func_00322440
.type func_00322440, %function
func_00322440:
	ldrd	r2, [r1]
	ldr	r1, [r1, #8]
	str	r1, [r0, #48]
	strd	r2, [r0, #40]
	ldrb	r1, [r0, #183]
	and	r1, r1, #207
	strb	r1, [r0, #183]
	bx	lr
.size func_00322440, .-func_00322440

.section .text.func_0032F118,"ax",%progbits
.balign 4
.global func_0032F118
.type func_0032F118, %function
func_0032F118:
	add	r1, r1, #1
	mul	r1, r1, r1
	asr	r2, r1, #31
	add	r1, r1, r2, lsr #30
	lsl	r1, r1, #14
	lsr	r1, r1, #16
	strh	r1, [r0, #20]
	bx	lr
.size func_0032F118, .-func_0032F118

.section .text.func_00330488,"ax",%progbits
.balign 4
.global func_00330488
.type func_00330488, %function
func_00330488:
	ldrb	r1, [r0, #8]
	cmp	r1, #0
	beq	.Lfunc_00330488_1c
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	strb	r1, [r0, #8]
.Lfunc_00330488_1c:
	bx	lr
.size func_00330488, .-func_00330488

.section .text.func_003315DC,"ax",%progbits
.balign 4
.global func_003315DC
.type func_003315DC, %function
func_003315DC:
	ldrb	r2, [r0, #44]
	cmp	r2, r1
	beq	.Lfunc_003315DC_1c
	ldrh	r2, [r0, #32]
	strb	r1, [r0, #44]
	orr	r1, r2, #8
	strh	r1, [r0, #32]
.Lfunc_003315DC_1c:
	bx	lr
.size func_003315DC, .-func_003315DC

.section .text.func_003315FC,"ax",%progbits
.balign 4
.global func_003315FC
.type func_003315FC, %function
func_003315FC:
	ldrb	r2, [r0, #45]
	cmp	r2, r1
	beq	.Lfunc_003315FC_1c
	ldrh	r2, [r0, #32]
	strb	r1, [r0, #45]
	orr	r1, r2, #8
	strh	r1, [r0, #32]
.Lfunc_003315FC_1c:
	bx	lr
.size func_003315FC, .-func_003315FC

.section .text.func_003316D4,"ax",%progbits
.balign 4
.global func_003316D4
.type func_003316D4, %function
func_003316D4:
	ldrsb	r2, [r0, #23]
	cmp	r2, r1
	beq	.Lfunc_003316D4_1c
	ldrh	r2, [r0, #32]
	strb	r1, [r0, #23]
	orr	r1, r2, #2
	strh	r1, [r0, #32]
.Lfunc_003316D4_1c:
	bx	lr
.size func_003316D4, .-func_003316D4

.section .text.func_003316F4,"ax",%progbits
.balign 4
.global func_003316F4
.type func_003316F4, %function
func_003316F4:
	ldrh	r2, [r0, #32]
	mov	r3, #1
	mov	r1, #0
	strb	r3, [r0, #21]
	orr	r2, r2, #1
	strb	r1, [r0, #23]
	strh	r2, [r0, #32]
	bx	lr
.size func_003316F4, .-func_003316F4

.section .text.func_0033612C,"ax",%progbits
.balign 4
.global func_0033612C
.type func_0033612C, %function
func_0033612C:
	ldr	r3, [r0, #356]
	ldr	r2, [r0, #360]
	add	r1, r1, r3
	cmp	r1, r2
	str	r1, [r0, #356]
	movgt	r1, r2
	str	r1, [r0, #356]
	bx	lr
.size func_0033612C, .-func_0033612C

.section .text.func_0033C1A4,"ax",%progbits
.balign 4
.global func_0033C1A4
.type func_0033C1A4, %function
func_0033C1A4:
	ldr	r1, [r0, #44]
	cmn	r1, #1
	bne	.Lfunc_0033C1A4_18
	ldr	r0, [r0, #48]
	ands	r0, r0, #1073741824
	beq	.Lfunc_0033C1A4_1c
.Lfunc_0033C1A4_18:
	mov	r0, #1
.Lfunc_0033C1A4_1c:
	bx	lr
.size func_0033C1A4, .-func_0033C1A4

.section .text.func_00387350,"ax",%progbits
.balign 4
.global func_00387350
.type func_00387350, %function
func_00387350:
	mov	r3, #2
	mov	r2, #0
	strb	r3, [r0]
	str	r2, [r0, #4]
	str	r2, [r0, #8]
	str	r2, [r0, #12]
	strb	r1, [r0, #1]
	bx	lr
.size func_00387350, .-func_00387350

.section .text.func_00396454,"ax",%progbits
.balign 4
.global func_00396454
.type func_00396454, %function
func_00396454:
	ldrd	r2, [r1]
	ldr	r1, [r1, #8]
	str	r1, [r0, #252]
	strd	r2, [r0, #244]
	ldr	r1, [r0, #228]
	orr	r1, r1, #4
	str	r1, [r0, #228]
	bx	lr
.size func_00396454, .-func_00396454

.section .text.func_003B7E60,"ax",%progbits
.balign 4
.global func_003B7E60
.type func_003B7E60, %function
func_003B7E60:
	cmp	r1, #0
	ble	.Lfunc_003B7E60_1c
	cmp	r2, #0
	beq	.Lfunc_003B7E60_1c
	mov	r3, #0
	str	r3, [r0], #4
	stm	r0, {r1, r2}
.Lfunc_003B7E60_1c:
	bx	lr
.size func_003B7E60, .-func_003B7E60

.section .text.func_003C4E48,"ax",%progbits
.balign 4
.global func_003C4E48
.type func_003C4E48, %function
func_003C4E48:
	ldr	r2, [r0, #8]
	mov	r1, #0
	str	r1, [r0, #20]
	strb	r1, [r0, #28]
	strb	r1, [r0, #29]
	add	r1, r2, #16
	str	r1, [r0, #12]
	bx	lr
.size func_003C4E48, .-func_003C4E48

.section .text.func_003C88C0,"ax",%progbits
.balign 4
.global func_003C88C0
.type func_003C88C0, %function
func_003C88C0:
	vldmia	r1, {s0-s7}
	add	r2, r0, #16
	vstmia	r2, {s0-s7}
	ldrd	r2, [r1, #32]
	ldr	r1, [r1, #40]
	str	r1, [r0, #56]
	strd	r2, [r0, #48]
	bx	lr
.size func_003C88C0, .-func_003C88C0

.section .text.func_004108EC,"ax",%progbits
.balign 4
.global func_004108EC
.type func_004108EC, %function
func_004108EC:
	ldr	r2, [r0]
	lsl	r1, r1, #14
	lsr	r1, r1, #14
	lsr	r2, r2, #18
	lsl	r2, r2, #18
	orr	r1, r1, r2
	str	r1, [r0]
	bx	lr
.size func_004108EC, .-func_004108EC

.section .text.func_0045ECC0,"ax",%progbits
.balign 4
.global func_0045ECC0
.type func_0045ECC0, %function
func_0045ECC0:
	ldrb	r1, [r0, #11]
	add	r1, r1, #1
	and	r1, r1, #255
	cmp	r1, #10
	strb	r1, [r0, #11]
	movcs	r0, #0
	movcc	r0, #1
	bx	lr
.size func_0045ECC0, .-func_0045ECC0

.section .text.func_004623DC,"ax",%progbits
.balign 4
.global func_004623DC
.type func_004623DC, %function
func_004623DC:
	ldrb	r2, [r0, #1089]
	orr	r2, r2, #128
	strb	r2, [r0, #1089]
	ldrb	r1, [r0, #1090]
	cmp	r1, #30
	moveq	r1, #31
	strbeq	r1, [r0, #1090]
	bx	lr
.size func_004623DC, .-func_004623DC

.section .text.func_004C0728,"ax",%progbits
.balign 4
.global func_004C0728
.type func_004C0728, %function
func_004C0728:
	ldr	r0, [r0]
	cmp	r0, #0
	beq	.Lfunc_004C0728_1c
	ldrb	r0, [r0, #4]
	cmp	r0, #0
	moveq	r0, #1
	movne	r0, #0
.Lfunc_004C0728_1c:
	bx	lr
.size func_004C0728, .-func_004C0728

.section .text.func_004C22F0,"ax",%progbits
.balign 4
.global func_004C22F0
.type func_004C22F0, %function
func_004C22F0:
	ldr	r2, [r0, #20]!
	cmp	r2, r1
	movls	r0, #0
	bls	.Lfunc_004C22F0_1c
	add	r1, r0, r1, lsl #3
	ldr	r1, [r1, #8]
	add	r0, r0, r1
.Lfunc_004C22F0_1c:
	bx	lr
.size func_004C22F0, .-func_004C22F0
