# Probe-verified ARM runtime/helper batch 87

Source SHA-256: `67087ff74d18885b2a590ed9b27b61046217d8c27a94bd415af179dce88b37b6`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 480 executable body bytes (120
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no external
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 480 target bytes with a
zero-byte exact diff. The exact implementation artifact below has the recorded
source SHA-256.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0029FA24` | `.text.func_0029FA24` | 20 | 5 | 0 | 2 | 1 | `func_0029FAC4` |
| `func_002AF994` | `.text.func_002AF994` | 20 | 5 | 0 | 3 | 1 | `func_002AF9B4` |
| `func_002B08CC` | `.text.func_002B08CC` | 20 | 5 | 0 | 3 | 1 | `func_002B08E0` |
| `func_002C0CD4` | `.text.func_002C0CD4` | 20 | 5 | 0 | 2 | 1 | `func_002C1644` |
| `func_00329A60` | `.text.func_00329A60` | 20 | 5 | 0 | 3 | 1 | `func_00329C34` |
| `func_0032AC04` | `.text.func_0032AC04` | 20 | 5 | 0 | 2 | 1 | `func_0032AC40` |
| `func_003304A8` | `.text.func_003304A8` | 20 | 5 | 1 | 0 | 1 | `func_003304BC` |
| `func_00330584` | `.text.func_00330584` | 20 | 5 | 0 | 2 | 1 | `func_0033077C` |
| `func_00332FC0` | `.text.func_00332FC0` | 20 | 5 | 0 | 0 | 1 | `func_00332FDC` |
| `func_0034ABD0` | `.text.func_0034ABD0` | 20 | 5 | 0 | 3 | 1 | `func_0034ABEC` |
| `func_003625DC` | `.text.func_003625DC` | 20 | 5 | 0 | 2 | 1 | `func_003625F0` |
| `func_0038A088` | `.text.func_0038A088` | 20 | 5 | 0 | 3 | 1 | `func_0038A09C` |
| `func_0038CE90` | `.text.func_0038CE90` | 20 | 5 | 0 | 3 | 1 | `func_0038CEA4` |
| `func_00395B0C` | `.text.func_00395B0C` | 20 | 5 | 0 | 4 | 1 | `func_00395C80` |
| `func_0039B2F4` | `.text.func_0039B2F4` | 20 | 5 | 0 | 4 | 1 | `func_0039B308` |
| `func_003AB324` | `.text.func_003AB324` | 20 | 5 | 0 | 2 | 1 | `func_003AB384` |
| `func_0040AE08` | `.text.func_0040AE08` | 20 | 5 | 0 | 0 | 1 | `func_0040AE1C` |
| `func_00417650` | `.text.func_00417650` | 20 | 5 | 0 | 1 | 1 | `func_00417664` |
| `func_0041B278` | `.text.func_0041B278` | 20 | 5 | 0 | 3 | 1 | `func_0041B294` |
| `func_00439148` | `.text.func_00439148` | 20 | 5 | 0 | 3 | 1 | `func_0043936C` |
| `func_0045B158` | `.text.func_0045B158` | 20 | 5 | 0 | 3 | 1 | `func_0045B250` |
| `func_0045CCB4` | `.text.func_0045CCB4` | 20 | 5 | 0 | 2 | 1 | `func_0045CCC8` |
| `func_0045CCC8` | `.text.func_0045CCC8` | 20 | 5 | 0 | 2 | 1 | `func_0045CCDC` |
| `func_0045CCDC` | `.text.func_0045CCDC` | 20 | 5 | 0 | 2 | 1 | `func_0045CCF0` |

Memory-operation counts include scalar and multiple transfers. Returns are
excluded from the local-branch count. Totals are 120 instructions, one local
conditional branch, 24 `bx lr` returns, and 54 memory operations. There are no
external direct branches. The sole direct branch is the no-op control transfer
at `func_003304A8+0xC`, whose destination is the immediately following return
at offset `0x10`.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`03ab6545f47ecbc6e24aecebfae9f21f0a80c0e587ce61ec9b0de3648cdc7e52`.
The canonical direct-branch schedule SHA-256 is
`04da14b0760fae653575eacc1ff7a5cd8432ec5deb3d375fc96b198f699d14c5`.
The canonical return-transfer schedule SHA-256 is
`d3cac97249af4767048c0727c7e518bd922a55c049ba0b23936732ab65ba0d76`.
Canonical entries are `name:offset:mnemonic:operands`, joined with newlines and
no terminal newline. Offsets are lowercase hexadecimal without an `0x` prefix.
All three hashes were reproduced from the bounded target sections and the
independent probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 17,164 string
leaves (6,131 distinct strings) in the 222 pre-existing top-level JSON configs.
The audit resolved 6,744 string occurrences (3,181 distinct symbols) through
the neutral inventory and expanded each to its complete symbol interval; none
overlaps a selected interval. The audit includes owners, aliases, branch
destinations, direct-transfer symbols, identity members, next-global
annotations, and secondary-entry identities. The neutral inventory has no
alternate symbol at a selected start and no nested global entry in a selected
interval. Selected intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 480
selected bytes as unmatched.

## Exact schedules

The following is the complete independently assembled artifact. Preserve every
mnemonic, operand, condition, memory mode, instruction order, section name,
mode, alignment, local label, and boundary.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0029FA24,"ax",%progbits
.balign 4
.global func_0029FA24
.type func_0029FA24, %function
func_0029FA24:
	mov	r2, #1
	mov	r1, #0
	strb	r2, [r0, #528]
	strb	r1, [r0, #531]
	bx	lr
.size func_0029FA24, .-func_0029FA24

.section .text.func_002AF994,"ax",%progbits
.balign 4
.global func_002AF994
.type func_002AF994, %function
func_002AF994:
	ldr	r1, [r0, #8]
	ldr	r1, [r1, #16]
	lsl	r1, r1, #3
	str	r1, [r0, #20]
	bx	lr
.size func_002AF994, .-func_002AF994

.section .text.func_002B08CC,"ax",%progbits
.balign 4
.global func_002B08CC
.type func_002B08CC, %function
func_002B08CC:
	mov	r1, #0
	str	r1, [r0, #8]
	str	r1, [r0]
	str	r1, [r0, #4]
	bx	lr
.size func_002B08CC, .-func_002B08CC

.section .text.func_002C0CD4,"ax",%progbits
.balign 4
.global func_002C0CD4
.type func_002C0CD4, %function
func_002C0CD4:
	add	r0, r0, #4096
	mov	r1, #0
	str	r1, [r0, #340]
	str	r1, [r0, #344]
	bx	lr
.size func_002C0CD4, .-func_002C0CD4

.section .text.func_00329A60,"ax",%progbits
.balign 4
.global func_00329A60
.type func_00329A60, %function
func_00329A60:
	mov	r1, #0
	strb	r1, [r0]
	strb	r1, [r0, #1]
	str	r1, [r0, #4]
	bx	lr
.size func_00329A60, .-func_00329A60

.section .text.func_0032AC04,"ax",%progbits
.balign 4
.global func_0032AC04
.type func_0032AC04, %function
func_0032AC04:
	ldr	r0, [r0]
	cmp	r0, #0
	movne	r1, #0
	strne	r1, [r0, #32]
	bx	lr
.size func_0032AC04, .-func_0032AC04

.section .text.func_003304A8,"ax",%progbits
.balign 4
.global func_003304A8
.type func_003304A8, %function
func_003304A8:
	cmp	r0, #0
	cmpne	r0, #1
	movne	r0, #3
	beq	.Lfunc_003304A8_return
.Lfunc_003304A8_return:
	bx	lr
.size func_003304A8, .-func_003304A8

.section .text.func_00330584,"ax",%progbits
.balign 4
.global func_00330584
.type func_00330584, %function
func_00330584:
	add	ip, r0, #24
	mvn	r3, #0
	stm	ip, {r1, r2, r3}
	str	r3, [r0, #36]
	bx	lr
.size func_00330584, .-func_00330584

.section .text.func_00332FC0,"ax",%progbits
.balign 4
.global func_00332FC0
.type func_00332FC0, %function
func_00332FC0:
	cmp	r1, #16
	addlt	r0, r0, r1, lsl #1
	addlt	r0, r0, #268
	movge	r0, #0
	bx	lr
.size func_00332FC0, .-func_00332FC0

.section .text.func_0034ABD0,"ax",%progbits
.balign 4
.global func_0034ABD0
.type func_0034ABD0, %function
func_0034ABD0:
	ldr	r3, [r0, #4]
	cmp	r3, #0
	streq	r2, [r0, #8]!
	streq	r1, [r0, #4]
	bx	lr
.size func_0034ABD0, .-func_0034ABD0

.section .text.func_003625DC,"ax",%progbits
.balign 4
.global func_003625DC
.type func_003625DC, %function
func_003625DC:
	ldr	r0, [r0, #28]
	mov	r3, #5
	add	r1, r3, r1, lsl #3
	strb	r2, [r0, r1]
	bx	lr
.size func_003625DC, .-func_003625DC

.section .text.func_0038A088,"ax",%progbits
.balign 4
.global func_0038A088
.type func_0038A088, %function
func_0038A088:
	ldr	r0, [r0, #76]
	ldr	r2, [r0, #4]
	cmp	r2, #0
	strne	r1, [r0, #12]
	bx	lr
.size func_0038A088, .-func_0038A088

.section .text.func_0038CE90,"ax",%progbits
.balign 4
.global func_0038CE90
.type func_0038CE90, %function
func_0038CE90:
	ldr	r0, [r0, #48]
	add	r2, r2, r2, lsl #1
	ldr	r0, [r0, r2, lsl #2]
	str	r1, [r0, #12]
	bx	lr
.size func_0038CE90, .-func_0038CE90

.section .text.func_00395B0C,"ax",%progbits
.balign 4
.global func_00395B0C
.type func_00395B0C, %function
func_00395B0C:
	ldrb	r2, [r1, #29]
	strb	r2, [r0, #29]
	ldr	r1, [r1, #32]
	str	r1, [r0, #32]
	bx	lr
.size func_00395B0C, .-func_00395B0C

.section .text.func_0039B2F4,"ax",%progbits
.balign 4
.global func_0039B2F4
.type func_0039B2F4, %function
func_0039B2F4:
	ldrd	r2, [r1]
	ldr	r1, [r1, #8]
	str	r1, [r0, #240]
	strd	r2, [r0, #232]
	bx	lr
.size func_0039B2F4, .-func_0039B2F4

.section .text.func_003AB324,"ax",%progbits
.balign 4
.global func_003AB324
.type func_003AB324, %function
func_003AB324:
	ldrb	r1, [r0, #9]
	cmp	r1, #0
	ldrne	r0, [r0, #12]
	moveq	r0, #0
	bx	lr
.size func_003AB324, .-func_003AB324

.section .text.func_0040AE08,"ax",%progbits
.balign 4
.global func_0040AE08
.type func_0040AE08, %function
func_0040AE08:
	add	r2, r0, r0, lsl #1
	add	r0, r2, r0, lsl #4
	add	r0, r1, r0, lsl #3
	add	r0, r0, #24
	bx	lr
.size func_0040AE08, .-func_0040AE08

.section .text.func_00417650,"ax",%progbits
.balign 4
.global func_00417650
.type func_00417650, %function
func_00417650:
	cmp	r1, #900
	strhlt	r1, [r0]
	movge	r0, #0
	movlt	r0, #1
	bx	lr
.size func_00417650, .-func_00417650

.section .text.func_0041B278,"ax",%progbits
.balign 4
.global func_0041B278
.type func_0041B278, %function
func_0041B278:
	ldr	r0, [r0, #28]
	ldr	r2, [r0, #4]
	bic	r1, r2, r1
	str	r1, [r0, #4]
	bx	lr
.size func_0041B278, .-func_0041B278

.section .text.func_00439148,"ax",%progbits
.balign 4
.global func_00439148
.type func_00439148, %function
func_00439148:
	mov	r1, #0
	strb	r1, [r0, #275]
	strb	r1, [r0, #273]
	strb	r1, [r0, #274]
	bx	lr
.size func_00439148, .-func_00439148

.section .text.func_0045B158,"ax",%progbits
.balign 4
.global func_0045B158
.type func_0045B158, %function
func_0045B158:
	ldrb	r3, [r0, #1592]
	mov	r2, #0
	strb	r3, [r0, #1593]
	strb	r2, [r0, #1592]
	bx	lr
.size func_0045B158, .-func_0045B158

.section .text.func_0045CCB4,"ax",%progbits
.balign 4
.global func_0045CCB4
.type func_0045CCB4, %function
func_0045CCB4:
	add	r0, r0, r1
	ldrb	r1, [r0, #70]
	add	r1, r1, #1
	strb	r1, [r0, #70]
	bx	lr
.size func_0045CCB4, .-func_0045CCB4

.section .text.func_0045CCC8,"ax",%progbits
.balign 4
.global func_0045CCC8
.type func_0045CCC8, %function
func_0045CCC8:
	add	r0, r0, r1
	ldrb	r1, [r0, #80]
	add	r1, r1, #1
	strb	r1, [r0, #80]
	bx	lr
.size func_0045CCC8, .-func_0045CCC8

.section .text.func_0045CCDC,"ax",%progbits
.balign 4
.global func_0045CCDC
.type func_0045CCDC, %function
func_0045CCDC:
	add	r0, r0, r1
	ldrb	r1, [r0, #90]
	add	r1, r1, #1
	strb	r1, [r0, #90]
	bx	lr
.size func_0045CCDC, .-func_0045CCDC
```

The specification intentionally contains no target bytes, opcodes, target
hash, private strings, assets, or ROM material.
