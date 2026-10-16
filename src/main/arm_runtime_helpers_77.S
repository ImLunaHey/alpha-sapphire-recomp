.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001752E8,"ax",%progbits
.balign 4
.global func_001752E8
.type func_001752E8, %function
func_001752E8:
.Lfunc_001752E8_0:
	ldrb	r2, [r0, #12]
.Lfunc_001752E8_4:
	mov	r1, #0
.Lfunc_001752E8_8:
	mov	r3, r1
.Lfunc_001752E8_c:
	cmp	r2, #0
.Lfunc_001752E8_10:
	beq	.Lfunc_001752E8_4c
.Lfunc_001752E8_14:
	ldr	r2, [r0, #4]
.Lfunc_001752E8_18:
	ldr	r2, [r2]
.Lfunc_001752E8_1c:
	cmp	r2, #0
.Lfunc_001752E8_20:
	bls	.Lfunc_001752E8_4c
.Lfunc_001752E8_24:
	ldr	ip, [r0, #8]
.Lfunc_001752E8_28:
	mov	r2, r3
.Lfunc_001752E8_2c:
	str	r3, [ip, r1, lsl #2]
.Lfunc_001752E8_30:
	ldrb	ip, [r0, #12]
.Lfunc_001752E8_34:
	add	r1, r1, #1
.Lfunc_001752E8_38:
	cmp	ip, #0
.Lfunc_001752E8_3c:
	ldrne	r2, [r0, #4]
.Lfunc_001752E8_40:
	ldrne	r2, [r2]
.Lfunc_001752E8_44:
	cmp	r2, r1
.Lfunc_001752E8_48:
	bhi	.Lfunc_001752E8_24
.Lfunc_001752E8_4c:
	bx	lr
.size func_001752E8, .-func_001752E8

.section .text.func_004BCAAC,"ax",%progbits
.balign 4
.global func_004BCAAC
.type func_004BCAAC, %function
func_004BCAAC:
.Lfunc_004BCAAC_0:
	mov	r2, r0
.Lfunc_004BCAAC_4:
	movs	r0, r1
.Lfunc_004BCAAC_8:
	ldr	r1, [r2, #24]
.Lfunc_004BCAAC_c:
	beq	.Lfunc_004BCAAC_40
.Lfunc_004BCAAC_10:
	ldrh	r2, [r2, #28]
.Lfunc_004BCAAC_14:
	add	r1, r1, r2, lsl #4
.Lfunc_004BCAAC_18:
	cmp	r1, r0
.Lfunc_004BCAAC_1c:
	bls	.Lfunc_004BCAAC_38
.Lfunc_004BCAAC_20:
	ldr	r2, [r0, #8]
.Lfunc_004BCAAC_24:
	cmp	r2, #0
.Lfunc_004BCAAC_28:
	beq	.Lfunc_004BCAAC_3c
.Lfunc_004BCAAC_2c:
	add	r0, r0, #16
.Lfunc_004BCAAC_30:
	cmp	r1, r0
.Lfunc_004BCAAC_34:
	bhi	.Lfunc_004BCAAC_20
.Lfunc_004BCAAC_38:
	mov	r0, #0
.Lfunc_004BCAAC_3c:
	bx	lr
.Lfunc_004BCAAC_40:
	cmp	r1, #0
.Lfunc_004BCAAC_44:
	movne	r0, r1
.Lfunc_004BCAAC_48:
	bne	.Lfunc_004BCAAC_10
.Lfunc_004BCAAC_4c:
	b	.Lfunc_004BCAAC_38
.size func_004BCAAC, .-func_004BCAAC

.section .text.func_001F9778,"ax",%progbits
.balign 4
.global func_001F9778
.type func_001F9778, %function
func_001F9778:
.Lfunc_001F9778_0:
	tst	r1, #15
.Lfunc_001F9778_4:
	beq	.Lfunc_001F9778_48
.Lfunc_001F9778_8:
	lsl	r1, r1, #28
.Lfunc_001F9778_c:
	lsr	r1, r1, #30
.Lfunc_001F9778_10:
	rsb	ip, r1, #4
.Lfunc_001F9778_14:
	cmp	ip, #0
.Lfunc_001F9778_18:
	ble	.Lfunc_001F9778_48
.Lfunc_001F9778_1c:
	sub	r1, r0, #4
.Lfunc_001F9778_20:
	tst	ip, #1
.Lfunc_001F9778_24:
	mov	r3, #0
.Lfunc_001F9778_28:
	strne	r3, [r1, #4]!
.Lfunc_001F9778_2c:
	asrs	r2, ip, #1
.Lfunc_001F9778_30:
	beq	.Lfunc_001F9778_44
.Lfunc_001F9778_34:
	str	r3, [r1, #4]
.Lfunc_001F9778_38:
	subs	r2, r2, #1
.Lfunc_001F9778_3c:
	str	r3, [r1, #8]!
.Lfunc_001F9778_40:
	bne	.Lfunc_001F9778_34
.Lfunc_001F9778_44:
	add	r0, r0, ip, lsl #2
.Lfunc_001F9778_48:
	bx	lr
.size func_001F9778, .-func_001F9778

.section .text.func_003205DC,"ax",%progbits
.balign 4
.global func_003205DC
.type func_003205DC, %function
func_003205DC:
.Lfunc_003205DC_0:
	cmp	r1, #0
.Lfunc_003205DC_4:
	ldrge	ip, [r0, #12]
.Lfunc_003205DC_8:
	ldr	r3, [r0, #4]
.Lfunc_003205DC_c:
	cmpge	ip, r1
.Lfunc_003205DC_10:
	ble	.Lfunc_003205DC_24
.Lfunc_003205DC_14:
	add	r1, r1, r1, lsl #1
.Lfunc_003205DC_18:
	ldr	ip, [r3, r1, lsl #2]
.Lfunc_003205DC_1c:
	tst	ip, #-16777216
.Lfunc_003205DC_20:
	beq	.Lfunc_003205DC_2c
.Lfunc_003205DC_24:
	mov	r0, #0
.Lfunc_003205DC_28:
	bx	lr
.Lfunc_003205DC_2c:
	str	r0, [r2]
.Lfunc_003205DC_30:
	add	r0, r3, r1, lsl #2
.Lfunc_003205DC_34:
	ldr	r1, [r0, #4]
.Lfunc_003205DC_38:
	str	r1, [r2, #4]
.Lfunc_003205DC_3c:
	ldr	r0, [r0, #8]
.Lfunc_003205DC_40:
	str	r0, [r2, #8]
.Lfunc_003205DC_44:
	mov	r0, #1
.Lfunc_003205DC_48:
	bx	lr
.size func_003205DC, .-func_003205DC

.section .text.func_001816B0,"ax",%progbits
.balign 4
.global func_001816B0
.type func_001816B0, %function
func_001816B0:
.Lfunc_001816B0_0:
	mov	r3, #0
.Lfunc_001816B0_4:
	and	r2, r2, #255
.Lfunc_001816B0_8:
	b	.Lfunc_001816B0_30
.Lfunc_001816B0_c:
	tst	r1, #1
.Lfunc_001816B0_10:
	beq	.Lfunc_001816B0_28
.Lfunc_001816B0_14:
	add	ip, r3, r3, lsl #3
.Lfunc_001816B0_18:
	add	ip, r0, ip, lsl #2
.Lfunc_001816B0_1c:
	add	ip, ip, #6912
.Lfunc_001816B0_20:
	add	ip, ip, #17
.Lfunc_001816B0_24:
	strb	r2, [ip]
.Lfunc_001816B0_28:
	add	r3, r3, #1
.Lfunc_001816B0_2c:
	lsr	r1, r1, #1
.Lfunc_001816B0_30:
	ldr	ip, [r0, #256]
.Lfunc_001816B0_34:
	cmp	ip, r3
.Lfunc_001816B0_38:
	bls	.Lfunc_001816B0_44
.Lfunc_001816B0_3c:
	cmp	r1, #0
.Lfunc_001816B0_40:
	bne	.Lfunc_001816B0_c
.Lfunc_001816B0_44:
	bx	lr
.size func_001816B0, .-func_001816B0

.section .text.func_002B7F3C,"ax",%progbits
.balign 4
.global func_002B7F3C
.type func_002B7F3C, %function
func_002B7F3C:
.Lfunc_002B7F3C_0:
	mov	r3, #0
.Lfunc_002B7F3C_4:
	str	r3, [r0]
.Lfunc_002B7F3C_8:
	ldr	r3, [r1, #4]
.Lfunc_002B7F3C_c:
	cmp	r3, r1
.Lfunc_002B7F3C_10:
	str	r3, [r0]
.Lfunc_002B7F3C_14:
	bxeq	lr
.Lfunc_002B7F3C_18:
	push	{r4}
.Lfunc_002B7F3C_1c:
	mov	ip, r3
.Lfunc_002B7F3C_20:
	ldr	r4, [r2]
.Lfunc_002B7F3C_24:
	ldr	r3, [r3, #8]
.Lfunc_002B7F3C_28:
	cmp	r3, r4
.Lfunc_002B7F3C_2c:
	beq	.Lfunc_002B7F3C_40
.Lfunc_002B7F3C_30:
	ldr	r3, [ip, #4]
.Lfunc_002B7F3C_34:
	cmp	r3, r1
.Lfunc_002B7F3C_38:
	str	r3, [r0]
.Lfunc_002B7F3C_3c:
	bne	.Lfunc_002B7F3C_1c
.Lfunc_002B7F3C_40:
	pop	{r4}
.Lfunc_002B7F3C_44:
	bx	lr
.size func_002B7F3C, .-func_002B7F3C

.section .text.func_00428C30,"ax",%progbits
.balign 4
.global func_00428C30
.type func_00428C30, %function
func_00428C30:
.Lfunc_00428C30_0:
	mov	r2, #1
.Lfunc_00428C30_4:
	strb	r2, [r0, #260]
.Lfunc_00428C30_8:
	mov	r2, #0
.Lfunc_00428C30_c:
	add	ip, r0, r2, lsl #3
.Lfunc_00428C30_10:
	add	ip, ip, #128
.Lfunc_00428C30_14:
	ldm	ip, {r3, ip}
.Lfunc_00428C30_18:
	orrs	r3, r3, ip
.Lfunc_00428C30_1c:
	bne	.Lfunc_00428C30_38
.Lfunc_00428C30_20:
	ldr	r3, [r1, #8]
.Lfunc_00428C30_24:
	add	r0, r0, r2, lsl #3
.Lfunc_00428C30_28:
	ldr	r1, [r1, #12]
.Lfunc_00428C30_2c:
	str	r3, [r0, #128]!
.Lfunc_00428C30_30:
	str	r1, [r0, #4]
.Lfunc_00428C30_34:
	bx	lr
.Lfunc_00428C30_38:
	add	r2, r2, #1
.Lfunc_00428C30_3c:
	cmp	r2, #16
.Lfunc_00428C30_40:
	blt	.Lfunc_00428C30_c
.Lfunc_00428C30_44:
	bx	lr
.size func_00428C30, .-func_00428C30

.section .text.func_0045B790,"ax",%progbits
.balign 4
.global func_0045B790
.type func_0045B790, %function
func_0045B790:
.Lfunc_0045B790_0:
	push	{r4, r5, r6, lr}
.Lfunc_0045B790_4:
	cmp	r1, #2
.Lfunc_0045B790_8:
	mov	r5, r0
.Lfunc_0045B790_c:
	mov	r4, r1
.Lfunc_0045B790_10:
	bcc	.Lfunc_0045B790_24
.Lfunc_0045B790_14:
	mov	r2, #0
.Lfunc_0045B790_18:
	mov	r1, r2
.Lfunc_0045B790_1c:
	mov	r0, r2
.Lfunc_0045B790_20:
	mov	r0, r0
.Lfunc_0045B790_24:
	add	r0, r5, r4
.Lfunc_0045B790_28:
	ldrb	r0, [r0, #1212]
.Lfunc_0045B790_2c:
	cmp	r0, #0
.Lfunc_0045B790_30:
	beq	.Lfunc_0045B790_44
.Lfunc_0045B790_34:
	mov	r0, #151
.Lfunc_0045B790_38:
	smulbb	r0, r4, r0
.Lfunc_0045B790_3c:
	add	r0, r5, r0, lsl #2
.Lfunc_0045B790_40:
	add	r0, r0, #4
.Lfunc_0045B790_44:
	pop	{r4, r5, r6, pc}
.size func_0045B790, .-func_0045B790

.section .text.func_002BA490,"ax",%progbits
.balign 4
.global func_002BA490
.type func_002BA490, %function
func_002BA490:
.Lfunc_002BA490_0:
	ldr	r1, [r0, #4]
.Lfunc_002BA490_4:
	cmp	r1, #0
.Lfunc_002BA490_8:
	beq	.Lfunc_002BA490_3c
.Lfunc_002BA490_c:
	ldr	r2, [r1, #4]
.Lfunc_002BA490_10:
	add	r2, r2, r1
.Lfunc_002BA490_14:
	ldr	r1, [r0, #8]
.Lfunc_002BA490_18:
	cmp	r2, r1
.Lfunc_002BA490_1c:
	bls	.Lfunc_002BA490_3c
.Lfunc_002BA490_20:
	cmp	r1, #0
.Lfunc_002BA490_24:
	beq	.Lfunc_002BA490_3c
.Lfunc_002BA490_28:
	ldr	r2, [r1]
.Lfunc_002BA490_2c:
	add	r1, r1, r2
.Lfunc_002BA490_30:
	str	r1, [r0, #8]
.Lfunc_002BA490_34:
	mov	r0, r1
.Lfunc_002BA490_38:
	bx	lr
.Lfunc_002BA490_3c:
	mov	r0, #0
.Lfunc_002BA490_40:
	bx	lr
.size func_002BA490, .-func_002BA490

.section .text.func_0014DA1C,"ax",%progbits
.balign 4
.global func_0014DA1C
.type func_0014DA1C, %function
func_0014DA1C:
.Lfunc_0014DA1C_0:
	ldr	r0, [r0, #76]
.Lfunc_0014DA1C_4:
	cmp	r0, #0
.Lfunc_0014DA1C_8:
	ldrne	r0, [r0, #16]
.Lfunc_0014DA1C_c:
	cmpne	r0, #0
.Lfunc_0014DA1C_10:
	beq	.Lfunc_0014DA1C_3c
.Lfunc_0014DA1C_14:
	ldr	r3, [r0, #36]
.Lfunc_0014DA1C_18:
	cmp	r3, r2
.Lfunc_0014DA1C_1c:
	ldrcs	r3, [r0, #52]
.Lfunc_0014DA1C_20:
	cmpcs	r3, r1
.Lfunc_0014DA1C_24:
	bls	.Lfunc_0014DA1C_3c
.Lfunc_0014DA1C_28:
	ldr	r0, [r0, #56]
.Lfunc_0014DA1C_2c:
	add	r1, r1, r1, lsl #1
.Lfunc_0014DA1C_30:
	mov	r3, #8
.Lfunc_0014DA1C_34:
	add	r1, r3, r1, lsl #3
.Lfunc_0014DA1C_38:
	str	r2, [r0, r1]
.Lfunc_0014DA1C_3c:
	bx	lr
.size func_0014DA1C, .-func_0014DA1C

.section .text.func_00152B84,"ax",%progbits
.balign 4
.global func_00152B84
.type func_00152B84, %function
func_00152B84:
.Lfunc_00152B84_0:
	ldr	r0, [r0, #8]
.Lfunc_00152B84_4:
	cmp	r0, #0
.Lfunc_00152B84_8:
	beq	.Lfunc_00152B84_34
.Lfunc_00152B84_c:
	ldr	r3, [r0]
.Lfunc_00152B84_10:
	cmp	r3, r2
.Lfunc_00152B84_14:
	bls	.Lfunc_00152B84_38
.Lfunc_00152B84_18:
	add	r2, r0, r2, lsl #3
.Lfunc_00152B84_1c:
	ldr	r2, [r2, #8]
.Lfunc_00152B84_20:
	adds	r0, r0, r2
.Lfunc_00152B84_24:
	beq	.Lfunc_00152B84_38
.Lfunc_00152B84_28:
	ldm	r0, {r0, r2}
.Lfunc_00152B84_2c:
	stm	r1, {r0, r2}
.Lfunc_00152B84_30:
	mov	r0, #1
.Lfunc_00152B84_34:
	bx	lr
.Lfunc_00152B84_38:
	mov	r0, #0
.Lfunc_00152B84_3c:
	bx	lr
.size func_00152B84, .-func_00152B84

.section .text.func_0019CCF0,"ax",%progbits
.balign 4
.global func_0019CCF0
.type func_0019CCF0, %function
func_0019CCF0:
.Lfunc_0019CCF0_0:
	push	{r4, r5, r6, r7, lr}
.Lfunc_0019CCF0_4:
	mov	r7, r0
.Lfunc_0019CCF0_8:
	subs	r3, r3, #1
.Lfunc_0019CCF0_c:
	mov	r0, #0
.Lfunc_0019CCF0_10:
	poplt	{r4, r5, r6, r7, pc}
.Lfunc_0019CCF0_14:
	mov	lr, #0
.Lfunc_0019CCF0_18:
	ldr	r5, [r2], #4
.Lfunc_0019CCF0_1c:
	ldr	r6, [r1], #4
.Lfunc_0019CCF0_20:
	adds	r5, r5, r0
.Lfunc_0019CCF0_24:
	adc	r0, lr, #0
.Lfunc_0019CCF0_28:
	subs	r6, r6, r5
.Lfunc_0019CCF0_2c:
	movcc	r0, #1
.Lfunc_0019CCF0_30:
	subs	r3, r3, #1
.Lfunc_0019CCF0_34:
	str	r6, [r7], #4
.Lfunc_0019CCF0_38:
	bge	.Lfunc_0019CCF0_18
.Lfunc_0019CCF0_3c:
	pop	{r4, r5, r6, r7, pc}
.size func_0019CCF0, .-func_0019CCF0

.section .text.func_002BD8FC,"ax",%progbits
.balign 4
.global func_002BD8FC
.type func_002BD8FC, %function
func_002BD8FC:
.Lfunc_002BD8FC_0:
	mov	r3, #0
.Lfunc_002BD8FC_4:
	mov	r1, r3
.Lfunc_002BD8FC_8:
	add	r2, r1, r1, lsl #1
.Lfunc_002BD8FC_c:
	add	r2, r0, r2, lsl #3
.Lfunc_002BD8FC_10:
	ldrh	r2, [r2, #64]
.Lfunc_002BD8FC_14:
	cmp	r2, #1
.Lfunc_002BD8FC_18:
	beq	.Lfunc_002BD8FC_30
.Lfunc_002BD8FC_1c:
	add	r1, r1, #1
.Lfunc_002BD8FC_20:
	cmp	r1, #12
.Lfunc_002BD8FC_24:
	blt	.Lfunc_002BD8FC_8
.Lfunc_002BD8FC_28:
	mov	r0, r3
.Lfunc_002BD8FC_2c:
	bx	lr
.Lfunc_002BD8FC_30:
	add	r1, r1, r1, lsl #1
.Lfunc_002BD8FC_34:
	add	r0, r0, r1, lsl #3
.Lfunc_002BD8FC_38:
	add	r3, r0, #56
.Lfunc_002BD8FC_3c:
	b	.Lfunc_002BD8FC_28
.size func_002BD8FC, .-func_002BD8FC

.section .text.func_004C88D0,"ax",%progbits
.balign 4
.global func_004C88D0
.type func_004C88D0, %function
func_004C88D0:
.Lfunc_004C88D0_0:
	ldr	r0, [r0, #4]
.Lfunc_004C88D0_4:
	ldr	r2, [r0, #172]
.Lfunc_004C88D0_8:
	cmp	r2, r1
.Lfunc_004C88D0_c:
	bls	.Lfunc_004C88D0_38
.Lfunc_004C88D0_10:
	ldr	r0, [r0, #168]
.Lfunc_004C88D0_14:
	add	r2, r1, r1, lsl #1
.Lfunc_004C88D0_18:
	add	r1, r2, r1, lsl #3
.Lfunc_004C88D0_1c:
	ldrb	r2, [r0, r1, lsl #2]
.Lfunc_004C88D0_20:
	cmp	r2, #0
.Lfunc_004C88D0_24:
	beq	.Lfunc_004C88D0_38
.Lfunc_004C88D0_28:
	mov	r2, #1
.Lfunc_004C88D0_2c:
	add	r1, r2, r1, lsl #2
.Lfunc_004C88D0_30:
	ldrsb	r0, [r0, r1]
.Lfunc_004C88D0_34:
	bx	lr
.Lfunc_004C88D0_38:
	mov	r0, #0
.Lfunc_004C88D0_3c:
	bx	lr
.size func_004C88D0, .-func_004C88D0

.section .text.func_004BF654,"ax",%progbits
.balign 4
.global func_004BF654
.type func_004BF654, %function
func_004BF654:
.Lfunc_004BF654_0:
	mov	r2, #6
.Lfunc_004BF654_4:
	cmp	r2, r1, lsr #24
.Lfunc_004BF654_8:
	bne	.Lfunc_004BF654_24
.Lfunc_004BF654_c:
	ldr	r2, [r0, #36]
.Lfunc_004BF654_10:
	bic	r1, r1, #-16777216
.Lfunc_004BF654_14:
	add	r0, r0, r2
.Lfunc_004BF654_18:
	ldr	r2, [r0]
.Lfunc_004BF654_1c:
	cmp	r2, r1
.Lfunc_004BF654_20:
	bhi	.Lfunc_004BF654_2c
.Lfunc_004BF654_24:
	mov	r0, #0
.Lfunc_004BF654_28:
	bx	lr
.Lfunc_004BF654_2c:
	add	r1, r0, r1, lsl #3
.Lfunc_004BF654_30:
	ldr	r1, [r1, #8]
.Lfunc_004BF654_34:
	add	r0, r0, r1
.Lfunc_004BF654_38:
	bx	lr
.size func_004BF654, .-func_004BF654

.section .text.func_004C5CC8,"ax",%progbits
.balign 4
.global func_004C5CC8
.type func_004C5CC8, %function
func_004C5CC8:
.Lfunc_004C5CC8_0:
	push	{r4, lr}
.Lfunc_004C5CC8_4:
	ldr	r1, [r0, #20]
.Lfunc_004C5CC8_8:
	cmp	r1, #0
.Lfunc_004C5CC8_c:
	beq	.Lfunc_004C5CC8_24
.Lfunc_004C5CC8_10:
	ldrb	r0, [r0, #17]
.Lfunc_004C5CC8_14:
	cmp	r0, #3
.Lfunc_004C5CC8_18:
	moveq	r0, #1
.Lfunc_004C5CC8_1c:
	movne	r0, #0
.Lfunc_004C5CC8_20:
	pop	{r4, pc}
.Lfunc_004C5CC8_24:
	mov	r2, #0
.Lfunc_004C5CC8_28:
	mov	r1, r2
.Lfunc_004C5CC8_2c:
	mov	r0, r2
.Lfunc_004C5CC8_30:
	mov	r0, r0
.Lfunc_004C5CC8_34:
	mov	r0, #0
.Lfunc_004C5CC8_38:
	pop	{r4, pc}
.size func_004C5CC8, .-func_004C5CC8

.section .text.func_003FFEF0,"ax",%progbits
.balign 4
.global func_003FFEF0
.type func_003FFEF0, %function
func_003FFEF0:
.Lfunc_003FFEF0_0:
	push	{r4, r5, r6, lr}
.Lfunc_003FFEF0_4:
	mov	r4, r0
.Lfunc_003FFEF0_8:
	ldr	r0, [r0, #52]
.Lfunc_003FFEF0_c:
	mov	r5, r1
.Lfunc_003FFEF0_10:
	cmp	r0, #0
.Lfunc_003FFEF0_14:
	bne	.Lfunc_003FFEF0_28
.Lfunc_003FFEF0_18:
	mov	r2, #0
.Lfunc_003FFEF0_1c:
	mov	r1, r2
.Lfunc_003FFEF0_20:
	mov	r0, r2
.Lfunc_003FFEF0_24:
	mov	r0, r0
.Lfunc_003FFEF0_28:
	ldr	r0, [r4, #52]
.Lfunc_003FFEF0_2c:
	ldr	r0, [r0, #144]
.Lfunc_003FFEF0_30:
	strh	r5, [r0, #156]
.Lfunc_003FFEF0_34:
	pop	{r4, r5, r6, pc}
.size func_003FFEF0, .-func_003FFEF0

.section .text.func_003FFF6C,"ax",%progbits
.balign 4
.global func_003FFF6C
.type func_003FFF6C, %function
func_003FFF6C:
.Lfunc_003FFF6C_0:
	push	{r4, r5, r6, lr}
.Lfunc_003FFF6C_4:
	mov	r4, r0
.Lfunc_003FFF6C_8:
	ldr	r0, [r0, #52]
.Lfunc_003FFF6C_c:
	mov	r5, r1
.Lfunc_003FFF6C_10:
	cmp	r0, #0
.Lfunc_003FFF6C_14:
	bne	.Lfunc_003FFF6C_28
.Lfunc_003FFF6C_18:
	mov	r2, #0
.Lfunc_003FFF6C_1c:
	mov	r1, r2
.Lfunc_003FFF6C_20:
	mov	r0, r2
.Lfunc_003FFF6C_24:
	mov	r0, r0
.Lfunc_003FFF6C_28:
	ldr	r0, [r4, #52]
.Lfunc_003FFF6C_2c:
	ldr	r0, [r0, #144]
.Lfunc_003FFF6C_30:
	strh	r5, [r0, #158]
.Lfunc_003FFF6C_34:
	pop	{r4, r5, r6, pc}
.size func_003FFF6C, .-func_003FFF6C

.section .text.func_00403188,"ax",%progbits
.balign 4
.global func_00403188
.type func_00403188, %function
func_00403188:
.Lfunc_00403188_0:
	cmn	r0, #1
.Lfunc_00403188_4:
	lsr	r1, r0, #24
.Lfunc_00403188_8:
	mov	r2, r0
.Lfunc_00403188_c:
	cmpne	r1, #255
.Lfunc_00403188_10:
	lslne	r0, r2, #8
.Lfunc_00403188_14:
	push	{r4, lr}
.Lfunc_00403188_18:
	lsrne	r0, r0, #25
.Lfunc_00403188_1c:
	bne	.Lfunc_00403188_34
.Lfunc_00403188_20:
	mov	r2, #0
.Lfunc_00403188_24:
	mov	r1, r2
.Lfunc_00403188_28:
	mov	r0, r2
.Lfunc_00403188_2c:
	mov	r0, r0
.Lfunc_00403188_30:
	mov	r0, #0
.Lfunc_00403188_34:
	pop	{r4, pc}
.size func_00403188, .-func_00403188

.section .text.func_002B467C,"ax",%progbits
.balign 4
.global func_002B467C
.type func_002B467C, %function
func_002B467C:
.Lfunc_002B467C_0:
	mov	r1, #0
.Lfunc_002B467C_4:
	str	r1, [r0, #8]
.Lfunc_002B467C_8:
	str	r0, [r0]
.Lfunc_002B467C_c:
	add	r2, r0, #12
.Lfunc_002B467C_10:
	str	r1, [r0, #20]
.Lfunc_002B467C_14:
	str	r2, [r0, #12]
.Lfunc_002B467C_18:
	str	r0, [r0, #4]
.Lfunc_002B467C_1c:
	str	r1, [r0, #24]
.Lfunc_002B467C_20:
	str	r2, [r0, #16]
.Lfunc_002B467C_24:
	str	r1, [r0, #28]
.Lfunc_002B467C_28:
	str	r1, [r0, #32]
.Lfunc_002B467C_2c:
	strb	r1, [r0, #36]
.Lfunc_002B467C_30:
	bx	lr
.size func_002B467C, .-func_002B467C

.section .text.func_002B807C,"ax",%progbits
.balign 4
.global func_002B807C
.type func_002B807C, %function
func_002B807C:
.Lfunc_002B807C_0:
	ldr	r3, [r0, #4]
.Lfunc_002B807C_4:
	sub	r3, r1, r3
.Lfunc_002B807C_8:
	ldr	r1, [r0]
.Lfunc_002B807C_c:
	lsr	r0, r3, #4
.Lfunc_002B807C_10:
	add	r2, r2, r0
.Lfunc_002B807C_14:
	cmp	r2, r0
.Lfunc_002B807C_18:
	movhi	r3, #0
.Lfunc_002B807C_1c:
	bls	.Lfunc_002B807C_30
.Lfunc_002B807C_20:
	strb	r3, [r1, r0]
.Lfunc_002B807C_24:
	add	r0, r0, #1
.Lfunc_002B807C_28:
	cmp	r2, r0
.Lfunc_002B807C_2c:
	bhi	.Lfunc_002B807C_20
.Lfunc_002B807C_30:
	bx	lr
.size func_002B807C, .-func_002B807C

.section .text.func_002BCF20,"ax",%progbits
.balign 4
.global func_002BCF20
.type func_002BCF20, %function
func_002BCF20:
.Lfunc_002BCF20_0:
	mov	r1, #0
.Lfunc_002BCF20_4:
	add	r2, r0, r1
.Lfunc_002BCF20_8:
	ldrb	r2, [r2, #39]
.Lfunc_002BCF20_c:
	cmp	r2, #1
.Lfunc_002BCF20_10:
	beq	.Lfunc_002BCF20_2c
.Lfunc_002BCF20_14:
	add	r1, r1, #1
.Lfunc_002BCF20_18:
	and	r1, r1, #255
.Lfunc_002BCF20_1c:
	cmp	r1, #12
.Lfunc_002BCF20_20:
	bcc	.Lfunc_002BCF20_4
.Lfunc_002BCF20_24:
	mov	r0, #1
.Lfunc_002BCF20_28:
	bx	lr
.Lfunc_002BCF20_2c:
	mov	r0, #0
.Lfunc_002BCF20_30:
	bx	lr
.size func_002BCF20, .-func_002BCF20

.section .text.func_003369A0,"ax",%progbits
.balign 4
.global func_003369A0
.type func_003369A0, %function
func_003369A0:
.Lfunc_003369A0_0:
	ldr	r3, [r0]
.Lfunc_003369A0_4:
	add	r2, r2, r1
.Lfunc_003369A0_8:
	cmp	r3, #0
.Lfunc_003369A0_c:
	beq	.Lfunc_003369A0_30
.Lfunc_003369A0_10:
	cmp	r1, r3
.Lfunc_003369A0_14:
	cmpls	r3, r2
.Lfunc_003369A0_18:
	ldrcc	ip, [r3]
.Lfunc_003369A0_1c:
	movcs	r0, r3
.Lfunc_003369A0_20:
	strcc	ip, [r0]
.Lfunc_003369A0_24:
	ldr	r3, [r3]
.Lfunc_003369A0_28:
	cmp	r3, #0
.Lfunc_003369A0_2c:
	bne	.Lfunc_003369A0_10
.Lfunc_003369A0_30:
	bx	lr
.size func_003369A0, .-func_003369A0

.section .text.func_00398D10,"ax",%progbits
.balign 4
.global func_00398D10
.type func_00398D10, %function
func_00398D10:
.Lfunc_00398D10_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398D10_4:
	ldr	r0, [r0, #108]
.Lfunc_00398D10_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00398D10_c:
	add	r0, r0, r1, lsl #2
.Lfunc_00398D10_10:
	ldr	r1, [r0, #240]
.Lfunc_00398D10_14:
	bic	r1, r1, #-268435456
.Lfunc_00398D10_18:
	orr	r1, r1, r2, lsl #28
.Lfunc_00398D10_1c:
	orr	r1, r1, #4
.Lfunc_00398D10_20:
	str	r1, [r0, #240]
.Lfunc_00398D10_24:
	ldr	r1, [r0, #244]
.Lfunc_00398D10_28:
	orr	r1, r1, #1
.Lfunc_00398D10_2c:
	str	r1, [r0, #244]
.Lfunc_00398D10_30:
	bx	lr
.size func_00398D10, .-func_00398D10
