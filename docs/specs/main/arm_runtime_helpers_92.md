# Probe-verified ARM runtime/helper batch 92

Source SHA-256: `59ab0b6fcf07bb777f303ca9130b6a349876708e42b20e96f7760e42f2941eed`

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

All selected bodies have target multiplicity one. The cohort continues the
unique 12-byte leaf population after batch 91 in neutral-inventory address
order; literal-pool wrappers, direct-transfer stubs, indirect transfers, and
configured symbols were excluded.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_002AFFD0` | `.text.func_002AFFD0` | 12 | 3 | 0 | 1 | 1 | `func_002AFFDC` |
| `func_002B0398` | `.text.func_002B0398` | 12 | 3 | 0 | 2 | 1 | `func_002B03A4` |
| `func_002B03A4` | `.text.func_002B03A4` | 12 | 3 | 0 | 2 | 1 | `func_002B03D0` |
| `func_002BAE04` | `.text.func_002BAE04` | 12 | 3 | 0 | 0 | 1 | `func_002BAE10` |
| `func_002C2378` | `.text.func_002C2378` | 12 | 3 | 0 | 1 | 1 | `func_002C2384` |
| `func_002C2B90` | `.text.func_002C2B90` | 12 | 3 | 0 | 1 | 1 | `func_002C2B9C` |
| `func_002C2F44` | `.text.func_002C2F44` | 12 | 3 | 0 | 1 | 1 | `func_002C2F60` |
| `func_00320908` | `.text.func_00320908` | 12 | 3 | 0 | 1 | 1 | `func_00320988` |
| `func_0032EAA8` | `.text.func_0032EAA8` | 12 | 3 | 0 | 1 | 1 | `func_0032EAB4` |
| `func_0032EBA4` | `.text.func_0032EBA4` | 12 | 3 | 0 | 1 | 1 | `func_0032EBB0` |
| `func_0032ECA4` | `.text.func_0032ECA4` | 12 | 3 | 0 | 1 | 1 | `func_0032ECB0` |
| `func_0032F210` | `.text.func_0032F210` | 12 | 3 | 0 | 2 | 1 | `func_0032F3E8` |
| `func_00333030` | `.text.func_00333030` | 12 | 3 | 0 | 2 | 1 | `func_0033303C` |
| `func_00339B4C` | `.text.func_00339B4C` | 12 | 3 | 0 | 1 | 1 | `func_00339EB4` |
| `func_00346980` | `.text.func_00346980` | 12 | 3 | 0 | 1 | 1 | `func_00346994` |
| `func_0034B0C0` | `.text.func_0034B0C0` | 12 | 3 | 0 | 1 | 1 | `func_0034B0CC` |
| `func_003617AC` | `.text.func_003617AC` | 12 | 3 | 0 | 1 | 1 | `func_003617B8` |
| `func_003617B8` | `.text.func_003617B8` | 12 | 3 | 0 | 2 | 1 | `func_003617D8` |
| `func_00371C04` | `.text.func_00371C04` | 12 | 3 | 0 | 2 | 1 | `func_00371C28` |
| `func_003989F0` | `.text.func_003989F0` | 12 | 3 | 0 | 2 | 1 | `func_00398ADC` |
| `func_003CBAD0` | `.text.func_003CBAD0` | 12 | 3 | 0 | 0 | 1 | `func_003CBD34` |
| `func_003D465C` | `.text.func_003D465C` | 12 | 3 | 0 | 1 | 1 | `func_003D4668` |
| `func_003DB990` | `.text.func_003DB990` | 12 | 3 | 0 | 1 | 1 | `func_003DB99C` |
| `func_004029DC` | `.text.func_004029DC` | 12 | 3 | 0 | 1 | 1 | `func_004029E8` |

Memory-operation counts include scalar, multiple, VFP, and stack transfers.
Returns are excluded from the local-branch count. Totals are 72 instructions,
0 local branches, 24 return sites, and 29 memory operations. There are no
direct branch sites, external transfers, calls, or PC-relative data accesses.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`6f918f5413a2ecfaea995ae0a7e976e8fbc63132b2e67bcef3926abee6714655`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`fd0ca24c304342de2d62139d244815d4250b71244498979d03c30ef7a51d7d39`.
Canonical entries are `name:offset:mnemonic:operands` for instructions and
returns, and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced independently from the bounded
target sections and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 21,309 string
leaves (7,253 distinct strings) in the 239 pre-existing top-level JSON configs.
The recursive audit includes owners, aliases, branch destinations,
direct-transfer symbols, identity members, next-global annotations, and
secondary-entry identities; no referenced configured interval overlaps a
selected interval. The neutral inventory has no alternate symbol at a selected
start and no nested global entry in a selected interval. Selected intervals
are pairwise disjoint.

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

.section .text.func_002AFFD0,"ax",%progbits
.balign 4
.global func_002AFFD0
.type func_002AFFD0, %function
func_002AFFD0:
.Lfunc_002AFFD0_0:
	add	r0, r0, #20
.Lfunc_002AFFD0_4:
	stm	r0, {r1, r2}
.Lfunc_002AFFD0_8:
	bx	lr
.size func_002AFFD0, .-func_002AFFD0

.section .text.func_002B0398,"ax",%progbits
.balign 4
.global func_002B0398
.type func_002B0398, %function
func_002B0398:
.Lfunc_002B0398_0:
	ldr	r1, [r1, #8]
.Lfunc_002B0398_4:
	str	r1, [r0]
.Lfunc_002B0398_8:
	bx	lr
.size func_002B0398, .-func_002B0398

.section .text.func_002B03A4,"ax",%progbits
.balign 4
.global func_002B03A4
.type func_002B03A4, %function
func_002B03A4:
.Lfunc_002B03A4_0:
	ldr	r1, [r1]
.Lfunc_002B03A4_4:
	str	r1, [r0, #8]
.Lfunc_002B03A4_8:
	bx	lr
.size func_002B03A4, .-func_002B03A4

.section .text.func_002BAE04,"ax",%progbits
.balign 4
.global func_002BAE04
.type func_002BAE04, %function
func_002BAE04:
.Lfunc_002BAE04_0:
	add	r0, r0, r1
.Lfunc_002BAE04_4:
	add	r0, r0, #20
.Lfunc_002BAE04_8:
	bx	lr
.size func_002BAE04, .-func_002BAE04

.section .text.func_002C2378,"ax",%progbits
.balign 4
.global func_002C2378
.type func_002C2378, %function
func_002C2378:
.Lfunc_002C2378_0:
	ldr	r0, [r2]
.Lfunc_002C2378_4:
	and	r0, r0, #261120
.Lfunc_002C2378_8:
	bx	lr
.size func_002C2378, .-func_002C2378

.section .text.func_002C2B90,"ax",%progbits
.balign 4
.global func_002C2B90
.type func_002C2B90, %function
func_002C2B90:
.Lfunc_002C2B90_0:
	mov	r2, #0
.Lfunc_002C2B90_4:
	str	r2, [r0]
.Lfunc_002C2B90_8:
	bx	lr
.size func_002C2B90, .-func_002C2B90

.section .text.func_002C2F44,"ax",%progbits
.balign 4
.global func_002C2F44
.type func_002C2F44, %function
func_002C2F44:
.Lfunc_002C2F44_0:
	mvn	r1, #0
.Lfunc_002C2F44_4:
	str	r1, [r0, #24]
.Lfunc_002C2F44_8:
	bx	lr
.size func_002C2F44, .-func_002C2F44

.section .text.func_00320908,"ax",%progbits
.balign 4
.global func_00320908
.type func_00320908, %function
func_00320908:
.Lfunc_00320908_0:
	mov	r1, #1
.Lfunc_00320908_4:
	strb	r1, [r0, #735]
.Lfunc_00320908_8:
	bx	lr
.size func_00320908, .-func_00320908

.section .text.func_0032EAA8,"ax",%progbits
.balign 4
.global func_0032EAA8
.type func_0032EAA8, %function
func_0032EAA8:
.Lfunc_0032EAA8_0:
	mov	r1, #1
.Lfunc_0032EAA8_4:
	strb	r1, [r0, #148]
.Lfunc_0032EAA8_8:
	bx	lr
.size func_0032EAA8, .-func_0032EAA8

.section .text.func_0032EBA4,"ax",%progbits
.balign 4
.global func_0032EBA4
.type func_0032EBA4, %function
func_0032EBA4:
.Lfunc_0032EBA4_0:
	mov	r1, #0
.Lfunc_0032EBA4_4:
	str	r1, [r0, #20]
.Lfunc_0032EBA4_8:
	bx	lr
.size func_0032EBA4, .-func_0032EBA4

.section .text.func_0032ECA4,"ax",%progbits
.balign 4
.global func_0032ECA4
.type func_0032ECA4, %function
func_0032ECA4:
.Lfunc_0032ECA4_0:
	mov	r1, #0
.Lfunc_0032ECA4_4:
	str	r1, [r0, #24]
.Lfunc_0032ECA4_8:
	bx	lr
.size func_0032ECA4, .-func_0032ECA4

.section .text.func_0032F210,"ax",%progbits
.balign 4
.global func_0032F210
.type func_0032F210, %function
func_0032F210:
.Lfunc_0032F210_0:
	ldr	r1, [r0, #12]
.Lfunc_0032F210_4:
	str	r1, [r0, #20]
.Lfunc_0032F210_8:
	bx	lr
.size func_0032F210, .-func_0032F210

.section .text.func_00333030,"ax",%progbits
.balign 4
.global func_00333030
.type func_00333030, %function
func_00333030:
.Lfunc_00333030_0:
	vstr	s0, [r0, #264]
.Lfunc_00333030_4:
	strb	r1, [r0, #254]
.Lfunc_00333030_8:
	bx	lr
.size func_00333030, .-func_00333030

.section .text.func_00339B4C,"ax",%progbits
.balign 4
.global func_00339B4C
.type func_00339B4C, %function
func_00339B4C:
.Lfunc_00339B4C_0:
	mov	r1, #0
.Lfunc_00339B4C_4:
	strb	r1, [r0, #18]
.Lfunc_00339B4C_8:
	bx	lr
.size func_00339B4C, .-func_00339B4C

.section .text.func_00346980,"ax",%progbits
.balign 4
.global func_00346980
.type func_00346980, %function
func_00346980:
.Lfunc_00346980_0:
	add	r0, r0, r1, lsl #3
.Lfunc_00346980_4:
	ldr	r0, [r0, #8]
.Lfunc_00346980_8:
	bx	lr
.size func_00346980, .-func_00346980

.section .text.func_0034B0C0,"ax",%progbits
.balign 4
.global func_0034B0C0
.type func_0034B0C0, %function
func_0034B0C0:
.Lfunc_0034B0C0_0:
	mov	r1, #1
.Lfunc_0034B0C0_4:
	strb	r1, [r0, #36]
.Lfunc_0034B0C0_8:
	bx	lr
.size func_0034B0C0, .-func_0034B0C0

.section .text.func_003617AC,"ax",%progbits
.balign 4
.global func_003617AC
.type func_003617AC, %function
func_003617AC:
.Lfunc_003617AC_0:
	add	r0, r0, #28
.Lfunc_003617AC_4:
	stm	r0, {r1, r2}
.Lfunc_003617AC_8:
	bx	lr
.size func_003617AC, .-func_003617AC

.section .text.func_003617B8,"ax",%progbits
.balign 4
.global func_003617B8
.type func_003617B8, %function
func_003617B8:
.Lfunc_003617B8_0:
	str	r1, [r0, #40]!
.Lfunc_003617B8_4:
	str	r2, [r0, #8]
.Lfunc_003617B8_8:
	bx	lr
.size func_003617B8, .-func_003617B8

.section .text.func_00371C04,"ax",%progbits
.balign 4
.global func_00371C04
.type func_00371C04, %function
func_00371C04:
.Lfunc_00371C04_0:
	ldr	r0, [r0, #4]
.Lfunc_00371C04_4:
	strb	r1, [r0, #5]
.Lfunc_00371C04_8:
	bx	lr
.size func_00371C04, .-func_00371C04

.section .text.func_003989F0,"ax",%progbits
.balign 4
.global func_003989F0
.type func_003989F0, %function
func_003989F0:
.Lfunc_003989F0_0:
	ldr	r0, [r0, #120]
.Lfunc_003989F0_4:
	strb	r2, [r0, r1]
.Lfunc_003989F0_8:
	bx	lr
.size func_003989F0, .-func_003989F0

.section .text.func_003CBAD0,"ax",%progbits
.balign 4
.global func_003CBAD0
.type func_003CBAD0, %function
func_003CBAD0:
.Lfunc_003CBAD0_0:
	add	r0, r0, #19
.Lfunc_003CBAD0_4:
	uxth	r0, r0
.Lfunc_003CBAD0_8:
	bx	lr
.size func_003CBAD0, .-func_003CBAD0

.section .text.func_003D465C,"ax",%progbits
.balign 4
.global func_003D465C
.type func_003D465C, %function
func_003D465C:
.Lfunc_003D465C_0:
	add	r0, r0, #28
.Lfunc_003D465C_4:
	stm	r0, {r1, r2, r3}
.Lfunc_003D465C_8:
	bx	lr
.size func_003D465C, .-func_003D465C

.section .text.func_003DB990,"ax",%progbits
.balign 4
.global func_003DB990
.type func_003DB990, %function
func_003DB990:
.Lfunc_003DB990_0:
	add	r0, r0, #32
.Lfunc_003DB990_4:
	stm	r0, {r1, r2, r3}
.Lfunc_003DB990_8:
	bx	lr
.size func_003DB990, .-func_003DB990

.section .text.func_004029DC,"ax",%progbits
.balign 4
.global func_004029DC
.type func_004029DC, %function
func_004029DC:
.Lfunc_004029DC_0:
	mov	r1, #0
.Lfunc_004029DC_4:
	strh	r1, [r0, #12]
.Lfunc_004029DC_8:
	bx	lr
.size func_004029DC, .-func_004029DC
```

## Implementation contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4.
- Export exactly one default-visible global function symbol spanning each body.
- Preserve ARM state and exactly one `$a` mapping symbol at each body start.
- Preserve all 72 instructions and all operand spellings/order shown above.
- Emit no relocation, literal pool, adjacent word, alias, nested entry, or extra
  named symbol in an owned section.
- A validator must cap input at 64 MiB, aggregate executable data at 16 MiB,
  sections at 16,384, symbols and relocations independently at 1,000,000, and
  accept a valid composite with at least 12,000 unrelated sections.
- Validate source SHA-256, owned section type/flags/alignment/size, symbol
  binding/type/visibility/span, ARM mapping symbols, exact instruction/return/
  branch schedule hashes, zero owned relocations, completeness, and rejection
  of hostile schedule, mode, relocation, duplicate, truncation, and foreign
  symbol fixtures.
