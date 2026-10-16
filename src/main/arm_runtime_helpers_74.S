.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0012F94C,"ax",%progbits
.balign 4
.global func_0012F94C
.type func_0012F94C, %function
func_0012F94C:
.Lfunc_0012F94C_0:
	ldr	r0, [r0, #376]
.Lfunc_0012F94C_4:
	cmp	r1, #3
.Lfunc_0012F94C_8:
	bcs	.Lfunc_0012F94C_24
.Lfunc_0012F94C_c:
	add	r1, r0, r1, lsl #2
.Lfunc_0012F94C_10:
	ldr	r0, [r0, #8]
.Lfunc_0012F94C_14:
	ldr	r1, [r1, #40]
.Lfunc_0012F94C_18:
	ldrh	r2, [r0, #4]
.Lfunc_0012F94C_1c:
	cmp	r1, r2
.Lfunc_0012F94C_20:
	bcc	.Lfunc_0012F94C_2c
.Lfunc_0012F94C_24:
	mov	r0, #0
.Lfunc_0012F94C_28:
	bx	lr
.Lfunc_0012F94C_2c:
	ldr	r0, [r0]
.Lfunc_0012F94C_30:
	add	r0, r0, r1, lsl #6
.Lfunc_0012F94C_34:
	ldrb	r1, [r0, #4]
.Lfunc_0012F94C_38:
	cmp	r1, #0
.Lfunc_0012F94C_3c:
	beq	.Lfunc_0012F94C_24
.Lfunc_0012F94C_40:
	bx	lr
.size func_0012F94C, .-func_0012F94C

.section .text.func_0016999C,"ax",%progbits
.balign 4
.global func_0016999C
.type func_0016999C, %function
func_0016999C:
.Lfunc_0016999C_0:
	ldr	r3, [r0, #28]
.Lfunc_0016999C_4:
	mov	r2, #0
.Lfunc_0016999C_8:
	cmp	r3, r1
.Lfunc_0016999C_c:
	streq	r2, [r0, #28]
.Lfunc_0016999C_10:
	beq	.Lfunc_0016999C_40
.Lfunc_0016999C_14:
	ldr	r3, [r0, #32]
.Lfunc_0016999C_18:
	cmp	r3, r1
.Lfunc_0016999C_1c:
	streq	r2, [r0, #32]
.Lfunc_0016999C_20:
	beq	.Lfunc_0016999C_40
.Lfunc_0016999C_24:
	ldr	r3, [r0, #36]
.Lfunc_0016999C_28:
	cmp	r3, r1
.Lfunc_0016999C_2c:
	streq	r2, [r0, #36]
.Lfunc_0016999C_30:
	beq	.Lfunc_0016999C_40
.Lfunc_0016999C_34:
	ldr	r3, [r0, #40]
.Lfunc_0016999C_38:
	cmp	r3, r1
.Lfunc_0016999C_3c:
	streq	r2, [r0, #40]
.Lfunc_0016999C_40:
	bx	lr
.size func_0016999C, .-func_0016999C

.section .text.func_001C1D18,"ax",%progbits
.balign 4
.global func_001C1D18
.type func_001C1D18, %function
func_001C1D18:
.Lfunc_001C1D18_0:
	cmp	r1, #0
.Lfunc_001C1D18_4:
	strd	r2, [r0]
.Lfunc_001C1D18_8:
	moveq	r2, #2
.Lfunc_001C1D18_c:
	streq	r2, [r0, #12]
.Lfunc_001C1D18_10:
	mov	ip, #0
.Lfunc_001C1D18_14:
	mov	r2, #1
.Lfunc_001C1D18_18:
	strne	ip, [r0, #12]
.Lfunc_001C1D18_1c:
	str	r2, [r0, #16]
.Lfunc_001C1D18_20:
	str	ip, [r0, #20]
.Lfunc_001C1D18_24:
	str	ip, [r0, #24]
.Lfunc_001C1D18_28:
	str	ip, [r0, #28]
.Lfunc_001C1D18_2c:
	str	r1, [r0, #8]!
.Lfunc_001C1D18_30:
	mvn	r3, #0
.Lfunc_001C1D18_34:
	str	ip, [r0, #36]
.Lfunc_001C1D18_38:
	add	r0, r0, #24
.Lfunc_001C1D18_3c:
	stm	r0, {r2, r3, ip}
.Lfunc_001C1D18_40:
	bx	lr
.size func_001C1D18, .-func_001C1D18

.section .text.func_001FAD44,"ax",%progbits
.balign 4
.global func_001FAD44
.type func_001FAD44, %function
func_001FAD44:
.Lfunc_001FAD44_0:
	push	{r4, r5}
.Lfunc_001FAD44_4:
	mov	ip, r1
.Lfunc_001FAD44_8:
	ldrd	r4, [sp, #8]
.Lfunc_001FAD44_c:
	cmp	r5, #0
.Lfunc_001FAD44_10:
	strne	r1, [r0, #8]
.Lfunc_001FAD44_14:
	addeq	r5, r0, #12
.Lfunc_001FAD44_18:
	addne	r1, r1, #16
.Lfunc_001FAD44_1c:
	streq	r5, [r0, #8]
.Lfunc_001FAD44_20:
	stm	r0, {r1, r3}
.Lfunc_001FAD44_24:
	add	r3, r1, r3, lsl #3
.Lfunc_001FAD44_28:
	sub	r1, r3, ip
.Lfunc_001FAD44_2c:
	str	r3, [r0, #28]!
.Lfunc_001FAD44_30:
	sub	r1, r2, r1
.Lfunc_001FAD44_34:
	str	r1, [r0, #4]!
.Lfunc_001FAD44_38:
	str	r4, [r0, #8]
.Lfunc_001FAD44_3c:
	pop	{r4, r5}
.Lfunc_001FAD44_40:
	bx	lr
.size func_001FAD44, .-func_001FAD44

.section .text.func_0034AE00,"ax",%progbits
.balign 4
.global func_0034AE00
.type func_0034AE00, %function
func_0034AE00:
.Lfunc_0034AE00_0:
	ldr	ip, [r0, #24]
.Lfunc_0034AE00_4:
	cmp	ip, #0
.Lfunc_0034AE00_8:
	mov	ip, #0
.Lfunc_0034AE00_c:
	bxls	lr
.Lfunc_0034AE00_10:
	push	{r4, r5}
.Lfunc_0034AE00_14:
	ldr	r4, [r0, #16]
.Lfunc_0034AE00_18:
	ldr	r4, [r4, ip, lsl #2]
.Lfunc_0034AE00_1c:
	add	ip, ip, #1
.Lfunc_0034AE00_20:
	ldr	r5, [r4, #4]
.Lfunc_0034AE00_24:
	cmp	r5, r1
.Lfunc_0034AE00_28:
	streq	r2, [r4, #64]
.Lfunc_0034AE00_2c:
	strbeq	r3, [r4, #68]
.Lfunc_0034AE00_30:
	ldr	r4, [r0, #24]
.Lfunc_0034AE00_34:
	cmp	r4, ip
.Lfunc_0034AE00_38:
	bhi	.Lfunc_0034AE00_14
.Lfunc_0034AE00_3c:
	pop	{r4, r5}
.Lfunc_0034AE00_40:
	bx	lr
.size func_0034AE00, .-func_0034AE00

.section .text.func_0039873C,"ax",%progbits
.balign 4
.global func_0039873C
.type func_0039873C, %function
func_0039873C:
.Lfunc_0039873C_0:
	ldr	r2, [r0, #324]
.Lfunc_0039873C_4:
	mov	r3, #0
.Lfunc_0039873C_8:
	cmp	r2, #0
.Lfunc_0039873C_c:
	beq	.Lfunc_0039873C_2c
.Lfunc_0039873C_10:
	cmp	r2, r1
.Lfunc_0039873C_14:
	bne	.Lfunc_0039873C_30
.Lfunc_0039873C_18:
	cmp	r3, #0
.Lfunc_0039873C_1c:
	ldrne	r0, [r1, #4]
.Lfunc_0039873C_20:
	ldreq	r1, [r1, #4]
.Lfunc_0039873C_24:
	strne	r0, [r3, #4]
.Lfunc_0039873C_28:
	streq	r1, [r0, #324]
.Lfunc_0039873C_2c:
	bx	lr
.Lfunc_0039873C_30:
	mov	r3, r2
.Lfunc_0039873C_34:
	ldr	r2, [r2, #4]
.Lfunc_0039873C_38:
	cmp	r2, #0
.Lfunc_0039873C_3c:
	bne	.Lfunc_0039873C_10
.Lfunc_0039873C_40:
	bx	lr
.size func_0039873C, .-func_0039873C

.section .text.func_003988E4,"ax",%progbits
.balign 4
.global func_003988E4
.type func_003988E4, %function
func_003988E4:
.Lfunc_003988E4_0:
	ldr	r2, [r0, #328]
.Lfunc_003988E4_4:
	mov	r3, #0
.Lfunc_003988E4_8:
	cmp	r2, #0
.Lfunc_003988E4_c:
	beq	.Lfunc_003988E4_2c
.Lfunc_003988E4_10:
	cmp	r2, r1
.Lfunc_003988E4_14:
	bne	.Lfunc_003988E4_30
.Lfunc_003988E4_18:
	cmp	r3, #0
.Lfunc_003988E4_1c:
	ldrne	r0, [r1, #4]
.Lfunc_003988E4_20:
	ldreq	r1, [r1, #4]
.Lfunc_003988E4_24:
	strne	r0, [r3, #4]
.Lfunc_003988E4_28:
	streq	r1, [r0, #328]
.Lfunc_003988E4_2c:
	bx	lr
.Lfunc_003988E4_30:
	mov	r3, r2
.Lfunc_003988E4_34:
	ldr	r2, [r2, #4]
.Lfunc_003988E4_38:
	cmp	r2, #0
.Lfunc_003988E4_3c:
	bne	.Lfunc_003988E4_10
.Lfunc_003988E4_40:
	bx	lr
.size func_003988E4, .-func_003988E4

.section .text.func_00417130,"ax",%progbits
.balign 4
.global func_00417130
.type func_00417130, %function
func_00417130:
.Lfunc_00417130_0:
	push	{r4}
.Lfunc_00417130_4:
	ldr	r2, [r0, #40]
.Lfunc_00417130_8:
	mov	ip, #1
.Lfunc_00417130_c:
	lsl	r4, ip, r1
.Lfunc_00417130_10:
	and	r3, r2, #7680
.Lfunc_00417130_14:
	mov	ip, #7680
.Lfunc_00417130_18:
	lsr	r3, r3, #9
.Lfunc_00417130_1c:
	bic	r3, r3, r4
.Lfunc_00417130_20:
	bic	r2, r2, #7680
.Lfunc_00417130_24:
	and	r3, ip, r3, lsl #9
.Lfunc_00417130_28:
	orr	r2, r2, r3
.Lfunc_00417130_2c:
	add	r1, r0, r1, lsl #2
.Lfunc_00417130_30:
	str	r2, [r0, #40]
.Lfunc_00417130_34:
	mov	r0, #0
.Lfunc_00417130_38:
	str	r0, [r1, #48]
.Lfunc_00417130_3c:
	pop	{r4}
.Lfunc_00417130_40:
	bx	lr
.size func_00417130, .-func_00417130

.section .text.func_004425C4,"ax",%progbits
.balign 4
.global func_004425C4
.type func_004425C4, %function
func_004425C4:
.Lfunc_004425C4_0:
	ldr	r3, [r0, #16]
.Lfunc_004425C4_4:
	mov	r2, #0
.Lfunc_004425C4_8:
	cmp	r3, r1
.Lfunc_004425C4_c:
	streq	r2, [r0, #16]
.Lfunc_004425C4_10:
	beq	.Lfunc_004425C4_40
.Lfunc_004425C4_14:
	ldr	r3, [r0, #20]
.Lfunc_004425C4_18:
	cmp	r3, r1
.Lfunc_004425C4_1c:
	streq	r2, [r0, #20]
.Lfunc_004425C4_20:
	beq	.Lfunc_004425C4_40
.Lfunc_004425C4_24:
	ldr	r3, [r0, #24]
.Lfunc_004425C4_28:
	cmp	r3, r1
.Lfunc_004425C4_2c:
	streq	r2, [r0, #24]
.Lfunc_004425C4_30:
	beq	.Lfunc_004425C4_40
.Lfunc_004425C4_34:
	ldr	r3, [r0, #28]
.Lfunc_004425C4_38:
	cmp	r3, r1
.Lfunc_004425C4_3c:
	streq	r2, [r0, #28]
.Lfunc_004425C4_40:
	bx	lr
.size func_004425C4, .-func_004425C4

.section .text.func_0044A808,"ax",%progbits
.balign 4
.global func_0044A808
.type func_0044A808, %function
func_0044A808:
.Lfunc_0044A808_0:
	ldr	r3, [r0, #4]
.Lfunc_0044A808_4:
	mov	r2, #0
.Lfunc_0044A808_8:
	cmp	r3, r1
.Lfunc_0044A808_c:
	streq	r2, [r0, #4]
.Lfunc_0044A808_10:
	beq	.Lfunc_0044A808_40
.Lfunc_0044A808_14:
	ldr	r3, [r0, #8]
.Lfunc_0044A808_18:
	cmp	r3, r1
.Lfunc_0044A808_1c:
	streq	r2, [r0, #8]
.Lfunc_0044A808_20:
	beq	.Lfunc_0044A808_40
.Lfunc_0044A808_24:
	ldr	r3, [r0, #12]
.Lfunc_0044A808_28:
	cmp	r3, r1
.Lfunc_0044A808_2c:
	streq	r2, [r0, #12]
.Lfunc_0044A808_30:
	beq	.Lfunc_0044A808_40
.Lfunc_0044A808_34:
	ldr	r3, [r0, #16]
.Lfunc_0044A808_38:
	cmp	r3, r1
.Lfunc_0044A808_3c:
	streq	r2, [r0, #16]
.Lfunc_0044A808_40:
	bx	lr
.size func_0044A808, .-func_0044A808

.section .text.func_004C1F0C,"ax",%progbits
.balign 4
.global func_004C1F0C
.type func_004C1F0C, %function
func_004C1F0C:
.Lfunc_004C1F0C_0:
	ldr	r2, [r0, #12]
.Lfunc_004C1F0C_4:
	add	r2, r2, r0
.Lfunc_004C1F0C_8:
	add	r3, r2, r1, lsl #3
.Lfunc_004C1F0C_c:
	ldrh	r0, [r3, #4]
.Lfunc_004C1F0C_10:
	cmp	r0, #22784
.Lfunc_004C1F0C_14:
	beq	.Lfunc_004C1F0C_28
.Lfunc_004C1F0C_18:
	sub	r0, r0, #22784
.Lfunc_004C1F0C_1c:
	subs	r0, r0, #3
.Lfunc_004C1F0C_20:
	beq	.Lfunc_004C1F0C_40
.Lfunc_004C1F0C_24:
	b	.Lfunc_004C1F0C_3c
.Lfunc_004C1F0C_28:
	ldr	r0, [r2]
.Lfunc_004C1F0C_2c:
	cmp	r0, r1
.Lfunc_004C1F0C_30:
	ldrhi	r0, [r3, #8]
.Lfunc_004C1F0C_34:
	addhi	r0, r0, r2
.Lfunc_004C1F0C_38:
	bhi	.Lfunc_004C1F0C_40
.Lfunc_004C1F0C_3c:
	mov	r0, #0
.Lfunc_004C1F0C_40:
	bx	lr
.size func_004C1F0C, .-func_004C1F0C

.section .text.func_0013F44C,"ax",%progbits
.balign 4
.global func_0013F44C
.type func_0013F44C, %function
func_0013F44C:
.Lfunc_0013F44C_0:
	cmp	r1, #0
.Lfunc_0013F44C_4:
	ldreq	r0, [r0, #72]
.Lfunc_0013F44C_8:
	andeq	r0, r0, #1
.Lfunc_0013F44C_c:
	beq	.Lfunc_0013F44C_2c
.Lfunc_0013F44C_10:
	cmp	r1, #1
.Lfunc_0013F44C_14:
	beq	.Lfunc_0013F44C_30
.Lfunc_0013F44C_18:
	cmp	r1, #2
.Lfunc_0013F44C_1c:
	ldreq	r0, [r0, #72]
.Lfunc_0013F44C_20:
	andeq	r0, r0, #4
.Lfunc_0013F44C_24:
	lsreq	r0, r0, #2
.Lfunc_0013F44C_28:
	movne	r0, #0
.Lfunc_0013F44C_2c:
	bx	lr
.Lfunc_0013F44C_30:
	ldr	r0, [r0, #72]
.Lfunc_0013F44C_34:
	and	r0, r0, #2
.Lfunc_0013F44C_38:
	lsr	r0, r0, #1
.Lfunc_0013F44C_3c:
	bx	lr
.size func_0013F44C, .-func_0013F44C

.section .text.func_0018EBE4,"ax",%progbits
.balign 4
.global func_0018EBE4
.type func_0018EBE4, %function
func_0018EBE4:
.Lfunc_0018EBE4_0:
	ldrb	r1, [r0, #260]
.Lfunc_0018EBE4_4:
	cmp	r1, #0
.Lfunc_0018EBE4_8:
	beq	.Lfunc_0018EBE4_3c
.Lfunc_0018EBE4_c:
	mov	r1, #0
.Lfunc_0018EBE4_10:
	strb	r1, [r0, #260]
.Lfunc_0018EBE4_14:
	str	r1, [r0, #60]
.Lfunc_0018EBE4_18:
	str	r1, [r0, #76]
.Lfunc_0018EBE4_1c:
	str	r1, [r0, #92]
.Lfunc_0018EBE4_20:
	str	r1, [r0, #96]
.Lfunc_0018EBE4_24:
	str	r1, [r0, #124]
.Lfunc_0018EBE4_28:
	str	r1, [r0, #64]
.Lfunc_0018EBE4_2c:
	str	r1, [r0, #80]
.Lfunc_0018EBE4_30:
	str	r1, [r0, #100]
.Lfunc_0018EBE4_34:
	str	r1, [r0, #104]
.Lfunc_0018EBE4_38:
	str	r1, [r0, #128]
.Lfunc_0018EBE4_3c:
	bx	lr
.size func_0018EBE4, .-func_0018EBE4

.section .text.func_00328DBC,"ax",%progbits
.balign 4
.global func_00328DBC
.type func_00328DBC, %function
func_00328DBC:
.Lfunc_00328DBC_0:
	cmp	r1, #28
.Lfunc_00328DBC_4:
	bcs	.Lfunc_00328DBC_3c
.Lfunc_00328DBC_8:
	ands	r3, r1, #3
.Lfunc_00328DBC_c:
	lsr	r1, r1, #2
.Lfunc_00328DBC_10:
	add	r0, r0, r1, lsl #2
.Lfunc_00328DBC_14:
	strbeq	r2, [r0, #16]
.Lfunc_00328DBC_18:
	beq	.Lfunc_00328DBC_3c
.Lfunc_00328DBC_1c:
	cmp	r3, #1
.Lfunc_00328DBC_20:
	strbeq	r2, [r0, #17]
.Lfunc_00328DBC_24:
	beq	.Lfunc_00328DBC_3c
.Lfunc_00328DBC_28:
	cmp	r3, #2
.Lfunc_00328DBC_2c:
	strbeq	r2, [r0, #18]
.Lfunc_00328DBC_30:
	beq	.Lfunc_00328DBC_3c
.Lfunc_00328DBC_34:
	cmp	r3, #3
.Lfunc_00328DBC_38:
	strbeq	r2, [r0, #19]
.Lfunc_00328DBC_3c:
	bx	lr
.size func_00328DBC, .-func_00328DBC

.section .text.func_0032EB64,"ax",%progbits
.balign 4
.global func_0032EB64
.type func_0032EB64, %function
func_0032EB64:
.Lfunc_0032EB64_0:
	ldr	r1, [r0, #112]
.Lfunc_0032EB64_4:
	ldr	r2, [r0, #108]
.Lfunc_0032EB64_8:
	cmp	r1, r2
.Lfunc_0032EB64_c:
	addlt	r1, r1, #1
.Lfunc_0032EB64_10:
	strlt	r1, [r0, #112]
.Lfunc_0032EB64_14:
	ldr	r1, [r0, #144]
.Lfunc_0032EB64_18:
	ldr	r2, [r0, #140]
.Lfunc_0032EB64_1c:
	cmp	r1, r2
.Lfunc_0032EB64_20:
	addlt	r1, r1, #1
.Lfunc_0032EB64_24:
	strlt	r1, [r0, #144]
.Lfunc_0032EB64_28:
	ldr	r1, [r0, #192]
.Lfunc_0032EB64_2c:
	ldr	r2, [r0, #188]
.Lfunc_0032EB64_30:
	cmp	r1, r2
.Lfunc_0032EB64_34:
	addlt	r1, r1, #1
.Lfunc_0032EB64_38:
	strlt	r1, [r0, #192]
.Lfunc_0032EB64_3c:
	bx	lr
.size func_0032EB64, .-func_0032EB64

.section .text.func_0034B0CC,"ax",%progbits
.balign 4
.global func_0034B0CC
.type func_0034B0CC, %function
func_0034B0CC:
.Lfunc_0034B0CC_0:
	ldr	r3, [r0, #24]
.Lfunc_0034B0CC_4:
	cmp	r3, #0
.Lfunc_0034B0CC_8:
	mov	r3, #0
.Lfunc_0034B0CC_c:
	bxls	lr
.Lfunc_0034B0CC_10:
	push	{r4}
.Lfunc_0034B0CC_14:
	ldr	ip, [r0, #16]
.Lfunc_0034B0CC_18:
	ldr	ip, [ip, r3, lsl #2]
.Lfunc_0034B0CC_1c:
	add	r3, r3, #1
.Lfunc_0034B0CC_20:
	ldr	r4, [ip, #4]
.Lfunc_0034B0CC_24:
	cmp	r4, r1
.Lfunc_0034B0CC_28:
	streq	r2, [ip, #44]
.Lfunc_0034B0CC_2c:
	ldr	ip, [r0, #24]
.Lfunc_0034B0CC_30:
	cmp	ip, r3
.Lfunc_0034B0CC_34:
	bhi	.Lfunc_0034B0CC_14
.Lfunc_0034B0CC_38:
	pop	{r4}
.Lfunc_0034B0CC_3c:
	bx	lr
.size func_0034B0CC, .-func_0034B0CC

.section .text.func_0041087C,"ax",%progbits
.balign 4
.global func_0041087C
.type func_0041087C, %function
func_0041087C:
.Lfunc_0041087C_0:
	ldr	r2, [r0, #4]
.Lfunc_0041087C_4:
	ldrh	r3, [r1]
.Lfunc_0041087C_8:
	mvn	ip, #2064384
.Lfunc_0041087C_c:
	bic	r2, r2, #28672
.Lfunc_0041087C_10:
	bic	r2, r2, #4064
.Lfunc_0041087C_14:
	and	r3, ip, r3, lsl #5
.Lfunc_0041087C_18:
	orr	r2, r2, r3
.Lfunc_0041087C_1c:
	str	r2, [r0, #4]
.Lfunc_0041087C_20:
	ldrh	r1, [r1, #2]
.Lfunc_0041087C_24:
	mvn	r3, #1610612736
.Lfunc_0041087C_28:
	bic	r2, r2, #532676608
.Lfunc_0041087C_2c:
	bic	r2, r2, #4161536
.Lfunc_0041087C_30:
	and	r1, r3, r1, lsl #15
.Lfunc_0041087C_34:
	orr	r1, r1, r2
.Lfunc_0041087C_38:
	str	r1, [r0, #4]
.Lfunc_0041087C_3c:
	bx	lr
.size func_0041087C, .-func_0041087C

.section .text.func_004175D0,"ax",%progbits
.balign 4
.global func_004175D0
.type func_004175D0, %function
func_004175D0:
.Lfunc_004175D0_0:
	push	{r4}
.Lfunc_004175D0_4:
	ldr	r3, [r0, #40]
.Lfunc_004175D0_8:
	mov	r4, #1
.Lfunc_004175D0_c:
	and	ip, r3, #7680
.Lfunc_004175D0_10:
	bic	r3, r3, #7680
.Lfunc_004175D0_14:
	lsr	ip, ip, #9
.Lfunc_004175D0_18:
	orr	ip, ip, r4, lsl r1
.Lfunc_004175D0_1c:
	and	ip, ip, #255
.Lfunc_004175D0_20:
	mov	r4, #7680
.Lfunc_004175D0_24:
	and	ip, r4, ip, lsl #9
.Lfunc_004175D0_28:
	orr	r3, r3, ip
.Lfunc_004175D0_2c:
	str	r3, [r0, #40]
.Lfunc_004175D0_30:
	add	r0, r0, r1, lsl #2
.Lfunc_004175D0_34:
	str	r2, [r0, #48]
.Lfunc_004175D0_38:
	pop	{r4}
.Lfunc_004175D0_3c:
	bx	lr
.size func_004175D0, .-func_004175D0

.section .text.func_00466688,"ax",%progbits
.balign 4
.global func_00466688
.type func_00466688, %function
func_00466688:
.Lfunc_00466688_0:
	cmp	r1, #2
.Lfunc_00466688_4:
	ldreq	r1, [r0, #4]
.Lfunc_00466688_8:
	orreq	r1, r1, #16777216
.Lfunc_00466688_c:
	beq	.Lfunc_00466688_38
.Lfunc_00466688_10:
	cmp	r1, #3
.Lfunc_00466688_14:
	ldreq	r1, [r0, #4]
.Lfunc_00466688_18:
	orreq	r1, r1, #33554432
.Lfunc_00466688_1c:
	beq	.Lfunc_00466688_38
.Lfunc_00466688_20:
	cmp	r1, #1
.Lfunc_00466688_24:
	bne	.Lfunc_00466688_34
.Lfunc_00466688_28:
	ldr	r1, [r0, #4]
.Lfunc_00466688_2c:
	orr	r1, r1, #67108864
.Lfunc_00466688_30:
	str	r1, [r0, #4]
.Lfunc_00466688_34:
	bx	lr
.Lfunc_00466688_38:
	str	r1, [r0, #4]
.Lfunc_00466688_3c:
	bx	lr
.size func_00466688, .-func_00466688

.section .text.func_004BE6FC,"ax",%progbits
.balign 4
.global func_004BE6FC
.type func_004BE6FC, %function
func_004BE6FC:
.Lfunc_004BE6FC_0:
	ldr	r1, [r0, #52]
.Lfunc_004BE6FC_4:
	ldr	r0, [r0, #44]
.Lfunc_004BE6FC_8:
	mov	r2, #12
.Lfunc_004BE6FC_c:
	lsl	r3, r0, #28
.Lfunc_004BE6FC_10:
	lsl	ip, r0, #30
.Lfunc_004BE6FC_14:
	lsr	r3, r3, #30
.Lfunc_004BE6FC_18:
	lsr	ip, ip, #25
.Lfunc_004BE6FC_1c:
	add	r3, r3, r3, lsl #2
.Lfunc_004BE6FC_20:
	and	r2, r2, r0, lsr #2
.Lfunc_004BE6FC_24:
	add	r3, ip, r3, lsl #2
.Lfunc_004BE6FC_28:
	add	r2, r2, r3
.Lfunc_004BE6FC_2c:
	mov	r3, #8
.Lfunc_004BE6FC_30:
	and	r0, r3, r0, lsr #6
.Lfunc_004BE6FC_34:
	add	r0, r0, r2
.Lfunc_004BE6FC_38:
	add	r0, r0, r1
.Lfunc_004BE6FC_3c:
	bx	lr
.size func_004BE6FC, .-func_004BE6FC

.section .text.func_0014DFCC,"ax",%progbits
.balign 4
.global func_0014DFCC
.type func_0014DFCC, %function
func_0014DFCC:
.Lfunc_0014DFCC_0:
	ldrh	r2, [r0]
.Lfunc_0014DFCC_4:
	cmp	r2, #16
.Lfunc_0014DFCC_8:
	bne	.Lfunc_0014DFCC_34
.Lfunc_0014DFCC_c:
	ldrh	r2, [r0, #2]
.Lfunc_0014DFCC_10:
	cmp	r2, #16
.Lfunc_0014DFCC_14:
	bhi	.Lfunc_0014DFCC_34
.Lfunc_0014DFCC_18:
	cmp	r2, #0
.Lfunc_0014DFCC_1c:
	beq	.Lfunc_0014DFCC_34
.Lfunc_0014DFCC_20:
	sub	r2, r2, #1
.Lfunc_0014DFCC_24:
	cmp	r2, r1
.Lfunc_0014DFCC_28:
	addhi	r0, r0, r1, lsl #1
.Lfunc_0014DFCC_2c:
	ldrhhi	r0, [r0, #6]
.Lfunc_0014DFCC_30:
	bhi	.Lfunc_0014DFCC_38
.Lfunc_0014DFCC_34:
	mov	r0, #0
.Lfunc_0014DFCC_38:
	bx	lr
.size func_0014DFCC, .-func_0014DFCC

.section .text.func_001765B8,"ax",%progbits
.balign 4
.global func_001765B8
.type func_001765B8, %function
func_001765B8:
.Lfunc_001765B8_0:
	cmp	r1, #100
.Lfunc_001765B8_4:
	addcc	r0, r0, r1, lsl #2
.Lfunc_001765B8_8:
	push	{r4, lr}
.Lfunc_001765B8_c:
	ldrcc	r0, [r0, #4]
.Lfunc_001765B8_10:
	bcc	.Lfunc_001765B8_38
.Lfunc_001765B8_14:
	cmp	r1, #200
.Lfunc_001765B8_18:
	addcc	r0, r0, r1, lsl #1
.Lfunc_001765B8_1c:
	ldrhcc	r0, [r0, #204]
.Lfunc_001765B8_20:
	bcc	.Lfunc_001765B8_38
.Lfunc_001765B8_24:
	mov	r2, #0
.Lfunc_001765B8_28:
	mov	r1, r2
.Lfunc_001765B8_2c:
	mov	r0, r2
.Lfunc_001765B8_30:
	mov	r0, r0
.Lfunc_001765B8_34:
	mov	r0, #0
.Lfunc_001765B8_38:
	pop	{r4, pc}
.size func_001765B8, .-func_001765B8

.section .text.func_00198CDC,"ax",%progbits
.balign 4
.global func_00198CDC
.type func_00198CDC, %function
func_00198CDC:
.Lfunc_00198CDC_0:
	ldr	ip, [r0, #784]
.Lfunc_00198CDC_4:
	ldr	r1, [r0, #788]
.Lfunc_00198CDC_8:
	ldr	r2, [r0, #792]
.Lfunc_00198CDC_c:
	ldr	r3, [r0, #796]
.Lfunc_00198CDC_10:
	add	r1, ip, r1
.Lfunc_00198CDC_14:
	add	r2, ip, r2
.Lfunc_00198CDC_18:
	ldrb	ip, [r0, #800]
.Lfunc_00198CDC_1c:
	sub	r2, r2, #1
.Lfunc_00198CDC_20:
	str	r1, [r0, #852]
.Lfunc_00198CDC_24:
	str	r2, [r0, #856]
.Lfunc_00198CDC_28:
	lsl	r3, r3, #24
.Lfunc_00198CDC_2c:
	str	r3, [r0, #848]
.Lfunc_00198CDC_30:
	add	ip, ip, #24
.Lfunc_00198CDC_34:
	str	ip, [r0, #844]
.Lfunc_00198CDC_38:
	bx	lr
.size func_00198CDC, .-func_00198CDC

.section .text.func_001C21FC,"ax",%progbits
.balign 4
.global func_001C21FC
.type func_001C21FC, %function
func_001C21FC:
.Lfunc_001C21FC_0:
	mov	r1, #0
.Lfunc_001C21FC_4:
	str	r1, [r0]
.Lfunc_001C21FC_8:
	str	r1, [r0, #4]
.Lfunc_001C21FC_c:
	str	r1, [r0, #8]
.Lfunc_001C21FC_10:
	str	r1, [r0, #12]
.Lfunc_001C21FC_14:
	str	r1, [r0, #16]
.Lfunc_001C21FC_18:
	str	r1, [r0, #20]
.Lfunc_001C21FC_1c:
	str	r1, [r0, #24]
.Lfunc_001C21FC_20:
	str	r1, [r0, #28]
.Lfunc_001C21FC_24:
	str	r1, [r0, #32]
.Lfunc_001C21FC_28:
	str	r1, [r0, #36]
.Lfunc_001C21FC_2c:
	str	r1, [r0, #40]
.Lfunc_001C21FC_30:
	str	r1, [r0, #44]
.Lfunc_001C21FC_34:
	str	r1, [r0, #48]
.Lfunc_001C21FC_38:
	bx	lr
.size func_001C21FC, .-func_001C21FC
