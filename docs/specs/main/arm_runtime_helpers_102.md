# ARM runtime/helper batch 102 clean-room specification

## Scope

This batch covers five complete, currently unmatched ARM-state helpers built
around one immediately adjacent symbolic word per function. It owns 104
executable body bytes and 20 adjacent data bytes, for 124 bytes across five
sections. The bodies contain 26 fixed-width instructions, 15 memory
operations, two direct tail transfers, two indirect tail transfers, and one
local return. The resulting object has exactly seven relocations: five
absolute-word relocations and two direct-tail relocations.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded private
target inspection of control flow, data-segment membership, and identity
equality. No implementation source was inspected during analysis. The
completed public configuration pins the independent implementation with its
SHA-256 `sourceHash`.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide and ARM-state. Unless explicitly described as a
transfer, each operation falls through to the next offset. No arithmetic or
register-move operation updates condition flags.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Exit | Next global |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `func_0014EB08` | 16 | 4 | 4 | 2 | direct tail | `func_0014EB1C` |
| `func_0014EB30` | 20 | 4 | 5 | 2 | direct tail | `func_0014EB48` |
| `func_001DBCD8` | 24 | 4 | 6 | 3 | return through `lr` | `func_001DBD18` |
| `func_00324E84` | 24 | 4 | 6 | 4 | indirect tail through `r2` | `func_00325764` |
| `func_0042FF40` | 20 | 4 | 5 | 4 | indirect tail through `r1` | `func_00430238` |

Each body ends exactly where its adjacent word begins. The owned size is the
body size plus that four-byte word. Any later bytes before `nextGlobal` are
outside this batch and must not be emitted in the owned section.

## Required operation schedules

### Shared dispatch-root tails

`func_0014EB08` and `func_0014EB30` use the same new symbolic identity,
`runtime_shared_dispatch_root_102`, and load the word at displacement 20 from
the resolved root before tail-transferring. Their argument shuffles and
transfer destinations differ.

`func_0014EB08`:

| Offset | Required semantics |
| ---: | --- |
| 0 | Copy `r0` to `r1` without updating flags. |
| 4 | Load the PC-relative word at function offset 16 into `r0`. |
| 8 | Load the word at address `r0 + 20` back into `r0`. |
| 12 | Tail-transfer directly to `runtime_secondary_dispatch_tail_102`; do not update `lr`. |

`func_0014EB30`:

| Offset | Required semantics |
| ---: | --- |
| 0 | Copy `r1` to `r2` without updating flags. |
| 4 | Copy `r0` to `r1` without updating flags. |
| 8 | Load the PC-relative word at function offset 20 into `r0`. |
| 12 | Load the word at address `r0 + 20` back into `r0`. |
| 16 | Tail-transfer directly to primary ARM entry `func_00168844`; do not update `lr`. |

The two adjacent words are equal and must remain distinct relocation sites
that resolve through the same undefined symbol. The first transfer target is
an ARM secondary entry 28 bytes after the primary inventory symbol
`func_0016B73C`. It has no standalone inventory name; use the neutral name
`runtime_secondary_dispatch_tail_102`. The next global after that secondary
entry is `func_0016BADC`, 900 bytes later. The other destination is a primary
ARM inventory entry.

### Fixed-width vector-record copy

`func_001DBCD8` uses this exact schedule:

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 24 into `r2`; its identity is `runtime_vector_record_table_102`. |
| 4 | Set `r0` to `r0 + (r0 << 1)` without updating flags. |
| 8 | Set `r0` to `r2 + (r0 << 3)` without updating flags. |
| 12 | Load `s0` through `s5` from six consecutive words beginning at address `r0`, without base writeback. |
| 16 | Store `s0` through `s5` to six consecutive words beginning at address `r1`, without base writeback. |
| 20 | Return through `lr`. |

The first add forms three times the input index; the second therefore selects
a 24-byte record from the read-only table. The VFP transfers preserve their
register order and do not write either base register back. This function may
clobber `r0`, `r2`, and `s0` through `s5`; `r1` remains the output base.

### Object-root indirect dispatch

`func_00324E84` uses this exact schedule:

| Offset | Required semantics |
| ---: | --- |
| 0 | Copy `r0` to `r1` without updating flags. |
| 4 | Load the PC-relative word at function offset 24 into `r0`; its identity is `runtime_object_dispatch_root_102`. |
| 8 | Load the word at address `r0 + 4` back into `r0`. |
| 12 | Load the word at address `r0 + 0` into `r2`. |
| 16 | Load the word at address `r2 + 12` back into `r2`. |
| 20 | Tail-transfer indirectly through `r2`; do not update `lr`. |

The original first argument is preserved in `r1` for the eventual callee.
The final transfer is indirect and must not acquire a branch relocation.

### Method-root indirect dispatch

`func_0042FF40` uses this exact schedule:

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 20 into `r0`; its identity is `runtime_method_dispatch_root_102`. |
| 4 | Load the word at address `r0 + 36` back into `r0`. |
| 8 | Load the word at address `r0 + 0` into `r1`. |
| 12 | Load the word at address `r1 + 56` back into `r1`. |
| 16 | Tail-transfer indirectly through `r1`; do not update `lr`. |

The final transfer is indirect and must not acquire a branch relocation.

## Relocation and identity contract

| Function | Offset | Type | Symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_0014EB08` | 12 | `R_ARM_JUMP24` | `runtime_secondary_dispatch_tail_102` | 0 |
| `func_0014EB08` | 16 | `R_ARM_ABS32` | `runtime_shared_dispatch_root_102` | 0 |
| `func_0014EB30` | 16 | `R_ARM_JUMP24` | `func_00168844` | 0 |
| `func_0014EB30` | 20 | `R_ARM_ABS32` | `runtime_shared_dispatch_root_102` | 0 |
| `func_001DBCD8` | 24 | `R_ARM_ABS32` | `runtime_vector_record_table_102` | 0 |
| `func_00324E84` | 24 | `R_ARM_ABS32` | `runtime_object_dispatch_root_102` | 0 |
| `func_0042FF40` | 20 | `R_ARM_ABS32` | `runtime_method_dispatch_root_102` | 0 |

Every PC-relative load reaches the immediately adjacent owned word named in
the table. Do not pool or move those words. All four data identities are new,
four-byte-aligned, and pairwise distinct except for the intentionally shared
identity used by the first two functions. The shared, object-dispatch, and
method-dispatch identities denote initialized-data locations. The vector
record identity denotes a read-only-data location. A bounded equality audit
found no collision between these four identities and established public
literal identities.

## ELF, section, and symbol contract

- Produce an ELF32 little-endian ARM relocatable object with EABI version 5
  flags exactly `0x05000000` and a canonical all-zero null symbol.
- Use one executable `SHT_PROGBITS` section named `.text.<function>` per
  helper. Each section has only `SHF_ALLOC | SHF_EXECINSTR`, alignment four,
  and size exactly `ownedSize`.
- Each owned section has exactly one local `STT_SECTION` symbol, one local
  `STT_NOTYPE` `$a` symbol at offset zero, and one local `STT_NOTYPE` `$d`
  symbol at the body-size offset. Emit no additional named or unnamed symbol
  in an owned section.
- Define exactly five default-visible global `STT_FUNC` symbols. Each has
  value zero, `st_other` zero, and size exactly its body size; its section is
  the corresponding owned section.
- Every relocation symbol is default-visible global `STT_NOTYPE`, with
  `st_other`, value, and size zero and section index `SHN_UNDEF`. This applies
  equally to the four data identities, the secondary ARM entry, and primary
  ARM entry `func_00168844`.
- Define no alias, nested function, secondary entry, or data identity in this
  object. The secondary entry remains undefined here.
- Each owned section has exactly the relocations listed above and no others.
  The object as a whole therefore has exactly seven relocations.

## Coverage and validation cautions

All five names are complete unmatched ARM bodies in the current report, and
none is owned by an existing public configuration. Their body and owned
intervals are pairwise disjoint. Each selected body has multiplicity one
across the 10,440-function neutral inventory, so this batch has no duplicate
body class.

Validation should reject instruction substitutions that change flag updates,
register selection, shifts, displacement, VFP register order, or writeback;
call/return/tail confusion; direct versus indirect transfer confusion; a
missing, extra, moved, or wrong-kind relocation; nonzero relocation addends;
literal pooling; merging or splitting identities; incorrect mapping-symbol
transitions; invented aliases; extra named or unnamed symbols in owned
sections; incorrect undefined-symbol metadata; section flag, alignment, or
size drift; noncanonical ELF header or null-symbol metadata; and any mismatch
between the normalized configuration contract and the validator's pinned
contract.
