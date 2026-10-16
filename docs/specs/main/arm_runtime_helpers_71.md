# Probe-verified ARM runtime/helper batch 71

Source SHA-256: `c51a8c53ae8d2779a544876d8636e1c37faeb214407a03f9e1608befcbe5a598`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 2,760 executable body bytes (690 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and independently
assembled exact-schedule probes. The batch excludes every previously configured
function, including runtime batch 70 and the pending duplicate batch 70 and IPC
batch 67 assignments.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the current target
inventory, so no member belongs to an exact-duplicate family. Private inspection
artifacts used for selection are not part of this specification and were not
retained. Independent ARMv6K assembly comparison against target revision
`AS_EUR_REV2` on 2026-10-16 matched all twenty-four complete bodies (2,760
bytes / 690 instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0019CB8C` | `.text.func_0019CB8C` | ARM | 136 | 34 | 3 | 13 | 2 | `func_0019CC14` |
| `func_00573958` | `.text.func_00573958` | ARM | 132 | 33 | 2 | 9 | 1 | `func_005739DC` |
| `func_00128440` | `.text.func_00128440` | ARM | 128 | 32 | 2 | 5 | 1 | `func_001284C0` |
| `func_00136C10` | `.text.func_00136C10` | ARM | 128 | 32 | 2 | 5 | 1 | `func_001373B8` |
| `func_0014983C` | `.text.func_0014983C` | ARM | 128 | 32 | 6 | 7 | 1 | `func_001498BC` |
| `func_0014E088` | `.text.func_0014E088` | ARM | 124 | 31 | 4 | 15 | 2 | `func_0014E104` |
| `func_001FF200` | `.text.func_001FF200` | ARM | 124 | 31 | 2 | 13 | 1 | `func_001FF27C` |
| `func_0014390C` | `.text.func_0014390C` | ARM | 120 | 30 | 0 | 23 | 1 | `func_00143984` |
| `func_00129B24` | `.text.func_00129B24` | ARM | 116 | 29 | 2 | 16 | 1 | `func_00129B98` |
| `func_00144D28` | `.text.func_00144D28` | ARM | 116 | 29 | 2 | 18 | 2 | `func_00144D9C` |
| `func_00150444` | `.text.func_00150444` | ARM | 116 | 29 | 6 | 11 | 2 | `func_001504B8` |
| `func_0018007C` | `.text.func_0018007C` | ARM | 112 | 28 | 1 | 19 | 1 | `func_001801CC` |
| `func_001C24B4` | `.text.func_001C24B4` | ARM | 112 | 28 | 2 | 14 | 1 | `func_001C2524` |
| `func_00355BF0` | `.text.func_00355BF0` | ARM | 112 | 28 | 2 | 13 | 1 | `func_00355D00` |
| `func_0018C714` | `.text.func_0018C714` | ARM | 108 | 27 | 0 | 18 | 1 | `func_0018C780` |
| `func_0018CD90` | `.text.func_0018CD90` | ARM | 108 | 27 | 4 | 6 | 2 | `func_0018CDFC` |
| `func_00415F30` | `.text.func_00415F30` | ARM | 108 | 27 | 5 | 7 | 2 | `func_00415F9C` |
| `func_0046D748` | `.text.func_0046D748` | ARM | 108 | 27 | 6 | 12 | 1 | `func_0046D7B4` |
| `func_00491870` | `.text.func_00491870` | ARM | 108 | 27 | 2 | 13 | 1 | `func_00491AE0` |
| `func_004C226C` | `.text.func_004C226C` | ARM | 108 | 27 | 4 | 6 | 2 | `func_004C22D8` |
| `func_001CDC60` | `.text.func_001CDC60` | ARM | 104 | 26 | 5 | 7 | 2 | `func_001CDCC8` |
| `func_0046BE44` | `.text.func_0046BE44` | ARM | 104 | 26 | 3 | 6 | 1 | `func_0046BEC0` |
| `func_004B1E20` | `.text.func_004B1E20` | ARM | 100 | 25 | 5 | 11 | 2 | `func_004B1E84` |
| `func_004B9260` | `.text.func_004B9260` | ARM | 100 | 25 | 1 | 7 | 1 | `func_004B92C4` |

Memory-operation counts include scalar loads/stores and stack transfers.
Return transfers are excluded from the local-branch column. The per-function
counts total 71 direct function-local B-family sites: 66 conditional and five
unconditional. The bodies also contain 33 separately validated return transfers
and 274 memory operations.

The “next global” column is a boundary cross-check from the neutral symbol
inventory; it does not assert that the next global is address-contiguous. Each
owned section ends exactly at its stated body size. Intervening unowned bytes,
where present, are outside this batch, and every function has a zero-byte
adjacent-data schedule.

## Exact schedules

The following is the complete independently assembled artifact. Local labels may
be renamed consistently. Preserve every mnemonic, operand, condition, memory
mode, instruction order, section name, mode, alignment, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0019CB8C,"ax",%progbits
.balign 4
.global func_0019CB8C
.type func_0019CB8C, %function
func_0019CB8C:
.Lfunc_0019CB8C_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
.Lfunc_0019CB8C_4:
	mov	fp, r0
.Lfunc_0019CB8C_8:
	mov	r0, #0
.Lfunc_0019CB8C_c:
	subs	r2, r2, #4
.Lfunc_0019CB8C_10:
	blt	.Lfunc_0019CB8C_60
.Lfunc_0019CB8C_14:
	ldr	r9, [r1], #4
.Lfunc_0019CB8C_18:
	umull	r9, sl, r3, r9
.Lfunc_0019CB8C_1c:
	ldr	r7, [r1], #4
.Lfunc_0019CB8C_20:
	ldr	r5, [r1], #4
.Lfunc_0019CB8C_24:
	umull	r7, r8, r3, r7
.Lfunc_0019CB8C_28:
	ldr	lr, [r1], #4
.Lfunc_0019CB8C_2c:
	adds	r9, r9, r0
.Lfunc_0019CB8C_30:
	umull	r5, r6, r3, r5
.Lfunc_0019CB8C_34:
	adcs	r7, r7, sl
.Lfunc_0019CB8C_38:
	str	r9, [fp], #4
.Lfunc_0019CB8C_3c:
	umull	lr, r4, r3, lr
.Lfunc_0019CB8C_40:
	str	r7, [fp], #4
.Lfunc_0019CB8C_44:
	adcs	r5, r5, r8
.Lfunc_0019CB8C_48:
	str	r5, [fp], #4
.Lfunc_0019CB8C_4c:
	adcs	lr, lr, r6
.Lfunc_0019CB8C_50:
	adc	r0, r4, #0
.Lfunc_0019CB8C_54:
	str	lr, [fp], #4
.Lfunc_0019CB8C_58:
	subs	r2, r2, #4
.Lfunc_0019CB8C_5c:
	bge	.Lfunc_0019CB8C_14
.Lfunc_0019CB8C_60:
	adds	r2, r2, #4
.Lfunc_0019CB8C_64:
	pople	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Lfunc_0019CB8C_68:
	ldr	r9, [r1], #4
.Lfunc_0019CB8C_6c:
	mov	sl, #0
.Lfunc_0019CB8C_70:
	umlal	r0, sl, r9, r3
.Lfunc_0019CB8C_74:
	subs	r2, r2, #1
.Lfunc_0019CB8C_78:
	str	r0, [fp], #4
.Lfunc_0019CB8C_7c:
	mov	r0, sl
.Lfunc_0019CB8C_80:
	bgt	.Lfunc_0019CB8C_68
.Lfunc_0019CB8C_84:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_0019CB8C, .-func_0019CB8C

.section .text.func_00573958,"ax",%progbits
.balign 4
.global func_00573958
.type func_00573958, %function
func_00573958:
.Lfunc_00573958_0:
	push	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_00573958_4:
	add	r5, sp, #32
.Lfunc_00573958_8:
	mov	r8, #1
.Lfunc_00573958_c:
	mov	r9, #0
.Lfunc_00573958_10:
	ldm	r5, {sl, fp, ip}
.Lfunc_00573958_14:
	ldr	r4, [sp, #44]
.Lfunc_00573958_18:
	cmp	r2, sl
.Lfunc_00573958_1c:
	cmpeq	r3, fp
.Lfunc_00573958_20:
	bne	.Lfunc_00573958_34
.Lfunc_00573958_24:
	str	r4, [r0, #4]
.Lfunc_00573958_28:
	str	ip, [r0]
.Lfunc_00573958_2c:
	pop	{r4, r5, r6, r7, r8, r9, sl, fp}
.Lfunc_00573958_30:
	bx	lr
.Lfunc_00573958_34:
	mov	r5, r4
.Lfunc_00573958_38:
	add	r4, r4, #1
.Lfunc_00573958_3c:
	cmp	r4, #32
.Lfunc_00573958_40:
	lsl	r7, r8, r5
.Lfunc_00573958_44:
	mov	r1, ip
.Lfunc_00573958_48:
	mov	r6, r3
.Lfunc_00573958_4c:
	moveq	r4, r9
.Lfunc_00573958_50:
	addeq	ip, r1, #4
.Lfunc_00573958_54:
	add	r3, r3, #1
.Lfunc_00573958_58:
	cmp	r3, #32
.Lfunc_00573958_5c:
	mov	r5, r2
.Lfunc_00573958_60:
	addeq	r2, r5, #4
.Lfunc_00573958_64:
	ldr	r5, [r5]
.Lfunc_00573958_68:
	moveq	r3, r9
.Lfunc_00573958_6c:
	tst	r5, r8, lsl r6
.Lfunc_00573958_70:
	ldr	r5, [r1]
.Lfunc_00573958_74:
	orrne	r5, r5, r7
.Lfunc_00573958_78:
	biceq	r5, r5, r7
.Lfunc_00573958_7c:
	str	r5, [r1]
.Lfunc_00573958_80:
	b	.Lfunc_00573958_18
.size func_00573958, .-func_00573958

.section .text.func_00128440,"ax",%progbits
.balign 4
.global func_00128440
.type func_00128440, %function
func_00128440:
.Lfunc_00128440_0:
	ldr	r1, [r0, #4]
.Lfunc_00128440_4:
	add	r1, r0, r1, lsl #2
.Lfunc_00128440_8:
	add	r2, r1, #8
.Lfunc_00128440_c:
	ldr	r1, [r0, #8]
.Lfunc_00128440_10:
	add	r3, r1, r0
.Lfunc_00128440_14:
	ldr	r1, [r2, #12]
.Lfunc_00128440_18:
	tst	r1, #127
.Lfunc_00128440_1c:
	lsr	r0, r1, #7
.Lfunc_00128440_20:
	add	r0, r0, r0, lsl #5
.Lfunc_00128440_24:
	lsl	r0, r0, #2
.Lfunc_00128440_28:
	beq	.Lfunc_00128440_3c
.Lfunc_00128440_2c:
	and	r1, r1, #127
.Lfunc_00128440_30:
	add	r1, r1, #4
.Lfunc_00128440_34:
	bic	r1, r1, #1
.Lfunc_00128440_38:
	add	r0, r0, r1
.Lfunc_00128440_3c:
	ldr	r1, [r2, #20]
.Lfunc_00128440_40:
	tst	r1, #127
.Lfunc_00128440_44:
	lsr	r2, r1, #7
.Lfunc_00128440_48:
	add	r2, r2, r2, lsl #5
.Lfunc_00128440_4c:
	lsl	r2, r2, #2
.Lfunc_00128440_50:
	beq	.Lfunc_00128440_64
.Lfunc_00128440_54:
	and	r1, r1, #127
.Lfunc_00128440_58:
	add	r1, r1, #4
.Lfunc_00128440_5c:
	bic	r1, r1, #1
.Lfunc_00128440_60:
	add	r2, r2, r1
.Lfunc_00128440_64:
	ldr	r1, [r3, #28]
.Lfunc_00128440_68:
	add	r0, r0, r2
.Lfunc_00128440_6c:
	add	r1, r1, r1, lsl #1
.Lfunc_00128440_70:
	add	r0, r0, r1, lsl #1
.Lfunc_00128440_74:
	lsl	r0, r0, #2
.Lfunc_00128440_78:
	add	r0, r0, #3488
.Lfunc_00128440_7c:
	bx	lr
.size func_00128440, .-func_00128440

.section .text.func_00136C10,"ax",%progbits
.balign 4
.global func_00136C10
.type func_00136C10, %function
func_00136C10:
.Lfunc_00136C10_0:
	ldr	r1, [r0, #4]
.Lfunc_00136C10_4:
	add	r1, r0, r1, lsl #2
.Lfunc_00136C10_8:
	add	r2, r1, #8
.Lfunc_00136C10_c:
	ldr	r1, [r0, #8]
.Lfunc_00136C10_10:
	add	r3, r1, r0
.Lfunc_00136C10_14:
	ldr	r0, [r2, #12]
.Lfunc_00136C10_18:
	tst	r0, #127
.Lfunc_00136C10_1c:
	lsr	r1, r0, #7
.Lfunc_00136C10_20:
	add	r1, r1, r1, lsl #5
.Lfunc_00136C10_24:
	lsl	r1, r1, #2
.Lfunc_00136C10_28:
	beq	.Lfunc_00136C10_3c
.Lfunc_00136C10_2c:
	and	r0, r0, #127
.Lfunc_00136C10_30:
	add	r0, r0, #4
.Lfunc_00136C10_34:
	bic	r0, r0, #1
.Lfunc_00136C10_38:
	add	r1, r1, r0
.Lfunc_00136C10_3c:
	ldr	r0, [r2, #20]
.Lfunc_00136C10_40:
	tst	r0, #127
.Lfunc_00136C10_44:
	lsr	r2, r0, #7
.Lfunc_00136C10_48:
	add	r2, r2, r2, lsl #5
.Lfunc_00136C10_4c:
	lsl	r2, r2, #2
.Lfunc_00136C10_50:
	beq	.Lfunc_00136C10_64
.Lfunc_00136C10_54:
	and	r0, r0, #127
.Lfunc_00136C10_58:
	add	r0, r0, #4
.Lfunc_00136C10_5c:
	bic	r0, r0, #1
.Lfunc_00136C10_60:
	add	r2, r2, r0
.Lfunc_00136C10_64:
	ldr	r0, [r3, #28]
.Lfunc_00136C10_68:
	add	r1, r1, r2
.Lfunc_00136C10_6c:
	add	r0, r0, r0, lsl #1
.Lfunc_00136C10_70:
	add	r0, r1, r0, lsl #1
.Lfunc_00136C10_74:
	lsl	r0, r0, #2
.Lfunc_00136C10_78:
	add	r0, r0, #992
.Lfunc_00136C10_7c:
	bx	lr
.size func_00136C10, .-func_00136C10

.section .text.func_0014983C,"ax",%progbits
.balign 4
.global func_0014983C
.type func_0014983C, %function
func_0014983C:
.Lfunc_0014983C_0:
	push	{r4}
.Lfunc_0014983C_4:
	ldr	ip, [r0]
.Lfunc_0014983C_8:
	cmp	ip, r1
.Lfunc_0014983C_c:
	bne	.Lfunc_0014983C_74
.Lfunc_0014983C_10:
	ldrh	r1, [r0, #4]
.Lfunc_0014983C_14:
	sub	ip, r1, #65024
.Lfunc_0014983C_18:
	subs	ip, ip, #255
.Lfunc_0014983C_1c:
	bne	.Lfunc_0014983C_74
.Lfunc_0014983C_20:
	ldr	r1, [r0, #8]
.Lfunc_0014983C_24:
	lsr	ip, r2, #24
.Lfunc_0014983C_28:
	cmp	ip, r1, lsr #24
.Lfunc_0014983C_2c:
	bne	.Lfunc_0014983C_74
.Lfunc_0014983C_30:
	lsl	ip, r2, #8
.Lfunc_0014983C_34:
	lsl	r4, r1, #8
.Lfunc_0014983C_38:
	lsr	ip, ip, #24
.Lfunc_0014983C_3c:
	lsr	r4, r4, #24
.Lfunc_0014983C_40:
	cmp	ip, r4
.Lfunc_0014983C_44:
	bcc	.Lfunc_0014983C_74
.Lfunc_0014983C_48:
	lsl	r2, r2, #24
.Lfunc_0014983C_4c:
	cmp	r2, r1, lsl #24
.Lfunc_0014983C_50:
	bhi	.Lfunc_0014983C_74
.Lfunc_0014983C_54:
	ldr	r1, [r0, #12]
.Lfunc_0014983C_58:
	mov	r2, #20
.Lfunc_0014983C_5c:
	add	r2, r2, r3, lsl #3
.Lfunc_0014983C_60:
	cmp	r1, r2
.Lfunc_0014983C_64:
	ldrhcs	r0, [r0, #16]
.Lfunc_0014983C_68:
	cmpcs	r0, r3
.Lfunc_0014983C_6c:
	movcs	r0, #1
.Lfunc_0014983C_70:
	bcs	.Lfunc_0014983C_78
.Lfunc_0014983C_74:
	mov	r0, #0
.Lfunc_0014983C_78:
	pop	{r4}
.Lfunc_0014983C_7c:
	bx	lr
.size func_0014983C, .-func_0014983C

.section .text.func_0014E088,"ax",%progbits
.balign 4
.global func_0014E088
.type func_0014E088, %function
func_0014E088:
.Lfunc_0014E088_0:
	push	{r4}
.Lfunc_0014E088_4:
	ldrsb	r2, [r0, #12]
.Lfunc_0014E088_8:
	cmp	r2, #0
.Lfunc_0014E088_c:
	beq	.Lfunc_0014E088_54
.Lfunc_0014E088_10:
	ldrh	r3, [r0, #10]
.Lfunc_0014E088_14:
	ldrh	r4, [r0, #8]
.Lfunc_0014E088_18:
	mov	ip, #0
.Lfunc_0014E088_1c:
	add	r2, r3, #1
.Lfunc_0014E088_20:
	cmp	r2, r4
.Lfunc_0014E088_24:
	bcs	.Lfunc_0014E088_4c
.Lfunc_0014E088_28:
	ldr	r4, [r0, #4]
.Lfunc_0014E088_2c:
	lsl	r3, r3, #1
.Lfunc_0014E088_30:
	strh	r2, [r0, #10]
.Lfunc_0014E088_34:
	strh	r1, [r4, r3]
.Lfunc_0014E088_38:
	ldr	r1, [r0, #4]
.Lfunc_0014E088_3c:
	ldrh	r0, [r0, #10]
.Lfunc_0014E088_40:
	add	r0, r1, r0, lsl #1
.Lfunc_0014E088_44:
	strh	ip, [r0]
.Lfunc_0014E088_48:
	b	.Lfunc_0014E088_70
.Lfunc_0014E088_4c:
	cmpeq	r1, #0
.Lfunc_0014E088_50:
	beq	.Lfunc_0014E088_60
.Lfunc_0014E088_54:
	pop	{r4}
.Lfunc_0014E088_58:
	mov	r0, #0
.Lfunc_0014E088_5c:
	bx	lr
.Lfunc_0014E088_60:
	ldr	r1, [r0, #4]
.Lfunc_0014E088_64:
	lsl	r3, r3, #1
.Lfunc_0014E088_68:
	strh	r2, [r0, #10]
.Lfunc_0014E088_6c:
	strh	ip, [r1, r3]
.Lfunc_0014E088_70:
	pop	{r4}
.Lfunc_0014E088_74:
	mov	r0, #1
.Lfunc_0014E088_78:
	bx	lr
.size func_0014E088, .-func_0014E088

.section .text.func_001FF200,"ax",%progbits
.balign 4
.global func_001FF200
.type func_001FF200, %function
func_001FF200:
.Lfunc_001FF200_0:
	sub	sp, sp, #16
.Lfunc_001FF200_4:
	mov	r1, #0
.Lfunc_001FF200_8:
	str	r1, [sp]
.Lfunc_001FF200_c:
	str	r1, [sp, #4]
.Lfunc_001FF200_10:
	str	r1, [sp, #8]
.Lfunc_001FF200_14:
	str	r1, [sp, #12]
.Lfunc_001FF200_18:
	ldr	r1, [r0]
.Lfunc_001FF200_1c:
	str	r1, [sp]
.Lfunc_001FF200_20:
	ldr	r1, [r0, #4]
.Lfunc_001FF200_24:
	ldrb	r2, [sp]
.Lfunc_001FF200_28:
	str	r1, [sp, #4]
.Lfunc_001FF200_2c:
	ldrb	r0, [r0, #8]
.Lfunc_001FF200_30:
	cmp	r2, #0
.Lfunc_001FF200_34:
	mov	r1, sp
.Lfunc_001FF200_38:
	strb	r0, [sp, #8]
.Lfunc_001FF200_3c:
	mov	r0, #0
.Lfunc_001FF200_40:
	beq	.Lfunc_001FF200_74
.Lfunc_001FF200_44:
	ldrb	r2, [r1]
.Lfunc_001FF200_48:
	lsl	r0, r0, #4
.Lfunc_001FF200_4c:
	sub	r3, r2, #48
.Lfunc_001FF200_50:
	cmp	r3, #9
.Lfunc_001FF200_54:
	subls	r2, r2, #48
.Lfunc_001FF200_58:
	subhi	r2, r2, #87
.Lfunc_001FF200_5c:
	sub	r3, r2, #1
.Lfunc_001FF200_60:
	cmp	r3, #15
.Lfunc_001FF200_64:
	addcc	r0, r0, r2
.Lfunc_001FF200_68:
	ldrb	r2, [r1, #1]!
.Lfunc_001FF200_6c:
	cmp	r2, #0
.Lfunc_001FF200_70:
	bne	.Lfunc_001FF200_44
.Lfunc_001FF200_74:
	add	sp, sp, #16
.Lfunc_001FF200_78:
	bx	lr
.size func_001FF200, .-func_001FF200

.section .text.func_0014390C,"ax",%progbits
.balign 4
.global func_0014390C
.type func_0014390C, %function
func_0014390C:
.Lfunc_0014390C_0:
	push	{r4}
.Lfunc_0014390C_4:
	ldr	r3, [r2]
.Lfunc_0014390C_8:
	ldr	ip, [r2]
.Lfunc_0014390C_c:
	ldr	r3, [r3, #16]
.Lfunc_0014390C_10:
	ldr	ip, [ip, #12]
.Lfunc_0014390C_14:
	cmp	r3, #0
.Lfunc_0014390C_18:
	str	ip, [r0]
.Lfunc_0014390C_1c:
	strne	ip, [r3, #12]
.Lfunc_0014390C_20:
	ldr	r4, [r2]
.Lfunc_0014390C_24:
	mov	ip, #0
.Lfunc_0014390C_28:
	str	ip, [r4, #16]
.Lfunc_0014390C_2c:
	ldr	r4, [r0]
.Lfunc_0014390C_30:
	cmp	r4, #0
.Lfunc_0014390C_34:
	strne	r3, [r4, #16]
.Lfunc_0014390C_38:
	ldr	r4, [r2]
.Lfunc_0014390C_3c:
	str	ip, [r4, #12]
.Lfunc_0014390C_40:
	ldr	ip, [r1, #4]
.Lfunc_0014390C_44:
	ldr	r4, [r2]
.Lfunc_0014390C_48:
	cmp	ip, r4
.Lfunc_0014390C_4c:
	ldreq	r0, [r0]
.Lfunc_0014390C_50:
	streq	r0, [r1, #4]
.Lfunc_0014390C_54:
	ldr	r0, [r1, #8]
.Lfunc_0014390C_58:
	ldr	r2, [r2]
.Lfunc_0014390C_5c:
	cmp	r0, r2
.Lfunc_0014390C_60:
	streq	r3, [r1, #8]
.Lfunc_0014390C_64:
	ldr	r0, [r1, #16]
.Lfunc_0014390C_68:
	sub	r0, r0, #1
.Lfunc_0014390C_6c:
	str	r0, [r1, #16]
.Lfunc_0014390C_70:
	pop	{r4}
.Lfunc_0014390C_74:
	bx	lr
.size func_0014390C, .-func_0014390C

.section .text.func_00129B24,"ax",%progbits
.balign 4
.global func_00129B24
.type func_00129B24, %function
func_00129B24:
.Lfunc_00129B24_0:
	ldr	r2, [r0, #120]
.Lfunc_00129B24_4:
	ldr	r3, [r0, #108]
.Lfunc_00129B24_8:
	mov	r1, #0
.Lfunc_00129B24_c:
	cmp	r3, #0
.Lfunc_00129B24_10:
	add	r2, r2, r2, lsl #1
.Lfunc_00129B24_14:
	bls	.Lfunc_00129B24_3c
.Lfunc_00129B24_18:
	add	ip, r1, r2
.Lfunc_00129B24_1c:
	add	r3, r0, r1, lsl #2
.Lfunc_00129B24_20:
	add	ip, r0, ip, lsl #2
.Lfunc_00129B24_24:
	add	r1, r1, #1
.Lfunc_00129B24_28:
	ldr	ip, [ip, #16]
.Lfunc_00129B24_2c:
	str	ip, [r3, #148]
.Lfunc_00129B24_30:
	ldr	r3, [r0, #108]
.Lfunc_00129B24_34:
	cmp	r3, r1
.Lfunc_00129B24_38:
	bhi	.Lfunc_00129B24_18
.Lfunc_00129B24_3c:
	ldr	r1, [r0, #124]
.Lfunc_00129B24_40:
	add	r3, r0, r1, lsl #2
.Lfunc_00129B24_44:
	add	r1, r0, r1, lsl #4
.Lfunc_00129B24_48:
	ldr	r2, [r1, #52]
.Lfunc_00129B24_4c:
	str	r2, [r0, #128]
.Lfunc_00129B24_50:
	ldr	r2, [r1, #56]
.Lfunc_00129B24_54:
	str	r2, [r0, #132]
.Lfunc_00129B24_58:
	ldr	r2, [r1, #60]
.Lfunc_00129B24_5c:
	str	r2, [r0, #136]
.Lfunc_00129B24_60:
	ldr	r1, [r1, #64]
.Lfunc_00129B24_64:
	str	r1, [r0, #140]
.Lfunc_00129B24_68:
	ldr	r1, [r3, #84]
.Lfunc_00129B24_6c:
	str	r1, [r0, #144]
.Lfunc_00129B24_70:
	bx	lr
.size func_00129B24, .-func_00129B24

.section .text.func_00144D28,"ax",%progbits
.balign 4
.global func_00144D28
.type func_00144D28, %function
func_00144D28:
.Lfunc_00144D28_0:
	push	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00144D28_4:
	subs	r2, r2, #32
.Lfunc_00144D28_8:
	bcc	.Lfunc_00144D28_34
.Lfunc_00144D28_c:
	ldm	r1!, {r3, r4, r5, r6}
.Lfunc_00144D28_10:
	pld	[r1, #64]
.Lfunc_00144D28_14:
	ldm	r1!, {r7, r8, r9, sl}
.Lfunc_00144D28_18:
	stmia	r0!, {r3, r4, r5, r6}
.Lfunc_00144D28_1c:
	subs	r2, r2, #32
.Lfunc_00144D28_20:
	stmia	r0!, {r7, r8, r9, sl}
.Lfunc_00144D28_24:
	ldmcs	r1!, {r3, r4, r5, r6}
.Lfunc_00144D28_28:
	pld	[r1, #64]
.Lfunc_00144D28_2c:
	ldmcs	r1!, {r7, r8, r9, sl}
.Lfunc_00144D28_30:
	bcs	.Lfunc_00144D28_18
.Lfunc_00144D28_34:
	lsls	ip, r2, #28
.Lfunc_00144D28_38:
	ldmcs	r1!, {r3, r4, ip, lr}
.Lfunc_00144D28_3c:
	stmiacs	r0!, {r3, r4, ip, lr}
.Lfunc_00144D28_40:
	ldmmi	r1!, {r3, r4}
.Lfunc_00144D28_44:
	stmiami	r0!, {r3, r4}
.Lfunc_00144D28_48:
	pop	{r4, r5, r6, r7, r8, r9, sl, lr}
.Lfunc_00144D28_4c:
	lsls	ip, r2, #30
.Lfunc_00144D28_50:
	ldrcs	r3, [r1], #4
.Lfunc_00144D28_54:
	strcs	r3, [r0], #4
.Lfunc_00144D28_58:
	bxeq	lr
.Lfunc_00144D28_5c:
	lsls	r2, r2, #31
.Lfunc_00144D28_60:
	ldrhcs	r3, [r1], #2
.Lfunc_00144D28_64:
	ldrbmi	r2, [r1], #1
.Lfunc_00144D28_68:
	strhcs	r3, [r0], #2
.Lfunc_00144D28_6c:
	strbmi	r2, [r0], #1
.Lfunc_00144D28_70:
	bx	lr
.size func_00144D28, .-func_00144D28

.section .text.func_00150444,"ax",%progbits
.balign 4
.global func_00150444
.type func_00150444, %function
func_00150444:
.Lfunc_00150444_0:
	push	{r4}
.Lfunc_00150444_4:
	ldr	r2, [r0, #28]
.Lfunc_00150444_8:
	cmp	r2, r1
.Lfunc_00150444_c:
	ldrne	r3, [r0, #32]
.Lfunc_00150444_10:
	cmpne	r3, r1
.Lfunc_00150444_14:
	beq	.Lfunc_00150444_5c
.Lfunc_00150444_18:
	ldr	ip, [r0, #36]
.Lfunc_00150444_1c:
	cmp	ip, r1
.Lfunc_00150444_20:
	ldrne	r4, [r0, #40]
.Lfunc_00150444_24:
	cmpne	r4, r1
.Lfunc_00150444_28:
	beq	.Lfunc_00150444_5c
.Lfunc_00150444_2c:
	cmp	r2, #0
.Lfunc_00150444_30:
	streq	r1, [r0, #28]
.Lfunc_00150444_34:
	beq	.Lfunc_00150444_68
.Lfunc_00150444_38:
	cmp	r3, #0
.Lfunc_00150444_3c:
	streq	r1, [r0, #32]
.Lfunc_00150444_40:
	beq	.Lfunc_00150444_68
.Lfunc_00150444_44:
	cmp	ip, #0
.Lfunc_00150444_48:
	streq	r1, [r0, #36]
.Lfunc_00150444_4c:
	beq	.Lfunc_00150444_68
.Lfunc_00150444_50:
	cmp	r4, #0
.Lfunc_00150444_54:
	streq	r1, [r0, #40]
.Lfunc_00150444_58:
	beq	.Lfunc_00150444_68
.Lfunc_00150444_5c:
	pop	{r4}
.Lfunc_00150444_60:
	mov	r0, #0
.Lfunc_00150444_64:
	bx	lr
.Lfunc_00150444_68:
	pop	{r4}
.Lfunc_00150444_6c:
	mov	r0, #1
.Lfunc_00150444_70:
	bx	lr
.size func_00150444, .-func_00150444

.section .text.func_0018007C,"ax",%progbits
.balign 4
.global func_0018007C
.type func_0018007C, %function
func_0018007C:
.Lfunc_0018007C_0:
	push	{r4, r5, r6}
.Lfunc_0018007C_4:
	mov	r4, #4
.Lfunc_0018007C_8:
	ldr	ip, [r3, r4, lsl #2]
.Lfunc_0018007C_c:
	sub	r4, r4, #1
.Lfunc_0018007C_10:
	cmp	r4, #0
.Lfunc_0018007C_14:
	add	ip, r1, ip, lsl #2
.Lfunc_0018007C_18:
	add	r5, ip, r2, lsl #2
.Lfunc_0018007C_1c:
	ldr	r6, [ip]
.Lfunc_0018007C_20:
	str	r6, [r0], #4
.Lfunc_0018007C_24:
	ldr	r6, [ip, r2, lsl #2]
.Lfunc_0018007C_28:
	str	r6, [r0], #4
.Lfunc_0018007C_2c:
	ldr	r6, [ip, #4]
.Lfunc_0018007C_30:
	add	ip, ip, r2, lsl #3
.Lfunc_0018007C_34:
	str	r6, [r0], #4
.Lfunc_0018007C_38:
	ldr	r5, [r5, #4]
.Lfunc_0018007C_3c:
	add	r6, ip, r2, lsl #2
.Lfunc_0018007C_40:
	str	r5, [r0], #4
.Lfunc_0018007C_44:
	ldr	r5, [ip]
.Lfunc_0018007C_48:
	str	r5, [r0], #4
.Lfunc_0018007C_4c:
	ldr	r5, [ip, r2, lsl #2]
.Lfunc_0018007C_50:
	str	r5, [r0], #4
.Lfunc_0018007C_54:
	ldr	ip, [ip, #4]
.Lfunc_0018007C_58:
	str	ip, [r0], #4
.Lfunc_0018007C_5c:
	ldr	ip, [r6, #4]
.Lfunc_0018007C_60:
	str	ip, [r0], #4
.Lfunc_0018007C_64:
	bgt	.Lfunc_0018007C_8
.Lfunc_0018007C_68:
	pop	{r4, r5, r6}
.Lfunc_0018007C_6c:
	bx	lr
.size func_0018007C, .-func_0018007C

.section .text.func_001C24B4,"ax",%progbits
.balign 4
.global func_001C24B4
.type func_001C24B4, %function
func_001C24B4:
.Lfunc_001C24B4_0:
	push	{r4, r5, r6, r7}
.Lfunc_001C24B4_4:
	tst	r1, #192
.Lfunc_001C24B4_8:
	ldr	ip, [sp, #16]
.Lfunc_001C24B4_c:
	ldrd	r4, [sp, #20]
.Lfunc_001C24B4_10:
	ldrb	r6, [r0, #38]
.Lfunc_001C24B4_14:
	and	r7, r1, #192
.Lfunc_001C24B4_18:
	and	r4, r4, #47
.Lfunc_001C24B4_1c:
	orr	r4, r4, r7
.Lfunc_001C24B4_20:
	orr	r6, r6, #8
.Lfunc_001C24B4_24:
	strb	r4, [r0, #36]
.Lfunc_001C24B4_28:
	strb	r6, [r0, #38]
.Lfunc_001C24B4_2c:
	bne	.Lfunc_001C24B4_48
.Lfunc_001C24B4_30:
	cmp	r2, #16
.Lfunc_001C24B4_34:
	cmpne	r2, #17
.Lfunc_001C24B4_38:
	bne	.Lfunc_001C24B4_48
.Lfunc_001C24B4_3c:
	ldrb	r1, [r0, #36]
.Lfunc_001C24B4_40:
	orr	r4, r1, #32
.Lfunc_001C24B4_44:
	strb	r4, [r0, #36]
.Lfunc_001C24B4_48:
	str	r2, [r0, #32]
.Lfunc_001C24B4_4c:
	ldrb	r1, [r0, #38]
.Lfunc_001C24B4_50:
	str	r3, [r0, #4]
.Lfunc_001C24B4_54:
	str	ip, [r0]
.Lfunc_001C24B4_58:
	orr	r1, r1, #8
.Lfunc_001C24B4_5c:
	and	r1, r1, #255
.Lfunc_001C24B4_60:
	orr	r1, r1, r5
.Lfunc_001C24B4_64:
	strb	r1, [r0, #38]
.Lfunc_001C24B4_68:
	pop	{r4, r5, r6, r7}
.Lfunc_001C24B4_6c:
	bx	lr
.size func_001C24B4, .-func_001C24B4

.section .text.func_00355BF0,"ax",%progbits
.balign 4
.global func_00355BF0
.type func_00355BF0, %function
func_00355BF0:
.Lfunc_00355BF0_0:
	push	{r4, r5, r6, lr}
.Lfunc_00355BF0_4:
	mov	r6, r0
.Lfunc_00355BF0_8:
	ldr	r4, [r0, #12]
.Lfunc_00355BF0_c:
	ldr	r5, [r4, #44]
.Lfunc_00355BF0_10:
	ldrd	r0, [r4, #20]
.Lfunc_00355BF0_14:
	mul	r0, r0, r1
.Lfunc_00355BF0_18:
	cmp	r0, r5
.Lfunc_00355BF0_1c:
	bhi	.Lfunc_00355BF0_30
.Lfunc_00355BF0_20:
	mov	r2, #0
.Lfunc_00355BF0_24:
	mov	r1, r2
.Lfunc_00355BF0_28:
	mov	r0, r2
.Lfunc_00355BF0_2c:
	mov	r0, r0
.Lfunc_00355BF0_30:
	ldr	r0, [r4, #32]
.Lfunc_00355BF0_34:
	rsb	r2, r5, r5, lsl #3
.Lfunc_00355BF0_38:
	mov	r1, #24
.Lfunc_00355BF0_3c:
	add	r1, r1, r2, lsl #2
.Lfunc_00355BF0_40:
	ldr	r0, [r0, r1]
.Lfunc_00355BF0_44:
	cmp	r0, #0
.Lfunc_00355BF0_48:
	beq	.Lfunc_00355BF0_6c
.Lfunc_00355BF0_4c:
	mov	r1, #1
.Lfunc_00355BF0_50:
	strb	r1, [r0, #51]
.Lfunc_00355BF0_54:
	mov	r2, #0
.Lfunc_00355BF0_58:
	str	r0, [r6, #12]
.Lfunc_00355BF0_5c:
	strb	r2, [r0, #48]
.Lfunc_00355BF0_60:
	ldr	r0, [r6, #12]
.Lfunc_00355BF0_64:
	strb	r2, [r0, #50]
.Lfunc_00355BF0_68:
	strb	r1, [r6, #37]
.Lfunc_00355BF0_6c:
	pop	{r4, r5, r6, pc}
.size func_00355BF0, .-func_00355BF0

.section .text.func_0018C714,"ax",%progbits
.balign 4
.global func_0018C714
.type func_0018C714, %function
func_0018C714:
.Lfunc_0018C714_0:
	push	{r4, r5, r6, r7, r8, r9}
.Lfunc_0018C714_4:
	ldm	r1, {r2, r3, r4, r5, r6, r7, r8, ip}
.Lfunc_0018C714_8:
	add	r9, r0, #52
.Lfunc_0018C714_c:
	stm	r9, {r2, r3, r4, r5, r6, r7, r8, ip}
.Lfunc_0018C714_10:
	add	r2, r1, #32
.Lfunc_0018C714_14:
	add	r5, r0, #84
.Lfunc_0018C714_18:
	ldm	r2, {r2, r3, r4, ip}
.Lfunc_0018C714_1c:
	stm	r5, {r2, r3, r4, ip}
.Lfunc_0018C714_20:
	ldr	r0, [r0, #104]
.Lfunc_0018C714_24:
	pop	{r4, r5, r6, r7, r8, r9}
.Lfunc_0018C714_28:
	mov	r0, r0
.Lfunc_0018C714_2c:
	push	{r4, r5, r6, r7, r8}
.Lfunc_0018C714_30:
	ldm	r1, {r2, r3, r4, r5, r6, r7, r8, ip}
.Lfunc_0018C714_34:
	strd	r2, [r0, #56]
.Lfunc_0018C714_38:
	add	r2, r0, #64
.Lfunc_0018C714_3c:
	stm	r2, {r4, r5, r6, r7, r8, ip}
.Lfunc_0018C714_40:
	add	r2, r1, #32
.Lfunc_0018C714_44:
	add	r4, r0, #88
.Lfunc_0018C714_48:
	ldm	r2, {r2, r3, ip}
.Lfunc_0018C714_4c:
	ldr	r1, [r1, #44]
.Lfunc_0018C714_50:
	str	r1, [r0, #100]
.Lfunc_0018C714_54:
	stm	r4, {r2, r3, ip}
.Lfunc_0018C714_58:
	ldrh	r1, [r0, #108]
.Lfunc_0018C714_5c:
	orr	r1, r1, #1
.Lfunc_0018C714_60:
	strh	r1, [r0, #108]
.Lfunc_0018C714_64:
	pop	{r4, r5, r6, r7, r8}
.Lfunc_0018C714_68:
	bx	lr
.size func_0018C714, .-func_0018C714

.section .text.func_0018CD90,"ax",%progbits
.balign 4
.global func_0018CD90
.type func_0018CD90, %function
func_0018CD90:
.Lfunc_0018CD90_0:
	push	{r4, r5}
.Lfunc_0018CD90_4:
	ldrh	ip, [r0, #16]
.Lfunc_0018CD90_8:
	add	r3, r0, #20
.Lfunc_0018CD90_c:
	mov	r5, r0
.Lfunc_0018CD90_10:
	mov	r0, #0
.Lfunc_0018CD90_14:
	cmp	ip, #0
.Lfunc_0018CD90_18:
	mov	r2, #20480
.Lfunc_0018CD90_1c:
	mov	r1, r0
.Lfunc_0018CD90_20:
	ble	.Lfunc_0018CD90_50
.Lfunc_0018CD90_24:
	add	r4, r1, r1, lsl #1
.Lfunc_0018CD90_28:
	add	r4, r3, r4, lsl #2
.Lfunc_0018CD90_2c:
	ldrh	r4, [r4]
.Lfunc_0018CD90_30:
	cmp	r4, r2
.Lfunc_0018CD90_34:
	bne	.Lfunc_0018CD90_58
.Lfunc_0018CD90_38:
	add	r1, r1, r1, lsl #1
.Lfunc_0018CD90_3c:
	adds	r1, r3, r1, lsl #2
.Lfunc_0018CD90_40:
	ldrne	r1, [r1, #4]
.Lfunc_0018CD90_44:
	cmpne	r1, #0
.Lfunc_0018CD90_48:
	addne	r0, r1, r5
.Lfunc_0018CD90_4c:
	beq	.Lfunc_0018CD90_50
.Lfunc_0018CD90_50:
	pop	{r4, r5}
.Lfunc_0018CD90_54:
	bx	lr
.Lfunc_0018CD90_58:
	add	r1, r1, #1
.Lfunc_0018CD90_5c:
	cmp	ip, r1
.Lfunc_0018CD90_60:
	bgt	.Lfunc_0018CD90_24
.Lfunc_0018CD90_64:
	pop	{r4, r5}
.Lfunc_0018CD90_68:
	bx	lr
.size func_0018CD90, .-func_0018CD90

.section .text.func_00415F30,"ax",%progbits
.balign 4
.global func_00415F30
.type func_00415F30, %function
func_00415F30:
.Lfunc_00415F30_0:
	cmp	r2, #0
.Lfunc_00415F30_4:
	push	{r4}
.Lfunc_00415F30_8:
	ble	.Lfunc_00415F30_28
.Lfunc_00415F30_c:
	mov	r3, #0
.Lfunc_00415F30_10:
	mvn	ip, #47
.Lfunc_00415F30_14:
	str	r3, [r0]
.Lfunc_00415F30_18:
	b	.Lfunc_00415F30_4c
.Lfunc_00415F30_1c:
	sub	r4, r3, #48
.Lfunc_00415F30_20:
	cmp	r4, #10
.Lfunc_00415F30_24:
	bcc	.Lfunc_00415F30_34
.Lfunc_00415F30_28:
	pop	{r4}
.Lfunc_00415F30_2c:
	mov	r0, #0
.Lfunc_00415F30_30:
	bx	lr
.Lfunc_00415F30_34:
	ldr	r4, [r0]
.Lfunc_00415F30_38:
	add	r1, r1, #2
.Lfunc_00415F30_3c:
	add	r4, r4, r4, lsl #2
.Lfunc_00415F30_40:
	add	r4, ip, r4, lsl #1
.Lfunc_00415F30_44:
	add	r3, r3, r4
.Lfunc_00415F30_48:
	str	r3, [r0]
.Lfunc_00415F30_4c:
	subs	r2, r2, #1
.Lfunc_00415F30_50:
	bmi	.Lfunc_00415F30_60
.Lfunc_00415F30_54:
	ldrh	r3, [r1]
.Lfunc_00415F30_58:
	cmp	r3, #0
.Lfunc_00415F30_5c:
	bne	.Lfunc_00415F30_1c
.Lfunc_00415F30_60:
	pop	{r4}
.Lfunc_00415F30_64:
	mov	r0, #1
.Lfunc_00415F30_68:
	bx	lr
.size func_00415F30, .-func_00415F30

.section .text.func_0046D748,"ax",%progbits
.balign 4
.global func_0046D748
.type func_0046D748, %function
func_0046D748:
.Lfunc_0046D748_0:
	ldrh	r2, [r0]
.Lfunc_0046D748_4:
	ldrh	r3, [r1]
.Lfunc_0046D748_8:
	cmp	r2, r3
.Lfunc_0046D748_c:
	bne	.Lfunc_0046D748_64
.Lfunc_0046D748_10:
	ldrb	r2, [r0, #2]
.Lfunc_0046D748_14:
	ldrb	r3, [r1, #2]
.Lfunc_0046D748_18:
	cmp	r2, r3
.Lfunc_0046D748_1c:
	bne	.Lfunc_0046D748_64
.Lfunc_0046D748_20:
	ldrb	r2, [r0, #3]
.Lfunc_0046D748_24:
	ldrb	r3, [r1, #3]
.Lfunc_0046D748_28:
	cmp	r2, r3
.Lfunc_0046D748_2c:
	bne	.Lfunc_0046D748_64
.Lfunc_0046D748_30:
	ldrsb	r2, [r0, #4]
.Lfunc_0046D748_34:
	ldrsb	r3, [r1, #4]
.Lfunc_0046D748_38:
	cmp	r2, r3
.Lfunc_0046D748_3c:
	bne	.Lfunc_0046D748_64
.Lfunc_0046D748_40:
	ldrsb	r2, [r0, #5]
.Lfunc_0046D748_44:
	ldrsb	r3, [r1, #5]
.Lfunc_0046D748_48:
	cmp	r2, r3
.Lfunc_0046D748_4c:
	bne	.Lfunc_0046D748_64
.Lfunc_0046D748_50:
	ldr	r0, [r0, #8]
.Lfunc_0046D748_54:
	ldr	r1, [r1, #8]
.Lfunc_0046D748_58:
	cmp	r0, r1
.Lfunc_0046D748_5c:
	moveq	r0, #1
.Lfunc_0046D748_60:
	beq	.Lfunc_0046D748_68
.Lfunc_0046D748_64:
	mov	r0, #0
.Lfunc_0046D748_68:
	bx	lr
.size func_0046D748, .-func_0046D748

.section .text.func_00491870,"ax",%progbits
.balign 4
.global func_00491870
.type func_00491870, %function
func_00491870:
.Lfunc_00491870_0:
	push	{r4, r5, r6, lr}
.Lfunc_00491870_4:
	mov	r4, r0
.Lfunc_00491870_8:
	strh	r1, [r0, #20]
.Lfunc_00491870_c:
	strb	r2, [r0, #30]
.Lfunc_00491870_10:
	ldr	r0, [r4]
.Lfunc_00491870_14:
	cmp	r2, #9
.Lfunc_00491870_18:
	movne	r5, #1
.Lfunc_00491870_1c:
	moveq	r5, #0
.Lfunc_00491870_20:
	str	r5, [r0, #64]
.Lfunc_00491870_24:
	ldr	r0, [r4, #16]
.Lfunc_00491870_28:
	ldr	r1, [r0, #12]
.Lfunc_00491870_2c:
	cmp	r1, #0
.Lfunc_00491870_30:
	strbeq	r5, [r0, #33]
.Lfunc_00491870_34:
	beq	.Lfunc_00491870_48
.Lfunc_00491870_38:
	mov	r2, #0
.Lfunc_00491870_3c:
	mov	r1, r2
.Lfunc_00491870_40:
	mov	r0, r2
.Lfunc_00491870_44:
	mov	r0, r0
.Lfunc_00491870_48:
	cmp	r5, #0
.Lfunc_00491870_4c:
	bne	.Lfunc_00491870_60
.Lfunc_00491870_50:
	ldrb	r0, [r4, #28]
.Lfunc_00491870_54:
	mov	r1, #9
.Lfunc_00491870_58:
	strb	r1, [r4, #28]
.Lfunc_00491870_5c:
	strb	r0, [r4, #29]
.Lfunc_00491870_60:
	mov	r0, #1
.Lfunc_00491870_64:
	str	r0, [r4, #48]
.Lfunc_00491870_68:
	pop	{r4, r5, r6, pc}
.size func_00491870, .-func_00491870

.section .text.func_004C226C,"ax",%progbits
.balign 4
.global func_004C226C
.type func_004C226C, %function
func_004C226C:
.Lfunc_004C226C_0:
	push	{r4, r5}
.Lfunc_004C226C_4:
	ldrh	ip, [r0, #16]
.Lfunc_004C226C_8:
	add	r3, r0, #20
.Lfunc_004C226C_c:
	mov	r5, r0
.Lfunc_004C226C_10:
	mov	r0, #0
.Lfunc_004C226C_14:
	cmp	ip, #0
.Lfunc_004C226C_18:
	mov	r2, #28672
.Lfunc_004C226C_1c:
	mov	r1, r0
.Lfunc_004C226C_20:
	ble	.Lfunc_004C226C_50
.Lfunc_004C226C_24:
	add	r4, r1, r1, lsl #1
.Lfunc_004C226C_28:
	add	r4, r3, r4, lsl #2
.Lfunc_004C226C_2c:
	ldrh	r4, [r4]
.Lfunc_004C226C_30:
	cmp	r4, r2
.Lfunc_004C226C_34:
	bne	.Lfunc_004C226C_58
.Lfunc_004C226C_38:
	add	r1, r1, r1, lsl #1
.Lfunc_004C226C_3c:
	adds	r1, r3, r1, lsl #2
.Lfunc_004C226C_40:
	ldrne	r1, [r1, #4]
.Lfunc_004C226C_44:
	cmpne	r1, #0
.Lfunc_004C226C_48:
	addne	r0, r1, r5
.Lfunc_004C226C_4c:
	beq	.Lfunc_004C226C_50
.Lfunc_004C226C_50:
	pop	{r4, r5}
.Lfunc_004C226C_54:
	bx	lr
.Lfunc_004C226C_58:
	add	r1, r1, #1
.Lfunc_004C226C_5c:
	cmp	ip, r1
.Lfunc_004C226C_60:
	bgt	.Lfunc_004C226C_24
.Lfunc_004C226C_64:
	pop	{r4, r5}
.Lfunc_004C226C_68:
	bx	lr
.size func_004C226C, .-func_004C226C

.section .text.func_001CDC60,"ax",%progbits
.balign 4
.global func_001CDC60
.type func_001CDC60, %function
func_001CDC60:
.Lfunc_001CDC60_0:
	ldr	r2, [r2, #328]
.Lfunc_001CDC60_4:
	cmp	r2, #0
.Lfunc_001CDC60_8:
	bne	.Lfunc_001CDC60_60
.Lfunc_001CDC60_c:
	ldr	r2, [r1, #8]
.Lfunc_001CDC60_10:
	ldr	r3, [r0, #8]
.Lfunc_001CDC60_14:
	subs	r2, r3, r2
.Lfunc_001CDC60_18:
	movne	r0, r2
.Lfunc_001CDC60_1c:
	bne	.Lfunc_001CDC60_50
.Lfunc_001CDC60_20:
	ldr	r2, [r0, #4]
.Lfunc_001CDC60_24:
	ldr	r1, [r1, #4]
.Lfunc_001CDC60_28:
	sub	r0, r3, #1
.Lfunc_001CDC60_2c:
	cmn	r0, #1
.Lfunc_001CDC60_30:
	ble	.Lfunc_001CDC60_60
.Lfunc_001CDC60_34:
	ldr	ip, [r2, r0, lsl #2]
.Lfunc_001CDC60_38:
	ldr	r3, [r1, r0, lsl #2]
.Lfunc_001CDC60_3c:
	cmp	ip, r3
.Lfunc_001CDC60_40:
	beq	.Lfunc_001CDC60_54
.Lfunc_001CDC60_44:
	cmp	ip, r3
.Lfunc_001CDC60_48:
	mvnls	r0, #0
.Lfunc_001CDC60_4c:
	movhi	r0, #1
.Lfunc_001CDC60_50:
	bx	lr
.Lfunc_001CDC60_54:
	sub	r0, r0, #1
.Lfunc_001CDC60_58:
	cmn	r0, #1
.Lfunc_001CDC60_5c:
	bgt	.Lfunc_001CDC60_34
.Lfunc_001CDC60_60:
	mov	r0, #0
.Lfunc_001CDC60_64:
	bx	lr
.size func_001CDC60, .-func_001CDC60

.section .text.func_0046BE44,"ax",%progbits
.balign 4
.global func_0046BE44
.type func_0046BE44, %function
func_0046BE44:
.Lfunc_0046BE44_0:
	push	{r4}
.Lfunc_0046BE44_4:
	ldr	r0, [r0, #48]
.Lfunc_0046BE44_8:
	mvn	r4, #3
.Lfunc_0046BE44_c:
	add	r1, r4, r1, lsl #2
.Lfunc_0046BE44_10:
	add	r0, r0, r1
.Lfunc_0046BE44_14:
	mov	ip, #0
.Lfunc_0046BE44_18:
	ldrb	r1, [r0, #3]
.Lfunc_0046BE44_1c:
	and	r4, r1, #4
.Lfunc_0046BE44_20:
	cmp	r4, #0
.Lfunc_0046BE44_24:
	cmpne	r2, #0
.Lfunc_0046BE44_28:
	ble	.Lfunc_0046BE44_3c
.Lfunc_0046BE44_2c:
	tst	r1, #2
.Lfunc_0046BE44_30:
	addne	ip, r2, #1
.Lfunc_0046BE44_34:
	moveq	ip, r2
.Lfunc_0046BE44_38:
	b	.Lfunc_0046BE44_4c
.Lfunc_0046BE44_3c:
	cmp	r3, #1
.Lfunc_0046BE44_40:
	bne	.Lfunc_0046BE44_4c
.Lfunc_0046BE44_44:
	tst	r1, #2
.Lfunc_0046BE44_48:
	movne	ip, #1
.Lfunc_0046BE44_4c:
	ldrb	r1, [r0, #2]
.Lfunc_0046BE44_50:
	ldrh	r0, [r0]
.Lfunc_0046BE44_54:
	pop	{r4}
.Lfunc_0046BE44_58:
	cmp	r1, ip
.Lfunc_0046BE44_5c:
	movle	ip, #0
.Lfunc_0046BE44_60:
	add	r0, r0, ip
.Lfunc_0046BE44_64:
	bx	lr
.size func_0046BE44, .-func_0046BE44

.section .text.func_004B1E20,"ax",%progbits
.balign 4
.global func_004B1E20
.type func_004B1E20, %function
func_004B1E20:
.Lfunc_004B1E20_0:
	push	{r4, r5}
.Lfunc_004B1E20_4:
	ldr	r2, [r0, #4]
.Lfunc_004B1E20_8:
	ldr	r3, [r1, #4]
.Lfunc_004B1E20_c:
	cmp	r2, r0
.Lfunc_004B1E20_10:
	cmpne	r3, r1
.Lfunc_004B1E20_14:
	beq	.Lfunc_004B1E20_3c
.Lfunc_004B1E20_18:
	ldrh	ip, [r2, #8]
.Lfunc_004B1E20_1c:
	ldrh	r4, [r3, #8]
.Lfunc_004B1E20_20:
	cmp	ip, r4
.Lfunc_004B1E20_24:
	bhi	.Lfunc_004B1E20_48
.Lfunc_004B1E20_28:
	ldrh	ip, [r2, #10]
.Lfunc_004B1E20_2c:
	cmp	r4, ip
.Lfunc_004B1E20_30:
	ldrhi	r2, [r2, #4]
.Lfunc_004B1E20_34:
	bhi	.Lfunc_004B1E20_c
.Lfunc_004B1E20_38:
	b	.Lfunc_004B1E20_58
.Lfunc_004B1E20_3c:
	pop	{r4, r5}
.Lfunc_004B1E20_40:
	mov	r0, #0
.Lfunc_004B1E20_44:
	bx	lr
.Lfunc_004B1E20_48:
	ldrh	r4, [r3, #10]
.Lfunc_004B1E20_4c:
	cmp	ip, r4
.Lfunc_004B1E20_50:
	ldrhi	r3, [r3, #4]
.Lfunc_004B1E20_54:
	bhi	.Lfunc_004B1E20_c
.Lfunc_004B1E20_58:
	pop	{r4, r5}
.Lfunc_004B1E20_5c:
	mov	r0, #1
.Lfunc_004B1E20_60:
	bx	lr
.size func_004B1E20, .-func_004B1E20

.section .text.func_004B9260,"ax",%progbits
.balign 4
.global func_004B9260
.type func_004B9260, %function
func_004B9260:
.Lfunc_004B9260_0:
	ldr	r0, [r0]
.Lfunc_004B9260_4:
	ldr	r0, [r0]
.Lfunc_004B9260_8:
	cmp	r0, #-2147483648
.Lfunc_004B9260_c:
	bne	.Lfunc_004B9260_60
.Lfunc_004B9260_10:
	ldr	r0, [r1, #4]
.Lfunc_004B9260_14:
	ldr	r2, [r1]
.Lfunc_004B9260_18:
	add	r2, r2, r0
.Lfunc_004B9260_1c:
	sub	r0, r0, #1
.Lfunc_004B9260_20:
	sub	r2, r2, #1
.Lfunc_004B9260_24:
	bic	r0, r2, r0
.Lfunc_004B9260_28:
	ldr	r2, [r1, #4]
.Lfunc_004B9260_2c:
	add	r0, r0, #76
.Lfunc_004B9260_30:
	add	r0, r0, r2
.Lfunc_004B9260_34:
	sub	r2, r2, #1
.Lfunc_004B9260_38:
	sub	r0, r0, #1
.Lfunc_004B9260_3c:
	bic	r0, r0, r2
.Lfunc_004B9260_40:
	ldr	r2, [r1, #4]
.Lfunc_004B9260_44:
	add	r0, r0, #32
.Lfunc_004B9260_48:
	add	r0, r0, r2
.Lfunc_004B9260_4c:
	sub	r2, r2, #1
.Lfunc_004B9260_50:
	sub	r0, r0, #1
.Lfunc_004B9260_54:
	bic	r0, r0, r2
.Lfunc_004B9260_58:
	add	r0, r0, #32
.Lfunc_004B9260_5c:
	str	r0, [r1]
.Lfunc_004B9260_60:
	bx	lr
.size func_004B9260, .-func_004B9260
```
