# Probe-verified ARM runtime/helper batch 75

Source SHA-256: `7581c5f4fba579b916e12e2fcf33b6c5f16dd6c2135efc3113066b69188f2719`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 1,440 executable body bytes (360 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and independently
assembled exact-schedule probes. The batch excludes every previously configured
function and is disjoint from pending duplicate batch 73, IPC batch 69, and
runtime batches 73 and 74.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the current target
inventory, so no member belongs to an exact-duplicate family. Private inspection
artifacts used for selection are not part of this specification. Independent
ARMv6K assembly comparison against target revision `AS_EUR_REV2` on 2026-10-16
matched all twenty-four complete bodies (1,440 bytes / 360 instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00111AFC` | `.text.func_00111AFC` | ARM | 60 | 15 | 2 | 6 | 1 | `func_00111B38` |
| `func_001E400C` | `.text.func_001E400C` | ARM | 60 | 15 | 2 | 5 | 1 | `func_001E419C` |
| `func_001F968C` | `.text.func_001F968C` | ARM | 60 | 15 | 1 | 9 | 1 | `func_001F96C8` |
| `func_00242368` | `.text.func_00242368` | ARM | 60 | 15 | 0 | 8 | 1 | `func_0024244C` |
| `func_0024DC94` | `.text.func_0024DC94` | ARM | 60 | 15 | 1 | 11 | 1 | `func_0024DCD0` |
| `func_0032A71C` | `.text.func_0032A71C` | ARM | 60 | 15 | 1 | 8 | 1 | `func_0032A758` |
| `func_0032BB4C` | `.text.func_0032BB4C` | ARM | 60 | 15 | 3 | 5 | 1 | `func_0032BB88` |
| `func_00353D58` | `.text.func_00353D58` | ARM | 60 | 15 | 3 | 3 | 2 | `func_00353F0C` |
| `func_00397720` | `.text.func_00397720` | ARM | 60 | 15 | 3 | 5 | 1 | `func_00397760` |
| `func_00397A1C` | `.text.func_00397A1C` | ARM | 60 | 15 | 3 | 5 | 1 | `func_00397AEC` |
| `func_00398B94` | `.text.func_00398B94` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00398BD0` |
| `func_00398BD0` | `.text.func_00398BD0` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00398C0C` |
| `func_00398C0C` | `.text.func_00398C0C` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00398D10` |
| `func_003993F8` | `.text.func_003993F8` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00399434` |
| `func_00399434` | `.text.func_00399434` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00399470` |
| `func_0039954C` | `.text.func_0039954C` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00399588` |
| `func_00399A44` | `.text.func_00399A44` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00399A80` |
| `func_003B7190` | `.text.func_003B7190` | ARM | 60 | 15 | 2 | 0 | 1 | `func_003B71CC` |
| `func_003BB4D4` | `.text.func_003BB4D4` | ARM | 60 | 15 | 0 | 9 | 1 | `func_003BB634` |
| `func_00410B4C` | `.text.func_00410B4C` | ARM | 60 | 15 | 0 | 5 | 1 | `func_00410B88` |
| `func_00417674` | `.text.func_00417674` | ARM | 60 | 15 | 1 | 6 | 1 | `func_004176B0` |
| `func_00437DEC` | `.text.func_00437DEC` | ARM | 60 | 15 | 2 | 6 | 1 | `func_00437E28` |
| `func_0046C5C0` | `.text.func_0046C5C0` | ARM | 60 | 15 | 2 | 5 | 1 | `func_0046C930` |
| `func_004A9DB8` | `.text.func_004A9DB8` | ARM | 60 | 15 | 3 | 2 | 2 | `func_004A9DF4` |

Memory-operation counts include scalar, VFP, and multiple-register loads/stores
plus stack transfers. Return transfers are excluded from the local-branch
column. The per-function counts total 29 direct function-local B-family sites,
all conditional. The bodies also contain 26 separately validated return
transfers and 133 memory operations.

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

.section .text.func_00111AFC,"ax",%progbits
.balign 4
.global func_00111AFC
.type func_00111AFC, %function
func_00111AFC:
.Lfunc_00111AFC_0:
	ldr	r0, [r0, #4]
.Lfunc_00111AFC_4:
	ldr	r2, [r0, #172]
.Lfunc_00111AFC_8:
	cmp	r2, r1
.Lfunc_00111AFC_c:
	bls	.Lfunc_00111AFC_38
.Lfunc_00111AFC_10:
	ldr	r0, [r0, #168]
.Lfunc_00111AFC_14:
	add	r2, r1, r1, lsl #1
.Lfunc_00111AFC_18:
	add	r1, r2, r1, lsl #3
.Lfunc_00111AFC_1c:
	ldrb	r2, [r0, r1, lsl #2]
.Lfunc_00111AFC_20:
	cmp	r2, #0
.Lfunc_00111AFC_24:
	beq	.Lfunc_00111AFC_38
.Lfunc_00111AFC_28:
	mov	r2, #8
.Lfunc_00111AFC_2c:
	add	r1, r2, r1, lsl #2
.Lfunc_00111AFC_30:
	ldr	r0, [r0, r1]
.Lfunc_00111AFC_34:
	vstr	s0, [r0, #16]
.Lfunc_00111AFC_38:
	bx	lr
.size func_00111AFC, .-func_00111AFC

.section .text.func_001E400C,"ax",%progbits
.balign 4
.global func_001E400C
.type func_001E400C, %function
func_001E400C:
.Lfunc_001E400C_0:
	push	{r4, lr}
.Lfunc_001E400C_4:
	mov	r4, r0
.Lfunc_001E400C_8:
	str	r1, [r0, #2808]
.Lfunc_001E400C_c:
	ldrb	r0, [r0, #2104]
.Lfunc_001E400C_10:
	cmp	r0, #0
.Lfunc_001E400C_14:
	bne	.Lfunc_001E400C_38
.Lfunc_001E400C_18:
	cmp	r1, #19
.Lfunc_001E400C_1c:
	ble	.Lfunc_001E400C_38
.Lfunc_001E400C_20:
	mov	r2, #0
.Lfunc_001E400C_24:
	mov	r1, r2
.Lfunc_001E400C_28:
	mov	r0, r2
.Lfunc_001E400C_2c:
	mov	r0, r0
.Lfunc_001E400C_30:
	mov	r0, #0
.Lfunc_001E400C_34:
	str	r0, [r4, #2808]
.Lfunc_001E400C_38:
	pop	{r4, pc}
.size func_001E400C, .-func_001E400C

.section .text.func_001F968C,"ax",%progbits
.balign 4
.global func_001F968C
.type func_001F968C, %function
func_001F968C:
.Lfunc_001F968C_0:
	ldr	r2, [r0, #12]
.Lfunc_001F968C_4:
	str	r1, [r0]
.Lfunc_001F968C_8:
	cmp	r2, #0
.Lfunc_001F968C_c:
	beq	.Lfunc_001F968C_20
.Lfunc_001F968C_10:
	ldr	r3, [r0, #8]
.Lfunc_001F968C_14:
	sub	r1, r1, r3
.Lfunc_001F968C_18:
	lsr	r1, r1, #3
.Lfunc_001F968C_1c:
	str	r1, [r2]
.Lfunc_001F968C_20:
	ldr	r1, [r0]
.Lfunc_001F968C_24:
	mov	r2, #0
.Lfunc_001F968C_28:
	str	r1, [r0, #4]
.Lfunc_001F968C_2c:
	str	r2, [r0, #12]
.Lfunc_001F968C_30:
	str	r1, [r0, #8]!
.Lfunc_001F968C_34:
	str	r2, [r0, #8]
.Lfunc_001F968C_38:
	bx	lr
.size func_001F968C, .-func_001F968C

.section .text.func_00242368,"ax",%progbits
.balign 4
.global func_00242368
.type func_00242368, %function
func_00242368:
.Lfunc_00242368_0:
	ldr	r3, [r0, #32]
.Lfunc_00242368_4:
	ldr	ip, [r0, #28]
.Lfunc_00242368_8:
	ldr	r2, [r0, #20]
.Lfunc_00242368_c:
	add	r3, r3, #1
.Lfunc_00242368_10:
	add	ip, ip, r1
.Lfunc_00242368_14:
	str	r3, [r0, #32]
.Lfunc_00242368_18:
	str	ip, [r0, #28]
.Lfunc_00242368_1c:
	ldr	r3, [r0, #24]
.Lfunc_00242368_20:
	cmp	r2, r1
.Lfunc_00242368_24:
	movcs	r2, r1
.Lfunc_00242368_28:
	cmp	r3, r1
.Lfunc_00242368_2c:
	movcs	r1, r3
.Lfunc_00242368_30:
	str	r2, [r0, #20]
.Lfunc_00242368_34:
	str	r1, [r0, #24]
.Lfunc_00242368_38:
	bx	lr
.size func_00242368, .-func_00242368

.section .text.func_0024DC94,"ax",%progbits
.balign 4
.global func_0024DC94
.type func_0024DC94, %function
func_0024DC94:
.Lfunc_0024DC94_0:
	ldr	r2, [r0, #44]
.Lfunc_0024DC94_4:
	ldr	r1, [r2, #4]
.Lfunc_0024DC94_8:
	cmp	r1, r2
.Lfunc_0024DC94_c:
	beq	.Lfunc_0024DC94_38
.Lfunc_0024DC94_10:
	ldrd	r2, [r1]
.Lfunc_0024DC94_14:
	str	r2, [r3]
.Lfunc_0024DC94_18:
	ldrd	r2, [r1]
.Lfunc_0024DC94_1c:
	str	r3, [r2, #4]
.Lfunc_0024DC94_20:
	ldr	r2, [r0, #48]
.Lfunc_0024DC94_24:
	sub	r2, r2, #1
.Lfunc_0024DC94_28:
	str	r2, [r0, #48]
.Lfunc_0024DC94_2c:
	ldr	r2, [r0, #32]
.Lfunc_0024DC94_30:
	str	r2, [r1]
.Lfunc_0024DC94_34:
	str	r1, [r0, #32]
.Lfunc_0024DC94_38:
	bx	lr
.size func_0024DC94, .-func_0024DC94

.section .text.func_0032A71C,"ax",%progbits
.balign 4
.global func_0032A71C
.type func_0032A71C, %function
func_0032A71C:
.Lfunc_0032A71C_0:
	ldr	r2, [r0]
.Lfunc_0032A71C_4:
	cmp	r2, #0
.Lfunc_0032A71C_8:
	beq	.Lfunc_0032A71C_38
.Lfunc_0032A71C_c:
	ldr	r3, [r2, #8]
.Lfunc_0032A71C_10:
	mov	r1, #0
.Lfunc_0032A71C_14:
	cmp	r3, r0
.Lfunc_0032A71C_18:
	streq	r1, [r2, #8]
.Lfunc_0032A71C_1c:
	ldr	r2, [r0]
.Lfunc_0032A71C_20:
	ldr	r3, [r2, #12]
.Lfunc_0032A71C_24:
	cmp	r3, r0
.Lfunc_0032A71C_28:
	streq	r1, [r2, #12]
.Lfunc_0032A71C_2c:
	ldr	r2, [r0]
.Lfunc_0032A71C_30:
	cmp	r2, #0
.Lfunc_0032A71C_34:
	strne	r1, [r0]
.Lfunc_0032A71C_38:
	bx	lr
.size func_0032A71C, .-func_0032A71C

.section .text.func_0032BB4C,"ax",%progbits
.balign 4
.global func_0032BB4C
.type func_0032BB4C, %function
func_0032BB4C:
.Lfunc_0032BB4C_0:
	ldr	r1, [r0]
.Lfunc_0032BB4C_4:
	cmp	r1, #0
.Lfunc_0032BB4C_8:
	beq	.Lfunc_0032BB4C_38
.Lfunc_0032BB4C_c:
	add	r1, r1, #8192
.Lfunc_0032BB4C_10:
	add	r1, r1, #2528
.Lfunc_0032BB4C_14:
	mov	r2, #0
.Lfunc_0032BB4C_18:
	ldr	r3, [r1]
.Lfunc_0032BB4C_1c:
	cmp	r3, r0
.Lfunc_0032BB4C_20:
	bne	.Lfunc_0032BB4C_34
.Lfunc_0032BB4C_24:
	str	r2, [r1]
.Lfunc_0032BB4C_28:
	ldr	r1, [r0]
.Lfunc_0032BB4C_2c:
	cmp	r1, #0
.Lfunc_0032BB4C_30:
	beq	.Lfunc_0032BB4C_38
.Lfunc_0032BB4C_34:
	str	r2, [r0]
.Lfunc_0032BB4C_38:
	bx	lr
.size func_0032BB4C, .-func_0032BB4C

.section .text.func_00353D58,"ax",%progbits
.balign 4
.global func_00353D58
.type func_00353D58, %function
func_00353D58:
.Lfunc_00353D58_0:
	ldr	r2, [r0, #272]
.Lfunc_00353D58_4:
	add	r3, r0, #272
.Lfunc_00353D58_8:
	cmp	r2, r3
.Lfunc_00353D58_c:
	beq	.Lfunc_00353D58_34
.Lfunc_00353D58_10:
	ldr	r3, [r2, #-20]
.Lfunc_00353D58_14:
	cmp	r3, r1
.Lfunc_00353D58_18:
	bne	.Lfunc_00353D58_24
.Lfunc_00353D58_1c:
	sub	r0, r2, #24
.Lfunc_00353D58_20:
	bx	lr
.Lfunc_00353D58_24:
	ldr	r2, [r2]
.Lfunc_00353D58_28:
	add	r3, r0, #272
.Lfunc_00353D58_2c:
	cmp	r2, r3
.Lfunc_00353D58_30:
	bne	.Lfunc_00353D58_10
.Lfunc_00353D58_34:
	mov	r0, #0
.Lfunc_00353D58_38:
	bx	lr
.size func_00353D58, .-func_00353D58

.section .text.func_00397720,"ax",%progbits
.balign 4
.global func_00397720
.type func_00397720, %function
func_00397720:
.Lfunc_00397720_0:
	ldr	r2, [r0, #324]
.Lfunc_00397720_4:
	cmp	r2, #0
.Lfunc_00397720_8:
	beq	.Lfunc_00397720_28
.Lfunc_00397720_c:
	mov	r3, r2
.Lfunc_00397720_10:
	ldr	r2, [r2, #4]
.Lfunc_00397720_14:
	cmp	r2, #0
.Lfunc_00397720_18:
	bne	.Lfunc_00397720_c
.Lfunc_00397720_1c:
	cmp	r3, #0
.Lfunc_00397720_20:
	strne	r1, [r3, #4]
.Lfunc_00397720_24:
	bne	.Lfunc_00397720_2c
.Lfunc_00397720_28:
	str	r1, [r0, #324]
.Lfunc_00397720_2c:
	mov	r2, #0
.Lfunc_00397720_30:
	mov	r0, #1
.Lfunc_00397720_34:
	str	r2, [r1, #4]
.Lfunc_00397720_38:
	bx	lr
.size func_00397720, .-func_00397720

.section .text.func_00397A1C,"ax",%progbits
.balign 4
.global func_00397A1C
.type func_00397A1C, %function
func_00397A1C:
.Lfunc_00397A1C_0:
	ldr	r2, [r0, #328]
.Lfunc_00397A1C_4:
	cmp	r2, #0
.Lfunc_00397A1C_8:
	beq	.Lfunc_00397A1C_28
.Lfunc_00397A1C_c:
	mov	r3, r2
.Lfunc_00397A1C_10:
	ldr	r2, [r2, #4]
.Lfunc_00397A1C_14:
	cmp	r2, #0
.Lfunc_00397A1C_18:
	bne	.Lfunc_00397A1C_c
.Lfunc_00397A1C_1c:
	cmp	r3, #0
.Lfunc_00397A1C_20:
	strne	r1, [r3, #4]
.Lfunc_00397A1C_24:
	bne	.Lfunc_00397A1C_2c
.Lfunc_00397A1C_28:
	str	r1, [r0, #328]
.Lfunc_00397A1C_2c:
	mov	r2, #0
.Lfunc_00397A1C_30:
	mov	r0, #1
.Lfunc_00397A1C_34:
	str	r2, [r1, #4]
.Lfunc_00397A1C_38:
	bx	lr
.size func_00397A1C, .-func_00397A1C

.section .text.func_00398B94,"ax",%progbits
.balign 4
.global func_00398B94
.type func_00398B94, %function
func_00398B94:
.Lfunc_00398B94_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398B94_4:
	ldr	r0, [r0, #108]
.Lfunc_00398B94_8:
	add	ip, r1, r1, lsl #1
.Lfunc_00398B94_c:
	mov	r3, #3584
.Lfunc_00398B94_10:
	add	r0, r0, ip, lsl #2
.Lfunc_00398B94_14:
	and	r1, r3, r2, lsl #9
.Lfunc_00398B94_18:
	ldr	r2, [r0, #240]
.Lfunc_00398B94_1c:
	bic	r2, r2, #3584
.Lfunc_00398B94_20:
	orr	r1, r1, r2
.Lfunc_00398B94_24:
	orr	r1, r1, #2
.Lfunc_00398B94_28:
	str	r1, [r0, #240]
.Lfunc_00398B94_2c:
	ldr	r1, [r0, #244]
.Lfunc_00398B94_30:
	orr	r1, r1, #1
.Lfunc_00398B94_34:
	str	r1, [r0, #244]
.Lfunc_00398B94_38:
	bx	lr
.size func_00398B94, .-func_00398B94

.section .text.func_00398BD0,"ax",%progbits
.balign 4
.global func_00398BD0
.type func_00398BD0, %function
func_00398BD0:
.Lfunc_00398BD0_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398BD0_4:
	push	{r4}
.Lfunc_00398BD0_8:
	ldr	r0, [r0, #108]
.Lfunc_00398BD0_c:
	add	r4, r1, r1, lsl #1
.Lfunc_00398BD0_10:
	mov	ip, #384
.Lfunc_00398BD0_14:
	add	r0, r0, r4, lsl #2
.Lfunc_00398BD0_18:
	add	r0, r0, r2, lsl #3
.Lfunc_00398BD0_1c:
	and	r1, ip, r3, lsl #7
.Lfunc_00398BD0_20:
	ldr	r2, [r0, #248]
.Lfunc_00398BD0_24:
	bic	r2, r2, #384
.Lfunc_00398BD0_28:
	orr	r1, r1, r2
.Lfunc_00398BD0_2c:
	orr	r1, r1, #2
.Lfunc_00398BD0_30:
	str	r1, [r0, #248]
.Lfunc_00398BD0_34:
	pop	{r4}
.Lfunc_00398BD0_38:
	bx	lr
.size func_00398BD0, .-func_00398BD0

.section .text.func_00398C0C,"ax",%progbits
.balign 4
.global func_00398C0C
.type func_00398C0C, %function
func_00398C0C:
.Lfunc_00398C0C_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398C0C_4:
	push	{r4}
.Lfunc_00398C0C_8:
	ldr	r0, [r0, #108]
.Lfunc_00398C0C_c:
	add	r4, r1, r1, lsl #1
.Lfunc_00398C0C_10:
	mov	ip, #1536
.Lfunc_00398C0C_14:
	add	r0, r0, r4, lsl #2
.Lfunc_00398C0C_18:
	add	r0, r0, r2, lsl #3
.Lfunc_00398C0C_1c:
	and	r1, ip, r3, lsl #9
.Lfunc_00398C0C_20:
	ldr	r2, [r0, #248]
.Lfunc_00398C0C_24:
	bic	r2, r2, #1536
.Lfunc_00398C0C_28:
	orr	r1, r1, r2
.Lfunc_00398C0C_2c:
	orr	r1, r1, #2
.Lfunc_00398C0C_30:
	str	r1, [r0, #248]
.Lfunc_00398C0C_34:
	pop	{r4}
.Lfunc_00398C0C_38:
	bx	lr
.size func_00398C0C, .-func_00398C0C

.section .text.func_003993F8,"ax",%progbits
.balign 4
.global func_003993F8
.type func_003993F8, %function
func_003993F8:
.Lfunc_003993F8_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_003993F8_4:
	push	{r4}
.Lfunc_003993F8_8:
	ldr	r0, [r0, #108]
.Lfunc_003993F8_c:
	add	r4, r1, r1, lsl #1
.Lfunc_003993F8_10:
	mov	ip, #2048
.Lfunc_003993F8_14:
	add	r0, r0, r4, lsl #2
.Lfunc_003993F8_18:
	add	r0, r0, r2, lsl #3
.Lfunc_003993F8_1c:
	and	r1, ip, r3, lsl #11
.Lfunc_003993F8_20:
	ldr	r2, [r0, #248]
.Lfunc_003993F8_24:
	bic	r2, r2, #2048
.Lfunc_003993F8_28:
	orr	r1, r1, r2
.Lfunc_003993F8_2c:
	orr	r1, r1, #4
.Lfunc_003993F8_30:
	str	r1, [r0, #248]
.Lfunc_003993F8_34:
	pop	{r4}
.Lfunc_003993F8_38:
	bx	lr
.size func_003993F8, .-func_003993F8

.section .text.func_00399434,"ax",%progbits
.balign 4
.global func_00399434
.type func_00399434, %function
func_00399434:
.Lfunc_00399434_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00399434_4:
	push	{r4}
.Lfunc_00399434_8:
	ldr	r0, [r0, #108]
.Lfunc_00399434_c:
	add	r4, r1, r1, lsl #1
.Lfunc_00399434_10:
	mov	ip, #114688
.Lfunc_00399434_14:
	add	r0, r0, r4, lsl #2
.Lfunc_00399434_18:
	add	r0, r0, r2, lsl #3
.Lfunc_00399434_1c:
	and	r1, ip, r3, lsl #14
.Lfunc_00399434_20:
	ldr	r2, [r0, #248]
.Lfunc_00399434_24:
	bic	r2, r2, #114688
.Lfunc_00399434_28:
	orr	r1, r1, r2
.Lfunc_00399434_2c:
	orr	r1, r1, #4
.Lfunc_00399434_30:
	str	r1, [r0, #248]
.Lfunc_00399434_34:
	pop	{r4}
.Lfunc_00399434_38:
	bx	lr
.size func_00399434, .-func_00399434

.section .text.func_0039954C,"ax",%progbits
.balign 4
.global func_0039954C
.type func_0039954C, %function
func_0039954C:
.Lfunc_0039954C_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_0039954C_4:
	ldr	r0, [r0, #108]
.Lfunc_0039954C_8:
	add	ip, r1, r1, lsl #1
.Lfunc_0039954C_c:
	mov	r3, #983040
.Lfunc_0039954C_10:
	add	r0, r0, ip, lsl #2
.Lfunc_0039954C_14:
	and	r1, r3, r2, lsl #16
.Lfunc_0039954C_18:
	ldr	r2, [r0, #240]
.Lfunc_0039954C_1c:
	bic	r2, r2, #983040
.Lfunc_0039954C_20:
	orr	r1, r1, r2
.Lfunc_0039954C_24:
	orr	r1, r1, #2
.Lfunc_0039954C_28:
	str	r1, [r0, #240]
.Lfunc_0039954C_2c:
	ldr	r1, [r0, #244]
.Lfunc_0039954C_30:
	orr	r1, r1, #1
.Lfunc_0039954C_34:
	str	r1, [r0, #244]
.Lfunc_0039954C_38:
	bx	lr
.size func_0039954C, .-func_0039954C

.section .text.func_00399A44,"ax",%progbits
.balign 4
.global func_00399A44
.type func_00399A44, %function
func_00399A44:
.Lfunc_00399A44_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00399A44_4:
	ldr	r0, [r0, #108]
.Lfunc_00399A44_8:
	add	ip, r1, r1, lsl #1
.Lfunc_00399A44_c:
	mov	r3, #251658240
.Lfunc_00399A44_10:
	add	r0, r0, ip, lsl #2
.Lfunc_00399A44_14:
	and	r1, r3, r2, lsl #24
.Lfunc_00399A44_18:
	ldr	r2, [r0, #240]
.Lfunc_00399A44_1c:
	bic	r2, r2, #251658240
.Lfunc_00399A44_20:
	orr	r1, r1, r2
.Lfunc_00399A44_24:
	orr	r1, r1, #2
.Lfunc_00399A44_28:
	str	r1, [r0, #240]
.Lfunc_00399A44_2c:
	ldr	r1, [r0, #244]
.Lfunc_00399A44_30:
	orr	r1, r1, #1
.Lfunc_00399A44_34:
	str	r1, [r0, #244]
.Lfunc_00399A44_38:
	bx	lr
.size func_00399A44, .-func_00399A44

.section .text.func_003B7190,"ax",%progbits
.balign 4
.global func_003B7190
.type func_003B7190, %function
func_003B7190:
.Lfunc_003B7190_0:
	sub	r1, r0, #328
.Lfunc_003B7190_4:
	cmp	r1, #97
.Lfunc_003B7190_8:
	subhi	r1, r0, #512
.Lfunc_003B7190_c:
	subhi	r1, r1, #106
.Lfunc_003B7190_10:
	cmphi	r1, #2
.Lfunc_003B7190_14:
	subhi	r1, r0, #512
.Lfunc_003B7190_18:
	subhi	r1, r1, #178
.Lfunc_003B7190_1c:
	cmphi	r1, #4
.Lfunc_003B7190_20:
	bls	.Lfunc_003B7190_34
.Lfunc_003B7190_24:
	sub	r1, r0, #512
.Lfunc_003B7190_28:
	subs	r1, r1, #225
.Lfunc_003B7190_2c:
	movne	r0, #0
.Lfunc_003B7190_30:
	bne	.Lfunc_003B7190_38
.Lfunc_003B7190_34:
	mov	r0, #1
.Lfunc_003B7190_38:
	bx	lr
.size func_003B7190, .-func_003B7190

.section .text.func_003BB4D4,"ax",%progbits
.balign 4
.global func_003BB4D4
.type func_003BB4D4, %function
func_003BB4D4:
.Lfunc_003BB4D4_0:
	push	{r4}
.Lfunc_003BB4D4_4:
	ldm	r0, {r1, ip}
.Lfunc_003BB4D4_8:
	ldr	r2, [r0, #12]
.Lfunc_003BB4D4_c:
	ldr	r3, [r0, #8]
.Lfunc_003BB4D4_10:
	eor	r1, r1, r1, lsl #11
.Lfunc_003BB4D4_14:
	eor	r4, r2, r2, lsr #19
.Lfunc_003BB4D4_18:
	eor	r1, r1, r1, lsr #8
.Lfunc_003BB4D4_1c:
	eor	r1, r1, r4
.Lfunc_003BB4D4_20:
	str	r1, [r0, #12]
.Lfunc_003BB4D4_24:
	str	r2, [r0, #8]
.Lfunc_003BB4D4_28:
	str	r3, [r0, #4]
.Lfunc_003BB4D4_2c:
	str	ip, [r0]
.Lfunc_003BB4D4_30:
	pop	{r4}
.Lfunc_003BB4D4_34:
	mov	r0, r1
.Lfunc_003BB4D4_38:
	bx	lr
.size func_003BB4D4, .-func_003BB4D4

.section .text.func_00410B4C,"ax",%progbits
.balign 4
.global func_00410B4C
.type func_00410B4C, %function
func_00410B4C:
.Lfunc_00410B4C_0:
	ldr	r2, [r0, #12]
.Lfunc_00410B4C_4:
	ldrh	r3, [r1]
.Lfunc_00410B4C_8:
	mvn	ip, #129024
.Lfunc_00410B4C_c:
	bic	r2, r2, #1792
.Lfunc_00410B4C_10:
	bic	r2, r2, #254
.Lfunc_00410B4C_14:
	and	r3, ip, r3, lsl #1
.Lfunc_00410B4C_18:
	orr	r2, r2, r3
.Lfunc_00410B4C_1c:
	str	r2, [r0, #12]
.Lfunc_00410B4C_20:
	ldrh	r1, [r1, #2]
.Lfunc_00410B4C_24:
	mov	r3, #260096
.Lfunc_00410B4C_28:
	bic	r2, r2, #260096
.Lfunc_00410B4C_2c:
	and	r1, r3, r1, lsl #11
.Lfunc_00410B4C_30:
	orr	r1, r1, r2
.Lfunc_00410B4C_34:
	str	r1, [r0, #12]
.Lfunc_00410B4C_38:
	bx	lr
.size func_00410B4C, .-func_00410B4C

.section .text.func_00417674,"ax",%progbits
.balign 4
.global func_00417674
.type func_00417674, %function
func_00417674:
.Lfunc_00417674_0:
	ldrh	r1, [r0, #2]
.Lfunc_00417674_4:
	add	r1, r1, #1
.Lfunc_00417674_8:
	uxth	r1, r1
.Lfunc_00417674_c:
	cmp	r1, #99
.Lfunc_00417674_10:
	strh	r1, [r0, #2]
.Lfunc_00417674_14:
	bls	.Lfunc_00417674_38
.Lfunc_00417674_18:
	ldrh	r2, [r0]
.Lfunc_00417674_1c:
	mov	r1, #0
.Lfunc_00417674_20:
	strh	r1, [r0, #2]
.Lfunc_00417674_24:
	add	r2, r2, #1
.Lfunc_00417674_28:
	uxth	r2, r2
.Lfunc_00417674_2c:
	cmp	r2, #900
.Lfunc_00417674_30:
	strh	r2, [r0]
.Lfunc_00417674_34:
	strhcs	r1, [r0]
.Lfunc_00417674_38:
	bx	lr
.size func_00417674, .-func_00417674

.section .text.func_00437DEC,"ax",%progbits
.balign 4
.global func_00437DEC
.type func_00437DEC, %function
func_00437DEC:
.Lfunc_00437DEC_0:
	push	{r4, lr}
.Lfunc_00437DEC_4:
	mov	r4, r0
.Lfunc_00437DEC_8:
	ldr	r0, [r0, #24]
.Lfunc_00437DEC_c:
	cmp	r0, #0
.Lfunc_00437DEC_10:
	bne	.Lfunc_00437DEC_30
.Lfunc_00437DEC_14:
	mov	r2, #0
.Lfunc_00437DEC_18:
	mov	r1, r2
.Lfunc_00437DEC_1c:
	mov	r0, r2
.Lfunc_00437DEC_20:
	mov	r0, r0
.Lfunc_00437DEC_24:
	ldr	r0, [r4, #24]
.Lfunc_00437DEC_28:
	cmp	r0, #0
.Lfunc_00437DEC_2c:
	beq	.Lfunc_00437DEC_38
.Lfunc_00437DEC_30:
	ldr	r0, [r4, #24]
.Lfunc_00437DEC_34:
	ldr	r0, [r0, #128]
.Lfunc_00437DEC_38:
	pop	{r4, pc}
.size func_00437DEC, .-func_00437DEC

.section .text.func_0046C5C0,"ax",%progbits
.balign 4
.global func_0046C5C0
.type func_0046C5C0, %function
func_0046C5C0:
.Lfunc_0046C5C0_0:
	mov	r1, #0
.Lfunc_0046C5C0_4:
	strb	r1, [r0, #101]
.Lfunc_0046C5C0_8:
	ldr	r1, [r0, #64]
.Lfunc_0046C5C0_c:
	add	r2, r0, #64
.Lfunc_0046C5C0_10:
	cmp	r1, r2
.Lfunc_0046C5C0_14:
	movne	ip, #1
.Lfunc_0046C5C0_18:
	beq	.Lfunc_0046C5C0_38
.Lfunc_0046C5C0_1c:
	ldrb	r2, [r1, #1072]
.Lfunc_0046C5C0_20:
	ldr	r1, [r1]
.Lfunc_0046C5C0_24:
	cmp	r2, #0
.Lfunc_0046C5C0_28:
	add	r2, r0, #64
.Lfunc_0046C5C0_2c:
	strbne	ip, [r0, #101]
.Lfunc_0046C5C0_30:
	cmp	r1, r2
.Lfunc_0046C5C0_34:
	bne	.Lfunc_0046C5C0_1c
.Lfunc_0046C5C0_38:
	bx	lr
.size func_0046C5C0, .-func_0046C5C0

.section .text.func_004A9DB8,"ax",%progbits
.balign 4
.global func_004A9DB8
.type func_004A9DB8, %function
func_004A9DB8:
.Lfunc_004A9DB8_0:
	mov	r1, #0
.Lfunc_004A9DB8_4:
	ldrb	r2, [r0, r1]
.Lfunc_004A9DB8_8:
	cmp	r2, #0
.Lfunc_004A9DB8_c:
	bne	.Lfunc_004A9DB8_20
.Lfunc_004A9DB8_10:
	add	r2, r0, r1
.Lfunc_004A9DB8_14:
	ldrb	r2, [r2, #1]
.Lfunc_004A9DB8_18:
	cmp	r2, #0
.Lfunc_004A9DB8_1c:
	beq	.Lfunc_004A9DB8_28
.Lfunc_004A9DB8_20:
	mov	r0, #0
.Lfunc_004A9DB8_24:
	bx	lr
.Lfunc_004A9DB8_28:
	add	r1, r1, #2
.Lfunc_004A9DB8_2c:
	cmp	r1, #8
.Lfunc_004A9DB8_30:
	blt	.Lfunc_004A9DB8_4
.Lfunc_004A9DB8_34:
	mov	r0, #1
.Lfunc_004A9DB8_38:
	bx	lr
.size func_004A9DB8, .-func_004A9DB8
```

## Verification invariants

- Assemble for ARMv6K in ARM state with VFPv2 enabled.
- Emit exactly the 24 named `.text.<function>` sections, each aligned to four
  bytes and exactly 60 bytes long.
- The object must contain zero relocations and no bytes outside the 1,440 owned
  body bytes.
- Reject all direct calls, indirect calls/tails, external branches, PC-relative
  loads, ADR-family accesses, adjacent words, symbolic slots, or private assets.
- Resolve all 29 local branches within their owning section. Using the neutral
  batch-73/74 validator serialization, the canonical branch schedule SHA-256 is
  `2655704d2594611f664ce19dc9c4fba932438b8449dc502a2759e3ca5c41bf0f`.
- Validate all 26 returns. Using the same serialization, the canonical return
  schedule SHA-256 is
  `0e17eb0c376553be1a45014b9bd4de28eb0fa85327f665d1e6dc7f4d91e595c6`.
  The analysis handoff originally supplied
  `0bc348b78af1c58e182bc45475df2779386d5057569b5d34ec2946137780ec6f`
  and `42e66d6cf26ba8600ceeb27989d931f626ccfab06ef940e0384822c01c5f21cf`;
  those values used an undocumented, noncanonical serialization and are
  retained here only as provenance for the correction.
- Validate exactly 133 memory operations and preserve every condition code,
  register choice, shift, writeback mode, and instruction ordering.
- Require the config identity class to contain exactly the 24 function names
  listed in the structural table and no other members.

## Completeness and exclusion audit

The current objdiff report lists all 24 functions as unmatched. A complete scan
of tracked and pending JSON manifests found none of these names in an earlier or
concurrent function or mapping assignment. The selected address ranges are
pairwise disjoint and symbol-bounded. Exact-body comparison against the complete
target section inventory found one identity per selected body. Reassembling the
schedule above produced 24 relocation-free sections whose 1,440 bytes matched
their corresponding private target sections exactly.
