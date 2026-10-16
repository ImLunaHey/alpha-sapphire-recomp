# Probe-verified ARM runtime/helper batch 83

Source SHA-256: `4605739aac9068ef98fcf9467f5a629e72296f24de7a7b8d5af0d232d7e3671d`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 672 executable body bytes (168
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.44 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 672 target bytes with a
zero-byte exact diff. The implementation source does not yet exist, so its hash
is intentionally `PENDING`.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0010A8C0` | `.text.func_0010A8C0` | 28 | 7 | 1 | 1 | 1 | `func_0010A8DC` |
| `func_0013A16C` | `.text.func_0013A16C` | 28 | 7 | 1 | 3 | 1 | `func_0013A188` |
| `func_0013F378` | `.text.func_0013F378` | 28 | 7 | 0 | 2 | 1 | `func_0013F394` |
| `func_0014D99C` | `.text.func_0014D99C` | 28 | 7 | 1 | 3 | 1 | `func_0014D9B8` |
| `func_0014D9B8` | `.text.func_0014D9B8` | 28 | 7 | 1 | 3 | 1 | `func_0014D9D4` |
| `func_0014E008` | `.text.func_0014E008` | 28 | 7 | 1 | 2 | 1 | `func_0014E024` |
| `func_00152EEC` | `.text.func_00152EEC` | 28 | 7 | 1 | 3 | 1 | `func_00152F08` |
| `func_00163F38` | `.text.func_00163F38` | 28 | 7 | 0 | 6 | 1 | `func_00163F54` |
| `func_00169C0C` | `.text.func_00169C0C` | 28 | 7 | 2 | 0 | 1 | `func_00169CBC` |
| `func_001765F4` | `.text.func_001765F4` | 28 | 7 | 1 | 2 | 1 | `func_00176610` |
| `func_0019B7B8` | `.text.func_0019B7B8` | 28 | 7 | 0 | 5 | 1 | `func_0019B968` |
| `func_0019B968` | `.text.func_0019B968` | 28 | 7 | 0 | 5 | 1 | `func_0019BB18` |
| `func_0019BB18` | `.text.func_0019BB18` | 28 | 7 | 0 | 5 | 1 | `func_0019BCC8` |
| `func_001CBF00` | `.text.func_001CBF00` | 28 | 7 | 0 | 5 | 1 | `func_001CBF1C` |
| `func_001E7A2C` | `.text.func_001E7A2C` | 28 | 7 | 0 | 3 | 1 | `func_001E7A48` |
| `func_001E7A84` | `.text.func_001E7A84` | 28 | 7 | 0 | 3 | 1 | `func_001E7ABC` |
| `func_001F975C` | `.text.func_001F975C` | 28 | 7 | 0 | 5 | 1 | `func_001F9778` |
| `func_00200780` | `.text.func_00200780` | 28 | 7 | 0 | 5 | 1 | `func_0020079C` |
| `func_00269138` | `.text.func_00269138` | 28 | 7 | 0 | 2 | 1 | `func_002691DC` |
| `func_00279DB4` | `.text.func_00279DB4` | 28 | 7 | 0 | 2 | 1 | `func_00279DD0` |
| `func_002BB230` | `.text.func_002BB230` | 28 | 7 | 0 | 2 | 1 | `func_002BB2A8` |
| `func_002BE1BC` | `.text.func_002BE1BC` | 28 | 7 | 0 | 4 | 1 | `func_002BE208` |
| `func_00337ED4` | `.text.func_00337ED4` | 28 | 7 | 0 | 5 | 1 | `func_00337EF0` |
| `func_0036B530` | `.text.func_0036B530` | 28 | 7 | 0 | 5 | 1 | `func_0036B54C` |

Memory-operation counts include scalar and VFP loads/stores and multiple
transfers. Returns are excluded from the local-branch count. Totals are 168
instructions, 9 conditional function-local branches, 24 `bx lr` returns, and
81 memory operations. There are no unconditional branches.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`c41dd06cf0bf0a4a284b7f34513e2c62e9c2cc83f24696a4f5703345b96e02f5`.
The canonical direct-branch schedule SHA-256 is
`7d88e228bc5f563d2640f26a2d86937003c8624fbd6f1393dcc0135fd3221d05`.
The canonical return-transfer schedule SHA-256 is
`2a25c82d5b243a55da47748a2db72fce47fb8b81883586bae6e4b55d237d2e15`.
Canonical entries are `name:offset:mnemonic:operands` for the full and return
schedules and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets and branch targets are lowercase
hexadecimal without an `0x` prefix. All three hashes were reproduced from the
bounded target sections and the independent probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at byte 28 and
has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 15,796 string
leaves (5,631 distinct strings) in the 212 pre-existing JSON configs. The audit
resolved 6,213 string occurrences (2,986 distinct symbols) through the neutral
inventory and expanded each to its complete symbol interval; none overlaps a
selected interval. The audit includes owners, aliases, branch destinations,
direct-transfer symbols, identity members, next-global annotations, and
secondary-entry identities. The neutral inventory has no alternate symbol at a
selected start and no nested global entry in a selected interval. Selected
intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the 24 selected bodies are therefore
also pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 672
selected bytes as unmatched.

## Exact schedules

The following is the complete independently assembled artifact. Local labels
may be renamed consistently. Preserve every mnemonic, operand, condition,
memory mode, instruction order, section name, mode, alignment, and boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0010A8C0,"ax",%progbits
.balign 4
.global func_0010A8C0
.type func_0010A8C0, %function
func_0010A8C0:
	cmp	r1, #2
	bcs	.L0010A8C0_18
	add	r1, r1, r1, lsl #1
	add	r0, r0, r1, lsl #3
	add	r0, r0, #304
	vstmia	r0, {s0-s3}
.L0010A8C0_18:
	bx	lr
.size func_0010A8C0, .-func_0010A8C0

.section .text.func_0013A16C,"ax",%progbits
.balign 4
.global func_0013A16C
.type func_0013A16C, %function
func_0013A16C:
	ldr	r1, [r0, #64]
	cmp	r1, #0
	beq	.L0013A16C_18
	mov	r2, #0
	str	r2, [r1, #444]
	str	r2, [r0, #64]
.L0013A16C_18:
	bx	lr
.size func_0013A16C, .-func_0013A16C

.section .text.func_0013F378,"ax",%progbits
.balign 4
.global func_0013F378
.type func_0013F378, %function
func_0013F378:
	ldrb	r1, [r0, #9]
	cmp	r1, #0
	ldrbne	r0, [r0, #11]
	cmpne	r0, #0
	moveq	r0, #0
	movne	r0, #1
	bx	lr
.size func_0013F378, .-func_0013F378

.section .text.func_0014D99C,"ax",%progbits
.balign 4
.global func_0014D99C
.type func_0014D99C, %function
func_0014D99C:
	ldr	r0, [r0, #76]
	cmp	r0, #0
	ldrne	r0, [r0, #16]
	cmpne	r0, #0
	vstrne	s0, [r0, #60]
	beq	.L0014D99C_18
.L0014D99C_18:
	bx	lr
.size func_0014D99C, .-func_0014D99C

.section .text.func_0014D9B8,"ax",%progbits
.balign 4
.global func_0014D9B8
.type func_0014D9B8, %function
func_0014D9B8:
	ldr	r0, [r0, #76]
	cmp	r0, #0
	ldrne	r0, [r0, #16]
	cmpne	r0, #0
	vstrne	s0, [r0, #64]
	beq	.L0014D9B8_18
.L0014D9B8_18:
	bx	lr
.size func_0014D9B8, .-func_0014D9B8

.section .text.func_0014E008,"ax",%progbits
.balign 4
.global func_0014E008
.type func_0014E008, %function
func_0014E008:
	ldrh	r1, [r0]
	cmp	r1, #16
	bne	.L0014E008_18
	ldrh	r1, [r0, #2]
	add	r1, r1, #2
	add	r0, r0, r1, lsl #1
.L0014E008_18:
	bx	lr
.size func_0014E008, .-func_0014E008

.section .text.func_00152EEC,"ax",%progbits
.balign 4
.global func_00152EEC
.type func_00152EEC, %function
func_00152EEC:
	ldr	r0, [r0, #76]
	cmp	r0, #0
	ldrne	r0, [r0, #16]
	cmpne	r0, #0
	ldrne	r0, [r0, #52]
	beq	.L00152EEC_18
.L00152EEC_18:
	bx	lr
.size func_00152EEC, .-func_00152EEC

.section .text.func_00163F38,"ax",%progbits
.balign 4
.global func_00163F38
.type func_00163F38, %function
func_00163F38:
	ldr	r2, [r1]
	str	r2, [r0]
	ldr	r2, [r1, #4]
	str	r2, [r0, #4]
	ldr	r1, [r1, #8]
	str	r1, [r0, #8]
	bx	lr
.size func_00163F38, .-func_00163F38

.section .text.func_00169C0C,"ax",%progbits
.balign 4
.global func_00169C0C
.type func_00169C0C, %function
func_00169C0C:
	cmp	r0, #0
	beq	.L00169C0C_14
	cmp	r0, #65
	movcc	r0, #1
	bcc	.L00169C0C_18
.L00169C0C_14:
	mov	r0, #0
.L00169C0C_18:
	bx	lr
.size func_00169C0C, .-func_00169C0C

.section .text.func_001765F4,"ax",%progbits
.balign 4
.global func_001765F4
.type func_001765F4, %function
func_001765F4:
	cmp	r1, #0
	moveq	r0, #0
	beq	.L001765F4_18
	cmp	r1, #10
	ldrne	r0, [r0, #44]
	ldreq	r0, [r0, #40]
.L001765F4_18:
	bx	lr
.size func_001765F4, .-func_001765F4

.section .text.func_0019B7B8,"ax",%progbits
.balign 4
.global func_0019B7B8
.type func_0019B7B8, %function
func_0019B7B8:
	vldmia	r1!, {s0-s2}
	mov	r3, #0
	str	r3, [r0]
	vstr	s0, [r0, #12]
	vstr	s1, [r0, #8]
	vstr	s2, [r0, #4]
	bx	lr
.size func_0019B7B8, .-func_0019B7B8

.section .text.func_0019B968,"ax",%progbits
.balign 4
.global func_0019B968
.type func_0019B968, %function
func_0019B968:
	vldmia	r1!, {s0-s1}
	mov	r3, #0
	str	r3, [r0]
	str	r3, [r0, #4]
	vstr	s0, [r0, #12]
	vstr	s1, [r0, #8]
	bx	lr
.size func_0019B968, .-func_0019B968

.section .text.func_0019BB18,"ax",%progbits
.balign 4
.global func_0019BB18
.type func_0019BB18, %function
func_0019BB18:
	vldr	s0, [r1]
	mov	r3, #0
	str	r3, [r0]
	str	r3, [r0, #4]
	str	r3, [r0, #8]
	vstr	s0, [r0, #12]
	bx	lr
.size func_0019BB18, .-func_0019BB18

.section .text.func_001CBF00,"ax",%progbits
.balign 4
.global func_001CBF00
.type func_001CBF00, %function
func_001CBF00:
	mov	r2, #0
	stm	r0, {r1, r2}
	str	r2, [r0, #8]
	str	r2, [r0, #12]
	str	r2, [r0, #16]
	str	r2, [r0, #20]
	bx	lr
.size func_001CBF00, .-func_001CBF00

.section .text.func_001E7A2C,"ax",%progbits
.balign 4
.global func_001E7A2C
.type func_001E7A2C, %function
func_001E7A2C:
	ldr	r0, [r0, #512]
	cmp	r1, #0
	ldrb	r1, [r0, #2]
	orrne	r1, r1, #8
	biceq	r1, r1, #8
	strb	r1, [r0, #2]
	bx	lr
.size func_001E7A2C, .-func_001E7A2C

.section .text.func_001E7A84,"ax",%progbits
.balign 4
.global func_001E7A84
.type func_001E7A84, %function
func_001E7A84:
	ldr	r0, [r0, #512]
	cmp	r1, #0
	ldrb	r1, [r0, #2]
	orrne	r1, r1, #2
	biceq	r1, r1, #2
	strb	r1, [r0, #2]
	bx	lr
.size func_001E7A84, .-func_001E7A84

.section .text.func_001F975C,"ax",%progbits
.balign 4
.global func_001F975C
.type func_001F975C, %function
func_001F975C:
	mov	r2, #0
	str	r1, [r0]
	str	r2, [r0, #12]
	str	r1, [r0, #4]
	str	r2, [r0, #16]
	str	r1, [r0, #8]
	bx	lr
.size func_001F975C, .-func_001F975C

.section .text.func_00200780,"ax",%progbits
.balign 4
.global func_00200780
.type func_00200780, %function
func_00200780:
	ldr	r3, [r0, #308]
	cmp	r1, #0
	str	r3, [r2]
	ldrne	r2, [r0, #312]
	strne	r2, [r1]
	ldr	r0, [r0, #312]
	bx	lr
.size func_00200780, .-func_00200780

.section .text.func_00269138,"ax",%progbits
.balign 4
.global func_00269138
.type func_00269138, %function
func_00269138:
	ldr	r1, [r0, #24]
	cmp	r1, #0
	movne	r1, #0
	strne	r1, [r0, #24]
	movne	r0, #1
	moveq	r0, #0
	bx	lr
.size func_00269138, .-func_00269138

.section .text.func_00279DB4,"ax",%progbits
.balign 4
.global func_00279DB4
.type func_00279DB4, %function
func_00279DB4:
	ldr	r1, [r0]
	add	r1, r1, #1
	cmp	r1, #10
	str	r1, [r0]
	movhi	r0, #1
	movls	r0, #0
	bx	lr
.size func_00279DB4, .-func_00279DB4

.section .text.func_002BB230,"ax",%progbits
.balign 4
.global func_002BB230
.type func_002BB230, %function
func_002BB230:
	ldrh	r1, [r0, #4]
	cmp	r1, #0
	ldrbne	r0, [r0, #30]
	cmpne	r0, #1
	movls	r0, #0
	movhi	r0, #1
	bx	lr
.size func_002BB230, .-func_002BB230

.section .text.func_002BE1BC,"ax",%progbits
.balign 4
.global func_002BE1BC
.type func_002BE1BC, %function
func_002BE1BC:
	mov	r2, #0
	strb	r2, [r0, #4]
	strh	r2, [r0, #8]
	mov	r3, r2
	strh	r2, [r0, #10]
	strd	r2, [r0, #16]
	bx	lr
.size func_002BE1BC, .-func_002BE1BC

.section .text.func_00337ED4,"ax",%progbits
.balign 4
.global func_00337ED4
.type func_00337ED4, %function
func_00337ED4:
	ldr	r2, [r0, #68]
	mov	r1, #0
	strh	r1, [r2, #4]
	ldr	r0, [r0, #68]
	strb	r1, [r0, #8]
	str	r1, [r0, #28]
	bx	lr
.size func_00337ED4, .-func_00337ED4

.section .text.func_0036B530,"ax",%progbits
.balign 4
.global func_0036B530
.type func_0036B530, %function
func_0036B530:
	mov	r1, #0
	str	r1, [r0, #4]
	str	r1, [r0, #16]
	str	r1, [r0, #20]
	str	r1, [r0, #28]
	str	r1, [r0, #32]
	bx	lr
.size func_0036B530, .-func_0036B530
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_83.S` without access to
the private target, disassembly, report, neutral inventory, or probe products.
Assemble as ARMv6K with VFPv2 enabled. Export exactly the twenty-four named
functions in their owned executable sections, with no relocation or adjacent
data, and preserve all sizes and schedules above. Replace `PENDING` in this
specification and the neutral config only after hashing the independent source.
