# Probe-verified ARM runtime/helper batch 97

Source SHA-256: `31c24bab7a22153faa60492ecde8581f91bc45357f77eb09c48fc0a936f4c5c3`

## Scope and provenance

This clean-room analysis specification covers seventeen currently unmatched,
ARM-state, direct-transfer helpers totaling 272 executable body bytes (68
instructions). Evidence was limited to the current unmatched report, neutral
symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, semantic identity
auditing, and an independently assembled and linked exact-schedule probe. The
target is revision `AS_EUR_REV2`; GNU Arm binutils 2.45.1 was used in
ARMv6K/VFPv2 mode on 2026-10-17.

Every selected entry has a complete 16-byte inventory/report extent, no body
overlap, no call, exactly one external tail transfer, and no owned adjacent
data. Sixteen transfer unconditionally; one conditionally transfers or returns.
Five entries address data immediately beyond their body. Those targets remain
external and unowned: four are opaque words and one is an opaque inline
payload. No representation or content from any of those targets is included in
this specification.

Independent assembly followed by placement at the neutral inventory addresses
and resolution against the fourteen canonical transfer identities reproduced
all 272 selected target bytes with a zero-byte exact diff. The relocatable
probe contains exactly seventeen `R_ARM_JUMP24` relocations and no data
relocation. This cohort exhausts the direct-transfer residual identified after
batch 96. The remaining unclaimed 16-byte ARM residual comprises five indirect
transfer stubs, one embedded-address leaf, and one duplicate plain leaf.

## Structural and boundary inventory

| Function | Section | Body | Instructions | External transfers | Local branches | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001096CC` | `.text.func_001096CC` | 16 | 4 | 1 | 0 | 1 | 0 | `func_001096F4` |
| `func_0014870C` | `.text.func_0014870C` | 16 | 4 | 1 | 0 | 2 | 0 | `func_00148720` |
| `func_0026B104` | `.text.func_0026B104` | 16 | 4 | 1 | 0 | 2 | 0 | `func_0026B124` |
| `func_00298E90` | `.text.func_00298E90` | 16 | 4 | 1 | 0 | 0 | 0 | `func_00298EA8` |
| `func_002BAF14` | `.text.func_002BAF14` | 16 | 4 | 1 | 0 | 1 | 0 | `func_002BAF24` |
| `func_00320890` | `.text.func_00320890` | 16 | 4 | 1 | 0 | 0 | 0 | `func_003208A0` |
| `func_00322574` | `.text.func_00322574` | 16 | 4 | 1 | 0 | 0 | 0 | `func_0032288C` |
| `func_0032A060` | `.text.func_0032A060` | 16 | 4 | 1 | 0 | 3 | 0 | `func_0032A074` |
| `func_0032A1D0` | `.text.func_0032A1D0` | 16 | 4 | 1 | 0 | 1 | 0 | `func_0032A410` |
| `func_00417478` | `.text.func_00417478` | 16 | 4 | 1 | 0 | 0 | 0 | `func_00417488` |
| `func_0044F08C` | `.text.func_0044F08C` | 16 | 4 | 1 | 0 | 2 | 0 | `func_0044F0B0` |
| `func_00464B0C` | `.text.func_00464B0C` | 16 | 4 | 1 | 0 | 0 | 0 | `func_00464B1C` |
| `func_00464E78` | `.text.func_00464E78` | 16 | 4 | 1 | 0 | 1 | 0 | `func_00464E94` |
| `func_00465080` | `.text.func_00465080` | 16 | 4 | 1 | 0 | 0 | 0 | `func_00465090` |
| `func_00466E1C` | `.text.func_00466E1C` | 16 | 4 | 1 | 0 | 0 | 0 | `func_00466E2C` |
| `func_004A9E20` | `.text.func_004A9E20` | 16 | 4 | 1 | 0 | 0 | 0 | `func_004A9E30` |
| `func_004C85FC` | `.text.func_004C85FC` | 16 | 4 | 1 | 1 | 0 | 1 | `func_004C860C` |

Stack transfers are counted as memory operations. External tail transfers,
function-local branches, and returns are counted separately. Totals are 68
instructions, 13 memory operations, seventeen external transfers, one
conditional local branch, one return site, five PC-relative data accesses, and
zero owned adjacent bytes. The “next global” values are boundary cross-checks
from the neutral inventory; they do not assert address contiguity or transfer
ownership to any intervening byte.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`632e06f2ff2389d258080ffb7f3b00f8fc01b12d1fa92edbc6fc7049574b983d`.
The direct-branch schedule SHA-256 is
`48bd0c95f5815262582bf6e01a82e3c8a5f7e0418a06c0a367ae07cbd5d71f8e`.
The return-transfer schedule SHA-256 is
`87db12a44747746a28be70ce84e3931e792075fdb8304ffbedf1c7aa41fd53f1`.
The PC-relative access schedule SHA-256 is
`4859d2404f583cb5ad89eef2eb88aa0b4d7da5a41fff2052ff9dcd6a6ffc43ad`.
The relocation schedule SHA-256 is
`896fad00e265a6fcb7442c841f8378923d3d1e9ddf70e3a1fcba0e8658928d19`.

Instruction and return entries use `name:offset:mnemonic:operands`. Direct-
branch entries use `name:offset:mnemonic:target`; PC-relative entries use
`name:offset:mnemonic:targetOffset:symbol`; relocation entries use
`name:offset:type:symbol`. Entries are joined with newlines and no terminal
newline. Offsets, local targets, and target offsets are lowercase hexadecimal
without `0x`.

## Transfer and data identity contract

The seventeen tail sites resolve to fourteen pairwise-distinct, 4-byte-aligned
ARM identities. `func_0017A8E8`, `func_001419C0`, and `func_00144D28` each
serve two sites; the other eleven identities each serve one. Ten identities
are neutral-inventory primary entries. Four are secondary ARM entries and must
retain the following relations:

| Identity | Owner | Owner offset | Next global | Bytes before next global |
| --- | --- | ---: | --- | ---: |
| `runtime_state_init_tail_97` | `func_00117768` | 20 | `func_00117830` | 180 |
| `runtime_object_shutdown_tail_97` | `func_00164AF4` | 496 | `func_00164D2C` | 72 |
| `runtime_record_copy_tail_97` | `func_0016A8A4` | 424 | `func_0016AAD8` | 140 |
| `runtime_fixed_width_transfer_tail_97` | `func_0041728C` | 16 | `func_0041735C` | 192 |

The established identities `func_0012FE3C`, `func_00144D28`,
`func_00160A64`, `func_0017A8E8`, `func_00184020`, `func_0018BF20`, and
`func_002009A4` must be reused. The canonical primary entries
`func_001419C0`, `func_0015EBCC`, and `func_0044D824`, plus the four secondary
identities above, are newly referenced by this configuration. No target is
Thumb-state, and none of the four secondary entries may be replaced with its
owner’s primary entry.

The five PC-relative identities are pairwise distinct and new to the public
configuration reference graph. `runtime_allocator_root_97`,
`runtime_owner_root_97`, `runtime_word_lookup_table_97`, and
`runtime_dispatch_root_97` describe external opaque words.
`runtime_inline_format_payload_97` describes an external opaque inline payload
address. All five targets are 4-byte aligned and immediately follow their
respective function bodies, but remain unowned. They must not be emitted,
resolved to public content, or included in any function symbol span.

The relocation schedule is:

| Function | Offset | Type | Symbol |
| --- | ---: | --- | --- |
| `func_001096CC` | 12 | `R_ARM_JUMP24` | `runtime_state_init_tail_97` |
| `func_0014870C` | 12 | `R_ARM_JUMP24` | `runtime_object_shutdown_tail_97` |
| `func_0026B104` | 12 | `R_ARM_JUMP24` | `func_00160A64` |
| `func_00298E90` | 12 | `R_ARM_JUMP24` | `func_0018BF20` |
| `func_002BAF14` | 12 | `R_ARM_JUMP24` | `func_00184020` |
| `func_00320890` | 12 | `R_ARM_JUMP24` | `func_0017A8E8` |
| `func_00322574` | 12 | `R_ARM_JUMP24` | `func_0017A8E8` |
| `func_0032A060` | 12 | `R_ARM_JUMP24` | `func_001419C0` |
| `func_0032A1D0` | 12 | `R_ARM_JUMP24` | `func_001419C0` |
| `func_00417478` | 12 | `R_ARM_JUMP24` | `runtime_fixed_width_transfer_tail_97` |
| `func_0044F08C` | 12 | `R_ARM_JUMP24` | `func_0044D824` |
| `func_00464B0C` | 12 | `R_ARM_JUMP24` | `func_0015EBCC` |
| `func_00464E78` | 12 | `R_ARM_JUMP24` | `runtime_record_copy_tail_97` |
| `func_00465080` | 12 | `R_ARM_JUMP24` | `func_00144D28` |
| `func_00466E1C` | 12 | `R_ARM_JUMP24` | `func_00144D28` |
| `func_004A9E20` | 12 | `R_ARM_JUMP24` | `func_0012FE3C` |
| `func_004C85FC` | 8 | `R_ARM_JUMP24` | `func_002009A4` |

## Exact independently assembled artifact

The following is the complete canonical source. Preserve its whitespace and
terminal newline so that the source hash remains stable.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global runtime_state_init_tail_97
.global runtime_object_shutdown_tail_97
.global func_00160A64
.global func_0018BF20
.global func_00184020
.global func_0017A8E8
.global func_001419C0
.global runtime_fixed_width_transfer_tail_97
.global func_0044D824
.global func_0015EBCC
.global runtime_record_copy_tail_97
.global func_00144D28
.global func_0012FE3C
.global func_002009A4

.section .text.func_001096CC,"ax",%progbits
.balign 4
.global func_001096CC
.type func_001096CC, %function
func_001096CC:
	ldr	r0, [pc, #8]
	mov	r2, #33554432
	mov	r1, #234881024
	b	runtime_state_init_tail_97
.size func_001096CC, .-func_001096CC

.section .text.func_0014870C,"ax",%progbits
.balign 4
.global func_0014870C
.type func_0014870C, %function
func_0014870C:
	mov	r0, r0
	ldr	r0, [pc, #4]
	ldr	r0, [r0, #28]
	b	runtime_object_shutdown_tail_97
.size func_0014870C, .-func_0014870C

.section .text.func_0026B104,"ax",%progbits
.balign 4
.global func_0026B104
.type func_0026B104, %function
func_0026B104:
	push	{r4, lr}
	mov	r0, r0
	pop	{r4, lr}
	b	func_00160A64
.size func_0026B104, .-func_0026B104

.section .text.func_00298E90,"ax",%progbits
.balign 4
.global func_00298E90
.type func_00298E90, %function
func_00298E90:
	mov	r2, r1
	add	r1, pc, #4
	add	r0, r0, #24
	b	func_0018BF20
.size func_00298E90, .-func_00298E90

.section .text.func_002BAF14,"ax",%progbits
.balign 4
.global func_002BAF14
.type func_002BAF14, %function
func_002BAF14:
	mov	r3, #1504
	strh	r2, [r3, r0]
	add	r0, r0, #20
	b	func_00184020
.size func_002BAF14, .-func_002BAF14

.section .text.func_00320890,"ax",%progbits
.balign 4
.global func_00320890
.type func_00320890, %function
func_00320890:
	mov	r2, r1
	add	r1, r0, #4
	add	r2, r2, #4
	b	func_0017A8E8
.size func_00320890, .-func_00320890

.section .text.func_00322574,"ax",%progbits
.balign 4
.global func_00322574
.type func_00322574, %function
func_00322574:
	add	r0, r0, #28
	mov	r2, r1
	add	r1, r0, #4
	b	func_0017A8E8
.size func_00322574, .-func_00322574

.section .text.func_0032A060,"ax",%progbits
.balign 4
.global func_0032A060
.type func_0032A060, %function
func_0032A060:
	ldr	r2, [pc, #8]
	ldr	r0, [r0, #724]
	ldr	r1, [r2, r1, lsl #2]
	b	func_001419C0
.size func_0032A060, .-func_0032A060

.section .text.func_0032A1D0,"ax",%progbits
.balign 4
.global func_0032A1D0
.type func_0032A1D0, %function
func_0032A1D0:
	add	r0, r0, r1, lsl #2
	mov	r1, r2
	ldr	r0, [r0, #464]
	b	func_001419C0
.size func_0032A1D0, .-func_0032A1D0

.section .text.func_00417478,"ax",%progbits
.balign 4
.global func_00417478
.type func_00417478, %function
func_00417478:
	mov	r2, r1
	mov	r1, #8
	add	r0, r0, #12
	b	runtime_fixed_width_transfer_tail_97
.size func_00417478, .-func_00417478

.section .text.func_0044F08C,"ax",%progbits
.balign 4
.global func_0044F08C
.type func_0044F08C, %function
func_0044F08C:
	mov	r1, r0
	ldr	r0, [pc, #4]
	ldr	r0, [r0, #16]
	b	func_0044D824
.size func_0044F08C, .-func_0044F08C

.section .text.func_00464B0C,"ax",%progbits
.balign 4
.global func_00464B0C
.type func_00464B0C, %function
func_00464B0C:
	add	r0, r0, #256
	mov	r1, #34
	add	r0, r0, #46
	b	func_0015EBCC
.size func_00464B0C, .-func_00464B0C

.section .text.func_00464E78,"ax",%progbits
.balign 4
.global func_00464E78
.type func_00464E78, %function
func_00464E78:
	ldrb	r2, [r0, #13]
	add	r1, r0, #56
	add	r0, r0, #56
	b	runtime_record_copy_tail_97
.size func_00464E78, .-func_00464E78

.section .text.func_00465080,"ax",%progbits
.balign 4
.global func_00465080
.type func_00465080, %function
func_00465080:
	mov	r2, #368
	add	r1, r1, #8
	add	r0, r0, #8
	b	func_00144D28
.size func_00465080, .-func_00465080

.section .text.func_00466E1C,"ax",%progbits
.balign 4
.global func_00466E1C
.type func_00466E1C, %function
func_00466E1C:
	mov	r2, #84
	add	r1, r1, #4
	add	r0, r0, #248
	b	func_00144D28
.size func_00466E1C, .-func_00466E1C

.section .text.func_004A9E20,"ax",%progbits
.balign 4
.global func_004A9E20
.type func_004A9E20, %function
func_004A9E20:
	mov	r2, r1
	mov	r1, r0
	mov	r0, r2
	b	func_0012FE3C
.size func_004A9E20, .-func_004A9E20

.section .text.func_004C85FC,"ax",%progbits
.balign 4
.global func_004C85FC
.type func_004C85FC, %function
func_004C85FC:
	movs	r0, r1
	beq	.Lfunc_004C85FC_return
	b	func_002009A4
.Lfunc_004C85FC_return:
	bx	lr
.size func_004C85FC, .-func_004C85FC
```

## Uniqueness, collision, and reference audit

The seventeen exported names are pairwise distinct and absent from all 27,168
string leaves (8,424 distinct strings) in the 254 pre-existing top-level JSON
configs. The recursive audit includes owners, aliases, branch destinations,
direct-transfer symbols, identity members, next-global annotations, and
secondary-entry identities; no referenced configured interval overlaps a
selected body. The neutral inventory has no alternate symbol at a selected
start and no nested global entry in a selected body. Selected intervals are
pairwise disjoint.

Hashing each complete selected body against all 10,440 target function
sections gave multiplicity one for every member, and all selected bodies are
pairwise distinct. All selected report entries are unmatched at zero percent,
accounting for all 272 selected body bytes. The independently assembled object
has one `R_ARM_JUMP24` relocation in each selected section at the configured
site and no other relocation in an owned section.

A recursive semantic equality audit found the seven established primary
transfer identities named above and no existing identity for any new primary,
secondary, or PC-relative identity. The three two-site branch classes resolve
to one identity each. The remaining branch identities and all five data
identities are pairwise distinct. The four opaque PC-relative words were
compared by resolved semantic identity; the inline payload was compared by
target address. No private representation was retained.

## Implementation and validator contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4,
  with a 16-byte default-visible global function symbol.
- Preserve ARM state, exactly one `$a` mapping symbol at body offset zero, and
  the complete instruction, direct-branch, return, and PC-relative schedules.
- Emit exactly one `R_ARM_JUMP24` relocation at the configured offset in every
  selected section. Emit no call, data relocation, literal word, adjacent data,
  alias, nested entry, or extra named symbol in an owned section.
- Keep all five PC-relative targets external and unowned. In particular, do not
  emit or expose the opaque inline payload addressed by `func_00298E90`.
- Preserve the three shared transfer classes, all singleton distinctions, the
  four secondary-entry owner relations, and the exact reused/new identity
  partition. Every transfer target must resolve to executable ARM code; an
  executable definition supplied by a foreign composite object is valid.
- A validator must cap input at 64 MiB, aggregate executable data at 16 MiB,
  sections at 16,384, symbols and relocations independently at 1,000,000, and
  accept a valid composite containing at least 12,000 unrelated sections.
- Validate source SHA-256, owned section type/flags/alignment/size, symbol
  binding/type/visibility/span, mapping symbols, exact schedule hashes,
  relocation schedule, recursive ownership and identity collisions,
  completeness, and rejection of hostile schedule, mode, relocation,
  duplicate, truncation, foreign-symbol, secondary-entry, and misplaced-data
  fixtures.
