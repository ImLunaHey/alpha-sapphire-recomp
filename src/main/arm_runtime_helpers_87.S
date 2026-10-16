.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0029FA24,"ax",%progbits
.balign 4
.global func_0029FA24
.type func_0029FA24, %function
func_0029FA24:
	mov	r2, #1
	mov	r1, #0
	strb	r2, [r0, #528]
	strb	r1, [r0, #531]
	bx	lr
.size func_0029FA24, .-func_0029FA24

.section .text.func_002AF994,"ax",%progbits
.balign 4
.global func_002AF994
.type func_002AF994, %function
func_002AF994:
	ldr	r1, [r0, #8]
	ldr	r1, [r1, #16]
	lsl	r1, r1, #3
	str	r1, [r0, #20]
	bx	lr
.size func_002AF994, .-func_002AF994

.section .text.func_002B08CC,"ax",%progbits
.balign 4
.global func_002B08CC
.type func_002B08CC, %function
func_002B08CC:
	mov	r1, #0
	str	r1, [r0, #8]
	str	r1, [r0]
	str	r1, [r0, #4]
	bx	lr
.size func_002B08CC, .-func_002B08CC

.section .text.func_002C0CD4,"ax",%progbits
.balign 4
.global func_002C0CD4
.type func_002C0CD4, %function
func_002C0CD4:
	add	r0, r0, #4096
	mov	r1, #0
	str	r1, [r0, #340]
	str	r1, [r0, #344]
	bx	lr
.size func_002C0CD4, .-func_002C0CD4

.section .text.func_00329A60,"ax",%progbits
.balign 4
.global func_00329A60
.type func_00329A60, %function
func_00329A60:
	mov	r1, #0
	strb	r1, [r0]
	strb	r1, [r0, #1]
	str	r1, [r0, #4]
	bx	lr
.size func_00329A60, .-func_00329A60

.section .text.func_0032AC04,"ax",%progbits
.balign 4
.global func_0032AC04
.type func_0032AC04, %function
func_0032AC04:
	ldr	r0, [r0]
	cmp	r0, #0
	movne	r1, #0
	strne	r1, [r0, #32]
	bx	lr
.size func_0032AC04, .-func_0032AC04

.section .text.func_003304A8,"ax",%progbits
.balign 4
.global func_003304A8
.type func_003304A8, %function
func_003304A8:
	cmp	r0, #0
	cmpne	r0, #1
	movne	r0, #3
	beq	.Lfunc_003304A8_return
.Lfunc_003304A8_return:
	bx	lr
.size func_003304A8, .-func_003304A8

.section .text.func_00330584,"ax",%progbits
.balign 4
.global func_00330584
.type func_00330584, %function
func_00330584:
	add	ip, r0, #24
	mvn	r3, #0
	stm	ip, {r1, r2, r3}
	str	r3, [r0, #36]
	bx	lr
.size func_00330584, .-func_00330584

.section .text.func_00332FC0,"ax",%progbits
.balign 4
.global func_00332FC0
.type func_00332FC0, %function
func_00332FC0:
	cmp	r1, #16
	addlt	r0, r0, r1, lsl #1
	addlt	r0, r0, #268
	movge	r0, #0
	bx	lr
.size func_00332FC0, .-func_00332FC0

.section .text.func_0034ABD0,"ax",%progbits
.balign 4
.global func_0034ABD0
.type func_0034ABD0, %function
func_0034ABD0:
	ldr	r3, [r0, #4]
	cmp	r3, #0
	streq	r2, [r0, #8]!
	streq	r1, [r0, #4]
	bx	lr
.size func_0034ABD0, .-func_0034ABD0

.section .text.func_003625DC,"ax",%progbits
.balign 4
.global func_003625DC
.type func_003625DC, %function
func_003625DC:
	ldr	r0, [r0, #28]
	mov	r3, #5
	add	r1, r3, r1, lsl #3
	strb	r2, [r0, r1]
	bx	lr
.size func_003625DC, .-func_003625DC

.section .text.func_0038A088,"ax",%progbits
.balign 4
.global func_0038A088
.type func_0038A088, %function
func_0038A088:
	ldr	r0, [r0, #76]
	ldr	r2, [r0, #4]
	cmp	r2, #0
	strne	r1, [r0, #12]
	bx	lr
.size func_0038A088, .-func_0038A088

.section .text.func_0038CE90,"ax",%progbits
.balign 4
.global func_0038CE90
.type func_0038CE90, %function
func_0038CE90:
	ldr	r0, [r0, #48]
	add	r2, r2, r2, lsl #1
	ldr	r0, [r0, r2, lsl #2]
	str	r1, [r0, #12]
	bx	lr
.size func_0038CE90, .-func_0038CE90

.section .text.func_00395B0C,"ax",%progbits
.balign 4
.global func_00395B0C
.type func_00395B0C, %function
func_00395B0C:
	ldrb	r2, [r1, #29]
	strb	r2, [r0, #29]
	ldr	r1, [r1, #32]
	str	r1, [r0, #32]
	bx	lr
.size func_00395B0C, .-func_00395B0C

.section .text.func_0039B2F4,"ax",%progbits
.balign 4
.global func_0039B2F4
.type func_0039B2F4, %function
func_0039B2F4:
	ldrd	r2, [r1]
	ldr	r1, [r1, #8]
	str	r1, [r0, #240]
	strd	r2, [r0, #232]
	bx	lr
.size func_0039B2F4, .-func_0039B2F4

.section .text.func_003AB324,"ax",%progbits
.balign 4
.global func_003AB324
.type func_003AB324, %function
func_003AB324:
	ldrb	r1, [r0, #9]
	cmp	r1, #0
	ldrne	r0, [r0, #12]
	moveq	r0, #0
	bx	lr
.size func_003AB324, .-func_003AB324

.section .text.func_0040AE08,"ax",%progbits
.balign 4
.global func_0040AE08
.type func_0040AE08, %function
func_0040AE08:
	add	r2, r0, r0, lsl #1
	add	r0, r2, r0, lsl #4
	add	r0, r1, r0, lsl #3
	add	r0, r0, #24
	bx	lr
.size func_0040AE08, .-func_0040AE08

.section .text.func_00417650,"ax",%progbits
.balign 4
.global func_00417650
.type func_00417650, %function
func_00417650:
	cmp	r1, #900
	strhlt	r1, [r0]
	movge	r0, #0
	movlt	r0, #1
	bx	lr
.size func_00417650, .-func_00417650

.section .text.func_0041B278,"ax",%progbits
.balign 4
.global func_0041B278
.type func_0041B278, %function
func_0041B278:
	ldr	r0, [r0, #28]
	ldr	r2, [r0, #4]
	bic	r1, r2, r1
	str	r1, [r0, #4]
	bx	lr
.size func_0041B278, .-func_0041B278

.section .text.func_00439148,"ax",%progbits
.balign 4
.global func_00439148
.type func_00439148, %function
func_00439148:
	mov	r1, #0
	strb	r1, [r0, #275]
	strb	r1, [r0, #273]
	strb	r1, [r0, #274]
	bx	lr
.size func_00439148, .-func_00439148

.section .text.func_0045B158,"ax",%progbits
.balign 4
.global func_0045B158
.type func_0045B158, %function
func_0045B158:
	ldrb	r3, [r0, #1592]
	mov	r2, #0
	strb	r3, [r0, #1593]
	strb	r2, [r0, #1592]
	bx	lr
.size func_0045B158, .-func_0045B158

.section .text.func_0045CCB4,"ax",%progbits
.balign 4
.global func_0045CCB4
.type func_0045CCB4, %function
func_0045CCB4:
	add	r0, r0, r1
	ldrb	r1, [r0, #70]
	add	r1, r1, #1
	strb	r1, [r0, #70]
	bx	lr
.size func_0045CCB4, .-func_0045CCB4

.section .text.func_0045CCC8,"ax",%progbits
.balign 4
.global func_0045CCC8
.type func_0045CCC8, %function
func_0045CCC8:
	add	r0, r0, r1
	ldrb	r1, [r0, #80]
	add	r1, r1, #1
	strb	r1, [r0, #80]
	bx	lr
.size func_0045CCC8, .-func_0045CCC8

.section .text.func_0045CCDC,"ax",%progbits
.balign 4
.global func_0045CCDC
.type func_0045CCDC, %function
func_0045CCDC:
	add	r0, r0, r1
	ldrb	r1, [r0, #90]
	add	r1, r1, #1
	strb	r1, [r0, #90]
	bx	lr
.size func_0045CCDC, .-func_0045CCDC
