# ARM runtime/helper batch 106 clean-room specification

## Scope

This batch covers five complete, currently unmatched ARM-state record
initializers. Each helper owns its executable body and the immediately adjacent
four-byte symbolic word reached by its PC-relative load. The batch therefore
owns 232 executable bytes and 20 adjacent data bytes across five sections. Its
bodies contain 58 fixed-width instructions, 43 memory operations, and five
local returns. There are no calls, direct branches, or indirect transfers. The
resulting object has exactly five `R_ARM_ABS32` relocations.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded private target
inspection of control flow, process-image segment membership, identity
equality, and body multiplicity. No implementation source was inspected during
analysis. The analyst configuration leaves `sourceHash` null; integration must
replace it with the independently authored source's SHA-256.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide, unconditional, and ARM-state. Unless explicitly
described as a return, each operation falls through to the next offset. No
arithmetic or data-movement operation updates condition flags. Every helper
takes its destination record pointer in `r0`, is a leaf, does not adjust the
stack, preserves `sp`, and returns through `lr`.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | ---: | --- |
| `func_00114B50` | 56 | 4 | 14 | 10 | `func_00114B8C` |
| `func_00114B8C` | 44 | 4 | 11 | 9 | `func_00114BBC` |
| `func_0014A214` | 48 | 4 | 12 | 7 | `func_0014A248` |
| `func_0014FBA4` | 36 | 4 | 9 | 7 | `func_0014FBCC` |
| `func_00174D9C` | 48 | 4 | 12 | 10 | `func_00174DD0` |

Each body ends exactly where its owned adjacent word begins, and that word ends
at the next global. Emit no additional bytes in an owned section.

## Required operation schedules

### `func_00114B50`

| Offset | Required semantics |
| ---: | --- |
| 0 | Set `r1` to zero. |
| 4 | Load the PC-relative word at function offset 56 into `r12`; its identity is `runtime_record_descriptor_106_a`. |
| 8 | Store the low byte of `r1` at `r0 + 4`. |
| 12 | Store `r1` as a word at `r0 + 40`. |
| 16 | Store `r12` as a word at `r0 + 0`. |
| 20 | Store `r1` as a word at `r0 + 44`. |
| 24 | Store the low byte of `r1` at `r0 + 49`. |
| 28 | Store the low byte of `r1` at `r0 + 50`. |
| 32 | Store the low byte of `r1` at `r0 + 48`. |
| 36 | Copy `r1` to `r2`. |
| 40 | Copy `r1` to `r3`. |
| 44 | Store the low byte of `r1` at `r0 + 51`. |
| 48 | Store the `r2:r3` register pair as a doubleword at `r0 + 56`, with no writeback. |
| 52 | Return through `lr`. |

Preserve the deliberately nonascending byte-store order. The pair store uses
the even/odd register pair `r2:r3`, both explicitly cleared by register copies;
do not replace the copies or pair store with another zeroing schedule.

### `func_00114B8C`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 44 into `r2`; its identity is `runtime_record_descriptor_106_b`. |
| 4 | Set `r1` to zero. |
| 8 | Store the low byte of `r1` at `r0 + 4`. |
| 12 | Store `r1` as a word at `r0 + 72`. |
| 16 | Store `r2` as a word at `r0 + 0`. |
| 20 | Store `r1` as a word at `r0 + 76`. |
| 24 | Store `r1` as a word at `r0 + 92`. |
| 28 | Store the low byte of `r1` at `r0 + 81`. |
| 32 | Store the low byte of `r1` at `r0 + 80`. |
| 36 | Store the low byte of `r1` at `r0 + 82`. |
| 40 | Return through `lr`. |

The byte stores at displacements 81, 80, and 82 are separate operations in
that exact order. Preserve the descriptor installation between the two early
word stores.

### `func_0014A214`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 48 into `r1`; its identity is the established `duplicate_template_23_type_func_0032ADB0`. |
| 4 | Set `r2` to zero. |
| 8 | Store `r1` and `r2` using increment-after multiple-register addressing from `r0`, without writeback. |
| 12 | Set `r1` to `r0 + 272`. |
| 16 | Store `r2` as a word at `r0 + 8`. |
| 20 | Store `r2` as a word at `r0 + 272`. |
| 24 | Form all-ones in `r3` by complementing immediate zero. |
| 28 | Store the `r2:r3` register pair as a doubleword at `r1 + 4`, with no writeback. |
| 32 | Set `r1` to 47. |
| 36 | Store the low byte of `r1` at `r0 + 12`. |
| 40 | Store the low byte of `r2` at `r0 + 13`. |
| 44 | Return through `lr`. |

The multiple store must use the exact `r1,r2` register list and increment-after
form without writeback. The all-ones value must be formed with an immediate
complement, and the doubleword store must use `r1` as the derived base rather
than folding the effective displacement into an alternative addressing form.

### `func_0014FBA4`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 36 into `r2`; its identity is `runtime_record_descriptor_106_d`. |
| 4 | Set `r1` to zero. |
| 8 | Store `r1` as a word at `r0 + 4`. |
| 12 | Store `r2` as a word at `r0 + 0`. |
| 16 | Store `r1` as a word at `r0 + 8`. |
| 20 | Store `r1` as a word at `r0 + 12`. |
| 24 | Store the low byte of `r1` at `r0 + 12`. |
| 28 | Store the low byte of `r1` at `r0 + 13`. |
| 32 | Return through `lr`. |

The byte stores intentionally overlap the low two bytes of the word store at
displacement 12. They remain distinct operations and must not be removed or
combined.

### `func_00174D9C`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the PC-relative word at function offset 48 into `r2`; its identity is `runtime_record_descriptor_106_e`. |
| 4 | Set `r1` to zero. |
| 8 | Store `r1` as a word at `r0 + 4`. |
| 12 | Store `r2` as a word at `r0 + 0`. |
| 16 | Store `r1` as a word at `r0 + 8`. |
| 20 | Store `r1` as a word at `r0 + 12`. |
| 24 | Store `r1` as a word at `r0 + 16`. |
| 28 | Store `r1` as a word at `r0 + 20`. |
| 32 | Store the low byte of `r1` at `r0 + 24`. |
| 36 | Store `r1` as a word at `r0 + 28`. |
| 40 | Store `r1` as a word at `r0 + 32`. |
| 44 | Return through `lr`. |

Preserve the descriptor store after the first zero word and the byte width at
displacement 24.

## Relocation and identity contract

| Function | Offset | Type | Symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_00114B50` | 56 | `R_ARM_ABS32` | `runtime_record_descriptor_106_a` | 0 |
| `func_00114B8C` | 44 | `R_ARM_ABS32` | `runtime_record_descriptor_106_b` | 0 |
| `func_0014A214` | 48 | `R_ARM_ABS32` | `duplicate_template_23_type_func_0032ADB0` | 0 |
| `func_0014FBA4` | 36 | `R_ARM_ABS32` | `runtime_record_descriptor_106_d` | 0 |
| `func_00174D9C` | 48 | `R_ARM_ABS32` | `runtime_record_descriptor_106_e` | 0 |

Every PC-relative load reaches its function's immediately adjacent owned word.
Do not pool or move those words. All five identities denote read-only-data
locations. Identity `b` has at least eight-byte alignment; the other four have
at least four-byte alignment. The identity used by `func_0014A214` exactly
reuses established public identity
`duplicate_template_23_type_func_0032ADB0`. The four new `106` identities are
pairwise distinct, distinct from that reused identity, and distinct from every
other established public identity.

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

The validator must enforce independent limits of 64 MiB for the complete input,
16 MiB for aggregate executable section data, 16,384 sections, 1,000,000
symbols across both `SYMTAB` and `DYNSYM`, and 1,000,000 relocations. Its
self-test should exercise those limits independently and include a valid
composite object with at least 12,000 unrelated foreign executable sections to
prove bounded complete scanning.
