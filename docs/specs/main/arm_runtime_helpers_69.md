# Probe-verified ARM runtime/helper batch 69

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 5,844 executable body bytes (1,461 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and independently
assembled exact-schedule probes. The batch excludes every previously configured
function.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected body, no direct or indirect call, no external branch, no
relocation, no PC-relative data access, no adjacent data, and no embedded private
string or asset. Each body is byte-unique in the current target inventory, so no
member belongs to an exact-duplicate family. The private inspection artifacts
used for selection are not part of this specification and were not retained.
Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on
2026-10-16 matched all twenty-four complete bodies (5,844 bytes / 1,461
instructions).

## Structural inventory

| Function | Bytes | Instructions | Local branches | Memory operations |
| --- | ---: | ---: | ---: | ---: |
| `func_004C7A54` | 308 | 77 | 6 | 24 |
| `func_005757BC` | 296 | 74 | 10 | 29 |
| `func_005759F4` | 288 | 72 | 9 | 37 |
| `func_004B5F14` | 284 | 71 | 6 | 5 |
| `func_0045A144` | 280 | 70 | 4 | 21 |
| `func_004A8C08` | 272 | 68 | 0 | 38 |
| `func_005224B4` | 272 | 68 | 11 | 15 |
| `func_005758E4` | 272 | 68 | 9 | 31 |
| `func_0014E240` | 264 | 66 | 16 | 14 |
| `func_0040282C` | 264 | 66 | 7 | 12 |
| `func_001CFC08` | 252 | 63 | 11 | 16 |
| `func_00111008` | 248 | 62 | 10 | 20 |
| `func_004B60DC` | 248 | 62 | 9 | 10 |
| `func_00110F14` | 244 | 61 | 10 | 20 |
| `func_00190568` | 240 | 60 | 3 | 28 |
| `func_00195160` | 220 | 55 | 8 | 4 |
| `func_001FAE40` | 220 | 55 | 5 | 18 |
| `func_0056DD44` | 216 | 54 | 10 | 21 |
| `func_001F3D9C` | 208 | 52 | 9 | 18 |
| `func_00549E14` | 204 | 51 | 4 | 12 |
| `func_00188338` | 196 | 49 | 8 | 10 |
| `func_0013F394` | 184 | 46 | 17 | 12 |
| `func_001C3238` | 184 | 46 | 13 | 0 |
| `func_0014E170` | 180 | 45 | 7 | 13 |

Memory-operation counts include scalar and VFP loads/stores plus stack
transfers. Return transfers are excluded from the local-branch column.

## Exact schedules

The following is the complete independently assembled artifact. Every function
has a zero-byte adjacent-data schedule. Local labels may be renamed
consistently. Preserve every mnemonic, operand, condition, memory mode,
instruction order, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004C7A54,"ax",%progbits
.balign 4
.global func_004C7A54
.type func_004C7A54, %function
func_004C7A54:
.Lfunc_004C7A54_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_004C7A54_4:
	bic	r4, r3, r2
.Lfunc_004C7A54_8:
	ldr	ip, [sp, #20]
.Lfunc_004C7A54_c:
	ldr	r0, [r0, #8]
.Lfunc_004C7A54_10:
	tst	r2, ip
.Lfunc_004C7A54_14:
	movne	r5, #1
.Lfunc_004C7A54_18:
	moveq	r5, #0
.Lfunc_004C7A54_1c:
	ands	r4, r4, ip
.Lfunc_004C7A54_20:
	movne	r4, #1
.Lfunc_004C7A54_24:
	bic	r2, r2, r3
.Lfunc_004C7A54_28:
	ldr	r0, [r0, #12]
.Lfunc_004C7A54_2c:
	tst	r2, ip
.Lfunc_004C7A54_30:
	movne	r6, #1
.Lfunc_004C7A54_34:
	moveq	r6, #0
.Lfunc_004C7A54_38:
	cmp	r0, #0
.Lfunc_004C7A54_3c:
	bne	.Lfunc_004C7A54_4c
.Lfunc_004C7A54_40:
	cmp	r5, #0
.Lfunc_004C7A54_44:
	movne	r7, #1
.Lfunc_004C7A54_48:
	bne	.Lfunc_004C7A54_50
.Lfunc_004C7A54_4c:
	mov	r7, #0
.Lfunc_004C7A54_50:
	add	r0, r1, #16
.Lfunc_004C7A54_54:
	cmp	r4, #0
.Lfunc_004C7A54_58:
	ldm	r0, {r0, r2}
.Lfunc_004C7A54_5c:
	ldr	r3, [r1, #12]
.Lfunc_004C7A54_60:
	ldr	r4, [r1, #8]
.Lfunc_004C7A54_64:
	beq	.Lfunc_004C7A54_b8
.Lfunc_004C7A54_68:
	tst	r3, ip
.Lfunc_004C7A54_6c:
	bic	r4, r4, ip
.Lfunc_004C7A54_70:
	bic	r3, r3, ip
.Lfunc_004C7A54_74:
	beq	.Lfunc_004C7A54_98
.Lfunc_004C7A54_78:
	add	r5, r1, #16
.Lfunc_004C7A54_7c:
	str	r3, [r1, #12]
.Lfunc_004C7A54_80:
	bic	r0, r0, ip
.Lfunc_004C7A54_84:
	bic	r2, r2, ip
.Lfunc_004C7A54_88:
	str	r4, [r1, #8]
.Lfunc_004C7A54_8c:
	stm	r5, {r0, r2}
.Lfunc_004C7A54_90:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_004C7A54_94:
	bx	lr
.Lfunc_004C7A54_98:
	add	r5, r1, #16
.Lfunc_004C7A54_9c:
	str	r3, [r1, #12]
.Lfunc_004C7A54_a0:
	orr	r0, r0, ip
.Lfunc_004C7A54_a4:
	bic	r2, r2, ip
.Lfunc_004C7A54_a8:
	str	r4, [r1, #8]
.Lfunc_004C7A54_ac:
	stm	r5, {r0, r2}
.Lfunc_004C7A54_b0:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_004C7A54_b4:
	bx	lr
.Lfunc_004C7A54_b8:
	tst	r0, ip
.Lfunc_004C7A54_bc:
	beq	.Lfunc_004C7A54_f8
.Lfunc_004C7A54_c0:
	cmp	r6, #0
.Lfunc_004C7A54_c4:
	beq	.Lfunc_004C7A54_f8
.Lfunc_004C7A54_c8:
	bic	r0, r0, ip
.Lfunc_004C7A54_cc:
	str	r0, [r1, #16]
.Lfunc_004C7A54_d0:
	cmp	r7, #0
.Lfunc_004C7A54_d4:
	bic	r3, r3, ip
.Lfunc_004C7A54_d8:
	orr	r4, r4, ip
.Lfunc_004C7A54_dc:
	str	r3, [r1, #12]
.Lfunc_004C7A54_e0:
	biceq	r0, r2, ip
.Lfunc_004C7A54_e4:
	orrne	r0, r2, ip
.Lfunc_004C7A54_e8:
	str	r4, [r1, #8]
.Lfunc_004C7A54_ec:
	str	r0, [r1, #20]
.Lfunc_004C7A54_f0:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_004C7A54_f4:
	bx	lr
.Lfunc_004C7A54_f8:
	cmp	r5, #0
.Lfunc_004C7A54_fc:
	movne	r5, ip
.Lfunc_004C7A54_100:
	orr	r4, r4, r5
.Lfunc_004C7A54_104:
	cmp	r6, #0
.Lfunc_004C7A54_108:
	str	r4, [r1, #8]
.Lfunc_004C7A54_10c:
	movne	r4, ip
.Lfunc_004C7A54_110:
	moveq	r4, #0
.Lfunc_004C7A54_114:
	cmp	r7, #0
.Lfunc_004C7A54_118:
	orr	r3, r3, r4
.Lfunc_004C7A54_11c:
	moveq	ip, #0
.Lfunc_004C7A54_120:
	orr	r0, r2, ip
.Lfunc_004C7A54_124:
	str	r3, [r1, #12]
.Lfunc_004C7A54_128:
	str	r0, [r1, #20]
.Lfunc_004C7A54_12c:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_004C7A54_130:
	bx	lr
.size func_004C7A54, .-func_004C7A54

.section .text.func_005757BC,"ax",%progbits
.balign 4
.global func_005757BC
.type func_005757BC, %function
func_005757BC:
.Lfunc_005757BC_0:
	cmp	r0, r1
.Lfunc_005757BC_4:
	bxeq	lr
.Lfunc_005757BC_8:
	push	{r4, r5, r6, r7}
.Lfunc_005757BC_c:
	add	r6, r0, #16
.Lfunc_005757BC_10:
	cmp	r6, r1
.Lfunc_005757BC_14:
	sub	sp, sp, #8
.Lfunc_005757BC_18:
	beq	.Lfunc_005757BC_11c
.Lfunc_005757BC_1c:
	ldr	r5, [r6]
.Lfunc_005757BC_20:
	ldr	ip, [r0]
.Lfunc_005757BC_24:
	ldr	r3, [r6, #4]
.Lfunc_005757BC_28:
	ldr	r4, [r0, #4]
.Lfunc_005757BC_2c:
	subs	ip, r5, ip
.Lfunc_005757BC_30:
	mov	r2, r6
.Lfunc_005757BC_34:
	sbcs	ip, r3, r4
.Lfunc_005757BC_38:
	add	r4, r6, #8
.Lfunc_005757BC_3c:
	vldmia	r4, {s0-s1}
.Lfunc_005757BC_40:
	bcs	.Lfunc_005757BC_c0
.Lfunc_005757BC_44:
	sub	r4, r2, r0
.Lfunc_005757BC_48:
	add	ip, r2, #16
.Lfunc_005757BC_4c:
	asr	r7, r4, #4
.Lfunc_005757BC_50:
	cmp	r7, #0
.Lfunc_005757BC_54:
	ble	.Lfunc_005757BC_ac
.Lfunc_005757BC_58:
	lsls	r7, r4, #27
.Lfunc_005757BC_5c:
	bpl	.Lfunc_005757BC_70
.Lfunc_005757BC_60:
	sub	r2, r6, #16
.Lfunc_005757BC_64:
	sub	ip, ip, #16
.Lfunc_005757BC_68:
	vldmia	r2, {s2-s5}
.Lfunc_005757BC_6c:
	vstmia	ip, {s2-s5}
.Lfunc_005757BC_70:
	asrs	r4, r4, #5
.Lfunc_005757BC_74:
	beq	.Lfunc_005757BC_ac
.Lfunc_005757BC_78:
	mov	r7, ip
.Lfunc_005757BC_7c:
	vldr	s2, [r2, #-16]
.Lfunc_005757BC_80:
	vldr	s3, [r2, #-12]
.Lfunc_005757BC_84:
	vldr	s4, [r2, #-8]
.Lfunc_005757BC_88:
	vldr	s5, [r2, #-4]
.Lfunc_005757BC_8c:
	sub	r7, r7, #16
.Lfunc_005757BC_90:
	sub	r2, r2, #32
.Lfunc_005757BC_94:
	vstmia	r7, {s2-s5}
.Lfunc_005757BC_98:
	sub	ip, ip, #32
.Lfunc_005757BC_9c:
	subs	r4, r4, #1
.Lfunc_005757BC_a0:
	vldmia	r2, {s2-s5}
.Lfunc_005757BC_a4:
	vstmia	ip, {s2-s5}
.Lfunc_005757BC_a8:
	bne	.Lfunc_005757BC_78
.Lfunc_005757BC_ac:
	str	r3, [r0, #4]
.Lfunc_005757BC_b0:
	str	r5, [r0]
.Lfunc_005757BC_b4:
	vstr	s0, [r0, #8]
.Lfunc_005757BC_b8:
	vstr	s1, [r0, #12]
.Lfunc_005757BC_bc:
	b	.Lfunc_005757BC_110
.Lfunc_005757BC_c0:
	sub	ip, r2, #16
.Lfunc_005757BC_c4:
	ldm	ip, {r4, r7}
.Lfunc_005757BC_c8:
	subs	r4, r5, r4
.Lfunc_005757BC_cc:
	sbcs	r4, r3, r7
.Lfunc_005757BC_d0:
	bcs	.Lfunc_005757BC_104
.Lfunc_005757BC_d4:
	vmov	s3, r7
.Lfunc_005757BC_d8:
	vldr	s2, [ip]
.Lfunc_005757BC_dc:
	vldr	s4, [ip, #8]
.Lfunc_005757BC_e0:
	vldr	s5, [ip, #12]
.Lfunc_005757BC_e4:
	mov	r4, r2
.Lfunc_005757BC_e8:
	mov	r2, ip
.Lfunc_005757BC_ec:
	vstmia	r4, {s2-s5}
.Lfunc_005757BC_f0:
	sub	ip, ip, #16
.Lfunc_005757BC_f4:
	ldm	ip, {r4, r7}
.Lfunc_005757BC_f8:
	subs	r4, r5, r4
.Lfunc_005757BC_fc:
	sbcs	r4, r3, r7
.Lfunc_005757BC_100:
	bcc	.Lfunc_005757BC_d4
.Lfunc_005757BC_104:
	str	r5, [r2], #4
.Lfunc_005757BC_108:
	str	r3, [r2], #4
.Lfunc_005757BC_10c:
	vstmia	r2, {s0-s1}
.Lfunc_005757BC_110:
	add	r6, r6, #16
.Lfunc_005757BC_114:
	cmp	r6, r1
.Lfunc_005757BC_118:
	bne	.Lfunc_005757BC_1c
.Lfunc_005757BC_11c:
	add	sp, sp, #8
.Lfunc_005757BC_120:
	pop	{r4, r5, r6, r7}
.Lfunc_005757BC_124:
	bx	lr
.size func_005757BC, .-func_005757BC

.section .text.func_005759F4,"ax",%progbits
.balign 4
.global func_005759F4
.type func_005759F4, %function
func_005759F4:
.Lfunc_005759F4_0:
	cmp	r0, r1
.Lfunc_005759F4_4:
	bxeq	lr
.Lfunc_005759F4_8:
	push	{r4, r5, r6}
.Lfunc_005759F4_c:
	add	r5, r0, #16
.Lfunc_005759F4_10:
	cmp	r5, r1
.Lfunc_005759F4_14:
	beq	.Lfunc_005759F4_118
.Lfunc_005759F4_18:
	ldr	r6, [r5, #8]
.Lfunc_005759F4_1c:
	ldr	r3, [r0, #8]
.Lfunc_005759F4_20:
	vldr	s3, [r5]
.Lfunc_005759F4_24:
	vldr	s4, [r5, #4]
.Lfunc_005759F4_28:
	cmp	r6, r3
.Lfunc_005759F4_2c:
	vldr	s5, [r5, #12]
.Lfunc_005759F4_30:
	mov	r2, r5
.Lfunc_005759F4_34:
	movcs	r3, r5
.Lfunc_005759F4_38:
	bcs	.Lfunc_005759F4_f0
.Lfunc_005759F4_3c:
	sub	ip, r2, r0
.Lfunc_005759F4_40:
	add	r3, r2, #16
.Lfunc_005759F4_44:
	asr	r4, ip, #4
.Lfunc_005759F4_48:
	cmp	r4, #0
.Lfunc_005759F4_4c:
	ble	.Lfunc_005759F4_bc
.Lfunc_005759F4_50:
	lsls	r4, ip, #27
.Lfunc_005759F4_54:
	bpl	.Lfunc_005759F4_70
.Lfunc_005759F4_58:
	sub	r2, r5, #16
.Lfunc_005759F4_5c:
	sub	r3, r3, #16
.Lfunc_005759F4_60:
	vldr	s6, [r5, #-4]
.Lfunc_005759F4_64:
	vldmia	r2, {s0-s2}
.Lfunc_005759F4_68:
	vstr	s6, [r3, #12]
.Lfunc_005759F4_6c:
	vstmia	r3, {s0-s2}
.Lfunc_005759F4_70:
	asrs	ip, ip, #5
.Lfunc_005759F4_74:
	beq	.Lfunc_005759F4_bc
.Lfunc_005759F4_78:
	vldr	s2, [r2, #-16]
.Lfunc_005759F4_7c:
	vldr	s0, [r2, #-12]
.Lfunc_005759F4_80:
	vldr	s1, [r2, #-8]
.Lfunc_005759F4_84:
	vldr	s6, [r2, #-4]
.Lfunc_005759F4_88:
	mov	r4, r3
.Lfunc_005759F4_8c:
	sub	r2, r2, #32
.Lfunc_005759F4_90:
	vstr	s2, [r4, #-16]
.Lfunc_005759F4_94:
	vstr	s0, [r4, #-12]
.Lfunc_005759F4_98:
	vstr	s1, [r4, #-8]
.Lfunc_005759F4_9c:
	vstr	s6, [r4, #-4]
.Lfunc_005759F4_a0:
	sub	r3, r3, #32
.Lfunc_005759F4_a4:
	vldr	s6, [r2, #12]
.Lfunc_005759F4_a8:
	subs	ip, ip, #1
.Lfunc_005759F4_ac:
	vldmia	r2, {s0-s2}
.Lfunc_005759F4_b0:
	vstr	s6, [r3, #12]
.Lfunc_005759F4_b4:
	vstmia	r3, {s0-s2}
.Lfunc_005759F4_b8:
	bne	.Lfunc_005759F4_78
.Lfunc_005759F4_bc:
	vstmia	r0, {s3-s4}
.Lfunc_005759F4_c0:
	str	r6, [r0, #8]
.Lfunc_005759F4_c4:
	vstr	s5, [r0, #12]
.Lfunc_005759F4_c8:
	b	.Lfunc_005759F4_10c
.Lfunc_005759F4_cc:
	vldr	s0, [r3]
.Lfunc_005759F4_d0:
	mov	r4, r2
.Lfunc_005759F4_d4:
	vldr	s2, [r3, #4]
.Lfunc_005759F4_d8:
	vldr	s1, [r3, #12]
.Lfunc_005759F4_dc:
	vstr	s0, [r4]
.Lfunc_005759F4_e0:
	vstr	s2, [r4, #4]
.Lfunc_005759F4_e4:
	str	ip, [r4, #8]
.Lfunc_005759F4_e8:
	mov	r2, r3
.Lfunc_005759F4_ec:
	vstr	s1, [r4, #12]
.Lfunc_005759F4_f0:
	sub	r3, r3, #16
.Lfunc_005759F4_f4:
	ldr	ip, [r3, #8]
.Lfunc_005759F4_f8:
	cmp	r6, ip
.Lfunc_005759F4_fc:
	bcc	.Lfunc_005759F4_cc
.Lfunc_005759F4_100:
	vstmia	r2, {s3-s4}
.Lfunc_005759F4_104:
	str	r6, [r2, #8]
.Lfunc_005759F4_108:
	vstr	s5, [r2, #12]
.Lfunc_005759F4_10c:
	add	r5, r5, #16
.Lfunc_005759F4_110:
	cmp	r5, r1
.Lfunc_005759F4_114:
	bne	.Lfunc_005759F4_18
.Lfunc_005759F4_118:
	pop	{r4, r5, r6}
.Lfunc_005759F4_11c:
	bx	lr
.size func_005759F4, .-func_005759F4

.section .text.func_004B5F14,"ax",%progbits
.balign 4
.global func_004B5F14
.type func_004B5F14, %function
func_004B5F14:
.Lfunc_004B5F14_0:
	push	{r4, r5, r6}
.Lfunc_004B5F14_4:
	mov	r4, #8
.Lfunc_004B5F14_8:
	ldr	r1, [r0, #656]
.Lfunc_004B5F14_c:
	mov	r5, r4
.Lfunc_004B5F14_10:
	mov	r3, #0
.Lfunc_004B5F14_14:
	mov	r2, r1
.Lfunc_004B5F14_18:
	cmp	r2, #256
.Lfunc_004B5F14_1c:
	movhi	ip, #256
.Lfunc_004B5F14_20:
	movls	ip, r2
.Lfunc_004B5F14_24:
	add	r3, r3, #8
.Lfunc_004B5F14_28:
	add	r3, r3, ip, lsl #2
.Lfunc_004B5F14_2c:
	tst	ip, #1
.Lfunc_004B5F14_30:
	sub	r3, r3, #4
.Lfunc_004B5F14_34:
	addeq	r3, r3, #4
.Lfunc_004B5F14_38:
	subs	r2, r2, ip
.Lfunc_004B5F14_3c:
	bne	.Lfunc_004B5F14_18
.Lfunc_004B5F14_40:
	ldr	ip, [r0, #660]
.Lfunc_004B5F14_44:
	add	r3, r3, r5
.Lfunc_004B5F14_48:
	cmp	ip, #0
.Lfunc_004B5F14_4c:
	addgt	r5, r3, #8
.Lfunc_004B5F14_50:
	movgt	r2, #0
.Lfunc_004B5F14_54:
	ble	.Lfunc_004B5F14_84
.Lfunc_004B5F14_58:
	cmp	r1, #256
.Lfunc_004B5F14_5c:
	movhi	r3, #256
.Lfunc_004B5F14_60:
	movls	r3, r1
.Lfunc_004B5F14_64:
	add	r2, r2, #8
.Lfunc_004B5F14_68:
	add	r2, r2, r3, lsl #2
.Lfunc_004B5F14_6c:
	tst	r3, #1
.Lfunc_004B5F14_70:
	sub	r2, r2, #4
.Lfunc_004B5F14_74:
	addeq	r2, r2, #4
.Lfunc_004B5F14_78:
	subs	r1, r1, r3
.Lfunc_004B5F14_7c:
	bne	.Lfunc_004B5F14_58
.Lfunc_004B5F14_80:
	add	r3, r2, r5
.Lfunc_004B5F14_84:
	ldr	r1, [r0, #140]
.Lfunc_004B5F14_88:
	add	r4, r4, r3
.Lfunc_004B5F14_8c:
	mov	r5, #8
.Lfunc_004B5F14_90:
	cmp	r1, #512
.Lfunc_004B5F14_94:
	movhi	r0, #512
.Lfunc_004B5F14_98:
	movls	r0, r1
.Lfunc_004B5F14_9c:
	mov	r2, #0
.Lfunc_004B5F14_a0:
	cmp	r0, #256
.Lfunc_004B5F14_a4:
	movhi	r3, #256
.Lfunc_004B5F14_a8:
	movls	r3, r0
.Lfunc_004B5F14_ac:
	add	r2, r2, #8
.Lfunc_004B5F14_b0:
	add	r2, r2, r3, lsl #2
.Lfunc_004B5F14_b4:
	tst	r3, #1
.Lfunc_004B5F14_b8:
	sub	r2, r2, #4
.Lfunc_004B5F14_bc:
	addeq	r2, r2, #4
.Lfunc_004B5F14_c0:
	subs	r0, r0, r3
.Lfunc_004B5F14_c4:
	bne	.Lfunc_004B5F14_a0
.Lfunc_004B5F14_c8:
	add	r0, r2, r5
.Lfunc_004B5F14_cc:
	cmp	ip, #0
.Lfunc_004B5F14_d0:
	add	r0, r0, #8
.Lfunc_004B5F14_d4:
	addgt	r3, r0, #8
.Lfunc_004B5F14_d8:
	movgt	r0, #0
.Lfunc_004B5F14_dc:
	ble	.Lfunc_004B5F14_110
.Lfunc_004B5F14_e0:
	cmp	r1, #256
.Lfunc_004B5F14_e4:
	movhi	r2, #256
.Lfunc_004B5F14_e8:
	movls	r2, r1
.Lfunc_004B5F14_ec:
	add	r0, r0, #8
.Lfunc_004B5F14_f0:
	add	r0, r0, r2, lsl #2
.Lfunc_004B5F14_f4:
	tst	r2, #1
.Lfunc_004B5F14_f8:
	sub	r0, r0, #4
.Lfunc_004B5F14_fc:
	addeq	r0, r0, #4
.Lfunc_004B5F14_100:
	subs	r1, r1, r2
.Lfunc_004B5F14_104:
	bne	.Lfunc_004B5F14_e0
.Lfunc_004B5F14_108:
	add	r0, r0, r3
.Lfunc_004B5F14_10c:
	add	r0, r0, #8
.Lfunc_004B5F14_110:
	add	r0, r0, r4
.Lfunc_004B5F14_114:
	pop	{r4, r5, r6}
.Lfunc_004B5F14_118:
	bx	lr
.size func_004B5F14, .-func_004B5F14

.section .text.func_0045A144,"ax",%progbits
.balign 4
.global func_0045A144
.type func_0045A144, %function
func_0045A144:
.Lfunc_0045A144_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_0045A144_4:
	mov	r3, #0
.Lfunc_0045A144_8:
	ldrb	r5, [r0, #7]
.Lfunc_0045A144_c:
	cmp	r5, #0
.Lfunc_0045A144_10:
	bls	.Lfunc_0045A144_10c
.Lfunc_0045A144_14:
	add	ip, r0, r3, lsl #2
.Lfunc_0045A144_18:
	ldr	ip, [ip, #8]
.Lfunc_0045A144_1c:
	cmp	ip, r1
.Lfunc_0045A144_20:
	bne	.Lfunc_0045A144_100
.Lfunc_0045A144_24:
	add	ip, r3, r3, lsl #1
.Lfunc_0045A144_28:
	ldr	r6, [r2]
.Lfunc_0045A144_2c:
	add	r4, r0, ip, lsl #2
.Lfunc_0045A144_30:
	ldrsb	r7, [r2, #4]
.Lfunc_0045A144_34:
	ldr	ip, [r4, #408]
.Lfunc_0045A144_38:
	cmp	ip, r6
.Lfunc_0045A144_3c:
	add	ip, r4, #256
.Lfunc_0045A144_40:
	moveq	r6, #1
.Lfunc_0045A144_44:
	ldrsb	r8, [ip, #156]
.Lfunc_0045A144_48:
	movne	r6, #0
.Lfunc_0045A144_4c:
	and	r6, r6, #1
.Lfunc_0045A144_50:
	cmp	r8, r7
.Lfunc_0045A144_54:
	ldrsb	r8, [ip, #157]
.Lfunc_0045A144_58:
	ldrsb	r7, [r2, #5]
.Lfunc_0045A144_5c:
	moveq	r9, #1
.Lfunc_0045A144_60:
	movne	r9, #0
.Lfunc_0045A144_64:
	cmp	r8, r7
.Lfunc_0045A144_68:
	and	r6, r6, r9
.Lfunc_0045A144_6c:
	ldrb	r8, [r4, #414]
.Lfunc_0045A144_70:
	ldrb	r9, [r2, #6]
.Lfunc_0045A144_74:
	moveq	r7, #1
.Lfunc_0045A144_78:
	movne	r7, #0
.Lfunc_0045A144_7c:
	cmp	r8, r9
.Lfunc_0045A144_80:
	and	r4, r7, r6
.Lfunc_0045A144_84:
	ldrsb	r7, [ip, #159]
.Lfunc_0045A144_88:
	ldrsb	r8, [r2, #7]
.Lfunc_0045A144_8c:
	moveq	r6, #1
.Lfunc_0045A144_90:
	movne	r6, #0
.Lfunc_0045A144_94:
	cmp	r7, r8
.Lfunc_0045A144_98:
	and	r4, r4, r6
.Lfunc_0045A144_9c:
	ldrsb	r6, [ip, #160]
.Lfunc_0045A144_a0:
	ldrsb	r7, [r2, #8]
.Lfunc_0045A144_a4:
	moveq	r8, #1
.Lfunc_0045A144_a8:
	movne	r8, #0
.Lfunc_0045A144_ac:
	cmp	r6, r7
.Lfunc_0045A144_b0:
	and	r4, r4, r8
.Lfunc_0045A144_b4:
	ldrsb	r6, [ip, #161]
.Lfunc_0045A144_b8:
	ldrsb	r7, [r2, #9]
.Lfunc_0045A144_bc:
	moveq	r8, #1
.Lfunc_0045A144_c0:
	movne	r8, #0
.Lfunc_0045A144_c4:
	cmp	r6, r7
.Lfunc_0045A144_c8:
	and	r4, r4, r8
.Lfunc_0045A144_cc:
	ldrsh	r7, [ip, #162]
.Lfunc_0045A144_d0:
	ldrsh	r8, [r2, #10]
.Lfunc_0045A144_d4:
	moveq	r6, #1
.Lfunc_0045A144_d8:
	movne	r6, #0
.Lfunc_0045A144_dc:
	cmp	r7, r8
.Lfunc_0045A144_e0:
	and	ip, r6, r4
.Lfunc_0045A144_e4:
	moveq	r4, #1
.Lfunc_0045A144_e8:
	movne	r4, #0
.Lfunc_0045A144_ec:
	tst	ip, r4
.Lfunc_0045A144_f0:
	beq	.Lfunc_0045A144_100
.Lfunc_0045A144_f4:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_0045A144_f8:
	mov	r0, #1
.Lfunc_0045A144_fc:
	bx	lr
.Lfunc_0045A144_100:
	add	r3, r3, #1
.Lfunc_0045A144_104:
	cmp	r5, r3
.Lfunc_0045A144_108:
	bhi	.Lfunc_0045A144_14
.Lfunc_0045A144_10c:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_0045A144_110:
	mov	r0, #0
.Lfunc_0045A144_114:
	bx	lr
.size func_0045A144, .-func_0045A144

.section .text.func_004A8C08,"ax",%progbits
.balign 4
.global func_004A8C08
.type func_004A8C08, %function
func_004A8C08:
.Lfunc_004A8C08_0:
	push	{r4, r5, r6}
.Lfunc_004A8C08_4:
	mov	r6, #320
.Lfunc_004A8C08_8:
	ldrb	r2, [r0, #11]
.Lfunc_004A8C08_c:
	ldrb	r3, [r0, #10]
.Lfunc_004A8C08_10:
	ldrb	ip, [r0]
.Lfunc_004A8C08_14:
	ldrb	r4, [r0, #12]
.Lfunc_004A8C08_18:
	lsl	r5, r2, #10
.Lfunc_004A8C08_1c:
	orr	r3, r5, r3, lsl #20
.Lfunc_004A8C08_20:
	add	r2, r6, ip, lsl #4
.Lfunc_004A8C08_24:
	orr	r3, r3, r4
.Lfunc_004A8C08_28:
	orr	r2, r2, #-2147483648
.Lfunc_004A8C08_2c:
	str	r3, [r1], #4
.Lfunc_004A8C08_30:
	orr	r2, r2, #12517376
.Lfunc_004A8C08_34:
	str	r2, [r1], #4
.Lfunc_004A8C08_38:
	ldrb	r3, [r0, #14]
.Lfunc_004A8C08_3c:
	ldrb	ip, [r0, #13]
.Lfunc_004A8C08_40:
	ldrb	r2, [r0, #15]
.Lfunc_004A8C08_44:
	lsl	r3, r3, #10
.Lfunc_004A8C08_48:
	orr	r3, r3, ip, lsl #20
.Lfunc_004A8C08_4c:
	orr	r2, r2, r3
.Lfunc_004A8C08_50:
	str	r2, [r1], #4
.Lfunc_004A8C08_54:
	ldrb	r3, [r0, #5]
.Lfunc_004A8C08_58:
	ldrb	ip, [r0, #4]
.Lfunc_004A8C08_5c:
	ldrb	r2, [r0, #6]
.Lfunc_004A8C08_60:
	lsl	r3, r3, #10
.Lfunc_004A8C08_64:
	orr	r3, r3, ip, lsl #20
.Lfunc_004A8C08_68:
	orr	r2, r2, r3
.Lfunc_004A8C08_6c:
	str	r2, [r1], #4
.Lfunc_004A8C08_70:
	ldrb	r3, [r0, #8]
.Lfunc_004A8C08_74:
	ldrb	ip, [r0, #7]
.Lfunc_004A8C08_78:
	ldrb	r2, [r0, #9]
.Lfunc_004A8C08_7c:
	lsl	r3, r3, #10
.Lfunc_004A8C08_80:
	orr	r3, r3, ip, lsl #20
.Lfunc_004A8C08_84:
	orr	r2, r2, r3
.Lfunc_004A8C08_88:
	str	r2, [r1], #4
.Lfunc_004A8C08_8c:
	ldr	r2, [r0, #16]
.Lfunc_004A8C08_90:
	str	r2, [r1], #4
.Lfunc_004A8C08_94:
	ldr	r2, [r0, #20]
.Lfunc_004A8C08_98:
	str	r2, [r1], #4
.Lfunc_004A8C08_9c:
	ldr	r2, [r0, #36]
.Lfunc_004A8C08_a0:
	str	r2, [r1], #4
.Lfunc_004A8C08_a4:
	ldr	r3, [r0, #40]
.Lfunc_004A8C08_a8:
	mov	r2, #0
.Lfunc_004A8C08_ac:
	str	r3, [r1], #4
.Lfunc_004A8C08_b0:
	str	r2, [r1], #4
.Lfunc_004A8C08_b4:
	ldrb	r3, [r0, #1]
.Lfunc_004A8C08_b8:
	ldrb	r4, [r0, #2]
.Lfunc_004A8C08_bc:
	ldrb	ip, [r0, #24]
.Lfunc_004A8C08_c0:
	cmp	r3, #0
.Lfunc_004A8C08_c4:
	movne	r3, #1
.Lfunc_004A8C08_c8:
	cmp	r4, #0
.Lfunc_004A8C08_cc:
	ldrb	r4, [r0, #3]
.Lfunc_004A8C08_d0:
	orr	r3, ip, r3, lsl #1
.Lfunc_004A8C08_d4:
	movne	ip, #1
.Lfunc_004A8C08_d8:
	moveq	ip, #0
.Lfunc_004A8C08_dc:
	cmp	r4, #0
.Lfunc_004A8C08_e0:
	movne	r4, #1
.Lfunc_004A8C08_e4:
	lsl	ip, ip, #2
.Lfunc_004A8C08_e8:
	orr	ip, ip, r4, lsl #3
.Lfunc_004A8C08_ec:
	orr	r3, r3, ip
.Lfunc_004A8C08_f0:
	str	r3, [r1], #4
.Lfunc_004A8C08_f4:
	ldr	r3, [r0, #28]
.Lfunc_004A8C08_f8:
	str	r3, [r1], #4
.Lfunc_004A8C08_fc:
	ldr	r0, [r0, #32]
.Lfunc_004A8C08_100:
	stmia	r1!, {r0, r2}
.Lfunc_004A8C08_104:
	mov	r0, r1
.Lfunc_004A8C08_108:
	pop	{r4, r5, r6}
.Lfunc_004A8C08_10c:
	bx	lr
.size func_004A8C08, .-func_004A8C08

.section .text.func_005224B4,"ax",%progbits
.balign 4
.global func_005224B4
.type func_005224B4, %function
func_005224B4:
.Lfunc_005224B4_0:
	push	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_005224B4_4:
	mov	r5, #7
.Lfunc_005224B4_8:
	mov	r6, #4
.Lfunc_005224B4_c:
	add	r7, r1, r2, lsl #2
.Lfunc_005224B4_10:
	ldrh	r4, [r1, #2]
.Lfunc_005224B4_14:
	add	r9, r2, #1
.Lfunc_005224B4_18:
	mvn	r3, #0
.Lfunc_005224B4_1c:
	cmp	r4, #0
.Lfunc_005224B4_20:
	moveq	r5, #138
.Lfunc_005224B4_24:
	moveq	r6, #3
.Lfunc_005224B4_28:
	cmp	r9, #0
.Lfunc_005224B4_2c:
	strh	r3, [r7, #6]
.Lfunc_005224B4_30:
	mvn	r8, #0
.Lfunc_005224B4_34:
	mov	ip, #0
.Lfunc_005224B4_38:
	mov	r2, #0
.Lfunc_005224B4_3c:
	addgt	r7, r0, #2560
.Lfunc_005224B4_40:
	ble	.Lfunc_005224B4_ec
.Lfunc_005224B4_44:
	add	sl, r1, r2, lsl #2
.Lfunc_005224B4_48:
	mov	r3, r4
.Lfunc_005224B4_4c:
	ldrh	r4, [sl, #6]
.Lfunc_005224B4_50:
	add	ip, ip, #1
.Lfunc_005224B4_54:
	cmp	ip, r5
.Lfunc_005224B4_58:
	bge	.Lfunc_005224B4_64
.Lfunc_005224B4_5c:
	cmp	r3, r4
.Lfunc_005224B4_60:
	beq	.Lfunc_005224B4_e0
.Lfunc_005224B4_64:
	cmp	r6, ip
.Lfunc_005224B4_68:
	ble	.Lfunc_005224B4_84
.Lfunc_005224B4_6c:
	add	r5, r0, r3, lsl #2
.Lfunc_005224B4_70:
	add	r5, r5, #2560
.Lfunc_005224B4_74:
	ldrh	r6, [r5, #124]
.Lfunc_005224B4_78:
	add	ip, ip, r6
.Lfunc_005224B4_7c:
	strh	ip, [r5, #124]
.Lfunc_005224B4_80:
	b	.Lfunc_005224B4_b4
.Lfunc_005224B4_84:
	cmp	r3, #0
.Lfunc_005224B4_88:
	beq	.Lfunc_005224B4_f4
.Lfunc_005224B4_8c:
	cmp	r3, r8
.Lfunc_005224B4_90:
	beq	.Lfunc_005224B4_a8
.Lfunc_005224B4_94:
	add	ip, r0, r3, lsl #2
.Lfunc_005224B4_98:
	add	ip, ip, #2560
.Lfunc_005224B4_9c:
	ldrh	r5, [ip, #124]
.Lfunc_005224B4_a0:
	add	r5, r5, #1
.Lfunc_005224B4_a4:
	strh	r5, [ip, #124]
.Lfunc_005224B4_a8:
	ldrh	ip, [r7, #188]
.Lfunc_005224B4_ac:
	add	ip, ip, #1
.Lfunc_005224B4_b0:
	strh	ip, [r7, #188]
.Lfunc_005224B4_b4:
	cmp	r4, #0
.Lfunc_005224B4_b8:
	mov	r8, r3
.Lfunc_005224B4_bc:
	mov	ip, #0
.Lfunc_005224B4_c0:
	moveq	r5, #138
.Lfunc_005224B4_c4:
	beq	.Lfunc_005224B4_dc
.Lfunc_005224B4_c8:
	cmp	r8, r4
.Lfunc_005224B4_cc:
	moveq	r5, #6
.Lfunc_005224B4_d0:
	movne	r5, #7
.Lfunc_005224B4_d4:
	movne	r6, #4
.Lfunc_005224B4_d8:
	bne	.Lfunc_005224B4_e0
.Lfunc_005224B4_dc:
	mov	r6, #3
.Lfunc_005224B4_e0:
	add	r2, r2, #1
.Lfunc_005224B4_e4:
	cmp	r2, r9
.Lfunc_005224B4_e8:
	blt	.Lfunc_005224B4_44
.Lfunc_005224B4_ec:
	pop	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_005224B4_f0:
	bx	lr
.Lfunc_005224B4_f4:
	cmp	ip, #10
.Lfunc_005224B4_f8:
	ldrhle	ip, [r7, #192]
.Lfunc_005224B4_fc:
	ldrhgt	ip, [r7, #196]
.Lfunc_005224B4_100:
	add	ip, ip, #1
.Lfunc_005224B4_104:
	strhle	ip, [r7, #192]
.Lfunc_005224B4_108:
	strhgt	ip, [r7, #196]
.Lfunc_005224B4_10c:
	b	.Lfunc_005224B4_b4
.size func_005224B4, .-func_005224B4

.section .text.func_005758E4,"ax",%progbits
.balign 4
.global func_005758E4
.type func_005758E4, %function
func_005758E4:
.Lfunc_005758E4_0:
	cmp	r0, r1
.Lfunc_005758E4_4:
	bxeq	lr
.Lfunc_005758E4_8:
	push	{r4, r5, r6}
.Lfunc_005758E4_c:
	add	r5, r0, #16
.Lfunc_005758E4_10:
	cmp	r5, r1
.Lfunc_005758E4_14:
	beq	.Lfunc_005758E4_108
.Lfunc_005758E4_18:
	ldr	ip, [r5, #4]
.Lfunc_005758E4_1c:
	ldr	r3, [r0, #4]
.Lfunc_005758E4_20:
	vldr	s6, [r5]
.Lfunc_005758E4_24:
	vldr	s5, [r5, #8]
.Lfunc_005758E4_28:
	cmp	ip, r3
.Lfunc_005758E4_2c:
	vldr	s0, [r5, #12]
.Lfunc_005758E4_30:
	mov	r2, r5
.Lfunc_005758E4_34:
	movcs	r4, r5
.Lfunc_005758E4_38:
	bcs	.Lfunc_005758E4_dc
.Lfunc_005758E4_3c:
	sub	r4, r2, r0
.Lfunc_005758E4_40:
	add	r3, r2, #16
.Lfunc_005758E4_44:
	asr	r6, r4, #4
.Lfunc_005758E4_48:
	cmp	r6, #0
.Lfunc_005758E4_4c:
	ble	.Lfunc_005758E4_a4
.Lfunc_005758E4_50:
	lsls	r6, r4, #27
.Lfunc_005758E4_54:
	bpl	.Lfunc_005758E4_68
.Lfunc_005758E4_58:
	sub	r2, r5, #16
.Lfunc_005758E4_5c:
	sub	r3, r3, #16
.Lfunc_005758E4_60:
	vldmia	r2, {s1-s4}
.Lfunc_005758E4_64:
	vstmia	r3, {s1-s4}
.Lfunc_005758E4_68:
	asrs	r4, r4, #5
.Lfunc_005758E4_6c:
	beq	.Lfunc_005758E4_a4
.Lfunc_005758E4_70:
	mov	r6, r3
.Lfunc_005758E4_74:
	vldr	s1, [r2, #-16]
.Lfunc_005758E4_78:
	vldr	s2, [r2, #-12]
.Lfunc_005758E4_7c:
	vldr	s3, [r2, #-8]
.Lfunc_005758E4_80:
	vldr	s4, [r2, #-4]
.Lfunc_005758E4_84:
	sub	r6, r6, #16
.Lfunc_005758E4_88:
	sub	r2, r2, #32
.Lfunc_005758E4_8c:
	vstmia	r6, {s1-s4}
.Lfunc_005758E4_90:
	sub	r3, r3, #32
.Lfunc_005758E4_94:
	subs	r4, r4, #1
.Lfunc_005758E4_98:
	vldmia	r2, {s1-s4}
.Lfunc_005758E4_9c:
	vstmia	r3, {s1-s4}
.Lfunc_005758E4_a0:
	bne	.Lfunc_005758E4_70
.Lfunc_005758E4_a4:
	vstr	s6, [r0]
.Lfunc_005758E4_a8:
	str	ip, [r0, #4]
.Lfunc_005758E4_ac:
	vstr	s5, [r0, #8]
.Lfunc_005758E4_b0:
	vstr	s0, [r0, #12]
.Lfunc_005758E4_b4:
	b	.Lfunc_005758E4_fc
.Lfunc_005758E4_b8:
	mov	r6, r4
.Lfunc_005758E4_bc:
	vldr	s1, [r2]
.Lfunc_005758E4_c0:
	vldr	s2, [r2, #8]
.Lfunc_005758E4_c4:
	vldr	s3, [r2, #12]
.Lfunc_005758E4_c8:
	vstr	s1, [r6]
.Lfunc_005758E4_cc:
	str	r3, [r6, #4]!
.Lfunc_005758E4_d0:
	add	r6, r6, #4
.Lfunc_005758E4_d4:
	mov	r4, r2
.Lfunc_005758E4_d8:
	vstmia	r6, {s2-s3}
.Lfunc_005758E4_dc:
	sub	r2, r4, #16
.Lfunc_005758E4_e0:
	ldr	r3, [r4, #-12]
.Lfunc_005758E4_e4:
	cmp	ip, r3
.Lfunc_005758E4_e8:
	bcc	.Lfunc_005758E4_b8
.Lfunc_005758E4_ec:
	vstr	s6, [r4]
.Lfunc_005758E4_f0:
	str	ip, [r4, #4]
.Lfunc_005758E4_f4:
	vstr	s5, [r4, #8]
.Lfunc_005758E4_f8:
	vstr	s0, [r4, #12]
.Lfunc_005758E4_fc:
	add	r5, r5, #16
.Lfunc_005758E4_100:
	cmp	r5, r1
.Lfunc_005758E4_104:
	bne	.Lfunc_005758E4_18
.Lfunc_005758E4_108:
	pop	{r4, r5, r6}
.Lfunc_005758E4_10c:
	bx	lr
.size func_005758E4, .-func_005758E4

.section .text.func_0014E240,"ax",%progbits
.balign 4
.global func_0014E240
.type func_0014E240, %function
func_0014E240:
.Lfunc_0014E240_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_0014E240_4:
	cmp	r2, #0
.Lfunc_0014E240_8:
	mov	r5, #0
.Lfunc_0014E240_c:
	movne	r6, #0
.Lfunc_0014E240_10:
	beq	.Lfunc_0014E240_fc
.Lfunc_0014E240_14:
	ldrh	r3, [r1]
.Lfunc_0014E240_18:
	cmp	r3, #16
.Lfunc_0014E240_1c:
	strh	r3, [r0]
.Lfunc_0014E240_20:
	beq	.Lfunc_0014E240_48
.Lfunc_0014E240_24:
	cmp	r3, #0
.Lfunc_0014E240_28:
	beq	.Lfunc_0014E240_e8
.Lfunc_0014E240_2c:
	add	r0, r0, #2
.Lfunc_0014E240_30:
	add	r1, r1, #2
.Lfunc_0014E240_34:
	add	r5, r5, #1
.Lfunc_0014E240_38:
	sub	r2, r2, #1
.Lfunc_0014E240_3c:
	cmp	r2, #0
.Lfunc_0014E240_40:
	bne	.Lfunc_0014E240_14
.Lfunc_0014E240_44:
	b	.Lfunc_0014E240_f0
.Lfunc_0014E240_48:
	ldrh	r4, [r1, #2]
.Lfunc_0014E240_4c:
	add	r3, r4, #2
.Lfunc_0014E240_50:
	cmp	r2, r3
.Lfunc_0014E240_54:
	bls	.Lfunc_0014E240_e4
.Lfunc_0014E240_58:
	cmn	r3, #-2147483647
.Lfunc_0014E240_5c:
	sub	r2, r2, r3
.Lfunc_0014E240_60:
	add	r5, r5, r3
.Lfunc_0014E240_64:
	bls	.Lfunc_0014E240_84
.Lfunc_0014E240_68:
	subs	r3, r3, #1
.Lfunc_0014E240_6c:
	bcc	.Lfunc_0014E240_3c
.Lfunc_0014E240_70:
	ldrh	ip, [r1, #2]!
.Lfunc_0014E240_74:
	subs	r3, r3, #1
.Lfunc_0014E240_78:
	strh	ip, [r0, #2]!
.Lfunc_0014E240_7c:
	bcs	.Lfunc_0014E240_70
.Lfunc_0014E240_80:
	b	.Lfunc_0014E240_3c
.Lfunc_0014E240_84:
	cmp	r3, #0
.Lfunc_0014E240_88:
	sub	r7, r3, #1
.Lfunc_0014E240_8c:
	ble	.Lfunc_0014E240_3c
.Lfunc_0014E240_90:
	tst	r7, #1
.Lfunc_0014E240_94:
	mov	r3, r1
.Lfunc_0014E240_98:
	mov	ip, r0
.Lfunc_0014E240_9c:
	bne	.Lfunc_0014E240_ac
.Lfunc_0014E240_a0:
	add	ip, r0, #2
.Lfunc_0014E240_a4:
	add	r3, r1, #2
.Lfunc_0014E240_a8:
	strh	r4, [r0, #2]
.Lfunc_0014E240_ac:
	add	r4, r7, #1
.Lfunc_0014E240_b0:
	asrs	r4, r4, #1
.Lfunc_0014E240_b4:
	beq	.Lfunc_0014E240_d0
.Lfunc_0014E240_b8:
	ldrh	r8, [r3, #2]
.Lfunc_0014E240_bc:
	subs	r4, r4, #1
.Lfunc_0014E240_c0:
	strh	r8, [ip, #2]
.Lfunc_0014E240_c4:
	ldrh	r8, [r3, #4]!
.Lfunc_0014E240_c8:
	strh	r8, [ip, #4]!
.Lfunc_0014E240_cc:
	bne	.Lfunc_0014E240_b8
.Lfunc_0014E240_d0:
	add	r1, r1, r7, lsl #1
.Lfunc_0014E240_d4:
	add	r0, r0, r7, lsl #1
.Lfunc_0014E240_d8:
	add	r1, r1, #2
.Lfunc_0014E240_dc:
	add	r0, r0, #2
.Lfunc_0014E240_e0:
	b	.Lfunc_0014E240_3c
.Lfunc_0014E240_e4:
	strh	r6, [r0]
.Lfunc_0014E240_e8:
	cmp	r2, #0
.Lfunc_0014E240_ec:
	bne	.Lfunc_0014E240_fc
.Lfunc_0014E240_f0:
	cmp	r5, #0
.Lfunc_0014E240_f4:
	subne	r5, r5, #1
.Lfunc_0014E240_f8:
	strhne	r6, [r0, #-2]
.Lfunc_0014E240_fc:
	mov	r0, r5
.Lfunc_0014E240_100:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_0014E240_104:
	bx	lr
.size func_0014E240, .-func_0014E240

.section .text.func_0040282C,"ax",%progbits
.balign 4
.global func_0040282C
.type func_0040282C, %function
func_0040282C:
.Lfunc_0040282C_0:
	push	{r4, r5, r6, r7, r8, lr}
.Lfunc_0040282C_4:
	mov	r5, r1
.Lfunc_0040282C_8:
	mov	r4, r0
.Lfunc_0040282C_c:
	lsl	r1, r1, #20
.Lfunc_0040282C_10:
	cmn	r5, #1
.Lfunc_0040282C_14:
	lsr	r0, r5, #24
.Lfunc_0040282C_18:
	cmpne	r0, #255
.Lfunc_0040282C_1c:
	lsr	r1, r1, #20
.Lfunc_0040282C_20:
	mov	r7, #1
.Lfunc_0040282C_24:
	moveq	r1, r7
.Lfunc_0040282C_28:
	tst	r1, #4
.Lfunc_0040282C_2c:
	ldr	r1, [r4, #8]
.Lfunc_0040282C_30:
	mov	r6, #0
.Lfunc_0040282C_34:
	movne	r3, r7
.Lfunc_0040282C_38:
	moveq	r3, r6
.Lfunc_0040282C_3c:
	lsl	ip, r1, #20
.Lfunc_0040282C_40:
	cmn	r1, #1
.Lfunc_0040282C_44:
	lsr	r2, r1, #24
.Lfunc_0040282C_48:
	cmpne	r2, #255
.Lfunc_0040282C_4c:
	lsr	ip, ip, #20
.Lfunc_0040282C_50:
	moveq	ip, r7
.Lfunc_0040282C_54:
	tst	ip, #4
.Lfunc_0040282C_58:
	movne	ip, r7
.Lfunc_0040282C_5c:
	moveq	ip, r6
.Lfunc_0040282C_60:
	cmn	r1, #1
.Lfunc_0040282C_64:
	beq	.Lfunc_0040282C_e8
.Lfunc_0040282C_68:
	cmp	r3, ip
.Lfunc_0040282C_6c:
	bne	.Lfunc_0040282C_e8
.Lfunc_0040282C_70:
	cmp	r0, r2
.Lfunc_0040282C_74:
	beq	.Lfunc_0040282C_e4
.Lfunc_0040282C_78:
	cmp	r3, #0
.Lfunc_0040282C_7c:
	beq	.Lfunc_0040282C_e0
.Lfunc_0040282C_80:
	cmn	r5, #1
.Lfunc_0040282C_84:
	cmpne	r0, #255
.Lfunc_0040282C_88:
	lslne	r0, r5, #8
.Lfunc_0040282C_8c:
	lsrne	r8, r0, #25
.Lfunc_0040282C_90:
	bne	.Lfunc_0040282C_a8
.Lfunc_0040282C_94:
	mov	r2, #0
.Lfunc_0040282C_98:
	mov	r1, r2
.Lfunc_0040282C_9c:
	mov	r0, r2
.Lfunc_0040282C_a0:
	mov	r0, r0
.Lfunc_0040282C_a4:
	mov	r8, #0
.Lfunc_0040282C_a8:
	ldr	r0, [r4, #8]
.Lfunc_0040282C_ac:
	cmn	r0, #1
.Lfunc_0040282C_b0:
	lsr	r1, r0, #24
.Lfunc_0040282C_b4:
	cmpne	r1, #255
.Lfunc_0040282C_b8:
	lslne	r0, r0, #8
.Lfunc_0040282C_bc:
	lsrne	r0, r0, #25
.Lfunc_0040282C_c0:
	bne	.Lfunc_0040282C_d8
.Lfunc_0040282C_c4:
	mov	r2, #0
.Lfunc_0040282C_c8:
	mov	r1, r2
.Lfunc_0040282C_cc:
	mov	r0, r2
.Lfunc_0040282C_d0:
	mov	r0, r0
.Lfunc_0040282C_d4:
	mov	r0, #0
.Lfunc_0040282C_d8:
	cmp	r8, r0
.Lfunc_0040282C_dc:
	bne	.Lfunc_0040282C_e8
.Lfunc_0040282C_e0:
	str	r5, [r4, #8]
.Lfunc_0040282C_e4:
	pop	{r4, r5, r6, r7, r8, pc}
.Lfunc_0040282C_e8:
	ldrb	r0, [r4, #5]
.Lfunc_0040282C_ec:
	str	r5, [r4, #8]
.Lfunc_0040282C_f0:
	str	r6, [r4]
.Lfunc_0040282C_f4:
	strb	r6, [r4, #4]
.Lfunc_0040282C_f8:
	bic	r0, r0, #3
.Lfunc_0040282C_fc:
	strh	r7, [r4, #6]
.Lfunc_0040282C_100:
	strb	r0, [r4, #5]
.Lfunc_0040282C_104:
	pop	{r4, r5, r6, r7, r8, pc}
.size func_0040282C, .-func_0040282C

.section .text.func_001CFC08,"ax",%progbits
.balign 4
.global func_001CFC08
.type func_001CFC08, %function
func_001CFC08:
.Lfunc_001CFC08_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_001CFC08_4:
	cmp	r0, #0
.Lfunc_001CFC08_8:
	mov	sl, #0
.Lfunc_001CFC08_c:
	ldrne	r4, [r0, #4]
.Lfunc_001CFC08_10:
	ldr	r9, [sp, #36]
.Lfunc_001CFC08_14:
	ldr	r8, [sp, #40]
.Lfunc_001CFC08_18:
	cmpne	r4, #0
.Lfunc_001CFC08_1c:
	ldrne	r7, [r0, #12]
.Lfunc_001CFC08_20:
	cmpne	r7, #0
.Lfunc_001CFC08_24:
	moveq	r0, #1
.Lfunc_001CFC08_28:
	streq	sl, [r9]
.Lfunc_001CFC08_2c:
	beq	.Lfunc_001CFC08_f8
.Lfunc_001CFC08_30:
	cmp	r3, #0
.Lfunc_001CFC08_34:
	ldrne	ip, [r3]
.Lfunc_001CFC08_38:
	moveq	ip, #0
.Lfunc_001CFC08_3c:
	cmp	r4, ip
.Lfunc_001CFC08_40:
	sublt	ip, r4, #1
.Lfunc_001CFC08_44:
	cmp	ip, #0
.Lfunc_001CFC08_48:
	movlt	ip, #0
.Lfunc_001CFC08_4c:
	cmp	r1, #0
.Lfunc_001CFC08_50:
	moveq	r5, #1
.Lfunc_001CFC08_54:
	movne	r5, #0
.Lfunc_001CFC08_58:
	cmp	r2, #0
.Lfunc_001CFC08_5c:
	moveq	r6, #1
.Lfunc_001CFC08_60:
	movne	r6, #0
.Lfunc_001CFC08_64:
	orrs	fp, r5, r6
.Lfunc_001CFC08_68:
	mov	r0, ip
.Lfunc_001CFC08_6c:
	bne	.Lfunc_001CFC08_cc
.Lfunc_001CFC08_70:
	cmp	r4, r0
.Lfunc_001CFC08_74:
	bgt	.Lfunc_001CFC08_88
.Lfunc_001CFC08_78:
	tst	r8, #4
.Lfunc_001CFC08_7c:
	movne	r0, #0
.Lfunc_001CFC08_80:
	bicne	r8, r8, #4
.Lfunc_001CFC08_84:
	beq	.Lfunc_001CFC08_cc
.Lfunc_001CFC08_88:
	cmp	r5, #0
.Lfunc_001CFC08_8c:
	bne	.Lfunc_001CFC08_a0
.Lfunc_001CFC08_90:
	ldr	lr, [r7, r0, lsl #2]
.Lfunc_001CFC08_94:
	ldr	lr, [lr]
.Lfunc_001CFC08_98:
	cmp	lr, r1
.Lfunc_001CFC08_9c:
	bne	.Lfunc_001CFC08_b8
.Lfunc_001CFC08_a0:
	cmp	r6, #0
.Lfunc_001CFC08_a4:
	bne	.Lfunc_001CFC08_e0
.Lfunc_001CFC08_a8:
	ldr	lr, [r7, r0, lsl #2]
.Lfunc_001CFC08_ac:
	ldr	lr, [lr, #4]
.Lfunc_001CFC08_b0:
	cmp	lr, r2
.Lfunc_001CFC08_b4:
	beq	.Lfunc_001CFC08_e0
.Lfunc_001CFC08_b8:
	add	r0, r0, #1
.Lfunc_001CFC08_bc:
	cmp	r0, ip
.Lfunc_001CFC08_c0:
	beq	.Lfunc_001CFC08_cc
.Lfunc_001CFC08_c4:
	cmp	fp, #0
.Lfunc_001CFC08_c8:
	beq	.Lfunc_001CFC08_70
.Lfunc_001CFC08_cc:
	cmp	r5, #0
.Lfunc_001CFC08_d0:
	cmpne	r6, #0
.Lfunc_001CFC08_d4:
	moveq	r0, #1
.Lfunc_001CFC08_d8:
	streq	sl, [r9]
.Lfunc_001CFC08_dc:
	beq	.Lfunc_001CFC08_f8
.Lfunc_001CFC08_e0:
	ldr	r1, [r7, r0, lsl #2]
.Lfunc_001CFC08_e4:
	cmp	r3, #0
.Lfunc_001CFC08_e8:
	addne	r0, r0, #1
.Lfunc_001CFC08_ec:
	str	r1, [r9]
.Lfunc_001CFC08_f0:
	strne	r0, [r3]
.Lfunc_001CFC08_f4:
	mov	r0, #0
.Lfunc_001CFC08_f8:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_001CFC08, .-func_001CFC08

.section .text.func_00111008,"ax",%progbits
.balign 4
.global func_00111008
.type func_00111008, %function
func_00111008:
.Lfunc_00111008_0:
	ldrb	r3, [r0, #4]
.Lfunc_00111008_4:
	mov	r1, #0
.Lfunc_00111008_8:
	mov	r2, r1
.Lfunc_00111008_c:
	cmp	r3, #0
.Lfunc_00111008_10:
	bls	.Lfunc_00111008_34
.Lfunc_00111008_14:
	add	r3, r0, r2, lsl #2
.Lfunc_00111008_18:
	add	r2, r2, #1
.Lfunc_00111008_1c:
	ldr	r3, [r3, #12]
.Lfunc_00111008_20:
	and	r2, r2, #255
.Lfunc_00111008_24:
	str	r1, [r3, #24]
.Lfunc_00111008_28:
	ldrb	r3, [r0, #4]
.Lfunc_00111008_2c:
	cmp	r3, r2
.Lfunc_00111008_30:
	bhi	.Lfunc_00111008_14
.Lfunc_00111008_34:
	ldrb	r2, [r0, #5]
.Lfunc_00111008_38:
	cmp	r2, #0
.Lfunc_00111008_3c:
	mov	r2, #0
.Lfunc_00111008_40:
	bls	.Lfunc_00111008_64
.Lfunc_00111008_44:
	add	r3, r0, r2, lsl #2
.Lfunc_00111008_48:
	add	r2, r2, #1
.Lfunc_00111008_4c:
	ldr	r3, [r3, #24]
.Lfunc_00111008_50:
	and	r2, r2, #255
.Lfunc_00111008_54:
	str	r1, [r3, #24]
.Lfunc_00111008_58:
	ldrb	r3, [r0, #5]
.Lfunc_00111008_5c:
	cmp	r3, r2
.Lfunc_00111008_60:
	bhi	.Lfunc_00111008_44
.Lfunc_00111008_64:
	ldrb	r2, [r0, #6]
.Lfunc_00111008_68:
	cmp	r2, #0
.Lfunc_00111008_6c:
	mov	r2, #0
.Lfunc_00111008_70:
	bls	.Lfunc_00111008_94
.Lfunc_00111008_74:
	add	r3, r0, r2, lsl #2
.Lfunc_00111008_78:
	add	r2, r2, #1
.Lfunc_00111008_7c:
	ldr	r3, [r3, #36]
.Lfunc_00111008_80:
	and	r2, r2, #255
.Lfunc_00111008_84:
	str	r1, [r3, #24]
.Lfunc_00111008_88:
	ldrb	r3, [r0, #6]
.Lfunc_00111008_8c:
	cmp	r3, r2
.Lfunc_00111008_90:
	bhi	.Lfunc_00111008_74
.Lfunc_00111008_94:
	ldrb	r2, [r0, #7]
.Lfunc_00111008_98:
	cmp	r2, #0
.Lfunc_00111008_9c:
	mov	r2, #0
.Lfunc_00111008_a0:
	bls	.Lfunc_00111008_c4
.Lfunc_00111008_a4:
	add	r3, r0, r2, lsl #2
.Lfunc_00111008_a8:
	add	r2, r2, #1
.Lfunc_00111008_ac:
	ldr	r3, [r3, #48]
.Lfunc_00111008_b0:
	and	r2, r2, #255
.Lfunc_00111008_b4:
	str	r1, [r3, #24]
.Lfunc_00111008_b8:
	ldrb	r3, [r0, #7]
.Lfunc_00111008_bc:
	cmp	r3, r2
.Lfunc_00111008_c0:
	bhi	.Lfunc_00111008_a4
.Lfunc_00111008_c4:
	ldrb	r2, [r0, #8]
.Lfunc_00111008_c8:
	cmp	r2, #0
.Lfunc_00111008_cc:
	mov	r2, #0
.Lfunc_00111008_d0:
	bls	.Lfunc_00111008_f4
.Lfunc_00111008_d4:
	add	r3, r0, r2, lsl #2
.Lfunc_00111008_d8:
	add	r2, r2, #1
.Lfunc_00111008_dc:
	ldr	r3, [r3, #52]
.Lfunc_00111008_e0:
	and	r2, r2, #255
.Lfunc_00111008_e4:
	str	r1, [r3, #24]
.Lfunc_00111008_e8:
	ldrb	r3, [r0, #8]
.Lfunc_00111008_ec:
	cmp	r3, r2
.Lfunc_00111008_f0:
	bhi	.Lfunc_00111008_d4
.Lfunc_00111008_f4:
	bx	lr
.size func_00111008, .-func_00111008

.section .text.func_004B60DC,"ax",%progbits
.balign 4
.global func_004B60DC
.type func_004B60DC, %function
func_004B60DC:
.Lfunc_004B60DC_0:
	add	r1, r0, r1, lsl #2
.Lfunc_004B60DC_4:
	push	{r4, r5, r6}
.Lfunc_004B60DC_8:
	mov	r3, #0
.Lfunc_004B60DC_c:
	ldr	r1, [r1, #8]
.Lfunc_004B60DC_10:
	mov	r6, #8
.Lfunc_004B60DC_14:
	ldr	ip, [r1, #24]
.Lfunc_004B60DC_18:
	ldr	r4, [r1, #28]
.Lfunc_004B60DC_1c:
	add	ip, ip, r1
.Lfunc_004B60DC_20:
	cmp	r4, #0
.Lfunc_004B60DC_24:
	mov	r1, r3
.Lfunc_004B60DC_28:
	bls	.Lfunc_004B60DC_60
.Lfunc_004B60DC_2c:
	add	r5, r1, r1, lsl #2
.Lfunc_004B60DC_30:
	add	r5, ip, r5, lsl #2
.Lfunc_004B60DC_34:
	ldrh	r5, [r5]
.Lfunc_004B60DC_38:
	cmp	r5, #0
.Lfunc_004B60DC_3c:
	beq	.Lfunc_004B60DC_54
.Lfunc_004B60DC_40:
	cmp	r5, #1
.Lfunc_004B60DC_44:
	addeq	r3, r3, #8
.Lfunc_004B60DC_48:
	beq	.Lfunc_004B60DC_54
.Lfunc_004B60DC_4c:
	cmp	r5, #2
.Lfunc_004B60DC_50:
	addeq	r3, r3, #24
.Lfunc_004B60DC_54:
	add	r1, r1, #1
.Lfunc_004B60DC_58:
	cmp	r4, r1
.Lfunc_004B60DC_5c:
	bhi	.Lfunc_004B60DC_2c
.Lfunc_004B60DC_60:
	cmp	r2, #0
.Lfunc_004B60DC_64:
	add	r5, r3, r6
.Lfunc_004B60DC_68:
	blt	.Lfunc_004B60DC_c8
.Lfunc_004B60DC_6c:
	add	r0, r0, r2, lsl #2
.Lfunc_004B60DC_70:
	mov	r1, #0
.Lfunc_004B60DC_74:
	ldr	r0, [r0, #8]
.Lfunc_004B60DC_78:
	ldr	r3, [r0, #24]
.Lfunc_004B60DC_7c:
	add	ip, r3, r0
.Lfunc_004B60DC_80:
	ldr	r3, [r0, #28]
.Lfunc_004B60DC_84:
	mov	r0, r1
.Lfunc_004B60DC_88:
	cmp	r3, #0
.Lfunc_004B60DC_8c:
	bls	.Lfunc_004B60DC_c4
.Lfunc_004B60DC_90:
	add	r4, r0, r0, lsl #2
.Lfunc_004B60DC_94:
	add	r4, ip, r4, lsl #2
.Lfunc_004B60DC_98:
	ldrh	r4, [r4]
.Lfunc_004B60DC_9c:
	cmp	r4, #0
.Lfunc_004B60DC_a0:
	beq	.Lfunc_004B60DC_b8
.Lfunc_004B60DC_a4:
	cmp	r4, #1
.Lfunc_004B60DC_a8:
	addeq	r1, r1, #8
.Lfunc_004B60DC_ac:
	beq	.Lfunc_004B60DC_b8
.Lfunc_004B60DC_b0:
	cmp	r4, #2
.Lfunc_004B60DC_b4:
	addeq	r1, r1, #24
.Lfunc_004B60DC_b8:
	add	r0, r0, #1
.Lfunc_004B60DC_bc:
	cmp	r3, r0
.Lfunc_004B60DC_c0:
	bhi	.Lfunc_004B60DC_90
.Lfunc_004B60DC_c4:
	add	r5, r5, r1
.Lfunc_004B60DC_c8:
	mov	r0, #1
.Lfunc_004B60DC_cc:
	add	r0, r0, r2, asr #31
.Lfunc_004B60DC_d0:
	cmp	r0, #0
.Lfunc_004B60DC_d4:
	movne	r0, #0
.Lfunc_004B60DC_d8:
	moveq	r0, #2
.Lfunc_004B60DC_dc:
	rsb	r0, r0, #8
.Lfunc_004B60DC_e0:
	lsl	r0, r0, #2
.Lfunc_004B60DC_e4:
	add	r0, r0, #96
.Lfunc_004B60DC_e8:
	addne	r0, r0, #24
.Lfunc_004B60DC_ec:
	add	r0, r0, r5
.Lfunc_004B60DC_f0:
	pop	{r4, r5, r6}
.Lfunc_004B60DC_f4:
	bx	lr
.size func_004B60DC, .-func_004B60DC

.section .text.func_00110F14,"ax",%progbits
.balign 4
.global func_00110F14
.type func_00110F14, %function
func_00110F14:
.Lfunc_00110F14_0:
	ldrb	r2, [r0, #4]
.Lfunc_00110F14_4:
	cmp	r2, #0
.Lfunc_00110F14_8:
	mov	r2, #0
.Lfunc_00110F14_c:
	bls	.Lfunc_00110F14_30
.Lfunc_00110F14_10:
	add	r3, r0, r2, lsl #2
.Lfunc_00110F14_14:
	add	r2, r2, #1
.Lfunc_00110F14_18:
	ldr	r3, [r3, #12]
.Lfunc_00110F14_1c:
	and	r2, r2, #255
.Lfunc_00110F14_20:
	strb	r1, [r3, #20]
.Lfunc_00110F14_24:
	ldrb	r3, [r0, #4]
.Lfunc_00110F14_28:
	cmp	r3, r2
.Lfunc_00110F14_2c:
	bhi	.Lfunc_00110F14_10
.Lfunc_00110F14_30:
	ldrb	r2, [r0, #5]
.Lfunc_00110F14_34:
	cmp	r2, #0
.Lfunc_00110F14_38:
	mov	r2, #0
.Lfunc_00110F14_3c:
	bls	.Lfunc_00110F14_60
.Lfunc_00110F14_40:
	add	r3, r0, r2, lsl #2
.Lfunc_00110F14_44:
	add	r2, r2, #1
.Lfunc_00110F14_48:
	ldr	r3, [r3, #24]
.Lfunc_00110F14_4c:
	and	r2, r2, #255
.Lfunc_00110F14_50:
	strb	r1, [r3, #20]
.Lfunc_00110F14_54:
	ldrb	r3, [r0, #5]
.Lfunc_00110F14_58:
	cmp	r3, r2
.Lfunc_00110F14_5c:
	bhi	.Lfunc_00110F14_40
.Lfunc_00110F14_60:
	ldrb	r2, [r0, #6]
.Lfunc_00110F14_64:
	cmp	r2, #0
.Lfunc_00110F14_68:
	mov	r2, #0
.Lfunc_00110F14_6c:
	bls	.Lfunc_00110F14_90
.Lfunc_00110F14_70:
	add	r3, r0, r2, lsl #2
.Lfunc_00110F14_74:
	add	r2, r2, #1
.Lfunc_00110F14_78:
	ldr	r3, [r3, #36]
.Lfunc_00110F14_7c:
	and	r2, r2, #255
.Lfunc_00110F14_80:
	strb	r1, [r3, #20]
.Lfunc_00110F14_84:
	ldrb	r3, [r0, #6]
.Lfunc_00110F14_88:
	cmp	r3, r2
.Lfunc_00110F14_8c:
	bhi	.Lfunc_00110F14_70
.Lfunc_00110F14_90:
	ldrb	r2, [r0, #7]
.Lfunc_00110F14_94:
	cmp	r2, #0
.Lfunc_00110F14_98:
	mov	r2, #0
.Lfunc_00110F14_9c:
	bls	.Lfunc_00110F14_c0
.Lfunc_00110F14_a0:
	add	r3, r0, r2, lsl #2
.Lfunc_00110F14_a4:
	add	r2, r2, #1
.Lfunc_00110F14_a8:
	ldr	r3, [r3, #48]
.Lfunc_00110F14_ac:
	and	r2, r2, #255
.Lfunc_00110F14_b0:
	strb	r1, [r3, #20]
.Lfunc_00110F14_b4:
	ldrb	r3, [r0, #7]
.Lfunc_00110F14_b8:
	cmp	r3, r2
.Lfunc_00110F14_bc:
	bhi	.Lfunc_00110F14_a0
.Lfunc_00110F14_c0:
	ldrb	r2, [r0, #8]
.Lfunc_00110F14_c4:
	cmp	r2, #0
.Lfunc_00110F14_c8:
	mov	r2, #0
.Lfunc_00110F14_cc:
	bls	.Lfunc_00110F14_f0
.Lfunc_00110F14_d0:
	add	r3, r0, r2, lsl #2
.Lfunc_00110F14_d4:
	add	r2, r2, #1
.Lfunc_00110F14_d8:
	ldr	r3, [r3, #52]
.Lfunc_00110F14_dc:
	and	r2, r2, #255
.Lfunc_00110F14_e0:
	strb	r1, [r3, #20]
.Lfunc_00110F14_e4:
	ldrb	r3, [r0, #8]
.Lfunc_00110F14_e8:
	cmp	r3, r2
.Lfunc_00110F14_ec:
	bhi	.Lfunc_00110F14_d0
.Lfunc_00110F14_f0:
	bx	lr
.size func_00110F14, .-func_00110F14

.section .text.func_00190568,"ax",%progbits
.balign 4
.global func_00190568
.type func_00190568, %function
func_00190568:
.Lfunc_00190568_0:
	ldrb	r2, [r0, #86]
.Lfunc_00190568_4:
	cmp	r2, #0
.Lfunc_00190568_8:
	bxeq	lr
.Lfunc_00190568_c:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_00190568_10:
	sub	sp, sp, #20
.Lfunc_00190568_14:
	mov	r6, #0
.Lfunc_00190568_18:
	ldr	r2, [r1]
.Lfunc_00190568_1c:
	str	r2, [sp]
.Lfunc_00190568_20:
	ldr	r2, [r1, #4]
.Lfunc_00190568_24:
	str	r2, [sp, #4]
.Lfunc_00190568_28:
	ldr	r2, [r1, #8]
.Lfunc_00190568_2c:
	str	r2, [sp, #8]
.Lfunc_00190568_30:
	ldr	r1, [r1, #12]
.Lfunc_00190568_34:
	str	r1, [sp, #12]
.Lfunc_00190568_38:
	ldr	r1, [r0, #64]
.Lfunc_00190568_3c:
	add	r1, r1, r1, lsl #2
.Lfunc_00190568_40:
	lsl	r8, r1, #5
.Lfunc_00190568_44:
	ldrb	r1, [r0, #85]
.Lfunc_00190568_48:
	cmp	r1, #0
.Lfunc_00190568_4c:
	movhi	r9, sp
.Lfunc_00190568_50:
	bls	.Lfunc_00190568_cc
.Lfunc_00190568_54:
	add	r7, r0, r6, lsl #2
.Lfunc_00190568_58:
	ldr	r2, [r9, r6, lsl #2]
.Lfunc_00190568_5c:
	ldr	r1, [r7, #28]
.Lfunc_00190568_60:
	mov	r4, #0
.Lfunc_00190568_64:
	add	r3, r1, r8, lsl #2
.Lfunc_00190568_68:
	ldr	r1, [r7, #44]
.Lfunc_00190568_6c:
	ldr	ip, [r3]
.Lfunc_00190568_70:
	ldr	sl, [r0, #68]
.Lfunc_00190568_74:
	ldr	lr, [r2]
.Lfunc_00190568_78:
	cmp	ip, #0
.Lfunc_00190568_7c:
	movge	r5, ip
.Lfunc_00190568_80:
	rsblt	r5, ip, #0
.Lfunc_00190568_84:
	add	r4, r4, #1
.Lfunc_00190568_88:
	mul	r5, r5, sl
.Lfunc_00190568_8c:
	ldrd	sl, [r0, #72]
.Lfunc_00190568_90:
	asr	r5, r5, #7
.Lfunc_00190568_94:
	rsblt	r5, r5, #0
.Lfunc_00190568_98:
	sub	r5, lr, r5
.Lfunc_00190568_9c:
	cmp	r4, #160
.Lfunc_00190568_a0:
	mul	r5, sl, r5
.Lfunc_00190568_a4:
	mla	r1, fp, r1, r5
.Lfunc_00190568_a8:
	asr	r1, r1, #7
.Lfunc_00190568_ac:
	str	r1, [r3], #4
.Lfunc_00190568_b0:
	str	ip, [r2], #4
.Lfunc_00190568_b4:
	bcc	.Lfunc_00190568_6c
.Lfunc_00190568_b8:
	str	r1, [r7, #44]
.Lfunc_00190568_bc:
	ldrb	r1, [r0, #85]
.Lfunc_00190568_c0:
	add	r6, r6, #1
.Lfunc_00190568_c4:
	cmp	r6, r1
.Lfunc_00190568_c8:
	bcc	.Lfunc_00190568_54
.Lfunc_00190568_cc:
	ldr	r1, [r0, #64]
.Lfunc_00190568_d0:
	ldr	r2, [r0, #60]
.Lfunc_00190568_d4:
	add	r1, r1, #1
.Lfunc_00190568_d8:
	cmp	r2, r1
.Lfunc_00190568_dc:
	str	r1, [r0, #64]
.Lfunc_00190568_e0:
	movls	r1, #0
.Lfunc_00190568_e4:
	strls	r1, [r0, #64]
.Lfunc_00190568_e8:
	add	sp, sp, #20
.Lfunc_00190568_ec:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00190568, .-func_00190568

.section .text.func_00195160,"ax",%progbits
.balign 4
.global func_00195160
.type func_00195160, %function
func_00195160:
.Lfunc_00195160_0:
	cmp	r3, #0
.Lfunc_00195160_4:
	bmi	.Lfunc_00195160_64
.Lfunc_00195160_8:
	lsls	r7, r6, #1
.Lfunc_00195160_c:
	beq	.Lfunc_00195160_58
.Lfunc_00195160_10:
	push	{r2, r3, r4, lr}
.Lfunc_00195160_14:
	rrx	r7, r7
.Lfunc_00195160_18:
	push	{r0, r1}
.Lfunc_00195160_1c:
	mov	r0, #16
.Lfunc_00195160_20:
	mov	r1, #16
.Lfunc_00195160_24:
	mov	r0, #0
.Lfunc_00195160_28:
	pop	{r0, r1, r2, r3}
.Lfunc_00195160_2c:
	add	fp, fp, #1
.Lfunc_00195160_30:
	cmp	fp, #1
.Lfunc_00195160_34:
	lsrseq	r7, r7, #32
.Lfunc_00195160_38:
	pop	{r4, lr}
.Lfunc_00195160_3c:
	addscs	r2, r2, #1
.Lfunc_00195160_40:
	addscs	r1, r1, #1
.Lfunc_00195160_44:
	movcs	r1, #-2147483648
.Lfunc_00195160_48:
	adc	r3, r3, #0
.Lfunc_00195160_4c:
	and	r0, r0, #-2147483648
.Lfunc_00195160_50:
	orr	r0, r3, r0
.Lfunc_00195160_54:
	bx	lr
.Lfunc_00195160_58:
	bcc	.Lfunc_00195160_4c
.Lfunc_00195160_5c:
	lsrs	r7, r2, #1
.Lfunc_00195160_60:
	b	.Lfunc_00195160_10
.Lfunc_00195160_64:
	orr	r6, r6, r6, lsl #16
.Lfunc_00195160_68:
	cmn	r3, #64
.Lfunc_00195160_6c:
	lsr	r6, r6, #16
.Lfunc_00195160_70:
	ble	.Lfunc_00195160_b4
.Lfunc_00195160_74:
	cmn	r3, #32
.Lfunc_00195160_78:
	orrle	r6, r6, r2
.Lfunc_00195160_7c:
	movle	r2, r1
.Lfunc_00195160_80:
	movle	r1, #0
.Lfunc_00195160_84:
	addle	r3, r3, #32
.Lfunc_00195160_88:
	rsbs	r3, r3, #0
.Lfunc_00195160_8c:
	beq	.Lfunc_00195160_8
.Lfunc_00195160_90:
	orr	r6, r6, r6, lsl #16
.Lfunc_00195160_94:
	rsb	r7, r3, #32
.Lfunc_00195160_98:
	lsr	r6, r6, #16
.Lfunc_00195160_9c:
	orr	r6, r6, r2, lsl r7
.Lfunc_00195160_a0:
	lsr	r2, r2, r3
.Lfunc_00195160_a4:
	orr	r2, r2, r1, lsl r7
.Lfunc_00195160_a8:
	lsr	r1, r1, r3
.Lfunc_00195160_ac:
	mov	r3, #0
.Lfunc_00195160_b0:
	b	.Lfunc_00195160_8
.Lfunc_00195160_b4:
	orr	r6, r6, r2
.Lfunc_00195160_b8:
	mov	r3, #0
.Lfunc_00195160_bc:
	mov	r2, #0
.Lfunc_00195160_c0:
	orr	r6, r6, r6, lsl #16
.Lfunc_00195160_c4:
	lsr	r6, r6, #16
.Lfunc_00195160_c8:
	orr	r6, r6, r1
.Lfunc_00195160_cc:
	mov	r1, #0
.Lfunc_00195160_d0:
	orrlt	r6, r6, r6, lsl #16
.Lfunc_00195160_d4:
	lsrlt	r6, r6, #16
.Lfunc_00195160_d8:
	b	.Lfunc_00195160_8
.size func_00195160, .-func_00195160

.section .text.func_001FAE40,"ax",%progbits
.balign 4
.global func_001FAE40
.type func_001FAE40, %function
func_001FAE40:
.Lfunc_001FAE40_0:
	mov	ip, r0
.Lfunc_001FAE40_4:
	push	{r4, r5}
.Lfunc_001FAE40_8:
	ldr	r5, [ip]
.Lfunc_001FAE40_c:
	mov	r0, #4
.Lfunc_001FAE40_10:
	add	r0, r0, r1, lsl #3
.Lfunc_001FAE40_14:
	ldr	r4, [sp, #8]
.Lfunc_001FAE40_18:
	ldr	r0, [r5, r0]
.Lfunc_001FAE40_1c:
	sub	r0, r0, r4
.Lfunc_001FAE40_20:
	cmp	r0, r3
.Lfunc_001FAE40_24:
	movls	r3, r0
.Lfunc_001FAE40_28:
	cmp	r3, #0
.Lfunc_001FAE40_2c:
	moveq	r0, #0
.Lfunc_001FAE40_30:
	beq	.Lfunc_001FAE40_d4
.Lfunc_001FAE40_34:
	add	r0, r5, r1, lsl #3
.Lfunc_001FAE40_38:
	ldr	r1, [ip, #28]
.Lfunc_001FAE40_3c:
	ldr	r0, [r0]
.Lfunc_001FAE40_40:
	ldr	r5, [ip, #32]
.Lfunc_001FAE40_44:
	add	r0, r0, r1
.Lfunc_001FAE40_48:
	add	r5, r5, r1
.Lfunc_001FAE40_4c:
	add	r0, r0, r4
.Lfunc_001FAE40_50:
	cmp	r5, r0
.Lfunc_001FAE40_54:
	subls	r0, r0, r5
.Lfunc_001FAE40_58:
	addls	r0, r0, r1
.Lfunc_001FAE40_5c:
	cmp	r3, #0
.Lfunc_001FAE40_60:
	ble	.Lfunc_001FAE40_d0
.Lfunc_001FAE40_64:
	tst	r3, #1
.Lfunc_001FAE40_68:
	sub	r1, r2, #1
.Lfunc_001FAE40_6c:
	beq	.Lfunc_001FAE40_8c
.Lfunc_001FAE40_70:
	ldrb	r2, [r0], #1
.Lfunc_001FAE40_74:
	strb	r2, [r1, #1]!
.Lfunc_001FAE40_78:
	add	r2, ip, #28
.Lfunc_001FAE40_7c:
	ldm	r2, {r2, r4}
.Lfunc_001FAE40_80:
	add	r4, r4, r2
.Lfunc_001FAE40_84:
	cmp	r4, r0
.Lfunc_001FAE40_88:
	moveq	r0, r2
.Lfunc_001FAE40_8c:
	asrs	r2, r3, #1
.Lfunc_001FAE40_90:
	beq	.Lfunc_001FAE40_d0
.Lfunc_001FAE40_94:
	ldrb	r4, [r0], #1
.Lfunc_001FAE40_98:
	strb	r4, [r1, #1]
.Lfunc_001FAE40_9c:
	ldr	r4, [ip, #32]
.Lfunc_001FAE40_a0:
	ldr	r5, [ip, #28]
.Lfunc_001FAE40_a4:
	add	r4, r4, r5
.Lfunc_001FAE40_a8:
	cmp	r4, r0
.Lfunc_001FAE40_ac:
	moveq	r0, r5
.Lfunc_001FAE40_b0:
	ldrb	r4, [r0], #1
.Lfunc_001FAE40_b4:
	strb	r4, [r1, #2]!
.Lfunc_001FAE40_b8:
	ldrd	r4, [ip, #28]
.Lfunc_001FAE40_bc:
	add	r5, r5, r4
.Lfunc_001FAE40_c0:
	cmp	r5, r0
.Lfunc_001FAE40_c4:
	moveq	r0, r4
.Lfunc_001FAE40_c8:
	subs	r2, r2, #1
.Lfunc_001FAE40_cc:
	bne	.Lfunc_001FAE40_94
.Lfunc_001FAE40_d0:
	mov	r0, r3
.Lfunc_001FAE40_d4:
	pop	{r4, r5}
.Lfunc_001FAE40_d8:
	bx	lr
.size func_001FAE40, .-func_001FAE40

.section .text.func_0056DD44,"ax",%progbits
.balign 4
.global func_0056DD44
.type func_0056DD44, %function
func_0056DD44:
.Lfunc_0056DD44_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0056DD44_4:
	ldr	r3, [r1, #16]
.Lfunc_0056DD44_8:
	mov	r4, r3
.Lfunc_0056DD44_c:
	ldr	r1, [r3, #4]
.Lfunc_0056DD44_10:
	cmp	r1, #0
.Lfunc_0056DD44_14:
	beq	.Lfunc_0056DD44_70
.Lfunc_0056DD44_18:
	ldrh	fp, [r2, #6]
.Lfunc_0056DD44_1c:
	ldr	r8, [r2, #8]
.Lfunc_0056DD44_20:
	mov	r5, fp
.Lfunc_0056DD44_24:
	ldrh	r6, [r1, #22]
.Lfunc_0056DD44_28:
	ldr	r7, [r1, #24]
.Lfunc_0056DD44_2c:
	add	ip, r1, #16
.Lfunc_0056DD44_30:
	subs	sl, r6, r5
.Lfunc_0056DD44_34:
	sbcs	r9, r7, r8
.Lfunc_0056DD44_38:
	blt	.Lfunc_0056DD44_64
.Lfunc_0056DD44_3c:
	cmp	r7, r8
.Lfunc_0056DD44_40:
	cmpeq	r6, fp
.Lfunc_0056DD44_44:
	bne	.Lfunc_0056DD44_c0
.Lfunc_0056DD44_48:
	ldrb	ip, [ip, #32]
.Lfunc_0056DD44_4c:
	ldrb	r6, [r2, #32]
.Lfunc_0056DD44_50:
	cmp	ip, r6
.Lfunc_0056DD44_54:
	movcc	ip, #1
.Lfunc_0056DD44_58:
	movcs	ip, #0
.Lfunc_0056DD44_5c:
	cmp	ip, #0
.Lfunc_0056DD44_60:
	beq	.Lfunc_0056DD44_c0
.Lfunc_0056DD44_64:
	ldr	r1, [r1, #12]
.Lfunc_0056DD44_68:
	cmp	r1, #0
.Lfunc_0056DD44_6c:
	bne	.Lfunc_0056DD44_24
.Lfunc_0056DD44_70:
	cmp	r3, r4
.Lfunc_0056DD44_74:
	beq	.Lfunc_0056DD44_b4
.Lfunc_0056DD44_78:
	ldrh	r6, [r2, #6]
.Lfunc_0056DD44_7c:
	ldrh	ip, [r3, #22]
.Lfunc_0056DD44_80:
	ldr	r5, [r2, #8]
.Lfunc_0056DD44_84:
	ldr	r7, [r3, #24]
.Lfunc_0056DD44_88:
	subs	r8, r6, ip
.Lfunc_0056DD44_8c:
	add	r1, r3, #16
.Lfunc_0056DD44_90:
	sbcs	r8, r5, r7
.Lfunc_0056DD44_94:
	blt	.Lfunc_0056DD44_b4
.Lfunc_0056DD44_98:
	cmp	r5, r7
.Lfunc_0056DD44_9c:
	cmpeq	r6, ip
.Lfunc_0056DD44_a0:
	bne	.Lfunc_0056DD44_cc
.Lfunc_0056DD44_a4:
	ldrb	r2, [r2, #32]
.Lfunc_0056DD44_a8:
	ldrb	r1, [r1, #32]
.Lfunc_0056DD44_ac:
	cmp	r2, r1
.Lfunc_0056DD44_b0:
	bcs	.Lfunc_0056DD44_cc
.Lfunc_0056DD44_b4:
	str	r4, [r0]
.Lfunc_0056DD44_b8:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0056DD44_bc:
	bx	lr
.Lfunc_0056DD44_c0:
	mov	r3, r1
.Lfunc_0056DD44_c4:
	ldr	r1, [r1, #8]
.Lfunc_0056DD44_c8:
	b	.Lfunc_0056DD44_68
.Lfunc_0056DD44_cc:
	str	r3, [r0]
.Lfunc_0056DD44_d0:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0056DD44_d4:
	bx	lr
.size func_0056DD44, .-func_0056DD44

.section .text.func_001F3D9C,"ax",%progbits
.balign 4
.global func_001F3D9C
.type func_001F3D9C, %function
func_001F3D9C:
.Lfunc_001F3D9C_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_001F3D9C_4:
	mov	r4, #0
.Lfunc_001F3D9C_8:
	ldrb	ip, [r0]
.Lfunc_001F3D9C_c:
	ldr	r5, [sp, #20]
.Lfunc_001F3D9C_10:
	cmp	ip, #0
.Lfunc_001F3D9C_14:
	movne	r6, #0
.Lfunc_001F3D9C_18:
	beq	.Lfunc_001F3D9C_a4
.Lfunc_001F3D9C_1c:
	and	ip, ip, #255
.Lfunc_001F3D9C_20:
	sub	ip, ip, #1
.Lfunc_001F3D9C_24:
	and	ip, ip, #255
.Lfunc_001F3D9C_28:
	cmp	ip, #3
.Lfunc_001F3D9C_2c:
	strb	ip, [r0]
.Lfunc_001F3D9C_30:
	bhi	.Lfunc_001F3D9C_50
.Lfunc_001F3D9C_34:
	rsb	ip, ip, #3
.Lfunc_001F3D9C_38:
	ldrb	r7, [r2]
.Lfunc_001F3D9C_3c:
	ldr	r8, [r1]
.Lfunc_001F3D9C_40:
	lsl	ip, ip, #3
.Lfunc_001F3D9C_44:
	orr	ip, r8, r7, lsl ip
.Lfunc_001F3D9C_48:
	str	ip, [r1]
.Lfunc_001F3D9C_4c:
	b	.Lfunc_001F3D9C_70
.Lfunc_001F3D9C_50:
	cmp	ip, #6
.Lfunc_001F3D9C_54:
	bhi	.Lfunc_001F3D9C_70
.Lfunc_001F3D9C_58:
	rsb	ip, ip, #6
.Lfunc_001F3D9C_5c:
	ldrb	r7, [r2]
.Lfunc_001F3D9C_60:
	ldr	r8, [r1]
.Lfunc_001F3D9C_64:
	lsl	ip, ip, #3
.Lfunc_001F3D9C_68:
	orr	ip, r8, r7, lsl ip
.Lfunc_001F3D9C_6c:
	str	ip, [r1]
.Lfunc_001F3D9C_70:
	ldrb	ip, [r0]
.Lfunc_001F3D9C_74:
	add	r2, r2, #1
.Lfunc_001F3D9C_78:
	add	r4, r4, #1
.Lfunc_001F3D9C_7c:
	cmp	ip, #4
.Lfunc_001F3D9C_80:
	bne	.Lfunc_001F3D9C_90
.Lfunc_001F3D9C_84:
	ldr	ip, [r1]
.Lfunc_001F3D9C_88:
	cmp	ip, #0
.Lfunc_001F3D9C_8c:
	strbgt	r6, [r0]
.Lfunc_001F3D9C_90:
	subs	r3, r3, #1
.Lfunc_001F3D9C_94:
	beq	.Lfunc_001F3D9C_c0
.Lfunc_001F3D9C_98:
	ldrb	ip, [r0]
.Lfunc_001F3D9C_9c:
	cmp	ip, #0
.Lfunc_001F3D9C_a0:
	bne	.Lfunc_001F3D9C_1c
.Lfunc_001F3D9C_a4:
	cmp	r5, #0
.Lfunc_001F3D9C_a8:
	ldrgt	r0, [r1]
.Lfunc_001F3D9C_ac:
	cmpgt	r0, r5
.Lfunc_001F3D9C_b0:
	strgt	r5, [r1]
.Lfunc_001F3D9C_b4:
	mov	r0, r4
.Lfunc_001F3D9C_b8:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_001F3D9C_bc:
	bx	lr
.Lfunc_001F3D9C_c0:
	ldrb	r0, [r0]
.Lfunc_001F3D9C_c4:
	cmp	r0, #0
.Lfunc_001F3D9C_c8:
	bne	.Lfunc_001F3D9C_b4
.Lfunc_001F3D9C_cc:
	b	.Lfunc_001F3D9C_a4
.size func_001F3D9C, .-func_001F3D9C

.section .text.func_00549E14,"ax",%progbits
.balign 4
.global func_00549E14
.type func_00549E14, %function
func_00549E14:
.Lfunc_00549E14_0:
	vldr	s1, [r0, #24]
.Lfunc_00549E14_4:
	ldr	r2, [r0, #32]
.Lfunc_00549E14_8:
	vdiv.f32	s2, s0, s1
.Lfunc_00549E14_c:
	ldr	r3, [r2]
.Lfunc_00549E14_10:
	vcvt.u32.f32	s1, s2
.Lfunc_00549E14_14:
	lsl	r3, r3, #20
.Lfunc_00549E14_18:
	lsr	r3, r3, #20
.Lfunc_00549E14_1c:
	vmov	r1, s1
.Lfunc_00549E14_20:
	cmp	r3, r1
.Lfunc_00549E14_24:
	movhi	r0, r2
.Lfunc_00549E14_28:
	bxhi	lr
.Lfunc_00549E14_2c:
	push	{r4}
.Lfunc_00549E14_30:
	ldrh	ip, [r0, #14]
.Lfunc_00549E14_34:
	mvn	r3, #7
.Lfunc_00549E14_38:
	add	r3, r3, ip, lsl #3
.Lfunc_00549E14_3c:
	add	r3, r3, r2
.Lfunc_00549E14_40:
	ldr	r4, [r3]
.Lfunc_00549E14_44:
	lsl	r4, r4, #20
.Lfunc_00549E14_48:
	lsr	r4, r4, #20
.Lfunc_00549E14_4c:
	cmp	r1, r4
.Lfunc_00549E14_50:
	movcs	r0, r3
.Lfunc_00549E14_54:
	bcs	.Lfunc_00549E14_a4
.Lfunc_00549E14_58:
	sub	r3, ip, #1
.Lfunc_00549E14_5c:
	vmov	s1, r3
.Lfunc_00549E14_60:
	vldr	s2, [r0, #28]
.Lfunc_00549E14_64:
	vcvt.f32.s32	s1, s1
.Lfunc_00549E14_68:
	vmul.f32	s0, s1, s0
.Lfunc_00549E14_6c:
	vmul.f32	s0, s2, s0
.Lfunc_00549E14_70:
	vcvt.u32.f32	s0, s0
.Lfunc_00549E14_74:
	vmov	r0, s0
.Lfunc_00549E14_78:
	add	r0, r2, r0, lsl #3
.Lfunc_00549E14_7c:
	ldr	r2, [r0]
.Lfunc_00549E14_80:
	lsl	r2, r2, #20
.Lfunc_00549E14_84:
	lsr	r2, r2, #20
.Lfunc_00549E14_88:
	cmp	r1, r2
.Lfunc_00549E14_8c:
	bcs	.Lfunc_00549E14_ac
.Lfunc_00549E14_90:
	ldr	r2, [r0, #-8]!
.Lfunc_00549E14_94:
	lsl	r2, r2, #20
.Lfunc_00549E14_98:
	lsr	r2, r2, #20
.Lfunc_00549E14_9c:
	cmp	r2, r1
.Lfunc_00549E14_a0:
	bhi	.Lfunc_00549E14_90
.Lfunc_00549E14_a4:
	pop	{r4}
.Lfunc_00549E14_a8:
	bx	lr
.Lfunc_00549E14_ac:
	ldr	r2, [r0, #8]!
.Lfunc_00549E14_b0:
	lsl	r2, r2, #20
.Lfunc_00549E14_b4:
	lsr	r2, r2, #20
.Lfunc_00549E14_b8:
	cmp	r2, r1
.Lfunc_00549E14_bc:
	bls	.Lfunc_00549E14_ac
.Lfunc_00549E14_c0:
	pop	{r4}
.Lfunc_00549E14_c4:
	sub	r0, r0, #8
.Lfunc_00549E14_c8:
	bx	lr
.size func_00549E14, .-func_00549E14

.section .text.func_00188338,"ax",%progbits
.balign 4
.global func_00188338
.type func_00188338, %function
func_00188338:
.Lfunc_00188338_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_00188338_4:
	mov	ip, r0
.Lfunc_00188338_8:
	mov	r0, #0
.Lfunc_00188338_c:
	mov	r4, r0
.Lfunc_00188338_10:
	sub	r3, r2, #1
.Lfunc_00188338_14:
	mov	r5, #192
.Lfunc_00188338_18:
	mov	r6, #224
.Lfunc_00188338_1c:
	mov	r7, #128
.Lfunc_00188338_20:
	b	.Lfunc_00188338_9c
.Lfunc_00188338_24:
	cmp	r2, #128
.Lfunc_00188338_28:
	bcs	.Lfunc_00188338_3c
.Lfunc_00188338_2c:
	sub	r3, r3, #1
.Lfunc_00188338_30:
	add	r0, r0, #1
.Lfunc_00188338_34:
	strb	r2, [r1], #1
.Lfunc_00188338_38:
	b	.Lfunc_00188338_98
.Lfunc_00188338_3c:
	cmp	r2, #2048
.Lfunc_00188338_40:
	bge	.Lfunc_00188338_64
.Lfunc_00188338_44:
	orr	r8, r5, r2, asr #6
.Lfunc_00188338_48:
	and	r9, r2, #63
.Lfunc_00188338_4c:
	strb	r8, [r1], #1
.Lfunc_00188338_50:
	orr	r2, r9, #128
.Lfunc_00188338_54:
	sub	r3, r3, #2
.Lfunc_00188338_58:
	add	r0, r0, #2
.Lfunc_00188338_5c:
	strb	r2, [r1], #1
.Lfunc_00188338_60:
	b	.Lfunc_00188338_98
.Lfunc_00188338_64:
	cmp	r2, #65536
.Lfunc_00188338_68:
	movge	r4, #1
.Lfunc_00188338_6c:
	bge	.Lfunc_00188338_98
.Lfunc_00188338_70:
	orr	r8, r6, r2, asr #12
.Lfunc_00188338_74:
	lsl	r9, r2, #20
.Lfunc_00188338_78:
	strb	r8, [r1], #1
.Lfunc_00188338_7c:
	orr	r9, r7, r9, lsr #26
.Lfunc_00188338_80:
	and	r2, r2, #63
.Lfunc_00188338_84:
	strb	r9, [r1], #1
.Lfunc_00188338_88:
	orr	r8, r2, #128
.Lfunc_00188338_8c:
	sub	r3, r3, #3
.Lfunc_00188338_90:
	add	r0, r0, #3
.Lfunc_00188338_94:
	strb	r8, [r1], #1
.Lfunc_00188338_98:
	add	ip, ip, #2
.Lfunc_00188338_9c:
	ldrh	r2, [ip]
.Lfunc_00188338_a0:
	cmp	r2, #0
.Lfunc_00188338_a4:
	cmpne	r3, #0
.Lfunc_00188338_a8:
	beq	.Lfunc_00188338_b4
.Lfunc_00188338_ac:
	cmp	r4, #0
.Lfunc_00188338_b0:
	beq	.Lfunc_00188338_24
.Lfunc_00188338_b4:
	mov	r2, #0
.Lfunc_00188338_b8:
	strb	r2, [r1]
.Lfunc_00188338_bc:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_00188338_c0:
	bx	lr
.size func_00188338, .-func_00188338

.section .text.func_0013F394,"ax",%progbits
.balign 4
.global func_0013F394
.type func_0013F394, %function
func_0013F394:
.Lfunc_0013F394_0:
	cmp	r1, #0
.Lfunc_0013F394_4:
	beq	.Lfunc_0013F394_b0
.Lfunc_0013F394_8:
	ldr	r3, [r1]
.Lfunc_0013F394_c:
	ldrb	r0, [r2, #8]
.Lfunc_0013F394_10:
	lsl	r3, r3, #1
.Lfunc_0013F394_14:
	cmp	r0, r3, lsr #25
.Lfunc_0013F394_18:
	bne	.Lfunc_0013F394_b0
.Lfunc_0013F394_1c:
	cmp	r0, #12
.Lfunc_0013F394_20:
	beq	.Lfunc_0013F394_48
.Lfunc_0013F394_24:
	cmp	r0, #22
.Lfunc_0013F394_28:
	beq	.Lfunc_0013F394_5c
.Lfunc_0013F394_2c:
	cmp	r0, #39
.Lfunc_0013F394_30:
	beq	.Lfunc_0013F394_70
.Lfunc_0013F394_34:
	cmp	r0, #46
.Lfunc_0013F394_38:
	beq	.Lfunc_0013F394_84
.Lfunc_0013F394_3c:
	cmp	r0, #32
.Lfunc_0013F394_40:
	beq	.Lfunc_0013F394_98
.Lfunc_0013F394_44:
	b	.Lfunc_0013F394_b0
.Lfunc_0013F394_48:
	ldr	r2, [r2, #4]
.Lfunc_0013F394_4c:
	ldr	r0, [r1, #136]
.Lfunc_0013F394_50:
	cmp	r0, r2
.Lfunc_0013F394_54:
	beq	.Lfunc_0013F394_a8
.Lfunc_0013F394_58:
	b	.Lfunc_0013F394_b0
.Lfunc_0013F394_5c:
	ldr	r0, [r2, #4]
.Lfunc_0013F394_60:
	ldr	r1, [r1, #112]
.Lfunc_0013F394_64:
	cmp	r1, r0
.Lfunc_0013F394_68:
	beq	.Lfunc_0013F394_a8
.Lfunc_0013F394_6c:
	b	.Lfunc_0013F394_b0
.Lfunc_0013F394_70:
	ldr	r0, [r2, #4]
.Lfunc_0013F394_74:
	ldr	r1, [r1, #112]
.Lfunc_0013F394_78:
	cmp	r1, r0
.Lfunc_0013F394_7c:
	beq	.Lfunc_0013F394_a8
.Lfunc_0013F394_80:
	b	.Lfunc_0013F394_b0
.Lfunc_0013F394_84:
	ldr	r0, [r2, #4]
.Lfunc_0013F394_88:
	ldr	r1, [r1, #112]
.Lfunc_0013F394_8c:
	cmp	r1, r0
.Lfunc_0013F394_90:
	beq	.Lfunc_0013F394_a8
.Lfunc_0013F394_94:
	b	.Lfunc_0013F394_b0
.Lfunc_0013F394_98:
	ldr	r0, [r2, #4]
.Lfunc_0013F394_9c:
	ldr	r1, [r1, #112]
.Lfunc_0013F394_a0:
	cmp	r1, r0
.Lfunc_0013F394_a4:
	bne	.Lfunc_0013F394_b0
.Lfunc_0013F394_a8:
	mov	r0, #1
.Lfunc_0013F394_ac:
	bx	lr
.Lfunc_0013F394_b0:
	mov	r0, #0
.Lfunc_0013F394_b4:
	bx	lr
.size func_0013F394, .-func_0013F394

.section .text.func_001C3238,"ax",%progbits
.balign 4
.global func_001C3238
.type func_001C3238, %function
func_001C3238:
.Lfunc_001C3238_0:
	mov	r2, r0
.Lfunc_001C3238_4:
	cmp	r1, #1
.Lfunc_001C3238_8:
	mvn	r0, #0
.Lfunc_001C3238_c:
	beq	.Lfunc_001C3238_54
.Lfunc_001C3238_10:
	cmp	r1, #2
.Lfunc_001C3238_14:
	beq	.Lfunc_001C3238_80
.Lfunc_001C3238_18:
	cmp	r1, #4
.Lfunc_001C3238_1c:
	beq	.Lfunc_001C3238_34
.Lfunc_001C3238_20:
	cmp	r1, #8
.Lfunc_001C3238_24:
	bne	.Lfunc_001C3238_40
.Lfunc_001C3238_28:
	cmp	r2, #9
.Lfunc_001C3238_2c:
	ble	.Lfunc_001C3238_3c
.Lfunc_001C3238_30:
	b	.Lfunc_001C3238_a4
.Lfunc_001C3238_34:
	cmp	r2, #9
.Lfunc_001C3238_38:
	bgt	.Lfunc_001C3238_44
.Lfunc_001C3238_3c:
	mov	r0, #8
.Lfunc_001C3238_40:
	bx	lr
.Lfunc_001C3238_44:
	cmp	r2, #26
.Lfunc_001C3238_48:
	cmpgt	r2, #40
.Lfunc_001C3238_4c:
	movle	r0, #16
.Lfunc_001C3238_50:
	bx	lr
.Lfunc_001C3238_54:
	cmp	r2, #9
.Lfunc_001C3238_58:
	bgt	.Lfunc_001C3238_64
.Lfunc_001C3238_5c:
	mov	r0, #10
.Lfunc_001C3238_60:
	bx	lr
.Lfunc_001C3238_64:
	cmp	r2, #26
.Lfunc_001C3238_68:
	bgt	.Lfunc_001C3238_74
.Lfunc_001C3238_6c:
	mov	r0, #12
.Lfunc_001C3238_70:
	bx	lr
.Lfunc_001C3238_74:
	cmp	r2, #40
.Lfunc_001C3238_78:
	movle	r0, #14
.Lfunc_001C3238_7c:
	bx	lr
.Lfunc_001C3238_80:
	cmp	r2, #9
.Lfunc_001C3238_84:
	movle	r0, #9
.Lfunc_001C3238_88:
	ble	.Lfunc_001C3238_40
.Lfunc_001C3238_8c:
	cmp	r2, #26
.Lfunc_001C3238_90:
	movle	r0, #11
.Lfunc_001C3238_94:
	ble	.Lfunc_001C3238_40
.Lfunc_001C3238_98:
	cmp	r2, #40
.Lfunc_001C3238_9c:
	movle	r0, #13
.Lfunc_001C3238_a0:
	bx	lr
.Lfunc_001C3238_a4:
	cmp	r2, #26
.Lfunc_001C3238_a8:
	ble	.Lfunc_001C3238_5c
.Lfunc_001C3238_ac:
	cmp	r2, #40
.Lfunc_001C3238_b0:
	ble	.Lfunc_001C3238_6c
.Lfunc_001C3238_b4:
	bx	lr
.size func_001C3238, .-func_001C3238

.section .text.func_0014E170,"ax",%progbits
.balign 4
.global func_0014E170
.type func_0014E170, %function
func_0014E170:
.Lfunc_0014E170_0:
	push	{r4, r5, r6}
.Lfunc_0014E170_4:
	mov	r4, #0
.Lfunc_0014E170_8:
	ldrh	r2, [r1]
.Lfunc_0014E170_c:
	cmp	r2, #16
.Lfunc_0014E170_10:
	strh	r2, [r0]
.Lfunc_0014E170_14:
	bne	.Lfunc_0014E170_7c
.Lfunc_0014E170_18:
	ldrh	r3, [r1, #2]
.Lfunc_0014E170_1c:
	mov	r2, r1
.Lfunc_0014E170_20:
	add	r3, r3, #2
.Lfunc_0014E170_24:
	add	r1, r1, r3, lsl #1
.Lfunc_0014E170_28:
	sub	r5, r1, r2
.Lfunc_0014E170_2c:
	asr	r3, r5, #1
.Lfunc_0014E170_30:
	cmp	r3, #0
.Lfunc_0014E170_34:
	add	r4, r4, r5, asr #1
.Lfunc_0014E170_38:
	ble	.Lfunc_0014E170_88
.Lfunc_0014E170_3c:
	lsls	ip, r5, #30
.Lfunc_0014E170_40:
	mov	r3, r0
.Lfunc_0014E170_44:
	bpl	.Lfunc_0014E170_54
.Lfunc_0014E170_48:
	ldrh	ip, [r2, #2]!
.Lfunc_0014E170_4c:
	add	r3, r0, #2
.Lfunc_0014E170_50:
	strh	ip, [r0, #2]
.Lfunc_0014E170_54:
	asrs	ip, r5, #2
.Lfunc_0014E170_58:
	beq	.Lfunc_0014E170_74
.Lfunc_0014E170_5c:
	ldrh	r6, [r2, #2]
.Lfunc_0014E170_60:
	subs	ip, ip, #1
.Lfunc_0014E170_64:
	strh	r6, [r3, #2]
.Lfunc_0014E170_68:
	ldrh	r6, [r2, #4]!
.Lfunc_0014E170_6c:
	strh	r6, [r3, #4]!
.Lfunc_0014E170_70:
	bne	.Lfunc_0014E170_5c
.Lfunc_0014E170_74:
	bic	r2, r5, #1
.Lfunc_0014E170_78:
	add	r0, r0, r2
.Lfunc_0014E170_7c:
	ldrh	r2, [r0]
.Lfunc_0014E170_80:
	cmp	r2, #0
.Lfunc_0014E170_84:
	beq	.Lfunc_0014E170_a8
.Lfunc_0014E170_88:
	add	r4, r4, #1
.Lfunc_0014E170_8c:
	cmp	r4, #2048
.Lfunc_0014E170_90:
	add	r0, r0, #2
.Lfunc_0014E170_94:
	add	r1, r1, #2
.Lfunc_0014E170_98:
	bcc	.Lfunc_0014E170_8
.Lfunc_0014E170_9c:
	mov	r1, #0
.Lfunc_0014E170_a0:
	sub	r4, r4, #1
.Lfunc_0014E170_a4:
	strh	r1, [r0]
.Lfunc_0014E170_a8:
	mov	r0, r4
.Lfunc_0014E170_ac:
	pop	{r4, r5, r6}
.Lfunc_0014E170_b0:
	bx	lr
.size func_0014E170, .-func_0014E170
```
