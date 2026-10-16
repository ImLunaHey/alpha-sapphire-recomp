.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00170C70,"ax",%progbits
.balign 4
.global func_00170C70
.type func_00170C70, %function
func_00170C70:
.Lfunc_00170C70_0:
	mov	r0, r1
.Lfunc_00170C70_4:
	mov	r0, r0
.Lfunc_00170C70_8:
	ldr	r0, [r0, #-12]
.Lfunc_00170C70_c:
	bx	lr
.size func_00170C70, .-func_00170C70

.section .text.func_001783A8,"ax",%progbits
.balign 4
.global func_001783A8
.type func_001783A8, %function
func_001783A8:
.Lfunc_001783A8_0:
	add	r2, r0, #36
.Lfunc_001783A8_4:
	ldrh	r0, [r0, #52]
.Lfunc_001783A8_8:
	strh	r1, [r2, #16]
.Lfunc_001783A8_c:
	bx	lr
.size func_001783A8, .-func_001783A8

.section .text.func_0017850C,"ax",%progbits
.balign 4
.global func_0017850C
.type func_0017850C, %function
func_0017850C:
.Lfunc_0017850C_0:
	add	r2, r0, #36
.Lfunc_0017850C_4:
	ldrsb	r0, [r0, #56]
.Lfunc_0017850C_8:
	strb	r1, [r2, #20]
.Lfunc_0017850C_c:
	bx	lr
.size func_0017850C, .-func_0017850C

.section .text.func_00179CF4,"ax",%progbits
.balign 4
.global func_00179CF4
.type func_00179CF4, %function
func_00179CF4:
.Lfunc_00179CF4_0:
	ldr	r2, [r0, #44]
.Lfunc_00179CF4_4:
	orr	r1, r1, r2
.Lfunc_00179CF4_8:
	str	r1, [r0, #44]
.Lfunc_00179CF4_c:
	bx	lr
.size func_00179CF4, .-func_00179CF4

.section .text.func_001808D0,"ax",%progbits
.balign 4
.global func_001808D0
.type func_001808D0, %function
func_001808D0:
.Lfunc_001808D0_0:
	add	r0, r0, r1, lsl #1
.Lfunc_001808D0_4:
	add	r0, r0, #256
.Lfunc_001808D0_8:
	strh	r2, [r0, #12]
.Lfunc_001808D0_c:
	bx	lr
.size func_001808D0, .-func_001808D0

.section .text.func_001E51C8,"ax",%progbits
.balign 4
.global func_001E51C8
.type func_001E51C8, %function
func_001E51C8:
.Lfunc_001E51C8_0:
	ldr	r0, [r0, #2792]
.Lfunc_001E51C8_4:
	cmp	r0, #0
.Lfunc_001E51C8_8:
	movlt	r0, #0
.Lfunc_001E51C8_c:
	bx	lr
.size func_001E51C8, .-func_001E51C8

.section .text.func_001FBC00,"ax",%progbits
.balign 4
.global func_001FBC00
.type func_001FBC00, %function
func_001FBC00:
.Lfunc_001FBC00_0:
	mrc	15, 0, r2, c13, c0, 3
.Lfunc_001FBC00_4:
	ldr	r0, [r0]
.Lfunc_001FBC00_8:
	str	r1, [r2, r0, lsl #2]
.Lfunc_001FBC00_c:
	bx	lr
.size func_001FBC00, .-func_001FBC00

.section .text.func_00205BFC,"ax",%progbits
.balign 4
.global func_00205BFC
.type func_00205BFC, %function
func_00205BFC:
.Lfunc_00205BFC_0:
	ldr	r2, [r0, #12]
.Lfunc_00205BFC_4:
	bic	r1, r2, r1
.Lfunc_00205BFC_8:
	str	r1, [r0, #12]
.Lfunc_00205BFC_c:
	bx	lr
.size func_00205BFC, .-func_00205BFC

.section .text.func_00228F30,"ax",%progbits
.balign 4
.global func_00228F30
.type func_00228F30, %function
func_00228F30:
.Lfunc_00228F30_0:
	ldr	r0, [r0, #16]
.Lfunc_00228F30_4:
	cmp	r0, #0
.Lfunc_00228F30_8:
	strne	r1, [r0, #60]
.Lfunc_00228F30_c:
	bx	lr
.size func_00228F30, .-func_00228F30

.section .text.func_00235514,"ax",%progbits
.balign 4
.global func_00235514
.type func_00235514, %function
func_00235514:
.Lfunc_00235514_0:
	ldrb	r2, [r0, #159]
.Lfunc_00235514_4:
	cmp	r2, #0
.Lfunc_00235514_8:
	strbne	r1, [r0, #168]
.Lfunc_00235514_c:
	bx	lr
.size func_00235514, .-func_00235514

.section .text.func_002538D0,"ax",%progbits
.balign 4
.global func_002538D0
.type func_002538D0, %function
func_002538D0:
.Lfunc_002538D0_0:
	str	r1, [r0, #72]
.Lfunc_002538D0_4:
	ldr	r1, [r2]
.Lfunc_002538D0_8:
	str	r1, [r0, #76]
.Lfunc_002538D0_c:
	bx	lr
.size func_002538D0, .-func_002538D0

.section .text.func_002AD614,"ax",%progbits
.balign 4
.global func_002AD614
.type func_002AD614, %function
func_002AD614:
.Lfunc_002AD614_0:
	mov	r1, #1
.Lfunc_002AD614_4:
	strb	r1, [r0, #528]
.Lfunc_002AD614_8:
	strb	r1, [r0, #531]
.Lfunc_002AD614_c:
	bx	lr
.size func_002AD614, .-func_002AD614

.section .text.func_002C0C58,"ax",%progbits
.balign 4
.global func_002C0C58
.type func_002C0C58, %function
func_002C0C58:
.Lfunc_002C0C58_0:
	add	r0, r0, #4096
.Lfunc_002C0C58_4:
	add	r0, r0, #340
.Lfunc_002C0C58_8:
	stm	r0, {r1, r2}
.Lfunc_002C0C58_c:
	bx	lr
.size func_002C0C58, .-func_002C0C58

.section .text.func_002C6D64,"ax",%progbits
.balign 4
.global func_002C6D64
.type func_002C6D64, %function
func_002C6D64:
.Lfunc_002C6D64_0:
	mov	r1, #0
.Lfunc_002C6D64_4:
	strh	r1, [r0, #6]
.Lfunc_002C6D64_8:
	str	r1, [r0, #8]
.Lfunc_002C6D64_c:
	bx	lr
.size func_002C6D64, .-func_002C6D64

.section .text.func_00321B48,"ax",%progbits
.balign 4
.global func_00321B48
.type func_00321B48, %function
func_00321B48:
.Lfunc_00321B48_0:
	ldrd	r0, [r0]
.Lfunc_00321B48_4:
	ldr	r0, [r0]
.Lfunc_00321B48_8:
	add	r0, r0, r1
.Lfunc_00321B48_c:
	bx	lr
.size func_00321B48, .-func_00321B48

.section .text.func_0032ECB0,"ax",%progbits
.balign 4
.global func_0032ECB0
.type func_0032ECB0, %function
func_0032ECB0:
.Lfunc_0032ECB0_0:
	ldr	r0, [r0, #12]
.Lfunc_0032ECB0_4:
	cmp	r0, #0
.Lfunc_0032ECB0_8:
	movne	r0, #1
.Lfunc_0032ECB0_c:
	bx	lr
.size func_0032ECB0, .-func_0032ECB0

.section .text.func_0033953C,"ax",%progbits
.balign 4
.global func_0033953C
.type func_0033953C, %function
func_0033953C:
.Lfunc_0033953C_0:
	mov	r1, #0
.Lfunc_0033953C_4:
	str	r1, [r0, #1656]
.Lfunc_0033953C_8:
	str	r1, [r0, #1660]
.Lfunc_0033953C_c:
	bx	lr
.size func_0033953C, .-func_0033953C

.section .text.func_00389348,"ax",%progbits
.balign 4
.global func_00389348
.type func_00389348, %function
func_00389348:
.Lfunc_00389348_0:
	ldr	r0, [r0, #80]
.Lfunc_00389348_4:
	cmp	r0, #0
.Lfunc_00389348_8:
	strbne	r1, [r0, #36]
.Lfunc_00389348_c:
	bx	lr
.size func_00389348, .-func_00389348

.section .text.func_0038A8D0,"ax",%progbits
.balign 4
.global func_0038A8D0
.type func_0038A8D0, %function
func_0038A8D0:
.Lfunc_0038A8D0_0:
	ldr	r0, [r0, #80]
.Lfunc_0038A8D0_4:
	cmp	r0, #0
.Lfunc_0038A8D0_8:
	vstrne	s0, [r0, #32]
.Lfunc_0038A8D0_c:
	bx	lr
.size func_0038A8D0, .-func_0038A8D0

.section .text.func_003962E4,"ax",%progbits
.balign 4
.global func_003962E4
.type func_003962E4, %function
func_003962E4:
.Lfunc_003962E4_0:
	mov	r1, #1
.Lfunc_003962E4_4:
	mov	r2, #4
.Lfunc_003962E4_8:
	stm	r0, {r1, r2}
.Lfunc_003962E4_c:
	bx	lr
.size func_003962E4, .-func_003962E4

.section .text.func_003E8280,"ax",%progbits
.balign 4
.global func_003E8280
.type func_003E8280, %function
func_003E8280:
.Lfunc_003E8280_0:
	ldr	r0, [r0, #380]
.Lfunc_003E8280_4:
	mov	r1, #1
.Lfunc_003E8280_8:
	strb	r1, [r0, #1]
.Lfunc_003E8280_c:
	bx	lr
.size func_003E8280, .-func_003E8280

.section .text.func_003F4910,"ax",%progbits
.balign 4
.global func_003F4910
.type func_003F4910, %function
func_003F4910:
.Lfunc_003F4910_0:
	ldr	r2, [r0, #8]
.Lfunc_003F4910_4:
	orr	r1, r1, r2
.Lfunc_003F4910_8:
	str	r1, [r0, #8]
.Lfunc_003F4910_c:
	bx	lr
.size func_003F4910, .-func_003F4910

.section .text.func_0040AA8C,"ax",%progbits
.balign 4
.global func_0040AA8C
.type func_0040AA8C, %function
func_0040AA8C:
.Lfunc_0040AA8C_0:
	add	r0, r1, r0, lsl #4
.Lfunc_0040AA8C_4:
	add	r0, r0, #55
.Lfunc_0040AA8C_8:
	bic	r0, r0, #31
.Lfunc_0040AA8C_c:
	bx	lr
.size func_0040AA8C, .-func_0040AA8C

.section .text.func_0040CC88,"ax",%progbits
.balign 4
.global func_0040CC88
.type func_0040CC88, %function
func_0040CC88:
.Lfunc_0040CC88_0:
	add	r1, r1, r1, lsl #3
.Lfunc_0040CC88_4:
	add	r0, r0, r1, lsl #1
.Lfunc_0040CC88_8:
	add	r0, r0, #8
.Lfunc_0040CC88_c:
	bx	lr
.size func_0040CC88, .-func_0040CC88
