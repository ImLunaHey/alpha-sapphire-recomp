# ARM runtime/helper batch 105 clean-room specification

## Scope

This batch covers five complete, currently unmatched ARM-state record
initializers. Each helper owns its executable body and the immediately adjacent
four-byte symbolic word reached by its PC-relative load. The batch therefore
owns 172 executable bytes and 20 adjacent data bytes across five sections. Its
bodies contain 43 fixed-width instructions, 31 memory operations, and five
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
| `func_00109434` | 36 | 4 | 9 | 7 | `func_0010945C` |
| `func_0010ABF8` | 40 | 4 | 10 | 8 | `func_0010AC24` |
| `func_001135C8` | 32 | 4 | 8 | 5 | `func_001135EC` |
| `func_00114FD0` | 32 | 4 | 8 | 6 | `func_00114FF4` |
| `func_00135F04` | 32 | 4 | 8 | 5 | `func_00135F28` |

Each body ends exactly where its owned adjacent word begins. Any later bytes
before `nextGlobal` are outside this batch and must not be emitted in the owned
section.

## Required operation schedules

### `func_00109434`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 36 into `r3`; its identity is `runtime_record_descriptor_105_a`. |
| 4 | Set `r2` to zero without updating flags. |
| 8 | Store `r2` as a word at address `r0 + 4`. |
| 12 | Store `r3` as a word at address `r0 + 0`. |
| 16 | Store `r2` as a word at address `r0 + 8`. |
| 20 | Store `r2` as a word at address `r0 + 16`. |
| 24 | Store the incoming `r1` as a word at address `r0 + 12`. |
| 28 | Store `r2` as a word at address `r0 + 20`. |
| 32 | Return through `lr`. |

Preserve the nonascending store order. The descriptor store follows the first
zero store, and the incoming second argument is stored only after the zero
stores at offsets eight and sixteen.

### `func_0010ABF8`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 40 into `r3`; its identity is `runtime_record_descriptor_105_b`. |
| 4 | Set `r2` to zero without updating flags. |
| 8 | Store `r2` as a word at address `r0 + 16`. |
| 12 | Store `r3` as a word at address `r0 + 0`. |
| 16 | Store the low byte of `r2` at address `r0 + 8`. |
| 20 | Store the low byte of `r2` at address `r0 + 9`. |
| 24 | Store the low byte of `r2` at address `r0 + 10`. |
| 28 | Store the incoming `r1` as a word at address `r0 + 4`. |
| 32 | Store `r2` as a word at address `r0 + 12`. |
| 36 | Return through `lr`. |

The three byte stores are distinct operations over consecutive displacements;
do not replace them with a wider store. Preserve the descriptor, incoming
argument, and zero-field schedule exactly.

### `func_001135C8`

| Offset | Required semantics |
| ---: | --- |
| 0 | Store the incoming `r1` as a word at address `r0 + 12`. |
| 4 | Load the PC-relative word at function offset 32 into `r1`; its identity is `runtime_record_descriptor_105_c`. |
| 8 | Set `r2` to 33 without updating flags. |
| 12 | Set `r3` to 171 without updating flags. |
| 16 | Store `r1` as a word at address `r0 + 8`. |
| 20 | Store `r2` as a word at address `r0 + 4`. |
| 24 | Store `r3` as a word at address `r0 + 0`. |
| 28 | Return through `lr`. |

The incoming second argument must be stored before `r1` is reused for the
descriptor. Preserve the descending final field order and the exact temporary
registers used for both constants.

### `func_00114FD0`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 32 into `r2`; its identity is `runtime_record_descriptor_105_d`. |
| 4 | Set `r1` to zero without updating flags. |
| 8 | Store the low byte of `r1` at address `r0 + 4`. |
| 12 | Store `r1` as a word at address `r0 + 40`. |
| 16 | Store `r2` as a word at address `r0 + 0`. |
| 20 | Store `r1` as a word at address `r0 + 44`. |
| 24 | Store the low byte of `r1` at address `r0 + 48`. |
| 28 | Return through `lr`. |

The byte and word stores have intentionally different widths. Preserve their
nonascending schedule and install the descriptor between the word stores at
displacements 40 and 44.

### `func_00135F04`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 32 into `r2`; its identity is `runtime_record_descriptor_105_e`. |
| 4 | Set `r1` to zero without updating flags. |
| 8 | Set `r3` to 520 without updating flags. |
| 12 | Store `r1` as a word at address `r0 + 4`. |
| 16 | Store `r2` as a word at address `r0 + 0`. |
| 20 | Store the low halfword of `r1` at address `r3 + r0`, using register-offset addressing without writeback. |
| 24 | Store the low byte of `r1` at address `r0 + 522`. |
| 28 | Return through `lr`. |

Because `r3` is 520, the halfword store reaches `r0 + 520`, but its required
encoding form uses `r3` as the base and `r0` as the unshifted index. Do not
replace it with immediate-offset addressing or reverse the two address
registers. The following byte store reaches displacement 522.

## Relocation and identity contract

| Function | Offset | Type | Symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_00109434` | 36 | `R_ARM_ABS32` | `runtime_record_descriptor_105_a` | 0 |
| `func_0010ABF8` | 40 | `R_ARM_ABS32` | `runtime_record_descriptor_105_b` | 0 |
| `func_001135C8` | 32 | `R_ARM_ABS32` | `runtime_record_descriptor_105_c` | 0 |
| `func_00114FD0` | 32 | `R_ARM_ABS32` | `runtime_record_descriptor_105_d` | 0 |
| `func_00135F04` | 32 | `R_ARM_ABS32` | `runtime_record_descriptor_105_e` | 0 |

Every PC-relative load reaches its function's immediately adjacent owned word.
Do not pool or move those words. All five identities denote read-only-data
locations. Identities `a`, `b`, `d`, and `e` have at least four-byte alignment;
identity `c` has at least two-byte alignment. The identities are pairwise
distinct and distinct from every established public identity.

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
- Each relocation identity is a default-visible global `STT_NOTYPE` undefined
  symbol with `st_other`, value, and size zero and section index `SHN_UNDEF`.
- Define no alias, nested function, secondary entry, or relocation identity in
  this object. Each owned section has exactly its one listed relocation and no
  other relocation.

## Coverage and validation cautions

All five names are complete unmatched ARM bodies in the current report, and
none is owned by an existing public configuration. Their body and owned
intervals are pairwise disjoint. Every selected body has multiplicity one
across the 10,440-function neutral inventory.

Validation should reject instruction substitutions that alter register choice,
memory width, displacement, store order, flag updates, register-offset
addressing, or the return register; any call, branch, or indirect transfer; a
missing, extra, moved, or wrong-kind relocation; nonzero relocation addends;
literal pooling; identity merging or splitting; incorrect mapping-symbol
transitions; invented aliases; extra named or unnamed symbols in owned
sections; incorrect undefined-symbol metadata; section flag, alignment, or
size drift; noncanonical ELF header or null-symbol metadata; and any mismatch
between the normalized configuration contract and the validator's pinned
contract.

The validator must enforce independent limits of 64 MiB for the complete input,
16 MiB for aggregate executable section data, 16,384 sections, 1,000,000
symbols across both `SYMTAB` and `DYNSYM`, and 1,000,000 relocations. Its
self-test should exercise those limits independently and include a valid
composite object with at least 12,000 unrelated foreign executable sections to
prove bounded complete scanning.
