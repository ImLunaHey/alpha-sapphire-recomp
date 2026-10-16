# Probe-verified ARM runtime/helper batch 84

Source SHA-256: `28ac90e90e33f8cad7e98194a8622dfccf970ef414d52d481a17813a67f15ea7`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 644 executable body bytes (161
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.44 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 644 target bytes with a
zero-byte exact diff. The implementation source SHA-256 is recorded above.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00374084` | `.text.func_00374084` | 28 | 7 | 0 | 2 | 1 | `func_003740A0` |
| `func_00381F50` | `.text.func_00381F50` | 28 | 7 | 0 | 5 | 1 | `func_00381F6C` |
| `func_003BCE64` | `.text.func_003BCE64` | 28 | 7 | 0 | 5 | 1 | `func_003BCE80` |
| `func_00410860` | `.text.func_00410860` | 28 | 7 | 0 | 2 | 1 | `func_0041087C` |
| `func_00416A5C` | `.text.func_00416A5C` | 28 | 7 | 0 | 5 | 1 | `func_00416EC8` |
| `func_004174F8` | `.text.func_004174F8` | 28 | 7 | 0 | 2 | 1 | `func_00417514` |
| `func_00462AA0` | `.text.func_00462AA0` | 28 | 7 | 0 | 2 | 1 | `func_00462ABC` |
| `func_00462ABC` | `.text.func_00462ABC` | 28 | 7 | 0 | 2 | 1 | `func_00462AF4` |
| `func_00462BB4` | `.text.func_00462BB4` | 28 | 7 | 0 | 2 | 1 | `func_00462C54` |
| `func_00466E2C` | `.text.func_00466E2C` | 28 | 7 | 0 | 2 | 1 | `func_00466F00` |
| `func_004A9EE8` | `.text.func_004A9EE8` | 28 | 7 | 0 | 2 | 1 | `func_004A9F08` |
| `func_004AA7C4` | `.text.func_004AA7C4` | 28 | 7 | 0 | 6 | 1 | `func_004AA7E8` |
| `func_004ACF2C` | `.text.func_004ACF2C` | 28 | 7 | 0 | 4 | 1 | `func_004ACF48` |
| `func_004B2818` | `.text.func_004B2818` | 28 | 7 | 0 | 3 | 1 | `func_004B2834` |
| `func_004BE66C` | `.text.func_004BE66C` | 28 | 7 | 1 | 1 | 1 | `func_004BE69C` |
| `func_004BF510` | `.text.func_004BF510` | 28 | 7 | 0 | 2 | 1 | `func_004BF52C` |
| `func_004BF544` | `.text.func_004BF544` | 28 | 7 | 0 | 2 | 1 | `func_004BF560` |
| `func_0011BF04` | `.text.func_0011BF04` | 24 | 6 | 0 | 1 | 1 | `func_0011BF1C` |
| `func_00136B1C` | `.text.func_00136B1C` | 24 | 6 | 0 | 3 | 1 | `func_00136B34` |
| `func_00177280` | `.text.func_00177280` | 24 | 6 | 0 | 2 | 1 | `func_00177298` |
| `func_00179DB8` | `.text.func_00179DB8` | 24 | 6 | 0 | 4 | 1 | `func_00179DD0` |
| `func_0017CAAC` | `.text.func_0017CAAC` | 24 | 6 | 1 | 2 | 1 | `func_0017CAC4` |
| `func_0017E840` | `.text.func_0017E840` | 24 | 6 | 0 | 4 | 1 | `func_0017E858` |
| `func_00195C28` | `.text.func_00195C28` | 24 | 6 | 0 | 4 | 1 | `func_00195C40` |

Memory-operation counts include scalar and VFP loads/stores and multiple
transfers. Returns are excluded from the local-branch count. Totals are 161
instructions, two conditional function-local branches, 24 `bx lr` returns, and
69 memory operations. There are no unconditional branches.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`00cd5c2fe1f7ea32e1e75f39d23b1e49363b7112788443e14d8edad4a265534a`.
The canonical direct-branch schedule SHA-256 is
`d235b2514febf7dc606fced98a672c741a92186d99170e07d4df0a6eb598f111`.
The canonical return-transfer schedule SHA-256 is
`a9b10daa10e814689bcb34e8c17d721525f2a1d4199d4963f99479da476ec65d`.
Canonical entries are `name:offset:mnemonic:operands` for the full and return
schedules and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets and branch targets are lowercase
hexadecimal without an `0x` prefix. All three hashes were reproduced from the
bounded target sections and the independent probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 15,925 string
leaves (5,676 distinct strings) in the 214 pre-existing JSON configs. The audit
resolved 6,289 string occurrences (3,017 distinct symbols) through the neutral
inventory and expanded each to its complete symbol interval; none overlaps a
selected interval. The audit includes owners, aliases, branch destinations,
direct-transfer symbols, identity members, next-global annotations, and
secondary-entry identities. The neutral inventory has no alternate symbol at a
selected start and no nested global entry in a selected interval. Selected
intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 644
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

.section .text.func_00374084,"ax",%progbits
.balign 4
.global func_00374084
.type func_00374084, %function
func_00374084:
	ldr	r2, [r0, #60]
	cmp	r2, #0
	mov	r2, #0
	moveq	r2, #1
	streq	r1, [r0, #60]
	mov	r0, r2
	bx	lr
.size func_00374084, .-func_00374084

.section .text.func_00381F50,"ax",%progbits
.balign 4
.global func_00381F50
.type func_00381F50, %function
func_00381F50:
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	strb	r1, [r0, #8]
	str	r1, [r0, #12]
	str	r1, [r0, #16]
	bx	lr
.size func_00381F50, .-func_00381F50

.section .text.func_003BCE64,"ax",%progbits
.balign 4
.global func_003BCE64
.type func_003BCE64, %function
func_003BCE64:
	ldr	r2, [r0]
	str	r1, [r0]
	str	r0, [r1, #4]
	cmp	r2, #0
	str	r2, [r1]
	strne	r1, [r2, #4]
	bx	lr
.size func_003BCE64, .-func_003BCE64

.section .text.func_00410860,"ax",%progbits
.balign 4
.global func_00410860
.type func_00410860, %function
func_00410860:
	ldr	r2, [r0, #4]
	mov	r3, #28
	and	r1, r3, r1, lsl #2
	bic	r2, r2, #28
	orr	r1, r1, r2
	str	r1, [r0, #4]
	bx	lr
.size func_00410860, .-func_00410860

.section .text.func_00416A5C,"ax",%progbits
.balign 4
.global func_00416A5C
.type func_00416A5C, %function
func_00416A5C:
	mov	r1, #0
	str	r1, [r0]
	str	r1, [r0, #4]
	str	r1, [r0, #8]
	str	r1, [r0, #12]
	strh	r1, [r0, #16]
	bx	lr
.size func_00416A5C, .-func_00416A5C

.section .text.func_004174F8,"ax",%progbits
.balign 4
.global func_004174F8
.type func_004174F8, %function
func_004174F8:
	ldr	r2, [r0, #44]
	mov	r3, #31457280
	and	r1, r3, r1, lsl #21
	bic	r2, r2, #31457280
	orr	r1, r1, r2
	str	r1, [r0, #44]
	bx	lr
.size func_004174F8, .-func_004174F8

.section .text.func_00462AA0,"ax",%progbits
.balign 4
.global func_00462AA0
.type func_00462AA0, %function
func_00462AA0:
	ldr	r2, [r0, #16]
	cmp	r2, r1
	movcc	r1, #0
	subcs	r1, r2, r1
	str	r1, [r0, #16]
	mov	r0, r1
	bx	lr
.size func_00462AA0, .-func_00462AA0

.section .text.func_00462ABC,"ax",%progbits
.balign 4
.global func_00462ABC
.type func_00462ABC, %function
func_00462ABC:
	ldr	r2, [r0, #52]
	mov	r3, #12288
	and	r1, r3, r1, lsl #12
	bic	r2, r2, #12288
	orr	r1, r1, r2
	str	r1, [r0, #52]
	bx	lr
.size func_00462ABC, .-func_00462ABC

.section .text.func_00462BB4,"ax",%progbits
.balign 4
.global func_00462BB4
.type func_00462BB4, %function
func_00462BB4:
	ldr	r2, [r0, #4]
	mov	r3, #4
	and	r1, r3, r1, lsl #2
	bic	r2, r2, #4
	orr	r1, r1, r2
	str	r1, [r0, #4]
	bx	lr
.size func_00462BB4, .-func_00462BB4

.section .text.func_00466E2C,"ax",%progbits
.balign 4
.global func_00466E2C
.type func_00466E2C, %function
func_00466E2C:
	ldrb	r2, [r0, #230]
	mov	r3, #6
	and	r1, r3, r1, lsl #1
	bic	r2, r2, #6
	orr	r1, r1, r2
	strb	r1, [r0, #230]
	bx	lr
.size func_00466E2C, .-func_00466E2C

.section .text.func_004A9EE8,"ax",%progbits
.balign 4
.global func_004A9EE8
.type func_004A9EE8, %function
func_004A9EE8:
	ldr	r2, [r0, #48]
	cmp	r2, r1
	ldrls	r0, [r0, #52]
	cmpls	r1, r0
	movcs	r0, #0
	movcc	r0, #1
	bx	lr
.size func_004A9EE8, .-func_004A9EE8

.section .text.func_004AA7C4,"ax",%progbits
.balign 4
.global func_004AA7C4
.type func_004AA7C4, %function
func_004AA7C4:
	ldrh	ip, [r0, #14]
	strh	ip, [r1]
	ldrh	r1, [r0, #16]
	strh	r1, [r2]
	ldrh	r0, [r0, #18]
	strh	r0, [r3]
	bx	lr
.size func_004AA7C4, .-func_004AA7C4

.section .text.func_004ACF2C,"ax",%progbits
.balign 4
.global func_004ACF2C
.type func_004ACF2C, %function
func_004ACF2C:
	ldr	r1, [r0, #48]
	cmp	r1, #0
	ldrne	r0, [r0, #44]
	moveq	r0, #0
	ldrne	r0, [r0, #4]
	ldrne	r0, [r0, #8]
	bx	lr
.size func_004ACF2C, .-func_004ACF2C

.section .text.func_004B2818,"ax",%progbits
.balign 4
.global func_004B2818
.type func_004B2818, %function
func_004B2818:
	ldrb	r1, [r0, #4]
	cmp	r1, #0
	ldrne	r0, [r0]
	mvneq	r0, #0
	addne	r0, r0, #768
	ldrsbne	r0, [r0, #36]
	bx	lr
.size func_004B2818, .-func_004B2818

.section .text.func_004BE66C,"ax",%progbits
.balign 4
.global func_004BE66C
.type func_004BE66C, %function
func_004BE66C:
	ldrh	r0, [r0, #248]
	cmp	r0, #0
	beq	.L004BE66C_18
	mvn	r1, #0
	add	r0, r1, r0, lsr #1
	uxth	r0, r0
.L004BE66C_18:
	bx	lr
.size func_004BE66C, .-func_004BE66C

.section .text.func_004BF510,"ax",%progbits
.balign 4
.global func_004BF510
.type func_004BF510, %function
func_004BF510:
	ldrh	r1, [r0, #8]
	sub	r2, r1, #256
	subs	r2, r2, #1
	ldreq	r1, [r0, #12]
	movne	r0, #0
	addeq	r0, r0, r1
	bx	lr
.size func_004BF510, .-func_004BF510

.section .text.func_004BF544,"ax",%progbits
.balign 4
.global func_004BF544
.type func_004BF544, %function
func_004BF544:
	ldrh	r1, [r0, #16]
	sub	r2, r1, #256
	subs	r2, r2, #1
	ldreq	r1, [r0, #20]
	movne	r0, #0
	addeq	r0, r0, r1
	bx	lr
.size func_004BF544, .-func_004BF544

.section .text.func_0011BF04,"ax",%progbits
.balign 4
.global func_0011BF04
.type func_0011BF04, %function
func_0011BF04:
	ldr	r2, [r0, #28]
	bic	r0, r1, #-16777216
	rsb	r1, r0, r0, lsl #3
	add	r0, r1, r0, lsl #4
	add	r0, r2, r0, lsl #2
	bx	lr
.size func_0011BF04, .-func_0011BF04

.section .text.func_00136B1C,"ax",%progbits
.balign 4
.global func_00136B1C
.type func_00136B1C, %function
func_00136B1C:
	mov	r2, #0
	add	r3, r0, #8
	str	r2, [r0]
	strd	r2, [r0, #4]
	str	r3, [r0, #12]
	bx	lr
.size func_00136B1C, .-func_00136B1C

.section .text.func_00177280,"ax",%progbits
.balign 4
.global func_00177280
.type func_00177280, %function
func_00177280:
	ldrb	r2, [r0, #4]
	cmp	r2, r1
	addhi	r0, r0, r1
	movls	r0, #0
	ldrbhi	r0, [r0, #5]
	bx	lr
.size func_00177280, .-func_00177280

.section .text.func_00179DB8,"ax",%progbits
.balign 4
.global func_00179DB8
.type func_00179DB8, %function
func_00179DB8:
	add	r0, r0, r1, lsl #2
	ldr	r1, [r0, #20]
	str	r1, [r2]
	ldr	r0, [r0, #28]
	str	r0, [r3]
	bx	lr
.size func_00179DB8, .-func_00179DB8

.section .text.func_0017CAAC,"ax",%progbits
.balign 4
.global func_0017CAAC
.type func_0017CAAC, %function
func_0017CAAC:
	cmp	r1, #0
	cmpne	r0, #0
	beq	.L0017CAAC_14
	ldm	r0, {r0, r2}
	stm	r1, {r0, r2}
.L0017CAAC_14:
	bx	lr
.size func_0017CAAC, .-func_0017CAAC

.section .text.func_0017E840,"ax",%progbits
.balign 4
.global func_0017E840
.type func_0017E840, %function
func_0017E840:
	mov	r2, #0
	strh	r1, [r0, #10]
	str	r2, [r0]
	str	r2, [r0, #4]
	strh	r2, [r0, #8]
	bx	lr
.size func_0017E840, .-func_0017E840

.section .text.func_00195C28,"ax",%progbits
.balign 4
.global func_00195C28
.type func_00195C28, %function
func_00195C28:
	vldmia	r1!, {s0-s4}
	mov	r2, r0
	vldmia	r1, {s5-s8}
	vstmia	r2!, {s0-s4}
	vstmia	r2, {s5-s8}
	bx	lr
.size func_00195C28, .-func_00195C28
```

## Implementation contract

Implement this artifact in `src/main/arm_runtime_helpers_84.S` without access
to the private target, disassembly, report, symbol inventory, probe products, or
other authored implementation sources. Assemble as ARMv6K with VFPv2 enabled.
The implementation must export exactly the twenty-four named functions in their
owned executable sections, produce no relocations or adjacent data, and match
the sizes and schedules above. The implementation source SHA-256 must match the
value recorded in this specification and the neutral config.
