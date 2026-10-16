# Probe-verified duplicate ARM templates 21

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function and symbol inventories
  plus private target complete-body grouping, control-flow, data-flow,
  indirect-transfer, and physical post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function already exact in the current report and every function named by
an earlier or current specification/manifest was excluded before grouping.
This bounded batch contains six complete-body groups: exactly 19 ARM-state
functions and 536 code bytes.

## Typed two-word initializer

These ARM-state functions are 16 bytes and identical over their complete
bodies:

- `func_00257BB4`
- `func_00257BF4`
- `func_0028D188`
- `func_00330C0C`
- `func_00374CBC`
- `func_0039BC80`

The writable object is in `r0` and is returned unchanged. Load the function's
named type identity, materialize zero, and store the identity and zero at
offsets 0 and 4 with one two-register store.

One type-identity literal follows each body at relative offset 16; its load
begins at body offset 0. The first two functions share one identity. Each of
the remaining four functions has its own distinct identity, giving exactly
five equality classes. There are no calls.

```asm
ldr r1, <type-identity>
mov r2, #0
stm r0, {r1, r2}
bx lr
```

## Two-tag table tail dispatcher

These ARM-state functions are 48 bytes and identical over their bodies:

- `func_0030E398`
- `func_0030F074`

Entry `r0` points to an object-pointer slot. Dereference it once and retain the
object in `r0`. Load a named two-entry dispatch table and inspect the object's
word at offset 0. For the high-bit tag, tail-dispatch with `bx` through table
slot 0. For the next-highest-bit tag, tail-dispatch through slot 1. Every other
tag returns directly. The original caller's `lr` is preserved for either
handler.

The first function's slots are `func_002F81EC` and `func_0031001C`. The second
function's slots are the named ARM identity
`dispatch_high_bit_func_0030F074` and `func_00311648`. One dispatch-table
pointer literal follows each body at relative offset 48; its load begins at
body offset 4. The two table identities are distinct. There are no direct
calls.

```asm
ldr r0, [r0]
ldr r1, <dispatch-table>
ldr r2, [r0]
cmp r2, #0x80000000
beq .Lfirst
cmp r2, #0x40000000
bne .Lreturn
ldr r1, [r1, #4]
bx r1
.Lfirst:
ldr r1, [r1]
bx r1
.Lreturn:
bx lr
```

## Tagged relative-entry lookup

These ARM-state functions are 48 bytes and identical over their bodies:

- `func_004BF560`
- `func_004BF594`

The table base is in `r0` and an unsigned index is in `r1`. Word offset 0 is
the entry count. Load the function's named unsigned-halfword tag even when the
index is out of range. If `index >= count`, return null. Otherwise address the
entry as `base + index * 8`, compare its halfword at entry offset 4 with the
tag, and return null on mismatch. On a match, load the relative word at entry
offset 8, add it to the table base, and return the resulting pointer. Preserve
the conditional load/add and their shared equality branch.

One tag literal follows each body at relative offset 48; its load begins at
body offset 8. The two tag identities are distinct. There are no calls.

```asm
ldr r2, [r0]
cmp r2, r1
ldr r2, <entry-tag>
bls .Lfail
add r1, r0, r1, lsl #3
ldrh r3, [r1, #4]
cmp r3, r2
ldreq r1, [r1, #8]
addeq r0, r0, r1
beq .Lreturn
.Lfail:
mov r0, #0
.Lreturn:
bx lr
```

## Bounded halfword-span export

These ARM-state functions are 44 bytes and identical over their bodies:

- `func_004A9E30`
- `func_004A9EB4`

The source span is in `r0` with begin and end pointers at offsets 0 and 4; the
two-word output record is in `r1`. Compute `(end - begin) >> 1` with arithmetic
shift and compare the resulting unsigned value with 256. When the value is at
most 256, store the halfword count and begin pointer to output offsets 0 and 4
and return zero. When it is greater, do not write the output and return the
function's named error identity. Preserve the conditional stores and loads.

One error-identity literal follows each body at relative offset 44; its
conditional load begins at body offset 28. The two error identities are
distinct. There are no calls.

```asm
ldr r2, [r0, #4]
ldr r3, [r0]
sub r2, r2, r3
asr r2, r2, #1
cmp r2, #256
strls r2, [r1]
ldrls r0, [r0]
ldrhi r0, <error-identity>
strls r0, [r1, #4]
movls r0, #0
bx lr
```

## Two-word zero initializer using paired store

These ARM-state functions are 16 bytes and identical:

- `func_00139404`
- `func_0017357C`
- `func_0040ECE8`
- `func_00410850`
- `func_0041090C`

The writable object is in `r0` and remains the return value. Materialize zero
in `r1`, copy it to `r2`, and clear offsets 0 and 4 with one two-register
store. There are no calls or literal slots.

```asm
mov r1, #0
mov r2, r1
stm r0, {r1, r2}
bx lr
```

## Packed two-axis offset calculation

These ARM-state functions are 40 bytes and identical:

- `func_00328E24`
- `func_004BE73C`

The input object is in `r0`. Read the base word at offset 52 and packed selector
word at offset 44. Extract selector bits 0-1 into a contribution scaled by 32,
extract bits 2-3 into a contribution scaled by 20, add both contributions to
the base, and return the result. Preserve the shift-based extraction and the
two multiply-by-five constructions; do not replace them with generic bitfield
or multiply instructions. There are no calls or literal slots.

```asm
ldr r1, [r0, #52]
ldr r0, [r0, #44]
lsl r3, r0, #28
lsl r2, r0, #30
lsr r0, r3, #30
lsr r2, r2, #25
add r0, r0, r0, lsl #2
add r0, r2, r0, lsl #2
add r0, r0, r1
bx lr
```

## Independent full-body probe result

The six semantic templates above were independently assembled as ARM state.
Every listed function's complete declared body was compared byte for byte with
the corresponding assembled body. Post-body values were excluded from body
comparison and audited separately by physical slot and equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Typed two-word initializer | 6 | 16 | 96 | 6/6 exact |
| Two-tag table tail dispatcher | 2 | 48 | 96 | 2/2 exact |
| Tagged relative-entry lookup | 2 | 48 | 96 | 2/2 exact |
| Bounded halfword-span export | 2 | 44 | 88 | 2/2 exact |
| Paired-store zero initializer | 5 | 16 | 80 | 5/5 exact |
| Packed two-axis offset | 2 | 40 | 80 | 2/2 exact |
| **Total** | **19** |  | **536** | **19/19 exact** |

Implementation must preserve ARM state, instruction order, condition codes,
conditional operations, paired stores, `bx` tail-dispatch ABI, and post-body
literal placement. Type, table, tag, handler, and error identities must remain
named symbols or semantic constants; do not encode target values in source.
