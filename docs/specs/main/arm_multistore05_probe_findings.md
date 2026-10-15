# ARM multi-store probe findings, batch 05

## Provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the evidence-gated function inventory and private local
  control-flow/data-flow analysis of the target executable.
- Probe toolchain: GCC Arm Embedded 15.2.Rel1 with the repository's current
  ARMv6K ARM-mode flags.

This document records behavior and neutral interface facts only. It contains
no target bytes, instruction listings, proprietary symbols, assets, or SDK
material.

All offsets are byte offsets. All unsigned 16-bit and 32-bit stores use the
target's natural little-endian representation. Pointer and unsigned arithmetic
wrap modulo 2^32 on the target.

## Behavioral findings

### Indexed pair of halfword stores

`func_00463D08` is an ARM routine of 20 bytes with this behavioral signature:

```c
void func_00463D08(
    uint8_t *base,
    uint32_t index,
    uint32_t first,
    uint32_t second);
```

It computes `base + index * 4`, truncates `first` and `second` independently to
16 bits, stores `first` at a further offset of 872, then stores `second` at a
further offset of 874. It returns no value and has no other observable effect.
The store order is significant.

### Repeated-byte stores

Both routines below accept a writable byte-addressed base followed by a
32-bit value. They use only the low byte of the input. Let `repeated` be the
32-bit value containing four copies of that byte.

- `func_004F2C40` — ARM, 24 bytes. Store `repeated` as a 32-bit word at offset
  0, then store the low byte at offset 4.
- `func_004F2C58` — ARM, 24 bytes. Store `repeated` as a 32-bit word at offset
  0, then store the same word at offset 4.

Each has the signature `void (uint8_t *base, uint32_t value)`, returns no
value, and performs no other read, write, or call.

### Small relationship update

`func_003AB384` is an ARM routine of 28 bytes with this behavioral signature:

```c
uint8_t *func_003AB384(uint8_t *base, uint8_t *value);
```

In order, it stores byte one at `base + 8`, stores the pointer-sized value
`value` at `base + 12`, stores byte zero at `base + 10`, and returns `value`.
It does not dereference `value` and has no other observable effect.

### Three-field initialization

`func_00161460` is an ARM routine of 24 bytes with this behavioral signature:

```c
void func_00161460(
    uint8_t *base,
    uint32_t value,
    const uint32_t *source);
```

In order, it stores `value` as a word at `base + 4`, reads one complete word
from `source`, stores that word at `base + 8`, and stores byte one at
`base + 12`. The pointers must be valid for the stated accesses. It returns no
value and has no other observable effect.

## Probe result

Portable freestanding C probes were compiled for every routine above. Each
probe reproduced the complete behavior and the target function's exact size,
but none was byte-identical under GCC 15.2.Rel1. The mismatches are confined to
compiler code-selection and temporary-register choices; they do not reveal an
uncertainty in the behavior stated above.

These routines are therefore **not accepted as matching implementations** and
must not be counted as matched code. Retain these specifications for an
ARMCC-family compiler experiment or a future portable source-shape search.

## Acceptance criteria for future work

- Preserve the signatures, widths, arithmetic, and effect ordering stated
  above.
- Use clean-room C without inline assembly, embedded target bytes, proprietary
  names, or SDK declarations.
- Compile each routine as ARM code and require an independent 100% objdiff
  result before adding it to the matched source set.
