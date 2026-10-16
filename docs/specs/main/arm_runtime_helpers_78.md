# Probe-verified ARM runtime/helper batch 78

Source SHA-256: `b8f6cf531f0995a5e7cfad7b417e1e63eb0f243bf23ace6357bd4a64f940dfec`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 1,184 executable body bytes (296 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and independently
assembled exact-schedule probes. The final selection dynamically excludes every
function present in any current config, including all completed and pending
runtime, duplicate-template, and IPC batches through the analysis date.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the complete
current target section inventory, so no member belongs to an exact-duplicate
family. The authoritative report has an unmatched entry below 100 percent for
every selected name and accounts for exactly 1,184 selected bytes. Private
inspection artifacts used for selection are ignored and are not part of this
specification. Independent ARMv6K assembly comparison against target revision
`AS_EUR_REV2` on 2026-10-16 matched all twenty-four complete bodies (1,184
bytes / 296 instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_003B7DD8` | `.text.func_003B7DD8` | ARM | 52 | 13 | 0 | 9 | 1 | `func_003B7E0C` |
| `func_0040FE1C` | `.text.func_0040FE1C` | ARM | 52 | 13 | 2 | 8 | 1 | `func_0040FE50` |
| `func_0045A6E8` | `.text.func_0045A6E8` | ARM | 52 | 13 | 1 | 4 | 1 | `func_0045A71C` |
| `func_0045BFF8` | `.text.func_0045BFF8` | ARM | 52 | 13 | 1 | 3 | 2 | `func_0045C088` |
| `func_0045E0C0` | `.text.func_0045E0C0` | ARM | 52 | 13 | 1 | 2 | 1 | `func_0045E27C` |
| `func_00460C9C` | `.text.func_00460C9C` | ARM | 52 | 13 | 0 | 10 | 1 | `func_00461228` |
| `func_0047BEC0` | `.text.func_0047BEC0` | ARM | 52 | 13 | 3 | 1 | 1 | `func_0047BEF4` |
| `func_004BE764` | `.text.func_004BE764` | ARM | 52 | 13 | 0 | 2 | 1 | `func_004BE798` |
| `func_0010E14C` | `.text.func_0010E14C` | ARM | 48 | 12 | 1 | 6 | 1 | `func_0010E17C` |
| `func_001134A0` | `.text.func_001134A0` | ARM | 48 | 12 | 0 | 7 | 1 | `func_001134D0` |
| `func_0014AF14` | `.text.func_0014AF14` | ARM | 48 | 12 | 0 | 10 | 1 | `func_0014AF64` |
| `func_00177298` | `.text.func_00177298` | ARM | 48 | 12 | 1 | 4 | 1 | `func_001772C8` |
| `func_001CBF1C` | `.text.func_001CBF1C` | ARM | 48 | 12 | 1 | 3 | 1 | `func_001CC10C` |
| `func_001F9244` | `.text.func_001F9244` | ARM | 48 | 12 | 0 | 8 | 1 | `func_001F9274` |
| `func_002AFFDC` | `.text.func_002AFFDC` | ARM | 48 | 12 | 0 | 9 | 1 | `func_002B000C` |
| `func_00337878` | `.text.func_00337878` | ARM | 48 | 12 | 0 | 2 | 1 | `func_003378A8` |
| `func_0034ABEC` | `.text.func_0034ABEC` | ARM | 48 | 12 | 2 | 5 | 1 | `func_0034ACD4` |
| `func_00398928` | `.text.func_00398928` | ARM | 48 | 12 | 0 | 4 | 1 | `func_00398958` |
| `func_00398B2C` | `.text.func_00398B2C` | ARM | 48 | 12 | 0 | 4 | 1 | `func_00398B5C` |
| `func_00399FC8` | `.text.func_00399FC8` | ARM | 48 | 12 | 0 | 4 | 1 | `func_0039AC48` |
| `func_003BCE80` | `.text.func_003BCE80` | ARM | 48 | 12 | 0 | 8 | 1 | `func_003BCEB0` |
| `func_003FF134` | `.text.func_003FF134` | ARM | 48 | 12 | 1 | 4 | 1 | `func_003FF254` |
| `func_0044AACC` | `.text.func_0044AACC` | ARM | 48 | 12 | 1 | 5 | 1 | `func_0044AAFC` |
| `func_0045A438` | `.text.func_0045A438` | ARM | 48 | 12 | 0 | 6 | 1 | `func_0045A6E8` |

Memory-operation counts include scalar loads/stores, VFP transfers, and stack
transfers. Return transfers are excluded from the local-branch column. The
per-function counts total 15 direct function-local B-family sites, all
conditional, 25 separately validated return transfers, and 128 memory
operations.

The canonical direct-branch schedule SHA-256 is
`0195cd294593170b5f577d545a459564a702ab2c5db702d1f375a9b24e1551dd`.
The canonical return-transfer schedule SHA-256 is
`5b66418a9c0df004456d4f8428271747fdd399e8d77931a6886358e165cabbef`.
Both digests were independently reproduced from the bounded current target
sections and from the assembled exact-schedule probe.

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

.section .text.func_003B7DD8,"ax",%progbits
.balign 4
.global func_003B7DD8
.type func_003B7DD8, %function
func_003B7DD8:
.Lfunc_003B7DD8_0:
	mov	r3, #0
.Lfunc_003B7DD8_4:
	str	r3, [r0]
.Lfunc_003B7DD8_8:
	str	r3, [r0, #8]
.Lfunc_003B7DD8_c:
	strh	r3, [r0, #12]
.Lfunc_003B7DD8_10:
	str	r3, [r0, #16]
.Lfunc_003B7DD8_14:
	strh	r3, [r0, #20]
.Lfunc_003B7DD8_18:
	str	r3, [r0, #24]
.Lfunc_003B7DD8_1c:
	add	r2, r0, #28
.Lfunc_003B7DD8_20:
	mvn	ip, #0
.Lfunc_003B7DD8_24:
	stm	r2, {r3, ip}
.Lfunc_003B7DD8_28:
	str	r3, [r0, #48]
.Lfunc_003B7DD8_2c:
	str	r3, [r0, #52]
.Lfunc_003B7DD8_30:
	bx	lr
.size func_003B7DD8, .-func_003B7DD8

.section .text.func_0040FE1C,"ax",%progbits
.balign 4
.global func_0040FE1C
.type func_0040FE1C, %function
func_0040FE1C:
.Lfunc_0040FE1C_0:
	ldr	r2, [r0, #32]
.Lfunc_0040FE1C_4:
	cmp	r2, #0
.Lfunc_0040FE1C_8:
	beq	.Lfunc_0040FE1C_18
.Lfunc_0040FE1C_c:
	ldr	r2, [r0, #44]
.Lfunc_0040FE1C_10:
	ldr	r3, [r1]
.Lfunc_0040FE1C_14:
	str	r3, [r2, #16]
.Lfunc_0040FE1C_18:
	ldr	r2, [r0, #52]
.Lfunc_0040FE1C_1c:
	cmp	r2, #0
.Lfunc_0040FE1C_20:
	beq	.Lfunc_0040FE1C_30
.Lfunc_0040FE1C_24:
	ldr	r0, [r0, #64]
.Lfunc_0040FE1C_28:
	ldr	r1, [r1]
.Lfunc_0040FE1C_2c:
	str	r1, [r0, #12]
.Lfunc_0040FE1C_30:
	bx	lr
.size func_0040FE1C, .-func_0040FE1C

.section .text.func_0045A6E8,"ax",%progbits
.balign 4
.global func_0045A6E8
.type func_0045A6E8, %function
func_0045A6E8:
.Lfunc_0045A6E8_0:
	mov	r1, #0
.Lfunc_0045A6E8_4:
	add	r0, r0, #1600
.Lfunc_0045A6E8_8:
	mov	r2, r1
.Lfunc_0045A6E8_c:
	ldrb	r3, [r0, #984]
.Lfunc_0045A6E8_10:
	strb	r2, [r0, #982]
.Lfunc_0045A6E8_14:
	strb	r2, [r0, #983]
.Lfunc_0045A6E8_18:
	bic	r3, r3, #63
.Lfunc_0045A6E8_1c:
	add	r1, r1, #1
.Lfunc_0045A6E8_20:
	strb	r3, [r0, #984]
.Lfunc_0045A6E8_24:
	cmp	r1, #30
.Lfunc_0045A6E8_28:
	add	r0, r0, #992
.Lfunc_0045A6E8_2c:
	bcc	.Lfunc_0045A6E8_c
.Lfunc_0045A6E8_30:
	bx	lr
.size func_0045A6E8, .-func_0045A6E8

.section .text.func_0045BFF8,"ax",%progbits
.balign 4
.global func_0045BFF8
.type func_0045BFF8, %function
func_0045BFF8:
.Lfunc_0045BFF8_0:
	cmp	r1, #84
.Lfunc_0045BFF8_4:
	push	{r4, lr}
.Lfunc_0045BFF8_8:
	bge	.Lfunc_0045BFF8_1c
.Lfunc_0045BFF8_c:
	add	r1, r1, r1, lsl #1
.Lfunc_0045BFF8_10:
	add	r0, r0, r1, lsl #2
.Lfunc_0045BFF8_14:
	add	r0, r0, #4
.Lfunc_0045BFF8_18:
	pop	{r4, pc}
.Lfunc_0045BFF8_1c:
	mov	r2, #0
.Lfunc_0045BFF8_20:
	mov	r1, r2
.Lfunc_0045BFF8_24:
	mov	r0, r2
.Lfunc_0045BFF8_28:
	mov	r0, r0
.Lfunc_0045BFF8_2c:
	mov	r0, #0
.Lfunc_0045BFF8_30:
	pop	{r4, pc}
.size func_0045BFF8, .-func_0045BFF8

.section .text.func_0045E0C0,"ax",%progbits
.balign 4
.global func_0045E0C0
.type func_0045E0C0, %function
func_0045E0C0:
.Lfunc_0045E0C0_0:
	push	{r4, lr}
.Lfunc_0045E0C0_4:
	cmp	r1, #32
.Lfunc_0045E0C0_8:
	mov	r4, r0
.Lfunc_0045E0C0_c:
	bcc	.Lfunc_0045E0C0_24
.Lfunc_0045E0C0_10:
	mov	r2, #0
.Lfunc_0045E0C0_14:
	mov	r1, r2
.Lfunc_0045E0C0_18:
	mov	r0, r2
.Lfunc_0045E0C0_1c:
	mov	r0, r0
.Lfunc_0045E0C0_20:
	mov	r1, #0
.Lfunc_0045E0C0_24:
	add	r0, r4, r1, lsl #1
.Lfunc_0045E0C0_28:
	add	r0, r0, #1024
.Lfunc_0045E0C0_2c:
	add	r0, r0, #4
.Lfunc_0045E0C0_30:
	pop	{r4, pc}
.size func_0045E0C0, .-func_0045E0C0

.section .text.func_00460C9C,"ax",%progbits
.balign 4
.global func_00460C9C
.type func_00460C9C, %function
func_00460C9C:
.Lfunc_00460C9C_0:
	add	r0, r0, #20480
.Lfunc_00460C9C_4:
	mov	r1, #0
.Lfunc_00460C9C_8:
	str	r1, [r0, #476]
.Lfunc_00460C9C_c:
	str	r1, [r0, #480]
.Lfunc_00460C9C_10:
	str	r1, [r0, #484]
.Lfunc_00460C9C_14:
	str	r1, [r0, #488]
.Lfunc_00460C9C_18:
	str	r1, [r0, #492]
.Lfunc_00460C9C_1c:
	str	r1, [r0, #496]
.Lfunc_00460C9C_20:
	str	r1, [r0, #500]
.Lfunc_00460C9C_24:
	str	r1, [r0, #504]
.Lfunc_00460C9C_28:
	str	r1, [r0, #508]
.Lfunc_00460C9C_2c:
	str	r1, [r0, #512]
.Lfunc_00460C9C_30:
	bx	lr
.size func_00460C9C, .-func_00460C9C

.section .text.func_0047BEC0,"ax",%progbits
.balign 4
.global func_0047BEC0
.type func_0047BEC0, %function
func_0047BEC0:
.Lfunc_0047BEC0_0:
	ldrsb	r0, [r0, #10]
.Lfunc_0047BEC0_4:
	cmp	r0, #0
.Lfunc_0047BEC0_8:
	cmpne	r0, #1
.Lfunc_0047BEC0_c:
	beq	.Lfunc_0047BEC0_2c
.Lfunc_0047BEC0_10:
	cmp	r0, #2
.Lfunc_0047BEC0_14:
	cmpne	r0, #5
.Lfunc_0047BEC0_18:
	beq	.Lfunc_0047BEC0_2c
.Lfunc_0047BEC0_1c:
	cmp	r0, #6
.Lfunc_0047BEC0_20:
	cmpne	r0, #7
.Lfunc_0047BEC0_24:
	movne	r0, #0
.Lfunc_0047BEC0_28:
	bne	.Lfunc_0047BEC0_30
.Lfunc_0047BEC0_2c:
	mov	r0, #1
.Lfunc_0047BEC0_30:
	bx	lr
.size func_0047BEC0, .-func_0047BEC0

.section .text.func_004BE764,"ax",%progbits
.balign 4
.global func_004BE764
.type func_004BE764, %function
func_004BE764:
.Lfunc_004BE764_0:
	ldr	r1, [r0, #52]
.Lfunc_004BE764_4:
	ldr	r0, [r0, #44]
.Lfunc_004BE764_8:
	mov	r2, #12
.Lfunc_004BE764_c:
	lsl	ip, r0, #28
.Lfunc_004BE764_10:
	lsl	r3, r0, #30
.Lfunc_004BE764_14:
	and	r0, r2, r0, lsr #2
.Lfunc_004BE764_18:
	lsr	r2, ip, #30
.Lfunc_004BE764_1c:
	lsr	r3, r3, #25
.Lfunc_004BE764_20:
	add	r2, r2, r2, lsl #2
.Lfunc_004BE764_24:
	add	r2, r3, r2, lsl #2
.Lfunc_004BE764_28:
	add	r0, r0, r2
.Lfunc_004BE764_2c:
	add	r0, r0, r1
.Lfunc_004BE764_30:
	bx	lr
.size func_004BE764, .-func_004BE764

.section .text.func_0010E14C,"ax",%progbits
.balign 4
.global func_0010E14C
.type func_0010E14C, %function
func_0010E14C:
.Lfunc_0010E14C_0:
	ldrb	r2, [r0, #28]
.Lfunc_0010E14C_4:
	cmp	r2, #0
.Lfunc_0010E14C_8:
	ldreq	r0, [r0, #52]
.Lfunc_0010E14C_c:
	beq	.Lfunc_0010E14C_20
.Lfunc_0010E14C_10:
	ldrb	r2, [r0, #29]
.Lfunc_0010E14C_14:
	cmp	r2, #0
.Lfunc_0010E14C_18:
	ldreq	r0, [r0, #68]
.Lfunc_0010E14C_1c:
	ldrne	r0, [r0, #48]
.Lfunc_0010E14C_20:
	cmp	r1, #2
.Lfunc_0010E14C_24:
	addcc	r0, r0, r1, lsl #4
.Lfunc_0010E14C_28:
	ldr	r0, [r0]
.Lfunc_0010E14C_2c:
	bx	lr
.size func_0010E14C, .-func_0010E14C

.section .text.func_001134A0,"ax",%progbits
.balign 4
.global func_001134A0
.type func_001134A0, %function
func_001134A0:
.Lfunc_001134A0_0:
	ldrb	r2, [r0, #5]
.Lfunc_001134A0_4:
	mov	r1, #0
.Lfunc_001134A0_8:
	str	r1, [r0]
.Lfunc_001134A0_c:
	bic	r2, r2, #3
.Lfunc_001134A0_10:
	strb	r1, [r0, #4]
.Lfunc_001134A0_14:
	mov	ip, #1
.Lfunc_001134A0_18:
	strb	r2, [r0, #5]
.Lfunc_001134A0_1c:
	mvn	r3, #0
.Lfunc_001134A0_20:
	strh	ip, [r0, #6]
.Lfunc_001134A0_24:
	str	r3, [r0, #8]
.Lfunc_001134A0_28:
	strh	r1, [r0, #12]
.Lfunc_001134A0_2c:
	bx	lr
.size func_001134A0, .-func_001134A0

.section .text.func_0014AF14,"ax",%progbits
.balign 4
.global func_0014AF14
.type func_0014AF14, %function
func_0014AF14:
.Lfunc_0014AF14_0:
	mov	r1, #0
.Lfunc_0014AF14_4:
	str	r1, [r0, #12]
.Lfunc_0014AF14_8:
	strb	r1, [r0, #20]
.Lfunc_0014AF14_c:
	strb	r1, [r0, #21]
.Lfunc_0014AF14_10:
	strb	r1, [r0, #22]
.Lfunc_0014AF14_14:
	strb	r1, [r0, #23]
.Lfunc_0014AF14_18:
	strh	r1, [r0, #32]
.Lfunc_0014AF14_1c:
	str	r1, [r0, #88]
.Lfunc_0014AF14_20:
	str	r1, [r0, #92]
.Lfunc_0014AF14_24:
	str	r1, [r0]
.Lfunc_0014AF14_28:
	str	r1, [r0, #4]
.Lfunc_0014AF14_2c:
	bx	lr
.size func_0014AF14, .-func_0014AF14

.section .text.func_00177298,"ax",%progbits
.balign 4
.global func_00177298
.type func_00177298, %function
func_00177298:
.Lfunc_00177298_0:
	push	{r4, lr}
.Lfunc_00177298_4:
	cmp	r1, #6
.Lfunc_00177298_8:
	mov	r4, r0
.Lfunc_00177298_c:
	addcc	r0, r0, r1
.Lfunc_00177298_10:
	ldrbcc	r0, [r0, #4]
.Lfunc_00177298_14:
	bcc	.Lfunc_00177298_2c
.Lfunc_00177298_18:
	mov	r2, #0
.Lfunc_00177298_1c:
	mov	r1, r2
.Lfunc_00177298_20:
	mov	r0, r2
.Lfunc_00177298_24:
	mov	r0, r0
.Lfunc_00177298_28:
	ldrb	r0, [r4, #4]
.Lfunc_00177298_2c:
	pop	{r4, pc}
.size func_00177298, .-func_00177298

.section .text.func_001CBF1C,"ax",%progbits
.balign 4
.global func_001CBF1C
.type func_001CBF1C, %function
func_001CBF1C:
.Lfunc_001CBF1C_0:
	ldr	r2, [r0, #8]
.Lfunc_001CBF1C_4:
	cmp	r2, r1, lsr #5
.Lfunc_001CBF1C_8:
	movls	r0, #0
.Lfunc_001CBF1C_c:
	bls	.Lfunc_001CBF1C_2c
.Lfunc_001CBF1C_10:
	ldr	r0, [r0, #4]
.Lfunc_001CBF1C_14:
	lsr	r2, r1, #5
.Lfunc_001CBF1C_18:
	and	r1, r1, #31
.Lfunc_001CBF1C_1c:
	mov	r3, #1
.Lfunc_001CBF1C_20:
	ldr	r0, [r0, r2, lsl #2]
.Lfunc_001CBF1C_24:
	ands	r0, r0, r3, lsl r1
.Lfunc_001CBF1C_28:
	movne	r0, #1
.Lfunc_001CBF1C_2c:
	bx	lr
.size func_001CBF1C, .-func_001CBF1C

.section .text.func_001F9244,"ax",%progbits
.balign 4
.global func_001F9244
.type func_001F9244, %function
func_001F9244:
.Lfunc_001F9244_0:
	mov	r1, #0
.Lfunc_001F9244_4:
	mvn	r3, #0
.Lfunc_001F9244_8:
	stm	r0, {r1, r3}
.Lfunc_001F9244_c:
	mov	r2, #3
.Lfunc_001F9244_10:
	strb	r1, [r0, #12]
.Lfunc_001F9244_14:
	str	r1, [r0, #148]
.Lfunc_001F9244_18:
	str	r1, [r0, #156]
.Lfunc_001F9244_1c:
	strb	r2, [r0, #160]
.Lfunc_001F9244_20:
	str	r1, [r0, #164]
.Lfunc_001F9244_24:
	str	r1, [r0, #168]
.Lfunc_001F9244_28:
	str	r1, [r0, #188]
.Lfunc_001F9244_2c:
	bx	lr
.size func_001F9244, .-func_001F9244

.section .text.func_002AFFDC,"ax",%progbits
.balign 4
.global func_002AFFDC
.type func_002AFFDC, %function
func_002AFFDC:
.Lfunc_002AFFDC_0:
	mov	r1, #0
.Lfunc_002AFFDC_4:
	str	r1, [r0, #8]
.Lfunc_002AFFDC_8:
	str	r1, [r0, #12]
.Lfunc_002AFFDC_c:
	strh	r1, [r0, #16]
.Lfunc_002AFFDC_10:
	strh	r1, [r0, #18]
.Lfunc_002AFFDC_14:
	mov	r2, #1
.Lfunc_002AFFDC_18:
	str	r1, [r0, #24]
.Lfunc_002AFFDC_1c:
	str	r2, [r0, #20]
.Lfunc_002AFFDC_20:
	str	r1, [r0, #28]
.Lfunc_002AFFDC_24:
	str	r1, [r0, #32]
.Lfunc_002AFFDC_28:
	str	r1, [r0, #4]
.Lfunc_002AFFDC_2c:
	bx	lr
.size func_002AFFDC, .-func_002AFFDC

.section .text.func_00337878,"ax",%progbits
.balign 4
.global func_00337878
.type func_00337878, %function
func_00337878:
.Lfunc_00337878_0:
	ldr	r2, [r0, #60]
.Lfunc_00337878_4:
	mov	ip, #384
.Lfunc_00337878_8:
	bics	ip, ip, r1
.Lfunc_00337878_c:
	bic	r3, r2, #2016
.Lfunc_00337878_10:
	bic	r2, r1, #96
.Lfunc_00337878_14:
	orreq	r2, r2, #64
.Lfunc_00337878_18:
	mov	ip, #576
.Lfunc_00337878_1c:
	bics	r1, ip, r1
.Lfunc_00337878_20:
	orreq	r2, r2, #32
.Lfunc_00337878_24:
	orr	r1, r3, r2
.Lfunc_00337878_28:
	str	r1, [r0, #60]
.Lfunc_00337878_2c:
	bx	lr
.size func_00337878, .-func_00337878

.section .text.func_0034ABEC,"ax",%progbits
.balign 4
.global func_0034ABEC
.type func_0034ABEC, %function
func_0034ABEC:
.Lfunc_0034ABEC_0:
	ldr	r2, [r0, #24]
.Lfunc_0034ABEC_4:
	cmp	r2, #0
.Lfunc_0034ABEC_8:
	mov	r2, #0
.Lfunc_0034ABEC_c:
	bls	.Lfunc_0034ABEC_2c
.Lfunc_0034ABEC_10:
	ldr	r3, [r0, #16]
.Lfunc_0034ABEC_14:
	ldr	r3, [r3, r2, lsl #2]
.Lfunc_0034ABEC_18:
	add	r2, r2, #1
.Lfunc_0034ABEC_1c:
	strb	r1, [r3, #92]
.Lfunc_0034ABEC_20:
	ldr	r3, [r0, #24]
.Lfunc_0034ABEC_24:
	cmp	r3, r2
.Lfunc_0034ABEC_28:
	bhi	.Lfunc_0034ABEC_10
.Lfunc_0034ABEC_2c:
	bx	lr
.size func_0034ABEC, .-func_0034ABEC

.section .text.func_00398928,"ax",%progbits
.balign 4
.global func_00398928
.type func_00398928, %function
func_00398928:
.Lfunc_00398928_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398928_4:
	ldr	r0, [r0, #108]
.Lfunc_00398928_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00398928_c:
	cmp	r2, #0
.Lfunc_00398928_10:
	add	r0, r0, r1, lsl #2
.Lfunc_00398928_14:
	movne	r1, #1
.Lfunc_00398928_18:
	moveq	r1, #0
.Lfunc_00398928_1c:
	strb	r1, [r0, #232]
.Lfunc_00398928_20:
	ldr	r1, [r0, #228]
.Lfunc_00398928_24:
	orr	r1, r1, #1
.Lfunc_00398928_28:
	str	r1, [r0, #228]
.Lfunc_00398928_2c:
	bx	lr
.size func_00398928, .-func_00398928

.section .text.func_00398B2C,"ax",%progbits
.balign 4
.global func_00398B2C
.type func_00398B2C, %function
func_00398B2C:
.Lfunc_00398B2C_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00398B2C_4:
	ldr	r0, [r0, #108]
.Lfunc_00398B2C_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00398B2C_c:
	cmp	r2, #0
.Lfunc_00398B2C_10:
	add	r0, r0, r1, lsl #2
.Lfunc_00398B2C_14:
	movne	r1, #1
.Lfunc_00398B2C_18:
	moveq	r1, #0
.Lfunc_00398B2C_1c:
	strb	r1, [r0, #220]
.Lfunc_00398B2C_20:
	ldr	r1, [r0, #216]
.Lfunc_00398B2C_24:
	orr	r1, r1, #1
.Lfunc_00398B2C_28:
	str	r1, [r0, #216]
.Lfunc_00398B2C_2c:
	bx	lr
.size func_00398B2C, .-func_00398B2C

.section .text.func_00399FC8,"ax",%progbits
.balign 4
.global func_00399FC8
.type func_00399FC8, %function
func_00399FC8:
.Lfunc_00399FC8_0:
	add	ip, r1, r1, lsl #4
.Lfunc_00399FC8_4:
	ldr	r0, [r0, #48]
.Lfunc_00399FC8_8:
	add	r1, r2, r2, lsl #1
.Lfunc_00399FC8_c:
	add	r2, ip, ip, lsl #2
.Lfunc_00399FC8_10:
	add	r0, r0, r2, lsl #2
.Lfunc_00399FC8_14:
	add	r0, r0, #84
.Lfunc_00399FC8_18:
	add	r0, r0, r1, lsl #3
.Lfunc_00399FC8_1c:
	strb	r3, [r0, #151]
.Lfunc_00399FC8_20:
	ldrb	r1, [r0, #148]
.Lfunc_00399FC8_24:
	orr	r1, r1, #1
.Lfunc_00399FC8_28:
	strb	r1, [r0, #148]
.Lfunc_00399FC8_2c:
	bx	lr
.size func_00399FC8, .-func_00399FC8

.section .text.func_003BCE80,"ax",%progbits
.balign 4
.global func_003BCE80
.type func_003BCE80, %function
func_003BCE80:
.Lfunc_003BCE80_0:
	ldr	r1, [r0]
.Lfunc_003BCE80_4:
	cmp	r1, #0
.Lfunc_003BCE80_8:
	ldrne	r2, [r0, #4]
.Lfunc_003BCE80_c:
	strne	r2, [r1, #4]
.Lfunc_003BCE80_10:
	ldr	r1, [r0, #4]
.Lfunc_003BCE80_14:
	cmp	r1, #0
.Lfunc_003BCE80_18:
	ldrne	r2, [r0]
.Lfunc_003BCE80_1c:
	strne	r2, [r1]
.Lfunc_003BCE80_20:
	mov	r1, #0
.Lfunc_003BCE80_24:
	str	r1, [r0, #4]
.Lfunc_003BCE80_28:
	str	r1, [r0]
.Lfunc_003BCE80_2c:
	bx	lr
.size func_003BCE80, .-func_003BCE80

.section .text.func_003FF134,"ax",%progbits
.balign 4
.global func_003FF134
.type func_003FF134, %function
func_003FF134:
.Lfunc_003FF134_0:
	push	{r4, r5, r6, lr}
.Lfunc_003FF134_4:
	mov	r4, r0
.Lfunc_003FF134_8:
	ldr	r0, [r0, #72]
.Lfunc_003FF134_c:
	mov	r5, r1
.Lfunc_003FF134_10:
	cmp	r0, #2000
.Lfunc_003FF134_14:
	beq	.Lfunc_003FF134_28
.Lfunc_003FF134_18:
	mov	r2, #0
.Lfunc_003FF134_1c:
	mov	r1, r2
.Lfunc_003FF134_20:
	mov	r0, r2
.Lfunc_003FF134_24:
	mov	r0, r0
.Lfunc_003FF134_28:
	str	r5, [r4, #72]
.Lfunc_003FF134_2c:
	pop	{r4, r5, r6, pc}
.size func_003FF134, .-func_003FF134

.section .text.func_0044AACC,"ax",%progbits
.balign 4
.global func_0044AACC
.type func_0044AACC, %function
func_0044AACC:
.Lfunc_0044AACC_0:
	push	{r4, lr}
.Lfunc_0044AACC_4:
	mov	r4, r0
.Lfunc_0044AACC_8:
	ldr	r0, [r0, #20]
.Lfunc_0044AACC_c:
	cmp	r0, #0
.Lfunc_0044AACC_10:
	bne	.Lfunc_0044AACC_24
.Lfunc_0044AACC_14:
	mov	r2, #0
.Lfunc_0044AACC_18:
	mov	r1, r2
.Lfunc_0044AACC_1c:
	mov	r0, r2
.Lfunc_0044AACC_20:
	mov	r0, r0
.Lfunc_0044AACC_24:
	ldr	r0, [r4, #20]
.Lfunc_0044AACC_28:
	ldr	r0, [r0, #40]
.Lfunc_0044AACC_2c:
	pop	{r4, pc}
.size func_0044AACC, .-func_0044AACC

.section .text.func_0045A438,"ax",%progbits
.balign 4
.global func_0045A438
.type func_0045A438, %function
func_0045A438:
.Lfunc_0045A438_0:
	vmov	s0, r3
.Lfunc_0045A438_4:
	add	r0, r0, r1, lsl #4
.Lfunc_0045A438_8:
	mov	r1, #0
.Lfunc_0045A438_c:
	strh	r1, [r0, #6]
.Lfunc_0045A438_10:
	strh	r1, [r0, #8]
.Lfunc_0045A438_14:
	strb	r1, [r0, #16]
.Lfunc_0045A438_18:
	vcvt.f32.u32	s0, s0
.Lfunc_0045A438_1c:
	mov	r1, #1
.Lfunc_0045A438_20:
	strh	r2, [r0, #10]
.Lfunc_0045A438_24:
	strb	r1, [r0, #4]!
.Lfunc_0045A438_28:
	vstr	s0, [r0, #8]
.Lfunc_0045A438_2c:
	bx	lr
.size func_0045A438, .-func_0045A438
```

## Implementation handoff

The implementation side must create only
`src/main/arm_runtime_helpers_78.S` from the exact schedule above, record the
implementation source SHA-256 in this specification and the neutral config,
and validate all 24 section bodies,
boundaries, zero-relocation status, canonical schedule hashes, and target report
matches. It must not inspect the ROM, target object, disassembly, report,
symbols, or private analysis artifacts.
