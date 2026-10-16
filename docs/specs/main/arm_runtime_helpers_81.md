# Probe-verified ARM runtime/helper batch 81

Source SHA-256: `11c6e6e1a3bcb1c9d60892ff54e22c37a2e9c391d092f989d1dc69e325e707da`

## Scope and provenance

This clean-room specification covers twenty-four currently unmatched ARM-state,
call-free helpers totaling 820 executable body bytes (205 instructions).
Evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and an
independently assembled exact-schedule probe. The target is revision
`AS_EUR_REV2`; the probe used GNU Arm binutils 2.44 in ARMv6K/VFPv2 mode on
2026-10-16. Selection excluded every function name occurring anywhere in the
206 pre-existing JSON configs, including runtime batch 80, duplicate-template
batch 77, and IPC batch 74. It also excluded all configured branch destinations,
direct-transfer symbols, aliases, owners, and secondary-entry identities.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Each body is byte-unique in the complete
10,440-function target section inventory, so no member belongs to an
exact-duplicate family. The authoritative report records zero-percent matches
for all twenty-four selected names and accounts for exactly 820 selected bytes.
Private inspection artifacts used for selection are ignored and are not part of
this specification. Independent assembly comparison matched all twenty-four
complete target bodies (820 bytes / 205 instructions).

## Structural and boundary inventory

| Function | Section | Mode | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_003997E4` | `.text.func_003997E4` | ARM | 36 | 9 | 0 | 2 | 1 | `func_00399808` |
| `func_00399920` | `.text.func_00399920` | ARM | 36 | 9 | 0 | 2 | 1 | `func_00399944` |
| `func_003C15C4` | `.text.func_003C15C4` | ARM | 36 | 9 | 2 | 4 | 1 | `func_003C15E8` |
| `func_0040B068` | `.text.func_0040B068` | ARM | 36 | 9 | 0 | 2 | 1 | `func_0040B0DC` |
| `func_00410A48` | `.text.func_00410A48` | ARM | 36 | 9 | 0 | 3 | 1 | `func_00410A6C` |
| `func_00410C24` | `.text.func_00410C24` | ARM | 36 | 9 | 0 | 5 | 1 | `func_00410C48` |
| `func_004176B0` | `.text.func_004176B0` | ARM | 36 | 9 | 0 | 4 | 1 | `func_00417B84` |
| `func_0042566C` | `.text.func_0042566C` | ARM | 36 | 9 | 0 | 8 | 1 | `func_00425690` |
| `func_00425690` | `.text.func_00425690` | ARM | 36 | 9 | 0 | 7 | 1 | `func_00425AC4` |
| `func_00430238` | `.text.func_00430238` | ARM | 36 | 9 | 1 | 3 | 1 | `func_0043025C` |
| `func_0043D440` | `.text.func_0043D440` | ARM | 36 | 9 | 2 | 3 | 1 | `func_0043D504` |
| `func_00464770` | `.text.func_00464770` | ARM | 36 | 9 | 0 | 3 | 1 | `func_004647A8` |
| `func_00464C14` | `.text.func_00464C14` | ARM | 36 | 9 | 0 | 3 | 1 | `func_00464CC4` |
| `func_0010BD24` | `.text.func_0010BD24` | ARM | 32 | 8 | 1 | 2 | 1 | `func_0010BD44` |
| `func_00112B0C` | `.text.func_00112B0C` | ARM | 32 | 8 | 0 | 4 | 1 | `func_00112B2C` |
| `func_00113D20` | `.text.func_00113D20` | ARM | 32 | 8 | 0 | 5 | 1 | `func_00113D40` |
| `func_00115A20` | `.text.func_00115A20` | ARM | 32 | 8 | 0 | 5 | 1 | `func_00115A40` |
| `func_00139414` | `.text.func_00139414` | ARM | 32 | 8 | 1 | 4 | 1 | `func_00139448` |
| `func_001783B8` | `.text.func_001783B8` | ARM | 32 | 8 | 0 | 2 | 1 | `func_0017850C` |
| `func_0018749C` | `.text.func_0018749C` | ARM | 32 | 8 | 0 | 5 | 1 | `func_001874BC` |
| `func_001C4934` | `.text.func_001C4934` | ARM | 32 | 8 | 0 | 4 | 1 | `func_001C4954` |
| `func_001FA404` | `.text.func_001FA404` | ARM | 32 | 8 | 0 | 0 | 1 | `func_001FA424` |
| `func_002537A8` | `.text.func_002537A8` | ARM | 32 | 8 | 1 | 3 | 1 | `func_002538D0` |
| `func_002B7F84` | `.text.func_002B7F84` | ARM | 32 | 8 | 0 | 4 | 1 | `func_002B7FA4` |

Memory-operation counts include scalar loads/stores, VFP transfers, and stack
transfers. Return transfers are excluded from the local-branch column. The
per-function counts total 8 direct function-local B-family sites, all
conditional, 24 separately validated return transfers, and 87 memory
operations. There are no unconditional local branches.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`554c8432b1bb7fbbc5825d2dff5b22603be9a0fe233debf0c60fb74e31b573f0`. The canonical direct-branch schedule SHA-256 is
`172dbb4273c55ac3b13d05b1176703eae08e3bb26f331d228070b0e5e4ab8860`. The canonical return-transfer schedule SHA-256 is
`d8005464a744f8dab787f10a214a0062a8bb33b92d1e0006be3298ea64d68b53`. All three digests were independently reproduced from the
bounded target sections and from the assembled exact-schedule probe. Canonical
entries use `name:offset:mnemonic:operands` for the full schedule,
`name:offset:mnemonic:target` for direct branches, and
`name:offset:mnemonic:operands` for returns, joined by newlines without a
terminal newline. Offsets and direct targets are lowercase hexadecimal without
an `0x` prefix.

The “next global” column is a boundary cross-check from the neutral symbol
inventory; it does not assert that the next global is address-contiguous. Each
owned section ends exactly at its stated body size. Intervening unowned bytes,
where present, are outside this batch, and every function has a zero-byte
adjacent-data schedule.

## Uniqueness, collision, and reference audit

The twenty-four exported names are pairwise distinct and absent from all 15,002
string leaves (5,339 distinct strings) in the 206 pre-existing JSON configs. A
recursive audit resolved 2,813 configured strings to neutral symbols and checked
their full address intervals; none overlaps a selected interval. The same audit
covered function owners, branch destinations, direct-transfer symbols, identity
class members, aliases, next-global annotations, and secondary-entry relations.
The neutral inventory contains no alternate symbol at any selected start
address, and selected intervals are pairwise disjoint.

All selected report entries are present at zero percent, so none is already
source-owned by the current build. Hashing each complete symbol-bounded body
against all 10,440 target function sections produced multiplicity one for every
selected body. A section-scoped relocation audit found no relocation for any
selected function.

## Exact schedules

The following is the complete independently assembled artifact. Local labels may
be renamed consistently. Preserve every mnemonic, operand, condition, memory
mode, instruction order, section name, mode, alignment, and function boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003997E4,"ax",%progbits
.balign 4
.global func_003997E4
.type func_003997E4, %function
func_003997E4:
.Lfunc_003997E4_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_003997E4_4:
	ldr	r0, [r0, #108]
.Lfunc_003997E4_8:
	add	r1, r1, r1, lsl #1
.Lfunc_003997E4_c:
	add	r2, r2, r2, lsl #3
.Lfunc_003997E4_10:
	add	r0, r0, r1, lsl #2
.Lfunc_003997E4_14:
	add	r0, r0, r2, lsl #2
.Lfunc_003997E4_18:
	add	r0, r0, r3, lsl #3
.Lfunc_003997E4_1c:
	ldrb	r0, [r0, #15]
.Lfunc_003997E4_20:
	bx	lr
.size func_003997E4, .-func_003997E4

.section .text.func_00399920,"ax",%progbits
.balign 4
.global func_00399920
.type func_00399920, %function
func_00399920:
.Lfunc_00399920_0:
	rsb	r1, r1, r1, lsl #5
.Lfunc_00399920_4:
	ldr	r0, [r0, #108]
.Lfunc_00399920_8:
	add	r1, r1, r1, lsl #1
.Lfunc_00399920_c:
	add	r2, r2, r2, lsl #3
.Lfunc_00399920_10:
	add	r0, r0, r1, lsl #2
.Lfunc_00399920_14:
	add	r0, r0, r2, lsl #2
.Lfunc_00399920_18:
	add	r0, r0, r3, lsl #3
.Lfunc_00399920_1c:
	ldrb	r0, [r0, #13]
.Lfunc_00399920_20:
	bx	lr
.size func_00399920, .-func_00399920

.section .text.func_003C15C4,"ax",%progbits
.balign 4
.global func_003C15C4
.type func_003C15C4, %function
func_003C15C4:
.Lfunc_003C15C4_0:
	vstr	s0, [r0, #32]
.Lfunc_003C15C4_4:
	ldr	r0, [r0, #224]
.Lfunc_003C15C4_8:
	cmp	r0, #0
.Lfunc_003C15C4_c:
	beq	.Lfunc_003C15C4_20
.Lfunc_003C15C4_10:
	vstr	s0, [r0, #32]
.Lfunc_003C15C4_14:
	ldr	r0, [r0, #192]
.Lfunc_003C15C4_18:
	cmp	r0, #0
.Lfunc_003C15C4_1c:
	bne	.Lfunc_003C15C4_10
.Lfunc_003C15C4_20:
	bx	lr
.size func_003C15C4, .-func_003C15C4

.section .text.func_0040B068,"ax",%progbits
.balign 4
.global func_0040B068
.type func_0040B068, %function
func_0040B068:
.Lfunc_0040B068_0:
	add	r0, r0, #56
.Lfunc_0040B068_4:
	mov	r0, r0
.Lfunc_0040B068_8:
	ldr	r2, [r0, #48]
.Lfunc_0040B068_c:
	mov	r3, #3968
.Lfunc_0040B068_10:
	and	r1, r3, r1, lsl #7
.Lfunc_0040B068_14:
	bic	r2, r2, #3968
.Lfunc_0040B068_18:
	orr	r1, r1, r2
.Lfunc_0040B068_1c:
	str	r1, [r0, #48]
.Lfunc_0040B068_20:
	bx	lr
.size func_0040B068, .-func_0040B068

.section .text.func_00410A48,"ax",%progbits
.balign 4
.global func_00410A48
.type func_00410A48, %function
func_00410A48:
.Lfunc_00410A48_0:
	mov	r3, #1
.Lfunc_00410A48_4:
	lsl	r3, r3, r1
.Lfunc_00410A48_8:
	add	r0, r0, #56
.Lfunc_00410A48_c:
	add	r1, r0, r1, lsl #2
.Lfunc_00410A48_10:
	str	r2, [r1, #24]
.Lfunc_00410A48_14:
	ldrh	r1, [r0, #22]
.Lfunc_00410A48_18:
	orr	r1, r1, r3
.Lfunc_00410A48_1c:
	strh	r1, [r0, #22]
.Lfunc_00410A48_20:
	bx	lr
.size func_00410A48, .-func_00410A48

.section .text.func_00410C24,"ax",%progbits
.balign 4
.global func_00410C24
.type func_00410C24, %function
func_00410C24:
.Lfunc_00410C24_0:
	push	{r4}
.Lfunc_00410C24_4:
	ldrb	r3, [r0, #15]
.Lfunc_00410C24_8:
	mov	r4, #1
.Lfunc_00410C24_c:
	add	ip, r0, r1, lsl #2
.Lfunc_00410C24_10:
	orr	r1, r3, r4, lsl r1
.Lfunc_00410C24_14:
	strb	r1, [r0, #15]
.Lfunc_00410C24_18:
	str	r2, [ip, #16]
.Lfunc_00410C24_1c:
	pop	{r4}
.Lfunc_00410C24_20:
	bx	lr
.size func_00410C24, .-func_00410C24

.section .text.func_004176B0,"ax",%progbits
.balign 4
.global func_004176B0
.type func_004176B0, %function
func_004176B0:
.Lfunc_004176B0_0:
	ldrh	r2, [r0]
.Lfunc_004176B0_4:
	mov	r1, #0
.Lfunc_004176B0_8:
	strh	r1, [r0, #2]
.Lfunc_004176B0_c:
	add	r2, r2, #1
.Lfunc_004176B0_10:
	uxth	r2, r2
.Lfunc_004176B0_14:
	cmp	r2, #900
.Lfunc_004176B0_18:
	strh	r2, [r0]
.Lfunc_004176B0_1c:
	strhcs	r1, [r0]
.Lfunc_004176B0_20:
	bx	lr
.size func_004176B0, .-func_004176B0

.section .text.func_0042566C,"ax",%progbits
.balign 4
.global func_0042566C
.type func_0042566C, %function
func_0042566C:
.Lfunc_0042566C_0:
	ldr	r2, [r1]
.Lfunc_0042566C_4:
	str	r2, [r0]
.Lfunc_0042566C_8:
	ldr	r2, [r1, #4]
.Lfunc_0042566C_c:
	str	r2, [r0, #4]
.Lfunc_0042566C_10:
	ldr	r2, [r1, #8]
.Lfunc_0042566C_14:
	str	r2, [r0, #8]
.Lfunc_0042566C_18:
	ldr	r1, [r1, #12]
.Lfunc_0042566C_1c:
	str	r1, [r0, #12]
.Lfunc_0042566C_20:
	bx	lr
.size func_0042566C, .-func_0042566C

.section .text.func_00425690,"ax",%progbits
.balign 4
.global func_00425690
.type func_00425690, %function
func_00425690:
.Lfunc_00425690_0:
	push	{r4}
.Lfunc_00425690_4:
	mov	r4, #0
.Lfunc_00425690_8:
	vldr	s0, [sp, #4]
.Lfunc_00425690_c:
	str	r4, [r0, #16]
.Lfunc_00425690_10:
	str	r4, [r0, #20]
.Lfunc_00425690_14:
	stm	r0, {r1, r2, r3}
.Lfunc_00425690_18:
	vstr	s0, [r0, #12]
.Lfunc_00425690_1c:
	pop	{r4}
.Lfunc_00425690_20:
	bx	lr
.size func_00425690, .-func_00425690

.section .text.func_00430238,"ax",%progbits
.balign 4
.global func_00430238
.type func_00430238, %function
func_00430238:
.Lfunc_00430238_0:
	ldrb	r1, [r0, #131]
.Lfunc_00430238_4:
	cmp	r1, #0
.Lfunc_00430238_8:
	bne	.Lfunc_00430238_1c
.Lfunc_00430238_c:
	mov	r2, #1
.Lfunc_00430238_10:
	mov	r1, #7
.Lfunc_00430238_14:
	strb	r2, [r0, #131]
.Lfunc_00430238_18:
	str	r1, [r0, #120]
.Lfunc_00430238_1c:
	mov	r0, #1
.Lfunc_00430238_20:
	bx	lr
.size func_00430238, .-func_00430238

.section .text.func_0043D440,"ax",%progbits
.balign 4
.global func_0043D440
.type func_0043D440, %function
func_0043D440:
.Lfunc_0043D440_0:
	ldr	r1, [r0]
.Lfunc_0043D440_4:
	cmp	r1, #0
.Lfunc_0043D440_8:
	bne	.Lfunc_0043D440_1c
.Lfunc_0043D440_c:
	ldr	r1, [r0, #8]
.Lfunc_0043D440_10:
	ldr	r0, [r0, #12]
.Lfunc_0043D440_14:
	orrs	r0, r0, r1
.Lfunc_0043D440_18:
	beq	.Lfunc_0043D440_20
.Lfunc_0043D440_1c:
	mov	r0, #1
.Lfunc_0043D440_20:
	bx	lr
.size func_0043D440, .-func_0043D440

.section .text.func_00464770,"ax",%progbits
.balign 4
.global func_00464770
.type func_00464770, %function
func_00464770:
.Lfunc_00464770_0:
	ldr	r2, [r0, #48]
.Lfunc_00464770_4:
	cmp	r2, #1440
.Lfunc_00464770_8:
	movhi	r2, #1440
.Lfunc_00464770_c:
	cmp	r2, r1
.Lfunc_00464770_10:
	movcc	r1, #0
.Lfunc_00464770_14:
	subcs	r1, r2, r1
.Lfunc_00464770_18:
	str	r2, [r0, #48]
.Lfunc_00464770_1c:
	str	r1, [r0, #48]
.Lfunc_00464770_20:
	bx	lr
.size func_00464770, .-func_00464770

.section .text.func_00464C14,"ax",%progbits
.balign 4
.global func_00464C14
.type func_00464C14, %function
func_00464C14:
.Lfunc_00464C14_0:
	ldr	r3, [r0, #72]
.Lfunc_00464C14_4:
	ldr	r2, [r0, #76]
.Lfunc_00464C14_8:
	lsl	r1, r1, #3
.Lfunc_00464C14_c:
	and	r1, r1, #8
.Lfunc_00464C14_10:
	bic	r3, r3, #8
.Lfunc_00464C14_14:
	add	r0, r0, #72
.Lfunc_00464C14_18:
	orr	r1, r1, r3
.Lfunc_00464C14_1c:
	stm	r0, {r1, r2}
.Lfunc_00464C14_20:
	bx	lr
.size func_00464C14, .-func_00464C14

.section .text.func_0010BD24,"ax",%progbits
.balign 4
.global func_0010BD24
.type func_0010BD24, %function
func_0010BD24:
.Lfunc_0010BD24_0:
	ldr	r0, [r0, #12]
.Lfunc_0010BD24_4:
	cmp	r0, #0
.Lfunc_0010BD24_8:
	beq	.Lfunc_0010BD24_1c
.Lfunc_0010BD24_c:
	ldr	r0, [r0, #4]
.Lfunc_0010BD24_10:
	cmn	r0, #1
.Lfunc_0010BD24_14:
	movne	r0, #1
.Lfunc_0010BD24_18:
	moveq	r0, #0
.Lfunc_0010BD24_1c:
	bx	lr
.size func_0010BD24, .-func_0010BD24

.section .text.func_00112B0C,"ax",%progbits
.balign 4
.global func_00112B0C
.type func_00112B0C, %function
func_00112B0C:
.Lfunc_00112B0C_0:
	ldrb	r1, [r0, #2]
.Lfunc_00112B0C_4:
	mvn	r3, #0
.Lfunc_00112B0C_8:
	mov	r2, #0
.Lfunc_00112B0C_c:
	strh	r3, [r0]
.Lfunc_00112B0C_10:
	bic	r1, r1, #15
.Lfunc_00112B0C_14:
	strb	r2, [r0, #3]
.Lfunc_00112B0C_18:
	strb	r1, [r0, #2]
.Lfunc_00112B0C_1c:
	bx	lr
.size func_00112B0C, .-func_00112B0C

.section .text.func_00113D20,"ax",%progbits
.balign 4
.global func_00113D20
.type func_00113D20, %function
func_00113D20:
.Lfunc_00113D20_0:
	add	r1, r0, #20480
.Lfunc_00113D20_4:
	mov	r3, #0
.Lfunc_00113D20_8:
	str	r3, [r1, #688]
.Lfunc_00113D20_c:
	str	r3, [r1, #700]
.Lfunc_00113D20_10:
	str	r3, [r1, #704]
.Lfunc_00113D20_14:
	str	r3, [r1, #708]
.Lfunc_00113D20_18:
	strb	r3, [r1, #712]
.Lfunc_00113D20_1c:
	bx	lr
.size func_00113D20, .-func_00113D20

.section .text.func_00115A20,"ax",%progbits
.balign 4
.global func_00115A20
.type func_00115A20, %function
func_00115A20:
.Lfunc_00115A20_0:
	mov	r1, #0
.Lfunc_00115A20_4:
	mvn	r2, #0
.Lfunc_00115A20_8:
	str	r1, [r0, #4]
.Lfunc_00115A20_c:
	str	r2, [r0]
.Lfunc_00115A20_10:
	str	r1, [r0, #8]
.Lfunc_00115A20_14:
	str	r1, [r0, #12]
.Lfunc_00115A20_18:
	str	r1, [r0, #16]
.Lfunc_00115A20_1c:
	bx	lr
.size func_00115A20, .-func_00115A20

.section .text.func_00139414,"ax",%progbits
.balign 4
.global func_00139414
.type func_00139414, %function
func_00139414:
.Lfunc_00139414_0:
	ldrsb	r1, [r0, #12]
.Lfunc_00139414_4:
	cmp	r1, #0
.Lfunc_00139414_8:
	beq	.Lfunc_00139414_1c
.Lfunc_00139414_c:
	ldr	r2, [r0, #4]
.Lfunc_00139414_10:
	mov	r1, #0
.Lfunc_00139414_14:
	strh	r1, [r2]
.Lfunc_00139414_18:
	strh	r1, [r0, #10]
.Lfunc_00139414_1c:
	bx	lr
.size func_00139414, .-func_00139414

.section .text.func_001783B8,"ax",%progbits
.balign 4
.global func_001783B8
.type func_001783B8, %function
func_001783B8:
.Lfunc_001783B8_0:
	ldrh	r3, [r0, #54]
.Lfunc_001783B8_4:
	add	r2, r0, #36
.Lfunc_001783B8_8:
	and	r1, r1, #1
.Lfunc_001783B8_c:
	and	r0, r3, #1
.Lfunc_001783B8_10:
	bic	r3, r3, #1
.Lfunc_001783B8_14:
	orr	r1, r1, r3
.Lfunc_001783B8_18:
	strh	r1, [r2, #18]
.Lfunc_001783B8_1c:
	bx	lr
.size func_001783B8, .-func_001783B8

.section .text.func_0018749C,"ax",%progbits
.balign 4
.global func_0018749C
.type func_0018749C, %function
func_0018749C:
.Lfunc_0018749C_0:
	vstr	s0, [r0, #100]
.Lfunc_0018749C_4:
	ldr	r0, [r0, #104]
.Lfunc_0018749C_8:
	mov	r0, r0
.Lfunc_0018749C_c:
	ldrh	r1, [r0, #108]
.Lfunc_0018749C_10:
	vstr	s0, [r0, #104]
.Lfunc_0018749C_14:
	orr	r1, r1, #1
.Lfunc_0018749C_18:
	strh	r1, [r0, #108]
.Lfunc_0018749C_1c:
	bx	lr
.size func_0018749C, .-func_0018749C

.section .text.func_001C4934,"ax",%progbits
.balign 4
.global func_001C4934
.type func_001C4934, %function
func_001C4934:
.Lfunc_001C4934_0:
	cmp	r1, #0
.Lfunc_001C4934_4:
	ldrne	r3, [r0, #144]
.Lfunc_001C4934_8:
	strne	r3, [r1]
.Lfunc_001C4934_c:
	ldr	r1, [r0, #144]
.Lfunc_001C4934_10:
	eor	r1, r1, r2
.Lfunc_001C4934_14:
	str	r1, [r0, #144]
.Lfunc_001C4934_18:
	mov	r0, #0
.Lfunc_001C4934_1c:
	bx	lr
.size func_001C4934, .-func_001C4934

.section .text.func_001FA404,"ax",%progbits
.balign 4
.global func_001FA404
.type func_001FA404, %function
func_001FA404:
.Lfunc_001FA404_0:
	add	r2, r0, #4
.Lfunc_001FA404_4:
	tst	r2, #15
.Lfunc_001FA404_8:
	mov	r1, #0
.Lfunc_001FA404_c:
	andne	r1, r2, #15
.Lfunc_001FA404_10:
	rsbne	r1, r1, #16
.Lfunc_001FA404_14:
	add	r0, r0, r1
.Lfunc_001FA404_18:
	add	r0, r0, #52
.Lfunc_001FA404_1c:
	bx	lr
.size func_001FA404, .-func_001FA404

.section .text.func_002537A8,"ax",%progbits
.balign 4
.global func_002537A8
.type func_002537A8, %function
func_002537A8:
.Lfunc_002537A8_0:
	ldrb	r2, [r0, #117]
.Lfunc_002537A8_4:
	cmp	r2, #0
.Lfunc_002537A8_8:
	beq	.Lfunc_002537A8_1c
.Lfunc_002537A8_c:
	add	r1, r1, #4
.Lfunc_002537A8_10:
	add	r0, r0, #44
.Lfunc_002537A8_14:
	vldmia	r1, {s0-s6}
.Lfunc_002537A8_18:
	vstmia	r0, {s0-s6}
.Lfunc_002537A8_1c:
	bx	lr
.size func_002537A8, .-func_002537A8

.section .text.func_002B7F84,"ax",%progbits
.balign 4
.global func_002B7F84
.type func_002B7F84, %function
func_002B7F84:
.Lfunc_002B7F84_0:
	mov	r3, #0
.Lfunc_002B7F84_4:
	str	r3, [r0, #8]
.Lfunc_002B7F84_8:
	add	r3, r0, #12
.Lfunc_002B7F84_c:
	str	r0, [r0]
.Lfunc_002B7F84_10:
	stm	r3, {r1, r2}
.Lfunc_002B7F84_14:
	add	r3, r0, #4
.Lfunc_002B7F84_18:
	stm	r3, {r0, r2}
.Lfunc_002B7F84_1c:
	bx	lr
.size func_002B7F84, .-func_002B7F84
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_81.S` without access
to the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation must export exactly the twenty-four named functions in their
owned executable sections, produce no relocations or adjacent data, and match
the sizes and schedules above. After implementation, replace the source-hash
placeholder in this specification and the neutral config with the implementation
source SHA-256.
