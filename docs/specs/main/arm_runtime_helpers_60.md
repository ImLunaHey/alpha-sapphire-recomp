# Probe-verified ARM runtime/helper batch 60

## Scope and provenance

This clean-room specification covers six currently unmatched ARM-state, call-free helpers totaling 3,496 executable body bytes. Evidence was limited to the current unmatched report, neutral symbol inventory, bounded private-target control/data-flow inspection, and independently assembled exact-schedule probes. The selection excludes every earlier configured function plus duplicate batch 60 and IPC batch 56 reservations.

The six functions contain no direct or indirect calls, no external branches, no PC-relative reads, no adjacent data, and no opaque addresses. Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16 matched all six complete bodies (3,496 bytes).

## Semantic summary

- `func_00190658` (560 bytes) conditionally advances two 160-element state channels. It copies input state, applies signed magnitude-scaled feedback and cross-channel deltas, updates five circular indices in 160-element steps, and returns without work when the enable byte at offset 260 is clear.
- `func_001955F0` (612 bytes) is a software floating-point multiply helper over two register-pair operands. It classifies zero significands, combines signs and biased exponents, performs split-halfword multi-precision products, normalizes and rounds the result, and returns the packed pair.
- `func_004D5C5C` (692 bytes) performs a two-stage lookup through a bounded collection of nested records. It first probes a 32-entry cache, then scans primary and fallback record lists, refreshes the selected cache entry modulo 32, and returns the matched nested record or zero.
- `func_003BB0E8` (560 bytes) decodes a bounded textual base-64-style stream. It skips control/space bytes, accepts upper- and lower-case letters, digits, either common symbol pair, and underscore compatibility, writes up to the caller-provided capacity, recognizes padding, and returns the produced byte count.
- `func_0015F800` (552 bytes) validates and expands a compact byte-stream format. It checks the four-byte header, decodes literal and back-reference commands with bounded input/output checks, supports overlapping back-reference copies, and returns distinct negative status values for header, truncation, range, and trailing-data failures.
- `func_001F8244` (520 bytes) computes and stores a packed workspace layout from a bounded descriptor array. It accumulates per-record command costs, secondary item counts, fixed marker slots, and pointer boundaries, then stores the resulting region pointers through offsets 152–200.

## Exact schedules

The following is the complete independently assembled artifact. Every function has a zero-byte adjacent-data schedule. Local labels may be renamed consistently. Preserve every mnemonic, operand, condition, memory mode, instruction order, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00190658,"ax",%progbits
.balign 4
.global func_00190658
.type func_00190658, %function
func_00190658:
.Lfunc_00190658_0:
	ldrb	r2, [r0, #260]
.Lfunc_00190658_4:
	cmp	r2, #0
.Lfunc_00190658_8:
	bxeq	lr
.Lfunc_00190658_c:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_00190658_10:
	sub	sp, sp, #76
.Lfunc_00190658_14:
	ldr	r2, [r1]
.Lfunc_00190658_18:
	str	r2, [sp, #40]
.Lfunc_00190658_1c:
	ldr	r2, [r1, #4]
.Lfunc_00190658_20:
	str	r2, [sp, #44]
.Lfunc_00190658_24:
	ldr	r2, [r1, #8]
.Lfunc_00190658_28:
	str	r2, [sp, #48]
.Lfunc_00190658_2c:
	ldr	r1, [r1, #12]
.Lfunc_00190658_30:
	str	r1, [sp, #52]
.Lfunc_00190658_34:
	mov	r1, #0
.Lfunc_00190658_38:
	str	r1, [sp, #60]
.Lfunc_00190658_3c:
	add	r1, r0, r1, lsl #2
.Lfunc_00190658_40:
	str	r1, [sp, #56]
.Lfunc_00190658_44:
	ldr	r2, [sp, #60]
.Lfunc_00190658_48:
	ldr	r8, [r0, #184]
.Lfunc_00190658_4c:
	ldr	r6, [r0, #200]
.Lfunc_00190658_50:
	ldr	r5, [r1, #124]
.Lfunc_00190658_54:
	add	r2, r0, r2, lsl #3
.Lfunc_00190658_58:
	ldr	fp, [r0, #160]
.Lfunc_00190658_5c:
	ldr	ip, [r2, #92]!
.Lfunc_00190658_60:
	add	r5, r5, r6, lsl #2
.Lfunc_00190658_64:
	ldr	r4, [r2, #4]
.Lfunc_00190658_68:
	ldr	r7, [r1, #60]
.Lfunc_00190658_6c:
	ldr	r9, [r0, #180]
.Lfunc_00190658_70:
	add	r4, r4, r8, lsl #2
.Lfunc_00190658_74:
	ldr	r8, [sp, #60]
.Lfunc_00190658_78:
	ldr	sl, [r0, #168]
.Lfunc_00190658_7c:
	add	r6, sp, #40
.Lfunc_00190658_80:
	ldr	r3, [r1, #76]
.Lfunc_00190658_84:
	ldr	r1, [r1, #208]
.Lfunc_00190658_88:
	ldr	r6, [r6, r8, lsl #2]
.Lfunc_00190658_8c:
	add	r2, r7, fp, lsl #2
.Lfunc_00190658_90:
	mov	r7, #0
.Lfunc_00190658_94:
	add	r3, r3, sl, lsl #2
.Lfunc_00190658_98:
	add	ip, ip, r9, lsl #2
.Lfunc_00190658_9c:
	ldr	r8, [r6]
.Lfunc_00190658_a0:
	ldr	fp, [r3]
.Lfunc_00190658_a4:
	add	r7, r7, #1
.Lfunc_00190658_a8:
	str	r8, [r3], #4
.Lfunc_00190658_ac:
	ldr	r9, [ip]
.Lfunc_00190658_b0:
	ldr	lr, [r0, #188]
.Lfunc_00190658_b4:
	cmp	r9, #0
.Lfunc_00190658_b8:
	rsblt	sl, r9, #0
.Lfunc_00190658_bc:
	movge	sl, r9
.Lfunc_00190658_c0:
	str	r9, [sp, #8]
.Lfunc_00190658_c4:
	mul	sl, sl, lr
.Lfunc_00190658_c8:
	asr	sl, sl, #7
.Lfunc_00190658_cc:
	rsblt	sl, sl, #0
.Lfunc_00190658_d0:
	add	sl, sl, fp
.Lfunc_00190658_d4:
	str	sl, [ip], #4
.Lfunc_00190658_d8:
	ldr	r9, [r4]
.Lfunc_00190658_dc:
	ldr	lr, [r0, #192]
.Lfunc_00190658_e0:
	cmp	r9, #0
.Lfunc_00190658_e4:
	rsblt	sl, r9, #0
.Lfunc_00190658_e8:
	movge	sl, r9
.Lfunc_00190658_ec:
	mul	sl, sl, lr
.Lfunc_00190658_f0:
	asr	sl, sl, #7
.Lfunc_00190658_f4:
	rsblt	sl, sl, #0
.Lfunc_00190658_f8:
	add	fp, fp, sl
.Lfunc_00190658_fc:
	ldr	sl, [sp, #8]
.Lfunc_00190658_100:
	str	fp, [r4], #4
.Lfunc_00190658_104:
	ldr	fp, [r0, #204]
.Lfunc_00190658_108:
	sub	lr, sl, r9
.Lfunc_00190658_10c:
	ldr	sl, [r5]
.Lfunc_00190658_110:
	cmp	sl, #0
.Lfunc_00190658_114:
	rsblt	r9, sl, #0
.Lfunc_00190658_118:
	movge	r9, sl
.Lfunc_00190658_11c:
	mul	r9, r9, fp
.Lfunc_00190658_120:
	asr	r9, r9, #7
.Lfunc_00190658_124:
	rsblt	r9, r9, #0
.Lfunc_00190658_128:
	add	r9, r9, lr
.Lfunc_00190658_12c:
	cmp	r9, #0
.Lfunc_00190658_130:
	str	r9, [r5], #4
.Lfunc_00190658_134:
	rsblt	r9, r9, #0
.Lfunc_00190658_138:
	mul	r9, r9, fp
.Lfunc_00190658_13c:
	asr	fp, r9, #7
.Lfunc_00190658_140:
	rsblt	fp, fp, #0
.Lfunc_00190658_144:
	ldr	r9, [r0, #232]
.Lfunc_00190658_148:
	sub	sl, sl, fp
.Lfunc_00190658_14c:
	str	sl, [sp, #8]
.Lfunc_00190658_150:
	ldr	fp, [r2]
.Lfunc_00190658_154:
	ldr	lr, [r0, #224]
.Lfunc_00190658_158:
	ldr	sl, [r0, #236]
.Lfunc_00190658_15c:
	str	r8, [r2], #4
.Lfunc_00190658_160:
	ldr	r8, [sp, #8]
.Lfunc_00190658_164:
	mul	fp, fp, lr
.Lfunc_00190658_168:
	cmp	r7, #160
.Lfunc_00190658_16c:
	mul	r9, r9, r8
.Lfunc_00190658_170:
	ldr	r8, [r0, #228]
.Lfunc_00190658_174:
	mla	r1, r1, sl, r9
.Lfunc_00190658_178:
	asr	r1, r1, #7
.Lfunc_00190658_17c:
	mla	r8, r8, r1, fp
.Lfunc_00190658_180:
	asr	r8, r8, #7
.Lfunc_00190658_184:
	str	r8, [r6], #4
.Lfunc_00190658_188:
	blt	.Lfunc_00190658_9c
.Lfunc_00190658_18c:
	ldr	r2, [sp, #60]
.Lfunc_00190658_190:
	add	r2, r2, #1
.Lfunc_00190658_194:
	str	r2, [sp, #60]
.Lfunc_00190658_198:
	ldr	r2, [sp, #56]
.Lfunc_00190658_19c:
	str	r1, [r2, #208]
.Lfunc_00190658_1a0:
	ldr	r1, [sp, #60]
.Lfunc_00190658_1a4:
	cmp	r1, #2
.Lfunc_00190658_1a8:
	blt	.Lfunc_00190658_3c
.Lfunc_00190658_1ac:
	ldr	r2, [r0, #160]
.Lfunc_00190658_1b0:
	ldr	r3, [r0, #156]
.Lfunc_00190658_1b4:
	mov	r1, #0
.Lfunc_00190658_1b8:
	add	r2, r2, #160
.Lfunc_00190658_1bc:
	cmp	r2, r3
.Lfunc_00190658_1c0:
	str	r2, [r0, #160]
.Lfunc_00190658_1c4:
	strge	r1, [r0, #160]
.Lfunc_00190658_1c8:
	ldr	r2, [r0, #168]
.Lfunc_00190658_1cc:
	ldr	r3, [r0, #164]
.Lfunc_00190658_1d0:
	add	r2, r2, #160
.Lfunc_00190658_1d4:
	cmp	r2, r3
.Lfunc_00190658_1d8:
	str	r2, [r0, #168]
.Lfunc_00190658_1dc:
	strge	r1, [r0, #168]
.Lfunc_00190658_1e0:
	ldr	r2, [r0, #180]
.Lfunc_00190658_1e4:
	ldr	r3, [r0, #172]
.Lfunc_00190658_1e8:
	add	r2, r2, #160
.Lfunc_00190658_1ec:
	cmp	r2, r3
.Lfunc_00190658_1f0:
	str	r2, [r0, #180]
.Lfunc_00190658_1f4:
	strge	r1, [r0, #180]
.Lfunc_00190658_1f8:
	ldr	r2, [r0, #184]
.Lfunc_00190658_1fc:
	ldr	r3, [r0, #176]
.Lfunc_00190658_200:
	add	r2, r2, #160
.Lfunc_00190658_204:
	cmp	r2, r3
.Lfunc_00190658_208:
	str	r2, [r0, #184]
.Lfunc_00190658_20c:
	strge	r1, [r0, #184]
.Lfunc_00190658_210:
	ldr	r2, [r0, #200]
.Lfunc_00190658_214:
	ldr	r3, [r0, #196]
.Lfunc_00190658_218:
	add	r2, r2, #160
.Lfunc_00190658_21c:
	cmp	r2, r3
.Lfunc_00190658_220:
	str	r2, [r0, #200]
.Lfunc_00190658_224:
	strge	r1, [r0, #200]
.Lfunc_00190658_228:
	add	sp, sp, #76
.Lfunc_00190658_22c:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00190658, . - func_00190658

.section .text.func_001955F0,"ax",%progbits
.balign 4
.global func_001955F0
.type func_001955F0, %function
func_001955F0:
.Lfunc_001955F0_0:
	bic	r7, r0, #-16777216
.Lfunc_001955F0_4:
	eor	r0, r0, r3
.Lfunc_001955F0_8:
	bic	ip, r3, #-16777216
.Lfunc_001955F0_c:
	add	r3, r7, ip
.Lfunc_001955F0_10:
	sub	r3, r3, #16128
.Lfunc_001955F0_14:
	and	r0, r0, #-2147483648
.Lfunc_001955F0_18:
	sub	r3, r3, #254
.Lfunc_001955F0_1c:
	teq	r2, #0
.Lfunc_001955F0_20:
	beq	.Lfunc_001955F0_19c
.Lfunc_001955F0_24:
	teq	r5, #0
.Lfunc_001955F0_28:
	beq	.Lfunc_001955F0_124
.Lfunc_001955F0_2c:
	push	{r0, r8, fp, lr}
.Lfunc_001955F0_30:
	lsr	r0, r1, #16
.Lfunc_001955F0_34:
	lsr	r6, r4, #16
.Lfunc_001955F0_38:
	bic	r8, r1, r0, lsl #16
.Lfunc_001955F0_3c:
	mul	ip, r0, r6
.Lfunc_001955F0_40:
	bic	r7, r4, r6, lsl #16
.Lfunc_001955F0_44:
	mul	r6, r8, r6
.Lfunc_001955F0_48:
	mul	r8, r7, r8
.Lfunc_001955F0_4c:
	mul	r7, r0, r7
.Lfunc_001955F0_50:
	adds	r8, r8, r6, lsl #16
.Lfunc_001955F0_54:
	adc	ip, ip, r6, lsr #16
.Lfunc_001955F0_58:
	lsr	fp, r2, #16
.Lfunc_001955F0_5c:
	adds	r8, r8, r7, lsl #16
.Lfunc_001955F0_60:
	lsr	r6, r5, #16
.Lfunc_001955F0_64:
	adc	r0, ip, r7, lsr #16
.Lfunc_001955F0_68:
	bic	lr, r2, fp, lsl #16
.Lfunc_001955F0_6c:
	mul	ip, fp, r6
.Lfunc_001955F0_70:
	bic	r7, r5, r6, lsl #16
.Lfunc_001955F0_74:
	mul	r6, lr, r6
.Lfunc_001955F0_78:
	mul	lr, r7, lr
.Lfunc_001955F0_7c:
	mul	r7, fp, r7
.Lfunc_001955F0_80:
	adds	lr, lr, r6, lsl #16
.Lfunc_001955F0_84:
	adc	ip, ip, r6, lsr #16
.Lfunc_001955F0_88:
	mov	r6, #0
.Lfunc_001955F0_8c:
	adds	lr, lr, r7, lsl #16
.Lfunc_001955F0_90:
	adc	fp, ip, r7, lsr #16
.Lfunc_001955F0_94:
	adds	r8, r8, fp
.Lfunc_001955F0_98:
	adc	r0, r0, #0
.Lfunc_001955F0_9c:
	adds	fp, r8, lr
.Lfunc_001955F0_a0:
	adcs	r8, r8, r0
.Lfunc_001955F0_a4:
	adc	r0, r0, #0
.Lfunc_001955F0_a8:
	subs	r7, r1, r2
.Lfunc_001955F0_ac:
	mov	r1, #0
.Lfunc_001955F0_b0:
	mvncc	r1, r1
.Lfunc_001955F0_b4:
	subcc	r6, r4, r5
.Lfunc_001955F0_b8:
	subsne	ip, r5, r4
.Lfunc_001955F0_bc:
	lsr	r4, r7, #16
.Lfunc_001955F0_c0:
	moveq	r1, #0
.Lfunc_001955F0_c4:
	subcc	r6, r6, r7
.Lfunc_001955F0_c8:
	bic	r5, r7, r4, lsl #16
.Lfunc_001955F0_cc:
	lsr	r7, ip, #16
.Lfunc_001955F0_d0:
	mvncc	r1, r1
.Lfunc_001955F0_d4:
	mla	r2, r4, r7, r6
.Lfunc_001955F0_d8:
	bic	ip, ip, r7, lsl #16
.Lfunc_001955F0_dc:
	mul	r7, r5, r7
.Lfunc_001955F0_e0:
	mul	r6, ip, r5
.Lfunc_001955F0_e4:
	mul	ip, r4, ip
.Lfunc_001955F0_e8:
	adds	r6, r6, r7, lsl #16
.Lfunc_001955F0_ec:
	adc	r2, r2, r7, lsr #16
.Lfunc_001955F0_f0:
	adds	r6, r6, ip, lsl #16
.Lfunc_001955F0_f4:
	adc	r2, r2, ip, lsr #16
.Lfunc_001955F0_f8:
	adds	r6, fp, r6
.Lfunc_001955F0_fc:
	orr	lr, lr, lr, lsl #2
.Lfunc_001955F0_100:
	adcs	r2, r8, r2
.Lfunc_001955F0_104:
	adcs	r1, r0, r1
.Lfunc_001955F0_108:
	orr	r6, r6, lr, lsr #2
.Lfunc_001955F0_10c:
	popmi	{r0, r8, fp, pc}
.Lfunc_001955F0_110:
	adds	r6, r6, r6
.Lfunc_001955F0_114:
	adcs	r2, r2, r2
.Lfunc_001955F0_118:
	adc	r1, r1, r1
.Lfunc_001955F0_11c:
	sub	r3, r3, #1
.Lfunc_001955F0_120:
	pop	{r0, r8, fp, pc}
.Lfunc_001955F0_124:
	lsr	r5, r4, #16
.Lfunc_001955F0_128:
	lsr	r7, r1, #16
.Lfunc_001955F0_12c:
	bic	r6, r4, r5, lsl #16
.Lfunc_001955F0_130:
	bic	ip, r1, r7, lsl #16
.Lfunc_001955F0_134:
	mul	r4, r5, r7
.Lfunc_001955F0_138:
	mul	r7, r6, r7
.Lfunc_001955F0_13c:
	mul	r1, ip, r6
.Lfunc_001955F0_140:
	mul	ip, r5, ip
.Lfunc_001955F0_144:
	adds	r1, r1, r7, lsl #16
.Lfunc_001955F0_148:
	adc	r4, r4, r7, lsr #16
.Lfunc_001955F0_14c:
	lsr	r7, r2, #16
.Lfunc_001955F0_150:
	adds	r1, r1, ip, lsl #16
.Lfunc_001955F0_154:
	adc	r4, r4, ip, lsr #16
.Lfunc_001955F0_158:
	bic	ip, r2, r7, lsl #16
.Lfunc_001955F0_15c:
	mul	r2, r5, r7
.Lfunc_001955F0_160:
	mul	r7, r6, r7
.Lfunc_001955F0_164:
	mul	r6, ip, r6
.Lfunc_001955F0_168:
	mul	ip, r5, ip
.Lfunc_001955F0_16c:
	adds	r6, r6, r7, lsl #16
.Lfunc_001955F0_170:
	adc	r2, r2, r7, lsr #16
.Lfunc_001955F0_174:
	adds	r6, r6, ip, lsl #16
.Lfunc_001955F0_178:
	adc	r5, r2, ip, lsr #16
.Lfunc_001955F0_17c:
	adds	r2, r5, r1
.Lfunc_001955F0_180:
	adcs	r1, r4, #0
.Lfunc_001955F0_184:
	bxmi	lr
.Lfunc_001955F0_188:
	adds	r6, r6, r6
.Lfunc_001955F0_18c:
	adcs	r2, r2, r2
.Lfunc_001955F0_190:
	adc	r1, r1, r1
.Lfunc_001955F0_194:
	sub	r3, r3, #1
.Lfunc_001955F0_198:
	bx	lr
.Lfunc_001955F0_19c:
	teq	r5, #0
.Lfunc_001955F0_1a0:
	beq	.Lfunc_001955F0_21c
.Lfunc_001955F0_1a4:
	lsr	r2, r1, #16
.Lfunc_001955F0_1a8:
	lsr	r7, r4, #16
.Lfunc_001955F0_1ac:
	bic	r6, r1, r2, lsl #16
.Lfunc_001955F0_1b0:
	bic	ip, r4, r7, lsl #16
.Lfunc_001955F0_1b4:
	mul	r1, r2, r7
.Lfunc_001955F0_1b8:
	mul	r7, r6, r7
.Lfunc_001955F0_1bc:
	mul	r4, ip, r6
.Lfunc_001955F0_1c0:
	mul	ip, r2, ip
.Lfunc_001955F0_1c4:
	adds	r4, r4, r7, lsl #16
.Lfunc_001955F0_1c8:
	adc	r1, r1, r7, lsr #16
.Lfunc_001955F0_1cc:
	lsr	r7, r5, #16
.Lfunc_001955F0_1d0:
	adds	r4, r4, ip, lsl #16
.Lfunc_001955F0_1d4:
	adc	r1, r1, ip, lsr #16
.Lfunc_001955F0_1d8:
	bic	ip, r5, r7, lsl #16
.Lfunc_001955F0_1dc:
	mul	r5, r2, r7
.Lfunc_001955F0_1e0:
	mul	r7, r6, r7
.Lfunc_001955F0_1e4:
	mul	r6, ip, r6
.Lfunc_001955F0_1e8:
	mul	ip, r2, ip
.Lfunc_001955F0_1ec:
	adds	r6, r6, r7, lsl #16
.Lfunc_001955F0_1f0:
	adc	r5, r5, r7, lsr #16
.Lfunc_001955F0_1f4:
	adds	r6, r6, ip, lsl #16
.Lfunc_001955F0_1f8:
	adc	r2, r5, ip, lsr #16
.Lfunc_001955F0_1fc:
	adds	r2, r2, r4
.Lfunc_001955F0_200:
	adcs	r1, r1, #0
.Lfunc_001955F0_204:
	bxmi	lr
.Lfunc_001955F0_208:
	adds	r6, r6, r6
.Lfunc_001955F0_20c:
	adcs	r2, r2, r2
.Lfunc_001955F0_210:
	adc	r1, r1, r1
.Lfunc_001955F0_214:
	sub	r3, r3, #1
.Lfunc_001955F0_218:
	bx	lr
.Lfunc_001955F0_21c:
	lsr	r5, r4, #16
.Lfunc_001955F0_220:
	lsr	r7, r1, #16
.Lfunc_001955F0_224:
	bic	r6, r4, r5, lsl #16
.Lfunc_001955F0_228:
	bic	ip, r1, r7, lsl #16
.Lfunc_001955F0_22c:
	mul	r1, r5, r7
.Lfunc_001955F0_230:
	mul	r7, r6, r7
.Lfunc_001955F0_234:
	mul	r2, ip, r6
.Lfunc_001955F0_238:
	mov	r6, #0
.Lfunc_001955F0_23c:
	mul	ip, r5, ip
.Lfunc_001955F0_240:
	adds	r2, r2, r7, lsl #16
.Lfunc_001955F0_244:
	adc	r1, r1, r7, lsr #16
.Lfunc_001955F0_248:
	adds	r2, r2, ip, lsl #16
.Lfunc_001955F0_24c:
	adcs	r1, r1, ip, lsr #16
.Lfunc_001955F0_250:
	bxmi	lr
.Lfunc_001955F0_254:
	adds	r2, r2, r2
.Lfunc_001955F0_258:
	adc	r1, r1, r1
.Lfunc_001955F0_25c:
	sub	r3, r3, #1
.Lfunc_001955F0_260:
	bx	lr
.size func_001955F0, . - func_001955F0

.section .text.func_004D5C5C,"ax",%progbits
.balign 4
.global func_004D5C5C
.type func_004D5C5C, %function
func_004D5C5C:
.Lfunc_004D5C5C_0:
	push	{r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_004D5C5C_4:
	mov	r5, r0
.Lfunc_004D5C5C_8:
	mov	r0, #0
.Lfunc_004D5C5C_c:
	mov	r8, r1
.Lfunc_004D5C5C_10:
	lsr	sl, r1, #16
.Lfunc_004D5C5C_14:
	mov	r3, sp
.Lfunc_004D5C5C_18:
	str	r0, [sp]
.Lfunc_004D5C5C_1c:
	add	r1, r5, r0, lsl #4
.Lfunc_004D5C5C_20:
	ldr	r2, [r1, #2064]
.Lfunc_004D5C5C_24:
	cmp	r2, #0
.Lfunc_004D5C5C_28:
	beq	.Lfunc_004D5C5C_44
.Lfunc_004D5C5C_2c:
	ldr	ip, [r1, #2068]
.Lfunc_004D5C5C_30:
	cmp	ip, r8
.Lfunc_004D5C5C_34:
	bne	.Lfunc_004D5C5C_44
.Lfunc_004D5C5C_38:
	ldr	r1, [r1, #2072]
.Lfunc_004D5C5C_3c:
	cmp	r1, #4
.Lfunc_004D5C5C_40:
	beq	.Lfunc_004D5C5C_158
.Lfunc_004D5C5C_44:
	add	r0, r0, #1
.Lfunc_004D5C5C_48:
	cmp	r0, #32
.Lfunc_004D5C5C_4c:
	bcc	.Lfunc_004D5C5C_1c
.Lfunc_004D5C5C_50:
	ldr	r0, [sp]
.Lfunc_004D5C5C_54:
	cmp	r0, #0
.Lfunc_004D5C5C_58:
	bne	.Lfunc_004D5C5C_154
.Lfunc_004D5C5C_5c:
	ldr	r2, [r5, #4]
.Lfunc_004D5C5C_60:
	mov	fp, #4
.Lfunc_004D5C5C_64:
	mov	r0, #0
.Lfunc_004D5C5C_68:
	cmp	r2, #0
.Lfunc_004D5C5C_6c:
	ldrhi	r1, [r5, #8]
.Lfunc_004D5C5C_70:
	bls	.Lfunc_004D5C5C_198
.Lfunc_004D5C5C_74:
	add	r9, r0, r0, lsl #2
.Lfunc_004D5C5C_78:
	add	r6, fp, r9, lsl #2
.Lfunc_004D5C5C_7c:
	ldr	r3, [r1, r6]
.Lfunc_004D5C5C_80:
	cmp	r3, #0
.Lfunc_004D5C5C_84:
	beq	.Lfunc_004D5C5C_18c
.Lfunc_004D5C5C_88:
	ldr	r3, [r3]
.Lfunc_004D5C5C_8c:
	cmp	r3, sl
.Lfunc_004D5C5C_90:
	bne	.Lfunc_004D5C5C_18c
.Lfunc_004D5C5C_94:
	add	r0, r0, r0, lsl #2
.Lfunc_004D5C5C_98:
	mov	r4, #0
.Lfunc_004D5C5C_9c:
	add	r0, fp, r0, lsl #2
.Lfunc_004D5C5C_a0:
	ldr	r0, [r1, r0]
.Lfunc_004D5C5C_a4:
	ldrsh	r0, [r0, #16]
.Lfunc_004D5C5C_a8:
	cmp	r0, #0
.Lfunc_004D5C5C_ac:
	bls	.Lfunc_004D5C5C_198
.Lfunc_004D5C5C_b0:
	ldr	r0, [r5, #8]
.Lfunc_004D5C5C_b4:
	mov	r7, #0
.Lfunc_004D5C5C_b8:
	ldr	r0, [r0, r6]
.Lfunc_004D5C5C_bc:
	ldr	r1, [r0, #36]
.Lfunc_004D5C5C_c0:
	ldrsh	r2, [r0, #16]
.Lfunc_004D5C5C_c4:
	add	r1, r1, r0
.Lfunc_004D5C5C_c8:
	cmp	r2, r4
.Lfunc_004D5C5C_cc:
	ldrhi	r1, [r1, r4, lsl #2]
.Lfunc_004D5C5C_d0:
	addhi	r7, r1, r0
.Lfunc_004D5C5C_d4:
	bhi	.Lfunc_004D5C5C_e8
.Lfunc_004D5C5C_d8:
	mov	r2, #0
.Lfunc_004D5C5C_dc:
	mov	r1, r2
.Lfunc_004D5C5C_e0:
	mov	r0, r2
.Lfunc_004D5C5C_e4:
	mov	r0, r0
.Lfunc_004D5C5C_e8:
	str	r7, [sp]
.Lfunc_004D5C5C_ec:
	ldr	r0, [r7]
.Lfunc_004D5C5C_f0:
	cmp	r0, r8
.Lfunc_004D5C5C_f4:
	bne	.Lfunc_004D5C5C_170
.Lfunc_004D5C5C_f8:
	ldr	r0, [r5, #2576]
.Lfunc_004D5C5C_fc:
	ldr	r1, [r5, #8]
.Lfunc_004D5C5C_100:
	add	r2, r5, r0, lsl #4
.Lfunc_004D5C5C_104:
	add	r1, r1, r9, lsl #2
.Lfunc_004D5C5C_108:
	str	r1, [r2, #2064]
.Lfunc_004D5C5C_10c:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_110:
	mov	r0, r7
.Lfunc_004D5C5C_114:
	add	r1, r5, r1, lsl #4
.Lfunc_004D5C5C_118:
	str	r7, [r1, #2076]
.Lfunc_004D5C5C_11c:
	ldr	r2, [r5, #2576]
.Lfunc_004D5C5C_120:
	ldr	r1, [r7]
.Lfunc_004D5C5C_124:
	add	r2, r5, r2, lsl #4
.Lfunc_004D5C5C_128:
	str	r1, [r2, #2068]
.Lfunc_004D5C5C_12c:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_130:
	add	r1, r5, r1, lsl #4
.Lfunc_004D5C5C_134:
	str	fp, [r1, #2072]
.Lfunc_004D5C5C_138:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_13c:
	add	r1, r1, #1
.Lfunc_004D5C5C_140:
	asr	r2, r1, #31
.Lfunc_004D5C5C_144:
	add	r2, r1, r2, lsr #27
.Lfunc_004D5C5C_148:
	bic	r2, r2, #31
.Lfunc_004D5C5C_14c:
	sub	r1, r1, r2
.Lfunc_004D5C5C_150:
	str	r1, [r5, #2576]
.Lfunc_004D5C5C_154:
	pop	{r3, r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Lfunc_004D5C5C_158:
	cmp	r3, #0
.Lfunc_004D5C5C_15c:
	beq	.Lfunc_004D5C5C_50
.Lfunc_004D5C5C_160:
	add	r0, r5, r0, lsl #4
.Lfunc_004D5C5C_164:
	ldr	r0, [r0, #2076]
.Lfunc_004D5C5C_168:
	str	r0, [sp]
.Lfunc_004D5C5C_16c:
	b	.Lfunc_004D5C5C_50
.Lfunc_004D5C5C_170:
	ldr	r0, [r5, #8]
.Lfunc_004D5C5C_174:
	add	r4, r4, #1
.Lfunc_004D5C5C_178:
	ldr	r0, [r0, r6]
.Lfunc_004D5C5C_17c:
	ldrsh	r0, [r0, #16]
.Lfunc_004D5C5C_180:
	cmp	r0, r4
.Lfunc_004D5C5C_184:
	bhi	.Lfunc_004D5C5C_b0
.Lfunc_004D5C5C_188:
	b	.Lfunc_004D5C5C_198
.Lfunc_004D5C5C_18c:
	add	r0, r0, #1
.Lfunc_004D5C5C_190:
	cmp	r2, r0
.Lfunc_004D5C5C_194:
	bhi	.Lfunc_004D5C5C_74
.Lfunc_004D5C5C_198:
	ldr	r0, [r5, #4]
.Lfunc_004D5C5C_19c:
	mov	r9, #0
.Lfunc_004D5C5C_1a0:
	cmp	r0, #0
.Lfunc_004D5C5C_1a4:
	bls	.Lfunc_004D5C5C_2ac
.Lfunc_004D5C5C_1a8:
	ldr	r0, [r5, #8]
.Lfunc_004D5C5C_1ac:
	add	r1, r9, r9, lsl #2
.Lfunc_004D5C5C_1b0:
	add	r6, fp, r1, lsl #2
.Lfunc_004D5C5C_1b4:
	ldr	r0, [r0, r6]
.Lfunc_004D5C5C_1b8:
	cmp	r0, #0
.Lfunc_004D5C5C_1bc:
	ldrne	r1, [r0]
.Lfunc_004D5C5C_1c0:
	cmpne	r1, sl
.Lfunc_004D5C5C_1c4:
	beq	.Lfunc_004D5C5C_29c
.Lfunc_004D5C5C_1c8:
	ldrsh	r0, [r0, #16]
.Lfunc_004D5C5C_1cc:
	mov	r4, #0
.Lfunc_004D5C5C_1d0:
	cmp	r0, #0
.Lfunc_004D5C5C_1d4:
	bls	.Lfunc_004D5C5C_29c
.Lfunc_004D5C5C_1d8:
	ldr	r0, [r5, #8]
.Lfunc_004D5C5C_1dc:
	mov	r7, #0
.Lfunc_004D5C5C_1e0:
	ldr	r0, [r0, r6]
.Lfunc_004D5C5C_1e4:
	ldr	r1, [r0, #36]
.Lfunc_004D5C5C_1e8:
	ldrsh	r2, [r0, #16]
.Lfunc_004D5C5C_1ec:
	add	r1, r1, r0
.Lfunc_004D5C5C_1f0:
	cmp	r2, r4
.Lfunc_004D5C5C_1f4:
	ldrhi	r1, [r1, r4, lsl #2]
.Lfunc_004D5C5C_1f8:
	addhi	r7, r1, r0
.Lfunc_004D5C5C_1fc:
	bhi	.Lfunc_004D5C5C_210
.Lfunc_004D5C5C_200:
	mov	r2, #0
.Lfunc_004D5C5C_204:
	mov	r1, r2
.Lfunc_004D5C5C_208:
	mov	r0, r2
.Lfunc_004D5C5C_20c:
	mov	r0, r0
.Lfunc_004D5C5C_210:
	str	r7, [sp]
.Lfunc_004D5C5C_214:
	ldr	r0, [r7]
.Lfunc_004D5C5C_218:
	cmp	r0, r8
.Lfunc_004D5C5C_21c:
	bne	.Lfunc_004D5C5C_284
.Lfunc_004D5C5C_220:
	ldr	r2, [r5, #2576]
.Lfunc_004D5C5C_224:
	ldr	r1, [r5, #8]
.Lfunc_004D5C5C_228:
	add	r3, r9, r9, lsl #2
.Lfunc_004D5C5C_22c:
	mov	r0, r7
.Lfunc_004D5C5C_230:
	add	r2, r5, r2, lsl #4
.Lfunc_004D5C5C_234:
	add	r1, r1, r3, lsl #2
.Lfunc_004D5C5C_238:
	str	r1, [r2, #2064]
.Lfunc_004D5C5C_23c:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_240:
	add	r1, r5, r1, lsl #4
.Lfunc_004D5C5C_244:
	str	r7, [r1, #2076]
.Lfunc_004D5C5C_248:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_24c:
	ldr	r2, [r7]
.Lfunc_004D5C5C_250:
	add	r1, r5, r1, lsl #4
.Lfunc_004D5C5C_254:
	str	r2, [r1, #2068]
.Lfunc_004D5C5C_258:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_25c:
	add	r1, r5, r1, lsl #4
.Lfunc_004D5C5C_260:
	str	fp, [r1, #2072]
.Lfunc_004D5C5C_264:
	ldr	r1, [r5, #2576]
.Lfunc_004D5C5C_268:
	add	r1, r1, #1
.Lfunc_004D5C5C_26c:
	asr	r2, r1, #31
.Lfunc_004D5C5C_270:
	add	r2, r1, r2, lsr #27
.Lfunc_004D5C5C_274:
	bic	r2, r2, #31
.Lfunc_004D5C5C_278:
	sub	r1, r1, r2
.Lfunc_004D5C5C_27c:
	str	r1, [r5, #2576]
.Lfunc_004D5C5C_280:
	pop	{r3, r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Lfunc_004D5C5C_284:
	ldr	r0, [r5, #8]
.Lfunc_004D5C5C_288:
	add	r4, r4, #1
.Lfunc_004D5C5C_28c:
	ldr	r0, [r0, r6]
.Lfunc_004D5C5C_290:
	ldrsh	r0, [r0, #16]
.Lfunc_004D5C5C_294:
	cmp	r0, r4
.Lfunc_004D5C5C_298:
	bhi	.Lfunc_004D5C5C_1d8
.Lfunc_004D5C5C_29c:
	ldr	r0, [r5, #4]
.Lfunc_004D5C5C_2a0:
	add	r9, r9, #1
.Lfunc_004D5C5C_2a4:
	cmp	r0, r9
.Lfunc_004D5C5C_2a8:
	bhi	.Lfunc_004D5C5C_1a8
.Lfunc_004D5C5C_2ac:
	mov	r0, #0
.Lfunc_004D5C5C_2b0:
	pop	{r3, r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_004D5C5C, . - func_004D5C5C

.section .text.func_003BB0E8,"ax",%progbits
.balign 4
.global func_003BB0E8
.type func_003BB0E8, %function
func_003BB0E8:
.Lfunc_003BB0E8_0:
	push	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_003BB0E8_4:
	mov	ip, #0
.Lfunc_003BB0E8_8:
	cmp	r3, #0
.Lfunc_003BB0E8_c:
	mov	r4, ip
.Lfunc_003BB0E8_10:
	ldr	r6, [sp, #28]
.Lfunc_003BB0E8_14:
	ble	.Lfunc_003BB0E8_21c
.Lfunc_003BB0E8_18:
	ldrsb	r5, [r2]
.Lfunc_003BB0E8_1c:
	cmp	r5, #32
.Lfunc_003BB0E8_20:
	bge	.Lfunc_003BB0E8_50
.Lfunc_003BB0E8_24:
	add	r4, r4, #1
.Lfunc_003BB0E8_28:
	cmp	r4, r3
.Lfunc_003BB0E8_2c:
	add	r2, r2, #1
.Lfunc_003BB0E8_30:
	bge	.Lfunc_003BB0E8_21c
.Lfunc_003BB0E8_34:
	ldrsb	r5, [r2]
.Lfunc_003BB0E8_38:
	cmp	r5, #32
.Lfunc_003BB0E8_3c:
	bge	.Lfunc_003BB0E8_50
.Lfunc_003BB0E8_40:
	add	r4, r4, #1
.Lfunc_003BB0E8_44:
	cmp	r4, r3
.Lfunc_003BB0E8_48:
	add	r2, r2, #1
.Lfunc_003BB0E8_4c:
	bge	.Lfunc_003BB0E8_21c
.Lfunc_003BB0E8_50:
	add	r5, r4, #4
.Lfunc_003BB0E8_54:
	cmp	r3, r5
.Lfunc_003BB0E8_58:
	blt	.Lfunc_003BB0E8_1f8
.Lfunc_003BB0E8_5c:
	ldrsb	r5, [r2], #1
.Lfunc_003BB0E8_60:
	sub	r7, r5, #65
.Lfunc_003BB0E8_64:
	cmp	r7, #25
.Lfunc_003BB0E8_68:
	bls	.Lfunc_003BB0E8_ac
.Lfunc_003BB0E8_6c:
	sub	r7, r5, #97
.Lfunc_003BB0E8_70:
	cmp	r7, #25
.Lfunc_003BB0E8_74:
	subls	r7, r5, #71
.Lfunc_003BB0E8_78:
	bls	.Lfunc_003BB0E8_ac
.Lfunc_003BB0E8_7c:
	sub	r7, r5, #48
.Lfunc_003BB0E8_80:
	cmp	r7, #9
.Lfunc_003BB0E8_84:
	addls	r7, r5, #4
.Lfunc_003BB0E8_88:
	bls	.Lfunc_003BB0E8_ac
.Lfunc_003BB0E8_8c:
	cmp	r5, #43
.Lfunc_003BB0E8_90:
	cmpne	r5, #45
.Lfunc_003BB0E8_94:
	moveq	r7, #62
.Lfunc_003BB0E8_98:
	beq	.Lfunc_003BB0E8_ac
.Lfunc_003BB0E8_9c:
	cmp	r5, #47
.Lfunc_003BB0E8_a0:
	cmpne	r5, #95
.Lfunc_003BB0E8_a4:
	moveq	r7, #63
.Lfunc_003BB0E8_a8:
	movne	r7, #64
.Lfunc_003BB0E8_ac:
	ldrsb	r5, [r2], #1
.Lfunc_003BB0E8_b0:
	and	r8, r7, #63
.Lfunc_003BB0E8_b4:
	sub	r7, r5, #65
.Lfunc_003BB0E8_b8:
	cmp	r7, #25
.Lfunc_003BB0E8_bc:
	bls	.Lfunc_003BB0E8_100
.Lfunc_003BB0E8_c0:
	sub	r7, r5, #97
.Lfunc_003BB0E8_c4:
	cmp	r7, #25
.Lfunc_003BB0E8_c8:
	subls	r7, r5, #71
.Lfunc_003BB0E8_cc:
	bls	.Lfunc_003BB0E8_100
.Lfunc_003BB0E8_d0:
	sub	r7, r5, #48
.Lfunc_003BB0E8_d4:
	cmp	r7, #9
.Lfunc_003BB0E8_d8:
	addls	r7, r5, #4
.Lfunc_003BB0E8_dc:
	bls	.Lfunc_003BB0E8_100
.Lfunc_003BB0E8_e0:
	cmp	r5, #43
.Lfunc_003BB0E8_e4:
	cmpne	r5, #45
.Lfunc_003BB0E8_e8:
	moveq	r7, #62
.Lfunc_003BB0E8_ec:
	beq	.Lfunc_003BB0E8_100
.Lfunc_003BB0E8_f0:
	cmp	r5, #47
.Lfunc_003BB0E8_f4:
	cmpne	r5, #95
.Lfunc_003BB0E8_f8:
	moveq	r7, #63
.Lfunc_003BB0E8_fc:
	movne	r7, #64
.Lfunc_003BB0E8_100:
	ldrsb	r5, [r2], #1
.Lfunc_003BB0E8_104:
	and	r9, r7, #63
.Lfunc_003BB0E8_108:
	sub	r7, r5, #65
.Lfunc_003BB0E8_10c:
	cmp	r7, #25
.Lfunc_003BB0E8_110:
	bls	.Lfunc_003BB0E8_154
.Lfunc_003BB0E8_114:
	sub	r7, r5, #97
.Lfunc_003BB0E8_118:
	cmp	r7, #25
.Lfunc_003BB0E8_11c:
	subls	r7, r5, #71
.Lfunc_003BB0E8_120:
	bls	.Lfunc_003BB0E8_154
.Lfunc_003BB0E8_124:
	sub	r7, r5, #48
.Lfunc_003BB0E8_128:
	cmp	r7, #9
.Lfunc_003BB0E8_12c:
	addls	r7, r5, #4
.Lfunc_003BB0E8_130:
	bls	.Lfunc_003BB0E8_154
.Lfunc_003BB0E8_134:
	cmp	r5, #43
.Lfunc_003BB0E8_138:
	cmpne	r5, #45
.Lfunc_003BB0E8_13c:
	moveq	r7, #62
.Lfunc_003BB0E8_140:
	beq	.Lfunc_003BB0E8_154
.Lfunc_003BB0E8_144:
	cmp	r5, #47
.Lfunc_003BB0E8_148:
	cmpne	r5, #95
.Lfunc_003BB0E8_14c:
	moveq	r7, #63
.Lfunc_003BB0E8_150:
	movne	r7, #64
.Lfunc_003BB0E8_154:
	ldrsb	r5, [r2], #1
.Lfunc_003BB0E8_158:
	and	r7, r7, #127
.Lfunc_003BB0E8_15c:
	sub	sl, r5, #65
.Lfunc_003BB0E8_160:
	cmp	sl, #25
.Lfunc_003BB0E8_164:
	subls	r5, r5, #65
.Lfunc_003BB0E8_168:
	bls	.Lfunc_003BB0E8_1ac
.Lfunc_003BB0E8_16c:
	sub	sl, r5, #97
.Lfunc_003BB0E8_170:
	cmp	sl, #25
.Lfunc_003BB0E8_174:
	subls	r5, r5, #71
.Lfunc_003BB0E8_178:
	bls	.Lfunc_003BB0E8_1ac
.Lfunc_003BB0E8_17c:
	sub	sl, r5, #48
.Lfunc_003BB0E8_180:
	cmp	sl, #9
.Lfunc_003BB0E8_184:
	addls	r5, r5, #4
.Lfunc_003BB0E8_188:
	bls	.Lfunc_003BB0E8_1ac
.Lfunc_003BB0E8_18c:
	cmp	r5, #43
.Lfunc_003BB0E8_190:
	cmpne	r5, #45
.Lfunc_003BB0E8_194:
	moveq	r5, #62
.Lfunc_003BB0E8_198:
	beq	.Lfunc_003BB0E8_1ac
.Lfunc_003BB0E8_19c:
	cmp	r5, #47
.Lfunc_003BB0E8_1a0:
	cmpne	r5, #95
.Lfunc_003BB0E8_1a4:
	moveq	r5, #63
.Lfunc_003BB0E8_1a8:
	movne	r5, #64
.Lfunc_003BB0E8_1ac:
	cmp	r1, ip
.Lfunc_003BB0E8_1b0:
	and	r5, r5, #127
.Lfunc_003BB0E8_1b4:
	ble	.Lfunc_003BB0E8_1f8
.Lfunc_003BB0E8_1b8:
	lsl	r8, r8, #2
.Lfunc_003BB0E8_1bc:
	orr	r8, r8, r9, lsr #4
.Lfunc_003BB0E8_1c0:
	strb	r8, [r0, ip]
.Lfunc_003BB0E8_1c4:
	cmp	r7, #64
.Lfunc_003BB0E8_1c8:
	add	ip, ip, #1
.Lfunc_003BB0E8_1cc:
	bcs	.Lfunc_003BB0E8_210
.Lfunc_003BB0E8_1d0:
	cmp	r1, ip
.Lfunc_003BB0E8_1d4:
	ble	.Lfunc_003BB0E8_1f8
.Lfunc_003BB0E8_1d8:
	lsl	r8, r9, #4
.Lfunc_003BB0E8_1dc:
	orr	r8, r8, r7, lsr #2
.Lfunc_003BB0E8_1e0:
	strb	r8, [r0, ip]
.Lfunc_003BB0E8_1e4:
	cmp	r5, #64
.Lfunc_003BB0E8_1e8:
	add	ip, ip, #1
.Lfunc_003BB0E8_1ec:
	bcs	.Lfunc_003BB0E8_210
.Lfunc_003BB0E8_1f0:
	cmp	r1, ip
.Lfunc_003BB0E8_1f4:
	bgt	.Lfunc_003BB0E8_204
.Lfunc_003BB0E8_1f8:
	pop	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_003BB0E8_1fc:
	mov	r0, #0
.Lfunc_003BB0E8_200:
	bx	lr
.Lfunc_003BB0E8_204:
	orr	r5, r5, r7, lsl #6
.Lfunc_003BB0E8_208:
	strb	r5, [r0, ip]
.Lfunc_003BB0E8_20c:
	add	ip, ip, #1
.Lfunc_003BB0E8_210:
	add	r4, r4, #4
.Lfunc_003BB0E8_214:
	cmp	r4, r3
.Lfunc_003BB0E8_218:
	blt	.Lfunc_003BB0E8_18
.Lfunc_003BB0E8_21c:
	cmp	r6, #0
.Lfunc_003BB0E8_220:
	strne	ip, [r6]
.Lfunc_003BB0E8_224:
	pop	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_003BB0E8_228:
	mov	r0, #1
.Lfunc_003BB0E8_22c:
	bx	lr
.size func_003BB0E8, . - func_003BB0E8

.section .text.func_0015F800,"ax",%progbits
.balign 4
.global func_0015F800
.type func_0015F800, %function
func_0015F800:
.Lfunc_0015F800_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0015F800_4:
	mov	r3, r2
.Lfunc_0015F800_8:
	ldr	r4, [r0]
.Lfunc_0015F800_c:
	ldrb	r5, [r0, #3]
.Lfunc_0015F800_10:
	ldrb	ip, [r0]
.Lfunc_0015F800_14:
	bic	r4, r4, #-16777216
.Lfunc_0015F800_18:
	orr	r4, r4, r5, lsl #24
.Lfunc_0015F800_1c:
	tst	ip, #15
.Lfunc_0015F800_20:
	lsr	r7, r4, #8
.Lfunc_0015F800_24:
	movne	r8, #1
.Lfunc_0015F800_28:
	moveq	r8, #0
.Lfunc_0015F800_2c:
	and	r4, ip, #240
.Lfunc_0015F800_30:
	cmp	r4, #16
.Lfunc_0015F800_34:
	bne	.Lfunc_0015F800_4c
.Lfunc_0015F800_38:
	tst	ip, #15
.Lfunc_0015F800_3c:
	beq	.Lfunc_0015F800_58
.Lfunc_0015F800_40:
	and	ip, ip, #15
.Lfunc_0015F800_44:
	cmp	ip, #1
.Lfunc_0015F800_48:
	beq	.Lfunc_0015F800_58
.Lfunc_0015F800_4c:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0015F800_50:
	mvn	r0, #0
.Lfunc_0015F800_54:
	bx	lr
.Lfunc_0015F800_58:
	cmp	r1, #4
.Lfunc_0015F800_5c:
	mov	ip, r1
.Lfunc_0015F800_60:
	bls	.Lfunc_0015F800_f8
.Lfunc_0015F800_64:
	cmp	r7, #0
.Lfunc_0015F800_68:
	add	r5, r0, #4
.Lfunc_0015F800_6c:
	sub	r6, ip, #4
.Lfunc_0015F800_70:
	bne	.Lfunc_0015F800_98
.Lfunc_0015F800_74:
	cmp	r6, #4
.Lfunc_0015F800_78:
	blt	.Lfunc_0015F800_f8
.Lfunc_0015F800_7c:
	ldr	r0, [r5]
.Lfunc_0015F800_80:
	ldrb	r1, [r5, #3]
.Lfunc_0015F800_84:
	add	r5, r5, #4
.Lfunc_0015F800_88:
	bic	r0, r0, #-16777216
.Lfunc_0015F800_8c:
	sub	r6, r6, #4
.Lfunc_0015F800_90:
	orrs	r7, r0, r1, lsl #24
.Lfunc_0015F800_94:
	beq	.Lfunc_0015F800_214
.Lfunc_0015F800_98:
	ldrb	r9, [r5], #1
.Lfunc_0015F800_9c:
	sub	r6, r6, #1
.Lfunc_0015F800_a0:
	cmp	r6, #0
.Lfunc_0015F800_a4:
	movge	sl, #0
.Lfunc_0015F800_a8:
	blt	.Lfunc_0015F800_f8
.Lfunc_0015F800_ac:
	tst	r9, #128
.Lfunc_0015F800_b0:
	beq	.Lfunc_0015F800_104
.Lfunc_0015F800_b4:
	ldrb	r1, [r5]
.Lfunc_0015F800_b8:
	cmp	r8, #0
.Lfunc_0015F800_bc:
	lsr	r0, r1, #4
.Lfunc_0015F800_c0:
	addeq	r0, r0, #3
.Lfunc_0015F800_c4:
	beq	.Lfunc_0015F800_dc
.Lfunc_0015F800_c8:
	cmp	r0, #1
.Lfunc_0015F800_cc:
	beq	.Lfunc_0015F800_120
.Lfunc_0015F800_d0:
	cmp	r0, #0
.Lfunc_0015F800_d4:
	addne	r0, r0, #1
.Lfunc_0015F800_d8:
	beq	.Lfunc_0015F800_148
.Lfunc_0015F800_dc:
	ldrb	r1, [r5], #1
.Lfunc_0015F800_e0:
	subs	r6, r6, #2
.Lfunc_0015F800_e4:
	ldrb	ip, [r5], #1
.Lfunc_0015F800_e8:
	lsl	r1, r1, #28
.Lfunc_0015F800_ec:
	orr	r1, ip, r1, lsr #20
.Lfunc_0015F800_f0:
	add	r1, r1, #1
.Lfunc_0015F800_f4:
	bpl	.Lfunc_0015F800_164
.Lfunc_0015F800_f8:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0015F800_fc:
	mvn	r0, #1
.Lfunc_0015F800_100:
	bx	lr
.Lfunc_0015F800_104:
	ldrb	r0, [r5], #1
.Lfunc_0015F800_108:
	sub	r6, r6, #1
.Lfunc_0015F800_10c:
	cmp	r6, #0
.Lfunc_0015F800_110:
	subge	r7, r7, #1
.Lfunc_0015F800_114:
	strb	r0, [r3], #1
.Lfunc_0015F800_118:
	blt	.Lfunc_0015F800_f8
.Lfunc_0015F800_11c:
	b	.Lfunc_0015F800_1f8
.Lfunc_0015F800_120:
	lsl	r0, r1, #28
.Lfunc_0015F800_124:
	ldrb	r1, [r5, #1]
.Lfunc_0015F800_128:
	ldrb	ip, [r5, #2]!
.Lfunc_0015F800_12c:
	lsr	r0, r0, #16
.Lfunc_0015F800_130:
	sub	r6, r6, #2
.Lfunc_0015F800_134:
	orr	r0, r0, r1, lsl #4
.Lfunc_0015F800_138:
	orr	r0, r0, ip, lsr #4
.Lfunc_0015F800_13c:
	add	r0, r0, #256
.Lfunc_0015F800_140:
	add	r0, r0, #17
.Lfunc_0015F800_144:
	b	.Lfunc_0015F800_dc
.Lfunc_0015F800_148:
	lsl	r0, r1, #28
.Lfunc_0015F800_14c:
	ldrb	r1, [r5, #1]!
.Lfunc_0015F800_150:
	lsr	r0, r0, #24
.Lfunc_0015F800_154:
	sub	r6, r6, #1
.Lfunc_0015F800_158:
	orr	r0, r0, r1, lsr #4
.Lfunc_0015F800_15c:
	add	r0, r0, #17
.Lfunc_0015F800_160:
	b	.Lfunc_0015F800_dc
.Lfunc_0015F800_164:
	cmp	r0, r7
.Lfunc_0015F800_168:
	subls	ip, r3, r1
.Lfunc_0015F800_16c:
	cmpls	r2, ip
.Lfunc_0015F800_170:
	bls	.Lfunc_0015F800_180
.Lfunc_0015F800_174:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0015F800_178:
	mvn	r0, #3
.Lfunc_0015F800_17c:
	bx	lr
.Lfunc_0015F800_180:
	ldrb	ip, [ip]
.Lfunc_0015F800_184:
	sub	r7, r7, r0
.Lfunc_0015F800_188:
	sub	r0, r0, #1
.Lfunc_0015F800_18c:
	cmn	r0, #-2147483647
.Lfunc_0015F800_190:
	strb	ip, [r3], #1
.Lfunc_0015F800_194:
	bls	.Lfunc_0015F800_1b0
.Lfunc_0015F800_198:
	sub	ip, r3, r1
.Lfunc_0015F800_19c:
	subs	r0, r0, #1
.Lfunc_0015F800_1a0:
	ldrb	ip, [ip]
.Lfunc_0015F800_1a4:
	strb	ip, [r3], #1
.Lfunc_0015F800_1a8:
	bne	.Lfunc_0015F800_198
.Lfunc_0015F800_1ac:
	b	.Lfunc_0015F800_1f8
.Lfunc_0015F800_1b0:
	cmp	r0, #0
.Lfunc_0015F800_1b4:
	ble	.Lfunc_0015F800_1f8
.Lfunc_0015F800_1b8:
	sub	r1, r3, r1
.Lfunc_0015F800_1bc:
	tst	r0, #1
.Lfunc_0015F800_1c0:
	sub	ip, r3, #1
.Lfunc_0015F800_1c4:
	sub	r1, r1, #1
.Lfunc_0015F800_1c8:
	beq	.Lfunc_0015F800_1d4
.Lfunc_0015F800_1cc:
	ldrb	r4, [r1, #1]!
.Lfunc_0015F800_1d0:
	strb	r4, [ip, #1]!
.Lfunc_0015F800_1d4:
	asrs	r4, r0, #1
.Lfunc_0015F800_1d8:
	beq	.Lfunc_0015F800_1f4
.Lfunc_0015F800_1dc:
	ldrb	fp, [r1, #1]
.Lfunc_0015F800_1e0:
	subs	r4, r4, #1
.Lfunc_0015F800_1e4:
	strb	fp, [ip, #1]
.Lfunc_0015F800_1e8:
	ldrb	fp, [r1, #2]!
.Lfunc_0015F800_1ec:
	strb	fp, [ip, #2]!
.Lfunc_0015F800_1f0:
	bne	.Lfunc_0015F800_1dc
.Lfunc_0015F800_1f4:
	add	r3, r3, r0
.Lfunc_0015F800_1f8:
	cmp	r7, #0
.Lfunc_0015F800_1fc:
	beq	.Lfunc_0015F800_214
.Lfunc_0015F800_200:
	add	sl, sl, #1
.Lfunc_0015F800_204:
	cmp	sl, #8
.Lfunc_0015F800_208:
	lsl	r9, r9, #1
.Lfunc_0015F800_20c:
	bcc	.Lfunc_0015F800_ac
.Lfunc_0015F800_210:
	b	.Lfunc_0015F800_98
.Lfunc_0015F800_214:
	cmp	r6, #32
.Lfunc_0015F800_218:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_0015F800_21c:
	mvngt	r0, #2
.Lfunc_0015F800_220:
	movle	r0, #0
.Lfunc_0015F800_224:
	bx	lr
.size func_0015F800, . - func_0015F800

.section .text.func_001F8244,"ax",%progbits
.balign 4
.global func_001F8244
.type func_001F8244, %function
func_001F8244:
.Lfunc_001F8244_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_001F8244_4:
	mov	r2, #0
.Lfunc_001F8244_8:
	mov	r6, r2
.Lfunc_001F8244_c:
	ldr	ip, [r0, #156]
.Lfunc_001F8244_10:
	str	r1, [r0, #152]
.Lfunc_001F8244_14:
	ldrb	r3, [r0, #12]
.Lfunc_001F8244_18:
	add	r1, r1, ip, lsl #2
.Lfunc_001F8244_1c:
	str	r1, [r0, #184]
.Lfunc_001F8244_20:
	add	r5, r1, r3, lsl #2
.Lfunc_001F8244_24:
	cmp	r3, #0
.Lfunc_001F8244_28:
	str	r5, [r0, #180]
.Lfunc_001F8244_2c:
	bls	.Lfunc_001F8244_a8
.Lfunc_001F8244_30:
	add	r1, r0, r6, lsl #2
.Lfunc_001F8244_34:
	ldr	r1, [r1, #16]
.Lfunc_001F8244_38:
	ldr	r3, [r1, #24]
.Lfunc_001F8244_3c:
	ldr	r4, [r1, #28]
.Lfunc_001F8244_40:
	add	r3, r3, r1
.Lfunc_001F8244_44:
	cmp	r4, #0
.Lfunc_001F8244_48:
	mov	r1, #0
.Lfunc_001F8244_4c:
	bls	.Lfunc_001F8244_84
.Lfunc_001F8244_50:
	add	ip, r1, r1, lsl #2
.Lfunc_001F8244_54:
	add	ip, r3, ip, lsl #2
.Lfunc_001F8244_58:
	ldrh	ip, [ip]
.Lfunc_001F8244_5c:
	cmp	ip, #0
.Lfunc_001F8244_60:
	beq	.Lfunc_001F8244_78
.Lfunc_001F8244_64:
	cmp	ip, #1
.Lfunc_001F8244_68:
	addeq	r2, r2, #2
.Lfunc_001F8244_6c:
	beq	.Lfunc_001F8244_78
.Lfunc_001F8244_70:
	cmp	ip, #2
.Lfunc_001F8244_74:
	addeq	r2, r2, #6
.Lfunc_001F8244_78:
	add	r1, r1, #1
.Lfunc_001F8244_7c:
	cmp	r4, r1
.Lfunc_001F8244_80:
	bhi	.Lfunc_001F8244_50
.Lfunc_001F8244_84:
	ldr	r1, [r0, #184]
.Lfunc_001F8244_88:
	add	r3, r6, #1
.Lfunc_001F8244_8c:
	add	r5, r5, r2, lsl #2
.Lfunc_001F8244_90:
	str	r2, [r1, r6, lsl #2]
.Lfunc_001F8244_94:
	ldrb	r1, [r0, #12]
.Lfunc_001F8244_98:
	and	r6, r3, #255
.Lfunc_001F8244_9c:
	mov	r2, #0
.Lfunc_001F8244_a0:
	cmp	r1, r6
.Lfunc_001F8244_a4:
	bhi	.Lfunc_001F8244_30
.Lfunc_001F8244_a8:
	mov	r1, #0
.Lfunc_001F8244_ac:
	str	r1, [r0, #188]
.Lfunc_001F8244_b0:
	ldrb	r2, [r0, #12]
.Lfunc_001F8244_b4:
	cmp	r2, #0
.Lfunc_001F8244_b8:
	bls	.Lfunc_001F8244_e4
.Lfunc_001F8244_bc:
	add	ip, r0, r1, lsl #2
.Lfunc_001F8244_c0:
	ldr	r3, [r0, #188]
.Lfunc_001F8244_c4:
	ldr	ip, [ip, #16]
.Lfunc_001F8244_c8:
	add	r1, r1, #1
.Lfunc_001F8244_cc:
	and	r1, r1, #255
.Lfunc_001F8244_d0:
	cmp	r2, r1
.Lfunc_001F8244_d4:
	ldrb	ip, [ip, #6]
.Lfunc_001F8244_d8:
	add	r3, r3, ip
.Lfunc_001F8244_dc:
	str	r3, [r0, #188]
.Lfunc_001F8244_e0:
	bhi	.Lfunc_001F8244_bc
.Lfunc_001F8244_e4:
	str	r5, [r0, #176]
.Lfunc_001F8244_e8:
	ldr	r3, [r0, #188]
.Lfunc_001F8244_ec:
	cmp	r2, #0
.Lfunc_001F8244_f0:
	mov	r1, #0
.Lfunc_001F8244_f4:
	sub	ip, r2, r3
.Lfunc_001F8244_f8:
	add	r3, r3, #1
.Lfunc_001F8244_fc:
	mov	r4, r1
.Lfunc_001F8244_100:
	mul	r6, ip, r3
.Lfunc_001F8244_104:
	movhi	r7, #38
.Lfunc_001F8244_108:
	bls	.Lfunc_001F8244_190
.Lfunc_001F8244_10c:
	add	r2, r0, r4, lsl #2
.Lfunc_001F8244_110:
	ldr	r2, [r2, #16]
.Lfunc_001F8244_114:
	ldrb	r2, [r2, #6]
.Lfunc_001F8244_118:
	cmp	r2, #0
.Lfunc_001F8244_11c:
	bne	.Lfunc_001F8244_17c
.Lfunc_001F8244_120:
	ldr	r3, [r0, #176]
.Lfunc_001F8244_124:
	add	ip, r1, #1
.Lfunc_001F8244_128:
	mov	r2, #0
.Lfunc_001F8244_12c:
	str	r7, [r3, r1, lsl #2]
.Lfunc_001F8244_130:
	ldrb	r3, [r0, #12]
.Lfunc_001F8244_134:
	and	r1, ip, #255
.Lfunc_001F8244_138:
	add	ip, r0, r2, lsl #2
.Lfunc_001F8244_13c:
	ldr	ip, [ip, #16]
.Lfunc_001F8244_140:
	ldrb	r8, [ip, #6]
.Lfunc_001F8244_144:
	cmp	r8, #0
.Lfunc_001F8244_148:
	beq	.Lfunc_001F8244_16c
.Lfunc_001F8244_14c:
	ldrb	ip, [ip, #20]
.Lfunc_001F8244_150:
	add	r8, r1, #1
.Lfunc_001F8244_154:
	cmp	ip, #1
.Lfunc_001F8244_158:
	ldr	ip, [r0, #176]
.Lfunc_001F8244_15c:
	moveq	r9, #50
.Lfunc_001F8244_160:
	movne	r9, #48
.Lfunc_001F8244_164:
	str	r9, [ip, r1, lsl #2]
.Lfunc_001F8244_168:
	and	r1, r8, #255
.Lfunc_001F8244_16c:
	sub	r3, r3, #1
.Lfunc_001F8244_170:
	cmp	r3, #0
.Lfunc_001F8244_174:
	add	r2, r2, #1
.Lfunc_001F8244_178:
	bgt	.Lfunc_001F8244_138
.Lfunc_001F8244_17c:
	ldrb	r2, [r0, #12]
.Lfunc_001F8244_180:
	add	r3, r4, #1
.Lfunc_001F8244_184:
	and	r4, r3, #255
.Lfunc_001F8244_188:
	cmp	r2, r4
.Lfunc_001F8244_18c:
	bhi	.Lfunc_001F8244_10c
.Lfunc_001F8244_190:
	add	r1, r5, r6, lsl #2
.Lfunc_001F8244_194:
	cmp	r6, #0
.Lfunc_001F8244_198:
	str	r1, [r0, #172]
.Lfunc_001F8244_19c:
	beq	.Lfunc_001F8244_1e4
.Lfunc_001F8244_1a0:
	ldr	r2, [r0, #176]
.Lfunc_001F8244_1a4:
	tst	r6, #1
.Lfunc_001F8244_1a8:
	sub	r2, r2, #4
.Lfunc_001F8244_1ac:
	beq	.Lfunc_001F8244_1b8
.Lfunc_001F8244_1b0:
	ldr	r3, [r2, #4]!
.Lfunc_001F8244_1b4:
	add	r1, r1, r3, lsl #2
.Lfunc_001F8244_1b8:
	lsl	r3, r6, #23
.Lfunc_001F8244_1bc:
	lsrs	r3, r3, #24
.Lfunc_001F8244_1c0:
	beq	.Lfunc_001F8244_1e4
.Lfunc_001F8244_1c4:
	add	r4, r2, #4
.Lfunc_001F8244_1c8:
	sub	r3, r3, #1
.Lfunc_001F8244_1cc:
	ldm	r4, {r4, ip}
.Lfunc_001F8244_1d0:
	ands	r3, r3, #255
.Lfunc_001F8244_1d4:
	add	r2, r2, #8
.Lfunc_001F8244_1d8:
	add	r1, r1, r4, lsl #2
.Lfunc_001F8244_1dc:
	add	r1, r1, ip, lsl #2
.Lfunc_001F8244_1e0:
	bne	.Lfunc_001F8244_1c4
.Lfunc_001F8244_1e4:
	str	r1, [r0, #192]
.Lfunc_001F8244_1e8:
	ldrb	r2, [r0, #12]
.Lfunc_001F8244_1ec:
	add	r1, r1, r2, lsl #2
.Lfunc_001F8244_1f0:
	add	r2, r1, r2, lsl #2
.Lfunc_001F8244_1f4:
	str	r1, [r0, #196]
.Lfunc_001F8244_1f8:
	add	r1, r2, #4
.Lfunc_001F8244_1fc:
	str	r1, [r0, #200]
.Lfunc_001F8244_200:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_001F8244_204:
	bx	lr
.size func_001F8244, . - func_001F8244
```
