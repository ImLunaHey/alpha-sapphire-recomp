.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001D0078,"ax",%progbits
.balign 4
.global func_001D0078
.type func_001D0078, %function
func_001D0078:
	cmp	r0, #0
	ldrne	r0, [r0, #16]
	addeq	r0, pc, #0
	bx	lr
.size func_001D0078, .-func_001D0078

.section .text.func_0034ACD4,"ax",%progbits
.balign 4
.global func_0034ACD4
.type func_0034ACD4, %function
func_0034ACD4:
	ldr	r0, [r0, #40]
	ldr	r1, [r0]
	ldr	r1, [r1, #52]
	bx	r1
.size func_0034ACD4, .-func_0034ACD4

.section .text.func_0034B0B0,"ax",%progbits
.balign 4
.global func_0034B0B0
.type func_0034B0B0, %function
func_0034B0B0:
	ldr	r0, [r0, #40]
	ldr	r2, [r0]
	ldr	r2, [r2, #48]
	bx	r2
.size func_0034B0B0, .-func_0034B0B0

.section .text.func_003A6524,"ax",%progbits
.balign 4
.global func_003A6524
.type func_003A6524, %function
func_003A6524:
	ldr	r2, [r0]
	ldr	r3, [r2, #12]
	mov	r2, #40
	bx	r3
.size func_003A6524, .-func_003A6524

.section .text.func_003AB314,"ax",%progbits
.balign 4
.global func_003AB314
.type func_003AB314, %function
func_003AB314:
	ldr	r0, [r0, #16]
	cmp	r0, #0
	ldrne	r0, [r0, #12]
	bx	lr
.size func_003AB314, .-func_003AB314

.section .text.func_004C51EC,"ax",%progbits
.balign 4
.global func_004C51EC
.type func_004C51EC, %function
func_004C51EC:
	ldr	r0, [r0, #40]
	ldr	r1, [r0]
	ldr	r1, [r1, #16]
	bx	r1
.size func_004C51EC, .-func_004C51EC

.section .text.func_004C520C,"ax",%progbits
.balign 4
.global func_004C520C
.type func_004C520C, %function
func_004C520C:
	ldr	r0, [r0, #40]
	ldr	r1, [r0]
	ldr	r1, [r1, #20]
	bx	r1
.size func_004C520C, .-func_004C520C
