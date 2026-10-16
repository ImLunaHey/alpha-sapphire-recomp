.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002B1B2C,"ax",%progbits
.balign 4
.global func_002B1B2C
.type func_002B1B2C, %function
func_002B1B2C:
.Lfunc_002B1B2C_0:
	push	{r0, r1, r2}
.Lfunc_002B1B2C_4:
	cmp	r2, #0
.Lfunc_002B1B2C_8:
	ldr	r1, [r0, #304]
.Lfunc_002B1B2C_c:
	ldr	r2, [r0, #312]
.Lfunc_002B1B2C_10:
	beq	.Lfunc_002B1B2C_5c
.Lfunc_002B1B2C_14:
	cmp	r1, r2
.Lfunc_002B1B2C_18:
	beq	.Lfunc_002B1B2C_3c
.Lfunc_002B1B2C_1c:
	ldr	r2, [sp, #4]
.Lfunc_002B1B2C_20:
	str	r1, [r2, #12]
.Lfunc_002B1B2C_24:
	ldr	r2, [r0, #304]
.Lfunc_002B1B2C_28:
	ldr	r1, [sp, #4]
.Lfunc_002B1B2C_2c:
	str	r1, [r2, #16]
.Lfunc_002B1B2C_30:
	ldr	r1, [sp, #4]
.Lfunc_002B1B2C_34:
	str	r1, [r0, #304]
.Lfunc_002B1B2C_38:
	b	.Lfunc_002B1B2C_48
.Lfunc_002B1B2C_3c:
	ldr	r1, [sp, #4]
.Lfunc_002B1B2C_40:
	str	r1, [r0, #304]
.Lfunc_002B1B2C_44:
	str	r1, [r0, #308]
.Lfunc_002B1B2C_48:
	ldr	r1, [r0, #316]
.Lfunc_002B1B2C_4c:
	add	r1, r1, #1
.Lfunc_002B1B2C_50:
	str	r1, [r0, #316]
.Lfunc_002B1B2C_54:
	add	sp, sp, #12
.Lfunc_002B1B2C_58:
	bx	lr
.Lfunc_002B1B2C_5c:
	cmp	r1, r2
.Lfunc_002B1B2C_60:
	ldreq	r1, [sp, #4]
.Lfunc_002B1B2C_64:
	streq	r1, [r0, #304]
.Lfunc_002B1B2C_68:
	beq	.Lfunc_002B1B2C_88
.Lfunc_002B1B2C_6c:
	ldr	r2, [r0, #308]
.Lfunc_002B1B2C_70:
	ldr	r1, [sp, #4]
.Lfunc_002B1B2C_74:
	str	r1, [r2, #12]
.Lfunc_002B1B2C_78:
	ldr	r2, [sp, #4]
.Lfunc_002B1B2C_7c:
	ldr	r1, [r0, #308]
.Lfunc_002B1B2C_80:
	str	r1, [r2, #16]
.Lfunc_002B1B2C_84:
	ldr	r1, [sp, #4]
.Lfunc_002B1B2C_88:
	str	r1, [r0, #308]
.Lfunc_002B1B2C_8c:
	b	.Lfunc_002B1B2C_48
.size func_002B1B2C, .-func_002B1B2C

.section .text.func_0026C4DC,"ax",%progbits
.balign 4
.global func_0026C4DC
.type func_0026C4DC, %function
func_0026C4DC:
.Lfunc_0026C4DC_0:
	push	{r4, r5}
.Lfunc_0026C4DC_4:
	ldr	r2, [r0, #20]
.Lfunc_0026C4DC_8:
	mov	r5, #0
.Lfunc_0026C4DC_c:
	mov	r3, r2
.Lfunc_0026C4DC_10:
	ldr	r1, [r2, #4]
.Lfunc_0026C4DC_14:
	cmp	r1, #0
.Lfunc_0026C4DC_18:
	ldrhne	ip, [r0, #36]
.Lfunc_0026C4DC_1c:
	beq	.Lfunc_0026C4DC_44
.Lfunc_0026C4DC_20:
	ldrh	r4, [r1, #20]
.Lfunc_0026C4DC_24:
	sub	r4, ip, r4
.Lfunc_0026C4DC_28:
	sxth	r4, r4
.Lfunc_0026C4DC_2c:
	cmp	r4, #0
.Lfunc_0026C4DC_30:
	movle	r3, r1
.Lfunc_0026C4DC_34:
	ldrle	r1, [r1, #8]
.Lfunc_0026C4DC_38:
	ldrgt	r1, [r1, #12]
.Lfunc_0026C4DC_3c:
	cmp	r1, #0
.Lfunc_0026C4DC_40:
	bne	.Lfunc_0026C4DC_20
.Lfunc_0026C4DC_44:
	cmp	r3, r2
.Lfunc_0026C4DC_48:
	beq	.Lfunc_0026C4DC_64
.Lfunc_0026C4DC_4c:
	ldrh	ip, [r0, #36]
.Lfunc_0026C4DC_50:
	ldrh	r1, [r3, #20]
.Lfunc_0026C4DC_54:
	sub	r1, r1, ip
.Lfunc_0026C4DC_58:
	sxth	r1, r1
.Lfunc_0026C4DC_5c:
	cmp	r1, #0
.Lfunc_0026C4DC_60:
	movle	r2, r3
.Lfunc_0026C4DC_64:
	ldr	r1, [r0, #20]
.Lfunc_0026C4DC_68:
	cmp	r2, r1
.Lfunc_0026C4DC_6c:
	beq	.Lfunc_0026C4DC_80
.Lfunc_0026C4DC_70:
	ldrh	r1, [r0, #36]
.Lfunc_0026C4DC_74:
	ldr	r5, [r2, #24]
.Lfunc_0026C4DC_78:
	add	r1, r1, #1
.Lfunc_0026C4DC_7c:
	strh	r1, [r0, #36]
.Lfunc_0026C4DC_80:
	mov	r0, r5
.Lfunc_0026C4DC_84:
	pop	{r4, r5}
.Lfunc_0026C4DC_88:
	bx	lr
.size func_0026C4DC, .-func_0026C4DC

.section .text.func_002B65E4,"ax",%progbits
.balign 4
.global func_002B65E4
.type func_002B65E4, %function
func_002B65E4:
.Lfunc_002B65E4_0:
	push	{r4, r5, r6, r7}
.Lfunc_002B65E4_4:
	mov	r6, #1
.Lfunc_002B65E4_8:
	ldr	r5, [r0, #16]
.Lfunc_002B65E4_c:
	mov	ip, #0
.Lfunc_002B65E4_10:
	cmp	r5, #0
.Lfunc_002B65E4_14:
	bls	.Lfunc_002B65E4_74
.Lfunc_002B65E4_18:
	ldrb	r2, [r1, ip]
.Lfunc_002B65E4_1c:
	cmp	r2, #0
.Lfunc_002B65E4_20:
	beq	.Lfunc_002B65E4_68
.Lfunc_002B65E4_24:
	ldr	r2, [r0, #20]
.Lfunc_002B65E4_28:
	ldr	r2, [r2, ip, lsl #2]
.Lfunc_002B65E4_2c:
	add	r2, r2, #8
.Lfunc_002B65E4_30:
	ldr	r3, [r2, #4]
.Lfunc_002B65E4_34:
	cmp	r3, r2
.Lfunc_002B65E4_38:
	beq	.Lfunc_002B65E4_68
.Lfunc_002B65E4_3c:
	ldrb	r4, [r3, #12]
.Lfunc_002B65E4_40:
	cmp	r4, #1
.Lfunc_002B65E4_44:
	bne	.Lfunc_002B65E4_5c
.Lfunc_002B65E4_48:
	ldr	r4, [r3, #8]
.Lfunc_002B65E4_4c:
	ldr	r4, [r4, #20]
.Lfunc_002B65E4_50:
	ldrb	r7, [r1, r4]
.Lfunc_002B65E4_54:
	cmp	r7, #0
.Lfunc_002B65E4_58:
	beq	.Lfunc_002B65E4_7c
.Lfunc_002B65E4_5c:
	ldr	r3, [r3, #4]
.Lfunc_002B65E4_60:
	cmp	r3, r2
.Lfunc_002B65E4_64:
	bne	.Lfunc_002B65E4_3c
.Lfunc_002B65E4_68:
	add	ip, ip, #1
.Lfunc_002B65E4_6c:
	cmp	r5, ip
.Lfunc_002B65E4_70:
	bhi	.Lfunc_002B65E4_18
.Lfunc_002B65E4_74:
	pop	{r4, r5, r6, r7}
.Lfunc_002B65E4_78:
	bx	lr
.Lfunc_002B65E4_7c:
	strb	r6, [r1, r4]
.Lfunc_002B65E4_80:
	b	.Lfunc_002B65E4_8
.size func_002B65E4, .-func_002B65E4

.section .text.func_0035E578,"ax",%progbits
.balign 4
.global func_0035E578
.type func_0035E578, %function
func_0035E578:
.Lfunc_0035E578_0:
	push	{r4, r5}
.Lfunc_0035E578_4:
	mov	r3, #0
.Lfunc_0035E578_8:
	add	r4, r0, #256
.Lfunc_0035E578_c:
	str	r3, [r2]
.Lfunc_0035E578_10:
	ldrh	ip, [r4, #216]
.Lfunc_0035E578_14:
	cmp	ip, #0
.Lfunc_0035E578_18:
	bls	.Lfunc_0035E578_70
.Lfunc_0035E578_1c:
	add	ip, r3, r3, lsl #2
.Lfunc_0035E578_20:
	add	ip, r0, ip, lsl #2
.Lfunc_0035E578_24:
	add	ip, ip, #72
.Lfunc_0035E578_28:
	ldrb	r5, [ip, #13]
.Lfunc_0035E578_2c:
	cmp	r5, r1
.Lfunc_0035E578_30:
	bne	.Lfunc_0035E578_60
.Lfunc_0035E578_34:
	ldr	r5, [r2]
.Lfunc_0035E578_38:
	add	r5, r5, #1
.Lfunc_0035E578_3c:
	str	r5, [r2]
.Lfunc_0035E578_40:
	ldrb	ip, [ip, #12]
.Lfunc_0035E578_44:
	cmp	ip, #2
.Lfunc_0035E578_48:
	beq	.Lfunc_0035E578_60
.Lfunc_0035E578_4c:
	cmp	ip, #4
.Lfunc_0035E578_50:
	beq	.Lfunc_0035E578_60
.Lfunc_0035E578_54:
	pop	{r4, r5}
.Lfunc_0035E578_58:
	mov	r0, #0
.Lfunc_0035E578_5c:
	bx	lr
.Lfunc_0035E578_60:
	ldrh	ip, [r4, #216]
.Lfunc_0035E578_64:
	add	r3, r3, #1
.Lfunc_0035E578_68:
	cmp	ip, r3
.Lfunc_0035E578_6c:
	bhi	.Lfunc_0035E578_1c
.Lfunc_0035E578_70:
	pop	{r4, r5}
.Lfunc_0035E578_74:
	mov	r0, #1
.Lfunc_0035E578_78:
	bx	lr
.size func_0035E578, .-func_0035E578

.section .text.func_0031AE54,"ax",%progbits
.balign 4
.global func_0031AE54
.type func_0031AE54, %function
func_0031AE54:
.Lfunc_0031AE54_0:
	push	{r4, r5, r6, r7}
.Lfunc_0031AE54_4:
	mov	r3, #12
.Lfunc_0031AE54_8:
	ldr	r5, [r0, #56]
.Lfunc_0031AE54_c:
	mov	ip, #0
.Lfunc_0031AE54_10:
	cmp	r5, #0
.Lfunc_0031AE54_14:
	ble	.Lfunc_0031AE54_5c
.Lfunc_0031AE54_18:
	ldr	r4, [r0, #60]
.Lfunc_0031AE54_1c:
	mov	r6, #0
.Lfunc_0031AE54_20:
	add	r2, r0, #60
.Lfunc_0031AE54_24:
	cmp	r4, #0
.Lfunc_0031AE54_28:
	addne	r2, r2, r4
.Lfunc_0031AE54_2c:
	moveq	r2, r6
.Lfunc_0031AE54_30:
	ldr	r7, [r2, ip, lsl #2]!
.Lfunc_0031AE54_34:
	add	ip, ip, #1
.Lfunc_0031AE54_38:
	cmp	r7, #0
.Lfunc_0031AE54_3c:
	addne	r2, r2, r7
.Lfunc_0031AE54_40:
	moveq	r2, r6
.Lfunc_0031AE54_44:
	ldr	r2, [r2, #8]
.Lfunc_0031AE54_48:
	tst	r2, #1
.Lfunc_0031AE54_4c:
	addne	r3, r3, #6
.Lfunc_0031AE54_50:
	addeq	r3, r3, #4
.Lfunc_0031AE54_54:
	cmp	ip, r5
.Lfunc_0031AE54_58:
	blt	.Lfunc_0031AE54_20
.Lfunc_0031AE54_5c:
	ldr	r0, [r1, #16]
.Lfunc_0031AE54_60:
	pop	{r4, r5, r6, r7}
.Lfunc_0031AE54_64:
	cmp	r0, #0
.Lfunc_0031AE54_68:
	addge	r3, r3, #4
.Lfunc_0031AE54_6c:
	lsl	r0, r3, #2
.Lfunc_0031AE54_70:
	bx	lr
.size func_0031AE54, .-func_0031AE54

.section .text.func_0039897C,"ax",%progbits
.balign 4
.global func_0039897C
.type func_0039897C, %function
func_0039897C:
.Lfunc_0039897C_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_0039897C_4:
	push	{r4}
.Lfunc_0039897C_8:
	ldr	r0, [r0, #108]
.Lfunc_0039897C_c:
	add	r4, r1, r1, lsl #1
.Lfunc_0039897C_10:
	mov	ip, #448
.Lfunc_0039897C_14:
	add	r0, r0, r4, lsl #2
.Lfunc_0039897C_18:
	and	r1, ip, r2, lsl #6
.Lfunc_0039897C_1c:
	ldr	ip, [r0, #240]
.Lfunc_0039897C_20:
	mov	r3, #1
.Lfunc_0039897C_24:
	bic	ip, ip, #448
.Lfunc_0039897C_28:
	orr	r1, r1, ip
.Lfunc_0039897C_2c:
	orr	r1, r1, #2
.Lfunc_0039897C_30:
	str	r1, [r0, #240]
.Lfunc_0039897C_34:
	ldr	r4, [r0, #244]
.Lfunc_0039897C_38:
	lsl	ip, r1, #26
.Lfunc_0039897C_3c:
	cmp	r3, ip, lsr #29
.Lfunc_0039897C_40:
	orr	r3, r4, #1
.Lfunc_0039897C_44:
	str	r3, [r0, #244]
.Lfunc_0039897C_48:
	bne	.Lfunc_0039897C_6c
.Lfunc_0039897C_4c:
	mov	ip, #3584
.Lfunc_0039897C_50:
	and	ip, ip, r2, lsl #9
.Lfunc_0039897C_54:
	bic	r1, r1, #3584
.Lfunc_0039897C_58:
	orr	r1, r1, ip
.Lfunc_0039897C_5c:
	add	r0, r0, #240
.Lfunc_0039897C_60:
	orr	r2, r3, #1
.Lfunc_0039897C_64:
	orr	r1, r1, #2
.Lfunc_0039897C_68:
	stm	r0, {r1, r2}
.Lfunc_0039897C_6c:
	pop	{r4}
.Lfunc_0039897C_70:
	bx	lr
.size func_0039897C, .-func_0039897C

.section .text.func_00399384,"ax",%progbits
.balign 4
.global func_00399384
.type func_00399384, %function
func_00399384:
.Lfunc_00399384_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00399384_4:
	push	{r4}
.Lfunc_00399384_8:
	ldr	r0, [r0, #108]
.Lfunc_00399384_c:
	add	r4, r1, r1, lsl #1
.Lfunc_00399384_10:
	mov	ip, #61440
.Lfunc_00399384_14:
	add	r0, r0, r4, lsl #2
.Lfunc_00399384_18:
	and	r1, ip, r2, lsl #12
.Lfunc_00399384_1c:
	ldr	ip, [r0, #240]
.Lfunc_00399384_20:
	mov	r3, #1
.Lfunc_00399384_24:
	bic	ip, ip, #61440
.Lfunc_00399384_28:
	orr	r1, r1, ip
.Lfunc_00399384_2c:
	orr	r1, r1, #2
.Lfunc_00399384_30:
	str	r1, [r0, #240]
.Lfunc_00399384_34:
	ldr	r4, [r0, #244]
.Lfunc_00399384_38:
	lsl	ip, r1, #26
.Lfunc_00399384_3c:
	cmp	r3, ip, lsr #29
.Lfunc_00399384_40:
	orr	r3, r4, #1
.Lfunc_00399384_44:
	str	r3, [r0, #244]
.Lfunc_00399384_48:
	bne	.Lfunc_00399384_6c
.Lfunc_00399384_4c:
	mov	ip, #983040
.Lfunc_00399384_50:
	and	ip, ip, r2, lsl #16
.Lfunc_00399384_54:
	bic	r1, r1, #983040
.Lfunc_00399384_58:
	orr	r1, r1, ip
.Lfunc_00399384_5c:
	add	r0, r0, #240
.Lfunc_00399384_60:
	orr	r2, r3, #1
.Lfunc_00399384_64:
	orr	r1, r1, #2
.Lfunc_00399384_68:
	stm	r0, {r1, r2}
.Lfunc_00399384_6c:
	pop	{r4}
.Lfunc_00399384_70:
	bx	lr
.size func_00399384, .-func_00399384

.section .text.func_00399944,"ax",%progbits
.balign 4
.global func_00399944
.type func_00399944, %function
func_00399944:
.Lfunc_00399944_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00399944_4:
	push	{r4}
.Lfunc_00399944_8:
	ldr	r0, [r0, #108]
.Lfunc_00399944_c:
	add	r4, r1, r1, lsl #1
.Lfunc_00399944_10:
	mov	ip, #15728640
.Lfunc_00399944_14:
	add	r0, r0, r4, lsl #2
.Lfunc_00399944_18:
	and	r1, ip, r2, lsl #20
.Lfunc_00399944_1c:
	ldr	ip, [r0, #240]
.Lfunc_00399944_20:
	mov	r3, #1
.Lfunc_00399944_24:
	bic	ip, ip, #15728640
.Lfunc_00399944_28:
	orr	r1, r1, ip
.Lfunc_00399944_2c:
	orr	r1, r1, #2
.Lfunc_00399944_30:
	str	r1, [r0, #240]
.Lfunc_00399944_34:
	ldr	r4, [r0, #244]
.Lfunc_00399944_38:
	lsl	ip, r1, #26
.Lfunc_00399944_3c:
	cmp	r3, ip, lsr #29
.Lfunc_00399944_40:
	orr	r3, r4, #1
.Lfunc_00399944_44:
	str	r3, [r0, #244]
.Lfunc_00399944_48:
	bne	.Lfunc_00399944_6c
.Lfunc_00399944_4c:
	mov	ip, #251658240
.Lfunc_00399944_50:
	and	ip, ip, r2, lsl #24
.Lfunc_00399944_54:
	bic	r1, r1, #251658240
.Lfunc_00399944_58:
	orr	r1, r1, ip
.Lfunc_00399944_5c:
	add	r0, r0, #240
.Lfunc_00399944_60:
	orr	r2, r3, #1
.Lfunc_00399944_64:
	orr	r1, r1, #2
.Lfunc_00399944_68:
	stm	r0, {r1, r2}
.Lfunc_00399944_6c:
	pop	{r4}
.Lfunc_00399944_70:
	bx	lr
.size func_00399944, .-func_00399944

.section .text.func_003F9C24,"ax",%progbits
.balign 4
.global func_003F9C24
.type func_003F9C24, %function
func_003F9C24:
.Lfunc_003F9C24_0:
	push	{r4}
.Lfunc_003F9C24_4:
	ldr	r1, [r0, #2228]
.Lfunc_003F9C24_8:
	add	r2, r0, #2048
.Lfunc_003F9C24_c:
	add	r2, r2, #132
.Lfunc_003F9C24_10:
	add	r1, r1, #12288
.Lfunc_003F9C24_14:
	add	r1, r1, #1712
.Lfunc_003F9C24_18:
	mov	ip, #8
.Lfunc_003F9C24_1c:
	ldr	r1, [r1]
.Lfunc_003F9C24_20:
	ldr	r3, [r0, #8]
.Lfunc_003F9C24_24:
	bics	r1, ip, r1
.Lfunc_003F9C24_28:
	ldrbne	r1, [r2, #6]
.Lfunc_003F9C24_2c:
	cmpne	r1, #0
.Lfunc_003F9C24_30:
	orreq	r1, r3, #32768
.Lfunc_003F9C24_34:
	streq	r1, [r0, #8]
.Lfunc_003F9C24_38:
	beq	.Lfunc_003F9C24_6c
.Lfunc_003F9C24_3c:
	ldr	r1, [r0, #328]
.Lfunc_003F9C24_40:
	mov	r2, #1
.Lfunc_003F9C24_44:
	cmn	r1, #1
.Lfunc_003F9C24_48:
	lsl	r4, r1, #20
.Lfunc_003F9C24_4c:
	lsr	ip, r1, #24
.Lfunc_003F9C24_50:
	cmpne	ip, #255
.Lfunc_003F9C24_54:
	lsr	r4, r4, #20
.Lfunc_003F9C24_58:
	movne	r2, r4
.Lfunc_003F9C24_5c:
	tst	r2, #32
.Lfunc_003F9C24_60:
	bicne	r1, r3, #32768
.Lfunc_003F9C24_64:
	orreq	r1, r3, #32768
.Lfunc_003F9C24_68:
	str	r1, [r0, #8]
.Lfunc_003F9C24_6c:
	pop	{r4}
.Lfunc_003F9C24_70:
	bx	lr
.size func_003F9C24, .-func_003F9C24

.section .text.func_00360428,"ax",%progbits
.balign 4
.global func_00360428
.type func_00360428, %function
func_00360428:
.Lfunc_00360428_0:
	add	r3, r0, #256
.Lfunc_00360428_4:
	push	{r4, r5, r6}
.Lfunc_00360428_8:
	mov	r4, r0
.Lfunc_00360428_c:
	ldrh	r5, [r3, #216]
.Lfunc_00360428_10:
	mov	ip, #0
.Lfunc_00360428_14:
	mov	r0, ip
.Lfunc_00360428_18:
	cmp	r5, #0
.Lfunc_00360428_1c:
	bls	.Lfunc_00360428_64
.Lfunc_00360428_20:
	add	r3, r0, r0, lsl #2
.Lfunc_00360428_24:
	add	r3, r4, r3, lsl #2
.Lfunc_00360428_28:
	add	r3, r3, #72
.Lfunc_00360428_2c:
	ldrb	r6, [r3, #13]
.Lfunc_00360428_30:
	cmp	r6, r1
.Lfunc_00360428_34:
	bne	.Lfunc_00360428_4c
.Lfunc_00360428_38:
	ldrb	r3, [r3, #12]
.Lfunc_00360428_3c:
	cmp	r3, #2
.Lfunc_00360428_40:
	beq	.Lfunc_00360428_4c
.Lfunc_00360428_44:
	cmp	r3, #4
.Lfunc_00360428_48:
	addne	ip, ip, #1
.Lfunc_00360428_4c:
	add	r0, r0, #1
.Lfunc_00360428_50:
	cmp	r5, r0
.Lfunc_00360428_54:
	bhi	.Lfunc_00360428_20
.Lfunc_00360428_58:
	cmp	ip, #0
.Lfunc_00360428_5c:
	movne	r0, ip
.Lfunc_00360428_60:
	bne	.Lfunc_00360428_68
.Lfunc_00360428_64:
	mov	r0, r2
.Lfunc_00360428_68:
	pop	{r4, r5, r6}
.Lfunc_00360428_6c:
	bx	lr
.size func_00360428, .-func_00360428

.section .text.func_0035CE6C,"ax",%progbits
.balign 4
.global func_0035CE6C
.type func_0035CE6C, %function
func_0035CE6C:
.Lfunc_0035CE6C_0:
	mov	r3, #6
.Lfunc_0035CE6C_4:
	push	{r4, r5, r6}
.Lfunc_0035CE6C_8:
	add	r4, r3, #764
.Lfunc_0035CE6C_c:
	mov	r2, #0
.Lfunc_0035CE6C_10:
	mov	ip, #1
.Lfunc_0035CE6C_14:
	add	r6, r3, #32768
.Lfunc_0035CE6C_18:
	orr	r5, r4, r3, asr #1
.Lfunc_0035CE6C_1c:
	rsb	r1, r2, r2, lsl #3
.Lfunc_0035CE6C_20:
	subs	r3, r3, #1
.Lfunc_0035CE6C_24:
	add	r1, r1, r1, lsl #1
.Lfunc_0035CE6C_28:
	add	r2, r2, #1
.Lfunc_0035CE6C_2c:
	add	r1, r0, r1, lsl #2
.Lfunc_0035CE6C_30:
	str	ip, [r1, #100]
.Lfunc_0035CE6C_34:
	strb	ip, [r1, #104]
.Lfunc_0035CE6C_38:
	str	r6, [r1, #108]
.Lfunc_0035CE6C_3c:
	strd	r4, [r1, #112]
.Lfunc_0035CE6C_40:
	bne	.Lfunc_0035CE6C_1c
.Lfunc_0035CE6C_44:
	add	r1, r0, #44
.Lfunc_0035CE6C_48:
	ldm	r1, {r1, r2, r3, ip}
.Lfunc_0035CE6C_4c:
	str	r1, [r0, #172]
.Lfunc_0035CE6C_50:
	str	r2, [r0, #256]
.Lfunc_0035CE6C_54:
	str	ip, [r0, #508]
.Lfunc_0035CE6C_58:
	str	r1, [r0, #340]
.Lfunc_0035CE6C_5c:
	str	r3, [r0, #424]
.Lfunc_0035CE6C_60:
	str	r3, [r0, #592]
.Lfunc_0035CE6C_64:
	pop	{r4, r5, r6}
.Lfunc_0035CE6C_68:
	bx	lr
.size func_0035CE6C, .-func_0035CE6C

.section .text.func_003F9FFC,"ax",%progbits
.balign 4
.global func_003F9FFC
.type func_003F9FFC, %function
func_003F9FFC:
.Lfunc_003F9FFC_0:
	ldr	r1, [r0, #2228]
.Lfunc_003F9FFC_4:
	add	r2, r0, #2048
.Lfunc_003F9FFC_8:
	add	r2, r2, #132
.Lfunc_003F9FFC_c:
	add	r1, r1, #12288
.Lfunc_003F9FFC_10:
	add	r1, r1, #1712
.Lfunc_003F9FFC_14:
	mov	r3, #8
.Lfunc_003F9FFC_18:
	ldr	r1, [r1]
.Lfunc_003F9FFC_1c:
	bics	r1, r3, r1
.Lfunc_003F9FFC_20:
	ldrbne	r1, [r2, #6]
.Lfunc_003F9FFC_24:
	cmpne	r1, #0
.Lfunc_003F9FFC_28:
	beq	.Lfunc_003F9FFC_68
.Lfunc_003F9FFC_2c:
	ldr	r1, [r0, #328]
.Lfunc_003F9FFC_30:
	mov	r2, #1
.Lfunc_003F9FFC_34:
	cmn	r1, #1
.Lfunc_003F9FFC_38:
	lsl	ip, r1, #20
.Lfunc_003F9FFC_3c:
	lsr	r3, r1, #24
.Lfunc_003F9FFC_40:
	cmpne	r3, #255
.Lfunc_003F9FFC_44:
	lsr	ip, ip, #20
.Lfunc_003F9FFC_48:
	movne	r2, ip
.Lfunc_003F9FFC_4c:
	tst	r2, #32
.Lfunc_003F9FFC_50:
	beq	.Lfunc_003F9FFC_68
.Lfunc_003F9FFC_54:
	ldr	r2, [r0, #8]
.Lfunc_003F9FFC_58:
	mov	r1, #16384
.Lfunc_003F9FFC_5c:
	bics	r1, r1, r2
.Lfunc_003F9FFC_60:
	orrne	r1, r2, #16384
.Lfunc_003F9FFC_64:
	strne	r1, [r0, #8]
.Lfunc_003F9FFC_68:
	bx	lr
.size func_003F9FFC, .-func_003F9FFC

.section .text.func_002BD090,"ax",%progbits
.balign 4
.global func_002BD090
.type func_002BD090, %function
func_002BD090:
.Lfunc_002BD090_0:
	push	{r4, r5, r6}
.Lfunc_002BD090_4:
	mov	r2, #0
.Lfunc_002BD090_8:
	add	r3, r0, r2, lsl #1
.Lfunc_002BD090_c:
	ldrh	r3, [r3, #6]
.Lfunc_002BD090_10:
	cmp	r3, r1
.Lfunc_002BD090_14:
	bne	.Lfunc_002BD090_54
.Lfunc_002BD090_18:
	mov	r3, #0
.Lfunc_002BD090_1c:
	mov	ip, #12
.Lfunc_002BD090_20:
	mov	r4, r3
.Lfunc_002BD090_24:
	add	r5, r3, r3, lsl #1
.Lfunc_002BD090_28:
	add	r3, r3, #1
.Lfunc_002BD090_2c:
	add	r5, r0, r5, lsl #3
.Lfunc_002BD090_30:
	ldrh	r6, [r5, #64]
.Lfunc_002BD090_34:
	cmp	r6, r1
.Lfunc_002BD090_38:
	strheq	r4, [r5, #64]
.Lfunc_002BD090_3c:
	subs	ip, ip, #1
.Lfunc_002BD090_40:
	bne	.Lfunc_002BD090_24
.Lfunc_002BD090_44:
	add	r0, r0, r2, lsl #1
.Lfunc_002BD090_48:
	strh	r4, [r0, #6]
.Lfunc_002BD090_4c:
	pop	{r4, r5, r6}
.Lfunc_002BD090_50:
	bx	lr
.Lfunc_002BD090_54:
	add	r2, r2, #1
.Lfunc_002BD090_58:
	cmp	r2, #16
.Lfunc_002BD090_5c:
	blt	.Lfunc_002BD090_8
.Lfunc_002BD090_60:
	pop	{r4, r5, r6}
.Lfunc_002BD090_64:
	bx	lr
.size func_002BD090, .-func_002BD090

.section .text.func_0032A884,"ax",%progbits
.balign 4
.global func_0032A884
.type func_0032A884, %function
func_0032A884:
.Lfunc_0032A884_0:
	ldr	r2, [r0, #48]
.Lfunc_0032A884_4:
	cmp	r2, #0
.Lfunc_0032A884_8:
	beq	.Lfunc_0032A884_58
.Lfunc_0032A884_c:
	ldr	r3, [r0]
.Lfunc_0032A884_10:
	cmp	r2, r3
.Lfunc_0032A884_14:
	bgt	.Lfunc_0032A884_60
.Lfunc_0032A884_18:
	ldr	r2, [r0, #16]
.Lfunc_0032A884_1c:
	subs	r2, r2, #260
.Lfunc_0032A884_20:
	beq	.Lfunc_0032A884_58
.Lfunc_0032A884_24:
	ldrb	r0, [r0, #88]
.Lfunc_0032A884_28:
	cmp	r0, #0
.Lfunc_0032A884_2c:
	ldrb	r0, [r2, #153]
.Lfunc_0032A884_30:
	ldr	r2, [r2, #80]
.Lfunc_0032A884_34:
	add	r0, r0, r2
.Lfunc_0032A884_38:
	beq	.Lfunc_0032A884_4c
.Lfunc_0032A884_3c:
	usat	r0, #7, r0
.Lfunc_0032A884_40:
	cmp	r1, r0
.Lfunc_0032A884_44:
	ble	.Lfunc_0032A884_58
.Lfunc_0032A884_48:
	b	.Lfunc_0032A884_60
.Lfunc_0032A884_4c:
	usat	r0, #7, r0
.Lfunc_0032A884_50:
	cmp	r0, r1
.Lfunc_0032A884_54:
	ble	.Lfunc_0032A884_60
.Lfunc_0032A884_58:
	mov	r0, #0
.Lfunc_0032A884_5c:
	bx	lr
.Lfunc_0032A884_60:
	mov	r0, #1
.Lfunc_0032A884_64:
	bx	lr
.size func_0032A884, .-func_0032A884

.section .text.func_002BD0F8,"ax",%progbits
.balign 4
.global func_002BD0F8
.type func_002BD0F8, %function
func_002BD0F8:
.Lfunc_002BD0F8_0:
	push	{r4, r5, r6, r7}
.Lfunc_002BD0F8_4:
	mov	r5, #0
.Lfunc_002BD0F8_8:
	mov	r3, r5
.Lfunc_002BD0F8_c:
	add	r1, r0, r5, lsl #1
.Lfunc_002BD0F8_10:
	add	r2, r1, #256
.Lfunc_002BD0F8_14:
	ldrh	r1, [r2, #108]
.Lfunc_002BD0F8_18:
	cmp	r1, #0
.Lfunc_002BD0F8_1c:
	movne	r1, #0
.Lfunc_002BD0F8_20:
	movne	ip, #12
.Lfunc_002BD0F8_24:
	beq	.Lfunc_002BD0F8_50
.Lfunc_002BD0F8_28:
	add	r4, r1, r1, lsl #1
.Lfunc_002BD0F8_2c:
	ldrh	r6, [r2, #108]
.Lfunc_002BD0F8_30:
	add	r4, r0, r4, lsl #3
.Lfunc_002BD0F8_34:
	add	r1, r1, #1
.Lfunc_002BD0F8_38:
	ldrh	r7, [r4, #64]
.Lfunc_002BD0F8_3c:
	cmp	r6, r7
.Lfunc_002BD0F8_40:
	strheq	r3, [r4, #64]
.Lfunc_002BD0F8_44:
	subs	ip, ip, #1
.Lfunc_002BD0F8_48:
	bne	.Lfunc_002BD0F8_28
.Lfunc_002BD0F8_4c:
	strh	r3, [r2, #108]
.Lfunc_002BD0F8_50:
	add	r5, r5, #1
.Lfunc_002BD0F8_54:
	cmp	r5, #16
.Lfunc_002BD0F8_58:
	blt	.Lfunc_002BD0F8_c
.Lfunc_002BD0F8_5c:
	pop	{r4, r5, r6, r7}
.Lfunc_002BD0F8_60:
	bx	lr
.size func_002BD0F8, .-func_002BD0F8

.section .text.func_002BCF8C,"ax",%progbits
.balign 4
.global func_002BCF8C
.type func_002BCF8C, %function
func_002BCF8C:
.Lfunc_002BCF8C_0:
	push	{r4, r5}
.Lfunc_002BCF8C_4:
	strb	r1, [r0, #38]
.Lfunc_002BCF8C_8:
	mov	r1, #0
.Lfunc_002BCF8C_c:
	mov	r2, #12
.Lfunc_002BCF8C_10:
	mov	r4, #1
.Lfunc_002BCF8C_14:
	mov	ip, r1
.Lfunc_002BCF8C_18:
	add	r3, r1, r1, lsl #1
.Lfunc_002BCF8C_1c:
	add	r3, r0, r3, lsl #3
.Lfunc_002BCF8C_20:
	ldrh	r5, [r3, #64]
.Lfunc_002BCF8C_24:
	cmp	r5, #1
.Lfunc_002BCF8C_28:
	bls	.Lfunc_002BCF8C_40
.Lfunc_002BCF8C_2c:
	ldrb	r3, [r3, #60]
.Lfunc_002BCF8C_30:
	cmp	r3, #0
.Lfunc_002BCF8C_34:
	addne	r3, r0, r1
.Lfunc_002BCF8C_38:
	strbne	r4, [r3, #39]
.Lfunc_002BCF8C_3c:
	bne	.Lfunc_002BCF8C_48
.Lfunc_002BCF8C_40:
	add	r3, r0, r1
.Lfunc_002BCF8C_44:
	strb	ip, [r3, #39]
.Lfunc_002BCF8C_48:
	subs	r2, r2, #1
.Lfunc_002BCF8C_4c:
	add	r1, r1, #1
.Lfunc_002BCF8C_50:
	bne	.Lfunc_002BCF8C_18
.Lfunc_002BCF8C_54:
	pop	{r4, r5}
.Lfunc_002BCF8C_58:
	bx	lr
.size func_002BCF8C, .-func_002BCF8C

.section .text.func_003B6F30,"ax",%progbits
.balign 4
.global func_003B6F30
.type func_003B6F30, %function
func_003B6F30:
.Lfunc_003B6F30_0:
	cmp	r0, #492
.Lfunc_003B6F30_4:
	subne	r1, r0, #256
.Lfunc_003B6F30_8:
	subsne	r1, r1, #237
.Lfunc_003B6F30_c:
	beq	.Lfunc_003B6F30_54
.Lfunc_003B6F30_10:
	sub	r1, r0, #256
.Lfunc_003B6F30_14:
	subs	r1, r1, #238
.Lfunc_003B6F30_18:
	subne	r1, r0, #256
.Lfunc_003B6F30_1c:
	subsne	r1, r1, #239
.Lfunc_003B6F30_20:
	beq	.Lfunc_003B6F30_54
.Lfunc_003B6F30_24:
	cmp	r0, #496
.Lfunc_003B6F30_28:
	subne	r1, r0, #256
.Lfunc_003B6F30_2c:
	subsne	r1, r1, #241
.Lfunc_003B6F30_30:
	beq	.Lfunc_003B6F30_54
.Lfunc_003B6F30_34:
	sub	r1, r0, #256
.Lfunc_003B6F30_38:
	subs	r1, r1, #242
.Lfunc_003B6F30_3c:
	subne	r1, r0, #256
.Lfunc_003B6F30_40:
	subsne	r1, r1, #243
.Lfunc_003B6F30_44:
	beq	.Lfunc_003B6F30_54
.Lfunc_003B6F30_48:
	cmp	r0, #500
.Lfunc_003B6F30_4c:
	movne	r0, #1
.Lfunc_003B6F30_50:
	bne	.Lfunc_003B6F30_58
.Lfunc_003B6F30_54:
	mov	r0, #0
.Lfunc_003B6F30_58:
	bx	lr
.size func_003B6F30, .-func_003B6F30

.section .text.func_003309F4,"ax",%progbits
.balign 4
.global func_003309F4
.type func_003309F4, %function
func_003309F4:
.Lfunc_003309F4_0:
	ldrb	r2, [r0, #608]
.Lfunc_003309F4_4:
	cmp	r2, #0
.Lfunc_003309F4_8:
	bxne	lr
.Lfunc_003309F4_c:
	mov	r2, #1
.Lfunc_003309F4_10:
	mov	ip, #0
.Lfunc_003309F4_14:
	strb	r2, [r0, #608]
.Lfunc_003309F4_18:
	strb	ip, [r0, #609]
.Lfunc_003309F4_1c:
	push	{r4, r5}
.Lfunc_003309F4_20:
	mov	r2, ip
.Lfunc_003309F4_24:
	mov	r3, #9
.Lfunc_003309F4_28:
	mvn	r4, #0
.Lfunc_003309F4_2c:
	add	r5, r0, r2, lsl #3
.Lfunc_003309F4_30:
	add	r5, r5, #536
.Lfunc_003309F4_34:
	subs	r3, r3, #1
.Lfunc_003309F4_38:
	stm	r5, {r4, ip}
.Lfunc_003309F4_3c:
	add	r2, r2, #1
.Lfunc_003309F4_40:
	bne	.Lfunc_003309F4_2c
.Lfunc_003309F4_44:
	pop	{r4, r5}
.Lfunc_003309F4_48:
	add	r0, r0, #12
.Lfunc_003309F4_4c:
	mov	r0, r0
.Lfunc_003309F4_50:
	str	r1, [r0, #4]
.Lfunc_003309F4_54:
	bx	lr
.size func_003309F4, .-func_003309F4

.section .text.func_00338178,"ax",%progbits
.balign 4
.global func_00338178
.type func_00338178, %function
func_00338178:
.Lfunc_00338178_0:
	ldr	r2, [r0, #24]
.Lfunc_00338178_4:
	ldrb	r1, [r0, #32]
.Lfunc_00338178_8:
	str	r2, [r0, #12]
.Lfunc_00338178_c:
	cmp	r1, #1
.Lfunc_00338178_10:
	moveq	r2, #1
.Lfunc_00338178_14:
	movne	r2, #0
.Lfunc_00338178_18:
	cmp	r1, #2
.Lfunc_00338178_1c:
	add	r2, r0, r2, lsl #2
.Lfunc_00338178_20:
	ldr	r2, [r2, #24]
.Lfunc_00338178_24:
	str	r2, [r0, #8]
.Lfunc_00338178_28:
	moveq	r2, #1
.Lfunc_00338178_2c:
	movne	r2, #0
.Lfunc_00338178_30:
	cmp	r1, #0
.Lfunc_00338178_34:
	add	r2, r0, r2, lsl #2
.Lfunc_00338178_38:
	ldr	r1, [r2, #24]
.Lfunc_00338178_3c:
	str	r1, [r0, #16]
.Lfunc_00338178_40:
	movne	r1, #1
.Lfunc_00338178_44:
	moveq	r1, #0
.Lfunc_00338178_48:
	add	r1, r0, r1, lsl #2
.Lfunc_00338178_4c:
	ldr	r1, [r1, #24]
.Lfunc_00338178_50:
	str	r1, [r0, #20]
.Lfunc_00338178_54:
	bx	lr
.size func_00338178, .-func_00338178

.section .text.func_003C4DF0,"ax",%progbits
.balign 4
.global func_003C4DF0
.type func_003C4DF0, %function
func_003C4DF0:
.Lfunc_003C4DF0_0:
	push	{r4, r5, r6}
.Lfunc_003C4DF0_4:
	mov	r3, #0
.Lfunc_003C4DF0_8:
	ldr	r2, [r0, #12]
.Lfunc_003C4DF0_c:
	ldr	ip, [r2], #4
.Lfunc_003C4DF0_10:
	str	r2, [r0, #12]
.Lfunc_003C4DF0_14:
	ldr	r4, [r2], #4
.Lfunc_003C4DF0_18:
	str	r2, [r0, #12]
.Lfunc_003C4DF0_1c:
	ldrh	r5, [r2], #2
.Lfunc_003C4DF0_20:
	str	r2, [r0, #12]
.Lfunc_003C4DF0_24:
	ldr	r6, [r0, #32]
.Lfunc_003C4DF0_28:
	cmp	r6, #2
.Lfunc_003C4DF0_2c:
	blt	.Lfunc_003C4DF0_38
.Lfunc_003C4DF0_30:
	ldrh	r3, [r2], #2
.Lfunc_003C4DF0_34:
	str	r2, [r0, #12]
.Lfunc_003C4DF0_38:
	ldrh	r6, [r2], #2
.Lfunc_003C4DF0_3c:
	str	r2, [r0, #12]
.Lfunc_003C4DF0_40:
	uxth	r0, r3
.Lfunc_003C4DF0_44:
	str	r0, [r1, #16]
.Lfunc_003C4DF0_48:
	strd	r4, [r1, #8]
.Lfunc_003C4DF0_4c:
	stm	r1, {r6, ip}
.Lfunc_003C4DF0_50:
	pop	{r4, r5, r6}
.Lfunc_003C4DF0_54:
	bx	lr
.size func_003C4DF0, .-func_003C4DF0

.section .text.func_003F9BCC,"ax",%progbits
.balign 4
.global func_003F9BCC
.type func_003F9BCC, %function
func_003F9BCC:
.Lfunc_003F9BCC_0:
	ldr	r1, [r0, #328]
.Lfunc_003F9BCC_4:
	ldr	r3, [r0, #8]
.Lfunc_003F9BCC_8:
	mov	r2, #134217728
.Lfunc_003F9BCC_c:
	lsr	r1, r1, #24
.Lfunc_003F9BCC_10:
	cmp	r1, #2
.Lfunc_003F9BCC_14:
	cmpne	r1, #4
.Lfunc_003F9BCC_18:
	bic	r2, r2, r3
.Lfunc_003F9BCC_1c:
	beq	.Lfunc_003F9BCC_48
.Lfunc_003F9BCC_20:
	cmp	r1, #51
.Lfunc_003F9BCC_24:
	cmpne	r1, #52
.Lfunc_003F9BCC_28:
	mov	ip, r1
.Lfunc_003F9BCC_2c:
	cmpne	ip, #43
.Lfunc_003F9BCC_30:
	beq	.Lfunc_003F9BCC_48
.Lfunc_003F9BCC_34:
	cmp	r2, #0
.Lfunc_003F9BCC_38:
	biceq	r1, r3, #134217728
.Lfunc_003F9BCC_3c:
	bne	.Lfunc_003F9BCC_44
.Lfunc_003F9BCC_40:
	str	r1, [r0, #8]
.Lfunc_003F9BCC_44:
	bx	lr
.Lfunc_003F9BCC_48:
	cmp	r2, #0
.Lfunc_003F9BCC_4c:
	orrne	r1, r3, #134217728
.Lfunc_003F9BCC_50:
	beq	.Lfunc_003F9BCC_44
.Lfunc_003F9BCC_54:
	b	.Lfunc_003F9BCC_40
.size func_003F9BCC, .-func_003F9BCC

.section .text.func_00202840,"ax",%progbits
.balign 4
.global func_00202840
.type func_00202840, %function
func_00202840:
.Lfunc_00202840_0:
	mov	ip, r0
.Lfunc_00202840_4:
	mov	r0, r1
.Lfunc_00202840_8:
	push	{r4}
.Lfunc_00202840_c:
	rsb	r4, r2, #0
.Lfunc_00202840_10:
	sub	r1, ip, r0
.Lfunc_00202840_14:
	cmp	r1, r4
.Lfunc_00202840_18:
	bge	.Lfunc_00202840_34
.Lfunc_00202840_1c:
	add	r1, r1, r2
.Lfunc_00202840_20:
	mul	r1, r1, r3
.Lfunc_00202840_24:
	add	r0, r0, r1, asr #7
.Lfunc_00202840_28:
	sxth	r0, r0
.Lfunc_00202840_2c:
	pop	{r4}
.Lfunc_00202840_30:
	bx	lr
.Lfunc_00202840_34:
	cmp	r1, r2
.Lfunc_00202840_38:
	ble	.Lfunc_00202840_2c
.Lfunc_00202840_3c:
	sub	r1, r1, r2
.Lfunc_00202840_40:
	pop	{r4}
.Lfunc_00202840_44:
	mul	r1, r1, r3
.Lfunc_00202840_48:
	add	r0, r0, r1, asr #7
.Lfunc_00202840_4c:
	sxth	r0, r0
.Lfunc_00202840_50:
	bx	lr
.size func_00202840, .-func_00202840

.section .text.func_002B30A0,"ax",%progbits
.balign 4
.global func_002B30A0
.type func_002B30A0, %function
func_002B30A0:
.Lfunc_002B30A0_0:
	push	{r4}
.Lfunc_002B30A0_4:
	ldr	r2, [r0]
.Lfunc_002B30A0_8:
	mov	r4, #1
.Lfunc_002B30A0_c:
	add	r3, r2, #8
.Lfunc_002B30A0_10:
	ldr	r2, [r2, #12]
.Lfunc_002B30A0_14:
	cmp	r2, r3
.Lfunc_002B30A0_18:
	beq	.Lfunc_002B30A0_4c
.Lfunc_002B30A0_1c:
	ldrb	ip, [r2, #12]
.Lfunc_002B30A0_20:
	cmp	ip, #4
.Lfunc_002B30A0_24:
	bne	.Lfunc_002B30A0_40
.Lfunc_002B30A0_28:
	ldrb	ip, [r2, #14]
.Lfunc_002B30A0_2c:
	tst	r1, r4, lsl ip
.Lfunc_002B30A0_30:
	beq	.Lfunc_002B30A0_40
.Lfunc_002B30A0_34:
	ldr	r2, [r2, #8]
.Lfunc_002B30A0_38:
	str	r2, [r0]
.Lfunc_002B30A0_3c:
	b	.Lfunc_002B30A0_c
.Lfunc_002B30A0_40:
	ldr	r2, [r2, #4]
.Lfunc_002B30A0_44:
	cmp	r2, r3
.Lfunc_002B30A0_48:
	bne	.Lfunc_002B30A0_1c
.Lfunc_002B30A0_4c:
	pop	{r4}
.Lfunc_002B30A0_50:
	bx	lr
.size func_002B30A0, .-func_002B30A0

.section .text.func_00203FF0,"ax",%progbits
.balign 4
.global func_00203FF0
.type func_00203FF0, %function
func_00203FF0:
.Lfunc_00203FF0_0:
	ldr	r2, [r0, #160]
.Lfunc_00203FF0_4:
	ldr	r3, [r0, #156]
.Lfunc_00203FF0_8:
	mov	ip, #0
.Lfunc_00203FF0_c:
	sub	r1, r2, r3
.Lfunc_00203FF0_10:
	cmp	ip, r1, asr #2
.Lfunc_00203FF0_14:
	bcs	.Lfunc_00203FF0_4c
.Lfunc_00203FF0_18:
	cmp	r3, r2
.Lfunc_00203FF0_1c:
	beq	.Lfunc_00203FF0_4c
.Lfunc_00203FF0_20:
	asr	ip, r1, #2
.Lfunc_00203FF0_24:
	cmp	ip, #0
.Lfunc_00203FF0_28:
	ble	.Lfunc_00203FF0_3c
.Lfunc_00203FF0_2c:
	asrs	r1, r1, #3
.Lfunc_00203FF0_30:
	beq	.Lfunc_00203FF0_3c
.Lfunc_00203FF0_34:
	subs	r1, r1, #1
.Lfunc_00203FF0_38:
	bne	.Lfunc_00203FF0_34
.Lfunc_00203FF0_3c:
	sub	r1, r2, r3
.Lfunc_00203FF0_40:
	bic	r1, r1, #3
.Lfunc_00203FF0_44:
	sub	r1, r2, r1
.Lfunc_00203FF0_48:
	str	r1, [r0, #160]
.Lfunc_00203FF0_4c:
	bx	lr
.size func_00203FF0, .-func_00203FF0
