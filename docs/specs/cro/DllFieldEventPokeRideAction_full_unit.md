# DllFieldEventPokeRideAction full-unit analysis

This is a neutral analysis specification for the genuine
`cro/DllFieldEventPokeRideAction` link unit. It describes independently
observed boundaries and behavior; it contains no target bytes, encoded
instructions, disassembly, strings, copied tables, assets, or SDK material.
It is intended for an implementation contributor who has not inspected the
target.

## Provenance and scope

- Role: analysis/specification only. No implementation source was consulted to
  derive the new observations below.
- Target: Pokemon Alpha Sapphire, `AS_EUR_REV2`.
- Public whole-module identity: 12,288 bytes, SHA-256
  `3aed5187d9e0133002d811989eb81b55bb6ee1c3ff4bda7ad8969dd1bdbf4e9c`,
  as recorded in `progress/units/AS_EUR_REV2.cro.json`.
- Repository baseline inspected: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Observation date: 2026-10-17.
- Analysis tools: the repository CRO-to-ELF converter and split-object tools at
  the baseline above; GNU Arm `objdump` and `readelf` 2.44; the existing public
  inventory was produced under the documented Ghidra 12.0.2 workflow.
- Private input handling: the ignored root-checkout `.env.local` was used only
  to locate the external module. Neither the module, a generated target object,
  private paths, nor extracted content is included here.

The existing public report credits one 304-byte function. Its `metadata.complete`
is correctly `false`. This specification covers the rest of the link unit, but
does not itself authorize a completeness claim; the complete-unit gate must
prove the resulting code, pools, data, BSS, and relocations.

## Link-unit boundary

The module has four allocated segments:

| Segment | Size | Alignment | Neutral content classification |
| --- | ---: | ---: | --- |
| `.text` | `0x0A14` (2,580) | 4 | ARM code, import veneers, jump tables, and literal pools |
| `.rodata` | `0x64` (100) | 4 | descriptor records and pointer-bearing records |
| `.data` | `0x08` (8) | 4 | writable module state |
| `.bss` | `0x38` (56) | 4 | zero-initialized control/state storage |

The tracked split report currently presents `.text` as 2,204 code bytes, 324
pool bytes, and 52 unknown bytes. Complete analysis reclassifies the unknown
bytes as 44 code bytes and 8 pool bytes. The final text accounting is therefore:

- 2,248 bytes of ARM code, including 172 bytes of import-veneer instructions;
- 332 bytes of embedded pools/tables, including the 172 import pointer words;
- zero padding bytes;
- zero unknown bytes.

The four allocated segments total 2,744 bytes. The loadable data denominator is
164 bytes (`.rodata + .data + .bss`); the text pools remain separately accounted
inside `.text`.

## Exact text partition

All offsets are relative to `.text`; end offsets are exclusive. `code-fragment`
means part of one logical function separated from another fragment by a pool.
The split-object representation must keep every relocation output in a pool,
so the two switch functions cannot be represented as one contiguous executable
section.

| Start | End | Size | Classification |
| ---: | ---: | ---: | --- |
| `0x000` | `0x158` | 344 | 43 import veneers, each one 4-byte ARM veneer followed by one 4-byte relocation word |
| `0x158` | `0x384` | 556 | function `func_00000158` |
| `0x384` | `0x394` | 16 | literal pool for `func_00000158` |
| `0x394` | `0x3A0` | 12 | function `func_00000394` |
| `0x3A0` | `0x3A8` | 8 | function `func_000003A0` |
| `0x3A8` | `0x494` | 236 | function `func_000003A8` |
| `0x494` | `0x5C4` | 304 | function `func_00000494` |
| `0x5C4` | `0x5D0` | 12 | literal pool for `func_00000494` |
| `0x5D0` | `0x65C` | 140 | function `func_000005D0` |
| `0x65C` | `0x694` | 56 | first code fragment of `func_0000065C` |
| `0x694` | `0x6B0` | 28 | seven-entry internal jump table |
| `0x6B0` | `0x874` | 452 | second code fragment of `func_0000065C` |
| `0x874` | `0x87C` | 8 | literal pool for `func_0000065C` |
| `0x87C` | `0x8D0` | 84 | function `func_0000087C` |
| `0x8D0` | `0x8DC` | 12 | literal pool for `func_0000087C` |
| `0x8DC` | `0x92C` | 80 | function `func_000008DC` |
| `0x92C` | `0x938` | 12 | literal pool for `func_000008DC` |
| `0x938` | `0x958` | 32 | function `func_00000938` |
| `0x958` | `0x964` | 12 | literal pool for `func_00000938` |
| `0x964` | `0x978` | 20 | first code fragment of `func_00000964` |
| `0x978` | `0x98C` | 20 | five-entry internal jump table |
| `0x98C` | `0x9EC` | 96 | second code fragment of `func_00000964` |
| `0x9EC` | `0xA14` | 40 | literal/descriptor pool for `func_00000964` |

There are eleven semantic function entries: `0x158`, `0x394`, `0x3A0`,
`0x3A8`, `0x494`, `0x5D0`, `0x65C`, `0x87C`, `0x8DC`, `0x938`, and `0x964`.
The 43 leading linker veneers are code and must match, but are not counted as
the module's semantic functions. All code is ARM mode; no Thumb islands occur.

## Shared object layout

The principal object is at least `0x360` bytes. Only fields evidenced by this
unit are specified:

| Offset | Shape | Observed role |
| ---: | --- | --- |
| `0x18` | word | state number, values 0 through 6 |
| `0x1C` | pointer | owner/service handle used through a member at `+0x34` |
| `0x20` | pointer | event/system handle |
| `0x24` | pointer | nested context used by initialization |
| `0x28` | pointer | current ride/action object; null is meaningful |
| `0x2C` | byte | subsystem-created flag |
| `0x2D` | byte | action-initialized flag |
| `0x2E` | byte | action-running flag |
| `0x30`, `0x34` | pointers | two acquired resource handles |
| `0x38`, `0x3C` | pointers | two allocated resource objects |
| `0x40` | word | setup output/state passed to the event system |
| `0x44` | word-sized embedded helper |
| `0x48` | six elements, stride `0x40` | six resource/animation helpers |
| `0x1C8` | five elements, stride `0x24` | five transform/result records |
| `0x27C` | five bytes | per-result active flags |
| `0x284` | embedded aggregate | five-result coordinator/control object |
| `0x34C` | word-sized output | setup result passed between phases |
| `0x358` | float | accumulated update time/value |
| `0x35C` | float | startup countdown |

The ABI uses ordinary AAPCS core arguments and VFP scalar arguments where
noted. Boolean results are returned as integer zero or one.

## Function behavior contracts

### `func_00000158` — initialize ride-action work

Conceptual signature:

```c
bool func_00000158(ActionWork *self, void *unused_or_context, int mode);
```

The second incoming argument is not retained in the observed path. The routine
saves core registers `r4` through `r11` and `lr`, saves one VFP double-register,
and uses `0x34` bytes of local stack.

Behavior:

1. If `self->created` (`+0x2C`) is clear, return true without changing the
   subordinate action state.
2. Query the event/system handle (`+0x20`) and populate the word at `+0x40`.
   If the query reports failure, return true.
3. Initialize the helper at `+0x44` from `+0x40`.
4. For six entries, obtain a descriptor selected by a six-element constant
   descriptor list, initialize the corresponding `0x40`-byte helper at `+0x48`,
   and invoke the module's failure-reporting hook if initialization fails.
5. Build a zero-initialized local coordinator descriptor. Its observable
   nonzero fields are a kind/count pair of 4 and 5 and a final enable value of
   one. Initialize the embedded aggregate at `+0x284`, then apply the incoming
   `mode` to it.
6. For each of five action channels, clear its byte at `+0x27C`, probe three
   ordered capabilities on the associated six-entry helper, and select the
   first positive probe as selector 1, 2, or 3. If none is positive, leave the
   channel inactive.
7. For an active channel, derive its `0x24`-byte record at `+0x1C8`, register it
   with the embedded aggregate, set two scalar channel values to `1.0f`, and
   mark every channel except the last active.
8. The last channel has a conditional special case: follow `+0x24`, then two
   nested fields (`+0x0C` and `+0xA24`). If non-null and its queried identifier
   equals 4103, set the first scalar channel value to `1.5f`.
9. Set `+0x358` to `1.0f`, `+0x35C` to `16.0f`, set `+0x2D`, and return true.

Compiler-relevant structure: the six-entry and five-entry loops are unsigned
counted loops; the capability probes are strictly ordered with early selection;
the special identifier comparison is expressed as subtract 4096 then compare
with 7 in the observed code shape.

### `func_00000394` — store a pair

Conceptual signature:

```c
void func_00000394(ActionWork *self, uint32_t first, uint32_t second);
```

Store the two incoming words consecutively at `self + 0x24` and `self + 0x28`.
This is a three-instruction leaf with no stack frame.

### `func_000003A0` — constant-success leaf

Conceptual signature:

```c
bool func_000003A0(void);
```

Return true. This is a two-instruction leaf with no stack frame.

### `func_000003A8` — release/teardown

Conceptual signature:

```c
void func_000003A8(ActionWork *self);
```

The routine saves `r4` through `r6` and `lr`.

1. If `+0x38` is null, return immediately.
2. If `+0x2C` is set, first stop the embedded aggregate when `+0x2E` is set,
   then clear `+0x2E`.
3. If `+0x2D` is set, release the embedded aggregate, release all five
   `0x24`-byte records, release all six `0x40`-byte helpers, and release the
   helper at `+0x44`. Clear `+0x2D`.
4. Clear `+0x2C`, notify `+0x20` with event identifier 151, destroy each
   non-null allocated resource at `+0x38` and `+0x3C` via its virtual slot 1,
   then clear `+0x38`.

The two virtual destroys are separate null-guarded calls. The second stored
pointer is not explicitly cleared in the observed routine.

### `func_00000494` — per-frame action update

Conceptual signature:

```c
bool func_00000494(ActionWork *self, void *update_context, uint32_t update_arg);
```

The routine saves `r4` through `r8` and `lr` and one VFP double-register.

1. If `+0x2D` is clear, return true.
2. If the float countdown at `+0x35C` is greater than zero, decrement it by
   `1.0f`. When it crosses to non-positive, start the embedded aggregate with
   zeroed trailing arguments, set `+0x2E`, forward `update_arg` through
   `update_context`, and emit the module's fixed action notification.
3. If `+0x2E` is clear, return false.
4. Tentatively set the result to true. For each of five channels whose active
   byte at `+0x27C` is nonzero, poll the aggregate. If a channel has not
   completed, update it with the current `+0x358` scalar and clear the result.
5. Add `1.0f` to `+0x358` every running-frame pass.
6. If all active channels are complete and `+0x2E` is still set, stop the
   aggregate and clear `+0x2E`.
7. Return whether all active channels were complete on this pass.

The exact 304-byte implementation already exists and is independently pinned
by the contract-09 validator.

### `func_000005D0` — acquire runtime dependencies

Conceptual signature:

```c
void func_000005D0(ActionWork *self, RuntimeContext *context);
```

The routine saves `r4` through `r6` and `lr`.

1. Derive and store the owner/service pointer at `+0x1C` from
   `context + 0x48`.
2. Derive and store the event/system pointer at `+0x20` from `context`.
3. Acquire resource handles for identifiers 8 and 9 into `+0x30` and `+0x34`.
4. Allocate two 12-byte objects. If each allocation succeeds, construct it
   using handle 8 or handle 9 respectively; store them at `+0x38` and `+0x3C`.
5. Tail-call the event/system registration operation with the pointer at
   `+0x20`, a context field corresponding to original `self + 0x30`, identifier
   151, and a zero final argument.

The final load uses writeback on the local `self` register before the tail
call; this affects exact compiler shape but not behavior.

### `func_0000065C` — seven-state lifecycle dispatcher

Conceptual signature:

```c
bool func_0000065C(ActionWork *self, RuntimeContext *context);
```

The routine saves `r3` through `r11` and `lr`. It uses a seven-entry address
table embedded between its dispatch prologue and case bodies. State is read
from `self + 0x18`; values outside 0 through 6 return false.

The routine obtains a nested runtime object by following `self + 0x24` and then
offset `+0x0C`. It also obtains a context-derived word by following
`context + 0x1C` and then offset `+0x20`; these are live across cases.

- State 0: if `+0x28` is null, set state 2 and return false. Otherwise invoke a
  setup operation on `+0x28` with output at `+0x34C`. Lazily initialize the
  40-byte module-global control record in BSS using its guard word. Populate
  that record with identifier 151, an enabled byte, a newly acquired 12-byte
  resource, the handle at `+0x34`, a size of 128, and `self + 0x40`. Register it
  through `+0x20`; store the boolean result in `+0x2C`, clear `+0x2D` and
  `+0x2E`, and report failure through the common hook if registration fails.
  The state is written as 1 and then immediately as 2 before falling through.
- State 1: set state 2 and fall through to state 2.
- State 2: call `func_00000158(self, context, &self->field_34C)`. If it reports
  false, return false. Otherwise update the nested runtime object with its
  current value and a limit of 128, set state 3, and fall through.
- State 3: call `func_00000494(self, context-derived-word, self->field_28)`, then
  poll the nested runtime object. If the poll is false, return false. Otherwise
  update it with its current value and a limit of 112, set state 4, and fall
  through.
- State 4: call `func_00000494` again with the same arguments. Set state 5 when
  `+0x28` is non-null, otherwise state 6, then return false.
- State 5: call `func_00000494(self, context-derived-word, self->field_28)`. If
  it returns true, set state 6 and return true; otherwise return false.
- State 6: return true.

Two compare-and-branch flag-preserving no-op shapes occur around boolean
external calls in this routine and should be retained when matching compiler
output.

### `func_0000087C` — deleting-destructor wrapper

Conceptual signature:

```c
void func_0000087C(ActionWork *self);
```

Store descriptor A at object offset zero, release the embedded aggregate at
`+0x284`, destroy five `0x24`-byte elements at `+0x1C8`, destroy six
`0x40`-byte elements at `+0x48`, destroy/release the helper at `+0x44`, invoke
the matching base-object teardown on the enclosing object, then tail-call the
final release operation. The element destruction is expressed through counted
array helpers with `(element_size, count)` equal to `(0x24, 5)` and
`(0x40, 6)`.

The function has an 84-byte code body and a 12-byte three-word pool. Its pool
contains one internal descriptor relocation and two external relocations.

### `func_000008DC` — base-destructor wrapper

Conceptual signature:

```c
void func_000008DC(ActionWork *self);
```

This is the companion of `func_0000087C`. Store descriptor B, release the same
embedded aggregate, destroy the same five- and six-element arrays, and
destroy/release the helper at `+0x44`. Restore the enclosing-object pointer and
tail-call the base-object teardown. Unlike the deleting wrapper, it does not
invoke the final object-release operation.

The function has an 80-byte code body and the same relocation shape in its
12-byte pool as wrapper A.

### `func_00000938` — initialize four scalar defaults

Conceptual signature:

```c
void func_00000938(void);
```

Write four floats to the 16-byte BSS block beginning at `+0x28`: the first two
are `0.7f`, and the final two are `1.0f`. This is a 32-byte ARM leaf followed by
a 12-byte pool holding the two scalar constants and one relocated BSS pointer.

### `func_00000964` — module control dispatcher

Conceptual signature:

```c
uint32_t func_00000964(void *output_or_value, uint32_t selector);
```

This exported control entry uses a five-entry address table between its
dispatch prologue and case bodies. A relocated pointer to the 8-byte writable
module state is loaded before dispatch.

- Selector 0 stores null through the output pointer and returns zero.
- Selector 1 stores the incoming value/pointer into the module-state slot and
  returns zero.
- Selector 2 copies the module-state slot through the output pointer and
  returns zero.
- Selector 3 writes the begin/end pair for the module's static-initializer text
  range through the output pointer and returns zero.
- Selector 4 writes an empty begin/end range at the end of `.rodata` through
  the output pointer and returns zero.
- Other selectors return the module's fixed loader/control descriptor word.

The logical function has 116 code bytes, a 20-byte internal jump table, and a
40-byte trailing descriptor/literal pool. Some loader-recognized no-op/flag
shapes in the default path are semantically inert but compiler-relevant.

## Relocation schedule

The target has 81 `R_ARM_ABS32` relocations: 71 in `.text` and 10 in
`.rodata`. There are no relocations in `.data` or `.bss`, and no other
relocation type occurs.

### Text relocations

| Range/pool | Count | Targets |
| --- | ---: | --- |
| veneer words `0x004..0x154`, stride 8 | 43 | undefined imports, one per veneer |
| `0x384..0x394` | 1 | `.rodata` |
| `0x694..0x6B0` | 7 | internal `.text` case targets |
| `0x874..0x87C` | 2 | `.data`, `.bss` |
| `0x8D0..0x8DC` | 3 | `.rodata`, two undefined imports |
| `0x92C..0x938` | 3 | `.rodata`, two undefined imports |
| `0x958..0x964` | 1 | `.bss` |
| `0x978..0x98C` | 5 | internal `.text` case targets |
| `0x9EC..0xA14` | 6 | one `.data`, three `.text`, two `.rodata` |

The remaining words in these pools are non-relocated scalar constants,
counts, bounds, or loader descriptor values. Implementations must reproduce
them from the behavioral contracts or neutral constants stated here; they must
not import a copied target table.

### Read-only-data relocations

`.rodata` has ten relocations at offsets `0x18`, `0x1C`, `0x20`, `0x48`,
`0x4C`, `0x50`, `0x54`, `0x58`, `0x5C`, and `0x60`:

- two target undefined imports (`0x18`, `0x20`);
- two internal `.rodata` references (`0x1C`, `0x48`);
- six internal `.text` references (`0x4C..0x60`).

This schedule accounts for 40 pointer-bearing bytes and 60 non-relocated bytes
in `.rodata`. The implementation may use independently named neutral descriptor
objects; exact section layout and addends remain validator responsibilities.

## Complete-unit acceptance conditions

`metadata.complete` may become true only when a fail-closed unit validator and
the repository complete-unit gate prove all of the following:

1. All eleven semantic functions and all 43 import veneers are byte-identical;
   fragmented switch functions are compared with their intervening pools fully
   accounted.
2. `.text` is exactly 2,580 bytes: 2,248 code, 332 pools/tables, no padding,
   and no unknown residue.
3. `.rodata` (100 bytes), `.data` (8 bytes), and `.bss` (56 bytes) are fully
   owned and matched; no automatic empty-base BSS credit is accepted.
4. Exactly 81 relocations are present with the segment schedule above, correct
   internal addends, and the correct 47 distinct undefined-import identities
   (43 veneer targets, two imports reused by both wrapper pools, and two
   distinct read-only-data imports).
5. No extra allocated section, symbol, relocation, or unclassified residue is
   emitted.
6. The public partition, source manifest, object validator, isolated objdiff
   result, and complete-unit gate agree on all boundaries and sizes.

Until those conditions pass together, the unit remains partial even if all
currently inventoried functions report 100% code match.

The remaining analysis-side limitation is the 60 non-relocated bytes in
`.rodata` and the non-relocated loader descriptor words in the final text pool.
Their structural roles and relocation-bearing fields are known, but this
specification deliberately does not transcribe opaque target payload. A
clean-room implementation must reconstruct those records from the loader ABI,
compiler-emitted descriptor forms, and the behavioral ownership above. If that
independent derivation cannot identify every raw field, the complete-unit gate
must remain false and report those exact data bytes as the blocker.
