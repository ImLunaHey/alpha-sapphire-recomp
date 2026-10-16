# Probe-verified duplicate ARM templates 22

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function and symbol inventories
  plus private target complete-body grouping, control-flow, data-flow,
  call-resolution, and physical post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function already exact in the current report and every function named by
an earlier or current specification/manifest was excluded before grouping.
This bounded batch contains six complete-body groups: exactly 15 ARM-state
functions and 432 code bytes.

## Embedded invalid/zero pair initializer

These ARM-state functions are 20 bytes and identical over their complete
bodies:

- `func_00375800`
- `func_0037A0C8`
- `func_00381CA8`
- `func_00382930`

The outer object is in `r0`. Advance `r0` to the embedded pair at offset 8,
materialize all-ones and zero, and store them to embedded offsets 0 and 4 with
one paired store. Return with `r0` still equal to `outer + 8`. There are no
calls or literal slots.

```asm
add r0, r0, #8
mvn r1, #0
mov r2, #0
stm r0, {r1, r2}
bx lr
```

## Four-word zero initializer

These ARM-state functions are 24 bytes and identical:

- `func_00174A74`
- `func_0023C524`
- `func_003345F4`

The writable 16-byte record is in `r0` and remains the return value. Materialize
zero once and store it in physical order at offsets 0, 4, 8, and 12. There are
no calls or literal slots.

```asm
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
str r1, [r0, #8]
str r1, [r0, #12]
bx lr
```

## Cursor word read with optional advance

These ARM-state functions are 36 bytes and identical:

- `func_003C4BA4`
- `func_003C4BC8`

The cursor owner is in `r0`, an output-word pointer is in `r1`, and an advance
flag is in `r2`. Compare the flag with zero before reusing `r2`. Load the cursor
from owner offset 12, copy the word at that cursor to the output pointer, and
return immediately when the original flag was zero. Otherwise reload the
cursor from owner offset 12, add four, and write it back. The owner remains in
`r0`. There are no calls or literal slots.

```asm
cmp r2, #0
ldr r2, [r0, #12]
ldr r2, [r2]
str r2, [r1]
beq .Lreturn
ldr r1, [r0, #12]
add r1, r1, #4
str r1, [r0, #12]
.Lreturn:
bx lr
```

## Indexed packed-nibble lookup

These ARM-state functions are 36 bytes and identical:

- `func_004CDC18`
- `func_004CDC3C`

The owner is in `r0` and an unsigned index is in `r1`. Load a table base from
owner offset 108. Form the byte offset `240 + 372 * index` through the exact
`31 * index`, then `3 *`, then `4 *` add/shift sequence shown below. Load the
word at that table offset and return its bits 20 through 23 as an unsigned
four-bit value. There are no calls or literal slots.

```asm
rsb r2, r1, r1, lsl #5
ldr r0, [r0, #108]
add r2, r2, r2, lsl #1
mov r1, #240
add r1, r1, r2, lsl #2
ldr r0, [r0, r1]
lsl r0, r0, #8
lsr r0, r0, #28
bx lr
```

## Enabled empty circular-list initializer

These ARM-state functions are 36 bytes and identical:

- `func_0053FAEC`
- `func_0053FCB8`

The writable object is in `r0` and remains the return value. Clear word offset
0, store byte value one at offset 4, and form the embedded sentinel address
`object + 8`. Store that sentinel address to offsets 8 and 12, then clear word
offset 16. Preserve the physical store order shown below. There are no calls
or literal slots.

```asm
mov r2, #0
mov r1, #1
str r2, [r0]
strb r1, [r0, #4]
add r1, r0, #8
str r1, [r0, #8]
str r2, [r0, #16]
str r1, [r0, #12]
bx lr
```

## Member-presence identity selector

These ARM-state functions are 32 bytes and share one parameterized template:

| Function | ARM helper called at body offset 12 |
| --- | --- |
| `func_001D0F88` | `func_001C5008` |
| `func_001D1018` | `func_001C5098` |

The input object is in `r0`. Load its member at offset 4 and call the listed
ARM helper with that member in `r0`. If the helper returns zero, return zero.
If it returns nonzero, return the named presence identity from the literal
slot. Preserve `r4` as the zero/default accumulator and the conditional
literal load.

One presence-identity literal follows each body at relative offset 32; its
conditional load begins at body offset 20. The identity is equal in both
functions, forming one equality class. Both calls are direct ARM-to-ARM calls.

```asm
push {r4, lr}
ldr r0, [r0, #4]
mov r4, #0
bl <member-presence-helper>
cmp r0, #0
ldrne r4, <presence-identity>
mov r0, r4
pop {r4, pc}
```

## Independent full-body probe result

The six semantic templates above were independently assembled as ARM state.
Every listed function's complete declared body was compared byte for byte with
the corresponding assembled or target-linked body. The selector probes were
linked independently against their named helpers. Post-body values were
excluded from body comparison and audited separately by physical slot and
equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Embedded invalid/zero pair initializer | 4 | 20 | 80 | 4/4 exact |
| Four-word zero initializer | 3 | 24 | 72 | 3/3 exact |
| Cursor word read with optional advance | 2 | 36 | 72 | 2/2 exact |
| Indexed packed-nibble lookup | 2 | 36 | 72 | 2/2 exact |
| Enabled empty circular-list initializer | 2 | 36 | 72 | 2/2 exact |
| Member-presence identity selector | 2 | 32 | 64 | 2/2 exact |
| **Total** | **15** |  | **432** | **15/15 exact** |

Implementation must preserve ARM state, instruction and store order, paired
stores, condition flags carried across the cursor loads, exact shift/add
arithmetic, direct-call identities/modes, conditional literal loading, and the
post-body presence slot. Identities must remain named symbols or semantic
constants; do not encode target values in source.
