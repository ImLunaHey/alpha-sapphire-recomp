# Probe-verified ARM runtime/helper batch 88

Source SHA-256: `092a40c1c808c2f825b21ae0543e5ac27b4a792d99271b1a1ba77d9ee290db83`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 468 executable body bytes (117
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 468 target bytes with a
zero-byte exact diff.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00417448` | `.text.func_00417448` | 24 | 6 | 0 | 2 | 1 | `func_00417460` |
| `func_004174E0` | `.text.func_004174E0` | 24 | 6 | 0 | 2 | 1 | `func_004174F8` |
| `func_0015EB38` | `.text.func_0015EB38` | 20 | 5 | 0 | 2 | 2 | `func_0015EB4C` |
| `func_0022D37C` | `.text.func_0022D37C` | 20 | 5 | 0 | 2 | 1 | `func_0022D390` |
| `func_0045CCF0` | `.text.func_0045CCF0` | 20 | 5 | 0 | 2 | 1 | `func_0045CD04` |
| `func_0045D09C` | `.text.func_0045D09C` | 20 | 5 | 0 | 1 | 1 | `func_0045D130` |
| `func_00462934` | `.text.func_00462934` | 20 | 5 | 0 | 2 | 1 | `func_0046296C` |
| `func_0046296C` | `.text.func_0046296C` | 20 | 5 | 0 | 2 | 1 | `func_00462A10` |
| `func_00462B58` | `.text.func_00462B58` | 20 | 5 | 0 | 2 | 1 | `func_00462B9C` |
| `func_00463D08` | `.text.func_00463D08` | 20 | 5 | 0 | 2 | 1 | `func_00463D2C` |
| `func_00463D50` | `.text.func_00463D50` | 20 | 5 | 0 | 2 | 1 | `func_00463D84` |
| `func_00466E00` | `.text.func_00466E00` | 20 | 5 | 0 | 2 | 1 | `func_00466E1C` |
| `func_00488360` | `.text.func_00488360` | 20 | 5 | 0 | 1 | 1 | `func_00488724` |
| `func_004AAC8C` | `.text.func_004AAC8C` | 20 | 5 | 0 | 1 | 1 | `func_004AACB4` |
| `func_004AB1DC` | `.text.func_004AB1DC` | 20 | 5 | 0 | 2 | 1 | `func_004AB9A8` |
| `func_004ADEB4` | `.text.func_004ADEB4` | 20 | 5 | 0 | 1 | 1 | `func_004ADFF4` |
| `func_004BCA98` | `.text.func_004BCA98` | 20 | 5 | 0 | 2 | 1 | `func_004BCAAC` |
| `func_004C0748` | `.text.func_004C0748` | 20 | 5 | 0 | 2 | 1 | `func_004C0860` |
| `func_004C7EDC` | `.text.func_004C7EDC` | 20 | 5 | 0 | 1 | 1 | `func_004C7F08` |
| `func_00115A40` | `.text.func_00115A40` | 16 | 4 | 0 | 1 | 1 | `func_00115A50` |
| `func_00136594` | `.text.func_00136594` | 16 | 4 | 0 | 0 | 1 | `func_001365A4` |
| `func_0013CC28` | `.text.func_0013CC28` | 16 | 4 | 0 | 2 | 1 | `func_0013CD30` |
| `func_0013E6E4` | `.text.func_0013E6E4` | 16 | 4 | 0 | 1 | 1 | `func_0013E6F4` |
| `func_0016C080` | `.text.func_0016C080` | 16 | 4 | 0 | 1 | 1 | `func_0016C090` |

Memory-operation counts include scalar, multiple, VFP, and stack transfers.
Returns are excluded from the local-branch count. Totals are 117 instructions,
0 local branches, 25 return sites, and 38 memory operations. There
are no direct branch sites, external transfers, calls, or PC-relative data
accesses. `func_0015EB38` has an early conditional return and a final return;
every other member has one return site.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`5732de6b3ce0afc7e690e3735550dcc09f137df191a8d093e9370e68025d37ac`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`ca494ace610827d157efa60f3f1a140f2a480d0606156a1ecc16ff3bdc5aa944`.
Canonical entries are `name:offset:mnemonic:operands` for instructions and
returns, and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced independently from the bounded
target sections and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 17,678 string
leaves (6,323 distinct strings) in the 225 pre-existing top-level JSON configs.
The audit resolved 6,867 string occurrences (3,248 distinct symbols) through
the neutral inventory and expanded each to its complete symbol interval; none
overlaps a selected interval. The audit includes owners, aliases, branch
destinations, direct-transfer symbols, identity members, next-global
annotations, and secondary-entry identities. The neutral inventory has no
alternate symbol at a selected start and no nested global entry in a selected
interval. Selected intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all
468 selected bytes as unmatched.

## Exact schedules

The following is the complete independently assembled artifact. Preserve every
mnemonic, operand, condition, memory mode, instruction order, section name,
mode, alignment, local label, and boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00417448,"ax",%progbits
.balign 4
.global func_00417448
.type func_00417448, %function
func_00417448:
.Lfunc_00417448_0:
	ldr	r2, [r0, #44]
.Lfunc_00417448_4:
	and	r1, r1, #31
.Lfunc_00417448_8:
	bic	r2, r2, #31
.Lfunc_00417448_c:
	orr	r1, r1, r2
.Lfunc_00417448_10:
	str	r1, [r0, #44]
.Lfunc_00417448_14:
	bx	lr
.size func_00417448, .-func_00417448

.section .text.func_004174E0,"ax",%progbits
.balign 4
.global func_004174E0
.type func_004174E0, %function
func_004174E0:
.Lfunc_004174E0_0:
	ldr	r2, [r0, #40]
.Lfunc_004174E0_4:
	bic	r2, r2, #256
.Lfunc_004174E0_8:
	bic	r2, r2, #254
.Lfunc_004174E0_c:
	orr	r1, r2, r1, lsl #1
.Lfunc_004174E0_10:
	str	r1, [r0, #40]
.Lfunc_004174E0_14:
	bx	lr
.size func_004174E0, .-func_004174E0

.section .text.func_0015EB38,"ax",%progbits
.balign 4
.global func_0015EB38
.type func_0015EB38, %function
func_0015EB38:
.Lfunc_0015EB38_0:
	cmp	r1, r0
.Lfunc_0015EB38_4:
	bxeq	lr
.Lfunc_0015EB38_8:
	vldmia	r1, {s0-s15}
.Lfunc_0015EB38_c:
	vstmia	r0, {s0-s15}
.Lfunc_0015EB38_10:
	bx	lr
.size func_0015EB38, .-func_0015EB38

.section .text.func_0022D37C,"ax",%progbits
.balign 4
.global func_0022D37C
.type func_0022D37C, %function
func_0022D37C:
.Lfunc_0022D37C_0:
	add	r0, r0, #4
.Lfunc_0022D37C_4:
	push	{r4, lr}
.Lfunc_0022D37C_8:
	mov	r0, r0
.Lfunc_0022D37C_c:
	sub	r0, r0, #4
.Lfunc_0022D37C_10:
	pop	{r4, pc}
.size func_0022D37C, .-func_0022D37C

.section .text.func_0045CCF0,"ax",%progbits
.balign 4
.global func_0045CCF0
.type func_0045CCF0, %function
func_0045CCF0:
.Lfunc_0045CCF0_0:
	add	r0, r0, r1
.Lfunc_0045CCF0_4:
	ldrb	r1, [r0, #97]
.Lfunc_0045CCF0_8:
	add	r1, r1, #1
.Lfunc_0045CCF0_c:
	strb	r1, [r0, #97]
.Lfunc_0045CCF0_10:
	bx	lr
.size func_0045CCF0, .-func_0045CCF0

.section .text.func_0045D09C,"ax",%progbits
.balign 4
.global func_0045D09C
.type func_0045D09C, %function
func_0045D09C:
.Lfunc_0045D09C_0:
	ldr	r0, [r0, #492]
.Lfunc_0045D09C_4:
	cmn	r0, #1
.Lfunc_0045D09C_8:
	movne	r0, #1
.Lfunc_0045D09C_c:
	moveq	r0, #0
.Lfunc_0045D09C_10:
	bx	lr
.size func_0045D09C, .-func_0045D09C

.section .text.func_00462934,"ax",%progbits
.balign 4
.global func_00462934
.type func_00462934, %function
func_00462934:
.Lfunc_00462934_0:
	ldr	r2, [r0, #52]
.Lfunc_00462934_4:
	bic	r2, r2, #2048
.Lfunc_00462934_8:
	orr	r1, r2, r1, lsl #11
.Lfunc_00462934_c:
	str	r1, [r0, #52]
.Lfunc_00462934_10:
	bx	lr
.size func_00462934, .-func_00462934

.section .text.func_0046296C,"ax",%progbits
.balign 4
.global func_0046296C
.type func_0046296C, %function
func_0046296C:
.Lfunc_0046296C_0:
	ldr	r2, [r0, #52]
.Lfunc_0046296C_4:
	bic	r2, r2, #1024
.Lfunc_0046296C_8:
	orr	r1, r2, r1, lsl #10
.Lfunc_0046296C_c:
	str	r1, [r0, #52]
.Lfunc_0046296C_10:
	bx	lr
.size func_0046296C, .-func_0046296C

.section .text.func_00462B58,"ax",%progbits
.balign 4
.global func_00462B58
.type func_00462B58, %function
func_00462B58:
.Lfunc_00462B58_0:
	ldr	r2, [r0, #4]
.Lfunc_00462B58_4:
	bic	r2, r2, #131072
.Lfunc_00462B58_8:
	orr	r1, r2, r1, lsl #17
.Lfunc_00462B58_c:
	str	r1, [r0, #4]
.Lfunc_00462B58_10:
	bx	lr
.size func_00462B58, .-func_00462B58

.section .text.func_00463D08,"ax",%progbits
.balign 4
.global func_00463D08
.type func_00463D08, %function
func_00463D08:
.Lfunc_00463D08_0:
	add	r0, r0, r1, lsl #2
.Lfunc_00463D08_4:
	add	r0, r0, #768
.Lfunc_00463D08_8:
	strh	r2, [r0, #104]
.Lfunc_00463D08_c:
	strh	r3, [r0, #106]
.Lfunc_00463D08_10:
	bx	lr
.size func_00463D08, .-func_00463D08

.section .text.func_00463D50,"ax",%progbits
.balign 4
.global func_00463D50
.type func_00463D50, %function
func_00463D50:
.Lfunc_00463D50_0:
	ldrb	r1, [r0, #953]
.Lfunc_00463D50_4:
	cmp	r1, #15
.Lfunc_00463D50_8:
	addcc	r1, r1, #1
.Lfunc_00463D50_c:
	strbcc	r1, [r0, #953]
.Lfunc_00463D50_10:
	bx	lr
.size func_00463D50, .-func_00463D50

.section .text.func_00466E00,"ax",%progbits
.balign 4
.global func_00466E00
.type func_00466E00, %function
func_00466E00:
.Lfunc_00466E00_0:
	ldrb	r2, [r0, #230]
.Lfunc_00466E00_4:
	bic	r2, r2, #1
.Lfunc_00466E00_8:
	orr	r1, r1, r2
.Lfunc_00466E00_c:
	strb	r1, [r0, #230]
.Lfunc_00466E00_10:
	bx	lr
.size func_00466E00, .-func_00466E00

.section .text.func_00488360,"ax",%progbits
.balign 4
.global func_00488360
.type func_00488360, %function
func_00488360:
.Lfunc_00488360_0:
	add	r0, r0, r1, lsl #2
.Lfunc_00488360_4:
	add	r0, r0, #12288
.Lfunc_00488360_8:
	add	r0, r0, #2768
.Lfunc_00488360_c:
	str	r2, [r0]
.Lfunc_00488360_10:
	bx	lr
.size func_00488360, .-func_00488360

.section .text.func_004AAC8C,"ax",%progbits
.balign 4
.global func_004AAC8C
.type func_004AAC8C, %function
func_004AAC8C:
.Lfunc_004AAC8C_0:
	ldr	r0, [r0, #12]
.Lfunc_004AAC8C_4:
	bics	r0, r1, r0
.Lfunc_004AAC8C_8:
	moveq	r0, #1
.Lfunc_004AAC8C_c:
	movne	r0, #0
.Lfunc_004AAC8C_10:
	bx	lr
.size func_004AAC8C, .-func_004AAC8C

.section .text.func_004AB1DC,"ax",%progbits
.balign 4
.global func_004AB1DC
.type func_004AB1DC, %function
func_004AB1DC:
.Lfunc_004AB1DC_0:
	ldr	r1, [r0, #12]
.Lfunc_004AB1DC_4:
	ldr	r0, [r0, #4]
.Lfunc_004AB1DC_8:
	sub	r0, r1, r0
.Lfunc_004AB1DC_c:
	asr	r0, r0, #1
.Lfunc_004AB1DC_10:
	bx	lr
.size func_004AB1DC, .-func_004AB1DC

.section .text.func_004ADEB4,"ax",%progbits
.balign 4
.global func_004ADEB4
.type func_004ADEB4, %function
func_004ADEB4:
.Lfunc_004ADEB4_0:
	ldrh	r0, [r0, #28]
.Lfunc_004ADEB4_4:
	cmp	r0, #64
.Lfunc_004ADEB4_8:
	moveq	r0, #1
.Lfunc_004ADEB4_c:
	movne	r0, #0
.Lfunc_004ADEB4_10:
	bx	lr
.size func_004ADEB4, .-func_004ADEB4

.section .text.func_004BCA98,"ax",%progbits
.balign 4
.global func_004BCA98
.type func_004BCA98, %function
func_004BCA98:
.Lfunc_004BCA98_0:
	ldr	r0, [r0, #12]
.Lfunc_004BCA98_4:
	cmp	r0, #0
.Lfunc_004BCA98_8:
	ldrne	r1, [r0, #8]
.Lfunc_004BCA98_c:
	addne	r0, r0, r1
.Lfunc_004BCA98_10:
	bx	lr
.size func_004BCA98, .-func_004BCA98

.section .text.func_004C0748,"ax",%progbits
.balign 4
.global func_004C0748
.type func_004C0748, %function
func_004C0748:
.Lfunc_004C0748_0:
	ldr	r1, [r0]
.Lfunc_004C0748_4:
	cmp	r1, #0
.Lfunc_004C0748_8:
	ldrbne	r0, [r0, #80]
.Lfunc_004C0748_c:
	moveq	r0, #1
.Lfunc_004C0748_10:
	bx	lr
.size func_004C0748, .-func_004C0748

.section .text.func_004C7EDC,"ax",%progbits
.balign 4
.global func_004C7EDC
.type func_004C7EDC, %function
func_004C7EDC:
.Lfunc_004C7EDC_0:
	cmp	r1, #3
.Lfunc_004C7EDC_4:
	addcc	r0, r0, r1, lsl #2
.Lfunc_004C7EDC_8:
	movcs	r0, #0
.Lfunc_004C7EDC_c:
	ldrcc	r0, [r0, #12]
.Lfunc_004C7EDC_10:
	bx	lr
.size func_004C7EDC, .-func_004C7EDC

.section .text.func_00115A40,"ax",%progbits
.balign 4
.global func_00115A40
.type func_00115A40, %function
func_00115A40:
.Lfunc_00115A40_0:
	add	r0, r0, #215040
.Lfunc_00115A40_4:
	add	r0, r0, #724
.Lfunc_00115A40_8:
	str	r1, [r0]
.Lfunc_00115A40_c:
	bx	lr
.size func_00115A40, .-func_00115A40

.section .text.func_00136594,"ax",%progbits
.balign 4
.global func_00136594
.type func_00136594, %function
func_00136594:
.Lfunc_00136594_0:
	mov	r0, #436
.Lfunc_00136594_4:
	add	r1, r1, #1
.Lfunc_00136594_8:
	mul	r0, r1, r0
.Lfunc_00136594_c:
	bx	lr
.size func_00136594, .-func_00136594

.section .text.func_0013CC28,"ax",%progbits
.balign 4
.global func_0013CC28
.type func_0013CC28, %function
func_0013CC28:
.Lfunc_0013CC28_0:
	mov	r2, #1
.Lfunc_0013CC28_4:
	str	r1, [r0, #192]
.Lfunc_0013CC28_8:
	strb	r2, [r0, #203]
.Lfunc_0013CC28_c:
	bx	lr
.size func_0013CC28, .-func_0013CC28

.section .text.func_0013E6E4,"ax",%progbits
.balign 4
.global func_0013E6E4
.type func_0013E6E4, %function
func_0013E6E4:
.Lfunc_0013E6E4_0:
	ldr	r0, [r0]
.Lfunc_0013E6E4_4:
	lsl	r0, r0, #8
.Lfunc_0013E6E4_8:
	lsr	r0, r0, #24
.Lfunc_0013E6E4_c:
	bx	lr
.size func_0013E6E4, .-func_0013E6E4

.section .text.func_0016C080,"ax",%progbits
.balign 4
.global func_0016C080
.type func_0016C080, %function
func_0016C080:
.Lfunc_0016C080_0:
	ldr	r0, [r0, #72]
.Lfunc_0016C080_4:
	and	r0, r0, #8
.Lfunc_0016C080_8:
	lsr	r0, r0, #3
.Lfunc_0016C080_c:
	bx	lr
.size func_0016C080, .-func_0016C080
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_88.S` without access
to the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation must export exactly the twenty-four named functions in their
owned executable sections, produce no relocations or adjacent data, and match
all sizes and schedules above. The implementation source SHA-256 is recorded
above and in the neutral config.
