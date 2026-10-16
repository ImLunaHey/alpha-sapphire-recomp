# Probe-verified duplicate ARM templates 23

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function and symbol inventories
  plus private target complete-body grouping, control-flow, data-flow, and
  physical post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function already exact in the current report and every function named by
an earlier or current specification/manifest was excluded before grouping.
This bounded batch contains six complete-body groups: exactly 24 ARM-state
functions and 424 code bytes.

## Single type-identity installer

These ARM-state functions are 12 bytes and identical over their complete
bodies:

- `func_0010ACEC`
- `func_00163B70`
- `func_00163C20`
- `func_001666DC`
- `func_00203888`
- `func_0024FB08`
- `func_00250468`
- `func_0026D5D4`
- `func_002AEF8C`
- `func_0032ADB0`
- `func_003312BC`
- `func_0042D510`

The object is in `r0` and remains the return value. Load the function's named
type identity, store it at object offset 0, and return. One identity literal
follows each body at relative offset 12; its load begins at body offset 0. All
12 identities are distinct, giving 12 equality classes. There are no calls.

```asm
ldr r1, <type-identity>
str r1, [r0]
bx lr
```

## Typed four-word clear initializer

These ARM-state functions are 32 bytes and identical:

- `func_002C69FC`
- `func_002C8850`

The object is in `r0` and remains the return value. Clear word offset 4, load
the function's named type identity, clear word offsets 8, 12, and 16 in that
order, install the type identity at offset 0, and return. Preserve the literal
load between the first and remaining clears.

One type-identity literal follows each body at relative offset 32; its load
begins at body offset 8. The two identities are distinct. There are no calls.

```asm
mov r1, #0
str r1, [r0, #4]
ldr r2, <type-identity>
str r1, [r0, #8]
str r1, [r0, #12]
str r1, [r0, #16]
str r2, [r0]
bx lr
```

## Typed zero/invalid pair initializer

These ARM-state functions are 32 bytes and identical:

- `func_00375814`
- `func_0037A0DC`

The object is in `r0` and remains the return value. Form `object + 4` in `r3`,
materialize zero in `r1` and all-ones in `r2`, and store them together at
object offsets 4 and 8. Load the function's named type identity, clear word
offset 12, install the identity at offset 0, and return.

One type-identity literal follows each body at relative offset 32; its load
begins at body offset 16. The two identities are distinct. There are no calls.

```asm
add r3, r0, #4
mov r1, #0
mvn r2, #0
stm r3, {r1, r2}
ldr r2, <type-identity>
str r1, [r0, #12]
str r2, [r0]
bx lr
```

## Tagged relative pointer resolver

These ARM-state functions are 28 bytes and identical:

- `func_004BF8F4`
- `func_004BFAB4`

The record base is in `r0`. Read the unsigned halfword tag at offset 4. Through
the exact two-subtraction sequence, test whether the tag equals 257. On a
match, conditionally load the relative word at offset 8 and return
`record + relative_word`. On a mismatch, return null. Preserve the flag-setting
second subtraction and conditional load/move/add schedule. There are no calls
or literal slots.

```asm
ldrh r1, [r0, #4]
sub r2, r1, #256
subs r2, r2, #1
ldreq r1, [r0, #8]
movne r0, #0
addeq r0, r0, r1
bx lr
```

## Single-word zero initializer

These ARM-state functions are 12 bytes and identical:

- `func_0011EB78`
- `func_00279DD0`
- `func_00370764`
- `func_00417610`

The writable word is addressed by `r0`, which remains the return value.
Materialize zero in `r1`, store it at offset 0, and return. There are no calls
or literal slots.

```asm
mov r1, #0
str r1, [r0]
bx lr
```

## Three-word and trailing-byte zero initializer

These ARM-state functions are 24 bytes and identical:

- `func_00134384`
- `func_002013A4`

The writable record is in `r0` and remains the return value. Materialize zero
once, clear words at offsets 0, 4, and 8 in physical order, then clear the byte
at offset 12. There are no calls or literal slots.

```asm
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
str r1, [r0, #8]
strb r1, [r0, #12]
bx lr
```

## Independent full-body probe result

The six literal mnemonic templates above were independently assembled as ARM
state. Every listed function's complete declared body was compared byte for
byte with the corresponding assembled body. Post-body identity values were
excluded from body comparison and audited separately by physical slot and
equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Single type-identity installer | 12 | 12 | 144 | 12/12 exact |
| Typed four-word clear initializer | 2 | 32 | 64 | 2/2 exact |
| Typed zero/invalid pair initializer | 2 | 32 | 64 | 2/2 exact |
| Tagged relative pointer resolver | 2 | 28 | 56 | 2/2 exact |
| Single-word zero initializer | 4 | 12 | 48 | 4/4 exact |
| Three-word/trailing-byte clear | 2 | 24 | 48 | 2/2 exact |
| **Total** | **24** |  | **424** | **24/24 exact** |

Implementation must preserve ARM state, literal mnemonic and register
schedules, store order and widths, paired stores, condition flags, conditional
operations, and post-body literal placement. All type identities must remain
named symbols; do not encode target values in source.
