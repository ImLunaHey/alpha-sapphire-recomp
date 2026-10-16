# Probe-verified ARM runtime/helper batch 93

Source SHA-256: `ca4db5f785de03461be75a916f44a3052543bfe8ffc7f325673b9e07bbee227d`

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
unique 12-byte leaf population after batch 92 in neutral-inventory address
order; literal-pool wrappers, direct-transfer stubs, indirect transfers,
configured symbols, and non-returning function prefixes were excluded.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_004112AC` | `.text.func_004112AC` | 12 | 3 | 0 | 1 | 1 | `func_004112B8` |
| `func_004219B0` | `.text.func_004219B0` | 12 | 3 | 0 | 1 | 1 | `func_004219C4` |
| `func_00428598` | `.text.func_00428598` | 12 | 3 | 0 | 1 | 1 | `func_004285A4` |
| `func_0042FEE8` | `.text.func_0042FEE8` | 12 | 3 | 0 | 1 | 1 | `func_0042FEF4` |
| `func_00434538` | `.text.func_00434538` | 12 | 3 | 0 | 1 | 1 | `func_00434544` |
| `func_00437A08` | `.text.func_00437A08` | 12 | 3 | 0 | 1 | 1 | `func_00437DEC` |
| `func_0045BA1C` | `.text.func_0045BA1C` | 12 | 3 | 0 | 1 | 1 | `func_0045BAC8` |
| `func_0045CD04` | `.text.func_0045CD04` | 12 | 3 | 0 | 2 | 1 | `func_0045CD10` |
| `func_0045CD10` | `.text.func_0045CD10` | 12 | 3 | 0 | 2 | 1 | `func_0045CECC` |
| `func_0045EC3C` | `.text.func_0045EC3C` | 12 | 3 | 0 | 1 | 1 | `func_0045ECC0` |
| `func_00465228` | `.text.func_00465228` | 12 | 3 | 0 | 2 | 1 | `func_0046536C` |
| `func_004A6CD4` | `.text.func_004A6CD4` | 12 | 3 | 0 | 1 | 1 | `func_004A711C` |
| `func_004A711C` | `.text.func_004A711C` | 12 | 3 | 0 | 1 | 1 | `func_004A76A0` |
| `func_004A9F08` | `.text.func_004A9F08` | 12 | 3 | 0 | 1 | 1 | `func_004A9F64` |
| `func_004AAD0C` | `.text.func_004AAD0C` | 12 | 3 | 0 | 1 | 1 | `func_004AAD18` |
| `func_004B0B08` | `.text.func_004B0B08` | 12 | 3 | 0 | 1 | 1 | `func_004B0B8C` |
| `func_004B223C` | `.text.func_004B223C` | 12 | 3 | 0 | 1 | 1 | `func_004B2294` |
| `func_004BF8DC` | `.text.func_004BF8DC` | 12 | 3 | 0 | 1 | 1 | `func_004BF8E8` |
| `func_004BF8E8` | `.text.func_004BF8E8` | 12 | 3 | 0 | 1 | 1 | `func_004BF8F4` |
| `func_004C22E4` | `.text.func_004C22E4` | 12 | 3 | 0 | 1 | 1 | `func_004C22F0` |
| `func_004C6500` | `.text.func_004C6500` | 12 | 3 | 0 | 2 | 1 | `func_004C6684` |
| `func_004C7EA4` | `.text.func_004C7EA4` | 12 | 3 | 0 | 2 | 1 | `func_004C7EDC` |
| `func_004C865C` | `.text.func_004C865C` | 12 | 3 | 0 | 2 | 1 | `func_004C8668` |
| `func_004C8808` | `.text.func_004C8808` | 12 | 3 | 0 | 2 | 1 | `func_004C8814` |

Memory-operation counts include scalar, multiple, VFP, and stack transfers.
Returns are excluded from the local-branch count. Totals are 72 instructions,
0 local branches, 24 return sites, and 31 memory operations. There are no
direct branch sites, external transfers, calls, or PC-relative data accesses.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`772a2381b25904d0645fc1506d37aeca0d7f0ff9625668b951bb3a03b035874f`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`34358630c9f70559b3532d95e6080f6f9af45698b363ab63ce1635def2195eef`.
Canonical entries are `name:offset:mnemonic:operands` for instructions and
returns, and `name:offset:mnemonic:target` for direct branches, joined with
newlines and no terminal newline. Offsets are lowercase hexadecimal without an
`0x` prefix. All three hashes were reproduced independently from the bounded
target sections and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 21,372 string
leaves (7,281 distinct strings) in the 240 pre-existing top-level JSON configs.
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

.section .text.func_004112AC,"ax",%progbits
.balign 4
.global func_004112AC
.type func_004112AC, %function
func_004112AC:
.Lfunc_004112AC_0:
	mov	r1, #0
.Lfunc_004112AC_4:
	strb	r1, [r0]
.Lfunc_004112AC_8:
	bx	lr
.size func_004112AC, .-func_004112AC

.section .text.func_004219B0,"ax",%progbits
.balign 4
.global func_004219B0
.type func_004219B0, %function
func_004219B0:
.Lfunc_004219B0_0:
	mov	r1, #0
.Lfunc_004219B0_4:
	strb	r1, [r0, #21]
.Lfunc_004219B0_8:
	bx	lr
.size func_004219B0, .-func_004219B0

.section .text.func_00428598,"ax",%progbits
.balign 4
.global func_00428598
.type func_00428598, %function
func_00428598:
.Lfunc_00428598_0:
	add	r0, r0, #256
.Lfunc_00428598_4:
	ldrsb	r0, [r0, #8]
.Lfunc_00428598_8:
	bx	lr
.size func_00428598, .-func_00428598

.section .text.func_0042FEE8,"ax",%progbits
.balign 4
.global func_0042FEE8
.type func_0042FEE8, %function
func_0042FEE8:
.Lfunc_0042FEE8_0:
	mov	r1, #1
.Lfunc_0042FEE8_4:
	strb	r1, [r0, #64]
.Lfunc_0042FEE8_8:
	bx	lr
.size func_0042FEE8, .-func_0042FEE8

.section .text.func_00434538,"ax",%progbits
.balign 4
.global func_00434538
.type func_00434538, %function
func_00434538:
.Lfunc_00434538_0:
	mov	r1, #1
.Lfunc_00434538_4:
	strb	r1, [r0, #141]
.Lfunc_00434538_8:
	bx	lr
.size func_00434538, .-func_00434538

.section .text.func_00437A08,"ax",%progbits
.balign 4
.global func_00437A08
.type func_00437A08, %function
func_00437A08:
.Lfunc_00437A08_0:
	mov	r1, #1
.Lfunc_00437A08_4:
	strb	r1, [r0, #56]
.Lfunc_00437A08_8:
	bx	lr
.size func_00437A08, .-func_00437A08

.section .text.func_0045BA1C,"ax",%progbits
.balign 4
.global func_0045BA1C
.type func_0045BA1C, %function
func_0045BA1C:
.Lfunc_0045BA1C_0:
	mov	r1, #0
.Lfunc_0045BA1C_4:
	strb	r1, [r0, #6]
.Lfunc_0045BA1C_8:
	bx	lr
.size func_0045BA1C, .-func_0045BA1C

.section .text.func_0045CD04,"ax",%progbits
.balign 4
.global func_0045CD04
.type func_0045CD04, %function
func_0045CD04:
.Lfunc_0045CD04_0:
	ldrb	r1, [r0, #104]
.Lfunc_0045CD04_4:
	strb	r1, [r0, #69]
.Lfunc_0045CD04_8:
	bx	lr
.size func_0045CD04, .-func_0045CD04

.section .text.func_0045CD10,"ax",%progbits
.balign 4
.global func_0045CD10
.type func_0045CD10, %function
func_0045CD10:
.Lfunc_0045CD10_0:
	ldrb	r1, [r0, #69]
.Lfunc_0045CD10_4:
	strb	r1, [r0, #104]
.Lfunc_0045CD10_8:
	bx	lr
.size func_0045CD10, .-func_0045CD10

.section .text.func_0045EC3C,"ax",%progbits
.balign 4
.global func_0045EC3C
.type func_0045EC3C, %function
func_0045EC3C:
.Lfunc_0045EC3C_0:
	mov	r1, #0
.Lfunc_0045EC3C_4:
	strb	r1, [r0, #11]
.Lfunc_0045EC3C_8:
	bx	lr
.size func_0045EC3C, .-func_0045EC3C

.section .text.func_00465228,"ax",%progbits
.balign 4
.global func_00465228
.type func_00465228, %function
func_00465228:
.Lfunc_00465228_0:
	ldr	r1, [r0, #8]
.Lfunc_00465228_4:
	str	r1, [r0, #12]
.Lfunc_00465228_8:
	bx	lr
.size func_00465228, .-func_00465228

.section .text.func_004A6CD4,"ax",%progbits
.balign 4
.global func_004A6CD4
.type func_004A6CD4, %function
func_004A6CD4:
.Lfunc_004A6CD4_0:
	add	r0, r0, #256
.Lfunc_004A6CD4_4:
	ldrsb	r0, [r0, #194]
.Lfunc_004A6CD4_8:
	bx	lr
.size func_004A6CD4, .-func_004A6CD4

.section .text.func_004A711C,"ax",%progbits
.balign 4
.global func_004A711C
.type func_004A711C, %function
func_004A711C:
.Lfunc_004A711C_0:
	add	r0, r0, #256
.Lfunc_004A711C_4:
	ldrsb	r0, [r0, #195]
.Lfunc_004A711C_8:
	bx	lr
.size func_004A711C, .-func_004A711C

.section .text.func_004A9F08,"ax",%progbits
.balign 4
.global func_004A9F08
.type func_004A9F08, %function
func_004A9F08:
.Lfunc_004A9F08_0:
	ldrd	r0, [r0, #48]
.Lfunc_004A9F08_4:
	sub	r0, r1, r0
.Lfunc_004A9F08_8:
	bx	lr
.size func_004A9F08, .-func_004A9F08

.section .text.func_004AAD0C,"ax",%progbits
.balign 4
.global func_004AAD0C
.type func_004AAD0C, %function
func_004AAD0C:
.Lfunc_004AAD0C_0:
	ldrh	r0, [r0, #6]
.Lfunc_004AAD0C_4:
	rev16	r0, r0
.Lfunc_004AAD0C_8:
	bx	lr
.size func_004AAD0C, .-func_004AAD0C

.section .text.func_004B0B08,"ax",%progbits
.balign 4
.global func_004B0B08
.type func_004B0B08, %function
func_004B0B08:
.Lfunc_004B0B08_0:
	ldrd	r0, [r0, #12]
.Lfunc_004B0B08_4:
	sub	r0, r1, r0
.Lfunc_004B0B08_8:
	bx	lr
.size func_004B0B08, .-func_004B0B08

.section .text.func_004B223C,"ax",%progbits
.balign 4
.global func_004B223C
.type func_004B223C, %function
func_004B223C:
.Lfunc_004B223C_0:
	add	r0, r0, #4096
.Lfunc_004B223C_4:
	ldr	r0, [r0, #320]
.Lfunc_004B223C_8:
	bx	lr
.size func_004B223C, .-func_004B223C

.section .text.func_004BF8DC,"ax",%progbits
.balign 4
.global func_004BF8DC
.type func_004BF8DC, %function
func_004BF8DC:
.Lfunc_004BF8DC_0:
	ldr	r1, [r0, #28]
.Lfunc_004BF8DC_4:
	add	r0, r0, r1
.Lfunc_004BF8DC_8:
	bx	lr
.size func_004BF8DC, .-func_004BF8DC

.section .text.func_004BF8E8,"ax",%progbits
.balign 4
.global func_004BF8E8
.type func_004BF8E8, %function
func_004BF8E8:
.Lfunc_004BF8E8_0:
	ldr	r1, [r0, #20]
.Lfunc_004BF8E8_4:
	add	r0, r0, r1
.Lfunc_004BF8E8_8:
	bx	lr
.size func_004BF8E8, .-func_004BF8E8

.section .text.func_004C22E4,"ax",%progbits
.balign 4
.global func_004C22E4
.type func_004C22E4, %function
func_004C22E4:
.Lfunc_004C22E4_0:
	ldr	r0, [r0, #4]
.Lfunc_004C22E4_4:
	add	r0, r0, r1
.Lfunc_004C22E4_8:
	bx	lr
.size func_004C22E4, .-func_004C22E4

.section .text.func_004C6500,"ax",%progbits
.balign 4
.global func_004C6500
.type func_004C6500, %function
func_004C6500:
.Lfunc_004C6500_0:
	ldr	r0, [r0, #28]
.Lfunc_004C6500_4:
	ldr	r0, [r0, r1, lsl #3]
.Lfunc_004C6500_8:
	bx	lr
.size func_004C6500, .-func_004C6500

.section .text.func_004C7EA4,"ax",%progbits
.balign 4
.global func_004C7EA4
.type func_004C7EA4, %function
func_004C7EA4:
.Lfunc_004C7EA4_0:
	ldr	r0, [r0, #48]
.Lfunc_004C7EA4_4:
	ldrsb	r0, [r0]
.Lfunc_004C7EA4_8:
	bx	lr
.size func_004C7EA4, .-func_004C7EA4

.section .text.func_004C865C,"ax",%progbits
.balign 4
.global func_004C865C
.type func_004C865C, %function
func_004C865C:
.Lfunc_004C865C_0:
	ldr	r0, [r0, #376]
.Lfunc_004C865C_4:
	ldr	r0, [r0, #8]
.Lfunc_004C865C_8:
	bx	lr
.size func_004C865C, .-func_004C865C

.section .text.func_004C8808,"ax",%progbits
.balign 4
.global func_004C8808
.type func_004C8808, %function
func_004C8808:
.Lfunc_004C8808_0:
	ldr	r0, [r0, #4]
.Lfunc_004C8808_4:
	ldrsb	r0, [r0, #5]
.Lfunc_004C8808_8:
	bx	lr
.size func_004C8808, .-func_004C8808
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
