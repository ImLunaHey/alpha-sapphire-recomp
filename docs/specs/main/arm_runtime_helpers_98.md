# Probe-verified ARM runtime/helper batch 98

Source SHA-256: `7d457e9d5c0bbd5ac9a5a1dc13ba3c685289b2dd7e26ac85d22a5067697235de`

## Scope and provenance

This clean-room analysis specification covers seven currently unmatched,
ARM-state, call-free helpers totaling 112 executable body bytes (28
instructions). Evidence was limited to the current unmatched report, neutral
symbol inventory, bounded private-target control/data-flow inspection,
recursive configuration ownership/reference auditing, semantic identity
auditing, and an independently assembled and placed exact-schedule probe. The
target is revision `AS_EUR_REV2`; GNU Arm binutils 2.45.1 was used in
ARMv6K/VFPv2 mode on 2026-10-17.

Five entries end in an indirect tail transfer, two return normally, and none
contains a direct call or branch. One returning entry conditionally produces
the address immediately beyond its body. That target is an external, unowned,
opaque inline payload: this specification records neither its content nor any
representation of it. No selected section owns adjacent data. The other
returning entry is an exact semantic and body duplicate of the established
`func_001233C4`, but remains a distinct global entry.

Independent assembly, placement at all seven neutral inventory addresses, and
comparison of every complete body reproduced all 112 selected target bytes
with a zero-byte exact diff. The relocatable and placed probes have no
relocations. This cohort exhausts the safe, unowned 16-byte ARM residual
described by batch 97: all five indirect-transfer stubs, the one embedded-
address leaf, and the one duplicate plain leaf are included.

## Structural and boundary inventory

| Function | Section | Body | Instructions | Memory operations | Indirect transfers | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001D0078` | `.text.func_001D0078` | 16 | 4 | 1 | 0 | 1 | `func_001D0090` |
| `func_0034ACD4` | `.text.func_0034ACD4` | 16 | 4 | 3 | 1 | 0 | `func_0034ACF0` |
| `func_0034B0B0` | `.text.func_0034B0B0` | 16 | 4 | 3 | 1 | 0 | `func_0034B0C0` |
| `func_003A6524` | `.text.func_003A6524` | 16 | 4 | 2 | 1 | 0 | `func_003A6544` |
| `func_003AB314` | `.text.func_003AB314` | 16 | 4 | 2 | 0 | 1 | `func_003AB324` |
| `func_004C51EC` | `.text.func_004C51EC` | 16 | 4 | 3 | 1 | 0 | `func_004C520C` |
| `func_004C520C` | `.text.func_004C520C` | 16 | 4 | 3 | 1 | 0 | `func_004C568C` |

Indirect transfers and returns are counted separately from memory operations.
Totals are 28 instructions, 17 memory operations, five indirect tail
transfers, two return sites, one PC-relative address production, zero direct
calls or branches, and zero owned adjacent bytes. The “next global” values are
boundary cross-checks from the neutral inventory; they do not assert address
contiguity or ownership of any intervening byte.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`c89563e118c0d0e51870dec97cbff2b7593405f1f372a4c58b92414e607bb7a2`.
The empty direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The return-transfer schedule SHA-256 is
`487c135bc3dfcecd4b04fd414e1881706db7798ed0e48add60c420aca13e2515`.
The indirect-transfer schedule SHA-256 is
`95e2b2c17a62c71250e4c7ef9c01c493c94f6df70e5f693793aac4f8cf0d9dea`.
The PC-relative access schedule SHA-256 is
`cc3b1e584a87e774ec02a4a0faf217e3901cef9530456b38250f4cdc73f36f4d`.
The empty relocation schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Instruction, return, and indirect-transfer entries use
`name:offset:mnemonic:operands`. PC-relative entries use
`name:offset:mnemonic:targetOffset:symbol`; relocation entries use
`name:offset:type:symbol`. Entries are joined with newlines and no terminal
newline. Offsets and target offsets are lowercase hexadecimal without `0x`.

## Semantic and identity contract

`func_001D0078` tests entry `r0`. When non-null it returns the word at offset
16. When null it returns the address at body offset 16. The latter address is
the new opaque `runtime_inline_fallback_payload_98` identity. It is 4-byte
aligned, immediately follows the body, remains externally owned, and must not
be emitted, dereferenced, resolved to content, or included in the function
symbol span.

`func_0034ACD4` and `func_0034B0B0` follow the object pointer at entry offset
40, load that object's dispatch table, and tail transfer through table offsets
52 and 48 respectively. Preserve the different transfer registers (`r1` and
`r2`).

`func_003A6524` loads a dispatch table directly from entry `r0`, selects its
entry at offset 12, places the fixed value 40 in `r2`, and tail transfers
through `r3`. Entry `r0` is otherwise preserved.

`func_004C51EC` and `func_004C520C` follow the object pointer at entry offset
40, load that object's dispatch table, and tail transfer through table offsets
16 and 20 respectively. Both transfer through `r1`; their selected table
slots must remain distinct.

`func_003AB314` reads the pointer at entry offset 16, returns null when it is
null, and otherwise returns the word at pointee offset 12. Its complete body
is identical to the already established `func_001233C4` body. This is a body
relation only: both names remain distinct global functions, and neither may
be emitted as an alias of the other.

The indirect-transfer schedule is:

| Function | Offset | Instruction | Register | Kind |
| --- | ---: | --- | --- | --- |
| `func_0034ACD4` | 12 | `bx` | `r1` | tail |
| `func_0034B0B0` | 12 | `bx` | `r2` | tail |
| `func_003A6524` | 12 | `bx` | `r3` | tail |
| `func_004C51EC` | 12 | `bx` | `r1` | tail |
| `func_004C520C` | 12 | `bx` | `r1` | tail |

These are indirect transfers, not returns, direct branches, calls, or
relocations. The loaded runtime target controls the destination state through
normal `bx` semantics.

## Exact independently assembled artifact

The following is the complete canonical source. Preserve its whitespace and
terminal newline so that the source hash remains stable.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001D0078,"ax",%progbits
.balign 4
.global func_001D0078
.type func_001D0078, %function
func_001D0078:
	cmp	r0, #0
	ldrne	r0, [r0, #16]
	addeq	r0, pc, #0
	bx	lr
.size func_001D0078, .-func_001D0078

.section .text.func_0034ACD4,"ax",%progbits
.balign 4
.global func_0034ACD4
.type func_0034ACD4, %function
func_0034ACD4:
	ldr	r0, [r0, #40]
	ldr	r1, [r0]
	ldr	r1, [r1, #52]
	bx	r1
.size func_0034ACD4, .-func_0034ACD4

.section .text.func_0034B0B0,"ax",%progbits
.balign 4
.global func_0034B0B0
.type func_0034B0B0, %function
func_0034B0B0:
	ldr	r0, [r0, #40]
	ldr	r2, [r0]
	ldr	r2, [r2, #48]
	bx	r2
.size func_0034B0B0, .-func_0034B0B0

.section .text.func_003A6524,"ax",%progbits
.balign 4
.global func_003A6524
.type func_003A6524, %function
func_003A6524:
	ldr	r2, [r0]
	ldr	r3, [r2, #12]
	mov	r2, #40
	bx	r3
.size func_003A6524, .-func_003A6524

.section .text.func_003AB314,"ax",%progbits
.balign 4
.global func_003AB314
.type func_003AB314, %function
func_003AB314:
	ldr	r0, [r0, #16]
	cmp	r0, #0
	ldrne	r0, [r0, #12]
	bx	lr
.size func_003AB314, .-func_003AB314

.section .text.func_004C51EC,"ax",%progbits
.balign 4
.global func_004C51EC
.type func_004C51EC, %function
func_004C51EC:
	ldr	r0, [r0, #40]
	ldr	r1, [r0]
	ldr	r1, [r1, #16]
	bx	r1
.size func_004C51EC, .-func_004C51EC

.section .text.func_004C520C,"ax",%progbits
.balign 4
.global func_004C520C
.type func_004C520C, %function
func_004C520C:
	ldr	r0, [r0, #40]
	ldr	r1, [r0]
	ldr	r1, [r1, #20]
	bx	r1
.size func_004C520C, .-func_004C520C
```

## Uniqueness, collision, and ownership audit

The seven selected names are pairwise distinct and were absent as owners from
all 256 pre-existing top-level JSON configurations. A recursive audit covered
27,542 string leaves (8,506 distinct strings), including function owners,
aliases, identity members, branch destinations, next-global annotations, and
secondary-entry relations. No configured owned interval overlaps a selected
body, and the neutral inventory has no nested global entry within one.

Hashing every complete selected body against all 10,440 neutral-inventory
target functions gave multiplicity one for six members. `func_003AB314` alone
has multiplicity two, and its sole peer is the established
`func_001233C4`. The seven selected entries are all present in the current
report with complete 16-byte extents and no exact-match percentage, accounting
for all 112 selected body bytes.

`runtime_inline_fallback_payload_98` is new to the public configuration
reference graph. It is the only data identity in this cohort. There are no
branch identities, reused data identities, owned symbolic slots, direct
transfer destinations, or relocation identities. The unowned payload address
is not a claim on any post-body byte.

## Implementation and validator contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4,
  exactly 16 bytes long, with one default-visible global ARM function symbol
  spanning the complete section.
- Preserve exactly one `$a` mapping symbol at offset zero in each owned
  section. Emit no `$d` mapping symbol, adjacent data, alias, nested entry,
  extra named symbol, or relocation.
- Preserve all 28 instructions, operand spellings/order, condition codes,
  transfer registers, return sites, section names, PC-relative target, and
  boundaries shown above. In particular, the address-producing instruction in
  `func_001D0078` must still resolve to body offset 16 without emitting that
  target.
- Keep `func_003AB314` as its own function and section despite its exact-body
  relationship with `func_001233C4`; symbol aliasing or section folding is
  forbidden.
- Emit no direct call, direct branch, local branch, literal word, string,
  asset, body relocation, or owned post-body byte.
- The validator must enforce independent limits of 64 MiB for the complete
  input, 16 MiB for aggregate executable section data, 16,384 sections,
  1,000,000 symbols, and 1,000,000 relocations. Reaching one limit must not
  weaken or substitute for any other limit.
- The validator self-test must accept a valid composite ELF containing at
  least 12,000 unrelated foreign executable sections in addition to the seven
  owned sections, proving bounded complete scanning rather than an owned-only
  shortcut.
- Validate source SHA-256, JSON totals, section type/flags/alignment/size,
  symbol binding/type/visibility/span, mapping symbols, exact instruction,
  direct-branch, return, indirect-transfer, PC-relative, and relocation
  schedule hashes, recursive ownership and identity collisions, the precise
  duplicate-body relation, and completeness.
- Self-tests must reject hostile fixtures for oversized input, excessive
  executable bytes, sections, symbols, and relocations independently, plus
  wrong mode, duplicate/truncated sections, altered conditions or operands,
  wrong indirect register, call/direct-branch substitution, misplaced mapping
  or data symbols, extra relocations, owned post-body data, foreign symbol
  capture, aliasing, and source/spec/config digest drift.
