# Probe-verified ARM wrappers 06

## Provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the evidence-gated function inventory produced by Ghidra 12.0.2
  and local control-flow/data-flow analysis of the private target.
- Probe toolchain: GCC Arm Embedded 15.2.Rel1 with the repository's current
  ARM build flags, followed by objdiff-cli 3.8.2.
- This document contains behavior and neutral interface facts only. It does
  not reproduce target bytes, instruction listings, assets, or proprietary
  source.

All offsets below are byte offsets. Loads use the platform's little-endian
natural representation. Helper results must point to storage valid for the
specified access.

## External helper interface

The helper name is an address-based interoperability label. Its internal
behavior is outside this specification.

```c
void *func_004D83F4(void *object, uint32_t selector);
```

Each wrapper calls the helper exactly once with selector zero and preserves
the helper's normal externally observable side effects. The load and result
transformation occur only after the helper returns.

## Wrapper behavior

| Function | Mode | Size | Behavioral signature and ordered effects |
| --- | --- | ---: | --- |
| `func_004D86AC` | ARM | 28 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, load the `u16` at returned-pointer offset 30, and return source bits 7 through 13 as an unsigned seven-bit value. |
| `func_004D8860` | ARM | 28 | `uint32_t (void *object)`: call `func_004D83F4(object, 0)`, load the `u32` at returned-pointer offset 40, and return source bits 4 through 10 as an unsigned seven-bit value. |

## Portable source-shape constraint

Although masking a right-shifted value is behaviorally equivalent, GCC emits
a different instruction selection for that spelling. To reproduce the
probe-verified target shape, first hold the loaded value in a `uint32_t`, then
express each extraction as two unsigned shifts:

```c
/* func_004D86AC, after the helper call and u16 load */
return (value << 18) >> 25;

/* func_004D8860, after the helper call and u32 load */
return (value << 21) >> 25;
```

The intermediate must remain unsigned and 32 bits wide. Spelling these as
`(value >> 7) & 0x7f` or `(value >> 4) & 0x7f` is behaviorally correct but is
not an exact code-generation match with the current GCC probe toolchain.

## Probe result

Both wrappers were independently expressed as portable freestanding C using
fixed-width integer types, the two-shift source shape above, and an `extern`
declaration for the helper. GCC emitted the exact target instruction sequence
and exact 28-byte size for each wrapper. In an isolated relocatable probe,
objdiff reports 99.28571% because the probe call is represented by an
unresolved `R_ARM_CALL` relocation while the generated private target object
retains its already-resolved branch destination. Every emitted instruction
other than that representational call operand is identical, and the
relocation names the required target helper.

A later repository build using mask-after-right-shift source reported
90.57143% for each wrapper. Comparing that base object with this original
probe confirmed two genuine instruction-selection differences in each
function in addition to the call-relocation representation. The two-shift
constraint above is therefore required for acceptance; the masked-right-shift
variant is explicitly not probe verified.

Combined matched code size under the repository's established external-call
acceptance convention is 56 bytes. No source implementation is included in
this analysis document.
