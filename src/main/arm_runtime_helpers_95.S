.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global global_state_02
.global runtime_float_zero_38
.global runtime_default_pair_95
.global runtime_indexed_word_table_95

.section .text.func_00109724,"ax",%progbits
.balign 4
.global func_00109724
.type func_00109724, %function
func_00109724:
	mrc	p15, 0, r0, c13, c0, 3
	ldr	r1, .Lglobal_state_02
	str	r0, [r1, #4]
	bx	lr
.size func_00109724, .-func_00109724
.Lglobal_state_02:
	.word	global_state_02

.section .text.func_00136BFC,"ax",%progbits
.balign 4
.global func_00136BFC
.type func_00136BFC, %function
func_00136BFC:
	add	r0, r0, #116
	vldr	s3, .Lruntime_float_zero_38
	vstmia	r0, {s0-s3}
	bx	lr
.size func_00136BFC, .-func_00136BFC
.Lruntime_float_zero_38:
	.word	runtime_float_zero_38

.section .text.func_001D2C7C,"ax",%progbits
.balign 4
.global func_001D2C7C
.type func_001D2C7C, %function
func_001D2C7C:
	ldr	r2, .Lruntime_default_pair_95
	ldm	r2, {r1, r2}
	stm	r0, {r1, r2}
	bx	lr
.size func_001D2C7C, .-func_001D2C7C
.Lruntime_default_pair_95:
	.word	runtime_default_pair_95

.section .text.func_0032F1B0,"ax",%progbits
.balign 4
.global func_0032F1B0
.type func_0032F1B0, %function
func_0032F1B0:
	ldr	r2, .Lruntime_indexed_word_table_95
	ldr	r1, [r2, r1, lsl #2]
	str	r1, [r0, #16]
	bx	lr
.size func_0032F1B0, .-func_0032F1B0
.Lruntime_indexed_word_table_95:
	.word	runtime_indexed_word_table_95
