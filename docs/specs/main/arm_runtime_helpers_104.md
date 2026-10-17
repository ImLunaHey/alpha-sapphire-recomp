# ARM runtime/helper batch 104 clean-room specification

## Scope

This batch covers five complete, currently unmatched ARM-state record
initializers. Each helper owns its executable body and the immediately adjacent
four-byte symbolic word reached by its PC-relative load. The batch therefore
owns 128 executable bytes and 20 adjacent data bytes across five sections. Its
bodies contain 32 fixed-width instructions, 20 memory operations, and five
local returns. There are no calls, direct branches, or indirect transfers. The
resulting object has exactly five `R_ARM_ABS32` relocations.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded private target
inspection of control flow, process-image segment membership, identity
equality, and body multiplicity. No implementation source was inspected during
analysis. The analyst configuration leaves `sourceHash` null; integration must
replace it with the independently authored source's SHA-256.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide and ARM-state. Unless explicitly described as a
return, each operation falls through to the next offset. No constant move
updates condition flags.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | ---: | --- |
| `func_001734DC` | 28 | 4 | 7 | 5 | `func_0017357C` |
| `func_00179360` | 28 | 4 | 7 | 4 | `func_00179380` |
| `func_0024F928` | 20 | 4 | 5 | 3 | `func_0024F940` |
| `func_0033965C` | 24 | 4 | 6 | 4 | `func_003397B0` |
| `func_0039DFAC` | 28 | 4 | 7 | 4 | `func_0039DFD4` |

Each body ends exactly where its owned adjacent word begins. Any later bytes
before `nextGlobal` are outside this batch and must not be emitted in the owned
section.

## Required operation schedules

### `func_001734DC`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the word at address `r1 + 0` into `r2`. |
| 4 | Set `r1` to 111 without updating flags. |
| 8 | Store `r2` as a word at address `r0 + 0`. |
| 12 | Load the PC-relative word at function offset 28 into `r2`; its identity is `service_query_context_86`. |
| 16 | Store `r1` as a word at address `r0 + 8`. |
| 20 | Store `r2` as a word at address `r0 + 4`. |
| 24 | Return through `lr`. |

The entry word loaded through the second argument is preserved at record offset
zero. The established context identity is installed at offset four, and the
constant discriminator is installed at offset eight. Preserve this load and
store order and the reuse of `r1` and `r2`.

### `func_00179360`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 28 into `r1`; its identity is `duplicate_template_25_shared_type`. |
| 4 | Set `r2` to zero without updating flags. |
| 8 | Store `r1` followed by `r2` at addresses `r0 + 0` and `r0 + 4` using one increment-after store-multiple operation without base writeback. |
| 12 | Set `r1` to one without updating flags. |
| 16 | Store `r1` as a word at address `r0 + 4`. |
| 20 | Store the low byte of `r2` at address `r0 + 8`. |
| 24 | Return through `lr`. |

The paired store must remain one store-multiple operation over the exact
ascending register list `r1`, `r2`, with `r0` unchanged. The later word store
overwrites the initially zero word at offset four with one; the byte at offset
eight remains zero.

### `func_0024F928`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 20 into `r1`; its identity is `duplicate_template_25_shared_type`. |
| 4 | Store `r1` as a word at address `r0 + 0`. |
| 8 | Set `r1` to zero without updating flags. |
| 12 | Store `r1` as a word at address `r0 + 4`. |
| 16 | Return through `lr`. |

The same `r1` temporary carries the shared type identity and is then reused for
the zero value. This exact body is the third member of the established class
also containing `func_00240AD8` and `func_0029F57C`.

### `func_0033965C`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 24 into `r1`; its identity is `runtime_record_descriptor_104_a`. |
| 4 | Store `r1` as a word at address `r0 + 0`. |
| 8 | Set `r1` to zero without updating flags. |
| 12 | Store `r1` as a word at address `r0 + 1656`. |
| 16 | Store `r1` as a word at address `r0 + 1660`. |
| 20 | Return through `lr`. |

Preserve both large displacements and their ascending order. The descriptor
store must precede the zeroing stores.

### `func_0039DFAC`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 28 into `r2`; its identity is `runtime_record_descriptor_104_b`. |
| 4 | Set `r1` to 254 without updating flags. |
| 8 | Store `r2` as a word at address `r0 + 0`. |
| 12 | Set `r2` to zero without updating flags. |
| 16 | Store the low byte of `r1` at address `r0 + 4`. |
| 20 | Store `r2` as a word at address `r0 + 8`. |
| 24 | Return through `lr`. |

The byte and word stores have distinct widths and exact displacements. Preserve
the descriptor-first schedule and the separate constant temporaries.

## Relocation and identity contract

| Function | Offset | Type | Symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_001734DC` | 28 | `R_ARM_ABS32` | `service_query_context_86` | 0 |
| `func_00179360` | 28 | `R_ARM_ABS32` | `duplicate_template_25_shared_type` | 0 |
| `func_0024F928` | 20 | `R_ARM_ABS32` | `duplicate_template_25_shared_type` | 0 |
| `func_0033965C` | 24 | `R_ARM_ABS32` | `runtime_record_descriptor_104_a` | 0 |
| `func_0039DFAC` | 28 | `R_ARM_ABS32` | `runtime_record_descriptor_104_b` | 0 |

Every PC-relative load reaches its function's immediately adjacent owned word.
Do not pool or move those words. All four identities denote four-byte-aligned
read-only-data locations. `service_query_context_86` must reuse the established
IPC batch 86 identity. Both `func_00179360` and `func_0024F928` must reuse the
same established `duplicate_template_25_shared_type` identity already used by
the matching initializer class. The two new record descriptor identities are
distinct from one another and from every established public identity.

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
- Each of the four relocation identities is a default-visible global
  `STT_NOTYPE` undefined symbol with `st_other`, value, and size zero and section
  index `SHN_UNDEF`. Repeated uses of
  `duplicate_template_25_shared_type` share one undefined symbol identity.
- Define no alias, nested function, secondary entry, or relocation identity in
  this object. Each owned section has exactly its one listed relocation and no
  other relocation.

## Coverage and validation cautions

All five names are complete unmatched ARM bodies in the current report, and
none is owned by an existing public configuration. Their body and owned
intervals are pairwise disjoint. Four selected bodies have multiplicity one
across the 10,440-function neutral inventory. `func_0024F928` has multiplicity
three and completes the exact duplicate-body class with the already public
`func_00240AD8` and `func_0029F57C`; its literal identity also matches that
class's established shared identity.

Validation should reject instruction substitutions that alter register choice,
memory width, displacement, store order, flag updates, store-multiple
addressing or writeback, or the return register; any call, branch, or indirect
transfer; a missing, extra, moved, or wrong-kind relocation; nonzero relocation
addends; literal pooling; identity merging or splitting; failure to reuse either
established identity; incorrect mapping-symbol transitions; invented aliases;
extra named or unnamed symbols in owned sections; incorrect undefined-symbol
metadata; section flag, alignment, or size drift; noncanonical ELF header or
null-symbol metadata; and any mismatch between the normalized configuration
contract and the validator's pinned contract.

The validator must enforce independent limits of 64 MiB for the complete input,
16 MiB for aggregate executable section data, 16,384 sections, 1,000,000
symbols across both `SYMTAB` and `DYNSYM`, and 1,000,000 relocations. Its
self-test should exercise those limits independently and include a valid
composite object with at least 12,000 unrelated foreign executable sections to
prove bounded complete scanning.
