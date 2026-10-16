# Probe-verified duplicate ARM templates 26

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body duplicate grouping, control/data-flow inspection,
  code-adjacent read-only table-layout inspection, and independent GNU Arm
  mnemonic probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, table contents, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function exact in the current report and every function named by a
manifest or specification through batch 25 was excluded before grouping. The
concurrently staged batch-25 IPC and runtime selections were audited
explicitly as well. This bounded batch contains two complete-body groups:
exactly six ARM-state functions and 336 code bytes.

There are no post-body literal slots. The only direct control-flow
relocations are the six symbolic branches to the already specified paired
halfword-refill helpers. The table-driven group also derives three read-only
table-view addresses from `pc`; those are semantic position-derived
identities, not address literals or relocations.

## Family pairing

Each repeated codec family has one table-driven decoder, one normalization
helper, and one previously specified halfword-refill helper:

| Family | Table-driven decoder | Normalization helper | Paired halfword refill |
| --- | --- | --- | --- |
| A | `func_001AE6D0` | `func_001B047C` | `func_001B0468` |
| B | `func_001B4CD0` | `func_001B6A7C` | `func_001B6A68` |
| C | `func_001BB2D0` | `func_001BD07C` | `func_001BD068` |

The three halfword-refill helpers are the exact 20-byte functions specified
in `arm_duplicate_templates_25.md`; this batch does not redefine them.

## Signed code normalization with refill tail transfer

These ARM-state functions are 60 bytes and identical over their complete
bodies:

- `func_001B047C`
- `func_001B6A7C`
- `func_001BD07C`

Count the leading zeroes in the bit accumulator `r3` into `r10`, normalize and
double that accumulator, and derive a signed mapped value in `r6`. Update the
available-bit count in `r2` by subtracting twice the leading-zero count and
then one more bit. Return directly when that signed count remains
nonnegative. Otherwise perform a non-linking tail transfer to this family's
paired halfword-refill helper.

The complete required mnemonic schedule is:

```asm
clz r10, r3
lsl r3, r3, r10
add r3, r3, r3
rsb r9, r10, #32
lsr r6, r3, r9
mov r9, #1
add r6, r6, r9, lsl r10
tst r6, #1
rsbne r6, r6, #1
asr r6, r6, #1
lsl r3, r3, r10
sub r2, r2, r10, lsl #1
subs r2, r2, #1
movge pc, lr
b <paired-halfword-refill>
```

The symbolic tail-branch mapping is:

| Function | Branch target |
| --- | --- |
| `func_001B047C` | `func_001B0468` |
| `func_001B6A7C` | `func_001B6A68` |
| `func_001BD07C` | `func_001BD068` |

The final branch is a direct non-linking relocation. There are no calls,
literal slots, or data relocations in this group.

## Table-driven signed-code dispatch

These ARM-state functions are 52 bytes and identical over their complete
bodies:

- `func_001AE6D0`
- `func_001B4CD0`
- `func_001BB2D0`

Use the top six bits of accumulator `r3` to select a byte from the family's
primary decode table. Use that selected byte as the index into both a shift
table and a word displacement table. Shift the accumulator by the selected
width and subtract that width from the available-bit count in `r2`. Save the
incoming link register in `r8`; when the signed count is negative,
conditionally call the paired halfword-refill helper. Load the selected word
displacement, restore the original link register, then perform a computed
non-linking transfer through `pc` relative to the word-table base.

The complete required mnemonic schedule is:

```asm
lsr r6, r3, #26
sub r5, pc, #344
ldrb r5, [r5, r6]
sub r6, pc, #248
ldrb r6, [r6, r5]
lsl r3, r3, r6
subs r2, r2, r6
mov r8, lr
bllt <paired-halfword-refill>
sub r6, pc, #312
ldr r5, [r6, r5, lsl #2]
mov lr, r8
add pc, r5, r6
```

The symbolic conditional-call mapping is:

| Function | `bllt` target |
| --- | --- |
| `func_001AE6D0` | `func_001B0468` |
| `func_001B4CD0` | `func_001B6A68` |
| `func_001BB2D0` | `func_001BD068` |

`bllt` is a direct link-setting conditional call relocation, not an ordinary
conditional branch. The subsequent `mov lr, r8` deliberately restores the
caller's original link value before the computed tail transfer.

For each function, the first `sub` derives the primary 64-byte selector view
at body-relative offset -332. The last `sub` derives the word-displacement
view at body-relative offset -268, which is 64 bytes after the primary view.
The middle `sub` derives the shift-byte view at body-relative offset -228,
which is 104 bytes after the primary view. Name the three distinct family
block identities:

- `duplicate_template_26_decode_tables_a`
- `duplicate_template_26_decode_tables_b`
- `duplicate_template_26_decode_tables_c`

and name their views `<identity>_selector`, `<identity>_word_displacements`,
and `<identity>_shift_widths`, respectively. The three block addresses are
distinct. The corresponding selector, displacement, and shift-width view
contents are equal across A, B, and C, but no table contents are copied into
the implementation and no relocation is emitted for these `pc`-derived
addresses. Preserve the literal `pc` arithmetic in the schedule.

## Symbolic relocation and identity ledger

| Identity or relation | Occurrences | Class | Use |
| --- | ---: | --- | --- |
| paired refill A: `func_001B0468` | 2 | direct code relocation | one unconditional tail branch and one conditional link-setting call |
| paired refill B: `func_001B6A68` | 2 | direct code relocation | one unconditional tail branch and one conditional link-setting call |
| paired refill C: `func_001BD068` | 2 | direct code relocation | one unconditional tail branch and one conditional link-setting call |
| `duplicate_template_26_decode_tables_a` | 3 views | distinct read-only code-adjacent block | selector, word displacement, and shift-width views derived from `pc` |
| `duplicate_template_26_decode_tables_b` | 3 views | distinct read-only code-adjacent block | selector, word displacement, and shift-width views derived from `pc` |
| `duplicate_template_26_decode_tables_c` | 3 views | distinct read-only code-adjacent block | selector, word displacement, and shift-width views derived from `pc` |

The three table blocks are four-byte aligned. Corresponding view contents are
one audited equality class across the three family copies, while their
addresses remain distinct. There are no scalar literals, post-body address
slots, or private absolute values to normalize. A target generator may
normalize only the six audited direct code relocations above.

## Independent full-body probe result

Both complete mnemonic templates were independently assembled in ARM state.
Symbolic branch targets were placed at their audited relative positions so
the final resolved branch instructions, not unresolved placeholders, were
compared. Every listed function's complete declared body was then compared
byte for byte with its corresponding private executable body. The table
contents were excluded from body comparison and inspected only for view
placement, alignment, and cross-family equality.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Signed-code normalization/refill tail | 3 | 60 | 180 | 3/3 exact |
| Table-driven signed-code dispatch | 3 | 52 | 156 | 3/3 exact |
| **Total** | **6** |  | **336** | **6/6 exact** |

Implementation must preserve ARM state; every mnemonic, register, and shift;
the two successive accumulator shifts in the normalization helper; flag
production by `subs`; signed `ge`/`lt` conditions; explicit `pc` returns and
transfers; non-linking versus link-setting branch semantics; the `r8` save and
`lr` restore; `ldrb` versus word `ldr`; the exact `pc`-subtraction schedule;
and each family-to-refill pairing. The overlap audit found zero functions
shared with any exact report entry, any manifest/specification through batch
25, or the concurrent batch-25 IPC/runtime selections.
