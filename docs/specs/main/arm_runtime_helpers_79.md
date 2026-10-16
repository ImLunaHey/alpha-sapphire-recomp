# Probe-verified ARM runtime/helper batch 79

Source SHA-256: `36da84c448f66ef47862770d1c3d09a255df6e09d5c1e4293bb65c26c1018da5`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 1,056 executable body bytes (264
instructions). Evidence was limited to the current unmatched report, the neutral
symbol inventory, bounded private-target control/data-flow inspection, and an
independently assembled exact-schedule probe. Selection excluded every function
name occurring anywhere in any current config, including the pending runtime 78,
duplicate-template 75, and IPC 72 batches.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the complete
current target section inventory, so no member belongs to an exact-duplicate
family. The authoritative report has an unmatched entry below 100 percent for
every selected name and accounts for exactly 1,056 selected bytes. Private inspection
artifacts used for selection are ignored and are not part of this specification.
Independent ARMv6K assembly comparison against target revision `AS_EUR_REV2`
on 2026-10-16 matched all twenty-four complete bodies (1,056 bytes / 264
instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0045BAC8` | `.text.func_0045BAC8` | ARM | 48 | 12 | 0 | 9 | 1 | `func_0045BBB4` |
| `func_004ACF48` | `.text.func_004ACF48` | ARM | 48 | 12 | 2 | 4 | 2 | `func_004ACF78` |
| `func_004C403C` | `.text.func_004C403C` | ARM | 48 | 12 | 0 | 1 | 1 | `func_004C4140` |
| `func_0010F904` | `.text.func_0010F904` | ARM | 44 | 11 | 2 | 4 | 1 | `func_0010F930` |
| `func_00111B70` | `.text.func_00111B70` | ARM | 44 | 11 | 1 | 5 | 1 | `func_00111B9C` |
| `func_0011D990` | `.text.func_0011D990` | ARM | 44 | 11 | 1 | 5 | 1 | `func_0011D9BC` |
| `func_001499E8` | `.text.func_001499E8` | ARM | 44 | 11 | 0 | 4 | 1 | `func_00149A14` |
| `func_00163D90` | `.text.func_00163D90` | ARM | 44 | 11 | 1 | 6 | 2 | `func_00163DBC` |
| `func_00174D70` | `.text.func_00174D70` | ARM | 44 | 11 | 1 | 2 | 1 | `func_00174D9C` |
| `func_001772C8` | `.text.func_001772C8` | ARM | 44 | 11 | 1 | 3 | 1 | `func_00177300` |
| `func_00182344` | `.text.func_00182344` | ARM | 44 | 11 | 1 | 3 | 1 | `func_00182370` |
| `func_00198D18` | `.text.func_00198D18` | ARM | 44 | 11 | 0 | 7 | 1 | `func_0019B290` |
| `func_001C1D5C` | `.text.func_001C1D5C` | ARM | 44 | 11 | 1 | 7 | 1 | `func_001C21FC` |
| `func_001F1448` | `.text.func_001F1448` | ARM | 44 | 11 | 0 | 9 | 1 | `func_001F1474` |
| `func_001F9DD8` | `.text.func_001F9DD8` | ARM | 44 | 11 | 0 | 0 | 1 | `func_001F9E04` |
| `func_00268BA4` | `.text.func_00268BA4` | ARM | 44 | 11 | 1 | 4 | 1 | `func_00268BD0` |
| `func_002CD8B4` | `.text.func_002CD8B4` | ARM | 44 | 11 | 1 | 4 | 1 | `func_002CD8E0` |
| `func_00389D60` | `.text.func_00389D60` | ARM | 44 | 11 | 0 | 6 | 1 | `func_00389EE8` |
| `func_003ADB24` | `.text.func_003ADB24` | ARM | 44 | 11 | 3 | 3 | 1 | `func_003AE5F4` |
| `func_00402984` | `.text.func_00402984` | ARM | 44 | 11 | 0 | 6 | 1 | `func_004029DC` |
| `func_00410E24` | `.text.func_00410E24` | ARM | 44 | 11 | 0 | 8 | 1 | `func_00410E50` |
| `func_001175E4` | `.text.func_001175E4` | ARM | 40 | 10 | 1 | 4 | 1 | `func_0011760C` |
| `func_0011DB3C` | `.text.func_0011DB3C` | ARM | 40 | 10 | 1 | 2 | 1 | `func_0011DD2C` |
| `func_0014E024` | `.text.func_0014E024` | ARM | 40 | 10 | 2 | 2 | 1 | `func_0014E054` |

Memory-operation counts include scalar loads/stores, VFP transfers, and stack
transfers. Return transfers are excluded from the local-branch column. The
per-function counts total 20 direct function-local B-family sites, all
conditional, 26 separately validated return transfers, and 108 memory
operations. There are no unconditional local branches.

The canonical direct-branch schedule SHA-256 is
`50928f1f1c662c3ce4a89c9daf21e16129698e7231121d170cbdbd23839baaac`.
The canonical return-transfer schedule SHA-256 is
`6a6fbfaf9cbb53c16ab228320c9abc8b079c9730bd214f8312860bba0bf52d51`.
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

## Exact schedules

The following is the complete independently assembled artifact. Local labels may
be renamed consistently. Preserve every mnemonic, operand, condition, memory
mode, instruction order, section name, mode, alignment, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0045BAC8,"ax",%progbits
.balign 4
.global func_0045BAC8
.type func_0045BAC8, %function
func_0045BAC8:
.Lfunc_0045BAC8_0:
	mov	r1, #0
.Lfunc_0045BAC8_4:
	mvn	r2, #0
.Lfunc_0045BAC8_8:
	str	r1, [r0, #8]
.Lfunc_0045BAC8_c:
	str	r2, [r0, #4]
.Lfunc_0045BAC8_10:
	str	r1, [r0, #12]
.Lfunc_0045BAC8_14:
	str	r1, [r0, #16]
.Lfunc_0045BAC8_18:
	str	r1, [r0, #20]
.Lfunc_0045BAC8_1c:
	str	r1, [r0, #24]
.Lfunc_0045BAC8_20:
	str	r1, [r0, #28]
.Lfunc_0045BAC8_24:
	str	r1, [r0, #32]
.Lfunc_0045BAC8_28:
	str	r1, [r0, #36]
.Lfunc_0045BAC8_2c:
	bx	lr
.size func_0045BAC8, .-func_0045BAC8

.section .text.func_004ACF48,"ax",%progbits
.balign 4
.global func_004ACF48
.type func_004ACF48, %function
func_004ACF48:
.Lfunc_004ACF48_0:
	ldr	r1, [r0, #20]
.Lfunc_004ACF48_4:
	ldr	r0, [r1]
.Lfunc_004ACF48_8:
	cmp	r0, r1
.Lfunc_004ACF48_c:
	beq	.Lfunc_004ACF48_28
.Lfunc_004ACF48_10:
	ldrb	r2, [r0, #156]
.Lfunc_004ACF48_14:
	cmp	r2, #0
.Lfunc_004ACF48_18:
	ldreq	r0, [r0]
.Lfunc_004ACF48_1c:
	beq	.Lfunc_004ACF48_8
.Lfunc_004ACF48_20:
	mov	r0, #1
.Lfunc_004ACF48_24:
	bx	lr
.Lfunc_004ACF48_28:
	mov	r0, #0
.Lfunc_004ACF48_2c:
	bx	lr
.size func_004ACF48, .-func_004ACF48

.section .text.func_004C403C,"ax",%progbits
.balign 4
.global func_004C403C
.type func_004C403C, %function
func_004C403C:
.Lfunc_004C403C_0:
	cmp	r1, #16
.Lfunc_004C403C_4:
	ldr	r0, [r0, #1664]
.Lfunc_004C403C_8:
	lslhi	r1, r1, #1
.Lfunc_004C403C_c:
	subhi	r1, r1, #32
.Lfunc_004C403C_10:
	movls	r1, #0
.Lfunc_004C403C_14:
	add	r0, r0, r1
.Lfunc_004C403C_18:
	lsl	r0, r0, #20
.Lfunc_004C403C_1c:
	lsr	r0, r0, #20
.Lfunc_004C403C_20:
	cmp	r0, #4064
.Lfunc_004C403C_24:
	movcs	r0, #32
.Lfunc_004C403C_28:
	movcc	r0, #0
.Lfunc_004C403C_2c:
	bx	lr
.size func_004C403C, .-func_004C403C

.section .text.func_0010F904,"ax",%progbits
.balign 4
.global func_0010F904
.type func_0010F904, %function
func_0010F904:
.Lfunc_0010F904_0:
	ldr	r2, [r0, #12]
.Lfunc_0010F904_4:
	cmp	r2, #0
.Lfunc_0010F904_8:
	ldrne	r3, [r0, #16]
.Lfunc_0010F904_c:
	cmpne	r3, #0
.Lfunc_0010F904_10:
	beq	.Lfunc_0010F904_24
.Lfunc_0010F904_14:
	ldrh	r0, [r0, #4]
.Lfunc_0010F904_18:
	cmp	r0, r1
.Lfunc_0010F904_1c:
	ldrhi	r0, [r2, r1, lsl #2]
.Lfunc_0010F904_20:
	bhi	.Lfunc_0010F904_28
.Lfunc_0010F904_24:
	mvn	r0, #0
.Lfunc_0010F904_28:
	bx	lr
.size func_0010F904, .-func_0010F904

.section .text.func_00111B70,"ax",%progbits
.balign 4
.global func_00111B70
.type func_00111B70, %function
func_00111B70:
.Lfunc_00111B70_0:
	ldr	r0, [r0, #4]
.Lfunc_00111B70_4:
	ldr	r2, [r0, #172]
.Lfunc_00111B70_8:
	cmp	r2, r1
.Lfunc_00111B70_c:
	bls	.Lfunc_00111B70_28
.Lfunc_00111B70_10:
	ldr	r0, [r0, #168]
.Lfunc_00111B70_14:
	add	r2, r1, r1, lsl #1
.Lfunc_00111B70_18:
	add	r1, r2, r1, lsl #3
.Lfunc_00111B70_1c:
	ldrb	r1, [r0, r1, lsl #2]!
.Lfunc_00111B70_20:
	cmp	r1, #0
.Lfunc_00111B70_24:
	vstrne	s0, [r0, #28]
.Lfunc_00111B70_28:
	bx	lr
.size func_00111B70, .-func_00111B70

.section .text.func_0011D990,"ax",%progbits
.balign 4
.global func_0011D990
.type func_0011D990, %function
func_0011D990:
.Lfunc_0011D990_0:
	ldr	r0, [r0, #4]
.Lfunc_0011D990_4:
	ldr	r3, [r0, #172]
.Lfunc_0011D990_8:
	cmp	r3, r1
.Lfunc_0011D990_c:
	bls	.Lfunc_0011D990_28
.Lfunc_0011D990_10:
	ldr	r0, [r0, #168]
.Lfunc_0011D990_14:
	add	r3, r1, r1, lsl #1
.Lfunc_0011D990_18:
	add	r1, r3, r1, lsl #3
.Lfunc_0011D990_1c:
	ldrb	r1, [r0, r1, lsl #2]!
.Lfunc_0011D990_20:
	cmp	r1, #0
.Lfunc_0011D990_24:
	strbne	r2, [r0, #1]
.Lfunc_0011D990_28:
	bx	lr
.size func_0011D990, .-func_0011D990

.section .text.func_001499E8,"ax",%progbits
.balign 4
.global func_001499E8
.type func_001499E8, %function
func_001499E8:
.Lfunc_001499E8_0:
	add	ip, r1, #3
.Lfunc_001499E8_4:
	bic	ip, ip, #3
.Lfunc_001499E8_8:
	add	r1, r1, r2
.Lfunc_001499E8_c:
	str	ip, [r0]
.Lfunc_001499E8_10:
	mov	r2, #0
.Lfunc_001499E8_14:
	strb	r3, [r0, #12]
.Lfunc_001499E8_18:
	sub	r1, r1, ip
.Lfunc_001499E8_1c:
	str	r2, [r0, #4]!
.Lfunc_001499E8_20:
	bic	r1, r1, #7
.Lfunc_001499E8_24:
	str	r1, [r0, #4]
.Lfunc_001499E8_28:
	bx	lr
.size func_001499E8, .-func_001499E8

.section .text.func_00163D90,"ax",%progbits
.balign 4
.global func_00163D90
.type func_00163D90, %function
func_00163D90:
.Lfunc_00163D90_0:
	ldr	r1, [r0, #28]
.Lfunc_00163D90_4:
	ldr	r2, [r0, #12]
.Lfunc_00163D90_8:
	cmp	r1, #0
.Lfunc_00163D90_c:
	beq	.Lfunc_00163D90_20
.Lfunc_00163D90_10:
	add	r1, r1, r2
.Lfunc_00163D90_14:
	str	r1, [r0, #20]
.Lfunc_00163D90_18:
	str	r1, [r0, #16]
.Lfunc_00163D90_1c:
	bx	lr
.Lfunc_00163D90_20:
	str	r2, [r0, #20]
.Lfunc_00163D90_24:
	str	r2, [r0, #16]
.Lfunc_00163D90_28:
	bx	lr
.size func_00163D90, .-func_00163D90

.section .text.func_00174D70,"ax",%progbits
.balign 4
.global func_00174D70
.type func_00174D70, %function
func_00174D70:
.Lfunc_00174D70_0:
	add	r2, r2, r1
.Lfunc_00174D70_4:
	add	r1, r1, #31
.Lfunc_00174D70_8:
	bic	r1, r1, #31
.Lfunc_00174D70_c:
	cmp	r1, r2
.Lfunc_00174D70_10:
	movhi	r0, #0
.Lfunc_00174D70_14:
	bhi	.Lfunc_00174D70_28
.Lfunc_00174D70_18:
	add	r3, r0, #12
.Lfunc_00174D70_1c:
	stm	r3, {r1, r2}
.Lfunc_00174D70_20:
	str	r1, [r0, #20]
.Lfunc_00174D70_24:
	mov	r0, #1
.Lfunc_00174D70_28:
	bx	lr
.size func_00174D70, .-func_00174D70

.section .text.func_001772C8,"ax",%progbits
.balign 4
.global func_001772C8
.type func_001772C8, %function
func_001772C8:
.Lfunc_001772C8_0:
	cmp	r1, #6
.Lfunc_001772C8_4:
	addcc	r0, r0, r1
.Lfunc_001772C8_8:
	push	{r4, lr}
.Lfunc_001772C8_c:
	ldrbcc	r0, [r0, #10]
.Lfunc_001772C8_10:
	bcc	.Lfunc_001772C8_28
.Lfunc_001772C8_14:
	mov	r2, #0
.Lfunc_001772C8_18:
	mov	r1, r2
.Lfunc_001772C8_1c:
	mov	r0, r2
.Lfunc_001772C8_20:
	mov	r0, r0
.Lfunc_001772C8_24:
	mov	r0, #0
.Lfunc_001772C8_28:
	pop	{r4, pc}
.size func_001772C8, .-func_001772C8

.section .text.func_00182344,"ax",%progbits
.balign 4
.global func_00182344
.type func_00182344, %function
func_00182344:
.Lfunc_00182344_0:
	ldrh	r1, [r0, #20]
.Lfunc_00182344_4:
	cmp	r1, #26624
.Lfunc_00182344_8:
	addeq	r1, r0, #20
.Lfunc_00182344_c:
	beq	.Lfunc_00182344_20
.Lfunc_00182344_10:
	ldrh	r1, [r0, #32]
.Lfunc_00182344_14:
	cmp	r1, #26624
.Lfunc_00182344_18:
	addeq	r1, r0, #32
.Lfunc_00182344_1c:
	movne	r1, #0
.Lfunc_00182344_20:
	ldr	r1, [r1, #4]
.Lfunc_00182344_24:
	add	r0, r0, r1
.Lfunc_00182344_28:
	bx	lr
.size func_00182344, .-func_00182344

.section .text.func_00198D18,"ax",%progbits
.balign 4
.global func_00198D18
.type func_00198D18, %function
func_00198D18:
.Lfunc_00198D18_0:
	ldr	ip, [r0, #784]
.Lfunc_00198D18_4:
	ldr	r1, [r0, #852]
.Lfunc_00198D18_8:
	ldr	r2, [r0, #848]
.Lfunc_00198D18_c:
	ldr	r3, [r0, #844]
.Lfunc_00198D18_10:
	sub	ip, r1, ip
.Lfunc_00198D18_14:
	str	ip, [r0, #788]
.Lfunc_00198D18_18:
	lsr	r2, r2, #24
.Lfunc_00198D18_1c:
	str	r2, [r0, #796]
.Lfunc_00198D18_20:
	sub	r3, r3, #24
.Lfunc_00198D18_24:
	strb	r3, [r0, #800]
.Lfunc_00198D18_28:
	bx	lr
.size func_00198D18, .-func_00198D18

.section .text.func_001C1D5C,"ax",%progbits
.balign 4
.global func_001C1D5C
.type func_001C1D5C, %function
func_001C1D5C:
.Lfunc_001C1D5C_0:
	ldr	r2, [r0, #40]
.Lfunc_001C1D5C_4:
	cmp	r2, #0
.Lfunc_001C1D5C_8:
	str	r2, [r1, #40]
.Lfunc_001C1D5C_c:
	beq	.Lfunc_001C1D5C_1c
.Lfunc_001C1D5C_10:
	ldrb	r3, [r2, #38]
.Lfunc_001C1D5C_14:
	orr	r3, r3, #8
.Lfunc_001C1D5C_18:
	strb	r3, [r2, #38]
.Lfunc_001C1D5C_1c:
	ldr	r2, [r0, #44]
.Lfunc_001C1D5C_20:
	str	r2, [r1, #44]
.Lfunc_001C1D5C_24:
	str	r1, [r0, #44]
.Lfunc_001C1D5C_28:
	bx	lr
.size func_001C1D5C, .-func_001C1D5C

.section .text.func_001F1448,"ax",%progbits
.balign 4
.global func_001F1448
.type func_001F1448, %function
func_001F1448:
.Lfunc_001F1448_0:
	mov	r1, #0
.Lfunc_001F1448_4:
	str	r1, [r0, #4]
.Lfunc_001F1448_8:
	str	r1, [r0, #8]
.Lfunc_001F1448_c:
	str	r1, [r0, #12]
.Lfunc_001F1448_10:
	str	r1, [r0, #16]
.Lfunc_001F1448_14:
	str	r1, [r0, #20]
.Lfunc_001F1448_18:
	str	r1, [r0, #24]
.Lfunc_001F1448_1c:
	str	r1, [r0, #28]
.Lfunc_001F1448_20:
	str	r1, [r0, #32]
.Lfunc_001F1448_24:
	str	r1, [r0]
.Lfunc_001F1448_28:
	bx	lr
.size func_001F1448, .-func_001F1448

.section .text.func_001F9DD8,"ax",%progbits
.balign 4
.global func_001F9DD8
.type func_001F9DD8, %function
func_001F9DD8:
.Lfunc_001F9DD8_0:
	add	r2, r0, #4
.Lfunc_001F9DD8_4:
	tst	r2, #15
.Lfunc_001F9DD8_8:
	mov	r1, #0
.Lfunc_001F9DD8_c:
	andne	r1, r2, #15
.Lfunc_001F9DD8_10:
	rsbne	r1, r1, #16
.Lfunc_001F9DD8_14:
	add	r0, r0, r1
.Lfunc_001F9DD8_18:
	add	r0, r0, #52
.Lfunc_001F9DD8_1c:
	cmp	r0, #64
.Lfunc_001F9DD8_20:
	addcc	r0, r0, #4
.Lfunc_001F9DD8_24:
	addcs	r0, r0, #5
.Lfunc_001F9DD8_28:
	bx	lr
.size func_001F9DD8, .-func_001F9DD8

.section .text.func_00268BA4,"ax",%progbits
.balign 4
.global func_00268BA4
.type func_00268BA4, %function
func_00268BA4:
.Lfunc_00268BA4_0:
	ldrb	r1, [r0, #17]
.Lfunc_00268BA4_4:
	cmp	r1, #0
.Lfunc_00268BA4_8:
	moveq	r0, #0
.Lfunc_00268BA4_c:
	beq	.Lfunc_00268BA4_28
.Lfunc_00268BA4_10:
	ldrh	r1, [r0, #20]
.Lfunc_00268BA4_14:
	ldrh	r2, [r0, #22]
.Lfunc_00268BA4_18:
	cmp	r1, r2
.Lfunc_00268BA4_1c:
	strhne	r1, [r0, #22]
.Lfunc_00268BA4_20:
	moveq	r0, #1
.Lfunc_00268BA4_24:
	movne	r0, #0
.Lfunc_00268BA4_28:
	bx	lr
.size func_00268BA4, .-func_00268BA4

.section .text.func_002CD8B4,"ax",%progbits
.balign 4
.global func_002CD8B4
.type func_002CD8B4, %function
func_002CD8B4:
.Lfunc_002CD8B4_0:
	ldrb	r3, [r0, #4]
.Lfunc_002CD8B4_4:
	cmp	r3, #0
.Lfunc_002CD8B4_8:
	beq	.Lfunc_002CD8B4_28
.Lfunc_002CD8B4_c:
	cmp	r1, #0
.Lfunc_002CD8B4_10:
	cmpne	r2, #0
.Lfunc_002CD8B4_14:
	moveq	r1, #0
.Lfunc_002CD8B4_18:
	streq	r1, [r0, #32]
.Lfunc_002CD8B4_1c:
	streq	r1, [r0, #36]
.Lfunc_002CD8B4_20:
	addne	r0, r0, #32
.Lfunc_002CD8B4_24:
	stmne	r0, {r1, r2}
.Lfunc_002CD8B4_28:
	bx	lr
.size func_002CD8B4, .-func_002CD8B4

.section .text.func_00389D60,"ax",%progbits
.balign 4
.global func_00389D60
.type func_00389D60, %function
func_00389D60:
.Lfunc_00389D60_0:
	ldr	r0, [r0, #64]
.Lfunc_00389D60_4:
	cmp	r2, #0
.Lfunc_00389D60_8:
	ldrne	r2, [r2, #4]
.Lfunc_00389D60_c:
	moveq	r2, #0
.Lfunc_00389D60_10:
	ldr	ip, [r0, #4]
.Lfunc_00389D60_14:
	mov	r3, #1
.Lfunc_00389D60_18:
	ldr	ip, [ip, #208]
.Lfunc_00389D60_1c:
	add	r1, ip, r1, lsl #2
.Lfunc_00389D60_20:
	str	r2, [r1]
.Lfunc_00389D60_24:
	str	r3, [r0, #52]
.Lfunc_00389D60_28:
	bx	lr
.size func_00389D60, .-func_00389D60

.section .text.func_003ADB24,"ax",%progbits
.balign 4
.global func_003ADB24
.type func_003ADB24, %function
func_003ADB24:
.Lfunc_003ADB24_0:
	ldr	r0, [r0, #48]
.Lfunc_003ADB24_4:
	cmp	r0, #0
.Lfunc_003ADB24_8:
	beq	.Lfunc_003ADB24_28
.Lfunc_003ADB24_c:
	cmp	r1, #2
.Lfunc_003ADB24_10:
	blt	.Lfunc_003ADB24_24
.Lfunc_003ADB24_14:
	ldr	r2, [r0]
.Lfunc_003ADB24_18:
	cmp	r2, r1
.Lfunc_003ADB24_1c:
	ldrcs	r0, [r0, r1, lsl #2]
.Lfunc_003ADB24_20:
	bcs	.Lfunc_003ADB24_28
.Lfunc_003ADB24_24:
	mov	r0, #0
.Lfunc_003ADB24_28:
	bx	lr
.size func_003ADB24, .-func_003ADB24

.section .text.func_00402984,"ax",%progbits
.balign 4
.global func_00402984
.type func_00402984, %function
func_00402984:
.Lfunc_00402984_0:
	ldrb	ip, [r0, #5]
.Lfunc_00402984_4:
	str	r1, [r0, #8]
.Lfunc_00402984_8:
	mov	r2, #0
.Lfunc_00402984_c:
	str	r2, [r0]
.Lfunc_00402984_10:
	mov	r3, #1
.Lfunc_00402984_14:
	bic	r1, ip, #3
.Lfunc_00402984_18:
	strb	r2, [r0, #4]
.Lfunc_00402984_1c:
	orr	r1, r1, #2
.Lfunc_00402984_20:
	strh	r3, [r0, #6]
.Lfunc_00402984_24:
	strb	r1, [r0, #5]
.Lfunc_00402984_28:
	bx	lr
.size func_00402984, .-func_00402984

.section .text.func_00410E24,"ax",%progbits
.balign 4
.global func_00410E24
.type func_00410E24, %function
func_00410E24:
.Lfunc_00410E24_0:
	mov	r2, #0
.Lfunc_00410E24_4:
	str	r2, [r0]
.Lfunc_00410E24_8:
	strb	r2, [r0, #4]
.Lfunc_00410E24_c:
	strb	r2, [r0, #5]
.Lfunc_00410E24_10:
	mov	ip, #32
.Lfunc_00410E24_14:
	str	r2, [r0, #16]
.Lfunc_00410E24_18:
	str	ip, [r0, #12]
.Lfunc_00410E24_1c:
	str	r2, [r0, #20]
.Lfunc_00410E24_20:
	str	r2, [r0, #24]
.Lfunc_00410E24_24:
	str	r2, [r0, #28]
.Lfunc_00410E24_28:
	bx	lr
.size func_00410E24, .-func_00410E24

.section .text.func_001175E4,"ax",%progbits
.balign 4
.global func_001175E4
.type func_001175E4, %function
func_001175E4:
.Lfunc_001175E4_0:
	ldrb	r2, [r0, #1628]
.Lfunc_001175E4_4:
	cmp	r2, r1
.Lfunc_001175E4_8:
	movls	r0, #0
.Lfunc_001175E4_c:
	bls	.Lfunc_001175E4_24
.Lfunc_001175E4_10:
	ldr	r0, [r0, #1624]
.Lfunc_001175E4_14:
	ldr	r0, [r0, r1, lsl #2]
.Lfunc_001175E4_18:
	cmp	r0, #0
.Lfunc_001175E4_1c:
	ldrne	r0, [r0, #172]
.Lfunc_001175E4_20:
	mvneq	r0, #0
.Lfunc_001175E4_24:
	bx	lr
.size func_001175E4, .-func_001175E4

.section .text.func_0011DB3C,"ax",%progbits
.balign 4
.global func_0011DB3C
.type func_0011DB3C, %function
func_0011DB3C:
.Lfunc_0011DB3C_0:
	ldr	r0, [r0]
.Lfunc_0011DB3C_4:
	cmp	r1, #2
.Lfunc_0011DB3C_8:
	ldr	r0, [r0, #12]
.Lfunc_0011DB3C_c:
	addcs	r0, r0, #8
.Lfunc_0011DB3C_10:
	bcs	.Lfunc_0011DB3C_24
.Lfunc_0011DB3C_14:
	mov	r2, #117
.Lfunc_0011DB3C_18:
	mul	r1, r1, r2
.Lfunc_0011DB3C_1c:
	add	r0, r0, r1, lsl #2
.Lfunc_0011DB3C_20:
	add	r0, r0, #8
.Lfunc_0011DB3C_24:
	bx	lr
.size func_0011DB3C, .-func_0011DB3C

.section .text.func_0014E024,"ax",%progbits
.balign 4
.global func_0014E024
.type func_0014E024, %function
func_0014E024:
.Lfunc_0014E024_0:
	ldrh	r1, [r0]
.Lfunc_0014E024_4:
	cmp	r1, #16
.Lfunc_0014E024_8:
	bne	.Lfunc_0014E024_20
.Lfunc_0014E024_c:
	ldrh	r0, [r0, #2]
.Lfunc_0014E024_10:
	sub	r0, r0, #1
.Lfunc_0014E024_14:
	cmp	r0, #15
.Lfunc_0014E024_18:
	uxthcc	r0, r0
.Lfunc_0014E024_1c:
	bcc	.Lfunc_0014E024_24
.Lfunc_0014E024_20:
	mov	r0, #0
.Lfunc_0014E024_24:
	bx	lr
.size func_0014E024, .-func_0014E024
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_79.S` without access
to the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation exports exactly the twenty-four named functions in their
owned executable sections, produces no relocations or adjacent data, and
matches the sizes and schedules above. Its source SHA-256 is recorded above
and in the neutral config.
