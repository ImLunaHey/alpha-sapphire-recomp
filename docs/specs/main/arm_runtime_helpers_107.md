# ARM runtime/helper batch 107 clean-room specification

## Scope

This batch covers five complete, currently unmatched ARM-state leaf helpers.
Each helper owns its executable body and the immediately adjacent four-byte
symbolic word reached by its PC-relative load. The batch therefore owns 140
executable bytes and 20 adjacent data bytes across five sections. Its bodies
contain 35 fixed-width instructions, 19 memory operations, and five local
returns. There are no calls, direct branches, or indirect transfers. The
resulting object has exactly five `R_ARM_ABS32` relocations.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded private target
inspection of control flow, process-image segment membership, identity
equality, and body multiplicity. No implementation source was inspected during
analysis. The analyst configuration leaves `sourceHash` null; integration must
replace it with the independently authored source's SHA-256.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide and ARM-state. Except for the three explicitly
conditional operations in `func_003CBD34`, every operation is unconditional.
Unless described as a return, each operation falls through to the next offset.
Each helper is a leaf, does not adjust the stack, preserves `sp`, and returns
through `lr`.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | ---: | --- |
| `func_003CBD34` | 24 | 4 | 6 | 1 | `func_003CBD50` |
| `func_001E04F8` | 28 | 4 | 7 | 3 | `func_001E0518` |
| `func_0020675C` | 28 | 4 | 7 | 4 | `func_0020677C` |
| `func_002ACEC8` | 28 | 4 | 7 | 5 | `func_002ACEE8` |
| `func_00179D04` | 32 | 4 | 8 | 6 | `func_00179D28` |

Each body ends exactly where its owned adjacent word begins, and that word ends
at the next global. Emit no additional bytes in an owned section. All five body
byte sequences have multiplicity one across the 10,440-function neutral
inventory.

## Required operation schedules

### `func_003CBD34`

| Offset | Required semantics |
| ---: | --- |
| 0 | Compare unsigned `r0` with immediate 51 and update condition flags. |
| 4 | If unsigned `r0` is lower than 51, load the PC-relative word at function offset 24 into `r1`; its identity is `runtime_bounded_record_table_107_a`. |
| 8 | Under the same unsigned-lower condition, set `r0` to `r0 + (r0 << 3)` without updating flags. |
| 12 | If unsigned `r0` was higher than or equal to 51, set `r0` to zero without updating flags. |
| 16 | Under the unsigned-lower condition, set `r0` to `r1 + (r0 << 3)` without updating flags. |
| 20 | Return through `lr`. |

The compare's flags govern all four following data-processing operations. No
instruction between offsets 0 and 16 may update flags. In the in-range path,
the two shifted adds form the original index times nine and then scale that
intermediate by eight, giving a 72-byte record stride. In the out-of-range
path, the result is zero. Preserve the complementary unsigned-lower and
unsigned-higher-or-same conditions; do not introduce a control-flow branch.

### `func_001E04F8`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 28 into `r2`; its identity is the established `runtime_vector_record_table_102`. |
| 4 | Set `r1` to `r1 + (r1 << 1)` without updating flags. |
| 8 | Add immediate 44 to `r0` in place without updating flags. |
| 12 | Set `r1` to `r2 + (r1 << 3)` without updating flags. |
| 16 | Load VFP registers `s0` through `s5` from `r1` using increment-after multiple-register addressing without writeback. |
| 20 | Store VFP registers `s0` through `s5` to `r0` using increment-after multiple-register addressing without writeback. |
| 24 | Return through `lr`. |

The two shifted additions form a 24-byte source-record stride. Preserve the
in-place update of `r1`, the separate 44-byte destination adjustment, the exact
six-register VFP range, and the absence of writeback on both multiple-register
operations.

### `func_0020675C`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 28 into `r2`; its identity is `runtime_record_descriptor_107_c`. |
| 4 | Add immediate 4 to `r1` in place without updating flags. |
| 8 | Store `r2` as a word at address `r0 + 0`. |
| 12 | Set `r2` to `r0 + 4` without updating flags. |
| 16 | Load VFP registers `s0` through `s6` from `r1` using increment-after multiple-register addressing without writeback. |
| 20 | Store VFP registers `s0` through `s6` to `r2` using increment-after multiple-register addressing without writeback. |
| 24 | Return through `lr`. |

Install the descriptor before copying the seven single-precision registers.
The source and destination adjustments are separate integer additions, and the
exact odd-length VFP register range is required. Neither multiple-register
operation writes back its base.

### `func_002ACEC8`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 28 into `r2`; its identity is the established `service_query_context_86`. |
| 4 | Load a word from address `r1 + 0` into `r3`. |
| 8 | Set `r1` to immediate 176 without updating flags. |
| 12 | Store `r1` as a word at address `r0 + 8`. |
| 16 | Store `r2` as a word at address `r0 + 4`. |
| 20 | Store `r3` as a word at address `r0 + 0`. |
| 24 | Return through `lr`. |

The input word must be captured in `r3` before `r1` is overwritten. Preserve
the descending destination-displacement order 8, 4, 0 and the exact register
assignment of all three stores.

### `func_00179D04`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 32 into `r2`; its identity is `runtime_record_descriptor_107_e`. |
| 4 | Set `r3` to zero without updating flags. |
| 8 | Store the low byte of `r3` at address `r0 + 4`. |
| 12 | Store `r1` as a word at address `r0 + 12`. |
| 16 | Store `r2` as a word at address `r0 + 0`. |
| 20 | Store `r3` as a word at address `r0 + 8`. |
| 24 | Store the low byte of `r3` at address `r0 + 5`. |
| 28 | Return through `lr`. |

Preserve the deliberately nonascending store schedule and the byte widths at
displacements 4 and 5. The descriptor installation remains between the input
word store and the zero word store.

## Relocation and identity contract

| Function | Offset | Type | Symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_003CBD34` | 24 | `R_ARM_ABS32` | `runtime_bounded_record_table_107_a` | 0 |
| `func_001E04F8` | 28 | `R_ARM_ABS32` | `runtime_vector_record_table_102` | 0 |
| `func_0020675C` | 28 | `R_ARM_ABS32` | `runtime_record_descriptor_107_c` | 0 |
| `func_002ACEC8` | 28 | `R_ARM_ABS32` | `service_query_context_86` | 0 |
| `func_00179D04` | 32 | `R_ARM_ABS32` | `runtime_record_descriptor_107_e` | 0 |

Every PC-relative load reaches its function's immediately adjacent owned word.
Do not pool or move those words. All five identities denote read-only-data
locations. `runtime_vector_record_table_102` exactly reuses the established
runtime batch 102 identity, and `service_query_context_86` exactly reuses the
established IPC batch 86 identity. The `107_a` and `107_e` identities have at
least four-byte alignment; `107_c` has at least sixteen-byte alignment. The
three new identities are pairwise distinct and distinct from every established
public identity.

This is an owned-relocation runtime batch and is suitable for deterministic
target-object integration. It is not one of the zero-relocation runtime batches
that must remain outside the target generator.

## ELF, section, and symbol contract

- Produce an ELF32 little-endian ARM relocatable object with EABI version 5
  flags exactly `0x05000000` and a canonical all-zero null symbol.
- Record the ARMv6K architecture attributes exactly: CPU name `6K`, CPU
  architecture `v6K`, ARM ISA use, Thumb-1 ISA use, and VFPv2.
- Use one executable `SHT_PROGBITS` section named `.text.<function>` per helper.
  Each section has only `SHF_ALLOC | SHF_EXECINSTR`, alignment four, and size
  exactly equal to the function's `ownedSize`.
- Each owned section has exactly one local `STT_SECTION` symbol, one local
  `STT_NOTYPE` `$a` symbol at offset zero, and one local `STT_NOTYPE` `$d`
  symbol at the body size. Emit no additional named or unnamed symbol in an
  owned section.
- Define exactly five default-visible global `STT_FUNC` symbols. Each has value
  zero, `st_other` zero, and its declared body size; its section is the
  corresponding owned section.
- Each relocation identity is exactly one undefined default-visible global
  `STT_NOTYPE` symbol with zero value and size. The global symbol set consists
  only of the five functions and five identities.
- Use one `SHT_REL` entry of type `R_ARM_ABS32` per owned section at the stated
  adjacent-word offset. Each stored addend is zero. Emit no `SHT_RELA` section
  and no other relocation whose target is an owned section.
- Do not merge, group, link-order, compress, or otherwise annotate an owned
  section. The body-to-data mapping transition occurs only at the declared
  function size.

## Coverage and validation cautions

All five names are complete unmatched ARM bodies in the current report, and
none is owned by an existing public configuration. Their body and owned
intervals are pairwise disjoint. Validation should reject changes to condition
codes, flag behavior, register choices, shifts, memory widths, displacements,
store order, VFP register ranges, or writeback; any call, branch, or indirect
transfer; a missing, extra, moved, or wrong-kind relocation; nonzero relocation
addends; literal pooling; identity merging or splitting; incorrect mapping-
symbol transitions; invented aliases; extra symbols in owned sections;
incorrect undefined-symbol metadata; section flag, alignment, or size drift;
and noncanonical ELF header or null-symbol metadata.

The validator must enforce independent limits of 64 MiB for the complete input,
16 MiB for aggregate executable section data, 16,384 sections, 1,000,000
symbols across both `SYMTAB` and `DYNSYM`, and 1,000,000 relocations. Its
self-test should exercise those limits independently and include a valid
composite object with at least 12,000 unrelated foreign executable sections to
prove bounded complete scanning.
