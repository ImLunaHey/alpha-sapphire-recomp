# ARM runtime/helper batch 112 specification

## Scope and evidence

Batch 112 owns two complete unmatched ARM leaf helpers totaling 48 executable
bytes, 12 instructions, eight memory operations, and two returns. It contains
no calls, branches, indirect transfers, PC-relative accesses, adjacent data, or
relocations.

The ignored authoritative `AS_EUR_REV2` target object and objdiff report,
neutral public symbol inventory, and recursive public source-definition scan
were used for selection. Both entries remain unmatched and have no source
owner. Each complete body occurs once among the 10,440 target functions.
Independent assembly reproduces all 48 target bytes exactly.

All operations are unconditional four-byte ARM instructions. Both helpers
preserve `sp` and return through `lr`.

## Boundaries

| Function | Bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | --- |
| `func_001767B4` | 12 | 3 | 1 | `func_001767C0` |
| `func_001870E4` | 36 | 9 | 7 | `func_0018713C` |

Only the bodies are owned. `func_001767B4` ends exactly at its next global.
The established secondary entry after `func_001870E4`, at owner offset 76,
and all intervening post-body material remain outside this batch.

## Exact schedules

### `func_001767B4`

| Offset | Operation |
| ---: | --- |
| 0 | Load the word at `r0 + 60` into `r1`. |
| 4 | Set `r0` to `r0 + r1` without updating flags. |
| 8 | Return through `lr`. |

### `func_001870E4`

| Offset | Operation |
| ---: | --- |
| 0 | Move zero into `r1` without updating flags. |
| 4 | Store `r1` as a word at `r0 + 0`. |
| 8 | Store `r1` as a word at `r0 + 4`. |
| 12 | Store `r1` as a word at `r0 + 8`. |
| 16 | Store `r1` as a word at `r0 + 12`. |
| 20 | Store `r1` as a word at `r0 + 16`. |
| 24 | Store `r1` as a word at `r0 + 20`. |
| 28 | Store the low byte of `r1` at `r0 + 17`. |
| 32 | Return through `lr`. |

Preserve the six individual word stores, ascending displacements, and the
overlapping byte store at displacement 17. Do not replace them with a
multi-register store or widen the byte access.

## Identity and ELF contract

The relocation and symbolic-identity sets are empty. No adjacent word, alias,
or secondary entry is owned, and both bodies are unique.

Produce ELF32 little-endian ARM `ET_REL` with EABI5 flags exactly
`0x05000000`, a canonical null symbol, and attributes for CPU `6K`,
architecture `v6K`, ARM ISA use, Thumb-1 ISA use, and VFPv2. Give each helper
one `.text.<function>` `SHT_PROGBITS` section with flags exactly
`SHF_ALLOC | SHF_EXECINSTR`, alignment four, and exact body size. Each owned
section contains exactly one local `STT_SECTION`, one local `$a` `STT_NOTYPE`
at zero, and one default-visible global `STT_FUNC` at zero with exact size. No
`$d` or other symbol is allowed there. The standalone global set is exactly
the two functions. Emit no `SHT_REL`, `SHT_RELA`, `DYNSYM`, or nonempty
foreign executable section.

## Validation requirements

Reject changes to instruction bytes, flags, registers, memory widths,
displacements or order, constants, or returns; any call, branch, indirect
transfer, PC-relative access, relocation, adjacent byte, identity, alias, or
extra global/owned symbol; malformed mapping/function/section/null symbols;
incorrect section metadata, ELF flags, or ARM attributes; and foreign
executable payload.

Independently cap complete input at 64 MiB, aggregate executable bytes at
16 MiB, sections at 16,384, aggregate `SYMTAB` plus `DYNSYM` entries at
1,000,000, and aggregate relocations at 1,000,000. Self-tests must cover every
cap, hostile mutations, and a valid composite with at least 12,000 unrelated
zero-sized executable sections.
