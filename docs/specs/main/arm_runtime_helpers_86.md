# Probe-verified ARM runtime/helper batch 86

Source SHA-256: `585b680aef4734d0d20681d0622ff0012de109f20f5665bdbb9b5a3bd069a381`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 524 executable body bytes (131
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 524 target bytes with a
zero-byte exact diff. The exact implementation artifact below has the recorded
source SHA-256.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_004108D4` | `.text.func_004108D4` | 24 | 6 | 0 | 2 | 1 | `func_004108EC` |
| `func_00417460` | `.text.func_00417460` | 24 | 6 | 0 | 2 | 1 | `func_00417478` |
| `func_00438B7C` | `.text.func_00438B7C` | 24 | 6 | 0 | 4 | 1 | `func_00438BA0` |
| `func_0045E658` | `.text.func_0045E658` | 24 | 6 | 0 | 4 | 1 | `func_0045E8D0` |
| `func_00463D38` | `.text.func_00463D38` | 24 | 6 | 0 | 2 | 1 | `func_00463D50` |
| `func_00466F00` | `.text.func_00466F00` | 24 | 6 | 0 | 2 | 1 | `func_00466F38` |
| `func_004B09E0` | `.text.func_004B09E0` | 24 | 6 | 0 | 2 | 1 | `func_004B09F8` |
| `func_004B1444` | `.text.func_004B1444` | 24 | 6 | 0 | 2 | 1 | `func_004B14A4` |
| `func_004BF4F8` | `.text.func_004BF4F8` | 24 | 6 | 0 | 2 | 1 | `func_004BF510` |
| `func_004BF52C` | `.text.func_004BF52C` | 24 | 6 | 0 | 2 | 1 | `func_004BF544` |
| `func_004C2018` | `.text.func_004C2018` | 24 | 6 | 0 | 1 | 1 | `func_004C2030` |
| `func_0010E17C` | `.text.func_0010E17C` | 20 | 5 | 0 | 2 | 1 | `func_0010E190` |
| `func_00110D9C` | `.text.func_00110D9C` | 20 | 5 | 0 | 3 | 1 | `func_00110DB0` |
| `func_001175D0` | `.text.func_001175D0` | 20 | 5 | 0 | 1 | 1 | `func_001175E4` |
| `func_00117768` | `.text.func_00117768` | 20 | 5 | 0 | 3 | 1 | `func_00117830` |
| `func_0013F33C` | `.text.func_0013F33C` | 20 | 5 | 0 | 3 | 1 | `func_0013F350` |
| `func_0014B87C` | `.text.func_0014B87C` | 20 | 5 | 0 | 0 | 1 | `func_0014B890` |
| `func_0014DFB4` | `.text.func_0014DFB4` | 20 | 5 | 0 | 2 | 1 | `func_0014DFCC` |
| `func_00152868` | `.text.func_00152868` | 20 | 5 | 0 | 2 | 1 | `func_0015287C` |
| `func_00186EC4` | `.text.func_00186EC4` | 20 | 5 | 0 | 1 | 1 | `func_00186F58` |
| `func_001950F8` | `.text.func_001950F8` | 20 | 5 | 0 | 4 | 1 | `func_00195160` |
| `func_001D25F0` | `.text.func_001D25F0` | 20 | 5 | 0 | 0 | 1 | `func_001D2604` |
| `func_002067EC` | `.text.func_002067EC` | 20 | 5 | 0 | 2 | 1 | `func_00206BA4` |
| `func_0029C1C0` | `.text.func_0029C1C0` | 20 | 5 | 0 | 4 | 1 | `func_0029C298` |

Memory-operation counts include scalar and VFP loads/stores and multiple
transfers. Returns are excluded from the local-branch count. Totals are 131
instructions, zero local branches, 24 `bx lr` returns, and 52 memory
operations. There are no unconditional or conditional direct branches.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`16ed62fd49078a8a0a0873df31a65303743892dd5fdc3e4910c31497eed2a550`.
The canonical direct-branch schedule is empty and has SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`544fcbeaacc2810d06e8c11bd39f4eeeb35ef351515460513af42d4a7a4be6f3`.
Canonical entries are `name:offset:mnemonic:operands`, joined with newlines and
no terminal newline. Offsets are lowercase hexadecimal without an `0x` prefix.
All three hashes were reproduced from the bounded target sections and the
independent probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule. GNU objdump renders each
traditional ARM no-op in `func_00466F00` and `func_0013F33C` as
`nop @ (mov r0, r0)` for the canonical schedule; the implementation must use
`mov r0, r0`, because the architectural `nop` mnemonic assembles to a different
instruction.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 17,102 string
leaves (6,104 distinct strings) in the 221 pre-existing top-level JSON configs.
The audit resolved 6,696 string occurrences (3,157 distinct symbols) through
the neutral inventory and expanded each to its
complete symbol interval; none overlaps a selected interval. The audit includes
owners, aliases, branch destinations, direct-transfer symbols, identity
members, next-global annotations, and secondary-entry identities. The neutral
inventory has no alternate symbol at a selected start and no nested global
entry in a selected interval. Selected intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 524
selected bytes as unmatched.

## Exact schedules

The following is the complete independently assembled artifact. Preserve every
mnemonic, operand, condition, memory mode, instruction order, section name,
mode, alignment, and boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004108D4,"ax",%progbits
.balign 4
.global func_004108D4
.type func_004108D4, %function
func_004108D4:
	ldr	r2, [r0]
	lsl	r2, r2, #14
	lsr	r2, r2, #14
	orr	r1, r2, r1, lsl #18
	str	r1, [r0]
	bx	lr
.size func_004108D4, .-func_004108D4

.section .text.func_00417460,"ax",%progbits
.balign 4
.global func_00417460
.type func_00417460, %function
func_00417460:
	cmp	r1, #0
	ldr	r1, [r0, #40]
	orrne	r1, r1, #1
	biceq	r1, r1, #1
	str	r1, [r0, #40]
	bx	lr
.size func_00417460, .-func_00417460

.section .text.func_00438B7C,"ax",%progbits
.balign 4
.global func_00438B7C
.type func_00438B7C, %function
func_00438B7C:
	ldrb	r1, [r0, #265]
	cmp	r1, #1
	ldreq	r0, [r0, #36]
	ldreq	r0, [r0, #128]
	ldrne	r0, [r0, #20]
	bx	lr
.size func_00438B7C, .-func_00438B7C

.section .text.func_0045E658,"ax",%progbits
.balign 4
.global func_0045E658
.type func_0045E658, %function
func_0045E658:
	mov	r1, #0
	str	r1, [r0, #980]
	str	r1, [r0, #984]
	str	r1, [r0, #988]
	str	r1, [r0, #992]
	bx	lr
.size func_0045E658, .-func_0045E658

.section .text.func_00463D38,"ax",%progbits
.balign 4
.global func_00463D38
.type func_00463D38, %function
func_00463D38:
	add	r0, r0, r1, lsl #2
	add	r0, r0, r2
	ldrb	r1, [r0, #52]
	cmp	r1, r3
	strbcc	r3, [r0, #52]
	bx	lr
.size func_00463D38, .-func_00463D38

.section .text.func_00466F00,"ax",%progbits
.balign 4
.global func_00466F00
.type func_00466F00, %function
func_00466F00:
	ldr	r0, [r0]
	uxth	r1, r1
	add	r0, r0, #3824
	mov	r0, r0
	strh	r1, [r0, #228]
	bx	lr
.size func_00466F00, .-func_00466F00

.section .text.func_004B09E0,"ax",%progbits
.balign 4
.global func_004B09E0
.type func_004B09E0, %function
func_004B09E0:
	ldr	r1, [r0, #12]
	ldr	r0, [r0, #16]
	cmp	r1, r0
	movne	r0, r1
	moveq	r0, #0
	bx	lr
.size func_004B09E0, .-func_004B09E0

.section .text.func_004B1444,"ax",%progbits
.balign 4
.global func_004B1444
.type func_004B1444, %function
func_004B1444:
	ldr	r0, [r0]
	ldr	r1, [r1]
	cmp	r0, r1
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_004B1444, .-func_004B1444

.section .text.func_004BF4F8,"ax",%progbits
.balign 4
.global func_004BF4F8
.type func_004BF4F8, %function
func_004BF4F8:
	ldrh	r1, [r0]
	cmp	r1, #768
	ldreq	r1, [r0, #4]
	addeq	r0, r0, r1
	movne	r0, #0
	bx	lr
.size func_004BF4F8, .-func_004BF4F8

.section .text.func_004BF52C,"ax",%progbits
.balign 4
.global func_004BF52C
.type func_004BF52C, %function
func_004BF52C:
	ldrh	r1, [r0]
	cmp	r1, #16640
	ldreq	r1, [r0, #4]
	movne	r0, #0
	addeq	r0, r0, r1
	bx	lr
.size func_004BF52C, .-func_004BF52C

.section .text.func_004C2018,"ax",%progbits
.balign 4
.global func_004C2018
.type func_004C2018, %function
func_004C2018:
	ldr	r1, [r0, #4]
	sub	r2, r1, #512
	subs	r2, r2, #31
	movne	r0, #0
	addeq	r0, r0, #8
	bx	lr
.size func_004C2018, .-func_004C2018

.section .text.func_0010E17C,"ax",%progbits
.balign 4
.global func_0010E17C
.type func_0010E17C, %function
func_0010E17C:
	ldr	r0, [r0, #376]
	ldrb	r0, [r0, #1]
	cmp	r0, #0
	movne	r0, #1
	bx	lr
.size func_0010E17C, .-func_0010E17C

.section .text.func_00110D9C,"ax",%progbits
.balign 4
.global func_00110D9C
.type func_00110D9C, %function
func_00110D9C:
	vldmia	sp, {s0-s1}
	add	r1, r0, #8
	vstmia	r1, {s0-s1}
	strd	r2, [r0]
	bx	lr
.size func_00110D9C, .-func_00110D9C

.section .text.func_001175D0,"ax",%progbits
.balign 4
.global func_001175D0
.type func_001175D0, %function
func_001175D0:
	cmp	r1, #3
	addcc	r0, r0, r1, lsl #2
	movcs	r0, #0
	ldrcc	r0, [r0, #36]
	bx	lr
.size func_001175D0, .-func_001175D0

.section .text.func_00117768,"ax",%progbits
.balign 4
.global func_00117768
.type func_00117768, %function
func_00117768:
	mov	r1, #0
	str	r1, [r0]
	strh	r1, [r0, #4]
	strb	r1, [r0, #6]
	bx	lr
.size func_00117768, .-func_00117768

.section .text.func_0013F33C,"ax",%progbits
.balign 4
.global func_0013F33C
.type func_0013F33C, %function
func_0013F33C:
	ldr	r0, [r0, #12]
	mov	r0, r0
	ldr	r0, [r0, #8]
	ldr	r0, [r0]
	bx	lr
.size func_0013F33C, .-func_0013F33C

.section .text.func_0014B87C,"ax",%progbits
.balign 4
.global func_0014B87C
.type func_0014B87C, %function
func_0014B87C:
	mov	r1, #78
	mul	r0, r0, r1
	add	r0, r0, #57
	bic	r0, r0, #3
	bx	lr
.size func_0014B87C, .-func_0014B87C

.section .text.func_0014DFB4,"ax",%progbits
.balign 4
.global func_0014DFB4
.type func_0014DFB4, %function
func_0014DFB4:
	ldrh	r1, [r0]
	cmp	r1, #16
	ldrheq	r0, [r0, #4]
	movne	r0, #0
	bx	lr
.size func_0014DFB4, .-func_0014DFB4

.section .text.func_00152868,"ax",%progbits
.balign 4
.global func_00152868
.type func_00152868, %function
func_00152868:
	ldr	r0, [r0, #12]
	ldrb	r0, [r0, #10]
	cmp	r0, #0
	movne	r0, #1
	bx	lr
.size func_00152868, .-func_00152868

.section .text.func_00186EC4,"ax",%progbits
.balign 4
.global func_00186EC4
.type func_00186EC4, %function
func_00186EC4:
	add	r0, r0, r1, lsl #1
	mov	r3, #0
	strb	r3, [r0, r2]
	mov	r0, #1
	bx	lr
.size func_00186EC4, .-func_00186EC4

.section .text.func_001950F8,"ax",%progbits
.balign 4
.global func_001950F8
.type func_001950F8, %function
func_001950F8:
	ldr	r2, [r1]
	str	r2, [r0]
	ldrh	r3, [r1, #4]
	strh	r3, [r0, #4]
	bx	lr
.size func_001950F8, .-func_001950F8

.section .text.func_001D25F0,"ax",%progbits
.balign 4
.global func_001D25F0
.type func_001D25F0, %function
func_001D25F0:
	cmp	r0, #2
	cmpne	r0, #4
	moveq	r0, #1
	movne	r0, #0
	bx	lr
.size func_001D25F0, .-func_001D25F0

.section .text.func_002067EC,"ax",%progbits
.balign 4
.global func_002067EC
.type func_002067EC, %function
func_002067EC:
	add	r1, r1, #4
	add	r2, r0, #4
	vldmia	r1, {s0-s6}
	vstmia	r2, {s0-s6}
	bx	lr
.size func_002067EC, .-func_002067EC

.section .text.func_0029C1C0,"ax",%progbits
.balign 4
.global func_0029C1C0
.type func_0029C1C0, %function
func_0029C1C0:
	ldr	r2, [r1, #4]
	str	r2, [r0, #4]
	ldrh	r1, [r1, #8]
	strh	r1, [r0, #8]
	bx	lr
.size func_0029C1C0, .-func_0029C1C0
```

## Implementer contract

- Implement only the twenty-four named sections above, in configuration order.
- Keep each symbol global, typed as a function, ARM-state, four-byte aligned,
  and exactly the configured size.
- Do not add calls, relocations, pools, adjacent words, PC-relative accesses,
  extra globals, or extra executable sections.
- Treat both explicit `mov r0, r0` instructions as mandatory legacy no-ops.
- The validator must check exact section bytes, symbol boundaries, zero
  relocations, the full/branch/return schedule hashes, aggregate instruction and
  memory-operation counts, isolated assembly, composite inclusion, and hostile
  extra-section/global rejection.
