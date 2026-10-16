# Probe-verified ARM runtime/helper batch 61

## Scope and provenance

This clean-room specification covers six currently unmatched ARM-state, call-free helpers totaling 3,592 executable body bytes. Evidence was limited to the current unmatched report, neutral symbol inventory, bounded private-target control/data-flow inspection, and independently assembled exact-schedule probes. The selection excludes every earlier configured function plus duplicate batch 61 and IPC batch 57 reservations.

The six functions contain no calls, no external branches, no literal-pool loads, no adjacent data, and no opaque absolute addresses. One arithmetic helper derives a byte-table base from the program counter; that dependency is described symbolically below without reproducing the referenced table. Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16 matched all six complete bodies (3,592 bytes).

## Semantic summary

- `func_00195248` (712 bytes) performs a multiword reciprocal/refinement division step using split 16-bit products, repeated quotient estimation, subtract-with-carry correction, normalization, and rounding. Its seed is selected by the most-significant input byte from a body-relative byte table whose symbolic base is schedule label `.Lfunc_00195248_248`; the table contents remain outside this artifact.
- `func_00498E7C` (680 bytes) normalizes four signed 16-bit selector values by moving disabled sentinels to the end, scans bounded interval metadata, checks that every active selector is represented, applies wildcard or exact filter modes, and returns the first valid candidate index or negative one.
- `func_002FCAF0` (604 bytes) move-initializes a compound state object from four source descriptors. It transfers pointer/count/capacity triples and VFP-loaded scalar fields, clears transferred source ownership, establishes destination sentinels and enable bytes, derives end pointers, and zeroes three destination element ranges.
- `func_0039B50C` (564 bytes) traverses an outer collection and nested variable-length packed entries. For records matching the requested halfword identifier, it decodes packed continuation fields and conditionally sets or clears the caller-selected bit when the decoded entry identifier equals 688.
- `func_004BB234` (532 bytes) computes an aligned workspace-size plan from a descriptor and nested record array. It emits counts and byte requirements for six regions, including optional mode-specific storage and two per-record variable contributions.
- `func_001A5DE4` (500 bytes) updates two halfword windows and applies a ten-tap signed fixed-point filter. It uses saturating multiply-accumulate steps, rounded 16-bit scaling, and sequential output stores while preserving the caller's rolling-history buffer.

## Exact schedules

The following is the complete independently assembled artifact. Every function has a zero-byte adjacent-data schedule. Local labels may be renamed consistently. Preserve every mnemonic, operand, condition, memory mode, instruction order, and function boundary. The PC-derived lookup in `func_00195248` must remain instruction-relative; do not embed or infer the referenced byte table in this source.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00195248,"ax",%progbits
.balign 4
.global func_00195248
.type func_00195248, %function
func_00195248:
.Lfunc_00195248_0:
	bic	ip, r0, #-16777216
.Lfunc_00195248_4:
	eor	r0, r0, r3
.Lfunc_00195248_8:
	bic	r7, r3, #-16777216
.Lfunc_00195248_c:
	sub	r3, ip, r7
.Lfunc_00195248_10:
	add	r3, r3, #16128
.Lfunc_00195248_14:
	and	r0, r0, #-2147483648
.Lfunc_00195248_18:
	add	r3, r3, #255
.Lfunc_00195248_1c:
	push	{r7, r8, fp, lr}
.Lfunc_00195248_20:
	add	r6, pc, #544
.Lfunc_00195248_24:
	push	{r0, r3}
.Lfunc_00195248_28:
	lsr	r3, r4, #16
.Lfunc_00195248_2c:
	lsr	fp, r5, #16
.Lfunc_00195248_30:
	ldrb	r6, [r6, r3, lsr #8]
.Lfunc_00195248_34:
	bic	lr, r5, fp, lsl #16
.Lfunc_00195248_38:
	bic	r8, r4, r3, lsl #16
.Lfunc_00195248_3c:
	lsrs	r1, r1, #1
.Lfunc_00195248_40:
	mla	r7, r3, r6, r6
.Lfunc_00195248_44:
	rrxs	r2, r2
.Lfunc_00195248_48:
	movcs	r0, #-2147483648
.Lfunc_00195248_4c:
	movcc	r0, #0
.Lfunc_00195248_50:
	rsb	r7, r7, #8388608
.Lfunc_00195248_54:
	mul	r6, r7, r6
.Lfunc_00195248_58:
	lsr	r7, r4, #13
.Lfunc_00195248_5c:
	lsr	r6, r6, #19
.Lfunc_00195248_60:
	add	r6, r6, #2
.Lfunc_00195248_64:
	mla	ip, r7, r6, r6
.Lfunc_00195248_68:
	rsb	ip, ip, #536870912
.Lfunc_00195248_6c:
	lsr	r7, ip, #16
.Lfunc_00195248_70:
	bic	ip, ip, r7, lsl #16
.Lfunc_00195248_74:
	mul	r4, r7, r6
.Lfunc_00195248_78:
	mul	r5, ip, r6
.Lfunc_00195248_7c:
	lsr	r7, r1, #15
.Lfunc_00195248_80:
	add	r6, r4, r5, lsr #16
.Lfunc_00195248_84:
	lsr	r6, r6, #6
.Lfunc_00195248_88:
	mul	ip, r6, r7
.Lfunc_00195248_8c:
	lsr	ip, ip, #16
.Lfunc_00195248_90:
	mul	r7, ip, fp
.Lfunc_00195248_94:
	lsl	r4, ip, #16
.Lfunc_00195248_98:
	subs	r2, r2, r7
.Lfunc_00195248_9c:
	mul	r7, r3, ip
.Lfunc_00195248_a0:
	sbc	r1, r1, r7
.Lfunc_00195248_a4:
	mul	r7, ip, lr
.Lfunc_00195248_a8:
	subs	r0, r0, r7, lsl #16
.Lfunc_00195248_ac:
	sbcs	r2, r2, r7, lsr #16
.Lfunc_00195248_b0:
	mul	r7, ip, r8
.Lfunc_00195248_b4:
	subcc	r2, r2, r7, lsl #16
.Lfunc_00195248_b8:
	subscs	r2, r2, r7, lsl #16
.Lfunc_00195248_bc:
	sbc	r1, r1, r7, lsr #16
.Lfunc_00195248_c0:
	lsr	r7, r1, #2
.Lfunc_00195248_c4:
	mul	ip, r6, r7
.Lfunc_00195248_c8:
	lsr	ip, ip, #16
.Lfunc_00195248_cc:
	mul	r7, ip, fp
.Lfunc_00195248_d0:
	subs	r0, r0, r7, lsl #19
.Lfunc_00195248_d4:
	sbcs	r2, r2, r7, lsr #13
.Lfunc_00195248_d8:
	mul	r7, r3, ip
.Lfunc_00195248_dc:
	subcc	r2, r2, r7, lsl #19
.Lfunc_00195248_e0:
	subscs	r2, r2, r7, lsl #19
.Lfunc_00195248_e4:
	sbc	r1, r1, r7, lsr #13
.Lfunc_00195248_e8:
	mul	r7, ip, lr
.Lfunc_00195248_ec:
	add	r4, r4, ip, lsl #3
.Lfunc_00195248_f0:
	subs	r0, r0, r7, lsl #3
.Lfunc_00195248_f4:
	sbcs	r2, r2, r7, lsr #29
.Lfunc_00195248_f8:
	mul	r7, ip, r8
.Lfunc_00195248_fc:
	subcc	r2, r2, r7, lsl #3
.Lfunc_00195248_100:
	subscs	r2, r2, r7, lsl #3
.Lfunc_00195248_104:
	sbc	r1, r1, r7, lsr #29
.Lfunc_00195248_108:
	ldr	r7, [sp, #12]
.Lfunc_00195248_10c:
	lsl	r1, r1, #26
.Lfunc_00195248_110:
	orr	r1, r1, r2, lsr #6
.Lfunc_00195248_114:
	lsl	r2, r2, #26
.Lfunc_00195248_118:
	lsr	r7, r1, #15
.Lfunc_00195248_11c:
	orr	r2, r2, r0, lsr #6
.Lfunc_00195248_120:
	mul	ip, r6, r7
.Lfunc_00195248_124:
	lsl	r0, r0, #26
.Lfunc_00195248_128:
	lsr	ip, ip, #16
.Lfunc_00195248_12c:
	mul	r7, ip, fp
.Lfunc_00195248_130:
	lsl	r5, ip, #22
.Lfunc_00195248_134:
	add	r4, r4, ip, lsr #10
.Lfunc_00195248_138:
	subs	r2, r2, r7
.Lfunc_00195248_13c:
	mul	r7, r3, ip
.Lfunc_00195248_140:
	sbc	r1, r1, r7
.Lfunc_00195248_144:
	mul	r7, ip, lr
.Lfunc_00195248_148:
	subs	r0, r0, r7, lsl #16
.Lfunc_00195248_14c:
	sbcs	r2, r2, r7, lsr #16
.Lfunc_00195248_150:
	mul	r7, ip, r8
.Lfunc_00195248_154:
	subcc	r2, r2, r7, lsl #16
.Lfunc_00195248_158:
	subscs	r2, r2, r7, lsl #16
.Lfunc_00195248_15c:
	sbc	r1, r1, r7, lsr #16
.Lfunc_00195248_160:
	lsr	r7, r1, #2
.Lfunc_00195248_164:
	mul	ip, r6, r7
.Lfunc_00195248_168:
	lsr	ip, ip, #16
.Lfunc_00195248_16c:
	mul	r7, ip, fp
.Lfunc_00195248_170:
	subs	r0, r0, r7, lsl #19
.Lfunc_00195248_174:
	sbcs	r2, r2, r7, lsr #13
.Lfunc_00195248_178:
	mul	r7, r3, ip
.Lfunc_00195248_17c:
	subcc	r2, r2, r7, lsl #19
.Lfunc_00195248_180:
	subscs	r2, r2, r7, lsl #19
.Lfunc_00195248_184:
	sbc	r1, r1, r7, lsr #13
.Lfunc_00195248_188:
	mul	r7, ip, lr
.Lfunc_00195248_18c:
	subs	r0, r0, r7, lsl #3
.Lfunc_00195248_190:
	sbcs	r2, r2, r7, lsr #29
.Lfunc_00195248_194:
	mul	r7, ip, r8
.Lfunc_00195248_198:
	subcc	r2, r2, r7, lsl #3
.Lfunc_00195248_19c:
	subscs	r2, r2, r7, lsl #3
.Lfunc_00195248_1a0:
	sbc	r1, r1, r7, lsr #29
.Lfunc_00195248_1a4:
	lsl	r1, r1, #26
.Lfunc_00195248_1a8:
	orr	r1, r1, r2, lsr #6
.Lfunc_00195248_1ac:
	adds	r5, r5, ip, lsl #9
.Lfunc_00195248_1b0:
	lsr	r7, r1, #15
.Lfunc_00195248_1b4:
	lsl	r2, r2, #26
.Lfunc_00195248_1b8:
	mul	ip, r6, r7
.Lfunc_00195248_1bc:
	orr	r2, r2, r0, lsr #6
.Lfunc_00195248_1c0:
	adc	r4, r4, #0
.Lfunc_00195248_1c4:
	lsl	r0, r0, #26
.Lfunc_00195248_1c8:
	lsr	ip, ip, #16
.Lfunc_00195248_1cc:
	mul	r7, ip, fp
.Lfunc_00195248_1d0:
	lsl	r6, ip, #28
.Lfunc_00195248_1d4:
	subs	r2, r2, r7
.Lfunc_00195248_1d8:
	mul	r7, r3, ip
.Lfunc_00195248_1dc:
	sbc	r1, r1, r7
.Lfunc_00195248_1e0:
	mul	r7, ip, lr
.Lfunc_00195248_1e4:
	subs	r0, r0, r7, lsl #16
.Lfunc_00195248_1e8:
	sbcs	r2, r2, r7, lsr #16
.Lfunc_00195248_1ec:
	mul	r7, ip, r8
.Lfunc_00195248_1f0:
	subcc	r2, r2, r7, lsl #16
.Lfunc_00195248_1f4:
	subscs	r2, r2, r7, lsl #16
.Lfunc_00195248_1f8:
	sbc	r1, r1, r7, lsr #16
.Lfunc_00195248_1fc:
	adds	r5, r5, ip, lsr #4
.Lfunc_00195248_200:
	lsl	r1, r1, #14
.Lfunc_00195248_204:
	orr	r1, r1, r2, lsr #18
.Lfunc_00195248_208:
	lsl	r2, r2, #14
.Lfunc_00195248_20c:
	orr	r2, r2, r0, lsr #18
.Lfunc_00195248_210:
	lsl	r0, r0, #14
.Lfunc_00195248_214:
	adc	r4, r4, #0
.Lfunc_00195248_218:
	orr	r3, r8, r3, lsl #16
.Lfunc_00195248_21c:
	orr	r8, lr, fp, lsl #16
.Lfunc_00195248_220:
	mov	lr, #0
.Lfunc_00195248_224:
	mov	fp, #0
.Lfunc_00195248_228:
	subs	ip, r2, r8
.Lfunc_00195248_22c:
	sbcs	r7, r1, r3
.Lfunc_00195248_230:
	adc	lr, lr, lr
.Lfunc_00195248_234:
	movcs	r2, ip
.Lfunc_00195248_238:
	movcs	r1, r7
.Lfunc_00195248_23c:
	adds	r0, r0, r0
.Lfunc_00195248_240:
	adcs	r2, r2, r2
.Lfunc_00195248_244:
	adcs	r1, r1, r1
.Lfunc_00195248_248:
	adc	fp, fp, fp
.Lfunc_00195248_24c:
	subs	ip, r2, r8
.Lfunc_00195248_250:
	sbcs	r7, r1, r3
.Lfunc_00195248_254:
	sbcs	fp, fp, #0
.Lfunc_00195248_258:
	mov	fp, #0
.Lfunc_00195248_25c:
	adc	lr, lr, lr
.Lfunc_00195248_260:
	movcs	r2, ip
.Lfunc_00195248_264:
	movcs	r1, r7
.Lfunc_00195248_268:
	adds	r0, r0, r0
.Lfunc_00195248_26c:
	adcs	r2, r2, r2
.Lfunc_00195248_270:
	adcs	r1, r1, r1
.Lfunc_00195248_274:
	adc	fp, fp, fp
.Lfunc_00195248_278:
	subs	ip, r2, r8
.Lfunc_00195248_27c:
	sbcs	r7, r1, r3
.Lfunc_00195248_280:
	sbcs	fp, fp, #0
.Lfunc_00195248_284:
	movcs	r2, ip
.Lfunc_00195248_288:
	movcs	r1, r7
.Lfunc_00195248_28c:
	adc	lr, lr, lr
.Lfunc_00195248_290:
	orrs	r7, r1, r2
.Lfunc_00195248_294:
	orrne	r6, r6, #1
.Lfunc_00195248_298:
	adds	r6, r6, lr, lsl #28
.Lfunc_00195248_29c:
	adcs	r2, r5, #0
.Lfunc_00195248_2a0:
	adcs	r1, r4, #0
.Lfunc_00195248_2a4:
	popmi	{r0, r3, r7, r8}
.Lfunc_00195248_2a8:
	popmi	{fp, pc}
.Lfunc_00195248_2ac:
	adds	r6, r6, r6
.Lfunc_00195248_2b0:
	pop	{r0, r3, r7, r8}
.Lfunc_00195248_2b4:
	adcs	r2, r2, r2
.Lfunc_00195248_2b8:
	pop	{fp, lr}
.Lfunc_00195248_2bc:
	adc	r1, r1, r1
.Lfunc_00195248_2c0:
	sub	r3, r3, #1
.Lfunc_00195248_2c4:
	bx	lr
.size func_00195248, .-func_00195248

.section .text.func_00498E7C,"ax",%progbits
.balign 4
.global func_00498E7C
.type func_00498E7C, %function
func_00498E7C:
.Lfunc_00498E7C_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_00498E7C_4:
	sub	sp, sp, #20
.Lfunc_00498E7C_8:
	mov	r7, r0
.Lfunc_00498E7C_c:
	mov	r8, sp
.Lfunc_00498E7C_10:
	ldr	r0, [sp, #56]
.Lfunc_00498E7C_14:
	strh	r1, [sp]
.Lfunc_00498E7C_18:
	strh	r3, [sp, #4]
.Lfunc_00498E7C_1c:
	mov	r1, #0
.Lfunc_00498E7C_20:
	strh	r2, [sp, #2]
.Lfunc_00498E7C_24:
	strh	r0, [sp, #6]
.Lfunc_00498E7C_28:
	add	ip, r8, r1, lsl #1
.Lfunc_00498E7C_2c:
	ldrsh	r3, [ip]
.Lfunc_00498E7C_30:
	cmn	r3, #1
.Lfunc_00498E7C_34:
	bne	.Lfunc_00498E7C_88
.Lfunc_00498E7C_38:
	add	r0, r1, #1
.Lfunc_00498E7C_3c:
	sxth	r0, r0
.Lfunc_00498E7C_40:
	cmp	r0, #4
.Lfunc_00498E7C_44:
	bge	.Lfunc_00498E7C_98
.Lfunc_00498E7C_48:
	add	r2, r8, r0, lsl #1
.Lfunc_00498E7C_4c:
	ldrsh	r2, [r2]
.Lfunc_00498E7C_50:
	cmn	r2, #1
.Lfunc_00498E7C_54:
	beq	.Lfunc_00498E7C_6c
.Lfunc_00498E7C_58:
	add	r0, r8, r0, lsl #1
.Lfunc_00498E7C_5c:
	ldrh	r2, [r0]
.Lfunc_00498E7C_60:
	strh	r2, [ip]
.Lfunc_00498E7C_64:
	strh	r3, [r0]
.Lfunc_00498E7C_68:
	b	.Lfunc_00498E7C_7c
.Lfunc_00498E7C_6c:
	add	r0, r0, #1
.Lfunc_00498E7C_70:
	sxth	r0, r0
.Lfunc_00498E7C_74:
	cmp	r0, #4
.Lfunc_00498E7C_78:
	blt	.Lfunc_00498E7C_48
.Lfunc_00498E7C_7c:
	ldrsh	r0, [ip]
.Lfunc_00498E7C_80:
	cmn	r0, #1
.Lfunc_00498E7C_84:
	beq	.Lfunc_00498E7C_98
.Lfunc_00498E7C_88:
	add	r0, r1, #1
.Lfunc_00498E7C_8c:
	sxth	r1, r0
.Lfunc_00498E7C_90:
	cmp	r1, #4
.Lfunc_00498E7C_94:
	blt	.Lfunc_00498E7C_28
.Lfunc_00498E7C_98:
	ldrsh	r0, [sp]
.Lfunc_00498E7C_9c:
	cmn	r0, #1
.Lfunc_00498E7C_a0:
	mvneq	r1, #0
.Lfunc_00498E7C_a4:
	streq	r1, [sp, #16]
.Lfunc_00498E7C_a8:
	beq	.Lfunc_00498E7C_29c
.Lfunc_00498E7C_ac:
	ldrsh	r1, [sp, #2]
.Lfunc_00498E7C_b0:
	mov	r9, #1
.Lfunc_00498E7C_b4:
	mov	r4, r9
.Lfunc_00498E7C_b8:
	cmn	r1, #1
.Lfunc_00498E7C_bc:
	beq	.Lfunc_00498E7C_e0
.Lfunc_00498E7C_c0:
	ldrsh	r1, [sp, #4]
.Lfunc_00498E7C_c4:
	mov	r4, #2
.Lfunc_00498E7C_c8:
	cmn	r1, #1
.Lfunc_00498E7C_cc:
	beq	.Lfunc_00498E7C_e0
.Lfunc_00498E7C_d0:
	ldrsh	r1, [sp, #6]
.Lfunc_00498E7C_d4:
	mov	r4, #3
.Lfunc_00498E7C_d8:
	cmn	r1, #1
.Lfunc_00498E7C_dc:
	movne	r4, #4
.Lfunc_00498E7C_e0:
	cmp	r4, #0
.Lfunc_00498E7C_e4:
	mvn	r1, #0
.Lfunc_00498E7C_e8:
	movgt	r5, #0
.Lfunc_00498E7C_ec:
	str	r1, [sp, #16]
.Lfunc_00498E7C_f0:
	ble	.Lfunc_00498E7C_29c
.Lfunc_00498E7C_f4:
	add	r0, r5, #7
.Lfunc_00498E7C_f8:
	mov	r2, #2
.Lfunc_00498E7C_fc:
	sxth	r6, r0
.Lfunc_00498E7C_100:
	sub	r0, r6, #7
.Lfunc_00498E7C_104:
	sxth	r1, r0
.Lfunc_00498E7C_108:
	ldr	r0, [r7, #40]
.Lfunc_00498E7C_10c:
	add	r2, r2, r1, lsl #1
.Lfunc_00498E7C_110:
	add	r3, r0, r1, lsl #1
.Lfunc_00498E7C_114:
	ldrh	r1, [r0, r2]
.Lfunc_00498E7C_118:
	ldrsh	r2, [r3]
.Lfunc_00498E7C_11c:
	sub	r1, r1, r2
.Lfunc_00498E7C_120:
	sxth	r1, r1
.Lfunc_00498E7C_124:
	cmp	r1, #2
.Lfunc_00498E7C_128:
	ble	.Lfunc_00498E7C_14c
.Lfunc_00498E7C_12c:
	sub	r1, r1, #2
.Lfunc_00498E7C_130:
	add	ip, r0, r2
.Lfunc_00498E7C_134:
	add	r1, r1, r1, lsr #31
.Lfunc_00498E7C_138:
	asr	r1, r1, #1
.Lfunc_00498E7C_13c:
	sxth	r3, r1
.Lfunc_00498E7C_140:
	add	r0, ip, r3, lsl #1
.Lfunc_00498E7C_144:
	ldrsb	fp, [r0]
.Lfunc_00498E7C_148:
	b	.Lfunc_00498E7C_170
.Lfunc_00498E7C_14c:
	cmp	r1, #0
.Lfunc_00498E7C_150:
	beq	.Lfunc_00498E7C_164
.Lfunc_00498E7C_154:
	mov	r2, #0
.Lfunc_00498E7C_158:
	mov	r1, r2
.Lfunc_00498E7C_15c:
	mov	r0, r2
.Lfunc_00498E7C_160:
	mov	r0, r0
.Lfunc_00498E7C_164:
	mov	r3, #0
.Lfunc_00498E7C_168:
	mvn	fp, #0
.Lfunc_00498E7C_16c:
	mov	ip, r3
.Lfunc_00498E7C_170:
	sxth	r0, r3
.Lfunc_00498E7C_174:
	cmp	r0, r4
.Lfunc_00498E7C_178:
	bne	.Lfunc_00498E7C_27c
.Lfunc_00498E7C_17c:
	cmp	r4, #0
.Lfunc_00498E7C_180:
	ble	.Lfunc_00498E7C_1b4
.Lfunc_00498E7C_184:
	tst	r4, #1
.Lfunc_00498E7C_188:
	add	r0, sp, #6
.Lfunc_00498E7C_18c:
	beq	.Lfunc_00498E7C_198
.Lfunc_00498E7C_190:
	mov	r1, #0
.Lfunc_00498E7C_194:
	strh	r1, [r0, #2]!
.Lfunc_00498E7C_198:
	asrs	r1, r4, #1
.Lfunc_00498E7C_19c:
	movne	r2, #0
.Lfunc_00498E7C_1a0:
	beq	.Lfunc_00498E7C_1b4
.Lfunc_00498E7C_1a4:
	strh	r2, [r0, #2]
.Lfunc_00498E7C_1a8:
	subs	r1, r1, #1
.Lfunc_00498E7C_1ac:
	strh	r2, [r0, #4]!
.Lfunc_00498E7C_1b0:
	bne	.Lfunc_00498E7C_1a4
.Lfunc_00498E7C_1b4:
	sxth	sl, r3
.Lfunc_00498E7C_1b8:
	cmp	sl, #0
.Lfunc_00498E7C_1bc:
	mov	r1, #0
.Lfunc_00498E7C_1c0:
	addgt	lr, sp, #8
.Lfunc_00498E7C_1c4:
	ble	.Lfunc_00498E7C_218
.Lfunc_00498E7C_1c8:
	add	r0, ip, r1, lsl #1
.Lfunc_00498E7C_1cc:
	cmp	r4, #0
.Lfunc_00498E7C_1d0:
	ldrsh	r2, [r0]
.Lfunc_00498E7C_1d4:
	mov	r0, #0
.Lfunc_00498E7C_1d8:
	ble	.Lfunc_00498E7C_208
.Lfunc_00498E7C_1dc:
	add	r3, r8, r0, lsl #1
.Lfunc_00498E7C_1e0:
	ldrsh	r3, [r3]
.Lfunc_00498E7C_1e4:
	cmp	r3, r2
.Lfunc_00498E7C_1e8:
	bne	.Lfunc_00498E7C_1f8
.Lfunc_00498E7C_1ec:
	add	r0, lr, r0, lsl #1
.Lfunc_00498E7C_1f0:
	strh	r9, [r0]
.Lfunc_00498E7C_1f4:
	b	.Lfunc_00498E7C_208
.Lfunc_00498E7C_1f8:
	add	r0, r0, #1
.Lfunc_00498E7C_1fc:
	sxth	r0, r0
.Lfunc_00498E7C_200:
	cmp	r4, r0
.Lfunc_00498E7C_204:
	bgt	.Lfunc_00498E7C_1dc
.Lfunc_00498E7C_208:
	add	r0, r1, #1
.Lfunc_00498E7C_20c:
	sxth	r1, r0
.Lfunc_00498E7C_210:
	cmp	sl, r1
.Lfunc_00498E7C_214:
	bgt	.Lfunc_00498E7C_1c8
.Lfunc_00498E7C_218:
	cmp	r4, #0
.Lfunc_00498E7C_21c:
	mov	r0, #0
.Lfunc_00498E7C_220:
	addgt	r1, sp, #8
.Lfunc_00498E7C_224:
	ble	.Lfunc_00498E7C_248
.Lfunc_00498E7C_228:
	add	r2, r1, r0, lsl #1
.Lfunc_00498E7C_22c:
	ldrh	r2, [r2]
.Lfunc_00498E7C_230:
	cmp	r2, #0
.Lfunc_00498E7C_234:
	beq	.Lfunc_00498E7C_27c
.Lfunc_00498E7C_238:
	add	r0, r0, #1
.Lfunc_00498E7C_23c:
	sxth	r0, r0
.Lfunc_00498E7C_240:
	cmp	r4, r0
.Lfunc_00498E7C_244:
	bgt	.Lfunc_00498E7C_228
.Lfunc_00498E7C_248:
	ldr	r0, [sp, #60]
.Lfunc_00498E7C_24c:
	cmn	r0, #2
.Lfunc_00498E7C_250:
	beq	.Lfunc_00498E7C_268
.Lfunc_00498E7C_254:
	cmn	r0, #3
.Lfunc_00498E7C_258:
	beq	.Lfunc_00498E7C_270
.Lfunc_00498E7C_25c:
	sxth	r1, fp
.Lfunc_00498E7C_260:
	cmp	r0, r1
.Lfunc_00498E7C_264:
	bne	.Lfunc_00498E7C_27c
.Lfunc_00498E7C_268:
	str	r6, [sp, #16]
.Lfunc_00498E7C_26c:
	b	.Lfunc_00498E7C_29c
.Lfunc_00498E7C_270:
	sxth	r0, fp
.Lfunc_00498E7C_274:
	cmn	r0, #1
.Lfunc_00498E7C_278:
	bne	.Lfunc_00498E7C_268
.Lfunc_00498E7C_27c:
	ldrb	r0, [r7, #4]
.Lfunc_00498E7C_280:
	add	r1, r5, #1
.Lfunc_00498E7C_284:
	cmp	r0, #0
.Lfunc_00498E7C_288:
	sxth	r5, r1
.Lfunc_00498E7C_28c:
	moveq	r0, #58
.Lfunc_00498E7C_290:
	movne	r0, #64
.Lfunc_00498E7C_294:
	cmp	r0, r5
.Lfunc_00498E7C_298:
	bgt	.Lfunc_00498E7C_f4
.Lfunc_00498E7C_29c:
	ldr	r0, [sp, #16]
.Lfunc_00498E7C_2a0:
	add	sp, sp, #20
.Lfunc_00498E7C_2a4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00498E7C, .-func_00498E7C

.section .text.func_002FCAF0,"ax",%progbits
.balign 4
.global func_002FCAF0
.type func_002FCAF0, %function
func_002FCAF0:
.Lfunc_002FCAF0_0:
	mov	r3, #0
.Lfunc_002FCAF0_4:
	str	r3, [r0]
.Lfunc_002FCAF0_8:
	str	r3, [r0, #4]
.Lfunc_002FCAF0_c:
	ldr	ip, [r1, #48]
.Lfunc_002FCAF0_10:
	str	ip, [r0, #8]
.Lfunc_002FCAF0_14:
	ldr	ip, [r1, #52]
.Lfunc_002FCAF0_18:
	str	ip, [r0, #12]
.Lfunc_002FCAF0_1c:
	ldr	ip, [r1, #56]
.Lfunc_002FCAF0_20:
	str	ip, [r0, #16]
.Lfunc_002FCAF0_24:
	ldr	ip, [r1, #60]
.Lfunc_002FCAF0_28:
	str	ip, [r0, #20]
.Lfunc_002FCAF0_2c:
	str	r3, [r1, #52]
.Lfunc_002FCAF0_30:
	str	r3, [r1, #56]
.Lfunc_002FCAF0_34:
	ldr	r2, [r1, #60]
.Lfunc_002FCAF0_38:
	add	ip, r0, #64
.Lfunc_002FCAF0_3c:
	and	r2, r2, #-1073741824
.Lfunc_002FCAF0_40:
	str	r2, [r1, #60]
.Lfunc_002FCAF0_44:
	add	r2, r0, #32
.Lfunc_002FCAF0_48:
	stm	r2, {r3, ip}
.Lfunc_002FCAF0_4c:
	str	ip, [r0, #40]
.Lfunc_002FCAF0_50:
	ldr	ip, [r0, #44]
.Lfunc_002FCAF0_54:
	str	r3, [r0, #96]
.Lfunc_002FCAF0_58:
	and	ip, ip, #-1073741824
.Lfunc_002FCAF0_5c:
	orr	ip, ip, #8
.Lfunc_002FCAF0_60:
	bic	ip, ip, #-1073741824
.Lfunc_002FCAF0_64:
	orr	ip, ip, #-2147483648
.Lfunc_002FCAF0_68:
	str	ip, [r0, #44]
.Lfunc_002FCAF0_6c:
	str	r3, [r0, #100]
.Lfunc_002FCAF0_70:
	ldr	ip, [r1]
.Lfunc_002FCAF0_74:
	str	ip, [r0, #104]
.Lfunc_002FCAF0_78:
	ldr	ip, [r1, #4]
.Lfunc_002FCAF0_7c:
	str	ip, [r0, #108]
.Lfunc_002FCAF0_80:
	ldr	ip, [r1, #8]
.Lfunc_002FCAF0_84:
	str	ip, [r0, #112]
.Lfunc_002FCAF0_88:
	ldr	ip, [r1, #12]
.Lfunc_002FCAF0_8c:
	str	ip, [r0, #116]
.Lfunc_002FCAF0_90:
	str	r3, [r1, #4]
.Lfunc_002FCAF0_94:
	str	r3, [r1, #8]
.Lfunc_002FCAF0_98:
	ldr	r2, [r1, #12]
.Lfunc_002FCAF0_9c:
	mvn	ip, #0
.Lfunc_002FCAF0_a0:
	and	r2, r2, #-1073741824
.Lfunc_002FCAF0_a4:
	str	r2, [r1, #12]
.Lfunc_002FCAF0_a8:
	str	ip, [r0, #120]
.Lfunc_002FCAF0_ac:
	vldr	s0, [r1, #16]
.Lfunc_002FCAF0_b0:
	vstr	s0, [r0, #124]
.Lfunc_002FCAF0_b4:
	vldr	s0, [r1, #20]
.Lfunc_002FCAF0_b8:
	vstr	s0, [r0, #128]
.Lfunc_002FCAF0_bc:
	vldr	s0, [r1, #24]
.Lfunc_002FCAF0_c0:
	vstr	s0, [r0, #132]
.Lfunc_002FCAF0_c4:
	vldr	s0, [r1, #28]
.Lfunc_002FCAF0_c8:
	vstr	s0, [r0, #136]
.Lfunc_002FCAF0_cc:
	str	r3, [r1, #20]
.Lfunc_002FCAF0_d0:
	str	r3, [r1, #24]
.Lfunc_002FCAF0_d4:
	ldr	r2, [r1, #28]
.Lfunc_002FCAF0_d8:
	and	r2, r2, #-1073741824
.Lfunc_002FCAF0_dc:
	str	r2, [r1, #28]
.Lfunc_002FCAF0_e0:
	vldr	s0, [r1, #32]
.Lfunc_002FCAF0_e4:
	vstr	s0, [r0, #140]
.Lfunc_002FCAF0_e8:
	vldr	s0, [r1, #36]
.Lfunc_002FCAF0_ec:
	vstr	s0, [r0, #144]
.Lfunc_002FCAF0_f0:
	vldr	s0, [r1, #40]
.Lfunc_002FCAF0_f4:
	vstr	s0, [r0, #148]
.Lfunc_002FCAF0_f8:
	vldr	s0, [r1, #44]
.Lfunc_002FCAF0_fc:
	vstr	s0, [r0, #152]
.Lfunc_002FCAF0_100:
	str	r3, [r1, #36]
.Lfunc_002FCAF0_104:
	str	r3, [r1, #40]
.Lfunc_002FCAF0_108:
	ldr	r2, [r1, #44]
.Lfunc_002FCAF0_10c:
	and	r2, r2, #-1073741824
.Lfunc_002FCAF0_110:
	str	r2, [r1, #44]
.Lfunc_002FCAF0_114:
	str	r3, [r0, #160]
.Lfunc_002FCAF0_118:
	str	ip, [r0, #156]
.Lfunc_002FCAF0_11c:
	mov	r1, #1
.Lfunc_002FCAF0_120:
	str	r3, [r0, #164]
.Lfunc_002FCAF0_124:
	strb	r1, [r0, #168]
.Lfunc_002FCAF0_128:
	strb	r1, [r0, #169]
.Lfunc_002FCAF0_12c:
	strb	r1, [r0, #170]
.Lfunc_002FCAF0_130:
	strb	r1, [r0, #171]
.Lfunc_002FCAF0_134:
	strb	r1, [r0, #172]
.Lfunc_002FCAF0_138:
	ldr	r1, [r0, #44]
.Lfunc_002FCAF0_13c:
	ldrd	r2, [r0, #36]
.Lfunc_002FCAF0_140:
	bic	r1, r1, #-1073741824
.Lfunc_002FCAF0_144:
	sub	r3, r3, r2
.Lfunc_002FCAF0_148:
	add	r1, r2, r1, lsl #2
.Lfunc_002FCAF0_14c:
	str	r1, [r0, #40]
.Lfunc_002FCAF0_150:
	ldr	r1, [r0, #20]
.Lfunc_002FCAF0_154:
	ldrd	r2, [r0, #12]
.Lfunc_002FCAF0_158:
	bic	r1, r1, #-1073741824
.Lfunc_002FCAF0_15c:
	sub	r3, r3, r2
.Lfunc_002FCAF0_160:
	add	r1, r2, r1, lsl #2
.Lfunc_002FCAF0_164:
	str	r1, [r0, #16]
.Lfunc_002FCAF0_168:
	ldr	r1, [r0, #116]
.Lfunc_002FCAF0_16c:
	bic	r2, r1, #-1073741824
.Lfunc_002FCAF0_170:
	add	r1, r0, #108
.Lfunc_002FCAF0_174:
	ldm	r1, {r1, r3}
.Lfunc_002FCAF0_178:
	mov	r3, #0
.Lfunc_002FCAF0_17c:
	add	r2, r1, r2, lsl #2
.Lfunc_002FCAF0_180:
	str	r2, [r0, #112]
.Lfunc_002FCAF0_184:
	sub	r2, r2, r1
.Lfunc_002FCAF0_188:
	asr	ip, r2, #2
.Lfunc_002FCAF0_18c:
	cmp	ip, #0
.Lfunc_002FCAF0_190:
	ble	.Lfunc_002FCAF0_1b8
.Lfunc_002FCAF0_194:
	lsl	ip, r2, #29
.Lfunc_002FCAF0_198:
	cmp	ip, #0
.Lfunc_002FCAF0_19c:
	strlt	r3, [r1], #4
.Lfunc_002FCAF0_1a0:
	asrs	r2, r2, #3
.Lfunc_002FCAF0_1a4:
	beq	.Lfunc_002FCAF0_1b8
.Lfunc_002FCAF0_1a8:
	str	r3, [r1], #4
.Lfunc_002FCAF0_1ac:
	subs	r2, r2, #1
.Lfunc_002FCAF0_1b0:
	str	r3, [r1], #4
.Lfunc_002FCAF0_1b4:
	bne	.Lfunc_002FCAF0_1a8
.Lfunc_002FCAF0_1b8:
	ldr	r1, [r0, #136]
.Lfunc_002FCAF0_1bc:
	bic	r2, r1, #-1073741824
.Lfunc_002FCAF0_1c0:
	add	r1, r0, #128
.Lfunc_002FCAF0_1c4:
	ldm	r1, {r1, r3}
.Lfunc_002FCAF0_1c8:
	mov	r3, #0
.Lfunc_002FCAF0_1cc:
	add	r2, r1, r2, lsl #2
.Lfunc_002FCAF0_1d0:
	str	r2, [r0, #132]
.Lfunc_002FCAF0_1d4:
	sub	r2, r2, r1
.Lfunc_002FCAF0_1d8:
	asr	ip, r2, #2
.Lfunc_002FCAF0_1dc:
	cmp	ip, #0
.Lfunc_002FCAF0_1e0:
	ble	.Lfunc_002FCAF0_208
.Lfunc_002FCAF0_1e4:
	lsl	ip, r2, #29
.Lfunc_002FCAF0_1e8:
	cmp	ip, #0
.Lfunc_002FCAF0_1ec:
	strlt	r3, [r1], #4
.Lfunc_002FCAF0_1f0:
	asrs	r2, r2, #3
.Lfunc_002FCAF0_1f4:
	beq	.Lfunc_002FCAF0_208
.Lfunc_002FCAF0_1f8:
	str	r3, [r1], #4
.Lfunc_002FCAF0_1fc:
	subs	r2, r2, #1
.Lfunc_002FCAF0_200:
	str	r3, [r1], #4
.Lfunc_002FCAF0_204:
	bne	.Lfunc_002FCAF0_1f8
.Lfunc_002FCAF0_208:
	ldr	r1, [r0, #152]
.Lfunc_002FCAF0_20c:
	bic	r2, r1, #-1073741824
.Lfunc_002FCAF0_210:
	add	r1, r0, #144
.Lfunc_002FCAF0_214:
	ldm	r1, {r1, r3}
.Lfunc_002FCAF0_218:
	mov	r3, #0
.Lfunc_002FCAF0_21c:
	add	r2, r1, r2, lsl #2
.Lfunc_002FCAF0_220:
	str	r2, [r0, #148]
.Lfunc_002FCAF0_224:
	sub	r2, r2, r1
.Lfunc_002FCAF0_228:
	asr	ip, r2, #2
.Lfunc_002FCAF0_22c:
	cmp	ip, #0
.Lfunc_002FCAF0_230:
	ble	.Lfunc_002FCAF0_258
.Lfunc_002FCAF0_234:
	lsl	ip, r2, #29
.Lfunc_002FCAF0_238:
	cmp	ip, #0
.Lfunc_002FCAF0_23c:
	strlt	r3, [r1], #4
.Lfunc_002FCAF0_240:
	asrs	r2, r2, #3
.Lfunc_002FCAF0_244:
	beq	.Lfunc_002FCAF0_258
.Lfunc_002FCAF0_248:
	str	r3, [r1], #4
.Lfunc_002FCAF0_24c:
	subs	r2, r2, #1
.Lfunc_002FCAF0_250:
	str	r3, [r1], #4
.Lfunc_002FCAF0_254:
	bne	.Lfunc_002FCAF0_248
.Lfunc_002FCAF0_258:
	bx	lr
.size func_002FCAF0, .-func_002FCAF0

.section .text.func_0039B50C,"ax",%progbits
.balign 4
.global func_0039B50C
.type func_0039B50C, %function
func_0039B50C:
.Lfunc_0039B50C_0:
	push	{r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_0039B50C_4:
	sub	sp, sp, #20
.Lfunc_0039B50C_8:
	ldr	r0, [r0, #40]
.Lfunc_0039B50C_c:
	add	r0, r0, #64
.Lfunc_0039B50C_10:
	str	r0, [sp, #4]
.Lfunc_0039B50C_14:
	ldr	r1, [r0, #4]
.Lfunc_0039B50C_18:
	mov	r0, #0
.Lfunc_0039B50C_1c:
	str	r0, [sp]
.Lfunc_0039B50C_20:
	cmp	r1, #0
.Lfunc_0039B50C_24:
	movhi	r0, #1
.Lfunc_0039B50C_28:
	lslhi	fp, r0, r2
.Lfunc_0039B50C_2c:
	bls	.Lfunc_0039B50C_22c
.Lfunc_0039B50C_30:
	ldr	r0, [sp]
.Lfunc_0039B50C_34:
	rsb	r1, r0, r0, lsl #3
.Lfunc_0039B50C_38:
	ldr	r0, [sp, #4]
.Lfunc_0039B50C_3c:
	ldr	r0, [r0]
.Lfunc_0039B50C_40:
	add	r0, r0, r1, lsl #3
.Lfunc_0039B50C_44:
	ldr	r1, [sp, #24]
.Lfunc_0039B50C_48:
	ldrh	r2, [r0]
.Lfunc_0039B50C_4c:
	cmp	r2, r1
.Lfunc_0039B50C_50:
	bne	.Lfunc_0039B50C_210
.Lfunc_0039B50C_54:
	ldr	r1, [r0, #20]
.Lfunc_0039B50C_58:
	mov	r8, #0
.Lfunc_0039B50C_5c:
	str	r1, [sp, #8]
.Lfunc_0039B50C_60:
	ldr	r0, [r0, #16]
.Lfunc_0039B50C_64:
	cmp	r1, #0
.Lfunc_0039B50C_68:
	str	r0, [sp, #16]
.Lfunc_0039B50C_6c:
	bls	.Lfunc_0039B50C_210
.Lfunc_0039B50C_70:
	add	r0, r8, r8, lsl #2
.Lfunc_0039B50C_74:
	add	r1, r0, r8, lsl #3
.Lfunc_0039B50C_78:
	ldr	r0, [sp, #16]
.Lfunc_0039B50C_7c:
	add	r1, r0, r1, lsl #2
.Lfunc_0039B50C_80:
	add	r1, r1, #44
.Lfunc_0039B50C_84:
	ldm	r1, {r4, r9}
.Lfunc_0039B50C_88:
	mov	r2, r4
.Lfunc_0039B50C_8c:
	add	ip, r4, r9, lsl #2
.Lfunc_0039B50C_90:
	cmp	r4, ip
.Lfunc_0039B50C_94:
	bne	.Lfunc_0039B50C_a0
.Lfunc_0039B50C_98:
	bic	r5, r7, #255
.Lfunc_0039B50C_9c:
	b	.Lfunc_0039B50C_128
.Lfunc_0039B50C_a0:
	mov	r0, r2
.Lfunc_0039B50C_a4:
	ldr	r2, [r4, #4]
.Lfunc_0039B50C_a8:
	lsr	sl, r7, #16
.Lfunc_0039B50C_ac:
	lsr	r6, r6, #16
.Lfunc_0039B50C_b0:
	lsl	sl, sl, #16
.Lfunc_0039B50C_b4:
	lsl	r5, r2, #12
.Lfunc_0039B50C_b8:
	lsl	r7, r2, #4
.Lfunc_0039B50C_bc:
	lsr	r5, r5, #28
.Lfunc_0039B50C_c0:
	orr	sl, sl, #1
.Lfunc_0039B50C_c4:
	lsl	r5, r5, #8
.Lfunc_0039B50C_c8:
	and	lr, r5, #65280
.Lfunc_0039B50C_cc:
	lsr	r7, r7, #24
.Lfunc_0039B50C_d0:
	orr	sl, sl, lr
.Lfunc_0039B50C_d4:
	uxth	r5, r2
.Lfunc_0039B50C_d8:
	lsl	lr, r7, #16
.Lfunc_0039B50C_dc:
	bic	sl, sl, #16711680
.Lfunc_0039B50C_e0:
	lsr	r2, r2, #31
.Lfunc_0039B50C_e4:
	and	lr, lr, #16711680
.Lfunc_0039B50C_e8:
	orr	lr, lr, sl
.Lfunc_0039B50C_ec:
	lsl	r6, r6, #16
.Lfunc_0039B50C_f0:
	lsl	sl, r2, #24
.Lfunc_0039B50C_f4:
	bic	r2, lr, #-16777216
.Lfunc_0039B50C_f8:
	orr	r6, r6, r5
.Lfunc_0039B50C_fc:
	add	r1, r4, #8
.Lfunc_0039B50C_100:
	orr	r5, r2, sl
.Lfunc_0039B50C_104:
	add	r2, r1, r7, lsl #2
.Lfunc_0039B50C_108:
	cmp	ip, r2
.Lfunc_0039B50C_10c:
	movls	r2, ip
.Lfunc_0039B50C_110:
	cmp	r2, ip
.Lfunc_0039B50C_114:
	beq	.Lfunc_0039B50C_128
.Lfunc_0039B50C_118:
	sub	ip, r2, r4
.Lfunc_0039B50C_11c:
	lsl	ip, ip, #29
.Lfunc_0039B50C_120:
	lsrs	ip, ip, #31
.Lfunc_0039B50C_124:
	addne	r2, r2, #4
.Lfunc_0039B50C_128:
	sxtb	ip, r5
.Lfunc_0039B50C_12c:
	cmp	ip, #0
.Lfunc_0039B50C_130:
	movne	sl, #1
.Lfunc_0039B50C_134:
	beq	.Lfunc_0039B50C_200
.Lfunc_0039B50C_138:
	uxth	ip, r6
.Lfunc_0039B50C_13c:
	cmp	ip, #688
.Lfunc_0039B50C_140:
	bne	.Lfunc_0039B50C_158
.Lfunc_0039B50C_144:
	ldr	ip, [r0]
.Lfunc_0039B50C_148:
	cmp	r3, #0
.Lfunc_0039B50C_14c:
	orrne	ip, ip, fp
.Lfunc_0039B50C_150:
	biceq	ip, ip, fp
.Lfunc_0039B50C_154:
	str	ip, [r0]
.Lfunc_0039B50C_158:
	add	r7, r4, r9, lsl #2
.Lfunc_0039B50C_15c:
	cmp	r2, r7
.Lfunc_0039B50C_160:
	bne	.Lfunc_0039B50C_16c
.Lfunc_0039B50C_164:
	bic	r5, r5, #255
.Lfunc_0039B50C_168:
	b	.Lfunc_0039B50C_1f4
.Lfunc_0039B50C_16c:
	mov	r0, r2
.Lfunc_0039B50C_170:
	ldr	ip, [r2, #4]!
.Lfunc_0039B50C_174:
	bic	r5, r5, #255
.Lfunc_0039B50C_178:
	lsr	r6, r6, #16
.Lfunc_0039B50C_17c:
	orr	lr, r5, sl
.Lfunc_0039B50C_180:
	uxth	r5, ip
.Lfunc_0039B50C_184:
	lsl	r6, r6, #16
.Lfunc_0039B50C_188:
	orr	r6, r6, r5
.Lfunc_0039B50C_18c:
	lsl	r5, ip, #12
.Lfunc_0039B50C_190:
	bic	lr, lr, #65280
.Lfunc_0039B50C_194:
	lsr	r5, r5, #28
.Lfunc_0039B50C_198:
	add	r2, r2, #4
.Lfunc_0039B50C_19c:
	lsl	r5, r5, #8
.Lfunc_0039B50C_1a0:
	and	r5, r5, #65280
.Lfunc_0039B50C_1a4:
	orr	r5, r5, lr
.Lfunc_0039B50C_1a8:
	lsl	lr, ip, #4
.Lfunc_0039B50C_1ac:
	lsrs	ip, ip, #31
.Lfunc_0039B50C_1b0:
	lsr	lr, lr, #24
.Lfunc_0039B50C_1b4:
	movne	ip, #1
.Lfunc_0039B50C_1b8:
	lsl	r1, lr, #16
.Lfunc_0039B50C_1bc:
	bic	r5, r5, #16711680
.Lfunc_0039B50C_1c0:
	and	r1, r1, #16711680
.Lfunc_0039B50C_1c4:
	add	r2, r2, lr, lsl #2
.Lfunc_0039B50C_1c8:
	cmp	r2, r7
.Lfunc_0039B50C_1cc:
	orr	r5, r5, r1
.Lfunc_0039B50C_1d0:
	bic	r5, r5, #-16777216
.Lfunc_0039B50C_1d4:
	movcs	r2, r7
.Lfunc_0039B50C_1d8:
	cmp	r2, r7
.Lfunc_0039B50C_1dc:
	orr	r5, r5, ip, lsl #24
.Lfunc_0039B50C_1e0:
	beq	.Lfunc_0039B50C_1f4
.Lfunc_0039B50C_1e4:
	sub	ip, r2, r4
.Lfunc_0039B50C_1e8:
	lsl	ip, ip, #29
.Lfunc_0039B50C_1ec:
	lsrs	ip, ip, #31
.Lfunc_0039B50C_1f0:
	addne	r2, r2, #4
.Lfunc_0039B50C_1f4:
	sxtb	ip, r5
.Lfunc_0039B50C_1f8:
	cmp	ip, #0
.Lfunc_0039B50C_1fc:
	bne	.Lfunc_0039B50C_138
.Lfunc_0039B50C_200:
	ldr	r0, [sp, #8]
.Lfunc_0039B50C_204:
	add	r8, r8, #1
.Lfunc_0039B50C_208:
	cmp	r0, r8
.Lfunc_0039B50C_20c:
	bhi	.Lfunc_0039B50C_70
.Lfunc_0039B50C_210:
	ldr	r0, [sp, #4]
.Lfunc_0039B50C_214:
	ldr	r1, [r0, #4]
.Lfunc_0039B50C_218:
	ldr	r0, [sp]
.Lfunc_0039B50C_21c:
	add	r0, r0, #1
.Lfunc_0039B50C_220:
	cmp	r1, r0
.Lfunc_0039B50C_224:
	str	r0, [sp]
.Lfunc_0039B50C_228:
	bhi	.Lfunc_0039B50C_30
.Lfunc_0039B50C_22c:
	add	sp, sp, #36
.Lfunc_0039B50C_230:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_0039B50C, .-func_0039B50C

.section .text.func_004BB234,"ax",%progbits
.balign 4
.global func_004BB234
.type func_004BB234, %function
func_004BB234:
.Lfunc_004BB234_0:
	mov	r3, #0
.Lfunc_004BB234_4:
	push	{r4, r5}
.Lfunc_004BB234_8:
	str	r3, [r1]
.Lfunc_004BB234_c:
	str	r3, [r1, #4]
.Lfunc_004BB234_10:
	str	r3, [r1, #8]
.Lfunc_004BB234_14:
	str	r3, [r1, #12]
.Lfunc_004BB234_18:
	str	r3, [r1, #16]
.Lfunc_004BB234_1c:
	str	r3, [r1, #20]
.Lfunc_004BB234_20:
	ldr	r3, [r2]
.Lfunc_004BB234_24:
	mov	r2, #18
.Lfunc_004BB234_28:
	rsb	r3, r3, r3, lsl #3
.Lfunc_004BB234_2c:
	add	r2, r2, r3, lsl #1
.Lfunc_004BB234_30:
	add	r2, r2, #17
.Lfunc_004BB234_34:
	bic	ip, r2, #3
.Lfunc_004BB234_38:
	ldrh	r2, [r0, #56]
.Lfunc_004BB234_3c:
	mov	r3, #340
.Lfunc_004BB234_40:
	mul	r3, r2, r3
.Lfunc_004BB234_44:
	add	r4, r3, #3
.Lfunc_004BB234_48:
	str	r4, [r1]
.Lfunc_004BB234_4c:
	strd	r2, [r1, #24]
.Lfunc_004BB234_50:
	ldrh	r3, [r0, #56]
.Lfunc_004BB234_54:
	lsl	r2, ip, #3
.Lfunc_004BB234_58:
	cmp	r3, #0
.Lfunc_004BB234_5c:
	cmpne	r2, #0
.Lfunc_004BB234_60:
	moveq	r3, #0
.Lfunc_004BB234_64:
	moveq	r2, r3
.Lfunc_004BB234_68:
	beq	.Lfunc_004BB234_80
.Lfunc_004BB234_6c:
	mul	r2, r2, r3
.Lfunc_004BB234_70:
	ldr	ip, [r1, #4]
.Lfunc_004BB234_74:
	add	ip, ip, r2
.Lfunc_004BB234_78:
	add	ip, ip, #15
.Lfunc_004BB234_7c:
	str	ip, [r1, #4]
.Lfunc_004BB234_80:
	str	r2, [r1, #36]
.Lfunc_004BB234_84:
	str	r3, [r1, #32]
.Lfunc_004BB234_88:
	ldrh	r2, [r0, #116]
.Lfunc_004BB234_8c:
	ldr	ip, [r1, #8]
.Lfunc_004BB234_90:
	lsl	r3, r2, #1
.Lfunc_004BB234_94:
	add	ip, ip, r3
.Lfunc_004BB234_98:
	add	ip, ip, #3
.Lfunc_004BB234_9c:
	str	ip, [r1, #8]
.Lfunc_004BB234_a0:
	strd	r2, [r1, #40]
.Lfunc_004BB234_a4:
	ldrh	r2, [r0, #116]
.Lfunc_004BB234_a8:
	lsl	r3, r2, #6
.Lfunc_004BB234_ac:
	add	ip, ip, r3
.Lfunc_004BB234_b0:
	add	ip, ip, #3
.Lfunc_004BB234_b4:
	str	ip, [r1, #8]
.Lfunc_004BB234_b8:
	strd	r2, [r1, #48]
.Lfunc_004BB234_bc:
	ldrh	r3, [r0, #116]
.Lfunc_004BB234_c0:
	add	r2, r3, r3, lsl #1
.Lfunc_004BB234_c4:
	lsl	r2, r2, #4
.Lfunc_004BB234_c8:
	add	ip, ip, r2
.Lfunc_004BB234_cc:
	str	r2, [r1, #60]
.Lfunc_004BB234_d0:
	add	ip, ip, #3
.Lfunc_004BB234_d4:
	str	r3, [r1, #56]
.Lfunc_004BB234_d8:
	str	ip, [r1, #8]
.Lfunc_004BB234_dc:
	ldrb	r2, [r0, #1]
.Lfunc_004BB234_e0:
	cmp	r2, #2
.Lfunc_004BB234_e4:
	bne	.Lfunc_004BB234_108
.Lfunc_004BB234_e8:
	ldrh	r3, [r0, #116]
.Lfunc_004BB234_ec:
	add	r2, r3, r3, lsl #1
.Lfunc_004BB234_f0:
	lsl	r2, r2, #2
.Lfunc_004BB234_f4:
	add	ip, ip, r2
.Lfunc_004BB234_f8:
	str	r2, [r1, #68]
.Lfunc_004BB234_fc:
	add	ip, ip, #3
.Lfunc_004BB234_100:
	str	r3, [r1, #64]
.Lfunc_004BB234_104:
	str	ip, [r1, #8]
.Lfunc_004BB234_108:
	ldr	r2, [r0, #128]
.Lfunc_004BB234_10c:
	add	r2, r2, #7
.Lfunc_004BB234_110:
	lsrs	r2, r2, #3
.Lfunc_004BB234_114:
	moveq	r2, #0
.Lfunc_004BB234_118:
	moveq	r3, r2
.Lfunc_004BB234_11c:
	beq	.Lfunc_004BB234_134
.Lfunc_004BB234_120:
	ldr	r3, [r1, #12]
.Lfunc_004BB234_124:
	add	r3, r3, r2
.Lfunc_004BB234_128:
	add	r3, r3, #3
.Lfunc_004BB234_12c:
	str	r3, [r1, #12]
.Lfunc_004BB234_130:
	mov	r3, r2
.Lfunc_004BB234_134:
	strd	r2, [r1, #72]
.Lfunc_004BB234_138:
	ldr	r2, [r0, #108]
.Lfunc_004BB234_13c:
	ldr	ip, [r1, #16]
.Lfunc_004BB234_140:
	lsl	r3, r2, #3
.Lfunc_004BB234_144:
	add	ip, ip, r3
.Lfunc_004BB234_148:
	add	ip, ip, #3
.Lfunc_004BB234_14c:
	str	ip, [r1, #16]
.Lfunc_004BB234_150:
	strd	r2, [r1, #80]
.Lfunc_004BB234_154:
	ldr	r3, [r0, #108]
.Lfunc_004BB234_158:
	mov	r2, #0
.Lfunc_004BB234_15c:
	cmp	r3, #0
.Lfunc_004BB234_160:
	bls	.Lfunc_004BB234_198
.Lfunc_004BB234_164:
	ldr	r3, [r0, #104]
.Lfunc_004BB234_168:
	rsb	r5, r2, r2, lsl #3
.Lfunc_004BB234_16c:
	ldr	r4, [r1, #16]
.Lfunc_004BB234_170:
	add	r3, r3, r5, lsl #2
.Lfunc_004BB234_174:
	add	r2, r2, #1
.Lfunc_004BB234_178:
	ldr	r3, [r3, #4]
.Lfunc_004BB234_17c:
	add	r3, r3, r3, lsl #1
.Lfunc_004BB234_180:
	add	r3, r4, r3, lsl #3
.Lfunc_004BB234_184:
	add	r3, r3, #3
.Lfunc_004BB234_188:
	str	r3, [r1, #16]
.Lfunc_004BB234_18c:
	ldr	r3, [r0, #108]
.Lfunc_004BB234_190:
	cmp	r3, r2
.Lfunc_004BB234_194:
	bhi	.Lfunc_004BB234_164
.Lfunc_004BB234_198:
	mov	r2, r3
.Lfunc_004BB234_19c:
	ldr	ip, [r1, #20]
.Lfunc_004BB234_1a0:
	add	r3, r3, r2, lsl #1
.Lfunc_004BB234_1a4:
	lsl	r3, r3, #2
.Lfunc_004BB234_1a8:
	add	ip, ip, r3
.Lfunc_004BB234_1ac:
	add	ip, ip, #3
.Lfunc_004BB234_1b0:
	str	ip, [r1, #20]
.Lfunc_004BB234_1b4:
	strd	r2, [r1, #88]
.Lfunc_004BB234_1b8:
	ldr	r3, [r0, #108]
.Lfunc_004BB234_1bc:
	mov	r2, #0
.Lfunc_004BB234_1c0:
	cmp	r3, #0
.Lfunc_004BB234_1c4:
	bls	.Lfunc_004BB234_20c
.Lfunc_004BB234_1c8:
	ldr	r3, [r0, #104]
.Lfunc_004BB234_1cc:
	rsb	ip, r2, r2, lsl #3
.Lfunc_004BB234_1d0:
	ldr	r4, [r1, #20]
.Lfunc_004BB234_1d4:
	add	r3, r3, ip, lsl #2
.Lfunc_004BB234_1d8:
	add	r2, r2, #1
.Lfunc_004BB234_1dc:
	ldr	r3, [r3, #20]
.Lfunc_004BB234_1e0:
	tst	r3, #1
.Lfunc_004BB234_1e4:
	lsl	ip, r3, #23
.Lfunc_004BB234_1e8:
	lsr	ip, ip, #24
.Lfunc_004BB234_1ec:
	addne	ip, ip, #1
.Lfunc_004BB234_1f0:
	lsl	ip, ip, #24
.Lfunc_004BB234_1f4:
	add	ip, r4, ip, lsr #21
.Lfunc_004BB234_1f8:
	add	ip, ip, #3
.Lfunc_004BB234_1fc:
	str	ip, [r1, #20]
.Lfunc_004BB234_200:
	ldr	r3, [r0, #108]
.Lfunc_004BB234_204:
	cmp	r3, r2
.Lfunc_004BB234_208:
	bhi	.Lfunc_004BB234_1c8
.Lfunc_004BB234_20c:
	pop	{r4, r5}
.Lfunc_004BB234_210:
	bx	lr
.size func_004BB234, .-func_004BB234

.section .text.func_001A5DE4,"ax",%progbits
.balign 4
.global func_001A5DE4
.type func_001A5DE4, %function
func_001A5DE4:
.Lfunc_001A5DE4_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_001A5DE4_4:
	sub	sp, sp, #340
.Lfunc_001A5DE4_8:
	mov	r7, sp
.Lfunc_001A5DE4_c:
	ldr	r5, [sp, #372]
.Lfunc_001A5DE4_10:
	sub	r9, r5, #1
.Lfunc_001A5DE4_14:
	cmp	r9, #0
.Lfunc_001A5DE4_18:
	ble	.Lfunc_001A5DE4_5c
.Lfunc_001A5DE4_1c:
	tst	r5, #1
.Lfunc_001A5DE4_20:
	sub	r4, r2, #2
.Lfunc_001A5DE4_24:
	sub	r6, r7, #2
.Lfunc_001A5DE4_28:
	bne	.Lfunc_001A5DE4_34
.Lfunc_001A5DE4_2c:
	ldrh	ip, [r4, #2]!
.Lfunc_001A5DE4_30:
	strh	ip, [r6, #2]!
.Lfunc_001A5DE4_34:
	asrs	ip, r9, #1
.Lfunc_001A5DE4_38:
	beq	.Lfunc_001A5DE4_54
.Lfunc_001A5DE4_3c:
	ldrh	r8, [r4, #2]
.Lfunc_001A5DE4_40:
	subs	ip, ip, #1
.Lfunc_001A5DE4_44:
	strh	r8, [r6, #2]
.Lfunc_001A5DE4_48:
	ldrh	r8, [r4, #4]!
.Lfunc_001A5DE4_4c:
	strh	r8, [r6, #4]!
.Lfunc_001A5DE4_50:
	bne	.Lfunc_001A5DE4_3c
.Lfunc_001A5DE4_54:
	add	ip, r7, r5, lsl #1
.Lfunc_001A5DE4_58:
	sub	r7, ip, #2
.Lfunc_001A5DE4_5c:
	sub	fp, r3, #1
.Lfunc_001A5DE4_60:
	cmp	fp, #0
.Lfunc_001A5DE4_64:
	ble	.Lfunc_001A5DE4_a4
.Lfunc_001A5DE4_68:
	tst	r3, #1
.Lfunc_001A5DE4_6c:
	sub	ip, r0, #2
.Lfunc_001A5DE4_70:
	sub	r4, r7, #2
.Lfunc_001A5DE4_74:
	bne	.Lfunc_001A5DE4_80
.Lfunc_001A5DE4_78:
	ldrh	r6, [ip, #2]!
.Lfunc_001A5DE4_7c:
	strh	r6, [r4, #2]!
.Lfunc_001A5DE4_80:
	ldrsh	r8, [ip, #2]
.Lfunc_001A5DE4_84:
	asrs	r6, fp, #1
.Lfunc_001A5DE4_88:
	beq	.Lfunc_001A5DE4_a4
.Lfunc_001A5DE4_8c:
	ldrh	sl, [ip, #4]!
.Lfunc_001A5DE4_90:
	strh	r8, [r4, #2]
.Lfunc_001A5DE4_94:
	ldrsh	r8, [ip, #2]
.Lfunc_001A5DE4_98:
	subs	r6, r6, #1
.Lfunc_001A5DE4_9c:
	strh	sl, [r4, #4]!
.Lfunc_001A5DE4_a0:
	bne	.Lfunc_001A5DE4_8c
.Lfunc_001A5DE4_a4:
	subs	ip, fp, #0
.Lfunc_001A5DE4_a8:
	blt	.Lfunc_001A5DE4_bc
.Lfunc_001A5DE4_ac:
	add	r4, r0, ip, lsl #1
.Lfunc_001A5DE4_b0:
	add	ip, r7, fp, lsl #1
.Lfunc_001A5DE4_b4:
	ldrh	r4, [r4]
.Lfunc_001A5DE4_b8:
	strh	r4, [ip]
.Lfunc_001A5DE4_bc:
	sub	ip, r3, r5
.Lfunc_001A5DE4_c0:
	cmp	r9, #0
.Lfunc_001A5DE4_c4:
	add	ip, r0, ip, lsl #1
.Lfunc_001A5DE4_c8:
	add	ip, ip, #2
.Lfunc_001A5DE4_cc:
	ble	.Lfunc_001A5DE4_108
.Lfunc_001A5DE4_d0:
	tst	r5, #1
.Lfunc_001A5DE4_d4:
	sub	ip, ip, #2
.Lfunc_001A5DE4_d8:
	sub	r2, r2, #2
.Lfunc_001A5DE4_dc:
	bne	.Lfunc_001A5DE4_e8
.Lfunc_001A5DE4_e0:
	ldrh	r4, [ip, #2]!
.Lfunc_001A5DE4_e4:
	strh	r4, [r2, #2]!
.Lfunc_001A5DE4_e8:
	asrs	r4, r9, #1
.Lfunc_001A5DE4_ec:
	beq	.Lfunc_001A5DE4_108
.Lfunc_001A5DE4_f0:
	ldrh	r6, [ip, #2]
.Lfunc_001A5DE4_f4:
	subs	r4, r4, #1
.Lfunc_001A5DE4_f8:
	strh	r6, [r2, #2]
.Lfunc_001A5DE4_fc:
	ldrh	r6, [ip, #4]!
.Lfunc_001A5DE4_100:
	strh	r6, [r2, #4]!
.Lfunc_001A5DE4_104:
	bne	.Lfunc_001A5DE4_f0
.Lfunc_001A5DE4_108:
	sxth	r4, fp
.Lfunc_001A5DE4_10c:
	cmp	r4, #0
.Lfunc_001A5DE4_110:
	movge	r6, sp
.Lfunc_001A5DE4_114:
	blt	.Lfunc_001A5DE4_1e8
.Lfunc_001A5DE4_118:
	sub	ip, r3, r4
.Lfunc_001A5DE4_11c:
	add	ip, ip, r5
.Lfunc_001A5DE4_120:
	ldrh	r2, [r1]
.Lfunc_001A5DE4_124:
	add	r7, r6, ip, lsl #1
.Lfunc_001A5DE4_128:
	ldrh	ip, [r1, #2]
.Lfunc_001A5DE4_12c:
	ldrh	r9, [r7, #-4]
.Lfunc_001A5DE4_130:
	ldrh	sl, [r7, #-6]
.Lfunc_001A5DE4_134:
	smulbb	r2, r9, r2
.Lfunc_001A5DE4_138:
	smulbb	ip, sl, ip
.Lfunc_001A5DE4_13c:
	ldrh	sl, [r1, #4]
.Lfunc_001A5DE4_140:
	lsl	r2, r2, #1
.Lfunc_001A5DE4_144:
	qdadd	r9, r2, ip
.Lfunc_001A5DE4_148:
	ldrh	r2, [r7, #-8]
.Lfunc_001A5DE4_14c:
	add	ip, r1, #6
.Lfunc_001A5DE4_150:
	smulbb	r2, r2, sl
.Lfunc_001A5DE4_154:
	qdadd	r8, r9, r2
.Lfunc_001A5DE4_158:
	ldrh	r2, [r7, #-10]
.Lfunc_001A5DE4_15c:
	ldrh	r9, [r1, #6]
.Lfunc_001A5DE4_160:
	smulbb	r2, r2, r9
.Lfunc_001A5DE4_164:
	ldrh	r9, [r1, #8]
.Lfunc_001A5DE4_168:
	qdadd	r8, r8, r2
.Lfunc_001A5DE4_16c:
	ldrh	r2, [r7, #-12]
.Lfunc_001A5DE4_170:
	smulbb	r2, r2, r9
.Lfunc_001A5DE4_174:
	ldrh	r9, [r1, #10]
.Lfunc_001A5DE4_178:
	qdadd	r8, r8, r2
.Lfunc_001A5DE4_17c:
	ldrh	r2, [r7, #-14]
.Lfunc_001A5DE4_180:
	smulbb	r2, r2, r9
.Lfunc_001A5DE4_184:
	ldrh	r9, [r1, #12]
.Lfunc_001A5DE4_188:
	qdadd	r8, r8, r2
.Lfunc_001A5DE4_18c:
	ldrh	r2, [r7, #-16]
.Lfunc_001A5DE4_190:
	smulbb	r2, r2, r9
.Lfunc_001A5DE4_194:
	ldrh	r9, [ip, #8]
.Lfunc_001A5DE4_198:
	qdadd	r8, r8, r2
.Lfunc_001A5DE4_19c:
	ldrh	r2, [r7, #-18]
.Lfunc_001A5DE4_1a0:
	smulbb	r2, r2, r9
.Lfunc_001A5DE4_1a4:
	ldrh	r9, [ip, #10]
.Lfunc_001A5DE4_1a8:
	ldrh	ip, [ip, #12]
.Lfunc_001A5DE4_1ac:
	qdadd	r8, r8, r2
.Lfunc_001A5DE4_1b0:
	ldrh	r2, [r7, #-20]
.Lfunc_001A5DE4_1b4:
	smulbb	r2, r2, r9
.Lfunc_001A5DE4_1b8:
	qdadd	r8, r8, r2
.Lfunc_001A5DE4_1bc:
	ldrh	r2, [r7, #-22]
.Lfunc_001A5DE4_1c0:
	smulbb	r2, r2, ip
.Lfunc_001A5DE4_1c4:
	qdadd	ip, r8, r2
.Lfunc_001A5DE4_1c8:
	mov	r2, #32768
.Lfunc_001A5DE4_1cc:
	qadd	r2, ip, r2
.Lfunc_001A5DE4_1d0:
	asr	r2, r2, #16
.Lfunc_001A5DE4_1d4:
	strh	r2, [r0], #2
.Lfunc_001A5DE4_1d8:
	sub	r2, r4, #1
.Lfunc_001A5DE4_1dc:
	sxth	r4, r2
.Lfunc_001A5DE4_1e0:
	cmp	r4, #0
.Lfunc_001A5DE4_1e4:
	bge	.Lfunc_001A5DE4_118
.Lfunc_001A5DE4_1e8:
	add	sp, sp, #340
.Lfunc_001A5DE4_1ec:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_001A5DE4_1f0:
	bx	lr
.size func_001A5DE4, .-func_001A5DE4
```

## Boundary, call, and relocation audit

- Function order and body sizes are: `func_00195248` 712, `func_00498E7C` 680, `func_002FCAF0` 604, `func_0039B50C` 564, `func_004BB234` 532, and `func_001A5DE4` 500 bytes.
- All six bodies are ARM-state and four-byte aligned.
- The call schedule is empty for every body. All direct branches resolve to labels within their owning function.
- No body emits a relocation. No adjacent bytes are owned by this batch.
- `func_00195248` computes its lookup base from PC at offset 32; the semantic base is `.Lfunc_00195248_248`. The lookup index is the upper byte of the split input limb. No table bytes are part of this specification.
- A full committed-config inventory found none of the six names previously configured. The batch is also disjoint from duplicate-61 reservations `func_005530BC` and `func_00558688`, and IPC-57 reservations `func_001686A0`, `func_001687D4`, `func_00168804`, `func_00168844`, and `func_00168958`.
