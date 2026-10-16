# Probe-verified duplicate ARM templates 24

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body grouping, and independent GNU Arm assembly probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private numeric
  addresses, implementation source, or proprietary source.

Every function exact in the current report and every function named by an
earlier or concurrently staged specification/manifest was excluded before
grouping. This bounded batch contains 18 complete-body groups: exactly 42
ARM-state functions and 640 code bytes. None of these bodies makes a call or
has a post-body literal/relocation slot, so there are no literal equality
classes to preserve.

## Relative-word pointer at offset 16

These ARM-state functions are 12 bytes and identical:

- `func_001769CC`
- `func_00176A00`
- `func_004BFB50`
- `func_004BFB5C`

Treat `r0` as a record base. Load the word at offset 16, add it to the base,
and return the resulting pointer in `r0`.

```asm
ldr r1, [r0, #16]
add r0, r0, r1
bx lr
```

## Relative-word pointer at offset 4

These ARM-state functions are 12 bytes and identical:

- `func_0016B050`
- `func_00176C7C`
- `func_004BEE74`

```asm
ldr r1, [r0, #4]
add r0, r0, r1
bx lr
```

## Relative-word pointer at offset 12

These ARM-state functions are 12 bytes and identical:

- `func_0017CFB4`
- `func_004C1F50`
- `func_004C22D8`

```asm
ldr r1, [r0, #12]
add r0, r0, r1
bx lr
```

## Low-two-bit field update

These ARM-state functions are 24 bytes and identical:

- `func_004108BC`
- `func_00462B9C`

Replace only the low two bits of the word at record offset 4 with the low two
bits of `r1`. Preserve the exact source/destination register schedule.

```asm
ldr r2, [r0, #4]
and r1, r1, #3
bic r2, r2, #3
orr r1, r1, r2
str r1, [r0, #4]
bx lr
```

## Tag-4 byte payload initializer

These ARM-state functions are 24 bytes and identical:

- `func_0053FAA4`
- `func_0053FC70`

Write tag 4 as a byte at destination offset 4, write the low byte of `r2` at
offset 6, dereference the word pointer in `r1`, store that word at destination
offset 0, and return the destination in `r0`.

```asm
mov r3, #4
strb r3, [r0, #4]
strb r2, [r0, #6]
ldr r1, [r1]
str r1, [r0]
bx lr
```

## Tag-3 word payload initializer

These ARM-state functions are 24 bytes and identical:

- `func_0053FABC`
- `func_0053FC88`

Write tag 3 as a byte at destination offset 4, write `r2` as a word at offset
16, dereference the word pointer in `r1`, store that word at destination
offset 0, and return the destination in `r0`.

```asm
mov r3, #3
strb r3, [r0, #4]
str r2, [r0, #16]
ldr r1, [r1]
str r1, [r0]
bx lr
```

## Tag-2 halfword payload initializer

These ARM-state functions are 24 bytes and identical:

- `func_0053FAD4`
- `func_0053FCA0`

Write tag 2 as a byte at destination offset 4, write the low halfword of `r2`
at offset 6, dereference the word pointer in `r1`, store that word at
destination offset 0, and return the destination in `r0`.

```asm
mov r3, #2
strb r3, [r0, #4]
strh r2, [r0, #6]
ldr r1, [r1]
str r1, [r0]
bx lr
```

## Three-word clear at offsets 56 through 64

These ARM-state functions are 20 bytes and identical:

- `func_0014AE44`
- `func_00331294`

Materialize zero once, then clear words at offsets 56, 60, and 64 in physical
order. Return the original `r0`.

```asm
mov r1, #0
str r1, [r0, #56]
str r1, [r0, #60]
str r1, [r0, #64]
bx lr
```

## Three-word clear at offsets 0 through 8

These ARM-state functions are 20 bytes and identical:

- `func_002B81F0`
- `func_004F2C0C`

```asm
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
str r1, [r0, #8]
bx lr
```

## Explicit no-op return

These ARM-state functions are 8 bytes and identical:

- `func_002AEAE8`
- `func_002C8878`
- `func_003388E8`
- `func_00339B44`

Preserve the explicit self-move rather than omitting it.

```asm
mov r0, r0
bx lr
```

## Normalize word-at-4 presence to Boolean

These ARM-state functions are 16 bytes and identical:

- `func_0013E6F4`
- `func_0016BC74`

Load the word at offset 4 into the return register. Leave zero unchanged; if
it is nonzero, replace it with one. Preserve the conditional move.

```asm
ldr r0, [r0, #4]
cmp r0, #0
movne r0, #1
bx lr
```

## Word-and-halfword clear

These ARM-state functions are 16 bytes and identical:

- `func_002C2350`
- `func_004F2C30`

Clear the word at offset 0 and then the halfword at offset 4 using the same
zero in `r1`.

```asm
mov r1, #0
str r1, [r0]
strh r1, [r0, #4]
bx lr
```

## Nested halfword clear with advanced return pointer

These ARM-state functions are 16 bytes and identical:

- `func_003E80E8`
- `func_003E8290`

Advance `r0` by 288, clear the halfword eight bytes beyond that adjusted
pointer, and return the adjusted pointer (not the original base).

```asm
add r0, r0, #288
mov r1, #0
strh r1, [r0, #8]
bx lr
```

## Invalid-word initializer at offset 28

These ARM-state functions are 12 bytes and identical:

- `func_0015E42C`
- `func_0015E468`

Materialize all-ones in `r1`, store it at word offset 28, and return the
original `r0`.

```asm
mvn r1, #0
str r1, [r0, #28]
bx lr
```

## Two-word integer copy

These ARM-state functions are 12 bytes and identical:

- `func_0017358C`
- `func_002ADE84`

Load two words from the source pointer originally supplied in `r1` into
`r1-r2`, then store both words to the destination in `r0`. Preserve the
paired load/store forms and ascending register lists.

```asm
ldm r1, {r1, r2}
stm r0, {r1, r2}
bx lr
```

## Clear word at offset 8

These ARM-state functions are 12 bytes and identical:

- `func_002F9224`
- `func_0041B3CC`

```asm
mov r1, #0
str r1, [r0, #8]
bx lr
```

## Four-single VFP copy

These ARM-state functions are 12 bytes and identical:

- `func_003CC4C4`
- `func_003CC4D0`

Copy four consecutive single-precision register-width words (16 bytes total)
from the address in `r1` to the address in `r0` via `s0-s3`. Do not replace
the VFP multi-load/store pair with integer operations.

```asm
vldmia r1, {s0-s3}
vstmia r0, {s0-s3}
bx lr
```

## Two-word store at nested offset 40

These ARM-state functions are 12 bytes and identical:

- `func_00410A3C`
- `func_00438BEC`

Advance `r0` by 40, store `r1-r2` there with one paired store, and return the
adjusted pointer.

```asm
add r0, r0, #40
stm r0, {r1, r2}
bx lr
```

## Independent full-body probe result

Each literal mnemonic schedule above was independently assembled in ARM state.
The assembled representative was compared byte-for-byte with its complete
declared target body, and every other member was independently confirmed to
have the same complete body as that representative.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Relative word at 16 | 4 | 12 | 48 | 4/4 exact |
| Relative word at 4 | 3 | 12 | 36 | 3/3 exact |
| Relative word at 12 | 3 | 12 | 36 | 3/3 exact |
| Low-two-bit update | 2 | 24 | 48 | 2/2 exact |
| Tag-4 byte payload | 2 | 24 | 48 | 2/2 exact |
| Tag-3 word payload | 2 | 24 | 48 | 2/2 exact |
| Tag-2 halfword payload | 2 | 24 | 48 | 2/2 exact |
| Three-word clear at 56 | 2 | 20 | 40 | 2/2 exact |
| Three-word clear at 0 | 2 | 20 | 40 | 2/2 exact |
| Explicit no-op return | 4 | 8 | 32 | 4/4 exact |
| Word-at-4 Boolean | 2 | 16 | 32 | 2/2 exact |
| Word-and-halfword clear | 2 | 16 | 32 | 2/2 exact |
| Nested halfword clear | 2 | 16 | 32 | 2/2 exact |
| Invalid word at 28 | 2 | 12 | 24 | 2/2 exact |
| Two-word integer copy | 2 | 12 | 24 | 2/2 exact |
| Clear word at 8 | 2 | 12 | 24 | 2/2 exact |
| Four-single VFP copy | 2 | 12 | 24 | 2/2 exact |
| Nested two-word store | 2 | 12 | 24 | 2/2 exact |
| **Total** | **42** |  | **640** | **42/42 exact** |

Implementation must preserve ARM state, every mnemonic and register choice,
condition code, immediate and field offset, store width/order, explicit
self-move, paired transfer form, VFP register range, and whether `r0` remains
the original base or becomes an adjusted return pointer. There are no calls,
literal pools, or relocations in this batch.
