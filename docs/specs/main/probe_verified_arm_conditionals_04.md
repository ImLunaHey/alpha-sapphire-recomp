# Probe-verified ARM conditionals and nullable accessors, batch 4

## Provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the repository's evidence-gated function inventory and private
  local control-flow/data-flow analysis of the target executable.
- Probe toolchain: GCC Arm Embedded 15.2.Rel1, using the repository's current
  ARMv6K ARM-mode build flags.
- Validation: every function below was compiled as portable freestanding C and
  its complete generated code was compared with the corresponding target
  function. Every comparison was exact.

This document contains behavior and neutral interface facts only. It does not
contain target bytes, instruction listings, proprietary symbols, assets, or SDK
material.

All offsets are byte offsets. All pointer fields are 32-bit target pointers.
Unsigned 16-bit and 32-bit reads use the target's natural little-endian
representation and are naturally aligned. Functions have no side effects
unless a store is explicitly described.

## Nullable field accessors

Each function in this table reads one pointer field from its input object. A
null field produces the stated fallback. A non-null field produces exactly the
stated load from the pointed-to object.

| Function | Mode | Size | Pointer field | Non-null result | Null result |
| --- | --- | ---: | ---: | --- | --- |
| `func_001233B4` | ARM | 16 | `base + 16` | unsigned byte at pointed-to offset 0 | 0 |
| `func_001233C4` | ARM | 16 | `base + 16` | pointer-sized value at pointed-to offset 12 | null |
| `func_00150034` | ARM | 16 | `base + 312` | pointer-sized value at pointed-to offset 120 | null |
| `func_00152B74` | ARM | 16 | `base + 8` | pointer-sized value at pointed-to offset 0 | null |
| `func_0016AD50` | ARM | 16 | `base + 8` | unsigned 16-bit value at pointed-to offset 10 | 0 |
| `func_004B1EC0` | ARM | 16 | `base + 4` | pointer-sized value at pointed-to offset 8 | null |
| `func_004B1ED0` | ARM | 16 | `base + 4` | unsigned byte at pointed-to offset 5 | 0 |
| `func_004BCA88` | ARM | 16 | `base + 12` | unsigned 16-bit value at pointed-to offset 12 | 0 |

The implementation should retain a single local pointer value and use a
conditional expression or equivalent single conditional load. Do not perform
any read through a null pointer.

## Nullable object reads with an all-ones fallback

These five functions accept a pointer directly rather than reading an embedded
pointer field. If the argument is null, return `UINT32_MAX`. Otherwise return
the unsigned 32-bit value at the listed byte offset.

| Function | Mode | Size | Non-null read offset |
| --- | --- | ---: | ---: |
| `func_001D0058` | ARM | 16 | 8 |
| `func_001D0068` | ARM | 16 | 0 |
| `func_001D0090` | ARM | 16 | 12 |
| `func_001D00A0` | ARM | 16 | 20 |
| `func_001D00B0` | ARM | 16 | 4 |

Each return type is `uint32_t`. The fallback must therefore be expressed as an
unsigned all-ones value, not as an implementation-defined pointer sentinel.

## Conditional relationship update

- `func_0013A144(first, second)` — ARM, 16 bytes, returns no value. If `second`
  is null, do nothing. Otherwise, in this order, store `first` as the 32-bit
  pointer field at `second + 444`, then store `second` as the 32-bit pointer
  field at `first + 64`. The first argument is assumed valid whenever `second`
  is non-null.

## Signed-state predicate

- `func_001524C8(value_pointer)` — ARM, 16 bytes. Read one signed 32-bit value
  from `value_pointer`. Return unsigned one when that value is nonnegative and
  unsigned zero when it is negative. The probe that matches exactly preserves
  the arithmetic source shape `(value >> 31) + 1`, with `value` typed
  `int32_t`, and converts the result to `uint32_t`. This relies on the target
  compiler's arithmetic right shift for signed negative values, which is also
  the repository toolchain's behavior.

## Selector-gated pointer fields

- `func_004C7F08(base, selector)` — ARM, 16 bytes. If unsigned 32-bit
  `selector` is zero, return the pointer-sized field at `base + 48`; otherwise
  return null.
- `func_004C7F18(base, selector)` — ARM, 16 bytes. If unsigned 32-bit
  `selector` is zero, return the pointer-sized field at `base + 52`; otherwise
  return null.

Neither function dereferences the returned pointer.

## Acceptance criteria

- Implement all 17 named routines in portable C with `<stdint.h>` fixed-width
  types and byte-addressed offset calculations.
- Compile the file as ARM code using the repository's current ARMv6K settings.
- Preserve each load width, signed interpretation, null fallback, and stated
  store order.
- Preserve the documented arithmetic expression for `func_001524C8`.
- Do not add inline assembly, embedded target bytes, proprietary names, or SDK
  declarations.
- Validate every function independently with objdiff; the expected aggregate
  exact-match contribution is 17 functions and 272 code bytes.
