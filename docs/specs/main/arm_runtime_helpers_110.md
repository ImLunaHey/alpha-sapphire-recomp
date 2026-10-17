# ARM runtime/helper batch 110 specification

## Scope and evidence

This batch owns five complete unmatched ARM-state leaf helpers totaling 84
executable bytes, 21 instructions, six memory operations, and five returns.
There are no calls, branches, indirect transfers, PC-relative data accesses,
adjacent data, or relocations.

Selection used the ignored authoritative `AS_EUR_REV2` target object and
objdiff report, the neutral public symbol inventory, and a recursive public
source-definition scan. Every selected entry remains unmatched and source
unowned. Each body has multiplicity one across the 10,440 target functions.
Independent assembly and section-scoped comparison reproduce all 84 target
bytes exactly.

Every operation below is four-byte ARM code. Only the move at offset 8 in
`func_0032EC70` is conditional. Each helper preserves `sp` and returns via
`lr`.

## Boundaries

| Function | Bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | --- |
| `func_001947D8` | 16 | 4 | 0 | `func_00194854` |
| `func_00205870` | 12 | 3 | 1 | `func_00205A98` |
| `func_0031001C` | 12 | 3 | 1 | `func_00310028` |
| `func_0032EC70` | 16 | 4 | 1 | `func_0032ECA4` |
| `func_003AB384` | 28 | 7 | 3 | `func_003ABB0C` |

Only these bodies are owned. All post-body material, including established
secondary entries at body boundaries and unnamed bytes before later globals,
remains outside batch 110. None is addressed by a selected helper.

## Exact schedules

### `func_001947D8`

| Offset | Operation |
| ---: | --- |
| 0 | Move the raw bits in `r0` into single-precision register `s0`. |
| 4 | Convert floating-point `s0` to unsigned 32-bit integer in `s2`. |
| 8 | Move the raw integer bits in `s2` into `r0`. |
| 12 | Return through `lr`. |

Preserve the exact `s0`/`s2` split and unsigned `f32`-to-`u32` VFP conversion.
The two `vmov` instructions are register transfers, not memory operations.

### `func_00205870`

| Offset | Operation |
| ---: | --- |
| 0 | Move zero into `r1` without updating flags. |
| 4 | Store the low byte of `r1` at `r0 + 529`. |
| 8 | Return through `lr`. |

Preserve the byte width and exact large displacement `0x211`.

### `func_0031001C`

| Offset | Operation |
| ---: | --- |
| 0 | Move zero into `r1` without updating flags. |
| 4 | Store `r1` as a word at `r0 + 12`. |
| 8 | Return through `lr`. |

### `func_0032EC70`

| Offset | Operation |
| ---: | --- |
| 0 | Load the word at `r0 + 8` into `r0`. |
| 4 | Compare `r0` with zero and update flags. |
| 8 | If not equal, move one into `r0` without updating flags. |
| 12 | Return through `lr`. |

For a zero loaded value the original zero remains in `r0`; otherwise the
result becomes one. Preserve predication rather than introducing a branch.

### `func_003AB384`

| Offset | Operation |
| ---: | --- |
| 0 | Move one into `r3` without updating flags. |
| 4 | Store the low byte of `r3` at `r0 + 8`. |
| 8 | Move zero into `r2` without updating flags. |
| 12 | Store `r1` as a word at `r0 + 12`. |
| 16 | Store the low byte of `r2` at `r0 + 10`. |
| 20 | Move `r1` into return register `r0` without updating flags. |
| 24 | Return through `lr`. |

Preserve the nonascending, mixed-width store schedule, the distinct constant
registers, and the final return-value move after all stores.

## Identity and ELF contract

The relocation and symbolic-identity sets are empty. There are no adjacent
words, aliases, or batch-owned secondary entries, and all bodies are unique.

Produce ELF32 little-endian ARM `ET_REL` with EABI5 flags exactly
`0x05000000`, canonical null symbol metadata, and exact attributes for CPU
`6K`, architecture `v6K`, ARM ISA use, Thumb-1 ISA use, and VFPv2. Each helper
owns one `.text.<function>` `SHT_PROGBITS` section whose only flags are
`SHF_ALLOC | SHF_EXECINSTR`, alignment is four, and size is the exact body
size. Each owned section has one local `STT_SECTION`, one local `$a`
`STT_NOTYPE` mapping at zero, and one default-visible global `STT_FUNC` at zero
with the exact body size. No `$d` or other symbol may occur there. The
standalone global set is exactly the five functions. Emit no `SHT_REL`,
`SHT_RELA`, `DYNSYM`, or nonempty foreign executable section.

## Validation requirements

Reject changes to any instruction, predicate, flag behavior, register, VFP
conversion/register assignment, memory width/displacement/order, or return;
any call, branch, indirect transfer, PC-relative access, relocation, adjacent
byte, literal, alias, or extra global/owned symbol; malformed mapping,
function, section, or null symbols; wrong section metadata, ELF flags, or ARM
attributes; and foreign executable payload.

Independently cap the complete input at 64 MiB, aggregate executable bytes at
16 MiB, sections at 16,384, aggregate `SYMTAB` and `DYNSYM` entries at
1,000,000, and aggregate relocations at 1,000,000. Self-tests must exercise all
caps, hostile object mutations, and a valid composite fixture with at least
12,000 unrelated zero-sized executable sections.
