# ARM runtime/helper batch 109 specification

## Scope and evidence

This batch owns five complete unmatched ARM-state leaf helpers: 100 executable
bytes, 25 fixed-width instructions, ten memory operations, and five local
returns. It has no calls, control-flow branches, indirect transfers,
PC-relative data accesses, adjacent data, or relocations.

Selection used the ignored `AS_EUR_REV2` target object and objdiff report, the
neutral public symbol inventory, and a recursive scan of public source
definitions. All five entries remain unmatched and have no existing source
owner. Each complete body has multiplicity one across the 10,440 authoritative
function bodies. Independently assembled sections compare byte-identically with
the target for all 100 bytes.

Every operation below is four-byte ARM code. Except for the four explicitly
predicated operations in `func_0018C008`, operations are unconditional. All
helpers preserve `sp` and return through `lr`.

## Boundaries

| Function | Bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | --- |
| `func_00175D58` | 12 | 3 | 1 | `func_00175D64` |
| `func_001767C0` | 12 | 3 | 1 | `func_001767CC` |
| `func_00187DA0` | 16 | 4 | 2 | `func_00187DB0` |
| `func_00187DB0` | 28 | 7 | 4 | `func_00187DCC` |
| `func_0018C008` | 32 | 8 | 2 | `func_0018C18C` |

Only those bodies are owned. Material after `func_0018C008`, including the
established secondary entry beginning at body offset 32, is outside this batch.
No selected helper reads post-body material.

## Exact schedules

### `func_00175D58`

| Offset | Operation |
| ---: | --- |
| 0 | Add immediate 4 to `r0` in place without updating flags. |
| 4 | Store VFP registers `s0` through `s3` from `r0` with increment-after multiple-register addressing and no writeback. |
| 8 | Return through `lr`. |

Preserve the separate address adjustment, exact four-register VFP range, and
absence of writeback.

### `func_001767C0`

| Offset | Operation |
| ---: | --- |
| 0 | Load the word at `r0 + 44` into `r1`. |
| 4 | Set `r0` to `r0 + r1` without updating flags. |
| 8 | Return through `lr`. |

The load is ordinary base-relative data access, not PC-relative.

### `func_00187DA0`

| Offset | Operation |
| ---: | --- |
| 0 | Store `r1` as a word at `r0 + 28`. |
| 4 | Set `r1` to `r1 + r2` without updating flags. |
| 8 | Store the updated `r1` as a word at `r0 + 32`. |
| 12 | Return through `lr`. |

The original and updated values must be stored in that order.

### `func_00187DB0`

| Offset | Operation |
| ---: | --- |
| 0 | Move zero into `r1` without updating flags. |
| 4 | Store the low byte of `r1` at `r0 + 128`. |
| 8 | Store the low byte of `r1` at `r0 + 120`. |
| 12 | Move one into `r2` without updating flags. |
| 16 | Store `r1` as a word at `r0 + 124`. |
| 20 | Store the low byte of `r2` at `r0 + 5`. |
| 24 | Return through `lr`. |

Preserve the nonascending displacement order, mixed byte/word widths, and
distinct zero and one registers.

### `func_0018C008`

| Offset | Operation |
| ---: | --- |
| 0 | Set `r0` to `r0 + (r1 << 1)` without updating flags. |
| 4 | Load and zero-extend the byte at indexed address `r0 + r2` into `r1`. |
| 8 | Compare `r1` with zero and update flags. |
| 12 | If equal, move one into `r1` without updating flags. |
| 16 | If equal, store the low byte of `r1` at indexed address `r0 + r2`. |
| 20 | If not equal, move zero into `r0` without updating flags. |
| 24 | If equal, move `r1` into `r0` without updating flags. |
| 28 | Return through `lr`. |

The compare governs all four following predicated operations. None may update
flags. Preserve the complementary equal/not-equal result schedule and do not
introduce a branch.

## Relocation, identity, and ELF contract

The relocation and identity sets are empty. There are no adjacent words,
symbolic data identities, aliases, secondary entries owned by this batch, or
duplicate-body classes.

Produce ELF32 little-endian ARM `ET_REL` with EABI5 flags exactly
`0x05000000`, a canonical null symbol, and exact ARM attributes for CPU `6K`,
architecture `v6K`, ARM ISA use, Thumb-1 ISA use, and VFPv2. Each helper owns
one `.text.<function>` `SHT_PROGBITS` section with flags exactly
`SHF_ALLOC | SHF_EXECINSTR`, alignment four, and its exact body size. Each
owned section contains exactly one local `STT_SECTION`, one local `$a`
`STT_NOTYPE` mapping symbol at zero, and one default-visible global `STT_FUNC`
at zero with its exact body size. No `$d` mapping or other symbol may occur in
an owned section. The standalone global set is exactly the five functions.
Emit no `SHT_REL`, `SHT_RELA`, `DYNSYM`, or nonempty foreign executable
section.

## Validation requirements

Reject instruction, condition, flag, register, shift, VFP range, memory width,
displacement, or ordering changes; any call, branch, indirect transfer,
PC-relative access, relocation, adjacent byte, literal, alias, extra global or
owned-section symbol; malformed mapping/function/section/null symbols; section
metadata drift; incorrect ELF flags or attributes; and foreign executable
payload.

Independently cap complete input at 64 MiB, aggregate executable bytes at
16 MiB, sections at 16,384, aggregate `SYMTAB` plus `DYNSYM` entries at
1,000,000, and aggregate relocations at 1,000,000. Self-tests must exercise
every cap, hostile object mutations, and a valid composite fixture containing
at least 12,000 unrelated zero-sized executable sections.
