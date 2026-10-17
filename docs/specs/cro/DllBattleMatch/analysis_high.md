# DllBattleMatch high-range analysis draft

## Scope and provenance

This is a neutral analysis draft for the six accepted `cro/DllBattleMatch`
functions from `0x00011EA8` through `0x0001BDFC`. It describes interfaces,
observable memory operations, control flow, constants, and code-generation
constraints. It contains no target byte dump, instruction listing, extracted
asset, or copied source.

- Target: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Public target identity: the `cro/DllBattleMatch` record in
  `progress/units/AS_EUR_REV2.cro.json` (size 172032, SHA-256
  `871aa504f633e9e5161259e7ce24c6a7387d471e36acfebadc5d794a289c562f`).
- Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Observation date: 2026-10-17.
- Evidence: the ignored private CRO named by the root checkout's ignored
  `.env.local`, converted with this repository's deterministic
  `scripts/generate-cro-target-object.mjs`, then inspected as an ELF32 ARM
  relocatable object.
- Tools: repository converter at the baseline above; GNU `objdump`/`readelf`
  2.44; LLVM `llvm-objdump` 21.1.8 for independent decoding of the doubleword
  load in `func_0001BDFC`.

All six bodies are ARM-state, four-byte-aligned code. The public inventory
boundaries and instruction counts are:

| Function | Address | Size | Instructions |
| --- | ---: | ---: | ---: |
| `func_00011EA8` | `0x00011EA8` | 332 | 83 |
| `func_00013EB8` | `0x00013EB8` | 376 | 94 |
| `func_000161C4` | `0x000161C4` | 348 | 87 |
| `func_000165E8` | `0x000165E8` | 488 | 122 |
| `func_000181B4` | `0x000181B4` | 272 | 68 |
| `func_0001BDFC` | `0x0001BDFC` | 972 | 243 |

The bodies contain no ELF relocations. Five depend on adjacent literal words
just beyond their accepted function boundary; those dependencies are called
out below and must be represented without incorrectly claiming the literal as
part of the accepted function body.

## Shared neutral call identities

Addresses below are module-relative identities, not inferred source names.
Direct calls use ordinary ARM `BL`; virtual calls use `BLX` through the stated
vtable slot.

- `0x0000001C`: release/free-like helper, invoked with the result left in `r0`.
- `0x0000003C`: three-argument diagnostic/failure helper.
- `0x000001AC`: one-argument resource/state finalizer.
- `0x000001DC`: three-argument predicate.
- `0x0000026C`: one-argument unsigned count getter.
- `0x00000294`: allocation/factory helper `(size, context, 1)`.
- `0x0000035C`: two-argument 160-byte-object initializer.
- `0x000003FC`: one-argument cleanup stage.
- `0x0000043C`: two-argument resource factory.
- `0x00000544`, `0x0000057C`, `0x000005EC`: one-argument helpers.
- `0x00000994`: allocation helper taking a byte count.
- `0x00000A5C` through `0x00000A6C`: temporary-object construction,
  configuration, and operation helpers.
- `0x00000A8C`: one-argument collection getter.
- `0x00000B4C` through `0x00000B8C`: large-work-object construction,
  configuration, item transfer, and finalization helpers.
- `0x0000E710`: one-argument tail-called handler.
- `0x0000EBD8`: `(destination, message_id, 1)` notification helper.
- `0x0000F178`: base constructor/initializer.

## `func_00011EA8`

### ABI and frame

- Input: `r0 = self`.
- Output: normally a scalar in `r0`; one branch tail-calls `0x0000E710` and
  propagates that helper's result.
- Saves `r4-r6, lr` (16 bytes), with no local stack allocation.
- `r6` is a long-lived zero. `r4` holds `self[0x14]`; `r5` holds one of that
  object's subobject pointers.

### Behavior

The function checks three mutually exclusive state fields in order:
`self[0x58]`, `self[0x5C]`, then `self[0x60]`.

1. If `self[0x58] != 0`, load `owner = self[0x14]` and
   `resource = owner[0x94]`. Call predicate `0x000001DC` twice:
   `(resource[0x5C], 0, resource[0x7C])`, then
   `(resource[0x5C], 1, resource[0x80])`. Return zero immediately if either
   predicate returns zero. Otherwise set `resource[0x88] = 0`. If
   `owner.byte[0xC4] != 1`, call `0x0000003C(0, 0, 0)`. Set
   `owner.byte[0xC4] = 0`, call `0x000001AC(resource)`, and return one.
2. Otherwise, if `self[0x5C] != 0`, restore the saved registers and tail-branch
   to `0x0000E710(self[0x14])`.
3. Otherwise, if `self[0x60] != 0`, perform the same two predicates and state
   reset as case 1, but use `resource = self[0x14][0x9C]`. Return zero if a
   predicate fails; otherwise return one after finalization.
4. If all three fields are zero, call `0x0000003C(0, 0, 0)` and return one.

### Exact-code constraints

- The first predicate uses the unmodified resource pointer. The second uses a
  writeback load that advances the saved pointer by `0x5C`, so its third
  argument is loaded at `advanced + 0x24`.
- The `0x58` path contains no padding operations. The `0x60` path has one
  architecturally neutral operation after each predicate comparison and two
  consecutive neutral operations after the finalizer call.
- The three zero arguments to `0x0000003C` are formed from one immediate zero
  and two register moves.
- There are no literals or relocations in or immediately required by this
  body.

## `func_00013EB8`

### ABI and frame

- Input: `r0 = self`.
- Output: one only when the operation flags are zero; otherwise zero after an
  optional notification.
- Saves `r4-r6, lr` (16 bytes), with no local stack allocation.

### Behavior

1. Call `0x00000294(160, self[0x0C], 1)`. If it returns nonzero, call
   `0x00000A5C(allocation, self[0x0C])` and retain that result as `temp`;
   otherwise use `temp = 0`.
2. Call `0x00000A64(temp, self[0x24])` and ignore its result.
3. Call `flags = 0x00000A6C(temp, self[0x20], 0, 0)`.
4. If `temp != 0`, invoke its virtual function at vtable byte offset `+4`,
   passing `temp` as `r0`.
5. If `flags == 0`, return one. Otherwise test the following masks in strict
   priority order. On the first match, call
   `0x0000EBD8(self[0x54], message_id, 1)`. Return zero whether or not any mask
   matched.

| Priority | Flag mask | Message ID |
| ---: | ---: | ---: |
| 1 | `0x00000200` | 63 |
| 2 | `0x00001818` | 64 |
| 3 | `0x00000100` | 65 |
| 4 | `0x00000080` | 66 |
| 5 | `0x00000001` | 67 |
| 6 | `0x00000002` | 68 |
| 7 | `0x00000020` | 69 |
| 8 | `0x00000040` | 70 |
| 9 | `0x00000400` | 71 |
| 10 | `0x00000004` | 72 |

### Exact-code and literal constraints

- The virtual call sequence explicitly loads the vtable then slot `+4` and
  uses `BLX`.
- All notification cases share one call site. Cases after the combined mask
  branch backward to that site; the first two reach it forward/fall through.
- The combined mask `0x1818` is loaded PC-relatively from the word at
  `0x00014030`, exactly the first word after the accepted body. It is a plain
  constant and has no relocation.

## `func_000161C4`

### ABI and frame

- Input: `r0 = self`.
- Output: zero on setup failure, otherwise the value returned by
  `0x00000B84`.
- Saves `r4-r8, lr` and allocates `0x188` bytes. The frame comprises a
  232-byte area at `sp+0x000` and a 160-byte area at `sp+0x0E8`.

### Behavior

1. Call `state = 0x00000544(self)`.
2. Call `0x00000294(0x2AB8, self[0x0C], 1)`. If allocation succeeds, pass it
   to `0x00000B4C` and retain the result as `work`; otherwise use `work = 0`.
3. Call `derived = 0x0000057C(state)`. Then call
   `0x00000B54(work, self[0x0C], self[0x10], derived, 0x900)`, passing the
   fifth argument at `[sp]`.
4. If that setup call returns zero, call `0x0000003C(0, 0, 0)`, release the
   frame, and return zero. This path does not perform the later work-object
   finalization or virtual destruction.
5. Obtain `collection = 0x00000A8C(self[0x18])`. Initialize a full-width item
   index to zero and an independent byte-wrapping transferred count to zero.
   While `index < 0x0000026C(collection)` using an unsigned comparison:
   - obtain `item = 0x00000B5C(collection, index)`;
   - call `0x00000B64(item, sp)` to populate/use the 232-byte frame area;
   - call `0x0000035C(sp + 0xE8, 160)`;
   - call `0x00000B6C(work, index, sp + 0xE8, sp)`;
   - increment the transferred count modulo 256 and increment the full-width
     index.
6. Call `tail_a = 0x00000B74(self[0x18])`, then
   `tail_b = 0x00000B7C(self[0x18])`. Call
   `result = 0x00000B84(work, transferred_count, tail_b, tail_a)`.
7. Call `0x00000B8C(work)`. If `work != 0`, invoke its virtual function at
   vtable byte offset `+0x10`. Return `result`.

### Exact-code and literal constraints

- The first loop count call relies on `r0` still containing `collection`; later
  count calls explicitly reload it. The count is re-read at the bottom of
  every iteration.
- Neutral scheduling operations appear after the setup-result comparison,
  first count comparison, item conversion call, loop-bottom comparison, and
  pre-destruction null comparison.
- The size `0x2AB8` is loaded PC-relatively from `0x00016320`, the first word
  after the accepted body. It is a plain constant with no relocation.

## `func_000165E8`

### ABI and frame

- Input: `r0 = self`.
- Output: one only when the operation flags are zero; otherwise zero.
- Saves `r4-r8, lr` (24 bytes), despite `r8` not carrying semantic state. No
  local stack space is allocated.

### Behavior

1. Resolve `holder = self[4][0x1C]`, then form
   `address = holder[0] + 0x171BC`. Call
   `resource = 0x000005EC(address, 0)`.
2. If `resource == 0`, call `0x0000EBD8(self[0x58], 29, 1)` and return zero.
3. Allocate/construct `temp` exactly as in `func_00013EB8`:
   `0x00000294(160, self[0x0C], 1)`, followed on success by
   `0x00000A5C(allocation, self[0x0C])`.
4. Call `0x00000A64(temp, resource)`.
5. Form `holder[0] + 0x3994` and call
   `secondary = 0x0000043C(that_address, self[0x0C])`.
6. Call `flags = 0x00000A6C(temp, secondary, 0, 0)`.
7. If `secondary != 0`, call `0x000003FC(secondary)`, preserve its returned
   `r0` across two neutral scheduling operations, then call `0x0000001C`.
8. If `temp != 0`, invoke its virtual function at vtable byte offset `+4`.
9. If `flags == 0`, return one. Otherwise use the same prioritized flag-mask
   to message-ID mapping as `func_00013EB8`, with destination `self[0x58]`,
   and return zero.

### Exact-code and literal constraints

- The two large address additions are each synthesized as two immediate adds:
  `0x17000 + 0x1BC` and `0x3800 + 0x194`.
- The two neutral operations on the secondary cleanup path are consecutive and
  occur between calls `0x000003FC` and `0x0000001C`.
- All mapped notification cases share one call site, as in
  `func_00013EB8`; the resource-null message has its own earlier call site.
- The combined mask `0x1818` is loaded from the unrelocated adjacent word at
  `0x000167D0`, immediately after the accepted body.

## `func_000181B4`

### ABI and frame

- Input: `r0` is forwarded to `0x0000F178`.
- Output: the object pointer returned by `0x0000F178`.
- Saves `r4, lr` (8 bytes), with no local stack allocation.

### Behavior and layout

Call `object = 0x0000F178(input)`. Let `V` be the relocated pointer loaded from
the adjacent literal described below. Perform these writes in the observed
order:

1. Zero `object[0x60]`.
2. Set `object[0x00] = V` and `object[0x54] = V + 0x58`.
3. Zero `object[0x64]`, `object[0x68]`, and `object[0x6C]`.
4. Store two consecutive words at `object+0x58`:
   `V + 0x70`, then `V + 0x90`.
5. Zero byte `object[0x70]`.
6. Zero words `object[0x130]` and `object[0x134]`, then bytes
   `object[0x138]` and `object[0x139]`.
7. Zero every word from `object[0x74]` through `object[0x12C]`, inclusive, in
   ascending address order.

The routine returns without reloading `r0`; the base initializer's object
pointer remains live throughout.

### Relocation/literal constraint

The PC-relative load uses the adjacent word at `0x000182C4`, just beyond the
accepted body. That word has one `R_ARM_ABS32` relocation against `.rodata`
with addend `0x2EE8`. The implementation must preserve the distinct base and
three adjusted table pointers and the exact store schedule.

## `func_0001BDFC`

This is a pool-backed red-black-tree insertion with inlined balancing and a
40-byte value construction inside a 56-byte node.

### ABI and frame

- `r0 = out_node`, a writable pointer receiving the inserted node.
- `r1 = tree`.
- `r2 = force_left`, a nonzero insertion-side hint.
- `r3 = parent`, the insertion parent (possibly the header sentinel).
- Fifth argument at the caller's `[sp]`: `source`, a pointer to the value to
  copy-construct.
- Output: no specified scalar return; the observable result is
  `*out_node = inserted_node`.
- Saves `r4-r11, r12, lr` (40 bytes). Consequently it reads `source` from
  `[sp+40]` after the push. It has no other local stack allocation.

### Tree, pool, and node layouts

Tree fields used by this routine:

| Offset | Meaning |
| ---: | --- |
| `+0x00` | head of pool-block list, or null |
| `+0x04` | free-node list head, linked through node `+0x0C` |
| `+0x08` | next unused address in current pool block |
| `+0x0C` | end address of current pool block |
| `+0x10` | header/sentinel pointer |
| `+0x14` | element count |

Each pool-block header is 12 bytes: previous block at `+0`, capacity at `+4`,
and allocation base at `+8`. Each node is `0x38` bytes:

| Offset | Meaning |
| ---: | --- |
| `+0x00` | color byte (`0 = red`, `1 = black`) |
| `+0x04` | parent pointer |
| `+0x08` | left child |
| `+0x0C` | right child / free-list link |
| `+0x10` | 40-byte stored value |

For the header sentinel, `+0x04` is root, `+0x08` is leftmost, and `+0x0C` is
rightmost.

### Node acquisition

1. If `tree[4] != 0`, take that node and advance the free-list head to the
   node's `+0x0C` link.
2. Otherwise, if `tree[8] != tree[0x0C]`, take `tree[8]` and advance
   `tree[8]` by `0x38`.
3. Otherwise allocate a new pool block. Capacity is 32 when no prior block
   exists. With a prior capacity `old`, use
   `max(old + 32, old + old/2 + old/8)` using unsigned comparison.
   Allocate a 12-byte block header with `0x00000994`, then allocate
   `capacity * 56` bytes with a second call to `0x00000994`. Link the prior
   block at header `+0`, store capacity at `+4`, and allocation base at `+8`.
   Make this header `tree[0]`; set `tree[0x0C]` to the allocation end; return
   the first node and set `tree[8]` to allocation base plus `0x38`.

Allocation results are not checked for null before dereference.

### Node/value initialization

Zero the new node's parent, left, and right fields; set its color byte to red.
The value destination is `node + 0x10`. A wrapping-null check is performed on
that computed destination before the copy construction.

When non-null, copy these source fields, preserving the mixed widths and
ordering:

- byte `source[0x00]` to value `+0x00`;
- first table pointer to value `+0x08`;
- bytes `source[0x0C]`, `[0x0D]`, `[0x0E]` to the corresponding value bytes;
- words `source[0x10]` and `[0x14]` as one paired load/store;
- words `source[0x18]` and `[0x1C]` individually;
- byte `source[0x20]` and halfword `source[0x22]`;
- finally overwrite value `+0x08` with the second table pointer.

Value offsets `+0x01..+0x07`, `+0x0F`, `+0x21`, and any tail beyond `+0x23`
are not written by this routine.

The first table pointer comes from adjacent literal `0x0001C1C8`, relocated
`R_ARM_ABS32` to `.rodata + 0x1DB8`. The final table pointer comes from
adjacent literal `0x0001C1CC`, relocated `R_ARM_ABS32` to
`.rodata + 0x1D78`. Both literals lie outside the accepted function body.

### Link insertion

Load `tree[0x10]` and `tree[0x14]` together with one doubleword load, increment
the count, and store it back to `tree[0x14]`.

Insert on the left of `parent` when any of these is true:

- `parent` is the header sentinel;
- `force_left != 0`;
- otherwise, signed-byte `source[0]` is less than signed-byte
  `parent[0x10]`.

Otherwise insert on the right. Set the new node's parent in all cases.

- Left insertion writes `parent.left = node`. If `parent` is the header, set
  header root and rightmost to the node as well (leftmost was written by the
  common left store). Otherwise, if `parent` was header leftmost, update
  header leftmost.
- Right insertion writes `parent.right = node`; if `parent` was header
  rightmost, update header rightmost.

### Red-black balancing

Use the standard symmetric insertion-fixup with null children treated as
black, but preserve these concrete conventions:

- loop while the current node is not the root and its parent is red;
- select the left or right half by comparing the parent to its grandparent's
  left child;
- if the uncle exists and is red, color parent and uncle black, color the
  grandparent red, promote current to grandparent, and repeat;
- otherwise perform the inner rotation first when current is the inner child,
  then color the resulting parent black, color its parent red, and perform the
  outer rotation;
- rotations update child-parent links, header root when rotating at the root,
  and the appropriate grandparent child link. Left rotation uses right child
  as pivot; right rotation uses left child as pivot;
- after fixup, color `header.root` black.

The two mirrored halves are fully inlined; there are no rotation helper calls.
Finally store the originally acquired node to `*out_node`.

### Exact-code constraints

- The capacity multiplication is synthesized as `(capacity * 7) << 3`, not a
  multiply instruction.
- The element count/header load is one `LDRD` from `tree+0x10`.
- The source key and parent key comparisons are signed byte loads.
- The rebalancing keeps constant zero and one in long-lived registers and uses
  byte stores for every color change.
- Both allocator calls target `0x00000994`. There are no calls in balancing.
- The only relocations required by this routine are the two adjacent value
  table literals described above; neither relocation lies within the accepted
  972-byte body.

## Integration cautions

- These specifications cover exactly 2,788 accepted executable bytes and do
  not claim any adjacent literal-pool word, data, relocation, gap, or other
  residue as matched.
- Several functions deliberately preserve neutral scheduling operations,
  unusual saved-register sets, shared call sites, and post-body literal loads.
  Semantically equivalent restructuring will not be byte-identical.
- `func_00013EB8`, `func_000161C4`, and `func_000165E8` require unrelocated
  scalar literal words outside their public function ranges.
  `func_000181B4` and `func_0001BDFC` require adjacent relocated pointer
  literals outside their ranges. Ownership of those words must be handled by
  the unit's residue/data integration rather than silently extending the
  accepted function boundaries.
