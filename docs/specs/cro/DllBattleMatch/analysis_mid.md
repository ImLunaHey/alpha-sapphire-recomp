# DllBattleMatch mid-range analysis draft

Status: neutral clean-room analysis draft; not an implementation and not a
completion claim.

## Provenance and scope

- Target: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Observation date: 2026-10-17.
- Public boundary sources: `symbols/cro/DllBattleMatch.csv` and
  `symbols/cro-partitions/DllBattleMatch.json` at main baseline
  `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Private observation source: the externally supplied, ignored
  `DllBattleMatch` CRO verification input located through the root checkout's
  ignored environment configuration. No target payload or private path is
  reproduced here.
- Tools: the repository's deterministic CRO-to-ELF converter and splitter;
  GNU Arm objdump 2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1; independent
  inspection of ELF symbols and relocations.
- Scope: the 25 accepted ARM functions from `0x0000BC88` through
  `0x0000FEF8`, inclusive, except the already-authored `func_0000BE2C`.
  These bodies total 10,100 bytes and 2,525 fixed-width ARM instructions.

The observations below are behavior and interface facts. They do not reproduce
the target instruction stream, strings, tables, or binary payload. All called
targets are intentionally identified only by module-relative address. An
implementation should keep those identities neutral until the repository has
independently established public symbol aliases.

## Common ABI and encoding requirements

All entries use AAPCS32 in ARM state, `.arch armv6k`, VFP enabled, and are
four-byte aligned. Arguments begin in `r0`-`r3`; additional arguments are on
the caller's stack. Return values use `r0`. Callee-saved registers and stack
alignment must follow the exact frame descriptions below. Every body has zero
ELF relocations. Direct calls are encoded as local ARM `BL` operations to the
listed module-relative identities. Indirect virtual/destructor calls use
`BLX` through a loaded function word.

GNU objdump renders several valid ARMv6K encodings misleadingly: paired
loads/stores appear as undefined instructions and register-indirect `BLX`
appears as an `MSR` instruction. Treat the described operations below as
authoritative: they are `LDRD`/`STRD` or `BLX reg`, not privileged state
changes.

The instruction count is an exact scheduling constraint. Conditional calls
must remain conditional instructions rather than branches around calls, and
the explicitly noted tail calls must be emitted after restoring the frame.

## Inventory and exact frame schedule

| Function | Bytes / instructions | Saved registers; local frame | ABI result / principal role |
| --- | ---: | --- | --- |
| `func_0000BC88` | 332 / 83 | `{r3-r7,lr}`; no locals | initialize a battle-match state object |
| `func_0000BEA8` | 232 / 58 | `{r4-r10,lr}`; no locals | consume a linked event list and update mappings |
| `func_0000BF90` | 412 / 103 | `{r4-r10,lr}`; no locals | rebuild participant and pending-ID tables |
| `func_0000C2E4` | 420 / 105 | `{r4-r8,lr}`; 32 bytes | validate one selected list record; set next state |
| `func_0000C488` | 276 / 69 | `{r4-r10,lr}`; 48 bytes | return a rounded one-byte elapsed-time value |
| `func_0000C5A8` | 452 / 113 | `{r4-r9,lr}`; 28 bytes | validate a selected record for state family A |
| `func_0000C7A8` | 624 / 156 | `{r4-r10,lr}`; 24 bytes | validate a selected record for state family B |
| `func_0000CA18` | 452 / 113 | `{r4-r9,lr}`; 28 bytes | validate a selected record for state family C |
| `func_0000CBDC` | 180 / 45 | `{r4,lr}`; no locals | choose error/message state from mode and subtype |
| `func_0000CDE8` | 728 / 182 | `{r4-r10,lr}`, `d8`; 16 bytes | populate six slots and configure final flags |
| `func_0000D0D0` | 240 / 60 | `{r4-r8,lr}`; 552 bytes | format a bounded inclusive byte range and submit it |
| `func_0000D1D4` | 304 / 76 | `{r4-r7,lr}`; 12 bytes | lower-bound/search a signed-byte red-black tree |
| `func_0000D304` | 1,900 / 475 | `{r4-r10,lr}`; no locals | erase an iterator range from a red-black tree |
| `func_0000DA70` | 1,352 / 338 | `{r0,r1,r4-r11,lr}`; 108 bytes | rebuild a vector of 40-byte records from a tree |
| `func_0000DFCC` | 156 / 39 | `{r3-r7,lr}`; no locals | construct arena/container state; return `this` |
| `func_0000E068` | 504 / 126 | `{r4-r10,lr}`; no locals | assign/copy a range of 8-byte polymorphic values |
| `func_0000E260` | 324 / 81 | `{r4-r8,lr}`; no locals | construct a byte-tagged vector from a word range |
| `func_0000E3A8` | 412 / 103 | `{r4-r10,lr}`; no locals | append one 8-byte polymorphic value to a vector |
| `func_0000E710` | 132 / 33 | `{r4-r6,lr}`; no locals | complete state object at `this+0x98`; return bool |
| `func_0000E970` | 120 / 30 | `{r4-r7,lr}`; 12 bytes | periodic elapsed-time threshold test; return bool |
| `func_0000EAFC` | 132 / 33 | `{r4-r6,lr}`; no locals | complete state object at `this+0xAC`; return bool |
| `func_0000EED4` | 72 / 18 | `{r4,lr}`; no locals | conditionally destroy owned object at `this+0x84` |
| `func_0000F178` | 68 / 17 | `{r4,lr}`; no locals | initialize a state object and embedded member |
| `func_0000F21C` | 96 / 24 | `{r3-r5,lr}`; no locals | set mode, issue two commands, optional transition |
| `func_0000FEF8` | 180 / 45 | `{r4-r6,lr}`; no locals | complete destructor chain; return adjusted `this` |

Counts above include every instruction in the accepted body and no adjacent
pool or gap. The four functions containing paired-operation or indirect-call
encodings have semantic counts two greater than a naive objdump text parser
only where a paired load/store was printed as one unknown word; the byte and
fixed ARM word counts remain authoritative (`bytes / 4`).

## Battle-state and list handlers

### `func_0000BC88`

Input is a context in `r0`; return value is unspecified. Preserve the context
in `r4`. Call sequence, in order, is:

`0x0000CD38`, `0x000000BC`, `0x00000194`, `0x000000BC`,
`0x00000194`, `0x0000B8F0`, `0x0000B770`, twice `0x0000027C`,
`0x000005EC`, conditionally `0x000008FC` and `0x00000904`,
`0x0000CC90`, `0x0000F21C`, `0x0000052C`, `0x00000534`,
`0x0000019C`, and `0x000001A4`.

Operational schedule:

1. Pass `[ctx+0x58]` to `0xCD38`. With owner `[ctx+0x5C]`, perform two
   zero-fill/setup pairs. The first size comes from one post-body literal; the
   second is `0x1CC`.
2. Invoke context helpers `0xB8F0` and `0xB770`. On `[ctx+0x58]`, issue two
   `(1, id, value)` operations: `(1,0xF5,0x65)` and `(1,0xFB,0x64)`.
3. Resolve `[[[ctx+4]+0x1C]+0] + 0x171BC` with selector zero. If non-null,
   derive two handles using `[ctx+0x0C]`, store them at `+0x64/+0x68`, then
   pass owner `[ctx+0x5C]` and those handles to `0xCC90`.
4. Select command `0x12` when byte `[ctx+0x49] == 0x14`, otherwise `0x10`,
   and send it using `[ctx+0x58]`. Follow with the two-call `(0, then 1)`
   sequence at `0x52C/0x534`.
5. Let `p=[ctx+0x5C]`; clear `[p+0x7C]`; call `0x19C([p+0x5C],0,0,0)`;
   then call `0x1A4([p+0x5C],0,0,1, stack_arg=1)`.

The post-body literal consumed at body `+0x20` belongs to adjacent pool
coverage and is not owned by this function.

### `func_0000BEA8` and `func_0000BF90`

Both take `(ctx, list)` in `(r0,r1)`. A valid non-empty list has a sentinel at
`[list+0x10]`, a presence/count word at `+0x14`, and nodes linked through word
zero. Node payload identity is obtained by `0x4E4(node+8,0)` and the payload
word used for notifications is `[node+0x0C]`.

`BEA8` walks all nodes and searches `ctx`'s `0x130`-element-count array at
`ctx+0xDC` for each identity. On a match it copies the node payload to the
parallel array at `ctx+0xC8`. It then searches five identities at `ctx+0x74`;
when found, it calls `0x90C([ctx+0x18], index&0xff, payload)`. It counts matched
outer entries. Empty/invalid input writes state 8 at `ctx+0x38`; a completed
scan with no match writes state 4. The exact loop nesting is outer existing
array, inner five-entry mapping, then advance the linked list.

`BF90` first zeros `[ctx+0x134]`. It consumes at most 16 list nodes, storing
each identity at `ctx+0x88+4*i`; overflow sets state 8 and exits. A match in
the five-entry table triggers `0x90C` and marks the node handled. The special
identity resolved from `[[[ctx+4]+0x1C]+0]+0x171BC` is ignored. Every remaining
unhandled payload is appended, up to 16 entries, at `ctx+0xF0` and increments
`[ctx+0x134]`. Finally, each nonzero five-entry identity absent from the
16-entry rebuilt table is appended to `ctx+0xDC`, incrementing `[ctx+0x130]`.
Final state is 2 when pending count is nonzero, else 7 when existing count is
zero, else 3. Calls are `0x4E4`, conditional `0x90C`, and `0x53C` for the
special identity.

### `func_0000C2E4`, `func_0000C5A8`, `func_0000C7A8`, `func_0000CA18`

These are related selection/validation state transitions. Their second input
is the same sentinel list shape. Temporary descriptors are 8-byte values.
Copies use helpers `0x92C`; emptiness checks use `0x934`; comparison helpers
are `0x93C`, `0x944`, and `0x954`. All explicit no-op flag-preserving words
between calls are scheduling constraints and must not be optimized away in an
assembly implementation.

- `C2E4(ctx,list)`: create a 32-byte local workspace. Obtain a selector from
  `0x544(ctx)`, initialize at `sp+8` via `0x91C`, transform selector with
  `0x554`, and validate it with `0x924`. Default error state is 11. Search for
  the node whose `0x4E4(node+8,0)` equals `[ctx+0x64]`; copy its payload to
  `[ctx+0x78]` and its descriptors at node `+0x58/+0x60` to locals `sp+0x10`
  and `sp+0x18`. If both are nonempty, combine/compare them and the selector.
  Success sends `(0x76,1)` through owner `[ctx+0x5C]`, clears byte
  `[[ctx+0x14]+0xD0]`, calls `0x44C` on `[[ctx+0x14]+0xCC]`, and writes state
  12. Other comparison outcomes write state 3 or 9; setup failure writes 11.
  Calls in exact order are `0x544,0x91C,0x554,0x924`, loop `0x4E4`, twice
  `0x92C`, twice `0x934`, `0x93C`, `0x93C`, `0x944`, optional `0xEBD8`,
  `0x44C`, `0x25C`, `0x94C`, `0x954`.
- `C5A8(ctx,list)`: 28-byte frame; resolve the special identity at
  `+0x171BC`, build/validate a selector at `sp`, map the identity with
  `0x42C(id,25)`, then find the matching node. Save payload to `[ctx+0x6C]`
  and node descriptors to `sp+8/sp+0x10`. Success performs the same `0x76`
  notification/clear sequence and sets state 8. Invalid setup sets 7;
  comparison alternatives set 1 or 3.
- `C7A8(ctx,list)`: same main pipeline as `C5A8`, with a 24-byte frame and
  success state 10. Invalid setup uses state 9. One comparison outcome sets
  state 2. Otherwise query `[[[ctx+4]+0x1C]+0]+0x3994` with selector one.
  Depending on `[ctx+0x1C]+0x0C`, set message byte `[ctx+0x48]` to `0x25`
  (subtype 3), `0x13` (subtype 4), or `0x26` (query false), set flag byte
  `[ctx+0x3C]=1`, and use state 11 for the query-false case. Unknown subtype
  calls `0x3C(0,0,0)` and uses state 9.
- `CA18(ctx,list)`: same 28-byte setup and identity mapping as `C5A8`, but the
  list search is delayed until setup succeeds. Success writes state 10;
  invalid setup state 9; comparison alternatives state 5 or 3.

### `func_0000C488`

Input is `ctx`; return is an unsigned byte. Build and validate an 8-byte time
descriptor at `sp+0x28` using calls `0x544,0x91C,0x554,0x924`; failure invokes
`0x25C` then `0x94C`, tears down the 48-byte frame, and returns zero. On
success, convert the descriptor at `sp` using `0x93C`, subtract the 64-bit
timestamp at `[ctx+0x1C]+0x18`, and execute the fixed multiword multiply/high
word scaling schedule using three adjacent post-body scalar literals. Perform
the final signed correction, arithmetic shift by 13, add one, and mask to
eight bits. The three literals are part of the adjacent pool, not the body;
they have no relocation.

### `func_0000CBDC`

Input is `ctx`. Query `[[[ctx+4]+0x1C]+0]+0x3994` with selector one. If false,
set message byte `ctx+0x48` to `0x26` only when currently zero, set flag
`ctx+0x3C` to one, and state `ctx+0x38` to 11. If true, subtype byte
`[ctx+0x1C]+0x0C` selects message `0x25` for subtype 3 or `0x13` for subtype
4 (only when the message byte is zero), then sets the flag. Any other subtype
calls `0x3C(0,0,0)` and sets state 9.

### `func_0000CDE8`

Inputs are `(ctx, source, boolean)` in `(r0,r1,r2)`. Preserve `d8`; there is a
16-byte local. Query a count with `0x284(source,[ctx+0x74]+4)`. For every
available entry (bounded by six), obtain an object through `0x28C`, allocate or
resolve a 16-byte companion via `0x294/0x29C`, pass `(ctx,index,index,obj)` to
`0x3D28`, and invoke virtual slot `+8` on both temporary objects when non-null.
For missing slots through index five, issue five commands drawn from a
five-word row in an adjacent read-only table, using repeated owner acquisition
`0xBC` and command call `0x194`.

Final configuration splits on the boolean. True emits command IDs `0xB2`, a
read-only identity, and `(0xB4,0x7F)`, constructs a 16-byte local descriptor
using `0x95C`, writes a single-precision literal, then issues command `0x104`
with the local descriptor and tail-emits the same command with value one.
False emits `0xB2=0`, the same identity, `0xAE=0`, constructs the descriptor
with a second read-only identity, and converges on the tail. Adjacent pools at
`0x0000D0C0` and following hold the read-only identities and float; the first
slot has an `R_ARM_ABS32` relocation to `.rodata`. They are not owned here.

## Standard-library/container routines

### `func_0000D0D0`

Inputs are `r1=destination`, `r2={begin,end}` byte range, `r3=format/control`;
the two caller-stack words are an inclusive start and end byte index. The
incoming `r0` is not semantically consumed. Construct a formatting object at
`sp+4` using `0x964`, apply control via `0x96C`, and iterate the inclusive
8-bit index range. When an index is within the source size, format the selected
byte through a 3-byte local at `sp+0x220` (`0x7CC`) and append via `0x96C`.
Out-of-range cases call diagnostic identity `0x974` with the requested index,
range bound, and fixed PC-relative descriptors. Finally obtain a view at
`sp+0x218` (`0x87C`), submit it with `0xE3A8(destination,view)`, destroy the
view via `0x88C`, destroy the formatter via `0x97C`, and return void. The loop
index wraps/masks to eight bits after every increment.

### `func_0000D1D4`

Inputs are `r0=out_iterator`, `r1=tree`, `r2=pointer to signed-byte key`.
The tree header is `[tree+0x10]`; node layout is color byte `+0`, parent `+4`,
left `+8`, right `+0x0C`, signed key `+0x10`; `[tree+0x18]` is an alternate
search mode. First descend from header root `+4`, choosing left when
`key < node.key`, else right, retaining the candidate and direction. If the
alternate flag is set, delegate to `0x1BDFC` with an out temporary and return
that iterator with success byte one. Otherwise perform standard successor /
ancestor normalization, compare candidate key to requested key, and return
`{node, found}` at output offsets `+0/+4`. The only direct call is `0x1BDFC`.

### `func_0000D304`

Inputs are `(out_iterator, tree, first_iterator_pointer, last_iterator_pointer)`.
The same 20-byte red-black node/header layout as `D1D4` is used; tree header is
`[tree+0x10]`, detached-node list head is `[tree+4]`, and count is `[tree+0x14]`.
Return the resulting iterator through `*out_iterator`.

If erasing the complete range (`first == header.root` and `last == header`),
walk the detached-node chain and insert it into the tree's free-list using the
already-authored recursive transfer `func_0000BE2C`; reset header root/min/max
and count. Otherwise, for every iterator until `last`:

1. Compute the in-order successor before mutation.
2. Perform the standard red-black-tree erase transplant, including the
   successor substitution when both children exist and updates to header
   root/min/max.
3. Execute the complete symmetric red-black deletion fixup: red sibling
   rotation, black-nephew recoloring, near-nephew rotation, and final
   far-nephew rotation for both left and right cases. Color is byte zero;
   black is zero and red is one.
4. Mark the removed node color one, prepend it to the tree free-list through
   node `+0x0C`, decrement `[tree+0x14]`, publish the precomputed successor,
   and repeat.

The body has exactly one call, `func_0000BE2C` at body `+0x54`, and otherwise
contains only integer loads/stores/branches. Exact code generation will likely
require an authored ARM body because compiler red-black-tree inlining and
branch layout are highly version-sensitive.

### `func_0000DA70`

Inputs are `(destination, tree)`. Destination owns a vector triple at
`+0x74/+0x78/+0x7C`; source tree header is `[tree+0x10]`. Elements are 40 bytes.
The function first invokes each existing element's virtual destructor slot
zero, then rewinds vector end by the destroyed element count. It iterates the
tree in order from header minimum (`header+8`) to the header sentinel.

For every node, construct a temporary 40-byte record from node key byte `+0x10`
and payload `+0x18` using `0x984`. Append in place when capacity remains,
copying the complete field layout: vtable `+0`, tag `+4`, nested vtable `+8`,
bytes `+0x0C..0x0E`, words/floats `+0x10..0x1C`, byte `+0x20`, halfword
`+0x22`. When full, grow capacity to
`max(size, old_capacity + old_capacity/2 + old_capacity/8, old_capacity+32)`,
allocate `40*capacity` through `0x994`, copy-construct old records with `0x98C`,
append the temporary, destroy old records by virtual slot zero, free old storage
with `0x0C`, and publish the new vector triple. The in-order successor walk is
the same parent/left/right algorithm described for `D1D4`.

Frame scheduling is strict: the unusual entry push includes `r0,r1`; the
108-byte local allocation makes the saved original arguments available at
`sp+0x6C` and `sp+0x70`. Four vtable/read-only identities are loaded from
post-body slots at `0x0000DFBC..0x0000DFC8`, each with `R_ARM_ABS32 .rodata`;
the preceding scalar literal at `0x0000DFB8` is the signed reciprocal used to
divide byte distances by 40 and has no relocation.

### `func_0000DFCC`

Input/output is `this` in `r0`. Zero words `+0,+4,+8,+0x0C,+0x10,+0x14`, byte
`+0x18`, and store the low byte of `this` at `+0x19`. Allocate a 12-byte arena
descriptor and a `0x700`-byte block via two calls to `0x994`. Descriptor fields
are `{old_head,0x20,block}` and it becomes the head at `this+0`. Publish block
range `{block,block+0x700}` at `this+8/+0x0C`, then reserve the first `0x38`
bytes and initialize an embedded sentinel at the old block start: color zero,
parent zero, left/right self. Store that sentinel at `this+0x10`. Return `this`.

### `func_0000E068`

Inputs are `(owner, source_range)`; destination vector triple is at
`owner+0x68`, source is `{begin,end}`. Elements are 8 bytes and have a virtual
destructor at vtable slot zero. Assign the source range:

- If source size exceeds destination capacity, allocate capacity
  `max(source_size, old_capacity + old_capacity/2 + old_capacity/8,
  old_capacity+32)` through `0x994`, copy-construct each element via conditional
  `0x99C`, destroy all old elements, free old storage via `0x0C`, then publish.
- If capacity suffices and existing size is at least source size, assign the
  overlapping prefix via `0x884`, destroy the destination suffix, and set both
  end and constructed-end to the new end.
- Otherwise assign the existing prefix via `0x884`, then copy-construct the
  remaining suffix via conditional `0x99C` and advance end.

Calls in schedule are `0x994`, conditional `0x99C`, `0x0C`, repeated `0x884`,
and final conditional `0x99C`. Return value is unspecified.

### `func_0000E260`

Inputs are `(this, tag_byte, source_word_range)`. Initialize vector triple
`this+8` to null, load the vtable identity from the adjacent relocated slot
`0x0000E3A4`, and store tag at `this+4`. Source is `{begin,end}` of 4-byte
words. If nonempty, either allocate capacity using the same 1.625x/+32 rule
through `0x994`, copy raw words, free old storage via `0x0C`, and publish, or
copy into existing storage and update end/constructed-end. Return `this`.
Preserve the target's unrolled two-word copy tail/loop schedule in the reuse
case. The post-body vtable slot has `R_ARM_ABS32 .rodata`.

### `func_0000E3A8`

Inputs are `(vector_triple, pointer_to_8_byte_element)`. Append one element.
When capacity remains, advance end by eight, move existing elements backward
with `0x884` if needed, and copy the new element with a tail call to `0x884`.
When full, grow by `max(old_size + old_size/2 + old_size/8, old_size+32)`,
allocate with `0x994`, copy-construct prefix/new-element/suffix using conditional
`0x99C`, destroy the old range through virtual slot zero, free via `0x0C`, and
publish the new triple. The non-growing early path at body `+0x28` restores all
saved registers then tail-branches to `0x99C`; the insertion path at `+0x9C`
likewise restores then tail-branches to `0x884`.

## Small lifecycle and timing helpers

### `func_0000E710` and `func_0000EAFC`

These 33-instruction functions are structurally identical except the owned
pointer offset: `E710` uses `this+0x98`, `EAFC` uses `this+0xAC`. Let `p` be
that pointer. Require both `0x1DC([p+0x5C],0,[p+0x7C])` and
`0x1DC([p+0x5C],1,[p+0x80])` to succeed; otherwise return zero. On success,
clear `[p+0x88]`. If byte `[this+0xC4] != 1`, call `0x3C(0,0,0)`. Clear that
byte, call `0x1AC(p)`, and return one.

### `func_0000E970`

Inputs are `(state, threshold)`. Increment word `[state+0x4C]`; until it reaches
10, store it and return zero. At ten, create a 12-byte timer temporary using
`0x764`, start/sample through `0x65C`, read it through `0x76C`, compare that
sample against another `0x76C(state+0x40)`, and return whether the unsigned
difference is at least `threshold`. Reset `[state+0x4C]` to zero and destroy
the temporary through `0x48C` before returning.

### `func_0000EED4`

Input is `this`. If `[this+0x84]` is null, return one. Otherwise call
`0x354(pointer)`; if it returns zero, return zero without mutation. On success,
invoke virtual slot `+4` on the owned pointer, clear `[this+0x84]`, and return
one. The virtual invocation is `BLX`, not a privileged instruction.

### `func_0000F178`

Input/output is `this`. Load the adjacent relocated vtable identity from
`0x0000F1BC`; store it at `+0`, clear `+4,+0x14,+0x18,+0x38`, and byte
`+0x3C`. Construct embedded member `this+0x40` through `0x764`, then clear
bytes `+0x48,+0x49,+0x4A,+0x4B,+0x50`. Return the value naturally left by the
embedded constructor. The vtable slot has `R_ARM_ABS32 .rodata`.

### `func_0000F21C`

Inputs are `(state, mode)`. Store mode at `[state+0x80]`. Call
`0x19C([state+0x5C],1,mode,0)`, then `0x1A4([state+0x5C],1,mode,1,
stack_arg=1)`. When mode is `0x15`, call `0x52C(state)`, restore the frame, and
tail-branch to `0x534` with `r1=1`; otherwise return directly.

### `func_0000FEF8`

Input is `this`. Load a vtable identity from post-body slot `0x0000FFAC`, store
it at `this+0`, and work from `this+0x74`. Destroy the `[begin,end)` range of
40-byte objects through virtual slot zero, then free its begin pointer via
`0x0C`. Move back 12 bytes and repeat for an 8-byte polymorphic range. Move
back another 32 bytes, store the second vtable identity from `0x0000FFB0`, free
the pointer at local `+8`; move back 72 more bytes, store the same identity at
local `+0x34`, and free local `+0x3C`. Call `0x9EC(local+0x14)`, subtract 12,
call `0x88C`, subtract 8, and return that adjusted pointer. Both adjacent
vtable slots have `R_ARM_ABS32 .rodata`.

## Relocation, literal, and ownership summary

No accepted body in this draft contains a relocation or allocated data. The
following adjacent literals are consumed by these bodies and therefore must be
accounted for separately before the unit can be complete:

- `BC88`: one scalar/read-only slot immediately after the body.
- `C488`: three scalar multiplier slots immediately after the body.
- `CDE8`: a command-table identity, a read-only identity, a float scalar, and
  a second read-only identity after the body; at least the slot at `0xD0C0`
  is an `R_ARM_ABS32 .rodata` relocation.
- `DA70`: one scalar reciprocal and four `R_ARM_ABS32 .rodata` identities at
  `0xDFB8..0xDFC8`.
- `E260`: one `R_ARM_ABS32 .rodata` identity at `0xE3A4`.
- `F178`: one `R_ARM_ABS32 .rodata` identity at `0xF1BC`.
- `FEF8`: two `R_ARM_ABS32 .rodata` identities at `0xFFAC` and `0xFFB0`.

The large relocated jump tables between `F21C` and `FEF8` are outside every
accepted body in this draft. They must not be folded into either function.
They remain separate pool/gap ownership and are a concrete remaining data
accounting task.

## Implementation cautions and blocker status

- `D304` and `DA70` are genuine large inlined standard-library routines. Their
  exact branch/register schedules are compiler-sensitive; a semantic C/C++
  rewrite is unlikely to byte-match without the original compiler and library
  configuration. The neutral algorithms and layouts are fully identified, but
  exact implementation will probably need original authored ARM assembly.
- Several calls target functions not in the accepted public inventory. Use
  neutral module-relative identities or local veneers; do not invent public
  semantics from their addresses.
- This analysis found no evidentiary blocker to implementing the 25 bodies.
  It does identify a completion blocker outside this draft's code scope: their
  adjacent literal pools, plus other module gaps/data/relocations, remain
  separately unowned. Consequently `metadata.complete` must remain false until
  the complete-unit gate accounts for all of them.

