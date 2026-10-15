# Probe-verified ARM call wrappers

## Provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the evidence-gated function inventory produced by Ghidra 12.0.2
  and local control-flow/data-flow analysis of the private target.
- Probe toolchain: GCC Arm Embedded 15.2.Rel1 with the repository's current
  ARM build flags, followed by objdiff-cli 3.8.2.
- This document records behavior and neutral interface facts only. It does not
  reproduce target bytes, instruction listings, assets, or proprietary source.

All offsets below are byte offsets. A `u16` or `u32` load/store uses the
platform's little-endian natural representation. The pointed-to objects and
helper results must be valid for every access described below; only the one
explicit nullable-result wrapper performs a null check.

## External helper interfaces

The helper names are address-based interoperability labels. Their internal
behavior is outside this specification.

```c
void      func_00300B28(void *subobject);
int32_t   func_003672B8(void *object);
void     *func_004A9658(void *object);
int32_t   func_004D1330(void *context);
uint32_t  func_004D1DD8(void *context);
uint32_t  func_004D244C(void *context);
void     *func_004D83F4(void *object, uint32_t selector);
```

Calls to these helpers retain their normal externally observable side effects.
Where a wrapper performs a memory access after a call, that access occurs after
the helper returns.

## Wrapper behavior

| Function | Mode | Size | Behavioral signature and ordered effects |
| --- | --- | ---: | --- |
| `func_00438BF8` | ARM | 28 | `void (void *object, uint32_t unused, uint32_t value)`: call `func_00300B28(object + 84)`, then store `value` as a `u32` at `object + 252`. The second argument has no observable use. |
| `func_0043DF18` | ARM | 20 | `void (void *object)`: call `func_003672B8(object)`, truncate its result to `u16`, then store it at `object + 192`. |
| `func_004A9714` | ARM | 20 | `uint32_t (void *object)`: call `func_004A9658(object)`. If the returned pointer is null, return zero; otherwise return the `u32` at returned pointer offset 4. |
| `func_004D2B68` | ARM | 24 | `int32_t (void *object)`: load the context pointer at `object + 12`, call `func_004D1330(context)`, and return one exactly when at least one of result bits 0 through 3 is set; otherwise return zero. |
| `func_004D2D44` | ARM | 20 | `uint32_t (void *object)`: load the context pointer at `object + 12`, call `func_004D1DD8(context)`, and return the helper's full result XOR 1. This toggles only bit 0 and is not a logical negation. |
| `func_004D2E90` | ARM | 20 | `uint32_t (void *object)`: load the context pointer at `object + 12`, call `func_004D244C(context)`, and return the low 16 bits of the helper result, zero-extended. |
| `func_004D83D8` | ARM | 20 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, then return the `u16` at returned pointer offset 4, zero-extended. |
| `func_004D84AC` | ARM | 24 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, then return bits 0 through 4 of the `u16` at returned pointer offset 30. |
| `func_004D86FC` | ARM | 20 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, then return the `u16` at returned pointer offset 38, zero-extended. |
| `func_004D8734` | ARM | 20 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, then return the `u16` at returned pointer offset 6, zero-extended. |
| `func_004D8780` | ARM | 24 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, then return bits 0 through 4 of the `u16` at returned pointer offset 32. |
| `func_004D8964` | ARM | 20 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, then return the `u16` at returned pointer offset 2, zero-extended. |

## Probe result

Each wrapper was independently expressed as portable freestanding C using
fixed-width integer types and an `extern` declaration for its named helper.
The probe object preserved direct calls as linker relocations. objdiff resolved
those relocations against the corresponding target helper symbols, so call
destinations were checked rather than treated as wildcard instruction bytes.

All 12 functions reported 100% individually under objdiff. Their combined
matched size is 260 code bytes. No source implementation is included in this
analysis document.
