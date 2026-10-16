# Probe-verified ARM runtime/helper batch 70

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 5,936 executable body bytes (1,484 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and independently
assembled exact-schedule probes. The batch excludes every previously configured
function, including all functions assigned through runtime batch 69, IPC batch
65, and duplicate batch 69.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the current target
inventory, so no member belongs to an exact-duplicate family. The private
inspection artifacts used for selection are not part of this specification and
were not retained. Independent ARMv6K assembly comparison against target
revision `AS_EUR_REV2` on 2026-10-16 matched all twenty-four complete bodies
(5,936 bytes / 1,484 instructions).

## Structural inventory

| Function | Bytes | Instructions | Local branches | Memory operations |
| --- | ---: | ---: | ---: | ---: |
| `func_00122F4C` | 460 | 115 | 18 | 38 |
| `func_00498240` | 460 | 115 | 12 | 25 |
| `func_004991D4` | 436 | 109 | 12 | 25 |
| `func_002E1C0C` | 424 | 106 | 14 | 45 |
| `func_0042F378` | 400 | 100 | 18 | 26 |
| `func_004988F0` | 348 | 87 | 19 | 30 |
| `func_001D6878` | 340 | 85 | 12 | 32 |
| `func_004A7E60` | 336 | 84 | 15 | 27 |
| `func_00191090` | 292 | 73 | 13 | 10 |
| `func_00187FDC` | 180 | 45 | 6 | 11 |
| `func_0019CAD8` | 180 | 45 | 3 | 20 |
| `func_00540768` | 180 | 45 | 6 | 13 |
| `func_0013842C` | 176 | 44 | 4 | 29 |
| `func_001CAF84` | 176 | 44 | 13 | 9 |
| `func_0054971C` | 172 | 43 | 4 | 12 |
| `func_0012F8A4` | 168 | 42 | 8 | 11 |
| `func_00129F7C` | 164 | 41 | 3 | 23 |
| `func_00117618` | 160 | 40 | 8 | 9 |
| `func_001509D8` | 156 | 39 | 0 | 37 |
| `func_0014ADAC` | 152 | 38 | 8 | 13 |
| `func_001923D0` | 148 | 37 | 0 | 23 |
| `func_0019CC5C` | 148 | 37 | 3 | 18 |
| `func_001D4258` | 140 | 35 | 7 | 6 |
| `func_001F3E6C` | 140 | 35 | 3 | 15 |

Memory-operation counts include scalar and VFP loads/stores plus stack
transfers. Return transfers are excluded from the local-branch column.
The per-function counts total 209 direct function-local B-family sites: 182
conditional and 27 unconditional. The bodies also contain 45 separately
validated return transfers; these are not included in the local-branch total.

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

.section .text.func_00122F4C,"ax",%progbits
.balign 4
.global func_00122F4C
.type func_00122F4C, %function
func_00122F4C:
.Lfunc_00122F4C_0:
	push	{r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_00122F4C_4:
	sub	sp, sp, #4
.Lfunc_00122F4C_8:
	mov	r6, r0
.Lfunc_00122F4C_c:
	mvn	r9, #0
.Lfunc_00122F4C_10:
	ldrsb	r0, [r0, #4]
.Lfunc_00122F4C_14:
	cmp	r0, #16
.Lfunc_00122F4C_18:
	bge	.Lfunc_00122F4C_1c0
.Lfunc_00122F4C_1c:
	add	r1, r1, r3
.Lfunc_00122F4C_20:
	add	r0, r1, #3
.Lfunc_00122F4C_24:
	add	r2, r3, #3
.Lfunc_00122F4C_28:
	bic	r0, r0, #3
.Lfunc_00122F4C_2c:
	cmp	r1, r0
.Lfunc_00122F4C_30:
	bic	r8, r2, #3
.Lfunc_00122F4C_34:
	bcs	.Lfunc_00122F4C_44
.Lfunc_00122F4C_38:
	cmp	r0, #4
.Lfunc_00122F4C_3c:
	subcs	r0, r0, #4
.Lfunc_00122F4C_40:
	bcc	.Lfunc_00122F4C_1c0
.Lfunc_00122F4C_44:
	cmp	r8, r0
.Lfunc_00122F4C_48:
	bcs	.Lfunc_00122F4C_1c0
.Lfunc_00122F4C_4c:
	sub	r7, r0, r8
.Lfunc_00122F4C_50:
	cmp	r7, #68
.Lfunc_00122F4C_54:
	mov	sl, #68
.Lfunc_00122F4C_58:
	bcc	.Lfunc_00122F4C_1c0
.Lfunc_00122F4C_5c:
	mov	r0, #0
.Lfunc_00122F4C_60:
	str	r0, [sp]
.Lfunc_00122F4C_64:
	ldr	r5, [r6, #16]
.Lfunc_00122F4C_68:
	mov	fp, sp
.Lfunc_00122F4C_6c:
	mov	r4, #0
.Lfunc_00122F4C_70:
	ldr	r0, [r5]
.Lfunc_00122F4C_74:
	cmp	r0, #0
.Lfunc_00122F4C_78:
	bls	.Lfunc_00122F4C_1c0
.Lfunc_00122F4C_7c:
	cmp	r0, r4
.Lfunc_00122F4C_80:
	bhi	.Lfunc_00122F4C_94
.Lfunc_00122F4C_84:
	mov	r2, #0
.Lfunc_00122F4C_88:
	mov	r1, r2
.Lfunc_00122F4C_8c:
	mov	r0, r2
.Lfunc_00122F4C_90:
	mov	r0, r0
.Lfunc_00122F4C_94:
	ldr	r0, [r5]
.Lfunc_00122F4C_98:
	cmp	r0, r4
.Lfunc_00122F4C_9c:
	bls	.Lfunc_00122F4C_c8
.Lfunc_00122F4C_a0:
	ldr	r1, [r5, #4]
.Lfunc_00122F4C_a4:
	and	r2, r4, #7
.Lfunc_00122F4C_a8:
	ldrb	r1, [r1, r4, lsr #3]
.Lfunc_00122F4C_ac:
	lsr	r1, r1, r2
.Lfunc_00122F4C_b0:
	tst	r1, #1
.Lfunc_00122F4C_b4:
	beq	.Lfunc_00122F4C_c8
.Lfunc_00122F4C_b8:
	add	r4, r4, #1
.Lfunc_00122F4C_bc:
	cmp	r0, r4
.Lfunc_00122F4C_c0:
	bhi	.Lfunc_00122F4C_7c
.Lfunc_00122F4C_c4:
	b	.Lfunc_00122F4C_1c0
.Lfunc_00122F4C_c8:
	cmp	fp, #0
.Lfunc_00122F4C_cc:
	strne	r4, [sp]
.Lfunc_00122F4C_d0:
	ldr	r2, [sp]
.Lfunc_00122F4C_d4:
	ldr	r0, [sp, #12]
.Lfunc_00122F4C_d8:
	mov	r1, #0
.Lfunc_00122F4C_dc:
	stm	r8, {r1, r7}
.Lfunc_00122F4C_e0:
	sxtb	r9, r2
.Lfunc_00122F4C_e4:
	sub	r3, r7, sl
.Lfunc_00122F4C_e8:
	add	r2, r8, sl
.Lfunc_00122F4C_ec:
	strb	r9, [r8, #8]
.Lfunc_00122F4C_f0:
	add	ip, r2, r3
.Lfunc_00122F4C_f4:
	strb	r0, [r8, #9]
.Lfunc_00122F4C_f8:
	add	r3, r2, #3
.Lfunc_00122F4C_fc:
	str	r1, [r8, #16]
.Lfunc_00122F4C_100:
	add	r4, ip, #3
.Lfunc_00122F4C_104:
	strh	r1, [r8, #20]
.Lfunc_00122F4C_108:
	bic	r2, r4, #3
.Lfunc_00122F4C_10c:
	str	r1, [r8, #60]
.Lfunc_00122F4C_110:
	cmp	ip, r2
.Lfunc_00122F4C_114:
	add	r0, r8, #16
.Lfunc_00122F4C_118:
	bic	r3, r3, #3
.Lfunc_00122F4C_11c:
	str	r1, [r8, #64]
.Lfunc_00122F4C_120:
	bcs	.Lfunc_00122F4C_130
.Lfunc_00122F4C_124:
	cmp	r2, #4
.Lfunc_00122F4C_128:
	subcs	r2, r2, #4
.Lfunc_00122F4C_12c:
	bcc	.Lfunc_00122F4C_13c
.Lfunc_00122F4C_130:
	cmp	r3, r2
.Lfunc_00122F4C_134:
	subcc	r2, r2, r3
.Lfunc_00122F4C_138:
	strdcc	r2, [r0, #44]
.Lfunc_00122F4C_13c:
	add	r2, r0, #8
.Lfunc_00122F4C_140:
	str	r2, [r0, #12]
.Lfunc_00122F4C_144:
	mvn	r5, #0
.Lfunc_00122F4C_148:
	str	r2, [r0, #8]
.Lfunc_00122F4C_14c:
	str	r5, [r0, #16]
.Lfunc_00122F4C_150:
	str	r1, [r0, #24]
.Lfunc_00122F4C_154:
	str	r5, [r0, #20]
.Lfunc_00122F4C_158:
	mov	ip, #255
.Lfunc_00122F4C_15c:
	strh	r5, [r0, #28]
.Lfunc_00122F4C_160:
	strb	ip, [r0, #30]
.Lfunc_00122F4C_164:
	ldr	r0, [r6, #12]
.Lfunc_00122F4C_168:
	mov	r1, #0
.Lfunc_00122F4C_16c:
	movs	ip, r0
.Lfunc_00122F4C_170:
	ldrsbne	r2, [r8, #9]
.Lfunc_00122F4C_174:
	beq	.Lfunc_00122F4C_1ac
.Lfunc_00122F4C_178:
	ldrsb	r3, [r0, #9]
.Lfunc_00122F4C_17c:
	cmp	r3, r2
.Lfunc_00122F4C_180:
	bgt	.Lfunc_00122F4C_194
.Lfunc_00122F4C_184:
	mov	r1, r0
.Lfunc_00122F4C_188:
	ldr	r0, [r0]
.Lfunc_00122F4C_18c:
	cmp	r0, #0
.Lfunc_00122F4C_190:
	bne	.Lfunc_00122F4C_178
.Lfunc_00122F4C_194:
	cmp	r1, #0
.Lfunc_00122F4C_198:
	beq	.Lfunc_00122F4C_1ac
.Lfunc_00122F4C_19c:
	ldr	r0, [r1]
.Lfunc_00122F4C_1a0:
	str	r0, [r8]
.Lfunc_00122F4C_1a4:
	str	r8, [r1]
.Lfunc_00122F4C_1a8:
	b	.Lfunc_00122F4C_1b4
.Lfunc_00122F4C_1ac:
	str	ip, [r8]
.Lfunc_00122F4C_1b0:
	str	r8, [r6, #12]
.Lfunc_00122F4C_1b4:
	ldrb	r0, [r6, #4]
.Lfunc_00122F4C_1b8:
	add	r0, r0, #1
.Lfunc_00122F4C_1bc:
	strb	r0, [r6, #4]
.Lfunc_00122F4C_1c0:
	add	sp, sp, #20
.Lfunc_00122F4C_1c4:
	mov	r0, r9
.Lfunc_00122F4C_1c8:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00122F4C, .-func_00122F4C

.section .text.func_00498240,"ax",%progbits
.balign 4
.global func_00498240
.type func_00498240, %function
func_00498240:
.Lfunc_00498240_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
.Lfunc_00498240_4:
	mvn	r5, #0
.Lfunc_00498240_8:
	mov	r8, #0
.Lfunc_00498240_c:
	mov	r7, #8
.Lfunc_00498240_10:
	mov	ip, r8
.Lfunc_00498240_14:
	ldr	r4, [sp, #40]
.Lfunc_00498240_18:
	strh	r8, [r4]
.Lfunc_00498240_1c:
	add	r6, r4, ip, lsl #1
.Lfunc_00498240_20:
	subs	r7, r7, #1
.Lfunc_00498240_24:
	strh	r5, [r6, #2]
.Lfunc_00498240_28:
	strh	r5, [r6, #18]
.Lfunc_00498240_2c:
	add	ip, ip, #1
.Lfunc_00498240_30:
	strh	r5, [r6, #34]
.Lfunc_00498240_34:
	bne	.Lfunc_00498240_1c
.Lfunc_00498240_38:
	sub	r3, r3, r2
.Lfunc_00498240_3c:
	sxth	ip, r3
.Lfunc_00498240_40:
	subs	r3, ip, #2
.Lfunc_00498240_44:
	bmi	.Lfunc_00498240_190
.Lfunc_00498240_48:
	add	r3, r1, r2
.Lfunc_00498240_4c:
	sub	r1, ip, #2
.Lfunc_00498240_50:
	mov	r2, #0
.Lfunc_00498240_54:
	add	r1, r1, r1, lsr #31
.Lfunc_00498240_58:
	ldrh	fp, [r3], #2
.Lfunc_00498240_5c:
	asr	r1, r1, #1
.Lfunc_00498240_60:
	mov	r6, r2
.Lfunc_00498240_64:
	sxth	r9, r1
.Lfunc_00498240_68:
	mov	ip, r2
.Lfunc_00498240_6c:
	mov	r1, r2
.Lfunc_00498240_70:
	mov	r7, #1
.Lfunc_00498240_74:
	rsb	sl, r2, #9
.Lfunc_00498240_78:
	cmp	r1, r9
.Lfunc_00498240_7c:
	bge	.Lfunc_00498240_174
.Lfunc_00498240_80:
	cmp	r6, #0
.Lfunc_00498240_84:
	beq	.Lfunc_00498240_c4
.Lfunc_00498240_88:
	ldrb	r5, [r0, #4]
.Lfunc_00498240_8c:
	add	r8, r4, r2, lsl #1
.Lfunc_00498240_90:
	mov	r6, #0
.Lfunc_00498240_94:
	cmp	r5, #0
.Lfunc_00498240_98:
	add	r5, r3, r1, lsl #1
.Lfunc_00498240_9c:
	ldrsh	r5, [r5]
.Lfunc_00498240_a0:
	addeq	r5, r5, #256
.Lfunc_00498240_a4:
	addeq	r5, r5, #178
.Lfunc_00498240_a8:
	addne	r5, r5, #256
.Lfunc_00498240_ac:
	addne	r5, r5, #239
.Lfunc_00498240_b0:
	cmp	ip, #0
.Lfunc_00498240_b4:
	addeq	r2, r2, #1
.Lfunc_00498240_b8:
	strh	r5, [r8, #18]
.Lfunc_00498240_bc:
	sxtheq	r2, r2
.Lfunc_00498240_c0:
	b	.Lfunc_00498240_174
.Lfunc_00498240_c4:
	cmp	ip, #0
.Lfunc_00498240_c8:
	beq	.Lfunc_00498240_104
.Lfunc_00498240_cc:
	ldrb	ip, [r0, #4]
.Lfunc_00498240_d0:
	add	r8, r2, #1
.Lfunc_00498240_d4:
	add	r2, r4, r2, lsl #1
.Lfunc_00498240_d8:
	cmp	ip, #0
.Lfunc_00498240_dc:
	add	ip, r3, r1, lsl #1
.Lfunc_00498240_e0:
	ldrsh	ip, [ip]
.Lfunc_00498240_e4:
	addeq	r5, ip, #256
.Lfunc_00498240_e8:
	addeq	r5, r5, #178
.Lfunc_00498240_ec:
	addne	r5, ip, #256
.Lfunc_00498240_f0:
	addne	r5, r5, #239
.Lfunc_00498240_f4:
	strh	r5, [r2, #34]
.Lfunc_00498240_f8:
	sxth	r2, r8
.Lfunc_00498240_fc:
	mov	ip, #0
.Lfunc_00498240_100:
	b	.Lfunc_00498240_174
.Lfunc_00498240_104:
	ldrb	r5, [r0, #4]
.Lfunc_00498240_108:
	add	r8, r4, r2, lsl #1
.Lfunc_00498240_10c:
	cmp	r5, #0
.Lfunc_00498240_110:
	add	r5, r3, r1, lsl #1
.Lfunc_00498240_114:
	ldrsh	r5, [r5]
.Lfunc_00498240_118:
	addne	lr, r5, #256
.Lfunc_00498240_11c:
	addne	lr, lr, #239
.Lfunc_00498240_120:
	addeq	lr, r5, #256
.Lfunc_00498240_124:
	lsl	r5, r1, #1
.Lfunc_00498240_128:
	addeq	lr, lr, #178
.Lfunc_00498240_12c:
	lsr	r5, fp, r5
.Lfunc_00498240_130:
	and	r5, r5, #3
.Lfunc_00498240_134:
	cmp	r5, #1
.Lfunc_00498240_138:
	moveq	r6, #1
.Lfunc_00498240_13c:
	strh	lr, [r8, #2]
.Lfunc_00498240_140:
	beq	.Lfunc_00498240_174
.Lfunc_00498240_144:
	cmp	r5, #2
.Lfunc_00498240_148:
	moveq	ip, #1
.Lfunc_00498240_14c:
	beq	.Lfunc_00498240_174
.Lfunc_00498240_150:
	cmp	r5, #3
.Lfunc_00498240_154:
	moveq	r6, #1
.Lfunc_00498240_158:
	moveq	ip, r6
.Lfunc_00498240_15c:
	beq	.Lfunc_00498240_174
.Lfunc_00498240_160:
	mvn	r5, #0
.Lfunc_00498240_164:
	add	r2, r2, #1
.Lfunc_00498240_168:
	strh	r5, [r8, #18]
.Lfunc_00498240_16c:
	sxth	r2, r2
.Lfunc_00498240_170:
	strh	r5, [r8, #34]
.Lfunc_00498240_174:
	add	r1, r1, #1
.Lfunc_00498240_178:
	add	r7, r7, #1
.Lfunc_00498240_17c:
	sxth	r1, r1
.Lfunc_00498240_180:
	cmp	r7, sl
.Lfunc_00498240_184:
	blt	.Lfunc_00498240_78
.Lfunc_00498240_188:
	strh	r2, [r4]
.Lfunc_00498240_18c:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Lfunc_00498240_190:
	mov	r2, #0
.Lfunc_00498240_194:
	mov	r1, r2
.Lfunc_00498240_198:
	mov	r0, r2
.Lfunc_00498240_19c:
	mov	r0, r0
.Lfunc_00498240_1a0:
	mov	r0, #0
.Lfunc_00498240_1a4:
	mov	r1, #8
.Lfunc_00498240_1a8:
	strh	r8, [r4]
.Lfunc_00498240_1ac:
	add	r2, r4, r0, lsl #1
.Lfunc_00498240_1b0:
	subs	r1, r1, #1
.Lfunc_00498240_1b4:
	strh	r5, [r2, #2]
.Lfunc_00498240_1b8:
	strh	r5, [r2, #18]
.Lfunc_00498240_1bc:
	add	r0, r0, #1
.Lfunc_00498240_1c0:
	strh	r5, [r2, #34]
.Lfunc_00498240_1c4:
	bne	.Lfunc_00498240_1ac
.Lfunc_00498240_1c8:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.size func_00498240, .-func_00498240

.section .text.func_004991D4,"ax",%progbits
.balign 4
.global func_004991D4
.type func_004991D4, %function
func_004991D4:
.Lfunc_004991D4_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
.Lfunc_004991D4_4:
	mvn	r5, #0
.Lfunc_004991D4_8:
	mov	r8, #0
.Lfunc_004991D4_c:
	mov	r7, #8
.Lfunc_004991D4_10:
	mov	ip, r8
.Lfunc_004991D4_14:
	ldr	r4, [sp, #40]
.Lfunc_004991D4_18:
	strh	r8, [r4]
.Lfunc_004991D4_1c:
	add	r6, r4, ip, lsl #1
.Lfunc_004991D4_20:
	subs	r7, r7, #1
.Lfunc_004991D4_24:
	strh	r5, [r6, #2]
.Lfunc_004991D4_28:
	strh	r5, [r6, #18]
.Lfunc_004991D4_2c:
	add	ip, ip, #1
.Lfunc_004991D4_30:
	strh	r5, [r6, #34]
.Lfunc_004991D4_34:
	bne	.Lfunc_004991D4_1c
.Lfunc_004991D4_38:
	sub	r3, r3, r2
.Lfunc_004991D4_3c:
	sxth	ip, r3
.Lfunc_004991D4_40:
	subs	r3, ip, #2
.Lfunc_004991D4_44:
	bmi	.Lfunc_004991D4_178
.Lfunc_004991D4_48:
	add	r3, r1, r2
.Lfunc_004991D4_4c:
	sub	r1, ip, #2
.Lfunc_004991D4_50:
	mov	r2, #0
.Lfunc_004991D4_54:
	add	r1, r1, r1, lsr #31
.Lfunc_004991D4_58:
	ldrh	fp, [r3], #2
.Lfunc_004991D4_5c:
	asr	r1, r1, #1
.Lfunc_004991D4_60:
	mov	r6, r2
.Lfunc_004991D4_64:
	sxth	r9, r1
.Lfunc_004991D4_68:
	mov	ip, r2
.Lfunc_004991D4_6c:
	mov	r1, r2
.Lfunc_004991D4_70:
	mov	r7, #1
.Lfunc_004991D4_74:
	rsb	sl, r2, #9
.Lfunc_004991D4_78:
	cmp	r1, r9
.Lfunc_004991D4_7c:
	bge	.Lfunc_004991D4_15c
.Lfunc_004991D4_80:
	cmp	r6, #0
.Lfunc_004991D4_84:
	beq	.Lfunc_004991D4_bc
.Lfunc_004991D4_88:
	ldrb	r5, [r0, #4]
.Lfunc_004991D4_8c:
	add	r8, r4, r2, lsl #1
.Lfunc_004991D4_90:
	mov	r6, #0
.Lfunc_004991D4_94:
	cmp	r5, #0
.Lfunc_004991D4_98:
	add	r5, r3, r1, lsl #1
.Lfunc_004991D4_9c:
	ldrsh	r5, [r5]
.Lfunc_004991D4_a0:
	addeq	r5, r5, #65
.Lfunc_004991D4_a4:
	addne	r5, r5, #71
.Lfunc_004991D4_a8:
	cmp	ip, #0
.Lfunc_004991D4_ac:
	addeq	r2, r2, #1
.Lfunc_004991D4_b0:
	strh	r5, [r8, #18]
.Lfunc_004991D4_b4:
	sxtheq	r2, r2
.Lfunc_004991D4_b8:
	b	.Lfunc_004991D4_15c
.Lfunc_004991D4_bc:
	cmp	ip, #0
.Lfunc_004991D4_c0:
	beq	.Lfunc_004991D4_f4
.Lfunc_004991D4_c4:
	ldrb	ip, [r0, #4]
.Lfunc_004991D4_c8:
	add	r8, r2, #1
.Lfunc_004991D4_cc:
	add	r2, r4, r2, lsl #1
.Lfunc_004991D4_d0:
	cmp	ip, #0
.Lfunc_004991D4_d4:
	add	ip, r3, r1, lsl #1
.Lfunc_004991D4_d8:
	ldrsh	ip, [ip]
.Lfunc_004991D4_dc:
	addeq	r5, ip, #65
.Lfunc_004991D4_e0:
	addne	r5, ip, #71
.Lfunc_004991D4_e4:
	strh	r5, [r2, #34]
.Lfunc_004991D4_e8:
	sxth	r2, r8
.Lfunc_004991D4_ec:
	mov	ip, #0
.Lfunc_004991D4_f0:
	b	.Lfunc_004991D4_15c
.Lfunc_004991D4_f4:
	ldrb	r5, [r0, #4]
.Lfunc_004991D4_f8:
	add	r8, r4, r2, lsl #1
.Lfunc_004991D4_fc:
	cmp	r5, #0
.Lfunc_004991D4_100:
	add	r5, r3, r1, lsl #1
.Lfunc_004991D4_104:
	ldrsh	r5, [r5]
.Lfunc_004991D4_108:
	addne	lr, r5, #71
.Lfunc_004991D4_10c:
	addeq	lr, r5, #65
.Lfunc_004991D4_110:
	lsl	r5, r1, #1
.Lfunc_004991D4_114:
	strh	lr, [r8, #2]
.Lfunc_004991D4_118:
	lsr	r5, fp, r5
.Lfunc_004991D4_11c:
	and	r5, r5, #3
.Lfunc_004991D4_120:
	cmp	r5, #1
.Lfunc_004991D4_124:
	moveq	r6, #1
.Lfunc_004991D4_128:
	beq	.Lfunc_004991D4_15c
.Lfunc_004991D4_12c:
	cmp	r5, #2
.Lfunc_004991D4_130:
	moveq	ip, #1
.Lfunc_004991D4_134:
	beq	.Lfunc_004991D4_15c
.Lfunc_004991D4_138:
	cmp	r5, #3
.Lfunc_004991D4_13c:
	moveq	r6, #1
.Lfunc_004991D4_140:
	moveq	ip, r6
.Lfunc_004991D4_144:
	beq	.Lfunc_004991D4_15c
.Lfunc_004991D4_148:
	mvn	r5, #0
.Lfunc_004991D4_14c:
	add	r2, r2, #1
.Lfunc_004991D4_150:
	strh	r5, [r8, #18]
.Lfunc_004991D4_154:
	sxth	r2, r2
.Lfunc_004991D4_158:
	strh	r5, [r8, #34]
.Lfunc_004991D4_15c:
	add	r1, r1, #1
.Lfunc_004991D4_160:
	add	r7, r7, #1
.Lfunc_004991D4_164:
	sxth	r1, r1
.Lfunc_004991D4_168:
	cmp	r7, sl
.Lfunc_004991D4_16c:
	blt	.Lfunc_004991D4_78
.Lfunc_004991D4_170:
	strh	r2, [r4]
.Lfunc_004991D4_174:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Lfunc_004991D4_178:
	mov	r2, #0
.Lfunc_004991D4_17c:
	mov	r1, r2
.Lfunc_004991D4_180:
	mov	r0, r2
.Lfunc_004991D4_184:
	mov	r0, r0
.Lfunc_004991D4_188:
	mov	r0, #0
.Lfunc_004991D4_18c:
	mov	r1, #8
.Lfunc_004991D4_190:
	strh	r8, [r4]
.Lfunc_004991D4_194:
	add	r2, r4, r0, lsl #1
.Lfunc_004991D4_198:
	subs	r1, r1, #1
.Lfunc_004991D4_19c:
	strh	r5, [r2, #2]
.Lfunc_004991D4_1a0:
	strh	r5, [r2, #18]
.Lfunc_004991D4_1a4:
	add	r0, r0, #1
.Lfunc_004991D4_1a8:
	strh	r5, [r2, #34]
.Lfunc_004991D4_1ac:
	bne	.Lfunc_004991D4_194
.Lfunc_004991D4_1b0:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.size func_004991D4, .-func_004991D4

.section .text.func_002E1C0C,"ax",%progbits
.balign 4
.global func_002E1C0C
.type func_002E1C0C, %function
func_002E1C0C:
.Lfunc_002E1C0C_0:
	push	{r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_002E1C0C_4:
	sub	sp, sp, #20
.Lfunc_002E1C0C_8:
	mov	ip, #0
.Lfunc_002E1C0C_c:
	cmp	r2, #0
.Lfunc_002E1C0C_10:
	ldr	r3, [sp, #32]
.Lfunc_002E1C0C_14:
	str	ip, [r3]
.Lfunc_002E1C0C_18:
	ble	.Lfunc_002E1C0C_1a0
.Lfunc_002E1C0C_1c:
	cmp	r2, #7
.Lfunc_002E1C0C_20:
	movgt	r2, #7
.Lfunc_002E1C0C_24:
	str	r2, [sp, #4]
.Lfunc_002E1C0C_28:
	ldr	r4, [r0, #16]
.Lfunc_002E1C0C_2c:
	str	r4, [sp, #12]
.Lfunc_002E1C0C_30:
	ldrd	r8, [r0]
.Lfunc_002E1C0C_34:
	ldrd	r2, [r0, #8]
.Lfunc_002E1C0C_38:
	mov	r6, r9
.Lfunc_002E1C0C_3c:
	cmp	r4, #0
.Lfunc_002E1C0C_40:
	str	r2, [sp, #8]
.Lfunc_002E1C0C_44:
	str	r3, [sp]
.Lfunc_002E1C0C_48:
	bgt	.Lfunc_002E1C0C_74
.Lfunc_002E1C0C_4c:
	bne	.Lfunc_002E1C0C_1a0
.Lfunc_002E1C0C_50:
	mov	r3, r2
.Lfunc_002E1C0C_54:
	ldr	r2, [sp]
.Lfunc_002E1C0C_58:
	eor	r3, r3, r8
.Lfunc_002E1C0C_5c:
	eor	r2, r2, r6
.Lfunc_002E1C0C_60:
	orrs	r2, r2, r3
.Lfunc_002E1C0C_64:
	bne	.Lfunc_002E1C0C_74
.Lfunc_002E1C0C_68:
	cmp	r6, #0
.Lfunc_002E1C0C_6c:
	movge	r4, #7
.Lfunc_002E1C0C_70:
	blt	.Lfunc_002E1C0C_1a0
.Lfunc_002E1C0C_74:
	ldr	r3, [sp, #72]
.Lfunc_002E1C0C_78:
	ldrd	r2, [r3]
.Lfunc_002E1C0C_7c:
	subs	ip, r2, r8
.Lfunc_002E1C0C_80:
	sbcs	ip, r3, r6
.Lfunc_002E1C0C_84:
	blt	.Lfunc_002E1C0C_98
.Lfunc_002E1C0C_88:
	ldr	r2, [sp, #76]
.Lfunc_002E1C0C_8c:
	ldr	r2, [r2]
.Lfunc_002E1C0C_90:
	sub	r9, r4, r2
.Lfunc_002E1C0C_94:
	b	.Lfunc_002E1C0C_cc
.Lfunc_002E1C0C_98:
	ldr	ip, [sp]
.Lfunc_002E1C0C_9c:
	cmp	ip, #0
.Lfunc_002E1C0C_a0:
	addlt	r9, r4, #1
.Lfunc_002E1C0C_a4:
	blt	.Lfunc_002E1C0C_cc
.Lfunc_002E1C0C_a8:
	ldr	lr, [sp, #8]
.Lfunc_002E1C0C_ac:
	subs	r2, r2, lr
.Lfunc_002E1C0C_b0:
	sbcs	r2, r3, ip
.Lfunc_002E1C0C_b4:
	ldrlt	r9, [sp, #4]
.Lfunc_002E1C0C_b8:
	blt	.Lfunc_002E1C0C_cc
.Lfunc_002E1C0C_bc:
	ldr	r2, [sp, #76]
.Lfunc_002E1C0C_c0:
	ldr	r2, [r2]
.Lfunc_002E1C0C_c4:
	sub	r2, r4, r2
.Lfunc_002E1C0C_c8:
	add	r9, r2, #8
.Lfunc_002E1C0C_cc:
	ldr	r2, [sp, #4]
.Lfunc_002E1C0C_d0:
	mov	r5, #0
.Lfunc_002E1C0C_d4:
	cmp	r9, r2
.Lfunc_002E1C0C_d8:
	movgt	r9, r2
.Lfunc_002E1C0C_dc:
	cmp	r9, #0
.Lfunc_002E1C0C_e0:
	ble	.Lfunc_002E1C0C_144
.Lfunc_002E1C0C_e4:
	sub	r2, r4, r5
.Lfunc_002E1C0C_e8:
	add	r2, r2, #8
.Lfunc_002E1C0C_ec:
	add	r7, r1, r5, lsl #4
.Lfunc_002E1C0C_f0:
	asr	r3, r2, #31
.Lfunc_002E1C0C_f4:
	add	r3, r2, r3, lsr #29
.Lfunc_002E1C0C_f8:
	bic	r3, r3, #7
.Lfunc_002E1C0C_fc:
	sub	r2, r2, r3
.Lfunc_002E1C0C_100:
	add	r3, r0, r2, lsl #4
.Lfunc_002E1C0C_104:
	ldr	sl, [r3, #40]
.Lfunc_002E1C0C_108:
	add	lr, r3, #48
.Lfunc_002E1C0C_10c:
	add	r2, r3, #52
.Lfunc_002E1C0C_110:
	add	fp, r3, #54
.Lfunc_002E1C0C_114:
	str	sl, [r7]
.Lfunc_002E1C0C_118:
	ldr	r3, [r3, #44]
.Lfunc_002E1C0C_11c:
	add	r5, r5, #1
.Lfunc_002E1C0C_120:
	cmp	r9, r5
.Lfunc_002E1C0C_124:
	str	r3, [r7, #4]
.Lfunc_002E1C0C_128:
	ldr	r3, [lr]
.Lfunc_002E1C0C_12c:
	str	r3, [r7, #8]
.Lfunc_002E1C0C_130:
	ldrh	r2, [r2]
.Lfunc_002E1C0C_134:
	strh	r2, [r7, #12]
.Lfunc_002E1C0C_138:
	ldrh	r2, [fp]
.Lfunc_002E1C0C_13c:
	strh	r2, [r7, #14]
.Lfunc_002E1C0C_140:
	bgt	.Lfunc_002E1C0C_e4
.Lfunc_002E1C0C_144:
	ldr	ip, [r0, #16]
.Lfunc_002E1C0C_148:
	ldrd	r2, [r0]
.Lfunc_002E1C0C_14c:
	ldrd	sl, [r0, #8]
.Lfunc_002E1C0C_150:
	ldr	lr, [sp, #12]
.Lfunc_002E1C0C_154:
	cmp	ip, lr
.Lfunc_002E1C0C_158:
	bne	.Lfunc_002E1C0C_28
.Lfunc_002E1C0C_15c:
	eor	r2, r2, r8
.Lfunc_002E1C0C_160:
	eor	r3, r3, r6
.Lfunc_002E1C0C_164:
	orrs	r2, r2, r3
.Lfunc_002E1C0C_168:
	bne	.Lfunc_002E1C0C_28
.Lfunc_002E1C0C_16c:
	ldr	r3, [sp, #8]
.Lfunc_002E1C0C_170:
	ldr	r2, [sp]
.Lfunc_002E1C0C_174:
	eor	r3, r3, sl
.Lfunc_002E1C0C_178:
	eor	r2, r2, fp
.Lfunc_002E1C0C_17c:
	orrs	r2, r2, r3
.Lfunc_002E1C0C_180:
	bne	.Lfunc_002E1C0C_28
.Lfunc_002E1C0C_184:
	ldr	r1, [sp, #32]
.Lfunc_002E1C0C_188:
	ldr	r0, [sp, #72]
.Lfunc_002E1C0C_18c:
	str	r9, [r1]
.Lfunc_002E1C0C_190:
	str	r6, [r0, #4]
.Lfunc_002E1C0C_194:
	str	r8, [r0]
.Lfunc_002E1C0C_198:
	ldr	r0, [sp, #76]
.Lfunc_002E1C0C_19c:
	str	r4, [r0]
.Lfunc_002E1C0C_1a0:
	add	sp, sp, #36
.Lfunc_002E1C0C_1a4:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_002E1C0C, .-func_002E1C0C

.section .text.func_0042F378,"ax",%progbits
.balign 4
.global func_0042F378
.type func_0042F378, %function
func_0042F378:
.Lfunc_0042F378_0:
	push	{r3, r4, r5, r6, r7, r8, r9}
.Lfunc_0042F378_4:
	cmp	r0, #0
.Lfunc_0042F378_8:
	cmpne	r2, #0
.Lfunc_0042F378_c:
	mov	r7, #0
.Lfunc_0042F378_10:
	cmpne	r3, #0
.Lfunc_0042F378_14:
	str	r7, [r1]
.Lfunc_0042F378_18:
	beq	.Lfunc_0042F378_24
.Lfunc_0042F378_1c:
	tst	r3, #3
.Lfunc_0042F378_20:
	beq	.Lfunc_0042F378_30
.Lfunc_0042F378_24:
	pop	{r3, r4, r5, r6, r7, r8, r9}
.Lfunc_0042F378_28:
	mov	r0, #0
.Lfunc_0042F378_2c:
	bx	lr
.Lfunc_0042F378_30:
	cmp	r3, #0
.Lfunc_0042F378_34:
	mov	r6, #0
.Lfunc_0042F378_38:
	bls	.Lfunc_0042F378_168
.Lfunc_0042F378_3c:
	add	r8, r6, #4
.Lfunc_0042F378_40:
	cmp	r6, r8
.Lfunc_0042F378_44:
	mov	r5, #0
.Lfunc_0042F378_48:
	mov	ip, r6
.Lfunc_0042F378_4c:
	str	r7, [sp]
.Lfunc_0042F378_50:
	bcs	.Lfunc_0042F378_cc
.Lfunc_0042F378_54:
	ldrb	r4, [r2, ip]
.Lfunc_0042F378_58:
	sub	r9, r4, #65
.Lfunc_0042F378_5c:
	cmp	r9, #25
.Lfunc_0042F378_60:
	sxtbls	r4, r9
.Lfunc_0042F378_64:
	bls	.Lfunc_0042F378_8c
.Lfunc_0042F378_68:
	sub	r9, r4, #97
.Lfunc_0042F378_6c:
	cmp	r9, #25
.Lfunc_0042F378_70:
	subls	r4, r4, #71
.Lfunc_0042F378_74:
	bls	.Lfunc_0042F378_88
.Lfunc_0042F378_78:
	sub	r9, r4, #48
.Lfunc_0042F378_7c:
	cmp	r9, #9
.Lfunc_0042F378_80:
	addls	r4, r4, #4
.Lfunc_0042F378_84:
	bhi	.Lfunc_0042F378_174
.Lfunc_0042F378_88:
	sxtb	r4, r4
.Lfunc_0042F378_8c:
	cmp	r4, #0
.Lfunc_0042F378_90:
	blt	.Lfunc_0042F378_a8
.Lfunc_0042F378_94:
	ldr	r9, [sp]
.Lfunc_0042F378_98:
	and	r4, r4, #255
.Lfunc_0042F378_9c:
	add	r5, r5, #1
.Lfunc_0042F378_a0:
	orr	r4, r4, r9
.Lfunc_0042F378_a4:
	str	r4, [sp]
.Lfunc_0042F378_a8:
	sub	r4, ip, r6
.Lfunc_0042F378_ac:
	cmp	r4, #3
.Lfunc_0042F378_b0:
	beq	.Lfunc_0042F378_c0
.Lfunc_0042F378_b4:
	ldr	r4, [sp]
.Lfunc_0042F378_b8:
	lsl	r4, r4, #6
.Lfunc_0042F378_bc:
	str	r4, [sp]
.Lfunc_0042F378_c0:
	add	ip, ip, #1
.Lfunc_0042F378_c4:
	cmp	ip, r8
.Lfunc_0042F378_c8:
	bcc	.Lfunc_0042F378_54
.Lfunc_0042F378_cc:
	add	ip, r5, r5, lsl #1
.Lfunc_0042F378_d0:
	ldr	r5, [sp]
.Lfunc_0042F378_d4:
	lsl	ip, ip, #1
.Lfunc_0042F378_d8:
	mov	r4, sp
.Lfunc_0042F378_dc:
	lsr	ip, ip, #3
.Lfunc_0042F378_e0:
	rsb	ip, ip, #3
.Lfunc_0042F378_e4:
	lsl	r5, r5, #8
.Lfunc_0042F378_e8:
	cmp	ip, #3
.Lfunc_0042F378_ec:
	str	r5, [sp]
.Lfunc_0042F378_f0:
	bcs	.Lfunc_0042F378_15c
.Lfunc_0042F378_f4:
	rsb	ip, ip, #3
.Lfunc_0042F378_f8:
	tst	ip, #1
.Lfunc_0042F378_fc:
	add	r4, r4, #4
.Lfunc_0042F378_100:
	beq	.Lfunc_0042F378_120
.Lfunc_0042F378_104:
	ldr	r9, [r1]
.Lfunc_0042F378_108:
	ldrb	r8, [sp, #3]
.Lfunc_0042F378_10c:
	sub	r4, r4, #1
.Lfunc_0042F378_110:
	strb	r8, [r0, r9]
.Lfunc_0042F378_114:
	ldr	r5, [r1]
.Lfunc_0042F378_118:
	add	r5, r5, #1
.Lfunc_0042F378_11c:
	str	r5, [r1]
.Lfunc_0042F378_120:
	asrs	r5, ip, #1
.Lfunc_0042F378_124:
	beq	.Lfunc_0042F378_15c
.Lfunc_0042F378_128:
	ldr	r8, [r1]
.Lfunc_0042F378_12c:
	ldrb	ip, [r4, #-1]
.Lfunc_0042F378_130:
	subs	r5, r5, #1
.Lfunc_0042F378_134:
	strb	ip, [r0, r8]
.Lfunc_0042F378_138:
	ldr	ip, [r1]
.Lfunc_0042F378_13c:
	add	ip, ip, #1
.Lfunc_0042F378_140:
	str	ip, [r1]
.Lfunc_0042F378_144:
	ldrb	r9, [r4, #-2]!
.Lfunc_0042F378_148:
	strb	r9, [r0, ip]
.Lfunc_0042F378_14c:
	ldr	ip, [r1]
.Lfunc_0042F378_150:
	add	ip, ip, #1
.Lfunc_0042F378_154:
	str	ip, [r1]
.Lfunc_0042F378_158:
	bne	.Lfunc_0042F378_128
.Lfunc_0042F378_15c:
	add	r6, r6, #4
.Lfunc_0042F378_160:
	cmp	r6, r3
.Lfunc_0042F378_164:
	bcc	.Lfunc_0042F378_3c
.Lfunc_0042F378_168:
	pop	{r3, r4, r5, r6, r7, r8, r9}
.Lfunc_0042F378_16c:
	mov	r0, #1
.Lfunc_0042F378_170:
	bx	lr
.Lfunc_0042F378_174:
	cmp	r4, #46
.Lfunc_0042F378_178:
	moveq	r4, #62
.Lfunc_0042F378_17c:
	beq	.Lfunc_0042F378_94
.Lfunc_0042F378_180:
	cmp	r4, #45
.Lfunc_0042F378_184:
	moveq	r4, #63
.Lfunc_0042F378_188:
	beq	.Lfunc_0042F378_94
.Lfunc_0042F378_18c:
	b	.Lfunc_0042F378_a8
.size func_0042F378, .-func_0042F378

.section .text.func_004988F0,"ax",%progbits
.balign 4
.global func_004988F0
.type func_004988F0, %function
func_004988F0:
.Lfunc_004988F0_0:
	push	{r4, r5}
.Lfunc_004988F0_4:
	ldrsb	r3, [r0]
.Lfunc_004988F0_8:
	ldrsb	ip, [r1]
.Lfunc_004988F0_c:
	mov	r2, r0
.Lfunc_004988F0_10:
	mov	r0, #0
.Lfunc_004988F0_14:
	cmp	r3, ip
.Lfunc_004988F0_18:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_1c:
	ldrsb	r3, [r2, #1]
.Lfunc_004988F0_20:
	ldrsb	ip, [r1, #1]
.Lfunc_004988F0_24:
	cmp	r3, ip
.Lfunc_004988F0_28:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_2c:
	ldrsb	ip, [r2, #2]
.Lfunc_004988F0_30:
	ldrsb	r4, [r1, #2]
.Lfunc_004988F0_34:
	cmp	ip, r4
.Lfunc_004988F0_38:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_3c:
	ldrb	ip, [r2, #3]
.Lfunc_004988F0_40:
	ldrb	r4, [r1, #3]
.Lfunc_004988F0_44:
	cmp	ip, r4
.Lfunc_004988F0_48:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_4c:
	ldrsh	ip, [r2, #4]
.Lfunc_004988F0_50:
	ldrsh	r4, [r1, #4]
.Lfunc_004988F0_54:
	cmp	ip, r4
.Lfunc_004988F0_58:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_5c:
	ldrsh	r4, [r2, #6]
.Lfunc_004988F0_60:
	ldrsh	r5, [r1, #6]
.Lfunc_004988F0_64:
	cmp	r4, r5
.Lfunc_004988F0_68:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_6c:
	cmn	ip, #1
.Lfunc_004988F0_70:
	movne	r0, #1
.Lfunc_004988F0_74:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_78:
	ldr	r2, [r2, #8]
.Lfunc_004988F0_7c:
	cmp	r2, #0
.Lfunc_004988F0_80:
	ldrne	r1, [r1, #8]
.Lfunc_004988F0_84:
	cmpne	r1, #0
.Lfunc_004988F0_88:
	beq	.Lfunc_004988F0_130
.Lfunc_004988F0_8c:
	cmp	r3, #0
.Lfunc_004988F0_90:
	beq	.Lfunc_004988F0_e0
.Lfunc_004988F0_94:
	cmp	r3, #1
.Lfunc_004988F0_98:
	bne	.Lfunc_004988F0_130
.Lfunc_004988F0_9c:
	ldrsh	r3, [r2]
.Lfunc_004988F0_a0:
	ldrsh	ip, [r1]
.Lfunc_004988F0_a4:
	mov	r0, #1
.Lfunc_004988F0_a8:
	cmp	r3, ip
.Lfunc_004988F0_ac:
	bne	.Lfunc_004988F0_138
.Lfunc_004988F0_b0:
	ldrsh	r3, [r2, #2]
.Lfunc_004988F0_b4:
	ldrsh	ip, [r1, #2]
.Lfunc_004988F0_b8:
	cmp	r3, ip
.Lfunc_004988F0_bc:
	moveq	r3, #0
.Lfunc_004988F0_c0:
	bne	.Lfunc_004988F0_138
.Lfunc_004988F0_c4:
	add	ip, r2, r3, lsl #1
.Lfunc_004988F0_c8:
	add	r5, r1, r3, lsl #1
.Lfunc_004988F0_cc:
	ldrsh	r4, [ip, #4]
.Lfunc_004988F0_d0:
	ldrsh	ip, [r5, #4]
.Lfunc_004988F0_d4:
	cmp	r4, ip
.Lfunc_004988F0_d8:
	bne	.Lfunc_004988F0_138
.Lfunc_004988F0_dc:
	b	.Lfunc_004988F0_144
.Lfunc_004988F0_e0:
	ldrsh	r3, [r2]
.Lfunc_004988F0_e4:
	ldrsh	ip, [r1]
.Lfunc_004988F0_e8:
	mov	r0, #1
.Lfunc_004988F0_ec:
	cmp	r3, ip
.Lfunc_004988F0_f0:
	bne	.Lfunc_004988F0_138
.Lfunc_004988F0_f4:
	ldrsh	r3, [r2, #2]
.Lfunc_004988F0_f8:
	ldrsh	ip, [r1, #2]
.Lfunc_004988F0_fc:
	cmp	r3, ip
.Lfunc_004988F0_100:
	moveq	r3, #0
.Lfunc_004988F0_104:
	bne	.Lfunc_004988F0_138
.Lfunc_004988F0_108:
	add	ip, r2, r3, lsl #1
.Lfunc_004988F0_10c:
	add	r4, r1, r3, lsl #1
.Lfunc_004988F0_110:
	ldrsh	ip, [ip, #4]
.Lfunc_004988F0_114:
	ldrsh	r4, [r4, #4]
.Lfunc_004988F0_118:
	cmp	ip, r4
.Lfunc_004988F0_11c:
	bne	.Lfunc_004988F0_138
.Lfunc_004988F0_120:
	add	r3, r3, #1
.Lfunc_004988F0_124:
	sxth	r3, r3
.Lfunc_004988F0_128:
	cmp	r3, #14
.Lfunc_004988F0_12c:
	blt	.Lfunc_004988F0_108
.Lfunc_004988F0_130:
	pop	{r4, r5}
.Lfunc_004988F0_134:
	bx	lr
.Lfunc_004988F0_138:
	pop	{r4, r5}
.Lfunc_004988F0_13c:
	mov	r0, #0
.Lfunc_004988F0_140:
	bx	lr
.Lfunc_004988F0_144:
	add	r3, r3, #1
.Lfunc_004988F0_148:
	sxth	r3, r3
.Lfunc_004988F0_14c:
	cmp	r3, #13
.Lfunc_004988F0_150:
	blt	.Lfunc_004988F0_c4
.Lfunc_004988F0_154:
	pop	{r4, r5}
.Lfunc_004988F0_158:
	bx	lr
.size func_004988F0, .-func_004988F0

.section .text.func_001D6878,"ax",%progbits
.balign 4
.global func_001D6878
.type func_001D6878, %function
func_001D6878:
.Lfunc_001D6878_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_001D6878_4:
	cmp	r1, #0
.Lfunc_001D6878_8:
	mov	ip, #0
.Lfunc_001D6878_c:
	ble	.Lfunc_001D6878_118
.Lfunc_001D6878_10:
	mvn	lr, #0
.Lfunc_001D6878_14:
	mov	r9, #1
.Lfunc_001D6878_18:
	sub	sl, r1, #1
.Lfunc_001D6878_1c:
	mov	r8, #0
.Lfunc_001D6878_20:
	cmp	r1, #0
.Lfunc_001D6878_24:
	mov	r5, r8
.Lfunc_001D6878_28:
	mov	r4, r8
.Lfunc_001D6878_2c:
	ble	.Lfunc_001D6878_10c
.Lfunc_001D6878_30:
	cmp	r3, #0
.Lfunc_001D6878_34:
	moveq	r6, ip
.Lfunc_001D6878_38:
	moveq	r7, r4
.Lfunc_001D6878_3c:
	movne	r6, r4
.Lfunc_001D6878_40:
	movne	r7, ip
.Lfunc_001D6878_44:
	cmp	r4, #0
.Lfunc_001D6878_48:
	beq	.Lfunc_001D6878_84
.Lfunc_001D6878_4c:
	ldr	fp, [r2, r6, lsl #2]
.Lfunc_001D6878_50:
	cmp	r4, sl
.Lfunc_001D6878_54:
	ldrb	fp, [fp, r7]
.Lfunc_001D6878_58:
	bne	.Lfunc_001D6878_e0
.Lfunc_001D6878_5c:
	cmp	fp, r8
.Lfunc_001D6878_60:
	bne	.Lfunc_001D6878_a8
.Lfunc_001D6878_64:
	ldr	r8, [r0, ip, lsl #2]
.Lfunc_001D6878_68:
	cmp	fp, #255
.Lfunc_001D6878_6c:
	subeq	r5, r5, #1
.Lfunc_001D6878_70:
	addne	r5, r5, #1
.Lfunc_001D6878_74:
	ldr	fp, [r8]
.Lfunc_001D6878_78:
	sxtb	r5, r5
.Lfunc_001D6878_7c:
	str	r5, [r8, fp, lsl #2]
.Lfunc_001D6878_80:
	b	.Lfunc_001D6878_f8
.Lfunc_001D6878_84:
	ldr	r8, [r2, r6, lsl #2]
.Lfunc_001D6878_88:
	ldrb	r8, [r8, r7]
.Lfunc_001D6878_8c:
	cmp	r8, #255
.Lfunc_001D6878_90:
	ldr	r8, [r0, ip, lsl #2]
.Lfunc_001D6878_94:
	subeq	r5, r5, #1
.Lfunc_001D6878_98:
	addne	r5, r5, #1
.Lfunc_001D6878_9c:
	sxtb	r5, r5
.Lfunc_001D6878_a0:
	str	r9, [r8]
.Lfunc_001D6878_a4:
	b	.Lfunc_001D6878_f8
.Lfunc_001D6878_a8:
	ldr	r8, [r0, ip, lsl #2]
.Lfunc_001D6878_ac:
	ldr	fp, [r8]
.Lfunc_001D6878_b0:
	str	r5, [r8, fp, lsl #2]
.Lfunc_001D6878_b4:
	ldr	fp, [r0, ip, lsl #2]
.Lfunc_001D6878_b8:
	ldr	r8, [fp]
.Lfunc_001D6878_bc:
	add	r8, r8, #1
.Lfunc_001D6878_c0:
	str	r8, [fp]
.Lfunc_001D6878_c4:
	ldr	fp, [r2, r6, lsl #2]
.Lfunc_001D6878_c8:
	ldrb	fp, [fp, r7]
.Lfunc_001D6878_cc:
	cmp	fp, #255
.Lfunc_001D6878_d0:
	ldr	fp, [r0, ip, lsl #2]
.Lfunc_001D6878_d4:
	streq	lr, [fp, r8, lsl #2]
.Lfunc_001D6878_d8:
	strne	r9, [fp, r8, lsl #2]
.Lfunc_001D6878_dc:
	b	.Lfunc_001D6878_f8
.Lfunc_001D6878_e0:
	cmp	fp, r8
.Lfunc_001D6878_e4:
	bne	.Lfunc_001D6878_120
.Lfunc_001D6878_e8:
	cmp	fp, #255
.Lfunc_001D6878_ec:
	subeq	r5, r5, #1
.Lfunc_001D6878_f0:
	addne	r5, r5, #1
.Lfunc_001D6878_f4:
	sxtb	r5, r5
.Lfunc_001D6878_f8:
	ldr	r6, [r2, r6, lsl #2]
.Lfunc_001D6878_fc:
	add	r4, r4, #1
.Lfunc_001D6878_100:
	cmp	r4, r1
.Lfunc_001D6878_104:
	ldrb	r8, [r6, r7]
.Lfunc_001D6878_108:
	blt	.Lfunc_001D6878_30
.Lfunc_001D6878_10c:
	add	ip, ip, #1
.Lfunc_001D6878_110:
	cmp	ip, r1
.Lfunc_001D6878_114:
	blt	.Lfunc_001D6878_1c
.Lfunc_001D6878_118:
	mov	r0, #1
.Lfunc_001D6878_11c:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Lfunc_001D6878_120:
	ldr	r8, [r0, ip, lsl #2]
.Lfunc_001D6878_124:
	ldr	fp, [r8]
.Lfunc_001D6878_128:
	str	r5, [r8, fp, lsl #2]
.Lfunc_001D6878_12c:
	ldr	r5, [r0, ip, lsl #2]
.Lfunc_001D6878_130:
	ldr	r8, [r5]
.Lfunc_001D6878_134:
	add	r8, r8, #1
.Lfunc_001D6878_138:
	str	r8, [r5]
.Lfunc_001D6878_13c:
	ldr	r5, [r2, r6, lsl #2]
.Lfunc_001D6878_140:
	ldrb	r5, [r5, r7]
.Lfunc_001D6878_144:
	cmp	r5, #255
.Lfunc_001D6878_148:
	mvneq	r5, #0
.Lfunc_001D6878_14c:
	movne	r5, #1
.Lfunc_001D6878_150:
	b	.Lfunc_001D6878_f8
.size func_001D6878, .-func_001D6878

.section .text.func_004A7E60,"ax",%progbits
.balign 4
.global func_004A7E60
.type func_004A7E60, %function
func_004A7E60:
.Lfunc_004A7E60_0:
	push	{r4, r5, r6, r7}
.Lfunc_004A7E60_4:
	ldrb	r3, [r1]
.Lfunc_004A7E60_8:
	cmp	r3, #1
.Lfunc_004A7E60_c:
	ldreq	r3, [r0, #4]
.Lfunc_004A7E60_10:
	ldrne	r3, [r0]
.Lfunc_004A7E60_14:
	add	r3, r0, r3, lsl #2
.Lfunc_004A7E60_18:
	mvn	r0, #0
.Lfunc_004A7E60_1c:
	ldr	r3, [r3, #16]
.Lfunc_004A7E60_20:
	ldr	r4, [r3, #48]
.Lfunc_004A7E60_24:
	ldr	ip, [r3, #56]
.Lfunc_004A7E60_28:
	ldr	r6, [r3, #52]
.Lfunc_004A7E60_2c:
	add	r5, r4, r3
.Lfunc_004A7E60_30:
	add	r7, ip, r3
.Lfunc_004A7E60_34:
	cmp	r6, #0
.Lfunc_004A7E60_38:
	mov	r3, #0
.Lfunc_004A7E60_3c:
	bls	.Lfunc_004A7E60_134
.Lfunc_004A7E60_40:
	add	ip, r5, r3, lsl #3
.Lfunc_004A7E60_44:
	ldr	ip, [ip, #4]
.Lfunc_004A7E60_48:
	uxth	ip, ip
.Lfunc_004A7E60_4c:
	sub	r4, ip, #120
.Lfunc_004A7E60_50:
	cmp	r4, #16
.Lfunc_004A7E60_54:
	subcs	r4, ip, #112
.Lfunc_004A7E60_58:
	cmpcs	r4, #3
.Lfunc_004A7E60_5c:
	subcs	r4, ip, #16
.Lfunc_004A7E60_60:
	cmpcs	r4, #95
.Lfunc_004A7E60_64:
	bcc	.Lfunc_004A7E60_70
.Lfunc_004A7E60_68:
	cmp	ip, #15
.Lfunc_004A7E60_6c:
	bge	.Lfunc_004A7E60_134
.Lfunc_004A7E60_70:
	add	r0, r0, #1
.Lfunc_004A7E60_74:
	cmp	r0, r2
.Lfunc_004A7E60_78:
	bne	.Lfunc_004A7E60_140
.Lfunc_004A7E60_7c:
	add	r2, r5, r3, lsl #3
.Lfunc_004A7E60_80:
	ldr	r0, [r2]
.Lfunc_004A7E60_84:
	add	r0, r0, r7
.Lfunc_004A7E60_88:
	str	r0, [r1, #4]
.Lfunc_004A7E60_8c:
	ldr	r0, [r2, #4]
.Lfunc_004A7E60_90:
	and	r0, r0, #255
.Lfunc_004A7E60_94:
	strb	r0, [r1, #2]
.Lfunc_004A7E60_98:
	ldr	r2, [r2, #4]
.Lfunc_004A7E60_9c:
	cmp	r0, #120
.Lfunc_004A7E60_a0:
	lsl	r2, r2, #8
.Lfunc_004A7E60_a4:
	lsr	r2, r2, #24
.Lfunc_004A7E60_a8:
	strb	r2, [r1, #3]
.Lfunc_004A7E60_ac:
	bcc	.Lfunc_004A7E60_d0
.Lfunc_004A7E60_b0:
	ldrb	r3, [r1, #1]
.Lfunc_004A7E60_b4:
	sub	r0, r0, #120
.Lfunc_004A7E60_b8:
	sub	r2, r2, #120
.Lfunc_004A7E60_bc:
	strb	r0, [r1, #2]
.Lfunc_004A7E60_c0:
	cmp	r3, #4
.Lfunc_004A7E60_c4:
	strb	r2, [r1, #3]
.Lfunc_004A7E60_c8:
	beq	.Lfunc_004A7E60_11c
.Lfunc_004A7E60_cc:
	b	.Lfunc_004A7E60_134
.Lfunc_004A7E60_d0:
	cmp	r0, #112
.Lfunc_004A7E60_d4:
	bcc	.Lfunc_004A7E60_f8
.Lfunc_004A7E60_d8:
	ldrb	ip, [r1, #1]
.Lfunc_004A7E60_dc:
	sub	r3, r0, #112
.Lfunc_004A7E60_e0:
	sub	r0, r2, #112
.Lfunc_004A7E60_e4:
	strb	r3, [r1, #2]
.Lfunc_004A7E60_e8:
	cmp	ip, #3
.Lfunc_004A7E60_ec:
	strb	r0, [r1, #3]
.Lfunc_004A7E60_f0:
	beq	.Lfunc_004A7E60_11c
.Lfunc_004A7E60_f4:
	b	.Lfunc_004A7E60_134
.Lfunc_004A7E60_f8:
	cmp	r0, #16
.Lfunc_004A7E60_fc:
	bcc	.Lfunc_004A7E60_128
.Lfunc_004A7E60_100:
	ldrb	r3, [r1, #1]
.Lfunc_004A7E60_104:
	sub	r0, r0, #16
.Lfunc_004A7E60_108:
	sub	r2, r2, #16
.Lfunc_004A7E60_10c:
	strb	r0, [r1, #2]
.Lfunc_004A7E60_110:
	cmp	r3, #2
.Lfunc_004A7E60_114:
	strb	r2, [r1, #3]
.Lfunc_004A7E60_118:
	bne	.Lfunc_004A7E60_134
.Lfunc_004A7E60_11c:
	mov	r0, #1
.Lfunc_004A7E60_120:
	pop	{r4, r5, r6, r7}
.Lfunc_004A7E60_124:
	bx	lr
.Lfunc_004A7E60_128:
	ldrb	r0, [r1, #1]
.Lfunc_004A7E60_12c:
	cmp	r0, #1
.Lfunc_004A7E60_130:
	beq	.Lfunc_004A7E60_120
.Lfunc_004A7E60_134:
	pop	{r4, r5, r6, r7}
.Lfunc_004A7E60_138:
	mov	r0, #0
.Lfunc_004A7E60_13c:
	bx	lr
.Lfunc_004A7E60_140:
	add	r3, r3, #1
.Lfunc_004A7E60_144:
	cmp	r6, r3
.Lfunc_004A7E60_148:
	bhi	.Lfunc_004A7E60_40
.Lfunc_004A7E60_14c:
	b	.Lfunc_004A7E60_134
.size func_004A7E60, .-func_004A7E60

.section .text.func_00191090,"ax",%progbits
.balign 4
.global func_00191090
.type func_00191090, %function
func_00191090:
.Lfunc_00191090_0:
	push	{r4, r5, r6, r7, r8}
.Lfunc_00191090_4:
	mov	r6, #0
.Lfunc_00191090_8:
	mov	r4, r1
.Lfunc_00191090_c:
	mov	r5, r6
.Lfunc_00191090_10:
	sub	r2, r2, #1
.Lfunc_00191090_14:
	b	.Lfunc_00191090_a8
.Lfunc_00191090_18:
	and	ip, r3, #255
.Lfunc_00191090_1c:
	cmp	ip, #128
.Lfunc_00191090_20:
	bcs	.Lfunc_00191090_34
.Lfunc_00191090_24:
	sxtb	r3, ip
.Lfunc_00191090_28:
	sub	r2, r2, #1
.Lfunc_00191090_2c:
	strh	r3, [r4], #2
.Lfunc_00191090_30:
	b	.Lfunc_00191090_a0
.Lfunc_00191090_34:
	sub	r7, ip, #194
.Lfunc_00191090_38:
	cmp	r7, #29
.Lfunc_00191090_3c:
	bhi	.Lfunc_00191090_68
.Lfunc_00191090_40:
	lsl	r3, r3, #24
.Lfunc_00191090_44:
	ldrb	ip, [r0, #1]!
.Lfunc_00191090_48:
	lsr	r3, r3, #18
.Lfunc_00191090_4c:
	sub	r7, r3, #12288
.Lfunc_00191090_50:
	and	r3, ip, #255
.Lfunc_00191090_54:
	add	r3, r3, r7
.Lfunc_00191090_58:
	sub	r3, r3, #128
.Lfunc_00191090_5c:
	sub	r2, r2, #1
.Lfunc_00191090_60:
	strh	r3, [r4], #2
.Lfunc_00191090_64:
	b	.Lfunc_00191090_a0
.Lfunc_00191090_68:
	sub	r7, ip, #224
.Lfunc_00191090_6c:
	cmp	r7, #15
.Lfunc_00191090_70:
	bhi	.Lfunc_00191090_c4
.Lfunc_00191090_74:
	ldrb	ip, [r0, #1]
.Lfunc_00191090_78:
	lsl	r3, r3, #12
.Lfunc_00191090_7c:
	sub	r8, r3, #917504
.Lfunc_00191090_80:
	ldrb	r7, [r0, #2]!
.Lfunc_00191090_84:
	and	r3, ip, #255
.Lfunc_00191090_88:
	sub	r2, r2, #1
.Lfunc_00191090_8c:
	add	ip, r8, r3, lsl #6
.Lfunc_00191090_90:
	and	r3, r7, #255
.Lfunc_00191090_94:
	add	r3, r3, ip
.Lfunc_00191090_98:
	sub	r3, r3, #8320
.Lfunc_00191090_9c:
	strh	r3, [r4], #2
.Lfunc_00191090_a0:
	add	r6, r6, #1
.Lfunc_00191090_a4:
	add	r0, r0, #1
.Lfunc_00191090_a8:
	ldrsb	r3, [r0]
.Lfunc_00191090_ac:
	cmp	r3, #0
.Lfunc_00191090_b0:
	cmpne	r2, #0
.Lfunc_00191090_b4:
	beq	.Lfunc_00191090_100
.Lfunc_00191090_b8:
	cmp	r5, #0
.Lfunc_00191090_bc:
	beq	.Lfunc_00191090_18
.Lfunc_00191090_c0:
	b	.Lfunc_00191090_10c
.Lfunc_00191090_c4:
	sub	r3, ip, #240
.Lfunc_00191090_c8:
	cmp	r3, #4
.Lfunc_00191090_cc:
	subhi	r3, ip, #192
.Lfunc_00191090_d0:
	cmphi	r3, #1
.Lfunc_00191090_d4:
	bls	.Lfunc_00191090_f8
.Lfunc_00191090_d8:
	sub	r3, ip, #245
.Lfunc_00191090_dc:
	cmp	r3, #2
.Lfunc_00191090_e0:
	subhi	r3, ip, #248
.Lfunc_00191090_e4:
	cmphi	r3, #3
.Lfunc_00191090_e8:
	bls	.Lfunc_00191090_f8
.Lfunc_00191090_ec:
	sub	r3, ip, #252
.Lfunc_00191090_f0:
	cmp	r3, #1
.Lfunc_00191090_f4:
	subhi	r3, ip, #254
.Lfunc_00191090_f8:
	mov	r5, #1
.Lfunc_00191090_fc:
	b	.Lfunc_00191090_a4
.Lfunc_00191090_100:
	cmp	r5, #0
.Lfunc_00191090_104:
	addeq	r0, r6, #1
.Lfunc_00191090_108:
	beq	.Lfunc_00191090_114
.Lfunc_00191090_10c:
	mov	r4, r1
.Lfunc_00191090_110:
	mvn	r0, #0
.Lfunc_00191090_114:
	mov	r1, #0
.Lfunc_00191090_118:
	strh	r1, [r4]
.Lfunc_00191090_11c:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_00191090_120:
	bx	lr
.size func_00191090, .-func_00191090

.section .text.func_00187FDC,"ax",%progbits
.balign 4
.global func_00187FDC
.type func_00187FDC, %function
func_00187FDC:
.Lfunc_00187FDC_0:
	add	r1, r0, #12
.Lfunc_00187FDC_4:
	push	{r4, r5}
.Lfunc_00187FDC_8:
	ldm	r1, {r1, r2}
.Lfunc_00187FDC_c:
	cmp	r1, r2
.Lfunc_00187FDC_10:
	ble	.Lfunc_00187FDC_74
.Lfunc_00187FDC_14:
	add	r1, r1, #7
.Lfunc_00187FDC_18:
	bic	r1, r1, #7
.Lfunc_00187FDC_1c:
	mov	ip, #0
.Lfunc_00187FDC_20:
	asr	r2, r1, #31
.Lfunc_00187FDC_24:
	add	r1, r1, r2, lsr #29
.Lfunc_00187FDC_28:
	asr	r4, r1, #3
.Lfunc_00187FDC_2c:
	cmp	r4, #0
.Lfunc_00187FDC_30:
	ble	.Lfunc_00187FDC_74
.Lfunc_00187FDC_34:
	add	r1, r0, ip
.Lfunc_00187FDC_38:
	ldrb	r3, [r1, #20]
.Lfunc_00187FDC_3c:
	cmp	r3, #255
.Lfunc_00187FDC_40:
	movne	r1, #1
.Lfunc_00187FDC_44:
	movne	r2, #0
.Lfunc_00187FDC_48:
	beq	.Lfunc_00187FDC_68
.Lfunc_00187FDC_4c:
	tst	r3, r1
.Lfunc_00187FDC_50:
	beq	.Lfunc_00187FDC_80
.Lfunc_00187FDC_54:
	lsl	r1, r1, #25
.Lfunc_00187FDC_58:
	add	r2, r2, #1
.Lfunc_00187FDC_5c:
	cmp	r2, #8
.Lfunc_00187FDC_60:
	lsr	r1, r1, #24
.Lfunc_00187FDC_64:
	blt	.Lfunc_00187FDC_4c
.Lfunc_00187FDC_68:
	add	ip, ip, #1
.Lfunc_00187FDC_6c:
	cmp	ip, r4
.Lfunc_00187FDC_70:
	blt	.Lfunc_00187FDC_34
.Lfunc_00187FDC_74:
	pop	{r4, r5}
.Lfunc_00187FDC_78:
	mov	r0, #0
.Lfunc_00187FDC_7c:
	bx	lr
.Lfunc_00187FDC_80:
	add	r3, r0, ip
.Lfunc_00187FDC_84:
	add	r2, r2, ip, lsl #3
.Lfunc_00187FDC_88:
	ldrb	ip, [r3, #20]
.Lfunc_00187FDC_8c:
	orr	r1, r1, ip
.Lfunc_00187FDC_90:
	strb	r1, [r3, #20]
.Lfunc_00187FDC_94:
	ldr	r1, [r0, #16]
.Lfunc_00187FDC_98:
	add	r1, r1, #1
.Lfunc_00187FDC_9c:
	str	r1, [r0, #16]
.Lfunc_00187FDC_a0:
	ldr	r1, [r0, #8]
.Lfunc_00187FDC_a4:
	ldr	r0, [r0]
.Lfunc_00187FDC_a8:
	pop	{r4, r5}
.Lfunc_00187FDC_ac:
	mla	r0, r1, r2, r0
.Lfunc_00187FDC_b0:
	bx	lr
.size func_00187FDC, .-func_00187FDC

.section .text.func_0019CAD8,"ax",%progbits
.balign 4
.global func_0019CAD8
.type func_0019CAD8, %function
func_0019CAD8:
.Lfunc_0019CAD8_0:
	push	{r4, r5, r6, r7, r8, lr}
.Lfunc_0019CAD8_4:
	mov	r8, r0
.Lfunc_0019CAD8_8:
	mov	lr, #0
.Lfunc_0019CAD8_c:
	mov	r0, #0
.Lfunc_0019CAD8_10:
	subs	r2, r2, #4
.Lfunc_0019CAD8_14:
	blt	.Lfunc_0019CAD8_88
.Lfunc_0019CAD8_18:
	ldr	r7, [r8]
.Lfunc_0019CAD8_1c:
	ldr	r6, [r1], #4
.Lfunc_0019CAD8_20:
	adds	r7, r7, r0
.Lfunc_0019CAD8_24:
	adc	r0, lr, #0
.Lfunc_0019CAD8_28:
	umlal	r7, r0, r3, r6
.Lfunc_0019CAD8_2c:
	ldr	r5, [r8, #4]
.Lfunc_0019CAD8_30:
	ldr	r4, [r1], #4
.Lfunc_0019CAD8_34:
	str	r7, [r8], #4
.Lfunc_0019CAD8_38:
	adds	r5, r5, r0
.Lfunc_0019CAD8_3c:
	adc	r0, lr, #0
.Lfunc_0019CAD8_40:
	umlal	r5, r0, r3, r4
.Lfunc_0019CAD8_44:
	ldr	r7, [r8, #4]
.Lfunc_0019CAD8_48:
	ldr	r6, [r1], #4
.Lfunc_0019CAD8_4c:
	str	r5, [r8], #4
.Lfunc_0019CAD8_50:
	adds	r7, r7, r0
.Lfunc_0019CAD8_54:
	adc	r0, lr, #0
.Lfunc_0019CAD8_58:
	umlal	r7, r0, r3, r6
.Lfunc_0019CAD8_5c:
	ldr	r5, [r8, #4]
.Lfunc_0019CAD8_60:
	ldr	r4, [r1], #4
.Lfunc_0019CAD8_64:
	str	r7, [r8], #4
.Lfunc_0019CAD8_68:
	adds	r5, r5, r0
.Lfunc_0019CAD8_6c:
	adc	r0, lr, #0
.Lfunc_0019CAD8_70:
	umlal	r5, r0, r3, r4
.Lfunc_0019CAD8_74:
	subs	r2, r2, #4
.Lfunc_0019CAD8_78:
	ldrge	r7, [r8, #4]
.Lfunc_0019CAD8_7c:
	ldrge	r6, [r1], #4
.Lfunc_0019CAD8_80:
	str	r5, [r8], #4
.Lfunc_0019CAD8_84:
	bge	.Lfunc_0019CAD8_20
.Lfunc_0019CAD8_88:
	adds	r2, r2, #4
.Lfunc_0019CAD8_8c:
	pople	{r4, r5, r6, r7, r8, pc}
.Lfunc_0019CAD8_90:
	ldr	r7, [r8], #0
.Lfunc_0019CAD8_94:
	ldr	r6, [r1], #4
.Lfunc_0019CAD8_98:
	adds	r7, r7, r0
.Lfunc_0019CAD8_9c:
	adc	r0, lr, #0
.Lfunc_0019CAD8_a0:
	umlal	r7, r0, r3, r6
.Lfunc_0019CAD8_a4:
	subs	r2, r2, #1
.Lfunc_0019CAD8_a8:
	str	r7, [r8], #4
.Lfunc_0019CAD8_ac:
	bgt	.Lfunc_0019CAD8_90
.Lfunc_0019CAD8_b0:
	pop	{r4, r5, r6, r7, r8, pc}
.size func_0019CAD8, .-func_0019CAD8

.section .text.func_00540768,"ax",%progbits
.balign 4
.global func_00540768
.type func_00540768, %function
func_00540768:
.Lfunc_00540768_0:
	add	r3, r0, #8
.Lfunc_00540768_4:
	push	{r4}
.Lfunc_00540768_8:
	ldm	r3, {r3, ip}
.Lfunc_00540768_c:
	mov	r2, ip
.Lfunc_00540768_10:
	cmp	r3, r2
.Lfunc_00540768_14:
	ldrne	r4, [r3]
.Lfunc_00540768_18:
	cmpne	r4, r1
.Lfunc_00540768_1c:
	addne	r3, r3, #4
.Lfunc_00540768_20:
	bne	.Lfunc_00540768_10
.Lfunc_00540768_24:
	cmp	r3, ip
.Lfunc_00540768_28:
	mov	r2, r3
.Lfunc_00540768_2c:
	beq	.Lfunc_00540768_88
.Lfunc_00540768_30:
	add	r3, r2, #4
.Lfunc_00540768_34:
	sub	ip, ip, r3
.Lfunc_00540768_38:
	asr	r4, ip, #2
.Lfunc_00540768_3c:
	cmp	r4, #0
.Lfunc_00540768_40:
	ble	.Lfunc_00540768_88
.Lfunc_00540768_44:
	lsls	r4, ip, #29
.Lfunc_00540768_48:
	bpl	.Lfunc_00540768_5c
.Lfunc_00540768_4c:
	ldr	r4, [r3]
.Lfunc_00540768_50:
	add	r3, r3, #4
.Lfunc_00540768_54:
	cmp	r4, r1
.Lfunc_00540768_58:
	strne	r4, [r2], #4
.Lfunc_00540768_5c:
	asrs	ip, ip, #3
.Lfunc_00540768_60:
	beq	.Lfunc_00540768_88
.Lfunc_00540768_64:
	ldr	r4, [r3]
.Lfunc_00540768_68:
	cmp	r4, r1
.Lfunc_00540768_6c:
	strne	r4, [r2], #4
.Lfunc_00540768_70:
	ldr	r4, [r3, #4]!
.Lfunc_00540768_74:
	add	r3, r3, #4
.Lfunc_00540768_78:
	cmp	r4, r1
.Lfunc_00540768_7c:
	strne	r4, [r2], #4
.Lfunc_00540768_80:
	subs	ip, ip, #1
.Lfunc_00540768_84:
	bne	.Lfunc_00540768_64
.Lfunc_00540768_88:
	ldr	r3, [r0, #12]
.Lfunc_00540768_8c:
	str	r2, [r0, #12]
.Lfunc_00540768_90:
	cmp	r3, r2
.Lfunc_00540768_94:
	movne	r3, #1
.Lfunc_00540768_98:
	moveq	r3, #0
.Lfunc_00540768_9c:
	cmp	r3, #0
.Lfunc_00540768_a0:
	movne	r0, #0
.Lfunc_00540768_a4:
	strne	r0, [r1, #12]
.Lfunc_00540768_a8:
	pop	{r4}
.Lfunc_00540768_ac:
	mov	r0, r3
.Lfunc_00540768_b0:
	bx	lr
.size func_00540768, .-func_00540768

.section .text.func_0013842C,"ax",%progbits
.balign 4
.global func_0013842C
.type func_0013842C, %function
func_0013842C:
.Lfunc_0013842C_0:
	ldr	r3, [r1, #4]
.Lfunc_0013842C_4:
	ldr	r2, [r3, #192]
.Lfunc_0013842C_8:
	cmp	r2, #0
.Lfunc_0013842C_c:
	ldreq	r2, [r3, #196]
.Lfunc_0013842C_10:
	cmpeq	r2, #0
.Lfunc_0013842C_14:
	bxne	lr
.Lfunc_0013842C_18:
	push	{r4, r5, r6, r7}
.Lfunc_0013842C_1c:
	add	r5, r0, #8
.Lfunc_0013842C_20:
	ldr	ip, [r0, #12]
.Lfunc_0013842C_24:
	ldrh	r6, [r3, #10]
.Lfunc_0013842C_28:
	ldr	r2, [ip, #196]
.Lfunc_0013842C_2c:
	cmp	r2, r5
.Lfunc_0013842C_30:
	movne	r4, r5
.Lfunc_0013842C_34:
	bne	.Lfunc_0013842C_58
.Lfunc_0013842C_38:
	str	r1, [ip, #196]
.Lfunc_0013842C_3c:
	ldr	r2, [r0, #12]
.Lfunc_0013842C_40:
	str	r1, [r2, #192]
.Lfunc_0013842C_44:
	ldr	r2, [r1, #4]
.Lfunc_0013842C_48:
	str	r5, [r2, #196]
.Lfunc_0013842C_4c:
	ldr	r1, [r1, #4]
.Lfunc_0013842C_50:
	str	r5, [r1, #192]
.Lfunc_0013842C_54:
	b	.Lfunc_0013842C_9c
.Lfunc_0013842C_58:
	ldr	ip, [r2, #4]
.Lfunc_0013842C_5c:
	ldrh	r7, [ip, #10]
.Lfunc_0013842C_60:
	cmp	r7, r6
.Lfunc_0013842C_64:
	bhi	.Lfunc_0013842C_78
.Lfunc_0013842C_68:
	mov	r4, r2
.Lfunc_0013842C_6c:
	ldr	r2, [ip, #196]
.Lfunc_0013842C_70:
	cmp	r2, r5
.Lfunc_0013842C_74:
	bne	.Lfunc_0013842C_58
.Lfunc_0013842C_78:
	str	r2, [r3, #196]
.Lfunc_0013842C_7c:
	ldr	ip, [r2, #4]
.Lfunc_0013842C_80:
	ldr	r3, [r1, #4]
.Lfunc_0013842C_84:
	ldr	ip, [ip, #192]
.Lfunc_0013842C_88:
	str	ip, [r3, #192]
.Lfunc_0013842C_8c:
	ldr	r3, [r4, #4]
.Lfunc_0013842C_90:
	str	r1, [r3, #196]
.Lfunc_0013842C_94:
	ldr	r2, [r2, #4]
.Lfunc_0013842C_98:
	str	r1, [r2, #192]
.Lfunc_0013842C_9c:
	ldrh	r1, [r0, #6]
.Lfunc_0013842C_a0:
	add	r1, r1, #1
.Lfunc_0013842C_a4:
	strh	r1, [r0, #6]
.Lfunc_0013842C_a8:
	pop	{r4, r5, r6, r7}
.Lfunc_0013842C_ac:
	bx	lr
.size func_0013842C, .-func_0013842C

.section .text.func_001CAF84,"ax",%progbits
.balign 4
.global func_001CAF84
.type func_001CAF84, %function
func_001CAF84:
.Lfunc_001CAF84_0:
	ldr	r2, [r2, #328]
.Lfunc_001CAF84_4:
	cmp	r2, #0
.Lfunc_001CAF84_8:
	bne	.Lfunc_001CAF84_a8
.Lfunc_001CAF84_c:
	ldr	r2, [r0, #16]
.Lfunc_001CAF84_10:
	ldr	r3, [r1, #16]
.Lfunc_001CAF84_14:
	cmp	r2, r3
.Lfunc_001CAF84_18:
	beq	.Lfunc_001CAF84_28
.Lfunc_001CAF84_1c:
	cmp	r2, #0
.Lfunc_001CAF84_20:
	bne	.Lfunc_001CAF84_94
.Lfunc_001CAF84_24:
	b	.Lfunc_001CAF84_8c
.Lfunc_001CAF84_28:
	cmp	r2, #1
.Lfunc_001CAF84_2c:
	bne	.Lfunc_001CAF84_3c
.Lfunc_001CAF84_30:
	mov	r2, r0
.Lfunc_001CAF84_34:
	mov	r0, r1
.Lfunc_001CAF84_38:
	mov	r1, r2
.Lfunc_001CAF84_3c:
	ldr	r2, [r0, #8]
.Lfunc_001CAF84_40:
	ldr	ip, [r1, #8]
.Lfunc_001CAF84_44:
	subs	r3, r2, ip
.Lfunc_001CAF84_48:
	movne	r0, r3
.Lfunc_001CAF84_4c:
	bne	.Lfunc_001CAF84_90
.Lfunc_001CAF84_50:
	cmp	r2, ip
.Lfunc_001CAF84_54:
	beq	.Lfunc_001CAF84_60
.Lfunc_001CAF84_58:
	bcc	.Lfunc_001CAF84_94
.Lfunc_001CAF84_5c:
	b	.Lfunc_001CAF84_8c
.Lfunc_001CAF84_60:
	ldr	r3, [r0, #4]
.Lfunc_001CAF84_64:
	ldr	r1, [r1, #4]
.Lfunc_001CAF84_68:
	sub	r0, r2, #1
.Lfunc_001CAF84_6c:
	cmn	r0, #1
.Lfunc_001CAF84_70:
	ble	.Lfunc_001CAF84_a8
.Lfunc_001CAF84_74:
	ldr	r2, [r3, r0, lsl #2]
.Lfunc_001CAF84_78:
	ldr	ip, [r1, r0, lsl #2]
.Lfunc_001CAF84_7c:
	cmp	r2, ip
.Lfunc_001CAF84_80:
	beq	.Lfunc_001CAF84_9c
.Lfunc_001CAF84_84:
	cmp	r2, ip
.Lfunc_001CAF84_88:
	bls	.Lfunc_001CAF84_94
.Lfunc_001CAF84_8c:
	mov	r0, #1
.Lfunc_001CAF84_90:
	bx	lr
.Lfunc_001CAF84_94:
	mvn	r0, #0
.Lfunc_001CAF84_98:
	bx	lr
.Lfunc_001CAF84_9c:
	sub	r0, r0, #1
.Lfunc_001CAF84_a0:
	cmn	r0, #1
.Lfunc_001CAF84_a4:
	bgt	.Lfunc_001CAF84_74
.Lfunc_001CAF84_a8:
	mov	r0, #0
.Lfunc_001CAF84_ac:
	bx	lr
.size func_001CAF84, .-func_001CAF84

.section .text.func_0054971C,"ax",%progbits
.balign 4
.global func_0054971C
.type func_0054971C, %function
func_0054971C:
.Lfunc_0054971C_0:
	vldr	s1, [r0, #24]
.Lfunc_0054971C_4:
	ldr	r2, [r0, #32]
.Lfunc_0054971C_8:
	vdiv.f32	s2, s0, s1
.Lfunc_0054971C_c:
	ldrb	r3, [r2]
.Lfunc_0054971C_10:
	vcvt.u32.f32	s1, s2
.Lfunc_0054971C_14:
	vmov	r1, s1
.Lfunc_0054971C_18:
	cmp	r3, r1
.Lfunc_0054971C_1c:
	movhi	r0, r2
.Lfunc_0054971C_20:
	bxhi	lr
.Lfunc_0054971C_24:
	push	{r4}
.Lfunc_0054971C_28:
	ldrh	ip, [r0, #14]
.Lfunc_0054971C_2c:
	mvn	r3, #5
.Lfunc_0054971C_30:
	add	r4, ip, ip, lsl #1
.Lfunc_0054971C_34:
	add	r3, r3, r4, lsl #1
.Lfunc_0054971C_38:
	add	r3, r3, r2
.Lfunc_0054971C_3c:
	ldrb	r4, [r3]
.Lfunc_0054971C_40:
	cmp	r1, r4
.Lfunc_0054971C_44:
	movcs	r0, r3
.Lfunc_0054971C_48:
	bcs	.Lfunc_0054971C_8c
.Lfunc_0054971C_4c:
	sub	r3, ip, #1
.Lfunc_0054971C_50:
	vmov	s1, r3
.Lfunc_0054971C_54:
	vldr	s2, [r0, #28]
.Lfunc_0054971C_58:
	vcvt.f32.s32	s1, s1
.Lfunc_0054971C_5c:
	vmul.f32	s0, s1, s0
.Lfunc_0054971C_60:
	vmul.f32	s0, s2, s0
.Lfunc_0054971C_64:
	vcvt.u32.f32	s0, s0
.Lfunc_0054971C_68:
	vmov	r0, s0
.Lfunc_0054971C_6c:
	add	r0, r0, r0, lsl #1
.Lfunc_0054971C_70:
	add	r0, r2, r0, lsl #1
.Lfunc_0054971C_74:
	ldrb	r2, [r0]
.Lfunc_0054971C_78:
	cmp	r1, r2
.Lfunc_0054971C_7c:
	bcs	.Lfunc_0054971C_94
.Lfunc_0054971C_80:
	ldrb	r2, [r0, #-6]!
.Lfunc_0054971C_84:
	cmp	r2, r1
.Lfunc_0054971C_88:
	bhi	.Lfunc_0054971C_80
.Lfunc_0054971C_8c:
	pop	{r4}
.Lfunc_0054971C_90:
	bx	lr
.Lfunc_0054971C_94:
	ldrb	r2, [r0, #6]!
.Lfunc_0054971C_98:
	cmp	r2, r1
.Lfunc_0054971C_9c:
	bls	.Lfunc_0054971C_94
.Lfunc_0054971C_a0:
	pop	{r4}
.Lfunc_0054971C_a4:
	sub	r0, r0, #6
.Lfunc_0054971C_a8:
	bx	lr
.size func_0054971C, .-func_0054971C

.section .text.func_0012F8A4,"ax",%progbits
.balign 4
.global func_0012F8A4
.type func_0012F8A4, %function
func_0012F8A4:
.Lfunc_0012F8A4_0:
	push	{r4, r5}
.Lfunc_0012F8A4_4:
	ldr	ip, [r0, #48]
.Lfunc_0012F8A4_8:
	cmp	ip, #0
.Lfunc_0012F8A4_c:
	beq	.Lfunc_0012F8A4_9c
.Lfunc_0012F8A4_10:
	and	r2, ip, #1
.Lfunc_0012F8A4_14:
	cmp	r2, #0
.Lfunc_0012F8A4_18:
	ldrhi	r4, [r0, #44]
.Lfunc_0012F8A4_1c:
	mov	r3, #0
.Lfunc_0012F8A4_20:
	bls	.Lfunc_0012F8A4_48
.Lfunc_0012F8A4_24:
	ldr	r5, [r4, r3, lsl #4]
.Lfunc_0012F8A4_28:
	cmp	r5, r1
.Lfunc_0012F8A4_2c:
	bne	.Lfunc_0012F8A4_3c
.Lfunc_0012F8A4_30:
	add	r0, r4, r3, lsl #4
.Lfunc_0012F8A4_34:
	pop	{r4, r5}
.Lfunc_0012F8A4_38:
	bx	lr
.Lfunc_0012F8A4_3c:
	add	r3, r3, #1
.Lfunc_0012F8A4_40:
	cmp	r2, r3
.Lfunc_0012F8A4_44:
	bhi	.Lfunc_0012F8A4_24
.Lfunc_0012F8A4_48:
	cmp	ip, r2
.Lfunc_0012F8A4_4c:
	ldrhi	r0, [r0, #44]
.Lfunc_0012F8A4_50:
	movhi	r3, #16
.Lfunc_0012F8A4_54:
	bls	.Lfunc_0012F8A4_9c
.Lfunc_0012F8A4_58:
	ldr	r4, [r0, r2, lsl #4]
.Lfunc_0012F8A4_5c:
	cmp	r4, r1
.Lfunc_0012F8A4_60:
	bne	.Lfunc_0012F8A4_70
.Lfunc_0012F8A4_64:
	pop	{r4, r5}
.Lfunc_0012F8A4_68:
	add	r0, r0, r2, lsl #4
.Lfunc_0012F8A4_6c:
	bx	lr
.Lfunc_0012F8A4_70:
	add	r4, r3, r2, lsl #4
.Lfunc_0012F8A4_74:
	ldr	r4, [r0, r4]
.Lfunc_0012F8A4_78:
	cmp	r4, r1
.Lfunc_0012F8A4_7c:
	bne	.Lfunc_0012F8A4_90
.Lfunc_0012F8A4_80:
	add	r1, r3, r2, lsl #4
.Lfunc_0012F8A4_84:
	pop	{r4, r5}
.Lfunc_0012F8A4_88:
	add	r0, r0, r1
.Lfunc_0012F8A4_8c:
	bx	lr
.Lfunc_0012F8A4_90:
	add	r2, r2, #2
.Lfunc_0012F8A4_94:
	cmp	ip, r2
.Lfunc_0012F8A4_98:
	bhi	.Lfunc_0012F8A4_58
.Lfunc_0012F8A4_9c:
	pop	{r4, r5}
.Lfunc_0012F8A4_a0:
	mov	r0, #0
.Lfunc_0012F8A4_a4:
	bx	lr
.size func_0012F8A4, .-func_0012F8A4

.section .text.func_00129F7C,"ax",%progbits
.balign 4
.global func_00129F7C
.type func_00129F7C, %function
func_00129F7C:
.Lfunc_00129F7C_0:
	add	r3, r0, #4096
.Lfunc_00129F7C_4:
	push	{r4}
.Lfunc_00129F7C_8:
	ldr	r2, [r3, #72]
.Lfunc_00129F7C_c:
	ldr	r3, [r3, #76]
.Lfunc_00129F7C_10:
	lsls	ip, r2, #23
.Lfunc_00129F7C_14:
	lsr	r2, r2, #9
.Lfunc_00129F7C_18:
	addne	r2, r2, #1
.Lfunc_00129F7C_1c:
	lsls	ip, r3, #23
.Lfunc_00129F7C_20:
	lsr	r3, r3, #9
.Lfunc_00129F7C_24:
	addne	r3, r3, #1
.Lfunc_00129F7C_28:
	cmp	r1, #1
.Lfunc_00129F7C_2c:
	mov	ip, #0
.Lfunc_00129F7C_30:
	beq	.Lfunc_00129F7C_68
.Lfunc_00129F7C_34:
	ldr	r4, [r0, #28]
.Lfunc_00129F7C_38:
	cmp	r4, #0
.Lfunc_00129F7C_3c:
	beq	.Lfunc_00129F7C_80
.Lfunc_00129F7C_40:
	str	r2, [r0, #8]
.Lfunc_00129F7C_44:
	str	r3, [r0, #16]
.Lfunc_00129F7C_48:
	rsb	r2, r2, #6144
.Lfunc_00129F7C_4c:
	rsb	r3, r3, #6144
.Lfunc_00129F7C_50:
	str	r2, [r0, #12]
.Lfunc_00129F7C_54:
	str	r3, [r0, #20]
.Lfunc_00129F7C_58:
	str	r4, [r0, #4]
.Lfunc_00129F7C_5c:
	strb	r1, [r0]
.Lfunc_00129F7C_60:
	pop	{r4}
.Lfunc_00129F7C_64:
	bx	lr
.Lfunc_00129F7C_68:
	ldr	r4, [r0, #24]
.Lfunc_00129F7C_6c:
	str	r2, [r0, #12]
.Lfunc_00129F7C_70:
	str	r3, [r0, #20]
.Lfunc_00129F7C_74:
	stmib	r0, {r4, ip}
.Lfunc_00129F7C_78:
	str	ip, [r0, #16]
.Lfunc_00129F7C_7c:
	b	.Lfunc_00129F7C_5c
.Lfunc_00129F7C_80:
	ldr	r4, [r0, #24]
.Lfunc_00129F7C_84:
	str	r2, [r0, #12]
.Lfunc_00129F7C_88:
	mov	r1, #1
.Lfunc_00129F7C_8c:
	stmib	r0, {r4, ip}
.Lfunc_00129F7C_90:
	str	ip, [r0, #16]
.Lfunc_00129F7C_94:
	strb	r1, [r0]
.Lfunc_00129F7C_98:
	str	r3, [r0, #20]
.Lfunc_00129F7C_9c:
	pop	{r4}
.Lfunc_00129F7C_a0:
	bx	lr
.size func_00129F7C, .-func_00129F7C

.section .text.func_00117618,"ax",%progbits
.balign 4
.global func_00117618
.type func_00117618, %function
func_00117618:
.Lfunc_00117618_0:
	push	{r4, r5, r6}
.Lfunc_00117618_4:
	ldr	r3, [r0, #12]
.Lfunc_00117618_8:
	cmp	r3, #0
.Lfunc_00117618_c:
	beq	.Lfunc_00117618_94
.Lfunc_00117618_10:
	and	r2, r3, #1
.Lfunc_00117618_14:
	cmp	r2, #0
.Lfunc_00117618_18:
	ldrhi	r5, [r0, #8]
.Lfunc_00117618_1c:
	mov	r4, #8
.Lfunc_00117618_20:
	mov	ip, #0
.Lfunc_00117618_24:
	bls	.Lfunc_00117618_48
.Lfunc_00117618_28:
	add	r6, ip, ip, lsl #2
.Lfunc_00117618_2c:
	add	r6, r4, r6, lsl #2
.Lfunc_00117618_30:
	ldr	r6, [r5, r6]
.Lfunc_00117618_34:
	cmp	r6, r1
.Lfunc_00117618_38:
	beq	.Lfunc_00117618_7c
.Lfunc_00117618_3c:
	add	ip, ip, #1
.Lfunc_00117618_40:
	cmp	r2, ip
.Lfunc_00117618_44:
	bhi	.Lfunc_00117618_28
.Lfunc_00117618_48:
	cmp	r3, r2
.Lfunc_00117618_4c:
	ldrhi	r0, [r0, #8]
.Lfunc_00117618_50:
	movhi	r5, #28
.Lfunc_00117618_54:
	bls	.Lfunc_00117618_94
.Lfunc_00117618_58:
	add	ip, r2, r2, lsl #2
.Lfunc_00117618_5c:
	add	r6, r4, ip, lsl #2
.Lfunc_00117618_60:
	ldr	r6, [r0, r6]
.Lfunc_00117618_64:
	cmp	r6, r1
.Lfunc_00117618_68:
	beq	.Lfunc_00117618_7c
.Lfunc_00117618_6c:
	add	ip, r5, ip, lsl #2
.Lfunc_00117618_70:
	ldr	ip, [r0, ip]
.Lfunc_00117618_74:
	cmp	ip, r1
.Lfunc_00117618_78:
	bne	.Lfunc_00117618_88
.Lfunc_00117618_7c:
	pop	{r4, r5, r6}
.Lfunc_00117618_80:
	mov	r0, #1
.Lfunc_00117618_84:
	bx	lr
.Lfunc_00117618_88:
	add	r2, r2, #2
.Lfunc_00117618_8c:
	cmp	r3, r2
.Lfunc_00117618_90:
	bhi	.Lfunc_00117618_58
.Lfunc_00117618_94:
	pop	{r4, r5, r6}
.Lfunc_00117618_98:
	mov	r0, #0
.Lfunc_00117618_9c:
	bx	lr
.size func_00117618, .-func_00117618

.section .text.func_001509D8,"ax",%progbits
.balign 4
.global func_001509D8
.type func_001509D8, %function
func_001509D8:
.Lfunc_001509D8_0:
	mov	r1, #0
.Lfunc_001509D8_4:
	strb	r1, [r0, #8]
.Lfunc_001509D8_8:
	strb	r1, [r0, #9]
.Lfunc_001509D8_c:
	strb	r1, [r0, #10]
.Lfunc_001509D8_10:
	strb	r1, [r0, #11]
.Lfunc_001509D8_14:
	strb	r1, [r0, #12]
.Lfunc_001509D8_18:
	strb	r1, [r0, #13]
.Lfunc_001509D8_1c:
	strb	r1, [r0, #14]
.Lfunc_001509D8_20:
	str	r1, [r0, #36]
.Lfunc_001509D8_24:
	str	r1, [r0, #40]
.Lfunc_001509D8_28:
	str	r1, [r0, #20]
.Lfunc_001509D8_2c:
	str	r1, [r0, #24]
.Lfunc_001509D8_30:
	str	r1, [r0, #16]
.Lfunc_001509D8_34:
	str	r1, [r0, #28]
.Lfunc_001509D8_38:
	str	r1, [r0, #32]
.Lfunc_001509D8_3c:
	str	r1, [r0, #896]
.Lfunc_001509D8_40:
	str	r1, [r0, #44]
.Lfunc_001509D8_44:
	str	r1, [r0, #48]
.Lfunc_001509D8_48:
	str	r1, [r0, #52]
.Lfunc_001509D8_4c:
	str	r1, [r0, #824]
.Lfunc_001509D8_50:
	str	r1, [r0, #828]
.Lfunc_001509D8_54:
	strb	r1, [r0, #908]
.Lfunc_001509D8_58:
	str	r1, [r0, #832]
.Lfunc_001509D8_5c:
	str	r1, [r0, #836]
.Lfunc_001509D8_60:
	str	r1, [r0, #840]
.Lfunc_001509D8_64:
	str	r1, [r0, #844]
.Lfunc_001509D8_68:
	str	r1, [r0, #848]
.Lfunc_001509D8_6c:
	str	r1, [r0, #852]
.Lfunc_001509D8_70:
	str	r1, [r0, #856]
.Lfunc_001509D8_74:
	str	r1, [r0, #860]
.Lfunc_001509D8_78:
	str	r1, [r0, #864]
.Lfunc_001509D8_7c:
	str	r1, [r0, #868]
.Lfunc_001509D8_80:
	str	r1, [r0, #872]
.Lfunc_001509D8_84:
	str	r1, [r0, #876]
.Lfunc_001509D8_88:
	str	r1, [r0, #880]
.Lfunc_001509D8_8c:
	str	r1, [r0, #884]
.Lfunc_001509D8_90:
	str	r1, [r0, #888]
.Lfunc_001509D8_94:
	str	r1, [r0, #892]
.Lfunc_001509D8_98:
	bx	lr
.size func_001509D8, .-func_001509D8

.section .text.func_0014ADAC,"ax",%progbits
.balign 4
.global func_0014ADAC
.type func_0014ADAC, %function
func_0014ADAC:
.Lfunc_0014ADAC_0:
	push	{r4, r5}
.Lfunc_0014ADAC_4:
	ldrb	r3, [r0, #396]
.Lfunc_0014ADAC_8:
	mov	r2, #0
.Lfunc_0014ADAC_c:
	cmp	r3, #0
.Lfunc_0014ADAC_10:
	movne	r0, #0
.Lfunc_0014ADAC_14:
	bne	.Lfunc_0014ADAC_7c
.Lfunc_0014ADAC_18:
	add	r3, r0, #388
.Lfunc_0014ADAC_1c:
	ldm	r3, {r3, ip}
.Lfunc_0014ADAC_20:
	cmp	ip, r3
.Lfunc_0014ADAC_24:
	bls	.Lfunc_0014ADAC_44
.Lfunc_0014ADAC_28:
	add	r1, r1, r3
.Lfunc_0014ADAC_2c:
	cmp	r1, ip
.Lfunc_0014ADAC_30:
	bhi	.Lfunc_0014ADAC_78
.Lfunc_0014ADAC_34:
	ldr	r2, [r0, #380]
.Lfunc_0014ADAC_38:
	str	r1, [r0, #388]
.Lfunc_0014ADAC_3c:
	add	r2, r2, r3, lsl #2
.Lfunc_0014ADAC_40:
	b	.Lfunc_0014ADAC_60
.Lfunc_0014ADAC_44:
	ldr	r5, [r0, #384]
.Lfunc_0014ADAC_48:
	add	r4, r3, r1
.Lfunc_0014ADAC_4c:
	cmp	r5, r4
.Lfunc_0014ADAC_50:
	bcc	.Lfunc_0014ADAC_84
.Lfunc_0014ADAC_54:
	ldr	r1, [r0, #380]
.Lfunc_0014ADAC_58:
	str	r4, [r0, #388]
.Lfunc_0014ADAC_5c:
	add	r2, r1, r3, lsl #2
.Lfunc_0014ADAC_60:
	cmp	r2, #0
.Lfunc_0014ADAC_64:
	beq	.Lfunc_0014ADAC_78
.Lfunc_0014ADAC_68:
	ldr	r1, [r0, #388]
.Lfunc_0014ADAC_6c:
	cmp	r1, ip
.Lfunc_0014ADAC_70:
	moveq	r1, #1
.Lfunc_0014ADAC_74:
	strbeq	r1, [r0, #396]
.Lfunc_0014ADAC_78:
	mov	r0, r2
.Lfunc_0014ADAC_7c:
	pop	{r4, r5}
.Lfunc_0014ADAC_80:
	bx	lr
.Lfunc_0014ADAC_84:
	cmp	ip, r1
.Lfunc_0014ADAC_88:
	strcs	r1, [r0, #388]
.Lfunc_0014ADAC_8c:
	ldrcs	r2, [r0, #380]
.Lfunc_0014ADAC_90:
	bcs	.Lfunc_0014ADAC_60
.Lfunc_0014ADAC_94:
	b	.Lfunc_0014ADAC_78
.size func_0014ADAC, .-func_0014ADAC

.section .text.func_001923D0,"ax",%progbits
.balign 4
.global func_001923D0
.type func_001923D0, %function
func_001923D0:
.Lfunc_001923D0_0:
	cmp	r0, #0
.Lfunc_001923D0_4:
	ldrne	r1, [r0, #28]
.Lfunc_001923D0_8:
	cmpne	r1, #0
.Lfunc_001923D0_c:
	mvneq	r0, #1
.Lfunc_001923D0_10:
	bxeq	lr
.Lfunc_001923D0_14:
	push	{r4, r5, r6}
.Lfunc_001923D0_18:
	mov	r2, #0
.Lfunc_001923D0_1c:
	str	r2, [r1, #28]
.Lfunc_001923D0_20:
	str	r2, [r0, #20]
.Lfunc_001923D0_24:
	str	r2, [r0, #8]
.Lfunc_001923D0_28:
	str	r2, [r0, #24]!
.Lfunc_001923D0_2c:
	mov	r5, #1
.Lfunc_001923D0_30:
	str	r5, [r0, #24]
.Lfunc_001923D0_34:
	strb	r2, [r1]
.Lfunc_001923D0_38:
	str	r2, [r1, #4]
.Lfunc_001923D0_3c:
	mov	r6, #32768
.Lfunc_001923D0_40:
	str	r2, [r1, #12]
.Lfunc_001923D0_44:
	str	r6, [r1, #20]
.Lfunc_001923D0_48:
	str	r2, [r1, #32]
.Lfunc_001923D0_4c:
	str	r2, [r1, #40]
.Lfunc_001923D0_50:
	str	r2, [r1, #44]
.Lfunc_001923D0_54:
	str	r2, [r1, #48]
.Lfunc_001923D0_58:
	str	r2, [r1, #56]
.Lfunc_001923D0_5c:
	add	r3, r1, #1328
.Lfunc_001923D0_60:
	str	r2, [r1, #60]
.Lfunc_001923D0_64:
	str	r3, [r1, #108]
.Lfunc_001923D0_68:
	add	ip, r1, #7104
.Lfunc_001923D0_6c:
	add	r4, r1, #6144
.Lfunc_001923D0_70:
	str	r3, [r1, #80]
.Lfunc_001923D0_74:
	add	r4, r4, #964
.Lfunc_001923D0_78:
	str	r3, [r1, #76]
.Lfunc_001923D0_7c:
	mvn	r0, #0
.Lfunc_001923D0_80:
	str	r5, [ip]
.Lfunc_001923D0_84:
	str	r0, [r4]
.Lfunc_001923D0_88:
	pop	{r4, r5, r6}
.Lfunc_001923D0_8c:
	mov	r0, #0
.Lfunc_001923D0_90:
	bx	lr
.size func_001923D0, .-func_001923D0

.section .text.func_0019CC5C,"ax",%progbits
.balign 4
.global func_0019CC5C
.type func_0019CC5C, %function
func_0019CC5C:
.Lfunc_0019CC5C_0:
	push	{r4, r5, r6, r7, r8, r9, lr}
.Lfunc_0019CC5C_4:
	mov	r9, r0
.Lfunc_0019CC5C_8:
	subs	r3, r3, #4
.Lfunc_0019CC5C_c:
	mov	r0, #0
.Lfunc_0019CC5C_10:
	mov	lr, #0
.Lfunc_0019CC5C_14:
	blt	.Lfunc_0019CC5C_68
.Lfunc_0019CC5C_18:
	ldr	r8, [r1], #4
.Lfunc_0019CC5C_1c:
	ldr	r6, [r2], #4
.Lfunc_0019CC5C_20:
	subs	r0, r0, #1
.Lfunc_0019CC5C_24:
	ldr	r7, [r1], #4
.Lfunc_0019CC5C_28:
	ldr	r5, [r2], #4
.Lfunc_0019CC5C_2c:
	adcs	r8, r8, r6
.Lfunc_0019CC5C_30:
	adcs	r7, r7, r5
.Lfunc_0019CC5C_34:
	str	r8, [r9], #4
.Lfunc_0019CC5C_38:
	str	r7, [r9], #4
.Lfunc_0019CC5C_3c:
	ldr	r8, [r1], #4
.Lfunc_0019CC5C_40:
	ldr	r6, [r2], #4
.Lfunc_0019CC5C_44:
	ldr	r7, [r1], #4
.Lfunc_0019CC5C_48:
	ldr	r5, [r2], #4
.Lfunc_0019CC5C_4c:
	adcs	r8, r8, r6
.Lfunc_0019CC5C_50:
	adcs	r7, r7, r5
.Lfunc_0019CC5C_54:
	adc	r0, lr, #0
.Lfunc_0019CC5C_58:
	str	r8, [r9], #4
.Lfunc_0019CC5C_5c:
	subs	r3, r3, #4
.Lfunc_0019CC5C_60:
	str	r7, [r9], #4
.Lfunc_0019CC5C_64:
	bge	.Lfunc_0019CC5C_18
.Lfunc_0019CC5C_68:
	adds	r3, r3, #4
.Lfunc_0019CC5C_6c:
	pople	{r4, r5, r6, r7, r8, r9, pc}
.Lfunc_0019CC5C_70:
	ldr	r8, [r1], #4
.Lfunc_0019CC5C_74:
	ldr	r6, [r2], #4
.Lfunc_0019CC5C_78:
	subs	r0, r0, #1
.Lfunc_0019CC5C_7c:
	adcs	r8, r8, r6
.Lfunc_0019CC5C_80:
	adc	r0, lr, #0
.Lfunc_0019CC5C_84:
	str	r8, [r9], #4
.Lfunc_0019CC5C_88:
	subs	r3, r3, #1
.Lfunc_0019CC5C_8c:
	bgt	.Lfunc_0019CC5C_70
.Lfunc_0019CC5C_90:
	pop	{r4, r5, r6, r7, r8, r9, pc}
.size func_0019CC5C, .-func_0019CC5C

.section .text.func_001D4258,"ax",%progbits
.balign 4
.global func_001D4258
.type func_001D4258, %function
func_001D4258:
.Lfunc_001D4258_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_001D4258_4:
	add	r6, r1, r3
.Lfunc_001D4258_8:
	cmp	r6, r1
.Lfunc_001D4258_c:
	ldr	ip, [sp, #24]
.Lfunc_001D4258_10:
	ble	.Lfunc_001D4258_84
.Lfunc_001D4258_14:
	add	r3, r2, ip
.Lfunc_001D4258_18:
	sub	r3, r3, r2
.Lfunc_001D4258_1c:
	mov	r7, #255
.Lfunc_001D4258_20:
	add	r4, r3, #1
.Lfunc_001D4258_24:
	cmp	r4, #1
.Lfunc_001D4258_28:
	mov	r3, r2
.Lfunc_001D4258_2c:
	mov	ip, #1
.Lfunc_001D4258_30:
	ble	.Lfunc_001D4258_78
.Lfunc_001D4258_34:
	cmp	r0, #0
.Lfunc_001D4258_38:
	beq	.Lfunc_001D4258_5c
.Lfunc_001D4258_3c:
	cmp	r3, #0
.Lfunc_001D4258_40:
	ldrge	r5, [r0, #4]
.Lfunc_001D4258_44:
	cmpge	r5, r3
.Lfunc_001D4258_48:
	blt	.Lfunc_001D4258_5c
.Lfunc_001D4258_4c:
	cmp	r1, #0
.Lfunc_001D4258_50:
	cmpge	r5, r1
.Lfunc_001D4258_54:
	mlage	r5, r1, r5, r3
.Lfunc_001D4258_58:
	bge	.Lfunc_001D4258_60
.Lfunc_001D4258_5c:
	mov	r5, #0
.Lfunc_001D4258_60:
	ldr	r9, [r0, #8]
.Lfunc_001D4258_64:
	add	ip, ip, #1
.Lfunc_001D4258_68:
	cmp	r4, ip
.Lfunc_001D4258_6c:
	add	r3, r3, #1
.Lfunc_001D4258_70:
	strb	r7, [r9, r5]
.Lfunc_001D4258_74:
	bgt	.Lfunc_001D4258_34
.Lfunc_001D4258_78:
	add	r1, r1, #1
.Lfunc_001D4258_7c:
	cmp	r6, r1
.Lfunc_001D4258_80:
	bgt	.Lfunc_001D4258_24
.Lfunc_001D4258_84:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_001D4258_88:
	bx	lr
.size func_001D4258, .-func_001D4258

.section .text.func_001F3E6C,"ax",%progbits
.balign 4
.global func_001F3E6C
.type func_001F3E6C, %function
func_001F3E6C:
.Lfunc_001F3E6C_0:
	push	{r4}
.Lfunc_001F3E6C_4:
	ldr	r2, [r0, #12]
.Lfunc_001F3E6C_8:
	cmp	r2, r1
.Lfunc_001F3E6C_c:
	bcs	.Lfunc_001F3E6C_54
.Lfunc_001F3E6C_10:
	ldr	r2, [r0, #4]
.Lfunc_001F3E6C_14:
	cmp	r2, #0
.Lfunc_001F3E6C_18:
	beq	.Lfunc_001F3E6C_80
.Lfunc_001F3E6C_1c:
	ldr	r3, [r0, #8]
.Lfunc_001F3E6C_20:
	sub	ip, r2, #1
.Lfunc_001F3E6C_24:
	lsl	r3, r3, #8
.Lfunc_001F3E6C_28:
	str	r3, [r0, #8]
.Lfunc_001F3E6C_2c:
	ldr	r2, [r0]
.Lfunc_001F3E6C_30:
	ldrb	r4, [r2], #1
.Lfunc_001F3E6C_34:
	add	r3, r3, r4
.Lfunc_001F3E6C_38:
	str	r3, [r0, #8]
.Lfunc_001F3E6C_3c:
	stm	r0, {r2, ip}
.Lfunc_001F3E6C_40:
	ldr	r2, [r0, #12]
.Lfunc_001F3E6C_44:
	add	r2, r2, #8
.Lfunc_001F3E6C_48:
	cmp	r1, r2
.Lfunc_001F3E6C_4c:
	str	r2, [r0, #12]
.Lfunc_001F3E6C_50:
	bhi	.Lfunc_001F3E6C_10
.Lfunc_001F3E6C_54:
	mov	ip, #1
.Lfunc_001F3E6C_58:
	mov	r3, r2
.Lfunc_001F3E6C_5c:
	lsl	ip, ip, r1
.Lfunc_001F3E6C_60:
	ldr	r2, [r0, #8]
.Lfunc_001F3E6C_64:
	sub	r1, r3, r1
.Lfunc_001F3E6C_68:
	str	r1, [r0, #12]
.Lfunc_001F3E6C_6c:
	lsr	r2, r2, r1
.Lfunc_001F3E6C_70:
	sub	r3, ip, #1
.Lfunc_001F3E6C_74:
	pop	{r4}
.Lfunc_001F3E6C_78:
	and	r0, r2, r3
.Lfunc_001F3E6C_7c:
	bx	lr
.Lfunc_001F3E6C_80:
	pop	{r4}
.Lfunc_001F3E6C_84:
	mvn	r0, #0
.Lfunc_001F3E6C_88:
	bx	lr
.size func_001F3E6C, .-func_001F3E6C
```
