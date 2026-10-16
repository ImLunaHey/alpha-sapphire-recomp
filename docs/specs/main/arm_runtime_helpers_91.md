# Probe-verified ARM runtime/helper batch 91

Source SHA-256: `eba8d2173e04145b14bb82f0a69907a52d607c6b5f97d44df4ab3c85edf788aa`

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
ARM-state, call-free helpers totaling 288 executable body bytes (72
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-16.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no direct
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 288 target bytes with a
zero-byte exact diff.

The bounded scan also found one structurally eligible 16-byte helper,
`func_003AB314`, whose complete body duplicates an already matched target
function. It is deliberately excluded. All selected 12-byte bodies have target
multiplicity one.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0010E190` | `.text.func_0010E190` | 12 | 3 | 0 | 2 | 1 | `func_0010E19C` |
| `func_0011760C` | `.text.func_0011760C` | 12 | 3 | 0 | 1 | 1 | `func_00117618` |
| `func_0011775C` | `.text.func_0011775C` | 12 | 3 | 0 | 2 | 1 | `func_00117768` |
| `func_0011C268` | `.text.func_0011C268` | 12 | 3 | 0 | 1 | 1 | `func_0011C274` |
| `func_0011F9D0` | `.text.func_0011F9D0` | 12 | 3 | 0 | 0 | 1 | `func_0011F9DC` |
| `func_0011F9DC` | `.text.func_0011F9DC` | 12 | 3 | 0 | 0 | 1 | `func_0011FA10` |
| `func_00136708` | `.text.func_00136708` | 12 | 3 | 0 | 0 | 1 | `func_00136714` |
| `func_0015287C` | `.text.func_0015287C` | 12 | 3 | 0 | 2 | 1 | `func_00152888` |
| `func_00153764` | `.text.func_00153764` | 12 | 3 | 0 | 1 | 1 | `func_00153770` |
| `func_00153770` | `.text.func_00153770` | 12 | 3 | 0 | 0 | 1 | `func_0015377C` |
| `func_00165B78` | `.text.func_00165B78` | 12 | 3 | 0 | 0 | 1 | `func_00165B84` |
| `func_00170F08` | `.text.func_00170F08` | 12 | 3 | 0 | 1 | 1 | `func_00170F14` |
| `func_00172348` | `.text.func_00172348` | 12 | 3 | 0 | 2 | 1 | `func_00172470` |
| `func_001D8D40` | `.text.func_001D8D40` | 12 | 3 | 0 | 1 | 1 | `func_001D8EE4` |
| `func_001DE0A4` | `.text.func_001DE0A4` | 12 | 3 | 0 | 1 | 1 | `func_001DE558` |
| `func_001DF24C` | `.text.func_001DF24C` | 12 | 3 | 0 | 1 | 1 | `func_001DF63C` |
| `func_001DF7E4` | `.text.func_001DF7E4` | 12 | 3 | 0 | 1 | 1 | `func_001DF7F0` |
| `func_001E0518` | `.text.func_001E0518` | 12 | 3 | 0 | 1 | 1 | `func_001E0524` |
| `func_001E0A44` | `.text.func_001E0A44` | 12 | 3 | 0 | 1 | 1 | `func_001E0EA8` |
| `func_001FAD38` | `.text.func_001FAD38` | 12 | 3 | 0 | 2 | 1 | `func_001FAD44` |
| `func_002066F0` | `.text.func_002066F0` | 12 | 3 | 0 | 1 | 1 | `func_002066FC` |
| `func_002066FC` | `.text.func_002066FC` | 12 | 3 | 0 | 1 | 1 | `func_00206708` |
| `func_0024CEEC` | `.text.func_0024CEEC` | 12 | 3 | 0 | 2 | 1 | `func_0024CEF8` |
| `func_00257DE8` | `.text.func_00257DE8` | 12 | 3 | 0 | 1 | 1 | `func_00257DF4` |

Memory-operation counts include scalar, multiple, VFP, and stack transfers.
Returns are excluded from the local-branch count. Totals are 72 instructions,
0 local branches, 24 return sites, and 25 memory operations. There are no
direct branch sites, external transfers, calls, or PC-relative data accesses.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`6c9e74dc014cb0a64d8f1f3212d869fe4a08b54603e37c4fec1985c28bfce94f`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`c13019d4cbe9d280fb18efe46e205235baf1197bc7f592637cc7404f00dd8136`.
Canonical entries are `name:offset:mnemonic:operands` for instructions and
returns, and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced independently from the bounded
target sections and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 19,395 string
leaves (6,949 distinct strings) in the 235 pre-existing top-level JSON configs.
The audit resolved 9,803 string occurrences (4,304 distinct symbols) through
the neutral inventory and expanded each to its complete symbol interval; none
overlaps a selected interval. The audit includes owners, aliases, branch
destinations, direct-transfer symbols, identity members, next-global
annotations, and secondary-entry identities. The neutral inventory has no
alternate symbol at a selected start and no nested global entry in a selected
interval. Selected intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 288
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

.section .text.func_0010E190,"ax",%progbits
.balign 4
.global func_0010E190
.type func_0010E190, %function
func_0010E190:
.Lfunc_0010E190_0:
	ldr	r0, [r0, #376]
.Lfunc_0010E190_4:
	ldr	r0, [r0, #12]
.Lfunc_0010E190_8:
	bx	lr
.size func_0010E190, .-func_0010E190

.section .text.func_0011760C,"ax",%progbits
.balign 4
.global func_0011760C
.type func_0011760C, %function
func_0011760C:
.Lfunc_0011760C_0:
	add	r0, r0, #1536
.Lfunc_0011760C_4:
	ldrsb	r0, [r0, #72]
.Lfunc_0011760C_8:
	bx	lr
.size func_0011760C, .-func_0011760C

.section .text.func_0011775C,"ax",%progbits
.balign 4
.global func_0011775C
.type func_0011775C, %function
func_0011775C:
.Lfunc_0011775C_0:
	ldr	r1, [r0, #4]
.Lfunc_0011775C_4:
	ldrd	r0, [r1, #8]
.Lfunc_0011775C_8:
	bx	lr
.size func_0011775C, .-func_0011775C

.section .text.func_0011C268,"ax",%progbits
.balign 4
.global func_0011C268
.type func_0011C268, %function
func_0011C268:
.Lfunc_0011C268_0:
	add	r0, r0, #4
.Lfunc_0011C268_4:
	stm	r0, {r1, r2}
.Lfunc_0011C268_8:
	bx	lr
.size func_0011C268, .-func_0011C268

.section .text.func_0011F9D0,"ax",%progbits
.balign 4
.global func_0011F9D0
.type func_0011F9D0, %function
func_0011F9D0:
.Lfunc_0011F9D0_0:
	add	r0, r0, #1024
.Lfunc_0011F9D0_4:
	add	r0, r0, #200
.Lfunc_0011F9D0_8:
	bx	lr
.size func_0011F9D0, .-func_0011F9D0

.section .text.func_0011F9DC,"ax",%progbits
.balign 4
.global func_0011F9DC
.type func_0011F9DC, %function
func_0011F9DC:
.Lfunc_0011F9DC_0:
	add	r0, r0, #1024
.Lfunc_0011F9DC_4:
	add	r0, r0, #150
.Lfunc_0011F9DC_8:
	bx	lr
.size func_0011F9DC, .-func_0011F9DC

.section .text.func_00136708,"ax",%progbits
.balign 4
.global func_00136708
.type func_00136708, %function
func_00136708:
.Lfunc_00136708_0:
	add	r0, r1, r1, lsl #1
.Lfunc_00136708_4:
	lsl	r0, r0, #5
.Lfunc_00136708_8:
	bx	lr
.size func_00136708, .-func_00136708

.section .text.func_0015287C,"ax",%progbits
.balign 4
.global func_0015287C
.type func_0015287C, %function
func_0015287C:
.Lfunc_0015287C_0:
	ldr	r0, [r0, #12]
.Lfunc_0015287C_4:
	ldrh	r0, [r0, #8]
.Lfunc_0015287C_8:
	bx	lr
.size func_0015287C, .-func_0015287C

.section .text.func_00153764,"ax",%progbits
.balign 4
.global func_00153764
.type func_00153764, %function
func_00153764:
.Lfunc_00153764_0:
	mov	r1, #1
.Lfunc_00153764_4:
	str	r1, [r0]
.Lfunc_00153764_8:
	bx	lr
.size func_00153764, .-func_00153764

.section .text.func_00153770,"ax",%progbits
.balign 4
.global func_00153770
.type func_00153770, %function
func_00153770:
.Lfunc_00153770_0:
	mrc	15, 0, r0, c13, c0, 3
.Lfunc_00153770_4:
	add	r0, r0, #92
.Lfunc_00153770_8:
	bx	lr
.size func_00153770, .-func_00153770

.section .text.func_00165B78,"ax",%progbits
.balign 4
.global func_00165B78
.type func_00165B78, %function
func_00165B78:
.Lfunc_00165B78_0:
	add	r0, r0, r0, lsl #1
.Lfunc_00165B78_4:
	lsl	r0, r0, #2
.Lfunc_00165B78_8:
	bx	lr
.size func_00165B78, .-func_00165B78

.section .text.func_00170F08,"ax",%progbits
.balign 4
.global func_00170F08
.type func_00170F08, %function
func_00170F08:
.Lfunc_00170F08_0:
	add	r0, r0, #72
.Lfunc_00170F08_4:
	stm	r0, {r1, r2}
.Lfunc_00170F08_8:
	bx	lr
.size func_00170F08, .-func_00170F08

.section .text.func_00172348,"ax",%progbits
.balign 4
.global func_00172348
.type func_00172348, %function
func_00172348:
.Lfunc_00172348_0:
	ldr	r0, [r0, #96]
.Lfunc_00172348_4:
	ldr	r0, [r0, r1, lsl #2]
.Lfunc_00172348_8:
	bx	lr
.size func_00172348, .-func_00172348

.section .text.func_001D8D40,"ax",%progbits
.balign 4
.global func_001D8D40
.type func_001D8D40, %function
func_001D8D40:
.Lfunc_001D8D40_0:
	mov	r1, #1
.Lfunc_001D8D40_4:
	strb	r1, [r0, #180]
.Lfunc_001D8D40_8:
	bx	lr
.size func_001D8D40, .-func_001D8D40

.section .text.func_001DE0A4,"ax",%progbits
.balign 4
.global func_001DE0A4
.type func_001DE0A4, %function
func_001DE0A4:
.Lfunc_001DE0A4_0:
	mov	r1, #1
.Lfunc_001DE0A4_4:
	strb	r1, [r0, #176]
.Lfunc_001DE0A4_8:
	bx	lr
.size func_001DE0A4, .-func_001DE0A4

.section .text.func_001DF24C,"ax",%progbits
.balign 4
.global func_001DF24C
.type func_001DF24C, %function
func_001DF24C:
.Lfunc_001DF24C_0:
	mov	r1, #1
.Lfunc_001DF24C_4:
	strb	r1, [r0, #179]
.Lfunc_001DF24C_8:
	bx	lr
.size func_001DF24C, .-func_001DF24C

.section .text.func_001DF7E4,"ax",%progbits
.balign 4
.global func_001DF7E4
.type func_001DF7E4, %function
func_001DF7E4:
.Lfunc_001DF7E4_0:
	mov	r1, #0
.Lfunc_001DF7E4_4:
	str	r1, [r0, #184]
.Lfunc_001DF7E4_8:
	bx	lr
.size func_001DF7E4, .-func_001DF7E4

.section .text.func_001E0518,"ax",%progbits
.balign 4
.global func_001E0518
.type func_001E0518, %function
func_001E0518:
.Lfunc_001E0518_0:
	mov	r1, #1
.Lfunc_001E0518_4:
	strb	r1, [r0, #177]
.Lfunc_001E0518_8:
	bx	lr
.size func_001E0518, .-func_001E0518

.section .text.func_001E0A44,"ax",%progbits
.balign 4
.global func_001E0A44
.type func_001E0A44, %function
func_001E0A44:
.Lfunc_001E0A44_0:
	mov	r1, #1
.Lfunc_001E0A44_4:
	strb	r1, [r0, #178]
.Lfunc_001E0A44_8:
	bx	lr
.size func_001E0A44, .-func_001E0A44

.section .text.func_001FAD38,"ax",%progbits
.balign 4
.global func_001FAD38
.type func_001FAD38, %function
func_001FAD38:
.Lfunc_001FAD38_0:
	ldr	r0, [r0, #8]
.Lfunc_001FAD38_4:
	ldr	r0, [r0, #8]
.Lfunc_001FAD38_8:
	bx	lr
.size func_001FAD38, .-func_001FAD38

.section .text.func_002066F0,"ax",%progbits
.balign 4
.global func_002066F0
.type func_002066F0, %function
func_002066F0:
.Lfunc_002066F0_0:
	rev	r1, r1
.Lfunc_002066F0_4:
	str	r1, [r0, #8]
.Lfunc_002066F0_8:
	bx	lr
.size func_002066F0, .-func_002066F0

.section .text.func_002066FC,"ax",%progbits
.balign 4
.global func_002066FC
.type func_002066FC, %function
func_002066FC:
.Lfunc_002066FC_0:
	rev16	r1, r1
.Lfunc_002066FC_4:
	strh	r1, [r0, #6]
.Lfunc_002066FC_8:
	bx	lr
.size func_002066FC, .-func_002066FC

.section .text.func_0024CEEC,"ax",%progbits
.balign 4
.global func_0024CEEC
.type func_0024CEEC, %function
func_0024CEEC:
.Lfunc_0024CEEC_0:
	ldr	r0, [r0, #48]
.Lfunc_0024CEEC_4:
	str	r2, [r0, r1, lsl #2]
.Lfunc_0024CEEC_8:
	bx	lr
.size func_0024CEEC, .-func_0024CEEC

.section .text.func_00257DE8,"ax",%progbits
.balign 4
.global func_00257DE8
.type func_00257DE8, %function
func_00257DE8:
.Lfunc_00257DE8_0:
	mov	r1, #0
.Lfunc_00257DE8_4:
	str	r1, [r0, #36]
.Lfunc_00257DE8_8:
	bx	lr
.size func_00257DE8, .-func_00257DE8
```
