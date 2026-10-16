# Probe-verified ARM runtime/helper batch 64

## Scope and provenance

This clean-room specification covers nine currently unmatched ARM-state,
call-free helpers totaling 2,944 executable body bytes. Evidence was limited
to the current unmatched report, the neutral symbol inventory, bounded
private-target control/data-flow inspection, and independently assembled
exact-schedule probes. The selection excludes every earlier configured
function plus duplicate batch 64 and IPC batch 60 reservations.

The functions contain no calls, external branches, relocations, literal-pool
loads, PC-relative address calculations, adjacent data, opaque absolute
addresses, or private strings/assets. Independent ARMv6K assembly comparison
against target revision `AS_EUR_REV2` on 2026-10-16 matched all nine complete
bodies (2,944 bytes / 736 instructions).

## Semantic summary

- `func_001D4894` (352 bytes) initializes a group of byte planes reached
  through an indexed pointer table. It writes the exact seven-way sentinel
  pattern, clears five corresponding per-plane slots, initializes three
  trailing sentinel planes, and returns success.
- `func_001320D0` (348 bytes) expands a flag-driven LZ-style byte stream.
  A packed header supplies the remaining output length; literal tokens copy
  one byte, while short and extended back-reference forms decode their
  lengths and displacements before performing the overlap-safe byte copy.
- `func_00415924` (332 bytes) validates a fixed structured identifier. The
  first three characters must form a decimal value in the inclusive
  three-digit range, optionally written to the caller's output word, and the
  following five characters must each be alphanumeric or underscore.
- `func_00328C74` (328 bytes) normalizes a caller-selected prefix of packed
  12-byte records inside a descriptor. It derives the record base from packed
  layout fields, rewrites several fixed bitfields in both control words,
  assigns the fixed low-byte tag, and stores the new active-count field.
- `func_00170340` (324 bytes) validates and marks boundaries in a compact
  variable-length byte sequence. It uses a local 512-bit visited map, follows
  each element's encoded span, applies two optional boundary marks, rejects
  out-of-range or cyclic traversal, and returns a boolean result.
- `func_003C5F44` (324 bytes) quantizes four scaled values using a format
  descriptor, packs the resulting lanes at descriptor-selected bit offsets,
  and stores the packed value in 4-, 8-, 16-, or 32-bit layouts. The 24-bit
  layout is emitted as three independently scaled bytes.
- `func_002B80B0` (320 bytes) performs first-fit allocation in a bounded
  2,624-byte occupancy map. It marks a requested contiguous run, advances the
  high-water cursor, and returns the matching 16-byte record; if the forward
  scan fails, it retries the occupied prefix before returning null.
- `func_004ED27C` (312 bytes) locates the cell containing a six-coordinate
  query in a multi-dimensional axis-aligned grid. It walks each dimension's
  interval table, accumulates the flattened index with exact stride
  arithmetic, and copies the selected eight-byte payload to the output.
- `func_00307AC8` (304 bytes) accumulates an aligned storage-size estimate
  from a descriptor. It accounts for fixed state, twelve-byte entries, an
  optional nested pointer table whose records add aligned blocks, and two
  final eight-byte arrays while preserving the caller-provided alignment.

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

.section .text.func_001D4894,"ax",%progbits
.balign 4
.global func_001D4894
.type func_001D4894, %function
func_001D4894:
.Lfunc_001D4894_0:
	push	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_001D4894_4:
	add	ip, r0, r2, lsl #2
.Lfunc_001D4894_8:
	mov	r5, #0
.Lfunc_001D4894_c:
	mov	r7, #7
.Lfunc_001D4894_10:
	ldr	r3, [r0, r2, lsl #2]
.Lfunc_001D4894_14:
	ldr	r4, [ip, #24]
.Lfunc_001D4894_18:
	mov	r6, #255
.Lfunc_001D4894_1c:
	add	r3, r3, r1
.Lfunc_001D4894_20:
	add	r4, r4, r1
.Lfunc_001D4894_24:
	add	r8, r1, #6
.Lfunc_001D4894_28:
	add	r9, r2, r5
.Lfunc_001D4894_2c:
	strb	r6, [r3], #1
.Lfunc_001D4894_30:
	strb	r6, [r4], #1
.Lfunc_001D4894_34:
	ldr	sl, [r0, r9, lsl #2]
.Lfunc_001D4894_38:
	subs	r7, r7, #1
.Lfunc_001D4894_3c:
	add	r5, r5, #1
.Lfunc_001D4894_40:
	strb	r6, [sl, r1]
.Lfunc_001D4894_44:
	ldr	r9, [r0, r9, lsl #2]
.Lfunc_001D4894_48:
	strb	r6, [r9, r8]
.Lfunc_001D4894_4c:
	bne	.Lfunc_001D4894_28
.Lfunc_001D4894_50:
	ldr	r5, [ip, #20]
.Lfunc_001D4894_54:
	ldr	r4, [ip, #4]
.Lfunc_001D4894_58:
	add	r7, r1, #1
.Lfunc_001D4894_5c:
	mov	r3, #0
.Lfunc_001D4894_60:
	add	r5, r5, r7
.Lfunc_001D4894_64:
	strb	r3, [r4, r7]!
.Lfunc_001D4894_68:
	strb	r3, [r5]
.Lfunc_001D4894_6c:
	ldr	r8, [ip, #4]
.Lfunc_001D4894_70:
	add	sl, r2, #1
.Lfunc_001D4894_74:
	add	sl, r0, sl, lsl #2
.Lfunc_001D4894_78:
	strb	r3, [r8, r7]
.Lfunc_001D4894_7c:
	ldr	r9, [ip, #4]
.Lfunc_001D4894_80:
	add	r8, r1, #5
.Lfunc_001D4894_84:
	strb	r3, [r9, r8]
.Lfunc_001D4894_88:
	strb	r3, [r4, #1]
.Lfunc_001D4894_8c:
	strb	r3, [r5, #1]
.Lfunc_001D4894_90:
	ldr	r9, [sl, #4]
.Lfunc_001D4894_94:
	strb	r3, [r9, r7]
.Lfunc_001D4894_98:
	ldr	r9, [sl, #4]
.Lfunc_001D4894_9c:
	add	sl, r2, #2
.Lfunc_001D4894_a0:
	strb	r3, [r9, r8]
.Lfunc_001D4894_a4:
	add	r9, r0, sl, lsl #2
.Lfunc_001D4894_a8:
	strb	r3, [r4, #2]
.Lfunc_001D4894_ac:
	strb	r3, [r5, #2]
.Lfunc_001D4894_b0:
	ldr	sl, [r9, #4]
.Lfunc_001D4894_b4:
	strb	r3, [sl, r7]
.Lfunc_001D4894_b8:
	ldr	r9, [r9, #4]
.Lfunc_001D4894_bc:
	strb	r3, [r9, r8]
.Lfunc_001D4894_c0:
	add	r9, r2, #3
.Lfunc_001D4894_c4:
	strb	r3, [r4, #3]
.Lfunc_001D4894_c8:
	add	r9, r0, r9, lsl #2
.Lfunc_001D4894_cc:
	strb	r3, [r5, #3]
.Lfunc_001D4894_d0:
	ldr	sl, [r9, #4]
.Lfunc_001D4894_d4:
	add	r2, r2, #4
.Lfunc_001D4894_d8:
	add	r0, r0, r2, lsl #2
.Lfunc_001D4894_dc:
	strb	r3, [sl, r7]
.Lfunc_001D4894_e0:
	ldr	r9, [r9, #4]
.Lfunc_001D4894_e4:
	strb	r3, [r9, r8]
.Lfunc_001D4894_e8:
	strb	r3, [r4, #4]
.Lfunc_001D4894_ec:
	strb	r3, [r5, #4]
.Lfunc_001D4894_f0:
	ldr	r2, [r0, #4]
.Lfunc_001D4894_f4:
	strb	r3, [r2, r7]
.Lfunc_001D4894_f8:
	ldr	r0, [r0, #4]
.Lfunc_001D4894_fc:
	strb	r3, [r0, r8]
.Lfunc_001D4894_100:
	ldr	r2, [ip, #8]
.Lfunc_001D4894_104:
	add	r0, r1, #2
.Lfunc_001D4894_108:
	strb	r6, [r2, r0]
.Lfunc_001D4894_10c:
	ldr	r2, [ip, #12]
.Lfunc_001D4894_110:
	strb	r6, [r2, r0]
.Lfunc_001D4894_114:
	ldr	r2, [ip, #16]
.Lfunc_001D4894_118:
	strb	r6, [r2, r0]
.Lfunc_001D4894_11c:
	ldr	r2, [ip, #8]
.Lfunc_001D4894_120:
	add	r0, r1, #3
.Lfunc_001D4894_124:
	strb	r6, [r2, r0]
.Lfunc_001D4894_128:
	ldr	r2, [ip, #12]
.Lfunc_001D4894_12c:
	strb	r6, [r2, r0]
.Lfunc_001D4894_130:
	ldr	r2, [ip, #16]
.Lfunc_001D4894_134:
	strb	r6, [r2, r0]
.Lfunc_001D4894_138:
	ldr	r2, [ip, #8]
.Lfunc_001D4894_13c:
	add	r0, r1, #4
.Lfunc_001D4894_140:
	strb	r6, [r2, r0]
.Lfunc_001D4894_144:
	ldr	r1, [ip, #12]
.Lfunc_001D4894_148:
	strb	r6, [r1, r0]
.Lfunc_001D4894_14c:
	ldr	r1, [ip, #16]
.Lfunc_001D4894_150:
	strb	r6, [r1, r0]
.Lfunc_001D4894_154:
	pop	{r4, r5, r6, r7, r8, r9, sl}
.Lfunc_001D4894_158:
	mov	r0, #1
.Lfunc_001D4894_15c:
	bx	lr
.size func_001D4894, .-func_001D4894

.section .text.func_001320D0,"ax",%progbits
.balign 4
.global func_001320D0
.type func_001320D0, %function
func_001320D0:
.Lfunc_001320D0_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_001320D0_4:
	ldr	r2, [r0]
.Lfunc_001320D0_8:
	ldrb	r3, [r0, #3]
.Lfunc_001320D0_c:
	ldrb	ip, [r0]
.Lfunc_001320D0_10:
	bic	r2, r2, #-16777216
.Lfunc_001320D0_14:
	tst	ip, #15
.Lfunc_001320D0_18:
	orr	r3, r2, r3, lsl #24
.Lfunc_001320D0_1c:
	movne	r7, #1
.Lfunc_001320D0_20:
	lsr	r4, r3, #8
.Lfunc_001320D0_24:
	moveq	r7, #0
.Lfunc_001320D0_28:
	cmp	r4, #0
.Lfunc_001320D0_2c:
	add	ip, r0, #4
.Lfunc_001320D0_30:
	bne	.Lfunc_001320D0_4c
.Lfunc_001320D0_34:
	ldr	r0, [ip]
.Lfunc_001320D0_38:
	ldrb	r2, [ip, #3]
.Lfunc_001320D0_3c:
	add	ip, ip, #4
.Lfunc_001320D0_40:
	bic	r0, r0, #-16777216
.Lfunc_001320D0_44:
	orrs	r4, r0, r2, lsl #24
.Lfunc_001320D0_48:
	beq	.Lfunc_001320D0_154
.Lfunc_001320D0_4c:
	ldrb	r6, [ip], #1
.Lfunc_001320D0_50:
	mov	r8, #0
.Lfunc_001320D0_54:
	tst	r6, #128
.Lfunc_001320D0_58:
	beq	.Lfunc_001320D0_108
.Lfunc_001320D0_5c:
	ldrb	r2, [ip]
.Lfunc_001320D0_60:
	cmp	r7, #0
.Lfunc_001320D0_64:
	lsr	r0, r2, #4
.Lfunc_001320D0_68:
	addeq	r5, r0, #3
.Lfunc_001320D0_6c:
	beq	.Lfunc_001320D0_84
.Lfunc_001320D0_70:
	cmp	r0, #1
.Lfunc_001320D0_74:
	beq	.Lfunc_001320D0_118
.Lfunc_001320D0_78:
	cmp	r0, #0
.Lfunc_001320D0_7c:
	addne	r5, r0, #1
.Lfunc_001320D0_80:
	beq	.Lfunc_001320D0_13c
.Lfunc_001320D0_84:
	ldrb	r0, [ip], #1
.Lfunc_001320D0_88:
	cmp	r5, r4
.Lfunc_001320D0_8c:
	ldrb	r2, [ip], #1
.Lfunc_001320D0_90:
	movhi	r5, r4
.Lfunc_001320D0_94:
	lsl	r0, r0, #28
.Lfunc_001320D0_98:
	cmp	r5, #0
.Lfunc_001320D0_9c:
	orr	r0, r2, r0, lsr #20
.Lfunc_001320D0_a0:
	add	r0, r0, #1
.Lfunc_001320D0_a4:
	sub	r4, r4, r5
.Lfunc_001320D0_a8:
	sub	r0, r1, r0
.Lfunc_001320D0_ac:
	beq	.Lfunc_001320D0_ec
.Lfunc_001320D0_b0:
	tst	r5, #1
.Lfunc_001320D0_b4:
	sub	r0, r0, #1
.Lfunc_001320D0_b8:
	sub	r2, r1, #1
.Lfunc_001320D0_bc:
	beq	.Lfunc_001320D0_c8
.Lfunc_001320D0_c0:
	ldrb	r3, [r0, #1]!
.Lfunc_001320D0_c4:
	strb	r3, [r2, #1]!
.Lfunc_001320D0_c8:
	lsrs	r3, r5, #1
.Lfunc_001320D0_cc:
	beq	.Lfunc_001320D0_e8
.Lfunc_001320D0_d0:
	ldrb	r9, [r0, #1]
.Lfunc_001320D0_d4:
	subs	r3, r3, #1
.Lfunc_001320D0_d8:
	strb	r9, [r2, #1]
.Lfunc_001320D0_dc:
	ldrb	r9, [r0, #2]!
.Lfunc_001320D0_e0:
	strb	r9, [r2, #2]!
.Lfunc_001320D0_e4:
	bne	.Lfunc_001320D0_d0
.Lfunc_001320D0_e8:
	add	r1, r1, r5
.Lfunc_001320D0_ec:
	cmp	r4, #0
.Lfunc_001320D0_f0:
	beq	.Lfunc_001320D0_154
.Lfunc_001320D0_f4:
	add	r8, r8, #1
.Lfunc_001320D0_f8:
	cmp	r8, #8
.Lfunc_001320D0_fc:
	lsl	r6, r6, #1
.Lfunc_001320D0_100:
	blt	.Lfunc_001320D0_54
.Lfunc_001320D0_104:
	b	.Lfunc_001320D0_4c
.Lfunc_001320D0_108:
	ldrb	r0, [ip], #1
.Lfunc_001320D0_10c:
	sub	r4, r4, #1
.Lfunc_001320D0_110:
	strb	r0, [r1], #1
.Lfunc_001320D0_114:
	b	.Lfunc_001320D0_ec
.Lfunc_001320D0_118:
	lsl	r0, r2, #28
.Lfunc_001320D0_11c:
	ldrb	r2, [ip, #1]
.Lfunc_001320D0_120:
	ldrb	r3, [ip, #2]!
.Lfunc_001320D0_124:
	lsr	r0, r0, #16
.Lfunc_001320D0_128:
	orr	r0, r0, r2, lsl #4
.Lfunc_001320D0_12c:
	orr	r0, r0, r3, lsr #4
.Lfunc_001320D0_130:
	add	r5, r0, #256
.Lfunc_001320D0_134:
	add	r5, r5, #17
.Lfunc_001320D0_138:
	b	.Lfunc_001320D0_84
.Lfunc_001320D0_13c:
	lsl	r0, r2, #28
.Lfunc_001320D0_140:
	ldrb	r2, [ip, #1]!
.Lfunc_001320D0_144:
	lsr	r0, r0, #24
.Lfunc_001320D0_148:
	orr	r0, r0, r2, lsr #4
.Lfunc_001320D0_14c:
	add	r5, r0, #17
.Lfunc_001320D0_150:
	b	.Lfunc_001320D0_84
.Lfunc_001320D0_154:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_001320D0_158:
	bx	lr
.size func_001320D0, .-func_001320D0

.section .text.func_00415924,"ax",%progbits
.balign 4
.global func_00415924
.type func_00415924, %function
func_00415924:
.Lfunc_00415924_0:
	push	{r4, r5}
.Lfunc_00415924_4:
	ldrsb	r4, [r0]
.Lfunc_00415924_8:
	sub	r2, r4, #48
.Lfunc_00415924_c:
	cmp	r2, #10
.Lfunc_00415924_10:
	bcs	.Lfunc_00415924_134
.Lfunc_00415924_14:
	ldrsb	ip, [r0, #1]
.Lfunc_00415924_18:
	add	r2, r0, #1
.Lfunc_00415924_1c:
	mvn	r3, #47
.Lfunc_00415924_20:
	sub	r5, ip, #48
.Lfunc_00415924_24:
	cmp	r5, #10
.Lfunc_00415924_28:
	sub	r4, r4, #48
.Lfunc_00415924_2c:
	bcs	.Lfunc_00415924_134
.Lfunc_00415924_30:
	add	r4, r4, r4, lsl #2
.Lfunc_00415924_34:
	ldrsb	r2, [r2, #1]
.Lfunc_00415924_38:
	add	r5, r3, r4, lsl #1
.Lfunc_00415924_3c:
	add	ip, ip, r5
.Lfunc_00415924_40:
	sub	r4, r2, #48
.Lfunc_00415924_44:
	cmp	r4, #10
.Lfunc_00415924_48:
	bcs	.Lfunc_00415924_134
.Lfunc_00415924_4c:
	add	ip, ip, ip, lsl #2
.Lfunc_00415924_50:
	add	r3, r3, ip, lsl #1
.Lfunc_00415924_54:
	add	r2, r2, r3
.Lfunc_00415924_58:
	sub	r3, r2, #100
.Lfunc_00415924_5c:
	cmp	r3, #900
.Lfunc_00415924_60:
	bcs	.Lfunc_00415924_134
.Lfunc_00415924_64:
	cmp	r1, #0
.Lfunc_00415924_68:
	strne	r2, [r1]
.Lfunc_00415924_6c:
	ldrsb	r1, [r0, #3]!
.Lfunc_00415924_70:
	sub	r2, r1, #48
.Lfunc_00415924_74:
	cmp	r2, #9
.Lfunc_00415924_78:
	subhi	r2, r1, #65
.Lfunc_00415924_7c:
	cmphi	r2, #25
.Lfunc_00415924_80:
	subhi	r2, r1, #97
.Lfunc_00415924_84:
	cmphi	r2, #25
.Lfunc_00415924_88:
	bls	.Lfunc_00415924_94
.Lfunc_00415924_8c:
	cmp	r1, #95
.Lfunc_00415924_90:
	bne	.Lfunc_00415924_134
.Lfunc_00415924_94:
	ldrsb	r1, [r0, #1]!
.Lfunc_00415924_98:
	sub	r2, r1, #48
.Lfunc_00415924_9c:
	cmp	r2, #9
.Lfunc_00415924_a0:
	subhi	r2, r1, #65
.Lfunc_00415924_a4:
	cmphi	r2, #25
.Lfunc_00415924_a8:
	subhi	r2, r1, #97
.Lfunc_00415924_ac:
	cmphi	r2, #25
.Lfunc_00415924_b0:
	bls	.Lfunc_00415924_bc
.Lfunc_00415924_b4:
	cmp	r1, #95
.Lfunc_00415924_b8:
	bne	.Lfunc_00415924_134
.Lfunc_00415924_bc:
	ldrsb	r1, [r0, #1]!
.Lfunc_00415924_c0:
	sub	r2, r1, #48
.Lfunc_00415924_c4:
	cmp	r2, #9
.Lfunc_00415924_c8:
	subhi	r2, r1, #65
.Lfunc_00415924_cc:
	cmphi	r2, #25
.Lfunc_00415924_d0:
	subhi	r2, r1, #97
.Lfunc_00415924_d4:
	cmphi	r2, #25
.Lfunc_00415924_d8:
	bls	.Lfunc_00415924_e4
.Lfunc_00415924_dc:
	cmp	r1, #95
.Lfunc_00415924_e0:
	bne	.Lfunc_00415924_134
.Lfunc_00415924_e4:
	ldrsb	r1, [r0, #1]!
.Lfunc_00415924_e8:
	sub	r2, r1, #48
.Lfunc_00415924_ec:
	cmp	r2, #9
.Lfunc_00415924_f0:
	subhi	r2, r1, #65
.Lfunc_00415924_f4:
	cmphi	r2, #25
.Lfunc_00415924_f8:
	subhi	r2, r1, #97
.Lfunc_00415924_fc:
	cmphi	r2, #25
.Lfunc_00415924_100:
	bls	.Lfunc_00415924_10c
.Lfunc_00415924_104:
	cmp	r1, #95
.Lfunc_00415924_108:
	bne	.Lfunc_00415924_134
.Lfunc_00415924_10c:
	ldrsb	r0, [r0, #1]
.Lfunc_00415924_110:
	sub	r1, r0, #48
.Lfunc_00415924_114:
	cmp	r1, #9
.Lfunc_00415924_118:
	subhi	r1, r0, #65
.Lfunc_00415924_11c:
	cmphi	r1, #25
.Lfunc_00415924_120:
	subhi	r1, r0, #97
.Lfunc_00415924_124:
	cmphi	r1, #25
.Lfunc_00415924_128:
	bls	.Lfunc_00415924_140
.Lfunc_00415924_12c:
	cmp	r0, #95
.Lfunc_00415924_130:
	beq	.Lfunc_00415924_140
.Lfunc_00415924_134:
	pop	{r4, r5}
.Lfunc_00415924_138:
	mov	r0, #0
.Lfunc_00415924_13c:
	bx	lr
.Lfunc_00415924_140:
	pop	{r4, r5}
.Lfunc_00415924_144:
	mov	r0, #1
.Lfunc_00415924_148:
	bx	lr
.size func_00415924, .-func_00415924

.section .text.func_00328C74,"ax",%progbits
.balign 4
.global func_00328C74
.type func_00328C74, %function
func_00328C74:
.Lfunc_00328C74_0:
	cmp	r1, #0
.Lfunc_00328C74_4:
	push	{r4, r5}
.Lfunc_00328C74_8:
	beq	.Lfunc_00328C74_128
.Lfunc_00328C74_c:
	ldr	r2, [r0, #44]
.Lfunc_00328C74_10:
	mov	ip, #12
.Lfunc_00328C74_14:
	ldr	r3, [r0, #52]
.Lfunc_00328C74_18:
	lsl	r5, r2, #28
.Lfunc_00328C74_1c:
	lsl	r4, r2, #30
.Lfunc_00328C74_20:
	lsr	r5, r5, #30
.Lfunc_00328C74_24:
	lsr	r4, r4, #25
.Lfunc_00328C74_28:
	add	r5, r5, r5, lsl #2
.Lfunc_00328C74_2c:
	and	ip, ip, r2, lsr #2
.Lfunc_00328C74_30:
	add	r4, r4, r5, lsl #2
.Lfunc_00328C74_34:
	add	ip, ip, r4
.Lfunc_00328C74_38:
	mov	r4, #8
.Lfunc_00328C74_3c:
	and	r4, r4, r2, lsr #6
.Lfunc_00328C74_40:
	add	ip, ip, r4
.Lfunc_00328C74_44:
	mov	r4, #4
.Lfunc_00328C74_48:
	and	r2, r4, r2, lsr #8
.Lfunc_00328C74_4c:
	add	r2, r2, ip
.Lfunc_00328C74_50:
	add	r4, r3, r2
.Lfunc_00328C74_54:
	ldr	r2, [r0, #48]
.Lfunc_00328C74_58:
	lsl	r2, r2, #23
.Lfunc_00328C74_5c:
	lsr	r3, r2, #29
.Lfunc_00328C74_60:
	cmp	r1, r3
.Lfunc_00328C74_64:
	bls	.Lfunc_00328C74_128
.Lfunc_00328C74_68:
	add	r2, r3, r3, lsl #1
.Lfunc_00328C74_6c:
	adds	r2, r4, r2, lsl #2
.Lfunc_00328C74_70:
	beq	.Lfunc_00328C74_11c
.Lfunc_00328C74_74:
	ldr	ip, [r2]
.Lfunc_00328C74_78:
	bic	ip, ip, #251658240
.Lfunc_00328C74_7c:
	str	ip, [r2]
.Lfunc_00328C74_80:
	ldr	ip, [r2, #4]
.Lfunc_00328C74_84:
	bic	ip, ip, #251658240
.Lfunc_00328C74_88:
	str	ip, [r2, #4]
.Lfunc_00328C74_8c:
	ldr	ip, [r2]
.Lfunc_00328C74_90:
	lsr	ip, ip, #12
.Lfunc_00328C74_94:
	lsl	ip, ip, #12
.Lfunc_00328C74_98:
	orr	ip, ip, #1280
.Lfunc_00328C74_9c:
	orr	ip, ip, #85
.Lfunc_00328C74_a0:
	str	ip, [r2]
.Lfunc_00328C74_a4:
	ldr	ip, [r2, #4]
.Lfunc_00328C74_a8:
	lsr	ip, ip, #12
.Lfunc_00328C74_ac:
	lsl	ip, ip, #12
.Lfunc_00328C74_b0:
	orr	ip, ip, #1280
.Lfunc_00328C74_b4:
	orr	ip, ip, #85
.Lfunc_00328C74_b8:
	str	ip, [r2, #4]
.Lfunc_00328C74_bc:
	ldr	ip, [r2]
.Lfunc_00328C74_c0:
	bic	ip, ip, #15728640
.Lfunc_00328C74_c4:
	bic	ip, ip, #1044480
.Lfunc_00328C74_c8:
	str	ip, [r2]
.Lfunc_00328C74_cc:
	ldr	ip, [r2, #4]
.Lfunc_00328C74_d0:
	bic	ip, ip, #61440
.Lfunc_00328C74_d4:
	bic	ip, ip, #16711680
.Lfunc_00328C74_d8:
	str	ip, [r2, #4]
.Lfunc_00328C74_dc:
	ldr	ip, [r2]
.Lfunc_00328C74_e0:
	bic	ip, ip, #805306368
.Lfunc_00328C74_e4:
	str	ip, [r2]
.Lfunc_00328C74_e8:
	ldr	ip, [r2, #4]
.Lfunc_00328C74_ec:
	bic	ip, ip, #805306368
.Lfunc_00328C74_f0:
	str	ip, [r2, #4]
.Lfunc_00328C74_f4:
	ldr	ip, [r2, #8]
.Lfunc_00328C74_f8:
	bic	ip, ip, #255
.Lfunc_00328C74_fc:
	orr	ip, ip, #17
.Lfunc_00328C74_100:
	str	ip, [r2, #8]
.Lfunc_00328C74_104:
	ldr	ip, [r2]
.Lfunc_00328C74_108:
	bic	ip, ip, #1073741824
.Lfunc_00328C74_10c:
	str	ip, [r2]
.Lfunc_00328C74_110:
	ldr	ip, [r2, #4]
.Lfunc_00328C74_114:
	bic	ip, ip, #1073741824
.Lfunc_00328C74_118:
	str	ip, [r2, #4]
.Lfunc_00328C74_11c:
	add	r3, r3, #1
.Lfunc_00328C74_120:
	cmp	r3, r1
.Lfunc_00328C74_124:
	bcc	.Lfunc_00328C74_68
.Lfunc_00328C74_128:
	ldr	r2, [r0, #48]
.Lfunc_00328C74_12c:
	mov	r3, #448
.Lfunc_00328C74_130:
	and	r1, r3, r1, lsl #6
.Lfunc_00328C74_134:
	bic	r2, r2, #448
.Lfunc_00328C74_138:
	orr	r1, r1, r2
.Lfunc_00328C74_13c:
	str	r1, [r0, #48]
.Lfunc_00328C74_140:
	pop	{r4, r5}
.Lfunc_00328C74_144:
	bx	lr
.size func_00328C74, .-func_00328C74

.section .text.func_00170340,"ax",%progbits
.balign 4
.global func_00170340
.type func_00170340, %function
func_00170340:
.Lfunc_00170340_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_00170340_4:
	sub	sp, sp, #64
.Lfunc_00170340_8:
	mov	r2, #0
.Lfunc_00170340_c:
	cmp	r1, #4
.Lfunc_00170340_10:
	ldrb	r5, [r0]
.Lfunc_00170340_14:
	str	r2, [sp]
.Lfunc_00170340_18:
	add	r1, r0, #1
.Lfunc_00170340_1c:
	str	r2, [sp, #4]
.Lfunc_00170340_20:
	str	r2, [sp, #8]
.Lfunc_00170340_24:
	str	r2, [sp, #12]
.Lfunc_00170340_28:
	str	r2, [sp, #16]
.Lfunc_00170340_2c:
	str	r2, [sp, #20]
.Lfunc_00170340_30:
	add	r0, r0, r5, lsl #1
.Lfunc_00170340_34:
	str	r2, [sp, #24]
.Lfunc_00170340_38:
	str	r2, [sp, #28]
.Lfunc_00170340_3c:
	str	r2, [sp, #32]
.Lfunc_00170340_40:
	str	r2, [sp, #36]
.Lfunc_00170340_44:
	str	r2, [sp, #40]
.Lfunc_00170340_48:
	add	r8, r0, #2
.Lfunc_00170340_4c:
	str	r2, [sp, #44]
.Lfunc_00170340_50:
	str	r2, [sp, #48]
.Lfunc_00170340_54:
	str	r2, [sp, #52]
.Lfunc_00170340_58:
	str	r2, [sp, #56]
.Lfunc_00170340_5c:
	str	r2, [sp, #60]
.Lfunc_00170340_60:
	bne	.Lfunc_00170340_6c
.Lfunc_00170340_64:
	cmp	r5, #16
.Lfunc_00170340_68:
	bcs	.Lfunc_00170340_cc
.Lfunc_00170340_6c:
	sub	r2, r8, r1
.Lfunc_00170340_70:
	add	r9, r2, #1
.Lfunc_00170340_74:
	cmp	r9, #1
.Lfunc_00170340_78:
	mov	r0, #1
.Lfunc_00170340_7c:
	mov	ip, r0
.Lfunc_00170340_80:
	movgt	r2, sp
.Lfunc_00170340_84:
	movgt	r4, #1
.Lfunc_00170340_88:
	ble	.Lfunc_00170340_134
.Lfunc_00170340_8c:
	ldrb	r6, [r2, r0, lsr #3]
.Lfunc_00170340_90:
	and	r3, r0, #7
.Lfunc_00170340_94:
	tst	r6, r4, lsl r3
.Lfunc_00170340_98:
	bne	.Lfunc_00170340_120
.Lfunc_00170340_9c:
	ldrb	r3, [r1]
.Lfunc_00170340_a0:
	bic	r7, r1, #1
.Lfunc_00170340_a4:
	cmp	r3, #0
.Lfunc_00170340_a8:
	lsl	r6, r3, #26
.Lfunc_00170340_ac:
	lsr	r6, r6, #25
.Lfunc_00170340_b0:
	add	r6, r6, #2
.Lfunc_00170340_b4:
	add	r7, r7, r6
.Lfunc_00170340_b8:
	bne	.Lfunc_00170340_c4
.Lfunc_00170340_bc:
	cmp	r0, r5, lsl #1
.Lfunc_00170340_c0:
	bcs	.Lfunc_00170340_120
.Lfunc_00170340_c4:
	cmp	r7, r8
.Lfunc_00170340_c8:
	bcc	.Lfunc_00170340_dc
.Lfunc_00170340_cc:
	add	sp, sp, #64
.Lfunc_00170340_d0:
	mov	r0, #0
.Lfunc_00170340_d4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_00170340_d8:
	bx	lr
.Lfunc_00170340_dc:
	tst	r3, #128
.Lfunc_00170340_e0:
	beq	.Lfunc_00170340_fc
.Lfunc_00170340_e4:
	bic	r7, r0, #1
.Lfunc_00170340_e8:
	add	r7, r7, r6
.Lfunc_00170340_ec:
	and	sl, r7, #7
.Lfunc_00170340_f0:
	ldrb	fp, [r2, r7, lsr #3]
.Lfunc_00170340_f4:
	orr	sl, fp, r4, lsl sl
.Lfunc_00170340_f8:
	strb	sl, [r2, r7, lsr #3]
.Lfunc_00170340_fc:
	tst	r3, #64
.Lfunc_00170340_100:
	beq	.Lfunc_00170340_120
.Lfunc_00170340_104:
	bic	r3, r0, #1
.Lfunc_00170340_108:
	add	r3, r3, r6
.Lfunc_00170340_10c:
	add	r3, r3, #1
.Lfunc_00170340_110:
	and	r6, r3, #7
.Lfunc_00170340_114:
	ldrb	r7, [r2, r3, lsr #3]
.Lfunc_00170340_118:
	orr	r6, r7, r4, lsl r6
.Lfunc_00170340_11c:
	strb	r6, [r2, r3, lsr #3]
.Lfunc_00170340_120:
	add	ip, ip, #1
.Lfunc_00170340_124:
	cmp	r9, ip
.Lfunc_00170340_128:
	add	r0, r0, #1
.Lfunc_00170340_12c:
	add	r1, r1, #1
.Lfunc_00170340_130:
	bgt	.Lfunc_00170340_8c
.Lfunc_00170340_134:
	add	sp, sp, #64
.Lfunc_00170340_138:
	mov	r0, #1
.Lfunc_00170340_13c:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_00170340_140:
	bx	lr
.size func_00170340, .-func_00170340

.section .text.func_003C5F44,"ax",%progbits
.balign 4
.global func_003C5F44
.type func_003C5F44, %function
func_003C5F44:
.Lfunc_003C5F44_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_003C5F44_4:
	vldr	s7, [r1, #24]
.Lfunc_003C5F44_8:
	vldr	s6, [r1, #28]
.Lfunc_003C5F44_c:
	vldr	s5, [r1, #32]
.Lfunc_003C5F44_10:
	vcvt.f32.s32	s7, s7
.Lfunc_003C5F44_14:
	vldr	s4, [r1, #20]
.Lfunc_003C5F44_18:
	vcvt.f32.s32	s8, s6
.Lfunc_003C5F44_1c:
	vcvt.f32.s32	s9, s5
.Lfunc_003C5F44_20:
	vcvt.f32.s32	s5, s4
.Lfunc_003C5F44_24:
	ldr	r3, [r1, #12]
.Lfunc_003C5F44_28:
	ldr	ip, [r1, #8]
.Lfunc_003C5F44_2c:
	ldr	r5, [r1, #4]
.Lfunc_003C5F44_30:
	ldr	r4, [r1, #16]
.Lfunc_003C5F44_34:
	add	r8, ip, r3
.Lfunc_003C5F44_38:
	vmul.f32	s6, s7, s1
.Lfunc_003C5F44_3c:
	add	r5, r5, ip
.Lfunc_003C5F44_40:
	vmul.f32	s7, s8, s2
.Lfunc_003C5F44_44:
	vmul.f32	s8, s9, s3
.Lfunc_003C5F44_48:
	vmul.f32	s3, s5, s0
.Lfunc_003C5F44_4c:
	add	r6, r4, r3
.Lfunc_003C5F44_50:
	add	r7, r5, r3
.Lfunc_003C5F44_54:
	cmp	r6, #16
.Lfunc_003C5F44_58:
	vcvt.u32.f32	s5, s6
.Lfunc_003C5F44_5c:
	vcvt.u32.f32	s6, s7
.Lfunc_003C5F44_60:
	vcvt.u32.f32	s7, s8
.Lfunc_003C5F44_64:
	vcvt.u32.f32	s3, s3
.Lfunc_003C5F44_68:
	vmov	r9, s5
.Lfunc_003C5F44_6c:
	vmov	ip, s6
.Lfunc_003C5F44_70:
	vmov	r4, s7
.Lfunc_003C5F44_74:
	vmov	r5, s3
.Lfunc_003C5F44_78:
	lsl	r3, ip, r3
.Lfunc_003C5F44_7c:
	lsl	r5, r5, r7
.Lfunc_003C5F44_80:
	orr	ip, r5, r9, lsl r8
.Lfunc_003C5F44_84:
	orr	r3, r3, ip
.Lfunc_003C5F44_88:
	orr	r3, r3, r4
.Lfunc_003C5F44_8c:
	beq	.Lfunc_003C5F44_cc
.Lfunc_003C5F44_90:
	bgt	.Lfunc_003C5F44_b0
.Lfunc_003C5F44_94:
	cmp	r6, #4
.Lfunc_003C5F44_98:
	beq	.Lfunc_003C5F44_a8
.Lfunc_003C5F44_9c:
	cmp	r6, #8
.Lfunc_003C5F44_a0:
	ldreq	r0, [r0]
.Lfunc_003C5F44_a4:
	strbeq	r3, [r0, r2]
.Lfunc_003C5F44_a8:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_003C5F44_ac:
	bx	lr
.Lfunc_003C5F44_b0:
	cmp	r6, #24
.Lfunc_003C5F44_b4:
	beq	.Lfunc_003C5F44_e0
.Lfunc_003C5F44_b8:
	cmp	r6, #32
.Lfunc_003C5F44_bc:
	ldreq	r0, [r0]
.Lfunc_003C5F44_c0:
	streq	r3, [r0, r2, lsl #2]
.Lfunc_003C5F44_c4:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_003C5F44_c8:
	bx	lr
.Lfunc_003C5F44_cc:
	ldr	r0, [r0]
.Lfunc_003C5F44_d0:
	add	r0, r0, r2, lsl #1
.Lfunc_003C5F44_d4:
	strh	r3, [r0]
.Lfunc_003C5F44_d8:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_003C5F44_dc:
	bx	lr
.Lfunc_003C5F44_e0:
	vcvt.f32.s32	s3, s4
.Lfunc_003C5F44_e4:
	ldr	ip, [r0]
.Lfunc_003C5F44_e8:
	add	r2, r2, r2, lsl #1
.Lfunc_003C5F44_ec:
	add	r5, r2, #1
.Lfunc_003C5F44_f0:
	add	r4, r2, #2
.Lfunc_003C5F44_f4:
	vmul.f32	s0, s3, s0
.Lfunc_003C5F44_f8:
	vcvt.u32.f32	s0, s0
.Lfunc_003C5F44_fc:
	vmov	r3, s0
.Lfunc_003C5F44_100:
	strb	r3, [ip, r2]
.Lfunc_003C5F44_104:
	vldr	s0, [r1, #24]
.Lfunc_003C5F44_108:
	ldr	r3, [r0]
.Lfunc_003C5F44_10c:
	vcvt.f32.s32	s0, s0
.Lfunc_003C5F44_110:
	vmul.f32	s0, s0, s1
.Lfunc_003C5F44_114:
	vcvt.u32.f32	s0, s0
.Lfunc_003C5F44_118:
	vmov	r2, s0
.Lfunc_003C5F44_11c:
	strb	r2, [r3, r5]
.Lfunc_003C5F44_120:
	vldr	s0, [r1, #28]
.Lfunc_003C5F44_124:
	ldr	r1, [r0]
.Lfunc_003C5F44_128:
	vcvt.f32.s32	s0, s0
.Lfunc_003C5F44_12c:
	vmul.f32	s0, s0, s2
.Lfunc_003C5F44_130:
	vcvt.u32.f32	s0, s0
.Lfunc_003C5F44_134:
	vmov	r0, s0
.Lfunc_003C5F44_138:
	strb	r0, [r1, r4]
.Lfunc_003C5F44_13c:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_003C5F44_140:
	bx	lr
.size func_003C5F44, .-func_003C5F44

.section .text.func_002B80B0,"ax",%progbits
.balign 4
.global func_002B80B0
.type func_002B80B0, %function
func_002B80B0:
.Lfunc_002B80B0_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_002B80B0_4:
	mov	ip, #2624
.Lfunc_002B80B0_8:
	mov	r7, r1
.Lfunc_002B80B0_c:
	ldr	r2, [r0, #8]
.Lfunc_002B80B0_10:
	ldr	r4, [r0]
.Lfunc_002B80B0_14:
	mov	r6, #0
.Lfunc_002B80B0_18:
	cmp	r2, #2624
.Lfunc_002B80B0_1c:
	mov	r5, #1
.Lfunc_002B80B0_20:
	bcs	.Lfunc_002B80B0_a4
.Lfunc_002B80B0_24:
	cmp	r2, ip
.Lfunc_002B80B0_28:
	mov	r3, #0
.Lfunc_002B80B0_2c:
	bcs	.Lfunc_002B80B0_94
.Lfunc_002B80B0_30:
	add	r8, r2, r3
.Lfunc_002B80B0_34:
	ldrb	r8, [r4, r8]
.Lfunc_002B80B0_38:
	cmp	r8, #0
.Lfunc_002B80B0_3c:
	bne	.Lfunc_002B80B0_94
.Lfunc_002B80B0_40:
	add	r3, r3, #1
.Lfunc_002B80B0_44:
	cmp	r3, r1
.Lfunc_002B80B0_48:
	bne	.Lfunc_002B80B0_88
.Lfunc_002B80B0_4c:
	mov	r3, r2
.Lfunc_002B80B0_50:
	add	r1, r2, r7
.Lfunc_002B80B0_54:
	cmp	r1, r3
.Lfunc_002B80B0_58:
	bls	.Lfunc_002B80B0_6c
.Lfunc_002B80B0_5c:
	strb	r5, [r4, r3]
.Lfunc_002B80B0_60:
	add	r3, r3, #1
.Lfunc_002B80B0_64:
	cmp	r1, r3
.Lfunc_002B80B0_68:
	bhi	.Lfunc_002B80B0_5c
.Lfunc_002B80B0_6c:
	ldr	r3, [r0, #4]
.Lfunc_002B80B0_70:
	str	r1, [r0, #8]
.Lfunc_002B80B0_74:
	adds	r1, r3, r2, lsl #4
.Lfunc_002B80B0_78:
	movne	r0, r1
.Lfunc_002B80B0_7c:
	beq	.Lfunc_002B80B0_a4
.Lfunc_002B80B0_80:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_002B80B0_84:
	bx	lr
.Lfunc_002B80B0_88:
	add	r8, r2, r3
.Lfunc_002B80B0_8c:
	cmp	r8, ip
.Lfunc_002B80B0_90:
	bcc	.Lfunc_002B80B0_30
.Lfunc_002B80B0_94:
	add	r2, r2, r3
.Lfunc_002B80B0_98:
	add	r2, r2, #1
.Lfunc_002B80B0_9c:
	cmp	r2, ip
.Lfunc_002B80B0_a0:
	bcc	.Lfunc_002B80B0_24
.Lfunc_002B80B0_a4:
	ldr	ip, [r0, #8]
.Lfunc_002B80B0_a8:
	ldr	r4, [r0]
.Lfunc_002B80B0_ac:
	mov	r1, r7
.Lfunc_002B80B0_b0:
	cmp	ip, #0
.Lfunc_002B80B0_b4:
	mov	r2, #0
.Lfunc_002B80B0_b8:
	bls	.Lfunc_002B80B0_134
.Lfunc_002B80B0_bc:
	cmp	r2, ip
.Lfunc_002B80B0_c0:
	mov	r3, #0
.Lfunc_002B80B0_c4:
	bcs	.Lfunc_002B80B0_124
.Lfunc_002B80B0_c8:
	add	r7, r2, r3
.Lfunc_002B80B0_cc:
	ldrb	r7, [r4, r7]
.Lfunc_002B80B0_d0:
	cmp	r7, #0
.Lfunc_002B80B0_d4:
	bne	.Lfunc_002B80B0_124
.Lfunc_002B80B0_d8:
	add	r3, r3, #1
.Lfunc_002B80B0_dc:
	cmp	r3, r1
.Lfunc_002B80B0_e0:
	bne	.Lfunc_002B80B0_118
.Lfunc_002B80B0_e4:
	mov	r3, r2
.Lfunc_002B80B0_e8:
	add	r1, r1, r2
.Lfunc_002B80B0_ec:
	cmp	r1, r3
.Lfunc_002B80B0_f0:
	bls	.Lfunc_002B80B0_104
.Lfunc_002B80B0_f4:
	strb	r5, [r4, r3]
.Lfunc_002B80B0_f8:
	add	r3, r3, #1
.Lfunc_002B80B0_fc:
	cmp	r1, r3
.Lfunc_002B80B0_100:
	bhi	.Lfunc_002B80B0_f4
.Lfunc_002B80B0_104:
	ldr	r3, [r0, #4]
.Lfunc_002B80B0_108:
	str	r1, [r0, #8]
.Lfunc_002B80B0_10c:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_002B80B0_110:
	add	r0, r3, r2, lsl #4
.Lfunc_002B80B0_114:
	bx	lr
.Lfunc_002B80B0_118:
	add	r7, r2, r3
.Lfunc_002B80B0_11c:
	cmp	r7, ip
.Lfunc_002B80B0_120:
	bcc	.Lfunc_002B80B0_c8
.Lfunc_002B80B0_124:
	add	r2, r2, r3
.Lfunc_002B80B0_128:
	add	r2, r2, #1
.Lfunc_002B80B0_12c:
	cmp	r2, ip
.Lfunc_002B80B0_130:
	bcc	.Lfunc_002B80B0_bc
.Lfunc_002B80B0_134:
	mov	r0, r6
.Lfunc_002B80B0_138:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_002B80B0_13c:
	bx	lr
.size func_002B80B0, .-func_002B80B0

.section .text.func_004ED27C,"ax",%progbits
.balign 4
.global func_004ED27C
.type func_004ED27C, %function
func_004ED27C:
.Lfunc_004ED27C_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_004ED27C_4:
	mov	r5, #0
.Lfunc_004ED27C_8:
	mov	r8, r5
.Lfunc_004ED27C_c:
	mov	r6, #1
.Lfunc_004ED27C_10:
	ldr	sl, [r1]
.Lfunc_004ED27C_14:
	cmp	sl, #1
.Lfunc_004ED27C_18:
	ldrgt	r3, [r1, #16]
.Lfunc_004ED27C_1c:
	mvngt	fp, #0
.Lfunc_004ED27C_20:
	ble	.Lfunc_004ED27C_120
.Lfunc_004ED27C_24:
	cmp	r3, #0
.Lfunc_004ED27C_28:
	mla	r7, r5, r3, r8
.Lfunc_004ED27C_2c:
	ldrgt	r9, [r1, #56]
.Lfunc_004ED27C_30:
	vldrgt	s0, [r2, #16]
.Lfunc_004ED27C_34:
	mov	r5, #0
.Lfunc_004ED27C_38:
	ble	.Lfunc_004ED27C_d0
.Lfunc_004ED27C_3c:
	add	r4, r7, r5
.Lfunc_004ED27C_40:
	mov	ip, r2
.Lfunc_004ED27C_44:
	add	r4, r9, r4, lsl #5
.Lfunc_004ED27C_48:
	vldr	s1, [r4]
.Lfunc_004ED27C_4c:
	vcmpe.f32	s0, s1
.Lfunc_004ED27C_50:
	vmrs	APSR_nzcv, fpscr
.Lfunc_004ED27C_54:
	bcc	.Lfunc_004ED27C_c4
.Lfunc_004ED27C_58:
	vldr	s1, [ip]
.Lfunc_004ED27C_5c:
	vldr	s2, [r4, #16]
.Lfunc_004ED27C_60:
	vcmpe.f32	s1, s2
.Lfunc_004ED27C_64:
	vmrs	APSR_nzcv, fpscr
.Lfunc_004ED27C_68:
	bgt	.Lfunc_004ED27C_c4
.Lfunc_004ED27C_6c:
	vldr	s2, [ip, #24]
.Lfunc_004ED27C_70:
	vldr	s1, [r4, #8]
.Lfunc_004ED27C_74:
	vcmpe.f32	s2, s1
.Lfunc_004ED27C_78:
	vmrs	APSR_nzcv, fpscr
.Lfunc_004ED27C_7c:
	bcc	.Lfunc_004ED27C_c4
.Lfunc_004ED27C_80:
	vldr	s1, [ip, #8]
.Lfunc_004ED27C_84:
	vldr	s2, [r4, #24]
.Lfunc_004ED27C_88:
	vcmpe.f32	s1, s2
.Lfunc_004ED27C_8c:
	vmrs	APSR_nzcv, fpscr
.Lfunc_004ED27C_90:
	bgt	.Lfunc_004ED27C_c4
.Lfunc_004ED27C_94:
	vldr	s1, [ip, #20]
.Lfunc_004ED27C_98:
	vldr	s2, [r4, #4]
.Lfunc_004ED27C_9c:
	vcmpe.f32	s1, s2
.Lfunc_004ED27C_a0:
	vmrs	APSR_nzcv, fpscr
.Lfunc_004ED27C_a4:
	bcc	.Lfunc_004ED27C_c4
.Lfunc_004ED27C_a8:
	vldr	s1, [r2, #4]
.Lfunc_004ED27C_ac:
	vldr	s2, [r4, #20]
.Lfunc_004ED27C_b0:
	vcmpe.f32	s1, s2
.Lfunc_004ED27C_b4:
	vmrs	APSR_nzcv, fpscr
.Lfunc_004ED27C_b8:
	bgt	.Lfunc_004ED27C_c4
.Lfunc_004ED27C_bc:
	add	ip, r7, r5
.Lfunc_004ED27C_c0:
	b	.Lfunc_004ED27C_d4
.Lfunc_004ED27C_c4:
	add	r5, r5, #1
.Lfunc_004ED27C_c8:
	cmp	r5, r3
.Lfunc_004ED27C_cc:
	blt	.Lfunc_004ED27C_3c
.Lfunc_004ED27C_d0:
	mov	ip, fp
.Lfunc_004ED27C_d4:
	cmp	r6, #0
.Lfunc_004ED27C_d8:
	sub	r5, ip, r8
.Lfunc_004ED27C_dc:
	movne	ip, r3
.Lfunc_004ED27C_e0:
	moveq	ip, #1
.Lfunc_004ED27C_e4:
	cmpne	r6, #1
.Lfunc_004ED27C_e8:
	beq	.Lfunc_004ED27C_110
.Lfunc_004ED27C_ec:
	tst	r6, #1
.Lfunc_004ED27C_f0:
	muleq	ip, r3, r3
.Lfunc_004ED27C_f4:
	sub	r4, r6, #1
.Lfunc_004ED27C_f8:
	lsrs	r4, r4, #1
.Lfunc_004ED27C_fc:
	beq	.Lfunc_004ED27C_110
.Lfunc_004ED27C_100:
	mul	ip, ip, r3
.Lfunc_004ED27C_104:
	subs	r4, r4, #1
.Lfunc_004ED27C_108:
	mul	ip, ip, r3
.Lfunc_004ED27C_10c:
	bne	.Lfunc_004ED27C_100
.Lfunc_004ED27C_110:
	add	r6, r6, #1
.Lfunc_004ED27C_114:
	cmp	sl, r6
.Lfunc_004ED27C_118:
	add	r8, r8, ip
.Lfunc_004ED27C_11c:
	bgt	.Lfunc_004ED27C_24
.Lfunc_004ED27C_120:
	ldr	r1, [r1, #60]
.Lfunc_004ED27C_124:
	add	r2, r1, r5, lsl #3
.Lfunc_004ED27C_128:
	ldm	r2, {r1, r2}
.Lfunc_004ED27C_12c:
	stm	r0, {r1, r2}
.Lfunc_004ED27C_130:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_004ED27C_134:
	bx	lr
.size func_004ED27C, .-func_004ED27C

.section .text.func_00307AC8,"ax",%progbits
.balign 4
.global func_00307AC8
.type func_00307AC8, %function
func_00307AC8:
.Lfunc_00307AC8_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_00307AC8_4:
	mov	r6, #0
.Lfunc_00307AC8_8:
	ldr	r2, [r0, #4]
.Lfunc_00307AC8_c:
	ldr	r3, [r0]
.Lfunc_00307AC8_10:
	add	r3, r3, r2
.Lfunc_00307AC8_14:
	sub	r2, r2, #1
.Lfunc_00307AC8_18:
	sub	r3, r3, #1
.Lfunc_00307AC8_1c:
	bic	r2, r3, r2
.Lfunc_00307AC8_20:
	add	r3, r2, #60
.Lfunc_00307AC8_24:
	str	r3, [r0]
.Lfunc_00307AC8_28:
	ldr	r2, [r1, #32]
.Lfunc_00307AC8_2c:
	add	r2, r2, r2, lsl #1
.Lfunc_00307AC8_30:
	lsl	ip, r2, #2
.Lfunc_00307AC8_34:
	ldr	r2, [r0, #4]
.Lfunc_00307AC8_38:
	add	r3, r3, r2
.Lfunc_00307AC8_3c:
	sub	r2, r2, #1
.Lfunc_00307AC8_40:
	sub	r3, r3, #1
.Lfunc_00307AC8_44:
	bic	r2, r3, r2
.Lfunc_00307AC8_48:
	add	r2, r2, ip
.Lfunc_00307AC8_4c:
	str	r2, [r0]
.Lfunc_00307AC8_50:
	ldr	r3, [r1, #36]
.Lfunc_00307AC8_54:
	add	r2, r1, #36
.Lfunc_00307AC8_58:
	cmp	r3, #0
.Lfunc_00307AC8_5c:
	addne	r2, r2, r3
.Lfunc_00307AC8_60:
	ldr	r3, [r1, #32]
.Lfunc_00307AC8_64:
	moveq	r2, r6
.Lfunc_00307AC8_68:
	add	r4, r2, r3, lsl #2
.Lfunc_00307AC8_6c:
	ldr	r3, [r1, #36]
.Lfunc_00307AC8_70:
	add	r2, r1, #36
.Lfunc_00307AC8_74:
	cmp	r3, #0
.Lfunc_00307AC8_78:
	addne	r2, r2, r3
.Lfunc_00307AC8_7c:
	moveq	r2, r6
.Lfunc_00307AC8_80:
	cmp	r2, r4
.Lfunc_00307AC8_84:
	ldrne	ip, [r0, #4]
.Lfunc_00307AC8_88:
	subne	r5, ip, #1
.Lfunc_00307AC8_8c:
	beq	.Lfunc_00307AC8_dc
.Lfunc_00307AC8_90:
	ldr	r8, [r0]
.Lfunc_00307AC8_94:
	ldr	r3, [r2]
.Lfunc_00307AC8_98:
	add	r8, r8, ip
.Lfunc_00307AC8_9c:
	cmp	r3, #0
.Lfunc_00307AC8_a0:
	sub	r8, r8, #1
.Lfunc_00307AC8_a4:
	addne	r3, r3, r2
.Lfunc_00307AC8_a8:
	bic	r8, r8, r5
.Lfunc_00307AC8_ac:
	moveq	r3, r6
.Lfunc_00307AC8_b0:
	add	r8, r8, #128
.Lfunc_00307AC8_b4:
	str	r8, [r0]
.Lfunc_00307AC8_b8:
	ldr	r3, [r3, #4]
.Lfunc_00307AC8_bc:
	add	r8, r8, ip
.Lfunc_00307AC8_c0:
	sub	r8, r8, #1
.Lfunc_00307AC8_c4:
	bic	r8, r8, r5
.Lfunc_00307AC8_c8:
	add	r3, r8, r3, lsl #2
.Lfunc_00307AC8_cc:
	add	r2, r2, #4
.Lfunc_00307AC8_d0:
	cmp	r2, r4
.Lfunc_00307AC8_d4:
	str	r3, [r0]
.Lfunc_00307AC8_d8:
	bne	.Lfunc_00307AC8_90
.Lfunc_00307AC8_dc:
	ldr	r2, [r1, #24]
.Lfunc_00307AC8_e0:
	ldr	ip, [r0]
.Lfunc_00307AC8_e4:
	lsl	r3, r2, #3
.Lfunc_00307AC8_e8:
	ldr	r2, [r0, #4]
.Lfunc_00307AC8_ec:
	add	ip, ip, r2
.Lfunc_00307AC8_f0:
	sub	r2, r2, #1
.Lfunc_00307AC8_f4:
	sub	ip, ip, #1
.Lfunc_00307AC8_f8:
	bic	r2, ip, r2
.Lfunc_00307AC8_fc:
	add	r2, r2, r3
.Lfunc_00307AC8_100:
	str	r2, [r0]
.Lfunc_00307AC8_104:
	ldr	r1, [r1, #40]
.Lfunc_00307AC8_108:
	lsl	r3, r1, #3
.Lfunc_00307AC8_10c:
	ldr	r1, [r0, #4]
.Lfunc_00307AC8_110:
	add	r2, r2, r1
.Lfunc_00307AC8_114:
	sub	r1, r1, #1
.Lfunc_00307AC8_118:
	sub	r2, r2, #1
.Lfunc_00307AC8_11c:
	bic	r1, r2, r1
.Lfunc_00307AC8_120:
	add	r1, r1, r3
.Lfunc_00307AC8_124:
	str	r1, [r0]
.Lfunc_00307AC8_128:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_00307AC8_12c:
	bx	lr
.size func_00307AC8, .-func_00307AC8
```
