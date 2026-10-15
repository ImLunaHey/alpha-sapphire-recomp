# Probe-verified ARM leaves

## Provenance

- Target: `AS_EUR_REV2`
- Analyst observation date: 2026-10-15
- Evidence: direct-call targets in the privately held executable, independently inspected with Ghidra 12.0.2
- Validation: temporary portable-C probes compiled with GCC 15 for ARMv6K ARM mode produced the same instruction sequences

No disassembly, target bytes, proprietary symbols, or SDK material are included in this specification.

## Byte stores

Each function accepts a writable byte-addressed base pointer followed by the listed unsigned 32-bit values. Only the low byte of a value is stored where the operation says “byte.”

- `func_00332E4C(base, value)`: store byte `value` at offset 131.
- `func_00332E54(base, value)`: store byte `value` at offset 244.
- `func_0033303C(base, value)`: store byte `value` at offset 240.
- `func_003DB988(base, value)`: store byte `value` at offset 28.
- `func_003A65C4(base, first, second)`: store byte `first` at offset 35 and byte `second` at offset 42.
- `func_003A6544(base, first, second)`: store byte `first` at offsets 35 and 43, then byte `second` at offsets 42 and 44.
- `func_0032E8EC(base, first, second)`: store 32-bit `second` at offset 80, then byte `first` at offset 153.

These functions return no value and have no other observable side effect.

## Pure value operations

- `func_003D424C(value)`: return 1 when the unsigned 32-bit input is zero, otherwise return 2.
- `func_00410C88(value)`: return `(value + 7) & ~3u` using modulo-2^32 unsigned arithmetic.
- `func_0042F338(value)`: return `(value >> 2) * 3` using unsigned arithmetic.
- `func_0013E9B8(base)`: load the 32-bit word at offset 4 and return it minus one.

## Stores returning zero

- `func_001C4C88(base, value)`: store the 32-bit value at offset 120 and return zero.
- `func_001CA310(base, value)`: store the 32-bit value at offset 4 and return zero.
- `func_002C7810(base, value)`: store the low byte at offset 7 and return zero.
- `func_00506104(base, value)`: store the 32-bit value at offset 84 and return zero.

## Indexed and masked loads

- `func_0034679C(base, index)`: return the 32-bit word at `base + index * 8 + 4`.
- `func_004BE900(base, index)`: return the 32-bit word at `base + index * 16 + 8`.
- `func_004E5EBC(base)`, `func_004EA098(base)`: return the 32-bit word at offset 4 masked with 3.
- `func_004E5EC8(base)`: return the 32-bit word at offset 0 shifted right by 18.
- `func_004E68EC(base)`: return the 32-bit word at offset 40 masked with 1.
- `func_004E7100(base)`: return the 32-bit word at offset 92 masked with 1.
- `func_004E8D4C(base)`: return the 32-bit word at offset 4 masked with 1.
- `func_004EAD34(base)`: return the byte at offset 230 masked with 1.
- `func_004EDAD4(base)`: return the 32-bit word at offset 8 shifted right by 1.
- `func_004E897C(base, index)`: return the byte at `base + index + 70`.
- `func_004E8988(base, index)`: return the byte at `base + index + 80`.
- `func_004E8994(base, index)`: return the byte at `base + index + 90`.
- `func_004E89A0(base, index)`: return the byte at `base + index + 97`.
- `func_004B287C(base)`: return the unsigned 16-bit value at offset 1024.

## Word stores and adjusted pointers

- `func_0042D8F4(base, value)`: store the 32-bit value at offset 21172.
- `func_00434200(base, value)`: store the 32-bit value at offset 4992.
- `func_0045AD9C(base, value)`: store `value + 812` as a 32-bit word at offset 0.
- `func_00462A10(base, value)`: store `value + 108` as a 32-bit word at offset 0.

These functions return no value and have no other observable side effect.

## Acceptance criteria

- Implement all 34 named routines in portable C with explicit fixed-width integer types.
- Use byte-addressed pointer contracts so the stated offsets are unambiguous.
- Do not use inline assembly, embedded target bytes, proprietary names, or SDK declarations.
- Compile as ARM code for ARMv6K with optimization enabled and validate every routine independently with objdiff.
