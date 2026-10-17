.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global runtime_state_init_tail_97
.global runtime_object_shutdown_tail_97
.global func_00160A64
.global func_0018BF20
.global func_00184020
.global func_0017A8E8
.global func_001419C0
.global runtime_fixed_width_transfer_tail_97
.global func_0044D824
.global func_0015EBCC
.global runtime_record_copy_tail_97
.global func_00144D28
.global func_0012FE3C
.global func_002009A4

.section .text.func_001096CC,"ax",%progbits
.balign 4
.global func_001096CC
.type func_001096CC, %function
func_001096CC:
	ldr	r0, [pc, #8]
	mov	r2, #33554432
	mov	r1, #234881024
	b	runtime_state_init_tail_97
.size func_001096CC, .-func_001096CC

.section .text.func_0014870C,"ax",%progbits
.balign 4
.global func_0014870C
.type func_0014870C, %function
func_0014870C:
	mov	r0, r0
	ldr	r0, [pc, #4]
	ldr	r0, [r0, #28]
	b	runtime_object_shutdown_tail_97
.size func_0014870C, .-func_0014870C

.section .text.func_0026B104,"ax",%progbits
.balign 4
.global func_0026B104
.type func_0026B104, %function
func_0026B104:
	push	{r4, lr}
	mov	r0, r0
	pop	{r4, lr}
	b	func_00160A64
.size func_0026B104, .-func_0026B104

.section .text.func_00298E90,"ax",%progbits
.balign 4
.global func_00298E90
.type func_00298E90, %function
func_00298E90:
	mov	r2, r1
	add	r1, pc, #4
	add	r0, r0, #24
	b	func_0018BF20
.size func_00298E90, .-func_00298E90

.section .text.func_002BAF14,"ax",%progbits
.balign 4
.global func_002BAF14
.type func_002BAF14, %function
func_002BAF14:
	mov	r3, #1504
	strh	r2, [r3, r0]
	add	r0, r0, #20
	b	func_00184020
.size func_002BAF14, .-func_002BAF14

.section .text.func_00320890,"ax",%progbits
.balign 4
.global func_00320890
.type func_00320890, %function
func_00320890:
	mov	r2, r1
	add	r1, r0, #4
	add	r2, r2, #4
	b	func_0017A8E8
.size func_00320890, .-func_00320890

.section .text.func_00322574,"ax",%progbits
.balign 4
.global func_00322574
.type func_00322574, %function
func_00322574:
	add	r0, r0, #28
	mov	r2, r1
	add	r1, r0, #4
	b	func_0017A8E8
.size func_00322574, .-func_00322574

.section .text.func_0032A060,"ax",%progbits
.balign 4
.global func_0032A060
.type func_0032A060, %function
func_0032A060:
	ldr	r2, [pc, #8]
	ldr	r0, [r0, #724]
	ldr	r1, [r2, r1, lsl #2]
	b	func_001419C0
.size func_0032A060, .-func_0032A060

.section .text.func_0032A1D0,"ax",%progbits
.balign 4
.global func_0032A1D0
.type func_0032A1D0, %function
func_0032A1D0:
	add	r0, r0, r1, lsl #2
	mov	r1, r2
	ldr	r0, [r0, #464]
	b	func_001419C0
.size func_0032A1D0, .-func_0032A1D0

.section .text.func_00417478,"ax",%progbits
.balign 4
.global func_00417478
.type func_00417478, %function
func_00417478:
	mov	r2, r1
	mov	r1, #8
	add	r0, r0, #12
	b	runtime_fixed_width_transfer_tail_97
.size func_00417478, .-func_00417478

.section .text.func_0044F08C,"ax",%progbits
.balign 4
.global func_0044F08C
.type func_0044F08C, %function
func_0044F08C:
	mov	r1, r0
	ldr	r0, [pc, #4]
	ldr	r0, [r0, #16]
	b	func_0044D824
.size func_0044F08C, .-func_0044F08C

.section .text.func_00464B0C,"ax",%progbits
.balign 4
.global func_00464B0C
.type func_00464B0C, %function
func_00464B0C:
	add	r0, r0, #256
	mov	r1, #34
	add	r0, r0, #46
	b	func_0015EBCC
.size func_00464B0C, .-func_00464B0C

.section .text.func_00464E78,"ax",%progbits
.balign 4
.global func_00464E78
.type func_00464E78, %function
func_00464E78:
	ldrb	r2, [r0, #13]
	add	r1, r0, #56
	add	r0, r0, #56
	b	runtime_record_copy_tail_97
.size func_00464E78, .-func_00464E78

.section .text.func_00465080,"ax",%progbits
.balign 4
.global func_00465080
.type func_00465080, %function
func_00465080:
	mov	r2, #368
	add	r1, r1, #8
	add	r0, r0, #8
	b	func_00144D28
.size func_00465080, .-func_00465080

.section .text.func_00466E1C,"ax",%progbits
.balign 4
.global func_00466E1C
.type func_00466E1C, %function
func_00466E1C:
	mov	r2, #84
	add	r1, r1, #4
	add	r0, r0, #248
	b	func_00144D28
.size func_00466E1C, .-func_00466E1C

.section .text.func_004A9E20,"ax",%progbits
.balign 4
.global func_004A9E20
.type func_004A9E20, %function
func_004A9E20:
	mov	r2, r1
	mov	r1, r0
	mov	r0, r2
	b	func_0012FE3C
.size func_004A9E20, .-func_004A9E20

.section .text.func_004C85FC,"ax",%progbits
.balign 4
.global func_004C85FC
.type func_004C85FC, %function
func_004C85FC:
	movs	r0, r1
	beq	.Lfunc_004C85FC_return
	b	func_002009A4
.Lfunc_004C85FC_return:
	bx	lr
.size func_004C85FC, .-func_004C85FC
