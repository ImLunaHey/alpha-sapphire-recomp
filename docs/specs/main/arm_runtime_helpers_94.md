# Probe-verified ARM runtime/helper batch 94

Source SHA-256: `3458fa03629edb3e807d0149cf23ef276e39eff1863dd9e52ddf88c7539ca0f8`

## Scope and provenance

This clean-room analysis specification covers nine currently unmatched
ARM-state, call-free helpers totaling 108 executable body bytes (27
instructions). Evidence was limited to the current unmatched report, the
neutral symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, and an independently
assembled exact-schedule probe. The target is revision `AS_EUR_REV2`; GNU Arm
binutils 2.45.1 was used in ARMv6K/VFPv2 mode on 2026-10-17.

Every selected function has a complete symbol-bounded body, no overlap with any
other selected or configured body, no direct or indirect call, no direct
branch, no relocation, no PC-relative data access, no adjacent data, and no
embedded private string or asset. Every selected report entry is unmatched at
zero percent. Independent assembly reproduced all 108 target bytes with a
zero-byte exact diff.

All selected bodies have target multiplicity one. The cohort exhausts the
eligible unique 12-byte ARM leaf population following batch 93 in neutral-
inventory address order. The only later unmatched 12-byte ARM body is a
non-returning direct-transfer stub; earlier unowned 12-byte bodies contain a
PC-relative load, call, tail transfer, indirect transfer, or Thumb code and
were excluded.

## Structural and boundary inventory

| Function | Section | Bytes | Instructions | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_004C88B8` | `.text.func_004C88B8` | 12 | 3 | 0 | 2 | 1 | `func_004C88C4` |
| `func_004C88C4` | `.text.func_004C88C4` | 12 | 3 | 0 | 2 | 1 | `func_004C88D0` |
| `func_004C8910` | `.text.func_004C8910` | 12 | 3 | 0 | 2 | 1 | `func_004C891C` |
| `func_004C8A20` | `.text.func_004C8A20` | 12 | 3 | 0 | 2 | 1 | `func_004C8A2C` |
| `func_004C8FD0` | `.text.func_004C8FD0` | 12 | 3 | 0 | 2 | 1 | `func_004C8FDC` |
| `func_004C9140` | `.text.func_004C9140` | 12 | 3 | 0 | 2 | 1 | `func_004C9640` |
| `func_004C99FC` | `.text.func_004C99FC` | 12 | 3 | 0 | 2 | 1 | `func_004C9A08` |
| `func_004C9A08` | `.text.func_004C9A08` | 12 | 3 | 0 | 2 | 1 | `func_004C9A14` |
| `func_004CC380` | `.text.func_004CC380` | 12 | 3 | 0 | 2 | 1 | `func_004CC38C` |

Memory-operation counts include scalar and VFP loads. Returns are excluded from
the local-branch count. Totals are 27 instructions, 0 local branches, 9 return
sites, and 18 memory operations. There are no direct branch sites, external
transfers, calls, or PC-relative data accesses.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`ac4b5d8fe00fc8e186e9093ca5c06e6f3f6add76e4d215ef03d0f718a31b9a92`.
The canonical direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The canonical return-transfer schedule SHA-256 is
`b877b16a8a8543405f7cabb90ca7da99b9e8bb900c3d4fbd94fb178393683b18`.
Canonical entries are `name:offset:mnemonic:operands`, joined with newlines and
no terminal newline. Offsets are lowercase hexadecimal without an `0x` prefix.
All three hashes were reproduced independently from the bounded target sections
and the exact-schedule probe.

The “next global” values are boundary cross-checks from the neutral inventory;
they do not assert address contiguity. Each owned section ends at its stated
size and has a zero-byte adjacent-data schedule.

## Uniqueness, collision, and reference audit

The exported names are pairwise distinct and absent from all 22,059 string
leaves (7,381 distinct strings) in the 243 pre-existing top-level JSON configs.
The recursive audit includes owners, aliases, branch destinations, direct-
transfer symbols, identity members, next-global annotations, and secondary-
entry identities; no referenced configured interval overlaps a selected
interval. The neutral inventory has no alternate symbol at a selected start and
no nested global entry in a selected interval. Selected intervals are pairwise
disjoint.

Hashing each complete selected body against all 10,440 target function sections
gave multiplicity one for every member; the selected bodies are therefore also
pairwise byte-distinct. Section-scoped relocation audits of both target and
probe found zero relocations. The authoritative report accounts for all 108
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

.section .text.func_004C88B8,"ax",%progbits
.balign 4
.global func_004C88B8
.type func_004C88B8, %function
func_004C88B8:
.Lfunc_004C88B8_0:
	ldr	r0, [r0, #4]
.Lfunc_004C88B8_4:
	ldrh	r0, [r0, #10]
.Lfunc_004C88B8_8:
	bx	lr
.size func_004C88B8, .-func_004C88B8

.section .text.func_004C88C4,"ax",%progbits
.balign 4
.global func_004C88C4
.type func_004C88C4, %function
func_004C88C4:
.Lfunc_004C88C4_0:
	ldr	r0, [r0, #4]
.Lfunc_004C88C4_4:
	ldr	r0, [r0, #188]
.Lfunc_004C88C4_8:
	bx	lr
.size func_004C88C4, .-func_004C88C4

.section .text.func_004C8910,"ax",%progbits
.balign 4
.global func_004C8910
.type func_004C8910, %function
func_004C8910:
.Lfunc_004C8910_0:
	ldr	r0, [r0, #4]
.Lfunc_004C8910_4:
	ldrsb	r0, [r0, #7]
.Lfunc_004C8910_8:
	bx	lr
.size func_004C8910, .-func_004C8910

.section .text.func_004C8A20,"ax",%progbits
.balign 4
.global func_004C8A20
.type func_004C8A20, %function
func_004C8A20:
.Lfunc_004C8A20_0:
	ldr	r0, [r0, #4]
.Lfunc_004C8A20_4:
	ldr	r0, [r0, #16]
.Lfunc_004C8A20_8:
	bx	lr
.size func_004C8A20, .-func_004C8A20

.section .text.func_004C8FD0,"ax",%progbits
.balign 4
.global func_004C8FD0
.type func_004C8FD0, %function
func_004C8FD0:
.Lfunc_004C8FD0_0:
	ldr	r0, [r0, #12]
.Lfunc_004C8FD0_4:
	vldr	s0, [r0, #8]
.Lfunc_004C8FD0_8:
	bx	lr
.size func_004C8FD0, .-func_004C8FD0

.section .text.func_004C9140,"ax",%progbits
.balign 4
.global func_004C9140
.type func_004C9140, %function
func_004C9140:
.Lfunc_004C9140_0:
	ldr	r0, [r0, #12]
.Lfunc_004C9140_4:
	ldr	r0, [r0, #16]
.Lfunc_004C9140_8:
	bx	lr
.size func_004C9140, .-func_004C9140

.section .text.func_004C99FC,"ax",%progbits
.balign 4
.global func_004C99FC
.type func_004C99FC, %function
func_004C99FC:
.Lfunc_004C99FC_0:
	ldr	r0, [r0, #12]
.Lfunc_004C99FC_4:
	ldrb	r0, [r0, #24]
.Lfunc_004C99FC_8:
	bx	lr
.size func_004C99FC, .-func_004C99FC

.section .text.func_004C9A08,"ax",%progbits
.balign 4
.global func_004C9A08
.type func_004C9A08, %function
func_004C9A08:
.Lfunc_004C9A08_0:
	ldr	r0, [r0, #12]
.Lfunc_004C9A08_4:
	ldr	r0, [r0, #28]
.Lfunc_004C9A08_8:
	bx	lr
.size func_004C9A08, .-func_004C9A08

.section .text.func_004CC380,"ax",%progbits
.balign 4
.global func_004CC380
.type func_004CC380, %function
func_004CC380:
.Lfunc_004CC380_0:
	ldr	r0, [r0, #32]
.Lfunc_004CC380_4:
	vldr	s0, [r0, #20]
.Lfunc_004CC380_8:
	bx	lr
.size func_004CC380, .-func_004CC380
```

## Implementation contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4.
- Export exactly one default-visible global function symbol spanning each body.
- Preserve ARM state and exactly one `$a` mapping symbol at each body start.
- Preserve all 27 instructions and all operand spellings/order shown above.
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
