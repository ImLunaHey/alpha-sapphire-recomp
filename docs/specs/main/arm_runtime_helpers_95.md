# Probe-verified ARM runtime/helper batch 95

Source SHA-256: `24d67594c923e7f4f89785677c6476034e6a411647258de4a3123208abad1b66`

## Scope and provenance

This clean-room analysis specification covers four currently unmatched,
ARM-state, call-free helpers totaling 64 executable body bytes (16
instructions), plus four owned adjacent words totaling 16 non-executable
bytes. Evidence was limited to the current unmatched report, neutral symbol
inventory, bounded private-target control/data-flow inspection, recursive
configuration ownership/reference auditing, semantic literal equality
auditing, and an independently assembled exact-schedule probe. The target is
revision `AS_EUR_REV2`; GNU Arm binutils 2.45.1 was used in ARMv6K/VFPv2 mode
on 2026-10-17.

Every selected function has a complete symbol-bounded 16-byte body, no body
overlap, no direct or indirect call, no direct branch, exactly one `bx lr`
return, exactly one PC-relative access to its immediately adjacent word, and
no embedded private string or asset. Two adjacent slots are new opaque
semantic identities. The other slots reuse the established `global_state_02`
and `runtime_float_zero_38` identities. Independent assembly reproduced all 64
target body bytes with a zero-byte exact diff; its four 20-byte sections each
contain the 16-byte function followed by the required word.

The selection is the complete safe unique residual 16-byte ARM leaf cohort.
The neutral inventory contains 241 16-byte ARM functions; 54 remain unmatched,
and 40 were unowned after recursively auditing the current 246 top-level JSON
configs. Of those 40, twelve are call-bearing prefixes, seventeen are direct-
transfer wrappers, five end in indirect transfers, one returns an embedded
string address, and one otherwise-safe plain leaf has body multiplicity two.
The four selected literal-backed leaves are the only remaining unique,
returning, non-transfer bodies whose reached adjacent data can be represented
without proprietary content.

## Structural and boundary inventory

| Function | Section | Body | Adjacent | Instructions | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00109724` | `.text.func_00109724` | 16 | 4 | 4 | 2 | 1 | `func_00109738` |
| `func_00136BFC` | `.text.func_00136BFC` | 16 | 4 | 4 | 2 | 1 | `func_00136C10` |
| `func_001D2C7C` | `.text.func_001D2C7C` | 16 | 4 | 4 | 3 | 1 | `func_001D314C` |
| `func_0032F1B0` | `.text.func_0032F1B0` | 16 | 4 | 4 | 3 | 1 | `func_0032F1C4` |

System-register transfers are not counted as memory operations. Returns are
separate from the direct-branch count. Totals are 16 instructions, 10 memory
operations, four return sites, four PC-relative accesses, zero direct branches,
zero calls, and four adjacent `R_ARM_ABS32` slots. The “next global” values are
boundary cross-checks from the neutral inventory; they do not assert address
contiguity. `func_001D2C7C` owns only its first post-body word; the later gap to
its next global remains unowned.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`b9b1d0eadc506d2b3e8ba5f93ccadf1c0aa785f9ad9f8495d0cdddb6d4f56ffe`.
The empty direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The return-transfer schedule SHA-256 is
`e969b87ead54a26ce3e1cd501eff68295ff949b3fea8b89f11129399228d0a57`.
The PC-relative access schedule SHA-256 is
`50f72f2bafb1eee9223ddbfdb97ffbd7557c2519408eeb56886e181422c33750`.
The adjacent-relocation schedule SHA-256 is
`51b4aca4ed9093f661ca679be2c4216d97f21169b8448b106dbbab4c7c2ca699`.

Instruction and return entries use
`name:offset:mnemonic:operands`. PC-relative entries use
`name:offset:mnemonic:targetOffset:symbol`; relocation entries use
`name:offset:type:symbol`. Entries are joined with newlines and no terminal
newline. Offsets are lowercase hexadecimal without `0x`. The five hashes were
reproduced independently from the bounded target bodies and exact-schedule
probe.

## Semantic schedules

`func_00109724` reads the current thread-context register, obtains the
established `global_state_02` identity, writes the context value at record word
one, and returns. Preserve the coprocessor register fields and store offset.

`func_00136BFC` advances the destination by 116 bytes, loads the established
single-precision zero identity into `s3`, stores `s0-s3` as one VFP multiple
transfer, and returns. The zero slot is intentionally shared with
`runtime_float_zero_38`; it is not a new identity.

`func_001D2C7C` loads an opaque two-word default-record source, transfers its
two words into `r1-r2`, stores both at entry `r0`, and returns. Preserve the
single `ldm` and `stm` operations.

`func_0032F1B0` loads an opaque word-table identity, selects one word with the
entry `r1` index scaled by four, stores it at entry `r0` offset 16, and
returns.

## Exact independently assembled artifact

The following is the complete canonical source. Preserve its whitespace and
terminal newline so that the source hash remains stable.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global global_state_02
.global runtime_float_zero_38
.global runtime_default_pair_95
.global runtime_indexed_word_table_95

.section .text.func_00109724,"ax",%progbits
.balign 4
.global func_00109724
.type func_00109724, %function
func_00109724:
	mrc	p15, 0, r0, c13, c0, 3
	ldr	r1, .Lglobal_state_02
	str	r0, [r1, #4]
	bx	lr
.size func_00109724, .-func_00109724
.Lglobal_state_02:
	.word	global_state_02

.section .text.func_00136BFC,"ax",%progbits
.balign 4
.global func_00136BFC
.type func_00136BFC, %function
func_00136BFC:
	add	r0, r0, #116
	vldr	s3, .Lruntime_float_zero_38
	vstmia	r0, {s0-s3}
	bx	lr
.size func_00136BFC, .-func_00136BFC
.Lruntime_float_zero_38:
	.word	runtime_float_zero_38

.section .text.func_001D2C7C,"ax",%progbits
.balign 4
.global func_001D2C7C
.type func_001D2C7C, %function
func_001D2C7C:
	ldr	r2, .Lruntime_default_pair_95
	ldm	r2, {r1, r2}
	stm	r0, {r1, r2}
	bx	lr
.size func_001D2C7C, .-func_001D2C7C
.Lruntime_default_pair_95:
	.word	runtime_default_pair_95

.section .text.func_0032F1B0,"ax",%progbits
.balign 4
.global func_0032F1B0
.type func_0032F1B0, %function
func_0032F1B0:
	ldr	r2, .Lruntime_indexed_word_table_95
	ldr	r1, [r2, r1, lsl #2]
	str	r1, [r0, #16]
	bx	lr
.size func_0032F1B0, .-func_0032F1B0
.Lruntime_indexed_word_table_95:
	.word	runtime_indexed_word_table_95
```

## Uniqueness, collision, and reference audit

The four exported names are pairwise distinct and absent from all 22,691
string leaves (7,471 distinct strings) in the 246 pre-existing top-level JSON
configs. The recursive audit includes owners, aliases, branch destinations,
direct-transfer symbols, identity members, next-global annotations, and
secondary-entry identities; no referenced configured interval overlaps a
selected body or adjacent slot. The neutral inventory has no alternate symbol
at a selected start and no nested global entry in a selected body. Selected
body-plus-word intervals are pairwise disjoint.

Hashing each complete selected body against all 10,440 target function
sections gave multiplicity one for every member, and the four bodies are
pairwise distinct. The two new adjacent identities are distinct from each
other and do not equal any previously configured identity. The first slot
equals the established `global_state_02` class, while the zero identity equals
the established `runtime_float_zero_38` class; both must reuse those names.
All four selected report entries are unmatched at zero percent, accounting for
all 64 selected body bytes.

The independent probe contains exactly four `R_ARM_ABS32` relocations, each at
offset 16 in its corresponding 20-byte section. No relocation occurs inside a
function body. The target bodies themselves are relocation-free; the semantic
adjacent identities replace private resolved representations without exposing
them.

## Implementation and validator contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4,
  with a 20-byte section and a default-visible global function symbol spanning
  only its first 16 bytes.
- Preserve ARM state, exactly one `$a` mapping symbol at body offset zero, and
  exactly one `$d` mapping symbol at adjacent offset 16.
- Preserve all 16 instructions, operand spellings/order, PC-relative targets,
  return sites, section names, local labels, and boundaries shown above.
- Emit exactly one adjacent `R_ARM_ABS32` relocation at offset 16 in every
  owned section. The two new symbols must remain distinct; reuse the external
  `global_state_02` identity for `func_00109724` and `runtime_float_zero_38`
  for `func_00136BFC`.
- Emit no call, direct branch, indirect transfer, body relocation, extra data,
  alias, nested entry, or extra named symbol in an owned section.
- A validator must cap input at 64 MiB, aggregate executable data at 16 MiB,
  sections at 16,384, symbols and relocations independently at 1,000,000, and
  accept a valid composite with at least 12,000 unrelated sections.
- Validate source SHA-256, owned section type/flags/alignment/size, symbol
  binding/type/visibility/span, mapping-symbol transitions, exact instruction/
  return/branch/PC-relative/relocation schedule hashes, recursive ownership and
  identity collision rules, completeness, and rejection of hostile schedule,
  mode, relocation, duplicate, truncation, foreign-symbol, and misplaced-data
  fixtures.
