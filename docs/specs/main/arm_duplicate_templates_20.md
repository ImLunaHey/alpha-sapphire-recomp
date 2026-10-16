# Probe-verified duplicate ARM templates 20

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus private
  target complete-body grouping, control-flow, data-flow, indirect-transfer,
  and physical post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function already exact in the current report and every function named by
an earlier or current specification/manifest was excluded before grouping.
This bounded batch contains six complete-body groups: exactly 19 ARM-state
functions and 640 code bytes.

## Two-word zero initializer

These ARM-state functions are 16 bytes and identical over their complete
bodies:

- `func_001135B8`
- `func_0017B42C`
- `func_002B4A88`
- `func_0032F8DC`
- `func_0040ABC0`
- `func_0040AF6C`
- `func_00410D14`

The writable object is in `r0`. Materialize zero once, store it to object
offsets 0 and 4, and return through `lr`. The incoming object pointer remains
in `r0`. There are no calls or literal slots.

```asm
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
bx lr
```

## Forty-byte typed sentinel initializer

These ARM-state functions are 56 bytes and identical over their bodies:

- `func_00115044`
- `func_001150C8`

The writable object is in `r0` and is returned unchanged. Install the
function's named type identity at offset 0. Clear words at offsets 4, 8, 12,
16, 20, 28, and 32, and clear the byte at offset 24. Store `object + 32` at
offset 36. Preserve the exact order, including the paired store that clears
offsets 28 and 32 before offset 4 is cleared.

One type-identity literal follows each body at relative offset 56; its load
begins at body offset 0. The two identities are distinct. There are no calls.

```asm
ldr r1, <type-identity>
mov r2, #0
add r3, r0, #32
str r1, [r0]
add r1, r0, #28
strd r2, [r1]
str r2, [r0, #4]
str r3, [r0, #36]
str r2, [r0, #8]
str r2, [r0, #12]
str r2, [r0, #16]
str r2, [r0, #20]
strb r2, [r0, #24]
bx lr
```

## Biased halfword-table address calculation

These ARM-state functions are 56 bytes and identical:

- `func_0011FA90`
- `func_0012FDD8`

The table base is in `r0` and an unsigned selector is in `r1`. Preserve the
base and selector, perform the shown signed range-check sequence, then return
`base + 2 * selector - 0x7ffc`. When `selector - 0x4000` is not signed-less
than `0x178`, the function explicitly zeroes `r2`, then `r1`, then `r0`, and
executes `mov r0, r0`; those writes do not affect the final calculation because
the preserved registers are used. This apparently inert path is nevertheless
part of the exact body and must remain. There are no calls or literal slots.

```asm
push {r4, r5, r6, lr}
mov r5, r0
sub r0, r1, #0x4000
cmp r0, #0x178
mov r4, r1
blt .Laddress
mov r2, #0
mov r1, r2
mov r0, r2
mov r0, r0
.Laddress:
add r0, r5, r4, lsl #1
sub r0, r0, #0x7c00
sub r0, r0, #0x3fc
pop {r4, r5, r6, pc}
```

## Four-word in-place byte swap

These ARM-state functions are 52 bytes and identical:

- `func_0023C4BC`
- `func_0023C4F0`

The writable 16-byte record is in `r0`. In physical order, load, reverse the
four bytes, and store each word at offsets 0, 4, 8, and 12. The record pointer
remains in `r0`. There are no calls or literal slots.

```asm
ldr r1, [r0]
rev r1, r1
str r1, [r0]
ldr r1, [r0, #4]
rev r1, r1
str r1, [r0, #4]
ldr r1, [r0, #8]
rev r1, r1
str r1, [r0, #8]
ldr r1, [r0, #12]
rev r1, r1
str r1, [r0, #12]
bx lr
```

## Optional backlink detachment

These ARM-state functions are 52 bytes and identical:

- `func_0032B314`
- `func_0032DD00`

The address of an owning pointer slot is in `r0`. If the slot is null, return.
Otherwise read the pointed object's backlink at offset 276. If that backlink
equals the owning slot address, clear the backlink, reload the owning slot,
and return if the reloaded value is null. In all remaining paths clear the
owning slot. Preserve the seemingly redundant reload and null test after
clearing the matching backlink. There are no calls or literal slots.

```asm
ldr r1, [r0]
cmp r1, #0
beq .Lreturn
ldr r3, [r1, #276]
mov r2, #0
cmp r3, r0
bne .Lclear_owner
str r2, [r1, #276]
ldr r1, [r0]
cmp r1, #0
beq .Lreturn
.Lclear_owner:
str r2, [r0]
.Lreturn:
bx lr
```

## Nullable vtable-slot tail dispatch

These ARM-state functions are 24 bytes and identical:

- `func_001F5C0C`
- `func_003B72A4`
- `func_003B73B8`
- `func_0049990C`

The object is in `r0`. A null pointer returns directly. Otherwise load the
object's vtable and tail-dispatch to the method at byte offset 4 with `bx`,
leaving `lr` owned by the original caller. This is a tail transfer, not a
normal call, and it must not introduce a prologue. There are no direct calls
or literal slots.

```asm
cmp r0, #0
beq .Lreturn
ldr r1, [r0]
ldr r1, [r1, #4]
bx r1
.Lreturn:
bx lr
```

## Independent full-body probe result

The six semantic templates above were independently assembled as ARM state.
Every listed function's complete declared body was compared byte for byte with
the corresponding assembled body. The typed initializer's post-body literals
were excluded from body comparison and audited separately by physical slot and
equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Two-word zero initializer | 7 | 16 | 112 | 7/7 exact |
| Forty-byte typed sentinel initializer | 2 | 56 | 112 | 2/2 exact |
| Biased halfword-table address | 2 | 56 | 112 | 2/2 exact |
| Four-word in-place byte swap | 2 | 52 | 104 | 2/2 exact |
| Optional backlink detachment | 2 | 52 | 104 | 2/2 exact |
| Nullable vtable-slot tail dispatch | 4 | 24 | 96 | 4/4 exact |
| **Total** | **19** |  | **640** | **19/19 exact** |

Implementation must preserve ARM state, exact instruction order and branch
topology, the initializer's paired store and post-body type slot, the inert
range-check path, backlink reload, and `bx` tail-call ABI. Type identities must
be represented by named symbols; do not encode target values in source.
