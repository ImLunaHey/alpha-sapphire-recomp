# Probe-verified ARM runtime/helper batch 65

## Scope and provenance

This clean-room specification covers eleven currently unmatched ARM-state,
call-free helpers totaling 2,832 executable body bytes. Evidence was limited
to the current unmatched report, the neutral symbol inventory, bounded
private-target control/data-flow inspection, and independently assembled
exact-schedule probes. Candidate selection was restricted to the disjoint
address interval 0x00200000..0x003FFFFF and excludes all earlier configured
functions plus duplicate batch 65 and IPC batch 61 reservations.

The functions contain no calls, external branches, relocations, literal-pool
loads, PC-relative address calculations, adjacent data, opaque absolute
addresses, or private strings/assets. No selected body belongs to an
exact-duplicate family. Independent ARMv6K assembly comparison against target
revision `AS_EUR_REV2` on 2026-10-16 matched all eleven complete bodies
(2,832 bytes / 708 instructions).

## Semantic summary

- `func_0036F7B4` (316 bytes) advances a small interaction-state timer,
  selects one of three record pointers, compares two coordinate pairs, and
  sets a one-byte proximity flag using either radial or axis-aligned bounds.
- `func_003CD51C` (280 bytes) maps a signed cyclic coordinate into a
  bounded unsigned index. It validates a direction pair, applies parity-aware
  midpoint wrapping, reflects negative inputs, clamps the result, and
  optionally mirrors the final index.
- `func_002CD0C8` (272 bytes) bounds-checks and decodes a selected 16-byte
  record. It normalizes four words and two halfwords according to the
  descriptor's byte order, applies a configured base adjustment, and returns
  a success flag.
- `func_003F4C70` (268 bytes) searches fixed-width records for the first
  available entry in a caller-selected pair of byte-state lanes, returning
  the matching record pointer or null.
- `func_00398FC0` (264 bytes) installs one of three two-scalar parameter
  pairs into an indexed state record, updates its validity bit, and records
  the selected source and lane in a compact metadata table.
- `func_003990C8` (252 bytes) performs the parallel three-lane installation
  for a wider source layout, copying the selected scalar pair, updating the
  lane-validity bit, and recording source metadata.
- `func_002ED9F0` (252 bytes) classifies a single-bit format selector into
  an aligned payload size, advances a layout cursor, preserves the prior
  offset, and raises the stored alignment requirement when needed.
- `func_0021DF68` (236 bytes) validates a state record against mode flags
  and height thresholds. Accepted transitions increment a counter and return
  true; rejected modes and out-of-range thresholds return false.
- `func_00399260` (232 bytes) clears one of three cached scalar pairs,
  derives the corresponding source pointer from an indexed descriptor,
  updates the compact lane-state field, and records the selected pointer.
- `func_003A35D0` (232 bytes) copies a rectangular array while adapting
  each element between three-byte and four-byte layouts, with the conversion
  direction selected by a format identifier.
- `func_0037A194` (228 bytes) removes a matching record from a compact
  pointer array, clears the record's allocation bitmap bit, marks the record
  inactive, and reports whether validation and removal succeeded.

## Exact schedules

The following is the complete independently assembled artifact. Every
function has a zero-byte adjacent-data schedule. Local labels may be renamed
consistently. Preserve every mnemonic, operand, condition, memory mode,
instruction order, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0036F7B4,"ax",%progbits
.balign 4
.global func_0036F7B4
.type func_0036F7B4, %function
func_0036F7B4:
.Lfunc_0036F7B4_0:
	ldrb	r1, [r0, #85]
.Lfunc_0036F7B4_4:
	mov	r3, #0
.Lfunc_0036F7B4_8:
	strb	r3, [r0, #84]
.Lfunc_0036F7B4_c:
	cmp	r1, #0
.Lfunc_0036F7B4_10:
	beq	.Lfunc_0036F7B4_24
.Lfunc_0036F7B4_14:
	ldr	r1, [r0, #92]
.Lfunc_0036F7B4_18:
	subs	r1, r1, #1
.Lfunc_0036F7B4_1c:
	str	r1, [r0, #92]
.Lfunc_0036F7B4_20:
	strbeq	r3, [r0, #85]
.Lfunc_0036F7B4_24:
	ldrsb	ip, [r0, #28]
.Lfunc_0036F7B4_28:
	cmp	ip, #0
.Lfunc_0036F7B4_2c:
	ldreq	r1, [r0, #52]
.Lfunc_0036F7B4_30:
	beq	.Lfunc_0036F7B4_44
.Lfunc_0036F7B4_34:
	ldrb	r1, [r0, #29]
.Lfunc_0036F7B4_38:
	cmp	r1, #0
.Lfunc_0036F7B4_3c:
	ldreq	r1, [r0, #68]
.Lfunc_0036F7B4_40:
	ldrne	r1, [r0, #48]
.Lfunc_0036F7B4_44:
	ldrb	r1, [r1, #9]
.Lfunc_0036F7B4_48:
	cmp	r1, #0
.Lfunc_0036F7B4_4c:
	bxeq	lr
.Lfunc_0036F7B4_50:
	cmp	ip, #0
.Lfunc_0036F7B4_54:
	ldreq	r1, [r0, #52]
.Lfunc_0036F7B4_58:
	beq	.Lfunc_0036F7B4_6c
.Lfunc_0036F7B4_5c:
	ldrb	r1, [r0, #29]
.Lfunc_0036F7B4_60:
	cmp	r1, #0
.Lfunc_0036F7B4_64:
	ldreq	r1, [r0, #68]
.Lfunc_0036F7B4_68:
	ldrne	r1, [r0, #48]
.Lfunc_0036F7B4_6c:
	cmp	ip, #0
.Lfunc_0036F7B4_70:
	ldrh	r2, [r1]
.Lfunc_0036F7B4_74:
	ldreq	r1, [r0, #52]
.Lfunc_0036F7B4_78:
	beq	.Lfunc_0036F7B4_8c
.Lfunc_0036F7B4_7c:
	ldrb	r1, [r0, #29]
.Lfunc_0036F7B4_80:
	cmp	r1, #0
.Lfunc_0036F7B4_84:
	ldreq	r1, [r0, #68]
.Lfunc_0036F7B4_88:
	ldrne	r1, [r0, #48]
.Lfunc_0036F7B4_8c:
	push	{r4, r5, r6}
.Lfunc_0036F7B4_90:
	mov	ip, #1
.Lfunc_0036F7B4_94:
	ldrb	r4, [r0, #85]
.Lfunc_0036F7B4_98:
	ldrh	r1, [r1, #2]
.Lfunc_0036F7B4_9c:
	cmp	r4, #0
.Lfunc_0036F7B4_a0:
	beq	.Lfunc_0036F7B4_120
.Lfunc_0036F7B4_a4:
	ldrh	r5, [r0, #86]
.Lfunc_0036F7B4_a8:
	ldrh	r4, [r0, #88]
.Lfunc_0036F7B4_ac:
	ldrb	r6, [r0, #72]
.Lfunc_0036F7B4_b0:
	sub	r2, r2, r5
.Lfunc_0036F7B4_b4:
	sub	r4, r1, r4
.Lfunc_0036F7B4_b8:
	sxth	r1, r2
.Lfunc_0036F7B4_bc:
	sxth	r2, r4
.Lfunc_0036F7B4_c0:
	cmp	r6, #0
.Lfunc_0036F7B4_c4:
	beq	.Lfunc_0036F7B4_f0
.Lfunc_0036F7B4_c8:
	ldr	r4, [r0, #76]
.Lfunc_0036F7B4_cc:
	lsl	r2, r2, #1
.Lfunc_0036F7B4_d0:
	smlabb	r2, r1, r1, r2
.Lfunc_0036F7B4_d4:
	mul	r1, r4, r4
.Lfunc_0036F7B4_d8:
	cmp	r2, r1
.Lfunc_0036F7B4_dc:
	bhi	.Lfunc_0036F7B4_e8
.Lfunc_0036F7B4_e0:
	strb	ip, [r0, #84]
.Lfunc_0036F7B4_e4:
	strb	r3, [r0, #85]
.Lfunc_0036F7B4_e8:
	pop	{r4, r5, r6}
.Lfunc_0036F7B4_ec:
	bx	lr
.Lfunc_0036F7B4_f0:
	cmp	r1, #0
.Lfunc_0036F7B4_f4:
	rsblt	r1, r1, #0
.Lfunc_0036F7B4_f8:
	sxth	r4, r1
.Lfunc_0036F7B4_fc:
	ldr	r1, [r0, #76]
.Lfunc_0036F7B4_100:
	cmp	r4, r1
.Lfunc_0036F7B4_104:
	bhi	.Lfunc_0036F7B4_e8
.Lfunc_0036F7B4_108:
	cmp	r2, #0
.Lfunc_0036F7B4_10c:
	rsblt	r2, r2, #0
.Lfunc_0036F7B4_110:
	sxth	r2, r2
.Lfunc_0036F7B4_114:
	cmp	r2, r1
.Lfunc_0036F7B4_118:
	bhi	.Lfunc_0036F7B4_e8
.Lfunc_0036F7B4_11c:
	b	.Lfunc_0036F7B4_e0
.Lfunc_0036F7B4_120:
	ldr	r3, [r0, #80]
.Lfunc_0036F7B4_124:
	strh	r2, [r0, #86]
.Lfunc_0036F7B4_128:
	strh	r1, [r0, #88]
.Lfunc_0036F7B4_12c:
	strb	ip, [r0, #85]
.Lfunc_0036F7B4_130:
	str	r3, [r0, #92]
.Lfunc_0036F7B4_134:
	pop	{r4, r5, r6}
.Lfunc_0036F7B4_138:
	bx	lr
.size func_0036F7B4, .-func_0036F7B4

.section .text.func_003CD51C,"ax",%progbits
.balign 4
.global func_003CD51C
.type func_003CD51C, %function
func_003CD51C:
.Lfunc_003CD51C_0:
	cmp	r1, #0
.Lfunc_003CD51C_4:
	moveq	r0, #0
.Lfunc_003CD51C_8:
	bxeq	lr
.Lfunc_003CD51C_c:
	push	{r4}
.Lfunc_003CD51C_10:
	mov	r4, #0
.Lfunc_003CD51C_14:
	ldr	ip, [sp, #12]
.Lfunc_003CD51C_18:
	cmp	ip, #0
.Lfunc_003CD51C_1c:
	bge	.Lfunc_003CD51C_2c
.Lfunc_003CD51C_20:
	rsb	ip, ip, #0
.Lfunc_003CD51C_24:
	mov	r4, #1
.Lfunc_003CD51C_28:
	sxth	ip, ip
.Lfunc_003CD51C_2c:
	cmp	r2, #0
.Lfunc_003CD51C_30:
	beq	.Lfunc_003CD51C_50
.Lfunc_003CD51C_34:
	cmp	r2, #1
.Lfunc_003CD51C_38:
	beq	.Lfunc_003CD51C_5c
.Lfunc_003CD51C_3c:
	cmp	r2, #3
.Lfunc_003CD51C_40:
	beq	.Lfunc_003CD51C_68
.Lfunc_003CD51C_44:
	cmp	r2, #2
.Lfunc_003CD51C_48:
	beq	.Lfunc_003CD51C_74
.Lfunc_003CD51C_4c:
	b	.Lfunc_003CD51C_7c
.Lfunc_003CD51C_50:
	cmp	r3, #3
.Lfunc_003CD51C_54:
	beq	.Lfunc_003CD51C_84
.Lfunc_003CD51C_58:
	b	.Lfunc_003CD51C_7c
.Lfunc_003CD51C_5c:
	cmp	r3, #2
.Lfunc_003CD51C_60:
	beq	.Lfunc_003CD51C_84
.Lfunc_003CD51C_64:
	b	.Lfunc_003CD51C_7c
.Lfunc_003CD51C_68:
	cmp	r3, #0
.Lfunc_003CD51C_6c:
	beq	.Lfunc_003CD51C_84
.Lfunc_003CD51C_70:
	b	.Lfunc_003CD51C_7c
.Lfunc_003CD51C_74:
	cmp	r3, #1
.Lfunc_003CD51C_78:
	beq	.Lfunc_003CD51C_84
.Lfunc_003CD51C_7c:
	cmp	r2, r3
.Lfunc_003CD51C_80:
	bne	.Lfunc_003CD51C_90
.Lfunc_003CD51C_84:
	sub	r0, r1, r0
.Lfunc_003CD51C_88:
	sub	r0, r0, #1
.Lfunc_003CD51C_8c:
	uxth	r0, r0
.Lfunc_003CD51C_90:
	subs	r3, ip, r1
.Lfunc_003CD51C_94:
	lsr	r2, r1, #1
.Lfunc_003CD51C_98:
	add	r1, ip, ip, lsr #31
.Lfunc_003CD51C_9c:
	asr	r1, r1, #1
.Lfunc_003CD51C_a0:
	beq	.Lfunc_003CD51C_ec
.Lfunc_003CD51C_a4:
	tst	r3, #1
.Lfunc_003CD51C_a8:
	beq	.Lfunc_003CD51C_e4
.Lfunc_003CD51C_ac:
	tst	ip, #1
.Lfunc_003CD51C_b0:
	beq	.Lfunc_003CD51C_cc
.Lfunc_003CD51C_b4:
	cmp	r2, r0
.Lfunc_003CD51C_b8:
	bls	.Lfunc_003CD51C_e4
.Lfunc_003CD51C_bc:
	sub	r0, r0, r2
.Lfunc_003CD51C_c0:
	add	r0, r0, r1
.Lfunc_003CD51C_c4:
	add	r0, r0, #1
.Lfunc_003CD51C_c8:
	b	.Lfunc_003CD51C_ec
.Lfunc_003CD51C_cc:
	cmp	r0, r2
.Lfunc_003CD51C_d0:
	bhi	.Lfunc_003CD51C_e4
.Lfunc_003CD51C_d4:
	sub	r0, r0, r2
.Lfunc_003CD51C_d8:
	add	r0, r0, r1
.Lfunc_003CD51C_dc:
	sub	r0, r0, #1
.Lfunc_003CD51C_e0:
	b	.Lfunc_003CD51C_ec
.Lfunc_003CD51C_e4:
	sub	r0, r0, r2
.Lfunc_003CD51C_e8:
	add	r0, r0, r1
.Lfunc_003CD51C_ec:
	cmp	r0, #0
.Lfunc_003CD51C_f0:
	movlt	r0, #0
.Lfunc_003CD51C_f4:
	blt	.Lfunc_003CD51C_100
.Lfunc_003CD51C_f8:
	cmp	ip, r0
.Lfunc_003CD51C_fc:
	suble	r0, ip, #1
.Lfunc_003CD51C_100:
	cmp	r4, #0
.Lfunc_003CD51C_104:
	subne	r0, ip, r0
.Lfunc_003CD51C_108:
	subne	r0, r0, #1
.Lfunc_003CD51C_10c:
	pop	{r4}
.Lfunc_003CD51C_110:
	uxth	r0, r0
.Lfunc_003CD51C_114:
	bx	lr
.size func_003CD51C, .-func_003CD51C

.section .text.func_002CD0C8,"ax",%progbits
.balign 4
.global func_002CD0C8
.type func_002CD0C8, %function
func_002CD0C8:
.Lfunc_002CD0C8_0:
	push	{r4}
.Lfunc_002CD0C8_4:
	ldr	r3, [r1, #8]
.Lfunc_002CD0C8_8:
	lsl	r2, r2, #4
.Lfunc_002CD0C8_c:
	add	ip, r2, #16
.Lfunc_002CD0C8_10:
	cmp	r3, ip
.Lfunc_002CD0C8_14:
	bcc	.Lfunc_002CD0C8_104
.Lfunc_002CD0C8_18:
	ldr	ip, [r1, #16]
.Lfunc_002CD0C8_1c:
	ldr	r3, [r1, #4]
.Lfunc_002CD0C8_20:
	add	r2, r2, ip
.Lfunc_002CD0C8_24:
	add	ip, r2, #16
.Lfunc_002CD0C8_28:
	cmp	r3, ip
.Lfunc_002CD0C8_2c:
	bcc	.Lfunc_002CD0C8_104
.Lfunc_002CD0C8_30:
	ldr	ip, [r1]
.Lfunc_002CD0C8_34:
	ldrsb	r3, [r1, #32]
.Lfunc_002CD0C8_38:
	add	r2, r2, ip
.Lfunc_002CD0C8_3c:
	cmp	r3, #0
.Lfunc_002CD0C8_40:
	ldr	ip, [r2]
.Lfunc_002CD0C8_44:
	ldrb	r4, [r2, #3]
.Lfunc_002CD0C8_48:
	bicne	ip, ip, #-16777216
.Lfunc_002CD0C8_4c:
	orrne	ip, ip, r4, lsl #24
.Lfunc_002CD0C8_50:
	reveq	ip, ip
.Lfunc_002CD0C8_54:
	biceq	ip, ip, #255
.Lfunc_002CD0C8_58:
	orreq	ip, ip, r4
.Lfunc_002CD0C8_5c:
	str	ip, [r0]
.Lfunc_002CD0C8_60:
	beq	.Lfunc_002CD0C8_78
.Lfunc_002CD0C8_64:
	ldr	ip, [r2, #4]
.Lfunc_002CD0C8_68:
	ldrb	r4, [r2, #7]
.Lfunc_002CD0C8_6c:
	bic	ip, ip, #-16777216
.Lfunc_002CD0C8_70:
	orr	ip, ip, r4, lsl #24
.Lfunc_002CD0C8_74:
	b	.Lfunc_002CD0C8_8c
.Lfunc_002CD0C8_78:
	ldr	r4, [r2, #4]
.Lfunc_002CD0C8_7c:
	ldrb	ip, [r2, #7]
.Lfunc_002CD0C8_80:
	rev	r4, r4
.Lfunc_002CD0C8_84:
	bic	r4, r4, #255
.Lfunc_002CD0C8_88:
	orr	ip, ip, r4
.Lfunc_002CD0C8_8c:
	str	ip, [r0, #4]
.Lfunc_002CD0C8_90:
	beq	.Lfunc_002CD0C8_a8
.Lfunc_002CD0C8_94:
	ldr	ip, [r2, #8]
.Lfunc_002CD0C8_98:
	ldrb	r4, [r2, #11]
.Lfunc_002CD0C8_9c:
	bic	ip, ip, #-16777216
.Lfunc_002CD0C8_a0:
	orr	ip, ip, r4, lsl #24
.Lfunc_002CD0C8_a4:
	b	.Lfunc_002CD0C8_bc
.Lfunc_002CD0C8_a8:
	ldr	r4, [r2, #8]
.Lfunc_002CD0C8_ac:
	ldrb	ip, [r2, #11]
.Lfunc_002CD0C8_b0:
	rev	r4, r4
.Lfunc_002CD0C8_b4:
	bic	r4, r4, #255
.Lfunc_002CD0C8_b8:
	orr	ip, ip, r4
.Lfunc_002CD0C8_bc:
	cmp	ip, #0
.Lfunc_002CD0C8_c0:
	str	ip, [r0, #8]
.Lfunc_002CD0C8_c4:
	beq	.Lfunc_002CD0C8_d4
.Lfunc_002CD0C8_c8:
	ldr	r4, [r1, #28]
.Lfunc_002CD0C8_cc:
	add	ip, ip, r4
.Lfunc_002CD0C8_d0:
	str	ip, [r0, #8]
.Lfunc_002CD0C8_d4:
	cmp	r3, #0
.Lfunc_002CD0C8_d8:
	ldrh	r3, [r2, #12]
.Lfunc_002CD0C8_dc:
	rev16eq	r3, r3
.Lfunc_002CD0C8_e0:
	strh	r3, [r0, #12]
.Lfunc_002CD0C8_e4:
	ldrh	r2, [r2, #14]
.Lfunc_002CD0C8_e8:
	rev16eq	r2, r2
.Lfunc_002CD0C8_ec:
	strh	r2, [r0, #14]
.Lfunc_002CD0C8_f0:
	ldr	r1, [r1]
.Lfunc_002CD0C8_f4:
	str	r1, [r0, #16]
.Lfunc_002CD0C8_f8:
	pop	{r4}
.Lfunc_002CD0C8_fc:
	mov	r0, #1
.Lfunc_002CD0C8_100:
	bx	lr
.Lfunc_002CD0C8_104:
	pop	{r4}
.Lfunc_002CD0C8_108:
	mov	r0, #0
.Lfunc_002CD0C8_10c:
	bx	lr
.size func_002CD0C8, .-func_002CD0C8

.section .text.func_003F4C70,"ax",%progbits
.balign 4
.global func_003F4C70
.type func_003F4C70, %function
func_003F4C70:
.Lfunc_003F4C70_0:
	push	{r4, r5, r6, r7}
.Lfunc_003F4C70_4:
	ldr	r3, [r0, #12]
.Lfunc_003F4C70_8:
	cmp	r3, #0
.Lfunc_003F4C70_c:
	beq	.Lfunc_003F4C70_e8
.Lfunc_003F4C70_10:
	and	r1, r3, #1
.Lfunc_003F4C70_14:
	cmp	r1, #0
.Lfunc_003F4C70_18:
	ldrhi	r5, [r0, #8]
.Lfunc_003F4C70_1c:
	mov	ip, #20
.Lfunc_003F4C70_20:
	mov	r4, #28
.Lfunc_003F4C70_24:
	mov	r2, #0
.Lfunc_003F4C70_28:
	bls	.Lfunc_003F4C70_5c
.Lfunc_003F4C70_2c:
	add	r6, r2, r2, lsl #2
.Lfunc_003F4C70_30:
	add	r7, ip, r6, lsl #3
.Lfunc_003F4C70_34:
	ldrb	r7, [r5, r7]
.Lfunc_003F4C70_38:
	cmp	r7, #0
.Lfunc_003F4C70_3c:
	bne	.Lfunc_003F4C70_50
.Lfunc_003F4C70_40:
	add	r6, r4, r6, lsl #3
.Lfunc_003F4C70_44:
	ldrb	r6, [r5, r6]
.Lfunc_003F4C70_48:
	cmp	r6, #0
.Lfunc_003F4C70_4c:
	beq	.Lfunc_003F4C70_88
.Lfunc_003F4C70_50:
	add	r2, r2, #1
.Lfunc_003F4C70_54:
	cmp	r2, r1
.Lfunc_003F4C70_58:
	bcc	.Lfunc_003F4C70_2c
.Lfunc_003F4C70_5c:
	cmp	r1, r3
.Lfunc_003F4C70_60:
	bcs	.Lfunc_003F4C70_e8
.Lfunc_003F4C70_64:
	ldr	r0, [r0, #8]
.Lfunc_003F4C70_68:
	mov	r2, #60
.Lfunc_003F4C70_6c:
	mov	r7, #68
.Lfunc_003F4C70_70:
	add	r5, r1, r1, lsl #2
.Lfunc_003F4C70_74:
	add	r6, ip, r5, lsl #3
.Lfunc_003F4C70_78:
	ldrb	r6, [r0, r6]
.Lfunc_003F4C70_7c:
	cmp	r6, #0
.Lfunc_003F4C70_80:
	bne	.Lfunc_003F4C70_a8
.Lfunc_003F4C70_84:
	b	.Lfunc_003F4C70_98
.Lfunc_003F4C70_88:
	add	r0, r2, r2, lsl #2
.Lfunc_003F4C70_8c:
	add	r0, r5, r0, lsl #3
.Lfunc_003F4C70_90:
	pop	{r4, r5, r6, r7}
.Lfunc_003F4C70_94:
	bx	lr
.Lfunc_003F4C70_98:
	add	r6, r4, r5, lsl #3
.Lfunc_003F4C70_9c:
	ldrb	r6, [r0, r6]
.Lfunc_003F4C70_a0:
	cmp	r6, #0
.Lfunc_003F4C70_a4:
	beq	.Lfunc_003F4C70_bc
.Lfunc_003F4C70_a8:
	add	r6, r2, r5, lsl #3
.Lfunc_003F4C70_ac:
	ldrb	r6, [r0, r6]
.Lfunc_003F4C70_b0:
	cmp	r6, #0
.Lfunc_003F4C70_b4:
	bne	.Lfunc_003F4C70_dc
.Lfunc_003F4C70_b8:
	b	.Lfunc_003F4C70_cc
.Lfunc_003F4C70_bc:
	add	r1, r1, r1, lsl #2
.Lfunc_003F4C70_c0:
	pop	{r4, r5, r6, r7}
.Lfunc_003F4C70_c4:
	add	r0, r0, r1, lsl #3
.Lfunc_003F4C70_c8:
	bx	lr
.Lfunc_003F4C70_cc:
	add	r5, r7, r5, lsl #3
.Lfunc_003F4C70_d0:
	ldrb	r5, [r0, r5]
.Lfunc_003F4C70_d4:
	cmp	r5, #0
.Lfunc_003F4C70_d8:
	beq	.Lfunc_003F4C70_f4
.Lfunc_003F4C70_dc:
	add	r1, r1, #2
.Lfunc_003F4C70_e0:
	cmp	r3, r1
.Lfunc_003F4C70_e4:
	bhi	.Lfunc_003F4C70_70
.Lfunc_003F4C70_e8:
	pop	{r4, r5, r6, r7}
.Lfunc_003F4C70_ec:
	mov	r0, #0
.Lfunc_003F4C70_f0:
	bx	lr
.Lfunc_003F4C70_f4:
	add	r1, r1, r1, lsl #2
.Lfunc_003F4C70_f8:
	mov	r2, #40
.Lfunc_003F4C70_fc:
	add	r1, r2, r1, lsl #3
.Lfunc_003F4C70_100:
	pop	{r4, r5, r6, r7}
.Lfunc_003F4C70_104:
	add	r0, r0, r1
.Lfunc_003F4C70_108:
	bx	lr
.size func_003F4C70, .-func_003F4C70

.section .text.func_00398FC0,"ax",%progbits
.balign 4
.global func_00398FC0
.type func_00398FC0, %function
func_00398FC0:
.Lfunc_00398FC0_0:
	push	{r4, r5, r6}
.Lfunc_00398FC0_4:
	add	r4, r1, r1, lsl #4
.Lfunc_00398FC0_8:
	ldr	ip, [r0, #48]
.Lfunc_00398FC0_c:
	add	r4, r4, r4, lsl #2
.Lfunc_00398FC0_10:
	cmp	r2, #0
.Lfunc_00398FC0_14:
	add	ip, ip, r4, lsl #2
.Lfunc_00398FC0_18:
	beq	.Lfunc_00398FC0_30
.Lfunc_00398FC0_1c:
	cmp	r2, #1
.Lfunc_00398FC0_20:
	beq	.Lfunc_00398FC0_98
.Lfunc_00398FC0_24:
	cmp	r2, #2
.Lfunc_00398FC0_28:
	bne	.Lfunc_00398FC0_64
.Lfunc_00398FC0_2c:
	b	.Lfunc_00398FC0_d0
.Lfunc_00398FC0_30:
	ldr	r4, [r3, #12]
.Lfunc_00398FC0_34:
	add	r6, ip, #316
.Lfunc_00398FC0_38:
	ldrb	r5, [r4, #24]
.Lfunc_00398FC0_3c:
	vldmia	r4, {s0-s1}
.Lfunc_00398FC0_40:
	cmp	r5, #12
.Lfunc_00398FC0_44:
	movne	r5, #0
.Lfunc_00398FC0_48:
	moveq	r5, #1
.Lfunc_00398FC0_4c:
	vstmia	r6, {s0-s1}
.Lfunc_00398FC0_50:
	cmp	r5, #0
.Lfunc_00398FC0_54:
	ldrb	r4, [ip, #2]
.Lfunc_00398FC0_58:
	orrne	r4, r4, #1
.Lfunc_00398FC0_5c:
	biceq	r4, r4, #1
.Lfunc_00398FC0_60:
	strb	r4, [ip, #2]
.Lfunc_00398FC0_64:
	ldr	r0, [r0, #128]
.Lfunc_00398FC0_68:
	lsl	ip, r2, #3
.Lfunc_00398FC0_6c:
	mov	r5, #255
.Lfunc_00398FC0_70:
	ldr	r1, [r0, r1, lsl #4]!
.Lfunc_00398FC0_74:
	lsl	r5, r5, ip
.Lfunc_00398FC0_78:
	mov	r4, #2
.Lfunc_00398FC0_7c:
	bic	r1, r1, r5
.Lfunc_00398FC0_80:
	orr	r1, r1, r4, lsl ip
.Lfunc_00398FC0_84:
	add	r2, r0, r2, lsl #2
.Lfunc_00398FC0_88:
	str	r1, [r0]
.Lfunc_00398FC0_8c:
	str	r3, [r2, #4]
.Lfunc_00398FC0_90:
	pop	{r4, r5, r6}
.Lfunc_00398FC0_94:
	bx	lr
.Lfunc_00398FC0_98:
	ldr	r4, [r3, #12]
.Lfunc_00398FC0_9c:
	add	r5, r4, #8
.Lfunc_00398FC0_a0:
	ldrb	r6, [r4, #24]
.Lfunc_00398FC0_a4:
	vldmia	r5, {s0-s1}
.Lfunc_00398FC0_a8:
	cmp	r6, #12
.Lfunc_00398FC0_ac:
	add	r6, ip, #324
.Lfunc_00398FC0_b0:
	movne	r4, #0
.Lfunc_00398FC0_b4:
	moveq	r4, #1
.Lfunc_00398FC0_b8:
	vstmia	r6, {s0-s1}
.Lfunc_00398FC0_bc:
	cmp	r4, #0
.Lfunc_00398FC0_c0:
	ldrb	r4, [ip, #2]
.Lfunc_00398FC0_c4:
	orrne	r4, r4, #2
.Lfunc_00398FC0_c8:
	biceq	r4, r4, #2
.Lfunc_00398FC0_cc:
	b	.Lfunc_00398FC0_60
.Lfunc_00398FC0_d0:
	ldr	r4, [r3, #12]
.Lfunc_00398FC0_d4:
	add	r5, r4, #16
.Lfunc_00398FC0_d8:
	ldrb	r6, [r4, #24]
.Lfunc_00398FC0_dc:
	vldmia	r5, {s0-s1}
.Lfunc_00398FC0_e0:
	cmp	r6, #12
.Lfunc_00398FC0_e4:
	add	r6, ip, #332
.Lfunc_00398FC0_e8:
	movne	r4, #0
.Lfunc_00398FC0_ec:
	moveq	r4, #1
.Lfunc_00398FC0_f0:
	vstmia	r6, {s0-s1}
.Lfunc_00398FC0_f4:
	cmp	r4, #0
.Lfunc_00398FC0_f8:
	ldrb	r4, [ip, #2]
.Lfunc_00398FC0_fc:
	orrne	r4, r4, #4
.Lfunc_00398FC0_100:
	biceq	r4, r4, #4
.Lfunc_00398FC0_104:
	b	.Lfunc_00398FC0_60
.size func_00398FC0, .-func_00398FC0

.section .text.func_003990C8,"ax",%progbits
.balign 4
.global func_003990C8
.type func_003990C8, %function
func_003990C8:
.Lfunc_003990C8_0:
	push	{r4, r5}
.Lfunc_003990C8_4:
	add	r4, r1, r1, lsl #4
.Lfunc_003990C8_8:
	ldr	ip, [r0, #48]
.Lfunc_003990C8_c:
	add	r4, r4, r4, lsl #2
.Lfunc_003990C8_10:
	cmp	r2, #0
.Lfunc_003990C8_14:
	add	ip, ip, r4, lsl #2
.Lfunc_003990C8_18:
	beq	.Lfunc_003990C8_30
.Lfunc_003990C8_1c:
	cmp	r2, #1
.Lfunc_003990C8_20:
	beq	.Lfunc_003990C8_94
.Lfunc_003990C8_24:
	cmp	r2, #2
.Lfunc_003990C8_28:
	bne	.Lfunc_003990C8_64
.Lfunc_003990C8_2c:
	b	.Lfunc_003990C8_c8
.Lfunc_003990C8_30:
	ldrb	r4, [r3, #12]
.Lfunc_003990C8_34:
	add	r5, r3, #24
.Lfunc_003990C8_38:
	vldmia	r5, {s0-s1}
.Lfunc_003990C8_3c:
	cmp	r4, #12
.Lfunc_003990C8_40:
	movne	r4, #0
.Lfunc_003990C8_44:
	moveq	r4, #1
.Lfunc_003990C8_48:
	vstr	s0, [ip, #316]
.Lfunc_003990C8_4c:
	cmp	r4, #0
.Lfunc_003990C8_50:
	vstr	s1, [ip, #320]
.Lfunc_003990C8_54:
	ldrb	r4, [ip, #2]
.Lfunc_003990C8_58:
	orrne	r4, r4, #1
.Lfunc_003990C8_5c:
	biceq	r4, r4, #1
.Lfunc_003990C8_60:
	strb	r4, [ip, #2]
.Lfunc_003990C8_64:
	ldr	r0, [r0, #128]
.Lfunc_003990C8_68:
	lsl	r4, r2, #3
.Lfunc_003990C8_6c:
	mov	r5, #255
.Lfunc_003990C8_70:
	ldr	r1, [r0, r1, lsl #4]!
.Lfunc_003990C8_74:
	mov	ip, #3
.Lfunc_003990C8_78:
	bic	r1, r1, r5, lsl r4
.Lfunc_003990C8_7c:
	orr	r1, r1, ip, lsl r4
.Lfunc_003990C8_80:
	add	r2, r0, r2, lsl #2
.Lfunc_003990C8_84:
	str	r1, [r0]
.Lfunc_003990C8_88:
	str	r3, [r2, #4]
.Lfunc_003990C8_8c:
	pop	{r4, r5}
.Lfunc_003990C8_90:
	bx	lr
.Lfunc_003990C8_94:
	ldrb	r4, [r3, #12]
.Lfunc_003990C8_98:
	add	r5, r3, #40
.Lfunc_003990C8_9c:
	vldmia	r5, {s0-s1}
.Lfunc_003990C8_a0:
	cmp	r4, #12
.Lfunc_003990C8_a4:
	movne	r4, #0
.Lfunc_003990C8_a8:
	moveq	r4, #1
.Lfunc_003990C8_ac:
	vstr	s0, [ip, #324]
.Lfunc_003990C8_b0:
	cmp	r4, #0
.Lfunc_003990C8_b4:
	vstr	s1, [ip, #328]
.Lfunc_003990C8_b8:
	ldrb	r4, [ip, #2]
.Lfunc_003990C8_bc:
	orrne	r4, r4, #2
.Lfunc_003990C8_c0:
	biceq	r4, r4, #2
.Lfunc_003990C8_c4:
	b	.Lfunc_003990C8_60
.Lfunc_003990C8_c8:
	ldrb	r4, [r3, #12]
.Lfunc_003990C8_cc:
	add	r5, r3, #56
.Lfunc_003990C8_d0:
	vldmia	r5, {s0-s1}
.Lfunc_003990C8_d4:
	cmp	r4, #12
.Lfunc_003990C8_d8:
	movne	r4, #0
.Lfunc_003990C8_dc:
	moveq	r4, #1
.Lfunc_003990C8_e0:
	vstr	s0, [ip, #332]
.Lfunc_003990C8_e4:
	cmp	r4, #0
.Lfunc_003990C8_e8:
	vstr	s1, [ip, #336]
.Lfunc_003990C8_ec:
	ldrb	r4, [ip, #2]
.Lfunc_003990C8_f0:
	orrne	r4, r4, #4
.Lfunc_003990C8_f4:
	biceq	r4, r4, #4
.Lfunc_003990C8_f8:
	b	.Lfunc_003990C8_60
.size func_003990C8, .-func_003990C8

.section .text.func_002ED9F0,"ax",%progbits
.balign 4
.global func_002ED9F0
.type func_002ED9F0, %function
func_002ED9F0:
.Lfunc_002ED9F0_0:
	ldr	r1, [r1]
.Lfunc_002ED9F0_4:
	ldr	r2, [r1]
.Lfunc_002ED9F0_8:
	mov	r1, #0
.Lfunc_002ED9F0_c:
	cmp	r2, #16777216
.Lfunc_002ED9F0_10:
	beq	.Lfunc_002ED9F0_b4
.Lfunc_002ED9F0_14:
	bgt	.Lfunc_002ED9F0_64
.Lfunc_002ED9F0_18:
	cmp	r2, #1048576
.Lfunc_002ED9F0_1c:
	moveq	r1, #36
.Lfunc_002ED9F0_20:
	beq	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_24:
	bgt	.Lfunc_002ED9F0_48
.Lfunc_002ED9F0_28:
	cmp	r2, #-2147483648
.Lfunc_002ED9F0_2c:
	beq	.Lfunc_002ED9F0_a4
.Lfunc_002ED9F0_30:
	cmp	r2, #0
.Lfunc_002ED9F0_34:
	moveq	r1, #12
.Lfunc_002ED9F0_38:
	beq	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_3c:
	cmp	r2, #524288
.Lfunc_002ED9F0_40:
	beq	.Lfunc_002ED9F0_ac
.Lfunc_002ED9F0_44:
	b	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_48:
	cmp	r2, #2097152
.Lfunc_002ED9F0_4c:
	beq	.Lfunc_002ED9F0_a4
.Lfunc_002ED9F0_50:
	cmp	r2, #4194304
.Lfunc_002ED9F0_54:
	beq	.Lfunc_002ED9F0_b4
.Lfunc_002ED9F0_58:
	cmp	r2, #8388608
.Lfunc_002ED9F0_5c:
	bne	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_60:
	b	.Lfunc_002ED9F0_ac
.Lfunc_002ED9F0_64:
	cmp	r2, #268435456
.Lfunc_002ED9F0_68:
	beq	.Lfunc_002ED9F0_ac
.Lfunc_002ED9F0_6c:
	bgt	.Lfunc_002ED9F0_90
.Lfunc_002ED9F0_70:
	cmp	r2, #33554432
.Lfunc_002ED9F0_74:
	beq	.Lfunc_002ED9F0_b4
.Lfunc_002ED9F0_78:
	cmp	r2, #67108864
.Lfunc_002ED9F0_7c:
	moveq	r1, #24
.Lfunc_002ED9F0_80:
	beq	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_84:
	cmp	r2, #134217728
.Lfunc_002ED9F0_88:
	beq	.Lfunc_002ED9F0_ac
.Lfunc_002ED9F0_8c:
	b	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_90:
	cmp	r2, #536870912
.Lfunc_002ED9F0_94:
	beq	.Lfunc_002ED9F0_ac
.Lfunc_002ED9F0_98:
	cmp	r2, #1073741824
.Lfunc_002ED9F0_9c:
	moveq	r1, #32
.Lfunc_002ED9F0_a0:
	b	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_a4:
	mov	r1, #28
.Lfunc_002ED9F0_a8:
	b	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_ac:
	mov	r1, #16
.Lfunc_002ED9F0_b0:
	b	.Lfunc_002ED9F0_b8
.Lfunc_002ED9F0_b4:
	mov	r1, #20
.Lfunc_002ED9F0_b8:
	ldr	r2, [r0, #4]
.Lfunc_002ED9F0_bc:
	mov	r3, #4
.Lfunc_002ED9F0_c0:
	str	r3, [r0, #4]
.Lfunc_002ED9F0_c4:
	ldr	ip, [r0, #8]
.Lfunc_002ED9F0_c8:
	cmp	ip, #4
.Lfunc_002ED9F0_cc:
	movcs	r3, ip
.Lfunc_002ED9F0_d0:
	str	r3, [r0, #8]
.Lfunc_002ED9F0_d4:
	ldr	r3, [r0]
.Lfunc_002ED9F0_d8:
	add	r3, r3, #3
.Lfunc_002ED9F0_dc:
	bic	r3, r3, #3
.Lfunc_002ED9F0_e0:
	add	r1, r1, r3
.Lfunc_002ED9F0_e4:
	stm	r0, {r1, r2}
.Lfunc_002ED9F0_e8:
	ldr	r1, [r0, #8]
.Lfunc_002ED9F0_ec:
	cmp	r1, r2
.Lfunc_002ED9F0_f0:
	movcc	r1, r2
.Lfunc_002ED9F0_f4:
	str	r1, [r0, #8]
.Lfunc_002ED9F0_f8:
	bx	lr
.size func_002ED9F0, .-func_002ED9F0

.section .text.func_0021DF68,"ax",%progbits
.balign 4
.global func_0021DF68
.type func_0021DF68, %function
func_0021DF68:
.Lfunc_0021DF68_0:
	ldrh	r2, [r1, #60]
.Lfunc_0021DF68_4:
	and	r3, r2, #15
.Lfunc_0021DF68_8:
	cmp	r3, #2
.Lfunc_0021DF68_c:
	tsteq	r2, #32
.Lfunc_0021DF68_10:
	bne	.Lfunc_0021DF68_e4
.Lfunc_0021DF68_14:
	tst	r2, #16
.Lfunc_0021DF68_18:
	beq	.Lfunc_0021DF68_64
.Lfunc_0021DF68_1c:
	mov	r2, #260
.Lfunc_0021DF68_20:
	ldrb	r3, [r1, #132]
.Lfunc_0021DF68_24:
	ldrh	r2, [r2, r0]
.Lfunc_0021DF68_28:
	cmp	r3, r2
.Lfunc_0021DF68_2c:
	bhi	.Lfunc_0021DF68_e4
.Lfunc_0021DF68_30:
	ldr	r0, [r0, #156]
.Lfunc_0021DF68_34:
	ldrh	r2, [r1, #68]
.Lfunc_0021DF68_38:
	and	r1, r3, #255
.Lfunc_0021DF68_3c:
	ldr	r0, [r0, r1, lsl #2]
.Lfunc_0021DF68_40:
	ldrh	r0, [r0, #56]
.Lfunc_0021DF68_44:
	sub	r0, r0, r2
.Lfunc_0021DF68_48:
	sxth	r0, r0
.Lfunc_0021DF68_4c:
	cmp	r0, #0
.Lfunc_0021DF68_50:
	movgt	r0, #1
.Lfunc_0021DF68_54:
	movle	r0, #0
.Lfunc_0021DF68_58:
	cmp	r0, #0
.Lfunc_0021DF68_5c:
	movne	r0, #1
.Lfunc_0021DF68_60:
	bx	lr
.Lfunc_0021DF68_64:
	tst	r2, #8192
.Lfunc_0021DF68_68:
	bne	.Lfunc_0021DF68_e4
.Lfunc_0021DF68_6c:
	tst	r2, #1536
.Lfunc_0021DF68_70:
	beq	.Lfunc_0021DF68_ac
.Lfunc_0021DF68_74:
	ldrb	r2, [r0, #331]
.Lfunc_0021DF68_78:
	cmp	r2, #0
.Lfunc_0021DF68_7c:
	beq	.Lfunc_0021DF68_e4
.Lfunc_0021DF68_80:
	ldrh	r2, [r1, #68]
.Lfunc_0021DF68_84:
	mov	r1, #256
.Lfunc_0021DF68_88:
	ldrh	r1, [r1, r0]
.Lfunc_0021DF68_8c:
	sub	r1, r1, r2
.Lfunc_0021DF68_90:
	sxth	r1, r1
.Lfunc_0021DF68_94:
	cmp	r1, #0
.Lfunc_0021DF68_98:
	movle	r1, #0
.Lfunc_0021DF68_9c:
	movgt	r1, #1
.Lfunc_0021DF68_a0:
	cmp	r1, #0
.Lfunc_0021DF68_a4:
	bne	.Lfunc_0021DF68_d0
.Lfunc_0021DF68_a8:
	b	.Lfunc_0021DF68_e4
.Lfunc_0021DF68_ac:
	ldrh	r1, [r1, #68]
.Lfunc_0021DF68_b0:
	ldrh	r2, [r0, #244]
.Lfunc_0021DF68_b4:
	sub	r1, r2, r1
.Lfunc_0021DF68_b8:
	sxth	r1, r1
.Lfunc_0021DF68_bc:
	cmp	r1, #0
.Lfunc_0021DF68_c0:
	movgt	r1, #1
.Lfunc_0021DF68_c4:
	movle	r1, #0
.Lfunc_0021DF68_c8:
	cmp	r1, #0
.Lfunc_0021DF68_cc:
	beq	.Lfunc_0021DF68_e4
.Lfunc_0021DF68_d0:
	ldr	r1, [r0, #764]
.Lfunc_0021DF68_d4:
	add	r1, r1, #1
.Lfunc_0021DF68_d8:
	str	r1, [r0, #764]
.Lfunc_0021DF68_dc:
	mov	r0, #1
.Lfunc_0021DF68_e0:
	bx	lr
.Lfunc_0021DF68_e4:
	mov	r0, #0
.Lfunc_0021DF68_e8:
	bx	lr
.size func_0021DF68, .-func_0021DF68

.section .text.func_00399260,"ax",%progbits
.balign 4
.global func_00399260
.type func_00399260, %function
func_00399260:
.Lfunc_00399260_0:
	push	{r4, r5}
.Lfunc_00399260_4:
	add	r4, r1, r1, lsl #4
.Lfunc_00399260_8:
	ldr	r3, [r0, #48]
.Lfunc_00399260_c:
	add	r4, r4, r4, lsl #2
.Lfunc_00399260_10:
	cmp	r2, #0
.Lfunc_00399260_14:
	sub	sp, sp, #12
.Lfunc_00399260_18:
	mov	ip, #0
.Lfunc_00399260_1c:
	add	r3, r3, r4, lsl #2
.Lfunc_00399260_20:
	beq	.Lfunc_00399260_38
.Lfunc_00399260_24:
	cmp	r2, #1
.Lfunc_00399260_28:
	beq	.Lfunc_00399260_c0
.Lfunc_00399260_2c:
	cmp	r2, #2
.Lfunc_00399260_30:
	bne	.Lfunc_00399260_4c
.Lfunc_00399260_34:
	b	.Lfunc_00399260_d4
.Lfunc_00399260_38:
	str	ip, [r3, #316]
.Lfunc_00399260_3c:
	str	ip, [r3, #320]
.Lfunc_00399260_40:
	ldrb	ip, [r3, #2]
.Lfunc_00399260_44:
	bic	ip, ip, #1
.Lfunc_00399260_48:
	strb	ip, [r3, #2]
.Lfunc_00399260_4c:
	ldr	ip, [r0, #40]
.Lfunc_00399260_50:
	add	r3, r1, r1, lsl #1
.Lfunc_00399260_54:
	add	r3, r3, r1, lsl #3
.Lfunc_00399260_58:
	mov	r5, #255
.Lfunc_00399260_5c:
	ldr	ip, [ip, #52]
.Lfunc_00399260_60:
	add	r3, ip, r3, lsl #2
.Lfunc_00399260_64:
	ldr	ip, [r3, #4]
.Lfunc_00399260_68:
	str	ip, [sp]
.Lfunc_00399260_6c:
	ldr	ip, [r3, #8]
.Lfunc_00399260_70:
	str	ip, [sp, #4]
.Lfunc_00399260_74:
	ldr	r3, [r3, #12]
.Lfunc_00399260_78:
	str	r3, [sp, #8]
.Lfunc_00399260_7c:
	ldr	ip, [r0, #128]
.Lfunc_00399260_80:
	ldr	r0, [sp, r2, lsl #2]
.Lfunc_00399260_84:
	lsl	r3, r2, #3
.Lfunc_00399260_88:
	add	r1, ip, r1, lsl #4
.Lfunc_00399260_8c:
	cmp	r0, #0
.Lfunc_00399260_90:
	movne	ip, #1
.Lfunc_00399260_94:
	moveq	ip, #0
.Lfunc_00399260_98:
	ldr	r4, [r1]
.Lfunc_00399260_9c:
	lsl	ip, ip, r3
.Lfunc_00399260_a0:
	bic	r3, r4, r5, lsl r3
.Lfunc_00399260_a4:
	orr	r3, r3, ip
.Lfunc_00399260_a8:
	add	r2, r1, r2, lsl #2
.Lfunc_00399260_ac:
	str	r3, [r1]
.Lfunc_00399260_b0:
	str	r0, [r2, #4]
.Lfunc_00399260_b4:
	add	sp, sp, #12
.Lfunc_00399260_b8:
	pop	{r4, r5}
.Lfunc_00399260_bc:
	bx	lr
.Lfunc_00399260_c0:
	str	ip, [r3, #324]
.Lfunc_00399260_c4:
	str	ip, [r3, #328]
.Lfunc_00399260_c8:
	ldrb	ip, [r3, #2]
.Lfunc_00399260_cc:
	bic	ip, ip, #2
.Lfunc_00399260_d0:
	b	.Lfunc_00399260_48
.Lfunc_00399260_d4:
	str	ip, [r3, #332]
.Lfunc_00399260_d8:
	str	ip, [r3, #336]
.Lfunc_00399260_dc:
	ldrb	ip, [r3, #2]
.Lfunc_00399260_e0:
	bic	ip, ip, #4
.Lfunc_00399260_e4:
	b	.Lfunc_00399260_48
.size func_00399260, .-func_00399260

.section .text.func_003A35D0,"ax",%progbits
.balign 4
.global func_003A35D0
.type func_003A35D0, %function
func_003A35D0:
.Lfunc_003A35D0_0:
	push	{r4, r5, r6, r7}
.Lfunc_003A35D0_4:
	sub	r2, r2, #6400
.Lfunc_003A35D0_8:
	ldr	r6, [sp, #16]
.Lfunc_003A35D0_c:
	subs	r2, r2, #7
.Lfunc_003A35D0_10:
	beq	.Lfunc_003A35D0_80
.Lfunc_003A35D0_14:
	cmp	r6, #0
.Lfunc_003A35D0_18:
	mov	r5, #0
.Lfunc_003A35D0_1c:
	ble	.Lfunc_003A35D0_78
.Lfunc_003A35D0_20:
	cmp	r3, #0
.Lfunc_003A35D0_24:
	ble	.Lfunc_003A35D0_6c
.Lfunc_003A35D0_28:
	mul	r2, r3, r5
.Lfunc_003A35D0_2c:
	mov	ip, r3
.Lfunc_003A35D0_30:
	add	r7, r1, r2, lsl #2
.Lfunc_003A35D0_34:
	add	r4, r0, r2, lsl #2
.Lfunc_003A35D0_38:
	add	r2, r7, #2
.Lfunc_003A35D0_3c:
	subs	ip, ip, #1
.Lfunc_003A35D0_40:
	ldrb	r7, [r2]
.Lfunc_003A35D0_44:
	strb	r7, [r4]
.Lfunc_003A35D0_48:
	ldrb	r7, [r2, #-1]
.Lfunc_003A35D0_4c:
	strb	r7, [r4, #1]
.Lfunc_003A35D0_50:
	ldrb	r7, [r2, #-2]
.Lfunc_003A35D0_54:
	strb	r7, [r4, #2]
.Lfunc_003A35D0_58:
	ldrb	r7, [r2, #1]
.Lfunc_003A35D0_5c:
	add	r2, r2, #4
.Lfunc_003A35D0_60:
	strb	r7, [r4, #3]
.Lfunc_003A35D0_64:
	add	r4, r4, #4
.Lfunc_003A35D0_68:
	bne	.Lfunc_003A35D0_3c
.Lfunc_003A35D0_6c:
	add	r5, r5, #1
.Lfunc_003A35D0_70:
	cmp	r6, r5
.Lfunc_003A35D0_74:
	bgt	.Lfunc_003A35D0_20
.Lfunc_003A35D0_78:
	pop	{r4, r5, r6, r7}
.Lfunc_003A35D0_7c:
	bx	lr
.Lfunc_003A35D0_80:
	cmp	r6, #0
.Lfunc_003A35D0_84:
	mov	ip, #0
.Lfunc_003A35D0_88:
	ble	.Lfunc_003A35D0_78
.Lfunc_003A35D0_8c:
	cmp	r3, #0
.Lfunc_003A35D0_90:
	ble	.Lfunc_003A35D0_d4
.Lfunc_003A35D0_94:
	mul	r4, r3, ip
.Lfunc_003A35D0_98:
	mov	r2, r3
.Lfunc_003A35D0_9c:
	add	r4, r4, r4, lsl #1
.Lfunc_003A35D0_a0:
	add	r7, r4, r1
.Lfunc_003A35D0_a4:
	add	r5, r4, r0
.Lfunc_003A35D0_a8:
	add	r4, r7, #2
.Lfunc_003A35D0_ac:
	subs	r2, r2, #1
.Lfunc_003A35D0_b0:
	ldrb	r7, [r4]
.Lfunc_003A35D0_b4:
	strb	r7, [r5]
.Lfunc_003A35D0_b8:
	ldrb	r7, [r4, #-1]
.Lfunc_003A35D0_bc:
	strb	r7, [r5, #1]
.Lfunc_003A35D0_c0:
	ldrb	r7, [r4, #-2]
.Lfunc_003A35D0_c4:
	add	r4, r4, #3
.Lfunc_003A35D0_c8:
	strb	r7, [r5, #2]
.Lfunc_003A35D0_cc:
	add	r5, r5, #3
.Lfunc_003A35D0_d0:
	bne	.Lfunc_003A35D0_ac
.Lfunc_003A35D0_d4:
	add	ip, ip, #1
.Lfunc_003A35D0_d8:
	cmp	r6, ip
.Lfunc_003A35D0_dc:
	bgt	.Lfunc_003A35D0_8c
.Lfunc_003A35D0_e0:
	pop	{r4, r5, r6, r7}
.Lfunc_003A35D0_e4:
	bx	lr
.size func_003A35D0, .-func_003A35D0

.section .text.func_0037A194,"ax",%progbits
.balign 4
.global func_0037A194
.type func_0037A194, %function
func_0037A194:
.Lfunc_0037A194_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_0037A194_4:
	ldrb	r3, [r0, #8]
.Lfunc_0037A194_8:
	ldrb	r2, [r1, #28]
.Lfunc_0037A194_c:
	cmp	r3, r2
.Lfunc_0037A194_10:
	bne	.Lfunc_0037A194_d8
.Lfunc_0037A194_14:
	ldr	r4, [r1, #4]
.Lfunc_0037A194_18:
	cmp	r4, #0
.Lfunc_0037A194_1c:
	blt	.Lfunc_0037A194_d8
.Lfunc_0037A194_20:
	ldr	r3, [r0, #12]
.Lfunc_0037A194_24:
	mov	r6, #1
.Lfunc_0037A194_28:
	ldr	ip, [r3]
.Lfunc_0037A194_2c:
	cmp	ip, #0
.Lfunc_0037A194_30:
	beq	.Lfunc_0037A194_a0
.Lfunc_0037A194_34:
	ldr	r5, [r3, #8]
.Lfunc_0037A194_38:
	mov	r2, #0
.Lfunc_0037A194_3c:
	cmp	r5, #0
.Lfunc_0037A194_40:
	bls	.Lfunc_0037A194_a0
.Lfunc_0037A194_44:
	ldr	r8, [ip, r2, lsl #2]
.Lfunc_0037A194_48:
	cmp	r8, r1
.Lfunc_0037A194_4c:
	bne	.Lfunc_0037A194_94
.Lfunc_0037A194_50:
	sub	ip, r5, #1
.Lfunc_0037A194_54:
	cmp	ip, r2
.Lfunc_0037A194_58:
	movhi	r5, #4
.Lfunc_0037A194_5c:
	bls	.Lfunc_0037A194_84
.Lfunc_0037A194_60:
	ldr	ip, [r3]
.Lfunc_0037A194_64:
	add	r7, r5, r2, lsl #2
.Lfunc_0037A194_68:
	ldr	r7, [ip, r7]
.Lfunc_0037A194_6c:
	str	r7, [ip, r2, lsl #2]
.Lfunc_0037A194_70:
	ldr	ip, [r3, #8]
.Lfunc_0037A194_74:
	add	r2, r2, #1
.Lfunc_0037A194_78:
	sub	ip, ip, #1
.Lfunc_0037A194_7c:
	cmp	ip, r2
.Lfunc_0037A194_80:
	bhi	.Lfunc_0037A194_60
.Lfunc_0037A194_84:
	ldr	r2, [r3, #8]
.Lfunc_0037A194_88:
	sub	r2, r2, #1
.Lfunc_0037A194_8c:
	str	r2, [r3, #8]
.Lfunc_0037A194_90:
	b	.Lfunc_0037A194_a0
.Lfunc_0037A194_94:
	add	r2, r2, #1
.Lfunc_0037A194_98:
	cmp	r5, r2
.Lfunc_0037A194_9c:
	bhi	.Lfunc_0037A194_44
.Lfunc_0037A194_a0:
	ldr	r0, [r0, #16]
.Lfunc_0037A194_a4:
	ldr	r2, [r0]
.Lfunc_0037A194_a8:
	cmp	r2, r4
.Lfunc_0037A194_ac:
	bls	.Lfunc_0037A194_c4
.Lfunc_0037A194_b0:
	ldr	r0, [r0, #4]
.Lfunc_0037A194_b4:
	and	r2, r4, #7
.Lfunc_0037A194_b8:
	ldrb	r3, [r0, r4, lsr #3]
.Lfunc_0037A194_bc:
	bic	r2, r3, r6, lsl r2
.Lfunc_0037A194_c0:
	strb	r2, [r0, r4, lsr #3]
.Lfunc_0037A194_c4:
	mvn	r0, #0
.Lfunc_0037A194_c8:
	str	r0, [r1, #4]
.Lfunc_0037A194_cc:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_0037A194_d0:
	mov	r0, #1
.Lfunc_0037A194_d4:
	bx	lr
.Lfunc_0037A194_d8:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_0037A194_dc:
	mov	r0, #0
.Lfunc_0037A194_e0:
	bx	lr
.size func_0037A194, .-func_0037A194
```
