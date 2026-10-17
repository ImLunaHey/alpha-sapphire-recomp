# DllStartMenu analysis contract 01

## Scope and provenance

This is a neutral analysis specification for the genuine `cro/DllStartMenu`
link unit. It does not authorize ownership of another unit and contains no ROM,
CRO, extracted asset, target-object payload, proprietary string, or copied
table.

- Target: Pokémon Alpha Sapphire `AS_EUR_REV2`
- Public module identity: SHA-256
  `5f740fc8351ec7620b786a94ca20e8655236df064901aff19d9f72a67f41e3b2`
- Observation date: 2026-10-17
- Public baseline: commit `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`
- Tools: repository CRO converter/splitter and semantic validator; Ghidra
  12.0.2 public inventory; GNU `readelf` and ARM `objdump` 2.44; objdiff
  report schema 2
- Public-inventory inputs:
  `symbols/cro/DllStartMenu.csv` and
  `symbols/cro-partitions/DllStartMenu.json`
- Private evidence: the ignored converted structural target object located
  through the root checkout's ignored `.env.local`. No private path or payload
  is reproduced here.

The observations below were made by the analysis role. An implementation role
may use this document and the public inventory, but must not consult the
private target or target disassembly.

## Authoritative ownership accounting

The structural sections are `.text` 7,212 bytes, `.rodata` 712 bytes, `.data`
4 bytes, and `.bss` 16 bytes. The exact public `.text` partition accounts for
all 7,212 bytes as follows:

| Class | Ranges | Bytes | Current ownership |
| --- | ---: | ---: | --- |
| accepted ARM functions | 2 | 856 | 416 matched; 440 unmatched |
| executable gaps | 123 | 5,676 | unmatched |
| literal/data pools | 123 | 612 | unmatched |
| objectively unknown residue | 4 | 68 | unmatched and completion-blocking |

The accepted functions are:

| Function | `.text` offset | Size | State |
| --- | ---: | ---: | --- |
| `func_00000E44` | `0x0E44` | 440 | unclaimed |
| `func_000014D4` | `0x14D4` | 416 | claimed and byte-identical |

The four unknown ranges are `[0x06D0,0x06D8)`, `[0x195C,0x1964)`,
`[0x1B44,0x1B6C)`, and `[0x1C1C,0x1C28)`. They must be objectively
reclassified before the unit can pass the complete-unit gate. The first two
have simple executable-looking control-flow shapes, the third has a short
executable-looking body followed by scalar-looking words, and the fourth has
three executable-looking terminal bodies. Those descriptions are evidence for
further boundary review, not permission to turn the ranges into functions.

Relocation-backed review narrows that residue without changing the authoritative
public partition in this contract:

- A `.rodata` relocation points directly to `0x06D0`. The range is an
  eight-byte ARM leaf that returns zero, so it has both entry evidence and
  complete terminal coverage. It is a strong reclassification candidate.
- A `.text` relocation points directly to `0x1B44`. Executable coverage runs
  through `0x1B64`; `[0x1B64,0x1B70)` is scalar/pointer pool material, with the
  last word already carrying the BSS relocation. The current 40-byte unknown
  range should therefore be reviewed as a 32-byte function plus an eight-byte
  pool prefix; the existing relocated pool word at `0x1B6C` remains a pool.
- `[0x195C,0x1964)` is a standalone two-instruction word setter, but no
  independent incoming relocation or accepted call edge was observed. It must
  stay unknown until entry evidence is established.
- `[0x1C1C,0x1C28)` is three consecutive terminal instructions. No independent
  entry evidence was observed for any of the three four-byte candidates, so
  they remain unknown under the repository's fail-closed four-byte rule.

The first 768 text bytes are 96 canonical eight-byte ARM import veneers. Each
has a four-byte executable entry followed by its own relocated four-byte pool
word. They account for the first 96 gap ranges and first 96 pool ranges. The
remaining public gap and pool boundaries are already exhaustively recorded in
the partition JSON and should not be duplicated here.

The current report credits one of two functions and 416 of 856 accepted code
bytes. Its data denominator is 1,344 bytes: the 612 text-pool bytes plus 712
read-only bytes, 4 writable bytes, and 16 zero-initialized bytes. None is
currently matched. `metadata.complete` is correctly `false`.

## Relocation contract

All relocations are `R_ARM_ABS32`; none may be discarded, resolved into copied
target bytes, or replaced with a non-deterministic address.

| Output section | Total | Imported | `.text` | `.rodata` | `.data` | `.bss` |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `.text` | 135 | 99 | 15 | 19 | 1 | 1 |
| `.rodata` | 75 | 19 | 41 | 15 | 0 | 0 |

The 96 veneer imports are a subset of the 99 imports emitted in `.text`.
Neutral imported-symbol identities and internal section addends must remain
those produced by the repository converter. This specification intentionally
does not reproduce the proprietary read-only tables or their strings.

## `func_00000E44`: menu-input transition

### Interface

- Mode: ARM
- Size: 440 bytes
- Input `r0`: menu state object
- Input `r1`: input/event token
- Return: zero when an event is consumed; one when no supported transition is
  available
- Preserves the ARM ABI callee-saved registers. The observed frame saves
  `r3-r7` and `lr`; the saved `r3` is the alignment word.

Relevant state fields, expressed only as independently observed offsets:

| Offset | Meaning used by this function |
| ---: | --- |
| `0x5C` | menu/render service passed to slot-selection helpers |
| `0xA4` | optional callback object with a virtual dispatch table |
| `0xA8` | current zero-based selection |
| `0xAC` | mode byte controlling the upper selection bound |

The function uses four existing neutral import veneers:

| Veneer `.text` offset | Contract |
| ---: | --- |
| `0x0178` | classify an event token against a category: `(token, category, 0)` |
| `0x0238` | set one menu slot state: `(service, 0, slot, 1, stack_arg=1)` |
| `0x0240` | classify an event token against a category: `(token, category, 0)` |
| `0x0248` | clear one menu slot state: `(service, 0, slot, 0)` |

The two classifier veneers are distinct dependencies even though their calling
conventions are the same.

### Ordered behavior

1. Classify the input token with category `0x10` through veneer `0x0178`.
   When it matches and the callback at state offset `0xA4` is present,
   dispatch callback vtable slot 0 with the current selection from `0xA8`,
   enable service slot `selection + 7` through veneer `0x0238`, and return
   zero. If the callback is absent, continue with category 4 rather than
   consuming the event here.
2. If category `0x10` did not match, classify category `0x20` through the same
   veneer. When it matches and the callback is present, dispatch callback
   vtable slot 1 and return zero. If the callback is absent, continue with
   category 4.
3. If neither callback category matched, classify category 4 through veneer
   `0x0240`. If it matches and the current selection is nonzero, dispatch
   callback vtable slot 2 when a callback exists, decrement the selection, and
   store it at `0xA8`. Clear service slots 0 through 3 inclusively with four
   ordered calls to veneer `0x0248`; then enable the new selected slot through
   veneer `0x0238`. Return zero. A category-4 event at selection zero is still
   consumed and returns zero without changing state.
4. Otherwise classify category 8 through veneer `0x0240`. If it does not
   match, return one. If it matches, compute the exclusive upper bound as 3
   when the mode byte at `0xAC` equals 1, otherwise 2. A selection already at
   or above the bound is consumed and returns zero unchanged.
5. For an in-range category-8 transition, dispatch callback vtable slot 2 when
   a callback exists, increment and store the selection, clear service slots
   0 through 3 in order, enable the new selected slot, and return zero.

### Code-generation constraints observed at the interface boundary

- The selection-clear loop is one shared four-iteration loop in each movement
  direction, using an incrementing counter and a signed `<= 3` continuation.
- Callback dispatches load the callback's table from object offset zero and
  use table byte offsets 0, 4, and 8 respectively.
- Both movement directions retain the new selection in a callee-saved register
  across the four clear calls and pass the fifth argument to the enable helper
  in the first stack argument word.
- Category-4 testing precedes category-8 testing. The category-4 lower-bound
  check occurs before callback dispatch; the category-8 upper-bound check also
  occurs before callback dispatch.
- The target compiler emitted scheduling no-ops around several indirect calls
  and classifier result tests. They have no semantic effect, but an assembly
  implementation seeking the exact 440-byte body must preserve the public
  function size and tune instruction scheduling against objdiff rather than
  inventing extra data or owning adjacent pools.

### Complete neutral mnemonic schedule

This is the complete instruction schedule for the accepted 440-byte body. It
uses symbolic local labels and the neutral public veneer offsets above; it is
not an opcode dump. `nop` denotes the ARM scheduling instruction used by this
toolchain. `callx` denotes an indirect ARM call through the named register.
No literal or adjacent pool belongs to this function.

```text
entry:
  push {r3,r4,r5,r6,r7,lr}
  r5 = r1
  r4 = r0
  r2 = 0
  r1 = 0x10
  r0 = r5
  call veneer_0178
  compare r0, 0
  r7 = 1
  if equal goto test_category_20

category_10:
  r0 = word[r4 + 0xA4]
  compare r0, 0
  if equal goto test_category_4
  r1 = word[r0]
  r2 = word[r1]
  r1 = word[r4 + 0xA8]
  callx r2
  r1 = word[r4 + 0xA8]
  word[sp] = r7
  r0 = word[r4 + 0x5C]
  r2 = r1 + 7
  r3 = 1
  r1 = 0
  call veneer_0238
  goto return_zero

test_category_20:
  r2 = 0
  r1 = 0x20
  r0 = r5
  call veneer_0178
  compare r0, 0
  nop
  if equal goto test_category_4
  r0 = word[r4 + 0xA4]
  compare r0, 0
  if equal goto test_category_4
  r1 = word[r0]
  r1 = word[r1 + 4]
  callx r1

return_zero:
  r0 = 0

pop_result:
  pop {r3,r4,r5,r6,r7,pc}

test_category_4:
  r2 = 0
  r1 = 4
  r0 = r5
  call veneer_0240
  compare r0, 0
  nop
  if equal goto test_category_8
  r0 = word[r4 + 0xA8]
  compare r0, 0
  if equal goto return_zero
  r0 = word[r4 + 0xA4]
  compare r0, 0
  if equal goto decrement_selection
  r1 = word[r0]
  r1 = word[r1 + 8]
  callx r1

decrement_selection:
  r0 = word[r4 + 0xA8]
  r5 = 0
  r6 = r0 - 1
  word[r4 + 0xA8] = r6

clear_after_decrement:
  r3 = 0
  r0 = word[r4 + 0x5C]
  r2 = r5
  r1 = r3
  call veneer_0248
  r5 = r5 + 1
  compare r5, 3
  if signed-less-or-equal goto clear_after_decrement
  goto enable_selection

test_category_8:
  r2 = 0
  r1 = 8
  r0 = r5
  call veneer_0240
  compare r0, 0
  if equal r0 = 1
  if equal goto pop_result
  r0 = byte[r4 + 0xAC]
  r1 = word[r4 + 0xA8]
  compare r0, 1
  if equal r0 = 3
  if not-equal r0 = 2
  compare r0, r1
  if unsigned-lower-or-same goto return_zero
  r0 = word[r4 + 0xA4]
  compare r0, 0
  if equal goto increment_selection
  r1 = word[r0]
  r1 = word[r1 + 8]
  callx r1

increment_selection:
  r0 = word[r4 + 0xA8]
  r5 = 0
  r6 = r0 + 1
  word[r4 + 0xA8] = r6

clear_after_increment:
  r3 = 0
  r0 = word[r4 + 0x5C]
  r2 = r5
  r1 = r3
  call veneer_0248
  r5 = r5 + 1
  compare r5, 3
  if signed-less-or-equal goto clear_after_increment

enable_selection:
  word[sp] = r7
  r0 = word[r4 + 0x5C]
  r3 = 1
  r2 = r6
  r1 = 0
  call veneer_0238
  nop
  nop
  goto return_zero
```

For exact ARM emission, each assignment, load, store, comparison, conditional
assignment, call, branch, `nop`, push, and pop line above corresponds to one
32-bit instruction. Labels and blank lines emit nothing. The schedule contains
110 instructions, hence exactly 440 bytes.

## Requirements for a genuinely complete unit

A 100% score on the two currently accepted functions is only an intermediate
milestone. Completion requires all of the following at once:

1. Every accepted function and executable gap is independently implemented;
   every literal pool has deterministic authored contents or relocations.
2. The 68 unknown text bytes are objectively classified, with the public
   partition and semantic validation updated accordingly.
3. All 210 relocation outputs retain exact type, target identity, addend, and
   section-relative output location.
4. All 712 read-only bytes and 4 writable bytes are independently specified
   and authored, and the 16-byte BSS extent is preserved.
5. The reconstructed split base ELF is byte-identical to the complete target
   ELF under the repository's fail-closed comparison, causing
   `metadata.complete` to become true for equality rather than by assertion.

The presently observed `.rodata` includes proprietary names and structured
tables. Clean-room analysis may record behavior and layout, but may not copy
those strings/tables from the target. Without an independent public source or
black-box observation that determines those bytes, exact data reconstruction
is a concrete blocker to a fully linked clean-room unit. It does not block the
440-byte accepted-function implementation described above.
