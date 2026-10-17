# ARM runtime/helper batch 111 specification

## Scope and evidence

Batch 111 owns four complete unmatched ARM leaf helpers totaling 76 executable
bytes, 19 instructions, eight memory operations, and four returns. It contains
no calls, branches, indirect transfers, PC-relative accesses, adjacent data, or
relocations.

The ignored authoritative `AS_EUR_REV2` target object and objdiff report,
neutral public symbol inventory, and recursive public source-definition scan
were used for selection. All four entries remain unmatched and have no source
owner. Each complete body occurs once among the 10,440 target functions.
Independent assembly reproduces all 76 target bytes exactly.

All operations are four-byte ARM instructions. The three operations after the
compare in `func_003A4E68` have their stated conditions; every other operation
is unconditional. All helpers preserve `sp` and return through `lr`.

## Boundaries

| Function | Bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | --- |
| `func_003A4E68` | 24 | 6 | 2 | `func_003A4F00` |
| `func_00410B30` | 28 | 7 | 4 | `func_00410B4C` |
| `func_004161AC` | 12 | 3 | 1 | `func_00416228` |
| `func_004BF8D0` | 12 | 3 | 1 | `func_004BF8DC` |

Only the bodies are owned. Unnamed post-body material and established
secondary entries before later globals remain outside this batch; none is
addressed by these helpers.

## Exact schedules

### `func_003A4E68`

| Offset | Operation |
| ---: | --- |
| 0 | Load and zero-extend the byte at `r0 + 1628` into `r2`. |
| 4 | Compare unsigned `r2` with `r1` and update flags. |
| 8 | If `r2` is higher, load the word at `r0 + 1624` into `r0`. |
| 12 | If `r2` is lower or the same, move zero into `r0` without updating flags. |
| 16 | If `r2` is higher, set `r0` to `r0 + (r1 << 2)` without updating flags. |
| 20 | Return through `lr`. |

The compare governs all three following predicated operations. Preserve the
unsigned complementary conditions, exact large displacements, and shifted-add
form; do not introduce control flow.

### `func_00410B30`

| Offset | Operation |
| ---: | --- |
| 0 | Move zero into `r1` without updating flags. |
| 4 | Store `r1` as a word at `r0 + 0`. |
| 8 | Store `r1` as a word at `r0 + 4`. |
| 12 | Store `r1` as a word at `r0 + 8`. |
| 16 | Move `0x00800000` into `r1` without updating flags. |
| 20 | Store `r1` as a word at `r0 + 12`. |
| 24 | Return through `lr`. |

Preserve four individual stores, ascending displacements, and the exact final
constant rather than using a multi-register store.

### `func_004161AC`

| Offset | Operation |
| ---: | --- |
| 0 | Move zero into `r1` without updating flags. |
| 4 | Store the low byte of `r1` at `r0 + 4`. |
| 8 | Return through `lr`. |

### `func_004BF8D0`

| Offset | Operation |
| ---: | --- |
| 0 | Load the word at `r0 + 36` into `r1`. |
| 4 | Set `r0` to `r0 + r1` without updating flags. |
| 8 | Return through `lr`. |

## Identity and ELF contract

The relocation and symbolic-identity sets are empty. No adjacent word, alias,
or secondary entry is owned, and the four bodies are unique.

Produce ELF32 little-endian ARM `ET_REL` with EABI5 flags exactly
`0x05000000`, a canonical null symbol, and attributes for CPU `6K`,
architecture `v6K`, ARM ISA use, Thumb-1 ISA use, and VFPv2. Give each helper
one `.text.<function>` `SHT_PROGBITS` section with flags exactly
`SHF_ALLOC | SHF_EXECINSTR`, alignment four, and exact body size. Each owned
section contains exactly one local `STT_SECTION`, one local `$a` `STT_NOTYPE`
at zero, and one default-visible global `STT_FUNC` at zero with exact size. No
`$d` or other symbol is allowed there. The standalone global set is exactly
the four functions. Emit no `SHT_REL`, `SHT_RELA`, `DYNSYM`, or nonempty
foreign executable section.

## Validation requirements

Reject changes to instruction bytes, conditions, flags, registers, shifts,
memory widths/displacements/order, constants, or returns; any call, branch,
indirect transfer, PC-relative access, relocation, adjacent byte, identity,
alias, or extra global/owned symbol; malformed mapping/function/section/null
symbols; incorrect section metadata, ELF flags, or ARM attributes; and foreign
executable payload.

Independently cap complete input at 64 MiB, aggregate executable bytes at
16 MiB, sections at 16,384, aggregate `SYMTAB` plus `DYNSYM` entries at
1,000,000, and aggregate relocations at 1,000,000. Self-tests must cover every
cap, hostile mutations, and a valid composite with at least 12,000 unrelated
zero-sized executable sections.
