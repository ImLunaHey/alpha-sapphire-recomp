.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003B7DD8,"ax",%progbits
.balign 4
.global func_003B7DD8
.type func_003B7DD8, %function
func_003B7DD8:
.Lfunc_003B7DD8_0:
	mov	r3, #0
.Lfunc_003B7DD8_4:
	str	r3, [r0]
.Lfunc_003B7DD8_8:
	str	r3, [r0, #8]
.Lfunc_003B7DD8_c:
	strh	r3, [r0, #12]
.Lfunc_003B7DD8_10:
	str	r3, [r0, #16]
.Lfunc_003B7DD8_14:
	strh	r3, [r0, #20]
.Lfunc_003B7DD8_18:
	str	r3, [r0, #24]
.Lfunc_003B7DD8_1c:
	add	r2, r0, #28
.Lfunc_003B7DD8_20:
	mvn	ip, #0
.Lfunc_003B7DD8_24:
	stm	r2, {r3, ip}
.Lfunc_003B7DD8_28:
	str	r3, [r0, #48]
.Lfunc_003B7DD8_2c:
	str	r3, [r0, #52]
.Lfunc_003B7DD8_30:
	bx	lr
.size func_003B7DD8, .-func_003B7DD8

.section .text.func_0040FE1C,"ax",%progbits
.balign 4
.global func_0040FE1C
.type func_0040FE1C, %function
func_0040FE1C:
.Lfunc_0040FE1C_0:
	ldr	r2, [r0, #32]
.Lfunc_0040FE1C_4:
	cmp	r2, #0
.Lfunc_0040FE1C_8:
	beq	.Lfunc_0040FE1C_18
.Lfunc_0040FE1C_c:
	ldr	r2, [r0, #44]
.Lfunc_0040FE1C_10:
	ldr	r3, [r1]
.Lfunc_0040FE1C_14:
	str	r3, [r2, #16]
.Lfunc_0040FE1C_18:
	ldr	r2, [r0, #52]
.Lfunc_0040FE1C_1c:
	cmp	r2, #0
.Lfunc_0040FE1C_20:
	beq	.Lfunc_0040FE1C_30
.Lfunc_0040FE1C_24:
	ldr	r0, [r0, #64]
.Lfunc_0040FE1C_28:
	ldr	r1, [r1]
.Lfunc_0040FE1C_2c:
	str	r1, [r0, #12]
.Lfunc_0040FE1C_30:
	bx	lr
.size func_0040FE1C, .-func_0040FE1C

.section .text.func_0045A6E8,"ax",%progbits
.balign 4
.global func_0045A6E8
.type func_0045A6E8, %function
func_0045A6E8:
.Lfunc_0045A6E8_0:
	mov	r1, #0
.Lfunc_0045A6E8_4:
	add	r0, r0, #1600
.Lfunc_0045A6E8_8:
	mov	r2, r1
.Lfunc_0045A6E8_c:
	ldrb	r3, [r0, #984]
.Lfunc_0045A6E8_10:
	strb	r2, [r0, #982]
.Lfunc_0045A6E8_14:
	strb	r2, [r0, #983]
.Lfunc_0045A6E8_18:
	bic	r3, r3, #63
.Lfunc_0045A6E8_1c:
	add	r1, r1, #1
.Lfunc_0045A6E8_20:
	strb	r3, [r0, #984]
.Lfunc_0045A6E8_24:
	cmp	r1, #30
.Lfunc_0045A6E8_28:
	add	r0, r0, #992
.Lfunc_0045A6E8_2c:
	bcc	.Lfunc_0045A6E8_c
.Lfunc_0045A6E8_30:
	bx	lr
.size func_0045A6E8, .-func_0045A6E8

.section .text.func_0045BFF8,"ax",%progbits
.balign 4
.global func_0045BFF8
.type func_0045BFF8, %function
func_0045BFF8:
.Lfunc_0045BFF8_0:
	cmp	r1, #84
.Lfunc_0045BFF8_4:
	push	{r4, lr}
.Lfunc_0045BFF8_8:
	bge	.Lfunc_0045BFF8_1c
.Lfunc_0045BFF8_c:
	add	r1, r1, r1, lsl #1
.Lfunc_0045BFF8_10:
	add	r0, r0, r1, lsl #2
.Lfunc_0045BFF8_14:
	add	r0, r0, #4
.Lfunc_0045BFF8_18:
	pop	{r4, pc}
.Lfunc_0045BFF8_1c:
	mov	r2, #0
.Lfunc_0045BFF8_20:
	mov	r1, r2
.Lfunc_0045BFF8_24:
	mov	r0, r2
.Lfunc_0045BFF8_28:
	mov	r0, r0
.Lfunc_0045BFF8_2c:
	mov	r0, #0
.Lfunc_0045BFF8_30:
	pop	{r4, pc}
.size func_0045BFF8, .-func_0045BFF8

.section .text.func_0045E0C0,"ax",%progbits
.balign 4
.global func_0045E0C0
.type func_0045E0C0, %function
func_0045E0C0:
.Lfunc_0045E0C0_0:
	push	{r4, lr}
.Lfunc_0045E0C0_4:
	cmp	r1, #32
.Lfunc_0045E0C0_8:
	mov	r4, r0
.Lfunc_0045E0C0_c:
	bcc	.Lfunc_0045E0C0_24
.Lfunc_0045E0C0_10:
	mov	r2, #0
.Lfunc_0045E0C0_14:
	mov	r1, r2
.Lfunc_0045E0C0_18:
	mov	r0, r2
.Lfunc_0045E0C0_1c:
	mov	r0, r0
.Lfunc_0045E0C0_20:
	mov	r1, #0
.Lfunc_0045E0C0_24:
	add	r0, r4, r1, lsl #1
.Lfunc_0045E0C0_28:
	add	r0, r0, #1024
.Lfunc_0045E0C0_2c:
	add	r0, r0, #4
.Lfunc_0045E0C0_30:
	pop	{r4, pc}
.size func_0045E0C0, .-func_0045E0C0

.section .text.func_00460C9C,"ax",%progbits
.balign 4
.global func_00460C9C
.type func_00460C9C, %function
func_00460C9C:
.Lfunc_00460C9C_0:
	add	r0, r0, #20480
.Lfunc_00460C9C_4:
	mov	r1, #0
.Lfunc_00460C9C_8:
	str	r1, [r0, #476]
.Lfunc_00460C9C_c:
	str	r1, [r0, #480]
.Lfunc_00460C9C_10:
	str	r1, [r0, #484]
.Lfunc_00460C9C_14:
	str	r1, [r0, #488]
.Lfunc_00460C9C_18:
	str	r1, [r0, #492]
.Lfunc_00460C9C_1c:
	str	r1, [r0, #496]
.Lfunc_00460C9C_20:
	str	r1, [r0, #500]
.Lfunc_00460C9C_24:
	str	r1, [r0, #504]
.Lfunc_00460C9C_28:
	str	r1, [r0, #508]
.Lfunc_00460C9C_2c:
	str	r1, [r0, #512]
.Lfunc_00460C9C_30:
	bx	lr
.size func_00460C9C, .-func_00460C9C

.section .text.func_0047BEC0,"ax",%progbits
.balign 4
.global func_0047BEC0
.type func_0047BEC0, %function
func_0047BEC0:
.Lfunc_0047BEC0_0:
	ldrsb	r0, [r0, #10]
.Lfunc_0047BEC0_4:
	cmp	r0, #0
.Lfunc_0047BEC0_8:
	cmpne	r0, #1
.Lfunc_0047BEC0_c:
	beq	.Lfunc_0047BEC0_2c
.Lfunc_0047BEC0_10:
	cmp	r0, #2
.Lfunc_0047BEC0_14:
	cmpne	r0, #5
.Lfunc_0047BEC0_18:
	beq	.Lfunc_0047BEC0_2c
.Lfunc_0047BEC0_1c:
	cmp	r0, #6
.Lfunc_0047BEC0_20:
	cmpne	r0, #7
.Lfunc_0047BEC0_24:
	movne	r0, #0
.Lfunc_0047BEC0_28:
	bne	.Lfunc_0047BEC0_30
.Lfunc_0047BEC0_2c:
	mov	r0, #1
.Lfunc_0047BEC0_30:
	bx	lr
.size func_0047BEC0, .-func_0047BEC0

.section .text.func_004BE764,"ax",%progbits
.balign 4
.global func_004BE764
.type func_004BE764, %function
func_004BE764:
.Lfunc_004BE764_0:
	ldr	r1, [r0, #52]
.Lfunc_004BE764_4:
	ldr	r0, [r0, #44]
.Lfunc_004BE764_8:
	mov	r2, #12
.Lfunc_004BE764_c:
	lsl	ip, r0, #28
.Lfunc_004BE764_10:
	lsl	r3, r0, #30
.Lfunc_004BE764_14:
	and	r0, r2, r0, lsr #2
.Lfunc_004BE764_18:
	lsr	r2, ip, #30
.Lfunc_004BE764_1c:
	lsr	r3, r3, #25
.Lfunc_004BE764_20:
	add	r2, r2, r2, lsl #2
.Lfunc_004BE764_24:
	add	r2, r3, r2, lsl #2
.Lfunc_004BE764_28:
	add	r0, r0, r2
.Lfunc_004BE764_2c:
	add	r0, r0, r1
.Lfunc_004BE764_30:
	bx	lr
.size func_004BE764, .-func_004BE764

.section .text.func_0010E14C,"ax",%progbits
.balign 4
.global func_0010E14C
.type func_0010E14C, %function
func_0010E14C:
.Lfunc_0010E14C_0:
	ldrb	r2, [r0, #28]
.Lfunc_0010E14C_4:
	cmp	r2, #0
.Lfunc_0010E14C_8:
	ldreq	r0, [r0, #52]
.Lfunc_0010E14C_c:
	beq	.Lfunc_0010E14C_20
.Lfunc_0010E14C_10:
	ldrb	r2, [r0, #29]
.Lfunc_0010E14C_14:
	cmp	r2, #0
.Lfunc_0010E14C_18:
	ldreq	r0, [r0, #68]
.Lfunc_0010E14C_1c:
	ldrne	r0, [r0, #48]
.Lfunc_0010E14C_20:
	cmp	r1, #2
.Lfunc_0010E14C_24:
	addcc	r0, r0, r1, lsl #4
.Lfunc_0010E14C_28:
	ldr	r0, [r0]
.Lfunc_0010E14C_2c:
	bx	lr
.size func_0010E14C, .-func_0010E14C

.section .text.func_001134A0,"ax",%progbits
.balign 4
.global func_001134A0
.type func_001134A0, %function
func_001134A0:
.Lfunc_001134A0_0:
	ldrb	r2, [r0, #5]
.Lfunc_001134A0_4:
	mov	r1, #0
.Lfunc_001134A0_8:
	str	r1, [r0]
.Lfunc_001134A0_c:
	bic	r2, r2, #3
.Lfunc_001134A0_10:
	strb	r1, [r0, #4]
.Lfunc_001134A0_14:
	mov	ip, #1
.Lfunc_001134A0_18:
	strb	r2, [r0, #5]
.Lfunc_001134A0_1c:
	mvn	r3, #0
.Lfunc_001134A0_20:
	strh	ip, [r0, #6]
.Lfunc_001134A0_24:
	str	r3, [r0, #8]
.Lfunc_001134A0_28:
	strh	r1, [r0, #12]
.Lfunc_001134A0_2c:
	bx	lr
.size func_001134A0, .-func_001134A0

.section .text.func_0014AF14,"ax",%progbits
.balign 4
.global func_0014AF14
.type func_0014AF14, %function
func_0014AF14:
.Lfunc_0014AF14_0:
	mov	r1, #0
.Lfunc_0014AF14_4:
	str	r1, [r0, #12]
.Lfunc_0014AF14_8:
	strb	r1, [r0, #20]
.Lfunc_0014AF14_c:
	strb	r1, [r0, #21]
.Lfunc_0014AF14_10:
	strb	r1, [r0, #22]
.Lfunc_0014AF14_14:
	strb	r1, [r0, #23]
.Lfunc_0014AF14_18:
	strh	r1, [r0, #32]
.Lfunc_0014AF14_1c:
	str	r1, [r0, #88]
.Lfunc_0014AF14_20:
	str	r1, [r0, #92]
.Lfunc_0014AF14_24:
	str	r1, [r0]
.Lfunc_0014AF14_28:
	str	r1, [r0, #4]
.Lfunc_0014AF14_2c:
	bx	lr
.size func_0014AF14, .-func_0014AF14

.section .text.func_00177298,"ax",%progbits
.balign 4
.global func_00177298
.type func_00177298, %function
func_00177298:
.Lfunc_00177298_0:
	push	{r4, lr}
.Lfunc_00177298_4:
	cmp	r1, #6
.Lfunc_00177298_8:
	mov	r4, r0
.Lfunc_00177298_c:
	addcc	r0, r0, r1
.Lfunc_00177298_10:
	ldrbcc	r0, [r0, #4]
.Lfunc_00177298_14:
	bcc	.Lfunc_00177298_2c
.Lfunc_00177298_18:
	mov	r2, #0
.Lfunc_00177298_1c:
	mov	r1, r2
.Lfunc_00177298_20:
	mov	r0, r2
.Lfunc_00177298_24:
	mov	r0, r0
.Lfunc_00177298_28:
	ldrb	r0, [r4, #4]
.Lfunc_00177298_2c:
	pop	{r4, pc}
.size func_00177298, .-func_00177298

.section .text.func_001CBF1C,"ax",%progbits
.balign 4
.global func_001CBF1C
.type func_001CBF1C, %function
func_001CBF1C:
.Lfunc_001CBF1C_0:
	ldr	r2, [r0, #8]
.Lfunc_001CBF1C_4:
	cmp	r2, r1, lsr #5
.Lfunc_001CBF1C_8:
	movls	r0, #0
.Lfunc_001CBF1C_c:
	bls	.Lfunc_001CBF1C_2c
.Lfunc_001CBF1C_10:
	ldr	r0, [r0, #4]
.Lfunc_001CBF1C_14:
	lsr	r2, r1, #5
.Lfunc_001CBF1C_18:
	and	r1, r1, #31
.Lfunc_001CBF1C_1c:
	mov	r3, #1
.Lfunc_001CBF1C_20:
	ldr	r0, [r0, r2, lsl #2]
.Lfunc_001CBF1C_24:
	ands	r0, r0, r3, lsl r1
.Lfunc_001CBF1C_28:
	movne	r0, #1
.Lfunc_001CBF1C_2c:
	bx	lr
.size func_001CBF1C, .-func_001CBF1C

.section .text.func_001F9244,"ax",%progbits
.balign 4
.global func_001F9244
.type func_001F9244, %function
func_001F9244:
.Lfunc_001F9244_0:
	mov	r1, #0
.Lfunc_001F9244_4:
	mvn	r3, #0
.Lfunc_001F9244_8:
	stm	r0, {r1, r3}
.Lfunc_001F9244_c:
	mov	r2, #3
.Lfunc_001F9244_10:
	strb	r1, [r0, #12]
.Lfunc_001F9244_14:
	str	r1, [r0, #148]
.Lfunc_001F9244_18:
	str	r1, [r0, #156]
.Lfunc_001F9244_1c:
	strb	r2, [r0, #160]
.Lfunc_001F9244_20:
	str	r1, [r0, #164]
.Lfunc_001F9244_24:
	str	r1, [r0, #168]
.Lfunc_001F9244_28:
	str	r1, [r0, #188]
.Lfunc_001F9244_2c:
	bx	lr
.size func_001F9244, .-func_001F9244

.section .text.func_002AFFDC,"ax",%progbits
.balign 4
.global func_002AFFDC
.type func_002AFFDC, %function
func_002AFFDC:
.Lfunc_002AFFDC_0:
	mov	r1, #0
.Lfunc_002AFFDC_4:
	str	r1, [r0, #8]
.Lfunc_002AFFDC_8:
	str	r1, [r0, #12]
.Lfunc_002AFFDC_c:
	strh	r1, [r0, #16]
.Lfunc_002AFFDC_10:
	strh	r1, [r0, #18]
.Lfunc_002AFFDC_14:
	mov	r2, #1
.Lfunc_002AFFDC_18:
	str	r1, [r0, #24]
.Lfunc_002AFFDC_1c:
	str	r2, [r0, #20]
.Lfunc_002AFFDC_20:
	str	r1, [r0, #28]
.Lfunc_002AFFDC_24:
	str	r1, [r0, #32]
.Lfunc_002AFFDC_28:
	str	r1, [r0, #4]
.Lfunc_002AFFDC_2c:
	bx	lr
.size func_002AFFDC, .-func_002AFFDC

.section .text.func_00337878,"ax",%progbits
.balign 4
.global func_00337878
.type func_00337878, %function
func_00337878:
.Lfunc_00337878_0:
	ldr	r2, [r0, #60]
.Lfunc_00337878_4:
	mov	ip, #384
.Lfunc_00337878_8:
	bics	ip, ip, r1
.Lfunc_00337878_c:
	bic	r3, r2, #2016
.Lfunc_00337878_10:
	bic	r2, r1, #96
.Lfunc_00337878_14:
	orreq	r2, r2, #64
.Lfunc_00337878_18:
	mov	ip, #576
.Lfunc_00337878_1c:
	bics	r1, ip, r1
.Lfunc_00337878_20:
	orreq	r2, r2, #32
.Lfunc_00337878_24:
	orr	r1, r3, r2
.Lfunc_00337878_28:
	str	r1, [r0, #60]
.Lfunc_00337878_2c:
	bx	lr
.size func_00337878, .-func_00337878

.section .text.func_0034ABEC,"ax",%progbits
.balign 4
.global func_0034ABEC
.type func_0034ABEC, %function
func_0034ABEC:
.Lfunc_0034ABEC_0:
	ldr	r2, [r0, #24]
.Lfunc_0034ABEC_4:
	cmp	r2, #0
.Lfunc_0034ABEC_8:
	mov	r2, #0
.Lfunc_0034ABEC_c:
	bls	.Lfunc_0034ABEC_2c
.Lfunc_0034ABEC_10:
	ldr	r3, [r0, #16]
.Lfunc_0034ABEC_14:
	ldr	r3, [r3, r2, lsl #2]
.Lfunc_0034ABEC_18:
	add	r2, r2, #1
.Lfunc_0034ABEC_1c:
	strb	r1, [r3, #92]
.Lfunc_0034ABEC_20:
	ldr	r3, [r0, #24]
.Lfunc_0034ABEC_24:
	cmp	r3, r2
.Lfunc_0034ABEC_28:
	bhi	.Lfunc_0034ABEC_10
.Lfunc_0034ABEC_2c:
	bx	lr
.size func_0034ABEC, .-func_0034ABEC

.section .text.func_00398928,"ax",%progbits
.balign 4
.global func_00398928
.type func_00398928, %function
func_00398928:
.Lfunc_00398928_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398928_4:
	ldr	r0, [r0, #108]
.Lfunc_00398928_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00398928_c:
	cmp	r2, #0
.Lfunc_00398928_10:
	add	r0, r0, r1, lsl #2
.Lfunc_00398928_14:
	movne	r1, #1
.Lfunc_00398928_18:
	moveq	r1, #0
.Lfunc_00398928_1c:
	strb	r1, [r0, #232]
.Lfunc_00398928_20:
	ldr	r1, [r0, #228]
.Lfunc_00398928_24:
	orr	r1, r1, #1
.Lfunc_00398928_28:
	str	r1, [r0, #228]
.Lfunc_00398928_2c:
	bx	lr
.size func_00398928, .-func_00398928

.section .text.func_00398B2C,"ax",%progbits
.balign 4
.global func_00398B2C
.type func_00398B2C, %function
func_00398B2C:
.Lfunc_00398B2C_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398B2C_4:
	ldr	r0, [r0, #108]
.Lfunc_00398B2C_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00398B2C_c:
	cmp	r2, #0
.Lfunc_00398B2C_10:
	add	r0, r0, r1, lsl #2
.Lfunc_00398B2C_14:
	movne	r1, #1
.Lfunc_00398B2C_18:
	moveq	r1, #0
.Lfunc_00398B2C_1c:
	strb	r1, [r0, #220]
.Lfunc_00398B2C_20:
	ldr	r1, [r0, #216]
.Lfunc_00398B2C_24:
	orr	r1, r1, #1
.Lfunc_00398B2C_28:
	str	r1, [r0, #216]
.Lfunc_00398B2C_2c:
	bx	lr
.size func_00398B2C, .-func_00398B2C

.section .text.func_00399FC8,"ax",%progbits
.balign 4
.global func_00399FC8
.type func_00399FC8, %function
func_00399FC8:
.Lfunc_00399FC8_0:
	add	ip, r1, r1, lsl #4
.Lfunc_00399FC8_4:
	ldr	r0, [r0, #48]
.Lfunc_00399FC8_8:
	add	r1, r2, r2, lsl #1
.Lfunc_00399FC8_c:
	add	r2, ip, ip, lsl #2
.Lfunc_00399FC8_10:
	add	r0, r0, r2, lsl #2
.Lfunc_00399FC8_14:
	add	r0, r0, #84
.Lfunc_00399FC8_18:
	add	r0, r0, r1, lsl #3
.Lfunc_00399FC8_1c:
	strb	r3, [r0, #151]
.Lfunc_00399FC8_20:
	ldrb	r1, [r0, #148]
.Lfunc_00399FC8_24:
	orr	r1, r1, #1
.Lfunc_00399FC8_28:
	strb	r1, [r0, #148]
.Lfunc_00399FC8_2c:
	bx	lr
.size func_00399FC8, .-func_00399FC8

.section .text.func_003BCE80,"ax",%progbits
.balign 4
.global func_003BCE80
.type func_003BCE80, %function
func_003BCE80:
.Lfunc_003BCE80_0:
	ldr	r1, [r0]
.Lfunc_003BCE80_4:
	cmp	r1, #0
.Lfunc_003BCE80_8:
	ldrne	r2, [r0, #4]
.Lfunc_003BCE80_c:
	strne	r2, [r1, #4]
.Lfunc_003BCE80_10:
	ldr	r1, [r0, #4]
.Lfunc_003BCE80_14:
	cmp	r1, #0
.Lfunc_003BCE80_18:
	ldrne	r2, [r0]
.Lfunc_003BCE80_1c:
	strne	r2, [r1]
.Lfunc_003BCE80_20:
	mov	r1, #0
.Lfunc_003BCE80_24:
	str	r1, [r0, #4]
.Lfunc_003BCE80_28:
	str	r1, [r0]
.Lfunc_003BCE80_2c:
	bx	lr
.size func_003BCE80, .-func_003BCE80

.section .text.func_003FF134,"ax",%progbits
.balign 4
.global func_003FF134
.type func_003FF134, %function
func_003FF134:
.Lfunc_003FF134_0:
	push	{r4, r5, r6, lr}
.Lfunc_003FF134_4:
	mov	r4, r0
.Lfunc_003FF134_8:
	ldr	r0, [r0, #72]
.Lfunc_003FF134_c:
	mov	r5, r1
.Lfunc_003FF134_10:
	cmp	r0, #2000
.Lfunc_003FF134_14:
	beq	.Lfunc_003FF134_28
.Lfunc_003FF134_18:
	mov	r2, #0
.Lfunc_003FF134_1c:
	mov	r1, r2
.Lfunc_003FF134_20:
	mov	r0, r2
.Lfunc_003FF134_24:
	mov	r0, r0
.Lfunc_003FF134_28:
	str	r5, [r4, #72]
.Lfunc_003FF134_2c:
	pop	{r4, r5, r6, pc}
.size func_003FF134, .-func_003FF134

.section .text.func_0044AACC,"ax",%progbits
.balign 4
.global func_0044AACC
.type func_0044AACC, %function
func_0044AACC:
.Lfunc_0044AACC_0:
	push	{r4, lr}
.Lfunc_0044AACC_4:
	mov	r4, r0
.Lfunc_0044AACC_8:
	ldr	r0, [r0, #20]
.Lfunc_0044AACC_c:
	cmp	r0, #0
.Lfunc_0044AACC_10:
	bne	.Lfunc_0044AACC_24
.Lfunc_0044AACC_14:
	mov	r2, #0
.Lfunc_0044AACC_18:
	mov	r1, r2
.Lfunc_0044AACC_1c:
	mov	r0, r2
.Lfunc_0044AACC_20:
	mov	r0, r0
.Lfunc_0044AACC_24:
	ldr	r0, [r4, #20]
.Lfunc_0044AACC_28:
	ldr	r0, [r0, #40]
.Lfunc_0044AACC_2c:
	pop	{r4, pc}
.size func_0044AACC, .-func_0044AACC

.section .text.func_0045A438,"ax",%progbits
.balign 4
.global func_0045A438
.type func_0045A438, %function
func_0045A438:
.Lfunc_0045A438_0:
	vmov	s0, r3
.Lfunc_0045A438_4:
	add	r0, r0, r1, lsl #4
.Lfunc_0045A438_8:
	mov	r1, #0
.Lfunc_0045A438_c:
	strh	r1, [r0, #6]
.Lfunc_0045A438_10:
	strh	r1, [r0, #8]
.Lfunc_0045A438_14:
	strb	r1, [r0, #16]
.Lfunc_0045A438_18:
	vcvt.f32.u32	s0, s0
.Lfunc_0045A438_1c:
	mov	r1, #1
.Lfunc_0045A438_20:
	strh	r2, [r0, #10]
.Lfunc_0045A438_24:
	strb	r1, [r0, #4]!
.Lfunc_0045A438_28:
	vstr	s0, [r0, #8]
.Lfunc_0045A438_2c:
	bx	lr
.size func_0045A438, .-func_0045A438
