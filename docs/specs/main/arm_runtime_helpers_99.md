# Probe-verified ARM runtime/helper batch 99

Source SHA-256: `0eeb089e103ce2a6301064a9996a66f7cdb92f24c5f9fc588d5f7fe01a58718c`.

## Scope and provenance

This clean-room analysis specification covers seven currently unmatched,
ARM-state, call-free helpers totaling 140 executable body bytes (35
instructions), plus seven reached adjacent words totaling 28 non-executable
bytes. Evidence was limited to the current unmatched report, neutral symbol
inventory, bounded private-target control/data-flow inspection, recursive
configuration ownership/reference auditing, semantic literal-equality
auditing, and an independently assembled and placed exact-schedule probe. The
target is revision `AS_EUR_REV2`; GNU Arm binutils 2.45.1 was used in
ARMv6K/VFPv2 mode on 2026-10-17.

Every selected function has a complete 20-byte symbol-bounded body, no body
overlap, no direct or indirect call, no direct branch, exactly one `bx lr`
return, exactly one PC-relative access to its immediately adjacent word, and
no embedded private string or asset. One adjacent slot reuses the established
`runtime_float_unit_38` identity. The other six slots are new opaque semantic
identities and are pairwise distinct from one another and from that reused
identity. No resolved representation or proprietary payload is recorded here.

Independent assembly, placement at all seven neutral inventory addresses, and
semantic resolution of the adjacent identities reproduced all 140 body bytes
and all 28 reached adjacent bytes with a zero-byte exact diff. The relocatable
probe contains exactly seven `R_ARM_ABS32` relocations and no body relocation.
This is therefore not a zero-relocation runtime batch: the deterministic
generator must own and resolve the seven reached adjacent words.

The bounded scan found 51 unowned, currently unmatched 20-byte ARM entries.
These seven are the complete unique returning leaf cohort with no direct or
indirect transfer and with safely abstractable reached adjacent data. The
other entries contain calls, direct tail transfers, indirect transfers, or
mixed conditional transfer/return control flow and are outside this batch.

## Structural and boundary inventory

| Function | Section | Body | Adjacent | Instructions | Memory operations | Returns | Next global |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0011F8A8` | `.text.func_0011F8A8` | 20 | 4 | 5 | 3 | 1 | `func_0011F9D0` |
| `func_00142388` | `.text.func_00142388` | 20 | 4 | 5 | 3 | 1 | `func_001423A0` |
| `func_002C2F2C` | `.text.func_002C2F2C` | 20 | 4 | 5 | 2 | 1 | `func_002C2F44` |
| `func_00336114` | `.text.func_00336114` | 20 | 4 | 5 | 1 | 1 | `func_0033612C` |
| `func_00417638` | `.text.func_00417638` | 20 | 4 | 5 | 1 | 1 | `func_00417650` |
| `func_0041D118` | `.text.func_0041D118` | 20 | 4 | 5 | 2 | 1 | `func_0041D130` |
| `func_004A5B3C` | `.text.func_004A5B3C` | 20 | 4 | 5 | 3 | 1 | `func_004A6C44` |

Conditional memory operations are counted when present in the static
schedule. Returns are counted separately from direct branches. Totals are 35
instructions, 15 memory operations, seven return sites, seven PC-relative
data accesses, zero calls, zero local or direct branches, zero indirect
transfers, and 28 owned adjacent bytes. The “next global” values are boundary
cross-checks from the neutral inventory; they do not assert ownership of any
additional intervening byte.

The canonical full mnemonic/operand instruction-schedule SHA-256 is
`cadcc6dcb8827f3bab4d7fc48c3891742281df0b43397d223bc1cd4bb7877178`.
The empty direct-branch schedule SHA-256 is
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The return-transfer schedule SHA-256 is
`de974bc3bfdb4e9f866faeaebdc23be267c002242de79a7f2ca89c51e0829449`.
The PC-relative access schedule SHA-256 is
`a70f9bcda04ea177c30a10ddea51430b9893d58babdf5c1e82aaf385c96766b9`.
The adjacent-relocation schedule SHA-256 is
`879915143a002e827796453c5755d3e0bff37c8e44151c9e80b02338c7243b2c`.

Instruction and return entries use
`name:offset:mnemonic:operands`. PC-relative entries use
`name:offset:mnemonic:targetOffset:symbol`; relocation entries use
`name:offset:type:symbol`. Entries are joined with newlines and no terminal
newline. Offsets and target offsets are lowercase hexadecimal without `0x`.
The full source and resolved adjacent representations are intentionally absent
from this analysis artifact; the independent implementer must reconstruct the
schedule from the semantic contract and set the final source hash.

## Semantic and operand contract

`func_0011F8A8` writes the all-ones-minus-one sentinel to entry `r0` word zero,
loads the established single-precision unit identity into `s0`, stores it at
entry offset 4, and returns. Preserve `r1` as the integer temporary and the
operation order: sentinel materialization, PC-relative VFP load, integer
store, VFP store, return. The VFP load is at body offset 4 and reaches the
adjacent word at offset 20.

`func_00142388` loads `runtime_global_context_root_99`, follows its word at
offset 156, compares that result with zero, conditionally stores entry `r0` at
result offset 56 when non-null, and returns. Preserve `r1` as the sole
temporary and the `ne` condition on the store. Its PC-relative load is at
offset 0 and reaches offset 20.

`func_002C2F2C` loads `runtime_fixed_register_base_99`, reads an unsigned byte
at offset 133, masks the byte with 28, shifts the result right by two, and
returns it in `r0`. All operations reuse `r0`; the mask is a non-flag-setting
ARM `and`, and the shift is a non-flag-setting logical right shift. Its
PC-relative load is at offset 0 and reaches offset 20.

`func_00336114` transfers entry `r0` into `s0`, loads
the established `ipc_step_scalar_a_65` identity into `s1`, converts `s0` from unsigned 32-bit
integer to single precision, multiplies it by `s1`, and returns with the result
in `s0`. Preserve the scalar VFP register allocation and operation order. The
PC-relative VFP load is at offset 4 and reaches offset 20.

`func_00417638` loads `runtime_scalar_threshold_99` into `r1`, compares entry
`r0` with it, writes one to `r0` under signed `le`, writes zero under signed
`gt`, and returns. The two conditional moves must remain complementary and
non-flag-setting. Its PC-relative load is at offset 0 and reaches offset 20.

`func_0041D118` compares entry `r0` with eight. Under unsigned `ls`, it loads
`runtime_lookup_table_99` into `r1` and then loads result `r0` from that table
using the original index scaled by four. Under unsigned `hi`, it instead
returns bitwise-not zero. Preserve the conditions, the scaled index, and the
instruction order; no branch is permitted. The conditional PC-relative load
is at offset 4 and reaches offset 20.

`func_004A5B3C` loads `runtime_global_instance_slot_99` into `r1`, follows the
pointer stored there, compares it with zero, conditionally stores entry `r0`
at pointee offset 64 when non-null, and returns. Preserve `r1` as the sole
temporary and the `ne` condition on the store. Its PC-relative load is at
offset 0 and reaches offset 20.

## Adjacent identity and relocation contract

Each selected section owns exactly one 4-byte word immediately after its
20-byte function body. The relocation schedule is:

| Function | Offset | Type | Symbol | Identity status |
| --- | ---: | --- | --- | --- |
| `func_0011F8A8` | 20 | `R_ARM_ABS32` | `runtime_float_unit_38` | reused |
| `func_00142388` | 20 | `R_ARM_ABS32` | `runtime_global_context_root_99` | new |
| `func_002C2F2C` | 20 | `R_ARM_ABS32` | `runtime_fixed_register_base_99` | new |
| `func_00336114` | 20 | `R_ARM_ABS32` | `ipc_step_scalar_a_65` | reused |
| `func_00417638` | 20 | `R_ARM_ABS32` | `runtime_scalar_threshold_99` | new |
| `func_0041D118` | 20 | `R_ARM_ABS32` | `runtime_lookup_table_99` | new |
| `func_004A5B3C` | 20 | `R_ARM_ABS32` | `runtime_global_instance_slot_99` | new |

The five new identities are pairwise distinct, default-visible undefined
symbols with minimum slot alignment 4. They respectively denote a global
context root, a fixed-register byte source, a signed-comparison threshold, a
bounded word table, and a global instance pointer slot. Their resolved
representations remain private. `runtime_float_unit_38` and
`ipc_step_scalar_a_65` must reuse their established identities and must not be
renamed or duplicated.

## Uniqueness, collision, and ownership audit

The seven selected names are pairwise distinct and were absent as owners from
all 258 pre-existing top-level JSON configurations. A recursive audit covered
27,884 string leaves (8,679 distinct strings), including function owners,
aliases, identity members, branch destinations, next-global annotations, and
secondary-entry relations. No configured owned interval overlaps a selected
body or adjacent word, and the neutral inventory has no nested global entry
within an owned 24-byte section.

Hashing every complete selected body against all 10,440 neutral-inventory
target functions gave multiplicity one for every member, and the seven bodies
are pairwise distinct. Every selected entry is present in the current report
with a complete 20-byte extent and no exact-match percentage, accounting for
all 140 selected body bytes. Semantic comparison of reached adjacent words
found only the required equalities with `runtime_float_unit_38` and
`ipc_step_scalar_a_65`; the five new
identities are pairwise distinct and do not collide with any previously owned
adjacent identity.

## Implementation and validator contract

- Use one AX PROGBITS section named `.text.<function>` per entry, aligned to 4,
  exactly 24 bytes long, with one default-visible global ARM function symbol
  spanning only its first 20 bytes.
- Preserve exactly one `$a` mapping symbol at body offset zero and one `$d`
  mapping symbol at adjacent offset 20 in each owned section. Emit no extra
  named symbol, alias, nested entry, or data.
- Reconstruct all 35 operations, operand/register allocation, condition codes,
  PC-relative targets, return sites, section names, and boundaries from the
  semantic contract. Emit no call, local/direct branch, indirect transfer, or
  body relocation.
- Emit exactly one adjacent `R_ARM_ABS32` relocation at offset 20 in every
  section. Reuse `runtime_float_unit_38` and `ipc_step_scalar_a_65`, and preserve all five new identities as
  pairwise-distinct undefined default-visible globals.
- The validator must enforce independent limits of 64 MiB for the complete
  input, 16 MiB for aggregate executable section data, 16,384 sections,
  1,000,000 symbols, and 1,000,000 relocations. Reaching one limit must not
  weaken or substitute for another.
- The validator self-test must accept a valid composite ELF containing at
  least 12,000 unrelated foreign executable sections in addition to the seven
  owned sections, proving bounded complete scanning rather than an owned-only
  shortcut.
- Validate the final source SHA-256 after the implementer records it, JSON
  totals, section type/flags/alignment/size, symbol binding/type/visibility/
  span, mapping-symbol transitions, exact instruction/return/branch/
  PC-relative/relocation schedule hashes, recursive ownership and identity
  collision rules, completeness, and target-independent schedule invariants.
- Self-tests must reject hostile fixtures for oversized input, excessive
  executable bytes, sections, symbols, and relocations independently, plus
  wrong mode, duplicate/truncated sections, altered operands or conditions,
  calls/branches/indirect transfers, misplaced mapping/data symbols, wrong or
  extra relocations, foreign symbol capture, identity aliasing, and config or
  specification digest drift.
