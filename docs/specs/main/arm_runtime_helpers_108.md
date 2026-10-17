# ARM runtime/helper batch 108 specification

## Scope and evidence

This batch covers five complete unmatched ARM-state leaf helpers. The batch owns
exactly 92 executable bytes containing 23 fixed-width instructions, 15 memory
operations, and five local returns. It contains no calls, direct branches,
indirect transfers, PC-relative data accesses, adjacent data, or relocations.

Selection used the ignored `AS_EUR_REV2` target object and current objdiff
report, the neutral public symbol inventory, and a recursive scan of public
source ownership. All five report entries were unmatched when selected. No
public source defines any selected entry. Each selected body occurs exactly once
among the 10,440 authoritative function bodies. Independently assembled bodies
were compared section-by-section with the authoritative target and all 92 bytes
were identical.

All offsets are byte offsets from the named function entry. Every operation is
four bytes wide and ARM-state. Except for the explicitly conditional store in
`func_0011ECD4`, all operations are unconditional. Each helper is a leaf,
preserves `sp`, and returns through `lr`.

## Boundaries and totals

| Function | Body bytes | Instructions | Memory operations | Next global |
| --- | ---: | ---: | ---: | --- |
| `func_00108CB0` | 16 | 4 | 3 | `func_00109434` |
| `func_0011ECD4` | 16 | 4 | 2 | `func_0011ECE4` |
| `func_0014648C` | 16 | 4 | 2 | `func_0014649C` |
| `func_00161460` | 24 | 6 | 4 | `func_0016148C` |
| `func_0016C090` | 20 | 5 | 4 | `func_0016C0A4` |

Only the executable bodies are owned. In particular, the material between the
end of `func_00108CB0` and `func_00109434`, and the 20 bytes between the end of
`func_00161460` and `func_0016148C`, remain unowned. No post-body byte is read by
these helpers, so no residue, literal, or symbolic identity may be copied into
the implementation.

## Required operation schedules

### `func_00108CB0`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the word at `r0 + 0` into `r2`. |
| 4 | Store `r2` as a word at `r1 + 4`. |
| 8 | Store `r1` as a word at `r0 + 0`. |
| 12 | Return through `lr`. |

The old word must be copied to the new node before the new-node pointer is
installed at the original location. Preserve the exact source, destination,
register choices, and store order.

### `func_0011ECD4`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the word at `r0 + 16` into `r0`. |
| 4 | Compare the loaded `r0` with zero and update flags. |
| 8 | If not equal, store the low byte of `r1` at `r0 + 0`. |
| 12 | Return through `lr`. |

The conditional byte store must be predicated directly by the compare. Do not
replace it with a branch, widen the store, preserve the original input `r0`, or
change flag behavior.

### `func_0014648C`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the word at `r0 + 12` into `r2`. |
| 4 | Set `r1` to `r1 OR r2` without updating flags. |
| 8 | Store `r1` as a word at `r0 + 12`. |
| 12 | Return through `lr`. |

This is an in-place mask accumulation. Preserve the separate load/OR/store
schedule and the non-flag-setting `orr` form.

### `func_00161460`

| Offset | Required semantics |
| ---: | --- |
| 0 | Store `r1` as a word at `r0 + 4`. |
| 4 | Load the word at `r2 + 0` into `r1`. |
| 8 | Set `r3` to one without updating flags. |
| 12 | Store `r1` as a word at `r0 + 8`. |
| 16 | Store the low byte of `r3` at `r0 + 12`. |
| 20 | Return through `lr`. |

Preserve the initial input store before `r1` is overwritten, the exact word
load through `r2`, and the byte width of the final store. The post-body material
beginning at offset 24 is not part of this helper.

### `func_0016C090`

| Offset | Required semantics |
| ---: | --- |
| 0 | Load the word at `r1 + 0` into `r2`. |
| 4 | Store `r2` as a word at `r0 + 0`. |
| 8 | Load the byte at `r1 + 4` into `r3`, zero-extending it. |
| 12 | Store the low byte of `r3` at `r0 + 4`. |
| 16 | Return through `lr`. |

The word and byte fields are copied separately. Preserve both widths, both
displacements, the load/store interleaving, and the `r2`/`r3` assignments.

## Relocation and identity contract

The relocation set is empty. There are no PC-relative accesses, direct or
indirect external transfers, adjacent words, aliases, secondary entries, or
symbolic data identities. The five functions are pairwise distinct complete
bodies; none belongs to a duplicate-body class. References to these names from
other public batches do not own these function bodies.

## ELF, section, and symbol contract

- Produce an ELF32 little-endian ARM relocatable object with EABI version 5
  flags exactly `0x05000000` and a canonical all-zero null symbol.
- Record CPU name `6K`, architecture `v6K`, ARM ISA use, Thumb-1 ISA use, and
  VFPv2 in `.ARM.attributes`.
- Use one executable `SHT_PROGBITS` section named `.text.<function>` per helper.
  Every owned section has only `SHF_ALLOC | SHF_EXECINSTR`, alignment four, and
  size exactly equal to the function body size.
- Each owned section has exactly one local `STT_SECTION` symbol and one local
  `STT_NOTYPE` `$a` mapping symbol at offset zero. No `$d` transition or other
  named or unnamed symbol is allowed in an owned section.
- Define exactly five default-visible global `STT_FUNC` symbols. Each has value
  zero, `st_other` zero, and the declared body size in its corresponding owned
  section. The global symbol set contains only those five functions.
- Emit no `SHT_REL`, `SHT_RELA`, or dynamic symbol table, and no nonempty foreign
  executable section in the standalone object.

## Coverage and validation cautions

Validation must reject any instruction-byte change, condition-code or flag
change, register substitution, reordered operation, changed memory width or
displacement, call, direct branch, indirect transfer, PC-relative access,
relocation, literal, adjacent byte, alias, extra global, `$d` mapping symbol,
extra symbol in an owned section, malformed function or section symbol,
section-size/flag/alignment drift, noncanonical null symbol, wrong ELF header,
or wrong ARM attributes.

The validator must independently cap the complete input at 64 MiB, aggregate
executable section data at 16 MiB, section count at 16,384, aggregate `SYMTAB`
and `DYNSYM` symbols at 1,000,000, and aggregate relocations at 1,000,000. Its
self-test must exercise each cap independently, hostile instruction and ELF
mutations, forbidden relocation and symbol cases, and a valid composite fixture
with at least 12,000 unrelated zero-sized executable sections to prove bounded
complete scanning.
