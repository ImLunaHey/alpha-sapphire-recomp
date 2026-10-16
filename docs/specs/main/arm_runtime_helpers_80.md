# Probe-verified ARM runtime/helper batch 80

Source SHA-256: `66404577d44266f32040c879df3714b2aee4527ee624780e8ad2c2e4900d1894`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 924 executable body bytes (231
instructions). Evidence was limited to the current unmatched report, the neutral
symbol inventory, bounded private-target control/data-flow inspection, and an
independently assembled exact-schedule probe. Selection excluded every function
name occurring anywhere in any current config, including runtime batch 79, duplicate-template batch 75, and IPC wrapper
batch 72; it also excluded all configured branch destinations, aliases, owners,
and secondary-entry identities.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the complete
current target section inventory, so no member belongs to an exact-duplicate
family. The authoritative report has an unmatched entry below 100 percent for
every selected name and accounts for exactly 924 selected bytes. Private inspection
artifacts used for selection are ignored and are not part of this specification.
Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2`
on 2026-10-16 matched all twenty-four complete bodies (924 bytes / 231
instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0019CC14` | `.text.func_0019CC14` | ARM | 40 | 10 | 1 | 6 | 2 | `func_0019CC3C` |
| `func_001C26E0` | `.text.func_001C26E0` | ARM | 40 | 10 | 1 | 5 | 1 | `func_001C30DC` |
| `func_002B64C8` | `.text.func_002B64C8` | ARM | 40 | 10 | 0 | 7 | 1 | `func_002B64F0` |
| `func_0038CD2C` | `.text.func_0038CD2C` | ARM | 40 | 10 | 1 | 3 | 1 | `func_0038CD54` |
| `func_003C531C` | `.text.func_003C531C` | ARM | 40 | 10 | 0 | 7 | 1 | `func_003C5344` |
| `func_00410BFC` | `.text.func_00410BFC` | ARM | 40 | 10 | 0 | 5 | 1 | `func_00410C24` |
| `func_00463D84` | `.text.func_00463D84` | ARM | 40 | 10 | 0 | 4 | 1 | `func_00463DCC` |
| `func_00468EA4` | `.text.func_00468EA4` | ARM | 40 | 10 | 0 | 2 | 2 | `func_00468ECC` |
| `func_004AAC64` | `.text.func_004AAC64` | ARM | 40 | 10 | 2 | 1 | 1 | `func_004AAC8C` |
| `func_004B0D58` | `.text.func_004B0D58` | ARM | 40 | 10 | 2 | 2 | 1 | `func_004B0D80` |
| `func_004B2AA8` | `.text.func_004B2AA8` | ARM | 40 | 10 | 0 | 1 | 1 | `func_004B2B94` |
| `func_004B92C4` | `.text.func_004B92C4` | ARM | 40 | 10 | 0 | 5 | 1 | `func_004B92EC` |
| `func_004BF910` | `.text.func_004BF910` | ARM | 40 | 10 | 2 | 2 | 1 | `func_004BF938` |
| `func_004C7CA4` | `.text.func_004C7CA4` | ARM | 40 | 10 | 1 | 6 | 1 | `func_004C7CCC` |
| `func_004C7CCC` | `.text.func_004C7CCC` | ARM | 40 | 10 | 1 | 6 | 1 | `func_004C7CF4` |
| `func_0010CAA8` | `.text.func_0010CAA8` | ARM | 36 | 9 | 0 | 7 | 1 | `func_0010CACC` |
| `func_00112A88` | `.text.func_00112A88` | ARM | 36 | 9 | 0 | 5 | 1 | `func_00112AAC` |
| `func_00112B2C` | `.text.func_00112B2C` | ARM | 36 | 9 | 0 | 4 | 1 | `func_00112B50` |
| `func_001361B0` | `.text.func_001361B0` | ARM | 36 | 9 | 0 | 6 | 1 | `func_001361D4` |
| `func_001D00C0` | `.text.func_001D00C0` | ARM | 36 | 9 | 0 | 6 | 1 | `func_001D00E4` |
| `func_002B45C0` | `.text.func_002B45C0` | ARM | 36 | 9 | 0 | 7 | 1 | `func_002B45E4` |
| `func_002B7364` | `.text.func_002B7364` | ARM | 36 | 9 | 0 | 6 | 1 | `func_002B7388` |
| `func_002C3340` | `.text.func_002C3340` | ARM | 36 | 9 | 0 | 3 | 1 | `func_002C3364` |
| `func_00331270` | `.text.func_00331270` | ARM | 36 | 9 | 1 | 5 | 1 | `func_00331294` |

Memory-operation counts include scalar loads/stores, VFP transfers, and stack
transfers. Return transfers are excluded from the local-branch column. The
per-function counts total 12 direct function-local B-family sites, all
conditional, 26 separately validated return transfers, and 111 memory
operations. There are no unconditional local branches.

The canonical direct-branch schedule SHA-256 is
`426fc95a7c8a686e90a0da151810b4ca0761cc00b6ade103ba3d1bd94ed9e4cc`.
The canonical return-transfer schedule SHA-256 is
`d241e99743a2d87a3f9f3cac8461a62fedfa8f075c7fc0fdb2363e6d45750a31`.
Both digests were independently reproduced from the bounded current target
sections and from the assembled exact-schedule probe. Canonical entries use
`name:offset:mnemonic:target` for direct branches and
`name:offset:mnemonic:operands` for returns, joined by newlines without a
terminal newline.

The “next global” column is a boundary cross-check from the neutral symbol
inventory; it does not assert that the next global is address-contiguous. Each
owned section ends exactly at its stated body size. Intervening unowned bytes,
where present, are outside this batch, and every function has a zero-byte
adjacent-data schedule.

## Uniqueness, collision, and reference audit

The twenty-four exported names are pairwise distinct and absent from every
pre-existing config string field. A recursive audit of all current JSON configs
covered function owners, branch destinations, direct-transfer symbols, identity
class members, aliases, next-global annotations, and secondary-entry relations;
none names a selected function. All selected report entries remain below 100
percent, so none is already source-owned by the current build. Symbol intervals
are pairwise disjoint. The complete target section inventory contains exactly
one byte-identical body for each selected body, eliminating duplicate-family
collisions.

## Exact schedules

The following is the complete independently assembled artifact. Local labels may
be renamed consistently. Preserve every mnemonic, operand, condition, memory
mode, instruction order, section name, mode, alignment, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0019CC14,"ax",%progbits
.balign 4
.global func_0019CC14
.type func_0019CC14, %function
func_0019CC14:
.Lfunc_0019CC14_0:
	push	{r4, r5, lr}
.Lfunc_0019CC14_4:
	subs	r2, r2, #1
.Lfunc_0019CC14_8:
	poplt	{r4, r5, pc}
.Lfunc_0019CC14_c:
	ldr	lr, [r1], #4
.Lfunc_0019CC14_10:
	umull	r4, r5, lr, lr
.Lfunc_0019CC14_14:
	subs	r2, r2, #1
.Lfunc_0019CC14_18:
	str	r4, [r0], #4
.Lfunc_0019CC14_1c:
	str	r5, [r0], #4
.Lfunc_0019CC14_20:
	bge	.Lfunc_0019CC14_c
.Lfunc_0019CC14_24:
	pop	{r4, r5, pc}
.size func_0019CC14, .-func_0019CC14

.section .text.func_001C26E0,"ax",%progbits
.balign 4
.global func_001C26E0
.type func_001C26E0, %function
func_001C26E0:
.Lfunc_001C26E0_0:
	ldrb	r2, [r0, #38]
.Lfunc_001C26E0_4:
	tst	r2, #4
.Lfunc_001C26E0_8:
	bne	.Lfunc_001C26E0_20
.Lfunc_001C26E0_c:
	ldr	r3, [r0]
.Lfunc_001C26E0_10:
	orr	r2, r2, #4
.Lfunc_001C26E0_14:
	strb	r2, [r0, #38]
.Lfunc_001C26E0_18:
	add	r3, r3, #1
.Lfunc_001C26E0_1c:
	str	r3, [r0]
.Lfunc_001C26E0_20:
	strb	r1, [r0, #39]
.Lfunc_001C26E0_24:
	bx	lr
.size func_001C26E0, .-func_001C26E0

.section .text.func_002B64C8,"ax",%progbits
.balign 4
.global func_002B64C8
.type func_002B64C8, %function
func_002B64C8:
.Lfunc_002B64C8_0:
	mov	r2, #0
.Lfunc_002B64C8_4:
	add	r1, r0, #4
.Lfunc_002B64C8_8:
	str	r2, [r0]
.Lfunc_002B64C8_c:
	str	r1, [r0, #4]
.Lfunc_002B64C8_10:
	str	r2, [r0, #12]
.Lfunc_002B64C8_14:
	str	r1, [r0, #8]
.Lfunc_002B64C8_18:
	str	r2, [r0, #16]
.Lfunc_002B64C8_1c:
	str	r2, [r0, #20]
.Lfunc_002B64C8_20:
	str	r2, [r0, #24]
.Lfunc_002B64C8_24:
	bx	lr
.size func_002B64C8, .-func_002B64C8

.section .text.func_0038CD2C,"ax",%progbits
.balign 4
.global func_0038CD2C
.type func_0038CD2C, %function
func_0038CD2C:
.Lfunc_0038CD2C_0:
	cmp	r1, #0
.Lfunc_0038CD2C_4:
	ldrshge	r3, [r0, #32]
.Lfunc_0038CD2C_8:
	cmpge	r3, r1
.Lfunc_0038CD2C_c:
	ble	.Lfunc_0038CD2C_24
.Lfunc_0038CD2C_10:
	ldr	r0, [r0, #48]
.Lfunc_0038CD2C_14:
	add	r1, r1, r1, lsl #1
.Lfunc_0038CD2C_18:
	mov	r3, #4
.Lfunc_0038CD2C_1c:
	add	r1, r3, r1, lsl #2
.Lfunc_0038CD2C_20:
	str	r2, [r0, r1]
.Lfunc_0038CD2C_24:
	bx	lr
.size func_0038CD2C, .-func_0038CD2C

.section .text.func_003C531C,"ax",%progbits
.balign 4
.global func_003C531C
.type func_003C531C, %function
func_003C531C:
.Lfunc_003C531C_0:
	ldr	r2, [r1]
.Lfunc_003C531C_4:
	mov	r3, #0
.Lfunc_003C531C_8:
	str	r2, [r0]
.Lfunc_003C531C_c:
	ldr	r1, [r1, #4]
.Lfunc_003C531C_10:
	add	r2, r0, #12
.Lfunc_003C531C_14:
	str	r1, [r0, #4]
.Lfunc_003C531C_18:
	str	r2, [r0, #12]
.Lfunc_003C531C_1c:
	str	r3, [r0, #8]
.Lfunc_003C531C_20:
	str	r2, [r0, #16]
.Lfunc_003C531C_24:
	bx	lr
.size func_003C531C, .-func_003C531C

.section .text.func_00410BFC,"ax",%progbits
.balign 4
.global func_00410BFC
.type func_00410BFC, %function
func_00410BFC:
.Lfunc_00410BFC_0:
	push	{r4}
.Lfunc_00410BFC_4:
	ldrb	r3, [r0, #15]
.Lfunc_00410BFC_8:
	mov	ip, #1
.Lfunc_00410BFC_c:
	add	r4, r0, r1, lsl #2
.Lfunc_00410BFC_10:
	bic	r1, r3, ip, lsl r1
.Lfunc_00410BFC_14:
	mov	r2, #0
.Lfunc_00410BFC_18:
	strb	r1, [r0, #15]
.Lfunc_00410BFC_1c:
	str	r2, [r4, #16]
.Lfunc_00410BFC_20:
	pop	{r4}
.Lfunc_00410BFC_24:
	bx	lr
.size func_00410BFC, .-func_00410BFC

.section .text.func_00463D84,"ax",%progbits
.balign 4
.global func_00463D84
.type func_00463D84, %function
func_00463D84:
.Lfunc_00463D84_0:
	vldmia	r2, {s0-s7}
.Lfunc_00463D84_4:
	add	r1, r1, r1, lsl #2
.Lfunc_00463D84_8:
	add	r2, r2, #32
.Lfunc_00463D84_c:
	add	r0, r0, r1, lsl #3
.Lfunc_00463D84_10:
	add	r0, r0, #72
.Lfunc_00463D84_14:
	vstmia	r0, {s0-s7}
.Lfunc_00463D84_18:
	add	r0, r0, #32
.Lfunc_00463D84_1c:
	ldm	r2, {r1, r2}
.Lfunc_00463D84_20:
	stm	r0, {r1, r2}
.Lfunc_00463D84_24:
	bx	lr
.size func_00463D84, .-func_00463D84

.section .text.func_00468EA4,"ax",%progbits
.balign 4
.global func_00468EA4
.type func_00468EA4, %function
func_00468EA4:
.Lfunc_00468EA4_0:
	cmp	r0, #1
.Lfunc_00468EA4_4:
	moveq	r0, #212
.Lfunc_00468EA4_8:
	bxeq	lr
.Lfunc_00468EA4_c:
	mov	r2, #0
.Lfunc_00468EA4_10:
	mov	r1, r2
.Lfunc_00468EA4_14:
	mov	r0, r2
.Lfunc_00468EA4_18:
	push	{r4, lr}
.Lfunc_00468EA4_1c:
	mov	r0, r0
.Lfunc_00468EA4_20:
	mov	r0, #0
.Lfunc_00468EA4_24:
	pop	{r4, pc}
.size func_00468EA4, .-func_00468EA4

.section .text.func_004AAC64,"ax",%progbits
.balign 4
.global func_004AAC64
.type func_004AAC64, %function
func_004AAC64:
.Lfunc_004AAC64_0:
	ldr	r0, [r0, #12]
.Lfunc_004AAC64_4:
	mov	r1, #8
.Lfunc_004AAC64_8:
	bics	r1, r1, r0
.Lfunc_004AAC64_c:
	bne	.Lfunc_004AAC64_20
.Lfunc_004AAC64_10:
	mov	r1, #4
.Lfunc_004AAC64_14:
	bics	r0, r1, r0
.Lfunc_004AAC64_18:
	movne	r0, #0
.Lfunc_004AAC64_1c:
	bne	.Lfunc_004AAC64_24
.Lfunc_004AAC64_20:
	mov	r0, #1
.Lfunc_004AAC64_24:
	bx	lr
.size func_004AAC64, .-func_004AAC64

.section .text.func_004B0D58,"ax",%progbits
.balign 4
.global func_004B0D58
.type func_004B0D58, %function
func_004B0D58:
.Lfunc_004B0D58_0:
	ldr	r0, [r0, #64]
.Lfunc_004B0D58_4:
	ldrh	r0, [r0, #20]
.Lfunc_004B0D58_8:
	cmp	r0, #16
.Lfunc_004B0D58_c:
	cmpne	r0, #64
.Lfunc_004B0D58_10:
	beq	.Lfunc_004B0D58_20
.Lfunc_004B0D58_14:
	cmp	r0, #128
.Lfunc_004B0D58_18:
	movne	r0, #0
.Lfunc_004B0D58_1c:
	bne	.Lfunc_004B0D58_24
.Lfunc_004B0D58_20:
	mov	r0, #1
.Lfunc_004B0D58_24:
	bx	lr
.size func_004B0D58, .-func_004B0D58

.section .text.func_004B2AA8,"ax",%progbits
.balign 4
.global func_004B2AA8
.type func_004B2AA8, %function
func_004B2AA8:
.Lfunc_004B2AA8_0:
	ldr	r0, [r0]
.Lfunc_004B2AA8_4:
	lsl	r1, r0, #16
.Lfunc_004B2AA8_8:
	lsl	r2, r0, #24
.Lfunc_004B2AA8_c:
	lsr	r1, r1, #24
.Lfunc_004B2AA8_10:
	orr	r2, r2, r1, lsl #16
.Lfunc_004B2AA8_14:
	lsl	r1, r0, #8
.Lfunc_004B2AA8_18:
	lsr	r1, r1, #24
.Lfunc_004B2AA8_1c:
	orr	r1, r2, r1, lsl #8
.Lfunc_004B2AA8_20:
	orr	r0, r1, r0, lsr #24
.Lfunc_004B2AA8_24:
	bx	lr
.size func_004B2AA8, .-func_004B2AA8

.section .text.func_004B92C4,"ax",%progbits
.balign 4
.global func_004B92C4
.type func_004B92C4, %function
func_004B92C4:
.Lfunc_004B92C4_0:
	ldr	r1, [r1]
.Lfunc_004B92C4_4:
	ldr	r2, [r1, #4]!
.Lfunc_004B92C4_8:
	cmp	r2, #0
.Lfunc_004B92C4_c:
	addne	r1, r1, r2
.Lfunc_004B92C4_10:
	moveq	r1, #0
.Lfunc_004B92C4_14:
	ldr	r2, [r1, #72]
.Lfunc_004B92C4_18:
	add	r1, r1, #16
.Lfunc_004B92C4_1c:
	str	r1, [r0, #4]
.Lfunc_004B92C4_20:
	str	r2, [r0]
.Lfunc_004B92C4_24:
	bx	lr
.size func_004B92C4, .-func_004B92C4

.section .text.func_004BF910,"ax",%progbits
.balign 4
.global func_004BF910
.type func_004BF910, %function
func_004BF910:
.Lfunc_004BF910_0:
	ldr	r1, [r0, #28]
.Lfunc_004BF910_4:
	cmn	r1, #1
.Lfunc_004BF910_8:
	beq	.Lfunc_004BF910_20
.Lfunc_004BF910_c:
	ldrh	r2, [r0, #24]
.Lfunc_004BF910_10:
	sub	r3, r2, #8192
.Lfunc_004BF910_14:
	subs	r3, r3, #528
.Lfunc_004BF910_18:
	addeq	r0, r0, r1
.Lfunc_004BF910_1c:
	beq	.Lfunc_004BF910_24
.Lfunc_004BF910_20:
	mov	r0, #0
.Lfunc_004BF910_24:
	bx	lr
.size func_004BF910, .-func_004BF910

.section .text.func_004C7CA4,"ax",%progbits
.balign 4
.global func_004C7CA4
.type func_004C7CA4, %function
func_004C7CA4:
.Lfunc_004C7CA4_0:
	ldrb	r1, [r0, #28]
.Lfunc_004C7CA4_4:
	cmp	r1, #0
.Lfunc_004C7CA4_8:
	ldreq	r0, [r0, #52]
.Lfunc_004C7CA4_c:
	beq	.Lfunc_004C7CA4_20
.Lfunc_004C7CA4_10:
	ldrb	r1, [r0, #29]
.Lfunc_004C7CA4_14:
	cmp	r1, #0
.Lfunc_004C7CA4_18:
	ldreq	r0, [r0, #68]
.Lfunc_004C7CA4_1c:
	ldrne	r0, [r0, #48]
.Lfunc_004C7CA4_20:
	vldr	s0, [r0]
.Lfunc_004C7CA4_24:
	bx	lr
.size func_004C7CA4, .-func_004C7CA4

.section .text.func_004C7CCC,"ax",%progbits
.balign 4
.global func_004C7CCC
.type func_004C7CCC, %function
func_004C7CCC:
.Lfunc_004C7CCC_0:
	ldrb	r1, [r0, #28]
.Lfunc_004C7CCC_4:
	cmp	r1, #0
.Lfunc_004C7CCC_8:
	ldreq	r0, [r0, #52]
.Lfunc_004C7CCC_c:
	beq	.Lfunc_004C7CCC_20
.Lfunc_004C7CCC_10:
	ldrb	r1, [r0, #29]
.Lfunc_004C7CCC_14:
	cmp	r1, #0
.Lfunc_004C7CCC_18:
	ldreq	r0, [r0, #68]
.Lfunc_004C7CCC_1c:
	ldrne	r0, [r0, #48]
.Lfunc_004C7CCC_20:
	vldr	s0, [r0, #4]
.Lfunc_004C7CCC_24:
	bx	lr
.size func_004C7CCC, .-func_004C7CCC

.section .text.func_0010CAA8,"ax",%progbits
.balign 4
.global func_0010CAA8
.type func_0010CAA8, %function
func_0010CAA8:
.Lfunc_0010CAA8_0:
	vldmia	sp, {s0-s1}
.Lfunc_0010CAA8_4:
	vstr	s1, [r0, #40]
.Lfunc_0010CAA8_8:
	str	r1, [r0, #72]
.Lfunc_0010CAA8_c:
	str	r2, [r0, #32]
.Lfunc_0010CAA8_10:
	vstr	s0, [r0, #44]
.Lfunc_0010CAA8_14:
	str	r3, [r0, #52]
.Lfunc_0010CAA8_18:
	add	r0, r0, #12
.Lfunc_0010CAA8_1c:
	str	r0, [r2, #3336]
.Lfunc_0010CAA8_20:
	bx	lr
.size func_0010CAA8, .-func_0010CAA8

.section .text.func_00112A88,"ax",%progbits
.balign 4
.global func_00112A88
.type func_00112A88, %function
func_00112A88:
.Lfunc_00112A88_0:
	str	r1, [r0]
.Lfunc_00112A88_4:
	ldr	ip, [r1, #40]!
.Lfunc_00112A88_8:
	add	r1, r1, #248
.Lfunc_00112A88_c:
	str	r1, [r0, #8]
.Lfunc_00112A88_10:
	mvn	r2, #0
.Lfunc_00112A88_14:
	mov	r3, #0
.Lfunc_00112A88_18:
	str	ip, [r0, #4]
.Lfunc_00112A88_1c:
	strd	r2, [r0, #12]
.Lfunc_00112A88_20:
	bx	lr
.size func_00112A88, .-func_00112A88

.section .text.func_00112B2C,"ax",%progbits
.balign 4
.global func_00112B2C
.type func_00112B2C, %function
func_00112B2C:
.Lfunc_00112B2C_0:
	push	{r4, r5}
.Lfunc_00112B2C_4:
	mov	r5, #255
.Lfunc_00112B2C_8:
	stm	r0, {r1, r2, r3, r5}
.Lfunc_00112B2C_c:
	mov	r4, #30
.Lfunc_00112B2C_10:
	add	r5, r0, #16
.Lfunc_00112B2C_14:
	mov	ip, #0
.Lfunc_00112B2C_18:
	stm	r5, {r4, ip}
.Lfunc_00112B2C_1c:
	pop	{r4, r5}
.Lfunc_00112B2C_20:
	bx	lr
.size func_00112B2C, .-func_00112B2C

.section .text.func_001361B0,"ax",%progbits
.balign 4
.global func_001361B0
.type func_001361B0, %function
func_001361B0:
.Lfunc_001361B0_0:
	ldr	r2, [r0, #368]
.Lfunc_001361B0_4:
	cmp	r2, #0
.Lfunc_001361B0_8:
	streq	r1, [r0, #364]
.Lfunc_001361B0_c:
	strne	r1, [r2]
.Lfunc_001361B0_10:
	mov	r2, #0
.Lfunc_001361B0_14:
	str	r1, [r0, #368]
.Lfunc_001361B0_18:
	str	r2, [r1]
.Lfunc_001361B0_1c:
	ldr	r0, [r0, #372]
.Lfunc_001361B0_20:
	bx	lr
.size func_001361B0, .-func_001361B0

.section .text.func_001D00C0,"ax",%progbits
.balign 4
.global func_001D00C0
.type func_001D00C0, %function
func_001D00C0:
.Lfunc_001D00C0_0:
	push	{r4, r5}
.Lfunc_001D00C0_4:
	cmp	r0, #0
.Lfunc_001D00C0_8:
	ldr	ip, [sp, #8]
.Lfunc_001D00C0_c:
	ldrd	r4, [sp, #12]
.Lfunc_001D00C0_10:
	stmne	r0, {r1, r2, r3, ip}
.Lfunc_001D00C0_14:
	strdne	r4, [r0, #16]
.Lfunc_001D00C0_18:
	pop	{r4, r5}
.Lfunc_001D00C0_1c:
	mov	r0, r1
.Lfunc_001D00C0_20:
	bx	lr
.size func_001D00C0, .-func_001D00C0

.section .text.func_002B45C0,"ax",%progbits
.balign 4
.global func_002B45C0
.type func_002B45C0, %function
func_002B45C0:
.Lfunc_002B45C0_0:
	mov	r1, #0
.Lfunc_002B45C0_4:
	str	r1, [r0, #8]
.Lfunc_002B45C0_8:
	str	r0, [r0]
.Lfunc_002B45C0_c:
	str	r1, [r0, #12]
.Lfunc_002B45C0_10:
	str	r1, [r0, #16]
.Lfunc_002B45C0_14:
	str	r1, [r0, #20]
.Lfunc_002B45C0_18:
	str	r1, [r0, #24]
.Lfunc_002B45C0_1c:
	str	r0, [r0, #4]
.Lfunc_002B45C0_20:
	bx	lr
.size func_002B45C0, .-func_002B45C0

.section .text.func_002B7364,"ax",%progbits
.balign 4
.global func_002B7364
.type func_002B7364, %function
func_002B7364:
.Lfunc_002B7364_0:
	mov	r2, #0
.Lfunc_002B7364_4:
	add	r1, r0, #4
.Lfunc_002B7364_8:
	str	r2, [r0]
.Lfunc_002B7364_c:
	str	r1, [r0, #4]
.Lfunc_002B7364_10:
	str	r2, [r0, #12]
.Lfunc_002B7364_14:
	str	r1, [r0, #8]
.Lfunc_002B7364_18:
	str	r2, [r0, #16]
.Lfunc_002B7364_1c:
	str	r2, [r0, #20]
.Lfunc_002B7364_20:
	bx	lr
.size func_002B7364, .-func_002B7364

.section .text.func_002C3340,"ax",%progbits
.balign 4
.global func_002C3340
.type func_002C3340, %function
func_002C3340:
.Lfunc_002C3340_0:
	ldr	r0, [r0, #104]
.Lfunc_002C3340_4:
	mov	r0, r0
.Lfunc_002C3340_8:
	mov	r2, #12
.Lfunc_002C3340_c:
	and	r1, r2, r1, lsl #2
.Lfunc_002C3340_10:
	ldrh	r2, [r0, #30]
.Lfunc_002C3340_14:
	bic	r2, r2, #12
.Lfunc_002C3340_18:
	orr	r1, r1, r2
.Lfunc_002C3340_1c:
	strh	r1, [r0, #30]
.Lfunc_002C3340_20:
	bx	lr
.size func_002C3340, .-func_002C3340

.section .text.func_00331270,"ax",%progbits
.balign 4
.global func_00331270
.type func_00331270, %function
func_00331270:
.Lfunc_00331270_0:
	ldrb	r1, [r0, #12]
.Lfunc_00331270_4:
	cmp	r1, #0
.Lfunc_00331270_8:
	beq	.Lfunc_00331270_20
.Lfunc_00331270_c:
	mov	r1, #0
.Lfunc_00331270_10:
	str	r1, [r0]
.Lfunc_00331270_14:
	str	r1, [r0, #4]
.Lfunc_00331270_18:
	str	r1, [r0, #8]
.Lfunc_00331270_1c:
	strb	r1, [r0, #12]
.Lfunc_00331270_20:
	bx	lr
.size func_00331270, .-func_00331270
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_80.S` without access
to the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation exports exactly the twenty-four named functions in their
owned executable sections, produces no relocations or adjacent data, and
matches the sizes and schedules above. Its source SHA-256 is recorded above
and in the neutral config.
