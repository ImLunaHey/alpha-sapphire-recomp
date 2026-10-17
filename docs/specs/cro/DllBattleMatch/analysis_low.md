# DllBattleMatch lower-range clean-room analysis draft

## Scope and provenance

This analysis covers only accepted ARM functions in `cro/DllBattleMatch` from
module-relative address `0x0000131C` through `0x00007C6C`, inclusive.  The
first implementation batch below is intentionally limited to four functions
whose behavior and machine shape could be specified coherently:

| Function | Size | ARM instructions | Status in this draft |
| --- | ---: | ---: | --- |
| `func_00002324` | 232 bytes | 58 | implementation-ready |
| `func_000025EC` | 272 bytes | 68 | implementation-ready |
| `func_00002D08` | 268 bytes | 67 | implementation-ready |
| `func_000075D0` | 160 bytes | 40 | implementation-ready |

The observations were made on 2026-10-17 from the external AS_EUR_REV2
verification input and the repository's deterministic split target object.
Tools were Ghidra 12.0.2 (ARM v6 little-endian analysis/decompiler), GNU
binutils 2.44 (`arm-none-eabi-objdump`), and GNU `readelf`.  The external
module, generated target object, disassembly, and decompiler output remain
outside this specification; no binary bytes or proprietary tables are
reproduced here.  Imported functions are named only by the neutral identities
already emitted by the repository tooling.

All four functions use the 32-bit ARM AAPCS.  Arguments one through four are
in `r0` through `r3`, additional arguments are on the stack, and the return
value is in `r0`.  All observed accesses are little-endian.  The target code
is ARM state throughout.

## Common neutral interfaces

The following call descriptions are behavioral labels for otherwise unknown
imports.  They do not assert original names or types.

| Neutral identity | Observed role in this batch |
| --- | --- |
| `import@023df9c` | initialize/obtain an object using `(storage, owner, owner[0x10], owner[0x10])` |
| `import@02610e4` | query resource value A |
| `import@0261c7c` | query resource value B |
| `import@023de2c` | initialize common object fields from owner/resource/pair data |
| `import@023b838` | bind object to its embedded subobject at `+0x84` |
| `import@03c4b40` | obtain an associated resource from an object |
| `import@03c6500` | select an indexed child resource |
| `import@023b990` | bind a selected child and a read-only descriptor |
| `import@024b0cc` | assign a scalar value to a numbered property |
| `import@024ae00` | configure a numbered property with two additional scalars |
| `import@0023480` | allocate `size` bytes using an owner allocator/token |
| `import@001fb9c` | obtain selector/descriptor for integer argument `8` |
| `import@001ea14` | initialize the optional 40-byte auxiliary allocation |
| `import@03ea91c` | boolean query of the opaque second argument |
| `import@03ea7f0` | value query of the opaque second argument |
| `import@031dadc` | create the object stored at context offset `0x8C` |
| `import@03c8a84` | derive a value from a child resource and scalar `0x3C` |
| `import@031d4d8` | attach a four-word local descriptor to an object |
| `import@0366034` | boolean/result query using a rooted address and context value |
| `import@02617d8` | configure an associated resource |

The internal calls `func_0000E8E0` and `func_0000F21C` retain their neutral
module-relative identities.  They are outside this analyst's assigned range;
their implementation is not specified here.

## `func_00002324`

### Contract

Suggested neutral prototype:

```c
void func_00002324(void *context, void *opaque);
```

If `context+0x8C` is nonzero, return without observable changes.  Otherwise:

1. Build a five-byte-effective local request record.  Its byte zero is
   `0x26` when `import@03ea91c(opaque)` is nonzero and `0x25` otherwise; its
   word at `+4` is `import@03ea7f0(opaque)`.
2. Build a one-element count word with value `1`.
3. Let `owner = *(context+0x74)`, `a = *(owner+4)`, and `b = *(owner+8)`.
   Call `import@031dadc` with the exact nine-argument sequence
   `(*(context+0x78), a, b, a, b, &request, &count, a, 0)`.  Store its result
   at `context+0x8C`.
4. Build a 16-byte local descriptor `{ byte 3, padding, derived, 0, 0 }`:
   call `import@03c4b40(context)`, then
   `import@03c6500(result, 1)`, then
   `import@03c8a84(result, 0x3C)`; place the final result in the descriptor's
   word at `+4`.  Call
   `import@031d4d8(*(context+0x8C), &descriptor)`.
5. Call `func_0000F21C(context, 0x16)` and finally store byte `1` at
   `context+0x90`.

No return value is defined.

### Exact machine-shape constraints

- Save `r4-r6,lr`; use `r4=context`, initially use `r5=opaque`, and use
  `r6=0`.  Allocate exactly `0x30` stack bytes after saving registers.
- The target tests `context+0x8C` only after assigning `r4`, allocating the
  frame, and assigning `r5`.  The nonzero path shares the common epilogue.
- Local layout is fixed: count at `sp+0x14`; descriptor at `sp+0x18`; request
  at `sp+0x28`.  Request value is at `sp+0x2C`.
- Initialize request byte `2`, count `0`, and request value `0` before the
  boolean query, even though request byte `2` is always overwritten.  After
  the value query, change `r5` from `opaque` to constant `1` and use it for
  both the count and final byte store.
- For the nine-argument creation call, stack arguments occupy `sp+0` through
  `sp+0x10` in the order listed above.  The target forms `&count`, `&request`,
  and `sp+0x0C` before loading `a` and `b`; it writes `a,0` together to
  `sp+0x0C` and writes `b` to `sp+0` last.
- Initialize descriptor byte zero to `3`, then its three words at `+4,+8,+12`
  to zero, before the associated-resource call chain.  Store the derived word
  only after the third call.
- Restore `sp` by `0x30` and return by restoring `r4-r6,pc`.
- There is no literal pool and no relocation associated with this function
  body.

## `func_000025EC`

### Contract

Suggested neutral prototype:

```c
void *func_000025EC(void *storage, void *owner, void *resource,
                    void *pair_data);
```

Call `import@023df9c(storage, owner, *(owner+0x10), *(owner+0x10))`; call the
returned pointer `object`.  Initialize it in this exact semantic order:

- `object+0x78 = 0`
- `object+0x74 = owner`
- `object+0x88 = 0`
- `object+0x84 = vtable + 0x48`
- `object+0x00 = vtable`
- `object+0x8C = 0`
- byte `object+0x90 = 0`
- `object+0x94 = 0`

Then perform the common binding sequence:

```text
A = import@02610e4(resource)
B = import@0261c7c(resource)
import@023de2c(object, owner, B, 2, pair_data, 2, *(resource+0x28), A)
import@023b838(object, object+0x84)
child = import@03c6500(resource, 1)
import@023b990(object, *(object+0x74), child, rodata+0x480, 1)
```

Allocate `0x28` bytes with
`import@0023480(0x28, *(owner+4))`.  If allocation succeeds, obtain
`selector = import@001fb9c(8)` and replace the allocation pointer with the
result of
`import@001ea14(allocation, selector, 0x9C, *(owner+8), 1, 5)`.
Store the successful initializer result, or zero on allocation failure, at
`object+0x94`.  Return `object`.

### Exact machine-shape constraints

- Save `r4-r8,lr`; preserve `resource` in `r6`, `pair_data` in `r7`, and
  `owner` in `r5`.  Allocate exactly `0x10` stack bytes.
- Before the first call, load `owner+0x10` into `r2`, copy it to `r3`, and
  leave incoming `r0/r1` intact.  The result remains in `r0` while the first
  seven stores above are made; only then copy it to `r4`, perform the final
  `+0x94` zero store, and begin calls.
- Preserve query A in `r8`.  Query B remains in `r0` and is copied to `r2`.
  For `import@023de2c`, put `pair_data` at `sp+0`, constant `2` at `sp+4`,
  and write `*(resource+0x28), A` together at `sp+8`; use
  `(r0,r1,r2,r3)=(object,owner,B,2)`.
- The descriptor call uses stack argument `1` and literal descriptor
  `rodata+0x480`.  Immediately afterward set `r7=1`; reuse it for both
  trailing initializer arguments `1` and `5` (`5` is separately materialized
  at `sp+4`).
- On allocation failure, the zero already returned in `r0` flows directly to
  the `object+0x94` store.  Do not rematerialize zero.
- Restore `sp` by `0x10`, move `object` to `r0`, and return by restoring
  `r4-r8,pc`.

### Literal and relocation requirements

The function refers to an adjacent two-word literal section beginning at
module offset `0x26FC`.  Word zero is an `R_ARM_ABS32` reference to
`.rodata+0x1E64` (the vtable used above); word one is an `R_ARM_ABS32`
reference to `.rodata+0x480` (the descriptor).  The accepted function body
ends before this pool.  The body itself has no emitted ELF relocations in the
deterministic split target.

## `func_00002D08`

### Contract

Suggested neutral prototype:

```c
void *func_00002D08(void *storage, void *owner, void *resource,
                    void *pair_data);
```

The initial object acquisition and common binding are the same pattern as
`func_000025EC`, with these differences:

- initialize `object+0x00 = vtable`, `object+0x84 = vtable+0x44`,
  `object+0x74 = owner`, `object+0x78 = 0`, and `object+0x88 = 0`;
- there are no fields at `+0x8C`, `+0x90`, or `+0x94` in this constructor;
- call `import@023b990(object, *(object+0x74), child,
  rodata+0x28, 3)`.

After binding, let `value = 0x00060001` and `handle = *(object+0x10)`.  In
order, call:

```text
import@024b0cc(handle, 0x5A, value)
import@024b0cc(handle, 0x5D, value)
import@024b0cc(handle, 0x87, value | arithmetic_shift_right(value, 17))
import@024ae00(handle, 0x87, 0x20, 0)
```

Reload `object+0x10` before every call.  Return `object`.

### Exact machine-shape constraints

- Save `r4-r8,lr`; assign `r6=resource`, `r7=pair_data`; load
  `owner+0x10`; allocate exactly `0x10` stack bytes; only then assign
  `r5=owner` and copy the loaded value into `r3` before calling
  `import@023df9c`.
- Copy the returned object to `r4` immediately after loading the vtable
  literal.  Materialize zero in `r0`; store fields in the exact order
  `+0x78`, `+0`, `+0x84`, `+0x74`, `+0x88`.
- Preserve query A in `r8`.  The `import@023de2c` stack and register layout is
  identical to `func_000025EC`.
- For `import@023b990`, materialize stack argument `3` before loading its
  descriptor literal and before loading `object+0x74`.
- Keep `value` in `r5` for the property sequence.  The third value is formed
  with one OR operation whose second operand is an arithmetic right shift by
  17; do not replace it with the folded constant `0x00060003` if exact output
  is required.
- Restore `sp` by `0x10`, move `object` to `r0`, and restore `r4-r8,pc`.

### Literal and relocation requirements

The adjacent literal section at module offset `0x2E14` has three words:

1. `R_ARM_ABS32` to `.rodata+0x1F48` (vtable);
2. `R_ARM_ABS32` to `.rodata+0x28` (binding descriptor);
3. the scalar constant `0x00060001`.

The accepted body ends before this pool and has no emitted ELF relocations in
the deterministic split target.

## `func_000075D0`

### Contract

Suggested neutral prototype:

```c
void func_000075D0(void *context);
```

Compute the rooted address through three explicit loads:
`p = *(context+4)`, `q = *(p+0x1C)`, `base = *(q+0)`,
`root = base+0x3994`.  Call
`import@0366034(root, *(context+0x0C))`.

- If the result is nonzero, store byte `2` at `context+0x4A` and choose
  candidate byte `5`.
- If the result is zero, first call `func_0000E8E0(context, 2)`, then store
  byte `3` at `context+0x4A`, and choose candidate byte `11`.
- In either case, store the candidate at `context+0x48` only when the current
  byte at that offset is zero.

Then store byte `1` at `context+0x3C`, obtain
`associated = import@03c4b40(*(context+0x5C))`, call
`import@02617d8(associated, 0, 0x1BC, 0)`, and finally store word `0x0D` at
`context+0x38`.

### Exact machine-shape constraints

- Save `r4-r6,lr`, even though `r6` is not otherwise used; keep context in
  `r4`.
- Form `0x3994` as two ordered additions, first `0x3800`, then `0x194`.
- After the query comparison, materialize `r5=1` before branching.  The
  nonzero path sets `+0x4A`, loads `+0x48`, and materializes candidate `5`.
  The zero path calls the internal function first, sets `+0x4A`, loads
  `+0x48`, and materializes candidate `11`.  Both paths share a single
  candidate store and then the common tail.
- Store `r5` (`1`) at `+0x3C`, then deliberately replace `r5` with zero and
  use it for both zero arguments to `import@02617d8`.
- Materialize `0x1BC` directly as an ARM rotated immediate.  Return by
  restoring `r4-r6,pc`; there is no local stack frame.
- There is no literal pool and no relocation associated with this function
  body.

## Remaining accepted functions in the assigned range

The following nine bodies total 5,548 bytes.  Their boundaries, ARM mode, and
high-level behavior were confirmed, but this pass does not claim an
implementation-ready exact schedule for them:

| Function | Size | Confirmed synopsis | Concrete reason deferred |
| --- | ---: | --- | --- |
| `func_0000131C` | 340 | lazy global initialization followed by construction of a `context+0xCC` object using a 96-byte frame and VFP literals | depends on `.data`/`.bss` state, two float constants, a nine-word copied record, and a six-word pool with three relocations |
| `func_000016E8` | 2,256 | top-level constructor that creates and wires eleven child objects, including the `0x25EC`, `0x2D08`, `0x3000`, and `0x3360` constructors | 564 instructions, 18-word literal pool, numerous unresolved vtable/descriptor identities, and repeated but non-identical child-constructor schedules |
| `func_000027B4` | 484 | three-state controller around a polymorphic object at `+0x1C`; advances virtual operations, handles a pending operation, and accepts result codes `0x2D` through `0x31` with exclusions/branch-specific teardown | several indirect virtual calls and event-byte predicates need a separate exact control-flow specification |
| `func_00003000` | 284 | constructor sibling of `0x2D08` with four property assignments and property id `0x84` | deferred only to keep the first batch small; should reuse the `0x2D08` constructor template |
| `func_00003360` | 316 | constructor sibling of `0x2D08` with six property assignments and property id `0x81` | deferred only to keep the first batch small; should reuse the `0x2D08` constructor template |
| `func_000038DC` | 396 | builds two temporary resources, performs a `0x40000` allocation/read, and chooses either two fallback attachments or two context-indexed attachments | multiple allocation/error paths plus three adjacent scalar literals require a dedicated pass |
| `func_00003A74` | 300 | unconditionally creates `context+0x84`, attaches a descriptor, changes state to `4`, and sets a high-offset flag | nine-argument creation call plus context-relative high-offset literal needs exact stack/scratch-register documentation |
| `func_0000467C` | 640 | clears `0x180` output bytes, serializes three list groups into 12-byte records, then copies two sets of six five-halfword records | four loops, packed byte/halfword fields, and five input arguments require a dedicated record-layout review |
| `func_00007C6C` | 532 | optional counter rebalance followed by three allocations/copies and a final eight-argument creation call | allocation ownership/error semantics and the `0xE058` literal-sized buffer need confirmation before implementation |

No claim is made for data ownership, relocation completeness outside the
literal requirements explicitly listed above, or unit completeness.  This is
an analyst draft for role-separated implementation and review.
