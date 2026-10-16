# Probe-verified ARM runtime/helper batch 63

## Scope and provenance

This clean-room specification covers eight currently unmatched ARM-state,
call-free helpers totaling 3,004 executable body bytes. Evidence was limited
to the current unmatched report, the neutral symbol inventory, bounded
private-target control/data-flow inspection, and independently assembled
exact-schedule probes. The selection excludes every earlier configured
function plus duplicate batch 63 and IPC batch 59 reservations.

The functions contain no calls, external branches, relocations, literal-pool
loads, PC-relative address calculations, adjacent data, opaque absolute
addresses, or private strings/assets. Independent ARMv6K assembly comparison
against target revision `AS_EUR_REV2` on 2026-10-16 matched all eight complete
bodies (3,004 bytes / 751 instructions).

## Semantic summary

- `func_003AA3A4` (408 bytes) computes a 3-by-3 single-precision matrix
  product from two packed nine-float inputs into a packed nine-float output.
  It preserves the exact scalar VFP multiply/accumulate order and the original
  alias-check prelude.
- `func_00381210` (404 bytes) selects a 372-byte indexed record beneath an
  owning object, then normalizes two packed control words at record offsets
  240 and 244. Modes zero and one perform distinct staged bitfield rewrites;
  other modes retain the common enable and final three-bit mode update.
- `func_0034D0E8` (392 bytes) advances a byte-valued selection through one of
  four directional lookup layouts. It consults an optional override table and
  an occupancy bitset, updates the corresponding override byte when present,
  records the previous selection when it changes, and returns whether a new
  occupied selection was found.
- `func_002E1DE0` (372 bytes) snapshots up to seven entries from a circular
  history descriptor while guarding against concurrent descriptor changes.
  Each output record has an eight-byte stride and carries two halfwords plus
  one byte; successful snapshots update the caller's cursor, count, and
  64-bit generation value.
- `func_002E1F54` (372 bytes) is the six-byte-record companion to the previous
  snapshot helper. It uses the same bounded circular-history and consistency
  protocol, copying three halfwords per output entry.
- `func_0053FD88` (372 bytes) computes a 3-by-3 single-precision matrix
  product for matrices whose rows have a 16-byte stride. It preserves the
  target's two-path schedule, including the fixed stride selection and the
  otherwise unreachable packed-layout path.
- `func_003ECA64` (360 bytes) exports fields from a nested descriptor into an
  output layout. Two selector bytes choose between four fixed permutations
  and compact/full subsets, including the exact derived half-count rule.
- `func_004BD1C4` (324 bytes) derives four single-precision extent values from
  optional nested image records. Record kinds one, four, and eight select
  either one shared source or four directional sources; valid dimensions are
  converted from unsigned halfwords, and absent records contribute zero.

## Exact schedules

The following is the complete independently assembled artifact. Every
function has a zero-byte adjacent-data schedule. Local labels may be renamed
consistently. Preserve every mnemonic, operand, condition, memory mode,
instruction order, and function boundary. The two 372-byte history helpers
are similar but intentionally retain their distinct load/store schedules.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003AA3A4,"ax",%progbits
.balign 4
.global func_003AA3A4
.type func_003AA3A4, %function
func_003AA3A4:
.Lfunc_003AA3A4_0:
	push	{r4, r5, r6, lr}
.Lfunc_003AA3A4_4:
	mov	r4, r1
.Lfunc_003AA3A4_8:
	cmp	r0, r4
.Lfunc_003AA3A4_c:
	mov	r6, r0
.Lfunc_003AA3A4_10:
	mov	r5, r2
.Lfunc_003AA3A4_14:
	cmpne	r6, r5
.Lfunc_003AA3A4_18:
	bne	.Lfunc_003AA3A4_2c
.Lfunc_003AA3A4_1c:
	mov	r2, #0
.Lfunc_003AA3A4_20:
	mov	r1, r2
.Lfunc_003AA3A4_24:
	mov	r0, r2
.Lfunc_003AA3A4_28:
	mov	r0, r0
.Lfunc_003AA3A4_2c:
	vldr	s0, [r4]
.Lfunc_003AA3A4_30:
	vldr	s5, [r5]
.Lfunc_003AA3A4_34:
	vldr	s3, [r4, #4]
.Lfunc_003AA3A4_38:
	vldr	s4, [r5, #12]
.Lfunc_003AA3A4_3c:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_40:
	vldr	s1, [r4, #8]
.Lfunc_003AA3A4_44:
	vldr	s2, [r5, #24]
.Lfunc_003AA3A4_48:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_4c:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_50:
	vstr	s0, [r6]
.Lfunc_003AA3A4_54:
	vldr	s0, [r4]
.Lfunc_003AA3A4_58:
	vldr	s5, [r5, #4]
.Lfunc_003AA3A4_5c:
	vldr	s3, [r4, #4]
.Lfunc_003AA3A4_60:
	vldr	s4, [r5, #16]
.Lfunc_003AA3A4_64:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_68:
	vldr	s1, [r4, #8]
.Lfunc_003AA3A4_6c:
	vldr	s2, [r5, #28]
.Lfunc_003AA3A4_70:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_74:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_78:
	vstr	s0, [r6, #4]
.Lfunc_003AA3A4_7c:
	vldr	s0, [r4]
.Lfunc_003AA3A4_80:
	vldr	s5, [r5, #8]
.Lfunc_003AA3A4_84:
	vldr	s1, [r4, #4]
.Lfunc_003AA3A4_88:
	vldr	s4, [r5, #20]
.Lfunc_003AA3A4_8c:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_90:
	vldr	s2, [r4, #8]
.Lfunc_003AA3A4_94:
	vldr	s3, [r5, #32]
.Lfunc_003AA3A4_98:
	vmla.f32	s0, s1, s4
.Lfunc_003AA3A4_9c:
	vmla.f32	s0, s2, s3
.Lfunc_003AA3A4_a0:
	vstr	s0, [r6, #8]
.Lfunc_003AA3A4_a4:
	vldr	s0, [r4, #12]
.Lfunc_003AA3A4_a8:
	vldr	s5, [r5]
.Lfunc_003AA3A4_ac:
	vldr	s3, [r4, #16]
.Lfunc_003AA3A4_b0:
	vldr	s4, [r5, #12]
.Lfunc_003AA3A4_b4:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_b8:
	vldr	s1, [r4, #20]
.Lfunc_003AA3A4_bc:
	vldr	s2, [r5, #24]
.Lfunc_003AA3A4_c0:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_c4:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_c8:
	vstr	s0, [r6, #12]
.Lfunc_003AA3A4_cc:
	vldr	s0, [r4, #12]
.Lfunc_003AA3A4_d0:
	vldr	s5, [r5, #4]
.Lfunc_003AA3A4_d4:
	vldr	s3, [r4, #16]
.Lfunc_003AA3A4_d8:
	vldr	s4, [r5, #16]
.Lfunc_003AA3A4_dc:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_e0:
	vldr	s1, [r4, #20]
.Lfunc_003AA3A4_e4:
	vldr	s2, [r5, #28]
.Lfunc_003AA3A4_e8:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_ec:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_f0:
	vstr	s0, [r6, #16]
.Lfunc_003AA3A4_f4:
	vldr	s0, [r4, #12]
.Lfunc_003AA3A4_f8:
	vldr	s5, [r5, #8]
.Lfunc_003AA3A4_fc:
	vldr	s3, [r4, #16]
.Lfunc_003AA3A4_100:
	vldr	s4, [r5, #20]
.Lfunc_003AA3A4_104:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_108:
	vldr	s1, [r4, #20]
.Lfunc_003AA3A4_10c:
	vldr	s2, [r5, #32]
.Lfunc_003AA3A4_110:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_114:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_118:
	vstr	s0, [r6, #20]
.Lfunc_003AA3A4_11c:
	vldr	s0, [r4, #24]
.Lfunc_003AA3A4_120:
	vldr	s5, [r5]
.Lfunc_003AA3A4_124:
	vldr	s3, [r4, #28]
.Lfunc_003AA3A4_128:
	vldr	s4, [r5, #12]
.Lfunc_003AA3A4_12c:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_130:
	vldr	s1, [r4, #32]
.Lfunc_003AA3A4_134:
	vldr	s2, [r5, #24]
.Lfunc_003AA3A4_138:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_13c:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_140:
	vstr	s0, [r6, #24]
.Lfunc_003AA3A4_144:
	vldr	s0, [r4, #24]
.Lfunc_003AA3A4_148:
	vldr	s5, [r5, #4]
.Lfunc_003AA3A4_14c:
	vldr	s3, [r4, #28]
.Lfunc_003AA3A4_150:
	vldr	s4, [r5, #16]
.Lfunc_003AA3A4_154:
	vldr	s1, [r4, #32]
.Lfunc_003AA3A4_158:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_15c:
	vldr	s2, [r5, #28]
.Lfunc_003AA3A4_160:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_164:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_168:
	vstr	s0, [r6, #28]
.Lfunc_003AA3A4_16c:
	vldr	s0, [r4, #24]
.Lfunc_003AA3A4_170:
	vldr	s5, [r5, #8]
.Lfunc_003AA3A4_174:
	vldr	s1, [r4, #28]
.Lfunc_003AA3A4_178:
	vldr	s2, [r5, #20]
.Lfunc_003AA3A4_17c:
	vmul.f32	s0, s0, s5
.Lfunc_003AA3A4_180:
	vldr	s3, [r4, #32]
.Lfunc_003AA3A4_184:
	vldr	s4, [r5, #32]
.Lfunc_003AA3A4_188:
	vmla.f32	s0, s1, s2
.Lfunc_003AA3A4_18c:
	vmla.f32	s0, s3, s4
.Lfunc_003AA3A4_190:
	vstr	s0, [r6, #32]
.Lfunc_003AA3A4_194:
	pop	{r4, r5, r6, pc}
.size func_003AA3A4, .-func_003AA3A4

.section .text.func_00381210,"ax",%progbits
.balign 4
.global func_00381210
.type func_00381210, %function
func_00381210:
.Lfunc_00381210_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00381210_4:
	ldr	r0, [r0, #108]
.Lfunc_00381210_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00381210_c:
	add	r0, r0, r1, lsl #2
.Lfunc_00381210_10:
	mov	r1, r2
.Lfunc_00381210_14:
	mov	r0, r0
.Lfunc_00381210_18:
	push	{r4, r5, r6}
.Lfunc_00381210_1c:
	cmp	r1, #0
.Lfunc_00381210_20:
	ldr	r2, [r0, #244]
.Lfunc_00381210_24:
	ldr	r3, [r0, #240]
.Lfunc_00381210_28:
	mov	r6, #3584
.Lfunc_00381210_2c:
	mov	r5, #983040
.Lfunc_00381210_30:
	mov	r4, #251658240
.Lfunc_00381210_34:
	orr	r2, r2, #1
.Lfunc_00381210_38:
	beq	.Lfunc_00381210_48
.Lfunc_00381210_3c:
	cmp	r1, #1
.Lfunc_00381210_40:
	bne	.Lfunc_00381210_164
.Lfunc_00381210_44:
	b	.Lfunc_00381210_110
.Lfunc_00381210_48:
	bic	r3, r3, #448
.Lfunc_00381210_4c:
	orr	r3, r3, #2
.Lfunc_00381210_50:
	mov	ip, #1
.Lfunc_00381210_54:
	lsl	r4, r3, #26
.Lfunc_00381210_58:
	str	r2, [r0, #244]
.Lfunc_00381210_5c:
	cmp	ip, r4, lsr #29
.Lfunc_00381210_60:
	str	r3, [r0, #240]
.Lfunc_00381210_64:
	bne	.Lfunc_00381210_7c
.Lfunc_00381210_68:
	bic	r3, r3, #3584
.Lfunc_00381210_6c:
	orr	r2, r2, #1
.Lfunc_00381210_70:
	orr	r3, r3, #2
.Lfunc_00381210_74:
	str	r2, [r0, #244]
.Lfunc_00381210_78:
	str	r3, [r0, #240]
.Lfunc_00381210_7c:
	mov	r2, r3
.Lfunc_00381210_80:
	bic	r2, r2, #61440
.Lfunc_00381210_84:
	orr	r2, r2, #4096
.Lfunc_00381210_88:
	ldr	r3, [r0, #244]
.Lfunc_00381210_8c:
	orr	r2, r2, #2
.Lfunc_00381210_90:
	lsl	r4, r2, #26
.Lfunc_00381210_94:
	orr	r3, r3, #1
.Lfunc_00381210_98:
	cmp	ip, r4, lsr #29
.Lfunc_00381210_9c:
	strd	r2, [r0, #240]
.Lfunc_00381210_a0:
	bne	.Lfunc_00381210_b8
.Lfunc_00381210_a4:
	bic	r2, r2, #983040
.Lfunc_00381210_a8:
	orr	r2, r2, #65536
.Lfunc_00381210_ac:
	orr	r3, r3, #1
.Lfunc_00381210_b0:
	orr	r2, r2, #2
.Lfunc_00381210_b4:
	strd	r2, [r0, #240]
.Lfunc_00381210_b8:
	bic	r2, r2, #15728640
.Lfunc_00381210_bc:
	orr	r2, r2, #2
.Lfunc_00381210_c0:
	orr	r3, r3, #1
.Lfunc_00381210_c4:
	lsl	r4, r2, #26
.Lfunc_00381210_c8:
	strd	r2, [r0, #240]
.Lfunc_00381210_cc:
	cmp	ip, r4, lsr #29
.Lfunc_00381210_d0:
	bne	.Lfunc_00381210_e4
.Lfunc_00381210_d4:
	bic	r2, r2, #251658240
.Lfunc_00381210_d8:
	orr	r3, r3, #1
.Lfunc_00381210_dc:
	orr	r2, r2, #2
.Lfunc_00381210_e0:
	strd	r2, [r0, #240]
.Lfunc_00381210_e4:
	bic	r2, r2, #983040
.Lfunc_00381210_e8:
	bic	r2, r2, #3584
.Lfunc_00381210_ec:
	bic	ip, r2, #251658240
.Lfunc_00381210_f0:
	orr	r2, r3, #1
.Lfunc_00381210_f4:
	orr	r3, ip, #2
.Lfunc_00381210_f8:
	orr	ip, r2, #1
.Lfunc_00381210_fc:
	orr	r2, r3, #65536
.Lfunc_00381210_100:
	add	r4, r0, #240
.Lfunc_00381210_104:
	orr	r2, r2, #2
.Lfunc_00381210_108:
	stm	r4, {r2, ip}
.Lfunc_00381210_10c:
	b	.Lfunc_00381210_164
.Lfunc_00381210_110:
	lsl	ip, r3, #23
.Lfunc_00381210_114:
	bic	r3, r3, #3584
.Lfunc_00381210_118:
	lsr	ip, ip, #29
.Lfunc_00381210_11c:
	and	ip, r6, ip, lsl #9
.Lfunc_00381210_120:
	orr	r3, r3, ip
.Lfunc_00381210_124:
	orr	r3, r3, #2
.Lfunc_00381210_128:
	orr	r6, r2, #1
.Lfunc_00381210_12c:
	lsl	ip, r3, #16
.Lfunc_00381210_130:
	bic	r3, r3, #983040
.Lfunc_00381210_134:
	lsr	ip, ip, #28
.Lfunc_00381210_138:
	and	r2, r5, ip, lsl #16
.Lfunc_00381210_13c:
	orr	r2, r2, r3
.Lfunc_00381210_140:
	orr	r2, r2, #2
.Lfunc_00381210_144:
	lsl	r3, r2, #8
.Lfunc_00381210_148:
	bic	r2, r2, #251658240
.Lfunc_00381210_14c:
	lsr	r3, r3, #28
.Lfunc_00381210_150:
	and	ip, r4, r3, lsl #24
.Lfunc_00381210_154:
	orr	r2, r2, ip
.Lfunc_00381210_158:
	orr	r3, r6, #1
.Lfunc_00381210_15c:
	orr	r2, r2, #2
.Lfunc_00381210_160:
	strd	r2, [r0, #240]
.Lfunc_00381210_164:
	ldr	r3, [r0, #240]
.Lfunc_00381210_168:
	ldr	r2, [r0, #244]
.Lfunc_00381210_16c:
	mov	ip, #56
.Lfunc_00381210_170:
	and	r1, ip, r1, lsl #3
.Lfunc_00381210_174:
	bic	r3, r3, #56
.Lfunc_00381210_178:
	orr	r1, r1, r3
.Lfunc_00381210_17c:
	add	r0, r0, #240
.Lfunc_00381210_180:
	orr	r2, r2, #1
.Lfunc_00381210_184:
	orr	r1, r1, #1
.Lfunc_00381210_188:
	stm	r0, {r1, r2}
.Lfunc_00381210_18c:
	pop	{r4, r5, r6}
.Lfunc_00381210_190:
	bx	lr
.size func_00381210, .-func_00381210

.section .text.func_0034D0E8,"ax",%progbits
.balign 4
.global func_0034D0E8
.type func_0034D0E8, %function
func_0034D0E8:
.Lfunc_0034D0E8_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_0034D0E8_4:
	mov	r4, #1
.Lfunc_0034D0E8_8:
	mov	r7, #4
.Lfunc_0034D0E8_c:
	mov	r8, #5
.Lfunc_0034D0E8_10:
	mov	r5, #2
.Lfunc_0034D0E8_14:
	ldrb	r3, [r0, #20]
.Lfunc_0034D0E8_18:
	mov	r9, #6
.Lfunc_0034D0E8_1c:
	mov	r6, #3
.Lfunc_0034D0E8_20:
	mov	ip, r3
.Lfunc_0034D0E8_24:
	mov	r2, ip
.Lfunc_0034D0E8_28:
	mov	sl, #7
.Lfunc_0034D0E8_2c:
	cmp	r1, #0
.Lfunc_0034D0E8_30:
	beq	.Lfunc_0034D0E8_50
.Lfunc_0034D0E8_34:
	cmp	r1, #1
.Lfunc_0034D0E8_38:
	beq	.Lfunc_0034D0E8_74
.Lfunc_0034D0E8_3c:
	cmp	r1, #2
.Lfunc_0034D0E8_40:
	beq	.Lfunc_0034D0E8_a0
.Lfunc_0034D0E8_44:
	cmp	r1, #3
.Lfunc_0034D0E8_48:
	bne	.Lfunc_0034D0E8_e4
.Lfunc_0034D0E8_4c:
	b	.Lfunc_0034D0E8_c8
.Lfunc_0034D0E8_50:
	ldr	r2, [r0, #12]
.Lfunc_0034D0E8_54:
	cmp	r2, #0
.Lfunc_0034D0E8_58:
	beq	.Lfunc_0034D0E8_68
.Lfunc_0034D0E8_5c:
	ldrb	r2, [r2, r3, lsl #2]
.Lfunc_0034D0E8_60:
	cmp	r2, #255
.Lfunc_0034D0E8_64:
	bne	.Lfunc_0034D0E8_e4
.Lfunc_0034D0E8_68:
	ldr	r2, [r0, #8]
.Lfunc_0034D0E8_6c:
	add	fp, r7, r3, lsl #3
.Lfunc_0034D0E8_70:
	b	.Lfunc_0034D0E8_98
.Lfunc_0034D0E8_74:
	ldr	r2, [r0, #12]
.Lfunc_0034D0E8_78:
	cmp	r2, #0
.Lfunc_0034D0E8_7c:
	beq	.Lfunc_0034D0E8_90
.Lfunc_0034D0E8_80:
	add	fp, r4, r3, lsl #2
.Lfunc_0034D0E8_84:
	ldrb	r2, [r2, fp]
.Lfunc_0034D0E8_88:
	cmp	r2, #255
.Lfunc_0034D0E8_8c:
	bne	.Lfunc_0034D0E8_e4
.Lfunc_0034D0E8_90:
	ldr	r2, [r0, #8]
.Lfunc_0034D0E8_94:
	add	fp, r8, r3, lsl #3
.Lfunc_0034D0E8_98:
	ldrb	r2, [r2, fp]
.Lfunc_0034D0E8_9c:
	b	.Lfunc_0034D0E8_e4
.Lfunc_0034D0E8_a0:
	ldr	r2, [r0, #12]
.Lfunc_0034D0E8_a4:
	cmp	r2, #0
.Lfunc_0034D0E8_a8:
	beq	.Lfunc_0034D0E8_bc
.Lfunc_0034D0E8_ac:
	add	fp, r5, r3, lsl #2
.Lfunc_0034D0E8_b0:
	ldrb	r2, [r2, fp]
.Lfunc_0034D0E8_b4:
	cmp	r2, #255
.Lfunc_0034D0E8_b8:
	bne	.Lfunc_0034D0E8_e4
.Lfunc_0034D0E8_bc:
	ldr	r2, [r0, #8]
.Lfunc_0034D0E8_c0:
	add	fp, r9, r3, lsl #3
.Lfunc_0034D0E8_c4:
	b	.Lfunc_0034D0E8_98
.Lfunc_0034D0E8_c8:
	ldr	r2, [r0, #12]
.Lfunc_0034D0E8_cc:
	cmp	r2, #0
.Lfunc_0034D0E8_d0:
	beq	.Lfunc_0034D0E8_f8
.Lfunc_0034D0E8_d4:
	add	fp, r6, r3, lsl #2
.Lfunc_0034D0E8_d8:
	ldrb	r2, [r2, fp]
.Lfunc_0034D0E8_dc:
	cmp	r2, #255
.Lfunc_0034D0E8_e0:
	beq	.Lfunc_0034D0E8_f8
.Lfunc_0034D0E8_e4:
	cmp	r2, r3
.Lfunc_0034D0E8_e8:
	cmpne	ip, r2
.Lfunc_0034D0E8_ec:
	bne	.Lfunc_0034D0E8_104
.Lfunc_0034D0E8_f0:
	mov	r0, #0
.Lfunc_0034D0E8_f4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Lfunc_0034D0E8_f8:
	ldr	r2, [r0, #8]
.Lfunc_0034D0E8_fc:
	add	fp, sl, r3, lsl #3
.Lfunc_0034D0E8_100:
	b	.Lfunc_0034D0E8_98
.Lfunc_0034D0E8_104:
	lsr	r3, r2, #5
.Lfunc_0034D0E8_108:
	and	fp, r2, #31
.Lfunc_0034D0E8_10c:
	add	r3, r0, r3, lsl #2
.Lfunc_0034D0E8_110:
	mov	lr, r0
.Lfunc_0034D0E8_114:
	ldr	r3, [r3, #24]
.Lfunc_0034D0E8_118:
	lsr	r3, r3, fp
.Lfunc_0034D0E8_11c:
	and	r3, r3, #1
.Lfunc_0034D0E8_120:
	cmp	r3, #1
.Lfunc_0034D0E8_124:
	movne	r3, r2
.Lfunc_0034D0E8_128:
	bne	.Lfunc_0034D0E8_2c
.Lfunc_0034D0E8_12c:
	ldr	r3, [r0, #12]
.Lfunc_0034D0E8_130:
	cmp	r3, #0
.Lfunc_0034D0E8_134:
	beq	.Lfunc_0034D0E8_170
.Lfunc_0034D0E8_138:
	cmp	r1, #0
.Lfunc_0034D0E8_13c:
	addeq	r1, r4, r2, lsl #2
.Lfunc_0034D0E8_140:
	strbeq	ip, [r3, r1]
.Lfunc_0034D0E8_144:
	beq	.Lfunc_0034D0E8_170
.Lfunc_0034D0E8_148:
	cmp	r1, #1
.Lfunc_0034D0E8_14c:
	strbeq	ip, [r3, r2, lsl #2]
.Lfunc_0034D0E8_150:
	beq	.Lfunc_0034D0E8_170
.Lfunc_0034D0E8_154:
	cmp	r1, #2
.Lfunc_0034D0E8_158:
	addeq	r1, r6, r2, lsl #2
.Lfunc_0034D0E8_15c:
	beq	.Lfunc_0034D0E8_16c
.Lfunc_0034D0E8_160:
	cmp	r1, #3
.Lfunc_0034D0E8_164:
	addeq	r1, r5, r2, lsl #2
.Lfunc_0034D0E8_168:
	bne	.Lfunc_0034D0E8_170
.Lfunc_0034D0E8_16c:
	strb	ip, [r3, r1]
.Lfunc_0034D0E8_170:
	ldrb	r1, [r0, #20]
.Lfunc_0034D0E8_174:
	cmp	r1, r2
.Lfunc_0034D0E8_178:
	strbne	r1, [r0, #21]
.Lfunc_0034D0E8_17c:
	mov	r0, #1
.Lfunc_0034D0E8_180:
	strbne	r2, [lr, #20]
.Lfunc_0034D0E8_184:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_0034D0E8, .-func_0034D0E8

.section .text.func_002E1DE0,"ax",%progbits
.balign 4
.global func_002E1DE0
.type func_002E1DE0, %function
func_002E1DE0:
.Lfunc_002E1DE0_0:
	push	{r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_002E1DE0_4:
	sub	sp, sp, #4
.Lfunc_002E1DE0_8:
	mov	ip, #0
.Lfunc_002E1DE0_c:
	cmp	r2, #0
.Lfunc_002E1DE0_10:
	ldr	r3, [sp, #16]
.Lfunc_002E1DE0_14:
	str	ip, [r3]
.Lfunc_002E1DE0_18:
	ble	.Lfunc_002E1DE0_16c
.Lfunc_002E1DE0_1c:
	cmp	r2, #7
.Lfunc_002E1DE0_20:
	movgt	r2, #7
.Lfunc_002E1DE0_24:
	str	r2, [sp]
.Lfunc_002E1DE0_28:
	ldr	r9, [r0, #16]
.Lfunc_002E1DE0_2c:
	ldrd	r2, [r0]
.Lfunc_002E1DE0_30:
	subs	r4, r9, #0
.Lfunc_002E1DE0_34:
	mov	r5, r2
.Lfunc_002E1DE0_38:
	add	r2, r0, #8
.Lfunc_002E1DE0_3c:
	mov	lr, r3
.Lfunc_002E1DE0_40:
	ldrd	r2, [r2]
.Lfunc_002E1DE0_44:
	mov	fp, r2
.Lfunc_002E1DE0_48:
	mov	sl, r3
.Lfunc_002E1DE0_4c:
	bgt	.Lfunc_002E1DE0_70
.Lfunc_002E1DE0_50:
	bne	.Lfunc_002E1DE0_16c
.Lfunc_002E1DE0_54:
	eor	r2, r5, fp
.Lfunc_002E1DE0_58:
	eor	r3, lr, sl
.Lfunc_002E1DE0_5c:
	orrs	r2, r2, r3
.Lfunc_002E1DE0_60:
	bne	.Lfunc_002E1DE0_70
.Lfunc_002E1DE0_64:
	cmp	lr, #0
.Lfunc_002E1DE0_68:
	movge	r4, #7
.Lfunc_002E1DE0_6c:
	blt	.Lfunc_002E1DE0_16c
.Lfunc_002E1DE0_70:
	ldr	r2, [sp, #56]
.Lfunc_002E1DE0_74:
	ldr	r3, [r2]
.Lfunc_002E1DE0_78:
	ldr	r2, [r2, #4]
.Lfunc_002E1DE0_7c:
	subs	ip, r3, r5
.Lfunc_002E1DE0_80:
	sbcs	ip, r2, lr
.Lfunc_002E1DE0_84:
	blt	.Lfunc_002E1DE0_98
.Lfunc_002E1DE0_88:
	ldr	r2, [sp, #60]
.Lfunc_002E1DE0_8c:
	ldr	r2, [r2]
.Lfunc_002E1DE0_90:
	sub	r8, r4, r2
.Lfunc_002E1DE0_94:
	b	.Lfunc_002E1DE0_c4
.Lfunc_002E1DE0_98:
	cmp	sl, #0
.Lfunc_002E1DE0_9c:
	addlt	r8, r4, #1
.Lfunc_002E1DE0_a0:
	blt	.Lfunc_002E1DE0_c4
.Lfunc_002E1DE0_a4:
	subs	r3, r3, fp
.Lfunc_002E1DE0_a8:
	sbcs	r2, r2, sl
.Lfunc_002E1DE0_ac:
	ldrlt	r8, [sp]
.Lfunc_002E1DE0_b0:
	blt	.Lfunc_002E1DE0_c4
.Lfunc_002E1DE0_b4:
	ldr	r2, [sp, #60]
.Lfunc_002E1DE0_b8:
	ldr	r2, [r2]
.Lfunc_002E1DE0_bc:
	sub	r2, r4, r2
.Lfunc_002E1DE0_c0:
	add	r8, r2, #8
.Lfunc_002E1DE0_c4:
	ldr	r2, [sp]
.Lfunc_002E1DE0_c8:
	mov	ip, #0
.Lfunc_002E1DE0_cc:
	cmp	r8, r2
.Lfunc_002E1DE0_d0:
	movgt	r8, r2
.Lfunc_002E1DE0_d4:
	cmp	r8, #0
.Lfunc_002E1DE0_d8:
	ble	.Lfunc_002E1DE0_120
.Lfunc_002E1DE0_dc:
	sub	r2, r4, ip
.Lfunc_002E1DE0_e0:
	add	r2, r2, #8
.Lfunc_002E1DE0_e4:
	add	r7, r1, ip, lsl #3
.Lfunc_002E1DE0_e8:
	asr	r3, r2, #31
.Lfunc_002E1DE0_ec:
	add	r3, r2, r3, lsr #29
.Lfunc_002E1DE0_f0:
	bic	r3, r3, #7
.Lfunc_002E1DE0_f4:
	sub	r2, r2, r3
.Lfunc_002E1DE0_f8:
	add	r3, r0, r2, lsl #3
.Lfunc_002E1DE0_fc:
	ldrh	r6, [r3, #32]
.Lfunc_002E1DE0_100:
	add	ip, ip, #1
.Lfunc_002E1DE0_104:
	cmp	r8, ip
.Lfunc_002E1DE0_108:
	strh	r6, [r7]
.Lfunc_002E1DE0_10c:
	ldrh	r2, [r3, #34]
.Lfunc_002E1DE0_110:
	strh	r2, [r7, #2]
.Lfunc_002E1DE0_114:
	ldrb	r2, [r3, #36]
.Lfunc_002E1DE0_118:
	strb	r2, [r7, #4]
.Lfunc_002E1DE0_11c:
	bgt	.Lfunc_002E1DE0_dc
.Lfunc_002E1DE0_120:
	ldr	ip, [r0, #16]
.Lfunc_002E1DE0_124:
	ldrd	r2, [r0]
.Lfunc_002E1DE0_128:
	ldrd	r6, [r0, #8]
.Lfunc_002E1DE0_12c:
	cmp	ip, r9
.Lfunc_002E1DE0_130:
	bne	.Lfunc_002E1DE0_28
.Lfunc_002E1DE0_134:
	eor	r2, r2, r5
.Lfunc_002E1DE0_138:
	eor	r3, r3, lr
.Lfunc_002E1DE0_13c:
	orrs	r2, r2, r3
.Lfunc_002E1DE0_140:
	bne	.Lfunc_002E1DE0_28
.Lfunc_002E1DE0_144:
	eor	r2, r6, fp
.Lfunc_002E1DE0_148:
	eor	r3, r7, sl
.Lfunc_002E1DE0_14c:
	orrs	r2, r2, r3
.Lfunc_002E1DE0_150:
	bne	.Lfunc_002E1DE0_28
.Lfunc_002E1DE0_154:
	ldr	r1, [sp, #16]
.Lfunc_002E1DE0_158:
	ldr	r0, [sp, #56]
.Lfunc_002E1DE0_15c:
	str	r8, [r1]
.Lfunc_002E1DE0_160:
	stm	r0, {r5, lr}
.Lfunc_002E1DE0_164:
	ldr	r0, [sp, #60]
.Lfunc_002E1DE0_168:
	str	r4, [r0]
.Lfunc_002E1DE0_16c:
	add	sp, sp, #20
.Lfunc_002E1DE0_170:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_002E1DE0, .-func_002E1DE0

.section .text.func_002E1F54,"ax",%progbits
.balign 4
.global func_002E1F54
.type func_002E1F54, %function
func_002E1F54:
.Lfunc_002E1F54_0:
	push	{r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_002E1F54_4:
	sub	sp, sp, #4
.Lfunc_002E1F54_8:
	mov	ip, #0
.Lfunc_002E1F54_c:
	cmp	r2, #0
.Lfunc_002E1F54_10:
	ldr	r3, [sp, #16]
.Lfunc_002E1F54_14:
	str	ip, [r3]
.Lfunc_002E1F54_18:
	ble	.Lfunc_002E1F54_16c
.Lfunc_002E1F54_1c:
	cmp	r2, #7
.Lfunc_002E1F54_20:
	movgt	r2, #7
.Lfunc_002E1F54_24:
	str	r2, [sp]
.Lfunc_002E1F54_28:
	ldr	r9, [r0, #16]
.Lfunc_002E1F54_2c:
	ldrd	r2, [r0]
.Lfunc_002E1F54_30:
	subs	r4, r9, #0
.Lfunc_002E1F54_34:
	mov	r5, r2
.Lfunc_002E1F54_38:
	mov	lr, r3
.Lfunc_002E1F54_3c:
	ldrd	r2, [r0, #8]
.Lfunc_002E1F54_40:
	mov	fp, r2
.Lfunc_002E1F54_44:
	mov	sl, r3
.Lfunc_002E1F54_48:
	bgt	.Lfunc_002E1F54_6c
.Lfunc_002E1F54_4c:
	bne	.Lfunc_002E1F54_16c
.Lfunc_002E1F54_50:
	eor	r2, r5, fp
.Lfunc_002E1F54_54:
	eor	r3, lr, sl
.Lfunc_002E1F54_58:
	orrs	r2, r2, r3
.Lfunc_002E1F54_5c:
	bne	.Lfunc_002E1F54_6c
.Lfunc_002E1F54_60:
	cmp	lr, #0
.Lfunc_002E1F54_64:
	movge	r4, #7
.Lfunc_002E1F54_68:
	blt	.Lfunc_002E1F54_16c
.Lfunc_002E1F54_6c:
	ldr	r3, [sp, #56]
.Lfunc_002E1F54_70:
	ldrd	r2, [r3]
.Lfunc_002E1F54_74:
	subs	ip, r2, r5
.Lfunc_002E1F54_78:
	sbcs	ip, r3, lr
.Lfunc_002E1F54_7c:
	blt	.Lfunc_002E1F54_90
.Lfunc_002E1F54_80:
	ldr	r2, [sp, #60]
.Lfunc_002E1F54_84:
	ldr	r2, [r2]
.Lfunc_002E1F54_88:
	sub	r8, r4, r2
.Lfunc_002E1F54_8c:
	b	.Lfunc_002E1F54_bc
.Lfunc_002E1F54_90:
	cmp	sl, #0
.Lfunc_002E1F54_94:
	addlt	r8, r4, #1
.Lfunc_002E1F54_98:
	blt	.Lfunc_002E1F54_bc
.Lfunc_002E1F54_9c:
	subs	r2, r2, fp
.Lfunc_002E1F54_a0:
	sbcs	r2, r3, sl
.Lfunc_002E1F54_a4:
	ldrlt	r8, [sp]
.Lfunc_002E1F54_a8:
	blt	.Lfunc_002E1F54_bc
.Lfunc_002E1F54_ac:
	ldr	r2, [sp, #60]
.Lfunc_002E1F54_b0:
	ldr	r2, [r2]
.Lfunc_002E1F54_b4:
	sub	r2, r4, r2
.Lfunc_002E1F54_b8:
	add	r8, r2, #8
.Lfunc_002E1F54_bc:
	ldr	r2, [sp]
.Lfunc_002E1F54_c0:
	mov	ip, #0
.Lfunc_002E1F54_c4:
	cmp	r8, r2
.Lfunc_002E1F54_c8:
	movgt	r8, r2
.Lfunc_002E1F54_cc:
	cmp	r8, #0
.Lfunc_002E1F54_d0:
	ble	.Lfunc_002E1F54_120
.Lfunc_002E1F54_d4:
	sub	r2, r4, ip
.Lfunc_002E1F54_d8:
	add	r2, r2, #8
.Lfunc_002E1F54_dc:
	asr	r3, r2, #31
.Lfunc_002E1F54_e0:
	add	r3, r2, r3, lsr #29
.Lfunc_002E1F54_e4:
	bic	r3, r3, #7
.Lfunc_002E1F54_e8:
	sub	r2, r2, r3
.Lfunc_002E1F54_ec:
	add	r3, ip, ip, lsl #1
.Lfunc_002E1F54_f0:
	add	r2, r2, r2, lsl #1
.Lfunc_002E1F54_f4:
	add	r6, r1, r3, lsl #1
.Lfunc_002E1F54_f8:
	add	r3, r0, r2, lsl #1
.Lfunc_002E1F54_fc:
	add	ip, ip, #1
.Lfunc_002E1F54_100:
	ldrh	r7, [r3, #32]
.Lfunc_002E1F54_104:
	cmp	r8, ip
.Lfunc_002E1F54_108:
	strh	r7, [r6]
.Lfunc_002E1F54_10c:
	ldrh	r2, [r3, #34]
.Lfunc_002E1F54_110:
	strh	r2, [r6, #2]
.Lfunc_002E1F54_114:
	ldrh	r2, [r3, #36]
.Lfunc_002E1F54_118:
	strh	r2, [r6, #4]
.Lfunc_002E1F54_11c:
	bgt	.Lfunc_002E1F54_d4
.Lfunc_002E1F54_120:
	ldr	ip, [r0, #16]
.Lfunc_002E1F54_124:
	ldrd	r2, [r0]
.Lfunc_002E1F54_128:
	ldrd	r6, [r0, #8]
.Lfunc_002E1F54_12c:
	cmp	ip, r9
.Lfunc_002E1F54_130:
	bne	.Lfunc_002E1F54_28
.Lfunc_002E1F54_134:
	eor	r2, r2, r5
.Lfunc_002E1F54_138:
	eor	r3, r3, lr
.Lfunc_002E1F54_13c:
	orrs	r2, r2, r3
.Lfunc_002E1F54_140:
	bne	.Lfunc_002E1F54_28
.Lfunc_002E1F54_144:
	eor	r2, r6, fp
.Lfunc_002E1F54_148:
	eor	r3, r7, sl
.Lfunc_002E1F54_14c:
	orrs	r2, r2, r3
.Lfunc_002E1F54_150:
	bne	.Lfunc_002E1F54_28
.Lfunc_002E1F54_154:
	ldr	r1, [sp, #16]
.Lfunc_002E1F54_158:
	ldr	r0, [sp, #56]
.Lfunc_002E1F54_15c:
	str	r8, [r1]
.Lfunc_002E1F54_160:
	stm	r0, {r5, lr}
.Lfunc_002E1F54_164:
	ldr	r0, [sp, #60]
.Lfunc_002E1F54_168:
	str	r4, [r0]
.Lfunc_002E1F54_16c:
	add	sp, sp, #20
.Lfunc_002E1F54_170:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_002E1F54, .-func_002E1F54

.section .text.func_0053FD88,"ax",%progbits
.balign 4
.global func_0053FD88
.type func_0053FD88, %function
func_0053FD88:
.Lfunc_0053FD88_0:
	mov	r3, #0
.Lfunc_0053FD88_4:
	add	r1, r1, r3
.Lfunc_0053FD88_8:
	add	r2, r2, r3
.Lfunc_0053FD88_c:
	mov	r3, #16
.Lfunc_0053FD88_10:
	cmp	r3, #12
.Lfunc_0053FD88_14:
	bne	.Lfunc_0053FD88_c0
.Lfunc_0053FD88_18:
	vpush	{d8}
.Lfunc_0053FD88_1c:
	vldmia	r2!, {s10-s15}
.Lfunc_0053FD88_20:
	vldr	s16, [r1]
.Lfunc_0053FD88_24:
	vldr	s17, [r1, #12]
.Lfunc_0053FD88_28:
	vmul.f32	s0, s10, s16
.Lfunc_0053FD88_2c:
	vmul.f32	s1, s11, s16
.Lfunc_0053FD88_30:
	vmul.f32	s2, s12, s16
.Lfunc_0053FD88_34:
	vldr	s16, [r1, #24]
.Lfunc_0053FD88_38:
	vmul.f32	s3, s10, s17
.Lfunc_0053FD88_3c:
	vmul.f32	s4, s11, s17
.Lfunc_0053FD88_40:
	vmul.f32	s5, s12, s17
.Lfunc_0053FD88_44:
	vldr	s17, [r1, #4]
.Lfunc_0053FD88_48:
	vmul.f32	s6, s10, s16
.Lfunc_0053FD88_4c:
	vmul.f32	s7, s11, s16
.Lfunc_0053FD88_50:
	vmul.f32	s8, s12, s16
.Lfunc_0053FD88_54:
	vldr	s16, [r1, #16]
.Lfunc_0053FD88_58:
	vldmia	r2, {s10-s12}
.Lfunc_0053FD88_5c:
	vmla.f32	s0, s13, s17
.Lfunc_0053FD88_60:
	vmla.f32	s1, s14, s17
.Lfunc_0053FD88_64:
	vmla.f32	s2, s15, s17
.Lfunc_0053FD88_68:
	vldr	s17, [r1, #28]
.Lfunc_0053FD88_6c:
	vmla.f32	s3, s13, s16
.Lfunc_0053FD88_70:
	vmla.f32	s4, s14, s16
.Lfunc_0053FD88_74:
	vmla.f32	s5, s15, s16
.Lfunc_0053FD88_78:
	vldr	s16, [r1, #8]
.Lfunc_0053FD88_7c:
	vmla.f32	s6, s13, s17
.Lfunc_0053FD88_80:
	vmla.f32	s7, s14, s17
.Lfunc_0053FD88_84:
	vmla.f32	s8, s15, s17
.Lfunc_0053FD88_88:
	vldr	s17, [r1, #20]
.Lfunc_0053FD88_8c:
	vmla.f32	s0, s10, s16
.Lfunc_0053FD88_90:
	vmla.f32	s1, s11, s16
.Lfunc_0053FD88_94:
	vmla.f32	s2, s12, s16
.Lfunc_0053FD88_98:
	vldr	s16, [r1, #32]
.Lfunc_0053FD88_9c:
	vmla.f32	s3, s10, s17
.Lfunc_0053FD88_a0:
	vmla.f32	s4, s11, s17
.Lfunc_0053FD88_a4:
	vmla.f32	s5, s12, s17
.Lfunc_0053FD88_a8:
	vmla.f32	s6, s10, s16
.Lfunc_0053FD88_ac:
	vmla.f32	s7, s11, s16
.Lfunc_0053FD88_b0:
	vmla.f32	s8, s12, s16
.Lfunc_0053FD88_b4:
	vpop	{d8}
.Lfunc_0053FD88_b8:
	vstmia	r0, {s0-s8}
.Lfunc_0053FD88_bc:
	bx	lr
.Lfunc_0053FD88_c0:
	vpush	{d8-d13}
.Lfunc_0053FD88_c4:
	vldmia	r2, {s9-s11}
.Lfunc_0053FD88_c8:
	vldmia	r1, {s18-s20}
.Lfunc_0053FD88_cc:
	add	r1, r1, r3
.Lfunc_0053FD88_d0:
	add	r2, r2, r3
.Lfunc_0053FD88_d4:
	vldmia	r2, {s12-s14}
.Lfunc_0053FD88_d8:
	vldmia	r1, {s21-s23}
.Lfunc_0053FD88_dc:
	add	r1, r1, r3
.Lfunc_0053FD88_e0:
	add	r2, r2, r3
.Lfunc_0053FD88_e4:
	vldmia	r2, {s15-s17}
.Lfunc_0053FD88_e8:
	vldmia	r1, {s24-s26}
.Lfunc_0053FD88_ec:
	vmul.f32	s0, s9, s18
.Lfunc_0053FD88_f0:
	vmul.f32	s1, s10, s18
.Lfunc_0053FD88_f4:
	vmul.f32	s2, s11, s18
.Lfunc_0053FD88_f8:
	vmul.f32	s3, s9, s21
.Lfunc_0053FD88_fc:
	vmul.f32	s4, s10, s21
.Lfunc_0053FD88_100:
	vmul.f32	s5, s11, s21
.Lfunc_0053FD88_104:
	vmul.f32	s6, s9, s24
.Lfunc_0053FD88_108:
	vmul.f32	s7, s10, s24
.Lfunc_0053FD88_10c:
	vmul.f32	s8, s11, s24
.Lfunc_0053FD88_110:
	vmla.f32	s0, s12, s19
.Lfunc_0053FD88_114:
	vmla.f32	s1, s13, s19
.Lfunc_0053FD88_118:
	vmla.f32	s2, s14, s19
.Lfunc_0053FD88_11c:
	vmla.f32	s3, s12, s22
.Lfunc_0053FD88_120:
	vmla.f32	s4, s13, s22
.Lfunc_0053FD88_124:
	vmla.f32	s5, s14, s22
.Lfunc_0053FD88_128:
	vmla.f32	s6, s12, s25
.Lfunc_0053FD88_12c:
	vmla.f32	s7, s13, s25
.Lfunc_0053FD88_130:
	vmla.f32	s8, s14, s25
.Lfunc_0053FD88_134:
	vmla.f32	s0, s15, s20
.Lfunc_0053FD88_138:
	vmla.f32	s1, s16, s20
.Lfunc_0053FD88_13c:
	vmla.f32	s2, s17, s20
.Lfunc_0053FD88_140:
	vmla.f32	s3, s15, s23
.Lfunc_0053FD88_144:
	vmla.f32	s4, s16, s23
.Lfunc_0053FD88_148:
	vmla.f32	s5, s17, s23
.Lfunc_0053FD88_14c:
	vmla.f32	s6, s15, s26
.Lfunc_0053FD88_150:
	vmla.f32	s7, s16, s26
.Lfunc_0053FD88_154:
	vmla.f32	s8, s17, s26
.Lfunc_0053FD88_158:
	vpop	{d8-d13}
.Lfunc_0053FD88_15c:
	add	r1, r0, r3
.Lfunc_0053FD88_160:
	add	r2, r1, r3
.Lfunc_0053FD88_164:
	vstmia	r0, {s0-s2}
.Lfunc_0053FD88_168:
	vstmia	r1, {s3-s5}
.Lfunc_0053FD88_16c:
	vstmia	r2, {s6-s8}
.Lfunc_0053FD88_170:
	bx	lr
.size func_0053FD88, .-func_0053FD88

.section .text.func_003ECA64,"ax",%progbits
.balign 4
.global func_003ECA64
.type func_003ECA64, %function
func_003ECA64:
.Lfunc_003ECA64_0:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_4:
	ldrb	ip, [r2, #44]
.Lfunc_003ECA64_8:
	ldrb	r3, [r2, #36]
.Lfunc_003ECA64_c:
	cmp	ip, #0
.Lfunc_003ECA64_10:
	beq	.Lfunc_003ECA64_104
.Lfunc_003ECA64_14:
	cmp	r3, #0
.Lfunc_003ECA64_18:
	cmpne	r3, #2
.Lfunc_003ECA64_1c:
	beq	.Lfunc_003ECA64_98
.Lfunc_003ECA64_20:
	ldr	r2, [r2, #24]
.Lfunc_003ECA64_24:
	str	r2, [r1, #8]
.Lfunc_003ECA64_28:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_2c:
	ldr	r2, [r2, #28]
.Lfunc_003ECA64_30:
	str	r2, [r1, #12]
.Lfunc_003ECA64_34:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_38:
	ldr	r2, [r2, #32]
.Lfunc_003ECA64_3c:
	str	r2, [r1, #16]
.Lfunc_003ECA64_40:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_44:
	ldr	r2, [r2, #20]
.Lfunc_003ECA64_48:
	str	r2, [r1, #20]
.Lfunc_003ECA64_4c:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_50:
	ldr	r2, [r2, #8]
.Lfunc_003ECA64_54:
	str	r2, [r1, #24]
.Lfunc_003ECA64_58:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_5c:
	ldr	r2, [r2, #12]
.Lfunc_003ECA64_60:
	str	r2, [r1, #28]
.Lfunc_003ECA64_64:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_68:
	ldr	r2, [r2, #16]
.Lfunc_003ECA64_6c:
	str	r2, [r1, #32]
.Lfunc_003ECA64_70:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_74:
	ldr	r2, [r2, #4]
.Lfunc_003ECA64_78:
	str	r2, [r1, #36]
.Lfunc_003ECA64_7c:
	ldr	r0, [r0, #572]
.Lfunc_003ECA64_80:
	ldrb	r0, [r0, #36]
.Lfunc_003ECA64_84:
	sub	r0, r0, #1
.Lfunc_003ECA64_88:
	add	r0, r0, r0, lsr #31
.Lfunc_003ECA64_8c:
	asr	r0, r0, #1
.Lfunc_003ECA64_90:
	str	r0, [r1, #40]
.Lfunc_003ECA64_94:
	bx	lr
.Lfunc_003ECA64_98:
	ldr	r2, [r2, #20]
.Lfunc_003ECA64_9c:
	str	r2, [r1, #8]
.Lfunc_003ECA64_a0:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_a4:
	ldr	r2, [r2, #32]
.Lfunc_003ECA64_a8:
	str	r2, [r1, #12]
.Lfunc_003ECA64_ac:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_b0:
	ldr	r2, [r2, #28]
.Lfunc_003ECA64_b4:
	str	r2, [r1, #16]
.Lfunc_003ECA64_b8:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_bc:
	ldr	r2, [r2, #24]
.Lfunc_003ECA64_c0:
	str	r2, [r1, #20]
.Lfunc_003ECA64_c4:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_c8:
	ldr	r2, [r2, #4]
.Lfunc_003ECA64_cc:
	str	r2, [r1, #24]
.Lfunc_003ECA64_d0:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_d4:
	ldr	r2, [r2, #16]
.Lfunc_003ECA64_d8:
	str	r2, [r1, #28]
.Lfunc_003ECA64_dc:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_e0:
	ldr	r2, [r2, #12]
.Lfunc_003ECA64_e4:
	str	r2, [r1, #32]
.Lfunc_003ECA64_e8:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_ec:
	ldr	r2, [r2, #8]
.Lfunc_003ECA64_f0:
	str	r2, [r1, #36]
.Lfunc_003ECA64_f4:
	ldr	r0, [r0, #572]
.Lfunc_003ECA64_f8:
	ldrb	r0, [r0, #36]
.Lfunc_003ECA64_fc:
	lsr	r0, r0, #1
.Lfunc_003ECA64_100:
	b	.Lfunc_003ECA64_90
.Lfunc_003ECA64_104:
	cmp	r3, #0
.Lfunc_003ECA64_108:
	beq	.Lfunc_003ECA64_13c
.Lfunc_003ECA64_10c:
	ldr	r2, [r2, #24]
.Lfunc_003ECA64_110:
	str	r2, [r1, #8]
.Lfunc_003ECA64_114:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_118:
	ldr	r2, [r2, #20]
.Lfunc_003ECA64_11c:
	str	r2, [r1, #12]
.Lfunc_003ECA64_120:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_124:
	ldr	r2, [r2, #8]
.Lfunc_003ECA64_128:
	str	r2, [r1, #24]
.Lfunc_003ECA64_12c:
	ldr	r0, [r0, #572]
.Lfunc_003ECA64_130:
	ldr	r0, [r0, #4]
.Lfunc_003ECA64_134:
	str	r0, [r1, #28]
.Lfunc_003ECA64_138:
	bx	lr
.Lfunc_003ECA64_13c:
	ldr	r2, [r2, #20]
.Lfunc_003ECA64_140:
	str	r2, [r1, #8]
.Lfunc_003ECA64_144:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_148:
	ldr	r2, [r2, #24]
.Lfunc_003ECA64_14c:
	str	r2, [r1, #12]
.Lfunc_003ECA64_150:
	ldr	r2, [r0, #572]
.Lfunc_003ECA64_154:
	ldr	r2, [r2, #4]
.Lfunc_003ECA64_158:
	str	r2, [r1, #24]
.Lfunc_003ECA64_15c:
	ldr	r0, [r0, #572]
.Lfunc_003ECA64_160:
	ldr	r0, [r0, #8]
.Lfunc_003ECA64_164:
	b	.Lfunc_003ECA64_134
.size func_003ECA64, .-func_003ECA64

.section .text.func_004BD1C4,"ax",%progbits
.balign 4
.global func_004BD1C4
.type func_004BD1C4, %function
func_004BD1C4:
.Lfunc_004BD1C4_0:
	push	{r4, r5, r6, r7, r8, lr}
.Lfunc_004BD1C4_4:
	mov	r5, #0
.Lfunc_004BD1C4_8:
	mov	r8, r5
.Lfunc_004BD1C4_c:
	mov	r6, r8
.Lfunc_004BD1C4_10:
	cmp	r1, #1
.Lfunc_004BD1C4_14:
	mov	r4, r2
.Lfunc_004BD1C4_18:
	mov	r7, r6
.Lfunc_004BD1C4_1c:
	beq	.Lfunc_004BD1C4_30
.Lfunc_004BD1C4_20:
	cmp	r1, #4
.Lfunc_004BD1C4_24:
	cmpne	r1, #8
.Lfunc_004BD1C4_28:
	beq	.Lfunc_004BD1C4_80
.Lfunc_004BD1C4_2c:
	b	.Lfunc_004BD1C4_130
.Lfunc_004BD1C4_30:
	ldr	r0, [r2, #4]
.Lfunc_004BD1C4_34:
	cmp	r0, #0
.Lfunc_004BD1C4_38:
	beq	.Lfunc_004BD1C4_130
.Lfunc_004BD1C4_3c:
	ldr	r1, [r0, #48]
.Lfunc_004BD1C4_40:
	tst	r1, #3
.Lfunc_004BD1C4_44:
	beq	.Lfunc_004BD1C4_130
.Lfunc_004BD1C4_48:
	ldr	r0, [r0, #52]
.Lfunc_004BD1C4_4c:
	ldrh	r1, [r0, #8]
.Lfunc_004BD1C4_50:
	ldrh	r0, [r0, #10]
.Lfunc_004BD1C4_54:
	vmov	s0, r1
.Lfunc_004BD1C4_58:
	vmov	s1, r0
.Lfunc_004BD1C4_5c:
	vcvt.f32.u32	s2, s0
.Lfunc_004BD1C4_60:
	vcvt.f32.u32	s0, s0
.Lfunc_004BD1C4_64:
	vmov	r8, s2
.Lfunc_004BD1C4_68:
	vmov	r5, s0
.Lfunc_004BD1C4_6c:
	vcvt.f32.u32	s2, s1
.Lfunc_004BD1C4_70:
	vcvt.f32.u32	s0, s1
.Lfunc_004BD1C4_74:
	vmov	r6, s2
.Lfunc_004BD1C4_78:
	vmov	r7, s0
.Lfunc_004BD1C4_7c:
	b	.Lfunc_004BD1C4_130
.Lfunc_004BD1C4_80:
	ldr	r0, [r4, #4]
.Lfunc_004BD1C4_84:
	cmp	r0, #0
.Lfunc_004BD1C4_88:
	beq	.Lfunc_004BD1C4_ac
.Lfunc_004BD1C4_8c:
	ldr	r1, [r0, #48]
.Lfunc_004BD1C4_90:
	tst	r1, #3
.Lfunc_004BD1C4_94:
	beq	.Lfunc_004BD1C4_ac
.Lfunc_004BD1C4_98:
	ldr	r0, [r0, #52]
.Lfunc_004BD1C4_9c:
	ldrh	r0, [r0, #10]
.Lfunc_004BD1C4_a0:
	vmov	s0, r0
.Lfunc_004BD1C4_a4:
	vcvt.f32.u32	s0, s0
.Lfunc_004BD1C4_a8:
	vmov	r6, s0
.Lfunc_004BD1C4_ac:
	ldr	r0, [r4, #12]
.Lfunc_004BD1C4_b0:
	cmp	r0, #0
.Lfunc_004BD1C4_b4:
	beq	.Lfunc_004BD1C4_d8
.Lfunc_004BD1C4_b8:
	ldr	r1, [r0, #48]
.Lfunc_004BD1C4_bc:
	tst	r1, #3
.Lfunc_004BD1C4_c0:
	beq	.Lfunc_004BD1C4_d8
.Lfunc_004BD1C4_c4:
	ldr	r0, [r0, #52]
.Lfunc_004BD1C4_c8:
	ldrh	r0, [r0, #8]
.Lfunc_004BD1C4_cc:
	vmov	s0, r0
.Lfunc_004BD1C4_d0:
	vcvt.f32.u32	s0, s0
.Lfunc_004BD1C4_d4:
	vmov	r5, s0
.Lfunc_004BD1C4_d8:
	ldr	r0, [r4, #28]
.Lfunc_004BD1C4_dc:
	cmp	r0, #0
.Lfunc_004BD1C4_e0:
	beq	.Lfunc_004BD1C4_104
.Lfunc_004BD1C4_e4:
	ldr	r1, [r0, #48]
.Lfunc_004BD1C4_e8:
	tst	r1, #3
.Lfunc_004BD1C4_ec:
	beq	.Lfunc_004BD1C4_104
.Lfunc_004BD1C4_f0:
	ldr	r0, [r0, #52]
.Lfunc_004BD1C4_f4:
	ldrh	r0, [r0, #10]
.Lfunc_004BD1C4_f8:
	vmov	s0, r0
.Lfunc_004BD1C4_fc:
	vcvt.f32.u32	s0, s0
.Lfunc_004BD1C4_100:
	vmov	r7, s0
.Lfunc_004BD1C4_104:
	ldr	r0, [r4, #20]
.Lfunc_004BD1C4_108:
	cmp	r0, #0
.Lfunc_004BD1C4_10c:
	beq	.Lfunc_004BD1C4_130
.Lfunc_004BD1C4_110:
	ldr	r1, [r0, #48]
.Lfunc_004BD1C4_114:
	tst	r1, #3
.Lfunc_004BD1C4_118:
	beq	.Lfunc_004BD1C4_130
.Lfunc_004BD1C4_11c:
	ldr	r0, [r0, #52]
.Lfunc_004BD1C4_120:
	ldrh	r0, [r0, #8]
.Lfunc_004BD1C4_124:
	vmov	s0, r0
.Lfunc_004BD1C4_128:
	vcvt.f32.u32	s0, s0
.Lfunc_004BD1C4_12c:
	vmov	r8, s0
.Lfunc_004BD1C4_130:
	vmov	s1, r5
.Lfunc_004BD1C4_134:
	vmov	s2, r6
.Lfunc_004BD1C4_138:
	vmov	s0, r8
.Lfunc_004BD1C4_13c:
	vmov	s3, r7
.Lfunc_004BD1C4_140:
	pop	{r4, r5, r6, r7, r8, pc}
.size func_004BD1C4, .-func_004BD1C4
```
