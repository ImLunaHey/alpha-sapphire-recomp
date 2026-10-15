# Probe-verified ARM accessors, batch 2

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: direct-call targets in the privately held executable, independently inspected with GNU binutils from GCC Arm Embedded 15.2.Rel1
- Validation: temporary portable-C probes compiled with GCC 15.2.Rel1 for ARMv6K ARM mode produced the same complete instruction sequences

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

All offsets below are byte offsets. A “word” is an aligned unsigned 32-bit value unless the operation explicitly gives a different type. Pointer and unsigned arithmetic is modulo 2^32 on the target.

## Adjusted stores

- `func_00136300(base, value)` — ARM, 12 bytes. Add 8 to the unsigned 32-bit `value`, store the result as a word at `base + 60`, and return no value.
- `func_0013630C(base, value)` — ARM, 12 bytes. Add 8 to the unsigned 32-bit `value`, store the result as a word at `base + 56`, and return no value.

Neither function changes any other memory.

## Indexed accessors

- `func_002BACF8(base, index)` — ARM, 12 bytes. Return the unsigned 16-bit value at `base + index + 20`.
- `func_002BAF24(base, index)` — ARM, 12 bytes. Return the unsigned byte at `base + index + 20`.
- `func_0045A330(base, index)` — ARM, 12 bytes. Return the pointer `base + index * 16 + 4` without dereferencing it.
- `func_004E60E8(base, index)` — ARM, 12 bytes. Read a pointer-sized 32-bit address from `base + 24` and return that address plus `index * 8` without dereferencing the result.
- `func_004EA6B8(base, index)` — ARM, 12 bytes. Return the unsigned byte at `base + index + 180`.
- `func_004EA6C4(base, index)` — ARM, 12 bytes. Return the unsigned byte at `base + index + 184`.
- `func_004EA6D0(base, index)` — ARM, 12 bytes. Return the unsigned byte at `base + index + 188`.

All indices are unsigned 32-bit values. These functions have no side effects.

## Scalar transforms

- `func_004AACB4(base)` — ARM, 12 bytes. Read the word at `base + 8` and return it with its four bytes reversed.
- `func_00466270(base)` — ARM, 12 bytes. Read the word at `base + 4` and return its top three bits as an unsigned value from 0 through 7.
- `func_004E5410(base)` — ARM, 16 bytes. Read one complete word at `base + 48` and return bits 12 through 19 as an unsigned value.
- `func_004E5ED4(base)` — ARM, 16 bytes. Read one complete word at `base`, take its low 18 bits, interpret bit 17 as the sign bit, and return the sign-extended signed 32-bit result.
- `func_004E68E0(base)` — ARM, 12 bytes. Return the low five bits of the word at `base + 44`.
- `func_004E6960(base)` — ARM, 16 bytes. Read one complete word at `base + 40` and return bits 1 through 8 as an unsigned value.
- `func_004E69C4(base)` — ARM, 16 bytes. Read one complete word at `base + 44` and return bits 5 through 12 as an unsigned value.
- `func_004E7474(base)` — ARM, 16 bytes. Read one complete word at `base + 80` and return bits 16 through 19 as an unsigned value.
- `func_004E7A4C(base)` — ARM, 16 bytes. Read the unsigned byte at `base + 4` and return bits 4 and 5 as an unsigned value from 0 through 3.
- `func_004EA02C(base)` — ARM, 16 bytes. Read one complete word at `base + 52` and return bits 12 and 13 as an unsigned value.
- `func_004EA088(base)` — ARM, 16 bytes. Read one complete word at `base + 4` and return bits 13 and 14 as an unsigned value.
- `func_004EA0A4(base)` — ARM, 16 bytes. Read one complete word at `base + 4` and return bit 2 as zero or one.
- `func_004EA6DC(base)` — ARM, 12 bytes. Read one complete word at `base + 44` and return its top byte as an unsigned value.

Each function performs exactly the stated read and has no side effects. “One complete word” is significant: implementations must not narrow that memory access to a byte or halfword.

## Exact portable source shape for extracted fields

The ten 16-byte or full-word extraction routines above require their source-level operation order to remain visible to GCC. Equivalent mask-and-shift expressions do not reproduce the reference build. Use a volatile-qualified, fixed-width word read for the complete-word cases:

```c
#define READ_U32_FULL(base, offset) \
    (*(const volatile uint32_t *)((const uint8_t *)(base) + (offset)))
```

Then use these exact unsigned shift shapes directly in the return expression:

```c
func_004E5410: return (READ_U32_FULL(base, 48) << 12) >> 24;
func_004E6960: return (READ_U32_FULL(base, 40) << 23) >> 24;
func_004E69C4: return (READ_U32_FULL(base, 44) << 19) >> 24;
func_004E7474: return (READ_U32_FULL(base, 80) << 12) >> 28;
func_004EA02C: return (READ_U32_FULL(base, 52) << 18) >> 30;
func_004EA088: return (READ_U32_FULL(base, 4) << 17) >> 30;
func_004EA0A4: return (READ_U32_FULL(base, 4) << 29) >> 31;
func_004EA6DC: return READ_U32_FULL(base, 44) >> 24;
```

All eight functions return `uint32_t`. Do not rewrite a left-then-right pair as a right shift followed by a mask, and do not replace the final routine's word read with an equivalent byte read.

For `func_004E5ED4`, the return type is `int32_t`. Preserve this cast position so the final shift is signed while the left shift remains unsigned:

```c
return (int32_t)(READ_U32_FULL(base, 0) << 14) >> 14;
```

Do not implement this operation as explicit masking followed by conditional sign extension.

For `func_004E7A4C`, read exactly one `uint8_t`, explicitly widen it before shifting, and preserve the left-then-right form:

```c
return ((uint32_t)*(const uint8_t *)((const uint8_t *)base + 4) << 26) >> 30;
```

Its return type is `uint32_t`. Do not rewrite it as a right shift followed by a two-bit mask.

## Acceptance criteria

- Implement all 22 named routines in portable C with explicit fixed-width integer types.
- Use byte-addressed pointer contracts so the offsets are unambiguous.
- Preserve the stated signed interpretation, load widths, and modulo-2^32 arithmetic.
- Preserve the exact portable shift/cast shapes documented above for the ten extracted-field routines.
- Do not use inline assembly, embedded target bytes, proprietary names, or SDK declarations.
- Compile as ARM code for ARMv6K with the repository's optimization settings and validate every routine independently with objdiff.
