# DllPhotoSaverSecretBase clean-room analysis 01

## Provenance and scope

- Target: Pokémon Alpha Sapphire `AS_EUR_REV2`, unit
  `cro/DllPhotoSaverSecretBase`.
- Evidence: the externally supplied target object generated from the private
  verification input, the checked-in public CRO inventory and exact partition,
  and relocation-backed function-pointer references.
- Tools: Ghidra 11.3.2, GNU `arm-none-eabi-objdump` 2.44, and GNU
  `arm-none-eabi-readelf` 2.44. The checked-in inventory was produced by the
  repository's Ghidra-based CRO analysis pipeline.
- Observation date: 2026-10-17.
- Role: analysis/specification only. No implementation source was consulted or
  changed while deriving this specification.

No target bytes, disassembly, binary-derived strings, or target data tables are
reproduced here. Dependency names below are neutral labels assigned for this
specification.

## `func_00001D60`

### Interface and boundary

- ARM-state entry at text offset `0x1D60`, size `0x218` (536 bytes).
- The routine accepts three machine-word arguments. The first is a mutable
  object pointer; the second and third are forwarded unchanged to one setup
  dependency.
- No stable return value is observed. Treat the routine as returning `void`.
- The executable body ends before a three-word literal pool at `0x1F78`.

### Observable contract

1. A process-global guard word is tested. If its low bit is clear, the routine
   calls a guard-acquire dependency. When that dependency reports ownership,
   the routine clears a separate global word and calls the matching
   guard-complete dependency. If the guard is already set, or acquisition
   reports no ownership, this initialization is skipped.
2. A setup dependency is called with the original three arguments and a fixed
   stack descriptor. The descriptor identifies the guarded global state, a
   read-only descriptor, and the scalar values `1`, `59`, `0`, and `8` in the
   observed fields. The fourth register argument is `1`.
3. A context dependency returns an object. The routine follows the pointer at
   offset `28`, dereferences its first word, advances by `0x20400`, and uses the
   resulting address to construct a temporary helper object on the stack. A
   second dependency reads one scalar from that helper.
4. A primary-object accessor is called before every parameter write. Its
   result is passed to a six-argument parameter-write dependency. Six writes
   occur in this exact order:

   - slot `5`: the scalar read from the temporary helper, kind `6`, with both
     trailing flags set;
   - slot `0`: the signed remainder modulo `100` of getter 0, kind `2`, with
     trailing values `2` and `1`;
   - slot `1`: getter 1, kind `2`, with trailing values `0` and `1`;
   - slot `2`: getter 2, kind `2`, with trailing values `0` and `1`;
   - slot `3`: getter 3, kind `2`, with both trailing flags set;
   - slot `4`: getter 4, kind `2`, with trailing values `2` and `1`.

   All five getters receive the subobject at first-object offset `120`.
   Signed remainder uses truncation toward zero, so negative inputs retain the
   sign of the dividend.
5. Between the slot-5 and slot-0 writes, the first object is passed to a
   configuration dependency with scalar arguments `(0, 43, 12)`. After the
   slot-4 write it is passed to the same dependency with `(0, 49, 10)`.
6. The stack helper constructed in step 3 is destroyed before return.

The routine has no input-dependent branch after the global-guard sequence; all
six parameter writes and both configuration calls always occur.

### Compiler-relevant observations

- The body uses a 36-byte stack frame and preserves `r4` through `r9` plus
  `lr`.
- The first object, forwarded arguments, zero, and one remain live in callee-
  saved registers across most dependency calls.
- The signed remainder is compiled inline using a signed multiply by a magic
  reciprocal, arithmetic shifts, and a multiply/subtract equivalent to
  `value - trunc(value / 100) * 100`; there is no division-helper call.
- Two pairs of trailing stack arguments are emitted as doubleword stores.
- Nine legacy ARM hint encodings appear as scheduling padding around dependency
  calls. An implementation attempting an exact compiler match must preserve
  their placement rather than treating them as semantic operations.
- The body makes only direct ARM calls. Its two address-bearing literal words
  require relocations to one data object and one read-only object; the signed
  division reciprocal is an unrelocated literal.

### Neutral dependency identities

The direct calls target module-local import veneers. The following neutral
labels and module-relative veneer entries are sufficient to express their
identity and equality relationships without publishing the backing import
names or external target addresses:

| Neutral identity | Veneer entry | Call role |
| --- | ---: | --- |
| `guard_acquire` | `0x0248` | Attempts ownership of the process-global guard. |
| `guard_complete` | `0x0250` | Completes guarded initialization. |
| `register_setup` | `0x0258` | Receives the original arguments and fixed descriptor. |
| `get_context` | `0x0148` | Returns the context used to locate helper input. |
| `helper_construct` | `0x02E0` | Constructs the temporary stack helper. |
| `helper_read` | `0x02E8` | Reads the helper scalar used for slot 5. |
| `get_parameter_owner` | `0x0098` | Returns the first object's parameter owner. |
| `write_parameter` | `0x02F0` | Performs each of the six parameter writes. |
| `configure_object` | `0x02D0` | Performs both fixed configuration calls. |
| `read_source_0` | `0x02F8` | Reads the value normalized modulo 100. |
| `read_source_1` | `0x0300` | Reads the value for slot 1. |
| `read_source_2` | `0x0308` | Reads the value for slot 2. |
| `read_source_3` | `0x0310` | Reads the value for slot 3. |
| `read_source_4` | `0x0318` | Reads the value for slot 4. |
| `helper_destroy` | `0x0320` | Destroys the temporary stack helper. |

Every listed endpoint is an existing low-text veneer outside the claimed
function. An implementation can therefore branch to these neutral endpoints
without embedding private import encodings. The two address literals used by
the function are likewise expressible as identities: pool slot `0x1F78`
relocates to data offset `0x0C`, while pool slot `0x1F7C` relocates to read-only
offset `0x48`. The function does not own those pool words.

### Caller-visible types and complete pseudocode

Only caller-visible ABI types are asserted here. A dependency result that this
routine does not consume is written as `void`; the callee's original
language-level return type is immaterial to this call site. `word` and `sword`
are unsigned and signed 32-bit values respectively, and all pointer types are
32-bit ARM pointers.

```text
type word = uint32
type sword = int32
type Object = opaque
type ParameterOwner = opaque
type Context = opaque
type Helper = opaque

word  guard_acquire(word *guard)
void  guard_complete(word *guard)
void  register_setup(Object *object, word forwarded_1, word forwarded_2,
                     word mode,
                     void *data_identity, word data_count,
                     const void *readonly_identity, word readonly_count,
                     word scalar_59, word flag_1, word scalar_0,
                     word scalar_8)
Context *get_context(void)
void  helper_construct(Helper *helper, const void *source)
word  helper_read(Helper *helper)
ParameterOwner *get_parameter_owner(Object *object)
void  write_parameter(ParameterOwner *owner, word slot, word value,
                      word kind, word trailing_0, word trailing_1)
void  configure_object(Object *object, word first, word second, word third)
sword read_source_0(void *subobject)
word  read_source_1(void *subobject)
word  read_source_2(void *subobject)
word  read_source_3(void *subobject)
word  read_source_4(void *subobject)
void  helper_destroy(Helper *helper)
```

`register_setup` receives its first four arguments in `r0` through `r3` and
the remaining eight at the following outgoing-stack offsets. This descriptor
occupies frame offsets `0` through `31`; frame offset `32` is not part of the
descriptor.

| Frame offset | Logical argument | Exact value |
| ---: | ---: | --- |
| `+0` | 5 | Pointer to module data offset `0x0C` |
| `+4` | 6 | `1` |
| `+8` | 7 | Pointer to module read-only offset `0x48` |
| `+12` | 8 | `1` |
| `+16` | 9 | `59` |
| `+20` | 10 | `1` |
| `+24` | 11 | `0` |
| `+28` | 12 | `8` |

After `register_setup` returns, frame offset `+8` is reused as the start of
the aligned opaque helper storage. The frame makes 28 bytes available from
that address through its end; the helper's language-level size is not exposed
by this routine. Later six-argument calls reuse only frame offsets `+0` and
`+4` for their two stacked arguments, so they do not overlap the helper.

The complete behavior, with calls in exact order, is:

```text
void func_00001D60(Object *object, word forwarded_1, word forwarded_2)
{
    word *const data_identity = module_data + 0x0C;
    word *const guard = module_data + 0x00;
    word *const guarded_value = module_data + 0x14;
    const void *const readonly_identity = module_rodata + 0x48;

    if ((*guard & 1) == 0) {
        if (guard_acquire(guard) != 0) {
            *guarded_value = 0;
            guard_complete(guard);
        }
    }

    register_setup(object, forwarded_1, forwarded_2, 1,
                   data_identity, 1, readonly_identity, 1,
                   59, 1, 0, 8);

    Context *context = get_context();
    void *level_1 = *(void **)((byte *)context + 28);
    byte *helper_source = *(byte **)level_1 + 0x20400;
    Helper *helper = helper_storage_at_frame_offset_8;
    helper_construct(helper, helper_source);
    word helper_value = helper_read(helper);

    write_parameter(get_parameter_owner(object), 5, helper_value, 6, 1, 1);
    configure_object(object, 0, 43, 12);

    void *source = (byte *)object + 120;
    sword normalized = read_source_0(source) % 100;
    write_parameter(get_parameter_owner(object), 0, (word)normalized, 2, 2, 1);

    word value_1 = read_source_1(source);
    write_parameter(get_parameter_owner(object), 1, value_1, 2, 0, 1);

    word value_2 = read_source_2(source);
    write_parameter(get_parameter_owner(object), 2, value_2, 2, 0, 1);

    word value_3 = read_source_3(source);
    write_parameter(get_parameter_owner(object), 3, value_3, 2, 1, 1);

    word value_4 = read_source_4(source);
    write_parameter(get_parameter_owner(object), 4, value_4, 2, 2, 1);

    configure_object(object, 0, 49, 10);
    helper_destroy(helper);
}
```

At the machine-call boundary, each `write_parameter` receives owner, slot,
value, and kind in `r0` through `r3`; `trailing_0` is at outgoing stack offset
`+0` and `trailing_1` at `+4`. Getter results are preserved across the
subsequent `get_parameter_owner` call before becoming the third argument to
`write_parameter`. The `get_context` call has no logical arguments; the value
incidentally left in `r0` by `register_setup` is not prepared or consumed as an
argument.

### Exact scheduling constraints

- The prologue first saves `r4` through `r9` and `lr`, preserves the object in
  `r4`, allocates the 36-byte frame, then preserves `forwarded_1` in `r5`,
  loads the data identity into `r9`, preserves `forwarded_2` in `r6`, and
  materializes zero in `r8`.
- The only conditional control flow is the two-level guard sequence: one
  branch skips acquisition when guard bit 0 is set, and one skips the clear and
  completion call when acquisition returns zero. The remainder of the function
  is straight-line.
- The setup descriptor is emitted in this store order: offset `+28`; offset
  `+0`; one three-word store covering `+16`, `+20`, and `+24`; offset `+4`;
  then one two-word store covering `+8` and `+12`. Afterward the preserved
  third, second, and first arguments are moved into `r2`, `r1`, and `r0` in
  that order immediately before `register_setup`.
- Two consecutive legacy ARM hint words occur immediately after
  `register_setup` and immediately before `get_context`.
- One legacy ARM hint occurs after the helper pointer is placed in `r0` and
  immediately before `helper_read`.
- One legacy ARM hint occurs after `(byte *)object + 120` is placed in `r0` and
  immediately before each of `read_source_0`, `read_source_1`,
  `read_source_2`, `read_source_3`, and `read_source_4`.
- One legacy ARM hint occurs after the helper pointer is placed in `r0` and
  immediately before `helper_destroy`. These placements account for all nine
  hints.
- Zero and one remain resident in preserved registers for the whole main call
  sequence. The value two becomes resident before the slot-0 write and is
  reused through the slot-4 write. Getter results are kept in one preserved
  register across each owner-accessor call.
- For the slot-5 write, trailing offset `+0` is stored before `+4`. The slot-0
  pair is issued as one aligned doubleword store. For slot 1 and slot 2,
  trailing offset `+4` is stored before `+0`. For slot 3, `+0` is stored before
  `+4`. The slot-4 pair is issued as one aligned doubleword store.
- The signed remainder sequence forms the signed high half of the reciprocal
  product, arithmetic-shifts it by five, subtracts its sign adjustment,
  multiplies that quotient by `-25`, then adds the original value plus that
  product shifted left by two. This is exactly truncating signed remainder by
  100 and does not call a division helper.
- The epilogue follows `helper_destroy` directly: the 36-byte frame is released
  and the preserved-register set is restored with return. There is no return-
  value materialization.
- The authored 536-byte body must have no relocations of its own. All calls are
  fixed module-relative branches to the veneers above. Its three literal loads
  refer to the adjacent, unowned pool words at `0x1F78`, `0x1F7C`, and
  `0x1F80`; the first two retain the skeleton's data/read-only relocations and
  the last is the unrelocated reciprocal used for signed division by 100.

## Relocation-backed tail entry points

The checked-in partition combines several genuine functions into gaps after
`func_00001D60`. Read-only-data relocations point independently at each entry
below, and each entry has a complete return path before the next entry or
literal pool. These are safe candidates for the next deterministic inventory
regeneration; they were not manually inserted into the public CSV or partition
in this analysis commit.

| Entry | Code size | Neutral behavior |
| --- | ---: | --- |
| `0x1F84` | 4 | Return-only no-op. |
| `0x1F88` | 60 | Destruction wrapper: updates two dispatch pointers, destroys an embedded subobject, runs three cleanup dependencies, then tail-calls a final release dependency. |
| `0x1FCC` | 56 | Alternate destruction wrapper with the same embedded-subobject and dispatch-pointer transitions. |
| `0x200C` | 4 | Return-only no-op. |
| `0x2010` | 4 | Return-only no-op. |
| `0x2014` | 52 | Sets a dispatch pointer, releases a nullable owned pointer at offset `20`, clears that field, then tail-calls a base cleanup dependency. |
| `0x204C` | 48 | Sets a dispatch pointer, releases and clears the nullable owned pointer at offset `20`, and returns the original object. |
| `0x2088` | 8 | Returns constant `1`. |
| `0x2090` | 4 | Return-only no-op. |
| `0x2094` | 4 | Return-only no-op. |
| `0x2098` | 4 | Return-only no-op. |
| `0x209C` | 4 | Return-only no-op. |
| `0x20A0` | 8 | Returns the word at input offset `48`. |
| `0x20A8` | 8 | Returns constant `1`. |
| `0x20B0` | 92 | Converts an interior pointer to its owner by subtracting `32`, allocates/configures a `0x200` by `0x100` resource, stores the resulting pointer at owner offset `96`, and tail-calls a finalizer with two zero arguments. |
| `0x2110` | 128 | Converts an interior pointer to its owner by subtracting `32`; returns false if a readiness dependency fails, returns true if the owned pointer at offset `96` is already null, otherwise temporarily replaces the word at offset `36`, performs a guarded release/update sequence, restores that word, clears offset `96`, and returns true. |

The module tail also contains an ARM routine at `0x2190` that initializes
module-global floating-point state and the exported CRO control routine at
`0x2244`. Those are module lifecycle/control material rather than ordinary
game-function inventory candidates. The lifecycle routine is referenced by the
control footer; its constants and destination table are intentionally not
reproduced in this specification.

## Inventory status

The authoritative public inventory still claims exactly two functions:
`func_00001D60` and the already implemented 8-byte
`func_00002080`. This specification makes `func_00001D60` implementable from
neutral facts and records evidence for splitting the tail gaps in a future
deterministic inventory pass. It does not claim that the unit is complete.

On 2026-10-17 the unit-only deterministic workflow was rerun with Ghidra
11.3.2. It exported 2 functions, rejected 126 analyzer-created bodies as
ambiguous, and produced 134 gaps, 136 pools, and 3 unknown ranges. Both the CSV
and exact-partition JSON were byte-identical to the checked-in files, and the
symbol and semantic validators passed. The tail candidates above are referenced
from read-only data rather than by direct call instructions. The conservative
exporter requires an external entry point or a non-computed direct call as
independent boundary evidence, so it does not accept those data-referenced
bodies. Publishing them now would require a manual inventory edit or a broader
export-policy change; neither was performed.
