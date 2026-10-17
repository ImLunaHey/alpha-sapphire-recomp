# ARM runtime/helper batch 103 clean-room specification

## Scope

This batch covers five complete, currently unmatched ARM-state record
initializers. Each helper owns a 24-byte executable body and the immediately
adjacent four-byte symbolic word reached by its PC-relative load. The batch
therefore owns 120 executable bytes and 20 adjacent data bytes across five
sections. Its bodies contain 30 fixed-width instructions, 20 memory
operations, and five local returns. There are no calls, direct branches, or
indirect transfers. The resulting object has exactly five `R_ARM_ABS32`
relocations, one for each adjacent word.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded private
target inspection of control flow, data-segment membership, and identity
equality. No implementation source was inspected during analysis. The
analyst configuration deliberately left `sourceHash` null; the completed
configuration replaces it with the independently authored source's SHA-256.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide and ARM-state. Unless explicitly described as a
return, each operation falls through to the next offset. No constant move
updates condition flags.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | ---: | --- |
| `func_00112098` | 24 | 4 | 6 | 4 | `func_001120B4` |
| `func_00115C74` | 24 | 4 | 6 | 4 | `func_00115CCC` |
| `func_00171214` | 24 | 4 | 6 | 4 | `func_00171230` |
| `func_002C1EB4` | 24 | 4 | 6 | 4 | `func_002C1ED8` |
| `func_002CC97C` | 24 | 4 | 6 | 4 | `func_002CC9F8` |

Each function returns through `lr` at body offset 20. Its body ends exactly
where the owned adjacent word begins. Any later bytes before `nextGlobal` are
outside this batch and must not be emitted in the owned section.

## Required operation schedules

### `func_00112098`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 24 into `r2`; its identity is `runtime_record_descriptor_103_a`. |
| 4 | Set `r3` to zero without updating flags. |
| 8 | Store the low byte of `r3` at address `r0 + 8`. |
| 12 | Store entry `r1` as a word at address `r0 + 4`. |
| 16 | Store `r2` as a word at address `r0 + 0`. |
| 20 | Return through `lr`. |

The helper preserves its second input as the record word at offset four,
installs the descriptor at offset zero, and clears the byte at offset eight.
Preserve the temporary register choices and store order.

### `func_00115C74`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 24 into `r1`; its identity is `runtime_record_descriptor_103_b`. |
| 4 | Store `r1` as a word at address `r0 + 0`. |
| 8 | Set `r1` to zero without updating flags. |
| 12 | Store `r1` as a word at address `r0 + 4`. |
| 16 | Store `r1` as a word at address `r0 + 8`. |
| 20 | Return through `lr`. |

The descriptor store precedes both zero stores. The same `r1` temporary is
reused for the descriptor and zero value.

### `func_00171214`

| Offset | Required semantics |
| ---: | --- |
| 0 | Set `r1` to zero without updating flags. |
| 4 | Store `r1` as a word at address `r0 + 4`. |
| 8 | Store the low byte of `r1` at address `r0 + 8`. |
| 12 | Load the PC-relative word at function offset 24 into `r1`; its identity is `runtime_record_descriptor_103_c`. |
| 16 | Store `r1` as a word at address `r0 + 0`. |
| 20 | Return through `lr`. |

Here the zero stores precede the descriptor load and store. Preserve the mixed
word/byte widths and the reuse of `r1`.

### `func_002C1EB4`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 24 into `r2`; its identity is `runtime_record_descriptor_103_d`. |
| 4 | Set `r1` to zero without updating flags. |
| 8 | Store `r2` as a word at address `r0 + 0`. |
| 12 | Store the low halfword of `r1` at address `r0 + 12`. |
| 16 | Store the low byte of `r1` at address `r0 + 14`. |
| 20 | Return through `lr`. |

The halfword and byte stores are distinct operations at their exact offsets;
they must not be widened, merged, or reordered.

### `func_002CC97C`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 24 into `r1`; it reuses the established identity `service_cleanup_vtable_42_c`. |
| 4 | Set `r2` to zero without updating flags. |
| 8 | Store `r1` followed by `r2` at addresses `r0 + 0` and `r0 + 4` using one increment-after store-multiple operation without base writeback. |
| 12 | Store `r2` as a word at address `r0 + 8`. |
| 16 | Store `r2` as a word at address `r0 + 12`. |
| 20 | Return through `lr`. |

The paired store must remain a single store-multiple operation over the exact
ascending register list `r1`, `r2`, with `r0` unchanged.

## Relocation and identity contract

| Function | Offset | Type | Symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_00112098` | 24 | `R_ARM_ABS32` | `runtime_record_descriptor_103_a` | 0 |
| `func_00115C74` | 24 | `R_ARM_ABS32` | `runtime_record_descriptor_103_b` | 0 |
| `func_00171214` | 24 | `R_ARM_ABS32` | `runtime_record_descriptor_103_c` | 0 |
| `func_002C1EB4` | 24 | `R_ARM_ABS32` | `runtime_record_descriptor_103_d` | 0 |
| `func_002CC97C` | 24 | `R_ARM_ABS32` | `service_cleanup_vtable_42_c` | 0 |

Every PC-relative load reaches its function's immediately adjacent owned word.
Do not pool or move those words. The five identities denote four-byte-aligned
read-only-data locations and are pairwise distinct. The first four neutral
identities are new and distinct from all established public identities. The
fifth must reuse `service_cleanup_vtable_42_c`, the established vtable-like
identity from IPC batch 42; it must not be renamed or duplicated.

This is an owned-relocation runtime batch and is suitable for deterministic
target-object integration. It is not one of the zero-relocation runtime
batches that must remain outside the target generator.

## ELF, section, and symbol contract

- Produce an ELF32 little-endian ARM relocatable object with EABI version 5
  flags exactly `0x05000000` and a canonical all-zero null symbol.
- Use one executable `SHT_PROGBITS` section named `.text.<function>` per
  helper. Each section has only `SHF_ALLOC | SHF_EXECINSTR`, alignment four,
  and size exactly 28 bytes.
- Each owned section has exactly one local `STT_SECTION` symbol, one local
  `STT_NOTYPE` `$a` symbol at offset zero, and one local `STT_NOTYPE` `$d`
  symbol at offset 24. Emit no additional named or unnamed symbol in an owned
  section.
- Define exactly five default-visible global `STT_FUNC` symbols. Each has
  value zero, `st_other` zero, and size exactly 24; its section is the
  corresponding owned section.
- Each descriptor identity, including the reused IPC identity, is a
  default-visible global `STT_NOTYPE` undefined
  symbol with `st_other`, value, and size zero and section index `SHN_UNDEF`.
- Define no alias, nested function, secondary entry, or descriptor identity in
  this object. Each owned section has exactly its one listed relocation and no
  other relocation.

## Coverage and validation cautions

All five names are complete unmatched ARM bodies in the current report, and
none is owned by an existing public configuration. Their body and owned
intervals are pairwise disjoint. Each selected body has multiplicity one
across the 10,440-function neutral inventory, so this batch has no duplicate
body class.

Validation should reject instruction substitutions that alter register choice,
store width, displacement, store order, flag updates, store-multiple addressing
or writeback, or the return register; any call, branch, or indirect transfer; a
missing, extra, moved, or wrong-kind relocation; nonzero relocation addends;
literal pooling; identity merging; incorrect mapping-symbol transitions;
invented aliases; extra named or unnamed symbols in owned sections; incorrect
undefined-symbol metadata; section flag, alignment, or size drift;
noncanonical ELF header or null-symbol metadata; and any mismatch between the
normalized configuration contract and the validator's pinned contract.

The validator must enforce independent limits of 64 MiB for the complete
input, 16 MiB for aggregate executable section data, 16,384 sections,
1,000,000 symbols across both `SYMTAB` and `DYNSYM`, and 1,000,000
relocations. Its self-test should exercise those limits independently and
include a valid composite object with at least 12,000 unrelated foreign
executable sections to prove bounded complete scanning.
