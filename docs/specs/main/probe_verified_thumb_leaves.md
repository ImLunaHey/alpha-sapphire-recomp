# Probe-verified Thumb leaves

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: direct-call targets in the privately held executable, independently inspected with Ghidra 12.0.2
- Validation: temporary portable-C probes compiled with GCC 15 for ARMv6K Thumb mode produced the same instruction sequences

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

## Pointer indexing

`func_00101CD0` and `func_0030390C` each accept an object whose first field is a pointer to unsigned 32-bit elements, plus an unsigned 32-bit index. Each returns that pointer advanced by the index and performs no write.

## Signed-key minimum selection

`func_00304E9C` and `func_00305406` each accept two object pointers. Each object’s first field is a signed 32-bit key. The routine returns the second object only when its key is strictly less than the first object’s key; ties retain the first object. The routine performs no write.

## Acceptance criteria

- Implement all four named routines in portable C with explicit fixed-width integer types and minimal local structure definitions.
- Do not use inline assembly, embedded target bytes, proprietary names, or SDK declarations.
- Compile as Thumb code for ARMv6K with optimization enabled and validate every routine independently with objdiff.
