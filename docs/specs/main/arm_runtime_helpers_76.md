# Probe-verified ARM runtime/helper batch 76

Source SHA-256: `352afcbd4a87ff48dfebd869881f01249c17edf87e9c64d55f9629e48b339d3c`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 1,312 executable body bytes (328 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and independently
assembled exact-schedule probes. The batch excludes every previously configured
function and is disjoint from pending duplicate batch 73, IPC batch 70, and
runtime batch 75.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the current target
inventory, so no member belongs to an exact-duplicate family. Private inspection
artifacts used for selection are not part of this specification. Independent
ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16
matched all twenty-four complete bodies (1,312 bytes / 328 instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0012FB08` | `.text.func_0012FB08` | ARM | 56 | 14 | 1 | 4 | 1 | `func_0012FB40` |
| `func_0013E948` | `.text.func_0013E948` | ARM | 56 | 14 | 2 | 4 | 1 | `func_0013E980` |
| `func_0013E980` | `.text.func_0013E980` | ARM | 56 | 14 | 2 | 4 | 1 | `func_0013E9B8` |
| `func_002BCF54` | `.text.func_002BCF54` | ARM | 56 | 14 | 2 | 1 | 2 | `func_002BCF8C` |
| `func_002C32E8` | `.text.func_002C32E8` | ARM | 56 | 14 | 0 | 5 | 1 | `func_002C3320` |
| `func_002C69C4` | `.text.func_002C69C4` | ARM | 56 | 14 | 0 | 7 | 1 | `func_002C69FC` |
| `func_002CD7E0` | `.text.func_002CD7E0` | ARM | 56 | 14 | 2 | 4 | 1 | `func_002CD818` |
| `func_00328F34` | `.text.func_00328F34` | ARM | 56 | 14 | 0 | 9 | 1 | `func_00328FB8` |
| `func_003368F0` | `.text.func_003368F0` | ARM | 56 | 14 | 1 | 5 | 1 | `func_00336930` |
| `func_003B6608` | `.text.func_003B6608` | ARM | 56 | 14 | 1 | 8 | 1 | `func_003B6804` |
| `func_003B786C` | `.text.func_003B786C` | ARM | 56 | 14 | 1 | 10 | 1 | `func_003B78A4` |
| `func_003BCE2C` | `.text.func_003BCE2C` | ARM | 56 | 14 | 2 | 6 | 1 | `func_003BCE64` |
| `func_004ABE4C` | `.text.func_004ABE4C` | ARM | 56 | 14 | 3 | 4 | 2 | `func_004AC26C` |
| `func_004BF408` | `.text.func_004BF408` | ARM | 56 | 14 | 2 | 4 | 1 | `func_004BF440` |
| `func_004BF480` | `.text.func_004BF480` | ARM | 56 | 14 | 2 | 4 | 1 | `func_004BF4B8` |
| `func_004C3F74` | `.text.func_004C3F74` | ARM | 56 | 14 | 1 | 3 | 1 | `func_004C3FAC` |
| `func_0011FBDC` | `.text.func_0011FBDC` | ARM | 52 | 13 | 1 | 4 | 2 | `func_0011FDA4` |
| `func_001873D8` | `.text.func_001873D8` | ARM | 52 | 13 | 0 | 6 | 1 | `func_00187424` |
| `func_00196268` | `.text.func_00196268` | ARM | 52 | 13 | 0 | 6 | 1 | `func_0019629C` |
| `func_001C23A0` | `.text.func_001C23A0` | ARM | 52 | 13 | 1 | 7 | 1 | `func_001C23D4` |
| `func_001CA260` | `.text.func_001CA260` | ARM | 52 | 13 | 2 | 6 | 1 | `func_001CA294` |
| `func_001F371C` | `.text.func_001F371C` | ARM | 52 | 13 | 0 | 9 | 1 | `func_001F3884` |
| `func_00201AE8` | `.text.func_00201AE8` | ARM | 52 | 13 | 2 | 3 | 1 | `func_00201B1C` |
| `func_002B3F48` | `.text.func_002B3F48` | ARM | 52 | 13 | 0 | 8 | 1 | `func_002B45C0` |

Memory-operation counts include scalar loads/stores and stack transfers.
Return transfers are excluded from the local-branch column. The per-function
counts total 28 direct function-local B-family sites, all conditional. The
bodies also contain 27 separately validated return transfers and 131 memory
operations.

The canonical direct-branch schedule SHA-256 is
`c5e37f5e9fcd4cc0bafd25e1bd324ce3ef25108061d29504c1a4dcb488383ba3`.
The canonical return-transfer schedule SHA-256 is
`e36d38a82b4f8f103680f54f55ecc69d73bf00c97fd61803dcc589a57b6d1c66`.
Both digests were independently reproduced from the bounded target sections and
from the assembled exact-schedule probe.

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

.section .text.func_0012FB08,"ax",%progbits
.balign 4
.global func_0012FB08
.type func_0012FB08, %function
func_0012FB08:
.Lfunc_0012FB08_0:
	ldr	r0, [r0]
.Lfunc_0012FB08_4:
	cmp	r0, #0
.Lfunc_0012FB08_8:
	ldrhne	r2, [r0, #2]
.Lfunc_0012FB08_c:
	cmpne	r2, r1
.Lfunc_0012FB08_10:
	movls	r0, #0
.Lfunc_0012FB08_14:
	bls	.Lfunc_0012FB08_34
.Lfunc_0012FB08_18:
	mov	r3, #8
.Lfunc_0012FB08_1c:
	mov	r2, #4
.Lfunc_0012FB08_20:
	add	r3, r3, r1, lsl #2
.Lfunc_0012FB08_24:
	add	r1, r2, r1, lsl #2
.Lfunc_0012FB08_28:
	ldr	r2, [r0, r3]
.Lfunc_0012FB08_2c:
	ldr	r0, [r0, r1]
.Lfunc_0012FB08_30:
	sub	r0, r2, r0
.Lfunc_0012FB08_34:
	bx	lr
.size func_0012FB08, .-func_0012FB08

.section .text.func_0013E948,"ax",%progbits
.balign 4
.global func_0013E948
.type func_0013E948, %function
func_0013E948:
.Lfunc_0013E948_0:
	ldrh	r1, [r0, #20]
.Lfunc_0013E948_4:
	cmp	r1, #8192
.Lfunc_0013E948_8:
	addeq	r0, r0, #20
.Lfunc_0013E948_c:
	beq	.Lfunc_0013E948_30
.Lfunc_0013E948_10:
	ldrh	r1, [r0, #32]
.Lfunc_0013E948_14:
	cmp	r1, #8192
.Lfunc_0013E948_18:
	addeq	r0, r0, #32
.Lfunc_0013E948_1c:
	beq	.Lfunc_0013E948_30
.Lfunc_0013E948_20:
	ldrh	r1, [r0, #44]
.Lfunc_0013E948_24:
	cmp	r1, #8192
.Lfunc_0013E948_28:
	addeq	r0, r0, #44
.Lfunc_0013E948_2c:
	movne	r0, #0
.Lfunc_0013E948_30:
	ldr	r0, [r0, #8]
.Lfunc_0013E948_34:
	bx	lr
.size func_0013E948, .-func_0013E948

.section .text.func_0013E980,"ax",%progbits
.balign 4
.global func_0013E980
.type func_0013E980, %function
func_0013E980:
.Lfunc_0013E980_0:
	ldrh	r1, [r0, #20]
.Lfunc_0013E980_4:
	cmp	r1, #8192
.Lfunc_0013E980_8:
	addeq	r0, r0, #20
.Lfunc_0013E980_c:
	beq	.Lfunc_0013E980_30
.Lfunc_0013E980_10:
	ldrh	r1, [r0, #32]
.Lfunc_0013E980_14:
	cmp	r1, #8192
.Lfunc_0013E980_18:
	addeq	r0, r0, #32
.Lfunc_0013E980_1c:
	beq	.Lfunc_0013E980_30
.Lfunc_0013E980_20:
	ldrh	r1, [r0, #44]
.Lfunc_0013E980_24:
	cmp	r1, #8192
.Lfunc_0013E980_28:
	addeq	r0, r0, #44
.Lfunc_0013E980_2c:
	movne	r0, #0
.Lfunc_0013E980_30:
	ldr	r0, [r0, #4]
.Lfunc_0013E980_34:
	bx	lr
.size func_0013E980, .-func_0013E980

.section .text.func_002BCF54,"ax",%progbits
.balign 4
.global func_002BCF54
.type func_002BCF54, %function
func_002BCF54:
.Lfunc_002BCF54_0:
	mov	r1, #0
.Lfunc_002BCF54_4:
	add	r2, r1, r1, lsl #1
.Lfunc_002BCF54_8:
	add	r2, r0, r2, lsl #3
.Lfunc_002BCF54_c:
	ldrb	r2, [r2, #60]
.Lfunc_002BCF54_10:
	cmp	r2, #1
.Lfunc_002BCF54_14:
	beq	.Lfunc_002BCF54_30
.Lfunc_002BCF54_18:
	add	r1, r1, #1
.Lfunc_002BCF54_1c:
	and	r1, r1, #255
.Lfunc_002BCF54_20:
	cmp	r1, #12
.Lfunc_002BCF54_24:
	bcc	.Lfunc_002BCF54_4
.Lfunc_002BCF54_28:
	mov	r0, #1
.Lfunc_002BCF54_2c:
	bx	lr
.Lfunc_002BCF54_30:
	mov	r0, #0
.Lfunc_002BCF54_34:
	bx	lr
.size func_002BCF54, .-func_002BCF54

.section .text.func_002C32E8,"ax",%progbits
.balign 4
.global func_002C32E8
.type func_002C32E8, %function
func_002C32E8:
.Lfunc_002C32E8_0:
	subs	r2, r1, #0
.Lfunc_002C32E8_4:
	mov	r3, #0
.Lfunc_002C32E8_8:
	movlt	r2, r3
.Lfunc_002C32E8_c:
	str	r2, [r0, #24]
.Lfunc_002C32E8_10:
	ldr	r0, [r0, #104]
.Lfunc_002C32E8_14:
	mov	r0, r0
.Lfunc_002C32E8_18:
	cmp	r1, #0
.Lfunc_002C32E8_1c:
	mov	r2, #0
.Lfunc_002C32E8_20:
	movlt	r1, r2
.Lfunc_002C32E8_24:
	ldrh	r2, [r0, #108]
.Lfunc_002C32E8_28:
	str	r1, [r0, #32]
.Lfunc_002C32E8_2c:
	orr	r2, r2, #2
.Lfunc_002C32E8_30:
	strh	r2, [r0, #108]
.Lfunc_002C32E8_34:
	bx	lr
.size func_002C32E8, .-func_002C32E8

.section .text.func_002C69C4,"ax",%progbits
.balign 4
.global func_002C69C4
.type func_002C69C4, %function
func_002C69C4:
.Lfunc_002C69C4_0:
	push	{r4, r5}
.Lfunc_002C69C4_4:
	mov	r5, #125
.Lfunc_002C69C4_8:
	mov	r4, #1
.Lfunc_002C69C4_c:
	strb	r5, [r0, #4]
.Lfunc_002C69C4_10:
	mov	r3, #0
.Lfunc_002C69C4_14:
	strb	r4, [r0, #5]
.Lfunc_002C69C4_18:
	mov	ip, #2
.Lfunc_002C69C4_1c:
	str	r3, [r0, #8]
.Lfunc_002C69C4_20:
	strb	ip, [r0, #6]
.Lfunc_002C69C4_24:
	add	r0, r0, #12
.Lfunc_002C69C4_28:
	stm	r0, {r1, r2}
.Lfunc_002C69C4_2c:
	mov	r0, r3
.Lfunc_002C69C4_30:
	pop	{r4, r5}
.Lfunc_002C69C4_34:
	bx	lr
.size func_002C69C4, .-func_002C69C4

.section .text.func_002CD7E0,"ax",%progbits
.balign 4
.global func_002CD7E0
.type func_002CD7E0, %function
func_002CD7E0:
.Lfunc_002CD7E0_0:
	ldrb	ip, [r0, #4]
.Lfunc_002CD7E0_4:
	cmp	ip, #0
.Lfunc_002CD7E0_8:
	beq	.Lfunc_002CD7E0_34
.Lfunc_002CD7E0_c:
	cmp	r3, #4
.Lfunc_002CD7E0_10:
	bcs	.Lfunc_002CD7E0_34
.Lfunc_002CD7E0_14:
	cmp	r1, #0
.Lfunc_002CD7E0_18:
	cmpne	r2, #0
.Lfunc_002CD7E0_1c:
	add	r0, r0, r3, lsl #3
.Lfunc_002CD7E0_20:
	moveq	r1, #0
.Lfunc_002CD7E0_24:
	streq	r1, [r0, #32]
.Lfunc_002CD7E0_28:
	streq	r1, [r0, #36]
.Lfunc_002CD7E0_2c:
	addne	r0, r0, #32
.Lfunc_002CD7E0_30:
	stmne	r0, {r1, r2}
.Lfunc_002CD7E0_34:
	bx	lr
.size func_002CD7E0, .-func_002CD7E0

.section .text.func_00328F34,"ax",%progbits
.balign 4
.global func_00328F34
.type func_00328F34, %function
func_00328F34:
.Lfunc_00328F34_0:
	mov	r2, #0
.Lfunc_00328F34_4:
	mvn	r3, #0
.Lfunc_00328F34_8:
	str	r2, [r0, #16]
.Lfunc_00328F34_c:
	str	r3, [r0, #20]
.Lfunc_00328F34_10:
	str	r3, [r0, #24]
.Lfunc_00328F34_14:
	ldr	r1, [r0, #44]
.Lfunc_00328F34_18:
	and	r1, r1, r3, lsl #11
.Lfunc_00328F34_1c:
	str	r1, [r0, #44]
.Lfunc_00328F34_20:
	ldr	r1, [r0, #48]
.Lfunc_00328F34_24:
	and	r1, r1, r3, lsl #11
.Lfunc_00328F34_28:
	str	r1, [r0, #48]
.Lfunc_00328F34_2c:
	strb	r2, [r0, #77]
.Lfunc_00328F34_30:
	str	r2, [r0, #52]
.Lfunc_00328F34_34:
	bx	lr
.size func_00328F34, .-func_00328F34

.section .text.func_003368F0,"ax",%progbits
.balign 4
.global func_003368F0
.type func_003368F0, %function
func_003368F0:
.Lfunc_003368F0_0:
	mov	r3, r0
.Lfunc_003368F0_4:
	mov	r0, r1
.Lfunc_003368F0_8:
	ldrb	r1, [r3, r0]!
.Lfunc_003368F0_c:
	cmp	r1, #254
.Lfunc_003368F0_10:
	movne	r1, #1
.Lfunc_003368F0_14:
	strne	r1, [r2]
.Lfunc_003368F0_18:
	bne	.Lfunc_003368F0_34
.Lfunc_003368F0_1c:
	ldrb	r1, [r3, #1]
.Lfunc_003368F0_20:
	ldrb	r3, [r3, #2]
.Lfunc_003368F0_24:
	add	r0, r0, #3
.Lfunc_003368F0_28:
	orr	r1, r3, r1, lsl #8
.Lfunc_003368F0_2c:
	orr	r1, r1, #1
.Lfunc_003368F0_30:
	str	r1, [r2]
.Lfunc_003368F0_34:
	bx	lr
.size func_003368F0, .-func_003368F0

.section .text.func_003B6608,"ax",%progbits
.balign 4
.global func_003B6608
.type func_003B6608, %function
func_003B6608:
.Lfunc_003B6608_0:
	push	{r0, r1}
.Lfunc_003B6608_4:
	ldr	r1, [r0, #28]
.Lfunc_003B6608_8:
	ldrh	r2, [sp, #4]
.Lfunc_003B6608_c:
	ldr	r1, [r1, #392]
.Lfunc_003B6608_10:
	bics	r1, r2, r1
.Lfunc_003B6608_14:
	ldrne	r0, [r0, #8]
.Lfunc_003B6608_18:
	bne	.Lfunc_003B6608_30
.Lfunc_003B6608_1c:
	ldr	r1, [r0, #36]
.Lfunc_003B6608_20:
	cmp	r1, #0
.Lfunc_003B6608_24:
	ldrgt	r0, [r0, #16]
.Lfunc_003B6608_28:
	ldrgt	r0, [r0]
.Lfunc_003B6608_2c:
	movle	r0, #0
.Lfunc_003B6608_30:
	add	sp, sp, #8
.Lfunc_003B6608_34:
	bx	lr
.size func_003B6608, .-func_003B6608

.section .text.func_003B786C,"ax",%progbits
.balign 4
.global func_003B786C
.type func_003B786C, %function
func_003B786C:
.Lfunc_003B786C_0:
	mov	r2, #0
.Lfunc_003B786C_4:
	cmp	r1, #0
.Lfunc_003B786C_8:
	str	r2, [r0, #36]
.Lfunc_003B786C_c:
	beq	.Lfunc_003B786C_34
.Lfunc_003B786C_10:
	str	r2, [r0]
.Lfunc_003B786C_14:
	str	r2, [r0, #4]
.Lfunc_003B786C_18:
	str	r2, [r0, #8]
.Lfunc_003B786C_1c:
	str	r2, [r0, #12]
.Lfunc_003B786C_20:
	str	r2, [r0, #16]
.Lfunc_003B786C_24:
	str	r2, [r0, #20]
.Lfunc_003B786C_28:
	str	r2, [r0, #24]
.Lfunc_003B786C_2c:
	str	r2, [r0, #28]
.Lfunc_003B786C_30:
	str	r2, [r0, #32]
.Lfunc_003B786C_34:
	bx	lr
.size func_003B786C, .-func_003B786C

.section .text.func_003BCE2C,"ax",%progbits
.balign 4
.global func_003BCE2C
.type func_003BCE2C, %function
func_003BCE2C:
.Lfunc_003BCE2C_0:
	ldr	r1, [r0, #4]
.Lfunc_003BCE2C_4:
	mov	r2, #0
.Lfunc_003BCE2C_8:
	cmp	r1, r0
.Lfunc_003BCE2C_c:
	beq	.Lfunc_003BCE2C_28
.Lfunc_003BCE2C_10:
	mov	r3, r1
.Lfunc_003BCE2C_14:
	ldr	r1, [r1, #4]
.Lfunc_003BCE2C_18:
	str	r2, [r3, #4]
.Lfunc_003BCE2C_1c:
	str	r2, [r3]
.Lfunc_003BCE2C_20:
	cmp	r1, r0
.Lfunc_003BCE2C_24:
	bne	.Lfunc_003BCE2C_10
.Lfunc_003BCE2C_28:
	add	r1, r0, #4
.Lfunc_003BCE2C_2c:
	stm	r1, {r0, r2}
.Lfunc_003BCE2C_30:
	str	r0, [r0]
.Lfunc_003BCE2C_34:
	bx	lr
.size func_003BCE2C, .-func_003BCE2C

.section .text.func_004ABE4C,"ax",%progbits
.balign 4
.global func_004ABE4C
.type func_004ABE4C, %function
func_004ABE4C:
.Lfunc_004ABE4C_0:
	ldrb	r2, [r0, #12]
.Lfunc_004ABE4C_4:
	cmp	r2, #0
.Lfunc_004ABE4C_8:
	bne	.Lfunc_004ABE4C_30
.Lfunc_004ABE4C_c:
	ldr	r0, [r0, #8]
.Lfunc_004ABE4C_10:
	cmp	r0, #0
.Lfunc_004ABE4C_14:
	beq	.Lfunc_004ABE4C_30
.Lfunc_004ABE4C_18:
	cmp	r1, #0
.Lfunc_004ABE4C_1c:
	beq	.Lfunc_004ABE4C_30
.Lfunc_004ABE4C_20:
	cmp	r1, #10
.Lfunc_004ABE4C_24:
	ldreq	r0, [r0, #40]
.Lfunc_004ABE4C_28:
	ldrne	r0, [r0, #44]
.Lfunc_004ABE4C_2c:
	bx	lr
.Lfunc_004ABE4C_30:
	mov	r0, #0
.Lfunc_004ABE4C_34:
	bx	lr
.size func_004ABE4C, .-func_004ABE4C

.section .text.func_004BF408,"ax",%progbits
.balign 4
.global func_004BF408
.type func_004BF408, %function
func_004BF408:
.Lfunc_004BF408_0:
	ldrh	r1, [r0, #20]
.Lfunc_004BF408_4:
	cmp	r1, #16384
.Lfunc_004BF408_8:
	addeq	r0, r0, #20
.Lfunc_004BF408_c:
	beq	.Lfunc_004BF408_30
.Lfunc_004BF408_10:
	ldrh	r1, [r0, #32]
.Lfunc_004BF408_14:
	cmp	r1, #16384
.Lfunc_004BF408_18:
	addeq	r0, r0, #32
.Lfunc_004BF408_1c:
	beq	.Lfunc_004BF408_30
.Lfunc_004BF408_20:
	ldrh	r1, [r0, #44]
.Lfunc_004BF408_24:
	cmp	r1, #16384
.Lfunc_004BF408_28:
	addeq	r0, r0, #44
.Lfunc_004BF408_2c:
	movne	r0, #0
.Lfunc_004BF408_30:
	ldr	r0, [r0, #8]
.Lfunc_004BF408_34:
	bx	lr
.size func_004BF408, .-func_004BF408

.section .text.func_004BF480,"ax",%progbits
.balign 4
.global func_004BF480
.type func_004BF480, %function
func_004BF480:
.Lfunc_004BF480_0:
	ldrh	r1, [r0, #20]
.Lfunc_004BF480_4:
	cmp	r1, #16384
.Lfunc_004BF480_8:
	addeq	r0, r0, #20
.Lfunc_004BF480_c:
	beq	.Lfunc_004BF480_30
.Lfunc_004BF480_10:
	ldrh	r1, [r0, #32]
.Lfunc_004BF480_14:
	cmp	r1, #16384
.Lfunc_004BF480_18:
	addeq	r0, r0, #32
.Lfunc_004BF480_1c:
	beq	.Lfunc_004BF480_30
.Lfunc_004BF480_20:
	ldrh	r1, [r0, #44]
.Lfunc_004BF480_24:
	cmp	r1, #16384
.Lfunc_004BF480_28:
	addeq	r0, r0, #44
.Lfunc_004BF480_2c:
	movne	r0, #0
.Lfunc_004BF480_30:
	ldr	r0, [r0, #4]
.Lfunc_004BF480_34:
	bx	lr
.size func_004BF480, .-func_004BF480

.section .text.func_004C3F74,"ax",%progbits
.balign 4
.global func_004C3F74
.type func_004C3F74, %function
func_004C3F74:
.Lfunc_004C3F74_0:
	ldr	r2, [r0]
.Lfunc_004C3F74_4:
	mov	r0, #0
.Lfunc_004C3F74_8:
	ldr	r3, [r2, #28]!
.Lfunc_004C3F74_c:
	cmp	r3, #0
.Lfunc_004C3F74_10:
	addne	r2, r2, r3
.Lfunc_004C3F74_14:
	moveq	r2, r0
.Lfunc_004C3F74_18:
	cmp	r2, #0
.Lfunc_004C3F74_1c:
	moveq	r0, #0
.Lfunc_004C3F74_20:
	beq	.Lfunc_004C3F74_34
.Lfunc_004C3F74_24:
	add	r1, r2, r1, lsl #4
.Lfunc_004C3F74_28:
	ldr	r2, [r1, #40]!
.Lfunc_004C3F74_2c:
	cmp	r2, #0
.Lfunc_004C3F74_30:
	addne	r0, r2, r1
.Lfunc_004C3F74_34:
	bx	lr
.size func_004C3F74, .-func_004C3F74

.section .text.func_0011FBDC,"ax",%progbits
.balign 4
.global func_0011FBDC
.type func_0011FBDC, %function
func_0011FBDC:
.Lfunc_0011FBDC_0:
	ldrsb	r2, [r0, #51]
.Lfunc_0011FBDC_4:
	cmp	r1, #0
.Lfunc_0011FBDC_8:
	cmpne	r1, #3
.Lfunc_0011FBDC_c:
	cmpne	r1, #7
.Lfunc_0011FBDC_10:
	mov	r3, #1
.Lfunc_0011FBDC_14:
	beq	.Lfunc_0011FBDC_24
.Lfunc_0011FBDC_18:
	cmp	r2, #0
.Lfunc_0011FBDC_1c:
	strbne	r3, [r0, #49]
.Lfunc_0011FBDC_20:
	bx	lr
.Lfunc_0011FBDC_24:
	cmp	r2, #0
.Lfunc_0011FBDC_28:
	strbne	r3, [r0, #50]
.Lfunc_0011FBDC_2c:
	strbne	r3, [r0, #49]
.Lfunc_0011FBDC_30:
	bx	lr
.size func_0011FBDC, .-func_0011FBDC

.section .text.func_001873D8,"ax",%progbits
.balign 4
.global func_001873D8
.type func_001873D8, %function
func_001873D8:
.Lfunc_001873D8_0:
	cmp	r1, #0
.Lfunc_001873D8_4:
	ldrb	r1, [r0, #7]
.Lfunc_001873D8_8:
	orrne	r1, r1, #1
.Lfunc_001873D8_c:
	biceq	r1, r1, #1
.Lfunc_001873D8_10:
	strb	r1, [r0, #7]
.Lfunc_001873D8_14:
	ldr	r0, [r0, #104]
.Lfunc_001873D8_18:
	and	r1, r1, #255
.Lfunc_001873D8_1c:
	mov	r0, r0
.Lfunc_001873D8_20:
	ldrh	r2, [r0, #108]
.Lfunc_001873D8_24:
	strb	r1, [r0, #15]
.Lfunc_001873D8_28:
	orr	r1, r2, #4
.Lfunc_001873D8_2c:
	strh	r1, [r0, #108]
.Lfunc_001873D8_30:
	bx	lr
.size func_001873D8, .-func_001873D8

.section .text.func_00196268,"ax",%progbits
.balign 4
.global func_00196268
.type func_00196268, %function
func_00196268:
.Lfunc_00196268_0:
	ldr	r1, [r0, #112]
.Lfunc_00196268_4:
	ldr	r2, [r0, #108]
.Lfunc_00196268_8:
	ldr	r3, [r0]
.Lfunc_00196268_c:
	rsb	ip, r1, #0
.Lfunc_00196268_10:
	and	ip, r1, ip
.Lfunc_00196268_14:
	clz	ip, ip
.Lfunc_00196268_18:
	strb	ip, [r0, #42]
.Lfunc_00196268_1c:
	rsb	ip, ip, #32
.Lfunc_00196268_20:
	lsr	ip, r1, ip
.Lfunc_00196268_24:
	str	ip, [r0, #80]
.Lfunc_00196268_28:
	sub	r2, r2, r3
.Lfunc_00196268_2c:
	str	r2, [r0, #84]
.Lfunc_00196268_30:
	bx	lr
.size func_00196268, .-func_00196268

.section .text.func_001C23A0,"ax",%progbits
.balign 4
.global func_001C23A0
.type func_001C23A0, %function
func_001C23A0:
.Lfunc_001C23A0_0:
	ldrb	r2, [r0, #36]
.Lfunc_001C23A0_4:
	tst	r2, #36
.Lfunc_001C23A0_8:
	moveq	r0, #4
.Lfunc_001C23A0_c:
	beq	.Lfunc_001C23A0_30
.Lfunc_001C23A0_10:
	str	r0, [r1, #40]
.Lfunc_001C23A0_14:
	ldr	r2, [r0, #48]
.Lfunc_001C23A0_18:
	str	r2, [r1, #44]
.Lfunc_001C23A0_1c:
	str	r1, [r0, #48]
.Lfunc_001C23A0_20:
	ldrb	r1, [r0, #38]
.Lfunc_001C23A0_24:
	orr	r1, r1, #8
.Lfunc_001C23A0_28:
	strb	r1, [r0, #38]
.Lfunc_001C23A0_2c:
	mov	r0, #0
.Lfunc_001C23A0_30:
	bx	lr
.size func_001C23A0, .-func_001C23A0

.section .text.func_001CA260,"ax",%progbits
.balign 4
.global func_001CA260
.type func_001CA260, %function
func_001CA260:
.Lfunc_001CA260_0:
	ldr	r2, [r0, #328]
.Lfunc_001CA260_4:
	cmp	r2, #0
.Lfunc_001CA260_8:
	movne	r0, r2
.Lfunc_001CA260_c:
	bne	.Lfunc_001CA260_30
.Lfunc_001CA260_10:
	cmp	r1, #0
.Lfunc_001CA260_14:
	str	r1, [r0, #4]
.Lfunc_001CA260_18:
	beq	.Lfunc_001CA260_2c
.Lfunc_001CA260_1c:
	ldr	r2, [r1, #8]
.Lfunc_001CA260_20:
	str	r2, [r0, #332]
.Lfunc_001CA260_24:
	ldr	r1, [r1, #12]
.Lfunc_001CA260_28:
	str	r1, [r0, #336]
.Lfunc_001CA260_2c:
	mov	r0, #0
.Lfunc_001CA260_30:
	bx	lr
.size func_001CA260, .-func_001CA260

.section .text.func_001F371C,"ax",%progbits
.balign 4
.global func_001F371C
.type func_001F371C, %function
func_001F371C:
.Lfunc_001F371C_0:
	mov	r2, #0
.Lfunc_001F371C_4:
	str	r2, [r0, #4]
.Lfunc_001F371C_8:
	strb	r2, [r0, #17]
.Lfunc_001F371C_c:
	strb	r2, [r0, #18]
.Lfunc_001F371C_10:
	mov	r3, #3
.Lfunc_001F371C_14:
	str	r2, [r0, #12]
.Lfunc_001F371C_18:
	mov	ip, #8
.Lfunc_001F371C_1c:
	strb	r3, [r0, #16]
.Lfunc_001F371C_20:
	strb	ip, [r0, #19]
.Lfunc_001F371C_24:
	strb	r2, [r0, #20]
.Lfunc_001F371C_28:
	str	r1, [r0], #8
.Lfunc_001F371C_2c:
	str	r2, [r0]
.Lfunc_001F371C_30:
	bx	lr
.size func_001F371C, .-func_001F371C

.section .text.func_00201AE8,"ax",%progbits
.balign 4
.global func_00201AE8
.type func_00201AE8, %function
func_00201AE8:
.Lfunc_00201AE8_0:
	add	r0, r0, #24
.Lfunc_00201AE8_4:
	mov	r0, r0
.Lfunc_00201AE8_8:
	add	r1, r0, #36
.Lfunc_00201AE8_c:
	mov	r0, #0
.Lfunc_00201AE8_10:
	ldr	r1, [r1]
.Lfunc_00201AE8_14:
	cmp	r1, #0
.Lfunc_00201AE8_18:
	beq	.Lfunc_00201AE8_30
.Lfunc_00201AE8_1c:
	ldr	r2, [r1, #4]
.Lfunc_00201AE8_20:
	ldr	r1, [r1, #12]
.Lfunc_00201AE8_24:
	add	r0, r0, r2
.Lfunc_00201AE8_28:
	cmp	r1, #0
.Lfunc_00201AE8_2c:
	bne	.Lfunc_00201AE8_1c
.Lfunc_00201AE8_30:
	bx	lr
.size func_00201AE8, .-func_00201AE8

.section .text.func_002B3F48,"ax",%progbits
.balign 4
.global func_002B3F48
.type func_002B3F48, %function
func_002B3F48:
.Lfunc_002B3F48_0:
	ldr	r3, [r1]
.Lfunc_002B3F48_4:
	mov	r2, #0
.Lfunc_002B3F48_8:
	strb	r2, [r3, #8]
.Lfunc_002B3F48_c:
	ldrd	r2, [r0, #12]
.Lfunc_002B3F48_10:
	ldr	r1, [r1]
.Lfunc_002B3F48_14:
	add	r2, r2, r3, lsl #1
.Lfunc_002B3F48_18:
	ldrh	r2, [r2]
.Lfunc_002B3F48_1c:
	strh	r2, [r1, #10]
.Lfunc_002B3F48_20:
	ldr	r1, [r0, #16]
.Lfunc_002B3F48_24:
	add	r1, r1, #1
.Lfunc_002B3F48_28:
	str	r1, [r0, #16]
.Lfunc_002B3F48_2c:
	mov	r0, #0
.Lfunc_002B3F48_30:
	bx	lr
.size func_002B3F48, .-func_002B3F48
```

## Implementation contract

The implementation must place exactly one global ARM function in each named
`.text.func_*` section, preserve the 24 configured boundaries and exact
instruction schedules above, and emit no relocations or additional executable
content. All configured call and adjacent-word schedules are empty. An
implementer must assemble the source, compare all 1,312 section bytes against
the target object, confirm the 328/28/27/131 instruction, local-branch, return,
and memory-operation totals, and reproduce both canonical schedule digests.
