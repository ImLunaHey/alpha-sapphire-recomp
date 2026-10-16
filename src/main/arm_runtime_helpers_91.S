.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0010E190,"ax",%progbits
.balign 4
.global func_0010E190
.type func_0010E190, %function
func_0010E190:
.Lfunc_0010E190_0:
	ldr	r0, [r0, #376]
.Lfunc_0010E190_4:
	ldr	r0, [r0, #12]
.Lfunc_0010E190_8:
	bx	lr
.size func_0010E190, .-func_0010E190

.section .text.func_0011760C,"ax",%progbits
.balign 4
.global func_0011760C
.type func_0011760C, %function
func_0011760C:
.Lfunc_0011760C_0:
	add	r0, r0, #1536
.Lfunc_0011760C_4:
	ldrsb	r0, [r0, #72]
.Lfunc_0011760C_8:
	bx	lr
.size func_0011760C, .-func_0011760C

.section .text.func_0011775C,"ax",%progbits
.balign 4
.global func_0011775C
.type func_0011775C, %function
func_0011775C:
.Lfunc_0011775C_0:
	ldr	r1, [r0, #4]
.Lfunc_0011775C_4:
	ldrd	r0, [r1, #8]
.Lfunc_0011775C_8:
	bx	lr
.size func_0011775C, .-func_0011775C

.section .text.func_0011C268,"ax",%progbits
.balign 4
.global func_0011C268
.type func_0011C268, %function
func_0011C268:
.Lfunc_0011C268_0:
	add	r0, r0, #4
.Lfunc_0011C268_4:
	stm	r0, {r1, r2}
.Lfunc_0011C268_8:
	bx	lr
.size func_0011C268, .-func_0011C268

.section .text.func_0011F9D0,"ax",%progbits
.balign 4
.global func_0011F9D0
.type func_0011F9D0, %function
func_0011F9D0:
.Lfunc_0011F9D0_0:
	add	r0, r0, #1024
.Lfunc_0011F9D0_4:
	add	r0, r0, #200
.Lfunc_0011F9D0_8:
	bx	lr
.size func_0011F9D0, .-func_0011F9D0

.section .text.func_0011F9DC,"ax",%progbits
.balign 4
.global func_0011F9DC
.type func_0011F9DC, %function
func_0011F9DC:
.Lfunc_0011F9DC_0:
	add	r0, r0, #1024
.Lfunc_0011F9DC_4:
	add	r0, r0, #150
.Lfunc_0011F9DC_8:
	bx	lr
.size func_0011F9DC, .-func_0011F9DC

.section .text.func_00136708,"ax",%progbits
.balign 4
.global func_00136708
.type func_00136708, %function
func_00136708:
.Lfunc_00136708_0:
	add	r0, r1, r1, lsl #1
.Lfunc_00136708_4:
	lsl	r0, r0, #5
.Lfunc_00136708_8:
	bx	lr
.size func_00136708, .-func_00136708

.section .text.func_0015287C,"ax",%progbits
.balign 4
.global func_0015287C
.type func_0015287C, %function
func_0015287C:
.Lfunc_0015287C_0:
	ldr	r0, [r0, #12]
.Lfunc_0015287C_4:
	ldrh	r0, [r0, #8]
.Lfunc_0015287C_8:
	bx	lr
.size func_0015287C, .-func_0015287C

.section .text.func_00153764,"ax",%progbits
.balign 4
.global func_00153764
.type func_00153764, %function
func_00153764:
.Lfunc_00153764_0:
	mov	r1, #1
.Lfunc_00153764_4:
	str	r1, [r0]
.Lfunc_00153764_8:
	bx	lr
.size func_00153764, .-func_00153764

.section .text.func_00153770,"ax",%progbits
.balign 4
.global func_00153770
.type func_00153770, %function
func_00153770:
.Lfunc_00153770_0:
	mrc	15, 0, r0, c13, c0, 3
.Lfunc_00153770_4:
	add	r0, r0, #92
.Lfunc_00153770_8:
	bx	lr
.size func_00153770, .-func_00153770

.section .text.func_00165B78,"ax",%progbits
.balign 4
.global func_00165B78
.type func_00165B78, %function
func_00165B78:
.Lfunc_00165B78_0:
	add	r0, r0, r0, lsl #1
.Lfunc_00165B78_4:
	lsl	r0, r0, #2
.Lfunc_00165B78_8:
	bx	lr
.size func_00165B78, .-func_00165B78

.section .text.func_00170F08,"ax",%progbits
.balign 4
.global func_00170F08
.type func_00170F08, %function
func_00170F08:
.Lfunc_00170F08_0:
	add	r0, r0, #72
.Lfunc_00170F08_4:
	stm	r0, {r1, r2}
.Lfunc_00170F08_8:
	bx	lr
.size func_00170F08, .-func_00170F08

.section .text.func_00172348,"ax",%progbits
.balign 4
.global func_00172348
.type func_00172348, %function
func_00172348:
.Lfunc_00172348_0:
	ldr	r0, [r0, #96]
.Lfunc_00172348_4:
	ldr	r0, [r0, r1, lsl #2]
.Lfunc_00172348_8:
	bx	lr
.size func_00172348, .-func_00172348

.section .text.func_001D8D40,"ax",%progbits
.balign 4
.global func_001D8D40
.type func_001D8D40, %function
func_001D8D40:
.Lfunc_001D8D40_0:
	mov	r1, #1
.Lfunc_001D8D40_4:
	strb	r1, [r0, #180]
.Lfunc_001D8D40_8:
	bx	lr
.size func_001D8D40, .-func_001D8D40

.section .text.func_001DE0A4,"ax",%progbits
.balign 4
.global func_001DE0A4
.type func_001DE0A4, %function
func_001DE0A4:
.Lfunc_001DE0A4_0:
	mov	r1, #1
.Lfunc_001DE0A4_4:
	strb	r1, [r0, #176]
.Lfunc_001DE0A4_8:
	bx	lr
.size func_001DE0A4, .-func_001DE0A4

.section .text.func_001DF24C,"ax",%progbits
.balign 4
.global func_001DF24C
.type func_001DF24C, %function
func_001DF24C:
.Lfunc_001DF24C_0:
	mov	r1, #1
.Lfunc_001DF24C_4:
	strb	r1, [r0, #179]
.Lfunc_001DF24C_8:
	bx	lr
.size func_001DF24C, .-func_001DF24C

.section .text.func_001DF7E4,"ax",%progbits
.balign 4
.global func_001DF7E4
.type func_001DF7E4, %function
func_001DF7E4:
.Lfunc_001DF7E4_0:
	mov	r1, #0
.Lfunc_001DF7E4_4:
	str	r1, [r0, #184]
.Lfunc_001DF7E4_8:
	bx	lr
.size func_001DF7E4, .-func_001DF7E4

.section .text.func_001E0518,"ax",%progbits
.balign 4
.global func_001E0518
.type func_001E0518, %function
func_001E0518:
.Lfunc_001E0518_0:
	mov	r1, #1
.Lfunc_001E0518_4:
	strb	r1, [r0, #177]
.Lfunc_001E0518_8:
	bx	lr
.size func_001E0518, .-func_001E0518

.section .text.func_001E0A44,"ax",%progbits
.balign 4
.global func_001E0A44
.type func_001E0A44, %function
func_001E0A44:
.Lfunc_001E0A44_0:
	mov	r1, #1
.Lfunc_001E0A44_4:
	strb	r1, [r0, #178]
.Lfunc_001E0A44_8:
	bx	lr
.size func_001E0A44, .-func_001E0A44

.section .text.func_001FAD38,"ax",%progbits
.balign 4
.global func_001FAD38
.type func_001FAD38, %function
func_001FAD38:
.Lfunc_001FAD38_0:
	ldr	r0, [r0, #8]
.Lfunc_001FAD38_4:
	ldr	r0, [r0, #8]
.Lfunc_001FAD38_8:
	bx	lr
.size func_001FAD38, .-func_001FAD38

.section .text.func_002066F0,"ax",%progbits
.balign 4
.global func_002066F0
.type func_002066F0, %function
func_002066F0:
.Lfunc_002066F0_0:
	rev	r1, r1
.Lfunc_002066F0_4:
	str	r1, [r0, #8]
.Lfunc_002066F0_8:
	bx	lr
.size func_002066F0, .-func_002066F0

.section .text.func_002066FC,"ax",%progbits
.balign 4
.global func_002066FC
.type func_002066FC, %function
func_002066FC:
.Lfunc_002066FC_0:
	rev16	r1, r1
.Lfunc_002066FC_4:
	strh	r1, [r0, #6]
.Lfunc_002066FC_8:
	bx	lr
.size func_002066FC, .-func_002066FC

.section .text.func_0024CEEC,"ax",%progbits
.balign 4
.global func_0024CEEC
.type func_0024CEEC, %function
func_0024CEEC:
.Lfunc_0024CEEC_0:
	ldr	r0, [r0, #48]
.Lfunc_0024CEEC_4:
	str	r2, [r0, r1, lsl #2]
.Lfunc_0024CEEC_8:
	bx	lr
.size func_0024CEEC, .-func_0024CEEC

.section .text.func_00257DE8,"ax",%progbits
.balign 4
.global func_00257DE8
.type func_00257DE8, %function
func_00257DE8:
.Lfunc_00257DE8_0:
	mov	r1, #0
.Lfunc_00257DE8_4:
	str	r1, [r0, #36]
.Lfunc_00257DE8_8:
	bx	lr
.size func_00257DE8, .-func_00257DE8
