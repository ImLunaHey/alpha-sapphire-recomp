# DllTrainingAppManager behavioral contract

All routines use the ARM AAPCS integer calling convention. Offsets below are
byte offsets. `call 0xNNN` means a call through the import trampoline whose
text address is `0xNNN`; the imported identity is in `inventory.md`.

## Shared object fields

The two state machines at `0x148` and `0x304` operate on this compact object:

| Offset | Width | Observed role |
| ---: | ---: | --- |
| `+0x04` | 4 | allocation owner/context |
| `+0x0C` | 4 | service/session object |
| `+0x10` | 4 | secondary owned object |
| `+0x14..` | 4 each | up to five owned per-peer objects |
| `+0x28` | 4 | peer count |
| `+0x2C` | 4 | state number |
| `+0x30` | 1 | choose multi-peer state machine |
| `+0x31` | 1 | external readiness gate |
| `+0x32` | 1 | local work-complete flag |
| `+0x33` | 1 | force/skip request |
| `+0x34` | 1 | terminal-complete flag |
| `+0x38` | 8 each | per-peer 64-bit construction values |
| `+0x60` | 1 | destructor/dispatch mode flag |

## Small routines

- `func_00000140`: return integer `1`.
- `func_0000055C`: if byte `this+0x32` is zero, return zero. Otherwise load
  `this+0x10` and tail-call import `0x0C0`.
- `func_00000578`: if byte `this+0x60` is zero, return immediately. Otherwise
  dispatch to `func_00000304` when byte `this+0x30` is nonzero, and to
  `func_00000148` when it is zero. Both dispatches are tail branches.
- `func_000005A0`, `func_000008E8`, `func_000008F0`, and
  `func_00000BEC`: each returns integer `1`.
- `func_00000B74`: no operation; return.
- `func_00000BE4`: store the low byte of argument 1 at `argument0+0xD9`, then
  return. This is the already-public contract-05 function.

## `func_00000148`: single-peer state machine

This function saves `r4` and `lr`, keeps `this` in `r4`, and first calls import
`0x000` with `this+0x0C`. If byte `+0x33` equals one and state `+0x2C` is less
than six, it clears `+0x33` and changes the state to six. State values 0..9
dispatch through the table at `0x190`; out-of-range states return unchanged.

Except where stated otherwise, a successful state increments `+0x2C` and
returns. Two intentional no-operations follow several calls and must be
retained for exact code generation.

| State | Behavior |
| ---: | --- |
| 0 | call `0x008(this+0x0C)`; execute two no-operations; advance |
| 1 | call `0x010(this+0x0C)`; advance only when the result and byte `+0x31` are both nonzero |
| 2 | allocate 16 bytes with `0x018(16, this+0x04)`; when non-null call `0x020(new)`; store at `+0x14`; load the 64-bit value at `+0x38` into argument registers 2/3 and call `0x028(new, this+0x38 value)`; call `0x030(this+0x10)`; call `0x038(this+0x0C, new)`; execute two no-operations; advance |
| 3 | call `0x040(this+0x0C)`; advance only on nonzero result; one no-operation follows the comparison path |
| 4 | call `0x048(this+0x10)`; advance only on nonzero result; one no-operation follows the comparison path |
| 5 | set byte `+0x32` to one and return without incrementing state |
| 6 | call `0x050(this+0x0C, 0)`; execute two no-operations; advance |
| 7 | call `0x058(this+0x0C)` and return if zero; otherwise call `0x060(this+0x0C)`, then `0x068(this+0x10)`; execute two no-operations; advance |
| 8 | call `0x070(this+0x0C)` and return if zero; otherwise call `0x078(this+0x0C)`; execute two no-operations; advance |
| 9 | call `0x080(this+0x0C)`; if nonzero set byte `+0x34` to one; return |

The jump-table continuation offsets, relative to `0x1B8`, are:
`0x000, 0x014, 0x03C, 0x084, 0x09C, 0x0B4, 0x0C0, 0x0D8,
0x10C, 0x134`.

## `func_00000304`: multi-peer state machine

This function saves `r3-r7` and `lr`, keeps `this` in `r4`, and calls
`0x000(this+0x0C)`. If byte `+0x33` equals one and state `+0x2C` is less than
five, it clears the byte and changes the state to five. State values 0..8 use
the table at `0x350`; out-of-range states return.

States 0, 4, 5, 6, 7, and 8 have the same behavior as states 0, 5, 6, 7, 8,
and 9 respectively in the single-peer machine.

- State 1 first requires `0x010(this+0x0C)` and byte `+0x31` to be nonzero.
  It loops from peer 0 to `count(+0x28)-1`. Each iteration allocates 16 bytes
  through `0x018`, conditionally invokes `0x020`, stores the pointer at
  `+0x14+4*i`, and invokes `0x028` with the 64-bit value at `+0x38+8*i`.
  For peer zero it also calls `0x030(this+0x10)` and then
  `0x098(this+0x0C, peer0)`. For later peers it calls
  `0x088(this+0x0C, peer_i)`. After the loop, it loads the object at
  `[this+0x0C]+0x18` and calls `0x090(object, this+0x38, count-1)`, performs
  two no-operations, then advances.
- State 2 calls `0x0A0([this+0x0C]+0x18)` and returns when it yields zero.
  Otherwise it calls `0x0A8` with that same object in argument 0, the 64-bit
  value at `this+0x38` in arguments 2/3, and integer one as the first stack
  argument. It performs two no-operations and advances.
- State 3 requires all of: `0x048(this+0x10)` nonzero,
  `0x0B0(this+0x0C) == count(+0x28)`, and `0x0B8(this+0x0C)` nonzero. It
  advances only when all three conditions hold.

The jump-table continuation offsets, relative to `0x374`, are:
`0x000, 0x014, 0x0D4, 0x10C, 0x158, 0x160, 0x178, 0x1AC, 0x1D4`.

## Destruction and ownership routines

`func_000005A8` saves `r4-r8` and `lr`, writes the table pointer
`.rodata+0xA4` to `this+0`, and, when byte `+0x60` is nonzero, calls imports
`0x0C8` then `0x0D0`. It destroys each non-null pointer in
`+0x14..+0x14+4*(count-1)` through virtual slot `+4`, clearing each slot. It
then similarly destroys `+0x10` through virtual slot `+4`, and `+0x0C`
through virtual slot `+8`. It returns `this` by tail-calling `0x0D8(this)`.
Register `r8` is saved/restored although otherwise unused.

`func_00000658` is the same ownership sweep and table assignment, including
the conditional `0x0C8`/`0x0D0` calls, but it returns `this` directly instead
of tail-calling `0x0D8`.

`func_00000A28` and `func_00000AD0` both:

1. write `.rodata+0xC0` to `this+0`;
2. destroy five non-null pointers at `+0xA8..+0xB8` through virtual slot `+8`;
3. destroy the non-null pointer at `+0x5DC` through virtual slot `+4`;
4. invoke `0x128(this+0x24)`, execute one no-operation, then invoke
   `0x130(this+0x24)` and treat its return minus `0x24` as the base object;
5. if the word at `returned_pointer-0x10` is nonzero, call `0x138` with it and
   clear base offset `+0x14`;
6. write `.rodata+0xEC` to the base vtable slot and return the base.

`0xA28` additionally tail-calls `0x0D8(base)`; `0xAD0` returns directly.

`func_00000B78` and `func_00000BB0` write `.rodata+0xEC` to `this+0`, call
`0x138` on the non-null pointer at `+0x14`, clear that pointer, and return
`this`. The former tail-calls `0x0D8(this)`; the latter returns directly.

## `func_00000704`: manager phase update

This function saves `r4-r8` and `lr`; `r4=this`. It obtains an environment
object through `0x0E0()` into `r6`, initializes return value `r7=0`, and
switches on word `this+0x3C`.

### Phase 0

Substate is byte `+0x40`.

- Substate 0 or 2 copies byte `+0x5E4` to `+0x44`, byte `+0x9C` to `+0x46`,
  words `+0xA0`, `+0x88`, and `+0x5DC` to `+0x48`, `+0x4C`, and `+0x60`, and
  the first word of the object at `+0x20` to `+0x64`. It calls
  `0x0E8(this+0xC8)`. It stores `**(r6+0x1C)+0x2D4` at `+0x7C`, and stores
  five internal addresses at `+0x68..+0x78`: `this+0xC8`, `this+0x1CC`,
  `this+0x2D0`, `this+0x3D4`, `this+0x4D8`. It calls
  `0x0F0([r6+0x14], this+0x44)`, executes two no-operations, and changes the
  phase to one.
- Substate 1 copies words `+0x80/+0x84` to `+0xC0/+0xC4`, `+0x4C` to
  `+0x88`, and `+0x5DC` to `+0xA4`; it clears byte `+0x9C`. For indices 0..4
  it calls `0x0F8(pointer_at_+0xA8+4*i, this+0xC8+0x104*i)`. It then calls
  `0x100([r6+0x14], this+0x88)` and changes the phase to one.
- Other substates only change the phase to one.

### Phase 1

- Substate 0 or 2 examines byte `+0x45`. Zero sets return value to one and
  resets phase to zero. Value two selects substate two and clears `+0x5E4`;
  every other nonzero value selects substate one. Both nonzero paths reset
  phase to zero.
- Substate 1 selects substate zero and sets `+0x5E4=1` when byte `+0x9C` is
  nonzero. Otherwise it selects substate two, clears `+0x5E4`, and sets
  `+0x45=2`. It then examines the object at `+0x5DC`: if its byte `+0x32` is
  zero, it returns with phase one; if `+0x32` is set but `+0x34` is clear, it
  sets that object's byte `+0x33=1` and changes this phase to two; if `+0x34`
  is already set, it resets this phase to zero.
- Other substates leave phase one unchanged.

### Phase 2

Reset phase to zero only when byte `+0x34` of the object at `+0x5DC` is
nonzero. Return `r7` in all cases.

## `func_000008F8`: large-object construction

This routine saves `r3-r7` and `lr`; argument 1 is retained as an external
owner pointer.

1. Call `0x108(argument0)`, store `.rodata+0xC0` at the returned address,
   advance it by `0x24`, call `0x110` on the advanced pointer, and subtract
   `0x24` to recover the base.
2. Clear base word `+0x3C`. Call `0x118` with base `+0x24`, arguments
   `(399, 0xA0000, 400)`, and stack argument `4096`.
3. Store original argument 1 at base `+0x20`; clear bytes `+0x40` and
   `+0x5E4`, and word `+0x5E0`.
4. Five times, allocate 16 bytes through `0x018(16, base+0x28)`; when non-null
   call `0x120(new, base+0x28)`. Store results at `+0xA8+4*i`.
5. Allocate 104 bytes through `0x018(104, base+0x28)`. When non-null, set its
   table pointer to `.rodata+0xA4`, copy base words `+0x28/+0x2C` to new
   `+0x04/+0x08`, and zero all other fields: words `+0x0C..+0x2C`, pairs at
   `+0x38/+0x3C`, `+0x40/+0x44`, `+0x48/+0x4C`, `+0x50/+0x54`, and
   `+0x58/+0x5C`; bytes `+0x30..+0x34` and `+0x60`.
6. Store the secondary object (or null) at base `+0x5DC` and return base.

## `func_00000BF4`: BSS parameter initialization

This leaf uses scalar VFP loads/stores and no stack. It writes these float32
values, in order:

- BSS block 0 (`.bss+0x00`, ten floats):
  `0.7, 0.7, 1.0, 1.0, 0.0, 0.75, 1.45, 0.0, -0.8, 0.95`.
- BSS block 1 (`.bss+0x28`, nine floats): offsets `+0x00..+0x08` remain zero;
  offsets `+0x0C..+0x20` become
  `0.0, 0.75, 120.0, 45.0, 0.75, 0.95`.

It returns directly after the final three-float store.

## `func_00000CA8`: exported selector/slot operation

Arguments are `(output_or_value, selector)`. The routine loads the mutable
`.data` slot address, saves `r4/lr`, and uses a five-entry jump table when
`selector < 5`.

| Selector | Behavior | Return |
| ---: | --- | ---: |
| 0 | store zero to `*argument0` | 0 |
| 1 | store argument 0 into the mutable `.data` slot | 0 |
| 2 | load the mutable slot and store it to `*argument0` | 0 |
| 3 | store the addresses `text+0xD54` and `text+0xD58` to argument0 words 0 and 1 | 0 |
| 4 | store `.rodata+0x104` to argument0 words 0 and 1 | 0 |
| other | execute three literal-load/no-operation diagnostic pairs and return constant `0xD8E12C21` | `0xD8E12C21` |

The switch-table continuation offsets, relative to `0xCD0`, are
`0x00, 0x08, 0x10, 0x1C, 0x2C`. The two earlier diagnostic literals are
`0x30000000` and `0x30000026`; their values are overwritten before return but
are required for byte identity.

